/**
 * The one thing in this repository that is not pure node.
 *
 * Two tools need a browser and both need it for the same reason: an SVG is the
 * artefact, and an SVG is not something you can put in front of somebody.
 * tools/card-proof.mjs photographs a finished card; tools/draw-item.mjs turns a
 * drawn plate into the PNG a card window can show. Neither is in the build, and
 * that is the bargain - the same one tools/mint-draw.mjs makes with an image
 * model. Use it when it is there, degrade cleanly and say so when it is not,
 * and never let a shortcut become a dependency.
 *
 * Kept here rather than copied, because the list of places a browser hides is
 * exactly the kind of thing that gets fixed in one copy and not the other.
 */
import { existsSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { readPng, writePng } from './png.mjs';

/**
 * Somewhere to render, checked in the order a person would check them: what you
 * told me, what a Playwright install put on the box, then the usual places a
 * browser lands on each platform.
 *
 * CHROME_PATH is first because it is the escape hatch. Any Chromium-family
 * browser that understands `--headless --screenshot` will do, and nothing here
 * has any business having opinions about which one you have.
 */
export function findChromium() {
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

/* Asked for on every side, and cut off again below. Enough to cover the
   headless viewport's disagreement with `--window-size` without being worth
   thinking about; it costs one screenshot of empty paper. */
const PAD = 200;

/** The wanted corner of a deliberately over-sized screenshot. */
function cropTopLeft(image, width, height) {
  const rgb = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const from = y * image.width * 3;
    rgb.set(image.rgb.subarray(from, from + width * 3), y * width * 3);
  }
  return { width, height, rgb };
}

/**
 * One HTML page, screenshotted to `out` at exactly `width` x `height`.
 *
 * Rendered into a window deliberately BIGGER than the page and then cut back to
 * it. Headless does not give a viewport that reliably matches `--window-size` -
 * ask for the exact height and the bottom is missing - and the fix is not to
 * work out the discrepancy but to stop depending on it. Ask for too much, keep
 * the top-left corner, and the result is the right size because we cut it to
 * the right size.
 *
 * `scratchName` only names the temporary file, so a failure is greppable.
 */
export function shoot(chromium, { html, out, width, height, scratchName = 'page' }) {
  const scratch = join(tmpdir(), `ccr-shoot-${process.pid}`);
  mkdirSync(scratch, { recursive: true });
  const file = join(scratch, `${scratchName}.html`);
  try {
    writeFileSync(file, html, 'utf8');
    execFileSync(chromium, [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      /* A plate can be a four-megabyte PNG and the screenshot is taken the
         moment the page is idle; without a budget to spend, a big page
         photographs with a hole where its picture goes. */
      '--virtual-time-budget=10000',
      '--default-background-color=FFFFFFFF',
      '--force-device-scale-factor=1',
      `--window-size=${Math.ceil(width) + PAD},${Math.ceil(height) + PAD}`,
      `--screenshot=${out}`,
      pathToFileURL(file).href,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  const shot = readPng(out);
  if (shot.width < width || shot.height < height) {
    throw new Error(`rendered ${shot.width} x ${shot.height}, short of the ${width} x ${height} asked for - raise PAD in tools/lib/chromium.mjs`);
  }
  writePng(out, cropTopLeft(shot, width, height));
  return { width, height };
}

/** What to say when there is no browser, so every caller says the same thing. */
export function noBrowser(tool, consequence) {
  return [
    `${tool}: no Chromium-family browser found, so there is nothing to render with.`,
    `${' '.repeat(tool.length)}  Set CHROME_PATH to one, or install Chromium. ${consequence}`,
  ].join('\n');
}
