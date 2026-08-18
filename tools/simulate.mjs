#!/usr/bin/env node
/**
 * Headless playthrough. Runs the same engine the web sandbox runs, with a
 * simple "feed everyone, then build, then produce" strategy, and reports what
 * the economy actually did.
 *
 * This is a balance instrument, not a test of correctness. If the report says
 * a competent opening still starves in round 4, the numbers in data/ are wrong.
 *
 * Usage:
 *   node tools/simulate.mjs                  # one game, human, 24 rounds
 *   node tools/simulate.mjs --people dwarf --rounds 16 --seed 7
 *   node tools/simulate.mjs --games 20       # aggregate over many seeds
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const arg = (name, fallback) => {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

/* Load the browser modules into a minimal global shim. */
const sandboxGlobal = { localStorage: { getItem: () => null, setItem: () => {} } };
sandboxGlobal.window = sandboxGlobal;
for (const file of ['docs/data/bundle.js', 'docs/js/ui.js', 'docs/js/framing.js', 'docs/js/data.js', 'docs/js/engine.js']) {
  const src = readFileSync(join(ROOT, file), 'utf8');
  new Function('window', 'document', 'UI', 'Engine', 'GameData',
    `with (this) { ${src} }`
  ).call(sandboxGlobal, sandboxGlobal, undefined, sandboxGlobal.UI, sandboxGlobal.Engine, sandboxGlobal.GameData);
}
const { Engine, GameData: D } = sandboxGlobal;
const R = D.rules;

/* ----------------------------------------------------------------- policy */

/** What the town wants next, roughly in the order a sensible player wants it. */
const BUILD_ORDER = [
  'hut', 'farm', 'market', 'hut', 'granary', 'lumber-camp', 'hut', 'sawmill',
  'blacksmith', 'well', 'hut', 'timber-house', 'mill', 'warehouse', 'bakery',
  'clay-pit', 'brickworks', 'pasture', 'carpenter', 'quarry', 'timber-house',
  'mine', 'smelter', 'guildhall', 'brewery', 'weaver',
];

const foodValue = (id) => (id === 'bread' ? 2 : 1);

function foodHeld(s) {
  return Object.keys(s.stock).reduce((n, id) => {
    const c = D.byId.commodity.get(id);
    if (!c || (c.category !== 'food' && c.category !== 'drink')) return n;
    return n + s.stock[id] * foodValue(id);
  }, 0);
}

const foodNeeded = (s) =>
  s.workers * R.population.foodPerWorkerPerRound + s.specialists.length + (s.peopleId === 'halfling' ? 2 : 0);

const FOOD_JOBS = ['harvest-grain', 'harvest-vegetables', 'net-fish', 'collect-eggs', 'tend-orchard', 'hunt-game', 'forage'];

function playRound(s) {
  Engine.startRound(s);

  let guard = 0;
  while (Engine.remainingEffort(s) > 0 && guard++ < 60) {
    const jobs = Engine.jobs(s).filter((j) => j.runnable);

    // Aim for a round of slack, not break-even: spoilage and a bad forage roll
    // will eat any margin thinner than that.
    const hungry = foodHeld(s) < foodNeeded(s) * 2;

    // 1. sow before eating the seed. One grain in the ground returns six, and a
    //    town that eats its last seed grain never leaves the forage era.
    const sow = jobs.find((j) => j.recipe.id === 'sow-grain');
    if (sow && (s.stock.grain || 0) >= 1) { Engine.runJob(s, sow.recipe.id); continue; }

    // 2. nobody starves if it can be helped
    if (hungry) {
      const food = FOOD_JOBS.map((id) => jobs.find((j) => j.recipe.id === id)).find(Boolean);
      if (food) { Engine.runJob(s, food.recipe.id); continue; }
    }

    // 3. sell the surplus. Without an income the market safety net is a one-shot,
    //    and the whole mid-game is bought with coin.
    if (Engine.ownedBuilding(s, 'market') && foodHeld(s) > foodNeeded(s) * 3) {
      const spare = Object.keys(s.stock).find((id) => {
        const c = D.byId.commodity.get(id);
        return c && c.category === 'food' && s.stock[id] > foodNeeded(s) * 2;
      });
      if (spare && Engine.trade(s, spare, 2, 'sell')) continue;
    }

    // 4. replace the tools that actually gate the early game
    const wantsTool = ['axe', 'shovel'].find((id) => !Engine.findTool(s, id));
    if (wantsTool && Engine.ownedBuilding(s, 'market') && s.coin >= 40) {
      if (Engine.buyTool(s, wantsTool, 'small')) continue;
    }

    // 5. finish what has been started
    const site = s.sites.find((x) => x.points < x.need);
    if (site) {
      const hours = Math.min(3, Engine.remainingEffort(s));
      if (Engine.workSite(s, site.uid, hours)) continue;
    }

    // 6. start the next thing on the wish list
    if (s.sites.length < 2) {
      const wanted = BUILD_ORDER.find((id) => {
        const built = s.buildings.filter((b) => b.id === id).length;
        const planned = s.sites.filter((x) => x.id === id).length;
        const target = BUILD_ORDER.filter((x) => x === id).length;
        return built + planned < target;
      });
      if (wanted && Engine.foundSite(s, wanted)) continue;
    }

    // 7. make what the next building is short of. A purely greedy value heuristic
    //    never makes an intermediate good that "loses" money on paper, so it would
    //    never hew a single beam of lumber and the mid-game would never open.
    const goal = BUILD_ORDER.find((id) => {
      const built = s.buildings.filter((b) => b.id === id).length;
      const planned = s.sites.filter((x) => x.id === id).length;
      return built + planned < BUILD_ORDER.filter((x) => x === id).length;
    });
    if (goal) {
      const short = (D.byId.building.get(goal).cost || []).find((c) => (s.stock[c.commodity] || 0) < c.qty);
      if (short) {
        const maker = jobs.find((j) => j.variant.outputs.some((o) => o.commodity === short.commodity));
        if (maker) { Engine.runJob(s, maker.recipe.id); continue; }
      }
    }

    // 8. otherwise, whatever produces the most value per hour
    const best = jobs
      .filter((j) => j.variant.outputs.length)
      .map((j) => {
        const gain = j.variant.outputs.reduce((n, o) => n + o.qty * (D.byId.commodity.get(o.commodity)?.baseValue || 0), 0);
        const spend = j.variant.inputs.reduce((n, i) => n + i.qty * (D.byId.commodity.get(i.commodity)?.baseValue || 0), 0);
        return { j, rate: (gain - spend) / j.hours };
      })
      .sort((a, b) => b.rate - a.rate)[0];
    if (best && best.rate > 0) { Engine.runJob(s, best.j.recipe.id); continue; }

    break;
  }

  Engine.endRound(s);
}

function runGame(peopleId, rounds, seed) {
  const s = Engine.newGame({ peopleId, seed });
  const history = [];
  for (let i = 0; i < rounds; i++) {
    playRound(s);
    history.push({
      round: s.round,
      workers: s.workers,
      effort: s.effort,
      unrest: s.unrest,
      buildings: s.buildings.length,
      coin: s.coin,
      food: foodHeld(s),
      score: Engine.score(s).total,
    });
  }
  return { state: s, history };
}

/* ----------------------------------------------------------------- report */

const rounds = parseInt(arg('rounds', String(R.victory.gameLengthRounds)), 10);
const peopleId = arg('people', 'human');
const games = parseInt(arg('games', '1'), 10);

if (games > 1) {
  const results = [];
  for (let i = 0; i < games; i++) results.push(runGame(peopleId, rounds, 1000 + i));

  const avg = (fn) => (results.reduce((n, r) => n + fn(r), 0) / results.length).toFixed(1);
  const starved = results.filter((r) => r.history.some((h) => h.unrest > 0)).length;

  console.log(`${games} games · ${peopleId} · ${rounds} rounds\n`);
  console.log(`  final score       ${avg((r) => Engine.score(r.state).total)}`);
  console.log(`  workers           ${avg((r) => r.state.workers)}`);
  console.log(`  buildings         ${avg((r) => r.state.buildings.length)}`);
  console.log(`  coin              ${avg((r) => r.state.coin)}`);
  console.log(`  ending unrest     ${avg((r) => r.state.unrest)}`);
  console.log(`  games with unrest ${starved}/${games}`);
} else {
  const seed = parseInt(arg('seed', '42'), 10);
  const { state, history } = runGame(peopleId, rounds, seed);

  console.log(`${D.byId.people.get(peopleId).name} · seed ${seed} · ${rounds} rounds\n`);
  console.log('  rnd  workers  effort  food  unrest  bldgs  coin  score');
  for (const h of history) {
    console.log(
      `  ${String(h.round).padStart(3)}  ${String(h.workers).padStart(7)}  ${String(h.effort).padStart(6)}` +
      `  ${String(h.food).padStart(4)}  ${String(h.unrest).padStart(6)}  ${String(h.buildings).padStart(5)}` +
      `  ${String(h.coin).padStart(4)}  ${String(h.score).padStart(5)}`
    );
  }

  const score = Engine.score(state);
  console.log(`\n  built:      ${state.buildings.map((b) => D.name('building', b.id)).sort().join(', ')}`);
  console.log(`  stockpile:  ${Object.entries(state.stock).map(([k, v]) => `${v} ${D.name('commodity', k)}`).join(', ') || 'empty'}`);
  console.log(`  tools:      ${state.tools.map((t) => `${D.name('tool', t.id)} ${t.max - t.wear}/${t.max}`).join(', ') || 'none'}`);
  console.log(`  score:      ${score.total} (buildings ${score.buildings}, people ${score.population}, luxury ${score.luxury}, industry ${score.industry})`);

  const deepest = Object.keys(state.stock).map((id) => D.tierOf(id));
  console.log(`  deepest chain reached: tier ${deepest.length ? Math.max(...deepest) : 0}`);
}
