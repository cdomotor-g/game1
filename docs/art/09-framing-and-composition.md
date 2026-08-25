# 09 — Framing and composition

Every other document here is about how a picture should *look*. This one is about
where the subject should *be*, which is the thing that has actually gone wrong so
far: plates that are lovely on their own and put a character's chin on the top
edge of their own card.

It exists because a plate is never shown whole. Read
[`01-two-plate-system.md`](01-two-plate-system.md) for the ink and wash rules and
[`07-ai-agent-brief.md`](07-ai-agent-brief.md) for the prompt preamble first;
this is the geometry layer under both.

## The one fact every prompt has to be written around

**A plate is a page. A card window is not.**

The plates in `renders/` are whole drawn sheets — A4 for the figures, square for
the talismans, 3:2 for the vehicles. Nothing that shows one is that shape. A card
window is nearly square. An explorer thumbnail is 5:4. So something is thrown
away every single time, and the only question is what.

```
   the plate (A4)                what a card window takes
   ┌───────────────┐             ┌───────────────┐
   │      sky      │             │ ░░░░░░░░░░░░░ │  ← spent
   │   ┌───────┐   │             ├───────────────┤
   │   │ head  │   │             │   ┌───────┐   │
   │   │ hands │   │  ═══════▶   │   │ head  │   │  ← the subject box,
   │   │ gear  │   │             │   │ hands │   │    grown to the window
   │   └───────┘   │             │   │ gear  │   │
   │    ground     │             │   └───────┘   │
   │    ground     │             ├───────────────┤
   └───────────────┘             │ ░░░░░░░░░░░░░ │  ← spent
                                 └───────────────┘
```

An agent generating art cannot see the card. So the prompt has to build the plate
so that *any* crop of it is survivable, and the framing entry has to say where the
crop should aim. Those are two different jobs and both are required.

## The three numbers

All of it lives in [`framing.json`](framing.json), one entry per plate, and the
arithmetic lives once in [`../js/framing.js`](../js/framing.js) — which the card
builder, the explorer and the build tools all load, so a printed card and a
thumbnail of the same plate cannot disagree.

| | What it says | Who writes it |
| --- | --- | --- |
| **`subject`** | `[x, y, w, h]` — the box that may **not** be cut: the head, the hands, and the gear the card names | whoever accepts the render |
| **`focal`** | `[x, y]` — the one point the picture is **of**. A face, nearly always | whoever accepts the render |
| **`focalTarget`** | `[x, y]` in the *window* — where that point should land. Defaults to `[0.5, 0.4]` for everything | set once, globally |

`subject` is a veto and `focal` is an aim, and they are not the same thing.

- The crop **grows** the subject box until it is the window's shape. It never
  shrinks it. A tight box does not crop tighter — it just brings more scenery.
- Then the crop **slides** so the focal point lands on the target, as far as the
  subject box allows. The subject always wins; if there is no slack, nothing moves.

Without a focal point the crop centres on the subject box — and the centre of a
standing figure's bounding box is their sternum. **A portrait framed on a sternum
is a portrait of a coat.** That is the specific failure this file exists to stop.

### Why `[0.5, 0.4]`

Faces belong slightly above the middle of a frame — it is where a reader looks
first, and a face dead-centre reads as a passport photo. Forty per cent down is
the whole of the rule of thirds we need; the rest of it is not worth encoding.

## Composing the plate so it survives the crop

This is the part that goes in the **prompt**, because it is the artist's job, not
the framer's.

**1. One subject, and put it in the middle third.** Not the middle of the page —
the middle horizontal third. Above it is sky, sheet edge, hanging tools; below it
is ground, table, water. Both are spendable and both should be there, because a
plate with the subject running edge to edge has nothing to spend and crops badly
to *every* shape.

**2. Nothing the card names may touch an edge.** If the card says "a lantern and a
ledger", the lantern and the ledger are inside the safe area with the head, or the
subject box has to grow to reach them and the crop pulls back until the face is
small. Draw the named objects *close to the figure*.

**3. Leave 8% of the page clear on every side.** That is the margin the crop uses
to slide. A plate with no margin cannot be aimed.

**4. Face three-quarters, looking into the frame, not out of it.** A subject
looking off the near edge crops as a subject leaving.

**5. One horizon, low.** It reads as ground at any crop. Two competing horizontals
read as a mistake at some crops and a design at others.

**6. Draw the whole page anyway.** The parts that get spent are still what make the
kept part look drawn rather than cut out. Never generate "a card image".

### The framing block for a prompt

Paste this into every new prompt, filled in, under the subject description:

```
FRAMING. A4 portrait plate, whole page drawn edge to edge.
Subject occupies the middle horizontal third, centred left-to-right.
Head and both hands and <the named gear> all well inside the middle 84% of the
page — nothing the card names may touch an edge.
Face turned three-quarters toward the centre of the page.
Low horizon in the bottom third. Clear, quiet page above the subject's head.
Do not compose this as a card, a poster or a framed illustration: it is a sheet
from a field folio, and a card window will be cut out of it later.
```

## When a render is accepted

Both of these, in the **same commit as the PNG**:

1. `docs/art/renders/<id>.png`
2. an entry in `framing.json` with `subject`, `focal` and a one-line `note`

A plate with no entry is framed on the middle of the page — which is the original
bug — and `build-cards.mjs` and `build-data.mjs` both warn about it. A plate with
a `subject` but no `focal` works and is not warned about, because thirty plates
predate the focal point; new plates get one.

### Reading the numbers off an image

Open the PNG, and measure in fractions of its width and height from the top-left.

```
subject = [ left/width, top/height, boxwidth/width, boxheight/height ]
focal   = [ (centre of the face)/width, (centre of the face)/height ]
```

Draw `subject` **loose** — a couple of per cent outside what you think. The crop
grows this box; it never shrinks it, so being generous costs you scenery and being
mean costs you the subject.

Better than drawing it: **measure the ink and let the arithmetic run backwards.**

```bash
node tools/plate-map.mjs  MON-13                       # where the ink is, as text
node tools/aim-solve.mjs  MON-13 --keep 0.10,0.015,0.92,0.801 \
                                 --focal 0.419,0.238 --spend top
```

`--keep` is the ink as EDGES, which is how a measurement reads off a page.
`--spend` is the honest half: when a window's budget is smaller than the subject
the question stops being *where does the box go* and becomes *what am I giving
up*, and `aim-solve` will put the loss exactly where you say and tell you what it
cost. It will not choose for you, and the `note` it writes says TODO until you do.

It searches rather than inverting `crop()`, so it cannot drift from the crop the
cards actually use — and it is not sentimental about the box. The box is a
**control input**, not a description: on a subject that overflows its window the
answer often starts below the top of the ink and lets `pad` carry the difference,
which is a thing nobody would write by hand and which is exactly right.

Then **look at what you chose**:

```bash
node tools/aim-preview.mjs MOD-01
```

It cuts the plate exactly as the card window and the explorer thumbnail will —
same `crop()`, and the card window is read off the built card rather than guessed
— and stacks both crops on one sheet in `docs/art/aim/` (git-ignored) for you to
open. If something the card names is cut, grow `subject`; if the crop is centred
on the wrong thing, move `focal`. A plate with no entry previews on the whole
page, which is the fastest way to see what an entry is for.

It also prints, per window, the one number no subject box can argue with:

```
card 1.10  holds at most 64.2% of the page height, 100.0% of its width
           (box + pad wants 75.5%) - TRIMS 9.5% off the bottom
```

**A window's height budget is the plate's width divided by the window's aspect**,
and it is fixed before anybody writes a number here. A subject spanning 79% of an
A4 page cannot be framed whole by a 1.10 window at any position, however the box
is drawn — so when the budget is smaller than the subject, the question stops
being "where do I put the box" and becomes "what am I spending", which is a
decision, and belongs in the `note`.

Nothing checks whether a trim was decided or merely happened. What
`tools/validate-framing.mjs` checks is that no trim is a **surprise**: it runs
the same `crop()` over every framed plate against its deck's current window, so a
deck whose window changed shape cannot silently re-crop the plates already aimed
in it.

### The framing checklist

- [ ] Entry exists in `framing.json`, in the same commit as the PNG
- [ ] `subject` contains the head, both hands, and every object the card's text names
- [ ] `subject` is drawn loose, not tight
- [ ] `focal` is on the face — or, for a vehicle, the wheelhouse, cab or driver;
      for a monster, the eye
- [ ] The plate has at least 8% clear on every side for the crop to slide in
- [ ] Cropped to 1:1 the subject still reads. Cropped to 5:4 it still reads
- [ ] `note` says in one line what the box is around, for the next person — and,
      if the window trims it, what you chose to spend and why
- [ ] `node tools/validate-framing.mjs` reports the trim you expected and no others

## Plate formats

| Deck | Plate | Why |
| --- | --- | --- |
| Peoples, monsters, characters | A4 portrait | Full-length or three-quarter figures |
| Vehicles | A4 landscape, 3:2 | A vehicle is a profile, and profiles are wide |
| Talismans | Square | A single object study, lit on a table |
| Modifications | Square | A fitting is an object, and it is shown off the vehicle |

The card window takes the tallest shape the deck's wordiest card leaves free, in
the deck's own plate proportion where that fits — so a deck deals out as one deck
and not as a set of cards each with its own horizon. That is decided by
`build-cards.mjs`, not by the prompt, and it is the reason the prompt must not try
to compose for a card.
