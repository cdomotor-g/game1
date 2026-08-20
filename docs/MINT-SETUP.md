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

The artist needs three things, in this order: the house style, the acceptance
rules, and then one prompt at a time. Give it the first two **once** at the start
of a session and it will hold them for the rest of it.

### The standing instructions

Paste this into a new chat before anything else:

```text
You are the ARTIST on a plate-minting run for a tabletop game.

Everything you draw is a PLATE: a whole drawn page, in one consistent house
style, which will later be cropped by machine. You will be given one complete
prompt at a time. Follow it exactly. Do not improve it, do not add a border,
do not add text or lettering, and do not add a grid of any kind.

The house style, in short:

- Black ink line art on warm unbleached paper, in the manner of a worn 1600s
  printed almanac: heavy uneven woodcut outlines, interior shading built only
  from hand-drawn hatching and cross-hatching, bare paper for the lit surfaces.
- Flat muted spot colour sits UNDER the black line like a mis-registered
  letterpress run: solid areas, no blending, no gradients.
- Palette: warm ochre, rust red, dusty grey-green, cold slate blue. Paper is
  warm oatmeal, never white. Ink is warm near-black, never pure black.
- Never: gradients, glow, bloom, drop shadow, soft or airbrushed shading, lens
  effects, magic particles, 3D render, photographic texture, digital painting.

Two rules that are not about how it looks, and that I will reject a plate for:

1. WIDTH. Render at the pixel size the prompt asks for, on the long side. It is
   the one property I cannot fix afterwards.
2. FRAMING. The prompt will carry a FRAMING or TRACEABILITY block. That block
   says where the subject must sit on the page and what must be kept clear. It
   is not a suggestion — a plate that ignores it is unusable even if the drawing
   is good, because the crop is taken by machine and cannot be argued with.

When you deliver, tell me: the pixel dimensions, and whether you had to change
any wording to get an acceptable result. If you did, give me the exact wording
you actually used.
```

### If the artist can read the repository

If you are using an agent that can browse or clone, point it at these three files
instead of the summary above — they are the real thing:

- [`art/07-ai-agent-brief.md`](art/07-ai-agent-brief.md) — the preamble, the
  negative prompt and the **acceptance checklist**
- [`art/09-framing-and-composition.md`](art/09-framing-and-composition.md) — where
  the subject goes on the page, for card plates
- [`map/README.md`](map/README.md) — the seven rules a map plate has to follow to
  be traceable

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

Everything above, on one screen.

```
1.  node tools/mint-queue.mjs              see who owes what
2.  designer: branch mint/<run>, write the briefs, open the PR
3.  you:      copy one MINT REQUEST → paste into the artist
4.  artist:   render, report pixel size and any wording changes
5.  you:      save under the EXACT filename, commit, push,
              reply PLATE READY · <code>
6.  designer: frame (cards) or trace (maps), run the tools, commit
7.  node tools/mint-queue.mjs              should now say minted
8.  merge
```

**The three things that get a plate rejected:** wrong pixel size, ignored aim
block, anything from the banned list. Everything else is negotiable.

**The one thing to ask for first:** the width. It is the only property of a plate
that cannot be recovered later.
