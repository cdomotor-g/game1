# 12 — What the simulator found

A record of design faults caught by `tools/simulate.mjs` before anyone played a game,
kept because the *kind* of fault is more useful than the fix.

## Faults found and fixed

### 1. Two circular dependencies made the economy unstartable

Stone needed a quarry, which needed ironware, which needed a blacksmith, which needed
stone. Lumber needed a saw, which was forged at a blacksmith, which was built of lumber.

Neither was visible reading the JSON — each file looked reasonable on its own. The
simulator found them in one run, as a town that never built its fourth building.

Fixed with a toolless floor and by removing ironware from the quarry cost. See
[11-bootstrap.md](11-bootstrap.md).

**The general lesson:** referential integrity checking is not enough. Every id resolved
correctly the whole time. What was broken was the *graph*, and only playing it found
that.

### 2. Farming was gated behind heavy industry

Sowing required a plough; a plough required ironware, a blacksmith, a smelter, a mine
and a pick. Meanwhile the town ate from round one. Fixed by making farm tools optional
multipliers rather than gates.

### 3. The town started in storage overflow

Starting stock came to 24 bulk against a 12-slot cap, so the first Feeding phase
destroyed half of it before the player had made a decision. Fixed by raising the free
stockpile to 10 slots and trimming the starting goods to sit comfortably under the cap.

### 4. Losing your last axe was unrecoverable

No axe means no logs; no logs means no lumber, no blacksmith and no new axe. Fixed by
adding toolless deadwood gathering and making the market cheap enough to be a genuine
safety net — 4 logs, no cloth.

### 5. Sowing was misclassified as un-automatable

An engine bug rather than a data one: any recipe with no immediate outputs was flagged
"resolve this at the table". Sowing has no immediate output — it puts a crop marker on a
field — so the digital game could never plant anything. Found by tracing why the bot
would not farm.

### 6. Halflings only had their penalty implemented

"Second Breakfast" doubled their food bill; "Many Hands" and "Green Fingers" were prose
the engine never read. They starved in 12 games out of 12. Second Breakfast became a
flat 2 food per town per round, which scales sanely, and their farming got a multiplier.

## Current state

20 games per people, 24 rounds, one town, the standard bot policy:

| People | Score | Workers | Buildings | Coin | Games with unrest |
| --- | --- | --- | --- | --- | --- |
| Elves | 21.0 | 5.0 | 10.0 | 24 | 7/20 |
| Humans | 20.7 | 5.0 | 9.7 | 18 | 10/20 |
| Orcs | 18.6 | 5.0 | 7.6 | 22 | 3/20 |
| Dwarves | 18.2 | 5.0 | 7.4 | 36 | 19/20 |
| Halflings | −14.6 | 6.0 | 6.6 | 101 | 18/20 |

Reproduce with `node tools/simulate.mjs --games 20 --people <id>`.

## Known problems these numbers show

**Halflings are still the worst by a mile.** They end with the most workers and the most
coin and still score −15, because unrest costs 2 points each and they carry ~18 of it.
Their flat food surcharge is still not paid for by anything the engine implements.

**Dwarves hit unrest in 19 games out of 20.** Their −50% farming penalty bites in a
single-town sandbox with no one to buy food from. That may be correct — dwarves are
*supposed* to be a trading people — but it cannot be confirmed until there is more than
one town. Treat it as unproven rather than as a fault.

**Human, elf and orc cluster at 18–21.** Close enough to be encouraging, and far too
crude a test to mean anything yet.

**The overall pace is slow.** Ten buildings and five workers in 24 rounds means the
tier-3 chains — steel, glass, fine cloth — are reachable but rarely worth reaching. The
levers are build-point costs, the length of the game, or the rate of housing. This is
the biggest open balance question and it needs human playtesting, not more bot runs.

## What the bot cannot tell you

It plays one town with no opponents, no board, no trade and no war. It cannot say
anything about the parts of the game that are about other people — which is most of
what makes a board game good. It is a check that the economy *functions*, not that the
game is *fun*.
