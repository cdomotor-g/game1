# Events

Every round opens with the event deck. Each player turns a card, and the card says whose problem it is, what it does, and — on the disaster cards — what you could have bought to blunt it. This chapter is how the deck is drawn and how a card is read.

## Drawing

The Events phase is the first phase of the round ([The round](04-the-round.md)).

1. In turn order, each player reveals the top card of the event deck and resolves it in full before the next player draws.
2. From round {{events.deck.lateGame.round}}, the first player reveals and resolves a second card after their first.
3. When the deck runs out, shuffle the discard pile and carry on.

The deck is {{events.deck.totalCards}} cards; some cards are in it more than once, and a card's number of copies is printed on its page in Annex II, *Events*.

## Reading a card

A card carries its name, its category, its **scope**, a line of story, and then one or more sentences saying what happens, in order. Do what the sentences say, in that order.

| Scope | Who it hits |
| --- | --- |
| Global | {{events.scopes[id=global].summary}} |
| Local | {{events.scopes[id=local].summary}} |
| Targeted | {{events.scopes[id=targeted].summary}} |
| Offer | {{events.scopes[id=offer].summary}} |

- **A global card** is everyone's, whoever turned it.
- **A local card** hits one region of the board. Roll for the region.
- **A targeted card** hits the player who drew it — except a crime card, which hits the leader whoever drew it.
- **An offer** is a chance rather than a blow. The player who drew it decides first; if they pass, it goes round the table in turn order until somebody takes it or everyone has passed.
- **A choice** on a card names its branches. The player the card hits picks one and does what that branch says.

> **Open.** Neither how a region is rolled for nor who counts as the leader is settled. Until it is: number the board's regions and roll a die for one, and the leader is the player with the most victory points by the count in [The game](01-the-game.md), the first player breaking a tie.

A card that lasts — a frost for a round, a shortage for three, a widened monster band for two — stays face up beside the deck until its rounds have passed, and its effect stands through every phase in between. Mark the round it ends on.

## What a card can do

Cards do one or more of these, and each card's sentences say which:

- change how many hours workers roll, or step their dice;
- take commodities from a stockpile, or give some;
- move a family of commodities along its price row for some rounds;
- damage, halt or destroy a building;
- add wear to tools, or break them;
- add or take workers, or add unrest;
- block a route or slow travel;
- take or spoil cargo in transit;
- start a fight — raiders at a town, a wolf pack in a region, a dragon on a mountain;
- stall or advance growing crops;
- hurt or heal characters and figures on the road;
- widen or shrink the monster bands of the discovery tables.

A price move from a card is taken in the Events phase and written in the ledger's move box like any other ([Trade and the market](09-trade-and-the-market.md)). A fight from a card is run on the encounter board like any other ([Monsters and battle](12-battle.md)). A widened or shrunk monster band is applied to every discovery roll while the card stands ([Discovery and encounters](11-discovery.md)).

## Categories

| Category | What it brings |
| --- | --- |
| Weather | Frost, drought, storms and long summers: the seasons turning |
| Natural disaster | Flood, earthquake, wildfire, a mine collapsing |
| Crime | Heists, robbery on road and rail, piracy, a smuggler's offer |
| Wildlife | A wolf pack, a boar in the crops, a dragon sighted, the Quiet Season |
| Conflict | Raiders, a border dispute, mercenaries for hire |
| People | Plague and the other illnesses, migrants, strikes, festivals |
| Market | Shortages, a glut, foreign demand, a tax levy |
| Industry | A bad smelt |
| Arcane | Ley surges, a curdled brew, a wandering wizard, the Blood Moon |

Weather and market cards are the common ones. Crime hits whoever is ahead.

## Illness

Four cards make people sick, in order of reach: Camp Fever hits one travelling party, Marsh Ague one region, the Grey Pox every sizeable town on the map, and Plague a region hard. Each one names what blunts it, and it is always one of three things:

- a **Healing Draught** or a **Physic Tonic** in stock, spent;
- an **infirmary** with a fed **healer** in the town, which loses no worker to Marsh Ague or the Grey Pox and one worker fewer to any illness;
- the right **character** in the party — a physician shrugs off Camp Fever.

Tend the Sick, the healer's job at the infirmary, cures an illness marker after the fact ([People, food and unrest](07-people.md)).

## What could have prevented it

Every disaster card lists at least one thing a player could have bought in advance: brick houses ignore a frost, a well rides out a drought, a watchtower cancels one heist a game, an escort turns a robbery, a palisade and a garrison meet raiders at the gate. Those mitigations are not printed on the card. They are printed with every card in Annex II, *Events*, and gathered into one table in Annex I, *What could have prevented it*. If a card wipes you out, that table is where you find the name of the building you did not put up.
