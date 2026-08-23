#!/usr/bin/env node
/**
 * Looking at the crop before you commit the aim.
 *
 * The AIM step of the mint asks for three numbers - a `subject` box, a `focal`
 * point and a note - and until now the only way to find out whether they were
 * the right three was to build the deck and open the explorer. That is a slow
 * loop for a number you are guessing at, and it is the loop that let a
 * character's chin end up on the top edge of their own card.
 *
 * So this tool does what a card window and a deck thumbnail do, and writes the
 * result out as a PNG you can actually look at. It invents no geometry of its
 * own: the arithmetic is docs/js/framing.js through tools/lib/framing.mjs, the
 * same copy the card builder and the explorer use, and the card window is read
 * out of the built card rather than recomputed - so if this says the crop is
 * good, the card agrees, because it is the card's own number.
 *
 * Two windows are previewed, and both are real rather than representative:
 *
 *   card   the picture window on docs/cards/<CODE>.svg, if the deck has been
 *          built. That window is sized for the WORDIEST card in its deck, so it
 *          moves when a sibling lands - which is exactly why it is read fresh
 *          instead of remembered.
 *   thumb  5:4, which is what the explorer gives a plate in docs/index.html.
 *
 * A plate with no framing entry is previewed anyway, on the whole page, because
 * seeing the bad crop is the fastest way to understand what the entry is for.
 *
 * Previews are diagnostics and are git-ignored, exactly like the map proof
 * sheets: regenerate one whenever you want it, and never commit it.
 *
 *   node tools/aim-preview.mjs MOD-01
 *   node tools/aim-preview.mjs modification-spinnaker --width 1200
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPng, writePng } from './lib/png.mjs';
import { crop, readFraming, WHOLE_PLATE } from './lib/framing.mjs';
import { plateIdFor } from './lib/plates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs/art/renders');
const CARDS = join(ROOT, 'docs/cards');
const OUT_DIR = join(ROOT, 'docs/art/aim');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

/* The explorer's own thumbnail shape. Kept here as a named constant rather than
   a bare 1.25 in the middle of a loop, because when the explorer changes shape
   this is the line that has to change with it. */
const THUMB_ASPECT = 5 / 4;

/* ------------------------------------------------------------ what to preview */

const args = process.argv.slice(2);
const widthFlag = args.indexOf('--width');
const MAX_WIDTH = widthFlag === -1 ? 900 : Number(args[widthFlag + 1]);
/* Everything that is neither a flag nor a flag's value. Written out rather than
   filtered by index, because `--width` being absent puts its value at index 0
   and quietly eats the only argument there was. */
const skip = new Set(widthFlag === -1 ? [] : [widthFlag, widthFlag + 1]);
const subject = args.find((a, i) => !skip.has(i) && !a.startsWith('--'));

if (!subject) {
  console.error('usage: node tools/aim-preview.mjs <card-code|plate-id> [--width px]');
  process.exit(2);
}

const components = readJson(join(ROOT, 'data/components.json'));

/**
 * A card code or a plate id, resolved to both.
 *
 * The deck templates its own plate names (`plateId` in components.json), so this
 * asks each deck to name the plates of the cards in its own source file and
 * matches on either end. A plate id that no deck claims is still previewable -
 * it just cannot report a card window, because there is no card.
 */
function resolve(input) {
  for (const deck of components.decks) {
    if (!deck.source) continue;
    const file = join(ROOT, 'data', deck.source);
    if (!existsSync(file)) continue;
    const data = readJson(file);
    const cards = data[deck.id] || data[Object.keys(data).find((k) => Array.isArray(data[k]))] || [];
    for (const card of cards) {
      if (!card.cardCode) continue;
      let plate;
      try { plate = plateIdFor(deck, card); } catch { continue; }
      if (card.cardCode === input || plate === input) return { deck, card, plate, code: card.cardCode };
    }
  }
  /* Not a card: treat it as a bare plate id, so a plate can be aimed before
     anything in data/ has been wired up to it. */
  return { deck: null, card: null, plate: input, code: null };
}

const { plate, code } = resolve(subject);
const platePath = join(RENDERS, `${plate}.png`);

if (!existsSync(platePath)) {
  console.error(`aim-preview: no plate at docs/art/renders/${plate}.png`);
  console.error('             the artist has not delivered it yet - node tools/mint-queue.mjs says who is holding what.');
  process.exit(1);
}

/* ------------------------------------------------------------- the windows */

/**
 * The picture window on a built card, as a bare aspect.
 *
 * Read out of the SVG the card builder wrote, because that number is the end of
 * a chain - the deck's wordiest card, its plate proportion, the flattest a
 * window may get - and every one of those is the card builder's business, not
 * this tool's. No card built yet means no card window to report, which is a
 * true answer and better than a guessed one.
 */
function cardWindow(cardCode) {
  if (!cardCode) return null;
  const file = join(CARDS, `${cardCode}.svg`);
  if (!existsSync(file)) return null;
  const m = readFileSync(file, 'utf8')
    .match(/id="portrait-window"><rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/);
  return m ? { aspect: Number(m[1]) / Number(m[2]), w: Number(m[1]), h: Number(m[2]) } : null;
}

/* ------------------------------------------------------------- the cropping */

/**
 * Box-averaged downscale.
 *
 * Nearest-neighbour would be four lines shorter and useless: these plates are
 * built out of hand-drawn hatching, and dropping three pixels in four turns a
 * shaded panel into moire. The preview exists to be looked at, so it is worth
 * the averaging.
 */
function scaleTo(image, maxWidth) {
  if (image.width <= maxWidth) return image;
  const scale = image.width / maxWidth;
  const width = Math.max(1, Math.round(image.width / scale));
  const height = Math.max(1, Math.round(image.height / scale));
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const y0 = Math.floor(y * scale);
    const y1 = Math.min(image.height, Math.max(y0 + 1, Math.floor((y + 1) * scale)));
    for (let x = 0; x < width; x++) {
      const x0 = Math.floor(x * scale);
      const x1 = Math.min(image.width, Math.max(x0 + 1, Math.floor((x + 1) * scale)));
      let r = 0, g = 0, b = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * image.width + sx) * 3;
          r += image.rgb[i]; g += image.rgb[i + 1]; b += image.rgb[i + 2]; n++;
        }
      }
      const o = (y * width + x) * 3;
      rgb[o] = Math.round(r / n); rgb[o + 1] = Math.round(g / n); rgb[o + 2] = Math.round(b / n);
    }
  }
  return { width, height, rgb };
}

/** The rect `crop()` chose, cut out of the plate. */
function cutOut(image, rect) {
  const x0 = Math.max(0, Math.round(rect.x * image.width));
  const y0 = Math.max(0, Math.round(rect.y * image.height));
  const width = Math.min(image.width - x0, Math.round(rect.w * image.width));
  const height = Math.min(image.height - y0, Math.round(rect.h * image.height));
  /* Uint8Array, not Buffer: that is what lib/png.mjs hands out and what it takes
     back, and `.copy` is a Buffer method that is not there. */
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const from = ((y0 + y) * image.width + x0) * 3;
    rgb.set(image.rgb.subarray(from, from + width * 3), y * width * 3);
  }
  return { width, height, rgb };
}

/* ------------------------------------------------------------------- output */

const framing = readFraming(ROOT);
const entry = framing.plates[plate];
const image = readPng(platePath);

console.log(`${plate} — ${image.width} x ${image.height}`);
if (entry) {
  console.log(`  subject ${JSON.stringify(entry.subject)}`);
  console.log(`  focal   ${entry.focal ? JSON.stringify(entry.focal) : '— none. The crop centres on the subject box, which on a standing figure is their sternum.'}`);
} else {
  console.log('  NO FRAMING ENTRY — previewed on the whole page, which is what the entry exists to stop.');
  console.log('  See docs/art/09-framing-and-composition.md, then write one into docs/art/framing.json.');
}

const windows = [];
const card = cardWindow(code);
if (card) windows.push({ name: 'card', aspect: card.aspect, note: `the picture window on docs/cards/${code}.svg, ${card.w} x ${card.h} units` });
else if (code) windows.push({ name: 'card', aspect: image.width / image.height, note: "no card built yet - the plate's own shape, as a stand-in. Run tools/build-cards.mjs for the real one." });
windows.push({ name: 'thumb', aspect: THUMB_ASPECT, note: 'the explorer thumbnail in docs/index.html' });

mkdirSync(OUT_DIR, { recursive: true });

for (const window of windows) {
  const rect = crop(
    image,
    entry?.subject || WHOLE_PLATE,
    window.aspect,
    framing.pad,
    entry?.focal,
    entry?.focalTargetOverride || framing.focalTarget
  );
  const out = join(OUT_DIR, `${plate}-${window.name}.png`);
  writePng(out, scaleTo(cutOut(image, rect), MAX_WIDTH));
  const pct = (n) => `${(n * 100).toFixed(1)}%`;
  console.log(
    `  ${window.name.padEnd(6)} ${window.aspect.toFixed(2)}  keeps x ${pct(rect.x)}–${pct(rect.x + rect.w)}, ` +
      `y ${pct(rect.y)}–${pct(rect.y + rect.h)}  ->  docs/art/aim/${plate}-${window.name}.png`
  );
  console.log(`         ${window.note}`);
}

console.log('\nLook at both. The subject box is a veto and the focal point is an aim:');
console.log('if something the card names is cut, grow `subject`; if the crop is centred on');
console.log('the wrong thing, move `focal`. Previews are git-ignored - regenerate, never commit.');
