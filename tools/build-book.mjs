#!/usr/bin/env node
/**
 * Renders the design book — docs/design/*.md, in filename order — into one
 * printable HTML page at docs/book/index.html.
 *
 * Why: GitHub Pages serves markdown as plain text, so on the published site
 * the book was unreadable and unprintable. This page is the same chapters,
 * committed like docs/data/bundle.js and docs/design/14-annex.md: edit the
 * markdown, run the tool, commit both. It renders no new prose of its own.
 *
 * The markdown dialect and the page shell live in tools/lib/docpage.mjs, which
 * tools/build-mint.mjs also uses — two pages of documents that looked slightly
 * different from each other would be a bug nobody would ever file.
 *
 * Usage: node tools/build-book.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFile, docPage } from './lib/docpage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESIGN = join(ROOT, 'docs', 'design');
const OUT_DIR = join(ROOT, 'docs', 'book');
const OUT = join(OUT_DIR, 'index.html');
const checkOnly = process.argv.includes('--check');

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));

const chapters = readdirSync(DESIGN).filter((f) => f.endsWith('.md')).sort();
const chapterId = (file) => 'c-' + file.replace(/\.md$/, '');

/** Chapter-to-chapter links become anchors; everything else stays relative,
    which resolves correctly because book/ sits at the same depth as design/. */
function rewriteHref(href) {
  const m = href.match(/^(\d{2}-[a-z0-9-]+\.md)(#.*)?$/);
  return m ? '#' + chapterId(m[1]) : href;
}

const sections = chapters.map((file) => ({
  id: chapterId(file),
  ...renderFile(DESIGN, file, { rewriteHref, fallbackTitle: file }),
}));

const page = docPage({
  palette,
  pageTitle: 'game1 — the design book',
  barTitle: 'game1 — the design book',
  barLinks: [
    { href: '../index.html', label: 'Explorer' },
    { href: '../cards/index.html', label: 'Card fronts' },
    { href: '../boards/index.html', label: 'Player boards' },
    { href: '../map/index.html', label: 'Map' },
    { href: '../mint/index.html', label: 'The mint' },
  ],
  printLabel: 'Print the book',
  sections,
});

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
  console.log(`wrote docs/book/index.html (${(page.length / 1024).toFixed(1)} kB) from ${chapters.length} chapters`);
}
