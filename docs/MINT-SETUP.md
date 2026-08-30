# Setting up the mint

**This is the how-to.** [`MINT.md`](MINT.md) says what the mint *is* — the lines,
the four steps, the contracts. This says how to actually set up the two agents,
what to paste into each of them, and what to do when a run goes wrong.

Read it once end to end before your first run. After that, the
[Run sheet](#the-run-sheet) at the bottom is the only part you need open.

---

## 0 · What you need

| | |
| --- | --- |
| **The designer** | Claude Code, pointed at this repository. The web app, the desktop app or the CLI — all three work; the web app is easiest because the pull request happens where the agent already is |
| **The artist** | Any image model you can hold a conversation with and get files out of. ChatGPT is the default. Midjourney and the rest work, but you become the courier: they cannot commit to a branch, so you download and push |
| **A GitHub account** | with write access to this repository. Both agents work on one branch and talk in one pull request thread |
| **Node** | only if you want to run the tools yourself. The designer runs them for you |

You do not need an image model that can write files. If it cannot, you save the
PNG and push it — the pipeline does not care who moved the bytes, only that the
file has the right name and lands in the right folder.

---

## 1 · Set up the designer

The designer is the one that has to be told the most, and almost all of it is
already written down in this repository. The whole set-up is: point it here and
tell it which line it is working.

### The opening message

Paste this, filling in the two blanks:

```text
You are the DESIGNER on a mint run for this repository.

Read docs/MINT.md first — it is the pipeline, and it is binding. Then read
data/mint.json for the line you are working.

Line:    <cards | maps>
Run:     <a short name, e.g. "dragons-and-airships" or "sundering-isles">

Do this, in order:

1. Run `node tools/mint-queue.mjs` and tell me what is at each step.
2. Branch `mint/<run>`.
3. For everything at step 1 (WRITE), write its brief into the line's prompt
   file, under a `## <plate-id>` heading, following the shared preamble at the
   top of that file and the line's aim contract.
4. Run the full check list at the bottom of docs/MINT.md and commit.
5. Open a pull request, then post ONE comment per subject in the format
   docs/MINT.md gives for MINT REQUEST — with the complete prompt pasted in,
   preamble and negative prompt included. Do not link to the brief. Paste it.

You own data/, docs/art/prompts/, docs/art/framing.json, data/maps/ and every
tool. You do not draw. If a subject cannot be briefed without a design decision
I have not made, ask me rather than inventing one.
```

### What the designer must never do

Say this once and it will hold, because it is also written into `CLAUDE.md` and
the tools enforce most of it:

- **It does not edit a plate.** Not to crop it, not to resize it, not to "clean it
  up". `docs/map/*.png` and `docs/art/renders/*.png` are committed as supplied.
  Cropping is done at read time by `docs/js/framing.js`, from numbers, so that a
  printed card and a thumbnail cannot disagree.
- **It does not add a terrain to make a map work.** The ten terrains in
  `data/terrain.json` are the vocabulary; if a drawn map calls its country
  something the game has no word for, the map changes and the rules do not. The
  order of resolution is in [`map/README.md`](map/README.md).
- **It does not hand-edit a generated file.** `docs/data/bundle.js`,
  `docs/design/14-annex.md`, `docs/cards/`, `docs/book/`, `docs/mint/` and
  `docs/art/mint/QUEUE.md` are all outputs. CI fails if any of them has drifted
  from its source.

### Checking it is set up right

Ask it: **"run `node tools/mint-queue.mjs` and paste the output"**. If it comes
back with a per-line breakdown, a shelved line for tiles and a note about plate
sizes, it is reading the right things.

---

## 2 · Set up the artist

**The artist is ChatGPT, pointed at this repository.** That is the route, and it
is the route because it was tried the other ways: a machine artist on Hugging
Face cost a quota to produce plates nobody shipped (§4a, retired), and a summary
of the house style pasted into a chat is a copy that goes stale the day the style
changes — which is exactly what happened, and cost a set of plates.

So do not describe the style. Point at it:

- [`art/07-ai-agent-brief.md`](art/07-ai-agent-brief.md) — the preamble, the
  negative prompt and the **acceptance checklist**. Both prompt blocks in it are
  generated from [`../data/artstyle.json`](../data/artstyle.json), so they cannot
  be out of date.
- The brief itself — `art/prompts/<deck>.md`, at the `## <plate-id>` heading. It
  already carries the preamble, the subject and the `FRAMING.` block.
- [`art/09-framing-and-composition.md`](art/09-framing-and-composition.md) — where
  the subject goes on the page, for card plates.
- [`map/README.md`](map/README.md) — the seven rules a map plate has to follow to
  be traceable.

`node tools/mint-request.mjs <code>` prints the whole commission with the brief
pasted in full, which is the thing to hand over if the artist cannot browse.

The finished plate goes to `docs/art/renders/<plate-id>.png`, named exactly as
the brief's heading — the name is the contract, and nothing is built until the
file is there under that name.

### The standing instructions

Paste this into a new chat before anything else. The style is deliberately *not*
restated here — it is one link, so there is no copy to go stale:

```text
You are the ARTIST on a plate-minting run for a tabletop game.
Repository: github.com/cdomotor-g/game1 — read it before you draw anything.
One plate at a time. Where anything is unclear, stop and ask rather than guess.

─── 1 · WHICH SUBJECT ──────────────────────────────────────────────────
Do not "take the first brief you find". Most briefs in that repository are for
plates that were finished long ago, and a finished one looks identical to a
waiting one until you check.

  a. Open docs/art/mint/QUEUE.md. It has one section per production line —
     "## Cards", "## Maps", "## Building tiles" — and each has its own
     "### 2 · DRAW — the artist" table.

     Work the CARDS table unless I have said otherwise. If I have said
     "building tiles", work that one instead; everything below is the same.

  b. Take the TOP row of that table, unless I have named a subject.
  c. Open its brief: the "## <plate-id>" heading in the line's prompt file —
     docs/art/prompts/<deck>.md for a card, docs/art/prompts/buildingtiles.md
     for a building tile. The table gives you the deck and the plate id.
  d. The one-line marker directly under that heading must read
     "WAITING — THIS ONE IS YOURS".
     If it reads "ALREADY DRAWN — DO NOT DRAW THIS", stop and tell me: the
     queue and the marker disagree and I need to look at it.
  e. If that table is empty, say so and stop. Nothing is waiting.

Tell me which subject you have taken, and its plate id, BEFORE you draw.

─── 2 · YOUR PROMPT ────────────────────────────────────────────────────
Three parts, all in the same prompt file you opened at 1c:

  · the "## Shared preamble" block at the top — the house style
  · the fenced text block under your "## <plate-id>" heading — the subject,
    which already carries its own FRAMING block
  · the "## Negative prompt" block — what must not appear

Use them as written. Do not paraphrase them, do not improve them, and do not
add anything the brief did not ask for.

If the subject block carries a WINDOW or a LABEL BAND paragraph, those are not
advice. WINDOW says how much of your page survives being cut to the piece.
LABEL BAND says which corner gets a solid name band printed over it, so nothing
that identifies the subject may sit there. Building tiles always carry both.

READ THE WHOLE SUBJECT BLOCK BEFORE YOU START. If it opens by telling you what
the thing IS, that is there because the name alone is misleading, and it
outranks whatever the name suggests to you.

─── 3 · WHAT A PLATE IS ────────────────────────────────────────────────
ONE WHOLE DRAWN PAGE OF ARTWORK, AND NOTHING ELSE. It is not a card.

Do not draw: a card frame, a border rule, a title, a card code, stat icons, a
rules text box, flavour text, a name banner, a caption, or lettering of any
kind anywhere on the page.

Every one of those is set by machine afterwards, from the data, over a crop of
your page. A plate that arrives looking like a finished card is unusable and
gets thrown away.

─── 4 · THE STYLE ──────────────────────────────────────────────────────
A FINE PEN-AND-INK drawing, hatched, then TINTED with thin translucent
watercolour that the hatching shows through. A nib line: fine, springy, varied,
only a little heavier round the outside of a form than within it. All tone
built from short feathered hatch strokes, dense, crossed in the darks, with
bare paper kept for the brightest highlights only. Muted, desaturated, uneven
washes on warm aged paper.

It is NOT a woodcut, not a block print, not flat vector colour, not a thick
even outline round a flat fill, and not high-contrast poster art.

The full written rule is the "## Prompt preamble" block in
docs/art/07-ai-agent-brief.md. Follow it exactly, and do not work from what the
words remind you of.

─── 5 · THE TONE ───────────────────────────────────────────────────────
Workaday and observed, never theatrical. Ordinary daylight, ordinary ground,
nothing staged to look frightening or heroic.

Even a monster is a naturalist's plate: a dangerous animal at a wary distance,
doing what it ordinarily does. No snarl, no glowing eyes, no bared fangs, no
blood-red sky, no ruined castle on the skyline, no dead trees, no wasteland.

─── 6 · THE REFERENCE SHEET ────────────────────────────────────────────
Three accepted plates, captioned with what to look at:

  https://cdomotor-g.github.io/game1/art/style-reference.png

Fetch it over that URL. A GitHub connector hands you text and never the bytes
of an image, so the repository's own copy of a plate will not work.

If you still cannot SEE it: do not stop and do not guess. Say so plainly, ask
me to paste it into this chat, and draw from the written preamble meanwhile.
The words are what a plate is drawn FROM; the sheet is what it is checked
AGAINST. A missing reference is never a reason to hold up a run.

─── 7 · I WILL REJECT A PLATE FOR ──────────────────────────────────────
  · card furniture — a frame, a panel, or lettering of any kind (§3)
  · THE WRONG SHAPE. The first words of the FRAMING block name the page:
    "Square plate", "A4 portrait", "Landscape 3:2". Deliver that shape. A
    square deck given a 2:3 portrait page is cropped to a square anyway, so
    a third of what you drew is thrown away and the composition with it
  · WIDTH below what the brief asks for on its long side. It is the one
    property that cannot be fixed afterwards
  · ignoring the rest of the FRAMING block, or the WINDOW or LABEL BAND
    blocks. The crop is taken by machine and cannot be argued with, so a
    plate that ignores them is unusable even when the drawing is good
  · drawing the subject IN USE when the brief says it is laid out on its own.
    A fitting is drawn dismounted, on a workshop floor, before it goes on —
    not mounted on a vehicle, and not in a landscape

─── 8 · DELIVERY ───────────────────────────────────────────────────────
Do not commit anything and do not open a pull request. The queue's own table
says to commit the finished PNG — that instruction is for the designer, not for
you. Ignore it.

Show me the image in this chat and wait. With it, tell me:

  · the plate id, the pixel dimensions, and the page shape you drew
  · whether you were able to see the reference sheet
  · any wording you had to change to get an acceptable result, quoted exactly

When I approve it, it goes to docs/art/renders/<plate-id>.png — named exactly
as the brief's heading, and nothing else.
```

---

## 3 · What every prompt must contain

A brief is not a sentence. Every one of them, in every line, has four parts, and
the queue's step 1 is not finished until all four are there.

| Part | What it does | Where it comes from |
| --- | --- | --- |
| **Preamble** | the house style, identical for every subject in the line | the top of the line's prompt file |
| **Subject** | this one drawing: what it is, what it is doing, what is around it, what the wash is on | written by the designer from the subject's own data |
| **Negative** | the banned list, identical for every subject in the line | the top of the line's prompt file |
| **Aim block** | how the drawing will be *read* afterwards | the line's aim contract |

The aim block is the part people leave out, and it is the part that decides
whether the plate is usable:

**For cards it is a `FRAMING.` block** — where the head, the hands and the named
gear sit on the page, and how much clear margin is left around them for the crop
to slide in. A plate is a page and a card window is not that shape, so something
is thrown away every time; the block is how the artist makes *any* crop
survivable.

**For maps it is a `TRACEABILITY.` block** — the seven rules from
[`map/README.md`](map/README.md), made specific to this map. Flat washes with hard
edges. One wash per terrain and no two terrains sharing one. Water colder than
every land colour. Display lettering off the terrain you care about. Map furniture
in the corners over water. A plain frame with a visible inner rule. And no grid,
ever.

Those blocks are not decoration and they are not for the picture's benefit. A
gradient is a region the tracer reads as two terrains. A fen and a desert painted
the same ochre cost the Korvane Reach the most hand-correction of anything on it,
because nothing in the pixels can separate them — only the label can, and the
label is prose.

---

## 4 · Run one

### Step 1 — see what is waiting

Ask the designer to run the queue. Or run it yourself:

```bash
node tools/mint-queue.mjs
```

It prints, per line, who owes what. It also writes
[`art/mint/QUEUE.md`](art/mint/QUEUE.md), which is on the website. Nothing is
tracked by hand: it works this out from the repository every time, so it cannot be
wrong, only out of date.

### Step 2 — the designer writes the briefs and opens the PR

You get a pull request with one comment per subject. Each comment is a complete,
self-contained commission — everything the artist needs, in one paste.

### Step 3 — you carry the commission to the artist

Copy one `MINT REQUEST` comment. Paste the prompt part into the artist's chat.
That is the whole job. Do not summarise it, do not trim it, do not paste two at
once — one subject per message keeps the style from drifting.

### Step 4 — the plate comes back

Save it under the exact filename the request gave. Not `dragon-final-v3.png`. The
filename is how three different tools find it.

```bash
git add docs/art/renders/monster-vhalrik-the-cinder-crowned.png
git commit -m "Plate: Vhalrik, the Cinder-Crowned"
git push
```

Then reply on the subject's thread with `PLATE READY · <code>`, and note any
wording you had to change. If the wording changed, save what was actually used
next to the image as `<plate>.txt` — a prompt that produced an accepted render is
worth more than the one that was written.

### Step 5 — the designer aims it and builds

Ask the designer to pull and finish. It adds the framing entry or traces the
board, runs the tools, and commits the regenerated files. Then run the queue once
more: the subject should say **minted**.

### Step 6 — merge

Merge the pull request. The site rebuilds on push and the new card or map is on
it.

---

## 4a · The courier, when the artist is a machine on Hugging Face — RETIRED

> **This route is retired. Do not commission a plate through it.** It is kept
> written down because the machinery still exists and works, and because the
> reason it was retired is worth not re-discovering: the plates it returned were
> not the house style, the quota it burned was real, and judging six candidates
> on a contact sheet is slower than one good plate from an artist who can read
> the brief. §2 is the route — ChatGPT, pointed at this repository.
>
> Nothing is deleted: `tools/mint-job.mjs`, `tools/hf/draw-plate.py` and
> [`.github/workflows/fetch-plate.yml`](../.github/workflows/fetch-plate.yml) are
> all intact, and this section comes back by using them.

An artist that draws on [Hugging Face](https://huggingface.co) leaves the plate
there, and it has to reach `docs/art/renders/` before anything can be built from
it. Step 4 above assumes a person carries it. This is the version where nobody
does.

The awkwardness is that neither end can reach the other. A Claude Code session
commissioning a plate cannot reach `huggingface.co` at all — the organisation's
egress policy denies it, and that is a setting to respect rather than work
around. A job running on Hugging Face can reach the internet freely, but pushing
to this repository would need a GitHub credential, and the only way to hand one
to a chat session is to paste it into the conversation, where it stays forever.

**A GitHub Action can reach both, and it is already inside the repository**, so
it needs no credential to write here. That is what
[`.github/workflows/fetch-plate.yml`](../.github/workflows/fetch-plate.yml) is.

### Once, per repository

Add the Hugging Face token as an Actions secret:

1. **github.com** → this repository → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**
4. Name it exactly `HF_TOKEN`; paste a token from
   [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) with
   **read** access to the dataset holding the plates

The token lives in GitHub's secret store, which is where a token belongs. It is
never typed into a conversation, and a public plate dataset does not need one at
all — the workflow sends the header only when the secret is set.

### The drawing job, and what it costs

The job that draws a plate is `tools/hf/draw-plate.py`, committed so nobody
retypes it. `node tools/mint-job.mjs <id>` prints the `hf_jobs` call that runs it.

**The meter is real.** A single mint run — the granary — spent about twenty-two
minutes of `a100-large` over five jobs and emptied the account's Hugging Face
quota, returning eight plates of which one shipped. Roughly half that time drew
nothing: each job re-downloads fifty gigabytes of Qwen-Image and reinstalls
sixty-three packages first, which is two to three minutes of setup whether the job
then draws one picture or twelve.

So: **one job per subject, and draft before final.** Six candidates at 640 px and
eight steps come back tiled on one contact sheet for about a tenth of the cost of
one full plate, and that is enough to see everything that actually goes wrong.

Three traps, each of which has already cost a whole job:

| Trap | What happens | Do |
| --- | --- | --- |
| `with` instead of `with_deps` | the dependency list is dropped in silence; the job schedules, starts bare, and dies on `ModuleNotFoundError: huggingface_hub` | pass `with_deps` |
| `l40sx1` instead of `a100-large` | Qwen-Image is 20B and needs ≥48 GB even with `enable_model_cpu_offload()`; the job queues for hardware, then fails | pass `a100-large` |
| cancelling with a sibling running | cancelling one job has taken another of the same account's running jobs with it | never run two drawing jobs at once; after any cancel, `inspect` to see which actually stopped |

**When the quota is spent** the API answers `402 Payment Required` on submit.
That is not a reason to abandon a run: plates already drawn are still in the
dataset and every step after drawing — carrying in, aiming, building, proofing,
shipping — costs nothing. Pick the best plate you have, land it, and say plainly
what was blocked.

### Per plate

Run the **Fetch plate** workflow with the plate id — from the Actions tab, or by
dispatch from wherever the mint is being driven. It fetches the plate, refuses
anything that is not a readable PNG, picks up the frozen wording if the dataset
has any, rebuilds what the plate feeds, and commits. The subject moves off DRAW
on its own, because the queue is computed from the repository rather than stored.

It takes the **full** plate. Reduced copies only ever existed to squeeze a
picture through a chat window, and nothing on this path has to.

## 5 · Accepting and rejecting

The one rule that keeps this from turning into taste: **reject with one concrete
reason from the checklist, never with a feeling.**

| Good | Useless |
| --- | --- |
| "The subject is against the top edge; there is no margin for the crop to slide in" | "It doesn't feel right" |
| "The fens and the desert are the same ochre — nothing in the pixels can separate them" | "The colours are a bit off" |
| "1024 px on the long side; the brief asked for 4000" | "It's a bit low-res" |
| "There is lettering in the picture and the brief bans text" | "Too busy" |

If the honest reason really is "it doesn't feel right", then **the brief was
wrong** and the designer owns the fix. Rewrite the brief, do not re-roll the
image; a re-roll against a bad brief is a slot machine.

The draft sheet makes this cheap to act on: six candidates from one wording, side
by side. **If they all fail the same way, the wording caused it** — three granary
drafts all came back with a horizon and a treeline, because the wording had asked
for "a wide field, seen from some way off", and a model that draws distance draws
a horizon. Change the sentence, not the seed.

And write the rejection down. Every plate keeps a
`docs/art/renders/<plate>.attempts.md` with the wording, the seed and the reason,
because a rejection nobody recorded is one somebody pays for twice.

---

## 6 · When it goes wrong

| Symptom | What is actually happening | Fix |
| --- | --- | --- |
| The queue says a subject is at DRAW and you have pushed the plate | the filename does not match the plate id | rename it to exactly what the request said |
| The queue says a card is at FRAME forever | the plate is committed, `framing.json` has no entry | the designer adds `subject`, `focal` and `note` |
| A card's picture is cropped to somebody's chest | there is a `subject` box and no `focal` point | add the focal point — two numbers |
| The map traces as one giant mountain range | display lettering reads as ink to the sampler | move the big names over sea, or hand-correct those rows |
| Two regions trace as the same terrain | two terrains share a wash on the plate | it is a plate problem, not a data problem — reject and re-render |
| CI fails on "stale" something | a generated file was not rebuilt | run the list at the bottom of [`MINT.md`](MINT.md) and commit |
| The style drifted halfway through a deck | the artist's session lost the preamble | re-paste the standing instructions and re-check against the first accepted plate in the deck |

**Work a deck at a time.** Generate one reference render, accept it, then match
the rest of the deck to it. Re-check against the reference every ten renders or
so — style drifts slowly enough that you will not notice inside a session.

---

## The run sheet

Everything above, on one screen. **Take the short sheet unless something is wrong
with it** — the long one is what the short one falls back to, not a different job.

### Cards — the short sheet

```
/mint MOD-01
```

That is the whole thing. `.claude/commands/mint.md` carries the briefing that used
to be pasted out of §1 of this document, so the instruction is a role and a
subject and nothing else. It runs the queue, writes the card and its brief if
either is missing, draws the plate with `tools/mint-draw.mjs`, reads the result,
writes the framing entry, runs the tools and commits.

`/mint --deck modifications` does a whole deck, one subject at a time, so the
style cannot drift. `/mint a new fire monster, a cinder-crowned stag` starts from
nothing.

### Maps

```
node tools/draw-map.mjs sundering-isles
```

A map is generated, not commissioned: the board is grown from its `commission`
block and the plate is drawn from the board. No artist, no tracing, no proof-sheet
rounds. `node tools/validate-map.mjs` is the check that matters — it knows about
harbours inland and rail across unbridged rivers. See **Generated maps** in
[`MINT.md`](MINT.md).

### Cards — the long sheet

Two agents, for when the API is unreachable, when the result is not good enough,
or when you would rather draw it yourself.

```
1.  node tools/mint-queue.mjs              see who owes what
2.  node tools/mint-request.mjs MOD-01     the complete commission, assembled
3.  you:      paste it into the artist (standing instructions once, up top)
4.  artist:   render, report pixel size and any wording changes
5.  you:      save under the EXACT filename, commit, push
6.  designer: frame it, run the tools, commit
7.  node tools/mint-queue.mjs              should now say minted
```

`tools/mint-draw.mjs` drops to step 2 by itself when it cannot reach the model, so
you get the commission printed rather than an error. Nothing is lost — the long
sheet is the version that definitely works, and the short one is a shortcut
through it.

**The three things that get a plate rejected:** wrong pixel size, ignored aim
block, anything from the banned list. Everything else is negotiable.

**The one thing to ask for first:** the width. It is the only property of a plate
that cannot be recovered later.
