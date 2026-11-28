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

/* ---------------------------------------------------------------- the checks

   A simulation that only prints a table proves that the engine RAN. These are
   the four things the redesign could break silently, each of them a claim the
   printed components make and none of them visible in a diff:

     1. the swing ruler can read every net the dice and the modifiers can produce
     2. a price never steps off the printed row of six
     3. a finite commodity's modifier only ever goes UP - the whole model
     4. a battle never deals a negative wound, and a tie deals none

   They run on every invocation, because a check you have to remember to run is
   a check that is not run. */

const checks = [];
const claim = (ok, what) => checks.push({ ok, what });

/* 1. THE RULER, swept over every reachable net rather than sampled. */
{
  const P = D.pricing;
  const demand = P.dice.sets.find((x) => x.id === 'demand');
  const supply = P.dice.sets.find((x) => x.id === 'supply');
  const adds = P.volatility.steps.map((x) => x.add);
  const lo = demand.range[0] - supply.range[1] + Math.min(...adds) + P.modifier.from;
  const hi = demand.range[1] - supply.range[0] + Math.max(...adds) + P.modifier.to;
  let holes = [];
  for (let net = lo; net <= hi; net++) {
    if (!P.ruler.bins.some((b) => net >= b.from && net <= b.to)) holes.push(net);
  }
  claim(holes.length === 0, `the swing ruler reads every net from ${lo} to ${hi}${holes.length ? ` — no cell for ${holes.join(', ')}` : ''}`);
}

/* 2, 3. A LONG MARKET, watched. Twelve hundred rolls of every line, with the
   price checked against the ladder and the depletion modifier checked against
   its own history on every one of them. */
{
  const state = Engine.newGame('human', 7);
  const top = D.rules.market.priceBands.length - 1;
  let offLadder = 0;
  let wentDown = 0;
  const seen = {};
  for (const c of D.commodities) seen[c.id] = 0;
  for (let round = 0; round < 200; round++) {
    /* burn a little of everything finite, so the grids actually fill */
    for (const c of D.commodities) {
      if (c.pricing === 'deplete' && round % 3 === 0) Engine.spend(state, c.id, 1);
    }
    Engine.rollMarket(state);
    for (const c of D.commodities) {
      const band = state.bands[c.id];
      if (band < 0 || band > top) offLadder += 1;
      if (c.pricing === 'deplete') {
        const m = Engine.marketOf(state, c.id).modifier;
        if (m < seen[c.id]) wentDown += 1;
        seen[c.id] = m;
      }
    }
  }
  claim(offLadder === 0, `no price stepped off the ${top + 1}-band row in 200 rounds of every line`);
  claim(wentDown === 0, 'a finite commodity\'s modifier never once went down');
  const worked = D.commodities.filter((c) => c.pricing === 'deplete' && Engine.marketOf(state, c.id).modifier >= D.pricing.depletion.top).length;
  claim(worked > 0, `${worked} seams reached the bottom of their grid, so the ladder is reachable`);
}

/* 4. A THOUSAND BATTLES. */
{
  const state = Engine.newGame('human', 7);
  let bad = 0;
  let ties = 0;
  const chr = D.characters[0];
  for (const m of D.monsters) {
    for (let i = 0; i < 80; i++) {
      const r = Engine.battle(state, { strength: chr.strength, items: chr.startsWith || [] }, m);
      if (r.damage < 0) bad += 1;
      if (r.wounded === null && r.damage !== 0) bad += 1;
      if (r.wounded === null) ties += 1;
    }
  }
  claim(bad === 0, `no battle in ${D.monsters.length * 80} dealt a negative or unassigned wound (${ties} ties)`);
}

/* 5. A HUNDRED CAREERS. Levelling is meant to be slow - a few levels in a
   first game, one or two in a tenth, and 20 only after a long run of games
   (rules.json level). This plays careers out against the real decks: a hero
   holds one task (data/tasks.json) and up to two quests (quests.json), meets
   the conditions on a task or a quest some rounds and not others, and earns the
   deeds the rules say. The play is a model, not a strategy - a round
   either gives a hero the chance a card wants or it does not - so the numbers
   are a ruler for the CURVE, not a prediction of any one table. */
{
  const rng = (seed) => { let x = seed >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const TASKS = D.tasks || [];
  const QUESTS = D.quests || [];
  const ROUNDS = R.victory.gameLengthRounds;
  const CHANCE = { task: 0.25, questArrives: 0.2, questRoundsPer: 2, questFinished: 0.8 };
  const shuffle = (r, a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const hero = D.characters[0];
  const careers = [];
  let bestFirstGame = 0;
  let bestGameDeeds = 0;
  for (let c = 0; c < 100; c++) {
    const r = rng(7000 + c);
    let rec = { level: 0, deeds: 0, rises: [] };
    let wisdom = hero.start.wisdom;
    let gamesTo20 = null;
    for (let g = 1; g <= 60 && gamesTo20 === null; g++) {
      let tasks = shuffle(r, TASKS);
      let quests = shuffle(r, QUESTS);
      let task = tasks.shift();
      const held = [];
      let deedsThisGame = 0;
      for (let round = 1; round <= ROUNDS; round++) {
        let earned = 0;
        if (task && r() < CHANCE.task) {
          const ok = task.test ? Engine.test(r, wisdom, task.test.at).passed : true;
          if (ok) { earned += task.deeds; tasks.push(task); task = tasks.shift(); }
        }
        if (held.length < 2 && quests.length && r() < CHANCE.questArrives) {
          let q = quests.shift();
          /* A quest above the hero's level goes to the bottom, as a declined card does. */
          for (let k = 0; k < quests.length && !Engine.canAccept(rec.level, q); k++) { quests.push(q); q = quests.shift(); }
          if (Engine.canAccept(rec.level, q)) held.push({ q, due: round + q.complexity * CHANCE.questRoundsPer * Math.max(1, (q.stages || []).length) });
          else quests.push(q);
        }
        for (const h of held.slice()) {
          if (round >= h.due) {
            held.splice(held.indexOf(h), 1);
            if (r() < CHANCE.questFinished) earned += Engine.questDeeds(h.q);
          }
        }
        if (earned) {
          deedsThisGame += earned;
          const res = Engine.addDeeds(rec, earned);
          rec = res.record;
          for (const _ of res.milestones) { rec.rises = [...rec.rises, 'wisdom']; wisdom += 1; }
        }
      }
      bestGameDeeds = Math.max(bestGameDeeds, deedsThisGame);
      if (g === 1) bestFirstGame = Math.max(bestFirstGame, rec.level);
      if (rec.level >= R.level.to) gamesTo20 = g;
    }
    careers.push(gamesTo20);
  }
  const done = careers.filter((g) => g !== null).sort((a, b) => a - b);
  const median = done.length ? done[Math.floor(done.length / 2)] : null;
  console.log(`\n  careers: a first game reaches level ${bestFirstGame} at best; the best single game earned ${bestGameDeeds} deeds of the ${R.level.toTop} to the top;`);
  console.log(`  level ${R.level.to} took ${done[0] ?? '-'} games at the quickest, ${median ?? '-'} at the median, ${done[done.length - 1] ?? '-'} at the slowest (${done.length}/100 careers got there in 60 games).`);
  claim(bestFirstGame < R.level.to && bestGameDeeds < R.level.toTop, `no single game takes a fresh hero to level ${R.level.to} (best first game: level ${bestFirstGame})`);
  claim(done.length === careers.length, `every career reaches level ${R.level.to} - the top is a long road, not a wall`);
  claim(median !== null && median >= 5 && median <= 20, `level ${R.level.to} takes a career of games, 5 to 20 at the median (median ${median})`);
}

const failed = checks.filter((c) => !c.ok);
console.log('');
for (const c of checks) console.log(`  ${c.ok ? 'ok  ' : 'FAIL'}  ${c.what}`);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed — the printed components and the engine disagree.`);
  process.exit(1);
}
