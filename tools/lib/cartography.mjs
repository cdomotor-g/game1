/**
 * The drawing vocabulary for a generated campaign map.
 *
 * WHY THIS EXISTS. docs/map/README.md's generated plate began as a flat terrain
 * colour and a coastline, on the argument tools/build-minimaps.mjs makes: drawn
 * ground competes with the pieces standing on it. That argument is the same one
 * the mini-maps already revisited and found half right - a DRAWN sheet competes,
 * and a MARK at a fraction of a cell, on the ink plate, at a fraction of full
 * strength, does not. It does the job the wash fails to do on its own: say which
 * ground this is from across the table, in the black-and-white edition too.
 *
 * This file is that reversal carried up to world scale, plus the three pieces of
 * cartographic furniture a board the size of a table top has nowhere to put
 * otherwise - a coastline with wave lines beside it, a compass, and a frame.
 *
 * WHAT IS HERE AND WHAT IS NOT. Technique is here: how a peak is hatched, how a
 * coastline is walked outwards. Configuration is in `data/components.json
 * mapPlate` and is passed in. Nothing in this file knows the name of any one map,
 * and no coordinate in it belongs to any one board - the same bargain
 * tools/draw-item.mjs makes with data/components.json itemPlate one storey down.
 *
 * EVERY LENGTH IS A FRACTION OF A HEX'S ACROSS-FLATS WIDTH, resolved against the
 * grid by the caller, so the same numbers hold whether a hex prints at 9 mm or
 * 27 mm.
 *
 * NO RING STAINS. See CLAUDE.md. Nothing here draws a circle, an ellipse or a
 * stroke in paper.foxing, and nothing here draws anything that reads as a mark
 * left by something set down on the page.
 */

/* ------------------------------------------------------------------ numbers */

export const n2 = (v) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
};
export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const P = (p) => `${n2(p.x)},${n2(p.y)}`;

/**
 * A stable per-key value in [0,1). Used where two callers must agree without
 * talking to each other - the two hexes either side of a coastline edge, most
 * importantly, which each compute the same wobble from the same key.
 */
export function hashRandom(seed, key) {
  let h = 2166136261 >>> 0;
  const s = `${seed}|${key}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  let t = (h + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/** -1..1, triangular, so jitter clusters near zero instead of at the extremes. */
export const hashJitter = (seed, key) => hashRandom(seed, `${key}#a`) + hashRandom(seed, `${key}#b`) - 1;

/* --------------------------------------------------------------------- pens */

/**
 * Paths sorted into line weights, so a whole board of ground texture emits as
 * five <g> elements rather than as ten thousand attributes. `scale` is the hex
 * across-flats width: every weight in `line` is a fraction of it.
 */
export function makePen(line, unit) {
  const bins = { coast: [], structure: [], detail: [], hatch: [], solid: [] };
  return {
    coast: (d) => bins.coast.push(d),
    structure: (d) => bins.structure.push(d),
    detail: (d) => bins.detail.push(d),
    hatch: (d) => bins.hatch.push(d),
    solid: (d) => bins.solid.push(d),
    isEmpty: () => Object.values(bins).every((b) => !b.length),
    /* `unit` is the only scale there is, and it is fixed when the pen is made.
       It took one `render(ink, { scale })` parameter, which every call site then
       passed the reciprocal of - and one that did not cancel gave the frame a
       557-pixel stroke, which with a round join filled the whole border solid
       and rounded its corners. A weight is a fraction of a hex; the pen knows
       what a hex is; nobody else needs to. */
    render(ink) {
      const out = [];
      for (const w of ['hatch', 'detail', 'structure', 'coast']) {
        if (!bins[w].length) continue;
        out.push(`<g stroke-width="${n2(line[w] * unit)}" fill="none">` +
          bins[w].map((d) => `<path d="${d}"/>`).join('') + '</g>');
      }
      if (bins.solid.length) {
        out.push(`<g fill="${ink}" stroke="none">` + bins.solid.map((d) => `<path d="${d}"/>`).join('') + '</g>');
      }
      return out.join('');
    },
  };
}

/* ------------------------------------------------------------- path helpers */

export const polyPath = (pts, close = false) => {
  if (!pts.length) return '';
  let d = `M${P(pts[0])}`;
  for (let i = 1; i < pts.length; i++) d += `L${P(pts[i])}`;
  return close ? `${d}Z` : d;
};

/**
 * Catmull-Rom through every point, emitted as cubic beziers. Coastlines and
 * rivers arrive out of a hex lattice as a chain of straight hops; this is what
 * stops them looking like one.
 */
export function curve(pts, { closed = false, tension = 0.9 } = {}) {
  const n = pts.length;
  if (n < 3) return polyPath(pts, closed);
  const at = (i) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  let d = `M${P(pts[0])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const k = tension / 6;
    d += `C${n2(p1.x + (p2.x - p0.x) * k)},${n2(p1.y + (p2.y - p0.y) * k)}` +
         ` ${n2(p2.x - (p3.x - p1.x) * k)},${n2(p2.y - (p3.y - p1.y) * k)} ${P(p2)}`;
  }
  return closed ? `${d}Z` : d;
}

/** Chaikin corner cutting. Two passes turn a hex chain into a coastline. */
export function smooth(pts, passes = 2, closed = false) {
  let cur = pts;
  for (let p = 0; p < passes; p++) {
    const next = [];
    const n = cur.length;
    if (!closed) next.push(cur[0]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = cur[i], b = cur[(i + 1) % n];
      next.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
      next.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
    }
    if (!closed) next.push(cur[n - 1]);
    cur = next;
  }
  return cur;
}

/** Every point nudged by an amount keyed to its index - a drawn line, not a ruled one. */
export const wobble = (pts, amount, seed, key) => pts.map((p, i) => ({
  x: p.x + hashJitter(seed, `${key}:${i}:x`) * amount,
  y: p.y + hashJitter(seed, `${key}:${i}:y`) * amount,
}));

/**
 * Move a path `d` units along its own normals. `sign` decides which way is out;
 * callers work that out from the map rather than from the winding, because a
 * lake's shore and a coastline are both rings with the water on opposite sides.
 */
export function offsetPath(pts, d, sign = 1, closed = true) {
  const n = pts.length;
  const norm = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const L = Math.hypot(dx, dy) || 1;
    return { x: (dy / L) * sign, y: (-dx / L) * sign };
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = closed ? pts[(i - 1 + n) % n] : pts[Math.max(0, i - 1)];
    const next = closed ? pts[(i + 1) % n] : pts[Math.min(n - 1, i + 1)];
    const a = norm(prev, pts[i]), b = norm(pts[i], next);
    let nx = a.x + b.x, ny = a.y + b.y;
    const L = Math.hypot(nx, ny) || 1;
    out.push({ x: pts[i].x + (nx / L) * d, y: pts[i].y + (ny / L) * d });
  }
  return out;
}

/** Break a line into runs with irregular gaps - the engraver lifting the burin. */
export function dashify(pts, { on, off, seed, key }) {
  const runs = [];
  let cur = [], travelled = 0, drawing = true, k = 0;
  let target = on * (1 + hashJitter(seed, `${key}:0`) * 0.5);
  for (let i = 0; i < pts.length; i++) {
    if (drawing) cur.push(pts[i]);
    if (i === 0) continue;
    travelled += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (travelled < target) continue;
    travelled = 0; k++;
    if (drawing) { if (cur.length > 1) runs.push(cur); cur = []; } else cur = [pts[i]];
    drawing = !drawing;
    target = (drawing ? on : off) * (1 + hashJitter(seed, `${key}:${k}`) * 0.5);
  }
  if (drawing && cur.length > 1) runs.push(cur);
  return runs;
}

/**
 * Blue-noise-ish points inside a hex of across-flats width `w`, centred on
 * (cx, cy). Dart throwing with a minimum distance: a uniform scatter clumps, and
 * clumped trees read as a mistake rather than as a wood.
 */
export function scatterInHex(cx, cy, w, count, minDist, rand, inset = 0.74) {
  const R = (w / Math.sqrt(3)) * inset;      // circumradius, pulled in off the points
  const pts = [];
  for (let guard = 0; pts.length < count && guard < count * 40; guard++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * R;
    const p = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    if (pts.every((q) => Math.hypot(p.x - q.x, p.y - q.y) >= minDist)) pts.push(p);
  }
  return pts;
}

/** Points along a line, jittered sideways - a ridge, a dune field, a hedgerow. */
export function scatterAlong(a, b, count, spread, rand) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count + (rand() - 0.5) * 0.12;
    const s = (rand() - 0.5) * 2 * spread;
    out.push({ x: a.x + dx * t + (-dy / L) * s, y: a.y + dy * t + (dx / L) * s });
  }
  return out;
}

/* ----------------------------------------------------------------- the marks */

/**
 * One woodcut peak.
 *
 * Open at the base on purpose. A closed triangle has a horizontal line across
 * the bottom of it and reads as a cut-out shape sitting on the tile; leaving the
 * ridge unclosed lets the mountain grow out of the ground it is drawn on.
 *
 * The lit face is left bare. Hatching everything is the commonest way to lose a
 * form, and bare paper is the brightest value available.
 */
export function peak(pen, x, baseY, w, h, rand, { snow = false } = {}) {
  const apex = { x: x + (rand() - 0.5) * w * 0.26, y: baseY - h };
  const left = { x: x - w / 2, y: baseY };
  const right = { x: x + w / 2, y: baseY };
  const kinkL = { x: left.x + (apex.x - left.x) * 0.46, y: baseY - h * (0.36 + rand() * 0.12) };
  const kinkR = { x: right.x + (apex.x - right.x) * 0.58, y: baseY - h * (0.46 + rand() * 0.12) };

  const flare = (a, b, out) => `Q${n2((a.x + b.x) / 2 + out)},${n2((a.y + b.y) / 2 + h * 0.04)} ${P(b)}`;
  pen.coast(`M${P(left)}${flare(left, kinkL, -w * 0.06)}L${P(apex)}L${P(kinkR)}${flare(kinkR, right, w * 0.06)}`);

  // the spur running down towards the viewer: the edge between lit and shaded
  const foot = { x: apex.x + w * 0.12, y: baseY };
  pen.structure(`M${P(apex)}Q${n2(apex.x - w * 0.02)},${n2(baseY - h * 0.42)} ${P(foot)}`);

  // contour hatch across the shaded face, ragged at both ends so it does not
  // read as a barcode
  const onSlope = (t) => (t < 0.55 ? lerp(apex, kinkR, t / 0.55) : lerp(kinkR, right, (t - 0.55) / 0.45));
  const rows = 6 + Math.floor(rand() * 3);
  for (let i = 1; i <= rows; i++) {
    const t = i / (rows + 1);
    const a = onSlope(t), b = lerp(apex, foot, t);
    pen.hatch(`M${P(lerp(b, a, 0.06 + rand() * 0.34))}L${P(lerp(b, a, 0.86 + rand() * 0.1))}`);
  }
  if (snow) {
    const a = lerp(apex, kinkL, 0.5), b = lerp(apex, kinkR, 0.42);
    pen.detail(`M${P(a)}L${n2(a.x + w * 0.08)},${n2(a.y - h * 0.08)}L${n2((a.x + b.x) / 2)},${n2(a.y + h * 0.02)}L${P(b)}`);
  }
}

/** A rounded rise. Hills come in overlapping runs; one on its own is a thumbprint. */
export function hummock(pen, x, baseY, w, h, rand) {
  const lean = (rand() - 0.5) * w * 0.2;
  const top = baseY - h * (1.7 + rand() * 0.4);
  pen.structure(`M${n2(x - w / 2)},${n2(baseY)}C${n2(x - w * 0.34 + lean)},${n2(top)} ${n2(x + w * 0.22 + lean)},${n2(top)} ${n2(x + w / 2)},${n2(baseY)}`);
  const rise = baseY - top;
  for (const phi of [1.12, 0.88, 0.64, 0.4]) {
    pen.hatch(`M${n2(x + lean * 0.4 + (w / 2) * 0.82 * Math.cos(phi))},${n2(baseY - rise * 0.82 * Math.sin(phi))}` +
              `l${n2(-w * 0.015)},${n2(rise * (0.18 + 0.26 * Math.sin(phi)))}`);
  }
}

/** Conifer: a trunk and three drooping skirts. The cold and high-ground tree. */
export function conifer(pen, x, y, s, rand) {
  const w = s * 0.66;
  pen.detail(`M${n2(x)},${n2(y)}L${n2(x)},${n2(y - s * 0.32)}`);
  for (let i = 2; i >= 0; i--) {
    const t = i / 3, yy = y - s * (0.26 + t * 0.52), ww = w * (1 - t * 0.44);
    pen.structure(`M${n2(x - ww / 2)},${n2(yy)}q${n2(ww * 0.14)},${n2(-s * 0.06)} ${n2(ww * 0.2)},${n2(-s * 0.05)}` +
      `L${n2(x)},${n2(yy - s * 0.34)}L${n2(x + ww * 0.3)},${n2(yy - s * 0.05)}q${n2(ww * 0.1)},${n2(-s * 0.01)} ${n2(ww * 0.2)},${n2(s * 0.05)}`);
  }
}

/** Broadleaf: a scalloped canopy on a short trunk, so it reads as foliage. */
export function broadleaf(pen, x, y, s, rand) {
  const cy = y - s * 0.52, r = s * 0.4, lobes = 7;
  pen.detail(`M${n2(x - s * 0.03)},${n2(y)}L${n2(x)},${n2(cy)}`);
  const pts = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const rr = r * (0.85 + rand() * 0.34);
    pts.push({ x: x + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.86 });
  }
  let d = `M${P(pts[0])}`;
  for (let i = 1; i <= lobes; i++) {
    const p = pts[i % lobes], q = pts[i - 1];
    const rr = Math.hypot(p.x - q.x, p.y - q.y) * 0.62;
    d += `A${n2(rr)},${n2(rr)} 0 0,1 ${P(p)}`;
  }
  pen.structure(`${d}Z`);
  pen.hatch(`M${n2(x + r * 0.18)},${n2(cy + r * 0.5)}q${n2(r * 0.36)},${n2(-r * 0.1)} ${n2(r * 0.6)},${n2(-r * 0.42)}`);
}

/** Three or four blades fanning from a point. The grassland mark. */
export function tussock(pen, x, y, s, rand) {
  const n = 3 + (rand() < 0.4 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const lean = (i - (n - 1) / 2) * 0.42 + (rand() - 0.5) * 0.2;
    const h = s * (0.72 + rand() * 0.5);
    pen.detail(`M${n2(x)},${n2(y)}Q${n2(x + lean * s * 0.5)},${n2(y - h * 0.65)} ${n2(x + lean * s * 1.15)},${n2(y - h)}`);
  }
}

/** Reeds: straight stems with seed heads. Marsh, lake shore and river bank. */
export function reeds(pen, x, y, s, rand) {
  const n = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const ox = (i - (n - 1) / 2) * s * 0.28 + (rand() - 0.5) * s * 0.1;
    const h = s * (0.85 + rand() * 0.55);
    pen.detail(`M${n2(x + ox)},${n2(y)}L${n2(x + ox + (rand() - 0.5) * s * 0.18)},${n2(y - h)}`);
    pen.solid(`M${n2(x + ox - s * 0.06)},${n2(y - h)}q${n2(s * 0.06)},${n2(-s * 0.22)} ${n2(s * 0.12)},0Z`);
  }
}

/**
 * Blown sand: a long, low crest with a hatched slip face. Deliberately flatter
 * and longer than a hummock, because hills and dunes are the two marks most at
 * risk of reading as each other.
 */
export function dune(pen, x, y, w, rand) {
  const h = w * (0.1 + rand() * 0.05);
  const crest = { x: x + w * (0.06 + rand() * 0.16), y: y - h };
  pen.structure(`M${n2(x - w / 2)},${n2(y)}Q${n2(crest.x - w * 0.22)},${n2(crest.y - h * 0.5)} ${P(crest)}` +
                `Q${n2(crest.x + w * 0.1)},${n2(crest.y + h * 0.3)} ${n2(x + w / 2)},${n2(y + h * 0.16)}`);
  for (let i = 0; i < 3; i++) {
    const t = (i + 0.6) / 4;
    pen.hatch(`M${n2(crest.x + (x + w / 2 - crest.x) * t)},${n2(crest.y + (y + h * 0.16 - crest.y) * t * 0.6)}l${n2(-w * 0.02)},${n2(h * 0.85)}`);
  }
}

/** Frost heave: short crossed ticks on thin cold ground. */
export function frostTick(pen, x, y, s, rand) {
  const a = rand() * Math.PI;
  pen.hatch(`M${n2(x - Math.cos(a) * s)},${n2(y - Math.sin(a) * s)}L${n2(x + Math.cos(a) * s)},${n2(y + Math.sin(a) * s)}` +
            `M${n2(x - Math.sin(a) * s * 0.6)},${n2(y + Math.cos(a) * s * 0.6)}L${n2(x + Math.sin(a) * s * 0.6)},${n2(y - Math.cos(a) * s * 0.6)}`);
}

/** A broken horizontal dash. Water gets this and nothing else, ever. */
export function ripple(pen, x, y, w, rand) {
  const a = w * (0.35 + rand() * 0.3);
  pen.detail(`M${n2(x - w / 2)},${n2(y)}q${n2(a * 0.5)},${n2(-w * 0.09)} ${n2(a)},0`);
  if (rand() < 0.55) {
    const b = w * (0.22 + rand() * 0.24);
    pen.detail(`M${n2(x + w * 0.12)},${n2(y + w * 0.14)}q${n2(b * 0.5)},${n2(-w * 0.08)} ${n2(b)},0`);
  }
}

export function stipple(pen, pts, r) {
  for (const p of pts) {
    pen.solid(`M${n2(p.x - r)},${n2(p.y)}a${n2(r)},${n2(r)} 0 1,0 ${n2(r * 2)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-r * 2)},0`);
  }
}

/* ------------------------------------------------------- the terrain recipes */

/**
 * How each terrain is drawn inside its hex.
 *
 * Every one owns a mark nothing else uses, because docs/art/02-palette.md
 * requires terrain to be identifiable with the colour switched off. `ctx`
 * carries the hex's across-flats width `w`, its centre, a per-hex `rand` seeded
 * from its coordinates - so a hex always draws itself the same way - and `axis`,
 * the local grain of the high ground, so a range reads as one piece of country
 * rather than as six tiles that each happen to contain a triangle.
 */
export const TERRAIN_TEXTURE = {
  mountain(pen, ctx) {
    const { x, y, w, rand, axis, high } = ctx;
    const n = 4 + (rand() < 0.5 ? 1 : 0);
    const span = w * 0.66;
    const along = scatterAlong(
      { x: x - axis.x * span, y: y - axis.y * span },
      { x: x + axis.x * span, y: y + axis.y * span }, n, w * 0.14, rand);
    along.sort((a, b) => a.y - b.y);              // back to front, so near peaks overlap far
    const tallest = along.reduce((best, p, i) => (p.y > along[best].y ? i : best), 0);
    along.forEach((p, i) => {
      const s = 0.7 + (i / Math.max(1, n - 1)) * 0.44;
      peak(pen, p.x, p.y + w * 0.15, w * 0.27 * s, w * 0.24 * s, rand, { snow: high && i === tallest });
    });
  },

  hills(pen, ctx) {
    const { x, y, w, rand, axis } = ctx;
    const along = scatterAlong(
      { x: x - axis.x * w * 0.64, y: y - axis.y * w * 0.54 },
      { x: x + axis.x * w * 0.64, y: y + axis.y * w * 0.54 }, 5, w * 0.16, rand);
    along.sort((a, b) => a.y - b.y);
    for (const p of along) hummock(pen, p.x, p.y + w * 0.1, w * (0.2 + rand() * 0.09), w * 0.085, rand);
    for (const p of scatterInHex(x, y, w, 3, w * 0.25, rand, 0.6)) tussock(pen, p.x, p.y, w * 0.055, rand);
  },

  forest(pen, ctx) {
    const { x, y, w, rand, cold } = ctx;
    const pts = scatterInHex(x, y, w, 9, w * 0.17, rand, 0.76).sort((a, b) => a.y - b.y);
    pts.forEach((p, i) => {
      const grown = i >= pts.length - 6;
      const s = w * (grown ? 0.23 + rand() * 0.06 : 0.15 + rand() * 0.04);
      (cold ? rand() < 0.85 : rand() < 0.3) ? conifer(pen, p.x, p.y, s, rand) : broadleaf(pen, p.x, p.y, s, rand);
    });
  },

  grassland(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (const p of scatterInHex(x, y, w, 10, w * 0.15, rand, 0.76)) tussock(pen, p.x, p.y, w * (0.06 + rand() * 0.03), rand);
    for (const p of scatterInHex(x, y, w, 2, w * 0.4, rand, 0.55)) broadleaf(pen, p.x, p.y, w * 0.17, rand);
  },

  marsh(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (let i = 0; i < 5; i++) ripple(pen, x + (rand() - 0.5) * w * 0.8, y + (rand() - 0.5) * w * 0.8, w * 0.2, rand);
    for (const p of scatterInHex(x, y, w, 4, w * 0.24, rand, 0.7)) reeds(pen, p.x, p.y, w * 0.13, rand);
  },

  tundra(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (const p of scatterInHex(x, y, w, 9, w * 0.14, rand, 0.76)) frostTick(pen, p.x, p.y, w * 0.05, rand);
    stipple(pen, scatterInHex(x, y, w, 12, w * 0.1, rand, 0.78), w * 0.008);
  },

  desert(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (let i = 0; i < 3; i++) {
      dune(pen, x + (rand() - 0.5) * w * 0.24, y - w * 0.28 + (i + 0.5) * w * 0.28, w * (0.5 + rand() * 0.2), rand);
    }
    stipple(pen, scatterInHex(x, y, w, 14, w * 0.09, rand, 0.78), w * 0.007);
  },

  river(pen, ctx) {
    const { x, y, w, rand } = ctx;
    /* Chevrons, not ripples. A river hex is a hex of MOVING water and the mark
       has to say so - four hexes of standing ripple in a row read as a lake,
       which is a different terrain with different rules. */
    for (let i = 0; i < 3; i++) {
      const cy = y - w * 0.22 + i * w * 0.22, cw = w * 0.2;
      pen.detail(`M${n2(x - cw)},${n2(cy - cw * 0.3)}q${n2(cw)},${n2(cw * 0.45)} ${n2(cw * 2)},0`);
    }
    for (const p of scatterInHex(x, y, w, 2, w * 0.4, rand, 0.62)) reeds(pen, p.x, p.y, w * 0.09, rand);
  },

  lake(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (let i = 0; i < 3; i++) ripple(pen, x + (rand() - 0.5) * w * 0.3, y - w * 0.2 + i * w * 0.2, w * 0.3, rand);
  },

  'shallow-water'(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (let i = 0; i < 3; i++) ripple(pen, x + (rand() - 0.5) * w * 0.3, y - w * 0.22 + i * w * 0.22, w * 0.28, rand);
  },

  'deep-water'(pen, ctx) {
    const { x, y, w, rand } = ctx;
    for (let i = 0; i < 5; i++) ripple(pen, x + (rand() - 0.5) * w * 0.3, y - w * 0.3 + i * w * 0.15, w * 0.32, rand);
  },
};

/* ------------------------------------------------------------------ furniture */

/**
 * Eight points, alternate faces inked solid - how an engraver gets a faceted
 * metal look out of one plate and no grey.
 */
export function compassRose(x, y, r, line, unit, ink, font) {
  const pen = makePen(line, unit);
  const at = (a, d) => ({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d });
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const len = i % 2 === 0 ? r : r * 0.6;
    const waist = i % 2 === 0 ? r * 0.2 : r * 0.14;
    const tip = at(a, len), l = at(a - Math.PI / 4, waist), rr = at(a + Math.PI / 4, waist);
    pen.solid(`M${n2(x)},${n2(y)}L${P(tip)}L${P(rr)}Z`);
    pen.structure(`M${n2(x)},${n2(y)}L${P(tip)}L${P(l)}Z`);
  }
  const ring = (rad, bin) => bin(`M${n2(x - rad)},${n2(y)}a${n2(rad)},${n2(rad)} 0 1,0 ${n2(rad * 2)},0a${n2(rad)},${n2(rad)} 0 1,0 ${n2(-rad * 2)},0`);
  ring(r * 1.1, pen.structure);
  ring(r * 1.22, pen.hatch);
  for (let i = 0; i < 32; i++) {
    const a = (i * Math.PI) / 16;
    pen.hatch(`M${P(at(a, r * (i % 4 === 0 ? 1.1 : 1.16)))}L${P(at(a, r * 1.22))}`);
  }
  const north = at(-Math.PI / 2, r * 1.34);
  pen.solid(`M${P(north)}l${n2(-r * 0.1)},${n2(r * 0.17)}l${n2(r * 0.1)},${n2(-r * 0.05)}l${n2(r * 0.1)},${n2(r * 0.05)}Z`);
  return `<g stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">${pen.render(ink)}</g>` +
    `<text x="${n2(x)}" y="${n2(y - r * 1.52)}" text-anchor="middle" font-family="${font}" font-size="${n2(r * 0.4)}" fill="${ink}" stroke="none" letter-spacing="${n2(r * 0.03)}">N</text>`;
}

/**
 * Timber and iron banding: motif 4 of docs/art/00-art-direction.md, the same
 * device as the card borders and the player boards, so the board belongs to the
 * same box as everything else in it.
 */
export function plankFrame(x, y, w, h, band, line, unit, ink, rand) {
  const pen = makePen(line, unit);
  pen.coast(`M${n2(x + 1)},${n2(y + 1)}h${n2(w - 2)}v${n2(h - 2)}h${n2(-w + 2)}Z`);
  pen.coast(`M${n2(x + band)},${n2(y + band)}h${n2(w - band * 2)}v${n2(h - band * 2)}h${n2(-w + band * 2)}Z`);
  pen.detail(`M${n2(x + band - band * 0.12)},${n2(y + band - band * 0.12)}h${n2(w - band * 2 + band * 0.24)}v${n2(h - band * 2 + band * 0.24)}h${n2(-w + band * 2 - band * 0.24)}Z`);

  const grain = (horizontal, fixed, from, to, lines) => {
    for (let i = 1; i <= lines; i++) {
      const off = fixed + (band * i) / (lines + 1);
      const steps = Math.max(8, Math.round((to - from) / (band * 2.4)));
      let d = horizontal ? `M${n2(from)},${n2(off)}` : `M${n2(off)},${n2(from)}`;
      for (let s = 1; s <= steps; s++) {
        const p = from + ((to - from) * s) / steps;
        const wob = (rand() - 0.5) * band * 0.14;
        d += horizontal
          ? `Q${n2(p - (to - from) / steps / 2)},${n2(off + wob)} ${n2(p)},${n2(off)}`
          : `Q${n2(off + wob)},${n2(p - (to - from) / steps / 2)} ${n2(off)},${n2(p)}`;
      }
      pen.hatch(d);
    }
  };
  grain(true, y, x, x + w, 3);
  grain(true, y + h - band, x, x + w, 3);
  grain(false, x, y, y + h, 3);
  grain(false, x + w - band, y, y + h, 3);

  const strap = (sx, sy, sw, sh) => {
    pen.structure(`M${n2(sx)},${n2(sy)}h${n2(sw)}v${n2(sh)}h${n2(-sw)}Z`);
    const r = Math.min(sw, sh) * 0.11;
    for (const [rx, ry] of sw > sh ? [[0.16, 0.5], [0.84, 0.5]] : [[0.5, 0.16], [0.5, 0.84]]) {
      pen.solid(`M${n2(sx + sw * rx - r)},${n2(sy + sh * ry - r)}h${n2(r * 2)}v${n2(r * 2)}h${n2(-r * 2)}Z`);
    }
  };
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    strap(x + w * t - band * 0.3, y + 1, band * 0.6, band - 1);
    strap(x + w * t - band * 0.3, y + h - band, band * 0.6, band - 1);
    strap(x + 1, y + h * t - band * 0.3, band - 1, band * 0.6);
    strap(x + w - band, y + h * t - band * 0.3, band - 1, band * 0.6);
  }
  for (const [cx, cy, sx, sy] of [[x + 1, y + 1, 1, 1], [x + w - 1, y + 1, -1, 1], [x + 1, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]]) {
    const L = band * 1.9, t = band - 1, r = band * 0.09;
    pen.structure(`M${n2(cx)},${n2(cy + sy * L)}L${n2(cx + sx * t)},${n2(cy + sy * L)}L${n2(cx + sx * t)},${n2(cy + sy * t)}` +
                  `L${n2(cx + sx * L)},${n2(cy + sy * t)}L${n2(cx + sx * L)},${n2(cy)}L${n2(cx)},${n2(cy)}Z`);
    for (const [px, py] of [[0.5, 1.6], [1.6, 0.5], [0.5, 0.5]]) {
      pen.solid(`M${n2(cx + sx * band * px - r)},${n2(cy + sy * band * py - r)}h${n2(r * 2)}v${n2(r * 2)}h${n2(-r * 2)}Z`);
    }
  }
  return `<g stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">${pen.render(ink)}</g>`;
}
