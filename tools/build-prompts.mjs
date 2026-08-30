#!/usr/bin/env node
/**
 * build-prompts - write the house style into every brief.
 *
 * The style an artist is handed used to be copied by hand into ten prompt files
 * and into docs/art/07-ai-agent-brief.md. Eleven copies of one paragraph is a
 * promise that they will disagree, and they did: every copy described a flat
 * woodcut, and not one accepted plate in docs/art/renders/ is one. The words
 * were followed and the pictures came back flat.
 *
 * So the style is declared once, in data/artstyle.json, and this writes it into
 * the two generated blocks of each brief - `## Shared preamble` and
 * `## Negative prompt`. Everything else in a prompt file is hand-written and is
 * never touched: the intro prose, the framing block, and every per-card section.
 *
 *   node tools/build-prompts.mjs           regenerate
 *   node tools/build-prompts.mjs --check   fail if any block has drifted
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const WIDTH = 72;

const style = JSON.parse(readFileSync(join(ROOT, 'data/artstyle.json'), 'utf8'));

/** Greedy wrap, so a generated block reads like the hand-written ones around it. */
const wrap = (text, width = WIDTH) => {
  const out = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) { out.push(line); line = word; } else { line = next; }
  }
  if (line) out.push(line);
  return out.join('\n');
};

/** The preamble an artist is handed for one register. */
export function preambleFor(register) {
  const house = register.house ?? style.house;
  const paras = [];
  for (const p of house.line) paras.push(p.replace('{plate}', register.plate ?? ''));
  /* A register with no palette states its own colour rule in its composition -
     the talisman's one violet - so the house colour paragraph is skipped rather
     than contradicted. */
  if (house.colour && (register.house || register.palette)) {
    paras.push(house.colour.replace('{palette}', register.palette ?? ''));
  }
  paras.push(...register.composition, register.closing);
  return paras.map((p) => wrap(p)).join('\n\n');
}

/** The negative prompt for one register: the shared list, then its own. */
export function negativeFor(register) {
  const seen = new Set();
  const terms = [...style.negative.shared, ...register.negative].filter((t) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return wrap(terms.join(', '));
}

/**
 * Replace the fenced block that follows a heading. Finds it exactly the way
 * tools/lib/mint.mjs briefFor does, so what this writes is what the mint reads.
 */
function replaceBlock(text, headingTest, body, where) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith('## ') && headingTest.test(l.slice(3).trim()));
  if (start < 0) throw new Error(`${where}: no heading matching ${headingTest}`);
  let open = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break;
    if (lines[i].startsWith('```')) { open = i; break; }
  }
  if (open < 0) throw new Error(`${where}: heading at line ${start + 1} has no fenced block`);
  const close = lines.findIndex((l, i) => i > open && l.startsWith('```'));
  if (close < 0) throw new Error(`${where}: unterminated fence at line ${open + 1}`);
  return [...lines.slice(0, open + 1), ...body.split('\n'), ...lines.slice(close)].join('\n');
}

const targets = style.registers.map((r) => ({
  path: `docs/art/prompts/${r.id}.md`,
  preamble: /^shared preamble/i,
  negative: /^negative prompt/i,
  register: r,
}));

/* The agent brief carries the same two blocks and is where every copy came from,
   so it is generated too rather than left as an eleventh version of the truth.
   It is generic, so it borrows the characters register's plate phrase and the
   shared negative alone. */
const generic = style.registers.find((r) => r.id === 'characters');
targets.push({
  path: 'docs/art/07-ai-agent-brief.md',
  preamble: /^prompt preamble/i,
  negative: /^negative prompt/i,
  register: { ...generic, plate: 'a plate from an illustrated book', composition: [], negative: [] },
});

let changed = 0;
for (const t of targets) {
  const path = join(ROOT, t.path);
  const before = readFileSync(path, 'utf8');
  let after = replaceBlock(before, t.preamble, preambleFor(t.register), t.path);
  after = replaceBlock(after, t.negative, negativeFor(t.register), t.path);
  if (after === before) continue;
  changed++;
  if (CHECK) console.error(`  ${t.path} — the generated blocks have drifted from data/artstyle.json`);
  else writeFileSync(path, after);
}

if (CHECK) {
  if (changed) {
    console.error(`\nbuild-prompts --check: ${changed} file(s) out of date. Run: node tools/build-prompts.mjs`);
    process.exit(1);
  }
  console.log(`build-prompts --check: ${targets.length} files, all current`);
} else {
  console.log(`build-prompts: ${targets.length} files, ${changed} rewritten`);
}
