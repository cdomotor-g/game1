# Commodities, recipes and buildings

Everything you make, move or sell is a commodity; every way of spending effort is a recipe; and a recipe runs at a site, which is usually a building. This chapter says what those three things are and what each one asks of you. How many hours a job costs you, and what a tool does to it, is in [Effort and jobs](05-effort-and-jobs.md); what a good fetches is in [Trade and the market](09-trade-and-the-market.md).

## Commodities

A commodity is a good you can hold in a stockpile, load on a cart, sell at a market or lose to a thief. There are {{count:commodities.commodities}} of them, in {{count:commodities.categories}} families. Effort is not a commodity: it cannot be kept, carried or sold. Neither is a tool or an item, which you own one at a time and which wear out. Every commodity is listed with its numbers in Annex I, *Commodities*.

| Family | What it is |
| --- | --- |
| Raw | Pulled straight out of the land: logs, stone, clay, ore, salt, water |
| Fuel | Burned to drive furnaces and kilns: coal, peat, charcoal, crude oil |
| Material | Processed stock other things are made from: lumber, brick, metal, glass, rope, leather |
| Textile | Fibre, yarn and cloth, and raw hide |
| Food | Counts towards the Feeding phase |
| Drink | Counts as food, and most drinks lift a worker's effort as well |
| Livestock | Living animals. They breed, they eat, and they yield |
| Container | Barrels, crates and sacks. A liquid needs a barrel |
| Luxury | Low bulk, high value, and scores at the end of the game |
| Arcane | Herbs, roots, lichen and mana crystal: what potions and enchantments are made of |
| Manufactured | Finished goods of several materials: ironware and parchment |

An event card that shoves a family shoves every commodity in it.

### Bulk

Every commodity has a **bulk**: the storage slots one unit takes in a stockpile, and the capacity it takes in a hold. Most goods are bulk 1. The exceptions are worth learning, because they decide what is worth carrying:

- **Bulk {{commodities.commodities[id=logs].bulk}}:** logs, stone, clay, sand, every ore, coal, peat, crude oil, brick, a barrel of ale, mead or wine, and a sheep or a pig.
- **Bulk {{commodities.commodities[id=cattle].bulk}}:** cattle and horses.
- **Bulk {{commodities.commodities[id=gems].bulk}}:** sacks, spices, gems, jewellery and all five arcane goods.

Bulk is not mass. Bulk is what a commodity costs to store and ship; mass, in kilograms, is what an item costs a figure to carry. The two never convert into each other: see [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

### Value

Every commodity has a **base value** in coin ({{rules.currency.symbol}}), and the price a town pays is that value stepped along its price row: see [Trade and the market](09-trade-and-the-market.md). Value divided by bulk is what a storage slot or a cart is really carrying. Logs are worth {{commodities.commodities[id=logs].baseValue}} at bulk {{commodities.commodities[id=logs].bulk}}; jewellery is worth {{commodities.commodities[id=jewellery].baseValue}} at bulk {{commodities.commodities[id=jewellery].bulk}}. Nobody ships raw logs across the map.

### Containers and animals

A liquid cannot be held without a **barrel**: water, milk, oil, ale, mead and wine all take one as an input, and the barrel comes back empty when the liquid is used. Crates and sacks are reusable in the same way and are what cargo travels in: see *Moving goods* in [Trade and the market](09-trade-and-the-market.md). **Livestock** lives in a pasture, breeds there, and can be sheared, milked or butchered; buy your first animal at a market.

### The four kinds of good

Every commodity is one of four kinds, and the mark in the corner of its token says which. A ![staple](../art/icons/pricing-staple.svg) **staple** adds nothing to the market roll: its price is the dice and nothing else, and more than half the goods in the game are staples. A ![perishable](../art/icons/pricing-perish.svg) **perishable** adds nothing either, but every stack of it you are still holding at the end of a round faces the spoil die. A ![finite](../art/icons/pricing-deplete.svg) **finite** good gets dearer every time a unit of it is burnt, and never cheaper again. A ![sought](../art/icons/pricing-hype.svg) **sought** good adds whatever move its price made last round, and so chases its own price. The whole rule for each is in [Trade and the market](09-trade-and-the-market.md).

## Tiers and chains

Almost nothing in the game is made in one step. Logs become lumber at a sawmill; lumber and ironware become barrels at a carpenter's; ore and fuel become pig iron at a smelter, and pig iron and hot fuel become steel at a steelworks. A commodity's **tier** is how deep that chain runs behind one unit of it: a good pulled straight from the land is tier 0, and every step of processing adds one, counting the fuel a furnace burns as a step. The dependency spine of the whole game is short:

- Quarry, clay pit and lumber camp give the stone, clay and logs that a sawmill and a brickworks turn into the lumber and brick every later building is made of.
- Lumber feeds the blacksmith, which forges ironware and every tool, and the carpenter's shop, which makes ploughs, looms, barrels and crates.
- A mine gives ore, a smelter turns it into pig iron, a steelworks turns that into steel, and steel is the only road to rail.
- Gold and gems, smelted and cut, become jewellery at a blacksmith: the densest value in the game.

Three goods sit at the top of the tree and are marked **tier three**: steel, fine cloth and jewellery. Every unit of them counts towards your industry score, and so does the depth of your longest completed chain: see [The game](01-the-game.md). Every chain is drawn out, one diagram per building, in Annex I, *The flows of work*: find the thing you want on the right of a diagram and walk left until every input is something you can gather.

## Recipes

A recipe is one job you can allocate a worker to. Every recipe has the same shape: a **site** where it runs, usually a **tool**, a number of **effort hours**, and the commodities that go in and come out. There are {{count:recipes.recipes}} of them, and everything a worker can be told to do is one, including construction work, which pays out in build-points instead of goods. One run of a recipe is a batch; you pay all of it and receive all of it, and the hours, worker slots and legality of a batch are in [Effort and jobs](05-effort-and-jobs.md).

The recipes fall into nine categories: extraction, agriculture, husbandry, processing, crafting, brewing, arcane, civic and works. Civic jobs are trade, training and logistics, and they cost effort like any other job; works are construction and infrastructure labour.

### Where a job runs

A recipe names one of six kinds of site:

- **A building**, finished, in a town you own. Most recipes.
- **Bare ground** of a named terrain: felling in a forest, cutting peat on a marsh or tundra, hunting on any hex with game.
- **A deposit**, revealed, under the mine or derrick built on it.
- **Waterside**: a land hex beside water. Angling for fish needs nothing built at all.
- **A construction site**, for building work.
- **A figure** on the map: a prospector surveys and plans routes wherever it stands.

A few recipes take either of two sites: felling timber runs on a forest hex or at a lumber camp, and drawing water runs at a well, on a marsh, or beside fresh water.

### Tools and specialists

If a recipe names a tool, a worker without one cannot run it. Some recipes name a tool as a bonus instead: a plough halves the hours of sowing, and a scythe doubles a harvest. Some name a **specialist**: fine cloth takes a trained weaver, jewellery and tools take a smith, garments a tailor, potions an alchemist, brokering a merchant and nursing a healer. Training is in [People, food and unrest](07-people.md).

You can always work with your hands. Gathering deadwood, foraging, and angling for fish with a line need no building; gathering field stone and cutting peat need only a shovel; and hewing timber with an axe gives you lumber before you own a saw. These are slow, and they are the way back for a player who has lost everything.

### Variants

Some jobs take different inputs for different results, and you choose which when you allocate. Spinning takes wool, flax or cotton; butchery takes cattle, a pig, a sheep or chickens; grazing breeds whichever animal you put in; serving drinks pours ale, mead or wine. A furnace recipe names a **fuel bundle** rather than a fuel, and you pay any one option in it: the bundles are in [Effort and jobs](05-effort-and-jobs.md).

### Things that take time

Some recipes pay out later. A sown crop sits on one of a farm's {{buildings.buildings[id=farm].fieldSlots}} field slots with a growth track, and is harvested by a second job when the track runs out. Livestock breeds in a pasture: one head and a sack of grain become two head after {{recipes.recipes[id=graze-livestock].maturationRounds}} rounds, chickens become three, and a horse takes two sacks. Wine sits in its barrel for {{recipes.recipes[id=make-wine].maturationRounds}} rounds before it can be sold or drunk; sold early, it fetches half. An orchard and a vineyard, once built, crop every round without re-sowing.

| Crop | Sow | Grows | Harvest |
| --- | --- | --- | --- |
| Grain | {{recipes.recipes[id=sow-grain].effortHours}} h and {{recipes.recipes[id=sow-grain].inputs[0].qty}} grain as seed | {{recipes.recipes[id=sow-grain].maturationRounds}} rounds | {{recipes.recipes[id=harvest-grain].effortHours}} h for {{recipes.recipes[id=harvest-grain].outputs[0].qty}} grain |
| Vegetables | {{recipes.recipes[id=sow-vegetables].effortHours}} h and {{recipes.recipes[id=sow-vegetables].inputs[0].qty}} vegetables | {{recipes.recipes[id=sow-vegetables].maturationRounds}} rounds | {{recipes.recipes[id=harvest-vegetables].effortHours}} h for {{recipes.recipes[id=harvest-vegetables].outputs[0].qty}} vegetables |
| Flax | {{recipes.recipes[id=sow-flax].effortHours}} h and {{recipes.recipes[id=sow-flax].inputs[0].qty}} flax | {{recipes.recipes[id=sow-flax].maturationRounds}} rounds | {{recipes.recipes[id=harvest-flax].effortHours}} h for {{recipes.recipes[id=harvest-flax].outputs[0].qty}} flax |
| Cotton (warm ground only) | {{recipes.recipes[id=sow-cotton].effortHours}} h and {{recipes.recipes[id=sow-cotton].inputs[0].qty}} cotton | {{recipes.recipes[id=sow-cotton].maturationRounds}} rounds | {{recipes.recipes[id=harvest-cotton].effortHours}} h for {{recipes.recipes[id=harvest-cotton].outputs[0].qty}} cotton |
| Hops | {{recipes.recipes[id=sow-hops].effortHours}} h and {{recipes.recipes[id=sow-hops].inputs[0].qty}} hops | {{recipes.recipes[id=sow-hops].maturationRounds}} rounds | {{recipes.recipes[id=harvest-hops].effortHours}} h for {{recipes.recipes[id=harvest-hops].outputs[0].qty}} hops |

A plough halves the sowing hours; a scythe doubles the harvest. Tending an orchard gives {{recipes.recipes[id=tend-orchard].outputs[0].qty}} apples, one more if an apiary stands on the next hex; a vineyard gives {{recipes.recipes[id=harvest-grapes].outputs[0].qty}} grapes; an apiary gives {{recipes.recipes[id=collect-honey].outputs[0].qty}} honey.

### Jobs that roll a die

Two recipes roll instead of paying out a fixed amount. **Forage** needs no tool and no building: roll a die on the forage table for berries, mushrooms, vegetables or, on a 6, an arcane herb; a forest or a marsh adds 1, an elf adds 1, and tundra or desert takes 2 off. **Survey** is below.

### Jobs that do something

Some recipes make nothing and do something instead. At a blacksmith a smith forges any tool, paying its own craft cost, and anyone with a hammer repairs one; a tailor sews garments and an alchemist brews potions the same way, each paying the item's listed inputs. Minding a market, brokering a trade and loading cargo are in [Trade and the market](09-trade-and-the-market.md); training a specialist and serving drinks against unrest are in [People, food and unrest](07-people.md); tending the sick is in [Events](10-events.md).

## What the ground offers

Bare ground is a site in its own right. Each terrain carries one or more features, and a feature says which jobs run there with nothing built. The terrain letter codes are on every hex and in Annex I, *Terrain*.

| Feature | Where | What it allows |
| --- | --- | --- |
| Dense trees | F | {{terrain.terrains[id=forest].treeTokens}} tree tokens. Felling removes one; when the last goes, the hex becomes grassland |
| Scattered trees | G | Two tree tokens |
| Exposed stone | H, M | A quarry may be built here |
| Fresh water | B, and any hex beside a river or lake | Draw water without a well |
| Fishing ground | R, L, S, O | A dock on the land beside it nets fish; a line from the bank catches half as much with nothing built |
| Game | F, H, M, T | Hunting |
| Herbs | F, M, B | Arcane herbs may be harvested |
| Reeds | B, R, L | Count as flax for rope-making, at 1 per 2 hours |
| Sand | D | A sand pit may be built here |
| Salt flat | D | Salt may be raked with a shovel, 1 per 2 hours, no mine needed |
| Caves | H, M | A discovery roll here can reveal a cave mouth: see [Discovery and encounters](11-discovery.md) |

Clearing a forest with an axe is a job of its own: it yields logs and flips the hex to grassland for good. There is no way to plant a forest back.

## Deposits and surveys

A deposit is a source hidden under a hex: a coal seam, an iron deposit, a gem vein. It is not a commodity and never enters a stockpile. It is a place that yields one when the right building stands on it and somebody spends the hours. Deposits are face-down tokens laid under the map at setup ([Setting up](03-setting-up.md)), and each one carries its own **yield**: the number of units it holds before it is worked out. Two coal seams are not the same prospect, and what a survey tells you is which one you found.

| Deposit | Yields | Hides under | Worked by | Tokens, richest first |
| --- | --- | --- | --- | --- |
| Clay bed | clay | G, F, B | clay pit | {{deposits.deposits[id=clay-bed].tokenYields}} |
| Sand bar | sand | — | sand pit | {{deposits.deposits[id=sand-bar].tokenYields}} |
| Peat bog | peat | B, T | a shovel, nothing built | {{deposits.deposits[id=peat-bog].tokenYields}} |
| Coal seam | coal | G, H, M, T | mine | {{deposits.deposits[id=coal-seam].tokenYields}} |
| Iron deposit | iron ore | G, F, H, M, T | mine | {{deposits.deposits[id=iron-deposit].tokenYields}} |
| Copper deposit | copper ore | H, M | mine | {{deposits.deposits[id=copper-deposit].tokenYields}} |
| Gold deposit | gold ore | G, H, M | mine | {{deposits.deposits[id=gold-deposit].tokenYields}} |
| Gem vein | gems | H, M, D | mine | {{deposits.deposits[id=gem-vein].tokenYields}} |
| Salt dome | salt | G, D | mine | {{deposits.deposits[id=salt-dome].tokenYields}} |
| Mana vein | mana crystal | F, H, M | mine | {{deposits.deposits[id=mana-vein].tokenYields}} |
| Oil field | crude oil | G, B, T, D | oil derrick | {{deposits.deposits[id=oil-field].tokenYields}} |

### Surveying

A prospector entering a face-down hex turns it over, and that reveals the terrain at once. What is under it takes a survey: a job run by a prospector figure carrying a surveyor's kit, for {{recipes.recipes[id=survey-deposit].effortHours}} hour, on the hex it stands on.

1. Roll one die. Add 1 on hills or mountain, add 1 if the prospector is a dwarf, and add 2 if a trace tile lies on the hex.
2. On a 1 or 2 the ground is bad: no deposit is revealed.
3. On a 3 you find traces: you may survey this hex again next round at +1.
4. On a 4 or 5, turn the hex's deposit token face up, if it has one.
5. On a 6, turn it face up and it starts with 2 more yield than it prints.

A trace tile is placed by a discovery roll ([Discovery and encounters](11-discovery.md)) and stays until the deposit is found or ruled out. A deposit you reveal is not yours: it belongs to whoever builds on it first.

> **Open.** Every deposit also carries a survey difficulty, from {{deposits.deposits[id=clay-bed].surveyDifficulty}} for a clay bed to {{deposits.deposits[id=mana-vein].surveyDifficulty}} for a mana vein, and whether that number replaces the 4 in step 4 for that deposit is not yet settled. Until it is, play the table above as written.

### Working a deposit

A mine goes on a revealed mineral deposit and an oil derrick on a revealed oil field, one building per deposit, and what it produces is whatever lies under it. Every mining job draws units off the deposit: {{recipes.recipes[id=mine-coal].depletesDeposit}} per batch of coal, iron ore, copper ore or salt, and {{recipes.recipes[id=mine-gold-ore].depletesDeposit}} per batch of gold ore, gems, mana crystal or oil. When the total drawn reaches the token's yield, the deposit is exhausted: turn the token over, and the mine runs no more jobs. A clay pit digs its bed without drawing it down. Dwarves cut mana crystal an hour faster, and elves will not work a mana vein at all.

> **Open.** A peat bog and a sand bar are dealt as deposit tokens, but cutting peat and digging sand need no deposit and draw none down, so finding one changes nothing yet. Until that is settled, treat one as a sign of good ground and nothing more.

Drawing a finite good out of the ground is not what makes it dearer; burning it is. Each unit of coal, ore or any other finite good that a furnace consumes puts a pip on that good's depletion grid, and the pip never comes off: see [Trade and the market](09-trade-and-the-market.md).

## Buildings

A building stands on a hex, costs commodities to raise, takes build-points of work and a minimum number of rounds to finish, and then is a site where recipes run. There are {{count:buildings.buildings}}, in eight categories. Costs, build-points and how construction is paid for are in [Effort and jobs](05-effort-and-jobs.md); every building's numbers are in Annex I, *Buildings*, and its full card in Annex II.

| Category | What it does |
| --- | --- |
| Housing | Brings workers into a town |
| Extraction | Sits on a feature or a deposit and pulls raw goods out of it |
| Production | Turns commodities into other commodities |
| Storage | Adds slots to a town's stockpile |
| Civic | Trade, order and the machinery of a town |
| Military | Raising, housing and hiding behind soldiers |
| Arcane | Where the strange work happens |
| Infrastructure | Built onto hexes and water crossings rather than into a town |

### What a building needs

- **A town.** Every building except an inn or a piece of infrastructure stands in a town, and a town begins with a town hall: one per town, and always the first thing placed.
- **Ground.** Most buildings name the terrain they will stand on; a building that names none goes on any land hex. Nothing is built on water, and no housing goes on a mountain. A quarry wants hills or mountain, a farm grassland, a lumber camp forest, a clay pit marsh or grassland, a sand pit desert.
- **Waterside.** A dock needs a land hex beside any water; a harbour needs one beside the sea. A sand pit may stand beside any water instead of on desert. Waterside is defined in [The map and travel](08-the-map-and-travel.md).
- **A deposit.** A clay pit stands on a revealed clay bed, a mine on any revealed mineral deposit, an oil derrick on a revealed oil field.
- **A building you already have.** A steelworks needs a smelter; a tailor needs a weaver's shed; a trading house needs a market; a harbour needs a dock; rail needs a steelworks and a rail depot needs rail. A winery must stand on or beside a vineyard.
- **The open road.** An inn alone may stand outside a town, on any hex carrying a road, rail or a route you have travelled, for {{buildings.buildings[id=inn].roadside.extraCost[0].qty}} extra lumber. It founds no town and stores nothing, and you may own {{buildings.buildings[id=inn].roadside.cap}} such inns.

### Housing

A hut houses {{buildings.buildings[id=hut].housing}} worker, a timber house {{buildings.buildings[id=timber-house].housing}}, a brick house {{buildings.buildings[id=brick-house].housing}}, and a manor {{buildings.buildings[id=manor].housing}} workers and {{buildings.buildings[id=manor].specialistHousing}} specialist. Workers in a brick house ignore Cold Snap events. A manor scores {{buildings.buildings[id=manor].victoryPoints}} at the end of the game. Every worker is an effort die every round, which is why the first thing anyone builds is a hut.

### Extraction and production

Extraction buildings are where the land is worked: the lumber camp lets you fell on any forest hex within one, and stores {{buildings.buildings[id=lumber-camp].storage}} bulk of logs on site; the quarry, clay pit, sand pit, mine and derrick dig; the well draws water; the farm sows on its {{buildings.buildings[id=farm].fieldSlots}} field slots; the pasture holds {{buildings.buildings[id=pasture].livestockSlots}} head; the orchard, vineyard and apiary crop; and the dock nets fish. Production buildings turn one thing into another, and two of them work harder for where they stand: a sawmill on a waterside hex gives one extra lumber per batch, and a mill on hills or waterside gives extra flour. The steelworks only really works on coal. What each one takes and gives is in Annex I, *The flows of work*.

### Storage

A town holds {{rules.storage.stockpileFreeSlotsPerTown}} slots of its own and {{buildings.buildings[id=town-hall].storage}} more in its town hall. A warehouse adds {{buildings.buildings[id=warehouse].storage}} slots for anything, and a granary {{buildings.buildings[id=granary].storage}} for food and drink only, where a perishable stack reads the spoil die one row kinder. Both are what a thief looks for first. What happens above the cap is in [Effort and jobs](05-effort-and-jobs.md).

### Civic, military and arcane

The market lets a town trade with the board; the trading house removes the spread for its owner and opens trade with other players; the guildhall trains one specialist a round; the inn serves drink against unrest, rests travellers and hires escorts; the infirmary tends the sick. The barracks turns fed workers into soldiers and holds {{buildings.buildings[id=barracks].garrison}} of them; the watchtower cancels one theft or raid event per game against its town and reveals the face-down hexes beside it; the palisade gives defenders an extra die: see [Monsters and battle](12-battle.md). The alchemist brews potions and needs an alembic ([Mana, talismans, spells and potions](13-magic.md)); the shrine lets you re-roll one effort die in its town each round and scores {{buildings.buildings[id=shrine].victoryPoints}}.

### Infrastructure

A road costs {{buildings.buildings[id=road].cost[0].qty}} stone and {{buildings.buildings[id=road].buildPoints}} build-points per hex, halves land movement through it and carries carts. Rail costs {{buildings.buildings[id=rail].cost[0].qty}} steel and {{buildings.buildings[id=rail].cost[1].qty}} lumber per hex, scores {{buildings.buildings[id=rail].victoryPointsPerTile}} per hex, and trains load only at a rail depot. Both are multiplied by the terrain they cross. A bridge carries either across one hex of shallow water; a harbour lets ships load and unload. What they cost to cross, and what they pay their owner, is in [The map and travel](08-the-map-and-travel.md).
