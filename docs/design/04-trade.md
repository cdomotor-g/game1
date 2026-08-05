# 04 — Trade, markets and moving goods

## Two kinds of trade

**With the board** — buying and selling at a market at the current price band, paying a
15% spread each way. Always available, never a good deal, and the reason nobody ever
gets truly stuck.

**With other players** — any goods, any coin, any price the two of you agree. No spread,
no limit, and no enforcement beyond the table. This is where the game should get loud.

## Price bands

Every commodity category sits on a band: ×0.5, ×0.75, ×1.0, ×1.25, ×1.5 or ×2.0 of base
value. Bands start at ×1.0 and drift one step each round for one random family. Event
cards shove them harder — an iron shortage moves metals two bands for three rounds.

Bands are per family, not per commodity, so a shortage is a *market* event you can plan
around, not a lookup table you have to memorise.

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
