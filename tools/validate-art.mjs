#!/usr/bin/env node
/**
 * Checks generated and hand-built art against docs/art/palette.json.
 *
 * The style guide makes three claims that are cheap to verify mechanically and
 * expensive to notice by eye, so they are checked here rather than at review:
 *
 *   1. Every colour used is one the palette declares.
 *   2. The ink plate is a single colour plus soot tints, so the black-and-white
 *      edition is a real separation rather than a desaturation.
 *   3. The layer contract holds: #wash, #ink and #grime exist and are named
 *      exactly, so `remove(#wash, #slip)` produces the mono edition.
 *
 * Only attribute values are inspected. A hex code printed as a label is content,
 * not colour, and the palette reference sheet is full of them.
 *
 * Usage: node tools/validate-art.mjs [file.svg ...]     (default: docs/art/examples)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLES = join(ROOT, 'docs', 'art', 'examples');
const CARDS = join(ROOT, 'docs', 'cards');

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));

/** every hex the palette declares, at any depth */
const declared = new Set();
(function walk(node) {
  for (const value of Object.values(node)) {
    if (typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)) declared.add(value.toUpperCase());
    else if (value && typeof value === 'object') walk(value);
  }
})(palette);

/** the ink plate may use soot and its tints, and paper for knock-outs */
const INK_PLATE = new Set([
  palette.ink.soot.hex.toUpperCase(),
  ...Object.values(palette.ink.tints).filter(t => t.hex).map(t => t.hex.toUpperCase()),
  palette.paper.tallow.hex.toUpperCase(),
  palette.paper.white.hex.toUpperCase(),
]);

/* Hand-built examples and the generated card fronts are held to the same contract. */
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [EXAMPLES, CARDS].filter(existsSync).flatMap(dir =>
      readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => join(dir, f)));

/** hex codes appearing as paint attribute values, not as text content */
const paints = (svg) =>
  [...svg.matchAll(/(?:fill|stroke|stop-color|flood-color|color)\s*=\s*"(#[0-9A-Fa-f]{6})"/g)]
    .map(m => m[1].toUpperCase());

const errors = [];
const warnings = [];

for (const file of files) {
  const name = relative(ROOT, file);
  const svg = readFileSync(file, 'utf8');

  const used = new Set(paints(svg));
  const offPalette = [...used].filter(hex => !declared.has(hex));
  if (offPalette.length) errors.push(`${name}: not in palette.json - ${offPalette.join(' ')}`);

  for (const layer of ['wash', 'ink', 'grime']) {
    if (!new RegExp(`id="${layer}"`).test(svg)) errors.push(`${name}: missing <g id="${layer}">`);
  }
  if (/id="slip"/.test(svg) && !/arcane/i.test(svg)) {
    warnings.push(`${name}: has a slip layer but mentions nothing arcane - the slip is arcane-only`);
  }

  // The ink plate is everything from <g id="ink"> to the grime layer or the end.
  const start = svg.indexOf('<g id="ink"');
  if (start !== -1) {
    const end = svg.indexOf('<g id="grime"', start);
    const inkPlate = svg.slice(start, end === -1 ? undefined : end);
    const stray = [...new Set(paints(inkPlate))].filter(hex => !INK_PLATE.has(hex));
    if (stray.length) errors.push(`${name}: ink plate is not monochrome - ${stray.join(' ')}`);
  }

  const wash = svg.slice(svg.indexOf('<g id="wash"'), svg.indexOf('<g id="ink"'));
  if (/stroke-width/.test(wash)) {
    warnings.push(`${name}: the wash plate has strokes - flat shapes only, line belongs to the ink plate`);
  }

  console.log(`${name}: ${used.size} colours, all declared${offPalette.length ? ' (SEE ERRORS)' : ''}`);
}

for (const w of warnings) console.warn(`warning  ${w}`);
for (const e of errors) console.error(`error    ${e}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
