# 02 — The economy

## Commodities

63 of them, in eleven categories. Every commodity carries four numbers that matter:

- **bulk** — storage slots per unit, and capacity cost when shipped
- **baseValue** — coin at price band 1.0
- **perishRounds** — how long it keeps outside a granary, if it perishes at all
- **category** — which price band it moves with

The interesting derived number is **value per slot**: `baseValue / bulk`. Logs are 2
coin per slot; jewellery is 220. That ratio is the entire logistics game. Nobody ships
raw logs across the map; everybody ships jewellery.

## Recipes

83 recipes. The shape is always the same:

```
site + tool + effort hours + input commodities  →  output commodities
```

Categories: extraction, agriculture, husbandry, processing, crafting, brewing, arcane,
civic, works. Construction labour is a recipe like any other — it just outputs
build-points instead of goods, which keeps one vocabulary for everything a worker can
be told to do.

### Variants

Some jobs accept different inputs for different results. Spinning takes wool, flax or
cotton; butchery takes cattle, pigs, sheep or chickens. These are `alternatives` on the
recipe rather than separate recipes, because they are one job at one site — the player
just decides what goes in.

### Fuel

Furnace recipes name a fuel *bundle* rather than a specific fuel, and the player pays
any one option:

- **standard** — 1 coal, or 2 charcoal, or 3 logs (−1 output), or 3 peat (−1 output)
- **hot** — 2 coal, or 3 charcoal (−1 output), or 1 crude oil (+1 output, steelworks only)

This is what makes coal strategically valuable without making it mandatory. You can run
a brickworks on peat forever; you will just always be one brick behind the player who
found a coal seam.

## The tiers

Tier is computed from the recipe graph, not authored. It is the depth of the tree
behind one unit.

| Tier | Examples | What it takes |
| --- | --- | --- |
| 0 | logs, stone, clay, grain, water | Terrain and a tool |
| 1 | lumber, charcoal, flour, brick, wool | One building |
| 2 | pig-iron, cloth, bread, leather, ale | A building fed by another building |
| 3 | steel, glass, fine cloth, ironware | A chain three deep, and usually fuel |
| 4 | jewellery, plate harness, potions | Everything above, plus a specialist |

The Chains view in the explorer draws this tree for any commodity, and reports the
total effort hours per unit all the way down.

## Buildings

51 of them, in eight categories. The ones that shape the game most:

**Housing** is how you get workers: hut 1, timber house 2, brick house 3, manor 4.
Every worker is a die every round forever, which makes housing the strongest
compounding investment in the game and the reason the first thing anyone builds is a hut.

**Storage** is the quiet constraint. A town starts with 10 free slots plus 6 from its
town hall. Logs are bulk 2. You will hit the cap sooner than you expect, and overflow
spoils half. Warehouses hold 12 of anything; granaries hold 10 of food and drink and
stop it perishing.

**Extraction** sits on terrain or on a deposit. Mines are the gate to the industrial
half of the game, and they exhaust: a coal seam holds 30 coal and then it is done.

**Production** turns things into other things. The dependency spine is:

```
quarry/clay-pit ─┐
lumber-camp ─→ sawmill ─→ [lumber] ─┬─→ blacksmith ─→ [tools, ironware]
                                     └─→ carpenter  ─→ [ploughs, looms, barrels]
mine ─→ [ore] ─→ smelter ─→ [pig-iron] ─→ steelworks ─→ [steel] ─→ rail
```

**Civic** buildings cost effort like anything else: minding a market is a job, brokering
a trade is a job, training a specialist is a job. This keeps trade competing with
production for the same scarce hours instead of being free.

## Where the money is

Three broad strategies fall out of the numbers, and they are meant to:

**Food and drink.** Bread feeds two workers per unit; ale and wine are worth 24–40 coin
a barrel and buy morale. Cheap to start, and the only strategy that solves feeding
permanently rather than round by round.

**Metal.** Coal plus iron plus two buildings gets you steel at 26 coin an ingot, and
steel is the only route to rail. High capital cost, and it depends on a deposit you
have to find first.

**Luxury.** Gold plus gems plus a smith gets jewellery at 110 coin and bulk 0.5 — 220
coin per storage slot, the densest value in the game. Slow, deposit-dependent, and
the single most attractive thing on the board for a thief.

## Balancing status

Nothing here is balanced. What the simulator can currently say is in
[12-what-simulation-found.md](12-what-simulation-found.md); the short version is that a
competent single town reaches about ten buildings and five workers in 24 rounds without
starving, and the deep chains are reachable but rarely worth it yet at that pace.
