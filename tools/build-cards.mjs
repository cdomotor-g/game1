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
 * the bars are numbered in ink and only *tinted* in wash.
 *
 * Only cards whose plate exists are rendered — a card with no accepted render
 * is not a card yet. Output: docs/cards/<CODE>.svg, docs/cards/index.html and
 * docs/cards/print.html, the sheets you cut cards out of.
 *
 * Card anatomy (docs/art/06-components.md, "The adventure decks"):
 *   name and card code at the top · portrait across the middle · story low ·
 *   HARM bar on the LEFT edge (oxide) · CAPACITY bar on the RIGHT edge
 *   (slate for cargo and for a character's burden in kg, bruise for mana —
 *   mana is arcane) · numbered from the bottom, walked by a token · a card
 *   with no bar leaves the edge quiet.
 *
 * A character carries two capacities — kilograms and, sometimes, mana — and
 * the edge only holds one bar. Burden keeps the edge, because every character
 * has one; mana comes inboard and lies on the portrait, on its own paper.
 *
 * The portrait window is not a fixed box. A deck's plates have one shape (the
 * figures are drawn on A4 pages, the talismans square, the vehicles 3:2) and a
 * deck's cards need one amount of room for their words, so each deck gets the
 * tallest window its own worst card leaves free, in its own plates' proportion.
 * What goes *in* that window is a crop taken around the plate's subject, from
 * docs/art/framing.json — see tools/lib/framing.mjs. Framing on the middle of
 * the file is what used to put a character's chin at the top of their own card.
 *
 * Usage: node tools/build-cards.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pngSize } from './lib/png.mjs';
import { crop, readFraming, WHOLE_PLATE } from './lib/framing.mjs';
import { plateIdFor } from './lib/plates.mjs';

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
const FOXING = palette.paper.foxing.hex;
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
   words cost; the picture gets whatever is left. */
const FACT = { size: 18, lead: 22, wrap: 44 };
const STORY = { size: 16.5, lead: 19.5, wrap: 58, max: 5 };
const STORY_BASE = 694;            // baseline of the last line of flavour text
const GAP = 26;                    // plate to rules, and rules to the flavour panel
const PORTRAIT = { x: 88, w: 376 };  // the window runs between the two bars
/* The flattest a window may get. A 3:2 plate would rather be shown in a 3:2
   slot, but below about this the window stops reading as a plate on a page and
   starts reading as a letterbox slot cut in one. */
const FLATTEST = 1.34;

/* ------------------------------------------------------- shared card shapes */

/**
 * The element badge: the element's mark inside a ring, in the element's ink.
 *
 * A ring rather than a filled disc, because 04-iconography.md gives the filled
 * circle to commodities. The mark is authored edge to edge on a 24-grid and is
 * pulled in about its centre here, or the ends of its ground line cross the ring.
 */
function elementMark(id, cx, cy, r) {
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
      `<text x="${cx + r + 9}" y="${cy + 5}" font-size="13" letter-spacing="1.5" font-family="${SANS}" fill="${T85}">${e.name.toUpperCase()}</text>`,
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
 * A vertical numbered bar: `cells` boxes of `step` each, numbered from the
 * bottom, hung between yTop and yBottom on the given edge. The wash tints the
 * column; the ink draws the ladder, so the bar survives the mono edition.
 *
 * `unit` sets a second, smaller label line above the first — a bar counting
 * kilograms has to say so, and "BURDEN kg" on one line runs into the frame.
 * `onArt` is for a bar that hangs over the portrait rather than beside it: it
 * lays its own paper down first, because a ladder read off a drawing is not a
 * ladder. That paper is wash, which costs the mono edition nothing — the
 * portrait is wash too, so the ink plate has bare paper there already.
 */
function bar({ x, yTop, yBottom, cells, step, colour, label, unit, harm, onArt }) {
  const wBox = 30;
  const hAll = yBottom - yTop;
  const hCell = hAll / cells;
  const labels = unit ? [label, unit] : [label];
  const labelTop = yTop - 8 - (labels.length - 1) * 12;
  let wash = onArt
    ? `<rect x="${x - 7}" y="${num(labelTop - 12)}" width="${wBox + 14}" height="${num(yBottom - labelTop + 19)}" fill="${TALLOW}" opacity="0.93"/>`
    : '';
  wash += `<rect x="${x}" y="${num(yTop)}" width="${wBox}" height="${num(hAll)}" fill="${colour}" opacity="0.28"/>`;
  let ink = `<rect x="${x}" y="${num(yTop)}" width="${wBox}" height="${num(hAll)}" fill="none" stroke="${SOOT}" stroke-width="2"/>`;
  const nums = [];
  for (let i = 1; i <= cells; i++) {
    const yLine = yBottom - i * hCell;
    if (i < cells) ink += `<path d="M ${x},${num(yLine)} H ${x + wBox}" stroke="${SOOT}" stroke-width="1.1"/>`;
    /* harm bars carry the notch-down mark on the ink plate (06-components.md),
       so harm vs capacity survives the black-and-white edition */
    if (harm) ink += `<path d="M ${x - 1},${num(yLine + hCell / 2 - 4)} l 5,4 l -5,4" fill="none" stroke="${SOOT}" stroke-width="1.4"/>`;
    nums.push(`<text x="${x + wBox / 2 + (harm ? 3 : 0)}" y="${num(yBottom - (i - 0.5) * hCell + 4.5)}" font-size="13.5" text-anchor="middle" font-family="${SANS}">${i * step}</text>`);
  }
  ink += `<g fill="${SOOT}">${nums.join('')}</g>`;
  ink += labels.map((line, i) =>
    `<text x="${x + wBox / 2}" y="${num(labelTop + i * 12)}" font-size="${i && unit ? 9 : 10}" text-anchor="middle" letter-spacing="1.1" font-family="${SANS}" fill="${T70}">${esc(line)}</text>`
  ).join('');
  return { wash, ink };
}

/** Nice step so a big capacity still fits a walkable ladder. 14 cells is the
    most the edge holds, and every harm bar in the data fits it at step 1 —
    a harm track must never skip-count. */
function barScale(total) {
  const { steps, maxCells } = components.bars;
  for (const step of steps) {
    if (total / step <= maxCells) return { cells: Math.ceil(total / step), step };
  }
  const last = steps[steps.length - 1];
  return { cells: Math.ceil(total / last), step: last };
}

/* ------------------------------------------------------------------ framing */

/** The plate's pixel size, cached — one IHDR read per file, not one decode. */
const plateSizes = new Map();
function plateSize(id) {
  if (!plateSizes.has(id)) plateSizes.set(id, pngSize(join(RENDERS, `${id}.png`)));
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
function deckGeometry(deck) {
  const factMax = Math.max(...deck.map((s) => factLines(s).length));
  const storyMax = Math.max(...deck.map((s) => storyLines(s).length));

  const storyY = STORY_BASE - (storyMax - 1) * STORY.lead;
  const panelTop = storyY - GAP;
  /* Under the kicker — which sits a line lower on a card carrying an element. */
  const top = (deck[0].element ? 124 : 102) + GAP;
  /* The last line of rules text may come down to a line's clearance of the panel. */
  const factFloor = panelTop - FACT.lead;

  const plate = plateSize(deck[0].portrait);
  const room = (factFloor - top) - GAP - (factMax - 1) * FACT.lead;
  const wanted = PORTRAIT.w / (plate.width / plate.height);
  const height = Math.round(Math.min(room, Math.max(wanted, PORTRAIT.w / FLATTEST)));
  const y = Math.round(top + (room - height) / 2);

  const window = { x: PORTRAIT.x, y, w: PORTRAIT.w, h: height };
  return { window, factY: y + height + GAP, storyY, panelTop };
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

const factLines = (spec) => (spec.facts || []).flatMap((f) => wrap(f, FACT.wrap));
const storyLines = (spec) => wrap(spec.story, STORY.wrap).slice(0, STORY.max);

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

  const bars = [];
  if (spec.left) bars.push(bar({ x: TRIM.x + 24, yTop: P.y + 26, yBottom: 576, ...barScale(spec.left.total), colour: OXIDE, label: spec.left.label, harm: true }));
  if (spec.right) bars.push(bar({ x: TRIM.x + TRIM.w - 54, yTop: P.y + 26, yBottom: 576, ...barScale(spec.right.total), colour: spec.right.colour, label: spec.right.label, unit: spec.right.unit }));
  /* A second capacity bar has nowhere on the edge left to go, so it comes
     inboard and lies on the portrait — and it stops at the foot of the window,
     because below that the rules text is already using the width. */
  if (spec.inner) bars.push(bar({ x: TRIM.x + TRIM.w - 104, yTop: P.y + 26, yBottom: P.y + P.h - 26, ...barScale(spec.inner.total), colour: spec.inner.colour, label: spec.inner.label, onArt: true }));

  const elementBadge = spec.element ? elementMark(spec.element, TRIM.x + 24 + MARK.onCard.radius, 68, MARK.onCard.radius) : null;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${SERIF}">
<title>${esc(spec.name)} — ${esc(spec.code)}</title>
<desc>${esc(spec.desc)} Generated by tools/build-cards.mjs from data/*.json — do not edit. 63x88mm at 8 units/mm, 3mm bleed. The portrait is cropped on the plate's subject, from docs/art/framing.json. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="portrait-window"><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}"/></clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${TALLOW}"/>
  <g clip-path="url(#portrait-window)">
    <image href="${artHref}" x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" preserveAspectRatio="xMidYMid slice"/>
  </g>
  ${bars.map((b) => b.wash).join('\n  ')}
  ${elementBadge ? elementBadge.wash : ''}
  <rect x="${TRIM.x}" y="${num(geom.panelTop)}" width="${TRIM.w}" height="${num(TRIM.y + TRIM.h - geom.panelTop + 2)}" fill="${T12}" opacity="0.5"/>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- timber-and-iron frame, rivets at the corners. Both rules follow the card's
       own corner radius, one inside the other, or the frame reads as a square
       box floating in a rounded card. -->
  ${frameRules()}
  ${rivets()}

  <!-- name and card code, maker's-mark small -->
  <text x="${TRIM.x + 24}" y="${spec.element ? 102 : 80}" font-size="31" font-weight="bold">${esc(spec.name)}</text>
  <text x="${TRIM.x + TRIM.w - 24}" y="60" font-size="15" text-anchor="end" letter-spacing="2" font-family="${SANS}">${esc(spec.code)}</text>
  <text x="${TRIM.x + 24}" y="${spec.element ? 102 + 22 : 102}" font-size="15.5" font-style="italic" fill="${T85}">${esc(spec.kicker)}</text>
  ${elementBadge ? elementBadge.ink : ''}

  <!-- portrait window rule: the wash bleeds, the ink holds the line -->
  <rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="none" stroke="${SOOT}" stroke-width="2.4"/>

  ${bars.map((b) => b.ink).join('\n  ')}

  <!-- the card's working text -->
  <g font-size="${FACT.size}">
    ${textBlock(factLines(spec), P.x + 2, geom.factY, FACT.size, FACT.lead)}
  </g>
  <path d="M ${TRIM.x + 24},${num(geom.storyY - 22)} H ${TRIM.x + TRIM.w - 24}" stroke="${SOOT}" stroke-width="1.2"/>
  <g font-style="italic" fill="${T85}">
    ${textBlock(storyLines(spec), TRIM.x + 26, geom.storyY, STORY.size, STORY.lead)}
  </g>
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${dieMarks()}
  <path d="M 0,0 H 92 Q 38,40 0,86 Z" fill="${SOOT}" opacity="0.028"/>
  <path d="M ${W},${H} H ${W - 84} Q ${W - 36},${H - 34} ${W},${H - 76} Z" fill="${SOOT}" opacity="0.025"/>
  <g fill="${SOOT}" opacity="0.055">
    <circle cx="150" cy="700" r="1.4"/><circle cx="420" cy="112" r="1.2"/><circle cx="500" cy="470" r="1.3"/>
  </g>
  <circle cx="470" cy="676" r="26" fill="none" stroke="${FOXING}" stroke-width="4" opacity="0.5"/>
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
const talismans = read('items.json').items.filter((i) => i.class === 'talisman');

const hasRender = (id) => existsSync(join(RENDERS, `${id}.png`));

const specs = [];
const skipped = [];

for (const c of characters) {
  const render = plateIdFor(deckByPrefix('CHR'), c);
  if (!hasRender(render)) { skipped.push(c.cardCode); continue; }
  specs.push({
    code: c.cardCode, name: c.name, portrait: render,
    /* Strength sits in the kicker rather than on a bar: it is a rating, not a
       quantity that moves, and it is read off the card by whoever is fighting
       this character as often as by the player holding it - exactly the way a
       monster card carries its own. The board's S track is set from here. */
    kicker: `${peoplesById.get(c.people)?.name || c.people} · ${c.calling} · strength ${c.strength}`,
    desc: `Character card: ${c.name}, ${c.calling}, strength ${c.strength}. Health up the left edge, ${c.carryKg}kg of burden up the right${c.manaCapacity ? ', mana inboard of it' : ''}.`,
    left: { total: c.health, label: 'HEALTH' },
    right: { total: c.carryKg, label: 'BURDEN', unit: 'kg', colour: SLATE },
    inner: c.manaCapacity ? { total: c.manaCapacity, label: 'MANA', colour: BRUISE } : null,
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
    desc: `Vehicle card: ${v.name} (${v.mode}).`,
    left: { total: v.damageBoxes, label: 'DAMAGE' },
    right: { total: v.cargoCapacity, label: 'CARGO', colour: SLATE },
    facts: [v.quirk],
    story: v.story,
  });
}

for (const m of monsters) {
  const render = plateIdFor(deckByPrefix('MON'), m);
  if (!hasRender(render)) { skipped.push(m.cardCode); continue; }
  const opts = ['Slay', m.options.enslave && 'Enslave', m.options.befriend && 'Befriend', m.options.domesticate && 'Domesticate'].filter(Boolean);
  specs.push({
    code: m.cardCode, name: m.name + (m.unique ? ' — unique' : ''), portrait: render,
    kicker: `strength ${m.strength} · yields ${m.manaYield} ${m.element} mana · ${m.terrains.join(', ')}`,
    element: m.element,
    desc: `Monster card: ${m.name}, ${m.element}.`,
    left: { total: m.health, label: 'HEALTH' },
    right: null,
    facts: [
      `Options: ${opts.join(' · ')}.`,
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
    kicker: `talisman · made at the ${t.madeAt} · ${t.baseValue} coin · ${t.massKg} kg`,
    desc: `Talisman card: ${t.name}. An arcane subject - the mana bar rules in bruise.`,
    left: null,
    right: { total: t.manaCapacity, label: 'MANA', colour: BRUISE },
    facts: t.effects,
    story: t.story,
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
  <a href="../boards/index.html">The player board</a>
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
    const geom = deckGeometry(cards);
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
