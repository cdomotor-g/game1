# On the table

Everything in the box, and what each piece means. One rule runs through all of it: a card prints a number once, as a maximum, and nothing on a card ever moves — everything that moves is a token on a board. This chapter says which board, which token, and what the letters and marks on every piece stand for.

## The map

The world is one drawn map with a hexagonal grid over it. The first map is the Korvane Reach; a campaign may bring its own (see [Quests and campaigns](15-quests-and-campaigns.md)). Hexes are pointy-topped, and every hex has a column and a row, counted from the top-left corner — that pair is the hex's name whenever a sheet asks for one.

A single letter in the bottom corner of every hex is its **terrain code**. The letter is the ruling when the artwork straddles a grid line, and it is the key into the travel and discovery tables.

| Code | Terrain | Kind |
| --- | --- | --- |
| {{terrain.terrains[id=grassland].code}} | Grassland | land |
| {{terrain.terrains[id=forest].code}} | Forest | land |
| {{terrain.terrains[id=hills].code}} | Hills | land |
| {{terrain.terrains[id=mountain].code}} | Mountain | land |
| {{terrain.terrains[id=marsh].code}} | Marsh | land |
| {{terrain.terrains[id=tundra].code}} | Tundra | land |
| {{terrain.terrains[id=desert].code}} | Desert | land |
| {{terrain.terrains[id=river].code}} | River | fresh water |
| {{terrain.terrains[id=lake].code}} | Lake | fresh water |
| {{terrain.terrains[id=shallow-water].code}} | Shallow water | sea |
| {{terrain.terrains[id=deep-water].code}} | Deep water | sea |

**Waterside** is never printed: a land hex with a water hex beside it is waterside, read off the map when a rule asks. Crossing costs and what waterside allows are in [The map and travel](08-the-map-and-travel.md).

What stands on the map:

- **Figures** — prospector, merchant, soldier and hero: the pieces that move rather than work. Your hero is the figure a character card belongs to.
- **Deposit tokens** — {{components.tokens.deposit.acrossFlatsMm}} mm hexagons laid face down at setup, the deposit's mark on one face and what it holds on the other. A survey turns one over. A deposit is not a commodity; it is a place a mine draws from until it is empty.
- **Tree tokens** — a forest hex carries {{terrain.terrains[id=forest].treeTokens}}, a hex with scattered trees fewer. Felling takes one off; when the last goes, a forest is grassland.
- **Route tokens** — a road, a rail or a bridge is a bar laid along the line between two hex centres. Rail carries sleepers across its width; a bridge has squared ends and a parapet and lies across one water hex. Peg holes down the centre line say whose it is — one for the first player, two for the second, and so on — as well as the colour. An unmarked road belongs to nobody.
- **Building tiles**, below, with a **building marker** in your colour on the ones that are yours, and whatever a discovery roll leaves behind — a monster's card, a cave, a quest site — marked on its hex so the whole table can see it.

## Cards

Every card is 63 × 88 mm and carries a **code**: a deck prefix and a two-digit number, CHR-01, MON-09, QST-07, with a v2 suffix if it is ever reprinted changed. The prefix is which deck it goes back into.

### The summary strip

Across the top of a card is a row of lettered boxes, the letter first and the figure after it. Each figure is the most that number can ever be. Where the player board has a track with that letter, the strip is where you read the number to set the token; where it has none, the number is printed, used, and never walked.

| Letter | Means | Counted on |
| --- | --- | --- |
| H | Health — a vehicle's hull | the H track |
| S | Strength | the S track |
| P | Pace, in hexes | the P track |
| M | Mana | the M track |
| W | Wear — the uses left in a thing | the wear ladder beside its kit slot |
| A | Armour — a monster's hide, added to its battle total | nowhere; it does not change |
| Y | Mana yield — the most a slain monster gives up | nowhere; a ceiling on the purple die |
| C | Cargo — the bulk a vehicle's hold takes | nowhere; the cargo itself sits in the kit slots |
| {{rules.currency.symbol}} | Coin — a character's starting purse, or what a thing is worth | nowhere; coin is counted in coin |
| KG | Kilograms — what a figure can shoulder, or what a thing weighs | nowhere; total the load and compare |
| B, R, L, J, G, V | A building's build points, minimum rounds, lodging, jobs, goods stored, victory points | nowhere; a building walks nothing |

| Deck | Strip |
| --- | --- |
| Characters | H, S, M, {{rules.currency.symbol}}, KG |
| Monsters | H, S, A, P, Y, then the element's mark |
| Vehicles | H, C |
| Talismans | M, {{rules.currency.symbol}}, KG |
| Items, Weapons, Armour | W, {{rules.currency.symbol}}, KG |
| Tools | W, {{rules.currency.symbol}} |
| Modifications | {{rules.currency.symbol}}, KG — an enchantment prints M, the mana to bind it, and its element's mark |
| Spells | M, the mana to cast it, and its element's mark |
| Buildings | B and R, then L, J, G and V where the building has them |
| Events, Quests, Campaign | No strip: everything the card does is in its text |

A character's KG is its strength × {{rules.carrying.kgPerStrength}}, printed so nobody multiplies at the table. An element mark is one of four: ![fire](../art/icons/element-fire.svg) fire, ![earth](../art/icons/element-earth.svg) earth, ![water](../art/icons/element-water.svg) water, ![air](../art/icons/element-air.svg) air.

### The decks and their backs

Each deck has its own back: the deck's name, mirrored so it reads either way up, with a motif in a roundel at the centre. The word is the identification; the ink and the motif are how you tell a face-down stack from across the table.

| Deck | Code | Motif | Ink |
| --- | --- | --- | --- |
| Characters | CHR | rivet | ochre |
| Vehicles | VEH | wheel | slate |
| Monsters | MON | eye | oxide |
| Talismans | TAL | rayed | bruise |
| Modifications | MOD | wheel | verdigris |
| Spells | SPL | rayed | bruise |
| Events | EVT | rivet | oxide |
| Quests | QST | compass | ochre |
| Campaign | CAM | rayed | verdigris |
| Items | ITM | rivet | slate |
| Weapons | WPN | blade | oxide |
| Armour | ARM | mail | slate |
| Tools | TOL | socket | verdigris |
| Buildings | BLD | bond | oxide |

Talismans and spells share a back apart from the word; read the word. The campaign deck is the one deck never shuffled: it is read in order, a card a chapter. Every card in every deck is printed in full in Annex II.

## The player board

One A4 sheet per player, every one identical. Print one more than there are players — the spare is the **encounter board** — and one for every vehicle anyone expects to have on the road at once. On it:

- **IN PLAY**, top left: a recess for the card this board is running — a character, a monster or a vehicle.
- **Four kit slots**: whatever that card has in play — a weapon, a suit, a lantern, a tool, a talisman; on a vehicle's board, its cargo and modifications. Four is the limit; a fifth thing in play means putting one down.
- **A wear ladder** against each kit slot, for the thing lying in it.
- **Four tracks** up the middle, H, S, P and M, about the card in the recess.
- **THE ROUND** along the foot — the six phases in order — and beside it **IN A FIGHT**, the battle sum. Turn order passes to the left.

Every track and ladder runs from {{components.board.track.from}} to {{components.board.track.to}}, numbered from the bottom, every fifth rung ruled heavier. That is the game's ceiling: nothing a token walks ever runs past it. A {{components.tokens.bar.diameterMm}} mm **bar** walks each column; a {{components.tokens.pip.diameterMm}} mm **pip** walks each wear ladder.

| Track | Set from | Walks | At zero |
| --- | --- | --- | --- |
| H Health | the H box | Down as the figure is hurt; up under medical aid only — sleep mends nothing. A hull walks the same column, down as damaged and up as repaired | Carried to the nearest settlement, everything it carried lost. A vehicle is wrecked and spills its cargo on the hex |
| S Strength | the S box | Down a rung for every night without a camp; all of it back after one night's sleep | No fighting and no carrying |
| P Pace | the speed table, at the start of each leg | Down a rung for every hex entered | The leg is over: roll for discovery where you stopped |
| M Mana | 0, the bottom rung | Up as a slain monster yields mana, down as spells are cast. The most it may hold is the M on the character plus the M of every talisman in a slot | Empty |
| W Wear, four of them | the W box of the card in that slot, when the card goes in | Down a rung every time the thing is used; up as it is mended | Worn out: discard the card and clear the ladder |

Which uses cost wear, and what mends health, strength and gear, are in [Effort and jobs](05-effort-and-jobs.md), [The map and travel](08-the-map-and-travel.md), [Monsters and battle](12-battle.md) and [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

Two numbers deliberately have no track. **Kilograms**: total what a figure wears, wields, stows and carries in its purse, and it either fits under the KG on the card or it does not — coin counts, at {{rules.carrying.coin.perKg}} to the kilogram. **Armour**: a monster prints its own in the A box; a character's is whatever gear is in the kit slots. Either way it is added to a battle total and never walked.

### The encounter board

When a discovery roll turns up a monster or a stranger, the spare board runs it:

1. Deal the card face up into the IN PLAY recess.
2. Set H, S, P and M from its strip, exactly as a player sets their own. A does not move; Y is not set anywhere.
3. The player to the left of whoever drew it runs it, as a player who is not a person.
4. When the encounter ends, put the card away as the outcome says and take the tokens off. Nothing is written down.

How an encounter plays out is in [Discovery and encounters](11-discovery.md) and [Monsters and battle](12-battle.md).

### A vehicle's board

A vehicle in play is dealt a board of its own and run the same way: its card in the recess, its hull on the H track, its cargo and modifications in the four kit slots. C on the card is how much bulk the hold takes, and there is no token for it — the cargo is what is in the slots. At zero hull the vehicle is wrecked. See [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

## Dice

**Effort dice.** Every worker rolls one die a round and the pips are hours. Most workers roll a {{rules.effort.dieDefault}}; the ladder a die can step up or down is {{rules.effort.dieLadder}}. See [Effort and jobs](05-effort-and-jobs.md).

**The five coloured dice**, six-sided, one set for the whole table:

| Die | Colour | How many | What it does |
| --- | --- | --- | --- |
| Demand | blue | {{pricing.dice.sets[id=demand].count}} | Added: how badly the town wants the good. In a fight, your own dice |
| Supply | red | {{pricing.dice.sets[id=supply].count}} | Subtracted: how much turned up, and the most the board will sell this round. In a fight, the other side's dice |
| Volatility | green | {{pricing.dice.sets[id=volatility].count}} | Read on the market board's strip: {{pricing.volatility.steps[0].label}}, {{pricing.volatility.steps[1].label}} or {{pricing.volatility.steps[2].label}} |
| Spoil | ochre | {{pricing.dice.sets[id=spoil].count}} | Rolled at the end of every round against each perishable stack you hold; the spoil strip says how many you discard |
| Mana | purple | {{arcana.manaDie.count}} | Rolled once when a monster dies; you take the lesser of its Y and the roll |

Blue is what you want and red is what stands in your way, everywhere: a market is demand less supply and a battle is your total less theirs, with the same two colours. One player rolls the market for the whole ledger; every player rolls the spoil die for their own goods. Besides these, a **{{discovery.die}}** is rolled when a leg ends ([Discovery and encounters](11-discovery.md)) and a **{{rules.exploration.depositRevealDie}}** for a survey ([The map and travel](08-the-map-and-travel.md)).

## The market board and the depletion sheet

The **market board** is one A4 sheet for the whole table. Nothing stands on it and it records no price: it says how a price moves. Across its head is THE ROLL — a key to the dice, the three-cell volatility strip, and the seven-cell swing ruler that turns the net of a roll into how many places a price steps. Under it are FOUR KINDS OF GOODS, a panel per kind with its mark and a worked example, and along the foot THE MARKET, the trading rules. Every commodity is exactly one of the four, and the mark is engraved in the corner of its token:

| Mark | Kind | On the swing |
| --- | --- | --- |
| ![staple](../art/icons/pricing-staple.svg) | Staple | Adds nothing; the dice are the whole story |
| ![perishable](../art/icons/pricing-perish.svg) | Perishable | Adds nothing, but every stack still held at the end of a round faces the spoil die |
| ![finite](../art/icons/pricing-deplete.svg) | Finite | Adds the lowest number still visible on its depletion grid |
| ![sought](../art/icons/pricing-hype.svg) | Sought | Adds the move it made last round, read off the ledger |

The **depletion sheet** is a page of identical grids, one per finite commodity in play. A grid is {{pricing.depletion.per}} cells wide and runs from a row of noughts down to a row of {{pricing.depletion.top}}, under a hexagonal seat the commodity's own token stands in all game. Every time a unit of it is burnt — never when it is traded — a pip goes on the lowest uncovered cell, and it is never lifted off. The lowest number you can still see is what that commodity adds; a fresh grid reads 0. Print a fresh sheet every game. The procedure is in [Trade and the market](09-trade-and-the-market.md).

## The price ledger

The ledger is the only place a price lives: one A4 portrait sheet per town whose market you are trading in, printed fresh each game. Six columns run across it, each headed by a hexagonal seat — a column is not the grain column until the grain token stands in it — and a row runs down it for every round, 1 to {{rules.victory.gameLengthRounds}}. Each cell is three hollow seven-segment figures and a small move box.

1. Fill the figure's segments in pencil. Leave leading zeros blank: a price of 8 is a blank, a blank and an 8.
2. When the price changes, rule a line through the figure in the row above and fill the new one in this round's row.
3. Write the move in the box: how many places the price stepped, {{pricing.sought.from}} to +{{pricing.sought.to}}, or a dash if it held. A dash says the roll happened; an empty box says somebody forgot the column.

The one un-struck figure in a column is the price now. The four kind-of-good marks are printed along the foot as a key. A town trading more than six commodities takes a second sheet.

## Mini-maps

Some moments need more board than one hex — a battle, a settlement growing into a town. A **mini-map** is one hex of the world opened out: an A4 sheet per terrain, a hexagon of cells {{components.minimap.cellsPerSide}} to a side, sixty-one in all, in that terrain's colour and mark. Each cell is exactly a world-map hex, so a figure, a route bar or a building tile moves between the two as it is. The ENCOUNTER panel on the left has rows for Order, Round and Morale, out for a fight and put away after; the HOLDINGS panel on the right has Built, Garrison and Stores, in front of you as long as the settlement stands. The footer prints the sheet code and the terrain code, with a pencil blank for the map hex it stands in for. Play happens inside the sheet and the result is written back to the big map.

## Building tiles

A building tile is what you put down when you build. Its **face** is the finished building in colour, its name in a solid band along the lower-left edge. Its **back** is the same picture without the colour and the same name in a hollow band: the site pegged out, or a field sown. Lay a tile back up the round work starts and turn it over when the effort is paid — for a field, when the crop has stood its maturation rounds. A tile carries no number; the building's numbers are on its card, which you keep as well as the tile.

A tile is one to four cells, and a cell is a world-map hex, so it sits on the map or a mini-map without trimming. There is one shape per size, and the upper-left cell of each is the one you are told to place:

| Cells | Shape | Stands for |
| --- | --- | --- |
| 1 | single hex | A building with nothing outside it: a hut, a shop, a well, a tower |
| 2 | pair, two along a row | A building and its yard: a farm steading, a smithy with its stack |
| 3 | triad, three touching | A works: a granary, a tannery's pits and racks, a quarry, a harbour |
| 4 | rhombus, two rows of two | An estate: a manor and its grounds, a pasture and its fence, a steelworks |

A **field** is its own one-cell tile laid beside the farm, touching the farm or another of its fields, up to the farm's field slots. Road, rail and bridge are not tiles; they are the route bars above. Which building takes which tile is in Annex I, *Buildings*; every tile is pictured in Annex II.

## Tokens and coin

- **Commodity tokens** — {{components.tokens.commodity.acrossFlatsMm}} mm flat-topped hexagons carrying the family's mark and hatch, and the kind-of-good mark small in the corner. Never a number. One stands in a ledger seat to name a column, and one in a depletion seat to name a grid.
- **Coin** — round, in three sizes for {{components.tokens.coin.denominations[0].value}}, {{components.tokens.coin.denominations[1].value}} and {{components.tokens.coin.denominations[2].value}}, stamped with the figure and the mark {{rules.currency.symbol}}. Coin has weight, {{rules.carrying.coin.perKg}} to the kilogram, on the same scales as everything else a figure carries.
- **Bars** — the discs that walk the four column tracks, four per player board.
- **Pips** — one walks each wear ladder and comes off when the thing is finished with; one covers each depletion cell and never comes off. A pip means one use of one thing has been spent, an axe or a coal seam alike. There is no reserve: running out of pips is running out of seam.
- **Workers, specialists and soldiers** — meeples, a specialist a different shape from a worker. Workers and specialists live in a town and roll effort there; a soldier fights, escorts and garrisons, and moves as a figure does.
- **The round marker, turn-order markers and the first-player token.**
