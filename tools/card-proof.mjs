#!/usr/bin/env node
/**
 * The finished card, as a picture you can put in front of somebody.
 *
 * `docs/cards/*.svg` is the card, and an SVG is not something you can paste into
 * a review, a chat window or an issue. The explorer renders them and so does any
 * browser, but "open this file and look" is not a thing a reviewer at the other
 * end of a message can do, and it is not a thing an agent can do at all - which
 * is how a deck can be built, checked, committed and never once actually LOOKED
 * at. Every check in this repository proves something about the numbers; this one
 * is for the eye.
 *
 * Different from tools/aim-preview.mjs, and the two are easy to confuse:
 *
 *   aim-preview  the CROP. What the picture window will take out of a plate, so
 *                the subject box and the focal point can be chosen. Runs before
 *                the card exists.
 *   card-proof   the CARD. Frame, strip, kicker, rules, story rail and picture,
 *                exactly as built. Runs after.
 *
 * It renders with a locally installed Chromium, which is the one thing here that
 * is not pure node. That is deliberate and it is kept at arm's length: nothing in
 * the build depends on it, no dependency is added, and a machine without a browser
 * gets a clear message and an exit code rather than a stack trace. The same
 * bargain tools/mint-draw.mjs makes with an image model - use it when it is there,
 * degrade cleanly and say so when it is not.
 *
 * Proofs are diagnostics and are git-ignored, like the map proof sheets and the
 * aim previews. The SVG is the artefact; this is a photograph of it.
 *
 *   node tools/card-proof.mjs MOD-01
 *   node tools/card-proof.mjs MOD-01 TAL-01 --scale 3
 *   node tools/card-proof.mjs --deck MOD
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { readPng, writePng } from './lib/png.mjs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = join(ROOT, 'docs/cards');
const OUT_DIR = join(ROOT, 'docs/art/proofs');

/* ------------------------------------------------------------------- chromium */

/**
 * Somewhere to render. Checked in the order a person would check them: what you
 * told me, what a Playwright install put on the box, then the usual places a
 * browser lands on each platform.
 *
 * CHROME_PATH is first because it is the escape hatch: any Chromium-family
 * browser that understands `--headless --screenshot` will do, and this tool has
 * no business having opinions about which one you have.
 */
function findChromium() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;

  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(pw)) {
    for (const dir of readdirSync(pw).filter((d) => d.startsWith('chromium'))) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const candidate = join(pw, dir, rel);
        if (existsSync(candidate)) return candidate;
      }
    }
  }

  const usual = [
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/snap/bin/chromium',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return usual.find((p) => existsSync(p)) || null;
}

/* ----------------------------------------------------------------- the render */

/**
 * The card's own size, off its root element.
 *
 * A card is 63x88mm plus 3mm of bleed at 8 units per millimetre, but none of
 * those numbers belong here - they are components.json's, they reach the SVG
 * through tools/build-cards.mjs, and this tool's job is to photograph whatever
 * size the card turned out to be.
 */
function sizeOf(svg) {
  const m = svg.match(/<svg[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/)
    || svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!m) throw new Error('cannot read the card size off its <svg> element');
  return { width: Number(m[1]), height: Number(m[2]) };
}

/**
 * The card wrapped in a page that is exactly its size.
 *
 * The SVG is INLINED rather than pointed at with an `<img>`, because an SVG
 * loaded as an image is in secure static mode and its external references are
 * blocked - which is silently a card with an empty picture window, the one thing
 * a proof exists to show. Inlined it is ordinary DOM and the plate loads.
 *
 * Its `<image href>` is relative to docs/cards/, so those are rewritten to
 * absolute file URLs on the way past: the page itself lives in a temporary
 * directory and would otherwise be resolving them against that.
 */
function page(svg, size) {
  const absolute = svg.replace(/href="([^"#][^"]*)"/g, (whole, href) => {
    if (/^(https?:|data:|file:|#)/.test(href)) return whole;
    return `href="${pathToFileURL(resolvePath(CARDS, href)).href}"`;
  });
  return `<!doctype html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  svg { display: block; width: ${size.width}px; height: ${size.height}px; }
</style>
${absolute}
`;
}

/* Slack asked for on every side, and cut off again below. Enough to cover the
   headless viewport's disagreement with `--window-size` without being worth
   thinking about; it costs one screenshot of empty paper. */
const PAD = 200;

/** The card's own corner of a deliberately over-sized screenshot. */
function cropTopLeft(image, width, height) {
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const from = y * image.width * 3;
    rgb.set(image.rgb.subarray(from, from + width * 3), y * width * 3);
  }
  return { width, height, rgb };
}

/* ------------------------------------------------------------------- the run */

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const SCALE = Number(flag('scale', 2));
const deck = flag('deck', null);

/* Everything that is not a flag or a flag's value. */
const flagged = new Set();
for (const name of ['scale', 'deck']) {
  const i = args.indexOf(`--${name}`);
  if (i !== -1) { flagged.add(i); flagged.add(i + 1); }
}
let codes = args.filter((a, i) => !flagged.has(i) && !a.startsWith('--'));

if (deck) {
  codes = readdirSync(CARDS)
    .filter((f) => f.endsWith('.svg') && f.startsWith(`${deck.toUpperCase()}-`))
    .map((f) => f.replace(/\.svg$/, ''))
    .sort();
  if (!codes.length) {
    console.error(`card-proof: no built cards for deck ${deck} - run node tools/build-cards.mjs first.`);
    process.exit(1);
  }
}

if (!codes.length) {
  console.error('usage: node tools/card-proof.mjs <CODE...> [--deck PREFIX] [--scale n]');
  process.exit(2);
}

const chromium = findChromium();
if (!chromium) {
  console.error('card-proof: no Chromium-family browser found, so there is nothing to render with.');
  console.error('            Set CHROME_PATH to one, or install Chromium. Nothing in the build depends');
  console.error('            on this tool - the card itself is docs/cards/<CODE>.svg, which any browser');
  console.error('            will open. This only exists to turn that into a PNG you can send someone.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const scratch = join(tmpdir(), `card-proof-${process.pid}`);
mkdirSync(scratch, { recursive: true });

let failed = 0;
try {
  for (const code of codes) {
    const file = join(CARDS, `${code}.svg`);
    if (!existsSync(file)) {
      console.error(`  ${code}  no card at docs/cards/${code}.svg - it has no plate yet, or the deck is not built.`);
      failed++;
      continue;
    }
    const svg = readFileSync(file, 'utf8');
    const size = sizeOf(svg);
    const html = join(scratch, `${code}.html`);
    writeFileSync(html, page(svg, size), 'utf8');

    const out = join(OUT_DIR, `${code}.png`);
    execFileSync(chromium, [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      /* The plate is a four-megabyte PNG and the screenshot is taken the moment
         the page is idle; without a budget to spend, a big card photographs with
         a hole where its picture goes. */
      '--virtual-time-budget=10000',
      '--default-background-color=FFFFFFFF',
      `--force-device-scale-factor=${SCALE}`,
      /* Rendered into a window deliberately BIGGER than the card, then cut back
         to the card exactly. Headless does not give a viewport that reliably
         matches `--window-size` - ask for the card's own height and the bottom of
         it is missing, which on this deck is the last line of the rules text -
         and the fix is not to work out the discrepancy but to stop depending on
         it. Ask for too much, keep the top-left corner, and the proof is the
         card's size because we cut it to the card's size. */
      `--window-size=${Math.ceil(size.width) + PAD},${Math.ceil(size.height) + PAD}`,
      `--screenshot=${out}`,
      pathToFileURL(html).href,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    const shot = readPng(out);
    const want = { width: Math.round(size.width * SCALE), height: Math.round(size.height * SCALE) };
    if (shot.width < want.width || shot.height < want.height) {
      console.error(`  ${code}  rendered ${shot.width} x ${shot.height}, short of the card's ${want.width} x ${want.height} - raise PAD.`);
      failed++;
      continue;
    }
    writePng(out, cropTopLeft(shot, want.width, want.height));

    console.log(`  ${code}  ${want.width} x ${want.height}  ->  docs/art/proofs/${code}.png`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

console.log(`\n${codes.length - failed} of ${codes.length} proofed into docs/art/proofs/ — git-ignored, regenerate whenever.`);
if (failed) process.exit(1);
