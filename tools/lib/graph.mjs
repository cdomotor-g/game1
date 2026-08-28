/**
 * The dependency graph, for the tools.
 *
 * The model, the layout and the renderer live in docs/js/graph.js, because the
 * explorer's Graph tab needs them too and the web page and the printed rulebook
 * must be one drawing, not two that agree. This loads that file into a shim and
 * re-exports it, the way tools/lib/framing.mjs loads the cropping arithmetic.
 * What is added here is the part a browser has no business doing: assembling
 * the datasets off disk in the same shape the web bundle carries them.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const shim = {};
shim.window = shim;
new Function('window', `with (this) { ${readFileSync(join(ROOT, 'docs/js/graph.js'), 'utf8')} }`)
  .call(shim, shim);

export const { build, layout, toSVG, radiusOf, washStep } = shim.Graph;

/** data/*.json keyed the way docs/data/bundle.js keys them — manifest included —
    which is the shape Graph.build reads. Maps are not needed and not read. */
export function readGameData(root = ROOT) {
  const DATA = join(root, 'data');
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'));
  const out = { manifest };
  for (const ds of manifest.datasets) {
    out[ds.key] = JSON.parse(readFileSync(join(DATA, ds.file), 'utf8'));
  }
  return out;
}
