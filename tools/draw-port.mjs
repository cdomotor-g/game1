#!/usr/bin/env node
/**
 * Cut the picture for every PORT card out of the map's own art.
 *
 * A port card has no commissioned plate yet, and the map it describes is already
 * a drawing: so the plate is a window onto it, centred on the port's hex. That is
 * the turn tools/draw-item.mjs took one deck up - the data is the source and the
 * picture is the output - and it is also why nothing here is ever hand-edited:
 * run it again and the files come back.
 *
 *   docs/art/renders/port-<id>.png   the window, rasterised from the plate SVG
 *   docs/art/framing.json            one entry per plate, written by this tool
 *
 * The framing is not measured off the picture, it is where the tool PUT it: the
 * port sits in the middle of every window, so the subject box and the focal
 * point are the same for every card and `--check` fails when they drift.
 *
 * Needs a browser, like card-proof and draw-item (tools/lib/chromium.mjs).
 *   node tools/draw-port.mjs [<port id> ...] [--check]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPorts } from './lib/ports.mjs';
import { layout } from './lib/hexgrid.mjs';
import { findChromium, shoot, noBrowser } from './lib/chromium.mjs';
import { plateIdFor } from './lib/plates.mjs';
import { readMintFile, minLongSideFor } from './lib/mint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs/art/renders');
const FRAMING = join(ROOT, 'docs/art/framing.json');
const json = (...p) => JSON.parse(readFileSync(join(ROOT, ...p), 'utf8'));

const args = process.argv.slice(2);
const check = args.includes('--check');
const wanted = args.filter((a) => !a.startsWith('--'));

const components = json('data/components.json');
const deck = components.decks.find((d) => d.id === 'ports');
const ports = loadPorts(ROOT);
const map = json('data/maps', `${json('data/ports.json').map}.json`);

/* The grid exactly as tools/draw-map.mjs laid it, so a hex is where the plate drew it. */
const PLATE_W = map.plate.width;
const BAND = components.mapPlate.frame.bandFraction;
const across = PLATE_W / (map.grid.cols + 2 * BAND);
const grid = layout({ cols: map.grid.cols, rows: map.grid.rows, acrossFlats: across, originX: Math.round(across * BAND), originY: Math.round(across * BAND) });

/* The window: HEXES_ACROSS of the board wide, in the card's own page shape (3:2). */
const HEXES_ACROSS = 8;
const ASPECT = 3 / 2;
const winW = across * HEXES_ACROSS;
const winH = winW / ASPECT;

const cardsLine = readMintFile(ROOT).lines.find((l) => l.id === 'cards');
const { min, want } = minLongSideFor(ROOT, cardsLine, { format: deck.plateFormat });
const LONG = want || min || 1300;
const SIZE = { w: LONG, h: Math.round(LONG / ASPECT) };

/* A window that would hang off the plate slides back onto it. The sea at the edge
   is plate too, and a window of nothing is not a picture of a port. */
function windowOf(port) {
  const c = grid.centre(port.hex[0], port.hex[1]);
  const x = Math.min(Math.max(c.x - winW / 2, 0), PLATE_W - winW);
  const y = Math.min(Math.max(c.y - winH / 2, 0), map.plate.height - winH);
  return { x, y, cx: (c.x - x) / winW, cy: (c.y - y) / winH };
}

const SUBJECT = [0.3, 0.25, 0.4, 0.5];
const noteFor = (port) => `${port.name} on the ${map.name} plate, a ${HEXES_ACROSS}-hex window cut by tools/draw-port.mjs. Generated: the tool put the port at the focal point and the subject is the middle of the window, so every port card is framed alike. Safe to delete; it comes back.`;

const framing = json('docs/art/framing.json');
const subjects = ports.filter((p) => !wanted.length || wanted.includes(p.id) || wanted.includes(p.cardCode));

if (check) {
  let stale = 0;
  for (const p of subjects) {
    const id = plateIdFor(deck, p);
    const w = windowOf(p);
    const e = framing.plates[id];
    if (!existsSync(join(RENDERS, `${id}.png`))) { console.error(`docs/art/renders/${id}.png is missing.`); stale++; }
    if (!e) { console.error(`docs/art/framing.json has no entry for ${id}.`); stale++; continue; }
    if (JSON.stringify(e.subject) !== JSON.stringify(SUBJECT) || Math.abs(e.focal[0] - w.cx) > 0.001 || Math.abs(e.focal[1] - w.cy) > 0.001) {
      console.error(`docs/art/framing.json ${id}: drifted from where the tool puts the port.`); stale++;
    }
  }
  if (stale) { console.error('\nRun: node tools/draw-port.mjs'); process.exit(1); }
  console.log(`port plates are up to date - ${subjects.length} windows, framed on ${JSON.stringify(SUBJECT)}`);
  process.exit(0);
}

const chromium = findChromium();
if (!chromium) { console.error(noBrowser('draw-port', 'The port plates are rasterised from the map SVG and cannot be made without one.')); process.exit(1); }
mkdirSync(RENDERS, { recursive: true });
const svgUrl = pathToFileURL(join(ROOT, 'docs/map', map.plate.file)).href;

for (const p of subjects) {
  const id = plateIdFor(deck, p);
  const w = windowOf(p);
  /* The map is drawn at its own size inside an overflow-hidden box and slid and
     scaled so the window fills the page: a vector, so it is sharp at any scale. */
  const k = SIZE.w / winW;
  shoot(chromium, {
    html: `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}#w{width:${SIZE.w}px;height:${SIZE.h}px;overflow:hidden;position:relative}img{position:absolute;left:${-w.x * k}px;top:${-w.y * k}px;width:${PLATE_W * k}px;height:${map.plate.height * k}px}</style><div id="w"><img src="${svgUrl}"></div>`,
    out: join(RENDERS, `${id}.png`), width: SIZE.w, height: SIZE.h, scratchName: id,
  });
  framing.plates[id] = { subject: SUBJECT, focal: [Number(w.cx.toFixed(3)), Number(w.cy.toFixed(3))], note: noteFor(p) };
  console.log(`  ${p.cardCode}  ${id}  ${SIZE.w} x ${SIZE.h}`);
}
writeFileSync(FRAMING, JSON.stringify(framing, null, 2) + '\n');
console.log(`\n${subjects.length} port plates cut from ${map.plate.file}.`);
