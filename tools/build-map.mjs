#!/usr/bin/env node
/**
 * Turns a map in data/maps/ into the things people look at:
 *
 *   docs/map/<id>-proof.png   the plate with its hex grid and terrain drawn on
 *                             top, which is how you check 832 hexes without
 *                             opening a browser or trusting a tally
 *   derived print numbers     recomputed from the grid and written back into the
 *                             preset, so mapWidthMm and hexAcrossFlatsMm cannot
 *                             drift away from the geometry they describe
 *
 * The interactive map and the printable sheets are not generated: docs/map/
 * reads the same data out of docs/data/bundle.js at runtime. Only the proof needs
 * a renderer, because only the proof has to be a picture.
 *
 * Usage: node tools/build-map.mjs [map-id] [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPng, writePng, pixel } from './lib/png.mjs';
import { layout } from './lib/hexgrid.mjs';
import { createCanvas, fillPolygon, strokePolygon, disc, text, centredText, blend } from './lib/raster.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const mapId = args.find((a) => !a.startsWith('--')) ?? 'korvane-reach';
const checkOnly = args.includes('--check');

const mapPath = join(ROOT, 'data', 'maps', `${mapId}.json`);
const map = JSON.parse(readFileSync(mapPath, 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs', 'art', 'palette.json'), 'utf8'));
/* Only for the route tokens: a road bar is the length of the line between two
   hex centres, which is a map dimension, so the map's build is where it is
   worked out (see the print report at the foot of this file). */
const components = JSON.parse(readFileSync(join(ROOT, 'data', 'components.json'), 'utf8'));

/* ------------------------------------------------------- derived print sizes */

/** ISO 216 in millimetres, portrait. */
const SHEETS = { A4: [210, 297], A3: [297, 420], A5: [148, 210] };

/**
 * What one preset actually prints at. The printed thing is the whole plate,
 * decorative frame included, because the frame is part of the drawing — so the
 * aspect ratio that matters is the plate's, and the hex size falls out of it
 * rather than being chosen.
 */
export function derivePreset(preset, plate, cols) {
  const [shortSide, longSide] = SHEETS[preset.sheet] ?? SHEETS.A4;
  const [sheetW, sheetH] =
    preset.orientation === 'landscape' ? [longSide, shortSide] : [shortSide, longSide];
  const usableW = (sheetW - 2 * preset.marginMm) * preset.sheetCols - preset.overlapMm * (preset.sheetCols - 1);
  const usableH = (sheetH - 2 * preset.marginMm) * preset.sheetRows - preset.overlapMm * (preset.sheetRows - 1);
  const aspect = plate.width / plate.height;
  /* Largest undistorted rectangle of the plate's aspect that fits the sheet block. */
  const widthMm = Math.min(usableW, usableH * aspect);
  const mmPerPixel = widthMm / plate.width;
  return {
    mapWidthMm: round(widthMm),
    mapHeightMm: round(widthMm / aspect),
    hexAcrossFlatsMm: round((plate.field.width / cols) * mmPerPixel),
    usableWidthMm: round(usableW),
    usableHeightMm: round(usableH),
    sheets: preset.sheetCols * preset.sheetRows,
    dpi: Math.round(plate.width / (widthMm / 25.4)),
  };
}

const round = (n) => Math.round(n * 10) / 10;

const drift = [];
for (const preset of map.print.presets) {
  const derived = derivePreset(preset, map.plate, map.grid.cols);
  for (const key of ['mapWidthMm', 'mapHeightMm', 'hexAcrossFlatsMm']) {
    if (Math.abs((preset[key] ?? 0) - derived[key]) > 0.15) {
      drift.push(`print preset "${preset.id}": ${key} says ${preset[key]}, geometry says ${derived[key]}`);
      preset[key] = derived[key];
    }
  }
}

if (drift.length && checkOnly) {
  for (const line of drift) console.error(`  ${line}`);
  console.error('\nRun `node tools/build-map.mjs` to write the corrected numbers back.');
  process.exit(1);
}
if (drift.length) {
  writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
  for (const line of drift) console.log(`corrected ${line}`);
}

/* A GENERATED plate needs no proof. The proof sheet exists to check a board that
   was TRACED off artwork - it draws the grid and the read terrain back over the
   pixels so 832 hexes can be eyeballed without trusting a tally. A generated
   board is not read off anything: the rows are the source and the picture is
   drawn from them, so a proof would only be checking the renderer against
   itself. The print presets above are still derived, because those are geometry
   and the geometry is the same either way. */
if (map.plate?.kind === 'generated') {
  console.log(`${map.name}: generated plate — ${map.plate.file}, vector, no proof sheet`);
  for (const preset of map.print.presets) {
    console.log(
      `  print ${preset.id.padEnd(11)} ${preset.sheetCols}x${preset.sheetRows} ${preset.sheet} ` +
        `${preset.orientation} -> ${preset.mapWidthMm} x ${preset.mapHeightMm} mm, ${preset.hexAcrossFlatsMm} mm hex, any dpi`
    );
  }
  console.log('  Vector: every preset prints at full quality. The dpi column is what a raster plate would have managed.');
  process.exit(0);
}

/* ------------------------------------------------------------- proof render */

const { cols, rows: rowCount } = map.grid;
const FIELD = map.plate.field;
const terrainOf = {};
for (const [ch, id] of Object.entries(map.legend)) if (!ch.startsWith('$')) terrainOf[ch] = id;

const plate = readPng(join(ROOT, 'docs', 'map', map.plate.file));
const PROOF_WIDTH = 1900;
const scale = PROOF_WIDTH / plate.width;
const proofHeight = Math.round(plate.height * scale);

const acrossFlats = FIELD.width / cols;
const radius = acrossFlats / Math.sqrt(3);
const grid = layout({
  cols,
  rows: rowCount,
  acrossFlats,
  originX: FIELD.x + (FIELD.width - acrossFlats * (cols + 0.5)) / 2,
  originY: FIELD.y + (FIELD.height - (1.5 * radius * (rowCount - 1) + 2 * radius)) / 2,
});

const canvas = createCanvas(PROOF_WIDTH, proofHeight);
for (let y = 0; y < proofHeight; y++) {
  for (let x = 0; x < PROOF_WIDTH; x++) {
    const p = pixel(plate, x / scale, y / scale);
    const d = (y * PROOF_WIDTH + x) * 3;
    canvas.rgb[d] = p[0];
    canvas.rgb[d + 1] = p[1];
    canvas.rgb[d + 2] = p[2];
  }
}

const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const SOOT = rgbOf(palette.ink.soot.hex);
const PAPER = rgbOf(palette.paper.tallow.hex);

const tally = {};
for (let row = 0; row < rowCount; row++) {
  const line = map.rows[row] ?? '';
  for (let col = 0; col < cols; col++) {
    const ch = line[col];
    const id = terrainOf[ch];
    tally[id ?? `?${ch}`] = (tally[id ?? `?${ch}`] ?? 0) + 1;
    const wash = palette.terrain[id]?.wash ?? '#FF00FF';
    const points = grid.corners(col, row).map(([x, y]) => [x * scale, y * scale]);
    fillPolygon(canvas, points, rgbOf(wash), 0.45);
    strokePolygon(canvas, points, SOOT, 0.5);
    const c = grid.centre(col, row);
    centredText(canvas, ch ?? '?', c.x * scale, c.y * scale - 2, 1, SOOT, PAPER);
  }
}

/* Column and row rulers along the top and left, every fifth line, so a hex can be
   named from the picture without counting from the edge. */
for (let col = 0; col < cols; col += 5) {
  const c = grid.centre(col, 0);
  centredText(canvas, String(col), c.x * scale, 4, 2, [170, 20, 20], PAPER);
}
for (let row = 0; row < rowCount; row += 5) {
  const c = grid.centre(0, row);
  text(canvas, String(row), 4, c.y * scale - 5, 2, [170, 20, 20], PAPER);
}

/* Settlements, drawn as a ring so the plate's own symbol stays visible inside it. */
for (const s of map.settlements ?? []) {
  const c = grid.centre(s.col, s.row);
  const px = c.x * scale;
  const py = c.y * scale;
  disc(canvas, px, py, 7, rgbOf(palette.inks.oxide.hex), 0.9);
  disc(canvas, px, py, 4, PAPER, 0.95);
  centredText(canvas, s.name.toUpperCase(), px, py + 10, 1, rgbOf(palette.inks.oxide.hex), PAPER);
}

/* Map furniture, outlined so it is obvious which hexes were guessed. */
for (const o of map.plate.occlusions ?? []) {
  const x0 = (FIELD.x + o.x * FIELD.width) * scale;
  const y0 = (FIELD.y + o.y * FIELD.height) * scale;
  const x1 = (FIELD.x + (o.x + o.width) * FIELD.width) * scale;
  const y1 = (FIELD.y + (o.y + o.height) * FIELD.height) * scale;
  strokePolygon(canvas, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], [170, 20, 20], 0.9);
}

const proofPath = join(ROOT, 'docs', 'map', `${mapId}-proof.png`);
if (!checkOnly) writePng(proofPath, canvas);

const total = cols * rowCount;
const land = Object.entries(tally)
  .filter(([id]) => !['deep-water', 'shallow-water'].includes(id))
  .reduce((n, [, v]) => n + v, 0);
console.log(`${map.name}: ${cols} x ${rowCount} = ${total} hexes, ${land} of them land`);
for (const [id, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${id.padEnd(15)} ${String(n).padStart(4)}  ${((100 * n) / total).toFixed(1)}%`);
}
for (const preset of map.print.presets) {
  const d = derivePreset(preset, map.plate, map.grid.cols);
  console.log(
    `  print ${preset.id.padEnd(11)} ${preset.sheetCols}x${preset.sheetRows} ${preset.sheet} ` +
      `${preset.orientation} -> ${preset.mapWidthMm} x ${preset.mapHeightMm} mm, ` +
      `${preset.hexAcrossFlatsMm} mm hex, ${d.dpi} dpi`
  );
  /* A route token is a bar laid along the line between two hex centres, and for
     a pointy-top hex that line is exactly acrossFlats long - so the token's size
     is the MAP's business, not the token's, and this is where it gets worked
     out. components.json states it as fractions and nothing anywhere types a
     millimetre; print the map at a different preset and the bars follow.
     A mini-map cell is the same hex, so a bar cut for the default preset fits a
     mini-map lane too (components.json minimap). */
  const route = components?.tokens?.route;
  if (route) {
    const len = round(preset.hexAcrossFlatsMm * route.lengthFraction);
    const bars = ['road', 'rail', 'bridge']
      .filter((k) => route[k])
      .map((k) => `${k} ${len} x ${round(preset.hexAcrossFlatsMm * route[k].widthFraction)} mm`)
      .join(', ');
    console.log(`         route tokens  ${bars}`);
  }
}
if (!checkOnly) console.log(`wrote docs/map/${mapId}-proof.png`);
