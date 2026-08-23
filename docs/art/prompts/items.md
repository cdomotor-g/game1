# The items — object studies (item-leather-jerkin … item-crossbow)

Ten single-object studies, one per item card in the ITEMS deck — the armour
first, then the weapons — from `data/items.json`, in deck order. Talismans live
in the same file and are **not** in this deck: they are arcane subjects with
their own back, their own violet and their own brief in
[`talismans.md`](talismans.md).

An item here is a **made thing that is worn or carried**, and the deck rests on
one rule: **draw the thing, not the fight.** A sword drawn in a hand is a picture
of a swordsman; a sword laid on a bench with the grip worn shiny and a nick out
of the edge is a picture of the thing you are buying. There is a character deck
for people.

Everything in this deck is **second-hand and cared for**: kept oiled, kept
mended, and older than whoever owns it. Nothing is gleaming and nothing is
ruined. The wear is where a hand goes.

Render at 2000 px square or better, single subject, centred.

## These plates are generated today, and this brief is how that is undone

`data/components.json` gives the ITEMS deck `plateKind: "generated"`, so
`docs/art/renders/item-*.png` is drawn by
[`tools/draw-item.mjs`](../../../tools/draw-item.mjs) from the parts each item
carries in its own `plate` block. That is not a placeholder and it is not a
decision about this deck for ever — it is what an object study can be built from
where a face cannot.

**To have one of these drawn by hand instead: delete that item's `plate` block in
`data/items.json`.** The tool then has nothing to draw it from and will never
overwrite the plate; `node tools/mint-queue.mjs` puts the card back at DRAW; and
the prompt below is what the artist is handed. That is the whole switch, and it
is per card rather than per deck, so one hand-drawn sword can sit in a deck of
generated ones.

## Shared preamble — paste ahead of every prompt below

```text
Black ink line art on warm unbleached paper, in the style of a worn 1600s
armourer's pattern book: heavy uneven woodcut-style outlines, interior
shading built only from hand-drawn hatching and cross-hatching, over-inked
pooling where lines meet at sharp angles, bare paper for the lit surfaces.

Flat muted spot colour sits UNDER the black line like a mis-registered
letterpress run - solid areas of colour with no blending. Restricted palette:
warm ochre for timber and horn, rust red for leather and cord, cold slate
blue for iron and steel. Paper is warm oatmeal, never white. Ink is warm
near-black, never pure black.

A single item, centred, three-quarter view, laid on a bench or stood against
it with a short ground line, drawn at the scale of a pattern-book plate:
every rivet, seam, lashing, grain and repair legible. In daily use and
carefully kept - the grip worn where the hand goes, the edge honed narrow, a
strap replaced in mismatched leather - never new, never ruined. Bold readable
silhouette. The page is worn from the workshop: creases, a grimy corner,
faint foxing.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading,
no lens effects. No text, no letters, no dimension figures, no border rule.
```

## Negative prompt — for all ten

```text
gradient, glow, bloom, lens flare, drop shadow, soft shading, airbrush, blur,
depth of field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, octane, unreal engine, digital painting, oil
painting, concept art, anime, cel shaded, sparkles, magic, runes, watermark,
signature, text, letters, numbers, logo, UI, frame border, blueprint,
technical drawing, exploded diagram, callout lines, product photograph,
hands, arms, figure, wielder, mannequin, armour stand, battle, blood,
grimdark, ruined, rusted through, shattered
```

## The framing block

Every prompt below already carries it. It is repeated here because a new one
needs it too — see [`../09-framing-and-composition.md`](../09-framing-and-composition.md).

```text
FRAMING. Square plate, whole page drawn edge to edge.
The item occupies the middle horizontal third, centred left-to-right, with
every named part well inside the middle 84% of the page. Low ground line in
the bottom third, and the item sitting on it. Clear, quiet page above.
```

## item-leather-jerkin — Leather Jerkin *(armour, body, ITM-01)*

```text
[PREAMBLE]

A sleeveless jerkin cut from two thick hides, stood on a bench as if still on
a body: deep armholes, a laced chest closed with a hide thong criss-crossed
through punched eyelets, a broad waist belt with a plain iron buckle. The
skirt hangs to mid-thigh and flares. Waxed dark at the shoulders where rain
sits, paler where the belt rides. One shoulder seam restitched in newer
thread. Wash: rust red across the hide in broad flat panels, slate on the
buckle.

FRAMING. Square plate, whole page drawn edge to edge. The whole jerkin -
shoulders, lacing, belt, buckle and hem - inside the middle 84%. Low ground
line in the bottom third. Clear, quiet page above.
```

## item-helm — Helm *(armour, head, ITM-02)*

```text
[PREAMBLE]

A one-piece iron skull cap stood on a bench, seen slightly from the front: a
riveted brow band running right round it with six domed rivets showing, and a
straight nasal bar dropping from the band over where the face would be. The
crown is raised from a single sheet and carries the planishing marks. Two old
dents left in, unhammered. A leather lining strap just visible inside the
rim. Wash: cold slate blue on the iron, flat, rust red on the strap.

FRAMING. Square plate, whole page drawn edge to edge. Crown, brow band, every
rivet and the full length of the nasal inside the middle 84%. Low ground line
in the bottom third. Clear, quiet page above.
```

## item-shield — Shield *(armour, off-hand, ITM-03)*

```text
[PREAMBLE]

A round shield of butted planks, face on, stood on its edge: five or six
boards running vertically with the joints showing, an iron rim banded right
round the edge and nailed through, and a domed iron boss riveted over the
central hand-hole. The paint is gone; the boards are bare and grey with
weather. Four rivets in a square about the boss. A split in one board stopped
with an iron staple. Wash: warm ochre on the boards, cold slate blue on the
rim and boss, both flat.

FRAMING. Square plate, whole page drawn edge to edge. The whole disc - rim,
every board joint and the boss - inside the middle 84%. Low ground line in
the bottom third. Clear, quiet page above.
```

## item-chain-mail — Chain Mail *(armour, body, ITM-04)*

```text
[PREAMBLE]

A knee-length riveted mail hauberk hung on a bench so it stands like a body:
short sleeves to the elbow, a leather-bound collar, a leather belt at the
waist, and the hem split front and back for riding. The rings are drawn
individually where the eye lands - rows of interlocked rings, each closed
with a tiny rivet - and settle into even texture further out. It hangs heavy
and pools slightly where it meets the bench. A patch of newer, brighter rings
mended into one shoulder. Wash: cold slate blue across the mail, flat, rust
red on the collar and belt.

FRAMING. Square plate, whole page drawn edge to edge. Collar, both sleeves,
belt and the split hem inside the middle 84%. Low ground line in the bottom
third. Clear, quiet page above.
```

## item-plate-harness — Plate Harness *(armour, body, ITM-05)*

```text
[PREAMBLE]

A breastplate with its fauld, stood on a bench: a single raised centre ridge
running from throat to waist, a rolled edge at the arms and neck, a pauldron
strapped over each shoulder, and three overlapping fauld lames hanging below
the waist on sliding rivets. Buckled leather straps at the shoulders with the
tongues hanging. Polished to a soft grey, not a mirror. One lame carries an
old proof dent, hammered out and still visible. Wash: cold slate blue on the
steel, flat, rust red on the straps.

FRAMING. Square plate, whole page drawn edge to edge. Both pauldrons, the
full breastplate, every fauld lame and the hanging straps inside the middle
84%. Low ground line in the bottom third. Clear, quiet page above.
```

## item-sword — Sword *(weapon, hand, ITM-06)*

```text
[PREAMBLE]

An arming sword laid at an angle across a bench, hilt low and point up: a
straight double-edged blade with a shallow fuller running most of its length,
a plain straight quillon cross, a grip wound tight in leather cord, and a
disc pommel peened over the tang. The edge is honed narrow from years of
sharpening and the blade is slightly narrower at the middle for it. Two small
nicks near the tip, left. Wash: cold slate blue on the blade and fittings,
rust red on the grip wrap, both flat.

FRAMING. Square plate, whole page drawn edge to edge. Point, fuller, both
quillons, the whole grip and the pommel inside the middle 84%. Low ground
line in the bottom third with the pommel resting on it. Clear, quiet page
above.
```

## item-war-axe — War Axe *(weapon, hand, ITM-07)*

```text
[PREAMBLE]

A bearded war axe laid at an angle across a bench, head high: a light head
with a small square poll, a waisted neck, and a bit that flares out and
sweeps down into a long hanging beard, ground to a bright curved edge. The
haft is straight ash with the grain drawn, swelling to a knob at the butt,
and a leather binding wrapped just below the head where a hand chokes up. The
eye is wedged with a steel wedge, showing. Wash: cold slate blue on the head,
warm ochre on the haft, rust red on the binding, all flat.

FRAMING. Square plate, whole page drawn edge to edge. The whole head - poll,
neck, bit and beard - the binding and the full haft to the knob inside the
middle 84%. Low ground line in the bottom third with the knob resting on it.
Clear, quiet page above.
```

## item-war-hammer — War Hammer *(weapon, two-hand, ITM-08)*

```text
[PREAMBLE]

A two-handed war hammer laid at an angle across a bench, head high: a squat
steel head with a flat square hammer face on one cheek, its edges peened and
mushroomed from use, and a long drawn-out fluke tapering to a point on the
other. Two iron langets run down from the head along the haft and are riveted
through it, so the haft cannot be cut. The haft is straight ash, wound in
leather at the butt for the lower hand. Wash: cold slate blue on the head and
langets, warm ochre on the haft, rust red on the wrap, all flat.

FRAMING. Square plate, whole page drawn edge to edge. Face, fluke, both
langets and the full haft to the wrapped butt inside the middle 84%. Low
ground line in the bottom third with the butt resting on it. Clear, quiet
page above.
```

## item-bow — Bow *(weapon, two-hand, ITM-09)*

```text
[PREAMBLE]

A self bow cut from a single stave, strung and stood on one tip against a
bench: a smooth D of one piece of yew, thick at the grip and tapering evenly
to each end, with a shaped horn nock spliced onto each tip and the string
running straight between them. The grip is bound with waxed cord in tight
even turns. The belly shows the grain running the length of the stave, and
one old knot the bowyer worked around rather than through. Wash: warm ochre
on the stave, rust red on the cord binding, both flat.

FRAMING. Square plate, whole page drawn edge to edge. Both nocks, the full
sweep of the stave, the whole string and the corded grip inside the middle
84%. Low ground line in the bottom third with the lower tip on it. Clear,
quiet page above.
```

## item-crossbow — Crossbow *(weapon, two-hand, ITM-10)*

```text
[PREAMBLE]

A crossbow laid flat across a bench, seen from above and slightly to one
side: a heavy timber tiller running the length of the page with a shaped butt
at the near end, a steel prod lashed across the far end with waxed cord in
two broad bindings, and the string at rest between the prod's tips. A round
horn nut is set into the tiller behind the string with a long iron trigger
bar hanging below it. A groove runs the top of the tiller for the bolt. The
timber is dark with handling at the butt. Wash: warm ochre on the tiller,
cold slate blue on the prod and trigger, rust red on the lashings, all flat.

FRAMING. Square plate, whole page drawn edge to edge. Butt, the whole tiller,
both prod tips, both lashings, the string, the nut and the trigger inside the
middle 84%. Low ground line in the bottom third. Clear, quiet page above.
```
