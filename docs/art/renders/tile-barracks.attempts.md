# tile-barracks — what was tried

`tile-barracks.txt` beside this file is the wording the accepted plate was drawn
from. This is everything that did not work and why, including the things that
were wrong in the *brief* before a single plate was drawn — the granary proved
those are the expensive ones, because a bad brief spends plates six at a time.

Model: `Qwen/Qwen-Image`, 1328×1328, `a100-large`.

## Four things the brief asked for that the piece cannot do

None of these cost a plate, because the envelope was read first. All four would
have, and three of them are the granary's own lessons wearing a different roof.

| the brief said | why it could not work |
|---|---|
| "A **long** two-storey block", "Block across the upper half" | A triad keeps only its **centre half** below the shoulder. This is exactly what took the granary's scoop and the base of its outer staddle stones, and no framing entry can undo it — a triad's window is 0.99 against a square plate, so the crop keeps the overhang and hands it to the die. `node tools/tile-envelope.mjs barracks` prints the box; the subject now composes inside it. |
| "**full on to the viewer** so the window rank reads as a rank" | Flatly against the one rule that makes fifty-four plates look like one set — *"Seen from above and to the side, never head-on"* — and `elevation drawing` is in this deck's own negative prompt. The positive was asking for the thing the negative bans. The rank reads better in three-quarter anyway: it recedes, so it carries rhythm *and* depth. |
| "yard wall and gate across the **lower right**" | On a triad the lower right is not trimmed, it is **absent** — below roughly 57% of the height only the centre columns are part of the piece at all. The gate would have been drawn into the die. Wall and gate now gather directly under the block. |
| "**eight** below and **eight** above", "a rack of **eight** spears" | Sixteen openings and eight shafts on a 17 mm piece, against a preamble that allows *"three or four shapes and no more"*. The granary's two sacks — far chunkier things — still "shrunk to nothing" on three seeds. Cut to five and five, each one told to be big enough to read as a separate opening rather than a dot. |

The covered water butt went with them. Block, wall-and-gate, spear rack, drill
post is already four shapes; the butt was a fifth, it is in no building's data,
and it was the item most likely to arrive as an unreadable blob.

## One thing that is in the subject paragraph on purpose

`--render` strips the `FRAMING.` block, because a model draws headings it is
handed. So a composition note is safe to put there and a **depiction** note is
not: the three-quarter view is the single thing that decides whether this plate
reads as a barracks or as a doll's house, and it now sits in the subject
paragraph where the model will actually receive it. The `FRAMING.` block says so,
so nobody moves it back.

## Draft sheet 1 — all six rejected, one cause

`MODE=draft`, seeds 21, 34, 55, 101, 202, 303, one job. Every candidate came back
a **cottage**: two or three scattered windows, a steep gabled roof, domestic
proportions. Not one had a repeating rank. When six seeds fail the same way the
seeds are not the problem, so this was a wording fix and a redraft rather than a
re-roll.

| # | seed | rejected for |
|---|---|---|
| 1 | 21 | house, not a barracks — four irregular windows, steep gable, no rank. Vivid orange roof and acid-yellow grass against an explicitly muted palette. A river across the bottom that is in no part of the brief. |
| 2 | 34 | same house prior; six windows but irregularly placed. River and a stone bridge. The one candidate composed small enough for the die, which is the only reason it is worth recording. |
| 3 | 55 | **text rendered onto the page** — a paragraph of handwritten script across the middle left. Automatic reject. Timber-framed cottage, thatch, river. |
| 4 | 101 | house with an added lean-to; two windows total. Ground stops in a hard edge with bare paper beyond it — a floating diorama, not ground running to every edge. |
| 5 | 202 | closest to a rank — three ranks of windows — but drawn as a tall red-brick townhouse, saturated pink-red, and spanning nearly the whole page width. |
| 6 | 303 | steep red gable, two windows, and the worst of the floating-plinth failures: the walled yard sits on a green slab with pale paper on all four sides. |

**The four wording causes, all fixed once:**

- **"two-storey block ... with two plain chimneys" is a house.** Every prior the
  model has for that phrase is domestic, and it drew the prior six times. The
  building is now a *long low range*, its roof *shallow and hipped* rather than
  gabled — a hipped roof is the single cheapest way to stop a small stone
  building reading as a cottage — and the repetition is stated as the thing the
  building *is*, not as a property of its windows.
- **Asking for five windows got two or three.** The count was never the
  instruction; *unbroken, evenly spaced, identical, no window different from any
  other* is. Stated that way, with the count as a check on it rather than as the
  request.
- **Water in five of six, and it is in no brief.** The shared preamble's palette
  line ends "cold slate blue for stone, iron **and water**", and the model reads
  that as permission to put a river in. The preamble is not editable for one
  tile, so water went into this plate's negative instead.
- **Saturation, and ground that stops.** `saturated colours` was already in the
  negative and was not enough on its own; the positive now names the colours as
  greyed and chalky the way the accepted granary wording does, and says the
  ground runs past all four edges rather than merely to them.

That is three jobs for this subject rather than two. The runbook allows exactly
this — *"if every candidate fails the same way, fix the wording once and redraft"*
— and the alternative was re-rolling seeds against a prompt that was asking for a
cottage.

## Draft sheet 2 — the rank lands, the size does not

Same six seeds, v2 wording. **The building is now a barracks**: seeds 34, 101, 202
and 303 all carry a genuine unbroken rank of identical windows on a long low
range, and the cottage prior is gone. Stating the repetition as *what the building
is* rather than as a property of its windows was the fix, and the count never
mattered.

Every candidate still failed, and this time not all for one reason.

| # | seed | rejected for |
|---|---|---|
| 1 | 21 | reverted to a big barn — two windows, no rank at all. Drawn to every edge of the page. |
| 2 | 34 | **the best building on either sheet** and unusable: a true long range with a ten-window rank, correct grey slate hip. Ruined by page furniture — a ruled border round the whole plate, a title rendered top centre, a paragraph of handwritten caption across the bottom — plus a flat horizon and a canal with a bridge. |
| 3 | 55 | two thatched timber buildings, no rank, steep gables, floating on bare paper. |
| 4 | 101 | good long range and a clear rank, but a steep gable rather than a hip, water across the foreground, and ground that stops dead with pale paper on all four sides. |
| 5 | 202 | clear rank on a long range — and saturated orange-red brick, which is the brick-and-tile colour, on a building whose walls are named as grey stone. Drawn nearly page-wide. |
| 6 | 303 | a roof, close up, filling the frame. The subject is not even wholly on the page. |

**Two causes, both named, both fixed once.**

**The subject is drawn page-filling, every time.** The derived envelope sentence —
*spans no more than the central 50% of the width* — is a measurement, and a
diffusion model cannot act on a measurement. The granary's file already records
that the obvious repair makes it worse: asking for distance ("small in the frame",
"seen from some way off") buys a landscape, and seed 34 bought exactly that again,
horizon and all. What the *accepted* granary wording did instead was never mention
the viewer at all — it said what fills the rest of the page, corner by corner. That
technique is now used here, and the envelope sentence is left to do its own job.

**Pulling back makes the model draw the page, not the picture.** Seed 34's border,
title and caption are the shared preamble's *"worn 1600s surveyor's field book"*
being taken literally the moment the subject stops filling the frame — it drew the
whole leaf of the field book, furniture included. `text` and `frame border` were
already in the negative and did not hold. Caption, page border and plate number are
now named there explicitly, which is deck-wide safe: no tile in this set wants any
of them.

Also purged: every negation buried mid-sentence in the positive. `--render` strips
a *sentence* that negates, so "not a steep gabled one", "none decorated" and "no
blending" all survived into the prompt — three instructions to draw a gable, a
decoration and a blend. The roof, the windows and the wash are all stated as what
they are.

**Job count.** This is a third drawing job, and a fourth will draw the plate. The
budget for a subject is two. It is over because sheet 1 bought a wording fix and
sheet 2 bought a different one, and the alternative at each point was to spend a
*final* render on a prompt a draft had already shown to be wrong — which is the
more expensive mistake and the one the two-job rule exists to prevent.
