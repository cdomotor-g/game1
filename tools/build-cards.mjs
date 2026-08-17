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
 * is not a card yet. Output: docs/cards/<CODE>.svg and docs/cards/index.html.
 *
 * Card anatomy (docs/art/06-components.md, "The adventure decks"):
 *   name and card code at the top · portrait across the middle · story low ·
 *   HARM bar on the LEFT edge (oxide) · CAPACITY bar on the RIGHT edge
 *   (slate for cargo, bruise for mana — mana is arcane) · numbered from the
 *   bottom, walked by a token · a card with no bar leaves the edge quiet.
 *
 * Usage: node tools/build-cards.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');
const OUT_DIR = join(ROOT, 'docs', 'cards');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));

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

/* The element carries its ink, as the monster brief assigns them. */
const ELEMENT_INK = { fire: OXIDE, earth: VERDIGRIS, water: SLATE, air: T40 };

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

/* Drawn at 8 units = 1mm, like the examples: 63x88mm card, 3mm bleed. */
const W = 552, H = 752;            // bleed box
const TRIM = { x: 24, y: 24, w: 504, h: 704 };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
  return lines.map((l, i) => `<text x="${x}" y="${y + i * leading}" font-size="${size}" ${attrs}>${esc(l)}</text>`).join('\n    ');
}

/**
 * A vertical numbered bar: `cells` boxes of `step` each, numbered from the
 * bottom, hung between yTop and yBottom on the given edge. The wash tints the
 * column; the ink draws the ladder, so the bar survives the mono edition.
 */
function bar({ x, yTop, yBottom, cells, step, colour, label, harm }) {
  const wBox = 30;
  const hAll = yBottom - yTop;
  const hCell = hAll / cells;
  let wash = `<rect x="${x}" y="${yTop}" width="${wBox}" height="${hAll}" fill="${colour}" opacity="0.28"/>`;
  let ink = `<rect x="${x}" y="${yTop}" width="${wBox}" height="${hAll}" fill="none" stroke="${SOOT}" stroke-width="2"/>`;
  const nums = [];
  for (let i = 1; i <= cells; i++) {
    const yLine = yBottom - i * hCell;
    if (i < cells) ink += `<path d="M ${x},${yLine} H ${x + wBox}" stroke="${SOOT}" stroke-width="1.1"/>`;
    /* harm bars carry the notch-down mark on the ink plate (06-components.md),
       so harm vs capacity survives the black-and-white edition */
    if (harm) ink += `<path d="M ${x - 1},${yLine + hCell / 2 - 4} l 5,4 l -5,4" fill="none" stroke="${SOOT}" stroke-width="1.4"/>`;
    nums.push(`<text x="${x + wBox / 2 + (harm ? 3 : 0)}" y="${yBottom - (i - 0.5) * hCell + 4.5}" font-size="13.5" text-anchor="middle" font-family="${SANS}">${i * step}</text>`);
  }
  ink += `<g fill="${SOOT}">${nums.join('')}</g>`;
  ink += `<text x="${x + wBox / 2}" y="${yTop - 8}" font-size="10" text-anchor="middle" letter-spacing="1.1" font-family="${SANS}" fill="${T70}">${esc(label)}</text>`;
  return { wash, ink };
}

/** Nice step so a big capacity still fits a walkable ladder. 14 cells is the
    most the edge holds, and every harm bar in the data fits it at step 1 —
    a harm track must never skip-count. */
function barScale(total) {
  for (const step of [1, 2, 5, 10, 20]) {
    if (total / step <= 14) return { cells: Math.ceil(total / step), step };
  }
  return { cells: Math.ceil(total / 50), step: 50 };
}

/**
 * One card front. spec:
 *   code, name, kicker (small line under the name), element (optional),
 *   portrait (render id), left  {total, label} harm bar,
 *   right {total, label, colour} capacity bar, facts [line...], story.
 */
function card(spec) {
  const P = { x: 88, y: 132, w: 376, h: 290 };   // portrait window, between the bars
  const artHref = `../art/renders/${spec.portrait}.png`;

  const bars = [];
  if (spec.left) bars.push(bar({ x: TRIM.x + 24, yTop: P.y + 26, yBottom: 576, ...barScale(spec.left.total), colour: OXIDE, label: spec.left.label, harm: true }));
  if (spec.right) bars.push(bar({ x: TRIM.x + TRIM.w - 54, yTop: P.y + 26, yBottom: 576, ...barScale(spec.right.total), colour: spec.right.colour, label: spec.right.label }));

  /* type sits at or above the print floor: rules text ~6.5pt, story ~6pt,
     name ~11pt at the card's true 63x88mm (8 units = 1mm; 1pt = 2.83 units) */
  const factLines = (spec.facts || []).flatMap((f) => wrap(f, 44));
  const factY = P.y + P.h + 26;
  const storyLines = wrap(spec.story, 58).slice(0, 5);
  const storyY = 612;

  const elementBadge = spec.element
    ? {
        wash: `<circle cx="${TRIM.x + 40}" cy="66" r="13" fill="${ELEMENT_INK[spec.element]}" opacity="0.55"/>`,
        ink: `<circle cx="${TRIM.x + 40}" cy="66" r="13" fill="none" stroke="${SOOT}" stroke-width="2"/>` +
          `<text x="${TRIM.x + 62}" y="71" font-size="13" letter-spacing="1.5" font-family="${SANS}" fill="${T85}">${spec.element.toUpperCase()}</text>`,
      }
    : null;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${SERIF}">
<title>${esc(spec.name)} — ${esc(spec.code)}</title>
<desc>${esc(spec.desc)} Generated by tools/build-cards.mjs from data/*.json — do not edit. 63x88mm at 8 units/mm, 3mm bleed. The ink plate alone is the black-and-white edition.</desc>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${W}" height="${H}" fill="${TALLOW}"/>
  <image href="${artHref}" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" preserveAspectRatio="xMidYMid slice"/>
  ${bars.map((b) => b.wash).join('\n  ')}
  ${elementBadge ? elementBadge.wash : ''}
  <rect x="${TRIM.x}" y="${storyY - 26}" width="${TRIM.w}" height="${TRIM.y + TRIM.h - storyY + 2}" fill="${T12}" opacity="0.5"/>
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- timber-and-iron frame, rivets at the corners -->
  <g fill="none" stroke="${SOOT}">
    <rect x="${TRIM.x + 8}" y="${TRIM.y + 8}" width="${TRIM.w - 16}" height="${TRIM.h - 16}" stroke-width="4"/>
    <rect x="${TRIM.x + 16}" y="${TRIM.y + 16}" width="${TRIM.w - 32}" height="${TRIM.h - 32}" stroke-width="1.2"/>
  </g>
  <g>
    <circle cx="${TRIM.x + 15}" cy="${TRIM.y + 15}" r="3.6"/><circle cx="${TRIM.x + TRIM.w - 15}" cy="${TRIM.y + 15}" r="3.6"/>
    <circle cx="${TRIM.x + 15}" cy="${TRIM.y + TRIM.h - 15}" r="3.6"/><circle cx="${TRIM.x + TRIM.w - 15}" cy="${TRIM.y + TRIM.h - 15}" r="3.6"/>
  </g>

  <!-- name and card code, maker's-mark small -->
  <text x="${TRIM.x + 24}" y="${spec.element ? 102 : 80}" font-size="31" font-weight="bold">${esc(spec.name)}</text>
  <text x="${TRIM.x + TRIM.w - 24}" y="60" font-size="15" text-anchor="end" letter-spacing="2" font-family="${SANS}">${esc(spec.code)}</text>
  <text x="${TRIM.x + 24}" y="${spec.element ? 102 + 22 : 102}" font-size="15.5" font-style="italic" fill="${T85}">${esc(spec.kicker)}</text>
  ${elementBadge ? elementBadge.ink : ''}

  <!-- portrait window rule: the wash bleeds, the ink holds the line -->
  <rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="none" stroke="${SOOT}" stroke-width="2.4"/>

  ${bars.map((b) => b.ink).join('\n  ')}

  <!-- the card's working text -->
  <g font-size="18">
    ${textBlock(factLines, P.x + 2, factY, 18, 22)}
  </g>
  <path d="M ${TRIM.x + 24},${storyY - 22} H ${TRIM.x + TRIM.w - 24}" stroke="${SOOT}" stroke-width="1.2"/>
  <g font-style="italic" fill="${T85}">
    ${textBlock(storyLines, TRIM.x + 26, storyY, 16.5, 19.5)}
  </g>
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
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
  const render = `character-${c.cardCode.toLowerCase()}`;
  if (!hasRender(render)) { skipped.push(c.cardCode); continue; }
  specs.push({
    code: c.cardCode, name: c.name, portrait: render,
    kicker: `${peoplesById.get(c.people)?.name || c.people} · ${c.calling}`,
    desc: `Character card: ${c.name}, ${c.calling}.`,
    left: { total: c.health, label: 'HEALTH' },
    right: c.manaCapacity ? { total: c.manaCapacity, label: 'MANA', colour: BRUISE } : null,
    facts: c.traits,
    story: c.story,
  });
}

for (const v of vehicles) {
  const render = `vehicle-${v.cardCode.toLowerCase()}`;
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
  const render = `monster-${m.id}`;
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
  const render = `talisman-${t.cardCode.toLowerCase()}`;
  if (!hasRender(render)) { skipped.push(t.cardCode); continue; }
  specs.push({
    code: t.cardCode, name: t.name, portrait: render,
    kicker: `talisman · made at the ${t.madeAt} · ${t.baseValue} coin`,
    desc: `Talisman card: ${t.name}. An arcane subject - the mana bar rules in bruise.`,
    left: null,
    right: { total: t.manaCapacity, label: 'MANA', colour: BRUISE },
    facts: t.effects,
    story: t.story,
  });
}

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
  .bar a, .bar button { color: ${T85}; background: none; border: none; font: inherit; cursor: pointer; padding: 0; }
  .bar a:hover, .bar button:hover { text-decoration: underline; }
  .deck { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; }
  .deck object { width: 276px; height: 376px; border: 1px solid ${T25}; background: ${TALLOW}; }
  @media print {
    body { margin: 0; background: none; }
    h1, h2, p.note, .bar { display: none; }
    .deck { gap: 0; }
    .deck object { width: 63mm; height: 88mm; border: none; page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <button type="button" onclick="window.print()">Print the cards</button>
</div>
<h1>The adventure deck cards</h1>
<p class="note">Generated by <code>tools/build-cards.mjs</code> from <code>data/*.json</code> and the accepted
plates in <code>docs/art/renders/</code> — edit those, re-run the tool, and never these files. Only cards whose
plate has been accepted are rendered${skipped.length ? ` (still waiting on renders: ${skipped.join(', ')})` : ''}.
Print this page for a print-and-play set at true 63 × 88 mm.</p>
${['CHR', 'VEH', 'MON', 'TAL'].map((prefix) => {
  const deck = specs.filter((s) => s.code.startsWith(prefix));
  if (!deck.length) return '';
  const title = { CHR: 'Characters', VEH: 'Vehicles', MON: 'Monsters', TAL: 'Talismans' }[prefix];
  return `<h2>${title}</h2>\n<div class="deck">\n${deck.map((s) => `  <object data="${s.code}.svg" type="image/svg+xml" aria-label="${esc(s.name)}"></object>`).join('\n')}\n</div>`;
}).join('\n')}
</body>
</html>
`;

const wanted = new Map(specs.map((s) => [`${s.code}.svg`, card(s)]));
wanted.set('index.html', index);

if (checkOnly) {
  let stale = false;
  for (const [name, content] of wanted) {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, name), 'utf8'); } catch { /* absent is stale */ }
    if (current !== content) { console.error(`docs/cards/${name} is stale.`); stale = true; }
  }
  if (stale) { console.error('Run: node tools/build-cards.mjs'); process.exit(1); }
  console.log(`docs/cards/ is up to date (${specs.length} cards)`);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) {
    if ((f.endsWith('.svg') || f === 'index.html') && !wanted.has(f)) unlinkSync(join(OUT_DIR, f));
  }
  for (const [name, content] of wanted) writeFileSync(join(OUT_DIR, name), content, 'utf8');
  console.log(`wrote ${specs.length} cards + index.html to docs/cards/` +
    (skipped.length ? ` — no render yet for ${skipped.join(', ')}` : ''));
}
