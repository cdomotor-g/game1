# game1

A settlement-and-economy game for the table, with a digital twin built from the same
data.

Workers live in houses. Each round every worker rolls a die, and the pips are hours of
effort. You spend those hours on jobs — felling trees, digging clay, minding a furnace,
raising a wall. Jobs need a place, usually a tool, and usually something to work on. At
the end of the round everybody has to eat, and whatever you could not feed turns into
unrest. Everything else — trade, rail, magic, war — is a way of getting more hours,
better hours, or more out of each hour.

This repository is the design scaffold: the rules as structured data, the documents that
explain them, and a web build that lets you browse and play with them.

## Try it

```bash
node tools/build-data.mjs     # generate web/data/bundle.js from data/*.json
open web/index.html           # or just double-click it
```

No install, no dependencies, no server. The page works straight off disk.

You get two things:

- **The explorer** — every commodity, recipe, building, tool, event card and terrain
  type, cross-linked. Click steel to see the whole chain behind it, the effort per unit,
  and everything it goes on to make.
- **The sandbox** — a playable single-town slice using the real rules. Roll effort,
  allocate it, put up buildings, forge tools, feed your people, live with the event deck.

And a third, in the terminal:

```bash
node tools/simulate.mjs --games 20    # play 20 games headlessly, report the economy
```

## Layout

```
data/          the rules as data — the single source of truth
  rules.json         tunable constants: round, effort, food, storage, market, victory
  commodities.json   63 storable, tradeable goods
  recipes.json       83 jobs effort can be allocated to
  buildings.json     51 things you can construct
  tools.json         15 tools, with durability
  terrain.json       12 tile types, movement and build costs
  deposits.json      what is buried under the map
  transport.json     cargo modes, routes, figures
  peoples.json       5 playable peoples, 10 professions
  events.json        the 58-card event deck
  items.json         clothing, armour, weapons, potions
  manifest.json      index of all of the above, plus reference checks
  schema/            JSON Schema documentation of every shape

docs/
  GLOSSARY.md        commodity vs effort vs deposit — read this first
  design/            twelve design documents, see docs/design/00-overview.md

tools/
  validate-data.mjs  referential integrity and design smells
  build-data.mjs     data/*.json → web/data/bundle.js
  simulate.mjs       headless playthroughs, for balance

web/               the explorer and the sandbox
  js/engine.js       the rules, with no DOM in it
  js/data.js         indexes and graph queries, with no rules in it
```

## Working on it

```bash
node tools/validate-data.mjs   # check the data
node tools/build-data.mjs      # rebuild the web bundle
node tools/simulate.mjs        # see whether it still plays
```

The validator does more than resolve ids. It flags commodities nothing produces,
commodities nothing consumes, tools and recipes that disagree about which enables which,
and buildings with worker slots no recipe can use. Those warnings are design feedback:
a commodity nothing consumes is usually a missing recipe, not a typo.

**After editing anything in `data/`, run `build-data.mjs`** or the web build will show
you stale numbers.

### The one rule about the data

`data/*.json` is the source of truth for both the board game and the digital one. Prose
belongs in `summary`, `notes` and `effect` fields; anything a program should act on
belongs in a typed field. When you find yourself writing the same rule into `effect`
twice, that is the signal to add a field for it.

## Status

Early, and honest about it.

**Done:** the full commodity and production graph, buildings, tools with wear, terrain
and deposits, the event deck, peoples and professions, transport modes, equipment and
potions. A browsable explorer over all of it. A playable single-town sandbox. A headless
simulator.

**Not done:** the board itself — no map, no movement, no transport in play, no second
town, no other players, no combat resolution. Worker slots are defined but not enforced.
Most of the peoples' traits are approximated. Nothing is balanced.

**Found so far:** the simulator caught two circular dependencies that made the economy
literally unstartable, a farming chain gated behind heavy industry, a starting position
that began in storage overflow, and an unrecoverable state if your last axe broke. All
fixed; the write-up is in
[docs/design/12-what-simulation-found.md](docs/design/12-what-simulation-found.md).

**Undecided:** whether effort is a town-wide pool or placed per worker; how commodity
tokens work physically; whether 24 rounds is right; how a second town gets founded. The
full list is in
[docs/design/10-open-questions.md](docs/design/10-open-questions.md).

## Where to start reading

1. [docs/GLOSSARY.md](docs/GLOSSARY.md) — the vocabulary, especially commodity vs effort
2. [docs/design/00-overview.md](docs/design/00-overview.md) — pillars and scope
3. [docs/design/01-core-loop.md](docs/design/01-core-loop.md) — the round and the dice
4. [docs/design/11-bootstrap.md](docs/design/11-bootstrap.md) — the one rule not to
   "tidy up" without reading why it exists
