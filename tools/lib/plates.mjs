/**
 * Turning a card into the name of the plate it needs.
 *
 * One rule, three readers: tools/build-cards.mjs looks for the plate,
 * tools/mint-queue.mjs reports the ones that are missing, and the briefs in
 * docs/art/prompts/ are filed under exactly these names. The template itself is
 * data - `plateId` on each deck in data/components.json - so a deck can change
 * how its plates are named without anything here being edited.
 */

/** `character-{cardCode|lower}` + a card -> `character-chr-06`. */
export function plateIdFor(deck, card) {
  return deck.plateId.replace(/\{(\w+)(\|lower)?\}/g, (_, field, lower) => {
    const v = card[field];
    if (v == null) throw new Error(`${deck.prefix}: card has no ${field} to build a plate id from`);
    return lower ? String(v).toLowerCase() : String(v);
  });
}
