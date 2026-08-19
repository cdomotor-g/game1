/**
 * The plate-cropping arithmetic, for the tools.
 *
 * The arithmetic itself lives in docs/js/framing.js, because the explorer needs
 * it too and a card and a thumbnail of the same plate must not disagree about
 * where the subject is. This loads that file into a shim and re-exports it, the
 * way tools/simulate.mjs runs the browser engine headless. What is added here is
 * the part a browser has no business doing: reading docs/art/framing.json off
 * disk.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const shim = {};
shim.window = shim;
new Function('window', `with (this) { ${readFileSync(join(ROOT, 'docs/js/framing.js'), 'utf8')} }`)
  .call(shim, shim);

export const { crop, WHOLE_PLATE, FOCAL_TARGET } = shim.Framing;

/** docs/art/framing.json, parsed. */
export function readFraming(root = ROOT) {
  return JSON.parse(readFileSync(join(root, 'docs/art/framing.json'), 'utf8'));
}

/** Rounded to `places`, so generated files diff cleanly. */
export function round(rect, places = 4) {
  const r = (n) => Number(n.toFixed(places));
  return { x: r(rect.x), y: r(rect.y), w: r(rect.w), h: r(rect.h) };
}
