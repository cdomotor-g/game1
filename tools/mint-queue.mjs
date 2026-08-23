#!/usr/bin/env node
/**
 * The mint queue: every subject the mint has declared that is not a finished
 * artefact yet, and whose turn it is to do something about it.
 *
 * The mint is a multi-tool. `data/mint.json` declares one LINE per kind of thing
 * that goes designer -> artist -> build - cards, maps, and tiles while they are
 * shelved - and every line is minted in the same four steps:
 *
 *   1. WRITE   the subject exists in data/ and has no brief. The designer writes
 *              one into the line's prompt file, under the plate's own id.
 *   2. DRAW    the brief exists and there is no plate. The artist renders it and
 *              commits it to the line's plate directory.
 *   3. AIM     the plate exists and nothing in data/ says how to read it. For a
 *              card that is a framing entry; for a map it is the board traced off
 *              the plate. Same step, two contracts.
 *   4. MINTED  all three, and the build tools draw the thing.
 *
 * Which step a subject is on is a fact about the repository, not an opinion, so
 * it is computed rather than tracked. There is no board and no ticket that can go
 * stale: add the data and the subject appears here at WRITE; commit the PNG and
 * it moves to AIM by itself.
 *
 * Writes docs/art/mint/QUEUE.md - the worklist, committed like every other
 * generated file so it can be read on the site and linked from a pull request.
 *
 * Usage: node tools/mint-queue.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { survey, at, minLongSideFor } from './lib/mint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs', 'art', 'mint');
const OUT = join(OUT_DIR, 'QUEUE.md');
const checkOnly = process.argv.includes('--check');

const { mint, lines, problems, notes } = survey(ROOT);
const active = lines.filter((l) => !l.shelved);
const shelved = lines.filter((l) => l.shelved);

const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

/* ------------------------------------------------------------------- report */

/** One step's table, for one line. The columns are the three probes, in order. */
function section(entry, step, heading, blurb) {
  const list = at(entry, step);
  const n = STEP_NUMBER[step];
  if (!list.length) return `### ${n} · ${heading}\n\nNothing waiting.\n`;

  /* ✓ aimed. ~ aimed, but not fully - a card with a subject box and no focal
     point is framed and not aimed. · nothing yet. */
  const tick = (r) => (!r.hasAim ? '·' : entry.line.id === 'cards' && !r.aimExtra.focal ? '~' : '✓');

  const row = (r) =>
    `| \`${r.code}\` | ${r.name} | ${r.group} | \`${r.plate}\` | ` +
    `${r.hasBrief ? '✓' : '·'} | ${r.hasPlate ? '✓' : '·'} | ${tick(r)} |`;

  return (
    `### ${n} · ${heading} — ${plural(list.length, entry.line.unit)}\n\n${blurb}\n\n` +
    `| Code | ${cap(entry.line.unit)} | ${entry.line.groupLabel} | Plate | brief | plate | ${entry.line.aim.step.toLowerCase()} |\n` +
    '| --- | --- | --- | --- | :-: | :-: | :-: |\n' +
    list.map(row).join('\n') +
    '\n'
  );
}

/* The pixel floor is derived per line and, for maps, per subject - see
   minLongSideFor in tools/lib/mint.mjs. Asking a line for one number is only
   meaningful where every subject on it shares one, which cards do and maps
   do not, so the blurb reports the first row's and says where it came from. */
function sizeAsk(entry) {
  const row = at(entry, 'draw')[0] ?? entry.rows[0];
  const { min, want, from } = minLongSideFor(ROOT, entry.line, row);
  if (!min) return 'at whatever size the line asks for';
  return `at least ${min} px on the long side (${from})` + (want ? `, ${want} px if it can be had` : '');
}

const STEP_NUMBER = { write: '1', draw: '2', aim: '3' };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function lineReport(entry) {
  const { line } = entry;
  const minted = at(entry, 'minted');
  const total = entry.rows.length;

  const head =
    `## ${line.name}\n\n` +
    `${line.subject[0].toUpperCase()}${line.subject.slice(1)}. ` +
    `Briefs in ${briefLink(line)}, plates in \`${line.plate.dir}/\`, ` +
    `aimed by **${line.aim.step}** in \`${line.aim.file}\`.\n\n` +
    `**${minted.length} of ${total} minted.** ` +
    `${at(entry, 'write').length} waiting on a brief, ${at(entry, 'draw').length} waiting on art, ` +
    `${at(entry, 'aim').length} waiting on ${line.aim.step.toLowerCase()}.\n`;

  const write = section(
    entry, 'write', 'WRITE — the designer',
    `These exist in the data with no brief. Write one into \`${line.brief.dir}/\` under the plate id, ` +
      `following the shared preamble at the top of that file and the contract in \`${line.aim.contract}\`.`
  );
  const draw = section(
    entry, 'draw', 'DRAW — the artist',
    `The brief is written and there is no plate. Generate it at **${line.plate.format ?? 'the deck’s declared format'}**, ` +
      `${sizeAsk(entry)}, check it against the acceptance checklist in ` +
      `[\`../07-ai-agent-brief.md\`](../07-ai-agent-brief.md), and commit \`${line.plate.dir}/<plate>${line.plate.ext}\`.`
  );
  const aim = section(
    entry, 'aim', `${line.aim.step} — ${line.aim.owner}`,
    `The plate is committed and \`${line.aim.file}\` says nothing about it yet. ${line.aim.produces[0].toUpperCase()}${line.aim.produces.slice(1)} — ` +
      `the contract is [\`${line.aim.contract}\`](${contractLink(line.aim.contract)}).`
  );

  const mintedList = minted.map((r) => `\`${r.code}\``).join(', ') || 'none yet';
  const noFocal =
    line.id === 'cards' ? entry.rows.filter((r) => r.hasAim && r.aimExtra.focal === false) : [];

  const tail =
    `### Minted\n\n${plural(minted.length, line.unit)} complete: ${mintedList}.\n` +
    (noFocal.length
      ? `\n${noFocal.length} of them are framed but have no \`focal\` point — they predate it and are not broken, ` +
        `they are just aimed at the middle of their subject box. Adding one is a two-number improvement: ` +
        `${noFocal.map((r) => `\`${r.plate}\``).join(', ')}.\n`
      : minted.length
        ? `\nEvery minted ${line.unit} is fully aimed: ${line.aim.produces}.\n`
        : '') +
    (entry.generated?.length
      ? `\n### Generated, not commissioned\n\nDrawn by a tool from its own data, so there is no handover to track and no ` +
        `step anybody is waiting on. It is reported here every run rather than disappearing, the same way a shelved line is: ` +
        `a decision with a reason attached is not an absence. Run \`node tools/draw-map.mjs <id>\` to regrow one, and set ` +
        `\`plate.kind\` back to \`"drawn"\` to put it back in the worklist above.\n\n` +
        `| ${cap(line.unit)} | Grid | Plate |\n| --- | --- | --- |\n` +
        entry.generated.map((g) => `| ${g.name} | ${g.grid} | \`${g.plate}\` |`).join('\n') + '\n'
      : '') +
    (entry.deferred.length
      ? `\n### Not being minted yet\n\nDeclared, numbered, backed — and simply not being illustrated this round. ` +
        `Set \`minting: true\` on one to bring it into the queue above.\n\n` +
        `| Deck | ${cap(line.unit)}s in the data | Plate format |\n| --- | --: | --- |\n` +
        entry.deferred.map((d) => `| ${d.name} | ${d.count} | ${d.format} |`).join('\n') + '\n'
      : '');

  return `${head}\n${write}\n${draw}\n${aim}\n${tail}`;
}

/** Where this line's briefs are: one file, or one per deck. */
function briefLink(line) {
  return line.brief.file
    ? `[\`${line.brief.dir}/${line.brief.file}\`](../prompts/${line.brief.file})`
    : `[\`${line.brief.dir}/\`](../prompts/), one file per deck`;
}

/** docs/art/mint/QUEUE.md -> a path that resolves from docs/art/mint/. */
function contractLink(path) {
  if (path.startsWith('docs/art/')) return `../${path.slice('docs/art/'.length)}`;
  if (path.startsWith('docs/')) return `../../${path.slice('docs/'.length)}`;
  return `../../../${path}`;
}

const totals = active.map((e) => {
  const minted = at(e, 'minted').length;
  return `${e.line.name.toLowerCase()} ${minted}/${e.rows.length}`;
});

const body = `# The mint queue

<!-- GENERATED by tools/mint-queue.mjs. Do not edit: run the tool. -->

Every subject the mint has declared that is not a finished artefact yet, and
whose turn it is. The mint is a multi-tool: one **line** per kind of thing that
goes designer → artist → build, declared in
[\`../../../data/mint.json\`](../../../data/mint.json), and every line runs the
same four steps. Who owns each one, and the handover that carries it, are in
[\`../../MINT.md\`](../../MINT.md); how to set the two agents up is in
[\`../../MINT-SETUP.md\`](../../MINT-SETUP.md).

Nothing here is tracked by hand. A subject's step is worked out from what is in
the repository — the brief, the plate, the entry that ties the two to the data —
so this file cannot disagree with the truth, only be out of date, and \`--check\`
catches that in CI.

**${totals.join(' · ')}**

${notes.length ? `${notes.map((n) => `> **Note.** ${n}`).join('\n\n')}\n` : ''}
${problems.length ? `## Contract problems — ${plural(problems.length, 'thing')} to fix\n\nThese are not missing work, they are broken contracts: something the mint requires\nbefore a subject can be handed over, that is not there. \`data/mint.json\` says what\neach line requires and \`tools/lib/mint.mjs\` checks it.\n\n${problems.map((p) => `- ${p}`).join('\n')}\n` : ''}
${active.map(lineReport).join('\n---\n\n')}
---

## Shelved lines

Declared, reported here every run, and chased by nobody. A shelved line is a
decision with a reason attached, not an absence — which is why it prints rather
than disappearing.

${shelved
  .map(
    (e) =>
      `### ${e.line.name} — shelved, [#${e.line.issue}](${e.line.issueUrl})\n\n` +
      `${e.line.shelvedNote}\n\n**It comes back when:**\n\n` +
      e.line.whenItReturns.map((w) => `- ${w}`).join('\n') +
      `\n\n**What already exists, and stays:**\n\n` +
      e.line.existingWork.map((w) => `- ${w}`).join('\n') +
      '\n'
  )
  .join('\n')}`;

/* ------------------------------------------------------------------ output */

if (checkOnly) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* absent is stale */ }
  if (current !== body) {
    console.error('docs/art/mint/QUEUE.md is stale. Run: node tools/mint-queue.mjs');
    process.exit(1);
  }
  console.log(`docs/art/mint/QUEUE.md is up to date (${totals.join(', ')})`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT, body, 'utf8');
  console.log(`wrote docs/art/mint/QUEUE.md — ${totals.join(', ')}`);
  for (const entry of active) {
    for (const step of ['write', 'draw', 'aim']) {
      const list = at(entry, step);
      if (!list.length) continue;
      const owner = step === 'aim' ? entry.line.aim.owner : mint.steps[step].owner;
      console.log(`  ${entry.line.id.padEnd(6)} ${step.padEnd(5)} (${owner}): ${list.map((r) => r.code).join(', ')}`);
    }
  }
  for (const entry of shelved) console.log(`  ${entry.line.id.padEnd(6)} shelved — see issue #${entry.line.issue}`);
  for (const entry of lines) {
    for (const g of entry.generated ?? []) {
      console.log(`  ${entry.line.id.padEnd(6)} drawn by tools/draw-map.mjs: ${g.id} (${g.grid}) — generated, not commissioned`);
    }
  }
  for (const n of notes) console.log(`  note: ${n}`);
  for (const p of problems) console.warn(`  problem: ${p}`);
  if (problems.length) console.warn(`  ${problems.length} contract problem(s) — the queue lists them under "Contract problems".`);
}
