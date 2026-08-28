/*
 * The dependency graph: every thing in the game and every arrow between them.
 *
 * Nothing in here is a list of what depends on what. The nodes are the
 * collections data/graph.json declares to be things; the arrows are computed
 * from data/manifest.json references.checks — the same declarations
 * tools/validate-data.mjs enforces — so the graph can never know an edge the
 * validator does not check, and a change to any data file redraws it on the
 * next build with no edit here. An arrow points from the thing whose file
 * names the other at the thing it names: a job points at the ore it takes in,
 * the iron it puts out and the smelter it runs in alike, and the legend says so.
 *
 * This file is the one copy of the model, the layout and the renderer. The
 * explorer loads it as a script and draws the Graph tab live from the bundle;
 * tools/lib/graph.mjs loads it through a shim, the way framing.js is loaded,
 * so the interactive web and the SVG printed in the rulebook are one drawing
 * seen twice, never two drawings that agree today.
 *
 * The layout is a plain force simulation made deterministic on purpose: a
 * seeded generator for the scatter and nothing but arithmetic and sqrt in the
 * forces, so the committed SVG rebuilds byte-identical in CI and the web page
 * lays out the same way in every browser.
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------- the model */

  /** "peoples.professions" -> the array inside peoples.json; "recipes" -> recipes. */
  function resolveCollection(DATA, spec) {
    const [key, sub] = spec.split('.');
    const meta = DATA.manifest.datasets.find((d) => d.key === key);
    const file = DATA[key];
    if (!meta || !file) return null;
    const arr = sub ? file[sub] : file[meta.collection];
    return Array.isArray(arr) ? arr : null;
  }

  /** The check's arrow-tail kind: the dataset, unless the path roots in a
      sub-collection ("professions[].building" is an arrow out of a profession,
      not out of a people). */
  function sourceKind(DATA, check) {
    const root = check.path.split(/[.[]/)[0];
    const meta = DATA.manifest.datasets.find((d) => d.key === check.from);
    return meta && root === meta.collection ? check.from : check.from + '.' + root;
  }

  /** What to call the arrow: the path with the collection, the fan-outs and a
      redundant trailing field name stripped — "cost[].commodity" says "cost". */
  function relOf(check) {
    const segs = check.path.replace(/\[\]/g, '').split('.').slice(1);
    if (segs.length > 1 && ['commodity', 'commodities', 'item', 'items', 'building', 'tool'].includes(segs[segs.length - 1])) segs.pop();
    return segs.join('.');
  }

  /**
   * The graph: nodes for every entity of every kind data/graph.json names,
   * one edge per reference the manifest's checks find in the data, isolated
   * nodes dropped and counted. `only`, if given, is a Set of kind ids to keep.
   *
   * Returns { nodes, edges, kinds, isolated }:
   *   nodes: [{ uid, kind, id, name, degree }]
   *   edges: [{ a, b, rels }]           — uids; a's file names b
   *   kinds: [{ id, name, wash, variant, count, shown }]  — legend order
   */
  function build(DATA, only) {
    const declared = DATA.graph.nodes;
    const kept = declared.filter((k) => !only || only.has(k.id));
    const kindSet = new Set(kept.map((k) => k.id));

    /* Within a family, the Nth kind of an ink steps away from the pure colour
       so that jobs and tools can share oxide without sharing a dot. */
    const familySeen = {};
    const kinds = kept.map((k) => {
      familySeen[k.wash] = (familySeen[k.wash] || 0) + 1;
      return { id: k.id, name: k.name, wash: k.wash, variant: familySeen[k.wash] - 1, count: 0, shown: 0 };
    });
    const kindOf = new Map(kinds.map((k) => [k.id, k]));

    const uid = (kind, id) => kind + ':' + id;
    const nodesByUid = new Map();
    for (const k of kinds) {
      const arr = resolveCollection(DATA, k.id) || [];
      k.count = arr.length;
      for (const e of arr) {
        nodesByUid.set(uid(k.id, e.id), { uid: uid(k.id, e.id), kind: k.id, id: e.id, name: e.name || e.id, degree: 0 });
      }
    }

    /* Walk each check's dotted path with [] fan-out, remembering which
       top-level entity each landed value belongs to — the arrow's tail. */
    const edgeByPair = new Map();
    for (const check of DATA.manifest.references.checks) {
      const from = sourceKind(DATA, check);
      if (!kindSet.has(from) || !kindSet.has(check.to)) continue;
      const allow = new Set(check.allow || []);
      const rel = relOf(check);

      let cursor = [{ value: DATA[check.from], owner: null }];
      for (const part of check.path.split('.')) {
        const fanOut = part.endsWith('[]');
        const key = fanOut ? part.slice(0, -2) : part;
        const next = [];
        for (const node of cursor) {
          if (node.value == null || typeof node.value !== 'object') continue;
          const child = node.value[key];
          if (child == null) continue;
          if (fanOut) {
            if (!Array.isArray(child)) continue;
            for (const v of child) next.push({ value: v, owner: node.owner ?? (v && typeof v === 'object' && v.id ? v.id : null) });
          } else {
            next.push({ value: child, owner: node.owner });
          }
        }
        cursor = next;
      }

      for (const { value, owner } of cursor) {
        if (typeof value !== 'string' || allow.has(value) || !owner) continue;
        const a = nodesByUid.get(uid(from, owner));
        const b = nodesByUid.get(uid(check.to, value));
        if (!a || !b || a === b) continue;
        const pair = a.uid + '→' + b.uid;
        const existing = edgeByPair.get(pair);
        if (existing) {
          if (!existing.rels.includes(rel)) existing.rels.push(rel);
        } else {
          edgeByPair.set(pair, { a: a.uid, b: b.uid, rels: [rel] });
          a.degree++;
          b.degree++;
        }
      }
    }

    /* A thing nothing names and that names nothing is true, but it is not in
       the web — dropped from the drawing, counted for the legend's honesty. */
    let isolated = 0;
    const nodes = [];
    for (const n of nodesByUid.values()) {
      if (n.degree === 0) { isolated++; continue; }
      kindOf.get(n.kind).shown++;
      nodes.push(n);
    }

    return { nodes, edges: [...edgeByPair.values()], kinds, isolated };
  }

  /* ------------------------------------------------------------ the layout */

  /** Deterministic PRNG — bit arithmetic only, same stream everywhere. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Positions for every node: seeded scatter, then plain forces — spring along
   * every edge, charge between every pair, gravity to the centre — cooled over
   * a fixed number of steps. Arithmetic and sqrt only: no trig, so the result
   * is identical in every JS engine and the committed SVG diffs clean.
   *
   * Returns { pos: Map uid -> {x, y}, size } with all coordinates in 0..size.
   */
  function layout(model, opts) {
    const o = opts || {};
    const seed = o.seed === undefined ? 42 : o.seed;
    const iterations = o.iterations || 420;
    const n = model.nodes.length;
    if (!n) return { pos: new Map(), size: 100 };
    const size = o.size || Math.max(360, Math.round(Math.sqrt(n) * 78));
    const rand = mulberry32(seed);

    const idx = new Map();
    const px = new Float64Array(n);
    const py = new Float64Array(n);
    const dx = new Float64Array(n);
    const dy = new Float64Array(n);
    const deg = new Float64Array(n);
    model.nodes.forEach((node, i) => {
      idx.set(node.uid, i);
      deg[i] = node.degree;
      px[i] = size * (0.12 + 0.76 * rand());
      py[i] = size * (0.12 + 0.76 * rand());
    });
    const springs = model.edges.map((e) => [idx.get(e.a), idx.get(e.b)]);

    /* ForceAtlas2-style forces, chosen off a contact sheet of the classic
       alternatives: repulsion weighted by both degrees, so a hub clears the
       room its spokes need; linear attraction along every edge; gravity
       proportional to distance, which is what holds a two-node island near
       the shore instead of at the equilibrium of its own repulsion, somewhere
       past the edge of the page. A cooling cap bounds each step, and no walls —
       the finished shape is normalised into the canvas below, which keeps the
       picture organic instead of pressed flat against a frame. */
    const REPULSE = 22, ATTRACT = 0.02, GRAVITY = 0.035;
    const centre = size / 2;
    for (let iter = 0; iter < iterations; iter++) {
      const cool = 1 - iter / iterations;
      const heat = (size / 8) * cool * cool + 1;
      dx.fill(0); dy.fill(0);

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          let vx = px[i] - px[j], vy = py[i] - py[j];
          let d2 = vx * vx + vy * vy;
          if (d2 < 0.01) { vx = 0.1 + (i % 7) * 0.01; vy = 0.1 + (j % 5) * 0.01; d2 = vx * vx + vy * vy; }
          const f = REPULSE * (deg[i] + 1) * (deg[j] + 1) / d2;
          dx[i] += vx * f; dy[i] += vy * f;
          dx[j] -= vx * f; dy[j] -= vy * f;
        }
      }
      for (const [a, b] of springs) {
        const vx = (px[a] - px[b]) * ATTRACT, vy = (py[a] - py[b]) * ATTRACT;
        dx[a] -= vx; dy[a] -= vy;
        dx[b] += vx; dy[b] += vy;
      }
      for (let i = 0; i < n; i++) {
        dx[i] += (centre - px[i]) * GRAVITY;
        dy[i] += (centre - py[i]) * GRAVITY;
        const d = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) || 0.01;
        const step = d < heat ? d : heat;
        px[i] += (dx[i] / d) * step;
        py[i] += (dy[i] / d) * step;
      }
    }

    /* Fit what grew wherever it grew onto the page: one uniform scale, both
       axes centred, a margin wide enough for the widest label. */
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < n; i++) {
      if (px[i] < minX) minX = px[i]; if (px[i] > maxX) maxX = px[i];
      if (py[i] < minY) minY = py[i]; if (py[i] > maxY) maxY = py[i];
    }
    const margin = 34;
    const scale = Math.min(
      (size - 2 * margin) / Math.max(maxX - minX, 1),
      (size - 2 * margin) / Math.max(maxY - minY, 1)
    );
    const offX = (size - (maxX - minX) * scale) / 2;
    const offY = (size - (maxY - minY) * scale) / 2;

    const pos = new Map();
    model.nodes.forEach((node, i) => pos.set(node.uid, {
      x: (px[i] - minX) * scale + offX,
      y: (py[i] - minY) * scale + offY,
    }));
    return { pos, size };
  }

  /* ---------------------------------------------------------- the renderer */

  /** A node's radius: the web's one visual judgement, made once for the card
      window and the printed page alike. Degree buys area, on a leash. */
  function radiusOf(node) {
    return Math.min(4 + 2 * Math.sqrt(node.degree), 16);
  }

  /** How a kind's dot is inked, as a recipe the caller mixes: the pure ink for
      the first of a family, then steps toward soot or toward the paper. The
      fractions live here so the site and the book cannot ramp differently. */
  function washStep(variant) {
    return [
      { toward: null, frac: 0 },
      { toward: 'soot', frac: 0.38 },
      { toward: 'paper', frac: 0.42 },
      { toward: 'soot', frac: 0.6 },
    ][Math.min(variant, 3)];
  }

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const r2 = (v) => Math.round(v * 100) / 100;

  /**
   * The drawing, as an SVG string. One renderer for both faces of the graph:
   * tools/build-graph.mjs calls it with palette hexes and writes the file the
   * rulebook prints; the explorer calls it with CSS variables and injects it,
   * then wires pan, drag and the drawer on top of the same elements.
   *
   * opts.colors: { node: kindId -> fill, edge, text, textStrong, halo }
   * opts.legend: draw the legend + caption column (the book); the explorer
   *              draws its own legend as the filter bar instead.
   * opts.note:   caption lines under the legend, already worded by the caller.
   */
  function toSVG(model, laid, opts) {
    const { pos, size } = laid;
    const colors = opts.colors;
    const legendW = opts.legend ? Math.max(190, size * 0.16) : 0;
    const kindFill = (kind) => colors.node[kind];
    const byUid = new Map(model.nodes.map((n) => [n.uid, n]));

    const parts = [];
    const W = size + legendW;
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(W)} ${size}" font-family="Georgia, 'Times New Roman', serif"${opts.attrs || ''}>`);
    parts.push(`<defs><marker id="g-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8z" fill="${esc(colors.edge)}"/></marker></defs>`);
    if (opts.background) parts.push(`<rect width="${r2(W)}" height="${size}" fill="${esc(opts.background)}"/>`);

    parts.push(`<g class="g-edges" stroke="${esc(colors.edge)}" stroke-opacity="0.4" stroke-width="0.7" fill="none">`);
    for (const e of model.edges) {
      const a = pos.get(e.a), b = pos.get(e.b);
      const na = byUid.get(e.a), nb = byUid.get(e.b);
      const vx = b.x - a.x, vy = b.y - a.y;
      const d = Math.sqrt(vx * vx + vy * vy) || 1;
      /* stop at the rims so the arrowhead is a visible thing, not a buried one */
      const ra = radiusOf(na) + 1, rb = radiusOf(nb) + 2.5;
      if (d <= ra + rb) continue;
      const x1 = a.x + (vx / d) * ra, y1 = a.y + (vy / d) * ra;
      const x2 = b.x - (vx / d) * rb, y2 = b.y - (vy / d) * rb;
      parts.push(`<line data-a="${esc(e.a)}" data-b="${esc(e.b)}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" marker-end="url(#g-arrow)"><title>${esc(na.name)} — ${esc(e.rels.join(', '))} → ${esc(nb.name)}</title></line>`);
    }
    parts.push('</g>');

    parts.push(`<g class="g-nodes" stroke="${esc(colors.halo)}" stroke-width="0.8">`);
    for (const n of model.nodes) {
      const p = pos.get(n.uid);
      const r = radiusOf(n);
      const fs = Math.max(4.4, Math.min(3.6 + r * 0.5, 9));
      parts.push(
        `<g class="g-node" data-uid="${esc(n.uid)}" data-kind="${esc(n.kind)}" transform="translate(${r2(p.x)} ${r2(p.y)})">` +
          `<circle r="${r2(r)}" fill="${esc(kindFill(n.kind))}"/>` +
          `<text y="${r2(r + fs)}" text-anchor="middle" font-size="${r2(fs)}" fill="${esc(colors.text)}" stroke="${esc(colors.halo)}" stroke-width="${r2(fs * 0.22)}" paint-order="stroke" stroke-linejoin="round">${esc(n.name)}</text>` +
          `<title>${esc(n.name)} — ${esc(kindTitle(model, n.kind))}, ${n.degree} ${n.degree === 1 ? 'tie' : 'ties'}</title>` +
        '</g>'
      );
    }
    parts.push('</g>');

    if (opts.legend) {
      const x = size + 14;
      let y = 26;
      parts.push(`<g font-size="11" fill="${esc(colors.textStrong)}">`);
      parts.push(`<text x="${x}" y="${y}" font-size="14" font-weight="bold">${esc(opts.title || 'The web of things')}</text>`);
      y += 20;
      for (const k of model.kinds) {
        if (!k.shown) continue;
        parts.push(`<circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${esc(kindFill(k.id))}" stroke="${esc(colors.halo)}" stroke-width="0.8"/>`);
        parts.push(`<text x="${x + 16}" y="${y}">${esc(k.name)} × ${k.shown}</text>`);
        y += 16;
      }
      y += 10;
      for (const line of opts.note || []) {
        parts.push(`<text x="${x}" y="${y}" font-size="8.5" fill="${esc(colors.text)}">${esc(line)}</text>`);
        y += 12;
      }
      parts.push('</g>');
    }

    parts.push('</svg>');
    return parts.join('\n');
  }

  function kindTitle(model, kindId) {
    const k = model.kinds.find((x) => x.id === kindId);
    return k ? k.name.toLowerCase() : kindId;
  }

  global.Graph = { build, layout, toSVG, radiusOf, washStep };
})(window);
