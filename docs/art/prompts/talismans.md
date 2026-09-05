# The talismans — object studies (talisman-tal-01 … talisman-tal-06)

Six single-object studies, one per talisman card (`data/items.json`, class
`talisman`), in deck order. Talismans are **arcane subjects**: the only deck
that gets the violet, and the violet is a printing error — the flat wash
(#6B4C7D) prints out of register, offset past the black line, and never glows.
The brief's arcane rules apply in full.

The object itself is drawn like every other made thing in the game: timber,
metal, cord and glass, worn from daily handling and carefully kept. The mana
bar, name and code are set in type later; the render is the object alone.

Square page, single object, centred. How many pixels is not stated here: the marker under each heading carries the figure, derived from the card's safe area at the print scale `data/mint.json` declares, and a number typed into this file fails `node tools/build-prompts.mjs --check`.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated book of charms. Drawn
with a nib - a fine, springy, varied line, only a little heavier round
the outside of a form than within it, thinning and breaking where the
light catches an edge. Never a thick uniform outline.

All tone is hatching: short feathered strokes laid along the form and
crossed over one another in the darks, fine and dense enough to read as
continuous shadow at arm's length and still be separate strokes close
up. Nearly every surface carries some. Bare paper is kept for the
brightest highlights only.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A single small object, centred, three-quarter view, on a short ground
line, drawn at the scale of a jeweller's study - every knot, rivet,
scratch and repair legible. In daily use and carefully kept, never
ruined.

Its ONLY unusual quality: a flat violet spot colour (#6B4C7D) printed
out of register - offset about a millimetre from the black line,
bleeding past the object's edge like a misprint on a cheap press. The
black line itself is perfectly normal. No glow, no sparkle, no light
source, no particles.

Paper is warm oatmeal, never white. Ink is warm near-black, never pure
black. Strictly no gradients, no drop shadows, no soft shading. No text,
no letters.
```

## Negative prompt — for all six

```text
coffee ring, cup ring, water ring, tea stain, circular stain, ring
stain, watermark, blot, gradient, glow, bloom, lens flare, drop shadow,
soft shading, airbrush, blur, depth of field, neon, saturated colours,
pure white background, pure black, photorealistic, 3d render, octane,
unreal engine, digital painting, oil painting, concept art, anime, cel
shaded, sparkles, signature, text, letters, logo, UI, frame border,
woodcut, linocut, block print, flat vector, vector illustration, flat
colour fill, solid colour block, thick uniform outline, heavy black
outline, bold outline, infographic, diagram, icon, minimalist, clip art,
screen print, poster art, comic, cartoon, colouring book, menacing,
sinister, ominous, horror, gothic, demonic, hellish, glowing eyes,
burning eyes, snarling, bared fangs, blood-red sky, ruined castle, dead
trees, wasteland, hellscape, brimstone, epic, dramatic lighting, high
contrast, movie poster, book cover, card frame, card border, card
layout, trading card, game card, title bar, name banner, title banner,
stat block, stat icons, rules text box, flavour text, caption box,
panel, plate number, rounded corners, inset picture, picture window,
matte, mount, magic particles, glowing runes, light rays, multiple
objects, jewellery product photo
```

## talisman-tal-01 — Bone Charm

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-01.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A grandmother's charm: three carved knucklebones and a worn wooden bead
strung on a hide thong, the carving simple and sure - spirals and tally
nicks. The violet slip sits offset across the bones only.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## talisman-tal-02 — Weaver's Knot

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-02.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A palm-sized knot of tightly woven cord with no visible beginning or end,
the weave drawn strand by strand, ends vanishing impossibly into the
pattern. A simple loop for the neck. The violet slip is offset across the
knot's heart.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## talisman-tal-03 — Copper Amulet

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-03.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hammered copper disc on a copper chain, planished marks catching the light
as bare paper, a spiral chased into the face, the rim green with old
verdigris that the owner polishes and the years replace. The violet slip is
offset across the spiral.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## talisman-tal-04 — Gold Locket

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-04.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hinged gold locket, ajar: one side holds a tiny engraved portrait of
someone loved, the other side is empty and hatched strangely deep for so
shallow a case. Fine chain pooled beneath it. The violet slip is offset
across the empty half only.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## talisman-tal-05 — Gemfire Pendant

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-05.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A faceted cut stone held in a four-clawed copper mount on a braided cord,
the facets drawn as hard-edged planes of bare paper and hatch - and in the
centre facet, a small still shape like a held breath. The violet slip is
offset across the stone, bleeding past the claws.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## talisman-tal-06 — Crystal Phylactery

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/talisman-tal-06.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A raw mana crystal sealed inside a blown-glass vessel, the glass bound in a
cage of gold wire with a wax-sealed stopper, hung from a fine chain. Three
generations of careful solder repairs on the cage. The violet slip is offset
across the crystal and bleeds through the drawn glass wall - the one place
in the game the misprint escapes its object.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 371, on the 1024 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```
