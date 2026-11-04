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
import {
  n2, esc, makePen, curve, smooth, wobble, offsetPath, dashify, polyPath,
  TERRAIN_TEXTURE, compassRose, plankFrame, scatterInHex,
} from './lib/cartography.mjs';

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
const components = readJson(join(ROOT, 'data', 'components.json'));

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

/* ------------------------------------------------------ 3b · the watercourses */

/* A shuffled tile bag gives you a river hex with no river either side of it. The
   fix is not to place rivers, it is to RUN water downhill and see where it goes.
   This is the smallest honest version of that: no second elevation field, no
   second set of numbers to keep in step with the board - the height a drop falls
   down is read off what the board already says, which is the terrain band and how
   far inland the hex is.
   
   A course therefore cannot start in the middle of a plain and cannot stop
   halfway. It begins on the highest ground an island has, it only ever steps to
   lower ground or - out of a basin - to ground nearer the water, and it ends when
   it reaches water or joins a course already running. */

const RIVER_HEIGHT = { mountain: 1, hills: 0.72, forest: 0.46, grassland: 0.4, desert: 0.38, tundra: 0.44, marsh: 0.16 };
const heightAt = (k) => (RIVER_HEIGHT[terrain.get(k)] ?? 0.3) + (inland.get(k) ?? 0) * 0.02;

/* Steps to the nearest water, so a course trapped in a basin still knows which
   way is downhill in the only sense that matters. */
const toWater = new Map();
wave = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  if (!isLand(c, r)) { toWater.set(key(c, r), 0); wave.push({ col: c, row: r }); }
}
for (let d = 1; wave.length; d++) {
  const next = [];
  for (const h of wave) for (const n of ring(h.col, h.row)) {
    const k = key(n.col, n.row);
    if (!toWater.has(k)) { toWater.set(k, d); next.push(n); }
  }
  wave = next;
}

const riverBudget = Math.round((budget.get('river') ?? 0) * CELLS);
const riverNames = form.riverNames ?? map.commission?.places?.rivers ?? [];
const riverHexes = new Set();
const courses = [];
const riverReject = { tried: 0, tooShort: 0 };

if (riverBudget > 0) {
  /* Springs: the highest ground, one island at a time, spaced so two courses do
     not set off down the same valley. A source must be far enough inland to have
     somewhere to run - a spring one hex from the shore is a puddle. */
  const springs = allLand
    .filter((h) => (inland.get(h.k) ?? 0) >= 2 && (RIVER_HEIGHT[terrain.get(h.k)] ?? 0) >= 0.44)
    .sort((a, b) => heightAt(b.k) - heightAt(a.k) || (rand() - 0.5));

  /* Spacing is a want, not a rule. Two springs in the same corrie make one river
     drawn twice, so they are kept apart while there is still high ground to be
     had - and the rule is relaxed rather than abandoned once the budget would
     otherwise go unspent. */
  const taken = [];
  for (const pass of [3, 2]) {
    for (const spring of springs) {
    if (riverHexes.size >= riverBudget) break;
    if (taken.includes(spring)) continue;
    if (taken.some((t) => distance(t, spring) < pass)) continue;

    /* Walk down. Lowest neighbour wins; a basin is left by whichever neighbour is
       nearest the water, which is what makes arrival certain. */
    const run = [];
    let at = spring;
    const visited = new Set([spring.k]);
    for (let guard = 0; guard < COLS * ROWS; guard++) {
      const here = key(at.col, at.row);
      const options = ring(at.col, at.row).filter((n) => !visited.has(key(n.col, n.row)));
      if (!options.length) break;
      const wet = options.find((n) => !isLand(n.col, n.row) || riverHexes.has(key(n.col, n.row)));
      if (wet) { run.push([wet.col, wet.row]); break; }
      options.sort((a, b) => {
        const ka = key(a.col, a.row), kb = key(b.col, b.row);
        return (heightAt(ka) - heightAt(kb)) || ((toWater.get(ka) ?? 99) - (toWater.get(kb) ?? 99));
      });
      const down = options[0];
      const dk = key(down.col, down.row);
      if (heightAt(dk) >= heightAt(here) && (toWater.get(dk) ?? 99) >= (toWater.get(here) ?? 99)) break;
      visited.add(dk);
      run.push([down.col, down.row]);
      at = down;
    }

    /* The last entry is the water it arrived at, and is not part of the course.
       A run of one or two hexes is a stream nobody would print. */
    const mouth = run[run.length - 1];
    const body = run.filter(([c, r]) => isLand(c, r) && !riverHexes.has(key(c, r)));
    riverReject.tried++;
    if (body.length < 3) { riverReject.tooShort++; continue; }

    taken.push(spring);
    for (const [c, r] of body) { riverHexes.add(key(c, r)); terrain.set(key(c, r), 'river'); }
    courses.push({
      id: `river-${courses.length + 1}`,
      name: riverNames[courses.length] ?? null,
      from: hexId(spring.col, spring.row),
      to: hexId(mouth[0], mouth[1]),
      hexes: body,
    });
    }
    if (riverHexes.size >= riverBudget) break;
  }
}

/* Named first, longest first: a name is a scarce thing a person wrote down, and
   it belongs on the course a player will actually trace with a finger. */
courses.sort((a, b) => b.hexes.length - a.hexes.length);
courses.forEach((c, i) => { c.id = `river-${i + 1}`; c.name = riverNames[i] ?? null; });

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

/* How many hexes of each terrain the board actually came out with. The budget is
   a wish and a grid is integers, so this is the number that gets printed in the
   key and reported against the commission. */
const tally = {};
for (const line of board) for (const ch of line) { const id = map.legend[ch]; tally[id] = (tally[id] ?? 0) + 1; }
const tallyOf = (id) => tally[id] ?? 0;

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
/* The frame is a fraction of a hex rather than a fixed number of pixels, so a
   board with 30 columns and a board with 50 get a border in the same proportion
   to the ground inside it. Solved rather than guessed: pick the hex size that
   leaves room for two bands of it, and the band follows. */
const plateWidth = 4000;
const BAND = components.mapPlate.frame.bandFraction;
const acrossFlats = plateWidth / (COLS + 2 * BAND);
const FRAME = Math.round(acrossFlats * BAND);
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
const STYLE = components.mapPlate;
const FONT = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
/* A name set straight onto drawn ground is a name nobody can read. Knocking a
   little paper out behind it is what docs/art/02-palette.md permits for display
   type, and it is the difference between a label and a smudge. */
const HALO = `stroke="${palette.paper.tallow.hex}" stroke-width="${n2(acrossFlats * 0.028)}" stroke-linejoin="round" paint-order="stroke"`;


/* Each wash cell is grown by a hair about its own centre so that neighbours
   OVERLAP instead of butting up. Two polygons sharing an edge antialias against
   each other and leave a pale seam down it - and a seam on every edge is a hex
   grid, printed into the artwork, which is the one thing docs/map/README.md says
   a plate must never carry. The grid it DOES carry is drawn deliberately, as a
   hairline, below. */
const BLEED = 1.008;
const hexPoints = (c, r, bleed = BLEED) => {
  const { x: cx, y: cy } = grid.centre(c, r);
  return grid.corners(c, r).map(([x, y]) => ({ x: cx + (x - cx) * bleed, y: cy + (y - cy) * bleed }));
};
const poly = (c, r) => hexPoints(c, r).map((p) => `${n2(p.x)},${n2(p.y)}`).join(' ');
const hexPath = (c, r) => `M${hexPoints(c, r, 1).map((p) => `${n2(p.x)},${n2(p.y)}`).join('L')}Z`;

const washCells = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  washCells.push(`<polygon points="${poly(c, r)}" fill="${wash(idAt(c, r))}"/>`);
}

/* ---- the shoreline, as rings rather than as loose edges --------------------
   hexgrid's DIRECTIONS run in AXIAL order - E, NE, NW, W, SW, SE - and corners()
   walks clockwise from the top vertex, so edge i is not direction i. Getting
   this wrong does not draw the wrong NUMBER of edges, which is why it looks
   plausible: it draws the right count in the wrong places, and scatters hex
   outlines across the middle of an island. */
const EDGE_FOR_DIRECTION = [1, 0, 5, 4, 3, 2];
const ptKey = (p) => `${Math.round(p.x * 100)},${Math.round(p.y * 100)}`;

/* Chain a set of boundary edges into rings. A coastline drawn as loose segments
   is a coastline and nothing more; chained, it can be walked outwards, and the
   wave lines beside it are the single biggest thing separating a map from a
   diagram. */
function chainEdges(edges) {
  const byPoint = new Map();
  for (const e of edges) for (const p of [e.a, e.b]) {
    const k = ptKey(p);
    if (!byPoint.has(k)) byPoint.set(k, []);
    byPoint.get(k).push(e);
  }
  const used = new Set();
  const chains = [];
  const walk = (start, from) => {
    const pts = [from];
    let e = start, at = from;
    while (e && !used.has(e.i)) {
      used.add(e.i);
      at = ptKey(e.a) === ptKey(at) ? e.b : e.a;
      pts.push(at);
      e = (byPoint.get(ptKey(at)) ?? []).find((x) => !used.has(x.i));
    }
    return pts;
  };
  for (const e of edges) {
    if (used.has(e.i)) continue;
    const forward = walk(e, e.a);
    const back = walk((byPoint.get(ptKey(e.a)) ?? []).find((x) => !used.has(x.i)), e.a);
    const pts = back.length > 1 ? [...back.slice(1).reverse(), ...forward] : forward;
    if (pts.length > 2) chains.push({ pts, seed: e });
  }
  return chains;
}

/** Boundary edges where `inside` holds on one side and not on the other. */
function boundaryOf(inside) {
  const edges = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (!inside(c, r)) continue;
    const cs = grid.corners(c, r);
    for (const [i, nb] of neighbours(c, r).entries()) {
      if (inGrid(nb.col, nb.row) && inside(nb.col, nb.row)) continue;
      const e = EDGE_FOR_DIRECTION[i];
      edges.push({
        i: edges.length,
        a: { x: cs[e][0], y: cs[e][1] },
        b: { x: cs[(e + 1) % 6][0], y: cs[(e + 1) % 6][1] },
        inX: grid.centre(c, r).x, inY: grid.centre(c, r).y,
      });
    }
  }
  return edges;
}

/** +1 or -1: which way offsetPath has to push to end up OUTSIDE `inside`. */
function outwardSign(chain) {
  const { pts, seed } = chain;
  const a = pts[0], b = pts[Math.min(3, pts.length - 1)];
  const dx = b.x - a.x, dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  return (seed.inX - mid.x) * (dy / L) + (seed.inY - mid.y) * (-dx / L) > 0 ? -1 : 1;
}

const coastInk = { heavy: [], waves: STYLE.coastWaves.offsets.map(() => []) };
const waveSeed = `${mapId}/coast`;

function shoreline(inside, offsets, into) {
  for (const chain of chainEdges(boundaryOf(inside))) {
    const closed = ptKey(chain.pts[0]) === ptKey(chain.pts[chain.pts.length - 1]);
    const line = smooth(chain.pts, 2, closed);
    coastInk.heavy.push(curve(line, { closed }));
    const sign = outwardSign(chain);
    offsets.forEach((off, i) => {
      const band = wobble(offsetPath(line, off * acrossFlats, sign, closed), acrossFlats * (0.004 + i * 0.002), waveSeed, `${chain.seed.i}:${i}`);
      const runs = i === 0 ? [band] : dashify(band, { on: acrossFlats * (0.9 - i * 0.18), off: acrossFlats * (0.05 + i * 0.04), seed: waveSeed, key: `${chain.seed.i}:${i}` });
      for (const run of runs) if (run.length > 3) into[i].push(curve(run, { closed: false }));
    });
  }
}

shoreline((c, r) => isLand(c, r), STYLE.coastWaves.offsets, coastInk.waves);
/* Fresh water gets its own, shorter, set: a lake is a shoreline too, and a
   crater with no edge on it reads as a hole in the island rather than water. */
const freshInk = { waves: STYLE.coastWaves.lakeOffsets.map(() => []) };
const freshHeavy = coastInk.heavy.length;
shoreline((c, r) => ['lake', 'river'].includes(idAt(c, r)), STYLE.coastWaves.lakeOffsets, freshInk.waves);

/* ---- ground texture ------------------------------------------------------- */
/* The local grain of the high ground, so a range reads as one piece of country.
   Neighbours on opposite sides must reinforce rather than cancel, which is why
   the angle is doubled before it is averaged and halved afterwards. */
function rangeAxis(c, r) {
  let ax = 0, ay = 0;
  const here = grid.centre(c, r);
  for (const nb of ring(c, r)) {
    if (!['mountain', 'hills'].includes(idAt(nb.col, nb.row))) continue;
    const p = grid.centre(nb.col, nb.row);
    const a = Math.atan2(p.y - here.y, p.x - here.x) * 2;
    ax += Math.cos(a); ay += Math.sin(a);
  }
  if (Math.hypot(ax, ay) < 1e-6) return { x: 1, y: 0 };
  const a = Math.atan2(ay, ax) / 2;
  return { x: Math.cos(a), y: Math.sin(a) };
}

const landPen = makePen(STYLE.line, acrossFlats);
const waterPen = makePen(STYLE.line, acrossFlats);
const landClip = [];
const waterClip = [];
const coldRow = ROWS * 0.22;

for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const id = idAt(c, r);
  const texture = TERRAIN_TEXTURE[id];
  const water = isWaterId(id);
  (water ? waterClip : landClip).push(hexPath(c, r));
  if (!texture) continue;
  const { x, y } = grid.centre(c, r);
  texture(water ? waterPen : landPen, {
    x, y, w: acrossFlats,
    rand: mulberry32((form.seed ?? 1) + c * 7919 + r * 104729),
    axis: rangeAxis(c, r),
    cold: r < coldRow || r > ROWS - coldRow,
    high: (inland.get(key(c, r)) ?? 0) >= 4,
  });
}

/* ---- the watercourses ----------------------------------------------------- */
const riverInk = [];
const riverWash = [];
const riverDefs = [];
const riverLabels = [];
for (const course of courses) {
  const pts = course.hexes.map(([c, r]) => grid.centre(c, r));
  const mouth = parseInt(course.to.slice(1, 3), 10);
  void mouth;
  const line = smooth(wobble(pts, acrossFlats * 0.05, `${mapId}/river`, course.id), 2, false);
  /* Three width bands along the run, so the course thickens towards its mouth.
     Drawn as separate strokes rather than one, because SVG has no tapering
     stroke and a river of constant width is a canal. */
  const bands = STYLE.river.widths;
  for (let b = 0; b < bands.length; b++) {
    const from = Math.floor((line.length - 1) * (b / bands.length));
    const to = Math.ceil((line.length - 1) * ((b + 1) / bands.length));
    const run = line.slice(from, to + 1);
    if (run.length < 2) continue;
    riverInk.push(`<path d="${curve(run)}" stroke-width="${n2(bands[b] * acrossFlats)}"/>`);
  }
  /* A river with no name is a blue shape. Set along the course itself rather
     than beside it, because that is the one label on a map whose placement is
     not a judgement call - the water says where it goes. */
  if (course.name) {
    const run = line[0].x > line[line.length - 1].x ? line.slice().reverse() : line;
    riverDefs.push(`<path id="rv-${course.id}" d="${curve(run)}" fill="none"/>`);
    riverLabels.push(`<text font-size="${n2(acrossFlats * 0.17)}" font-style="italic" fill="${TINT[70]}" ` +
      `letter-spacing="${n2(acrossFlats * 0.012)}" ${HALO} dy="${n2(-acrossFlats * 0.05)}">` +
      `<textPath href="#rv-${course.id}" startOffset="50%" text-anchor="middle">${esc(course.name)}</textPath></text>`);
  }

  /* The blue under it is a SHAPE, not a stroke: the wash plate is flat shapes
     and nothing else, per docs/art/01-two-plate-system.md. */
  const half = (STYLE.river.casing * acrossFlats) / 2;
  const ribbon = [...offsetPath(line, half, 1, false), ...offsetPath(line, half, -1, false).reverse()];
  riverWash.push(polyPath(ribbon, true));
}

/* ---- the play grid -------------------------------------------------------- */
/* Printed, but quietly. Players have to see where one hex stops; a tint this
   pale is gone at arm's length and unambiguous when you lean in. */
const gridPath = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) gridPath.push(hexPath(c, r));

const RANK = { seat: 26, city: 21, town: 16, village: 12 };
const LABEL = acrossFlats * 0.22;

/* ---- the cartouche, and the compass --------------------------------------- */
/* Both want open water, and both are placed by search rather than by a
   coordinate somebody typed: score every candidate rectangle by how much
   playable ground it would cover, and take the emptiest. Lapping the frame is
   allowed and is period-correct - a plate nailed to the border - and it costs
   the players no ground at all. */
/* Where every settlement's name WANTS to go, worked out before any furniture is
   placed. The two are mutually dependent - a name dodges the key, and the key
   should not have been put on the name in the first place - so the loop is cut
   here: names ask first, the key is placed around their answers, and then the
   names are placed for real and almost always keep what they asked for. */
const labelBoxes = settlements.map((st) => {
  const { x, y } = grid.centre(st.col, st.row);
  const rad = (RANK[st.rank] ?? 12) * (acrossFlats / 131);
  const half = st.name.length * LABEL * 0.3;
  const above = y - rad - LABEL * 0.45;
  const ty = above < FRAME + LABEL ? y + rad + LABEL : above;
  return { x: x - half, y: ty - LABEL, w: half * 2, h: LABEL * 1.4 };
});

function clearRect(w, h, taken) {
  const step = acrossFlats * 0.3;
  /* Kept a little off the paper's edge. Lapping the frame is wanted; hanging
     half off the plate is not, and off-grid samples score as free, so without
     this the corners always win. */
  const edge = FRAME * 1.15;
  let best = null;
  for (let y = edge; y + h < plateHeight - edge; y += step) {
    for (let x = edge; x + w < plateWidth - edge; x += step) {
      if (taken.some((t) => !(x + w < t.x || x > t.x + t.w || y + h < t.y || y > t.y + t.h))) continue;
      let free = 0, total = 0;
      for (let j = 0; j < 7; j++) for (let i = 0; i < 9; i++) {
        const hx = grid.at(x + (w * (i + 0.5)) / 9, y + (h * (j + 0.5)) / 7);
        total++;
        if (!hx) { free++; continue; }
        const id = idAt(hx.col, hx.row);
        if (id === 'deep-water' || id === 'shallow-water') free++;
        else free -= 1;   /* land is not free: a key over a hex is a hex nobody can use */
      }
      /* A name is set BESIDE its mark, so a panel that merely abuts a town still
         eats that town's name. The box, not the hex, is what has to be clear. */
      if (labelBoxes.some((b) => !(x + w < b.x || x > b.x + b.w || y + h < b.y || y > b.y + b.h))) continue;
      const score = free / total;
      if (!best || score > best.score) best = { x, y, w, h, score };
    }
  }
  return best;
}

const plateSpots = [];
const roseR = plateWidth * (STYLE.frame.compassRadius ?? 0.055);
const rosePlace = clearRect(roseR * 3, roseR * 3.2, plateSpots);
let roseInk = '';
if (rosePlace && rosePlace.score > 0.8) {
  plateSpots.push(rosePlace);
  roseInk = compassRose(rosePlace.x + rosePlace.w / 2, rosePlace.y + rosePlace.h / 2 + roseR * 0.18, roseR, STYLE.line, acrossFlats, SOOT, FONT);
}

const keyRows = terrainFile.terrains.filter((t) => (tallyOf(t.id) ?? 0) > 0);
const cartW = plateWidth * STYLE.cartouche.widthFraction;
const rowH = plateWidth * STYLE.cartouche.rowHeight;
const cartPad = plateWidth * STYLE.cartouche.borderFraction;
/* One type scale for the whole plate, set off the cartouche rather than off a
   hex, so the key reads the same on a ten-column board and a thirty-column one. */
const CT = cartW;
const cartH = cartPad * 2 + CT * 0.3 + Math.ceil(keyRows.length / 2) * rowH + CT * 0.1;
const cartPlace = clearRect(cartW, cartH, plateSpots);
let cartWash = '', cartInk = '';
if (cartPlace && cartPlace.score >= STYLE.cartouche.minWaterShare) {
  plateSpots.push(cartPlace);
  const { x, y } = cartPlace;
  const pen = makePen(STYLE.line, CT * 0.5);
  pen.coast(`M${n2(x)},${n2(y)}h${n2(cartW)}v${n2(cartH)}h${n2(-cartW)}Z`);
  pen.structure(`M${n2(x + cartPad)},${n2(y + cartPad)}h${n2(cartW - cartPad * 2)}v${n2(cartH - cartPad * 2)}h${n2(-cartW + cartPad * 2)}Z`);
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + cartW, y, -1, 1], [x, y + cartH, 1, -1], [x + cartW, y + cartH, -1, -1]]) {
    const arm = cartPad * 2.6, r = cartPad * 0.16;
    pen.structure(`M${n2(cx)},${n2(cy + sy * arm)}L${n2(cx + sx * cartPad)},${n2(cy + sy * arm)}L${n2(cx + sx * cartPad)},${n2(cy + sy * cartPad)}` +
                  `L${n2(cx + sx * arm)},${n2(cy + sy * cartPad)}L${n2(cx + sx * arm)},${n2(cy)}Z`);
    for (const [px, py] of [[0.5, 1.8], [1.8, 0.5], [0.5, 0.5]]) {
      pen.solid(`M${n2(cx + sx * cartPad * px - r)},${n2(cy + sy * cartPad * py - r)}h${n2(r * 2)}v${n2(r * 2)}h${n2(-r * 2)}Z`);
    }
  }

  const texts = [];
  const titleY = y + cartPad + CT * 0.13;
  /* Set to fit rather than set and hoped: a long map name at a fixed size runs
     off its own plate and over the ground beside it. */
  const titleSize = Math.min(CT * 0.135, (cartW - cartPad * 4) / (map.name.length * 0.52));
  texts.push(`<text x="${n2(x + cartW / 2)}" y="${n2(titleY)}" text-anchor="middle" font-size="${n2(titleSize)}" fill="${SOOT}" letter-spacing="${n2(CT * 0.005)}">${esc(map.name)}</text>`);
  const sub = map.subtitle ?? `${COLS} × ${ROWS} hexes · ${courses.length} watercourses`;
  const subSize = Math.min(CT * 0.048, (cartW - cartPad * 4) / (sub.length * 0.46));
  texts.push(`<text x="${n2(x + cartW / 2)}" y="${n2(titleY + CT * 0.072)}" text-anchor="middle" font-size="${n2(subSize)}" font-style="italic" fill="${TINT[70]}">${esc(sub)}</text>`);
  const ruleY = titleY + CT * 0.125;
  pen.detail(`M${n2(x + cartPad * 2)},${n2(ruleY)}h${n2(cartW - cartPad * 4)}` +
             `M${n2(x + cartW / 2 - CT * 0.017)},${n2(ruleY - CT * 0.017)}l${n2(CT * 0.017)},${n2(CT * 0.017)}l${n2(-CT * 0.017)},${n2(CT * 0.017)}l${n2(-CT * 0.017)},${n2(-CT * 0.017)}Z`);

  /* The key is drawn with the plate's own textures, at a fraction of the size,
     so it is a SAMPLE of the map rather than a table of swatches. */
  const rows = Math.ceil(keyRows.length / 2);
  const colW = (cartW - cartPad * 2) / 2;
  const swatch = CT * 0.048;
  keyRows.forEach((t, i) => {
    const cx = x + cartPad + Math.floor(i / rows) * colW + swatch * 1.1;
    const cy = ruleY + CT * 0.06 + (i % rows) * rowH + swatch;
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = ((60 * k - 90) * Math.PI) / 180;
      pts.push(`${n2(cx + (swatch / Math.sqrt(3)) * 2 * 0.5 * Math.cos(a))},${n2(cy + (swatch / Math.sqrt(3)) * 2 * 0.5 * Math.sin(a))}`);
    }
    cartWash += `<polygon points="${pts.join(' ')}" fill="${wash(t.id)}"/>`;
    const tp = makePen(STYLE.line, swatch * 2);
    TERRAIN_TEXTURE[t.id]?.(tp, {
      x: cx, y: cy, w: swatch * 2, rand: mulberry32(1337 + i),
      axis: { x: 1, y: 0 }, cold: false, high: false,
    });
    texts.push(`<g stroke="${SOOT}" stroke-linecap="round" stroke-linejoin="round" opacity="${STYLE.texture.strength}">${tp.render(SOOT)}</g>`);
    /* The name gets whatever is left after the swatch and the count column, and
       is set to fit it. "Shallow Water" against a four-figure tally is what
       decides this width, and it is the one pair that has to be measured. */
    const countX = x + cartPad + Math.floor(i / rows) * colW + colW - cartPad * 0.5;
    const room = colW - swatch * 1.6 - cartPad * 0.5 - CT * 0.1;
    const nameSize = Math.min(CT * 0.046, room / (t.name.length * 0.5));
    texts.push(`<text x="${n2(cx + swatch * 1.6)}" y="${n2(cy + swatch * 0.42)}" font-size="${n2(nameSize)}" fill="${TINT[85]}">${esc(t.name)}</text>`);
    texts.push(`<text x="${n2(countX)}" y="${n2(cy + swatch * 0.42)}" text-anchor="end" font-size="${n2(CT * 0.043)}" fill="${TINT[55]}">${tallyOf(t.id)}</text>`);
  });

  texts.push(`<text x="${n2(x + cartW / 2)}" y="${n2(y + cartH - cartPad * 1.3)}" text-anchor="middle" font-size="${n2(CT * 0.038)}" fill="${TINT[55]}" letter-spacing="${n2(CT * 0.005)}">one hex across the flats · ${COLS} × ${ROWS} · game1</text>`);

  cartWash = `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(cartW)}" height="${n2(cartH)}" fill="${palette.paper.tallow.hex}"/>` + cartWash;
  cartInk = `<g stroke="${SOOT}" stroke-linecap="round" stroke-linejoin="round">${pen.render(SOOT)}</g>${texts.join('')}`;
}


/* A name is no use printed off the paper. The anchor slides to the nearest end
   when a label would cross the frame, and the label drops under its own mark on
   the top row rather than sitting above the field. */
function place(x, y, name, rad) {
  const half = name.length * LABEL * 0.27;
  const left = FRAME + 8, right = FRAME + plate.field.width - 8;
  let anchor = 'middle', tx = x;
  if (x - half < left) { anchor = 'start'; tx = Math.max(left, x - rad); }
  else if (x + half > right) { anchor = 'end'; tx = Math.min(right, x + rad); }
  /* Above the mark by preference, below it at the top of the field - and below
     it also when above would put the name under the key or the compass. The
     furniture is placed before the names for exactly this reason: a name half
     under a title plate is the one defect on a map that cannot be explained
     away as a drawing decision. */
  const clear = (at) => {
    const x0 = anchor === 'start' ? tx : anchor === 'end' ? tx - half * 2 : tx - half;
    const box = { x0, y0: at - LABEL, x1: x0 + half * 2, y1: at + LABEL * 0.3 };
    return !plateSpots.some((t) => !(box.x1 < t.x || box.x0 > t.x + t.w || box.y1 < t.y || box.y0 > t.y + t.h));
  };
  const above = y - rad - LABEL * 0.45;
  const below = y + rad + LABEL;
  let ty = above < FRAME + LABEL ? below : above;
  if (!clear(ty)) { const other = ty === above ? below : above; if (clear(other)) ty = other; }
  return { tx, ty, anchor };
}

const marks = settlements.map((s) => {
  const { x, y } = grid.centre(s.col, s.row);
  const rad = (RANK[s.rank] ?? 12) * (acrossFlats / 131);
  const shape = s.rank === 'seat' || s.rank === 'city'
    ? `<rect x="${n2(x - rad)}" y="${n2(y - rad)}" width="${n2(rad * 2)}" height="${n2(rad * 2)}" fill="${SOOT}"/>`
    : `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(rad)}" fill="${s.rank === 'town' ? SOOT : palette.paper.tallow.hex}" stroke="${SOOT}" stroke-width="${n2(rad * 0.35)}"/>`;
  const { tx, ty, anchor } = place(x, y, s.name, rad);
  return `${shape}<text x="${n2(tx)}" y="${n2(ty)}" font-size="${n2(LABEL)}" text-anchor="${anchor}" fill="${SOOT}" ${HALO}>${esc(s.name)}</text>`;
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
  return `<polyline points="${pts}" fill="none" stroke="${TINT[70]}" stroke-width="${n2(acrossFlats * 0.014)}" stroke-linejoin="round" stroke-linecap="round"/>`;
}).join('\n    ');

/* A region whose name a settlement already carries is a name printed twice in
   the same two hexes. The settlement wins: it is the thing players point at. */
const regionLabels = regions.filter((g) => !settlements.some((s) => s.name === g.name)).map((g) => {
  const { x, y } = grid.centre(g.labelAt[0], g.labelAt[1]);
  return `<text x="${n2(x)}" y="${n2(y)}" font-size="${n2(acrossFlats * 0.24)}" text-anchor="middle" fill="${TINT[55]}" letter-spacing="${n2(acrossFlats * 0.05)}" ${HALO}>${esc(g.name.toUpperCase())}</text>`;
}).join('\n    ');

/* ---- the frame, and the index around the inside of it --------------------- */
const frameRand = mulberry32((form.seed ?? 1) ^ 0x5f3759df);
const frameInk = plankFrame(0, 0, plateWidth, plateHeight, FRAME, STYLE.line, acrossFlats, SOOT, frameRand);

/* I and O are skipped: at this size they read as 1 and 0. */
const ROW_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const indexSize = acrossFlats * STYLE.frame.indexSize;
const indexInk = [];
for (let c = 0; c < COLS; c++) {
  const { x } = grid.centre(c, 0);
  for (const y of [FRAME - indexSize * 0.45, plateHeight - FRAME + indexSize * 1.1]) {
    indexInk.push(`<text x="${n2(x)}" y="${n2(y)}" text-anchor="middle" font-size="${n2(indexSize)}" fill="${TINT[70]}" letter-spacing="${n2(indexSize * 0.08)}">${c + 1}</text>`);
  }
}
for (let r = 0; r < ROWS; r++) {
  const { y } = grid.centre(0, r);
  const letter = ROW_LETTERS[r] ?? String(r + 1);
  for (const x of [FRAME - indexSize * 0.7, plateWidth - FRAME + indexSize * 0.7]) {
    indexInk.push(`<text x="${n2(x)}" y="${n2(y + indexSize * 0.36)}" text-anchor="middle" font-size="${n2(indexSize)}" fill="${TINT[70]}" letter-spacing="${n2(indexSize * 0.08)}">${letter}</text>`);
  }
}

/* The map's own linework stops short of the plates rather than being painted
   over by them: the wash plate is below all ink, so an opaque panel there would
   still have every coastline running through its type, and an opaque panel on
   the ink plate would print as a pale rectangle in the black-and-white edition.
   The engraver's answer is to leave the plate blank. */
const cutouts = plateSpots.map((t) => `M${n2(t.x)},${n2(t.y)}h${n2(t.w)}v${n2(t.h)}h${n2(-t.w)}Z`).join('');
const plateClip = `M0,0h${plateWidth}v${plateHeight}h${-plateWidth}Z${cutouts}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${plateWidth} ${plateHeight}" width="${plateWidth}" height="${plateHeight}" font-family="${FONT}">
<title>${esc(map.name)}</title>
<desc>${esc(map.subtitle ?? '')} — generated by tools/draw-map.mjs from data/maps/${mapId}.json. A terrain wash per hex, the ground texture that terrain prints in, a shoreline with wave lines beside it, the watercourses run downhill from the high ground, the settlements and the lanes between them, in a timber frame with a lettered index. The hex grid is a hairline here and an overlay at read time from the same rows, so the two cannot disagree.</desc>
<defs>
  <clipPath id="land"><path d="${landClip.join('')}"/></clipPath>
  <clipPath id="water"><path d="${waterClip.join('')}"/></clipPath>
  <clipPath id="plates"><path clip-rule="evenodd" d="${plateClip}"/></clipPath>
  ${riverDefs.join('\n  ')}
</defs>
<g id="wash">
    <rect width="${plateWidth}" height="${plateHeight}" fill="${palette.paper.tallow.hex}"/>
    ${washCells.join('\n    ')}
    <path d="${riverWash.join('')}" fill="${wash('river')}"/>
    ${cartWash}
</g>
<g id="ink">
  <g clip-path="url(#plates)">
    <g stroke="${SOOT}" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#land)" opacity="${STYLE.texture.strength}">${landPen.render(SOOT)}</g>
    <g stroke="${TINT[70]}" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#water)" opacity="${STYLE.texture.waterStrength}">${waterPen.render(TINT[70])}</g>
    <path d="${gridPath.join('')}" fill="none" stroke="${TINT[STYLE.grid.tint]}" stroke-width="${n2(acrossFlats * STYLE.grid.weight)}"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#water)">
      ${coastInk.waves.map((set, i) => set.length ? `<g stroke="${i > 1 ? TINT[70] : SOOT}" stroke-width="${n2(acrossFlats * STYLE.coastWaves.weights[i])}">${set.map((d) => `<path d="${d}"/>`).join('')}</g>` : '').join('\n      ')}
      ${freshInk.waves.map((set, i) => set.length ? `<g stroke="${TINT[70]}" stroke-width="${n2(acrossFlats * STYLE.coastWaves.weights[i])}">${set.map((d) => `<path d="${d}"/>`).join('')}</g>` : '').join('\n      ')}
    </g>
    <path d="${coastInk.heavy.slice(0, freshHeavy).join('')}" fill="none" stroke="${SOOT}" stroke-width="${n2(acrossFlats * STYLE.line.coast)}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${coastInk.heavy.slice(freshHeavy).join('')}" fill="none" stroke="${SOOT}" stroke-width="${n2(acrossFlats * STYLE.line.structure)}" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="none" stroke="${TINT[70]}" stroke-linecap="round" stroke-linejoin="round">${riverInk.join('')}</g>
    ${riverLabels.join('\n    ')}
    ${regionLabels}
    ${laneGroup}
    ${roads}
    ${marks}
  </g>
  ${frameInk}
  ${indexInk.join('\n  ')}
  ${roseInk}
  ${cartInk}
</g>
<g id="grime">
    <rect width="${plateWidth}" height="${plateHeight}" fill="${palette.paper.foxing.hex}" opacity="0.05"/>
</g>
</svg>
`;

/* ------------------------------------------------------------- 10 · write out */
const svgPath = join(ROOT, 'docs', 'map', `${mapId}.svg`);

const next = { ...map };
delete next.plate; delete next.rows; delete next.regions; delete next.settlements; delete next.routes; delete next.rivers;
const rebuilt = {};
for (const k of Object.keys(map)) {
  if (k === 'commission') { rebuilt[k] = map[k]; rebuilt.plate = plate; continue; }
  if (k === 'plate') continue;
  if (k === 'rows') { rebuilt.rows = board; rebuilt.$rowsNote = 'GENERATED by tools/draw-map.mjs from commission.landform. Do not hand-edit: run the tool. On a drawn map this block is traced off the artwork instead, and hand-correcting it is expected.'; continue; }
  if (k === '$rowsNote') continue;
  if (k === 'regions' || k === 'settlements' || k === 'routes' || k === 'rivers') continue;
  rebuilt[k] = map[k];
}
if (!rebuilt.plate) rebuilt.plate = plate;
if (!rebuilt.rows) { rebuilt.rows = board; }
rebuilt.regions = regions;
rebuilt.settlements = settlements;
rebuilt.rivers = courses;
rebuilt.$riversNote = 'GENERATED. Each course is the chain of hexes the water runs through, spring first, and every one of those hexes is terrain `river` in rows. Run downhill by tools/draw-map.mjs from the terrain bands and the distance inland - never hand-placed, because a hand-placed river is how you get one that starts nowhere.';
rebuilt.routes = routes;

const nextJson = `${JSON.stringify(rebuilt, null, 2)}\n`;

/* ---------------------------------------------------------------- report it */
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
if (courses.length) {
  console.log(`  ${courses.length} watercourses, ${riverHexes.size} river hexes:`);
  for (const c of courses) console.log(`    ${(c.name ?? c.id).padEnd(18)} ${c.from} -> ${c.to}, ${c.hexes.length} hexes`);
} else if (riverBudget > 0) {
  console.log('  no watercourses: no island has ground high enough and far enough inland to spring one.');
}
if (riverBudget > riverHexes.size) {
  console.log(`  river budget unspent: asked ${riverBudget} hexes, ran ${riverHexes.size}.` +
    ` ${riverReject.tried} springs walked, ${riverReject.tooShort} reached water in under three hexes.` +
    ' A short run is a brook and is not drawn; if this number is large the massif is too close to the coast.');
}

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
