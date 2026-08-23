/**
 * Turning a colour's NAME into a colour.
 *
 * The data never holds a hex code. An element names its ink in
 * data/arcana.json, a part of an object names its material in data/items.json,
 * a deck names its back's ink in data/components.json - and every one of those
 * is a word out of docs/art/palette.json, which is the one file allowed to say
 * what a word is worth. That is what makes tools/validate-art.mjs a real check
 * rather than a formality: a generator that cannot spell a colour cannot invent
 * one either.
 *
 * Two readers so far - tools/build-icons.mjs and tools/draw-item.mjs - which is
 * one more than a copy should have.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** docs/art/palette.json, parsed. */
export function readPalette(root = ROOT) {
  return JSON.parse(readFileSync(join(root, 'docs/art/palette.json'), 'utf8'));
}

/**
 * `"oxide"` -> the named ink. `"soot"` -> the ink plate's one colour.
 * `"soot-tint-40"` -> that tint. Anything else is a mistake, and it is a loud
 * one: a name the palette does not declare would otherwise reach a generated
 * SVG as `undefined` and paint nothing at all.
 */
export function inkHex(name, palette = readPalette()) {
  const tint = /^soot-tint-(\d+)$/.exec(name);
  if (tint) {
    const t = palette.ink.tints[tint[1]];
    if (!t) throw new Error(`data names a soot tint the palette does not declare: ${name}`);
    return t.hex;
  }
  if (name === 'soot') return palette.ink.soot.hex;
  if (palette.paper[name]) return palette.paper[name].hex;
  const ink = palette.inks[name];
  if (!ink) throw new Error(`data names an ink the palette does not declare: ${name}`);
  return ink.hex;
}
