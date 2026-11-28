#!/usr/bin/env node
/**
 * The CHARACTER RECORD SHEET: the paper a hero is carried on from one game to
 * the next (rules.json career). Content is data/recordsheet.json, shapes are
 * components.json recordSheet, and the rules it records are rules.json level - this file holds no coordinate and no rule.
 *
 * The page is a stack: title, the three fields, the lasting boxes, the rises,
 * the deeds ladder, what each level costs, and the log of games. Every section
 * takes the height components.json gives it and the log takes the rest, cut
 * into rows no shorter than log.minRowMm. A ladder that grows (a higher
 * level.to) shortens the log rather than running off the page; a log shorter
 * than log.minRows fails the build.
 *
 *   node tools/build-record.mjs          write docs/records/
 *   node tools/build-record.mjs --check  fail if the committed copy is stale
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(ROOT, 'data', f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('recordsheet.json');
const rules = read('rules.json');
const board = read('playerboard.json');
const OUT = join(ROOT, 'docs', 'records');
const checkOnly = process.argv.includes('--check');

const RS = components.recordSheet;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;
const num = (n) => Number(n.toFixed(2));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const T70 = palette.ink.tints['70'].hex;
const T40 = palette.ink.tints['40'].hex;
const T12 = palette.ink.tints['12'].hex;
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

const W = mm(RS.sheet.widthMm);
const H = mm(RS.sheet.heightMm);
const M = mm(RS.marginMm);
const G = mm(RS.gutterMm);
const CW = W - 2 * M;

const LV = rules.level;
const letterOf = new Map(board.tracks.map((t) => [t.id, t.letter]));
const labelOf = new Map(board.tracks.map((t) => [t.id, t.label]));
const steps = [];
for (let n = LV.from + 1; n <= LV.to; n++) steps.push({ level: n, cost: n * LV.perLevel });
let running = 0;
for (const s of steps) { running += s.cost; s.total = running; }
const milestones = steps.filter((s) => s.level % LV.milestones.every === 0).map((s) => s.level);
const ladderLen = Math.max(...steps.map((s) => s.cost));

const out = [];
const text = (x, y, size, body, extra = '') => out.push(`<text x="${num(x)}" y="${num(y)}" font-size="${num(mm(size))}" ${extra}>${esc(body)}</text>`);
const box = (x, y, w, h, r = mm(1)) => out.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${num(r)}" fill="none" stroke="${SOOT}" stroke-width="${RS.strokeWidth}"/>`);
const label = (x, y, body) => text(x, y, 2.3, body, `font-family="${SANS}" letter-spacing="${num(mm(0.4))}" fill="${T70}"`);
const head = (y, title, note) => {
  text(M, y + mm(4), 3, title, `font-family="${SANS}" letter-spacing="${num(mm(0.8))}" fill="${T70}"`);
  if (note) text(M + CW, y + mm(4), 2.4, note, 'text-anchor="end" font-style="italic"');
  return y + mm(RS.sectionHeadMm);
};

let y = M;

/* title */
text(M, y + mm(7), 7, spec.sheet.name.toUpperCase(), `font-weight="bold" letter-spacing="${num(mm(1.2))}"`);
text(M + CW, y + mm(7), 2.6, spec.sheet.summary.split('. ')[0] + '.', 'text-anchor="end" font-style="italic"');
y += mm(RS.titleMm) + G / 2;

/* the three fields: a label over a ruled line */
{
  const total = spec.header.reduce((a, f) => a + f.share, 0);
  let x = M;
  for (const f of spec.header) {
    const w = (CW - G * (spec.header.length - 1)) * f.share / total;
    label(x, y + mm(3), f.label);
    out.push(`<path d="M ${num(x)},${num(y + mm(RS.fieldMm) - mm(1))} H ${num(x + w)}" stroke="${SOOT}" stroke-width="${RS.strokeWidth}"/>`);
    x += w + G;
  }
  y += mm(RS.fieldMm) + G;
}

/* the lasting boxes, and beside them one box per stat a milestone can raise */
{
  const lasting = spec.boxes;
  const rises = LV.milestones.choose;
  const bw = (CW - G * (lasting.length - 1)) / lasting.length;
  y = head(y, 'WHAT LASTS', 'Rewrite these at the end of every game.');
  lasting.forEach((b, i) => {
    const x = M + i * (bw + G);
    box(x, y, bw, mm(RS.boxMm));
    label(x + mm(1.5), y + mm(3.4), b.label);
    if (b.track) text(x + bw - mm(1.5), y + mm(RS.boxMm) - mm(2), 5, letterOf.get(b.track), `text-anchor="end" font-weight="bold" fill="${T40}"`);
  });
  y += mm(RS.boxMm) + G;

  y = head(y, spec.rises.title, spec.rises.note);
  /* the milestone cells: the level, and room for the letter chosen there */
  const mw = (CW - G * (milestones.length - 1)) / milestones.length;
  milestones.forEach((lvl, i) => {
    const x = M + i * (mw + G);
    box(x, y, mw, mm(RS.riseBoxMm));
    label(x + mm(1.5), y + mm(3.4), `AT LEVEL ${lvl}`);
  });
  y += mm(RS.riseBoxMm) + G / 2;
  /* the running totals, one per stat, so setup is one addition per box */
  const rw = (CW - G * (rises.length - 1)) / rises.length;
  rises.forEach((r, i) => {
    const x = M + i * (rw + G);
    box(x, y, rw, mm(RS.riseBoxMm));
    label(x + mm(1.5), y + mm(3.4), `${labelOf.get(r.stat)} +${r.by} EACH`);
    text(x + rw - mm(1.5), y + mm(RS.riseBoxMm) - mm(2), 5, `${letterOf.get(r.stat)}+`, `text-anchor="end" font-weight="bold" fill="${T40}"`);
  });
  y += mm(RS.riseBoxMm) + G;
}

/* the deeds ladder: as many cells as the dearest level costs */
{
  y = head(y, spec.ladder.title, spec.ladder.note);
  const cw = CW / ladderLen;
  if (cw < mm(RS.ladderCellMm)) throw new Error(`a ${ladderLen}-deed ladder leaves ${num(cw / U)}mm a cell and a tick wants ${RS.ladderCellMm}mm`);
  for (let i = 0; i < ladderLen; i++) {
    const x = M + i * cw;
    out.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(cw)}" height="${num(cw)}" fill="${(i + 1) % 5 === 0 ? T12 : 'none'}" stroke="${SOOT}" stroke-width="${RS.hairline}"/>`);
    text(x + cw / 2, y + cw - mm(1.2), 2.1, i + 1, `text-anchor="middle" font-family="${SANS}" fill="${T40}"`);
  }
  y += cw + G;
}

/* what each level costs, read straight off rules.json level */
{
  y = head(y, spec.costs.title, spec.costs.note);
  const rowH = mm(RS.costsRowMm);
  const lw = mm(16);
  const cw = (CW - lw) / steps.length;
  const rows = [['LEVEL', (s) => s.level], ['DEEDS', (s) => s.cost], ['IN ALL', (s) => s.total]];
  rows.forEach(([name, val], r) => {
    const ry = y + r * rowH;
    if (r === 0) out.push(`<rect x="${num(M)}" y="${num(ry)}" width="${num(CW)}" height="${num(rowH)}" fill="${T12}"/>`);
    label(M + mm(1), ry + rowH - mm(1.8), name);
    steps.forEach((s, i) => {
      const x = M + lw + i * cw;
      const bold = milestones.includes(s.level) ? ' font-weight="bold"' : '';
      text(x + cw / 2, ry + rowH - mm(1.7), 2.6, val(s), `text-anchor="middle" font-family="${SANS}"${bold}`);
    });
    out.push(`<path d="M ${num(M)},${num(ry + rowH)} H ${num(M + CW)}" stroke="${SOOT}" stroke-width="${RS.hairline}"/>`);
  });
  y += rows.length * rowH + G;
}

/* the log takes the rest */
{
  y = head(y, spec.log.title);
  const foot = mm(6);
  const avail = H - M - foot - y - mm(RS.log.headMm);
  const rows = Math.floor(avail / mm(RS.log.minRowMm));
  if (rows < RS.log.minRows) {
    throw new Error(`the log has room for ${rows} games and components.json recordSheet.log.minRows wants ${RS.log.minRows} - something above it has grown (a longer deeds ladder is rules.json level.to)`);
  }
  const rowH = avail / rows;
  const total = spec.log.columns.reduce((a, c) => a + c.share, 0);
  const hh = mm(RS.log.headMm);
  out.push(`<rect x="${num(M)}" y="${num(y)}" width="${num(CW)}" height="${num(hh)}" fill="${T12}"/>`);
  let x = M;
  const xs = [];
  for (const c of spec.log.columns) {
    const w = CW * c.share / total;
    label(x + mm(1.2), y + hh - mm(2.2), c.label);
    xs.push(x);
    x += w;
  }
  box(M, y, CW, hh + rows * rowH, 0);
  for (let r = 0; r <= rows; r++) out.push(`<path d="M ${num(M)},${num(y + hh + r * rowH)} H ${num(M + CW)}" stroke="${SOOT}" stroke-width="${r ? RS.hairline : RS.strokeWidth}"/>`);
  for (const cx of xs.slice(1)) out.push(`<path d="M ${num(cx)},${num(y)} V ${num(y + hh + rows * rowH)}" stroke="${SOOT}" stroke-width="${RS.hairline}"/>`);
  y += hh + rows * rowH;
  text(W / 2, H - M + mm(2), 2.3, `game1 · ${spec.sheet.name.toUpperCase()}`, `text-anchor="middle" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T40}"`);
  var LOG_ROWS = rows;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.sheet.name)}</title>
<desc>${esc(spec.sheet.summary)} Generated by tools/build-record.mjs from data/recordsheet.json, data/components.json recordSheet and data/rules.json level - do not edit. ${RS.sheet.widthMm} x ${RS.sheet.heightMm} mm at ${U} units/mm.</desc>
<rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
<g fill="${SOOT}">
  ${out.join('\n  ')}
</g>
</svg>
`;

const index = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(spec.sheet.name)}</title>
<style>body{margin:0;padding:16px;background:${TALLOW};color:${SOOT};font-family:${SERIF}}img{max-width:100%;height:auto;border:1px solid ${T40}}main{max-width:820px;margin:auto}</style>
</head><body><main>
<h1>${esc(spec.sheet.name)}</h1>
<p>${esc(spec.sheet.summary)} Print it A4 portrait at 100%, one per hero, and fill it in pencil.</p>
<p><a href="${spec.sheet.id}.svg">Open the sheet</a> to print it.</p>
<img src="${spec.sheet.id}.svg" alt="${esc(spec.sheet.name)}: the lasting boxes, the rises, the deeds ladder, what each level costs, and a log of ${LOG_ROWS} games.">
</main></body></html>
`;

const files = [[`${spec.sheet.id}.svg`, svg], ['index.html', index]];
if (checkOnly) {
  const stale = files.filter(([f, body]) => !existsSync(join(OUT, f)) || readFileSync(join(OUT, f), 'utf8') !== body).map(([f]) => f);
  if (stale.length) { console.error(`build-record: stale - ${stale.join(', ')}; run node tools/build-record.mjs`); process.exit(1); }
  console.log('build-record: docs/records/ is current');
} else {
  mkdirSync(OUT, { recursive: true });
  for (const [f, body] of files) writeFileSync(join(OUT, f), body);
  console.log(`wrote docs/records/${spec.sheet.id}.svg — ${RS.sheet.widthMm}x${RS.sheet.heightMm}mm, a ${ladderLen}-deed ladder, ${milestones.length} milestones, a log of ${LOG_ROWS} games`);
}
