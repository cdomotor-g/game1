# 05 — People, food and unrest

## Getting workers

Workers come from housing, and only from housing:

| Building | Workers | Cost |
| --- | --- | --- |
| Hut | 1 | 2 logs |
| Timber House | 2 | 4 lumber, 1 stone |
| Brick House | 3 | 6 brick, 2 lumber, 1 ironware |
| Manor | 4 + 1 specialist | brick, stone, glass, fine cloth |

A worker is a die every round for the rest of the game, so housing compounds harder
than anything else you can build. It is also a permanent food bill, which is the brake.

Migrant event cards offer more workers if you have the housing *and* the food to take
them in. Turning them away costs a point of unrest, which is a small, sharp decision.

## Feeding

At the end of every round, each town pays **1 food per worker** from stock held in that
town. Specialists eat too.

Food held elsewhere does not count. This is the rule that makes the map matter: a
granary full of grain three tiles away is not dinner. Moving food between towns is one
of the main reasons transport exists.

**Bread feeds two per unit.** Flour to bread is the single best conversion in the food
chain, and it is why a bakery is worth its brick.

**Variety bonus.** Feed a town from three or more distinct food commodities in one
Feeding phase and every worker in it gets +1 flat effort next round. This exists to
stop the optimal strategy from being "grow only grain forever", and it rewards the
player whose economy has breadth over the one with a single deep silo.

**Spoilage.** Eleven commodities are **perishable** (`data/pricing.json → models`, the
`perish` model), and at the end of every Feeding phase every player rolls the **ochre
spoil die** once for each perishable stack they are still holding — in a town, in a hold,
or on a figure's back — and discards what the strip says:

| Ochre | Keeps well — bread, vegetables, apples | Keeps poorly — milk, fish, meat, eggs, berries, mushrooms, grapes, moon blossom |
| --- | --- | --- |
| 1–2 | — | 1 |
| 3–4 | 1 | 2 |
| 5–6 | 2 | 3 |

You cannot lose more than you hold: a stack of one told to lose three loses one. A
**granary reads one row up the strip** — a 5 or a 6 costs what a 3 or a 4 costs, and a 1
or a 2 costs nothing at all — which is what a granary is for, and why it takes food and
drink and nothing else. That is a change worth naming: a granary used to stop perishing
*entirely*, and now it is very good insurance rather than immunity, because a building
that deletes a rule stops the rule from being part of the game for anybody who owns one.

**It replaced a countdown, and the countdown is what was wrong.** Every perishable used
to carry a number of rounds it kept for — meat and fish two, bread three — which meant a
token on every stack with an age written on it and a player having to remember which
week the fish arrived. A die at the end of the round asks the same question and needs
nothing written down anywhere: roll it, discard that many, move on. What survives of
`perishRounds` is which of the two columns above a commodity reads, and that is the whole
of the difference between milk and an apple now.

**And it is where the old GLUT pricing model went.** Glut bent a price down through a
memory strip on the market board — a fair model of a market and a poor model of a fish.
It punished the *town* for what the *farmer* did, and it never once made anybody hurry.
The spoil die punishes whoever is actually holding the stuff, at the end of the round
they failed to shift it, which is both truer and considerably more urgent. Spoilage now
touches no price at all: what rotting does to a market it does through the market's own
front door, because units that rot are units nobody sells.

### On the road: food and sleep

The rules above are the town's. A party out on the map has its own upkeep, and it spends
two different numbers:

- **1 food per figure per round**, from what the party carries, forages or buys. A round
  that ends with a figure unfed costs that figure **1 health** — every round it goes on.
  Being fed again does not put the health back.
- **A night without a camp costs 1 strength.** Travel a night leg, or push on past dark,
  and every figure in the party loses a point. It stacks night after night, and at 0
  strength a figure does not fight and carries nothing.
- **One night's sleep restores strength in full**, wherever it is taken — a camp on open
  ground does it as well as a bed at an inn.
- **Sleeping mends no health at all.** Health comes back only under medical aid: a healer
  or an infirmary (3 a round), a physician who happens to be standing there (2), or a
  potion.

Strength is spent, so sleep gives it back; health is damage, so somebody has to repair it.
Keeping those apart is what makes a night's camp a decision rather than a formality, a
lantern and a stretch of salted meat worth their coin, and a physician worth feeding. Full
numbers in `rules.json → upkeep` and `rules.json → rest`.

**The spoil die follows you out of town.** The end-of-Feeding roll above is not a town
rule — it is rolled once per perishable stack *anybody* is holding, and a pack is a place
you are holding something. So the fresh food a party carries is rolling the ochre die every
round it is out, with no granary within a week's walk to read a row up the strip, while the
salted meat and the cheese and the ale in the next pocket are staples and roll nothing at
all. That is the whole argument for preserved food in one sentence: salting a side of meat
is not flavour, it is taking a stack out of the die's reach. A party that provisions itself
on fish and berries because they were cheap at the dock has bought a smell.

**And coin weighs something now.** A gold coin is 25 grams, forty to the kilogram, and it
counts against the same `strength × 3` kilograms as the sword and the rope. It used to be
weightless — the one thing a figure could hold an unlimited quantity of, an abstraction
living outside the world it was buying things in — and taking that exemption away is what
turns a successful trip into a logistics problem. A strength-3 figure shoulders 9 kg, so
they could carry 360 coin and nothing else; the 60 they start with is a kilogram and a half,
a rounding error against a blade. The weight only bites at the moment it should: a party
that has just sold a hold of jewellery has to work out how the money is getting home, and
the answer is a strongbox on a wagon, which is **cargo**, measured in bulk and stealable
like any other cargo on the road. A fortune is heavy. Full rules in
`rules.json → carrying.coin`.

## Unrest

Every mouth you cannot feed is 1 unrest.

- **3 unrest** — the town riots. Workers roll d4 until it settles.
- **5 unrest** — a worker leaves. Permanently.

Unrest clears slowly: 1 per fully-fed round, 2 for a feast (2 food per worker), or 1
from serving drinks at an inn. A Strike card halves the effort of any town with unrest
on it, and drinks at an inn end it immediately.

This is the game's failure spiral, and it is meant to be recoverable but expensive.
The distance from "one bad round" to "losing a worker" is five rounds of neglect, which
is enough time to notice and do something.

## Specialists

A worker trained at a guildhall becomes a specialist: same die, but unlocks recipes
plain workers cannot run, and adds a bonus at their own building.

| Profession | Unlocks / bonus |
| --- | --- |
| Smith | Forging tools and jewellery; +1 output at a blacksmith |
| Weaver | Fine cloth; +1 yarn per spin |
| Merchant | No spread in town; may broker other players' deals for 10% |
| Alchemist | Potions |
| Healer | Tend the Sick; illness cards cost the town one worker fewer |
| Miner | +1 on mining; picks wear half as fast |
| Farmer | +2 on every harvest |
| Engineer | Cheaper rail; trains burn less coal |

Specialists are the mid-game power spike. They cost coin, a training slot and a worker
you were using for something else, and a town that cannot feed its specialist cannot
run the recipes that specialist unlocks.

**Illness** is the pressure the healer answers. The event deck now carries Camp Fever,
Marsh Ague and the Grey Pox alongside the Plague — see
[06-events.md](06-events.md#illness) — and a town with an infirmary and a fed healer
loses no worker to any of them. The healer is deliberately the first specialist whose
absence has a body count rather than a slower economy.

## Soldiers

A worker under arms. Produces no effort, eats normally, fights. A barracks holds four
without them costing you a housing slot.

Soldiers are pure insurance: they contribute nothing to the economy and they eat. That
is the correct price for the ability to survive a raid with your warehouse intact, and
it is why a player who over-invests in them falls behind.
