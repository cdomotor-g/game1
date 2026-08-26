#!/usr/bin/env node
/**
 * Draws the building tiles — one face and one back per building and per sown
 * crop — from data/buildingtiles.json, data/components.json, data/buildings.json
 * and data/recipes.json.
 *
 * A tile is a hex, or a small clump of hexes, and ONE cell of it is exactly a
 * mini-map cell, which is exactly a world-map hex. That is read off the campaign
 * map's own print preset by tools/lib/tiles.mjs — the same function
 * tools/build-minimaps.mjs reads it with — so the three are one fact rather than
 * three that agree. Print the map at a bigger preset and every tile in the box
 * grows with it.
 *
 * NOTHING IN THIS FILE IS A COORDINATE. The cut line is traced off the cells; the
 * name band sits on the bottom row's shoulder line, which is the height at which a
 * pointy-top hex is still at its full width; every weight and size is a fraction
 * of the cell in data/components.json buildingTile. So a bigger cell makes a
 * bigger band at a bigger type size, and a shape nobody has drawn before comes
 * out right the first time. If you find yourself typing an x or a y here, the
 * number belongs in components.json.
 *
 * HOW BIG A TILE IS, IS NOT DECIDED HERE EITHER. It is worked out from the
 * building's own numbers — the fabric it takes to raise and the yard it has to
 * hold — through the ground model and ladder in data/buildingtiles.json. Add a
 * worker slot to a building and its tile may grow a cell, and the build says so.
 *
 * A TILE BUILDS WITHOUT ITS PLATE, and that is the one place this differs from
 * tools/build-cards.mjs. A card whose portrait has not arrived is a card with a
 * hole in it, so build-cards skips it; a tile whose plate has not arrived is a
 * blank counter, which is exactly what a prototype tile is. So every tile is cut,
 * banded and named from the day its building exists, the whole set is printable
 * this afternoon, and a plate landing later fills the window without changing
 * anything else on the piece.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash is the paper
 * and the picture, #ink is the cut line, the band, every letter, the lathe and the
 * marks, #grime is the wear. Drop #wash and a tile is still a playable piece with
 * its name on it — which is the black-and-white edition, and also what the set
 * looks like today.
 *
 * Usage: node tools/build-tiles.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readTiles, tileSubjects, plateIdOf, worldHexMm, boxOf, outlineOf, cellPaths, centreOf } from './lib/tiles.mjs';
import { crop, readFraming } from './lib/framing.mjs';
import { pngSize } from './lib/png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'tiles');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = readTiles(ROOT);
const terrain = read('terrain.json');
const framing = readFraming(ROOT);

const T = components.buildingTile;
const MARK = components.marks.terrain;
const LATHE = components.back.lathe;
const U = components.stock.unitsPerMm;

const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const FOXING = palette.paper.foxing.hex;
const tint = (k) => palette.ink.tints[k].hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/* ------------------------------------------------------- the cell and the ink */

const WORLD = worldHexMm(ROOT);
const FLATS = WORLD.mm * U;                 // one cell, across the flats, in units
const BLEED = T.bleedMm * U;
const perCell = (k) => T[k] * FLATS;        // a components.json fraction, in units

const BAND_H = T.nameBand.heightPerCell * FLATS;
const BAND_FONT = T.nameBand.fontPerCell * FLATS;
const MIN_FONT = T.nameBand.minFontMm * U;
/* Bold caps in a grotesque run about this fraction of their point size per
   letter. It is an estimate and it is allowed to be one: it is only ever used to
   make type SMALLER than a size that already fits, so being a little pessimistic
   costs a fraction of a millimetre, and the other way round is the only failure
   that matters. */
const CAP_WIDTH = 0.7;
const BAND_INSET = T.nameBand.insetPerCell * FLATS;

/* ------------------------------------------------------------------ pieces */

function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/**
 * The geometry of one tile: its footprint placed inside a bleed, and the box the
 * whole SVG is. Everything downstream measures off this and nothing measures off
 * a number in this file.
 */
function geometryOf(row) {
  const box = boxOf(row.cells, FLATS);
  const ox = BLEED - box.x;
  const oy = BLEED - box.y;
  return {
    box,
    shiftX: ox,
    shiftY: oy,
    w: box.w + 2 * BLEED,
    h: box.h + 2 * BLEED,
    /* Everything the shape helpers return is in footprint space; this shifts it
       onto the page, once, so no caller has to remember to. */
    shift: `translate(${num(ox)} ${num(oy)})`,
    trim: { x: BLEED, y: BLEED, w: box.w, h: box.h },
    shoulderY: box.shoulderY + oy,
    /* Where the band and the marks actually sit: the bottom row's own span, put
       on the page. Not the bounding box's - see boxOf in tools/lib/tiles.mjs. */
    row: { x: box.row.x + ox, w: box.row.w, centreX: box.row.x + ox + box.row.w / 2 },
    outline: outlineOf(row.cells, FLATS, num),
    cells: cellPaths(row.cells, FLATS, num),
    centre: { x: BLEED + box.w / 2, y: BLEED + box.h / 2 },
  };
}

/**
 * The picture, cropped on its subject box and clipped to the cut line.
 *
 * The same `crop()` a card window uses, through the same framing.json, so a tile
 * and a card cut from the same plate could not disagree about where the subject
 * is. Where there is no plate the window is bare paper — see the header: a tile
 * without its picture is a blank counter, not a broken tile.
 */
function picture(row, g) {
  const plate = plateIdOf(row);
  const file = join(RENDERS, `${plate}.png`);
  if (!existsSync(file)) return { art: '', waiting: true };

  const size = pngSize(file);
  const entry = framing.plates[plate];
  const rect = entry
    ? crop(size, entry.subject, g.box.w / g.box.h, framing.pad, entry.focal, entry.focalTargetOverride || framing.focalTarget)
    : { x: 0, y: 0, w: 1, h: 1 };

  /* The crop is a rectangle of the PLATE; the window is the tile's own box. Scale
     the plate so that rectangle fills the window, then slide it into place. */
  const scale = g.box.w / (rect.w * size.width);
  return {
    waiting: false,
    art:
      `<image href="../art/renders/${plate}.png" ` +
      `x="${num(BLEED - rect.x * size.width * scale)}" y="${num(BLEED - rect.y * size.height * scale)}" ` +
      `width="${num(size.width * scale)}" height="${num(size.height * scale)}" preserveAspectRatio="none"/>`,
  };
}

/**
 * The name band: a rule of tint across the bottom row's shoulder line, clipped to
 * the cut so it can never overhang a hex it does not belong to, with the name
 * knocked out of it in paper.
 */
function band(text, g, where) {
  const y = g.shoulderY - BAND_H;
  const caps = text.toUpperCase();
  /* The size that fits, never the size we would like. Solved rather than
     guessed: the band's own width, less its inset, over what this many letters
     cost at one point of type. "Charcoal Kiln" does not fit across a 17 mm hex
     at the nominal size, and a name that is clipped is worse than a name that is
     small. */
  const room = g.row.w - 2 * BAND_INSET;
  const size = Math.min(BAND_FONT, room / (caps.length * (CAP_WIDTH + T.nameBand.trackingPerCell / T.nameBand.fontPerCell)));
  if (size < MIN_FONT) {
    throw new Error(
      `"${text}" will not set above the ${T.nameBand.minFontMm} mm floor on a ${num(g.row.w / U)} mm band ` +
      `(${where}) - it needs ${num(size / U)} mm. Shorten the name; do not shrink the type.`
    );
  }
  return [
    `<rect x="${num(g.row.x - 2)}" y="${num(y)}" width="${num(g.row.w + 4)}" height="${num(BAND_H)}" fill="${tint(T.nameBand.tint)}"/>`,
    `<text x="${num(g.row.centreX)}" y="${num(y + BAND_H / 2 + size * 0.35)}" font-size="${num(size)}" ` +
      `text-anchor="middle" font-family="${SANS}" font-weight="bold" letter-spacing="${num(size * T.nameBand.trackingPerCell / T.nameBand.fontPerCell)}" ` +
      `fill="${TALLOW}">${esc(text.toUpperCase())}</text>`,
  ].join('\n    ');
}

/**
 * The engine-turned ground on the back — the deck backs' own lathe (components
 * .json back.lathe), struck from the tile's centre rather than a card's, so it is
 * symmetrical by construction and a tile put down in any of six rotations looks
 * the same from across the table.
 */
function lathe(g) {
  /* Out to the furthest corner of the CUT, not to half the shorter side. A disc
     inscribed in a hexagon leaves its six corners bare and reads as something
     stuck on; a disc that reaches the corners is a ground the piece was struck
     from. Measured off the outline rather than assumed, so a shape nobody has
     drawn yet comes out right the first time. */
  const R = Math.max(...g.outline.match(/-?[\d.]+,-?[\d.]+/g).map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    return Math.hypot(x + g.shiftX - g.centre.x, y + g.shiftY - g.centre.y);
  }));
  const rings = Array.from({ length: LATHE.rings }, (_, i) =>
    `<circle cx="${num(g.centre.x)}" cy="${num(g.centre.y)}" r="${num((R * (i + 1)) / LATHE.rings)}"/>`).join('');
  const rays = Array.from({ length: LATHE.rays }, (_, i) => {
    const a = (Math.PI * 2 * i) / LATHE.rays;
    return `<line x1="${num(g.centre.x + Math.cos(a) * R * 0.18)}" y1="${num(g.centre.y + Math.sin(a) * R * 0.18)}" ` +
      `x2="${num(g.centre.x + Math.cos(a) * R)}" y2="${num(g.centre.y + Math.sin(a) * R)}"/>`;
  }).join('');
  return `<g fill="none" stroke="${SOOT}" stroke-width="${LATHE.strokeWidth}" opacity="${LATHE.opacity}">${rings}${rays}</g>`;
}

/** One mark drawn from a 24-grid path into a box of `size` centred on x, y. */
function markAt(path, x, y, size) {
  const k = size / 24;
  return `<g transform="translate(${num(x - 12 * k)} ${num(y - 12 * k)}) scale(${num(k)})"><path d="${path}"/></g>`;
}

/**
 * The ground this tile may stand on, as a row of the world map's own terrain
 * marks along the bottom of the back — plus the deposit mark where the building
 * has to sit on something dug, and the water mark where it has to sit on an edge.
 *
 * These are the marks the mini-map fields are patterned with and the map legend
 * traces. Nothing here draws a new grass tuft: a tile that invented its own would
 * be a tile a player could not match to the ground under it.
 */
function groundMarks(row, g) {
  const byId = new Map(terrain.terrains.map((t) => [t.id, t]));
  const paths = [];
  for (const id of row.terrain) {
    const t = byId.get(id);
    if (!t?.mark?.path) throw new Error(`terrain.json declares no mark for "${id}" — tile ${row.id} cannot say where it may stand`);
    paths.push(t.mark.path);
  }
  if (row.waterside) {
    const water = terrain.terrains.find((t) => t.id === 'shallow-water');
    if (!water?.mark?.path) throw new Error('terrain.json declares no shallow-water mark — a waterside tile cannot say what it needs');
    paths.push(water.mark.path);
  }
  if (row.deposit) paths.push(T.backMarks.deposit);

  const size = T.backMarks.sizePerCell * FLATS;
  const gap = T.backMarks.gapPerCell * FLATS;
  /* One row, as wide as the piece is, less the band's own inset either side. A
     list that does not fit is not shown at all - see components.json
     buildingTile.backMarks: a building that suits six kinds of ground suits
     whatever is under it, and a blank back says that better than a crowd. */
  const fits = Math.floor((g.row.w - 2 * BAND_INSET + gap) / (size + gap));
  if (!paths.length || paths.length > fits) return { marks: '', height: 0, shown: 0, of: paths.length };

  const width = paths.length * size + (paths.length - 1) * gap;
  const y = g.shoulderY - BAND_H - BAND_INSET - size / 2;
  const x0 = g.row.centreX - width / 2 + size / 2;
  return {
    height: size + BAND_INSET,
    shown: paths.length,
    of: paths.length,
    marks:
      `<g fill="${MARK.fill}" stroke="${SOOT}" stroke-width="${T.backMarks.strokeWidth}" ` +
      `stroke-linecap="${MARK.strokeLinecap}" stroke-linejoin="${MARK.strokeLinejoin}">` +
      paths.map((p, i) => markAt(p, x0 + i * (size + gap), y, size)).join('') +
      '</g>',
  };
}

function grime(seed, g) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 5 }, () =>
    `<circle cx="${num(BLEED + rand() * g.box.w)}" cy="${num(BLEED + rand() * g.box.h)}" r="${num(0.8 + rand() * 1.4)}"/>`).join('');
  const r = Math.min(g.box.w, g.box.h) * 0.12;
  return (
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>` +
    `<circle cx="${num(BLEED + g.box.w * 0.26)}" cy="${num(BLEED + g.box.h * 0.32)}" r="${num(r)}" ` +
    `fill="none" stroke="${FOXING}" stroke-width="2.4" opacity="0.4"/>`
  );
}

/* ------------------------------------------------------------------- sides */

/* A clip id has to be unique per DOCUMENT, and both index.html and the proof
   sheet put many tiles in one. `cut` was fine while a tile was only ever alone
   in its own file, and became a bug the moment two shared a page: every tile
   after the first clipped to the first one's outline. */
const shell = (row, g, title, desc, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(g.w)} ${num(g.h)}" width="${num(g.w)}" height="${num(g.h)}" font-family="${SERIF}">
<title>${esc(title)}</title>
<desc>${esc(desc)} Generated by tools/build-tiles.mjs from data/buildingtiles.json, data/components.json, data/buildings.json and data/recipes.json - do not edit. ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'} of ${WORLD.mm} mm across the flats, which is a world-map hex on the ${esc(WORLD.map)} ${esc(WORLD.preset)} preset and a mini-map cell; ${num(g.box.w / U)} x ${num(g.box.h / U)} mm inside a ${T.bleedMm} mm bleed, at ${U} units/mm. The ink plate alone is the black-and-white edition.</desc>
${body}
</svg>
`;

function face(row) {
  const g = geometryOf(row);
  const clip = `cut-${row.id}`;
  const { art, waiting } = picture(row, g);
  return {
    waiting,
    svg: shell(row, g, `${row.name} — building tile`,
      `${row.summary} The ${row.shape} footprint is ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'}, worked out from this ${row.kind === 'field' ? 'crop' : "building's"} own numbers through the ground model in data/buildingtiles.json.${waiting ? ' The picture window is bare paper: this plate has not been drawn yet, and the tile is a playable blank until it is.' : ''}`,
      `<defs>
  <clipPath id="${clip}">${g.cells.map((d) => `<path d="${d}" transform="${g.shift}"/>`).join('')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(g.w)}" height="${num(g.h)}" fill="${TALLOW}"/>
  <g clip-path="url(#${clip})">
    ${art}
  </g>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the name, in a band on the bottom row's shoulder line - the height at
       which a pointy-top hex is still at its full width. Clipped to the cut, so
       it can never overhang a cell the tile does not own -->
  <g clip-path="url(#${clip})">
    ${band(row.label, g, row.id)}
  </g>

  <!-- the die line, traced off the cells rather than drawn over them -->
  <path d="${g.outline}" transform="${g.shift}" fill="none" stroke="${SOOT}" stroke-width="${T.cut.strokeWidth}" stroke-linejoin="round"/>
</g>

<!-- ============================================================ GRIME -->
<g id="grime" clip-path="url(#${clip})">
  ${grime(row.id, g)}
</g>`),
  };
}

function back(row) {
  const g = geometryOf(row);
  const clip = `cut-${row.id}-back`;
  const ground = groundMarks(row, g);

  return shell(row, g, `${row.name} — building tile, back`,
    `The placement side. A ${row.kind === 'field' ? 'field is laid back-up the round it is sown and stays there until it ripens' : 'building is laid back-up the round its work starts and stays there until the effort is paid'}, which is exactly when a player needs to know what ground it may stand on - so the marks are the world map's own terrain marks, from data/terrain.json. ${ground.shown ? `This one names ${ground.shown} ground${ground.shown === 1 ? '' : 's'}.` : 'This one names none: it stands on whatever is under it.'}`,
    `<defs>
  <clipPath id="${clip}">${g.cells.map((d) => `<path d="${d}" transform="${g.shift}"/>`).join('')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<!-- A back has no picture. The paper is the whole wash plate. -->
<g id="wash">
  <rect x="0" y="0" width="${num(g.w)}" height="${num(g.h)}" fill="${TALLOW}"/>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <g clip-path="url(#${clip})">
    <!-- the deck backs' own engine-turned ground, struck from the tile's centre
         so a tile put down any of six ways round reads the same -->
    ${lathe(g)}
    <!-- what ground this may stand on: the world map's own marks, never a new one -->
    ${ground.marks}
    ${band(row.back, g, `${row.id} back`)}
  </g>
  <path d="${g.outline}" transform="${g.shift}" fill="none" stroke="${SOOT}" stroke-width="${T.cut.strokeWidth}" stroke-linejoin="round"/>
</g>

<!-- ============================================================ GRIME -->
<g id="grime" clip-path="url(#${clip})">
  ${grime(`${row.id}-back`, g)}
</g>`);
}

/* ------------------------------------------------------------------ output */

const rows = tileSubjects(ROOT);
const files = [];
const waiting = [];

for (const row of rows) {
  const f = face(row);
  if (f.waiting) waiting.push(row.id);
  files.push([`${row.id}.svg`, f.svg]);
  files.push([`back-${row.id}.svg`, back(row)]);
}

/* One line per shape, for the print page and the index: how big a tile of this
   shape actually comes out, so nobody has to measure a screenshot. */
const shapes = [...new Set(rows.map((r) => r.shape))].map((id) => {
  const row = rows.find((r) => r.shape === id);
  const g = geometryOf(row);
  return {
    id,
    cells: row.cells.length,
    widthMm: num(g.box.w / U),
    heightMm: num(g.box.h / U),
    bleedWidthMm: num(g.w / U),
    bleedHeightMm: num(g.h / U),
    count: rows.filter((r) => r.shape === id).length,
    note: spec.shapes[id].note,
  };
});

/**
 * A tile's SVG markup, dropped straight into the page.
 *
 * NOT `<img src="...">`, which is what this page did first and is why the hut
 * came out as an empty hexagon. An SVG inside an `<img>` is an isolated document
 * and may not fetch anything - so the `<image>` that draws the plate never loads,
 * and every tile with art on it renders as a blank counter. The cards page hits
 * the same wall and buys its way out with `<object>`; a tile is small enough that
 * inlining is cheaper than a browsing context each, and unlike an `<object>` it
 * is reliably painted when the page is printed - which matters here, because
 * printing this page at true size is how a prototype set gets made.
 */
const built = new Map(files);
const inline = (file) => built.get(file).trim();

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the building tiles</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${tint('70')}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${tint('85')}; }
  table { border-collapse: collapse; font-family: ${SANS}; font-size: 13px; margin: 8px 0 4px; }
  th, td { text-align: left; padding: 3px 14px 3px 0; border-bottom: 1px solid ${tint('12')}; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 14px; align-items: end; }
  figure { margin: 0; }
  figure svg { display: block; width: 100%; height: auto; }
  figcaption { font-family: ${SANS}; font-size: 11.5px; color: ${tint('70')}; margin-top: 3px; }
  @media print {
    /* Names what to KEEP rather than what to hide, so the page cannot grow a
       heading this rule has not heard of - the lesson the market sheet learned
       by printing a second page of stray <h3>s. */
    .wrap > *:not(.grid) { display: none; }
    .wrap { max-width: none; margin: 0; padding: 0; }
    .grid { display: block; }
    .grid + .grid { break-before: page; page-break-before: always; }
    .grid figcaption { display: none; }
    /* EVERY TILE AT ITS TRUE SIZE. A prototype set is scissors and a printer,
       and a tile printed 4% small is a tile that does not seat in a mini-map
       cell - which is the one promise this whole line rests on. So each piece
       carries its own millimetres, flowed with a gutter, and nothing is scaled
       to fit anything. The sizes come from the shape table above, which is
       measured off the built tiles, so they cannot disagree with the pieces. */
    .grid figure { display: inline-block; vertical-align: top; margin: 0 ${T.sheet.gutterMm}mm ${T.sheet.gutterMm}mm 0; }
${shapes.map((s) => `    .grid figure.${s.id} svg { width: ${s.bleedWidthMm}mm; height: ${s.bleedHeightMm}mm; }`).join('\n')}
    @page { size: A4 portrait; margin: ${T.sheet.marginMm}mm; }
  }
</style>
</head>
<body>
<div class="wrap">
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <a href="../minimaps/index.html">The mini-map sheets</a>
  <a href="../boards/index.html">The player board</a>
  <a href="../map/index.html">The map</a>
</div>
<h1>The building tiles</h1>
<p class="note">${esc(spec.$comment.split('\n\n')[1])}</p>
<p class="note">Each cell is <strong>${WORLD.mm}&nbsp;mm across the flats</strong> — a world-map hex on the
<code>${esc(WORLD.map)}</code> map at its <code>${esc(WORLD.preset)}</code> print preset, and therefore a mini-map
cell. Read from the map rather than typed here: print the map at a bigger preset and every tile grows with it.</p>
<p class="note">How many cells a building takes is <strong>not written on the building</strong>. It is worked out
from the building's own numbers — the effort it takes to raise, and what it has to hold — through the ground model
and ladder in <code>data/buildingtiles.json</code>. Add a worker slot and the build tells you the tile grew.</p>
<h2>The shapes</h2>
<table>
<tr><th>Shape</th><th>Cells</th><th>Trim</th><th>With bleed</th><th>Tiles</th><th></th></tr>
${shapes.map((s) => `<tr><td><code>${s.id}</code></td><td>${s.cells}</td><td>${s.widthMm} × ${s.heightMm} mm</td><td>${s.bleedWidthMm} × ${s.bleedHeightMm} mm</td><td>${s.count}</td><td>${esc(s.note)}</td></tr>`).join('\n')}
</table>
<p class="note"><strong>Printing:</strong> print this page at 100% — no “fit to page” — on A4 portrait. Every
tile then comes out at its own true size, faces first and backs after, and a piece cut out seats in a mini-map
cell without being trimmed. A tile printed 4% small is a tile that does not seat, which is the one promise this
line rests on.</p>
<h2>The tiles</h2>
<p class="note">${rows.length} tiles — ${rows.filter((r) => r.kind === 'building').length} buildings and
${rows.filter((r) => r.kind === 'field').length} fields. ${waiting.length
  ? `${waiting.length} are still waiting on a plate and print as playable blanks; <a href="../art/mint/QUEUE.md">the mint queue</a> says whose turn each one is.`
  : 'Every plate has landed.'}</p>
<div class="grid">
${rows.map((r) => `  <figure class="${r.shape}">${inline(`${r.id}.svg`)}<figcaption>${esc(r.name)} — ${r.cells.length} cell${r.cells.length === 1 ? '' : 's'}${r.ground == null ? '' : `, ground ${r.ground}`}</figcaption></figure>`).join('\n')}
</div>
<h2>The backs</h2>
<p class="note">${esc(spec.sides.back.carries.join(', '))} — one per tile, all generated. A tile goes down back-up
the round its work starts, which is exactly when a player needs to know what ground it may stand on.</p>
<div class="grid">
${rows.map((r) => `  <figure class="${r.shape}">${inline(`back-${r.id}.svg`)}<figcaption>${esc(r.name)} — ${esc(r.back)}</figcaption></figure>`).join('\n')}
</div>
</div>
</body>
</html>
`;

const pages = [['index.html', index]];
const keep = new Set([...files.map(([f]) => f), ...pages.map(([f]) => f)]);
const stale = existsSync(OUT_DIR)
  ? readdirSync(OUT_DIR).filter((f) => (f.endsWith('.svg') || f.endsWith('.html')) && !keep.has(f))
  : [];

if (checkOnly) {
  const drifted = [];
  for (const [file, body] of [...files, ...pages]) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    if (current !== body) drifted.push(file);
  }
  if (drifted.length || stale.length) {
    console.error(`docs/tiles is stale (${[...drifted, ...stale.map((f) => `${f} should not exist`)].join(', ')}). Run: node tools/build-tiles.mjs`);
    process.exit(1);
  }
  console.log('docs/tiles is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of [...files, ...pages]) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote ${rows.length} building tiles (${files.length} files) to docs/tiles/ — ` +
    `${shapes.map((s) => `${s.count} ${s.id} at ${s.widthMm}x${s.heightMm}mm`).join(', ')}; ` +
    `cell ${WORLD.mm}mm, the ${WORLD.map} hex on its ${WORLD.preset} preset` +
    (waiting.length ? `; ${waiting.length} still waiting on a plate and printing as blanks` : '') +
    (stale.length ? `; removed ${stale.length} file(s) no longer built` : '')
  );
}
