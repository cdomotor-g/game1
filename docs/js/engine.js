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
 * the red, blue and green dice, the swing ruler, and the tally and memory that
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
         where the price token stands, where the memory bar stands, where the
         tally bar stands, and how many the board will still sell this round. */
      bands: {},
      memory: {},
      tally: {},
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

  function toolMax(tool) {
    const def = D.byId.tool.get(tool.id);
    const size = R.tools.sizes.find((x) => x.id === tool.size) || R.tools.sizes[0];
    return Math.round(def.baseDurability * size.durabilityMultiplier);
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

    for (const i of variant.inputs) take(state, i.commodity, i.qty);
    if (fuel) for (const i of fuel.inputs) take(state, i.commodity, i.qty);
    state.effortSpent += hours;

    let multiplier = peopleBonus(state, recipe);
    let tool = null;
    if (recipe.tool) {
      tool = findTool(state, recipe.tool);
      multiplier = toolOutputMultiplier(tool);
      const wearRate = state.peopleId === 'orc' ? 2 : R.tools.wearPerEffortHour;
      tool.wear = Math.min(tool.max, tool.wear + hours * wearRate);
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
      bonus.tool.wear = Math.min(bonus.tool.max, bonus.tool.wear + hours * R.tools.wearPerEffortHour);
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
      t.wear = Math.min(t.max, t.wear + hours * R.tools.wearPerEffortHour);
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
   * data/pricing.json, played. The tabletop rule is: roll two red dice for
   * demand and two blue for supply, add the line's memory, multiply by the
   * green die, read the net on the swing ruler and walk the price token that
   * many bands. Everything below is that, with the dice rolled by the engine's
   * own RNG so a seed replays a market exactly.
   *
   * NOTHING here is a number this file invented. The bands are rules.json, the
   * dice, the ruler, the memory range and the three models are pricing.json,
   * and the model a commodity runs under is on the commodity.
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
  const towardZero = (n) => (n < 0 ? Math.ceil(n) : Math.floor(n));
  const rulerMove = (net) => {
    const bin = P.ruler.bins.find((b) => net >= b.from && net <= b.to);
    return bin ? bin.move : 0;
  };

  /** Setup: every token on the starting band, both bars at their zero, and one
      supply roll each so the board has something to sell in round one. */
  function dealTheBoard(state) {
    for (const c of D.commodities) {
      state.bands[c.id] = R.market.startingBandIndex;
      state.memory[c.id] = P.memory.start;
      state.tally[c.id] = P.memory.tally.start;
      state.marketStock[c.id] = rollDice(state, diceSet('supply'));
    }
  }

  /** One line's market, rolled and read. Returns what happened, for the log. */
  function rollLine(state, commodityId) {
    const demand = rollDice(state, diceSet('demand'));
    const supply = rollDice(state, diceSet('supply'));
    const green = rollDice(state, diceSet('elasticity'));
    const step = P.elasticity.steps.find((s) => s.faces.includes(green)) || P.elasticity.steps[0];
    const memory = state.memory[commodityId] ?? 0;
    const net = towardZero((demand - supply + memory) * step.multiply);

    const was = state.bands[commodityId] ?? R.market.startingBandIndex;
    const top = R.market.priceBands.length - 1;
    const now = clamp(was + rulerMove(net), 0, top);
    state.bands[commodityId] = now;
    /* The board sells no more than it has: this round's supply roll is the cap,
       and buying draws it down (pricing.json stockCap). */
    state.marketStock[commodityId] = supply;
    return { demand, supply, green, step, memory, net, moved: now - was };
  }

  /**
   * What the market learned this round. Three rules, one per model, and each of
   * them is a piece of wood being moved on a printed strip — there is nothing
   * here a table could not do without writing anything down.
   */
  function updateMemory(state, commodityId, moved) {
    const model = modelOf(commodityId);
    const range = model.memory;
    const t = model.tally;
    let mem = state.memory[commodityId] ?? 0;

    if (range.followsPrice) {
      /* Hype: the memory moves in the same gesture as the price token. */
      if (moved > 0) mem += 1;
      else if (moved < 0) mem -= 1;
      else if (range.decayToZero === 'no-move') mem -= Math.sign(mem);
    } else if (t.uses && range.decayToZero === 'empty-tally'
               && (state.tally[commodityId] ?? 0) <= P.memory.tally.from) {
      /* Glut: a market forgets last year's glut as soon as it runs short. The
         discharge itself is not here — it happened in the trade that caused it
         (walkTally), which is where a hand would have done it. */
      mem -= Math.sign(mem);
    }
    state.memory[commodityId] = clamp(mem, range.from, range.to);
  }

  /**
   * The Market phase: every line rolled, then every line's memory updated.
   *
   * The printed board holds six lines and a town trades six commodities; a
   * sandbox has no such limit, so it rolls all of them and reports only what
   * the player is holding or what moved furthest. Every line is rolled either
   * way — a market you are not watching still moves, which is the whole point
   * of it being a market rather than a price list.
   */
  function rollMarket(state) {
    const moved = [];
    for (const c of D.commodities) {
      const roll = rollLine(state, c.id);
      updateMemory(state, c.id, roll.moved);
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
        `${roll.memory ? `, memory ${roll.memory > 0 ? '+' : ''}${roll.memory}` : ''}).`);
    }
    log(state, '', `Market: ${moved.length} of ${D.commodities.length} lines moved.`);
    return moved;
  }

  /** Everything a market line is holding right now, for the sandbox to show. */
  function marketOf(state, commodityId) {
    const model = modelOf(commodityId);
    return {
      band: state.bands[commodityId] ?? R.market.startingBandIndex,
      memory: state.memory[commodityId] ?? 0,
      tally: state.tally[commodityId] ?? 0,
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

  /**
   * The tally bar, walked as the trade happens. A glut line takes stock on when
   * you sell to it and gives it back when you buy; a depletion line takes it on
   * and never gives it back, because the ore is out of the ground. Which of
   * those it is comes off the commodity's model, never off a special case here.
   */
  function walkTally(state, commodityId, when, qty) {
    const model = modelOf(commodityId);
    const t = model.tally;
    if (!t.uses || !t[when]) return;
    const { from, to } = P.memory.tally;
    let n = (state.tally[commodityId] ?? from) + t[when] * qty;
    /* A ratchet, not a clamp. Every `to` tokens the bar steps past the end of
       the strip, which takes it back to empty and moves the memory one cell —
       and whatever is left over starts the next tally, so nothing is lost to a
       bar that had nowhere further to go. */
    while (n > to) {
      n -= to - from;
      state.memory[commodityId] = clamp(
        (state.memory[commodityId] ?? 0) + t.dischargeStep, model.memory.from, model.memory.to
      );
    }
    state.tally[commodityId] = Math.max(from, n);
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
      walkTally(state, commodityId, 'onBuy', qty);
      log(state, '', `Bought ${qty} ${D.name('commodity', commodityId)} for ${total}${R.currency.symbol}.`);
    } else {
      if (!has(state, commodityId, qty)) return fail(state, 'Not enough in the stockpile.');
      take(state, commodityId, qty);
      state.coin += total;
      walkTally(state, commodityId, 'onSell', qty);
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

    // 5. spoilage
    // SIMPLIFIED: the tabletop game ages each batch and loses it after `perishRounds`.
    // Tracking batch ages needs board space the sandbox does not have, so what is
    // left after the meal loses a quarter of its stack, unless a granary shelters it.
    let sheltered = countBuilding(state, 'granary') * (D.byId.building.get('granary').storage || 0);
    for (const id of Object.keys(state.stock)) {
      const c = D.byId.commodity.get(id);
      if (!c || !c.perishRounds) continue;
      const bulk = c.bulk * state.stock[id];
      if (sheltered >= bulk) { sheltered -= bulk; continue; }
      const lost = Math.ceil(state.stock[id] * 0.25);
      take(state, id, lost);
      log(state, 'bad', `${lost} ${c.name} spoiled.`);
    }

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
    trade, priceOf, marketOf, rollMarket, craftTool, buyTool, trainSpecialist,
    score, usedSlots, capacity, remainingEffort, findTool, ownedBuilding,
    toolMax,
  };
})(window);
