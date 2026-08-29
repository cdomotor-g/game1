#!/usr/bin/env node
/**
 * Draws the price ledger — one A4 PORTRAIT sheet — from data/ledger.json,
 * data/components.json, data/rules.json and data/pricing.json.
 *
 * This is the only place in the game where a price lives.
 *
 * Prices used to be on a board: six lines, a token standing on one of six bands,
 * and the price was that band's multiplier times the commodity's base value — a
 * sum somebody did in their head every time anybody asked what grain was worth.
 * What the table could actually SEE at the end of all that was a token standing
 * on a cell. Not a price. Not last round's price. Not whether the price had been
 * climbing for four rounds, which is precisely the thing anybody trading would
 * want to know.
 *
 * A ledger is what merchants used instead, and it is better at all three.
 *
 * THE FIGURES ARE HOLLOW AND THE PLAYERS COLOUR THEM IN. Three seven-segment
 * digits per cell, printed as outlines and filled with a pencil, which is a
 * stranger idea on paper than it sounds and is right for three reasons. A written
 * number is somebody's handwriting and gets argued about across a table; a filled
 * figure is a figure. Colouring seven bars is fast and is EXACTLY as fast for 188
 * as for 8, where writing is not. And a wrong digit is corrected by filling one
 * more segment rather than by rubbing out — which is what lets the whole sheet be
 * worked in pencil at speed, and what makes a struck-through figure still
 * perfectly readable where struck handwriting is a smudge.
 *
 * Nothing here is a coordinate. Every number is derived:
 *
 *   contentW - the round gutter                      = the usable width
 *   token corners + pad + move box + gap             = the least a column can be
 *   usable width over that                           = how many commodities fit
 *   contentH - head - foot, over the game's rounds   = a row
 *   a row less its padding                           = a digit's height
 *   digitH/2 + thickness/2                           = a digit's WIDTH
 *
 * That last one is not a taste. For all seven segment bars to come out the same
 * length — which is the whole visual argument of a seven-segment figure — the
 * width has to be exactly h/2 + t/2. Type a width instead and six of the seven
 * bars are subtly wrong and nobody can say why.
 *
 * And the row height has teeth. A longer game means more rows means shorter rows
 * means smaller figures, and below `digit.minHeightMm` the sheet stops being
 * something anybody can colour in. That fails the build, naming the game length
 * as the cause, because the answer is a second sheet and never smaller figures.
 *
 * NO COMMODITY IS NAMED ON IT, and no band is tracked on it. A column is not the
 * grain column until somebody stands the grain token in the seat at its head. And
 * every commodity's six prices are printed as one row of six figures in the annex,
 * so a price move is a STEP ALONG THAT ROW — which is what let the price ladder
 * come off the market board with nothing replacing it.
 *
 * Two plates (docs/art/01-two-plate-system.md): #wash is the paper and almost
 * nothing else, because a sheet that is written on has to survive being
 * photocopied; #ink carries every rule, figure and outline in soot alone;
 * #grime carries the wear.
 *
 * Usage: node tools/build-ledger.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'ledger');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('ledger.json');
const rules = read('rules.json');
const pricing = read('pricing.json');
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

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/* ------------------------------------------------------------- the geometry */

const L = components.ledger;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(L.sheet.bleedMm);
const W = mm(L.sheet.widthMm + 2 * L.sheet.bleedMm);
const H = mm(L.sheet.heightMm + 2 * L.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(L.sheet.widthMm), h: mm(L.sheet.heightMm) };
const CORNER = mm(L.sheet.cornerRadiusMm);

const CONTENT = {
  x: TRIM.x + mm(L.marginMm),
  y: TRIM.y + mm(L.marginMm),
  w: TRIM.w - 2 * mm(L.marginMm),
  h: TRIM.h - 2 * mm(L.marginMm),
};

const TOKEN = components.tokens.commodity;
const TOKEN_FLATS = mm(TOKEN.acrossFlatsMm);
const TOKEN_CORNERS = TOKEN_FLATS * 2 / Math.sqrt(3);

/* A COLUMN is at least as wide as the token that heads it plus the move box
   beside its figures — the same argument that made a market line one token tall,
   one storey along. */
const ROUND_GUT = mm(L.roundGutterMm);
const PAD = mm(L.column.padMm);
const GAP = mm(L.column.gapMm);
const MOVE_W = mm(L.column.moveBoxMm);
const USABLE_W = CONTENT.w - ROUND_GUT;
const COL_MIN = TOKEN_CORNERS + 2 * PAD + MOVE_W + GAP;
const COLS = Math.floor(USABLE_W / COL_MIN);
const COL_W = COLS > 0 ? USABLE_W / COLS : 0;

/* A ROW is a ROUND, and the number of them is the game's own length — which is
   the honest count, because the market rolls once a round and a price can change
   at most that many times. It also makes `the row above` mean exactly one thing,
   which the sought good's rule depends on. */
const HEAD_H = mm(L.head.heightMm);
const FOOT_H = mm(L.foot.heightMm);
const ROWS = rules.victory.gameLengthRounds;
const ROWS_H = CONTENT.h - HEAD_H - FOOT_H;
const ROW_H = ROWS_H / ROWS;

/* THE DIGIT. One number and three ratios of it, and the width is DERIVED. */
const DIGIT_H = ROW_H - 2 * mm(L.row.padMm);
const SEG_T = L.digit.thicknessPerHeight * DIGIT_H;
const SEG_G = L.digit.gapPerHeight * DIGIT_H;
const DIGIT_W = DIGIT_H / 2 + SEG_T / 2;
const DIGIT_GAP = L.digit.digitGapPerHeight * DIGIT_H;
const GROUP_W = L.digit.count * DIGIT_W + (L.digit.count - 1) * DIGIT_GAP;

if (COLS < 1) {
  throw new Error(
    `a column needs ${num(COL_MIN / U)}mm - a ${TOKEN.acrossFlatsMm}mm token is ${num(TOKEN_CORNERS / U)}mm ` +
    `across the corners, plus a ${L.column.moveBoxMm}mm move box - and the sheet has ${num(USABLE_W / U)}mm. ` +
    'Not one commodity fits.'
  );
}
if (DIGIT_H < mm(L.digit.minHeightMm)) {
  throw new Error(
    `${ROWS} rounds is ${ROWS} rows, which leaves a ${num(DIGIT_H / U)}mm digit against a ` +
    `${L.digit.minHeightMm}mm floor. The cause is rules.json victory.gameLengthRounds: a longer game ` +
    'wants a second sheet, not smaller figures - below the floor a segment is thinner than a pencil ' +
    'stroke and the sheet stops being fillable.'
  );
}
{
  const room = COL_W - 2 * PAD - MOVE_W - GAP;
  if (GROUP_W > room) {
    throw new Error(
      `${L.digit.count} figures come to ${num(GROUP_W / U)}mm and a ${num(COL_W / U)}mm column leaves ` +
      `${num(room / U)}mm beside the move box.`
    );
  }
}
if (COL_W < TOKEN_CORNERS) {
  throw new Error(`a column is ${num(COL_W / U)}mm and the token that heads it is ${num(TOKEN_CORNERS / U)}mm across the corners`);
}

/* ---------------------------------------------------------------- utilities */

function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

const text = (x, y, size, body, attrs = '') =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${num(size)}" ${attrs}>${body}</text>`;

const caption = (x, y, body, { fill = T55, size = mm(2.2), anchor = 'start' } = {}) =>
  text(x, y, size, esc(body), `text-anchor="${anchor}" letter-spacing="${num(mm(0.26))}" font-family="${SANS}" fill="${fill}"`);

/** Deterministic noise — the grain has to be the same grain every run, or
    --check would fail on a sheet nobody had touched. */
function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Sawn boards the length of the sheet. This one is portrait, so the seams run
    UP it — every component in the game has its grain the long way, and a sheet
    that turned would be a different piece of timber. */
function timber(seed) {
  const rand = rng(`timber-${seed}`);
  const t = L.timber;
  const step = mm(t.boardWidthMm);
  const out = [];
  for (let x = TRIM.x + step; x < TRIM.x + TRIM.w - 4; x += step) {
    out.push(`<path d="M ${num(x)},${num(TRIM.y)} V ${num(TRIM.y + TRIM.h)}" stroke="${T25}" stroke-width="${t.seamStrokeWidth}"/>`);
    for (let i = 0; i < 4; i++) {
      const gx = x - step + step * ((i + 0.6 + rand() * 0.5) / 4.6);
      const bow = (rand() - 0.5) * mm(2.2);
      out.push(
        `<path d="M ${num(gx)},${num(TRIM.y)} Q ${num(gx + bow)},${num(TRIM.y + TRIM.h / 2)} ${num(gx)},${num(TRIM.y + TRIM.h)}" ` +
        `stroke="${T12}" stroke-width="${t.grainStrokeWidth}"/>`
      );
    }
  }
  for (let k = 0; k < t.knots; k++) {
    const kx = TRIM.x + mm(14) + rand() * (TRIM.w - mm(28));
    const ky = TRIM.y + mm(20) + rand() * (TRIM.h - mm(40));
    for (let r = 1; r <= 2; r++) {
      out.push(`<ellipse cx="${num(kx)}" cy="${num(ky)}" rx="${num(r * mm(0.7))}" ry="${num(r * mm(1.3))}" stroke="${T25}" stroke-width="${t.grainStrokeWidth}"/>`);
    }
  }
  return `<g fill="none" opacity="${t.grainOpacity}">\n    ${out.join('\n    ')}\n  </g>`;
}

/** A flat-top hexagon, the shape a commodity token is cut to. */
function hexPath(cx, cy, acrossFlats) {
  const R = acrossFlats / Math.sqrt(3);
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push(`${num(cx + R * Math.cos(a))},${num(cy + R * Math.sin(a))}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

/** One kind-of-good mark, drawn the way the market board draws it. */
function markGroup(model, x, y, size) {
  const s = components.marks.pricing;
  const k = size / 24;
  return (
    `<g transform="translate(${num(x)} ${num(y)}) scale(${num(k)})" fill="${s.fill}" stroke="${SOOT}" ` +
    `stroke-width="${s.strokeWidth}" stroke-linecap="${s.strokeLinecap}" stroke-linejoin="${s.strokeLinejoin}">` +
    `<path d="${model.mark.path}"/></g>`
  );
}

/* ------------------------------------------------------ the seven segments */

/**
 * One hollow seven-segment figure, drawn at x,y in a DIGIT_W x DIGIT_H box.
 *
 * ALL SEVEN SEGMENTS ARE ALWAYS DRAWN, and that is not laziness. An unlit
 * segment is what makes a hollow figure read as a NUMBER WAITING rather than as
 * an abstract shape — take them away and a 1 is two bars floating in space.
 * Drawing only the lit ones would also mean this tool knew what the price was,
 * which it emphatically must not: the sheet is printed before anybody has rolled
 * anything, and the whole point is that the players put the number there.
 *
 * The segments are MITRED BARS — hexagons with 45-degree ends — which is how a
 * seven-segment display has been drawn since somebody first drew one, and the
 * reason is geometric rather than decorative: mitres are what let seven identical
 * bars meet at six corners without overlapping. `gap` is the clearance at each
 * mitre, and without it a filled 8 comes out as one solid block.
 */
function digit(x, y) {
  const s = SEG_T / 2;
  const g = SEG_G;
  const xL = x + s;
  const xR = x + DIGIT_W - s;
  const yA = y + s;
  const yG = y + DIGIT_H / 2;
  const yD = y + DIGIT_H - s;

  const horiz = (yc) =>
    `M ${num(xL + g)},${num(yc)} L ${num(xL + g + s)},${num(yc - s)} L ${num(xR - g - s)},${num(yc - s)} ` +
    `L ${num(xR - g)},${num(yc)} L ${num(xR - g - s)},${num(yc + s)} L ${num(xL + g + s)},${num(yc + s)} Z`;
  const vert = (xc, y0, y1) =>
    `M ${num(xc)},${num(y0 + g)} L ${num(xc + s)},${num(y0 + g + s)} L ${num(xc + s)},${num(y1 - g - s)} ` +
    `L ${num(xc)},${num(y1 - g)} L ${num(xc - s)},${num(y1 - g - s)} L ${num(xc - s)},${num(y0 + g + s)} Z`;

  /* fill:none on the group, not on the paths - the ink plate is `fill="soot"`
     and a segment that inherited it would print SOLID, which is the one thing a
     figure waiting to be coloured in must not be. */
  const paths = [
    horiz(yA), horiz(yG), horiz(yD),
    vert(xL, yA, yG), vert(xR, yA, yG),
    vert(xL, yG, yD), vert(xR, yG, yD),
  ].map((d) => `<path d="${d}"/>`).join('');
  return `<g fill="none" stroke="${SOOT}" stroke-width="${num(mm(L.digit.outlineStrokeMm))}" opacity="0.85">${paths}</g>`;
}

/* ------------------------------------------------------------- sheet pieces */

const COLS_X = (i) => CONTENT.x + ROUND_GUT + i * COL_W;

/** The head: one hexagonal seat per column, and the sheet's name. Nothing else. */
function head() {
  const out = [
    caption(CONTENT.x, CONTENT.y + mm(L.head.titleMm * 0.8), spec.head.title, { fill: SOOT, size: mm(L.head.titleMm) }),
    text(CONTENT.x + CONTENT.w, CONTENT.y + mm(L.head.titleMm * 0.8), mm(2.4),
      esc('Colour the figure in. Strike it through when it changes and fill the next one below.'),
      `text-anchor="end" font-style="italic" fill="${T85}"`),
  ];
  const seatFlats = TOKEN_FLATS + 2 * mm(L.head.seatClearanceMm);
  const seatY = CONTENT.y + HEAD_H - seatFlats / 2 - mm(2);
  for (let i = 0; i < COLS; i++) {
    out.push(
      `<path d="${hexPath(COLS_X(i) + COL_W / 2, seatY, seatFlats)}" fill="none" stroke="${T40}" ` +
      `stroke-width="${L.head.seatStrokeWidth}" opacity="0.75"/>`
    );
  }
  out.push(caption(CONTENT.x, CONTENT.y + HEAD_H - mm(1), 'RD', { fill: T55, size: mm(2) }));
  out.push(`<path d="M ${num(CONTENT.x)},${num(CONTENT.y + HEAD_H)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${L.column.dividerStrokeWidth}"/>`);
  return out.join('\n    ');
}

/** The grid: rows down the left, and COLS x ROWS cells of three hollow figures. */
function body() {
  const top = CONTENT.y + HEAD_H;
  const out = [];

  /* The round numbers, once, down the left-hand edge. A row label belongs at the
     end of its row, not repeated in every column - which is what handed each
     column nine millimetres back. */
  for (let r = 0; r < ROWS; r++) {
    const y = top + r * ROW_H;
    const major = (r + 1) % L.row.ruleEvery === 0;
    out.push(
      `<path d="M ${num(CONTENT.x)},${num(y)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" ` +
      `stroke-width="${major ? L.column.dividerStrokeWidth : L.row.ruleStrokeWidth}" opacity="${major ? 0.55 : 0.35}"/>`,
      text(CONTENT.x + ROUND_GUT - mm(2), y + ROW_H * 0.68, mm(L.row.numberMm), String(r + 1),
        `text-anchor="end" font-family="${SANS}"${major ? ' font-weight="bold"' : ` fill="${T70}"`}`)
    );
  }
  out.push(`<path d="M ${num(CONTENT.x)},${num(top + ROWS * ROW_H)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${L.column.dividerStrokeWidth}"/>`);

  /* The column rules, full height, so the eye never loses which market it is in. */
  for (let i = 0; i <= COLS; i++) {
    const x = COLS_X(i);
    out.push(`<path d="M ${num(x)},${num(top)} V ${num(top + ROWS * ROW_H)}" stroke="${SOOT}" stroke-width="${L.column.dividerStrokeWidth}" opacity="0.55"/>`);
  }

  /* The cells. */
  for (let i = 0; i < COLS; i++) {
    const cx = COLS_X(i);
    for (let r = 0; r < ROWS; r++) {
      const y = top + r * ROW_H + mm(L.row.padMm);
      const gx = cx + PAD;
      for (let d = 0; d < L.digit.count; d++) {
        out.push(digit(gx + d * (DIGIT_W + DIGIT_GAP), y));
      }
      const bx = cx + COL_W - PAD - MOVE_W;
      out.push(
        `<rect x="${num(bx)}" y="${num(y + DIGIT_H * 0.18)}" width="${num(MOVE_W)}" height="${num(DIGIT_H * 0.64)}" ` +
        `rx="${num(mm(0.6))}" fill="none" stroke="${SOOT}" stroke-width="${L.column.moveBoxStrokeWidth}" opacity="0.45"/>`
      );
    }
  }
  return out.join('\n    ');
}

/** The foot: the four kind-of-good marks, so a token's corner can be read here. */
function foot() {
  const y = CONTENT.y + CONTENT.h - FOOT_H;
  const models = pricing.models;
  const cw = CONTENT.w / models.length;
  const size = mm(L.foot.markMm);
  const out = [
    `<path d="M ${num(CONTENT.x)},${num(y)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${L.foot.ruleStrokeWidth}"/>`,
    caption(CONTENT.x, y + mm(3.2), spec.foot.title, { fill: T70, size: mm(L.foot.titleMm) }),
  ];
  models.forEach((m, i) => {
    const x = CONTENT.x + i * cw;
    const top = y + mm(4.4);
    out.push(markGroup(m, x, top, size));
    out.push(text(x + size + mm(1.6), top + mm(3), mm(2.6), esc(m.name), 'font-weight="bold"'));
    out.push(text(x + size + mm(1.6), top + mm(6), mm(L.foot.lineMm), esc(m.line), `fill="${T85}"`));
  });
  out.push(caption(CONTENT.x + CONTENT.w, y + FOOT_H - mm(0.8), `game1 · ${spec.sheet.name.toUpperCase()}`, { anchor: 'end', size: mm(2.2), fill: T40 }));
  return out.join('\n    ');
}

/** Where the die goes, marked in the bleed and never on the sheet. */
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

/** Press wear: a foxed corner and specks. No rings — see CLAUDE.md. */
function grime(seed) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 7 }, () =>
    `<circle cx="${num(TRIM.x + rand() * TRIM.w)}" cy="${num(TRIM.y + rand() * TRIM.h)}" r="${num(1 + rand() * 1.4)}"/>`
  ).join('');
  return (
    dieMarks() +
    `<path d="M ${num(TRIM.x)},${num(TRIM.y + TRIM.h)} V ${num(TRIM.y + TRIM.h - mm(22))} Q ${num(TRIM.x + mm(9))},${num(TRIM.y + TRIM.h - mm(9))} ${num(TRIM.x + mm(22))},${num(TRIM.y + TRIM.h)} Z" fill="${SOOT}" opacity="0.03"/>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>`
  );
}

/* ---------------------------------------------------------------- the sheet */

function sheet() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.sheet.name)}</title>
<desc>${esc(spec.sheet.summary)} ${COLS} commodity columns of ${num(COL_W / U)}mm by ${ROWS} rounds of ${num(ROW_H / U)}mm, every cell ${L.digit.count} hollow seven-segment figures ${num(DIGIT_W / U)} x ${num(DIGIT_H / U)}mm to be filled in with a pencil, and a ${L.column.moveBoxMm}mm move box beside them. No commodity is named on it and no band is tracked on it: a column is not the grain column until somebody stands the grain token in the seat at its head. Generated by tools/build-ledger.mjs from data/ledger.json and data/components.json - do not edit. ${L.sheet.widthMm} x ${L.sheet.heightMm} mm at ${U} units/mm, ${L.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <g clip-path="url(#sheet)">
    ${timber(spec.sheet.id)}
  </g>

  <!-- the head: a seat per column, and nothing else -->
  ${head()}

  <!-- the grid: rounds down the side, hollow figures in every cell -->
  ${body()}

  <!-- the foot: what the mark in a token's corner means -->
  ${foot()}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(spec.sheet.id)}
</g>
</svg>
`;
}

/* ------------------------------------------------------------------ output */

const SHEET_FILE = `${spec.sheet.id}.svg`;
const svg = sheet();

const bands = rules.market.priceBands;
const priceRow = (c) => bands.map((b) => Math.max(1, Math.round(c.baseValue * b)));
const widest = Math.max(...commodities.commodities.map((c) => Math.max(...priceRow(c))));

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the price ledger</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1000px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  .boards img { display: block; width: 100%; max-width: 620px; aspect-ratio: ${num(W)} / ${num(H)};
                border: 1px solid ${T25}; background: ${TALLOW}; border-radius: 10px; }
  figure { margin: 0; }
  .scroll { overflow-x: auto; }
  table { border-collapse: collapse; font-size: 14px; margin: 8px 0 0; }
  th, td { text-align: left; padding: 4px 12px 4px 0; border-bottom: 1px solid ${T25}; vertical-align: top; }
  th { font-family: ${SANS}; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: ${T70}; font-weight: 600; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  td.dim { color: ${T55}; }
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    /* Names what to KEEP, not what to hide - a hide list goes stale the first
       time the page grows a heading it has not heard of. */
    .wrap > *:not(.boards) { display: none; }
    .boards figure { position: relative; width: ${L.sheet.widthMm}mm; height: ${L.sheet.heightMm}mm; overflow: hidden; }
    .boards img { position: absolute; left: -${L.sheet.bleedMm}mm; top: -${L.sheet.bleedMm}mm; max-width: none;
                  width: ${num(L.sheet.widthMm + 2 * L.sheet.bleedMm)}mm; height: ${num(L.sheet.heightMm + 2 * L.sheet.bleedMm)}mm;
                  border: 0; border-radius: 0; aspect-ratio: auto; }
    @page { size: A4 portrait; margin: 0; }
  }
</style>
</head>
<body>
<div class="wrap">
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <a href="../markets/index.html">The market board</a>
  <a href="../boards/index.html">The player board</a>
  <a href="../cards/index.html">The card fronts</a>
  <a class="primary" href="#" onclick="window.print();return false;">Print the ledger →</a>
</div>
<h1>The price ledger</h1>
<p class="note">${esc(spec.sheet.summary)}</p>
<p class="note">${esc(spec.sheet.generic)}</p>
<p class="note">Generated by <code>tools/build-ledger.mjs</code> from <code>data/ledger.json</code> and
<code>data/components.json</code> — edit those, re-run the tool, and never these files. Print it fresh for
every game: it is one of two components in the box that are used up by being used, and the other is the
depletion sheet.</p>

<h2>The sheet</h2>
<div class="boards">
  <figure><img src="${SHEET_FILE}" alt="${esc(spec.sheet.name)}"></figure>
</div>

<h2>How a price moves</h2>
<p class="note">${esc(spec.column.moveBox.$comment.split('\n')[0])}</p>
<ol class="note">
  <li>Roll two blue, two red and one green for the column. Net = ${esc(pricing.formula.net)}.</li>
  <li>Find the net on the swing ruler; it says how many places to step.</li>
  <li>Step that many places along the commodity's own printed row of six prices, below.</li>
  <li>Strike the figure in the row above and fill in the one you landed on. Write the step in the move box.</li>
</ol>

<h2>Every price in the game</h2>
<p class="note">The six bands worked out for every commodity, so a move is a step along a printed row and
never a multiplication. The dearest price the game can produce is <strong>${widest}</strong>, which is
why the ledger prints ${L.digit.count} figures and not four.</p>
<div class="scroll"><table>
<tr><th>Commodity</th><th>Kind</th>${bands.map((b) => `<th class="n">×${b}</th>`).join('')}</tr>
${commodities.commodities.map((c) => {
  const model = pricing.models.find((m) => m.id === c.pricing);
  return `<tr><td>${esc(c.name)}</td><td class="dim">${esc(model ? model.name : c.pricing)}</td>` +
    priceRow(c).map((p) => `<td class="n">${p}</td>`).join('') + '</tr>';
}).join('\n')}
</table></div>
</div>
</body>
</html>
`;

const outputs = [[SHEET_FILE, svg], ['index.html', index]];
const keep = new Set(outputs.map(([f]) => f));
const stale = existsSync(OUT_DIR)
  ? readdirSync(OUT_DIR).filter((f) => (f.endsWith('.svg') || f.endsWith('.html')) && !keep.has(f))
  : [];

if (checkOnly) {
  const drifted = [];
  for (const [file, body2] of outputs) {
    try {
      if (readFileSync(join(OUT_DIR, file), 'utf8') !== body2) drifted.push(file);
    } catch { drifted.push(file); }
  }
  if (drifted.length || stale.length) {
    console.error(
      `docs/ledger is stale (${[...drifted, ...stale.map((f) => `${f} should not exist`)].join(', ')}). ` +
      'Run: node tools/build-ledger.mjs'
    );
    process.exit(1);
  }
  console.log('docs/ledger is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body2] of outputs) writeFileSync(join(OUT_DIR, file), body2, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote docs/ledger/${SHEET_FILE} — ${L.sheet.widthMm}x${L.sheet.heightMm}mm, ` +
    `${COLS} columns of ${num(COL_W / U)}mm x ${ROWS} rounds of ${num(ROW_H / U)}mm, ` +
    `${L.digit.count} figures of ${num(DIGIT_W / U)}x${num(DIGIT_H / U)}mm (floor ${L.digit.minHeightMm}mm), ` +
    `dearest price in the game ${widest}` +
    (stale.length ? `; removed ${stale.length} file(s) no longer built` : '')
  );
}
