#!/usr/bin/env node
/**
 * The plate, without a chat in the middle.
 *
 * The mint's split is real and stays: somebody who can write and cannot draw
 * hands over to somebody who can draw and does not know the rules. What this
 * changes is only who carries the paper. The designer still writes the brief and
 * still aims the plate afterwards; the artist is still a different pair of hands
 * with no idea what a summary strip is. It is the courier that stops being a
 * person copying an image out of one window and into another.
 *
 * A CARD can be drawn this way because a card is small. 63 x 88 mm plus bleed is
 * 1110 px at 300 dpi and one call returns more than that (data/mint.json
 * lines.cards.plate.minLongSide, derived rather than typed). A MAP cannot: its
 * own largest sheet asks for 4857 px, and a coastline generated in quadrants
 * does not meet in the middle. That is why only the cards line has a `draw`
 * block, and why maps went the other way entirely - see tools/draw-map.mjs.
 *
 * IT DEGRADES, IT DOES NOT BLOCK. No key, no route, or any answer that is not a
 * 200, and it prints the commission and exits 0. docs/MINT.md's two-agent
 * handover is the version that is definitely going to work; this is a shortcut
 * through it and a shortcut is not allowed to become a dependency.
 *
 * Usage:
 *   node tools/mint-draw.mjs MOD-01           draw one subject
 *   node tools/mint-draw.mjs MOD-01 --force   redraw one that already has a plate
 *   node tools/mint-draw.mjs --dry-run        say what it would do, call nothing
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { assemble, briefFor, minLongSideFor, platePath, survey, windowNote } from './lib/mint.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const targets = args.filter((a) => !a.startsWith('--'));
const ROOT = process.cwd();

const found = survey(ROOT);
const all = found.lines.flatMap((e) => (e.shelved ? [] : e.rows.map((row) => ({ line: e.line, row }))));

if (!targets.length) {
  console.error('mint-draw: name a card code or a plate id. Run node tools/mint-queue.mjs to see what is waiting.');
  process.exit(1);
}

/* The commission, printed where a person can pick it up. Every path out of this
   tool that is not a written plate ends here, because the work still has to be
   possible - it just has to be done the long way. */
function handOver(line, row, prompt, why) {
  console.error(`\nmint-draw: ${why}`);
  console.error(`Falling back to the two-agent handover. Paste this into an image model, save the result as`);
  console.error(`${platePath(line, row)}, and run node tools/mint-queue.mjs.\n`);
  console.log(prompt);
  process.exit(0);
}

for (const target of targets) {
  const hit = all.find(({ row }) => row.code.toLowerCase() === target.toLowerCase() || row.plate === target);
  if (!hit) {
    console.error(`mint-draw: \`${target}\` is not a subject the mint knows.`);
    process.exit(1);
  }
  const { line, row } = hit;

  const brief = briefFor(ROOT, line.brief.dir, row.briefFile ?? line.brief.file, row.plate);
  if (!brief) {
    console.error(`mint-draw: ${row.code} has no brief yet — it is at step WRITE. Write \`## ${row.plate}\` into ${line.brief.dir}/${row.briefFile ?? line.brief.file} first.`);
    process.exit(1);
  }
  if (!brief.aimBlock) {
    console.error(`mint-draw: ${row.code} has no ${line.aim.step} block, so the crop would be pot luck. ${line.aim.contract} says what one has to say.`);
    process.exit(1);
  }

  /* The window is appended to every commission, computed, because no brief can
     know what shape the card it feeds will be - build-cards decides that from
     the deck's wordiest rule, and it moves. See windowNote in lib/mint.mjs. */
  const prompt = assemble(brief, windowNote(ROOT, line, row));
  const out = join(ROOT, platePath(line, row));

  if (existsSync(out) && !flag('force')) {
    console.error(`mint-draw: ${platePath(line, row)} already exists. --force to redraw it.`);
    continue;
  }

  const draw = line.draw;
  if (!draw) handOver(line, row, prompt, `the ${line.id} line has no \`draw\` block — it is not drawn this way on purpose. See data/mint.json.`);

  const size = draw.sizeByFormat?.[row.format];
  if (!size) {
    handOver(line, row, prompt,
      `no size is declared for the \`${row.format}\` format in data/mint.json lines.${line.id}.draw.sizeByFormat, and the plate's proportion is what the framing arithmetic is built on — it will not be guessed.`);
  }

  const key = process.env[draw.keyEnv];
  if (!key) handOver(line, row, prompt, `${draw.keyEnv} is not set in this environment.`);

  const { min, want } = minLongSideFor(ROOT, line, row);
  if (flag('dry-run')) {
    console.log(`${row.code}  ${row.plate}\n  ${draw.model} at ${size} -> ${platePath(line, row)}\n  floor ${min} px, print ${want} px\n  ${prompt.split('\n').length} lines of prompt`);
    continue;
  }

  console.error(`mint-draw: ${row.code} — ${draw.model} at ${size}…`);
  let res;
  try {
    res = await fetch(draw.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: draw.model, prompt, size, n: 1 }),
    });
  } catch (err) {
    handOver(line, row, prompt, `could not reach ${draw.endpoint} — ${err.message}. If this is an egress policy denial, the host has to be allowed rather than worked around.`);
  }

  if (!res.ok) {
    handOver(line, row, prompt, `${draw.endpoint} answered ${res.status} ${res.statusText}.`);
  }

  const body = await res.json();
  const b64 = body?.data?.[0]?.b64_json;
  if (!b64) handOver(line, row, prompt, 'the response carried no image.');

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(b64, 'base64'));

  /* The wording that produced an accepted render is worth more than the one that
     was written — data/mint.json says so, and says where it goes. */
  const frozen = join(ROOT, draw.frozenWording ?? line.plate.frozenWording.replace('{plate}', row.plate));
  writeFileSync(frozen.replace('{plate}', row.plate), `${prompt}\n`);

  const [w, h] = size.split('x').map(Number);
  const longSide = Math.max(w, h);
  console.error(`mint-draw: wrote ${platePath(line, row)} at ${size}` +
    (longSide < min ? ` — UNDER the ${min} px floor this line needs` : longSide < want ? ` — clears the ${min} px floor, under the ${want} px print target` : ''));
  console.error(`Next: node tools/mint-queue.mjs — ${row.code} should be at ${line.aim.step}.`);
}
