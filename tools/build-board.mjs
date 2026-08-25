#!/usr/bin/env node
/**
 * Draws the player board — one A4 landscape sheet — from data/playerboard.json
 * and data/components.json.
 *
 * The same bargain as tools/build-cards.mjs: the data says what the board is
 * for, components.json says what shape it is drawn into, and nothing here
 * invents a number that belongs to either. What this file owns is the
 * arrangement — the card in play top left, the round under it, the tracks up the
 * middle, four cards of kit on the right — and even that is arithmetic rather
 * than a set of coordinates:
 *
 *   contentW - (the card slot) - (two kit slots) - three gutters = the tracks
 *   contentH - (the heads)                                       = the rungs
 *
 * Give the board a sixth track and the columns get narrower; give it a bigger
 * card and they get narrower still. Nothing moves off the paper, because nothing
 * was ever placed by hand. There were six columns here until a vehicle stopped
 * being a card on somebody else's board and started being dealt a board of its
 * own — its damage is its health, the V went, and the five that were left simply
 * got wider without a coordinate being touched.
 *
 * ONE BOARD, not one per people, and not one per kind of thing. Everything that
 * differs between an orc and a halfling — strength, health, what they can
 * shoulder — is printed on the card lying in the recess, so the board underneath
 * has no business knowing which of them is sitting there; and a wagon has a hull
 * that takes damage, a load, a pace and a hold, which is this board exactly.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash carries a
 * tint down each track, #ink carries every rule, number and letter in soot
 * alone, #grime carries the wear. Drop #wash and #slip and you have the
 * black-and-white edition — the tracks survive as numbered ladders, because the
 * numbering was never the colour's job.
 *
 * The ladders are numbered and nothing else: no rung glyph, no plus, no minus.
 * A column is a shade over thirteen millimetres wide and a mark saying "this is
 * a harm track" was competing with the number for the same three of them.
 *
 * Usage: node tools/build-board.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'boards');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('playerboard.json');

/* Datasets a track may point a dotted path at, rather than restating a number
   that already exists somewhere. `stepFrom` is the one in use: the burden track
   steps in whatever rules.json says a burden bar steps in. */
const datasets = {
  rules: read('rules.json'),
  characters: read('characters.json'),
  vehicles: read('vehicles.json'),
  items: read('items.json'),
  monsters: read('monsters.json'),
};

/* Every colour below is declared in palette.json — validate-art.mjs checks. */
const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const FOXING = palette.paper.foxing.hex;
const T85 = palette.ink.tints['85'].hex;
const T70 = palette.ink.tints['70'].hex;
const T55 = palette.ink.tints['55'].hex;
const T40 = palette.ink.tints['40'].hex;
const T25 = palette.ink.tints['25'].hex;
const T12 = palette.ink.tints['12'].hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

/** The data names an ink; this is the only place a name becomes a hex. */
function inkHex(name) {
  const ink = palette.inks[name];
  if (!ink) throw new Error(`data names an ink the palette does not declare: ${name}`);
  return ink.hex;
}

/** "rules.carrying.barStepKg" -> the number, so the board never restates it. */
function dotted(path) {
  const [key, ...rest] = path.split('.');
  let node = datasets[key];
  for (const part of rest) node = node?.[part];
  if (node === undefined) throw new Error(`playerboard.json points at "${path}", which does not resolve`);
  return node;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/** Greedy wrap by estimated glyph width — close enough for a serif at this size. */
function wrap(text, maxChars) {
  const out = [];
  let line = '';
  for (const w of String(text).split(/\s+/)) {
    if (line && (line + ' ' + w).length > maxChars) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

/* ------------------------------------------------------------- the geometry */

const B = components.board;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(B.sheet.bleedMm);
const W = mm(B.sheet.widthMm + 2 * B.sheet.bleedMm);
const H = mm(B.sheet.heightMm + 2 * B.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(B.sheet.widthMm), h: mm(B.sheet.heightMm) };
const CORNER = mm(B.sheet.cornerRadiusMm);
const GUT = mm(B.gutterMm);

/** The working area. One margin all round — there is no border to clear. */
const CONTENT = {
  x: TRIM.x + mm(B.marginMm),
  y: TRIM.y + mm(B.marginMm),
  w: TRIM.w - 2 * mm(B.marginMm),
  h: TRIM.h - 2 * mm(B.marginMm),
};

/* A recess is the card's trim plus a clearance either side — a card has to drop
   in, not be posted in. */
const CARD = components.stock.card;
const SLOT = {
  w: mm(CARD.widthMm + 2 * B.slot.clearanceMm),
  h: mm(CARD.heightMm + 2 * B.slot.clearanceMm),
  r: mm(B.slot.cornerRadiusMm),
};

const KIT_COLS = 2;
const KIT_ROWS = 2;
const KIT_W = KIT_COLS * SLOT.w + (KIT_COLS - 1) * GUT;

/* Everything the cards do not want is the tracks'. */
const TRACKS = spec.tracks;
const TRACK_BLOCK = {
  x: CONTENT.x + SLOT.w + GUT,
  y: CONTENT.y,
  w: CONTENT.w - SLOT.w - KIT_W - 2 * GUT,
  h: CONTENT.h,
};
const CELL_W = TRACK_BLOCK.w / TRACKS.length;
const HEAD = mm(B.track.headMm);
const RUNGS = B.track.to - B.track.from + 1;
const CELL_H = (TRACK_BLOCK.h - HEAD) / RUNGS;

const KIT_X = CONTENT.x + CONTENT.w - KIT_W;
/* Two card recesses come up short of the sheet by more than a gutter, so the kit
   rows are spread rather than stacked: the top row lines up with the card in
   play and the bottom row with the foot of the round panel. Three columns of
   things, one top line and one bottom line - which is what stops the right-hand
   half reading as a block that has slipped. */
const KIT_ROW_GAP = (CONTENT.h - 2 * SLOT.h) / (KIT_ROWS - 1);
const PANEL = { x: CONTENT.x, y: CONTENT.y + SLOT.h + GUT, w: SLOT.w, h: CONTENT.h - SLOT.h - GUT };

/* ---------------------------------------------------------------- utilities */

/** A rectangle inset from the trim, its corner following the sheet's as it goes in. */
function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

/** Deterministic noise. The grain has to be the same grain every run, or
    --check would fail on a board nobody had touched. */
function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* ------------------------------------------------------------- board pieces */

/** Sawn boards running the length of the sheet: seams, grain, and a few knots. */
function timber(seed) {
  const rand = rng(`timber-${seed}`);
  const t = B.timber;
  const step = mm(t.boardWidthMm);
  const out = [];
  for (let y = TRIM.y + step; y < TRIM.y + TRIM.h - 4; y += step) {
    out.push(`<path d="M ${num(TRIM.x)},${num(y)} H ${num(TRIM.x + TRIM.w)}" stroke="${T25}" stroke-width="${t.seamStrokeWidth}"/>`);
    /* three or four grain lines per board, each bowed a little, because a sawn
       board is not a ruled line and a ruled line is not a board */
    for (let i = 0; i < 4; i++) {
      const gy = y - step + step * ((i + 0.6 + rand() * 0.5) / 4.6);
      const bow = (rand() - 0.5) * mm(2.2);
      out.push(
        `<path d="M ${num(TRIM.x)},${num(gy)} Q ${num(TRIM.x + TRIM.w / 2)},${num(gy + bow)} ${num(TRIM.x + TRIM.w)},${num(gy)}" ` +
        `stroke="${T12}" stroke-width="${t.grainStrokeWidth}"/>`
      );
    }
  }
  for (let k = 0; k < t.knots; k++) {
    const kx = TRIM.x + mm(20) + rand() * (TRIM.w - mm(40));
    const ky = TRIM.y + mm(14) + rand() * (TRIM.h - mm(28));
    for (let r = 1; r <= 2; r++) {
      out.push(`<ellipse cx="${num(kx)}" cy="${num(ky)}" rx="${num(r * mm(1.3))}" ry="${num(r * mm(0.7))}" stroke="${T25}" stroke-width="${t.grainStrokeWidth}"/>`);
    }
  }
  return `<g fill="none" opacity="${t.grainOpacity}">\n    ${out.join('\n    ')}\n  </g>`;
}

/**
 * A recess a card drops into: a groove, corner brackets, and the name of what
 * belongs in it set faintly in the middle — which a card covers up the moment
 * one is played, and which is exactly when it stops being needed.
 */
function slot(x, y, label) {
  const g = B.slot.grooveInset;
  const b = mm(B.slot.bracketMm);
  const brackets = [
    [x, y, 1, 1], [x + SLOT.w, y, -1, 1],
    [x, y + SLOT.h, 1, -1], [x + SLOT.w, y + SLOT.h, -1, -1],
  ].map(([bx, by, sx, sy]) =>
    `<path d="M ${num(bx + sx * mm(1))},${num(by + sy * b)} V ${num(by + sy * mm(1))} H ${num(bx + sx * b)}"/>`
  ).join('');

  return (
    `<g fill="none" stroke="${SOOT}">` +
    `<rect x="${num(x)}" y="${num(y)}" width="${num(SLOT.w)}" height="${num(SLOT.h)}" rx="${num(SLOT.r)}" stroke-width="${B.slot.strokeWidth}"/>` +
    `<rect x="${num(x + g)}" y="${num(y + g)}" width="${num(SLOT.w - 2 * g)}" height="${num(SLOT.h - 2 * g)}" rx="${num(Math.max(0, SLOT.r - g))}" stroke-width="0.9" stroke="${T40}"/>` +
    `<g stroke-width="2.2" stroke-linecap="round">${brackets}</g>` +
    `</g>` +
    `<text x="${num(x + SLOT.w / 2)}" y="${num(y + SLOT.h / 2 + 4)}" font-size="${num(mm(3.1))}" text-anchor="middle" ` +
    `letter-spacing="${num(mm(0.9))}" font-family="${SANS}" fill="${T40}">${esc(label)}</text>`
  );
}

/**
 * One numbered track: a head, and a ladder from the board's floor to its
 * ceiling, numbered from the bottom.
 *
 * Every fifth rung rules heavier and sets its number bold — the tally motif,
 * and the reason a player can read 12 without counting to 12. The bottom rung
 * is zero, so the token has somewhere to be when the answer is nothing.
 */
function track(t, index) {
  const step = t.step ?? dotted(t.stepFrom);
  const x = TRACK_BLOCK.x + index * CELL_W;
  const pad = mm(0.8);
  const col = { x: x + pad, w: CELL_W - 2 * pad };
  const top = TRACK_BLOCK.y + HEAD;
  const bottom = top + RUNGS * CELL_H;
  const cx = x + CELL_W / 2;

  const wash = `<rect x="${num(col.x)}" y="${num(top)}" width="${num(col.w)}" height="${num(bottom - top)}" fill="${inkHex(t.ink)}" opacity="0.26"/>`;

  const ink = [];
  ink.push(`<rect x="${num(col.x)}" y="${num(top)}" width="${num(col.w)}" height="${num(bottom - top)}" rx="${num(mm(1.2))}" fill="none" stroke="${SOOT}" stroke-width="2"/>`);

  /* Plain figures, and nothing else in the column. Every rung used to carry a
     little ink-plate glyph saying which KIND of number it was - a notch down for
     harm, a pip for a rating - and at eleven millimetres a column it fought the
     number for the same three millimetres and won often enough to matter. There
     is no glyph now, and no sign either: no plus, no minus. Which way a token
     walks is on the track's `walks` line in data/playerboard.json and in the
     rulebook, where a sentence has room to say it properly. */
  const numbers = [];
  for (let i = 0; i < RUNGS; i++) {
    const value = (B.track.from + i) * step;
    const yLine = bottom - (i + 1) * CELL_H;
    const major = value !== 0 && value % (B.track.ruleEvery * step) === 0;
    if (i < RUNGS - 1) {
      ink.push(`<path d="M ${num(col.x)},${num(yLine)} H ${num(col.x + col.w)}" stroke="${SOOT}" stroke-width="${major ? 1.8 : 0.9}" opacity="${major ? 1 : 0.75}"/>`);
    }
    const midY = bottom - (i + 0.5) * CELL_H;
    numbers.push(
      `<text x="${num(cx + mm(0.7))}" y="${num(midY + mm(1.1))}" font-size="${num(mm(3))}" text-anchor="middle" ` +
      `font-family="${SANS}"${major ? ' font-weight="bold"' : ''}>${value}</text>`
    );
  }
  ink.push(`<g fill="${SOOT}">${numbers.join('')}</g>`);

  /* The head, boxed like the header row of the sketch this board was drawn
     from. A column is a shade over 13 mm wide and STRENGTH is eight letters:
     set flat, the word is wider than the track it names and runs into its
     neighbour. So the letter takes the middle at full size, the word runs UP
     the side of it, and the unit — never more than a few characters — sits
     under the letter where a reader will look for it. Nothing here drops below
     the 6 pt floor in palette.json printSafety. */
  const headMid = TRACK_BLOCK.y + HEAD / 2;
  const lx = cx + mm(0.8);
  ink.push(
    `<rect x="${num(col.x)}" y="${num(TRACK_BLOCK.y)}" width="${num(col.w)}" height="${num(HEAD)}" rx="${num(mm(1.2))}" fill="none" stroke="${T55}" stroke-width="0.9"/>` +
    `<text x="${num(lx)}" y="${num(TRACK_BLOCK.y + mm(9.8))}" font-size="${num(mm(6.8))}" text-anchor="middle" font-weight="bold">${esc(t.letter)}</text>` +
    `<text transform="translate(${num(x + mm(1.9))} ${num(headMid)}) rotate(-90)" font-size="${num(mm(2.15))}" text-anchor="middle" ` +
    `letter-spacing="${num(mm(0.2))}" font-family="${SANS}" fill="${T70}">${esc(t.label)}</text>` +
    (t.unit
      ? `<text x="${num(lx)}" y="${num(TRACK_BLOCK.y + mm(13.6))}" font-size="${num(mm(2.1))}" text-anchor="middle" ` +
        `letter-spacing="${num(mm(0.2))}" font-family="${SANS}" fill="${T55}">${esc(t.unit)}</text>`
      : '')
  );

  /* the arcane gets the slip and nothing else does: the wash struck a shade off
     the line, past it on one side only */
  const slip = t.arcane
    ? `<rect x="${num(col.x + mm(0.9))}" y="${num(top - mm(0.9))}" width="${num(col.w)}" height="${num(bottom - top)}" fill="${inkHex(t.ink)}" opacity="0.3"/>`
    : '';

  return { wash, ink: ink.join('\n    '), slip };
}

/**
 * The turn reference the bill of materials has always asked a player board for,
 * and under it the one piece of arithmetic a player needs while a monster card
 * is face up in front of them.
 *
 * Both are printed out of rules.json rather than written here, so the board
 * cannot fall out of step with the rules the way a hand-lettered one would.
 */
function panel() {
  const rules = datasets.rules;
  const phases = rules.round.phases;
  /* Whichever rule the board says it is printing - the path is in the data, so
     moving the arithmetic inside rules.json does not silently print the old one. */
  const fight = dotted(spec.panel.aside.source);
  const pad = mm(4);
  const x = PANEL.x;
  const y = PANEL.y;
  const rowH = mm(8.6);
  const top = y + mm(11.4);

  const out = [];
  out.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(PANEL.w)}" height="${num(PANEL.h)}" rx="${num(mm(2.5))}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>`);
  out.push(`<text x="${num(x + pad)}" y="${num(y + mm(7))}" font-size="${num(mm(2.9))}" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T70}">${esc(spec.panel.title)}</text>`);
  out.push(`<path d="M ${num(x + pad)},${num(y + mm(9.8))} H ${num(x + PANEL.w - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);

  /* banded rows, bare paper against the palest permitted tint — what a printed
     table wants, and what survives a photocopier */
  phases.forEach((phase, i) => {
    const ry = top + i * rowH;
    if (i % 2 === 0) out.push(`<rect x="${num(x + mm(2))}" y="${num(ry)}" width="${num(PANEL.w - mm(4))}" height="${num(rowH)}" fill="${T12}" opacity="0.6"/>`);
    out.push(
      `<rect x="${num(x + pad)}" y="${num(ry + mm(1.7))}" width="${num(mm(5.4))}" height="${num(mm(5.4))}" rx="${num(mm(1))}" fill="none" stroke="${SOOT}" stroke-width="1.2"/>` +
      `<text x="${num(x + pad + mm(2.7))}" y="${num(ry + mm(5.6))}" font-size="${num(mm(3))}" text-anchor="middle" font-family="${SANS}">${i + 1}</text>` +
      `<text x="${num(x + pad + mm(7.8))}" y="${num(ry + mm(5.7))}" font-size="${num(mm(3.3))}">${esc(phase.name)}</text>`
    );
  });

  let cursor = top + phases.length * rowH + mm(5);
  out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.6))}" font-style="italic" fill="${T85}">${esc(spec.panel.foot)}</text>`);

  /* Strength against defence is the new arithmetic, and it is the one thing on
     this board a player will not already know. */
  cursor += mm(5.8);
  out.push(`<path d="M ${num(x + pad)},${num(cursor - mm(3.6))} H ${num(x + PANEL.w - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);
  out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.7))}" letter-spacing="${num(mm(0.7))}" font-family="${SANS}" fill="${T70}">${esc(spec.panel.aside.title)}</text>`);

  const lines = [
    ...wrap(fight.rule, 40),
    ...wrap(fight.worked, 40),
  ];
  lines.forEach((line, i) => {
    out.push(`<text x="${num(x + pad)}" y="${num(cursor + mm(4.2) + i * mm(3.15))}" font-size="${num(mm(2.5))}">${esc(line)}</text>`);
  });

  /* the board's own name, small, where a maker's mark would have gone */
  out.push(
    `<text x="${num(x + PANEL.w / 2)}" y="${num(y + PANEL.h - mm(3.4))}" font-size="${num(mm(2.3))}" text-anchor="middle" ` +
    `letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T40}">game1 · ${esc(spec.board.name.toUpperCase())}</text>`
  );
  return out.join('\n    ');
}

/** Where the die goes, marked in the bleed and never on the board. */
function dieMarks() {
  const g = 8;
  const R = CORNER + g;
  const b = { x: TRIM.x - g, y: TRIM.y - g, w: TRIM.w + 2 * g, h: TRIM.h + 2 * g };
  const arcs = [
    `M ${num(b.x)},${num(b.y + R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + R)},${num(b.y)}`,
    `M ${num(b.x + b.w - R)},${num(b.y)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w)},${num(b.y + R)}`,
    `M ${num(b.x + b.w)},${num(b.y + b.h - R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w - R)},${num(b.y + b.h)}`,
    `M ${num(b.x + R)},${num(b.y + b.h)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x)},${num(b.y + b.h - R)}`,
  ];
  return `<g fill="none" stroke="${SOOT}" stroke-width="1.2" opacity="0.32">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

/** Press wear: foxed corners, a ring where somebody put a cup down, specks. */
function grime(seed) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 9 }, () =>
    `<circle cx="${num(TRIM.x + rand() * TRIM.w)}" cy="${num(TRIM.y + rand() * TRIM.h)}" r="${num(1 + rand() * 1.6)}"/>`
  ).join('');
  const ringX = KIT_X + SLOT.w + GUT / 2;
  const ringY = CONTENT.y + CONTENT.h * 0.56;
  return (
    dieMarks() +
    `<path d="M ${num(TRIM.x)},${num(TRIM.y)} H ${num(TRIM.x + mm(26))} Q ${num(TRIM.x + mm(10))},${num(TRIM.y + mm(12))} ${num(TRIM.x)},${num(TRIM.y + mm(24))} Z" fill="${SOOT}" opacity="0.03"/>` +
    `<path d="M ${num(TRIM.x + TRIM.w)},${num(TRIM.y + TRIM.h)} H ${num(TRIM.x + TRIM.w - mm(24))} Q ${num(TRIM.x + TRIM.w - mm(9))},${num(TRIM.y + TRIM.h - mm(11))} ${num(TRIM.x + TRIM.w)},${num(TRIM.y + TRIM.h - mm(22))} Z" fill="${SOOT}" opacity="0.028"/>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>` +
    `<circle cx="${num(ringX)}" cy="${num(ringY)}" r="${num(mm(8.5))}" fill="none" stroke="${FOXING}" stroke-width="3.4" opacity="0.55"/>`
  );
}

/* --------------------------------------------------------------- the board */

function board() {
  const cols = TRACKS.map((t, i) => track(t, i));
  const kit = spec.slots.find((s) => s.id === 'kit');
  const figure = spec.slots.find((s) => s.id === 'figure');

  const kitSlots = [];
  for (let i = 0; i < kit.count; i++) {
    const cx = KIT_X + (i % KIT_COLS) * (SLOT.w + GUT);
    const cy = CONTENT.y + Math.floor(i / KIT_COLS) * (SLOT.h + KIT_ROW_GAP);
    kitSlots.push(slot(cx, cy, kit.label));
  }

  const arcane = TRACKS.filter((t) => t.arcane).map((t) => t.label.toLowerCase()).join(', ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.board.name)}</title>
<desc>${esc(spec.board.summary)} The ${esc(arcane)} track is an arcane subject and is the only thing on the board that takes the slip. Generated by tools/build-board.mjs from data/playerboard.json and data/components.json — do not edit. ${B.sheet.widthMm} x ${B.sheet.heightMm} mm at ${U} units/mm, ${B.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${cols.map((c) => c.wash).join('\n  ')}
</g>

<!-- ============================================================ SLIP -->
<!-- The arcane exception, and the only one on the board: the mana column's wash
     struck a shade out of register, bleeding past the ink line on one side. In
     the black-and-white edition there is no slip and nothing is lost. -->
<g id="slip">
  ${cols.map((c) => c.slip).filter(Boolean).join('\n  ')}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the workbench itself: sawn boards the length of the sheet, running to the
       edge, because there is no border for them to stop at -->
  <g clip-path="url(#sheet)">
    ${timber(spec.board.id)}
  </g>

  <!-- whatever is in play here - a hero, a monster, a wagon - and the round it
       is playing -->
  ${slot(CONTENT.x, CONTENT.y, figure.label)}
  ${panel()}

  <!-- the tracks: numbered from the bottom, walked by a token, exactly as a
       card's edge bar is - the board is not allowed a second convention -->
  ${cols.map((c) => c.ink).join('\n  ')}

  <!-- its kit: gear and quests for a figure, cargo and modifications for a hull -->
  ${kitSlots.join('\n  ')}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(spec.board.id)}
</g>
</svg>
`;
}

/* ------------------------------------------------------------------ output */

const BOARD_FILE = `${spec.board.id}.svg`;
const svg = board();

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the player board</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  /* A4 landscape, corner and all: a preview with square corners is a preview of
     a board nobody is going to cut. */
  .boards img { display: block; width: 100%; aspect-ratio: ${num(W)} / ${num(H)}; border: 1px solid ${T25};
                background: ${TALLOW}; border-radius: 10px; }
  figure { margin: 0; }
  table { border-collapse: collapse; font-size: 14px; margin: 8px 0 0; }
  th, td { text-align: left; padding: 5px 14px 5px 0; border-bottom: 1px solid ${T25}; vertical-align: top; }
  th { font-family: ${SANS}; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: ${T70}; font-weight: 600; }
  td.letter { font-weight: bold; font-size: 17px; }
  /* Print: one board a page at true size, and nothing else on the paper.
     The board is drawn with ${B.sheet.bleedMm}mm of bleed all round, so the sheet is laid
     ${B.sheet.bleedMm}mm out and up inside a window the size of the trim - the bleed runs off the
     page edge, which is the only place bleed is any use. Scale the whole thing
     to the page instead and the board prints 2% small. */
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    /* Nothing on the paper but the board. Naming what to hide goes stale the
       first time the page grows a heading it has not heard of - which is exactly
       how the market sheet came to print a second page carrying three stray
       <h3>s - so this names what to KEEP instead, and cannot rot. */
    .wrap > *:not(.boards) { display: none; }
    .boards figure { position: relative; width: ${B.sheet.widthMm}mm; height: ${B.sheet.heightMm}mm; overflow: hidden; }
    .boards img { position: absolute; left: -${B.sheet.bleedMm}mm; top: -${B.sheet.bleedMm}mm;
                  width: ${num(B.sheet.widthMm + 2 * B.sheet.bleedMm)}mm; height: ${num(B.sheet.heightMm + 2 * B.sheet.bleedMm)}mm;
                  border: 0; border-radius: 0; aspect-ratio: auto; }
    @page { size: A4 landscape; margin: 0; }
  }
</style>
</head>
<body>
<div class="wrap">
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <a href="../cards/index.html">The card fronts</a>
  <a href="../markets/index.html">The market board</a>
  <a href="../minimaps/index.html">The mini-map sheets</a>
  <a href="../map/index.html">The map</a>
  <a class="primary" href="#" onclick="window.print();return false;">Print the board →</a>
</div>
<h1>The player board</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note">${esc(spec.board.generic)}</p>
<p class="note">Generated by <code>tools/build-board.mjs</code> from <code>data/playerboard.json</code> and
<code>data/components.json</code> — edit those, re-run the tool, and never these files. Print one copy per player:
set your printer to 100% and landscape and turn off "fit to page", and the ${B.sheet.bleedMm}&nbsp;mm of bleed the board is
drawn with runs off the edge of the paper, which is the only place bleed is any use.</p>

<h2>The ${TRACKS.length} tracks</h2>
<table>
<tr><th></th><th>Track</th><th>Runs</th><th>What walks it</th></tr>
${TRACKS.map((t) => {
  const step = t.step ?? dotted(t.stepFrom);
  const unit = t.unit ? ' ' + esc(t.unit) : '';
  return `<tr><td class="letter">${esc(t.letter)}</td><td>${esc(t.label)}${t.unit ? ` <small>(${esc(t.unit)})</small>` : ''}</td>` +
    `<td>${B.track.from * step}–${B.track.to * step}${unit}</td><td>${esc(t.walks)}</td></tr>`;
}).join('\n')}
</table>

<h2>The board</h2>
<div class="boards">
  <!-- <img>, not <object>. An <object> is a nested browsing context, and a nested
       browsing context is the one thing a print preview is not obliged to paint. On
       this page that is not a degraded print, it is a blank sheet: everything else is
       display:none by then, so the board is the only thing on the paper. The card
       sheet pays that price on purpose - an SVG in an <img> may not fetch the plate it
       draws, and the plate is the card - but this board draws every mark itself and
       fetches nothing, so it has nothing to buy with it. -->
  <figure><img src="${BOARD_FILE}" alt="The player board"></figure>
</div>
</div>
</body>
</html>
`;

const outputs = [[BOARD_FILE, svg], ['index.html', index]];
const keep = new Set(outputs.map(([f]) => f));

/* Boards that are no longer built - the five per-people sheets this replaced -
   are removed rather than left to be served by a site that has moved on. */
const stale = existsSync(OUT_DIR)
  ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !keep.has(f))
  : [];

if (checkOnly) {
  const drifted = outputs.filter(([file, body]) => {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    return current !== body;
  }).map(([f]) => f);
  if (drifted.length || stale.length) {
    console.error(`docs/boards is stale (${[...drifted, ...stale.map((f) => f + ' should not exist')].join(', ')}). Run: node tools/build-board.mjs`);
    process.exit(1);
  }
  console.log('docs/boards is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of outputs) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote docs/boards/${BOARD_FILE} — ${B.sheet.widthMm}x${B.sheet.heightMm}mm, ` +
    `${TRACKS.length} tracks of ${B.track.from}-${B.track.to} ` +
    `(${num(CELL_W / U)}x${num(CELL_H / U)}mm cells), ${spec.slots.reduce((n, s) => n + s.count, 0)} card slots` +
    (stale.length ? `; removed ${stale.length} board(s) no longer built` : '')
  );
}
