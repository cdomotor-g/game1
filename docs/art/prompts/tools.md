# The tools — object studies (tool-axe … tool-scythe)

Five single-object studies, one per card in the TOOLS deck (`data/tools.json`),
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
Black ink line art on warm unbleached paper, in the style of a worn 1600s
workshop inventory plate: heavy uneven woodcut-style outlines, interior
shading built only from hand-drawn hatching and cross-hatching, over-inked
pooling where lines meet at sharp angles, bare paper for the lit surfaces.

Flat muted spot colour sits UNDER the black line like a mis-registered
letterpress run - solid areas of colour with no blending. Restricted palette:
warm ochre for timber, cold slate blue for iron and steel, rust red for
leather and cord. Paper is warm oatmeal, never white. Ink is warm near-black,
never pure black.

A single tool, centred, three-quarter view, stood against a bench or laid on
one with a short ground line, drawn at the scale of an inventory plate: every
wedge, ferrule, rivet, grain line and repair legible. WORN BY USE and kept in
service - the haft polished dark where the hands go, the edge hollowed back
from years of sharpening, a split bound with wire rather than replaced. In
daily use, never new, never abandoned. Bold readable silhouette. The page is
worn from the workshop: creases, a grimy corner, faint foxing.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading,
no lens effects. No text, no letters, no dimension figures, no border rule.
```

## Negative prompt — for all five

```text
gradient, glow, bloom, lens flare, drop shadow, soft shading, airbrush, blur,
depth of field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, octane, unreal engine, digital painting, oil
painting, concept art, anime, cel shaded, sparkles, watermark, signature,
text, letters, numbers, logo, UI, frame border, blueprint, technical
drawing, exploded diagram, callout lines, product photograph, hands, arms,
figure, weapon, battle axe, fantasy weapon, ornate, engraved, jewelled,
brand new, chrome, ruined, rusted through, broken
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
middle 84%. Low ground line in the bottom third with the knob on it. Clear,
quiet page above.
```

## tool-saw — Saw *(edged, TOL-02)*

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
edge, both saw nuts and the whole handle inside the middle 84%. Low ground
line in the bottom third. Clear, quiet page above.
```

## tool-pick — Pick *(digging, TOL-03)*

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
the eye and wedge, and the full haft to the butt inside the middle 84%. Low
ground line in the bottom third with the butt on it. Clear, quiet page above.
```

## tool-hammer — Hammer *(smithing, TOL-04)*

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
eye and the full haft to the butt inside the middle 84%. Low ground line in
the bottom third with the butt on it. Clear, quiet page above.
```

## tool-scythe — Scythe *(edged, TOL-05)*

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
the middle 84%. Low ground line in the bottom third with the butt on it.
Clear, quiet page above.
```
