# The mint

How something goes from an idea to a finished, printable thing, with two agents
doing the work and a pull request as the workbench.

The short version: **the mint is a multi-tool. One `line` per kind of thing being
minted, every line runs the same four steps, each step is owned by exactly one
pair of hands, and which step a subject is on is computed from the repository
rather than tracked by anybody.**

It started as a card minter. It is not one any more — the same handover works for
anything where somebody who can write and cannot draw has to hand over to
somebody who can draw and does not know the rules. Maps were the second line and
they needed no new machinery, only a new entry in
[`../data/mint.json`](../data/mint.json).

## The lines

| Line | Subject | Brief | Plate | Aimed by | Status |
| --- | --- | --- | --- | --- | --- |
| **Cards** | one card in an adventure deck | `art/prompts/<deck>.md` | `art/renders/<plate>.png` | **FRAME** — a subject box and a focal point in `art/framing.json` | active — two decks *generated*, see below |
| **Maps** | one drawn map plate and the board read off it | `art/prompts/maps.md` | `map/<id>.png` | **TRACE** — the board in `data/maps/<id>.json` | **paused** — see *Generated maps* |
| **Building tiles** | one SIDE of one printed hex tile — a building or field, finished or unbuilt | `art/prompts/buildingtiles.md` | `art/renders/tile-<id>[-site].png` | **FRAME** — a subject box in `art/framing.json` | active, 108 subjects |
| **Terrain tiles** | a printed hex tile face and its zoom-in sheet | — | — | — | **shelved**, [#18](https://github.com/cdomotor-g/game1/issues/18) |

A line is declared in `data/mint.json` and nowhere else. That file holds no
content — no card says anything in it, no map is described in it — exactly like
`data/components.json`. It says what a line *is*: where its subjects come from,
where its briefs live, what a plate has to be, and what ties the plate back to the
data.

**Terrain tiles are shelved, not cancelled.** The tile-based board — 61 hex tiles
dealt face down, and the Holdings / Grounds / Places sheets in
[`minimaps/`](minimaps/README.md) — is paused pending the game-set split
([#10](https://github.com/cdomotor-g/game1/issues/10)), where it fits as a *way of
supplying a board*: a plate set gives you one drawn map, a tile set gives you a
bag. Nothing is deleted; the 32 accepted sheets stay committed and stay on the
site. The queue prints the shelved line every run, so it is visible from the tool
rather than remembered.

**The building tiles are a different line and reopen nothing.** A terrain tile is
a piece of ground that arrives *instead of* a map; a building tile is a piece of
architecture that goes *on* ground the table already has, and it is wanted
whichever way that ground was supplied. They share a cell size because everything
in this game shares a cell size — one tile cell is one mini-map cell is one
world-map hex, read off the campaign map's own print preset. The argument in full
is the block comment at the top of
[`../data/buildingtiles.json`](../data/buildingtiles.json).

## Generated maps

A map plate is one of two kinds and the difference is one field, `plate.kind` on the map.

**Drawn** is everything above: somebody paints a country, `tools/trace-map.mjs` samples the
pixels, and three or four rounds of hand-correction against a proof sheet turn a guess into
`rows`. `korvane-reach` is one.

**Generated** turns the line around. `rows` is grown from the commission by
`tools/draw-map.mjs`, and the plate is drawn *from* `rows` as an SVG — the board is the
source and the picture is the output, which is how every other artefact here already works.
There is no artist, so there is no handover, so a generated map **is not a mint subject**:
the queue reports it and chases nobody, exactly as
[`build-minimaps.mjs`](../tools/build-minimaps.mjs) already puts it — *generated, not
commissioned*. There is also no TRACE step, because nothing was guessed.

Two reasons it went this way and cards did not:

- **Size.** An A1 sheet wants 4857 px and one image call gives 1536, and a coastline
  generated in quadrants does not meet in the middle. A vector plate has no long side at
  all, so the nine-sheet preset that `data/maps/korvane-reach.json` calls *"a layout waiting
  on a larger plate"* is simply printable.
- **Ink.** `build-minimaps.mjs` settled this at mini-map scale: *"drawn ground competes with
  the pieces standing on it"*. A campaign map is the largest surface anybody stands pieces
  on.

**Commissioning a drawn map is paused, not retired.** The commission contract, the brief in
[`art/prompts/maps.md`](art/prompts/maps.md), the `TRACEABILITY.` block, `trace-map.mjs` and
the seven rules in [`map/README.md`](map/README.md) are all intact and unused. Setting a
map's `plate.kind` back to `"drawn"` puts it in the queue at DRAW exactly as before.

## Generated card plates

The same field, one line down. A **deck** in `data/components.json` carries
`plateKind`, and a deck whose plates are `"generated"` has them drawn by
[`../tools/draw-item.mjs`](../tools/draw-item.mjs) from the parts each card holds
in its own `plate` block, rather than commissioned from an artist. The ITEMS and
TOOLS decks are the two, and the queue reports them as generated every run —
*generated, not commissioned*, exactly as the maps line puts it.

Why it stops there, and why it stopped at objects rather than at cards:
[`art/09-framing-and-composition.md`](art/09-framing-and-composition.md) calls a
talisman plate *"a single object study, lit on a table"*, and a study of a made
thing is a silhouette and a line — a haft, a head, the grain in one and the
hammer marks in the other. That is drawable from parts. A character's face is
not, a monster's eye is not, and neither will be.

A generated card is still a mint subject and still goes through all four steps:
it has a brief, it has a plate, and it has a FRAMING entry — which for these is
not measured off the picture but is where the tool *put* the object, so
`node tools/draw-item.mjs --check` fails if `art/framing.json` has drifted from
`components.json` `itemPlate.subject`.

**Turning one card back over to an artist is one deletion.** Delete that card's
`plate` block and the tool has nothing to draw it from, so it can never overwrite
what arrives; `mint-queue` puts the card back at DRAW; and the brief in
[`art/prompts/items.md`](art/prompts/items.md) or
[`art/prompts/tools.md`](art/prompts/tools.md) is what gets pasted into the
thread. Per card, not per deck, so one hand-drawn sword can sit in a deck of
generated ones — which is why those briefs are written and kept current for
plates that already exist.

## The four steps

```
   data/*.json          art/prompts/            the plate            the tie-back
   the subject      ──▶ the brief          ──▶  the drawing     ──▶  to the data    ──▶  MINTED
        │                     │                      │                     │
     designer              designer                artist               designer
       WRITE                 WRITE                  DRAW            FRAME / TRACE
```

Only the third step's *name* changes between lines — a card is **framed**, a map
is **traced** — because the job is the same one: a drawing is useless to a build
tool until the data says how to read it. A card's plate is a whole page and a card
window is not that shape, so the data says which box may not be cut. A map's plate
is a whole country and the rules need to know what is on each hex, so the data
says what every hex is. Same step, two contracts.

Run `node tools/mint-queue.mjs` at any time. It reads the data, the brief files,
the plate directories and the tie-backs, works out where every subject has got to,
and writes the worklist to [`art/mint/QUEUE.md`](art/mint/QUEUE.md). Nothing about
a subject's status is stored anywhere; there is no board to fall out of date,
because there is no board.

The queue reports three separate things, because three different people fix them:

| | |
| --- | --- |
| **a step** | missing work — whose turn it is |
| **a contract problem** | something the line *requires* is not there. A commission that never said what its terrain budget is cannot be handed to an artist at all |
| **a note** | true, and nobody's turn. "32 of 56 plates are under the 4000 px this line asks for" is one decision, not thirty findings |

## The two agents

| | **Designer** | **Artist** |
| --- | --- | --- |
| Default | Claude Code, in this repository | ChatGPT, or any image model |
| Owns | `data/`, `docs/art/prompts/`, `docs/art/framing.json`, `data/maps/`, every tool | the plate files: `docs/art/renders/*.png`, `docs/map/*.png` |
| Cannot | draw | change the rules |

The split is real, not ceremonial. The designer can write a perfect brief and
cannot produce a plate; the artist can produce a beautiful plate and has no idea
what a summary strip is, or why hills and marsh must never share a wash. Neither can
finish a subject alone, which is why the handover has to be written down.

**How to actually set the two of them up, and what to paste where, is
[`MINT-SETUP.md`](MINT-SETUP.md).** This document is what the pipeline *is*; that
one is how to run it.

## Where the handover happens

**One pull request per minting run**, on a branch named `mint/<what>` — say
`mint/dragons-and-airships`, or `mint/sundering-isles`. Both agents work on that
one branch and talk in its comment thread. The PR is the workbench: the brief is
posted on it, the plate is pushed to it, the finished thing is built on it, and
the whole exchange is readable afterwards by whoever wonders why something looks
the way it does.

Two PRs and a cross-posting protocol were the original sketch. One is better: the
branch is the shared state, the thread is the conversation, and neither agent has
to discover the other's PR number.

**The pull request is the TWO-AGENT form.** It buys a thread, and a thread is only
worth having when two parties have to talk. Where one person is the courier — or
where `tools/mint-draw.mjs` is — there is nobody to talk to, and committing straight
to `main` is correct and is what [`../CLAUDE.md`](../CLAUDE.md) asks for. Neither
document is wrong; they are describing different runs.

### The round trip

**1 · The designer opens the run.**

Adds or edits the subjects in `data/`, writes a brief per subject into the line's
prompt file, runs the tools, pushes the branch and opens the PR. Then posts one
comment per subject — the commission:

```md
### MINT REQUEST · MON-13 · Vhalrik, the Cinder-Crowned

**line**     cards
**plate id** `monster-vhalrik-the-cinder-crowned`
**save to**  `docs/art/renders/monster-vhalrik-the-cinder-crowned.png`
**format**   A4 portrait, 4000 px on the long side or better
**brief**    docs/art/prompts/monsters.md § monster-vhalrik-the-cinder-crowned

<the complete prompt, preamble and negative prompt included, pasted in full>

Reply on this thread with `PLATE READY · MON-13` when it is pushed.
```

The prompt is pasted **in full**, not linked. The artist should never have to
assemble a prompt out of three files, and a prompt that was actually used is worth
having in the thread verbatim.

**2 · The artist draws and pushes.**

Generates against the brief, checks it against the acceptance list in
[`art/07-ai-agent-brief.md`](art/07-ai-agent-brief.md) and the line's own contract
— [`art/09-framing-and-composition.md`](art/09-framing-and-composition.md) for
cards, [`map/README.md`](map/README.md) for maps — commits the PNG to the branch,
and, if the wording had to change to get an acceptable render, the frozen wording
alongside it as `<plate>.txt`. Then replies on the same thread:

```md
PLATE READY · MON-13 · `docs/art/renders/monster-vhalrik-the-cinder-crowned.png`

Prompt changed: dropped "rearing" — it kept producing a heraldic pose.
Frozen wording committed as monster-vhalrik-the-cinder-crowned.txt
```

**3 · The designer aims, builds and merges.**

Pulls the branch and does the line's third step:

- **cards** — adds the plate's `subject`, `focal` and `note` to
  `docs/art/framing.json`, checking the crop with
  `node tools/aim-preview.mjs <code>` before settling on the numbers — its budget
  line says what the window can hold at all, which is fixed before any box is
  drawn — then `node tools/validate-framing.mjs` to confirm the trim was the one
  intended, and showing the built card with `node tools/card-proof.mjs <code>`
  after
- **maps** — measures `plate.field` off the inner frame rule, runs
  `node tools/trace-map.mjs <id> --write`, then corrects `rows` by hand against
  the proof sheet, and adds the settlements, regions and routes

Then runs the tools, commits the regenerated files, and either accepts the plate
or replies with what to change. When the queue says it is minted, it is minted: it
is in `docs/cards/` or on the map page, on the print sheet, in the explorer and in
the annex, all at once, because all of them are generated from the same data.

### Rejecting a plate

Reply on the subject's thread with `PLATE REJECTED · <code>` and **one** concrete
reason, taken from the acceptance checklist rather than from taste. "The subject
is against the top edge and there is no margin for the crop to slide in" is
actionable, and so is "the fens and the desert are the same ochre, so nothing in
the pixels can separate them". "It doesn't feel right" is not, and if that is
genuinely the problem then the brief was wrong and the designer owns the fix.

## The contracts

This is the part that makes it repeatable rather than a habit. Each line's input
and output are declared in `data/mint.json`, and `tools/lib/mint.mjs` checks the
declared fields for real — an under-specified subject is a queue error rather than
a surprise three weeks later.

### Cards

| | |
| --- | --- |
| **In** | a card in `data/`, with a `cardCode` and a `name` |
| **Brief** | an `## <plate-id>` section in the deck's prompt file. The heading **is** the plate id — that is what lets the queue find it with nobody filing an index |
| **Plate id** | the `plateId` template on the deck in `data/components.json` — `character-{cardCode\|lower}` → `character-chr-06` |
| **Out** | `docs/art/renders/<plate>.png`, at the deck's `plateFormat`, 4000 px on the long side |
| **Aim** | an entry in `docs/art/framing.json`: `subject` (the veto — what may not be cut), `focal` (the aim — the one point the picture is of), `note` |
| **Builds** | `docs/cards/` via `build-cards.mjs`; the explorer thumbnails via `build-data.mjs` |

### Maps

A map file is one of two things and the difference is one field: a **commission**
has no `rows`, a **board** has them full. Both live in `data/maps/<id>.json`, both
are checked, and `validate-map.mjs` says which it is looking at.

| | |
| --- | --- |
| **In** | `data/maps/<id>.json` with a `commission` block: `why`, `landmass`, `terrainBudget`, `settlements`, `plate.minWidthPx`, plus the `grid` and the `legend` the board will be read on. All of it is required and all of it is checked |
| **Brief** | an `## <map-id>` section in `docs/art/prompts/maps.md`, written **from the commission and nothing else**. If the two disagree, the commission is right and the prompt is stale |
| **Plate id** | the map's own id. A map's plate is named after the map |
| **Out** | *drawn:* `docs/map/<id>.png` — landscape, root-two, a plain frame with a visible inner rule, at the pixel floor the map's own largest print preset derives. Committed as supplied and never re-encoded by any tool here. *generated:* `docs/map/<id>.svg`, drawn by `tools/draw-map.mjs`, a build output with no pixel floor to meet |
| **Aim** | the board: a measured `plate` block, a full `rows`, and the `settlements`, `regions`, `routes` and `print` presets |
| **Builds** | the proof sheet and the derived print sizes via `build-map.mjs`; the viewer, the print sheets and the explorer via `build-data.mjs` |

### Building tiles

A tile is a hex, or a small clump of hexes, cut so that one cell is exactly a
mini-map cell. **How many cells is never written on the building.** It is worked
out from the building's own numbers — the effort it takes to raise, and what it
has to hold — through the ground model and the ladder in
[`../data/buildingtiles.json`](../data/buildingtiles.json), so adding a worker
slot can grow a tile and `validate-data` says so. A field tile is the same
subject read out of a sowing recipe instead of a building.

| | |
| --- | --- |
| **In** | a building in `data/buildings.json`, or a recipe carrying a `cropStage` — **twice**, because both sides are drawn: the building finished, and the same ground with the work not yet done. Nothing about the tile itself is written down: the shape, the cells and the word on the back are all derived |
| **Brief** | a `## tile-<id>` section in `docs/art/prompts/buildingtiles.md` |
| **Plate id** | `tile-` and the tile's id for the face; the back adds its own word — `tile-hut` / `tile-hut-site`, `tile-crop-grain` / `tile-crop-grain-sown` |
| **Out** | `docs/art/renders/tile-<id>.png`, at the page the footprint's own aspect asks for, at the pixel floor the **largest** world hex any map declares derives — not today's, because a plate drawn to the small preset can never be recut for the large one |
| **Aim** | an entry in `docs/art/framing.json`, exactly as a card. What differs is the window: a tile's is its own footprint, and `validate-framing.mjs` measures against that rather than a card |
| **Builds** | `docs/tiles/` via `build-tiles.mjs` — face and back for every tile, and an index that prints them all at their true size |

Two things a card brief never has to say, both appended to the prompt
automatically by `windowNote` so nobody types them: how much of the page the
hexagonal cut keeps, and **where the label band sits**. A solid strip carrying the
tile's name runs along the lower-right edge, parallel to it, and whatever is drawn
under it is gone — a corner of the picture rather than a bar across it.

**A tile builds without its plate**, which is the one place this line differs from
cards. A card with no portrait is a card with a hole in it, so `build-cards` skips
it; a tile with no plate is a blank counter, which is exactly what a prototype
tile is. The whole set is printable today.

**Ask for the width before you ask for anything else.** It is the one property of
a plate that cannot be recovered later: a coastline can be re-traced, a legend can
be drawn over, a label can be argued with, but pixels that were never drawn are
gone. The Korvane Reach arrived at 1491 px and it cost the two larger print
presets permanently.

**Never ask for a grid on the plate.** The grid is an overlay drawn from the
board. One baked into the artwork cannot be moved, cannot be resized when `cols`
changes, and will not line up with the one the tools draw. `hex grid` is in the
negative prompt on purpose.

## Running it as automation

Everything above is written to be done by two humans, two agents, or one of each,
because that is the only version that is definitely going to work. If it is
automated, the pieces are:

- Each agent subscribes to the PR. On this repository that is
  `subscribe_pr_activity`; the artist's side needs whatever the equivalent is.
- A comment beginning `MINT REQUEST ·` is the artist's work item; a comment
  beginning `PLATE READY ·` is the designer's. Both are prefixes on purpose: they
  are greppable, and an agent can ignore everything else in the thread.
- The designer's wake-up is: pull, run `node tools/mint-queue.mjs`, and act on
  whatever is at step 3. It does not need to parse the comment to know what to
  do — the repository already says.

That last point is the load-bearing one, and the reason the queue is computed
rather than tracked. **The comments are a notification, not a state machine.** If
a comment is missed, dropped, posted twice or posted out of order, the next run of
the tool still produces the correct worklist. Automating the notification is then
a convenience rather than a dependency, and can be added, removed or broken
without stranding anything half-minted.

## Adding a third line

The mint is a multi-tool because the next thing is not going to be a card or a
map. Adding a line is:

1. **An entry under `lines` in `data/mint.json`** — where its subjects come from,
   where its briefs live, what a plate has to be, what ties the plate to the data,
   what it builds and what checks it.
2. **A branch in `subjectsOf` and `aimOf` in `tools/lib/mint.mjs`** — how to
   enumerate the subjects, and how to tell whether one has been tied back. It is
   deliberately dull, one branch per line; a query language in a JSON file is a
   worse version of that switch which nobody can grep.
3. **A prompt file** under `docs/art/prompts/`, with the shared preamble, the
   negative prompt, and a block equivalent to `FRAMING.` — whatever the artist has
   to be told about how the drawing will be read.

Nothing else. The queue, the CI check, the site page and the handover all pick it
up.

## Before merging a mint run

```bash
node tools/validate-data.mjs    # the subject is referentially sound
node tools/draw-map.mjs <id>    # generated maps: regrow the board, redraw the plate
node tools/validate-map.mjs     # boards against terrain.json and themselves
node tools/validate-art.mjs     # palette and the two-plate contract
node tools/build-map.mjs        # proof sheets and the derived print sizes
node tools/build-icons.mjs      # element marks
node tools/build-data.mjs       # the explorer bundle
node tools/build-annex.mjs      # the printed annex
node tools/build-cards.mjs      # the cards themselves
node tools/build-tiles.mjs      # the building tiles
node tools/build-book.mjs       # the rulebook
node tools/mint-queue.mjs       # the worklist
node tools/build-mint.mjs       # the mint page on the site
```

Anything that reaches `main` without those re-run is something the website and the
rulebook disagree about. The full list, in order, is in
[`../CLAUDE.md`](../CLAUDE.md).
