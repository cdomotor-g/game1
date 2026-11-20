#!/usr/bin/env node
/**
 * Renders The Law of the Land - docs/book/law.html - from docs/rules/*.md, the
 * same chapters The Almanac (docs/book/index.html) is built from. One set of
 * rules, two books: The Almanac is set to be read, this one to be looked up.
 *
 * Every rule has a number, and the numbers are never typed. A chapter is a
 * Part, its `##` heads are sections (4.2), its `###` heads subsections (4.2.3),
 * every paragraph, table, step and note under them a clause (4.2.3.1), and a
 * list straight after a paragraph that paragraph's sub-clauses. tools/lib/law.mjs
 * says exactly how.
 *
 * The book is kept in loose leaves, one A4 sheet each, printed one side, and the
 * whole design is that a change costs the leaves it touches and no others:
 *
 *   - each Part starts on a new leaf, coded 4-1, 4-2 ... in its top corner;
 *   - a number once printed stays put: a new clause between two others takes a
 *     letter (4.2.3A), and one taken out is left as "[Repealed]";
 *   - a leaf keeps the clauses it was printed with; one too full for what was
 *     added gets a companion leaf, 4-3a, rather than pushing the Part along.
 *
 * What was printed is docs/book/law-register.json, written by this tool and
 * committed beside the page. Each run diffs the chapters against it: an
 * unchanged leaf keeps its date; a changed one is reissued under the next
 * AMENDMENT, one per day on which something changed, and the page's Print panel
 * lists exactly the leaves to reprint since whichever amendment a reader last
 * filed. Every leaf carries a stamp - its fingerprint - so a sheet in the
 * binder can be checked against the one online.
 *
 * Where a leaf needs packing, the clauses are MEASURED in a headless Chromium
 * (tools/lib/chromium.mjs) at the leaf's own width, with the page's own faces -
 * a leaf has to fit its sheet, and a guess at line breaks is how one does not.
 * With no browser it estimates, and says so. --check never measures: it fails if
 * anything in the chapters would change a leaf, and otherwise rebuilds the page
 * from the register exactly.
 *
 * Usage: node tools/build-law.mjs [--check] [--date=YYYY-MM-DD]
 *        node tools/build-law.mjs --repaginate    repack every leaf, keep every number
 *        node tools/build-law.mjs --consolidate   a new edition: renumber, repack, start again
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { renderMarkdown, escapeHtml } from './lib/docpage.mjs';
import { loadData, interpolate, inline, BOOK_FONTS } from './lib/book.mjs';
import { artIndex, pictureHtml } from './lib/book-art.mjs';
import { treeOf, align, fresh, packGreedy, packStable, hash } from './lib/law.mjs';
import { findChromium } from './lib/chromium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES = join(ROOT, 'docs', 'rules');
const OUT_DIR = join(ROOT, 'docs', 'book');
const OUT = join(OUT_DIR, 'law.html');
const REG = join(OUT_DIR, 'law-register.json');
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const checkOnly = process.argv.includes('--check');
const consolidate = process.argv.includes('--consolidate');
const repaginate = process.argv.includes('--repaginate');
const estimateOnly = process.argv.includes('--estimate');
const TODAY = arg('date') ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(TODAY)) { console.error(`--date=${TODAY} is not YYYY-MM-DD`); process.exit(1); }
if (checkOnly && (consolidate || repaginate)) { console.error('--check only reads; it cannot also consolidate or repaginate'); process.exit(1); }

const TITLE = 'The Law of the Land';

/* The one table of leaf measurements, in mm. law.css is filled from it and the
   leaves are packed by it, so the page that was measured is the page that
   prints. SAFETY is what a leaf leaves empty at its foot, for the difference
   between this machine's browser and a reader's. */
const LEAF = { W: 210, H: 297, TOP: 11, BOTTOM: 9, LEFT: 25, RIGHT: 15, HEAD: 12, FOOT: 11, GUTTER: 17, STEP: 7, SAFETY: 6, UNIT_PAD: 1.5, BAR_OFF: 5 };
LEAF.BODY = LEAF.H - LEAF.TOP - LEAF.BOTTOM - LEAF.HEAD - LEAF.FOOT;
LEAF.CAP = LEAF.BODY - LEAF.SAFETY;
LEAF.TEXT = LEAF.W - LEAF.LEFT - LEAF.RIGHT - LEAF.GUTTER;
const TOC = { ROW: 5.3, PART: 9.5, HEAD: 17 };
const RECORD_ROW = 7.4;

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const { data } = loadData(ROOT);
const art = artIndex(ROOT, data);

const fmtDate = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const dash = (id) => id.replace('-', '–');
const plain = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<\/t[dh]>/g, ' | ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------ the register */

const reg = existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : null;
const freshBook = !reg || consolidate;
const edition = freshBook ? { n: (reg?.edition?.n ?? 0) + 1, date: TODAY } : reg.edition;
const amendments = freshBook ? [] : reg.amendments.map((a) => ({ ...a, leaves: [...a.leaves], withdrawn: [...(a.withdrawn ?? [])], changes: [...a.changes] }));

/* The amendment this run's changes go under, allocated the first time one is
   found: today's if there already is one, the next number if not. A new
   edition's leaves are its original issue, amendment 0. */
let CUR = null;
const current = () => {
  if (freshBook) return 0;
  if (CUR != null) return CUR;
  const last = amendments.at(-1);
  CUR = last && last.date === TODAY ? last.n : (last?.n ?? 0) + 1;
  return CUR;
};
const dateOf = (n) => (n ? amendments.find((a) => a.n === n)?.date ?? TODAY : edition.date);

/** The register's flat list of a Part's nodes back into the tree it was. */
function treeFromFlat(nodes = []) {
  const top = []; const byNum = new Map();
  for (const f of nodes) {
    const node = { n: f.num.split('.').at(-1), num: f.num, kind: f.k, key: f.key, sig: f.sig, since: f.since, x: f.x, rep: f.rep, h: f.h, c: [] };
    byNum.set(f.num, node);
    const parent = f.num.split('.').slice(0, -1).join('.');
    (parent.includes('.') ? byNum.get(parent)?.c : top)?.push(node);
  }
  return top;
}

/* ------------------------------------------------------------- the chapters */

const files = readdirSync(RULES).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
const parts = files.map((file) => {
  const num = Number(file.slice(0, 2));
  const slug = file.replace(/\.md$/, '');
  const where = `docs/rules/${file}`;
  const tree = treeOf(readFileSync(join(RULES, file), 'utf8'), where);
  const old = freshBook ? null : reg.parts[slug];
  const children = old ? align(treeFromFlat(old.nodes), tree.children, where) : fresh(tree.children, freshBook ? 'same' : 'inserted');
  return { file, num, slug, where, title: tree.title, lede: tree.lede, children, old };
});
{
  const seen = new Map();
  for (const p of parts) {
    if (seen.has(p.num)) throw new Error(`docs/rules/${p.file} and ${seen.get(p.num)} are both Part ${p.num}`);
    seen.set(p.num, p.file);
  }
}

/* Full numbers, and where every link can point. */
const anchors = new Map(); /* `file#slug` -> number */
const partOf = new Map(parts.map((p) => [p.file, p.num]));
for (const p of parts) {
  const walk = (list, prefix) => list.forEach((n) => {
    n.num = `${prefix}.${n.n}`;
    if (n.slug && n.status !== 'repealed' && n.status !== 'stub') anchors.set(`${p.file}#${n.slug}`, n.num);
    walk(n.children, n.num);
  });
  walk(p.children, String(p.num));
}
function rewriteHref(href) {
  const m = href.match(/^(?:\.\.\/rules\/)?(\d{2}-[a-z0-9-]+\.md)(?:#(.*))?$/);
  if (!m || !partOf.has(m[1])) return href;
  const at = m[2] && anchors.get(`${m[1]}#${m[2]}`);
  return at ? `#s${at}` : `#part-${partOf.get(m[1])}`;
}
/* a link inside the book says where it goes, so it still works on paper */
const xrefs = (html) => html.replace(/<a href="#(part-(\d+)|s([\d.A-Z]+))">([\s\S]*?)<\/a>/g, (m, _, part, sec) => `${m} <span class="xref">(${part ? `Part ${part}` : `§${sec}`})</span>`);

/* --------------------------------------------------------------- pictures */

/**
 * A figure, as the Law shows it. The Law shows the PIECES - cards, tiles,
 * boards, flows of work, marks, maps - because those are what a rule talks
 * about; a drawn plate is shown as the card it is the picture on, and a plate
 * that is on no card (a people) is left to The Almanac. Every picture stands in
 * a box of a fixed size, so a plate redrawn changes no line of any leaf.
 */
const SIZES = ['margin', 'third', 'half', 'wide', 'frieze'];
function component(e) {
  if (e.what !== 'plate') return e.what === 'sheet' ? null : e;
  const tile = e.ref.match(/^plate:tile-(.+)$/);
  if (tile && art.entries.has(`tile:${tile[1]}`)) return art.entries.get(`tile:${tile[1]}`);
  return e.code ? art.entries.get(`card:${e.code}`) ?? null : null;
}
function lawFigure(b, where, room) {
  let size = 'margin'; let caption = '';
  if (b.a != null && SIZES.includes(b.a.trim())) { size = b.a.trim(); caption = (b.b ?? '').trim(); } else { caption = (b.a ?? '').trim(); if (b.b) caption = `${caption} ${b.b}`.trim(); }
  const refs = b.refs.split(',').map((r) => r.trim());
  const pieces = refs.map((r) => {
    const e = art.resolve(r);
    if (!e) throw new Error(`${where}: {{fig:${r}}} names a picture the book does not have`);
    return component(e);
  }).filter(Boolean);
  const sig = `fig|${refs.join(',')}|${size}|${caption}`;
  if (!pieces.length) return { html: '', sig };
  const cap = caption ? `<figcaption>${inline(interpolate(caption, data, where))}</figcaption>` : '';
  const aspect = (e) => (e.inline ? 1 : e.w > 0 && e.h > 0 ? e.w / e.h : 1);
  const box = (e, w, h) => `<div class="bx" style="width:${w.toFixed(1)}mm;height:${h.toFixed(1)}mm;aspect-ratio:${(w / h).toFixed(3)}">${pictureHtml(e, { small: true, root: ROOT })}</div>`;
  if (pieces.length > 1) {
    const each = (room - 3 * (pieces.length - 1)) / pieces.length;
    const cells = pieces.map((e) => {
      const a = aspect(e);
      const w = e.inline ? Math.min(each, 22) : Math.min(each, 26 * a);
      const inner = e.inline ? e.inline : box(e, w, e.inline ? 8 : w / a);
      return `<div class="pc" style="width:${w.toFixed(1)}mm">${inner}<span class="pn">${escapeHtml(e.name)}</span></div>`;
    }).join('');
    return { html: `<figure class="lfig block"><div class="row">${cells}</div>${cap}</figure>`, sig };
  }
  const e = pieces[0]; const a = aspect(e);
  if (e.inline) return { html: `<figure class="lfig side" style="width:30mm">${e.inline}${cap}</figure>`, sig };
  const drawing = ['board', 'flow', 'map', 'graph'].includes(e.what);
  if (drawing || size === 'wide' || size === 'half') {
    /* a flow of one recipe is tall and narrow, and gets the height a wide one would */
    const tall = a < 0.8 ? 58 : size === 'margin' || size === 'third' ? 42 : size === 'half' ? 50 : 58;
    const w = Math.min(room, tall * a);
    /* the caption is given a line worth reading even under a narrow picture */
    const fw = Math.max(w, Math.min(room, 80));
    return { html: `<figure class="lfig block" style="width:${fw.toFixed(1)}mm">${box(e, w, w / a)}${cap}</figure>`, sig };
  }
  const tall = size === 'third' ? 38 : 30;
  const w = Math.min(36, tall * a);
  return { html: `<figure class="lfig side" style="width:${w.toFixed(1)}mm">${box(e, w, w / a)}${cap}</figure>`, sig };
}

/* ------------------------------------------------------------------ units */

/**
 * One Part as units: its head, then every section, subsection and clause in
 * reading order, each a box that goes on one leaf whole. A head keeps with what
 * follows it, and so does a paragraph with the sub-clauses it introduces.
 */
const md = (s, where) => renderMarkdown(interpolate(s, data, where), { rewriteHref }).html;
function unitsOf(p) {
  const units = [];
  const head = `<div class="pno">Part ${p.num}</div><h2>${inline(interpolate(p.title, data, p.where))}</h2>${p.lede ? `<p class="purpose"><b>Purpose</b>${xrefs(md(p.lede, p.where)).replace(/^<p>|<\/p>$/g, '')}</p>` : ''}`;
  units.push({ id: `${p.num}:head`, cls: 'head', anchor: `part-${p.num}`, html: head, sig: hash(`head|${plain(head)}`), keep: true, since: null });
  const walk = (list) => {
    for (const n of list) {
      const depth = n.num.split('.').length;
      const d = `d${Math.min(depth, 5)}`;
      if (n.status === 'repealed' || n.status === 'stub') {
        n.since = n.status === 'stub' ? n.old.since : null; /* filled in below */
        n.how = n.status === 'stub' ? n.old.h : 'r';
        n.rep = n.status === 'stub' ? n.old.rep : null;
        units.push({ id: n.num, node: n, cls: `cl rep ${d}`, anchor: `s${n.num}`, html: '', sig: hash(`${n.num}|repealed`), keep: false, repealed: true });
        continue;
      }
      let body; let cls;
      if (n.kind === 'section' || n.kind === 'subsection') {
        const t = inline(interpolate(n.title, data, p.where));
        body = n.kind === 'section' ? `<h3>${t}<!--h--></h3>` : `<h4>${t}<!--h--></h4>`;
        cls = `${n.kind === 'section' ? 'sec' : 'sub'} ${d}`;
      } else {
        const room = LEAF.TEXT - Math.max(0, depth - 3) * LEAF.STEP;
        let text = xrefs(md(n.src, p.where));
        if (n.kind === 'open' || n.kind === 'quote') text = text.replace(/^<blockquote>/, '').replace(/<\/blockquote>$/, '');
        /* where the note of the clause's history goes: the end of its words */
        text = /<\/p>$/.test(text) ? text.replace(/<\/p>$/, '<!--h--></p>') : `${text}<!--h-->`;
        const figs = n.figs.map((b) => lawFigure(b, p.where, room));
        /* a picture stands beside words, never beside a table, which will not
           narrow for it and drops below it instead */
        const beside = n.kind === 'table' ? [] : figs.filter((f) => f.html.includes('lfig side'));
        const side = beside.map((f) => f.html).join('');
        const block = figs.filter((f) => !beside.includes(f)).map((f) => f.html.replace('lfig side', 'lfig after')).join('');
        body = `<div class="tx">${side}${text}${block}</div>`;
        n.figSig = figs.map((f) => f.sig).join('||');
        cls = `cl ${n.kind} ${d}${n.children.length ? ' lead' : ''}`;
      }
      const sig = hash(`${n.num}|${n.kind}|${plain(body)}|${n.figSig ?? ''}`);
      n.contentSig = sig;
      /* the words alone: a figure's names are not what the clause says */
      n.excerpt = plain(body.replace(/<figure[\s\S]*?<\/figure>/g, '')).slice(0, 72);
      units.push({ id: n.num, node: n, cls, anchor: `s${n.num}`, html: body, sig, keep: n.kind === 'section' || n.kind === 'subsection' || n.children.length > 0 });
      walk(n.children);
    }
  };
  walk(p.children);
  return units;
}
const allParts = parts.map((p) => ({ p, units: unitsOf(p) }));

/* What changed, clause by clause. A clause whose own text is the same may still
   print differently - a {{token}} in it whose number the data has moved - and
   that is an amendment as much as a reworded one. */
const changes = [];
for (const { p, units } of allParts) {
  for (const u of units) {
    const n = u.node;
    if (!n) continue;
    if (n.status === 'stub') continue;
    if (n.status === 'same' && n.old && n.old.sig !== u.sig) n.status = 'amended';
    if (n.status === 'same') { n.since = n.old?.since ?? 0; n.how = n.old?.h; continue; }
    if (freshBook) { n.since = 0; continue; }
    n.how = n.status === 'inserted' ? 'i' : 'a';
    /* a new Part is one change, not one for every clause in it */
    if (p.old) changes.push({ num: n.num, what: n.status, x: n.status === 'repealed' ? n.old.x : n.excerpt });
  }
  if (!freshBook && !p.old) changes.push({ num: String(p.num), what: 'inserted', x: `Part ${p.num}: ${p.title}` });
}
const goneParts = freshBook ? [] : Object.keys(reg.parts).filter((slug) => !parts.some((p) => p.slug === slug));
for (const slug of goneParts) changes.push({ num: String(reg.parts[slug].part), what: 'repealed', x: `Part ${reg.parts[slug].part}: ${reg.parts[slug].title}` });
if (changes.length) {
  const n = current();
  for (const { units } of allParts) for (const u of units) {
    const node = u.node;
    if (!node) continue;
    if (node.status === 'amended' || node.status === 'inserted') node.since = n;
    if (node.status === 'repealed') { node.rep = n; node.since = n; }
  }
}

/* What a unit prints, now its history is known: the number, the text, and the
   note of where it came from - which is printed for good, unlike the change
   bar, which marks only what the leaf's own latest issue changed. */
function unitHtml(u, { bar = false } = {}) {
  if (u.cls === 'head' || u.cls.startsWith('toc') || u.cls === 'title' || u.cls === 'record' || u.cls === 'tochead') {
    return `<div class="u ${u.cls}"${u.anchor ? ` id="${u.anchor}"` : ''} data-u="${u.id}">${u.html}</div>`;
  }
  const n = u.node;
  let body = u.html;
  if (u.repealed) body = `<div class="tx">[Repealed — Amendment ${n.rep}]</div>`;
  else body = body.replace('<!--h-->', n.since > 0 ? ` <span class="hist">${n.how === 'i' ? 'Ins.' : 'Am.'}&nbsp;${n.since}</span>` : '');
  const chg = bar ? ' chg' : '';
  return `<div class="u ${u.cls}${chg}" id="${u.anchor}" data-u="${u.id}"><span class="no">${u.id}</span>${body}</div>`;
}

/* -------------------------------------------------------------- measuring */

const fill = (s) => s.replace(/\$\{(\w+)\}/g, (_, k) => ({
  TALLOW: palette.paper.tallow.hex, FOXING: palette.paper.foxing.hex, SOOT: palette.ink.soot.hex,
  T85: palette.ink.tints['85'].hex, T70: palette.ink.tints['70'].hex, T55: palette.ink.tints['55'].hex,
  T40: palette.ink.tints['40'].hex, T25: palette.ink.tints['25'].hex, T12: palette.ink.tints['12'].hex,
  OCHRE: palette.inks.ochre.hex, OXIDE: palette.inks.oxide.hex, SLATE: palette.inks.slate.hex, LINK: palette.categories.drink.wash,
  LEAF_W: LEAF.W, LEAF_H: LEAF.H, LEAF_TOP: LEAF.TOP, LEAF_BOTTOM: LEAF.BOTTOM, LEAF_LEFT: LEAF.LEFT, LEAF_RIGHT: LEAF.RIGHT,
  LEAF_HEAD: LEAF.HEAD, LEAF_FOOT: LEAF.FOOT, LEAF_BODY: LEAF.BODY, LEAF_CAP: LEAF.CAP, LEAF_GUTTER: LEAF.GUTTER, LEAF_STEP: LEAF.STEP,
  UNIT_PAD: LEAF.UNIT_PAD, BAR_OFF: LEAF.BAR_OFF, TOC_ROW: TOC.ROW, TOC_PART: TOC.PART, TOC_HEAD: TOC.HEAD, RECORD_ROW,
})[k] ?? `\${${k}}`);
const css = fill(readFileSync(join(ROOT, 'tools', 'lib', 'law.css'), 'utf8'));

let measured = 'none';
/**
 * Every unit's height in mm, measured in a headless Chromium at the width of a
 * leaf's body, with the page's own faces and stylesheet. `null` when there is
 * no browser; the caller estimates instead.
 */
function measure(units) {
  const chromium = estimateOnly ? null : findChromium();
  if (!chromium) return null;
  const dir = join(tmpdir(), `law-measure-${process.pid}`);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'measure.html');
  /* every face is loaded by name before anything is measured: fonts.ready alone
     can resolve before a lazily-loaded face has even been asked for */
  const script = `Promise.all([...document.fonts].map((f) => f.load().catch(() => null))).then(() => document.fonts.ready).then(() => setTimeout(() => {
    const k = 25.4 / 96, out = {};
    for (const u of document.querySelectorAll('.lbody > .u')) out[u.dataset.u] = +(u.getBoundingClientRect().height * k).toFixed(2);
    document.body.innerHTML = '<pre id="law-measure">' + JSON.stringify(out) + '</pre>';
  }, 50));`;
  writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><base href="${pathToFileURL(OUT_DIR).href}/"><style>${BOOK_FONTS}\n${css}</style></head><body><div class="lbody" style="width:${LEAF.W - LEAF.LEFT - LEAF.RIGHT}mm;height:auto;border:0">${units.map((u) => unitHtml(u)).join('')}</div><script>${script}</script></body></html>`);
  try {
    /* a window as wide as a desk: at the headless default of 800px the page's
       phone layout applies, and every clause measured for the wrong page */
    const dom = execFileSync(chromium, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=1400,2000', '--virtual-time-budget=30000', '--dump-dom', pathToFileURL(file).href],
      { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'], timeout: 5 * 60 * 1000 });
    const m = dom.match(/<pre id="law-measure">([\s\S]*?)<\/pre>/);
    if (!m) return null;
    return JSON.parse(m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  } catch { return null; } finally { rmSync(dir, { recursive: true, force: true }); }
}
/**
 * The fallback, when there is no browser to measure in: an estimate built to
 * come out a little OVER what a browser measures (checked against the measured
 * heights when this was written), because a leaf packed too loose wastes paper
 * and one packed too tight runs off its sheet. A line of text is about 0.56 of
 * a character per millimetre of measure and 4.45mm deep; a table row is its
 * wordiest cell wrapped to its column; a figure is its tallest box, its names
 * and its caption, and one set to the side shares its height with the words.
 */
function estimate(u) {
  const depth = Number(/\bd(\d)\b/.exec(u.cls)?.[1] ?? 3);
  const width = LEAF.TEXT - Math.max(0, depth - 3) * LEAF.STEP;
  const lines = (text, w, perMm = 0.56) => (text ? Math.ceil(text.length / Math.max(8, w * perMm)) : 0);
  const figs = [...u.html.matchAll(/<figure class="lfig (side|block|after)"[^>]*>([\s\S]*?)<\/figure>/g)].map((m) => {
    const boxes = [...m[2].matchAll(/class="bx" style="width:([\d.]+)mm;height:([\d.]+)mm/g)].map((b) => [Number(b[1]), Number(b[2])]);
    const fw = Number(/width:([\d.]+)mm/.exec(m[0])?.[1] ?? width);
    const cap = plain(/<figcaption>([\s\S]*?)<\/figcaption>/.exec(m[2])?.[1] ?? '');
    const h = Math.max(8, ...boxes.map((b) => b[1])) + (/class="pn"/.test(m[2]) ? 3.4 : 0) + (cap ? 1 + lines(cap, fw, 0.62) * 3.4 : 0);
    return { side: m[1] === 'side', h: h + (m[1] === 'side' ? 1.6 : 1.8) };
  });
  const html = u.html.replace(/<figure[\s\S]*?<\/figure>/g, '');
  let body;
  if (/<table>/.test(html)) {
    const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => plain(c[1])));
    const n = Math.max(1, ...rows.map((r) => r.length));
    body = rows.reduce((sum, r) => sum + 1.4 + 3.8 * Math.max(1, ...r.map((c) => lines(c, width / n - 3, 0.6))), 0) + (/<img/.test(html) ? rows.length : 0);
  } else if (u.cls === 'head') {
    const lede = plain(/<p class="purpose">([\s\S]*?)<\/p>/.exec(html)?.[1] ?? '');
    body = 30 + lines(lede, LEAF.TEXT) * 4.6;
  } else {
    body = Math.max(1, lines(plain(html), width)) * 4.45 + ((html.match(/<p>/g) ?? []).length > 1 ? 1 : 0);
  }
  const side = Math.max(0, ...figs.filter((f) => f.side).map((f) => f.h));
  const block = figs.filter((f) => !f.side).reduce((s, f) => s + f.h, 0);
  const pad = u.cls.startsWith('sec') ? 5 : u.cls.startsWith('sub') ? 3.2 : LEAF.UNIT_PAD;
  return (pad + Math.max(body, side) + block) * 1.04;
}

/* ----------------------------------------------------------------- leaves */

const leafSig = (us) => hash(`${edition.n}|${us.map((u) => u.sig).join(',')}`);
const withdrawn = [];
/* A dry run first: every unit back on its old leaf, heights left out. If no
   leaf's fingerprint moved, nothing needs measuring - and --check never gets
   further than this. */
const dry = (old, units) => packStable(units.map((u) => ({ ...u, h: 0 })), old, Infinity, { sigOf: leafSig, current: -1 });
let needMeasure = freshBook || repaginate;
for (const ap of allParts) {
  if (!ap.p.old || freshBook) { needMeasure = true; continue; }
  const r = dry(ap.p.old.leaves, ap.units);
  if (r.withdrawn.length || r.leaves.some((l) => l.since === -1)) needMeasure = true;
}
if (checkOnly && (needMeasure || changes.length)) {
  const what = changes.slice(0, 6).map((c) => `${c.num} ${c.what}`).join(', ');
  console.error(`docs/book/law.html is stale: the rules have moved since the Law was last built${what ? ` (${what}${changes.length > 6 ? ' ...' : ''})` : ''}. Run: node tools/build-law.mjs`);
  process.exit(1);
}
let heights = null;
if (needMeasure) {
  heights = measure(allParts.flatMap((ap) => ap.units));
  measured = heights ? 'chromium' : 'estimate';
  if (!heights) console.warn('warning  no browser to measure the clauses in; the leaves are packed from an estimate - proof them with node tools/law-proof.mjs on a machine that has one');
}
const hOf = (u) => heights?.[u.id] ?? estimate(u);

for (const ap of allParts) {
  const { p, units } = ap;
  const sized = units.map((u) => ({ ...u, h: needMeasure ? hOf(u) : 0 }));
  const old = p.old && !freshBook ? p.old.leaves : null;
  if (old && !repaginate) {
    const r = packStable(sized, old, needMeasure ? LEAF.CAP : Infinity, { sigOf: leafSig, current: -2 });
    ap.leaves = r.leaves;
    withdrawn.push(...r.withdrawn.map((c) => `${p.num}-${c}`));
  } else {
    ap.leaves = packGreedy(sized, LEAF.CAP).map((us, i) => {
      const code = String(i + 1); const sig = leafSig(us);
      const was = old?.find((l) => l.code === code);
      return { code, units: us, sig, since: freshBook ? 0 : was && was.sig === sig ? was.since : -2 };
    });
    if (old) withdrawn.push(...old.filter((l) => !ap.leaves.some((x) => x.code === l.code)).map((l) => `${p.num}-${l.code}`));
  }
  for (const l of ap.leaves) {
    if (l.since === -2) l.since = current();
    const over = l.units.reduce((s, u) => s + u.h, 0);
    if (needMeasure && over > LEAF.CAP + 0.01) console.warn(`warning  leaf ${p.num}-${l.code} holds ${over.toFixed(0)}mm on a ${LEAF.CAP}mm page${l.units.length === 1 ? ' - one clause taller than a leaf' : ' - its page style has changed under it; run node tools/build-law.mjs --repaginate'}`);
  }
}
for (const slug of goneParts) withdrawn.push(...reg.parts[slug].leaves.map((l) => `${reg.parts[slug].part}-${l.code}`));

/* --------------------------------------------------------- front matter */

const leafOf = new Map(); /* unit id -> leaf id */
for (const { p, leaves } of allParts) for (const l of leaves) for (const u of l.units) leafOf.set(u.id, `${p.num}-${l.code}`);

const titleUnit = {
  id: 'title', cls: 'title', alone: true, h: LEAF.CAP,
  html: `<p class="t1">${TITLE}</p>
<p class="t2">The rules of play, every one of them numbered, kept in loose leaves</p>
<p class="longtitle">An Act to set down the rules of play; to give every rule a number that no later change can take from it; and to keep the whole in loose leaves, so that a change costs no more paper than it touches.</p>
<p class="ed">Edition ${edition.n} · ${edition.n > 1 ? 'consolidated ' : ''}${fmtDate(edition.date)}</p>
<div class="how">
<h3>Reading a number</h3>
<p><b>4.2.3.1</b> is Part 4, section 2, clause 3, sub-clause 1. The Parts follow the chapters of <i>The Almanac</i>, which sets the same rules out to be read straight through; this book is for looking a rule up and settling a question at the table. A number in brackets after a link, like (Part 5) or (§5.3), is where that link goes.</p>
<h3>Leaves</h3>
<p>Every Part starts on a new leaf. A leaf is one sheet, printed on one side, and its code is in its top corner: 4–3 is the third leaf of Part 4. Keep the leaves in code order, one to a sleeve.</p>
<h3>When a rule changes</h3>
<p>A changed leaf is reissued under the same code, with the amendment and its date in its footer and a bar in the margin beside what changed. A new rule takes a letter rather than a number, so 4.2.3A comes after 4.2.3, and a rule taken out stays as “[Repealed]”: no other number ever moves. A leaf too full for what was added gets a companion, 4–3a, filed straight after 4–3.</p>
<h3>Keeping your copy up to date</h3>
<p>Open the book online, press <b>Print…</b>, choose <b>What changed since</b> and pick the amendment you last filed. Print only those leaves, swap them in, take out any leaf the list says is withdrawn, and note the amendment on the record, which is the next leaf. The <b>stamp</b> in a footer is that leaf’s fingerprint: if the stamp on your sheet is not the one online, the sheet is out of date.</p>
</div>`,
};
const recordRows = Math.floor((LEAF.CAP - 34) / RECORD_ROW);
const recordUnit = {
  id: 'record', cls: 'record', alone: true, h: LEAF.CAP,
  html: `<h2>Record of amendments</h2><p>Write each amendment here as you file its leaves. The online book lists what every amendment changed and which leaves it reissued.</p>
<table><thead><tr><th style="width:18%">Amendment</th><th style="width:24%">Dated</th><th style="width:24%">Filed on</th><th>By</th></tr></thead><tbody>${'<tr><td></td><td></td><td></td><td></td></tr>'.repeat(recordRows)}</tbody></table>`,
};
const tocUnits = [{ id: 'toc:head', cls: 'tochead', keep: true, h: TOC.HEAD, html: '<h2>Contents</h2>' }];
for (const { p, units } of allParts) {
  const row = (cls, no, t, leaf, href) => `<span class="no">${no}</span><a class="t" href="#${href}">${t}</a><span class="dots"></span><span class="lv">${dash(leaf)}</span>`;
  tocUnits.push({ id: `toc:${p.num}`, cls: 'toc part', keep: true, h: TOC.PART, html: row('part', `Part ${p.num}`, inline(interpolate(p.title, data, p.where)), leafOf.get(`${p.num}:head`), `part-${p.num}`) });
  for (const u of units) {
    if (!u.node || u.node.kind !== 'section') continue;
    const rep = u.repealed;
    tocUnits.push({ id: `toc:${u.id}`, cls: `toc${rep ? ' rep' : ''}`, h: TOC.ROW, html: row('sec', u.id, rep ? '[Repealed]' : inline(interpolate(u.node.title, data, p.where)), leafOf.get(u.id), `s${u.id}`) });
  }
}
for (const u of tocUnits) u.sig = hash(`${u.id}|${plain(u.html)}`);
titleUnit.sig = hash(`title|${plain(titleUnit.html)}`);
recordUnit.sig = hash(`record|${recordRows}|${plain(recordUnit.html)}`);
const frontUnits = [titleUnit, recordUnit, ...tocUnits];
const oldFront = freshBook ? null : reg.front?.leaves;
let frontLeaves;
if (oldFront && !repaginate) {
  const r = packStable(frontUnits, oldFront, LEAF.CAP, { sigOf: leafSig, current: -2 });
  frontLeaves = r.leaves; withdrawn.push(...r.withdrawn.map((c) => `0-${c}`));
} else {
  frontLeaves = packGreedy(frontUnits, LEAF.CAP).map((us, i) => {
    const code = String(i + 1); const sig = leafSig(us); const was = oldFront?.find((l) => l.code === code);
    return { code, units: us, sig, since: freshBook ? 0 : was && was.sig === sig ? was.since : -2 };
  });
}
if (checkOnly && frontLeaves.some((l) => l.since === -2)) {
  console.error('docs/book/law.html is stale: its contents have moved since the Law was last built. Run: node tools/build-law.mjs');
  process.exit(1);
}
for (const l of frontLeaves) if (l.since === -2) l.since = current();

/* ------------------------------------------------------------ amendments */

const allLeaves = [
  ...frontLeaves.map((l) => ({ ...l, part: 0, id: `0-${l.code}`, title: 'Preliminary' })),
  ...allParts.flatMap(({ p, leaves }) => leaves.map((l) => ({ ...l, part: p.num, id: `${p.num}-${l.code}`, title: p.title }))),
];
if (CUR != null) {
  let a = amendments.find((x) => x.n === CUR);
  if (!a) { a = { n: CUR, date: TODAY, leaves: [], withdrawn: [], changes: [] }; amendments.push(a); }
  const reissued = allLeaves.filter((l) => l.since === CUR).map((l) => l.id);
  a.leaves = [...new Set([...a.leaves, ...reissued])].filter((id) => allLeaves.some((l) => l.id === id));
  a.withdrawn = [...new Set([...a.withdrawn, ...withdrawn])].filter((id) => !allLeaves.some((l) => l.id === id));
  const byNum = new Map(a.changes.map((c) => [c[0], c]));
  for (const c of changes) {
    const prev = byNum.get(c.num);
    /* a clause inserted and then reworded on the same day is still inserted */
    byNum.set(c.num, [c.num, prev?.[1] === 'inserted' && c.what === 'amended' ? 'inserted' : c.what, c.x]);
  }
  const order = (s) => s.split('.').map((x) => x.padStart(4, '0')).join('.');
  a.changes = [...byNum.values()].sort((x, y) => order(x[0]).localeCompare(order(y[0])));
}

/* ------------------------------------------------------------------ page */

const stamp = (sig) => sig.slice(0, 4).toUpperCase();
function leafHtml(l) {
  const numbered = l.units.filter((u) => u.node);
  const range = l.part === 0 ? (l.units.some((u) => u.id === 'title') ? 'Title' : l.units.some((u) => u.id === 'record') ? 'Record of amendments' : 'Contents')
    : numbered.length ? `§${numbered[0].id}${numbered.length > 1 ? ` – §${numbered.at(-1).id}` : ''}` : `Part ${l.part}`;
  const issue = l.since ? `Amendment ${l.since}, ${fmtDate(dateOf(l.since))}` : `Original issue, ${fmtDate(edition.date)}`;
  const body = l.units.map((u) => unitHtml(u, { bar: !!(u.node && l.since > 0 && u.node.since === l.since) })).join('\n');
  return `<section class="leaf" id="leaf-${l.id}" data-leaf="${l.id}" data-part="${l.part}" data-since="${l.since}">
<header class="lhead"><span class="lt">${TITLE}${l.part ? ` · Part ${l.part}` : ''}</span><span class="lc">${dash(l.id)}</span></header>
<div class="lbody">
${body}
</div>
<footer class="lfoot"><span>Edition ${edition.n} · ${issue}</span><span class="rng">${range}</span><span class="stamp" title="This leaf's fingerprint: if a printed copy shows a different stamp, it is out of date">Stamp ${stamp(l.sig)}</span></footer>
</section>`;
}

const pageData = {
  edition,
  parts: allParts.map(({ p }) => ({ num: p.num, title: p.title })),
  leaves: allLeaves.map((l) => ({ id: l.id, part: l.part, since: l.since, stamp: stamp(l.sig) })),
  amendments: amendments.map((a) => ({ n: a.n, date: a.date, leaves: a.leaves, withdrawn: a.withdrawn, changes: a.changes })),
};

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<style>
${BOOK_FONTS}
${css}
</style>
</head>
<body>
<div class="printbar" id="printbar" hidden><span class="what" id="pb-what"></span><span id="pb-status" role="status" aria-live="polite"></span><button type="button" class="primary" id="pb-print">Print</button><button type="button" class="plain" id="pb-back">Back to the book</button></div>
<div class="bar">
  <strong>${TITLE}</strong>
  <a href="index.html" title="The same rules, set to be read">The Almanac</a>
  <a href="../index.html">Explorer</a>
  <form id="jump" role="search"><input id="jump-to" type="text" placeholder="4.2.3 or 4-3" aria-label="Go to a rule number or a leaf code" title="Type a rule number (4.2.3), a leaf code (4-3) or a Part (4)"><button type="submit" class="plain">Go</button></form>
  <span class="msg" id="jump-msg" role="status"></span>
  <button type="button" class="primary" id="open-print">Print…</button>
</div>
<main class="leaves">
${allLeaves.map(leafHtml).join('\n')}
</main>
<div class="panel-wrap" id="panel" hidden>
  <div class="panel" role="dialog" aria-labelledby="panel-head">
    <h2 id="panel-head">Print</h2>
    <p>Each leaf prints on its own A4 sheet, one side. Print at 100% (not “fit to page”), with no margins added.</p>
    <label><input type="radio" name="what" value="since" checked> <b>What changed since</b> <select id="since"></select></label>
    <label><input type="radio" name="what" value="part"> <b>One Part</b> <select id="part"></select></label>
    <label><input type="radio" name="what" value="leaves"> <b>These leaves</b> <input type="text" id="leaves" placeholder="4-3, 9-2"></label>
    <label><input type="radio" name="what" value="all"> <b>The whole book</b></label>
    <div class="picked" id="picked"></div>
    <div class="actions"><button type="button" class="plain" id="close-print">Close</button><button type="button" class="primary" id="do-print">Print these leaves</button></div>
    <details><summary>What each amendment changed</summary><div id="record"></div></details>
    <details><summary>Every leaf, with its stamp</summary><div id="schedule"></div></details>
  </div>
</div>
<script type="application/json" id="law-data">${JSON.stringify(pageData).replace(/</g, '\\u003c')}</script>
<script>
${readFileSync(join(ROOT, 'tools', 'lib', 'law-page.js'), 'utf8')}
</script>
</body>
</html>
`;

/* --------------------------------------------------------------- register */

const flat = (list) => list.flatMap((n) => {
  const row = { num: n.num, k: n.kind, key: n.status === 'repealed' || n.status === 'stub' ? n.old.key : n.key, sig: n.status === 'repealed' || n.status === 'stub' ? n.old.sig : n.contentSig, since: n.since ?? 0, x: n.status === 'repealed' || n.status === 'stub' ? n.old.x : n.excerpt };
  if (n.rep != null) row.rep = n.rep;
  if (row.since > 0 && n.how) row.h = n.how;
  return [row, ...flat(n.children)];
});
const leafRow = (l) => ({ code: l.code, sig: l.sig, since: l.since, units: l.units.map((u) => u.id) });
const register = {
  about: 'Written by tools/build-law.mjs: what the printed Law of the Land holds - every clause number, every leaf and every amendment. It is the memory that keeps a number and a leaf still between one printing and the next. Never edit it by hand; change docs/rules/ and run the tool.',
  edition,
  amendments,
  front: { leaves: frontLeaves.map(leafRow) },
  parts: Object.fromEntries(allParts.map(({ p, leaves }) => [p.slug, { part: p.num, title: p.title, nodes: flat(p.children), leaves: leaves.map(leafRow) }])),
};
/* one clause and one leaf to a line, so a diff of the register reads as a list
   of what moved */
function regJson(r) {
  const line = (o) => JSON.stringify(o);
  const parts = Object.entries(r.parts).map(([slug, p]) => `    ${line(slug)}: {\n      "part": ${p.part}, "title": ${line(p.title)},\n      "nodes": [\n${p.nodes.map((x) => `        ${line(x)}`).join(',\n')}\n      ],\n      "leaves": [\n${p.leaves.map((x) => `        ${line(x)}`).join(',\n')}\n      ]\n    }`);
  return `{\n  "about": ${line(r.about)},\n  "edition": ${line(r.edition)},\n  "amendments": [${r.amendments.map((a) => `\n    ${line(a)}`).join(',')}${r.amendments.length ? '\n  ' : ''}],\n  "front": {\n    "leaves": [\n${r.front.leaves.map((x) => `      ${line(x)}`).join(',\n')}\n    ]\n  },\n  "parts": {\n${parts.join(',\n')}\n  }\n}\n`;
}
const regOut = regJson(register);

if (checkOnly) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  const curReg = existsSync(REG) ? readFileSync(REG, 'utf8') : '';
  if (cur !== page || curReg !== regOut) {
    console.error(`${cur !== page ? 'docs/book/law.html' : 'docs/book/law-register.json'} is stale. Run: node tools/build-law.mjs`);
    process.exit(1);
  }
  console.log(`docs/book/law.html is up to date (edition ${edition.n}, ${amendments.length ? `amendment ${amendments.at(-1).n}` : 'no amendments'}, ${allLeaves.length} leaves)`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, page, 'utf8');
  writeFileSync(REG, regOut, 'utf8');
  const reissued = CUR != null ? allLeaves.filter((l) => l.since === CUR).map((l) => dash(l.id)) : [];
  const out = withdrawn.length ? `; take out ${withdrawn.map(dash).join(', ')}` : '';
  console.log(`wrote docs/book/law.html (${(page.length / 1024).toFixed(0)} kB) — edition ${edition.n}, ${allLeaves.length} leaves, measured by ${measured}`);
  if (freshBook) console.log(`${consolidate ? 'consolidated: a new edition' : 'first edition'} — print every leaf`);
  else if (CUR != null) console.log(`amendment ${CUR} (${fmtDate(TODAY)}): ${changes.length} change${changes.length === 1 ? '' : 's'}; reprint ${reissued.join(', ') || 'nothing'}${out}`);
  else console.log('no rule has changed: no leaf to reprint');
}
