#!/usr/bin/env node
/**
 * Samples the real Earth under a board, once, and commits the answer.
 *
 * This is the ONLY tool in the repository that needs a network, and it is run by a
 * person when a region is first made or when its window moves - never by CI. What it
 * writes, data/earth/<region>.samples.json, is a few kilobytes: one row of six
 * numbers per hex. Everything after it (the classification, the drawing, the checks)
 * reads that file and nothing else, so the board is reproducible on a machine with no
 * internet and the sources can be thanked and then forgotten.
 *
 * It asks tools/lib/earth.mjs where each hex is, hands a lattice of points to
 * tools/earth/lookup.py (which knows rasters and no geometry), and takes back
 * elevation and climate class per point.
 *
 * Usage:
 *   node tools/fetch-earth.mjs <map-id> --koppen <Beck_KG_V1_present_0p083.tif> --rivers <ne_10m_rivers_lake_centerlines.geojson>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { earthGrid } from './lib/earth.mjs';
import { neighbours, hexId } from './lib/hexgrid.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const mapId = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
const koppen = arg('koppen'), riversPath = arg('rivers');
if (!mapId || !koppen || !riversPath) {
  console.error('usage: node tools/fetch-earth.mjs <map-id> --koppen <tif> --rivers <geojson>');
  process.exit(1);
}

const map = JSON.parse(readFileSync(join(ROOT, 'data', 'maps', `${mapId}.json`), 'utf8'));
const earth = map.commission?.earth;
if (!earth) { console.error(`fetch-earth: ${mapId} has no commission.earth`); process.exit(1); }

const spec = { cols: map.grid.cols, rows: map.grid.rows, hexKm: earth.hexKm, centre: earth.centre };
const grid = earthGrid(spec);

/* ---- every sample point, hex by hex ------------------------------------- */
const points = [];
const owner = [];
for (let r = 0; r < spec.rows; r++) for (let c = 0; c < spec.cols; c++) {
  const mine = grid.samplePoints(c, r, earth.sampleAcross ?? 9);
  for (const p of mine) { points.push([+p.lat.toFixed(4), +p.lon.toFixed(4)]); owner.push(r * spec.cols + c); }
}
console.log(`fetch-earth: ${spec.cols * spec.rows} hexes, ${points.length} sample points`);

const work = join(tmpdir(), `earth-${mapId}`);
mkdirSync(work, { recursive: true });
const jobPath = join(work, 'job.json'), outPath = join(work, 'out.json');
writeFileSync(jobPath, JSON.stringify({ points, koppen, zoom: earth.tileZoom ?? 6 }));
const py = spawnSync('python3', ['-I', join(ROOT, 'tools', 'earth', 'lookup.py'), jobPath, join(work, 'tiles'), outPath], { stdio: 'inherit' });
if (py.status !== 0) { console.error('fetch-earth: the raster lookup failed'); process.exit(1); }
const { elev, koppen: kop } = JSON.parse(readFileSync(outPath, 'utf8'));

/* ---- one row of numbers per hex ----------------------------------------- */
const per = Array.from({ length: spec.cols * spec.rows }, () => ({ e: [], k: [] }));
owner.forEach((h, i) => { per[h].e.push(elev[i]); per[h].k.push(kop[i]); });
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const cells = per.map(({ e, k }) => {
  const land = e.map((v, i) => ({ v, k: k[i] })).filter((x) => x.v > 0);
  const sea = e.filter((v) => v <= 0);
  const landPct = Math.round((100 * land.length) / e.length);
  if (!land.length) return [0, 0, 0, 0, Math.round(pct(sea, 0.5)), 0];
  const lv = land.map((x) => x.v);
  const mean = Math.round(lv.reduce((a, b) => a + b, 0) / lv.length);
  const counts = new Map();
  for (const x of land) if (x.k) counts.set(x.k, (counts.get(x.k) ?? 0) + 1);
  const mode = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  return [landPct, mean, pct(lv, 0.9), Math.max(...lv), sea.length ? Math.round(pct(sea, 0.5)) : 0, mode];
});

/* ---- rivers: lines on the planet -> chains of hexes ---------------------- */
const geo = JSON.parse(readFileSync(riversPath, 'utf8'));
const lines = (f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates);
const rivers = [];
for (const want of earth.rivers ?? []) {
  const match = new Set(want.match ?? [want.name]);
  const hexes = new Set();
  for (const f of geo.features) {
    if (f.properties.featurecla !== 'River' || !match.has(f.properties.name)) continue;
    for (const line of lines(f)) for (let i = 0; i < line.length - 1; i++) {
      const [x0, y0] = line[i], [x1, y1] = line[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.04));
      for (let s = 0; s <= n; s++) {
        const h = grid.hexOf(y0 + ((y1 - y0) * s) / n, x0 + ((x1 - x0) * s) / n);
        if (h) hexes.add(`${h.col},${h.row}`);
      }
    }
  }
  /* Only land can hold a river, and a river is a chain: keep the largest connected
     run of land hexes and walk it from the high end down. */
  const isLandHex = (c, r) => cells[r * spec.cols + c][0] >= earth.riverMinLandPct;
  const nodes = [...hexes].map((k) => k.split(',').map(Number)).filter(([c, r]) => isLandHex(c, r));
  const inSet = new Set(nodes.map(([c, r]) => `${c},${r}`));
  const seen = new Set();
  let best = [];
  for (const [c0, r0] of nodes) {
    if (seen.has(`${c0},${r0}`)) continue;
    const comp = [], stack = [[c0, r0]];
    seen.add(`${c0},${r0}`);
    while (stack.length) {
      const [c, r] = stack.pop(); comp.push([c, r]);
      for (const n of neighbours(c, r)) { const k = `${n.col},${n.row}`; if (inSet.has(k) && !seen.has(k)) { seen.add(k); stack.push([n.col, n.row]); } }
    }
    if (comp.length > best.length) best = comp;
  }
  if (best.length < 3) { console.warn(`  ${want.name}: only ${best.length} land hexes - not a river at this scale, skipped`); continue; }
  const elevOf = ([c, r]) => cells[r * spec.cols + c][1];
  const inBest = new Set(best.map(([c, r]) => `${c},${r}`));
  /* A river on a board is one chain, so take the longest run through the hexes the
     water touches: walk to the farthest hex from anywhere, then to the farthest from
     there, and the path between them is the course. */
  const walk = (from) => {
    const prev = new Map([[`${from[0]},${from[1]}`, null]]);
    let frontier = [from], last = from;
    while (frontier.length) {
      const next = [];
      for (const [c, r] of frontier) for (const n of neighbours(c, r)) {
        const k = `${n.col},${n.row}`;
        if (inBest.has(k) && !prev.has(k)) { prev.set(k, `${c},${r}`); next.push([n.col, n.row]); }
      }
      if (next.length) last = next[0];
      frontier = next;
    }
    return { last, prev };
  };
  const a = walk(best[0]).last;
  const { last: z, prev } = walk(a);
  const course = [];
  for (let k = `${z[0]},${z[1]}`; k; k = prev.get(k)) course.unshift(k.split(',').map(Number));
  /* Spring first. The mouth is the end that touches the sea; if both or neither do,
     the higher end is the spring. */
  const wetEnd = ([c, r]) => neighbours(c, r).some((n) => n.col >= 0 && n.row >= 0 && n.col < spec.cols && n.row < spec.rows && cells[n.row * spec.cols + n.col][0] < earth.riverMinLandPct);
  const first = course[0], lastHex = course[course.length - 1];
  if (wetEnd(first) !== wetEnd(lastHex) ? wetEnd(first) : elevOf(first) < elevOf(lastHex)) course.reverse();
  rivers.push({ name: want.name, hexes: course });
  console.log(`  ${want.name}: ${course.length} hexes, ${hexId(...course[0])} -> ${hexId(...course[course.length - 1])}`);
}

const outFile = join(ROOT, 'data', 'earth', earth.samplesFile.replace(/^earth\//, ''));
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({
  $comment: 'SAMPLED, never edited. One row per hex, row-major (col fastest), from tools/fetch-earth.mjs. Each cell is [landPercent, meanLandElevationM, p90LandElevationM, maxElevationM, medianSeaDepthM, koppenClass]. The board is classified from this by tools/lib/earth.mjs and data/earth/classify.json; change the numbers there, not here.',
  map: mapId,
  window: { cols: spec.cols, rows: spec.rows, hexKm: spec.hexKm, centre: spec.centre, projection: 'lambert-azimuthal-equal-area' },
  sources: [
    { what: 'elevation on land, depth at sea', name: 'Terrain Tiles (terrarium), zoom ' + (earth.tileZoom ?? 6), via: 'elevation-tiles-prod on AWS', credit: 'SRTM, GEBCO, ETOPO1 and national datasets, as credited by Mapzen/Tilezen terrain tiles' },
    { what: 'climate class', name: 'Beck et al. 2018, present-day Koeppen-Geiger, 0.083 degree', licence: 'CC BY 4.0' },
    { what: 'rivers', name: 'Natural Earth 1:10m rivers and lake centerlines', licence: 'public domain' },
  ],
  cells,
  rivers,
}));
console.log(`fetch-earth: wrote ${outFile.replace(ROOT + '/', '')}`);
