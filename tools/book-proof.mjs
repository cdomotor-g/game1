#!/usr/bin/env node
/**
 * Prints the book - or any of its sections and chapters - to a PDF, the way a
 * reader's browser would, so the page can be LOOKED AT before it is shipped.
 *
 * The book is built and validated without a browser and never seen: a title page
 * whose plate had slipped onto the following page passed every check this
 * repository runs. This is the card-proof of the book. It opens
 * docs/book/index.html in a headless Chromium with the print picker's own
 * ?print=...&now selection, so what it prints is exactly what a reader who
 * ticked those boxes would get, running heads and page numbers included.
 *
 * Output is docs/book/proofs/<name>.pdf, git-ignored: a proof is a photograph of
 * the artefact, never the artefact.
 *
 * Usage: node tools/book-proof.mjs                    the whole book
 *        node tools/book-proof.mjs rules annex-3      sections, by id
 *        node tools/book-proof.mjs cat-characters     a chapter, by id
 *        node tools/book-proof.mjs rules --split      a section one chapter at a time
 *
 * --split prints each chapter of the named sections to its own PDF under
 * docs/book/proofs/<section>/. A headless Chromium given a whole section holds
 * every plate on it decoded at once, and Book I with a picture on every page is
 * more than its renderer will hold: it died with a SIGTRAP at sixty pages. A
 * reader's browser prints a chapter at a time from the picker the same way.
 * Section ids are the `id` of each <section class="part"> in the page: cover,
 * contents, rules, annex-1, annex-2, annex-3 ..., design. Chapter ids are the
 * `id` of each <article class="chapter">.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findChromium, noBrowser } from './lib/chromium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = join(ROOT, 'docs', 'book', 'index.html');
const OUT_DIR = join(ROOT, 'docs', 'book', 'proofs');
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));

if (!existsSync(BOOK)) {
  console.error('docs/book/index.html is not built. Run: node tools/build-book.mjs');
  process.exit(1);
}
const chromium = findChromium();
if (!chromium) {
  console.error(noBrowser('book-proof', 'The book itself is fine; only this proof needs one.'));
  process.exit(2);
}

mkdirSync(OUT_DIR, { recursive: true });

function print(out, picks) {
  const url = pathToFileURL(BOOK).href + (picks.length ? `?print=${picks.join(',')}&now` : '');
  const t = Date.now();
  execFileSync(chromium, [
    '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--no-pdf-header-footer',
    /* the plates are a few megabytes each and the book shows every one of them;
       give the page time to fetch them before the print is taken */
    '--virtual-time-budget=60000',
    `--print-to-pdf=${out}`,
    url,
  ], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 15 * 60 * 1000 });
  return ((Date.now() - t) / 1000).toFixed(0);
}

if (process.argv.includes('--split')) {
  const html = readFileSync(BOOK, 'utf8');
  for (const section of ids) {
    const m = html.match(new RegExp(`<section class="part" id="${section}"[\\s\\S]*?</section>`));
    if (!m) { console.error(`no section ${section}`); process.exit(1); }
    const chapters = [...m[0].matchAll(/<article class="chapter[^"]*" id="([^"]+)"/g)].map((x) => x[1]);
    const dir = join(OUT_DIR, section);
    mkdirSync(dir, { recursive: true });
    /* a chapter picked alone prints with its section's title page in front of it */
    chapters.forEach((c, i) => {
      const s = print(join(dir, `${String(i + 1).padStart(2, '0')}-${c}.pdf`), [c]);
      console.log(`printed ${c} -> docs/book/proofs/${section}/${String(i + 1).padStart(2, '0')}-${c}.pdf in ${s}s`);
    });
  }
} else {
  const name = ids.length ? ids.join('+') : 'the-almanac';
  const s = print(join(OUT_DIR, `${name}.pdf`), ids);
  console.log(`printed ${ids.length ? ids.join(', ') : 'the whole book'} -> docs/book/proofs/${name}.pdf in ${s}s (git-ignored; regenerate whenever)`);
}
