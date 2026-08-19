#!/usr/bin/env node
/**
 * Bundles data/*.json into docs/data/bundle.js as a plain global.
 *
 * Why: the explorer has to work when you double-click docs/index.html straight off
 * disk, and browsers refuse to fetch() a local file. A generated script tag is the
 * only way to keep data/*.json as the single source of truth AND keep the page
 * openable with no server, no build step and no npm install.
 *
 * Usage: node tools/build-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pngSize } from './lib/png.mjs';
import { readFraming, WHOLE_PLATE } from './lib/framing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'data');
const OUT = join(OUT_DIR, 'bundle.js');

const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'));

const bundle = { $generated: 'by tools/build-data.mjs - do not edit', manifest };
for (const ds of manifest.datasets) {
  bundle[ds.key] = JSON.parse(readFileSync(join(DATA, ds.file), 'utf8'));
}

/* Maps are a directory rather than a manifest entry, so that adding the next board
   is one new file and no edit anywhere else. Sorted by id so the bundle is stable. */
if (manifest.maps) {
  const dir = join(DATA, manifest.maps.dir);
  bundle[manifest.maps.key] = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    : [];
}

/* Art is files, not data, so its index is derived by looking: whatever plates are
   actually committed under docs/ is what the explorer offers to show. Paths are
   relative to docs/ because that is where index.html lives.

   A render carries its pixel size and the subject box from docs/art/framing.json
   as well as its path, because a thumbnail of a plate is a crop of it and a crop
   needs to know what shape the page is and what on it may not be cut. Mini-map
   sheets are shown whole, so a path is all they need. */
const art = {
  $comment: 'derived from the committed PNGs - see docs/art/prompts/ and docs/minimaps/prompts/ - plus the subject boxes in docs/art/framing.json',
  renders: {},
  minimaps: {},
};
const framing = readFraming(ROOT);
const unframed = [];
const abs = (dir) => join(ROOT, 'docs', dir);

if (existsSync(abs('art/renders'))) {
  for (const f of readdirSync(abs('art/renders')).sort()) {
    if (!f.endsWith('.png')) continue;
    const id = f.slice(0, -4);
    const { width, height } = pngSize(join(abs('art/renders'), f));
    const entry = framing.plates[id];
    if (!entry) unframed.push(id);
    art.renders[id] = {
      file: `art/renders/${f}`,
      width,
      height,
      subject: entry ? entry.subject : WHOLE_PLATE,
      /* Where the picture is aimed. Optional, and undefined stays out of the
         bundle rather than going in as null - see docs/art/09-framing-and-composition.md. */
      ...(entry && entry.focal ? { focal: entry.focal } : {}),
      ...(entry && entry.focalTargetOverride ? { focalTarget: entry.focalTargetOverride } : {}),
    };
  }
}
art.pad = framing.pad;
art.focalTarget = framing.focalTarget;

if (existsSync(abs('minimaps/img'))) {
  for (const f of readdirSync(abs('minimaps/img')).sort()) {
    if (f.endsWith('.png')) art.minimaps[f.slice(0, -4)] = `minimaps/img/${f}`;
  }
}
bundle.art = art;

if (unframed.length) {
  console.warn(`warning  no entry in docs/art/framing.json for ${unframed.join(', ')} ` +
    '- those plates are shown from the middle of the page, which is what framing.json exists to stop.');
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  OUT,
  `/* GENERATED FILE - do not edit. Run: npm run build (or node tools/build-data.mjs) */\n` +
    `window.GAME_DATA = ${JSON.stringify(bundle, null, 2)};\n`,
  'utf8'
);

const bytes = readFileSync(OUT).length;
const maps = bundle[manifest.maps?.key]?.length ?? 0;
console.log(
  `wrote docs/data/bundle.js (${(bytes / 1024).toFixed(1)} kB) from ` +
    `${manifest.datasets.length} datasets and ${maps} map(s)`
);
