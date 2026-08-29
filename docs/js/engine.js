/*
 * game1 engine — the rules, with no DOM in sight.
 *
 * This is a single-town, single-player slice of the board game: roll effort,
 * allocate it to jobs, put up buildings, feed everyone at the end of the round.
 * It exists so that the numbers in data/ can be felt rather than argued about.
 *
 * What it implements faithfully: effort dice, tool durability, recipe inputs and
 * outputs, fuel choice, maturation, construction tracks with a minimum-rounds
 * floor, storage caps, feeding and unrest, and the whole of data/pricing.json —
 * the blue, red, green and ochre dice, the swing ruler, and the four kinds of good that
 * every market line remembers between rounds.
 *
 * What it fakes, and where the tabletop rule differs, is marked SIMPLIFIED.
 */
(function (global) {
  'use strict';

  const D = global.GameData;
  const R = D.rules;

  /* ---------------------------------------------------------------- random */

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const dieSize = (die) => parseInt(String(die).slice(1), 10);
  const stepDie = (die, steps) => {
    const ladder = R.effort.dieLadder;
    const i = ladder.indexOf(die);
    if (i < 0) return die;
    return ladder[Math.max(0, Math.min(ladder.length - 1, i + steps))];
  };

  /* ----------------------------------------------------------------- setup */

  /* The ground the opening town stands on, and separately the water beside it.
     Coast used to be the fourth entry in this list and did both jobs at once,
     which is exactly why it stopped being a terrain: the edge of the water is a
     relationship, not a kind of ground (data/terrain.json siting.waterside). So
     the town has ground, and it has a list of the water its tile touches, and a
     dock asks the second question rather than the first. */
  const STARTING_TERRAIN = ['grassland', 'forest', 'hills'];
  const STARTING_WATERS = ['shallow-water'];
  const STARTING_DEPOSITS = ['clay-bed', 'coal-seam', 'iron-deposit'];

  /** Does the water beside this town answer for the kind a site asks for? */
  function waterside(state, need) {
    if (!need) return true;
    const want = ((D.siting || {}).waterside || {}).kinds || {};
    const list = want[need] || [];
    return (state.waters || []).some((w) => list.indexOf(w) !== -1);
  }

  function newGame(options) {
    const opts = options || {};
    const peopleId = opts.peopleId || 'human';
    const people = D.byId.people.get(peopleId);
    const seed = opts.seed || Math.floor(Math.random() * 1e9);

    const state = {
      seed,
      rng: mulberry32(seed),
      round: 0,
      peopleId,
      coin: R.currency.startingAmount,
      workers: people.startingWorkers,
      specialists: [],
      unrest: 0,
      terrain: STARTING_TERRAIN.slice(),
      waters: STARTING_WATERS.slice(),
      deposits: STARTING_DEPOSITS.slice(),
      // Deliberately under the starting storage cap — a town that begins in
      // overflow just bleeds goods before the player has made a single choice.
      // The grain is sized to bridge the gap to a first harvest: build a farm,
      // sow, wait three rounds. Start with less and the opening is unwinnable.
      stock: { logs: 2, grain: 8, water: 1, barrel: 1 },
      buildings: [{ uid: 1, id: 'town-hall' }, { uid: 2, id: 'hut' }],
      sites: [],
      tools: [
        { uid: 1, id: 'axe', size: 'small', wear: 0 },
        { uid: 2, id: 'shovel', size: 'small', wear: 0 },
      ],
      pending: [],
      dice: [],
      effort: 0,
      effortSpent: 0,
      modifiers: [],
      event: null,
      /* One market line per commodity, exactly as the market board has one:
         which band the price stands on, how many places it moved LAST round
         (which is the whole of a sought good's memory), how many pips are on its
         depletion grid, and how many the board will still sell this round. */
      bands: {},
      lastMove: {},
      depletion: {},
      discharged: {},
      marketStock: {},
      log: [],
      uid: 100,
      over: false,
    };

    dealTheBoard(state);
    for (const t of state.tools) t.max = toolMax(t);

    log(state, 'head', `${people.name} settle a new valley. Seed ${seed}.`);
    log(state, '', 'Press "Start round" to roll for labour.');
    return state;
  }

  const nextUid = (s) => ++s.uid;

  /**
   * How much wear a tool has in it, and it no longer depends on its size.
   *
   * A size used to multiply durability as well as output. It does not: a bigger
   * loom is a FASTER loom, not a longer-lived one - and a multiplied wear number
   * is a number the board's ceiling sweep cannot see, because it never appears in
   * the data at the size it is actually walked at (rules.json tools.$sizesNote).
   */
  function toolMax(tool) {
    const def = D.byId.tool.get(tool.id);
    return def ? def.baseWear : 0;
  }

  function toolOutputMultiplier(tool) {
    const size = R.tools.sizes.find((x) => x.id === tool.size) || R.tools.sizes[0];
    return size.outputMultiplier;
  }

  function log(state, kind, text) {
    state.log.push({ round: state.round, kind, text });
    if (state.log.length > 400) state.log.shift();
  }

  /* ------------------------------------------------------------- inventory */

  const has = (state, id, qty) => (state.stock[id] || 0) >= qty;

  function take(state, id, qty) {
    state.stock[id] = (state.stock[id] || 0) - qty;
    if (state.stock[id] <= 0) delete state.stock[id];
  }

  function give(state, id, qty) {
    state.stock[id] = (state.stock[id] || 0) + qty;
  }

  function usedSlots(state) {
    let bulk = 0;
    for (const id in state.stock) {
      const c = D.byId.commodity.get(id);
      bulk += (c ? c.bulk : 1) * state.stock[id];
    }
    return bulk;
  }

  function capacity(state) {
    let cap = R.storage.stockpileFreeSlotsPerTown;
    for (const b of state.buildings) {
      const def = D.byId.building.get(b.id);
      if (def && def.storage) cap += def.storage;
    }
    return cap;
  }

  const ownedBuilding = (state, id) => state.buildings.some((b) => b.id === id);
  const countBuilding = (state, id) => state.buildings.filter((b) => b.id === id).length;

  /** Usable tool of a given type: the most worn one that still works, so kit wears evenly. */
  function findTool(state, toolId) {
    return state.tools
      .filter((t) => t.id === toolId && t.wear < t.max)
      .sort((a, b) => b.wear - a.wear)[0] || null;
  }

  const hasSpecialist = (state, profId) => state.specialists.includes(profId);

  /**
   * Output multiplier from the player's people.
   *
   * SIMPLIFIED: several traits in peoples.json are written as die-size changes for
   * workers at a particular site ("dwarves roll d8 in a mine"). The prototype rolls
   * one pool of hours for the whole town, so there is no per-site die to step — those
   * traits are approximated as output multipliers here. That mismatch is a real design
   * question, not just an implementation gap: see docs/design/10-open-questions.md.
   */
  function peopleBonus(state, recipe) {
    const isMining = (recipe.site?.building === 'mine' || recipe.site?.building === 'quarry');
    switch (state.peopleId) {
      case 'dwarf':
        if (isMining) return 1.5;
        if (recipe.category === 'agriculture') return 0.5;
        return 1;
      case 'elf':
        if (recipe.id === 'forage' || recipe.id === 'harvest-herbs') return 2;
        if (recipe.id === 'weave-fine-cloth') return 2;
        if (isMining) return 0.5;
        return 1;
      case 'halfling':
        // Second Breakfast doubles their food bill, so their farming has to more
        // than double to pay for it. 1.5x left them starving in every simulated
        // game; 2.5x is the number the simulator settled on, not a felt guess.
        return recipe.category === 'agriculture' ? 2.5 : 1;
      default:
        return 1;
    }
  }

  /* ------------------------------------------------------------------ jobs */

  /** Pick the first input/output variant the town can actually pay for. */
  function affordableVariant(state, recipe) {
    const list = D.variants(recipe);
    const ok = list.find((v) => v.inputs.every((i) => has(state, i.commodity, i.qty)));
    return { variant: ok || list[0], affordable: Boolean(ok) };
  }

  /** Cheapest fuel option the town holds, or null if it holds none. */
  function affordableFuel(state, recipe) {
    const options = D.fuelOptions(recipe);
    if (!options.length) return { needed: false, option: null };
    const option = options.find((o) => o.inputs.every((i) => has(state, i.commodity, i.qty)));
    return { needed: true, option: option || null };
  }

  /**
   * Every recipe, with the reasons it cannot be run right now.
   * An empty `blockers` array means "allocate away".
   */
  function jobs(state) {
    return D.recipes.map((recipe) => {
      const blockers = [];
      const site = recipe.site || {};

      if (site.building || site.orBuilding) {
        const okA = site.building ? ownedBuilding(state, site.building) : false;
        const okB = site.orBuilding ? ownedBuilding(state, site.orBuilding) : false;
        const terrainFallback = (site.terrain || []).some((t) => state.terrain.includes(t));
        if (!okA && !okB && !terrainFallback) {
          blockers.push(`needs a ${D.name('building', site.building || site.orBuilding)}`);
        }
      } else if (site.terrain) {
        if (!site.terrain.some((t) => state.terrain.includes(t))) {
          blockers.push(`needs ${site.terrain.map((t) => D.name('terrain', t)).join(' or ')}`);
        }
      }

      /* `orWaterside` is the other half of an `orTerrain`: drawing water needs a
         well, or a marsh, or a river or a lake beside you. */
      if (site.orWaterside && !waterside(state, site.orWaterside) &&
          !(site.building && ownedBuilding(state, site.building)) &&
          !(site.orTerrain || []).some((t) => state.terrain.includes(t))) {
        blockers.push(`needs ${site.orWaterside} water beside the town`);
      }
      if (site.waterside && !waterside(state, site.waterside)) {
        blockers.push(`needs ${site.waterside} water beside the town`);
      }

      if (site.deposit && !state.deposits.includes(site.deposit)) {
        blockers.push(`no ${D.name('deposit', site.deposit)} here`);
      }
      if (site.constructionSite && !state.sites.length) blockers.push('nothing under construction');
      if (site.figure) blockers.push(`needs a ${D.name('figure', site.figure)} on the board`);
      if (site.fieldSlot && !fieldSpace(state)) blockers.push('no free field slot');
      if (site.ripeCrop && !ripeCrop(state, site.ripeCrop)) blockers.push(`no ripe ${D.name('commodity', site.ripeCrop)}`);
      if (site.livestock && !has(state, site.livestock, 1)) blockers.push(`no ${D.name('commodity', site.livestock)}`);

      if (recipe.tool && !findTool(state, recipe.tool)) {
        blockers.push(state.tools.some((t) => t.id === recipe.tool) ? `${D.name('tool', recipe.tool)} is worn out` : `needs a ${D.name('tool', recipe.tool)}`);
      }
      if (recipe.specialist && !hasSpecialist(state, recipe.specialist)) {
        blockers.push(`needs a ${D.name('profession', recipe.specialist)}`);
      }

      const { variant, affordable } = affordableVariant(state, recipe);
      if (!affordable) {
        const missing = variant.inputs
          .filter((i) => !has(state, i.commodity, i.qty))
          .map((i) => `${i.qty} ${D.name('commodity', i.commodity)}`);
        if (missing.length) blockers.push('short of ' + missing.join(', '));
      }

      const fuel = affordableFuel(state, recipe);
      if (fuel.needed && !fuel.option) blockers.push('no fuel');

      const bonus = optionalTool(state, recipe);
      const hours = jobHours(recipe, bonus);
      if (hours > remainingEffort(state)) blockers.push(`needs ${hours}h of effort`);

      // Jobs whose whole result is prose (brokering a trade, planning a route) cannot
      // be resolved automatically. Sowing looks like one — no immediate output — but
      // it is not: it puts a crop marker on a field, which the engine does track.
      const producesSomething = recipe.outputs?.length || recipe.buildPointsPerHour ||
        recipe.rollTable || recipe.cropStage || recipe.maturationRounds;
      if (!producesSomething && recipe.effect) {
        blockers.push('no automatic effect — resolve this one at the table');
      }

      return { recipe, variant, fuel: fuel.option, hours, bonus, blockers, runnable: blockers.length === 0 };
    });
  }

  /** An optional tool speeds a job up or fattens it, but never gates it. */
  function optionalTool(state, recipe) {
    if (!recipe.toolBonus) return null;
    const tool = findTool(state, recipe.toolBonus.tool);
    return tool ? { tool, spec: recipe.toolBonus } : null;
  }

  function jobHours(recipe, bonus) {
    let hours = recipe.effortHours || 1;
    if (bonus && bonus.spec.effortDivisor) hours = hours / bonus.spec.effortDivisor;
    return Math.max(1, Math.round(hours));
  }
  const remainingEffort = (state) => state.effort - state.effortSpent;

  function fieldSpace(state) {
    const slots = state.buildings.reduce((n, b) => n + (D.byId.building.get(b.id)?.fieldSlots || 0), 0);
    const sown = state.pending.filter((p) => p.kind === 'crop').length;
    return sown < slots;
  }

  const ripeCrop = (state, cropId) => state.pending.some((p) => p.kind === 'crop' && p.crop === cropId && p.roundsLeft <= 0);

  /* --------------------------------------------------------------- actions */

  function runJob(state, recipeId) {
    const job = jobs(state).find((j) => j.recipe.id === recipeId);
    if (!job) return fail(state, 'No such job.');
    if (!job.runnable) return fail(state, `${job.recipe.name}: ${job.blockers[0]}.`);

    const { recipe, variant, fuel, hours, bonus } = job;

    /* THE ONE PLACE A PIP GOES ON A DEPLETION GRID. A recipe's inputs and its
       fuel are CONSUMED - they are gone out of the game, not moved across a
       table - and consumption is the only thing a finite seam notices. spend()
       is a no-op for the three kinds of good that are not finite, so this does
       not have to know which is which. */
    for (const i of variant.inputs) { take(state, i.commodity, i.qty); spend(state, i.commodity, i.qty); }
    if (fuel) for (const i of fuel.inputs) { take(state, i.commodity, i.qty); spend(state, i.commodity, i.qty); }
    state.effortSpent += hours;

    let multiplier = peopleBonus(state, recipe);
    let tool = null;
    if (recipe.tool) {
      tool = findTool(state, recipe.tool);
      multiplier = toolOutputMultiplier(tool);
      /* ONE WEAR POINT A JOB, not one an hour. A worker who spends nine hours
         felling timber has run one job and blunted one axe by one - which is why
         the numbers came down to the board's 0-14 scale without anything getting
         shorter-lived (rules.json wear). Orcs are still hard on their tools. */
      const wearRate = state.peopleId === 'orc' ? 2 : R.tools.wearPerJob;
      tool.wear = Math.min(tool.max, tool.wear + wearRate);
      if (tool.wear >= tool.max) {
        log(state, 'bad', `The ${D.name('tool', tool.id)} breaks after ${D.name('recipe', recipe.id)}.`);
        state.tools = state.tools.filter((t) => t.uid !== tool.uid);
      }
    }
    if (fuel && fuel.outputPenalty) multiplier += fuel.outputPenalty / 2;
    if (fuel && fuel.outputBonus) multiplier += fuel.outputBonus / 2;

    // Optional tools: not required, but they wear down like any other when used.
    if (bonus) {
      multiplier *= (bonus.spec.outputMultiplier || 1) * toolOutputMultiplier(bonus.tool);
      bonus.tool.wear = Math.min(bonus.tool.max, bonus.tool.wear + R.tools.wearPerJob);
      if (bonus.tool.wear >= bonus.tool.max) {
        state.tools = state.tools.filter((t) => t.uid !== bonus.tool.uid);
        log(state, 'bad', `The ${D.name('tool', bonus.tool.id)} wears out.`);
      }
    }

    // Consume the ripe crop marker this harvest is drawing on.
    if (recipe.site?.ripeCrop) {
      const idx = state.pending.findIndex((p) => p.kind === 'crop' && p.crop === recipe.site.ripeCrop && p.roundsLeft <= 0);
      if (idx >= 0) state.pending.splice(idx, 1);
    }

    if (recipe.cropStage) {
      state.pending.push({ kind: 'crop', crop: recipe.cropStage, roundsLeft: cropRounds(state, recipe), label: `${D.name('commodity', recipe.cropStage)} growing` });
      log(state, '', `Sowed ${D.name('commodity', recipe.cropStage)} — ${cropRounds(state, recipe)} rounds to ripen.`);
      return true;
    }

    if (recipe.rollTable) {
      const table = D.raw.recipes.rollTables[recipe.rollTable];
      const roll = 1 + Math.floor(state.rng() * dieSize(table.die));
      const result = table.results[String(roll)] || {};
      const gained = (result.outputs || []).map((o) => {
        const qty = Math.max(1, Math.floor(o.qty * multiplier));
        give(state, o.commodity, qty);
        return `${qty} ${D.name('commodity', o.commodity)}`;
      });
      const outcome = gained.length ? gained.join(', ') + '.' : result.text || 'nothing.';
      log(state, gained.length ? 'good' : '', `${recipe.name} (rolled ${roll}): ${outcome}`);
      return true;
    }

    const produced = [];
    const deliver = (o) => {
      const qty = Math.max(1, Math.floor(o.qty * multiplier));
      produced.push(`${qty} ${D.name('commodity', o.commodity)}`);
      return qty;
    };

    if (recipe.maturationRounds) {
      const payload = variant.outputs.map((o) => ({ commodity: o.commodity, qty: deliver(o) }));
      state.pending.push({
        kind: 'output', roundsLeft: recipe.maturationRounds, outputs: payload,
        label: `${recipe.name}: ${produced.join(', ')}`,
      });
      log(state, '', `${recipe.name} started — ${produced.join(', ')} in ${recipe.maturationRounds} round(s).`);
      return true;
    }

    for (const o of variant.outputs) give(state, o.commodity, deliver(o));

    if (produced.length) log(state, 'good', `${recipe.name} (${hours}h) → ${produced.join(', ')}.`);
    else log(state, '', `${recipe.name} (${hours}h). ${recipe.effect || ''}`.trim());
    return true;
  }

  function cropRounds(state, recipe) {
    let rounds = recipe.maturationRounds || 1;
    if (state.peopleId === 'halfling') rounds = Math.max(1, rounds - 1);
    return rounds;
  }

  /** Which construction skill a building rewards, from what it is mostly made of. */
  function materialTag(def) {
    const weigh = (ids) => (def.cost || []).filter((c) => ids.includes(c.commodity)).reduce((n, c) => n + c.qty, 0);
    const timber = weigh(['logs', 'lumber']);
    const masonry = weigh(['stone', 'brick']);
    if (masonry > timber) return 'masonry';
    if (timber > 0) return 'timber';
    return null;
  }

  /** Humans: "Builders" — housing costs 1 less of its bulkiest material. */
  function housingDiscount(state, def) {
    const cost = (def.cost || []).map((c) => ({ ...c }));
    if (state.peopleId !== 'human' || def.category !== 'housing' || !cost.length) return cost;
    const bulkiest = cost.slice().sort((a, b) =>
      (D.byId.commodity.get(b.commodity)?.bulk || 1) * b.qty - (D.byId.commodity.get(a.commodity)?.bulk || 1) * a.qty
    )[0];
    bulkiest.qty = Math.max(1, bulkiest.qty - 1);
    return cost;
  }

  function foundSite(state, buildingId) {
    const def = D.byId.building.get(buildingId);
    if (!def) return fail(state, 'No such building.');
    if (def.requiresBuilding && !ownedBuilding(state, def.requiresBuilding)) {
      return fail(state, `${def.name} needs a ${D.name('building', def.requiresBuilding)} first.`);
    }
    if (def.requiresDeposit && !state.deposits.includes(def.requiresDeposit)) {
      return fail(state, `${def.name} needs a ${D.name('deposit', def.requiresDeposit)} on the tile.`);
    }
    if (def.requiresDepositAny && !def.requiresDepositAny.some((d) => state.deposits.includes(d))) {
      return fail(state, `${def.name} must be built on a revealed deposit.`);
    }
    if (def.terrain && !def.terrain.some((t) => state.terrain.includes(t)) &&
        !(def.orWaterside && waterside(state, def.orWaterside))) {
      return fail(state, `${def.name} cannot be built on this town's terrain.`);
    }
    if (def.waterside && !waterside(state, def.waterside)) {
      return fail(state, `${def.name} has to stand waterside on ${def.waterside === 'sea' ? 'the sea' : def.waterside + ' water'}.`);
    }
    if (def.unique === 'per-town' && ownedBuilding(state, buildingId)) {
      return fail(state, `Only one ${def.name} per town.`);
    }
    const cost = housingDiscount(state, def);
    const missing = cost.filter((c) => !has(state, c.commodity, c.qty));
    if (missing.length) {
      return fail(state, `${def.name} needs ${missing.map((c) => `${c.qty} ${D.name('commodity', c.commodity)}`).join(', ')}.`);
    }

    for (const c of cost) take(state, c.commodity, c.qty);
    state.sites.push({
      uid: nextUid(state), id: buildingId, points: 0,
      need: def.buildPoints, minRounds: def.minRounds || 1, rounds: 0,
      tag: materialTag(def),
    });
    log(state, '', `Founded ${def.name}: materials paid, ${def.buildPoints} build-points to go.`);
    return true;
  }

  /** Which construction recipe a worker would use on this site, given the tools to hand. */
  function buildRateFor(state, site) {
    const specific = { timber: 'build-timber-frame', masonry: 'build-masonry' }[site.tag];
    if (site.id === 'mine') {
      if (findTool(state, 'shovel')) return { rate: 2, via: 'sink-mineshaft', tool: 'shovel' };
    }
    if (specific) {
      const recipe = D.byId.recipe.get(specific);
      if (recipe && findTool(state, recipe.tool)) return { rate: recipe.buildPointsPerHour, via: specific, tool: recipe.tool };
    }
    if (findTool(state, 'hammer')) return { rate: 1, via: 'build-generic', tool: 'hammer' };
    return { rate: 1, via: 'build-generic', tool: null, bare: true };
  }

  function workSite(state, siteUid, hours) {
    const site = state.sites.find((s) => s.uid === siteUid);
    if (!site) return fail(state, 'No such construction site.');
    hours = Math.max(1, Math.min(hours || 1, remainingEffort(state)));
    if (hours > remainingEffort(state)) return fail(state, 'Not enough effort left.');

    const { rate, tool, bare } = buildRateFor(state, site);
    state.effortSpent += hours;
    site.points = Math.min(site.need, site.points + hours * rate);

    if (tool) {
      const t = findTool(state, tool);
      t.wear = Math.min(t.max, t.wear + R.tools.wearPerJob);
      if (t.wear >= t.max) {
        state.tools = state.tools.filter((x) => x.uid !== t.uid);
        log(state, 'bad', `The ${D.name('tool', tool)} breaks on the ${D.name('building', site.id)} site.`);
      }
    }
    log(state, '', `${hours}h on the ${D.name('building', site.id)}${bare ? ' by hand' : ''} — ${site.points}/${site.need}.`);
    return true;
  }

  /* -------------------------------------------------------------- trading */

  /* ------------------------------------------------------------- the market */

  /*
   * data/pricing.json, played. The tabletop rule is one line of ADDITION: roll
   * two blue dice for demand and two red for supply, add the green die's
   * volatility, add whatever the good's own nature adds, read the net on the
   * swing ruler and step the price that many places along its own printed row of
   * six. Everything below is that, with the dice rolled by the engine's own RNG
   * so a seed replays a market exactly.
   *
   * Nothing multiplies. There used to be a green die that doubled or halved the
   * swing and rounded it toward zero, and a memory strip that had to be folded in
   * BEFORE that multiplication - three chances to slip in one line, and the only
   * arithmetic in the game a table could get wrong. The die adds now.
   *
   * NOTHING here is a number this file invented. The bands are rules.json; the
   * dice, the ruler, the volatility strip, the spoil strip, the depletion ladder
   * and the four kinds of good are pricing.json; and which kind a commodity is
   * lives on the commodity.
   */
  const P = D.pricing;
  const modelOf = (commodityId) => {
    const c = D.byId.commodity.get(commodityId);
    return P.models.find((m) => m.id === c.pricing) || P.models[0];
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rollDice = (state, set) => {
    let total = 0;
    for (let i = 0; i < set.count; i++) total += 1 + Math.floor(state.rng() * set.faces);
    return total;
  };
  const diceSet = (id) => P.dice.sets.find((d) => d.id === id);
  const rulerMove = (net) => {
    const bin = P.ruler.bins.find((b) => net >= b.from && net <= b.to);
    return bin ? bin.move : 0;
  };

  /**
   * What a finite commodity's depletion grid currently reads: the lowest number
   * still visible on it.
   *
   * The grid is `per` cells to a row and each row is worth `step`, so covering a
   * whole row is what puts the number up. A player at the table does not compute
   * this - they look at the grid and read the smallest figure they can still see -
   * and this is that reading, done in arithmetic because a program has no eyes.
   */
  function depletionModifier(state, commodityId) {
    const pips = state.depletion[commodityId] ?? 0;
    return clamp(Math.floor(pips / P.depletion.per) * P.depletion.step, 0, P.depletion.top);
  }

  /**
   * A PIP GOES ON THE GRID WHEN A UNIT IS BURNT, NEVER WHEN ONE IS TRADED.
   *
   * That distinction is the whole of the finite model. Selling coal to a town
   * moves coal; feeding it to a furnace destroys coal, and only the furnace is
   * something a seam notices. A merchant who never lights a fire can trade the
   * same hundred tons all game and the price will not move an inch for it.
   *
   * So this is called from wherever a commodity is CONSUMED - a recipe eating its
   * inputs, an engine burning its fuel - and from nowhere in trade().
   */
  function spend(state, commodityId, qty) {
    const c = D.byId.commodity.get(commodityId);
    if (!c) return;
    const model = P.models.find((m) => m.id === c.pricing);
    if (!model || !model.tokensOnUse) return;
    state.depletion[commodityId] = (state.depletion[commodityId] ?? 0) + qty;
  }

  /** Setup: every price on the starting band, no grid touched, nothing moved
      yet, and one supply roll each so the board has something to sell in round one. */
  function dealTheBoard(state) {
    for (const c of D.commodities) {
      state.bands[c.id] = R.market.startingBandIndex;
      state.lastMove[c.id] = 0;
      state.depletion[c.id] = 0;
      state.marketStock[c.id] = rollDice(state, diceSet('supply'));
    }
  }

  /**
   * What a good's own nature adds to the swing. Three of the four add nothing,
   * and the two that do read it off something that is already on the table for
   * another reason - the grid the pips were going on anyway, or the move box that
   * was written down anyway. Nothing is remembered and nothing extra is tracked.
   */
  function modifierOf(state, commodityId) {
    const model = modelOf(commodityId);
    if (typeof model.modifier === 'number') return model.modifier;
    if (model.id === 'deplete') return depletionModifier(state, commodityId);
    if (model.id === 'hype') {
      return clamp(state.lastMove[commodityId] ?? 0, P.sought.from, P.sought.to);
    }
    return 0;
  }

  /** One line's market, rolled and read. Returns what happened, for the log. */
  function rollLine(state, commodityId) {
    const demand = rollDice(state, diceSet('demand'));
    const supply = rollDice(state, diceSet('supply'));
    const green = rollDice(state, diceSet('volatility'));
    const step = P.volatility.steps.find((s2) => s2.faces.includes(green)) || P.volatility.steps[0];
    const modifier = modifierOf(state, commodityId);
    const net = (demand - supply) + step.add + modifier;

    const was = state.bands[commodityId] ?? R.market.startingBandIndex;
    const top = R.market.priceBands.length - 1;
    const now = clamp(was + rulerMove(net), 0, top);
    state.bands[commodityId] = now;
    /* The move box on the ledger row, which is next round's modifier for a sought
       good and a record of the season for everybody else. */
    state.lastMove[commodityId] = now - was;
    /* The board sells no more than it has: this round's supply roll is the cap,
       and buying draws it down (pricing.json stockCap). */
    state.marketStock[commodityId] = supply;
    return { demand, supply, green, step, modifier, net, moved: now - was };
  }

  /**
   * The Market phase: every line rolled, and nothing updated afterwards.
   *
   * There used to be a second pass here - updateMemory, one rule per model,
   * walking a bar along a printed strip. There is no strip and there is no second
   * pass: a sought good's memory is the move this roll just made, which is
   * written down as part of making it, and every other kind of good remembers
   * nothing at all.
   *
   * The printed ledger holds six columns and a town trades six commodities; a
   * sandbox has no such limit, so it rolls all of them and reports only what the
   * player is holding or what moved furthest. Every line is rolled either way - a
   * market you are not watching still moves, which is the whole point of it being
   * a market rather than a price list.
   */
  function rollMarket(state) {
    const moved = [];
    for (const c of D.commodities) {
      const roll = rollLine(state, c.id);
      if (roll.moved) moved.push({ c, roll });
    }
    const mine = moved.filter((m) => (state.stock[m.c.id] ?? 0) > 0);
    const shown = (mine.length ? mine : moved)
      .sort((a, b) => Math.abs(b.roll.moved) - Math.abs(a.roll.moved))
      .slice(0, 3);
    for (const { c, roll } of shown) {
      const bandNow = R.market.priceBands[state.bands[c.id]];
      log(state, roll.moved > 0 ? 'good' : '',
        `Market: ${c.name} ${roll.moved > 0 ? 'up' : 'down'} ${Math.abs(roll.moved)} ` +
        `band${Math.abs(roll.moved) === 1 ? '' : 's'} to ×${bandNow} ` +
        `(D${roll.demand} S${roll.supply} ${roll.step.label}` +
        `${roll.modifier ? `, ${modelOf(c.id).name.toLowerCase()} ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''}).`);
    }
    log(state, '', `Market: ${moved.length} of ${D.commodities.length} lines moved.`);
    return moved;
  }

  /**
   * THE SPOIL CHECK, at the end of the round, on everything a player is still
   * holding that will not keep.
   *
   * It replaced a countdown - every perishable used to carry a number of rounds
   * it kept for, which meant a token per stack with an age on it and somebody
   * having to remember when the fish arrived. A die at the end of the round asks
   * the same question and needs nothing written down.
   *
   * A stack reads the right-hand column of the strip if the commodity keeps badly
   * (perishRounds under the threshold) and the left if it keeps well, and it
   * cannot lose more than it holds.
   */
  function rollSpoil(state) {
    const lost = [];
    for (const c of D.commodities) {
      const model = P.models.find((m) => m.id === c.pricing);
      if (!model || !model.spoils) continue;
      const held = state.stock[c.id] ?? 0;
      if (held <= 0) continue;
      const face = rollDice(state, diceSet('spoil'));
      const step = P.spoil.steps.find((s2) => s2.faces.includes(face)) || P.spoil.steps[0];
      const poorly = (c.perishRounds ?? 99) < P.spoil.keepsThreshold;
      const n = Math.min(held, poorly ? step.keepsPoorly : step.keepsWell);
      if (!n) continue;
      state.stock[c.id] = held - n;
      lost.push({ c, n, face });
    }
    for (const { c, n, face } of lost) {
      log(state, 'bad', `Spoiled: ${n} ${c.name.toLowerCase()} (ochre ${face}).`);
    }
    return lost;
  }

  /** Everything a market line is holding right now, for the sandbox to show. */
  function marketOf(state, commodityId) {
    const model = modelOf(commodityId);
    return {
      band: state.bands[commodityId] ?? R.market.startingBandIndex,
      lastMove: state.lastMove[commodityId] ?? 0,
      modifier: modifierOf(state, commodityId),
      depletion: state.depletion[commodityId] ?? 0,
      stock: state.marketStock[commodityId] ?? 0,
      model,
    };
  }

  function priceOf(state, commodityId) {
    const c = D.byId.commodity.get(commodityId);
    const band = R.market.priceBands[state.bands[c.id] ?? R.market.startingBandIndex];
    return { base: c.baseValue * band, band };
  }

  const hasFreeMarket = (state) => ownedBuilding(state, 'trading-house') || hasSpecialist(state, 'merchant');

  /* ------------------------------------------------------------- the battle */

  /**
   * data/rules.json conflict.battle, played. ONE SUBTRACTION, and it is the same
   * subtraction the market makes: you roll BLUE and add your strength and your
   * gear, the thing you are fighting rolls RED and adds its own, and whoever is
   * lower loses health equal to the gap.
   *
   * A tie wounds nobody, which is the honest answer: two figures who are the same
   * and roll the same have had a fight and neither has anything to show for it.
   *
   * `extraDie` is the one place in the game where more dice are rolled than are
   * counted - roll one more of your own colour and keep the best two. It is worth
   * about a point and a half, and it belongs to the premium tier of weapon and to
   * the hired blade.
   */
  function battleRoll(state, dice) {
    const faces = R.conflict.battleDice.faces;
    const count = R.conflict.battleDice.count;
    const rolls = [];
    for (let i = 0; i < dice; i++) rolls.push(1 + Math.floor(state.rng() * faces));
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, count).reduce((n, r) => n + r, 0);
  }

  /** What a side brings besides its dice: strength, plus a weapon, plus armour. */
  function battleGear(side) {
    const kit = side.items || [];
    let gear = side.armour ?? 0;
    let extra = side.extraDie ? 1 : 0;
    for (const id of kit) {
      const it = D.byId.item ? D.byId.item.get(id) : null;
      if (!it) continue;
      gear += (it.battle ?? 0) + (it.armour ?? 0);
      if (it.extraDie) extra = 1;
    }
    return { gear, extra };
  }

  /**
   * One exchange. `you` and `them` are anything with a strength - a character, a
   * monster, a hireling - plus optionally `items` (ids), `armour` and `extraDie`.
   * Returns who lost and by how much; the loser takes that much health.
   */
  function battle(state, you, them) {
    const base = R.conflict.battleDice.count;
    const mine = battleGear(you);
    const theirs = battleGear(them);
    const yours = (you.strength ?? 0) + mine.gear + battleRoll(state, base + mine.extra);
    const its = (them.strength ?? 0) + theirs.gear + battleRoll(state, base + theirs.extra);
    const diff = Math.abs(yours - its);
    return {
      yours, theirs: its,
      wounded: yours === its ? null : (yours > its ? 'them' : 'you'),
      damage: yours === its ? 0 : diff,
    };
  }

  /**
   * Whether a party may run at all. It is a footrace and the monster's card
   * prints its half of it: equal is not greater, because a thing that matches you
   * stays with you.
   */
  const canFlee = (partyPace, monster) => partyPace > (monster.pace ?? 0);

  /**
   * What a slain monster is worth: the LESSER of the number in its Y box and a
   * roll of the purple mana die. The yield is a ceiling, never a payment - which
   * is what stopped the biggest fight in the game being an errand with a known
   * price on it.
   */
  function manaFrom(state, monster) {
    const die = D.arcana && D.arcana.manaDie ? D.arcana.manaDie : { faces: 6 };
    const roll = 1 + Math.floor(state.rng() * die.faces);
    return Math.min(monster.manaYield ?? 0, roll);
  }

  function trade(state, commodityId, qty, side) {
    if (!ownedBuilding(state, 'market')) return fail(state, 'You need a Market to trade with the board.');
    /* The board sells what it rolled and no more. It will buy any quantity — a
       market always has room for more of what nobody wants (pricing.stockCap). */
    if (side === 'buy') {
      const stock = state.marketStock[commodityId] ?? 0;
      if (qty > stock) {
        return fail(state, `The board has ${stock} ${D.name('commodity', commodityId)} left this round — that was the supply roll.`);
      }
    }
    const { base } = priceOf(state, commodityId);
    const spread = hasFreeMarket(state) ? 0 : (side === 'buy' ? R.market.buySpread : R.market.sellSpread);
    const unit = base * (1 + spread);
    const total = Math.round(unit * qty);

    if (side === 'buy') {
      if (state.coin < total) return fail(state, `Not enough coin: ${total} needed.`);
      state.coin -= total;
      give(state, commodityId, qty);
      state.marketStock[commodityId] -= qty;
      /* No pip goes on any grid here. Trading moves a commodity; it does not
         spend one, and a seam only ever notices the spending - see spend(). */
      log(state, '', `Bought ${qty} ${D.name('commodity', commodityId)} for ${total}${R.currency.symbol}.`);
    } else {
      if (!has(state, commodityId, qty)) return fail(state, 'Not enough in the stockpile.');
      take(state, commodityId, qty);
      state.coin += total;
      log(state, 'good', `Sold ${qty} ${D.name('commodity', commodityId)} for ${total}${R.currency.symbol}.`);
    }
    return true;
  }

  /**
   * Buy a ready-made tool at the market. This is the game's safety net: without
   * it, a player whose last axe breaks has no route back to logs, lumber, a
   * blacksmith, or another axe.
   */
  function buyTool(state, toolId, size) {
    if (!ownedBuilding(state, 'market')) return fail(state, 'Tools are bought at a Market.');
    const def = D.byId.tool.get(toolId);
    const sizeDef = R.tools.sizes.find((s) => s.id === (size || 'small'));
    const spread = hasFreeMarket(state) ? 0 : R.market.buySpread;
    const price = Math.round(def.baseValue * sizeDef.costMultiplier * (1 + spread));
    if (state.coin < price) return fail(state, `A ${def.name} costs ${price}${R.currency.symbol}.`);
    state.coin -= price;
    const tool = { uid: nextUid(state), id: toolId, size: sizeDef.id, wear: 0 };
    tool.max = toolMax(tool);
    state.tools.push(tool);
    log(state, 'good', `Bought a ${sizeDef.id} ${def.name} for ${price}${R.currency.symbol}.`);
    return true;
  }

  function craftTool(state, toolId, size) {
    const def = D.byId.tool.get(toolId);
    if (!ownedBuilding(state, def.madeAt)) return fail(state, `${def.name} must be made at a ${D.name('building', def.madeAt)}.`);
    const sizeDef = R.tools.sizes.find((s) => s.id === (size || 'small'));
    const cost = def.craft.inputs.map((i) => ({ commodity: i.commodity, qty: Math.ceil(i.qty * sizeDef.costMultiplier) }));
    const missing = cost.filter((c) => !has(state, c.commodity, c.qty));
    if (missing.length) return fail(state, `Needs ${missing.map((c) => `${c.qty} ${D.name('commodity', c.commodity)}`).join(', ')}.`);
    const hours = def.craft.effortHours;
    if (hours > remainingEffort(state)) return fail(state, `Needs ${hours}h of effort.`);

    for (const c of cost) take(state, c.commodity, c.qty);
    state.effortSpent += hours;
    const tool = { uid: nextUid(state), id: toolId, size: sizeDef.id, wear: 0 };
    tool.max = toolMax(tool);
    state.tools.push(tool);
    log(state, 'good', `Forged a ${sizeDef.id} ${def.name} (${tool.max} wear points).`);
    return true;
  }

  function trainSpecialist(state, profId) {
    const prof = D.byId.profession.get(profId);
    if (!ownedBuilding(state, 'guildhall')) return fail(state, 'Training needs a Guildhall.');
    if (state.workers < 2) return fail(state, 'You cannot spare the worker.');
    if (state.coin < prof.trainCost.coin) return fail(state, `Needs ${prof.trainCost.coin}${R.currency.symbol}.`);
    if (prof.trainCost.effortHours > remainingEffort(state)) return fail(state, 'Not enough effort left.');
    state.coin -= prof.trainCost.coin;
    state.effortSpent += prof.trainCost.effortHours;
    state.specialists.push(profId);
    log(state, 'good', `A worker becomes a ${prof.name}.`);
    return true;
  }

  /* ---------------------------------------------------------------- rounds */

  function startRound(state) {
    if (state.over) return false;
    state.round += 1;
    state.effortSpent = 0;

    drawEvent(state);

    const people = D.byId.people.get(state.peopleId);
    let die = people.effortDie;
    let flat = 0;
    for (const m of state.modifiers) {
      if (m.roundsLeft <= 0) continue;
      if (m.dieStep) die = stepDie(die, m.dieStep);
      if (m.flat) flat += m.flat;
    }

    const size = dieSize(die);
    state.dice = [];
    for (let i = 0; i < state.workers; i++) {
      const roll = 1 + Math.floor(state.rng() * size);
      state.dice.push({ value: Math.max(0, roll + flat), die, spent: false });
    }
    state.effort = state.dice.reduce((n, d) => n + d.value, 0);

    const note = flat ? ` (${flat > 0 ? '+' : ''}${flat} each)` : '';
    log(state, 'head', `— Round ${state.round} — ${state.workers} workers roll ${die}${note}: ${state.effort} hours.`);
    return true;
  }

  function drawEvent(state) {
    const deck = D.cards;
    const card = deck[Math.floor(state.rng() * deck.length)];
    state.event = card;
    log(state, 'head', `Event: ${card.name} — ${card.text}`);

    // Only the mechanical effects a single-town sandbox can honestly apply.
    for (const fx of card.effects || []) {
      if (fx.type === 'effort' && (fx.target === 'all-workers' || fx.target === 'workers-on-terrain')) {
        if (fx.op === 'flat') state.modifiers.push({ flat: fx.value, roundsLeft: fx.rounds || 1, from: card.id });
        if (fx.op === 'die-step') state.modifiers.push({ dieStep: fx.value, roundsLeft: fx.rounds || 1, from: card.id });
      }
      if (fx.type === 'crop' && fx.op === 'advance') {
        state.pending.filter((p) => p.kind === 'crop').forEach((p) => { p.roundsLeft = Math.max(0, p.roundsLeft - fx.value); });
      }
      if (fx.type === 'crop' && fx.op === 'pause') {
        state.pending.filter((p) => p.kind === 'crop').forEach((p) => { p.roundsLeft += fx.rounds || 1; });
      }
      if (fx.type === 'price' && fx.op === 'shift' && fx.family) {
        shiftBand(state, fx.family, fx.value);
      }
    }
    if (card.scope === 'offer' || card.scope === 'targeted') {
      log(state, '', 'This card needs a table decision — the sandbox leaves it to you.');
    }
  }

  /**
   * An event card shoves a whole family of prices. A line is per commodity now,
   * the way the market board's lines are, so a family shove is every line in
   * that family shoved — which is what "metals move two bands" always meant.
   */
  function shiftBand(state, family, steps) {
    const hit = D.commodities.filter((c) => c.category === family);
    if (!hit.length) return;
    const top = R.market.priceBands.length - 1;
    for (const c of hit) {
      state.bands[c.id] = clamp((state.bands[c.id] ?? R.market.startingBandIndex) + steps, 0, top);
    }
  }

  function endRound(state) {
    // 1. maturation and crops
    for (const p of state.pending) p.roundsLeft -= 1;
    const arrived = state.pending.filter((p) => p.kind === 'output' && p.roundsLeft <= 0);
    for (const p of arrived) {
      for (const o of p.outputs) give(state, o.commodity, o.qty);
      log(state, 'good', `Ready: ${p.outputs.map((o) => `${o.qty} ${D.name('commodity', o.commodity)}`).join(', ')}.`);
    }
    state.pending = state.pending.filter((p) => !(p.kind === 'output' && p.roundsLeft <= 0));
    for (const p of state.pending) {
      if (p.kind === 'crop' && p.roundsLeft === 0) log(state, 'good', `${D.name('commodity', p.crop)} is ripe.`);
    }

    // 2. construction
    for (const site of state.sites) site.rounds += 1;
    const done = state.sites.filter((s) => s.points >= s.need && s.rounds >= s.minRounds);
    for (const s of done) {
      state.buildings.push({ uid: nextUid(state), id: s.id });
      const def = D.byId.building.get(s.id);
      if (def.housing) {
        state.workers += def.housing;
        log(state, 'good', `${def.name} finished — ${UI.plural(def.housing, 'worker')} move in.`);
      } else {
        log(state, 'good', `${def.name} finished.`);
      }
    }
    state.sites = state.sites.filter((s) => !done.includes(s));

    // 3. storage overflow
    const over = usedSlots(state) - capacity(state);
    if (over > 0) {
      const sorted = Object.keys(state.stock).sort(
        (a, b) => D.valueDensity(D.byId.commodity.get(a)) - D.valueDensity(D.byId.commodity.get(b))
      );
      let toShed = Math.ceil(over / 2);
      for (const id of sorted) {
        if (toShed <= 0) break;
        const c = D.byId.commodity.get(id);
        const units = Math.min(state.stock[id], Math.ceil(toShed / c.bulk));
        take(state, id, units);
        toShed -= units * c.bulk;
        log(state, 'bad', `No room: ${units} ${c.name} lost to the weather.`);
      }
    }

    // 4. feeding — before spoilage, because you eat the fresh food first.
    feed(state);

    // 5. spoilage — the ochre die, once per perishable stack still held.
    //
    // This used to be an approximation and it is not any more. The tabletop game
    // ONCE aged each batch and lost it after `perishRounds`, which needed a token
    // per stack with an age on it, so this file lost a flat quarter instead and
    // said so. Both are gone: the rule is a die roll now (pricing.json spoil),
    // which is exactly as easy at a table as it is here, and this plays the
    // printed rule rather than an approximation of a rule nobody liked.
    rollSpoil(state);

    // 6. the Market phase
    rollMarket(state);

    // 7. tidy modifiers
    for (const m of state.modifiers) m.roundsLeft -= 1;
    state.modifiers = state.modifiers.filter((m) => m.roundsLeft > 0);

    if (state.round >= R.victory.gameLengthRounds) {
      state.over = true;
      log(state, 'head', `Game over after ${state.round} rounds. Score: ${score(state).total} points.`);
    }
    return true;
  }

  function feed(state) {
    const people = D.byId.people.get(state.peopleId);
    let need = state.workers * R.population.foodPerWorkerPerRound +
      state.specialists.length * R.population.specialistUpkeep +
      (state.peopleId === 'halfling' ? 2 : 0); // Second Breakfast: a flat town surcharge
    const eaten = [];

    // Eat what will spoil first, then whatever is cheapest per unit fed.
    const larder = Object.keys(state.stock)
      .map((id) => D.byId.commodity.get(id))
      .filter((c) => c && (c.category === 'food' || c.category === 'drink'))
      .sort((a, b) => (a.perishRounds ? 0 : 1) - (b.perishRounds ? 0 : 1) || a.baseValue - b.baseValue);

    for (const c of larder) {
      if (need <= 0) break;
      const feeds = c.id === 'bread' ? 2 : 1;
      const wanted = Math.min(state.stock[c.id], Math.ceil(need / feeds));
      if (wanted <= 0) continue;
      take(state, c.id, wanted);
      need -= wanted * feeds;
      eaten.push(`${wanted} ${c.name}`);
    }

    if (need > 0) {
      state.unrest += need * R.population.starvation.unrestPerUnfedWorker;
      log(state, 'bad', `${need} mouth(s) went unfed. Unrest is now ${state.unrest}.`);
      if (state.unrest >= R.population.starvation.unrestToRiot) {
        log(state, 'bad', 'The town is rioting — workers roll d4 until it settles.');
        state.modifiers.push({ dieStep: -2, roundsLeft: 1, from: 'riot' });
      }
    } else {
      const variety = new Set(eaten.map((e) => e.split(' ').slice(1).join(' '))).size;
      let line = `Fed the town: ${eaten.join(', ') || 'nothing needed'}.`;
      if (variety >= R.population.foodVarietyBonus.threshold) {
        state.modifiers.push({ flat: 1, roundsLeft: 1, from: 'variety' });
        line += ' A varied table — +1 effort each next round.';
      }
      if (state.unrest > 0) {
        state.unrest -= 1;
        line += ` Unrest eases to ${state.unrest}.`;
      }
      log(state, 'good', line);
    }
  }

  function score(state) {
    const parts = { buildings: 0, population: 0, luxury: 0, industry: 0 };
    for (const b of state.buildings) {
      const def = D.byId.building.get(b.id);
      parts.buildings += def.victoryPoints || (def.tier || 1);
    }
    parts.population = state.workers * 2 + state.specialists.length * 3;
    for (const id in state.stock) {
      const c = D.byId.commodity.get(id);
      if (c && c.category === 'luxury') parts.luxury += state.stock[id] * 3;
      if (c && (c.tags || []).includes('tier3')) parts.industry += state.stock[id] * 2;
    }
    parts.industry += Math.floor(state.coin / 50);
    parts.total = parts.buildings + parts.population + parts.luxury + parts.industry - state.unrest * 2;
    return parts;
  }

  function fail(state, message) {
    log(state, 'bad', message);
    return false;
  }

  /** Buildings the town could start right now, with the reason if it cannot. */
  function buildOptions(state) {
    return D.buildings
      .filter((def) => !def.perTile)
      .map((def) => {
        const blockers = [];
        if (def.requiresBuilding && !ownedBuilding(state, def.requiresBuilding)) blockers.push(`needs a ${D.name('building', def.requiresBuilding)}`);
        if (def.requiresDeposit && !state.deposits.includes(def.requiresDeposit)) blockers.push(`needs a ${D.name('deposit', def.requiresDeposit)}`);
        if (def.requiresDepositAny && !def.requiresDepositAny.some((d) => state.deposits.includes(d))) blockers.push('needs a revealed deposit');
        if (def.terrain && !def.terrain.some((t) => state.terrain.includes(t)) &&
            !(def.orWaterside && waterside(state, def.orWaterside))) blockers.push('wrong terrain');
        if (def.waterside && !waterside(state, def.waterside)) blockers.push(`not waterside on ${def.waterside === 'sea' ? 'the sea' : def.waterside + ' water'}`);
        if (def.unique === 'per-town' && ownedBuilding(state, def.id)) blockers.push('already built');
        const short = (def.cost || []).filter((c) => !has(state, c.commodity, c.qty));
        if (short.length) blockers.push('short of ' + short.map((c) => `${c.qty} ${D.name('commodity', c.commodity)}`).join(', '));
        return { def, blockers, runnable: blockers.length === 0 };
      });
  }

  global.Engine = {
    newGame, startRound, endRound,
    jobs, runJob, foundSite, workSite, buildOptions, buildRateFor,
    trade, priceOf, marketOf, rollMarket, rollSpoil, spend, craftTool, buyTool, trainSpecialist,
    battle, canFlee, manaFrom, depletionModifier,
    score, usedSlots, capacity, remainingEffort, findTool, ownedBuilding,
    toolMax,
  };
})(window);
