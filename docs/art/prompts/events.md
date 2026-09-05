# The events — the year's weather (event-hard-frost … event-frame-breakers)

Fifty-two plates, one per event card (`data/events.json`), in deck order. This
is the biggest deck in the game and the one most easily got wrong, so the rule
is short and it is absolute:

**An event plate is the aftermath, told through objects.** The thing has already
happened; the picture is what it left behind. An overturned cart and grain in the
wheel ruts, not a frightened carter. A shuttered stall and a swept trestle, not a
haggling crowd. A stock pen standing open with the hurdle down, not a wolf. If
you find yourself drawing the moment of the event, you are drawing the wrong
plate — back up an hour and draw what a traveller coming along the road would
actually see.

**No faces.** Any people in these are small, distant, incidental, facing away and
busy with the clearing up. Nobody is the subject, nobody looks out of the page,
and nobody is heroic. The tone is the weather report, not the disaster painting.

One clear silhouette dominates and has to read at a glance across a table;
everything else is the ground it happened on. Low horizon in the bottom third,
ordinary daylight, ordinary weather unless the card IS the weather.

**The five arcane cards do not get the violet.** `event-ley-surge`,
`event-curdled-brew`, `event-wandering-wizard`, `event-blood-moon` and
`event-ley-drought` are drawn dead straight like the other forty-six, because the
out-of-register violet belongs to the arcane *subject* decks — the talismans and
the spells — and a deck has to deal as one deck. An arcane event is still a thing
that happened in the world, and it is told the same way everything here is told:
by what it left on the ground.

A4 landscape, 3:2 — the card crops a wide band from the middle. How many pixels is not stated here: the marker under each heading carries the figure, derived from the card's safe area at the print scale `data/mint.json` declares, and a number typed into this file fails `node tools/build-prompts.mjs --check`.

The FRAMING band and the WINDOW block below are both measurements now, written by
`tools/build-prompts.mjs` off the deck's own built card window. That was the plan
and this is the run it happened on: nineteen plates had landed and nobody had put
the tool over the file since, so every section here still carried the house figure
of 90%. The real one is 99%, because an event card's window is very nearly the
whole page. Never hand-edit either line — change the card and run the tool.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated chronicle of the year.
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

A wide landscape plate of ONE thing that has already happened, drawn at
middle distance from a standing person's eye height, with a low horizon
in the bottom third and the ground running out to both edges of the
page. It is told through OBJECTS AND CONSEQUENCE, never through a face:
an overturned cart and grain in the wheel ruts, not a frightened carter;
a shuttered stall and a swept-clean trestle, not a haggling crowd. Any
people are small, distant, incidental and busy with the clearing up -
nobody is the subject and nobody is looking out of the page.

One clear silhouette dominates and reads at a glance across a table;
everything else is the ground it happened on. The tone is dry, plain and
after-the-fact - the weather report, not the disaster painting.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no signage, no border
rule.
```

## Negative prompt — for all fifty-one

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
matte, mount, close-up portrait, face, facing the viewer, crowd scene,
battle scene, action shot, melodrama, screaming, corpses, gore, burning
village, apocalyptic, heroic, explosion, shockwave, magic particles,
signage, banners, flags with devices, storyboard panels, multiple
vignettes, split scene
```

## event-hard-frost — Hard Frost *(weather, EVT-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-hard-frost.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A ploughed field stopped mid-work in a hard freeze: the plough standing in the
furrow with the share bitten into ground that has gone iron, the traces dropped
and left. Frost stands white on every turned clod and along the hedge. The
cabbage rows in the next land are blackened and slumped. A wooden water butt by
the field gate has burst, its hoops sprung and a plug of ice standing proud of
the staves. Low horizon in the bottom third, flat colourless daylight.
Wash: cold slate blue over everything, one thin note of rust red on the plough
irons, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The plough, the frozen furrow and the burst butt inside the middle 99% of the
page height; the full width survives the crop. The hedge and the far fields may
run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-drought — Drought *(weather, EVT-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-drought.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A village well with its winch chain run right out to the last link and the
bucket lying on its side on cracked mud at the bottom of the shaft, drawn so
you can see straight down to it. Around it the pasture is baked to pale stubble
and cracked in a net of open seams. A stone sheep trough stands dry and
scoured. A wooden sluice gate is shut on a stream bed with nothing in it but
white stones. Low horizon in the bottom third, hard flat daylight.
Wash: warm ochre and bleached straw throughout, one cold slate note on the
chain, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The well head, the dry shaft and the cracked ground inside the middle 99% of
the page height; the full width survives the crop. The pasture and the sluice
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-long-summer — Long Summer *(weather, EVT-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-long-summer.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A harvest running weeks past its usual end: stooks standing in ranks across a
stubble field with long low shadows, and beyond them a second crop already
green and a hand's height up. A barn is stacked over the eaves, hay pressed out
between the timbers. A wagon stands loaded higher than its own sides and roped
down twice. Apples are heaped in an orchard on sacking with more still on the
trees. Low horizon in the bottom third, warm late light with no sun in the
picture.
Wash: warm ochre on the stubble and stooks, dusty grey-green on the second
crop, rust red on the wagon, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The near stooks, the loaded wagon and the overfull barn inside the middle 99%
of the page height; the full width survives the crop. The orchard and the far
fields may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-storms — Storms at Sea *(weather, EVT-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-storms.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A harbour shut down: every boat double-moored with lines crossed to both sides
of the quay, masts struck down on deck, sails off the yards and lashed in
bundles ashore. The sea wall is taking green water and throwing it clean over,
the spray drawn as hatched sheets. At the near end of the quay a cargo net lies
spread with the crates already stacked back off it, and one mooring bollard
stands with no line on it at all - the berth of a ship that has not come in.
Low horizon in the bottom third.
Wash: cold slate blue on sea and sky, rust red on the hulls, warm ochre on the
quay stone, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty bollard, the moored boats and the sea wall inside the middle 99% of
the page height; the full width survives the crop. The breaking water and the
outer harbour may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-flood — Flood *(disaster, EVT-05)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-flood.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A river out over its floodplain, drawn from a road embankment at middle
distance. A hedge line shows as a running row of tops out of flat brown water.
A five-bar gate stands half under with the current stacking rubbish against it.
A haystack is islanded on its own staddle stones with the water at the thatch.
A cart is in to the axles at the edge of the road with its load lifted onto the
rail. On a barn wall behind, three old silt marks and one new one higher than
all of them. Low horizon in the bottom third.
Wash: warm ochre-brown on the water, dusty grey-green on the hedge tops, cold
slate on the sky, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The gate, the stranded cart and the silt marks on the barn inside the middle
90% of the page height; the full width survives the crop. The flooded ground
and the hedge line may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-earthquake — Earthquake *(disaster, EVT-06)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-earthquake.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hillside after the ground has moved: a dry-stone wall thrown down along a
long snaking length, the stones lying in a spilled line to one side and the
sound wall carrying on either end of it. The road across the slope has a clean
step in it a foot high, the metalling broken along the line. A cottage chimney
stack has gone through its own roof, slates fanned down the pitch. Low on the
slope a new spring is running out of turf that has split, cutting its first
channel through dry grass. Low horizon in the bottom third.
Wash: dusty grey-green on the turf, cold slate on the stone, rust red on the
roof tiles, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The fallen wall, the step in the road and the new spring inside the middle 99%
of the page height; the full width survives the crop. The hillside and the
cottage may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-wildfire — Wildfire *(disaster, EVT-07)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-wildfire.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

Burnt timber country the morning after: standing black trunks stripped of
everything, ash lying ankle deep and printed with the tracks of everyone who
walked out through it, thin smoke still going up in threads from stump holes.
The fire has stopped dead along a stream, and the far bank is untouched and
green - the line between them hard. A stack of cut boards is burnt through at
one end and sound at the other. Leather fire buckets lie where they were
dropped. Low horizon in the bottom third.
Wash: warm ochre and grey ash throughout, one band of dusty grey-green across
the far bank, rust red in the stump holes, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The burnt stack, the fire line at the stream and the near trunks inside the
middle 99% of the page height; the full width survives the crop. The standing
trunks and the far bank may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-mine-collapse — Mine Collapse *(disaster, EVT-08)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-mine-collapse.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

An adit mouth with its timbering burst outwards, headtree and legs snapped and
splayed, and a fan of broken spoil run out across the path in front of it. The
tram rails going in are buckled and stand bent up clear of their sleepers. A
winding drum on the bank has its rope run slack and heaped. A row of miners'
lamps is set out on a flat rock outside, counted and left. Nobody is in the
picture. Low horizon in the bottom third.
Wash: cold slate blue on the rock and rails, warm ochre on the timber, rust red
on the spoil, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The burst timbering, the buckled rails and the row of lamps inside the middle
90% of the page height; the full width survives the crop. The spoil bank and
the hillside may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-warehouse-heist — Warehouse Heist *(crime, EVT-09)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-warehouse-heist.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A dockside warehouse opened in the night: the door hasp cut clean through and
the staple hanging, one leaf of the door standing wide. Inside, the floor is
bare except for the clean rectangles in the dust where the stacks stood, and
one split sack has spilled its grain across the threshold. A hand truck lies on
its side. Fresh cart tracks turn out of the doorway and go away along the quay,
loaded deep. Low horizon in the bottom third, grey early light.
Wash: warm ochre on the timber, cold slate on the quay, rust red on the cut
hasp, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The cut hasp, the open door and the pallet marks in the dust inside the middle
90% of the page height; the full width survives the crop. The quay and the
tracks may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-caravan-robbery — Caravan Robbery *(crime, EVT-10)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-caravan-robbery.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A road through scrub with a caravan stopped on it and stripped: harness cut
through at the traces and left hanging, crates prised open and their straw
packing blowing along the verge in a long tail, a wagon down on one side with
the wheel off and leaning against it. A scatter of goods too heavy to carry -
millstones, a coil of chain - left in the road. Boot prints and hoof prints
lead off into the scrub. Low horizon in the bottom third.
Wash: warm ochre on the road and straw, rust red on the wagon, dusty grey-green
on the scrub, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The broken crates, the cut harness and the leaning wagon inside the middle 99%
of the page height; the full width survives the crop. The straw tail and the
scrub may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-train-heist — Train Heist *(crime, EVT-11)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-train-heist.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A goods train standing still in a shallow railway cutting. One van has its
sliding door run right back on its track and the inside is empty but for
dunnage and a broken seal wire hanging from the hasp. A ladder is left leaning
against the van side. The coupling chain of the van behind lies uncoupled on
the ballast. Cart tracks come down the cutting side on a made path of laid
sleepers and go away over the top. The locomotive stands cold at the head. Low
horizon in the bottom third.
Wash: cold slate blue on the ironwork, rust red on the van, warm ochre on the
ballast and cutting, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The open van door, the empty interior and the leaning ladder inside the middle
90% of the page height; the full width survives the crop. The locomotive, the
cutting and the track may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-piracy — Piracy *(crime, EVT-12)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-piracy.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A merchant hull run up into shallow water off a low shore and left there,
listing, her yards braced round anyhow and both boats gone from the davits.
Cargo bales float in a slow trail from her side towards the beach, and two are
already grounded in the wash. Far out on the horizon, hull down and small, one
low fast sail going away. Nothing on the ship moves. Low horizon in the bottom
third.
Wash: cold slate blue on the sea, rust red on the hull, warm ochre on the
bales, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The grounded hull, the floating bales and the distant sail inside the middle
90% of the page height; the full width survives the crop. The sea and the shore
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-smuggling-ring — Smuggling Ring *(crime, EVT-13)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-smuggling-ring.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A shingle beach at the foot of a sunken lane, before dawn: kegs and oilcloth
bales stacked in a neat run above the tide line, a boat's keel mark dragged up
the shingle and a second one going back down. A shuttered lantern stands on a
rock with only a slit of light out of it. Cart tracks climb the lane between
high banks and are lost. There is no customs post, no barrier and nobody in
sight - the whole point of the place. Low horizon in the bottom third.
Wash: cold slate blue over everything, one warm ochre note at the lantern slit,
rust red on the kegs, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The stacked kegs, the keel marks and the shuttered lantern inside the middle
90% of the page height; the full width survives the crop. The lane, the banks
and the sea may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-wolf-pack — Wolf Pack *(wildlife, EVT-14)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-wolf-pack.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A hurdle sheepfold on open winter ground with one hurdle down flat and the
wattle of the next one broken through at the bottom. Fleece is caught in the
split hazel. The fold is empty; the flock's trodden ground stops at the gap.
Beyond it, a line of paw prints goes away across unbroken snow in a single file
so straight it reads as one animal, and drag marks run beside it. A shepherd's
crook is stood in the ground with a lantern hung on it, still burning. No
animal is in the picture. Low horizon in the bottom third.
Wash: cold slate blue on the snow, warm ochre on the hurdles and the lantern,
flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The broken hurdle, the caught fleece and the line of prints inside the middle
90% of the page height; the full width survives the crop. The snow field and
the crook may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-boar-in-the-fields — Boar in the Fields *(wildlife, EVT-15)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-boar-in-the-fields.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A standing barley field with wide troughs ploughed clean through it at ground
level, running in loops and doubling back on themselves - the ears trampled
flat and the roots turned up in ridges either side. A hurdle in the field
boundary is smashed out of its posts. Deep cloven slots are printed in soft
ground where a drinking place has been churned to mud. A scarecrow leans over
at a bad angle with its crossbar snapped. No animal is in the picture. Low
horizon in the bottom third.
Wash: warm ochre on the barley, rust red in the turned soil, dusty grey-green
on the hedge, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The troughs through the crop, the broken hurdle and the cloven slots inside the
middle 99% of the page height; the full width survives the crop. The standing
barley and the hedge may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-dragon-sighting — Dragon Sighting *(wildlife, EVT-16)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-dragon-sighting.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A mountain road at midday, completely empty. A hand cart stands abandoned in
the middle of it with its load still roped on and one shaft dropped in the
dust. The wayside inn has every shutter barred and its door shut with a bench
dragged across. Stock has been driven off the road into a rock cleft and
crowded there. Across the whole scene lies one enormous soft-edged band of
shadow, drawn as hatching alone, running from one edge of the page to the
other. Whatever casts it is not in the picture and is not to be drawn. Low
horizon in the bottom third.
Wash: warm ochre on the road, cold slate blue in the shadow band and the rock,
flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The abandoned cart, the barred inn and the shadow band inside the middle 99% of
the page height; the full width survives the crop. The mountains and the road
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-raiders — Raiders *(conflict, EVT-17)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-raiders.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A steading after an armed band has been through it: the yard gate off both
hinges and lying flat, the stock pens standing open and empty, the mud
churned by many hooves in one direction. A stack of cut timber has been pulled
half apart across the entrance - a barricade begun far too late. A spear stands
driven into the ground by the gatepost, left. The house is sound and its door
is open. Nothing is burning. Low horizon in the bottom third.
Wash: warm ochre on the timber, rust red on the churned mud, cold slate on the
ironwork, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The flattened gate, the half-built barricade and the standing spear inside the
middle 99% of the page height; the full width survives the crop. The steading
and the pens may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-border-dispute — Border Dispute *(conflict, EVT-18)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/event-border-dispute.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A good hay meadow with two boundary marks standing in it a hundred paces apart
and both of them new: a squared stone with one freshly cut face, and a driven
oak post with an iron plate nailed to it, the nail heads bright. Between the
two the hay is trampled into a broad path and two sets of cart ruts come in
from opposite ends of the field and stop short of each other. The old hedge
line runs somewhere else entirely. Low horizon in the bottom third.
Wash: dusty grey-green on the meadow, warm ochre on the post, cold slate on the
stone and the iron, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
Both boundary marks, the trampled path and the two sets of ruts inside the
middle 99% of the page height; the full width survives the crop. The meadow and
the old hedge may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-mercenaries-for-hire — Mercenaries for Hire *(conflict, EVT-19)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-mercenaries-for-hire.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hired company camped on common ground outside a town wall: rows of low
billets in straight lines, spears stacked in tripods down the length of the
camp, cooking fires in dug pits, a horse line with the picket rope run between
two posts. Kit is laid out on groundsheets in front of each billet in the same
order every time. The camp is orderly, well kept and plainly for sale. Any
figures are small, distant and at their own work. Low horizon in the bottom
third.
Wash: warm ochre on the canvas, rust red on the leather and blankets, cold
slate on the spear heads, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The stacked spears, the laid-out kit and the billet lines inside the middle 99%
of the page height; the full width survives the crop. The horse line and the
town wall may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-plague — Plague *(social, EVT-20)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-plague.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A town gate shut in daylight with clean straw laid thick across the road in
front of it and a rope strung waist high a few paces out. On the door of the
nearest house a painted cross is drawn in one stroke each way - a mark, not
lettering. Inside the gate the market square stands with its trestles up and
completely bare, and a laden barrow left in the middle of it with the goods
still on. Every shutter on the square is closed. Low horizon in the bottom
third.
Wash: warm ochre on the straw and stone, rust red on the painted cross, cold
slate in the shadow, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The strawed road, the shut gate and the abandoned barrow inside the middle 99%
of the page height; the full width survives the crop. The square and the roofs
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-migrants — Migrants *(social, EVT-21)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-migrants.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A long column on a road, seen from well behind and above so that not one face
is visible: hand carts and barrows loaded with bedding, cook pots and tools,
bundles roped up and carried, a goat led on a string, a ladder and a door
carried between two people. The column goes away from the viewer into the
distance and does not end within the page. The road is a good one and the
country either side is empty. Nothing is on fire and nobody is running. Low
horizon in the bottom third.
Wash: warm ochre and rust red on the bundles and blankets, dusty grey-green on
the verges, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The near carts, the loaded bundles and the run of the column inside the middle
90% of the page height; the full width survives the crop. The road and the
country may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-strike — Strike *(social, EVT-22)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-strike.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A works yard at a dead standstill in the middle of a working day: the furnace
cold with its door open and grey ash raked out onto the floor, barrows tipped
up on their noses in a row, and every tool in the place laid down in one
straight line right across the gateway - hammers, shovels, tongs, set out
deliberately and evenly, so it reads as a decision and not as a mess. A
cooking pot hangs over a dead fire with nothing in it. Low horizon in the
bottom third.
Wash: cold slate blue on the iron, warm ochre on the yard timber, rust red on
the cold furnace brick, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The line of laid-down tools, the gateway and the cold furnace mouth inside the
middle 99% of the page height; the full width survives the crop. The yard, the
barrows and the roofs may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-festival — Festival *(social, EVT-23)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-festival.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A town square in the middle of a festival week, seen from the steps at the top
of it: trestles down both sides loaded with food and goods, bunting lines of
plain cut cloth strung between the upper windows, a carcase turning on a spit
over embers, lanterns hung on poles at intervals. The ground is trodden to bare
earth and littered with straw and spilled ale. The crowd is a distant hatched
mass at the far end, small; nobody near the front of the page. Low horizon in
the bottom third.
Wash: warm ochre on the lanterns and timber, rust red on the bunting and awning
stripes, dusty grey-green on the far trees, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The near trestles, the spit and the strung lanterns inside the middle 99% of
the page height; the full width survives the crop. The crowd, the bunting and
the roofs may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-master-craftsman — Travelling Master *(social, EVT-24)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-master-craftsman.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A travelling craftsman's wagon opened out at the edge of a market into a
working shop: the whole side let down on chains into a bench, a tool rack
behind it with every tool in its own shaped place and none missing, a treadle
lathe rigged off the axle, a half-turned piece still in the chuck with its
shavings under it. On the near side of the bench a plain stool is set out for
somebody, and it is empty. The work on the bench is finer than anything else in
the market. Low horizon in the bottom third.
Wash: warm ochre on the wagon timber, cold slate on the tools, rust red on the
canvas tilt, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The let-down bench, the full tool rack and the empty stool inside the middle
90% of the page height; the full width survives the crop. The wagon, the tilt
and the market may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-iron-shortage — Iron Shortage *(market, EVT-25)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-iron-shortage.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A blacksmith's yard with the stock rack bare to its pegs - a long rack built to
hold bar and rod, and nothing on it but two short offcuts. What scrap there is
has been swept into one small heap and picked over: broken shoes, bent nails, a
cracked ploughshare. The forge is lit and drawing well, the fire bright, tongs
to hand, and there is nothing at all to put in it. The order board by the door
is a plain scored slate with tally cuts, no lettering. Low horizon in the
bottom third.
Wash: cold slate blue on the iron and the rack, warm ochre on the yard, rust
red at the forge mouth, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty stock rack, the picked-over scrap heap and the lit forge inside the
middle 99% of the page height; the full width survives the crop. The yard and
the roof may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-glut — Glut *(market, EVT-26)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-glut.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A quayside with far more on it than the sheds will hold: sacks stacked six high
in blocks right out to the edge of the water, tarpaulins roped over stacks
standing in the open because there is nowhere else, and a barge still unloading
onto a quay that is already full. The shed doors are open and packed to the
lintel. One stack has been left long enough for the bottom course to have gone
soft and slumped. Low horizon in the bottom third.
Wash: warm ochre on the sacking, cold slate on the water and the shed roofs,
rust red on the barge, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The near stacks, the packed shed door and the unloading barge inside the middle
90% of the page height; the full width survives the crop. The quay, the water
and the tarpaulins may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-foreign-demand — Foreign Demand *(market, EVT-27)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-foreign-demand.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A deep-sea ship of unfamiliar build moored at a small country quay - too big
for the berth, rigged differently from every other hull in the picture, her
boats already down and pulled in to the steps. On the quay a space has been
swept clear and roped off for a cargo that has not been chosen yet, and a rank
of empty measuring baskets and a set of beam scales stand ready at the edge of
it. The local boats are pushed along to the far end to make room. Low horizon
in the bottom third.
Wash: cold slate blue on the water and the strange hull, warm ochre on the quay
and baskets, rust red on the local boats, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The swept and roped space, the empty baskets and the strange hull inside the
middle 99% of the page height; the full width survives the crop. The quay, the
rigging and the far boats may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-tax-levy — Tax Levy *(market, EVT-28)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-tax-levy.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A road gate turned into a collecting post: a trestle table set square across
the carriageway, an iron-bound strongbox chained to its leg, a second chest
with a hasp and two locks on the ground behind, and a rope on posts running out
either side so nothing can go round. Beam scales and a set of standard weights
stand on the table with a ledger and an inkwell. Carts are backed up along the
road behind, halted and roped, going out of the page. Low horizon in the bottom
third.
Wash: warm ochre on the road and table, cold slate on the ironwork and locks,
rust red on the waiting carts, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The table, the strongbox and the roped-off gate inside the middle 99% of the
page height; the full width survives the crop. The queue of carts and the
verges may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-ley-surge — Ley Surge *(arcane, EVT-29)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-ley-surge.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

An open stretch of moor where every loose iron thing has stood itself on end
and stayed there. A harrow is up on one corner, balanced. A length of chain
stands straight out of the heather like a rod. Nails driven in a fallen plank
have drawn themselves half out and point the same way. A cart tyre leans on
nothing. The heather, the stones and the sky are all completely ordinary and
completely still - there is no wind, no light and nothing to see but iron
behaving wrongly. Drawn dead straight, with no violet and no glow of any kind.
Low horizon in the bottom third.
Wash: dusty grey-green on the heather, cold slate blue on the iron, warm ochre
on the plank, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The standing harrow, the upright chain and the drawn nails inside the middle
90% of the page height; the full width survives the crop. The moor and the sky
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-curdled-brew — Curdled Brew *(arcane, EVT-30)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-curdled-brew.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A stillroom bench the morning after something went wrong: a copper alembic
cracked clean across the neck, its head lifted off and set down beside it, and
the contents crawled out over the bench edge and set hard in one glossy
tongue that has stopped halfway to the floor. The rest of the glassware has
been shoved back out of the way in a hurry. The slate underneath is scorched in
an irregular patch. A shutter has been propped wide open to clear the air.
Drawn dead straight, with no violet and no glow of any kind. Low horizon in the
bottom third.
Wash: rust red on the copper, cold slate on the stone and glass, warm ochre on
the bench timber, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The cracked alembic, the set tongue of spillage and the scorched slate inside
the middle 99% of the page height; the full width survives the crop. The bench,
the glassware and the shutter may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-wandering-wizard — Wandering Wizard *(arcane, EVT-31)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-wandering-wizard.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A small tidy camp in the lee of a hedge on a road nobody much uses: a low fire
banked properly, a travelling pack propped open, and a square of clean cloth
laid out on the ground with a row of small objects set on it in a deliberate
order - a folding lens, a set of jeweller's scales, three sealed phials, a
cased needle, a stone with a hole through it. One folding stool stands on the
near side of the cloth and it is empty. Everything is worn, mended and well
looked after. Drawn dead straight, with no violet and no glow of any kind. Low
horizon in the bottom third.
Wash: warm ochre on the cloth and pack, cold slate on the instruments, dusty
grey-green on the hedge, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The laid-out cloth, the row of objects and the empty stool inside the middle
90% of the page height; the full width survives the crop. The hedge, the fire
and the road may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-camp-fever — Camp Fever *(social, EVT-32)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-camp-fever.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A travelling party's camp beside a slow brown stream, struck in a hurry and not
properly: bedrolls left open where they were slept in, a cooking pot upset with
its contents gone into the grass, a water skin lying half in the stream mouth
where it was filled from water with a green scum on it. The fire is dead and
not raked. One pack has been repacked and roped and the rest have not. Cattle
have plainly been standing in the stream just upstream of the camp. Low horizon
in the bottom third.
Wash: dusty grey-green on the scum and the grass, warm ochre on the bedrolls,
cold slate on the water, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The upset pot, the open bedrolls and the water skin at the stream inside the
middle 99% of the page height; the full width survives the crop. The stream,
the bank and the cattle ground may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-marsh-ague — Marsh Ague *(social, EVT-33)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-marsh-ague.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A fen-edge village at last light with mist lying flat at knee height along
every lane, thick enough that the bottom of every wall and gatepost is lost in
it and the tops are sharp. Every shutter in the village is closed and the doors
are shut. A bell rope hangs down out of the open belfry of a small church and
sways a little. Two barrows and a cart stand where they were left in the lane,
loaded. Smoke goes straight up from three chimneys and nowhere else. Low
horizon in the bottom third.
Wash: cold slate blue in the mist, warm ochre on the walls and thatch, dusty
grey-green on the fen behind, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The bell rope, the shuttered fronts and the abandoned barrows inside the middle
90% of the page height; the full width survives the crop. The mist, the fen and
the roofs may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-grey-pox — The Grey Pox *(social, EVT-34)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-grey-pox.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A town market square at full midday and completely empty. Every stall is
shuttered and every trestle is stacked and roped against a wall. The ground has
been swept clean, which is the wrong thing for a market square to be. One
laden cart stands abandoned dead in the middle of the open ground with its load
still roped down and its shafts on the cobbles. Every window on the square is
closed. The town's water conduit runs on into its trough with nobody at it. Low
horizon in the bottom third, hard flat light.
Wash: warm ochre on the stone, cold slate on the shutters and the water, one
rust red note on the cart, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The abandoned cart, the stacked trestles and the running conduit inside the
middle 99% of the page height; the full width survives the crop. The square,
the shuttered fronts and the roofs may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-impure-smelt — Impure Smelt *(industry, EVT-35)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-impure-smelt.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A foundry floor with the week's work rejected on it: sand moulds broken open
and the castings lifted out and snapped clean across, the fracture faces drawn
flat, dull and slate-grey like broken stone rather than bright like broken
metal. A stack of bars is set aside, several of them cracked through where they
lie. On the bench sits the lump of flux stone that did it, split to show a bad
grey seam running through the middle of it. The furnace is drawn down and cold.
Low horizon in the bottom third.
Wash: cold slate blue on the metal and the fractures, warm ochre on the moulding
sand, rust red on the furnace brick, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The snapped castings, the fracture faces and the split flux stone inside the
middle 99% of the page height; the full width survives the crop. The moulds,
the bar stack and the furnace may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-blood-moon — Blood Moon *(arcane, EVT-36)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-blood-moon.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A night hillside at moonrise, drawn plainly and without any drama at all: the
moon low, small and rust-coloured just clear of the horizon line, with no rays
and no halo. Stock has been crowded into the corner of a walled field and the
gate is shut and staked with two hurdles lashed over it. Tracks of several
different animals cross a road in the near ground, all going the same way and
none of them stopping. A byre door is barred on the outside with a plank. No
creature is in the picture. Drawn dead straight, with no violet and no glow of
any kind. Low horizon in the bottom third.
Wash: cold slate blue over the whole night, one rust red note low in the sky,
warm ochre on the byre timber, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The barred byre, the staked gate and the crossing tracks inside the middle 99%
of the page height; the full width survives the crop. The moon, the hillside
and the walls may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-quiet-season — The Quiet Season *(wildlife, EVT-37)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-quiet-season.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hunters' camp at the edge of woodland with nothing whatever hanging in it:
the drying racks bare to the poles, a hide-stretching frame standing empty with
its lacing slack, snares coiled and hung up on a nail in a bunch rather than
set out. A dog's dish sits full and untouched. Fresh snow lies over the ground
and carries one set of human tracks coming in from the trees and none going
out, and no animal tracks at all anywhere in the picture. The woodland behind
is completely still. Low horizon in the bottom third.
Wash: cold slate blue on the snow, warm ochre on the racks and frames, dusty
grey-green on the trees, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty racks, the slack stretching frame and the single line of tracks
inside the middle 99% of the page height; the full width survives the crop. The
snow, the camp and the treeline may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-black-sails — Black Sails on the Horizon *(crime, EVT-38)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-black-sails.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A river mouth turned into a refuge: a dozen merchant hulls anchored close
together well inside the bar with their sails furled and harbour gaskets on,
and a boom of chained spars run right across the entrance behind them, made
fast to a capstan on each shore. Nothing is loading. Out beyond the bar, three
low hulls stand along under sail in line, small and hull-down, carrying no
colours at all on bare staffs. Low horizon in the bottom third.
Wash: cold slate blue on the sea and sky, rust red on the merchant hulls, warm
ochre on the boom spars, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The chained boom, the anchored merchantmen and the three distant hulls inside
the middle 99% of the page height; the full width survives the crop. The
shores, the capstans and the open sea may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-letter-of-marque — Letter of Marque *(crime, EVT-39)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-letter-of-marque.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A fast merchant hull at a naval quay being armed in daylight and in the open:
four gun ports newly cut in her side with the fresh sawn edges pale against the
weathered planking and the sawdust still lying on the deck below them, a gun
swinging aboard in a sling off sheerlegs, powder barrels ranked on the quay
under a wetted cloth. A plain table stands at the foot of the gangway with a
strongbox and a seal press on it and nothing else. Low horizon in the bottom
third.
Wash: rust red on the hull, cold slate blue on the guns and water, warm ochre
on the fresh-cut timber, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The newly cut gun ports, the gun in its sling and the table with the seal press
inside the middle 99% of the page height; the full width survives the crop. The
quay, the rigging and the barrels may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-press-gang — Press Gang *(crime, EVT-40)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-press-gang.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A harbour lane at first light after a bad night: a tavern door hanging off its
top hinge, stools and one whole table out in the street where they were pushed,
a broken jug in the gutter with the wine dried dark around it, a cap and one
shoe left in the mud a few yards apart. The lane's other doors are shut fast. A
ship's boat, low in the water and crowded, is pulling out into the harbour in
the far distance, small enough that nobody in it is readable. Low horizon in
the bottom third.
Wash: cold slate blue over the early light, warm ochre on the tavern timber,
rust red on the spilled wine, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The broken door, the furniture in the street and the dropped shoe inside the
middle 99% of the page height; the full width survives the crop. The lane, the
harbour and the boat may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-dragons-tithe — The Dragon's Tithe *(conflict, EVT-41)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-dragons-tithe.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A tribute stand on open high ground: a low dry-stone platform built for the
purpose, with this year's goods stacked on one end of it - barrels, bales, a
bound chest - and the other two thirds of the platform swept, empty and plainly
meant to be full. Pressed into the turf beside it is one enormous three-clawed
footprint, deep enough that water has gathered in it, and nothing else in the
picture is disturbed at all. The road up to the stand is well used. No creature
is in the picture. Low horizon in the bottom third.
Wash: cold slate blue on the stone, warm ochre on the barrels and turf, rust
red on the bales, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The short-stacked platform, the empty two thirds and the clawed print inside
the middle 99% of the page height; the full width survives the crop. The high
ground and the road may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-aerial-post — The Aerial Post *(industry, EVT-42)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-aerial-post.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hilltop mooring mast standing ready on bare open ground: a lattice timber
tower with an iron mooring cone at the top, guy wires pegged out in six
directions and freshly tensioned, a windsock of plain cloth streaming from a
side arm. At the foot of it a handcart of locked mail chests waits under a
roped tarpaulin with the corner turned back, and a set of steps is wheeled into
position. Nothing is moored to the mast and there is nothing in the sky. Low
horizon in the bottom third.
Wash: warm ochre on the timber tower, cold slate blue on the ironwork and sky,
rust red on the mail chests, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The mooring cone, the mast head and the waiting mail cart inside the middle 99%
of the page height; the full width survives the crop. The guy wires, the hill
and the sky may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-gale — Gale *(weather, EVT-43)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-gale.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

Open country under a wind that has been blowing one way for days: a shelter
belt of trees permanently bent over and stripped bare down one side, hurdles
cartwheeled off their line and jammed in a ditch, a thatched roof opened along
one whole side of its ridge with the straw drawn out in a long streaming tail.
A hay wagon lies on its side across the road with the load gone. Every loose
thing in the picture leans, streams or lies down the same way. Low horizon in
the bottom third.
Wash: dusty grey-green on the trees, warm ochre on the flying straw, cold slate
on the sky, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The opened roof, the streaming thatch and the overturned wagon inside the
middle 99% of the page height; the full width survives the crop. The shelter
belt, the ditch and the sky may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-early-thaw — Early Thaw *(weather, EVT-44)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-early-thaw.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A river breaking up weeks too soon: plates of ice tilted and stacked against a
bridge pier in a jam, brown water pushing through the gaps, and the whole
surface downstream a broken mosaic moving away. On the bank a sledge road ends
in slush, its runner marks running straight down to the water's edge and
stopping; a fresh horse track turns off it and goes the long way round through
mud. A hay sledge is left on the ice at a bad angle. Low horizon in the bottom
third.
Wash: cold slate blue on the ice, warm ochre-brown on the flood water, rust red
on the sledge, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The ice jam at the pier, the runner marks ending at the water and the stranded
sledge inside the middle 99% of the page height; the full width survives the
crop. The river, the bridge and the banks may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-clipped-coin — Clipped Coin *(market, EVT-45)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-clipped-coin.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A money-changer's table standing open on a market day with nobody at it: a set
of beam scales rigged and level, a small heap of coin tipped out beside them
with every piece visibly out of true - flats filed on the edges, one clipped so
far the device runs off the rim. A touchstone with streak marks on it lies to
one side. A pair of shears and a fine file have been swept off the table into
an open box underneath, in a hurry. The stalls either side are trading
normally. Low horizon in the bottom third.
Wash: warm ochre on the coin, cold slate blue on the shears and scales, rust
red on the table cloth, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The clipped coin, the scales and the shears in the box inside the middle 99% of
the page height; the full width survives the crop. The table, the box and the
market may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-guild-embargo — Guild Embargo *(market, EVT-46)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-guild-embargo.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A workshop shut from the outside: two rough battens nailed across its door in a
cross, driven home hard and splitting the frame, and a guild mark burnt into
the timber beside them - a simple branded device, a mark and not lettering.
Through the window the shop is plainly intact and full, benches loaded with
finished work. A delivery of stock stands on the step where it was left,
unopened and rained on, with the carter's tally stick pushed under the cord.
Low horizon in the bottom third.
Wash: warm ochre on the door timber, cold slate on the nails and window, rust
red on the burnt mark, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The battened door, the branded mark and the refused delivery inside the middle
90% of the page height; the full width survives the crop. The shopfront, the
window and the street may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-new-tolls — New Tolls *(social, EVT-47)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-new-tolls.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A brand new toll gate planted across an old good road: the posts fresh sawn and
pale, the rope across still white and unfrayed, a small hut of new boards with
a plank shelf out of its window carrying a ledger and a locked box. Beside all
of it the road's own milestones are grey with lichen and the road surface is
long-settled and well made - it was paid for by somebody else. Carts are halted
back along it. Low horizon in the bottom third.
Wash: warm ochre on the new timber, cold slate blue on the old road stone, rust
red on the waiting carts, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The new posts, the rope across the road and the ledger shelf inside the middle
90% of the page height; the full width survives the crop. The road, the
milestone and the halted carts may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-green-man — The Sign of the Green Man *(social, EVT-48)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-green-man.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A roadside inn on a plainly good road, seen from the road at middle distance:
walls sound, chimneys sound, the road itself well made and busy-looking - and
everything else going quietly to pieces. The thatch is sagging into a hollow
over one end, a shutter is off and stood against the wall, and grass has grown
up through the cobbles of the yard where wheels should be keeping it down. The
sign bracket over the door is empty but for a blank weathered board hanging by
one hook, with no device and no lettering on it at all. A stack of barrels by
the door has one broken stave. Low horizon in the bottom third.
Wash: warm ochre on the thatch and walls, dusty grey-green on the yard grass,
rust red on the barrels, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The empty sign bracket, the sagging thatch and the grassed-over yard inside the
middle 99% of the page height; the full width survives the crop. The inn, the
road and the barrels may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-mead-run — The Mead Run *(market, EVT-49)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-mead-run.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

An inn yard with every barrel it owns stood out on end in the open and every
one of them plainly empty: bungs out and laid on top, taps drawn and hung on a
nail in a bunch, one barrel tipped forward on its chine to prove the last of it
out. The cellar hatch is thrown back and the steps down are dry and swept. A
dray stands backed up to the door with an empty bed and its horse out of the
shafts. Two more inns' carts wait in the lane behind, also empty. Low horizon
in the bottom third.
Wash: warm ochre on the barrel oak, cold slate on the hoops and taps, rust red
on the dray, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The upended barrels, the open cellar hatch and the empty dray bed inside the
middle 99% of the page height; the full width survives the crop. The inn yard
and the waiting carts may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-ley-drought — Ley Drought *(arcane, EVT-50)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-ley-drought.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A marked stone on open ground that people plainly come to and consult: worn
flat on top, a beaten path to it, and set out on it the instruments that used
to answer. A lodestone hangs on a thread from a tripod dead straight down and
perfectly still. A compass bowl sits with its needle stopped across the marks
at no direction in particular. Iron filings scattered on a slate lie in a flat
even scatter with no pattern in them whatsoever. Everything is in working order
and nothing is doing anything. Drawn dead straight, with no violet and no glow
of any kind. Low horizon in the bottom third.
Wash: cold slate blue on the stone and instruments, dusty grey-green on the
ground, warm ochre on the tripod, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The hanging lodestone, the compass bowl and the flat scatter of filings inside
the middle 99% of the page height; the full width survives the crop. The marked
stone, the path and the open ground may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-boom-town — Boom Town *(market, EVT-51)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-boom-town.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hillside village with a whole second town thrown up around it inside a month:
lines of canvas and green unseasoned timber running out across what were fields
in rows too straight to be old, a new road cut and already rutted deep, stacks
of sawn boards and unrendered brick standing in the mud beside half-framed
walls. A queue of laden carts is backed up on the new road. The old village -
stone, thatch, a churchyard wall - sits in the middle of it, suddenly small,
with the new streets running right up against the wall. Low horizon in the
bottom third.
Wash: warm ochre on the new timber and canvas, rust red on the brick, dusty
grey-green on what is left of the fields, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The new-built lines, the cut road and the old village in the middle of them
inside the middle 99% of the page height; the full width survives the crop. The
hillside, the timber stacks and the carts may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```

## event-frame-breakers — The Frame-Breakers *(industry, EVT-52)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 landscape, 3:2. At least **866 px on the long side** (a landscape card window of 55 x 36.7 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/event-frame-breakers.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A workshop the morning after, with two machines in it and only one of them
broken. In the foreground a heavy knitting frame is wrecked - the iron bar
across its bed snapped through, its needles bent flat in a comb, its wooden
uprights split where the head of a hammer went in - and its unfinished work
still on it, half a stocking hanging loose off the broken bed. Two paces behind
it, on the same floor, an identical frame stands whole, threaded, oiled and
completely untouched: nothing about it is damaged and the difference between
the two is the subject of the picture. A sledge and a smith's hammer are left
lying on the flags where they were dropped. On the plank door at the back, one
sheet of paper is nailed flat through its middle with a horseshoe nail, edges
lifting. Grey morning light through a small high window; sawdust, snapped
needles and a scatter of glass on the floor. Low horizon in the bottom third.
Wash: cold slate blue on the ironwork of both frames, warm ochre on the timber
and the floor, one thin rust red on the nailed paper, flat.

FRAMING. Landscape 3:2, whole page drawn edge to edge.
The broken frame and the whole frame standing behind it inside the middle 99%
of the page height; the full width survives the crop. The door, the nailed
paper and the dropped hammers may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 99% of its height - everything that matters
must sit between 1% and 99% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this deck's card
window, 456 x 300, on the 1536 x 1024 page this deck is drawn at. It is not
a rule of thumb.)
```
