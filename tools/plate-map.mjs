#!/usr/bin/env node
/**
 * Where the drawing is, as text.
 *
 * Aiming a plate starts with a measurement - the box the ink actually occupies -
 * and the way that has been done is to overlay a coordinate grid on the plate,
 * open it, squint, then open two or three magnified strips to pin the edges
 * down. Four or five images to answer a question whose answer is eight numbers.
 *
 * This prints it as a character map with rulers on it. It does not replace
 * looking at the plate once - nothing here tells you which blob is the head -
 * but it replaces looking at it four times, and it pairs with
 * tools/aim-solve.mjs: a box read off this map only has to be close, because
 * the solver reports what every window does with it in text and the correcting
 * happens there rather than by opening the picture again.
 *
 * It deliberately does NOT offer a bounding box. Thresholding the map finds the
 * whole page on every plate in this repository, and for a good reason: these are
 * full-page bestiary plates drawn edge to edge, and the Hoarwyrm is bare paper
 * on a plate whose margins are also bare paper. A number that is always 0 to 1
 * is not a measurement, and printing it in the right format would only make it
 * look like one.
 *
 *   node tools/plate-map.mjs MON-05
 *   node tools/plate-map.mjs monster-hoarwyrm --mode light
 *
 * THREE MODES, because "where is the drawing" is not one question on these
 * plates and a tool that pretended otherwise would be confidently wrong:
 *
 *   edges  (default)  local gradient - how much line is here. Bare paper is 0.
 *                     Finds a drawn subject on an empty page, which is most of
 *                     them.
 *   dark              darkness. Finds a heavily inked subject, and also finds
 *                     any hatched ground it is standing on.
 *   light             lightness. For a subject drawn in BARE PAPER against a
 *                     hatched sky - the Hoarwyrm is white-scaled and its sky is
 *                     solid slate, so `edges` and `dark` both return the sky.
 *
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPng, luminance } from './lib/png.mjs';
import { plateIdFor } from './lib/plates.mjs';
import { cardsOfDeck } from './lib/mint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs/art/renders');

const RAMP = ' .:-=+*#%@';

const argv = process.argv.slice(2);
const value = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const target = argv.find((a) => !a.startsWith('--') && !argv.includes(`--${a}`) &&
  (argv.indexOf(a) === 0 || !argv[argv.indexOf(a) - 1].startsWith('--')));

if (!target) {
  console.error('usage: node tools/plate-map.mjs <code|plate> [--cols 40] [--mode edges|dark|light]');
  process.exit(1);
}

const COLS = Number(value('cols', 40));
const MODE = value('mode', 'edges');
if (!['edges', 'dark', 'light'].includes(MODE)) {
  console.error(`plate-map: --mode must be edges, dark or light - got "${MODE}"`);
  process.exit(1);
}

/* ------------------------------------------------------------ find the plate */

const components = JSON.parse(readFileSync(join(ROOT, 'data/components.json'), 'utf8'));
let plate = target;
let code = null;
outer: for (const deck of components.decks) {
  if (!deck.source || !existsSync(join(ROOT, 'data', deck.source))) continue;
  let cards;
  try { cards = cardsOfDeck(ROOT, deck); } catch { continue; }
  for (const card of cards) {
    let id;
    try { id = plateIdFor(deck, card); } catch { continue; }
    if (id === target || card.cardCode === target) { plate = id; code = card.cardCode; break outer; }
  }
}

const file = join(RENDERS, `${plate}.png`);
if (!existsSync(file)) {
  console.error(`plate-map: no plate at docs/art/renders/${plate}.png`);
  process.exit(1);
}

/* ------------------------------------------------------------- the sampling */

const image = readPng(file);
const rows = Math.max(1, Math.round((COLS * image.height) / image.width));
const cellW = image.width / COLS;
const cellH = image.height / rows;

const lum = (x, y) => {
  const i = (Math.min(image.height - 1, y) * image.width + Math.min(image.width - 1, x)) * 3;
  return luminance(image.rgb[i], image.rgb[i + 1], image.rgb[i + 2]) / 255;
};

/**
 * One number per cell, sampled rather than integrated.
 *
 * A full read of a four-megapixel plate per cell is wasted work for a map forty
 * characters wide: a stride that lands about twenty samples across each cell
 * gives the same picture at a fortieth of the cost, and the noise it introduces
 * is far below one step of a ten-character ramp.
 */
const STEP = Math.max(1, Math.floor(Math.min(cellW, cellH) / 20));
const grid = [];
for (let r = 0; r < rows; r++) {
  const line = [];
  for (let c = 0; c < COLS; c++) {
    const x0 = Math.floor(c * cellW);
    const y0 = Math.floor(r * cellH);
    const x1 = Math.floor((c + 1) * cellW);
    const y1 = Math.floor((r + 1) * cellH);
    let sum = 0;
    let n = 0;
    for (let y = y0; y < y1; y += STEP) {
      for (let x = x0; x < x1; x += STEP) {
        if (MODE === 'edges') {
          /* Gradient magnitude, cheaply: how far this pixel is from the two a
             stride away. Hatching reads high, bare paper reads zero, and a flat
             wash reads zero too - which is the point, since a wash is not line. */
          const here = lum(x, y);
          sum += Math.abs(here - lum(x + STEP, y)) + Math.abs(here - lum(x, y + STEP));
        } else {
          sum += MODE === 'dark' ? 1 - lum(x, y) : lum(x, y);
        }
        n++;
      }
    }
    line.push(n ? sum / n : 0);
  }
  grid.push(line);
}

/* Normalised to the plate's own range, and to its 2nd and 98th percentile
   rather than its extremes: an absolute scale would put every plate in this
   repository into the same two characters of the ramp, and a min/max scale lets
   one over-inked corner flatten everything else into the other two. */
const sorted = grid.flat().sort((a, b) => a - b);
const at = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
const lo = at(0.02);
const hi = at(0.98);
const norm = grid.map((line) => line.map((v) => (hi > lo ? Math.min(1, Math.max(0, (v - lo) / (hi - lo))) : 0)));

/* ----------------------------------------------------------------- printing */

const pct = (n) => `${(n * 100).toFixed(1)}%`;
console.log(`${code ? `${code}  ` : ''}${plate} — ${image.width} x ${image.height}, ${MODE}, ${COLS} x ${rows} cells`);

/* A ruler on both axes, because the whole point is reading coordinates off it. */
const tens = Array.from({ length: COLS }, (_, c) => {
  const at = (c + 0.5) / COLS;
  return Math.floor(at * 10) !== Math.floor((c - 0.5 + 0.5) / COLS * 10) ? String(Math.floor(at * 10)) : ' ';
});
console.log(`      ${tens.join('')}   <- tenths of the width`);

for (let r = 0; r < rows; r++) {
  const at = (r + 0.5) / rows;
  const label = `${(at * 100).toFixed(0).padStart(3)}% `;
  const line = norm[r].map((v) => RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))]).join('');
  console.log(` ${label} ${line}`);
}

console.log('\nRead the box off the map and hand it to tools/aim-solve.mjs as');
console.log(`  --keep x0,y0,x1,y1  (edges, fractions of the plate)`);
console.log('which will say exactly what each window does with it - so the measurement');
console.log('only has to be close, and the correcting is done in text rather than by');
console.log('opening the picture again.');
