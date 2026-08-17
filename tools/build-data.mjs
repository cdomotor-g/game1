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
   relative to docs/ because that is where index.html lives. */
const art = { $comment: 'derived from the committed PNGs - see docs/art/prompts/ and docs/minimaps/prompts/', renders: {}, minimaps: {} };
const scanPngs = (dir, into) => {
  const abs = join(ROOT, 'docs', dir);
  if (!existsSync(abs)) return;
  for (const f of readdirSync(abs).sort()) {
    if (f.endsWith('.png')) into[f.slice(0, -4)] = `${dir}/${f}`;
  }
};
scanPngs('art/renders', art.renders);
scanPngs('minimaps/img', art.minimaps);
bundle.art = art;

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
