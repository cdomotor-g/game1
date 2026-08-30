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
import { survey } from './lib/mint.mjs';

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
  /* First, because it is the one an artist has actually got wrong: handed a brief
     for a card, it drew the card. A register with its own house block is a
     different medium and states its own rules. */
  if (!register.house && style.house.notACard) paras.push(style.house.notACard);
  for (const p of house.line) paras.push(p.replace('{plate}', register.plate ?? ''));
  /* A register with no palette states its own colour rule in its composition -
     the talisman's one violet - so the house colour paragraph is skipped rather
     than contradicted. */
  if (house.colour && (register.house || register.palette)) {
    paras.push(house.colour.replace('{palette}', register.palette ?? ''));
  }
  if (!register.house && style.house.tone) paras.push(style.house.tone);
  paras.push(...register.composition, register.closing);
  return paras.map((p) => wrap(p)).join('\n\n');
}

/** The negative prompt for one register: the shared list, then its own. */
export function negativeFor(register) {
  const seen = new Set();
  const plateTerms = register.house ? [] : (style.negative.plates ?? []);
  const terms = [...style.negative.shared, ...plateTerms, ...register.negative].filter((t) => {
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

/**
 * What every plate on the cards, tiles and maps lines has got to, worked out from
 * the repository the way tools/mint-queue.mjs does it. Nothing is stored: commit a
 * PNG and the marker under that brief flips by itself on the next run.
 */
function stepsByPlate() {
  const steps = new Map();
  for (const entry of survey(ROOT).lines) {
    if (entry.shelved) continue;
    const generated = new Set(entry.generated ?? []);
    for (const row of entry.rows) steps.set(row.plate, { step: row.step, generated: generated.has(row.code) });
  }
  return steps;
}

/* One line, in the artist's line of sight - directly under the heading it is about,
   which is where the decision to draw gets made. An artist pointed at this
   repository picked up `monster-cinder-wolf`, drew it, and it had been accepted
   weeks earlier: the section looked exactly like an unfinished one. */
function markerFor(plate, state) {
  const path = `docs/art/renders/${plate}.png`;
  if (!state) return null;
  if (state.step === 'write') return null;
  if (state.step === 'draw') {
    return state.generated
      ? `> 🛠 **NOT FOR AN ARTIST.** This plate is drawn by \`tools/draw-item.mjs\` from the card's own parts. Do not draw it by hand.`
      : `> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as \`${path}\`.`;
  }
  return `> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** \`${path}\` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.`;
}

/**
 * Write the marker under every `## <plate-id>` heading in one file, replacing
 * whatever marker was there. The slot is owned by this tool: a blockquote between
 * a brief's heading and its fence is always generated, never hand-written.
 */
function markSections(text, steps) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!lines[i].startsWith('## ')) continue;
    const plate = lines[i].slice(3).trim().split(' ')[0];
    if (!steps.has(plate)) continue;
    /* Skip past the old marker and its blank lines, then lay down the new one. */
    let j = i + 1;
    while (j < lines.length && (lines[j].trim() === '' || lines[j].trim().startsWith('>'))) j++;
    const marker = markerFor(plate, steps.get(plate));
    if (marker) out.push('', marker);
    out.push('');
    i = j - 1;
  }
  return out.join('\n');
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

const steps = stepsByPlate();

let changed = 0;
for (const t of targets) {
  const path = join(ROOT, t.path);
  const before = readFileSync(path, 'utf8');
  let after = replaceBlock(before, t.preamble, preambleFor(t.register), t.path);
  after = replaceBlock(after, t.negative, negativeFor(t.register), t.path);
  if (t.register.id) after = markSections(after, steps);
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
