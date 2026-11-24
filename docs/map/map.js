/* Shared map geometry and drawing for the viewer and the print sheets.
 *
 * The browser half of tools/lib/hexgrid.mjs. It is duplicated rather than shared
 * because docs/ has to work when you double-click a file off disk, where ES module
 * imports across directories are exactly the thing a browser refuses to do. The
 * two are small, and validate-map.mjs is the check that the data they read is
 * sound either way.
 */
(function (global) {
  'use strict';

  const SQRT3 = Math.sqrt(3);

  /** Layout for a map's grid, in plate pixel coordinates. */
  function layoutFor(map) {
    const field = map.plate.field;
    const cols = map.grid.cols;
    const rows = map.grid.rows;
    const width = field.width / cols;          /* flat to flat */
    const radius = width / SQRT3;              /* centre to corner */
    const rowPitch = 1.5 * radius;
    const originX = field.x + (field.width - width * (cols + 0.5)) / 2;
    const originY = field.y + (field.height - (rowPitch * (rows - 1) + 2 * radius)) / 2;

    return {
      cols, rows, width, radius, rowPitch, originX, originY, field,
      centre(col, row) {
        return {
          x: originX + width * (col + 0.5 * (row & 1)) + width / 2,
          y: originY + rowPitch * row + radius,
        };
      },
      corners(col, row) {
        const c = this.centre(col, row);
        const out = [];
        for (let i = 0; i < 6; i++) {
          const a = ((60 * i - 90) * Math.PI) / 180;
          out.push([c.x + radius * Math.cos(a), c.y + radius * Math.sin(a)]);
        }
        return out;
      },
      /** Which hex contains a plate-space point, or null. */
      at(x, y) {
        const py = (y - originY) / radius;
        const fr = (py - 1) / 1.5;
        const rr = Math.round(fr);
        const fq = (x - originX) / width - 0.5 - 0.5 * (rr & 1);
        const q = Math.round(fq);
        /* Round in cube space so points near a corner land in the right hex. */
        let best = null;
        let bestDist = Infinity;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dq = -1; dq <= 1; dq++) {
            const col = q + dq;
            const row = rr + dr;
            if (col < 0 || row < 0 || col >= cols || row >= rows) continue;
            const c = this.centre(col, row);
            const d = (c.x - x) ** 2 + (c.y - y) ** 2;
            if (d < bestDist) { bestDist = d; best = { col, row }; }
          }
        }
        return best;
      },
    };
  }

  /** odd-r offset to axial and back, for neighbours and distance. */
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  function neighbours(col, row) {
    const q = col - (row - (row & 1)) / 2;
    return DIRS.map(([dq, dr]) => {
      const nq = q + dq;
      const nr = row + dr;
      return { col: nq + (nr - (nr & 1)) / 2, row: nr };
    });
  }
  function distance(a, b) {
    const aq = a.col - (a.row - (a.row & 1)) / 2;
    const bq = b.col - (b.row - (b.row & 1)) / 2;
    const dq = aq - bq;
    const dr = a.row - b.row;
    return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2;
  }

  /** Terrain id at a hex, via the map's legend. */
  function terrainAt(map, col, row) {
    const line = map.rows[row];
    if (!line) return null;
    return map.legend[line[col]] || null;
  }

  /** The picture under the overlay: a real-Earth board's relief plate if it has one, otherwise its plate. */
  function plateFile(map) {
    return (map.plate.relief && map.plate.relief.file) || map.plate.file;
  }

  const SVG = 'http://www.w3.org/2000/svg';
  function svg(name, attrs, children) {
    const node = document.createElementNS(SVG, name);
    for (const key in attrs || {}) {
      if (attrs[key] !== null && attrs[key] !== undefined) node.setAttribute(key, attrs[key]);
    }
    for (const child of children || []) node.appendChild(child);
    return node;
  }

  const pointsOf = (corners) => corners.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  /**
   * Builds the overlay as one <g> per layer, so the viewer and the print page can
   * show or hide each without rebuilding anything.
   */
  function buildOverlay(map, palette, options) {
    const opts = options || {};
    const L = layoutFor(map);
    /* A board with a relief plate draws its grid as a pale line with a dark one beside it and a
       gentle three-tone shift, because a single thin line is lost on ground of its own colour. */
    const keyline = !!(map.plate.relief);
    const layers = {
      wash: svg('g', { class: 'layer-wash' }),
      tone: svg('g', { class: 'layer-tone' }),
      grid: svg('g', { class: 'layer-grid' }),
      graticule: svg('g', { class: 'layer-graticule' }),
      frame: svg('g', { class: 'layer-frame' }),
      codes: svg('g', { class: 'layer-codes' }),
      labels: svg('g', { class: 'layer-labels' }),
      routes: svg('g', { class: 'layer-routes' }),
      places: svg('g', { class: 'layer-places' }),
    };

    const stroke = Math.max(1, L.radius * 0.022);

    for (let row = 0; row < L.rows; row++) {
      for (let col = 0; col < L.cols; col++) {
        const id = terrainAt(map, col, row);
        const corners = L.corners(col, row);
        const points = pointsOf(corners);
        const wash = (palette.terrain[id] || {}).wash || '#ff00ff';
        layers.wash.appendChild(svg('polygon', { points, fill: wash, 'data-col': col, 'data-row': row }));
        if (keyline) {
          const q = col - (row - (row & 1)) / 2;
          const t = [-0.06, 0, 0.06][(((q - row) % 3) + 3) % 3];
          if (t) layers.tone.appendChild(svg('polygon', { points, fill: t < 0 ? '#000' : '#fff', 'fill-opacity': (Math.abs(t) * 1.6).toFixed(3) }));
          const line = Math.max(1, L.radius * 0.02);
          layers.grid.appendChild(
            svg('polygon', {
              points, fill: 'none', stroke: '#1E1A16', 'stroke-opacity': 0.55, 'stroke-width': line.toFixed(2),
              transform: 'translate(' + (line * 0.9).toFixed(2) + ',' + (line * 0.9).toFixed(2) + ')', style: 'opacity:1',
            })
          );
          layers.grid.appendChild(
            svg('polygon', {
              points, fill: 'none', stroke: '#fff', 'stroke-opacity': 0.55, 'stroke-width': line.toFixed(2),
              'data-col': col, 'data-row': row, class: 'hex', style: 'opacity:1',
            })
          );
        } else {
          layers.grid.appendChild(
            svg('polygon', {
              points, fill: 'none', stroke: palette.ink.soot.hex, 'stroke-width': stroke,
              'data-col': col, 'data-row': row, class: 'hex',
            })
          );
        }
        /* The terrain letter code, in the bottom corner of every cell. This is
           the ruling when the artwork under a hex straddles the grid line: the
           letter is the terrain, whatever the paint suggests. */
        if (opts.codes !== false) {
          const c = L.centre(col, row);
          const t = (opts.terrains || {})[id] || {};
          if (t.code) {
            /* Kept inside the lower-right slant: at baseline offset 0.62r the edge
               is 1.732 * (r - 0.62r) = 0.66r from centre, so a wide glyph centred
               at 0.22 * width = 0.38r with half-width ~0.19r stays clear of the
               grid line it exists to adjudicate. */
            const codeText = svg('text', {
              x: (c.x + L.width * 0.22).toFixed(1), y: (c.y + L.radius * 0.62).toFixed(1),
              'font-size': (L.radius * 0.38).toFixed(1), 'text-anchor': 'middle',
            });
            codeText.textContent = t.code;
            layers.codes.appendChild(codeText);
          }
        }
        if (opts.labels !== false) {
          const c = L.centre(col, row);
          const size = L.radius * (opts.labelScale || 0.55);
          const text = svg('text', {
            x: c.x.toFixed(1), y: (c.y - L.radius * 0.5).toFixed(1),
            'font-size': size.toFixed(1), 'text-anchor': 'middle',
          });
          text.textContent = `${col},${row}`;
          layers.labels.appendChild(text);
        }
      }
    }

    /* Rail and shipping follow hex centres; roads join settlement to settlement. */
    const byId = {};
    for (const s of map.settlements || []) byId[s.id] = s;
    const routes = map.routes || {};
    for (const line of routes.rail || []) {
      const d = line.hexes.map((h, i) => {
        const c = L.centre(h[0], h[1]);
        return `${i ? 'L' : 'M'}${c.x.toFixed(1)},${c.y.toFixed(1)}`;
      }).join(' ');
      layers.routes.appendChild(svg('path', { d, class: 'route rail', 'stroke-width': stroke * 3 }));
    }
    for (const line of routes.shipping || []) {
      const d = line.hexes.map((h, i) => {
        const c = L.centre(h[0], h[1]);
        return `${i ? 'L' : 'M'}${c.x.toFixed(1)},${c.y.toFixed(1)}`;
      }).join(' ');
      layers.routes.appendChild(
        svg('path', { d, class: 'route shipping', 'stroke-width': stroke * 2, 'stroke-dasharray': `${L.radius * 0.3} ${L.radius * 0.25}` })
      );
    }
    for (const link of routes.road || []) {
      const a = byId[link.from];
      const b = byId[link.to];
      if (!a || !b) continue;
      const p = L.centre(a.col, a.row);
      const q = L.centre(b.col, b.row);
      layers.routes.appendChild(
        svg('line', {
          x1: p.x.toFixed(1), y1: p.y.toFixed(1), x2: q.x.toFixed(1), y2: q.y.toFixed(1),
          class: 'route road', 'stroke-width': stroke * 1.6,
        })
      );
    }

    const RANK_SIZE = { seat: 1.0, city: 0.82, town: 0.62, village: 0.45 };
    for (const s of map.settlements || []) {
      const c = L.centre(s.col, s.row);
      const r = L.radius * 0.34 * (RANK_SIZE[s.rank] || 0.6);
      const g = svg('g', { class: `place rank-${s.rank}`, 'data-id': s.id });
      g.appendChild(svg('circle', { cx: c.x.toFixed(1), cy: c.y.toFixed(1), r: r.toFixed(1) }));
      const label = svg('text', {
        x: c.x.toFixed(1), y: (c.y - r - L.radius * 0.16).toFixed(1),
        'font-size': (L.radius * (s.rank === 'seat' || s.rank === 'city' ? 0.6 : 0.48)).toFixed(1),
        'text-anchor': 'middle',
      });
      label.textContent = s.name;
      g.appendChild(label);
      layers.places.appendChild(g);
    }

    if (map.plate.geo) buildGeo(map, L, layers);

    if (opts.legend !== false) {
      const panel = buildLegend(map, palette, opts.terrains || {});
      if (panel) layers.legend = panel;
    }

    return { layout: L, layers };
  }

  /**
   * Degrees. A real-Earth board says, in `plate.geo`, which longitude and latitude hex (0,0) stands at and how
   * many degrees a column and a row are, so a line of latitude or longitude is a plain straight line on the
   * plate. The frame is the band outside the field, with the same degrees marked along it.
   */
  function buildGeo(map, L, layers) {
    const geo = map.plate.geo;
    const F = map.plate.field;
    const sc = L.width / 60;
    const x = (lon) => L.originX + L.width / 2 + ((lon - geo.lon0) / geo.hexLon) * L.width;
    const y = (lat) => L.originY + L.radius + ((geo.lat0 - lat) / geo.rowLat) * L.rowPitch;
    const lonOf = (px) => geo.lon0 + ((px - L.originX - L.width / 2) / L.width) * geo.hexLon;
    const latOf = (py) => geo.lat0 - ((py - L.originY - L.radius) / L.rowPitch) * geo.rowLat;
    const west = Math.floor(lonOf(0)), east = Math.ceil(lonOf(map.plate.width));
    const south = Math.floor(latOf(map.plate.height)), north = Math.ceil(latOf(0));
    /* A Region board rules every 5 degrees, heavier every 10. The Atlas says its own steps
       (commission.atlas: 30 of longitude, 15 of latitude), the same numbers tools/earth/relief.py reads. */
    const atlas = (map.commission && map.commission.atlas) || {};
    const gr = atlas.graticule || {}, fr = atlas.frame || {};
    const lonStep = gr.lonStep || 5, latStep = gr.latStep || 5, heavy = gr.lonStep ? 180 : 10;
    const first = (v, step) => v - (((v % step) + step) % step);
    const ink = '#2E2822';

    for (let lon = first(west, lonStep); lon <= east; lon += lonStep) {
      const px = x(lon);
      if (px < F.x || px > F.x + F.width) continue;
      layers.graticule.appendChild(svg('line', {
        x1: px.toFixed(1), y1: F.y, x2: px.toFixed(1), y2: F.y + F.height, stroke: '#182C54',
        'stroke-opacity': lon % heavy === 0 ? 0.5 : 0.3, 'stroke-width': (sc * (lon % heavy === 0 ? 1.8 : 1)).toFixed(2),
      }));
    }
    for (let lat = first(south, latStep); lat <= north; lat += latStep) {
      const py = y(lat);
      if (py < F.y || py > F.y + F.height) continue;
      const strong = gr.latStep ? lat === 0 : lat % 10 === 0;
      layers.graticule.appendChild(svg('line', {
        x1: F.x, y1: py.toFixed(1), x2: F.x + F.width, y2: py.toFixed(1), stroke: '#182C54',
        'stroke-opacity': strong ? 0.5 : 0.3, 'stroke-width': (sc * (strong ? 1.8 : 1)).toFixed(2),
      }));
    }
    const tropic = y(23.44);
    if (tropic > F.y && tropic < F.y + F.height) {
      layers.graticule.appendChild(svg('line', {
        x1: F.x, y1: tropic.toFixed(1), x2: F.x + F.width, y2: tropic.toFixed(1), stroke: '#962820', 'stroke-opacity': 0.9,
        'stroke-width': (sc * 1.8).toFixed(2), 'stroke-dasharray': (sc * 12) + ' ' + (sc * 7),
      }));
    }

    /* The frame: paper outside the field, a neat line, and the degrees. */
    const band = svg('path', {
      'fill-rule': 'evenodd', fill: '#EADFC6',
      d: 'M0,0H' + map.plate.width + 'V' + map.plate.height + 'H0Z M' + F.x + ',' + F.y + 'H' + (F.x + F.width) + 'V' + (F.y + F.height) + 'H' + F.x + 'Z',
    });
    layers.frame.appendChild(band);
    layers.frame.appendChild(svg('rect', { x: F.x, y: F.y, width: F.width, height: F.height, fill: 'none', stroke: ink, 'stroke-width': (sc * 1.4).toFixed(2) }));
    const fs = 10.5 * sc;
    const tick = (x1, y1, x2, y2) => layers.frame.appendChild(svg('line', { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), stroke: ink, 'stroke-width': (sc * 0.9).toFixed(2) }));
    const text = (tx, ty, anchor, str) => {
      const t = svg('text', { x: tx.toFixed(1), y: ty.toFixed(1), 'text-anchor': anchor, 'font-size': fs.toFixed(1), fill: ink, class: 'frame-text' });
      t.textContent = str;
      layers.frame.appendChild(t);
    };
    const tickLon = fr.tickLon || 1, labelLon = fr.labelLon || 5, tickLat = fr.tickLat || 1, labelLat = fr.labelLat || 5;
    const fold = (lon) => (geo.wrap ? ((((lon + 180) % 360) + 360) % 360) - 180 : lon);
    for (let lon = west; lon <= east; lon++) {
      if (lon % tickLon) continue;
      const px = x(lon);
      if (px <= F.x || px >= F.x + F.width) continue;
      const len = sc * (lon % labelLon === 0 ? 9 : 4);
      tick(px, F.y, px, F.y - len);
      tick(px, F.y + F.height, px, F.y + F.height + len);
      if (lon % labelLon === 0) {
        const fl = fold(lon);
        const label = Math.abs(fl) + '°' + (fl > 0 && fl < 180 ? 'E' : fl < 0 && fl > -180 ? 'W' : '');
        text(px, F.y - len - sc * 3, 'middle', label);
        text(px, F.y + F.height + len + sc * 3 + fs * 0.75, 'middle', label);
      }
    }
    for (let lat = south; lat <= north; lat++) {
      if (lat % tickLat) continue;
      const py = y(lat);
      if (py <= F.y || py >= F.y + F.height) continue;
      const len = sc * (lat % labelLat === 0 ? 9 : 4);
      tick(F.x, py, F.x - len, py);
      tick(F.x + F.width, py, F.x + F.width + len, py);
      if (lat % labelLat === 0) {
        const label = Math.abs(lat) + '°' + (lat > 0 ? 'N' : lat < 0 ? 'S' : '');
        text(F.x - len - sc * 3, py + fs * 0.35, 'end', label);
        text(F.x + F.width + len + sc * 3, py + fs * 0.35, 'start', label);
      }
    }
  }

  /**
   * A replacement legend, drawn over the one printed on the plate.
   *
   * Plates key their own vocabulary, which never quite matches the game's, so
   * rather than repaint the artwork the overlay covers that one panel and prints
   * the real terrains in the same space, along with the marks the plate does get
   * right. Each terrain's swatch is a hexagon — the shape the player is actually
   * matching against the board — with the terrain's letter code inside it, the
   * same letter printed in the bottom corner of every cell.
   */
  function buildLegend(map, palette, terrains) {
    const box = (map.plate.occlusions || []).filter((o) => o.id === 'legend')[0];
    if (!box) return null;
    const field = map.plate.field;
    const x = field.x + box.x * field.width;
    const y = field.y + box.y * field.height;
    const w = box.width * field.width;
    const h = box.height * field.height;

    const ink = palette.ink.soot.hex;
    const g = svg('g', { class: 'layer-legend' });
    const pad = w * 0.032;
    g.appendChild(svg('rect', { x, y, width: w, height: h, fill: '#EDE4D1', stroke: ink, 'stroke-width': w * 0.004 }));
    g.appendChild(svg('rect', {
      x: x + pad * 0.45, y: y + pad * 0.45, width: w - pad * 0.9, height: h - pad * 0.9,
      fill: 'none', stroke: ink, 'stroke-width': w * 0.0016, opacity: 0.55,
    }));

    const title = svg('text', {
      x: x + w / 2, y: y + pad * 1.5, 'text-anchor': 'middle',
      'font-size': h * 0.085, 'letter-spacing': h * 0.02, fill: ink, class: 'legend-title',
    });
    title.textContent = 'LEGEND';
    g.appendChild(title);

    const order = Object.keys(map.legend).filter((c) => c.charAt(0) !== '$');
    const top = y + pad * 2.3;
    const legendRows = Math.max(order.length, 11);
    const rowH = (h - (top - y) - pad * 1.1) / legendRows;
    const size = rowH * 0.62;
    const colW = (w - pad * 2) / 2;

    const label = (tx, ty, text, weight) => {
      const t = svg('text', { x: tx, y: ty, 'font-size': size * 0.82, fill: ink, class: 'legend-item' });
      if (weight) t.setAttribute('font-weight', weight);
      t.textContent = text;
      return t;
    };

    /* A small pointy-top hexagon, the shape the player is matching on the board. */
    const hexPoints = (cx, cy, r) => {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = ((60 * i - 90) * Math.PI) / 180;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
      }
      return pts.join(' ');
    };

    /* Left column: the terrains, in the order data/terrain.json lists them.
       Hexagon swatch, letter code inside, move cost at the column's right edge. */
    order.forEach((ch, i) => {
      const id = map.legend[ch];
      const ty = top + rowH * i;
      const sx = x + pad;
      const t = terrains[id] || {};
      const hcx = sx + size * 0.75;
      const hcy = ty + size * 0.5;
      const hr = size * 0.62;
      g.appendChild(svg('polygon', {
        points: hexPoints(hcx, hcy, hr),
        fill: (palette.terrain[id] || {}).wash || '#fff', stroke: ink, 'stroke-width': size * 0.05,
      }));
      if (t.code) {
        const codeLabel = svg('text', {
          x: hcx, y: hcy + size * 0.28, 'text-anchor': 'middle',
          'font-size': size * 0.72, fill: ink, class: 'legend-item', 'font-weight': 'bold',
        });
        codeLabel.textContent = t.code;
        g.appendChild(codeLabel);
      }
      g.appendChild(label(sx + size * 1.9, ty + size * 0.82, t.name || id));
      const cost = svg('text', {
        x: x + colW - pad * 0.4, y: ty + size * 0.82, 'text-anchor': 'end',
        'font-size': size * 0.7, fill: ink, opacity: 0.6, class: 'legend-item',
      });
      cost.textContent = t.moveCost === 99 ? 'boat' : `move ${t.moveCost}`;
      g.appendChild(cost);
    });

    /* Right column: everything on the plate that is not terrain. */
    const marks = [
      ['seat', 'Seat of the Reach'],
      ['city', 'Walled city'],
      ['town', 'Town'],
      ['village', 'Village'],
      ['harbour', 'Harbour'],
      ['road', 'Road'],
      ['rail', 'Railway'],
      ['shipping', 'Shipping route'],
      ['river', 'River'],
    ];
    const RANK_R = { seat: 1, city: 0.8, town: 0.6, village: 0.44 };
    const mx = x + pad + colW;
    marks.forEach(([kind, text], i) => {
      const ty = top + rowH * i;
      const cy = ty + size * 0.5;
      const cx = mx + size * 0.75;
      if (RANK_R[kind]) {
        g.appendChild(svg('circle', {
          cx, cy, r: size * 0.42 * RANK_R[kind], fill: '#EDE4D1', stroke: '#A33B26', 'stroke-width': size * 0.13,
        }));
      } else if (kind === 'harbour') {
        g.appendChild(svg('path', {
          d: `M${cx},${cy - size * 0.42} L${cx},${cy + size * 0.4} ` +
             `M${cx - size * 0.22},${cy - size * 0.22} L${cx + size * 0.22},${cy - size * 0.22} ` +
             `M${cx - size * 0.32},${cy + size * 0.08} Q${cx},${cy + size * 0.56} ${cx + size * 0.32},${cy + size * 0.08}`,
          fill: 'none', stroke: ink, 'stroke-width': size * 0.1, 'stroke-linecap': 'round',
        }));
      } else {
        const attrs = {
          x1: mx, y1: cy, x2: mx + size * 1.5, y2: cy,
          stroke: kind === 'road' ? '#8A561C' : kind === 'shipping' ? '#3C5A6E' : kind === 'river' ? '#3C5A6E' : ink,
          'stroke-width': size * (kind === 'rail' ? 0.24 : 0.14),
        };
        if (kind === 'shipping') attrs['stroke-dasharray'] = `${size * 0.3} ${size * 0.22}`;
        if (kind === 'rail') attrs['stroke-dasharray'] = `${size * 0.1} ${size * 0.1}`;
        g.appendChild(svg('line', attrs));
      }
      g.appendChild(label(mx + size * 1.9, ty + size * 0.82, text));
    });

    /* End-anchored on the panel's inner edge, so however the row height works out
       for a given terrain count the notes can never run past the border. */
    const noteAttrs = (row) => ({
      x: x + w - pad, y: top + rowH * row, 'text-anchor': 'end',
      'font-size': size * 0.6, fill: ink, opacity: 0.65, class: 'legend-item',
    });
    const note = svg('text', noteAttrs(legendRows - 1.4));
    note.textContent = `Hexes ${map.grid.cols} x ${map.grid.rows}, numbered column,row`;
    g.appendChild(note);
    const note2 = svg('text', noteAttrs(legendRows - 0.6));
    note2.textContent = `from 0,0 at the top left. ${map.grid.leaguesAcrossFlats} leagues across a hex.`;
    g.appendChild(note2);

    return g;
  }

  global.MapKit = { layoutFor, buildOverlay, buildLegend, terrainAt, neighbours, distance, svg, pointsOf, plateFile };
})(window);
