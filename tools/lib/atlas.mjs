/**
 * The Atlas game model, for the tools.
 *
 * The model itself lives in docs/js/atlas.js, because the explorer and the digital game need it too and
 * a lane printed on the board must cost what a screen says it costs. This loads that file into a shim
 * and re-exports it, the way tools/lib/framing.mjs loads framing.js.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const shim = {};
shim.window = shim;
new Function('window', `with (this) { ${readFileSync(join(ROOT, 'docs/js/atlas.js'), 'utf8')} }`).call(shim, shim);

export const { create, zonal, beltAt, stepCost, BEARING, DIRS } = shim.Atlas;
