#!/usr/bin/env node
/**
 * Draws the market board — one A4 landscape sheet of identical price ladders —
 * from data/marketboard.json, data/components.json and data/rules.json.
 *
 * The same bargain as tools/build-board.mjs: the data says what the board is
 * for, components.json says what shape it is drawn into, rules.json owns the
 * bands themselves, and nothing here invents a number that belongs to any of
 * the three. What this file owns is the arrangement, and even that is
 * arithmetic rather than a set of coordinates:
 *
 *   contentW - (blocks - 1) gutters                      = the blocks
 *   blockW / bands                                       = a band cell
 *   contentH - the head - the foot, over a line's height = the lines
 *
 * A seventh band narrows the cells. A bigger commodity token makes a taller
 * line and fewer of them. Nothing runs off the paper, because nothing was ever
 * placed by hand — and a cell narrower than the token it has to hold fails the
 * build rather than printing a board a hexagon overhangs.
 *
 * NOTHING ON THIS SHEET NAMES A COMMODITY. That is the whole design: a line is
 * not the grain line until somebody stands the grain token on it. Where the
 * token stands is the price; which token it is says what the price is of. One
 * board serves any commodity, any town and any table.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash carries the
 * tint down the columns, #ink carries every rule, number and letter in soot
 * alone, #grime carries the wear. Drop #wash and the bands survive, because the
 * multipliers were never the colour's job.
 *
 * Usage: node tools/build-market.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'markets');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('marketboard.json');
const rules = read('rules.json');

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
const OCHRE = palette.inks.ochre.hex;
const VERDIGRIS = palette.inks.verdigris.hex;
const OXIDE = palette.inks.oxide.hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

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

const M = components.marketBoard;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(M.sheet.bleedMm);
const W = mm(M.sheet.widthMm + 2 * M.sheet.bleedMm);
const H = mm(M.sheet.heightMm + 2 * M.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(M.sheet.widthMm), h: mm(M.sheet.heightMm) };
const CORNER = mm(M.sheet.cornerRadiusMm);
const GUT = mm(M.gutterMm);

const CONTENT = {
  x: TRIM.x + mm(M.marginMm),
  y: TRIM.y + mm(M.marginMm),
  w: TRIM.w - 2 * mm(M.marginMm),
  h: TRIM.h - 2 * mm(M.marginMm),
};

/* The bands are the market's, not the board's. */
const BANDS = rules.market.priceBands;
const START_BAND = rules.market.startingBandIndex;

/* A flat-top hexagon is widest across its CORNERS, and that is the dimension a
   cell has to clear: acrossFlats x 2/root-3. This is the one number on the sheet
   that comes from a physical piece rather than from the paper. */
const TOKEN = components.tokens.commodity;
const TOKEN_FLATS = mm(TOKEN.acrossFlatsMm);
const TOKEN_CORNERS = TOKEN_FLATS * 2 / Math.sqrt(3);

/* How many blocks of ladders fit side by side, and how many lines fit down. */
const CELL_MIN = mm(M.cell.minMm);
const BLOCKS = Math.max(1, Math.floor((CONTENT.w + GUT) / (BANDS.length * CELL_MIN + GUT)));
const BLOCK_W = (CONTENT.w - (BLOCKS - 1) * GUT) / BLOCKS;
const CELL_W = BLOCK_W / BANDS.length;

const HEAD = mm(M.headMm);
const FOOT = mm(M.footMm);
const LINE_H = TOKEN_FLATS + 2 * mm(M.line.clearanceMm);
const LADDER_TOP = CONTENT.y + HEAD;
const LINES = Math.max(1, Math.floor((CONTENT.h - HEAD - FOOT) / LINE_H));
const LADDER_H = LINES * LINE_H;

if (CELL_W < TOKEN_CORNERS) {
  throw new Error(
    `a band cell is ${num(CELL_W / U)}mm and a ${TOKEN.acrossFlatsMm}mm commodity token is ` +
    `${num(TOKEN_CORNERS / U)}mm across the corners - the token would overhang its cell`
  );
}

const blockX = (i) => CONTENT.x + i * (BLOCK_W + GUT);

/* ---------------------------------------------------------------- utilities */

function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

/** Deterministic noise — the grain has to be the same grain every run, or
    --check would fail on a board nobody had touched. */
function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Sawn boards the length of the sheet: the same workbench the player board is. */
function timber(seed) {
  const rand = rng(`timber-${seed}`);
  const t = M.timber;
  const step = mm(t.boardWidthMm);
  const out = [];
  for (let y = TRIM.y + step; y < TRIM.y + TRIM.h - 4; y += step) {
    out.push(`<path d="M ${num(TRIM.x)},${num(y)} H ${num(TRIM.x + TRIM.w)}" stroke="${T25}" stroke-width="${t.seamStrokeWidth}"/>`);
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

/* ------------------------------------------------------------- board pieces */

/**
 * One block of ladders: a head row of band multipliers, and `LINES` identical
 * rows of band cells under it.
 *
 * The columns wash from cheap to dear — verdigris at the bottom of the market
 * and ochre at the top — so a token drifting up the board is visibly drifting
 * towards money, and the multiplier under it says by how much. Drop the wash
 * and the multipliers are still there.
 */
function block(i) {
  const x = blockX(i);
  const wash = [];
  const ink = [];

  BANDS.forEach((band, b) => {
    const cx = x + b * CELL_W;
    const t = BANDS.length === 1 ? 0 : b / (BANDS.length - 1);
    const tint = band < 1 ? VERDIGRIS : band > 1 ? OCHRE : T25;
    wash.push(
      `<rect x="${num(cx)}" y="${num(LADDER_TOP)}" width="${num(CELL_W)}" height="${num(LADDER_H)}" ` +
      `fill="${tint}" opacity="${num(0.10 + 0.20 * Math.abs(t - 0.5) * 2)}"/>`
    );

    /* The head: the multiplier, and nothing under it but the word START where
       the tokens begin. "of base value" belongs in the foot, said once, rather
       than under all twelve columns saying it twelve times. */
    ink.push(
      `<text x="${num(cx + CELL_W / 2)}" y="${num(CONTENT.y + mm(8))}" font-size="${num(mm(4.6))}" text-anchor="middle" ` +
      `font-family="${SANS}" font-weight="bold">&#215;${band}</text>` +
      (b === START_BAND
        ? `<text x="${num(cx + CELL_W / 2)}" y="${num(CONTENT.y + mm(12.2))}" font-size="${num(mm(2.1))}" text-anchor="middle" ` +
          `letter-spacing="${num(mm(0.24))}" font-family="${SANS}" fill="${T55}">START</text>`
        : '')
    );

    /* column edges, and the starting band ruled heavier on both sides */
    const heavy = b === START_BAND || b === START_BAND + 1;
    if (b > 0) {
      ink.push(
        `<path d="M ${num(cx)},${num(CONTENT.y + mm(2))} V ${num(LADDER_TOP + LADDER_H)}" stroke="${SOOT}" ` +
        `stroke-width="${heavy ? M.startBandRule.strokeWidth : M.line.bandStrokeWidth}" opacity="${heavy ? 1 : 0.6}"/>`
      );
    }
  });

  /* the lines: a token-tall row each, ruled the whole width of the block */
  for (let r = 0; r < LINES; r++) {
    const y = LADDER_TOP + r * LINE_H;
    if (r > 0) {
      ink.push(`<path d="M ${num(x)},${num(y)} H ${num(x + BLOCK_W)}" stroke="${SOOT}" stroke-width="${M.line.bandStrokeWidth}" opacity="0.55"/>`);
    }
    /* the seat is drawn, not cut: a hairline hexagon in the starting band, the
       size of the token that belongs in it, so setup is a shape-matching job */
    const cx = x + START_BAND * CELL_W + CELL_W / 2;
    ink.push(
      `<path d="${hexPath(cx, y + LINE_H / 2, TOKEN_FLATS * 0.92)}" fill="none" stroke="${T40}" stroke-width="0.8" opacity="0.75"/>`
    );
  }

  ink.push(
    `<rect x="${num(x)}" y="${num(LADDER_TOP)}" width="${num(BLOCK_W)}" height="${num(LADDER_H)}" ` +
    `rx="${num(mm(1.2))}" fill="none" stroke="${SOOT}" stroke-width="${M.line.strokeWidth}"/>`
  );
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/**
 * The foot: the three lines a market board has to say out loud, printed from
 * data rather than written here, plus the board's own name where a maker's mark
 * would have gone.
 */
function foot() {
  const y = CONTENT.y + CONTENT.h - FOOT;
  const out = [];
  out.push(`<path d="M ${num(CONTENT.x)},${num(y)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="1.2"/>`);
  out.push(
    `<text x="${num(CONTENT.x)}" y="${num(y + mm(4.4))}" font-size="${num(mm(2.9))}" letter-spacing="${num(mm(0.8))}" ` +
    `font-family="${SANS}" fill="${T70}">${esc(spec.panel.title)}</text>`
  );
  spec.panel.lines.forEach((line, i) => {
    out.push(`<text x="${num(CONTENT.x + mm(34))}" y="${num(y + mm(3.4) + i * mm(3.1))}" font-size="${num(mm(2.5))}">${esc(line)}</text>`);
  });
  out.push(
    `<text x="${num(CONTENT.x + CONTENT.w)}" y="${num(y + mm(4.4))}" font-size="${num(mm(2.5))}" text-anchor="end" ` +
    `font-style="italic" fill="${T85}">${esc(spec.panel.foot)}</text>`
  );
  out.push(
    `<text x="${num(CONTENT.x + CONTENT.w)}" y="${num(y + mm(9.4))}" font-size="${num(mm(2.3))}" text-anchor="end" ` +
    `letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T40}">game1 &#183; ${esc(spec.board.name.toUpperCase())}</text>`
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

/** Press wear: a foxed corner, a ring where somebody put a cup down, specks. */
function grime(seed) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 8 }, () =>
    `<circle cx="${num(TRIM.x + rand() * TRIM.w)}" cy="${num(TRIM.y + rand() * TRIM.h)}" r="${num(1 + rand() * 1.6)}"/>`
  ).join('');
  return (
    dieMarks() +
    `<path d="M ${num(TRIM.x + TRIM.w)},${num(TRIM.y)} H ${num(TRIM.x + TRIM.w - mm(24))} Q ${num(TRIM.x + TRIM.w - mm(9))},${num(TRIM.y + mm(11))} ${num(TRIM.x + TRIM.w)},${num(TRIM.y + mm(22))} Z" fill="${SOOT}" opacity="0.03"/>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>` +
    `<circle cx="${num(CONTENT.x + CONTENT.w * 0.34)}" cy="${num(CONTENT.y + CONTENT.h * 0.62)}" r="${num(mm(8.5))}" fill="none" stroke="${FOXING}" stroke-width="3.4" opacity="0.5"/>`
  );
}

/* --------------------------------------------------------------- the board */

function board() {
  const blocks = Array.from({ length: BLOCKS }, (_, i) => block(i));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.board.name)}</title>
<desc>${esc(spec.board.summary)} ${BLOCKS * LINES} identical price lines of ${BANDS.length} bands, and nothing on the sheet names a commodity: the token standing on a line is both the label and the reading. Generated by tools/build-market.mjs from data/marketboard.json, data/components.json and data/rules.json — do not edit. ${M.sheet.widthMm} x ${M.sheet.heightMm} mm at ${U} units/mm, ${M.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${blocks.map((b) => b.wash).join('\n  ')}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the workbench itself: sawn boards the length of the sheet, running to the
       edge, because there is no border for them to stop at -->
  <g clip-path="url(#sheet)">
    ${timber(spec.board.id)}
  </g>

  <!-- the ladders: identical, unnamed, and read left to right -->
  ${blocks.map((b) => b.ink).join('\n  ')}

  ${foot()}
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
<title>game1 — the market board</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  .boards object { width: 100%; aspect-ratio: ${num(W)} / ${num(H)}; border: 1px solid ${T25};
                   background: ${TALLOW}; border-radius: 10px; }
  figure { margin: 0; }
  table { border-collapse: collapse; font-size: 14px; margin: 8px 0 0; }
  th, td { text-align: left; padding: 5px 14px 5px 0; border-bottom: 1px solid ${T25}; vertical-align: top; }
  th { font-family: ${SANS}; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: ${T70}; font-weight: 600; }
  td.band { font-weight: bold; font-size: 16px; }
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    .bar, h1, h2, p.note, table { display: none; }
    .boards figure { position: relative; width: ${M.sheet.widthMm}mm; height: ${M.sheet.heightMm}mm; overflow: hidden; }
    .boards object { position: absolute; left: -${M.sheet.bleedMm}mm; top: -${M.sheet.bleedMm}mm;
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
  <a href="../boards/index.html">The player board</a>
  <a href="../cards/index.html">The card fronts</a>
  <a class="primary" href="#" onclick="window.print();return false;">Print the board →</a>
</div>
<h1>The market board</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note">${esc(spec.board.generic)}</p>
<p class="note">Generated by <code>tools/build-market.mjs</code> from <code>data/marketboard.json</code>,
<code>data/components.json</code> and the bands in <code>data/rules.json</code> — edit those, re-run the tool, and
never this file. ${esc(spec.board.howMany)} Print at 100% and landscape with "fit to page" off, and the
${M.sheet.bleedMm}&nbsp;mm of bleed runs off the edge of the paper, which is the only place bleed is any use.</p>

<h2>The ${BANDS.length} bands</h2>
<table>
<tr><th>Band</th><th>Price</th><th></th></tr>
${BANDS.map((b, i) => `<tr><td class="band">&times;${b}</td><td>base value &times; ${b}</td><td>${i === START_BAND ? 'where every token starts' : ''}</td></tr>`).join('\n')}
</table>
<p class="note">${esc(spec.line.reads)}</p>

<h2>The board</h2>
<div class="boards">
  <figure><object data="${BOARD_FILE}" type="image/svg+xml" aria-label="The market board"></object></figure>
</div>
</div>
</body>
</html>
`;

const outputs = [[BOARD_FILE, svg], ['index.html', index]];
const keep = new Set(outputs.map(([f]) => f));
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
    console.error(`docs/markets is stale (${[...drifted, ...stale.map((f) => f + ' should not exist')].join(', ')}). Run: node tools/build-market.mjs`);
    process.exit(1);
  }
  console.log('docs/markets is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of outputs) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote docs/markets/${BOARD_FILE} — ${M.sheet.widthMm}x${M.sheet.heightMm}mm, ` +
    `${BLOCKS} block(s) of ${LINES} lines = ${BLOCKS * LINES} price lines, ` +
    `${BANDS.length} bands at ${num(CELL_W / U)}x${num(LINE_H / U)}mm ` +
    `(a ${TOKEN.acrossFlatsMm}mm token is ${num(TOKEN_CORNERS / U)}mm across the corners)`
  );
}
