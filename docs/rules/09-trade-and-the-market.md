# Trade and the market

A price is written on a ledger, moved once a round by dice, and read off a printed row of six figures. This chapter is the two ways to trade, how the Market phase fixes a price, what the four kinds of good do to it, who may deal with whom, and how goods are moved across the map.

{{fig:plate:event-piracy,plate:vehicle-veh-06,plate:tile-warehouse,plate:tile-dock|frieze}}

## Two kinds of trade

{{fig:plate:tile-market|margin|A market is yours once built; every printed settlement keeps one.}}

**With the board.** At any market you may buy or sell a commodity at the price the ledger shows, paying the house cut: buying costs {{pct:rules.market.buySpread}} over the price and selling pays {{pct:rules.market.sellSpread}} under it. The board sells at most as many units of a commodity as this round's red dice rolled for it, first come first served in turn order through the Actions phase; it buys any quantity. A market is your own once you have built one, and every printed settlement keeps one.

**With another player.** Any goods, any coin, any price the two of you agree, with no spread and no limit. Two players trade whenever they can reach each other — heroes or merchants standing in the same hex or settlement, or trading houses joined by a route, below. Nobody enforces a bargain but the table.

Trading is an action, taken in the Actions phase at the price everyone can already see. Nobody trades in the Market phase; that phase only fixes the price for next round.

## The price ledger

{{fig:board:ledger|half|The price ledger: a column a commodity, a row a round; the last unstruck figure is the price.}}

Every town whose market you use has a ledger: one column per commodity, headed by that commodity's token, one row per round. The figure in the last row that has not been struck through is the price now. Every commodity's six possible prices are printed as one row in Annex I, *Every price in the game* — grain's row is 3 · 4 · 5 · 6 · 8 · 10 — and a price is always one of those six figures. Nothing is ever multiplied at the table.

At setup every good stands on the middle figure of its row, its base value, and nothing is written. How the ledger is filled in, struck through and read is in [On the table](02-on-the-table.md).

## The Market phase

{{fig:board:market|wide|The market rules sheet: the swing ruler and one panel for each kind of good.}}

In the Market phase one player rolls for every column on every ledger in use. For each column:

1. **Roll** {{pricing.dice.sets[id=demand].count}} blue dice for demand, {{pricing.dice.sets[id=supply].count}} red for supply and {{pricing.dice.sets[id=volatility].count}} green for volatility.
2. **Add up the swing:** demand minus supply, plus what the green die says, plus what the kind of good adds.
3. **Find the net on the swing ruler** and step the price that many places along the commodity's printed row. A price at the top of its row told to go up stays where it is; the same at the foot.
4. **Write the new figure** in this round's row, strike last round's through, and write the move in the move box: how many places it stepped, or a dash if it held.

| Green die | Season | Adds |
| --- | --- | --- |
| 1–2 | Slack | {{pricing.volatility.steps[id=slack].label}} |
| 3–4 | Even | {{pricing.volatility.steps[id=even].label}} |
| 5–6 | Rough | {{pricing.volatility.steps[id=rough].label}} |

| Net | {{pricing.ruler.bins[id=crash].label}} | {{pricing.ruler.bins[id=slump].label}} | {{pricing.ruler.bins[id=soften].label}} | {{pricing.ruler.bins[id=hold].label}} | {{pricing.ruler.bins[id=firm].label}} | {{pricing.ruler.bins[id=rally].label}} | {{pricing.ruler.bins[id=spike].label}} |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Places | {{pricing.ruler.bins[id=crash].move}} | {{pricing.ruler.bins[id=slump].move}} | {{pricing.ruler.bins[id=soften].move}} | hold | +{{pricing.ruler.bins[id=firm].move}} | +{{pricing.ruler.bins[id=rally].move}} | +{{pricing.ruler.bins[id=spike].move}} |

The whole sum is addition, and the dice are the same two colours a battle uses: blue is what you want, red is what stands in your way. A commodity is not rolled for until its token stands in a ledger seat, and a town rolls only for the goods on its own ledger.

{{fig:plate:event-iron-shortage,plate:event-glut,plate:event-foreign-demand|Three cards that step a price along its row in the Events phase.}}

An event card that moves a price — an iron shortage, a glut, a festival — steps it along the row as the card says, in the Events phase, and the move goes in the move box like any other. A card that holds a price for some rounds keeps it there through the Market phases in between.

## The four kinds of good

Every commodity is exactly one of four kinds, and the mark in the corner of its token says which. Which commodity is which is in Annex I, *Commodities*.

### ![staple](../art/icons/pricing-staple.svg) Staple

{{fig:plate:tile-quarry|margin|Stone is a staple; the dice are the whole story.}}

Adds nothing. The dice are the whole story, and more than half the goods in the game are staples: stone, lumber, cloth, rope, ale, salted meat.

### ![perishable](../art/icons/pricing-perish.svg) Perishable

{{fig:plate:tile-granary|margin|A stack in a granary reads one row up the spoil strip.}}

Adds nothing to the swing either. Instead, at the end of every Feeding phase, every player rolls the ochre **spoil die** once for each stack of a perishable they hold — in a town, in a hold, in a pack — and discards what the strip says:

| Ochre | Keeps well | Keeps poorly |
| --- | --- | --- |
| 1–2 | {{pricing.spoil.steps[0].keepsWell}} | {{pricing.spoil.steps[0].keepsPoorly}} |
| 3–4 | {{pricing.spoil.steps[1].keepsWell}} | {{pricing.spoil.steps[1].keepsPoorly}} |
| 5–6 | {{pricing.spoil.steps[2].keepsWell}} | {{pricing.spoil.steps[2].keepsPoorly}} |

Bread, vegetables and apples keep well; milk, fish, meat, eggs, berries, mushrooms, grapes and moon blossom keep poorly — the *Commodities* table in Annex I says which column each reads. You cannot lose more than you hold. A stack in a **granary** reads one row up the strip: a 5 or a 6 costs what a 3 or a 4 costs, and a 1 or a 2 costs nothing. The board's own stock never spoils, and spoilage never touches a price.

### ![finite](../art/icons/pricing-deplete.svg) Finite

{{fig:board:depletion|half|The depletion sheet: a pip for every unit burnt, and the lowest figure showing is what the good adds.}}

Adds the lowest number still visible on its **depletion grid**. Stand the commodity's token in an empty grid's seat the first time a unit of it is burnt. Every time a unit is burnt — as fuel, as an input consumed by a recipe — the player who burnt it covers the lowest uncovered cell with a pip, in the Actions phase, as it happens. Pips never come off. Every {{pricing.depletion.per}} pips the grid reads {{pricing.depletion.step}} higher, up to {{pricing.depletion.top}}; a fresh grid reads 0. Trading a finite good moves it and covers nothing: only burning counts.

### ![sought](../art/icons/pricing-hype.svg) Sought

Adds the move it made last round: the figure in the move box on the row above, from {{pricing.sought.from}} to +{{pricing.sought.to}}. A dash adds nothing. Nothing has moved at setup, so the first round is played on the dice alone; a rise feeds a rise and a fall feeds a fall, and two quiet rounds bring it back to nothing.

## Who may trade with whom

{{fig:plate:tile-trading-house|margin|A trading house drops the spread for good and reaches along any built route.}}

- **A market** lets its town buy from and sell to the board at the ledger price, with the spread.
- **A merchant figure** trades without the spread wherever it stands, and may deal with any player whose merchant or trading house is in or beside the same settlement.
- **A trading house** removes the spread for its owner in that town for good, and reaches any other player's trading house or merchant along a built route, at any distance. Broker a Trade is the job that does it, one hour at the trading house.
- **A merchant specialist**, trained at a trading house, may also broker a deal between two other players and take a tenth of the coin. A merchant wearing fine robes gets a tenth more on every sale.

## Shopping

{{fig:card:ITM-04,card:ITM-01,card:ITM-06,card:ITM-08|A roadside merchant's stock: item cards dealt face up at base value plus a tenth.}}

Items are bought from **merchants**, met on the road or visited in any settlement. Shuffle the items deck and deal cards face up: that is the stock this visit, at base value plus a tenth.

| Where | Cards dealt |
| --- | --- |
| A merchant met on the road | {{rules.market.merchantStock.roadside}} |
| A village | {{rules.market.merchantStock.village}} |
| A town | {{rules.market.merchantStock.town}} |
| A city | {{rules.market.merchantStock.city}} |
| The seat | {{rules.market.merchantStock.seat}} |

Weapons, armour and talismans are dealt from their own decks the same way. Tools are bought at any settlement of town rank or better with a blacksmith: deal from the tools deck instead. A vehicle is bought where its kind is built — [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

## Moving goods

{{fig:plate:vehicle-veh-09,plate:vehicle-veh-14,plate:vehicle-veh-02,plate:vehicle-veh-16|Caravan, ship, train and airship; capacity is bulk and speed is pace.}}

A commodity moves between towns as cargo, on a route, by one of eight modes. Capacity is bulk; speed is the pace in [The map and travel](08-the-map-and-travel.md).

| Mode | Carries | Needs | Costs to buy | Eats a round |
| --- | --- | --- | --- | --- |
| Porter | {{transport.modes[id=porter].capacity}} | a worker, gone for the whole journey | nothing | — |
| Cart | {{transport.modes[id=cart].capacity}} | nothing; a horse hitched adds 1 pace | {{transport.modes[id=cart].buyCost}} | — |
| Caravan | {{transport.modes[id=caravan].capacity}} | a road; two horses add 1 pace | {{transport.modes[id=caravan].buyCost}} | {{transport.modes[id=caravan].upkeep}} |
| Barge | {{transport.modes[id=barge].capacity}} | a dock | {{transport.modes[id=barge].buyCost}} | {{transport.modes[id=barge].upkeep}} |
| Ship | {{transport.modes[id=ship].capacity}} | a harbour | {{transport.modes[id=ship].buyCost}} | {{transport.modes[id=ship].upkeep}} |
| Train | {{transport.modes[id=train].capacity}} | a rail depot; {{transport.modes[id=train].fuelPerTile[0].qty}} coal a hex | {{transport.modes[id=train].buyCost}} | {{transport.modes[id=train].upkeep}} |
| Sled | {{transport.modes[id=sled].capacity}} | nothing; the team eats 2 meat a round on the road | {{transport.modes[id=sled].buyCost}} | {{transport.modes[id=sled].upkeep}} |
| Airship | {{transport.modes[id=airship].capacity}} | nothing; {{transport.modes[id=airship].fuelPerTile[0].qty}} charcoal a hex | {{transport.modes[id=airship].buyCost}} | {{transport.modes[id=airship].upkeep}} |

Upkeep is coin, paid each round the vehicle is in use. A named vehicle card runs as its mode with its own hull and hold: [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

### Loading and routes

{{fig:flow:town-hall|third|Load Cargo is a job at the town hall, one hour plus the mode's own loading effort.}}

1. **Load Cargo** is a job at the town hall: one hour, plus the mode's own loading effort — {{transport.modes[id=porter].effortToLoad}} for a porter or a cart, {{transport.modes[id=caravan].effortToLoad}} for a caravan, {{transport.modes[id=ship].effortToLoad}} for a ship. The goods leave the stockpile and go on the vehicle's board, or on a cargo token for a mode with no card.
2. **Packaging goes with it.** Every mode needs crates or sacks from the stockpile — two sacks for a porter, two crates and two sacks for a cart, twelve crates for a ship; the full list is in Annex I, *Transport modes*. They travel with the cargo and come back with the empty vehicle.
3. **Choose a route.** A route starts and ends at a settlement, and every hex on it must be one the mode can cross. A cart or a caravan runs at road pace on a road; a train needs rail on every hex. A route that meets water needs a bridge, or the cargo changes to a barge or a ship at a dock or a harbour.
4. **Move it a leg a round.** Cargo in transit is on the map for everyone to see, and can be robbed by event cards and raided by players. Where it ends a leg it rolls for discovery like any traveller.
5. **Arriving cargo goes into the destination's stockpile** at the Production Tick. If there is no room for it, it spoils.

{{fig:plate:event-caravan-robbery|margin|Cargo in transit is on the map for everyone, and cards rob it; an escort drops the risk to nothing.}}

An escort — a soldier, or a hireling from an inn — drops a cargo's theft risk to nothing, and eats every round of the journey. A porter is a worker, and it rolls no effort until it is home.

Coin is cargo too, when there is enough of it to matter: on a figure's back it weighs {{rules.carrying.coin.perKg}} to the kilogram ([Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md)); in a strongbox on a wagon it is bulk, and it is stolen like anything else on the road.
