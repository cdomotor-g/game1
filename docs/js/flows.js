/*
 * The flows of work: one small diagram per place of work, showing what goes
 * in and what comes out — inputs on the left, the process in the middle with
 * its effort, tool and specialist, yields on the right, and under every input
 * a small note saying where that thing comes from, so "what do I need to get
 * what I want" can be answered by walking left, diagram to diagram.
 *
 * This is the graph's opposite number. The web of things shows every tie at
 * once; a flow shows one workplace with everything unrelated removed. Both
 * are computed, never drawn: a diagram is a building's own jobs (recipes
 * sited there) and crafts (tools, equipment, vehicles and modifications made
 * there), read straight off the data, plus a few field diagrams for the work
 * done outside any wall. Edit the data and every flow redraws.
 *
 * One copy of the model and the renderer, same bargain as graph.js: the
 * explorer draws the Flows tab live from the bundle, tools/lib/flows.mjs
 * shim-loads this file and tools/build-flows.mjs writes docs/art/flows/ for
 * the rulebook, so the page and the book cannot disagree. The layout is plain
 * arithmetic — columns and stacked boxes — so the committed SVGs rebuild
 * byte-identical.
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------- the model */

  /* The work done outside any building, grouped so each diagram stays small.
     Presentation grouping, not data: the rows are still found by walking the
     recipes, and a group with no rows is not emitted. */
  const FIELD = [
    { id: 'field-gathering', title: 'In the open country', sub: ['Work that needs no building — only the right ground and the hours.'] },
    { id: 'field-arcane', title: 'Gathering the arcane', sub: ['The herbs, roots and blossoms that grow where nobody farms.'] },
    { id: 'field-prospecting', title: 'Afield with a figure', sub: ['Work done by a figure standing on the map rather than by a settlement.'] },
    { id: 'field-works', title: 'Works and construction', sub: ['Changing the map itself: clearing ground and raising buildings.'] },
  ];
  const FIELD_OF = { arcane: 'field-arcane', works: 'field-works' };

  function index(arr) { return new Map((arr || []).map((x) => [x.id, x])); }
  const qty = (io) => `${io.qty} × `;

  /**
   * Every diagram, computed. Returns { diagrams, uncovered } where uncovered
   * lists any recipe no diagram claimed — the coverage guard build-flows
   * fails on, so a new siting idea cannot silently drop a job from the book.
   */
  function build(DATA) {
    const names = {
      commodity: index(DATA.commodities.commodities),
      tool: index(DATA.tools.tools),
      building: index(DATA.buildings.buildings),
      terrain: index(DATA.terrain.terrains),
      deposit: index(DATA.deposits.deposits),
      profession: index(DATA.peoples.professions),
      figure: index(DATA.transport.figures),
    };
    const nameOf = (kind, id) => { const e = names[kind] && names[kind].get(id); return e ? e.name : id; };
    const recipes = DATA.recipes.recipes;
    const listNames = (kind, ids) => (ids || []).map((t) => nameOf(kind, t)).join(', ').replace(/, ([^,]*)$/, ' or $1');

    /* Which diagram is each recipe's home? */
    const homeOf = new Map();
    for (const r of recipes) {
      const s = r.site || {};
      homeOf.set(r.id,
        s.building ? s.building :
        s.orBuilding ? s.orBuilding :
        s.figure ? 'field-prospecting' :
        /* A WATERSIDE is a siting relationship exactly as a terrain list is, and
           lands in the same place for the same reason: it is work that needs no
           building, only the right ground and the hours. terrain.json siting
           puts it plainly - a shore is a relationship, not a kind of ground, and
           there is no coast to put in a terrain list - so a recipe sited on the
           bank has an empty `terrain` and used to fall through this chain to
           null. Angling for fish was the first recipe to do it and the coverage
           guard caught it, which is the guard working: the book would otherwise
           have quietly not shown a job. */
        (s.terrain && s.terrain.length) || (s.orTerrain && s.orTerrain.length) ||
        s.waterside || s.orWaterside ? (FIELD_OF[r.category] || 'field-gathering') :
        s.constructionSite ? 'field-works' : null);
    }

    /* Where a commodity comes from: the home of the first recipe that puts it
       out (alternatives and forage tables included), else the deposit that
       yields it. This is the note under every input. */
    const producedAt = new Map();
    const claim = (commodity, home) => { if (home && !producedAt.has(commodity)) producedAt.set(commodity, home); };
    for (const r of recipes) {
      for (const v of [r, ...(r.alternatives || [])]) for (const o of v.outputs || []) claim(o.commodity, homeOf.get(r.id));
      if (r.rollTable && DATA.recipes.rollTables[r.rollTable]) {
        for (const res of Object.values(DATA.recipes.rollTables[r.rollTable].results || {})) {
          for (const o of res.outputs || []) claim(o.commodity, homeOf.get(r.id));
        }
      }
    }
    const titleOf = (home) => {
      const f = FIELD.find((x) => x.id === home);
      return f ? f.title.toLowerCase() : `the ${nameOf('building', home)}`;
    };
    function sourceOf(commodityId, here) {
      const home = producedAt.get(commodityId);
      if (home) return home === here ? 'made here' : `from ${titleOf(home)}`;
      const dep = DATA.deposits.deposits.find((d) => (d.yields || []).includes(commodityId));
      return dep ? `from a ${dep.name}` : null;
    }

    const token = (kind, refKind, io, here) => ({
      kind, ref: { kind: refKind, id: io.commodity || io.id },
      label: (io.qty !== undefined ? qty(io) : '') + nameOf(refKind === 'commodities' ? 'commodity' : refKind, io.commodity || io.id),
      sub: refKind === 'commodities' && here !== undefined ? sourceOf(io.commodity, here) : null,
    });
    const ioText = (arr) => (arr || []).map((i) => `${i.qty} ${nameOf('commodity', i.commodity)}`).join(' + ') || 'nothing';

    function jobRow(r, here) {
      const s = r.site || {};
      const lines = [];
      let l1 = `${r.effortHours || 0}h effort`;
      if (r.tool) l1 += ` · needs ${nameOf('tool', r.tool)}`;
      if (r.toolBonus) l1 += ` (${nameOf('tool', r.toolBonus.tool)} ÷${r.toolBonus.effortDivisor})`;
      lines.push(l1);
      if (r.specialist) lines.push(`by a ${nameOf('profession', r.specialist)}`);
      const site = [];
      if (s.deposit) site.push(`at a ${nameOf('deposit', s.deposit)}`);
      if (s.figure) site.push(`with the ${nameOf('figure', s.figure)}`);
      if (s.terrain && s.terrain.length) site.push(`${s.building || s.orBuilding ? 'or out ' : ''}on ${listNames('terrain', s.terrain)}`);
      if (s.orTerrain && s.orTerrain.length) site.push(`or on ${listNames('terrain', s.orTerrain)}`);
      if (s.waterside) site.push(`at ${s.waterside === 'any' ? 'any' : s.waterside} waterside`);
      if (s.orWaterside) site.push(`or at ${s.orWaterside} waterside`);
      if (s.constructionSite) site.push('at any construction site');
      if (s.fieldSlot) site.push('takes a field slot');
      if (site.length) lines.push(site.join(', '));
      if (r.maturationRounds) lines.push(`${r.maturationRounds} rounds to mature`);

      const inputs = (r.inputs || []).map((i) => token('commodity', 'commodities', i, here));
      if (r.fuel && DATA.recipes.fuelOptions[r.fuel]) {
        const opts = DATA.recipes.fuelOptions[r.fuel].filter((o) => o && o.inputs);
        const first = opts[0];
        inputs.push({
          kind: 'fuel', ref: first.inputs[0] ? { kind: 'commodities', id: first.inputs[0].commodity } : null,
          label: `fuel: ${ioText(first.inputs)}`,
          sub: opts.length > 1 ? 'or ' + opts.slice(1).map((o) => ioText(o.inputs)).join(' / ') : null,
        });
      }

      let outputs = (r.outputs || []).map((o) => token('commodity', 'commodities', o));
      let yieldText = null;
      if (!outputs.length) {
        if (r.rollTable && DATA.recipes.rollTables[r.rollTable]) {
          const t = DATA.recipes.rollTables[r.rollTable];
          const found = [...new Set(Object.values(t.results || {}).flatMap((res) => (res.outputs || []).map((o) => o.commodity)))];
          yieldText = `roll a ${t.die} — ` + (found.length ? listNames('commodity', found) : 'see its table');
        } else if (r.buildPointsPerHour) {
          yieldText = `${r.buildPointsPerHour} build point${r.buildPointsPerHour > 1 ? 's' : ''} per hour`;
        }
      } else if (r.rollTable && DATA.recipes.rollTables[r.rollTable]) {
        const t = DATA.recipes.rollTables[r.rollTable];
        const found = [...new Set(Object.values(t.results || {}).flatMap((res) => (res.outputs || []).map((o) => o.commodity)))];
        if (found.length) yieldText = `roll a ${t.die}: ` + listNames('commodity', found);
      }

      return {
        ref: { kind: 'recipes', id: r.id }, name: r.name, lines,
        inputs, outputs, yieldText,
        note: r.effect || null,
        also: (r.alternatives || []).map((a) => `or ${ioText(a.inputs)} → ${ioText(a.outputs)}`),
      };
    }

    function craftRow(verb, refKind, thing, inputs, effortHours, specialist, extra) {
      const lines = [`${effortHours || 0}h effort`];
      if (specialist) lines.push(`by a ${nameOf('profession', specialist)}`);
      if (extra) lines.push(extra);
      return {
        ref: { kind: refKind, id: thing.id }, name: `${verb} ${thing.name}`, lines,
        inputs: (inputs || []).map((i) => token('commodity', 'commodities', i, thing.madeAt)),
        outputs: [{ kind: 'made', ref: { kind: refKind, id: thing.id }, label: thing.name, sub: null }],
        yieldText: null, note: null, also: [],
      };
    }

    /* Assemble: buildings in their own data order, field groups after. */
    const diagrams = [];
    const uncovered = [];
    const rowsFor = new Map();
    const push = (home, row) => { if (!rowsFor.has(home)) rowsFor.set(home, []); rowsFor.get(home).push(row); };

    for (const r of recipes) {
      const home = homeOf.get(r.id);
      if (!home) { uncovered.push(r.id); continue; }
      push(home, jobRow(r, home));
    }
    for (const t of DATA.tools.tools) push(t.madeAt, craftRow('Make:', 'tools', t, t.craft.inputs, t.craft.effortHours));
    for (const it of DATA.items.items) push(it.madeAt, craftRow('Make:', 'items', it, it.inputs, it.effortHours, it.specialist));
    for (const m of DATA.transport.modes) {
      if (m.craft) push(m.craft.building, craftRow('Build:', 'transport', { id: m.id, name: m.name, madeAt: m.craft.building }, m.craft.inputs, m.craft.effortHours));
    }
    for (const mo of DATA.modifications.modifications) {
      push(mo.madeAt, craftRow('Make:', 'modifications', mo, mo.inputs, mo.effortHours, mo.specialist,
        `fits: ${(mo.fits || []).join(', ')}`));
    }

    for (const b of DATA.buildings.buildings) {
      const rows = rowsFor.get(b.id);
      if (!rows) continue;
      const sub = [];
      if (b.cost && b.cost.length) sub.push(`Build it from ${ioText(b.cost)} — ${b.buildPoints} build points`);
      const stand = [];
      if (b.terrain && b.terrain.length) stand.push(`stands on ${listNames('terrain', b.terrain)}`);
      if (b.requiresBuilding) stand.push(`needs a ${nameOf('building', b.requiresBuilding)} first`);
      if (b.requiresDeposit) stand.push(`over a ${nameOf('deposit', b.requiresDeposit)}`);
      if (b.requiresDepositAny) stand.push(`over a ${listNames('deposit', b.requiresDepositAny)}`);
      if (b.specialist) stand.push(`run by a ${nameOf('profession', b.specialist)}`);
      if (stand.length) sub.push(stand.join(' · '));
      diagrams.push({ id: b.id, title: b.name, sub, ref: { kind: 'buildings', id: b.id }, rows });
    }
    for (const f of FIELD) {
      const rows = rowsFor.get(f.id);
      if (rows) diagrams.push({ id: f.id, title: f.title, sub: f.sub, ref: null, rows });
    }

    return { diagrams, uncovered };
  }

  /* ---------------------------------------------------------- the renderer */

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const r2 = (v) => Math.round(v * 100) / 100;
  /* A serif at these sizes averages just over half an em per glyph; sizing
     boxes from that estimate is what keeps the layout pure arithmetic. */
  const textW = (s, fs) => s.length * fs * 0.54;

  function wrap(text, maxChars) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
      if (line && (line + ' ' + w).length > maxChars) { lines.push(line); line = w; }
      else line = line ? line + ' ' + w : w;
    }
    if (line) lines.push(line);
    return lines;
  }

  const GEO = {
    w: 780, pad: 16,
    inX: 16, inW: 250,
    boxX: 300, boxW: 220,
    outX: 552, outW: 212,
    tokenH: 18, tokenGap: 5, subH: 10,
    rowPad: 12,
  };

  /**
   * One diagram as an SVG string. opts.colors:
   *   { wash: kindId -> stroke, fill: kindId -> pale fill,
   *     text, soft, faint, halo, rule, arrow }
   * Kind ids are data/graph.json ids, so a thing is inked here with the same
   * wash its dot wears in the web of things.
   */
  function toSVG(diagram, opts) {
    const C = opts.colors;
    const G = GEO;
    const parts = [];
    let out = [];

    const colorOf = (t) => {
      if (!t.ref && t.kind !== 'fuel') return { stroke: C.rule, fill: 'none' };
      const kind = t.ref ? t.ref.kind : 'commodities';
      return { stroke: C.wash[kind] || C.soft, fill: C.fill[kind] || 'none' };
    };

    function tokenSVG(t, x, y, maxW) {
      const fs = 9;
      const w = Math.min(Math.max(textW(t.label, fs) + 14, 40), maxW);
      const c = colorOf(t);
      const attrs = t.ref ? ` class="f-token" data-kind="${esc(t.ref.kind)}" data-id="${esc(t.ref.id)}"` : '';
      out.push(`<g${attrs}><rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${G.tokenH}" rx="4" fill="${esc(c.fill)}" stroke="${esc(c.stroke)}" stroke-width="1"/>` +
        `<text x="${r2(x + 7)}" y="${r2(y + 12.5)}" font-size="${fs}" fill="${esc(C.text)}">${esc(t.label)}</text></g>`);
      if (t.sub) out.push(`<text x="${r2(x + 7)}" y="${r2(y + G.tokenH + 8)}" font-size="7" fill="${esc(C.faint)}" font-style="italic">${esc(t.sub)}</text>`);
      return { w, h: G.tokenH + (t.sub ? G.subH : 0) };
    }

    /* --- measure + draw each row into `out`, tracking y ------------------- */
    const subLines = diagram.sub.flatMap((s) => wrap(s, 100));
    let y = 30 + subLines.length * 12 + 14;
    const header =
      `<text x="${G.pad}" y="24" font-size="15" font-weight="bold" fill="${esc(C.text)}"${diagram.ref ? ` class="f-token" data-kind="${esc(diagram.ref.kind)}" data-id="${esc(diagram.ref.id)}"` : ''}>${esc(diagram.title)}</text>` +
      subLines.map((s, i) => `<text x="${G.pad}" y="${r2(40 + i * 12)}" font-size="8.5" fill="${esc(C.soft)}">${esc(s)}</text>`).join('');

    for (let ri = 0; ri < diagram.rows.length; ri++) {
      const row = diagram.rows[ri];
      out = [];
      const rowTop = y;

      /* the process box: measured first, so the columns can centre on it */
      const boxLines = row.lines.flatMap((l) => wrap(l, 44));
      const boxH = 20 + boxLines.length * 11 + 6;

      /* inputs */
      let inH = 0;
      const inTokens = row.inputs.length ? row.inputs : [{ kind: 'nothing', ref: null, label: 'nothing but the hours', sub: null }];
      const inMeasures = [];
      for (const t of inTokens) { inMeasures.push(t); inH += G.tokenH + (t.sub ? G.subH : 0) + G.tokenGap; }
      inH -= G.tokenGap;

      /* outputs */
      let outH = 0;
      const outTokens = row.outputs || [];
      const yieldLines = row.yieldText ? wrap(row.yieldText, 40) : [];
      const noteLines = row.note ? wrap(row.note, 42) : [];
      outH = outTokens.length ? outTokens.length * (G.tokenH + G.tokenGap) - G.tokenGap : 0;
      if (yieldLines.length) outH += (outH ? 6 : 0) + yieldLines.length * 10;
      if (noteLines.length) outH += (outH ? 6 : 0) + noteLines.length * 9;

      const rowH = Math.max(inH, boxH, outH);
      const cy = rowTop + rowH / 2;

      /* draw inputs, arrows into the box */
      let iy = rowTop + (rowH - inH) / 2;
      for (const t of inMeasures) {
        const m = tokenSVG(t, G.inX, iy, G.inW);
        if (t.ref || t.kind === 'fuel') {
          out.push(`<line x1="${r2(G.inX + m.w + 2)}" y1="${r2(iy + G.tokenH / 2)}" x2="${r2(G.boxX - 4)}" y2="${r2(cy)}" stroke="${esc(C.arrow)}" stroke-width="0.8" marker-end="url(#f-arrow)"/>`);
        }
        iy += m.h + G.tokenGap;
      }

      /* the box */
      const boxTop = cy - boxH / 2;
      out.push(`<g class="f-token" data-kind="${esc(row.ref.kind)}" data-id="${esc(row.ref.id)}">` +
        `<rect x="${G.boxX}" y="${r2(boxTop)}" width="${G.boxW}" height="${r2(boxH)}" rx="5" fill="${esc(C.fill[row.ref.kind] || 'none')}" stroke="${esc(C.wash[row.ref.kind] || C.text)}" stroke-width="1.3"/>` +
        `<text x="${r2(G.boxX + G.boxW / 2)}" y="${r2(boxTop + 14)}" text-anchor="middle" font-size="10.5" font-weight="bold" fill="${esc(C.text)}">${esc(row.name)}</text>` +
        boxLines.map((l, i) => `<text x="${r2(G.boxX + G.boxW / 2)}" y="${r2(boxTop + 26 + i * 11)}" text-anchor="middle" font-size="8" fill="${esc(C.soft)}">${esc(l)}</text>`).join('') +
        '</g>');

      /* outputs, arrows out of the box */
      let oy = rowTop + (rowH - outH) / 2;
      for (const t of outTokens) {
        out.push(`<line x1="${r2(G.boxX + G.boxW + 4)}" y1="${r2(cy)}" x2="${r2(G.outX - 4)}" y2="${r2(oy + G.tokenH / 2)}" stroke="${esc(C.arrow)}" stroke-width="0.8" marker-end="url(#f-arrow)"/>`);
        tokenSVG(t, G.outX, oy, G.outW);
        oy += G.tokenH + G.tokenGap;
      }
      if (yieldLines.length) {
        if (outTokens.length) oy += 6 - G.tokenGap;
        out.push(`<line x1="${r2(G.boxX + G.boxW + 4)}" y1="${r2(cy)}" x2="${r2(G.outX - 4)}" y2="${r2(oy + 5)}" stroke="${esc(C.arrow)}" stroke-width="0.8" marker-end="url(#f-arrow)"/>`);
        yieldLines.forEach((l, i) => out.push(`<text x="${G.outX}" y="${r2(oy + 8 + i * 10)}" font-size="8.5" fill="${esc(C.text)}">${esc(l)}</text>`));
        oy += yieldLines.length * 10 + 6;
      }
      if (noteLines.length) {
        noteLines.forEach((l, i) => out.push(`<text x="${G.outX}" y="${r2(oy + 7 + i * 9)}" font-size="7.5" font-style="italic" fill="${esc(C.faint)}">${esc(l)}</text>`));
      }

      y = rowTop + rowH;

      /* the alternative input/output pairings, full width under the row */
      if (row.also.length) {
        for (const a of row.also.flatMap((s) => wrap(s, 110))) {
          y += 11;
          out.push(`<text x="${r2(G.inX + 8)}" y="${r2(y)}" font-size="8" fill="${esc(C.soft)}" font-style="italic">${esc(a)}</text>`);
        }
        y += 2;
      }

      y += G.rowPad;
      if (ri < diagram.rows.length - 1) {
        out.push(`<line x1="${G.pad}" y1="${r2(y - G.rowPad / 2)}" x2="${r2(G.w - G.pad)}" y2="${r2(y - G.rowPad / 2)}" stroke="${esc(C.rule)}" stroke-width="0.6"/>`);
      }
      parts.push(out.join('\n'));
    }

    const H = y + 4;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G.w} ${r2(H)}" font-family="Georgia, 'Times New Roman', serif">\n` +
      `<defs><marker id="f-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8z" fill="${esc(C.arrow)}"/></marker></defs>\n` +
      (opts.background ? `<rect width="${G.w}" height="${r2(H)}" fill="${esc(opts.background)}"/>\n` : '') +
      header + '\n' + parts.join('\n') + '\n</svg>';
  }

  global.Flows = { build, toSVG };
})(window);
