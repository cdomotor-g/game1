# The items — object studies (item-coil-of-rope … item-plate-harness)

Twenty single-object studies, one per card in the three decks that carry a made
thing: **ITEMS**, **WEAPONS** and **ARMOUR**. All three read from
`data/items.json` and all three name their plates `item-<id>`, which is why one
brief file serves them — they are one subject drawn by one hand, and only the
card back behind them differs. The sections below run in deck order and each
says which deck its card is dealt from.

Talismans live in the same data file and are **not** among them: they are arcane
subjects with their own back, their own violet and their own brief in
[`talismans.md`](talismans.md).

An item here is a **made thing that is worn or carried**, and the decks rest on
one rule: **draw the thing, not the fight.** A sword drawn in a hand is a picture
of a swordsman; a sword laid on a bench with the grip worn shiny and a nick out
of the edge is a picture of the thing you are buying. There is a character deck
for people.

Everything here is **second-hand and cared for**: kept oiled, kept mended, and
older than whoever owns it. Nothing is gleaming and nothing is ruined. The wear
is where a hand goes.

Render at 2000 px square or better, single subject, centred.

## Which of these are generated, and which are waiting on an artist

`data/components.json` gives all three decks `plateKind: "generated"`, so a card
that carries a `plate` block in `data/items.json` has its plate drawn by
[`tools/draw-item.mjs`](../../../tools/draw-item.mjs) from the parts in that
block. That is not a placeholder and it is not a decision about these decks for
ever — it is what an object study can be built from where a face cannot.

**A card with no `plate` block is drawn by hand.** The tool has nothing to draw
it from, so it can never overwrite what arrives, and `node tools/mint-queue.mjs`
carries the card to DRAW. Half of the twenty-one below are in that state today — the
nine ITEMS cards, and the dagger and the staff — and their prompts are what the
artist is handed.

**To move a generated one across, delete its `plate` block.** That is the whole
switch, and it is per card rather than per deck, so one hand-drawn sword can sit
in a deck of generated ones.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated catalogue of arms and
equipment. Drawn with a nib - a fine, springy, varied line, only a
little heavier round the outside of a form than within it, thinning and
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
Muted and desaturated throughout, warm ochre for timber and horn, rust
red for leather and cord, cold slate blue for iron and steel. Paper is
warm aged oatmeal, never white. Ink is warm near-black, never pure
black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A single item, centred, three-quarter view, laid on a bench or stood
against it with a short ground line, drawn at the scale of a
pattern-book plate: every rivet, seam, lashing, grain and repair
legible. In daily use and carefully kept - the grip worn where the hand
goes, the edge honed narrow, a strap replaced in mismatched leather -
never new, never ruined. The silhouette reads clearly. The page is worn
from the workshop: creases, a grimy corner, faint foxing.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no dimension figures, no
border rule.
```

The palette names three inks and every material is assigned one of them. Two
that the list does not spell out, settled the same way elsewhere in this
repository: **brass washes ochre**, and **glass washes cold slate blue**, with
bare paper kept for the surface that catches the light.

## Negative prompt — for all twenty-one

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
matte, mount, magic, runes, numbers, blueprint, technical drawing,
exploded diagram, callout lines, product photograph, lit flame, burning
wick, firelight, light rays, sparks, embers, hands, arms, figure,
wielder, mannequin, armour stand, coat hanger, clothes rail, battle,
blood, grimdark, ruined, rusted through, shattered
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

## item-coil-of-rope — Coil of Rope *(ITEMS deck · gear, carried, ITM-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-coil-of-rope.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A coil of hemp rope stood on edge against a bench like a wheel, its turns
lying flat against one another: three-strand rope laid up right-handed, the
twist of the strands drawn all the way round the coil so it can never read as
a smooth ring. Fifteen fathoms, so the coil is deep - eight or nine turns
thick. One end finishes in a spliced eye, the three strands tucked and
tapered where they re-enter the lay; the other is whipped with waxed twine in
tight turns and hangs down to the ground. A hand's length of the standing
part is furred and glazed where it has run over rock. Wash: rust red across
the rope, flat, the whipping twine left as bare paper.

FRAMING. Square plate, whole page drawn edge to edge. The whole coil, the
spliced eye, the whipped end and both hanging tails inside the middle 81%.
Low ground line in the bottom third with the coil standing on it. Clear,
quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-lantern — Lantern *(ITEMS deck · light, ITM-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-lantern.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hand lantern stood on a bench, out and cold: a square iron frame glazed on
four sides, one pane hinged as a door with a small turn-catch, a pierced
conical cap above it with a ring of punched vent holes, and a folding
carrying ring on top. Inside, a plain socket holds a candle stub burnt down
to a finger's height, its wick black and bent over, drawn clearly through the
glass. One pane is cracked corner to corner; another has been replaced with a
thin sheet of horn that does not match its neighbours. The inside of the cap
is sooted dark and the base carries a crust of old wax runs. Wash: cold slate
blue on the iron frame and the glazing, warm ochre on the horn pane, flat.

FRAMING. Square plate, whole page drawn edge to edge. The cap and its vent
holes, the carrying ring, all four panes, the door catch, the candle stub and
the waxed base inside the middle 81%. Low ground line in the bottom third
with the lantern standing on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-torch — Torch *(ITEMS deck · light, ITM-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-torch.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A single torch stood on its butt and leant against a bench, out and cold: a
riven stave a forearm and a half long with the grain running straight down
it, split at the head into four fingers held apart by a small driven wedge.
The split is packed with strips of coarse cloth soaked in pitch and bound
round with cord in tight crossed turns. The head is charred from one earlier
burning and the topmost cloth has gone crisp and curled, but the binding
below it is whole and the pitch beneath still thick. The butt is trimmed
square and worn pale where a hand grips it. Wash: warm ochre on the stave,
rust red on the cloth and the cord, flat, the charred head left in near-black
ink.

FRAMING. Square plate, whole page drawn edge to edge. The whole stave from
charred head to butt, the wedge, the packed cloth and every turn of the cord
inside the middle 81%. Low ground line in the bottom third with the butt
standing on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-grappling-hook — Grappling Hook *(ITEMS deck · gear, carried, ITM-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-grappling-hook.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A four-fluked grappling hook laid on a bench, resting on two flukes with the
other two standing up: four iron flukes forged out from one central shank,
each curved and tapering to a point, and a heavy welded ring at the butt of
the shank. Three flukes stand at the same angle; the fourth is sprung visibly
wider than its fellows and carries fresh hammer marks where somebody has
beaten it back and not quite succeeded. The points are bright and rounded off
from striking stone. A short tail of hemp rope is bent to the ring round a
grooved thimble and seized back on itself with waxed twine. Wash: cold slate
blue on the iron, rust red on the rope and the seizing, flat.

FRAMING. Square plate, whole page drawn edge to edge. All four flukes and
their points, the shank, the ring, the thimble and the seized rope tail
inside the middle 81%. Low ground line in the bottom third with the hook
lying on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-bag — Bag *(ITEMS deck · gear, belt, ITM-05)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-bag.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A small drawstring bag of coarse undyed cloth slumped on a bench, about as
tall as a hand: four straight seams running up its corners, the top hemmed
and pierced for a cord that gathers the neck into even pleats and finishes in
two hanging tails with a knot in each. A loop of the same cord hangs at the
back for a belt. It is not empty - it sits heavy and round-bottomed, and a
few coin edges press their shapes out through the weave. The cloth is thin
and shiny down one side where it has rubbed against a hip for years, and a
square patch is darned into the bottom corner in thread that never matched.
Wash: rust red on the cloth and the cord, flat, the darned patch left as bare
paper.

FRAMING. Square plate, whole page drawn edge to edge. The whole bag - all
four seams, the gathered neck, both cord tails, the belt loop and the darned
patch - inside the middle 81%. Low ground line in the bottom third with the
bag sitting on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-satchel — Satchel *(ITEMS deck · gear, back, ITM-06)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-satchel.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A leather satchel stood square on a bench with its long strap laid round it
in a loose loop: a boxy body with pleated gussets at both ends, a broad flap
falling two-thirds down the front, and two narrow straps from the flap
dropping into plain iron buckles on the body. The shoulder strap is one
length, buckled at each end to an iron D-ring at a gusset, and is worn pale
and thin along the stretch that crosses a shoulder. The leather is oiled dark
across the flap where rain sits and paler along the bottom edge where it has
been set down a thousand times. The buckle holes are stretched oval, and a
second row of them has been punched further along, roughly. Wash: rust red
across the leather, flat, cold slate blue on the buckles and the D-rings.

FRAMING. Square plate, whole page drawn edge to edge. The body, both gussets,
the flap, both buckled straps, both D-rings and the full loop of the shoulder
strap inside the middle 81%. Low ground line in the bottom third with the
satchel standing on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-travelling-cloak — Travelling Cloak *(ITEMS deck · clothing, back, ITM-07)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-travelling-cloak.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A heavy hooded travelling cloak hung over the end of a bench so that it falls
full length and keeps the shape of the shoulders that are not in it: a deep
pointed hood collapsed empty against the back, a broad shoulder cape falling
to the elbow, and below it the body of the cloak dropping in heavy vertical
folds to a hem that swings clear of the ground. It closes at the throat with
a leather strap through a horn toggle. The wool is coarse and its weave is
drawn where light crosses the folds. The shoulders and the crown of the hood
are faded paler than the rest by weather; the hem is darker, stiff with dried
mud, and has been turned up and restitched shorter along one side. Wash:
rust red across the wool and the throat strap, flat, warm ochre on the horn
toggle.

FRAMING. Square plate, whole page drawn edge to edge. The hood, the shoulder
cape, the throat strap and toggle, the full drop of the folds and the whole
hem inside the middle 81%. Low ground line in the bottom third with the hem
hanging above it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-binoculars — Binoculars *(ITEMS deck · gear, belt, ITM-08)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-binoculars.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A pair of binocular glasses laid on a bench, seen from a little above and to
one side: two brass tubes of equal length lying side by side and joined at
the eyepiece end by a hinged bridge with a small knurled screw at its pivot,
so the eyepieces can be set nearer or further apart. Each tube is a plain
cylinder stepped down once near the eye, with the objective lens seated in a
rolled rim at the far end and the eyepiece in a short collar at the near one.
Both tubes are bound about their middles in one wrapping of leather, stitched
closed along a straight seam and worn dark and smooth where the fingers
close. A twisted cord is knotted through a small lug on the bridge. The brass
is bright at the edges of the leather and dulled elsewhere, and one objective
rim carries a shallow dent. Wash: warm ochre on the brass, rust red on the
leather and the cord, cold slate blue on the lens glass, flat.

FRAMING. Square plate, whole page drawn edge to edge. Both tubes end to end,
both objective rims, both eyepiece collars, the hinged bridge and its screw,
the leather binding and the knotted cord inside the middle 81%. Low ground
line in the bottom third with the glasses lying on it. Clear, quiet page
above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-quiver — Quiver of Arrows *(ITEMS deck · gear, belt, ITM-09)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/item-quiver.png`.

```text
[PREAMBLE]

A quiver of arrows stood upright against the end of a bench, seen from a
little above and to one side: a tapering cylinder of stiffened hide about two
hands deep, narrower at the base than the mouth, its one seam closed up the
side with a coarse cross-stitch of waxed thread. The mouth is finished with a
rolled rim of the same hide and the base is capped with a hardwood disc let
in flush and pegged. A narrow belt strap rises from two riveted lugs set high
on one side. Standing in it is a loose sheaf of eight or nine arrows, plainly
not a full quiver: straight pale shafts, each fletched with three low trimmed
feathers bound at both ends with fine thread, the nocks cut square, and the
sheaf leaning a little apart at the top rather than standing as one bundle.
Two broadheads show among the fletchings above the rim and one of them is
bent out of line. The hide is scuffed and worn pale down the face that rides
against the hip, and rubbed dark and smooth around the mouth where a hand
reaches in without looking. Wash: rust red on the hide, the strap and the
binding thread, warm ochre on the shafts and the base cap, cold slate blue on
the two visible heads, flat.

FRAMING. Square plate, whole page drawn edge to edge. The whole body of the
quiver from rim to base cap, the stitched seam, both riveted lugs and the
strap, and the full standing sheaf of arrows to the tips of the fletchings
inside the middle 81%. Low ground line in the bottom third with the base of
the quiver on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-sword — Sword *(WEAPONS deck · weapon, hand, WPN-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-sword.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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
quillons, the whole grip and the pommel inside the middle 81%. Low ground
line in the bottom third with the pommel resting on it. Clear, quiet page
above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-war-axe — War Axe *(WEAPONS deck · weapon, hand, WPN-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-war-axe.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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
middle 81%. Low ground line in the bottom third with the knob resting on it.
Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-war-hammer — War Hammer *(WEAPONS deck · weapon, two-hand, WPN-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-war-hammer.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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
langets and the full haft to the wrapped butt inside the middle 81%. Low
ground line in the bottom third with the butt resting on it. Clear, quiet
page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-bow — Bow *(WEAPONS deck · weapon, two-hand, WPN-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-bow.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-crossbow — Crossbow *(WEAPONS deck · weapon, two-hand, WPN-05)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-crossbow.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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
middle 81%. Low ground line in the bottom third. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-dagger — Dagger *(WEAPONS deck · weapon, hand, WPN-06)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-dagger.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A plain single-edged dagger laid at a steep angle across a bench, point up
and grip low: a straight blade a hand and a half long with a flat back, a
short shallow fuller run along it below the back, and a long single edge
honed so often that the blade is visibly narrower at its middle than at
either end. A simple iron cross of two short bars, a grip of two wooden
scales riveted through the tang with three iron rivets and worn round and
dark, and a small flattened pommel peened over the end of the tang. The last
two inches before the point are polished bright by everyday work while the
rest of the blade is a dull grey. One small nick out of the edge near the
cross, left. Wash: cold slate blue on the blade and the fittings, warm ochre
on the wooden scales, flat.

FRAMING. Square plate, whole page drawn edge to edge. Point, edge, fuller,
both arms of the cross, all three rivets, the whole grip and the pommel
inside the middle 81%. Low ground line in the bottom third with the pommel
resting on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-staff — Staff *(WEAPONS deck · weapon, two-hand, WPN-07)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-staff.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A plain ash quarterstaff stood on its shoe and leant across a bench so that
it runs corner to corner up the page: one straight length of ash, shoulder
high on whoever carries it, of even thickness the whole way with only the
faintest taper, the grain running true down it and drawn line by line. An
iron shoe is fitted over the lower end and riveted through twice, its rim
spread and mushroomed from being planted. The upper end is bare, rounded off
and finely split with age, and bound below the split with a few turns of
waxed cord. Two bands a shoulder's width apart are worn pale and polished
where two hands have gripped for years; the stave between and beyond them is
darker and dulled. One old knot is planed flush and shows as a closed eye in
the grain. Wash: warm ochre on the ash, cold slate blue on the iron shoe,
rust red on the cord, flat.

FRAMING. Square plate, whole page drawn edge to edge. The full length of the
stave from the shoe to the bound top, both shoe rivets, both worn grip bands
and the planed knot inside the middle 81%. Low ground line in the bottom
third with the shoe standing on it. Clear, quiet page above.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 81% of its height - everything that matters
must sit between 9% and 91% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 379.5 x 309, on the 1024 x 1024 page this deck is drawn at. It is
not a rule of thumb.)
```

## item-leather-jerkin — Leather Jerkin *(ARMOUR deck · armour, body, ARM-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-leather-jerkin.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. The card cut from this plate keeps very nearly the whole page, so
the FRAMING band above is the only constraint. (Worked out from this deck's
card window, 379.5 x 380, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## item-helm — Helm *(ARMOUR deck · armour, head, ARM-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-helm.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. The card cut from this plate keeps very nearly the whole page, so
the FRAMING band above is the only constraint. (Worked out from this deck's
card window, 379.5 x 380, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## item-shield — Shield *(ARMOUR deck · armour, off-hand, ARM-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-shield.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. The card cut from this plate keeps very nearly the whole page, so
the FRAMING band above is the only constraint. (Worked out from this deck's
card window, 379.5 x 380, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## item-chain-mail — Chain Mail *(ARMOUR deck · armour, body, ARM-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-chain-mail.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. The card cut from this plate keeps very nearly the whole page, so
the FRAMING band above is the only constraint. (Worked out from this deck's
card window, 379.5 x 380, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## item-plate-harness — Plate Harness *(ARMOUR deck · armour, body, ARM-05)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/item-plate-harness.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

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

WINDOW. The card cut from this plate keeps very nearly the whole page, so
the FRAMING band above is the only constraint. (Worked out from this deck's
card window, 379.5 x 380, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```
