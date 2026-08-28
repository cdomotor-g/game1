#!/usr/bin/env node
/**
 * Draws the dependency graph — every thing in the game and every arrow between
 * them — into docs/art/graph/dependencies.svg, for the rulebook to print.
 *
 * The nodes are declared in data/graph.json; the arrows are computed from
 * data/manifest.json references.checks, the same declarations the validator
 * enforces, so this drawing cannot know an edge validate-data does not check.
 * The model, the deterministic layout and the renderer live in docs/js/graph.js
 * (loaded through tools/lib/graph.mjs), because the explorer's Graph tab is the
 * same drawing live — edit the data, rerun this, and both move together.
 *
 * Committed like docs/data/bundle.js, for the same reason: GitHub Pages serves
 * the files in the branch, and the annex prints this file by path. --check
 * regenerates and fails if the committed copy has gone stale.
 *
 * Usage: node tools/build-graph.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, layout, toSVG, washStep, readGameData } from './lib/graph.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs', 'art', 'graph');
const OUT = join(OUT_DIR, 'dependencies.svg');
const checkOnly = process.argv.includes('--check');

const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const DATA = readGameData(ROOT);

/* Every colour below is a palette colour or two of them mixed — the graph has
   no colours of its own. The mix is linear in sRGB, which is what the site's
   color-mix(in srgb, …) does with the same fractions, so the printed dot and
   the on-screen dot are the same recipe. */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, frac) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * frac).toString(16).padStart(2, '0')).join('');

const soot = palette.ink.soot.hex;
const tallow = palette.paper.tallow.hex;

for (const node of DATA.graph.nodes) {
  if (!palette.inks[node.wash]) {
    console.error(`data/graph.json: "${node.id}" washes in "${node.wash}", which is not an ink in docs/art/palette.json`);
    process.exit(1);
  }
}

const model = build(DATA);
if (!model.nodes.length) {
  console.error('the graph came out empty — data/graph.json names no collection the manifest checks reference');
  process.exit(1);
}
const laid = layout(model);

const nodeColors = {};
for (const k of model.kinds) {
  const step = washStep(k.variant);
  const ink = palette.inks[k.wash].hex;
  nodeColors[k.id] = step.toward ? mix(ink, step.toward === 'soot' ? soot : tallow, step.frac) : ink;
}

const svg = toSVG(model, laid, {
  colors: {
    node: nodeColors,
    edge: palette.ink.tints['70'].hex,
    text: palette.ink.tints['85'].hex,
    textStrong: soot,
    halo: tallow,
  },
  background: tallow,
  legend: true,
  title: 'The web of things',
  note: [
    'Every arrow points from the thing whose data names the other, at the thing it names.',
    `${model.nodes.length} things, ${model.edges.length} ties; ${model.isolated} with no ties are not drawn.`,
    'Computed from data/manifest.json references by tools/build-graph.mjs — do not edit.',
    'The explorer’s Graph tab is this same drawing, live.',
  ],
});

if (checkOnly) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* absent counts as stale */ }
  if (current !== svg) {
    console.error('docs/art/graph/dependencies.svg is stale. Run: node tools/build-graph.mjs');
    process.exit(1);
  }
  console.log('docs/art/graph/dependencies.svg is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, svg, 'utf8');
  console.log(`wrote docs/art/graph/dependencies.svg (${(svg.length / 1024).toFixed(1)} kB) — ` +
    `${model.nodes.length} things, ${model.edges.length} ties, ${model.isolated} isolated and undrawn`);
}
