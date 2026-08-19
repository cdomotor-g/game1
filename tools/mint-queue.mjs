#!/usr/bin/env node
/**
 * The mint queue: every card that exists in the data and does not yet exist as a
 * card, and whose turn it is to do something about it.
 *
 * A card is minted in four steps, and each one is a different pair of hands
 * (docs/CARD-MINT.md):
 *
 *   1. WRITE    the card exists in data/ but has no brief. The designer writes
 *               one into docs/art/prompts/<deck>.md under the plate's own id.
 *   2. DRAW     the brief exists but there is no plate. The artist renders it and
 *               commits docs/art/renders/<plate>.png.
 *   3. FRAME    the plate exists but docs/art/framing.json says nothing about it,
 *               so it would be cropped on the middle of the page.
 *   4. MINTED   all three, and tools/build-cards.mjs draws the card.
 *
 * Which step a card is on is a fact about the repository, not an opinion, so it
 * is computed rather than tracked. There is no board and no ticket that can go
 * stale: add the data and the card appears here at WRITE; commit the PNG and it
 * moves to FRAME by itself.
 *
 * Writes docs/art/mint/QUEUE.md - the worklist, committed like every other
 * generated file so it can be read on the site and linked from a pull request.
 *
 * Usage: node tools/mint-queue.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { plateIdFor } from './lib/plates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');
const PROMPTS = join(ROOT, 'docs', 'art', 'prompts');
const OUT_DIR = join(ROOT, 'docs', 'art', 'mint');
const OUT = join(OUT_DIR, 'QUEUE.md');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const components = read('components.json');
const framing = JSON.parse(readFileSync(join(ROOT, 'docs/art/framing.json'), 'utf8'));

/**
 * The cards of one deck, whatever file they live in and whatever they are called
 * in it. A deck names its source; this is the one place that knows how to open
 * one, and it is deliberately dull.
 */
function cardsOf(deck) {
  const file = read(deck.source);
  const pick = {
    characters: () => file.characters,
    vehicles: () => file.vehicles,
    monsters: () => file.monsters,
    talismans: () => file.items.filter((i) => i.class === 'talisman'),
    modifications: () => file.modifications,
    spells: () => file.spells,
    events: () => file.cards,
    quests: () => file.quests,
    items: () => file.items.filter((i) => i.class !== 'talisman'),
  }[deck.id];
  if (!pick) throw new Error(`mint-queue does not know how to read the ${deck.id} deck`);
  return (pick() || []).filter((c) => c.cardCode);
}

/** Which plate ids a deck's prompt file already briefs. */
const briefCache = new Map();
function briefed(deck) {
  if (!briefCache.has(deck.promptFile)) {
    const path = join(PROMPTS, deck.promptFile);
    const ids = new Set();
    if (existsSync(path)) {
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        const m = /^##\s+([a-z0-9][a-z0-9-]*)\s*(?:—|-|$)/.exec(line.trim());
        if (m) ids.add(m[1]);
      }
    }
    briefCache.set(deck.promptFile, ids);
  }
  return briefCache.get(deck.promptFile);
}

const STEPS = ['write', 'draw', 'frame', 'minted'];
const rows = [];
const deferred = [];

for (const deck of components.decks) {
  const cards = cardsOf(deck);
  if (!deck.minting) { deferred.push({ deck, count: cards.length }); continue; }
  for (const card of cards) {
    const plate = plateIdFor(deck, card);
    const hasBrief = briefed(deck).has(plate);
    const hasPlate = existsSync(join(RENDERS, `${plate}.png`));
    const entry = framing.plates[plate];
    const step = !hasBrief && !hasPlate ? 'write' : !hasPlate ? 'draw' : !entry ? 'frame' : 'minted';
    rows.push({
      deck, card, plate, step,
      hasBrief, hasPlate,
      hasFraming: !!entry,
      hasFocal: !!(entry && entry.focal),
    });
  }
}

const at = (step) => rows.filter((r) => r.step === step);
const owner = { write: 'designer', draw: 'artist', frame: 'whoever accepts the plate', minted: '—' };

/* ------------------------------------------------------------------- report */

const bar = (n, of) => (of ? `${n} of ${of}` : '0');
const line = (r) =>
  `| \`${r.card.cardCode}\` | ${r.card.name} | ${r.deck.name} | \`${r.plate}\` | ` +
  `${r.hasBrief ? '✓' : '·'} | ${r.hasPlate ? '✓' : '·'} | ${r.hasFraming ? (r.hasFocal ? '✓' : '~') : '·'} |`;

const section = (step, title, blurb) => {
  const list = at(step);
  if (!list.length) return `### ${title}\n\nNothing waiting.\n`;
  return `### ${title} — ${list.length} card${list.length === 1 ? '' : 's'}\n\n${blurb}\n\n` +
    '| Code | Card | Deck | Plate | brief | plate | framed |\n| --- | --- | --- | --- | :-: | :-: | :-: |\n' +
    list.map(line).join('\n') + '\n';
};

const noFocal = rows.filter((r) => r.hasFraming && !r.hasFocal);

const body = `# The mint queue

<!-- GENERATED by tools/mint-queue.mjs. Do not edit: run the tool. -->

Every card that exists in \`data/\` and does not yet exist as a card, and whose
turn it is. The four steps and who owns each one are in
[\`../../CARD-MINT.md\`](../../CARD-MINT.md); the framing rules are in
[\`../09-framing-and-composition.md\`](../09-framing-and-composition.md).

Nothing here is tracked by hand. A card's step is worked out from what is in the
repository — the brief, the PNG, the framing entry — so this file cannot disagree
with the truth, only be out of date, and \`--check\` catches that in CI.

**${bar(at('minted').length, rows.length)} minted.**
${at('write').length} waiting on a brief, ${at('draw').length} waiting on art,
${at('frame').length} waiting on a framing entry.

${section('write', '1 · WRITE — the designer', 'These cards exist in the data with no brief. Write one into the deck\'s prompt file under the plate id, following the shared preamble at the top of that file and the framing block in `09-framing-and-composition.md`.')}
${section('draw', '2 · DRAW — the artist', 'The brief is written and there is no plate. Generate it, check it against the acceptance checklist in `../07-ai-agent-brief.md`, and commit `docs/art/renders/<plate>.png`.')}
${section('frame', '3 · FRAME — whoever accepts the plate', 'The plate is committed and `framing.json` says nothing about it, so the card is being cropped on the middle of the page. Add `subject`, `focal` and a one-line `note`.')}
## Minted

${at('minted').length} card${at('minted').length === 1 ? '' : 's'} complete: ${at('minted').map((r) => `\`${r.card.cardCode}\``).join(', ') || 'none yet'}.

${noFocal.length ? `${noFocal.length} of them are framed but have no \`focal\` point — they predate it and are not broken, they are just aimed at the middle of their subject box. Adding one is a two-number improvement: ${noFocal.map((r) => `\`${r.plate}\``).join(', ')}.` : 'Every minted card has both a subject box and a focal point.'}

## Not being minted yet

These decks are declared in \`data/components.json\`, numbered, and have backs —
they are simply not being illustrated this round. Set \`minting: true\` on a deck
to bring it into the queue above.

| Deck | Cards in the data | Plate format |
| --- | --: | --- |
${deferred.map((d) => `| ${d.deck.name} | ${d.count} | ${d.deck.plateFormat} |`).join('\n')}
`;

/* ------------------------------------------------------------------ output */

if (checkOnly) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* absent is stale */ }
  if (current !== body) {
    console.error('docs/art/mint/QUEUE.md is stale. Run: node tools/mint-queue.mjs');
    process.exit(1);
  }
  console.log(`docs/art/mint/QUEUE.md is up to date (${at('minted').length}/${rows.length} minted)`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, body, 'utf8');
  console.log(
    `wrote docs/art/mint/QUEUE.md — ${at('minted').length}/${rows.length} minted, ` +
      `${at('write').length} need a brief, ${at('draw').length} need art, ${at('frame').length} need framing`
  );
  for (const step of STEPS.slice(0, 3)) {
    const list = at(step);
    if (list.length) console.log(`  ${step.padEnd(6)} (${owner[step]}): ${list.map((r) => r.card.cardCode).join(', ')}`);
  }
}
