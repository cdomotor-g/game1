# The campaign — the Odyssey, place by place (campaign-odyssey-twelve-ships … campaign-odyssey-laertes)

Twenty-two plates, one per card of the CAMPAIGN deck (`data/campaigns.json`),
in chapter order - which is the order the voyage happened, not the order the
poem tells it. A campaign plate is a **place at the moment before the
chapter**: the cave with the boulder beside it, the harbour with the ships
moored in it, the hall with the axes set in a row. The player is the one
arriving, so the picture is the approach, seen from the sea or from the road,
and never the event.

Every plate has one plain object that belongs to the chapter, drawn precisely
and set where the eye lands - an oxhide bag with a silver cord, a jar of wine,
an oar, a bow on a chair - and the rest is the ordinary place it sits in. No
god is drawn and no monster is drawn: the monsters have plates of their own in
`monsters.md`, and the cast in `characters.md`. A black ship with one square
sail and a row of oars is allowed, small; people are allowed small, distant and
at their own work, and a man's back is allowed where the brief says so. Bronze
Age Greek things where a thing is shown: olives, oxhide, wattle, thatch,
bronze, a rock-cut cistern - never a marble temple, a column, a statue, a toga
or a vase painting.

A4 landscape, 3:2 - the card crops a wide band from the middle. Render at 4000
px on the long side or better.

The FRAMING band below is the house figure and not yet a measurement - this
deck has no built card to read a window off, so `tools/build-prompts.mjs`
cannot heal it. The first accepted plate builds the first card, and the run
after that writes the real WINDOW block into every section here.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated edition of a voyage.
Drawn with a nib - a fine, springy, varied line, only a little heavier
round the outside of a form than within it, thinning and breaking where
the light catches an edge. Never a thick uniform outline.

All tone is hatching: short feathered strokes laid along the form and
crossed over one another in the darks, fine and dense enough to read as
continuous shadow at arm's length and still be separate strokes close
up. Nearly every surface carries some. Bare paper is kept for the
brightest highlights only.

Thin translucent watercolour is washed OVER the finished ink, so the
hatching reads through the colour everywhere: it tints the drawing, it
never fills it. The washes are uneven - a little darker where they pool
against an edge, stopping short of the line as often as they cross it.
Muted and desaturated throughout, warm ochre, rust red, dusty
grey-green, cold slate blue - and the sea a deeper wine-dark slate than
anywhere else in the box. Paper is warm aged oatmeal, never white. Ink
is warm near-black, never pure black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A wide landscape plate of ONE place at the moment BEFORE the chapter
happens, seen from the sea or from the road at middle distance - the
approach, never the event: the cave mouth with the boulder beside it and
the goats on the slope, the cliff-walled harbour with a narrow mouth,
the house in the clearing with the lions lying at the door, the hall
with the axes set in a row. A low horizon in the bottom third and the
ground or the water running out to both edges of the page. One plain
object that belongs to the chapter is drawn precisely and set where the
eye lands - an oxhide bag tied with a silver cord, a jar of wine, an oar
planted in a mound, a great bow on a peg - and the rest is the ordinary
place it sits in, in ordinary Aegean daylight.

A black ship with a single square sail and a row of oars is allowed,
small, arriving or beached; people are allowed small, distant, at their
own work, never the subject and never looking out of the page. No god is
drawn and no monster is drawn - the monsters have plates of their own in
the bestiary. Bronze Age Greek things where a thing is shown: an olive
tree, a rock-cut cistern, a thatched steading, an amphora, a wooden
threshold, a stone hearth; never a marble temple, a column or a statue.
The tone is a traveller's plate in a printed edition of the poem - here
is the place - never a poster and never a vase painting.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no signage, no map
lettering, no border rule.
```

## Negative prompt — for all twenty-two

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
matte, mount, close-up portrait, face, facing the viewer, hero, heroic
pose, silhouetted hero, god, goddess, monster, giant, battle scene,
sunset, sunburst, god rays, epic vista, greek vase painting,
black-figure, red-figure, marble temple, column, statue, toga, laurel
wreath, map, cartouche, compass rose, signage, scroll, wax seal, magic
particles, storyboard panels, multiple vignettes, split scene
```

## campaign-odyssey-twelve-ships — Twelve Ships from Troy *(book IX, CAM-01)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-twelve-ships.png`.

```text
[PREAMBLE]

A long shingle beach under a burnt city on a headland, thin smoke still going up
from it; twelve black ships drawn up in a row with their sterns to the sea, men
small and busy loading jars and bundles and rolled fleeces, oars stacked like
firewood, a bronze tripod in the sand where the eye lands. Wash: rust red
on the smoke-stained walls, cold slate on the sea, ochre on the shingle, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-cicones — The Cicones at Ismarus *(book IX, CAM-02)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-cicones.png`.

```text
[PREAMBLE]

A beach at first light below a sacked town on a slope, fires still burning
among the houses; on the sand the leavings of a feast - sheep carcases, jars,
a broken tripod - and twelve black ships drawn up beyond it. Set where the eye
lands, a row of twelve sealed wine jars on a litter, one of them opened, with a
wreath of laurel on the sand beside it. At the top edge of the slope, small,
a line of spearmen coming over the ridge. Wash: rust red on the fires, ochre
on the slope, cold slate on the sea, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-storm-off-malea — The Storm off Malea *(book IX, CAM-03)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-storm-off-malea.png`.

```text
[PREAMBLE]

A high rocky cape running out into a grey sea from the right of the page, the
open water to the left of it heaped into long slate swells under a low driving
sky; a single black ship far out, small, its sail split into three streaming
rags and the oars shipped. Rain drawn as hatching. Nothing on the cape but a
cairn of stones. Wash: cold slate everywhere on the sea and sky, ochre on the
rock, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-lotus-eaters — The Lotus-Eaters *(book IX, CAM-04)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-lotus-eaters.png`.

```text
[PREAMBLE]

A low sandy shore with a lagoon behind it, seen from the water at middle
distance; a few reed huts and a grove of squat flowering trees heavy with
yellow fruit. On the sand where the eye lands, three men sitting in the shade
with their backs against a tree, fruit in their hands, entirely at peace and
looking at nothing; beside them a dropped spear and a helmet full of sand.
Far left, small, a black ship with its bow on the beach. Wash: pale ochre on
the sand, dusty grey-green on the trees, cold slate on the lagoon, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-cyclops — The Cave of the Cyclops *(book IX, CAM-05)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-cyclops.png`.

```text
[PREAMBLE]

The mouth of a great cave in a hillside above a shore, framed by laurels, with
a flat stone the size of a cart leaning beside the opening and pens of wattle
full of lambs and kids across the front of it; racks of drying cheeses just
visible in the shadow inside, and a wooden pail. Where the eye lands, on the
threshold: a goatskin of wine and a stripped green olive stake as long as a
mast, one end sharpened. Down the slope, small, a black ship on the beach of a
wooded islet across a strait. No giant is drawn. Wash: dusty grey-green on the
hill and the laurels, ochre on the fleeces, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-bag-of-winds — Aeolus and the Bag of Winds *(book X, CAM-06)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-bag-of-winds.png`.

```text
[PREAMBLE]

A steep island rising out of the sea with a smooth wall of bronze running
round it, the sheen of the metal drawn as hatching and never as glow; a stone
stair going up to a gate and a hall roof above. Where the eye lands, on the
quay at the foot of the stair: a great oxhide bag, tied shut at the neck with
a bright silver cord, beside a black ship whose crew are small figures looking
at the bag. Wash: warm ochre on the bronze, cold slate on the sea, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-laestrygonians — The Laestrygonians *(book X, CAM-07)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-laestrygonians.png`.

```text
[PREAMBLE]

A harbour that is a deep basin walled on every side by sheer cliffs, seen
from above one of the cliffs, with a narrow mouth to the sea at the top of
the page; eleven black ships moored side by side on the still water below, so
small they read as beetles, and one more tied up outside the mouth on the
rocks. On the cliff top in the foreground, where the eye lands, a spring
running out of the rock into a stone basin with a girl's water jar standing
beside it. No giants are drawn. Wash: cold slate on the basin water, ochre
on the cliff faces, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-circe — Circe of Aeaea *(book X, CAM-08)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-circe.png`.

```text
[PREAMBLE]

A clearing in an oak wood with a house of dressed stone standing in it, smoke
going up from the roof; wolves and mountain lions lying about the doorway and
the yard, drawn calmly, like farm dogs. Where the eye lands, on the wide stone
threshold, a broad two-handled cup and beside it a small plant with a black
root and a milk-white flower, laid down as if just picked. A path comes in
from the bottom left. Wash: dusty grey-green on the oaks and the beasts, ochre
on the house, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-land-of-the-dead — The Land of the Dead *(book XI, CAM-09)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-land-of-the-dead.png`.

```text
[PREAMBLE]

A grey shore at the edge of the world under a sky with no sun in it, mist over
everything; a grove of tall black poplars and willows at the meeting of two
rivers, and a black ship beached in the shallows at the left. Where the eye
lands: a square pit a forearm deep cut in the turf, with the blood of a ram
and a black ewe drawn as a dark pool in it, the two carcases laid beside it,
and a sword driven into the ground at the pit's edge. No figures, no ghosts.
Wash: cold slate on everything, the palest ochre on the turf, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-sirens — The Sirens *(book XII, CAM-10)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-sirens.png`.

```text
[PREAMBLE]

A low green island with a flowering meadow running down to the water, seen
from a ship's deck passing at a cable's length; the meadow heaped with pale
bleached bones and scraps of dried skin among the flowers, drawn plainly. In
the foreground, where the eye lands: the foot of a mast with a man's back
bound to it by many turns of rope, seen from behind, and on the deck beside it
a wheel of yellow beeswax cut into with a knife. The rowers, small, bent to
their oars. No singers are drawn. Wash: pale ochre on the meadow and the wax,
cold slate on the water, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-scylla-and-charybdis — Scylla and Charybdis *(book XII, CAM-11)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-scylla-and-charybdis.png`.

```text
[PREAMBLE]

A narrow strait between two rocks seen from the sea at its mouth: on the left
a sheer cliff going up out of the frame with a dark cave mouth high in it; on
the right a lower rock with a great fig tree in full leaf leaning out over
the water, and under the tree the sea drawn down into a funnel of hatched
rings with black sand showing at its throat. Nothing lives in the picture. A
single oar floats between them where the eye lands. Wash: cold slate on the
water, deeper in the funnel, ochre on the rocks, grey-green on the fig, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-cattle-of-the-sun — The Cattle of the Sun *(book XII, CAM-12)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-cattle-of-the-sun.png`.

```text
[PREAMBLE]

A wide island pasture running down to a beach where a single black ship is
drawn up, under a sky of long driving cloud; broad-browed cattle grazing
across the whole middle distance, drawn well, with two tall women in long
dresses standing among them at their ease. Where the eye lands, in the
foreground: the ashes of a cooking fire on the sand with a spit still across
the stones and a hide pegged out beside it, and behind that a row of empty
provision jars lying on their sides. Wash: ochre on the pasture and the
cattle, cold slate on the sky and sea, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-calypso — Calypso's Island *(book V, VII, CAM-13)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-calypso.png`.

```text
[PREAMBLE]

The mouth of a cave in a green hillside hung with vines, among alders,
poplars and sweet-smelling cypresses, four springs running out of the rock in
channels through meadows of violet and parsley; sea-birds nesting in the trees.
Where the eye lands, on the shore below at the right, a man sitting alone on a
rock with his back to the cave and his face turned to the empty sea, drawn
small. A fire inside the cave mouth shown as smoke only. Wash: dusty grey-green
everywhere on the trees and meadow, cold slate on the sea, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-telemachy — The Telemachy *(book I-IV, CAM-14)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-telemachy.png`.

```text
[PREAMBLE]

The courtyard and open hall of a great house on a hill above a harbour, seen
from the gate: a long feast going on in the shadow of the hall, many men at
tables drawn small, servants carrying wine, a bard with a lyre; in the yard a
pile of slaughtered sheep and pigs and rows of empty jars. Where the eye
lands, in a high window above the hall, the frame of a tall loom with a length
of pale cloth on it. Beyond the wall, the harbour and one black ship being
readied. Wash: ochre on the walls, rust on the wine, cold slate on the
harbour, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-raft — The Raft and Poseidon's Storm *(book V, CAM-15)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-raft.png`.

```text
[PREAMBLE]

Open sea heaped into great slate swells under a black driving sky, rain drawn
as hatching, and no land anywhere; in the middle distance, small, a raft of
lashed logs with a broken mast, going to pieces, and a man's head and arm in
the water beside it. Where the eye lands, in the foreground on the crest of a
wave, a long pale veil of fine cloth floating, spread out on the water like a
sail. Wash: cold slate on everything, the veil left bare paper, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-phaeacians — Nausicaa and the Phaeacians *(book VI-VIII, XIII, CAM-16)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-phaeacians.png`.

```text
[PREAMBLE]

A river mouth on a wooded shore in the early morning, the linen of a great
household spread out on the shingle to dry in long white strips, a mule cart
with its tailboard down, and a group of girls, small, playing at ball on the
sand; where the eye lands, at the edge of the trees, two olive bushes grown
together with a heap of dead leaves under them, and one bare foot showing at
the edge of the heap. Beyond the trees, a harbour full of ships and a town
on a hill. Wash: pale ochre on the linen and the sand, grey-green on the
olives, cold slate on the water, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-swineherd — The Swineherd's Hut *(book XIII-XVI, CAM-17)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-swineherd.png`.

```text
[PREAMBLE]

A hill farm of wattle sties in a walled yard, oak trees behind, twelve pens
and many sows and their young, four dogs; a thatched hut with a fire going.
Where the eye lands, at the open gate: an old man in a goatskin cloak
holding out a bowl of pork and bread to a bent beggar in rags with a staff,
both drawn small and from the side so that no face shows. On the gatepost a
boar-spear. Far below, the sea. Wash: ochre on the thatch and the hide,
grey-green on the oaks, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-beggar-in-the-hall — A Beggar in his own Hall *(book XVII-XX, CAM-18)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-beggar-in-the-hall.png`.

```text
[PREAMBLE]

The gate of a great house, seen from the road: a dungheap of mule and cattle
manure piled against the wall for the fields, and lying on it, where the eye
lands, an old hunting dog, thin and full of ticks, lifting his head and
wagging his tail at someone off the left edge of the page. Through the gate,
the courtyard and the open hall with a feast going on, drawn small; a
footstool lying overturned on the threshold. Wash: ochre on the wall and the
heap, rust on the hall, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-the-bow — The Bow and the Axes *(book XXI, CAM-19)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-the-bow.png`.

```text
[PREAMBLE]

The inside of a great hall lit from the door at the left: a long trench cut in
the earth floor with twelve bronze axes set upright in it in a dead straight
row, their rings in line, and at the far end a stool. Where the eye lands, in
the near foreground, a great recurved bow lying across a chair with its
string beside it, and a quiver of arrows. Along the walls, small, men on
benches with cups, faces turned away. Wash: ochre on the floor and the bow,
rust on the benches, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-slaughter — The Slaughter of the Suitors *(book XXII, CAM-20)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-slaughter.png`.

```text
[PREAMBLE]

The threshold of a great hall seen from inside, the doors barred with a
ship's cable, morning light coming through the smoke-hole; the hall itself in
disorder - tables overturned as shields, spilled cups, bread trodden into the
floor - and empty, the moment before anyone moves. Where the eye lands, on the
raised threshold: a quiver of arrows tipped out onto the stone, and a bow. A
swallow perched on a roof beam. Nobody is drawn. Wash: rust on the wine and
the cloths, ochre on the floor, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-the-bed — The Bed of Olive-wood *(book XXIII, CAM-21)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-the-bed.png`.

```text
[PREAMBLE]

A bedroom built around a living olive tree: the trunk, thick as a pillar, rising
out of the stone floor and going up through the ceiling, with the frame of a
great bed built onto it, inlaid with silver and ivory, and an oxhide strung
across it; the walls close and whitewashed, a lamp on a stand. Where the eye
lands, on the bed, a folded cloak and a woman's shawl laid side by side. The
door open on a lit passage. Nobody is drawn. Wash: ochre on the wood and the
hide, grey-green on the leaves at the ceiling, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```

## campaign-odyssey-laertes — Laertes' Orchard and the Peace *(book XXIV, CAM-22)*

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/campaign-odyssey-laertes.png`.

```text
[PREAMBLE]

A terraced hill farm in strong morning light: rows of pear and apple trees,
fig trees, and long lines of staked vines running away over the terraces,
every row drawn distinctly. Where the eye lands, in the foreground, an old
man in a patched tunic and goatskin gloves bent over a mattock at the foot of
a young tree, face hidden by a cap, with a heap of dug earth beside him. On
the path at the left, small, a man walking up between the trees. Wash: ochre
on the terraces, grey-green on the trees and vines, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The named object where the eye lands, and the place it sits in, inside the
middle 90% of the page height; the full width survives the crop. Sky and
sea may run to the margins.
```
