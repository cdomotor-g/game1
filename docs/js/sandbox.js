/*
 * The sandbox: one town, one player, real rules. This is where the numbers in
 * data/ stop being a spreadsheet and start being a game.
 *
 * It is also the seed of the digital version — the engine underneath knows
 * nothing about the DOM, so a multiplayer board layer can be built on top of it
 * without any of this file coming along.
 */
(function (global) {
  'use strict';

  const { el, pill } = global.UI;
  const D = global.GameData;
  const R = D.rules;

  let game = null;
  let tab = 'jobs';

  function ensure() {
    if (!game) game = Engine.newGame({ peopleId: 'human' });
    return game;
  }

  const rerender = () => global.App.render();

  function act(fn) {
    return () => { fn(); rerender(); };
  }

  /* ------------------------------------------------------------- top area */

  function stats(s) {
    const score = Engine.score(s);
    const cap = Engine.capacity(s);
    const used = Engine.usedSlots(s);
    const stat = (label, value, alert) =>
      el('div.stat' + (alert ? '.alert' : ''), [el('div.stat-label', label), el('div.stat-value', String(value))]);

    return el('div.stat-row', [
      stat('Round', `${s.round}/${R.victory.gameLengthRounds}`),
      stat('Effort left', `${Engine.remainingEffort(s)}h`),
      stat('Workers', s.workers),
      stat('Coin', `${s.coin}`),
      stat('Storage', `${Math.round(used)}/${cap}`, used > cap),
      stat('Unrest', s.unrest, s.unrest > 0),
      stat('Score', score.total),
    ]);
  }

  function controls(s) {
    const rolled = s.dice.length > 0 && s.round > 0;
    return el('div.panel', [
      el('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, [
        el('button.btn.primary', {
          onclick: act(() => { if (rolled) { Engine.endRound(s); } Engine.startRound(s); }),
          disabled: s.over,
        }, rolled ? 'End round & roll next' : 'Start round'),
        el('button.btn', { onclick: act(() => { game = Engine.newGame({ peopleId: s.peopleId }); }) }, 'New game'),
        el('label', { style: 'font-size:13px;color:var(--ink-soft);margin-left:4px' }, 'People:'),
        el('select', {
          onchange: (e) => { game = Engine.newGame({ peopleId: e.target.value }); rerender(); },
        }, D.peoples.map((p) => el('option', { value: p.id, selected: p.id === s.peopleId }, p.name))),
        el('span.hint', `seed ${s.seed}`),
      ]),
      s.dice.length ? el('div.dice', s.dice.map((d) => el('div.die', String(d.value)))) : null,
      s.event ? el('p.prose', { style: 'margin-top:10px' }, [el('strong', `${s.event.name}: `), s.event.text]) : null,
      s.round === 0 ? el('p.hint', { style: 'margin-top:8px' }, 'Roll first — you cannot allocate effort you have not got.') : null,
    ]);
  }

  /* ----------------------------------------------------------------- tabs */

  const subtabs = [
    ['jobs', 'Allocate effort'],
    ['build', 'Build'],
    ['workshop', 'Workshop'],
    ['market', 'Market'],
  ];

  function subnav() {
    return el('div.toolbar', subtabs.map(([id, label]) =>
      el('button.chip', { type: 'button', 'aria-pressed': tab === id, onclick: () => { tab = id; rerender(); } }, label)
    ));
  }

  function jobsPanel(s) {
    const all = Engine.jobs(s);
    const runnable = all.filter((j) => j.runnable);
    const blocked = all.filter((j) => !j.runnable).slice(0, 40);

    const row = (j) => el('div.job' + (j.runnable ? '' : '.blocked'), [
      el('div.job-main', [
        el('div.job-title', j.recipe.name),
        el('div.card-sub', outputSummary(j)),
        !j.runnable ? el('div.job-why', j.blockers[0]) : null,
      ]),
      el('div', { style: 'display:flex;gap:6px;align-items:center' }, [
        pill(`${j.hours}h`, 'accent'),
        j.runnable ? el('button.btn.small', { onclick: act(() => Engine.runJob(s, j.recipe.id)) }, 'Do it') : null,
      ]),
    ]);

    return el('div', [
      el('div.panel', [
        el('h3', 'Jobs you can run now', el('span.count', `${runnable.length} of ${all.length}`)),
        runnable.length
          ? el('div.joblist', runnable.map(row))
          : el('p.empty', s.round === 0 ? 'Roll for labour first.' : 'Nothing is possible — build something, or buy an input.'),
      ]),
      el('div.panel', [
        el('h3', 'Out of reach', el('span.count', 'and why')),
        el('div.joblist', blocked.map(row)),
      ]),
    ]);
  }

  function outputSummary(job) {
    const outs = job.variant.outputs.map((o) => `${o.qty} ${D.name('commodity', o.commodity)}`);
    const ins = job.variant.inputs.map((i) => `${i.qty} ${D.name('commodity', i.commodity)}`);
    const parts = [];
    if (ins.length) parts.push(ins.join(' + '));
    if (outs.length) parts.push('→ ' + outs.join(', '));
    else if (job.recipe.cropStage) parts.push(`→ sows ${D.name('commodity', job.recipe.cropStage)}`);
    else if (job.recipe.buildPointsPerHour) parts.push(`→ ${job.recipe.buildPointsPerHour} build-pts/h`);
    if (job.recipe.tool) parts.push(`· ${D.name('tool', job.recipe.tool)}`);
    if (job.recipe.toolBonus) {
      parts.push(job.bonus
        ? `· ${D.name('tool', job.recipe.toolBonus.tool)} helping`
        : `· faster with a ${D.name('tool', job.recipe.toolBonus.tool)}`);
    }
    return parts.join(' ');
  }

  function buildPanel(s) {
    const options = Engine.buildOptions(s);
    const ready = options.filter((o) => o.runnable);
    const not = options.filter((o) => !o.runnable);

    const costLine = (def) => (def.cost || []).map((c) => `${c.qty} ${D.name('commodity', c.commodity)}`).join(', ');

    const row = (o) => el('div.job' + (o.runnable ? '' : '.blocked'), [
      el('div.job-main', [
        el('div.job-title', o.def.name),
        el('div.card-sub', `${costLine(o.def)} · ${o.def.buildPoints} build-pts · min ${o.def.minRounds || 1} rounds`),
        !o.runnable ? el('div.job-why', o.blockers[0]) : null,
      ]),
      o.runnable ? el('button.btn.small', { onclick: act(() => Engine.foundSite(s, o.def.id)) }, 'Found') : null,
    ]);

    return el('div', [
      s.sites.length ? el('div.panel', [
        el('h3', 'Under construction'),
        el('div.joblist', s.sites.map((site) => {
          const rate = Engine.buildRateFor(s, site);
          return el('div.job', [
            el('div.job-main', { style: 'flex:1' }, [
              el('div.job-title', D.name('building', site.id)),
              el('div.card-sub', `${site.points}/${site.need} build-pts · round ${site.rounds}/${site.minRounds} · ${rate.rate} pts/h with ${rate.tool ? D.name('tool', rate.tool) : 'bare hands'}`),
              UI.bar(site.points / site.need),
            ]),
            el('div', { style: 'display:flex;gap:5px' }, [1, 3].map((h) =>
              el('button.btn.small', {
                disabled: Engine.remainingEffort(s) < h,
                onclick: act(() => Engine.workSite(s, site.uid, h)),
              }, `${h}h`)
            )),
          ]);
        })),
      ]) : null,
      el('div.panel', [
        el('h3', 'Can be founded now', el('span.count', String(ready.length))),
        ready.length ? el('div.joblist', ready.map(row)) : el('p.empty', 'Nothing affordable yet.'),
      ]),
      el('div.panel', [
        el('h3', 'Not yet'),
        el('div.joblist', not.slice(0, 30).map(row)),
      ]),
    ]);
  }

  function workshopPanel(s) {
    const canForge = Engine.ownedBuilding(s, 'blacksmith') || Engine.ownedBuilding(s, 'carpenter');
    return el('div', [
      el('div.panel', [
        el('h3', 'Tools in hand'),
        s.tools.length ? el('div.joblist', s.tools.map((t) => {
          const frac = 1 - t.wear / t.max;
          const cls = frac > 0.5 ? '' : frac > 0.25 ? '.mid' : '.low';
          return el('div.job', [
            el('div.job-main', { style: 'flex:1' }, [
              el('div.job-title', `${D.name('tool', t.id)} (${t.size})`),
              el('div.card-sub', `${t.max - t.wear} of ${t.max} wear points left`),
              UI.bar(frac, 'wear' + cls.replace('.', ' ')),
            ]),
          ]);
        })) : el('p.empty', 'No tools. Most of the game is shut to you until you fix that.'),
      ]),
      el('div.panel', [
        el('h3', 'Forge a tool'),
        !canForge ? el('p.hint', 'Needs a Blacksmith (or a Carpenter for wooden gear).') : null,
        el('div.joblist', D.tools.map((t) => {
          const built = Engine.ownedBuilding(s, t.madeAt);
          return el('div.job' + (built ? '' : '.blocked'), [
            el('div.job-main', [
              el('div.job-title', t.name),
              el('div.card-sub', `${t.craft.inputs.map((i) => `${i.qty} ${D.name('commodity', i.commodity)}`).join(' + ')} · ${t.craft.effortHours}h · at the ${D.name('building', t.madeAt)}`),
            ]),
            el('div', { style: 'display:flex;gap:5px;align-items:center' }, [
              t.sizes.map((size) =>
                el('button.btn.small', {
                  disabled: !built,
                  title: `Forge a ${size} ${t.name}`,
                  onclick: act(() => Engine.craftTool(s, t.id, size)),
                }, size[0].toUpperCase())
              ),
              el('button.btn.small', {
                disabled: !Engine.ownedBuilding(s, 'market') || s.coin < t.baseValue,
                title: `Buy a small ${t.name} at the market`,
                onclick: act(() => Engine.buyTool(s, t.id, 'small')),
              }, `Buy ${Math.round(t.baseValue * (1 + R.market.buySpread))}${R.currency.symbol}`),
            ]),
          ]);
        })),
      ]),
      el('div.panel', [
        el('h3', 'Train a specialist'),
        el('p.hint', Engine.ownedBuilding(s, 'guildhall') ? 'One per round.' : 'Needs a Guildhall.'),
        el('div.joblist', D.professions.map((p) =>
          el('div.job' + (s.specialists.includes(p.id) ? '.blocked' : ''), [
            el('div.job-main', [
              el('div.job-title', p.name),
              el('div.card-sub', `${p.trainCost.coin}${R.currency.symbol} + ${p.trainCost.effortHours}h · ${p.bonus}`),
            ]),
            s.specialists.includes(p.id)
              ? pill('trained', 'good')
              : el('button.btn.small', { disabled: !Engine.ownedBuilding(s, 'guildhall'), onclick: act(() => Engine.trainSpecialist(s, p.id)) }, 'Train'),
          ])
        )),
      ]),
    ]);
  }

  function marketPanel(s) {
    const hasMarket = Engine.ownedBuilding(s, 'market');
    const rows = D.commodities
      .slice()
      .sort((a, b) => (s.stock[b.id] || 0) - (s.stock[a.id] || 0) || a.name.localeCompare(b.name))
      .slice(0, 40);

    return el('div.panel', [
      el('h3', 'Market'),
      el('p.hint', hasMarket
        ? `Prices are base value × band. The board takes ${Math.round(R.market.buySpread * 100)}% unless you have a trading house or a merchant. ` +
          'Stock is what this round\u2019s supply roll left the board to sell; memory and tally are the two strips on that commodity\u2019s line of the market board.'
        : 'Build a Market before you can trade with the board.'),
      el('div.table-wrap', el('table', [
        el('thead', el('tr', [
          el('th', 'Commodity'), el('th', 'Prices by'), el('th.num', 'Held'),
          el('th.num', 'Stock'), el('th.num', 'Tally'), el('th.num', 'Memory'),
          el('th.num', 'Buy'), el('th.num', 'Sell'), el('th', ''),
        ])),
        el('tbody', rows.map((c) => {
          const { base } = Engine.priceOf(s, c.id);
          const m = Engine.marketOf(s, c.id);
          const buy = Math.round(base * (1 + R.market.buySpread));
          const sell = Math.round(base * (1 + R.market.sellSpread));
          return el('tr', [
            el('td', c.name),
            el('td', { title: m.model.line }, el('span.hint', m.model.name)),
            el('td.num', String(s.stock[c.id] || 0)),
            el('td.num', String(m.stock)),
            el('td.num', m.model.tally.uses ? String(m.tally) : '—'),
            el('td.num', m.memory ? (m.memory > 0 ? `+${m.memory}` : String(m.memory)) : '0'),
            el('td.num', String(buy)),
            el('td.num', String(sell)),
            el('td', { style: 'text-align:right;white-space:nowrap' }, [
              el('button.btn.small', { disabled: !hasMarket || s.coin < buy || m.stock < 1, onclick: act(() => Engine.trade(s, c.id, 1, 'buy')) }, 'Buy 1'),
              ' ',
              el('button.btn.small', { disabled: !hasMarket || !(s.stock[c.id] > 0), onclick: act(() => Engine.trade(s, c.id, 1, 'sell')) }, 'Sell 1'),
            ]),
          ]);
        })),
      ])),
    ]);
  }

  /* ---------------------------------------------------------- right column */

  function sidebar(s) {
    const stockRows = Object.keys(s.stock)
      .sort((a, b) => D.name('commodity', a).localeCompare(D.name('commodity', b)))
      .map((id) => el('span.stock-item', `${D.name('commodity', id)} ${s.stock[id]}`));

    const foodHeld = Object.keys(s.stock).reduce((n, id) => {
      const c = D.byId.commodity.get(id);
      if (!c) return n;
      if (c.category !== 'food' && c.category !== 'drink') return n;
      return n + s.stock[id] * (id === 'bread' ? 2 : 1);
    }, 0);
    const foodNeed = s.workers * R.population.foodPerWorkerPerRound + s.specialists.length + (s.peopleId === 'halfling' ? 2 : 0);

    return el('div', [
      el('div.panel', [
        el('h3', 'Feeding', el('span.count', 'end of round')),
        el('div', { style: 'display:flex;gap:8px;align-items:baseline' }, [
          el('span.stat-value' + (foodHeld >= foodNeed ? '.good' : '.bad'), `${foodHeld}`),
          el('span.hint', `of ${foodNeed} needed`),
        ]),
        foodHeld < foodNeed ? el('p.hint.bad', `${foodNeed - foodHeld} short — that is ${foodNeed - foodHeld} unrest.`) : null,
      ]),
      el('div.panel', [
        el('h3', 'Stockpile', el('span.count', `${Math.round(Engine.usedSlots(s))}/${Engine.capacity(s)} slots`)),
        stockRows.length ? el('div.stock', stockRows) : el('p.empty', 'Empty.'),
      ]),
      s.pending.length ? el('div.panel', [
        el('h3', 'Waiting'),
        el('div.joblist', s.pending.map((p) =>
          el('div.job', [
            el('div.job-main', [
              el('div.job-title', p.kind === 'crop' ? `${D.name('commodity', p.crop)} in the field` : p.label),
              el('div.card-sub', p.roundsLeft <= 0 ? 'ready' : `${p.roundsLeft} round(s)`),
            ]),
            p.roundsLeft <= 0 ? pill('ready', 'good') : null,
          ])
        )),
      ]) : null,
      el('div.panel', [
        el('h3', 'Town'),
        el('div.card-meta', s.buildings.map((b) => pill(D.name('building', b.id)))),
        el('p.hint', { style: 'margin-top:8px' }, `Terrain: ${s.terrain.map((t) => D.name('terrain', t)).join(', ')}`),
        el('p.hint', `Deposits: ${s.deposits.map((d) => D.name('deposit', d)).join(', ')}`),
      ]),
      el('div.panel', [
        el('h3', 'Log'),
        el('div.log', s.log.slice(-80).map((l) => el('div.log-line' + (l.kind ? '.' + l.kind : ''), `${l.round ? 'r' + l.round + ' ' : ''}${l.text}`))),
      ]),
    ]);
  }

  /* ----------------------------------------------------------------- view */

  function view() {
    const s = ensure();
    const panels = { jobs: jobsPanel, build: buildPanel, workshop: workshopPanel, market: marketPanel };
    return el('div', [
      Views.pageHead('Sandbox', 'One town, one player, the real numbers. Roll for labour, spend the hours, and make sure everyone eats. This runs on the same data the rest of the explorer shows.'),
      stats(s),
      controls(s),
      el('div.sb-layout', { style: 'margin-top:14px' }, [
        el('div', [subnav(), (panels[tab] || jobsPanel)(s)]),
        sidebar(s),
      ]),
    ]);
  }

  global.Sandbox = { view, reset: () => { game = null; } };
})(window);
