#!/usr/bin/env node
/**
 * The finished tile, face and back, as a picture you can put in front of somebody.
 *
 * tools/card-proof.mjs's sibling, and the same bargain: `docs/tiles/*.svg` is the
 * artefact, an SVG is not something you can paste into a review, and every other
 * check in this repository proves something about numbers rather than looking at
 * the thing. Nothing in the build depends on this; a machine with no browser gets
 * a message rather than a stack trace.
 *
 * BOTH SIDES ON ONE SHEET, because the question a tile proof answers is a
 * two-sided one. The face has to read as a building at 17 mm; the back has to say
 * what ground it may stand on in the same 17 mm, with a word and a motif already
 * on it. Proofing them separately is how you end up with two sides that are each
 * fine and together are a piece nobody can use.
 *
 * A RULER RUNS UNDER THEM, in millimetres of the real printed piece, because that
 * is the whole argument of this line - a tile is one world hex across - and a
 * proof at 6x that did not say so would invite exactly the wrong judgement about
 * how big the type is.
 *
 * The two SVGs are INLINED into the page rather than pointed at with `<img>`, the
 * same as docs/tiles/index.html and for the same reason: an SVG inside an `<img>`
 * is an isolated document and may not fetch the PNG it draws, so the first proof
 * of the hut came out as an empty hexagon with a name band on it. The plate is the
 * tile; a proof that cannot show it is a proof of nothing.
 *
 * Proofs are diagnostics and git-ignored, like the map proof sheets and the aim
 * previews. The SVG is the artefact; this is a photograph of it.
 *
 *   node tools/tile-proof.mjs hut
 *   node tools/tile-proof.mjs hut pasture crop-grain --scale 8
 *   node tools/tile-proof.mjs --shape single
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { findChromium, shoot, noBrowser } from './lib/chromium.mjs';
import { tileSubjects, worldHexMm } from './lib/tiles.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TILES = join(ROOT, 'docs', 'tiles');
const OUT_DIR = join(ROOT, 'docs', 'art', 'proofs');

const components = JSON.parse(readFileSync(join(ROOT, 'data/components.json'), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const U = components.stock.unitsPerMm;

const args = process.argv.slice(2);
const flagged = new Set();
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return null;
  flagged.add(i); flagged.add(i + 1);
  return args[i + 1];
};
const SCALE = Number(flag('scale') || 6);
const shape = flag('shape');

const rows = tileSubjects(ROOT);
let ids = args.filter((a, i) => !flagged.has(i) && !a.startsWith('--'));
if (shape) ids = rows.filter((r) => r.shape === shape).map((r) => r.id);
if (!ids.length) {
  console.error('usage: node tools/tile-proof.mjs <id...> [--shape single|pair|triad|rhombus] [--scale n]');
  console.error(`       ids are tile ids - ${rows.slice(0, 4).map((r) => r.id).join(', ')}, ... (${rows.length} of them)`);
  process.exit(2);
}

const chromium = findChromium();
if (!chromium) {
  console.error(noBrowser('tile-proof', 'The tile itself is docs/tiles/<id>.svg, which any browser will open; this only turns that into a PNG you can send someone.'));
  process.exit(1);
}

const WORLD = worldHexMm(ROOT);

/**
 * A tile's markup with every relative `href` made absolute.
 *
 * The page is written to a scratch directory, so `../art/renders/tile-hut.png` -
 * which is right relative to docs/tiles/ - resolves to nothing at all from
 * /tmp. The plate then silently does not load and the proof is an empty hexagon
 * with a name band on it, which is exactly what the first hut proof was. Same
 * rewrite as tools/card-proof.mjs, and the same reason.
 */
const absolute = (svg) => svg.replace(/href="([^"#][^"]*)"/g, (whole, href) =>
  (/^(https?:|data:|file:|#)/.test(href) ? whole : `href="${pathToFileURL(resolvePath(TILES, href)).href}"`));
const sizeOf = (svg) => {
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  return { width: Number(m[1]), height: Number(m[2]) };
};

/**
 * Face, back and a ruler, laid out in CSS pixels that are the SVG's own units so
 * nothing has to be converted twice. The page is measured, then shot at `SCALE`.
 */
function page(row, faceSvg, backSvg, sizes) {
  const gap = 8 * U;
  const rule = 10 * U;
  const w = sizes.face.width + gap + sizes.back.width;
  const h = Math.max(sizes.face.height, sizes.back.height) + rule;
  const ticks = [];
  for (let mm = 0; mm <= Math.floor(w / U); mm += 5) {
    ticks.push(`<div style="position:absolute;left:${mm * U}px;top:0;width:1px;height:${mm % 10 ? 3 : 6}px;background:${palette.ink.soot.hex}"></div>`);
    if (mm % 10 === 0) ticks.push(`<div style="position:absolute;left:${mm * U + 2}px;top:5px;font:${2.4 * U}px Helvetica,Arial,sans-serif;color:${palette.ink.tints['70'].hex}">${mm}</div>`);
  }
  return `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:${palette.paper.white.hex};}
  .sheet{position:relative;width:${w}px;height:${h}px;}
  .sheet .tile{position:absolute;top:0;}
  .sheet .tile svg{display:block;width:100%;height:100%;}
  .rule{position:absolute;left:0;top:${h - rule}px;width:${w}px;height:${rule}px;}
</style><div class="sheet">
<div class="tile" style="left:0;width:${sizes.face.width}px;height:${sizes.face.height}px">${faceSvg}</div>
<div class="tile" style="left:${sizes.face.width + gap}px;width:${sizes.back.width}px;height:${sizes.back.height}px">${backSvg}</div>
<div class="rule">${ticks.join('')}<div style="position:absolute;left:0;top:${5.2 * U}px;font:${2.4 * U}px Helvetica,Arial,sans-serif;color:${palette.ink.tints['70'].hex}">mm of the real piece &#183; ${row.name} &#183; ${row.shape}, ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'} &#183; cell ${WORLD.mm} mm (${WORLD.map} ${WORLD.preset})</div></div>
</div>`;
}

mkdirSync(OUT_DIR, { recursive: true });
let failed = 0;

for (const id of ids) {
  const row = rows.find((r) => r.id === id);
  if (!row) { console.error(`  ${id}  no such tile - run node tools/build-tiles.mjs and see docs/tiles/index.html`); failed++; continue; }
  const faceFile = join(TILES, `${id}.svg`);
  const backFile = join(TILES, `back-${id}.svg`);
  if (!existsSync(faceFile) || !existsSync(backFile)) {
    console.error(`  ${id}  not built - run node tools/build-tiles.mjs`);
    failed++;
    continue;
  }
  const sizes = { face: sizeOf(readFileSync(faceFile, 'utf8')), back: sizeOf(readFileSync(backFile, 'utf8')) };
  const gap = 8 * U;
  const rule = 10 * U;
  const width = Math.round((sizes.face.width + gap + sizes.back.width) * SCALE);
  const height = Math.round((Math.max(sizes.face.height, sizes.back.height) + rule) * SCALE);

  const out = join(OUT_DIR, `tile-${id}.png`);
  try {
    shoot(chromium, {
      html: page(row, absolute(readFileSync(faceFile, 'utf8')), absolute(readFileSync(backFile, 'utf8')), sizes)
        .replace('<div class="sheet">', `<div class="sheet" style="zoom:${SCALE}">`),
      out,
      width,
      height,
      scratchName: `tile-${id}`,
    });
  } catch (err) {
    console.error(`  ${id}  ${err.message}`);
    failed++;
    continue;
  }
  console.log(`  ${id}  ${width} x ${height}  ->  docs/art/proofs/tile-${id}.png  (${row.shape}, ${row.cells.length} cell${row.cells.length === 1 ? '' : 's'}, ${(sizes.face.width / U).toFixed(1)} x ${(sizes.face.height / U).toFixed(1)} mm with bleed)`);
}

console.log(`\n${ids.length - failed} of ${ids.length} proofed into docs/art/proofs/ — git-ignored, regenerate whenever.`);
process.exit(failed ? 1 : 0);
