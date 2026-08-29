# 01 — The core loop

## The round

Six phases, in this order. All of it lives in `data/rules.json` under `round.phases`.

**1. Events.** In turn order, each player reveals one event card and resolves it —
the card's scope decides who it hits, so a global card is everyone's problem whoever
drew it. From round 13 the first player draws a second card. Resolving first means
the cards shape your plan rather than punishing a plan you already committed to.

**2. Labour Roll.** Every player rolls one die per worker. Pips are hours. This is
public — everyone sees how good everyone else's round is going to be, which matters
for trade negotiation.

**3. Actions.** In turn order, players spend their hours. This is the whole game.

**4. Production Tick.** Advance every progress track at once: construction, crop
growth, wine ageing, cargo in transit, livestock breeding.

**5. Feeding.** Every town pays food upkeep from stock held in that town. Shortfalls
become unrest. Then, at the end of the phase, every player rolls the ochre **spoil die**
once for each perishable stack still in their hands — grown, bought, looted or found, it
makes no difference to a fish — and discards what the spoil strip says. It sits here and
not one phase later because rot is a thing that happens to food, not a thing that happens
to a market, and because the round you failed to shift a hold full of milk is the round it
should cost you.

**6. Market.** Roll the market for every column on the price ledger: **two blue dice for
demand, two red for supply, one green for volatility**, plus whatever the good's own nature
adds. Blue is what you want and red is what stands in your way — the same two colours,
subtracted the same way, as a fight. The whole sum is addition, `Demand − Supply +
Volatility + Modifier`; read the net on the swing ruler, step the price that many places
along that commodity's printed row of six, fill the new figure into the ledger, strike the
old one through, and write the move in the row's move box. Then turn order passes to the
left.

Nobody trades in this phase. It fixes the price everybody will trade at **next** round, in
the Actions phase, against a figure they can already see. See
[04-trade.md](04-trade.md#how-a-price-is-arrived-at).

## Effort

One d6 per worker, by default. The pips are hours; a 6 is a good day and a 1 is a bad
one. A three-worker town rolls 3d6 and gets somewhere between 3 and 18 hours, usually
about 10.

That variance is the point. It is small enough to plan around and large enough that you
cannot cut your margins to zero.

### Modifiers, in resolution order

1. **Extra dice** — a rare, powerful effect.
2. **Die ladder steps** — d4 · d6 · d8 · d10 · d12. A potion of vigour steps a worker
   up two; a riot steps everyone down two.
3. **Flat bonuses** — +1 per worker from a varied table, from ale, from a shrine.

Capped at +3 flat per worker, so bonuses stack into something noticeable without
becoming the only thing that matters.

### Effort does not carry over

Unspent hours are gone at the end of the round. There is no banking a quiet round to
fund a loud one, which keeps every round tactically live and stops a player from
disappearing for three rounds and returning with a war chest of labour.

## Allocation

Spending hours means picking a **job**: a recipe you can legally run right now. A job
is legal when all of these hold:

- **Site** — you have the building, or the terrain, or the deposit, or a construction
  site, that the recipe names.
- **Tool** — you hold an unbroken tool of the required type, if it requires one.
- **Specialist** — a trained profession is present, if the recipe is gated on one.
- **Inputs** — the commodities are in that town's stockpile.
- **Fuel** — for recipes that burn something, you can pay one of the listed options.
- **Hours** — you have the batch's effort cost left.

Run the batch and everything happens at once: inputs are consumed, the tool takes one
wear point for the job however many hours it ran, and outputs arrive — immediately, or
after a maturation wait.

The web sandbox shows you exactly this list, including everything you *cannot* do and
the first reason why. That "out of reach, and why" panel is the most useful teaching
tool in the build.

### Worker slots

Each building caps how many workers can be allocated to it in one round. Four workers
at a farm, two at a bakery. This is what stops a player from dumping an entire round's
labour into one lucrative recipe, and it is the main reason to build a second of
anything.

## Tools wear out

A tool has a wear track. **Each job done with it costs one wear point** — one, whether the
job was one hour or nine — and when the track empties the tool is gone, with the effort
already spent on the job that broke it not refunded. It used to be a point a labour hour,
which meant adding hours up all round and a durability number running past thirty; it is a
point a job now, on the player board's own 0–14 scale, and an axe that was twenty-four wear
at three hours a job is ten wear at one a job. Slightly longer-lived, and nobody adds hours
up any more.

A tool is no longer the only thing this happens to. **Everything a figure carries wears**,
on one track, in one unit, at one point a use — a sword swung, a plate dented by the blow it
turned, a torch burned for a night, a rope that took a party down a cliff. On the table that
is one of the four **W ladders** on the player board, one beside each kit slot, so a player
counts the wear of the four things they are actually carrying and nothing else. In the
digital build it is a bar that turns amber and then red.

Tool size multiplies output rather than hours: a large axe does not let one worker
work faster, it means the hours they do work count for more. Sizes are ×1, ×1.5 and ×2
output for ×1, ×2 and ×3.5 cost — and **not** for more wear. A size used to multiply
durability too, and a multiplied wear number is a number the board's ceiling sweep cannot
see, because it never appears in the data at the size it is actually walked at. A bigger
loom is a faster loom, not a longer-lived one.

**Required vs optional tools.** Most tools gate their recipes: no pick, no coal. Farm
tools do not. Sowing and harvesting can be done by hand; a plough halves the hours and
a scythe doubles the yield. The difference is deliberate and is explained in
[11-bootstrap.md](11-bootstrap.md).

## Building takes time

Founding a site pays the full material cost up front. After that the building needs
**build-points** — one per hour of construction labour, two per hour if you are using
the right specialised tool for its material — and it also has a **minimum rounds**
floor. A manor is 30 build-points and at least 4 rounds; you cannot buy your way past
the calendar.

Materials are paid at the start rather than the end so that a half-built building is a
real commitment, and so that a thief who empties your warehouse cannot also un-build
your foundations.

## Why the feeding phase is last

Because it turns every other decision into a question with a deadline. You can spend
the whole round building a steelworks — but nine workers still want feeding on Friday,
and the grain you were counting on is three rounds from ripe.
