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
 * ONE PLATE IS DRAWN, AND PRINTED TWO WAYS. The face is the building finished;
 * the back is that same plate with the colour run not laid on - the key block
 * pulled before the colour blocks - and its name band drawn hollow instead of
 * solid. So a tile is ONE mint subject, not two, and there is one function below
 * rather than two: the sides differ by a filter and a band, and by nothing else.
 * The rule they have to keep - that the two sides turn over onto each other - is
 * kept by construction, because they are one picture. See data/buildingtiles.json
 * sides for what that argument cost and why it was worth it.
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

const BACK = T.back;
const CELL = FLATS;                         // one cell across the flats, in units

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
function band(text, g, where, hollow = false) {
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
  /* Filled on the face, OUTLINED on the back. That one difference is the whole
     of what tells a player which way up the piece is, and it is deliberately the
     cheapest thing that could do it: no second band, no second word, and not one
     square millimetre of picture given up on a tile this small. */
  const plate = hollow
    ? `<path d="M ${quad} Z" fill="none" stroke="${tint(T.nameBand.tint)}" stroke-width="${num(BACK.bandStrokePerCell * CELL)}" stroke-linejoin="round"/>`
    : `<path d="M ${quad} Z" fill="${tint(T.nameBand.tint)}"/>`;
  return [
    plate,
    `<g transform="rotate(${num(b.midline.angle)} ${num(b.midline.x)} ${num(b.midline.y)})">` +
      `<text x="${num(b.midline.x)}" y="${num(b.midline.y + size * 0.35)}" font-size="${num(size)}" ` +
      `text-anchor="middle" font-family="${SANS}" font-weight="bold" ` +
      `letter-spacing="${num(size * T.nameBand.trackingPerCell / T.nameBand.fontPerCell)}" ` +
      `fill="${hollow ? tint(BACK.bandTextTint) : TALLOW}">${esc(caps)}</text></g>`,
  ].join('\n    ');
}

function grime(seed, g) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 5 }, () =>
    `<circle cx="${num(BLEED + rand() * g.box.w)}" cy="${num(BLEED + rand() * g.box.h)}" r="${num(0.8 + rand() * 1.4)}"/>`).join('');
  return `<g fill="${SOOT}" opacity="0.05">${specks}</g>`;
}

/* ------------------------------------------------------------------- sides */

/* A clip id has to be unique per DOCUMENT, and both index.html and the proof
   sheet put many tiles in one. `cut` was fine while a tile was only ever alone
   in its own file, and became a bug the moment two shared a page: every tile
   after the first clipped to the first one's outline. */
/* The colour run, not laid on. A separation rather than an effect: saturation to
   nothing, then the grey mapped straight back onto the deck's own two ends -
   soot where the ink was, tallow where the paper was. That is not a filter
   dressed up as printing, it is what a single-colour run IS, one ink on the
   stock, which is the thing a back is meant to be.

   Neutral grey on white was the first try and it was wrong twice over: it reads
   as a photocopy of the tile rather than a printing of it, and it breaks the one
   rule the whole set is built on - the paper is warm oatmeal and never white.

   No blur, no glow, no soft shading; the house style bans those outright, and a
   softened edge at seventeen millimetres would cost the silhouette the deck is
   built on. The numbers are data/components.json buildingTile.back, and the two
   ends are read from the palette by name so a palette that moves takes the back
   with it. */
const channels = (ref) => {
  const [group, name] = ref.split('.');
  const hex = palette[group][name].hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};
const DUOTONE = BACK.duotone.map(channels);   // [ink, paper], each [r, g, b]
const COLOUR_DROP = `<filter id="colour-drop" color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values="${BACK.saturation}"/>
    <feComponentTransfer>
      ${['R', 'G', 'B'].map((ch, i) =>
        `<feFunc${ch} type="table" tableValues="${num(DUOTONE[0][i])} ${num(DUOTONE[1][i])}"/>`).join('\n      ')}
    </feComponentTransfer>
    <feComponentTransfer>
      ${['R', 'G', 'B'].map((ch) => `<feFunc${ch} type="gamma" exponent="${BACK.gamma}"/>`).join('\n      ')}
    </feComponentTransfer>
  </filter>`;

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
  const back = which === 'back';
  /* One plate, two sides, so the clip id has to carry the side as well - both
     are on the proof sheet and the index at once, and an id that repeated would
     clip the second piece to the first one's outline. */
  const clip = `cut-${plate}-${which}`;
  /* The SAME name on both sides. The back said SITE once, which told a player
     something the picture already tells them and withheld the one thing it does
     not - which tile this is. */
  const label = row.label;
  const { art, waiting } = picture(plate, g);

  const what = back
    ? `The ${row.state} side. A ${row.kind === 'field' ? 'field is laid this way up the round it is sown and turned over when it ripens' : 'building is laid this way up the round its work starts and turned over when the effort is paid'}. It is the face's own plate with the colour run not laid on, and its name band drawn hollow: the two sides cannot drift apart because they are one picture.`
    : `${row.summary}`;

  return {
    waiting,
    file: back ? `back-${row.id}.svg` : `${row.id}.svg`,
    svg: shell(row, g, `${row.name} — building tile${back ? ', back' : ''}`,
      `${what} The ${row.shape} footprint is ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'}, worked out from this ${row.kind === 'field' ? 'crop' : "building's"} own numbers through the ground model in data/buildingtiles.json.${waiting ? ' The window is bare paper: this plate has not been drawn yet, and the tile is a playable blank until it is.' : ''}`,
      `<defs>
  <clipPath id="${clip}">${g.cells.map((d) => `<path d="${d}" transform="${g.shift}"/>`).join('')}</clipPath>${back ? `\n  ${COLOUR_DROP}` : ''}
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(g.w)}" height="${num(g.h)}" fill="${TALLOW}"/>
  <g clip-path="url(#${clip})"${back ? ' filter="url(#colour-drop)"' : ''}>
    ${art}
  </g>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the name, in a band hugging the lower-left edge and running parallel to
       it. Not across the middle: a bar through a small drawing splits it into
       two unrelated halves, which is what the first version looked like. The
       corner is components.json buildingTile.nameBand.edge, and lower-LEFT
       because the plates are drawn from thirty degrees to the left, which puts
       the business of the building on the right - see bandOf in lib/tiles.mjs -->
  <g clip-path="url(#${clip})">
    ${band(label, g, `${row.id} ${which}`, back && BACK.bandHollow)}
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
  .bar a.primary { margin-left: auto; padding: 4px 10px; border-radius: 7px; text-decoration: none;
                   border: 1px solid ${tint('40')}; background: ${tint('12')}; font-weight: 600; }
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
  <a class="primary" href="print.html">Print the tiles &rarr;</a>
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
<p class="note"><strong>Printing.</strong> ${esc(spec.howMany.note.split('. ')[0])}, so printing is its own page:
<a href="print.html">print.html</a> asks which tiles, how many of each and which sides before it puts anything on
paper, and every caption below links straight to its own tile. It is also the only one of the two that can lay the
backs out mirrored, which is what a two-sided run needs.</p>
<p class="note">This page still prints, as the short way round: at 100% — no “fit to page” — on
${T.sheet.widthMm}&nbsp;×&nbsp;${T.sheet.heightMm}&nbsp;mm paper, it puts every tile on the paper at its own true
size, all the faces and then all the backs. A tile printed 4% small is a tile that does not seat in a mini-map
cell, which is the one promise this line rests on.</p>
<h2>The tiles</h2>
<p class="note">${rows.length} tiles — ${rows.filter((r) => r.kind === 'building').length} buildings and
${rows.filter((r) => r.kind === 'field').length} fields. ${waiting.length
  ? `${waiting.length} are still waiting on a plate and print as playable blanks; <a href="../art/mint/QUEUE.md">the mint queue</a> says whose turn each one is.`
  : 'Every plate has landed.'}</p>
<div class="grid">
${rows.map((r) => `  <figure class="${r.shape}">${inline(`${r.id}.svg`)}<figcaption>${esc(r.name)} — ${r.cells.length} cell${r.cells.length === 1 ? '' : 's'}${r.ground == null ? '' : `, ground ${r.ground}`} · <a href="print.html?tile=${esc(r.id)}">Print this one →</a></figcaption></figure>`).join('\n')}
</div>
<h2>The backs</h2>
<p class="note">${esc(spec.sides.back.carries.join('; '))}. A tile goes down back-up the round its work starts and is
turned over when the effort is paid. The back is not a second drawing: it is the face's own plate with the colour
run not laid on and its name band drawn hollow, so the two sides cannot drift out of register with each other —
they are one picture, printed two ways.</p>
<div class="grid">
${rows.map((r) => `  <figure class="${r.shape}">${inline(`back-${r.id}.svg`)}<figcaption>${esc(r.name)} — ${esc(r.state)}</figcaption></figure>`).join('\n')}
</div>
</div>
</body>
</html>
`;

/* ------------------------------------------------------------- the print page */

/**
 * What print.html has to know about each tile: enough to name it in the picker,
 * group it, lay it out and fetch both its sides. Written into the page rather
 * than fetched, exactly as the card and mini-map print pages carry their own
 * lists - these pages have to work double-clicked off a disk, where there is no
 * server to ask.
 *
 * The two sides come through as MARKUP in a hidden stock below rather than as a
 * src on this record, for the reason index.html gives next door: an SVG inside
 * an <img> is an isolated document and never fetches the plate it draws, so
 * every tile with art on it would print as a blank counter. Cloned from the
 * stock, one node per copy, so twenty huts cost twenty nodes and one payload.
 */
const PRINTABLE = rows.map((r) => {
  const g = geometryOf(r);
  return {
    id: r.id, name: r.name, group: r.group, shape: r.shape,
    cells: r.cells.length,
    w: num(g.w / U), h: num(g.h / U),
  };
});

/* Nothing may be wider than the paper it is laid on. The shapes are derived and
   the margin is data, so this is a thing that can come true by somebody editing
   either one - and a tile that overhangs the sheet is caught here rather than by
   a player with scissors. Same guard build-board.mjs keeps over its tracks. */
const CONTENT_W = T.sheet.widthMm - 2 * T.sheet.marginMm;
const CONTENT_H = T.sheet.heightMm - 2 * T.sheet.marginMm;
const overhang = shapes.filter((s) => s.bleedWidthMm > CONTENT_W || s.bleedHeightMm > CONTENT_H);
if (overhang.length) {
  console.error(
    `a tile does not fit the print sheet: ${overhang.map((s) => `${s.id} is ${s.bleedWidthMm}x${s.bleedHeightMm}mm`).join(', ')} ` +
    `against ${CONTENT_W}x${CONTENT_H}mm of printable ${T.sheet.widthMm}x${T.sheet.heightMm}mm paper. ` +
    'Either the cell grew or data/components.json buildingTile.sheet shrank.'
  );
  process.exit(1);
}

const printPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Print the building tiles — game1</title>
<link rel="stylesheet" href="../css/app.css">
<style>
  /* Screen: a control bar, a picker of tiles, and a stack of imposed sheets.
     Print: those same sheets, at true size, and nothing else on the paper.

     This page wears app.css and the other print pages' control bar rather than
     index.html's own styling next door, for the reason the mini-map print page
     gives: what it has to be recognisable AS is a print page. Four of them now,
     one bar.

     Prefixed bt-, like the mini-map's mm-, and for the same reason it gives:
     app.css already owns names like .sheet, and inheriting half of somebody
     else's rule is how a sheet of paper ends up the width of a thumbnail. The
     furniture keeps the shared names - .printbar, .note, .picker, .empty. */
  .printbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 18px;
              align-items: center; padding: 11px 18px; background: var(--bg-raised);
              border-bottom: 1px solid var(--line); }
  .printbar h1 { font-size: .95rem; margin: 0; }
  .printbar .spacer { flex: 1; }
  .printbar label { font-size: .78rem; color: var(--ink-soft); display: flex; gap: 5px; align-items: center; }
  /* hidden is an attribute and the display:flex above beats it, which is how
     the flip control came to show in a mode that has nothing to flip. */
  .printbar label[hidden] { display: none; }
  .printbar select, .printbar button { font: inherit; font-size: .8rem; padding: 4px 9px; border-radius: 7px;
                                       border: 1px solid var(--line-strong); background: var(--bg); color: var(--ink); }
  .printbar button { cursor: pointer; }
  .printbar button:hover { border-color: var(--accent); }
  .printbar button.primary { background: var(--accent); border-color: var(--accent); color: var(--bg-raised); font-weight: 600; }
  .printbar a { color: var(--accent); font-size: .78rem; }

  .note { max-width: 74ch; margin: 18px auto 4px; padding: 0 18px; color: var(--ink-soft); font-size: .85rem; }
  .note p { margin: 0 0 6px; }
  .note strong { color: var(--ink); }

  /* The picker: one chip per tile, carrying how many copies of it to run, under
     a heading per group with its own all/none. Nought is how a tile is left out,
     so the same control both chooses and counts - the mini-map page's bargain,
     which is worth keeping when there are fifty-four of them rather than eleven.
     The groups are the buildings' own categories, not a grouping invented here. */
  .picker { max-width: 74ch; margin: 0 auto; padding: 0 18px 6px; }
  .picker h2 { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase;
               color: var(--ink-faint); margin: 14px 0 6px; display: flex; gap: 10px; align-items: baseline; }
  .picker h2 button { font: inherit; font-size: .72rem; text-transform: none; letter-spacing: 0;
                      background: none; border: none; color: var(--accent); cursor: pointer; padding: 0; }
  .pickrow { display: flex; flex-wrap: wrap; gap: 6px; }
  .pick { display: flex; gap: 7px; align-items: center; font-size: .78rem;
          border: 1px solid var(--line); border-radius: 999px; padding: 3px 5px 3px 9px; background: var(--bg-raised); }
  .pick[data-on="0"] { opacity: .45; }
  .pick .cells { font-family: var(--mono); font-size: .7rem; color: var(--ink-faint); }
  .pick input { width: 3.2em; font: inherit; font-size: .75rem; padding: 2px 4px; border-radius: 6px;
                border: 1px solid var(--line-strong); background: var(--bg); color: var(--ink); }

  /* A sheet is ${T.sheet.widthMm} mm wide - about ${Math.round(T.sheet.widthMm * 96 / 25.4)} px - which fits most windows but not all,
     so the stack scrolls sideways and the sheets centre themselves. Same
     arrangement as the mini-map and map print pages, and for the reason they
     give: centring the overflow itself puts the left edge of a sheet somewhere a
     browser will not scroll to. */
  .bt-sheets { padding: 18px; overflow-x: auto; }
  .bt-frame { width: max-content; margin: 0 auto 22px; }
  .bt-frame:last-child { margin-bottom: 0; }
  .bt-label { font: 600 .72rem/1.4 var(--mono, monospace); letter-spacing: .05em; text-transform: uppercase;
              color: var(--ink-faint); margin: 0 0 5px; }

  /* THE SHEET IS AN IMPOSITION, not a flow. Every piece is placed at an absolute
     millimetre on the paper, by script, because the backs have to be laid out
     MIRRORED to come out under their own faces on a two-sided run - and a browser
     flowing inline-blocks cannot be asked where its rows broke. It is also what
     makes true size unarguable: a piece is its own bleed box in millimetres and
     nothing is scaled to fit anything. */
  .bt-page { position: relative; width: ${T.sheet.widthMm}mm; height: ${T.sheet.heightMm}mm; overflow: hidden;
             background: ${TALLOW}; box-shadow: var(--shadow); transform-origin: top left; }
  .bt-piece { position: absolute; }
  .bt-piece svg { display: block; width: 100%; height: 100%; }
  .empty { padding: 40px 18px; text-align: center; color: var(--ink-faint); font-size: .85rem; }

  /* No paper picker, so the page size is settled here rather than from script:
     the sheet is data/components.json buildingTile.sheet and there is nothing to
     choose. Zero margin because the margin is already in the imposition - the
     pieces are placed at page coordinates, which is the only way a mirrored back
     can be trusted to land on its face. */
  @page { size: ${T.sheet.widthMm}mm ${T.sheet.heightMm}mm; margin: 0; }

  @media print {
    .printbar, .note, .picker, .bt-label { display: none !important; }
    .bt-sheets { padding: 0; overflow: visible; }
    .bt-frame { width: auto !important; height: auto !important; margin: 0 !important;
                break-after: page; page-break-after: always; }
    .bt-frame:last-child { break-after: auto; page-break-after: auto; }
    /* The preview scale is undone here and again from script on beforeprint. A
       tile printed at 86% is a tile that does not seat in a mini-map cell, which
       is the one promise this whole line rests on. */
    .bt-page { box-shadow: none; margin: 0; transform: none !important; }
  }
</style>
</head>
<body>

<div class="printbar">
  <h1>Print the building tiles</h1>
  <label>sides
    <select id="mode">
      <option value="faces">faces only</option>
      <option value="duplex">both sides, two-sided printing</option>
      <option value="pairs">both sides, side by side</option>
    </select>
  </label>
  <label id="flip-wrap" hidden>flip on
    <select id="flip">
      <option value="long">long edge</option>
      <option value="short">short edge</option>
    </select>
  </label>
  <label>preview
    <select id="zoom">
      <option value="fit">fit the window</option>
      <option value="1">100%</option>
      <option value="0.5">50%</option>
    </select>
  </label>
  <span class="spacer"></span>
  <a href="index.html">← the tiles</a>
  <a href="../index.html">Explorer</a>
  <button type="button" class="primary" id="go-print">Print / save as PDF…</button>
</div>

<div class="note">
  <p id="summary"></p>
  <p><strong>Print at 100% — no “fit to page”, no scaling</strong>, on ${T.sheet.widthMm}&nbsp;×&nbsp;${T.sheet.heightMm}&nbsp;mm paper.
  Each cell then comes off the sheet at <strong>${WORLD.mm}&nbsp;mm across the flats</strong>, which is a world-map hex
  on the <code>${esc(WORLD.map)}</code> map at its <code>${esc(WORLD.preset)}</code> preset and therefore a mini-map cell:
  a piece cut out seats where it is meant to, and a figure based for the campaign board stands beside it. A tile
  printed 4% small is a tile that does not seat, which is why this page offers no paper but the one the pieces are
  drawn for. For a file rather than paper, print and choose <strong>Save as PDF</strong> — the page size is already
  set, so the PDF is true size too.</p>
  <p><strong>Two-sided printing.</strong> A tile is a piece with two sides: the face is the building finished, the back
  is that same picture with the colour run not laid on and its name band drawn hollow. Choose <em>both sides,
  two-sided printing</em> and every other sheet is a run of backs laid out <strong>mirrored</strong>, so each one falls
  under its own face when the paper is turned — which means the flip in your printer's dialog has to be the flip
  chosen above. Get it the wrong way round and every back lands on the wrong tile. No duplex printer: choose
  <em>side by side</em>, cut both, and glue them together.</p>
  <p>Pieces are laid out with their <strong>${T.bleedMm}&nbsp;mm bleed</strong> showing and a ${T.sheet.gutterMm}&nbsp;mm gutter between them.
  The cut line drawn inside each one is the hexagon to follow; the bleed is the margin for cutting it crookedly.</p>
  <p><strong>${esc(spec.howMany.guide)}</strong> ${esc(spec.howMany.note.split('. ').slice(0, 1).join('. '))}.</p>
</div>

<div class="picker" id="picker"></div>
<div class="bt-sheets" id="sheets"></div>

<!-- The stock: one copy of every side's markup, cloned per piece by the script
     below and never shown. Inlined rather than fetched because an SVG in an
     <img> is an isolated document that never loads the plate it draws. -->
<div id="stock" hidden>
${rows.map((r) => `<div data-tile="${esc(r.id)}" data-side="face">${inline(`${r.id}.svg`)}</div>
<div data-tile="${esc(r.id)}" data-side="back">${inline(`back-${r.id}.svg`)}</div>`).join('\n')}
</div>

<script>
(function () {
  'use strict';

  /* Generated by tools/build-tiles.mjs from data/buildingtiles.json,
     data/components.json, data/buildings.json and data/recipes.json. Every
     millimetre here is derived - the pieces from their own footprints, the
     paper from components.json buildingTile.sheet - and none is typed. */
  var TILES = ${JSON.stringify(PRINTABLE)};
  var PAGE_W = ${T.sheet.widthMm}, PAGE_H = ${T.sheet.heightMm};
  var MARGIN = ${T.sheet.marginMm}, GUTTER = ${T.sheet.gutterMm};
  var CELL_MM = ${WORLD.mm};
  var MAX_COPIES = 40;
  var EPS = 0.01;   /* millimetres are floats; a piece must not miss its row by one */

  /* One of each is the default, which is a complete prototype set and what the
     tiles index could already print. What this page adds is everything after
     that: how many of each, which sides, and how many pages it comes to before
     anybody presses anything. */
  var copies = {};
  TILES.forEach(function (t) { copies[t.id] = 1; });

  /* ?tile=hut, or several, cuts it to those. Every caption on the tiles index
     links here that way, so the obvious route from one tile is one tile and not
     the set. A name nobody recognises leaves the full set alone rather than
     printing nothing: a typed URL should not silently come out blank. */
  var asked = new URLSearchParams(location.search).get('tile');
  if (asked) {
    var want = asked.toLowerCase().split(/[\\s,]+/).filter(Boolean);
    var hit = TILES.filter(function (t) { return want.indexOf(t.id) !== -1; });
    if (hit.length) {
      TILES.forEach(function (t) { copies[t.id] = 0; });
      hit.forEach(function (t) { copies[t.id] = 1; });
    }
  }

  /* ------------------------------------------------------------- the picker */

  var picker = document.getElementById('picker');
  var groups = [];
  TILES.forEach(function (t) { if (groups.indexOf(t.group) === -1) groups.push(t.group); });

  function heading(text, ids) {
    var h = document.createElement('h2');
    h.appendChild(document.createTextNode(text + ' '));
    [['all', 1], ['none', 0]].forEach(function (pair) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = pair[0];
      b.addEventListener('click', function () {
        ids.forEach(function (id) { copies[id] = pair[1]; });
        syncPicker();
        render();
      });
      h.appendChild(b);
    });
    return h;
  }

  picker.appendChild(heading('Every tile', TILES.map(function (t) { return t.id; })));

  groups.forEach(function (g) {
    var mine = TILES.filter(function (t) { return t.group === g; });
    picker.appendChild(heading(g, mine.map(function (t) { return t.id; })));

    var row = document.createElement('div');
    row.className = 'pickrow';
    mine.forEach(function (t) {
      var label = document.createElement('label');
      label.className = 'pick';
      label.dataset.id = t.id;
      label.title = t.name + ' — ' + t.shape + ', ' + t.cells + ' cell' +
        (t.cells === 1 ? '' : 's') + ', ' + t.w + ' × ' + t.h + ' mm with bleed';

      var cells = document.createElement('span');
      cells.className = 'cells';
      cells.textContent = t.cells;

      var box = document.createElement('input');
      box.type = 'number';
      box.min = '0';
      box.max = String(MAX_COPIES);
      box.step = '1';
      box.setAttribute('aria-label', 'copies of ' + t.name);
      box.addEventListener('change', function () {
        var n = parseInt(box.value, 10);
        copies[t.id] = Math.max(0, Math.min(MAX_COPIES, isNaN(n) ? 0 : n));
        syncPicker();
        render();
      });

      var times = document.createElement('span');
      times.className = 'cells';
      times.textContent = '×';

      label.appendChild(cells);
      label.appendChild(document.createTextNode(t.name));
      label.appendChild(times);
      label.appendChild(box);
      row.appendChild(label);
    });
    picker.appendChild(row);
  });

  function syncPicker() {
    Array.prototype.forEach.call(picker.querySelectorAll('.pick'), function (label) {
      var n = copies[label.dataset.id] || 0;
      label.dataset.on = n ? '1' : '0';
      label.querySelector('input').value = String(n);
    });
  }

  /* ---------------------------------------------------------- the imposition */

  /**
   * Shelf packing, in page coordinates: left to right along a row, down to the
   * next row when the next piece will not fit, on to the next sheet when the
   * next row will not. Pieces stay in set order rather than being sorted tall
   * first - a sorted sheet packs a little tighter and comes off the printer in
   * an order nobody can follow, and these are cut out by hand.
   *
   * Page coordinates rather than coordinates inside the margin, because a
   * mirrored back is mirrored about the SHEET. Doing it inside the content box
   * happens to give the same answer while the two margins are equal, and stops
   * doing so the moment somebody makes them different.
   */
  function impose(queue) {
    var pages = [], page = [], x = MARGIN, y = MARGIN, rowH = 0;
    queue.forEach(function (p) {
      if (x > MARGIN && x + p.w > PAGE_W - MARGIN + EPS) { x = MARGIN; y += rowH + GUTTER; rowH = 0; }
      if (y + p.h > PAGE_H - MARGIN + EPS) { if (page.length) pages.push(page); page = []; x = MARGIN; y = MARGIN; rowH = 0; }
      page.push({ id: p.id, name: p.name, side: p.side, x: x, y: y, w: p.w, h: p.h });
      x += p.w + GUTTER;
      rowH = Math.max(rowH, p.h);
    });
    if (page.length) pages.push(page);
    return pages;
  }

  /* Turning the paper over. Long edge is the usual binding and mirrors across
     the page's vertical centre line; short edge tumbles it and mirrors across
     the horizontal one. Which of the two a printer does is a setting in its
     dialog, not something a page can detect - so the page asks, and says what
     goes wrong if the answer is wrong. */
  function backOf(item, flip) {
    return {
      id: item.id, name: item.name, side: 'back', w: item.w, h: item.h,
      x: flip === 'short' ? item.x : PAGE_W - item.x - item.w,
      y: flip === 'short' ? PAGE_H - item.y - item.h : item.y
    };
  }

  /* ---------------------------------------------------------------- rendering */

  var stock = document.getElementById('stock');
  var current = null;

  function markup(id, side) {
    var held = stock.querySelector('[data-tile="' + id + '"][data-side="' + side + '"]');
    return held.firstElementChild.cloneNode(true);
  }

  function chosen() {
    var out = [];
    TILES.forEach(function (t) {
      for (var i = 0; i < (copies[t.id] || 0); i++) out.push(t);
    });
    return out;
  }

  function sheetsFor(mode, flip) {
    var picked = chosen();
    if (!picked.length) return [];

    var faces = picked.map(function (t) {
      return { id: t.id, name: t.name, side: 'face', w: t.w, h: t.h };
    });

    if (mode === 'faces') {
      return impose(faces).map(function (items) { return { kind: 'faces', items: items }; });
    }

    /* Side by side: the face and its own back next to each other in one flow,
       for a printer that cannot turn the paper over. Cut both, glue them back
       to back. Nothing is mirrored - the two are looked at, not registered. */
    if (mode === 'pairs') {
      var flat = [];
      faces.forEach(function (f) {
        flat.push(f);
        flat.push({ id: f.id, name: f.name, side: 'back', w: f.w, h: f.h });
      });
      return impose(flat).map(function (items) { return { kind: 'both', items: items }; });
    }

    /* Two-sided: impose the faces, then follow each sheet with its own backs
       mirrored, so sheet 1 prints on the front of the paper and sheet 2 on the
       back of that same piece of paper. */
    var out = [];
    impose(faces).forEach(function (items) {
      out.push({ kind: 'faces', items: items });
      out.push({ kind: 'backs', items: items.map(function (it) { return backOf(it, flip); }) });
    });
    return out;
  }

  function render() {
    var mode = document.getElementById('mode').value;
    var flip = document.getElementById('flip').value;
    document.getElementById('flip-wrap').hidden = mode !== 'duplex';

    var pages = sheetsFor(mode, flip);
    var picked = chosen();
    var kinds = TILES.filter(function (t) { return copies[t.id]; });

    /* Naming every tile is useful up to about a dozen and is a wall of text at
       fifty-four - and the fifty-four case is the default, so it was the one
       being read. Past that, say the counts that are not one and how many of the
       rest there are: what a person checks in this line is "did I ask for three
       huts", not the roll call. */
    var many = kinds.filter(function (t) { return copies[t.id] > 1; });
    var ones = kinds.length - many.length;
    var listed;
    if (kinds.length === TILES.length && !many.length) {
      listed = 'one of each';
    } else if (kinds.length > 12) {
      listed = many.map(function (t) { return copies[t.id] + ' × ' + t.name; });
      if (ones) listed.push(ones + ' more, one each');
      listed = listed.join(', ');
    } else {
      listed = kinds.map(function (t) {
        return (copies[t.id] > 1 ? copies[t.id] + ' × ' : '') + t.name;
      }).join(', ');
    }

    var sheets = mode === 'duplex' ? pages.length / 2 : pages.length;
    document.getElementById('summary').innerHTML = picked.length
      ? '<strong>' + picked.length + ' piece' + (picked.length === 1 ? '' : 's') + ' of ' +
        kinds.length + ' kind' + (kinds.length === 1 ? '' : 's') + ' — ' +
        pages.length + ' page' + (pages.length === 1 ? '' : 's') +
        (mode === 'duplex' ? ' on ' + sheets + ' sheet' + (sheets === 1 ? '' : 's') + ' of paper, printed both sides' : '') +
        ', ' + PAGE_W + ' × ' + PAGE_H + ' mm</strong>: ' + listed + '.'
      : '<strong>Nothing chosen.</strong> Pick some tiles below — or press <em>all</em> under <em>Every tile</em> for one of each.';

    var host = document.getElementById('sheets');
    host.innerHTML = '';

    if (!pages.length) {
      var none = document.createElement('p');
      none.className = 'empty';
      none.textContent = 'No tiles chosen.';
      host.appendChild(none);
      current = null;
      return;
    }

    pages.forEach(function (pg, i) {
      var page = document.createElement('div');
      page.className = 'bt-page';

      pg.items.forEach(function (it) {
        var slot = document.createElement('div');
        slot.className = 'bt-piece';
        /* Which piece and which way up, on the element itself: it is what makes
           an imposed sheet readable in a dev tools inspector, and it is how a
           proof can check that a back landed under its own face rather than
           under a neighbour that happens to be the same size. */
        slot.dataset.tile = it.id;
        slot.dataset.side = it.side;
        slot.style.left = it.x + 'mm';
        slot.style.top = it.y + 'mm';
        slot.style.width = it.w + 'mm';
        slot.style.height = it.h + 'mm';
        slot.appendChild(markup(it.id, it.side));
        page.appendChild(slot);
      });

      var said = pg.kind === 'faces' ? 'faces' : pg.kind === 'backs' ? 'backs, mirrored' : 'faces and backs';
      var label = document.createElement('p');
      label.className = 'bt-label';
      label.textContent = 'page ' + (i + 1) + ' of ' + pages.length + '  ·  ' + said +
        '  ·  ' + pg.items.length + ' piece' + (pg.items.length === 1 ? '' : 's') +
        '  ·  ' + PAGE_W + ' × ' + PAGE_H + ' mm at 100%, ' + CELL_MM + ' mm cells';

      var frame = document.createElement('div');
      frame.className = 'bt-frame';
      frame.appendChild(label);
      frame.appendChild(page);
      host.appendChild(frame);
    });

    current = { w: PAGE_W, h: PAGE_H };
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
      var page = frame.querySelector('.bt-page');
      if (!page) return;
      if (scale >= 1) {
        page.style.transform = '';
        frame.style.width = '';
        frame.style.height = '';
      } else {
        page.style.transform = 'scale(' + scale + ')';
        frame.style.width = Math.round(wpx * scale) + 'px';
        frame.style.height = Math.round(hpx * scale) + 'px';
      }
    });
  }

  zoom.addEventListener('change', function () { applyScale(); });
  window.addEventListener('resize', function () { applyScale(); });
  document.getElementById('mode').addEventListener('change', function () { render(); });
  document.getElementById('flip').addEventListener('change', function () { render(); });

  /* The @media print rules undo the preview scale on their own. This is the belt
     to that pair of braces: a piece must never reach paper at 86%. */
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

const pages = [['index.html', index], ['print.html', printPage]];
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
    `wrote ${rows.length} building tiles (${files.length} files) + ${pages.length} pages to docs/tiles/ — ` +
    `${shapes.map((s) => `${s.count} ${s.id} at ${s.widthMm}x${s.heightMm}mm`).join(', ')}; ` +
    `cell ${WORLD.mm}mm, the ${WORLD.map} hex on its ${WORLD.preset} preset; ` +
    `index.html shows them, print.html imposes them on ${T.sheet.widthMm}x${T.sheet.heightMm}mm paper` +
    (waiting.length ? `; ${waiting.length} still waiting on a plate and printing as blanks` : '') +
    (stale.length ? `; removed ${stale.length} file(s) no longer built` : '')
  );
}
