/* The Atlas, as a game: how a ship and an airship cross the whole Earth.
 *
 * This is the ONE place the rules of moving on the Atlas are worked out, and both halves of the game
 * read it: tools/build-atlas.mjs loads it headless (through tools/lib/atlas.mjs, the way
 * tools/lib/framing.mjs loads framing.js) to sail the trade lanes it prints on the board, and the
 * explorer and the digital game load it in a browser to sail anything else. So a lane drawn on the
 * printed board and a voyage planned on a screen cannot disagree about what a crossing costs.
 *
 * It knows nothing about any one map. It is handed the board (data/maps/earth-atlas.json - its rows,
 * its ports, and the wind in every hex that tools/build-atlas.mjs wrote there) and the wind model
 * (data/earth/winds.json), and answers questions about them.
 *
 * The board wraps: column 23's east neighbour is column 0. Directions are numbered as everywhere else
 * in this repository (E, NE, NW, W, SW, SE), and a hex's wind is the way it blows TOWARD, as a compass
 * bearing with north up the board.
 */
(function (global) {
  'use strict';

  var DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];   // axial, odd-r: E NE NW W SW SE
  var BEARING = [90, 30, 330, 270, 210, 150];                          // the same six, as compass bearings
  var RAD = Math.PI / 180;

  /* ------------------------------------------------------------- the wind belts */

  /** Eastward wind (m/s) at a latitude, smooth between the profile's points. */
  function zonal(lat, points) {
    if (lat <= points[0][0]) return points[0][1];
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1], b = points[i];
      if (lat <= b[0]) {
        var t = (lat - a[0]) / (b[0] - a[0]);
        t = t * t * (3 - 2 * t);                        // smoothstep: no kinks where the belts change
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return points[points.length - 1][1];
  }

  /** Which named belt a latitude is in. */
  function beltAt(lat, belts) {
    for (var i = 0; i < belts.length; i++) if (lat >= belts[i].from && lat < belts[i].to) return belts[i];
    return belts[belts.length - 1];
  }

  /* ---------------------------------------------------------------- the cost */

  /**
   * What one step costs a sailing ship, in rounds, under the example rule in data/earth/winds.json.
   * wind = { bearing, speed }; dir = 0..5. A calm hex costs `calm` whichever way you go.
   */
  function stepCost(wind, dir, model) {
    var rule = model.exampleRule;
    if (!wind || wind.speed < model.calmBelowMs) return rule.calm;
    var f = Math.cos((BEARING[dir] - wind.bearing) * RAD);              // +1 downwind, -1 into it
    var share = Math.min(1, wind.speed / model.fullStrengthMs);
    var full = f >= 0 ? rule.across + (rule.withWind - rule.across) * f : rule.across + (rule.againstWind - rule.across) * -f;
    return rule.across + (full - rule.across) * share;
  }

  /* ---------------------------------------------------------------- the board */

  function create(map, model) {
    /* The board carries the numbers its own wind rule needs (tools/build-atlas.mjs copies them from
       data/earth/winds.json), so a page holding only the board can still sail it. */
    model = model || (map.atlas && map.atlas.winds && map.atlas.winds.rule);
    var cols = map.grid.cols, rows = map.grid.rows, wrap = !!map.grid.wrap;
    var geo = map.plate.geo;
    var water = {};
    (map.legend ? Object.keys(map.legend) : []).forEach(function (ch) {
      water[ch] = /water|river|lake/.test(map.legend[ch]);
    });
    var key = function (c, r) { return c + ',' + r; };
    var fold = function (c) { return wrap ? ((c % cols) + cols) % cols : c; };
    var inGrid = function (c, r) { return c >= 0 && r >= 0 && c < cols && r < rows; };

    var ports = {}, portAt = {};
    (map.settlements || []).forEach(function (s) { var p = {}; for (var f in s) p[f] = s[f]; ports[s.id] = p; portAt[key(s.col, s.row)] = p; });   // copies: the board is never written to
    /* What tools/build-atlas.mjs worked out about each port - where it really is, which board it opens
       onto - rides on the same record. */
    ((map.atlas && map.atlas.ports) || []).forEach(function (p) {
      var s = ports[p.id] || (ports[p.id] = {});
      for (var f in p) if (s[f] === undefined) s[f] = p[f];
    });
    var winds = {};
    ((map.atlas && map.atlas.winds && map.atlas.winds.hexes) || []).forEach(function (w) {
      winds[key(w[0], w[1])] = { bearing: w[2], speed: w[3], belt: w[4] };
    });

    function neighbours(c, r) {
      var q = c - (r - (r & 1)) / 2, out = [];
      for (var d = 0; d < 6; d++) {
        var nq = q + DIRS[d][0], nr = r + DIRS[d][1];
        var nc = fold(nq + (nr - (nr & 1)) / 2);
        if (inGrid(nc, nr)) out.push({ col: nc, row: nr, dir: d });
      }
      return out;
    }
    function isWater(c, r) { return !!water[map.rows[r][c]]; }
    /** A ship may be in a hex of water, or in a port: land is closed to it everywhere else. A port on land
        is a place to put in, not a way through - a voyage may start or end in one and never cross it, or
        a port on an isthmus would be a canal. */
    function shipMay(c, r) { return isWater(c, r) || !!portAt[key(c, r)]; }

    /** The middle of a hex, in degrees. */
    function latLonOf(c, r) {
      var lon = geo.lon0 + (c + 0.5 * (r & 1)) * geo.hexLon;
      if (wrap) lon = ((lon + 180) % 360 + 360) % 360 - 180;
      return { lat: geo.lat0 - r * geo.rowLat, lon: lon };
    }
    /** Which hex a place on the planet is in. */
    function hexOf(lat, lon) {
      var y = (geo.lat0 - lat) / geo.rowLat;                   // in rows
      var best = null, bestD = Infinity;
      var turns = wrap ? [0, 360, -360] : [0];
      for (var t = 0; t < turns.length; t++) {
        var x = (lon + turns[t] - geo.lon0) / geo.hexLon;          // in hex widths
        var r0 = Math.round(y);
        for (var r = r0 - 1; r <= r0 + 1; r++) {
          if (r < 0 || r >= rows) continue;
          var c0 = Math.round(x - 0.5 * (r & 1));
          for (var c = c0 - 1; c <= c0 + 1; c++) {
            if (c < 0 || c >= cols) continue;
            var dx = x - (c + 0.5 * (r & 1)), dy = (y - r) * 0.8660254;
            var d = dx * dx + dy * dy;
            if (d < bestD) { bestD = d; best = { col: c, row: r }; }
          }
        }
      }
      return best;
    }

    /** The cheapest voyage between two hexes, by the example rule. Returns { hexes, cost, rounds } or null. */
    function voyage(from, to, opts) {
      opts = opts || {};
      var startK = key(from.col, from.row), goalK = key(to.col, to.row);
      var dist = {}, prev = {}, done = {};
      dist[startK] = 0;
      var open = [[0, from.col, from.row]];
      while (open.length) {
        var bi = 0;
        for (var i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
        var cur = open.splice(bi, 1)[0], k = key(cur[1], cur[2]);
        if (done[k]) continue;
        done[k] = true;
        if (k === goalK) break;
        var w = winds[k];
        var ns = neighbours(cur[1], cur[2]);
        for (var n = 0; n < ns.length; n++) {
          var nb = ns[n], nk = key(nb.col, nb.row);
          if (done[nk] || !(isWater(nb.col, nb.row) || nk === goalK)) continue;
          var step = stepCost(w, nb.dir, model) * (opts.weight ? opts.weight(nb.col, nb.row) : 1);
          var nd = cur[0] + step;
          if (dist[nk] === undefined || nd < dist[nk]) { dist[nk] = nd; prev[nk] = k; open.push([nd, nb.col, nb.row]); }
        }
      }
      if (dist[goalK] === undefined) return null;
      var hexes = [];
      for (var at = goalK; at; at = prev[at]) hexes.unshift(at.split(',').map(Number));
      /* Rounds are sailed on the plain rule, not the weighted one a lane-drawer may lean on. */
      var cost = 0;
      for (var s = 1; s < hexes.length; s++) {
        var a = hexes[s - 1], dir = neighbours(a[0], a[1]).filter(function (q) { return q.col === hexes[s][0] && q.row === hexes[s][1]; })[0].dir;
        cost += stepCost(winds[key(a[0], a[1])], dir, model);
      }
      var moves = (map.atlas && map.atlas.moves && map.atlas.moves.ship) || 1;
      return { hexes: hexes, cost: Math.round(cost * 100) / 100, rounds: Math.ceil(cost / moves - 1e-9) };
    }

    /** Points along the great circle between two places: the airship's way. */
    function greatCircle(a, b, n) {
      var p1 = a.lat * RAD, l1 = a.lon * RAD, p2 = b.lat * RAD, l2 = b.lon * RAD;
      var d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((p2 - p1) / 2), 2) + Math.cos(p1) * Math.cos(p2) * Math.pow(Math.sin((l2 - l1) / 2), 2)));
      var out = [];
      for (var i = 0; i <= n; i++) {
        var f = i / n, A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
        var x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2);
        var y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2);
        var z = A * Math.sin(p1) + B * Math.sin(p2);
        out.push({ lat: Math.atan2(z, Math.sqrt(x * x + y * y)) / RAD, lon: Math.atan2(y, x) / RAD });
      }
      return { points: out, km: d * 6371.0088 };
    }

    /** An airship flies the great circle over land and sea alike, two hexes a round. */
    function airship(fromId, toId) {
      var a = ports[fromId], b = ports[toId];
      var pa = a && a.lat !== undefined ? a : latLonOf(a.col, a.row), pb = b && b.lat !== undefined ? b : latLonOf(b.col, b.row);
      var gc = greatCircle(pa, pb, 400), hexes = [];
      gc.points.forEach(function (p) {
        var h = hexOf(p.lat, p.lon);
        var last = hexes[hexes.length - 1];
        if (h && (!last || last[0] !== h.col || last[1] !== h.row)) hexes.push([h.col, h.row]);
      });
      /* A great circle can clip the corner where three hexes meet and jump a hex; fill the gap with the
         neighbour that shares both, so the route is a chain a token can walk. */
      var chain = [hexes[0]];
      for (var i = 1; i < hexes.length; i++) {
        var p = chain[chain.length - 1], q = hexes[i];
        var adj = neighbours(p[0], p[1]);
        if (!adj.some(function (n) { return n.col === q[0] && n.row === q[1]; })) {
          var mid = adj.filter(function (n) { return neighbours(n.col, n.row).some(function (m) { return m.col === q[0] && m.row === q[1]; }); })[0];
          if (mid) chain.push([mid.col, mid.row]);
        }
        chain.push(q);
      }
      var moves = (map.atlas && map.atlas.moves && map.atlas.moves.airship) || 2;
      return { hexes: chain, km: Math.round(gc.km), rounds: Math.ceil((chain.length - 1) / moves), points: gc.points };
    }

    return {
      cols: cols, rows: rows, wrap: wrap, neighbours: neighbours, isWater: isWater, shipMay: shipMay,
      latLonOf: latLonOf, hexOf: hexOf, port: function (id) { return ports[id]; }, portAt: function (c, r) { return portAt[key(c, r)]; },
      windAt: function (c, r) { return winds[key(c, r)]; },
      stepCost: function (c, r, dir) { return stepCost(winds[key(c, r)], dir, model); },
      voyage: voyage, airship: airship, greatCircle: greatCircle,
    };
  }

  global.Atlas = { create: create, zonal: zonal, beltAt: beltAt, stepCost: stepCost, BEARING: BEARING, DIRS: DIRS };
})(typeof window !== 'undefined' ? window : this);
