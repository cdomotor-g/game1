#!/usr/bin/env node
/**
 * Checks the maps in data/maps/ against data/terrain.json and against themselves.
 *
 * Same principle as validate-data.mjs: the errors worth catching in a hand-edited
 * board are not type errors, they are "you moved the coastline and left a deep
 * water hex touching the beach" and "this town is standing in the sea". A hex map
 * has a lot of internal consistency to lean on, and every rule below is one that
 * has actually caught something.
 *
 * Usage: node tools/validate-map.mjs [--quiet]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neighbours, hexId } from './lib/hexgrid.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAPS = join(ROOT, 'data', 'maps');
const quiet = process.argv.includes('--quiet');

const errors = [];
const warnings = [];

const terrainFile = JSON.parse(readFileSync(join(ROOT, 'data', 'terrain.json'), 'utf8'));
const terrainById = new Map(terrainFile.terrains.map((t) => [t.id, t]));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs', 'art', 'palette.json'), 'utf8'));

if (!existsSync(MAPS)) {
  console.log('no data/maps/ directory; nothing to check.');
  process.exit(0);
}

const files = readdirSync(MAPS).filter((f) => f.endsWith('.json'));
for (const file of files) checkMap(file);

function checkMap(file) {
  const where = `data/maps/${file}`;
  let map;
  try {
    map = JSON.parse(readFileSync(join(MAPS, file), 'utf8'));
  } catch (err) {
    errors.push(`${where}: not valid JSON - ${err.message}`);
    return;
  }

  if (`${map.id}.json` !== file) {
    errors.push(`${where}: id "${map.id}" does not match the filename`);
  }

  /* -------------------------------------------------------------- the legend */
  const legend = Object.fromEntries(Object.entries(map.legend ?? {}).filter(([k]) => !k.startsWith('$')));
  for (const [ch, id] of Object.entries(legend)) {
    if (ch.length !== 1) errors.push(`${where}: legend key "${ch}" is not a single character`);
    if (!terrainById.has(id)) errors.push(`${where}: legend "${ch}" maps to unknown terrain "${id}"`);
    if (!palette.terrain[id]) warnings.push(`${where}: terrain "${id}" has no colour in docs/art/palette.json`);
  }
  const unused = [...terrainById.keys()].filter((id) => !Object.values(legend).includes(id));
  if (unused.length) {
    warnings.push(`${where}: terrain types with no character in the legend: ${unused.join(', ')}`);
  }

  /* ---------------------------------------------------------------- the grid */
  const { cols, rows: rowCount } = map.grid ?? {};
  if (!cols || !rowCount) {
    errors.push(`${where}: grid.cols and grid.rows are required`);
    return;
  }
  if (!Array.isArray(map.rows) || map.rows.length !== rowCount) {
    errors.push(`${where}: expected ${rowCount} rows, found ${map.rows?.length ?? 0}`);
    return;
  }

  const at = (col, row) => (row >= 0 && row < rowCount && col >= 0 && col < cols ? legend[map.rows[row][col]] : null);

  for (let row = 0; row < rowCount; row++) {
    const line = map.rows[row];
    if (line.length !== cols) {
      errors.push(`${where}: row ${row} is ${line.length} characters, expected ${cols}`);
      continue;
    }
    for (let col = 0; col < cols; col++) {
      if (!legend[line[col]]) {
        errors.push(`${where}: ${hexId(col, row)} uses "${line[col]}", which is not in the legend`);
      }
    }
  }
  if (errors.length) return;

  /* ------------------------------------------------------- coastline sanity */
  const isWater = (id) => terrainById.get(id)?.family === 'water';
  const around = (col, row) =>
    neighbours(col, row)
      .map((n) => at(n.col, n.row))
      .filter(Boolean);

  let deepTouchingLand = 0;
  let coastWithoutWater = 0;
  let shoreWithoutLake = 0;
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < cols; col++) {
      const id = at(col, row);
      const ring = around(col, row);

      /* Deep water is defined as unbridgeable and shipping-only. A deep hex against
         a beach means a barge cannot reach a coastal town it is drawn next to. */
      if (id === 'deep-water' && ring.some((n) => !isWater(n))) {
        deepTouchingLand++;
        if (deepTouchingLand <= 8) errors.push(`${where}: ${hexId(col, row)} is deep water touching land`);
      }
      if (id === 'coast' && !ring.some(isWater)) {
        coastWithoutWater++;
        if (coastWithoutWater <= 8) errors.push(`${where}: ${hexId(col, row)} is coast with no water beside it`);
      }
      if (id === 'lake-shore' && !ring.some(isWater)) {
        shoreWithoutLake++;
        if (shoreWithoutLake <= 8) errors.push(`${where}: ${hexId(col, row)} is lake shore with no water beside it`);
      }
    }
  }
  for (const [label, n] of [
    ['deep water touching land', deepTouchingLand],
    ['coast with no water', coastWithoutWater],
    ['lake shore with no water', shoreWithoutLake],
  ]) {
    if (n > 8) errors.push(`${where}: ...and ${n - 8} more hexes are ${label}`);
  }

  /* ------------------------------------------------------------- landmasses */
  const seen = new Set();
  const masses = [];
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < cols; col++) {
      if (isWater(at(col, row)) || seen.has(hexId(col, row))) continue;
      let size = 0;
      const stack = [[col, row]];
      while (stack.length) {
        const [c, r] = stack.pop();
        const key = hexId(c, r);
        if (seen.has(key) || !at(c, r) || isWater(at(c, r))) continue;
        seen.add(key);
        size++;
        for (const n of neighbours(c, r)) stack.push([n.col, n.row]);
      }
      masses.push(size);
    }
  }
  masses.sort((a, b) => b - a);

  /* ------------------------------------------------------------ settlements */
  const occupied = new Map();
  for (const s of map.settlements ?? []) {
    const key = hexId(s.col, s.row);
    const id = at(s.col, s.row);
    if (!id) {
      errors.push(`${where}: settlement "${s.name}" at ${key} is off the grid`);
      continue;
    }
    if (isWater(id)) errors.push(`${where}: settlement "${s.name}" at ${key} is standing in ${id}`);
    if (occupied.has(key)) {
      errors.push(`${where}: "${s.name}" and "${occupied.get(key)}" are both on ${key}`);
    }
    occupied.set(key, s.name);
    if (s.harbour && id !== 'coast' && id !== 'lake-shore') {
      errors.push(`${where}: "${s.name}" has a harbour but stands on ${id}, not a shore`);
    }
    if (terrainById.get(id)?.housingAllowed === false) {
      errors.push(`${where}: "${s.name}" is on ${id}, which does not allow housing`);
    }
  }

  /* ---------------------------------------------------------------- routes */

  /* Rail and shipping are hex paths and have to be walkable: every step onto a
     neighbour, and every hex the right side of the waterline. Roads are links
     between settlements and only have to point at settlements that exist. */
  for (const [kind, lines] of Object.entries(map.routes ?? {})) {
    if (kind.startsWith('$') || !Array.isArray(lines)) continue;

    if (kind === 'road') {
      const known = new Set((map.settlements ?? []).map((s) => s.id));
      for (const link of lines) {
        for (const end of [link.from, link.to]) {
          if (!known.has(end)) errors.push(`${where}: road links to "${end}", which is not a settlement`);
        }
      }
      continue;
    }

    for (const [i, line] of lines.entries()) {
      const name = line.id ?? i;
      const hexes = line.hexes ?? line;
      for (const h of hexes) {
        if (!at(h[0], h[1])) errors.push(`${where}: ${kind} route "${name}" passes through ${h}, off the grid`);
      }
      for (let k = 1; k < hexes.length; k++) {
        const [c, r] = hexes[k - 1];
        if (!neighbours(c, r).some((n) => n.col === hexes[k][0] && n.row === hexes[k][1])) {
          errors.push(`${where}: ${kind} route "${name}" jumps ${hexes[k - 1]} -> ${hexes[k]}, which are not neighbours`);
        }
      }
      for (const [c, r] of hexes) {
        const id = at(c, r);
        if (!id) continue;
        if (kind === 'shipping' && !isWater(id)) {
          errors.push(`${where}: shipping route "${name}" crosses ${id} at ${hexId(c, r)}`);
        }
        if (kind === 'rail' && isWater(id)) {
          errors.push(`${where}: rail route "${name}" runs through ${id} at ${hexId(c, r)} with no bridge`);
        }
      }
    }
  }

  /* --------------------------------------------------------------- the mix */
  const tally = {};
  for (const line of map.rows) for (const ch of line) tally[legend[ch]] = (tally[legend[ch]] ?? 0) + 1;
  const land = Object.entries(tally).filter(([id]) => !isWater(id)).reduce((n, [, v]) => n + v, 0);
  const biggest = terrainFile.boardSetup?.recommendedTiles?.['5players'] ?? 75;
  if (land < biggest) {
    warnings.push(`${where}: only ${land} land hexes, fewer than the ${biggest} a five-player game asks for`);
  }

  if (!quiet) {
    console.log(`${map.name} (${where})`);
    console.log(`  ${cols} x ${rowCount} = ${cols * rowCount} hexes, ${land} land, ${cols * rowCount - land} water`);
    console.log(`  landmasses: ${masses.slice(0, 6).join(', ')}${masses.length > 6 ? `, +${masses.length - 6} more` : ''}`);
    console.log(`  settlements: ${(map.settlements ?? []).length}, regions: ${(map.regions ?? []).length}`);
    const mix = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    console.log(`  ${mix.map(([id, n]) => `${id} ${n}`).join(', ')}`);

    /* A drawn continent is not a shuffled tile bag, so this is reported and never
       enforced — but a map with a quarter of the hills the rules assume is a map
       where iron is scarce, and that is worth knowing before anyone plays it. */
    const expected = terrainFile.boardSetup?.terrainMix ?? {};
    const total = cols * rowCount;
    const gaps = Object.entries(expected)
      .map(([id, share]) => [id, (tally[id] ?? 0) / total - share])
      .filter(([, d]) => Math.abs(d) >= 0.04)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    if (gaps.length) {
      console.log(
        `  against boardSetup.terrainMix: ${gaps
          .map(([id, d]) => `${id} ${d > 0 ? '+' : ''}${Math.round(d * 100)}pp`)
          .join(', ')}`
      );
    }
  }
}

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error:   ${e}`);
console.log(`\n${files.length} map(s), ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
