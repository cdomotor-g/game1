# A hero's career

A hero is not dealt fresh every game. What they know and how far they have come is written on a character record sheet at the end of one game and carried into the next; what they own is not.

{{fig:board:record,card:CHR-08,card:CHR-21,plate:item-waterskin|frieze}}

## Wisdom, level and renown

{{fig:card:CHR-08|margin|Old Mother Keswick: as wise as any card a player can be dealt.}}

Three tracks on the player board belong to a hero's career, and only a character card prints them.

| Track | What it is | What moves it |
| --- | --- | --- |
| I Wisdom | What you know and notice. Task cards test it | Nothing in play but drink, and only until you sleep. It rises at a milestone |
| L Level | How far you have come, {{rules.level.from}} to {{rules.level.to}} | Deeds. It never comes down |
| R Renown | What people say about you, {{rules.renown.from}} to {{rules.renown.to}} | Up for quests done, down for quests given up, and what a task card prints |

## Tests

{{fig:plate:monster-stone-boar|margin|Befriending is a test of Charisma; most task cards test Wisdom.}}

A card that asks whether you manage something names a characteristic and a number. Roll a {{rules.test.die}}, add the characteristic, and pass on the number or over it. Befriending a monster is a test of Charisma at {{rules.charisma.befriend.threshold}}; a task card prints its own.

## Task cards

{{fig:tile:inn|margin|A task can be swapped at any inn.}}

There are {{count:tasks.tasks}} task cards, all in Annex II.

1. **Hold {{tasks.hand}} task at a time,** face down beside your board. You are dealt one at setup.
2. **Do what it says.** A task with a test is done when you meet its condition and pass the test; fail the test and you may try again whenever you meet the condition again.
3. **Take its deeds and its renown,** put it at the bottom of the deck, and draw the next.
4. **Swap it** at any inn for {{tasks.swap.coin}} coin: bottom of the deck, draw another. It costs no renown — nobody knew you had promised anything.

## Deeds and levels

{{fig:board:player|wide|The L track and, under the kit card, A CAREER: what a deed and a level are worth.}}

- **A mini quest done** is worth its complexity in deeds. **Each stage of a campaign quest** done is worth the campaign quest's complexity.
- **A task card done** is worth the deeds it prints.
- **Count deeds on your record sheet,** never on the board: tick a box on the deeds ladder for each one.
- **To reach a level costs as many deeds as the level.** Level 1 costs 1 deed, level 2 two more, level 3 three more. When the ticks reach the level you are rising to, move the L marker up a rung, clear the ladder and carry anything left over. From {{rules.level.from}} to {{rules.level.to}} is {{rules.level.toTop}} deeds.
- **Every {{rules.level.milestones.every}}th level is a milestone.** Choose one rise and write it on your record sheet: health +1, strength +1, wisdom +1, charisma +1 or burden +2. Raise that track now, and that box in every game after. A rise that would take a number past {{components.board.track.to}} is chosen again.

> **Open.** What a level does beyond its milestones — whether a quest may ask for a level, or a level adds to a test — is not decided. Until it is, a level is the road to the next rise and nothing else.

## Renown

{{fig:plate:event-mercenaries-for-hire|margin|Renown makes every hireling cheaper.}}

- **Gain** {{rules.renown.gain.perQuest}} renown for every quest done and {{rules.renown.gain.perCampaignStage}} for every campaign stage done, and whatever a task card prints.
- **Lose** {{abs:rules.renown.loss.perQuestAbandoned}} for every quest you give up. Renown never goes below 0.
- **Read the highest step the marker has reached.** Each step takes something off every toll your party is asked for — road, rail, bandits or an event — and off every hireling's fee. Neither goes below 0.

| Renown | Off every toll | Off every hireling |
| --- | --- | --- |
| {{rules.renown.steps[0].at}} | {{rules.renown.steps[0].tollOff}} | {{rules.renown.steps[0].hireOff}} |
| {{rules.renown.steps[1].at}} | {{rules.renown.steps[1].tollOff}} | {{rules.renown.steps[1].hireOff}} |
| {{rules.renown.steps[2].at}} | {{rules.renown.steps[2].tollOff}} | {{rules.renown.steps[2].hireOff}} |
| {{rules.renown.steps[3].at}} | {{rules.renown.steps[3].tollOff}} | {{rules.renown.steps[3].hireOff}} |

## Drink

{{fig:plate:item-waterskin|margin|A wineskin is a waterskin filled at an inn: three draughts, each one company and folly.}}

Ale, wine and mead are drink. A draught comes from a wineskin or a cup at an inn, {{rules.drink.coinPerCup}} coin.

1. **Each draught** puts your Charisma up {{rules.drink.perDraught.charisma}} and your Wisdom down {{abs:rules.drink.perDraught.wisdom}}, and takes {{rules.upkeep.thirst.eased.perDraught}} rungs off Thirst as water does.
2. **It lasts until you next sleep,** at a camp or in a bed. Then put Charisma back to its box and Wisdom back up by as many rungs as drink took off.
3. **Wisdom stops at 0.** A hero whose Wisdom reaches 0 by drinking is drunk: they do nothing else that round — no leg, no job, no task — fight only if something attacks them, and sleep where they stand.

## The record sheet

{{fig:board:record|wide|The character record sheet: what lasts, the rises, the deeds ladder, what each level costs, and the games played.}}

One sheet per hero, kept between games, filled in pencil.

**At the end of a game**, write on the next row of the log: the deeds earned, the level reached, the deeds left over, and any rise taken. Write Wisdom as it stands after a night's sleep.

**At the start of the next**, set up from the card and then from the sheet, as [Setting up](03-setting-up.md) says: level from the sheet, every rise added to its box, and renown at one for every milestone passed.

**What carries:** level, the deeds toward the next one, every rise taken, and renown as milestones. **What does not:** coin, kit and cards, health or strength lost, thirst, and drink. A veteran walks into a new game with what they are and nothing they own.
