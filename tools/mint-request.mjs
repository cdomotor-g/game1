#!/usr/bin/env node
/**
 * The commission for one subject, assembled and ready to paste.
 *
 * docs/MINT.md says the artist should never have to build a prompt out of three
 * files, and that the prompt goes into the handover IN FULL rather than as a
 * link. That was a rule somebody had to follow by hand: open the deck's prompt
 * file, find the section, paste the preamble in over [PREAMBLE], remember the
 * negative prompt, look up where the plate is meant to be saved. Six steps, and
 * the one that gets skipped is always the aim block.
 *
 * So it is a tool. The repository already knows every part of it - the brief is
 * in docs/art/prompts/, the plate id is on the deck, the save path and the size
 * come off the line - and the queue already knows which subjects are waiting.
 *
 * Usage:
 *   node tools/mint-request.mjs MOD-01              one subject, by card code
 *   node tools/mint-request.mjs modification-iron-ram   or by plate id
 *   node tools/mint-request.mjs --deck modifications    every one of a deck at DRAW
 *   node tools/mint-request.mjs --all                   every subject at DRAW
 *   node tools/mint-request.mjs MOD-01 --prompt-only    just the prompt, no header
 *   node tools/mint-request.mjs MOD-01 --render        the prompt an IMAGE MODEL should get
 *
 * --render is not a formatting option, it is a different prompt. A commission is
 * written for a person and carries blocks they read as instructions about the
 * job; a model cannot tell an instruction from a subject and draws them. See
 * renderPrompt in tools/lib/mint.mjs.
 *
 * A deck is one artist session: docs/MINT-SETUP.md asks for one subject per
 * message so the style cannot drift, so --deck prints them in order, separated,
 * to be sent one at a time rather than in a heap.
 */
import { survey, platePath, briefFor, assemble, renderPrompt, minLongSideFor, windowNote, at } from './lib/mint.mjs';
import { envelopeNote } from './lib/tiles.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const valueOf = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? null : args[i + 1]; };
const targets = args.filter((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--deck');

const ROOT = process.cwd();
const promptOnly = flag('prompt-only');
const render = flag('render');
/* --json: the same commission as a machine reads it - both prompts, the plate
   id, where it goes, the page shape and the derived pixel floor - one object per
   subject, so a courier does not have to scrape any of it out of markdown. */
const asJson = flag('json');

const found = survey(ROOT);

/* Every subject the mint knows, with the line it belongs to, so a bare code can
   be resolved without the caller saying which line it is on. */
const all = found.lines.flatMap((e) => (e.shelved ? [] : e.rows.map((row) => ({ line: e.line, row }))));

function pick() {
  if (flag('all')) return all.filter(({ row }) => row.step === 'draw');
  const deck = valueOf('deck');
  if (deck) {
    const hits = all.filter(({ row }) => row.group.toLowerCase() === deck.toLowerCase() && row.step === 'draw');
    if (!hits.length) die(`no subjects of \`${deck}\` are waiting on art. Decks: ${[...new Set(all.map((a) => a.row.group))].join(', ')}`);
    return hits;
  }
  if (!targets.length) die('name a card code, a plate id, --deck <name> or --all.');
  return targets.map((t) => {
    const hit = all.find(({ row }) => row.code.toLowerCase() === t.toLowerCase() || row.plate === t);
    if (!hit) die(`\`${t}\` is not a subject the mint knows. Run node tools/mint-queue.mjs to see what is.`);
    return hit;
  });
}

function die(msg) {
  console.error(`mint-request: ${msg}`);
  process.exit(1);
}

/** What the format line has to tell an artist: shape, and how many pixels. */
function formatLine(line, row) {
  const { min, want, from } = minLongSideFor(ROOT, line, row);
  const shape = row.format ?? line.plate.format ?? 'as the line declares';
  if (!min) return shape;
  return `${shape}, at least ${min} px on the long side (${from}); ${want} px if you can, which is what it would take to print`;
}

const chosen = pick();
let warned = 0;

if (asJson) {
  const out = chosen.map(({ line, row }) => {
    const brief = briefFor(ROOT, line.brief.dir, row.briefFile ?? line.brief.file, row.plate);
    if (!brief) die(`${row.code}: no \`## ${row.plate}\` section in ${line.brief.dir}/${row.briefFile ?? line.brief.file}. It is at step WRITE, not DRAW.`);
    const corner = line.id === 'buildingtiles' && row.tile?.cells ? envelopeNote(row.tile.cells, 1, { figures: false }) : null;
    const r = renderPrompt(brief, { cornerNote: corner });
    const { min, want, from } = minLongSideFor(ROOT, line, row);
    const carriesCut = /^(WINDOW|LABEL BAND)\./m.test(brief.subject);
    return {
      line: line.id,
      code: row.code,
      name: row.name,
      plate: row.plate,
      step: row.step,
      saveTo: platePath(line, row),
      inboxBranch: `plate/${row.plate}`,
      format: row.format ?? line.plate.format ?? null,
      pixels: { minLongSide: min || null, wantLongSide: want || null, from },
      commission: assemble(brief, carriesCut ? null : windowNote(ROOT, line, row)),
      render: { positive: r.positive, negative: r.negative, moved: r.moved },
    };
  });
  console.log(JSON.stringify(chosen.length === 1 ? out[0] : out, null, 2));
  process.exit(0);
}

chosen.forEach(({ line, row }, i) => {
  const brief = briefFor(ROOT, line.brief.dir, row.briefFile ?? line.brief.file, row.plate);
  if (!brief) die(`${row.code}: no \`## ${row.plate}\` section in ${line.brief.dir}/${row.briefFile ?? line.brief.file}. It is at step WRITE, not DRAW.`);

  if (!brief.aimBlock) {
    console.error(`mint-request: ${row.code} has no ${line.aim.step} block. ${line.aim.contract} says what one has to say; without it the crop is pot luck.`);
    warned++;
  }

  /* With the window note, exactly as tools/mint-draw.mjs sends it. The artist
     reading this in a chat and the image model reading it over the wire are
     being commissioned for the same plate; a request that left out how much of
     the page survives the crop would be commissioning a different one. */
  if (render) {
    /* What the piece keeps of its page, in numbers, said as a thing to draw.
       This used to be one hardcoded sentence about the lower-left corner, which
       is the half of the composition that never went wrong. The half that did -
       how big the subject may be before the die cuts it - was not said at all,
       and was guessed at per tile by whoever wrote the brief. It is derived from
       the footprint now, by envelopeNote in tools/lib/tiles.mjs, so a shape that
       changes changes what its brief asks for. */
    const corner = line.id === 'buildingtiles' && row.tile?.cells
      ? envelopeNote(row.tile.cells, 1, { figures: false })
      : null;
    const r = renderPrompt(brief, { cornerNote: corner });
    console.log(`### RENDER PROMPT · ${row.code} · ${row.name}`);
    console.log(`\n**save to**  ${platePath(line, row)}`);
    console.log(`**format**   ${row.format}\n`);
    console.log('POSITIVE\n```text\n' + r.positive + '\n```\n');
    console.log('NEGATIVE\n```text\n' + r.negative + '\n```\n');
    console.log(`Moved out of the positive, because a model draws what it is told:\n  ${r.moved.join('\n  ')}`);
    if (i < chosen.length - 1) console.log('\n' + '─'.repeat(72) + '\n');
    return;
  }

  /* The tile briefs now carry their own WINDOW and LABEL BAND, written in by
     tools/build-prompts.mjs so an artist reading the FILE gets them too. Only
     append the computed note where the brief has not already got one, or the
     commission says everything twice. */
  const carriesCut = /^(WINDOW|LABEL BAND)\./m.test(brief.subject);
  const prompt = assemble(brief, carriesCut ? null : windowNote(ROOT, line, row));
  if (promptOnly) {
    console.log(prompt);
    if (i < chosen.length - 1) console.log('\n' + '─'.repeat(72) + '\n');
    return;
  }

  console.log(`### ${found.mint.handover.prefixes.request} · ${row.code} · ${row.name}

**line**     ${line.id}
**plate id** \`${row.plate}\`
**save to**  \`${platePath(line, row)}\`
**format**   ${formatLine(line, row)}
**brief**    ${brief.file} § ${row.plate}

\`\`\`text
${prompt}
\`\`\`

Reply with \`${found.mint.handover.prefixes.ready} · ${row.code}\` when it is pushed. If the wording had to
change to get an acceptable render, say so and send back what you actually used.`);

  if (i < chosen.length - 1) console.log('\n' + '─'.repeat(72) + '\n');
});

if (!promptOnly) {
  const n = chosen.length;
  console.error(`\nmint-request: ${n} commission${n === 1 ? '' : 's'}${warned ? `, ${warned} with no aim block` : ''}.`);
  if (n > 1) console.error('Send them one at a time — docs/MINT-SETUP.md §6, style drifts inside a session.');
}
