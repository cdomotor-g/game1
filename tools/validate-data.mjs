#!/usr/bin/env node
/**
 * Referential-integrity check across data/*.json, driven by data/manifest.json.
 *
 * There is no dependency on a JSON Schema library on purpose: the useful errors
 * in a game dataset are almost never "wrong type", they are "you renamed a
 * commodity and forgot the six recipes that used it".
 *
 * Usage: node tools/validate-data.mjs [--quiet]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readTiles, tileSubjects, cellsOf, connected, bandOf, groundOf, bandFor, worldHexMm, plateIdOf, platesOf } from './lib/tiles.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const quiet = process.argv.includes('--quiet');

const errors = [];
const warnings = [];

function readJson(file) {
  const raw = readFileSync(join(DATA, file), 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`${file}: not valid JSON - ${err.message}`);
    return null;
  }
}

const manifest = readJson('manifest.json');
if (!manifest) {
  console.error('manifest.json is unreadable; nothing else can be checked.');
  process.exit(1);
}

/** dataset key -> parsed file */
const datasets = {};
for (const ds of manifest.datasets) {
  const parsed = readJson(ds.file);
  if (parsed) datasets[ds.key] = parsed;
}

/** Every file in data/ should be in the manifest, or it will silently rot. */
const known = new Set(['manifest.json', ...manifest.datasets.map((d) => d.file)]);
for (const file of readdirSync(DATA)) {
  if (file.endsWith('.json') && !known.has(file)) {
    warnings.push(`data/${file} exists but is not listed in manifest.json`);
  }
}

/** "terrain.features" -> the array of features inside terrain.json */
function resolveCollection(spec) {
  const [key, sub] = spec.split('.');
  const ds = datasets[key];
  const meta = manifest.datasets.find((d) => d.key === key);
  if (!ds || !meta) return null;
  const arr = sub ? ds[sub] : ds[meta.collection];
  return Array.isArray(arr) ? arr : null;
}

const idSets = new Map();
function idsOf(spec) {
  if (!idSets.has(spec)) {
    const arr = resolveCollection(spec);
    idSets.set(spec, arr ? new Set(arr.map((x) => x.id)) : null);
  }
  return idSets.get(spec);
}

/** Walk a dotted path with `[]` fan-out, collecting {value, where} pairs. */
function collect(root, path, label) {
  const parts = path.split('.');
  let cursor = [{ value: root, where: label }];
  for (const part of parts) {
    const fanOut = part.endsWith('[]');
    const key = fanOut ? part.slice(0, -2) : part;
    const next = [];
    for (const node of cursor) {
      if (node.value == null || typeof node.value !== 'object') continue;
      const child = node.value[key];
      if (child == null) continue;
      if (fanOut) {
        if (!Array.isArray(child)) continue;
        child.forEach((v, i) => {
          const name = v && typeof v === 'object' && v.id ? v.id : i;
          next.push({ value: v, where: `${node.where}.${key}[${name}]` });
        });
      } else {
        next.push({ value: child, where: `${node.where}.${key}` });
      }
    }
    cursor = next;
  }
  return cursor;
}

/* --- 1. duplicate ids within each collection ------------------------------ */
for (const ds of manifest.datasets) {
  if (!ds.collection || !datasets[ds.key]) continue;
  const arr = datasets[ds.key][ds.collection];
  if (!Array.isArray(arr)) {
    errors.push(`${ds.file}: expected an array at "${ds.collection}"`);
    continue;
  }
  const seen = new Set();
  for (const entry of arr) {
    if (!entry.id) errors.push(`${ds.file}: an entry in "${ds.collection}" has no id`);
    else if (seen.has(entry.id)) errors.push(`${ds.file}: duplicate id "${entry.id}"`);
    else seen.add(entry.id);
    if (!entry.name) warnings.push(`${ds.file}: "${entry.id}" has no name`);
  }
}

/* --- 2. cross-file references --------------------------------------------- */
for (const check of manifest.references.checks) {
  const root = datasets[check.from];
  if (!root) continue;
  const valid = idsOf(check.to);
  if (!valid) {
    errors.push(`manifest: reference target "${check.to}" does not resolve to a collection`);
    continue;
  }
  const allow = new Set(check.allow || []);
  for (const hit of collect(root, check.path, check.from)) {
    const v = hit.value;
    if (v == null || typeof v === 'object') continue;
    if (allow.has(v)) continue;
    if (!valid.has(v)) {
      errors.push(`${check.from}: ${hit.where} = "${v}" is not a known ${check.to}`);
    }
  }
}

/* --- 3. game-specific sanity ---------------------------------------------- */
const recipes = datasets.recipes?.recipes ?? [];
const commodities = datasets.commodities?.commodities ?? [];
const buildings = datasets.buildings?.buildings ?? [];

// Every commodity should be obtainable somehow, or it is a dead entry.
const produced = new Set();
for (const r of recipes) for (const o of r.outputs ?? []) produced.add(o.commodity);
for (const r of recipes) for (const alt of r.alternatives ?? []) for (const o of alt.outputs ?? []) produced.add(o.commodity);
for (const table of Object.values(datasets.recipes?.rollTables ?? {})) {
  for (const res of Object.values(table.results ?? {})) for (const o of res.outputs ?? []) produced.add(o.commodity);
}
for (const c of commodities) {
  if (produced.has(c.id)) continue;
  if ((c.tags ?? []).includes('import-only')) continue; // deliberately unobtainable except by trade
  warnings.push(`commodities: "${c.id}" is not the output of any recipe or roll table`);
}

// Every commodity should be wanted by something, or it is a dead end.
const consumed = new Set();
const eat = (list) => { for (const i of list ?? []) consumed.add(i.commodity); };
for (const r of recipes) { eat(r.inputs); for (const alt of r.alternatives ?? []) eat(alt.inputs); }
for (const b of buildings) eat(b.cost);
for (const t of datasets.tools?.tools ?? []) eat(t.craft?.inputs);
for (const i of datasets.items?.items ?? []) eat(i.inputs);
for (const m of datasets.transport?.modes ?? []) {
  eat(m.craft?.inputs);
  eat(m.fuelPerTile);
  eat(m.packaging);
  if (m.upgrade) consumed.add(m.upgrade.commodity);
}
for (const bundle of Object.values(datasets.recipes?.fuelOptions ?? {})) {
  if (Array.isArray(bundle)) for (const opt of bundle) eat(opt.inputs);
}
for (const c of commodities) {
  const isFood = c.category === 'food' || c.category === 'drink';
  const isLuxury = c.category === 'luxury';
  if (!consumed.has(c.id) && !isFood && !isLuxury) {
    warnings.push(`commodities: "${c.id}" is never consumed by anything`);
  }
}

// A recipe and its tool must agree, in both directions. `toolBonus` is the
// optional form: the tool improves the job rather than gating it.
const toolEnables = new Map((datasets.tools?.tools ?? []).map((t) => [t.id, new Set(t.enables ?? [])]));
const toolOf = (r) => r.tool || r.toolBonus?.tool || null;
for (const r of recipes) {
  const toolId = toolOf(r);
  if (!toolId) continue;
  const set = toolEnables.get(toolId);
  if (set && !set.has(r.id)) {
    errors.push(`tools: "${toolId}" is used by recipe "${r.id}" but does not list it in enables`);
  }
  if (r.tool && r.toolBonus) {
    errors.push(`recipes: "${r.id}" has both a required tool and a toolBonus — pick one`);
  }
}
for (const [toolId, set] of toolEnables) {
  for (const recipeId of set) {
    const r = recipes.find((x) => x.id === recipeId);
    if (r && toolOf(r) && toolOf(r) !== toolId) {
      warnings.push(`tools: "${toolId}" claims to enable "${recipeId}", but that recipe uses "${toolOf(r)}"`);
    }
    if (!r) warnings.push(`tools: "${toolId}" lists unknown recipe "${recipeId}" in enables`);
  }
}

// A tool marked optional must not be the hard requirement of anything.
for (const t of datasets.tools?.tools ?? []) {
  if (!t.optional) continue;
  const gated = recipes.filter((r) => r.tool === t.id);
  if (gated.length) {
    errors.push(`tools: "${t.id}" is marked optional but gates ${gated.map((r) => r.id).join(', ')}`);
  }
}

// Recipe fuel bundles must exist.
const fuelBundles = new Set(Object.keys(datasets.recipes?.fuelOptions ?? {}).filter((k) => !k.startsWith('$')));
for (const r of recipes) {
  if (r.fuel && !fuelBundles.has(r.fuel)) errors.push(`recipes: "${r.id}" uses unknown fuel bundle "${r.fuel}"`);
  if (r.rollTable && !datasets.recipes.rollTables?.[r.rollTable]) {
    errors.push(`recipes: "${r.id}" uses unknown roll table "${r.rollTable}"`);
  }
}

// Mass and strength are one system: an item weighs, a figure lifts, and what a
// figure lifts is its strength times a factor - there is no second number for it
// any more and no bar to print it on, so the checks are about whether the factor
// leaves the deck playable rather than about whether a ladder fits.
const carrying = datasets.rules?.carrying;
const peoples = datasets.peoples?.peoples ?? [];
const characters = datasets.characters?.characters ?? [];
const itemList = datasets.items?.items ?? [];
const kgPerStrength = carrying?.kgPerStrength;

if (!carrying) errors.push('rules: no "carrying" block - items have mass and nothing says what it is for');
if (typeof kgPerStrength !== 'number' || kgPerStrength <= 0) {
  errors.push('rules: carrying.kgPerStrength is what turns a strength into kilograms - without it no card can print a limit');
}
for (const i of itemList) {
  if (typeof i.massKg !== 'number') errors.push(`items: "${i.id}" has no massKg`);
  else if (i.massKg <= 0) errors.push(`items: "${i.id}" has massKg ${i.massKg} - an item weighs something`);
}

const massOf = new Map(itemList.map((i) => [i.id, i.massKg]));
const carryOf = (strength) => (strength ?? 0) * (kgPerStrength ?? 0);
const biggestCarry = Math.max(
  0,
  ...characters.map((c) => carryOf(c.strength)),
  ...peoples.map((p) => carryOf(p.strength?.base)),
);

for (const c of characters) {
  /* A character who cannot pick up the kit they are printed as starting with is
     a character whose first turn is a rules argument. */
  const kit = (c.startsWith ?? []).reduce((sum, id) => sum + (massOf.get(id) ?? 0), 0);
  const limit = carryOf(c.strength);
  if (kit > limit) {
    errors.push(`characters: "${c.id}" starts with ${kit}kg of gear and strength ${c.strength} carries ${limit}kg`);
  }
}

for (const i of itemList) {
  if (typeof i.massKg === 'number' && i.massKg > biggestCarry) {
    warnings.push(`items: "${i.id}" weighs ${i.massKg}kg - more than any figure in the game can carry`);
  }
}

// Every terrain carries a MAP MARK, and no two carry the same one.
//
// The mark is the drawn symbol for that ground - a grass tuft, a conifer, a peak
// - and it is data on the terrain exactly as an element's mark is data on the
// element (components.json marks.terrain says how to draw one). A mini-map field
// is patterned with it, so a terrain with no mark is a sheet with no ground; two
// terrains sharing one is a sheet that lies about which ground it is.
{
  const seen = new Map();
  for (const t of datasets.terrain?.terrains ?? []) {
    const mark = t.mark;
    if (!mark?.path) {
      errors.push(`terrain: "${t.id}" has no mark - components.json marks.terrain has nothing to draw for it`);
      continue;
    }
    if (!mark.id) errors.push(`terrain: "${t.id}" has a mark with no id`);
    else if (seen.has(mark.id)) {
      errors.push(`terrain: "${t.id}" and "${seen.get(mark.id)}" both draw the "${mark.id}" mark - one ground, one symbol`);
    } else seen.set(mark.id, t.id);
  }
}

// Waterside: the relationship that replaced the coast terrain.
//
// A shore is not a kind of ground, so nothing declares it as a terrain any more
// (terrain.json siting.waterside). What a building or a recipe declares instead
// is WHICH WATER it wants beside it - "any", "fresh" or "sea" - and those three
// words are a vocabulary, which means they can be misspelt. This is the check
// that catches a dock asking for "coastal" water and getting nothing.
const waterside = datasets.terrain?.siting?.waterside;
if (!waterside) {
  errors.push('terrain: no siting.waterside - the coast terrain is gone and nothing says what took its job');
} else {
  const kinds = new Set(Object.keys(waterside.kinds ?? {}).filter((k) => !k.startsWith('$')));
  const terrainIds = idsOf('terrain') ?? new Set();
  for (const [kind, list] of Object.entries(waterside.kinds ?? {})) {
    if (kind.startsWith('$')) continue;
    for (const id of list) {
      if (!terrainIds.has(id)) errors.push(`terrain: siting.waterside.kinds.${kind} names "${id}", which is not a terrain`);
      else if (datasets.terrain.terrains.find((t) => t.id === id)?.family !== 'water') {
        errors.push(`terrain: siting.waterside.kinds.${kind} names "${id}", which is not water - a waterside tile is beside WATER`);
      }
    }
  }
  const sited = [
    ...(datasets.buildings?.buildings ?? []).flatMap((b) => [
      [`buildings: "${b.id}" waterside`, b.waterside],
      [`buildings: "${b.id}" orWaterside`, b.orWaterside],
    ]),
    ...(datasets.recipes?.recipes ?? []).flatMap((r) => [
      [`recipes: "${r.id}" site.waterside`, r.site?.waterside],
      [`recipes: "${r.id}" site.orWaterside`, r.site?.orWaterside],
    ]),
  ];
  for (const [label, want] of sited) {
    if (want === undefined) continue;
    if (!kinds.has(want)) {
      errors.push(`${label} wants "${want}" water beside it; terrain.json siting.waterside.kinds declares ${[...kinds].join(', ')}`);
    }
  }
}

// The summary strip on a card and the tracks on the board have to call a number
// by the same name, or a player setting up reads H off a card and looks for a
// letter that is not on the board.
const stripLetters = datasets.components?.statStrip?.letters ?? {};
for (const t of datasets.playerboard?.tracks ?? []) {
  const onStrip = stripLetters[t.id];
  if (onStrip === undefined) continue;
  if (onStrip !== t.letter) {
    errors.push(`components: the strip letters "${t.id}" ${onStrip} and the board letters it ${t.letter} - a card and a board may not call one number two things`);
  }
}

// The player board, and the ceiling it puts on the whole game.
//
// Every track runs the same range, 0 to a printed maximum, and that maximum is
// not the board's business alone: a character with 15 health or a hull of 15
// would walk its token off the top and nobody would notice until
// it was printed. So the board declares what has to fit, and it is all checked
// here rather than trusted.
const boardSpec = datasets.playerboard;
const boardShape = datasets.components?.board;

/** "characters.characters[].health" -> every number at that path. */
function valuesAt(qualified) {
  const dot = qualified.indexOf('.');
  const key = qualified.slice(0, dot);
  const path = qualified.slice(dot + 1);
  const root = datasets[key];
  if (!root) return null;
  return collect(root, path, key).map((hit) => hit.value).filter((v) => typeof v === 'number');
}

if (boardSpec && boardShape) {
  const { from, to } = boardShape.track;
  const letters = new Set();

  for (const t of boardSpec.tracks ?? []) {
    if (t.letter?.length !== 1) errors.push(`playerboard: track "${t.id}" needs a single-letter head, not "${t.letter}"`);
    else if (letters.has(t.letter)) errors.push(`playerboard: two tracks are called "${t.letter}" - a player has to be able to say which one`);
    else letters.add(t.letter);

    let step = t.step;
    if (step === undefined && t.stepFrom) {
      const [key, ...rest] = t.stepFrom.split('.');
      let node = datasets[key];
      for (const part of rest) node = node?.[part];
      step = node;
      if (typeof step !== 'number') {
        errors.push(`playerboard: track "${t.id}" reads its step from "${t.stepFrom}", which does not resolve to a number`);
        continue;
      }
    }
    if (typeof step !== 'number' || step <= 0) {
      errors.push(`playerboard: track "${t.id}" has no step - a rung has to be worth something`);
      continue;
    }
    if (t.kind === 'harm' && step !== 1) {
      errors.push(`playerboard: track "${t.id}" is a harm track stepping ${step} - a harm track never skip-counts (components.json bars.harm)`);
    }

    const covers = t.covers;
    if (typeof covers?.value !== 'number') {
      errors.push(`playerboard: track "${t.id}" does not say what it has to cover`);
      continue;
    }
    /* The number is restated on the track so the board can be checked without
       the whole ruleset in context; the paths are what stop it going stale. */
    for (const qualified of covers.paths ?? []) {
      const found = valuesAt(qualified);
      if (!found) {
        errors.push(`playerboard: track "${t.id}" points at "${qualified}", whose dataset is not in the manifest`);
        continue;
      }
      const max = found.length ? Math.max(...found) : null;
      if (max !== null && max > covers.value) {
        errors.push(`playerboard: track "${t.id}" says it covers ${covers.value}, but ${qualified} now tops out at ${max}`);
      }
    }
    if (to * step < covers.value) {
      errors.push(`playerboard: the ${t.label} track runs to ${to * step}, and has to cover ${covers.value} - the token would walk off the top`);
    }
  }

  /* The board's ceiling is the game's ceiling. This is the sweep that keeps it
     true: every number a token walks, checked against the top rung. */
  for (const qualified of boardSpec.ceiling?.paths ?? []) {
    const found = valuesAt(qualified);
    if (!found) {
      errors.push(`playerboard: ceiling path "${qualified}" does not resolve to a dataset`);
      continue;
    }
    const over = found.filter((v) => v > to || v < from);
    if (over.length) {
      errors.push(`playerboard: ${qualified} has ${over.length} value(s) outside the board's ${from}-${to} - ${[...new Set(over)].sort((a, b) => b - a).join(', ')}`);
    }
  }

  /* The slots take cards from somewhere, and "somewhere" has to be a dataset. */
  const datasetKeys = new Set(manifest.datasets.map((d) => d.key));
  for (const slot of boardSpec.slots ?? []) {
    for (const takes of slot.takes ?? []) {
      if (!datasetKeys.has(takes)) errors.push(`playerboard: slot "${slot.id}" takes "${takes}", which is not a dataset`);
    }
  }

  /* The board's geometry is what is left over once the cards have had theirs,
     so adding a track or growing a card silently narrows the columns. Below the
     width of the token that walks them, the board has run out of room. */
  const card = datasets.components.stock.card;
  const slotW = card.widthMm + 2 * boardShape.slot.clearanceMm;
  const contentW = boardShape.sheet.widthMm - 2 * boardShape.marginMm;
  const kitCount = (boardSpec.slots ?? []).find((s) => s.id === 'kit')?.count ?? 0;
  const kitW = 2 * slotW + boardShape.gutterMm;
  const columnW = (contentW - slotW - kitW - 2 * boardShape.gutterMm) / (boardSpec.tracks?.length || 1);
  const tokenMm = datasets.components.tokens?.bar?.diameterMm ?? 7;
  if (columnW < tokenMm + 2) {
    errors.push(`playerboard: ${boardSpec.tracks.length} tracks leave ${columnW.toFixed(1)}mm a column, and the token that walks them is ${tokenMm}mm - the board has run out of middle`);
  }
  if (kitCount % 2 !== 0) {
    warnings.push(`playerboard: ${kitCount} kit slots do not fill the two columns the board draws them in`);
  }
}

// Strength is on both sides of every fight, so both sides have to have one, and
// a character should not wander far from what their people are built like.
const strengthOf = new Map(peoples.map((p) => [p.id, p.strength?.base]));
for (const p of peoples) {
  if (typeof p.strength?.base !== 'number') errors.push(`peoples: "${p.id}" has no strength.base - strength is a difference, and a difference needs both sides`);
}
for (const c of characters) {
  if (typeof c.strength !== 'number' || c.strength <= 0) {
    errors.push(`characters: "${c.id}" has no strength - every fight reads one off the card`);
    continue;
  }
  const base = strengthOf.get(c.people);
  if (typeof base === 'number' && Math.abs(c.strength - base) > 2) {
    warnings.push(`characters: "${c.id}" is strength ${c.strength} against a ${c.people} base of ${base} - a long way off their people`);
  }
}
for (const m of datasets.monsters?.monsters ?? []) {
  if (typeof m.strength !== 'number' || m.strength <= 0) {
    errors.push(`monsters: "${m.id}" has no strength - it is half of every attack roll it makes`);
  }
}

// Defence is the other half, and the half a fight is actually resolved against:
// the attacker adds it to the number they need. A figure without one cannot be
// attacked by the rules as written, so every figure in the game has to carry it.
for (const p of peoples) {
  if (typeof p.defence?.base !== 'number') errors.push(`peoples: "${p.id}" has no defence.base - every attack roll adds a defence to the number it needs`);
}
const defenceOf = new Map(peoples.map((p) => [p.id, p.defence?.base]));
for (const c of characters) {
  if (typeof c.defence !== 'number' || c.defence <= 0) {
    errors.push(`characters: "${c.id}" has no defence - the thing fighting them reads it off the card`);
    continue;
  }
  const base = defenceOf.get(c.people);
  if (typeof base === 'number' && Math.abs(c.defence - base) > 2) {
    warnings.push(`characters: "${c.id}" is defence ${c.defence} against a ${c.people} base of ${base} - a long way off their people`);
  }
}
for (const m of datasets.monsters?.monsters ?? []) {
  if (typeof m.defence !== 'number' || m.defence <= 0) {
    errors.push(`monsters: "${m.id}" has no defence - it is half of every attack roll made against it`);
  }
}

// A hireling is a figure in a fight like any other, and conflict.attack reads a
// strength and a defence off both sides of every roll.
for (const h of datasets.rules?.hirelings?.options ?? []) {
  if (typeof h.strength !== 'number' || typeof h.defence !== 'number') {
    errors.push(`rules: hireling "${h.id}" has no strength/defence - the inn's board prints both, and a fight needs both`);
  }
}

// Every character card prints what the character starts with in coin, and a
// character who starts with nothing is a character who cannot buy a torch.
for (const c of characters) {
  if (typeof c.startingGold !== 'number' || c.startingGold <= 0) {
    errors.push(`characters: "${c.id}" has no startingGold - it is a box on the summary strip and it has to have something in it`);
  }
}

// The attack formula is printed on the player board straight out of the rules.
// It has to exist, and it has to be a clamp a fight can survive.
const attack = datasets.rules?.conflict?.attack;
if (!attack) errors.push('rules: no conflict.attack - the player board prints this rule and cannot print a missing one');
else {
  const [best, worst] = attack.clamp ?? [];
  if (typeof best !== 'number' || typeof worst !== 'number' || best < 2 || worst > 6 || best >= worst) {
    errors.push(`rules: conflict.attack.clamp is ${JSON.stringify(attack.clamp)} - a d6 fight clamps somewhere inside 2..6 or it is decided before it is rolled`);
  }
}

// The market, and the ruler that has to be able to read every roll it can make.
//
// A price is (Demand - Supply + Memory) x Elasticity, read on a seven-cell strip
// printed across the foot of the market board. Every part of that sentence is a
// number somebody can change, and three of the ways of changing it produce a
// board that is quietly broken rather than loudly wrong: a ruler with a hole in
// it (a roll nobody can read), a memory track a model can walk off, and a strip
// wide enough to squeeze the price ladder narrower than the token that walks it.
// None of the three shows up in a diff. All three show up here.
{
  const pricing = datasets.pricing;
  const market = datasets.rules?.market;
  if (!pricing) errors.push('pricing: no pricing.json - nothing says how a price is arrived at');
  else {
    const models = pricing.models ?? [];
    const mem = pricing.memory ?? {};
    const tally = mem.tally ?? {};
    const bins = pricing.ruler?.bins ?? [];
    const steps = pricing.elasticity?.steps ?? [];

    /* Every commodity prices by something. The manifest reference check catches
       a model that does not exist; this catches the one that was never named. */
    for (const c of commodities) {
      if (!c.pricing) errors.push(`commodities: "${c.id}" has no pricing model - every line on the market board runs under one of ${models.map((m) => m.id).join('/')}`);
    }
    for (const m of models) {
      if (!commodities.some((c) => c.pricing === m.id)) {
        warnings.push(`pricing: nothing prices by "${m.id}" - a model no commodity uses is a rule nobody will ever read`);
      }
    }

    /* The green die has six faces and the elasticity strip has to account for
       all of them, once each. A face nobody claimed is a roll with no ruling. */
    const green = (pricing.dice?.sets ?? []).find((d) => d.id === pricing.elasticity?.die);
    if (!green) errors.push(`pricing: elasticity reads the "${pricing.elasticity?.die}" die, which is not one of the dice`);
    else {
      const seen = new Map();
      for (const step of steps) for (const f of step.faces ?? []) {
        if (seen.has(f)) errors.push(`pricing: the green die's ${f} is claimed by both "${seen.get(f)}" and "${step.id}"`);
        else seen.set(f, step.id);
      }
      for (let f = 1; f <= green.faces; f++) {
        if (!seen.has(f)) errors.push(`pricing: nothing on the elasticity strip covers a green ${f}`);
      }
    }

    /* What the dice and the tracks can actually produce, and whether the ruler
       can read all of it. The reach is derived from the dice rather than read
       off pricing.ruler.reach - that field is a restatement, and it is checked
       against the derivation rather than trusted, exactly as a player board
       track's `covers` is. */
    const demand = (pricing.dice?.sets ?? []).find((d) => d.id === 'demand');
    const supply = (pricing.dice?.sets ?? []).find((d) => d.id === 'supply');
    if (demand && supply && steps.length && typeof mem.from === 'number') {
      const swing = [demand.range[0] - supply.range[1], demand.range[1] - supply.range[0]];
      const stated = pricing.ruler?.reach?.swing;
      if (stated && (stated[0] !== swing[0] || stated[1] !== swing[1])) {
        errors.push(`pricing: ruler.reach.swing says ${JSON.stringify(stated)}, and ${demand.count} ${demand.colour} against ${supply.count} ${supply.colour} reaches ${JSON.stringify(swing)}`);
      }
      const biggest = Math.max(...steps.map((st) => st.multiply));
      const trim = (n) => (n < 0 ? Math.ceil(n) : Math.floor(n));
      const lo = trim((swing[0] + mem.from) * biggest);
      const hi = trim((swing[1] + mem.to) * biggest);

      /* No hole and no overlap, cell by cell, across everything reachable. */
      const sorted = [...bins].sort((a, b) => a.from - b.from);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].from !== sorted[i - 1].to + 1) {
          errors.push(`pricing: the swing ruler ${sorted[i].from > sorted[i - 1].to + 1 ? 'has a hole' : 'overlaps'} between "${sorted[i - 1].id}" and "${sorted[i].id}" - ${sorted[i - 1].to} then ${sorted[i].from}`);
        }
      }
      if (sorted.length) {
        if (sorted[0].from > lo) errors.push(`pricing: a net of ${lo} is reachable and the swing ruler starts at ${sorted[0].from}`);
        if (sorted[sorted.length - 1].to < hi) errors.push(`pricing: a net of ${hi} is reachable and the swing ruler stops at ${sorted[sorted.length - 1].to}`);
      }

      /* A cell that moves a token further than the ladder is long is a cell
         nobody can obey - the clamp would swallow it whole, every time. */
      const rungs = (market?.priceBands?.length ?? 1) - 1;
      for (const bin of bins) {
        if (Math.abs(bin.move) > rungs) {
          errors.push(`pricing: the "${bin.id}" cell moves ${bin.move} bands and the ladder is ${rungs} long`);
        }
      }
    }

    /* A model may not walk its bar off the strip the board prints. */
    for (const m of models) {
      const r = m.memory ?? {};
      if (typeof r.from !== 'number' || typeof r.to !== 'number') {
        errors.push(`pricing: model "${m.id}" does not say how far its memory runs`);
        continue;
      }
      if (r.from < mem.from || r.to > mem.to) {
        errors.push(`pricing: model "${m.id}" runs ${r.from}..${r.to} and the memory strip is ${mem.from}..${mem.to} - its bar would walk off the board`);
      }
      if (!m.mark?.path) errors.push(`pricing: model "${m.id}" has no mark - every commodity token carries one in its corner`);
      if (m.tally?.uses && typeof tally.to !== 'number') {
        errors.push(`pricing: model "${m.id}" fills a tally and pricing.memory.tally does not say how long one is`);
      }
    }
    {
      const seen = new Map();
      for (const m of models) {
        const id = m.mark?.id;
        if (!id) continue;
        if (seen.has(id)) errors.push(`pricing: "${m.id}" and "${seen.get(id)}" both draw the "${id}" mark - one model, one symbol`);
        else seen.set(id, m.id);
      }
    }

    /* The rule of thumb, made checkable. Anything a deposit yields comes out of
       a hole that does not refill, and a hole that does not refill is the whole
       of the depletion model - so a deposit yield priced any other way is a seam
       the game will let you mine forever at a steady price. */
    const finite = new Set((datasets.deposits?.deposits ?? []).flatMap((d) => d.yields ?? []));
    const byId = new Map(commodities.map((c) => [c.id, c]));
    for (const id of finite) {
      const c = byId.get(id);
      if (c && c.pricing !== 'deplete') {
        warnings.push(`commodities: "${id}" is yielded by a deposit and prices by "${c.pricing}" - a finite source usually wants the depletion model`);
      }
    }

    /* The market board's own geometry, checked the way the player board's is:
       the strips take a bar's width each, the ladder takes what is left, and
       below the width of a commodity token the sheet has run out of middle. */
    const MB = datasets.components?.marketBoard;
    const bar = datasets.components?.tokens?.bar?.diameterMm;
    const flats = datasets.components?.tokens?.commodity?.acrossFlatsMm;
    if (MB && bar && flats && typeof mem.from === 'number' && typeof tally.from === 'number') {
      const cells = (mem.to - mem.from + 1) + (tally.to - tally.from + 1);
      const stripCell = bar + 2 * MB.strip.clearanceMm;
      const stripsW = cells * stripCell + MB.strip.gutterMm;
      const contentW = MB.sheet.widthMm - 2 * MB.marginMm;
      const bandW = (contentW - stripsW - MB.strip.gutterMm) / (market?.priceBands?.length || 1);
      const corners = flats * 2 / Math.sqrt(3);
      if (bandW < corners) {
        errors.push(`marketboard: the tally and the memory take ${stripsW.toFixed(1)}mm, leaving ${bandW.toFixed(1)}mm a band, and a ${flats}mm token is ${corners.toFixed(1)}mm across the corners - the sheet has run out of middle`);
      }
      const foot = MB.foot.rows.reduce((sum, r) => sum + r.heightMm + MB.foot.gapMm, 0);
      const lineH = flats + 2 * MB.line.clearanceMm;
      const lines = Math.floor((MB.sheet.heightMm - 2 * MB.marginMm - MB.headMm - foot) / lineH);
      if (lines < 1) errors.push(`marketboard: the head and a ${foot}mm foot leave room for no line at all`);
      else if (lines < 4) warnings.push(`marketboard: only ${lines} price lines fit the sheet - a town trades more than that`);
    }
  }
}

// A building nobody can reach is a design bug worth hearing about.
const buildingUsed = new Set();
for (const r of recipes) {
  if (r.site?.building) buildingUsed.add(r.site.building);
  if (r.site?.orBuilding) buildingUsed.add(r.site.orBuilding);
}
for (const b of buildings) {
  const passive = ['housing', 'storage', 'military', 'infrastructure'].includes(b.category);
  if (!passive && !buildingUsed.has(b.id) && (b.workerSlots ?? 0) > 0) {
    warnings.push(`buildings: "${b.id}" has worker slots but no recipe names it as a site`);
  }
}

/* --- 4. the building tiles ------------------------------------------------- */

/**
 * The tile system, checked the way the price system is: the ladder may not have a
 * hole in it, a shape may not fall into two pieces, and no tile may be asked to
 * print something it has no room for.
 *
 * None of this is about any one building. How big a building's tile is is worked
 * out from its own numbers, so every failure here is a failure of the MODEL -
 * which is exactly the kind that goes unnoticed until fifty-four pieces are at
 * the printer.
 */
{
  const tiles = readTiles(ROOT);
  const components = datasets.components;
  const terrainIds = new Set((datasets.terrain?.terrains ?? []).map((t) => t.id));

  /* The ladder: contiguous, exclusive-top, and open at the end. The same shape
     the market's swing ruler has, and the same check - a hole in it is a ground
     demand that no rung answers. */
  let floor = 0;
  tiles.ladder.bands.forEach((band, i) => {
    const last = i === tiles.ladder.bands.length - 1;
    if (band.under != null && band.under <= floor) {
      errors.push(`buildingtiles: ladder rung ${band.cells} tops out at ${band.under}, at or below the ${floor} the rung under it reached - the ladder overlaps`);
    }
    if (last && band.under != null) {
      errors.push('buildingtiles: the top rung of the ladder has a ceiling, so a big enough building falls off it - the last rung takes `under: null`');
    }
    if (!last && band.under == null) {
      errors.push(`buildingtiles: ladder rung ${band.cells} has no ceiling but is not the last rung - everything above it is unreachable`);
    }
    if (!tiles.shapes[band.shape]) {
      errors.push(`buildingtiles: ladder rung ${band.cells} asks for shape "${band.shape}", which data/buildingtiles.json does not declare`);
    } else if (tiles.shapes[band.shape].cells.length !== band.cells) {
      errors.push(`buildingtiles: ladder rung ${band.cells} asks for "${band.shape}", which is ${tiles.shapes[band.shape].cells.length} cells`);
    }
    floor = band.under ?? floor;
  });

  /* A shape is one piece, or it is two tiles. */
  for (const id of Object.keys(tiles.shapes).filter((k) => !k.startsWith('$'))) {
    const cells = cellsOf(id, tiles);
    const seen = new Set(cells.map((c) => `${c.q},${c.r}`));
    if (seen.size !== cells.length) errors.push(`buildingtiles: shape "${id}" names the same cell twice`);
    if (!connected(cells)) errors.push(`buildingtiles: shape "${id}" is not edge-connected - a tile that falls into two pieces is two tiles`);
    if (!cells.some((c) => c.q === 0 && c.r === 0)) {
      errors.push(`buildingtiles: shape "${id}" has no [0, 0] cell - the anchor is the cell a player is told to place, and every shape has one`);
    }
  }

  /* Every term of the ground model has to be a field some building actually
     carries, or it is a weight on nothing. */
  for (const term of tiles.ground.terms) {
    if (!buildings.some((b) => typeof b[term.field] === 'number')) {
      errors.push(`buildingtiles: the ground model weights \`${term.field}\`, which no building in data/buildings.json carries`);
    }
  }
  for (const term of tiles.ground.excluded) {
    if (tiles.ground.terms.some((t) => t.field === term.field)) {
      errors.push(`buildingtiles: \`${term.field}\` is both weighted and excluded by the ground model`);
    }
  }

  /* The yard is the one part of the ground model a building NAMES rather than
     counts, so it is checked the way a commodity's pricing model is: the
     vocabulary is closed, it is ordered, and nothing may stand outside it.
     A building with no yard would quietly be charged for none, which is a
     footprint arrived at by omission - the exact failure this whole file is
     here to catch. */
  const yards = tiles.ground.yards.models;
  const yardIds = new Set(yards.map((m) => m.id));
  yards.reduce((below, model) => {
    if (model.weight < below) {
      errors.push(`buildingtiles: yard "${model.id}" costs ${model.weight} cells, less than the yard declared before it - the vocabulary runs from least open ground to most`);
    }
    return model.weight;
  }, -Infinity);
  if (yards[0]?.weight !== 0) {
    errors.push('buildingtiles: the first yard model has to cost nothing - a building whose walls are the whole of it is the floor the other two are measured from');
  }
  for (const b of buildings) {
    if (b.perTile) continue;            // laid along a route, never cut as a hex
    if (b.yard == null) {
      errors.push(`buildings: "${b.id}" names no \`yard\`, so the ground model cannot say what its trade needs in the open - pick one of ${[...yardIds].join(', ')}`);
    } else if (!yardIds.has(b.yard)) {
      errors.push(`buildings: "${b.id}" names the yard "${b.yard}", which data/buildingtiles.json does not declare`);
    }
  }

  /* The pieces themselves: they have to fit a mini-map, they have to be able to
     say what ground they stand on, and a name has to set above the press floor. */
  const rows = tileSubjects(ROOT);
  const T = components.buildingTile;
  const commodityNames = new Set(
    (datasets.commodities?.commodities ?? []).flatMap((c) => [c.name, c.shortName]).filter(Boolean).map((n) => n.toLowerCase())
  );
  const across = 2 * components.minimap.cellsPerSide - 1;

  for (const row of rows) {
    /* Where a building may stand is no longer printed on the piece - the back is
       a drawn plate now - but it is still what the brief is written from, so a
       terrain nothing declares is still a broken commission. */
    for (const id of row.terrain) {
      if (!terrainIds.has(id)) errors.push(`buildingtiles: tile "${row.id}" may stand on "${id}", which terrain.json does not declare`);
    }
    if (row.cells.length > across) {
      errors.push(`buildingtiles: tile "${row.id}" is ${row.cells.length} cells and a mini-map field is only ${across} across`);
    }

    /* A label solved to fit is fine; a label that cannot be solved is a name too
       long for the piece it is printed on, and the answer is a `shortName` on the
       building. Worked out here as well as in tools/build-tiles.mjs so it fails
       at the data rather than at the draw - and measured against the BAND, which
       since it moved to hug one edge is about 73% of what it was. Once, not
       twice: both sides carry the same name now. */
    const band = bandOf(row.cells, worldHexMm(ROOT).mm, T.nameBand.heightPerCell);
    const perLetter = 0.7 + T.nameBand.trackingPerCell / T.nameBand.fontPerCell;
    const room = band.midline.length - 2 * T.nameBand.insetPerCell * worldHexMm(ROOT).mm;
    const fitted = Math.min(T.nameBand.fontPerCell * worldHexMm(ROOT).mm, room / (row.label.length * perLetter));
    if (fitted < T.nameBand.minFontMm) {
      errors.push(
        `buildingtiles: "${row.label}" sets at ${fitted.toFixed(2)} mm on tile "${row.id}" (${row.shape}), ` +
        `under the ${T.nameBand.minFontMm} mm floor on a ${band.midline.length.toFixed(2)} mm band - ` +
        `give that building a \`shortName\` in data/buildings.json`
      );
    }

    /* A tile's name has to name the THING, and a bare commodity noun does not.
       `shortName` exists so a long name fits a 17 mm band, not so it becomes a
       different word: LUMBER on a two-hex piece was read as a lumber token, and
       fairly - every commodity token in the box is a hexagon with a commodity's
       name behind it. Commodity tokens are all one hex and all the same hex
       (components.json tokens.commodity); a tile is one to four and never one of
       them, so no tile may borrow their vocabulary. */
    if (row.kind === 'building' && commodityNames.has(row.label.toLowerCase())) {
      errors.push(
        `buildingtiles: tile "${row.id}" is printed "${row.label}", which is the name of a commodity - ` +
        `a multi-hex piece labelled like a one-hex commodity token reads as one. Give that building a ` +
        `\`shortName\` in data/buildings.json that still names a building`
      );
    }

    /* And the ground demand a tile was cut from has to be the one its numbers
       still ask for, which is the whole point of never writing it down. */
    if (row.kind === 'building') {
      const want = bandFor(groundOf(row.subject, tiles), tiles);
      if (want.cells !== row.cells.length) {
        errors.push(`buildingtiles: tile "${row.id}" is cut at ${row.cells.length} cells but its numbers ask for ${want.cells}`);
      }
    }
  }

  /* Two tiles printing the same word is two pieces a player cannot tell apart,
     and it is what a `shortName` chosen in isolation does: a charcoal kiln and a
     brickworks are both, shortened by the obvious route, a KILN. */
  const labels = new Map();
  for (const row of rows) {
    const key = row.label.toLowerCase();
    if (labels.has(key)) {
      errors.push(`buildingtiles: tiles "${labels.get(key)}" and "${row.id}" are both printed "${row.label}" - one of them needs a different \`shortName\``);
    } else labels.set(key, row.id);
  }

  /* One plate per tile now - the back is the face printed short - and no two the
     same. Swept through platesOf rather than a literal list of sides, so this
     check cannot disagree with the mint queue about how many plates exist. */
  const plates = rows.flatMap((r) => platesOf(r));
  for (const [id, n] of plates.reduce((m, id) => m.set(id, (m.get(id) ?? 0) + 1), new Map())) {
    if (n > 1) errors.push(`buildingtiles: ${n} tiles want the plate id "${id}"`);
  }

  /* Fields are laid beside a farm, so there had better be one, and it had better
     say how many. */
  const host = buildings.find((b) => b.id === tiles.fields.placedBeside);
  if (!host) {
    errors.push(`buildingtiles: field tiles are laid beside "${tiles.fields.placedBeside}", which is not a building`);
  } else if (!(host.fieldSlots > 0)) {
    errors.push(`buildingtiles: field tiles are capped by ${host.id}.fieldSlots, which is not set - every farm could then hold none`);
  }

  if (!rows.some((r) => r.kind === 'field')) {
    warnings.push('buildingtiles: no recipe carries a `cropStage`, so there are no field tiles at all');
  }
}

/* --- report ---------------------------------------------------------------- */
if (!quiet) {
  for (const w of warnings) console.log(`  warn  ${w}`);
}
for (const e of errors) console.error(`  ERROR ${e}`);

const counts = manifest.datasets
  .filter((d) => d.collection && datasets[d.key])
  .map((d) => `${(datasets[d.key][d.collection] || []).length} ${d.key}`)
  .join(', ');

console.log(`\n${counts}`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
