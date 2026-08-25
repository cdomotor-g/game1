# 04 — Trade, markets and moving goods

## Two kinds of trade

**With the board** — buying and selling at a market at the current price band, paying a
15% spread each way. Always available, never a good deal, and the reason nobody ever
gets truly stuck.

**With other players** — any goods, any coin, any price the two of you agree. No spread,
no limit, and no enforcement beyond the table. This is where the game should get loud.

## Price bands

Every commodity sits on a band: ×0.5, ×0.75, ×1.0, ×1.25, ×1.5 or ×2.0 of base value.
Bands start at ×1.0. Event cards shove them by family — an iron shortage moves metals two
bands for three rounds — but what moves them every round is the roll below.

## How a price is arrived at

Prices used to *drift*: one random family, one band, every round. It was a rule you could
not plan against and could not affect. A player could sell four hundred grain into one town
and the grain price would not notice.

A price is rolled now, and then bent by what the market has already been through.

**Two red dice are demand. Two blue dice are supply. One green die says how hard the swing
lands.** The whole sum is one line, and it is printed across the foot of the market board:

```
net = (Demand − Supply + Memory) × Elasticity
```

The green die is the elasticity: **1–2 stable** (×1, an ordinary season), **3–4 volatile**
(×2, a thin market with nobody willing to stand in the middle of it — this is where crashes
and spikes come from), **5–6 inelastic** (÷2 dropped toward zero: the town needs it whatever
it costs, or cannot use a second one at any price).

Then read the net on the **swing ruler**, seven cells across the foot of the board, and walk
the price token that many bands:

| Net | ≤ −16 | −15…−8 | −7…−2 | −1…+1 | +2…+7 | +8…+15 | ≥ +16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bands | −3 | −2 | −1 | hold | +1 | +2 | +3 |
| | crash | slump | soften | hold | firm | rally | spike |

With nothing remembered that is a market which holds still in about three rounds in eight,
moves a band in half of them, and jumps two or three in the rest. `docs/markets/index.html`
prints the exact odds, worked out from the ruler itself rather than claimed, at every value
the memory can hold.

One more rule, and it is what makes a shortage bite: **the board sells no more of a
commodity in a round than that round's supply roll**, first come first served in turn order.
It will buy any quantity — a market always has room for more of what nobody wants. A low
blue roll is a shortage twice over: dear, and rationed.

## What a market remembers

The dice are only half of it. Every line on the market board carries two strips, and they
are the reason a market has a history instead of a mood.

The **memory** is a modifier from −3 to +3, walked by a bar, added to the swing before the
green die multiplies it — so in a volatile season a market's history counts double, like
everything else about that season. The **tally** beside it is the board's own stock of that
commodity: sell to the board and the bar walks up, buy from it and the bar walks back down.
Every five tokens the tally fills, which takes it back to empty and steps the memory one
cell. Nothing is written down; two pieces of wood are moved as the trade happens.

**What direction it steps is the commodity's own business.** Every commodity in the game
runs under exactly one of three models, and the model is engraved in the corner of that
commodity's token — so the piece you stand on a line tells you how that line behaves.

| | | What it is | Commodities |
| --- | --- | --- | --- |
| ⛰ | **Glut** | What does not sell rots. A good harvest is a bad year: the stuff turns up whether anybody wants it or not, and what is still in the warehouse when the season turns has to be shifted at whatever it will fetch. A full tally steps the memory **down**, floor −3, and it walks back toward zero on any round the board is holding none. | 45 — everything grown, felled, herded or made to order |
| ↗ | **Hype** | It is bought because it is going up. Nobody *needs* a jewel or a famous horse; they want it for what owning it says, and that is loudest when the price is climbing. No tally: the memory moves one cell in whatever direction the price token just moved, in the same gesture, −3 to +3. | 7 — gold, jewellery, spices, fine cloth, wine, mead, horses |
| ⧗ | **Depletion** | The easy ore came out first. Every ton that leaves makes the next dearer to win, and none of it grows back. Tokens sold to the board go on the tally and never come off. A full tally steps the memory **up**, and that step is **permanent** — the only mark in this game that never comes back. | 14 — everything a deposit yields, and what is smelted straight out of one |

The split runs down a production chain rather than across a category, which is the point of
it being on the commodity. **Gold ore depletes and refined gold hypes**: the same substance,
two markets, one priced by the hole it came out of and the other by what people think it is
worth this month. Iron ore, pig iron and steel all deplete; the ironware made out of them is
a glut good, because by then it is a workshop's output and a workshop can decide to make
more.

`tools/validate-data.mjs` checks the half of that rule that can be checked: a commodity a
deposit yields and does not price by depletion is a hole in the ground that never runs dry.

### The market board

The bands used to be a number in a rulebook and a sum done in somebody's head. They are a
sheet now: one A4 landscape **market board** of identical market lines. Each line is three
strips read left to right — a **tally**, a **memory**, and the **price ladder** the
commodity's own hexagonal token walks. Where the token stands is the price; which token it
is says what the price is of; and the mark in its corner says which of the three models the
strips are running under. Look at the table and you can see what everything is worth and
why.

The foot of the sheet is the working half: the five dice, the elasticity strip that reads
the green one, and the swing ruler. Everything a Market phase needs is on one piece of
paper.

**No line is labelled**, and that is still the design. A line is not the grain line until
somebody puts the grain token on it, so one generic board serves any commodity, any town and
any table — print another sheet for another town's market, and a sixty-seventh commodity
reprints nothing. Six lines to a sheet, which is a town's real traded list rather than its
whole catalogue; see [08-components.md](08-components.md#the-market-board).

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

Salted meat is the clearest example in the data. Meat is 10 coin and perishes in 2
rounds; salt it and it is 18 coin and never perishes. That single recipe is what makes
long caravans and sea voyages possible at all, and it is why a salt dome is worth more
than its face value suggests.
