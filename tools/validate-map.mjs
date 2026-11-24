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
import { neighbours as flatNeighbours, hexId } from './lib/hexgrid.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAPS = join(ROOT, 'data', 'maps');
const quiet = process.argv.includes('--quiet');

const errors = [];
const warnings = [];
const commissions = [];

const terrainFile = JSON.parse(readFileSync(join(ROOT, 'data', 'terrain.json'), 'utf8'));
const terrainById = new Map(terrainFile.terrains.map((t) => [t.id, t]));
/* Which water counts as the sea, for a harbour. Declared once in
   data/terrain.json siting.waterside.kinds - this file does not get to have
   an opinion about it. */
const SEA = new Set(terrainFile.siting?.waterside?.kinds?.sea ?? []);
const palette = JSON.parse(readFileSync(join(ROOT, 'docs', 'art', 'palette.json'), 'utf8'));

if (!existsSync(MAPS)) {
  console.log('no data/maps/ directory; nothing to check.');
  process.exit(0);
}

/* A board that goes all the way round the planet (grid.wrap, the Atlas) steps off its east edge onto its
   west edge, so every check below asks for neighbours through this. */
let WRAP_COLS = 0;
const neighbours = (c, r) => flatNeighbours(c, r).map((n) => (WRAP_COLS ? { col: ((n.col % WRAP_COLS) + WRAP_COLS) % WRAP_COLS, row: n.row } : n));

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

  /* ----------------------------------------------------------- the relief plate */
  /* A real-Earth board may carry a raster relief plate and its layers (tools/earth/relief.py). It is a
     committed build output a person runs, so CI cannot redraw it - but it can check the files are there,
     the same size as the plate, and drawn for the same georeference, which is what goes wrong when the
     board changes and nobody re-runs the tool. */
  if (map.plate?.relief) {
    const dir = join(ROOT, 'docs', 'map');
    const manifestPath = join(dir, map.plate.relief.manifest);
    if (!existsSync(join(dir, map.plate.relief.file))) errors.push(`${where}: plate.relief.file ${map.plate.relief.file} is missing - run tools/earth/relief.py`);
    if (!existsSync(manifestPath)) errors.push(`${where}: plate.relief.manifest ${map.plate.relief.manifest} is missing - run tools/earth/relief.py`);
    else {
      const man = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const g = map.plate.geo ?? {};
      if (man.plate?.width !== map.plate.width || man.plate?.height !== map.plate.height) {
        errors.push(`${where}: the relief layers are ${man.plate?.width} x ${man.plate?.height} but the plate is ${map.plate.width} x ${map.plate.height} - re-run tools/earth/relief.py`);
      }
      for (const k of ['lon0', 'lat0', 'hexLon', 'rowLat']) {
        if (Math.abs((man.georeference?.[k] ?? NaN) - g[k]) > 1e-9) errors.push(`${where}: the relief layers were drawn for a different ${k} (${man.georeference?.[k]} against ${g[k]}) - re-run tools/earth/relief.py`);
      }
      for (const layer of man.layers ?? []) {
        if (!existsSync(join(dir, 'layers', map.id, layer.file))) errors.push(`${where}: relief layer "${layer.id}" lists ${layer.file}, which is not there`);
      }
    }
  }

  /* ---------------------------------------------------------------- the grid */
  const { cols, rows: rowCount } = map.grid ?? {};
  if (!cols || !rowCount) {
    errors.push(`${where}: grid.cols and grid.rows are required`);
    return;
  }

  /* A COMMISSION, not a board: the plate has not been drawn, so there is nothing
     to trace and no coastline to be wrong about. It is still a map file and it is
     still checked - the legend above, and the commission contract, which is
     data/mint.json lines.maps.subjectRequires and is enforced by
     tools/mint-queue.mjs. Everything below this point is about a board, so a
     commission says what it is and stops. See docs/MINT.md. */
  if (!Array.isArray(map.rows) || map.rows.length === 0) {
    if (!map.commission) {
      errors.push(`${where}: has no rows and no commission - a map file is either a board or a commission for one`);
      return;
    }
    commissions.push(map);
    if (!quiet) {
      console.log(`${map.name} (${where})`);
      console.log(`  COMMISSIONED — no plate yet. ${cols} x ${rowCount} grid reserved, ${cols * rowCount} hexes.`);
      console.log(`  ${map.commission.why}`);
      console.log(`  next: node tools/mint-queue.mjs`);
    }
    return;
  }

  if (map.rows.length !== rowCount) {
    errors.push(`${where}: expected ${rowCount} rows, found ${map.rows.length}`);
    return;
  }

  WRAP_COLS = map.grid.wrap ? cols : 0;
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
  let inlandWithoutLand = 0;
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < cols; col++) {
      const id = at(col, row);
      const ring = around(col, row);

      /* Deep water is defined as unbridgeable and shipping-only. A deep hex against
         a beach means a barge cannot reach a waterside town it is drawn next to. */
      if (id === 'deep-water' && ring.some((n) => !isWater(n))) {
        deepTouchingLand++;
        if (deepTouchingLand <= 8) errors.push(`${where}: ${hexId(col, row)} is deep water touching land`);
      }
      /* A river and a lake are inland water, and inland water has a bank. A hex
         of either with nothing but water all round it is not a river or a lake -
         it is sea, drawn as one and coded as the other. This is the check that
         replaced "coast with no water beside it", and it is the same check
         turned inside out: the old one asked whether a shore had any water, and
         this one asks whether a watercourse has any shore. */
      if ((id === 'river' || id === 'lake') && !ring.some((n) => !isWater(n))) {
        inlandWithoutLand++;
        if (inlandWithoutLand <= 8) errors.push(`${where}: ${hexId(col, row)} is ${id} with no land beside it`);
      }
    }
  }
  for (const [label, n] of [
    ['deep water touching land', deepTouchingLand],
    ['inland water with no bank', inlandWithoutLand],
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
    /* An ANCHORAGE (`afloat`) is the one settlement allowed on water: an Atlas port whose hex is sea at
       1,400 km a hex. Only a board with commission.atlas grows one. */
    if (isWater(id) && !(s.afloat && map.commission?.atlas)) errors.push(`${where}: settlement "${s.name}" at ${key} is standing in ${id}`);
    if (occupied.has(key)) {
      errors.push(`${where}: "${s.name}" and "${occupied.get(key)}" are both on ${key}`);
    }
    occupied.set(key, s.name);
    /* A harbour is waterside on the SEA (terrain.json siting.waterside), which is
       a relationship with the hexes around it rather than a property of the hex
       it stands on. It used to be "this settlement is on a coast tile", which
       meant a harbour could only exist where the artist had painted a strip of
       beach - and meant a town on a lake could never have a dock at all. */
    if (s.harbour && !s.afloat && !isWater(id) && !around(s.col, s.row).some((n) => SEA.has(n))) {
      errors.push(`${where}: "${s.name}" has a harbour but no sea reaches it - a harbour is waterside on the sea (terrain.json siting.waterside)`);
    }
    /* On the Atlas a port is a point in a 1,400 km hex, not a building on it: Aden's hex is mountain. */
    if (terrainById.get(id)?.housingAllowed === false && !map.commission?.atlas) {
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

  /* ------------------------------------------------------------- the Atlas */
  /* A lane is sailed hex by hex: every step onto a neighbour (round the back of the board where it
     wraps), every hex water but the ports it starts and ends at. An airship line only has to be a chain. */
  if (map.atlas) {
    const portHex = new Map((map.atlas.ports ?? []).map((p) => [p.id, p.hex]));
    const known = new Set((map.settlements ?? []).map((s) => s.id));
    for (const p of map.atlas.ports ?? []) {
      if (!known.has(p.id)) errors.push(`${where}: atlas port "${p.id}" is not a settlement on the board`);
      if (!['board', 'abstract'].includes(p.kind)) errors.push(`${where}: atlas port "${p.id}" is a "${p.kind}" - a port opens onto a Region board or is an abstract harbour`);
    }
    const chain = (kind, line, hexes) => {
      for (let k = 1; k < hexes.length; k++) {
        const [c, r] = hexes[k - 1];
        if (!neighbours(c, r).some((n) => n.col === hexes[k][0] && n.row === hexes[k][1])) errors.push(`${where}: ${kind} "${line.id}" jumps ${hexes[k - 1]} -> ${hexes[k]}`);
      }
    };
    for (const lane of map.atlas.lanes ?? []) {
      chain('lane', lane, lane.hexes);
      const stops = new Set(lane.ports.map((id) => String(portHex.get(id))));
      for (const id of lane.ports) if (!portHex.has(id)) errors.push(`${where}: lane "${lane.id}" calls at "${id}", which is not a port`);
      for (const [c, r] of lane.hexes) {
        if (!isWater(at(c, r)) && !stops.has(String([c, r]))) errors.push(`${where}: lane "${lane.id}" sails over ${at(c, r)} at ${hexId(c, r)} - land is closed to a ship except at its ports`);
      }
    }
    for (const air of map.atlas.airships ?? []) chain('airship line', air, air.hexes);
    if ((map.atlas.winds?.hexes ?? []).length !== cols * rowCount) errors.push(`${where}: the atlas has winds for ${(map.atlas.winds?.hexes ?? []).length} hexes, not ${cols * rowCount} - run tools/build-atlas.mjs`);
  } else if (map.commission?.atlas && (map.rows ?? []).length) {
    errors.push(`${where}: an Atlas board with no atlas block - run tools/build-atlas.mjs`);
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
console.log(
  `\n${files.length} map(s)` +
    (commissions.length ? `, ${commissions.length} of them commissioned and not drawn yet` : '') +
    `, ${errors.length} error(s), ${warnings.length} warning(s)`
);
process.exit(errors.length ? 1 : 0);
