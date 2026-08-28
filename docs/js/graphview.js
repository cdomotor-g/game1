/*
 * The Graph tab: the dependency web, live.
 *
 * The model, the layout and the SVG come from docs/js/graph.js — the same
 * three calls tools/build-graph.mjs makes to draw the copy the rulebook
 * prints — computed here from the bundle at view time, so editing data/ and
 * rerunning build-data redraws this page with no further step. What this file
 * adds is only what a printed page cannot do: pan, zoom, drag, hovering a
 * thing to see its neighbourhood, clicking it to open its drawer, and turning
 * whole kinds of thing off to see the web that remains.
 */
(function (global) {
  'use strict';

  const { el } = global.UI;
  const G = global.Graph;
  const DATA = global.GAME_DATA;

  /* Which detail drawer a dot opens — presentation wiring, so it lives here
     with the view. A kind with no entry simply opens nothing. */
  const DRAWER_KIND = {
    'commodities': 'commodity', 'pricing': 'pricing', 'tools': 'tool',
    'buildings': 'building', 'recipes': 'recipe', 'terrain': 'terrain',
    'deposits': 'deposit', 'transport': 'mode', 'transport.figures': 'figure',
    'peoples': 'people', 'peoples.professions': 'profession', 'items': 'item',
    'monsters': 'monster', 'vehicles': 'vehicle', 'characters': 'character',
    'quests': 'quest', 'modifications': 'modification', 'arcana.elements': 'element',
  };

  const state = { off: new Set() };
  const cache = new Map();   // filter signature -> { model, laid }

  function computed() {
    const sig = [...state.off].sort().join(',');
    if (!cache.has(sig)) {
      const only = new Set(DATA.graph.nodes.map((n) => n.id).filter((id) => !state.off.has(id)));
      const model = G.build(DATA, only);
      cache.set(sig, { model, laid: G.layout(model) });
    }
    return cache.get(sig);
  }

  /* The same wash recipe the printed copy mixes from palette hexes, mixed here
     from the CSS custom properties, so a dot is one colour in both places. */
  function nodeColors(model) {
    const out = {};
    for (const k of model.kinds) {
      const step = G.washStep(k.variant);
      const ink = `var(--p-${k.wash})`;
      out[k.id] = step.toward
        ? `color-mix(in srgb, ${ink} ${Math.round((1 - step.frac) * 100)}%, var(--p-${step.toward === 'soot' ? 'soot' : 'tallow'}))`
        : ink;
    }
    return out;
  }

  /* ------------------------------------------------- pan, zoom, drag, hover */

  function wire(stage, model, laid) {
    const svg = stage.querySelector('svg');
    if (!svg) return;
    const size = laid.size;
    const vb = { x: 0, y: 0, w: size, h: size };
    const apply = () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    /* live positions — a copy, so Reset can fall back to the cached layout */
    const pos = new Map();
    laid.pos.forEach((p, uid) => pos.set(uid, { x: p.x, y: p.y }));
    const byUid = new Map(model.nodes.map((n) => [n.uid, n]));

    const nodeEls = new Map();
    for (const g of svg.querySelectorAll('.g-node')) nodeEls.set(g.dataset.uid, g);
    const incident = new Map();      // uid -> [line, ...]
    const neighbours = new Map();    // uid -> Set of uids
    for (const line of svg.querySelectorAll('.g-edges line')) {
      for (const uid of [line.dataset.a, line.dataset.b]) {
        if (!incident.has(uid)) incident.set(uid, []);
        incident.get(uid).push(line);
        if (!neighbours.has(uid)) neighbours.set(uid, new Set());
      }
      neighbours.get(line.dataset.a).add(line.dataset.b);
      neighbours.get(line.dataset.b).add(line.dataset.a);
    }

    const toSvg = (e) => {
      const r = svg.getBoundingClientRect();
      return { x: vb.x + ((e.clientX - r.left) / r.width) * vb.w, y: vb.y + ((e.clientY - r.top) / r.height) * vb.h };
    };

    /* endpoints stop at the rims, exactly as toSVG drew them */
    function redrawEdge(line) {
      const a = pos.get(line.dataset.a), b = pos.get(line.dataset.b);
      const na = byUid.get(line.dataset.a), nb = byUid.get(line.dataset.b);
      const vx = b.x - a.x, vy = b.y - a.y;
      const d = Math.sqrt(vx * vx + vy * vy) || 1;
      const ra = G.radiusOf(na) + 1, rb = G.radiusOf(nb) + 2.5;
      if (d <= ra + rb) { line.style.display = 'none'; return; }
      line.style.display = '';
      line.setAttribute('x1', a.x + (vx / d) * ra); line.setAttribute('y1', a.y + (vy / d) * ra);
      line.setAttribute('x2', b.x - (vx / d) * rb); line.setAttribute('y2', b.y - (vy / d) * rb);
    }

    let lit = [];
    function light(uid) {
      svg.classList.add('focus');
      const on = (elm) => { elm.classList.add('hi'); lit.push(elm); };
      on(nodeEls.get(uid));
      for (const n of neighbours.get(uid) || []) if (nodeEls.has(n)) on(nodeEls.get(n));
      for (const line of incident.get(uid) || []) on(line);
    }
    function dark() {
      svg.classList.remove('focus');
      for (const elm of lit) elm.classList.remove('hi');
      lit = [];
    }
    svg.addEventListener('pointerover', (e) => {
      const g = e.target.closest('.g-node');
      if (g) { dark(); light(g.dataset.uid); }
    });
    svg.addEventListener('pointerout', (e) => {
      if (e.target.closest('.g-node') && !svg.contains(e.relatedTarget && e.relatedTarget.closest('.g-node'))) dark();
    });

    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const at = toSvg(e);
      const f = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const w = Math.min(Math.max(vb.w * f, size / 20), size * 3);
      const scale = w / vb.w;
      vb.x = at.x - (at.x - vb.x) * scale;
      vb.y = at.y - (at.y - vb.y) * scale;
      vb.w = w; vb.h = vb.h * scale;
      apply();
    }, { passive: false });

    let gesture = null;   // { kind: 'pan'|'node', ... }
    svg.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const g = e.target.closest('.g-node');
      gesture = {
        kind: g ? 'node' : 'pan',
        uid: g ? g.dataset.uid : null,
        fromX: e.clientX, fromY: e.clientY,
        vbX: vb.x, vbY: vb.y,
        moved: false,
      };
      if (g) { const p = pos.get(g.dataset.uid); gesture.nodeX = p.x; gesture.nodeY = p.y; }
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', (e) => {
      if (!gesture) return;
      const r = svg.getBoundingClientRect();
      const ddx = ((e.clientX - gesture.fromX) / r.width) * vb.w;
      const ddy = ((e.clientY - gesture.fromY) / r.height) * vb.h;
      if (!gesture.moved && Math.abs(e.clientX - gesture.fromX) + Math.abs(e.clientY - gesture.fromY) < 4) return;
      gesture.moved = true;
      if (gesture.kind === 'pan') {
        vb.x = gesture.vbX - ddx; vb.y = gesture.vbY - ddy;
        apply();
      } else {
        const p = pos.get(gesture.uid);
        p.x = gesture.nodeX + ddx; p.y = gesture.nodeY + ddy;
        nodeEls.get(gesture.uid).setAttribute('transform', `translate(${p.x} ${p.y})`);
        for (const line of incident.get(gesture.uid) || []) redrawEdge(line);
      }
    });
    svg.addEventListener('pointerup', (e) => {
      if (!gesture) return;
      if (!gesture.moved && gesture.kind === 'node') {
        const node = byUid.get(gesture.uid);
        const kind = DRAWER_KIND[node.kind];
        if (kind) global.App.openDetail(kind, node.id);
      }
      gesture = null;
    });
    svg.addEventListener('pointercancel', () => { gesture = null; });

    apply();
  }

  /* --------------------------------------------------------------- the view */

  global.Views.views.graph = function () {
    const { model, laid } = computed();
    const whole = state.off.size ? G.build(DATA) : model;   // counts for the chips

    const svgMarkup = G.toSVG(model, laid, {
      colors: {
        node: nodeColors(model),
        edge: 'var(--ink-faint)',
        text: 'var(--ink-soft)',
        textStrong: 'var(--ink)',
        halo: 'var(--bg)',
      },
      legend: false,
    });

    const chips = DATA.graph.nodes.map((decl) => {
      const k = whole.kinds.find((x) => x.id === decl.id);
      const off = state.off.has(decl.id);
      return el('button.graph-chip' + (off ? '.off' : ''), {
        type: 'button',
        title: off ? `Show every ${decl.name.toLowerCase()}` : `Hide every ${decl.name.toLowerCase()}`,
        onclick: () => {
          if (off) state.off.delete(decl.id); else state.off.add(decl.id);
          global.App.render();
        },
      }, [
        el('span.graph-swatch', { style: `background:${nodeColors(whole)[decl.id]}` }),
        `${decl.name} × ${k ? k.shown : 0}`,
      ]);
    });

    const stage = el('div.graph-stage.panel');
    stage.innerHTML = svgMarkup;
    wire(stage, model, laid);

    return el('div', [
      Views.pageHead('The web of things',
        'Every thing in the game and every arrow between them, computed from the same cross-file references the validator checks — ' +
        'edit data/, rebuild the bundle, and this redraws itself. Drag a dot, scroll to zoom, hover for a neighbourhood, click for the drawer.'),
      el('div.toolbar.graph-toolbar', [...chips, el('button.btn.small', { type: 'button', onclick: () => { cache.clear(); global.App.render(); } }, 'Reset view')]),
      stage,
      el('p.hint.graph-note',
        `${model.nodes.length} things and ${model.edges.length} ties drawn; ${model.isolated} with no ties are not. ` +
        'An arrow points from the thing whose data names the other, at the thing it names. ' +
        'The rulebook prints this same drawing from docs/art/graph/dependencies.svg.'),
    ]);
  };
})(window);
