#!/usr/bin/env node
/**
 * Draws the player board — one A4 landscape sheet — from data/playerboard.json
 * and data/components.json.
 *
 * The same bargain as tools/build-cards.mjs: the data says what the board is
 * for, components.json says what shape it is drawn into, and nothing here
 * invents a number that belongs to either. What this file owns is the
 * arrangement — the card in play top left, the round under it, the tracks up the
 * middle, four cards of kit on the right — and even that is arithmetic rather
 * than a set of coordinates:
 *
 *   contentW - (the card slot) - (two kit slots) - three gutters = the tracks
 *   contentH - (the heads)                                       = the rungs
 *
 * Give the board another track and the columns get narrower; give it a bigger
 * card and they get narrower still. Nothing moves off the paper, because nothing
 * was ever placed by hand. There were six columns here until a vehicle stopped
 * being a card on somebody else's board and started being dealt a board of its
 * own — its damage is its health, the V went, and the five that were left simply
 * got wider without a coordinate being touched.
 *
 * Then the fifth went too, and paid for something. DEFENCE was a rating a token
 * barely ever moved, and when a battle became one opposed total there was nothing
 * left for it to do that armour printed on a card was not already doing. What the
 * paper bought is the thing this board never had room for: a WEAR LADDER against
 * each of the four kit recesses, so the axe, the sword and the lantern are each
 * counted down beside their own card. The middle of the sheet is about the figure
 * in the recess; the edge of it is about what that figure is carrying.
 *
 * And the columns got wider anyway — 15.6 mm against the 13.6 that five of them
 * managed — because the margins came in by two millimetres and the gutters by
 * two in the same change. That is the whole argument for deriving a layout: take
 * a column out of the middle, add four ladders at the edge, give a little back at
 * the margins, and the arithmetic hands the difference to whatever is left
 * standing. Nobody had to work out where anything went.
 *
 * ONE BOARD, not one per people, and not one per kind of thing. Everything that
 * differs between an orc and a halfling — strength, health, what they can
 * shoulder — is printed on the card lying in the recess, so the board underneath
 * has no business knowing which of them is sitting there; and a wagon has a hull
 * that takes damage, a load, a pace and a hold, which is this board exactly.
 *
 * Two plates, as everywhere (docs/art/01-two-plate-system.md): #wash carries a
 * tint down each track, #ink carries every rule, number and letter in soot
 * alone, #grime carries the wear. Drop #wash and #slip and you have the
 * black-and-white edition — the tracks survive as numbered ladders, because the
 * numbering was never the colour's job.
 *
 * The ladders are numbered and nothing else: no rung glyph, no plus, no minus.
 * A column is a shade over thirteen millimetres wide and a mark saying "this is
 * a harm track" was competing with the number for the same three of them.
 *
 * Usage: node tools/build-board.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT_DIR = join(ROOT, 'docs', 'boards');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const spec = read('playerboard.json');
const itemSpec = read('itemboard.json');

/* Datasets a track may point a dotted path at, rather than restating a number
   that already exists somewhere. `stepFrom` is the one in use: the burden track
   steps in whatever rules.json says a burden bar steps in. */
const datasets = {
  rules: read('rules.json'),
  characters: read('characters.json'),
  vehicles: read('vehicles.json'),
  items: read('items.json'),
  monsters: read('monsters.json'),
  terrain: read('terrain.json'),
};

/* Every colour below is declared in palette.json — validate-art.mjs checks. */
const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const T85 = palette.ink.tints['85'].hex;
const T70 = palette.ink.tints['70'].hex;
const T55 = palette.ink.tints['55'].hex;
const T40 = palette.ink.tints['40'].hex;
const T25 = palette.ink.tints['25'].hex;
const T12 = palette.ink.tints['12'].hex;

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

/** The data names an ink; this is the only place a name becomes a hex. */
function inkHex(name) {
  const ink = palette.inks[name];
  if (!ink) throw new Error(`data names an ink the palette does not declare: ${name}`);
  return ink.hex;
}

/** "rules.carrying.barStepKg" -> the number, so the board never restates it. */
function dotted(path) {
  const [key, ...rest] = path.split('.');
  let node = datasets[key];
  for (const part of rest) {
    /* `terrains[id=desert]` picks a record out of an array by its id */
    const pick = part.match(/^(.+)\[(\w+)=([^\]]+)\]$/);
    node = pick ? node?.[pick[1]]?.find?.((r) => String(r[pick[2]]) === pick[3]) : node?.[part];
  }
  if (node === undefined) throw new Error(`playerboard.json points at "${path}", which does not resolve`);
  return node;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

/** Greedy wrap by estimated glyph width — close enough for a serif at this size. */
function wrap(text, maxChars) {
  const out = [];
  let line = '';
  for (const w of String(text).split(/\s+/)) {
    if (line && (line + ' ' + w).length > maxChars) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

/* ------------------------------------------------------------- the geometry */

const B = components.board;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;

const BLEED = mm(B.sheet.bleedMm);
const W = mm(B.sheet.widthMm + 2 * B.sheet.bleedMm);
const H = mm(B.sheet.heightMm + 2 * B.sheet.bleedMm);
const TRIM = { x: BLEED, y: BLEED, w: mm(B.sheet.widthMm), h: mm(B.sheet.heightMm) };
const CORNER = mm(B.sheet.cornerRadiusMm);
const GUT = mm(B.gutterMm);

/** The working area. One margin all round — there is no border to clear. */
const CONTENT = {
  x: TRIM.x + mm(B.marginMm),
  y: TRIM.y + mm(B.marginMm),
  w: TRIM.w - 2 * mm(B.marginMm),
  h: TRIM.h - 2 * mm(B.marginMm),
};

/* A recess is the card's trim plus a clearance either side — a card has to drop
   in, not be posted in. */
const CARD = components.stock.card;
const SLOT = {
  w: mm(CARD.widthMm + 2 * B.slot.clearanceMm),
  h: mm(CARD.heightMm + 2 * B.slot.clearanceMm),
  r: mm(B.slot.cornerRadiusMm),
};

/* THE KIT IS LAID OUT IN BAYS. A bay is a column of two card recesses with a
   ladder pair either side of it: the top card belongs to the pair on its left,
   the bottom card to the pair on its right, and the two cards are staggered
   towards their own pair (components.json board.kitTrack.staggerMm) so nobody
   has to be told which ladder is whose. Every ladder pair runs the full height
   of the sheet - the head, then one rung per step from kitTrack.from to .to -
   which is what lets twenty rungs stand beside a card that is only 88 mm tall.
   The player board has one bay; the items board (data/itemboard.json) has two.
   Same module, same arithmetic, and no coordinate typed for either. */
const TRACKS = spec.tracks;
const COLUMN_TRACKS = TRACKS.filter((t) => (t.place ?? 'column') === 'column');
const KIT_TRACKS = TRACKS.filter((t) => t.place === 'kit');

const KT = B.kitTrack;
const FR = B.frame;
const PIP = mm(components.tokens.pip.diameterMm);
/* THE FRAME DECIDES THE SHAPE OF A TRACK. Every track is a slot cut through
   the frame (components.json board.frame): an open LANE the marker slides up and
   down, and a NOTCH beside every rung that the marker is pushed sideways into and
   sits in. One marker size serves every track on both sheets - the pip - so a
   notch and a lane are each a pip plus the frame's clearance wide. */
const MARK = PIP + mm(FR.clearanceMm);
const WALL = mm(FR.minWallMm);
/* A column track is a lane with its notches on the left. A kit pair shares ONE
   lane between its two tracks - the first track's notches on the left of it, the
   second's on the right - so the numbers in the middle serve both, and a pair
   costs three marker-widths rather than four. */
if (KIT_TRACKS.length > 2) throw new Error('a kit ladder shares one lane between at most two tracks');
const PAIR_W = (KIT_TRACKS.length + 1) * MARK;
const LADDER_GAP = Math.max(mm(KT.gapMm), WALL);
const STAGGER = mm(KT.staggerMm);
const BAY_W = 2 * PAIR_W + 2 * LADDER_GAP + SLOT.w + STAGGER;
const SLOTS_PER_BAY = 2;
const KIT_HEAD = mm(KT.headMm);
const KIT_RUNGS = KT.to - KT.from + 1;
const KIT_CELL_H = (CONTENT.h - KIT_HEAD) / KIT_RUNGS;

if (KIT_TRACKS.length && KIT_CELL_H < MARK + WALL) {
  throw new Error(
    `a kit ladder is ${KIT_RUNGS} rungs down the ${num(CONTENT.h / U)}mm sheet, ${num(KIT_CELL_H / U)}mm a rung, ` +
    `and a notch (${num(MARK / U)}mm) plus the frame's thinnest wall (${FR.minWallMm}mm) needs more - the teeth would snap.`
  );
}

const kitSlot = spec.slots.find((s) => s.id === 'kit');
/* Whole bays first, then a HALF bay for an odd card out - one card and the
   pair on its right, closing the sheet's right-hand edge. The player board has
   one kit card now, so its kit is a half bay and the columns get the rest. */
const PLAYER_FULL = Math.floor(kitSlot.count / SLOTS_PER_BAY);
const PLAYER_HALF = kitSlot.count % SLOTS_PER_BAY;
const PLAYER_BAYS = PLAYER_FULL + PLAYER_HALF;
const KIT_W = PLAYER_FULL * BAY_W + PLAYER_HALF * (SLOT.w + LADDER_GAP + PAIR_W) + (PLAYER_BAYS - 1) * GUT;

/* Everything the cards and their ladders do not want is the columns'. */
const TRACK_BLOCK = {
  x: CONTENT.x + SLOT.w + GUT,
  y: CONTENT.y,
  w: CONTENT.w - SLOT.w - KIT_W - 2 * GUT,
  h: CONTENT.h,
};
const CELL_W = TRACK_BLOCK.w / COLUMN_TRACKS.length;
const HEAD = mm(B.track.headMm);
const RUNGS = B.track.to - B.track.from + 1;
const CELL_H = (TRACK_BLOCK.h - HEAD) / RUNGS;

if (CELL_W < 2 * MARK + WALL || CELL_H < MARK + WALL) {
  throw new Error(
    `${COLUMN_TRACKS.length} column tracks and ${PLAYER_BAYS} kit bay(s) leave ${num(CELL_W / U)}x${num(CELL_H / U)}mm a rung, ` +
    `and a lane and a notch (${num(2 * MARK / U)}mm) with the frame's wall (${FR.minWallMm}mm) need more - the board has run out of middle.`
  );
}

const KIT_X = CONTENT.x + CONTENT.w - KIT_W;
const PANEL = { x: CONTENT.x, y: CONTENT.y + SLOT.h + GUT, w: SLOT.w, h: CONTENT.h - SLOT.h - GUT };

/* ---------------------------------------------------------------- utilities */

/** A rectangle inset from the trim, its corner following the sheet's as it goes in. */
function inset(by) {
  return { x: TRIM.x + by, y: TRIM.y + by, w: TRIM.w - 2 * by, h: TRIM.h - 2 * by, r: Math.max(0, CORNER - by) };
}
const rect = (b, attrs) => `<rect x="${num(b.x)}" y="${num(b.y)}" width="${num(b.w)}" height="${num(b.h)}" rx="${num(b.r || 0)}" ${attrs}/>`;

/** Deterministic noise. The grain has to be the same grain every run, or
    --check would fail on a board nobody had touched. */
function rng(seedText) {
  let s = 2166136261;
  for (const ch of seedText) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* ------------------------------------------------------------- board pieces */

/** Sawn boards running the length of the sheet: seams, grain, and a few knots. */
function timber(seed) {
  const rand = rng(`timber-${seed}`);
  const t = B.timber;
  const step = mm(t.boardWidthMm);
  const out = [];
  for (let y = TRIM.y + step; y < TRIM.y + TRIM.h - 4; y += step) {
    out.push(`<path d="M ${num(TRIM.x)},${num(y)} H ${num(TRIM.x + TRIM.w)}" stroke="${T25}" stroke-width="${t.seamStrokeWidth}"/>`);
    /* three or four grain lines per board, each bowed a little, because a sawn
       board is not a ruled line and a ruled line is not a board */
    for (let i = 0; i < 4; i++) {
      const gy = y - step + step * ((i + 0.6 + rand() * 0.5) / 4.6);
      const bow = (rand() - 0.5) * mm(2.2);
      out.push(
        `<path d="M ${num(TRIM.x)},${num(gy)} Q ${num(TRIM.x + TRIM.w / 2)},${num(gy + bow)} ${num(TRIM.x + TRIM.w)},${num(gy)}" ` +
        `stroke="${T12}" stroke-width="${t.grainStrokeWidth}"/>`
      );
    }
  }
  for (let k = 0; k < t.knots; k++) {
    const kx = TRIM.x + mm(20) + rand() * (TRIM.w - mm(40));
    const ky = TRIM.y + mm(14) + rand() * (TRIM.h - mm(28));
    for (let r = 1; r <= 2; r++) {
      out.push(`<ellipse cx="${num(kx)}" cy="${num(ky)}" rx="${num(r * mm(1.3))}" ry="${num(r * mm(0.7))}" stroke="${T25}" stroke-width="${t.grainStrokeWidth}"/>`);
    }
  }
  return `<g fill="none" opacity="${t.grainOpacity}">\n    ${out.join('\n    ')}\n  </g>`;
}

/**
 * A recess a card drops into: a groove, corner brackets, and the name of what
 * belongs in it set faintly in the middle — which a card covers up the moment
 * one is played, and which is exactly when it stops being needed.
 */
function slot(x, y, label, notchSide = 'bottom') {
  /* the frame behind the notched edge: the margin if the pocket is against the
     sheet's edge, otherwise half the gap between the two rows of pockets, so the
     two notches facing each other across it can never meet */
  const rowGap = CONTENT.h - 2 * SLOT.h;
  const atEdge = notchSide === 'top' ? y <= CONTENT.y + 1 : y + SLOT.h >= CONTENT.y + CONTENT.h - 1;
  const room = atEdge ? mm(B.marginMm) : (rowGap + WALL) / 2;
  CUTS.push(pocketPath(x, y, SLOT.w, SLOT.h, SLOT.r, notchSide, room));
  const g = B.slot.grooveInset;
  const b = mm(B.slot.bracketMm);
  const brackets = [
    [x, y, 1, 1], [x + SLOT.w, y, -1, 1],
    [x, y + SLOT.h, 1, -1], [x + SLOT.w, y + SLOT.h, -1, -1],
  ].map(([bx, by, sx, sy]) =>
    `<path d="M ${num(bx + sx * mm(1))},${num(by + sy * b)} V ${num(by + sy * mm(1))} H ${num(bx + sx * b)}"/>`
  ).join('');

  return (
    `<g fill="none" stroke="${SOOT}">` +
    `<rect x="${num(x)}" y="${num(y)}" width="${num(SLOT.w)}" height="${num(SLOT.h)}" rx="${num(SLOT.r)}" stroke-width="${B.slot.strokeWidth}"/>` +
    `<rect x="${num(x + g)}" y="${num(y + g)}" width="${num(SLOT.w - 2 * g)}" height="${num(SLOT.h - 2 * g)}" rx="${num(Math.max(0, SLOT.r - g))}" stroke-width="0.9" stroke="${T40}"/>` +
    `<g stroke-width="2.2" stroke-linecap="round">${brackets}</g>` +
    `</g>` +
    `<text x="${num(x + SLOT.w / 2)}" y="${num(y + SLOT.h / 2 + 4)}" font-size="${num(mm(3.1))}" text-anchor="middle" ` +
    `letter-spacing="${num(mm(0.9))}" font-family="${SANS}" fill="${T40}">${esc(label)}</text>`
  );
}

/**
 * One numbered track: a head, and a ladder from the board's floor to its
 * ceiling, numbered from the bottom.
 *
 * Every fifth rung rules heavier and sets its number bold — the tally motif,
 * and the reason a player can read 12 without counting to 12. The bottom rung
 * is zero, so the token has somewhere to be when the answer is nothing.
 */
/* ------------------------------------------------------------- the frame */

/* What the frame cuts and engraves for the sheet being drawn. Every function
   that draws a piece of the board pushes the hole it needs here as it goes, so
   the frame is cut from exactly the geometry that was printed. */
let CUTS = [];
let ENGRAVE = [];
let POCKETS = [];
let MARKERS = 0;

/** A slot with a lane from laneX to laneX + MARK, and a notch MARK square
    beside each rung centre, on the left, the right or both. */
function castellated(laneX, yTop, yBot, centres, sides) {
  const L = laneX;
  const R = laneX + MARK;
  const h = MARK / 2;
  const down = [...centres].sort((a, b) => a - b);
  let d = `M ${num(L)},${num(yTop)} H ${num(R)}`;
  if (sides.includes('right')) for (const cy of down) d += ` V ${num(cy - h)} H ${num(R + MARK)} V ${num(cy + h)} H ${num(R)}`;
  d += ` V ${num(yBot)} H ${num(L)}`;
  if (sides.includes('left')) for (const cy of [...down].reverse()) d += ` V ${num(cy + h)} H ${num(L - MARK)} V ${num(cy - h)} H ${num(L)}`;
  return d + ' Z';
}

const rectPath = (x, y, w, h, r = 0) =>
  `M ${num(x + r)},${num(y)} H ${num(x + w - r)} A ${num(r)},${num(r)} 0 0 1 ${num(x + w)},${num(y + r)} ` +
  `V ${num(y + h - r)} A ${num(r)},${num(r)} 0 0 1 ${num(x + w - r)},${num(y + h)} H ${num(x + r)} ` +
  `A ${num(r)},${num(r)} 0 0 1 ${num(x)},${num(y + h - r)} V ${num(y + r)} A ${num(r)},${num(r)} 0 0 1 ${num(x + r)},${num(y)} Z`;

/** A card pocket with a finger notch on one edge. The notch is a circular
    segment cut OUTWARD from the pocket into the frame - on the top edge it bulges
    up, on the bottom edge it bulges down - so it is a recess beside the card and
    never a lip over it. `room` is how much frame stands behind that edge; the
    notch takes no more of it than leaves the thinnest wall. */
function pocketPath(x, y, w, h, r, notchSide, room = Infinity) {
  const c = mm(FR.thumb.widthMm) / 2;
  const d = Math.min(mm(FR.thumb.depthMm), room - WALL);
  if (d < mm(2)) throw new Error(`a card pocket has ${num(room / U)}mm of frame behind its ${notchSide} edge - no room for a finger notch`);
  const R = (c * c + d * d) / (2 * d);
  const cx = x + w / 2;
  /* travelling right along the top edge, sweep 1 bulges up; travelling left
     along the bottom edge, sweep 1 bulges down - outward either way */
  const top = notchSide === 'top'
    ? `H ${num(cx - c)} A ${num(R)},${num(R)} 0 0 1 ${num(cx + c)},${num(y)} H ${num(x + w - r)}`
    : `H ${num(x + w - r)}`;
  const bottom = notchSide === 'bottom'
    ? `H ${num(cx + c)} A ${num(R)},${num(R)} 0 0 1 ${num(cx - c)},${num(y + h)} H ${num(x + r)}`
    : `H ${num(x + r)}`;
  POCKETS.push({ x, y, w, h });
  return `M ${num(x + r)},${num(y)} ${top} A ${num(r)},${num(r)} 0 0 1 ${num(x + w)},${num(y + r)} ` +
    `V ${num(y + h - r)} A ${num(r)},${num(r)} 0 0 1 ${num(x + w - r)},${num(y + h)} ${bottom} ` +
    `A ${num(r)},${num(r)} 0 0 1 ${num(x)},${num(y + h - r)} V ${num(y + r)} A ${num(r)},${num(r)} 0 0 1 ${num(x + r)},${num(y)} Z`;
}

/**
 * A COLUMN TRACK: a lane, a notch beside every rung, and the numbers in the
 * lane. The marker sits in the notch beside its number; to move it, push it into
 * the lane, slide it up or down, and push it into the next notch. The board
 * prints the slot's own outline, so a board used without its frame still shows
 * where every notch is.
 */
function track(t, index) {
  const step = t.step ?? dotted(t.stepFrom);
  const x = TRACK_BLOCK.x + index * CELL_W;
  const top = TRACK_BLOCK.y + HEAD;
  const bottom = top + RUNGS * CELL_H;
  const laneX = x + (CELL_W - 2 * MARK) / 2 + MARK;
  const centres = Array.from({ length: RUNGS }, (_, i) => bottom - (i + 0.5) * CELL_H);
  const outline = castellated(laneX, top, bottom, centres, ['left']);
  CUTS.push(outline);
  MARKERS += 1;

  const wash = `<path d="${outline}" fill="${inkHex(t.ink)}" opacity="0.3"/>`;
  const ink = [`<path d="${outline}" fill="none" stroke="${SOOT}" stroke-width="1.4" stroke-linejoin="round"/>`];

  /* A LIMIT is a rung where something happens to the figure - hunger at the top
     of its track costs health every round. It is marked where the marker sits:
     the rung's notch filled in the track's own ink and the cost printed in the
     head, under the letter, so it is read before the marker ever gets there. */
  const limitAt = t.limit?.at;
  const limitWash = [];
  const numbers = [];
  centres.forEach((cy, i) => {
    const value = (B.track.from + i) * step;
    const major = value !== 0 && value % (B.track.ruleEvery * step) === 0;
    if (value === limitAt) {
      limitWash.push(`<rect x="${num(laneX - MARK)}" y="${num(cy - MARK / 2)}" width="${num(MARK)}" height="${num(MARK)}" fill="${inkHex(t.limit.ink ?? 'oxide')}" opacity="0.85"/>`);
    }
    numbers.push(
      `<text x="${num(laneX + MARK / 2)}" y="${num(cy + mm(1))}" font-size="${num(mm(value >= 10 ? 2.7 : 3))}" text-anchor="middle" ` +
      `font-family="${SANS}"${major || value === limitAt ? ' font-weight="bold"' : ''}>${value}</text>`
    );
  });
  ink.push(`<g fill="${SOOT}">${numbers.join('')}</g>`);

  /* The head is a window in the frame, a wall's width short of the slot below
     it so the frame keeps a bridge between the two. */
  const hx = x + WALL / 2;
  const hw = CELL_W - WALL;
  const hh = HEAD - WALL;
  CUTS.push(rectPath(hx, TRACK_BLOCK.y, hw, hh, mm(1)));
  const cx = x + CELL_W / 2;
  const headMid = TRACK_BLOCK.y + hh / 2;
  const sub = t.limit?.mark ?? t.unit;
  ink.push(
    `<rect x="${num(hx)}" y="${num(TRACK_BLOCK.y)}" width="${num(hw)}" height="${num(hh)}" rx="${num(mm(1))}" fill="none" stroke="${T55}" stroke-width="0.9"/>` +
    `<text x="${num(cx + mm(0.9))}" y="${num(TRACK_BLOCK.y + mm(8.2))}" font-size="${num(mm(6.2))}" text-anchor="middle" font-weight="bold">${esc(t.letter)}</text>` +
    `<text transform="translate(${num(hx + mm(1.5))} ${num(headMid)}) rotate(-90)" font-size="${num(mm(1.85))}" text-anchor="middle" ` +
    `textLength="${num(Math.min(t.label.length * mm(1.45), hh - mm(2)))}" lengthAdjust="spacingAndGlyphs" ` +
    `font-family="${SANS}" fill="${T70}">${esc(t.label)}</text>` +
    (sub
      ? `<text x="${num(cx + mm(0.9))}" y="${num(TRACK_BLOCK.y + mm(11.6))}" font-size="${num(mm(2))}" text-anchor="middle" ` +
        `font-family="${SANS}" font-weight="${t.limit ? 'bold' : 'normal'}" fill="${t.limit ? SOOT : T55}">${esc(sub)}</text>`
      : '')
  );

  const slip = t.arcane
    ? `<path d="${outline}" transform="translate(${num(mm(0.9))} ${num(-mm(0.9))})" fill="${inkHex(t.ink)}" opacity="0.3"/>`
    : '';
  return { wash: [wash, ...limitWash].join('\n  '), ink: ink.join('\n    '), slip };
}

/**
 * A WEAR LADDER: the same 0-to-ceiling ladder as a column, turned narrow and
 * stood against a card recess rather than run up the sheet.
 *
 * It is the same grid as everything else on the board on purpose - a player who
 * has learned to read one track has learned to read all five - but it is a third
 * the height, so it cannot afford a number on every rung. Every `ruleEvery` rung
 * rules heavier and carries its figure and the rest are plain cells, which is the
 * same tally motif the columns use doing the same job at a smaller size: it lets
 * somebody read 10 without counting to 10.
 *
 * The letter goes at the head, small, because the ladder is beside a card whose
 * strip prints the same letter - and the whole point of the letter matching is
 * that setting a token is reading across from one to the other.
 */
function kitPair(x, owner) {
  const top = CONTENT.y + KIT_HEAD;
  const bottom = CONTENT.y + CONTENT.h;
  const laneX = x + MARK;
  const centres = Array.from({ length: KIT_RUNGS }, (_, i) => bottom - (i + 0.5) * KIT_CELL_H);
  const sides = KIT_TRACKS.length === 2 ? ['left', 'right'] : ['left'];
  const outline = castellated(laneX, top, bottom, centres, sides);
  CUTS.push(outline);
  MARKERS += KIT_TRACKS.length;
  const wash = [`<path d="${outline}" fill="${T12}" opacity="0.5"/>`];
  const ink = [];
  /* each track's notches washed in its own ink, so a marker's colour of notch
     says which of the two it is counting */
  KIT_TRACKS.forEach((t, j) => {
    const px = j === 0 ? laneX - MARK : laneX + MARK;
    for (const cy of centres) wash.push(`<rect x="${num(px)}" y="${num(cy - MARK / 2)}" width="${num(MARK)}" height="${num(MARK)}" fill="${inkHex(t.ink)}" opacity="0.45"/>`);
    /* the head, the way a column's is: the letter over its own notches and the
       word running up the outside edge beside it, squeezed to fit the head */
    const hh0 = KIT_HEAD - WALL;
    const half = PAIR_W / 2;
    const hx = x + j * half;
    const wordX = j === 0 ? hx + mm(1.9) : hx + half - mm(1.9);
    const letterX = j === 0 ? hx + (half + mm(1.9)) / 2 : hx + (half - mm(1.9)) / 2;
    ink.push(
      `<text x="${num(letterX)}" y="${num(CONTENT.y + mm(8.2))}" font-size="${num(mm(4.2))}" text-anchor="middle" font-weight="bold">${esc(t.letter)}</text>` +
      `<text transform="translate(${num(wordX)} ${num(CONTENT.y + hh0 / 2)}) rotate(-90)" font-size="${num(mm(1.85))}" text-anchor="middle" dominant-baseline="${j === 0 ? 'auto' : 'hanging'}" ` +
      `textLength="${num(Math.min(t.label.length * mm(1.45), hh0 - mm(2)))}" lengthAdjust="spacingAndGlyphs" ` +
      `font-family="${SANS}" fill="${T70}">${esc(t.label)}</text>`
    );
  });
  ink.push(`<path d="${outline}" fill="none" stroke="${SOOT}" stroke-width="1.2" stroke-linejoin="round"/>`);
  const numbers = centres.map((cy, i) => {
    const value = KT.from + i;
    const major = value % B.track.ruleEvery === 0;
    return `<text x="${num(laneX + MARK / 2)}" y="${num(cy + mm(0.85))}" font-size="${num(mm(2.5))}" text-anchor="middle" font-family="${SANS}"${major ? ' font-weight="bold"' : ''}>${value}</text>`;
  });
  ink.push(`<g fill="${SOOT}">${numbers.join('')}</g>`);
  /* the head window: both letters, a bridge of frame under them */
  const hh = KIT_HEAD - WALL;
  CUTS.push(rectPath(x, CONTENT.y, PAIR_W, hh, mm(1)));
  ink.push(`<rect x="${num(x)}" y="${num(CONTENT.y)}" width="${num(PAIR_W)}" height="${num(hh)}" rx="${num(mm(1))}" fill="none" stroke="${T55}" stroke-width="0.9"/>`);
  /* an arrow from the pair to the card it counts. It is on the frame, engraved,
     because the frame covers the gap the board would print it in. */
  if (owner) {
    /* on the TOOTH nearest the card's middle - the wood between two notches -
       and no taller than the tooth, so an engraving never lands on a hole */
    const mid = owner.y + SLOT.h / 2;
    const k = Math.round((bottom - mid) / KIT_CELL_H);
    const ty = bottom - k * KIT_CELL_H;
    const ah = Math.min(mm(6), (KIT_CELL_H - MARK) / 2 - mm(0.4));
    const fromX = owner.side === 'right' ? x + PAIR_W : x;
    const toX = owner.side === 'right' ? fromX + LADDER_GAP : fromX - LADDER_GAP;
    const back = owner.side === 'right' ? fromX - mm(1.5) : fromX + mm(1.5);
    const arrow = `M ${num(back)},${num(ty - ah)} L ${num(toX)},${num(ty)} L ${num(back)},${num(ty + ah)} Z`;
    ink.push(`<path d="${arrow}" fill="${SOOT}"/>`);
    ENGRAVE.push(arrow);
  }
  return { wash: wash.join('\n  '), ink: ink.join('\n    ') };
}

/** A bay: ladder pair, two staggered recesses, ladder pair. The top card is the
    left pair's, the bottom card the right pair's. */
function bay(x, label, stagger = STAGGER, cards = SLOTS_PER_BAY) {
  const topY = CONTENT.y;
  const botY = CONTENT.y + CONTENT.h - SLOT.h;
  /* A bay with one card left in it is half a bay: the card, and its pair on the
     right - so a half bay closes the right-hand edge of a sheet rather than
     leaving a ladder standing against nothing. */
  if (cards === 1) {
    const pairX = x + SLOT.w + LADDER_GAP;
    return { ladders: [kitPair(pairX, { y: topY, side: 'left' })], slots: [slot(x, topY, label, 'bottom')], width: halfBayW() };
  }
  const leftX = x;
  const rightX = x + bayW(stagger) - PAIR_W;
  const topCardX = leftX + PAIR_W + LADDER_GAP;
  const botCardX = rightX - LADDER_GAP - SLOT.w;
  const ladders = [
    kitPair(leftX, { y: topY, side: 'right' }),
    kitPair(rightX, { y: botY, side: 'left' }),
  ];
  return { ladders, slots: [slot(topCardX, topY, label, 'bottom'), slot(botCardX, botY, label, 'top')], width: bayW(stagger) };
}
function bayW(stagger) { return 2 * PAIR_W + 2 * LADDER_GAP + SLOT.w + stagger; }
function halfBayW() { return SLOT.w + LADDER_GAP + PAIR_W; }

/**
 * The turn reference the bill of materials has always asked a player board for,
 * and under it the one piece of arithmetic a player needs while a monster card
 * is face up in front of them.
 *
 * Both are printed out of rules.json rather than written here, so the board
 * cannot fall out of step with the rules the way a hand-lettered one would.
 */
function panel() {
  const rules = datasets.rules;
  const phases = rules.round.phases;
  /* Whichever rule the board says it is printing - the path is in the data, so
     moving the arithmetic inside rules.json does not silently print the old one. */
  const fight = dotted(spec.panel.aside.source);
  const pad = mm(4);
  const x = PANEL.x;
  const y = PANEL.y;
  const rowH = mm(8.6);
  const top = y + mm(11.4);

  const out = [];
  CUTS.push(rectPath(x, y, PANEL.w, PANEL.h, mm(2.5)));
  out.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(PANEL.w)}" height="${num(PANEL.h)}" rx="${num(mm(2.5))}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>`);
  out.push(`<text x="${num(x + pad)}" y="${num(y + mm(7))}" font-size="${num(mm(2.9))}" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T70}">${esc(spec.panel.title)}</text>`);
  out.push(`<path d="M ${num(x + pad)},${num(y + mm(9.8))} H ${num(x + PANEL.w - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);

  /* banded rows, bare paper against the palest permitted tint — what a printed
     table wants, and what survives a photocopier */
  phases.forEach((phase, i) => {
    const ry = top + i * rowH;
    if (i % 2 === 0) out.push(`<rect x="${num(x + mm(2))}" y="${num(ry)}" width="${num(PANEL.w - mm(4))}" height="${num(rowH)}" fill="${T12}" opacity="0.6"/>`);
    out.push(
      `<rect x="${num(x + pad)}" y="${num(ry + mm(1.7))}" width="${num(mm(5.4))}" height="${num(mm(5.4))}" rx="${num(mm(1))}" fill="none" stroke="${SOOT}" stroke-width="1.2"/>` +
      `<text x="${num(x + pad + mm(2.7))}" y="${num(ry + mm(5.6))}" font-size="${num(mm(3))}" text-anchor="middle" font-family="${SANS}">${i + 1}</text>` +
      `<text x="${num(x + pad + mm(7.8))}" y="${num(ry + mm(5.7))}" font-size="${num(mm(3.3))}">${esc(phase.name)}</text>`
    );
  });

  let cursor = top + phases.length * rowH + mm(5);
  out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.6))}" font-style="italic" fill="${T85}">${esc(spec.panel.foot)}</text>`);

  /* The battle roll is the one piece of arithmetic on this board a player will
     not already know - and half of it they will, because it is the same
     subtraction, in the same two colours, that they made on the market. */
  cursor += mm(5.8);
  out.push(`<path d="M ${num(x + pad)},${num(cursor - mm(3.6))} H ${num(x + PANEL.w - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);
  out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.7))}" letter-spacing="${num(mm(0.7))}" font-family="${SANS}" fill="${T70}">${esc(spec.panel.aside.title)}</text>`);

  /* `worked` is an array now - the battle roll is worth two examples, one each
     way, where a target number only ever needed one. Take the first, because a
     65 mm panel is not a rulebook. */
  const workedFirst = Array.isArray(fight.worked) ? fight.worked[0] : fight.worked;
  const room = Math.floor((y + PANEL.h - mm(7.5) - (cursor + mm(4.2))) / mm(3.15)) + 1;
  const ruleLines = wrap(fight.rule, 40);
  const workedLines = wrap(workedFirst, 40);
  /* the example goes when it would run into the board's own name - the rule is
     what a player needs mid-fight, and the rulebook has room for the example */
  const lines = ruleLines.length + workedLines.length <= room ? [...ruleLines, ...workedLines] : ruleLines.slice(0, room);
  lines.forEach((line, i) => {
    out.push(`<text x="${num(x + pad)}" y="${num(cursor + mm(4.2) + i * mm(3.15))}" font-size="${num(mm(2.5))}">${esc(line)}</text>`);
  });

  /* the board's own name, small, where a maker's mark would have gone */
  out.push(
    `<text x="${num(x + PANEL.w / 2)}" y="${num(y + PANEL.h - mm(3.4))}" font-size="${num(mm(2.3))}" text-anchor="middle" ` +
    `letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T40}">game1 · ${esc(spec.board.name.toUpperCase())}</text>`
  );
  return out.join('\n    ');
}

/** The panel under the kit card: a reference for the road and a career, every
    figure in it resolved from the data (playerboard.json kitPanel). It takes the
    room under the one kit card and is cut as a shallow pocket in the frame like
    the round panel, so nothing about it is positioned by hand. */
function kitPanel(x, y, w, h) {
  const kp = spec.kitPanel;
  if (!kp || h < mm(30)) return '';
  const fill = (line) => line.replace(/\{([^}]+)\}/g, (_, path) => String(dotted(path)));
  const pad = mm(4);
  const out = [];
  CUTS.push(rectPath(x, y, w, h, mm(2.5)));
  out.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${num(mm(2.5))}" fill="none" stroke="${SOOT}" stroke-width="1.6"/>`);
  const lineH = mm(3.15);
  const maxChars = Math.floor((w - 2 * pad) / mm(1.27));
  let cursor = y + mm(7);
  for (const [si, sec] of kp.sections.entries()) {
    if (si) {
      cursor += mm(1.2);
      out.push(`<path d="M ${num(x + pad)},${num(cursor - mm(3.6))} H ${num(x + w - pad)}" stroke="${SOOT}" stroke-width="1.2"/>`);
      cursor += mm(1.2);
    }
    out.push(`<text x="${num(x + pad)}" y="${num(cursor)}" font-size="${num(mm(2.7))}" letter-spacing="${num(mm(0.7))}" font-family="${SANS}" fill="${T70}">${esc(sec.title)}</text>`);
    cursor += mm(4.4);
    for (const line of sec.lines) {
      const rows = wrap(fill(line), maxChars);
      rows.forEach((row, i) => {
        out.push(`<text x="${num(x + pad + (i ? mm(2) : 0))}" y="${num(cursor)}" font-size="${num(mm(2.5))}">${i ? '' : '· '}${esc(row)}</text>`);
        cursor += lineH;
      });
      cursor += mm(0.9);
    }
    cursor += mm(2);
  }
  if (cursor > y + h) throw new Error(`the kit panel wants ${num((cursor - y) / U)}mm and has ${num(h / U)}mm - say less in playerboard.json kitPanel`);
  return out.join('\n    ');
}

/** Where the die goes, marked in the bleed and never on the board. */
function dieMarks() {
  const g = 8;
  const R = CORNER + g;
  const b = { x: TRIM.x - g, y: TRIM.y - g, w: TRIM.w + 2 * g, h: TRIM.h + 2 * g };
  const arcs = [
    `M ${num(b.x)},${num(b.y + R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + R)},${num(b.y)}`,
    `M ${num(b.x + b.w - R)},${num(b.y)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w)},${num(b.y + R)}`,
    `M ${num(b.x + b.w)},${num(b.y + b.h - R)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x + b.w - R)},${num(b.y + b.h)}`,
    `M ${num(b.x + R)},${num(b.y + b.h)} A ${num(R)},${num(R)} 0 0 1 ${num(b.x)},${num(b.y + b.h - R)}`,
  ];
  return `<g fill="none" stroke="${SOOT}" stroke-width="1.2" opacity="0.32">${arcs.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

/** Press wear: foxed corners and specks. No rings - see CLAUDE.md, and\n *  tools/validate-art.mjs, which fails the build on one. */
function grime(seed) {
  const rand = rng(`grime-${seed}`);
  const specks = Array.from({ length: 9 }, () =>
    `<circle cx="${num(TRIM.x + rand() * TRIM.w)}" cy="${num(TRIM.y + rand() * TRIM.h)}" r="${num(1 + rand() * 1.6)}"/>`
  ).join('');
  return (
    dieMarks() +
    `<path d="M ${num(TRIM.x)},${num(TRIM.y)} H ${num(TRIM.x + mm(26))} Q ${num(TRIM.x + mm(10))},${num(TRIM.y + mm(12))} ${num(TRIM.x)},${num(TRIM.y + mm(24))} Z" fill="${SOOT}" opacity="0.03"/>` +
    `<path d="M ${num(TRIM.x + TRIM.w)},${num(TRIM.y + TRIM.h)} H ${num(TRIM.x + TRIM.w - mm(24))} Q ${num(TRIM.x + TRIM.w - mm(9))},${num(TRIM.y + TRIM.h - mm(11))} ${num(TRIM.x + TRIM.w)},${num(TRIM.y + TRIM.h - mm(22))} Z" fill="${SOOT}" opacity="0.028"/>` +
    `<g fill="${SOOT}" opacity="0.05">${specks}</g>`
  );
}

/* --------------------------------------------------------------- the board */

function board() {
  CUTS = [];
  ENGRAVE = [];
  POCKETS = [];
  MARKERS = 0;
  const cols = COLUMN_TRACKS.map((t, i) => track(t, i));
  const kit = spec.slots.find((s) => s.id === 'kit');
  const figure = spec.slots.find((s) => s.id === 'figure');

  const kitSlots = [];
  const ladders = [];
  let bx = KIT_X;
  for (let i = 0; i < PLAYER_BAYS; i++) {
    const bb = bay(bx, kit.label, STAGGER, i < PLAYER_FULL ? SLOTS_PER_BAY : 1);
    ladders.push(...bb.ladders);
    kitSlots.push(...bb.slots);
    bx += bb.width + GUT;
  }
  const arcane = TRACKS.filter((t) => t.arcane).map((t) => t.label.toLowerCase()).join(', ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(spec.board.name)}</title>
<desc>${esc(spec.board.summary)} The ${esc(arcane)} track is an arcane subject and is the only thing on the board that takes the slip. Generated by tools/build-board.mjs from data/playerboard.json and data/components.json — do not edit. ${B.sheet.widthMm} x ${B.sheet.heightMm} mm at ${U} units/mm, ${B.sheet.bleedMm} mm bleed. The ink plate alone is the black-and-white edition.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>

<!-- ============================================================ WASH -->
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${cols.map((c) => c.wash).join('\n  ')}
  ${ladders.map((l) => l.wash).join('\n  ')}
</g>

<!-- ============================================================ SLIP -->
<!-- The arcane exception, and the only one on the board: the mana column's wash
     struck a shade out of register, bleeding past the ink line on one side. In
     the black-and-white edition there is no slip and nothing is lost. -->
<g id="slip">
  ${cols.map((c) => c.slip).filter(Boolean).join('\n  ')}
</g>

<!-- ============================================================ INK -->
<g id="ink" fill="${SOOT}">
  <!-- the workbench itself: sawn boards the length of the sheet, running to the
       edge, because there is no border for them to stop at -->
  <g clip-path="url(#sheet)">
    ${timber(spec.board.id)}
  </g>

  <!-- whatever is in play here - a hero, a monster, a wagon - and the round it
       is playing -->
  ${slot(CONTENT.x, CONTENT.y, figure.label, 'top')}
  ${panel()}

  <!-- the tracks: numbered from the bottom, walked by a token, exactly as a
       card's edge bar is - the board is not allowed a second convention -->
  ${cols.map((c) => c.ink).join('\n  ')}

  <!-- its kit: gear and quests for a figure, cargo and modifications for a hull -
       and against each one the ladder that counts what is left in the thing
       lying in it. The ladder is drawn BEFORE the recess so a bracket that
       reaches over it stays on top. -->
  ${ladders.map((l) => l.ink).join('\n  ')}
  ${kitSlots.join('\n  ')}
  ${PLAYER_FULL === 0 && PLAYER_HALF ? kitPanel(KIT_X, CONTENT.y + SLOT.h + GUT, SLOT.w, CONTENT.h - SLOT.h - GUT) : ''}
</g>

<!-- ============================================================ GRIME -->
<g id="grime">
  ${grime(spec.board.id)}
</g>
</svg>
`;
}

/* ------------------------------------------------------- the items board */

/* The player board's kit bay, printed as many times as the items board has
   cards for, and spread across the sheet with the board's key in what is left
   between them. Nothing here is a coordinate either: the bays are as wide as the
   bay module says, and the key takes the middle because it is what is left. */
function itemsBoard() {
  CUTS = [];
  ENGRAVE = [];
  POCKETS = [];
  MARKERS = 0;
  const kit = itemSpec.slots.find((s) => s.id === 'kit');
  const full = Math.floor(kit.count / SLOTS_PER_BAY);
  const half = kit.count % SLOTS_PER_BAY;
  const units = full + half;
  /* The bays are packed from the left with a gutter between them. What the
     sheet has left over goes first to the stagger, up to the player board's own,
     because the stagger is what says which card a pair counts; anything after
     that widens the gutters. Too little for even an unstaggered bay fails. */
  const bare = full * bayW(0) + half * halfBayW() + (units - 1) * GUT;
  const spare = CONTENT.w - bare;
  if (spare < 0) {
    throw new Error(`${kit.count} kit cards want ${num(bare / U)}mm and the sheet has ${num(CONTENT.w / U)}mm - the items board has run out of width`);
  }
  const stagger = full ? Math.min(STAGGER, spare / full) : 0;
  const extraGut = units > 1 ? (spare - stagger * full) / (units - 1) : 0;
  const ladders = [];
  const slots = [];
  let x = CONTENT.x;
  let halfX = null;
  for (let i = 0; i < units; i++) {
    const cards = i < full ? SLOTS_PER_BAY : half;
    if (cards === 1) halfX = x;
    const bb = bay(x, kit.label, stagger, cards);
    ladders.push(...bb.ladders);
    slots.push(...bb.slots);
    x += bb.width + GUT + extraGut;
  }
  /* The key takes the corner a half bay leaves empty under its one card; with
     no half bay there is no corner, and the sheet goes without. */
  const kx = halfX ?? 0;
  const kw = halfX === null ? 0 : SLOT.w;
  /* below the finger notch of the card above it, and a wall below that */
  const keyTop = CONTENT.y + SLOT.h + mm(FR.thumb.depthMm) + WALL;
  const key = [];
  const keyWash = [];
  if (kw > mm(30)) {
    CUTS.push(rectPath(kx, keyTop, kw, CONTENT.y + CONTENT.h - keyTop, mm(2.5)));
    const cx = kx + kw / 2;
    let ky = keyTop + mm(14);
    key.push(`<text x="${num(cx)}" y="${num(ky)}" font-size="${num(mm(3.2))}" text-anchor="middle" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T70}">${esc(itemSpec.key.title)}</text>`);
    ky += mm(4);
    key.push(`<path d="M ${num(kx + mm(4))},${num(ky)} H ${num(kx + kw - mm(4))}" stroke="${SOOT}" stroke-width="1.2"/>`);
    ky += mm(9);
    for (const t of KIT_TRACKS) {
      keyWash.push(`<rect x="${num(kx + mm(4))}" y="${num(ky - mm(5))}" width="${num(mm(7))}" height="${num(mm(7))}" fill="${inkHex(t.ink)}" opacity="0.3"/>`);
      key.push(
        `<rect x="${num(kx + mm(4))}" y="${num(ky - mm(5))}" width="${num(mm(7))}" height="${num(mm(7))}" fill="none" stroke="${SOOT}" stroke-width="1"/>` +
        `<text x="${num(kx + mm(7.5))}" y="${num(ky)}" font-size="${num(mm(3.6))}" text-anchor="middle" font-family="${SANS}" font-weight="bold">${esc(t.letter)}</text>` +
        `<text x="${num(kx + mm(13))}" y="${num(ky)}" font-size="${num(mm(3.4))}">${esc(t.name)}</text>`
      );
      ky += mm(10);
    }
    for (const line of itemSpec.key.lines) {
      for (const w of wrap(line, Math.floor(kw / mm(1.45)))) {
        key.push(`<text x="${num(cx)}" y="${num(ky)}" font-size="${num(mm(2.7))}" text-anchor="middle" font-style="italic" fill="${T85}">${esc(w)}</text>`);
        ky += mm(3.8);
      }
      ky += mm(1.5);
    }
    key.push(`<text x="${num(cx)}" y="${num(CONTENT.y + CONTENT.h - mm(3.4))}" font-size="${num(mm(2.3))}" text-anchor="middle" letter-spacing="${num(mm(0.8))}" font-family="${SANS}" fill="${T40}">game1 · ${esc(itemSpec.board.name.toUpperCase())}</text>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SERIF}">
<title>${esc(itemSpec.board.name)}</title>
<desc>${esc(itemSpec.board.summary)} Generated by tools/build-board.mjs from data/itemboard.json, data/playerboard.json and data/components.json — do not edit. ${B.sheet.widthMm} x ${B.sheet.heightMm} mm at ${U} units/mm, ${B.sheet.bleedMm} mm bleed.</desc>
<defs>
  <clipPath id="sheet">${rect(inset(0), '')}</clipPath>
</defs>
<g id="wash">
  <rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
  ${ladders.map((l) => l.wash).join('\n  ')}
  ${keyWash.join('\n  ')}
</g>
<g id="ink" fill="${SOOT}">
  <g clip-path="url(#sheet)">
    ${timber(itemSpec.board.id)}
  </g>
  ${ladders.map((l) => l.ink).join('\n  ')}
  ${slots.join('\n  ')}
  ${key.join('\n  ')}
</g>
<g id="grime">
  ${grime(itemSpec.board.id)}
</g>
</svg>
`;
}

/** The frame for whichever sheet was drawn last: its outline, and every hole
    the drawing pushed. A machine file in millimetres - red hairline is cut,
    black is engraved - so it is never printed and takes no colour from the
    palette. */
function markerCuts() {
  /* One marker per track the frame holds, and the spares, in a grid inside the
     first card pocket - the waste that drops out of it anyway. */
  const n = MARKERS + FR.spareMarkers;
  const p = POCKETS[0];
  const pitch = PIP + mm(FR.minWallMm) + mm(2);
  const inset = mm(6);
  const cols = Math.floor((p.w - 2 * inset) / pitch);
  const rows = Math.ceil(n / cols);
  if (rows * pitch > p.h - 2 * inset) throw new Error(`${n} markers do not fit in the waste of one card pocket`);
  const x0 = p.x + (p.w - cols * pitch) / 2 + pitch / 2;
  const y0 = p.y + p.h / 2 - (rows * pitch) / 2 + pitch / 2;
  return Array.from({ length: n }, (_, i) =>
    `<circle cx="${num(x0 + (i % cols) * pitch)}" cy="${num(y0 + Math.floor(i / cols) * pitch)}" r="${num(PIP / 2)}"/>`);
}

function frameSvg(name) {
  const cut = FR.cutStroke;
  const markers = markerCuts();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${num(TRIM.x)} ${num(TRIM.y)} ${num(TRIM.w)} ${num(TRIM.h)}" width="${B.sheet.widthMm}mm" height="${B.sheet.heightMm}mm">
<title>${esc(name)} - frame</title>
<desc>Laser-cut frame for the ${esc(name)}: ${FR.thicknessMm} mm sheet, ${B.sheet.widthMm} x ${B.sheet.heightMm} mm. Red hairline is cut, black is engraved. Generated by tools/build-board.mjs from the same geometry as the board - do not edit.</desc>
<g id="engrave" fill="${FR.engraveFill}">
  ${ENGRAVE.map((d) => `<path d="${d}"/>`).join('\n  ')}
</g>
<g id="cut" fill="none" stroke="${cut}" stroke-width="${num(mm(0.1))}">
  <path id="outline" d="${rectPath(TRIM.x, TRIM.y, TRIM.w, TRIM.h, CORNER)}"/>
  ${CUTS.map((d) => `<path d="${d}"/>`).join('\n  ')}
</g>
<!-- the markers: ${MARKERS} for the tracks and ${FR.spareMarkers} spare, cut from the waste inside a card pocket.
     Cut these before the pocket around them, or they drop with it. -->
<g id="markers" fill="none" stroke="${cut}" stroke-width="${num(mm(0.1))}">
  ${markers.join('\n  ')}
</g>
</svg>
`;
}

/* ------------------------------------------------------------------ output */

const BOARD_FILE = `${spec.board.id}.svg`;
const ITEMS_FILE = `${itemSpec.board.id}.svg`;
const svg = board();
const playerFrame = frameSvg(spec.board.name);

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>game1 — the player board</title>
<style>
  body { margin: 0; background: ${TALLOW}; color: ${SOOT}; font-family: ${SERIF}; }
  .wrap { margin: 24px auto; max-width: 1180px; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 6px; } h2 { font-size: 16px; margin: 26px 0 6px; }
  p.note { color: ${T70}; font-size: 14px; max-width: 74ch; }
  .bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: baseline; font-family: ${SANS}; font-size: 13.5px; margin-bottom: 16px; }
  .bar a { color: ${T85}; }
  .bar a.primary { color: ${SOOT}; font-weight: bold; }
  /* A4 landscape, corner and all: a preview with square corners is a preview of
     a board nobody is going to cut. */
  .boards figure + figure { margin-top: 24px; }
  .boards img { display: block; width: 100%; aspect-ratio: ${num(W)} / ${num(H)}; border: 1px solid ${T25};
                background: ${TALLOW}; border-radius: 10px; }
  figure { margin: 0; }
  table { border-collapse: collapse; font-size: 14px; margin: 8px 0 0; }
  th, td { text-align: left; padding: 5px 14px 5px 0; border-bottom: 1px solid ${T25}; vertical-align: top; }
  th { font-family: ${SANS}; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: ${T70}; font-weight: 600; }
  td.letter { font-weight: bold; font-size: 17px; }
  /* Print: one board a page at true size, and nothing else on the paper.
     The board is drawn with ${B.sheet.bleedMm}mm of bleed all round, so the sheet is laid
     ${B.sheet.bleedMm}mm out and up inside a window the size of the trim - the bleed runs off the
     page edge, which is the only place bleed is any use. Scale the whole thing
     to the page instead and the board prints 2% small. */
  @media print {
    .wrap { max-width: none; margin: 0; padding: 0; }
    /* Nothing on the paper but the board. Naming what to hide goes stale the
       first time the page grows a heading it has not heard of - which is exactly
       how the market sheet came to print a second page carrying three stray
       <h3>s - so this names what to KEEP instead, and cannot rot. */
    .wrap > *:not(.boards) { display: none; }
    .boards figure { position: relative; width: ${B.sheet.widthMm}mm; height: ${B.sheet.heightMm}mm; overflow: hidden; break-after: page; }
    .boards figure + figure { margin-top: 0; }
    .boards img { position: absolute; left: -${B.sheet.bleedMm}mm; top: -${B.sheet.bleedMm}mm;
                  width: ${num(B.sheet.widthMm + 2 * B.sheet.bleedMm)}mm; height: ${num(B.sheet.heightMm + 2 * B.sheet.bleedMm)}mm;
                  border: 0; border-radius: 0; aspect-ratio: auto; }
    @page { size: A4 landscape; margin: 0; }
  }
</style>
</head>
<body>
<div class="wrap">
<div class="bar">
  <a href="../index.html">← Explorer</a>
  <a href="../book/index.html">The rulebook</a>
  <a href="../cards/index.html">The card fronts</a>
  <a href="../markets/index.html">The market board</a>
  <a href="../minimaps/index.html">The mini-map sheets</a>
  <a href="../tiles/index.html">The building tiles</a>
  <a href="../map/index.html">The map</a>
  <a class="primary" href="#" onclick="window.print();return false;">Print the board →</a>
</div>
<h1>The player board</h1>
<p class="note">${esc(spec.board.summary)}</p>
<p class="note">${esc(spec.board.generic)}</p>
<p class="note">Generated by <code>tools/build-board.mjs</code> from <code>data/playerboard.json</code> and
<code>data/components.json</code> — edit those, re-run the tool, and never these files. Print one copy per player:
set your printer to 100% and landscape and turn off "fit to page", and the ${B.sheet.bleedMm}&nbsp;mm of bleed the board is
drawn with runs off the edge of the paper, which is the only place bleed is any use.</p>

<h2>The ${COLUMN_TRACKS.length} columns, and the ladders against the kit</h2>
<p class="note">${COLUMN_TRACKS.length} columns run up the middle of the sheet and are about the figure in the recess.
Against every kit card stands a pair of ladders - ${KIT_TRACKS.map((t) => esc(t.label.toLowerCase())).join(' and ')} - running
${KT.from}&ndash;${KT.to} the full height of the sheet, about the card lying in that slot rather than about the player,
walked by a ${components.tokens.pip.diameterMm}&nbsp;mm pip where a column takes a ${components.tokens.bar.diameterMm}&nbsp;mm bar.
The top card in a bay is counted on the pair to its left, the bottom card on the pair to its right.</p>
<table>
<tr><th></th><th>Track</th><th>Where</th><th>Runs</th><th>What walks it</th></tr>
${TRACKS.map((t) => {
  const step = t.step ?? dotted(t.stepFrom);
  const unit = t.unit ? ' ' + esc(t.unit) : '';
  const where = t.place === 'kit' ? 'a ladder against every kit card' : 'a column up the middle';
  return `<tr><td class="letter">${esc(t.letter)}</td><td>${esc(t.label)}${t.unit ? ` <small>(${esc(t.unit)})</small>` : ''}</td>` +
    `<td>${where}</td>` +
    `<td>${t.place === 'kit' ? `${KT.from * step}–${KT.to * step}` : `${B.track.from * step}–${B.track.to * step}`}${unit}</td><td>${esc(t.walks)}</td></tr>`;
}).join('\n')}
</table>

<h2>Print it, and cut a frame if you have a laser</h2>
<p class="note">There is one board, and it is the print. Print it and play on the paper, or print it and lay a
laser-cut frame over it - the same print does both. The frame is ${FR.thicknessMm}&nbsp;mm ply: a pocket for every card
and a notched slot for every track, so a bumped board moves nothing and boards stack. The markers are cut from the
same sheet, ${FR.spareMarkers} spare. In the cutting files red is cut and black is engraved; cut the markers before the
card pocket they sit in.</p>
<p class="note"><a href="${spec.board.id}-frame.svg" download>Player board frame (SVG, for the laser)</a> ·
<a href="${itemSpec.board.id}-frame.svg" download>Items board frame (SVG, for the laser)</a></p>

<h2>The board</h2>
<div class="boards">
  <!-- <img>, not <object>. An <object> is a nested browsing context, and a nested
       browsing context is the one thing a print preview is not obliged to paint. On
       this page that is not a degraded print, it is a blank sheet: everything else is
       display:none by then, so the board is the only thing on the paper. The card
       sheet pays that price on purpose - an SVG in an <img> may not fetch the plate it
       draws, and the plate is the card - but this board draws every mark itself and
       fetches nothing, so it has nothing to buy with it. -->
  <figure><img src="${BOARD_FILE}" alt="The player board"></figure>
  <figure><img src="${ITEMS_FILE}" alt="The items board"></figure>
</div>
</div>
</body>
</html>
`;

const itemsSvg = itemsBoard();
const itemsFrame = frameSvg(itemSpec.board.name);
const outputs = [[BOARD_FILE, svg], [`${spec.board.id}-frame.svg`, playerFrame], [ITEMS_FILE, itemsSvg], [`${itemSpec.board.id}-frame.svg`, itemsFrame], ['index.html', index]];
const keep = new Set(outputs.map(([f]) => f));

/* Boards that are no longer built - the five per-people sheets this replaced -
   are removed rather than left to be served by a site that has moved on. */
const stale = existsSync(OUT_DIR)
  ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg') && !keep.has(f))
  : [];

if (checkOnly) {
  const drifted = outputs.filter(([file, body]) => {
    let current = '';
    try { current = readFileSync(join(OUT_DIR, file), 'utf8'); } catch { /* absent counts as stale */ }
    return current !== body;
  }).map(([f]) => f);
  if (drifted.length || stale.length) {
    console.error(`docs/boards is stale (${[...drifted, ...stale.map((f) => f + ' should not exist')].join(', ')}). Run: node tools/build-board.mjs`);
    process.exit(1);
  }
  console.log('docs/boards is up to date');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, body] of outputs) writeFileSync(join(OUT_DIR, file), body, 'utf8');
  for (const f of stale) unlinkSync(join(OUT_DIR, f));
  console.log(
    `wrote docs/boards/${BOARD_FILE} — ${B.sheet.widthMm}x${B.sheet.heightMm}mm, ` +
    `${COLUMN_TRACKS.length} columns of ${B.track.from}-${B.track.to} ` +
    `(${num(CELL_W / U)}x${num(CELL_H / U)}mm cells)` +
    `, ${PLAYER_BAYS} kit bay(s) of ${KIT_TRACKS.length}-lane ${KT.from}-${KT.to} ladders (${num(MARK / U)}mm notches, ${num(KIT_CELL_H / U)}mm rungs); frames cut for both` +
    `, ${spec.slots.reduce((n, s) => n + s.count, 0)} card slots` +
    (stale.length ? `; removed ${stale.length} board(s) no longer built` : '')
  );
}
