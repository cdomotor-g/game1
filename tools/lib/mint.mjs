/**
 * The mint, as a thing tools can ask questions of.
 *
 * `data/mint.json` declares one LINE per kind of thing that goes designer ->
 * artist -> build: cards, maps, and tiles while they are shelved. This module
 * turns that declaration into rows - one per subject, each carrying which of the
 * four steps it has got to and why - so tools/mint-queue.mjs can report it and
 * anything else can ask without re-deriving it.
 *
 * The step is COMPUTED, every time, from what is in the repository: the brief,
 * the plate, the thing that ties the plate to the data. Nothing is stored, so
 * nothing can be stale. Commit a PNG and the subject moves to step 3 by itself.
 *
 * Only `subjectsOf` knows how to open a line's sources, and it is deliberately
 * dull - one branch per line, the same way tools/mint-queue.mjs has always read
 * a deck. The alternative is a query language in a JSON file, which is a worse
 * version of this switch that nobody can grep.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { plateIdFor } from './plates.mjs';
import { pngSize } from './png.mjs';

const HERE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const STEPS = ['write', 'draw', 'aim', 'minted'];

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** data/mint.json, parsed. */
export function readMintFile(root = HERE) {
  return readJson(join(root, 'data', 'mint.json'));
}

/* --------------------------------------------------------------- dotted paths */

/**
 * `commission.plate.minWidthPx` against an object, answering "is it there and is
 * it worth anything". An empty array, an empty string and an empty object are
 * all absent: a commission that says `"terrainBudget": []` has not said anything.
 */
export function present(obj, path) {
  let v = obj;
  for (const key of path.split('.')) {
    if (v == null || typeof v !== 'object') return false;
    v = v[key];
  }
  if (v == null) return false;
  if (Array.isArray(v) || typeof v === 'string') return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).some((k) => !k.startsWith('$'));
  return true;
}

const missing = (obj, paths) => (paths ?? []).filter((p) => !present(obj, p));

/* -------------------------------------------------------------------- briefs */

/**
 * Which ids a brief file already briefs: every `## <id>` heading in it. The
 * heading IS the id - that is what lets the queue find a brief without anybody
 * filing an index, and it is why a prompt file's headings are not prose.
 */
const briefCache = new Map();
function briefedIn(root, dir, file) {
  const path = join(root, dir, file);
  if (!briefCache.has(path)) {
    const ids = new Set();
    if (existsSync(path)) {
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        const m = /^##\s+([a-z0-9][a-z0-9-]*)\s*(?:—|-|$)/.exec(line.trim());
        if (m) ids.add(m[1]);
      }
    }
    briefCache.set(path, ids);
  }
  return briefCache.get(path);
}

/**
 * The three fenced blocks that make up one subject's prompt, pulled out of the
 * line's brief file: the shared preamble at the top, the negative prompt beside
 * it, and this subject's own section.
 *
 * A brief file is written to be read by a person, so the section headings are
 * the index and the fences are the content - the same fact briefedIn relies on.
 * Assembling them is a separate job from finding them, because two callers want
 * it: tools/mint-request.mjs, which pastes the result into a chat, and
 * tools/mint-draw.mjs, which posts it to an image model.
 *
 * `subject` still carries its literal [PREAMBLE] marker; use assemble() to get
 * the finished prompt.
 */
export function briefFor(root, dir, file, plateId) {
  const path = join(root, dir, file);
  if (!existsSync(path)) return null;
  const lines = readFileSync(path, 'utf8').split('\n');

  /* The fenced block that follows a heading matching `test`. */
  const blockAfter = (test) => {
    const start = lines.findIndex((l) => l.startsWith('## ') && test(l.slice(3).trim()));
    if (start < 0) return null;
    let open = -1;
    for (let i = start + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ')) break;
      if (lines[i].startsWith('\`\`\`')) { open = i; break; }
    }
    if (open < 0) return null;
    const close = lines.findIndex((l, i) => i > open && l.startsWith('\`\`\`'));
    if (close < 0) return null;
    return lines.slice(open + 1, close).join('\n').trim();
  };

  const subject = blockAfter((h) => h === plateId || h.startsWith(`${plateId} `));
  if (subject == null) return null;

  return {
    preamble: blockAfter((h) => /^shared preamble/i.test(h)),
    negative: blockAfter((h) => /^negative prompt/i.test(h)),
    subject,
    aimBlock: /^FRAMING\.|^TRACEABILITY\./m.test(subject),
    file: join(dir, file),
  };
}

/**
 * One brief, as the single block of text an artist is actually given. The
 * subject section carries a literal [PREAMBLE] where the shared style goes -
 * that is what keeps a prompt file readable - so this is where it is spent.
 */
export function assemble(brief) {
  if (!brief) return null;
  const body = brief.preamble ? brief.subject.replace('[PREAMBLE]', brief.preamble) : brief.subject;
  return brief.negative ? `${body}\n\nNEGATIVE PROMPT.\n${brief.negative}` : body;
}

/* ------------------------------------------------------------------ subjects */

/**
 * The cards of one deck, whatever file they live in and whatever they are called
 * in it. A deck names its source; this is the one place that knows how to open
 * one, which is why tools/aim-preview.mjs and tools/draw-item.mjs ask here
 * rather than each guessing which array in a file is the deck. Two decks share
 * items.json and the split between them is a class, so guessing gets it wrong:
 * a talisman found by the items deck is aimed at a plate that does not exist.
 */
export function cardsOfDeck(root, deck) {
  const file = readJson(join(root, 'data', deck.source));
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
    tools: () => file.tools,
  }[deck.id];
  if (!pick) throw new Error(`the mint does not know how to read the ${deck.id} deck`);
  return (pick() || []).filter((c) => c.cardCode);
}

/**
 * One line's subjects, flattened to the shape the queue reports. `deferred` is
 * the part of a line that is declared and not being chased - a deck with
 * `minting: false` - and is reported rather than hidden, because a deck nobody
 * is illustrating this month is a decision, not an absence.
 */
function subjectsOf(root, line) {
  const rows = [];
  const deferred = [];
  const generated = [];

  if (line.id === 'cards') {
    const components = readJson(join(root, 'data', 'components.json'));
    for (const deck of components.decks) {
      const cards = cardsOfDeck(root, deck);
      if (!deck.minting) {
        deferred.push({ name: deck.name, count: cards.length, format: deck.plateFormat });
        continue;
      }
      for (const card of cards) {
        rows.push({
          id: card.id ?? card.cardCode,
          code: card.cardCode,
          name: card.name,
          group: deck.name,
          format: deck.plateFormat,
          plate: plateIdFor(deck, card),
          briefFile: deck.promptFile,
          /* A deck whose plates are GENERATED still has every step a deck has -
             a brief, a plate, a framing entry - and the queue reports it exactly
             like any other. What changes is only who is waiting: a missing plate
             on this deck is a tool that has not been run, not an artist who has
             not answered, and the queue says which. Same field, same reason, as
             a map plate.kind.

             Per CARD, not per deck: the escape hatch is deleting one card's
             plate block, and a card with no parts to draw from is an artist's
             again - tools/draw-item.mjs will not touch it, so nothing else may
             call it generated either. */
          drawnBy: deck.plateKind === 'generated' && card.plate?.parts?.length ? deck.drawnBy : null,
          subject: card,
        });
      }
    }
    return { rows, deferred, generated };
  }

  if (line.id === 'maps') {
    const dir = join(root, 'data', line.subjectsFrom.dir);
    if (!existsSync(dir)) return { rows, deferred, generated };
    for (const file of readdirSync(dir).filter((f) => f.endsWith(line.subjectsFrom.ext)).sort()) {
      const map = readJson(join(dir, file));
      /* A GENERATED map has no handover to track. There is no artist, so there
         is no step anybody is waiting on: tools/draw-map.mjs grows it from its
         own commission and draws it. It is reported rather than chased - the
         posture build-minimaps.mjs already takes for a sheet, "generated, not
         commissioned". Setting plate.kind back to "drawn" puts it in the queue
         at DRAW exactly as before. */
      if (map.plate?.kind === 'generated') {
        generated.push({ id: map.id, name: map.name, grid: `${map.grid?.cols ?? '?'} × ${map.grid?.rows ?? '?'}`, plate: map.plate.file });
        continue;
      }
      rows.push({
        id: map.id,
        code: map.id,
        name: map.name,
        group: `${map.grid?.cols ?? '?'} × ${map.grid?.rows ?? '?'}`,
        format: line.plate.format,
        plate: map.id,
        briefFile: line.brief.file,
        subject: map,
      });
    }
    return { rows, deferred, generated };
  }

  /* A shelved line has no source to read, which is the point of it being
     shelved: nothing is enumerated and nothing is chased. */
  return { rows, deferred, generated };
}

/* --------------------------------------------------------------------- probes */

/** Where a line's plate for this subject would be, relative to the repository. */
export function platePath(line, row) {
  return `${line.plate.dir}/${row.plate}${line.plate.ext}`;
}

/**
 * Has the plate been tied back to the data? A card is tied by a framing entry, a
 * map by the board read off it. Same step, two contracts, one question.
 */
function aimOf(root, line, row) {
  if (line.id === 'cards') {
    const framing = readJson(join(root, line.aim.file));
    const entry = framing.plates[row.plate];
    return { done: !!entry, extra: { focal: !!(entry && entry.focal) } };
  }
  if (line.id === 'maps') {
    const gaps = missing(row.subject, line.boardRequires);
    const rows = row.subject.rows;
    const traced = Array.isArray(rows) && rows.length > 0;
    return { done: traced && gaps.length === 0, extra: { traced, gaps } };
  }
  return { done: false, extra: {} };
}

/* --------------------------------------------------------------------- survey */

/**
 * Every line in the mint, with every subject placed on a step and everything
 * that is wrong with it said out loud.
 *
 * Three channels out, because they are fixed by three different people:
 *
 *   step      missing work. Whose turn it is, and that is the queue's whole job.
 *   problems  a broken contract. A commission that never said what its terrain
 *             budget is cannot be handed to an artist at all.
 *   notes     an observation that is true and is nobody's turn. A plate under
 *             the declared size renders fine and caps how large it can print.
 */
/* ------------------------------------------------------------ plate minimums */

const mmToPx = (mm, dpi) => Math.round((mm / 25.4) * dpi);

/* components.json, once per process rather than once per subject. */
let stockCache = null;
const cardStock = (root) => (stockCache ??= readJson(join(root, 'data', 'components.json')).stock);

/**
 * How many pixels a plate on this line needs on its long side - DERIVED from
 * what the finished artefact is physically printed at, not typed into
 * data/mint.json.
 *
 * Same reasoning as tools/build-board.mjs deriving a track column from the
 * paper: a number somebody types is a number that goes stale the day the thing
 * it describes changes size. The cards line carried a flat 4000 px for exactly
 * that reason - it is an A1 MAP's requirement, and it was reporting every card
 * plate ever accepted as a failure against a contract cards never had.
 *
 * One branch per line, like subjectsOf and aimOf, and for the same reason.
 *
 * Returns { min, want, from } in pixels; a zero means this line does not
 * constrain the plate's size.
 */
export function minLongSideFor(root, line, row) {
  const spec = line.plate?.minLongSide;
  if (!spec) {
    return { min: line.plate?.minLongSidePx ?? 0, want: line.plate?.wantLongSidePx ?? 0, from: 'declared' };
  }

  if (line.id === 'cards') {
    /* A plate is shown in a card's picture window, and the window can never be
       larger than the safe area - the frame, the stat strip and the story rail
       all take theirs first. So the safe area's long side is the most pixels a
       plate can ever be asked for, and asking for the trim size or the bleed
       would be asking for pixels no window has room to spend. */
    const { card } = cardStock(root);
    const longMm = Math.max(card.widthMm, card.heightMm) - 2 * (card.safeMarginMm ?? 0);
    return {
      min: mmToPx(longMm, spec.dpi),
      want: mmToPx(longMm, spec.wantDpi),
      from: `a ${longMm} mm card window at ${spec.dpi} dpi`,
    };
  }

  if (line.id === 'maps') {
    /* The widest sheet layout this map says it can be printed at. A generated
       plate is vector, so it has no long side and nothing to fall short of. */
    if (row?.subject?.plate?.kind === 'generated') return { min: 0, want: 0, from: 'generated, vector' };
    const presets = row?.subject?.print?.presets ?? [];
    const longMm = Math.max(0, ...presets.map((p) => p.mapWidthMm ?? 0));
    if (!longMm) return { min: 0, want: 0, from: 'no print preset yet' };
    return {
      min: mmToPx(longMm, spec.dpi),
      want: mmToPx(longMm, spec.wantDpi),
      from: `a ${longMm} mm sheet at ${spec.dpi} dpi`,
    };
  }

  return { min: 0, want: 0, from: 'no rule' };
}

export function survey(root = HERE) {
  const mint = readMintFile(root);
  const out = { mint, lines: [], problems: [], notes: [] };

  for (const line of mint.lines) {
    const entry = { line, rows: [], deferred: [], generated: [], shelved: line.status === 'shelved' };
    const undersized = [];
    const belowWant = [];
    let bound = null;
    if (!entry.shelved) {
      const { rows, deferred, generated } = subjectsOf(root, line);
      entry.deferred = deferred;
      entry.generated = generated;

      for (const row of rows) {
        for (const gap of missing(row.subject, line.subjectRequires)) {
          out.problems.push(
            `${line.id}/${row.code}: the commission does not say \`${gap}\` — see data/mint.json lines.${line.id}.subjectRequires`
          );
        }

        const hasBrief = briefedIn(root, line.brief.dir, row.briefFile ?? line.brief.file).has(row.plate);
        const file = join(root, platePath(line, row));
        const hasPlate = existsSync(file);
        const aim = aimOf(root, line, row);

        let longSide = 0;
        if (hasPlate) {
          bound = minLongSideFor(root, line, row);
          if (bound.min) {
            const { width, height } = pngSize(file);
            longSide = Math.max(width, height);
            if (longSide < bound.min) undersized.push({ code: row.code, longSide });
            else if (bound.want && longSide < bound.want) belowWant.push({ code: row.code, longSide });
          }
        }

        entry.rows.push({
          ...row,
          hasBrief,
          hasPlate,
          longSide,
          hasAim: aim.done,
          aimExtra: aim.extra,
          step: !hasBrief && !hasPlate ? 'write' : !hasPlate ? 'draw' : !aim.done ? 'aim' : 'minted',
        });
      }

      /* Which of this line's subjects are drawn by a tool in this repository
         rather than by somebody with a pen. One line, like the size note: it is
         a standing fact about the line, and repeating it per subject would bury
         the rows that are actually somebody's turn. */
      const generatedRows = entry.rows.filter((r) => r.drawnBy);
      if (generatedRows.length) {
        const tools = [...new Set(generatedRows.map((r) => r.drawnBy))];
        const decks = [...new Set(generatedRows.map((r) => r.group))];
        out.notes.push(
          `${line.id}: ${generatedRows.length} of ${entry.rows.length} plates are GENERATED, not commissioned - ` +
            `${decks.join(' and ')}, drawn by ${tools.map((t) => `\`node ${t}\``).join(', ')} from the card's own data. ` +
            `They go through the same four steps as anything else and they are nobody's turn to draw: ` +
            `delete one and the tool puts it back.`
        );
      }

      /* One line, not thirty. A plate under the declared size is a real finding
         and it is the SAME finding every time - re-render for print, or accept
         that these are screen plates - so it is reported once, with the count and
         the worst of them, rather than once per subject. */
      if (undersized.length && bound) {
        const worst = undersized.reduce((a, b) => (a.longSide <= b.longSide ? a : b));
        out.notes.push(
          `${line.id}: ${undersized.length} of ${entry.rows.length} plates are under the ${bound.min} px long side ` +
            `this line needs — ${bound.from} — smallest is \`${worst.code}\` at ${worst.longSide} px. ` +
            `They render fine on screen and they are the limit on how large the artefact can be printed.`
        );
      } else if (belowWant.length && bound) {
        const worst = belowWant.reduce((a, b) => (a.longSide <= b.longSide ? a : b));
        out.notes.push(
          `${line.id}: every plate clears the ${bound.min} px floor (${bound.from}), and ${belowWant.length} of ` +
            `${entry.rows.length} are under the ${bound.want} px this line would want for print — smallest is ` +
            `\`${worst.code}\` at ${worst.longSide} px. That is an aspiration, not a fault.`
        );
      }
    }
    out.lines.push(entry);
  }

  return out;
}

/** The rows of one line on one step. */
export const at = (entry, step) => entry.rows.filter((r) => r.step === step);
