#!/usr/bin/env node
/**
 * Grows a board out of a commission, and draws it.
 *
 * This inverts the map line. A DRAWN map is a plate that data is read off:
 * somebody paints a country, tools/trace-map.mjs samples the pixels, and three
 * or four rounds of hand-correction against a proof sheet turn a guess into
 * `rows`. A GENERATED map is the other way round and the way everything else in
 * this repository already works - the board is the source and the picture is an
 * output. There is nothing to trace because nothing was guessed.
 *
 * Which one a map is, is one field: plate.kind. Nothing else changes, both stay
 * supported, and docs/map/README.md's seven traceability rules go on being the
 * contract for the drawn kind.
 *
 * WHY VECTOR. The same argument tools/build-minimaps.mjs already makes, at world
 * scale: "drawn ground competes with the pieces standing on it". A campaign map
 * is the largest surface anybody stands pieces on, so it is a flat terrain
 * colour and a coastline, and the hex grid stays an overlay drawn at read time.
 * It also retires the one problem the drawn plate could never solve - an SVG has
 * no long side, so the A1 preset that korvane-reach.json calls "a layout waiting
 * on a larger plate" is simply printable.
 *
 * WHAT IS TYPED AND WHAT IS COMPUTED. A person decides that there are three
 * chains running north-east to south-west, that the volcano is on the largest
 * island, and what every settlement is called. Those are in the commission, as
 * `landform` anchors and `places` names. Everything positional past that - which
 * 331 hexes are land, where the coast falls, which hex each harbour stands on,
 * what the shipping lanes are - is worked out here. If a number that is not an
 * anchor appears in a map file, it came from this tool.
 *
 * Usage:
 *   node tools/draw-map.mjs sundering-isles           grow, draw, write back
 *   node tools/draw-map.mjs sundering-isles --check   fail if either is stale
 *   node tools/draw-map.mjs sundering-isles --rows    print the board, write nothing
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout, neighbours, distance, hexId } from './lib/hexgrid.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const mapId = args.find((a) => !a.startsWith('--'));

/* With no map id, sweep every generated map. That is what CI wants - one step,
   the same shape as every other --check in the build - and it means adding a
   second generated map needs no edit anywhere but data/maps/. Named explicitly,
   the tool does one map and says more about it. */
if (!mapId) {
  const dir = join(ROOT, 'data', 'maps');
  const ids = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    .filter((m) => m.plate?.kind === 'generated')
    .map((m) => m.id);
  if (!ids.length) { console.log('draw-map: no generated maps. Nothing to do.'); process.exit(0); }
  let bad = 0;
  for (const id of ids) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), id, ...args], { stdio: 'inherit' });
    if (r.status !== 0) bad++;
  }
  process.exit(bad ? 1 : 0);
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const mapPath = join(ROOT, 'data', 'maps', `${mapId}.json`);
if (!existsSync(mapPath)) { console.error(`draw-map: no data/maps/${mapId}.json`); process.exit(1); }

const map = readJson(mapPath);
const terrainFile = readJson(join(ROOT, 'data', 'terrain.json'));
const palette = readJson(join(ROOT, 'docs', 'art', 'palette.json'));

const terrainById = new Map(terrainFile.terrains.map((t) => [t.id, t]));
const isWaterId = (id) => terrainById.get(id)?.family === 'water';
const charFor = Object.fromEntries(
  Object.entries(map.legend).filter(([k]) => !k.startsWith('$')).map(([ch, id]) => [id, ch]));

if (map.plate?.kind && map.plate.kind !== 'generated') {
  console.error(`draw-map: ${mapId} is a ${map.plate.kind} plate. This tool only grows generated ones — see data/mint.json lines.maps.plate.kind.`);
  process.exit(1);
}
const form = map.commission?.landform;
if (!form) {
  console.error(`draw-map: ${mapId} has no commission.landform. A generated map needs its anchors — the islands, the links and the edges. See data/maps/sundering-isles.json.`);
  process.exit(1);
}

const COLS = map.grid.cols;
const ROWS = map.grid.rows;
const CELLS = COLS * ROWS;

/* ------------------------------------------------------------------- random */
/* Seeded on purpose: same seed, same board, every run. A generated plate is a
   committed build output, so --check has to mean something. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(form.seed ?? 1);

/* --------------------------------------------------------------------- grid */
const inGrid = (c, r) => c >= 0 && r >= 0 && c < COLS && r < ROWS;
const ring = (c, r) => neighbours(c, r).filter((n) => inGrid(n.col, n.row));
const key = (c, r) => `${c},${r}`;

/* ------------------------------------------------------- 1 · grow the islands */

/* The land total the terrain budget already asks for. Island shares are weights
   normalised onto it, so adding an island shrinks the others rather than
   silently making the board more land. */
const budget = new Map(map.commission.terrainBudget.map((b) => [b.terrain, b.share]));
const landShare = [...budget].filter(([id]) => !isWaterId(id)).reduce((n, [, s]) => n + s, 0);
const landTarget = Math.round(landShare * CELLS);

const islands = form.islands;
const weightTotal = islands.reduce((n, i) => n + i.share, 0);
const owner = new Map();          // "c,r" -> island id
const landOf = new Map(islands.map((i) => [i.id, []]));

/* Every anchor is claimed before anything grows. An anchor is the one positional
   decision a person made, so no island is allowed to sit on another's. */
for (const island of islands) {
  const [c, r] = island.at;
  if (!inGrid(c, r)) { console.warn(`draw-map: ${island.id} is anchored at ${c},${r}, off a ${COLS} x ${ROWS} grid`); continue; }
  if (owner.has(key(c, r))) { console.warn(`draw-map: ${island.id} and ${owner.get(key(c, r))} share an anchor`); continue; }
  owner.set(key(c, r), island.id);
  landOf.get(island.id).push({ col: c, row: r });
}

/* Then ROUND-ROBIN, one hex each per turn, rather than growing each island to
   its target in turn. Growing them one at a time means whoever goes first takes
   the room and the last island finds its anchor already surrounded - which is
   exactly what happened, and it starved two of them to nothing. Taking turns
   makes them compete for the same water on equal terms, and an island that
   genuinely cannot fit is then a real finding rather than an ordering artefact. */
const growth = new Map(islands.map((i) => {
  const [ac, ar] = i.at;
  return [i.id, {
    island: i,
    target: Math.max(1, Math.round((i.share / weightTotal) * landTarget)),
    frontier: ring(ac, ar).filter((n) => !owner.has(key(n.col, n.row))),
    seen: new Set([key(ac, ar)]),
    done: false,
  }];
}));

for (let turn = 0; turn < landTarget * 2; turn++) {
  let moved = false;
  for (const g of growth.values()) {
    if (g.done) continue;
    const mine = landOf.get(g.island.id);
    if (mine.length >= g.target) { g.done = true; continue; }
    const [ac, ar] = g.island.at;

    let placed = false;
    while (g.frontier.length && !placed) {
      /* Nearer the anchor wins, but not always - a perfectly greedy fill is a
         circle, and an island that is a circle reads as a token, not a country. */
      let bestAt = 0, bestScore = -Infinity;
      for (let i = 0; i < g.frontier.length; i++) {
        const f = g.frontier[i];
        const score = -distance({ col: ac, row: ar }, f) + rand() * 2.6;
        if (score > bestScore) { bestScore = score; bestAt = i; }
      }
      const hex = g.frontier.splice(bestAt, 1)[0];
      const k = key(hex.col, hex.row);
      if (owner.has(k)) continue;

      /* Islands may not touch: the commission asks for chains that are separate,
         and two islands sharing an edge are one island with a story about it. */
      if (ring(hex.col, hex.row).some((n) => { const o = owner.get(key(n.col, n.row)); return o && o !== g.island.id; })) continue;

      owner.set(k, g.island.id);
      mine.push(hex);
      placed = true;
      for (const n of ring(hex.col, hex.row)) {
        const nk = key(n.col, n.row);
        if (!g.seen.has(nk) && !owner.has(nk)) { g.seen.add(nk); g.frontier.push(n); }
      }
    }
    if (placed) moved = true; else g.done = true;
  }
  if (!moved) break;
}

for (const g of growth.values()) {
  const got = landOf.get(g.island.id).length;
  if (got < g.target) {
    console.warn(`draw-map: ${g.island.id} reached ${got} of ${g.target} hexes — it ran out of open water. Move its anchor, lower its share, or accept a smaller island.`);
  }
}

const isLand = (c, r) => owner.has(key(c, r));

/* ---------------------------------------------------- 2 · the reef, the shelf */

/* A link is a reef: water a hull crosses and a keel does not ignore. Walked as a
   straight line between two anchors and laid down as shallows. */
const reef = new Set();
for (const link of form.links ?? []) {
  const a = islands.find((i) => i.id === link.from);
  const b = islands.find((i) => i.id === link.to);
  if (!a || !b) { console.warn(`draw-map: link ${link.from} -> ${link.to} names an island that does not exist`); continue; }
  const steps = Math.max(Math.abs(b.at[0] - a.at[0]), Math.abs(b.at[1] - a.at[1])) * 2;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const c = Math.round(a.at[0] + (b.at[0] - a.at[0]) * t);
    const r = Math.round(a.at[1] + (b.at[1] - a.at[1]) * t);
    if (inGrid(c, r) && !isLand(c, r)) reef.add(key(c, r));
  }
}

/* Distance from every water hex to the nearest land, by flood fill from the
   coast. This is what keeps deep water off a beach by construction rather than
   by a validator catching it afterwards. */
const toLand = new Map();
let wave = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  if (!isLand(c, r) && ring(c, r).some((n) => isLand(n.col, n.row))) { toLand.set(key(c, r), 1); wave.push({ col: c, row: r }); }
}
for (let d = 2; wave.length; d++) {
  const next = [];
  for (const h of wave) for (const n of ring(h.col, h.row)) {
    const k = key(n.col, n.row);
    if (!isLand(n.col, n.row) && !toLand.has(k)) { toLand.set(k, d); next.push(n); }
  }
  wave = next;
}

const shelfWidth = form.shelfWidth ?? 2;
const edges = form.edges ?? {};
const onShelfEdge = (c, r) =>
  (edges.north === 'shelf' && r < shelfWidth) || (edges.south === 'shelf' && r >= ROWS - shelfWidth) ||
  (edges.west === 'shelf' && c < shelfWidth) || (edges.east === 'shelf' && c >= COLS - shelfWidth);

/* --------------------------------------------------- 3 · terrain on the land */

/* How far inland each land hex is. Mountains want the middle of an island and
   marsh wants its edge, and this is the one number that says which is which. */
const inland = new Map();
wave = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  if (isLand(c, r) && (ring(c, r).some((n) => !isLand(n.col, n.row)) || ring(c, r).length < 6)) { inland.set(key(c, r), 1); wave.push({ col: c, row: r }); }
}
for (let d = 2; wave.length; d++) {
  const next = [];
  for (const h of wave) for (const n of ring(h.col, h.row)) {
    const k = key(n.col, n.row);
    if (isLand(n.col, n.row) && !inland.has(k)) { inland.set(k, d); next.push(n); }
  }
  wave = next;
}

const allLand = [...owner.keys()].map((k) => { const [c, r] = k.split(',').map(Number); return { col: c, row: r, k }; });

/* Most inland first, so the bands below fall in the right order. The jitter
   stops a band boundary from being a visible contour ring. */
allLand.sort((a, b) => (inland.get(b.k) ?? 0) - (inland.get(a.k) ?? 0) || (rand() - 0.5));

/* The order a land terrain wants to sit in, from the middle of an island out.
   Marsh last because a fen is a coastal thing on a warm sea. */
const BANDS = ['mountain', 'hills', 'forest', 'grassland', 'desert', 'marsh'];
const wanted = BANDS.filter((id) => (budget.get(id) ?? 0) > 0);
const landBudgetTotal = wanted.reduce((n, id) => n + budget.get(id), 0);

const terrain = new Map();
const volcanic = new Set(islands.filter((i) => i.relief === 'volcanic').map((i) => i.id));
let cursor = 0;
for (const [i, id] of wanted.entries()) {
  let n = i === wanted.length - 1 ? allLand.length - cursor : Math.round((budget.get(id) / landBudgetTotal) * allLand.length);
  while (n-- > 0 && cursor < allLand.length) {
    const hex = allLand[cursor++];
    /* The commission asks for ONE mountain worth the name, on the volcanic
       island. Mountain anywhere else becomes the hills it should have been. */
    const put = id === 'mountain' && volcanic.size && !volcanic.has(owner.get(hex.k)) ? 'hills' : id;
    terrain.set(hex.k, put);
  }
}

/* The crater lake: the most inland hex of the volcanic island, and the board's
   only fresh water. The budget asks for more lake than that; the commission's
   mustHave is the more specific instruction and wins, and the difference is
   reported below rather than silently taken. */
let craterAt = null;
for (const island of islands.filter((i) => i.relief === 'volcanic')) {
  const hexes = landOf.get(island.id) ?? [];
  const peak = hexes.map((h) => ({ ...h, k: key(h.col, h.row) }))
    .sort((a, b) => (inland.get(b.k) ?? 0) - (inland.get(a.k) ?? 0))[0];
  if (peak && (inland.get(peak.k) ?? 0) > 1) { terrain.set(peak.k, 'lake'); craterAt = peak; }
}

/* ---------------------------------------------------------- 4 · the sea, laid */
const board = [];
for (let r = 0; r < ROWS; r++) {
  const line = [];
  for (let c = 0; c < COLS; c++) {
    const k = key(c, r);
    if (terrain.has(k)) { line.push(charFor[terrain.get(k)]); continue; }
    const d = toLand.get(k) ?? Infinity;
    const shallow = d <= shelfWidth || reef.has(k) || onShelfEdge(c, r);
    line.push(charFor[shallow ? 'shallow-water' : 'deep-water']);
  }
  board.push(line.join(''));
}
const idAt = (c, r) => (inGrid(c, r) ? map.legend[board[r][c]] : null);

/* -------------------------------------------------------- 5 · site the places */

const SEA = new Set(terrainFile.siting.waterside.kinds.sea);
const seaside = (c, r) => ring(c, r).some((n) => SEA.has(idAt(n.col, n.row)));
const habitable = (c, r) => { const t = terrainById.get(idAt(c, r)); return t && t.family === 'land' && t.housingAllowed !== false; };

const settlements = [];
const taken = new Set();
for (const place of map.commission.places ?? []) {
  const pool = (landOf.get(place.island) ?? [])
    .filter((h) => habitable(h.col, h.row) && !taken.has(key(h.col, h.row)))
    .filter((h) => (place.harbour ? seaside(h.col, h.row) : true));
  if (!pool.length) { console.warn(`draw-map: nowhere to put ${place.name} on ${place.island}`); continue; }

  /* Spread them out: the best hex is the one furthest from everything already
     placed, so two villages do not end up sharing a beach. An inland place
     additionally wants to be inland, which on most of these islands is asking
     a lot and is why it is a preference and not a filter. */
  let best = pool[0], bestScore = -Infinity;
  for (const h of pool) {
    const near = settlements.length ? Math.min(...settlements.map((s) => distance({ col: s.col, row: s.row }, h))) : 99;
    const score = near + (place.harbour ? 0 : (inland.get(key(h.col, h.row)) ?? 1) * 2) + rand() * 0.4;
    if (score > bestScore) { bestScore = score; best = h; }
  }
  taken.add(key(best.col, best.row));
  settlements.push({
    id: place.id, name: place.name, col: best.col, row: best.row,
    rank: place.rank, ...(place.harbour ? { harbour: true } : {}), ...(place.note ? { note: place.note } : {}),
  });
}

/* ------------------------------------------------------------- 6 · the routes */

/* A shipping lane is the shortest walk over water between two harbours. Deep or
   shallow both float a hull; the validator only insists it never crosses land. */
function seaPath(from, to) {
  const start = key(from.col, from.row), goal = key(to.col, to.row);
  const prev = new Map([[start, null]]);
  let q = [{ col: from.col, row: from.row }];
  while (q.length) {
    const next = [];
    for (const h of q) {
      for (const n of ring(h.col, h.row)) {
        const k = key(n.col, n.row);
        if (prev.has(k)) continue;
        const water = !isLand(n.col, n.row);
        if (!water && k !== goal) continue;
        prev.set(k, key(h.col, h.row));
        if (k === goal) { q = []; next.length = 0; break; }
        next.push(n);
      }
      if (!q.length) break;
    }
    if (!next.length) break;
    q = next;
  }
  if (!prev.has(goal)) return null;
  const out = [];
  for (let k = goal; k; k = prev.get(k)) out.unshift(k.split(',').map(Number));
  return out;
}

const routes = { $comment: 'Generated by tools/draw-map.mjs from the settlements and the water between them. A lane is the shortest walk a hull can make; a road only exists where two settlements share an island.' };

if (map.commission.routes?.shipping) {
  const harbours = settlements.filter((s) => s.harbour);
  const lanes = [];
  for (let i = 0; i < harbours.length - 1; i++) {
    const a = harbours[i], b = harbours[i + 1];
    /* The lane leaves from the water beside the harbour, not from the town. */
    const off = (s) => ring(s.col, s.row).find((n) => !isLand(n.col, n.row));
    const fa = off(a), fb = off(b);
    if (!fa || !fb) continue;
    const hexes = seaPath(fa, fb);
    if (!hexes || hexes.length < 2) continue;
    lanes.push({ id: `${a.id}-${b.id}`, name: `${a.name} to ${b.name}`, hexes });
  }
  routes.shipping = lanes;
}

if (map.commission.routes?.road) {
  const byIsland = new Map();
  for (const place of map.commission.places ?? []) {
    if (!settlements.some((s) => s.id === place.id)) continue;
    if (!byIsland.has(place.island)) byIsland.set(place.island, []);
    byIsland.get(place.island).push(place.id);
  }
  const links = [];
  for (const ids of byIsland.values()) for (let i = 0; i < ids.length - 1; i++) links.push({ from: ids[i], to: ids[i + 1] });
  routes.road = links;
}

if (map.commission.routes?.rail) routes.rail = [];

/* ------------------------------------------------------------ 7 · the regions */
const regions = islands.map((island) => {
  const hexes = landOf.get(island.id) ?? [];
  const tally = {};
  for (const h of hexes) { const t = terrain.get(key(h.col, h.row)); if (t) tally[t] = (tally[t] ?? 0) + 1; }
  const dominant = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'grassland';
  const here = settlements.filter((s) => (map.commission.places.find((p) => p.id === s.id)?.island) === island.id);
  return {
    id: island.id,
    name: island.name ?? island.id,
    terrain: dominant,
    labelAt: island.at,
    summary: `${hexes.length} hexes of the ${island.chain ?? ''} chain, mostly ${dominant.replace('-', ' ')}` +
      (here.length ? `. ${here.map((s) => s.name).join(', ')}.` : '. Nobody lives here.'),
  };
});

/* ------------------------------------------------------------- 8 · the plate */

/* A generated plate's geometry is CHOSEN, not measured. That is the whole saving
   over a drawn one: there is no inner frame rule to find with a ruler, so
   plate.field is exact and the overlay cannot drift off the coastline. */
const FRAME = 34;
const plateWidth = 4000;
const acrossFlats = (plateWidth - 2 * FRAME) / COLS;
const grid = layout({ cols: COLS, rows: ROWS, acrossFlats, originX: FRAME, originY: FRAME });
const fieldH = Math.round(grid.extentY);
const plateHeight = fieldH + 2 * FRAME;

const plate = {
  kind: 'generated',
  $kindNote: 'Drawn by tools/draw-map.mjs from rows, not painted and traced. It is a build output: never hand-edited, regenerated by its tool, and safe to delete. A "drawn" plate is the opposite and the rules in docs/map/README.md are for that one.',
  file: `${mapId}.svg`,
  width: plateWidth,
  height: plateHeight,
  field: { x: FRAME, y: FRAME, width: plateWidth - 2 * FRAME, height: fieldH },
  $fieldNote: 'Exact, because the tool chose it. On a drawn plate this is measured off the inner frame rule by eye and is the fiddliest step in the whole line.',
};

/* --------------------------------------------------------------- 9 · draw it */
const wash = (id) => palette.terrain[id]?.wash ?? palette.paper.tallow.hex;
const SOOT = palette.ink.soot.hex;
/* palette.ink.tints holds an OBJECT per tint, not a hex - reading it as a colour
   writes stroke="[object Object]", which SVG treats as no stroke at all and
   drops the line silently. It cost nine shipping lanes that were in the file,
   with correct coordinates, and rendered as nothing. */
const TINT = Object.fromEntries(Object.entries(palette.ink.tints).map(([k, v]) => [k, v.hex ?? v]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n2 = (v) => Number(v.toFixed(2));
/* Each wash cell is grown by a hair about its own centre so that neighbours
   OVERLAP instead of butting up. Two polygons sharing an edge antialias against
   each other and leave a pale seam down it - and a seam on every edge is a hex
   grid, printed into the artwork, which is the one thing docs/map/README.md says
   a plate must never carry. The grid is an overlay drawn at read time. */
const BLEED = 1.008;
const poly = (c, r) => {
  const { x: cx, y: cy } = grid.centre(c, r);
  return grid.corners(c, r)
    .map(([x, y]) => `${n2(cx + (x - cx) * BLEED)},${n2(cy + (y - cy) * BLEED)}`)
    .join(' ');
};

const washCells = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  washCells.push(`<polygon points="${poly(c, r)}" fill="${wash(idAt(c, r))}"/>`);
}

/* The coastline is the only line the ink plate draws over the field: it is the
   one edge a player has to read at a glance, and it is an edge between hexes
   rather than a hex of its own. */
/* hexgrid's DIRECTIONS run in AXIAL order - E, NE, NW, W, SW, SE - and corners()
   walks clockwise from the top vertex, so edge i is not direction i. Getting
   this wrong does not draw the wrong NUMBER of edges, which is why it looks
   plausible: it draws the right count in the wrong places, and scatters hex
   outlines across the middle of an island. */
const EDGE_FOR_DIRECTION = [1, 0, 5, 4, 3, 2];

const coast = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  if (!isLand(c, r)) continue;
  const cs = grid.corners(c, r);
  for (const [i, n] of neighbours(c, r).entries()) {
    if (inGrid(n.col, n.row) && isLand(n.col, n.row)) continue;
    const e = EDGE_FOR_DIRECTION[i];
    const a = cs[e], b = cs[(e + 1) % 6];
    coast.push(`M${n2(a[0])} ${n2(a[1])}L${n2(b[0])} ${n2(b[1])}`);
  }
}

const RANK = { seat: 26, city: 21, town: 16, village: 12 };
const LABEL = acrossFlats * 0.29;

/* A name is no use printed off the paper. The anchor slides to the nearest end
   when a label would cross the frame, and the label drops under its own mark on
   the top row rather than sitting above the field. */
function place(x, y, name, rad) {
  const half = name.length * LABEL * 0.27;
  const left = FRAME + 8, right = FRAME + plate.field.width - 8;
  let anchor = 'middle', tx = x;
  if (x - half < left) { anchor = 'start'; tx = Math.max(left, x - rad); }
  else if (x + half > right) { anchor = 'end'; tx = Math.min(right, x + rad); }
  const above = y - rad - LABEL * 0.45;
  const ty = above < FRAME + LABEL ? y + rad + LABEL : above;
  return { tx, ty, anchor };
}

const marks = settlements.map((s) => {
  const { x, y } = grid.centre(s.col, s.row);
  const rad = (RANK[s.rank] ?? 12) * (acrossFlats / 131);
  const shape = s.rank === 'seat' || s.rank === 'city'
    ? `<rect x="${n2(x - rad)}" y="${n2(y - rad)}" width="${n2(rad * 2)}" height="${n2(rad * 2)}" fill="${SOOT}"/>`
    : `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(rad)}" fill="${s.rank === 'town' ? SOOT : palette.paper.tallow.hex}" stroke="${SOOT}" stroke-width="${n2(rad * 0.35)}"/>`;
  const { tx, ty, anchor } = place(x, y, s.name, rad);
  return `${shape}<text x="${n2(tx)}" y="${n2(ty)}" font-size="${n2(LABEL)}" text-anchor="${anchor}" fill="${SOOT}">${esc(s.name)}</text>`;
}).join('\n    ');

/* Nine lanes thread the same few channels between the islands, so most of the
   water carries two or three of them on the same hexes. Drawn as nine separate
   dashed polylines their dashes interleave and fill each other's gaps, and a
   shared channel reads as one solid road across the sea. So the segments are
   deduplicated first and each stretch of water is drawn once, whether one hull
   uses it or six. */
const seen = new Set();
const segments = [];
for (const lane of routes.shipping ?? []) {
  for (let i = 1; i < lane.hexes.length; i++) {
    const a = lane.hexes[i - 1], b = lane.hexes[i];
    const k = [`${a}`, `${b}`].sort().join('|');
    if (seen.has(k)) continue;
    seen.add(k);
    segments.push([grid.centre(a[0], a[1]), grid.centre(b[0], b[1])]);
  }
}
const lanes = segments.map(([p, q]) =>
  `<line x1="${n2(p.x)}" y1="${n2(p.y)}" x2="${n2(q.x)}" y2="${n2(q.y)}"/>`
).join('\n      ');
const laneGroup = segments.length
  ? `<g fill="none" stroke="${TINT[85]}" stroke-width="${n2(acrossFlats * 0.075)}" stroke-dasharray="${n2(acrossFlats * 0.26)} ${n2(acrossFlats * 0.2)}" stroke-linecap="round">
      ${lanes}
    </g>`
  : '';

/* A road is stored as a link between two settlements and nothing else - that is
   the contract validate-map.mjs checks, and it is right, because which hexes a
   road runs through is a drawing decision and not a rule. So the path is worked
   out here, over land, at drawing time. Joining the two with a straight line
   instead sends every road across whatever bay happens to be in the way. */
function landPath(from, to) {
  const goal = key(to.col, to.row);
  const prev = new Map([[key(from.col, from.row), null]]);
  let q = [from];
  while (q.length) {
    const next = [];
    for (const h of q) for (const n of ring(h.col, h.row)) {
      const k = key(n.col, n.row);
      if (prev.has(k) || !isLand(n.col, n.row)) continue;
      prev.set(k, key(h.col, h.row));
      if (k === goal) { q = []; next.length = 0; break; }
      next.push(n);
    }
    if (!next.length) break;
    q = next;
  }
  if (!prev.has(goal)) return null;
  const out = [];
  for (let k = goal; k; k = prev.get(k)) out.unshift(k.split(',').map(Number));
  return out;
}

const roads = (routes.road ?? []).map((l) => {
  const a = settlements.find((s) => s.id === l.from), b = settlements.find((s) => s.id === l.to);
  if (!a || !b) return '';
  const path = landPath(a, b);
  if (!path) return '';
  const pts = path.map(([c, r]) => { const p = grid.centre(c, r); return `${n2(p.x)},${n2(p.y)}`; }).join(' ');
  return `<polyline points="${pts}" fill="none" stroke="${SOOT}" stroke-width="${n2(acrossFlats * 0.04)}" stroke-linejoin="round" stroke-linecap="round"/>`;
}).join('\n    ');

const regionLabels = regions.map((g) => {
  const { x, y } = grid.centre(g.labelAt[0], g.labelAt[1]);
  return `<text x="${n2(x)}" y="${n2(y)}" font-size="${n2(acrossFlats * 0.42)}" text-anchor="middle" fill="${TINT[70]}" letter-spacing="${n2(acrossFlats * 0.06)}">${esc(g.name.toUpperCase())}</text>`;
}).join('\n    ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${plateWidth} ${plateHeight}" width="${plateWidth}" height="${plateHeight}" font-family="Georgia, 'Iowan Old Style', 'Times New Roman', serif">
<title>${esc(map.name)}</title>
<desc>${esc(map.subtitle ?? '')} — generated by tools/draw-map.mjs from data/maps/${mapId}.json. A flat terrain colour per hex, a coastline, the settlements and the lanes between them. No hex grid: that is an overlay drawn at read time from the same rows, so it cannot disagree with this.</desc>
<g id="wash">
    <rect width="${plateWidth}" height="${plateHeight}" fill="${palette.paper.tallow.hex}"/>
    ${washCells.join('\n    ')}
</g>
<g id="ink">
    <path d="${coast.join('')}" fill="none" stroke="${SOOT}" stroke-width="${n2(acrossFlats * 0.045)}" stroke-linecap="round"/>
    ${regionLabels}
    ${laneGroup}
    ${roads}
    ${marks}
    <rect x="${FRAME / 2}" y="${FRAME / 2}" width="${plateWidth - FRAME}" height="${plateHeight - FRAME}" fill="none" stroke="${SOOT}" stroke-width="6"/>
    <rect x="${FRAME - 6}" y="${FRAME - 6}" width="${plateWidth - 2 * FRAME + 12}" height="${plateHeight - 2 * FRAME + 12}" fill="none" stroke="${SOOT}" stroke-width="2"/>
</g>
<g id="grime">
    <rect width="${plateWidth}" height="${plateHeight}" fill="${palette.paper.foxing.hex}" opacity="0.05"/>
</g>
</svg>
`;

/* ------------------------------------------------------------- 10 · write out */
const svgPath = join(ROOT, 'docs', 'map', `${mapId}.svg`);

const next = { ...map };
delete next.plate; delete next.rows; delete next.regions; delete next.settlements; delete next.routes;
const rebuilt = {};
for (const k of Object.keys(map)) {
  if (k === 'commission') { rebuilt[k] = map[k]; rebuilt.plate = plate; continue; }
  if (k === 'plate') continue;
  if (k === 'rows') { rebuilt.rows = board; rebuilt.$rowsNote = 'GENERATED by tools/draw-map.mjs from commission.landform. Do not hand-edit: run the tool. On a drawn map this block is traced off the artwork instead, and hand-correcting it is expected.'; continue; }
  if (k === '$rowsNote') continue;
  if (k === 'regions' || k === 'settlements' || k === 'routes') continue;
  rebuilt[k] = map[k];
}
if (!rebuilt.plate) rebuilt.plate = plate;
if (!rebuilt.rows) { rebuilt.rows = board; }
rebuilt.regions = regions;
rebuilt.settlements = settlements;
rebuilt.routes = routes;

const nextJson = `${JSON.stringify(rebuilt, null, 2)}\n`;

/* ---------------------------------------------------------------- report it */
const tally = {};
for (const line of board) for (const ch of line) { const id = map.legend[ch]; tally[id] = (tally[id] ?? 0) + 1; }
const landHexes = Object.entries(tally).filter(([id]) => !isWaterId(id)).reduce((n, [, v]) => n + v, 0);

if (flag('rows')) {
  for (const line of board) console.log(line);
  process.exit(0);
}

if (flag('check')) {
  const staleJson = readFileSync(mapPath, 'utf8') !== nextJson;
  const staleSvg = !existsSync(svgPath) || readFileSync(svgPath, 'utf8') !== svg;
  if (staleJson || staleSvg) {
    console.error(`draw-map: ${mapId} is stale — run node tools/draw-map.mjs ${mapId}` +
      ` (${[staleJson && 'the board', staleSvg && 'the plate'].filter(Boolean).join(' and ')})`);
    process.exit(1);
  }
  console.log(`${mapId} is up to date (${landHexes} land, ${CELLS - landHexes} water)`);
  process.exit(0);
}

writeFileSync(mapPath, nextJson);
writeFileSync(svgPath, svg);

console.log(`${map.name} — grown and drawn`);
console.log(`  data/maps/${mapId}.json   ${COLS} x ${ROWS} = ${CELLS} hexes, ${landHexes} land, ${CELLS - landHexes} water`);
console.log(`  docs/map/${mapId}.svg     ${plateWidth} x ${plateHeight}, vector — no long side to fall short of`);
console.log(`  ${settlements.length} settlements, ${(routes.shipping ?? []).length} lanes, ${(routes.road ?? []).length} roads, ${regions.length} regions`);
if (craterAt) console.log(`  crater lake at ${hexId(craterAt.col, craterAt.row)}`);

/* Budget against outcome, because the budget is a wish and the grid is integers. */
const drift = map.commission.terrainBudget
  .map((b) => ({ id: b.terrain, want: Math.round(b.share * CELLS), got: tally[b.terrain] ?? 0 }))
  .filter((d) => Math.abs(d.got - d.want) > Math.max(4, d.want * 0.25));
if (drift.length) {
  console.log('  budget drift:');
  for (const d of drift) console.log(`    ${d.id.padEnd(15)} asked ${String(d.want).padStart(4)}, got ${String(d.got).padStart(4)}`);
  console.log('    A share is a wish and a grid is integers, so some drift is arithmetic. Two here are not:');
  console.log('    lake     — the commission asks for ONE crater and the budget asks for more. mustHave is the');
  console.log('               more specific instruction, so it wins and the rest goes back to the land.');
  console.log('    mountain — restricted to islands with relief: volcanic, because the commission asks for one');
  console.log('               mountain worth the name. The overflow is drawn as the hills it should have been.');
  console.log('    Anything else on this list is the generator missing, and the budget is what to trust.');
}
