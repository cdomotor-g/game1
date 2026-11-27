# The tasks — one small thing, a few paces off (task-read-the-old-stones … task-keep-your-word)

Twelve plates, one per task card (`data/tasks.json`), in deck order. A task is a
private promise a hero keeps face down beside their board, so its plate is not a
place to be reached, as a quest plate is. It is the one small thing the promise is
about, seen from a few paces: a face of cut letters, three jars on a plank, a
well kerb with a line scratched across it. Closer and lower than a quest, and with
the one detail that makes it a puzzle or a favour left plainly in view.

Nobody is the subject. A person, where there is one, is small, turned away and at
their own work. No face, no pointing, no hero.

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
watercolour washes: a plate from an illustrated traveller's notebook.
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

A wide landscape plate of ONE small thing a traveller has stopped to
look at, drawn close and low: eye level with the thing, at the distance
of a few paces, so it fills the middle of the page and the ground behind
it falls away softly into plain country. It is the object or the spot a
private promise is about - a face of cut letters, a stall of three jars,
a fork where the track divides - drawn precisely, with the one detail
that makes it a puzzle or a favour left plainly in view.

Nobody is the subject. If a person is in the picture they are small, at
their own work and facing away, and there is at most one. Draw only the
things named here, each on its own ground; anything not named - an extra
prop, tool, barrel, crate or piece of furniture - stays out of the
picture. Ordinary daylight, ordinary weather, the horizon in the top
third. The tone is a line in a private notebook - what was seen, and
what it was wanted for - never an adventure poster.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no signage, no map
lettering, no border rule.
```

## Negative prompt — for all twelve

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
vignettes, split scene, group of figures, crowd
```

## task-read-the-old-stones — Read the Old Stones *(task, TSK-01)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-read-the-old-stones.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A knee-high standing stone on a bare hilltop, seen from a few paces: one face cut with rows of small incised letters, and across the lower half of the same face a fresh scouring where something hard has been rubbed over them, the pale bruised stone showing through. A second, smaller stone lies behind it in the grass. Thin turf, a thorn bush bent by wind. High horizon, flat grey-white daylight.
Wash: dusty grey-green on the turf, cold slate on the stone, one thin note of rust red in the thorn, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The cut letters and the scoured patch inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-herbalists-question — The Herbalist's Question *(task, TSK-02)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-herbalists-question.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A trestle stall in a market row seen from across a few paces: three small clay jars in a line on a plank, lids off. Two hold dried leaves of different greens; the third holds a pale lump that is plainly chalk. A pair of scales and a bunch of drying stems hang from the awning pole. The stallholder is a small figure turned away, reaching for something under the cloth. High horizon, ordinary overcast daylight.
Wash: warm ochre on the plank and jars, dusty grey-green on the leaves, rust red on the awning, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The three jars and what is in each inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-three-countries — Three Countries *(task, TSK-03)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-three-countries.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A cartographer's folding table set up on a verge at the meeting of three kinds of ground, seen a few paces off: on the left a stretch of ploughland, in the middle rough heath, on the right the first trees of a wood, each drawn in a distinct hatch. On the table a half-finished sketch of the same three, a pen, a small square of weights holding the paper down. Nobody is at the table. High horizon, ordinary daylight.
Wash: ochre on the plough, dusty grey-green on the heath, rust red in the wood edge, slate on the shadows, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The table with its sketch and the three grounds beyond it inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-a-bed-in-every-inn — A Bed in Every Inn *(task, TSK-04)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-a-bed-in-every-inn.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

The front of a roadside inn seen from the road at a few paces: a low timber door standing open on a dark hall, a hanging sign-board blank on its bracket, and beside the door a wall-hook with a thick ledger on a cord, open, its page ruled in columns and almost entirely empty. A mounting block, a trough, a dog asleep in the doorway. High horizon, ordinary daylight.
Wash: warm ochre on the timber, rust red on the door, dusty grey-green on the grass, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The open ledger by the door inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-cross-the-sand — Cross the Sand *(task, TSK-05)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-cross-the-sand.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

The last green edge of a track where it runs out into bare dunes, seen from a few paces: a waymarker stump leaning at the join, a line of old footprints going out over the first ridge and filling with drift, and beyond it ridge after ridge to a pale horizon. A single dry water-gourd lies on its side at the foot of the stump. High horizon, hard flat daylight.
Wash: warm ochre on the sand, rust red on the stump, slate in the shadows of the dunes, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The stump, the gourd and the first footprints inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-talk-it-down — Talk It Down *(task, TSK-06)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-talk-it-down.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A wild animal of the country - a stone boar - standing in a gap in a hedge on a farm track a few paces off, head low, one forefoot raised, drawn at a wary distance as a naturalist draws it. On the ground between it and the viewer a dropped loaf of bread, broken, and a hat. The boar is looking at the loaf. High horizon, ordinary daylight.
Wash: dusty grey-green on the hedge, warm ochre on the loaf and the track, rust red on the boar's flank, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The boar, the loaf and the hat, close together inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-hold-the-road — Hold the Road *(task, TSK-07)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-hold-the-road.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A cart road where it enters a cutting between two banks, seen from the open end at middle distance: a carter's wagon abandoned on its side in the ruts with one wheel off, the load spilled and scattered, the horse gone. In the cutting beyond, partly hidden by the bank, the heavy flank and haunch of a large animal lying across the road. Cold flat light, a few birds. High horizon.
Wash: warm ochre on the wagon and ruts, slate on the cutting, rust red on the spilt load, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The wagon, the spilled load and the animal's flank inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-sober-counsel — Sober Counsel *(task, TSK-08)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-sober-counsel.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A village well with a low stone kerb in a lane, seen from a few paces: a rope and bucket on the left side, a second rope and bucket on the right, and across the middle of the kerb a line scratched in the stone with a nail. Two small groups of people stand facing each other each on its own side of the lane, small and turned half away. A magistrate's chair with a folded cloak on it waits under the eaves. High horizon, plain daylight.
Wash: slate on the stone, ochre on the thatch, dusty grey-green on the lane, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The well kerb with its scratched line, the two buckets and the chair inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-the-long-haul — The Long Haul *(task, TSK-09)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-the-long-haul.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A loaded pack-mule standing at a crossroads signpost seen a few paces off, its panniers corded and tied, a rope hanging from its halter to a post. The signpost has four bare arms with no writing. Behind it a long straight road runs to the horizon between low fields, and far along it a tiny cart is the only other thing. High horizon, early flat daylight.
Wash: warm ochre on the road and panniers, dusty grey-green on the fields, rust red on the cording, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The mule, the panniers and the empty signpost inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-a-round-for-the-house — A Round for the House *(task, TSK-10)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-a-round-for-the-house.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A long inn table seen from one end at a few paces: a row of empty wooden cups set out down the middle in a neat line, a full jug at the near end, a small heap of coins beside it. The benches either side are empty but pushed back as if just left; a hearth burns low in the background. No faces. High horizon replaced by the low rafters and a plain wall; ordinary lamplit-and-window light.
Wash: warm ochre on the timber, rust red on the jug and hearth, dusty grey-green on the wall, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The row of cups and the jug inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-the-hermits-riddle — The Hermit's Riddle *(task, TSK-11)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-the-hermits-riddle.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hermit's hut at the foot of a great tree in the deep wood, seen from a few paces: a low door of split boards, a bench in front of it with one stone cup and one empty place beside it, a path of stepping-stones leading in from the foreground. On the lintel, scratched into the wood, a plain spiral. Thick trunks go back into shadow. High horizon, dim green daylight.
Wash: dusty grey-green on the leaves and trunks, warm ochre on the boards, slate in the shadow, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The door with its spiral, the bench and the two places inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```

## task-keep-your-word — Keep Your Word *(task, TSK-12)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/task-keep-your-word.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A notched tally-stick driven upright into the ground beside a road, seen close at a few paces: the stick carries a row of cut notches, the last three cut fresh and pale, the others weathered. Beside it a wooden stake with a short length of knotted cord tied round it, and at the foot a small hourglass lying in the grass. A road running away behind. High horizon, ordinary daylight.
Wash: warm ochre on the wood, rust red on the cord, dusty grey-green on the grass, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The stick, the stake and the hourglass at its foot inside the middle 90% of the page height; the full width survives the crop.
The ground and the background may run to the margins.
```
