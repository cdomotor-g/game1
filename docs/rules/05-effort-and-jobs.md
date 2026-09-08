# Effort and jobs

Every worker rolls a die at the start of the round, and the pips are hours. You spend those hours on jobs: a recipe run at a site, usually with a tool, usually on something out of the stockpile. Hours you have not spent when the round ends are gone.

{{fig:plate:tool-axe,plate:tile-lumber-camp,plate:people-human,plate:tile-warehouse|frieze}}

## The labour roll

The labour roll is the second phase of the round (see [The round](04-the-round.md)). It is made in the open, so everyone can see how much work everyone else has this round.

1. Roll {{rules.effort.dicePerWorker}} die for every worker in every town you own. Most peoples roll a {{rules.effort.dieDefault}}; orcs roll a {{peoples.peoples[id=orc].effortDie}}. A people's traits can change the die a worker rolls at a particular kind of site — see [People, food and unrest](07-people.md).
2. Leave each die beside its worker. The pips on it are that worker's hours for the round.

{{fig:plate:character-chr-05|margin|A hero is a figure, not a worker, and rolls no effort die.}}

A specialist rolls the same die as any other worker. A soldier rolls none, and neither does a character: heroes are figures, not workers.

### Modifiers

Anything that changes a worker's roll does one of three things. Apply them in this order:

1. **Extra dice.** Roll the extra die as well as the worker's own.
2. **Die steps.** Move the worker's die up or down the ladder: {{rules.effort.dieLadder}}.
3. **Flat hours.** Add or take hours from the pips. However many bonuses stack, a worker never gains more than {{rules.effort.maxFlatBonusPerWorker}} flat hours in a round.

{{fig:plate:people-dwarf,plate:people-elf,plate:tile-shrine|A dwarf steps up at a mine, an elf steps down, and a shrine re-rolls one die a round.}}

The modifiers a table meets most rounds:

| Modifier | What it does | Where the rule is |
| --- | --- | --- |
| Variety bonus | A town fed from {{rules.population.foodVarietyBonus.threshold}} or more different foods gives every worker in it 1 extra hour next round | [People, food and unrest](07-people.md) |
| Riot | Workers in a rioting town roll a d4 until the unrest clears | [People, food and unrest](07-people.md) |
| Tundra | {{terrain.terrains[id=tundra].effortPenalty}} hour for every worker at a site on a tundra hex | [The map and travel](08-the-map-and-travel.md) |
| Shrine | Once a round, re-roll one effort die in the shrine's town | [Commodities, recipes and buildings](06-the-economy.md) |
| Event cards | A card may add or take hours, step dice, or cut a town's effort for a round; it says which, and for how long | [Events](10-events.md) |
| People's traits | A dwarf at a mine rolls a d8, an elf at one a d4, and so on | [People, food and unrest](07-people.md) |

### Hours do not keep

Whatever you have not spent by the end of your turn is lost. There is no saving a quiet round to fund a loud one.

## Allocating workers

You spend hours by putting workers at sites. A site is wherever a job happens:

- a finished building;
- a construction site — a building founded and not yet finished;
- bare ground — a hex whose terrain the recipe names, with nothing built on it: felling timber in a forest, cutting peat on a marsh, angling from any bank;
- a deposit, through the mine built on top of it;
- a figure on the map — a prospector surveys where it stands.

{{fig:flow:farm|third|The farm's jobs; two workers' hours pool there into one sowing.}}

To allocate a worker, put its die on the site. Then:

- **A worker works at one site a round.** Its hours are spent there and nowhere else.
- **Hours at a site pool.** Two workers at a farm who rolled 3 and 2 have 5 hours between them, which is one sowing.
- **A site takes only so many workers.** Every building prints its worker slots; a construction site takes {{rules.construction.workersPerSiteDefault}}. The cap is why you build a second of anything.
- **Hours left over at a site stay there.** If they cannot start another batch at that site, they are lost.

> **Open.** No worker cap is given for a job on bare ground or on a figure. Until there is one, allow a bare hex the same {{rules.construction.workersPerSiteDefault}} workers as a construction site.

## Running a job

{{fig:flow:smelter|half|A smelter job asks for all six at once: site, tool, inputs, fuel, hours and nobody sick.}}

A job is a recipe you can legally run right now. It is legal when all of these hold:

1. **Site.** You have the place the recipe names, and your workers are at it.
2. **Tool.** You hold a tool of the kind the recipe names, with wear left on it, if it names one.
3. **Specialist.** A fed specialist of the profession is present in the town, if the recipe asks for one.
4. **Inputs.** The commodities are in that town's stockpile.
5. **Fuel.** You can pay one of the options in the recipe's fuel bundle, if it burns something.
6. **Hours.** The workers at the site have the batch's hours left between them.

### Batches

One batch is one run of the recipe: its full hours, its full inputs, its full outputs. You cannot run half a batch, and you cannot take half the output for half the hours. Run as many batches as you can pay for.

When you run a batch everything happens at once:

1. Take the inputs, and the fuel, out of the stockpile.
2. Spend the hours.
3. If this is the first batch of this job this round, knock the tool's wear down one rung.
4. Put the outputs into the stockpile.

{{fig:plate:tile-pasture|margin|A breeding pair is a batch that pays out rounds later; the marker waits on the pasture.}}

Some recipes do not pay out at once. A sown crop, a breeding pair, a barrel of wine: the recipe says how many rounds it waits. Put the marker down, advance it at each Production Tick, and collect when it is ripe.

Where a recipe accepts more than one input — spinning wool, flax or cotton; butchering any of four animals — it is one job with a choice. Pick the variant when you run the batch. Every job, with its hours, inputs and outputs, is set out building by building in Annex I, *The flows of work*; the chains behind them are in [Commodities, recipes and buildings](06-the-economy.md).

## Tools

{{fig:plate:tool-saw,plate:tool-pick,plate:tool-hammer,plate:tool-scythe|Four tools: the pick gates coal, the scythe merely doubles a harvest.}}

A tool is owned one at a time, not counted in a stockpile. In play it lies in a kit slot on the player board, and the W ladder beside that slot counts its wear (see [On the table](02-on-the-table.md)).

**A required tool gates the job.** No pick, no coal. A job needs one tool of the kind, whoever's hours go into it.

**An optional tool improves the job.** Sowing and harvesting are done by hand. A plough halves the hours of a sowing; a scythe doubles the yield of a harvest. An optional tool used in a job wears like any other.

### Wear

{{fig:card:TOL-03|margin|The W box in the pick's strip is where its ladder pip starts.}}

1. When a tool comes into play, set the pip on its W ladder to the W box on its card.
2. Every job the tool is used in knocks it down {{rules.wear.perUse}} rung. A job is one recipe at one site for the round, however many hours go into it and however many batches come out: a worker who spends nine hours felling timber has run one job and blunted one axe by one.
3. At 0 the tool is finished. The job that took it there completes; the hours spent are not refunded, and the tool is discarded.

Everything a figure carries wears the same way — a sword a point a round of battle, a torch a point a night leg. The table is in Annex I, *Wear*; the rules for gear are in [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

### Sizes

A tool comes in up to three sizes. A bigger tool makes the same hours count for more; it does not let one worker work faster, wear slower, or stand at a site past its worker cap.

| Size | Output | Price | Forged from |
| --- | --- | --- | --- |
| Small | ×{{rules.tools.sizes[id=small].outputMultiplier}} | ×{{rules.tools.sizes[id=small].costMultiplier}} | the tool's listed inputs |
| Medium | ×{{rules.tools.sizes[id=medium].outputMultiplier}} | ×{{rules.tools.sizes[id=medium].costMultiplier}} | double the inputs |
| Large | ×{{rules.tools.sizes[id=large].outputMultiplier}} | ×{{rules.tools.sizes[id=large].costMultiplier}} | triple the inputs |

Multiplied output rounds down, and is never less than 1.

### Repair

{{fig:flow:blacksmith|third|Repair Tool and Forge Tool both run at the blacksmith, one with a hammer, one with a smith.}}

Any settlement with a blacksmith can mend a tool. Repair Tool is a job: {{recipes.recipes[id=repair-tool].effortHours}} hours at the blacksmith, with a hammer. It puts up to {{rules.wear.repair.wearPerRound}} rungs back on one thing's W ladder, at {{rules.wear.repair.coinPerPoint}} coin a rung, never above the W box on its card. A tool may be mended any number of times. A tool at 0 is not damaged, it is gone, and cannot be mended.

### Getting a tool

Forge Tool is a job at a blacksmith with a smith present: pay the tool's own inputs and hours, listed in Annex I, *Tools*. Or buy one where tools are sold — see [Trade and the market](09-trade-and-the-market.md).

## Fuel

A recipe that burns something names a fuel bundle rather than a fuel. Pay any one option from the bundle for each batch. Some options cost a unit of output; one adds a unit.

| Bundle | Option | Pay | Output |
| --- | --- | --- | --- |
| Standard | {{recipes.fuelOptions.standard[0].label}} | {{recipes.fuelOptions.standard[0].inputs[0].qty}} | — |
| Standard | {{recipes.fuelOptions.standard[1].label}} | {{recipes.fuelOptions.standard[1].inputs[0].qty}} | — |
| Standard | {{recipes.fuelOptions.standard[2].label}} | {{recipes.fuelOptions.standard[2].inputs[0].qty}} | {{recipes.fuelOptions.standard[2].outputPenalty}} |
| Standard | {{recipes.fuelOptions.standard[3].label}} | {{recipes.fuelOptions.standard[3].inputs[0].qty}} | {{recipes.fuelOptions.standard[3].outputPenalty}} |
| Hot | {{recipes.fuelOptions.hot[0].label}} | {{recipes.fuelOptions.hot[0].inputs[0].qty}} | — |
| Hot | {{recipes.fuelOptions.hot[1].label}} | {{recipes.fuelOptions.hot[1].inputs[0].qty}} | {{recipes.fuelOptions.hot[1].outputPenalty}} |
| Hot | {{recipes.fuelOptions.hot[2].label}} | {{recipes.fuelOptions.hot[2].inputs[0].qty}} | +{{recipes.fuelOptions.hot[2].outputBonus}}, steelworks only |

{{fig:plate:tile-charcoal-kiln|margin|Charcoal is one option in the standard bundle, and the kiln is where it comes from.}}

Fuel is an input like any other: it comes out of the stockpile, and the finite kinds mark their depletion grid when burnt (see [Trade and the market](09-trade-and-the-market.md)).

## Building

A building is raised in three steps: found it, work it, finish it.

### Founding

1. Check the building's requirements — the ground, the deposit or water, the building it must follow — on its card and in [Commodities, recipes and buildings](06-the-economy.md).
2. Pay the whole material cost from the town's stockpile, now. Nothing is paid at the end.
3. Put the building's tile on the hex face down. It is a construction site: a place of work with an empty progress track.

{{fig:tile:timber-house|margin|A tile face down is a construction site; its name band is hollow until it turns.}}

A half-built site never decays; the points on it keep.

### Working it

Construction labour is a job like any other, run at the site with the workers you put there. Every construction job is one hour a batch, so put in as many hours as you have. Each hour adds {{rules.construction.buildPointsPerEffortHour}} build point to the track — or 2 with the right tool for the material.

| Job | Tool | Where it works | Points an hour |
| --- | --- | --- | --- |
| Building Work | hammer | any site | {{recipes.recipes[id=build-generic].buildPointsPerHour}} |
| Timber Framing | saw | a building whose cost is mostly logs or lumber | {{recipes.recipes[id=build-timber-frame].buildPointsPerHour}} |
| Masonry | trowel | a building whose cost is mostly stone or brick | {{recipes.recipes[id=build-masonry].buildPointsPerHour}} |
| Sink Mineshaft | shovel | a mine | {{recipes.recipes[id=sink-mineshaft].buildPointsPerHour}} |
| Lay Roadbed | shovel | a road | {{recipes.recipes[id=lay-roadbed].buildPointsPerHour}} |
| Lay Rail | hammer | a rail line | {{recipes.recipes[id=lay-rail].buildPointsPerHour}} |

Roads, rail and bridges are built onto a hex rather than into a town, and the ground multiplies what they cost; that, and the tolls they earn, is in [The map and travel](08-the-map-and-travel.md).

### Finishing

A building is finished at the Production Tick when both of these are true:

- its progress track holds all of its build points;
- its minimum rounds have passed, counting the round it was founded as the first.

{{fig:plate:tile-hut,plate:tile-manor|A hut can finish the round it is founded; a manor waits on the calendar however many hands it has.}}

Turn the tile face up. From then on it is a site, it houses whoever it houses, and its storage counts. A hut is {{buildings.buildings[id=hut].buildPoints}} points and {{buildings.buildings[id=hut].minRounds}} round, so a good roll finishes it the round it is founded. A manor is {{buildings.buildings[id=manor].buildPoints}} points and at least {{buildings.buildings[id=manor].minRounds}} rounds, and no number of workers buys its way past the calendar. Every building's cost, points and rounds are in Annex I, *Buildings*.

## Storage and overflow

Every commodity has a bulk, and bulk is what it costs to store: one slot holds one point of bulk. Logs are bulk {{commodities.commodities[id=logs].bulk}}, lumber is bulk {{commodities.commodities[id=lumber].bulk}}, gems are bulk {{commodities.commodities[id=gems].bulk}}. Bulk is why raw goods are worth processing before they are stored or moved. Tools and items have no bulk: they are owned, not stored, and take no slot.

{{fig:plate:tile-granary|margin|Food and drink only, and a perishable stack inside reads the spoil strip a row kinder.}}

A town's stockpile is one pool of slots. It starts with {{rules.storage.stockpileFreeSlotsPerTown}} free slots and {{buildings.buildings[id=town-hall].storage}} more from its town hall, and buildings add to it:

| Building | Slots | Holds |
| --- | --- | --- |
| Warehouse | {{rules.storage.warehouseSlotsEach}} | anything |
| Granary | {{rules.storage.granarySlotsEach}} | food and drink only; a perishable stack in it reads one row up the spoil strip |
| Lumber camp | {{buildings.buildings[id=lumber-camp].storage}} | logs, on site |

**Overflow.** At the end of the Feeding phase, whatever is above the town's capacity spoils: lose half of it, rounded up. A perishable stack outside a granary also rolls the spoil die in that same phase — see [Trade and the market](09-trade-and-the-market.md).
