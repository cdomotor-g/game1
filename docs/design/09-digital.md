# 09 — The digital build

## What exists

`docs/index.html` is a single page with no build step, no dependencies and no network
requests. Open it from disk and it works.

Two things live in it:

**The explorer** — browsable views of every dataset, cross-linked. Click a commodity to
see everything that makes it, everything that consumes it, everything it builds. The
**Chains** view draws the full production tree for anything and reports the effort hours
per unit all the way to the ground.

**The sandbox** — a playable single-town, single-player slice using the real rules. Roll
effort, allocate it, found buildings, forge tools, trade, feed everyone, take the
consequences.

## Architecture

```
data/*.json                   the single source of truth
  ↓  tools/build-data.mjs
docs/data/bundle.js           generated: window.GAME_DATA
  ↓
docs/js/data.js               indexes and graph queries — no rules
docs/js/engine.js             the rules — no DOM
docs/js/views.js              the explorer
docs/js/sandbox.js            the sandbox UI
docs/js/app.js                tabs, search, drawer
```

The important line is between `engine.js` and everything above it. The engine takes a
state object and returns a state object; it does not know what a button is. That is what
lets `tools/simulate.mjs` load the same engine in Node and play thousands of rounds
headlessly, and it is what a future multiplayer board layer would build on.

### Why a generated bundle instead of `fetch`

Browsers refuse to `fetch()` a local file, and `<script type="module">` has the same
problem over `file://`. A generated `bundle.js` loaded by a plain `<script>` tag is the
only way to keep `data/*.json` as the single source of truth *and* keep the page
openable by double-clicking it with no server and no install. Run
`node tools/build-data.mjs` after editing any data file.

## What the sandbox implements faithfully

Effort dice and the modifier ladder · tool durability and breakage · recipe inputs,
outputs and variants · fuel bundles with output penalties · maturation waits · crop
sowing, growth and harvest · construction with build-points and a minimum-rounds floor ·
storage caps and overflow · feeding, unrest and the variety bonus · market price bands
and the spread · specialist training · the event deck.

## What it simplifies, and where the table rule differs

Each of these is marked `SIMPLIFIED` in `engine.js`.

**Spoilage.** The tabletop rule ages each batch and loses it after `perishRounds`. The
sandbox has nowhere to track batch ages, so what is left after the meal loses a quarter
of its stack per round unless a granary shelters it. Feeding happens before spoilage —
you eat the fresh food first.

**Peoples' traits.** Several are written as die-size changes for workers at a particular
site ("dwarves roll d8 in a mine"). The sandbox rolls one pool of hours for the whole
town, so there is no per-site die to step; those traits are approximated as output
multipliers. This is a genuine design tension, not just an implementation gap — see
[10-open-questions.md](10-open-questions.md).

**One town, no board.** There is no map, no movement, no transport, no other players.
Terrain and deposits are a fixed list the town simply has. Everything in
[03-map-and-movement.md](03-map-and-movement.md) and [04-trade.md](04-trade.md) is
designed but not implemented.

**Events.** Effort modifiers, crop advances/pauses and price shifts resolve
automatically. Anything targeted, local, or offering a choice is logged for the player
to resolve, because a single-town prototype has no "one region" to apply.

**Worker slots** are defined on every building but not yet enforced in the sandbox —
the effort pool is town-wide rather than per-site.

## The simulator

```bash
node tools/simulate.mjs                        # one game, printed round by round
node tools/simulate.mjs --people dwarf --seed 7
node tools/simulate.mjs --games 20             # aggregate across seeds
```

It plays with a simple policy: sow before eating the seed, feed the town, replace broken
tools, sell the surplus, build the next thing on a wish list, then whatever pays best
per hour. It is a balance instrument, not a test — if it reports that a competent
opening starves in round 4, the numbers are wrong, not the bot.

It has already earned its keep: see
[12-what-simulation-found.md](12-what-simulation-found.md).

## Where this goes next

The natural order, in rising cost:

1. **Enforce worker slots** — needs allocation per site rather than a town pool.
2. **The board** — hex grid, tiles, figures, fog. The largest single piece.
3. **Multiple towns** — stockpiles per town, and food that has to be *where* the people
   are, which is what makes transport matter.
4. **Transport and routes** — cargo tokens moving over rounds.
5. **Multiplayer** — hot-seat first. The engine is already shaped for it: state in,
   state out, no hidden globals.
6. **A card generator** — render printable components from the same data, so the
   physical game cannot drift from the digital one.
