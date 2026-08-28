#!/usr/bin/env node
/**
 * Draws the flows of work — one small diagram per place of work, inputs on
 * the left, the process in the middle, yields on the right — into
 * docs/art/flows/<id>.svg, for the annex to print.
 *
 * Everything is computed from the data: a building's diagram is its own jobs
 * and crafts read off recipes.json, tools.json, items.json, transport.json
 * and modifications.json, and the source note under every input comes from
 * whichever recipe or deposit yields that commodity. The model and renderer
 * live in docs/js/flows.js (loaded through tools/lib/flows.mjs), because the
 * explorer's Flows tab is the same drawing live.
 *
 * Committed like the graph, for the same reason: the annex prints these files
 * by path and Pages serves the branch. --check regenerates and fails on any
 * drift, and the tool fails outright if a recipe lands in no diagram — a job
 * the book silently does not show is exactly the bug this line exists to stop.
 *
 * Usage: node tools/build-flows.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, toSVG, readGameData } from './lib/flows.mjs';
import { washStep } from './lib/graph.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs', 'art', 'flows');
const checkOnly = process.argv.includes('--check');

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const DATA = readGameData(ROOT);

const { diagrams, uncovered } = build(DATA);
if (uncovered.length) {
  console.error(`these recipes land in no diagram, so the book would not show them: ${uncovered.join(', ')}`);
  process.exit(1);
}

/* The same wash a thing's dot wears in the web of things, from the same
   declarations: data/graph.json for the ink, washStep for the family ramp.
   Token fills are the wash sunk almost to the paper, so the ink stays type. */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, frac) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * frac).toString(16).padStart(2, '0')).join('');
const soot = palette.ink.soot.hex;
const tallow = palette.paper.tallow.hex;

const wash = {};
const fill = {};
const familySeen = {};
for (const node of DATA.graph.nodes) {
  familySeen[node.wash] = (familySeen[node.wash] || 0) + 1;
  const step = washStep(familySeen[node.wash] - 1);
  const ink = palette.inks[node.wash].hex;
  wash[node.id] = step.toward ? mix(ink, step.toward === 'soot' ? soot : tallow, step.frac) : ink;
  fill[node.id] = mix(wash[node.id], tallow, 0.85);
}

const colors = {
  wash, fill,
  text: soot,
  soft: palette.ink.tints['85'].hex,
  faint: palette.ink.tints['70'].hex,
  rule: palette.ink.tints['25'].hex,
  arrow: palette.ink.tints['70'].hex,
};

const wanted = new Map();
for (const d of diagrams) {
  wanted.set(`${d.id}.svg`, toSVG(d, { colors, background: tallow }));
}

if (checkOnly) {
  let stale = [];
  for (const [file, svg] of wanted) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    if (current !== svg) stale.push(file);
  }
  const strays = existsSync(OUT_DIR)
    ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !wanted.has(f))
    : [];
  if (stale.length || strays.length) {
    if (stale.length) console.error(`docs/art/flows/ is stale (${stale.join(', ')}). Run: node tools/build-flows.mjs`);
    if (strays.length) console.error(`docs/art/flows/ holds diagrams nothing generates any more (${strays.join(', ')}). Run: node tools/build-flows.mjs`);
    process.exit(1);
  }
  console.log(`docs/art/flows/ is up to date (${wanted.size} diagrams)`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  let bytes = 0;
  for (const [file, svg] of wanted) { writeFileSync(join(OUT_DIR, file), svg, 'utf8'); bytes += svg.length; }
  const strays = readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !wanted.has(f));
  for (const f of strays) { unlinkSync(join(OUT_DIR, f)); console.log(`removed docs/art/flows/${f} — nothing generates it any more`); }
  const rows = diagrams.reduce((n, d) => n + d.rows.length, 0);
  console.log(`wrote ${wanted.size} diagrams (${rows} flows, ${(bytes / 1024).toFixed(1)} kB) to docs/art/flows/`);
}
