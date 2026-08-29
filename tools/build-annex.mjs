#!/usr/bin/env node
/**
 * Generates docs/design/14-annex.md — the printed rulebook's reference tables —
 * from data/*.json.
 *
 * The annex used to be the part of the rulebook most likely to lie: long lists
 * transcribed by hand from the data, one rename away from being wrong. So it is
 * generated, like docs/data/bundle.js, and committed: edit the data, run this,
 * commit both. Everything here is a TABLE on purpose — the annex is the part of
 * the book you scan with a finger, not the part you read.
 *
 * Usage: node tools/build-annex.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as buildFlows, readGameData } from './lib/flows.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const OUT = join(ROOT, 'docs', 'design', '14-annex.md');
const checkOnly = process.argv.includes('--check');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const terrain = read('terrain.json');
const travel = read('travel.json');
const discovery = read('discovery.json');
const commodities = read('commodities.json');
const tools = read('tools.json');
const buildings = read('buildings.json');
const rules = read('rules.json');
const peoples = read('peoples.json');
const items = read('items.json');
const events = read('events.json');
const transport = read('transport.json');
const monsters = read('monsters.json');
const vehicles = read('vehicles.json');
const characters = read('characters.json');
const quests = read('quests.json');
const arcana = read('arcana.json');
const modifications = read('modifications.json');
const pricing = read('pricing.json');
const ledger = read('ledger.json');

const lines = [];
const say = (s = '') => lines.push(s);

/** One markdown table. Cells are stringified and pipes escaped. */
function table(headers, rows) {
  const cell = (v) => String(v ?? '—').replace(/\|/g, '\\|');
  say(`| ${headers.map(cell).join(' | ')} |`);
  say(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) say(`| ${row.map(cell).join(' | ')} |`);
  say();
}

const list = (arr) => (arr && arr.length ? arr.join(', ') : '—');

/**
 * An element, with its mark.
 *
 * The mark comes from docs/art/icons/, which tools/build-icons.mjs draws from
 * the same data/arcana.json this file is reading - so a table in the printed
 * annex says fire with the mark a card says it with. The path is relative to
 * docs/design/, which is also where docs/book/ sits, so it resolves in the
 * rendered book, on GitHub, and in a plain markdown reader alike.
 */
const elementMark = (id) => `![](../art/icons/element-${id}.svg)`;
/* The same bargain for the four kind-of-good marks: one set of paths in
   data/pricing.json, drawn once by tools/build-icons.mjs, and the annex says
   "perishable" with the fish skeleton that is engraved in the corner of the
   token. The icon is named for the MODEL and not for the mark, which is what
   leaves every reference standing when a mark is redrawn. */
const pricingMark = (id) => `![](../art/icons/pricing-${id}.svg)`;
const priceModel = (id) => {
  const m = pricing.models.find((x) => x.id === id);
  return m ? `${pricingMark(m.id)} ${m.name}` : '—';
};
const element = (id) => `${elementMark(id)} ${id}`;
const io = (arr) => (arr && arr.length ? arr.map((i) => `${i.qty} ${i.commodity}`).join(' + ') : '—');

/*
 * The market's arithmetic, in one place, because four sections downstream read
 * it: the price table, the four worked scenarios, the commodities table and the
 * ledger note. THE ROUNDING IS THE LEDGER'S OWN - tools/build-ledger.mjs works a
 * price out with exactly this line, and an annex that disagreed with the sheet
 * the price is written on would be worse than no table at all.
 */
const BANDS = rules.market.priceBands;
const priceRow = (c) => BANDS.map((b) => Math.max(1, Math.round(c.baseValue * b)));
const clampTo = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const signOf = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
const coin = (n) => `${n.toFixed(2)}${rules.currency.symbol}`;
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
/* Small counts are spelled out, because the annex is prose wherever it is not a
   table and "There are 5 kinds of die" is not a sentence anybody wrote. */
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty'];
const word = (n) => WORDS[n] ?? String(n);
const Word = (n) => { const w = word(n); return w[0].toUpperCase() + w.slice(1); };
const an = (s) => (/^[aeiou]/i.test(s) ? 'an' : 'a');
const upper1 = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const lower1 = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);
/** A data sentence with its first sentence taken off - used where the field's
    opening restates a number this file has just printed from the same field. */
const rest = (s) => s.replace(/^[^.]*\.\s*/, '');

/** What a model puts into the sum, added up out of its own typed fields. */
const addsOf = (m) => {
  if (m.modifier === 0) return '**nothing**';
  if (m.reads === 'pricing.depletion') {
    return `the lowest number still visible on its own depletion grid, **0 to ${signOf(pricing.depletion.top)}**`;
  }
  if (m.reads === 'pricing.sought') {
    return `the move it made **last** round, **${signOf(pricing.sought.from)} to ${signOf(pricing.sought.to)}**, ` +
      `read off ${pricing.sought.reads.split(' - ')[0]}`;
  }
  return '—';
};
/** And what it does to you instead, for the two that do something instead. */
const alsoOf = (m) => {
  if (m.spoils) {
    return `The ochre spoil die, ${lower1(pricing.spoil.when).replace(/\.$/, '')}, ` +
      'against every stack of it a player is still holding.';
  }
  if (m.tokensOnUse) {
    return `${pricing.depletion.onUse} Trading does none of it: ${lower1(rest(pricing.depletion.onTrade))}`;
  }
  return '—';
};
/** The modifier a line adds this round, off whatever that model reads. */
const modifierOf = (model, pips, lastStep) => {
  if (model.modifier === 0) return 0;
  if (model.reads === 'pricing.depletion') {
    const d = pricing.depletion;
    return Math.min(d.top, Math.floor(pips / d.per) * d.step);
  }
  if (model.reads === 'pricing.sought') {
    return clampTo(lastStep, pricing.sought.from, pricing.sought.to);
  }
  return 0;
};

say('# 14 — Annex: the reference tables');
say();
say('> **Generated by `tools/build-annex.mjs` — do not edit by hand.** Edit the data');
say('> in `data/*.json`, run the tool, and commit both. Every number here is the same');
say('> number the explorer and the simulator read.');
say();

/* ---------------------------------------------------------------- the web */
/* The one picture in the annex: the dependency graph, drawn by
   tools/build-graph.mjs from the same cross-file references the validator
   checks. Referenced by path, so a rebuilt graph reaches the book with no
   edit here - same bargain as the element marks below. */
say('## The web of things');
say();
say('Before the tables, the shape of them: every thing in the game and every');
say('arrow between them, computed from the same cross-file references');
say('`tools/validate-data.mjs` checks — so this picture cannot know a tie the');
say('validator does not enforce. An arrow points from the thing whose data');
say('names the other, at the thing it names: a job points at the ore it takes');
say('in, the iron it puts out and the smelter it runs in alike. The explorer’s');
say('**Graph** tab is this same drawing, live — pan it, drag it, click any dot');
say('for its entry.');
say();
say('![The dependency graph: every thing in the game, and every reference between them](../art/graph/dependencies.svg)');
say();

/* ---------------------------------------------------------------- the flows */
/* One small diagram per place of work, from tools/build-flows.mjs. The list
   of diagrams comes from the same model that draws them - so the annex can
   never print a flow the tool did not draw, or miss one it did. */
say('## The flows of work');
say();
say('The web above, taken apart: one diagram per place of work, with everything');
say('unrelated removed. Read each row left to right — what goes **in** on the');
say('left, with a note under each thing saying where it comes from; the **job**');
say('in the middle with its hours, its tool and who works it; what comes **out**');
say('on the right. To get what you want, find the thing on the right of some row');
say('and walk left, diagram to diagram, until every input is something you can');
say('gather. The explorer’s **Flows** tab is these same diagrams, live, with');
say('every box clickable.');
say();
for (const d of buildFlows(readGameData()).diagrams) {
  say(`![${d.title} — what goes in and what comes out](../art/flows/${d.id}.svg)`);
  say();
}

/* ------------------------------------------------------------------ terrain */
say('## Terrain');
say();
say('The letter code is printed in the bottom corner of every hex on every map.');
say('It is the ruling when the artwork straddles a grid line, and it keys the');
say('travel and discovery tables below.');
say();
table(
  ['Code', 'Terrain', 'Move', 'Road ×', 'Rail ×', 'Features', 'Deposits'],
  terrain.terrains.map((t) => [
    `**${t.code}**`, t.name, t.moveCost === 99 ? 'boat' : t.moveCost,
    t.roadCostMultiplier || '—', t.railCostMultiplier || '—',
    list(t.features), list(t.deposits),
  ])
);

/* ------------------------------------------------------------------- travel */
say('## Travel speeds — hexes per day leg');
say();
const codes = travel.terrainCodes;
table(
  ['Mode', ...codes.map((c) => `**${c}**`)],
  travel.speeds.modes.map((m) => [m.name, ...codes.map((c) => m.hexesPerDayLeg[c] || '—')])
);
say('Overrides: ' + travel.speeds.overrides.map((o) =>
  `**${o.name}** — ${Object.entries(o.hexesPerDayLeg).map(([m, v]) => `${m} ${v}`).join(', ')}`).join('; ') + '.');
say();
say('## Night legs');
say();
table(
  ['Light', 'Night speed'],
  [
    ['None', 'No travel at all, even on a road'],
    ['Torch', '1 hex (2 on a road); spends one use'],
    ['Lantern', 'Half day speed, rounded up'],
    ['Owl’s Eye potion', 'As a lantern, for one round'],
  ]
);
say('A night leg triggers a second discovery roll with the monster band widened by 1.');
say('Trains run at night at full speed with a lantern fitted; ships sail at half speed with one rigged.');
say('Caves can only be entered with a lit torch or lantern.');
say();

/* ---------------------------------------------------------------- discovery */
say('## Discovery tables — d20, roll where the leg ends');
say();
say('One roll per movement leg, on the table for the hex you **stopped** in. A road');
say('or rail on the hex overrides its terrain. Persistent results are marked on the');
say('hex with a tile or figure.');
say();
table(
  ['Table', 'Bands'],
  discovery.tables.map((t) => [
    t.name,
    t.entries.map((e) => `${e.roll} ${e.result}`).join(' · '),
  ])
);
say('Monster element weights by table:');
say();
table(
  ['Table', 'Fire', 'Earth', 'Water', 'Air'],
  discovery.tables.map((t) => [
    t.name,
    t.elementWeights?.fire ?? 0, t.elementWeights?.earth ?? 0,
    t.elementWeights?.water ?? 0, t.elementWeights?.air ?? 0,
  ])
);

/* ------------------------------------------------------------------- market */
say('## The market');
say();
say('Every Market phase, one player rolls for every column on the ledger: two **blue** dice');
say('for demand, two **red** for supply, one **green** for volatility, and then whatever the');
say('good’s own nature adds. Find the net on the swing ruler, and step the price that many');
say('places along the row of six printed for that commodity below.');
say();
say('```');
say(pricing.formula.net);
say('```');
say();
say('**The whole sum is addition, and the multiplication is not hiding anywhere.**');
say(pricing.formula.noMultiplication);
say('Nothing is halved and nothing is rounded, because there is nothing left in the line for a');
say('rounding to happen to — and that is what the rebuild was for. The version before this one');
say('multiplied the swing by the green die and folded the modifier in *first*, which is three');
say('chances to slip in a line a table works through once per traded commodity per round. They');
say('got slipped.');
say();
table(
  ['Dice', 'Ink', 'Range', 'What it is', 'What it does'],
  pricing.dice.sets.map((d) => [
    `${d.count} d${d.faces}`, `**${d.colour}**`, `${d.range[0]}–${d.range[1]}`, `**${d.name}**`, d.means,
  ])
);
say('**Blue is what you want and red is what stands in your way** — here, and in a fight. The');
say('same two colours, the same subtraction, the same direction (`rules.json conflict.battle`),');
say('so a player who has rolled one market has already learned how a battle is scored. That is');
say('worth more than either system’s private preference about which colour ought to mean which,');
say('and it is why the two pairs swapped when the sum did.');
say();
say(`There are ${word(pricing.dice.sets.length + 1)} kinds of die and one ink apiece. The ${word(arcana.manaDie.count)} ${arcana.manaDie.colour} **${arcana.manaDie.name}**`);
say(`die (\`arcana.json manaDie\`) is the ${ORDINAL[pricing.dice.sets.length]}, and it is not a market die at all — it is what a`);
say(`dead monster gives up. ${arcana.manaDie.rule} It is named here because the palette is the`);
say(`interface: ${word(pricing.dice.sets.length + 1)} inks, ${word(pricing.dice.sets.length + 1)} kinds of die, and no sixth ink left to make a seventh out of,`);
say('which is a constraint worth having rather than a shortage.');
say();
say(pricing.dice.note);
say();
say('### Volatility — the green die');
say();
say('It was called **elasticity** and it **multiplied** — ×1, ×2, ÷2 — and neither the name nor');
say('the multiplication survived. Elasticity is a word for how much a quantity answers a price,');
say('which is not what this die was ever doing: it is a weather roll on a market, and volatility');
say('is the word for that. Three cells, two faces each, and it adds.');
say();
table(
  ['Green die', 'Season', 'Adds', 'What it means'],
  pricing.volatility.steps.map((v) => [
    `**${v.faces[0]}–${v.faces[v.faces.length - 1]}**`, `**${v.name}**`, `**${v.label}**`, v.means,
  ])
);
say(pricing.volatility.$addNote);
say();
say('### The swing ruler');
say();
table(
  ['Net', ...pricing.ruler.bins.map((b) => `**${b.label}**`)],
  [
    ['Places', ...pricing.ruler.bins.map((b) => (b.move === 0 ? 'hold' : signOf(b.move)))],
    ['', ...pricing.ruler.bins.map((b) => b.name.toLowerCase())],
  ]
);
const VOL_ADDS = pricing.volatility.steps.map((v) => v.add);
say('**The bins were re-cut when the multiplier went, and they had to be.** Two blue dice');
say(`against two red is a triangular spread peaking at nothing (${signOf(pricing.ruler.reach.swing[0])} to ${signOf(pricing.ruler.reach.swing[1])}); the green die`);
say(`widens it by ${word(Math.max(...VOL_ADDS))} either way; so the whole net runs ${signOf(pricing.ruler.reach.swing[0] + Math.min(...VOL_ADDS))} to ${signOf(pricing.ruler.reach.swing[1] + Math.max(...VOL_ADDS))} before any`);
say('modifier, where the old multiplied one reached 26. Left where they were, the old bins on');
say('the new net would have moved three places in no round of any game ever played, because the');
say('dice could no longer reach the cell.');
say();
say(`Cut where they are now, over all 7776 rolls of the five dice with no modifier, the market **holds in ${pct(pricing.ruler.odds.hold)}`);
say(`of rounds, moves one place in ${pct(pricing.ruler.odds.oneBand)}, two in ${pct(pricing.ruler.odds.twoBands)} and three in ${pct(pricing.ruler.odds.threeBands)}** — so it moves in about`);
say('seven rounds in ten, two places is a genuinely one-sided market rather than a weekly event,');
say('and three only happens when the dice and the good’s own nature are pulling together. Those');
say('figures are worked out from the bins rather than claimed, and `validate-data.mjs` separately');
say('refuses to let the ruler have a hole in it — every value the dice and the modifiers can');
say(`actually reach has to land in a cell. ${pricing.ruler.reach.note}`);
say();
say('A price at the top of its row that is told to go up stays where it is, and the same at the');
say(`foot. ${rest(pricing.formula.clamp)}`);
say();
say(pricing.stockCap.means);
say();
say('### What kind of good it is');
say();
say('This section was called *what a market remembers*, and the title had to go, because nothing');
say('remembers anything now. **There is no memory strip and there is no tally.** Every line on');
say('the old market board carried both — a modifier from −3 to +3 walked by a bar, and beside it');
say('a count of the board’s own stock that filled every few tokens traded, emptied, and stepped');
say('the modifier one cell in whatever direction the commodity’s model said.');
say();
say('**What that machinery bought was real, and it is worth saying before it is thrown away.** It');
say('gave a market a history instead of a mood, it was legible across a table, and it put the');
say('consequence of trading in the same gesture as the trade. **What it cost** was three pieces');
say('to walk per line per round, a board that had to be re-laid every time a model wanted a');
say('different range, and a modifier that went in *before* the multiplication — so a market’s');
say('history counted double in a volatile season, for no reason anybody could defend.');
say();
say(`Every commodity in the game is exactly one of **${word(pricing.models.length)} kinds of good**, and the kind is engraved in`);
say('the corner of that commodity’s own token, so the piece you stand in a ledger column tells');
const SILENT = pricing.models.filter((m) => m.modifier === 0).length;
say(`you how that column behaves. ${Word(SILENT)} of the ${word(pricing.models.length)} add nothing to the sum at all. The other`);
say(`${word(pricing.models.length - SILENT)} read their number off something already on the table for another reason — the`);
say('depletion grid the pips were going on anyway, and the move box that was being written');
say('anyway. That is what let the board stop tracking anything.');
say();
table(
  ['Mark', 'Kind', 'Adds to the swing', 'What it does instead', 'Goods'],
  pricing.models.map((m) => [
    pricingMark(m.id), `**${m.name}**`, addsOf(m), alsoOf(m),
    commodities.commodities.filter((c) => c.pricing === m.id).length,
  ])
);
for (const m of pricing.models) {
  say(`**${pricingMark(m.id)} ${m.name} — “${m.line}”** ${m.assigns}`);
  say();
  for (const para of m.history.split('\n\n')) { say(para); say(); }
  say(`*The mark: **${m.mark.id.replace(/-/g, ' ')}**.* ${m.mark.$note}`);
  say();
  /* The one strip or grid each model needs beyond its own prose - printed here
     because the strip is on the market board and the player holding the fish is
     not. A staple gets nothing, which is the point of a staple. */
  if (m.spoils) {
    table(
      ['Ochre die', 'Keeps well', 'Keeps poorly', 'What it is'],
      pricing.spoil.steps.map((s) => [
        `**${s.faces[0]}–${s.faces[s.faces.length - 1]}**`, s.keepsWell, s.keepsPoorly, s.means,
      ])
    );
    say(`A commodity whose \`perishRounds\` is under ${pricing.spoil.keepsThreshold} keeps **poorly** and reads the right-hand`);
    say('column; everything else reads the left, and that is the whole of the difference');
    say(`\`perishRounds\` makes now. ${pricing.spoil.cap} ${pricing.spoil.granary}`);
    say();
    say(`**It never touches a price.** ${pricing.spoil.price.replace(/^None\. /, '')}`);
    say();
  }
  if (m.tokensOnUse) {
    const d = pricing.depletion;
    const rungs = [];
    for (let n = 0; n <= d.top; n += d.step) {
      const from = (n / d.step) * d.per;
      rungs.push([n === d.top ? `${from}+` : `${from}–${from + d.per - 1}`, signOf(n)]);
    }
    table(['Units burnt', ...rungs.map((r) => `**${r[0]}**`)], [['The grid reads', ...rungs.map((r) => r[1])]]);
    say(`${Word(d.top / d.step + 1)} rows of ${word(d.per)} cells, nought at the top and ${word(d.top)} at the bottom, ${(d.top / d.step + 1) * d.per} cells in all.`);
    say('Cover from the lowest row up, and the modifier is **the lowest number you can still see**.');
    say('Nothing is written down and nothing is counted — you look at the grid and read the');
    say('smallest number left on it, and a fresh grid reads nought.');
    say();
    say(d.$capNote);
    say();
  }
  if (m.reads === 'pricing.sought') {
    say(`${pricing.sought.$startNote} ${pricing.sought.$feedbackNote}`);
    say();
  }
}

/* ------------------------------------------------------------ every price */
/*
 * The table the ledger stands on, and the reason it is here rather than nowhere:
 * data/ledger.json and rules.json market.$bandNote both promise, in as many
 * words, that it exists. The sheet has no band strip and no token BECAUSE the
 * six prices are printed out here, so a move is a step along a row somebody can
 * read. Delete this section and the ledger is a page of empty boxes with no
 * lawful way to fill one in.
 */
const DEAREST = Math.max(...commodities.commodities.flatMap((c) => priceRow(c)));
say('### Every price in the game');
say();
say('**A price move is a step along one of these rows.** The price you last wrote in a ledger');
say('column is one of the six figures in that commodity’s row; the swing ruler says how many');
say('places to step; the figure you land on is the new price. There is no band index to');
say('remember, no token to walk and nothing to multiply — which is exactly what let the price');
say('ladder come off the market board with nothing replacing it (`rules.json market.$bandNote`,');
say('`data/ledger.json`).');
say();
say(`That is ${commodities.commodities.length} commodities by ${BANDS.length} bands — ${commodities.commodities.length * BANDS.length} multiplications, all of them the same ones every`);
say('game, and every one of them formerly done at a table, because a token standing on a cell');
say('tells you a band index and not a price. They are done here instead, once, at the press, by');
say(`a tool that cannot get one wrong. The dearest figure below is **${DEAREST}**, which is why the ledger`);
say(`prints ${word(ledger.digits.count)} hollow figures per cell and not four.`);
say();
table(
  ['Commodity', 'Kind', ...BANDS.map((b) => `×${Number.isInteger(b) ? b.toFixed(1) : b}`)],
  commodities.commodities.map((c) => {
    const model = pricing.models.find((m) => m.id === c.pricing);
    return [c.name, model ? model.name : c.pricing, ...priceRow(c)];
  })
);
say(`Every column starts on the **${ORDINAL[rules.market.startingBandIndex]}** figure of its row. Buying from the board costs the`);
say(`spread on top and selling to it takes the spread off — ${Math.round(rules.market.buySpread * 100)}% either way, and it is the house`);
say('cut for trading with a board rather than with another player, not part of the price.');
say();

/* ------------------------------------------------------------ worked markets */
/*
 * Four markets played out, one per kind of good. The DICE are chosen - a worked
 * example shows the interesting case, not a random one - and every number
 * downstream of them is computed from data/pricing.json and data/rules.json, so
 * this section cannot quietly stop being true when a ruler bin moves or a base
 * value changes. That is the same bargain the rest of the annex makes; it is
 * just doing arithmetic rather than transcribing.
 */
const WORKED = [
  {
    title: 'A good harvest',
    commodity: 'grain',
    blurb: 'Bram has a farm and a surplus, and sells it into his own town three rounds running.',
    rounds: [
      { note: 'His first surplus, into a town that already has plenty.', sell: 3, blue: [4, 3], red: [5, 6], green: 3 },
      { note: 'A thin market — and he sells into it anyway.', sell: 3, blue: [6, 5], red: [3, 2], green: 4 },
      { note: 'And again, four sacks this time.', sell: 4, blue: [3, 3], red: [4, 4], green: 2 },
      { note: 'Nobody trades a sack all round.', blue: [5, 4], red: [4, 3], green: 5 },
      { note: 'A famine year.', blue: [6, 6], red: [2, 1], green: 5 },
    ],
    closes: (s) =>
      `Ten sacks sold into one town, and not one of them moved the row a place. That is the ` +
      `staple bargain stated plainly: a price is the crowd wanting it against the amount that ` +
      `turned up, and one farmer with a cart is neither of those things. Under the memory strip ` +
      `those ten sacks would have filled a tally twice over and bent the price down under him — ` +
      `which punished the town for what the farmer did, and is the job the fish skeleton took ` +
      `over and now does to the person actually holding the stock.`,
  },
  {
    title: 'The catch',
    commodity: 'fish',
    blurb: 'Nella lands fish at a coast village and cannot shift it fast enough.',
    rounds: [
      { note: 'A good first haul.', lands: 5, sell: 2, ochre: 4, blue: [5, 6], red: [2, 3], green: 3 },
      { note: 'Four more out of the water, three away.', lands: 4, sell: 3, ochre: 2, blue: [3, 4], red: [5, 5], green: 5 },
      { note: 'The last crate goes, and there is nothing left to roll against.', sell: 1, blue: [2, 3], red: [6, 4], green: 2 },
      { note: 'Six crates, and no market day to sell them into.', lands: 6, ochre: 6, blue: [4, 4], red: [4, 3], green: 4 },
      { note: 'What survived, sold.', sell: 3, blue: [5, 5], red: [3, 3], green: 3 },
    ],
    closes: (s) =>
      `${Word(s.tot.landed)} crates out of the water, ${word(s.tot.sold)} sold and **${word(s.tot.lost)} thrown away** — and the price did ` +
      `exactly what the blue and red dice said in all five rounds, because a perishable adds ` +
      `nothing whatever to the swing. Everything that happened to Nella happened at the end of a ` +
      `round, in her own hands. That is the trade the spoil die made: glut moved the price ` +
      `everybody traded at, which left the player with a hold full of fish no worse off than the ` +
      `player with none, and slightly better informed. The die is aimed at the person holding the ` +
      `stuff, on the round they failed to shift it, and it needs one die and no strip on any board.`,
  },
  {
    title: 'The seam runs out',
    commodity: 'coal',
    blurb: 'A smelting town, its furnaces, and one merchant who thinks she is working the market.',
    rounds: [
      { note: 'The town lights its furnaces.', burnt: 3, blue: [4, 4], red: [5, 3], green: 3 },
      { note: 'Ilsa sells twelve loads to the board. Watch what it does to the price.', sell: 12, burnt: 3, blue: [3, 4], red: [4, 5], green: 4 },
      { note: 'A busy week at the smelter, and a roll that says nothing at all.', burnt: 4, blue: [4, 3], red: [4, 3], green: 3 },
      { note: 'A bad roll — and look what it does not do.', burnt: 3, blue: [3, 2], red: [5, 4], green: 2 },
      { note: 'Everything they have, into the furnace.', burnt: 5, blue: [4, 5], red: [4, 4], green: 4 },
    ],
    closes: (s) =>
      `${Word(s.tot.burnt)} loads burnt, the grid reading **${signOf(modifierOf(s.model, s.pips, 0))}**, and it will never read less again — the ` +
      `third round is the one to look at, where a roll that came to nothing put the price up a ` +
      `place on the strength of the grid alone. Ilsa’s twelve loads in round two did nothing at ` +
      `all, and that is the model rather than an oversight: selling coal to a town moves coal, ` +
      `burning it destroys coal, and only the burning is what a seam notices. A merchant who ` +
      `never lights a fire can trade the same hundred tons all game and the hill will not run dry ` +
      `from the paperwork.`,
  },
  {
    title: 'A run on gold',
    commodity: 'gold',
    blurb: 'Nobody trades a single ingot in five rounds. A sought line does all of this on its own.',
    rounds: [
      { note: 'Gold firms. Nothing has moved yet, so there is nothing to add.', blue: [5, 6], red: [2, 3], green: 3 },
      { note: 'The run builds, and now it is adding its own last move.', blue: [4, 5], red: [3, 3], green: 2 },
      { note: 'A roll that says nothing, with a slack season under it.', blue: [3, 4], red: [4, 4], green: 4 },
      { note: 'The turn.', blue: [2, 2], red: [6, 5], green: 2 },
      { note: 'And it runs the other way just as fast.', blue: [3, 3], red: [5, 4], green: 3 },
    ],
    closes: (s) =>
      `Two places up, then one, then a dash; then three down and two. Gold went from ` +
      `${s.row[s.startedOn]}${rules.currency.symbol} an ingot to ${s.row[s.row.length - 1]}${rules.currency.symbol} and finished at ${s.row[s.band]}${rules.currency.symbol}, the foot of its own row, ` +
      `without a single ingot changing hands. The whole memory of that is one pencil figure in ` +
      `the move box of the row above, and the third round is where the machinery shows: the ` +
      `price held, so the box got a dash, and a dash is what round four had to add. Two quiet ` +
      `rounds and a sought good is priced on the dice like anything else.`,
  },
];

/** One scenario, played. Returns the markdown rows and everything the closer needs. */
function play(scene) {
  const c = commodities.commodities.find((x) => x.id === scene.commodity);
  const model = pricing.models.find((m) => m.id === c.pricing);
  const row = priceRow(c);
  let band = rules.market.startingBandIndex;
  let stepped = pricing.sought.start; /* what last round's move box says */
  let pips = 0;
  let held = 0;
  const tot = { landed: 0, sold: 0, lost: 0, burnt: 0 };
  const rows = [];

  for (const [i, r] of scene.rounds.entries()) {
    /* ACTIONS. Trade at the price the ledger is already showing, land what is
       landed, burn what is burnt. A depletion pip goes on in THIS phase, in the
       hand of whoever burnt the fuel, and never in the Market phase. */
    const acts = [];
    if (r.lands) { held += r.lands; tot.landed += r.lands; acts.push(`lands **${r.lands}**`); }
    if (r.sell) {
      const each = row[band] * (1 + rules.market.sellSpread);
      held = Math.max(0, held - r.sell);
      tot.sold += r.sell;
      acts.push(`sells **${r.sell}** at ${coin(each)} = **${coin(each * r.sell)}**`);
    }
    if (r.burnt) { pips += r.burnt; tot.burnt += r.burnt; acts.push(`burns **${r.burnt}**`); }

    /* FEEDING. The ochre die, against what is still in the hands that landed it -
       one phase before the market rolls, because rot happens to food and not to
       a market. */
    let spoilCell = '—';
    if (model.spoils) {
      if (held > 0 && r.ochre) {
        const s = pricing.spoil.steps.find((x) => x.faces.includes(r.ochre));
        const keeps = c.perishRounds < pricing.spoil.keepsThreshold ? 'keepsPoorly' : 'keepsWell';
        const gone = Math.min(held, s[keeps]);
        held -= gone;
        tot.lost += gone;
        spoilCell = `ochre **${r.ochre}** — ${gone} gone, ${held} left`;
      } else {
        spoilCell = held > 0 ? '—' : 'nothing held';
      }
    }

    /* MARKET. Roll, add the modifier, read the ruler, step along the row. */
    const D = r.blue[0] + r.blue[1];
    const S = r.red[0] + r.red[1];
    const vol = pricing.volatility.steps.find((v) => v.faces.includes(r.green));
    const mod = modifierOf(model, pips, stepped);
    const net = D - S + vol.add + mod;
    const bin = pricing.ruler.bins.find((b) => net >= b.from && net <= b.to);
    const was = band;
    band = clampTo(band + bin.move, 0, row.length - 1);
    stepped = band - was;

    rows.push([
      i + 1,
      [r.note, upper1(acts.join(' · '))].filter(Boolean).join(' '),
      `${D} − ${S}`,
      `${r.green} · ${vol.label}`,
      signOf(mod),
      signOf(net),
      `${bin.name.toLowerCase()} ${stepped === 0 ? '—' : signOf(stepped)}` +
        (stepped === bin.move ? '' : ` *(${band === 0 ? 'the foot' : 'the top'} of the row)*`),
      `**${row[band]}${rules.currency.symbol}**`,
      ...(model.spoils ? [spoilCell] : []),
      ...(model.tokensOnUse ? [String(pips)] : []),
    ]);
  }
  return { c, model, row, band, pips, held, tot, rows, startedOn: rules.market.startingBandIndex };
}

say('## Four markets, played');
say();
say('One scenario per kind of good, with the dice chosen to show what each one does — a worked');
say('example shows the interesting case, not a random one. Everything after the dice is computed');
say('from the tables above rather than transcribed, so these cannot drift out of true.');
say();
say('Read a row left to right and it is the round in the order it happens. Trading is an action');
say('like any other and happens in the **Actions** phase, at the price the ledger is already');
say('showing; the ochre die is rolled one phase later, at the end of **Feeding**; and the');
say('**Market** phase then fixes the price everybody will trade at next round. You act on a');
say('known price and find out afterwards what your acting did to it, which is the only honest');
say('way round for a market to work. Sales to the board are at the ledger price less the house');
say('cut, so a figure in that column is not the printed price and is not meant to be.');
say();
say(`**Mod** is what the good’s own nature adds, and ${word(SILENT)} of the ${word(pricing.models.length)} never leave nought.`);
say('**Net** is the whole sum. **The ruler** is the cell the net lands in, and after it the');
say('figure that goes in the ledger’s move box — a dash when the price held, and the step the');
say('price *actually took* rather than the one the ruler called for, on the rounds where it is');
say('already standing at an end of its own row. **End of Feeding** and **Pips** are the two');
say('columns that are not about the price at all: what the ochre die took, and how many units');
say('have been burnt so far.');
say();

for (const scene of WORKED) {
  const s = play(scene);
  say(`### ${scene.title} — ${s.c.name} · ${priceModel(s.model.id)}`);
  say();
  say(`${scene.blurb} Base value ${s.c.baseValue}${rules.currency.symbol}, so the row is **${s.row.join(' · ')}**, and`);
  say(`every column starts on the ${ORDINAL[rules.market.startingBandIndex]} figure of it — ${s.row[rules.market.startingBandIndex]}${rules.currency.symbol} ${an(s.c.unit)} ${s.c.unit}.`);
  say();
  table(
    ['#', 'In the round', 'D − S', 'Green', 'Mod', 'Net', 'The ruler', 'Price',
      ...(s.model.spoils ? ['End of Feeding'] : []),
      ...(s.model.tokensOnUse ? ['Pips'] : [])],
    s.rows
  );
  say(`**After ${word(scene.rounds.length)} rounds — ${s.c.name} at ${s.row[s.band]}${rules.currency.symbol} ${an(s.c.unit)} ${s.c.unit}.** ${scene.closes(s)}`);
  say();
}

/* -------------------------------------------------------------- commodities */
say('## Commodities');
say();
say('**Value** is the base value the row of six above is worked out from, not a price anybody');
say('ever pays: what a town pays is the un-struck figure in that commodity’s ledger column.');
say('**Keeps** is the column of the spoil strip a stack of it reads at the end of a round, and');
say('only a perishable has one.');
say();
table(
  ['Commodity', 'Category', 'Bulk', 'Value', 'Prices by', 'Keeps', 'Tags'],
  commodities.commodities.map((c) => {
    const model = pricing.models.find((m) => m.id === c.pricing);
    const keeps = model?.spoils
      ? (c.perishRounds < pricing.spoil.keepsThreshold ? '**poorly**' : 'well')
      : '—';
    return [c.name, c.category, c.bulk, c.baseValue, priceModel(c.pricing), keeps, list(c.tags)];
  })
);

/* --------------------------------------------------------------------- wear */
/*
 * Wear is one system now and it spans two decks, so it gets a section of its
 * own rather than a footnote under whichever table happens to print a W first.
 * Every number in it is a dial in rules.json wear.
 */
say('## Wear');
say();
say('**Everything a figure carries wears out**, and until recently only tools did. A sword was');
say('immortal, a suit of plate never dented, a rope never frayed and a lantern burned forever —');
say('so the only equipment decision anybody made twice was which axe to buy. One rule, one unit,');
say(`one scale: ${word(rules.wear.perUse)} ${rules.wear.unit} per use, for a tool, a weapon, a coat and a coil of rope alike.`);
say();
say('It is printed once, as the **W** box in the summary strip on the thing’s own card: the most');
say('wear it will take, and like every number on a card it does not move, because the board took');
say(`the walking over. It is walked on ${lower1(rules.wear.track)}`);
say();
say('**The scale is the board’s.**');
say('Wear used to run past thirty and be counted on the tool itself, because there was no track');
say('for it; there are four now, one beside each kit slot, so the number came down to meet the');
say('board rather than the board going up to meet the number. **Nothing got shorter doing it,**');
say('because the clock changed with the scale: an axe had twenty-four wear at one a labour hour,');
say('which is eight three-hour jobs, and has ten at one a job, which is ten. A tool lasts');
say('slightly longer than it did and nobody adds hours up any more.');
say();
table(
  ['Wears', 'What counts as a use', 'Why'],
  rules.wear.takes.map((t) => [t.applies, t.when, t.$note])
);
say(`**At 0.** ${rules.wear.atZero}`);
say();
say(`**Repair.** ${Word(rules.wear.repair.wearPerRound)} points a round at any settlement with a ${rules.wear.repair.requires}, ${word(rules.wear.repair.coinPerPoint)} coin a point`);
say(`and ${word(rules.wear.repair.effortHours)} hours of somebody’s labour. ${rest(rules.wear.repair.$note)}`);
say();
say('**What never wears:**');
say();
for (const n of rules.wear.neverWears) say(`- ${n}`);
say();

/* -------------------------------------------------------------------- tools */
say('## Tools');
say();
say('**W** is the most wear the tool will take, printed as the W box on its card and walked down');
say(`the W track beside its own kit slot. One point per **job**, never per hour: ${lower1(rest(rules.wear.takes.find((t) => t.id === 'job')?.$note ?? ''))}`);
say();
table(
  ['Tool', 'Made at', 'Craft', 'Hours', 'Value', 'W'],
  tools.tools.map((t) => [
    t.name, t.madeAt, io(t.craft?.inputs), t.craft?.effortHours, t.baseValue,
    t.baseWear + (t.optional ? ' (optional)' : ''),
  ])
);
say(rules.tools.$sizesNote);
say();

/* ---------------------------------------------------------------- buildings */
say('## Buildings');
say();
table(
  ['Building', 'Category', 'Tier', 'Cost', 'Points', 'Terrain'],
  buildings.buildings.map((b) => [
    b.name, b.category, b.tier, io(b.cost), b.buildPoints, list(b.terrain),
  ])
);

/* ------------------------------------------------------------------ peoples */
say('## Peoples');
say();
table(
  ['People', 'Die', 'Workers', 'Terrain comfort', 'Strength', 'Carries', 'Mana'],
  peoples.peoples.map((p) => [
    p.name, p.effortDie, p.startingWorkers, list(p.terrainComfort),
    p.strength?.base,
    `${(p.strength?.base ?? 0) * rules.carrying.kgPerStrength} kg`,
    p.manaStorage?.innate ? `${p.manaStorage.innate} innate` : 'talisman only',
  ])
);
say();
say('Carrying is not a separate number and has not been since strength swallowed');
say(`burden: a figure lifts strength × ${rules.carrying.kgPerStrength} ${rules.carrying.unit}, and the column above is that`);
say('sum rather than a value anybody chose.');
say();
say('**There is no defence column, here or anywhere else.** It was the half of the old strength');
say('that made a strong thing hard to hurt, which was a good fix for a to-hit roll and has');
say('nothing to do in an opposed total: what a people brings to a fight is its strength, and');
say('what is between it and the blow is the armour it is wearing.');
say();
say('### Traits');
say();
table(
  ['People', 'Trait', 'Effect'],
  peoples.peoples.flatMap((p) => p.traits.map((t) => [p.name, t.name, t.effect]))
);
say('### Professions');
say();
table(
  ['Profession', 'Trained at', 'Coin', 'Hours', 'Bonus'],
  peoples.professions.map((p) => [
    p.name, p.building, p.trainCost?.coin, p.trainCost?.effortHours, p.bonus,
  ])
);

/* -------------------------------------------------------------------- items */
say('## Items');
say();
say('Mass is what the thing weighs. It counts against what the carrier can lift —');
say(`strength × ${rules.carrying.kgPerStrength} ${rules.carrying.unit}, printed on every character card — and it is not`);
say('bulk: bulk is a commodity\'s storage and shipping cost, and no item has one.');
say();
say(`No figure in the game shoulders more than ${Math.max(...peoples.peoples.map((p) => (p.strength?.base ?? 0) * rules.carrying.kgPerStrength), ...characters.characters.map((c) => c.strength * rules.carrying.kgPerStrength))} ${rules.carrying.unit} unaided, and`);
say('nothing walks a token for it: a load either fits under the printed limit or');
say(`it does not. **Coin counts too** — ${rules.currency.massKgEach * 1000} grams a coin, ${rules.carrying.coin.perKg} to the kilogram — which is what`);
say('turns a hold of jewellery sold into a question about how the money gets home.');
say();
say('**W** is the most wear the thing will take, on the one scale described under **Wear**');
say('above. A potion has none, because it is drunk rather than worn out, and a talisman has');
say('none, because mana is not friction. **Battle** and **Armour** are both straight additions');
say('to one opposed total, and they were `combatDice` and `armourValue` — dice granted and hits');
say('cancelled — which were two different currencies for the same job in a system that no longer');
say('counts a hit at all.');
say();
for (const cls of items.classes) {
  const rows = items.items.filter((i) => i.class === cls.id);
  if (!rows.length) continue;
  say(`### ${cls.name}`);
  say();
  say(cls.summary);
  say();
  /* One extra number per class, and only where the class has one: a weapon's
     battle, a suit's armour, a talisman's capacity. Nothing else in the deck
     carries a number the strip does not already print. */
  const extraHead =
    cls.id === 'weapon' ? ['Battle'] : cls.id === 'armour' ? ['Armour'] : cls.id === 'talisman' ? ['M'] : [];
  const extraOf = (i) =>
    cls.id === 'weapon' ? [i.battle ?? '—'] : cls.id === 'armour' ? [i.armour ?? '—']
      : cls.id === 'talisman' ? [i.manaCapacity ?? '—'] : [];
  table(
    ['Item', 'Made at', 'Inputs', 'Hours', 'Value', 'Mass', 'W', ...extraHead, 'Effects'],
    rows.map((i) => [
      i.name + (i.cardCode ? ` (${i.cardCode})` : ''), i.madeAt, io(i.inputs), i.effortHours, i.baseValue,
      `${i.massKg} kg`,
      i.wear ?? '—',
      ...extraOf(i),
      (i.effects || []).join(' '),
    ])
  );
}

/* ---------------------------------------------------------------- transport */
say('## Transport modes');
say();
table(
  ['Mode', 'Tier', 'Capacity', 'Speed', 'Needs', 'Buy', 'Upkeep', 'Theft risk'],
  transport.modes.map((m) => [
    m.name, m.tier, m.capacity,
    m.speedOnRoad ? `${m.speed} (${m.speedOnRoad} on road)` : m.speed,
    m.requires === 'none' ? '—' : m.requires, m.buyCost || 'free', m.upkeep, '★'.repeat(m.theftRisk || 0) || '—',
  ])
);

/* ----------------------------------------------------------------- vehicles */
say('## Vehicle deck');
say();
say('**H** is the hull, **C** the bulk of its hold — the two boxes of a vehicle');
say('card\'s summary strip. A vehicle in play is dealt a player board of its own and');
say('run like a player who is not a person: the hull walks that board\'s health');
say('track, and the cargo and modifications lie in its four kit slots.');
say();
table(
  ['Code', 'Vehicle', 'Kind', 'Cargo', 'Hull', 'Quirk'],
  vehicles.vehicles.map((v) => [
    v.cardCode, v.name, v.mode, v.cargoCapacity, v.hull, v.quirk,
  ])
);

/* ----------------------------------------------------------------- monsters */
say('## Monster deck');
say();
say('The five boxes of the summary strip across the top of every monster card, in the order');
say('they are printed in, and then the element’s mark in the last box: **H** health, **S**');
say('strength, **A** armour, **P** pace, **Y** the most mana its death is worth. Every one of');
say('them is a number a player can also have, which is what lets a monster be dealt onto a');
say('spare player board and run like a player who is not a person.');
say();
say('S = slay (always allowed), E = enslave, B = befriend, D = domesticate.');
say();
table(
  ['Code', 'Monster', 'H', 'S', 'A', 'P', 'Y', 'Element', 'Ground', 'Options'],
  monsters.monsters.map((m) => [
    m.cardCode, m.name + (m.unique ? ' *(unique)*' : ''),
    m.health, m.strength, m.armour, m.pace, m.manaYield,
    element(m.element),
    list(m.terrains),
    'S' + (m.options.enslave ? ' E' : '') + (m.options.befriend ? ' B' : '') + (m.options.domesticate ? ' D' : ''),
  ])
);
say();
say(`**In a fight:** ${rules.conflict.battle.rule}`);
say();
say('```');
say(rules.conflict.battle.formula);
say('```');
say();
for (const w of rules.conflict.battle.worked) { say(`- ${w}`); }
say();
say(`**Gear.** ${rules.conflict.battle.gear}`);
say();
say(`**A tie.** ${rules.conflict.battle.ties} ${rules.conflict.battle.$simultaneousNote}`);
say();
say(`**A third die.** ${rules.conflict.battle.extraDice}`);
say();
say('**Defence is gone**, off this table and off every other. It was the half of the old');
say('strength that made a hit miss, and armour was the half that cancelled it after it landed —');
say('two numbers saying the same sentence, in a system that no longer counts hits. **A** is the');
say('old defence rescaled: a stone boar barely swings and still turns a sword, which is a low');
say('strength and a high armour, and that is two numbers saying two things.');
say();
say('**Running away is a footrace, and you have to win it.** Fleeing used to be free — withdraw');
say('the way you came, lose your discovery roll, done — which made every monster optional and');
say(`most of them decorative. ${rules.conflict.flee.rule} ${rules.conflict.flee.refused}`);
say(rules.conflict.flee.cargo);
say();
const FASTEST = monsters.monsters.reduce((a, b) => (b.pace > a.pace ? b : a));
say(`Half the bestiary above cannot be outrun on foot at all, and the P column tops out at`);
say(`**${FASTEST.pace}** — the ${FASTEST.name.toLowerCase()}. That is what puts a road, a horse and a night's sleep`);
say('into the same decision as a sword.');
say();
say(`**Slaying yields mana, and the Y box is a ceiling rather than a payment.** ${arcana.manaDie.rule}`);
say(`Rolled once, ${arcana.manaDie.when.replace(/^Once, /, '')} ${arcana.manaDie.split}`);
say();
say(arcana.manaDie.worked);
say();
say('The other three options — enslave, befriend, domesticate — trade the mana away for a');
say('living asset, and none of them pays any.');
say();

/* --------------------------------------------------------------- characters */
say('## Character deck');
say();
say('The five boxes of the summary strip across the top of every character card,');
say('in the order they are printed in — and the same letters the player board');
say('calls its tracks, so setting up is reading across the strip and placing');
say('tokens left to right. The kilograms are derived rather than designed:');
say(`strength × ${rules.carrying.kgPerStrength}, and the purse counts against them like everything else.`);
say();
table(
  ['Code', 'Character', 'People', 'Calling', 'H', 'S', 'M', rules.currency.symbol, 'KG', 'Traits'],
  characters.characters.map((c) => [
    c.cardCode, c.name, c.people, c.calling,
    c.health, c.strength, c.manaCapacity || '—', c.startingGold,
    c.strength * rules.carrying.kgPerStrength,
    (c.traits || []).join(' '),
  ])
);
say('There is no D box. What a character brings to a battle besides strength is the gear in');
say('their four kit slots, and that is a thing they can change.');
say();

/* ------------------------------------------------------------------- quests */
say('## Quest deck');
say();
table(
  ['Code', 'Quest', 'Type', 'Cx', 'Task'],
  quests.quests.map((q) => [
    q.cardCode, q.name, q.type, q.complexity,
    q.task || `${q.stages.length} stages: ${q.stages.map((s) => s.name).join(' → ')}`,
  ])
);

/* ------------------------------------------------------ elements and arcana */
say('## The elements');
say();
say('Four elements, four marks. The mark is data - one path per element in');
say('`data/arcana.json` - so a card, a chit, this table and the explorer all say');
say('fire the same way. `tools/build-icons.mjs` draws them.');
say();
table(
  ['Mark', 'Element', 'Ink', 'At home'],
  arcana.elements.map((e) => [elementMark(e.id), `**${e.name}**`, e.ink, e.summary])
);

say('## Spells');
say();
table(
  ['Code', 'Spell', 'Element', 'Mana', 'Effect'],
  arcana.spells.map((s) => [s.cardCode, s.name, element(s.element), s.cost, s.effect])
);

say('## Enchantments');
say();
say(arcana.enchantments.$comment.split('.')[0] + '.');
say();
table(
  ['Code', 'Enchantment', 'Element', 'Mana', 'Bound to', 'Effect'],
  arcana.enchantments.cards.map((e) => [e.cardCode, e.name, element(e.element), e.cost, e.boundTo, e.effect])
);

/* ----------------------------------------------------------- modifications */
say('## Modification deck');
say();
say('Fittings and enchantments bolted onto a vehicle. They share the vehicle\'s');
say(`slots — ${modifications.slots.base} on most, and at most ${modifications.slots.enchantmentLimit} enchantment whatever the count — so a`);
say('shipwright and a hedge-witch are competing for the same hull.');
say();
table(
  ['Code', 'Modification', 'Class', 'Fits', 'Cost', 'Effect'],
  modifications.modifications.map((m) => [
    m.cardCode, m.name, m.class, list(m.fits),
    m.manaCost ? `${m.manaCost} ${m.element} mana` : io(m.inputs),
    m.effect,
  ])
);

/* -------------------------------------------------------------------- events */
say('## Event deck');
say();
table(
  ['Card', 'Category', 'Scope', 'Copies'],
  events.cards.map((c) => [c.name, c.category, c.scope, c.copies])
);
say(`${events.deck.totalCards} cards. ${events.deck.when}`);
say();

const out = lines.join('\n');
if (checkOnly) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* absent counts as stale */ }
  if (current !== out) {
    console.error('docs/design/14-annex.md is stale. Run: node tools/build-annex.mjs');
    process.exit(1);
  }
  console.log('docs/design/14-annex.md is up to date');
} else {
  writeFileSync(OUT, out, 'utf8');
  console.log(`wrote docs/design/14-annex.md (${(out.length / 1024).toFixed(1)} kB)`);
}
