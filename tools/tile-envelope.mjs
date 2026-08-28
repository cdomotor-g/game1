#!/usr/bin/env node
/**
 * WHAT A TILE'S SHAPE WILL KEEP OF ITS PAGE — before anybody draws anything.
 *
 * `tile-proof` photographs a piece that exists. This answers the question one
 * step earlier and for a piece that does not: a plate is drawn on a rectangle
 * and cut to a clump of hexagons, so some of that page is thrown away, and until
 * you know how much you are composing blind.
 *
 * That blindness has a price and it has been paid. The granary went through six
 * drawn plates; three of them came back with the building drawn to the full
 * width of its page, which a triad cannot hold below its shoulder. Nothing was
 * wrong with the drawing and nothing could be fixed by aiming: on a triad the
 * crop keeps 99% of a square plate, so the parts that fall outside the cut are
 * carried into the window and then trimmed off by the die. The only fix is to
 * draw it smaller, and the only way to know that is to know the shape.
 *
 * So: run this before writing a brief, and read the box off it. The same numbers
 * are appended to every building-tile commission automatically - envelopeNote in
 * tools/lib/tiles.mjs, which mint-request --render calls - so this tool is for
 * the person composing, not for the pipeline. It writes nothing.
 *
 *   node tools/tile-envelope.mjs granary
 *   node tools/tile-envelope.mjs --all
 */
import { tileSubjects, envelopeOf, envelopeNote } from './lib/tiles.mjs';

const args = process.argv.slice(2);
const all = args.includes('--all');
const wanted = args.filter((a) => !a.startsWith('--'));

if (!all && !wanted.length) {
  console.error('usage: node tools/tile-envelope.mjs <tile-id> [...]   |   --all');
  process.exit(1);
}

const rows = await tileSubjects();
const subjects = Array.isArray(rows) ? rows : Object.values(rows);

/* One shape per line when sweeping: fifty-four tiles share four footprints, and
   fifty-four identical answers is not a report, it is a wall. */
const chosen = all
  ? [...new Map(subjects.map((s) => [s.shape, s])).values()]
  : wanted.map((id) => {
      const hit = subjects.find((s) => s.id === id || s.id === id.replace(/^tile-/, ''));
      if (!hit) {
        console.error(`tile-envelope: \`${id}\` is not a tile. Run node tools/mint-queue.mjs to see what is.`);
        process.exit(1);
      }
      return hit;
    });

const COLS = 44;
const ROWS = 22;

for (const t of chosen) {
  const { rows: spans, box } = envelopeOf(t.cells, 1);
  const pct = (n) => `${(n * 100).toFixed(0)}%`;

  console.log(`\n${t.name}  ·  ${t.shape}, ${t.cells.length} cell${t.cells.length > 1 ? 's' : ''}${all ? '' : `  ·  ${t.id}`}`);
  console.log(`  ${'-'.repeat(COLS)}`);

  for (let r = 0; r < ROWS; r++) {
    const y = (r + 0.5) / ROWS;
    const span = spans[Math.round(y * (spans.length - 1))];
    const inBox = y >= box.y && y <= box.y + box.h;
    let line = '';
    for (let c = 0; c < COLS; c++) {
      const x = (c + 0.5) / COLS;
      const cut = x >= span.x0 && x <= span.x1;
      const safe = inBox && x >= box.x && x <= box.x + box.w;
      line += safe ? '#' : cut ? ':' : ' ';
    }
    console.log(`  |${line}|`);
  }
  console.log(`  ${'-'.repeat(COLS)}`);
  console.log(`  #  the safe box - x ${pct(box.x)}-${pct(box.x + box.w)}, y ${pct(box.y)}-${pct(box.y + box.h)}`);
  console.log('  :  kept by the die, but not safe for the subject');
  console.log('     blank - cut away\n');
  console.log(`  ${envelopeNote(t.cells).replace(/\. /g, '.\n  ')}`);
}

console.log(`\nThis is what mint-request --render appends to a building-tile prompt.
Compose inside the box; everything else is ground the piece can afford to lose.`);
