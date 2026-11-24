#!/usr/bin/env node
/**
 * The Atlas's winds, trade lanes, airship lines and ports - grown, not drawn.
 *
 *   node tools/build-atlas.mjs [map-id]        (default earth-atlas)
 *   node tools/build-atlas.mjs --check         fail if the committed board or layers are stale
 *
 * Reads three things and invents nothing:
 *   data/maps/<id>.json            the board (rows, ports) and commission.atlas (which lanes, which airship lines)
 *   data/earth/winds.json          the planet's wind belts as a handful of numbers
 *   docs/map/layers/<id>/land-mask.png   where the coast really is, from tools/earth/relief.py
 *
 * Writes:
 *   data/maps/<id>.json `atlas`    GENERATED: each port's kind (Region board or abstract harbour), one wind
 *                                  per hex, every lane as a chain of hexes with its cost in rounds, every
 *                                  airship line likewise. This is what a game - printed or digital - plays.
 *   docs/map/layers/<id>/winds.svg, lanes.svg, airships.svg, places.svg, boards.svg
 *                                  the same things as pictures, on the plate's own pixels, added to
 *                                  layers.json beside the relief layers.
 *
 * Every rule of moving - what a hex step costs in a given wind, which hexes a ship may enter, how an
 * airship flies - is docs/js/atlas.js, loaded here through tools/lib/atlas.mjs. This file only grows the
 * wind field and draws.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPng } from './lib/png.mjs';
import { create as createAtlas, zonal, beltAt } from './lib/atlas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const mapId = args.find((a) => !a.startsWith('--')) ?? 'earth-atlas';
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const mapPath = join(ROOT, 'data', 'maps', `${mapId}.json`);
const map = readJson(mapPath);
const A = map.commission?.atlas;
if (!A) { console.error(`build-atlas: ${mapId} has no commission.atlas - it is not an Atlas board`); process.exit(1); }
const W = readJson(join(ROOT, 'data', 'earth', 'winds.json'));
const LAYERS = join(ROOT, 'docs', 'map', 'layers', mapId);
const manPath = join(LAYERS, 'layers.json');
if (!existsSync(manPath)) { console.error(`build-atlas: no ${manPath} - run tools/earth/relief.py ${mapId} first`); process.exit(1); }
const man = readJson(manPath);
const palette = readJson(join(ROOT, 'docs', 'art', 'palette.json'));

const RAD = Math.PI / 180, KM = 111.195;
const geo = map.plate.geo, F = map.plate.field, G = man.grid;
const COLS = map.grid.cols, ROWS = map.grid.rows;
const HW = G.hexAcrossPx, SC = HW / 60;
const lonPx = (lon) => G.originX + HW / 2 + ((lon - geo.lon0) / geo.hexLon) * HW;
const latPx = (lat) => G.originY + G.hexRadiusPx + ((geo.lat0 - lat) / geo.rowLat) * G.rowPitchPx;
const pxLat = (y) => geo.lat0 - ((y - G.originY - G.hexRadiusPx) / G.rowPitchPx) * geo.rowLat;
const TURN = 360 / geo.hexLon * HW;       // one trip round the planet, in plate pixels
const r1 = (n) => Math.round(n * 10) / 10;

/** A binary min-heap of [priority, value]. */
function makeHeap() {
  const heap = [];
  const push = (d, k) => { heap.push([d, k]); let n = heap.length - 1; while (n) { const p = (n - 1) >> 1; if (heap[p][0] <= heap[n][0]) break; [heap[p], heap[n]] = [heap[n], heap[p]]; n = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let n = 0; for (;;) { const a = 2 * n + 1, b = a + 1; let m = n; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === n) break; [heap[m], heap[n]] = [heap[n], heap[m]]; n = m; } } return top; };
  return { push, pop, size: () => heap.length };
}

/* ===================================================================== 1 · the land, on a degree grid */
const D = W.streamlines.gridDeg;
const NX = Math.round(360 / D);
const NORTH = Math.floor(pxLat(F.y) / D) * D, SOUTH = Math.ceil(pxLat(F.y + F.height) / D) * D;
const NY = Math.round((NORTH - SOUTH) / D) + 1;
const lonOf = (i) => -180 + (i + 0.5) * D;
const latOf = (j) => NORTH - j * D;
const mask = readPng(join(LAYERS, 'land-mask.png'));
const land = new Uint8Array(NX * NY);
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const x = Math.min(mask.width - 1, Math.max(0, Math.round(lonPx(lonOf(i)))));
  const y = Math.min(mask.height - 1, Math.max(0, Math.round(latPx(latOf(j)))));
  land[j * NX + i] = mask.rgb[(y * mask.width + x) * 3] > 127 ? 1 : 0;
}

/* Distance to the nearest land, in km, over the sea (Dijkstra on the grid; the board wraps east-west). */
const dist = new Float64Array(NX * NY).fill(Infinity);
{
  const { push, pop, size } = makeHeap();
  for (let k = 0; k < NX * NY; k++) if (land[k]) { dist[k] = 0; push(0, k); }
  while (size()) {
    const [d, k] = pop();
    if (d > dist[k]) continue;
    const j = Math.floor(k / NX), i = k % NX;
    const dx = D * KM * Math.max(0.05, Math.cos(latOf(j) * RAD)), dy = D * KM;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const jj = j + dj; if (jj < 0 || jj >= NY) continue;
      const ii = (i + di + NX) % NX, kk = jj * NX + ii;
      const nd = d + Math.hypot(di * dx, dj * dy);
      if (nd < dist[kk]) { dist[kk] = nd; push(nd, kk); }
    }
  }
}

/* ===================================================================== 2 · the wind field */
/* The belts, as a stream function: psi0(lat) = minus the integral of the eastward wind northward. */
const pts = W.profile.points;
const psi0 = new Float64Array(NY);
{
  /* integrate from the equator both ways, finely */
  const at = (lat) => { let s = 0, n = Math.max(1, Math.round(Math.abs(lat) / 0.05)), h = lat / n; for (let q = 0; q < n; q++) s += zonal((q + 0.5) * h, pts) * h * KM; return -s; };
  for (let j = 0; j < NY; j++) psi0[j] = at(latOf(j));
}
const psi = new Float64Array(NX * NY);
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const k = j * NX + i;
  psi[k] = land[k] ? 0 : psi0[j] * (1 - Math.exp(-dist[k] / W.coastTaperKm));
}
const U = new Float64Array(NX * NY), V = new Float64Array(NX * NY);
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const k = j * NX + i;
  if (land[k]) { U[k] = zonal(latOf(j), pts); V[k] = 0; continue; }
  const jn = Math.max(0, j - 1), js = Math.min(NY - 1, j + 1);
  const dyKm = (latOf(jn) - latOf(js)) * KM;
  const dxKm = 2 * D * KM * Math.max(0.05, Math.cos(latOf(j) * RAD));
  U[k] = -(psi[jn * NX + i] - psi[js * NX + i]) / dyKm;                     // u = -d psi / d north
  V[k] = (psi[j * NX + (i + 1) % NX] - psi[j * NX + (i - 1 + NX) % NX]) / dxKm; // v = d psi / d east
}
/** The field anywhere, bilinear; null over land. */
function windAt(lat, lon) {
  const fj = (NORTH - lat) / D, fi = (((lon + 180) % 360 + 360) % 360) / D - 0.5;
  const j0 = Math.floor(fj), i0 = Math.floor(fi);
  if (j0 < 0 || j0 >= NY - 1) return null;
  const tj = fj - j0, ti = fi - i0;
  let u = 0, v = 0, wsum = 0;
  for (const [dj, di, w] of [[0, 0, (1 - tj) * (1 - ti)], [0, 1, (1 - tj) * ti], [1, 0, tj * (1 - ti)], [1, 1, tj * ti]]) {
    const k = (j0 + dj) * NX + ((i0 + di) % NX + NX) % NX;
    if (land[k]) return null;
    u += U[k] * w; v += V[k] * w; wsum += w;
  }
  return { u, v, d: dist[(j0 + Math.round(tj)) * NX + ((i0 + Math.round(ti)) % NX + NX) % NX] };
}

/* ===================================================================== 3 · one wind per hex */
const engine0 = createAtlas(map, W);
const hexOfCell = new Int32Array(NX * NY);
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
  const h = engine0.hexOf(latOf(j), lonOf(i));
  hexOfCell[j * NX + i] = h ? h.row * COLS + h.col : -1;
}
const beltList = W.belts.list;
const windHexes = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const h = r * COLS + c;
  let su = 0, sv = 0, n = 0, lu = 0, ln = 0;
  for (let k = 0; k < NX * NY; k++) {
    if (hexOfCell[k] !== h) continue;
    if (land[k]) { lu += U[k]; ln++; } else { su += U[k]; sv += V[k]; n++; }
  }
  const u = n ? su / n : (ln ? lu / ln : 0), v = n ? sv / n : 0;
  const lat = engine0.latLonOf(c, r).lat;
  windHexes.push([c, r, Math.round(((Math.atan2(u, v) / RAD) + 360) % 360), r1(Math.hypot(u, v)), beltAt(lat, beltList).id]);
}

/* ===================================================================== 4 · ports and the boards they open onto */
/* A Region board is any other real-Earth map; its window in degrees is read off its own plate. */
const boards = [];
for (const f of readdirSync(join(ROOT, 'data', 'maps')).filter((x) => x.endsWith('.json')).sort()) {
  const m = readJson(join(ROOT, 'data', 'maps', f));
  if (m.id === mapId || !m.commission?.earth || !m.plate?.geo || !(m.rows ?? []).length) continue;
  const g = m.plate.geo, f2 = m.plate.field;
  const hw = f2.width / m.grid.cols, rad = hw / Math.sqrt(3), pitch = 1.5 * rad;
  const ox = f2.x + (f2.width - hw * (m.grid.cols + 0.5)) / 2, oy = f2.y + (f2.height - (pitch * (m.grid.rows - 1) + 2 * rad)) / 2;
  const lonAt = (x) => g.lon0 + ((x - ox - hw / 2) / hw) * g.hexLon, latAt = (y) => g.lat0 - ((y - oy - rad) / pitch) * g.rowLat;
  boards.push({ id: m.id, name: m.name, west: lonAt(f2.x), east: lonAt(f2.x + f2.width), north: latAt(f2.y), south: latAt(f2.y + f2.height) });
}
const placeOf = new Map((map.commission.earth.places ?? []).map((p) => [p.id, p]));
const ports = (map.settlements ?? []).map((s) => {
  const p = placeOf.get(s.id) ?? {};
  const board = boards.find((b) => p.lat <= b.north && p.lat >= b.south && p.lon >= b.west && p.lon <= b.east);
  return {
    id: s.id, name: s.name, hex: [s.col, s.row], lat: p.lat, lon: p.lon,
    kind: board ? 'board' : 'abstract',
    ...(board ? { board: board.id } : {}),
    ...(s.afloat ? { afloat: true } : {}),
  };
});

/* ===================================================================== 5 · lanes and airship lines */
const atlasBlock = {
  $comment: 'GENERATED by tools/build-atlas.mjs from commission.atlas, data/earth/winds.json and the land - do not hand-edit. What a game plays on the Atlas: every port and what it opens onto, the wind in every hex, every trade lane and airship line as a chain of hexes with its cost in rounds. The rules that turn these into moves are docs/js/atlas.js; the wind rule they use is the EXAMPLE in data/earth/winds.json, not an adopted rule.',
  moves: A.moves,
  boards: boards.map((b) => ({ id: b.id, name: b.name, bounds: { west: r1(b.west), east: r1(b.east), north: r1(b.north), south: r1(b.south) } })),
  ports,
  winds: {
    $comment: 'One per hex: [col, row, bearing the wind blows TOWARD (compass degrees, north up the board), speed m/s, belt]. Averaged over the hex\'s sea; a hex with no sea takes the belt\'s own wind. Calm below data/earth/winds.json calmBelowMs.',
    model: 'data/earth/winds.json',
    rule: { calmBelowMs: W.calmBelowMs, fullStrengthMs: W.fullStrengthMs, exampleRule: W.exampleRule },
    hexes: windHexes,
  },
  lanes: [],
  airships: [],
};
const mapForEngine = { ...map, atlas: atlasBlock };
const engine = createAtlas(mapForEngine, W);
const portById = new Map(ports.map((p) => [p.id, p]));
for (const lane of A.lanes ?? []) {
  const legs = [];
  let hexes = [], cost = 0;
  for (let i = 1; i < lane.ports.length; i++) {
    const a = portById.get(lane.ports[i - 1]), b = portById.get(lane.ports[i]);
    if (!a || !b) { console.error(`build-atlas: lane ${lane.id} names a port that is not on the board (${lane.ports[i - 1]} or ${lane.ports[i]})`); process.exit(1); }
    const v = engine.voyage({ col: a.hex[0], row: a.hex[1] }, { col: b.hex[0], row: b.hex[1] });
    if (!v) { console.error(`build-atlas: no sea way from ${a.name} to ${b.name}`); process.exit(1); }
    legs.push({ from: a.id, to: b.id, hexes: v.hexes.length - 1, cost: v.cost, rounds: v.rounds });
    hexes = hexes.concat(hexes.length ? v.hexes.slice(1) : v.hexes);
    cost += v.cost;
  }
  const moves = A.moves?.ship ?? 1;
  atlasBlock.lanes.push({ id: lane.id, name: lane.name, ports: lane.ports, hexes, cost: Math.round(cost * 100) / 100, rounds: Math.ceil(cost / moves - 1e-9), legs, ...(lane.note ? { note: lane.note } : {}) });
}
for (const air of A.airships ?? []) {
  const a = engine.airship(air.from, air.to);
  atlasBlock.airships.push({ id: air.id, name: air.name, from: air.from, to: air.to, hexes: a.hexes, km: a.km, rounds: a.rounds, ...(air.note ? { note: air.note } : {}) });
}

/* ===================================================================== 6 · the pictures */
const FONT = "Merriweather, 'Liberation Serif', Georgia, serif";
const INK = palette.ink.soot.hex, OXIDE = palette.inks.oxide.hex, BRUISE = palette.inks.bruise.hex, SLATE = palette.inks.slate.hex;
const head = (title) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${man.plate.width} ${man.plate.height}" width="${man.plate.width}" height="${man.plate.height}">\n<title>${title}</title>\n`;
const clipDef = `<defs><clipPath id="field"><rect x="${F.x}" y="${F.y}" width="${F.width}" height="${F.height}"/></clipPath></defs>\n`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Lat/lon points -> plate pixels, unwrapped so a line crossing the date line stays one line. */
function toPx(points) {
  const out = [];
  let shift = 0, last = null;
  for (const p of points) {
    let lon = p.lon + shift;
    if (last !== null && lon - last > 180) { shift -= 360; lon -= 360; }
    if (last !== null && lon - last < -180) { shift += 360; lon += 360; }
    last = lon;
    out.push([lonPx(lon), latPx(p.lat)]);
  }
  return out;
}
/** A path drawn three times - where it is and a turn either side - inside the field, so the wrap is seamless. */
const wrapped = (inner) => `<g clip-path="url(#field)">${inner}<g transform="translate(${r1(-TURN)},0)">${inner}</g><g transform="translate(${r1(TURN)},0)">${inner}</g></g>`;
const d = (xy) => 'M' + xy.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join('L');
function chaikin(xy, n) {
  for (let it = 0; it < n; it++) {
    const out = [xy[0]];
    for (let i = 0; i < xy.length - 1; i++) {
      const [ax, ay] = xy[i], [bx, by] = xy[i + 1];
      out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    out.push(xy[xy.length - 1]);
    xy = out;
  }
  return xy;
}
const lengthOf = (xy) => xy.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - xy[i][0], p[1] - xy[i][1]), 0);
/** The stretch of a line `len` long centred at its point nearest `at`, turned to read left to right. */
function stretch(xy, mid, len) {
  const cum = [0];
  for (let i = 1; i < xy.length; i++) cum.push(cum[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
  const s0 = Math.max(0, cum[mid] - len / 2), s1 = Math.min(cum[cum.length - 1], s0 + len);
  let seg = xy.filter((_, i) => cum[i] >= s0 && cum[i] <= s1);
  if (seg.length < 2) return null;
  if (seg[seg.length - 1][0] < seg[0][0]) seg = seg.slice().reverse();
  return seg;
}
const textW = (s, size, sp = 0) => s.length * size * (s === s.toUpperCase() ? 0.72 : 0.56) + sp * (s.length - 1);
/* Every label already on the board - the region and sea names relief.py set - is room nobody else may take. */
const taken = [];
if (existsSync(join(LAYERS, 'regions.svg'))) {
  for (const m of readFileSync(join(LAYERS, 'regions.svg'), 'utf8').matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="([\d.]+)"[^>]*letter-spacing="([\d.]+)"[^>]*>([^<]+)<\/text>/g)) {
    const [x, y, size, sp] = m.slice(1, 5).map(Number), w = textW(m[5], size, sp);
    taken.push([x - w / 2, y - size, x + w / 2, y + size * 0.3]);
  }
}
const clear = (b) => !taken.some((o) => !(b[2] < o[0] || b[0] > o[2] || b[3] < o[1] || b[1] > o[3]));
const boxOf = (xy, pad) => { const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]); return [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad]; };
/** The room a name set along a curve takes: a box every letter-height or so, not one box round the lot. */
function segBoxes(seg, size, below = false) {
  const out = [], dy = below ? size * 1.45 : 0;
  let run = Infinity;
  for (let i = 0; i < seg.length; i++) {
    if (i) run += Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]);
    if (run < size * 0.9 && i < seg.length - 1) continue;
    run = 0;
    out.push([seg[i][0] - size * 0.7, seg[i][1] - size * 1.2 + dy, seg[i][0] + size * 0.7, seg[i][1] + size * 0.5 + dy]);
  }
  return out;
}
/** Ramer-Douglas-Peucker: the fewest points that stay within `tol` of the line. */
function simplify(xy, tol) {
  if (xy.length < 3) return xy;
  const keep = new Uint8Array(xy.length); keep[0] = keep[xy.length - 1] = 1;
  const stack = [[0, xy.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = xy[a], [bx, by] = xy[b], L = Math.hypot(bx - ax, by - ay) || 1;
    let far = -1, fd = tol;
    for (let i = a + 1; i < b; i++) { const dd = Math.abs((bx - ax) * (ay - xy[i][1]) - (ax - xy[i][0]) * (by - ay)) / L; if (dd > fd) { fd = dd; far = i; } }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return xy.filter((_, i) => keep[i]);
}
/** A clear stretch of a line to set a name on: the middle if it is free, else the nearest free stretch either side. */
const FRACS = Array.from({ length: 21 }, (_, i) => 0.5 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.04);
function placeOnLine(xy, len, size, fracs = FRACS) {
  /* Returns { seg, below }: a stretch of the line to set the name along, and whether the name sits under
     the line rather than over it. null when there is no room at all. */
  let fallback = null;
  for (const below of [false, true]) {
    for (const f of fracs) {
      let seg = stretch(xy, Math.floor((xy.length - 1) * f), len);
      if (!seg || lengthOf(seg) < len * 0.9) continue;
      /* a stretch past the date line is set on the copy of the line that is on the board */
      const mx = (seg[0][0] + seg[seg.length - 1][0]) / 2;
      if (mx > F.x + F.width) seg = seg.map(([x, y]) => [x - TURN, y]);
      else if (mx < F.x) seg = seg.map(([x, y]) => [x + TURN, y]);
      const boxes = segBoxes(seg, size, below);
      if (!boxes.every((b) => b[0] >= F.x && b[2] <= F.x + F.width && b[1] >= F.y && b[3] <= F.y + F.height)) continue;
      const blocked = boxes.filter((b) => !clear(b)).length;
      if (!blocked) { taken.push(...boxes); return { seg, below }; }
      if (!fallback || blocked < fallback.blocked) fallback = { seg, below, boxes, blocked };
    }
  }
  /* Nowhere wholly clear: a line's name is worth more than a little crowding, so take the least crowded
     stretch if it only brushes something. */
  if (fallback && fallback.blocked <= 3) { taken.push(...fallback.boxes); crowded++; return { seg: fallback.seg, below: fallback.below }; }
  return null;
}
let crowded = 0;
const unnamed = [];

/* ---------------------------------------------------------------- ports */
const portMarks = [];
let svgPlaces = head('Ports. A filled mark opens onto a Region board; a hollow one is an abstract harbour (a market card). A ring round the mark: the port is an anchorage, its hex is water at this scale.') + clipDef + `<g font-family="${FONT}" paint-order="stroke" stroke-linejoin="round">\n`;
for (const p of ports) {
  const own = engine.hexOf(p.lat, p.lon);
  const atHex = own && (own.col !== p.hex[0] || own.row !== p.hex[1]);
  const c = map.settlements.find((s) => s.id === p.id);
  const hx = G.originX + HW * (c.col + 0.5 * (c.row & 1)) + HW / 2;
  /* where it really is - taken a turn east or west if that is the copy beside its own hex, so a port on
     the 180th meridian is drawn on the half of the board its hex is on */
  const x = atHex ? hx : [p.lon, p.lon + 360, p.lon - 360].map(lonPx).sort((a, b) => Math.abs(a - hx) - Math.abs(b - hx))[0];
  const y = atHex ? G.originY + G.rowPitchPx * c.row + G.hexRadiusPx : latPx(p.lat);
  const rad = SC * 5.2, size = SC * 13;
  const w = textW(p.name, size);
  /* right, left, above, below: the first that is clear of every other name */
  const tries = [
    ['start', x + rad + SC * 3, y + size * 0.35], ['end', x - rad - SC * 3, y + size * 0.35],
    ['middle', x, y - rad - SC * 3], ['middle', x, y + rad + size * 0.95],
  ];
  const boxAt = ([an, ax, ay]) => (an === 'start' ? [ax, ay - size, ax + w, ay + size * 0.3] : an === 'end' ? [ax - w, ay - size, ax, ay + size * 0.3] : [ax - w / 2, ay - size, ax + w / 2, ay + size * 0.3]);
  const pick = tries.find((t) => { const b = boxAt(t); return b[0] > F.x && b[2] < F.x + F.width && clear(b); }) ?? tries[0];
  const [anchor, tx, ty] = pick;
  taken.push(boxAt(pick), [x - rad, y - rad, x + rad, y + rad]);
  portMarks.push({ id: p.id, x, y });
  const fill = p.kind === 'board' ? INK : '#FFFFFF';
  const mark = (p.afloat ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(rad * 1.8)}" fill="none" stroke="${INK}" stroke-width="${r1(SC * 0.9)}" stroke-dasharray="${r1(SC * 2)} ${r1(SC * 1.6)}"/>` : '') +
    `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(rad)}" fill="${fill}" stroke="${INK}" stroke-width="${r1(SC * 1.4)}"/>`;
  /* a mark within a hex of the board's edge is drawn on the far edge as well: it is the same hex */
  const edge = x - F.x < HW || F.x + F.width - x < HW;
  svgPlaces += `<g data-id="${p.id}" data-kind="${p.kind}"${p.board ? ` data-board="${p.board}"` : ''}>` + (edge ? wrapped(mark) : mark) +
    `<text x="${r1(tx)}" y="${r1(ty)}" text-anchor="${anchor}" font-size="${r1(size)}" font-weight="${p.kind === 'board' ? 700 : 400}" fill="${INK}" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="${r1(SC * 2.4)}">${esc(p.name)}</text></g>\n`;
}
svgPlaces += '</g></svg>\n';

/* ---------------------------------------------------------------- Region boards */
let svgBoards = head('Region boards: the window each one opens onto the Atlas.') + clipDef;
for (const b of boards) {
  const x0 = lonPx(b.west), x1 = lonPx(b.east), y0 = latPx(b.north), y1 = latPx(b.south);
  svgBoards += `<g data-board="${b.id}"><rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(x1 - x0)}" height="${r1(y1 - y0)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="${r1(SC * 4)}"/>` +
    `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(x1 - x0)}" height="${r1(y1 - y0)}" fill="none" stroke="${INK}" stroke-width="${r1(SC * 1.6)}" stroke-dasharray="${r1(SC * 10)} ${r1(SC * 4)}"/>` +
    `<text x="${r1(x0 + SC * 5)}" y="${r1(y0 + SC * 16)}" font-family="${FONT}" font-size="${r1(SC * 12)}" font-weight="700" fill="${INK}" stroke="#FFFFFF" stroke-width="${r1(SC * 2.4)}" paint-order="stroke">${esc(b.name)} - Region board</text></g>\n`;
}
svgBoards += '</svg>\n';

/* ---------------------------------------------------------------- airships: a dotted arc */
let svgAir = head('Airship lines: the great circle - the shortest way over a globe - which bows towards the pole on a flat map. Two hexes a round, over land or sea.') + clipDef;
for (const air of atlasBlock.airships) {
  const gc = engine.airship(air.from, air.to);
  const xy = toPx(gc.points);
  const size = SC * 11;
  const name = `${air.name} · ${air.rounds} rounds`;
  const spot = placeOnLine(xy, textW(name, size) * 1.1, size);
  const seg = spot?.seg;
  const body = `<path d="${d(xy)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.75" stroke-width="${r1(SC * 4.6)}" stroke-dasharray="0 ${r1(SC * 7)}" stroke-linecap="round"/>` +
    `<path d="${d(xy)}" fill="none" stroke="${BRUISE}" stroke-width="${r1(SC * 3)}" stroke-dasharray="0 ${r1(SC * 7)}" stroke-linecap="round"/>` +
    chevrons(xy.slice(-6), 1e9, SC * 7, BRUISE);
  if (!seg) unnamed.push(air.name);
  const id = `air-${air.id}`;
  const label = seg ? `<path id="${id}" d="${d(seg)}" fill="none"/><text font-family="${FONT}" font-style="italic" font-size="${r1(size)}" fill="${BRUISE}" stroke="#FFFFFF" stroke-width="${r1(SC * 2.6)}" paint-order="stroke" dy="${r1(spot?.below ? size * 1.05 : -SC * 6)}"><textPath href="#${id}" xlink:href="#${id}" startOffset="50%" text-anchor="middle">${esc(name)}</textPath></text>` : '';
  svgAir += `<g data-airship="${air.id}">${wrapped(body)}${label}</g>\n`;
}
svgAir += '</svg>\n';

/* ---------------------------------------------------------------- lanes: a curve that follows the coast */
const LS = W.streamlines;
function laneCurve(from, to, corridor) {
  /* A finer walk than the hexes, through sea cells of the hexes the lane already sails, preferring to keep
     a few hundred km off the coast: close enough to follow it, far enough not to draw on the beach. */
  const startOf = (p) => { let best = -1, bd = Infinity; for (let k = 0; k < NX * NY; k++) { if (land[k]) continue; const j = Math.floor(k / NX), i = k % NX; let dl = Math.abs(lonOf(i) - p.lon); dl = Math.min(dl, 360 - dl); const dd = Math.hypot(dl * Math.cos(p.lat * RAD), latOf(j) - p.lat); if (dd < bd) { bd = dd; best = k; } } return best; };
  const s = startOf(from), g = startOf(to);
  for (const strict of [true, false]) {
    const cost = new Float64Array(NX * NY).fill(Infinity), prev = new Int32Array(NX * NY).fill(-1);
    const hp = makeHeap(); hp.push(0, s); cost[s] = 0;
    while (hp.size()) {
      const [cd, k] = hp.pop();
      if (cd > cost[k]) continue;
      if (k === g) break;
      const j = Math.floor(k / NX), i = k % NX;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const jj = j + dj; if (jj < 0 || jj >= NY) continue;
        const kk = jj * NX + (i + di + NX) % NX;
        if (land[kk] && kk !== g) continue;
        const inside = corridor.has(hexOfCell[kk]);
        if (strict && !inside && kk !== g) continue;
        const km = Math.hypot(di * D * KM * Math.cos(latOf(j) * RAD), dj * D * KM);
        const dd = dist[kk];
        const pull = 1 + Math.min(1.2, Math.max(0, (dd - 420) / 900)) + (dd < 110 ? 0.8 : 0) + (inside ? 0 : 3);
        const nd = cd + km * pull;
        if (nd < cost[kk]) { cost[kk] = nd; prev[kk] = k; hp.push(nd, kk); }
      }
    }
    if (prev[g] === -1 && g !== s) continue;
    const cells = [];
    for (let k = g; k !== -1; k = prev[k]) cells.unshift({ lat: latOf(Math.floor(k / NX)), lon: lonOf(k % NX) });
    return [{ lat: from.lat, lon: from.lon }, ...cells, { lat: to.lat, lon: to.lon }];
  }
  return [from, to];
}
function chevrons(xy, every, size, colour) {
  let out = '', run = every * 0.5;
  for (let i = 1; i < xy.length; i++) {
    const [ax, ay] = xy[i - 1], [bx, by] = xy[i];
    run += Math.hypot(bx - ax, by - ay);
    if (run < every && i < xy.length - 1) continue;
    run = 0;
    const a = Math.atan2(by - ay, bx - ax);
    const p = (t, s) => `${r1(bx + Math.cos(a + t) * s)},${r1(by + Math.sin(a + t) * s)}`;
    out += `<path d="M${p(2.6, size)}L${r1(bx)},${r1(by)}L${p(-2.6, size)}" fill="none" stroke="${colour}" stroke-width="${r1(SC * 1.8)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return out;
}
let svgLanes = head('Trade lanes: each one sailed on the winds, port to port, by the rule in docs/js/atlas.js. Dashed, with the way it runs.') + clipDef;
for (const lane of atlasBlock.lanes) {
  let pts = [];
  for (let i = 0; i < lane.legs.length; i++) {
    const leg = lane.legs[i];
    const a = portById.get(leg.from), b = portById.get(leg.to);
    const v = engine.voyage({ col: a.hex[0], row: a.hex[1] }, { col: b.hex[0], row: b.hex[1] });
    const corridor = new Set(v.hexes.map(([c, r]) => r * COLS + c));
    const legPts = laneCurve(a, b, corridor);
    pts = pts.concat(i ? legPts.slice(1) : legPts);
  }
  const xy = chaikin(simplify(toPx(pts), SC * 7), 5);
  const name = lane.name;
  const size = SC * 11.5;
  const spot = placeOnLine(xy, textW(`${name} · ${lane.rounds} rounds`, size) * 1.1, size);
  const seg = spot?.seg;
  const body = `<path d="${d(xy)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="${r1(SC * 4.2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d(xy)}" fill="none" stroke="${OXIDE}" stroke-width="${r1(SC * 2.2)}" stroke-dasharray="${r1(SC * 9)} ${r1(SC * 5)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    chevrons(xy, SC * 130, SC * 7, OXIDE);
  let label = '';
  if (!seg) unnamed.push(lane.name);
  if (seg) {
    const id = `lane-${lane.id}`;
    label = `<path id="${id}" d="${d(seg)}" fill="none"/><text font-family="${FONT}" font-style="italic" font-weight="700" font-size="${r1(size)}" fill="${OXIDE}" stroke="#FFFFFF" stroke-width="${r1(SC * 2.6)}" paint-order="stroke" dy="${r1(spot.below ? size * 1.05 : -SC * 5)}"><textPath href="#${id}" xlink:href="#${id}" startOffset="50%" text-anchor="middle">${esc(name)} · ${lane.rounds} rounds</textPath></text>`;
  }
  svgLanes += `<g data-lane="${lane.id}">${wrapped(body)}${label}</g>\n`;
}
svgLanes += '</svg>\n';

/* ---------------------------------------------------------------- winds: streamlines */
/* Evenly spaced streamlines (after Jobard and Lefer): seed on a lattice over the open sea, trace each one
   both ways until it runs ashore, dies in a calm or comes too close to one already drawn. */
const sep = LS.spacingDeg, step = LS.stepDeg;
const occ = new Map();
const cellK = (lat, lon) => `${Math.floor(lat / (sep / 2))},${Math.floor((((lon + 180) % 360 + 360) % 360) / (sep / 2))}`;
const nearLine = (lat, lon, lim, own) => {
  const a = Math.floor(lat / (sep / 2)), b = Math.floor((((lon + 180) % 360 + 360) % 360) / (sep / 2)), nb = Math.round(720 / sep);
  for (let da = -2; da <= 2; da++) for (let db = -2; db <= 2; db++) {
    for (const q of occ.get(`${a + da},${(b + db + nb) % nb}`) ?? []) {
      if (q.line === own) continue;
      let dl = Math.abs(q.lon - lon); dl = Math.min(dl, 360 - dl);
      if (Math.hypot(dl * Math.cos(lat * RAD), q.lat - lat) < lim) return true;
    }
  }
  return false;
};
const latMin = pxLat(F.y + F.height) + 1, latMax = pxLat(F.y) - 1;
function trace(lat, lon, sign, lineId) {
  const out = [];
  let p = { lat, lon };
  for (let n = 0; n < 2400; n++) {
    const w = windAt(p.lat, p.lon);
    if (!w || w.d < LS.landClearKm) break;
    const sp = Math.hypot(w.u, w.v);
    if (sp < W.calmBelowMs * 0.5) break;
    const cosl = Math.max(0.25, Math.cos(p.lat * RAD));
    const mid = { lat: p.lat + sign * (w.v / sp) * step * 0.5, lon: p.lon + sign * (w.u / sp) * step * 0.5 / cosl };
    const w2 = windAt(mid.lat, mid.lon);
    if (!w2) break;
    const s2 = Math.hypot(w2.u, w2.v) || 1;
    const nxt = { lat: p.lat + sign * (w2.v / s2) * step, lon: p.lon + sign * (w2.u / s2) * step / cosl };
    if (nxt.lat < latMin || nxt.lat > latMax) break;
    if (nearLine(nxt.lat, nxt.lon, sep * 0.45, lineId)) break;
    if (out.length > 30 && Math.hypot(nxt.lat - lat, nxt.lon - lon) < step) break;   // came round to where it began
    out.push(nxt);
    p = nxt;
  }
  return out;
}
const lines = [];
for (let lat = latMax - sep / 2; lat > latMin; lat -= sep) {
  for (let lon = -180 + sep / 2; lon < 180; lon += sep) {
    const w = windAt(lat, lon);
    if (!w || w.d < LS.landClearKm * 1.5 || Math.hypot(w.u, w.v) < W.calmBelowMs) continue;
    if (nearLine(lat, lon, sep * 0.9, -1)) continue;
    const id = lines.length;
    const back = trace(lat, lon, -1, id).reverse();
    const fwd = trace(lat, lon, 1, id);
    const line = [...back, { lat, lon }, ...fwd];
    let len = 0;
    for (let i = 1; i < line.length; i++) len += Math.hypot((line[i].lon - line[i - 1].lon) * Math.cos(line[i].lat * RAD), line[i].lat - line[i - 1].lat);
    if (len < LS.minLengthDeg) continue;
    for (const q of line) { const k = cellK(q.lat, q.lon); if (!occ.has(k)) occ.set(k, []); occ.get(k).push({ ...q, line: id }); }
    lines.push(line);
  }
}
let svgWinds = head('The winds: streamlines of the wind field grown from data/earth/winds.json, each one thickening the way it blows. The belts are named where they blow.') + clipDef;
let windInk = '';
for (const line of lines) {
  const xy = simplify(toPx(line), 0.8);
  const n = 6, per = Math.ceil(xy.length / n);
  for (let s = 0; s < n; s++) {
    const part = xy.slice(s * per, Math.min(xy.length, (s + 1) * per + 1));
    if (part.length < 2) continue;
    const t = (s + 1) / n;
    windInk += `<path d="${d(part)}" stroke-width="${r1(SC * (0.5 + 1.7 * t))}" stroke-opacity="${(0.25 + 0.6 * t).toFixed(2)}"/>`;
  }
}
svgWinds += wrapped(`<g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">${windInk}</g>`) + '\n';
/* The names. One per belt in each big ocean, on the streamline that runs through the belt's open water. */
const BASINS = [{ id: 'atlantic', west: -65, east: 10 }, { id: 'indian', west: 45, east: 105 }, { id: 'pacific', west: 150, east: -95 }];
const inBasin = (lon, b) => (b.west < b.east ? lon >= b.west && lon <= b.east : lon >= b.west || lon <= b.east);
let windNames = '';
let nid = 0;
for (const belt of beltList) {
  if (belt.label === false) continue;
  const mid = (belt.from + belt.to) / 2;
  for (const basin of BASINS) {
    const size = SC * (belt.calm ? 13 : 12.5), sp = SC * 3;
    const text = belt.name.toUpperCase();
    if (belt.calm) {
      /* A calm has no streamline to ride: it is named where the open water is widest. */
      let best = null;
      for (let lon = -180; lon < 180; lon += 1) {
        if (!inBasin(lon, basin)) continue;
        const w = windAt(mid, lon); if (!w) continue;
        if (!best || w.d > best.d) best = { lon, d: w.d };
      }
      if (!best || best.d < 900) continue;
      const x = lonPx(best.lon), y = latPx(mid), wd = textW(text, size, sp);
      const bb = [x - wd / 2, y - size, x + wd / 2, y + size * 0.4];
      if (!clear(bb)) continue;
      taken.push(bb);
      windNames += `<text x="${r1(x)}" y="${r1(y + size * 0.35)}" text-anchor="middle" font-size="${r1(size)}" letter-spacing="${r1(sp)}" font-style="italic">${esc(text)}</text>`;
      continue;
    }
    const cands = [];
    for (const [li, line] of lines.entries()) {
      for (let i = 0; i < line.length; i += 3) {
        const q = line[i];
        if (q.lat < belt.from + 3 || q.lat > belt.to - 3 || !inBasin(q.lon, basin)) continue;
        const w = windAt(q.lat, q.lon); if (!w) continue;
        cands.push({ li, i, score: Math.min(w.d, 2500) - Math.abs(q.lat - mid) * 40 });
      }
    }
    cands.sort((p, q) => q.score - p.score);
    const len = textW(text, size, sp) * 1.08;
    let seg = null;
    for (const c of cands.slice(0, 60)) {
      const s2 = stretch(toPx(lines[c.li]), c.i, len);
      /* long enough to hold the name, and straight enough to read: its ends nearly as far apart as it is long */
      if (!s2 || lengthOf(s2) < len * 0.95) continue;
      const span = Math.hypot(s2[s2.length - 1][0] - s2[0][0], s2[s2.length - 1][1] - s2[0][1]);
      if (span < len * 0.8 || Math.abs(s2[s2.length - 1][0] - s2[0][0]) < len * 0.6) continue;
      const boxes = segBoxes(s2, size);
      if (!boxes.every((b) => b[0] >= F.x && b[2] <= F.x + F.width && clear(b))) continue;
      taken.push(...boxes); seg = s2; break;
    }
    if (!seg) continue;
    const id = `wind-${++nid}`;
    windNames += `<path id="${id}" d="${d(seg)}" fill="none"/><text font-size="${r1(size)}" letter-spacing="${r1(sp)}" font-style="italic" dy="${r1(size * 0.36)}"><textPath href="#${id}" xlink:href="#${id}" startOffset="50%" text-anchor="middle">${esc(text)}</textPath></text>`;
  }
}
svgWinds += `<g font-family="${FONT}" fill="#FFFFFF" stroke="${SLATE}" stroke-opacity="0.85" stroke-width="${r1(SC * 2.6)}" paint-order="stroke" stroke-linejoin="round">${windNames}</g>\n</svg>\n`;

/* ===================================================================== 7 · write, or check */
const outputs = {
  'winds.svg': svgWinds, 'lanes.svg': svgLanes, 'airships.svg': svgAir, 'places.svg': svgPlaces, 'boards.svg': svgBoards,
};
const BY = 'tools/build-atlas.mjs';
const mine = [
  { id: 'boards', file: 'boards.svg', kind: 'vector', format: 'svg', order: 35, role: 'the window each Region board opens onto the Atlas, outlined and named', blend: 'normal', default: true, by: BY },
  { id: 'winds', file: 'winds.svg', kind: 'vector', format: 'svg', order: 36, role: 'the prevailing winds as long white streamlines round the ocean basins, the belts named on them. Grown from data/earth/winds.json', blend: 'normal', default: true, by: BY },
  { id: 'lanes', file: 'lanes.svg', kind: 'vector', format: 'svg', order: 37, role: 'trade lanes: dashed curves port to port, with the way they run and their length in rounds', blend: 'normal', default: true, by: BY },
  { id: 'airships', file: 'airships.svg', kind: 'vector', format: 'svg', order: 38, role: 'airship lines: dotted great-circle arcs, with their length in rounds', blend: 'normal', default: true, by: BY },
  { id: 'places', file: 'places.svg', kind: 'vector', format: 'svg', order: 40, role: 'ports: filled opens onto a Region board, hollow is an abstract harbour, a dashed ring is an anchorage (its hex is water)', blend: 'normal', default: true, by: BY },
];
const recipes = {
  'sailing-board': ['ground', 'hexes', 'winds', 'lanes', 'places', 'regions', 'frame'],
  'atlas-full': ['ground', 'hexes', 'graticule', 'boards', 'winds', 'lanes', 'airships', 'places', 'regions', 'frame'],
  'winds-only': ['ground', 'winds', 'frame'],
};
const nextMan = { ...man };
nextMan.layers = [...man.layers.filter((l) => !mine.some((m) => m.id === l.id)), ...mine.map((l) => ({ ...l, bytes: Buffer.byteLength(outputs[l.file]) }))].sort((a, b) => a.order - b.order);
nextMan.recipes = { ...man.recipes, ...recipes };
nextMan.recipesBy = recipes;
nextMan.data = { ...man.data, atlas: `data/maps/${mapId}.json#atlas`, winds: 'data/earth/winds.json', engine: 'docs/js/atlas.js' };
const nextMap = { ...map, atlas: atlasBlock };
const json = (o) => JSON.stringify(o, null, 2) + '\n';

if (CHECK) {
  const stale = [];
  if (JSON.stringify(map.atlas) !== JSON.stringify(atlasBlock)) stale.push(`data/maps/${mapId}.json atlas block`);
  for (const [f, s] of Object.entries(outputs)) if (!existsSync(join(LAYERS, f)) || readFileSync(join(LAYERS, f), 'utf8') !== s) stale.push(`docs/map/layers/${mapId}/${f}`);
  if (stale.length) { console.error(`build-atlas --check: stale - run node tools/build-atlas.mjs ${mapId}\n  ${stale.join('\n  ')}`); process.exit(1); }
  console.log(`build-atlas --check: ${mapId} is current`);
  process.exit(0);
}
writeFileSync(mapPath, json(nextMap));
for (const [f, s] of Object.entries(outputs)) writeFileSync(join(LAYERS, f), s);
writeFileSync(manPath, json(nextMan));

console.log(`build-atlas: ${map.name}`);
console.log(`  ports: ${ports.length} (${ports.filter((p) => p.kind === 'board').length} on a Region board, ${ports.filter((p) => p.kind === 'abstract').length} abstract harbours, ${ports.filter((p) => p.afloat).length} anchorages)`);
const calm = windHexes.filter((w) => w[3] < W.calmBelowMs).length;
console.log(`  winds: ${windHexes.length} hexes, ${calm} calm; ${lines.length} streamlines`);
for (const l of atlasBlock.lanes) console.log(`  lane  ${l.name.padEnd(22)} ${String(l.hexes.length - 1).padStart(3)} hexes  ${String(l.cost).padStart(6)} cost  ${l.rounds} rounds   (${l.legs.map((g) => `${g.from}>${g.to} ${g.rounds}`).join(', ')})`);
if (unnamed.length) console.log(`  no room on the board for the name of: ${unnamed.join(', ')} (it is in the data and the viewer)`);
for (const a of atlasBlock.airships) console.log(`  air   ${a.name.padEnd(22)} ${String(a.hexes.length - 1).padStart(3)} hexes  ${String(a.km).padStart(6)} km    ${a.rounds} rounds`);
