# The game

This is a game of turning hours into a town and a town into a fortune, on a drawn continent you travel, trade across and fight in. It runs for {{rules.victory.gameLengthRounds}} rounds in one of two modes: free play, where each player builds and scores against the others, or a campaign, where the table plays one story together and wins or loses as one. This chapter says what the game is, who plays it, how long it lasts and what winning means.

## What the game is

Workers live in houses. Each round every worker rolls a die, and the pips are hours of effort. You spend those hours on jobs: felling trees, digging clay, minding a furnace, raising a wall. A job needs a place, usually a tool, and usually something to work on. At the end of the round everybody has to eat, and every worker you cannot feed turns into unrest. Everything else in the game — trade, roads and rail, magic, war — is a way of getting more hours, better hours, or more out of each hour.

Around your town lies a continent. Your hero and your figures travel it by day and, with a light, by night. Each time a leg of travel ends you roll to see what you found there, and the map fills in as it is walked. Monsters can be slain, run from, befriended, enslaved or tamed; a slain monster yields mana, which talismans hold and spells spend. Quests arrive and may be accepted or declined. Named ships, trains, caravans and horses carry your cargo, and named characters carry your name. The economy is still the engine of all of it: the adventure is a new set of ways to spend hours and new things the hours can buy.

Three ideas run through every chapter that follows.

- **Effort is the real currency.** Coin is useful; hours are scarce. Effort is rolled fresh each round, spent during your turn, and gone at the end of it — it cannot be stored, traded or carried over. See [Effort and jobs](05-effort-and-jobs.md).
- **Nothing on a card moves.** A card prints its maximums once, in the lettered strip across its top; everything that goes up and down is a token on a track of your player board, and the letters are the same in both places: H health, S strength, P pace, M mana, W wear. See [On the table](02-on-the-table.md).
- **Blue is what you want and red is what stands in your way.** A market price and a battle are the same sum, two blue dice against two red, and a player who has rolled one has already learned the other. See [Trade and the market](09-trade-and-the-market.md) and [Monsters and battle](12-battle.md).

## Players

Free play is for two to five players. A campaign says how many it seats: Homer's Odyssey takes {{campaigns.campaigns[id=homers-odyssey].players.min}} to {{campaigns.campaigns[id=homers-odyssey].players.max}}.

Each player has a hero on the map, named by one of the {{count:characters.characters}} character cards; a player board that hero's card sits in; a starting town with its workers; and the purse of coin its character card prints. Setting all of it out is [Setting up](03-setting-up.md).

The table also keeps one spare player board. When a monster or a stranger is met on the road, its card is dealt onto that board and it is played, for as long as the meeting lasts, by the player on the left of whoever met it — a seat at the table that happens not to be a person. See [Discovery and encounters](11-discovery.md).

## Length

A game is {{rules.victory.gameLengthRounds}} rounds. Every round is the same {{count:rules.round.phases}} phases in the same order — Events, Labour Roll, Actions, Production Tick, Feeding, Market — and each is described in [The round](04-the-round.md). Turn order runs clockwise and passes one seat to the left at the end of every round, so nobody goes first twice running.

## Coin

The money of the game is {{rules.currency.name}}, written {{rules.currency.symbol}}. It buys tools, figures, hirelings, beds, care and goods; it pays tolls on other people's roads; and it is what the market gives you for what you sell.

Coin is not weightless. It goes on the same scales as a sword or a coil of rope, {{rules.carrying.coin.perKg}} coin to the kilogram, and counts against what a figure can carry like anything else. A purse is nothing; a fortune has to be carried home, or sent home in a strongbox on a wagon as cargo. See [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

Coin is not the score. None of the ways of winning below counts it.

## The two modes

| | Free play | Campaign |
| --- | --- | --- |
| The board | Any board | The board the campaign names |
| Your character | Each player deals or picks one | The campaign's cast, dealt as the campaign says |
| The decks | Every deck shuffled | The campaign deck stacked in order; every other deck shuffled |
| Who wins | Each player scores for themselves | The table wins or loses together |
| How | The three victory conditions below | The campaign's own victory |

### Free play

Choose a board. Each player deals or picks a character. Shuffle every deck. Play {{rules.victory.gameLengthRounds}} rounds and score.

Everything a campaign brings with it — its characters, its monsters, its board — is in the free-play decks too, and each of those cards is exactly what it says it is. Such a card carries the campaign's mark beside its card code, in the top right corner, so you can see at a glance which story it came from and so a table setting out a campaign can pull its cast from the decks by the corner alone. The mark changes nothing about how the card plays.

### Campaign

A campaign lays a storyline over the same game. One campaign is chosen at setup. It names its board, it deals its cast, and its cards are read in order rather than shuffled: a card is turned when the story reaches it, and it says where the party is and what happens there. The economy, the market, travel and battle run exactly as in free play.

A campaign is played together. The table brings the story home or it does not, and nobody scores against anybody. A chapter the table fails is replayed from its first line, keeping whatever the party has already lost, because the story has one ending and the table is learning it, not writing it.

Choosing a campaign, setting it out, reading a card and replaying a chapter are in [Quests and campaigns](15-quests-and-campaigns.md). The campaigns themselves, with every card of the deck, begin at Annex III. There is {{count:campaigns.campaigns}} so far: Campaign I is Homer's Odyssey, {{campaigns.campaigns[id=homers-odyssey].subtitle}}.

## The object of the game

### In free play

When the last round ends, count victory points. They come from {{count:rules.victory.conditions}} conditions, and each scores separately, so a mining-and-rail game and a farming-and-trade game can both end in a win.

| Condition | What it counts |
| --- | --- |
| Prosperity | Your fed population, your completed buildings, and the luxury goods you hold at game end |
| Industry | The depth of your longest completed production chain, and each tier-3 good you produced |
| Network | The towns joined by road, rail and sea routes you built |

Where a thing carries a victory-point value of its own, that value is printed on it and is counted as printed.

| Printed on | Points | Counted |
| --- | --- | --- |
| A finished Manor | {{buildings.buildings[id=manor].victoryPoints}} | At game end |
| A finished Trading House | {{buildings.buildings[id=trading-house].victoryPoints}} | At game end |
| A finished Harbour | {{buildings.buildings[id=harbour].victoryPoints}} | At game end |
| A finished Shrine | {{buildings.buildings[id=shrine].victoryPoints}} | At game end |
| Each hex of rail | {{buildings.buildings[id=rail].victoryPointsPerTile}} | As it is laid |
| Fine Robes | 2 | Held at game end |
| A Greatsword | 1 | Held at game end |
| A Crystal Phylactery | 1 | Held at game end |
| An enchanted object | 1 per 4 mana bound into it, rounded down | Held at game end |
| A quest whose reward says so | As the card says | When the quest is completed |

> **Open.** How many points a fed worker, a unit of luxury goods, a production chain, a tier-3 good or a connected town is worth is not yet decided, and neither is whether the three conditions are added into one total or each names its own winner. Until it is, count the printed points in the table above, add them into one total, and the highest total wins.

### In a campaign

There are no victory points and the three conditions are not scored. The campaign states its own victory, and the table reaches it together or not at all. In Homer's Odyssey the table wins when the last chapter is turned and finished — Odysseus stands in Ithaca, the suitors are dead, Penelope has known him by the bed, and Athena has made the peace — within {{campaigns.campaigns[id=homers-odyssey].length.rounds}} rounds. If the last round ends before the last chapter does, the story has not been brought home.
