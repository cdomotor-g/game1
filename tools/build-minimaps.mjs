#!/usr/bin/env node
/**
 * Draws the mini-map sheets — one per terrain — from data/minimap.json,
 * data/components.json, data/terrain.json and whichever map the table is
 * playing on.
 *
 * A mini-map is a flat colour, a pattern and a grid, and that is the whole
 * specification. One regular hexagon filled with the plain colour the terrain
 * already declares, the terrain's own map mark scattered across the cells, a
 * hexagonal grid ruled on top, and two working panels in the space a hexagon on
 * a rectangle leaves over. There is no render and no plate, so there is no
 * artist, no framing entry and nothing in the mint queue: a sheet is generated,
 * not commissioned.
 *
 * The pattern is the world map's own. A terrain carries a MARK - a grass tuft, a
 * conifer, two hummocks, a peak - as data (data/terrain.json terrains[].mark),
 * exactly as an element carries one, and data/components.json marks.terrain says
 * how to draw it and how thickly to scatter it. So the ground on a mini-map and
 * the ground in the campaign map's legend are traced from one path and cannot
 * drift apart.
 *
 * These sheets were a flat colour and nothing else, on the argument that drawn
 * ground competes with the pieces standing on it. The argument was half right: a
 * DRAWN sheet competes, and a mark at a third of a cell on the ink plate at a
 * third of full strength does not. It does what the wash could not do on its own
 * - say which ground this is from across the table - and it does it in the
 * black-and-white edition too, where there is no wash at all.
 *
 * THE CELL IS THE WORLD HEX. Not approximately — exactly. It is read off the
 * campaign map's own print preset (data/maps/<id>.json print.presets), so a
 * figure based for the big board stands in a mini-map cell without being
 * re-based, a route token cut for the big board fits a mini-map lane, and one
 * ruler measures both. Print the map bigger and these sheets follow.
 *
 * The field then sizes itself: cellsPerSide gives 2n-1 cells across, the field
 * is that many cells wide, and the panels are what is left over either side.
 * Nothing here is a coordinate, and a field that would not fit the paper fails
 * the build rather than running off it.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash is the
 * terrain colour and nothing else, #ink is the pattern, the grid, the panels and
 * every letter in soot alone, #grime is the wear. Drop #wash and the sheet still
 * works - better than it used to, because the mark saying which ground this is
 * was never the colour's job either.
 *
 * Usage: node tools/build-minimaps.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'minimaps', 'sheets');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('minimap.json');
const terrain = read('terrain.json');
/* How a terrain's map mark is drawn and how thickly it is scattered. The PATH
   is on the terrain; this is the only thing that knows how heavy the line is. */
const MARK = components.marks.terrain;

const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const FOXING = palette.paper.foxing.hex;
const T85 = palette.ink.tints['85'].hex;
const T70 = palette.ink.tints['70'].hex;
const T55 = palette.ink.tints['55'].hex;
const T40 = palette.ink.tints['40'].hex;
const T25 = palette.ink.tints['25'].hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/* -------------------------------------------------- the cell, from the map */

/**
 * A mini-map cell is a world-map hex. This is where that is read, and it is read
 * rather than typed: the map's default print preset says how big a hex prints,
 * and that number is the cell.
 */
function worldHexMm() {
  const dir = join(DATA, 'maps');
  const maps = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const file of maps) {
    const map = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    if (!map.print?.presets?.length) continue;
    const preset = map.print.presets.find((p) => p.id === map.print.default) ?? map.print.presets[0];
    if (typeof preset.hexAcrossFlatsMm === 'number') {
      return { mm: preset.hexAcrossFlatsMm, map: map.id, preset: preset.id };
    }
  }
  throw new Error('no map declares a printed hex size - a mini-map cell has nothing to match');
}

/* ------------------------------------------------------------- the geometry */

const MM = components.minimap;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(MM.sheet.bleedMm);
const W = mm(MM.sheet.widthMm + 2 * MM.sheet.bleedMm);
const H = mm(MM.sheet.heightMm + 2 * MM.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(MM.sheet.widthMm), h: mm(MM.sheet.heightMm) };
const CORNER = mm(MM.sheet.cornerRadiusMm);

const CONTENT = {
  x: TRIM.x + mm(MM.marginMm),
  y: TRIM.y + mm(MM.marginMm),
  w: TRIM.w - 2 * mm(MM.marginMm),
  h: TRIM.h - 2 * mm(MM.marginMm),
};

const WORLD = worldHexMm();
const N = MM.cellsPerSide;
const CELL_FLATS = mm(WORLD.mm);          // across the flats: a pointy-top cell's width
const CELL_R = CELL_FLATS / Math.sqrt(3); // circumradius
const ROWS = 2 * N - 1;

/* A hexagon of pointy-top hexes: 2n-1 cells across the middle row, 2n-1 rows,
   the rows pitched 1.5 circumradii apart. */
const FIELD_W = ROWS * CELL_FLATS;
const FIELD_H = 1.5 * CELL_R * (ROWS - 1) + 2 * CELL_R;
const FOOT = mm(9);

if (FIELD_W > CONTENT.w || FIELD_H > CONTENT.h - FOOT) {
  throw new Error(
    `a ${N}-a-side field of ${WORLD.mm}mm cells is ${num(FIELD_W / U)}x${num(FIELD_H / U)}mm ` +
    `and the sheet has ${num(CONTENT.w / U)}x${num((CONTENT.h - FOOT) / U)}mm - ` +
    `take a cell off the side, or print the map at a smaller preset`
  );
}

const FIELD = {
  cx: CONTENT.x + CONTENT.w / 2,
  cy: CONTENT.y + (CONTENT.h - FOOT) / 2,
};
/* Whatever the hexagon leaves either side is the panels', and they are equal
   because a sheet with a wide panel and a narrow one reads as a mistake. */
const PANEL_W = (CONTENT.w - FIELD_W) / 2 - mm(4);
const PANEL_H = CONTENT.h - FOOT - mm(4);

/* ---------------------------------------------------------------- utilities */

function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** A pointy-top hexagon: first corner due north, which is what "pointy" means. */
function hexPath(cx, cy, R) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${num(cx + R * Math.cos(a))},${num(cy + R * Math.sin(a))}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

/**
 * Every cell of the field, in axial coordinates out to `N-1` — which is exactly
 * the definition of a hexagon of hexes, and is why the field never has to be
 * described as a list of row lengths.
 */
function cells() {
  const out = [];
  for (let q = -(N - 1); q <= N - 1; q++) {
    for (let r = Math.max(-(N - 1), -q - (N - 1)); r <= Math.min(N - 1, -q + (N - 1)); r++) {
      out.push({ q, r });
    }
  }
  return out;
}

/* The six axial neighbours, paired with the corner index the shared edge starts
   at. Corner 0 is due north (a pointy-top hex), and corners run clockwise. */
const AXIAL_EDGES = [
  [0, [1, -1]],   // north-east
  [1, [1, 0]],    // east
  [2, [0, 1]],    // south-east
  [3, [-1, 1]],   // south-west
  [4, [-1, 0]],   // west
  [5, [0, -1]],   // north-west
];

/** One corner of a pointy-top cell, by index from due north, clockwise. */
function corner(cx, cy, i) {
  const a = (Math.PI / 3) * i - Math.PI / 2;
  return { x: cx + CELL_R * Math.cos(a), y: cy + CELL_R * Math.sin(a) };
}

/**
 * A row letter and a cell number for every cell: A1 is the top-left cell of the
 * top row, and the rows run down the sheet. It is the scheme a printed grid has
 * always used, and it survives the mini-map being turned round on the table,
 * which a pair of signed axial coordinates does not.
 */
function labelsFor(list) {
  const rows = new Map();
  for (const c of list) {
    if (!rows.has(c.r)) rows.set(c.r, []);
    rows.get(c.r).push(c);
  }
  const out = [];
  [...rows.keys()].sort((a, b) => a - b).forEach((r, rowIndex) => {
    const letter = String.fromCharCode(65 + rowIndex);
    rows.get(r).sort((a, b) => a.q - b.q).forEach((c, i) => {
      const { x, y } = centreOf(c);
      out.push(
        `<text x="${num(x)}" y="${num(y + CELL_R * 0.66)}" font-size="${num(mm(1.9))}" text-anchor="middle" ` +
        `font-family="${SANS}" fill="${SOOT}" opacity="0.5">${letter}${i + 1}</text>`
      );
    });
  });
  return out.join('');
}

/** Axial to sheet coordinates, for a pointy-top grid. */
function centreOf({ q, r }) {
  return {
    x: FIELD.cx + CELL_FLATS * (q + r / 2),
    y: FIELD.cy + 1.5 * CELL_R * r,
  };
}

/* ------------------------------------------------------------- sheet pieces */

/**
 * The ground: one terrain's map mark, scattered across the cells of the field.
 *
 * Three marks to a cell (components.json marks.terrain.onField), set on a small
 * triangle about the cell's centre and nudged by a fraction of their own size,
 * so the field reads as ground rather than as wallpaper. The nudge is
 * deterministic - seeded off the terrain and the cell's own coordinates - because
 * --check compares the file byte for byte and a sheet nobody has touched has to
 * come out the same twice.
 *
 * The triangle is what keeps the pattern honest on a hex grid: every mark sits
 * well inside the cell's inradius, so nothing ever crosses a grid line and a
 * player is never looking at half a tree wondering which cell it is in.
 */
function ground(t, list) {
  const O = MARK.onField;
  const size = mm(O.sizeMm);
  const k = size / 24;                     // the 24-grid, scaled to the sheet
  const ring = CELL_R * 0.42;              // how far the three marks stand out
  const rand = rng(`ground-${t.id}`);
  const out = [];

  for (const c of list) {
    const { x, y } = centreOf(c);
    for (let i = 0; i < O.perCell; i++) {
      const a = (Math.PI * 2 * i) / O.perCell - Math.PI / 2;
      const jx = (rand() - 0.5) * 2 * O.jitter * size;
      const jy = (rand() - 0.5) * 2 * O.jitter * size;
      const cx = x + Math.cos(a) * ring + jx;
      const cy = y + Math.sin(a) * ring + jy;
      out.push(
        `<g transform="translate(${num(cx - 12 * k)} ${num(cy - 12 * k)}) scale(${num(k)})">` +
        `<path d="${t.mark.path}"/></g>`
      );
    }
  }
  return (
    `<g fill="${MARK.fill}" stroke="${SOOT}" stroke-width="${MARK.strokeWidth}" ` +
    `stroke-linecap="${MARK.strokeLinecap}" stroke-linejoin="${MARK.strokeLinejoin}" ` +
    `opacity="${O.opacity}">\n    ${out.join('')}\n  </g>`
  );
}

/**
 * One panel: a titled box of ruled rows.
 *
 * Both panels print on every sheet, so no sheet is ever the wrong sheet — a
 * battle uses the left one and ignores the right, a settlement lives out of the
 * right one and only needs the left the day it is attacked.
 */
function panel(p, x) {
  const pad = mm(3.2);
  const out = [];
  out.push(`<rect x="${num(x)}" y="${num(CONTENT.y)}" width="${num(PANEL_W)}" height="${num(PANEL_H)}" rx="${num(mm(2.5))}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>`);
  out.push(`<text x="${num(x + pad)}" y="${num(CONTENT.y + mm(6.4))}" font-size="${num(mm(2.9))}" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T70}">${esc(p.title)}</text>`);
  out.push(`<path d="M ${num(x + pad)},${num(CONTENT.y + mm(9))} H ${num(x + PANEL_W - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);

  let cursor = CONTENT.y + mm(14);
  for (const row of p.rows) {
    out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.5))}" letter-spacing="${num(mm(0.3))}" font-family="${SANS}" fill="${T55}">${esc(row.label.toUpperCase())}</text>`);
    cursor += mm(3);
    for (let i = 0; i < row.count; i++) {
      if (row.kind === 'box') {
        const s = mm(5);
        const perRow = Math.max(1, Math.floor((PANEL_W - 2 * pad) / (s + mm(1.4))));
        const col = i % perRow;
        if (col === 0 && i > 0) cursor += s + mm(1.4);
        out.push(`<rect x="${num(x + pad + col * (s + mm(1.4)))}" y="${num(cursor)}" width="${num(s)}" height="${num(s)}" rx="${num(mm(0.8))}" fill="none" stroke="${T40}" stroke-width="1"/>`);
        if (i === row.count - 1) cursor += s + mm(6);
      } else {
        cursor += mm(5.4);
        out.push(`<path d="M ${num(x + pad)},${num(cursor)} H ${num(x + PANEL_W - pad)}" stroke="${T40}" stroke-width="0.8"/>`);
        if (i === row.count - 1) cursor += mm(7.2);
      }
    }
  }
  return out.join('\n    ');
}

/** The footer: what the sheet is, where it is standing in for, and the code. */
function footer(t) {
  const y = CONTENT.y + CONTENT.h - mm(2);
  const pad = mm(1);
  return [
    `<path d="M ${num(CONTENT.x)},${num(y - mm(6.5))} H ${num(CONTENT.x + CONTENT.w)}" stroke="${SOOT}" stroke-width="1.2"/>`,
    `<text x="${num(CONTENT.x + pad)}" y="${num(y - mm(2))}" font-size="${num(mm(3))}" letter-spacing="${num(mm(0.6))}" font-family="${SANS}">${esc(t.name.toUpperCase())}</text>`,
    `<text x="${num(CONTENT.x + CONTENT.w / 2)}" y="${num(y - mm(2))}" font-size="${num(mm(2.5))}" text-anchor="middle" fill="${T55}" font-family="${SANS}">MAP HEX</text>`,
    `<path d="M ${num(CONTENT.x + CONTENT.w / 2 + mm(11))},${num(y - mm(1.6))} H ${num(CONTENT.x + CONTENT.w / 2 + mm(38))}" stroke="${T40}" stroke-width="0.9"/>`,
    `<text x="${num(CONTENT.x + CONTENT.w)}" y="${num(y - mm(2))}" font-size="${num(mm(3))}" text-anchor="end" font-family="${SANS}" font-weight="bold">${esc(t.code)}</text>`,
    `<text x="${num(CONTENT.x + CONTENT.w)}" y="${num(y + mm(2.4))}" font-size="${num(mm(2.1))}" text-anchor="end" letter-spacing="${num(mm(0.7))}" font-family="${SANS}" fill="${T40}">game1 &#183; MINI-MAP &#183; ${WORLD.mm} mm CELL</text>`,
  ].join('\n    ');
}

function grime(seed) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 7 }, () =>
    `<circle cx="${num(TRIM.x + rand() * TRIM.w)}" cy="${num(TRIM.y + rand() * TRIM.h)}" r="${num(1 + rand() * 1.5)}"/>`
  ).join('');
  const g = 8;
  const R = CORNER + g;
  const b = { x: TRIM.x - g, y: TRIM.y - g, w: TRIM.w + 2 * g, h: TRIM.h + 2 * g };
  const arcs = [
    `M ${num(b.x)},${num(b.y + R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + R)},${num(b.y)}`,
    `M ${num(b.x + b.w - R)},${num(b.y)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w)},${num(b.y + R)}`,
    `M ${num(b.x + b.w)},${num(b.y + b.h - R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w - R)},${num(b.y + b.h)}`,
    `M ${num(b.x + R)},${num(b.y + b.h)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x)},${num(b.y + b.h - R)}`,
  ];
  return (
    `<g fill="none" stroke="${SOOT}" stroke-width="1.2" opacity="0.32">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>` +
    `<circle cx="${num(CONTENT.x + PANEL_W / 2)}" cy="${num(CONTENT.y + CONTENT.h * 0.72)}" r="${num(mm(7.5))}" fill="none" stroke="${FOXING}" stroke-width="3.2" opacity="0.45"/>`
  );
}

/* ---------------------------------------------------------------- the sheet */

/** The printed colour for a terrain — see the loop under "output" for why. */
const washOf = (t) => palette.terrain[t.id].wash;

function sheet(t) {
  const list = cells();
  const inField = new Set(list.map((c) => `${c.q},${c.r}`));

  /* The wash is the terrain's own colour and it is the only thing on the wash
     plate. It is painted cell by cell rather than as one big hexagon: the cells
     tile with shared edges, so the union is seamless, and it cannot drift half a
     millimetre out of register with the grid the way a separately drawn outline
     always does. */
  const wash = list.map((c) => {
    const { x, y } = centreOf(c);
    return `<path d="${hexPath(x, y, CELL_R + 0.4)}" fill="${washOf(t)}" opacity="${MM.wash.opacity}"/>`;
  }).join('');

  const grid = list.map((c) => {
    const { x, y } = centreOf(c);
    return `<path d="${hexPath(x, y, CELL_R)}"/>`;
  }).join('');

  /* The ground itself, on the ink plate under the grid: this terrain's own map
     mark, the same path the campaign map's legend swatch traces. */
  const pattern = ground(t, list);

  /* The field's edge, traced rather than drawn: every cell edge with no cell on
     the other side of it. A hexagon of hexes has a stepped boundary, and a
     smooth hexagon laid over it lands on none of the cells. */
  const outline = list.flatMap((c) => {
    const { x, y } = centreOf(c);
    return AXIAL_EDGES.flatMap(([d, [dq, dr]]) => {
      if (inField.has(`${c.q + dq},${c.r + dr}`)) return [];
      const a = corner(x, y, d);
      const b = corner(x, y, (d + 1) % 6);
      return [`M ${num(a.x)},${num(a.y)} L ${num(b.x)},${num(b.y)}`];
    });
  }).join(' ');

  /* A row letter and a cell number in the corner of every cell, so a cell can be
     named across the table without anybody counting. A1 is the top-left cell of
     the top row; the rows run A down to whatever 2n-1 reaches. */
  const labels = MM.grid.coordinates ? labelsFor(list) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>Mini-map — ${esc(t.name)}</title>
<desc>${esc(spec.board.summary)} This sheet is ${esc(t.name.toLowerCase())} (${esc(t.code)}): the field is that terrain's printed wash from palette.json, patterned with that terrain's own map mark (${esc(t.mark.id)}) on the ink plate - no render, no plate. ${ROWS} cells across, ${list.length} cells in all, each ${WORLD.mm} mm across the flats, which is a world-map hex on the ${esc(WORLD.map)} ${esc(WORLD.preset)} preset. Generated by tools/build-minimaps.mjs from data/minimap.json, data/components.json and data/terrain.json - do not edit. ${MM.sheet.widthMm} x ${MM.sheet.heightMm} mm at ${U} units/mm, ${MM.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<!-- One flat colour, from data/terrain.json. That is the entire wash plate. -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${wash}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the ground: this terrain's map mark from data/terrain.json, scattered by
       data/components.json marks.terrain. It is on the ink plate, so the sheet
       still says which ground it is with the wash dropped -->
  ${pattern}

  <!-- the field's own edge, and the grid ruled inside it: never drawn by an
       image model, exactly as on the campaign map (docs/map/README.md) -->
  <g fill="none" stroke="${SOOT}" stroke-width="${MM.grid.strokeWidth}" opacity="${MM.grid.opacity}">
    ${grid}
  </g>
  <path d="${outline}" fill="none" stroke="${SOOT}" stroke-width="${MM.field.strokeWidth}" stroke-linecap="round"/>
  ${labels}

  <!-- both panels on every sheet, so no sheet is ever the wrong sheet -->
  ${spec.panels.map((p) => panel(p, p.side === 'left' ? CONTENT.x : CONTENT.x + CONTENT.w - PANEL_W)).join('\n  ')}

  ${footer(t)}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(t.id)}
</g>
</svg>
`;
}

/* ------------------------------------------------------------------ output */

/* The printed colour comes from the palette, not from terrain.json: that file's
   colour is what the explorer paints a hex on a screen, and palette.terrain[].wash
   is what a press puts on paper - already a tint, because terrain is the largest
   printed area in the game. A terrain with no wash declared has nothing to print
   in, and that is a build failure rather than a grey sheet. */
for (const t of terrain.terrains) {
  if (!palette.terrain?.[t.id]?.wash) {
    throw new Error(`palette.json declares no terrain wash for "${t.id}" - a mini-map field has nothing to print in`);
  }
  if (!t.mark?.path) {
    throw new Error(`terrain.json declares no mark for "${t.id}" - a mini-map field has no ground to draw`);
  }
}

const sheets = terrain.terrains.map((t) => [`field-${t.id}.svg`, sheet(t)]);

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the mini-map sheets</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  figure { margin: 0 0 18px; }
  figcaption { font-family: ${SANS}; font-size: 12.5px; color: ${T70}; margin-top: 4px; }
  .sheets img { display: block; width: 100%; aspect-ratio: ${num(W)} / ${num(H)}; border: 1px solid ${T25};
                background: ${TALLOW}; border-radius: 10px; }
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    /* Nothing on the paper but the sheet. Naming what to hide goes stale the
       first time the page grows a heading it has not heard of - which is exactly
       how the market sheet came to print a second page carrying three stray
       <h3>s - so this names what to KEEP instead, and cannot rot. */
    .wrap > *:not(.sheets) { display: none; }
    .sheets figcaption { display: none; }
    .sheets figure { position: relative; width: ${MM.sheet.widthMm}mm; height: ${MM.sheet.heightMm}mm; overflow: hidden;
                     break-after: page; page-break-after: always; margin: 0; }
    .sheets img { position: absolute; left: -${MM.sheet.bleedMm}mm; top: -${MM.sheet.bleedMm}mm;
                  width: ${num(MM.sheet.widthMm + 2 * MM.sheet.bleedMm)}mm; height: ${num(MM.sheet.heightMm + 2 * MM.sheet.bleedMm)}mm;
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
  <a href="../markets/index.html">The market board</a>
  <a href="../map/index.html">The map</a>
</div>
<h1>The mini-map sheets</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note">${esc(spec.board.note)}</p>
<p class="note">The pattern on each field is that terrain's own <strong>map mark</strong>, from
<code>data/terrain.json</code> — the same path the campaign map's legend swatch traces, drawn on the ink plate
so a sheet still says which ground it is with the colour dropped.</p>
<p class="note">Each cell is <strong>${WORLD.mm}&nbsp;mm across the flats</strong> — a world-map hex on the
<code>${esc(WORLD.map)}</code> map at its <code>${esc(WORLD.preset)}</code> print preset, read from the map rather than
typed here. ${ROWS} cells across, ${cells().length} cells in all. Generated by <code>tools/build-minimaps.mjs</code>
from <code>data/minimap.json</code>, <code>data/components.json</code> and <code>data/terrain.json</code> — edit
those, re-run the tool, and never these files.</p>
<h2>Why the grid is hexagonal</h2>
<p class="note">${esc(spec.hexGrid.why)}</p>
<h2>The sheets</h2>
<!-- <img>, not <object>. An <object> is a nested browsing context, and a nested
     browsing context is the one thing a print preview is not obliged to paint. On
     this page that is not a degraded print, it is a blank sheet: everything else is
     display:none by then, so the sheet is the only thing on the paper. The card
     sheet pays that price on purpose - an SVG in an <img> may not fetch the plate it
     draws, and the plate is the card - but these sheets draw every mark themselves and
     fetch nothing, so they have nothing to buy with it. -->
<div class="sheets">
${terrain.terrains.map((t) => `  <figure><img src="sheets/field-${t.id}.svg" alt="Mini-map: ${esc(t.name)}"><figcaption>${esc(t.name)} (${esc(t.code)}) — ${esc(palette.terrain[t.id].wash)}</figcaption></figure>`).join('\n')}
</div>
</div>
</body>
</html>
`;

const INDEX_DIR = join(ROOT, 'docs', 'minimaps');
const keep = new Set(sheets.map(([f]) => f));
const stale = existsSync(OUT_DIR) ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !keep.has(f)) : [];

if (checkOnly) {
  const drifted = [];
  for (const [file, body] of sheets) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    if (current !== body) drifted.push(file);
  }
  let currentIndex = '';
  try { currentIndex = readFileSync(join(INDEX_DIR, 'index.html'), 'utf8'); } catch { /* absent */ }
  if (currentIndex !== index) drifted.push('index.html');
  if (drifted.length || stale.length) {
    console.error(`docs/minimaps is stale (${[...drifted, ...stale.map((f) => f + ' should not exist')].join(', ')}). Run: node tools/build-minimaps.mjs`);
    process.exit(1);
  }
  console.log('docs/minimaps is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of sheets) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  writeFileSync(join(INDEX_DIR, 'index.html'), index, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote ${sheets.length} mini-map sheets to docs/minimaps/sheets/ — ${MM.sheet.widthMm}x${MM.sheet.heightMm}mm, ` +
    `${ROWS} cells across (${cells().length} cells) at ${WORLD.mm}mm, the ${WORLD.map} hex on its ${WORLD.preset} preset; ` +
    `field ${num(FIELD_W / U)}x${num(FIELD_H / U)}mm, panels ${num(PANEL_W / U)}mm` +
    (stale.length ? `; removed ${stale.length} sheet(s) no longer built` : '')
  );
}
