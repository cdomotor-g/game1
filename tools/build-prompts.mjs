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
import { survey, windowNote } from './lib/mint.mjs';

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
    for (const row of entry.rows) {
      steps.set(row.plate, { step: row.step, generated: generated.has(row.code), size: row.size, format: row.format });
    }
  }
  return steps;
}

/* The one sentence about pixels an artist is given, and the only place a pixel
   count appears in a brief. It is derived per subject by minLongSideFor - the
   card's safe area cut to the page's shape, at the print scale data/mint.json
   declares - so a portrait page is asked for more than a square one, and a
   figure typed into a brief's prose is refused below (typedPixelAsks). Before
   this the briefs said 2000 or 4000 px by hand, the queue said 945, and the
   artist produced 1254 and called the contract ambiguous, which it was. */
function sizeSentence(state) {
  const s = state.size;
  if (!s || !s.min) return '';
  const page = state.format ? `Page: ${state.format}. ` : '';
  return `${page}At least **${s.min} px on the long side** (${s.from}); ${s.want} px if the generator offers it. ` +
    'A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later.';
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
      : `> ✅ **WAITING — THIS ONE IS YOURS.** ${sizeSentence(state)} Deliver the finished page as \`${path}\` — see \`docs/art/AGENTS.md\` for how.`;
  }
  return `> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** \`${path}\` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.`;
}

/**
 * A pixel count typed into a brief's prose by hand.
 *
 * The figure is derived and written into the marker above; a second copy in the
 * intro is a copy that goes stale - twelve of them said 2000 or 4000 px against a
 * floor of 945 - so an ASK for a size in hand-written prose fails the build.
 * Fenced blocks and blockquotes are skipped: the marker is a blockquote and is
 * this tool's own, and a history sentence ("it arrived at 1491 px") is a fact,
 * not an ask, and is left alone. What counts as an ask is a pixel figure in the
 * same sentence as a word that asks for one.
 */
const PIXEL_ASK = /\b\d{3,5}\s*px\b/i;
const ASKING = /\b(render|deliver|generate|minimum|at least|or better|or larger|preferred|wide minimum|if you can)\b/i;
function typedPixelAsks(text, where) {
  const out = [];
  let fenced = false;
  let para = [];
  let paraStart = 0;
  const lines = text.split('\n');
  const flush = () => {
    if (!para.length) return;
    /* A sentence wraps across lines, so it is tested whole. */
    const sentences = para.join(' ').split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      if (PIXEL_ASK.test(s) && ASKING.test(s)) {
        out.push(`  ${where}:${paraStart + 1}: a pixel figure is typed into the brief - "${s.trim()}". Delete it; the marker under each heading carries the derived one.`);
      }
    }
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) { flush(); fenced = !fenced; continue; }
    if (fenced || line.trimStart().startsWith('>') || !line.trim()) { flush(); continue; }
    if (!para.length) paraStart = i;
    para.push(line);
  }
  flush();
  return out;
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

/**
 * The cut, written into the brief itself.
 *
 * `windowNote` computes what a plate loses when it is cut to its piece, and for a
 * building tile it also says where the printed name band lands. Both were only
 * ever produced by `mint-request` at commission time - so an artist reading the
 * brief FILE, which is now the whole pipeline, never learned that part of its page
 * is thrown away or that a solid band prints over one corner of it.
 *
 * Tiles only, and deliberately. A tile's note is measured off its own footprint
 * and is deterministic. A card's is read off the BUILT card in docs/cards/, so
 * writing it here would make this tool's output depend on whether build-cards had
 * run yet, and --check would pass or fail by run order. A card brief's FRAMING
 * block already names its band.
 */
function cutNoteFor(plate) {
  const hit = subjects.get(plate);
  if (!hit) return null;
  const note = windowNote(ROOT, hit.line, hit.row);
  return note ? note.trim() : null;
}

/* Strip any previously written cut note, then lay the fresh one down. The note is
   made of META paragraphs - WINDOW. and LABEL BAND. - which is the same shape
   FRAMING. already has inside a brief, and is what renderPrompt lifts back out. */
function withCutNote(body, note) {
  /* Nothing to put back means leave what is there. A card's note is measured off
     the BUILT card in docs/cards/, so a tree with none would otherwise strip every
     WINDOW block and --check would pass or fail by run order. */
  if (!note) return body;
  const kept = body.split(/\n\s*\n/).filter((p) => !/^(WINDOW|LABEL BAND)\./.test(p.trim()));
  return [...kept, note].join('\n\n');
}

/**
 * The band a card brief promises, set to the band the crop actually keeps.
 *
 * A card window is derived - it is the shape of the wordiest card in its deck -
 * so it MOVES: a card landing with a long rule re-crops every plate in that deck.
 * The figure was typed, so it did not move with it. Seven monster briefs promised
 * the middle 70% of the page against a window that keeps 48%, which is what spent
 * the tips of Vhalrik's horns.
 *
 * Only the height. A card crop keeps the full width of the page on every deck, so
 * a sentence about width is a composition choice rather than a constraint, and is
 * left alone.
 */
function withBand(body, note) {
  const real = note && note.match(/middle (\d+)% of its height/);
  if (!real) return body;
  /* No `m` flag: with it, `$` is end-of-LINE and the lazy match stops on the
     first line of the block, which is the line that never carries the figure. */
  return body.replace(/FRAMING\.[\s\S]*?(?=\n\n|$)/, (block) =>
    block.replace(/middle (\d+)%(?!\s*of\s+(?:the\s+page\s+|its\s+)?width)/g, `middle ${real[1]}%`));
}

/* How a tile's own page is said, in the two places a brief says it. Both are
   DERIVED - the footprint comes off the ground model and ladder in
   data/buildingtiles.json, and the page off the footprint's aspect - so both
   were being typed by hand against a number that moves. Twenty-five of the
   fifty-four had drifted, and an artist reading one found the heading and the
   generated WINDOW block flatly contradicting each other. */
const PAGE_IN_HEADING = { square: 'square', 'A4 landscape, 3:2': '3:2 landscape', 'A4 portrait': 'portrait' };
const PAGE_IN_FRAMING = { square: 'Square plate', 'A4 landscape, 3:2': 'Landscape 3:2', 'A4 portrait': 'A4 portrait' };
const CELL_WORD = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };

function headingFor(row) {
  const n = row.tile.cells.length;
  return `## ${row.plate} — ${CELL_WORD[n] ?? n} cell${n === 1 ? '' : 's'}, ${PAGE_IN_HEADING[row.format] ?? row.format}`;
}

/* The page phrase only. Everything after the first comma is the author's
   composition and is left exactly as written. */
function withPage(body, row) {
  const page = PAGE_IN_FRAMING[row.format];
  if (!page) return body;
  return body.replace(/^FRAMING\.\s*([^,\n]+),/m, `FRAMING. ${page},`);
}

function markCuts(text, file) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!lines[i].startsWith('## ')) continue;
    const plate = lines[i].slice(3).trim().split(' ')[0];
    const hit = subjects.get(plate);
    if (!hit) continue;
    /* A tile's heading IS its footprint and page, both derived. A card's heading
       is its name and code, which are the card's own and are checked elsewhere. */
    if (hit.line.id === 'buildingtiles') out[out.length - 1] = headingFor(hit.row);
    const note = cutNoteFor(plate);
    if (!note) continue;
    /* Walk to this section's fence and rewrite what is inside it. */
    let open = -1;
    for (let j = i + 1; j < lines.length && !lines[j].startsWith('## '); j++) {
      if (lines[j].startsWith('```')) { open = j; break; }
    }
    if (open < 0) continue;
    let close = -1;
    for (let j = open + 1; j < lines.length; j++) if (lines[j].startsWith('```')) { close = j; break; }
    if (close < 0) continue;
    out.push(...lines.slice(i + 1, open + 1));
    const inner = withCutNote(lines.slice(open + 1, close).join('\n'), note);
    out.push(...(hit.line.id === 'buildingtiles' ? withPage(inner, hit.row) : withBand(inner, note)).split('\n'));
    out.push(lines[close]);
    i = close;
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

/**
 * A brief may not name a vehicle its own data says it does not fit.
 *
 * MOD-02 Sweep Rig fits an AIRSHIP, and its brief opened "off the ship". The
 * artist read ship, then read "sweep", and drew a wheeled sailing street-sweeper
 * with a bristle roller. Every word of that was a fair reading of the brief.
 *
 * Word boundaries matter here: "airship" must not count as "ship".
 */
const VEHICLES = ['airship', 'ship', 'barge', 'train', 'cart', 'caravan', 'sled', 'balloon', 'locomotive'];
function vehicleClashes(root) {
  const mods = JSON.parse(readFileSync(join(root, 'data/modifications.json'), 'utf8'));
  const file = readFileSync(join(root, 'docs/art/prompts/modifications.md'), 'utf8');
  const out = [];
  for (const m of mods.modifications ?? mods) {
    const fits = m.fits ?? [];
    if (fits.includes('any')) continue;
    const sec = file.match(new RegExp(`^## modification-${m.id}\\b[\\s\\S]*?\`\`\`text\\n([\\s\\S]*?)\\n\`\`\``, 'm'));
    if (!sec) continue;
    for (const v of VEHICLES) {
      if (fits.includes(v)) continue;
      /* Named as the thing's own home, not merely mentioned - "off the ship",
         "on the train". A brief may say what a fitting is NOT for. */
      if (new RegExp(`\\b(?:the|a|an|its|one)\\s+${v}\\b(?!\\s*,?\\s*(?:not|nor))`, 'i').test(sec[1])
          && !new RegExp(`not (?:a|an|the) ${v}\\b`, 'i').test(sec[1])) {
        out.push(`  ${m.cardCode} ${m.name}: the brief names "${v}" but data/modifications.json says it fits ${fits.join(', ')}`);
      }
    }
  }
  return out;
}

const steps = stepsByPlate();

/* Every mint subject on every active line, by plate id - cards and tiles both,
   because both now carry a derived cut note in their brief. */
const subjects = new Map();
const tileRows = new Map();
for (const e of survey(ROOT).lines) {
  if (e.shelved) continue;
  for (const row of e.rows) {
    subjects.set(row.plate, { line: e.line, row });
    if (e.line.id === 'buildingtiles') tileRows.set(row.plate, row);
  }
}

/* The heading and the FRAMING page are generated above, so they cannot drift.
   This catches the other direction: a hand-written composition that names a page
   shape its tile is not drawn on - "portrait" in the prose of a landscape tile -
   which no amount of generating the opening clause would fix. */
function pageClashes() {
  const out = [];
  const file = readFileSync(join(ROOT, 'docs/art/prompts/buildingtiles.md'), 'utf8');
  for (const [plate, row] of tileRows) {
    const m = file.match(new RegExp(`^## ${plate}[^\\n]*\\n[\\s\\S]*?\`\`\`text\\n([\\s\\S]*?)\\n\`\`\``, 'm'));
    if (!m) continue;
    /* Only the author's half: after the generated page phrase, before WINDOW. */
    const prose = (m[1].match(/^FRAMING\.[^,]*,([\s\S]*?)(?=\n\nWINDOW\.|$)/m) || ['', ''])[1];
    for (const [word, formats] of [['square', ['square']], ['landscape', ['A4 landscape, 3:2']], ['portrait', ['A4 portrait']]]) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(prose) && !formats.includes(row.format)) {
        out.push(`  ${plate}: the composition says "${word}" but the tile is drawn ${row.format}`);
      }
    }
  }
  return out;
}

/* The band is generated into every brief whose deck has a built card to measure.
   This catches the deck that has none yet - the figure there is the house default
   and can only be a guess - and any brief the generator could not reach. */
function bandClashes() {
  const out = [];
  for (const [plate, hit] of subjects) {
    if (hit.line.id !== 'cards') continue;
    const note = windowNote(ROOT, hit.line, hit.row);
    const real = note && note.match(/middle (\d+)% of its height/);
    if (!real) continue;
    const file = hit.row.briefFile ?? hit.line.brief.file;
    const md = readFileSync(join(ROOT, 'docs/art/prompts', file), 'utf8');
    const m = md.match(new RegExp(`^## ${plate}[^\\n]*\\n[\\s\\S]*?\`\`\`text\\n([\\s\\S]*?)\\n\`\`\``, 'm'));
    if (!m) continue;
    const fram = (m[1].match(/FRAMING\.[\s\S]*?(?=\n\n|$)/) || [''])[0];
    for (const hitPct of fram.matchAll(/middle (\d+)%(?!\s*of\s+(?:the\s+page\s+|its\s+)?width)/g)) {
      if (Number(hitPct[1]) > Number(real[1])) {
        out.push(`  ${plate}: FRAMING promises the middle ${hitPct[1]}% but this deck's window keeps ${real[1]}%`);
      }
    }
  }
  return out;
}

let changed = 0;
for (const t of targets) {
  const path = join(ROOT, t.path);
  const before = readFileSync(path, 'utf8');
  let after = replaceBlock(before, t.preamble, preambleFor(t.register), t.path);
  after = replaceBlock(after, t.negative, negativeFor(t.register), t.path);
  if (t.register.id) after = markSections(after, steps);
  after = markCuts(after, t.path);
  if (after === before) continue;
  changed++;
  if (CHECK) console.error(`  ${t.path} — the generated blocks have drifted from data/artstyle.json`);
  else writeFileSync(path, after);
}

/* AFTER the rewrite, never before. The generated parts heal themselves on every
   run, so checking first meant the one tool that fixes drift refused to start
   whenever there was any. What is left here is only what generating cannot
   reach: prose naming a page its tile is not drawn on, a brief promising more
   height than a deck whose window is measurable, a modification naming a vehicle
   its data denies. */
const typed = targets
  .filter((t) => t.register.id)
  .flatMap((t) => typedPixelAsks(readFileSync(join(ROOT, t.path), 'utf8'), t.path));
const clashes = [...pageClashes(), ...bandClashes(), ...vehicleClashes(ROOT), ...typed];
if (clashes.length) {
  console.error('build-prompts: a brief contradicts its own data —');
  console.error(clashes.join('\n'));
  process.exit(1);
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
