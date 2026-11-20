/**
 * The Law of the Land: the rules chapters numbered, and kept in loose leaves.
 *
 * tools/build-law.mjs is the tool; this is what it thinks with. The same
 * docs/rules/*.md that The Almanac sets to be read are set here to be looked up,
 * and three things are worked out here and nowhere else:
 *
 *   treeOf     a chapter as Parts, sections, clauses and sub-clauses. Nothing
 *              in a chapter is numbered by hand: a `##` head is a section, a
 *              `###` head a subsection, every paragraph, table, step and note
 *              under one is a clause, and a list straight after a paragraph is
 *              that paragraph's sub-clauses.
 *
 *   align      the numbers, held still. A number once printed is not given to
 *              anything else until the book is consolidated: a clause written
 *              in between two others takes a letter (4.2.3A), a clause taken out
 *              stays as a stub that says it was repealed, and so nothing after
 *              either one moves. The register (docs/book/law-register.json) is
 *              what was printed last, and this is the diff against it.
 *
 *   pack       the leaves, held still the same way. A leaf keeps the clauses it
 *              had; one too full to take what was added to it gets a companion
 *              leaf (4-3a) filed straight after it, rather than pushing every
 *              later leaf of the Part down a page. That is the whole point of a
 *              loose-leaf book: a change costs the leaves it touches.
 *
 * Pure: no file is read or written here, so the build can run the same logic in
 * --check without a browser and get the same answer.
 */
import { createHash } from 'node:crypto';

export const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/* ---------------------------------------------------------------- blocks */

const FIG_LINE = /^[ \t]*\{\{fig:([^}|]+)(?:\|([^}|]*))?(?:\|([^}]*))?\}\}[ \t]*$/;
const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);

/**
 * A chapter's markdown as blocks, in the dialect tools/lib/docpage.mjs renders
 * - so a block here is exactly a block there - plus the {{fig:...}} line, which
 * tools/lib/book-art.mjs always reads as a block of its own.
 */
export function blocksOf(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fig = line.match(FIG_LINE);
    if (fig) { out.push({ kind: 'fig', refs: fig[1], a: fig[2], b: fig[3], src: line.trim() }); i++; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push({ kind: `h${h[1].length}`, text: h[2].trim(), src: line }); i++; continue; }
    if (line.trimStart().startsWith('<!--')) {
      while (i < lines.length && !lines[i].includes('-->')) i++;
      i++; continue;
    }
    if (/^ {0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { i++; continue; }
    if (line.startsWith('```')) {
      const buf = [line];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      buf.push(lines[i] ?? '```');
      i++;
      out.push({ kind: 'code', src: buf.join('\n') });
      continue;
    }
    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++]);
      const body = buf.map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push({ kind: /^\*\*Open\.?\*\*/.test(body.trim()) ? 'open' : 'quote', src: buf.join('\n') });
      continue;
    }
    if (isTableRow(line) && isTableRow(lines[i + 1] || '') && /^[\s|:-]+$/.test(lines[i + 1])) {
      const buf = [];
      while (i < lines.length && isTableRow(lines[i])) buf.push(lines[i++]);
      out.push({ kind: 'table', src: buf.join('\n') });
      continue;
    }
    const li = line.match(/^(-|\d+\.)\s+/);
    if (li) {
      const ordered = li[1] !== '-';
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(-|\d+\.)\s+(.*)$/);
        if (m && (m[1] !== '-') === ordered) items.push(m[2]);
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) items[items.length - 1] += ` ${lines[i].trim()}`;
        else break;
        i++;
      }
      out.push({ kind: 'list', ordered, items });
      continue;
    }
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !FIG_LINE.test(lines[i])
      && !/^(#{1,4}\s|```|>|-\s|\d+\.\s)/.test(lines[i]) && !isTableRow(lines[i])) buf.push(lines[i++]);
    out.push({ kind: 'para', src: buf.join('\n') });
  }
  return out;
}

/* ------------------------------------------------------------------ tree */

/** The anchor GitHub - and tools/lib/docpage.mjs - gives a heading, so a
    `05-effort-and-jobs.md#the-labour-roll` link can find its section. */
function slugger() {
  const seen = new Map();
  return (text) => {
    const base = text.replace(/`([^`]+)`/g, '$1').replace(/\*\*?([^*]+)\*?\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

const keyOf = (kind, text) => hash(`${kind}:${norm(text)}`);

/**
 * One chapter as the Law reads it: its title, its opening paragraph (the
 * purpose of the Part, printed under its head and not numbered), and its
 * sections. Every clause carries the figures that stood after it.
 *
 * Anything between the title and the first `##` other than that paragraph and
 * pictures is refused, naming the chapter: it would have no section to be
 * numbered in.
 */
export function treeOf(src, where) {
  const slug = slugger();
  const part = { title: '', lede: null, children: [] };
  let section = null; let sub = null; let last = null; let prev = null;
  let pending = [];
  const node = (kind, b, extra = {}) => ({ kind, src: b.src ?? '', figs: [], children: [], ...extra });
  const take = (n) => { n.figs.push(...pending); pending = []; return n; };
  for (const b of blocksOf(src)) {
    if (b.kind === 'fig') {
      if ((b.a ?? '').trim() === 'frieze') continue; /* the screen's decoration; the Law has none */
      if (last) last.figs.push(b); else pending.push(b);
      continue; /* a picture does not part a paragraph from the list it introduces */
    }
    if (b.kind === 'h1') { part.title = b.text; slug(b.text); prev = b; continue; }
    if (!section && b.kind !== 'h2') {
      if (b.kind === 'para' && part.lede == null) { part.lede = b.src; prev = b; continue; }
      throw new Error(`${where}: "${(b.src ?? b.items?.[0] ?? '').slice(0, 50)}..." stands before the chapter's first ## heading, where the Law has no section to number it in`);
    }
    if (b.kind === 'h2') {
      section = node('section', b, { title: b.text, slug: slug(b.text), key: keyOf('section', b.text) });
      part.children.push(section); sub = null; last = null; prev = b;
      continue;
    }
    if (b.kind === 'h3' || b.kind === 'h4') {
      sub = node('subsection', b, { title: b.text, slug: slug(b.text), key: keyOf('subsection', b.text) });
      section.children.push(sub); last = null; prev = b;
      continue;
    }
    const into = sub ?? section;
    if (b.kind === 'list') {
      /* straight after a paragraph, a list is that paragraph's sub-clauses */
      const parent = prev?.kind === 'para' && last && last.block === prev ? last : null;
      for (const item of b.items) {
        const n = take(node('item', { src: item }, { ordered: b.ordered, key: keyOf('item', item) }));
        (parent ? parent.children : into.children).push(n);
        last = n;
      }
      if (parent) last = parent.children[parent.children.length - 1];
      prev = b;
      continue;
    }
    const n = take(node(b.kind, b, { key: keyOf(b.kind, b.src), block: b }));
    into.children.push(n);
    last = n; prev = b;
  }
  if (pending.length && last) last.figs.push(...pending);
  return part;
}

/* --------------------------------------------------------------- numbers */

const parseN = (s) => { const m = String(s).match(/^(\d+)([A-Za-z]*)$/); return m ? [Number(m[1]), m[2]] : [Infinity, String(s)]; };
/** 3 < 3A < 3AA < 3B < 4: the order a clause number and a leaf code sort in. */
export function cmpN(a, b) {
  const [ai, as] = parseN(a); const [bi, bs] = parseN(b);
  return ai - bi || (as < bs ? -1 : as > bs ? 1 : 0);
}

/**
 * A number for something new that stands between p and q, both of which keep
 * theirs. At the end of a list it is simply the next whole number - nothing
 * stands after it to be pushed along. Between two it is a letter: 3A after 3,
 * 3B after 3A, 3AA when the letters between run out. `null` when nothing fits,
 * which is only between a number and its own first letter (3 and 3A).
 */
export function between(p, q, used, upper = true) {
  const L = upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
  const free = (c) => !used.has(c) && (p == null || cmpN(p, c) < 0) && (q == null || cmpN(c, q) < 0);
  if (q == null) {
    let k = p == null ? 1 : parseN(p)[0] + 1;
    while (used.has(String(k))) k++;
    return String(k);
  }
  const base = p ?? '0';
  const [bi, bs] = parseN(base);
  const tries = [];
  if (bs) for (const c of L.slice(L.indexOf(bs.at(-1)) + 1)) tries.push(`${bi}${bs.slice(0, -1)}${c}`);
  for (const c of L) tries.push(`${base}${c}`);
  for (const c of L) for (const d of L) tries.push(`${base}${c}${d}`);
  return tries.find(free) ?? null;
}

/** Longest common subsequence of two key lists, as eq / del / ins steps. */
function diff(a, b) {
  const m = a.length; const n = b.length;
  const t = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const ops = []; let i = 0; let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { ops.push(['eq', i++, j++]); } else if (t[i + 1][j] >= t[i][j + 1]) ops.push(['del', i++]); else ops.push(['ins', j++]);
  }
  while (i < m) ops.push(['del', i++]);
  while (j < n) ops.push(['ins', j++]);
  return ops;
}

const family = (k) => (k === 'section' ? 's' : k === 'subsection' ? 'u' : 'c');

/** A list numbered from 1, all of it new. */
export function fresh(list, status = 'same') {
  return list.map((n, i) => ({ ...n, n: String(i + 1), status, old: null, children: fresh(n.children, status) }));
}

/**
 * A chapter's new list of siblings set against the list that was printed.
 *
 *   same       the text has not moved; it keeps its number
 *   amended    something else stands where it stood - same kind, same place
 *              between two that did not move - and it keeps the number too
 *   inserted   new, given a number between its neighbours' (see `between`)
 *   repealed   gone this time: it stays as a stub so nothing after it moves
 *   stub       gone at an earlier amendment, and still a stub
 *
 * Whether a `same` clause still prints the same is the build's question, not
 * this one's: its text may hold a {{token}} whose number the data has moved.
 */
export function align(oldList = [], newList = [], where = '') {
  const ok = oldList.map((o) => (o.rep != null ? `rep:${o.n}` : o.key));
  const ops = diff(ok, newList.map((n) => n.key));
  const out = [];
  let gapO = []; let gapN = [];
  const same = (o, n, status) => ({ ...n, n: o.n, status, old: o, children: align(o.c ?? [], n.children, where) });
  const flush = () => {
    const pairs = []; const usedN = new Set(); let j = 0;
    for (const oi of gapO) {
      const o = oldList[oi];
      if (o.rep != null) continue;
      for (let t = j; t < gapN.length; t++) {
        if (family(newList[gapN[t]].kind) === family(o.kind)) { pairs.push([oi, gapN[t]]); usedN.add(gapN[t]); j = t + 1; break; }
      }
    }
    const pairedO = new Set(pairs.map((p) => p[0]));
    let po = 0; let pn = 0;
    const olds = (stop) => {
      while (po < gapO.length && gapO[po] !== stop) {
        const oi = gapO[po++];
        if (pairedO.has(oi)) continue;
        const o = oldList[oi];
        out.push({ kind: o.kind, n: o.n, status: o.rep != null ? 'stub' : 'repealed', old: o, figs: [], children: [] });
      }
    };
    const news = (stop) => { while (pn < gapN.length && gapN[pn] !== stop) { const ni = gapN[pn++]; if (!usedN.has(ni)) out.push({ ...newList[ni], n: null, status: 'inserted', old: null, children: fresh(newList[ni].children, 'inserted') }); } };
    for (const [oi, ni] of pairs) { olds(oi); po++; news(ni); pn++; out.push(same(oldList[oi], newList[ni], 'amended')); }
    olds(undefined); news(undefined);
    gapO = []; gapN = [];
  };
  for (const op of ops) {
    if (op[0] === 'eq') { flush(); out.push(same(oldList[op[1]], newList[op[2]], 'same')); } else if (op[0] === 'del') gapO.push(op[1]); else gapN.push(op[1]);
  }
  flush();
  const used = new Set(out.filter((x) => x.n != null).map((x) => x.n));
  for (let i = 0; i < out.length; i++) {
    if (out[i].n != null) continue;
    let p = null; for (let k = i - 1; k >= 0; k--) if (out[k].n != null) { p = out[k].n; break; }
    let q = null; for (let k = i + 1; k < out.length; k++) if (out[k].n != null && out[k].status !== 'inserted') { q = out[k].n; break; }
    const n = between(p, q, used);
    if (!n) throw new Error(`${where}: no number is free between ${p} and ${q} for a new clause - write it after ${q}, or consolidate the Law (node tools/build-law.mjs --consolidate)`);
    out[i].n = n; used.add(n);
  }
  return out;
}

/* ---------------------------------------------------------------- leaves */

/**
 * Units onto leaves from the top, as many as fit. A unit marked `keep` goes
 * with the one after it (a head is never the last thing on a leaf), and one
 * marked `alone` has a leaf to itself. Returns arrays of units.
 */
export function packGreedy(units, cap) {
  const leaves = []; let cur = []; let h = 0;
  const close = () => { if (cur.length) leaves.push(cur); cur = []; h = 0; };
  let i = 0;
  while (i < units.length) {
    let j = i; let gh = units[i].h;
    while (units[j].keep && j + 1 < units.length) { j++; gh += units[j].h; }
    const group = units.slice(i, j + 1);
    if (units[i].alone) { close(); leaves.push(group); i = j + 1; continue; }
    if (cur.length && h + gh > cap) close();
    cur.push(...group); h += gh; i = j + 1;
  }
  close();
  return leaves;
}

/**
 * Units onto the leaves they were printed on.
 *
 * Every unit goes back to its old leaf, and a new one to the leaf of whatever
 * stands before it. A leaf whose units print exactly as they did keeps its
 * code and its date and is not measured: a leaf nobody touched is never
 * reissued. One that changed and still fits is reissued under the same code;
 * one that no longer fits keeps what it can and hands the rest to companion
 * leaves coded after it (4-3a, 4-3b), so the leaves after it do not move.
 *
 * `sigOf(units)` is the leaf's fingerprint; `CURRENT` is what `since` is set
 * to on a leaf that is reissued. Returns the leaves and the old codes that no
 * longer have anything on them - leaves to take out of the binder.
 */
export function packStable(units, oldLeaves, cap, { sigOf, current }) {
  const where = new Map();
  oldLeaves.forEach((l, i) => l.units.forEach((u) => where.set(u, i)));
  const buckets = oldLeaves.map(() => []);
  let at = 0;
  for (const u of units) {
    const w = where.get(u.id);
    if (w != null && w > at) at = w;
    buckets[at].push(u);
  }
  const usedCodes = new Set(oldLeaves.map((l) => l.code));
  const out = []; const withdrawn = [];
  buckets.forEach((b, i) => {
    const old = oldLeaves[i];
    if (!b.length) { withdrawn.push(old.code); return; }
    const sig = sigOf(b);
    if (sig === old.sig) { out.push({ code: old.code, units: b, sig, since: old.since }); return; }
    const total = b.reduce((s, u) => s + u.h, 0);
    if (total <= cap) { out.push({ code: old.code, units: b, sig, since: current }); return; }
    const next = oldLeaves[i + 1]?.code ?? null;
    let prev = old.code;
    packGreedy(b, cap).forEach((chunk, k) => {
      let code = old.code;
      if (k) {
        code = between(prev, next, usedCodes, false);
        if (!code) throw new Error(`no leaf code is free between ${prev} and ${next}; consolidate the Law`);
        usedCodes.add(code);
      }
      out.push({ code, units: chunk, sig: sigOf(chunk), since: current });
      prev = code;
    });
  });
  return { leaves: out, withdrawn };
}
