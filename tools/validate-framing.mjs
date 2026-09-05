#!/usr/bin/env node
/**
 * Checking the crops, the way validate-data checks the numbers.
 *
 * Every other check in this repository proves something about data/*.json. The
 * crop is not in there: it is `subject` and `focal` in docs/art/framing.json,
 * put through docs/js/framing.js, against a window whose shape the card builder
 * derives from the wordiest card in the deck. Three moving parts, none of them
 * checked, and the middle one is a pure function - so this is a gap that was
 * only ever a gap because nobody had written the sweep.
 *
 * What it exists to catch is the failure that has actually happened. A card
 * lands whose rules run long, build-cards narrows the window for its WHOLE
 * deck to fit them, and every plate already aimed in that deck is re-cropped by
 * the next build. No file says anything. The cards are quietly worse and the
 * only symptom is a diff full of siblings nobody edited.
 *
 * So: for every plate that has a framing entry, run the same `crop()` the card
 * builder runs, and report what the window keeps against what the entry said
 * may not be cut.
 *
 * A trim is a WARNING, never an error, and that is deliberate. Some of them are
 * the right answer - MON-13 spends the tips of the tallest horns on purpose,
 * because the alternative was a wagon wheel cropped to a sliver, and the note
 * on the entry says so. The tool cannot read prose and should not pretend to.
 * What it can do is make sure nobody trims anything WITHOUT deciding to.
 *
 * Usage: node tools/validate-framing.mjs [--quiet]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { crop, readFraming } from './lib/framing.mjs';
import { pngSize, pngProblem } from './lib/png.mjs';
import { plateIdFor } from './lib/plates.mjs';
import { cardsOfDeck, readMintFile, printDpi } from './lib/mint.mjs';
import { tileSubjects, plateIdOf, boxOf } from './lib/tiles.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs/art/renders');
const CARDS = join(ROOT, 'docs/cards');
const quiet = process.argv.includes('--quiet');

/* The explorer's thumbnail shape, the same constant aim-preview keeps and for
   the same reason: when the explorer changes shape this is the line to change. */
const THUMB_ASPECT = 5 / 4;

const errors = [];
const warnings = [];

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const pct = (n) => `${(n * 100).toFixed(1)}%`;

/* ------------------------------------------------------- cards and windows */

const components = readJson(join(ROOT, 'data/components.json'));

/**
 * The print rule a card plate is held to - data/mint.json lines.cards
 * plate.minLongSide: a print scale (the rulebook's half-page section, twice
 * the card), a floor in dpi at that scale, and an aspiration. The floor the
 * shipping gate refuses on is derived from the safe area and is only ever a
 * floor; THIS is where the real figure is measured, through the deck's built
 * window, plate by plate.
 */
const PRINT = readMintFile(ROOT).lines.find((l) => l.id === 'cards')?.plate?.minLongSide ?? {};
const PRINT_SCALE = PRINT.printScale ?? 1;
const UNITS_PER_MM = components.stock?.unitsPerMm ?? 8;

/**
 * The picture window on a built card, as a bare aspect.
 *
 * Read out of the SVG rather than recomputed, exactly as aim-preview reads it:
 * that number is the end of a chain the card builder owns, and a checker that
 * derived its own copy could pass while the cards were wrong.
 */
function cardWindow(cardCode) {
  const file = join(CARDS, `${cardCode}.svg`);
  if (!existsSync(file)) return null;
  const m = readFileSync(file, 'utf8')
    .match(/id="portrait-window"><rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/);
  return m ? { aspect: Number(m[1]) / Number(m[2]), w: Number(m[1]), h: Number(m[2]) } : null;
}

/** plate id -> { deck, card, window }, for every card any deck claims. */
const byPlate = new Map();
for (const deck of components.decks) {
  if (!deck.source || !existsSync(join(ROOT, 'data', deck.source))) continue;
  let cards;
  try { cards = cardsOfDeck(ROOT, deck); } catch { continue; }
  for (const card of cards) {
    let plate;
    try { plate = plateIdFor(deck, card); } catch { continue; }
    byPlate.set(plate, { deck, card, window: cardWindow(card.cardCode) });
  }
}

/**
 * The tile windows. A building tile shows its plate through its own footprint,
 * and a footprint is not a card and is not a thumbnail: a single hex is 0.87 and
 * a pair is 1.73, which are further apart than any two decks in the game.
 *
 * Measured off the shape rather than off the built tile, because unlike a card
 * window nothing narrows it - a tile's window IS its cut, and the cut is the
 * shape. There is no wordiest-card-in-the-deck to be at the mercy of.
 */
const tileWindows = new Map();
for (const row of tileSubjects(ROOT)) {
  const box = boxOf(row.cells, 1);
  tileWindows.set(plateIdOf(row), { aspect: box.w / box.h, where: row.id, shape: row.shape });
}

/* -------------------------------------------------------------- the sweep */

const framing = readFraming(ROOT);
const plates = readdirSync(RENDERS).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''));
const platesOnDisk = new Set(plates);

/** An entry pointing at a plate nobody delivered is a rename that went half-done. */
for (const id of Object.keys(framing.plates)) {
  if (!platesOnDisk.has(id)) {
    errors.push(`framing.json has an entry for "${id}", but there is no docs/art/renders/${id}.png`);
  }
}

/**
 * Is the box a box? `subject` is four fractions of the plate and every one of
 * them has a meaning that breaks quietly rather than loudly when it is wrong -
 * a negative width crops to nothing, a y past 1 crops off the page and the
 * page-clamp slides it silently back to somewhere plausible.
 */
function checkBox(id, box) {
  if (!Array.isArray(box) || box.length !== 4 || box.some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
    errors.push(`${id}: subject must be four numbers [x, y, w, h]`);
    return false;
  }
  const [x, y, w, h] = box;
  if (w <= 0 || h <= 0) {
    errors.push(`${id}: subject has no area - w ${w}, h ${h}`);
    return false;
  }
  if (x < 0 || y < 0 || x + w > 1 || y + h > 1) {
    errors.push(`${id}: subject runs off the plate - x ${x}–${(x + w).toFixed(3)}, y ${y}–${(y + h).toFixed(3)}`);
    return false;
  }
  return true;
}

/** What the window can hold, before any box is consulted: page ÷ aspect. */
function budget(plate, aspect) {
  return {
    w: Math.min(1, (plate.height * aspect) / plate.width),
    h: Math.min(1, plate.width / aspect / plate.height),
  };
}

/** How far the crop falls short of the subject box, edge by edge. */
function trims(rect, box) {
  const out = [];
  const push = (amount, edge) => { if (amount > 0.0005) out.push({ amount, edge }); };
  push(rect.x - box[0], 'left');
  push(rect.y - box[1], 'top');
  push(box[0] + box[2] - (rect.x + rect.w), 'right');
  push(box[1] + box[3] - (rect.y + rect.h), 'bottom');
  return out;
}

/**
 * One sentence for what a window did to a box, rather than one line per edge.
 *
 * The two cases are worth telling apart, because the fix is different. Losing
 * the same amount from BOTH sides of an axis is `crop()`'s shrink step: the box
 * is a shape this window cannot hold at any position, so it was squeezed about
 * its centre - and no amount of moving `focal` will help, only a smaller box or
 * a differently composed plate. Losing it from ONE side is the crop sliding up
 * against a page edge, which usually can be aimed out of.
 */
function describe(lost) {
  const pair = (a, b) => lost.find((t) => t.edge === a) && lost.find((t) => t.edge === b)
    && Math.abs(lost.find((t) => t.edge === a).amount - lost.find((t) => t.edge === b).amount) < 0.002;
  if (pair('left', 'right') || pair('top', 'bottom')) {
    const axis = pair('left', 'right') ? 'left and right' : 'top and bottom';
    return `cannot hold this box at all - it is squeezed about its centre, losing ${pct(lost[0].amount)} of the page off ${axis}`;
  }
  return `trims ${lost.map((t) => `${pct(t.amount)} off the ${t.edge}`).join(' and ')} of the subject box`;
}

const decksSeen = new Map();
const focalless = [];
const rows = [];

for (const id of plates) {
  const entry = framing.plates[id];
  const claim = byPlate.get(id);

  if (!entry) {
    warnings.push(`${id}: no framing entry - the crop falls on the middle of the page, which is what the entry exists to stop`);
    continue;
  }
  if (!checkBox(id, entry.subject)) continue;

  if (!entry.focal) {
    focalless.push(id);
  } else {
    const [fx, fy] = entry.focal;
    const [x, y, w, h] = entry.subject;
    if (fx < x || fx > x + w || fy < y || fy > y + h) {
      errors.push(`${id}: focal [${fx}, ${fy}] is outside its own subject box - the crop would aim at something the box does not protect`);
    }
  }

  const bad = pngProblem(join(RENDERS, `${id}.png`));
  if (bad) { errors.push(`${id}: the plate ${bad}`); continue; }
  const plate = pngSize(join(RENDERS, `${id}.png`));
  /*
   * EVERY WINDOW THAT ACTUALLY SHOWS THIS PLATE, which since the BUILDINGS deck
   * arrived can be more than one kind at once.
   *
   * A tile plate used to be seen through its own footprint and nowhere else, so
   * the three cases were exclusive and an `else if` was the whole truth. It is
   * not any more: the BUILDINGS deck borrows `tile-{id}` and shows the same
   * drawn page through a card window (components.json decks BLD, plateKind
   * borrowed). Left as an else-if, the card window - the WIDER of the two, and
   * the entire reason that deck exists - would have been the one window nobody
   * ever checked.
   *
   * So the tile and the card are asked independently. The THUMBNAIL is not, and
   * still keys off the tile: the explorer draws a building as a link row rather
   * than as a deck card (docs/js/views.js), so a tile plate is not thumbnailed
   * anywhere no matter which decks claim it, and adding one here would report a
   * trim nobody will ever see. That is the original reasoning, unchanged - it was
   * only ever the CARD window that this was wrong about.
   */
  const windows = [];
  const tile = tileWindows.get(id);
  if (tile) windows.push({ name: `tile (${tile.shape})`, aspect: tile.aspect, where: tile.where });
  if (claim?.window) {
    windows.push({ name: 'card', aspect: claim.window.aspect, where: claim.card.cardCode });
    if (!decksSeen.has(claim.deck.prefix)) {
      decksSeen.set(claim.deck.prefix, { ...claim.window, budget: budget(plate, claim.window.aspect), worst: null });
    }
    /* How densely this plate prints through this window at the print scale.
       Whichever axis binds, over the window in millimetres - the same crop the
       card takes. Under the floor is a warning and not an error, for the same
       reason a trim is: the plate is already accepted and the queue notes it;
       what must never happen is a plate landing under the floor unnoticed,
       and the shipping gate is where that is refused. */
    const mm = { w: claim.window.w / UNITS_PER_MM, h: claim.window.h / UNITS_PER_MM };
    const dpi = printDpi(plate, mm, PRINT_SCALE);
    const deck = decksSeen.get(claim.deck.prefix);
    if (!deck.worst || dpi < deck.worst.dpi) deck.worst = { dpi, code: claim.card.cardCode };
    if (PRINT.dpi && dpi < PRINT.dpi) {
      warnings.push(`${claim.card.cardCode} ${id}: prints at ${dpi} dpi at ${PRINT_SCALE} x card size through its ` +
        `${mm.w.toFixed(1)} x ${mm.h.toFixed(1)} mm window - under the ${PRINT.dpi} dpi floor in data/mint.json`);
    }
  }
  if (!tile) windows.push({ name: 'thumb', aspect: THUMB_ASPECT, where: 'explorer' });

  for (const win of windows) {
    const rect = crop(plate, entry.subject, win.aspect, framing.pad, entry.focal,
      entry.focalTargetOverride || framing.focalTarget);
    const lost = trims(rect, entry.subject);
    rows.push({ id, code: claim?.card?.cardCode, win, lost });
    if (lost.length) {
      const who = claim?.card?.cardCode ? `${claim.card.cardCode} ${id}` : id;
      warnings.push(`${who}: the ${win.name} window (${win.aspect.toFixed(2)}) ${describe(lost)}`);
    }
  }
}

/* --------------------------------------------------------------- report */

/* Collapsed to one line. Every plate delivered before docs/art/09 asked for a
   focal point is on this list, so printing it forty times says nothing forty
   times over - but dropping it would lose the only record of which entries are
   still aiming at a sternum. */
if (focalless.length) {
  warnings.push(
    `${focalless.length} entries have no focal point, so their crop centres on the subject box ` +
    `- and the centre of a standing figure's box is their sternum: ${focalless.join(', ')}`
  );
}

if (!quiet) {
  for (const w of warnings) console.log(`  warn  ${w}`);
}
for (const e of errors) console.error(`  ERROR ${e}`);

/**
 * The deck windows, printed every run whether or not anything is wrong.
 *
 * This is the line that would have said what happened when Vhalrik landed and
 * took the monsters deck from a 0.96 window to a 1.10 one. A number that only
 * appears when it is already too late is not a warning, it is an autopsy.
 */
if (!quiet && decksSeen.size) {
  console.log(`\n  deck windows, the most of a plate each can hold, and how densely the thinnest plate prints ` +
    `at ${PRINT_SCALE} x card size (floor ${PRINT.dpi ?? '-'} dpi, want ${PRINT.wantDpi ?? '-'}):`);
  for (const [prefix, win] of [...decksSeen].sort()) {
    const mm = `${(win.w / UNITS_PER_MM).toFixed(1)} x ${(win.h / UNITS_PER_MM).toFixed(1)} mm`;
    console.log(
      `    ${prefix}  ${mm}, aspect ${win.aspect.toFixed(2)}  ->  ` +
      `${pct(win.budget.w)} of a plate's width, ${pct(win.budget.h)} of its height` +
      (win.worst ? `  ·  ${win.worst.dpi} dpi (${win.worst.code})` : '')
    );
  }
}

const framed = new Set(rows.map((r) => r.id)).size;
const clean = rows.filter((r) => !r.lost.length).length;
console.log(`\n${framed} framed plate(s), ${rows.length} window(s) checked, ${clean} of them keeping the whole subject box`);
console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
