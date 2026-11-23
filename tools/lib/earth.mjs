/**
 * The real Earth, laid onto a hex board.
 *
 * Everything that turns a place on the planet into a hex - and a hex back into a
 * place - is in this file and nowhere else. The sampler (tools/fetch-earth.mjs)
 * asks it where to look; the drawer (tools/draw-map.mjs) asks it where a city
 * stands. Nothing types a hex for a real place: a place is a latitude and a
 * longitude and the board works out which hex it falls in.
 *
 * PROJECTION. Lambert azimuthal equal-area, centred on the middle of the region.
 * Equal-area on purpose: a hex then stands for the same number of square
 * kilometres wherever it is on the board, so "this region is mostly desert" is a
 * true statement about land and not about how the page was stretched. The price is
 * that shapes shear a little towards the edges, which is the honest thing for a flat
 * board to do and is worth a note on the sheet rather than a hidden fix.
 *
 * GRID. Pointy-top, odd-r - the same convention as tools/lib/hexgrid.mjs - with one
 * hex `hexKm` flat to flat. The board's middle is the projection's centre.
 */

const R = 6371.0088;          // km, mean Earth radius
const RAD = Math.PI / 180;
const SQRT3 = Math.sqrt(3);

/** @param {{cols:number, rows:number, hexKm:number, centre:{lat:number, lon:number}}} spec */
export function earthGrid(spec) {
  const { cols, rows, hexKm, centre } = spec;
  const w = hexKm;
  const radius = w / SQRT3;
  const sinP0 = Math.sin(centre.lat * RAD), cosP0 = Math.cos(centre.lat * RAD);
  const widthKm = (cols + 0.5) * w;
  const heightKm = 2 * radius + (rows - 1) * 1.5 * radius;

  /** Hex centre in km east/north of the projection centre. */
  const centreKm = (col, row) => ({
    x: (col + 0.5 + 0.5 * (row & 1)) * w - widthKm / 2,
    y: heightKm / 2 - (radius + row * 1.5 * radius),
  });

  const inverse = (x, y) => {
    const rho = Math.hypot(x, y);
    if (rho === 0) return { lat: centre.lat, lon: centre.lon };
    const c = 2 * Math.asin(Math.min(1, rho / (2 * R)));
    const lat = Math.asin(Math.cos(c) * sinP0 + (y * Math.sin(c) * cosP0) / rho);
    const lon = centre.lon * RAD + Math.atan2(x * Math.sin(c), rho * cosP0 * Math.cos(c) - y * sinP0 * Math.sin(c));
    return { lat: lat / RAD, lon: ((lon / RAD + 540) % 360) - 180 };
  };

  const forward = (lat, lon) => {
    const p = lat * RAD, dl = (lon - centre.lon) * RAD;
    const k = Math.sqrt(2 / (1 + sinP0 * Math.sin(p) + cosP0 * Math.cos(p) * Math.cos(dl)));
    return { x: R * k * Math.cos(p) * Math.sin(dl), y: R * k * (cosP0 * Math.sin(p) - sinP0 * Math.cos(p) * Math.cos(dl)) };
  };

  /** Latitude and longitude of a hex's middle. */
  const latLonOf = (col, row) => { const { x, y } = centreKm(col, row); return inverse(x, y); };

  /** Which hex a point on the planet falls in (null if off the board). */
  const hexOf = (lat, lon) => {
    const { x, y } = forward(lat, lon);
    let best = null, bestD = Infinity;
    /* Guess the row, then test the neighbourhood: a hex is the nearest centre. */
    const rowGuess = Math.round((heightKm / 2 - y - radius) / (1.5 * radius));
    for (let r = rowGuess - 1; r <= rowGuess + 1; r++) {
      if (r < 0 || r >= rows) continue;
      const colGuess = Math.round((x + widthKm / 2) / w - 0.5 - 0.5 * (r & 1));
      for (let c = colGuess - 1; c <= colGuess + 1; c++) {
        if (c < 0 || c >= cols) continue;
        const m = centreKm(c, r);
        const d = Math.hypot(m.x - x, m.y - y);
        if (d < bestD) { bestD = d; best = { col: c, row: r }; }
      }
    }
    /* Outside the field entirely: further than a hex from every centre. */
    return best && bestD <= w * 0.62 ? best : null;
  };

  /** A lattice of points that fall inside one hex, as latitude/longitude. */
  const samplePoints = (col, row, across = 9) => {
    const m = centreKm(col, row);
    const out = [];
    const step = w / across;
    for (let i = -across; i <= across; i++) for (let j = -across; j <= across; j++) {
      const dx = i * step, dy = j * step * 0.866;
      /* Inside a pointy-top hexagon: within half the width, and under the slanted edges. */
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > w / 2 || ay > radius) continue;
      if (ay > radius - ax / SQRT3) continue;
      out.push(inverse(m.x + dx, m.y + dy));
    }
    return out;
  };

  return { centreKm, latLonOf, hexOf, samplePoints, forward, inverse, widthKm, heightKm };
}

/* ------------------------------------------------------------- classification */

/** Köppen-Geiger class names, by the number the raster stores. */
export const KOPPEN = [
  null, 'Af', 'Am', 'Aw', 'BWh', 'BWk', 'BSh', 'BSk', 'Csa', 'Csb', 'Csc', 'Cwa', 'Cwb', 'Cwc',
  'Cfa', 'Cfb', 'Cfc', 'Dsa', 'Dsb', 'Dsc', 'Dsd', 'Dwa', 'Dwb', 'Dwc', 'Dwd', 'Dfa', 'Dfb', 'Dfc', 'Dfd', 'ET', 'EF',
];

/**
 * One hex's sampled numbers -> a game terrain id, by the rules in data/earth/classify.json.
 * A cell is [landPct, meanLandM, p90LandM, maxM, medianSeaM, koppen].
 */
export function classify(cell, rules) {
  const [landPct, mean, p90, max, sea, koppen] = cell;
  const t = rules.thresholds;
  if (landPct < t.landPct) {
    /* Water. The shelf is shallow: a hull can anchor and a net can reach the bottom. */
    return sea > -t.shelfDepthM ? 'shallow-water' : 'deep-water';
  }
  const ks = KOPPEN[koppen] ?? null;
  const relief = p90 - mean;
  if (mean >= t.mountain.meanM || (p90 >= t.mountain.p90M && relief >= t.mountain.reliefM)) return 'mountain';
  if (mean >= t.hills.meanM || (p90 >= t.hills.p90M && relief >= t.hills.reliefM)) return 'hills';
  return rules.climate[ks] ?? rules.climate.default;
}
