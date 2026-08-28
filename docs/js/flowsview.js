/*
 * The Flows tab: the flows of work, live.
 *
 * The model and the renderer come from docs/js/flows.js — the same two calls
 * tools/build-flows.mjs makes to draw the copies the annex prints — computed
 * here from the bundle, so editing data/ and rerunning build-data redraws
 * every diagram. What this file adds is the furniture: a jump menu over the
 * 40-odd workplaces, and every token clickable through to its drawer.
 */
(function (global) {
  'use strict';

  const { el } = global.UI;
  const F = global.Flows;
  const G = global.Graph;
  const DATA = global.GAME_DATA;

  let built = null;
  const model = () => (built = built || F.build(DATA));

  /* The same wash recipe the printed copies mix from palette hexes — see
     tools/build-flows.mjs — mixed here from the CSS custom properties. */
  function colors() {
    const wash = {};
    const fill = {};
    const familySeen = {};
    for (const node of DATA.graph.nodes) {
      familySeen[node.wash] = (familySeen[node.wash] || 0) + 1;
      const step = G.washStep(familySeen[node.wash] - 1);
      const ink = `var(--p-${node.wash})`;
      wash[node.id] = step.toward
        ? `color-mix(in srgb, ${ink} ${Math.round((1 - step.frac) * 100)}%, var(--p-${step.toward === 'soot' ? 'soot' : 'tallow'}))`
        : ink;
      fill[node.id] = `color-mix(in srgb, ${wash[node.id]} 14%, var(--bg))`;
    }
    return {
      wash, fill,
      text: 'var(--ink)',
      soft: 'var(--ink-soft)',
      faint: 'var(--ink-faint)',
      rule: 'var(--line)',
      arrow: 'var(--ink-faint)',
    };
  }

  global.Views.views.flows = function () {
    const { diagrams } = model();
    const C = colors();

    const stage = el('div.flow-stage');
    for (const d of diagrams) {
      const panel = el('div.panel.flow-panel', { id: 'flow-' + d.id });
      panel.innerHTML = F.toSVG(d, { colors: C });
      stage.appendChild(panel);
    }

    /* one click handler for every token in every diagram */
    stage.addEventListener('click', (e) => {
      const t = e.target.closest('.f-token');
      if (!t) return;
      const kind = global.Views.drawerKindOf[t.dataset.kind];
      if (kind) global.App.openDetail(kind, t.dataset.id);
    });

    return el('div', [
      Views.pageHead('The flows of work',
        'One diagram per place of work, everything unrelated removed: what goes in on the left — with where it comes from ' +
        'written under it — the job in the middle with its hours, tool and specialist, and what comes out on the right. ' +
        'Click anything for its drawer. The annex prints these same diagrams.'),
      el('div.toolbar', [
        el('label', { for: 'flow-jump', style: 'font-size:13px;color:var(--ink-soft)' }, 'Go to:'),
        el('select#flow-jump', {
          onchange: (e) => {
            const t = document.getElementById('flow-' + e.target.value);
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        }, diagrams.map((d) => el('option', { value: d.id }, d.title))),
      ]),
      stage,
      el('p.hint.graph-note',
        `${diagrams.length} workplaces, ${diagrams.reduce((n, d) => n + d.rows.length, 0)} flows, computed from the data — ` +
        'edit data/, rebuild the bundle, and every diagram redraws. The web of things on the Graph tab shows the same ties all at once.'),
    ]);
  };
})(window);
