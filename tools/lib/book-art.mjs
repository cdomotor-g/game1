/**
 * Every picture the printed book may put on a page, indexed once.
 *
 * The book used to show a plate in two places - a section's title page and the
 * catalogue entry - and nothing anywhere else, so a chapter about battle ran
 * four pages without a monster on them. This is the index that lets any page
 * carry art: one entry per drawable artefact the repository already has, each
 * with a `ref` a chapter can name, the file it lives in, its proportions and
 * the name of the thing it is a picture of.
 *
 *   plate:<plate-id>     a drawn page, docs/art/renders/<plate-id>.png
 *   card:<CODE>          a built card front, docs/cards/<CODE>.svg
 *   tile:<building-id>   a building tile's face, docs/tiles/<id>.svg
 *   flow:<building-id>   the flow of work at a building, docs/art/flows/<id>.svg
 *   icon:<name>          a mark, docs/art/icons/<name>.svg
 *   board:<name>         a sheet - player, market, depletion, ledger, minimap-<terrain>
 *   map:<map-id>         a map's plate, drawn or generated
 *   graph:dependencies   the web of the data
 *   terrain:<id>         a terrain swatch, drawn inline from its mark
 *   <kind>:<id>          the best picture of a thing - monster:cinder-wolf,
 *                        building:granary, character:chr-06, people:elf,
 *                        item:lantern, spell:kindle, event:raiders, vehicle:veh-03
 *
 * Nothing here is authored: every entry is a file that exists and a record in
 * the data, and a ref that names neither fails the build. A chapter puts a
 * picture on its page with a {{fig:...}} token (see figureTokens); a page with
 * none gets vignettes of the things its own paragraphs mention (autoVignettes).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { cardsOfDeck } from './mint.mjs';
import { plateIdFor } from './plates.mjs';
import { escapeHtml as esc } from './docpage.mjs';

/** Width and height of a PNG from its IHDR, or of an SVG from its viewBox. */
function sizeOf(file) {
  if (file.endsWith('.png')) {
    const b = readFileSync(file);
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  const head = readFileSync(file, 'utf8').slice(0, 600);
  const vb = head.match(/viewBox="([\d.\-]+)\s+([\d.\-]+)\s+([\d.]+)\s+([\d.]+)"/);
  if (vb) return { w: +vb[3], h: +vb[4] };
  const w = head.match(/width="([\d.]+)"/); const h = head.match(/height="([\d.]+)"/);
  return { w: w ? +w[1] : 1, h: h ? +h[1] : 1 };
}

const plural = (n) => (n.endsWith('f') ? `${n.slice(0, -1)}ves` : n.endsWith('s') ? n : `${n}s`);

export function artIndex(root, data) {
  const RENDERS = join(root, 'docs', 'art', 'renders');
  const CARDS = join(root, 'docs', 'cards');
  const TILES = join(root, 'docs', 'tiles');
  const FLOWS = join(root, 'docs', 'art', 'flows');
  const ICONS = join(root, 'docs', 'art', 'icons');
  const entries = new Map();
  const BOOKART = join(root, 'docs', 'book', 'art');
  const add = (e) => {
    if (e.src?.startsWith('../')) e.abs = join(root, 'docs', e.src.slice(3));
    /* a drawn plate is shown from its JPEG copy (tools/build-book-art.mjs) when
       there is one: the same pixels, a fifth of the bytes; the small copy is for
       anything printed under fifty millimetres */
    if (e.what === 'plate' || e.what === 'map') {
      const id = e.what === 'map' ? `map-${e.id}` : e.ref.slice(6);
      if (existsSync(join(BOOKART, `${id}.jpg`))) { e.png = e.src; e.src = `art/${id}.jpg`; e.small = `art/${id}-s.jpg`; }
    }
    entries.set(e.ref, e); return e;
  };
  const file = (abs, rel) => (existsSync(abs) ? { abs, src: rel } : null);
  const shape = ({ w, h }) => (w / h > 1.15 ? 'landscape' : w / h < 0.87 ? 'portrait' : 'square');

  /* Each record of every deck: its plate if drawn, its card front if built. */
  const byThing = new Map(); /* `${kind}:${id}` -> the best picture of it */
  const KIND = { CHR: 'character', VEH: 'vehicle', MON: 'monster', TAL: 'talisman', MOD: 'modification', SPL: 'spell', EVT: 'event', QST: 'quest', CAM: 'chapter', ITM: 'item', WPN: 'weapon', ARM: 'armour', TOL: 'tool', BLD: 'building' };
  for (const deck of data.components.decks) {
    const kind = KIND[deck.prefix] ?? deck.id;
    for (const c of cardsOfDeck(root, deck)) {
      const names = [c.name, c.shortName].filter(Boolean);
      const thingId = deck.prefix === 'CHR' || deck.prefix === 'VEH' || deck.prefix === 'TAL' ? c.cardCode.toLowerCase() : c.id;
      const thing = `${kind}:${thingId}`;
      let best = null;
      let plateId = null;
      try { plateId = plateIdFor(deck, c); } catch { plateId = null; }
      const png = plateId && file(join(RENDERS, `${plateId}.png`), `../art/renders/${plateId}.png`);
      if (png) {
        const size = sizeOf(png.abs);
        best = add({ ref: `plate:${plateId}`, kind, thing, id: thingId, name: c.name, names, code: c.cardCode, src: png.src, ...size, shape: shape(size), element: c.element ?? null, campaign: c.campaign ?? null, what: 'plate' });
      }
      const svg = file(join(CARDS, `${c.cardCode}.svg`), `../cards/${c.cardCode}.svg`);
      if (svg) {
        const size = sizeOf(svg.abs);
        const card = add({ ref: `card:${c.cardCode}`, kind, thing, id: thingId, name: c.name, names, code: c.cardCode, src: svg.src, ...size, shape: shape(size), element: c.element ?? null, campaign: c.campaign ?? null, what: 'card' });
        best ??= card;
      }
      if (deck.prefix === 'BLD') {
        const tile = file(join(TILES, `${c.id}.svg`), `../tiles/${c.id}.svg`);
        if (tile) { const size = sizeOf(tile.abs); add({ ref: `tile:${c.id}`, kind, thing, id: c.id, name: c.name, names, code: c.cardCode, src: tile.src, ...size, shape: shape(size), what: 'tile' }); }
        const flow = file(join(FLOWS, `${c.id}.svg`), `../art/flows/${c.id}.svg`);
        if (flow) { const size = sizeOf(flow.abs); add({ ref: `flow:${c.id}`, kind, thing, id: c.id, name: c.name, names, code: c.cardCode, src: flow.src, ...size, shape: shape(size), what: 'flow' }); }
      }
      if (best && !byThing.has(thing)) byThing.set(thing, best);
      if (thingId !== c.id && best && !byThing.has(`${kind}:${c.id}`)) byThing.set(`${kind}:${c.id}`, best);
    }
  }
  for (const p of data.peoples.peoples) {
    const png = file(join(RENDERS, `people-${p.id}.png`), `../art/renders/people-${p.id}.png`);
    if (!png) continue;
    const size = sizeOf(png.abs);
    const e = add({ ref: `plate:people-${p.id}`, kind: 'people', thing: `people:${p.id}`, id: p.id, name: p.name, names: [p.name, plural(p.name)], src: png.src, ...size, shape: shape(size), what: 'plate' });
    byThing.set(`people:${p.id}`, e);
  }
  for (const f of readdirSync(ICONS).filter((f) => f.endsWith('.svg'))) {
    const id = f.replace(/\.svg$/, '');
    const size = sizeOf(join(ICONS, f));
    add({ ref: `icon:${id}`, kind: 'icon', thing: `icon:${id}`, id, name: id.replace(/-/g, ' '), names: [], src: `../art/icons/${f}`, ...size, shape: 'square', what: 'icon' });
  }
  const sheets = [
    ['player', 'docs/boards/player-board.svg', 'The player board'], ['market', 'docs/markets/market-board.svg', 'The market board'],
    ['depletion', 'docs/markets/depletion-sheet.svg', 'The depletion sheet'], ['ledger', 'docs/ledger/price-ledger.svg', 'The price ledger'],
  ];
  const MM = join(root, 'docs', 'minimaps', 'sheets');
  if (existsSync(MM)) for (const f of readdirSync(MM).filter((f) => f.startsWith('field-') && f.endsWith('.svg'))) sheets.push([`minimap-${f.slice(6, -4)}`, `docs/minimaps/sheets/${f}`, `A mini-map sheet: ${f.slice(6, -4).replace(/-/g, ' ')}`]);
  const BOARD_NAMES = { player: ['player board', 'encounter board', 'spare board'], market: ['market board', 'swing ruler'], depletion: ['depletion sheet', 'depletion grid'], ledger: ['price ledger', 'ledger'] };
  for (const [id, rel, name] of sheets) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    const size = sizeOf(abs);
    const e = add({ ref: `board:${id}`, kind: 'board', thing: `board:${id}`, id, name, names: BOARD_NAMES[id] ?? [], src: `../${rel.replace(/^docs\//, '')}`, ...size, shape: shape(size), what: 'board' });
    if (BOARD_NAMES[id]) byThing.set(`board:${id}`, e);
  }
  for (const m of (Array.isArray(data.maps) ? data.maps : Object.values(data.maps ?? {}))) {
    const id = m.id;
    const kind = m.plate?.kind ?? 'drawn';
    const ext = kind === 'generated' ? 'svg' : 'png';
    const abs = join(root, 'docs', 'map', `${id}.${ext}`);
    if (!existsSync(abs)) continue;
    const size = sizeOf(abs);
    const e = add({ ref: `map:${id}`, kind: 'map', thing: `map:${id}`, id, name: m.name ?? id, names: [m.name].filter(Boolean), src: `../map/${id}.${ext}`, ...size, shape: shape(size), campaign: m.campaign ?? null, what: 'map' });
    byThing.set(`map:${id}`, e);
  }
  const graph = join(root, 'docs', 'art', 'graph', 'dependencies.svg');
  if (existsSync(graph)) { const size = sizeOf(graph); byThing.set('graph:dependencies', add({ ref: 'graph:dependencies', kind: 'graph', thing: 'graph:dependencies', id: 'dependencies', name: 'The web of the data', names: ['dependency graph', 'the graph'], src: '../art/graph/dependencies.svg', ...size, shape: shape(size), what: 'graph' })); }
  const styleref = join(root, 'docs', 'art', 'style-reference.png');
  if (existsSync(styleref)) { const size = sizeOf(styleref); add({ ref: 'sheet:style-reference', kind: 'sheet', thing: 'sheet:style-reference', id: 'style-reference', name: 'The style reference sheet', names: [], src: '../art/style-reference.png', ...size, shape: shape(size), what: 'sheet' }); }
  const palette = JSON.parse(readFileSync(join(root, 'docs/art/palette.json'), 'utf8'));
  for (const t of data.terrain.terrains) {
    const wash = palette.terrain[t.id]?.wash ?? palette.paper.foxing.hex;
    const e = add({ ref: `terrain:${t.id}`, kind: 'terrain', thing: `terrain:${t.id}`, id: t.id, name: t.name, names: [t.name], w: 1, h: 1, shape: 'square', what: 'swatch',
      inline: `<span class="swatch" style="--wash:${wash}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${esc(t.mark?.path ?? '')}"/></svg><b>${esc(t.code)}</b></span>` });
    byThing.set(`terrain:${t.id}`, e);
  }

  /** A ref, resolved: an exact entry, or the best picture of a thing. */
  function resolve(ref) {
    const r = ref.trim();
    if (entries.has(r)) return entries.get(r);
    if (byThing.has(r)) return byThing.get(r);
    const [kind, id] = r.split(':');
    if (kind && id) {
      const alt = [...entries.values()].find((e) => e.kind === kind && (e.id === id || e.code?.toLowerCase() === id.toLowerCase()));
      if (alt) return alt;
    }
    return null;
  }

  /* Names a paragraph can mention, longest first, for the vignettes. Things whose
     name is an ordinary word of the rules are left out: a chapter that says
     "strike the old price through" is not talking about the Strike card. */
  const STOP = new Set(['strike', 'flood', 'glut', 'storms', 'road', 'rail', 'bridge', 'well', 'market', 'mill', 'farm', 'mine', 'hut', 'dock', 'bag', 'pasture', 'shrine', 'hammer', 'saw', 'axe', 'pick']);
  const mentions = [];
  for (const e of new Set(byThing.values())) {
    if (!['character', 'monster', 'building', 'vehicle', 'people', 'item', 'weapon', 'armour', 'talisman', 'tool', 'spell', 'event', 'modification', 'quest', 'chapter', 'terrain', 'map', 'board', 'graph'].includes(e.kind)) continue;
    for (const n of e.names) {
      if (!n || n.length < 4 || STOP.has(n.toLowerCase())) continue;
      mentions.push({ name: n, thing: e.thing, entry: e });
    }
  }
  mentions.sort((a, b) => b.name.length - a.name.length);

  return { entries, byThing, resolve, mentions, sizeOf };
}

/* ------------------------------------------------------------- figures */

/* A built card or tile is an SVG that draws its plate with <image href="../art/
   renders/…">, and a browser showing an SVG through <img> will not fetch that,
   so the card came out with an empty window. Inlined into the page the href
   resolves - docs/book/ and docs/cards/ are the same depth - and the picture is
   the card. Ids are prefixed per copy so two cards on a page do not share a
   clip path. */
let inlined = 0;
export function inlineSvg(abs, { attrs = '', root = null } = {}) {
  const pre = `i${++inlined}-`;
  let svg = readFileSync(abs, 'utf8').replace(/<\?xml[^>]*>\s*/, '').replace(/<!DOCTYPE[^>]*>\s*/, '');
  /* the window is printed small, so it reads the small copy of its plate when there is one */
  svg = svg.replace(/href="\.\.\/art\/renders\/([^"]+)\.png"/g, (m, id) => (root && existsSync(join(root, 'docs', 'book', 'art', `${id}-s.jpg`)) ? `href="art/${id}-s.jpg"` : m));
  svg = svg.replace(/\bid="([^"]+)"/g, (_, id) => `id="${pre}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${pre}${id})`)
    .replace(/href="#([^"]+)"/g, (_, id) => `href="#${pre}${id}"`);
  return svg.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} class="inl"${attrs ? ` ${attrs}` : ''}>`);
}
export const inlinesPlate = (e) => e.what === 'card' || e.what === 'tile';
/** The picture of an entry, as markup: a swatch, an inlined card or tile, or an <img>. */
export function pictureHtml(e, { attrs = '', small = false, root = null } = {}) {
  if (e.inline) return e.inline;
  if (inlinesPlate(e)) return inlineSvg(e.abs, { attrs, root });
  return `<img src="${small && e.small ? e.small : e.src}" alt="${esc(e.name)}" loading="lazy"${attrs ? ` ${attrs}` : ''}>`;
}

/** Width on the page for a figure size, in mm; a row shares the width between its pieces. */
const WIDTH = { margin: 42, third: 56, half: 84, wide: 180, row: 180 };

/* The title page's frieze, in mm. Its measure is the page less the 14mm of
   padding a title page takes on each side; the gap and the band are what
   tools/lib/book.css draws it at. */
const TFRIEZE = { measure: WIDTH.wide - 2 * 14, gap: 3, band: 30 };

/**
 * How tall a title page's frieze may stand, so that it fits the paper.
 *
 * Every other figure here is given a WIDTH and takes whatever height its
 * proportions make of it. The frieze is the one row built the other way up -
 * uniform height, because a shelf of pieces of different heights is not a shelf
 * - and being the exception it was the one nothing measured. It was a flat 30mm
 * on a non-wrapping centred flex row: six landscape pieces came to 285mm on a
 * 152mm measure and, centred, hung off both edges of the page.
 *
 * So the height is derived from what is actually in the row. Ask for the band,
 * and if the pieces will not fit at it, hand back the height at which they do.
 */
export function friezeBand(pieces) {
  const n = pieces.length;
  if (!n) return TFRIEZE.band;
  const aspect = (e) => (e.w > 0 && e.h > 0 ? e.w / e.h : 1);
  const total = pieces.reduce((sum, e) => sum + aspect(e), 0);
  const gaps = TFRIEZE.gap * (n - 1);
  if (TFRIEZE.band * total + gaps <= TFRIEZE.measure) return TFRIEZE.band;
  return (TFRIEZE.measure - gaps) / total;
}

export function figureHtml(pieces, { size = 'margin', caption = '', cls = '', row = null, root = null } = {}) {
  const n = pieces.length;
  const isRow = row ?? n > 1;
  const small = isRow || size === 'margin';
  const width = isRow ? WIDTH.row : (WIDTH[size] ?? WIDTH.margin);
  const each = isRow ? (width - 3 * (n - 1)) / n : width;
  const body = pieces.map((e) => {
    const inner = pictureHtml(e, { small, root });
    const h = e.inline ? each : Math.min(each * (e.h / e.w), isRow ? (cls === 'frieze' ? 44 : 70) : size === 'wide' ? 150 : 999);
    const w = e.inline ? each : Math.min(each, h * (e.w / e.h));
    const kindCls = e.what === 'card' ? ' card' : e.what === 'tile' ? ' tile' : e.what === 'icon' ? ' icon' : e.what === 'flow' ? ' flow' : '';
    return `<div class="fp${kindCls}" style="width:${w.toFixed(1)}mm">${inner}${isRow ? `<span class="pname">${esc(e.name)}</span>` : ''}</div>`;
  }).join('');
  const cap = caption || (!isRow ? pieces[0].name : '');
  return `<figure class="fig ${isRow ? 'row' : size}${cls ? ` ${cls}` : ''}" style="--fw:${width}mm">${body}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
}

/**
 * The {{fig:...}} tokens of a hand-written chapter. On a line of its own:
 *
 *   {{fig:monster:cinder-wolf}}                       a margin figure, captioned with the thing's name
 *   {{fig:monster:cinder-wolf|half|The cinder wolf.}} a size (margin · third · half · wide) and a caption
 *   {{fig:people:human,people:dwarf,people:elf|The peoples.}}   several refs make a row
 *   {{fig:a,b,c|frieze}}                               the row under a chapter head
 *
 * Every ref must resolve or the build fails naming the chapter and the token.
 */
export function figureTokens(text, art, where, { inlineFn = (s) => s, shown = new Set(), root = null } = {}) {
  const figs = [];
  /* what the chapter's own markdown already shows - a gallery, a flow - is not shown again */
  for (const m of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) shown.add(m[1].replace(/^\.\.\//, '../'));
  const out = text.replace(/^[ \t]*\{\{fig:([^}|]+)(?:\|([^}|]*))?(?:\|([^}]*))?\}\}[ \t]*$/gm, (_, refs, a, b) => {
    const pieces = refs.split(',').map((r) => {
      const e = art.resolve(r);
      if (!e) throw new Error(`${where}: {{fig:${r.trim()}}} names a picture the book does not have`);
      return e;
    }).filter((e) => !(e.src && shown.has(e.src)));
    if (!pieces.length) return '';
    const sizes = ['margin', 'third', 'half', 'wide', 'frieze'];
    let size = 'margin'; let caption = '';
    if (a != null && sizes.includes(a.trim())) { size = a.trim(); caption = (b ?? '').trim(); } else { caption = (a ?? '').trim(); if (b) caption = `${caption} ${b}`.trim(); }
    const frieze = size === 'frieze';
    const html = figureHtml(pieces, { size: frieze ? 'row' : size, caption: caption ? inlineFn(caption) : '', cls: frieze ? 'frieze' : (pieces.length === 1 && pieces[0].what === 'flow' ? 'flow' : ''), row: frieze || pieces.length > 1, root });
    figs.push({ html, things: pieces.map((e) => e.thing) });
    return `\n\n%%FIG${figs.length - 1}%%\n\n`;
  });
  return { text: out, figs, shown };
}

/** Put the rendered figures back where their placeholders landed. */
export function placeFigures(html, figs) {
  return html.replace(/<p>%%FIG(\d+)%%<\/p>/g, (_, n) => `<!--fig-->${figs[+n].html}<!--/fig-->`);
}

/**
 * Vignettes for the things a chapter mentions. Every paragraph is read for the
 * names in the index; the things most mentioned in the chapter win, each gets one
 * small figure at the paragraph where it is first named, and no two land within
 * `gap` paragraphs of each other or of a figure the author placed. Deterministic,
 * so --check holds.
 */
export function autoVignettes(html, art, { max = 6, gap = 3, skip = new Set(), root = null, longest = 2400 } = {}) {
  /* paragraphs and list items both count as a stretch of text a figure can sit beside */
  const parts = html.split(/(?=<p[ >])|(?<=<\/p>)|(?=<li[ >])|(?<=<\/li>)/);
  const isPara = (p) => /^<(p|li)[ >]/.test(p);
  const counts = new Map(); const first = new Map(); const occ = new Map();
  const text = (s) => s.replace(/<[^>]+>/g, ' ');
  parts.forEach((p, i) => {
    if (!isPara(p)) return;
    const t = ` ${text(p).toLowerCase()} `;
    for (const m of art.mentions) {
      if (skip.has(m.thing)) continue;
      const re = new RegExp(`[^a-z]${m.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:s|es)?[^a-z]`);
      if (re.test(t)) {
        counts.set(m.thing, (counts.get(m.thing) ?? 0) + 1);
        if (!first.has(m.thing)) first.set(m.thing, i);
        if (!occ.has(m.thing)) occ.set(m.thing, []);
        if (!occ.get(m.thing).includes(i)) occ.get(m.thing).push(i);
      }
    }
  });
  const entry = (thing) => art.mentions.find((m) => m.thing === thing).entry;
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || first.get(a[0]) - first.get(b[0])).map(([t]) => t);
  const taken = [];
  for (let i = 0; i < parts.length; i++) if (/<!--fig-->/.test(parts[i]) || /<figure/.test(parts[i])) taken.push(i);
  const placed = new Map(); const repeated = new Set();
  const place = (thing, at) => { placed.set(at, entry(thing)); taken.push(at); };
  for (const thing of ranked) {
    if (placed.size >= max) break;
    const at = first.get(thing);
    if (taken.some((t) => Math.abs(t - at) < gap)) continue;
    place(thing, at);
  }
  /* Then the long stretches: a run of more than `longest` characters of text
     with no picture - about two thirds of a page - gets the most-mentioned thing
     named inside it, so a page deep in a wordy chapter is never bare. */
  const paragraphs = parts.map((p, i) => i).filter((i) => isPara(parts[i]));
  const chars = (run) => run.reduce((n, i) => n + text(parts[i]).length, 0);
  const shown = () => [...placed.values()];
  let guard = 0;
  while (guard++ < 60) {
    const sorted = [...taken].sort((a, b) => a - b);
    let from = -1; let found = null;
    for (const t of [...sorted, parts.length]) {
      const run = paragraphs.filter((i) => i > from && i < t);
      if (chars(run) > longest) {
        /* the most-mentioned thing not yet shown that is named anywhere in the run,
           set beside the paragraph nearest the run's middle that names it */
        const mid = run[Math.floor(run.length / 2)];
        const nearest = (th) => (occ.get(th) ?? []).filter((i) => run.includes(i) && !placed.has(i)).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))[0];
        for (const th of ranked) {
          if (shown().includes(entry(th))) continue;
          const at = nearest(th);
          if (at != null) { found = [th, at]; break; }
        }
        /* nothing new is named in the run: show a thing again, as its card where it
           has one, rather than leave a stretch of pages bare - once per thing */
        if (!found) for (const th of ranked) {
          if (repeated.has(th)) continue;
          const at = nearest(th);
          if (at == null) continue;
          const e = entry(th);
          const other = [...art.entries.values()].find((x) => x.thing === e.thing && x !== e && x.what === 'card') ?? e;
          repeated.add(th); placed.set(at, other); taken.push(at); found = true; break;
        }
        if (found) break;
      }
      from = t;
    }
    if (!found) break;
    if (found !== true) place(found[0], found[1]);
  }
  const leftover = ranked.filter((th) => !shown().includes(entry(th)) && !repeated.has(th)).map(entry);
  const out = parts.map((p, i) => {
    if (!placed.has(i)) return p;
    const fig = figureHtml([placed.get(i)], { size: 'margin', cls: 'auto', root });
    /* a figure before a list item goes inside it, where a float is allowed */
    return /^<li[ >]/.test(p) ? p.replace(/^<li[^>]*>/, (m) => m + fig) : fig + p;
  }).join('');
  return { html: out, leftover };
}

/**
 * The tailpiece: three things the chapter named and had no room to show, in a
 * row after its last paragraph, so the page a chapter's last lines spill onto
 * carries a picture like every other. Nothing named, nothing drawn.
 */
export function tailpiece(leftover, { root = null, n = 3 } = {}) {
  const pieces = leftover.slice(0, n);
  if (!pieces.length) return '';
  return figureHtml(pieces, { row: true, cls: 'tail', caption: '', root });
}
