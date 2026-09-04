# game1

A settlement-and-economy game for the table, with an open world growing around it and
a digital twin built from the same data.

Workers live in houses. Each round every worker rolls a die, and the pips are hours of
effort. You spend those hours on jobs — felling trees, digging clay, minding a furnace,
raising a wall. Jobs need a place, usually a tool, and usually something to work on. At
the end of the round everybody has to eat, and whatever you could not feed turns into
unrest. Everything else — trade, rail, magic, war — is a way of getting more hours,
better hours, or more out of each hour.

And around that core, an adventure: a drawn continent travelled by day and night,
discovery rolls that fill the map in as it is walked, monsters to slay or befriend,
mana held in talismans, quests to accept or decline, and named trains, ships and
horses with histories. The register it reaches for is a tabletop cross of a
city-builder, a trading-tycoon game and an open-world adventure — the economy stays
the progression system. See
[docs/design/13-adventure.md](docs/design/13-adventure.md).

This repository is the design scaffold: the rules as structured data, the documents that
explain them, and a web build that lets you browse and play with them.

## Try it

**[cdomotor-g.github.io/game1](https://cdomotor-g.github.io/game1/)** — the current `main`,
rebuilt and published on every push.

Or locally:

```bash
node tools/build-data.mjs     # generate docs/data/bundle.js from data/*.json
open docs/index.html          # or just double-click it
```

No install, no dependencies, no server. The page works straight off disk.

The site lives in `docs/` because that is the only folder besides the repository root
that GitHub Pages will publish. Read [Publishing](#publishing) before moving it.

You get five things:

- **The explorer** — every commodity, recipe, building, tool, event card and terrain
  type, cross-linked. Click steel to see the whole chain behind it, the effort per unit,
  and everything it goes on to make.
- **The sandbox** — a playable single-town slice using the real rules. Roll effort,
  allocate it, put up buildings, forge tools, feed your people, live with the event deck.
- **The map** — a drawn continent with the hex board read off it, and a print page that
  tiles it across four sheets of A4 for the table. See [Maps](#maps).
- **The cards** — the adventure decks drawn from the same data, and a print page that
  collates them onto A4 at a true 63 × 88 mm with a dotted line round each one to cut
  along. See [Cards](#cards).
- **The boards** — the [player board](#the-player-board), the
  [market board](#the-market-board) and the [mini-map sheets](#mini-maps), all A4
  landscape, all computed rather than laid out.
- **The mint** — how the art gets made: the designer/artist pipeline, the set-up
  instructions, and the live worklist of what is waiting on what. See
  [The mint](#the-mint).

And a third, in the terminal:

```bash
node tools/simulate.mjs --games 20    # play 20 games headlessly, report the economy
```

## Layout

```
data/          the rules as data — the single source of truth, one file per system
  rules.json         tunable constants: round, effort, food, rest, hirelings, victory
  commodities.json   66 storable, tradeable goods, each with its market-memory model
  recipes.json       87 jobs effort can be allocated to
  buildings.json     52 things you can construct
  tools.json         15 tools, with durability
  terrain.json       10 tile types with single-letter codes, movement and build costs
  travel.json        speeds by mode, terrain code and time of day; night and caves
  discovery.json     the d20 tables: what the land does back when you stop on it
  deposits.json      what is buried under the map
  maps/              boards: a hex grid read off a drawn map, one file per map
  transport.json     cargo modes, routes, figures
  peoples.json       5 playable peoples, 11 professions, who can hold mana
  events.json        the 69-card event deck
  items.json         clothing, armour, weapons, potions, lights, talismans
  arcana.json        elements, mana and the spell list
  monsters.json      the monster deck — slay, enslave, befriend or domesticate
  vehicles.json      the vehicle deck — named trains, ships, caravans, horses
  characters.json    the character deck — health, strength, mana, gold
  quests.json        the quest deck — mini-quests and campaigns
  campaigns.json     the two modes - free play and campaign - the campaigns, and the
                     campaign deck: a storyline read in order. First: Homer's Odyssey
  pricing.json       how a price is arrived at: the blue, red, green and ochre dice, the
                     swing ruler, and the four kinds of good a commodity can be. All
                     addition — nothing multiplies and nothing is halved
  marketboard.json   the market board and the depletion sheet: how a price moves, and
                     the grids that only ever go one way
  ledger.json        the price ledger: the only place a price lives
  minimap.json       the mini-map sheets: one world hex, opened out
  mint.json          the mint's lines: cards, maps, and tiles while shelved
  manifest.json      index of all of the above, plus reference checks
  schema/            JSON Schema documentation of every shape

docs/          the published website AND the design documents — see Publishing
  index.html         the explorer and the sandbox; this is what Pages serves
  css/, js/          the app — js/engine.js is the rules with no DOM in it,
                     js/data.js is indexes and graph queries with no rules in it
  data/bundle.js     generated from data/*.json, and committed
  .nojekyll          serve docs/ as-is instead of running it through Jekyll
  map/               the map: the plate, an interactive viewer, and print sheets
                     see docs/map/README.md for the whole pipeline
  minimaps/          the zoom-in sheets. sheets/ is GENERATED from
                     tools/build-minimaps.mjs — a flat terrain colour and a
                     hex grid whose cells are world hexes, no art at all.
                     index.html shows them, print.html asks which ground and
                     how many and puts those on A4 landscape at true size.
                     img/ is the shelved drawn set, kept as-is. See its README
  cards/             GENERATED card fronts for the adventure decks, from
                     tools/build-cards.mjs — index.html shows the set,
                     print.html lays it out on A4 with lines to cut along
  boards/            GENERATED player board, from tools/build-board.mjs —
                     index.html shows it and prints it on A4 landscape at
                     true size. One board, the same for every player
  tiles/             GENERATED building tiles, from tools/build-tiles.mjs —
                     one face and one back per building and per sown crop, cut
                     to one, two, three or four world-hex cells. index.html
                     shows them and prints every one at its true size
  markets/           GENERATED market board and depletion sheet, from
                     tools/build-market.mjs — the roll across the head and one
                     panel per kind of good under it, and a page of numbered
                     grids covered a pip at a time as a seam is worked out.
                     Neither sheet holds a price and nothing on either names a
                     commodity
  ledger/            GENERATED price ledger, from tools/build-ledger.mjs — A4
                     portrait, six commodity columns by twenty-four rounds, every
                     price three hollow seven-segment figures the players colour
                     in and strike through. The only place a price lives
  book/              GENERATED single-page design book from design/*.md, via
                     tools/build-book.mjs — readable and printable on the site
  mint/              GENERATED single page from MINT-SETUP.md, MINT.md and the
                     live queue, via tools/build-mint.mjs — the readable version
  GLOSSARY.md        commodity vs effort vs deposit — read this first
  MINT.md            the mint: one pipeline, one line per kind of thing minted —
                     cards, maps, and tiles while they are shelved
  MINT-SETUP.md      how to set the designer and the artist up, and what to
                     paste where. The how-to; MINT.md is the what
  CARD-MINT.md       a signpost: the card mint became the mint
  design/            fifteen design documents, see docs/design/00-overview.md
                     14-annex.md is GENERATED by tools/build-annex.mjs
  art/               the visual style guide, see docs/art/README.md
    palette.json       the palette as data — five inks, one black, one paper
    framing.json       where the subject sits on each plate, so a card window
                       and a thumbnail crop to the subject and not the middle
    prompts/           commissioning briefs — one file per mint line: peoples,
                       monsters, characters, vehicles, talismans, modifications
                       and maps; renders land in art/renders/ or docs/map/
    renders/           the accepted renders, one per prompt id — see its README
    icons/             GENERATED element marks, from tools/build-icons.mjs
    mint/QUEUE.md      GENERATED worklist: every subject the mint has declared
                       that is not a finished thing yet, per line
    examples/          worked examples of the two-plate system

tools/
  validate-data.mjs  referential integrity and design smells
  validate-art.mjs   palette conformance and the ink/wash layer contract
  validate-map.mjs   boards against terrain.json, and against themselves
  build-data.mjs     data/*.json → docs/data/bundle.js
  build-annex.mjs    data/*.json → docs/design/14-annex.md, the rulebook's tables
  build-cards.mjs    data/*.json + art/renders → docs/cards/, fronts and backs
  build-board.mjs    data/playerboard.json + components.json → docs/boards/
  build-icons.mjs    data/{arcana,pricing}.json → docs/art/icons/, the marks
  build-book.mjs     docs/design/*.md → docs/book/index.html, printable
  build-mint.mjs     MINT-SETUP.md + MINT.md + QUEUE.md → docs/mint/index.html
  build-map.mjs      map proof sheets, and the derived print sizes
  mint-queue.mjs     which subjects are waiting on a brief, a plate or a tie-back
  trace-map.mjs      reads a drawn map and proposes a hex grid for it
  simulate.mjs       headless playthroughs, for balance
  lib/               a dependency-free PNG reader/writer, hex geometry, a 3x5 font,
                     the plate-cropping maths the explorer also runs, the mint's
                     line machinery, and the markdown-to-page renderer
```

**The layout is modular on purpose.** One file per system in `data/`, one document per
subject in `docs/design/`, one prompt file per deck in `docs/art/prompts/`. The rules
have grown past the point where any single file could hold them without blowing the
context window of the people — and agents — who work on them, so nothing here should
require reading everything: a change to monsters touches `monsters.json`, its prompt
file and the annex, and the validators say if it touched anything else.

## Publishing

**The published site is `docs/`. Not a build output, not a copy — the committed files
in `docs/` are what the world gets.** If you are an agent or a person about to tidy the
layout, read this section first; it is the one piece of this repository whose shape is
dictated from outside.

### Why the site is in `docs/`

GitHub Pages can publish from exactly two places when it deploys from a branch: the
repository root, or a folder named `docs/`. Those are the only two entries in the
folder dropdown, and no setting anywhere adds a third. The site used to live in `web/`,
which meant Pages could not be pointed at it at all — picking the root instead served a
rendered `README.md`, which is what a repository root looks like to Pages.

So `docs/` holds both the site and the design documents. That is a little untidy to
read, and it is the price of the site being reachable. **Renaming `docs/` back to
`web/`, or to anything else, takes the site down.**

### How to set it up in the repository settings

Settings → Pages → Build and deployment. There are two modes and this repository
supports both, publishing the identical `docs/` tree either way:

| Source | What to set | Who publishes |
| --- | --- | --- |
| **Deploy from a branch** | Branch `main`, folder **`/docs`** | GitHub, straight from the commit |
| **GitHub Actions** | nothing else to set | `.github/workflows/deploy-pages.yml` |

Either is fine. If the site is currently showing the README, the repository is in
branch mode with the folder still set to `/ (root)` — change the folder to `/docs`.

One trap worth knowing, because it is what caused the original confusion: **the branch
and folder dropdowns only exist in "Deploy from a branch" mode.** If you are looking
for them and cannot find them, the source is set to "GitHub Actions", and the deploy
workflow decides what gets published instead.

### What the workflow does, and does not do

`.github/workflows/deploy-pages.yml` asks the API which mode the repository is in
before it deploys anything. In branch mode it deliberately does nothing — GitHub is
already publishing `docs/`, and a second publisher would only fight the first. It never
changes the Pages source setting, so whichever mode you choose stays chosen.

What it always does, on every push and every pull request, is validate `data/` and
check that the committed `docs/data/bundle.js` still matches it.

### `docs/data/bundle.js` is generated *and* committed

That combination is unusual, so: the explorer has to work when you double-click
`docs/index.html` off disk, and a browser will not `fetch()` a local file. A generated
script tag is the only way to keep `data/*.json` as the single source of truth and keep
the page openable with no server. Committing it is also what makes branch-mode
publishing possible at all, since GitHub serves the commit as-is with no build step.

The cost is that a stale commit means a site quietly showing stale numbers, so CI
rebuilds the bundle and fails if the result differs. **After editing anything in
`data/`, run `node tools/build-data.mjs` and commit the result.**

`docs/.nojekyll` is what stops Pages from running the folder through Jekyll, which
would try to turn the design documents into HTML pages and can fail the build on a code
fence it mistakes for Liquid. Leave it there.

### If you really do want to move the site

Nothing here is sacred, but all four of these change together or not at all: the
files in `docs/`, `OUT_DIR` in `tools/build-data.mjs`, the file list in
`tools/simulate.mjs`, and the `path:` given to `upload-pages-artifact` in the workflow.
And unless you are moving it to the repository root, the Pages source has to become
"GitHub Actions" first — from a branch, `docs/` and the root are the only options.

## Working on it

```bash
node tools/validate-data.mjs   # check the data
node tools/validate-map.mjs    # check the boards
node tools/build-map.mjs       # map proof sheets and print sizes
node tools/build-icons.mjs     # regenerate the element marks
node tools/build-data.mjs      # rebuild the web bundle
node tools/build-annex.mjs     # regenerate the rulebook's reference tables
node tools/build-cards.mjs     # regenerate the card fronts and backs
node tools/build-board.mjs     # regenerate the player board
node tools/build-market.mjs    # regenerate the market board and depletion sheet
node tools/build-ledger.mjs    # regenerate the price ledger
node tools/build-minimaps.mjs  # regenerate the mini-map sheets
node tools/build-tiles.mjs     # regenerate the building tiles
node tools/build-book.mjs      # regenerate the printable design book
node tools/mint-queue.mjs      # regenerate the mint worklist
node tools/build-mint.mjs      # regenerate the mint page on the site
node tools/simulate.mjs        # see whether it still plays
node tools/validate-art.mjs    # check art against the palette
```

The validator does more than resolve ids. It flags commodities nothing produces,
commodities nothing consumes, tools and recipes that disagree about which enables which,
and buildings with worker slots no recipe can use. Those warnings are design feedback:
a commodity nothing consumes is usually a missing recipe, not a typo.

**After editing anything in `data/`, run `build-data.mjs` and `build-annex.mjs`** or
the web build and the printed annex will show you stale numbers. The annex earned its
generator the honest way: the hand-kept deck count said 58 when the data said 60.

### The one rule about the data

`data/*.json` is the source of truth for both the board game and the digital one. Prose
belongs in `summary`, `notes` and `effect` fields; anything a program should act on
belongs in a typed field. When you find yourself writing the same rule into `effect`
twice, that is the signal to add a field for it.

## Status

Early, and honest about it.

**Done:** the full commodity and production graph, buildings, tools with wear, terrain
and deposits, the event deck, peoples and professions, transport modes, equipment and
potions. The adventure layer as data and rules: travel speeds by terrain code and time
of day, the discovery tables, the monster, vehicle, character and quest decks, mana and
talismans, healers and illness. A browsable explorer over the economy. A playable
single-town sandbox. A headless simulator. A generated annex of every reference table.

**Not done:** movement and the adventure layer *in play* — the decks and tables exist,
the digital build does not move a party across the board, and the explorer does not
render the new decks yet. A second town, other players, combat resolution. Worker slots
are defined but not enforced. Most of the peoples' traits are approximated. Nothing is
balanced. 32 of 56 card plates are drawn; the rest are briefs awaiting renders, and
`node tools/mint-queue.mjs` says which. The tile-based board and its zoom-in sheets are
shelved ([#18](https://github.com/cdomotor-g/game1/issues/18)) — the 32 sheets already
drawn stay, and no more are commissioned.

**Found so far:** the simulator caught two circular dependencies that made the economy
literally unstartable, a farming chain gated behind heavy industry, a starting position
that began in storage overflow, and an unrecoverable state if your last axe broke. All
fixed; the write-up is in
[docs/design/12-what-simulation-found.md](docs/design/12-what-simulation-found.md).

**Undecided:** whether effort is a town-wide pool or placed per worker; how commodity
tokens work physically; whether 24 rounds is right; how a second town gets founded. The
full list is in
[docs/design/10-open-questions.md](docs/design/10-open-questions.md).

## What it looks like

Everything is drawn on two printing plates. The **ink plate** carries all the information;
the **wash plate** carries none. Black-and-white is the ink plate printed alone, and colour
is the identical ink plate with the wash printed underneath — not a second version of the
art, and never a desaturation of it.

The register is a working settlement's trade almanac: woodcut line, five muted inks on
unbleached paper, everything hand-made and worn from daily use. Magic is the one exception,
and it is a printing error — arcane subjects print their colour fractionally out of
register so it bleeds past the black line.

The full guide, including the brief for generating art with a model, is in
[docs/art/README.md](docs/art/README.md).

## Cards

**[docs/cards/](https://cdomotor-g.github.io/game1/cards/)** — the adventure decks as card
fronts, plus one back per deck, generated by `tools/build-cards.mjs` from `data/*.json`
and the accepted plates. Nothing in that folder is written by hand: change the data or
re-render a plate, run the tool, and the cards change with it.

**What a card *is*** — its size, its 3.5 mm corner, its frame weights, how its summary
strip is set, what its deck's back looks like — is declared once in
[`data/components.json`](data/components.json) and read from there. That file holds no
content at all: no card says anything in it. Change the corner radius there and the
fronts, the backs, the print sheet and the explorer previews all move together.

**The backs** carry their deck's name mirrored across the card's horizontal centre line,
over engine turning struck from the card's own centre, with a roundel on the axis. A back
with an up and a down is a back that gives the card away, so the symmetry is built rather
than drawn: one half is composed and the other is that same markup under a flip.

**No card carries a bar.** Every number a card has is printed once, as a maximum, in a
row of lettered boxes across the top: `H 10  S 3  D 3  M 0  ¤ 45  KG 9`. The letters are
the player board's own track letters, so setting up is reading across the strip and
putting tokens down left to right. There used to be a numbered ladder up each edge with a
token walking it, which is exactly right for a card held in the hand and no use at all for
one lying in a recess with five others — a card in a recess is a card whose edges are under
the board. Taking them off gave the portrait the full width of the card.

Two things decide what a card looks like beyond its words:

- **The window** is the deck's own shape. A deck's plates are drawn to one proportion and
  its cards need one amount of room for their rules text, so each deck gets the tallest
  window its wordiest card leaves free, in its plates' proportion where that fits.
- **The crop** is taken around the subject, from
  [`docs/art/framing.json`](docs/art/framing.json). A plate is a whole drawn page and a
  card window is not that shape, so something is thrown away; that file says what may not
  be — the head, the hands, the gear the card names. The explorer's thumbnails take the
  same crop through the same code, so a card and a thumbnail never disagree about where
  the subject is. A plate with no entry there is framed on the middle of the page and both
  builders say so out loud.
- **The aim** is a `focal` point — usually a face — that the crop slides to put at 40% down
  the window. `subject` is a veto and `focal` is an aim, and they do different jobs: without
  one, a crop centres on the subject box, and the centre of a standing figure's bounding box
  is their sternum. [`docs/art/09-framing-and-composition.md`](docs/art/09-framing-and-composition.md)
  is the contract, and it is what a new art prompt's `FRAMING.` block is written from.

**[cards/print.html](https://cdomotor-g.github.io/game1/cards/print.html)** is the
print-and-cut page: pick cards, pick paper, and get sheets of them at a true 63 × 88 mm —
nine to a sheet of A4 — each with a dotted line on its edge to cut along. Print at 100%
with scaling off; a cut card is the size of a standard playing card, so it glues straight
onto one. The 3 mm of bleed every card is drawn with is held outside the cut line, where
the blade never goes. Corners are cut at 3.5 mm, which is what a playing card has; each
card carries a faint arc in its bleed showing where the die goes.

Ask it for **backs** and every card you chose gets its deck's back, on a sheet of its own
that follows its front sheet (or joins the others at the end, for a printer you feed twice)
— the same slots, and every row read backwards, because paper is turned over left to right
and turning it over reverses every row. A card picked out of *Card backs* is already a back
and leaves its slot empty rather than closing the row up and sliding the rest off their
fronts. The picker has a **deselect all** beside its select all: it opens with all of them
on, and the page is used far more often for a handful.

### Minting a card

Cards are one **line** of the mint — see [The mint](#the-mint) below. A card only
exists once four things do: an entry in `data/`, a brief in `docs/art/prompts/`, a
plate in `docs/art/renders/`, and a framing entry. Which cards are waiting on what is
computed, not tracked: `node tools/mint-queue.mjs`.

## The player board

**[docs/boards/](https://cdomotor-g.github.io/game1/boards/)** — one A4 landscape board,
the same for every player, generated by `tools/build-board.mjs` from
[`data/playerboard.json`](data/playerboard.json) and the shapes in
[`data/components.json`](data/components.json). Print the page at 100% in landscape and
one comes off a sheet at true size.

A board is a place for the card in play, four more for whatever that card has in play, the
round's phases printed from `rules.json`, and **five numbered tracks up the middle**:

| | Track | A rung | Runs | What walks it |
| --- | --- | --- | --- | --- |
| **H** | Health | 1 | 0–14 | The figure, hurt and mended — medical aid only |
| **S** | Strength | 1 | 0–14 | Set from the card; a rung down for every night without a camp |
| **D** | Defence | 1 | 0–14 | Set from the card. Your opponent reads it, not you |
| **P** | Pace | 1 hex | 0–14 | Hexes left in this leg |
| **M** | Mana | 1 | 0–14 | The body and every talisman in a slot |

**Why the board has the tracks and the cards do not.** Cards used to hang harm off the
left edge and capacity off the right — perfect for a card in the hand, useless for one
lying in a recess with five others, because a card in a recess is a card whose edges are
under the board. So the board took them over and the cards took a summary strip across the
top instead: one place to look, one place to knock the tokens off, and the cards stay flat.

**The ladders are numbered and nothing else** — no rung glyph, no plus, no minus. At a
shade over 11 mm a column, a mark saying which *kind* of number this is was competing with
the figure for the same three millimetres. Which way a token walks is a sentence in the
rulebook, where there is room to say it.

**Every board is identical, and print one more than there are players.** Everything that
differs between an orc and a halfling is printed on the card lying in the recess, so the
board underneath has no business knowing which of them is sitting there. The spare is the
**encounter board**: a discovery roll that turns up a monster or a stranger deals their
card onto it, its tracks are set from the card's summary strip, and it is played like any
other seat at the table until the encounter is over. That is what being generic is for.

**0–14 is the game's ceiling, not just the board's.** `data/playerboard.json` lists every
number a token walks — health, strength, defence, vehicle damage, mana, on characters,
monsters, vehicles, items and peoples alike — and `node tools/validate-data.mjs` sweeps the
lot against the top rung. A fifteenth point of health fails the build rather than walking
off the top of a board somebody has already printed. Kilograms are the one exemption,
because nothing walks a token for them: a load is checked against the limit printed on the
card and that is all.

**Strength swallowed burden.** They were the same arm doing the same job under two numbers
and two tracks — what you swing with, and what you can shoulder. One track now, and what a
figure carries is `strength × 3` kilograms, printed on the card so nobody multiplies at the
table and derived so it can never disagree with the strength beside it.

**Strength and defence settle fights.** Shift the number you need by *less your own
strength, plus their defence*. An even fight still hits on 4+, a point of advantage is
worth exactly one pip, and neither ever adds dice, because dice are what weapons and armour
give you. Clamped to 2+ and 6+, so a dragon is terrifying rather than arithmetic. Defence
is new and is the half of the old strength that had no business being there: strength used
to sit on both sides of the roll, which quietly made every strong thing armoured. A stone
boar barely swings and turns a sword, and now it can say so.

**Sleep and food buy different things.** A round that ends with a figure unfed costs 1
health; a night without a camp costs 1 strength. One night's sleep gives all the strength
back, wherever it is taken, and gives back no health at all — health comes back only under
medical aid. Strength is spent, so sleep returns it; health is damage, so somebody has to
repair it.

**One board for everything in play, including the things that are not people.** A monster
or a stranger a discovery roll turns up is dealt a spare one of these and run like a player
who is not a person — and so is a **vehicle**. A wagon has a hull that takes damage, a load
it can shoulder, a pace along the road and a hold for its cargo, and every one of those is
a track or a slot this board already had. So the sixth track went: there was a **V** on
every board in the game counting damage on somebody else's wagon, and the hull walks the
**health** track now, on the vehicle's own board. The recess says IN PLAY rather than
CHARACTER for the same reason.

**Nothing on the board is placed by hand.** The track columns are whatever width is left
once the card recesses and the gutters have had theirs, and the rungs are whatever height
is left under the heads. Add a sixth track and the columns narrow; nothing runs off the
paper, because nothing was ever positioned. That is also how the V came off without a
single coordinate being touched: five columns share the middle now, over 13 mm each,
against the 11 mm six of them had.

## The market board, and the ledger

**[docs/markets/](https://cdomotor-g.github.io/game1/markets/)** — two A4 landscape
sheets, generated by `tools/build-market.mjs` from
[`data/marketboard.json`](data/marketboard.json), the shapes in
[`data/components.json`](data/components.json), the bands in
[`data/rules.json`](data/rules.json) and the pricing system in
[`data/pricing.json`](data/pricing.json).

**Neither of them holds a price.** That is the change. The board was six identical lines
of tally, memory and price ladder, and the whole apparatus existed because three market
models needed somewhere to remember things. None of them remembers anything now — so the
board became what a sheet in front of everybody is actually good at, which is saying what
the rules are.

The **market board** carries the roll across its head — the dice, the volatility strip,
the swing ruler — and four panels under it, one per KIND OF GOOD, each headed by the mark
engraved in the corner of that good's own tokens and each with its own worked example.
The **depletion sheet** is a page of numbered grids, one per finite commodity in play,
covered a pip at a time as the stuff is burnt and never uncovered.

The whole sum is addition: **two blue dice are demand, two red are supply, one green adds
−2, 0 or +2 for how rough the season is**, and whatever the good's own nature adds goes on
top. Find the net on the swing ruler and step the price that many places. Nothing
multiplies, nothing is halved and nothing rounds.

Four kinds of good, and three quarters of the game is the first of them:

| | Kind | What it adds | And |
| --- | --- | --- | --- |
| ⚖ | **Staple** (34) | Nothing | The dice are the whole story |
| 🐟 | **Perishable** (11) | Nothing | Every stack you still hold at the end of a round faces the ochre spoil die |
| ⧗ | **Finite** (14) | The lowest number still visible on its grid | A pip goes on for every unit *burnt*, never for one traded, and none comes off |
| ↗ | **Sought** (7) | The move it made last round, −3…+3 | Read off the move box on the ledger row above |

## The price ledger

**[docs/ledger/](https://cdomotor-g.github.io/game1/ledger/)** — one A4 portrait sheet,
generated by `tools/build-ledger.mjs` from [`data/ledger.json`](data/ledger.json) and the
shapes in [`data/components.json`](data/components.json). It is the only place in the game
where a price lives.

Six commodity columns across, each headed by a hexagonal seat the commodity's own token
stands in; twenty-four rows down, one per round of the game. Every cell is **three hollow
seven-segment figures** and a small move box. You colour the figures in with a pencil,
strike one through when the price changes, and fill the next one below it.

Hollow figures rather than handwriting, for three reasons: a written number is somebody's
handwriting and gets argued about across a table where a filled figure is a figure;
colouring seven bars is exactly as fast for 188 as for 8; and a wrong digit is corrected by
filling one more segment rather than by rubbing out, which is what lets a struck-through
price stay perfectly readable where struck handwriting is a smudge.

There is no band ladder on it and no token to walk. Every commodity's six prices are
printed as one row of six figures in the annex, so a price move is a **step along that
row** — which is what let the price ladder come off the market board with nothing
replacing it.

## Mini-maps

**[docs/minimaps/](https://cdomotor-g.github.io/game1/minimaps/)** — one A4 landscape
sheet per terrain, generated by `tools/build-minimaps.mjs`. A mini-map is one hex of the
world map opened out: a hexagon of 61 hexagonal cells, an encounter panel and a holdings
panel either side.

**It is a colour, a pattern and a grid.** No render and no plate — so it needs no artist and
no place in the mint queue. The colour is the one that terrain already prints in
(`palette.json terrain[].wash`, already a tint because terrain is the largest printed area
in the game), and the pattern is that terrain's own **map mark** — a grass tuft, a conifer,
two hummocks, a peak — carried as data on the terrain (`terrain.json terrains[].mark`) the
way an element carries one, drawn per `components.json marks.terrain`, three to a cell on
the ink plate at a third strength.

These sheets were a flat colour and nothing else, on the argument that drawn ground competes
with the pieces standing on it. Half right: a *drawn* sheet competes, a mark that quiet does
not, and the mark does the job the colour was failing at — saying which ground this is from
across the table, and saying it in the black-and-white edition where there is no colour at
all. The marks are the world map's own, so a mini-map is the ground of the hex it opens out
rather than a second opinion about it.

**A cell is a world hex — exactly.** 16.7 mm at the map's default four-sheet preset, read
off the map rather than chosen, so a figure based for the campaign board stands in a
mini-map cell without being re-based, a route token cut for one fits the other, and one
ruler measures both. Print the map bigger and the sheets follow. The scale is a fiction and
it is the right one, because everything physical about the two boards agrees.

**[minimaps/print.html](https://cdomotor-g.github.io/game1/minimaps/print.html)** is how they
get onto paper — the same split the cards have, and for the same reason. A mini-map is A4
landscape and full bleed, so a page that could only print the lot printed eleven pages of
solid colour; this one asks which ground and how many copies first, previews the paper at
true size, and takes a terrain in its query string (`print.html?terrain=marsh`) so every
caption on the index, and every terrain in the explorer, links straight to its own sheet.
There is no paper but A4 landscape on purpose: a sheet scaled to fit anything else has cells
that are no longer world hexes, which is the one thing a mini-map promises. It is generated
by the same tool as the sheets, because the paper, the bleed and the cell are numbers that
tool already holds and a print page carrying its own copy of them is a print page that can
disagree with what it is printing.

The thirty-two hand-drawn sheets that preceded this are part of the shelved terrain-tile
board ([#18](https://github.com/cdomotor-g/game1/issues/18)); they stay committed at
`docs/minimaps/img/` and nothing regenerates them.

## Building tiles

**[docs/tiles/](https://cdomotor-g.github.io/game1/tiles/)** — 54 double-sided hex pieces,
49 buildings and 5 sown fields, generated by `tools/build-tiles.mjs`. What you put down when
you build something.

**Not the shelved tiles.** [#18](https://github.com/cdomotor-g/game1/issues/18) shelved a
tile-based *board* — 61 terrain hexes dealt face down so the world is unknown until it is
walked. That stays shelved. A terrain tile is ground that arrives *instead of* a map; a
building tile goes *on* ground the table already has, whichever way it was supplied.

**One cell is one mini-map cell is one world hex** — 16.7 mm, read off the campaign map's
own default print preset by the same function `build-minimaps.mjs` reads it with, so the
three are one fact rather than three that agree. Print the map at the nine-sheet preset and
every tile in the box grows to match.

**How big a building's tile is, is never written on the building.** It is worked out
through the ground model and ladder in `data/buildingtiles.json` and banded onto one of four
polyhex shapes. A hut is one cell; a farm steading two; a warehouse three; a manor and a
pasture four. Add a worker slot to a building and `validate-data.mjs` tells you its tile
grew. That is the answer to *make the scale make sense*: scale is a system, like a price,
not a judgement made fifty-four times.

Three things take room. The **fabric** is the effort it takes to raise, the **holdings** are
its beds, benches, shelves, stock and animals — and the **yard** is what the trade needs in
the open, which no number a building carries has ever said. A tannery is pits, bark stacks
and drying racks and eleven build points; a weaver is a room with looms in it and twelve.
So a building names its yard — `walls`, `yard` or `works`, a closed vocabulary of three,
the same shape as a commodity naming its pricing model. It is a fact about the trade rather
than a size: a shrine and a manor are both `walls`, and the ladder decides that one is a
cell and the other four.

**A farm's fields are their own tiles.** Sowing puts a crop in a field slot with a growth
track, so each sown crop is a one-cell tile laid beside the steading, up to the farm's own
`fieldSlots`. A farm visibly grows on the board as it is sown, a fallow farm looks fallow,
and each crop gets a picture — which one big farm tile with four recesses drawn on it never
could.

**Both sides are drawn.** The face is the building finished; the back is the same ground with
the work not yet done — walls up, rafters open, the material it is being built from stacked
around it and a tool set down. A building takes rounds to raise, so the tile goes down
back-up the round work starts and is turned over when the effort is paid. That makes a tile
**two commissions**, and the mint carries two subjects for every one of them: `tile-hut` and
`tile-hut-site`.

**Both sides carry the same name.** The band says HUT either way up. The picture is what
tells finished from unfinished; the label is what tells one tile from another, and a player
looking into a tray needs that from whichever side is showing.

**The label hugs the bottom-left edge, on every tile.** A band carrying the tile's name runs
along the lower-left edge with the type parallel to it, so the picture is whole and the label
sits in a corner of it. The corner is chosen rather than arbitrary — everything is drawn from
above and to the left, which puts the lit face and the working end of a building on the right
and leaves the bottom-left as foreground ground — and the commission tells the artist to keep
the important detail out of it.
It was a strip ruled corner to corner across the middle, which is the longest band a hexagon
can carry and split every drawing into two unrelated halves. The edge band is about 73% of
that length; nineteen names stopped fitting the day it moved and took a `shortName`, which is
the right way round — a name that has to be shortened is cheaper than a picture cut in
half.

**A tile builds without its plate**, which is where this differs from the cards. A card with
no portrait is a card with a hole in it; a tile with no plate is a blank counter, which is
exactly what a prototype tile is. Every tile is cut, banded and named from the day its
building exists, `tiles/index.html` prints the lot at true size, and a plate landing later
fills the window without moving anything else on the piece. Which plates are still waiting
is in [the mint queue](https://cdomotor-g.github.io/game1/mint/); the briefs are
`docs/art/prompts/buildingtiles.md`.

## The mint

**[docs/mint/](https://cdomotor-g.github.io/game1/mint/)** — how the art gets made, and
what is waiting on what right now.

Nothing in this repository draws itself. A card needs a plate, a map needs a plate, and
a plate needs somebody who can draw — which is a different pair of hands from the one
that knows what a summary strip is or why hills and marsh must never share a wash. The
mint is that handover, written down.

**It is a multi-tool.** One *line* per kind of thing being minted, declared once in
[`data/mint.json`](data/mint.json), and every line runs the same four steps:

```
   the subject exists  ──▶  the brief exists  ──▶  the plate exists  ──▶  it is tied
   in data/                 in art/prompts/         the artist drew it     back to the data
        │                        │                        │                     │
     designer                 designer                  artist               designer
```

| Line | Subject | Plate | Tied back by |
| --- | --- | --- | --- |
| **Cards** | a card in an adventure deck | `docs/art/renders/<plate>.png` | **FRAME** — a subject box and a focal point in `framing.json` |
| **Maps** | a drawn map plate | `docs/map/<id>.png` | **TRACE** — the board read off it, in `data/maps/<id>.json` |
| **Tiles** | a printed hex tile face | — | *shelved — [#18](https://github.com/cdomotor-g/game1/issues/18)* |

Only the third step's *name* changes between lines, because the job is the same one: a
drawing is useless to a build tool until the data says how to read it.

```bash
node tools/mint-queue.mjs      # → docs/art/mint/QUEUE.md
```

Which step anything is on is **computed, not tracked** — from the briefs, the plate
files and the tie-backs — so the worklist cannot disagree with the repository, only be
out of date, and CI catches that. There is no board to fall out of date, because there
is no board.

- [`docs/MINT.md`](docs/MINT.md) — what the pipeline is: the lines, the steps, the
  handover, and each line's input and output contract
- [`docs/MINT-SETUP.md`](docs/MINT-SETUP.md) — **the how-to.** Setting the designer and
  the artist up, what every prompt must contain, what to paste where, and what to do
  when a run goes wrong

**The tile board is shelved, not cancelled.** Building the board out of 61 dealt hex
tiles — and the Holdings / Grounds / Places zoom-in sheets in `docs/minimaps/` — is
paused pending the game-set split ([#10](https://github.com/cdomotor-g/game1/issues/10)),
where it fits neatly as a *way of supplying a board*: a plate set gives you one drawn
map, a tile set gives you a bag. Nothing is deleted, the 32 accepted sheets stay on the
site, and the queue prints the shelved line every run so it is visible from the tool
rather than remembered.

## Maps

**[docs/map/](docs/map/README.md)** — the plate, the board, and the pipeline between them.

A map is two things kept apart on purpose: the **plate**, a drawn map committed as
artwork and never edited by any tool here, and the **board**, `data/maps/<id>.json`, which
says what is on that artwork hex by hex. The grid is an overlay drawn at read time, so a
mistake about the terrain is a one-character edit rather than a repaint.

The board is one character per hex and one string per row, decoded through a legend:

```json
"rows": [ "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
          "~~~~~~~~~~~~-----~~~~~--tttt----", ... ]
```

That is not a compression trick. It means the board is a picture of itself in a text
editor, and a change to a coastline is a diff you can read.

A map file is one of two things, and the difference is one field. A **board** has its
`rows` full. A **commission** has them empty and carries a `commission` block instead:
what the map is for, what country it is, the terrain budget, how many settlements of
what rank, and the minimum pixel width. That block is the map mint's input contract, it
is required, and `node tools/mint-queue.mjs` checks it before anybody is asked to draw
anything — an under-specified commission is a queue error rather than a surprise three
weeks later. `The Sundering Isles` is the first one.

The first map is **The Korvane Reach**: 32 × 26 hexes, 429 of them land, nineteen
settlements, two rail lines. `tools/trace-map.mjs` proposed the grid by sampling the
artwork; the rest was hand-corrected against the proof sheet `tools/build-map.mjs`
generates — the plate with every hex tinted and lettered, which is how you check 832 hexes
without trusting a tally.

**Printing it.** `docs/map/print.html` tiles the plate across A4 sheets with trim marks
and per-sheet stamps. Four sheets, 2 × 2 landscape, gives 549 × 388 mm — A2, near enough —
with 16.7 mm hexes. Nine sheets gives A1 with 25 mm hexes. Print at 100%, cut on the
marks, butt the pieces. Printing and choosing *Save as PDF* gives the same thing as a file:
the page sizes are set per preset, so the PDF is at true size.

**Taking a copy away.** Both map pages have a **Download PNG** button — the plate at its
own 1491 × 1055 with whatever layers are switched on — and the viewer also offers the
overlay alone as SVG, for editing. There is no per-sheet PNG on purpose: a PNG carries no
paper size, so a tile out of one is an image nothing can print at a known scale. Downloads
read pixels back out of a canvas, which a browser forbids when the page was opened off
disk, so they need the site served rather than double-clicked.

**There is no shore terrain, and that is the point of eleven.** There was one, called
*coast*, and it meant "the edge of the water" — which made a shore a *kind of ground*: a
beach in front of a forest had to be drawn as neither, and a town on a lake could not have
a dock unless the artist painted a ring of sand round the lake first. The edge of the water
is a **relationship**. A land tile with any water tile beside it is **waterside**, read off
the board when somebody asks and printed on no hex (`data/terrain.json siting.waterside`);
a dock goes on any waterside tile, a harbour on one the *sea* reaches. What came back in
its place is the water itself: **river**, a watercourse wide enough to be its own hex and a
barge lane running inland, and **lake**, standing fresh water with land all round it.

**The eleven terrains are the vocabulary and a map does not get to add to it.** Drawn maps
name their country *steppe*, *highlands*, *fens*, *dunes*; when those collide with
`data/terrain.json`, the map changes and the rules do not. The Varl Highlands are drawn as
flat steppe and named a highland, so the board reads them as `hills`; the Mirewash Fens are
painted the same ochre as the desert next to them, so the board reads the name and not the
paint. Every such call is written down in that region's summary. The full rule, and the
brief for generating a new plate that traces cleanly, is in
[docs/map/README.md](docs/map/README.md).

## Where to start reading

1. [docs/GLOSSARY.md](docs/GLOSSARY.md) — the vocabulary, especially commodity vs effort
2. [docs/design/00-overview.md](docs/design/00-overview.md) — pillars and scope
3. [docs/design/01-core-loop.md](docs/design/01-core-loop.md) — the round and the dice
4. [docs/design/11-bootstrap.md](docs/design/11-bootstrap.md) — the one rule not to
   "tidy up" without reading why it exists
5. [docs/map/README.md](docs/map/README.md) — the map pipeline, and how to make another
6. [docs/MINT-SETUP.md](docs/MINT-SETUP.md) — if you are about to commission any art at
   all, this is the one to have open
