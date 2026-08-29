/**
 * Which records a deck deals, for the tools.
 *
 * The rule itself lives in docs/js/decks.js, because the explorer needs it too
 * and the card builder, the mint queue and the web build must not come to
 * different conclusions about what is in a deck. This loads that file into a
 * shim and re-exports it, the way tools/lib/framing.mjs loads the crop and
 * tools/simulate.mjs runs the browser engine headless.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const shim = {};
shim.window = shim;
new Function('window', `with (this) { ${readFileSync(join(ROOT, 'docs/js/decks.js'), 'utf8')} }`)
  .call(shim, shim);

export const { matchesFilter, cardsOfDeck } = shim.Decks;
