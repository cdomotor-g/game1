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

// Mass and burden are one system: an item weighs, a figure carries, and the
// burden bar has to print a ladder that tops out at exactly the limit.
const carrying = datasets.rules?.carrying;
const peoples = datasets.peoples?.peoples ?? [];
const characters = datasets.characters?.characters ?? [];
const itemList = datasets.items?.items ?? [];
const step = carrying?.barStepKg;

if (!carrying) errors.push('rules: no "carrying" block - items have mass and nothing says what it is for');
for (const i of itemList) {
  if (typeof i.massKg !== 'number') errors.push(`items: "${i.id}" has no massKg`);
  else if (i.massKg <= 0) errors.push(`items: "${i.id}" has massKg ${i.massKg} - an item weighs something`);
}
for (const p of peoples) {
  if (typeof p.carry?.baseKg !== 'number') errors.push(`peoples: "${p.id}" has no carry.baseKg`);
}

const massOf = new Map(itemList.map((i) => [i.id, i.massKg]));
const carryOf = new Map(peoples.map((p) => [p.id, p.carry?.baseKg]));
const biggestCarry = Math.max(0, ...characters.map((c) => c.carryKg || 0), ...carryOf.values());

for (const c of characters) {
  if (typeof c.carryKg !== 'number' || c.carryKg <= 0) {
    errors.push(`characters: "${c.id}" has no carryKg - every character card prints a burden bar`);
    continue;
  }
  /* barScale picks the step; a limit off the step prints a top mark ABOVE the
     limit, which is a card that lies about what it can carry. */
  if (step && c.carryKg % step !== 0) {
    errors.push(`characters: "${c.id}" carries ${c.carryKg}kg, which is not a multiple of the ${step}kg bar step - the bar would print a mark past the limit`);
  }
  const base = carryOf.get(c.people);
  if (typeof base === 'number' && Math.abs(c.carryKg - base) > 8) {
    warnings.push(`characters: "${c.id}" carries ${c.carryKg}kg against a ${c.people} base of ${base}kg - a long way off their people`);
  }
  const kit = (c.startsWith ?? []).reduce((sum, id) => sum + (massOf.get(id) ?? 0), 0);
  if (kit > c.carryKg) {
    errors.push(`characters: "${c.id}" starts with ${kit}kg of gear but can carry ${c.carryKg}kg`);
  }
}

for (const i of itemList) {
  if (typeof i.massKg === 'number' && i.massKg > biggestCarry) {
    warnings.push(`items: "${i.id}" weighs ${i.massKg}kg - more than any figure in the game can carry`);
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
