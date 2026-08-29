#!/usr/bin/env node
/**
 * Draws the market board and the depletion sheet — two A4 landscape sheets —
 * from data/marketboard.json, data/components.json, data/rules.json and
 * data/pricing.json.
 *
 * THIS BOARD HOLDS NO PRICE, and that is the whole of what changed. It was six
 * identical lines, each with a tally of what the board was holding, a memory
 * strip from −3 to +3, and a six-band price ladder walked by the commodity's own
 * token; and the entire apparatus existed because three market models needed
 * somewhere to remember things. None of them remembers anything now. A
 * perishable's rule happens in a player's hands at the end of the round, a
 * finite resource's number is read off its own grid, and a sought good's number
 * is the move it made last round, which is written on the ledger anyway. Nothing
 * was left for six lines to hold.
 *
 * So the price went to the LEDGER, where a price belongs — tools/build-ledger.mjs
 * — and this became what a board in front of everybody is actually good at:
 * saying what the rules are.
 *
 *   SHEET ONE, the market board: the roll across the head — the dice, the
 *   volatility strip, the swing ruler — and under it one panel per KIND OF GOOD,
 *   each headed by the mark engraved in the corner of that good's own tokens.
 *
 *   SHEET TWO, the depletion sheet: a page of numbered grids, one per finite
 *   commodity in play, covered a pip at a time as the stuff is burnt and never
 *   uncovered. It is on its own sheet because it is the only board in the game
 *   that is SPENT — a played game leaves it covered in pieces that are out of
 *   the box for good, and a sheet you print fresh each time is a different kind
 *   of object from a sheet you keep.
 *
 * The same bargain as tools/build-board.mjs: the data says what the sheets are
 * for, components.json says what shape they are drawn into, and nothing here
 * invents a number that belongs to either. Even the arrangement is arithmetic:
 *
 *   head.columns, as fractions of the working width  = the roll's three blocks
 *   contentW over however many kinds of good there are = a panel
 *   pip diameter + its clearance either side          = a depletion cell
 *   pricing.depletion per x (top + 1)                 = a grid
 *   what fits between the margins, twice              = how many grids a sheet holds
 *
 * Declare a fifth kind of good and the panels narrow. Make a seam last longer and
 * the grids get taller and fewer fit. Nothing runs off the paper, because nothing
 * was ever placed by hand — and a figure a pip cannot hide, or a sheet that will
 * not hold the game's finite commodities, fails the build rather than printing.
 *
 * NOTHING ON EITHER SHEET NAMES A COMMODITY. That is still the whole design. A
 * grid is not the coal grid until somebody stands the coal token in its seat.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash carries the
 * colour of the dice and the ruler's tints, #ink carries every rule, number, mark
 * and letter in soot alone, #grime carries the wear. Drop #wash and the sheets
 * still play, because the ruler and the dice letters were never the colour's job.
 *
 * Usage: node tools/build-market.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inkHex } from './lib/palette.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'markets');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('marketboard.json');
const rules = read('rules.json');
const pricing = read('pricing.json');
const arcana = read('arcana.json');
const commodities = read('commodities.json');

/* Every colour below is declared in palette.json — validate-art.mjs checks. */
const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const T85 = palette.ink.tints['85'].hex;
const T70 = palette.ink.tints['70'].hex;
const T55 = palette.ink.tints['55'].hex;
const T40 = palette.ink.tints['40'].hex;
const T25 = palette.ink.tints['25'].hex;
const T12 = palette.ink.tints['12'].hex;
const OCHRE = palette.inks.ochre.hex;
const VERDIGRIS = palette.inks.verdigris.hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));
/* A proper minus, not a hyphen. The ruler labels in pricing.json are typeset
   with one and a strip that used the other would be two boards. */
const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : String(n));

/** Greedy wrap by estimated glyph width — close enough for a serif at this size. */
function wrap(t, maxChars) {
  const out = [];
  let line = '';
  for (const w of String(t).split(/\s+/)) {
    if (line && (line + ' ' + w).length > maxChars) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

/* ------------------------------------------------------------- the geometry */

const M = components.marketBoard;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(M.sheet.bleedMm);
const W = mm(M.sheet.widthMm + 2 * M.sheet.bleedMm);
const H = mm(M.sheet.heightMm + 2 * M.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(M.sheet.widthMm), h: mm(M.sheet.heightMm) };
const CORNER = mm(M.sheet.cornerRadiusMm);

const CONTENT = {
  x: TRIM.x + mm(M.marginMm),
  y: TRIM.y + mm(M.marginMm),
  w: TRIM.w - 2 * mm(M.marginMm),
  h: TRIM.h - 2 * mm(M.marginMm),
};

const BANDS = rules.market.priceBands;
const BINS = pricing.ruler.bins;
const MODELS = pricing.models;
const GUT = mm(M.gutterMm);

/* A flat-top hexagon is widest across its CORNERS, and that is the dimension a
   seat has to clear: acrossFlats x 2/root-3. The pip is round and therefore its
   own widest dimension. These are the two numbers on these sheets that come from
   a physical piece rather than from the paper. */
const TOKEN = components.tokens.commodity;
const TOKEN_FLATS = mm(TOKEN.acrossFlatsMm);
const TOKEN_CORNERS = TOKEN_FLATS * 2 / Math.sqrt(3);
const PIP = mm(components.tokens.pip.diameterMm);

/* The head: three blocks across the top, laid out by fractions of the working
   width. They are fractions rather than positions because the three things are
   different shapes — a count of dice, a strip of three cells, a ruler of seven —
   and what matters is that the ruler gets the most of them. */
const HEAD_H = mm(M.head.heightMm);
const HEAD_COLS = M.head.columns;
const HEAD_INNER = CONTENT.w - 2 * GUT;
const HEAD_W = {
  dice: HEAD_INNER * HEAD_COLS.dice,
  volatility: HEAD_INNER * HEAD_COLS.volatility,
  ruler: HEAD_INNER * HEAD_COLS.ruler,
};
const HEAD_X = {
  dice: CONTENT.x,
  volatility: CONTENT.x + HEAD_W.dice + GUT,
  ruler: CONTENT.x + HEAD_W.dice + HEAD_W.volatility + 2 * GUT,
};

/* The body: one panel per kind of good, and the foot's prose under them. */
const PANEL_FOOT_H = mm(M.panelFoot.heightMm);
const PANELS_TOP = CONTENT.y + HEAD_H;
const PANELS_H = CONTENT.h - HEAD_H - PANEL_FOOT_H;
const PANEL_W = (CONTENT.w - (MODELS.length - 1) * GUT) / MODELS.length;
const PANEL_PAD = mm(M.panels.padMm);
const PANEL_EXTRA_H = mm(M.panels.extraMm);

/* The depletion grid, and every number of it derived. A cell is the piece that
   covers it plus its clearance; a grid is the ladder in pricing.json; how many
   fit is a division. */
const D = M.depletion;
const DEP = pricing.depletion;
const CELL = PIP + 2 * mm(D.cell.clearanceMm);
const GRID_COLS = DEP.per;
const GRID_ROWS = DEP.top + 1;
const SEAT_FLATS = TOKEN_FLATS + 2 * mm(D.grid.seatClearanceMm);
const SEAT_CORNERS = SEAT_FLATS * 2 / Math.sqrt(3);
const GRID_W = Math.max(GRID_COLS * CELL, SEAT_CORNERS);
const GRID_H = SEAT_FLATS + mm(D.grid.gapMm) + GRID_ROWS * CELL + mm(D.grid.labelMm);

const D_TRIM = { x: BLEED, y: BLEED, w: mm(D.sheet.widthMm), h: mm(D.sheet.heightMm) };
const D_CONTENT = {
  x: D_TRIM.x + mm(D.marginMm),
  y: D_TRIM.y + mm(D.marginMm) + mm(D.headMm),
  w: D_TRIM.w - 2 * mm(D.marginMm),
  h: D_TRIM.h - 2 * mm(D.marginMm) - mm(D.headMm) - mm(D.footMm),
};
const D_GUT = mm(D.gutterMm);
const GRIDS_ACROSS = Math.floor((D_CONTENT.w + D_GUT) / (GRID_W + D_GUT));
const GRIDS_DOWN = Math.floor((D_CONTENT.h + D_GUT) / (GRID_H + D_GUT));
const GRIDS = GRIDS_ACROSS * GRIDS_DOWN;
const FINITE = commodities.commodities.filter((c) => c.pricing === 'deplete');
const STAPLE_COUNT = commodities.commodities.filter((c) => c.pricing === 'staple').length;

/* A COVERED CELL HAS TO BE A CELL WHOSE NUMBER HAS GONE. This is a class of
   check nothing else in the build makes: everywhere else a piece stands BESIDE
   what it means, and here it stands ON it. A figure peeping out from behind the
   pip that is supposed to have taken it would make "the lowest one you can still
   see" a matter of opinion, which is the one thing this grid cannot afford. */
if (mm(D.cell.digitMm) > PIP) {
  throw new Error(
    `a depletion cell prints its figure at ${D.cell.digitMm}mm and the pip that covers it is ` +
    `${components.tokens.pip.diameterMm}mm across - the number would peep out from behind the piece ` +
    `that is supposed to have taken it.`
  );
}
if (GRIDS < 1) {
  throw new Error(
    `a depletion grid is ${num(GRID_W / U)}x${num(GRID_H / U)}mm and not one of them fits a ` +
    `${D.sheet.widthMm}x${D.sheet.heightMm}mm sheet with a ${D.headMm}mm head and a ${D.footMm}mm foot.`
  );
}
if (GRIDS < FINITE.length) {
  throw new Error(
    `${GRIDS} depletion grids fit a sheet (${GRIDS_ACROSS} across by ${GRIDS_DOWN} down) and ` +
    `${FINITE.length} commodities are priced by depletion - a table would be a grid short, and the ` +
    `commodity that went without one would quietly stop running out.`
  );
}
if (PANEL_W < mm(M.panels.markMm) + 2 * PANEL_PAD) {
  throw new Error(
    `${MODELS.length} kinds of good leave ${num(PANEL_W / U)}mm a panel and the mark alone is ` +
    `${M.panels.markMm}mm - the sheet has run out of width.`
  );
}
{
  const sum = Object.values(HEAD_COLS).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.001) {
    throw new Error(`the head's columns are fractions of the working width and they sum to ${sum} - at anything but 1 the roll overruns the paper or leaves a gap nobody meant`);
  }
}

/* ---------------------------------------------------------------- utilities */

function insetOf(trim, by) {
  return { x: trim.x + by, y: trim.y + by, w: trim.w - 2 * by, h: trim.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const inset = (by) => insetOf(TRIM, by);
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

const text = (x, y, size, body, attrs = '') =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${num(size)}" ${attrs}>${body}</text>`;

/** The small letter-spaced sans label every group on these sheets is titled with. */
const caption = (x, y, body, { fill = T55, size = mm(2.2), anchor = 'start' } = {}) =>
  text(x, y, size, esc(body), `text-anchor="${anchor}" letter-spacing="${num(mm(0.26))}" font-family="${SANS}" fill="${fill}"`);

/** Deterministic noise — the grain has to be the same grain every run, or
    --check would fail on a sheet nobody had touched. */
function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Sawn boards the length of the sheet: the same workbench the player board is. */
function timber(seed, trim, t) {
  const rand = rng(`timber-${seed}`);
  const step = mm(t.boardWidthMm);
  const out = [];
  for (let y = trim.y + step; y < trim.y + trim.h - 4; y += step) {
    out.push(`<path d="M ${num(trim.x)},${num(y)} H ${num(trim.x + trim.w)}" stroke="${T25}" stroke-width="${t.seamStrokeWidth}"/>`);
    for (let i = 0; i < 4; i++) {
      const gy = y - step + step * ((i + 0.6 + rand() * 0.5) / 4.6);
      const bow = (rand() - 0.5) * mm(2.2);
      out.push(
        `<path d="M ${num(trim.x)},${num(gy)} Q ${num(trim.x + trim.w / 2)},${num(gy + bow)} ${num(trim.x + trim.w)},${num(gy)}" ` +
        `stroke="${T12}" stroke-width="${t.grainStrokeWidth}"/>`
      );
    }
  }
  for (let k = 0; k < t.knots; k++) {
    const kx = trim.x + mm(20) + rand() * (trim.w - mm(40));
    const ky = trim.y + mm(14) + rand() * (trim.h - mm(28));
    for (let r = 1; r <= 2; r++) {
      out.push(`<ellipse cx="${num(kx)}" cy="${num(ky)}" rx="${num(r * mm(1.3))}" ry="${num(r * mm(0.7))}" stroke="${T25}" stroke-width="${t.grainStrokeWidth}"/>`);
    }
  }
  return `<g fill="none" opacity="${t.grainOpacity}">\n    ${out.join('\n    ')}\n  </g>`;
}

/** A flat-top hexagon, the shape a commodity token is cut to. */
function hexPath(cx, cy, acrossFlats) {
  const R = acrossFlats / Math.sqrt(3);       // circumradius
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;              // flat top: first corner due east
    pts.push(`${num(cx + R * Math.cos(a))},${num(cy + R * Math.sin(a))}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

/**
 * One kind-of-good mark, drawn into a box of `size` at `x`,`y`.
 *
 * The path is data on the model (pricing.json models[].mark.path) and how to
 * draw it is components.json marks.pricing, exactly as an element mark is drawn
 * — so the panel heads on this sheet, the key on the ledger's foot and the corner
 * engraved on every commodity token trace one set of four marks and cannot
 * disagree about them.
 */
function markGroup(model, x, y, size) {
  const s = components.marks.pricing;
  const k = size / 24;
  return (
    `<g transform="translate(${num(x)} ${num(y)}) scale(${num(k)})" fill="${s.fill}" stroke="${SOOT}" ` +
    `stroke-width="${s.strokeWidth}" stroke-linecap="${s.strokeLinecap}" stroke-linejoin="${s.strokeLinejoin}">` +
    `<path d="${model.mark.path}"/></g>`
  );
}

/* ---------------------------------------------------------------- the roll */

/* The dice laid out as dice: how wide that block is is a count of pieces, not a
   fraction of the paper. The PURPLE mana die is drawn with them and is not a
   market die at all (arcana.json manaDie) — it is here because the head is where
   a player looks to find out what a colour means, and a set of dice that is
   nearly all of the box is worse than the whole of it. */
const DIE = mm(M.dice.swatchMm);
const DIE_GAP = mm(M.dice.gapMm);
const DIE_GROUP_GAP = mm(M.dice.groupGapMm);
const DICE_SETS = [
  ...pricing.dice.sets,
  { ...arcana.manaDie, market: false },
];

function diceKey(x, y, w) {
  const ink = [caption(x, y + mm(2.6), spec.roll.dice.title, { fill: T70 })];
  const wash = [];
  const top = y + mm(5.4);
  /* Wrapped into rows, because five colours of die is wider than three was and
     the head is a third of the sheet rather than the whole of it. */
  /* A group takes the wider of its dice and its own caption. VOLATILITY is
     eleven letters under ONE die, and a cursor advanced by the dice alone puts
     the next group's caption straight through it - which is exactly what the
     first draft of this sheet did. The caption width is estimated from the type
     rather than typed, so a renamed die re-lays the row instead of colliding. */
  const capW = (label) => label.length * (mm(1.9) * 0.58 + mm(0.26));
  let cursor = x;
  let row = 0;
  for (const set of DICE_SETS) {
    const diceW = set.count * DIE + (set.count - 1) * DIE_GAP;
    const groupW = Math.max(diceW, capW(set.name.toUpperCase()));
    if (cursor > x && cursor + groupW > x + w) { cursor = x; row += 1; }
    const ty = top + row * (DIE + mm(5.2));
    for (let n = 0; n < set.count; n++) {
      const dx = cursor + n * (DIE + DIE_GAP);
      wash.push(
        `<rect x="${num(dx)}" y="${num(ty)}" width="${num(DIE)}" height="${num(DIE)}" rx="${num(mm(1.2))}" ` +
        `fill="${inkHex(M.dice.ink[set.colour], palette)}" opacity="${set.market === false ? 0.4 : 0.55}"/>`
      );
      ink.push(
        `<rect x="${num(dx)}" y="${num(ty)}" width="${num(DIE)}" height="${num(DIE)}" rx="${num(mm(1.2))}" ` +
        `fill="none" stroke="${SOOT}" stroke-width="0.9"${set.market === false ? ' stroke-dasharray="2 1.6"' : ''}/>` +
        text(dx + DIE / 2, ty + DIE * 0.72, mm(3.4), esc(set.name[0]),
          `text-anchor="middle" font-family="${SANS}" font-weight="bold"`)
      );
    }
    /* Captions hang from the LEFT of their own group rather than centred on it,
       because VOLATILITY is three times the width of the one green die it belongs
       to and a centred caption would sit on top of its neighbour. */
    ink.push(caption(cursor, ty + DIE + mm(3), set.name.toUpperCase(), { size: mm(1.9), fill: set.market === false ? T55 : T70 }));
    cursor += groupW + DIE_GROUP_GAP;
  }
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/** The green die read as an ADDEND: three cells, and the whole of volatility. */
function volatilityStrip(x, y, w, h) {
  const steps = pricing.volatility.steps;
  const cw = w / steps.length;
  const top = y + mm(4.6);
  const ch = h - mm(4.6) - mm(4);
  const ink = [caption(x, y + mm(2.6), spec.roll.volatility.title, { fill: T70 })];
  steps.forEach((s, i) => {
    const cx = x + i * cw;
    ink.push(
      `<rect x="${num(cx)}" y="${num(top)}" width="${num(cw)}" height="${num(ch)}" rx="${num(mm(1))}" fill="none" ` +
      `stroke="${SOOT}" stroke-width="${M.head.cellStrokeWidth}" opacity="0.7"/>`,
      text(cx + cw / 2, top + mm(3.2), mm(2.4), esc(`${s.faces[0]}–${s.faces[s.faces.length - 1]}`),
        `text-anchor="middle" font-family="${SANS}" fill="${T70}"`),
      text(cx + cw / 2, top + mm(8), mm(4.4), esc(s.label), `text-anchor="middle" font-family="${SANS}" font-weight="bold"`),
      caption(cx + cw / 2, top + ch - mm(1.4), s.name.toUpperCase(), { anchor: 'middle', size: mm(1.9), fill: T55 })
    );
  });
  return ink.join('\n    ');
}

/**
 * The swing ruler: one cell per bin, printing the net it covers and how many
 * places the price steps. This strip is the reason the sheet is worth printing
 * rather than looked up.
 */
function swingRuler(x, y, w, h) {
  const cw = w / BINS.length;
  const top = y + mm(4.6);
  const ch = h - mm(4.6) - mm(4);
  const wash = [];
  const ink = [
    caption(x, y + mm(2.6), spec.roll.ruler.title, { fill: T70 }),
    text(x + w, y + mm(2.6), mm(2.4), esc(pricing.formula.net), `text-anchor="end" font-style="italic" fill="${T85}"`),
  ];
  BINS.forEach((bin, i) => {
    const cx = x + i * cw;
    if (bin.move !== 0) {
      wash.push(
        `<rect x="${num(cx)}" y="${num(top)}" width="${num(cw)}" height="${num(ch)}" ` +
        `fill="${bin.move < 0 ? VERDIGRIS : OCHRE}" opacity="${num(0.08 + 0.06 * Math.abs(bin.move))}"/>`
      );
    }
    ink.push(
      `<rect x="${num(cx)}" y="${num(top)}" width="${num(cw)}" height="${num(ch)}" rx="${num(mm(1))}" fill="none" ` +
      `stroke="${SOOT}" stroke-width="${M.head.cellStrokeWidth}" opacity="0.7"/>`,
      text(cx + cw / 2, top + mm(3.2), mm(2.4), esc(bin.label), `text-anchor="middle" font-family="${SANS}" fill="${T70}"`),
      text(cx + cw / 2, top + mm(8.4), mm(5), esc(bin.move === 0 ? '—' : signed(bin.move)),
        `text-anchor="middle" font-family="${SANS}" font-weight="bold"`),
      caption(cx + cw / 2, top + ch - mm(1.4), bin.name.toUpperCase(), { anchor: 'middle', size: mm(1.9), fill: T55 })
    );
  });
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

function head() {
  const dice = diceKey(HEAD_X.dice, CONTENT.y + mm(M.head.titleMm), HEAD_W.dice);
  const vol = volatilityStrip(HEAD_X.volatility, CONTENT.y + mm(M.head.titleMm), HEAD_W.volatility, HEAD_H - mm(M.head.titleMm));
  const swing = swingRuler(HEAD_X.ruler, CONTENT.y + mm(M.head.titleMm), HEAD_W.ruler, HEAD_H - mm(M.head.titleMm));
  const ink = [
    caption(CONTENT.x, CONTENT.y + mm(3), spec.roll.title, { fill: SOOT, size: mm(3) }),
    text(CONTENT.x + CONTENT.w, CONTENT.y + mm(3), mm(2.9), esc(spec.roll.formula), `text-anchor="end" font-style="italic" fill="${T85}"`),
    dice.ink, vol, swing.ink,
    `<path d="M ${num(CONTENT.x)},${num(PANELS_TOP - mm(2))} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${M.head.ruleStrokeWidth}"/>`,
  ];
  return { wash: [dice.wash, swing.wash].join('\n    '), ink: ink.join('\n    ') };
}

/* --------------------------------------------------------------- the panels */

/** The spoil strip: the ochre die, and how many units a stack loses to it. */
function spoilStrip(x, y, w, h) {
  const steps = pricing.spoil.steps;
  const rowH = (h - mm(4)) / steps.length;
  const colW = (w - mm(9)) / 2;
  const out = [caption(x, y + mm(2.4), 'THE SPOIL DIE', { fill: T70, size: mm(1.9) })];
  out.push(
    caption(x + mm(9), y + mm(6.2), 'KEEPS', { fill: T55, size: mm(1.7) }),
    caption(x + mm(9) + colW, y + mm(6.2), 'DOES NOT', { fill: T55, size: mm(1.7) })
  );
  steps.forEach((s, i) => {
    const ry = y + mm(7) + i * rowH;
    out.push(
      text(x, ry + rowH * 0.72, mm(2.3), esc(`${s.faces[0]}–${s.faces[s.faces.length - 1]}`), `font-family="${SANS}" fill="${T70}"`),
      text(x + mm(9) + colW * 0.3, ry + rowH * 0.72, mm(2.8), String(s.keepsWell), `font-family="${SANS}" font-weight="bold"`),
      text(x + mm(9) + colW + colW * 0.3, ry + rowH * 0.72, mm(2.8), String(s.keepsPoorly), `font-family="${SANS}" font-weight="bold"`)
    );
  });
  return out.join('\n    ');
}

/** One depletion grid, drawn wherever it is asked for — on its own sheet, and
    once inside the FINITE panel as the example. */
function depletionGrid(x, y, { seat = true } = {}) {
  const out = [];
  const cx = x + GRID_W / 2;
  let top = y;
  if (seat) {
    out.push(
      `<path d="${hexPath(cx, y + SEAT_FLATS / 2, SEAT_FLATS)}" fill="none" stroke="${T40}" ` +
      `stroke-width="${D.grid.seatStrokeWidth}" opacity="0.75"/>`
    );
    top = y + SEAT_FLATS + mm(D.grid.gapMm);
  }
  const gx = cx - (GRID_COLS * CELL) / 2;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const bx = gx + c * CELL;
      const by = top + r * CELL;
      out.push(
        `<rect x="${num(bx)}" y="${num(by)}" width="${num(CELL)}" height="${num(CELL)}" rx="${num(mm(0.8))}" ` +
        `fill="none" stroke="${SOOT}" stroke-width="${D.cell.strokeWidth}" opacity="0.72"/>`,
        text(bx + CELL / 2, by + CELL * 0.7, mm(D.cell.digitMm), String(r * DEP.step),
          `text-anchor="middle" font-family="${SANS}" fill="${T70}"`)
      );
    }
  }
  return out.join('\n    ');
}

/**
 * One panel: a kind of good, its mark, what it adds to the swing, and whatever
 * one strip or grid it needs. The panels are the sheet's whole subject.
 */
function panelFor(model, i) {
  const x = CONTENT.x + i * (PANEL_W + GUT);
  const size = mm(M.panels.markMm);
  const inner = PANEL_W - 2 * PANEL_PAD;
  const bodyChars = Math.floor(inner / (mm(M.panels.bodyMm) * 0.47));
  const out = [];

  if (i > 0) {
    out.push(`<path d="M ${num(x - GUT / 2)},${num(PANELS_TOP + mm(2))} V ${num(PANELS_TOP + PANELS_H - mm(2))}" stroke="${T40}" stroke-width="${M.panels.ruleStrokeWidth}" opacity="0.6"/>`);
  }

  /* The panel FLOWS from the top: head, what it adds, what else it does, the
     worked example, and last whatever strip or grid it needs. Nothing is pinned
     to the bottom, because pinning is what left a hand's width of blank paper
     across the middle of the first draft of this sheet - and blank paper on a
     rules board reads as a rule somebody forgot to write. */
  const top = PANELS_TOP + mm(4);
  out.push(markGroup(model, x + PANEL_PAD, top, size));
  out.push(text(x + PANEL_PAD + size + mm(2.4), top + mm(5.6), mm(M.panels.titleMm), esc(model.name.toUpperCase()),
    `font-family="${SANS}" font-weight="bold" letter-spacing="${num(mm(0.3))}"`));
  out.push(text(x + PANEL_PAD + size + mm(2.4), top + mm(10.4), mm(M.panels.lineMm), esc(model.line), `font-style="italic" fill="${T85}"`));

  let cursor = top + size + mm(4.4);

  /* What it adds, said as a number where there is one and as a pointer where
     there is not. This is the line a player is actually looking for. */
  const adds = model.modifier === 0
    ? 'Adds nothing to the swing.'
    : model.id === 'deplete'
      ? 'Adds the lowest number still visible on its own grid.'
      : 'Adds the move it made last round, from the box on the ledger row above.';
  out.push(`<path d="M ${num(x + PANEL_PAD)},${num(cursor - mm(3.2))} H ${num(x + PANEL_W - PANEL_PAD)}" stroke="${SOOT}" stroke-width="0.7" opacity="0.5"/>`);
  for (const l of wrap(adds, bodyChars)) {
    out.push(text(x + PANEL_PAD, cursor, mm(M.panels.bodyMm), esc(l), 'font-weight="bold"'));
    cursor += mm(3.4);
  }
  cursor += mm(2);

  /* And what else it does to you. */
  const body = model.id === 'perish'
    ? 'Every stack you still hold at the end of a round faces the ochre die. What it says, you discard.'
    : model.id === 'deplete'
      ? `A pip goes on the grid for every unit BURNT - never for one traded - and no pip ever comes off. ${GRID_ROWS * GRID_COLS} of them works a seam out for good.`
      : model.id === 'hype'
        ? 'A rise makes buyers and buyers make a rise, until a bad roll turns it and the same machinery runs the other way just as fast.'
        : `The dice are the whole story. ${MODELS.length ? STAPLE_COUNT : 0} of the ${commodities.commodities.length} commodities are one of these, which is what makes the other three mean something.`;
  for (const l of wrap(body, bodyChars)) {
    out.push(text(x + PANEL_PAD, cursor, mm(M.panels.bodyMm), esc(l), `fill="${T85}"`));
    cursor += mm(3.2);
  }
  cursor += mm(4.5);

  /* The worked example. A rule stated is a rule half the table will read the
     wrong way round the first time; a rule WORKED is one nobody argues about. */
  const worked = spec.kinds.worked?.[model.id] ?? [];
  if (worked.length) {
    out.push(caption(x + PANEL_PAD, cursor, 'WORKED', { fill: T70, size: mm(1.9) }));
    cursor += mm(3.4);
    worked.forEach((step, n) => {
      out.push(text(x + PANEL_PAD, cursor + mm(2.2), mm(2.1), String(n + 1),
        `font-family="${SANS}" fill="${T55}"`));
      for (const l of wrap(step, Math.floor(bodyChars * 0.92))) {
        out.push(text(x + PANEL_PAD + mm(4), cursor + mm(2.2), mm(2.35), esc(l), `fill="${T85}"`));
        cursor += mm(2.9);
      }
      cursor += mm(1);
    });
    cursor += mm(3);
  }

  /* The extra: a strip, a grid, or nothing at all. A staple's panel simply has
     more air, which is the correct thing for the panel about the goods that do
     nothing special to look like. */
  const room = PANELS_TOP + PANELS_H - cursor;
  if (model.id === 'perish') out.push(spoilStrip(x + PANEL_PAD, cursor, inner, Math.min(room, PANEL_EXTRA_H)));
  if (model.id === 'deplete') {
    out.push(caption(x + PANEL_PAD, cursor, 'ONE GRID, ON THE OTHER SHEET', { fill: T70, size: mm(1.9) }));
    out.push(depletionGrid(x + PANEL_PAD, cursor + mm(1.6), { seat: false }));
  }
  if (model.id === 'hype') {
    out.push(caption(x + PANEL_PAD, cursor, 'THE MOVE BOX', { fill: T70, size: mm(1.9) }));
    out.push(text(x + PANEL_PAD, cursor + mm(7), mm(6), esc(`${signed(pricing.sought.from)} … ${signed(pricing.sought.to)}`),
      `font-family="${SANS}" font-weight="bold"`));
    wrap('The previous move, in bands. Never this one - that is what you are working out.', bodyChars).forEach((l, n) => {
      out.push(text(x + PANEL_PAD, cursor + mm(11) + n * mm(2.9), mm(2.3), esc(l), `fill="${T85}"`));
    });
  }
  return out.join('\n    ');
}

function panels() {
  return MODELS.map((m, i) => panelFor(m, i)).join('\n    ');
}

/**
 * The prose. The only sentences on the sheet that are not about one particular
 * kind of good, printed from data rather than written here.
 */
function panelFoot() {
  const y = CONTENT.y + CONTENT.h - PANEL_FOOT_H;
  const out = [];
  out.push(`<path d="M ${num(CONTENT.x)},${num(y)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${M.panelFoot.ruleStrokeWidth}"/>`);
  out.push(caption(CONTENT.x, y + mm(3.6), spec.panel.title, { fill: T70, size: mm(2.7) }));
  spec.panel.lines.forEach((l, i) => {
    out.push(text(CONTENT.x + mm(30), y + mm(3.2) + i * mm(2.9), mm(2.4), esc(l)));
  });
  out.push(text(CONTENT.x + CONTENT.w, y + mm(3.6), mm(2.4), esc(spec.panel.foot), `text-anchor="end" font-style="italic" fill="${T85}"`));
  out.push(caption(CONTENT.x + CONTENT.w, y + PANEL_FOOT_H - mm(0.6), `game1 · ${spec.board.name.toUpperCase()}`, { anchor: 'end', size: mm(2.2), fill: T40 }));
  return out.join('\n    ');
}

/** Where the die goes, marked in the bleed and never on the sheet. */
function dieMarks(trim) {
  const g = 8;
  const R = CORNER + g;
  const b = { x: trim.x - g, y: trim.y - g, w: trim.w + 2 * g, h: trim.h + 2 * g };
  const arcs = [
    `M ${num(b.x)},${num(b.y + R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + R)},${num(b.y)}`,
    `M ${num(b.x + b.w - R)},${num(b.y)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w)},${num(b.y + R)}`,
    `M ${num(b.x + b.w)},${num(b.y + b.h - R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w - R)},${num(b.y + b.h)}`,
    `M ${num(b.x + R)},${num(b.y + b.h)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x)},${num(b.y + b.h - R)}`,
  ];
  return `<g fill="none" stroke="${SOOT}" stroke-width="1.2" opacity="0.32">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

/** Press wear: a foxed corner and specks. No rings — see CLAUDE.md, and
 *  tools/validate-art.mjs, which fails the build on one. */
function grime(seed, trim) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 8 }, () =>
    `<circle cx="${num(trim.x + rand() * trim.w)}" cy="${num(trim.y + rand() * trim.h)}" r="${num(1 + rand() * 1.6)}"/>`
  ).join('');
  return (
    dieMarks(trim) +
    `<path d="M ${num(trim.x + trim.w)},${num(trim.y)} H ${num(trim.x + trim.w - mm(24))} Q ${num(trim.x + trim.w - mm(9))},${num(trim.y + mm(11))} ${num(trim.x + trim.w)},${num(trim.y + mm(22))} Z" fill="${SOOT}" opacity="0.03"/>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>`
  );
}

/* --------------------------------------------------------------- the sheets */

function board() {
  const h = head();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.board.name)}</title>
<desc>${esc(spec.board.summary)} The roll across the head - ${DICE_SETS.reduce((n, s) => n + s.count, 0)} dice, a ${pricing.volatility.steps.length}-cell volatility strip and a ${BINS.length}-cell swing ruler - over ${MODELS.length} panels, one per kind of good. It holds no price and nothing stands on it; the price is on the ledger (docs/ledger/) and the depletion grids are on their own sheet. Generated by tools/build-market.mjs from data/marketboard.json, data/components.json, data/rules.json and data/pricing.json - do not edit. ${M.sheet.widthMm} x ${M.sheet.heightMm} mm at ${U} units/mm, ${M.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${h.wash}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the workbench itself: sawn boards the length of the sheet, running to the
       edge, because there is no border for them to stop at -->
  <g clip-path="url(#sheet)">
    ${timber(spec.board.id, TRIM, M.timber)}
  </g>

  <!-- the roll: the dice, the green die read as an addend, and the ruler -->
  ${h.ink}

  <!-- the four kinds of good, which are what this sheet is about -->
  ${panels()}

  <!-- the prose -->
  ${panelFoot()}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(spec.board.id, TRIM)}
</g>
</svg>
`;
}

function depletionSheet() {
  const DW = mm(D.sheet.widthMm + 2 * D.sheet.bleedMm);
  const DH = mm(D.sheet.heightMm + 2 * D.sheet.bleedMm);
  const grids = [];
  const spanW = GRIDS_ACROSS * GRID_W + (GRIDS_ACROSS - 1) * D_GUT;
  const left = D_CONTENT.x + (D_CONTENT.w - spanW) / 2;
  for (let r = 0; r < GRIDS_DOWN; r++) {
    for (let c = 0; c < GRIDS_ACROSS; c++) {
      grids.push(depletionGrid(left + c * (GRID_W + D_GUT), D_CONTENT.y + r * (GRID_H + D_GUT)));
    }
  }
  const headY = D_TRIM.y + mm(D.marginMm);
  const footY = D_TRIM.y + D_TRIM.h - mm(D.marginMm);
  const deplete = MODELS.find((m) => m.id === 'deplete');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(DW)} ${num(DH)}" width="${num(DW)}" height="${num(DH)}" font-family="${SERIF}">
<title>${esc(spec.depletion.name)}</title>
<desc>${esc(spec.depletion.summary)} ${GRIDS} identical grids, ${GRIDS_ACROSS} across by ${GRIDS_DOWN} down, each ${GRID_COLS} cells by ${GRID_ROWS} rows over a hexagonal seat for the commodity's own token. ${FINITE.length} commodities are priced by depletion, so one sheet is one game. Generated by tools/build-market.mjs - do not edit. ${D.sheet.widthMm} x ${D.sheet.heightMm} mm at ${U} units/mm, ${D.sheet.bleedMm} mm bleed.</desc>
<defs>
  <clipPath id="depletion-sheet">${rect(insetOf(D_TRIM, 0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(DW)}" height="${num(DH)}" fill="${TALLOW}"/>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <g clip-path="url(#depletion-sheet)">
    ${timber(`${spec.board.id}-depletion`, D_TRIM, D.timber)}
  </g>
  ${markGroup(deplete, D_TRIM.x + mm(D.marginMm), headY, mm(D.headMm - 4))}
  ${caption(D_TRIM.x + mm(D.marginMm) + mm(D.headMm), headY + mm(5), spec.depletion.name.toUpperCase(), { fill: SOOT, size: mm(3.4) })}
  ${text(D_TRIM.x + mm(D.marginMm) + mm(D.headMm), headY + mm(9.4), mm(2.5), esc(spec.depletion.reads + ' ' + spec.depletion.fills), `fill="${T85}" font-style="italic"`)}
  ${text(D_TRIM.x + D_TRIM.w - mm(D.marginMm), headY + mm(5), mm(2.5), esc(spec.depletion.notFilled.split(' - ')[0]), `text-anchor="end" fill="${T85}"`)}
  ${grids.join('\n  ')}
  ${caption(D_TRIM.x + mm(D.marginMm), footY - mm(1), 'A PIP LAID HERE IS OUT OF THE GAME. NOTHING IS EVER LIFTED OFF.', { fill: T70, size: mm(2.4) })}
  ${caption(D_TRIM.x + D_TRIM.w - mm(D.marginMm), footY - mm(1), `game1 · ${spec.depletion.name.toUpperCase()}`, { anchor: 'end', size: mm(2.2), fill: T40 })}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(`${spec.board.id}-depletion`, D_TRIM)}
</g>
</svg>
`;
}

/* ------------------------------------------------------- what the dice do */

/**
 * The odds, worked out rather than claimed: every pair of blue dice against
 * every pair of red, for every face of the green, at every modifier a good can
 * bring. Nothing in the data says how often a market moves — pricing.ruler.odds
 * STATES the intention and this derives the truth, so a change to a ruler bin
 * shows up in the printed odds on the next build and the two can be compared.
 */
function moveOf(net) {
  const bin = BINS.find((b) => net >= b.from && net <= b.to);
  if (!bin) throw new Error(`the swing ruler has no cell for a net of ${net}`);
  return bin.move;
}

function oddsFor(modifier) {
  const counts = new Map();
  let total = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++)
    for (let c = 1; c <= 6; c++) for (let d = 1; d <= 6; d++)
      for (const step of pricing.volatility.steps) for (const f of step.faces) {
        void f;
        const net = (a + b) - (c + d) + step.add + modifier;
        const mv = moveOf(net);
        counts.set(mv, (counts.get(mv) ?? 0) + 1);
        total += 1;
      }
  const out = new Map();
  for (const [mv, n] of counts) out.set(mv, n / total);
  return out;
}

const ODDS = oddsFor(0);
const MOVES = [...new Set(BINS.map((b) => b.move))].sort((a, b) => a - b);

/* ------------------------------------------------------------------ output */

const BOARD_FILE = `${spec.board.id}.svg`;
const DEPLETION_FILE = 'depletion-sheet.svg';
const svg = board();
const depSvg = depletionSheet();

const byModel = MODELS.map((m) => ({
  model: m,
  list: commodities.commodities.filter((c) => c.pricing === m.id),
}));

const pct = (n) => `${(n * 100).toFixed(1)}%`;

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the market board</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  .boards img { display: block; width: 100%; aspect-ratio: ${num(W)} / ${num(H)}; border: 1px solid ${T25};
                background: ${TALLOW}; border-radius: 10px; }
  figure { margin: 0 0 22px; }
  figcaption { font-size: 13px; color: ${T70}; margin-top: 6px; }
  .scroll { overflow-x: auto; }
  table { border-collapse: collapse; font-size: 14px; margin: 8px 0 0; }
  th, td { text-align: left; padding: 5px 14px 5px 0; border-bottom: 1px solid ${T25}; vertical-align: top; }
  th { font-family: ${SANS}; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: ${T70}; font-weight: 600; }
  td.band, td.move { font-weight: bold; font-size: 16px; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  td.dim { color: ${T55}; }
  .goods { font-size: 13px; color: ${T70}; max-width: 70ch; }
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    /* Nothing on the paper but the sheets. Naming what to hide goes stale the
       first time the page grows a heading it has not heard of - which is exactly
       how this page came to print a second page carrying three stray <h3>s - so
       this names what to KEEP instead, and cannot rot. Both sheets are A4
       landscape, which is what lets one @page rule serve them. */
    .wrap > *:not(.boards) { display: none; }
    .boards figcaption { display: none; }
    .boards figure { position: relative; width: ${M.sheet.widthMm}mm; height: ${M.sheet.heightMm}mm; overflow: hidden; margin: 0; page-break-after: always; }
    .boards img { position: absolute; left: -${M.sheet.bleedMm}mm; top: -${M.sheet.bleedMm}mm;
                  width: ${num(M.sheet.widthMm + 2 * M.sheet.bleedMm)}mm; height: ${num(M.sheet.heightMm + 2 * M.sheet.bleedMm)}mm;
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
  <a href="../ledger/index.html">The price ledger</a>
  <a href="../tiles/index.html">The building tiles</a>
  <a href="../boards/index.html">The player board</a>
  <a href="../cards/index.html">The card fronts</a>
  <a class="primary" href="#" onclick="window.print();return false;">Print both sheets →</a>
</div>
<h1>The market board</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note">${esc(spec.board.generic)}</p>
<p class="note">Generated by <code>tools/build-market.mjs</code> from <code>data/marketboard.json</code>,
<code>data/components.json</code>, the bands in <code>data/rules.json</code> and the pricing system in
<code>data/pricing.json</code> — edit those, re-run the tool, and never these files. The price itself is
not here: it is on <a href="../ledger/index.html">the price ledger</a>.</p>

<h2>The sheets</h2>
<div class="boards">
  <!-- <img>, not <object>. An <object> is a nested browsing context, and a nested
       browsing context is the one thing a print preview is not obliged to paint. -->
  <figure><img src="${BOARD_FILE}" alt="${esc(spec.board.name)}">
    <figcaption>${esc(spec.board.howMany)}</figcaption></figure>
  <figure><img src="${DEPLETION_FILE}" alt="${esc(spec.depletion.name)}">
    <figcaption>${esc(spec.depletion.howMany)}</figcaption></figure>
</div>

<h2>The swing ruler</h2>
<div class="scroll"><table>
<tr><th>Net</th><th>Cell</th><th>Steps</th></tr>
${BINS.map((b) => `<tr><td>${esc(b.label)}</td><td>${esc(b.name)}</td><td class="move">${b.move === 0 ? '—' : signed(b.move)}</td></tr>`).join('\n')}
</table></div>

<h2>What the dice actually do</h2>
<p class="note">Every roll of two blue against two red, at every face of the green, with no modifier —
${(6 ** 4 * pricing.volatility.steps.reduce((n, s) => n + s.faces.length, 0)).toLocaleString('en')} of them,
counted rather than claimed. <code>pricing.ruler.odds</code> states what the bins were cut for; this is
what they do.</p>
<div class="scroll"><table>
<tr><th>Steps</th><th>Derived</th><th>Stated</th></tr>
${MOVES.map((mv) => {
  const stated = { 0: pricing.ruler.odds.hold, 1: pricing.ruler.odds.oneBand, 2: pricing.ruler.odds.twoBands, 3: pricing.ruler.odds.threeBands }[Math.abs(mv)];
  const derived = ODDS.get(mv) ?? 0;
  const both = mv === 0 ? derived : (ODDS.get(mv) ?? 0) + (ODDS.get(-mv) ?? 0);
  /* The negative rows carry no comparison of their own: a ruler cut symmetrically
     produces symmetric odds, so the claim in pricing.ruler.odds is about the PAIR
     and is checked against the pair. The hold row is its own pair. */
  const note = mv < 0 ? '' : mv === 0 ? `stated ${pct(stated ?? 0)}` : `${pct(both)} either way · stated ${pct(stated ?? 0)}`;
  return `<tr><td class="move">${mv === 0 ? '—' : signed(mv)}</td><td class="n">${pct(derived)}</td>` +
    `<td class="n dim">${note}</td></tr>`;
}).join('\n')}
</table></div>

<h2>The ${MODELS.length} kinds of good</h2>
${byModel.map(({ model, list }) => `<h3>${esc(model.name)} — ${esc(model.line)}</h3>
<p class="note">${esc(model.history.split('\n')[0])}</p>
<p class="goods"><strong>${list.length}</strong>: ${list.map((c) => esc(c.name)).join(', ')}.</p>`).join('\n')}

<h2>The depletion ladder</h2>
<p class="note">${esc(DEP.$ladderNote ?? '')}</p>
<p class="note">A grid is ${GRID_COLS} cells by ${GRID_ROWS} rows — ${GRID_COLS * GRID_ROWS} pips to work a
seam out for good — and ${GRIDS} of them fit a sheet against the ${FINITE.length} commodities that need one.</p>
</div>
</body>
</html>
`;

const outputs = [[BOARD_FILE, svg], [DEPLETION_FILE, depSvg], ['index.html', index]];
const keep = new Set(outputs.map(([f]) => f));
const stale = existsSync(OUT_DIR)
  ? readdirSync(OUT_DIR).filter((f) => (f.endsWith('.svg') || f.endsWith('.html')) && !keep.has(f))
  : [];

if (checkOnly) {
  const drifted = [];
  for (const [file, body] of outputs) {
    try {
      if (readFileSync(join(OUT_DIR, file), 'utf8') !== body) drifted.push(file);
    } catch { drifted.push(file); /* absent counts as stale */ }
  }
  if (drifted.length || stale.length) {
    console.error(
      `docs/markets is stale (${[...drifted, ...stale.map((f) => `${f} should not exist`)].join(', ')}). ` +
      'Run: node tools/build-market.mjs'
    );
    process.exit(1);
  }
  console.log('docs/markets is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of outputs) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote docs/markets/${BOARD_FILE} — ${M.sheet.widthMm}x${M.sheet.heightMm}mm, ` +
    `${MODELS.length} panels of ${num(PANEL_W / U)}mm over a ${num(HEAD_H / U)}mm head; ` +
    `and ${DEPLETION_FILE} — ${GRIDS} grids (${GRIDS_ACROSS}x${GRIDS_DOWN}) of ` +
    `${GRID_COLS}x${GRID_ROWS} ${num(CELL / U)}mm cells for ${FINITE.length} finite commodities` +
    (stale.length ? `; removed ${stale.length} file(s) no longer built` : '')
  );
}
