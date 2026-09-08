# Setting up

Free play is set up in three passes. The table lays out a board and the shared sheets; each player chooses a people, takes a character, founds a town and sets a hero on a player board; then every deck is shuffled. Nothing is written on a ledger until the first Market phase. A campaign begins with the same setup and then follows its own chapter, [Quests and campaigns](15-quests-and-campaigns.md).

{{fig:plate:character-chr-04,plate:tile-hut,plate:item-bag,plate:tile-well|frieze}}

## The table

{{fig:board:market,board:depletion,board:ledger|The shared sheets laid out fresh: market board, depletion sheet, a ledger with every seat empty.}}

{{fig:map:korvane-reach|wide|The Korvane Reach and its nineteen printed settlements, belonging to nobody.}}

1. **Choose a board and lay it out.** Any board will do in free play. The first is *The Korvane Reach*: a north-facing continent with an ice waste along the top, a wooded west, a dry south and a mountain spine, carrying nineteen printed settlements — one seat, two cities, eleven towns and five villages, four of them harbours. Printed settlements belong to nobody. They are where you rest, hire, shop and sell; what each rank offers is in [The map and travel](08-the-map-and-travel.md) and [Trade and the market](09-trade-and-the-market.md).
2. **Read the ground off the letters.** On a drawn map every hex's terrain is printed, and the letter in its corner is the ruling. Nothing on a drawn map is face down except the deposit tokens, below. A table playing on loose hex tiles instead deals every tile beyond the starting clusters face down; a prospector flips them, as chapter 08 describes.
3. **Lay the market board where everyone can read it,** with a fresh depletion sheet beside it. Nothing ever stands on the market board. The depletion sheet takes pips that are never lifted off, so it is printed new for every game.
4. **Lay a price ledger for each town you expect to trade in.** A ledger names no commodity: a column belongs to a good only once its token stands in the seat at the head of that column. Leave every seat empty for now. Ledgers are written on, so use fresh sheets and keep a spare.
5. **Put the dice in the middle.** The market dice are two blue, two red, one green, one ochre and one purple. The effort dice are a d6 for every worker at the table and a d8 for every orc worker, with a shared d4, d8, d10 and d12 for anything that steps a die up or down. Keep a d6 for surveys and a d20 for discovery.
6. **Sort the tokens:** commodity tokens by kind, coin by size, bars and pips, route tokens by player colour, and the building tiles by building.

## Each player

Take these steps in order. Each one reads off the step before it.

### Choose a people

{{fig:plate:people-human,plate:people-dwarf,plate:people-elf,plate:people-halfling|Humans, dwarves, elves and halflings; the orc's plate is not yet drawn.}}

Your people decides how many workers you start with and what die each of them rolls, and its traits apply to every worker and figure of yours for the whole game. The full trait list is in Annex I, *Peoples, traits and professions*; the two numbers you need now are here.

| People | Starting workers | Effort die |
| --- | --- | --- |
| Humans | {{peoples.peoples[id=human].startingWorkers}} | {{peoples.peoples[id=human].effortDie}} |
| Dwarves | {{peoples.peoples[id=dwarf].startingWorkers}} | {{peoples.peoples[id=dwarf].effortDie}} |
| Elves | {{peoples.peoples[id=elf].startingWorkers}} | {{peoples.peoples[id=elf].effortDie}} |
| Halflings | {{peoples.peoples[id=halfling].startingWorkers}} | {{peoples.peoples[id=halfling].effortDie}} |
| Orcs | {{peoples.peoples[id=orc].startingWorkers}} | {{peoples.peoples[id=orc].effortDie}} |

Take that many worker pieces in your colour, your route tokens, and four bars and four pips for your board.

### Take a character

{{fig:plate:character-chr-01,plate:item-travelling-cloak,plate:character-chr-05,plate:item-war-axe,plate:character-chr-08|Corin Vale with his cloak, Ruk with his war axe, Old Mother Keswick.}}

Deal one card from the character deck, or pick one; the table decides which way before anyone looks. Every card in the deck is playable in free play, including the cast a campaign brought with it. The card gives your hero a name, a face, a calling, their traits and a summary strip across the top: **H** health, **S** strength, **M** mana held in the body, **{{rules.currency.symbol}}** coin, and **KG**, the most your hero can carry.

Some characters are dealt an item with the card — Corin Vale's travelling cloak, Ruk's war axe, Old Mother Keswick's bone charm. Find it in the items, weapons or talismans deck and take it now. Then shuffle the rest of the character deck and set it aside face down: strangers met on the road are dealt from it.

### Take your coin

{{fig:card:CHR-01|margin|Corin Vale's card; the coin box in the strip is the purse you take.}}

Take coin equal to the **{{rules.currency.symbol}}** box on your card. Corin Vale starts with {{characters.characters[id=corin-vale].startingGold}}, Tilly Goodbarrel with {{characters.characters[id=tilly-goodbarrel].startingGold}}, Old Mother Keswick with {{characters.characters[id=mother-keswick].startingGold}}. That box stands in for the {{rules.currency.startingAmount}} coin a town begins with when no hero is in play. Coin is one pool: it lies in your town until your hero carries it out, and from then on it weighs like everything else on their back — see [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

### Set your player board

{{fig:board:player|wide|The board set: card in the recess, H and S from the strip, P and M at nought.}}

Take a player board. Every board is identical; who is sitting behind it is printed on the card in the recess.

1. Lay the character card in the IN PLAY recess.
2. **H** — put a bar on the health track at the figure in the H box.
3. **S** — put a bar on the strength track at the figure in the S box.
4. **P** — put a bar on the pace track at 0. Pace is set when a leg begins and walked down as hexes are entered.
5. **M** — put a bar on the mana track at 0. Nobody starts holding mana; it is won from slain monsters and from some quests. The M box on your card, plus the M box of every talisman in a kit slot, is the most the track may ever climb to.
6. Lay any card dealt with your character in a kit slot. If it has a **W** box, put a pip on the wear ladder beside that slot at the W figure — the travelling cloak's is {{items.items[id=travelling-cloak].wear}}, the war axe's {{items.items[id=war-axe].wear}}. A potion has no W box and takes no pip; a talisman never wears.

Print one board more than there are players and leave it empty. That is the encounter board: a monster or a stranger turned up by a discovery roll is dealt onto it and run like a player, as [Discovery and encounters](11-discovery.md) describes. A vehicle in play is dealt a board of its own too; nobody starts with one.

### Found your town

{{fig:plate:tool-axe|margin|The axe from the tools deck; its W figure sets the pip on the ladder.}}

{{fig:plate:tile-town-hall|margin|The town hall stands face up with its solid band; nothing is owed for it.}}

1. **Choose a start hex.** It must be marked **G** or **F**, and at least three hexes from any other player's starting cluster. Your starting cluster is that hex and two hexes touching it.
2. **Stand your town hall on the start hex,** face up — the finished picture, with the solid name band — and a hut with it. Both are already built; no materials and no build points are owed for them.
3. **Put your workers in the town.**
4. **Put the starting stock in the stockpile:** 2 logs, 8 grain, 1 water and 1 barrel. The grain is there to feed two or three workers until a first harvest comes in, and it is meant to be spent. It all sits well under the {{rules.storage.stockpileFreeSlotsPerTown}} slots every town has plus the town hall's {{buildings.buildings[id=town-hall].storage}}.
5. **Take an axe and a shovel from the tools deck.** A tool is a card with a W box like anything else. Lay each in a kit slot on your board and put a pip on the ladder beside it: {{tools.tools[id=axe].baseWear}} for the axe, {{tools.tools[id=shovel].baseWear}} for the shovel.
6. **Stand your hero figure on the town hall's hex.** It is the only figure you start with. Prospectors, merchants and soldiers are bought during play — see [The map and travel](08-the-map-and-travel.md).

## The deposits

{{fig:plate:tile-clay-pit,plate:tile-sand-pit,plate:tile-mine,plate:tile-oil-derrick|What is built over a deposit once surveyed: clay pit, sand pit, mine, derrick.}}

A deposit is a source under a hex, never a commodity. Its tokens go down face down at setup and stay hidden until a prospector surveys the hex — the survey is in [The map and travel](08-the-map-and-travel.md). The tokens of one kind are not all the same: two coal seams are two different prospects, and a survey tells you which one you found. There are {{count:deposits.deposits}} kinds.

| Deposit | Tokens |
| --- | --- |
| Clay Bed | {{count:deposits.deposits[id=clay-bed].tokenYields}} |
| Sand Bar | {{count:deposits.deposits[id=sand-bar].tokenYields}} |
| Peat Bog | {{count:deposits.deposits[id=peat-bog].tokenYields}} |
| Coal Seam | {{count:deposits.deposits[id=coal-seam].tokenYields}} |
| Iron Deposit | {{count:deposits.deposits[id=iron-deposit].tokenYields}} |
| Copper Deposit | {{count:deposits.deposits[id=copper-deposit].tokenYields}} |
| Gold Deposit | {{count:deposits.deposits[id=gold-deposit].tokenYields}} |
| Gem Vein | {{count:deposits.deposits[id=gem-vein].tokenYields}} |
| Salt Dome | {{count:deposits.deposits[id=salt-dome].tokenYields}} |
| Mana Vein | {{count:deposits.deposits[id=mana-vein].tokenYields}} |
| Oil Field | {{count:deposits.deposits[id=oil-field].tokenYields}} |

Each kind hides only under certain ground; which terrains hold which deposit is in Annex I, *Terrain*. A deposit you reveal is not yours: it belongs to whoever builds on it first.

> **Open.** On a drawn map three things are not yet settled: how far a starting town must stand from a printed settlement; which hexes take deposit tokens, and how many; and how a token stays hidden on a hex with no tile to slide it under. Until they are, agree a method at the table before anyone looks — tokens face down, on land hexes whose terrain can hold that kind, and well mixed, so that nobody knows which figure lies where.

## The decks

{{fig:card:EVT-01,card:WPN-01,card:ARM-03,card:SPL-02,card:VEH-01|Shuffled and stacked face down: events, weapons, armour, spells, vehicles.}}

1. **Shuffle each of these and stack it face down:** events, quests, monsters, items, weapons, armour, talismans, spells, vehicles, modifications and tools — and the characters left over after everyone has chosen. The event deck is {{events.deck.totalCards}} cards. Nobody is dealt one; the first is turned in the Events phase of round 1, and nobody starts with a quest or a vehicle either.
2. **Lay the buildings deck face up where everyone can reach it.** It is a reference, one card for every building, and is never shuffled or dealt.
3. **Leave the campaign deck in the box.** It is read in order, and only in campaign mode.

## Prices at the start

{{fig:plate:tile-market|margin|A market; every good opens at its base value with nothing written.}}

1. **Every good begins at its base value.** A commodity's six prices are printed as one row of six figures in Annex I, *The market and every price*, at ×{{rules.market.priceBands}} of its base value; the base value is the third figure of the row. Nothing is filled in on any ledger at setup. Until the first Market phase every good trades at its base value, and the first roll steps from that figure into row 1.
2. **Sought goods start on nothing.** There is no move box above row 1, so the first round is played on the dice alone. The mark in a token's corner says which kind of good it is — ![staple](../art/icons/pricing-staple.svg) staple, ![perishable](../art/icons/pricing-perish.svg) perishable, ![finite](../art/icons/pricing-deplete.svg) finite, ![sought](../art/icons/pricing-hype.svg) sought — and each kind's rule is in [Trade and the market](09-trade-and-the-market.md).
3. **The board has stock in round 1.** The first time a commodity's token is stood in a ledger seat before the first Market phase, roll two red dice: that is how many units of it the board will sell until the market has been rolled.
4. **A fresh depletion grid reads 0.** Stand a finite good's token in the seat of an empty grid the first time a unit of it is burnt.

## Turn order and the first round

{{fig:plate:event-long-summer|margin|Round 1 opens on the Events phase and the first card is turned.}}

Turn order runs clockwise, and the first seat passes one player to the left at the end of every round, so over {{rules.victory.gameLengthRounds}} rounds everyone leads about equally. Put the round marker on 1 and begin with the Events phase — [The round](04-the-round.md).

> **Open.** How the first player is chosen is not decided. Until it is, choose one any way the table agrees and give them the first-player token.

## Setup at a glance

| | Ready when |
| --- | --- |
| Board | one, chosen by the table, printed settlements belonging to nobody |
| Shared sheets | market board, a fresh depletion sheet, a fresh ledger for every town to be traded in, seats empty |
| Dice | two blue, two red, one green, one ochre, one purple; a d6 per worker; the d4–d12 set; a d6 and a d20 |
| Each player | a people; a character and what came with it; the {{rules.currency.symbol}} box in coin; a board with H and S set, P and M at 0; a town hall and a hut on a G or F hex; workers; 2 logs, 8 grain, 1 water, 1 barrel; an axe and a shovel; one hero figure |
| Spare | one empty player board for encounters |
| Deposits | every token face down and hidden |
| Decks | every deck shuffled, except the buildings deck (reference, face up) and the campaign deck (in the box) |
| Prices | base value everywhere, nothing written |
| Round | marker on 1, a first player chosen, Events phase first |
