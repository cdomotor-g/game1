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
const trackLetters = new Map((datasets.playerboard?.tracks ?? []).map((t) => [t.letter, t.id]));
for (const t of datasets.playerboard?.tracks ?? []) {
  const onStrip = stripLetters[t.id];
  if (onStrip === undefined) {
    errors.push(`components: the board has a ${t.label} track and statStrip.letters says nothing about "${t.id}" - a card that prints that number would have no letter to print it under`);
    continue;
  }
  if (onStrip !== t.letter) {
    errors.push(`components: the strip letters "${t.id}" ${onStrip} and the board letters it ${t.letter} - a card and a board may not call one number two things`);
  }
}
/* And the converse, which is the half that was missing: a CARD-ONLY letter may
   not borrow a letter a track already has. A monster's armour prints an A and
   nothing walks an A; the day something does, this says so rather than letting
   two different numbers answer to one letter across a table. */
for (const [stat, letter] of Object.entries(stripLetters)) {
  if (stat.startsWith('$')) continue;
  const owner = trackLetters.get(letter);
  if (owner && owner !== stat) {
    errors.push(`components: statStrip.letters calls "${stat}" ${letter}, and the board's ${owner} track is already ${letter} - one letter, one number`);
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
     width of the token that walks them, the board has run out of room.

     Two kinds of track now, and only one of them is in the middle. A COLUMN
     track counts something about the figure in the recess and there is one of
     those; a KIT track counts something about a card in a slot and there are
     four of those, drawn as narrow ladders against the recesses. So the kit
     block is wider than the two cards by four ladders, and the columns get
     what is left after that - which is the arithmetic that has to be recomputed
     here rather than trusted, because it is exactly the sum tools/build-board.mjs
     is also doing and the two must not be able to agree by sharing a bug. */
  const card = datasets.components.stock.card;
  const slotW = card.widthMm + 2 * boardShape.slot.clearanceMm;
  const slotH = card.heightMm + 2 * boardShape.slot.clearanceMm;
  const contentW = boardShape.sheet.widthMm - 2 * boardShape.marginMm;
  const kitCount = (boardSpec.slots ?? []).find((s) => s.id === 'kit')?.count ?? 0;
  const tracks = boardSpec.tracks ?? [];
  const columnTracks = tracks.filter((t) => (t.place ?? 'column') === 'column');
  const kitTracks = tracks.filter((t) => t.place === 'kit');
  const pipMm = datasets.components.tokens?.pip?.diameterMm ?? 0;
  const KT = boardShape.kitTrack;
  const ladderW = kitTracks.length && KT ? pipMm + 2 * KT.clearanceMm + KT.gapMm : 0;
  const kitW = 2 * (slotW + ladderW) + boardShape.gutterMm;
  const columnW = (contentW - slotW - kitW - 2 * boardShape.gutterMm) / (columnTracks.length || 1);
  const tokenMm = datasets.components.tokens?.bar?.diameterMm ?? 7;
  if (columnW < tokenMm + 2) {
    errors.push(`playerboard: ${columnTracks.length} column tracks and ${kitTracks.length ? 'four wear ladders' : 'no wear ladders'} leave ${columnW.toFixed(1)}mm a column, and the bar that walks one is ${tokenMm}mm - the board has run out of middle`);
  }
  if (kitCount % 2 !== 0) {
    warnings.push(`playerboard: ${kitCount} kit slots do not fill the two columns the board draws them in`);
  }

  /* A kit track runs the same 0-14 as everything else, down the side of a card
     recess rather than the length of the sheet - so its rungs are a third the
     height of a column's, and the piece that walks it had to shrink to match.
     This is the check that says which piece: a bar overhangs, a pip does not. */
  for (const t of kitTracks) {
    if ((t.count ?? 1) !== kitCount) {
      errors.push(`playerboard: the ${t.label} track says there are ${t.count ?? 1} of it and there are ${kitCount} kit slots - one ladder per slot or a player has a card whose wear nobody is counting`);
    }
    const rungs = boardShape.track.to - boardShape.track.from + 1;
    const rungH = slotH / rungs;
    if (pipMm && rungH < pipMm) {
      errors.push(`playerboard: the ${t.label} ladder is ${rungs} rungs down an ${slotH}mm recess, which is ${rungH.toFixed(2)}mm a rung, and the pip that walks it is ${pipMm}mm - the piece overhangs its own rung`);
    }
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

// Armour is the other half of a battle total, and DEFENCE is not - there is no
// defence any more anywhere in the game. It was a rating that shifted a to-hit
// roll, and there is no to-hit roll: a battle is one opposed total, in which a
// number that makes you harder to hit and a number that soaks the hit are the
// same number. So the check that used to demand a defence now forbids one, and
// it forbids it on every record in the game rather than on the three that used
// to carry it - a field left lying around in one file is how two halves of a
// repository end up playing different games.
const RETIRED_FIELDS = [
  { field: 'defence', became: 'armour, and only on a monster - a character\'s armour is whatever is in their kit slots' },
  { field: 'combatDice', became: 'battle, a flat number added to your side of the roll' },
  { field: 'armourValue', became: 'armour' },
  { field: 'baseDurability', became: 'baseWear, on the board\'s own 0-14 scale' },
];
for (const [key, ds] of Object.entries(datasets)) {
  const walk = (node, path) => {
    if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${path}[${i}]`)); return; }
    if (!node || typeof node !== 'object') return;
    for (const r of RETIRED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(node, r.field)) {
        errors.push(`${key}: ${path}.${r.field} is a retired field - it is ${r.became} now`);
      }
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, `${path}.${k}`);
  };
  walk(ds, key);
}

// A monster brings two numbers to a meeting that a character does not: what its
// hide is worth in a battle, and how fast it is - because whether you may run
// away at all is a comparison against that second one.
for (const m of datasets.monsters?.monsters ?? []) {
  if (typeof m.armour !== 'number' || m.armour < 0) {
    errors.push(`monsters: "${m.id}" has no armour - it is added to its side of every battle roll, and a monster with none has to say so with a 0`);
  }
  if (typeof m.pace !== 'number' || m.pace < 1) {
    errors.push(`monsters: "${m.id}" has no pace - a party may only flee something it can outpace (rules.json conflict.flee), and a monster with no pace cannot be fled from or stood against`);
  }
}

// A hireling is a figure in a battle like any other, and conflict.battle totals
// a strength, a weapon and what they are wearing off whoever is fighting.
for (const h of datasets.rules?.hirelings?.options ?? []) {
  if (typeof h.strength !== 'number' || typeof h.armour !== 'number' || typeof h.battle !== 'number') {
    errors.push(`rules: hireling "${h.id}" needs a strength, an armour and a battle - the inn's board prints all three, and a battle total needs all three`);
  }
}

// The one line of arithmetic the player board prints, and it cannot print a
// missing one.
const battle = datasets.rules?.conflict?.battle;
if (!battle?.rule || !battle?.formula) {
  errors.push('rules: no conflict.battle with a rule and a formula - the player board prints this and data/playerboard.json panel.aside points at it');
}
if (!datasets.rules?.conflict?.flee?.rule) {
  errors.push('rules: no conflict.flee.rule - running away is an option on every monster card and the rule for it has to exist somewhere');
}

// Coin has mass now, and the two halves of that statement have to agree: a
// weight on the currency, and coin off the list of things that are not carried.
const currency = datasets.rules?.currency ?? {};
if (typeof currency.massKgEach !== 'number' || currency.massKgEach <= 0) {
  errors.push('rules: currency.massKgEach is not a positive number - a coin weighs something now (rules.json carrying.coin) and the number is what a figure is loaded against');
}
if ((datasets.rules?.carrying?.notCarried ?? []).some((x) => /^coin\b/i.test(String(x).trim()))) {
  errors.push('rules: carrying.notCarried still lists coin, and carrying.coin says it counts - one of the two is wrong and a player would find whichever suited them');
}

// Everything a figure carries wears out, and the two files that say so have to
// agree about which things do not: a potion is drunk and a talisman holds mana,
// and friction is not what either of them is about.
for (const i of datasets.items?.items ?? []) {
  const exempt = i.class === 'potion' || i.class === 'talisman';
  if (exempt && i.wear !== undefined) {
    errors.push(`items: "${i.id}" is a ${i.class} and carries a wear - a ${i.class} is spent rather than worn out (rules.json wear.neverWears)`);
  }
  if (!exempt && (typeof i.wear !== 'number' || i.wear < 1)) {
    errors.push(`items: "${i.id}" has no wear - every item a figure carries walks a W track beside its own kit slot, and a card with no W box is a card the board cannot be set from`);
  }
  if (i.class === 'weapon' && (typeof i.battle !== 'number' || i.battle < 1)) {
    errors.push(`items: weapon "${i.id}" has no battle - it is what the weapon adds to your side of the roll`);
  }
  if (i.class === 'armour' && (typeof i.armour !== 'number' || i.armour < 1)) {
    errors.push(`items: armour "${i.id}" has no armour - it is what the piece adds to your side of the roll`);
  }
}
for (const t of datasets.tools?.tools ?? []) {
  if (typeof t.baseWear !== 'number' || t.baseWear < 1) {
    errors.push(`tools: "${t.id}" has no baseWear - a tool is the first thing in this game that wore out and it is still one of them`);
  }
}

// Every character card prints what the character starts with in coin, and a
// character who starts with nothing is a character who cannot buy a torch.
for (const c of characters) {
  if (typeof c.startingGold !== 'number' || c.startingGold <= 0) {
    errors.push(`characters: "${c.id}" has no startingGold - it is a box on the summary strip and it has to have something in it`);
  }
}

// The battle roll is two dice a side, and the two sides have to be rolling the
// same number of the same kind of die. There is no clamp to check any more,
// because there is no target number to clamp: the check that replaced it is that
// the colours are the market's own, which is the whole reason this rule reads the
// way it does.
{
  const bd = datasets.rules?.conflict?.battleDice ?? {};
  const colours = new Set((datasets.pricing?.dice?.sets ?? []).map((d) => d.colour));
  if (typeof bd.count !== 'number' || bd.count < 1 || typeof bd.faces !== 'number' || bd.faces < 2) {
    errors.push(`rules: conflict.battleDice is ${JSON.stringify(bd)} - a battle is an opposed roll and both sides need a count and a face count`);
  }
  for (const side of ['yours', 'theirs']) {
    if (!colours.has(bd[side])) {
      errors.push(`rules: conflict.battleDice.${side} is "${bd[side]}", which is not a colour the market rolls (${[...colours].join(', ')}) - the whole point of the battle roll is that it is the market's own two colours subtracted the same way`);
    }
  }
  if (bd.yours === bd.theirs) {
    errors.push('rules: conflict.battleDice rolls the same colour on both sides - blue is what you want and red is what stands in your way, and a fight where both are the same is a fight nobody can read across a table');
  }
}

// The market, and the ruler that has to be able to read every roll it can make.
//
// A price is Demand - Supply + Volatility + Modifier, all addition, read on a
// seven-cell strip printed on the market board. Every part of that sentence is a
// number somebody can change, and three of the ways of changing it produce a
// board that is quietly broken rather than loudly wrong: a ruler with a hole in
// it (a roll nobody can read), a die face nothing on a strip accounts for, and a
// model that neither adds a number nor points at something that does. None of
// the three shows up in a diff. All three show up here.
//
// What is NOT checked any more, because it no longer exists: the memory strip's
// range, a model's bar walking off it, and the tally length. Nothing on any board
// remembers anything, so there is no strip to walk off.
{
  const pricing = datasets.pricing;
  const market = datasets.rules?.market;
  if (!pricing) errors.push('pricing: no pricing.json - nothing says how a price is arrived at');
  else {
    const models = pricing.models ?? [];
    const bins = pricing.ruler?.bins ?? [];
    const dice = pricing.dice?.sets ?? [];
    const dieById = new Map(dice.map((d) => [d.id, d]));

    /* Every commodity is one of the four kinds of good. The manifest reference
       check catches a model that does not exist; this catches the one that was
       never named, and the model nothing is. */
    for (const c of commodities) {
      if (!c.pricing) errors.push(`commodities: "${c.id}" has no pricing model - every commodity is one of ${models.map((m) => m.id).join('/')}`);
    }
    for (const m of models) {
      if (!commodities.some((c) => c.pricing === m.id)) {
        warnings.push(`pricing: nothing prices by "${m.id}" - a kind of good nothing is is a rule nobody will ever read`);
      }
    }

    /* A strip that reads a die has to account for every face of it, once each.
       A face nobody claimed is a roll with no ruling, and the two strips that
       read a die are checked the same way because they are the same mistake. */
    const coverFaces = (label, dieId, steps) => {
      const die = dieById.get(dieId);
      if (!die) { errors.push(`pricing: ${label} reads the "${dieId}" die, which is not one of the dice`); return; }
      const seen = new Map();
      for (const step of steps ?? []) for (const f of step.faces ?? []) {
        if (seen.has(f)) errors.push(`pricing: the ${die.colour} die's ${f} is claimed twice on the ${label} strip`);
        else seen.set(f, true);
      }
      for (let f = 1; f <= die.faces; f++) {
        if (!seen.has(f)) errors.push(`pricing: nothing on the ${label} strip covers a ${die.colour} ${f}`);
      }
    };
    coverFaces('volatility', pricing.volatility?.die, pricing.volatility?.steps);
    coverFaces('spoil', pricing.spoil?.die, pricing.spoil?.steps);

    /* The volatility strip ADDS. A step that multiplies is the old rule left
       lying in the new file, and it would be read straight past. */
    for (const st of pricing.volatility?.steps ?? []) {
      if (typeof st.add !== 'number') errors.push(`pricing: volatility step "${st.id}" has no add - the green die adds now, it does not multiply`);
      if (st.multiply !== undefined) errors.push(`pricing: volatility step "${st.id}" still carries a multiply - nothing in the round multiplies any more`);
    }

    /* What the dice and the modifiers can actually produce, and whether the
       ruler can read all of it. The reach is derived rather than read off
       pricing.ruler.reach - that field is a restatement of the DICE half, and it
       is checked against the derivation rather than trusted, exactly as a player
       board track's `covers` is. */
    const demand = dieById.get('demand');
    const supply = dieById.get('supply');
    const adds = (pricing.volatility?.steps ?? []).map((st) => st.add ?? 0);
    const modifier = pricing.modifier ?? {};
    if (demand && supply && adds.length) {
      const swing = [demand.range[0] - supply.range[1], demand.range[1] - supply.range[0]];
      const stated = pricing.ruler?.reach?.swing;
      if (stated && (stated[0] !== swing[0] || stated[1] !== swing[1])) {
        errors.push(`pricing: ruler.reach.swing says ${JSON.stringify(stated)}, and ${demand.count} ${demand.colour} against ${supply.count} ${supply.colour} reaches ${JSON.stringify(swing)}`);
      }
      const lo = swing[0] + Math.min(...adds) + (modifier.from ?? 0);
      const hi = swing[1] + Math.max(...adds) + (modifier.to ?? 0);

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

      /* A cell that moves a price further than the printed row of prices is long
         is a cell nobody can obey - the clamp would swallow it whole, every time. */
      const rungs = (market?.priceBands?.length ?? 1) - 1;
      for (const bin of bins) {
        if (Math.abs(bin.move) > rungs) {
          errors.push(`pricing: the "${bin.id}" cell moves ${bin.move} bands and the row of prices is ${rungs} steps long`);
        }
      }
    }

    /* WHAT A MODEL IS, now that none of them remembers anything: a mark, and
       exactly one answer to `what do you add to the swing`. A model that gives
       both a flat number and a path is a model with two answers, and a model
       that gives neither is a kind of good the round cannot resolve. */
    const resolves = (path) => {
      if (typeof path !== 'string') return false;
      let node = datasets;
      for (const part of path.split('.')) {
        if (node == null || typeof node !== 'object') return false;
        node = node[part];
      }
      return node !== undefined;
    };
    for (const m of models) {
      if (!m.mark?.path) errors.push(`pricing: model "${m.id}" has no mark - every commodity token carries one in its corner and the market board prints all four`);
      const flat = typeof m.modifier === 'number';
      const points = m.reads !== null && m.reads !== undefined;
      if (flat === points) {
        errors.push(`pricing: model "${m.id}" ${flat ? 'both states a modifier and points at one' : 'neither states a modifier nor points at one'} - a kind of good adds a number to the swing, and it says where that number comes from exactly once`);
      }
      if (points && !resolves(m.reads)) {
        errors.push(`pricing: model "${m.id}" reads its modifier from "${m.reads}", which does not resolve`);
      }
      if (typeof m.spoils !== 'boolean') errors.push(`pricing: model "${m.id}" does not say whether it spoils - the end of every round asks that question of every stack on the table`);
      if (typeof m.tokensOnUse !== 'boolean') errors.push(`pricing: model "${m.id}" does not say whether burning it puts a token on a depletion grid`);
      if (m.memory !== undefined || m.tally !== undefined) {
        errors.push(`pricing: model "${m.id}" still carries a memory or a tally - nothing on any board remembers anything now`);
      }
    }
    {
      const seen = new Map();
      for (const m of models) {
        const id = m.mark?.id;
        if (!id) continue;
        if (seen.has(id)) errors.push(`pricing: "${m.id}" and "${seen.get(id)}" both draw the "${id}" mark - one kind of good, one symbol`);
        else seen.set(id, m.id);
      }
    }

    /* Exactly one model spoils and exactly one takes tokens. Two of either is
       two rules doing one job, and none is a die or a sheet nobody uses. */
    for (const [flag, what] of [['spoils', 'rolls the spoil die'], ['tokensOnUse', 'fills a depletion grid']]) {
      const n = models.filter((m) => m[flag]).length;
      if (n !== 1) errors.push(`pricing: ${n} models say they ${what} - exactly one should, or the ${flag === 'spoils' ? 'ochre die' : 'depletion sheet'} belongs to nobody or to everybody`);
    }

    /* The depletion ladder, which is the one thing in the game that only ever
       goes one way. Its top has to be reachable inside the modifier range the
       ruler was cut for, or the sheet prints a row nothing can ever read. */
    const dep = pricing.depletion ?? {};
    if (typeof dep.step !== 'number' || dep.step < 1) errors.push('pricing: depletion.step is what one row of the grid is worth and it has to be a whole number of bands');
    if (typeof dep.per !== 'number' || dep.per < 1) errors.push('pricing: depletion.per is how many cells a row holds and it has to be at least one');
    if (typeof dep.top !== 'number' || dep.top < 1) errors.push('pricing: depletion.top is the last row of the grid');
    if (dep.recycle !== false) errors.push('pricing: depletion.recycle is not false - a pip on that grid is out of the game, and it is the only permanent mark in this one');
    if (typeof dep.top === 'number' && typeof modifier.to === 'number' && dep.top > modifier.to) {
      errors.push(`pricing: a worked-out seam adds ${dep.top} and pricing.modifier stops at ${modifier.to} - the swing ruler was cut for a reach the grid can exceed`);
    }

    /* The sought good's memory is one round long and lives in a box on the
       ledger. It cannot ask for more than the ruler can produce. */
    const sought = pricing.sought ?? {};
    const moves = bins.map((b) => b.move);
    if (moves.length && (sought.from < Math.min(...moves) || sought.to > Math.max(...moves))) {
      errors.push(`pricing: sought runs ${sought.from}..${sought.to} and the ruler only ever produces ${Math.min(...moves)}..${Math.max(...moves)} - the move box could never hold the numbers it is asked for`);
    }

    /* The spoil strip has two columns because a commodity keeps well or it does
       not, and the threshold that sorts them has to sort something. */
    const spoil = pricing.spoil ?? {};
    if (typeof spoil.keepsThreshold !== 'number') {
      errors.push('pricing: spoil.keepsThreshold is missing - it is the whole of what perishRounds does now, and without it the strip has two identical columns');
    } else {
      const perishable = commodities.filter((c) => c.pricing === 'perish');
      for (const c of perishable) {
        if (typeof c.perishRounds !== 'number') {
          errors.push(`commodities: "${c.id}" is perishable and has no perishRounds - it is which column of the spoil strip the stack reads`);
        }
      }
      for (const c of commodities) {
        if (c.perishRounds !== undefined && c.pricing !== 'perish') {
          errors.push(`commodities: "${c.id}" has a perishRounds and is priced "${c.pricing}" - only a perishable rolls the spoil die, and a rot clock on anything else is a rule nobody applies`);
        }
      }
      if (perishable.length && !perishable.some((c) => c.perishRounds < spoil.keepsThreshold)) {
        warnings.push(`pricing: nothing perishes faster than spoil.keepsThreshold (${spoil.keepsThreshold}) - the right-hand column of the spoil strip is printed for nobody`);
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

    /* The market board's own geometry, checked the way the player board's is and
       recomputed here in plain millimetres so the sheet and the sweep cannot
       agree by sharing a bug. What is checked has changed with what the sheet
       is: there are no strips to squeeze a ladder any more, so the questions are
       whether the head's three blocks add up to the paper, and whether a
       depletion grid's figure actually disappears under the piece that covers it. */
    const MB = datasets.components?.marketBoard;
    const flats = datasets.components?.tokens?.commodity?.acrossFlatsMm;
    const pip = datasets.components?.tokens?.pip?.diameterMm;
    if (MB && flats && pip) {
      const cols = Object.values(MB.head?.columns ?? {});
      const sum = cols.reduce((a, b) => a + b, 0);
      if (cols.length && Math.abs(sum - 1) > 0.001) {
        errors.push(`marketboard: the head's columns are fractions of the working width and they sum to ${sum.toFixed(3)} - at anything but 1 the roll either overruns the paper or leaves a gap nobody meant`);
      }
      const panels = (datasets.pricing?.models ?? []).length || 1;
      const panelW = (MB.sheet.widthMm - 2 * MB.marginMm - (panels - 1) * MB.gutterMm) / panels;
      if (panelW < MB.panels.markMm + 2 * MB.panels.padMm) {
        errors.push(`marketboard: ${panels} kinds of good leave ${panelW.toFixed(1)}mm a panel and the mark alone is ${MB.panels.markMm}mm - the sheet has run out of width`);
      }

      /* The depletion sheet: a covered cell has to be a cell whose number has
         actually gone, or `the lowest one you can still see` is a matter of
         opinion. This is a class of check nothing else in the build makes -
         everywhere else a piece stands BESIDE what it means, and here it stands
         ON it. */
      const D = MB.depletion ?? {};
      if (D.cell) {
        if (D.cell.digitMm > pip) {
          errors.push(`marketboard: a depletion cell prints its figure at ${D.cell.digitMm}mm and the pip that covers it is ${pip}mm across - the number would peep out from behind the piece that is supposed to have taken it`);
        }
        const dep = datasets.pricing?.depletion ?? {};
        const cell = pip + 2 * D.cell.clearanceMm;
        const seatW = flats * 2 / Math.sqrt(3) + 2 * D.grid.seatClearanceMm;
        const gridW = Math.max((dep.per ?? 1) * cell, seatW);
        const gridH = flats + 2 * D.grid.seatClearanceMm + D.grid.gapMm + ((dep.top ?? 0) + 1) * cell + D.grid.labelMm;
        const cw = D.sheet.widthMm - 2 * D.marginMm;
        const chH = D.sheet.heightMm - 2 * D.marginMm - D.headMm - D.footMm;
        const across = Math.floor((cw + D.gutterMm) / (gridW + D.gutterMm));
        const down = Math.floor((chH + D.gutterMm) / (gridH + D.gutterMm));
        const fits = Math.max(0, across) * Math.max(0, down);
        const finiteCount = commodities.filter((c) => c.pricing === 'deplete').length;
        if (fits < 1) errors.push(`marketboard: a depletion grid is ${gridW.toFixed(1)}x${gridH.toFixed(1)}mm and not one of them fits the sheet`);
        else if (fits < finiteCount) {
          warnings.push(`marketboard: ${fits} depletion grids fit a sheet and ${finiteCount} commodities are finite - the table needs a second sheet`);
        }
      }
    }

    /* The price ledger, recomputed the same way and for the same reason. Two of
       these bind, and the second is the one with teeth: a longer game means
       shorter rows means smaller figures, and below a floor the sheet stops
       being something anybody can colour in with a pencil. */
    const LG = datasets.components?.ledger;
    if (LG && flats) {
      const corners = flats * 2 / Math.sqrt(3);
      const contentW = LG.sheet.widthMm - 2 * LG.marginMm;
      const contentH = LG.sheet.heightMm - 2 * LG.marginMm;
      const usableW = contentW - LG.roundGutterMm;
      const colMin = corners + 2 * LG.column.padMm + LG.column.moveBoxMm + LG.column.gapMm;
      const cols = Math.floor(usableW / colMin);
      if (cols < 1) {
        errors.push(`ledger: a column needs ${colMin.toFixed(1)}mm and the sheet has ${usableW.toFixed(1)}mm - not one commodity fits`);
      } else {
        const colW = usableW / cols;
        const rounds = datasets.rules?.victory?.gameLengthRounds ?? 0;
        const rowH = (contentH - LG.head.heightMm - LG.foot.heightMm) / (rounds || 1);
        const h = rowH - 2 * LG.row.padMm;
        if (h < LG.digit.minHeightMm) {
          errors.push(`ledger: ${rounds} rounds is ${rounds} rows, which leaves a ${h.toFixed(2)}mm digit against a ${LG.digit.minHeightMm}mm floor - a longer game (rules.json victory.gameLengthRounds) wants a second sheet, not smaller figures`);
        }
        const t = LG.digit.thicknessPerHeight * h;
        const w = h / 2 + t / 2;
        const group = LG.digit.count * w + (LG.digit.count - 1) * LG.digit.digitGapPerHeight * h;
        const room = colW - 2 * LG.column.padMm - LG.column.moveBoxMm - LG.column.gapMm;
        if (group > room) {
          errors.push(`ledger: ${LG.digit.count} figures come to ${group.toFixed(1)}mm and a column leaves ${room.toFixed(1)}mm beside the move box`);
        }
        if (colW < corners) {
          errors.push(`ledger: a column is ${colW.toFixed(1)}mm and the token that heads it is ${corners.toFixed(1)}mm across the corners`);
        }
        if (cols < 6) warnings.push(`ledger: ${cols} columns fit the sheet and a town trades six - a table would be printing two sheets for one market`);
      }
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

/* --- a card that is dealt must say what it does ----------------------------- */
/* Every event effect carries `text`, and it is the RULES LINE - the sentence
   printed on the card and shown in the explorer, not a comment. It has always
   been the designated slot: docs/js/views.js describeEffect returns fx.text when
   there is one and falls back to dumping the fields when there is not, which is
   how `effort · flat · -1 · → workers-on-terrain` came to be shown to a reader as
   though it were a rule. Two thirds of the deck was in that state.

   The pricing models already say a rule twice on purpose - prose for the people,
   structured fields for the tools - so that neither can be changed and the other
   left saying the old thing. This is the same bargain one storey down, and this
   is the check that keeps it: an effect with no text is a card that cannot be
   printed, so it fails the build rather than reaching a table half-written.

   A `choice` is the one exemption, and for the reason the rule exists: a choice
   node is structure, not content. What a player is actually choosing between is
   the branches, and each branch's own effects carry their own text. */
const sayEffect = (code, fx, path) => {
  if (fx.type !== 'choice' && !(typeof fx.text === 'string' && fx.text.trim())) {
    errors.push(`events: ${code} effect ${path} (${fx.type}${fx.op ? `/${fx.op}` : ''}) has no "text" - `
      + 'that is the line the card prints and the explorer shows, and without it both fall back to dumping the fields');
  }
  if (fx.type === 'choice' && !(fx.branches?.length || (typeof fx.text === 'string' && fx.text.trim()))) {
    errors.push(`events: ${code} effect ${path} is a choice with neither branches nor "text" - nothing to choose between`);
  }
  (fx.branches ?? []).forEach((b, i) => (b.effects ?? []).forEach((f, j) => sayEffect(code, f, `${path}.${i}.${j}`)));
};
for (const c of datasets.events?.cards ?? []) {
  if (!c.effects?.length) errors.push(`events: ${c.cardCode} has no effects - a card that is dealt has to do something`);
  (c.effects ?? []).forEach((fx, i) => sayEffect(c.cardCode, fx, String(i)));
  if (!c.text?.trim()) errors.push(`events: ${c.cardCode} has no "text" - that is the card's story, and it prints a blank panel without one`);
}

/* The same rule for the two decks that carry their own prose in their own
   fields, so a deck cannot be turned on for the mint and then print a card with
   a hole in it: a spell's rule is its `effect` and its flavour is its `story`, a
   quest's task is its `task` and its flavour is its `hook`. */
for (const s of datasets.arcana?.spells ?? []) {
  if (!s.effect?.trim()) errors.push(`arcana: ${s.cardCode} has no "effect" - the card would print no rule`);
  if (!s.story?.trim()) errors.push(`arcana: ${s.cardCode} has no "story" - the card would print a blank rail`);
}
for (const q of datasets.quests?.quests ?? []) {
  if (!q.hook?.trim()) errors.push(`quests: ${q.cardCode} has no "hook" - the card would print a blank panel`);
  const stages = q.stages ?? [];
  if (!q.task?.trim() && !stages.length) errors.push(`quests: ${q.cardCode} has neither a "task" nor "stages" - nothing to do`);
  stages.forEach((st, i) => {
    if (!st.name?.trim()) errors.push(`quests: ${q.cardCode} stage ${i + 1} has no name`);
    if (!st.task?.trim()) errors.push(`quests: ${q.cardCode} stage ${i + 1} has no task`);
  });
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
/* --- campaigns ------------------------------------------------------------ */
// A campaign is a storyline read in order, and the order is the one thing only
// this file holds. So the chapters have to be a run - 1, 2, 3 - with no hole and
// no repeat, every card has to carry the story it teaches and the rule it plays,
// and every place a card points at has to be on the board the campaign names.
{
  const camps = datasets.campaigns?.campaigns ?? [];
  const cards = datasets.campaigns?.cards ?? [];
  const mapsDir = join(DATA, manifest.maps?.dir ?? 'maps');
  const mapOf = new Map();
  for (const camp of camps) {
    if (!camp.map) { errors.push(`campaigns: "${camp.id}" names no map - a campaign is played somewhere`); continue; }
    const file = join(mapsDir, `${camp.map}.json`);
    let map = null;
    try { map = JSON.parse(readFileSync(file, 'utf8')); } catch { errors.push(`campaigns: "${camp.id}" is played on map "${camp.map}", and there is no data/maps/${camp.map}.json`); }
    if (map) mapOf.set(camp.id, map);
    if (!camp.victory?.trim()) errors.push(`campaigns: "${camp.id}" has no victory - a campaign that cannot be won is a book`);
    if (!camp.summary?.trim()) errors.push(`campaigns: "${camp.id}" has no summary`);
    const ids = new Set(camps.map((c) => c.id));
    for (const act of camp.acts ?? []) {
      const [from, to] = act.chapters ?? [];
      if (!(from >= 1 && to >= from)) errors.push(`campaigns: "${camp.id}" act "${act.id}" has no chapter range`);
    }
    const chapters = cards.filter((c) => c.campaign === camp.id).map((c) => c.chapter).sort((a, b) => a - b);
    if (!chapters.length) errors.push(`campaigns: "${camp.id}" has no cards - nothing to read`);
    chapters.forEach((ch, i) => {
      if (ch !== i + 1) errors.push(`campaigns: "${camp.id}" chapters run ${chapters.join(', ')} - they have to be 1, 2, 3 with no hole and no repeat, because the deck is read in order`);
    });
    const actOf = new Map((camp.acts ?? []).map((a) => [a.id, a]));
    for (const c of cards.filter((x) => x.campaign === camp.id)) {
      const act = actOf.get(c.act);
      if (!act) errors.push(`campaigns: ${c.cardCode} is in act "${c.act}", which "${camp.id}" does not have`);
      else if (c.chapter < act.chapters[0] || c.chapter > act.chapters[1]) {
        errors.push(`campaigns: ${c.cardCode} is chapter ${c.chapter} but act "${act.id}" runs ${act.chapters[0]}-${act.chapters[1]}`);
      }
    }
    /* The cast is dealt from the character deck, and a character the campaign
       deals had better say it belongs to the campaign - that tag is what the
       explorer and the annex read to say where a card came from. */
    const tagged = new Set((datasets.characters?.characters ?? []).filter((x) => x.campaign === camp.id).map((x) => x.id));
    const cast = new Set([camp.cast?.odysseus, ...Object.values(camp.cast?.heroes ?? {}).flat(), ...(camp.cast?.hosts ?? []), ...(camp.cast?.adversaries ?? [])].filter(Boolean));
    for (const id of cast) if (!tagged.has(id)) errors.push(`campaigns: "${camp.id}" deals "${id}", who is not tagged campaign "${camp.id}" in characters.json`);
    for (const id of tagged) if (!cast.has(id)) warnings.push(`campaigns: "${id}" is tagged campaign "${camp.id}" but the campaign never deals them`);
    const mtagged = new Set((datasets.monsters?.monsters ?? []).filter((x) => x.campaign === camp.id).map((x) => x.id));
    for (const id of camp.monsters ?? []) if (!mtagged.has(id)) errors.push(`campaigns: "${camp.id}" lists monster "${id}", which is not tagged campaign "${camp.id}" in monsters.json`);
    for (const id of mtagged) if (!(camp.monsters ?? []).includes(id)) warnings.push(`campaigns: monster "${id}" is tagged campaign "${camp.id}" but the campaign never lists it`);
  }
  const seenCodes = new Set();
  for (const c of cards) {
    if (!c.cardCode) { errors.push(`campaigns: card "${c.id}" has no cardCode`); continue; }
    if (seenCodes.has(c.cardCode)) errors.push(`campaigns: duplicate card code ${c.cardCode}`);
    seenCodes.add(c.cardCode);
    if (!c.told?.trim()) errors.push(`campaigns: ${c.cardCode} has no "told" - the story is the reason the card exists, and it prints a blank panel without one`);
    if (!c.play?.trim()) errors.push(`campaigns: ${c.cardCode} has no "play" - the card would print no rule`);
    if (!c.books) errors.push(`campaigns: ${c.cardCode} names no "books" - where in the source this chapter is`);
    if (!c.lesson?.trim()) warnings.push(`campaigns: ${c.cardCode} has no "lesson"`);
    const map = mapOf.get(c.campaign);
    if (!map) continue;
    if (!c.site?.region) { errors.push(`campaigns: ${c.cardCode} names no site.region - a chapter happens somewhere on ${map.id}`); continue; }
    const regions = new Set((map.regions ?? []).map((r) => r.id));
    const places = new Set((map.settlements ?? []).map((p) => p.id));
    if (regions.size && !regions.has(c.site.region)) errors.push(`campaigns: ${c.cardCode} is set in region "${c.site.region}", which is not on ${map.id}`);
    if (c.site.place && places.size && !places.has(c.site.place)) errors.push(`campaigns: ${c.cardCode} is set at "${c.site.place}", which is not a settlement on ${map.id}`);
    for (const id of c.meets?.characters ?? []) {
      const ch = (datasets.characters?.characters ?? []).find((x) => x.id === id);
      if (ch && ch.campaign !== c.campaign) warnings.push(`campaigns: ${c.cardCode} meets "${id}", who belongs to no campaign or another one`);
    }
  }
}

console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
