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

**Tool** — a piece of equipment owned as an individual object with its own durability
track. Tools gate or improve recipes. They can be bought, sold and stolen like a
commodity, but they are tracked one at a time with wear, not as a stacked quantity.
Defined in `data/tools.json`.

**Item** — clothing, armour, weapons and potions. Like tools, owned individually;
unlike tools, they are carried by a figure or worker rather than used at a work site.
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

**Build-point** — one hour of construction work banked on a building's progress track.
A building is finished when its track is full *and* its minimum-rounds floor has
passed, so no amount of effort finishes a manor in one round.

**Bulk** — the storage slot cost of one unit of a commodity, and the capacity it eats
when shipped. Logs are bulk 2, gems are bulk 0.5. Bulk is why raw materials are worth
processing before moving them.

**Effort die** — the die a worker rolls each round. Pips are hours. The ladder runs
d4 · d6 · d8 · d10 · d12; most workers sit at d6.

**Feeding** — the end-of-round phase where every town must pay food upkeep from stock
held in that town. This is the pressure the whole game hangs off.

**Figure** — a piece that moves on the board rather than working in a town: prospector,
merchant, soldier, hero.

**Job** — a runnable instance of a recipe. The recipe is the rule; the job is you,
this round, at this site, with these tools.

**Maturation** — the wait between doing work and collecting the result. Crops grow,
wine ages, livestock breeds.

**Price band** — the multiplier applied to a commodity's base value in a given town.
Bands drift each round and events shove them around.

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

**Tier** — how deep a commodity sits in the production graph. Logs are tier 0; steel
is tier 3. Computed, not authored — the explorer derives it from the recipe graph.

**Turn** — one player's actions within the Actions phase. A round contains one turn
per player.

**Unrest** — what a town accumulates when it cannot feed itself. Three unrest starts a
riot.

**Wear point** — one point off a tool's durability track, spent per hour of effort
worked with that tool.
