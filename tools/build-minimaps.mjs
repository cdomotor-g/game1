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
 * THREE FILES COME OUT, not one. The sheets themselves, an index.html that shows
 * them, and a print.html that puts the ones you want on paper - the same split
 * the cards already have, and for the same reason. A sheet is A4 landscape and
 * full bleed, so eleven of them is eleven pages of solid colour; index.html could
 * only ever print all of them, which is not what a table wants and is why the
 * page had no Print button worth pressing. print.html asks which ground and how
 * many first. It is generated here rather than written by hand because the paper,
 * the bleed and the cell are all numbers this file already holds, and a print page
 * that carried its own copy of them is a print page that can disagree with the
 * sheets it is printing.
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
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  figure { margin: 0 0 18px; }
  figcaption { font-family: ${SANS}; font-size: 12.5px; color: ${T70}; margin-top: 4px; }
  figcaption a { color: ${T85}; }
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
  <a class="primary" href="print.html">Print the sheets →</a>
</div>
<h1>The mini-map sheets</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note"><strong>${esc(spec.board.howMany)}</strong> So printing is its own page:
<a href="print.html">print.html</a> asks which ground and how many copies before it puts anything on
paper, and every caption below links straight to its own sheet. A mini-map is A4 landscape and full
bleed — printing the lot is eleven pages of solid colour, and a table almost never wants that.</p>
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
${terrain.terrains.map((t) => `  <figure><img src="sheets/field-${t.id}.svg" alt="Mini-map: ${esc(t.name)}"><figcaption>${esc(t.name)} (${esc(t.code)}) — ${esc(palette.terrain[t.id].wash)} · <a href="print.html?terrain=${esc(t.id)}">Print this one →</a></figcaption></figure>`).join('\n')}
</div>
</div>
</body>
</html>
`;

/* ------------------------------------------------------------- the print page */

/**
 * What print.html has to know about each sheet: enough to name it in the picker,
 * show its colour, and fetch it. Written into the page rather than fetched,
 * exactly as the card print page carries its own list - these pages have to work
 * double-clicked off a disk, where there is no server to ask.
 */
const PRINTABLE = terrain.terrains.map((t) => ({
  id: t.id, code: t.code, name: t.name, wash: palette.terrain[t.id].wash,
}));

const FULL_W = num(MM.sheet.widthMm + 2 * MM.sheet.bleedMm);
const FULL_H = num(MM.sheet.heightMm + 2 * MM.sheet.bleedMm);

const printPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Print the mini-map sheets — game1</title>
<link rel="stylesheet" href="../css/app.css">
<style>
  /* Screen: a control bar, a picker of ground, and a stack of sheet previews.
     Print: one sheet a page, at true size, and nothing else on the paper.

     This page wears app.css and the card and map print pages' control bar rather
     than index.html's own styling next door, because what it has to be
     recognisable AS is a print page. Three of them now, one bar.

     Prefixed, like both of those, and for the reason they each give: app.css
     already owns .sheet - it is the thumbnail tile in the sandbox, and its
     "img { width: 100% }" would size a sheet of paper to the width of a preview.
     So everything that is the paper carries mm-. The furniture keeps the card
     print page's names - .note, .picker, .empty - and, like that page, sets every
     property it cares about rather than inheriting half of somebody else's. */
  .printbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 18px;
              align-items: center; padding: 11px 18px; background: var(--bg-raised);
              border-bottom: 1px solid var(--line); }
  .printbar h1 { font-size: .95rem; margin: 0; }
  .printbar .spacer { flex: 1; }
  .printbar label { font-size: .78rem; color: var(--ink-soft); display: flex; gap: 5px; align-items: center; }
  .printbar select, .printbar button { font: inherit; font-size: .8rem; padding: 4px 9px; border-radius: 7px;
                                       border: 1px solid var(--line-strong); background: var(--bg); color: var(--ink); }
  .printbar button { cursor: pointer; }
  .printbar button:hover { border-color: var(--accent); }
  .printbar button.primary { background: var(--accent); border-color: var(--accent); color: var(--bg-raised); font-weight: 600; }
  .printbar a { color: var(--accent); font-size: .78rem; }

  .note { max-width: 70ch; margin: 18px auto 4px; padding: 0 18px; color: var(--ink-soft); font-size: .85rem; }
  .note p { margin: 0 0 6px; }
  .note strong { color: var(--ink); }

  /* The picker: one chip per terrain, carrying its printed colour and how many
     copies of it to run. Nought is how a sheet is left out, so the same control
     both chooses and counts. */
  .picker { max-width: 70ch; margin: 0 auto; padding: 0 18px 6px; }
  .picker h2 { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase;
               color: var(--ink-faint); margin: 12px 0 6px; display: flex; gap: 10px; align-items: baseline; }
  .picker h2 button { font: inherit; font-size: .72rem; text-transform: none; letter-spacing: 0;
                      background: none; border: none; color: var(--accent); cursor: pointer; padding: 0; }
  .pickrow { display: flex; flex-wrap: wrap; gap: 6px; }
  .pick { display: flex; gap: 7px; align-items: center; font-size: .78rem;
          border: 1px solid var(--line); border-radius: 999px; padding: 3px 5px 3px 8px; background: var(--bg-raised); }
  .pick[data-on="0"] { opacity: .45; }
  .pick .mm-swatch { width: 13px; height: 13px; border-radius: 3px; border: 1px solid var(--line-strong); }
  .pick .code { font-family: var(--mono); font-size: .7rem; color: var(--ink-faint); }
  .pick input { width: 3.2em; font: inherit; font-size: .75rem; padding: 2px 4px; border-radius: 6px;
                border: 1px solid var(--line-strong); background: var(--bg); color: var(--ink); }

  /* A sheet is ${MM.sheet.widthMm} mm wide - ${Math.round(MM.sheet.widthMm * 96 / 25.4)} px - which is wider than a laptop window, so the
     stack scrolls sideways and the frames centre themselves. Same arrangement as
     the map's print page, and for the same reason it gives: centring the overflow
     itself puts the left edge of every sheet somewhere a browser will not scroll to. */
  .mm-sheets { padding: 18px; overflow-x: auto; }
  .mm-frame { width: max-content; margin: 0 auto 22px; }
  .mm-frame:last-child { margin-bottom: 0; }
  .mm-label { font: 600 .72rem/1.4 var(--mono, monospace); letter-spacing: .05em; text-transform: uppercase;
              color: var(--ink-faint); margin: 0 0 5px; }

  /* The sheet is drawn with ${MM.sheet.bleedMm} mm of bleed all round, so it is laid ${MM.sheet.bleedMm} mm out and up
     inside a window the size of the trim: the bleed runs off the edge of the
     paper, which is the only place bleed is any use. Scaling the whole thing to
     fit the page instead prints it about 2% small - and a cell 2% small is no
     longer a world hex, which is the one promise a mini-map makes. */
  .mm-sheet { position: relative; width: ${MM.sheet.widthMm}mm; height: ${MM.sheet.heightMm}mm; overflow: hidden;
              background: #fff; box-shadow: var(--shadow); transform-origin: top left; }
  .mm-sheet img { position: absolute; display: block; left: -${MM.sheet.bleedMm}mm; top: -${MM.sheet.bleedMm}mm;
                  width: ${FULL_W}mm; height: ${FULL_H}mm; }
  .empty { padding: 40px 18px; text-align: center; color: var(--ink-faint); font-size: .85rem; }

  /* No paper picker, so the page size is settled here rather than from script:
     the sheet is ${MM.sheet.widthMm} x ${MM.sheet.heightMm} mm and there is nothing to choose. */
  @page { size: ${MM.sheet.widthMm}mm ${MM.sheet.heightMm}mm; margin: 0; }

  /* Nothing that is only there to make the preview readable may reach the paper.
     The preview scale is undone here and again from script on beforeprint,
     because a sheet printed at 86% is a sheet whose cells no longer match the
     board it is standing in for. */
  @media print {
    .printbar, .note, .picker, .mm-label { display: none !important; }
    .mm-sheets { padding: 0; overflow: visible; }
    .mm-frame { width: auto !important; height: auto !important; margin: 0 !important;
                break-after: page; page-break-after: always; }
    .mm-frame:last-child { break-after: auto; page-break-after: auto; }
    .mm-sheet { box-shadow: none; margin: 0; transform: none !important; }
  }
</style>
</head>
<body>

<div class="printbar">
  <h1>Print the mini-map sheets</h1>
  <label>preview
    <select id="zoom">
      <option value="fit">fit the window</option>
      <option value="1">100%</option>
      <option value="0.5">50%</option>
      <option value="0.25">25%</option>
    </select>
  </label>
  <span class="spacer"></span>
  <a href="index.html">← the sheets</a>
  <a href="../index.html">Explorer</a>
  <button type="button" class="primary" id="go-print">Print / save as PDF…</button>
</div>

<div class="note">
  <p id="summary"></p>
  <p><strong>Print at 100% — no “fit to page”, no scaling</strong>, on A4 landscape. Each cell then comes
  off the paper at <strong>${WORLD.mm}&nbsp;mm across the flats</strong>, which is a world-map hex on the
  <code>${esc(WORLD.map)}</code> map at its <code>${esc(WORLD.preset)}</code> preset: a figure based for the
  campaign board stands in a mini-map cell without being re-based. Scale the sheet to fit some other paper
  and that stops being true, which is why this page offers no paper but the one the sheet is drawn for.
  For a file rather than paper, print and choose <strong>Save as PDF</strong> — the page size is already
  set, so the PDF is true size too.</p>
  <p>The sheets bleed off all four edges. That is deliberate: they are drawn ${FULL_W}&nbsp;×&nbsp;${FULL_H}&nbsp;mm
  and laid ${MM.sheet.bleedMm}&nbsp;mm out and up, so the colour runs past the paper rather than stopping short of
  it in a white line. A home printer keeps a few millimetres of margin it cannot print in; that margin eats
  bleed, and never the field.</p>
  <p><strong>${esc(spec.board.howMany)}</strong> Both panels print on every sheet, so no sheet is ever the
  wrong sheet.</p>
</div>

<div class="picker" id="picker"></div>
<div class="mm-sheets" id="sheets"></div>

<script>
(function () {
  'use strict';

  /* Generated by tools/build-minimaps.mjs from data/terrain.json and the printed
     washes in docs/art/palette.json. */
  var SHEETS = ${JSON.stringify(PRINTABLE)};
  var CELL_MM = ${WORLD.mm}, SHEET_W = ${MM.sheet.widthMm}, SHEET_H = ${MM.sheet.heightMm};
  var MAX_COPIES = 20;

  /* A full set, one of each, is the default: that is what "one per terrain,
     printed once" means, and it is what this page replaced - hitting Ctrl-P on
     the sheets index could only ever print all eleven. The difference is that the
     summary now says how many pages that is before anybody presses anything. */
  var copies = {};
  SHEETS.forEach(function (s) { copies[s.id] = 1; });

  /* ?terrain=forest, or a code, or several of either, cuts it to that ground.
     Every caption on the sheets index links here that way, so the obvious route
     from one sheet is one sheet and not the set. */
  var asked = new URLSearchParams(location.search).get('terrain');
  if (asked) {
    var want = asked.toLowerCase().split(/[\\s,]+/).filter(Boolean);
    var hit = SHEETS.filter(function (s) {
      return want.indexOf(s.id) !== -1 || want.indexOf(s.code.toLowerCase()) !== -1;
    });
    /* A name nobody recognises leaves the full set alone rather than printing
       nothing: a typed URL should not silently come out blank. */
    if (hit.length) {
      SHEETS.forEach(function (s) { copies[s.id] = 0; });
      hit.forEach(function (s) { copies[s.id] = 1; });
    }
  }

  /* ------------------------------------------------------------- the picker */

  var picker = document.getElementById('picker');
  var head = document.createElement('h2');
  head.textContent = 'Which ground, and how many ';
  [['all', 1], ['none', 0]].forEach(function (pair) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = pair[0];
    b.addEventListener('click', function () {
      SHEETS.forEach(function (s) { copies[s.id] = pair[1]; });
      syncPicker();
      render();
    });
    head.appendChild(b);
  });
  picker.appendChild(head);

  var row = document.createElement('div');
  row.className = 'pickrow';
  SHEETS.forEach(function (s) {
    var label = document.createElement('label');
    label.className = 'pick';
    label.dataset.id = s.id;
    label.title = s.name + ' — ' + s.wash;

    var swatch = document.createElement('span');
    swatch.className = 'mm-swatch';
    swatch.style.background = s.wash;

    var code = document.createElement('span');
    code.className = 'code';
    code.textContent = s.code;

    var box = document.createElement('input');
    box.type = 'number';
    box.min = '0';
    box.max = String(MAX_COPIES);
    box.step = '1';
    box.setAttribute('aria-label', 'copies of ' + s.name);
    box.addEventListener('change', function () {
      var n = parseInt(box.value, 10);
      copies[s.id] = Math.max(0, Math.min(MAX_COPIES, isNaN(n) ? 0 : n));
      syncPicker();
      render();
    });

    label.appendChild(swatch);
    label.appendChild(code);
    label.appendChild(document.createTextNode(s.name));
    label.appendChild(box);
    row.appendChild(label);
  });
  picker.appendChild(row);

  function syncPicker() {
    Array.prototype.forEach.call(picker.querySelectorAll('.pick'), function (label) {
      var n = copies[label.dataset.id] || 0;
      label.dataset.on = n ? '1' : '0';
      label.querySelector('input').value = String(n);
    });
  }

  /* -------------------------------------------------------------- the sheets */

  var current = null;

  function render() {
    var queue = [];
    SHEETS.forEach(function (s) {
      for (var i = 0; i < (copies[s.id] || 0); i++) queue.push(s);
    });

    var chosen = SHEETS.filter(function (s) { return copies[s.id]; }).map(function (s) {
      return (copies[s.id] > 1 ? copies[s.id] + ' × ' : '') + s.name;
    });

    document.getElementById('summary').innerHTML = queue.length
      ? '<strong>' + queue.length + ' sheet' + (queue.length === 1 ? '' : 's') + ' — ' +
        queue.length + ' page' + (queue.length === 1 ? '' : 's') + ' of A4 landscape</strong>, ' +
        SHEET_W + ' × ' + SHEET_H + ' mm, one sheet a page: ' + chosen.join(', ') + '.'
      : '<strong>Nothing chosen.</strong> Pick some ground below — or press <em>all</em> for one of each.';

    var host = document.getElementById('sheets');
    host.innerHTML = '';

    if (!queue.length) {
      var none = document.createElement('p');
      none.className = 'empty';
      none.textContent = 'No sheets chosen.';
      host.appendChild(none);
      current = null;
      return;
    }

    queue.forEach(function (s, i) {
      var sheet = document.createElement('div');
      sheet.className = 'mm-sheet';

      /* <img>, not <object>. An <object> is a nested browsing context, and a
         nested browsing context is the one thing a print preview is not obliged
         to paint - which on a page whose every other element is display:none by
         then is not a degraded print but a blank sheet. The card sheet pays that
         price on purpose, because an SVG in an <img> may not fetch the plate it
         draws and the plate is the card; a mini-map draws every mark itself and
         fetches nothing, so it has nothing to buy with it. */
      var img = document.createElement('img');
      img.src = 'sheets/field-' + s.id + '.svg';
      img.alt = 'Mini-map: ' + s.name;
      sheet.appendChild(img);

      var label = document.createElement('p');
      label.className = 'mm-label';
      label.textContent = s.name + '  ·  page ' + (i + 1) + ' of ' + queue.length +
        '  ·  ' + SHEET_W + ' × ' + SHEET_H + ' mm at 100%, ' + CELL_MM + ' mm cells';

      var frame = document.createElement('div');
      frame.className = 'mm-frame';
      frame.appendChild(label);
      frame.appendChild(sheet);
      host.appendChild(frame);
    });

    current = { w: SHEET_W, h: SHEET_H };
    applyScale();
  }

  /* -------------------------------------------------------- preview scale */

  /* CSS fixes the millimetre at exactly 96/25.4 px, so this needs no measuring. */
  var MM_PX = 96 / 25.4;
  var zoom = document.getElementById('zoom');

  function applyScale(force) {
    if (!current) return;
    var host = document.getElementById('sheets');
    var wanted = force === undefined ? zoom.value : force;
    var wpx = current.w * MM_PX, hpx = current.h * MM_PX;
    var room = host.clientWidth - 36;                 /* the 18 px of padding either side */
    var scale = wanted === 'fit' ? Math.min(1, room / wpx) : parseFloat(wanted) || 1;

    Array.prototype.forEach.call(host.children, function (frame) {
      var sheet = frame.querySelector('.mm-sheet');
      if (!sheet) return;
      if (scale >= 1) {
        sheet.style.transform = '';
        frame.style.width = '';
        frame.style.height = '';
      } else {
        sheet.style.transform = 'scale(' + scale + ')';
        frame.style.width = Math.round(wpx * scale) + 'px';
        frame.style.height = Math.round(hpx * scale) + 'px';
      }
    });
  }

  zoom.addEventListener('change', function () { applyScale(); });
  window.addEventListener('resize', function () { applyScale(); });

  /* The @media print rules undo the preview scale on their own. This is the belt
     to that pair of braces: a cell must never reach paper at 86%. */
  window.addEventListener('beforeprint', function () { applyScale(1); });
  window.addEventListener('afterprint', function () { applyScale(); });
  document.getElementById('go-print').addEventListener('click', function () { window.print(); });

  syncPicker();
  render();
})();
</script>
</body>
</html>
`;

const INDEX_DIR = join(ROOT, 'docs', 'minimaps');
const keep = new Set(sheets.map(([f]) => f));
const stale = existsSync(OUT_DIR) ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !keep.has(f)) : [];

/* The two pages, checked and written the same way the sheets are: they carry the
   paper, the bleed and the cell in them, so a sheet that moves and a page that
   did not is exactly the drift --check is here to catch. */
const pages = [['index.html', index], ['print.html', printPage]];

if (checkOnly) {
  const drifted = [];
  for (const [file, body] of sheets) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    if (current !== body) drifted.push(file);
  }
  for (const [file, body] of pages) {
    let current = '';
    try { current = readFileSync(join(INDEX_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    if (current !== body) drifted.push(file);
  }
  if (drifted.length || stale.length) {
    console.error(`docs/minimaps is stale (${[...drifted, ...stale.map((f) => f + ' should not exist')].join(', ')}). Run: node tools/build-minimaps.mjs`);
    process.exit(1);
  }
  console.log('docs/minimaps is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of sheets) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const [file, body] of pages) writeFileSync(join(INDEX_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote ${sheets.length} mini-map sheets to docs/minimaps/sheets/ — ${MM.sheet.widthMm}x${MM.sheet.heightMm}mm, ` +
    `${ROWS} cells across (${cells().length} cells) at ${WORLD.mm}mm, the ${WORLD.map} hex on its ${WORLD.preset} preset; ` +
    `field ${num(FIELD_W / U)}x${num(FIELD_H / U)}mm, panels ${num(PANEL_W / U)}mm; ` +
    `and ${pages.length} pages to docs/minimaps/ — index.html shows them, print.html puts them on paper` +
    (stale.length ? `; removed ${stale.length} sheet(s) no longer built` : '')
  );
}
