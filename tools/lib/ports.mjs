/**
 * The PORT deck, worked out. One reader for four writers: tools/build-cards.mjs
 * sets the card from it, tools/build-annex.mjs prints the table, tools/draw-port.mjs
 * cuts the picture around the right hex, and tools/validate-data.mjs checks it.
 *
 * Nothing here is typed on a card. A port's name, rank and hex come off the
 * settlement on the board; its lanes are the shipping routes that start or end
 * there; and every price is a step along a commodity's own printed row, worked
 * out with the ledger's rounding (tools/build-annex.mjs priceRow) - so a change
 * to a base value or a band moves every port that names the good.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const readJson = (root, ...p) => JSON.parse(readFileSync(join(root, ...p), 'utf8'));

/** The ledger's own rounding: a base value times a band, never below one coin. */
export const rowOf = (base, bands) => bands.map((b) => Math.max(1, Math.round(base * b)));

export function loadPorts(root) {
  const ports = readJson(root, 'data', 'ports.json');
  const rules = readJson(root, 'data', 'rules.json');
  const commodities = new Map(readJson(root, 'data', 'commodities.json').commodities.map((c) => [c.id, c]));
  const map = readJson(root, 'data', 'maps', `${ports.map}.json`);
  const atlas = readJson(root, 'data', 'maps', 'earth-atlas.json');
  const bands = rules.market.priceBands;
  const traits = new Map(ports.traits.map((t) => [t.id, t]));
  const places = new Map(map.settlements.map((s) => [s.id, s]));

  const price = (g) => {
    const c = commodities.get(g.commodity);
    return { id: c.id, name: c.name, step: g.step, price: rowOf(c.baseValue, bands)[g.step] };
  };

  return ports.ports.map((p) => {
    const place = places.get(p.settlement);
    const trait = traits.get(p.trait);
    const base = ports.berth.baseByRank[place.rank];
    const feeRow = rowOf(base, bands);

    /* The board's own shipping lanes, read off the route id and name: "rome-venice"
       / "Rome to Venice". The other end is whichever side is not this port. */
    const sails = map.routes.shipping
      .filter((r) => r.id.startsWith(`${p.settlement}-`) || r.id.endsWith(`-${p.settlement}`))
      .map((r) => {
        const [a, b] = r.name.split(' to ');
        return { to: a.toLowerCase() === p.name.toLowerCase() ? b : a, hexes: r.hexes.length };
      })
      .sort((x, y) => x.hexes - y.hexes || x.to.localeCompare(y.to));
    const voyages = (atlas.atlas?.lanes ?? []).filter((l) => l.ports.includes(p.settlement)).map((l) => l.name);

    return {
      ...p, place, trait, feeBase: base, feeRow, fee: feeRow[trait.step],
      cheap: p.cheap.map(price), dear: p.dear.map(price), sails, voyages,
      /* Where on the plate this port stands, as the map's own offset hex. */
      hex: [place.col, place.row], rank: place.rank,
    };
  });
}

export const money = (rules) => rules.currency?.symbol ?? '';
