#!/usr/bin/env node
/**
 * Renders the printed book - docs/book/index.html - from three kinds of source:
 *
 *   docs/rules/*.md     BOOK I, THE RULES. Written by hand, player-facing, and
 *                       only what a table needs to play. Every tunable constant
 *                       in them is a {{data.path}} token (tools/lib/book.mjs
 *                       interpolate), so the chapter cannot print a number the
 *                       data has moved on from.
 *   data/*.json         THE ANNEXES that are generated: Annex I is
 *                       docs/design/14-annex.md, the reference tables
 *                       tools/build-annex.mjs already writes; Annex II is the
 *                       illustrated catalogue of the base game; then one annex
 *                       per campaign (Campaign I, II ...) with everything a table
 *                       needs to play it, and one per expansion if any exist.
 *   docs/design/*.md    THE DESIGN NOTES, last, for the reader who wants to know
 *                       why. They used to BE the book; a rulebook that opened
 *                       with a design essay was the thing this rebuild fixed.
 *
 * Every section opens on a title page carrying a plate from the catalogue, and
 * the page lets a reader print any section or chapter on its own. Committed like
 * docs/data/bundle.js, because Pages serves the branch as-is: edit the sources,
 * run the tool, commit both. --check fails if the committed page is stale.
 *
 * Usage: node tools/build-book.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown, escapeHtml } from './lib/docpage.mjs';
import { loadData, interpolate, openCatalogue, sheets, roman, word, inline, esc } from './lib/book.mjs';
import { artIndex, figureTokens, placeFigures, figureHtml, autoVignettes, tailpiece, pictureHtml, friezeBand } from './lib/book-art.mjs';
import { crop, readFraming } from './lib/framing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES = join(ROOT, 'docs', 'rules');
const REVIEW = join(ROOT, 'docs', 'review');
const DESIGN = join(ROOT, 'docs', 'design');
const OUT_DIR = join(ROOT, 'docs', 'book');
const OUT = join(OUT_DIR, 'index.html');
const checkOnly = process.argv.includes('--check');

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const { data } = loadData(ROOT);
const cat = openCatalogue(ROOT, { data });
const art = artIndex(ROOT, data);
const framing = readFraming(ROOT);

const BOOK_TITLE = 'The Almanac';
const GAME = 'game1';

/* ----------------------------------------------------------- markdown -> html */

const slugOf = (s) => s.replace(/\.md$/, '');
const rulesFiles = existsSync(RULES) ? readdirSync(RULES).filter((f) => /^\d\d-.*\.md$/.test(f)).sort() : [];
const reviewFiles = existsSync(REVIEW) ? readdirSync(REVIEW).filter((f) => /^\d\d-.*\.md$/.test(f)).sort() : [];
const designFiles = readdirSync(DESIGN).filter((f) => /^\d\d-.*\.md$/.test(f) && f !== '14-annex.md').sort();

/* Where a `NN-name.md` link points once everything is one page: a rules file to
   its rules chapter, a design doc to its design note, the annex to Annex I. A
   `#fragment` on the annex is mapped to the table that holds that heading. */
const annexSlugHome = new Map();
function rewriteHref(href) {
  const m = href.match(/^(?:\.\.\/rules\/|\.\.\/design\/)?(\d{2}-[a-z0-9-]+\.md)(?:#(.*))?$/);
  if (!m) return href;
  const [, file, frag] = m;
  if (file === '14-annex.md') {
    if (frag && annexSlugHome.has(frag)) return `#${annexSlugHome.get(frag)}--${frag}`;
    return '#annex-1';
  }
  const prefix = rulesFiles.includes(file) ? 'rules' : reviewFiles.includes(file) ? 'review' : 'design';
  return `#${prefix}-${slugOf(file)}${frag ? `--${frag}` : ''}`;
}

/* ------------------------------------------------------------ pictures */

/** A cropped square of a plate - the framing's own crop, aimed at the face - or a
    whole card, tile or icon, small enough to head a table row. */
function thumb(e) {
  if (e.inline) return `<span class="thumb">${e.inline}</span>`;
  if (e.what !== 'plate') return `<span class="thumb whole">${pictureHtml(e, { small: true, root: ROOT })}</span>`;
  const f = framing.plates?.[e.ref.slice(6)];
  const r = crop({ width: e.w, height: e.h }, f?.subject, 1, framing.pad ?? 0, f?.focal, framing.focalTarget);
  const W = 100 / r.w;
  return `<span class="thumb"><img src="${e.small ?? e.src}" alt="" loading="lazy" style="width:${W.toFixed(2)}%;left:${(-r.x * W).toFixed(2)}%;top:${(-r.y * W * e.h / e.w).toFixed(2)}%"></span>`;
}

/* The name of a thing, lower-cased, to the best picture of it: how a table row
   that begins with "Cinder Wolf" gets the wolf beside the words. */
const nameToArt = new Map();
for (const e of art.byThing.values()) for (const n of e.names ?? []) if (n && !nameToArt.has(n.toLowerCase())) nameToArt.set(n.toLowerCase(), e);
const codeToArt = new Map();
for (const e of art.entries.values()) if (e.code && (!codeToArt.has(e.code) || e.what === 'plate')) codeToArt.set(e.code, e);
for (const t of data.terrain.terrains) codeToArt.set(`terrain-letter:${t.code}`, art.resolve(`terrain:${t.id}`));
function thumbTables(html) {
  return html.replace(/<tr><td>([\s\S]*?)<\/td>/g, (m, cell) => {
    const plain = cell.replace(/<[^>]+>/g, '').trim();
    const code = plain.match(/^([A-Z]{3}-\d{2})$/) ?? plain.match(/\(([A-Z]{3}-\d{2})\)$/);
    const e = code ? codeToArt.get(code[1])
      : /^[A-Z]$/.test(plain) ? codeToArt.get(`terrain-letter:${plain}`)
        : nameToArt.get(plain.toLowerCase());
    return e ? `<tr><td class="named">${thumb(e)}${cell}</td>` : m;
  });
}


/* A figure the author placed, as it stands in a rendered chapter. */
const FIG = '<!--fig-->(?:(?!<!--\\/fig-->)[\\s\\S])*<!--\\/fig-->';

/**
 * A head is followed by words, never by a picture: in a two-column chapter the
 * figures that stand straight after a head are set after the paragraph that
 * follows it, or at the end of the first item of the list that does.
 *
 * A head keeps with what follows it, and a picture has to wait for a column it
 * fits in. Together they took the head along to wherever the picture went, and
 * the head a chapter opened with took the chapter along with it: under a head
 * placed low on a page, a design note left a third of the page empty.
 */
function wordsAfterHeads(html) {
  const head = '<h[234][^>]*>(?:(?!<\\/h[234]>)[\\s\\S])*<\\/h[234]>\\s*';
  /* a figure the author placed carries <!--fig--> markers; a vignette the build
     added does not */
  const anyFig = `(?:${FIG}|<figure class="fig[^"]*"[^>]*>(?:(?!<\\/figure>)[\\s\\S])*<\\/figure>)`;
  const figs = `(?:${anyFig}\\s*)+`;
  const block = '<p[ >][\\s\\S]*?<\\/p>|<div class="table-wrap[^"]*"><table>[\\s\\S]*?<\\/table><\\/div>|<blockquote[\\s\\S]*?<\\/blockquote>|<pre>[\\s\\S]*?<\\/pre>';
  return html
    .replace(new RegExp(`(${head})(${figs})(${block})`, 'g'), '$1$3$2')
    .replace(new RegExp(`(${head})(${figs})(<(?:ul|ol)>\\s*<li>(?:(?!<\\/li>)[\\s\\S])*)(<\\/li>)`, 'g'), (m, h, f, li, end) => `${h}${li}${f.trim()}${end}`);
}

/**
 * A two-column chapter's body, as blocks of columns: the head stays above them,
 * and a table that crosses both columns (fitTables) ends one block and starts
 * the next. See .cbody in tools/lib/book.css for why nothing spans instead.
 */
function columnize(html) {
  const head = html.match(/^\s*<header class="chap[\s\S]*?<\/header>/)?.[0] ?? '';
  const parts = html.slice(head.length).split(/(<div class="table-wrap[^"]*\bspan\b[^"]*"><table>[\s\S]*?<\/table><\/div>)/);
  return head + parts.map((part, i) => (i % 2 ? part : part.trim() ? `<div class="cbody">${part}</div>` : '')).join('');
}

/**
 * What a table may do on the page, as classes on its wrapper.
 *
 * `long`: past eight rows it may break between rows, its header row repeated.
 * Every table was kept whole, which is right for six rows and ruinous for fifty
 * - a table taller than what was left of the page went to the next one whole,
 * and Annex I's buildings table left its own chapter head alone on a page
 * three-quarters empty.
 *
 * `span`: in a two-column chapter, it crosses both columns. A table stays in its
 * column when its columns can each have what they hold, to twenty characters -
 * past which a cell wraps, and that is fine - and crosses when they cannot, which
 * is also any table of six columns or more. A table that crosses may always break
 * between rows: whole, one that did not fit took the rest of the page with it.
 * Crossing is kept for the tables that need it because it is the one thing in a
 * two-column page that cannot give way to what is round it.
 */
const COLUMN_CHARS = 74;
function fitTables(html, cols) {
  return html.replace(/<div class="table-wrap"><table>([\s\S]*?)<\/table><\/div>/g, (m, inner) => {
    const cells = (tr) => [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => c[1].replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, 'x').trim());
    const rows = [...inner.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => cells(r[1]));
    const n = Math.max(0, ...rows.map((r) => r.length));
    const body = (inner.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1].match(/<tr[ >]/g) ?? []).length;
    const cls = [];
    if (body > 8) cls.push('long');
    if (cols) {
      const need = Array.from({ length: n }, (_, i) => Math.max(0, ...rows.map((r) => Math.min((r[i] ?? '').length, 20))));
      if (n >= 6 || need.reduce((a, b) => a + b + 3, 0) > COLUMN_CHARS) cls.push('span');
    }
    return cls.length ? m.replace('<div class="table-wrap">', `<div class="table-wrap ${cls.join(' ')}">`) : m;
  });
}

/** A hand-written chapter's own figures ({{fig:...}} tokens), and then vignettes
    of whatever its paragraphs name and no figure already shows. Every such
    chapter is set in two columns, and its figures are sized to them. */
function illustrate(src, where, render) {
  const { text, figs, shown } = figureTokens(src, art, where, { inlineFn: inline, root: ROOT, cols: true });
  const out = render(text);
  const skip = new Set(figs.flatMap((f) => f.things));
  for (const e of art.byThing.values()) if (shown.has(e.png ?? e.src)) skip.add(e.thing);
  const v = autoVignettes(placeFigures(out.html, figs), art, { skip, max: 6, gap: 3, root: ROOT, cols: true });
  out.html = v.html + tailpiece(v.leftover, { root: ROOT, cols: true });
  /* a chapter's own gallery reads the copies too, when there are copies: the
     small one on screen, the full one named beside it for the printer */
  out.html = out.html.replace(/src="\.\.\/art\/renders\/([^"]+)\.png"/g, (m, id) => {
    const has = (suffix) => existsSync(join(ROOT, 'docs', 'book', 'art', `${id}${suffix}`));
    if (!has('.jpg')) return m;
    return has('-s.jpg') ? `src="art/${id}-s.jpg" data-print-src="art/${id}.jpg"` : `src="art/${id}.jpg"`;
  });
  return out;
}

/**
 * Heading ids are made unique per chapter, and the chapter's own links follow.
 *
 * The second half of that sentence was the documentation and not the code: this
 * renamed every id and no reference to one, and a chapter is where the figures
 * have already been placed. So every card and tile inlined into a rules, review,
 * annex or design chapter had its `<clipPath id="portrait-window">` renamed out
 * from under the `clip-path="url(#portrait-window)"` still asking for it - 171
 * broken references over 295 sites - and a browser that cannot resolve a clip
 * draws the thing UNCLIPPED. The window is a hole cut in a picture bigger than
 * itself, so what came through was the whole plate at window scale: the crop
 * every card is aimed with, silently thrown away, in the book only.
 *
 * A reference is followed only when the id it names was renamed here. That is
 * what keeps a cross-chapter link working: `<a href="#rules-08-the-map-and-
 * travel">` points at a chapter this fragment does not define, so it is left
 * exactly as it is, while `url(#i152-portrait-window)` two lines away is
 * followed because its definition is right there.
 */
const scopeIds = (html, id) => {
  const own = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  if (!own.size) return html;
  const scoped = (s) => `${id}--${s}`;
  return html
    .replace(/ id="([^"]+)"/g, (_, s) => ` id="${scoped(s)}"`)
    .replace(/url\(#([^)"']+)\)/g, (m, s) => (own.has(s) ? `url(#${scoped(s)})` : m))
    .replace(/((?:xlink:)?href=")#([^"]+)"/g, (m, head, s) => (own.has(s) ? `${head}#${scoped(s)}"` : m));
};

/* A chapter's frieze stands inside its head. The two are one thing on the page,
   and a page must not fall between them - nor between them and the chapter's
   first lines, which is what the head's reserve in tools/lib/book.css is for. */
const FRIEZE_AT_START = /^\s*(<!--fig--><figure class="fig row frieze"[\s\S]*?<\/figure><!--\/fig-->)\s*/;
function takeFrieze(body) {
  let frieze = '';
  const rest = body.replace(FRIEZE_AT_START, (_, f) => { frieze = f; return ''; });
  return { frieze, rest };
}

/* The drop capital goes on the chapter's opening paragraph, past any figures and
   heads in front of it - and only those: the lazy match this replaced ran on
   over tables and lists to whichever paragraph came next, and set a capital on
   a stray sentence halfway down the page. The figures it passes are set after
   that paragraph instead of before it. A drop capital is a float, a float may
   not stand higher than one before it, and a picture that had to wait for the
   next column took the capital - and so the chapter's first lines - with it. */
function dropCap(body) {
  return body.replace(new RegExp(`^((?:(?:${FIG}|<h[234][^>]*>[^<]*<\\/h[234]>)\\s*)*)<p>([\\s\\S]*?<\\/p>)`), (m, lead, para) => {
    const figs = lead.match(new RegExp(FIG, 'g')) ?? [];
    return `${lead.replace(new RegExp(`${FIG}\\s*`, 'g'), '')}<p class="dropcap">${para}${figs.join('')}`;
  });
}

/** A rules chapter: the title becomes the chapter head, the first paragraph its lede, the next its drop capital. */
function rulesChapter(file, n) {
  const id = `rules-${slugOf(file)}`;
  const { title, html } = illustrate(readFileSync(join(RULES, file), 'utf8'), `docs/rules/${file}`,
    (text) => renderMarkdown(interpolate(text, data, `docs/rules/${file}`), { rewriteHref, fallbackTitle: file }));
  let body = scopeIds(html.replace(/^<h1[^>]*>.*?<\/h1>\n?/, ''), id);
  let lede = '';
  body = body.replace(/^<p>([\s\S]*?)<\/p>\n?/, (_, p) => { lede = p; return ''; });
  const { frieze, rest } = takeFrieze(body);
  body = rest;
  body = dropCap(body);
  body = body.replace(/<blockquote><p><strong>Open\.?<\/strong>/g, '<blockquote class="open"><p><strong>Open.</strong>');
  return {
    id, title, kind: 'text', cols: true, runOn: true,
    html: `<header class="chap"><div class="num">Chapter ${roman(n)}</div><h2 class="title">${escapeHtml(title)}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}${ORNAMENT}${frieze}</header>${body}`,
  };
}

/** An addendum chapter: the review, written by hand like the rules and set the same way,
    with the {{ }} tokens so a finding that cites a number cannot cite a stale one. */
function reviewChapter(file, n) {
  const id = `review-${slugOf(file)}`;
  const { title, html } = illustrate(readFileSync(join(REVIEW, file), 'utf8'), `docs/review/${file}`,
    (text) => renderMarkdown(interpolate(text, data, `docs/review/${file}`), { rewriteHref, fallbackTitle: file }));
  let body = scopeIds(html.replace(/^<h1[^>]*>.*?<\/h1>\n?/, ''), id);
  let lede = '';
  body = body.replace(/^<p>([\s\S]*?)<\/p>\n?/, (_, p) => { lede = p; return ''; });
  const { frieze, rest } = takeFrieze(body);
  body = rest.replace(/<blockquote><p><strong>Open\.?<\/strong>/g, '<blockquote class="open"><p><strong>Open.</strong>');
  return {
    id, title, kind: 'text', cols: true, runOn: true, notes: true,
    html: `<header class="chap small"><div class="num">Addendum I · ${roman(n)}</div><h2 class="title">${escapeHtml(title)}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}${ORNAMENT}${frieze}</header>${body}`,
  };
}

/** Annex I: the generated reference tables, one chapter per `##` section. */
function annexChapters() {
  const src = readFileSync(join(DESIGN, '14-annex.md'), 'utf8');
  const parts = src.split(/\n(?=## )/);
  const chapters = [];
  for (const part of parts.slice(1)) {
    const titleLine = part.match(/^## (.*)$/m)[1];
    if (/^Campaign deck/.test(titleLine)) continue; /* the campaign annex prints it */
    const md = part.replace(/^## .*\n/, '');
    const { html } = renderMarkdown(md, { rewriteHref, fallbackTitle: titleLine });
    const slug = titleLine.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const id = `annex-1-${slug}`;
    for (const h of html.matchAll(/ id="([^"]+)"/g)) annexSlugHome.set(h[1], id);
    annexSlugHome.set(slug, id);
    chapters.push({ id, title: titleLine, kind: 'tables', runOn: true, html: null, md, n: chapters.length + 1 });
  }
  /* rendered in a second pass, once every annex heading knows its home */
  for (const c of chapters) {
    const { html } = renderMarkdown(c.md, { rewriteHref, fallbackTitle: c.title });
    const body = thumbTables(html);
    /* the frieze under the head: the first things the table's own rows name, or
       else what a table with no named rows is about */
    const named = [...body.matchAll(/<td class="named">(?:<span class="thumb[^>]*>)/g)].length
      ? [...new Set([...body.matchAll(/<td class="named"><span class="thumb[^"]*">(?:<img src="([^"]+)"|<span class="swatch")/g)].map((m) => m[1]).filter(Boolean))].slice(0, 6)
        .map((src) => [...art.byThing.values()].find((e) => e.small === src || e.src === src)).filter(Boolean)
      : ANNEX_FRIEZE.filter(([re]) => re.test(c.title)).flatMap(([, refs]) => refs).map((r) => art.resolve(r)).filter(Boolean).slice(0, 6);
    const frieze = named.length ? figureHtml(named, { row: true, cls: 'frieze', root: ROOT, rowH: 22 }) : '';
    const v = autoVignettes(body, art, { max: 4, gap: 3, root: ROOT });
    /* a short table stays with its head: it is shorter than most of a page, and
       run on under the table before it, its head could otherwise end a page with
       the table on the next */
    const rows = (body.match(/<tr[ >]/g) ?? []).length;
    const words = body.replace(/<table[\s\S]*?<\/table>/g, '').replace(/<[^>]+>/g, ' ').length;
    c.keep = rows <= 11 && words <= 900;
    c.html = `<header class="chap small"><div class="num">Annex I · Table ${c.n}</div><h2 class="title">${escapeHtml(c.title)}</h2>${ORNAMENT}${frieze}</header>${scopeIds(v.html, c.id)}${tailpiece(v.leftover.filter((e) => !named.includes(e)), { root: ROOT })}`;
    delete c.md;
  }
  return chapters;
}

/* What a table with no named rows is about, as pictures: matched on its title. */
const ANNEX_FRIEZE = [
  [/travel|night legs/i, ['map:korvane-reach', 'item:lantern', 'item:torch', 'vehicle:veh-03', 'vehicle:veh-01']],
  [/discovery/i, ['monster:cinder-wolf', 'event:caravan-robbery', 'monster:reef-serpent', 'event:piracy', 'monster:barrow-troll']],
  [/market/i, ['board:market', 'board:ledger', 'board:depletion', 'icon:pricing-deplete', 'icon:pricing-hype']],
  [/commodit/i, ['icon:pricing-staple', 'icon:pricing-perish', 'icon:pricing-deplete', 'icon:pricing-hype', 'building:granary']],
  [/wear/i, ['tool:axe', 'weapon:sword', 'armour:plate-harness', 'item:lantern', 'item:coil-of-rope']],
  [/transport/i, ['vehicle:veh-01', 'vehicle:veh-03', 'vehicle:veh-05', 'vehicle:veh-08', 'vehicle:veh-12']],
  [/element/i, ['icon:element-fire', 'icon:element-earth', 'icon:element-water', 'icon:element-air']],
  [/enchant/i, ['spell:mend-stone', 'spell:kindle', 'talisman:tal-06', 'modification:keelbound']],
  [/quest/i, ['character:chr-09', 'monster:polyphemus', 'event:wandering-wizard', 'building:inn']],
  [/web|flow/i, ['building:blacksmith', 'building:sawmill', 'tool:hammer', 'building:mill', 'building:market']],
];

/* A design note's head, and its frieze in it. A note that opens with a
   paragraph and then its frieze has that paragraph as its lede, the way a rules
   chapter does - which is what it is, and it keeps the frieze with the head. */
function designHead(file, title, body) {
  let lede = '';
  const opened = body.match(/^<p>([\s\S]*?)<\/p>\s*(?=<!--fig--><figure class="fig row frieze")/);
  if (opened) { lede = opened[1]; body = body.slice(opened[0].length); }
  const { frieze, rest } = takeFrieze(body);
  return `<header class="chap small"><div class="num">Design note ${file.slice(0, 2)}</div><h2 class="title">${escapeHtml(title)}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}${ORNAMENT}${frieze}</header>${rest}`;
}

function designChapter(file) {
  const id = `design-${slugOf(file)}`;
  const { title, html } = illustrate(readFileSync(join(DESIGN, file), 'utf8'), `docs/design/${file}`,
    (text) => renderMarkdown(text, { rewriteHref, fallbackTitle: file }));
  const bare = title.replace(/^\d\d\s+—\s+/, '');
  return {
    id, title: bare, kind: 'text', cols: true, runOn: true, notes: true,
    html: designHead(file, bare, scopeIds(html.replace(/^<h1[^>]*>.*?<\/h1>\n?/, ''), id)),
  };
}

/* ------------------------------------------------------------- ornaments */

/* A swash rule with a fleuron: the one flourish the book allows itself between a
   head and its text. Drawn, so no face has to carry the glyph. */
const ORNAMENT = `<svg class="orn" viewBox="0 0 200 14" aria-hidden="true"><path d="M2 7h78M120 7h78" stroke="currentColor" stroke-width=".8" fill="none"/><path d="M100 1.5c2.6 2.2 4.6 3.8 6.5 5.5-1.9 1.7-3.9 3.3-6.5 5.5-2.6-2.2-4.6-3.8-6.5-5.5 1.9-1.7 3.9-3.3 6.5-5.5z" fill="currentColor"/><circle cx="86" cy="7" r="1.1" fill="currentColor"/><circle cx="114" cy="7" r="1.1" fill="currentColor"/></svg>`;

/* The frame a title page stands in - the cards' timber-and-iron border at page
   size: an outer rule, an inner hairline, and a rivet in each corner. */
const FRAME = `<svg class="frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="98" height="98" fill="none" stroke="currentColor" stroke-width=".55" vector-effect="non-scaling-stroke"/><rect x="2.2" y="1.5" width="95.6" height="97" fill="none" stroke="currentColor" stroke-width=".18" vector-effect="non-scaling-stroke"/></svg>`
  + ['tl', 'tr', 'bl', 'br'].map((c) => `<i class="rivet ${c}"></i>`).join('');

/* ------------------------------------------------------------ title pages */

/** The row of small pieces under a title page's plate: what the section holds, at a glance. */
function friezeHtml(refs) {
  if (!refs?.length) return '';
  const pieces = refs.map((r) => { const e = art.resolve(r); if (!e) throw new Error(`title page frieze: ${r} is not a picture the book has`); return e; });
  /* Uniform height, chosen so the row fits the measure - a board or a map in a
     frieze is three times as wide as a card and nothing was counting. */
  const band = friezeBand(pieces);
  return `<div class="tfrieze" style="--fh:${band.toFixed(2)}mm">${pieces.map((e) => `<div class="fp${e.what === 'card' ? ' card' : e.what === 'tile' ? ' tile' : ''}">${pictureHtml(e, { small: true, root: ROOT })}</div>`).join('')}</div>`;
}

function titlePage(s) {
  const plate = s.plate && cat.hasPlate(s.plate)
    ? `<figure class="tplate ${s.plateFormat ?? 'portrait'}"><img ${cat.plateImgSrc(s.plate)} alt="${esc(s.plateAlt ?? '')}"></figure>`
    : s.plateSrc
      ? `<figure class="tplate ${s.plateFormat ?? 'landscape'}"><img src="${esc(s.plateSrc)}" alt="${esc(s.plateAlt ?? '')}"></figure>`
      : '<figure class="tplate empty"></figure>';
  const frieze = friezeHtml(s.frieze);
  return `<div class="titlepage" id="${esc(s.id)}-title">${FRAME}
  <header><div class="label">${esc(s.label)}</div><h1 class="ttitle">${esc(s.title)}</h1>${s.subtitle ? `<div class="script">${esc(s.subtitle)}</div>` : ''}${ORNAMENT}</header>
  ${frieze ? plate.replace('class="tplate ', 'class="tplate with-frieze ') : plate}${frieze}
  <footer${frieze ? ' class="short"' : ''}>${s.caption ? `<div class="tcaption">${esc(s.caption)}</div>` : ''}<button type="button" class="print-this screen-only" data-part="${esc(s.id)}">Print this section</button></footer>
</div>`;
}

/* --------------------------------------------------------- the catalogue */

function catalogueChapters(setKey, running) {
  const out = [];
  for (const ch of cat.chapters) {
    const entries = ch.entries.filter((e) => e.set === setKey);
    if (!entries.length) continue;
    const chapter = { ...ch, count: `${entries.length} of them`, anchor: `${running.idPrefix}-${ch.id}--head` };
    out.push({ id: `${running.idPrefix}-${ch.id}`, title: ch.title, kind: 'sheets', html: sheets(chapter, entries, { runningHead: running.head }) });
  }
  return out;
}

/* ----------------------------------------------------------- a campaign */

const P = (s) => (s ? `<p>${inline(s)}</p>` : '');
const table = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const list = (xs, tag = 'ul') => `<${tag}>${xs.map((x) => `<li>${x}</li>`).join('')}</${tag}>`;

function campaignChapters(camp, ordinal) {
  const prefix = `campaign-${camp.id}`;
  const running = { idPrefix: prefix, head: `Campaign ${roman(ordinal)} · ${camp.name}` };
  const chars = new Map(data.characters.characters.map((c) => [c.id, c]));
  const mons = new Map(data.monsters.monsters.map((m) => [m.id, m]));
  const cname = (id) => esc(chars.get(id)?.name ?? id);
  const mname = (id) => esc(mons.get(id)?.name ?? id);
  const map = data.maps.find((m) => m.id === camp.map);
  const mode = data.campaigns.modes.find((m) => m.id === 'campaign');
  const chapters = [];

  /* 1. how to play it */
  const acts = camp.acts ?? [];
  const cast = camp.cast ?? {};
  /* the cast in a row under the head - the hero, the hosts, the adversaries, the monsters - whoever is drawn */
  const castRefs = [cast.odysseus, ...Object.values(cast.heroes ?? {}).flat(), ...(cast.hosts ?? []), ...(cast.adversaries ?? [])]
    .filter((id, i, a) => id && a.indexOf(id) === i).map((id) => `character:${id}`)
    .concat((camp.monsters ?? []).map((id) => `monster:${id}`))
    .filter((r) => art.resolve(r)?.what === 'plate');
  const castFrieze = castRefs.length ? figureHtml(castRefs.slice(0, 6).map((r) => art.resolve(r)), { row: true, cls: 'frieze', root: ROOT }) : '';
  /* a generated chapter gets the vignettes a written one does, for the things its own paragraphs name */
  const vignette = (html) => { const v = autoVignettes(html, art, { max: 6, gap: 3, root: ROOT, cols: true }); return v.html + tailpiece(v.leftover, { root: ROOT, cols: true }); };
  chapters.push({
    id: `${prefix}-playing`, title: 'Playing the campaign', kind: 'text', cols: true, runOn: true,
    html: `<header class="chap"><div class="num">Campaign ${roman(ordinal)}</div><h2 class="title">${esc(camp.name)}</h2><p class="lede">${esc(camp.subtitle ? camp.subtitle[0].toUpperCase() + camp.subtitle.slice(1) : '')}.</p>${ORNAMENT}${castFrieze}</header>`
      + vignette(`<p class="dropcap">${inline(camp.summary)}</p>`
      + (camp.source ? `<h3>The source</h3><p><em>${esc(camp.source.work)}</em>, ${esc(camp.source.author)}${camp.source.composed ? `, ${esc(camp.source.composed)}` : ''}${camp.source.books ? `, in ${word(camp.source.books)} books` : ''}. ${inline(camp.source.note ?? '')}</p>` : '')
      + `<h3>The table</h3>${list([
        `<strong>Players.</strong> ${camp.players.min} to ${camp.players.max}. ${inline(camp.players.note ?? '')}`,
        `<strong>Length.</strong> ${camp.length.rounds} rounds. ${inline(camp.length.note ?? '')}`,
        `<strong>Playing it.</strong> ${inline(mode?.summary ?? '')}`,
        `<strong>Reading a card.</strong> ${inline(mode?.reading ?? '')}`,
        `<strong>A chapter that goes wrong.</strong> ${inline(mode?.replay ?? '')}`,
      ])}`
      + (acts.length ? `<h3>The acts</h3>${table(['Act', 'Books', 'Chapters', 'What happens'], acts.map((a) => [esc(a.name), esc(a.books), `${a.chapters[0]}–${a.chapters[1]}`, inline(a.summary)]))}` : '')
      + `<h3>The cast</h3>${P(cast.$comment)}${list([
        cast.odysseus ? `<strong>Always a player:</strong> ${cname(cast.odysseus)}.` : null,
        ...Object.entries(cast.heroes ?? {}).map(([act, ids]) => `<strong>${esc(acts.find((a) => a.id === act)?.name ?? act)}:</strong> ${ids.map(cname).join(', ')}.`),
        cast.hosts?.length ? `<strong>Hosts, dealt onto the encounter board when a card says so:</strong> ${cast.hosts.map(cname).join(', ')}.` : null,
        cast.adversaries?.length ? `<strong>Adversaries:</strong> ${cast.adversaries.map(cname).join(', ')}.` : null,
        camp.monsters?.length ? `<strong>Monsters:</strong> ${camp.monsters.map(mname).join(', ')}.` : null,
        cast.companions ? `<strong>Dealing the companions.</strong> ${inline(cast.companions)}` : null,
        cast.handover ? `<strong>The handover.</strong> ${inline(cast.handover)}` : null,
      ].filter(Boolean))}`
      + (camp.fleet ? `<h3>The fleet board</h3>${P(camp.fleet.$comment)}${list([
        `<strong>The board:</strong> ${inline(camp.fleet.board)}.`,
        ...Object.entries(camp.fleet.tracks ?? {}).map(([t, v]) => `<strong>${esc(t[0].toUpperCase() + t.slice(1))} track:</strong> ${inline(v.counts)}, from ${v.from}.`),
        `<strong>Losses.</strong> ${inline(camp.fleet.loss)}`,
        `<strong>At sea.</strong> ${inline(camp.fleet.atSea)}`,
      ])}` : '')
      + `<h3>Setting up</h3>${list((camp.setup ?? []).map(inline), 'ol')}`
      + `<h3>Winning, and losing</h3>${list([`<strong>Victory.</strong> ${inline(camp.victory)}`, camp.defeat ? `<strong>Defeat.</strong> ${inline(camp.defeat)}` : null].filter(Boolean))}`
      + (camp.order ? `<h3>The order of things</h3>${list([`<strong>As the poem tells it:</strong> ${inline(camp.order.homer)}`, `<strong>As the deck plays it:</strong> ${inline(camp.order.deck)}`])}` : '')
      + (camp.mark ? `<h3>The mark</h3><p><img class="cmark big" src="../art/icons/campaign-${esc(camp.id)}.svg" alt=""> ${inline(camp.mark.note ?? '')} It is printed beside the card code of every card that belongs to this campaign - its own, and every character and monster it brings - so a table can pull them out of the free-play decks by the corner alone.</p>` : '')
      + (camp.freePlay ? `<h3>In free play</h3>${P(camp.freePlay)}` : '')),
  });

  /* 2. the board */
  if (map) {
    const mapArt = (suffix) => existsSync(join(ROOT, 'docs', 'book', 'art', `map-${map.id}${suffix}`));
    const plateSrc = mapArt('.jpg')
      ? (mapArt('-s.jpg') ? `src="art/map-${map.id}-s.jpg" data-print-src="art/map-${map.id}.jpg"` : `src="art/map-${map.id}.jpg"`)
      : `src="${esc(`../map/${map.plate.file}`)}"`;
    const preset = (map.print?.presets ?? []).find((p) => p.id === map.print.default);
    chapters.push({
      id: `${prefix}-board`, title: `The board: ${map.name}`, kind: 'text', runOn: true,
      html: `<header class="chap small"><div class="num">Campaign ${roman(ordinal)} · The board</div><h2 class="title">${esc(map.name)}</h2>${map.subtitle ? `<p class="lede">${esc(map.subtitle[0].toUpperCase() + map.subtitle.slice(1))}.</p>` : ''}${ORNAMENT}</header>`
        + `<figure class="mapplate"><img ${plateSrc} alt="${esc(map.name)}"><figcaption>${esc(map.name)}${preset ? ` — printed at the ${esc(preset.name.toLowerCase())} preset it is ${preset.mapWidthMm} × ${preset.mapHeightMm} mm with ${preset.hexAcrossFlatsMm} mm hexes` : ''}. The hex grid is laid over the plate at the table.</figcaption></figure>`
        + P(map.summary)
        + `<h3>The regions</h3>${table(['Region', 'Ground', 'What is there'], (map.regions ?? []).map((r) => [esc(r.name), esc(cat.name(new Map(data.terrain.terrains.map((t) => [t.id, t])), r.terrain)), inline(r.summary ?? '')]))}`
        + `<h3>The places</h3>${table(['Place', 'Rank', 'Harbour', 'Note'], (map.settlements ?? []).map((s) => [esc(s.name), esc(s.rank ?? ''), s.harbour ? 'yes' : '—', inline(s.note ?? '')]))}`
        + (map.print?.presets?.length ? `<h3>Printing it</h3>${table(['Preset', 'Sheets', 'Map', 'Hex'], map.print.presets.map((p) => [esc(p.name), `${p.sheetCols} × ${p.sheetRows} ${esc(p.sheet)} ${esc(p.orientation)}`, `${p.mapWidthMm} × ${p.mapHeightMm} mm`, `${p.hexAcrossFlatsMm} mm`]))}<p>The map page on the site tiles the plate across the sheets with trim marks; print at 100% and butt the pieces.</p>` : '')
        + tailpiece(castRefs.slice(6).map((r) => art.resolve(r)), { root: ROOT }),
    });
  }

  /* 3. the cast and the monsters, at half a page each, with their plates */
  chapters.push(...catalogueChapters(`campaign:${camp.id}`, running));

  /* 4. the deck, chapter by chapter */
  const cards = data.campaigns.cards.filter((c) => c.campaign === camp.id).sort((a, b) => a.chapter - b.chapter);
  const deck = data.components.decks.find((d) => d.prefix === 'CAM');
  const cardHtml = (c) => {
    const site = [c.site?.place, c.site?.region].filter(Boolean).map((id) => {
      const s = map?.settlements?.find((x) => x.id === id) ?? map?.regions?.find((x) => x.id === id);
      return esc(s?.name ?? id);
    });
    const meets = [...(c.meets?.characters ?? []).map(cname), ...(c.meets?.monsters ?? []).map(mname)];
    /* while the card's own plate is not drawn, whoever the chapter meets stands in its window */
    const met = cat.hasPlate(`campaign-${c.id}`) ? null
      : [...(c.meets?.monsters ?? []).map((id) => `monster:${id}`), ...(c.meets?.characters ?? []).map((id) => `character:${id}`)]
        .map((r) => art.resolve(r)).find((e) => e && e.what === 'plate');
    const plate = met
      ? `<figure class="plate landscape stand-in"><img src="${met.small ?? met.src}"${met.small && met.small !== met.src ? ` data-print-src="${met.src}"` : ''} alt="${esc(met.name)}" loading="lazy"><figcaption>${esc(met.name)}, met here · the chapter's own plate is not yet drawn</figcaption></figure>`
      : cat.plate(`campaign-${c.id}`, { format: 'landscape', deck, alt: c.name });
    return `<article class="card-chapter" id="${prefix}-card-${esc(c.id)}">
      ${plate}
      <div class="text"><header class="ehead"><div class="kicker"><span class="code">${esc(c.cardCode)}${cat.campaignMark(camp.id)}</span> · ${camp.source?.work ? `${esc(camp.source.work)}, ` : ''}book ${esc(c.books)}${site.length ? ` · ${site.join(', ')}` : ''}</div><h4 class="ename"><span class="chno">${c.chapter}.</span> ${esc(c.name)}</h4></header>
      <p class="told"><span class="readaloud">Read aloud</span> ${inline(c.told)}</p>
      <ul class="facts"><li><em>Play.</em> ${inline(c.play)}</li>${c.cost ? `<li><em>Cost.</em> ${inline(c.cost)}</li>` : ''}${meets.length ? `<li><em>Met here.</em> ${meets.join(', ')}.</li>` : ''}${c.xenia && typeof c.xenia === 'object' ? `<li><em>Guest-friendship ${c.xenia.kept ? 'kept' : 'broken'}.</em> ${inline(c.xenia.note ?? '')}</li>` : ''}</ul>
      ${c.lesson ? `<p class="lesson">${inline(c.lesson)}</p>` : ''}</div></article>`;
  };
  const byAct = (acts.length ? acts : [{ id: null, name: 'The chapters' }]).map((a) => ({ a, cards: cards.filter((c) => !a.id || c.act === a.id) })).filter((x) => x.cards.length);
  chapters.push({
    id: `${prefix}-deck`, title: 'The deck, chapter by chapter', kind: 'text', runOn: true,
    html: `<header class="chap small"><div class="num">Campaign ${roman(ordinal)} · The deck</div><h2 class="title">The ${word(cards.length)} chapters</h2><p class="lede">Turned in order, never shuffled. Read the passage marked <em>read aloud</em> when the card is turned, then play what it says.</p>${ORNAMENT}</header>`
      + byAct.map(({ a, cards: cs }) => `${a.id ? `<h3 class="act">${esc(a.name)}</h3>` : ''}${cs.map(cardHtml).join('\n')}`).join('\n'),
  });

  /* 5. what it teaches */
  if (camp.teaches?.length) {
    chapters.push({
      id: `${prefix}-teaches`, title: 'What the campaign teaches', kind: 'text', cols: true, runOn: true,
      html: `<header class="chap small"><div class="num">Campaign ${roman(ordinal)}</div><h2 class="title">What it teaches</h2>${ORNAMENT}</header>${vignette(list(camp.teaches.map((t) => `<p>${inline(t)}</p>`), 'ol'))}`,
    });
  }
  return chapters;
}

/* ------------------------------------------------------------- sections */

const sections = [];

/* Annex I first, whatever its place in the book: rendering it is what teaches
   rewriteHref which table a `14-annex.md#heading` link points into. */
const annexOne = annexChapters();

sections.push({ id: 'cover', label: '', title: BOOK_TITLE, kind: 'cover', chapters: [] });
sections.push({ id: 'contents', label: '', title: 'Contents', kind: 'contents', chapters: [] });

sections.push({
  id: 'rules', label: 'Book I', title: 'The Rules',
  subtitle: 'being everything a table needs to know to play, and nothing it does not',
  plate: 'tile-town-hall', plateFormat: 'landscape', plateAlt: 'The town hall', caption: 'The town hall · BLD-39',
  frieze: ['character:chr-01', 'card:MON-01', 'tool:axe', 'board:player', 'people:dwarf'],
  chapters: rulesFiles.map((f, i) => rulesChapter(f, i + 1)),
});

sections.push({
  id: 'annex-1', label: 'Annex I', title: 'The Reference Tables',
  subtitle: 'every number in the game, set from the data the cards were built from',
  plate: 'tile-market', plateFormat: 'landscape', plateAlt: 'The market', caption: 'The market · BLD-37',
  frieze: ['board:ledger', 'tile:granary', 'icon:pricing-deplete', 'board:market', 'tile:sawmill'],
  chapters: annexOne,
});

sections.push({
  id: 'annex-2', label: 'Annex II', title: 'The Catalogue',
  subtitle: 'the base game: every thing in the box, with its picture whole',
  plate: 'monster-vhalrik-the-cinder-crowned', plateFormat: 'portrait', plateAlt: 'Vhalrik, the Cinder-Crowned, on his hoard', caption: 'Vhalrik, the Cinder-Crowned · MON-13',
  frieze: ['character:chr-09', 'vehicle:veh-01', 'building:granary', 'item:lantern', 'spell:kindle', 'event:festival'],
  chapters: catalogueChapters('base', { idPrefix: 'cat', head: 'Annex II · The Catalogue' }),
});

let annexNo = 3;
data.campaigns.campaigns.forEach((camp, i) => {
  const hero = camp.cast?.odysseus ? data.characters.characters.find((c) => c.id === camp.cast.odysseus) : null;
  const plate = hero ? `character-${hero.cardCode.toLowerCase()}` : null;
  sections.push({
    id: `annex-${annexNo}`, label: `Annex ${roman(annexNo)} · Campaign ${roman(i + 1)}`, title: camp.name,
    subtitle: camp.subtitle, plate, plateFormat: 'portrait', plateAlt: hero?.name ?? '', caption: hero ? `${hero.name} · ${hero.cardCode}` : '',
    frieze: [`map:${camp.map}`, ...data.monsters.monsters.filter((m) => m.campaign === camp.id).slice(0, 4).map((m) => `monster:${m.id}`)].filter((r) => art.resolve(r)),
    chapters: campaignChapters(camp, i + 1),
  });
  annexNo++;
});

(data.expansions?.expansions ?? []).forEach((x, i) => {
  sections.push({
    id: `annex-${annexNo}`, label: `Annex ${roman(annexNo)} · Expansion ${roman(i + 1)}`, title: x.name,
    subtitle: x.subtitle, plate: x.plate ?? null, plateFormat: x.plateFormat ?? 'portrait', caption: x.caption ?? '',
    chapters: [
      { id: `expansion-${x.id}-about`, title: 'About the expansion', kind: 'text', cols: true, html: `<header class="chap"><div class="num">Expansion ${roman(i + 1)}</div><h2 class="title">${esc(x.name)}</h2>${ORNAMENT}</header>${P(x.summary)}` },
      ...catalogueChapters(`expansion:${x.id}`, { idPrefix: `expansion-${x.id}`, head: `Expansion ${roman(i + 1)} · ${x.name}` }),
    ],
  });
  annexNo++;
});

sections.push({
  id: 'design', label: `Annex ${roman(annexNo)}`, title: 'The Design Notes',
  subtitle: 'why the rules are shaped the way they are, for the reader who wants to know',
  plate: 'vehicle-veh-01', plateFormat: 'landscape', plateAlt: 'The Reach Flyer', caption: 'The Reach Flyer · VEH-01',
  frieze: ['graph:dependencies', 'flow:blacksmith', 'tool:saw', 'board:depletion', 'modification:spinnaker'],
  chapters: designFiles.map(designChapter),
});

/* The addendum: what a review of the rules found, and what to do about each
   finding. Hand-written in docs/review/, one file per kind of finding, and
   printed last so a table can carry it with the rules or leave it in the box. */
if (reviewFiles.length) {
  sections.push({
    id: 'addendum-1', label: 'Addendum I', title: 'The Review',
    subtitle: 'what a hard reading of the rules found, and what to do about each finding',
    plate: 'character-chr-06', plateFormat: 'portrait', plateAlt: 'Doctor Elspeth Marrow', caption: 'Doctor Elspeth Marrow · CHR-06',
    frieze: ['event:mercenaries-for-hire', 'building:manor', 'item:lantern', 'building:barracks', 'board:ledger'],
    chapters: reviewFiles.map((f, i) => reviewChapter(f, i + 1)),
  });
}

/* -------------------------------------------------------------- the page */

const contentsHtml = () => `<div class="titlepage contents" id="contents-title">${FRAME}<header><div class="label">${esc(GAME)}</div><h1 class="ttitle">Contents</h1>${ORNAMENT}</header>${friezeHtml(['character:chr-01', 'building:town-hall', 'monster:cinder-wolf', 'vehicle:veh-01', 'tool:axe', 'people:elf'])}
<div class="toc-page">${sections.filter((s) => s.chapters.length).map((s) => `<div class="toc-part"><a class="toc-head" href="#${s.id}-title"><span class="lab">${esc(s.label)}</span><span class="ttl">${esc(s.title)}</span></a><ol>${s.chapters.map((c) => `<li><a href="#${esc(c.id)}">${escapeHtml(c.title)}</a></li>`).join('')}</ol></div>`).join('')}</div>
${friezeHtml(['character:chr-03', 'building:market', 'monster:ash-drake', 'vehicle:veh-07', 'item:lantern', 'people:halfling'])}<footer><div class="tcaption">Every section prints on its own: the button on its title page, or <em>Print…</em> in the bar.</div></footer></div>`;

const coverHtml = () => `<div class="titlepage cover" id="cover-title">${FRAME}
  <header><div class="label">${esc(GAME)}</div><h1 class="ttitle grand">${esc(BOOK_TITLE)}</h1><div class="script">being the Rules, the Reference Tables, the Catalogue &amp; the Campaigns</div>${ORNAMENT}</header>
  <figure class="tplate portrait with-frieze"><img ${cat.plateImgSrc('people-human')} alt="A builder at work"></figure>${friezeHtml(['character:chr-02', 'monster:ash-drake', 'building:town-hall', 'vehicle:veh-05', 'character:chr-11'])}
  <footer class="short"><div class="tcaption">Set from the game's own data. The figures here are the figures on the cards.</div></footer>
</div>`;

const sectionHtml = (s) => {
  if (s.kind === 'cover') return `<section class="part" id="${s.id}" data-label="Cover">${coverHtml()}</section>`;
  if (s.kind === 'contents') return `<section class="part" id="${s.id}" data-label="Contents">${contentsHtml()}</section>`;
  if (!s.chapters.length) return '';
  return `<section class="part" id="${s.id}" data-label="${esc(`${s.label} · ${s.title}`)}">${titlePage(s)}
${s.chapters.map((c) => `<article class="chapter ${c.kind}${c.cols ? ' cols' : ''}${c.runOn ? ' run-on' : ''}${c.notes ? ' notes' : ''}${c.keep ? ' keep' : ''}" id="${esc(c.id)}" data-title="${escapeHtml(c.title)}">\n${c.cols ? columnize(wordsAfterHeads(fitTables(c.html, true))) : fitTables(c.html, false)}\n</article>`).join('\n')}
</section>`;
};

const navHtml = sections.filter((s) => s.chapters.length).map((s) => `<div class="nav-part"><a href="#${s.id}-title"><b>${esc(s.label)}</b> ${esc(s.title)}</a>${s.chapters.map((c) => `<a class="ch" href="#${esc(c.id)}">${escapeHtml(c.title)}</a>`).join('')}</div>`).join('\n');

/* The faces, and what each is for, are docs/book/fonts/README.md. Three of the
   families are built here out of two files each: the Fell types have only
   old-style figures, in which a 1 is a small capital I and 10 reads IO, so every
   head borrows its digits from Merriweather, scaled to the Fell's cap height
   (the `adjust`) and drawn at the head's own light weight. A Fell face is
   declared over every weight so that nothing is ever emboldened by the browser. */
const FONTS = [
  /* family, style, weight range, file, unicode-range, size-adjust */
  ['Book Serif', 'normal', '300 900', 'merriweather-var'], ['Book Serif', 'italic', '300 900', 'merriweather-var-italic'],
  ['Book Display', 'normal', '100 900', 'im-fell-english-400'], ['Book Display', 'italic', '100 900', 'im-fell-english-400-italic'],
  ['Book Display', 'normal', '100 900', 'merriweather-var', 'U+0030-0039', '90%'], ['Book Display', 'italic', '100 900', 'merriweather-var-italic', 'U+0030-0039', '90%'],
  ['Book Label', 'normal', '100 900', 'im-fell-english-sc-400'], ['Book Label', 'normal', '100 900', 'merriweather-var', 'U+0030-0039', '84%'],
  ['Book Grand', 'normal', '100 900', 'im-fell-great-primer-400'], ['Book Grand', 'normal', '100 900', 'merriweather-var', 'U+0030-0039', '93%'],
  ['Alegreya Sans', 'normal', '400', 'alegreya-sans-400'], ['Alegreya Sans', 'italic', '400', 'alegreya-sans-400-italic'], ['Alegreya Sans', 'normal', '700', 'alegreya-sans-700'],
  ['Oswald', 'normal', '400 700', 'oswald-var'],
].map(([f, st, w, file, range, adjust]) => `@font-face{font-family:'${f}';font-style:${st};font-weight:${w};font-display:swap;src:url(fonts/${file}.woff2) format('woff2')${range ? `;unicode-range:${range}` : ''}${adjust ? `;size-adjust:${adjust}` : ''}}`).join('\n');

const css = readFileSync(join(ROOT, 'tools', 'lib', 'book.css'), 'utf8')
  .replace(/\$\{(\w+)\}/g, (_, k) => ({
    TALLOW: palette.paper.tallow.hex, FOXING: palette.paper.foxing.hex, SOOT: palette.ink.soot.hex,
    T85: palette.ink.tints['85'].hex, T70: palette.ink.tints['70'].hex, T55: palette.ink.tints['55'].hex,
    T40: palette.ink.tints['40'].hex, T25: palette.ink.tints['25'].hex, T12: palette.ink.tints['12'].hex,
    T70U: palette.ink.tints['70'].hex.replace('#', '%23'),
    OCHRE: palette.inks.ochre.hex, OXIDE: palette.inks.oxide.hex, SLATE: palette.inks.slate.hex,
    VERDIGRIS: palette.inks.verdigris.hex, BRUISE: palette.inks.bruise.hex, LINK: palette.categories.drink.wash,
  })[k]);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(BOOK_TITLE)} — ${escapeHtml(GAME)}</title>
<style>
${FONTS}
${css}
</style>
</head>
<body>

<div class="bar">
  <strong>${escapeHtml(BOOK_TITLE)}</strong>
  <a href="../index.html">Explorer</a>
  <a href="../cards/index.html">Cards</a>
  <a href="../tiles/index.html">Tiles</a>
  <a href="../boards/index.html">Player board</a>
  <a href="../map/index.html">Map</a>
  <a href="../mint/index.html">The mint</a>
  <button type="button" id="open-print">Print…</button>
</div>

<div class="wrap">
  <nav class="toc" aria-label="Contents">
${navHtml}
  </nav>
  <main class="book">
${sections.map(sectionHtml).join('\n\n')}
  </main>
</div>

<div class="print-panel" id="print-panel" hidden>
  <div class="panel">
    <h2>Print</h2>
    <p>Choose what to print. A section prints with its title page; open a section to pick single chapters. Set the printer to A4, 100%, backgrounds on. The pictures are shown at screen resolution and swapped for the full-size ones here, so print from this panel rather than the browser's own command.</p>
    <div class="picks" id="picks"></div>
    <div class="actions"><button type="button" id="pick-all">All</button><button type="button" id="pick-none">None</button><span class="spacer"></span><button type="button" id="do-print" class="primary">Print selection</button><button type="button" id="close-print">Close</button></div>
  </div>
</div>

<script>
${readFileSync(join(ROOT, 'tools', 'lib', 'book-print.js'), 'utf8')}
</script>
</body>
</html>
`;

if (checkOnly) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* absent counts as stale */ }
  if (current !== page) {
    console.error('docs/book/index.html is stale. Run: node tools/build-book.mjs');
    process.exit(1);
  }
  console.log('docs/book/index.html is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, page, 'utf8');
  const counts = sections.filter((s) => s.chapters.length).map((s) => `${s.label || s.title}: ${s.chapters.length}`).join(', ');
  console.log(`wrote docs/book/index.html (${(page.length / 1024).toFixed(1)} kB) — ${counts}`);
  if (!rulesFiles.length) console.warn('warning  docs/rules/ holds no chapters yet; Book I is empty');
}
