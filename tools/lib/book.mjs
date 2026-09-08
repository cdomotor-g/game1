/**
 * The printed book's own machinery: the data behind the rules chapters, and the
 * illustrated annexes that are generated rather than written.
 *
 * tools/build-book.mjs is the tool; this is what it reads the game through. Three
 * things live here and nowhere else:
 *
 *   loadData      every dataset the manifest names, plus the maps, read once.
 *   interpolate   the {{ }} tokens a rules chapter uses for its numbers, so the
 *                 book can never print a stale constant - a rules chapter says
 *                 {{rules.wear.perUse}} and the build refuses a path that does
 *                 not resolve.
 *   catalogue     one illustrated entry per thing in the game - a character, a
 *                 monster, a building, a vehicle at half a page; everything else
 *                 at a quarter - grouped into the base game, each campaign and
 *                 each expansion by the `campaign` / `expansion` tag on the
 *                 record. Nothing about an entry is authored here: the strip is
 *                 the card's strip, the recipe is the card's recipe, the jobs are
 *                 the recipes that name the building as their site.
 *
 * Every picture is the plate itself - docs/art/renders/<plate>.png, whole and
 * uncropped, the page the artist drew - never the card window's crop. The card
 * shows a crop because a card is 63 mm wide; the book is where the page is
 * finally looked at.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { cardsOfDeck } from './decks.mjs';
import { plateIdFor } from './plates.mjs';
import { tileSubjects } from './tiles.mjs';

/* ------------------------------------------------------------------- data */

export function loadData(root) {
  const DATA = join(root, 'data');
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'));
  const data = {};
  for (const ds of manifest.datasets) data[ds.key] = JSON.parse(readFileSync(join(DATA, ds.file), 'utf8'));
  const mapsDir = join(DATA, manifest.maps.dir);
  data.maps = readdirSync(mapsDir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => JSON.parse(readFileSync(join(mapsDir, f), 'utf8')));
  return { manifest, data };
}

/* ------------------------------------------------------------ interpolate */

const isFlat = (a) => a.every((v) => v == null || typeof v !== 'object');

/** Walk `a.b[2].c[id=x]` through a dataset. Returns undefined where it fails. */
function walk(root, path) {
  let cur = root;
  const parts = path.match(/\[[^\]]*\]|[^.[\]]+/g) || [];
  for (const raw of parts) {
    if (cur == null) return undefined;
    if (raw.startsWith('[')) {
      const inner = raw.slice(1, -1);
      const m = inner.match(/^(\w+)=(.+)$/);
      if (m) {
        if (!Array.isArray(cur)) return undefined;
        cur = cur.find((x) => x && String(x[m[1]]) === m[2]);
      } else {
        cur = Array.isArray(cur) ? cur[Number(inner)] : undefined;
      }
    } else {
      cur = cur[raw];
    }
  }
  return cur;
}

/**
 * Replace every {{token}} in `text` with its value out of the data.
 *   {{rules.wear.perUse}}          a number or string, or a flat array joined with commas
 *   {{count:monsters.monsters}}    an array's length
 *   {{pct:rules.market.buySpread}} a fraction as a percentage, 0.15 -> 15%
 * Throws, naming `where`, on a path that does not resolve - a rulebook that
 * printed "undefined" where a number should be would be worse than a build that
 * stopped.
 */
export function interpolate(text, data, where = 'text') {
  return text.replace(/\{\{\s*(?:(count|pct):)?([^}]+?)\s*\}\}/g, (_, fn, path) => {
    const [key, ...rest] = path.split('.');
    if (!(key in data)) throw new Error(`${where}: {{${path}}} - "${key}" is not a dataset in data/manifest.json`);
    const v = walk(data[key], rest.join('.'));
    if (v === undefined) throw new Error(`${where}: {{${path}}} does not resolve`);
    if (fn === 'count') {
      if (!Array.isArray(v)) throw new Error(`${where}: {{count:${path}}} is not an array`);
      return String(v.length);
    }
    if (fn === 'pct') {
      if (typeof v !== 'number') throw new Error(`${where}: {{pct:${path}}} is not a number`);
      return `${Math.round(Math.abs(v) * 1000) / 10}%`;
    }
    if (Array.isArray(v)) {
      if (!isFlat(v)) throw new Error(`${where}: {{${path}}} is an array of objects; name a field`);
      return v.join(', ');
    }
    if (v !== null && typeof v === 'object') throw new Error(`${where}: {{${path}}} is an object; name a field`);
    return String(v);
  });
}

/* --------------------------------------------------------------- helpers */

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const orList = (xs) => (xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);
const andList = (xs) => (xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const aOrAn = (name) => `${/^[aeiou]/i.test(name) ? 'an' : 'a'} ${name}`;
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
export const roman = (n) => ROMAN[n] ?? String(n);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
export const word = (n) => WORDS[n] ?? String(n);

/** Inline markup for a data sentence: bold and italic only, everything else escaped. */
export const inline = (s) => esc(s)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

/* ------------------------------------------------------------- catalogue */

/**
 * The game read for the catalogue: every lookup an entry needs, built once.
 * Paths are relative to docs/book/, which sits one level under docs/.
 */
export function openCatalogue(root, { data }) {
  const RENDERS = join(root, 'docs', 'art', 'renders');
  const TILES = join(root, 'docs', 'tiles');
  const palette = JSON.parse(readFileSync(join(root, 'docs/art/palette.json'), 'utf8'));
  const decks = data.components.decks;
  const deckByPrefix = (p) => decks.find((d) => d.prefix === p);
  const hasPlate = (id) => existsSync(join(RENDERS, `${id}.png`));
  const plateSrc = (id) => `../art/renders/${id}.png`;
  const byId = (arr) => new Map(arr.map((x) => [x.id, x]));

  const commodities = byId(data.commodities.commodities);
  const buildings = byId(data.buildings.buildings);
  const items = byId(data.items.items);
  const recipes = data.recipes.recipes;
  const terrains = byId(data.terrain.terrains);
  const deposits = byId(data.deposits.deposits);
  const peoples = byId(data.peoples.peoples);
  const professions = byId(data.peoples.professions);
  const elements = byId(data.arcana.elements);
  const modes = byId(data.transport.modes);
  const campaigns = byId(data.campaigns.campaigns);
  const expansions = byId(data.expansions?.expansions ?? []);
  const tiles = new Map(tileSubjects(root).map((t) => [t.id, t]));
  const rules = data.rules;

  const name = (map, id) => map.get(id)?.name ?? id;
  const bill = (xs) => (xs ?? []).map((i) => `${i.qty} ${name(commodities, i.commodity)}`).join(', ');
  const io = (xs) => (xs && xs.length ? xs.map((i) => `${i.qty} ${name(commodities, i.commodity)}`).join(' + ') : '—');

  /* The jobs a building hosts: every recipe that names it as its site, read the
     way the card builder reads them, so the card and the book cannot disagree. */
  const jobsAt = new Map();
  for (const r of recipes) {
    for (const b of [r.site?.building, r.site?.orBuilding].filter(Boolean)) {
      if (!jobsAt.has(b)) jobsAt.set(b, []);
      jobsAt.get(b).push(r);
    }
  }
  const madeAt = new Map(); /* items, tools and modifications made at a building */
  const note = (b, s) => { if (!madeAt.has(b)) madeAt.set(b, []); madeAt.get(b).push(s); };
  for (const t of data.tools.tools) if (t.madeAt) note(t.madeAt, t.name);
  for (const i of data.items.items) if (i.madeAt) note(i.madeAt, i.name);
  for (const m of data.modifications.modifications) if (m.madeAt) note(m.madeAt, m.name);

  const tint = (ink) => {
    if (ink?.startsWith('soot-tint-')) return palette.ink.tints[ink.slice(10)]?.hex ?? palette.paper.foxing.hex;
    return palette.inks[ink]?.hex ?? palette.paper.foxing.hex;
  };

  /* --- the pieces of an entry ------------------------------------------ */

  const strip = (cells) => `<div class="strip">${cells.map((c) => (c.element
    ? `<span class="cell mark" title="${esc(name(elements, c.element))}"><img src="../art/icons/element-${esc(c.element)}.svg" alt="${esc(c.element)}"></span>`
    : `<span class="cell" style="--tint:${tint(c.tint)}"><b>${esc(c.letter)}</b><i>${esc(c.value)}</i></span>`)).join('')}</div>`;
  const L = data.components.statStrip.letters;

  const mark = (el) => `<img class="elmark" src="../art/icons/element-${esc(el)}.svg" alt="${esc(el)}">`;
  const campaignMark = (id) => (id ? `<img class="cmark" src="../art/icons/campaign-${esc(id)}.svg" alt="${esc(name(campaigns, id))}" title="${esc(name(campaigns, id))}">` : '');

  /** The plate, whole. Or, while it is not yet drawn, the deck's own device in a ruled window. */
  function plate(id, { format = 'portrait', deck = null, element = null, alt = '' } = {}) {
    if (id && hasPlate(id)) {
      return `<figure class="plate ${format}"><img src="${plateSrc(id)}" alt="${esc(alt)}" loading="lazy"></figure>`;
    }
    const motif = deck?.back?.motif ? data.components.back.motifs[deck.back.motif] : null;
    const device = element
      ? `<img src="../art/icons/element-${esc(element)}.svg" alt="">`
      : motif
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="${esc(motif)}"/></svg>`
        : '';
    return `<figure class="plate ${format} undrawn"><div class="device">${device}</div><figcaption>plate not yet drawn</figcaption></figure>`;
  }

  /* `sub` is set in the calligraphic hand - a calling, a title - and `plain` in
     italic, for a sentence: a terrain list, a building's summary. */
  const head = (o) => `<header class="ehead">${o.pre ? `<div class="kicker">${o.pre}</div>` : ''}<h4 class="ename">${o.name}${o.badge ?? ''}</h4>${o.sub ? `<div class="calling">${o.sub}</div>` : ''}${o.plain ? `<div class="calling plain">${o.plain}</div>` : ''}</header>`;
  const facts = (xs) => `<ul class="facts">${xs.filter(Boolean).map((f) => `<li>${f}</li>`).join('')}</ul>`;
  const story = (s) => (s ? `<p class="story">${inline(s)}</p>` : '');
  const code = (c, camp) => `<span class="code">${esc(c)}${campaignMark(camp)}</span>`;

  /* --- one entry per kind ------------------------------------------------ */

  function character(c) {
    const kg = c.strength * rules.carrying.kgPerStrength;
    const kit = (c.startsWith ?? []).map((id) => name(items, id));
    return {
      id: `chr-${c.id}`, size: 'half', layout: 'portrait',
      html: plate(plateIdFor(deckByPrefix('CHR'), c), { format: 'portrait', deck: deckByPrefix('CHR'), alt: c.name })
        + `<div class="text">${head({
          pre: `${code(c.cardCode, c.campaign)} · ${esc(name(peoples, c.people))}`,
          name: esc(c.name), sub: esc(c.calling),
        })}${strip([
          { letter: L.health, value: c.health, tint: 'oxide' }, { letter: L.strength, value: c.strength, tint: 'ochre' },
          { letter: L.mana, value: c.manaCapacity ?? 0, tint: 'bruise' }, { letter: L.gold, value: c.startingGold, tint: 'ochre' },
          { letter: L.carry, value: kg, tint: 'slate' },
        ])}${facts([
          ...(c.traits ?? []).map(inline),
          kit.length ? `<em>Starts with</em> ${esc(andList(kit))}.` : null,
          c.manaNote ? `<em>Mana.</em> ${inline(c.manaNote)}` : null,
          c.fate ? `<em>Fate.</em> ${inline(c.fate)}` : null,
        ])}${story(c.story)}</div>`,
    };
  }

  function monster(m) {
    const opts = ['Slay', m.options?.enslave && 'Enslave', m.options?.befriend && 'Befriend', m.options?.domesticate && 'Domesticate'].filter(Boolean);
    return {
      id: `mon-${m.id}`, size: 'half', layout: 'portrait',
      html: plate(plateIdFor(deckByPrefix('MON'), m), { format: 'portrait', deck: deckByPrefix('MON'), element: m.element, alt: m.name })
        + `<div class="text">${head({
          pre: `${code(m.cardCode, m.campaign)} · ${mark(m.element)} ${esc(name(elements, m.element))}${m.unique ? ' · <span class="unique">one of a kind</span>' : ''}`,
          name: esc(m.name), plain: esc(cap(orList((m.terrains ?? []).map((t) => name(terrains, t))))),
        })}${strip([
          { letter: L.health, value: m.health, tint: 'oxide' }, { letter: L.strength, value: m.strength, tint: 'ochre' },
          { letter: L.armour, value: m.armour, tint: 'slate' }, { letter: L.pace, value: m.pace, tint: 'verdigris' },
          { letter: L.yield, value: m.manaYield, tint: 'bruise' }, { element: m.element },
        ])}${facts([
          `<em>${esc(opts.join(' · '))}.</em> Run only if your pace beats ${m.pace}; slain, it yields the lesser of ${m.manaYield} and the purple die.`,
          m.special ? inline(m.special) : null,
          m.gift ? `<em>Gift to befriend:</em> ${inline(m.gift)}.` : null,
          m.befriended ? `<em>Befriended:</em> ${inline(m.befriended)}` : null,
          m.enslaved ? `<em>Enslaved:</em> ${inline(m.enslaved)}` : null,
          m.domesticated ? `<em>Domesticated:</em> ${inline(m.domesticated)}` : null,
        ])}${story(m.story)}</div>`,
    };
  }

  const CELLS = { 1: 'one cell', 2: 'two cells', 3: 'three cells', 4: 'four cells' };
  function building(b) {
    const tile = tiles.get(b.id);
    const deck = deckByPrefix('BLD');
    const lodging = (b.housing || 0) + (b.specialistHousing || 0);
    const ground = (b.terrain ?? []).map((t) => name(terrains, t));
    const where = [ground.length ? `Stands on ${orList(ground)}` : 'Stands on any ground'];
    if (b.orWaterside) where.push(`or on any hex with ${b.orWaterside === 'any' ? '' : `${b.orWaterside} `}water beside it`);
    if (b.waterside) where.push(`and needs ${b.waterside === 'any' ? '' : `${b.waterside} `}water beside it`);
    if (b.requiresBuilding) where.push(`with ${aOrAn(name(buildings, b.requiresBuilding).toLowerCase())} already there`);
    const over = [b.requiresDeposit, ...(b.requiresDepositAny ?? [])].filter(Boolean).map((d) => aOrAn(name(deposits, d)));
    const site = `${where.join(' ')}${over.length ? `, over ${orList(over)}` : ''}.`;
    const holds = [
      b.livestockSlots ? `${b.livestockSlots} animals` : null,
      b.garrison ? `${b.garrison} soldiers` : null,
      b.fieldSlots ? `${b.fieldSlots} fields beside it` : null,
      b.storage ? `${b.storage} slots of goods` : null,
    ].filter(Boolean);
    const jobs = (jobsAt.get(b.id) ?? []).map((r) => `${esc(r.name)} <span class="hrs">${r.effortHours} h</span>`);
    const makes = madeAt.get(b.id) ?? [];
    const tileFile = join(TILES, `${b.id}.svg`);
    let piece = '';
    if (tile && existsSync(tileFile)) {
      const m = readFileSync(tileFile, 'utf8').match(/width="([\d.]+)" height="([\d.]+)"/);
      const u = data.components.stock.unitsPerMm;
      if (m) piece = `<figure class="piece"><img src="../tiles/${esc(b.id)}.svg" alt="" style="width:${(+m[1] / u).toFixed(2)}mm;height:${(+m[2] / u).toFixed(2)}mm"><figcaption>the tile, actual size · ${CELLS[tile.cells.length] ?? tile.cells.length}</figcaption></figure>`;
    }
    const format = tile ? (tile.cells.length === 1 || tile.shape === 'single' ? 'square' : 'landscape') : 'square';
    return {
      id: `bld-${b.id}`, size: 'half', layout: format,
      html: plate(plateIdFor(deck, b), { format, deck, alt: b.name })
        + `<div class="text">${head({
          pre: `${code(b.cardCode ?? '', b.campaign)} · ${esc(name(byId(data.buildings.categories), b.category))} · tier ${b.tier}`,
          name: esc(b.name), plain: esc(b.summary),
        })}${strip([
          { letter: L.build, value: b.buildPoints, tint: 'slate' }, { letter: L.rounds, value: b.minRounds, tint: 'soot-tint-12' },
          ...(lodging ? [{ letter: L.lodging, value: lodging, tint: 'ochre' }] : []),
          ...(b.workerSlots ? [{ letter: L.jobs, value: b.workerSlots, tint: 'verdigris' }] : []),
          ...(b.storage ? [{ letter: L.goods, value: b.storage, tint: 'oxide' }] : []),
          ...(b.victoryPoints ? [{ letter: L.victory, value: b.victoryPoints, tint: 'bruise' }] : []),
        ])}${facts([
          bill(b.cost) ? `<em>Raise it from</em> ${esc(bill(b.cost))}.` : null,
          esc(site),
          holds.length ? `<em>Holds</em> ${esc(holds.join(' and '))}.` : null,
          b.specialist ? `Wants ${esc(aOrAn(name(professions, b.specialist).toLowerCase()))} to run.` : null,
          jobs.length ? `<em>Work here:</em> ${jobs.join(' · ')}.` : null,
          makes.length ? `<em>Made here:</em> ${esc(makes.join(', '))}.` : null,
        ])}${story(b.story)}${piece}</div>`,
    };
  }

  function vehicle(v) {
    const mode = modes.get(v.mode);
    const deck = deckByPrefix('VEH');
    return {
      id: `veh-${v.id}`, size: 'half', layout: 'landscape',
      html: plate(plateIdFor(deck, v), { format: 'landscape', deck, alt: v.name })
        + `<div class="text">${head({
          pre: `${code(v.cardCode, v.campaign)} · ${esc(v.mode === 'mounted' ? 'horse' : name(modes, v.mode))}`,
          name: esc(v.name), plain: mode ? esc(mode.summary) : '',
        })}${strip([
          { letter: L.health, value: v.hull, tint: 'oxide' }, { letter: L.cargo, value: v.cargoCapacity, tint: 'slate' },
        ])}${facts([
          inline(v.quirk),
          mode ? `<em>Runs as ${esc(aOrAn(mode.name.toLowerCase()))}:</em> speed ${mode.speed}${mode.speedOnRoad ? ` (${mode.speedOnRoad} on a road)` : ''}, ${mode.capacity} bulk, ${mode.requires && mode.requires !== 'none' ? `needs ${esc(aOrAn(name(buildings, mode.requires).toLowerCase()))}` : 'needs nothing'}${mode.upkeep ? `, upkeep ${esc(String(mode.upkeep))}` : ''}.` : null,
        ])}${story(v.story)}</div>`,
    };
  }

  function modification(m) {
    const deck = deckByPrefix('MOD');
    const bound = m.class === 'enchantment';
    const fits = m.fits.includes('any') ? 'fits anything' : `fits ${m.fits.map((f) => (f === 'mounted' ? 'a horse' : name(modes, f).toLowerCase())).join(', ')}`;
    const hand = m.specialist && m.specialist !== m.madeAt ? ` by ${aOrAn(name(professions, m.specialist).toLowerCase())}` : '';
    return {
      id: `mod-${m.id}`, size: 'quarter', layout: 'square',
      html: plate(plateIdFor(deck, m), { format: 'square', deck, element: m.element, alt: m.name })
        + `<div class="text">${head({
          pre: `${code(m.cardCode, m.campaign)} · ${esc(name(byId(data.modifications.classes), m.class))} · ${esc(fits)}`,
          name: esc(m.name),
        })}${strip(bound
          ? [{ letter: L.mana, value: m.manaCost, tint: 'bruise' }, { element: m.element }]
          : [{ letter: L.value, value: m.baseValue, tint: 'ochre' }, { letter: L.mass, value: m.massKg, tint: 'slate' }])}${facts([
          inline(m.effect),
          bound
            ? `Bound at the ${esc(name(buildings, m.madeAt).toLowerCase())}${hand}, ${m.manaCost} ${esc(m.element)} mana. At most ${data.modifications.slots.enchantmentLimit === 1 ? 'one enchantment' : `${data.modifications.slots.enchantmentLimit} enchantments`} on a vehicle.`
            : `Made at the ${esc(name(buildings, m.madeAt).toLowerCase())}${hand}: ${esc(bill(m.inputs))} · ${m.effortHours} h.`,
        ])}${story(m.story)}</div>`,
    };
  }

  const recipeNames = new Map(recipes.map((r) => [r.id, r.name]));
  function tool(t) {
    const deck = deckByPrefix('TOL');
    const jobs = (t.enables ?? []).map((r) => recipeNames.get(r) ?? r);
    return {
      id: `tol-${t.id}`, size: 'quarter', layout: 'square',
      html: plate(plateIdFor(deck, t), { format: 'square', deck, alt: t.name })
        + `<div class="text">${head({
          pre: `${code(t.cardCode, t.campaign)} · tool · ${esc(t.family)}`, name: esc(t.name), plain: esc(t.summary),
        })}${strip([
          { letter: L.wear, value: t.baseWear, tint: 'slate' }, { letter: L.value, value: t.baseValue, tint: 'ochre' },
        ])}${facts([
          jobs.length ? `<em>Gates:</em> ${esc(jobs.join(', '))}.` : null,
          `Made at the ${esc(name(buildings, t.madeAt).toLowerCase())}: ${esc(bill(t.craft?.inputs))} · ${t.craft?.effortHours} h.`,
          t.sizes?.length ? `<em>Sizes:</em> ${esc(t.sizes.join(', '))}.` : null,
          t.optional ? 'Optional: the work can be done by hand without it.' : null,
        ])}${story(t.story)}</div>`,
    };
  }

  const itemClass = byId(data.items.classes);
  function item(i, prefix) {
    const deck = deckByPrefix(prefix);
    const kind = name(itemClass, i.class);
    const extra = i.class === 'weapon' && i.battle != null ? [{ letter: 'B', value: i.battle, tint: 'oxide' }]
      : i.class === 'armour' && i.armour != null ? [{ letter: L.armour, value: i.armour, tint: 'slate' }]
        : i.class === 'talisman' ? [{ letter: L.mana, value: i.manaCapacity ?? 0, tint: 'bruise' }] : [];
    const cells = i.class === 'potion'
      ? [{ letter: L.value, value: i.baseValue, tint: 'ochre' }, { letter: L.mass, value: i.massKg, tint: 'slate' }]
      : i.class === 'talisman'
        ? [...extra, { letter: L.value, value: i.baseValue, tint: 'ochre' }, { letter: L.mass, value: i.massKg, tint: 'slate' }]
        : [{ letter: L.wear, value: i.wear ?? '—', tint: 'slate' }, ...extra, { letter: L.value, value: i.baseValue, tint: 'ochre' }, { letter: L.mass, value: i.massKg, tint: 'slate' }];
    const hand = i.specialist && i.specialist !== i.madeAt ? ` by ${aOrAn(name(professions, i.specialist).toLowerCase())}` : '';
    return {
      id: `itm-${i.id}`, size: 'quarter', layout: 'square',
      html: plate(plateIdFor(deck, i), { format: 'square', deck, alt: i.name })
        + `<div class="text">${head({
          pre: `${code(i.cardCode ?? '', i.campaign)} · ${esc(kind.toLowerCase())}${i.slot ? ` · ${esc(i.slot)}` : ''}`, name: esc(i.name),
        })}${strip(cells)}${facts([
          ...(i.effects ?? []).map(inline),
          `Made at the ${esc(name(buildings, i.madeAt).toLowerCase())}${hand}: ${esc(bill(i.inputs))} · ${i.effortHours} h.`,
        ])}${story(i.story)}</div>`,
    };
  }

  function spell(s) {
    const deck = deckByPrefix('SPL');
    return {
      id: `spl-${s.id}`, size: 'quarter', layout: 'square',
      html: plate(plateIdFor(deck, s), { format: 'square', deck, element: s.element, alt: s.name })
        + `<div class="text">${head({
          pre: `${code(s.cardCode, s.campaign)} · spell · ${mark(s.element)} ${esc(name(elements, s.element))}`, name: esc(s.name),
        })}${strip([{ letter: L.mana, value: s.cost, tint: 'bruise' }, { element: s.element }])}${facts([inline(s.effect)])}${story(s.story)}</div>`,
    };
  }

  function enchantment(e) {
    return {
      id: `enc-${e.id}`, size: 'quarter', layout: 'square',
      html: plate(null, { format: 'square', element: e.element, alt: e.name })
        + `<div class="text">${head({
          pre: `${code(e.cardCode, e.campaign)} · enchantment · ${mark(e.element)} ${esc(name(elements, e.element))}`, name: esc(e.name), plain: `Bound to ${esc(e.boundTo)}`,
        })}${strip([{ letter: L.mana, value: e.cost, tint: 'bruise' }, { element: e.element }])}${facts([inline(e.effect)])}${story(e.story)}</div>`,
    };
  }

  const paid = (r) => {
    if (!r) return [];
    const bits = [];
    if (r.coin) bits.push(`${r.coin}${rules.currency.symbol}`);
    if (r.vp) bits.push(`${r.vp} victory point${r.vp === 1 ? '' : 's'}`);
    if (r.mana) bits.push(`${r.mana.qty} ${r.mana.element} mana`);
    for (const id of r.items ?? []) bits.push(name(items, id));
    if (r.note) bits.push(r.note);
    return bits;
  };
  function quest(q) {
    const deck = deckByPrefix('QST');
    const stages = q.stages ?? [];
    return {
      id: `qst-${q.id}`, size: 'quarter', layout: 'landscape',
      html: plate(plateIdFor(deck, q), { format: 'landscape', deck, alt: q.name })
        + `<div class="text">${head({
          pre: `${code(q.cardCode, q.campaign)} · ${stages.length ? `campaign quest · ${stages.length} stages` : 'mini quest'} · complexity ${q.complexity}`,
          name: esc(q.name),
        })}<p class="hook">${inline(q.hook)}</p>${stages.length
          ? `<ol class="stages">${stages.map((st) => `<li><em>${esc(st.name)}.</em> ${inline(st.task)}${paid(st.reward).length ? ` <span class="pays">Pays ${esc(paid(st.reward).join(' · '))}</span>` : ''}</li>`).join('')}</ol>`
          : facts([inline(q.task), paid(q.reward).length ? `<em>Pays</em> ${esc(paid(q.reward).join(' · '))}` : null])}${q.notes ? `<p class="note">${inline(q.notes)}</p>` : ''}</div>`,
    };
  }

  const eventCat = byId(data.events.categories);
  const eventScope = byId(data.events.scopes);
  const said = (fx) => (fx.type === 'choice' && fx.branches?.length
    ? fx.branches.map((b) => `<em>${esc(b.label)}:</em> ${esc((b.effects ?? []).map((f) => f.text).filter(Boolean).join(' ') || 'nothing happens.')}`)
    : (fx.text ? [esc(fx.text)] : []));
  function event(e) {
    const deck = deckByPrefix('EVT');
    return {
      id: `evt-${e.id}`, size: 'quarter', layout: 'landscape',
      html: plate(plateIdFor(deck, e), { format: 'landscape', deck, alt: e.name })
        + `<div class="text">${head({
          pre: `${code(e.cardCode, e.campaign)} · ${esc(name(eventCat, e.category))} · ${esc(e.scope)}${e.copies > 1 ? ` · ${e.copies} copies` : ''}`,
          name: esc(e.name), plain: esc(e.text),
        })}${facts([
          `<em>${esc(name(eventScope, e.scope))}.</em> ${esc((eventScope.get(e.scope)?.summary ?? '').replace(/\.$/, ''))}.`,
          ...(e.effects ?? []).flatMap(said),
          e.mitigations?.length ? `<em>Could have been prevented by:</em> ${esc(e.mitigations.join(' '))}` : null,
        ])}</div>`,
    };
  }

  function people(p) {
    return {
      id: `ppl-${p.id}`, size: 'quarter', layout: 'portrait',
      html: plate(`people-${p.id}`, { format: 'portrait', alt: p.name })
        + `<div class="text">${head({ pre: `people · ${esc(p.effortDie)} · ${p.startingWorkers} workers to start`, name: esc(p.name), plain: esc(p.summary) })}${strip([
          { letter: L.strength, value: p.strength?.base ?? '—', tint: 'ochre' },
          { letter: L.carry, value: (p.strength?.base ?? 0) * rules.carrying.kgPerStrength, tint: 'slate' },
          { letter: L.mana, value: p.manaStorage?.innate ?? 0, tint: 'bruise' },
        ])}${facts([
          ...(p.traits ?? []).map((t) => `<em>${esc(t.name)}.</em> ${inline(t.effect)}`),
          p.foodPreference?.length ? `<em>Prefers</em> ${esc(p.foodPreference.map((f) => name(commodities, f).toLowerCase()).join(', '))}.` : null,
          p.terrainComfort?.length ? `<em>At home on</em> ${esc(p.terrainComfort.map((t) => name(terrains, t).toLowerCase()).join(', '))}.` : null,
        ])}${story(p.strength?.note)}</div>`,
    };
  }

  function terrain(t) {
    const wash = palette.terrain[t.id]?.wash ?? palette.paper.foxing.hex;
    const swatch = `<figure class="plate square swatch" style="--wash:${wash}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${esc(t.mark?.path ?? '')}"/></svg><figcaption>${esc(t.code)}</figcaption></figure>`;
    return {
      id: `ter-${t.id}`, size: 'quarter', layout: 'square',
      html: swatch + `<div class="text">${head({ pre: `terrain · code <b>${esc(t.code)}</b> · ${esc(t.family)}`, name: esc(t.name), plain: esc(t.summary) })}${facts([
        `<em>Move:</em> ${t.moveCost === 99 ? 'by boat only' : `${t.moveCost} to enter`}${t.roadCostMultiplier ? ` · road ×${t.roadCostMultiplier}` : ''}${t.railCostMultiplier ? ` · rail ×${t.railCostMultiplier}` : ''}.`,
        t.buildable ? 'Can be built on.' : 'Nothing is built on it.',
        t.features?.length ? `<em>May carry:</em> ${esc(t.features.join(', '))}.` : null,
        t.deposits?.length ? `<em>May hide:</em> ${esc(t.deposits.map((d) => name(deposits, d).toLowerCase()).join(', '))}.` : null,
        t.startTile ? 'A settlement may start here.' : null,
      ])}</div>`,
    };
  }

  /* --- the decks, grouped into sets ------------------------------------- */

  const setOf = (r) => (r.campaign ? `campaign:${r.campaign}` : r.expansion ? `expansion:${r.expansion}` : 'base');
  const rows = (deckPrefix, source) => cardsOfDeck(deckByPrefix(deckPrefix), source);

  /** Every chapter of the catalogue, each carrying its entries tagged with the set they belong to. */
  const chapters = [
    { id: 'characters', title: 'Characters', size: 'half', blurb: 'The heroes a player may be. Every number on the strip is a maximum, and the letters are the player board\'s own.', entries: rows('CHR', data.characters.characters).map((c) => ({ ...character(c), set: setOf(c) })) },
    { id: 'monsters', title: 'Monsters', size: 'half', blurb: 'What a discovery roll can put in front of you. Dealt onto a spare board and run like a player who is not a person.', entries: rows('MON', data.monsters.monsters).map((m) => ({ ...monster(m), set: setOf(m) })) },
    { id: 'buildings', title: 'Buildings', size: 'half', blurb: 'Everything that can be raised. The tile goes on the board; this is the page the tile was cut from.', entries: rows('BLD', data.buildings.buildings).map((b) => ({ ...building(b), set: setOf(b) })) },
    { id: 'vehicles', title: 'Vehicles', size: 'half', blurb: 'Named machines and animals, each a specific one with a history. A vehicle in play is dealt a player board of its own.', entries: rows('VEH', data.vehicles.vehicles).map((v) => ({ ...vehicle(v), set: setOf(v) })) },
    { id: 'modifications', title: 'Modifications', size: 'quarter', blurb: 'Fittings and enchantments bolted onto a vehicle after it is built. They share the vehicle\'s slots.', entries: rows('MOD', data.modifications.modifications).map((m) => ({ ...modification(m), set: setOf(m) })) },
    { id: 'tools', title: 'Tools', size: 'quarter', blurb: 'What gates a job and wears out doing it. One wear point a job, never an hour.', entries: rows('TOL', data.tools.tools).map((t) => ({ ...tool(t), set: setOf(t) })) },
    { id: 'weapons', title: 'Weapons', size: 'quarter', blurb: 'A number you add to your side of the battle total, and what it costs to swing.', entries: rows('WPN', data.items.items).map((i) => ({ ...item(i, 'WPN'), set: setOf(i) })) },
    { id: 'armour', title: 'Armour', size: 'quarter', blurb: 'What stands between you and the blow. It dents even when it holds.', entries: rows('ARM', data.items.items).map((i) => ({ ...item(i, 'ARM'), set: setOf(i) })) },
    { id: 'items', title: 'Items', size: 'quarter', blurb: 'Clothing, lights, potions, and the gear a hand carries. Every one has a mass, because somebody has to carry it.', entries: rows('ITM', data.items.items).map((i) => ({ ...item(i, 'ITM'), set: setOf(i) })) },
    { id: 'talismans', title: 'Talismans', size: 'quarter', blurb: 'Where mana is held by anyone who cannot hold it in the body. Made, sold and stolen like any other item.', entries: rows('TAL', data.items.items).map((i) => ({ ...item(i, 'TAL'), set: setOf(i) })) },
    { id: 'spells', title: 'Spells', size: 'quarter', blurb: 'What mana is spent on. One spell per character per round, of the element the mana holds.', entries: rows('SPL', data.arcana.spells).map((s) => ({ ...spell(s), set: setOf(s) })) },
    { id: 'enchantments', title: 'Enchantments', size: 'quarter', blurb: 'Mana laid into a building, a tool, an item or a person and left there until it is broken.', entries: (data.arcana.enchantments?.cards ?? []).map((e) => ({ ...enchantment(e), set: setOf(e) })) },
    { id: 'quests', title: 'Quests', size: 'quarter', blurb: 'Read aloud when they arrive, accepted or declined on the spot. A staged quest is taken in order.', entries: rows('QST', data.quests.quests).map((q) => ({ ...quest(q), set: setOf(q) })) },
    { id: 'events', title: 'Events', size: 'quarter', blurb: 'The deck the round opens with. Every disaster in it has something you could have bought in advance.', entries: rows('EVT', data.events.cards).map((e) => ({ ...event(e), set: setOf(e) })) },
    { id: 'peoples', title: 'Peoples', size: 'quarter', blurb: 'Who does the work. A people sets the die, the starting workers and the shape of a whole game.', entries: data.peoples.peoples.map((p) => ({ ...people(p), set: setOf(p) })) },
    { id: 'terrain', title: 'Terrain', size: 'quarter', blurb: 'The eleven kinds of ground, by the letter printed in the corner of every hex.', entries: data.terrain.terrains.map((t) => ({ ...terrain(t), set: setOf(t) })) },
  ];

  const sets = {
    base: { id: 'base', title: 'The base game', blurb: 'Everything in the box before a campaign or an expansion adds to it.' },
    ...Object.fromEntries([...campaigns.values()].map((c, i) => [`campaign:${c.id}`, { id: `campaign-${c.id}`, title: c.name, campaign: c, ordinal: i + 1 }])),
    ...Object.fromEntries([...expansions.values()].map((x, i) => [`expansion:${x.id}`, { id: `expansion-${x.id}`, title: x.name, expansion: x, ordinal: i + 1 }])),
  };

  return { chapters, sets, plate, hasPlate, plateSrc, campaignMark, mark, name, inline, esc };
}

/**
 * Lay a chapter's entries onto sheets: two half-page entries or four quarter-page
 * entries per sheet, each sheet one printed page, the first sheet of a chapter
 * carrying the chapter's head. Returns the HTML of every sheet.
 */
export function sheets(chapter, entries, { runningHead = '' } = {}) {
  const per = chapter.size === 'half' ? 2 : 4;
  const out = [];
  for (let i = 0; i < entries.length; i += per) {
    const slice = entries.slice(i, i + per);
    const first = i === 0;
    out.push(`<div class="sheet ${chapter.size}${first ? ' first' : ''}">`
      + (first
        ? `<header class="chead"><div class="running">${esc(runningHead)}</div><h3 class="ctitle" id="${esc(chapter.anchor ?? chapter.id)}">${esc(chapter.title)}</h3><p class="cblurb">${esc(chapter.blurb ?? '')}${chapter.count != null ? ` <span class="count">${esc(chapter.count)}</span>` : ''}</p></header>`
        : `<header class="chead run"><div class="running">${esc(runningHead)}</div><div class="rtitle">${esc(chapter.title)}</div></header>`)
      + slice.map((e) => `<article class="entry ${e.size} ${e.layout}" id="${esc(e.id)}">${e.html}</article>`).join('')
      + `</div>`);
  }
  return out.join('\n');
}
