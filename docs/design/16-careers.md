# Careers: a hero who outlives a game

Until now a hero was dealt at setup and thrown away at the end of the game. This note explains why that changed, and why the board and the food rules changed with it. The rules themselves are in Book I, *A hero's career*.

## What lasts, and what does not

A hero who carries their coin and their kit into the next game turns a new table into a rich player and three poor ones. So the line is drawn between what a hero **is** and what a hero **owns**. Level, the deeds toward the next level, and the rises a milestone has given are who the hero is, and they carry. Coin, cards, wounds and a half-empty waterskin belong to one game's economy, and they do not. Renown sits on the line: it is the world's opinion, so most of it stays in the world. A hero starts each game with one renown for each milestone passed, and earns the rest again.

## Why levelling is slow

A level costs as many deeds as its number, so the twentieth costs twenty and the whole climb costs two hundred and ten. A mini quest is worth one to three deeds, a task card about the same, and a campaign stage four or five. `tools/simulate.mjs` plays a hundred careers against the real decks. A strong first game reaches level 5, and level 20 takes fourteen to twenty-one games. The simulator fails if one game ever reaches the top, or if any career never does. The model of how often a round offers a hero a chance is a guess, not a measurement, so the useful output is the *shape* of the curve, not the exact game count.

## Why Hunger went

Hunger and Thirst were twin clocks: each rose a rung a round and was knocked back four rungs by a meal or a draught. A clock that one meal resets by four is a clock nobody watches. A worker had always eaten one food a round, so now a hero does too. At home that comes from the town's stock, and on the road it is a rung off a ration card's capacity ladder. A sack running down a rung a day is something a player can see running out.

That made food and water the same shape, so they were pulled apart on purpose:

- **Where you get it.** Water is free wherever there is water (a settlement, a river, a lake, a marsh) and nowhere else, so it is a question of the map. Food is never free away from your own town, so it is a question of the purse.
- **What going without costs.** A missed meal costs strength, and sleep gives none back until you eat. Thirst at the top costs health. Hunger weakens; thirst kills.
- **What the country asks.** A desert costs more water (`terrain.json` desert `upkeep.thirst`), and cold country costs more food (tundra and mountain `upkeep.meals`). Each terrain prints its own cost, the same way it prints its movement cost.
- **What else slakes thirst.** Drink does, at a price in Wisdom. That price is what gives the wineskin a reason to exist.

Ideas that were weighed and left for later: ships drinking from water barrels at sea (sea water is already not drink, so a long voyage wants barrels in the hold); food spoiling on the road while water does not (perishable food already rolls the spoil die); and water weighing more per day than food.

## Why the board changed shape

Hunger's column went to Wisdom, and a second kit slot went to Level and Renown. A hero still has six kit cards in play, one on the player board and five on the items board. The space under the single kit card now holds the two reference panels a hero needs every round: what a meal, a draught and a deed are worth. Every figure in them is read from the rules, so the board cannot drift from the rulebook.

The new letters are I, L and R. W was already Wear, so Wisdom took I, for insight. A building card's minimum rounds and lodging moved from R and L to RD and LG, because a track letter outranks a card-only one.

## The wineskin

It is the waterskin's own plate, mirrored, tipped and stained wine-red by `tools/derive-plate.py` from the item's `plateFrom` block. No artist drew it. It is a placeholder that is honest about being one, and it can be replaced by a drawn plate like any other: delete `plateFrom` and commission the brief.
