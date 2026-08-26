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
 * BOTH SIDES ARE DRAWN. The face is the building finished, the back is the same
 * ground with the work not yet done - so a tile is two commissions, not one, and
 * the mint carries two subjects for every tile. The back used to be generated
 * from a lathe, a word and a row of terrain marks; a picture says what it was
 * saying, and says it better.
 *
 * Two plates in the printing sense too (docs/art/01-two-plate-system.md): #wash
 * is the paper and the picture, #ink is the cut line, the band and every letter,
 * #grime is the wear. Drop #wash and a tile is still a playable piece with
 * its name on it — which is the black-and-white edition, and also what the set
 * looks like today.
 *
 * Usage: node tools/build-tiles.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readTiles, tileSubjects, plateIdOf, worldHexMm, boxOf, outlineOf, cellPaths, bandOf } from './lib/tiles.mjs';
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
  const band = bandOf(row.cells, FLATS, T.nameBand.heightPerCell);
  const put = (pt) => ({ x: pt.x + ox, y: pt.y + oy });
  return {
    /* The name band, hugging one edge of the piece rather than ruled across the
       middle of it. Put on the page here, once, so nothing downstream has to
       remember to shift it. */
    band: {
      ...band,
      quad: band.quad.map(put),
      midline: { ...band.midline, ...put(band.midline) },
    },
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
function picture(plate, g) {
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
  const b = g.band;
  const caps = text.toUpperCase();
  /* The size that fits, never the size we would like. Solved rather than
     guessed: the band's own midline, less its inset either end, over what this
     many letters cost at one point of type. The band is a good deal shorter than
     the corner-to-corner strip it replaced, so this is doing real work now -
     see bandOf in tools/lib/tiles.mjs for what was traded for what. */
  const room = b.midline.length - 2 * BAND_INSET;
  const size = Math.min(BAND_FONT, room / (caps.length * (CAP_WIDTH + T.nameBand.trackingPerCell / T.nameBand.fontPerCell)));
  if (size < MIN_FONT) {
    throw new Error(
      `"${text}" will not set above the ${T.nameBand.minFontMm} mm floor on a ${num(b.midline.length / U)} mm band ` +
      `(${where}) - it needs ${num(size / U)} mm. Shorten the name; do not shrink the type.`
    );
  }
  const quad = b.quad.map((p) => `${num(p.x)},${num(p.y)}`).join(' L ');
  return [
    `<path d="M ${quad} Z" fill="${tint(T.nameBand.tint)}"/>`,
    `<g transform="rotate(${num(b.midline.angle)} ${num(b.midline.x)} ${num(b.midline.y)})">` +
      `<text x="${num(b.midline.x)}" y="${num(b.midline.y + size * 0.35)}" font-size="${num(size)}" ` +
      `text-anchor="middle" font-family="${SANS}" font-weight="bold" ` +
      `letter-spacing="${num(size * T.nameBand.trackingPerCell / T.nameBand.fontPerCell)}" ` +
      `fill="${TALLOW}">${esc(caps)}</text></g>`,
  ].join('\n    ');
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

/**
 * One side of a tile, and there is only one function because there is only one
 * kind of thing: a plate cropped to the footprint, a name band hugging one edge,
 * the die line, and some wear.
 *
 * The face is the building finished; the back is the same ground with the work
 * not yet done. That is a difference of subject, not of construction, so it is a
 * difference of which plate and which word and nothing else. The back used to be
 * generated - a lathe, a word and a row of terrain marks - and it is a drawn
 * plate now, which is why this is one function rather than two.
 */
function side(row, which) {
  const g = geometryOf(row);
  const plate = plateIdOf(row, which);
  const clip = `cut-${plate}`;
  const label = which === 'back' ? row.back : row.label;
  const { art, waiting } = picture(plate, g);

  const what = which === 'back'
    ? `The ${row.back.toLowerCase()} side. A ${row.kind === 'field' ? 'field is laid this way up the round it is sown and turned over when it ripens' : 'building is laid this way up the round its work starts and turned over when the effort is paid'}, so the picture is the same ground with the work not yet done.`
    : `${row.summary}`;

  return {
    waiting,
    file: which === 'back' ? `back-${row.id}.svg` : `${row.id}.svg`,
    svg: shell(row, g, `${row.name} — building tile${which === 'back' ? ', back' : ''}`,
      `${what} The ${row.shape} footprint is ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'}, worked out from this ${row.kind === 'field' ? 'crop' : "building's"} own numbers through the ground model in data/buildingtiles.json.${waiting ? ' The window is bare paper: this plate has not been drawn yet, and the tile is a playable blank until it is.' : ''}`,
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
  <!-- the name, in a band hugging the lower-right edge and running parallel to
       it. Not across the middle: a bar through a small drawing splits it into
       two unrelated halves, which is what the first version looked like -->
  <g clip-path="url(#${clip})">
    ${band(label, g, `${row.id} ${which}`)}
  </g>

  <!-- the die line, traced off the cells rather than drawn over them -->
  <path d="${g.outline}" transform="${g.shift}" fill="none" stroke="${SOOT}" stroke-width="${T.cut.strokeWidth}" stroke-linejoin="round"/>
</g>

<!-- ============================================================ GRIME -->
<g id="grime" clip-path="url(#${clip})">
  ${grime(plate, g)}
</g>`),
  };
}

/* ------------------------------------------------------------------ output */

const rows = tileSubjects(ROOT);
const files = [];
const waiting = [];

for (const row of rows) {
  for (const which of ['face', 'back']) {
    const built = side(row, which);
    if (built.waiting) waiting.push(plateIdOf(row, which));
    files.push([built.file, built.svg]);
  }
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
<p class="note">${esc(spec.sides.back.carries.join('; '))}. A tile goes down back-up the round its work starts and is
turned over when the effort is paid, so the back is a drawn plate of its own — every tile in this set is two
commissions, not one.</p>
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
