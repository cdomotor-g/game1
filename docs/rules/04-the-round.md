# The round

A game is {{rules.victory.gameLengthRounds}} rounds, and every round is the same six phases in the same order: the event cards come out, the workers roll for hours, the players spend them, the world moves on a step, everybody eats, and the market fixes next round's prices. This chapter is the order of play. Each phase points to the chapter that holds its full rules.

{{fig:plate:event-hard-frost,plate:tile-granary,plate:tile-market,plate:character-chr-07|frieze}}

## The six phases

| Phase | What happens | Who, and in what order |
| --- | --- | --- |
| 1. Events | Each player reveals an event card and resolves it | Every player, in turn order |
| 2. Labour Roll | Every worker's die is rolled; the pips are this round's hours | Every player, together, in the open |
| 3. Actions | Hours, coin and commodities are spent: allocate, build, move, trade, forage, fight | One turn each, in turn order |
| 4. Production Tick | Every progress track advances one step | Everything on the table, all at once |
| 5. Feeding | Every town pays food; then the spoil die is rolled | Every town, then every player |
| 6. Market | The market is rolled for every column on the ledger | One player rolls for the whole table |

{{fig:board:player|wide|The player board, with the six phases printed under THE ROUND.}}

The same list is printed on every player board under THE ROUND, so nobody has to hold it in their head.

## Turn order

{{fig:card:CHR-01,card:CHR-02,card:CHR-03,card:CHR-04|Four seats at the table; the first player moves one to the left each round.}}

Turn order runs to the left, clockwise, from the first player. Anything done "in turn order" — revealing event cards, taking turns in the Actions phase, passing an offer round the table, buying from the board — starts with the first player and goes left from there.

At the end of every round, once the Market phase is done, **turn order passes to the left**: the player on the first player's left is first player for the next round. The player who traded last this round trades first in the next.

> **Open.** Nothing yet says who is first player in round 1. Until it does, settle it however the table likes at setup; from then on the first player moves one seat to the left every round.

## 1. Events

1. Starting with the first player, each player in turn order turns over the top card of the event deck, reads it out and resolves it before the next player draws. Each player reveals {{events.deck.drawPerPlayerPerRound}} card.
2. The card's **scope** says who it hits, whoever drew it. A *global* card hits every player. A *local* card hits one region of the board: roll for the region. A *targeted* card hits the player who drew it — except a crime card, which hits the leader. An *offer* is decided by the drawer first; if they pass, it goes round the table in turn order.
3. From round {{events.deck.lateGame.round}}, the first player reveals and resolves a second card as well.
4. When the deck runs out, shuffle the discard pile and carry on.

{{fig:card:EVT-02,card:EVT-05,card:EVT-17,card:EVT-24|Four scopes: a global drought, a local flood, a raid on the leader, an offer.}}

Events come before anything else in the round so that you plan around them, rather than being punished for a plan you have already committed to. What each card does, what a region is, who the leader is and what would have softened the blow are in [Events](10-events.md).

## 2. Labour Roll

{{fig:plate:people-dwarf|margin|A dwarf rolls in the open like anyone else; at a mine the die steps up.}}

Every worker rolls {{rules.effort.dicePerWorker}} die. The pips are hours of **effort**, the currency you spend in the next phase.

- The ordinary worker's die is a {{rules.effort.dieDefault}}. Some peoples, some jobs and some cards step it along the ladder {{rules.effort.dieLadder}}.
- Specialists roll like any other worker. Soldiers roll nothing: they eat and they fight, but they do not work. A character or hero figure is not a worker and rolls no effort die.
- Roll in the open. Everyone sees how good everyone else's round is going to be, which matters when you sit down to trade.
- Hours belong to the town whose workers rolled them. Effort is not a commodity: it cannot be stored, traded, stolen or carried to another town.
- What steps a die up or down the ladder, what adds flat hours, what grants an extra die, and the order they stack in are in [Effort and jobs](05-effort-and-jobs.md).

**Unspent hours are gone at the end of the round.** There is no banking a quiet round to fund a loud one.

## 3. Actions

In turn order, each player takes one **turn**: they spend their hours, their coin and their commodities, doing as much as they can afford in whatever order they like, and then play passes to the left. A round holds one turn per player. A turn can hold any mix of these:

- **Allocate** hours to jobs — a recipe run at a site, with the tool, the inputs and the worker it needs. [Effort and jobs](05-effort-and-jobs.md)
- **Build** — found a site, paying its materials in full, and put hours into it as build points. [Effort and jobs](05-effort-and-jobs.md)
- **Move** a figure, a party, a vehicle or a cargo: one day leg, and a night leg after it if you carry a lit torch or lantern. A discovery roll is made where every leg ends. [The map and travel](08-the-map-and-travel.md), [Discovery and encounters](11-discovery.md)
- **Trade** — with the board, at the price the ledger shows, or with another player at whatever the two of you agree. [Trade and the market](09-trade-and-the-market.md)
- **Forage**, hunt, survey and prospect — jobs done on the ground rather than in a building. [Effort and jobs](05-effort-and-jobs.md), [Discovery and encounters](11-discovery.md)
- **Fight**, or refuse to — the monster the road turned up, a town somebody else owns, or in defence of your own. [Monsters and battle](12-battle.md)

{{fig:plate:item-lantern|margin|A lit lantern buys a night leg after the day's, and wears a point for it.}}

Three things to hold onto while you take a turn:

- The price you trade at is the one already written on the ledger. The board sells at most as many of a commodity as its red supply dice rolled last Market phase, first come first served in turn order, and it buys any quantity. [Trade and the market](09-trade-and-the-market.md)
- Every unit of a finite commodity you **burn** — in a furnace, in an engine, in a recipe — puts a pip on its depletion grid then and there, in your turn. Trading it puts none.
- When a leg ends, the discovery roll is made at once, and whatever it turns up is dealt with in the middle of your turn, not saved for later.

## 4. Production Tick

{{fig:plate:tile-winery|margin|Wine in the barrel comes one round closer; nobody chooses anything.}}

Nothing is chosen in this phase. Every progress track on the table advances one step, all at the same time:

- **Construction.** Every building site counts another round towards its minimum. A site whose build points are all in and whose minimum rounds have passed is a finished building. [Effort and jobs](05-effort-and-jobs.md)
- **Crops.** Every growing crop advances one step on its growth track. A crop at the end of its track is ripe; harvesting it is a job, next round. [Commodities, recipes and buildings](06-the-economy.md)
- **Maturing goods.** Wine in the barrel, livestock breeding in the pasture — anything a recipe says takes rounds — comes one round closer, and what has waited its full time is ready. [Commodities, recipes and buildings](06-the-economy.md)
- **Transport.** Cargo in transit advances along its route at its mode's speed. [The map and travel](08-the-map-and-travel.md)

## 5. Feeding

1. Every town pays {{rules.population.foodPerWorkerPerRound}} food per worker — specialists and soldiers included — from food held in that town, and nowhere else — see [People, food and unrest](07-people.md). You choose which food commodities to pay with.
2. Every worker who cannot be fed gives the town {{rules.population.starvation.unrestPerUnfedWorker}} unrest. At {{rules.population.starvation.unrestToRiot}} unrest the town riots.
3. A town fed from {{rules.population.foodVarietyBonus.threshold}} or more different food commodities in the same Feeding phase earns the variety bonus: one extra hour for every worker there next round.
4. Figures on the road eat too. Every figure that is not in a town being fed by it eats {{rules.upkeep.food.perFigurePerRound}} food from what its party carries, and a figure that goes unfed loses 1 health. Sleep is the other half of a traveller's upkeep: a party that made camp has its strength back, and a party that did not has lost some. [The map and travel](08-the-map-and-travel.md)

{{fig:plate:tile-dock|margin|The dock's catch faces the ochre spoil die whoever is holding it.}}

At the end of the phase, two more things happen:

- Storage overflows. Anything a town holds above its storage capacity is lost: half of it, rounded up. [Effort and jobs](05-effort-and-jobs.md)
- Every player rolls the ochre **spoil die** once for every perishable stack they hold — in a town, in a hold or on a figure's back — and discards what the spoil strip says. Grown, bought, looted or found makes no difference to a fish. The board's own stock never spoils; the board is not holding it, it is selling it. [Trade and the market](09-trade-and-the-market.md)

Feeding is the deadline every other decision is measured against: you can spend the whole round on a steelworks, but the workers still want feeding at the end of it.

## 6. Market

{{fig:board:ledger|half|The price ledger: a row a round, the old price struck through, the move boxed.}}

Nobody trades in this phase. It fixes the price everybody will trade at **next** round, so that you act on a price you can see and find out afterwards what your acting did to it.

1. One player rolls for the whole table. The market's dice are shared, not one set per player.
2. For each column on each ledger in play, roll {{pricing.dice.sets[id=demand].count}} blue dice for **demand**, {{pricing.dice.sets[id=supply].count}} red for **supply** and {{pricing.dice.sets[id=volatility].count}} green for **volatility**. Read the green die on the volatility strip printed on the market board: it adds {{pricing.volatility.steps[id=slack].label}}, {{pricing.volatility.steps[id=even].label}} or {{pricing.volatility.steps[id=rough].label}}.
3. Add the commodity's own **modifier**. A finite good adds the lowest number still showing on its depletion grid. A sought good adds the move written in the box on the row above. A staple or a perishable adds nothing.
4. The net is Demand − Supply + Volatility + Modifier, and the whole sum is addition: nothing multiplies, nothing is halved, nothing rounds. Find the net on the swing ruler on the market board; it says how many places to step. Step the price that many places along the commodity's printed row of six prices. A price at either end of its row that is told to go further stays where it is.
5. Fill the new price into the ledger's row for this round, strike the old one through, and write the move in the row's move box: a signed figure, or a dash if the price held.
6. Remember the red total for each column: it is also how many of that commodity the board will sell before the next Market phase.
7. Turn order passes to the left.

{{fig:board:market|wide|The market board carries the volatility strip and the swing ruler the net is read on.}}

The swing ruler, the four kinds of good, the spread, and every commodity's row of six prices are in [Trade and the market](09-trade-and-the-market.md) and Annex I, *The market and every price*. In round 1, before any market has been rolled, prices stand where setup put them — see [Setting up](03-setting-up.md).

## The end of the round

{{fig:plate:talisman-tal-06|margin|Mana with nowhere to sit blows away; a phylactery is somewhere for it to sit.}}

When the Market phase is done, before the next round's cards come out:

- Unspent hours are gone.
- Mana gained this round with nowhere to hold it blows away. [Mana, talismans, spells and potions](13-magic.md)
- The new first player opens the next round's Events phase.
- The ledger's rows are numbered by round down its left-hand edge, so the next empty row is the round you are about to play.

## The end of the game

{{fig:plate:tile-manor|margin|A manor is still standing when the last Market phase is done, and scores.}}

The game ends when round {{rules.victory.gameLengthRounds}}'s Market phase is done. Stop there and score — how is in [The game](01-the-game.md).
