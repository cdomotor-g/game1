/**
 * Building tiles, as a thing tools can ask questions of.
 *
 * Three consumers, one implementation: tools/build-tiles.mjs draws the pieces,
 * tools/validate-data.mjs checks the system holds together, and tools/lib/mint.mjs
 * enumerates the subjects for the queue. A second copy of the footprint arithmetic
 * would be a second opinion about how big a warehouse is.
 *
 * Nothing here is a coordinate and nothing here is a millimetre. The cell is read
 * off the campaign map's print preset, the footprint is worked out from the
 * building's own numbers through the model in data/buildingtiles.json, and the
 * geometry is derived from those two. Change the print preset and every tile in
 * the box changes size; add a worker slot to a building and the build tells you
 * its tile grew.
 *
 * THE CELL LIVES HERE, and tools/build-minimaps.mjs reads it from here too. A
 * mini-map cell and a building-tile cell are not two facts that happen to agree,
 * they are one fact - so they are resolved by one function, off one field of one
 * map, and cannot drift.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SQRT3 = Math.sqrt(3);

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** data/buildingtiles.json, parsed. */
export const readTiles = (root = HERE) => readJson(join(root, 'data', 'buildingtiles.json'));

/* ------------------------------------------------------------------ the cell */

/**
 * Every printed world-hex size any map declares, largest last.
 *
 * A map's print presets say how wide a hex comes out on paper at each sheet
 * layout. That figure is the mini-map's cell, and it is the building tile's cell,
 * because a tile has to seat in a mini-map cell and a mini-map cell has to hold a
 * figure based for the campaign board.
 */
function declaredHexes(root) {
  const dir = join(root, 'data', 'maps');
  const out = [];
  if (!existsSync(dir)) return out;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const map = readJson(join(dir, file));
    for (const preset of map.print?.presets ?? []) {
      if (typeof preset.hexAcrossFlatsMm === 'number') {
        out.push({ mm: preset.hexAcrossFlatsMm, map: map.id, preset: preset.id, isDefault: preset.id === map.print.default });
      }
    }
  }
  return out.sort((a, b) => a.mm - b.mm);
}

/**
 * The cell a piece is cut to: the world hex at the first map's DEFAULT preset.
 *
 * "First map's default" is the table the game ships playing on, and it is the
 * same resolution tools/build-minimaps.mjs has always made - this is where that
 * function moved to, not a second one beside it.
 */
export function worldHexMm(root = HERE) {
  const hit = declaredHexes(root).find((h) => h.isDefault);
  if (!hit) throw new Error('no map declares a printed hex size - a tile cell has nothing to match');
  return { mm: hit.mm, map: hit.map, preset: hit.preset };
}

/**
 * The largest world hex ANY map declares, which is the biggest a tile could ever
 * be printed and therefore the size its plate has to hold up at. The cell above
 * is what is cut today; this is what the artist is asked for.
 */
export function largestHexMm(root = HERE) {
  const all = declaredHexes(root);
  if (!all.length) throw new Error('no map declares a printed hex size');
  return all[all.length - 1];
}

/* -------------------------------------------------------------- the footprint */

/** How much ground a subject's own numbers ask for. */
export function groundOf(subject, spec) {
  return spec.ground.terms.reduce((sum, t) => sum + (subject[t.field] || 0) * t.weight, 0);
}

/** Which rung of the ladder a ground demand lands on. */
export function bandFor(ground, spec) {
  for (const band of spec.ladder.bands) {
    if (band.under == null || ground < band.under) return band;
  }
  return spec.ladder.bands[spec.ladder.bands.length - 1];
}

/** The cells a shape covers, as axial [q, r] pairs. */
export function cellsOf(shapeId, spec) {
  const shape = spec.shapes[shapeId];
  if (!shape) throw new Error(`data/buildingtiles.json declares no shape "${shapeId}"`);
  return shape.cells.map(([q, r]) => ({ q, r }));
}

/* ---------------------------------------------------------------- geometry */

/** Centre of an axial cell, in the same unit `flats` is given in. */
export const centreOf = ({ q, r }, flats) => ({ x: flats * (q + r / 2), y: 1.5 * (flats / SQRT3) * r });

/** One corner of a pointy-top cell, by index from due north, clockwise. */
export function cornerOf(centre, flats, i) {
  const R = flats / SQRT3;
  const a = (Math.PI / 3) * i - Math.PI / 2;
  return { x: centre.x + R * Math.cos(a), y: centre.y + R * Math.sin(a) };
}

/**
 * The bounding box of a footprint, the shoulder line the name band sits on, and
 * the span of the bottom row.
 *
 * `shoulderY` is the height at which the BOTTOM row of cells is still at its full
 * width - a pointy-top hex narrows to a point below it, and a name set in that
 * wedge is a name nobody can read.
 *
 * `row` is the row the name band sits on: the WIDEST row of the footprint, and
 * the lowest of those where two are equal. Not the bounding box - on any shape
 * whose rows are staggered, which is every hex shape with more than one row, they
 * differ by half a cell and anything centred on the box comes out visibly
 * off-centre inside a band clipped to the row. And not simply the bottom row
 * either: a triad's bottom row is one cell under a two-cell top, so a band down
 * there is a narrow tab that squeezes the name for no reason while the piece
 * above it is empty. The widest row is where a label belongs, and `shoulderY`
 * follows it - which is why they are worked out together rather than separately.
 */
export function boxOf(cells, flats) {
  const R = flats / SQRT3;
  const centres = cells.map((c) => centreOf(c, flats));
  const x0 = Math.min(...centres.map((c) => c.x)) - flats / 2;
  const x1 = Math.max(...centres.map((c) => c.x)) + flats / 2;
  const y0 = Math.min(...centres.map((c) => c.y)) - R;
  const y1 = Math.max(...centres.map((c) => c.y)) + R;
  const rows = new Map();
  for (const c of centres) {
    const key = Math.round(c.y * 1e6);
    if (!rows.has(key)) rows.set(key, { y: c.y, xs: [] });
    rows.get(key).xs.push(c.x);
  }
  const measured = [...rows.values()].map((r) => ({
    y: r.y,
    x: Math.min(...r.xs) - flats / 2,
    w: Math.max(...r.xs) - Math.min(...r.xs) + flats,
  }));
  const widest = Math.max(...measured.map((r) => r.w));
  const band = measured.filter((r) => r.w === widest).sort((a, b) => b.y - a.y)[0];

  return {
    x: x0,
    y: y0,
    w: x1 - x0,
    h: y1 - y0,
    shoulderY: band.y + R / 2,
    row: { x: band.x, w: band.w },
  };
}

/** The six axial neighbours, paired with the corner index their shared edge starts at. */
const EDGES = [
  [0, { q: 1, r: -1 }],
  [1, { q: 1, r: 0 }],
  [2, { q: 0, r: 1 }],
  [3, { q: -1, r: 1 }],
  [4, { q: -1, r: 0 }],
  [5, { q: 0, r: -1 }],
];

/**
 * Where the name band goes: hugging ONE straight edge of the piece, not ruled
 * across the middle of it.
 *
 * The first version ran a horizontal strip corner to corner along the widest
 * row's shoulder line. It was the longest band a hexagon can carry and it was
 * wrong for the same reason: it cut the picture in half. A tile is one small
 * drawing and a bar through the middle of it splits it into two unrelated
 * halves, which is exactly what it looked like.
 *
 * So the band is the part of one cell lying within `heightPerCell` of one of its
 * edges - a trapezoid, because a hexagon widens as you move in from any edge -
 * and the type runs parallel to that edge. The picture is then whole, with a
 * label tucked into a corner of it.
 *
 * THE EDGE IS ALWAYS THE LOWER-LEFT ONE, and always the bottom-most and then
 * left-most cell that has that edge open. Fixed rather than chosen per tile:
 * fifty-four pieces on a table want their labels in the same place and at the
 * same angle, and a rule that picked "wherever there is most room" would tilt
 * one tile's name against its neighbour's for no reason a player could see.
 *
 * Lower-LEFT rather than lower-right, which is where it started. A drawing seen
 * from thirty degrees above and thirty to the left puts its lit face and its
 * business - the door, the working end, whatever the tile is of - on the right;
 * the bottom-left is the corner that is nearly always foreground ground. So that
 * is where the label goes, and the briefs say so, because an artist who does not
 * know where the band lands will put something in it eventually.
 *
 * The cost is length, and it is not small: the band's midline is one edge plus
 * `h/sqrt(3)`, which is about 73% of what a corner-to-corner strip carried. That
 * is a deliberate trade - a name that has to be shortened is a cheaper problem
 * than a picture that has to be cut in half - and it is what `shortName` in
 * data/buildings.json is for.
 */
const BAND_EDGE = 3; // corner 3 -> corner 4: the lower-left side of a pointy-top cell

export function bandOf(cells, flats, heightPerCell) {
  const key = (c) => `${c.q},${c.r}`;
  const present = new Set(cells.map(key));
  const [, step] = EDGES[BAND_EDGE];

  const open = cells.filter((c) => !present.has(key({ q: c.q + step.q, r: c.r + step.r })));
  if (!open.length) throw new Error('no cell of this footprint has its lower-right edge open - there is nowhere to put the band');

  /* Bottom-most, then left-most: the corner of the piece the picture is least
     likely to need. */
  const cell = open
    .map((c) => ({ c, p: centreOf(c, flats) }))
    .sort((a, b) => b.p.y - a.p.y || a.p.x - b.p.x)[0];

  const centre = cell.p;
  /* from the lower-left vertex to the bottom one, so the type reads left to
     right along the edge rather than backwards up it */
  const from = cornerOf(centre, flats, BAND_EDGE + 1);
  const to = cornerOf(centre, flats, BAND_EDGE);

  const h = heightPerCell * flats;
  const edgeLen = Math.hypot(to.x - from.x, to.y - from.y);
  const u = { x: (to.x - from.x) / edgeLen, y: (to.y - from.y) / edgeLen };
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const nLen = Math.hypot(centre.x - mid.x, centre.y - mid.y);
  const n = { x: (centre.x - mid.x) / nLen, y: (centre.y - mid.y) / nLen };

  /* A hexagon widens by 2/sqrt(3) per unit travelled in from any edge, so the
     inner side of the band is longer than the edge itself by h/sqrt(3) at each
     end. Worked out rather than clipped: a trapezoid drawn right needs no
     clipping, and one drawn wrong and clipped looks the same until it does not. */
  const grow = h / Math.sqrt(3);
  return {
    cell: cell.c,
    height: h,
    quad: [
      from,
      to,
      { x: to.x + n.x * h + u.x * grow, y: to.y + n.y * h + u.y * grow },
      { x: from.x + n.x * h - u.x * grow, y: from.y + n.y * h - u.y * grow },
    ],
    midline: {
      x: mid.x + (n.x * h) / 2,
      y: mid.y + (n.y * h) / 2,
      length: edgeLen + h / Math.sqrt(3),
      angle: (Math.atan2(u.y, u.x) * 180) / Math.PI,
    },
  };
}

/** Is every cell reachable from the first? A tile that fell into two pieces is two tiles. */
export function connected(cells) {
  if (cells.length < 2) return true;
  const key = (c) => `${c.q},${c.r}`;
  const all = new Set(cells.map(key));
  const seen = new Set([key(cells[0])]);
  const queue = [cells[0]];
  while (queue.length) {
    const c = queue.shift();
    for (const [, d] of EDGES) {
      const n = { q: c.q + d.q, r: c.r + d.r };
      if (all.has(key(n)) && !seen.has(key(n))) { seen.add(key(n)); queue.push(n); }
    }
  }
  return seen.size === cells.length;
}

/**
 * The cut line: the outline of the whole footprint as ONE closed path.
 *
 * Traced rather than drawn. Every cell edge with no cell on the far side of it is
 * a boundary edge; chaining them end to end gives the polygon a die follows. The
 * mini-map's field edge is traced the same way and for the same reason - a smooth
 * shape laid over a clump of hexes lands on none of them - but a field edge may be
 * a scatter of line segments and a CUT may not, so this closes the loop.
 */
export function outlineOf(cells, flats, round = (n) => Number(n.toFixed(3))) {
  const key = (c) => `${c.q},${c.r}`;
  const present = new Set(cells.map(key));
  const at = (p) => `${round(p.x)},${round(p.y)}`;

  const next = new Map();
  for (const c of cells) {
    const centre = centreOf(c, flats);
    for (const [i, d] of EDGES) {
      if (present.has(key({ q: c.q + d.q, r: c.r + d.r }))) continue;
      const from = cornerOf(centre, flats, i);
      const to = cornerOf(centre, flats, (i + 1) % 6);
      next.set(at(from), { from, to });
    }
  }
  if (!next.size) throw new Error('a footprint with no boundary is not a shape');

  const start = next.keys().next().value;
  const points = [];
  let cursor = start;
  for (let guard = 0; guard <= next.size; guard++) {
    const edge = next.get(cursor);
    if (!edge) throw new Error('the footprint outline does not close - the shape is not edge-connected');
    points.push(edge.from);
    cursor = at(edge.to);
    if (cursor === start) break;
  }
  if (points.length !== next.size) throw new Error('the footprint outline closed early - the shape has a hole or a pinch');
  return `M ${points.map((p) => `${round(p.x)},${round(p.y)}`).join(' L ')} Z`;
}

/** Every cell as its own hexagon, for a clipPath - whose children are unioned. */
export function cellPaths(cells, flats, round = (n) => Number(n.toFixed(3))) {
  return cells.map((c) => {
    const centre = centreOf(c, flats);
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const p = cornerOf(centre, flats, i);
      pts.push(`${round(p.x)},${round(p.y)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  });
}

/* ---------------------------------------------------------------- subjects */

/**
 * Every tile the game needs, buildings and fields together, each carrying the
 * footprint its own numbers earned it.
 *
 * The two kinds are read from two files and are otherwise identical: same brief
 * file, same plate directory, same framing entry, same four mint steps. That is
 * the point of the `kind` field being the only thing that differs.
 */
export function tileSubjects(root = HERE) {
  const spec = readTiles(root);
  const buildings = readJson(join(root, 'data', 'buildings.json'));
  const recipes = readJson(join(root, 'data', 'recipes.json'));
  const commodities = readJson(join(root, 'data', 'commodities.json'));
  const skip = new Set(spec.subjects.excludes.map((e) => e.test));
  const out = [];

  for (const b of buildings.buildings) {
    if ([...skip].some((field) => b[field])) continue;
    const ground = groundOf(b, spec);
    const band = bandFor(ground, spec);
    out.push({
      kind: 'building',
      id: b.id,
      name: b.name,
      /* What is PRINTED, which is not always what the thing is called. A tile is
         17 mm across at its smallest and a press has a floor; a building whose
         name will not set above it says so on itself (buildings.json shortName)
         rather than having the tile quietly shrink the type to nothing. */
      label: b.shortName ?? b.name,
      group: buildings.categories.find((c) => c.id === b.category)?.name ?? b.category,
      ground: Number(ground.toFixed(3)),
      band,
      shape: band.shape,
      cells: cellsOf(band.shape, spec),
      terrain: b.terrain ?? [],
      waterside: b.waterside ?? b.orWaterside ?? null,
      deposit: !!(b.requiresDeposit || b.requiresDepositAny),
      state: spec.sides.back.states.find((x) => x.for === 'buildings').state,
      summary: b.summary,
      subject: b,
    });
  }

  /* A crop's own name, and its short one where the full name will not set on a
     17 mm band - the same escape hatch a building has, on the thing it is of. */
  const commodity = (id) => commodities.commodities.find((c) => c.id === id);
  const named = (id) => commodity(id)?.name ?? id;
  const shortNamed = (id) => commodity(id)?.shortName ?? named(id);
  for (const r of recipes.recipes) {
    if (!r.cropStage) continue;
    const band = spec.ladder.bands.find((x) => x.cells === spec.fields.cells);
    out.push({
      kind: 'field',
      id: `crop-${r.cropStage}`,
      name: `${named(r.cropStage)} Field`,
      /* The crop alone on the piece. Every field tile is a field - the shape says
         so and the back says SOWN - so printing the word twice on a 17 mm hex
         spends the type size that makes the first one readable. */
      label: shortNamed(r.cropStage),
      group: 'Fields',
      ground: null,
      band,
      shape: spec.fields.shape,
      cells: cellsOf(spec.fields.shape, spec),
      terrain: buildings.buildings.find((b) => b.id === spec.fields.placedBeside)?.terrain ?? [],
      waterside: null,
      deposit: false,
      state: spec.sides.back.states.find((x) => x.for === 'fields').state,
      summary: `${named(r.cropStage)} sown in a farm's field, ${r.maturationRounds} round${r.maturationRounds === 1 ? '' : 's'} to ripen.`,
      subject: r,
    });
  }

  return out;
}

/**
 * A tile's plate id. ONE per tile, whichever side is asked for.
 *
 * It used to be one per SIDE - `tile-hut-site`, `tile-crop-grain-sown` - because
 * a tile was two commissions. It is one now: the back is the face's plate with
 * the colour run not laid on, so there is no second picture to name. The `side`
 * argument is kept because callers still say which side they are drawing and it
 * would be worse for them to have to know that it no longer matters here.
 *
 * The state (`site`, `sown`) survives as prose - it is still the true word for
 * what that side means - but it names nothing. See data/buildingtiles.json
 * sides.back.
 */
export const plateIdOf = (row, _side = 'face') => `tile-${row.id}`;

/**
 * Every DISTINCT plate a tile needs drawn, which is the number the mint queue,
 * the uniqueness check and the artist all have to agree on.
 *
 * Stated once, here, rather than as `['face', 'back'].map(...)` written out at
 * each of the three call sites - which is exactly how those three drifted apart
 * the last time this changed.
 */
export const platesOf = (row) => [...new Set(SIDES.map((w) => plateIdOf(row, w)))];

/** The sides a tile is printed on. Both are drawn; only one is commissioned. */
export const SIDES = ['face', 'back'];

/**
 * Which page a tile's plate is drawn on: whichever declared format comes nearest
 * the footprint's own aspect.
 *
 * Derived rather than written on the shape, for the reason the whole file is
 * derived - a shape that changed and a format that did not is a plate that
 * arrives the wrong proportion, and the framing arithmetic is built on the plate's
 * proportion. Compared in log space so "twice as wide" and "half as wide" are the
 * same distance from square, which is what nearness means for an aspect.
 */
export function formatFor(cells, sizeByFormat, flats = 1) {
  const box = boxOf(cells, flats);
  const want = Math.log(box.w / box.h);
  let best = null;
  for (const [name, size] of Object.entries(sizeByFormat ?? {})) {
    const [w, h] = String(size).split('x').map(Number);
    if (!w || !h) continue;
    const d = Math.abs(Math.log(w / h) - want);
    if (!best || d < best.d) best = { name, d };
  }
  if (!best) throw new Error('no format is declared to draw a tile plate on');
  return best.name;
}
