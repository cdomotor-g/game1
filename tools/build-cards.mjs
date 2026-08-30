#!/usr/bin/env node
/**
 * Renders the adventure-deck card fronts — characters, vehicles, monsters and
 * talismans — as SVG, from data/*.json and the accepted plates in
 * docs/art/renders/. The generator 08-components.md asked for: it keeps the
 * printed cards honest against the rules the same way the explorer already is.
 *
 * One card is one layout emitting the two-plate groups the style guide demands
 * (docs/art/01-two-plate-system.md): #wash carries the portrait and the flat
 * colour, #ink carries every rule, number and letter in soot alone, #grime
 * carries the wear. Dropping #wash is the black-and-white edition, which is why
 * the strip is lettered and numbered in ink and only *tinted* in wash.
 *
 * Only cards whose plate exists are rendered — a card with no accepted render
 * is not a card yet. Output: docs/cards/<CODE>.svg, docs/cards/index.html and
 * docs/cards/print.html, the sheets you cut cards out of.
 *
 * Card anatomy (data/components.json statStrip and storyRail):
 *   name and card code at the top · a SUMMARY STRIP of lettered boxes under
 *   them, ONE box per letter-and-figure pair · portrait · story low, or standing
 *   up the right-hand edge on the decks whose plates are drawn portrait.
 *
 * There are no bars. There were, up both edges, and a token walked them; that
 * worked while a card was held in the hand and stopped working the day the
 * player board arrived, because a card in a recess is a card whose edges are
 * under the board. The tracks moved to the board and the card kept the one
 * thing a card is good at: printing a number that never changes. So the strip
 * says H 10 · S 6 · D 5 and the letters are the board's own track letters, so a
 * player sets up by reading across the strip and placing tokens left to right.
 *
 * What that bought the picture is the whole width of the card. The portrait
 * window is not a fixed box: a deck's plates have one shape (the figures are
 * drawn on A4 pages, the talismans square, the vehicles 3:2) and a deck's cards
 * need one amount of room for their words, so each deck gets the tallest window
 * its own worst card leaves free, in its own plates' proportion, across whatever
 * width its words have left it.
 *
 * Which is the second thing: on the character and monster decks the story does
 * not run across the bottom. It stands up the right-hand edge, rotated a quarter
 * turn, reading bottom to top - so it costs the card WIDTH rather than HEIGHT,
 * and a plate drawn on a portrait page finally gets a portrait window to be shown
 * in. The picture on a character card is about ten millimetres taller than the
 * full-width one it replaced, and the words did not get any smaller. Which decks
 * do it is `storyRail` on the deck in components.json. What goes *in* that window is a crop taken around the plate's subject,
 * from docs/art/framing.json — see tools/lib/framing.mjs. Framing on the middle
 * of the file is what used to put a character's chin at the top of their own card.
 *
 * Usage: node tools/build-cards.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pngSize, pngProblem } from './lib/png.mjs';
import { crop, readFraming, WHOLE_PLATE } from './lib/framing.mjs';
import { plateIdFor } from './lib/plates.mjs';
import { cardsOfDeck } from './lib/decks.mjs';
import { tileSubjects } from './lib/tiles.mjs';
import { cardsOfDeck as mintCardsOfDeck } from './lib/mint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');
const OUT_DIR = join(ROOT, 'docs', 'cards');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const framing = readFraming(ROOT);
/* Every shape on a card - its size, its corner, its frame, its bars, its back -
   is declared once in data/components.json and read here. Nothing below invents
   a number that belongs to a component. */
const components = read('components.json');

/* The decks, and the order they are dealt in, come from data/components.json -
   which is also where each one's back is described and how its plates are named.
   A deck with no rendered card yet still has a back: the back is what a deck is,
   before it has cards. */
const DECKS = components.decks;
const deckByPrefix = (p) => DECKS.find((d) => d.prefix === p);

/* Every colour below is declared in palette.json — validate-art.mjs checks. */
const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const T85 = palette.ink.tints['85'].hex;
const T70 = palette.ink.tints['70'].hex;
const T40 = palette.ink.tints['40'].hex;
const T25 = palette.ink.tints['25'].hex;
const T12 = palette.ink.tints['12'].hex;
const OXIDE = palette.inks.oxide.hex;
const SLATE = palette.inks.slate.hex;
const BRUISE = palette.inks.bruise.hex;
const OCHRE = palette.inks.ochre.hex;
const VERDIGRIS = palette.inks.verdigris.hex;

/* The element carries its ink and its mark, both from data/arcana.json - the
   same path the icons and the book draw, so a card cannot say fire differently
   from a chapter heading. How to draw one is components.json marks.element. */
const ELEMENTS = new Map(read('arcana.json').elements.map((e) => [e.id, e]));
const MARK = components.marks.element;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

/* "oxide" -> the named ink, "soot-tint-40" -> that tint. The data names inks;
   this is the only place a name becomes a hex. */
function inkHex(name) {
  const tint = /^soot-tint-(\d+)$/.exec(name);
  if (tint) return palette.ink.tints[tint[1]].hex;
  if (name === 'soot') return SOOT;
  const ink = palette.inks[name];
  if (!ink) throw new Error(`data names an ink the palette does not declare: ${name}`);
  return ink.hex;
}

/* The card stock, from data/components.json. Drawn at 8 units = 1mm. */
const STOCK = components.stock;
const U = STOCK.unitsPerMm;
const CARD_MM = { w: STOCK.card.widthMm, h: STOCK.card.heightMm, bleed: STOCK.card.bleedMm, corner: STOCK.card.cornerRadiusMm };
const BLEED = CARD_MM.bleed * U;
const W = (CARD_MM.w + 2 * CARD_MM.bleed) * U;   // bleed box
const H = (CARD_MM.h + 2 * CARD_MM.bleed) * U;
const TRIM = { x: BLEED, y: BLEED, w: CARD_MM.w * U, h: CARD_MM.h * U };
/* Playing cards are not cut square. This is where they stop being drawn as if
   they were: the frame follows the corner, the print page's window follows the
   corner, and the sheet carries a die mark at each one. */
const CORNER = CARD_MM.corner * U;
const FRAME = components.frame;

/* Type sits at or above the print floor: rules text ~6.5pt, story ~6pt, name
   ~11pt at the card's true 63x88mm (1pt = 2.83 units). Those sizes are what the
   words cost; the picture gets whatever is left. The rules text wraps wider than
   it did by exactly the width the right-hand bar used to take out of it; the
   flavour panel is unchanged, because it always ran the full width of the card. */
const FACT = { size: 18, lead: 22 };
const STORY = { size: 16.5, lead: 19.5, max: 5 };
const STORY_BASE = 694;            // baseline of the last line of flavour text
const GAP = 26;                    // plate to rules, and rules to the flavour panel
/* The window runs frame to frame. It used to run between two bars, which cost it
   80 units of the 456 there are; the bars are on the player board now. */
const PORTRAIT = { x: TRIM.x + 24, w: TRIM.w - 48 };
/* The flattest a window may get. A 3:2 plate would rather be shown in a 3:2
   slot, but below about this the window stops reading as a plate on a page and
   starts reading as a letterbox slot cut in one. */
const FLATTEST = 1.34;

/* One glyph's width as a fraction of the type size, for this serif at this size.
   Every wrap width in this file is a COLUMN, in units, run through here - because
   a column's width is now a thing that varies: a deck whose story runs up the
   side has a narrower one than a deck whose story runs across the bottom, and a
   hand-counted character limit cannot follow that. */
const GLYPH = 0.478;
const charsIn = (w, size) => Math.max(8, Math.round(w / (size * GLYPH)));

/* The story rail: the flavour text stood on end up the right-hand edge. Its
   shape is components.json storyRail; which decks take it is on the deck. */
const RAIL = components.storyRail;
/* The foot of the card's working area - where a rail stands on, and how far the
   rules text may run down now that nothing is printed under it. */
const FOOT = TRIM.y + TRIM.h - FRAME.inner.inset - 10;

/* The summary strip, from data/components.json — geometry and letters both.
   Nothing below invents a letter: a stat the player board has a track for uses
   that track's letter, and validate-data.mjs fails the build if the two ever
   disagree. */
const STRIP = components.statStrip;
const STRIP_H = STRIP.cells.heightMm * U;
const STRIP_Y = 106;
const LETTER_OF = STRIP.letters;
/* One line of type below the name, then the strip, then everything else. The
   head is set ten units higher than it was and the strip is nine units shorter,
   because a cell stopped carrying a second box round its letter. Nineteen units
   is two and a half millimetres, and every one of them goes to the picture. */
const CODE_Y = 52;
const NAME_Y = 80;
const KICKER_Y = 98;

/* ------------------------------------------------------- shared card shapes */

/**
 * The element badge: the element's mark inside a ring, in the element's ink.
 *
 * A ring rather than a filled disc, because 04-iconography.md gives the filled
 * circle to commodities. The mark is authored edge to edge on a 24-grid and is
 * pulled in about its centre here, or the ends of its ground line cross the ring.
 */
function elementMark(id, cx, cy, r, opts = {}) {
  const e = ELEMENTS.get(id);
  if (!e) throw new Error(`no such element: ${id}`);
  const k = (2 * r / 24) * MARK.onCard.insetInDisc;
  return {
    wash: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${inkHex(e.ink)}" opacity="${MARK.onCard.washOpacity}"/>`,
    ink:
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${SOOT}" stroke-width="2"/>` +
      `<g transform="translate(${num(cx - 12 * k)} ${num(cy - 12 * k)}) scale(${num(k)})" fill="${MARK.fill}" ` +
      `stroke="${SOOT}" stroke-width="${MARK.strokeWidth}" stroke-linecap="${MARK.strokeLinecap}" ` +
      `stroke-linejoin="${MARK.strokeLinejoin}"><path d="${e.mark}"/></g>` +
      (opts.label === false
        ? ''
        : `<text x="${cx + r + 9}" y="${cy + 5}" font-size="13" letter-spacing="1.5" font-family="${SANS}" fill="${T85}">${e.name.toUpperCase()}</text>`),
  };
}

/** A rectangle inset from the trim, following the card's corner as it goes in. */
function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rounded = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r)}" ${attrs}/>`;

/** The two frame rules, both on the corner. */
function frameRules() {
  const outer = inset(FRAME.outer.inset);
  const inner = inset(FRAME.inner.inset);
  return `<g fill="none" stroke="${SOOT}">\n    ${rounded(outer, `stroke-width="${FRAME.outer.strokeWidth}"`)}\n    ${rounded(inner, `stroke-width="${FRAME.inner.strokeWidth}"`)}\n  </g>`;
}

/** The four rivets, pulled in off the corner so they sit on the round, not past it. */
function rivets() {
  const d = FRAME.rivets.inset;
  const r = FRAME.rivets.radius;
  const k = CORNER * 0.30;   // slide along the diagonal, onto the arc
  const pts = [
    [TRIM.x + d + k, TRIM.y + d + k],
    [TRIM.x + TRIM.w - d - k, TRIM.y + d + k],
    [TRIM.x + d + k, TRIM.y + TRIM.h - d - k],
    [TRIM.x + TRIM.w - d - k, TRIM.y + TRIM.h - d - k],
  ];
  return `<g>${pts.map(([x, y]) => `<circle cx="${num(x)}" cy="${num(y)}" r="${r}"/>`).join('')}</g>`;
}

/**
 * Where the die goes, marked in the bleed and never on the card.
 *
 * A card is cut with a radius, so the sheet has to say what radius. These are
 * four quarter-arcs drawn just outside the trim, in the margin the blade takes
 * away - the same job a crop mark does, for a corner that is not a right angle.
 */
function dieMarks() {
  const g = 6;                       // stand off the trim so the arc is readable
  const R = CORNER + g;
  const b = { x: TRIM.x - g, y: TRIM.y - g, w: TRIM.w + 2 * g, h: TRIM.h + 2 * g };
  const arcs = [
    `M ${num(b.x)},${num(b.y + R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + R)},${num(b.y)}`,
    `M ${num(b.x + b.w - R)},${num(b.y)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w)},${num(b.y + R)}`,
    `M ${num(b.x + b.w)},${num(b.y + b.h - R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w - R)},${num(b.y + b.h)}`,
    `M ${num(b.x + R)},${num(b.y + b.h)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x)},${num(b.y + b.h - R)}`,
  ];
  return `<g fill="none" stroke="${SOOT}" stroke-width="1" opacity="0.32">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/** Greedy wrap by estimated glyph width — close enough for a serif at card size. */
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const out = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > maxChars) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

function textBlock(lines, x, y, size, leading, attrs = '') {
  return lines.map((l, i) => `<text x="${x}" y="${num(y + i * leading)}" font-size="${size}" ${attrs}>${esc(l)}</text>`).join('\n    ');
}

/**
 * One cell of the summary strip: a lettered box with a figure beside it.
 *
 * The letter sits in a tinted square at the left so it reads as a label rather
 * than as part of the number, and the figure takes the rest. The figure shrinks
 * to fit and stops at the 6 pt print floor — a number that will not fit at 6 pt
 * is a number that does not belong on a card.
 *
 * `mark` instead of a letter and a value puts an element badge in the box, which
 * is where the element went when the strip took the top of the card.
 */
function statCell(cell, x, y, w) {
  const C = STRIP.cells;
  const wash = [];
  const ink = [];

  wash.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(STRIP_H)}" rx="${C.cornerRadius}" fill="${inkHex(cell.tint || 'soot-tint-12')}" opacity="0.55"/>`);
  ink.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(STRIP_H)}" rx="${C.cornerRadius}" fill="none" stroke="${SOOT}" stroke-width="${STRIP.rule.strokeWidth}"/>`);

  if (cell.element) {
    const r = (STRIP_H - 2 * C.pad) / 2;
    const badge = elementMark(cell.element, x + w / 2, y + STRIP_H / 2, r, { label: false });
    return { wash: wash.join('') + badge.wash, ink: ink.join('') + badge.ink };
  }

  /* The letter, set at the left of the cell and nothing round it. It used to sit
     in a tinted square of its own - a box inside a box, six times across the top
     of every card - and the square was doing nothing the weight below does not
     do better: the label sits back in a tint, the figure holds the ink, and the
     pair reads as one thing because it is in one box. */
  const mid = y + STRIP_H / 2;
  const letter = letterSize(cell.letter);
  ink.push(
    `<text x="${num(x + C.pad)}" y="${num(mid + letter * 0.36)}" font-size="${num(letter)}" ` +
    `font-family="${SANS}" font-weight="${STRIP.letter.weight}" fill="${inkHex(STRIP.letter.fill)}">${esc(cell.letter)}</text>`
  );

  /* what is left of the box, and the figure sized to sit inside it */
  const room = w - 2 * C.pad - letter * 0.62 * String(cell.letter).length - C.pad;
  const text = String(cell.value);
  const size = Math.max(STRIP.value.minSize, Math.min(STRIP.value.size, (room / (text.length * 0.62))));
  ink.push(
    `<text x="${num(x + w - C.pad)}" y="${num(mid + size * 0.36)}" font-size="${num(size)}" text-anchor="end" ` +
    `font-family="${SANS}" font-weight="${STRIP.value.weight}">${esc(text)}</text>`
  );
  return { wash: wash.join(''), ink: ink.join('') };
}

/** A two-character letter ("KG") has to come down or it fills its own box — but
    never below the 6 pt floor, which is the same floor the figures stop at. */
function letterSize(letter) {
  if (String(letter).length <= 1) return STRIP.letter.size;
  return Math.max(STRIP.value.minSize, STRIP.letter.size * 0.72);
}

/**
 * The summary strip: every number this card prints, in one boxed row.
 *
 * The cells share the width equally, because a strip whose boxes are different
 * widths reads as a sentence and a strip whose boxes match reads as a table —
 * and a table is what a player is scanning when they set their tokens up.
 */
function statStrip(cells) {
  const C = STRIP.cells;
  if (cells.length > C.max) throw new Error(`a card is asking for ${cells.length} stat cells; components.json allows ${C.max}`);
  /* Every box in the game is the width a FULL strip's box would be, whatever
     this card happens to carry - so a vehicle with two numbers gets two boxes
     the size of a character's six and the right end of its strip is simply
     empty. Sharing the width out instead would make a two-stat card's boxes
     three times the size of a six-stat card's, and the eye would read that as
     three times as important. */
  const w = (PORTRAIT.w - (C.max - 1) * C.gap) / C.max;
  const drawn = cells.map((cell, i) => statCell(cell, PORTRAIT.x + i * (w + C.gap), STRIP_Y, w));
  return { wash: drawn.map((d) => d.wash).join(''), ink: drawn.map((d) => d.ink).join('') };
}

/* ------------------------------------------------------------------ framing */

/** The plate's pixel size, cached — one IHDR read per file, not one decode. */
const plateSizes = new Map();
function plateSize(id) {
  if (!plateSizes.has(id)) {
    const file = join(RENDERS, `${id}.png`);
    /* null, not a throw: a card whose plate cannot be read is skipped exactly
       like one whose plate has not arrived, because it has not. */
    plateSizes.set(id, pngProblem(file) ? null : pngSize(file));
  }
  return plateSizes.get(id);
}

const unframed = [];
function frameOf(id) {
  const entry = framing.plates[id];
  if (!entry) { unframed.push(id); return { subject: WHOLE_PLATE }; }
  return entry;
}

/**
 * The geometry every card in one deck shares.
 *
 * The words are laid out from the bottom up — the flavour panel sits on the
 * card's bottom margin, the rules text sits above it — and both are sized for
 * the wordiest card in the deck, so that a deck deals out as one deck and not
 * as a set of cards each with its own horizon. What is left above them is the
 * window, in the deck's own plate proportion where that fits, and the block of
 * window-plus-rules is then centred in the space it was given.
 */
function deckGeometry(deck, deckDef) {
  /* Under the strip, which is the same height on every card in every deck —
     which is why there is no longer a deck that starts its picture lower than
     its neighbour because it happens to carry an element. */
  const top = STRIP_Y + STRIP_H + GAP;
  const plate = plateSize(deck[0].portrait);

  /* A deck whose story stands up the side (components.json storyRail) pays for
     its words in WIDTH. The rail runs the height of the card, so a rail line is
     four times the length a panel line was and the whole story fits in three or
     four of them; each of those is one column of type wide, and what is left of
     the card's width is the picture's. The picture then takes the whole height
     between the strip and the rules text, which on a plate drawn portrait is a
     portrait window — which is what the deck wanted in the first place, and what
     the panel across the bottom had been quietly refusing it. */
  if (deckDef?.storyRail) {
    const railH = FOOT - top;
    const chars = charsIn(railH, STORY.size);
    const wrapped = deck.map((s) => wrap(storyOf(s), chars).slice(0, RAIL.maxLines));
    const lines = Math.max(...wrapped.map((w) => w.length));
    const railW = lines * STORY.lead + RAIL.pad;
    const colW = PORTRAIT.w - railW - RAIL.gap;
    /* The deck's longest line, and where that leaves the type standing. Every
       card in a deck starts its story at the same height, the way the panel
       across the bottom set one horizon for the whole deck: a rail that began
       wherever each card's own words ran out would deal as a set of cards rather
       than as a deck. */
    const longest = Math.max(...wrapped.flat().map((l) => l.length));
    const foot = FOOT - Math.max(0, railH - longest * STORY.size * GLYPH) / 2;

    const factMax = Math.max(...deck.map((s) => factLines(s, colW).length));
    const room = (FOOT - top) - GAP - (factMax - 1) * FACT.lead;
    const wanted = colW / (plate.width / plate.height);
    const height = Math.round(Math.min(room, Math.max(wanted, colW / FLATTEST)));
    const y = Math.round(top + (room - height) / 2);

    return {
      window: { x: PORTRAIT.x, y, w: colW, h: height },
      factY: y + height + GAP,
      wrap: colW,
      rail: { x: PORTRAIT.x + PORTRAIT.w - railW, w: railW, top, bottom: FOOT, foot, chars, lines },
    };
  }

  /* A deck with NO story at all (components.json storyPanel false) gives the
     band across the bottom back to the picture. It is not a third layout, it is
     the panel layout with the panel's height set to nothing: the rules text
     still hangs off the foot of the window, and the window simply grows down to
     the card's own foot instead of stopping at a panel.

     What earns it is a deck where the flavour would be missing rather than
     short. The BUILDINGS deck is the first: five of its forty-nine subjects carry
     `notes` and the other forty-four would deal with an empty band ruled across
     the bottom of them, which reads as a card with a hole in it. `storyOf` would
     also have logged all forty-four to `noStory`, burying the warning's real
     job - a deck that MEANT to have a story and lost one - under a deck that
     never had one. */
  if (deckDef?.storyPanel === false) {
    const factMax = Math.max(...deck.map((s) => factLines(s, PORTRAIT.w).length));
    const room = (FOOT - top) - GAP - (factMax - 1) * FACT.lead;
    const wanted = PORTRAIT.w / (plate.width / plate.height);
    const height = Math.round(Math.min(room, Math.max(wanted, PORTRAIT.w / FLATTEST)));
    const y = Math.round(top + (room - height) / 2);
    return {
      window: { x: PORTRAIT.x, y, w: PORTRAIT.w, h: height },
      factY: y + height + GAP,
      wrap: PORTRAIT.w,
    };
  }

  const factMax = Math.max(...deck.map((s) => factLines(s, PORTRAIT.w).length));
  const storyMax = Math.max(...deck.map((s) => storyLines(s, charsIn(PORTRAIT.w, STORY.size)).length));

  const storyY = STORY_BASE - (storyMax - 1) * STORY.lead;
  const panelTop = storyY - GAP;
  /* The last line of rules text may come down to a line's clearance of the panel. */
  const factFloor = panelTop - FACT.lead;

  const room = (factFloor - top) - GAP - (factMax - 1) * FACT.lead;
  const wanted = PORTRAIT.w / (plate.width / plate.height);
  const height = Math.round(Math.min(room, Math.max(wanted, PORTRAIT.w / FLATTEST)));
  const y = Math.round(top + (room - height) / 2);

  const window = { x: PORTRAIT.x, y, w: PORTRAIT.w, h: height };
  return { window, factY: y + height + GAP, storyY, panelTop, wrap: PORTRAIT.w };
}

/** The crop of this card's plate that fills its window, framed on the subject. */
function portraitCrop(spec, window) {
  const plate = plateSize(spec.portrait);
  const f = frameOf(spec.portrait);
  const c = crop(plate, f.subject, window.w / window.h, framing.pad, f.focal, f.focalTargetOverride || framing.focalTarget);
  const scale = window.w / (c.w * plate.width);
  return {
    x: num(window.x - c.x * plate.width * scale),
    y: num(window.y - c.y * plate.height * scale),
    w: num(plate.width * scale),
    h: num(plate.height * scale),
  };
}

/* --------------------------------------------------------------- the card */

const factLines = (spec, colW) => (spec.facts || []).flatMap((f) => wrap(f, charsIn(colW, FACT.size)));
const storyLines = (spec, chars) => wrap(storyOf(spec), chars).slice(0, STORY.max);

/* A card with no story gets an empty rail and a warning by name, never the word
   `undefined` set in italics up its own edge. `wrap` stringifies whatever it is
   handed, so a missing story used to typeset perfectly and read as a defect only
   in the proof - which is where ITM-07 was caught, one look before it shipped. */
const noStory = [];
const storyOf = (spec) => {
  if (typeof spec.story === 'string' && spec.story.trim()) return spec.story;
  if (spec.code && !noStory.includes(spec.code)) noStory.push(spec.code);
  return '';
};

/**
 * The story: a panel across the bottom, or a rail up the right-hand edge.
 *
 * The rail is the same words rotated -90 - reading bottom to top, the way a
 * spine is lettered and the way the player board's own track labels already run.
 * Lines stack left to right, so the first line is the one nearest the picture,
 * and the rail's WIDTH is its line count: the story costs the card width rather
 * than height, which is the whole point. A plate drawn on a portrait page has
 * width to spare and no height at all, so the picture beside the rail is taller
 * than the full-width one it replaced by a good ten millimetres.
 *
 * The arithmetic of the rotation, once, so nothing below has to hold it in its
 * head: under `translate(TX,TY) rotate(-90)` a local point (x,y) lands at card
 * (TX + y, TY - x). So local x runs UP the card from TY - which is why TY is the
 * foot of the rail - and each successive line, one lead further along local y,
 * lands one column further to the right.
 */
function storyRail(spec, geom) {
  /* Neither a rail nor a panel: the deck said storyPanel false and deckGeometry
     gave the band to the picture, so there is no `panelTop` to rule one against.
     Returning empty is the whole of it - the card's other parts do not know the
     difference. */
  if (!geom.rail && geom.panelTop === undefined) return { wash: '', ink: '' };
  if (!geom.rail) {
    const lines = storyLines(spec, charsIn(PORTRAIT.w, STORY.size));
    return {
      wash: `<rect x="${TRIM.x}" y="${num(geom.panelTop)}" width="${TRIM.w}" height="${num(TRIM.y + TRIM.h - geom.panelTop + 2)}" fill="${T12}" opacity="0.5"/>`,
      ink:
        `<path d="M ${TRIM.x + 24},${num(geom.storyY - 22)} H ${TRIM.x + TRIM.w - 24}" stroke="${SOOT}" stroke-width="1.2"/>\n  ` +
        `<g font-style="italic" fill="${T85}">\n    ` +
        textBlock(lines, TRIM.x + 26, geom.storyY, STORY.size, STORY.lead) +
        `\n  </g>`,
    };
  }

  const R = geom.rail;
  const lines = wrap(storyOf(spec), R.chars).slice(0, R.lines);
  const tx = R.x + RAIL.pad + STORY.lead * 0.78;   // the first line's baseline
  return {
    wash: `<rect x="${num(R.x)}" y="${num(R.top)}" width="${num(TRIM.x + TRIM.w - R.x + 2)}" height="${num(TRIM.y + TRIM.h - R.top + 2)}" fill="${T12}" opacity="0.5"/>`,
    ink:
      `<path d="M ${num(R.x - RAIL.gap / 2)},${num(R.top)} V ${num(R.bottom)}" stroke="${SOOT}" stroke-width="${RAIL.rule.strokeWidth}"/>\n  ` +
      `<g transform="translate(${num(tx)} ${num(R.foot)}) rotate(-90)" font-style="italic" fill="${T85}">\n    ` +
      textBlock(lines, 0, 0, STORY.size, STORY.lead) +
      `\n  </g>`,
  };
}

/**
 * One card front. spec:
 *   code, name, kicker (small line under the name), element (optional),
 *   portrait (render id), left  {total, label} harm bar,
 *   right {total, label, colour} capacity bar, facts [line...], story.
 */
function card(spec, geom) {
  const P = geom.window;
  const art = portraitCrop(spec, P);
  const artHref = `../art/renders/${spec.portrait}.png`;
  const strip = statStrip(spec.stats);
  const story = storyRail(spec, geom);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${SERIF}">
<title>${esc(spec.name)} — ${esc(spec.code)}</title>
<desc>${esc(spec.desc)} Generated by tools/build-cards.mjs from data/*.json — do not edit. 63x88mm at 8 units/mm, 3mm bleed. Every number is a printed maximum in the summary strip; nothing on this card is walked by a token, because the tracks are on the player board. The portrait is cropped on the plate's subject, from docs/art/framing.json. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="portrait-window"><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}"/></clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${TALLOW}"/>
  <g clip-path="url(#portrait-window)">
    <image href="${artHref}" x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" preserveAspectRatio="xMidYMid slice"/>
  </g>
  ${strip.wash}
  ${story.wash}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- timber-and-iron frame, rivets at the corners. Both rules follow the card's
       own corner radius, one inside the other, or the frame reads as a square
       box floating in a rounded card. -->
  ${frameRules()}
  ${rivets()}

  <!-- name and card code, maker's-mark small -->
  <text x="${PORTRAIT.x}" y="${NAME_Y}" font-size="31" font-weight="bold">${esc(spec.name)}</text>
  <text x="${TRIM.x + TRIM.w - 24}" y="${CODE_Y}" font-size="15" text-anchor="end" letter-spacing="2" font-family="${SANS}">${esc(spec.code)}</text>
  <text x="${PORTRAIT.x}" y="${KICKER_Y}" font-size="15.5" font-style="italic" fill="${T85}">${esc(spec.kicker)}</text>

  <!-- the summary strip: every number this card has, and none of them moves -->
  ${strip.ink}

  <!-- portrait window rule: the wash bleeds, the ink holds the line -->
  <rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="none" stroke="${SOOT}" stroke-width="2.4"/>

  <!-- the card's working text -->
  <g font-size="${FACT.size}">
    ${textBlock(factLines(spec, geom.wrap), P.x + 2, geom.factY, FACT.size, FACT.lead)}
  </g>
  ${story.ink}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${dieMarks()}
  <path d="M 0,0 H 92 Q 38,40 0,86 Z" fill="${SOOT}" opacity="0.028"/>
  <path d="M ${W},${H} H ${W - 84} Q ${W - 36},${H - 34} ${W},${H - 76} Z" fill="${SOOT}" opacity="0.025"/>
  <g fill="${SOOT}" opacity="0.055">
    <circle cx="150" cy="700" r="1.4"/><circle cx="420" cy="112" r="1.2"/><circle cx="500" cy="470" r="1.3"/>
  </g>
</g>
</svg>
`;
}

/* ---------------------------------------------------------------- the back */

/**
 * One deck's back.
 *
 * A face-down stack has to be identifiable across a table, and there will be
 * many stacks: characters, vehicles, monsters, talismans, modifications, spells,
 * events, quests, items. So the back carries the deck's name — and carries it
 * twice, mirrored across the card's horizontal centre line, so the back has no
 * up and no down. A card dealt either way round reads the same, which is the one
 * thing a back must never fail at.
 *
 * The symmetry is built rather than drawn: the top half is composed once and the
 * bottom half is that same markup under a vertical flip, so the two can never
 * drift apart. The roundel sits on the axis and is drawn once — every motif in
 * components.json is itself symmetrical about that line.
 *
 * Everything else is engine turning: rings and rays struck from the card's own
 * centre, on the ink plate at hairline weight, the way a playing card or a
 * banknote has a ground. It costs the black-and-white edition nothing.
 */
function back(deck) {
  const ink = inkHex(deck.back.ink);
  const B = components.back;
  const cx = W / 2;
  const cy = H / 2;
  const motif = B.motifs[deck.back.motif];
  if (!motif) throw new Error(`components.json declares no motif "${deck.back.motif}"`);

  /* ---- engine-turned ground, struck from the centre ---- */
  const inner = inset(FRAME.inner.inset);
  const rMax = Math.hypot(inner.w, inner.h) / 2;
  const lathe = [];
  for (let i = 1; i <= B.lathe.rings; i++) {
    lathe.push(`<circle cx="${cx}" cy="${cy}" r="${num((rMax * i) / B.lathe.rings)}"/>`);
  }
  for (let i = 0; i < B.lathe.rays; i++) {
    const a = (i * 2 * Math.PI) / B.lathe.rays;
    lathe.push(
      `<path d="M ${num(cx + Math.cos(a) * 44)},${num(cy + Math.sin(a) * 44)} L ${num(cx + Math.cos(a) * rMax)},${num(cy + Math.sin(a) * rMax)}"/>`
    );
  }

  /* ---- the word, fitted to the card rather than hoped to fit ---- */
  const word = deck.back.word;
  const avail = TRIM.w - 96;
  const size = Math.min(B.wordFontSizeMm * U, avail / (word.length * 0.80));
  const span = Math.min(avail, word.length * size * 0.95);

  /* ---- one half, then that same half flipped ---- */
  const roundelR = 78;
  const half =
    `<text x="${cx}" y="${num(cy - roundelR - 30)}" font-size="${num(size)}" text-anchor="middle" ` +
    `textLength="${num(span)}" lengthAdjust="spacing" font-weight="bold" font-family="${SANS}">${esc(word)}</text>` +
    `<path d="M ${num(cx - span / 2)},${num(cy - roundelR - 14)} H ${num(cx + span / 2)}" stroke="${SOOT}" stroke-width="1.4" fill="none"/>`;

  const k = (roundelR * 1.16) / 24;
  const roundel =
    `<circle cx="${cx}" cy="${cy}" r="${roundelR}" fill="${TALLOW}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${roundelR}" fill="none" stroke="${SOOT}" stroke-width="2.6"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${num(roundelR - 7)}" fill="none" stroke="${SOOT}" stroke-width="1"/>` +
    `<g transform="translate(${num(cx - 12 * k)} ${num(cy - 12 * k)}) scale(${num(k)})" fill="none" stroke="${SOOT}" ` +
    `stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${motif}"/></g>`;

  const flip = `matrix(1 0 0 -1 0 ${H})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${SERIF}">
<title>${esc(deck.name)} — the card back</title>
<desc>The back of the ${esc(deck.name.toLowerCase())} deck: the deck's name mirrored across the card's horizontal centre line, over engine turning struck from the centre, with the ${esc(deck.back.motif)} roundel on the axis. Generated by tools/build-cards.mjs from data/components.json - do not edit. ${CARD_MM.w} x ${CARD_MM.h} mm at ${U} units/mm, ${CARD_MM.bleed} mm bleed, ${CARD_MM.corner} mm corner. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="card-inside">${rounded(inner, '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${TALLOW}"/>
  ${rounded(inset(FRAME.outer.inset), `fill="${ink}" opacity="0.30"`)}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <g clip-path="url(#card-inside)" fill="none" stroke="${SOOT}" stroke-width="${components.back.lathe.strokeWidth}" opacity="${components.back.lathe.opacity}">
    ${lathe.join('\n    ')}
  </g>
  ${frameRules()}
  ${rivets()}
  <g>${half}</g>
  <g transform="${flip}">${half}</g>
  ${roundel}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${dieMarks()}
  <g fill="${SOOT}" opacity="0.05">
    <circle cx="118" cy="150" r="1.5"/><circle cx="434" cy="602" r="1.5"/>
  </g>
</g>
</svg>
`;
}

/* --------------------------------------------------------------- the decks */

const vehicles = read('vehicles.json').vehicles;
const monsters = read('monsters.json').monsters;
const characters = read('characters.json').characters;
const peoplesById = new Map(read('peoples.json').peoples.map((p) => [p.id, p]));
const itemData = read('items.json');
/* items.json holds FOUR decks now and the line between them is a class, declared
   on each deck as components.json decks[].sourceFilter and resolved once in
   docs/js/decks.js for this tool, the mint queue and the explorer alike. A
   talisman is an arcane subject with its own back and its own violet; a WEAPON
   and a piece of ARMOUR each got their own back the day a fight stopped being
   about hits; and everything left - the rope, the lantern, the bag, the cloak -
   is the ITEMS deck. The split is data, not a list written out here. */
const deckCards = (prefix) => cardsOfDeck(deckByPrefix(prefix), itemData.items).filter((c) => c.cardCode);
const talismans = deckCards('TAL');
const gear = [...deckCards('ITM'), ...deckCards('WPN'), ...deckCards('ARM')];
const itemClassName = new Map(itemData.classes.map((c) => [c.id, c.name.toLowerCase()]));
const toolkit = read('tools.json').tools.filter((t) => t.cardCode);
const recipeName = new Map(read('recipes.json').recipes.map((r) => [r.id, r.name]));
const modData = read('modifications.json');
const modifications = modData.modifications;
const modClassName = new Map(modData.classes.map((c) => [c.id, c.name.toLowerCase()]));
const commodityName = new Map(read('commodities.json').commodities.map((c) => [c.id, c.name.toLowerCase()]));
const rules = read('rules.json');
const boardTracks = read('playerboard.json').tracks;

/* The BUILDINGS deck. Everything it prints is read off something that already
   exists: the building itself, the recipes that name it as their site, the
   terrain it may stand on, and its own tile's footprint - which is worked out
   through the ground model in data/buildingtiles.json rather than written on
   the building, exactly as tools/build-tiles.mjs works it out. */
const buildingData = read('buildings.json');
/* Through the deck's own filter, not a hand-rolled one: the BUILDINGS deck
   declares `sourceFilter { not: "perTile" }` and docs/js/decks.js is the single
   place that reads it, exactly as the four item decks are resolved. */
const buildings = cardsOfDeck(deckByPrefix('BLD'), buildingData.buildings).filter((b) => b.cardCode);
const buildingCategory = new Map(buildingData.categories.map((c) => [c.id, c.name.toLowerCase()]));
const buildingName = new Map(buildingData.buildings.map((b) => [b.id, b.name]));
const terrainName = new Map(read('terrain.json').terrains.map((t) => [t.id, t.name.toLowerCase()]));
const depositName = new Map(read('deposits.json').deposits.map((d) => [d.id, d.name.toLowerCase()]));
const allRecipes = read('recipes.json').recipes;

/* Which jobs may be run here. `orBuilding` counts: a job that will take this
   building OR another one is still a job somebody may allocate to this one, and
   a reference card that left it off would send a player to the rulebook. */
const jobsAt = new Map();
for (const r of allRecipes) {
  for (const site of [r.site?.building, r.site?.orBuilding]) {
    if (!site) continue;
    if (!jobsAt.has(site)) jobsAt.set(site, []);
    if (!jobsAt.get(site).includes(r.name)) jobsAt.get(site).push(r.name);
  }
}

/* The footprint, from the one place that counts it. A tile's shape is derived,
   so reading it here rather than restating it means a building that grows a
   worker slot and jumps a rung says so on its card by itself. */
const CELL_WORD = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };
const tileOf = new Map();
for (const row of tileSubjects(ROOT)) {
  if (row.kind === 'building') tileOf.set(row.id, row);
}

/* The card and the board have to call a number by the same name. The board's
   letters are the ones a player says out loud, so where a stat has a track the
   card borrows that track's letter rather than components.json's copy of it —
   and validate-data.mjs fails the build if the two ever drift apart. */
const trackLetter = new Map(boardTracks.map((t) => [t.id, t.letter]));
const letterFor = (stat) => trackLetter.get(stat) ?? LETTER_OF[stat];
const cell = (stat, value, tint) => ({ letter: letterFor(stat), value, tint });

/* Strength is the carrying limit as well as the swinging one — the card prints
   the kilograms so nobody multiplies at the table (rules.json carrying). */
const carryKg = (strength) => strength * rules.carrying.kgPerStrength;

const hasRender = (id) => existsSync(join(RENDERS, `${id}.png`));

const specs = [];
const skipped = [];

for (const c of characters) {
  const render = plateIdFor(deckByPrefix('CHR'), c);
  if (!hasRender(render)) { skipped.push(c.cardCode); continue; }
  const kg = carryKg(c.strength);
  specs.push({
    code: c.cardCode, name: c.name, portrait: render,
    kicker: `${peoplesById.get(c.people)?.name || c.people} · ${c.calling}`,
    desc: `Character card: ${c.name}, ${c.calling}. Health ${c.health}, strength ${c.strength}, ${kg}kg carried, ${c.startingGold} coin to start.`,
    /* FIVE boxes now, and it was six. DEFENCE went with the to-hit roll it
       existed to shift: a battle is one opposed total, and what a character
       brings to it besides strength is the gear in their kit slots, which
       changes every time they put something down and so cannot be printed.
       The kilograms are still the only derived number on any card in the game -
       and they mean more than they did, because the coin in the purse is now
       counted against them like everything else (rules.json carrying.coin). */
    stats: [
      cell('health', c.health, 'oxide'),
      cell('strength', c.strength, 'ochre'),
      cell('mana', c.manaCapacity, 'bruise'),
      cell('gold', c.startingGold, 'ochre'),
      cell('carry', kg, 'slate'),
    ],
    facts: c.traits,
    story: c.story,
  });
}

for (const v of vehicles) {
  const render = plateIdFor(deckByPrefix('VEH'), v);
  if (!hasRender(render)) { skipped.push(v.cardCode); continue; }
  specs.push({
    code: v.cardCode, name: v.name, portrait: render,
    kicker: v.mode === 'mounted' ? 'horse' : v.mode,
    desc: `Vehicle card: ${v.name} (${v.mode}). Hull ${v.hull}, ${v.cargoCapacity} bulk of hold.`,
    /* A hull's damage is its HEALTH, on the same letter and the same column a
       character's is: a vehicle in play is dealt a player board of its own and
       run like anybody else (data/playerboard.json). There is no V any more. */
    stats: [
      cell('health', v.hull, 'oxide'),
      cell('cargo', v.cargoCapacity, 'slate'),
    ],
    facts: [v.quirk],
    story: v.story,
  });
}

for (const m of monsters) {
  const render = plateIdFor(deckByPrefix('MON'), m);
  if (!hasRender(render)) { skipped.push(m.cardCode); continue; }
  const opts = ['Slay', m.options.enslave && 'Enslave', m.options.befriend && 'Befriend', m.options.domesticate && 'Domesticate'].filter(Boolean);
  specs.push({
    /* The name is the name. A monster that is one-of-a-kind used to print
       "— unique" after it, which read as part of the creature's name at card
       size and was the only word on any card in the game doing rules work in the
       title. Whether there is one of a thing is a deck rule (monsters.json
       unique), and the deck is where it stays. */
    code: m.cardCode, name: m.name, portrait: render,
    kicker: `${m.element} · ${m.terrains.join(', ')}`,
    desc: `Monster card: ${m.name}, ${m.element}. Health ${m.health}, strength ${m.strength}, armour ${m.armour}, pace ${m.pace}, yields at most ${m.manaYield} mana.`,
    /* SIX boxes, which is components.json statStrip.cells.max exactly, and the
       strip is now full: a seventh number would want a smaller number of numbers.
       Two of them are new and one is gone. ARMOUR replaced DEFENCE - the same
       property, halved and renamed, because in an opposed total a number that
       makes you harder to hit and a number that soaks the hit are one number. It
       is the only card-only figure on any card in the game (statStrip.letters
       $armourNote): a monster's armour is its hide and does not move, where a
       character's is whatever is in their kit slots. PACE is what you have to
       beat to run away, and it is the reason half this deck cannot be run away
       from. The element keeps the last box, as a mark rather than a figure. */
    stats: [
      cell('health', m.health, 'oxide'),
      cell('strength', m.strength, 'ochre'),
      cell('armour', m.armour, 'slate'),
      cell('pace', m.pace, 'verdigris'),
      cell('yield', m.manaYield, 'bruise'),
      { element: m.element, tint: 'soot-tint-12' },
    ],
    facts: [
      `Options: ${opts.join(' · ')}. Run only if your pace beats ${m.pace}.`,
      `Slain, it yields the lesser of ${m.manaYield} and the purple die.`,
      ...(m.gift ? [`Gift to befriend: ${m.gift}.`] : []),
      ...(m.befriended ? [`Befriended: ${m.befriended}`] : []),
      ...(m.enslaved ? [`Enslaved: ${m.enslaved}`] : []),
      ...(m.domesticated ? [`Domesticated: ${m.domesticated}`] : []),
    ],
    story: m.story,
  });
}

for (const t of talismans) {
  const render = plateIdFor(deckByPrefix('TAL'), t);
  if (!hasRender(render)) { skipped.push(t.cardCode); continue; }
  specs.push({
    code: t.cardCode, name: t.name, portrait: render,
    kicker: `talisman · made at the ${t.madeAt}`,
    desc: `Talisman card: ${t.name}. An arcane subject — the mana box rules in bruise.`,
    stats: [
      cell('mana', t.manaCapacity, 'bruise'),
      cell('value', t.baseValue, 'ochre'),
      cell('mass', t.massKg, 'slate'),
    ],
    facts: t.effects,
    story: t.story,
  });
}

/* A modification is a FITTING, and the deck splits in two down its own `class`.

   Seven of them are built out of commodities and weigh something, so they end on
   the two boxes a talisman ends on: what it is worth and what it weighs. The four
   enchantments are bound out of mana instead — no recipe, no value, no mass, and
   printing `¤ 0 · KG 0` on one would be three lies in nine millimetres — so they
   print what the binding costs and the element it is drawn from, which is exactly
   the last box the monster deck already uses for the same job.

   What it FITS is the identity of a fitting, so it goes in the kicker beside the
   class; where it is made is a rule rather than a label — modifications.json slots
   has the vehicle standing at that building for a whole round — so it goes in the
   rules text with the recipe. */
const fitsOf = (m) => (m.fits.includes('any') ? 'fits anything' : `fits ${m.fits.join(', ')}`);

/* Who has to be standing there, when that is not simply the building's own name.
   Half this deck is made where the tradesman IS the building - a weaver at the
   weaver, a carpenter at the carpenter - and "made at the weaver by a weaver" is
   a card saying the same word twice. */
const hand = (m) => (m.specialist && m.specialist !== m.madeAt
  ? ` by a${/^[aeiou]/i.test(m.specialist) ? 'n' : ''} ${m.specialist}`
  : '');

/* The one-per-vehicle limit is on every enchantment card because it is the rule a
   player breaks by accident, and it is read off slots rather than typed here. */
const ENCHANTMENT_LIMIT = modData.slots.enchantmentLimit === 1
  ? 'At most one enchantment on a vehicle.'
  : `At most ${modData.slots.enchantmentLimit} enchantments on a vehicle.`;

for (const m of modifications) {
  const render = plateIdFor(deckByPrefix('MOD'), m);
  if (!hasRender(render)) { skipped.push(m.cardCode); continue; }
  const bound = m.class === 'enchantment';
  const recipe = (m.inputs || []).map((i) => `${i.qty} ${commodityName.get(i.commodity) || i.commodity}`).join(', ');
  specs.push({
    code: m.cardCode, name: m.name, portrait: render,
    kicker: `${modClassName.get(m.class) || m.class} · ${fitsOf(m)}`,
    desc: bound
      ? `Modification card: ${m.name}, ${m.element} enchantment. Costs ${m.manaCost} mana to bind, ${fitsOf(m)}.`
      : `Modification card: ${m.name}, ${m.class}. Worth ${m.baseValue}, weighs ${m.massKg}kg, ${fitsOf(m)}.`,
    stats: bound
      ? [
        cell('mana', m.manaCost, 'bruise'),
        { element: m.element, tint: 'soot-tint-12' },
      ]
      : [
        cell('value', m.baseValue, 'ochre'),
        cell('mass', m.massKg, 'slate'),
      ],
    facts: [
      m.effect,
      bound
        ? `Bound at the ${m.madeAt}. ${ENCHANTMENT_LIMIT}`
        : `Made at the ${m.madeAt}${hand(m)}: ${recipe} · ${m.effortHours} h.`,
    ],
    story: m.story,
  });
}

/* An OBJECT card - a jerkin, a sword, an axe - prints what it is worth, what it
   weighs and how much WEAR is in it, and says everything else it does in words
   underneath.

   The wear box is new and it is there because there is a track under it now:
   four of them, one against each kit slot on the player board. That is the whole
   test the strip has ever applied - a number goes in a lettered box when a token
   walks it, and into a sentence when it does not.

   What still goes into a sentence: what a weapon or a piece of armour is worth
   in a fight. A weapon has a `battle` and a piece of armour has an `armour`, and
   neither of them is the whole truth - the war axe is "+1, and +2 in a battle you
   started", the crossbow is +3 that also takes a point off their armour and only
   counts every second round. Printing the bare 1 next to a letter would be a
   smaller, wronger version of a sentence the card has room for anyway.

   A MONSTER does print its armour, and that is not an inconsistency: a monster's
   armour is its hide and is the same number in every fight it is ever in, where a
   character's is whatever they are wearing this round. */
const recipeLine = (madeAt, specialist, inputs, hours) => {
  const bill = (inputs || []).map((i) => `${i.qty} ${commodityName.get(i.commodity) || i.commodity}`).join(', ');
  return `Made at the ${madeAt}${specialist && specialist !== madeAt ? ` by a${/^[aeiou]/i.test(specialist) ? 'n' : ''} ${specialist}` : ''}: ${bill} · ${hours} h.`;
};

for (const i of gear) {
  const render = plateIdFor(deckByPrefix('ITM'), i);
  if (!hasRender(render)) { skipped.push(i.cardCode); continue; }
  const kind = itemClassName.get(i.class) || i.class;
  /* `slot` is WHERE ON A BODY the thing is worn or held, and a third of this deck
     has none: a potion, a talisman, a lantern and a torch go in a kit slot like
     everything else, but nothing about them is worn anywhere in particular. So
     the segment is omitted rather than emptied, which lands the kicker on exactly
     the form the talismans have always printed - `light · made at the blacksmith`. */
  const worn = i.slot ? ` · ${i.slot}` : '';
  specs.push({
    code: i.cardCode, name: i.name, portrait: render,
    kicker: `${kind}${worn} · made at the ${i.madeAt}`,
    desc: `Item card: ${i.name}, ${kind}. Worth ${i.baseValue}, weighs ${i.massKg}kg, ${i.wear} of wear in it${i.slot ? `, carried in the ${i.slot} slot` : ''}.`,
    stats: [
      cell('wear', i.wear, 'slate'),
      cell('value', i.baseValue, 'ochre'),
      cell('mass', i.massKg, 'slate'),
    ],
    facts: [...i.effects, recipeLine(i.madeAt, i.specialist, i.inputs, i.effortHours)],
    story: i.story,
  });
}

/* A TOOL prints its wear instead of its weight, because wear is the number that
   runs out and weight is a number tools.json has never had. What it ENABLES is
   the point of owning one, so the recipes it gates are named on the card rather
   than left in the rulebook - by name, read off recipes.json, so a renamed job
   renames itself here. */
for (const t of toolkit) {
  const render = plateIdFor(deckByPrefix('TOL'), t);
  if (!hasRender(render)) { skipped.push(t.cardCode); continue; }
  const jobs = (t.enables || []).map((r) => recipeName.get(r) || r);
  specs.push({
    code: t.cardCode, name: t.name, portrait: render,
    kicker: `tool · ${t.family} · made at the ${t.madeAt}`,
    desc: `Tool card: ${t.name}, ${t.family}. ${t.summary} Worth ${t.baseValue}, ${t.baseWear} of wear in it.`,
    stats: [
      cell('wear', t.baseWear, 'slate'),
      cell('value', t.baseValue, 'ochre'),
    ],
    facts: [
      t.summary,
      jobs.length ? `Gates: ${jobs.join(', ')}.` : null,
      recipeLine(t.madeAt, t.specialist, t.craft?.inputs, t.craft?.effortHours),
    ].filter(Boolean),
    story: t.story,
  });
}

/* A BUILDING is the first card in the game that does not replace a piece.
 *
 * Everything else in this box is either a card or a token; a building is both,
 * and each half does what the other cannot. The TILE on the board says where the
 * building stands - which is the only thing a card in somebody's hand can never
 * say - and it pays for that by being 17 mm across, cut to a clump of hexagons,
 * and carrying no numbers at all (data/buildingtiles.json). The CARD says
 * everything the tile had to drop, and shows the page the die cut away.
 *
 * So it prints the plate the tile prints, through a window several times its
 * area: components.json gives this deck plateId `tile-{id}` and plateKind
 * `borrowed`, and no plate is commissioned for it.
 *
 * NOTHING HERE IS AUTHORED. The cost is the building's cost, the jobs are the
 * recipes that name it as their site, the ground is its terrain list and the
 * footprint is the one tools/build-tiles.mjs cuts. A reference card that
 * restated any of it in its own words would be a second copy of the rules, and
 * a second copy is a copy that goes stale.
 */
for (const b of buildings) {
  const render = plateIdFor(deckByPrefix('BLD'), b);
  if (!hasRender(render)) { skipped.push(b.cardCode); continue; }

  const tile = tileOf.get(b.id);
  const lodging = (b.housing || 0) + (b.specialistHousing || 0);

  /* Only the numbers this building actually has. B and R are on all fifty-two -
     the effort to raise it and the rounds it cannot be rushed inside - and the
     rest appear where they are non-zero, which is why the widest card in the
     deck is the manor at four boxes and none comes near the six-cell ceiling. */
  const stats = [
    cell('build', b.buildPoints, 'slate'),
    cell('rounds', b.minRounds, 'soot-tint-12'),
    lodging ? cell('lodging', lodging, 'ochre') : null,
    b.workerSlots ? cell('jobs', b.workerSlots, 'verdigris') : null,
    b.storage ? cell('goods', b.storage, 'oxide') : null,
    b.victoryPoints ? cell('victory', b.victoryPoints, 'bruise') : null,
  ].filter(Boolean);

  const bill = (b.cost || []).map((c) => `${c.qty} ${commodityName.get(c.commodity) || c.commodity}`).join(', ');

  /* WHERE IT MAY STAND, in one sentence built out of the three things that can
     constrain it: the ground, the water beside it, and whatever has to be there
     already. A building with no terrain list stands anywhere, and says so -
     silence would read as an omission. */
  const ground = (b.terrain || []).map((t) => terrainName.get(t) || t);
  const where = [];
  if (ground.length) where.push(`Stands on ${ground.join(', ')}`);
  else where.push('Stands on any ground');
  if (b.orWaterside) where.push(`or on any tile with ${b.orWaterside === 'any' ? '' : `${b.orWaterside} `}water beside it`);
  if (b.waterside) where.push(`and needs ${b.waterside === 'any' ? '' : `${b.waterside} `}water beside it`);
  if (b.requiresBuilding) where.push(`with a ${(buildingName.get(b.requiresBuilding) || b.requiresBuilding).toLowerCase()} already there`);
  if (b.requiresDeposit) where.push(`on a ${depositName.get(b.requiresDeposit) || b.requiresDeposit} deposit`);
  if (b.requiresDepositAny?.length) {
    where.push(`on a deposit of ${b.requiresDepositAny.map((d) => depositName.get(d) || d).join(' or ')}`);
  }

  /* What it holds that has no box on the strip. Three fields, one building each
     - the pasture's animals, the barracks' garrison, the farm's fields - so a
     letter apiece would have spent half the strip on three cards. */
  const holds = [
    b.livestockSlots ? `${b.livestockSlots} animals` : null,
    b.garrison ? `${b.garrison} soldiers` : null,
    b.fieldSlots ? `${b.fieldSlots} fields beside it` : null,
  ].filter(Boolean);

  const jobs = jobsAt.get(b.id) || [];

  specs.push({
    code: b.cardCode, name: b.name, portrait: render,
    kicker: `${buildingCategory.get(b.category) || b.category} · tier ${b.tier}`,
    desc: `Building card: ${b.name}, ${b.category}, tier ${b.tier}. ${b.summary} ` +
      `${b.buildPoints} build points over at least ${b.minRounds} round${b.minRounds === 1 ? '' : 's'}` +
      `${tile ? `, on a ${tile.shape} tile of ${CELL_WORD[tile.cells.length] ?? tile.cells.length} cells` : ''}. ` +
      `The board keeps the tile; this card is the reference for it.`,
    stats,
    facts: [
      b.summary,
      bill ? `Raise it from ${bill}.` : null,
      `${where.join(' ')}.`,
      holds.length ? `Holds ${holds.join(' and ')}.` : null,
      b.specialist ? `Wants a ${b.specialist} to run.` : null,
      jobs.length ? `Work here: ${jobs.join(', ')}.` : null,
      tile ? `Its tile is a ${tile.shape} — ${CELL_WORD[tile.cells.length] ?? tile.cells.length} cell${tile.cells.length === 1 ? '' : 's'}.` : null,
      /* `notes` is NOT on this list, and that is a decision rather than an
         oversight. It is the designer's margin, not the player's: of the five
         buildings that carry one, the granary's says which word in the original
         brief it came from, the hut's and the market's argue for their own price,
         and only the mine's is a rule anybody would look up at a table. Printing
         it cost the whole deck its picture - one twelve-line note on the inn set
         `factMax`, and the window is sized for the wordiest card in the deck, so
         forty-nine cards were letterboxed to carry one card's development
         history. Rules live in the rulebook and reference lives here. */
    ].filter(Boolean),
  });
}

const deckOf = (spec) => DECKS.find((d) => spec.code.startsWith(d.prefix));
const rendered = (prefix) => specs.filter((s) => s.code.startsWith(prefix));

/* ------------------------------------------------------------------ output */

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the adventure deck cards</title>
<style>
  body { margin: 24px; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  h1 { font-size: 22px; } h2 { font-size: 17px; margin: 26px 0 4px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 72ch; }
  .bar { display: flex; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 14px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  .deck { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; }
  /* The window is the card's trim, corner and all: a preview with square corners
     is a preview of a card nobody is going to cut. ${CARD_MM.corner}mm at this
     scale, from data/components.json. */
  .deck object { width: 276px; height: 376px; border: 1px solid ${T25}; background: ${TALLOW};
                 border-radius: ${num(CARD_MM.corner * 276 / (CARD_MM.w + 2 * CARD_MM.bleed))}px; }
</style>
</head>
<body>
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <a href="../tiles/index.html">The building tiles</a>
  <a href="../boards/index.html">The player board</a>
  <a href="../markets/index.html">The market board</a>
  <a href="../ledger/index.html">The price ledger</a>
  <a href="../mint/index.html">The mint</a>
  <a class="primary" href="print.html">Print &amp; cut the cards →</a>
</div>
<h1>The adventure deck cards</h1>
<p class="note">Generated by <code>tools/build-cards.mjs</code> from <code>data/*.json</code> and the accepted
plates in <code>docs/art/renders/</code> — edit those, re-run the tool, and never these files. Only cards whose
plate has been accepted are rendered${skipped.length ? ` (still waiting on renders: ${skipped.join(', ')})` : ''}.
Each card is shown here with its 3&nbsp;mm bleed; <a href="print.html">the print page</a> lays them out on paper
at their true ${CARD_MM.w} × ${CARD_MM.h}&nbsp;mm, cut lines and all.</p>
${DECKS.map(({ prefix, name: title }) => {
  const deck = rendered(prefix);
  if (!deck.length) return '';
  return `<h2>${title}</h2>\n<div class="deck">\n${deck.map((s) => `  <object data="${s.code}.svg" type="image/svg+xml" aria-label="${esc(s.name)}"></object>`).join('\n')}\n</div>`;
}).join('\n')}
<h2>The backs</h2>
<p class="note">One per deck, so a face-down stack is identifiable across the table. Each carries its deck's
name mirrored across the card's horizontal centre line — a back with an up and a down is a back that gives
the card away. Described in <code>data/components.json</code> under <code>back</code>, and generated with
the fronts.</p>
<div class="deck">
${DECKS.map((d) => `  <object data="back-${d.prefix}.svg" type="image/svg+xml" aria-label="${esc(d.name)} — the card back"></object>`).join('\n')}
</div>
</body>
</html>
`;

/**
 * The print-and-cut page: pick cards, get sheets of them at true size with a
 * dotted line to cut along.
 *
 * The card SVGs carry 3mm of bleed, which is for a printer that trims; this page
 * is for scissors, so each card is shown through a window the size of the trim
 * and the bleed is held outside it. That is the whole trick — the cards come off
 * the paper at exactly ${CARD_MM.w} × ${CARD_MM.h} mm, which is the size of the
 * playing card you are gluing them to.
 */
const print = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Print the cards — game1</title>
<link rel="stylesheet" href="../css/app.css">
<style>
  /* Screen: a control bar, a card picker, and a stack of sheet previews.
     Print: one sheet per page, at true size, and nothing else.

     Prefixed like the map's print page, and for the same reason: app.css already
     owns .bar, .card and .sheet, and a page-local rule that sets only what it
     cares about inherits the rest of whatever else claims the name. */
  .printbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 18px;
              align-items: center; padding: 11px 18px; background: var(--bg-raised);
              border-bottom: 1px solid var(--line); }
  .printbar h1 { font-size: .95rem; margin: 0; }
  .printbar .spacer { flex: 1; }
  .printbar label { font-size: .78rem; color: var(--ink-soft); display: flex; gap: 5px; align-items: center; }
  .printbar select, .printbar button, .printbar input[type=number] {
    font: inherit; font-size: .8rem; padding: 4px 9px; border-radius: 7px;
    border: 1px solid var(--line-strong); background: var(--bg); color: var(--ink); }
  .printbar input[type=number] { width: 4.2em; }
  .printbar button { cursor: pointer; }
  .printbar button:hover { border-color: var(--accent); }
  .printbar button.primary { background: var(--accent); border-color: var(--accent); color: var(--bg-raised); font-weight: 600; }
  .printbar a { color: var(--accent); font-size: .78rem; }

  .note { max-width: 68ch; margin: 18px auto 4px; padding: 0 18px; color: var(--ink-soft); font-size: .85rem; }
  .note p { margin: 0 0 6px; }
  .note strong { color: var(--ink); }

  /* The picker: every card that has a plate, grouped by deck, click to include. */
  .picker { max-width: 68ch; margin: 0 auto; padding: 0 18px 6px; }
  .picker h2 { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase;
               color: var(--ink-faint); margin: 12px 0 6px; display: flex; gap: 10px; align-items: baseline; }
  .picker h2 button { font: inherit; font-size: .72rem; text-transform: none; letter-spacing: 0;
                      background: none; border: none; color: var(--accent); cursor: pointer; padding: 0; }
  .pickrow { display: flex; flex-wrap: wrap; gap: 6px; }
  .pick { display: flex; gap: 6px; align-items: center; font-size: .78rem; cursor: pointer;
          border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px 3px 7px; background: var(--bg-raised); }
  .pick[data-on="0"] { opacity: .45; }
  .pick .code { font-family: var(--mono); font-size: .7rem; color: var(--ink-faint); }

  .sheets { padding: 18px; overflow-x: auto; }
  .sheet-frame { width: max-content; margin: 0 auto 22px; }
  .sheet-frame:last-child { margin-bottom: 0; }
  .cardsheet { position: relative; background: #fff; box-shadow: var(--shadow); overflow: hidden;
               transform-origin: top left; }

  /* One slot is one card at its true trim size. The SVG inside is bigger than
     the slot by its bleed and is pulled up and left by exactly that much, so
     what shows through is the trim and nothing else. */
  /* The slot is the card's trim, corner and all - the radius is
     data/components.json stock.card.cornerRadiusMm, and it is the same radius
     the guide is drawn at, because the guide is where the blade goes. */
  .slot { position: absolute; overflow: hidden; border-radius: ${CARD_MM.corner}mm; }
  .slot object { position: absolute; display: block; border: 0; }
  .guide { position: absolute; inset: 0; border: 0.2mm dashed #8c8c8c; pointer-events: none;
           border-radius: ${CARD_MM.corner}mm; }
  .stamp { position: absolute; font: 600 7px/1.2 var(--mono, monospace); color: #777; letter-spacing: .05em; }
  .empty { padding: 40px 18px; text-align: center; color: var(--ink-faint); font-size: .85rem; }

  /* Nothing that is only there to make the preview readable may survive into
     print: the promise of this page is that a card comes off the paper at the
     size it says, which a sheet printed at 86% quietly breaks. */
  @media print {
    .printbar, .note, .picker { display: none !important; }
    .sheets { padding: 0; overflow: visible; }
    .sheet-frame { width: auto !important; height: auto !important; margin: 0 !important;
                   break-after: page; page-break-after: always; }
    .sheet-frame:last-child { break-after: auto; page-break-after: auto; }
    .cardsheet { box-shadow: none; margin: 0; transform: none !important; }
  }
</style>
</head>
<body>

<div class="printbar">
  <h1>Print &amp; cut the cards</h1>
  <label>paper
    <select id="paper">
      <option value="A4">A4 — 210 × 297 mm</option>
      <option value="letter">US Letter — 216 × 279 mm</option>
    </select>
  </label>
  <label>spacing
    <select id="spacing">
      <option value="4">4 mm between cards</option>
      <option value="2">2 mm — tight</option>
      <option value="5">5 mm — roomy</option>
    </select>
  </label>
  <label>copies <input type="number" id="copies" min="1" max="20" step="1" value="1"></label>
  <label><input type="checkbox" id="opt-guides" checked> cut lines</label>
  <label>preview
    <select id="zoom">
      <option value="fit">fit the window</option>
      <option value="1">100%</option>
      <option value="0.5">50%</option>
    </select>
  </label>
  <span class="spacer"></span>
  <a href="index.html">← the cards</a>
  <a href="../index.html">Explorer</a>
  <button type="button" class="primary" id="go-print">Print / save as PDF…</button>
</div>

<div class="note">
  <p id="summary"></p>
  <p><strong>Print at 100% — no “fit to page”, no scaling</strong> — then cut along the dotted lines. Every card
  comes off the sheet at ${CARD_MM.w} × ${CARD_MM.h} mm, the size of a standard playing card, so a cut card glues
  straight onto one. The dotted line is the cut: it sits on the card's edge, and the ${CARD_MM.bleed} mm of bleed
  each card is drawn with stays outside the window, where the blade never goes. For a file rather than paper,
  print and choose <strong>Save as PDF</strong> — the page size is already set, so the PDF is true size too.</p>
  <p>The corners are round — ${CARD_MM.corner} mm, which is what a playing card actually has. The guide is
  drawn on that radius, and each card carries a faint arc in its bleed showing where the die goes. Cut the
  straights with a blade and take the corners with a ${CARD_MM.corner} mm punch, or trust your scissors: gluing
  a square-cut card onto a rounded one hides the difference anyway.</p>
  <p><strong>Backs</strong> are under <em>Card backs</em> in the picker, one per deck. Print a sheet of the
  backs you need, feed the paper through again, and print the fronts — or glue the two sheets back to back,
  which is what most people's printers make them do.</p>
</div>

<div class="picker" id="picker"></div>
<div class="sheets" id="sheets"></div>

<script>
(function () {
  'use strict';

  /* Generated by tools/build-cards.mjs — the cards whose plates are accepted. */
  var CARDS = ${JSON.stringify(
    [
      ...specs.map((s) => ({ code: s.code, name: s.name, deck: deckOf(s).prefix })),
      ...DECKS.map((d) => ({ code: `back-${d.prefix}`, name: `${d.name} back`, deck: 'BACK' })),
    ],
    null, 0)};
  /* The backs are their own group in the picker: you print a sheet of them, not
     one alongside its front. Duplex is below. */
  var DECKS = ${JSON.stringify(
    [...DECKS.map((d) => ({ prefix: d.prefix, name: d.name })), { prefix: 'BACK', name: 'Card backs' }],
    null, 0)};

  var CARD_W = ${CARD_MM.w}, CARD_H = ${CARD_MM.h}, BLEED = ${CARD_MM.bleed};
  var SVG_W = CARD_W + 2 * BLEED, SVG_H = CARD_H + 2 * BLEED;
  var PAPER = { A4: [210, 297], letter: [215.9, 279.4] };
  /* What a home printer will not print in. The cut line sits on the card, not in
     the margin, so this only has to keep the cards off the paper's edge. */
  var MIN_MARGIN = 5;

  var chosen = {};
  CARDS.forEach(function (c) { chosen[c.code] = true; });

  /* ------------------------------------------------------------- the picker */

  var picker = document.getElementById('picker');
  DECKS.forEach(function (deck) {
    var cards = CARDS.filter(function (c) { return c.deck === deck.prefix; });
    if (!cards.length) return;
    var head = document.createElement('h2');
    head.textContent = deck.name + ' ';
    ['all', 'none'].forEach(function (which) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = which;
      b.addEventListener('click', function () {
        cards.forEach(function (c) { chosen[c.code] = which === 'all'; });
        syncPicker();
        render();
      });
      head.appendChild(b);
    });
    picker.appendChild(head);

    var row = document.createElement('div');
    row.className = 'pickrow';
    cards.forEach(function (c) {
      var label = document.createElement('label');
      label.className = 'pick';
      label.dataset.code = c.code;
      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = true;
      box.addEventListener('change', function () {
        chosen[c.code] = box.checked;
        syncPicker();
        render();
      });
      var code = document.createElement('span');
      code.className = 'code';
      code.textContent = c.code;
      label.appendChild(box);
      label.appendChild(code);
      label.appendChild(document.createTextNode(c.name));
      row.appendChild(label);
    });
    picker.appendChild(row);
  });

  function syncPicker() {
    Array.prototype.forEach.call(picker.querySelectorAll('.pick'), function (label) {
      var on = !!chosen[label.dataset.code];
      label.dataset.on = on ? '1' : '0';
      label.querySelector('input').checked = on;
    });
  }

  /* -------------------------------------------------------------- the sheets */

  function grid(paper, gap) {
    var size = PAPER[paper] || PAPER.A4;
    var cols = Math.max(1, Math.floor((size[0] - 2 * MIN_MARGIN + gap) / (CARD_W + gap)));
    var rows = Math.max(1, Math.floor((size[1] - 2 * MIN_MARGIN + gap) / (CARD_H + gap)));
    return {
      w: size[0], h: size[1], cols: cols, rows: rows, gap: gap,
      left: (size[0] - (cols * CARD_W + (cols - 1) * gap)) / 2,
      top: (size[1] - (rows * CARD_H + (rows - 1) * gap)) / 2,
    };
  }

  var current = null;

  function render() {
    var gap = parseFloat(document.getElementById('spacing').value);
    var g = grid(document.getElementById('paper').value, gap);
    var copies = Math.max(1, Math.min(20, parseInt(document.getElementById('copies').value, 10) || 1));
    var guides = document.getElementById('opt-guides').checked;

    /* Copies go out deck by deck, all of card one before card two: a cut stack
       then sorts itself, and a half-printed sheet is still a usable deck. */
    var queue = [];
    CARDS.forEach(function (c) {
      if (!chosen[c.code]) return;
      for (var i = 0; i < copies; i++) queue.push(c);
    });

    var perSheet = g.cols * g.rows;
    var sheets = Math.ceil(queue.length / perSheet);

    document.getElementById('summary').innerHTML = queue.length
      ? '<strong>' + queue.length + ' card' + (queue.length === 1 ? '' : 's') + ' on ' + sheets +
        ' sheet' + (sheets === 1 ? '' : 's') + '</strong> of ' +
        (document.getElementById('paper').value === 'A4' ? 'A4' : 'US Letter') + ', ' +
        g.cols + ' across by ' + g.rows + ' down, ' + gap + ' mm apart.'
      : '<strong>Nothing chosen.</strong> Pick some cards below.';

    var host = document.getElementById('sheets');
    host.innerHTML = '';

    var style = document.getElementById('pagesize') || document.createElement('style');
    style.id = 'pagesize';
    style.textContent = '@page { size: ' + g.w + 'mm ' + g.h + 'mm; margin: 0; }';
    document.head.appendChild(style);

    if (!queue.length) {
      var none = document.createElement('p');
      none.className = 'empty';
      none.textContent = 'No cards chosen.';
      host.appendChild(none);
      current = null;
      return;
    }

    for (var s = 0; s < sheets; s++) {
      var sheet = document.createElement('div');
      sheet.className = 'cardsheet';
      sheet.style.width = g.w + 'mm';
      sheet.style.height = g.h + 'mm';

      for (var i = 0; i < perSheet; i++) {
        var card = queue[s * perSheet + i];
        if (!card) break;
        var col = i % g.cols, row = Math.floor(i / g.cols);

        var slot = document.createElement('div');
        slot.className = 'slot';
        slot.style.left = (g.left + col * (CARD_W + g.gap)) + 'mm';
        slot.style.top = (g.top + row * (CARD_H + g.gap)) + 'mm';
        slot.style.width = CARD_W + 'mm';
        slot.style.height = CARD_H + 'mm';

        /* <object>, not <img>: an SVG in an <img> is not allowed to fetch the
           plate it draws, and the plate is the card. */
        var obj = document.createElement('object');
        obj.type = 'image/svg+xml';
        obj.data = card.code + '.svg';
        obj.setAttribute('aria-label', card.name);
        obj.style.left = '-' + BLEED + 'mm';
        obj.style.top = '-' + BLEED + 'mm';
        obj.style.width = SVG_W + 'mm';
        obj.style.height = SVG_H + 'mm';
        slot.appendChild(obj);

        if (guides) {
          var guide = document.createElement('div');
          guide.className = 'guide';
          slot.appendChild(guide);
        }
        sheet.appendChild(slot);
      }

      var stamp = document.createElement('div');
      stamp.className = 'stamp';
      stamp.style.left = g.left + 'mm';
      stamp.style.top = (g.top + g.rows * CARD_H + (g.rows - 1) * g.gap + 2.5) + 'mm';
      stamp.textContent = 'GAME1  ·  SHEET ' + (s + 1) + ' OF ' + sheets +
        '  ·  CARDS ' + CARD_W + ' × ' + CARD_H + ' MM AT 100%';
      sheet.appendChild(stamp);

      var frame = document.createElement('div');
      frame.className = 'sheet-frame';
      frame.appendChild(sheet);
      host.appendChild(frame);
    }

    current = g;
    applyScale();
  }

  /* -------------------------------------------------------- preview scale */

  /* CSS fixes the millimetre at exactly 96/25.4 px, so this needs no measuring. */
  var MM = 96 / 25.4;
  var zoom = document.getElementById('zoom');

  function applyScale(force) {
    if (!current) return;
    var host = document.getElementById('sheets');
    var wanted = force === undefined ? zoom.value : force;
    var wpx = current.w * MM, hpx = current.h * MM;
    var room = host.clientWidth - 36;
    var scale = wanted === 'fit' ? Math.min(1, room / wpx) : parseFloat(wanted) || 1;

    Array.prototype.forEach.call(host.children, function (frame) {
      var sheet = frame.firstElementChild;
      if (!sheet || scale >= 1) {
        if (sheet) sheet.style.transform = '';
        frame.style.width = '';
        frame.style.height = '';
      } else {
        sheet.style.transform = 'scale(' + scale + ')';
        frame.style.width = Math.round(wpx * scale) + 'px';
        frame.style.height = Math.round(hpx * scale) + 'px';
      }
    });
  }

  ['paper', 'spacing', 'copies', 'opt-guides'].forEach(function (id) {
    document.getElementById(id).addEventListener('change', render);
  });
  zoom.addEventListener('change', function () { applyScale(); });
  window.addEventListener('resize', function () { applyScale(); });

  /* The @media print rules undo the preview scale on their own. This is the belt
     to that pair of braces: a card must never reach paper at 86%. */
  window.addEventListener('beforeprint', function () { applyScale(1); });
  window.addEventListener('afterprint', function () { applyScale(); });
  document.getElementById('go-print').addEventListener('click', function () { window.print(); });

  syncPicker();
  render();
})();
</script>
</body>
</html>
`;

const wanted = new Map();
for (const deck of DECKS) {
  const cards = rendered(deck.prefix);
  if (cards.length) {
    const geom = deckGeometry(cards, deck);
    for (const spec of cards) wanted.set(`${spec.code}.svg`, card(spec, geom));
  }
  /* Every declared deck gets a back, cards or no cards. A deck that is still
     waiting on its plates is still a deck, and its back is still what tells it
     apart from the stack next to it. */
  wanted.set(`back-${deck.prefix}.svg`, back(deck));
}
wanted.set('index.html', index);
wanted.set('print.html', print);

if (unframed.length) {
  console.warn(`warning  no entry in docs/art/framing.json for ${[...new Set(unframed)].join(', ')} ` +
    '- those cards are framed on the middle of the plate, which is what framing.json exists to stop.');
}

if (noStory.length) {
  console.warn(`warning  no story on ${noStory.join(', ')} - those cards print a blank rail. ` +
    'The story belongs in that card\'s own data file, beside its name.');
}

/* A DECK THIS TOOL CANNOT SET. Every loop above is one deck, written out by
   hand, and until now nothing checked that the list of loops covers the list of
   decks: a card no loop ever reached lands in neither `specs` nor `skipped`, so
   the tool said nothing at all about it and the deck simply did not appear in
   docs/cards/. That silence was harmless while the only decks turned on were the
   ones with loops. It stopped being harmless the day the spells, events and
   quests briefs were written and those three decks were put in the mint queue:
   they are declared, backed, briefed and drawable now, and an accepted plate for
   one of them would land on nothing and say nothing.

   The sweep is the two lists against every deck's own cards, so it needs no
   third list to be kept in step with the loops - the failure mode this whole
   repository is built to refuse. What it CANNOT do is write the missing half: a
   card is a picture and the words beside it, and an event card's rules text has
   not been written. That is content and it goes in the card's own file. */
const setByThisTool = new Set([...specs.map((s) => s.code), ...skipped]);
const unset = [];
for (const deck of DECKS) {
  const missing = mintCardsOfDeck(ROOT, deck).filter((c) => !setByThisTool.has(c.cardCode));
  if (!missing.length) continue;
  const drawn = missing.filter((c) => hasRender(plateIdFor(deck, c))).length;
  unset.push(`${deck.name} (${missing.length} card${missing.length === 1 ? '' : 's'}` +
    `${drawn ? `, ${drawn} with an accepted plate already` : ''})`);
}
if (unset.length) {
  console.warn(`warning  this tool has no loop for ${unset.join(', ')} - those decks are declared ` +
    'and minting, and their plates land on nothing. A deck is turned on for the ARTIST by its brief; ' +
    'it is turned on for the TABLE by the rules text that goes beside the picture, in each card\'s own file.');
}

if (checkOnly) {
  let stale = false;
  for (const [name, content] of wanted) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, name), 'utf8'); } catch { /* absent is stale */ }
    if (current !== content) { console.error(`docs/cards/${name} is stale.`); stale = true; }
  }
  for (const f of readdirSync(OUT_DIR)) {
    if ((f.endsWith('.svg') || f.endsWith('.html')) && !wanted.has(f)) {
      console.error(`docs/cards/${f} is no longer generated.`);
      stale = true;
    }
  }
  if (stale) { console.error('Run: node tools/build-cards.mjs'); process.exit(1); }
  console.log(`docs/cards/ is up to date (${specs.length} cards)`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) {
    if ((f.endsWith('.svg') || f.endsWith('.html')) && !wanted.has(f)) unlinkSync(join(OUT_DIR, f));
  }
  for (const [name, content] of wanted) writeFileSync(join(OUT_DIR, name), content, 'utf8');
  console.log(`wrote ${specs.length} cards + index.html + print.html to docs/cards/` +
    (skipped.length ? ` — no render yet for ${skipped.join(', ')}` : ''));
}
