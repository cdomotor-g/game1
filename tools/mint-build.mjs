#!/usr/bin/env node
/**
 * The build a landing plate actually needs.
 *
 * `CLAUDE.md` lists nineteen tools to run before pushing, in an order that
 * matters in five places, and that list is right: it is what a change to the
 * DATA needs. A plate landing is not a change to the data. It cannot move a
 * price band, redraw an element mark, regrow a map or alter a word of the
 * rulebook, and running the tools that do those things costs a minute and
 * proves nothing.
 *
 * What a plate does touch is seven things, and they still have an order:
 * build-cards and build-tiles before validate-framing, because the windows that
 * check measures against are read off the built artefacts; mint-queue before
 * build-mint, because the queue is the mint page's third section.
 *
 *   node tools/mint-build.mjs              # the chain
 *   node tools/mint-build.mjs MON-05       # and proof the cards named
 *   node tools/mint-build.mjs hut pasture  # or the tiles named
 *
 * A subject is proofed by whichever tool knows how to photograph it, and which
 * one that is comes from the mint rather than from the shape of the argument -
 * a card code and a tile id are both just ids, and guessing from a hyphen would
 * be wrong the first time somebody names a tile MON-something.
 *
 * Anything that stops with a non-zero exit stops the chain: a build that carried
 * on past a failed validate would be a build whose output nobody can trust.
 *
 * If you have edited anything under data/, this is NOT the list you want. Run
 * the one at the foot of CLAUDE.md.
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CHAIN = [
  ['validate-data.mjs', [], 'referential integrity'],
  ['build-data.mjs', [], 'the web bundle the explorer reads'],
  ['build-cards.mjs', [], 'docs/cards/ — must precede validate-framing'],
  ['build-tiles.mjs', [], 'docs/tiles/ — must precede validate-framing, same reason'],
  ['validate-framing.mjs', [], 'every crop against its deck\'s current window'],
  ['mint-queue.mjs', [], 'docs/art/mint/QUEUE.md — must precede build-mint'],
  ['build-mint.mjs', [], 'the mint page, whose third section is the queue'],
  ['validate-art.mjs', [], 'palette and layer contract'],
];

const codes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const quiet = process.argv.includes('--quiet');

let failed = null;
for (const [tool, args, why] of CHAIN) {
  if (!quiet) console.log(`\n\x1b[1m· ${tool}\x1b[0m  ${why}`);
  const run = spawnSync(process.execPath, [join(ROOT, 'tools', tool), ...args], {
    stdio: quiet ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    cwd: ROOT,
  });
  if (run.status !== 0) { failed = tool; break; }
}

if (failed) {
  console.error(`\nmint-build: ${failed} failed. The chain stopped there — nothing after it has run.`);
  process.exit(1);
}

/* The proof is not part of the build and nothing depends on it, which is why it
   comes after the chain has passed rather than inside it: a photograph of a card
   that did not build is not worth taking. */
if (codes.length) {
  /* Which prover an id belongs to is asked of the mint, not inferred: it already
     enumerates every subject on every line, so it is the only thing that knows. */
  const { survey } = await import('./lib/mint.mjs');
  const found = survey(ROOT);
  const lineOf = (code) => found.lines.find((e) => e.rows.some((r) => r.code === code))?.line.id;
  const PROVER = { buildingtiles: 'tools/tile-proof.mjs' };

  const byTool = new Map();
  for (const code of codes) {
    const tool = PROVER[lineOf(code)] ?? 'tools/card-proof.mjs';
    if (!byTool.has(tool)) byTool.set(tool, []);
    byTool.get(tool).push(code);
  }

  for (const [tool, list] of byTool) {
    console.log(`\n\x1b[1m· ${tool.replace('tools/', '')}\x1b[0m  ${list.join(', ')}`);
    const run = spawnSync(process.execPath, [join(ROOT, tool), ...list], { stdio: 'inherit', cwd: ROOT });
    if (run.status !== 0) {
      console.error('\nmint-build: the chain passed; only the proof failed. That is a browser, not a build.');
      process.exit(1);
    }
  }
}

console.log('\nmint-build: chain clean.' + (codes.length
  ? ' Look at the proof before you commit it.'
  : ' Add a card code or a tile id to proof one.'));
