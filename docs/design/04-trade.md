# 04 — Trade, markets and moving goods

## Two kinds of trade

**With the board** — buying and selling at a market at the price the ledger is showing,
paying a 15% spread each way. Always available, never a good deal, and the reason nobody
ever gets truly stuck.

**With other players** — any goods, any coin, any price the two of you agree. No spread,
no limit, and no enforcement beyond the table. This is where the game should get loud.

## Price bands

Every commodity has six prices, and they are ×0.5, ×0.75, ×1.0, ×1.25, ×1.5 and ×2.0 of its
base value. Prices start at ×1.0. Event cards shove them by family — an iron shortage moves
metals two bands for three rounds — but what moves them every round is the roll below.

**Those multipliers are how the six prices were worked out. They are not something anybody
does at a table.** Every commodity's six are printed out in full, as one row of six figures,
in the annex: grain is 3 · 4 · 5 · 6 · 8 · 10, coal is 4 · 6 · 8 · 10 · 12 · 16, jewellery
is 55 · 83 · 110 · 138 · 165 · 220. A price move is a **step along that row**. Last round's
price is written in front of you and it is one of the six; the swing ruler says how many
places to step; the figure you land on is the new price.

Sixty-six commodities times six bands is three hundred and ninety-six multiplications, all
of them the same ones every game, all of them formerly done at the table because a token
standing on a cell tells you a band index and not a price. They are done at the press now,
once, by a tool that cannot get one wrong. That is what let the price ladder come off the
market board with nothing replacing it, and it is why the word *band* survives here only as
a way of saying **how far along the row**.

## How a price is arrived at

Prices used to *drift*: one random family, one band, every round. It was a rule you could
not plan against and could not affect. A player could sell four hundred grain into one town
and the grain price would not notice.

Then a price was rolled and *bent*: two red dice against two blue, a memory strip on the
board that the commodity's own model walked, and a green die that multiplied the result.
That version was answerable, and it was also the only sum in the game a player could get
wrong. A swing of −7 halved and dropped toward zero, with a modifier that had to be folded
in *before* the multiplication, is three chances to slip in one line. They got slipped.

**So the multiplication is gone, and the whole sum is addition.** One line, printed across
the head of the market board:

```
net = Demand − Supply + Volatility + Modifier
```

**Two blue dice are demand. Two red dice are supply. One green die is the volatility.**
Whatever the good's own nature adds is the modifier, and it is added like everything else.
There is nothing to multiply, nothing to halve, nothing to round and nothing that has to go
in before anything else.

**The colours swapped when the sum did, and the reason reaches past this page.** Blue is
what you want and red is what stands in your way, everywhere in the game. In a market that
is demand against supply. In a fight it is your dice against the thing you are fighting —
the same two colours, the same subtraction, the same direction, and the loser of the
comparison takes the difference (see
[07-peoples-magic-conflict.md](07-peoples-magic-conflict.md#conflict)). A player who has
rolled one market has already learned how a battle is scored. That is worth more than either
system's private preference about which colour ought to mean which.

**There are five colours of die, one per ink in the palette**, and the colour is the whole
interface. Blue is what you want. Red is what stands in your way. Green is the weather on a
market. Ochre is what the season takes back — the spoil die, which is a market die that never
touches a price. Bruise is the mana die, which is what a dead monster gives up. Nobody has to
remember which pair is which, because the same two colours are subtracted the same way in a
fight, and there is no sixth ink left to make a sixth kind of die out of. That is a
constraint worth having rather than a shortage: the next system that wants a die has to
borrow one and mean something new by it somewhere the colour cannot be confused.

Six dice roll the market — two blue, two red, one green, one ochre — and they serve the whole
table rather than one per player. One player rolls demand, supply and volatility for every
column on the ledger; every player rolls the ochre die for their own perishables.

**Volatility** is the green die, read on a three-cell strip: **1–2 slack** (−2, a quiet
season with nobody pushing), **3–4 even** (0, an ordinary season and the dice are the whole
story), **5–6 rough** (+2, a thin jumpy market, and this is where the spikes come from).

It was called *elasticity* and it multiplied — ×1, ×2, ÷2 — and neither the name nor the
multiplication survived. Elasticity is a word for how much a quantity answers a price, which
is not what this die was ever doing: it was a weather roll on a market, and volatility is
the word for that. And because it adds, it can now **turn a swing around**. A −1 in a rough
season is a +1; a +1 in a slack one is a −1. A multiplier could never do that — ×2 and ÷2
both leave a swing pointing exactly where it already pointed — and a market the weather
never turns over is a market with no weather in it.

Then read the net on the **swing ruler**, seven cells across the head of the board, and step
the price that many places along its row:

| Net | ≤ −9 | −8…−5 | −4…−2 | −1…+1 | +2…+4 | +5…+8 | ≥ +9 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Places | −3 | −2 | −1 | hold | +1 | +2 | +3 |
| | crash | slump | soften | hold | firm | rally | spike |

**The bins were re-cut when the multiplier went, and they had to be.** Two blue against two
red is a triangular spread peaking at nothing; the green die widens it by two either way; so
the whole net now runs −12 to +12 before any modifier, where the old multiplied one reached
26. Left as they were, the old bins on the new net would hold in 29.9% of rounds, move one
place in 65.6%, move two in 4.4% — and move three in none at all, ever, because the spike
cell starts at +16 and the dice can no longer get there. That is a seven-cell ruler doing
the work of three.

Cut where they are now, over all 7776 rolls of the five dice with no modifier, the market
**holds in 29.9% of rounds, moves one place in 45.8%, two in 22.2% and three in 2.1%** — so
it moves in about seven rounds in ten, two places is a genuinely one-sided market rather
than a weekly event, and three only happens when the dice and the good's own nature are
pulling together. Those figures are worked out from the bins rather than claimed, and they
are restated in `pricing.json ruler.odds` so that re-cutting a bin can be checked against
the intention rather than against somebody's memory of it. `validate-data.mjs` separately
refuses to let the ruler have a hole in it: the widest net the dice and the modifiers can
actually produce is −15 to +18, and every value in that range has to land in a cell.

A price at the top of its row that is told to go up stays where it is, and the same at the
bottom. A market can be at its ceiling; it cannot be above it.

One more rule, and it is what makes a shortage bite: **the board sells no more of a
commodity in a round than that round's supply roll**, first come first served in turn order
through the Actions phase. It will buy any quantity — a market always has room for more of
what nobody wants. So a low **red** roll is a shortage twice over: dear, and rationed. That
is the second job the red dice do, and it is why they are worth watching even in a round
when you are not buying.

**The Market phase contains no trading window**, and that is deliberate. Trading is an
action like any other and it happens in the Actions phase, against the price the ledger is
already showing. What the Market phase does is fix the price everybody will trade at *next*
round. You act on a known price and find out afterwards what your acting did to it, which is
the only honest way round for a market to work — and it is what makes the un-struck figure
at the bottom of a ledger column the most-read number on the table.

## What kind of good it is

This section was called *What a market remembers*, and the title had to go because nothing
remembers anything now. There is no memory strip. There is no tally. Every line on the old
market board carried both — a modifier from −3 to +3 walked by a bar, and beside it a count
of the board's own stock that filled every five tokens traded, emptied, and stepped the
modifier one cell in whatever direction the commodity's model said.

**What that machinery bought was real, and it is worth saying out loud before it is thrown
away.** It gave a market a history instead of a mood, which is the whole thing the drifting
prices could not do: sell four hundred grain into one town and the town noticed, next round
and the round after. It was legible across a table — two pieces of wood, moved as the trade
happened, nothing written down and nothing to look up. And it put the consequence of trading
in the same gesture as the trade itself, which is the right place for a consequence to be.

**What it cost was three pieces to walk per line per round, and two of the three models were
telling lies while it did.** The memory had to be added before the green die multiplied it,
which is the fold-it-in-first step that made the sum wrong; a market's history counted double
in a volatile season for no reason anybody could defend. The board had to be re-laid every
time a model wanted a different range. And the two loud models were both modelling the wrong
noun — a glut was punishing a town for a farmer's harvest, and a depletion was emptying a
seam through a ledger entry. Both of those are dealt with below.

Every commodity in the game is exactly one of **four kinds of good**, and the kind is
engraved in the corner of that commodity's own token — so the piece you stand in a ledger
column tells you how that column behaves.

| | | What it is | Commodities |
| --- | --- | --- | --- |
| ⚖ | **Staple** | It is worth what it is worth. It keeps, it is not running out, and nobody wants it for what owning it says about them — so its price is the crowd wanting it against the amount that turned up, and there is no story underneath. **Adds nothing.** The mark is a balance hanging level, the only symmetrical one in the set, because the other three all lean. | 34 — stone, lumber, cloth, rope, ale, and everything else durable that is neither dug out of a finite hole nor coveted for its own sake |
| ⋔ | **Perishable** | What you do not shift, you lose. **Adds nothing to the price either** — it charges in a different currency. At the end of every Feeding phase its holder rolls the ochre spoil die against each stack: 0 · 1 · 2 units gone for something that keeps well, 1 · 2 · 3 for something that does not. The mark is a fish skeleton, which says *gone off* in every kitchen in the world. | 11 — bread, vegetables, mushrooms, berries, apples, fish, meat, milk, eggs, grapes, and the one arcane herb that will not dry |
| ⧗ | **Finite** | The easy ore came out first. **Adds the lowest number still visible on its own depletion grid**, 0 to 6. A pip goes on that grid every time a unit is *burnt*, never when it is traded, and no pip ever comes off. The mark is a running glass with the sand already down in the bottom bulb. | 14 — everything a deposit yields, and what is smelted straight out of one |
| ↗ | **Sought** | It is bought because it is going up. Nobody *needs* a jewel or a famous horse; they want it for what owning it says, and that is loudest when the price is climbing. **Adds the move it made last round**, −3 to +3, read off the move box on the ledger row above. The mark is a run of prices with the arrow at the top of it — the only mark in the set that says which way it is pointing. | 7 — gold, jewellery, spices, fine cloth, wine, mead, horses |

The split runs down a production chain rather than across a category, which is the point of
it being on the commodity. **Gold ore is finite and refined gold is sought**: the same
substance, two markets, one priced by the hole it came out of and the other by what people
think it is worth this month. Iron ore, pig iron and steel are all finite; the ironware made
out of them is a staple, because by then it is a workshop's output and a workshop can decide
to make more.

`tools/validate-data.mjs` checks the half of that rule that can be checked: a commodity a
deposit yields and does not price by depletion is a hole in the ground that never runs dry.

### The spoil die, and what the glut model got wrong

Glut bent the price *down* through the memory strip: flood a market and the market sagged.
That is a fair model of a market and a poor model of a fish.

It punished the **town** for what the **farmer** did. The price everybody traded at moved,
which meant the player with a hold full of milk was no worse off than the player with none —
in fact slightly better off, because they were the one who knew the price was coming down.
It never made anybody hurry, because a memory cell is a thing that will still be there next
round and the round after. And it took the tally, the five-token fill and a bar to say
something the food does entirely by itself.

The spoil die punishes the person actually holding the stuff, at the end of the round they
failed to shift it, and it needs one die and no strip at all. Truer, and considerably more
urgent: a stack you meant to sell next round is a stack you may not have next round. A stack
in a **granary** reads one row up the strip — a 5 or a 6 costs what a 3 or a 4 costs, and a
1 or a 2 costs nothing — which is what a granary is for, and why it takes food and drink and
nothing else.

The die also replaced a countdown, and that is the second thing it paid for. Every
perishable used to carry a number of rounds it kept for, which meant a token per stack with
an age on it and a player who had to remember when the fish arrived. `perishRounds` survives
doing one much smaller job: below 3 and the stack keeps *poorly* and reads the right-hand
column of the strip. Milk and fish are one column over from apples and bread, and that is
the whole of the difference it makes now.

What spoilage does to a *market* it now does through the market's own front door. Units that
rot are units nobody brings to town, and the town notices a thin week the same way it notices
everything else — through the blue and red dice, like everything else.

### Depletion moved from sold to burnt

The old tally filled as tokens crossed to the board, which meant a seam was worked out by
**trading**. That is the version of this rule that a merchant beats without owning a mine: buy
the hundred tons of coal, sell it back, buy it again, and the hill runs dry from the
paperwork. Nothing was consumed and the price went up anyway.

Selling coal to a town moves coal. Burning it destroys coal, and only the burning is what a
seam notices. So a pip goes on the grid the moment a unit is **consumed** — burnt in a
furnace, fed to an engine, eaten by a recipe — in the Actions phase, in the hand of whoever
burnt it, one at a time as it goes. Buying and selling do nothing at all. **A merchant who
never lights a fire can trade the same hundred tons of coal all game and the seam will not
notice.**

The grid is seven rows of three cells, numbered 0 at the top to 6 at the bottom. Cover from
the lowest row up; the modifier is **the lowest number you can still see**. Nothing is
written down and nothing is counted — you look at the grid and read the smallest number left
on it. A fresh grid reads 0.

Twenty-one cells, and **the twenty-first unit burnt is the one that bids the line up by six
for the rest of the game** — which on the swing ruler is two places of rally before a die is
thrown. Tokens never come off. That is not an accounting convenience, it is the model: the
ore is burnt, and burnt ore does not go back in the hill. The town that owns the last deposit
owns the market, and it always did; this is the version of that sentence you can see across
a table.

### Which delta does a sought good read?

It is the **previous** move, in **bands**, and it is neither of the two things it could have
been.

**Not the current move.** That is the number being computed. A modifier that depends on its
own result is not a rule, it is an equation, and a table asked to solve one has been handed
somebody else's homework.

**Not the change in coin.** 180 to 240 is +60, and no table wants a lookup that turns +60
into a number between −3 and +3. It would also have to be a *different* lookup for every
commodity, because +60 on jewellery is a shrug and +60 on grain is not a thing that can
happen — so the one table would become sixty-six of them, or one table of ratios, which is a
multiplication, which is what this whole redesign was for getting rid of.

The move in bands is already that number. The swing ruler produced it last round, it is
between −3 and +3 by construction, and it is written in the move box on the ledger row where
it happened. **You do not compute the hype modifier. You read the box above the one you are
about to write in.**

It is a feedback loop with a floor, a ceiling and no memory beyond one round, which is
exactly the shape of the thing it is modelling: a rise makes buyers and buyers make a rise,
until a bad roll turns it and the same machinery runs the other way just as fast. Two quiet
rounds and it is back to nothing, because a move of zero is what the next round reads. At
setup nothing has moved, so every sought column starts on nothing and the first round is
played on the dice alone.

**And that is why the board could stop tracking anything.** Two of the four kinds add nothing
at all. The other two read their number off something that was already on the table for
another reason — the depletion grid the pips were going on anyway, and the move box that was
being written anyway. A sought good's whole memory is one pencil figure on a sheet somebody
was filling in regardless. Nothing is remembered, and nothing extra is tracked.

## The two sheets, and the ledger that took the price

The market board was a price tracker: six identical lines of tally, memory and price ladder,
and the whole apparatus existed because the models needed somewhere to remember things. They
do not remember anything now, so there was nothing left for six lines to hold. What is
printed in its place is two sheets, and **neither of them records a price**. The price went
to a third.

### The market board

One A4 landscape sheet that holds no state at all, with nothing on it to move and nowhere to
put a piece.

The **head** is the roll, laid left to right in the order it happens: the dice and what each
colour does, the volatility strip that reads the green one, and the seven-cell swing ruler —
so the head reads as an instruction rather than as a reference. The **body** is four panels,
one per kind of good, each headed by the mark engraved in the corner of that good's own
token, with the strip or grid that kind needs printed inside it: the spoil strip in the
perishable panel, an example depletion grid in the finite one, the −3…+3 range and the
sentence about *last* round in the sought one, and nothing whatever in the staple panel,
which is the point of the staple panel. A player who has picked up a commodity token and
does not know what the fish skeleton in its corner means looks at this sheet and finds out.
The **foot** is the prose: what the spread costs, that the board sells no more of a commodity
than that round's supply roll and will buy any quantity, and that the price is on the ledger
and never here.

It is **one per table** now, where it used to be one per town. A sheet that held a town's
prices had to sit in front of that town's owner; a sheet that holds only rules is a sheet
everybody can read at once, and reading it is the only thing anybody ever does with it.

The panels are drawn from the models themselves rather than laid out, so declaring a fifth
kind of good would be one entry in `pricing.json` and five narrower panels, and not one line
of layout. See [08-components.md](08-components.md#the-market-board).

### The depletion sheet

A second A4 landscape page of identical numbered grids — one per finite commodity in play,
each headed by a hexagonal seat its own token stands in for the whole game. The token is the
label here exactly as it was on the old market lines: a grid is not the coal grid until
somebody stands the coal token in its seat, and the running glass in that token's corner is
what says the grid belongs to it at all.

**It is on its own sheet, and the reason is not room.** This is the only board in the game
that is *spent*. A finished game leaves it covered in pips that are out of the box for good,
and it cannot be put away and got out again the way every other component can. A sheet you
print fresh for every game is a different kind of object from a sheet you keep, and it should
not be printed on the back of one you keep.

Each cell's number is printed small enough to sit **under** the pip that covers it, inside
the pip's own diameter, so a covered cell is a cell whose number has genuinely gone. A number
peeping out from behind the piece that was supposed to have taken it would make *the lowest
one you can still see* a matter of opinion, and the build checks it rather than trusting
anybody's eye.

### The price ledger

The price is written down now, in figures, on one A4 **portrait** sheet — and that sheet is
the only place in this game where a price lives.

**A column is one commodity's whole market.** At the head is a hairline hexagonal seat, and
the commodity's own token stands in it: the token is the label, carrying its family's mark
and, in the corner, the mark that says which of the four kinds of good it is. So a column
head says what this is *and* how it behaves, and neither is printed on the sheet. Nothing on
the ledger names a commodity — a column is not the grain column until somebody stands the
grain token in the seat, and it stops being the grain column when they take it off, which is
the same doctrine the old market lines ran under, inherited by the sheet that took the job
over. Six columns to a sheet, which is a town's real traded list rather than its whole
catalogue; a town dealing in more than six prints a second sheet, which is what a second
sheet is for.

**A row is a round** — one round, not one price change, whether the price moved or not. The
rows run 1 to 24 down the left-hand edge, because a price can change at most once a round,
which makes the round count the honest number of rows and makes the sheet impossible to run
off the bottom of. It also makes *the row above* mean exactly one thing, which the sought
good's rule depends on entirely: in a free-running list that only wrote a row when something
happened, "the row above" would quietly mean two rounds ago on any market that had held.

About three rounds in ten hold, so a column has gaps in it, and **the gaps are the market
holding** rather than the market being ignored. Which of the two a particular gap is, is
what the move box beside it settles.

**Beside each row's figures is the move box**, and it is the only thing on the sheet that is
written rather than filled: how many places the price just stepped, −3 to +3, or a dash if it
held. A dash rather than a nought and rather than nothing — a dash says the roll happened and
came to nothing, an empty box says somebody forgot to roll this column, and those are
different problems. The box earns its width twice over. It is the **record**: a column of
moves is the *shape* of a market at a glance, where a column of prices is only its level. And
for a sought good it is the **rule**.

**Portrait, and the numbers chose it rather than taste.** Landscape gives 273 mm of width —
eleven columns nobody needs — and about 150 mm of history. Portrait gives 239 mm of history
and lands on six columns. A price ledger is a tall thing.

#### The figures are hollow, and you colour them in

Three seven-segment digits per cell, printed as outlines and filled in with a pencil. It is a
stranger idea on paper than it sounds and it is right for four reasons, none of them
decorative.

**A written number is somebody's handwriting and gets argued about. A filled figure is a
figure.** At a metre, across a table, a hurried 5 and a hurried 6 are the same shape in one
person's hand and not in another's — and the number everybody is trading against is the last
thing in this game anybody should be squinting at or taking somebody's word for.

**Filling seven bars is exactly as fast for 188 as it is for 8**, which is not true of
writing. The work is bounded by the figure and not by the value, so the dearest column on the
sheet costs no more to keep than the cheapest. That matters because the dearest columns are
the sought ones, and the sought ones are the columns that move.

**A wrong digit is corrected by filling one more segment rather than by rubbing out.** Nearly
every mis-read of the ruler lands one place away, and one place along a printed row of six is
usually a figure that is a stroke or two off the one beside it. Fill the missing bars and the
cell is right. That is what lets the whole sheet be worked in pencil, at speed, by somebody
who is also arguing about a caravan.

**A struck figure stays readable, where struck handwriting is a smudge.** The gesture the
sheet is built around is ruling a line through last round's price and filling this round's in
underneath, and a history is only worth keeping if the struck entries can still be read. Run
your eye down a column and you have the whole market: where it was, what it did to get here,
and how fast — which is precisely the thing a token standing on a cell could never tell
anybody.

Three digits, because the dearest thing in the game is worth 110 at base and 220 at the top
band; a fourth would be a column of noughts on every sheet ever printed. All seven segments
are printed whether they belong to any particular number or not, because an unlit segment is
what makes a hollow figure read as a *number waiting* rather than as a shape — and drawing
only the lit ones would mean the tool knew the price, which it must not: this sheet is printed
before anybody has rolled anything. Leading zeros are left blank. A price of 8 is a blank, a
blank and an 8, not 008, because nobody has ever written 008 on a ledger.

The ledger and the depletion sheet are the two components in the game that are **consumed by
being used**, and they are consumed differently: a depletion sheet is spent because pieces are
left on it, a ledger because it is written on. Neither can be put away and got out again.
Print one ledger per game per town being traded in, and print a few spares — a game that runs
long or a table that opens a seventh market should not have to stop.

## Who may trade with whom

This was an open question in the brief — merchant figure, trading house, or both. The
answer is both, doing different jobs:

**Merchant figure.** Moves on the board, 4 move points, carries 4 bulk. Wherever it
stands, its owner trades at that town without the spread, and may deal with any player
whose merchant or trading house is in or adjacent to the same town. The merchant is
*reach*: it goes to where the deal is.

**Trading house.** A tier-3 building. Removes the spread permanently in its town, and
connects to any other player's trading house or merchant along a built route, at any
distance. The trading house is *infrastructure*: it makes one town permanently good at
trade instead of chasing deals around the map.

A **merchant specialist** trained at a trading house can additionally broker a deal
between two *other* players and take 10% of the coin. That is the one mechanism that
rewards a player for other people's trade, and it should make the trading-house player
the centre of every negotiation.

## Shopping: merchants met and visited

Items are bought from **merchants** — met on the road through a discovery roll, or
visited in any settlement. Either way the procedure is the same: shuffle the item
deck and deal cards face up. What is dealt is the stock, this visit, at base value
+10%. The stock scales with the place:

| Where | Cards dealt |
| --- | --- |
| Roadside pedlar (discovery result) | 2 |
| Village | 3 |
| Town | 5 |
| City | 7 |
| The Seat | 9 |

A roadside merchant may have nothing you want — or exactly the lantern you were
three hexes short of. A city is a real shop. The numbers live in
`rules.json → market.merchantStock`.

## Inns

Every printed settlement keeps an inn, and a player town can build one. Four jobs:
**a bed** (which restores strength in full and mends no health at all — health needs a
healer or an infirmary, 3 a round), **hirelings** (escorts for one journey, flat fee, no
food), **rumours** (5 coin, draw a quest card), and the old one — **drinks**, clearing
unrest by the recipe. The inn is where the adventure layer and
the economy shake hands.

Brokering, minding a market and loading a caravan all cost effort. Trade competes with
production for the same scarce hours, which is what stops a pure-trading strategy from
being free money.

## Moving commodities

Six modes, in `data/transport.json`. Capacity is bulk, speed is tiles per round.

| Mode | Capacity | Speed | Needs | Theft risk |
| --- | --- | --- | --- | --- |
| Porter | 3 | 2 | — | ★ |
| Cart | 8 | 2 (4 on road) | — | ★★ |
| Caravan | 24 | 2 (3 on road) | Road | ★ |
| Barge | 30 | 3 | Dock | ★★ |
| Ship | 60 | 4 | Harbour | ★★★ |
| Train | 80 | 6 | Rail depot | ★★ |

A porter is a worker who is gone for the whole journey — they do not roll a die for you
while they are walking, which makes the cheapest transport in the game quietly the most
expensive.

**Packaging.** Every mode needs crates and sacks, which travel with the cargo and come
back with the empty vehicle. This is what gives containers a job and is a small,
constant reason to keep a carpenter busy.

**Cargo in transit is a token on the board.** Everybody can see it. It can be robbed by
event cards and raided by players. A caravan with a soldier escorting it drops to zero
theft risk — and the soldier eats every round whether anything happens or not.

## Why moving things matters

Because prices differ by town and bulk differs by commodity. The whole logistics puzzle
is the interaction of three numbers:

- **value per slot** — is this worth the capacity it eats?
- **speed** — will the price still be good when it arrives?
- **perishability** — will it still be food when it arrives?

Salted meat is the clearest example in the data, and the spoil die sharpened it rather than
blunting it. Meat is 10 coin, perishable, and keeps *poorly* — the ochre die takes one, two
or three of it at the end of every single round it is in your hands, including every round
it spends on a barge. Salt it and it is 18 coin and a **staple**: it adds nothing, it is
never rolled against, and it can sit in a hold for the length of a sea voyage without
anybody thinking about it. That single recipe is what makes long caravans and sea voyages
possible at all, and it is why a salt dome is worth more than its face value suggests. Under
the old countdown the difference was a number of rounds you could plan against; under the
die it is a risk you carry every round, which is a better reason to pay for the salt.
