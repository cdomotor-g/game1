# 00 — Overview

## What this is

A settlement-and-economy game where you turn worker-hours into buildings, buildings
into production chains, and production chains into food, wealth and the ability to
survive whatever the event deck does to you next.

Around that economic core an **open world** has grown: a drawn continent to travel
by day and night, discovery rolls that fill the map in as it is walked, monsters to
slay or befriend, mana and talismans, quests you may accept or decline, and named
vehicles and characters. The register it aims for is a tabletop cross of a
city-builder, a trading-tycoon game and an open-world adventure — the economy is
the progression system, and the adventure layer is a new set of ways to spend hours
and new things the hours can buy. See [13-adventure.md](13-adventure.md).

It is designed as a **board game first**, with a **digital twin** built from the same
data. Neither is a port of the other: they read the same `data/*.json` files, so a
change to a recipe changes the printed reference sheet and the web prototype at once.

## The one-paragraph pitch

Workers live in houses. Each round every worker rolls a die, and the pips are hours of
effort. You spend those hours on jobs — felling trees, digging clay, minding a furnace,
raising a wall. Jobs need a place, usually a tool, and usually something to work on.
At the end of the round everybody has to eat, and whatever you could not feed turns
into unrest. Everything else in the game — trade, rail, magic, war — is a way of
getting more hours, better hours, or more out of each hour.

## Design pillars

**1. Effort is the real currency, not coin.**
Coin is useful. Hours are scarce. Every interesting decision in the game is "what do I
do with these eleven hours?" — and the answer changes when a die comes up 2. Coin is not
even weightless any more: it is 25 g a piece, forty to the kilogram, on the same scales as
the sword and the rope, so a strength-3 figure could shoulder 360 of it and nothing else.
A fortune is a thing that has to be *carried home*, which was the last place coin could
still pretend to be pure score.

**2. Everything is a chain, and you can always see the whole chain.**
Steel is coal plus iron plus a smelter plus a steelworks plus four hours. That should
be legible at a glance, which is what the explorer's Chains view is for. Depth should
feel like an achievement, not like homework.

**3. Hand labour is always possible; tools multiply it.**
You can gather deadwood with your hands and pick field stone off a hillside. You cannot
mine coal without a pick. The line is drawn so that a player who loses everything can
always claw back to a market — see [11-bootstrap.md](11-bootstrap.md) — while tools
still feel like the thing that changes your life.

**4. Every disaster should be traceable to a decision.**
Event cards hit hard. Each one carries at least one mitigation a player could have
bought in advance: a watchtower, a granary, a soldier escorting the caravan. Being
wiped out by bad luck alone is a design failure.

**5. Several ways to win.**
Prosperity, industry and network score separately, so a mining-and-rail game and a
farming-and-trade game can both end in a win.

## Scope: board and digital

| | Board game | Digital |
| --- | --- | --- |
| Status | Primary design target | Prototype, and the design instrument |
| Board | Hex tiles, face down until explored | Not yet — the sandbox is one town |
| Players | 2–5 | 1 (sandbox) |
| Rules source | `data/*.json` → printed sheets | `data/*.json` → `docs/js/engine.js` |

The digital side is not a stretch goal bolted on afterwards. It is how the numbers get
tested: `tools/simulate.mjs` plays whole games headlessly and reports what the economy
actually did. Three genuine design faults were found that way before a single card was
printed — see [12-what-simulation-found.md](12-what-simulation-found.md).

## Reading order

| Doc | What it covers |
| --- | --- |
| [01-core-loop.md](01-core-loop.md) | The round, effort dice, allocation |
| [02-economy.md](02-economy.md) | Commodities, recipes, tools, buildings |
| [03-map-and-movement.md](03-map-and-movement.md) | Tiles, terrain, exploration, rail |
| [04-trade.md](04-trade.md) | Markets, merchants, moving goods between towns |
| [05-people-and-food.md](05-people-and-food.md) | Population, feeding, unrest, specialists |
| [06-events.md](06-events.md) | The event deck and its effect vocabulary |
| [07-peoples-magic-conflict.md](07-peoples-magic-conflict.md) | Peoples, potions, war |
| [08-components.md](08-components.md) | What is in the physical box |
| [09-digital.md](09-digital.md) | The web build and where it simplifies |
| [10-open-questions.md](10-open-questions.md) | What is still undecided |
| [11-bootstrap.md](11-bootstrap.md) | Why the opening cannot deadlock |
| [12-what-simulation-found.md](12-what-simulation-found.md) | Findings from the simulator |
| [13-adventure.md](13-adventure.md) | Travel, discovery, monsters, mana, quests — the open world |
| [14-annex.md](14-annex.md) | Every reference table, generated from the data |
| [../GLOSSARY.md](../GLOSSARY.md) | Commodity vs effort vs deposit, and the rest |
| [../art/README.md](../art/README.md) | What all of it looks like, in both editions |

## Status

Early. The data is complete enough to explore and to play a single-town sandbox; none
of the numbers are balanced, and the board layer does not exist yet. See
[10-open-questions.md](10-open-questions.md) for the honest list.
