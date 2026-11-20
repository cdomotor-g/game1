#!/usr/bin/env node
/**
 * Prints The Law of the Land - docs/book/law.html - to a PDF the way a reader's
 * browser will, and checks the one promise the book makes about paper: ONE LEAF
 * IS ONE SHEET. A leaf whose clauses ran past the foot of its page would print
 * as two sheets, and every leaf after it in the binder would then be filed
 * against the wrong code.
 *
 * tools/build-law.mjs measures every clause before it packs a leaf, so this
 * should never fail on the machine that built it. It is for the cases that
 * measuring cannot see: a build made without a browser (packed from an
 * estimate), a change to tools/lib/law.css that left old leaves fuller than
 * their new pages, or a different browser's line breaks.
 *
 *   node tools/law-proof.mjs              the whole book -> docs/book/proofs/law.pdf
 *   node tools/law-proof.mjs 4-2 4-2a     just those leaves -> docs/book/proofs/law-4-2+4-2a.pdf
 *
 * The PDF is git-ignored: a proof is a photograph of the artefact, not the
 * artefact. Exits 1 when the sheet count is not the leaf count.
 */
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findChromium, noBrowser } from './lib/chromium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LAW = join(ROOT, 'docs', 'book', 'law.html');
const OUT_DIR = join(ROOT, 'docs', 'book', 'proofs');

if (!existsSync(LAW)) { console.error('docs/book/law.html is not built. Run: node tools/build-law.mjs'); process.exit(1); }
const chromium = findChromium();
if (!chromium) { console.error(noBrowser('law-proof', 'The book itself is fine; only this proof needs one.')); process.exit(2); }

const all = [...readFileSync(LAW, 'utf8').matchAll(/<section class="leaf" id="leaf-([^"]+)"/g)].map((m) => m[1]);
const asked = process.argv.slice(2).filter((a) => !a.startsWith('--')).map((a) => a.replace(/[–—]/g, '-').toLowerCase());
const unknown = asked.filter((a) => !all.includes(a));
if (unknown.length) { console.error(`no leaf ${unknown.join(', ')} in this edition`); process.exit(1); }
const picks = asked.length ? asked : all;

mkdirSync(OUT_DIR, { recursive: true });
const out = join(OUT_DIR, `law${asked.length ? `-${asked.join('+')}` : ''}.pdf`);
const t = Date.now();
execFileSync(chromium, [
  '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--no-pdf-header-footer',
  '--virtual-time-budget=60000', `--print-to-pdf=${out}`,
  `${pathToFileURL(LAW).href}?print=${asked.length ? picks.join(',') : 'all'}&now`,
], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 10 * 60 * 1000 });

/* A PDF's page tree says how many pages it has in its root /Count. */
const pdf = readFileSync(out, 'latin1');
const counts = [...pdf.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)|\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/g)].map((m) => Number(m[1] ?? m[2]));
const sheets = counts.length ? Math.max(...counts) : (pdf.match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;
const rel = out.slice(ROOT.length + 1);
console.log(`printed ${picks.length} lea${picks.length === 1 ? 'f' : 'ves'} -> ${rel} in ${((Date.now() - t) / 1000).toFixed(0)}s (git-ignored; regenerate whenever)`);
if (sheets !== picks.length) {
  console.error(`${sheets} sheets for ${picks.length} leaves: a leaf has run past the foot of its page. Rebuild with node tools/build-law.mjs --repaginate on a machine with a browser, then proof again.`);
  process.exit(1);
}
/* A leaf is a box exactly one sheet tall, so one that is too full can still
   print as one sheet, with its last lines run off the foot or under the next
   leaf. So the count is not enough: the page's own check is asked as well -
   the one that marks a leaf `over` on screen - at a desk's width, where the
   screen sets a leaf as print does. */
const dom = execFileSync(chromium, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=1400,2000',
  '--virtual-time-budget=30000', '--dump-dom', pathToFileURL(LAW).href], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
const over = [...dom.matchAll(/<section class="leaf over" id="leaf-([^"]+)"/g)].map((m) => m[1]).filter((id) => picks.includes(id));
if (over.length) {
  console.error(`fuller than their sheet: ${over.map((id) => id.replace('-', '–')).join(', ')}. Rebuild with node tools/build-law.mjs --repaginate on a machine with a browser, then proof again.`);
  process.exit(1);
}
console.log(`${sheets} sheets for ${picks.length} leaves, and none fuller than its sheet`);
