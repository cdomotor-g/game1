# Careers: a hero who outlives a game

Until now a hero was dealt at setup and thrown away at the end of the game. This note explains why that changed, and why the board and the food rules changed with it. The rules themselves are in Book I, *A hero's career*.

## What lasts, and what does not

A hero who carries their coin and their kit into the next game turns a new table into a rich player and three poor ones. So the line is drawn between what a hero **is** and what a hero **owns**. Level, the deeds toward the next level, and the rises a milestone has given are who the hero is, and they carry. Coin, cards, wounds and a half-empty waterskin belong to one game's economy, and they do not. Renown sits on the line: it is the world's opinion, so most of it stays in the world. A hero starts each game with one renown for each milestone passed, and earns the rest again.

## Why levelling is slow

A level costs as many deeds as its number, so the twentieth costs twenty and the whole climb costs two hundred and ten. A mini quest is worth one to three deeds, a task card about the same, and a campaign stage four or five. `tools/simulate.mjs` plays a hundred careers against the real decks. A strong first game reaches level 5, and level 20 takes fourteen to twenty-one games. The simulator fails if one game ever reaches the top, or if any career never does. The model of how often a round offers a hero a chance is a guess, not a measurement, so the useful output is the *shape* of the curve, not the exact game count.

## Why Hunger came back

Hunger once went because a meal knocked four rungs off a clock that nobody watched, and because every figure ate a meal a round anyway. It is back because the meal is no longer owed every round. A figure eats when it chooses, off a ration card's capacity ladder, and the Hunger track shows the whole table how long it can leave it. That makes Hunger a bar to read, where a meal a round was a count nobody kept.

Food and water are twin clocks and sit side by side on the board, but they are got in different places:

- **Where you get it.** Water is free wherever there is water (a settlement, a river, a lake, a marsh) and nowhere else, so it is a question of the map. Food is never free away from your own town, so it is a question of the purse.
- **What going without costs.** The same at the top of either track: 1 health a round until the figure eats or drinks. Sleep has nothing to do with either, and strength is for battle and hard nights only.
- **What the country asks.** A desert costs more water (`terrain.json` desert `upkeep.thirst`), and cold country costs more food (tundra and mountain `upkeep.hunger`). Each terrain prints its own cost, the same way it prints its movement cost.
- **What else slakes thirst.** Drink does, at a price in Wisdom. That price is what gives the wineskin a reason to exist.

Ideas that were weighed and left for later: ships drinking from water barrels at sea (sea water is already not drink, so a long voyage wants barrels in the hold); food spoiling on the road while water does not (perishable food already rolls the spoil die); and water weighing more per day than food.

## Why Renown went

Renown was a third career track that took a little off every toll and every hireling's fee. It was the board's most fiddly column for the smallest return: a discount a player had to remember to apply at the moment of paying. It was taken off the board and out of the rules, along with the box on every character card, the task cards' renown figure and the record sheet's milestones box. Tolls and fees are paid in full.

## Why the board changed shape

A second kit slot went to Wisdom and Level. A hero still has six kit cards in play, one on the player board and five on the items board. The space under the single kit card now holds the two reference panels a hero needs every round: what a meal, a draught and a deed are worth. Every figure in them is read from the rules, so the board cannot drift from the rulebook.

The new letters are I and L. W was already Wear, so Wisdom took I, for insight. A building card's minimum rounds and lodging moved from R and L to RD and LG, because a track letter outranks a card-only one.

## The wineskin

It is the waterskin's own plate, mirrored, tipped and stained wine-red by `tools/derive-plate.py` from the item's `plateFrom` block. No artist drew it. It is a placeholder that is honest about being one, and it can be replaced by a drawn plate like any other: delete `plateFrom` and commission the brief.
