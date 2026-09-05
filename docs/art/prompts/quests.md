# The quests — places with something unfinished in them (quest-millers-debt … quest-drowned-bell)

Eight plates, one per quest card (`data/quests.json`), in deck order. Six are
mini-quests and two are campaigns; the plate does not say which, and does not
try to draw three stages at once — a campaign gets the picture of **where it
starts**, because that is the only part a player is looking at when they take
the card.

A quest plate is a **threshold**. The events deck draws the aftermath — the
thing has happened, here is the wreckage. A quest draws the approach: the errand
is still to be run, and the picture is the invitation. So every one of these has
one plain unfinished thing in it, drawn precisely and set where the eye lands —
a hopper standing empty, a lantern hook with no lantern on it, a coppice rooted
up, a track going into the fen and not coming out. The rest of the page is the
ordinary place it sits in, at middle distance, from the road, in ordinary
weather.

Nobody is the subject. Any people are small, distant, at their own work and
facing away. No quest-giver, no pointing, no party of adventurers, no sunset.

A4 landscape, 3:2 — the card crops a wide band from the middle. How many pixels is not stated here: the marker under each heading carries the figure, derived from the card's safe area at the print scale `data/mint.json` declares, and a number typed into this file fails `node tools/build-prompts.mjs --check`.

The FRAMING band below is the house figure and not yet a measurement — this deck
has no built card to read a window off, so `tools/build-prompts.mjs` cannot heal
it. The first accepted plate builds the first card, and the run after that writes
the real WINDOW block into every section here.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated traveller's account.
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
grey-green, cold slate blue. Paper is warm aged oatmeal, never white.
Ink is warm near-black, never pure black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A wide landscape plate of ONE place with something UNFINISHED in it,
drawn at middle distance from the road - the approach to it, never the
arrival - with a low horizon in the bottom third and the ground running
out to both edges of the page. Where an event plate is the aftermath,
this is the threshold: the errand is still to be run and the picture is
the invitation. The unfinished thing is a plain object or a plain mark
on the ground, drawn precisely - a hopper standing empty, a lantern hook
with no lantern on it, a coppice rooted up, a track leading into the fen
- and it sits where the eye lands.

Any people are small, distant and at their own work; nobody is the
subject, nobody is heroic and nobody is looking out of the page.
Ordinary daylight and ordinary weather. The tone is a note in a
travelling ledger - here is the place, here is what is wanted - never an
adventure poster.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no signage, no map
lettering, no border rule.
```

## Negative prompt — for all eight

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
matte, mount, close-up portrait, face, facing the viewer, quest giver,
pointing figure, adventuring party, heroic pose, silhouetted hero,
sunset, sunburst, god rays, epic vista, castle on a hill, glowing
objective, waypoint marker, map, cartouche, compass rose, signage,
scroll, wax seal, magic particles, storyboard panels, multiple
vignettes, split scene
```

## quest-millers-debt — The Miller's Debt *(mini, QST-01)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-millers-debt.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A working watermill at the edge of a small town, seen from the road at middle
distance: wheel stopped, launder dry, the tail race running clear because
nothing is being ground. The mill door stands open and the hopper inside is
plainly empty - drawn so it reads as empty from across a table, a clean-swept
timber funnel with the light going all the way down it. Three sound sacks are
folded flat and stacked on the step, waiting for grain that has not come. A
tally board hangs by the door, blank. Low horizon in the bottom third, ordinary
overcast daylight.
Wash: warm ochre on the mill timber, dusty grey-green on the bank, cold slate
on the water, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The mill door, the empty hopper and the folded sacks well inside the middle 90%
of the page height; the full width survives the crop. The wheel, the race and
the far bank may run to the margins.
```

## quest-lanterns-for-coldwater — Lanterns for Coldwater *(mini, QST-02)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-lanterns-for-coldwater.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A small northern harbour in a long winter dusk, seen from the quay road at
middle distance. On the end of the mole stands an iron lantern post with its
glazing frame open and NOTHING IN IT - the hook bare, the frame empty, the
whole post drawn precisely and set where the eye lands. Below it the harbour
ice is broken in one dark ragged hole with a boat's mast butt still standing up
out of it at an angle. Two boats are hauled out on the hard, well kept, tarpaulins
lashed. A window or two lit far back in the village, small. Low horizon in the
bottom third.
Wash: cold slate blue on ice and water, warm ochre in the far windows, rust red
on the boat hulls, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty lantern frame, the post and the broken ice all well inside the middle
90% of the page height; the full width survives the crop. The mole, the hauled
boats and the village may run to the margins.
```

## quest-boar-of-bramblehold — The Boar of Bramblehold *(mini, QST-03)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-boar-of-bramblehold.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A worked hazel coppice at the edge of Bramblehold Wood, seen from the ride at
middle distance - and a wide swathe of it rooted up: stools torn out whole with
the soil still on them, cut rods scattered off their stacks, the ground turned
over in long troughs. The damage is fresh and the earth is dark. A woodcutter's
faggot bond and a billhook are left standing in a stack that was being tied
when the work stopped. Deep cloven slots in the mud lead away into the standing
coppice. The animal is not in the picture. Low horizon in the bottom third.
Wash: dusty grey-green on the coppice, warm ochre on the cut rods, rust red in
the turned soil, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The rooted-up ground, the torn stools and the abandoned stack well inside the
middle 90% of the page height; the full width survives the crop. The standing
coppice and the ride may run to the margins.
```

## quest-word-to-dry-wells — Word to Dry Wells *(mini, QST-04)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-word-to-dry-wells.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A desert post road going away from the viewer into dry country, seen at middle
distance from a way-station wall: a stone milepost, a dead thorn, wheel ruts
drifting over with sand, and the road losing itself in haze at the horizon.
In the near foreground, on the flat top of the milepost, lies a single folded
letter under a stone - drawn precisely, the wax seal on it unbroken and pressed
with a plain device, the paper crisp and new against everything else in the
picture, which is worn. Nobody has picked it up. Low horizon in the bottom
third, hard flat daylight.
Wash: warm ochre and pale sand throughout, cold slate in the far haze, rust red
on the wax, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The sealed letter, the milepost and the road running away all well inside the
middle 90% of the page height; the full width survives the crop. The sand, the
thorn and the horizon may run to the margins.
```

## quest-strangler-in-the-mire — The Strangler in the Mire *(mini, QST-05)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-strangler-in-the-mire.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

The head of a fen causeway on the edge of a village, seen from the last dry
ground at middle distance. The path is closed: a rough timber bar lashed across
it at waist height, new rope on old posts, and beyond the bar the causeway runs
two hundred paces into flat reed and standing water and stops being a path at
all. Peat is stacked half-cut on the near side with the cutting spades still in
the bank, left where the work was abandoned. Reflections in the water are drawn
flat and quiet; there is nothing in them. Low horizon in the bottom third,
still grey light.
Wash: dusty grey-green on the reed, cold slate on the standing water, rust red
on the cut peat, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The barred causeway head, the abandoned peat cutting and the path going into
the fen all well inside the middle 90% of the page height; the full width
survives the crop. The reed beds and the water may run to the margins.
```

## quest-draught-for-fens-end — A Draught for Fen's End *(mini, QST-06)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-draught-for-fens-end.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A village sickhouse of lime-washed stone, seen from the lane at middle distance
with the fen behind it: a low building, a stone porch, shutters propped, a
drying rail of clean folded sheets along the wall. Beside the porch stands a
plain medicine shelf brought outside to be scrubbed, and it is EMPTY - every
bottle stop and ring on it bare, one square of unfaded lime-wash on the wall
where a full shelf used to stand. A written list is pinned to the porch post,
drawn as a small pale rectangle with no legible lettering on it. Low horizon in
the bottom third, thin morning light and mist off the fen.
Wash: warm ochre on the lime-wash, dusty grey-green on the fen, cold slate in
the mist, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty medicine shelf, the porch and the pinned list all well inside the
middle 90% of the page height; the full width survives the crop. The sickhouse
roof, the drying sheets and the fen may run to the margins.
```

## quest-ironspine-road — The Ironspine Road *(campaign, QST-07)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-ironspine-road.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

The approach to a high mountain pass, seen from the last of the made road at
middle distance: two shoulders of grey rock with a saddle of snow-streaked
scree between them, and the road climbing to it as a cart track that gives out
into a footpath and then into nothing. In the near foreground a surveyor's
tripod stands set up and unattended on a levelled patch, its plumb bob hanging
still over a driven peg, and a coil of chain lies beside it - the survey begun
and not finished. Further up, a dark square of old tunnel mouth in the rock,
boarded across. Low horizon in the bottom third, cold clear light.
Wash: cold slate blue on the rock and snow, warm ochre on the road and the
tripod timber, rust red on the boarding, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The tripod, the peg, the road giving out and the boarded tunnel mouth all well
inside the middle 90% of the page height; the full width survives the crop. The
peaks and the scree may run to the margins.
```

## quest-drowned-bell — The Drowned Bell of Taleowick *(campaign, QST-08)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/quest-drowned-bell.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A small coastal village on a flat-calm bay at slack water, seen from the shore
road at middle distance. The chapel stands above the strand and its bell tower
is OPEN AND EMPTY - the headstock still in place across the opening with the
gudgeons in it and no bell hanging from them, drawn precisely and set where the
eye lands. On the water below, a line of channel withies leans out towards the
Splinter Isles, and one of them is snapped off short. A rowing boat is drawn up
on the shingle with a net and a grapnel folded into it. The bay is glassy and
gives back the sky. Low horizon in the bottom third, still evening light, no
sun in the picture.
Wash: cold slate blue on the bay, warm ochre on the chapel stone, dusty
grey-green on the headland, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty headstock in the tower opening, the chapel and the snapped withy all
well inside the middle 90% of the page height; the full width survives the crop.
The bay, the headland and the isles may run to the margins.
```
