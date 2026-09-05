---
description: Mint a card, tile or map end to end from one request — brief, commission the artist, land the plate through the inbox, aim, build, proof, ship
argument-hint: MOD-01 | tile-warehouse | --deck modifications | a new fire monster, a cinder-crowned stag
---

You are the **designer** on a mint run in this repository.

The pipeline is `docs/MINT.md` and it is binding. `data/mint.json` declares the
line you are working. `docs/art/09-framing-and-composition.md` is the aim
contract for cards, `docs/map/README.md` for maps. Read what you need; do not
restate the rules back to the user.

**Subject:** $ARGUMENTS

## Work out what you were given

Run `node tools/mint-queue.mjs` first — it computes every subject's step from the
repository, so it is the only thing that knows where this run starts.

Then read the subject above as one of four things:

| It looks like | Do |
| --- | --- |
| a card code (`MOD-01`) or plate id | mint that one subject |
| `--deck <name>` or a code with a wildcard | mint that deck's subjects at DRAW, in order |
| a description of something that does not exist | create it first: the card into `data/<deck>.json` with a `cardCode` and a `name`, then its brief, then mint it |
| a map id | maps are generated, not commissioned — go to *Maps* below |

If it names something the queue does not know and does not read as a new subject,
say so and stop. Do not guess which card was meant.

## Run it all the way. One request is the whole job.

The person asking wants the finished thing in the repository — art drawn, plate
carried in, crop aimed, built, proofed and shipped. Not a plan, not a prompt for
them to run, not a file for them to move. **Go from their one sentence to a
pushed commit and a proof in the reply**, and stop in the middle only for the two
things below.

Everything up to the drawing, and everything after it, is automated and none
of it needs them. The drawing itself is the artist's — ChatGPT, pointed at this
repository — and the plate comes back through the inbox:

```
tile-envelope ─▶ brief ─▶ mint-request ─▶ the artist draws
      ─▶ the artist pushes ONE file to plate/<plate-id> ─▶ land-plate.yml ships it to main
      ─▶ git pull ─▶ aim ─▶ build ─▶ proof ─▶ push
```

**Drawing on Hugging Face is retired.** `tools/mint-job.mjs`, `tools/hf/` and
`fetch-plate.yml` are intact and are not to be used: what they drew was not the
house style, the quota was real, and an artist that can read the brief beats a
courier that cannot. `docs/MINT.md` says so, marked retired. Do not dispatch a
drawing job.

**Stop and ask only if:** a subject cannot be briefed without a design decision
they have not made, or a plate keeps failing for a reason you cannot name. A
blocked tool is not a reason to stop — say what is blocked, do every part that
does not depend on it, and finish.

**Never ask them to move a file.** The inbox exists precisely so nobody drags a
PNG between two browser tabs: the artist pushes one file to one branch and the
landing workflow does the rest. If a file does reach you as a download, land it
with `node tools/ship-art.mjs <plate-id> <file.png>` — never `git add`.

**Two things are always true at the end:** the proof is in the reply, and the
commit is pushed. A run that ends with a paragraph about a tile, and no tile, has
not shown its work.

## Cards

1. **Brief it if it has none.** An `## <plate-id>` section in the deck's prompt
   file under `docs/art/prompts/`. Four parts, all required: the shared preamble
   reference, the subject paragraph written from the card's own data, the negative
   prompt, and a `FRAMING.` block. The FRAMING block is the one that gets left out
   and it is the one that decides whether the plate is usable — name the head, the
   hands and the gear the card actually names, and say what margin stays clear.
2. **Commission it, and let the inbox carry it in.** The artist is ChatGPT,
   pointed at this repository, and it reads the brief itself; `AGENTS.md` at the
   root is its standing instruction and `docs/art/AGENTS.md` is its delivery
   contract. Your part is three moves:

   **a. Make sure the brief says everything, then print the commission.**
   ```bash
   node tools/build-prompts.mjs          # markers, WINDOW blocks, the derived size
   node tools/mint-request.mjs <code>    # the commission, assembled, for a person
   node tools/mint-request.mjs <code> --render   # the same brief as an IMAGE MODEL should get
   ```
   The two prompts are different on purpose. A commission is written for a
   reader and carries blocks it reads as instructions — `FRAMING.`, `WINDOW.`,
   `LABEL BAND.` A bare image model cannot tell an instruction from a subject
   and **draws them**: the first warehouse plate came back with the brief
   rendered onto the page as paragraphs of text. `--render` strips those, moves
   every "no X" into the negative prompt where it belongs, keeps the corner rule
   as the one depictive sentence it can be, and prints what it moved. ChatGPT
   as artist reads the whole commission and makes that split itself before it
   calls its image tool — `AGENTS.md` tells it so. An API call to an image
   model (`tools/mint-draw.mjs`, with a key) gets the `--render` form and
   nothing else. `--json` prints either, with the plate id, the destination, the
   page shape and the pixel floor, for anything that would rather not scrape
   markdown.

   **The pixel figure is never typed.** The marker under the brief's heading
   carries it — derived from the card's safe area cut to the page's shape, at
   the print scale `data/mint.json` declares, because a card plate must print
   cleanly at twice the card's size for the rulebook. `build-prompts --check`
   fails on a pixel count written into a brief's prose.

   **b. Hand it over.** If the user is running the artist, hand them the
   commission whole, never a diff. If you are asked to be the courier for a
   file the artist could only download:
   ```bash
   node tools/ship-art.mjs <plate-id> <file.png> [--wording=<file.txt>]
   ```
   which validates every byte, refuses a plate under its floor, builds, commits,
   pushes to `main` and reads the blob back. Never `git add` a plate.

   **c. Wait for the landing, then pull.** The artist pushes one file to
   `plate/<plate-id>` and `.github/workflows/land-plate.yml` ships it to `main`
   with the same command. `git fetch origin main && git merge --ff-only
   origin/main`; the subject moves off DRAW on its own, because the queue is
   computed rather than stored. If the run says `NOT SHIPPED`, its summary says
   why; `docs/MINT-SETUP.md` §4b has the table.

   **Judge the plate against the checklist**, not against taste — reject with
   one concrete reason from `docs/art/07-ai-agent-brief.md`, and **write it into
   `docs/art/renders/<plate>.attempts.md`** so the next run does not buy the same
   lesson. If every attempt fails the same way, fix the wording once; do not
   re-roll against a prompt that is wrong.

3. **Aim it.** Read the plate — once. Check it against the acceptance checklist
   in `docs/art/07-ai-agent-brief.md`. Then measure rather than guess:
   `node tools/plate-map.mjs <code>` prints the ink as a character map with
   rulers, and `node tools/aim-solve.mjs <code> --keep x0,y0,x1,y1 --spend
   top|bottom|even --write` turns that measurement into the entry. The
   measurement only has to be close: the solver reports what every window does
   with it in text, so correcting happens there rather than by opening the
   picture again. Then write `subject`, `focal` and `note` into
   `docs/art/framing.json` — or let `--write` do the first two and write the
   `note` yourself, which is the only part no tool can. `subject` is the veto — what may not be cut. `focal`
   is the aim — the one point the picture is of, a face or an eye. Both, always;
   a subject box alone centres the crop on a standing figure's sternum.
   Check the numbers by looking at them, not by imagining them:
   `node tools/aim-preview.mjs <code>` cuts the plate the way the card window and
   the explorer thumbnail actually will, onto one sheet. Grow `subject` if
   something the card names is cut; move `focal` if the crop is centred on the
   wrong thing.
   **Read its budget line before you write any numbers at all.** A window holds
   at most the plate's width over the window's aspect — 64.2% of an A4 page on
   the monsters deck — and no subject box can raise that. If the subject spans
   more than the budget, the job is not to find the right box, it is to choose
   what to spend, and the `note` is where that choice is written down.
   `node tools/validate-framing.mjs` then confirms the trim you meant and no
   others.
4. **Build and check.** `node tools/mint-build.mjs <code>` is the eight tools a
   landing plate needs, in order, and it proofs the card at the end. The full
   list at the foot of `CLAUDE.md` is for when `data/` has moved.
5. **Show it.** `node tools/card-proof.mjs <code>` renders the finished card —
   frame, strip, picture, rules, story rail — to `docs/art/proofs/<code>.png`.
   **Put that image in the reply**, so the run ends with the card in front of the
   person who asked for it rather than a paragraph about the card. Look at it
   yourself first: a proof you did not read is not a check. This is a review, not
   a gate — show it and carry on to 6 unless the user has said to wait.
6. **Commit.** Re-run `node tools/mint-queue.mjs` and confirm it says minted.

## Building tiles

The six steps above are the same. Four things differ, and all four have already
cost a plate:

**One plate, two sides.** The back is not drawn — it is the face's own plate with
the colour run not laid on (soot on tallow) and its name band hollow instead of
solid. So a tile is ONE subject. There is no `-site` or `-sown` brief to write and
no second plate to aim. `platesOf` in `tools/lib/tiles.mjs` is the only thing that
counts a tile's plates; never write out `['face','back']` anywhere else.

**Draw the finished building, and draw it well** — it is doing both jobs now.

**Read the shape before you write the brief.** `node tools/tile-envelope.mjs <id>`
prints the footprint as a map with the safe box marked and the numbers under it.
Do it first, every time. It is free, it is local, and not doing it is what the
granary paid three drawn plates for.

**The hexagon cuts its own bounding box, and no aim can undo it.** A polyhex tile
loses the corners of the page even when the crop keeps everything — a triad's
window is 0.99 against a square plate, so the crop keeps essentially all of it,
including the parts the die then trims. The warehouse's two barrels went that way;
so did the granary's scoop, and three whole granary plates were drawn to the full
width of a page a triad cannot hold below its shoulder. **The only fix is to draw
it smaller, and that has to be decided before the plate exists.**

`--render` appends the envelope and the corner rule to every building-tile prompt
automatically (`envelopeNote` in `tools/lib/tiles.mjs`), so both are derived from
the footprint rather than typed. Never hand-write a composition band or a corner
sentence into a brief — if you are about to, the number belongs in the shape.

`aim-solve` measures a rectangle and cannot see the die at all: it will say
"nothing has to be spent" about a plate the hexagon is about to cut. Look at
`tile-proof` and check the named subject is actually inside the outline.

**Proof with `node tools/tile-proof.mjs <id>`** — both sides on one sheet with a
millimetre ruler, because two sides that are each fine and together unusable is
the failure this line keeps having.

## Maps

A map is **generated**, not commissioned: `node tools/draw-map.mjs <id>` fills
`rows` from the commission block and renders the plate. There is no artist and no
tracing. `node tools/validate-map.mjs` is the check that matters — it knows about
harbours inland and rail across unbridged rivers.

A map whose `plate.kind` is `"drawn"` is the old two-agent path and still works;
`tools/mint-request.mjs <id>` assembles its commission.

## Standing rules

- **Never hand-edit a generated file.** `docs/data/bundle.js`,
  `docs/design/14-annex.md`, `docs/cards/`, `docs/boards/`, `docs/book/`,
  `docs/mint/`, `docs/art/mint/QUEUE.md` and a generated `docs/map/*.svg` are all
  outputs. Run their tool.
- **Never edit a drawn plate.** `docs/art/renders/*.png` and a drawn
  `docs/map/*.png` are committed as supplied. Cropping happens at read time from
  numbers, which is why a printed card and a thumbnail cannot disagree.
- **Never add a terrain to make a map work.** `data/terrain.json` is the
  vocabulary. Waterside is a relationship read off the board, not a terrain.
- **Ask rather than invent.** If a subject cannot be briefed without a design
  decision the user has not made, ask them.
- **Show the thing, not a description of it.** `tools/aim-preview.mjs` and
  `tools/card-proof.mjs` both write PNGs meant to be looked at and put in front of
  somebody. Their output is git-ignored — a proof is a photograph of the artefact,
  never the artefact, and `docs/cards/<code>.svg` remains the card.
