# The tools — object studies (tool-axe … tool-fishing-line)

Six single-object studies, one per card in the TOOLS deck (`data/tools.json`),
in deck order.

A tool is not a weapon and must not be drawn as one. The deck rests on one rule:
**a tool is worn out, and the drawing says by what.** An axe that has been
sharpened two hundred times has a bit hollowed back from the original line; a
pick has one point sharp and one blunted; a scythe's edge is peened thin and
wavy. That history *is* the subject, and it is the reason the card prints a wear
number. A tool drawn fresh from the forge is a picture of the wrong thing.

The same 1600s register as the rest of the game, but this is a **workshop
inventory plate** rather than an armourer's pattern book: the object as the
person who owns it would recognise it across a yard.

Render at 2000 px square or better, single subject, centred.

## These plates are generated today, and this brief is how that is undone

`data/components.json` gives the TOOLS deck `plateKind: "generated"`, so
`docs/art/renders/tool-*.png` is drawn by
[`tools/draw-item.mjs`](../../../tools/draw-item.mjs) from the parts each tool
carries in its own `plate` block.

**To have one of these drawn by hand instead: delete that tool's `plate` block in
`data/tools.json`.** The tool then has nothing to draw it from and will never
overwrite the plate; `node tools/mint-queue.mjs` puts the card back at DRAW; and
the prompt below is what the artist is handed. Per card, not per deck — see
[`items.md`](items.md), which says the same thing about the other half of this
collection.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated catalogue of working
tools. Drawn with a nib - a fine, springy, varied line, only a little
heavier round the outside of a form than within it, thinning and
breaking where the light catches an edge. Never a thick uniform outline.

All tone is hatching: short feathered strokes laid along the form and
crossed over one another in the darks, fine and dense enough to read as
continuous shadow at arm's length and still be separate strokes close
up. Nearly every surface carries some. Bare paper is kept for the
brightest highlights only.

Thin translucent watercolour is washed OVER the finished ink, so the
hatching reads through the colour everywhere: it tints the drawing, it
never fills it. The washes are uneven - a little darker where they pool
against an edge, stopping short of the line as often as they cross it.
Muted and desaturated throughout, warm ochre for timber, cold slate blue
for iron and steel, rust red for leather and cord. Paper is warm aged
oatmeal, never white. Ink is warm near-black, never pure black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A single tool, centred, three-quarter view, stood against a bench or
laid on one with a short ground line, drawn at the scale of an inventory
plate: every wedge, ferrule, rivet, grain line and repair legible. WORN
BY USE and kept in service - the haft polished dark where the hands go,
the edge hollowed back from years of sharpening, a split bound with wire
rather than replaced. In daily use, never new, never abandoned. The
silhouette reads clearly. The page is worn from the workshop: creases, a
grimy corner, faint foxing.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no dimension figures, no
border rule.
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
matte, mount, numbers, blueprint, technical drawing, exploded diagram,
callout lines, product photograph, hands, arms, figure, weapon, battle
axe, fantasy weapon, ornate, ornate engraving, jewelled, brand new,
chrome, ruined, rusted through, broken
```

## The framing block

Every prompt below already carries it. It is repeated here because a new one
needs it too — see [`../09-framing-and-composition.md`](../09-framing-and-composition.md).

```text
FRAMING. Square plate, whole page drawn edge to edge.
The tool occupies the middle horizontal third, centred left-to-right, with
every named part well inside the middle 84% of the page. Low ground line in
the bottom third, and the tool standing or lying on it. Clear, quiet page
above.
```

## tool-axe — Axe *(edged, TOL-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tool-axe.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A felling axe leant at an angle with its knob on the ground: a heavy head
with a small flat poll, a clearly waisted neck, and cheeks that flare out to
a broad bit ground to a long curved edge. The bit is visibly hollowed back
from years of sharpening - the curve no longer matches the original line and
a faint witness edge shows where it used to be. A steel wedge stands proud in
the eye. The haft is a single length of hickory with the grain running true,
gently curved, swelling to a knob at the butt, dark and polished where both
hands go. Wash: cold slate blue on the head, warm ochre on the haft, flat.

FRAMING. Square plate, whole page drawn edge to edge. Poll, neck, the whole
bit and its edge, the eye wedge and the full haft to the knob inside the
middle 99%. Low ground line in the bottom third with the knob on it. Clear,
quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## tool-saw — Saw *(edged, TOL-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tool-saw.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hand saw laid at an angle across a bench, handle low: a long steel plate
tapering from the heel to a narrow toe, its lower edge cut into raked teeth
set alternately left and right so the set is visible along the row. The back
edge carries two faint scratch lines from the plate maker. The handle is a
shaped hardwood tote with a closed grip cut for four fingers, riveted to the
plate with two brass-headed saw nuts, worn smooth and dark. The plate is
matte, not mirrored, with a shallow kink near the toe from being dropped.
Wash: cold slate blue on the plate, warm ochre on the tote, flat.

FRAMING. Square plate, whole page drawn edge to edge. Toe, the entire toothed
edge, both saw nuts and the whole handle inside the middle 99%. Low ground
line in the bottom third. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## tool-pick — Pick *(digging, TOL-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tool-pick.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A miner's pick leant at an angle with its butt on the ground: a long iron
head curving gently down at both ends, one end drawn to a sharp point and the
other blunted and mushroomed from striking, with the eye swelling in the
middle where the haft passes through and a steel wedge driven in above it.
The haft is straight ash, oval in section, polished dark for two hand-widths
below the head and again at the butt. Chalk dust in the grain. Wash: cold
slate blue on the head, warm ochre on the haft, flat.

FRAMING. Square plate, whole page drawn edge to edge. Both ends of the head,
the eye and wedge, and the full haft to the butt inside the middle 99%. Low
ground line in the bottom third with the butt on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## tool-hammer — Hammer *(smithing, TOL-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tool-hammer.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A smith's cross-pein hammer leant at an angle with its butt on the ground: a
blocky steel head with a flat round face on one cheek, its rim peened and
mushroomed and its centre worn slightly hollow, and a cross pein tapering to
a blunt chisel edge on the other. The eye is hour-glassed and wedged with
both a wooden and a steel wedge, both showing. The haft is short and straight
hickory, oval, scorched dark near the head from lying too close to the fire
and polished pale where the hand grips. Scale and hammer marks over the whole
head. Wash: cold slate blue on the head, warm ochre on the haft, flat.

FRAMING. Square plate, whole page drawn edge to edge. Face, pein, the wedged
eye and the full haft to the butt inside the middle 99%. Low ground line in
the bottom third with the butt on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## tool-scythe — Scythe *(edged, TOL-05)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tool-scythe.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A scythe stood on the butt of its snaith: a long slender blade curving out
and away from the head of the snaith, the tang bolted on with an iron ring
and collar, the edge peened thin and running in a fine wavy line the length
of the blade with the whetted band bright against the darker body. The snaith
is a single bent ash pole with a double curve, and two turned wooden nibs are
clamped to it at hand height, each on its own iron band, set for one
particular mower and never moved since. Wash: cold slate blue on the blade
and bands, warm ochre on the snaith and nibs, flat.

FRAMING. Square plate, whole page drawn edge to edge. The whole blade from
tang to point, the collar, both nibs and the full snaith to the butt inside
the middle 99%. Low ground line in the bottom third with the butt on it.
Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## tool-fishing-line — Fishing Line *(fishing, TOL-06)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tool-fishing-line.png`.

```text
[PREAMBLE]

A fishing rod and its tackle laid at an angle across a bench. The rod is a
slender thing tapering butt to tip, made in three spliced lengths, each join
bound round with waxed thread and the binding varnished darker than the wood
either side of it; four small wire line guides are whipped along it at
widening intervals, and the butt is a plain grip of banded cork worn into
shallow finger hollows. The rod does not lie quite straight - it has taken a
gentle permanent set from being stored strung, the way a rod that has been
used always has. Beside it lies a flat wooden winder wound with brown
horsehair line, a span of the line run out loose across the bench and ending
in one small barbed hook. A shallow horn box sits open beyond it holding a
dozen more hooks, a coil of spare line and two split lead shot. One hook is
parked in the cork grip where its owner pressed it. The whipping at the
middle join is frayed and furred, and one guide has plainly been rebound in a
paler thread than the other three. Wash: warm ochre on the rod, the cork and
the winder, cold slate blue on the hooks and the shot, rust red on the line
and the horn box, flat.

FRAMING. Square plate, whole page drawn edge to edge. The whole rod butt to
tip, all four line guides, the three whipped joins, the winder with its line,
the hook at the line's end and the open horn box inside the middle 99%. Low
ground line in the bottom third with the rod and the tackle lying along it.
Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 375, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```
