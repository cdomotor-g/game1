#!/usr/bin/env node
/**
 * Reads a drawn map plate and proposes a hex terrain grid for it.
 *
 * This is the bootstrap half of the map pipeline. It looks at the artwork under
 * every hex, decides what is painted there, and prints a `rows` block that can be
 * pasted into data/maps/<id>.json. It does NOT own that block afterwards — the
 * committed rows are hand-corrected, because a painted map says things about
 * itself that no sampler can hear. Run it with --diff to see where the plate and
 * the committed rows disagree, which is how you notice that someone edited one
 * without the other.
 *
 * The sampler can honestly separate five things by colour: water, snow, grass,
 * wood and sand. It finds mountains by how much black ink is in the hex, and
 * rivers by looking for the drawn river blue. Everything else — which sand is a
 * fen, which grass is a highland, where a coastline should become a beach rather
 * than a cliff — is a judgement, and judgements live in the data file.
 *
 * Usage:
 *   node tools/trace-map.mjs [map-id]            # print the proposed rows
 *   node tools/trace-map.mjs [map-id] --diff     # compare against committed rows
 *   node tools/trace-map.mjs [map-id] --write    # overwrite the committed rows
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPng, pixel, rgbToHsl, luminance } from './lib/png.mjs';
import { layout, samplePattern, neighbours } from './lib/hexgrid.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const mapId = args.find((a) => !a.startsWith('--')) ?? 'korvane-reach';
const wantDiff = args.includes('--diff');
const wantWrite = args.includes('--write');

const mapPath = join(ROOT, 'data', 'maps', `${mapId}.json`);
const map = JSON.parse(readFileSync(mapPath, 'utf8'));
const plate = readPng(join(ROOT, 'docs', 'map', map.plate.file));

const FIELD = map.plate.field;
const { cols, rows: rowCount } = map.grid;
const acrossFlats = FIELD.width / cols;
const radius = acrossFlats / Math.sqrt(3);
const grid = layout({
  cols,
  rows: rowCount,
  acrossFlats,
  originX: FIELD.x + (FIELD.width - acrossFlats * (cols + 0.5)) / 2,
  originY: FIELD.y + (FIELD.height - (1.5 * radius * (rowCount - 1) + 2 * radius)) / 2,
});

const CODE_OF = Object.fromEntries(Object.entries(map.legend).map(([ch, id]) => [id, ch]));

/* ---------------------------------------------------------------- sampling */

const pattern = samplePattern(4, 10);

const insideField = (x, y) =>
  x >= FIELD.x && y >= FIELD.y && x <= FIELD.x + FIELD.width && y <= FIELD.y + FIELD.height;

/**
 * Robust wash colour, ink coverage and river coverage for one hex.
 *
 * Returns null for a hex that mostly hangs off the drawn field. The grid is
 * centred on the field and overhangs it by about half a hex at the top and
 * bottom, and the plate has a deckled paper edge outside the frame that reads
 * convincingly as a sandy coastline if you let it vote.
 */
function sample(col, row) {
  const c = grid.centre(col, row);
  const points = [];
  let offField = 0;
  for (const [dx, dy] of pattern) {
    const x = c.x + dx * radius;
    const y = c.y + dy * radius;
    if (!insideField(x, y)) {
      offField++;
      continue;
    }
    const p = pixel(plate, x, y);
    points.push({ p, lum: luminance(...p) });
  }
  if (offField > pattern.length * 0.45 || points.length < 8) return null;
  points.sort((a, b) => a.lum - b.lum);

  /* Drop the darkest third — that is the linework — and the top twentieth, which
     is paper texture and the highlight side of a fold. What is left is the wash. */
  const wash = points.slice(Math.floor(points.length * 0.35), Math.ceil(points.length * 0.95));
  let r = 0;
  let g = 0;
  let b = 0;
  for (const s of wash) {
    r += s.p[0];
    g += s.p[1];
    b += s.p[2];
  }
  r /= wash.length;
  g /= wash.length;
  b /= wash.length;
  const [h, s, l] = rgbToHsl(r, g, b);

  /* The glyphs are drawn a pixel or two wide, so they need a denser sweep than
     the wash does or they fall between samples. Three things are counted here:
     the cold blue of a drawn river, the green of a drawn tree, and how much of
     the hex is covered by ink of any colour. */
  let riverHits = 0;
  let greenHits = 0;
  let inkHits = 0;
  let total = 0;
  const step = Math.max(1, Math.round(radius / 26));
  for (let y = c.y - radius * 0.8; y <= c.y + radius * 0.8; y += step) {
    for (let x = c.x - radius * 0.8; x <= c.x + radius * 0.8; x += step) {
      if (!insideField(x, y)) continue;
      const [pr, pg, pb] = pixel(plate, x, y);
      total++;
      const lum = luminance(pr, pg, pb);
      const [ph, ps, pl] = rgbToHsl(pr, pg, pb);
      if (pb > pr + 10 && pb > pg + 2 && lum > 90 && lum < 200) riverHits++;
      if (ph >= 60 && ph <= 165 && ps >= 0.12 && pl <= 0.66) greenHits++;
      if (lum < 130) inkHits++;
    }
  }

  return {
    r, g, b, h, s, l,
    ink: inkHits / Math.max(1, total),
    green: greenHits / Math.max(1, total),
    river: riverHits / Math.max(1, total),
  };
}

/* ---------------------------------------------------------- classification */

/**
 * The plate prints its own key of twelve colour swatches, one per terrain, and
 * the thresholds below are read off them. Two groups separate cleanly and the
 * rest do not:
 *
 *   water   every water swatch is desaturated (s <= 0.09) and neutral-to-cold;
 *           every land swatch is warm and saturated (s >= 0.26). Nothing else on
 *           the plate crosses that gap, which makes it the one test that never
 *           misfires.
 *   wood    trees are the only green ink on an otherwise ochre map.
 *
 * Ice and sand are then the extremes of the land wash — the lightest and the
 * strongest — and everything between them is called grass, to be corrected by
 * hand. Hills and marsh are deliberately not guessed: the plate paints the
 * Mirewash Fens the same ochre as the desert beside it and draws the Varl
 * Highlands as flat steppe, so both are placed from the labels, not the pixels.
 */
function baseTerrain(st) {
  if (st.s < 0.30 && st.b > st.r - 32) return 'deep-water';
  if (st.green >= 0.02) return 'forest';
  if (st.l >= 0.83 && st.s < 0.52) return 'tundra';
  if (st.s >= 0.52) return 'desert';
  return 'grassland';
}

const inBounds = (col, row) => col >= 0 && row >= 0 && col < cols && row < rowCount;

const stats = [];
const terrain = [];
const occluded = [];
for (let row = 0; row < rowCount; row++) {
  stats.push([]);
  terrain.push([]);
  occluded.push([]);
  for (let col = 0; col < cols; col++) {
    const st = sample(col, row);
    const c = grid.centre(col, row);
    const fx = (c.x - FIELD.x) / FIELD.width;
    const fy = (c.y - FIELD.y) / FIELD.height;
    /* Furniture drawn over the map field, plus any hex that hangs off the edge:
       both are hexes whose pixels are not country and must not be read as such. */
    const underFurniture = (map.plate.occlusions ?? []).some(
      (o) => fx >= o.x && fx <= o.x + o.width && fy >= o.y && fy <= o.y + o.height
    );
    stats[row].push(st);
    occluded[row].push(!st || underFurniture);
    terrain[row].push(st ? baseTerrain(st) : 'deep-water');
  }
}

/* ---------------------------------------------------------------- mountains */

/* Mountains are the one terrain the plate states in ink rather than in colour, so
   they are found by how black a hex is. A range is grown rather than thresholded:
   a hex only has to be a bit inky to join a range that already has a solid peak in
   it, which keeps the Ironspine a continuous spine instead of a dotted line of
   whichever hexes happened to centre on a drawn peak. */
const MOUNTAIN_SEED = 0.18;
const MOUNTAIN_GROW = 0.1;
for (let row = 0; row < rowCount; row++) {
  for (let col = 0; col < cols; col++) {
    const st = stats[row][col];
    if (st && !occluded[row][col] && st.ink >= MOUNTAIN_SEED && st.green < 0.05) {
      terrain[row][col] = 'mountain';
    }
  }
}
for (let pass = 0; pass < 6; pass++) {
  const before = terrain.map((r) => r.slice());
  let changed = false;
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < cols; col++) {
      const st = stats[row][col];
      if (!st || occluded[row][col] || before[row][col] === 'mountain') continue;
      if (st.ink < MOUNTAIN_GROW || st.green >= 0.05) continue;
      if (st.s < 0.30 && st.b > st.r - 32) continue;
      if (!neighbours(col, row).some((n) => inBounds(n.col, n.row) && before[n.row][n.col] === 'mountain')) continue;
      terrain[row][col] = 'mountain';
      changed = true;
    }
  }
  if (!changed) break;
}

/* --------------------------------------------------------------- occlusion */

/* Take an occluded hex's terrain from whatever surrounds it, growing inwards a
   ring at a time until the hole is filled. This is a guess and is reported as
   one: a big cartouche can sit over a coastline, and no amount of voting from the
   ring around it will tell you where that coastline ran. */
const occludedCount = occluded.flat().filter(Boolean).length;
for (let pass = 0; pass < cols + rowCount; pass++) {
  let changed = false;
  const before = terrain.map((r) => r.slice());
  /* Both the terrain and the mask are frozen for the length of a pass. Clearing
     the mask as we go would let a hex filled earlier in this same pass count as
     a voter while `before` still held its furniture colour, and the cartouche
     would then propagate its own cream inwards a ring at a time instead of being
     replaced by the country around it. */
  const wasOccluded = occluded.map((r) => r.slice());
  const filled = [];
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < cols; col++) {
      if (!wasOccluded[row][col]) continue;
      const votes = {};
      for (const n of neighbours(col, row)) {
        if (n.col < 0 || n.row < 0 || n.col >= cols || n.row >= rowCount) continue;
        if (wasOccluded[n.row][n.col]) continue;
        votes[before[n.row][n.col]] = (votes[before[n.row][n.col]] ?? 0) + 1;
      }
      const best = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
      if (!best) continue;
      terrain[row][col] = best[0];
      filled.push([col, row]);
      changed = true;
    }
  }
  for (const [col, row] of filled) occluded[row][col] = false;
  if (!changed) break;
}
/* Anything still walled in by other occluded hexes is open sea by elimination. */
for (let row = 0; row < rowCount; row++) {
  for (let col = 0; col < cols; col++) if (occluded[row][col]) terrain[row][col] = 'deep-water';
}
const guessed = stats.flat().filter((s) => !s).length + occludedCount;

/* ------------------------------------------------------------- water rules */

const isWater = (t) => t === 'deep-water' || t === 'shallow-water';

/* Flood the sea in from the border. Whatever water it cannot reach is a lake, and
   a lake shore is a different tile to a sea coast in this game. */
const sea = terrain.map((r) => r.map(() => false));
const queue = [];
for (let col = 0; col < cols; col++) {
  for (const row of [0, rowCount - 1]) if (isWater(terrain[row][col])) queue.push([col, row]);
}
for (let row = 0; row < rowCount; row++) {
  for (const col of [0, cols - 1]) if (isWater(terrain[row][col])) queue.push([col, row]);
}
while (queue.length) {
  const [col, row] = queue.pop();
  if (!inBounds(col, row) || sea[row][col] || !isWater(terrain[row][col])) continue;
  sea[row][col] = true;
  for (const n of neighbours(col, row)) queue.push([n.col, n.row]);
}

const base = terrain.map((r) => r.slice());
for (let row = 0; row < rowCount; row++) {
  for (let col = 0; col < cols; col++) {
    const t = base[row][col];
    const ns = neighbours(col, row).filter((n) => inBounds(n.col, n.row));

    if (isWater(t)) {
      const touchesLand = ns.some((n) => !isWater(base[n.row][n.col]));
      /* Inland water is all shallow — a lake on this map is never a shipping lane. */
      terrain[row][col] = !sea[row][col] || touchesLand ? 'shallow-water' : 'deep-water';
      continue;
    }

    const touchesSea = ns.some((n) => isWater(base[n.row][n.col]) && sea[n.row][n.col]);
    const touchesLake = ns.some((n) => isWater(base[n.row][n.col]) && !sea[n.row][n.col]);

    /* Only open ground becomes a beach, and only where the plate shows open
       ground. An ice shelf, a dune field or a wooded shore keeps its own terrain:
       this map's coastline is long and convoluted, and converting every hex that
       touches the sea would repaint a fifth of the continent one colour and throw
       away the thing the drawing is being read for. Harbours on an ice or dune
       coast are placed by hand afterwards, where the plate actually draws one. */
    if (touchesSea && t === 'grassland') {
      terrain[row][col] = 'coast';
    } else if (touchesLake && (t === 'grassland' || t === 'desert' || t === 'tundra')) {
      terrain[row][col] = 'lake-shore';
    } else if (stats[row][col]?.river >= 0.02 && (t === 'grassland' || t === 'forest')) {
      terrain[row][col] = 'river-bank';
    }
  }
}

/* -------------------------------------------------------------- reporting */

const proposed = terrain.map((r) => r.map((t) => CODE_OF[t]).join(''));

if (wantDiff) {
  const committed = map.rows ?? [];
  let differences = 0;
  for (let row = 0; row < rowCount; row++) {
    const have = committed[row] ?? '';
    const want = proposed[row];
    if (have === want) continue;
    let marks = '';
    for (let col = 0; col < cols; col++) marks += have[col] === want[col] ? ' ' : '^';
    differences += marks.split('').filter((c) => c === '^').length;
    console.log(`row ${String(row).padStart(2)}  committed ${have}`);
    console.log(`         traced    ${want}`);
    console.log(`                   ${marks}`);
  }
  console.log(
    differences
      ? `\n${differences} of ${cols * rowCount} hexes differ from the plate trace.`
      : 'committed rows match the trace exactly.'
  );
} else if (wantWrite) {
  map.rows = proposed;
  writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
  console.log(`wrote ${cols * rowCount} hexes into data/maps/${mapId}.json`);
} else {
  console.log('  "rows": [');
  console.log(proposed.map((r) => `    ${JSON.stringify(r)}`).join(',\n'));
  console.log('  ],');
  const tally = {};
  for (const row of terrain) for (const t of row) tally[t] = (tally[t] ?? 0) + 1;
  console.error('\nterrain tally:');
  for (const [t, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
    console.error(`  ${t.padEnd(15)} ${String(n).padStart(4)}  ${((100 * n) / (cols * rowCount)).toFixed(1)}%`);
  }
  console.error(
    `\n${guessed} hexes were guessed rather than read — map furniture drawn over the` +
      ' field, or hexes hanging off its edge. Check those by hand before trusting them.'
  );
}
