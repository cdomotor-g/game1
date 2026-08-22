/*
 * Browsing views. Every view is a function that returns a DOM node; app.js
 * decides which one is on screen and owns the detail drawer.
 */
(function (global) {
  'use strict';

  const { el, pill, titleize } = global.UI;
  const D = global.GameData;
  const R = D.rules;

  /* Strength is the carrying limit as well as the swinging one, so kilograms are
     derived here rather than stored anywhere: rules.json owns the factor and
     every card, table and drawer in the game multiplies by the same one. */
  const carryKg = (strength) => (strength || 0) * R.carrying.kgPerStrength;

  let open = () => {};           // set by app.js — opens the detail drawer
  const setOpener = (fn) => { open = fn; };

  const state = { filters: {} };

  /* ------------------------------------------------------------ fragments */

  function token(commodityId, qty, kind) {
    const c = D.byId.commodity.get(commodityId);
    return el('button.token' + (kind ? '.' + kind : ''), { type: 'button', onclick: (e) => { e.stopPropagation(); open('commodity', commodityId); } }, [
      qty !== undefined && qty !== null ? el('span.qty', String(qty)) : null,
      c ? c.name : titleize(commodityId),
    ]);
  }

  function effortToken(hours) {
    return el('span.token.effort', `${hours}h`);
  }

  /** inputs → outputs, the way the rulebook will print it. */
  function flow(recipe, variant) {
    const v = variant || D.variants(recipe)[0];
    const left = [];
    left.push(effortToken(recipe.effortHours || 0));
    if (recipe.tool) {
      left.push(el('button.token.tool', { type: 'button', onclick: (e) => { e.stopPropagation(); open('tool', recipe.tool); } }, D.name('tool', recipe.tool)));
    }
    v.inputs.forEach((i) => left.push(token(i.commodity, i.qty)));
    const fuel = D.fuelOptions(recipe);
    if (fuel.length) left.push(el('span.token', `fuel: ${fuel.map((f) => f.label).join(' / ')}`));

    const right = v.outputs.map((o) => token(o.commodity, o.qty, 'out'));
    if (!right.length && recipe.buildPointsPerHour) right.push(el('span.token.out', `${recipe.buildPointsPerHour} build-pts/h`));
    if (!right.length && recipe.rollTable) right.push(el('span.token.out', 'roll table'));
    if (!right.length && recipe.cropStage) right.push(el('span.token.out', `${D.name('commodity', recipe.cropStage)} crop`));

    return el('div.flow', [
      left,
      right.length ? el('span.arrow', '→') : null,
      right,
      recipe.maturationRounds ? pill(`+${recipe.maturationRounds} rounds`, 'warn') : null,
    ]);
  }

  function cardNode(title, subtitle, pills, onclick) {
    return el('button.card', { type: 'button', onclick }, [
      el('div.card-head', [el('span.card-title', title)]),
      subtitle ? el('div.card-sub', subtitle) : null,
      pills && pills.length ? el('div.card-meta', pills) : null,
    ]);
  }

  /**
   * A rendered plate as a thumbnail, or nothing if the plate is not drawn yet.
   *
   * A plate is a whole drawn page and a thumbnail is a window on it, so this is
   * a crop, not a squeeze: docs/js/framing.js places the image so that what the
   * window holds is the subject — the same crop the printed card takes. The
   * window's shape is set here rather than in the stylesheet because the
   * placement is computed from it, and a rule in app.css that quietly disagreed
   * would slide the subject back out of frame.
   */
  function plateThumb(plate, alt, aspect) {
    if (!plate) return null;
    const shape = aspect || 5 / 4;
    const place = D.artPlacement(plate, shape);
    const pc = (n) => n.toFixed(3) + '%';
    return el('div.card-art', { style: `aspect-ratio:${shape}` }, [
      el('img', {
        src: plate.file, alt: alt || '', loading: 'lazy',
        style: `width:${pc(place.width)};height:${pc(place.height)};left:${pc(place.left)};top:${pc(place.top)}`,
      }),
    ]);
  }

  /** The plate at drawer size — whole, because there is room for the whole page. */
  function plateFull(plate, alt) {
    return plate ? el('img.plate', { src: plate.file, alt: alt || '', loading: 'lazy' }) : null;
  }

  /** A deck card: plate on top, then title, sub and pills. */
  function deckCard(kind, entity, subtitle, pills) {
    return el('button.card.deck-card', { type: 'button', onclick: () => open(kind, entity.id) }, [
      plateThumb(D.art(kind, entity), entity.name),
      el('div.card-head', [el('span.card-title', entity.name), el('span.card-code', entity.cardCode)]),
      subtitle ? el('div.card-sub', subtitle) : null,
      pills && pills.length ? el('div.card-meta', pills.filter(Boolean)) : null,
    ]);
  }

  function filterBar(key, options, onChange, current) {
    return el('div.toolbar', options.map((opt) =>
      el('button.chip', {
        type: 'button',
        'aria-pressed': (current || 'all') === opt.id,
        onclick: () => onChange(opt.id),
      }, opt.label)
    ));
  }

  function pageHead(title, blurb) {
    return el('div.page-head', [el('h2', title), blurb ? el('p', blurb) : null]);
  }

  /** Generic "filter chips + card grid" page used by most collections. */
  function collectionPage(config) {
    const { title, blurb, items, categories, categoryOf, render, key, query } = config;
    const current = state.filters[key] || 'all';
    const options = [{ id: 'all', label: `All (${items.length})` }].concat(
      categories.map((c) => ({ id: c.id, label: `${c.name} (${items.filter((i) => categoryOf(i) === c.id).length})` }))
    );
    const visible = items
      .filter((i) => current === 'all' || categoryOf(i) === current)
      .filter((i) => UI.matches(i, query));

    return el('div', [
      pageHead(title, blurb),
      categories.length ? filterBar(key, options, (id) => { state.filters[key] = id; global.App.render(); }, current) : null,
      visible.length
        ? el('div.grid', visible.map(render))
        : el('p.empty', 'Nothing matches that filter.'),
    ]);
  }

  /* --------------------------------------------------------------- views */

  const views = {};

  views.overview = function () {
    const counts = [
      ['Commodities', D.commodities.length, 'commodities'],
      ['Recipes', D.recipes.length, 'recipes'],
      ['Buildings', D.buildings.length, 'buildings'],
      ['Tools', D.tools.length, 'tools'],
      ['Events', D.cards.length, 'events'],
      ['Items', D.items.length, 'items'],
    ];

    const deepest = D.commodities
      .map((c) => ({ c, tier: D.tierOf(c.id), effort: D.effortToProduce(c.id) }))
      .sort((a, b) => b.tier - a.tier || b.effort - a.effort)
      .slice(0, 8);

    return el('div', [
      pageHead('game1', 'A settlement-and-economy game for the table, with a digital twin. Everything on these pages is generated from data/*.json — change a number there and this whole explorer changes with it.'),
      el('div.stat-row', counts.map(([label, n, tab]) =>
        el('button.stat', { type: 'button', style: 'cursor:pointer;text-align:left', onclick: () => global.App.go(tab) }, [
          el('div.stat-label', label), el('div.stat-value', String(n)),
        ])
      )),
      el('div.cols', [
        el('div.panel', [
          el('h3', 'The round'),
          el('ol', { style: 'margin:0;padding-left:20px' }, R.round.phases.map((p) =>
            el('li', { style: 'margin-bottom:6px' }, [el('strong', p.name), ' — ', el('span', { style: 'color:var(--ink-soft)' }, p.summary)])
          )),
        ]),
        el('div.panel', [
          el('h3', 'The core loop in one paragraph'),
          el('p.prose', 'Workers live in houses. Each round every worker rolls a die and the pips are hours of effort. You spend those hours on jobs: felling trees, digging clay, minding a furnace, putting up a building. Jobs need a site, usually a tool, and usually an input commodity. At the end of the round everyone has to eat, and anything you could not feed turns into unrest.'),
          el('p.prose', 'Everything else — trade, rail, war, magic — is a way of getting more hours, better hours, or more out of each hour.'),
        ]),
      ]),
      el('div.panel', [
        el('h3', 'Longest production chains', el('span.count', 'depth of the tree behind one unit')),
        el('div.table-wrap', el('table', [
          el('thead', el('tr', [el('th', 'Commodity'), el('th.num', 'Tier'), el('th.num', 'Effort/unit'), el('th.num', 'Value'), el('th.num', 'Value/slot')])),
          el('tbody', deepest.map(({ c, tier, effort }) =>
            el('tr', { style: 'cursor:pointer', onclick: () => open('commodity', c.id) }, [
              el('td', c.name), el('td.num', String(tier)), el('td.num', effort.toFixed(1)),
              el('td.num', String(c.baseValue)), el('td.num', D.valueDensity(c).toFixed(1)),
            ])
          )),
        ])),
      ]),
    ]);
  };

  views.commodities = function (query) {
    return collectionPage({
      key: 'commodities', query,
      title: 'Commodities',
      blurb: 'Storable, tradeable goods. Bulk is the storage slot cost; value is what one unit fetches at price band 1.0 before the market takes its cut.',
      items: D.commodities,
      categories: D.categories.commodity,
      categoryOf: (c) => c.category,
      render: (c) => cardNode(
        c.name,
        c.notes || c.summary || `${UI.plural(D.producersOf(c.id).length, 'way')} to make it, ${UI.plural(D.consumersOf(c.id).length, 'use')}.`,
        [
          pill(`${c.baseValue}${R.currency.symbol}`, 'accent'),
          pill(`bulk ${c.bulk}`),
          pill(`tier ${D.tierOf(c.id)}`),
          c.perishRounds ? pill(`perishes ${c.perishRounds}r`, 'warn') : null,
        ].filter(Boolean),
        () => open('commodity', c.id)
      ),
    });
  };

  views.recipes = function (query) {
    const current = state.filters.recipes || 'all';
    const cats = D.categories.recipe;
    const options = [{ id: 'all', label: `All (${D.recipes.length})` }].concat(
      cats.map((c) => ({ id: c.id, label: `${c.name} (${D.recipes.filter((r) => r.category === c.id).length})` }))
    );
    const visible = D.recipes
      .filter((r) => current === 'all' || r.category === current)
      .filter((r) => UI.matches(r, query));

    return el('div', [
      pageHead('Recipes', 'Every job a worker can be allocated to. Hours are per batch; a bigger tool multiplies the output, not the hours.'),
      filterBar('recipes', options, (id) => { state.filters.recipes = id; global.App.render(); }, current),
      el('div.grid.wide', visible.map((r) =>
        el('button.card', { type: 'button', onclick: () => open('recipe', r.id) }, [
          el('div.card-head', [
            el('span.card-title', r.name),
            pill(D.categories.recipe.find((c) => c.id === r.category)?.name || r.category),
          ]),
          flow(r),
          el('div.card-sub', siteText(r)),
        ])
      )),
    ]);
  };

  function siteText(recipe) {
    const s = recipe.site || {};
    const bits = [];
    if (s.building) bits.push(D.name('building', s.building));
    if (s.orBuilding) bits.push('or ' + D.name('building', s.orBuilding));
    if (s.terrain) bits.push(s.terrain.map((t) => D.name('terrain', t)).join(' / '));
    if (s.deposit) bits.push('on a ' + D.name('deposit', s.deposit));
    if (s.constructionSite) bits.push('any construction site');
    if (s.figure) bits.push(D.name('figure', s.figure) + ' on the board');
    if (recipe.specialist) bits.push('needs a ' + D.name('profession', recipe.specialist));
    return bits.join(' · ') || 'anywhere';
  }

  views.buildings = function (query) {
    return collectionPage({
      key: 'buildings', query,
      title: 'Buildings',
      blurb: 'Cost is paid when the site is founded; build-points are hours of construction work. Worker slots cap how many people can work there in one round.',
      items: D.buildings,
      categories: D.categories.building,
      categoryOf: (b) => b.category,
      render: (b) => cardNode(
        b.name,
        b.summary,
        [
          pill(`${b.buildPoints} pts`, 'accent'),
          b.workerSlots ? pill(`${b.workerSlots} slots`) : null,
          b.housing ? pill(`+${b.housing} workers`, 'good') : null,
          b.storage ? pill(`${b.storage} storage`) : null,
          b.tier ? pill(`T${b.tier}`) : null,
        ].filter(Boolean),
        () => open('building', b.id)
      ),
    });
  };

  views.tools = function (query) {
    const visible = D.tools.filter((t) => UI.matches(t, query));
    return el('div', [
      pageHead('Tools', 'Tools gate recipes and wear out. Every hour of effort spent with a tool costs it one wear point; when the track empties, the tool is gone.'),
      el('div.grid.wide', visible.map((t) =>
        el('button.card', { type: 'button', onclick: () => open('tool', t.id) }, [
          el('div.card-head', [el('span.card-title', t.name), pill(t.family)]),
          el('div.card-sub', t.summary),
          el('div.card-meta', [
            pill(`${t.baseDurability} wear`, 'accent'),
            pill(`${t.craft.effortHours}h to make`),
            pill(`at the ${D.name('building', t.madeAt)}`),
          ]),
          el('div.card-meta', t.enables.map((r) => pill(D.name('recipe', r)))),
        ])
      )),
    ]);
  };

  views.terrain = function (query) {
    const visible = D.terrains.filter((t) => UI.matches(t, query));
    return el('div', [
      pageHead('Terrain & the board', 'Tiles decide what can be built, what it costs to cross, and what might be buried underneath.'),
      el('div.grid.wide', visible.map((t) =>
        el('button.card', { type: 'button', onclick: () => open('terrain', t.id) }, [
          el('div.card-head', [
            el('span.card-title', [
              el('span', { style: `display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:7px;background:${t.colour || '#888'}` }),
              t.name,
            ]),
            pill(t.family),
          ]),
          el('div.card-sub', t.summary || ''),
          el('div.card-meta', [
            pill(`move ${t.moveCost}`),
            pill(`road ×${t.roadCostMultiplier}`),
            pill(`rail ×${t.railCostMultiplier}`, t.railCostMultiplier >= 4 ? 'bad' : ''),
            t.effortPenalty ? pill(`effort ${t.effortPenalty}`, 'warn') : null,
          ].filter(Boolean)),
        ])
      )),
      el('div.panel', [
        el('h3', 'Setup'),
        el('div.deflist', Object.entries(D.raw.terrain.boardSetup.recommendedTiles).flatMap(([k, v]) =>
          [el('dt', k.replace('players', ' players')), el('dd', String(v) + ' tiles')]
        )),
        el('p.prose', D.raw.terrain.boardSetup.startingCluster),
      ]),
    ]);
  };

  views.events = function (query) {
    return collectionPage({
      key: 'events', query,
      title: 'Event deck',
      blurb: `${D.raw.events.deck.totalCards} cards, one drawn each round and two from round ${D.raw.events.deck.drawPerRoundFrom.round}. Every disaster is meant to have a mitigation you could have bought in advance.`,
      items: D.cards,
      categories: D.categories.event,
      categoryOf: (c) => c.category,
      render: (c) => cardNode(
        c.name,
        c.text,
        [pill(c.scope, c.scope === 'offer' ? 'good' : c.category === 'disaster' || c.category === 'crime' ? 'bad' : ''), pill(`×${c.copies || 1}`)],
        () => open('card', c.id)
      ),
    });
  };

  views.items = function (query) {
    return collectionPage({
      key: 'items', query,
      title: 'Equipment & potions',
      blurb: 'Carried by workers, figures and soldiers. Armour and weapons matter in battle; potions are spent for one round of advantage. Every item has a mass in kilograms, and it counts against what the carrier can shoulder.',
      items: D.items,
      categories: D.categories.item,
      categoryOf: (i) => i.class,
      render: (i) => cardNode(
        i.name,
        (i.effects || [])[0] || '',
        [
          pill(`${i.baseValue}${R.currency.symbol}`, 'accent'),
          pill(`${i.massKg} kg`),
          i.combatDice ? pill(`+${i.combatDice} dice`, 'bad') : null,
          i.armourValue ? pill(`armour ${i.armourValue}`, 'good') : null,
          i.madeAt ? pill(D.name('building', i.madeAt)) : null,
        ].filter(Boolean),
        () => open('item', i.id)
      ),
    });
  };

  views.peoples = function () {
    return el('div', [
      pageHead('Peoples & professions', 'A people sets your baseline. Professions are individual workers trained at a guildhall.'),
      el('div.grid.wide', D.peoples.map((p) =>
        el('div.card', { style: 'cursor:default' }, [
          plateThumb(D.art('people', p), p.name, 4 / 3),
          el('div.card-head', [el('span.card-title', p.name), pill(p.effortDie, 'accent')]),
          el('div.card-sub', p.summary),
          el('ul', { style: 'margin:6px 0 0;padding-left:18px;font-size:13px' }, p.traits.map((t) =>
            el('li', [el('strong', t.name), ' — ', el('span', { style: 'color:var(--ink-soft)' }, t.effect)])
          )),
        ])
      )),
      el('div.panel', [
        el('h3', 'Professions', el('span.count', `${D.professions.length} trainable`)),
        el('div.table-wrap', el('table', [
          el('thead', el('tr', [el('th', 'Profession'), el('th', 'Trained at'), el('th.num', 'Cost'), el('th', 'Bonus')])),
          el('tbody', D.professions.map((p) =>
            el('tr', [
              el('td', p.name),
              el('td', D.name('building', p.building)),
              el('td.num', `${p.trainCost.coin}${R.currency.symbol} + ${p.trainCost.effortHours}h`),
              el('td', p.bonus),
            ])
          )),
        ])),
      ]),
    ]);
  };

  views.transport = function () {
    return el('div', [
      pageHead('Transport & trade', 'Capacity is in bulk points, speed in tiles per round. The packaging travels with the cargo and comes back with the empty vehicle.'),
      el('div.table-wrap', el('div.panel', el('table', [
        el('thead', el('tr', [
          el('th', 'Mode'), el('th.num', 'Capacity'), el('th.num', 'Speed'), el('th', 'Needs'),
          el('th.num', 'Buy'), el('th.num', 'Upkeep'), el('th.num', 'Theft'),
        ])),
        el('tbody', D.modes.map((m) =>
          el('tr', { style: 'cursor:pointer', onclick: () => open('mode', m.id) }, [
            el('td', [el('strong', m.name), el('div.card-sub', m.summary)]),
            el('td.num', String(m.capacity)),
            el('td.num', m.speedOnRoad ? `${m.speed} (${m.speedOnRoad} on road)` : String(m.speed)),
            el('td', m.requires === 'none' ? '—' : D.name('building', m.requires) || m.requires),
            el('td.num', m.buyCost ? `${m.buyCost}${R.currency.symbol}` : '—'),
            el('td.num', String(m.upkeep)),
            el('td.num', '★'.repeat(m.theftRisk || 0)),
          ])
        )),
      ]))),
      el('div.cols', [
        el('div.panel', [el('h3', 'Route rules'), el('ul', { style: 'margin:0;padding-left:18px;color:var(--ink-soft);font-size:13.5px' }, D.raw.transport.routes.rules.map((r) => el('li', r)))]),
        el('div.panel', [
          el('h3', 'Figures'),
          el('div.linklist', D.figures.map((f) =>
            el('div.linkrow', { style: 'cursor:default' }, [el('strong', f.name), ` — ${f.movePoints} move, carries ${f.carries}`, el('div.lr-sub', f.summary)])
          )),
        ]),
      ]),
    ]);
  };

  /* ------------------------------------------------------------- adventure */

  const ELEMENT_PILL = { fire: 'bad', earth: 'good', water: '', air: '' };

  /* The element's own mark, inline, from the same path data the cards and the
     printed book draw — data/arcana.json, bundled. Built as a node rather than
     loaded as a file so it inherits the pill's colour and needs no request. */
  const elementMark = (id) => {
    const e = (D.elements || []).find((x) => x.id === id);
    if (!e || !e.mark) return null;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'elmark');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', e.mark);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  };

  /** A pill that leads with the element's mark. */
  const elementPill = (id) => {
    const p = pill(id, ELEMENT_PILL[id]);
    const mark = elementMark(id);
    if (mark) p.insertBefore(mark, p.firstChild);
    return p;
  };

  /**
   * The player board, at the head of the adventure page — because the board is
   * what the four decks are played ON, and its five tracks are the bars off
   * their edges brought together in one place.
   *
   * Read straight out of data/playerboard.json, so the tracks here, the printed
   * board and the rulebook cannot disagree about what a track counts.
   */
  function boardPanel() {
    const pb = D.playerboard;
    const shape = D.raw.components && D.raw.components.board;
    if (!pb || !shape) return null;
    const { from, to } = shape.track;

    /* `stepFrom` is a dotted path into the data rather than a number copied out
       of it, for any track that would rather read its step than restate it. */
    const stepOf = (t) => {
      if (typeof t.step === 'number') return t.step;
      let node = D.raw;
      for (const part of String(t.stepFrom || '').split('.')) node = node && node[part];
      return typeof node === 'number' ? node : 1;
    };

    const slots = pb.slots.reduce((n, s) => n + s.count, 0);
    /* el() reads a bare string as the child list, so a heading with a count
       beside it has to hand both over as an array or the count is dropped. */
    return el('div.panel', [
      el('h3', [pb.board.name, el('span.count', `${pb.tracks.length} tracks · ${slots} card slots`)]),
      el('p.prose', pb.board.summary),
      el('p.prose', 'A card in a recess is a card whose edges you cannot reach, so the board takes the bars over: one place to look, one place to knock the tokens off, and the cards stay flat.'),
      el('p.prose', pb.board.generic),
      el('div.grid.wide', pb.tracks.map((t) => {
        const step = stepOf(t);
        return el('div.card', [
          el('div.card-head', [el('span.card-title', t.label), el('span.card-code', t.letter)]),
          el('div.card-sub', t.walks),
          el('div.card-meta', [
            pill(`${from * step}–${to * step}${t.unit ? ' ' + t.unit : ''}`),
            pill(t.kind === 'leg' ? 'leg clock' : t.kind, t.kind === 'harm' ? 'bad' : t.arcane ? 'accent' : ''),
          ]),
        ]);
      })),
      el('div.flow', { style: 'margin-top:12px' }, [
        el('a.btn', { href: 'boards/index.html' }, 'Open the player board'),
      ]),
    ]);
  }

  views.adventure = function (query) {
    const q = (list) => list.filter((x) => UI.matches(x, query));

    const section = (title, blurb, nodes) => (nodes.length ? [
      el('div.page-head.section-head', [el('h3', title), blurb ? el('p', blurb) : null]),
      el('div.grid.deck-grid', nodes),
    ] : []);

    return el('div', [
      pageHead('The adventure decks', 'Named vehicles, monsters, characters and talismans — the moving pieces of the open world. No card carries a bar any more: every number a card has is printed once, as a maximum, in the lettered summary strip across its top, and the tracks that move are on the player board. The letters are the board’s own — H, S, D, M, V — so setting up is reading across the strip. Plates are the accepted renders from docs/art/prompts.'),
      el('div.flow', { style: 'margin-bottom:6px' }, [
        el('a.btn', { href: 'cards/index.html' }, 'Open the card fronts'),
        el('a.btn.small', { href: 'boards/index.html' }, 'The player board'),
        el('a.btn.small', { href: 'markets/index.html' }, 'The market board'),
        el('a.btn.small', { href: 'book/index.html' }, 'Read the rulebook'),
      ]),
      boardPanel(),
      ...section('Characters', 'Each player’s hero figure takes one at setup. Strength is both halves of what an arm does: what they swing with, and what they can shoulder.', q(D.characters).map((c) =>
        deckCard('character', c, `${D.name('people', c.people)} · ${c.calling}`, [
          pill(`health ${c.health}`, 'bad'),
          pill(`strength ${c.strength}`),
          pill(`defence ${c.defence}`),
          pill(`carries ${carryKg(c.strength)} kg`),
          pill(`${c.startingGold}${R.currency.symbol} to start`),
          c.manaCapacity ? pill(`mana ${c.manaCapacity}`, 'accent') : null,
        ])
      )),
      ...section('Vehicles', 'Specific machines with a history; transport modes are the generic rules they run on.', q(D.vehicles).map((v) =>
        deckCard('vehicle', v, v.quirk, [
          pill(D.name('mode', v.mode) || UI.titleize(v.mode)),
          pill(`cargo ${v.cargoCapacity}`),
          pill(`damage ${v.damageBoxes}`, 'bad'),
        ])
      )),
      ...section('Monsters', 'Drawn when a discovery roll says monster and the card’s terrain list includes the hex. Deal the card onto the spare player board and run it like a player who is not a person.', q(D.monsters).map((m) =>
        deckCard('monster', m, m.story, [
          elementPill(m.element),
          pill(`str ${m.strength}`),
          pill(`def ${m.defence}`),
          pill(`health ${m.health}`, 'bad'),
          pill(`mana ${m.manaYield}`, 'accent'),
        ])
      )),
      ...section('Talismans', 'The only vessel most peoples have for mana — made, bought, sold and stolen.', q(D.talismans).map((t) =>
        deckCard('item', t, (t.effects || [])[0], [
          pill(`mana ${t.manaCapacity}`, 'accent'),
          pill(`${t.baseValue}${R.currency.symbol}`),
        ])
      )),
      ...section('Modifications', 'Fittings and enchantments bolted onto a vehicle after it is built — the only one of the three a player makes during a game. They share the vehicle’s slots, so a shipwright and a hedge-witch compete for the same hull.', q(D.modifications).map((m) =>
        el('button.card', { type: 'button', onclick: () => open('modification', m.id) }, [
          el('div.card-head', [el('span.card-title', m.name), el('span.card-code', m.cardCode)]),
          el('div.card-sub', m.effect),
          el('div.card-meta', [
            pill(UI.titleize(m.class)),
            m.element ? elementPill(m.element) : null,
            m.manaCost ? pill(`${m.manaCost} mana`, 'accent') : pill(`${m.baseValue}${R.currency.symbol}`),
            pill(`fits ${m.fits.join(', ')}`),
          ].filter(Boolean)),
        ])
      )),
      ...section('Enchantments', 'Mana laid into a building, a tool or a person and left there. A spell is spent and gone; an enchantment holds until something breaks it.', q(D.enchantments).map((e) =>
        el('button.card', { type: 'button', onclick: () => open('enchantment', e.id) }, [
          el('div.card-head', [el('span.card-title', e.name), el('span.card-code', e.cardCode)]),
          el('div.card-sub', e.effect),
          el('div.card-meta', [elementPill(e.element), pill(`${e.cost} mana`, 'accent'), pill(e.boundTo)]),
        ])
      )),
      ...section('Quests', 'Arrive through omens and inn rumours; accepted or declined on the spot.', q(D.quests).map((qc) =>
        el('button.card', { type: 'button', onclick: () => open('quest', qc.id) }, [
          el('div.card-head', [el('span.card-title', qc.name), el('span.card-code', qc.cardCode)]),
          el('div.card-sub', qc.task || (qc.stages ? `${qc.stages.length} stages: ${qc.stages.map((s) => s.name).join(' → ')}` : '')),
          el('div.card-meta', [pill(qc.type), pill(`complexity ${qc.complexity}`)]),
        ])
      )),
    ]);
  };

  /* ------------------------------------------------------------------ maps */

  views.maps = function () {
    const maps = D.raw.maps || [];
    if (!maps.length) return el('div', [pageHead('Maps', 'No maps in data/maps/ yet.')]);

    return el('div', [
      pageHead('Maps', 'A drawn map and the hex board read off it. The artwork is committed as it was supplied; the grid is an overlay, so a mistake about the terrain is a one-character edit and never a repaint.'),
      maps.map((m) => {
        /* A commission is a map whose plate has not been drawn yet: the board is
           empty because there is nothing to read it off. It shows what was asked
           for rather than what is there. See docs/MINT.md. */
        if (!(m.rows || []).length) return commissionPanel(m);

        const tally = {};
        for (const line of m.rows) for (const ch of line) tally[m.legend[ch]] = (tally[m.legend[ch]] || 0) + 1;
        const water = (tally['deep-water'] || 0) + (tally['shallow-water'] || 0);
        const total = m.grid.cols * m.grid.rows;

        return el('div.panel', [
          el('h3', m.name, el('span.count', `${total} hexes`)),
          el('p.prose', m.summary || ''),
          el('div.card-meta', [
            pill(`${m.grid.cols} × ${m.grid.rows}`),
            pill(`${total - water} land`),
            pill(`${water} water`),
            pill(`${(m.settlements || []).length} settlements`),
            pill(`${m.grid.leaguesAcrossFlats} leagues a hex`),
          ]),
          el('div.flow', { style: 'margin-top:12px' }, [
            el('a.btn', { href: 'map/index.html' }, 'Open the map'),
            el('a.btn.small', { href: 'map/print.html' }, 'Print it'),
          ]),
          el('h4', { style: 'margin-top:16px' }, 'Terrain'),
          el('div.grid.wide', D.terrains.filter((t) => tally[t.id]).map((t) =>
            el('button.card', { type: 'button', onclick: () => open('terrain', t.id) }, [
              el('div.card-head', [
                el('span.card-title', [
                  el('span', { style: `display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:7px;background:${t.colour || '#888'}` }),
                  t.name,
                ]),
                pill(`${tally[t.id]}`),
              ]),
              el('div.card-sub', `${((100 * tally[t.id]) / total).toFixed(1)}% of the board`),
            ])
          )),
          el('h4', { style: 'margin-top:16px' }, 'Regions'),
          el('div.linklist', (m.regions || []).map((rg) =>
            el('div.linkrow', { style: 'cursor:default' }, [
              el('strong', rg.name),
              el('div.lr-sub', rg.summary || ''),
            ])
          )),
          el('h4', { style: 'margin-top:16px' }, 'Settlements'),
          el('div.flow', (m.settlements || []).map((st) =>
            el('span.token', `${st.name} · ${st.rank}${st.harbour ? ' · harbour' : ''}`)
          )),
          sheetGallery('Places — the settlement sheets', 'One mini-map per named settlement, for play inside its walls.',
            (m.settlements || []).map((st) => [D.placeSheet(m, st.id), `${st.name} — ${st.rank}${st.harbour ? ', harbour' : ''}`])),
        ]);
      }),
      sheetGallery('Grounds — the battle sheets', 'One sheet per land terrain, plus the shallows for boarding actions. Out for the fight, then away.',
        D.terrains.map((t) => [D.groundSheet(t.id), t.name])),
      sheetGallery('Holdings — the player sheets', 'A near-empty stretch of good ground a settlement could grow on. One per player, possibly out all game.',
        D.holdingSheets().map((p, i) => [p, `Sheet ${i + 1}`])),
    ]);
  };

  /** A commissioned map: what has been asked for, and what is waiting on what. */
  function commissionPanel(m) {
    const c = m.commission || {};
    const s = c.settlements || {};
    const ranks = ['seat', 'city', 'town', 'village']
      .filter((r) => s[r])
      .map((r) => `${s[r]} ${r}${s[r] === 1 ? '' : r === 'city' ? 'ies' : 's'}`);

    return el('div.panel', [
      el('h3', m.name, el('span.count', 'commissioned')),
      el('p.prose', m.summary || ''),
      el('div.card-meta', [
        pill('no plate yet'),
        pill(`${m.grid.cols} × ${m.grid.rows} reserved`),
        pill(`${s.count || 0} settlements`),
        pill(`${(c.plate || {}).minWidthPx || '?'} px minimum`),
      ]),
      el('h4', { style: 'margin-top:16px' }, 'What it is for'),
      el('p.prose', c.why || ''),
      el('h4', { style: 'margin-top:16px' }, 'The country'),
      el('p.prose', c.landmass || ''),
      el('h4', { style: 'margin-top:16px' }, 'Terrain budget'),
      el('div.grid.wide', (c.terrainBudget || []).map((b) => {
        const t = D.terrains.find((x) => x.id === b.terrain);
        return el('button.card', { type: 'button', onclick: () => open('terrain', b.terrain) }, [
          el('div.card-head', [
            el('span.card-title', [
              el('span', { style: `display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:7px;background:${(t && t.colour) || '#888'}` }),
              (t && t.name) || b.terrain,
            ]),
            pill(`${Math.round(b.share * 100)}%`),
          ]),
          el('div.card-sub', `${Math.round(b.share * m.grid.cols * m.grid.rows)} hexes of ${m.grid.cols * m.grid.rows}`),
        ]);
      })),
      ranks.length ? el('h4', { style: 'margin-top:16px' }, 'Settlements asked for') : null,
      ranks.length ? el('div.flow', ranks.map((r) => el('span.token', r))
        .concat(s.harbours ? [el('span.token', `${s.harbours} harbours`)] : [])) : null,
      el('h4', { style: 'margin-top:16px' }, 'Must have'),
      el('div.linklist', (c.mustHave || []).map((w) =>
        el('div.linkrow', { style: 'cursor:default' }, [el('strong', w)]))),
      el('h4', { style: 'margin-top:16px' }, 'Must not have'),
      el('div.linklist', (c.mustNotHave || []).map((w) =>
        el('div.linkrow', { style: 'cursor:default' }, [el('strong', w)]))),
      el('div.flow', { style: 'margin-top:16px' }, [
        el('a.btn', { href: 'mint/index.html' }, 'The mint — how this gets drawn'),
        el('a.btn.small', { href: 'art/mint/QUEUE.md' }, 'The queue'),
      ]),
    ]);
  }

  /** A panel of mini-map sheets: [path, caption] pairs, missing sheets skipped. */
  function sheetGallery(title, blurb, pairs) {
    const have = pairs.filter(([p]) => p);
    if (!have.length) return null;
    return el('div.panel', [
      el('h3', title, el('span.count', String(have.length))),
      el('p.prose', blurb),
      el('div.sheet-grid', have.map(([path, caption]) =>
        el('a.sheet', { href: path, target: '_blank', rel: 'noopener' }, [
          el('img', { src: path, alt: caption, loading: 'lazy' }),
          el('span.sheet-caption', caption),
        ])
      )),
    ]);
  }

  views.rules = function () {
    const section = (title, obj) => el('div.panel', [
      el('h3', title),
      el('div.deflist', Object.entries(obj)
        .filter(([k, v]) => !k.startsWith('$') && typeof v !== 'object')
        .flatMap(([k, v]) => [el('dt', titleize(k.replace(/([A-Z])/g, '-$1').toLowerCase())), el('dd', String(v))])),
      obj.notes ? el('p.prose', obj.notes) : null,
    ]);

    return el('div', [
      pageHead('Rules constants', 'Every dial in one place. These live in data/rules.json — none of them are balanced yet, and they are meant to be argued with.'),
      el('div.cols', [
        section('Effort', R.effort),
        section('Population & food', R.population),
        section('Construction', R.construction),
        section('Tools', R.tools),
        section('Storage', R.storage),
        section('Market', R.market),
        section('Exploration', R.exploration),
        section('Conflict', R.conflict),
      ]),
      el('div.panel', [
        el('h3', 'Tool sizes'),
        el('div.table-wrap', el('table', [
          el('thead', el('tr', [el('th', 'Size'), el('th.num', 'Output ×'), el('th.num', 'Durability ×'), el('th.num', 'Cost ×')])),
          el('tbody', R.tools.sizes.map((s) =>
            el('tr', [el('td', titleize(s.id)), el('td.num', String(s.outputMultiplier)), el('td.num', String(s.durabilityMultiplier)), el('td.num', String(s.costMultiplier))])
          )),
        ])),
      ]),
      el('div.panel', [
        el('h3', 'Victory'),
        el('p.prose', R.victory.notes),
        el('div.linklist', R.victory.conditions.map((c) => el('div.linkrow', { style: 'cursor:default' }, [el('strong', c.name), el('div.lr-sub', c.summary)]))),
      ]),
    ]);
  };

  views.chains = function () {
    const target = state.filters.chainTarget || 'steel';
    const interesting = D.commodities
      .filter((c) => D.tierOf(c.id) >= 2)
      .sort((a, b) => D.tierOf(b.id) - D.tierOf(a.id) || a.name.localeCompare(b.name));

    const tree = D.chain(target, 5);

    function renderNode(node, qty) {
      const c = D.byId.commodity.get(node.commodity);
      const head = el('span', [
        qty ? el('span.qty', `${qty}× `) : null,
        el('button.token', { type: 'button', onclick: () => open('commodity', node.commodity) }, c ? c.name : node.commodity),
        node.via ? el('span.hint', ` via ${node.via.name}${node.isFuel ? ' (fuel)' : ''}`) : el('span.hint.leaf', ' — raw'),
      ]);
      return el('li', [head, node.children.length ? el('ul', node.children.map((ch) => renderNode(ch, ch.qty))) : null]);
    }

    return el('div', [
      pageHead('Production chains', 'What it really takes to make one unit of something, all the way down to the ground it came out of.'),
      el('div.toolbar', [
        el('label', { for: 'chain-pick', style: 'font-size:13px;color:var(--ink-soft)' }, 'Make:'),
        el('select#chain-pick', {
          onchange: (e) => { state.filters.chainTarget = e.target.value; global.App.render(); },
        }, interesting.map((c) => el('option', { value: c.id, selected: c.id === target }, `${c.name} (tier ${D.tierOf(c.id)})`))),
        pill(`${D.effortToProduce(target).toFixed(1)}h of effort per unit`, 'accent'),
        pill(`${D.byId.commodity.get(target).baseValue}${R.currency.symbol} base value`),
      ]),
      el('div.panel', el('ul.tree', [renderNode(tree)])),
      el('div.cols', [
        el('div.panel', [
          el('h3', 'Made by'),
          el('div.linklist', D.producersOf(target).map((r) =>
            el('button.linkrow', { type: 'button', onclick: () => open('recipe', r.id) }, [el('strong', r.name), el('div.lr-sub', siteText(r))])
          )),
        ]),
        el('div.panel', [
          el('h3', 'Used for'),
          el('div.linklist', [
            ...D.consumersOf(target).map((r) => el('button.linkrow', { type: 'button', onclick: () => open('recipe', r.id) }, [el('strong', r.name), el('div.lr-sub', 'recipe input')])),
            ...D.buildingsUsing(target).map((b) => el('button.linkrow', { type: 'button', onclick: () => open('building', b.id) }, [el('strong', b.name), el('div.lr-sub', 'building material')])),
            ...D.itemsUsing(target).map((i) => el('button.linkrow', { type: 'button', onclick: () => open('item', i.id) }, [el('strong', i.name), el('div.lr-sub', 'equipment')])),
          ]),
        ]),
      ]),
    ]);
  };

  /* --------------------------------------------------------------- drawer */

  const detail = {};

  detail.commodity = function (c) {
    return [
      el('span.kicker', D.categories.commodity.find((x) => x.id === c.category)?.name || c.category),
      el('h2', c.name),
      c.notes ? el('p.prose', c.notes) : null,
      el('section', [
        el('h4', 'Numbers'),
        el('div.deflist', [
          el('dt', 'Unit'), el('dd', c.unit),
          el('dt', 'Bulk'), el('dd', String(c.bulk)),
          el('dt', 'Base value'), el('dd', `${c.baseValue}${R.currency.symbol}`),
          el('dt', 'Value / slot'), el('dd', D.valueDensity(c).toFixed(1)),
          el('dt', 'Chain tier'), el('dd', String(D.tierOf(c.id))),
          el('dt', 'Effort / unit'), el('dd', D.effortToProduce(c.id).toFixed(1) + 'h'),
          c.perishRounds ? el('dt', 'Perishes') : null,
          c.perishRounds ? el('dd', `${c.perishRounds} rounds`) : null,
        ].filter(Boolean)),
      ]),
      c.tags && c.tags.length ? el('section', [el('h4', 'Tags'), el('div.card-meta', c.tags.map((t) => pill(t)))]) : null,
      linkSection('Produced by', D.producersOf(c.id).map((r) => ['recipe', r.id, r.name, siteText(r)])),
      linkSection('Consumed by', D.consumersOf(c.id).map((r) => ['recipe', r.id, r.name, siteText(r)])),
      linkSection('Builds', D.buildingsUsing(c.id).map((b) => ['building', b.id, b.name, `${b.cost.find((x) => x.commodity === c.id).qty} needed`])),
      linkSection('Makes tools', D.toolsUsing(c.id).map((t) => ['tool', t.id, t.name, ''])),
      linkSection('Makes equipment', D.itemsUsing(c.id).map((i) => ['item', i.id, i.name, ''])),
    ];
  };

  detail.recipe = function (r) {
    return [
      el('span.kicker', D.categories.recipe.find((x) => x.id === r.category)?.name || r.category),
      el('h2', r.name),
      el('section', [el('h4', 'Batch'), flow(r)]),
      D.variants(r).length > 1
        ? el('section', [el('h4', 'Alternatives'), el('div', D.variants(r).slice(1).map((v) => flow(r, v)))])
        : null,
      el('section', [
        el('h4', 'Where'),
        el('p.prose', siteText(r)),
        el('div.deflist', [
          el('dt', 'Effort'), el('dd', `${r.effortHours}h per batch`),
          r.tool ? el('dt', 'Tool') : null, r.tool ? el('dd', D.name('tool', r.tool)) : null,
          r.maturationRounds ? el('dt', 'Waiting') : null, r.maturationRounds ? el('dd', `${r.maturationRounds} rounds`) : null,
          r.depletesDeposit ? el('dt', 'Depletes') : null, r.depletesDeposit ? el('dd', `${r.depletesDeposit} from the deposit`) : null,
        ].filter(Boolean)),
      ]),
      r.effect ? el('section', [el('h4', 'Effect'), el('p.prose', r.effect)]) : null,
      r.notes ? el('section', [el('h4', 'Notes'), el('p.prose', r.notes)]) : null,
      r.rollTable ? rollTableSection(r.rollTable) : null,
    ];
  };

  function rollTableSection(tableId) {
    const t = D.raw.recipes.rollTables[tableId];
    return el('section', [
      el('h4', `Roll table (${t.die})`),
      el('table', el('tbody', Object.entries(t.results).map(([roll, res]) =>
        el('tr', [
          el('td.num', roll),
          el('td', (res.outputs || []).map((o) => `${o.qty} ${D.name('commodity', o.commodity)}`).join(', ') || res.text || '—'),
        ])
      ))),
      t.modifiers ? el('ul', { style: 'padding-left:18px;color:var(--ink-soft);font-size:13px' }, t.modifiers.map((m) => el('li', `${m.when}: ${m.effect}`))) : null,
    ]);
  }

  detail.building = function (b) {
    const recipes = D.recipesAt(b.id);
    return [
      el('span.kicker', D.categories.building.find((x) => x.id === b.category)?.name || b.category),
      el('h2', b.name),
      b.summary ? el('p.prose', b.summary) : null,
      el('section', [
        el('h4', 'Cost'),
        el('div.flow', [
          ...(b.cost || []).map((c) => token(c.commodity, c.qty)),
          el('span.arrow', '+'),
          el('span.token.effort', `${b.buildPoints} build-pts`),
          pill(`min ${b.minRounds || 1} rounds`),
        ]),
      ]),
      el('section', [
        el('h4', 'Capabilities'),
        el('div.deflist', [
          b.workerSlots !== undefined ? el('dt', 'Worker slots') : null, b.workerSlots !== undefined ? el('dd', String(b.workerSlots)) : null,
          b.housing ? el('dt', 'Houses') : null, b.housing ? el('dd', `${b.housing} workers`) : null,
          b.storage ? el('dt', 'Storage') : null, b.storage ? el('dd', `${b.storage} slots`) : null,
          b.fieldSlots ? el('dt', 'Fields') : null, b.fieldSlots ? el('dd', String(b.fieldSlots)) : null,
          b.livestockSlots ? el('dt', 'Livestock') : null, b.livestockSlots ? el('dd', String(b.livestockSlots)) : null,
          b.victoryPoints ? el('dt', 'Victory points') : null, b.victoryPoints ? el('dd', String(b.victoryPoints)) : null,
          b.specialist ? el('dt', 'Specialist') : null, b.specialist ? el('dd', D.name('profession', b.specialist)) : null,
          b.requiresBuilding ? el('dt', 'Requires') : null, b.requiresBuilding ? el('dd', D.name('building', b.requiresBuilding)) : null,
        ].filter(Boolean)),
      ]),
      b.terrain ? el('section', [el('h4', 'Terrain'), el('div.card-meta', b.terrain.map((t) => pill(D.name('terrain', t))))]) : null,
      linkSection('Recipes here', recipes.map((r) => ['recipe', r.id, r.name, `${r.effortHours}h`])),
      b.notes ? el('section', [el('h4', 'Notes'), el('p.prose', b.notes)]) : null,
    ];
  };

  detail.tool = function (t) {
    return [
      el('span.kicker', `${t.family} tool`),
      el('h2', t.name),
      el('p.prose', t.summary),
      el('section', [
        el('h4', 'Making one'),
        el('div.flow', [...t.craft.inputs.map((i) => token(i.commodity, i.qty)), el('span.token.effort', `${t.craft.effortHours}h`), el('span.arrow', '→'), el('span.token.out', t.name)]),
        el('p.prose', `Made at the ${D.name('building', t.madeAt)}.`),
      ]),
      el('section', [
        el('h4', 'Durability'),
        el('div.deflist', R.tools.sizes.filter((s) => t.sizes.includes(s.id)).flatMap((s) => [
          el('dt', titleize(s.id)),
          el('dd', `${Math.round(t.baseDurability * s.durabilityMultiplier)} wear · ×${s.outputMultiplier} output · ×${s.costMultiplier} cost`),
        ])),
        el('p.prose', `One wear point per hour of effort. ${R.tools.brokenToolEffect}`),
      ]),
      linkSection('Enables', t.enables.map((id) => ['recipe', id, D.name('recipe', id), ''])),
    ];
  };

  detail.terrain = function (t) {
    return [
      el('span.kicker', t.family),
      el('h2', t.name),
      t.summary ? el('p.prose', t.summary) : null,
      el('section', [
        el('h4', 'Costs'),
        el('div.deflist', [
          el('dt', 'Move'), el('dd', String(t.moveCost)),
          el('dt', 'Road ×'), el('dd', String(t.roadCostMultiplier)),
          el('dt', 'Rail ×'), el('dd', String(t.railCostMultiplier)),
          el('dt', 'Buildable'), el('dd', t.buildable ? 'yes' : 'no'),
        ]),
      ]),
      t.deposits ? linkSection('Possible deposits', t.deposits.map((d) => ['deposit', d, D.name('deposit', d), ''])) : null,
      linkSection('Worked here', D.recipesOnTerrain(t.id).map((r) => ['recipe', r.id, r.name, `${r.effortHours}h`])),
      linkSection('Buildable here', D.buildings.filter((b) => (b.terrain || []).includes(t.id)).map((b) => ['building', b.id, b.name, ''])),
    ];
  };

  detail.deposit = function (d) {
    return [
      el('span.kicker', 'deposit'),
      el('h2', d.name),
      d.summary ? el('p.prose', d.summary) : null,
      el('section', [
        el('h4', 'Numbers'),
        el('div.deflist', [
          el('dt', 'Yields'), el('dd', d.yields.map((y) => D.name('commodity', y)).join(', ')),
          /* One token is one prospect and they differ - see data/deposits.json.
             The spread is the interesting number, so it is shown before the sum. */
          el('dt', 'Tokens'), el('dd', `${d.tokenYields.length} — ${d.tokenYields.join(' · ')}`),
          el('dt', 'Richest'), el('dd', `${Math.max.apply(null, d.tokenYields)}, and the poorest ${Math.min.apply(null, d.tokenYields)}`),
          el('dt', 'Total yield'), el('dd', String(d.tokenYields.reduce((a, b) => a + b, 0))),
          el('dt', 'Survey'), el('dd', `${d.surveyDifficulty}+ on a d6`),
          el('dt', 'Needs'), el('dd', d.requiresBuilding ? D.name('building', d.requiresBuilding) : 'no building'),
        ]),
      ]),
    ];
  };

  detail.modification = function (m) {
    return [
      el('span.kicker', `modification · ${m.class}${m.element ? ' · ' + m.element : ''}`),
      el('h2', m.name),
      el('p.prose', m.story),
      el('section', [el('h4', 'Effect'), el('p.prose', m.effect)]),
      el('section', [
        el('h4', 'Numbers'),
        el('div.deflist', [
          el('dt', 'Fits'), el('dd', m.fits.map((f) => (f === 'any' ? 'any vehicle' : D.name('mode', f))).join(', ')),
          el('dt', 'Fitted at'), el('dd', D.name('building', m.madeAt)),
          m.manaCost ? el('dt', 'Mana') : null, m.manaCost ? el('dd', `${m.manaCost} ${m.element}`) : null,
          m.inputs ? el('dt', 'Made from') : null,
          m.inputs ? el('dd', m.inputs.map((i) => `${i.qty} × ${D.name('commodity', i.commodity)}`).join(', ')) : null,
          m.baseValue ? el('dt', 'Value') : null, m.baseValue ? el('dd', `${m.baseValue}${R.currency.symbol}`) : null,
          m.massKg ? el('dt', 'Mass') : null, m.massKg ? el('dd', `${m.massKg} kg`) : null,
        ].filter(Boolean)),
      ]),
    ];
  };

  detail.enchantment = function (e) {
    return [
      el('span.kicker', `enchantment · ${e.element}`),
      el('h2', e.name),
      el('p.prose', e.story),
      el('section', [el('h4', 'Effect'), el('p.prose', e.effect)]),
      el('section', [
        el('h4', 'Binding'),
        el('div.deflist', [
          el('dt', 'Costs'), el('dd', `${e.cost} ${e.element} mana`),
          el('dt', 'Bound to'), el('dd', e.boundTo),
          el('dt', 'Where'), el('dd', D.raw.arcana.enchantments.binding.where),
          el('dt', 'Slots'), el('dd', D.raw.arcana.enchantments.binding.slots),
        ]),
      ]),
    ];
  };

  detail.card = function (c) {
    return [
      el('span.kicker', `${c.category} · ${c.scope}`),
      el('h2', c.name),
      el('p.prose', c.text),
      el('section', [
        el('h4', 'Effects'),
        el('ul', { style: 'padding-left:18px;font-size:13.5px' }, (c.effects || []).map((fx) => el('li', describeEffect(fx)))),
      ]),
      c.mitigations ? el('section', [el('h4', 'Mitigations'), el('ul', { style: 'padding-left:18px;font-size:13.5px;color:var(--ink-soft)' }, c.mitigations.map((m) => el('li', m)))]) : null,
      el('section', [el('h4', 'Deck'), el('p.prose', `${c.copies || 1} cop${(c.copies || 1) === 1 ? 'y' : 'ies'} in the deck.`)]),
    ];
  };

  function describeEffect(fx) {
    if (fx.text) return fx.text;
    if (fx.type === 'choice') return 'Choice: ' + fx.branches.map((b) => b.label).join(' / ');
    const bits = [fx.type];
    if (fx.op) bits.push(fx.op);
    if (fx.commodity) bits.push(D.name('commodity', fx.commodity));
    if (fx.family) bits.push(fx.family);
    if (fx.value !== undefined) bits.push(String(fx.value));
    if (fx.qty !== undefined) bits.push(`×${fx.qty}`);
    if (fx.target) bits.push(`→ ${fx.target}`);
    if (fx.rounds) bits.push(`for ${fx.rounds} round(s)`);
    return bits.join(' · ');
  }

  detail.item = function (i) {
    return [
      el('span.kicker', i.class),
      el('h2', [i.name, i.cardCode ? ' ' : null, i.cardCode ? el('span.card-code', i.cardCode) : null]),
      plateFull(D.art('item', i), i.name),
      i.story ? el('p.prose', i.story) : null,
      el('section', [
        el('h4', 'Making one'),
        el('div.flow', [...i.inputs.map((x) => token(x.commodity, x.qty)), el('span.token.effort', `${i.effortHours}h`), el('span.arrow', '→'), el('span.token.out', i.name)]),
        i.madeAt ? el('p.prose', `Made at the ${D.name('building', i.madeAt)}${i.specialist ? `, by a ${D.name('profession', i.specialist)}` : ''}.`) : null,
      ]),
      el('section', [el('h4', 'Effects'), el('ul', { style: 'padding-left:18px;font-size:13.5px' }, (i.effects || []).map((e) => el('li', e)))]),
      el('section', [el('h4', 'Value and mass'), el('div.deflist', [
        el('dt', 'Base'), el('dd', `${i.baseValue}${R.currency.symbol}`),
        el('dt', 'Mass'), el('dd', `${i.massKg} kg — counts against what the carrier's strength lets them lift`),
      ])]),
    ];
  };

  detail.monster = function (m) {
    const opts = [['Slay', true], ['Enslave', m.options.enslave], ['Befriend', m.options.befriend], ['Domesticate', m.options.domesticate]];
    return [
      el('span.kicker', `monster · ${m.element}${m.unique ? ' · unique' : ''}`),
      el('h2', [m.name, ' ', el('span.card-code', m.cardCode)]),
      plateFull(D.art('monster', m), m.name),
      el('p.prose', m.story),
      el('section', [
        el('h4', 'Numbers'),
        el('div.deflist', [
          el('dt', 'S — strength'), el('dd', `${m.strength}. What it swings with.`),
          el('dt', 'D — defence'), el('dd', `${m.defence}. Add it to the number you need to hit.`),
          el('dt', 'H — health'), el('dd', String(m.health)),
          el('dt', 'Y — mana yield'), el('dd', `${m.manaYield} ${m.element} mana, split among the slayers`),
          el('dt', 'Home ground'), el('dd', m.terrains.map((t) => D.name('terrain', t)).join(', ')),
        ]),
      ]),
      el('section', [
        el('h4', 'Options'),
        el('div.card-meta', opts.map(([label, ok]) => pill(label, ok ? 'good' : 'bad'))),
        m.gift ? el('p.prose', `Gift to befriend: ${m.gift}.`) : null,
        m.befriended ? el('p.prose', `Befriended: ${m.befriended}`) : null,
        m.enslaved ? el('p.prose', `Enslaved: ${m.enslaved}`) : null,
        m.domesticated ? el('p.prose', `Domesticated: ${m.domesticated}`) : null,
      ]),
    ];
  };

  detail.vehicle = function (v) {
    return [
      el('span.kicker', `vehicle · ${D.name('mode', v.mode) || v.mode}`),
      el('h2', [v.name, ' ', el('span.card-code', v.cardCode)]),
      plateFull(D.art('vehicle', v), v.name),
      el('p.prose', v.story),
      el('section', [
        el('h4', 'The card'),
        el('div.deflist', [
          el('dt', 'Damage'), el('dd', `${v.damageBoxes} boxes — harm bar, left edge`),
          el('dt', 'Cargo'), el('dd', `${v.cargoCapacity} bulk — capacity bar, right edge`),
        ]),
        el('p.prose', `A vehicle whose damage bar fills is wrecked: cargo spills onto the hex, and salvage is whoever reaches it first.`),
      ]),
      el('section', [el('h4', 'Quirk'), el('p.prose', v.quirk)]),
    ];
  };

  detail.character = function (c) {
    return [
      el('span.kicker', `character · ${D.name('people', c.people)} ${c.calling}`),
      el('h2', [c.name, ' ', el('span.card-code', c.cardCode)]),
      plateFull(D.art('character', c), c.name),
      el('p.prose', c.story),
      el('section', [
        el('h4', 'The summary strip'),
        el('div.deflist', [
          el('dt', 'H — health'), el('dd', `${c.health}. Only medical aid puts it back; sleeping does not.`),
          el('dt', 'S — strength'), el('dd', `${c.strength}. What ${c.name.split(' ')[0]} swings with, and ${carryKg(c.strength)} kg of what they can shoulder.`),
          el('dt', 'D — defence'), el('dd', `${c.defence}. Read by whoever is attacking them, never by them.`),
          el('dt', 'M — mana'), el('dd', c.manaCapacity ? `${c.manaCapacity} held in the body.` : 'none held in the body — talismans only.'),
          el('dt', `${R.currency.symbol} — gold`), el('dd', `${c.startingGold} to start.`),
          el('dt', 'KG — carries'), el('dd', `${carryKg(c.strength)} kg. Derived, not designed: strength × ${R.carrying.kgPerStrength}.`),
          ...(c.manaNote ? [el('dt', 'Note'), el('dd', c.manaNote)] : []),
        ]),
      ]),
      el('section', [el('h4', 'Traits'), el('ul', { style: 'padding-left:18px;font-size:13.5px' }, c.traits.map((t) => el('li', t)))]),
      c.startsWith && c.startsWith.length
        ? linkSection('Starts with', c.startsWith.map((id) => ['item', id, D.name('item', id), '']))
        : null,
    ];
  };

  detail.quest = function (q) {
    const reward = (r) => [
      r.coin ? `${r.coin}${R.currency.symbol}` : null,
      r.mana ? `${r.mana.qty} ${r.mana.element} mana` : null,
      r.note,
    ].filter(Boolean).join(' · ');
    return [
      el('span.kicker', `quest · ${q.type} · complexity ${q.complexity}`),
      el('h2', [q.name, ' ', el('span.card-code', q.cardCode)]),
      q.hook ? el('p.prose', q.hook) : null,
      q.task ? el('section', [el('h4', 'Task'), el('p.prose', q.task)]) : null,
      q.stages ? el('section', [
        el('h4', 'Stages'),
        el('ol', { style: 'padding-left:18px;font-size:13.5px' }, q.stages.map((s) =>
          el('li', [el('strong', s.name), s.task ? ` — ${s.task}` : '', s.reward ? el('div.lr-sub', reward(s.reward)) : null]))),
      ]) : null,
      q.reward ? el('section', [el('h4', 'Reward'), el('p.prose', reward(q.reward))]) : null,
      q.notes ? el('section', [el('h4', 'Notes'), el('p.prose', q.notes)]) : null,
    ];
  };

  detail.spell = function (s) {
    return [
      el('span.kicker', `spell · ${s.element}`),
      el('h2', s.name),
      el('section', [el('h4', 'Cost'), el('p.prose', `${s.cost} ${s.element} mana`)]),
      el('section', [el('h4', 'Effect'), el('p.prose', s.effect)]),
    ];
  };

  detail.mode = function (m) {
    return [
      el('span.kicker', `transport · tier ${m.tier}`),
      el('h2', m.name),
      el('p.prose', m.summary),
      el('section', [
        el('h4', 'Numbers'),
        el('div.deflist', [
          el('dt', 'Capacity'), el('dd', `${m.capacity} bulk`),
          el('dt', 'Speed'), el('dd', m.speedOnRoad ? `${m.speed} tiles (${m.speedOnRoad} on road)` : `${m.speed} tiles`),
          el('dt', 'Needs'), el('dd', m.requires === 'none' ? '—' : D.name('building', m.requires) || m.requires),
          el('dt', 'Loading'), el('dd', `${m.effortToLoad}h`),
          el('dt', 'Upkeep'), el('dd', `${m.upkeep}${R.currency.symbol} / round`),
          el('dt', 'Theft risk'), el('dd', '★'.repeat(m.theftRisk || 0) || 'none'),
        ]),
      ]),
      m.packaging ? el('section', [el('h4', 'Packaging'), el('div.flow', m.packaging.map((p) => token(p.commodity, p.qty))), el('p.prose', 'Returns with the empty vehicle.')]) : null,
      m.craft ? el('section', [el('h4', 'Building one'), el('div.flow', [...m.craft.inputs.map((c) => token(c.commodity, c.qty)), el('span.token.effort', `${m.craft.effortHours}h`)]), el('p.prose', `At the ${D.name('building', m.craft.building)}.`)]) : null,
      m.notes ? el('section', [el('h4', 'Notes'), el('p.prose', m.notes)]) : null,
    ];
  };

  function linkSection(title, rows) {
    if (!rows || !rows.length) return null;
    return el('section', [
      el('h4', `${title} (${rows.length})`),
      el('div.linklist', rows.map(([kind, id, name, sub]) =>
        el('button.linkrow', { type: 'button', onclick: () => open(kind, id) }, [
          el('strong', name), sub ? el('div.lr-sub', sub) : null,
        ])
      )),
    ]);
  }

  global.Views = { views, detail, setOpener, flow, token, siteText, pageHead, state };
})(window);
