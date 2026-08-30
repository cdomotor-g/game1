#!/usr/bin/env node
/**
 * A proof sheet for the price ledger: one seven-segment figure at reading size
 * and at twelve times it, every digit from 0 to 9 shown filled, and a strip of
 * real ledger cells with a millimetre ruler under them.
 *
 * The same job as tools/card-proof.mjs and tools/tile-proof.mjs, and the same
 * reason: every check in this repository proves something about the NUMBERS, and
 * none of them looks at the artefact. A ledger can be built, validated, committed
 * and never once seen — and the one thing a ledger has to survive is being looked
 * at, because a player is going to fill in four hundred of these figures with a
 * pencil.
 *
 * THE RULER IS THE POINT. A seven-segment figure blown up on a screen always
 * looks fine; the question is whether it works at 4.9 x 8.4 mm, which is smaller
 * than the type in this sentence. So the proof prints the figures at true size
 * against a millimetre scale, and the enlargement beside them is there to show
 * what shape they are, never to flatter them.
 *
 * Output is git-ignored, like every other proof here: a proof is a photograph of
 * the artefact, never the artefact.
 *
 * Usage: node tools/ledger-proof.mjs [--scale N]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT = join(ROOT, 'docs', 'ledger', 'proof');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const palette = JSON.parse(readFileSync(join(ROOT, 'docs/art/palette.json'), 'utf8'));
const components = read('components.json');
const rules = read('rules.json');

const SOOT = palette.ink.soot.hex;
const TALLOW = palette.paper.tallow.hex;
const T70 = palette.ink.tints['70'].hex;
const T40 = palette.ink.tints['40'].hex;
const OXIDE = palette.inks.oxide.hex;
const SANS = 'Helvetica, Arial, sans-serif';

const L = components.ledger;
const U = components.stock.unitsPerMm;
const mm = (v) => v * U;
const num = (n) => Number(n.toFixed(3));

/* The same arithmetic build-ledger.mjs does, and deliberately re-derived rather
   than imported: a proof that shared the tool's own sums could not catch the
   tool getting them wrong. */
const CONTENT_H = L.sheet.heightMm - 2 * L.marginMm;
const ROWS = rules.victory.gameLengthRounds;
const ROW_H = (CONTENT_H - L.head.heightMm - L.foot.heightMm) / ROWS;
const DIGIT_H = mm(ROW_H - 2 * L.row.padMm);
const SEG_T = L.digit.thicknessPerHeight * DIGIT_H;
const SEG_G = L.digit.gapPerHeight * DIGIT_H;
const DIGIT_W = DIGIT_H / 2 + SEG_T / 2;
const DIGIT_GAP = L.digit.digitGapPerHeight * DIGIT_H;

/** The seven segments as named paths, so the proof can light any subset. */
function segments(x, y, h) {
  const t = L.digit.thicknessPerHeight * h;
  const g = L.digit.gapPerHeight * h;
  const w = h / 2 + t / 2;
  const s = t / 2;
  const xL = x + s;
  const xR = x + w - s;
  const yA = y + s;
  const yG = y + h / 2;
  const yD = y + h - s;
  const horiz = (yc) =>
    `M ${num(xL + g)},${num(yc)} L ${num(xL + g + s)},${num(yc - s)} L ${num(xR - g - s)},${num(yc - s)} ` +
    `L ${num(xR - g)},${num(yc)} L ${num(xR - g - s)},${num(yc + s)} L ${num(xL + g + s)},${num(yc + s)} Z`;
  const vert = (xc, y0, y1) =>
    `M ${num(xc)},${num(y0 + g)} L ${num(xc + s)},${num(y0 + g + s)} L ${num(xc + s)},${num(y1 - g - s)} ` +
    `L ${num(xc)},${num(y1 - g)} L ${num(xc - s)},${num(y1 - g - s)} L ${num(xc - s)},${num(y0 + g + s)} Z`;
  return {
    w,
    a: horiz(yA), g: horiz(yG), d: horiz(yD),
    f: vert(xL, yA, yG), b: vert(xR, yA, yG),
    e: vert(xL, yG, yD), c: vert(xR, yG, yD),
  };
}

const LIT = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcfgd',
};

/*
 * STROKE AND FILL ARE TWO DIFFERENT SUBSTANCES HERE, and drawing them at one
 * opacity is how this sheet used to lie.
 *
 * The stroke is PRINTED INK: the hollow guide the press lays down, and it is
 * deliberately close to invisible - components.json ledger.digit.outlineOpacity,
 * the same number tools/build-ledger.mjs strokes the real sheet with. It was
 * hardcoded here at 0.9 against the sheet's own 0.85, so the one tool whose
 * whole job is to show the artefact honestly was showing it darker than it
 * prints. Both read the declaration now.
 *
 * The fill is a PLAYER'S PENCIL: graphite, put there afterwards, and it does not
 * fade when the printed guide does. Fading them together would show a sheet
 * nobody will ever look at - the guide is faint precisely SO the pencil can be
 * loud, and a proof that dims both hides the whole point of the change.
 */
const PENCIL_OPACITY = 0.9;

function digit(x, y, h, lit, stroke) {
  const S = segments(x, y, h);
  const on = new Set((lit ?? '').split(''));
  const paths = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    .map((k) => `<path d="${S[k]}" fill="${on.has(k) ? SOOT : 'none'}"/>`)
    .join('');
  return (
    `<g stroke="${SOOT}" stroke-width="${num(stroke)}" stroke-opacity="${L.digit.outlineOpacity}" ` +
    `fill-opacity="${PENCIL_OPACITY}">${paths}</g>`
  );
}

const scaleArg = process.argv.indexOf('--scale');
const BIG = scaleArg > -1 ? Number(process.argv[scaleArg + 1]) : 12;

const W = mm(190);
const H = mm(150);
const out = [];
const label = (x, y, t, size = mm(3), fill = SOOT) =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${num(size)}" font-family="${SANS}" fill="${fill}">${t}</text>`;

/* 1. TRUE SIZE, against a ruler. This is the only part of the sheet that matters. */
let y = mm(14);
out.push(label(mm(10), mm(9), `TRUE SIZE — one figure is ${num(DIGIT_W / U)} × ${num(DIGIT_H / U)} mm`));
out.push(label(mm(10), mm(12.4), `thickness ${num(SEG_T / U)} mm · outline ${L.digit.outlineStrokeMm} mm at ${Math.round(L.digit.outlineOpacity * 100)}% · colourable core ${num(SEG_T / U - L.digit.outlineStrokeMm)} mm`, mm(2.4), T70));
for (let d = 0; d <= 9; d++) {
  const x = mm(10) + d * (DIGIT_W + DIGIT_GAP) * 1.6;
  out.push(digit(x, y, DIGIT_H, '', mm(L.digit.outlineStrokeMm)));
  out.push(digit(x, y + DIGIT_H + mm(3), DIGIT_H, LIT[d], mm(L.digit.outlineStrokeMm)));
  out.push(label(x, y + 2 * DIGIT_H + mm(7), String(d), mm(2.4), T70));
}
/* A real three-figure group, and one struck through, at true size. */
const gx = mm(10) + 10 * (DIGIT_W + DIGIT_GAP) * 1.6 + mm(8);
'188'.split('').forEach((c, n) => out.push(digit(gx + n * (DIGIT_W + DIGIT_GAP), y, DIGIT_H, LIT[c], mm(L.digit.outlineStrokeMm))));
const groupW = 3 * DIGIT_W + 2 * DIGIT_GAP;
out.push(`<path d="M ${num(gx - mm(0.6))},${num(y + DIGIT_H / 2)} H ${num(gx + groupW + mm(0.6))}" stroke="${OXIDE}" stroke-width="${num(mm(0.5))}"/>`);
'220'.split('').forEach((c, n) => out.push(digit(gx + n * (DIGIT_W + DIGIT_GAP), y + DIGIT_H + mm(3), DIGIT_H, LIT[c], mm(L.digit.outlineStrokeMm))));
out.push(label(gx, y + 2 * DIGIT_H + mm(7), 'struck, and the new price under it', mm(2.4), T70));

/* The millimetre ruler, so nothing above can flatter itself. */
y += 2 * DIGIT_H + mm(12);
out.push(`<path d="M ${num(mm(10))},${num(y)} H ${num(mm(10) + mm(60))}" stroke="${SOOT}" stroke-width="1"/>`);
for (let i = 0; i <= 60; i++) {
  const tall = i % 10 === 0 ? mm(2.6) : i % 5 === 0 ? mm(1.7) : mm(1);
  out.push(`<path d="M ${num(mm(10 + i))},${num(y)} V ${num(y + tall)}" stroke="${SOOT}" stroke-width="${i % 10 === 0 ? 1 : 0.6}"/>`);
  if (i % 10 === 0) out.push(label(mm(10 + i) - mm(1), y + mm(5.6), String(i), mm(2.2), T70));
}
out.push(label(mm(74), y + mm(3), 'millimetres', mm(2.4), T70));

/* 2. THE ENLARGEMENT — what shape it is, never how big it looks. */
y += mm(12);
out.push(label(mm(10), y, `ENLARGED ×${BIG} — the seven segments, and why they are mitred`));
y += mm(5);
const bigH = DIGIT_H * BIG / 4;
const bigS = segments(mm(10), y, bigH);
out.push(digit(mm(10), y, bigH, '', mm(L.digit.outlineStrokeMm) * 2));
out.push(digit(mm(10) + bigS.w + mm(6), y, bigH, LIT[8], mm(L.digit.outlineStrokeMm) * 2));
out.push(digit(mm(10) + 2 * (bigS.w + mm(6)), y, bigH, LIT[2], mm(L.digit.outlineStrokeMm) * 2));
out.push(digit(mm(10) + 3 * (bigS.w + mm(6)), y, bigH, LIT[5], mm(L.digit.outlineStrokeMm) * 2));
const notesX = mm(10) + 4 * (bigS.w + mm(6)) + mm(4);
[
  'All seven segments are always printed. An unlit one is what',
  'makes a hollow figure read as a NUMBER WAITING rather than as',
  'a shape — and drawing only the lit ones would mean the tool',
  'knew the price, which it must not.',
  '',
  'The bars are mitred — hexagons with 45° ends — because mitres',
  'are what let seven identical bars meet at six corners without',
  'overlapping. The gap at each mitre is what stops a filled 8',
  'coming out as one solid block.',
  '',
  `Every bar is the same length, and that is why the width is`,
  `DERIVED: w = h/2 + t/2 is the only width for which the three`,
  `horizontals and the four verticals come out equal.`,
].forEach((t, i) => out.push(label(notesX, y + mm(6) + i * mm(4), t, mm(2.6), i < 4 ? SOOT : T70)));

mkdirSync(OUT, { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(W)} ${num(H)}" width="${num(W)}" height="${num(H)}" font-family="${SANS}">
<rect x="0" y="0" width="${num(W)}" height="${num(H)}" fill="${TALLOW}"/>
${out.join('\n')}
<text x="${num(W - mm(8))}" y="${num(H - mm(6))}" font-size="${num(mm(2.4))}" text-anchor="end" fill="${T40}">game1 · ledger proof · not a component</text>
</svg>
`;
writeFileSync(join(OUT, 'digits.svg'), svg, 'utf8');
console.log(
  `wrote docs/ledger/proof/digits.svg — figure ${num(DIGIT_W / U)}x${num(DIGIT_H / U)}mm, ` +
  `segment ${num(SEG_T / U)}mm thick with a ${num(SEG_T / U - L.digit.outlineStrokeMm)}mm core, ` +
  `mitre gap ${num(SEG_G / U)}mm. Git-ignored: a proof is a photograph, never the artefact.`
);
