# 11 — Why the opening cannot deadlock

This is a short doc about one rule, because that rule was arrived at the hard way and it
is the kind of thing that gets "tidied up" by someone who does not know why it is there.

## The problem

An economy where every tool needs a building and every building needs a processed
material will deadlock. The first version of this data did exactly that, in two places
at once:

**The stone loop.** Stone came from a quarry. A quarry cost ironware. Ironware needed a
blacksmith. A blacksmith cost stone. Nobody could ever build the first one of anything.

**The lumber loop.** Lumber came from a sawmill, which needed a saw, which was forged at
a blacksmith, which cost lumber.

**The plough gate.** Sowing required a plough. A plough needed ironware, which needed a
blacksmith, which needed a mine, a smelter and a pick. So a player could not plant a
field until they had built an industrial base — while eating one food per worker per
round from round one.

None of these were visible by reading the files. All three fell out of the first
headless simulation, which reported a town that starved in round 2 and never built its
fourth building.

## The rule

**Hand labour is always possible. Tools multiply it.**

Concretely, three toolless or near-toolless jobs form the floor of the economy:

| Job | Site | Tool | Yield |
| --- | --- | --- | --- |
| Gather Deadwood | forest, grassland, hills, marsh | none | 1 log / 3h |
| Gather Field Stone | hills, mountain, river bank, tundra | shovel | 1 stone / 3h |
| Forage | most wilderness | none | ~1.2 food / 2h |

Against the tooled versions — 2 logs per 2h with an axe, 2 stone per 3h at a quarry —
they are bad. That is the design: they are not a strategy, they are a floor.

And farm tools became **optional multipliers** rather than gates:

- Sowing takes 4 hours by hand, 2 with a plough.
- Harvesting yields 6 by hand, 12 with a scythe.

Mining kept its hard gate. You cannot break rock with your hands, and coal should stay
behind a real investment.

## The safety net

The floor guarantees a player can always gather *something*. The market turns that into
a recovery:

- A **Market** costs 4 logs and nothing else — reachable by hand in two or three rounds
  from absolutely nothing.
- Tools can be **bought** there for coin.

So the worst case in the game — every tool broken, empty stockpile — is: gather deadwood
by hand, put up a stall, buy an axe, carry on. Slow and humiliating, but never dead.

This is also why the market's cost was changed from `3 logs + 1 cloth`. Cloth is four
steps into the textile chain; requiring it made the safety net unreachable by exactly
the player who needed it.

## The starting position

A new town gets 2 logs, 8 grain, 1 water, 1 barrel, an axe and a shovel.

The grain is the load-bearing number. A town of 2–3 workers eats 2–3 per round, and the
path to the first harvest is: build a farm (2 rounds), sow (1 round), wait 3 rounds,
harvest. Eight grain bridges that gap with a little to spare. Start with four — as the
first version did — and the opening is unwinnable no matter how well it is played.

The starting stock also sits deliberately **under** the storage cap. A town that begins
in overflow bleeds goods before the player has made a single decision, which is a
terrible first impression of a rule that is otherwise fine.

## If you change these numbers

Run the simulator. It takes two seconds and it will tell you.

```bash
node tools/simulate.mjs --games 20
```

If `games with unrest` climbs or `buildings` falls, something in the floor has been
broken.
