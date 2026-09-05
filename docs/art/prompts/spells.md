# The spells — workings (spell-kindle … spell-loft)

Fourteen plates, one per spell card (`data/arcana.json`), in deck order. Spells
are **arcane subjects**: with the talismans they are the only decks that get the
violet, and the violet is a printing error — the flat wash (#6B4C7D) prints out
of register, offset past the black line, and never glows.

A spell plate is not a caster and not an effect. **It is one ordinary thing
doing something it could not do on its own**, drawn exactly the way every other
made or grown thing in this game is drawn: grain in the timber, hammer marks in
the iron, strands in the rope. The working is what the picture is OF, and the
only way it shows is what the object is caught doing — a fire standing on a bare
hearth with nothing under it to burn, a sail hard as a drum on flat water, a
crack in a lintel closing from the top down. Then the violet slips off register
across the part that was touched, and nothing else on the page is unusual at all.

Nobody is in these. No hands, no wizard, no gesture: a working with a caster in
it becomes a picture of the caster, and the mana cost is already on the card.

Square page. How many pixels is not stated here: the marker under each heading carries the figure, derived from the card's safe area at the print scale `data/mint.json` declares, and a number typed into this file fails `node tools/build-prompts.mjs --check`.

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
watercolour washes: a plate from an illustrated book of workings. Drawn
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

ONE ordinary thing at the moment the working takes hold, drawn from
close to - a hearth, a sail, a cracked lintel, a stretch of water, a
hand's-breadth of ground - on a short ground line, at the scale of a
naturalist's study. Everything in the picture is a real made or grown
thing, observed: the timber has grain, the iron has hammer marks, the
rope is laid up out of strands. The working is not a light and not a
shape; it is what the ordinary thing is DOING that it could not do on
its own.

Its ONLY unusual quality: a flat violet spot colour (#6B4C7D) printed
out of register - offset about a millimetre from the black line,
bleeding past the edge like a misprint on a cheap press - and laid ONLY
across the part the working touches, never across the whole page. The
black line itself is perfectly normal. No glow, no sparkle, no light
source, no particles, no rays, no runes, no gesturing caster.

Paper is warm oatmeal, never white. Ink is warm near-black, never pure
black. Strictly no gradients, no drop shadows, no soft shading, no lens
effects. No text, no letters, no border rule.
```

## Negative prompt — for all fourteen

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
matte, mount, magic particles, glowing runes, arcane circle, sigil,
pentagram, spellbook, wizard, sorcerer, robed figure, casting hands,
wand, staff raised, light rays, energy beam, lightning bolt, aura,
fireball, spell effect, vfx, particle effect
```

## spell-kindle — Kindle *(fire, SPL-01)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/spell-kindle.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A cold stone hearth, swept clean, the fuel basket beside it empty and lying on
its side - and a small steady fire standing on the bare firebrick with nothing
whatever under it to burn. An unlit travelling torch lies on the hearthstone,
dry and pitch-headed. The soot on the fireback is old. The violet slip is
offset across the flame alone.

FRAMING. Square plate, whole page drawn edge to edge.
The hearth mouth, the flame and the torch all well inside the middle 80% of the
page height, centred left to right. The fireback and the hearthstone may run to
the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-ember-lash — Ember Lash *(fire, SPL-02)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/spell-ember-lash.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A billhook and a short spear laid across an anvil, both edges running white-hot
for the last hand's breadth and the hafts stone cold, the ash grain plain in
them. The forge behind is grey and dead: bellows folded shut, fire bed raked
out, tongs cold on the hook. Nothing is being heated by anything. The violet
slip is offset across the two hot edges only.

FRAMING. Square plate, whole page drawn edge to edge.
Both edges and the anvil face inside the middle 80% of the page height, centred
left to right. The dead forge behind may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-mend-stone — Mend Stone *(earth, SPL-03)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/spell-mend-stone.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A cracked stone lintel over a plain doorway, drawn close - and the crack is
closing: wide and dark at the sill end, narrowing to a hairline at the top,
with mortar dust and grit still lying on the sill where it fell out. A mason's
trowel is set down on the sill, clean and unused. The violet slip is offset
along the closing crack only.

FRAMING. Square plate, whole page drawn edge to edge.
The full run of the crack, the lintel and the trowel inside the middle 80% of
the page height, centred left to right. The wall coursing may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-bulwark — Bulwark *(earth, SPL-04)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/spell-bulwark.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A dry-laid field wall of one course's thickness, standing exactly as built -
and in front of it the shafts and near wheel of a runaway cart, splintered
through, the load spilled and the draught chain snapped back on itself. Not one
stone of the wall is out of place and not one is chipped. The violet slip is
offset across the face of the wall only.

FRAMING. Square plate, whole page drawn edge to edge.
The wall face and the broken shafts inside the middle 80% of the page height,
centred left to right. The wall's run and the spilled load may go to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-cleanse — Cleanse *(water, SPL-05)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-cleanse.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A plain sickroom washstand: a chipped earthenware bowl of water gone perfectly
clear, all the fouling settled to a grey sludge lying in the bottom of it in a
hard-edged shape; a soiled cloth wrung out and hung on the rail beside it; a
fever-sheet folded square and bone dry. A tallow candle, unlit. The violet slip
is offset across the clear water only.

FRAMING. Square plate, whole page drawn edge to edge.
The bowl, the water and the folded sheet inside the middle 80% of the page
height, centred left to right. The washstand legs and the wall may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-mist-veil — Mist Veil *(water, SPL-06)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-mist-veil.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A drover's road running out into fen country, the near hedge and the ruts drawn
sharp and complete - and twenty paces on the road simply stops in flat white
mist that ends along a straight edge, as if it had been cut with a rule. Fresh
cart tracks and a dog's prints go into it and do not come out. The violet slip
is offset along the cut edge of the mist only.

FRAMING. Square plate, whole page drawn edge to edge.
The cut edge of the mist, the road and the tracks inside the middle 80% of the
page height, centred left to right. The hedge and the fen may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-fair-wind — Fair Wind *(air, SPL-07)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-fair-wind.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A river barge still tied at a wharf, mooring lines slack on the bollards - and
its single square sail full and hard as a drum, the sheets straining, the mast
bowed a little forward. The water at the hull is flat as a plate and the
wharf's own weathervane points the other way. Loose straw on the quay does not
move. The violet slip is offset across the belly of the sail only.

FRAMING. Square plate, whole page drawn edge to edge.
The full sail, the mast and the mooring lines inside the middle 80% of the page
height, centred left to right. The wharf and the far bank may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-stormcall — Stormcall *(air, SPL-08)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-stormcall.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A laden hay wagon stopped dead on a metalled road, and the weather over it
alone: rain coming down in ropes onto the wagon and a rod of road either side
of it, the ground under it running with water - and beyond that line, straight
and hard-edged, white dust and dry ruts in ordinary daylight. The horse traces
hang empty. The violet slip is offset across the wet ground only.

FRAMING. Square plate, whole page drawn edge to edge.
The wagon, the wet ground and both edges of the dry road inside the middle 80%
of the page height, centred left to right. The rain above and the road ahead
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-wayfire — Wayfire *(fire, SPL-09)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-wayfire.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A corridor burnt through standing forest exactly a wagon's width, the ash floor
level and clean and running away straight to the far edge of the page. The
trunks either side are scorched black to shoulder height and still smoking
thinly; a pace outside the corridor the bracken is untouched and green. A
fallen branch has been burnt through where it crossed the line and nowhere
else. The violet slip is offset along the burnt line only.

FRAMING. Square plate, whole page drawn edge to edge.
The burnt corridor, its two scorched edges and the untouched bracken inside the
middle 80% of the page height, centred left to right. The canopy may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-seam-sense — Seam-Sense *(earth, SPL-10)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-seam-sense.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A hand's-breadth of bare hillside turf lifted like a hatch on a hinge of live
roots, and under it the hill drawn as a clean cut section: soil, then shillet,
then a band of ore running away into the slope, every layer hatched to its own
grain. A prospector's pick stands in the turf beside the opening, the haft
polished dark. The violet slip is offset across the exposed seam only.

FRAMING. Square plate, whole page drawn edge to edge.
The lifted turf, the cut section and the ore band inside the middle 80% of the
page height, centred left to right. The hillside above and below may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-root-snare — Root-Snare *(earth, SPL-11)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-root-snare.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A cart wheel stopped on a metalled road and held there by a lacing of live
roots that has come up through the surface and knitted over the felloes, the
spokes and the hub - root ends still crumbed with wet soil, the stones of the
road lifted and tipped where they came through. The road ten feet behind is
unbroken and dusty. The violet slip is offset across the roots only.

FRAMING. Square plate, whole page drawn edge to edge.
The wheel, the roots and the lifted road stones inside the middle 80% of the
page height, centred left to right. The road and the verge may run to the
margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-deep-draught — Deep Draught *(water, SPL-12)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-deep-draught.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A row of barrels standing outside a village well-house, every one of them
brimming and a little slopped over the chime, the ground dark around their
feet - and the well itself capped with a boarded lid, the winch chain wound
right up and the bucket hanging bone dry on its hook. A yoke and two empty
pails lean against the wall, unused. The violet slip is offset across the water
in the near barrel's mouth only.

FRAMING. Square plate, whole page drawn edge to edge.
The near barrel's brimming mouth, the row behind it and the dry bucket inside
the middle 80% of the page height, centred left to right. The well-house wall
may run to the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-farspeak — Farspeak *(air, SPL-13)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-farspeak.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A travelling writing-slope let down on the tail of a wagon: an open ledger, a
stub of pencil laid across the page, and an open inkwell in which the ink is
standing up in a fine sharp ridge right across its own surface, as though a
voice were crossing it. Nothing else on the slope has moved - the pencil has
not rolled, the page is not lifted, there is no draught. The violet slip is
offset across the ridged ink only.

FRAMING. Square plate, whole page drawn edge to edge.
The inkwell, the ridge on the ink and the open ledger inside the middle 80% of
the page height, centred left to right. The wagon tail and the slope may run to
the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```

## spell-loft — Loft *(air, SPL-14)*

> ✅ **WAITING — THIS ONE IS YOURS.** Page: square. At least **866 px on the long side** (a square card window of 55 x 55 mm printed at 2 x card size, 200 dpi); 1299 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/spell-loft.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A loaded four-wheeled wagon standing dead level and unsupported a wheel's width
above the lip of a ravine, its load roped down and settled, the wheels turning
slowly on nothing. The wheel ruts run up to the edge of the drop on the near
side and pick up again on the far side, and the gap between them is drawn plain
and empty - rock, air, a thread of water a long way down. Nothing is lifting
it. The violet slip is offset across the empty ground beneath the wheels only.

FRAMING. Square plate, whole page drawn edge to edge.
The wagon, the wheels and both lips of the ravine inside the middle 80% of the
page height, centred left to right. The ravine walls and the load may run to
the margins.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 80% of its height - everything that matters
must sit between 10% and 90% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 456 x 366, on the 1024 x 1024 page this deck is drawn at. It
is not a rule of thumb.)
```
