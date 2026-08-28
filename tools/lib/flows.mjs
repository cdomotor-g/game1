/**
 * The flows of work, for the tools.
 *
 * The model and the renderer live in docs/js/flows.js, because the explorer's
 * Flows tab draws the same diagrams live and the page and the printed book
 * must be one drawing, not two that agree. This loads that file into a shim
 * and re-exports it, exactly the way tools/lib/graph.mjs loads the graph.
 * build-annex.mjs also imports build() from here to learn which diagrams
 * exist, so the annex can never list a flow the tool did not draw.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const shim = {};
shim.window = shim;
new Function('window', `with (this) { ${readFileSync(join(ROOT, 'docs/js/flows.js'), 'utf8')} }`)
  .call(shim, shim);

export const { build, toSVG } = shim.Flows;
export { readGameData } from './graph.mjs';
