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

You get three things:

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

And a third, in the terminal:

```bash
node tools/simulate.mjs --games 20    # play 20 games headlessly, report the economy
```

## Layout

```
data/          the rules as data — the single source of truth, one file per system
  rules.json         tunable constants: round, effort, food, rest, hirelings, victory
  commodities.json   66 storable, tradeable goods
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
  characters.json    the character deck — named heroes with health, burden and mana bars
  quests.json        the quest deck — mini-quests and campaigns
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
  minimaps/          the zoom-in sheets: spec, art briefs and the accepted
                     artwork in minimaps/img/, see its README
  cards/             GENERATED card fronts for the adventure decks, from
                     tools/build-cards.mjs — index.html shows the set,
                     print.html lays it out on A4 with lines to cut along
  book/              GENERATED single-page design book from design/*.md, via
                     tools/build-book.mjs — readable and printable on the site
  GLOSSARY.md        commodity vs effort vs deposit — read this first
  design/            fifteen design documents, see docs/design/00-overview.md
                     14-annex.md is GENERATED by tools/build-annex.mjs
  art/               the visual style guide, see docs/art/README.md
    palette.json       the palette as data — five inks, one black, one paper
    framing.json       where the subject sits on each plate, so a card window
                       and a thumbnail crop to the subject and not the middle
    prompts/           commissioning briefs for peoples, monsters, characters,
                       vehicles and talismans; renders land in art/renders/
    renders/           the accepted renders, one per prompt id — see its README
    examples/          worked examples of the two-plate system

tools/
  validate-data.mjs  referential integrity and design smells
  validate-art.mjs   palette conformance and the ink/wash layer contract
  validate-map.mjs   boards against terrain.json, and against themselves
  build-data.mjs     data/*.json → docs/data/bundle.js
  build-annex.mjs    data/*.json → docs/design/14-annex.md, the rulebook's tables
  build-cards.mjs    data/*.json + art/renders → docs/cards/, the deck fronts
  build-book.mjs     docs/design/*.md → docs/book/index.html, printable
  build-map.mjs      map proof sheets, and the derived print sizes
  trace-map.mjs      reads a drawn map and proposes a hex grid for it
  simulate.mjs       headless playthroughs, for balance
  lib/               a dependency-free PNG reader/writer, hex geometry, a 3x5 font,
                     and the plate-cropping maths the explorer also runs
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
node tools/build-data.mjs      # rebuild the web bundle
node tools/build-annex.mjs     # regenerate the rulebook's reference tables
node tools/build-cards.mjs     # regenerate the adventure-deck card fronts
node tools/build-book.mjs      # regenerate the printable design book
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
balanced. The mini-map sheets and all card art exist as briefs awaiting renders.

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

**[docs/cards/](https://cdomotor-g.github.io/game1/cards/)** — the four adventure decks as
card fronts, generated by `tools/build-cards.mjs` from `data/*.json` and the accepted
plates. Nothing in that folder is written by hand: change the data or re-render a plate,
run the tool, and the cards change with it.

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

**[cards/print.html](https://cdomotor-g.github.io/game1/cards/print.html)** is the
print-and-cut page: pick cards, pick paper, and get sheets of them at a true 63 × 88 mm —
nine to a sheet of A4 — each with a dotted line on its edge to cut along. Print at 100%
with scaling off; a cut card is the size of a standard playing card, so it glues straight
onto one. The 3 mm of bleed every card is drawn with is held outside the cut line, where
the blade never goes.

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

**The ten terrains are the vocabulary and a map does not get to add to it.** Drawn maps
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
