#!/usr/bin/env node
/**
 * build-styleref - one small sheet of the accepted plates, for the artist.
 *
 * The artist is ChatGPT pointed at this repository, and a GitHub connector hands
 * it no image bytes at all: it can read every word of a brief and cannot see a
 * single plate. Pointed at four-megabyte PNGs it stopped and said so, which was
 * the right call and still a stalled run.
 *
 * So the exemplars are drawn onto ONE sheet, small enough to fetch over a URL or
 * drag into a chat, published by GitHub Pages with everything else in docs/. The
 * captions say what to look at, because a reference nobody knows how to read is
 * a picture rather than a reference.
 *
 * It is a PROOF, in this repository's sense - a photograph of artefacts, never an
 * artefact - except that this one is committed, because the whole point is that it
 * has a stable public URL.
 *
 *   node tools/build-styleref.mjs           write docs/art/style-reference.png
 *   node tools/build-styleref.mjs --check   fail if it is missing or stale
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, statSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const WIDTH = 1500;
/* The sheet's height is arithmetic rather than a guess, so the shot has no dead
   band under it: chromium screenshots the WINDOW, and a window taller than the
   page photographs the difference as empty paper. Every band below is a fixed
   height in the stylesheet, so this sum is the page. */
const PAD_TOP = 30, PAD_BOTTOM = 30, HEAD = 116, PLATE_BOX = 640, CAPTION = 132, BANNER = 92, GAP = 16;
const HEIGHT = PAD_TOP + HEAD + PLATE_BOX + 9 + CAPTION + GAP + BANNER + PAD_BOTTOM;

const style = JSON.parse(readFileSync(join(ROOT, 'data/artstyle.json'), 'utf8'));
const ex = style.exemplars;
const OUT = join(ROOT, ex.sheet);

/* Same search order as tools/card-proof.mjs, and the same reason: any
   Chromium-family browser that understands --headless --screenshot will do. */
function findChromium() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(pw)) {
    for (const dir of readdirSync(pw).filter((d) => d.startsWith('chromium'))) {
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const c = join(pw, dir, rel);
        if (existsSync(c)) return c;
      }
    }
  }
  return ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable', '/snap/bin/chromium',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'].find((p) => existsSync(p)) || null;
}

const missing = ex.plates.filter((p) => !existsSync(join(ROOT, 'docs/art/renders', `${p.plate}.png`)));
if (missing.length) {
  console.error(`build-styleref: no plate for ${missing.map((m) => m.plate).join(', ')} — fix data/artstyle.json exemplars`);
  process.exit(1);
}

if (CHECK) {
  if (!existsSync(OUT)) {
    console.error(`build-styleref --check: ${ex.sheet} is missing. Run: node tools/build-styleref.mjs`);
    process.exit(1);
  }
  const sheet = statSync(OUT).mtimeMs;
  const stale = ex.plates.filter((p) => statSync(join(ROOT, 'docs/art/renders', `${p.plate}.png`)).mtimeMs > sheet)
    .concat(statSync(join(ROOT, 'data/artstyle.json')).mtimeMs > sheet ? [{ plate: 'data/artstyle.json' }] : []);
  if (stale.length) {
    console.error(`build-styleref --check: ${ex.sheet} is older than ${stale.map((s) => s.plate).join(', ')}. Run: node tools/build-styleref.mjs`);
    process.exit(1);
  }
  console.log(`build-styleref --check: ${ex.sheet} is current (${ex.plates.length} plates)`);
  process.exit(0);
}

const chromium = findChromium();
if (!chromium) {
  console.error('build-styleref: no Chromium found. Set CHROME_PATH to any Chromium-family browser.');
  console.error('Nothing in the build depends on this sheet; the committed copy stays as it is.');
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cell = (p) => `
  <figure>
    <div class="box"><img src="${pathToFileURL(join(ROOT, 'docs/art/renders', `${p.plate}.png`)).href}" alt=""></div>
    <figcaption><b>${esc(p.title)}</b><span>${esc(p.note)}</span></figcaption>
  </figure>`;

const html = `<!doctype html><meta charset="utf-8"><style>
  :root { --ink:#1A1714; --paper:#EDE4D1; }
  * { box-sizing:border-box; }
  body { margin:0; width:${WIDTH}px; height:${HEIGHT}px; background:var(--paper); color:var(--ink);
         font:15px/1.45 Georgia,'Times New Roman',serif; padding:${PAD_TOP}px 30px ${PAD_BOTTOM}px; }
  h1 { font-size:25px; margin:0 0 4px; letter-spacing:.01em; }
  .sub { font-size:15px; margin:0 0 8px; }
  .rule { border:0; border-top:2px solid var(--ink); margin:14px 0 20px; }
  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  figure { margin:0; display:flex; flex-direction:column; }
  /* A fixed box the plate is fitted INTO, so a portrait page and a square one
     leave their captions on the same line and the sheet's height stays arithmetic. */
  .box { height:${PLATE_BOX}px; display:flex; align-items:flex-start; justify-content:center; }
  img { max-width:100%; max-height:100%; width:auto; height:auto; display:block;
        border:1px solid rgba(26,23,20,.45); }
  figcaption { margin-top:9px; height:${CAPTION}px; font-size:13.5px; line-height:1.42; }
  figcaption b { display:block; font-size:14.5px; margin-bottom:3px; }
  .no { margin:${GAP}px 0 0; padding:14px 18px; border:2px solid var(--ink); font-size:14px; height:${BANNER}px; }
  .no b { letter-spacing:.03em; }
</style>
<h1>House style — the accepted plates</h1>
<p class="sub">Every plate in this game is drawn to match these three. The written rule is the
<code>## Prompt preamble</code> block in <code>docs/art/07-ai-agent-brief.md</code>; this sheet is what it looks like.</p>
<hr class="rule">
<div class="grid">${ex.plates.map(cell).join('')}</div>
<p class="no"><b>A PLATE IS NOT A CARD.</b> Each of these is a whole drawn page and nothing else.
The card frame, the title, the card code, the stat icons, the rules text and the flavour text are set by
machine afterwards, over a crop of the page. Draw the picture alone — no panel, no banner, no border rule,
no lettering anywhere.</p>`;

const scratch = mkdtempSync(join(tmpdir(), 'styleref-'));
try {
  const page = join(scratch, 'sheet.html');
  writeFileSync(page, html, 'utf8');
  execFileSync(chromium, [
    '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    /* The plates are four-megabyte PNGs and the shot is taken the moment the page
       is idle; without a budget the sheet photographs with holes in it. */
    '--virtual-time-budget=20000',
    '--default-background-color=FFFFFFFF',
    `--window-size=${WIDTH},${HEIGHT}`,
    `--screenshot=${OUT}`,
    pathToFileURL(page).href,
  ], { stdio: 'pipe' });
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

const kb = (statSync(OUT).size / 1024).toFixed(0);
console.log(`build-styleref: wrote ${ex.sheet} (${kb} kB) — ${ex.plates.map((p) => p.plate).join(', ')}`);
