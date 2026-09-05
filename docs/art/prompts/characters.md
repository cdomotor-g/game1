# The characters — A4 plates (character-chr-01 … character-chr-22)

Twenty-two portrait plates, one per character card (`data/characters.json`), in deck
order. CHR-09 onward are the cast of Homer's Odyssey (`data/campaigns.json`): Bronze
Age Greeks drawn in the same register as everyone else - a tunic, a sword on a baldric,
a black ship with one square sail - and never a marble statue, a toga or a vase painting.
The three immortals are drawn as the poem draws them, as people, and the only thing that
gives them away is what the brief says does. Drawn like the campaign map itself: hand-made, a little grimy, tattered
from time in the field — **a page that has travelled with the person it shows.**
Three-quarter figure, caught mid-habit rather than posed, with the belongings
their card names visible and true.

A4 portrait page. Card crops are taken from the plate later; keep the figure's
head and hands in the upper two-thirds. How many pixels is not stated here: the marker under each heading carries the figure, derived from the card's safe area at the print scale `data/mint.json` declares, and a number typed into this file fails `node tools/build-prompts.mjs --check`.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a portrait plate from an illustrated folio of
working people. Drawn with a nib - a fine, springy, varied line, only a
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
Muted and desaturated throughout, warm ochre, rust red, dusty
grey-green, cold slate blue. Paper is warm aged oatmeal, never white.
Ink is warm near-black, never pure black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

A three-quarter-length portrait plate of one person, drawn from life,
mid-habit rather than posed, on a short ground line with their working
gear about them. Clothes and kit are worn from real use and carefully
mended - patches, re-stitched straps, a wrapped tool handle - never
ruined. The page itself is tattered from time in the field: creases, a
grimy thumbed corner, faint foxing at the edges. The silhouette reads
clearly.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects, no magic particles. No text, no letters, no
border rule.
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
matte, mount, chibi, cute, magic particles, glowing runes, grimdark,
ruined, apocalyptic, heroic pose, action scene
```

## character-chr-01 — Corin Vale, human wayfarer

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-01.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A weathered human of indeterminate age lacing a boot on a milestone, mid-stride
interrupted, a long patched travelling cloak thrown back over one shoulder.
Letter-satchel worn cross-body, stuffed and buckled twice; a walking staff
notched with tally marks leans in the crook of an arm. The face is friendly
the way an innkeeper's is: professionally. Wash: dusty grey-green on the
cloak, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-02 — Berga Understone, dwarf prospector

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-02.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A dwarf woman crouched on one knee, tasting a pinch of gravel from a stream
pan with the frown of an expert, heavy boots planted, a surveyor's hammer
through her belt beside sample bags numbered with knots. Braided hair pinned
with a copper spike; a hand lamp hooked to her shoulder strap. Wash: cold
slate blue on her coat, ochre in the stream gravel, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-03 — Sylvae of the Duskmere, elf herbalist

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-03.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A tall elf standing in tall grass, pressing a cut herb between the pages of a
thick, swollen field-book bound with three straps, a knife held between two
fingers of the same hand. Botanist's satchel of little drawers at the hip,
open, one drawer glinting with three faceted shards. Practical field clothes,
hem mud-stained and neatly darned. Wash: dusty grey-green throughout, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-04 — Tilly Goodbarrel, halfling provisioner

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-04.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A halfling woman with sleeves rolled, standing on a crate to reach the tally
board of a supply wagon, chalk in one hand, a wheel of cheese under the other
arm. Apron pockets bulge with apples, a spice tin, a folding knife and a
spoon of office worn like a badge. The expression says the count is wrong and
she knows whose fault it is. Wash: warm ochre on apron and provisions, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-05 — Ruk of the Red Road, orc caravan guard

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-05.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A big orc seated on a wagon tongue at rest halt, war axe across the knees,
mid-way through re-wrapping its handle with fresh cord - the working hands of
a professional at maintenance. Old scars laid over older scars; a caravan
company's brass token on a thong at the throat. One ear cocked to the road.
Wash: rust red on the harness and axe wrap, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-06 — Doctor Elspeth Marrow, human physician

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-06.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A human woman in a sensible travelling coat kneeling by an open oiled-leather
physician's bag whose interior is ranked with stoppered bottles, rolled
bandages and bright instruments, holding one bottle up to the light to read
the sediment. Spectacles pushed up into grey-streaked hair; a ledger under
one knee to keep it off the mud. Wash: cold slate blue on the coat, one rust
red note on the bag's cross, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-07 — Havik Coalbrand, dwarf engineer

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-07.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A dwarf man leaning into the open side-plate of a locomotive's motion, one
arm in to the shoulder, head turned to listen to the machine the way a
physician listens to a chest. Oil-black to the elbows, cap turned backwards,
a ring of gauge keys and a shut lantern on his belt. A long-spouted oil can
stands on the footplate like a patient dog. Wash: rust red on the engine
plates, ochre lamplight tone on the cab wood, flat.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-08 — Old Mother Keswick, human hedge-witch

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/character-chr-08.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A small, upright old woman on a stool outside a turf-roofed cottage, shelling
peas into a bowl, entirely unremarkable except: the bone charm at her throat
is drawn with its flat violet colour printed out of register, offset a
millimetre past the black line like a misprint - the only violet on the page
and the only thing the press could not hold still. Herbs dry in bunches from
the eave; a cat declines to be drawn well. Wash: dusty grey-green on shawl
and herbs; the charm's violet slip #6B4C7D, offset, no glow.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-09 — Odysseus, king of Ithaca

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-09.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A weathered man of middle years, broad in the shoulder and not tall, squatting
on a beach beside the black hull of a ship with a coil of rope across one knee,
mending it with a marlinspike: quick hands, a short grey-shot beard, a look of
listening to something behind him. A plain tunic and a sheathed sword on a
baldric, both worn from ten years of use; bare feet in the sand. Beside him a
clay wine jar with a wax seal and a scatter of oarblades. Wash: cold slate on
the hull and the sea behind, warm ochre on the sand, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-10 — Eurylochus, second in command

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-10.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A big, wary man standing just outside a doorway he will not go through - a
plain plank door in a stone wall, ajar - leaning back against the wall with his
arms folded and his sword still sheathed, looking at the door and not at us.
Sun-cracked skin, a heavy jaw, a tunic belted with rope. At his feet a dropped
bronze cup. Wash: dusty grey-green on the wall and the shadow, rust on the belt,
flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-11 — Polites, dearest of the companions

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-11.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A young, open-faced man with his hand raised to knock, half-turned back to grin
at someone behind him, on the flagged threshold of a house in a clearing. A
sheathed sword, a short cloak, sandals. Beside the step a great lion lies with
its head on its paws like a dog, drawn calmly and without menace. Wash: warm
ochre on the cloak and the flags, grey-green on the trees, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-12 — Perimedes, companion

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-12.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A stocky, patient man kneeling on a ship's deck with both hands full of rope,
hauling a lashing tight around the foot of a mast with his teeth set, the rope
going off the top of the page. A knife in his belt and rope burn on his palms.
Beside him on the deck a wax comb and a ram's fleece. Wash: cold slate on the
planking, ochre on the rope, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-13 — Elpenor, youngest of the crew

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-13.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A thin youth of eighteen sitting on the ridge of a flat house-roof in the early
morning with his legs hanging over the edge, rubbing sleep out of his eyes, an
empty wine cup beside him and a ladder leaning against the eave a little too
far to his left. No sword. A tunic too big for him. Below, at the edge of the
page, the tops of trees and a glimpse of a beached ship. Wash: pale ochre on
the roof, grey-green on the trees, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-14 — Antiphus, companion

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-14.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A strong, square-built man on the shingle with a long spear grounded beside
him, sorting through a basket of cheeses and a lamb's fleece with the
unhurried interest of a farmer's son, an oar-blade under one arm. A short beard,
a tunic pinned at one shoulder. Behind him, small, the dark mouth of a cave in
a hillside with a great flat stone leaning beside it. Wash: warm ochre on the
basket and the shingle, grey-green on the hill, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-15 — Telemachus, prince of Ithaca

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-15.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A young man of twenty, too thin for his height, standing on a quay at dawn with
a travelling bag over his shoulder and a sword he has not worn before, checking
the strap of it. Behind him, small, a ship being readied and an older man in a
cloak waiting by the gangplank, face turned away. A doorway in a stone wall with
a lamp still burning in it. Wash: cold slate on the harbour, ochre on the bag,
flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-16 — Penelope, queen of Ithaca

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-16.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A composed woman of forty at a tall upright loom in a high room, lit from a
window at the left, unpicking a length of fine cloth thread by thread with a
small bronze pin; the finished part of the shroud hangs in a fold behind her.
A plain long dress, hair bound up, a shawl over the shoulders. On a stool
beside her a lamp, a basket of wool and a cup. Wash: pale ochre on the cloth,
grey-green on the wall, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-17 — Eumaeus, swineherd

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-17.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A grey, weather-beaten man in a goatskin cloak sitting on a stone at the gate of
a yard of wattle sties, cutting his own sandals from a piece of oxhide with a
knife, four sows and their piglets about his feet. A boar-spear leaning on the
gatepost; behind him, small, a thatched hut and a hillside of oak. Wash: ochre
on the hide and the thatch, grey-green on the oak, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-18 — Nausicaa, princess of the Phaeacians

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-18.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A tall girl of sixteen at a river mouth, bare-armed, sleeves tied up, wringing
a length of linen with both hands while more of it dries spread on the shingle
behind her; a mule cart with its tailboard down stands at the edge of the page.
A leather ball lies at her feet. She is looking, calmly, at something off the
left edge of the page under an olive bush. Wash: cold slate on the river, pale
ochre on the linen, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-19 — Circe, enchantress of Aeaea

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-19.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A tall, still woman with her hair down, standing at a great upright loom in a
stone hall with a slender wooden wand laid across the beam beside her, holding
out a broad two-handled cup in both hands towards the viewer's left. A long
dress with a woven border; a wolf lies across the threshold behind her with the
patience of a dog. On a table, a bowl of barley and cheese and a jar of honey.
No glow, no smoke, no sparks. Wash: ochre on the cloth on the loom, grey-green
on the wolf and the stone, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-20 — Calypso, nymph of Ogygia

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-20.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A woman with long unbound hair sitting in the mouth of a cave hung with vines,
turning a bronze axe-head over in her hands to test the edge, an adze and an
augur laid on the rock beside her. Alders and cypresses frame the opening;
four small springs run out across the page in channels. Beyond her, far and
small, a man sitting alone on a headland with his back to the cave, looking at
the sea. Wash: grey-green on the vines and the trees, cold slate on the sea,
flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-21 — Athena, as Mentor

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-21.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

An old man in a plain cloak with a staff, leaning in a doorway with one foot
crossed over the other, watching a young man on a quay below with a look of
private amusement - and drawn so that from the neck down the figure is entirely
an old Ithacan, while the eyes, and only the eyes, are grey, young, and
unmistakably not his. A swallow perched on the lintel above. No armour, no
helmet, no owl, no light. Wash: dusty grey-green on the cloak, ochre on the
door, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```

## character-chr-22 — Antinous, chief of the suitors

> ✅ **WAITING — THIS ONE IS YOURS.** Page: A4 portrait. At least **1260 px on the long side** (a portrait card window of 53.3 x 80 mm printed at 2 x card size, 200 dpi); 1890 px if the generator offers it. A plate under that floor is refused at the shipping step, and pixels never drawn cannot be added later. Deliver the finished page as `docs/art/renders/character-chr-22.png` — see `docs/art/AGENTS.md` for how.

```text
[PREAMBLE]

A handsome, well-fed young man of thirty sprawled in a carved chair at the head
of a long table in a hall, a two-handled gold cup lifted halfway to his mouth,
a footstool already in his other hand, not yet thrown. A fine tunic, oiled
hair, a sword on the chair-back. The table is heaped with the remains of a
feast: bones, bread, spilled wine. Nobody else is in the picture. Wash: rust
red on the wine and the cloth, ochre on the cup, flat.

FRAMING. A4 portrait, whole page drawn edge to edge.
Head, both hands and the named gear inside the middle 78% of the page height;
the full width survives the crop. The ground line and anything at the feet may
run into the lower margin.

WINDOW. This plate is cut down to a card, and the card keeps the full width
of the page but only the middle 78% of its height - everything that matters
must sit between 11% and 89% down the page. Outside that band nothing can
be relied on, whatever else this brief says. (Worked out from this deck's
card window, 360 x 419, on the 1024 x 1536 page this deck is drawn at. It
is not a rule of thumb.)
```
