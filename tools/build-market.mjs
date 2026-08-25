#!/usr/bin/env node
/**
 * Draws the market board — one A4 landscape sheet of identical market lines —
 * from data/marketboard.json, data/components.json, data/rules.json and
 * data/pricing.json.
 *
 * The same bargain as tools/build-board.mjs: the data says what the board is
 * for, components.json says what shape it is drawn into, rules.json owns the
 * bands and pricing.json owns the system, and nothing here invents a number
 * that belongs to any of the four. What this file owns is the arrangement, and
 * even that is arithmetic rather than a set of coordinates:
 *
 *   bar diameter + its clearance either side        = a strip cell
 *   tally cells + modifier cells + two gutters      = the strips
 *   contentW - the strips, over the bands           = a band cell
 *   the foot's rows plus a gap above each           = the foot
 *   contentH - the head - the foot, over a line     = the lines
 *
 * A seventh band narrows the band cells. An eighth ruler bin narrows the ruler.
 * A wider memory track narrows the ladder. A bigger commodity token makes a
 * taller line and fewer of them. Nothing runs off the paper, because nothing
 * was ever placed by hand — and a cell narrower than the piece it has to hold
 * fails the build rather than printing a board a hexagon overhangs.
 *
 * NOTHING ON THIS SHEET NAMES A COMMODITY. That is still the whole design: a
 * line is not the grain line until somebody stands the grain token on it. Where
 * the token stands is the price, which token it is says what the price is of,
 * and the model mark in its corner says which of the three rules the strips on
 * that line are running under. One board serves any commodity, any town, any
 * table.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash carries the
 * tint down the columns and the colour of the three dice, #ink carries every
 * rule, number, mark and letter in soot alone, #grime carries the wear. Drop
 * #wash and the board still plays, because the multipliers, the ruler and the
 * dice letters were never the colour's job.
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
const commodities = read('commodities.json');

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

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));
/* A proper minus, not a hyphen. The ruler labels in pricing.json are typeset
   with one and a strip that used the other would be two boards. */
const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `\u2212${Math.abs(n)}` : String(n));

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

/* The bands are the market's, not the board's; the tracks are the pricing
   system's. Neither is restated here, which is the point of reading them. */
const BANDS = rules.market.priceBands;
const START_BAND = rules.market.startingBandIndex;
const MEM = pricing.memory;
const TALLY = pricing.memory.tally;
const memCells = [];
for (let v = MEM.from; v <= MEM.to; v++) memCells.push(v);
const tallyCells = [];
for (let v = TALLY.from; v <= TALLY.to; v++) tallyCells.push(v);
const BINS = pricing.ruler.bins;

/* A flat-top hexagon is widest across its CORNERS, and that is the dimension a
   band cell has to clear: acrossFlats x 2/root-3. The strips clear a bar, which
   is round and therefore its own widest dimension. These are the two numbers on
   the sheet that come from a physical piece rather than from the paper. */
const TOKEN = components.tokens.commodity;
const TOKEN_FLATS = mm(TOKEN.acrossFlatsMm);
const TOKEN_CORNERS = TOKEN_FLATS * 2 / Math.sqrt(3);
const BAR = mm(components.tokens.bar.diameterMm);

const STRIP_CELL = BAR + 2 * mm(M.strip.clearanceMm);
const STRIP_GUT = mm(M.strip.gutterMm);
const TALLY_W = tallyCells.length * STRIP_CELL;
const MEM_W = memCells.length * STRIP_CELL;
const STRIPS_W = TALLY_W + STRIP_GUT + MEM_W;

const HEAD = mm(M.headMm);
const FOOT_GAP = mm(M.foot.gapMm);
const FOOT_ROWS = M.foot.rows.map((r) => ({ ...r, h: mm(r.heightMm) }));
const FOOT = FOOT_ROWS.reduce((sum, r) => sum + r.h + FOOT_GAP, 0);

const LADDER_X = CONTENT.x + STRIPS_W + STRIP_GUT;
const LADDER_W = CONTENT.w - STRIPS_W - STRIP_GUT;
const CELL_W = LADDER_W / BANDS.length;

const LINE_H = TOKEN_FLATS + 2 * mm(M.line.clearanceMm);
const LINES_TOP = CONTENT.y + HEAD;
const LINES = Math.max(1, Math.floor((CONTENT.h - HEAD - FOOT) / LINE_H));
const LINES_H = LINES * LINE_H;

const TALLY_X = CONTENT.x;
const MEM_X = TALLY_X + TALLY_W + STRIP_GUT;

if (CELL_W < TOKEN_CORNERS) {
  throw new Error(
    `a band cell is ${num(CELL_W / U)}mm and a ${TOKEN.acrossFlatsMm}mm commodity token is ` +
    `${num(TOKEN_CORNERS / U)}mm across the corners - the token would overhang its cell. ` +
    `The strips are taking ${num(STRIPS_W / U)}mm of the ${M.sheet.widthMm}mm sheet.`
  );
}
if (STRIP_CELL < BAR) {
  throw new Error(`a strip cell is ${num(STRIP_CELL / U)}mm and the bar that walks it is ${num(BAR / U)}mm`);
}
if (LINES < 1) throw new Error('the head and the foot have eaten the whole sheet - no line fits');

/* ---------------------------------------------------------------- utilities */

function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

const text = (x, y, size, body, attrs = '') =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${num(size)}" ${attrs}>${body}</text>`;

/** The small letter-spaced sans label every group on this sheet is titled with. */
const caption = (x, y, body, { fill = T55, size = mm(2.2), anchor = 'start' } = {}) =>
  text(x, y, size, esc(body), `text-anchor="${anchor}" letter-spacing="${num(mm(0.26))}" font-family="${SANS}" fill="${fill}"`);

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

/**
 * One market-memory mark, drawn into a box of `size` at `x`,`y`.
 *
 * The path is data on the model (pricing.json models[].mark.path) and how to
 * draw it is components.json marks.pricing, exactly as an element mark is drawn
 * — so the key printed in this foot and the corner engraved on every commodity
 * token trace one set of three marks and cannot disagree about them.
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

/* ------------------------------------------------------------- board pieces */

/**
 * The head: what the three groups are, and what a band is worth.
 *
 * One head at the top of the sheet, not one over every line. Six repetitions of
 * ×0.5 ×0.75 ×1 down a page is six chances for the eye to lose which column it
 * is in; one row and a ruled column edge does the job. The strips need no such
 * row because every one of their cells carries its own number, the way every
 * rung of the player board carries its own.
 */
function head() {
  const wash = [];
  const ink = [];
  const capY = CONTENT.y + mm(4.2);

  ink.push(caption(TALLY_X, capY, 'TALLY — WHAT THE BOARD HOLDS'));
  ink.push(caption(MEM_X, capY, 'MEMORY — ADD TO THE SWING'));
  ink.push(caption(LADDER_X, capY, 'PRICE — × BASE VALUE'));

  BANDS.forEach((band, b) => {
    const cx = LADDER_X + b * CELL_W;
    const t = BANDS.length === 1 ? 0 : b / (BANDS.length - 1);
    const tint = band < 1 ? VERDIGRIS : band > 1 ? OCHRE : T25;
    wash.push(
      `<rect x="${num(cx)}" y="${num(LINES_TOP)}" width="${num(CELL_W)}" height="${num(LINES_H)}" ` +
      `fill="${tint}" opacity="${num(0.10 + 0.20 * Math.abs(t - 0.5) * 2)}"/>`
    );
    ink.push(text(cx + CELL_W / 2, CONTENT.y + mm(11.4), mm(4.6), `&#215;${band}`,
      `text-anchor="middle" font-family="${SANS}" font-weight="bold"`));
    if (b === START_BAND) ink.push(caption(cx + CELL_W / 2, CONTENT.y + mm(14.8), 'START', { anchor: 'middle', size: mm(2) }));
  });

  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/**
 * One market line: a tally, a memory and a ladder, and not one word between
 * them. Everything particular about the line arrives on the pieces standing on
 * it.
 */
function line(r) {
  const y = LINES_TOP + r * LINE_H;
  const mid = y + LINE_H / 2;
  const stripY = mid - STRIP_CELL / 2;
  const wash = [];
  const ink = [];

  /* A hairline the width of the strips at every line boundary. The ladder rows
     are boxed and read as rows on their own; without this the two strips float
     in the white beside them and the eye stops believing they are the same
     line. It is the quietest mark on the sheet and it is doing the most work. */
  if (r > 0) {
    ink.push(
      `<path d="M ${num(TALLY_X)},${num(y)} H ${num(LADDER_X - STRIP_GUT / 2)}" stroke="${SOOT}" ` +
      `stroke-width="${M.strip.cellStrokeWidth}" opacity="0.28"/>`
    );
  }

  /** A numbered strip of `cells`, walked by a bar, with the zero cell ruled
      heavier and seated with a hairline disc. `sign` is for the modifier strip,
      whose numbers are a plus or a minus applied to the swing; a tally is a
      count of tokens and a count has no sign. */
  const strip = (x, cells, zeroValue, { sign = false, tint = null } = {}) => {
    const wide = cells.length * STRIP_CELL;
    cells.forEach((v, i) => {
      const cx = x + i * STRIP_CELL;
      if (tint && v !== zeroValue) {
        wash.push(
          `<rect x="${num(cx)}" y="${num(stripY)}" width="${num(STRIP_CELL)}" height="${num(STRIP_CELL)}" ` +
          `fill="${v < zeroValue ? VERDIGRIS : OCHRE}" opacity="${num(0.10 + 0.07 * Math.abs(v - zeroValue))}"/>`
        );
      }
      if (i > 0) {
        const heavy = v === zeroValue || cells[i - 1] === zeroValue;
        ink.push(
          `<path d="M ${num(cx)},${num(stripY)} V ${num(stripY + STRIP_CELL)}" stroke="${SOOT}" ` +
          `stroke-width="${heavy ? M.strip.zeroRule.strokeWidth : M.strip.cellStrokeWidth}" opacity="${heavy ? 0.9 : 0.5}"/>`
        );
      }
      ink.push(text(cx + STRIP_CELL / 2, stripY + STRIP_CELL * 0.68, mm(2.5),
        esc(sign && v !== zeroValue ? signed(v) : String(v)),
        `text-anchor="middle" font-family="${SANS}" fill="${v === zeroValue ? T55 : T40}"`));
    });
    /* the seat is drawn, not cut: a hairline disc the size of the bar that
       belongs in it, so setup is a shape-matching job and not a rules lookup */
    const zi = cells.indexOf(zeroValue);
    ink.push(
      `<circle cx="${num(x + zi * STRIP_CELL + STRIP_CELL / 2)}" cy="${num(mid)}" r="${num(BAR / 2 * 0.92)}" ` +
      `fill="none" stroke="${T40}" stroke-width="0.8" opacity="0.75"/>`
    );
    ink.push(
      `<rect x="${num(x)}" y="${num(stripY)}" width="${num(wide)}" height="${num(STRIP_CELL)}" rx="${num(mm(1))}" ` +
      `fill="none" stroke="${SOOT}" stroke-width="${M.strip.strokeWidth}"/>`
    );
  };

  strip(TALLY_X, tallyCells, TALLY.start);
  strip(MEM_X, memCells, MEM.start, { sign: true, tint: true });

  /* the ladder: a token-tall row of band cells */
  BANDS.forEach((band, b) => {
    const cx = LADDER_X + b * CELL_W;
    if (b === 0) return;
    const heavy = b === START_BAND || b === START_BAND + 1;
    ink.push(
      `<path d="M ${num(cx)},${num(y)} V ${num(y + LINE_H)}" stroke="${SOOT}" ` +
      `stroke-width="${heavy ? M.startBandRule.strokeWidth : M.line.bandStrokeWidth}" opacity="${heavy ? 1 : 0.6}"/>`
    );
  });
  ink.push(
    `<path d="${hexPath(LADDER_X + START_BAND * CELL_W + CELL_W / 2, mid, TOKEN_FLATS * 0.92)}" ` +
    `fill="none" stroke="${T40}" stroke-width="0.8" opacity="0.75"/>`
  );
  ink.push(
    `<rect x="${num(LADDER_X)}" y="${num(y)}" width="${num(LADDER_W)}" height="${num(LINE_H)}" rx="${num(mm(1.2))}" ` +
    `fill="none" stroke="${SOOT}" stroke-width="${M.line.strokeWidth}"/>`
  );
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/* ------------------------------------------------------------------ the foot */

const FOOT_TOP = CONTENT.y + CONTENT.h - FOOT;
const rowY = (id) => {
  let cursor = FOOT_TOP;
  for (const row of FOOT_ROWS) {
    cursor += FOOT_GAP;
    if (row.id === id) return { y: cursor, h: row.h };
    cursor += row.h;
  }
  throw new Error(`components.json marketBoard.foot has no "${id}" row`);
};

/* The five dice laid out as five dice: how wide that block is is a count of
   pieces, not a fraction of the paper, so the elasticity strip beside it takes
   whatever is left rather than half of something. */
const DIE = mm(M.foot.diceInk.swatchMm);
const DIE_GAP = DIE * 0.18;
const DIE_GROUP_GAP = DIE * 0.6;
const DICE_W = pricing.dice.sets.reduce(
  (sum, set, i) => sum + set.count * DIE + (set.count - 1) * DIE_GAP + (i ? DIE_GROUP_GAP : 0), 0
);

/** The five dice, in the colours they are called by, and what each pair is for. */
function diceKey(x, y, h) {
  const d = M.foot.diceInk;
  const wash = [];
  const ink = [caption(x, y + mm(2.6), spec.foot.dice.title, { fill: T70 })];
  const top = y + mm(5.4);
  let cursor = x;
  for (const set of pricing.dice.sets) {
    for (let n = 0; n < set.count; n++) {
      const dx = cursor + n * (DIE + DIE_GAP);
      wash.push(
        `<rect x="${num(dx)}" y="${num(top)}" width="${num(DIE)}" height="${num(DIE)}" rx="${num(mm(1.2))}" ` +
        `fill="${inkHex(d[set.colour], palette)}" opacity="0.55"/>`
      );
      ink.push(
        `<rect x="${num(dx)}" y="${num(top)}" width="${num(DIE)}" height="${num(DIE)}" rx="${num(mm(1.2))}" ` +
        `fill="none" stroke="${SOOT}" stroke-width="0.9"/>` +
        text(dx + DIE / 2, top + DIE * 0.72, mm(3.4), esc(set.name[0]),
          `text-anchor="middle" font-family="${SANS}" font-weight="bold"`)
      );
    }
    /* Captions hang from the LEFT of their own group rather than centred on it,
       because ELASTICITY is twice the width of the one green die it belongs to
       and a centred caption would sit on top of its neighbour. */
    ink.push(caption(cursor, top + DIE + mm(3), set.name.toUpperCase(), { size: mm(1.9), fill: T70 }));
    cursor += set.count * DIE + (set.count - 1) * DIE_GAP + DIE_GROUP_GAP;
  }
  void h;
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/** The green die read as a multiplier: three cells, and the whole of elasticity. */
function elasticityStrip(x, y, w, h) {
  const steps = pricing.elasticity.steps;
  const cw = w / steps.length;
  const top = y + mm(4.6);
  const ch = h - mm(4.6);
  const ink = [caption(x, y + mm(2.6), spec.foot.elasticity.title, { fill: T70 })];
  steps.forEach((s, i) => {
    const cx = x + i * cw;
    ink.push(
      `<rect x="${num(cx)}" y="${num(top)}" width="${num(cw)}" height="${num(ch)}" rx="${num(mm(1))}" fill="none" ` +
      `stroke="${SOOT}" stroke-width="${M.foot.cellStrokeWidth}" opacity="0.7"/>`,
      text(cx + cw / 2, top + mm(3.2), mm(2.4), esc(`${s.faces[0]}–${s.faces[s.faces.length - 1]}`),
        `text-anchor="middle" font-family="${SANS}" fill="${T70}"`),
      text(cx + cw / 2, top + mm(7.6), mm(4.4), esc(s.label), `text-anchor="middle" font-family="${SANS}" font-weight="bold"`),
      caption(cx + cw / 2, top + ch - mm(1.4), s.name.toUpperCase(), { anchor: 'middle', size: mm(1.9), fill: T55 })
    );
  });
  return ink.join('\n    ');
}

/**
 * The swing ruler: one cell per bin, printing the net it covers and the bands
 * it moves. This strip is the reason the board is worth printing rather than
 * looked up, and it is exactly as wide as the ladder it points at.
 */
function swingRuler(x, y, w, h) {
  const cw = w / BINS.length;
  const top = y + mm(4.6);
  const ch = h - mm(4.6);
  const wash = [];
  const ink = [
    caption(x, y + mm(2.6), spec.foot.ruler.title, { fill: T70 }),
    text(x + w, y + mm(2.6), mm(2.3), esc(pricing.formula.net), `text-anchor="end" font-style="italic" fill="${T85}"`),
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
      `stroke="${SOOT}" stroke-width="${M.foot.cellStrokeWidth}" opacity="0.7"/>`,
      text(cx + cw / 2, top + mm(3.2), mm(2.4), esc(bin.label), `text-anchor="middle" font-family="${SANS}" fill="${T70}"`),
      text(cx + cw / 2, top + mm(8.2), mm(5), esc(bin.move === 0 ? '—' : signed(bin.move)),
        `text-anchor="middle" font-family="${SANS}" font-weight="bold"`),
      caption(cx + cw / 2, top + ch - mm(1.4), bin.name.toUpperCase(), { anchor: 'middle', size: mm(1.9), fill: T55 })
    );
  });
  return { wash: wash.join('\n    '), ink: ink.join('\n    ') };
}

/**
 * The three market-memory models, with the marks that are engraved on every
 * commodity token. This row is the key to a corner of a piece of wood.
 */
function modelKey(y, h) {
  const models = pricing.models;
  const cw = CONTENT.w / models.length;
  const size = mm(components.marks.pricing.onBoard.sizeMm);
  const ink = [caption(CONTENT.x, y + mm(2.6), spec.foot.models.title, { fill: T70 })];
  models.forEach((model, i) => {
    const x = CONTENT.x + i * cw;
    const top = y + mm(4.4);
    ink.push(markGroup(model, x, top, size));
    ink.push(text(x + size + mm(2), top + mm(3.4), mm(3.1), esc(model.name), `font-weight="bold"`));
    ink.push(text(x + size + mm(2), top + mm(6.9), mm(2.4), esc(model.line), `fill="${T85}"`));
  });
  return ink.join('\n    ');
}

/**
 * The prose. The only sentences on the sheet, printed from data rather than
 * written here, plus the board's own name where a maker's mark would have gone.
 */
function panel(y, h) {
  const out = [];
  out.push(caption(CONTENT.x, y + mm(2.8), spec.panel.title, { fill: T70, size: mm(2.7) }));
  spec.panel.lines.forEach((l, i) => {
    out.push(text(CONTENT.x + mm(30), y + mm(2.4) + i * mm(3), mm(2.4), esc(l)));
  });
  out.push(text(CONTENT.x + CONTENT.w, y + mm(2.8), mm(2.4), esc(spec.panel.foot), `text-anchor="end" font-style="italic" fill="${T85}"`));
  out.push(caption(CONTENT.x + CONTENT.w, y + h, `game1 · ${spec.board.name.toUpperCase()}`, { anchor: 'end', size: mm(2.2), fill: T40 }));
  return out.join('\n    ');
}

function foot() {
  const ruler = rowY('ruler');
  const models = rowY('models');
  const pan = rowY('panel');

  const diceBlock = DICE_W + STRIP_GUT;
  const dice = diceKey(CONTENT.x, ruler.y, ruler.h);
  const elas = elasticityStrip(CONTENT.x + diceBlock, ruler.y, STRIPS_W - diceBlock, ruler.h);
  const swing = swingRuler(LADDER_X, ruler.y, LADDER_W, ruler.h);

  return {
    wash: [dice.wash, swing.wash].join('\n    '),
    ink: [
      `<path d="M ${num(CONTENT.x)},${num(FOOT_TOP)} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="${M.foot.ruleStrokeWidth}"/>`,
      dice.ink, elas, swing.ink,
      modelKey(models.y, models.h),
      panel(pan.y, pan.h),
    ].join('\n    '),
  };
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
    `<circle cx="${num(LADDER_X + LADDER_W * 0.34)}" cy="${num(LINES_TOP + LINES_H * 0.62)}" ` +
    `r="${num(mm(8.5))}" fill="none" stroke="${FOXING}" stroke-width="3.4" opacity="0.5"/>`
  );
}

/* --------------------------------------------------------------- the board */

function board() {
  const h = head();
  const f = foot();
  const lines = Array.from({ length: LINES }, (_, r) => line(r));
  const lineWash = lines.map((l) => l.wash).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.board.name)}</title>
<desc>${esc(spec.board.summary)} ${LINES} identical market lines - a ${tallyCells.length}-cell tally, a ${memCells.length}-cell memory from ${MEM.from} to ${MEM.to}, and a ${BANDS.length}-band price ladder - over a foot carrying the five dice, the elasticity strip and the ${BINS.length}-cell swing ruler. Nothing on the sheet names a commodity: the token standing on a line is the label, the reading and the rule it runs under. Generated by tools/build-market.mjs from data/marketboard.json, data/components.json, data/rules.json and data/pricing.json - do not edit. ${M.sheet.widthMm} x ${M.sheet.heightMm} mm at ${U} units/mm, ${M.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${h.wash}
  ${lineWash}
  ${f.wash}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the workbench itself: sawn boards the length of the sheet, running to the
       edge, because there is no border for them to stop at -->
  <g clip-path="url(#sheet)">
    ${timber(spec.board.id)}
  </g>

  <!-- the head: what the three groups are, and what a band is worth -->
  ${h.ink}

  <!-- the lines: identical, unnamed, and read left to right -->
  ${lines.map((l) => l.ink).join('\n  ')}

  <!-- the foot: the dice, the green die read as a multiplier, and the ruler -->
  ${f.ink}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(spec.board.id)}
</g>
</svg>
`;
}

/* ------------------------------------------------------- what the dice do */

/**
 * The odds, worked out rather than claimed: every pair of red dice against every
 * pair of blue, for every face of the green die, at each value the memory track
 * can hold. Nothing in the data says how often a market moves — this derives it,
 * so a change to a ruler bin shows up in the printed odds on the next build.
 */
function oddsByMemory() {
  const two = new Map();
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) two.set(a + b, (two.get(a + b) ?? 0) + 1);
  const swing = new Map();
  for (const [d, cd] of two) for (const [s, cs] of two) swing.set(d - s, (swing.get(d - s) ?? 0) + cd * cs);

  const moveOf = (net) => {
    const bin = BINS.find((x) => net >= x.from && net <= x.to);
    if (!bin) throw new Error(`the swing ruler has no cell for a net of ${net}`);
    return bin.move;
  };
  const trim = (n) => (n < 0 ? Math.ceil(n) : Math.floor(n));

  const out = [];
  for (const m of memCells) {
    const tally = new Map();
    let total = 0;
    for (const step of pricing.elasticity.steps) {
      for (const face of step.faces) {
        void face;
        for (const [raw, count] of swing) {
          const move = moveOf(trim((raw + m) * step.multiply));
          tally.set(move, (tally.get(move) ?? 0) + count);
          total += count;
        }
      }
    }
    out.push({ memory: m, total, moves: tally });
  }
  return out;
}

const ODDS = oddsByMemory();
const MOVES = [...new Set(BINS.map((b) => b.move))].sort((a, b) => a - b);

/* ------------------------------------------------------------------ output */

const BOARD_FILE = `${spec.board.id}.svg`;
const svg = board();

const byModel = pricing.models.map((m) => ({
  model: m,
  list: commodities.commodities.filter((c) => c.pricing === m.id),
}));

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
    .bar, h1, h2, p.note, table, .goods, .scroll { display: none; }
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
<code>data/components.json</code>, the bands in <code>data/rules.json</code> and the pricing system in
<code>data/pricing.json</code> — edit those, re-run the tool, and never this file. ${esc(spec.board.howMany)}
Print at 100% and landscape with "fit to page" off, and the ${M.sheet.bleedMm}&nbsp;mm of bleed runs off the
edge of the paper, which is the only place bleed is any use.</p>

<h2>The board</h2>
<div class="boards">
  <figure><object data="${BOARD_FILE}" type="image/svg+xml" aria-label="The market board"></object></figure>
</div>

<h2>The ${BANDS.length} bands</h2>
<table>
<tr><th>Band</th><th>Price</th><th></th></tr>
${BANDS.map((b, i) => `<tr><td class="band">&times;${b}</td><td>base value &times; ${b}</td><td>${i === START_BAND ? 'where every token starts' : ''}</td></tr>`).join('\n')}
</table>
<p class="note">${esc(spec.line.reads)}</p>

<h2>The swing ruler</h2>
<p class="note">${esc(pricing.formula.net)} — then read the net here. ${esc(pricing.ruler.$comment.split('\n')[0])}</p>
<table>
<tr><th>Net</th><th>Bands</th><th></th></tr>
${BINS.map((b) => `<tr><td>${esc(b.label)}</td><td class="move">${b.move === 0 ? '&mdash;' : esc(signed(b.move))}</td><td>${esc(b.name)}</td></tr>`).join('\n')}
</table>

<h2>What the dice actually do</h2>
<p class="note">Every pair of red dice against every pair of blue, over all six faces of the green die,
at each value the memory track can hold. Worked out from the ruler above rather than claimed, so a change
to a bin shows up here on the next build.</p>
<div class="scroll">
<table>
<tr><th>Memory</th>${MOVES.map((m) => `<th>${m === 0 ? 'hold' : signed(m) + ' band' + (Math.abs(m) === 1 ? '' : 's')}</th>`).join('')}</tr>
${ODDS.map((row) => `<tr><td class="band">${signed(row.memory)}</td>${MOVES.map((m) => {
  const p = (100 * (row.moves.get(m) ?? 0)) / row.total;
  return `<td class="n${p < 0.05 ? ' dim' : ''}">${p < 0.05 ? '&mdash;' : p.toFixed(1) + '%'}</td>`;
}).join('')}</tr>`).join('\n')}
</table>
</div>

<h2>What a market remembers</h2>
${byModel.map(({ model, list }) => `<h3 style="font-size:14px;margin:18px 0 2px">${esc(model.name)} — ${esc(model.line)} <span style="color:${T55};font-weight:normal">(${list.length} commodities)</span></h3>
<p class="note">${esc(model.history)}</p>
<p class="goods">${list.map((c) => esc(c.name)).join(' · ')}</p>`).join('\n')}
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
    `${LINES} market lines: a ${tallyCells.length}-cell tally + a ${memCells.length}-cell memory ` +
    `at ${num(STRIP_CELL / U)}mm (a ${components.tokens.bar.diameterMm}mm bar), ` +
    `then ${BANDS.length} bands at ${num(CELL_W / U)}x${num(LINE_H / U)}mm ` +
    `(an ${TOKEN.acrossFlatsMm}mm token is ${num(TOKEN_CORNERS / U)}mm across the corners); ` +
    `foot ${num(FOOT / U)}mm carrying a ${BINS.length}-cell swing ruler, ` +
    `${num((FOOT_TOP - LINES_TOP - LINES_H) / U)}mm of slack left over`
  );
}
