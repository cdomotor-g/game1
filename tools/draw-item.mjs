#!/usr/bin/env node
/**
 * The plate for an object card, drawn here.
 *
 * A deck says where its plates come from. Most say an artist: somebody who can
 * draw and does not know the rules is handed a brief and sends back a painted
 * page, and docs/MINT.md is the whole of how that works. A deck whose
 * `plateKind` is `"generated"` says the other thing, and it is the turn
 * data/maps/ already took - the data is the source and the picture is the
 * output, which is how everything else in this repository has always worked.
 *
 * WHY OBJECTS AND NOT FACES. docs/art/09-framing-and-composition.md calls a
 * talisman plate "a single object study, lit on a table". A study of a made
 * thing is a silhouette and a line: a haft, a head, the grain in one and the
 * hammer marks in the other. That is drawable from parts. A character's face is
 * not, a monster's eye is not, and a country is not - which is why this tool is
 * pointed at two decks and not at the mint.
 *
 * WHERE THE DRAWING LIVES. Exactly where the element marks live, one storey up.
 * The PARTS are data on the object - `plate.parts[]` in data/items.json and
 * data/tools.json, each a closed path and the material it is made of - and how
 * to draw a part is data/components.json `itemPlate`: the line weights, what
 * colour a material washes, how a shaded part is hatched, what it stands on.
 * Neither file is a picture; this makes the picture. No coordinate in this file
 * belongs to any one object, and if you find yourself typing one, it belongs in
 * the object's own `plate` block.
 *
 * TWO FILES OUT, AND THEY ARE NOT THE SAME KIND OF THING.
 *
 *   docs/art/renders/<plate>.svg   the plate. Generated, committed, checked by
 *                                  --check and swept by tools/validate-art.mjs
 *                                  like every other generated drawing here.
 *   docs/art/renders/<plate>.png   the same plate, rasterised, because a card
 *                                  window shows a PNG and the framing
 *                                  arithmetic measures one.
 *
 * The PNG needs a browser and the SVG does not, which is the whole reason they
 * are separate steps. --check touches only the SVG, so continuous integration
 * can prove the committed plate matches the data without a Chromium anywhere
 * near it, and a machine with no browser can still change a drawing.
 *
 * FRAMING IS NOT GUESSED HERE, IT IS SET. Every object is drawn into the box
 * components.json calls `itemPlate.subject`, so the framing entry for a
 * generated plate is that box rather than something measured off the picture
 * afterwards. --check says so if docs/art/framing.json has drifted.
 *
 *   node tools/draw-item.mjs                every generated deck's plates
 *   node tools/draw-item.mjs ITM-01 TOL-03  those two
 *   node tools/draw-item.mjs --deck TOL     that deck
 *   node tools/draw-item.mjs --check        are the committed SVGs current?
 *   node tools/draw-item.mjs --svg-only     skip the raster, no browser needed
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { plateIdFor } from './lib/plates.mjs';
import { cardsOfDeck } from './lib/mint.mjs';
import { inkHex, readPalette } from './lib/palette.mjs';
import { findChromium, shoot, noBrowser } from './lib/chromium.mjs';
import { readMintFile, minLongSideFor } from './lib/mint.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RENDERS = join(ROOT, 'docs', 'art', 'renders');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const components = readJson(join(ROOT, 'data/components.json'));
const palette = readPalette(ROOT);
const spec = components.itemPlate;

const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;

/** Rounded, so a regenerated plate diffs only where the drawing changed. */
const n = (v) => Number(v.toFixed(3));

/* ------------------------------------------------------------------ the page */

/**
 * Where the object sits on the page, from components.json.
 *
 * `itemPlate.subject` is a fraction of the page and the object is authored on a
 * square of the page's own size, so the map from one to the other is a
 * translate and one scale - the same in both directions, or the plate would
 * stretch what it is a picture of. The scale is wanted afterwards too: a stroke
 * inside this transform is multiplied by it, and a line weight that changes
 * with the size of the thing it is drawn on is two line weights.
 */
const [SX, SY, SW] = spec.subject;
const PAGE = Number(spec.viewBox.split(' ')[2]);
const SCALE = SW;
const FIT = `translate(${n(SX * PAGE)} ${n(SY * PAGE)}) scale(${n(SCALE)})`;
/** A weight in page units, said in the object's own units. */
const weight = (w) => n(w / SCALE);

/* ------------------------------------------------------------------ hatching */

/**
 * The interior tone of one part: parallel lines ruled across the whole square
 * and clipped to the part.
 *
 * Ruled flat and rotated, rather than worked out at an angle, because a
 * horizontal line is `M{-over} {y}H{over}` and there is nothing in that to get
 * wrong. The overhang is what a square gives up when it turns: half its
 * diagonal, less half its side, and a little for the rounding.
 */
const OVER = Math.ceil((PAGE * Math.SQRT2 - PAGE) / 2) + 6;

function hatchPath(spacing) {
  const lines = [];
  for (let y = -OVER; y <= PAGE + OVER; y += spacing) lines.push(`M${-OVER} ${n(y)}H${PAGE + OVER}`);
  return lines.join('');
}

/** One shaded part's hatch, as ink-plate markup. Clipping is the caller's job. */
function hatchFor(shade) {
  const spacing = spec.shading.spacing[shade];
  if (!spacing) throw new Error(`no such shade as "${shade}" - components.json itemPlate.shading.spacing has ${Object.keys(spec.shading.spacing).join(', ')}`);
  const angles = [spec.shading.angleDeg];
  if (shade === spec.shading.crossFrom) angles.push(spec.shading.crossAngleDeg);
  const half = PAGE / 2;
  return angles
    .map((a) => `<g transform="rotate(${a} ${half} ${half})"><path d="${hatchPath(spacing)}"/></g>`)
    .join('');
}

/* --------------------------------------------------------------------- grime */

/**
 * Press dirt. Deterministic, from the plate's own name - a plate that came out
 * differently every run could not be committed, and a committed file that
 * cannot be checked is a file nobody trusts.
 */
function specks(plateId) {
  let seed = 2166136261;
  for (const ch of plateId) { seed ^= ch.charCodeAt(0); seed = Math.imul(seed, 16777619); }
  const next = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed / 4294967296;
  };
  const out = [];
  for (let i = 0; i < spec.grime.specks; i++) {
    out.push(`<circle cx="${n(next() * PAGE)}" cy="${n(next() * PAGE)}" r="${spec.grime.radius}"/>`);
  }
  return out.join('');
}

/* ----------------------------------------------------------------- one plate */

/**
 * One object, as the two plates docs/art/01-two-plate-system.md asks for.
 *
 * #wash is flat shapes and nothing else - a material's colour under each part,
 * and the shadow the object throws. No line, no information: delete the whole
 * layer and the object is still an axe, because #ink drew it. #ink is the
 * outline of every part, the hatching inside the shaded ones, whatever detail
 * the object names, and the ground it stands on, all in soot alone.
 *
 * Parts are drawn in the order the object lists them, so the order is the
 * stacking: a haft first and the head over it. That matters on both plates - the
 * wash knocks the paper out under each part as it goes, and the ink draws every
 * outline - which is why an object whose head sits on its haft stops the haft at
 * the head rather than running it through and hoping.
 */
function drawPlate(card, plateId, deck) {
  const plate = card.plate;
  if (!plate?.parts?.length) throw new Error(`${card.id} has no plate.parts to draw`);

  const clipId = (i) => `${plateId}-part-${i}`;
  const shaded = plate.parts.map((p, i) => ({ ...p, i })).filter((p) => p.shade);

  const materialOf = (name) => {
    const m = spec.materials[name];
    if (!m) throw new Error(`${card.id}: no such material as "${name}" - components.json itemPlate.materials has ${Object.keys(spec.materials).filter((k) => !k.startsWith('$')).join(', ')}`);
    return m;
  };

  const defs = shaded
    .map((p) => `  <clipPath id="${clipId(p.i)}"><path d="${p.d}"/></clipPath>`)
    .join('\n');

  /* Every part knocks the paper out under itself before it is washed. A wash is
     a flat colour at less than full strength, so two parts that overlap - a head
     wedged over a haft - would otherwise MIX where they meet, and a hammer would
     have a stripe of its own handle across its face. A press knocks out; so does
     this. It is still the wash plate and it is still flat shapes. */
  const wash = plate.parts
    .map((p) => {
      const m = materialOf(p.material);
      return `<path d="${p.d}" fill="${TALLOW}"/><path d="${p.d}" fill="${inkHex(m.ink, palette)}" opacity="${m.opacity}"/>`;
    })
    .join('\n      ');

  const shadow = spec.ground.shadow;
  const hatching = shaded
    .map((p) => `<g clip-path="url(#${clipId(p.i)})" stroke-width="${weight(spec.shading.strokeWidth)}" opacity="${spec.shading.opacity}">${hatchFor(p.shade)}</g>`)
    .join('\n      ');

  const outlines = plate.parts.map((p) => `<path d="${p.d}"/>`).join('');
  const detail = (plate.lines ?? []).length
    ? `<g stroke-width="${weight(spec.line.detail)}"><path d="${plate.lines.join('')}"/></g>`
    : '';

  const groundY = n(spec.ground.y * PAGE);
  const half = n(spec.ground.halfWidth * PAGE);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${spec.viewBox}" width="${PAGE}" height="${PAGE}">
<title>${esc(card.name)} — the plate</title>
<desc>${esc(card.name)}: ${esc(plate.note ?? 'an object study')} Generated by tools/draw-item.mjs from data/${deck.source} and data/components.json itemPlate — do not edit. The object is drawn into the box components.json calls itemPlate.subject, which is what docs/art/framing.json says about this plate. The ink plate alone is the black-and-white edition.</desc>
<defs>
${defs}
</defs>

<g id="wash">
  <rect x="0" y="0" width="${PAGE}" height="${PAGE}" fill="${TALLOW}"/>
  <ellipse cx="${PAGE / 2}" cy="${groundY}" rx="${n(shadow.halfWidth * PAGE)}" ry="${n(shadow.height * PAGE)}" fill="${inkHex(shadow.ink, palette)}" opacity="${shadow.opacity}"/>
  <g transform="${FIT}">
      ${wash}
  </g>
</g>

<g id="ink" fill="none" stroke="${SOOT}" stroke-linecap="${spec.line.linecap}" stroke-linejoin="${spec.line.linejoin}">
  <g transform="${FIT}">
      ${hatching}
      <g stroke-width="${weight(spec.line.outline)}">${outlines}</g>
      ${detail}
  </g>
  <path d="M${n(PAGE / 2 - half)} ${groundY}H${n(PAGE / 2 + half)}" stroke-width="${spec.ground.strokeWidth}"/>
</g>

<g id="grime" fill="${SOOT}" opacity="${spec.grime.opacity}">${specks(plateId)}</g>
</svg>
`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ------------------------------------------------------------------ the run */

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const valueOf = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const deckFilter = valueOf('deck');
const flagged = new Set();
for (const name of ['deck']) {
  const i = args.indexOf(`--${name}`);
  if (i !== -1) { flagged.add(i); flagged.add(i + 1); }
}
const targets = args.filter((a, i) => !flagged.has(i) && !a.startsWith('--'));

/* Every deck that says its plates are drawn here. A deck that says nothing is
   drawn by an artist, which is the default and stays the default. */
const generatedDecks = components.decks.filter((d) => d.plateKind === 'generated');
if (!generatedDecks.length) {
  console.error('draw-item: no deck in data/components.json has plateKind "generated" — there is nothing here to draw.');
  process.exit(1);
}

const subjects = [];
for (const deck of generatedDecks) {
  if (deckFilter && deck.prefix.toUpperCase() !== deckFilter.toUpperCase()) continue;
  for (const card of cardsOfDeck(ROOT, deck)) {
    subjects.push({ deck, card, plateId: plateIdFor(deck, card) });
  }
}

/* A card in a generated deck with no `plate` block of its own is not drawn here.
   That is the escape hatch and it is the whole of it: delete the block and the
   card is back at DRAW in tools/mint-queue.mjs, waiting on somebody with a pen,
   and the brief in docs/art/prompts/ is what they are handed. A drawn plate that
   arrives is then never overwritten by this tool, because this tool no longer
   has anything to draw it from. */
const byHand = subjects.filter((s) => !s.card.plate?.parts?.length);
const drawable = subjects.filter((s) => s.card.plate?.parts?.length);

const wanted = targets.length
  ? drawable.filter((s) => targets.some((t) => t.toUpperCase() === s.card.cardCode || t === s.plateId || t === s.card.id))
  : drawable;

/* Which cards have been taken back by hand, said proportionately. Naming three
   of them is useful; naming every card in the deck, every run, is noise, and
   the all-by-hand case has a better line of its own below. */
if (byHand.length && byHand.length < subjects.length) {
  console.error(`draw-item: ${byHand.map((s) => s.card.cardCode).join(', ')} ` +
    `${byHand.length === 1 ? 'has' : 'have'} no plate block, so ${byHand.length === 1 ? 'it is' : 'they are'} ` +
    `drawn by hand — the brief is in docs/art/prompts/.`);
}

/* Nothing to draw is not the same as nothing to draw FROM.
   A deck whose cards have ALL had their plate block deleted is a finished
   state, not a failure: the escape hatch worked, once per card, and every plate
   in the deck is now an artist's. Continuous integration runs --check on every
   commit, so that state has to exit clean or the switch this tool exists to
   offer could only ever be thrown a few times. A deck with no cardCodes at all
   is a different thing and is still an error. */
if (!wanted.length) {
  if (targets.length) {
    console.error(`draw-item: none of ${targets.join(', ')} is a card in a generated deck with a plate block to draw from.`);
    process.exit(1);
  }
  if (!subjects.length) {
    console.error('draw-item: the generated decks have no cards with a cardCode yet, so there is nothing to draw.');
    process.exit(1);
  }
  console.log(`Nothing to generate: all ${subjects.length} cards in ` +
    `${[...new Set(subjects.map((s) => s.deck.name))].join(' and ')} have had their plate block deleted, ` +
    `so every plate in them is drawn by hand now. docs/art/prompts/ is what those cards are briefed from.`);
  process.exit(0);
}

/* The print aspiration this line derives from the card's own safe area, rather
   than a number typed into a config: a vector plate can be rendered at whatever
   the mint asks for, so it is rendered at the best of it. */
const cardsLine = readMintFile(ROOT).lines.find((l) => l.id === 'cards');
const { min, want, from } = minLongSideFor(ROOT, cardsLine, wanted[0]);
const SIZE = want || min || PAGE * 10;

/* ------------------------------------------------------------------- --check */

if (flag('check')) {
  let stale = 0;
  for (const { deck, card, plateId } of wanted) {
    const file = join(RENDERS, `${plateId}.svg`);
    let current = '';
    try { current = readFileSync(file, 'utf8'); } catch { /* absent is stale */ }
    if (current !== drawPlate(card, plateId, deck)) {
      console.error(`docs/art/renders/${plateId}.svg is stale.`);
      stale++;
    }
    if (!existsSync(join(RENDERS, `${plateId}.png`))) {
      console.error(`docs/art/renders/${plateId}.png is missing — the card window has nothing to show.`);
      stale++;
    }
  }

  /* A generated plate's framing is not measured off the picture, it is where the
     tool PUT the object. So the entry can be wrong in only one way: by having
     drifted from components.json. */
  const framing = readJson(join(ROOT, 'docs/art/framing.json'));
  const box = JSON.stringify(spec.subject);
  for (const { plateId } of wanted) {
    const entry = framing.plates[plateId];
    if (!entry) { console.error(`docs/art/framing.json has no entry for ${plateId}.`); stale++; continue; }
    if (JSON.stringify(entry.subject) !== box) {
      console.error(`docs/art/framing.json ${plateId}: subject is ${JSON.stringify(entry.subject)}, but the tool draws into ${box} (components.json itemPlate.subject).`);
      stale++;
    }
  }

  if (stale) { console.error('\nRun: node tools/draw-item.mjs'); process.exit(1); }
  console.log(`docs/art/renders/ is up to date — ${wanted.length} generated plates, framed on ${box}`);
  process.exit(0);
}

/* -------------------------------------------------------------------- output */

mkdirSync(RENDERS, { recursive: true });

const svgOnly = flag('svg-only');
const chromium = svgOnly ? null : findChromium();
if (!svgOnly && !chromium) {
  console.error(noBrowser('draw-item', 'The SVG plates are written either way; --svg-only says so out loud.'));
  console.error('           Without one the PNG a card window shows cannot be made here, and the committed one stands.');
}

let drawn = 0;
let rastered = 0;
for (const { deck, card, plateId } of wanted) {
  const svg = drawPlate(card, plateId, deck);
  writeFileSync(join(RENDERS, `${plateId}.svg`), svg, 'utf8');
  drawn++;

  if (!chromium) continue;
  const out = join(RENDERS, `${plateId}.png`);
  shoot(chromium, {
    html: `<!doctype html>\n<meta charset="utf-8">\n<style>html,body{margin:0;padding:0}svg{display:block;width:${SIZE}px;height:${SIZE}px}</style>\n${svg}`,
    out,
    width: SIZE,
    height: SIZE,
    scratchName: plateId,
  });
  rastered++;
  console.log(`  ${card.cardCode}  ${plateId}  ${SIZE} x ${SIZE}`);
}

console.log(`\n${drawn} plates drawn to docs/art/renders/` + (chromium ? `, ${rastered} rasterised at ${SIZE} px` : ' — SVG only, no browser'));
if (chromium) console.log(`${SIZE} px is this line's print target: ${from}, floor ${min} px.`);
