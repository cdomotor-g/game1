/**
 * Which records a deck deals.
 *
 * One file holds more than one deck's worth in two places: items.json is now
 * four decks (ITEMS, WEAPONS, ARMOUR, TALISMANS) and arcana.json is two. The
 * rule for splitting them is declared on the deck, in data/components.json
 * `decks[].sourceFilter`, and this is the one place that reads it.
 *
 * It was three places. tools/lib/mint.mjs had a switch, tools/build-cards.mjs
 * had a filter and docs/js/data.js had another, each writing out the same list
 * by hand — and components.json's own comment has always promised that "adding
 * a deck is an entry under `decks` plus its content file". It was not: splitting
 * the weapons and the armour out of the items deck meant editing three tools or
 * having them quietly disagree about which cards existed.
 *
 * So the filter is typed and it is read for real. `{class: "weapon"}` keeps that
 * class; `{classNot: [...]}` drops those. It is deliberately a tiny vocabulary
 * rather than an expression language: a deck is a slice of a file by one field,
 * and anything more complicated than that is a second file wanting to exist.
 *
 * Loaded by the browser as a global and by the tools through
 * tools/lib/decks.mjs, the same shim pattern as docs/js/framing.js and
 * docs/js/graph.js — so the explorer, the card builder and the mint queue cannot
 * come to different conclusions about what is in a deck.
 */
(function (root) {
  'use strict';

  /** Does this record belong to a deck with that filter? No filter, all of them. */
  function matchesFilter(record, filter) {
    if (!filter) return true;
    if (filter.class !== undefined && record.class !== filter.class) return false;
    if (Array.isArray(filter.classNot) && filter.classNot.indexOf(record.class) !== -1) return false;
    return true;
  }

  /**
   * Every record a deck deals, out of the rows its source file holds, in the
   * order that file declares them.
   *
   * The caller supplies the ROWS. That division is deliberate and it was got
   * wrong once: an earlier draft took the whole dataset and picked "the first
   * array on it", which for items.json is `classes` and not `items`, and every
   * item deck came back empty. WHICH array a file's cards live in is that file's
   * own business and the manifest already names it; WHICH of those rows a deck
   * deals is the only part that is shared, and it is the only part here.
   */
  function cardsOfDeck(deck, rows) {
    if (!rows) return [];
    return rows.filter(function (r) { return matchesFilter(r, deck.sourceFilter); });
  }

  root.Decks = { matchesFilter: matchesFilter, cardsOfDeck: cardsOfDeck };
})(typeof window !== 'undefined' ? window : this);
