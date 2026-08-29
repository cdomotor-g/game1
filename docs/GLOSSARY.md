# Glossary

The brief used "commodity" and "resource" interchangeably and flagged it as a problem.
It is a problem — the two words were doing three different jobs. Here are the terms
this project uses, and the ones it deliberately does not.

## The core distinction

**Commodity** — a storable, tradeable good that sits in a stockpile and takes up
storage slots. Logs, grain, steel, wine, gems. If it can be put in a warehouse, moved
by cart, sold at a market or stolen by an event card, it is a commodity. Defined in
`data/commodities.json`.

**Effort** — worker-hours. Rolled fresh each round, spent during your turn, gone at
the end of it. Effort is *not* a commodity: it cannot be stored, traded, stolen or
carried between towns. This is the game's real currency of decision-making.

**Deposit** — a finite geological source hidden under a tile: a coal seam, an iron
deposit, a gem vein. A deposit is not a commodity and never enters a stockpile. It is
a place that *yields* a commodity when you build the right building and spend effort.
Defined in `data/deposits.json`.

**Tool** — a piece of equipment owned as an individual object with its own wear
track. Tools gate or improve recipes. They can be bought, sold and stolen like a
commodity, but they are tracked one at a time with wear, not as a stacked quantity.
They were the only things in the game that wore out; everything a figure carries does
now. Defined in `data/tools.json`.

**Item** — clothing, armour, weapons and potions. Like tools, owned individually;
unlike tools, they are carried by a figure or worker rather than used at a work site.
Every item has a **mass**, because something has to carry it.
Defined in `data/items.json`.

### The word "resource"

Avoided as a mechanical term. It is used in this repo only in the loose everyday sense
("this is an expensive resource to develop"), never as a defined game object. When you
mean a thing in a stockpile, say **commodity**. When you mean worker-hours, say
**effort**. When you mean the thing in the ground, say **deposit**.

## Everything else

**Allocate** — to commit effort hours to a specific job at a specific site. The core
verb of a player's turn.

**Batch** — one execution of a recipe: its full effort cost, its full inputs, its full
outputs. You cannot run half a batch.

**Burden** — gone. It was a number, and then a bar, and then a track, for what a
character was carrying; **strength** does that job now. What a figure can shoulder is
`strength × 3` kilograms, printed in the KG box of their card's summary strip, and
nothing walks a token for it: a load either fits under the printed limit or it does
not. See `rules.json → carrying`.

**Armour** — what is between you and the blow, added straight to your side of the
battle roll. A worn suit runs 1 to 3 and a figure wearing body, head and off-hand can
reach 5; a monster's hide is the same field and runs 0 to 3, printed in the A box on
its card. It wears a point for every round of every battle it is worn in — a blow you
turned still dented the plate. See `rules.json → conflict.armour`.

**Defence** — retired. It was a rating that shifted a to-hit roll, and there is no
to-hit roll: a battle is one opposed total, in which a number that makes you harder to
hit and a number that soaks the hit are the same number. It is called armour and it is
above. Nothing in `data/` carries a `defence` any more and `validate-data.mjs` fails
the build on one.

**Battle roll** — one subtraction, and the same one the market makes. You total your
strength, your gear and two BLUE dice; the thing in front of you totals its strength,
its armour and two RED dice; the lower total loses health equal to the difference, and
a tie wounds nobody. See `rules.json → conflict.battle`.

**Character** — a named adventurer card that a player's hero figure takes on: a face,
health, strength, sometimes mana, and the coin they start with — all of
it printed in the summary strip across the top of the card. Defined in
`data/characters.json`. A
character is not a worker and rolls no effort die.

**Coast** — gone. It was a terrain that meant "the edge of the water", which made a
shore a *kind of ground*: a beach in front of a forest had to be drawn as neither, and
a town on a lake could not have a dock unless the map painted a ring of sand round the
lake first. The edge of the water is a relationship — see **waterside** — and the water
itself came back as two terrains of its own, **river** and **lake**. See
`data/terrain.json → siting.waterside`.

**Waterside** — a land tile with at least one water tile beside it. Not a terrain, never
printed on a hex, and read off the board the moment somebody asks. Three kinds, because
what needs a bank differs: *any* water, *fresh* (a river or a lake), or the *sea*. A dock
is waterside on any water; a harbour on the sea; drawing water without a well is
waterside on fresh. A building says which with `waterside` (a requirement) or
`orWaterside` (an alternative to its terrain list). See `data/terrain.json → siting`.

**Build-point** — one hour of construction work banked on a building's progress track.
A building is finished when its track is full *and* its minimum-rounds floor has
passed, so no amount of effort finishes a manor in one round.

**Bulk** — the storage slot cost of one unit of a commodity, and the capacity it eats
when shipped. Logs are bulk 2, gems are bulk 0.5. Bulk is why raw materials are worth
processing before moving them. Bulk is *not* mass: see **Mass**.

**Day leg / night leg** — one round's movement for a figure, party or vehicle. The
day leg is free; the night leg needs a lit torch or lantern, is slower, and makes the
discovery roll nastier. Speeds in `data/travel.json`.

**Discovery roll** — the d20 rolled when a movement leg ends, on the table for the hex
it stopped in. One roll per leg, never one per hex. What you find when you are *not*
looking; surveys and foraging are jobs. Tables in `data/discovery.json`.

**Effort die** — the die a worker rolls each round. Pips are hours. The ladder runs
d4 · d6 · d8 · d10 · d12; most workers sit at d6.

**Feeding** — the end-of-round phase where every town must pay food upkeep from stock
held in that town. This is the pressure the whole game hangs off.

**Figure** — a piece that moves on the board rather than working in a town: prospector,
merchant, soldier, hero.

**Job** — a runnable instance of a recipe. The recipe is the rule; the job is you,
this round, at this site, with these tools.

**Mass** — what one item weighs, in kilograms — `massKg` in `data/items.json`. Mass
is the cost of carrying a thing on a back; **bulk** is the cost of storing and shipping
a commodity. They measure different things for different components and never convert
into each other: cargo in a cart is bulk, the axe on your shoulder is mass. A commodity
has bulk and no mass; an item has mass and no bulk.

**Mana** — the arcane charge a slain monster yields, element-matched. Not a commodity:
no bulk, no stockpile, no crate. It lives in bodies (rarely) and in talismans, and it
is spent on spells. Defined in `data/arcana.json`. A *mana crystal* is a different
thing — frozen mana as a tradeable commodity.

**Maturation** — the wait between doing work and collecting the result. Crops grow,
wine ages, livestock breeds.

**Mini-map** — an A4 sheet holding one large hexagon of 61 cells: the inside of a
single campaign-map hex, opened out for a battle or a growing settlement. See
`docs/minimaps/`.

**Price band** — the multiplier applied to a commodity's base value in a given town.
Bands are rolled each round from supply and demand and bent by what the line remembers;
events shove them around on top of that. See `data/pricing.json`.

**Recipe** — the definition of one allocatable job: site + tool + effort + inputs →
outputs. Every single thing a player can do with effort is a recipe, including
construction labour. Defined in `data/recipes.json`.

**Round** — one full pass through all six phases. A game is 24 rounds.

**Site** — where a job happens: a building, a bare terrain tile, a deposit, or a
construction site.

**Specialist** — a worker trained into a profession at a guildhall. Unlocks recipes
plain workers cannot run.

**Spread** — the cut the board takes when you trade with the market rather than with
another player. A trading house or a merchant removes it.

**Stockpile** — a town's held commodities, limited by storage slots.

**Strength** — one number doing the whole job of an arm: what a figure swings with
(the attacker *subtracts* their own strength from the number they need) and what a
figure can shoulder (`strength × 3` kilograms). It is also the threat threshold some
rules read off a monster card. A night without a camp costs a point; one night's sleep
puts all of it back. See `rules.json → conflict.strength` and `rules.json → carrying`.

**Summary strip** — the row of lettered boxes across the top of every card: one box per
number, the letter first and the figure after it, `H 10  S 3  D 3`. It prints maximums
and nothing else, because nothing on a card moves — the tracks are on the player board,
and the strip's letters are the board's track letters so the two cannot be confused.

**Talisman** — an item that stores mana, tracked with a token on the card's vertical
mana bar. Most peoples cannot hold mana any other way. Defined in `data/items.json`,
class `talisman`.

**Terrain code** — the single letter printed in the bottom corner of every hex: G, F,
H, M, B, T, D, C, S, O. The ruling when the artwork straddles a grid line, and the key
into the travel and discovery tables.

**Tier** — how deep a commodity sits in the production graph. Logs are tier 0; steel
is tier 3. Computed, not authored — the explorer derives it from the recipe graph.

**Turn** — one player's actions within the Actions phase. A round contains one turn
per player.

**Unrest** — what a town accumulates when it cannot feed itself. Three unrest starts a
riot.

**Wear point** — one point off the W track beside a thing's own kit slot on the player
board, and every made thing in the game has some. A tool spends one per JOB, a weapon
or a piece of armour one per round of battle, a light one per night leg, and anything
else when its own card says. At 0 the thing is finished, not damaged. The scale is the
board's own 0–14, which is why tool wear came down from a range that ran past twenty —
the number came down to meet the board rather than the board going up to meet the
number. See `rules.json → wear`.

**Pip** — the 4.5 mm disc that walks a wear ladder and covers a depletion cell. One
piece, two jobs: a pip means one use of one thing has been spent. The ones on a
depletion grid are never lifted off.

**Spoil die** — the ochre die, rolled at the end of every round against every
perishable stack anybody is still holding. What it says, you discard. It replaced a
per-batch countdown, which needed a token with an age on it for every stack on the
table.
