/* The Law of the Land's page script, inlined by tools/build-law.mjs.

   Three jobs. GO TO: a rule number, a leaf code or a Part, typed into the bar.
   PRINT: choose leaves - what changed since an amendment a reader last filed,
   one Part, a list of codes, or everything - and print only those. And a check
   on screen that no leaf holds more than its sheet.

   Printing takes every leaf not chosen OUT of the page, leaving a comment where
   it stood, loads the pictures left on the page, and only then opens the print
   dialog; it is the way The Almanac learned to print a part of itself
   (tools/lib/book-print.js), for the same reasons: hiding with a print
   stylesheet and trusting `afterprint` to undo it printed blank pages, and a
   lazy picture far down the page was never fetched. The print view stays until
   the reader leaves it. `?print=4-3,9-2` opens it from a link; `&now` stops it
   calling the dialog, for a headless browser printing to PDF. */
(() => {
  const data = JSON.parse(document.getElementById('law-data').textContent);
  const $ = (id) => document.getElementById(id);
  const leafEls = () => [...document.querySelectorAll('section.leaf')];
  const dash = (id) => id.replace('-', '–');
  const fmt = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const norm = (s) => s.trim().replace(/[–—]/g, '-').replace(/^§\s*/, '').replace(/\s+/g, '');

  /* ---------------------------------------------------------------- go to */
  function flash(el) {
    const leaf = el.closest('.leaf');
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (leaf) { leaf.classList.add('hit'); setTimeout(() => leaf.classList.remove('hit'), 2400); }
  }
  function go(raw) {
    const q = norm(raw).replace(/[a-z]+$/i, (m) => (/^\d+(\.\d+)+/.test(raw.trim()) ? m.toUpperCase() : m.toLowerCase()));
    const msg = $('jump-msg');
    msg.textContent = '';
    if (!q) return;
    let el = null;
    if (/^\d+-\d+[a-z]*$/i.test(q)) el = $(`leaf-${q.toLowerCase()}`);
    else if (/^\d+$/.test(q)) el = $(`part-${q}`) || (q === '0' ? $('leaf-0-1') : null);
    else el = $(`s${q}`);
    if (el) { flash(el); history.replaceState(null, '', `#${el.id}`); } else msg.textContent = `No ${q} in this edition`;
  }
  $('jump').addEventListener('submit', (e) => { e.preventDefault(); go($('jump-to').value); });

  /* --------------------------------------------------------- what to print */
  const since = $('since');
  const optSince = [{ n: 0, label: `the original issue (${fmt(data.edition.date)})` }, ...data.amendments.map((a) => ({ n: a.n, label: `Amendment ${a.n} (${fmt(a.date)})` }))];
  /* the newest is listed but means "nothing since"; the default is the one before it */
  since.innerHTML = optSince.map((o) => `<option value="${o.n}">${o.label}</option>`).join('');
  since.value = String(optSince.length > 1 ? optSince[optSince.length - 2].n : 0);
  $('part').innerHTML = [{ num: 0, title: 'Preliminary — title, record, contents' }, ...data.parts].map((p) => `<option value="${p.num}">${p.num ? `Part ${p.num} — ` : ''}${p.title}</option>`).join('');
  /* with nothing amended yet, the only thing worth printing is the whole book */
  if (!data.amendments.length) document.querySelector('input[value="all"]').checked = true;
  const choice = () => document.querySelector('input[name="what"]:checked').value;
  const all = data.leaves.map((l) => l.id);
  function picked() {
    const c = choice();
    if (c === 'all') return { ids: all, out: [] };
    if (c === 'part') return { ids: data.leaves.filter((l) => String(l.part) === $('part').value).map((l) => l.id), out: [] };
    if (c === 'leaves') {
      const want = $('leaves').value.split(/[\s,;]+/).map(norm).filter(Boolean).map((s) => s.toLowerCase());
      return { ids: all.filter((id) => want.includes(id)), out: [], unknown: want.filter((w) => !all.includes(w)) };
    }
    const n = Number(since.value);
    const ids = data.leaves.filter((l) => l.since > n).map((l) => l.id);
    const out = [...new Set(data.amendments.filter((a) => a.n > n).flatMap((a) => a.withdrawn ?? []))].filter((id) => !all.includes(id));
    return { ids, out };
  }
  function show() {
    const p = picked();
    const sheets = p.ids.length;
    let html = sheets ? `<b>${sheets} lea${sheets === 1 ? 'f' : 'ves'}</b> — ${sheets} sheet${sheets === 1 ? '' : 's'} of A4.<br><span class="codes">${p.ids.map(dash).join(', ')}</span>` : '<b>Nothing to print.</b>';
    if (p.out?.length) html += `<br><span class="out">Take out of the binder: ${p.out.map(dash).join(', ')}</span>`;
    if (p.unknown?.length) html += `<br><span class="out">Not in this edition: ${p.unknown.join(', ')}</span>`;
    $('picked').innerHTML = html;
    $('do-print').disabled = !sheets;
  }
  document.querySelectorAll('input[name="what"]').forEach((r) => r.addEventListener('change', show));
  since.addEventListener('change', () => { document.querySelector('input[value="since"]').checked = true; show(); });
  $('part').addEventListener('change', () => { document.querySelector('input[value="part"]').checked = true; show(); });
  $('leaves').addEventListener('input', () => { document.querySelector('input[value="leaves"]').checked = true; show(); });

  /* the record and the schedule, for checking a binder against */
  $('record').innerHTML = data.amendments.length
    ? data.amendments.slice().reverse().map((a) => `<div class="amd"><b>Amendment ${a.n}</b> — ${fmt(a.date)}<br>Reissued: ${a.leaves.map(dash).join(', ') || 'none'}${a.withdrawn?.length ? `<br>Withdrawn: ${a.withdrawn.map(dash).join(', ')}` : ''}<ul>${a.changes.map(([num, what, x]) => `<li><b>${num}</b> ${what}${x ? ` — ${x.replace(/</g, '&lt;')}…` : ''}</li>`).join('')}</ul></div>`).join('')
    : `<p>No amendments yet: every leaf is the original issue of edition ${data.edition.n}.</p>`;
  $('schedule').innerHTML = `<table><thead><tr><th>Leaf</th><th>Issue</th><th>Stamp</th></tr></thead><tbody>${data.leaves.map((l) => `<tr><td><a href="#leaf-${l.id}">${dash(l.id)}</a></td><td>${l.since ? `Amendment ${l.since}` : 'Original'}</td><td><b>${l.stamp}</b></td></tr>`).join('')}</tbody></table>`;

  const panel = $('panel');
  const open = () => { show(); panel.hidden = false; };
  const close = () => { panel.hidden = true; };
  $('open-print').addEventListener('click', open);
  $('close-print').addEventListener('click', close);
  panel.addEventListener('click', (e) => { if (e.target === panel) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
    /* Ctrl+P outside the print view opens the panel rather than printing every leaf */
    if ((e.ctrlKey || e.metaKey) && e.key === 'p' && $('printbar').hidden) { e.preventDefault(); open(); }
  });

  /* ------------------------------------------------------------ print view */
  const taken = [];
  function enter(ids, { now = false } = {}) {
    leave();
    const keep = new Set(ids);
    for (const el of leafEls()) {
      if (keep.has(el.dataset.leaf)) continue;
      const mark = document.createComment(`leaf ${el.dataset.leaf}`);
      el.replaceWith(mark);
      taken.push([mark, el]);
    }
    close();
    $('printbar').hidden = false;
    $('pb-what').textContent = `Print view: ${ids.length} lea${ids.length === 1 ? 'f' : 'ves'} — ${ids.map(dash).join(', ')}`;
    const imgs = [...document.querySelectorAll('section.leaf img')];
    imgs.forEach((i) => { i.loading = 'eager'; });
    const status = $('pb-status');
    status.textContent = imgs.length ? 'Loading pictures…' : '';
    const wait = imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((ok) => { i.addEventListener('load', ok, { once: true }); i.addEventListener('error', ok, { once: true }); })));
    Promise.race([Promise.all(wait), new Promise((ok) => setTimeout(ok, 15000))]).then(() => {
      status.textContent = '';
      window.scrollTo(0, 0);
      if (!now) window.print();
    });
  }
  function leave() {
    while (taken.length) { const [mark, el] = taken.pop(); mark.replaceWith(el); }
    $('printbar').hidden = true;
  }
  $('do-print').addEventListener('click', () => { const p = picked(); if (p.ids.length) enter(p.ids); });
  $('pb-print').addEventListener('click', () => window.print());
  $('pb-back').addEventListener('click', () => { leave(); history.replaceState(null, '', location.pathname); });

  const params = new URLSearchParams(location.search);
  if (params.has('print')) {
    const want = params.get('print').split(',').map(norm).filter(Boolean).map((s) => s.toLowerCase());
    enter(want.length && want[0] !== 'all' ? all.filter((id) => want.includes(id)) : all, { now: params.has('now') });
  }

  /* ------------------------------------------- a leaf fuller than its sheet */
  const checkFit = () => {
    if (!matchMedia('screen and (min-width: 861px)').matches) return;
    for (const el of leafEls()) {
      const b = el.querySelector('.lbody');
      el.classList.toggle('over', b.scrollHeight > b.clientHeight + 2);
    }
  };
  /* every face loaded by name first: fonts.ready can resolve before one is asked for */
  Promise.all([...(document.fonts ?? [])].map((f) => f.load().catch(() => null))).then(() => document.fonts?.ready).then(checkFit);
  addEventListener('load', checkFit);
  addEventListener('resize', checkFit);
  if (location.hash) { const el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el) setTimeout(() => flash(el), 300); }
})();
