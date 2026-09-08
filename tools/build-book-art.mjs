#!/usr/bin/env node
/**
 * The book's own copies of the plates: docs/book/art/<plate>.jpg and
 * <plate>-s.jpg, written from docs/art/renders/<plate>.png.
 *
 * A drawn plate is a PNG of three or four megabytes, and the book shows every
 * one of them, some of them several times - a figure on the page that names the
 * thing, a thumbnail at the head of its table row, a piece in a frieze, the
 * window of its inlined card. Opening the book fetched three quarters of a
 * gigabyte, and a browser asked to print a section held every plate on it
 * decoded at once and died. So the book reads a JPEG copy of each plate at its
 * own pixel size (about a fifth of a megabyte) and a small one at
 * components.json book.figureLongSidePx on its long side for the figures,
 * thumbnails and friezes that are printed under fifty millimetres wide.
 *
 * The PNG in docs/art/renders/ is untouched and stays the plate: the cards, the
 * explorer and the framing all read it, and a copy here is a build output like
 * the card fronts, regenerated from it and committed. The encoding is done by a
 * headless Chromium drawing the PNG onto a canvas, because that is the one
 * image codec this repository already leans on (card-proof, the item plates'
 * PNGs), and nothing else is a dependency.
 *
 * docs/book/art/index.json records the digest of the PNG each copy was made
 * from, which is how --check tells a stale copy from a current one on a fresh
 * clone, where every file's mtime is the checkout's.
 *
 * Usage: node tools/build-book-art.mjs           write the copies that are missing or stale
 *        node tools/build-book-art.mjs --force   write every copy again
 *        node tools/build-book-art.mjs --check   fail if any copy is missing or older than its plate
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { findChromium, noBrowser } from './lib/chromium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');
const MAPS = join(ROOT, 'docs', 'map');
const OUT = join(ROOT, 'docs', 'book', 'art');
const components = JSON.parse(readFileSync(join(ROOT, 'data', 'components.json'), 'utf8'));
const { figureLongSidePx: SMALL, plateJpegQuality: QUALITY, figureJpegQuality: SMALL_QUALITY } = components.book;
const INDEX = join(OUT, 'index.json');
/* Which PNG each copy was made from, by digest, so a fresh clone - where every
   file's mtime is the checkout's - can still tell a stale copy from a current one. */
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const settings = `${SMALL}/${QUALITY}/${SMALL_QUALITY}`;
const index = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, 'utf8')) : { settings: '', plates: {} };
const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

/** Every plate the book may show: the drawn renders, and a map's drawn plate. */
const sources = [
  ...readdirSync(RENDERS).filter((f) => f.endsWith('.png')).map((f) => ({ id: f.slice(0, -4), png: join(RENDERS, f) })),
  ...readdirSync(MAPS).filter((f) => f.endsWith('.png')).map((f) => ({ id: `map-${f.slice(0, -4)}`, png: join(MAPS, f) })),
];
const outputs = (s) => [join(OUT, `${s.id}.jpg`), join(OUT, `${s.id}-s.jpg`)];
for (const s of sources) s.sha = sha(s.png);
const stale = (s) => index.settings !== settings || index.plates[s.id] !== s.sha || outputs(s).some((o) => !existsSync(o));

if (check) {
  const bad = sources.filter(stale);
  const orphans = Object.keys(index.plates).filter((id) => !sources.some((s) => s.id === id));
  if (orphans.length) bad.push(...orphans.map((id) => ({ id: `${id} (no plate any more)` })));
  if (bad.length) {
    console.error(`${bad.length} plate(s) have no current copy under docs/book/art/: ${bad.slice(0, 6).map((s) => s.id).join(', ')}${bad.length > 6 ? ', …' : ''}\nRun: node tools/build-book-art.mjs`);
    process.exit(1);
  }
  console.log(`docs/book/art/ holds a current copy of all ${sources.length} plates`);
  process.exit(0);
}

const todo = force ? sources : sources.filter(stale);
if (!todo.length) { console.log(`docs/book/art/ is up to date (${sources.length} plates)`); process.exit(0); }
const chromium = findChromium();
if (!chromium) { console.error(noBrowser('build-book-art', 'The copies are committed; only making new ones needs a browser.')); process.exit(2); }
mkdirSync(OUT, { recursive: true });

/* One page draws every plate on a canvas twice and writes the JPEGs into the
   DOM as data URLs; --dump-dom hands the DOM back once the scripts are done. */
const work = join(tmpdir(), `book-art-${process.pid}`);
mkdirSync(work, { recursive: true });
const page = join(work, 'shrink.html');
writeFileSync(page, `<!doctype html><meta charset="utf-8"><pre id="out"></pre><script>
const plates = ${JSON.stringify(todo.map((s) => ({ id: s.id, src: pathToFileURL(s.png).href })))};
const SMALL = ${SMALL}, Q = ${QUALITY}, QS = ${SMALL_QUALITY};
const out = [];
const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('load ' + src)); i.src = src; });
const jpeg = (img, w, h, q) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h); return c.toDataURL('image/jpeg', q); };
(async () => {
  for (const p of plates) {
    try {
      const img = await load(p.src);
      const W = img.naturalWidth, H = img.naturalHeight;
      const k = Math.min(1, SMALL / Math.max(W, H));
      out.push([p.id, jpeg(img, W, H, Q), jpeg(img, Math.round(W * k), Math.round(H * k), QS)].join('\\t'));
    } catch (e) { out.push(p.id + '\\tERR ' + e.message); }
  }
  document.getElementById('out').textContent = out.join('\\n');
})();
</script>`);
const t = Date.now();
const dom = execFileSync(chromium, [
  '--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files',
  `--virtual-time-budget=${Math.max(60, todo.length) * 1000}`,
  '--dump-dom', pathToFileURL(page).href,
], { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1024 * 1024 * 1024, timeout: 30 * 60 * 1000 }).toString('utf8');
rmSync(work, { recursive: true, force: true });
const body = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
if (!body || !body[1].trim()) { console.error('the browser handed back no images'); process.exit(1); }
let n = 0; let bytes = 0;
const fresh = { settings, plates: {} };
for (const line of body[1].trim().split('\n')) {
  const [id, full, small] = line.split('\t');
  if (!small || full.startsWith('ERR')) { console.error(`${id}: ${full}`); process.exit(1); }
  const a = Buffer.from(full.split(',')[1], 'base64'); const b = Buffer.from(small.split(',')[1], 'base64');
  writeFileSync(join(OUT, `${id}.jpg`), a); writeFileSync(join(OUT, `${id}-s.jpg`), b);
  fresh.plates[id] = sources.find((s) => s.id === id).sha;
  n++; bytes += a.length + b.length;
}
for (const s of sources) if (!fresh.plates[s.id] && index.settings === settings && index.plates[s.id] === s.sha) fresh.plates[s.id] = s.sha;
for (const id of Object.keys(index.plates)) if (!sources.some((s) => s.id === id)) for (const o of [join(OUT, `${id}.jpg`), join(OUT, `${id}-s.jpg`)]) rmSync(o, { force: true });
fresh.plates = Object.fromEntries(Object.entries(fresh.plates).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(INDEX, `${JSON.stringify(fresh, null, 2)}\n`);
console.log(`wrote ${n} plate(s) as JPEG to docs/book/art/ (${(bytes / 1048576).toFixed(1)} MB; the small copy ${SMALL} px on its long side; quality ${QUALITY} and ${SMALL_QUALITY}) in ${((Date.now() - t) / 1000).toFixed(0)}s`);
