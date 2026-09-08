# The map and travel

The world is a drawn map with a hexagonal grid over it, and everything that moves on it — a figure, a party, a cart, a ship — moves in legs. This chapter is the ground, what it costs to cross, what a road and a rail line do for you, and what a party spends by being out on it.

## The ground

Every hex prints a terrain letter in its corner, and the letter is the ruling when the drawing straddles a line. The eleven terrains, their codes and what each one offers are in [On the table](02-on-the-table.md) and in Annex I, *Terrain*; each has a page in Annex II.

**Waterside.** A land hex with any water hex beside it is waterside. It is never printed; read it off the map when a rule asks for it. A dock goes on any waterside hex — a river bank, a lake rim and a sea shore all do. A harbour needs the sea beside it, and a dock already there.

**Fresh water** is a river, a lake, or a marsh, and any hex beside a river or a lake. Water can be drawn there without a well, and a town there ignores a Drought.

## Exploring

On a drawn map the whole country is in view from the first round. What is hidden is under it: the deposit tokens laid face down at setup ([Setting up](03-setting-up.md)). Finding one is a **survey**, and only a prospector can make one.

1. Stand a prospector on the hex. A survey is a job: {{recipes.recipes[id=survey-deposit].effortHours}} hour of the prospector's own effort, with a surveyor's kit.
2. Roll a {{rules.exploration.depositRevealDie}}. Add 1 on hills or mountain, 1 if the prospector is a dwarf, 2 if a trace tile lies on the hex, and 1 if the party carries binoculars.
3. On a 1 or 2 there is nothing here. On a 3, traces: survey the hex again next round at +1. On a 4 or 5, turn the hex's deposit token face up, if it has one. On a 6, turn it up and it starts with 2 more yield than it prints.

A revealed deposit belongs to nobody until somebody builds on it. Its yield is the number on the token; when that many units have been drawn, turn the token over and the mine on it is a shed. Which deposits hide under which ground, and how many units each holds, is in [Commodities, recipes and buildings](06-the-economy.md).

A table playing on loose hex tiles instead of a drawn map deals them face down, and a prospector entering one turns it up for {{rules.exploration.revealCost.effortHours}} hour; the deposit under it still needs a survey.

## Figures

A figure is a piece that moves rather than works. Your **hero** is the figure your character card belongs to, one per player, free at setup. The other three are bought in the Actions phase at a town of yours and appear on its hex:

| Figure | Costs | Does |
| --- | --- | --- |
| Prospector | {{transport.figures[id=prospector].cost}} coin | Surveys deposits and plans routes; carries the surveyor's kit |
| Merchant | {{transport.figures[id=merchant].cost}} coin | Trades without the spread wherever it stands, and reaches other players' merchants and trading houses |
| Soldier | {{transport.figures[id=soldier].cost}} coin | Fights, escorts, garrisons; eats every round whether it fights or not |

Figures that travel together are a **party**, and a party moves as one at the pace of its slowest member. A vehicle carries figures as passengers where its card says so.

## Legs

Every moving figure, party or vehicle gets one **day leg** a round, in the Actions phase. How far it goes is its **pace**: the number of hexes for its mode of travel on the ground it is crossing, read from the travel table. Set the P track on the board to that number at the start of the leg and walk it down one rung for every hex entered; at 0 the leg is over.

| Mode | On foot | Mounted | Cart | Caravan | Barge | Ship | Sled | Airship |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Grassland | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.G}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.G}} | {{travel.speeds.modes[id=cart].hexesPerDayLeg.G}} | {{travel.speeds.modes[id=caravan].hexesPerDayLeg.G}} | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.G}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.G}} |
| Forest | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.F}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.F}} | {{travel.speeds.modes[id=cart].hexesPerDayLeg.F}} | {{travel.speeds.modes[id=caravan].hexesPerDayLeg.F}} | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.F}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.F}} |
| Hills | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.H}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.H}} | {{travel.speeds.modes[id=cart].hexesPerDayLeg.H}} | {{travel.speeds.modes[id=caravan].hexesPerDayLeg.H}} | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.H}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.H}} |
| Mountain | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.M}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.M}} | — | — | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.M}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.M}} |
| Marsh | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.B}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.B}} | — | — | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.B}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.B}} |
| Tundra | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.T}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.T}} | {{travel.speeds.modes[id=cart].hexesPerDayLeg.T}} | {{travel.speeds.modes[id=caravan].hexesPerDayLeg.T}} | — | — | {{travel.speeds.modes[id=sled].hexesPerDayLeg.T}} | {{travel.speeds.modes[id=airship].hexesPerDayLeg.T}} |
| Desert | {{travel.speeds.modes[id=on-foot].hexesPerDayLeg.D}} | {{travel.speeds.modes[id=mounted].hexesPerDayLeg.D}} | {{travel.speeds.modes[id=cart].hexesPerDayLeg.D}} | {{travel.speeds.modes[id=caravan].hexesPerDayLeg.D}} | — | — | — | {{travel.speeds.modes[id=airship].hexesPerDayLeg.D}} |
| River, lake | — | — | — | — | {{travel.speeds.modes[id=barge].hexesPerDayLeg.R}} | — | frozen only | {{travel.speeds.modes[id=airship].hexesPerDayLeg.R}} |
| Shallow water | — | — | — | — | {{travel.speeds.modes[id=barge].hexesPerDayLeg.S}} | {{travel.speeds.modes[id=ship].hexesPerDayLeg.S}} | frozen only | {{travel.speeds.modes[id=airship].hexesPerDayLeg.S}} |
| Deep water | — | — | — | — | — | {{travel.speeds.modes[id=ship].hexesPerDayLeg.O}} | — | {{travel.speeds.modes[id=airship].hexesPerDayLeg.O}} |
| On a road | {{travel.speeds.overrides[id=road].hexesPerDayLeg.on-foot}} | {{travel.speeds.overrides[id=road].hexesPerDayLeg.mounted}} | {{travel.speeds.overrides[id=road].hexesPerDayLeg.cart}} | {{travel.speeds.overrides[id=road].hexesPerDayLeg.caravan}} | — | — | — | — |

A dash is ground that mode cannot enter at all. Mounted travel needs a horse, either the commodity ridden or a horse card. A train runs only on rail, depot to depot, at {{travel.speeds.overrides[id=rail].hexesPerDayLeg.train}} hexes a leg whatever the ground. On a road, use the road number whatever lies under it. A dwarf crosses mountain and hills a hex cheaper, an elf forest, and a party with a coil of rope hills and mountain; a travelling cloak, a staff, a map between two printed settlements, and a Fair Wind each add to a leg as their cards say.

> **Open.** The table gives a pace for each kind of ground, and not for a leg that crosses more than one kind. Until it does, a leg is paced by the slowest ground it enters.

Every hex a leg enters that carries another player's road or rail pays that player a toll, below. When the leg ends, roll for discovery where you stopped — [Discovery and encounters](11-discovery.md).

### Night legs

After its day leg a party may push on into the dark, and only with a light in hand:

| Light | The night leg |
| --- | --- |
| None | No travel at all, even on a road |
| A torch | {{travel.night.torch.hexesPerNightLeg}} hex, or {{travel.night.torch.hexesOnRoad}} on a road, whatever the mode. The torch's one use is spent |
| A lantern | Half the day pace, rounded up; the lantern takes 1 wear |
| A lantern and a compass | The full day pace, and the second discovery roll is made at the ordinary monster band |
| An Owl's Eye potion | As a lantern, for one round |

A train with a lantern fitted runs at night at full speed; a ship with one rigged sails at half. A night leg is never free: where it ends the party makes a second discovery roll with the monster band widened by 1, and every figure in it loses 1 strength for the night without a camp (below).

### Caves

A discovery roll on hills or mountain can leave a **cave mouth** on the hex. A party may go in only with a lit torch or lantern — a torch spends one use, a lantern nothing — and going in resolves one draw on the cave table ([Discovery and encounters](11-discovery.md)). A cave that has been emptied is marked spent, and from then on it is a known camp: resting in it counts as an inn that costs no coin.

### Wind

An airship pays no heed to the ground and every heed to the wind. Roll a d6 before each of its day legs: on a 1 the wind is foul and the ship moves 1 hex in a direction the player on your left chooses; on a 2 or 3 it is contrary and the ship makes half pace, rounded down; on a 4 or 5 full pace; on a 6 full pace and 2 hexes more. A sweep rig, a Fair Wind and an Aeronaut's Draught each change that roll as their cards say.

### Winter

While a Hard Frost card is in play, and on tundra and mountain at any time, marsh, river, lake and shallow water are frozen. A sled crosses frozen water at the pace in the table; no other land mode may enter it, and no barge or ship may. When the frost lifts, a sled standing on a marsh or a water hex is lost with its cargo, so move it before the round ends.

## Roads, rail and bridges

A road, a rail line or a bridge is built onto a hex rather than into a town, and it belongs to the player who paid for it for the rest of the game. Lay a route token along the hex's edge as it is finished; the token is the record, and an unmarked road belongs to nobody.

- A **road** costs {{buildings.buildings[id=road].cost[0].qty}} stone and {{buildings.buildings[id=road].buildPoints}} build points a hex. Carts may use it, and everything on it moves at the road pace.
- A **rail line** costs {{buildings.buildings[id=rail].cost[0].qty}} steel and {{buildings.buildings[id=rail].cost[1].qty}} lumber and {{buildings.buildings[id=rail].buildPoints}} build points a hex, and you must own a steelworks. Only trains use it, and they board and leave it at a rail depot. Every hex of rail scores {{buildings.buildings[id=rail].victoryPointsPerTile}} victory point as it is laid.
- A **bridge** costs {{buildings.buildings[id=bridge].cost[0].qty}} stone, {{buildings.buildings[id=bridge].cost[1].qty}} lumber, {{buildings.buildings[id=bridge].cost[2].qty}} ironware and {{buildings.buildings[id=bridge].buildPoints}} build points, and carries a road or a rail across one river, lake or shallow-water hex. Deep water is never bridged.

The ground multiplies the build points: a road through hills costs twice its points, through mountain four times, and rail six times through mountain. The multipliers are in Annex I, *Terrain*. A prospector's Plan Route job marks a surveyed line across up to three hexes, and road or rail built along it costs 1 build point a hex less. The construction jobs themselves are in [Effort and jobs](05-effort-and-jobs.md).

### The toll

Every hex of your road that another player's leg enters pays you {{rules.infrastructure.toll.roadPerHex}} coin; every hex of your rail, {{rules.infrastructure.toll.railPerHex}}. It is collected from the moving player the moment the leg ends, and no leg pays more than {{rules.infrastructure.toll.capPerLeg}} coin however long it is. Nobody pays for their own roads, for a hex where their own road shares the line with yours, or while carrying a quest you accepted. A player may decline to pay and go round; they may not decline to pay and go through.

### Haulage

Cargo that starts or ends its journey in a settlement your own road or rail reaches sells for {{rules.infrastructure.haulage.bonusPercent}}% more than the town price. Towns joined by routes you built also score at the end of the game ([The game](01-the-game.md)).

## Food and sleep on the road

A party out of town keeps itself. Two different things are spent, and they are mended two different ways:

- **Every figure eats {{rules.upkeep.food.perFigurePerRound}} food a round**, from what the party carries, forages or buys. A figure that ends the round unfed loses 1 health, and being fed again does not put it back. A pack of rations is an item whose wear is the days left in it: knock its ladder down a rung for every figure it feeds. Other food a party carries is a commodity, and a perishable one rolls the spoil die every round it is in the pack.
- **A night without a camp costs 1 strength** from every figure — a night leg, or a round ended without stopping. It stacks night on night, and at 0 strength a figure neither fights nor carries.
- **One night's sleep gives all the strength back**, wherever it is taken: a camp on open ground, a spent cave, or a bed. A camp costs nothing.
- **Sleep mends no health at all.** Health comes back only under medical aid: {{rules.rest.medicalAid.healerPerRound}} a round from a healer or at an infirmary, {{rules.rest.medicalAid.physicianPerRound}} a round from a physician character standing there, or a potion, drunk. Care costs {{rules.rest.medicalAid.cost.coin}} coin a round, waived in your own town. A resting figure does nothing else that round.

A figure at 0 health is carried to the nearest settlement and stays there until healed to half, and everything it was carrying is lost on the way — see [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

## Settlements and inns

The map prints settlements in four ranks — village, town, city and seat — and they belong to nobody. Every printed settlement has an inn of its rank; a town of your own has one when you build it. An inn does four things:

| At the inn | The rule |
| --- | --- |
| A bed | {{rules.rest.cost.coin}} coin a night, free in your own town. Restores strength in full and mends nothing |
| Hirelings | At any settlement of village rank or better: a thug, a militiaman or a hired blade escorts one journey — a party or a cargo — for a flat fee, eats nothing, and goes home. See [Monsters and battle](12-battle.md) |
| Rumours | Pay 5 coin and draw a quest card; accept it or decline it. See [Quests and campaigns](15-quests-and-campaigns.md) |
| Drinks | Serve ale or wine to clear the town's unrest. See [People, food and unrest](07-people.md) |

A settlement is also where you shop and sell: what a merchant deals, and how a town's rank sets its stock, is in [Trade and the market](09-trade-and-the-market.md). A vehicle is repaired at any settlement of town rank or better.
