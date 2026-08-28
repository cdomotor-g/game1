---
description: Mint a card, tile or map end to end from one request — brief, draw on Hugging Face, carry the plate in, aim, build, proof, ship
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

Everything needed is automated and none of it needs them:

```
tile-envelope ─▶ brief ─▶ mint-request --render ─▶ ONE draft job (6 on a sheet)
      ─▶ pick a seed ─▶ ONE final job ─▶ actions_run_trigger fetch-plate
      ─▶ merge ─▶ aim ─▶ build ─▶ proof ─▶ push
```

**Two HF jobs per subject. Not five.** Drawing is metered and the granary emptied
the quota: twenty-two minutes of `a100-large` over five jobs, eight plates, one
shipped. Half of that drew nothing, because every job re-downloads fifty gigabytes
of model before its first pixel. Draft six candidates in one job, look at the one
contact sheet, then draw the winner once.

**Stop and ask only if:** a subject cannot be briefed without a design decision
they have not made, or a plate keeps failing for a reason you cannot name. A
blocked tool is not a reason to stop — say what is blocked, do every part that
does not depend on it, and finish.

**Never ask them to move a file.** That was the old fallback and it is not one:
`fetch-plate.yml` exists precisely so nobody drags a PNG between two browser
tabs, and it does not survive being asked a hundred times.

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
2. **Draw it — on Hugging Face, then have the Action carry it in.** This is the
   part that runs without you touching a file. Three moves, all tool calls:

   **a. Get the model's prompt, which is NOT the commission.**
   ```bash
   node tools/mint-request.mjs <code> --render
   ```
   A commission is written for a person and carries blocks they read as
   instructions — `FRAMING.`, `WINDOW.`, `LABEL BAND.` A model cannot tell an
   instruction from a subject and **draws them**: the first warehouse plate came
   back with the brief rendered onto the page as paragraphs of text. `--render`
   strips those, moves every "no X" into the negative prompt where it belongs,
   and keeps the corner rule as the one depictive sentence it can be. It prints
   what it moved, so nothing is dropped silently. Never hand a model the plain
   commission.

   **b. Draw it — draft first, in ONE job.** Write the positive and negative to
   `hf://datasets/<owner>/game1-plates/render/<plate>.txt` and
   `prompts/negative-<plate>.txt` with `hf_fs_write`. Then
   `node tools/mint-job.mjs <id>` prints the exact `hf_jobs` call; the script it
   names is `tools/hf/draw-plate.py`, which is committed so nobody retypes it.

   Pass the script **verbatim**. Never inline a variant — an inlined job is a job
   per attempt, and a job per attempt is what emptied the quota.

   | | |
   | --- | --- |
   | `flavor` | `a100-large`. Qwen-Image is 20B; with `enable_model_cpu_offload()` it needs ≥48 GB, and `l40sx1` queues for hardware. |
   | `with_deps` | **not `with`.** Pass `with` and it is silently dropped, the job starts bare and dies on `ModuleNotFoundError` after it has already been scheduled. |
   | `secrets` | `{"HF_TOKEN": "$HF_TOKEN"}` — substituted server-side |
   | draft | `MODE=draft` — six seeds at 640 px / 8 steps, tiled onto ONE sheet |
   | final | `MODE=final SEED=<n>` — 1328², 34 steps, only for a seed the sheet earned |

   **Cancelling can take siblings with it.** Cancelling one job while another of
   yours is running has killed the wrong one. Do not run two drawing jobs at once,
   and if you must cancel, verify with `inspect` which one actually stopped.

   **Judge the draft sheet, not a full render.** One `hf_fs attach` on
   `draft/<plate>-sheet.jpg` shows every candidate at once. Five of the granary's
   six rejects were plainly visible at draft size — a horizon that should not
   exist, a subject too big for the die, text rendered onto the page, a colour
   cast. Reject against the checklist in `docs/art/07-ai-agent-brief.md`, say the
   concrete reason, and **write it into `docs/art/renders/<plate>.attempts.md`** so
   the next run does not buy the same lesson. Three of the granary's six went the
   same way because the wording that caused it had not been written down.

   If every candidate fails the same way, fix the wording once and redraft —
   do not re-roll seeds against a prompt that is wrong.

   **c. Carry it in.** Dispatch the courier and it lands, builds and commits
   itself:
   ```
   mcp__github__actions_run_trigger  run_workflow  fetch-plate.yml  ref: main
     inputs: { "plate": "<plate-id>" }
   ```
   Then `git fetch origin main && git merge --ff-only origin/main`. The subject
   moves off DRAW on its own, because the queue is computed rather than stored.
   Setup and the one secret it needs are `docs/MINT-SETUP.md` §4a.

   **If any of that is unavailable** — no HF connector, no PRO, quota spent —
   `node tools/mint-draw.mjs <code>` degrades to printing the commission for a
   human to run, and exits clean. Hand that over rather than inventing a plate.

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
4. **Build and check.** `node tools/mint-build.mjs <code>` is the six tools a
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
