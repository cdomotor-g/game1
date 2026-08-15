/**
 * Pointy-top hex grid geometry, shared by the map tools and the web build.
 *
 * The board is stored as offset coordinates — column and row, the way you would
 * read a printed grid — because the map data is written and edited by hand as one
 * string per row. Everything that is actually *maths* (neighbours, distance,
 * range) converts to axial first, where the arithmetic is trivial and correct.
 *
 * Offset convention is "odd-r": odd-numbered rows are shifted half a hex right.
 *
 *      row 0   ( 0,0 ) ( 1,0 ) ( 2,0 )
 *      row 1      ( 0,1 ) ( 1,1 ) ( 2,1 )
 *      row 2   ( 0,2 ) ( 1,2 ) ( 2,2 )
 *
 * A hex is described by ONE number, `acrossFlats` — the flat-to-flat width, which
 * for a pointy-top hex is its horizontal width and the thing you can actually
 * measure with a ruler on a printed sheet. Everything else is derived from it.
 */

const SQRT3 = Math.sqrt(3);

/** The six axial directions, in the order the SVG renderer walks the edges. */
export const DIRECTIONS = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

/** Canonical hex id. Zero-padded so a plain sort puts the grid in reading order. */
export function hexId(col, row) {
  return `c${String(col).padStart(2, '0')}r${String(row).padStart(2, '0')}`;
}

export function parseHexId(id) {
  const m = /^c(\d+)r(\d+)$/.exec(id);
  if (!m) throw new Error(`not a hex id: ${id}`);
  return { col: Number(m[1]), row: Number(m[2]) };
}

/** odd-r offset to axial. */
export function toAxial(col, row) {
  return { q: col - (row - (row & 1)) / 2, r: row };
}

/** axial back to odd-r offset. */
export function toOffset(q, r) {
  return { col: q + (r - (r & 1)) / 2, row: r };
}

/** The six neighbours in offset coordinates, in axial-direction order. */
export function neighbours(col, row) {
  const { q, r } = toAxial(col, row);
  return DIRECTIONS.map(([dq, dr]) => toOffset(q + dq, r + dr));
}

/** Hex distance in steps, which is also the cheapest possible move in tiles. */
export function distance(a, b) {
  const p = toAxial(a.col, a.row);
  const s = toAxial(b.col, b.row);
  const dq = p.q - s.q;
  const dr = p.r - s.r;
  return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2;
}

/**
 * Layout maths for a grid of `cols` x `rows` pointy-top hexes of a given
 * flat-to-flat width, in whatever unit `acrossFlats` is given in.
 *
 * `originX` / `originY` place the top-left corner of the grid's bounding box, so
 * callers can centre the grid on a map field without repeating the arithmetic.
 */
export function layout({ cols, rows, acrossFlats, originX = 0, originY = 0 }) {
  const width = acrossFlats;
  const radius = acrossFlats / SQRT3; // centre to corner
  const height = 2 * radius;
  const rowPitch = 1.5 * radius;

  return {
    cols,
    rows,
    width,
    height,
    radius,
    rowPitch,
    originX,
    originY,
    /** Total bounding box, including the half-hex jog on odd rows. */
    extentX: width * (cols + (rows > 1 ? 0.5 : 0)),
    extentY: rowPitch * (rows - 1) + height,

    centre(col, row) {
      return {
        x: originX + width * (col + 0.5 * (row & 1)) + width / 2,
        y: originY + rowPitch * row + radius,
      };
    },

    /** The six corners, clockwise from the top vertex. */
    corners(col, row) {
      const { x, y } = this.centre(col, row);
      const out = [];
      for (let i = 0; i < 6; i++) {
        const angle = ((60 * i - 90) * Math.PI) / 180;
        out.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
      }
      return out;
    },

    /** Which hex contains a point. Returns null outside the grid. */
    at(x, y) {
      // Convert to fractional axial, then round in cube space.
      const px = (x - originX) / width - 0.5;
      const py = (y - originY) / radius;
      const fr = (py - 1) / 1.5;
      const fq = px - 0.5 * (Math.round(fr) & 1);
      const rounded = roundAxial(fq, fr);
      const { col, row } = toOffset(rounded.q, rounded.r);
      if (col < 0 || row < 0 || col >= cols || row >= rows) return null;
      return { col, row };
    },
  };
}

function roundAxial(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

/**
 * Evenly spread sample points inside a hex, as offsets from its centre in units
 * of the hex radius. Used by the tracer to average the artwork under a hex
 * without letting the corners — which overlap the neighbouring hex's ink — vote
 * as loudly as the middle does.
 */
export function samplePattern(rings = 3, perRing = 12) {
  const points = [[0, 0]];
  for (let ring = 1; ring <= rings; ring++) {
    const radius = (ring / (rings + 0.5)) * 0.82;
    const count = perRing * ring;
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count + ring * 0.4;
      points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
  }
  return points;
}
