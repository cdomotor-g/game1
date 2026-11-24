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

/**
 * Which layout a region uses is `commission.earth.grid.kind`:
 *   'rows-on-parallels'  every hex row is one band of latitude and every column a band of longitude,
 *                        so a hex can be read off the degrees round the frame (the default for new maps)
 *   'equal-area'         the older Lambert azimuthal layout, kept so nothing already built moves
 * @param {{cols:number, rows:number, kind?:string, hexLon?:number, stdParallel?:number, hexKm?:number, centre:{lat:number, lon:number}}} spec
 */
export function earthGrid(spec) {
  return spec.kind === 'rows-on-parallels' ? parallelGrid(spec) : areaGrid(spec);
}

const KM_PER_DEG = (2 * Math.PI * R) / 360;

/**
 * Rows follow the parallels. The ground is drawn on the plain rectangular ("equirectangular")
 * layout scaled true at one standard parallel, so every meridian is a straight vertical line and
 * every parallel a straight horizontal one, which is what lets a reader find a hex by its degrees.
 * The price is that ground sizes drift away from that parallel (about 14% at the board's top and
 * bottom edges for the Mediterranean); the sheet says so rather than hiding it.
 *
 * Everything here is in "kilometres" in that plane, so the rest of the tools can keep asking
 * `centreKm` and `forward` without knowing which layout they have.
 */
function parallelGrid(spec) {
  const { cols, rows, centre, hexLon, stdParallel } = spec;
  const kx = KM_PER_DEG * Math.cos(stdParallel * RAD);
  const hexKm = hexLon * kx;                          // flat to flat
  const radius = hexKm / SQRT3;
  const rowKm = 1.5 * radius;                         // one row, in km
  const rowLat = rowKm / KM_PER_DEG;                  // ...and in degrees of latitude
  const midCol = (cols - 1) / 2 + 0.25;               // the odd rows sit half a hex right
  const lon0 = centre.lon - midCol * hexLon;          // longitude of hex (0,0)
  const lat0 = centre.lat + ((rows - 1) / 2) * rowLat; // latitude of row 0
  const widthKm = (cols + 0.5) * hexKm;
  const heightKm = 2 * radius + (rows - 1) * rowKm;

  const forward = (lat, lon) => ({ x: (lon - centre.lon) * kx, y: (lat - centre.lat) * KM_PER_DEG });
  const inverse = (x, y) => ({ lat: centre.lat + y / KM_PER_DEG, lon: centre.lon + x / kx });
  const centreKm = (col, row) => ({
    x: (col + 0.5 * (row & 1) - midCol) * hexKm,
    y: ((rows - 1) / 2 - row) * rowKm,
  });
  const latLonOf = (col, row) => { const { x, y } = centreKm(col, row); return inverse(x, y); };
  const hexOf = (lat, lon) => {
    const { x, y } = forward(lat, lon);
    let best = null, bestD = Infinity;
    const rowGuess = Math.round((rows - 1) / 2 - y / rowKm);
    for (let r = rowGuess - 1; r <= rowGuess + 1; r++) {
      if (r < 0 || r >= rows) continue;
      const colGuess = Math.round(x / hexKm + midCol - 0.5 * (r & 1));
      for (let c = colGuess - 1; c <= colGuess + 1; c++) {
        if (c < 0 || c >= cols) continue;
        const m = centreKm(c, r);
        const d = Math.hypot(m.x - x, m.y - y);
        if (d < bestD) { bestD = d; best = { col: c, row: r }; }
      }
    }
    return best && bestD <= hexKm * 0.62 ? best : null;
  };
  const samplePoints = (col, row, across = 9) => {
    const m = centreKm(col, row);
    const out = [];
    const step = hexKm / across;
    for (let i = -across; i <= across; i++) for (let j = -across; j <= across; j++) {
      const dx = i * step, dy = j * step * 0.866;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > hexKm / 2 || ay > radius || ay > radius - ax / SQRT3) continue;
      out.push(inverse(m.x + dx, m.y + dy));
    }
    return out;
  };
  /** Everything a reader of the finished plate needs to turn a pixel into degrees. */
  const geo = { kind: 'rows-on-parallels', lon0, lat0, hexLon, rowLat, stdParallel };
  return { centreKm, latLonOf, hexOf, samplePoints, forward, inverse, widthKm, heightKm, hexKm, geo };
}

function areaGrid(spec) {
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

  return { centreKm, latLonOf, hexOf, samplePoints, forward, inverse, widthKm, heightKm, hexKm, geo: null };
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
