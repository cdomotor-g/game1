/*
 * Indexes and graph queries over the generated bundle.
 *
 * Everything here is derived — no game rules live in this file. If you find
 * yourself writing "and then the player pays…" in here, it belongs in engine.js.
 */
(function (global) {
  'use strict';

  const D = global.GAME_DATA;
  if (!D) throw new Error('web/data/bundle.js is missing. Run: node tools/build-data.mjs');

  const commodities = D.commodities.commodities;
  const tools = D.tools.tools;
  const buildings = D.buildings.buildings;
  const recipes = D.recipes.recipes;
  const terrains = D.terrain.terrains;
  const deposits = D.deposits.deposits;
  const modes = D.transport.modes;
  const figures = D.transport.figures;
  const peoples = D.peoples.peoples;
  const professions = D.peoples.professions;
  const cards = D.events.cards;
  const items = D.items.items;

  const index = (arr) => new Map(arr.map((x) => [x.id, x]));

  const byId = {
    commodity: index(commodities),
    tool: index(tools),
    building: index(buildings),
    recipe: index(recipes),
    terrain: index(terrains),
    deposit: index(deposits),
    mode: index(modes),
    figure: index(figures),
    people: index(peoples),
    profession: index(professions),
    card: index(cards),
    item: index(items),
  };

  /** All input/output pairs a recipe supports, primary first. */
  function variants(recipe) {
    const base = { inputs: recipe.inputs || [], outputs: recipe.outputs || [], primary: true };
    const alts = (recipe.alternatives || []).map((a) => ({
      inputs: a.inputs || [],
      outputs: a.outputs || [],
      primary: false,
    }));
    return [base, ...alts];
  }

  /** Fuel bundle options for a recipe, or [] if it burns nothing. */
  function fuelOptions(recipe) {
    if (!recipe.fuel) return [];
    return (D.recipes.fuelOptions[recipe.fuel] || []).filter((o) => o && o.inputs);
  }

  const producerIndex = new Map();
  const consumerIndex = new Map();

  function push(map, key, value) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    const list = map.get(key);
    if (!list.includes(value)) list.push(value);
  }

  for (const r of recipes) {
    for (const v of variants(r)) {
      v.outputs.forEach((o) => push(producerIndex, o.commodity, r));
      v.inputs.forEach((i) => push(consumerIndex, i.commodity, r));
    }
    fuelOptions(r).forEach((opt) => opt.inputs.forEach((i) => push(consumerIndex, i.commodity, r)));
  }
  for (const table of Object.values(D.recipes.rollTables || {})) {
    for (const res of Object.values(table.results || {})) {
      (res.outputs || []).forEach((o) => {
        const owner = recipes.find((r) => r.rollTable && D.recipes.rollTables[r.rollTable] === table);
        if (owner) push(producerIndex, o.commodity, owner);
      });
    }
  }

  const producersOf = (id) => producerIndex.get(id) || [];
  const consumersOf = (id) => consumerIndex.get(id) || [];

  /** Buildings whose construction cost includes this commodity. */
  const buildingsUsing = (id) => buildings.filter((b) => (b.cost || []).some((c) => c.commodity === id));
  const toolsUsing = (id) => tools.filter((t) => (t.craft?.inputs || []).some((c) => c.commodity === id));
  const itemsUsing = (id) => items.filter((it) => (it.inputs || []).some((c) => c.commodity === id));

  /** Recipes that can be run at a given building. */
  const recipesAt = (buildingId) =>
    recipes.filter((r) => r.site?.building === buildingId || r.site?.orBuilding === buildingId);

  /** Recipes runnable on bare terrain (no building needed). */
  const recipesOnTerrain = (terrainId) =>
    recipes.filter((r) => (r.site?.terrain || []).includes(terrainId) || (r.site?.orTerrain || []).includes(terrainId));

  const recipesUsingTool = (toolId) => recipes.filter((r) => r.tool === toolId);

  /**
   * Depth-first production chain for a commodity.
   * Returns a tree of { commodity, qty, via (recipe), children }, cycle-safe.
   */
  function chain(commodityId, depth, seen) {
    depth = depth === undefined ? 4 : depth;
    seen = seen || new Set();
    const node = { commodity: commodityId, via: null, children: [], terminal: false };
    if (depth <= 0 || seen.has(commodityId)) {
      node.terminal = true;
      return node;
    }
    const recipe = producersOf(commodityId)[0];
    if (!recipe) {
      node.terminal = true;
      return node;
    }
    node.via = recipe;
    const next = new Set(seen);
    next.add(commodityId);
    const variant = variants(recipe).find((v) => v.outputs.some((o) => o.commodity === commodityId)) || variants(recipe)[0];
    for (const input of variant.inputs) {
      node.children.push(Object.assign(chain(input.commodity, depth - 1, next), { qty: input.qty }));
    }
    const fuel = fuelOptions(recipe)[0];
    if (fuel) {
      for (const f of fuel.inputs) {
        node.children.push(Object.assign(chain(f.commodity, depth - 1, next), { qty: f.qty, isFuel: true }));
      }
    }
    return node;
  }

  /** How deep the cheapest chain to this commodity goes. Raw materials are tier 0. */
  const tierCache = new Map();
  function tierOf(commodityId, guard) {
    if (tierCache.has(commodityId)) return tierCache.get(commodityId);
    guard = guard || new Set();
    if (guard.has(commodityId)) return 0;
    guard.add(commodityId);
    const recipe = producersOf(commodityId)[0];
    let tier = 0;
    if (recipe) {
      const variant = variants(recipe).find((v) => v.outputs.some((o) => o.commodity === commodityId));
      const inputs = (variant ? variant.inputs : []).concat(fuelOptions(recipe)[0]?.inputs || []);
      tier = inputs.length ? 1 + Math.max(...inputs.map((i) => tierOf(i.commodity, guard))) : 0;
    }
    guard.delete(commodityId);
    tierCache.set(commodityId, tier);
    return tier;
  }

  /** Total effort hours to make one unit from scratch, ignoring what you already hold. */
  function effortToProduce(commodityId, guard) {
    guard = guard || new Set();
    if (guard.has(commodityId)) return 0;
    const recipe = producersOf(commodityId)[0];
    if (!recipe) return 0;
    guard.add(commodityId);
    const variant = variants(recipe).find((v) => v.outputs.some((o) => o.commodity === commodityId)) || variants(recipe)[0];
    const yielded = variant.outputs.find((o) => o.commodity === commodityId)?.qty || 1;
    const inputs = variant.inputs.concat(fuelOptions(recipe)[0]?.inputs || []);
    let total = recipe.effortHours || 0;
    for (const i of inputs) total += effortToProduce(i.commodity, guard) * i.qty;
    guard.delete(commodityId);
    return total / yielded;
  }

  /** Coin value per storage slot — the number that decides what is worth shipping. */
  function valueDensity(commodity) {
    return commodity.bulk ? commodity.baseValue / commodity.bulk : commodity.baseValue;
  }

  function search(query) {
    const groups = [
      ['commodity', 'Commodities', commodities],
      ['recipe', 'Recipes', recipes],
      ['building', 'Buildings', buildings],
      ['tool', 'Tools', tools],
      ['item', 'Items', items],
      ['terrain', 'Terrain', terrains],
      ['deposit', 'Deposits', deposits],
      ['card', 'Events', cards],
      ['people', 'Peoples', peoples],
      ['mode', 'Transport', modes],
    ];
    const out = [];
    for (const [kind, label, list] of groups) {
      const hits = list.filter((e) => UI.matches(e, query));
      if (hits.length) out.push({ kind, label, hits });
    }
    return out;
  }

  global.GameData = {
    raw: D,
    rules: D.rules,
    commodities, tools, buildings, recipes, terrains, deposits,
    modes, figures, peoples, professions, cards, items,
    categories: {
      commodity: D.commodities.categories,
      building: D.buildings.categories,
      recipe: D.recipes.categories,
      event: D.events.categories,
      item: D.items.classes,
    },
    byId,
    variants, fuelOptions,
    producersOf, consumersOf, buildingsUsing, toolsUsing, itemsUsing,
    recipesAt, recipesOnTerrain, recipesUsingTool,
    chain, tierOf, effortToProduce, valueDensity, search,
    name(kind, id) {
      const entry = byId[kind]?.get(id);
      return entry ? entry.name : UI.titleize(id || '?');
    },
  };
})(window);
