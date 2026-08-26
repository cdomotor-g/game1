#!/usr/bin/env node
/**
 * Aiming a plate from the other end.
 *
 * The AIM step asks for a `subject` box, and the box is not a description of
 * the picture - it is a control input. What you actually know when you sit down
 * is where the ink is and what you are willing to lose; what you want is the
 * three numbers that produce that. Going forwards from box to crop is
 * docs/js/framing.js. Going backwards has been arithmetic done by hand, badly,
 * once per card - and it is where the wrong answers came from, because the
 * inversion is not pretty: the crop hugs the PADDED top of the box whenever the
 * box overflows the window, and `pad` is a fraction of the box's own shorter
 * side, so the thing you are solving for is inside its own answer.
 *
 * So this does not invert anything. It searches: `crop()` costs nothing to call,
 * so try boxes until one lands the loss where you said to put it. That also
 * means this tool cannot drift away from the crop the cards use, because it has
 * no opinion of its own about how cropping works.
 *
 *   node tools/aim-solve.mjs MON-13 --keep 0.10,0.015,0.92,0.801 \
 *        --focal 0.419,0.238 --spend top
 *
 * `--keep` is the ink you measured, as EDGES - x0,y0,x1,y1 - because that is how
 * a measurement reads off a plate, and turning it into x,y,w,h by hand is one
 * more subtraction to get wrong.
 *
 * `--spend` is the honest half of the job. When a window's height budget is
 * smaller than the subject - which on the monsters deck it very often is - the
 * question stops being "where does the box go" and becomes "what am I giving
 * up", and only a person looking at the picture can answer it. This tool will
 * put the loss exactly where you say and tell you what it cost; it will not
 * choose for you, and the `note` it leaves behind says TODO until you do.
 *
 * Nothing is written without --write.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { crop, readFraming } from './lib/framing.mjs';
import { pngSize } from './lib/png.mjs';
import { resolvePlate } from './lib/mint.mjs';
import { boxOf } from './lib/tiles.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs/art/renders');
const CARDS = join(ROOT, 'docs/cards');
const FRAMING = join(ROOT, 'docs/art/framing.json');

const THUMB_ASPECT = 5 / 4;
const EDGES = ['top', 'bottom', 'left', 'right'];

/* --------------------------------------------------------------- arguments */

const argv = process.argv.slice(2);
const value = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const target = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1]?.startsWith('--') !== true);

const nums = (s, n, what) => {
  const parts = String(s || '').split(',').map(Number);
  if (parts.length !== n || parts.some((v) => !Number.isFinite(v))) {
    console.error(`aim-solve: --${what} wants ${n} comma-separated numbers, got "${s}"`);
    process.exit(1);
  }
  return parts;
};

if (!target) {
  console.error('usage: node tools/aim-solve.mjs <code|plate> --keep x0,y0,x1,y1 [--focal x,y] [--spend top|bottom|even|left|right] [--write]');
  process.exit(1);
}

const keepRaw = nums(value('keep'), 4, 'keep');
const keep = { x0: keepRaw[0], y0: keepRaw[1], x1: keepRaw[2], y1: keepRaw[3] };
if (keep.x1 <= keep.x0 || keep.y1 <= keep.y0) {
  console.error('aim-solve: --keep is x0,y0,x1,y1 - edges, not x,y,w,h. The second pair must be larger than the first.');
  process.exit(1);
}
const focal = value('focal') ? nums(value('focal'), 2, 'focal') : null;
const spend = value('spend') || 'even';
if (!['top', 'bottom', 'left', 'right', 'even'].includes(spend)) {
  console.error(`aim-solve: --spend must be one of top, bottom, left, right, even - got "${spend}"`);
  process.exit(1);
}

/* ----------------------------------------------------------- what it faces */

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const components = readJson(join(ROOT, 'data/components.json'));

const { plate, code, kind, tile } = resolvePlate(ROOT, target);
const file = join(RENDERS, `${plate}.png`);
if (!existsSync(file)) {
  console.error(`aim-solve: no plate at docs/art/renders/${plate}.png`);
  process.exit(1);
}
const image = pngSize(file);
const framing = readFraming(ROOT);

function cardWindow(cardCode) {
  if (!cardCode) return null;
  const svg = join(CARDS, `${cardCode}.svg`);
  if (!existsSync(svg)) return null;
  const m = readFileSync(svg, 'utf8')
    .match(/id="portrait-window"><rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/);
  return m ? Number(m[1]) / Number(m[2]) : null;
}

const windows = [];
if (kind === 'tile') {
  /* A tile is cut to its own footprint and is not in the explorer, so its cut is
     the only window there is. Solving against the thumbnail instead would be
     solving the wrong problem confidently. */
  const box = boxOf(tile.cells, 1);
  windows.push({ name: `tile (${tile.shape})`, aspect: box.w / box.h });
} else {
  const cardAspect = cardWindow(code);
  if (cardAspect) windows.push({ name: 'card', aspect: cardAspect });
  windows.push({ name: 'thumb', aspect: THUMB_ASPECT });
}

/* ------------------------------------------------------------ the search */

/** What a window cannot hold at all, whatever box it is given. */
const budgetOf = (aspect) => ({
  w: Math.min(1, (image.height * aspect) / image.width),
  h: Math.min(1, image.width / aspect / image.height),
});

/** What a crop leaves outside the ink, edge by edge. Never negative. */
function losses(rect) {
  return {
    top: Math.max(0, rect.y - keep.y0),
    bottom: Math.max(0, keep.y1 - (rect.y + rect.h)),
    left: Math.max(0, rect.x - keep.x0),
    right: Math.max(0, keep.x1 - (rect.x + rect.w)),
  };
}

/**
 * How bad a box is, in three terms that rank in that order.
 *
 * FIRST, lose as little as possible. Every window has a floor - the ink is
 * taller than the budget by however much it is taller - and a box can only ever
 * do worse than that floor, by being too small to use the whole window. That
 * excess is the expensive term, and it is the one a first draft of this tool did
 * not have: told to spend the top, it obligingly spent 22% off the top of a card
 * that only had to give up 14.4%, and was right by its own lights.
 *
 * `--spend` is not an instruction to spend. It is an instruction about WHERE the
 * unavoidable loss goes, and it can only speak once the amount is settled.
 *
 * SECOND, put that loss where it was asked for. A protected edge costs four
 * times a nominated one - enough to decide the question, not enough to buy a
 * bigger loss with. `even` nominates both ends of the vertical and is penalised
 * for lopsidedness instead.
 *
 * THIRD, honesty. Among boxes that crop near enough identically, prefer the one
 * that describes the ink - so when everything fits, the answer is simply the
 * ink. This is weighted to be decisive over a cosmetic difference and to fold
 * immediately in front of a real one: without it the solver will happily return
 * a box half the width of the animal, because a narrower box has a smaller
 * `pad` and a smaller pad occasionally buys a fraction of a percent somewhere.
 * That box crops correctly and describes nothing, and framing.json is read by
 * people.
 */
const HONESTY = 0.5;

function cost(box) {
  let total = 0;
  for (const win of windows) {
    const b = budgetOf(win.aspect);
    const rect = crop(image, box, win.aspect, framing.pad, focal, framing.focalTarget);
    const lost = losses(rect);

    const floorV = Math.max(0, keep.y1 - keep.y0 - b.h);
    const floorH = Math.max(0, keep.x1 - keep.x0 - b.w);
    total += 20 * (Math.max(0, lost.top + lost.bottom - floorV) + Math.max(0, lost.left + lost.right - floorH));

    for (const edge of EDGES) {
      const nominated = spend === edge || (spend === 'even' && (edge === 'top' || edge === 'bottom'));
      total += lost[edge] * (nominated ? 1 : 4);
    }
    if (spend === 'even') total += Math.abs(lost.top - lost.bottom) * 8;
  }
  return total + HONESTY * (
    Math.abs(box[0] - keep.x0) + Math.abs(box[1] - keep.y0) +
    Math.abs(box[0] + box[2] - keep.x1) + Math.abs(box[1] + box[3] - keep.y1)
  );
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Scan one axis's two edges over a window of offsets, at `step`. */
function scan(box, axis, lo, hi, step) {
  const [iLo, iSize] = axis === 'y' ? [1, 3] : [0, 2];
  let best = { box: [...box], cost: cost(box) };
  for (let a = lo.a; a <= hi.a + 1e-9; a += step) {
    for (let b = lo.b; b <= hi.b + 1e-9; b += step) {
      const start = clamp01(a);
      const end = clamp01(b);
      if (end - start < 0.05) continue;
      const trial = [...box];
      trial[iLo] = start;
      trial[iSize] = end - start;
      const c = cost(trial);
      if (c < best.cost) best = { box: trial, cost: c };
    }
  }
  return best.box;
}

/** Coarse then fine, on one axis, around the edges of the ink. */
function solveAxis(box, axis, lo0, hi0) {
  const REACH = 0.14;
  let out = scan(box, axis,
    { a: lo0 - REACH, b: hi0 - REACH },
    { a: lo0 + REACH, b: hi0 + REACH }, 0.004);
  const [iLo, iSize] = axis === 'y' ? [1, 3] : [0, 2];
  const a = out[iLo];
  const b = out[iLo] + out[iSize];
  return scan(out, axis, { a: a - 0.005, b: b - 0.005 }, { a: a + 0.005, b: b + 0.005 }, 0.0005);
}

let box = [keep.x0, keep.y0, keep.x1 - keep.x0, keep.y1 - keep.y0];
box = solveAxis(box, 'y', keep.y0, keep.y1);
box = solveAxis(box, 'x', keep.x0, keep.x1);
/* Once more down the tall axis: `pad` is a fraction of the box's SHORTER side,
   so moving one axis can change the breathing room on the other. */
box = solveAxis(box, 'y', box[1], box[1] + box[3]);

const round = (n) => Number(n.toFixed(4));
const subject = box.map(round);

/* ---------------------------------------------------------------- report */

const pct = (n) => `${(n * 100).toFixed(1)}%`;

console.log(`${code ? `${code}  ` : ''}${plate} — ${image.width} x ${image.height}`);
console.log(`  keep    x ${pct(keep.x0)}–${pct(keep.x1)}, y ${pct(keep.y0)}–${pct(keep.y1)}` +
  `  (${pct(keep.x1 - keep.x0)} of the width, ${pct(keep.y1 - keep.y0)} of the height)`);

let anyShort = false;
for (const win of windows) {
  const b = budgetOf(win.aspect);
  const shortH = keep.y1 - keep.y0 - b.h;
  const shortW = keep.x1 - keep.x0 - b.w;
  const over = [];
  if (shortH > 0.0005) over.push(`${pct(shortH)} of the height`);
  if (shortW > 0.0005) over.push(`${pct(shortW)} of the width`);
  if (over.length) anyShort = true;
  console.log(`  ${win.name.padEnd(6)} ${win.aspect.toFixed(2)}  budget ${pct(b.w)} x ${pct(b.h)}` +
    (over.length ? `  ->  ${over.join(' and ')} cannot be kept by any box` : '  ->  the ink fits'));
}
console.log(anyShort
  ? `\n  spending it ${spend === 'even' ? 'evenly down the axis' : `off the ${spend}`}, as asked:`
  : '\n  nothing has to be spent:');

/* Formatted the way framing.json is formatted, one line per box, so it can be
   pasted straight in without reflowing anything around it. */
const NOTE = 'TODO - say what the box is around, and what you chose to spend';
const entryText = `    ${JSON.stringify(plate)}: {\n` +
  `      "subject": [${subject.join(', ')}],\n` +
  (focal ? `      "focal": [${focal.map(round).join(', ')}],\n` : '') +
  `      "note": ${JSON.stringify(NOTE)}\n` +
  `    }`;
console.log(`\n${entryText}`);

console.log('');
for (const win of windows) {
  const rect = crop(image, subject, win.aspect, framing.pad, focal, framing.focalTarget);
  const lost = losses(rect);
  const said = EDGES.filter((e) => lost[e] > 0.0005).map((e) => `${pct(lost[e])} off the ${e}`);
  console.log(`  ${win.name.padEnd(6)} keeps x ${pct(rect.x)}–${pct(rect.x + rect.w)}, y ${pct(rect.y)}–${pct(rect.y + rect.h)}` +
    (said.length ? `  — loses ${said.join(', ')} of the ink` : '  — the whole of the ink'));
}

/* ----------------------------------------------------------------- write */

if (!argv.includes('--write')) {
  console.log('\nNothing written. Add --write to put this into docs/art/framing.json,');
  console.log('then look at it: node tools/aim-preview.mjs ' + (code || plate));
  process.exit(0);
}

/**
 * Spliced into the file as text, not round-tripped through JSON.parse.
 *
 * framing.json is hand-formatted - one line per box, prose notes, a preamble
 * explaining itself to the next person - and re-serialising it would flatten all
 * of that to make one entry. It is also formatted two ways: the older entries
 * run over four lines, the generated-plate ones sit on one. So the span of an
 * entry is found by walking braces rather than by matching a shape, because a
 * regex written for one of those two formats quietly does the wrong thing to the
 * other - inserting a second copy of a key it failed to find, which JSON.parse
 * accepts without complaint and reads last-wins.
 */
const raw = readFileSync(FRAMING, 'utf8');

/** The character span of one entry, comma and newline included. Null if absent. */
function spanOf(text, key) {
  const at = text.indexOf(`\n    ${JSON.stringify(key)}:`);
  if (at === -1) return null;
  const start = at + 1;
  let i = text.indexOf('{', start);
  let depth = 0;
  let inString = false;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) { i++; break; }
  }
  if (text[i] === ',') i++;
  if (text[i] === '\n') i++;
  return { start, end: i };
}

const block = `${entryText},\n`;
const mine = spanOf(raw, plate);
let next;

if (mine) {
  next = raw.slice(0, mine.start) + block + raw.slice(mine.end);
} else {
  const after = Object.keys(framing.plates).sort().find((k) => k > plate);
  const anchor = after ? spanOf(raw, after) : null;
  if (anchor) {
    next = raw.slice(0, anchor.start) + block + raw.slice(anchor.start);
  } else {
    /* Nothing sorts after it, so it goes last - and the entry that used to be
       last has to grow the comma it never needed. */
    const keys = Object.keys(framing.plates);
    const last = spanOf(raw, keys[keys.length - 1]);
    if (!last) {
      console.error('\naim-solve: cannot find where to put this in framing.json. Paste the entry above in by hand.');
      process.exit(1);
    }
    const tail = raw.slice(last.start, last.end).replace(/\n$/, '');
    next = raw.slice(0, last.start) + `${tail},\n${entryText}\n` + raw.slice(last.end);
  }
}

/**
 * Two checks, because a splice that misses is worse than one that fails: it
 * writes a file that parses, reports success, and has changed nothing - or has
 * quietly grown a second copy of a key.
 */
let parsed;
try {
  parsed = JSON.parse(next);
} catch (err) {
  console.error(`\naim-solve: refusing to write - the result would not parse (${err.message}).`);
  console.error('Paste the entry above in by hand instead.');
  process.exit(1);
}
const landed = parsed.plates?.[plate];
const duplicated = next.split(`\n    ${JSON.stringify(plate)}:`).length - 1;
if (!landed || JSON.stringify(landed.subject) !== JSON.stringify(subject) || duplicated !== 1) {
  console.error(`\naim-solve: refusing to write - the splice did not land cleanly ` +
    `(${duplicated} copies of the key, subject ${JSON.stringify(landed?.subject)}).`);
  console.error('Paste the entry above in by hand instead.');
  process.exit(1);
}

writeFileSync(FRAMING, next);
console.log(`\nWrote ${plate} into docs/art/framing.json. The note says TODO on purpose.`);
console.log(`Next: node tools/aim-preview.mjs ${code || plate}`);
