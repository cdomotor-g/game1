# 08 — What is in the box

A first pass at the physical bill of materials, generated from the data. Quantities are
for a 4-player game and are estimates, not a manufacturing spec.

## Board

- **61 hex tiles** — double-sided, terrain printed on the face, a neutral "unexplored"
  pattern on the back. Terrain mix in `data/terrain.json` under `boardSetup.terrainMix`.
- **45 deposit tokens** — placed face down under tiles at setup, flipped when surveyed.
  Counts per type in `data/deposits.json` (`tokensInSetup`).
- **~40 tree tokens** — forest tiles carry 6 each; removed as they are felled.

## Per player (×4)

- **1 player board** — stockpile track, effort pool, unrest track, turn reference
- **20 building markers** in the player colour
- **12 worker meeples**, 4 specialist meeples (distinct shape), 6 soldier meeples
- **4 figures** — prospector, merchant, hero, and a spare
- **6 tool cards** with sliding durability markers — the fiddliest component, and the
  one most worth prototyping early
- **30 road segments**, 20 rail segments, 4 bridges
- **6 effort dice** — d6 standard, plus a d4/d8/d10/d12 set shared between players for
  ladder effects

## Cards

- **58 event cards** — the deck in `data/events.json`
- **63 commodity reference cards** — one per commodity, showing value, bulk, and what
  makes it. These double as the market price reference.
- **83 recipe cards** — or, more likely, 8 double-sided player reference sheets grouped
  by category. 83 cards is a lot of shuffling for something nobody shuffles.
- **26 equipment cards** — clothing, armour, weapons, potions

## Tokens and bits

- **Commodity tokens** — the big question. 63 commodities is far too many to give each
  its own wooden bit. Two candidate approaches:
  1. **Generic cubes in 11 category colours**, with the specific commodity tracked on a
     player-board grid. Cheap, compact, and it makes a stockpile hard to read at a
     glance from across the table.
  2. **Printed cardboard chits per commodity**, ~20 of the common ones and ~8 of the
     rare. Readable, thematic, and a genuinely large amount of punchboard.

  The digital prototype sidesteps this entirely, which is exactly why it should not be
  the thing that decides it. This needs a paper prototype before it needs an opinion.

  One thing the style guide settles either way: **eleven distinguishable colours do not
  exist** — not across colour-blindness, not across dye lots, and not in greyscale, where
  the eleven collapse into five clusters. So each category also carries a hatch pattern,
  which is what actually identifies it. Under option 1 the hatch moves to the
  player-board grid cell, and the cube supplies only colour — which is a real argument in
  favour of cubes, since it costs nothing to print a hatch into a cell.
  See [../art/02-palette.md](../art/02-palette.md).

- **~120 coins** in 1 / 5 / 20 denominations
- **Price band markers** — 11, one per commodity category, on a shared market track
- **Round marker**, turn order markers, first player token

## Player aids

- **Turn reference** — the six phases, and the legality checklist for allocating effort
- **Production chain poster** — the tier-0-to-tier-4 spine on one sheet. The Chains view
  in the web explorer is the working draft of this.

## Print-and-play

Everything above is derivable from `data/*.json`, so a generator that renders card
fronts from the data is an obvious next tool — and it would keep the printed components
honest against the rules automatically, in the same way the web explorer already is.

The [two-plate system](../art/01-two-plate-system.md) is what makes that generator
tractable: one layout pass emits a `#wash` group and an `#ink` group, the colour edition
is both, and the print-and-play edition is the ink group alone. Not two design efforts —
one layout and two print runs. The files in [../art/examples/](../art/examples/) are built
to that contract and are the generator's target output.
