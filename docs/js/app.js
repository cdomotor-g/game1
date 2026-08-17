/* Boot, tab routing, search and the detail drawer. */
(function (global) {
  'use strict';

  const { el, clear } = global.UI;
  const D = global.GameData;

  const TABS = [
    ['overview', 'Overview'],
    ['sandbox', 'Sandbox'],
    ['chains', 'Chains'],
    ['commodities', 'Commodities'],
    ['recipes', 'Recipes'],
    ['buildings', 'Buildings'],
    ['tools', 'Tools'],
    ['terrain', 'Terrain'],
    ['maps', 'Maps'],
    ['transport', 'Transport'],
    ['adventure', 'Adventure'],
    ['events', 'Events'],
    ['items', 'Equipment'],
    ['peoples', 'Peoples'],
    ['rules', 'Rules'],
  ];

  const app = { tab: 'overview', query: '' };

  /* --------------------------------------------------------------- drawer */

  const drawer = document.getElementById('drawer');
  const drawerBody = document.getElementById('drawer-body');
  const history = [];

  function openDetail(kind, id, isBack) {
    const entry = D.byId[kind] && D.byId[kind].get(id);
    if (!entry) return;
    if (!isBack) history.push([kind, id]);

    const build = Views.detail[kind];
    clear(drawerBody);
    if (history.length > 1) {
      drawerBody.appendChild(el('button.btn.small', {
        style: 'margin-bottom:10px',
        onclick: () => { history.pop(); const [k, i] = history[history.length - 1]; openDetail(k, i, true); },
      }, '← Back'));
    }
    UI.append(drawerBody, build ? build(entry) : [el('h2', entry.name || id)]);
    drawer.hidden = false;
    drawerBody.scrollTop = 0;
  }

  function closeDrawer() {
    drawer.hidden = true;
    history.length = 0;
  }

  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });

  Views.setOpener(openDetail);

  /* ------------------------------------------------------------- nav tray */

  const tray = document.getElementById('nav-tray');
  const trayScrim = document.getElementById('nav-scrim');
  const trayToggle = document.getElementById('nav-toggle');

  function trayOpen() {
    return tray.classList.contains('open');
  }

  function openTray() {
    if (trayOpen()) return;
    tray.classList.add('open');
    trayScrim.classList.add('open');
    trayToggle.setAttribute('aria-expanded', 'true');
    trayToggle.setAttribute('aria-label', 'Close menu');
    const selected = tray.querySelector('.tab[aria-selected="true"]') || tray.querySelector('.tab');
    if (selected) selected.focus();
  }

  function closeTray(restoreFocus) {
    if (!trayOpen()) return;
    if (restoreFocus && tray.contains(document.activeElement)) trayToggle.focus();
    tray.classList.remove('open');
    trayScrim.classList.remove('open');
    trayToggle.setAttribute('aria-expanded', 'false');
    trayToggle.setAttribute('aria-label', 'Open menu');
  }

  trayToggle.addEventListener('click', () => { trayOpen() ? closeTray(true) : openTray(); });
  document.getElementById('nav-close').addEventListener('click', () => closeTray(true));
  trayScrim.addEventListener('click', () => closeTray(true));

  /* Keep Tab cycling inside the tray while it is open. */
  tray.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !trayOpen()) return;
    const stops = tray.querySelectorAll('button, [href], input, select, textarea');
    if (!stops.length) return;
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (trayOpen()) closeTray(true);      /* the tray sits above the drawer */
    else if (!drawer.hidden) closeDrawer();
  });

  /* -------------------------------------------------------------- routing */

  function go(tab) {
    app.tab = tab;
    if (location.hash.slice(1) !== tab) location.hash = tab;
    closeTray(false);
    render();
    document.getElementById('view').focus();
  }

  function searchResults(query) {
    const groups = D.search(query);
    if (!groups.length) return el('p.empty', `Nothing matches “${query}”.`);
    return el('div', [
      Views.pageHead(`Search: ${query}`, `${groups.reduce((n, g) => n + g.hits.length, 0)} matches across the dataset.`),
      groups.map((g) => el('div.panel', [
        el('h3', g.label, el('span.count', String(g.hits.length))),
        el('div.linklist', g.hits.slice(0, 24).map((h) =>
          el('button.linkrow', { type: 'button', onclick: () => openDetail(g.kind, h.id) }, [
            el('strong', h.name || h.id),
            el('div.lr-sub', h.summary || h.text || h.notes || h.id),
          ])
        )),
      ])),
    ]);
  }

  function render() {
    const host = document.getElementById('view');
    clear(host);

    if (app.query && app.tab !== 'sandbox') {
      host.appendChild(searchResults(app.query));
    } else if (app.tab === 'sandbox') {
      host.appendChild(Sandbox.view());
    } else {
      const view = Views.views[app.tab] || Views.views.overview;
      host.appendChild(view(app.query));
    }

    for (const btn of document.querySelectorAll('.tab')) {
      btn.setAttribute('aria-selected', btn.dataset.tab === app.tab ? 'true' : 'false');
    }
  }

  /* ----------------------------------------------------------------- boot */

  const tabsHost = document.getElementById('tabs');
  for (const [id, label] of TABS) {
    tabsHost.appendChild(el('button.tab', {
      type: 'button', role: 'tab', dataset: { tab: id },
      'aria-selected': 'false',
      onclick: () => go(id),
    }, label));
  }

  const search = document.getElementById('global-search');
  let debounce;
  search.addEventListener('input', (e) => {
    clearTimeout(debounce);
    const value = e.target.value.trim();
    debounce = setTimeout(() => { app.query = value; render(); }, 120);
  });

  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : current === 'light' ? '' : 'dark';
    if (next) document.documentElement.dataset.theme = next;
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('game1-theme', next); } catch (err) { /* private mode */ }
  });
  try {
    const saved = localStorage.getItem('game1-theme');
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (err) { /* ignore */ }

  window.addEventListener('hashchange', () => {
    const tab = location.hash.slice(1);
    if (TABS.some(([id]) => id === tab)) { app.tab = tab; closeTray(false); render(); }
  });

  document.getElementById('footer-stats').textContent =
    `${D.commodities.length} commodities · ${D.recipes.length} recipes · ${D.buildings.length} buildings · ` +
    `${D.tools.length} tools · ${D.cards.length} event cards · data v${D.raw.manifest.version}`;

  const initial = location.hash.slice(1);
  if (TABS.some(([id]) => id === initial)) app.tab = initial;

  global.App = { render, go, openDetail, state: app };
  render();
})(window);
