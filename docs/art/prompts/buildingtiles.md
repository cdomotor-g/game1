# The building tiles — ground studies at 17 mm

One plate per printed hex tile: a building, or a sown field, seen from a little
above and a little to the side, standing on its own ground. Subjects come from
[`data/buildings.json`](../../../data/buildings.json) and from the sowing recipes
in [`data/recipes.json`](../../../data/recipes.json); which tile is which and how
big each one is comes out of [`data/buildingtiles.json`](../../../data/buildingtiles.json)
and is never decided in this file.

**These are not the shelved terrain tiles** ([#18](https://github.com/cdomotor-g/game1/issues/18)).
Those are 61 hexes that *are* a board. These are pieces you put *on* a board you
already have, and they are wanted whichever way the ground was supplied.

## What makes this deck different from every other one

**The piece is 17 mm across.** A single-cell tile is one world-map hex wide —
16.7 mm at the table this game ships playing on. That is smaller than a postage
stamp and it is the whole design constraint. A plate drawn like a card, with a
face and a texture and a middle distance, arrives as a grey smudge. Draw **one
silhouette, three or four shapes, and nothing else**: a roof, a wall, a stack, a
fence. If you would have to lean in to see it, it is not in the tile.

**The tile is a shape, not a rectangle.** Every plate is cropped to a hexagon or
a small clump of hexagons — one, two, three or four cells — and the corners of
the page are cut off. Each brief below says which. Nothing that matters goes near
a corner.

**How much of the page that shape keeps is derived, not written here.** Run
`node tools/tile-envelope.mjs <id>` and it prints the footprint as a map with the
safe box marked: the largest area a subject can occupy and be certain of surviving
the die. The same numbers are appended to every commission automatically by
`--render` (`envelopeNote` in `tools/lib/tiles.mjs`), so no `FRAMING.` block below
needs to state a composition band and none of them should — a band typed by hand
is a band that stops being true the day a building's numbers move it to another
shape.

It is worth knowing why this is derived rather than trusted to judgement. A triad
keeps only the middle half of its width below the shoulder line, and **no aiming
can recover what falls outside that**: a triad's window is 0.99 against a square
plate, so the crop keeps essentially the whole page and hands the overhang to the
die. The granary spent three drawn plates on a building drawn to the full width
before that was understood, and the accepted plate still loses a scoop to it.

**A label band sits in the bottom-left corner — always.** A solid strip carrying
the tile's name is printed along the piece's lower-left edge, running parallel to
it, and whatever is under it is covered. It is in the same corner on every tile in
the set, so **keep the important detail out of it**. Not empty — a bare corner on
a drawing this small looks like a mistake — but ground, grass, water, spoil,
something the piece can afford to lose. Never the door, the working end, or the
one thing the tile is of.

That corner is chosen, not arbitrary: everything here is drawn from thirty degrees
above and thirty to the left, which puts the lit face and the business of the
building on the right and leaves the bottom-left as foreground ground. The rule is
asking you to keep them there. The exact depth is worked out per tile and arrives
appended to the prompt as `LABEL BAND`.

It used to be a bar ruled across the middle, which split every drawing into two
unrelated halves. That is what a corner is buying.

**Every tile is drawn once.** The face is the building finished; the back is that
same plate with the colour run not laid on and its name band drawn hollow. The
back is a build output, not a commission, so a tile is ONE subject with one
brief, one framing entry and one step — there is no `## tile-<id>-site` (or
`-sown`) section to write. See *The back — and why it has no brief* below, which
is where the standing rules for a back live.

**Both sides carry the same name.** The band says HUT on the face and HUT on the
back. The picture is what tells finished from unfinished; the label is what tells
one tile from another, and a player needs that from either side.

**The two sides turn over onto each other by construction.** Same viewpoint, same
distance, same corner of ground, the building in the same place on the page — a
player flips the tile the round the work is paid for and the picture settles
rather than jumps. That was once a rule an artist had to hold across two drawn
plates, and it fell out of agreement for free; one plate printed two ways cannot
drift.

**Seen from above and to the side, never head-on.** These pieces sit on a table
next to each other. A row of buildings each drawn in flat elevation reads as a
shelf of doll's houses; the same row drawn from about 30° above reads as a town.
Keep the angle the same for every tile in the deck — it is the one thing that
makes fifty-four separate plates look like one set.

**Ground to the edge, and nothing beyond it.** The plate is drawn edge to edge
with the ground the building stands on — grass, cut earth, cobble, water. No
vignette, no border, no drop shadow off the edge, no white margin. The cut line
does the framing.

**No text of any kind.** No signboards, no barrel stencils, no milestone
numerals. The name is printed by the tools.

**No grid.** The cells are an overlay the tools draw. A hex grid painted into a
plate cannot be moved and will not line up.

**Square for one- and three-cell tiles; 3:2 landscape for two- and four-cell
tiles** — each brief says which, and it is not a choice: the page is the shape of
the footprint's own bounding box, so a plate drawn on the wrong page is a plate
that loses ground it did not have to. Nor is the heading the authority on it:
`formatFor` in `tools/lib/tiles.mjs` works the page out from the footprint, and
`node tools/mint-request.mjs <plate-id>` prints the answer with the commission. If
a building's numbers change enough to move it up a band, the shape in the heading
below is the stale one and the tool is right.

How many pixels is not stated here either. `node tools/mint-request.mjs <id>`
derives it per tile from the largest world hex any map declares, and prints both
the floor and the figure it would take to print. A number typed in this file
would be a number that stops being true the day a map grows a print preset.

## Shared preamble — paste ahead of every prompt below

```text
This is a PLATE: one whole drawn page of artwork, and nothing else. It
is NOT a card. The card frame, the title, the card code, the stat icons,
the rules text and the flavour text are all set by machine afterwards,
from the data, over a crop of this page. Draw the picture alone, edge to
edge - no panel, no banner, no border rule, no box, and no lettering of
any kind anywhere on the page.

Fine pen-and-ink drawing on aged paper, finished by hand with thin
watercolour washes: a plate from an illustrated surveyor's notebook of
buildings. Drawn with a nib - a fine, springy, varied line, only a
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
Muted and desaturated throughout, warm ochre for thatch and timber, rust
red for tile and brick, dusty grey-green for grass and crop, cold slate
blue for stone, iron and water. Paper is warm aged oatmeal, never white.
Ink is warm near-black, never pure black.

The mood is workaday and observed, never theatrical. This is a world of
trade, weather and repair: ordinary daylight, ordinary ground, and
nothing staged to look frightening or heroic. A dangerous animal is
drawn the way a naturalist draws one - at a wary distance, doing what it
ordinarily does - rather than the way a poster sells a fight.

ONE small building or one worked patch of ground, drawn from about
thirty degrees above and thirty degrees to the left, standing on its own
ground which runs to every edge of the page. The MASSING is simple and
unmistakable - three or four shapes and no more, so the building is
still itself when the whole plate prints seventeen millimetres across.
That is a rule about the shapes, not about the drawing: the interior is
hatched as finely as on any other plate. Built by hand out of local
material and kept in repair - a patched roof, a leaning post, a worn
path to the door - never new, never ruined, never abandoned.

Nobody in it. No figures, no animals unless the brief names them as the
subject. No sky, no horizon, no middle distance, no background scenery:
the ground fills the page.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed
shading, no lens effects. No text, no letters, no numerals, no signage.
No border rule, no vignette, no grid.
```

## Words that get drawn literally

A model has no idea which of your words are the name of a thing and which are a
simile. Two that have already cost a plate here:

- **"mushroom-shaped staddle stones"** put actual toadstools on the grass and
  left the building sitting flat on the ground. Say **"short round stone pillars
  with flat wide caps"** and name them staddle stones after.
- **A heading a person reads as an instruction** - `FRAMING.`, `WINDOW.`,
  `LABEL BAND.` - gets rendered onto the page as text. That is why an image model
  is never handed the commission: `node tools/mint-request.mjs <id> --render`
  builds it a different prompt, with the meta blocks stripped and every "no X"
  moved into the negative where it belongs. Use it.

## Negative prompt — for all of them

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
matte, mount, chibi, cute, isometric video game asset, magic particles,
numerals, signage, vignette, hex grid, square grid, ruled lines,
horizon, sky, clouds, background scenery, distant mountains, people,
figures, crowd, heroic, grimdark, ruined, apocalyptic, overgrown,
abandoned, cutaway, floor plan, blueprint, elevation drawing, floating
island, diorama, plinth, base slab, cut-out, isolated object on a plain
background, white margin, empty border, caption, handwriting, manuscript
text, book page, page border, framed illustration, mounted plate
```

## The back — and why it has no brief

A tile is drawn ONCE. The back is this same plate with the colour run not laid on
- soot on tallow, the key block pulled before the colour blocks - and its name
band drawn hollow instead of solid. It is a build output, not a commission, so
there is nothing here for an artist to do and no `-site` or `-sown` section below.

It was a second commission until it kept failing the one rule that matters most
here: **the two sides must turn over onto each other.** Same viewpoint, same
distance, the building in the same place on the page, so that a player flipping
the tile sees the picture settle rather than jump. Two drawn plates have to be
argued into that agreement every single time and fall out of it for free; one
plate printed two ways cannot drift, because it is one plate.

What that costs is the staged material - squared-up timber, a sawhorse, a tool
set down - which said PAUSED rather than RUINED, because nobody stacks material
at a ruin. The colour-dropped face says NOT YET instead. Thinner, and bought
knowingly: half the plates, half the aiming, and a rule that cannot come apart.

**So draw the finished building, and draw it well.** It is doing both jobs now.
The lower-left corner still has to be ground the piece can afford to lose - the
band sits there on both sides.

---

# Housing

## tile-hut — one cell, square

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tile-hut.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A single-room hut of stacked logs under a steep thatched roof, low enough that a
tall man would stoop at the door. One doorway, no window, a stovepipe of
mortared stone through the ridge with a thread of smoke. A chopping block
and three split rounds by the door; a beaten path to it through rough grass.
Wash: ochre on the thatch, grey-green on the grass, flat.

FRAMING. Square plate, ground to all four edges. The hut sits in the upper
half of the page with its path running down out of the lower edge. Nothing
in any corner.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-timber-house — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-timber-house.png`.

```text
[PREAMBLE]

A proper house of sawn lumber under a shingled gable, twice the hut and
plainly built by somebody who owned a saw: square corners, a plank door on
iron hinges, two small shuttered windows, a stone chimney at the gable end.
A lean-to woodstore against the near wall, stacked to the eaves. Low
paling fence along the front with a gap for the path. Wash: ochre on the
shingles, rust red on the door, grey-green on the grass, flat.

FRAMING. Landscape 3:2, ground to all four edges. House left of centre,
woodstore and fence running right, so the piece reads across rather than up.
Ridge line kept in the upper third.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-brick-house — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-brick-house.png`.

```text
[PREAMBLE]

A brick house of two low storeys under a pitched tile roof, warm and
weather-tight: dressed brick with a paler course at the sill line, four
glazed windows, a panelled door under a small hood, a brick chimney drawing
well. A walled yard behind it with a washing line and a water butt at the
downpipe. Cobbled apron in front. Wash: rust red on the brick and the tile,
cold slate blue on the door, grey-green on the yard, flat.

FRAMING. Square plate, ground to all four edges. House in the upper two
thirds, yard behind and to the right, cobbles running out of the lower edge.
Chimney well inside the top margin; nothing in any corner.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-manor — four cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-manor.png`.

```text
[PREAMBLE]

A stone manor house with a slate roof, three gables and tall chimneys - the
biggest thing anybody in this game builds. Mullioned windows, a stone porch,
a low balustrade along the front. To one side a walled kitchen garden in
squared beds; to the other a gravel sweep with a mounting block. An avenue of
four clipped trees along the front wall. Wash: cold slate blue on the roof
and stone, grey-green on the garden, ochre on the gravel, flat.

FRAMING. Landscape 3:2, ground to all four edges. The house occupies the
centre and left; garden and sweep fill the right so the piece reads as an
estate rather than a large cottage. Chimneys well inside the top margin.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 82% of its width - between 9% and 91% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own rhombus footprint, 4 cells, on the 1536 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Out of the ground

## tile-lumber-camp — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-lumber-camp.png`.

```text
[PREAMBLE]

A working stand of felled timber and NOT a sawmill: eight or ten trunks
limbed and cross-cut, stacked in a pile against two upright stakes, with a
second pile part-built beside it. A pair of shear legs of three poles over
the stack with a chain and hook hanging. Fresh stumps in the cleared ground
with an axe left standing in one, and a skid track of dragged earth running
away between them. A lean-to of poles and boughs at the back with a
crosscut saw hung on it. Wash: ochre on the cut ends and the bark, grey-green
on the ground and the boughs, cold slate blue on the chain, flat.

FRAMING. Landscape 3:2, ground to all four edges. Stacks along the right and
centre where the shear legs stand over them; stumps and the skid track fill
the left and the lower edge, which is ground the band may cover. No standing
trees taller than the shear legs - this is cleared ground, not forest.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-quarry — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-quarry.png`.

```text
[PREAMBLE]

A cut face in stone, worked in three stepped benches, the rock left square
and raw where it has been split - drill holes down one edge of the face and
a row of iron wedges still in them. Dressed blocks squared and stacked on
the quarry floor, one of them slung under a timber derrick of three legs
with a windlass at its foot. A barrow of chippings and a spoil run of small
waste tipped down one side. Wash: cold slate blue on the rock and the
blocks, ochre on the derrick timber, grey-green on the grass along the top
of the face, flat.

FRAMING. Landscape 3:2, ground to all four edges. The face runs across the
upper half with the grass line along its top; floor, blocks and derrick fill
the lower half. Derrick right of centre. The spoil run takes the lower left,
which is ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-clay-pit — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-clay-pit.png`.

```text
[PREAMBLE]

A wet dug hollow, terraced in two shallow steps, with brown standing water
in the bottom of it and the sides slumped and slick where they have been cut
by hand. A plank ramp with a barrow on it running up out of the pit, and a
spade left upright in the cut face. A heap of grey clay set out on boards to
stiffen beside the pit, squared off with the back of the spade. Reeds along
the wet edge. Wash: cold slate blue on the water and the wet clay, ochre on
the planks and the barrow, grey-green on the reeds, flat.

FRAMING. Square plate, ground to all four edges. The hollow fills the centre
and lower right; the drying heap and boards sit upper left, the ramp runs
out of the right edge. Wet, and unmistakably wet - that is the whole of what
tells this from the sand pit.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-sand-pit — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-sand-pit.png`.

```text
[PREAMBLE]

A dry hollow scooped out of pale sand, the sides steep and slumping in
loose fans at the foot with the whole surface shifting rather than cut. A
riddle - a square sieve frame on four legs - stood at the edge of the pit
with screened sand heaped clean under it and a shovel leaning against it.
A barrow at the top of a plank run. A few dry stems at the rim and nothing
green in the pit at all. Wash: ochre on the sand throughout, cold slate blue
on the riddle mesh and the shovel, flat.

FRAMING. Square plate, ground to all four edges. Pit through the centre and
lower right; riddle and screened heap upper left; the plank run leaves the
right edge. Dry, loose and pale - which is what tells it from the clay pit
at seventeen millimetres.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-mine — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-mine.png`.

```text
[PREAMBLE]

A timbered adit driven into the foot of a rise: a square mouth framed in
heavy squared timber with a cap piece over it, black inside, and a rough
track running out of it. Over the ground beside it a winding gin - four
posts and a windlass drum with a rope over a pulley down a shaft collared
in planks. A tub on two rails at the adit mouth and a long spoil tip of
broken waste running down and out of the piece. A picking table of boards
with sorted ore on it. Wash: cold slate blue on the rock, the ore and the
ironwork, ochre on the timber and the tub, grey-green on the grass above
the adit, flat.

FRAMING. Landscape 3:2, ground to all four edges. Adit mouth left of centre
in the rise, gin and shaft to the right of it so the piece reads across.
The spoil tip runs out of the lower left, which is ground the band may
cover. Nothing above the gin posts.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-oil-derrick — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-oil-derrick.png`.

```text
[PREAMBLE]

A tall latticed derrick of bolted timber, four legs battered inward to a
crown block at the top with a cable falling from it - the only lattice
tower in the whole set, and its openwork against the paper is the entire
silhouette. At its foot a low engine house of boards with a stovepipe and
a walking beam pivoted on a samson post beside it. Two riveted iron tanks
on a low bund to one side, and a slush pit of standing oil, dark and flat.
Trodden ground gone black around the well head. Wash: cold slate blue on
the tanks, the cable and the ironwork, ochre on the derrick timber and the
engine house, flat - and the pit and the stained ground as solid ink, the
darkest shape on the page.

FRAMING. Square plate, ground to all four edges. The derrick stands centre
and slightly right, its crown block well inside the top margin and daylight
showing through the lattice on both sides. Engine house and beam at its
foot; tanks right; the slush pit and stained ground fill the lower left,
which is ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 82% of its width - between 9% and 91% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own rhombus footprint, 4 cells, on the 1536 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-well — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-well.png`.

```text
[PREAMBLE]

A round wellhead of dressed stone, waist high, under a small pitched roof
of shingles carried on two posts, with a windlass barrel and crank between
them and a bucket on a rope hanging over the shaft. A stone trough at the
side, filled and slopping over. The ground worn bare in a ring around it
and a path leading in, with the grass beaten flat where people stand.
Nothing else. Wash: cold slate blue on the stone, the water and the ironwork,
ochre on the roof shingles and the posts, grey-green on the grass beyond
the worn ring, flat.

FRAMING. Square plate, ground to all four edges. The wellhead sits centre
and slightly right, roof ridge inside the upper third. The trough is at the
right; the worn ground and the path fill the lower left, which is ground the
band may cover. Small object, whole page - do not fill the plate with
scenery to make it look busier.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-dock — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-dock.png`.

```text
[PREAMBLE]

A timber jetty on driven piles running out over open water, decked in
uneven planks with a low rail down one side, two bollards and a coiled rope
on it. A flat-bottomed boat made fast alongside with an oar shipped and a
net heaped in the bottom. On the bank a drying rack of poles with split fish
hung on it and a barrel beside it. Water occupies rather more than half the
piece, drawn as flat hatching with no reflection and no ripple ring. Wash:
cold slate blue on the water and the rope, ochre on the jetty timber, the
boat and the rack, grey-green on the bank, flat.

FRAMING. Square plate, ground and water to all four edges. Bank across the
lower left, jetty running from it up and away to the right so the piece
reads out over the water. Rack and barrel on the bank at the lower left,
which is ground the band may cover. Small and timber-built: the harbour is
the stone one, and this must not be mistaken for it.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Ground and crops

## tile-farm — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-farm.png`.

```text
[PREAMBLE]

A farm steading and NOT its fields: a long low barn of board and batten under
a thatched roof, a cart shed open on one side with a two-wheeled cart backed
into it, a muck heap, a stone trough, and a yard of trodden earth between
them with cart ruts through it. A gate in a post-and-rail fence at the near
corner. Wash: ochre on the thatch, rust red on the cart, grey-green on the
grass beyond the fence, flat.

FRAMING. Landscape 3:2, ground to all four edges. Barn along the top, yard
across the middle and bottom, gate at the lower right. The fields are
separate tiles and must NOT appear here.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-pasture — four cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-pasture.png`.

```text
[PREAMBLE]

A fenced run of grazing: post-and-rail fence carried right round the piece in
perspective, a water trough fed by a wooden gutter, a low open-sided field
shelter of poles and thatch in one corner, and a gate hung on a stone post.
Four sheep and one cow, small, grazing at different angles and none of them
looking at the viewer. The grass is cropped short and worn to bare earth on
the tracks between trough, shelter and gate. Wash: grey-green on the grass,
ochre on the shelter thatch, flat.

FRAMING. Landscape 3:2, ground to all four edges. The fence line frames the
piece; shelter in the upper left, trough at the centre right, animals spread
across the middle band. Nothing important in any corner.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 82% of its width - between 9% and 91% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own rhombus footprint, 4 cells, on the 1536 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-orchard — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-orchard.png`.

```text
[PREAMBLE]

Standard fruit trees in staggered rows on a grass floor, pruned open in the
middle to a goblet of four or five limbs, trunks clear to head height and
whitened at the foot - trees that have been kept, not trees that grew. Six
or seven of them, small, none of them touching. A ladder set up into one, a
picking basket at its foot and windfalls in the grass under another. Wash:
grey-green on the grass and the leaves, ochre on the trunks, rust red on
the fruit, flat.

FRAMING. Square plate, ground to all four edges. Rows run corner to corner
so the pattern survives the hexagonal cut. Ladder and basket at the centre
right; open grass at the lower left, which is ground the band may cover. No
horizon, no sky, no fence, no building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-vineyard — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-vineyard.png`.

```text
[PREAMBLE]

Rows of staked vines on a slope, low and knee-high and gnarled at the foot,
each trained along a wire between chestnut posts so the rows read as long
combed bands of leaf running away across the piece. A dry-stone terrace wall
holding the slope, one course of it fallen and re-laid. A picking basket
and a pair of shears on the wall. The ground between the rows is dry, stony
and worked. Wash: grey-green on the leaves, cold slate blue on the terrace
stone, ochre on the posts and the dry ground, flat.

FRAMING. Landscape 3:2, ground to all four edges. Rows run corner to corner
and away to the right; the terrace wall crosses the lower third. Basket and
shears right of centre. Nothing tall - this is the opposite of the hop
garden, and low against high is what tells them apart at seventeen
millimetres. No building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-apiary — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-apiary.png`.

```text
[PREAMBLE]

Five straw skeps - domed coiled-straw hives, plain and unmistakable - set in
a row on a low plank bench under a shallow shingle roof on posts, open at
the front. Bees drawn only as a scatter of small marks in the air at the
hive mouths, no insect drawn large enough to have legs. A smoker and a
covered pail on the ground at the end of the bench. Rough flowering grass
all round. Wash: ochre on the straw skeps and the bench, grey-green on the
grass, cold slate blue on the smoker, flat.

FRAMING. Square plate, ground to all four edges. The row of skeps runs
across the upper middle so the domes repeat - the repeat is the whole
silhouette; flowering grass fills the lower half and the lower left, which
is ground the band may cover. No hollow log hives, no boxes - skeps.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-crop-grain — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-crop-grain.png`.

```text
[PREAMBLE]

One field of grain in full ear, ripe: dense upright stalks in ruled drills
running diagonally across the whole page, heads heavy and all leaning the
same way, a narrow strip of stubble and trodden earth along the near edge
where the field is entered. Two or three poppies at the margin. Nothing else.
Wash: ochre on the ears, grey-green on the stems and margin, flat.

FRAMING. Square plate, crop to all four edges. Drills run corner to corner so
the pattern survives the hexagonal cut. No horizon, no sky, no building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-crop-vegetables — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-crop-vegetables.png`.

```text
[PREAMBLE]

One vegetable plot in ruled beds: rows of cabbage and leek heads in earth
ridged up between them, a bean row on crossed poles at one side, a hoe stood
in the ground at the end of a row. Beds run diagonally across the page. A
sprinkle of straw mulch. Wash: grey-green on the leaves, ochre on the straw
and the poles, flat.

FRAMING. Square plate, ground to all four edges. Beds run corner to corner.
No horizon, no sky, no building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-crop-flax — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-crop-flax.png`.

```text
[PREAMBLE]

One field of flax in flower: fine upright stems packed close, drills running
diagonally across the whole page, the whole surface flecked with small
five-petalled flowers. Finer and lower than grain, and it should read as a
different crop at a glance. A strip of trodden earth along the near edge.
Wash: cold slate blue on the flowers, grey-green on the stems, flat.

FRAMING. Square plate, crop to all four edges. Drills corner to corner. No
horizon, no sky, no building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-crop-cotton — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-crop-cotton.png`.

```text
[PREAMBLE]

One field of cotton at the picking: low bushy plants in well-spaced rows on
ridged dry earth, each plant carrying open bolls of white fibre against dark
leaves. The spacing is wide and the earth between the rows shows - that is
what tells it from grain and flax at 17 mm. A picking basket on its side at
the row end. Wash: ochre on the dry earth, grey-green on the leaves, bare
paper for the bolls, flat.

FRAMING. Square plate, ground to all four edges. Rows corner to corner. No
horizon, no sky, no building.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-crop-hops — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-crop-hops.png`.

```text
[PREAMBLE]

One hop garden: tall poles set in a grid with twine strung between them and
bines spiralling up, hung with clusters of pale cones near the top. It is
the only crop in this game that is drawn UPWARD, and the height of the poles
against everything else is the whole identity of the tile. Bare trodden earth
between the rows. Wash: grey-green on the bines, ochre on the poles and
cones, flat.

FRAMING. Square plate, ground to all four edges. Poles run to the top edge -
they are meant to be cut by it. Rows corner to corner.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Working buildings

## tile-sawmill — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-sawmill.png`.

```text
[PREAMBLE]

An open-sided sawmill: a heavy timber frame under a shallow board roof, a
frame saw on its carriage inside, a log deck of three trunks chained on the
near side, and a drift of sawdust and offcuts at the blade end. A crank shaft
and pit wheel where the water would drive it, whether or not there is water.
Cut lumber stacked and stickered to season. Wash: ochre on the timber and the
fresh-cut ends, cold slate blue on the blade and ironwork, flat.

FRAMING. Landscape 3:2, ground to all four edges. Mill left of centre, log
deck and lumber stack running right. Roof ridge inside the upper third; the
piece must read across.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-charcoal-kiln — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-charcoal-kiln.png`.

```text
[PREAMBLE]

A burning charcoal clamp and NOT a building: a broad low dome of cordwood
stacked on end and sealed all over in turf and wet earth, twice as wide as
it is high, with a short chimney hole at the crown letting up one thin
thread of smoke and three vent holes low around the base. The turf skin is
patched and cracked where it has been re-daubed. A stack of cordwood cut to
length beside it, a long rake and a shovel laid down, and a heap of finished
charcoal on a bed of ash. The ground round the clamp is burnt bare and grey.
Wash: ochre on the cordwood and the turf, grey-green on the grass beyond the
burnt ring, flat - and the finished charcoal as solid ink.

FRAMING. Square plate, ground to all four edges. The dome sits centre and
right, its crown inside the upper third; cordwood stack right, charcoal heap
and tools at the lower left, which is ground the band may cover. No walls, no
roof, no chimney stack - the moment this grows a building it becomes one of
the other four heat tiles.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-smelter — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-smelter.png`.

```text
[PREAMBLE]

A stone stack furnace: a squat tapering tower of rough stone about three
times a man's height, battered inward as it rises, with an arched tapping
hole at its foot and a runner of sand in front of it where the metal is let
out. A lean-to of boards against one side housing a great pair of bellows,
their nozzle going through the wall. A charging ramp of stacked earth and
timber running up the back to the top of the stack. An ore heap of broken
rock on one side and a heap of black slag on the other, glassy and lumpy.
Wash: cold slate blue on the stone and the ore, ochre on the bellows leather
and the ramp timber, flat - and the slag heap as solid ink.

FRAMING. Landscape 3:2, ground to all four edges. Stack right of centre with
the tapping arch and its sand runner at its foot; bellows shed and charging
ramp to the left so the piece reads across. Top of the stack well inside the
upper margin. The slag heap takes the lower left, which is ground the band
may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-steelworks — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-steelworks.png`.

```text
[PREAMBLE]

The industrial one, and it should look a century later than everything
around it: a long shed of brick with an iron-framed roof in a shallow saw
of three ridges, and beside it one tall round brick chimney far higher than
anything else in the set, banded at the top. Wide arched openings down the
shed's flank, dark inside. A great coal heap against the near end with a
plank run over it, iron ingots stacked crosswise in courses on the ground,
and a spent-lime and cinder waste at the back. Everything rectilinear,
everything sooted. Wash: rust red on the brick, cold slate blue on the iron
roof frame and the ingots, flat - and the coal heap as solid ink.

FRAMING. Square plate, ground to all four edges. Chimney right of centre and
kept well inside the top margin - it may be cut by nothing. Shed running
left and away from it; ingot stacks and coal across the lower half; cinder
waste at the lower left, which is ground the band may cover. Big, black and
straight-lined - that is what separates it from the smelter.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 82% of its width - between 9% and 91% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own rhombus footprint, 4 cells, on the 1536 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-brickworks — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-brickworks.png`.

```text
[PREAMBLE]

A rectangular updraught kiln of brick with four arched firing mouths in a
row along its foot, blackened around each arch, a low parapet at the top and
smoke standing off it. Alongside it - and this is the signature of the tile,
not the kiln - the drying hacks: long open racks under a low board roof on
posts, holding green bricks stacked in herringbone courses with air between
them, three bays of them running away. A pug mill of a barrel and a sweep
arm in the yard, a barrow of clay, and a mound of raw clay weathering.
Wash: rust red on the fired brick and the kiln, ochre on the green bricks,
the racks and the roof boards, cold slate blue on the raw clay, flat.

FRAMING. Landscape 3:2, ground to all four edges. Kiln left of centre, firing
arches full on to the viewer; drying hacks running right and away so the
piece reads across. The pug mill and clay mound take the lower left, which is
ground the band may cover. The stacked green bricks must read as stacked
bricks at seventeen millimetres - that is the whole tile.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-glassworks — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-glassworks.png`.

```text
[PREAMBLE]

A glass cone: one enormous brick cone, round in plan, tapering the whole
height of the piece to an open mouth at the top with heat standing off it -
a shape nothing else in this set has, and drawn tall enough that it cannot
be mistaken for a kiln or a chimney. Arched doorways round its foot, dark
inside, with the ground in front of them worn and glass-strewn. A low
annealing shed of brick lean-to against the cone. Sand in a heaped bay of
boards, a barrow, a stack of split faggot wood, and a scatter of broken
cullet swept into a pile that catches the light as bare paper. Wash: rust
red on the brick cone and the shed, ochre on the sand and the faggots, cold
slate blue on the cullet, flat.

FRAMING. Square plate, ground to all four edges. The cone stands centre and
right and its mouth must sit well inside the top margin with paper above it;
annealing shed to its left; sand bay, faggots and cullet across the lower
half, the cullet pile at the lower left where the band may cover it. Nothing
may be drawn taller than the cone.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-blacksmith — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-blacksmith.png`.

```text
[PREAMBLE]

An open-fronted forge: a low building of stone to waist height and boards
above, its whole front side open to the yard under the roof overhang, with a
brick hearth and a great tapering hood inside it going up into a stone
chimney at the gable. An anvil on an elm block standing out in the yard
clear of the building, a slack tub of water beside it, and a rack of made
iron - bar stock, hoops, a plough share, three horseshoes - hung and leaned
along the open front. A coal heap and a heap of clinker at the gable end.
Wash: cold slate blue on the anvil, the ironwork and the stone, ochre on the
boards and the elm block, rust red on the brick hearth, flat.

FRAMING. Landscape 3:2, ground to all four edges. Building right of centre
with the open front turned toward the viewer so the hood and hearth are
visible inside it; anvil and slack tub out in the yard to the left, which is
the reading of the tile - the anvil outdoors and alone is what says smith at
seventeen millimetres. Coal and clinker at the lower left, which is ground
the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-carpenter — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-carpenter.png`.

```text
[PREAMBLE]

An open-sided joiner's shop under a board roof: a long bench along the back
with a screw vice and a rack of hand tools over it, two sawhorses out in
front with a squared baulk across them and a saw left in the kerf. Leaning
against the shop, a half-finished cartwheel - spoked, felloes on, tyre not
yet - which is the shape that says carpenter across a table. Barrel staves
bundled upright, a stack of seasoning boards stickered with laths between
them, a plough body finished and set aside, and a drift of curled shavings
under the bench. Wash: ochre on the timber, the wheel and the shavings, cold
slate blue on the saw, the vice and the tyre iron, flat.

FRAMING. Landscape 3:2, ground to all four edges. Shop across the right and
centre, sawhorses in front of it; the wheel leaning at the right-hand end
where the eye lands. Board stack and shavings run out of the lower left,
which is ground the band may cover. No water wheel and no frame saw - that
is the sawmill, and these two must not be confused.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-weaver — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-weaver.png`.

```text
[PREAMBLE]

A long low weaving shed, its upper floor carrying an unbroken band of small
windows the whole length of the wall - the weaver's window range, and the
one thing that names this building - under a shallow shingled roof. Ground
floor of stone with a plain door. In the yard in front, a tenter frame: a
long timber rack on posts with a length of cloth stretched and hooked taut
across it, drying. A rack of yarn hanks hung on pegs by the door, and a
covered basket of fleece. Wash: ochre on the shingles and the tenter frame,
grey-green on the cloth and the yarn, cold slate blue on the stone and the
tenter hooks, flat.

FRAMING. Landscape 3:2, ground to all four edges. Shed along the back from
the centre to the right, window range full on to the viewer and unbroken;
tenter frame across the front and left, its stretched cloth the biggest
plain shape on the page. Fleece basket at the lower left, which is ground
the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-tannery — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-tannery.png`.

```text
[PREAMBLE]

Pits, and the building comes second: six square sunken tan pits in two rows,
sunk into the ground and lined with boards, filled with dark liquor with
hides floating slack in them and a plank walk between the rows. A beam and a
scraping horse set up at the pit end with a hide over it. A stretch rack
behind, a frame of poles with two hides laced into it drying. A heap of
ground oak bark under a scrap of board roof. A shallow open shed at the
back, and nothing else. Wash: ochre on the hides, the bark and the timber,
cold slate blue on the pit liquor and the scraping blade, grey-green on the
grass at the edges, flat - the liquor dark, the darkest thing on the plate.

FRAMING. Square plate, ground to all four edges. Pits fill the centre and
lower right and run corner to corner; rack and shed across the top; bark
heap at the lower left, which is ground the band may cover. The pits must
read as pits in the ground and not as tubs standing on it.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-tailor — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-tailor.png`.

```text
[PREAMBLE]

A narrow town shop of two storeys, taller than it is wide, jettied slightly
over the street, with one very large glazed window filling most of the upper
floor - a wall of small leaded panes for close work, and the reason this
building looks the way it does. Below, a plain shopfront with a half-door and
a fold-down board shelf on brackets, propped open. On the shelf, three bolts
of cloth stood on end and one unrolled a hand's length; on a bench beside it
a great pair of shears and a flat iron. A neat swept doorstep and a scrap
basket. Everything trim and square - this is the tidiest building in the set.
Wash: rust red on the brick, ochre on the timber and the bolts, cold slate
blue on the window leading, the shears and the iron, flat.

FRAMING. Landscape 3:2, ground to all four edges. Shop right of centre and
standing tall in the frame with its eaves inside the upper margin; the shelf,
bolts and bench running left along the front so the piece reads across.
Swept step and scrap basket at the lower left, which is ground the band may
cover. No dummy, no figure, no hanging garments over the street.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-mill — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-mill.png`.

```text
[PREAMBLE]

A stone tower mill: a round tapering tower of rubble stone, three storeys,
capped with a boat-shaped timber cap and carrying four lattice sails on a
windshaft - the sails are the silhouette and they must read as four from any
distance. A tail pole running down from the cap to a wheel on a track at the
ground. A stone doorway with a sack hoist door above it, two full sacks
standing by the step, and an old millstone leaning against the tower foot.
Wash: cold slate blue on the stone tower and the millstone, ochre on the cap,
the sails and the sacks, grey-green on the grass, flat.

FRAMING. Square plate, ground to all four edges. The tower stands centre and
slightly right; the sails may be cut by the top and right edges - they are
meant to be, and cutting them is what makes the mill read as huge - but the
cap and the windshaft must sit well inside. Sacks and millstone at the foot,
grass at the lower left where the band may cover it. No water wheel: the
sawmill has the wheel and this must not borrow it.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-bakery — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-bakery.png`.

```text
[PREAMBLE]

A small brick bakehouse under a pantile roof with a great domed brick oven
bulging out through its back wall, half outside the building, roofed over
with its own little lead cap and a squat flue - the bulge is what says
bakery and it must be unmistakable. A wide low door with a worn stone step
and a long-handled wooden peel leaning by it. Outside, a cooling rack of
slatted boards on trestles with round loaves set out on it, and a bundle of
faggot wood stacked to the eaves under the overhang. Wash: rust red on the
brick and the pantiles, ochre on the loaves, the peel and the faggots, cold
slate blue on the stone step and the flue cap, flat.

FRAMING. Landscape 3:2, ground to all four edges. Bakehouse left of centre
with the oven bulge turned to the viewer at its right-hand end; cooling rack
and loaves running right so the piece reads across. Faggot stack at the
lower left, which is ground the band may cover. Roof ridge inside the upper
third.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-butcher — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-butcher.png`.

```text
[PREAMBLE]

A small open-fronted shambles of board and stone under a deep overhanging
roof that shades the whole front: inside it a heavy chopping block worn
hollow in the middle, a rack of knives and a saw on the back wall, and a
stout beam across the opening carrying four empty iron hooks. Outside, a
salting barrel with its lid off and a scoop in the salt, a stone trough, and
a raw hide folded over a rail to one side. Swept, wet-looking flags in front.
Nothing hanging on the hooks and no carcass anywhere - the tools and the
salt say it. Wash: cold slate blue on the stone, the hooks and the knives,
ochre on the block, the barrel and the hide, flat.

FRAMING. Square plate, ground to all four edges. Shop across the upper and
middle page with its open front to the viewer; barrel and trough at the
front right; swept flags and the hide rail at the lower left, which is
ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-dairy — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-dairy.png`.

```text
[PREAMBLE]

A low stone dairy with thick walls, deep eaves and a cool slated roof, its
one small window barred rather than glazed and set high for draught. The
door stands open on a stone-flagged floor with shallow setting pans laid out
in a row on a slate bench inside. Out in front, a cheese press - a squared
timber frame with a great stone weight hung in it over a cheese in its
hoop - and a churn on a stand beside it with a pail. Two rounds of cheese
turned out on a board. A slab-lidded well cover set in the ground. Wash:
cold slate blue on the stone, the slate roof and the pans, ochre on the
press timber, the churn and the cheeses, grey-green on the grass, flat.

FRAMING. Square plate, ground to all four edges. Dairy across the top and
centre, door open and turned to the viewer; press and churn out in front of
it at the centre right, which is where the eye lands; grass and the well
cover at the lower left, which is ground the band may cover. Cool, shaded
and shut in - the opposite of the bakery, and it should read that way.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-brewery — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-brewery.png`.

```text
[PREAMBLE]

A brick brewhouse of two low storeys with a long louvred cupola riding the
whole ridge of the roof, steam standing out of its slats - the vented ridge
is the signature and is the first thing to draw. Through a wide open doorway
the head of a copper mash tun with a rail round its top. Outside, a stone
ramp down to a cellar hatch with two barrels being rolled on it and four
more stacked on their sides in a rick beside it, chocked with wedges. A
hop sack, corded at the neck, and a heap of spent grain. Wash: rust red on
the brick, ochre on the barrels, the cupola louvres and the sack, cold slate
blue on the copper hoops and the stone ramp, flat.

FRAMING. Landscape 3:2, ground to all four edges. Brewhouse across the back
from the centre to the left with the cupola full along its ridge; ramp,
hatch and barrel rick running right so the piece reads across. Spent grain
and hop sack at the lower left, which is ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-winery — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-winery.png`.

```text
[PREAMBLE]

A press house open on two sides under a heavy tiled roof on stone piers,
built round one great timber screw press - a squared frame with a wooden
screw the thickness of a leg running down through its head to a bed and a
basket, the beam above it counterweighted with a hung stone. That press is
the tile. Under the roof beside it, two shallow open vats of staved timber
with a trough running between them; outside, barrels stacked on their sides
in a stone rack two courses high, and a stone catch trough with a wooden
spout. Baskets stacked empty by a pier. Wash: cold slate blue on the stone
piers, the racks and the troughs, ochre on the press timber, the vats and
the barrels, rust red on the roof tiles, flat.

FRAMING. Square plate, ground to all four edges. The press stands centre and
right under the roof, its head well inside the upper margin; vats to its
left, barrel rack across the lower right, stacked baskets and swept floor at
the lower left, which is ground the band may cover. No vines - the vineyard
is its own tile and must not appear here.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Storage

## tile-warehouse — three cells, square

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tile-warehouse.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A big plain storehouse of tarred board on a stone plinth, raised clear of the
ground on staddle stones, with a wide double door and a hoist beam and pulley
projecting from the gable above it. Crates and two barrels on the loading
apron, one crate roped. A padlock on the door hasp, drawn as a shape and not
as a detail. Wash: cold slate blue on the tarred boards, ochre on the crates
and barrels, flat.

FRAMING. Square plate, ground to all four edges. The building fills the
middle and upper page; the loading apron and its crates run out of the lower
edge. Hoist beam well inside the top margin.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-granary — three cells, square

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tile-granary.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A grain store raised on short round stone pillars with flat wide caps -
staddle stones - with a short ladder up
to a small high door - the gap under the floor is the point of the building
and must be unmistakable. Weatherboarded sides, a steep shingled roof, a
louvred vent in the gable. Two sacks and a scoop at the foot of the ladder.
Wash: ochre on the boards and sacks, cold slate blue on the staddle stones,
grey-green on the ground, flat.

FRAMING. Square plate, ground to all four edges. Compose inside the safe box
`node tools/tile-envelope.mjs granary` prints — the triad narrows to the centre
half below its shoulder and carries a V notch in the top centre, so a store
drawn to the full width loses its outer staddle stones. The daylight gap under
the floor is the one thing that must survive whole; ladder and sacks gather
under the building, not out to the sides. Ground, not detail, in the lower-left.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# The town

## tile-market — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-market.png`.

```text
[PREAMBLE]

A market shelter and no building at all: a square tiled roof, steeply
pitched with a finial at the peak, carried on four stout timber posts over an
open floor of worn stone flags, with the daylight going straight through
underneath it - that gap under the roof is the whole silhouette and it must
not be closed. Two trestle tables under it, one with baskets and a stack of
crates, one bare. A beam scale hung from a tie between two posts. A pole with
a rolled awning lashed to it against one post. Sacks leaned at the foot of
another. Wash: rust red on the roof tiles, ochre on the posts, the trestles
and the baskets, cold slate blue on the flags and the scale, flat.

FRAMING. Square plate, ground to all four edges. The shelter sits centre and
slightly right with clear paper visible under the roof between the posts;
flags and sacks spread to the lower left, which is ground the band may cover.
Roof peak inside the upper third. No walls, no door, no shopfront - the
moment it has a wall it stops being a market.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-trading-house — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-trading-house.png`.

```text
[PREAMBLE]

A brick counting house of two storeys and good windows, pierced through the
middle of its front by a wide arched carriage entry with a shadowed passage
running through to a rear yard - the arch through the building is what says
trading house rather than warehouse. A panelled door with three stone steps
and an iron handrail to one side of the arch, a bay of shuttered windows to
the other. In the passage mouth a two-wheeled hand cart part loaded; on the
ground beside the door a great beam scale on a stand with a set of graded
weights, and three corded bales and a bound chest waiting to be weighed.
Wash: rust red on the brick, cold slate blue on the roof slate, the scale
and the ironwork, ochre on the bales, the chest and the cart, flat.

FRAMING. Square plate, ground to all four edges. The building fills the
upper two thirds with the carriage arch dead centre and dark; scale, bales
and cart across the lower half; swept paving at the lower left, which is
ground the band may cover. No hoist beam and no staddle stones - those are
the warehouse's and this must not borrow them.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-town-hall — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-town-hall.png`.

```text
[PREAMBLE]

A stone moot hall standing on an open arcade: a first-floor hall of dressed
stone with tall mullioned windows, carried on six squat round columns with a
paved market floor open underneath and daylight all the way through it. An
outside stair of stone runs up the near gable end to a doorway with a hood
over it. A small open timber cupola on the ridge with one bell hung in it.
Two benches under the arcade and a stone standard by the foot of the stair.
Wash: cold slate blue on the stone, the roof and the bell, ochre on the
cupola timber, the stair rail and the benches, flat.

FRAMING. Landscape 3:2, ground to all four edges. Hall across the centre and
right, the arcade beneath it with paper showing through between the columns;
outside stair at the left-hand end so the piece reads across. Cupola and bell
well inside the upper margin. Paving and benches at the lower left, which is
ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-guildhall — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-guildhall.png`.

```text
[PREAMBLE]

A timber-framed hall, the front close-studded in narrow uprights with the
upper floor jettied a full foot out over the lower on carved brackets - the
overhang and the ranked studding are the whole identity, and they are what
tell it from the town hall's stone arcade. A steep tiled roof, a carved
bargeboard on the gable, a range of small leaded windows along the jetty. A
wide plank double door with a stone step and a long bench each side of it,
worn hollow. An iron lantern bracket over the door with a lantern on it.
Wash: ochre on the timber frame, the bargeboard and the benches, rust red on
the roof tiles, cold slate blue on the window leading and the lantern, flat -
the infill panels left as bare paper.

FRAMING. Landscape 3:2, ground to all four edges. Hall across the centre and
right with the jetty full on to the viewer so the overhang casts its line;
door and benches at the centre; the ground and step run out of the lower
left, which is ground the band may cover. Gable inside the upper margin.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-inn — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-inn.png`.

```text
[PREAMBLE]

A long two-storey inn with a wooden gallery running the length of its upper
floor on turned posts, and a wide arched cart entry through the ground floor
at one end opening into a dark stable yard passage. A plain empty iron sign
bracket over the door with nothing hanging from it. Below the gallery, a
bench and a barrel-topped table by the door, three barrels stacked against
the wall, a horse trough of hollowed stone and a mounting block of three
steps. A lantern on a hook. Wash: ochre on the timber gallery, the barrels
and the bench, rust red on the roof tiles, cold slate blue on the stone
trough, the mounting block and the ironwork, flat.

FRAMING. Landscape 3:2, ground to all four edges. Inn across the back with
the cart arch at the right-hand end; gallery running left above the door;
trough, block and barrels along the front so the piece reads across. Yard
cobbles at the lower left, which is ground the band may cover. The sign
bracket must be empty - no board, no painted device, no lettering of any
kind.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-infirmary — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-infirmary.png`.

```text
[PREAMBLE]

A small stone hall with a steep shingled roof, a gabled stone porch standing
out from the front with a bench inside it, and three tall narrow windows down
the flank set higher than a person - light in, nothing to see out. One
chimney at the far gable drawing thin smoke. In front, a physic garden of
four small squared beds edged with boards and divided by a gravel cross
path, each bed a different low herb, with a watering can and a covered water
butt at the corner of the nearest. Wash: cold slate blue on the stone and
the water butt, ochre on the shingles, the porch bench and the gravel,
grey-green on the herb beds, flat.

FRAMING. Square plate, ground to all four edges. Hall across the upper half
with the porch centre right; the four herb beds fill the lower half and run
corner to corner; the gravel path and the nearest bed take the lower left,
which is ground the band may cover. Quiet and kept - no cross, no bell, no
shrine furniture.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Defence

## tile-barracks — three cells, square

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/tile-barracks.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

```text
[PREAMBLE]

A long low barrack range of plain dressed stone, set at a sharp angle to the
viewer, its length running directly back into the picture and away towards the
far corner, its near end large and its far end small with distance. Its walls are built of cool pale
grey-blue stone blocks, and a shallow hipped roof of grey slate slopes gently
down on all four sides to a wide overhanging eave, with one plain chimney at
each end. The building is severe, institutional and entirely plain. Seen in
three-quarter view so that the long front wall and one short end wall are both
visible at once and the eye looks down onto the roof. Along that whole front
wall the same small square window is repeated over and over in one unbroken
evenly spaced row, six of them on the upper floor and six directly beneath
them, every one plain and square and exactly like its neighbours, evenly spaced
along the entire length, each big enough to read as its own opening. That
relentless repetition IS the building - it is what the eye catches first and it
is the one thing that names this tile across a table, because everything else
in this set is irregular. A single plain doorway breaks the lower row at its
middle. In front of the range a low drystone yard wall crosses the dry bare
earth, broken by a square gate of squared timber between two stone piers. In
the yard a rack of spears stands upright in a timber frame, and a stout drill
post is set in the ground with a worn ring trodden round it. Colour muted,
chalky and greyed throughout and laid flat: cool slate blue-grey on the stone
walls, the roof slates and the spearheads, dull weathered ochre on the gate
timber, the rack and the shafts, dusty grey-green on the grass, dry pale dun on
the trodden earth.

FRAMING. Square plate, ground to all four edges. The three-quarter view, the
hipped roof and the angle the range is set at are all stated in the subject
paragraph on purpose, because --render strips this block - and this block is
one paragraph on purpose too, because --render strips a *paragraph* beginning
FRAMING., so a blank line in here sends everything after it into the prompt.
Composition is no longer written here at all: `envelopeNote` derives it from
this tile's own footprint and --render appends it, phrased after four sheets as
empty bands rather than as a percentage, because a model cannot act on a
percentage and drew the subject page-wide against one four times running. Run
`node tools/tile-envelope.mjs barracks` for the shape those bands come from.
What is left that is this tile's own: the range is long in its own proportions
and still narrow on the page, which is what the angle buys; and trodden bare
earth goes in the lower left, which is ground the name band may cover. No
banners, no devices, no painted arms.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

Keep negations out of that subject paragraph, and out of every other one in this
file. `--render` drops a whole *sentence* that negates, so a "not X" buried
mid-sentence sails through into the prompt and gets drawn: "not a steep gabled
one" drew gables and "none decorated" drew decoration, on sheet 2. Note that this
paragraph is outside the fence for the same reason — anything inside it is the
prompt.

## tile-watchtower — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-watchtower.png`.

```text
[PREAMBLE]

A tall square stone tower, far taller than it is wide and the tallest thing
in the set after the glass cone, battered slightly inward as it rises, with
narrow slit openings up two faces and a corbelled parapet at the head
carrying a short timber hoarding on one side. An iron beacon basket on a
bracket arm at the parapet corner, empty and cold. An outside stair of stone
running up the near face to a door set well above the ground, with the ground
floor blind. A low dry-stone wall enclosing a scrap of ground at its foot, a
gate of two rails, and a heap of cut beacon wood under a board. Wash: cold
slate blue on the stone and the ironwork, ochre on the hoarding timber, the
stair rail and the beacon wood, grey-green on the grass, flat.

FRAMING. Landscape 3:2, ground to all four edges. Tower right of centre and
standing the full height of the plate with its parapet and beacon basket well
inside the top margin - they may be cut by nothing. Wall, gate and beacon
wood run left and out of the lower left, which is ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-palisade — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-palisade.png`.

```text
[PREAMBLE]

A run of defence work and no building: a close-set line of split logs driven
upright in an earth bank, each one axe-pointed at the top so the whole run
reads as a saw-tooth line across the piece - that toothed top edge is the
entire silhouette. Behind it a walkway of planks on braced timber uprights,
reached by a short ladder. In front, a ditch with its spoil thrown up
against the foot of the logs and rough grass growing on the bank. A narrow
gate of two heavy leaves, barred across with a drawbar, set into the run.
Wash: ochre on the split logs and the walkway, cold slate blue on the drawbar
ironwork, grey-green on the bank grass, flat.

FRAMING. Square plate, ground to all four edges. The run crosses the plate
corner to corner so the line survives the hexagonal cut, gate right of
centre; ditch and bank along the near side, walkway and ladder behind. The
ditch and its grass take the lower left, which is ground the band may cover.
No towers, no wall walk roofed over - a fence, seriously made.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# The strange work

## tile-alchemist — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-alchemist.png`.

```text
[PREAMBLE]

A narrow crooked house of two storeys and a half, leaning slightly and
taller than its neighbours would be, with a glazed oriel bay jettied out from
the upper floor on a bracket - and standing in that bay, drawn as clean
silhouettes against the glass, a tall pear-shaped alembic with its long neck
curving down and two round-bottomed retorts. The chimney is a stack of
open-ended clay pots mortared one on the next, four of them, crooked, with a
thin thread of smoke - the pot chimney and the glassware are what name this
tile. A small walled yard beside it holding one bed of tall strange-leaved
plants, a stone mortar on a block, and a covered crock. Wash: cold slate blue
on the glass, the alembic and the roof slate, ochre on the timber and the
clay pots, grey-green on the plants, flat.

FRAMING. Landscape 3:2, ground to all four edges. House right of centre and
standing tall with the pot chimney inside the upper margin; the oriel bay
turned to the viewer at eye height; walled yard and plant bed running left so
the piece reads across. Mortar and crock at the lower left, which is ground
the band may cover. No stars, no sigils, no glow of any kind.

WINDOW. This plate is cut down to a tile, and the tile keeps the full width
of the page but only the middle 87% of its height - everything that matters
must sit between 7% and 93% down the page. Outside that band nothing can be
relied on, whatever else this brief says. (Worked out from this tile's own
pair footprint, 2 cells, on the 1536 x 1024 page it is drawn at. It is not
a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-shrine — one cell, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-shrine.png`.

```text
[PREAMBLE]

A plain standing stone, rough and unworked and about the height of a man,
set upright on a stepped base of three courses and sheltered by a small open
canopy - four short stone columns carrying a low pitched slab roof, open on
every side with daylight going straight through. That is all the structure
there is. At the foot of the stone a shallow bowl and a bundle of cut stems
laid down; the paving worn smooth in a ring where people have stood, and a
path beaten to it through the grass. Wash: cold slate blue on the stone, the
columns and the roof slab, grey-green on the grass and the cut stems, ochre
on the worn path and the bowl, flat.

FRAMING. Square plate, ground to all four edges. Canopy and stone centre and
slightly right, roof slab inside the upper third, paper showing between the
columns; the worn ring and the path fill the lower left, which is ground the
band may cover. Old and tended, never ruined and never overgrown. No figure,
no carving, no symbol on the stone.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 87% of its width - between 7% and 93% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own single footprint, 1 cell, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 23% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

---

# Ways in and out

## tile-harbour — three cells, square

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-harbour.png`.

```text
[PREAMBLE]

A quay of dressed stone, coursed and square, running out into deep water with
a mole returning from its far end - stone, and heavy, and the opposite of the
dock's timber jetty in every line. A treadwheel crane on the quay: a squat
timber house on a stone base carrying a projecting jib with a block and hook
hanging over the water. Iron bollards along the edge, a flight of steps cut
down into the water at one side, and mooring rings. Alongside, the hull of a
single-masted decked vessel made fast, drawn from the quay so it is mostly
hull and rail with the mast running up and out of the plate. Crates and two
barrels stacked on the quay, a coil of heavy rope. Water fills the outer
third, flat hatched, with no reflection and no ripple ring. Wash: cold slate
blue on the stone, the water, the ironwork and the hull, ochre on the crane
timber, the crates and the rope, flat.

FRAMING. Square plate, quay and water to all four edges. Quay running from
the lower left up and away to the right with the crane at the centre right
and the vessel beyond it; the mast is cut by the top edge and is meant to be.
Crates, bollards and rope along the near quay; swept stone at the lower left,
which is ground the band may cover.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```

## tile-rail-depot — two cells, 3:2 landscape

> ✅ **WAITING — THIS ONE IS YOURS.** Save the finished page as `docs/art/renders/tile-rail-depot.png`.

```text
[PREAMBLE]

A goods platform of stone with a timber edge, a shed of boards along the
back of it with two wide sliding doors, and a pair of iron rails on timber
sleepers running along its face and out of both ends of the piece - the rails
are subject matter, laid in ballast and drawn with the sleepers showing, not
lines put over the picture. At the end of the platform a buffer stop of
baulked timber. Beside the shed a water tower - an iron tank on four braced
legs with a swinging leather-jointed spout - and a small hand crane on the
platform edge. Crates and a hand barrow on the platform, a heap of ballast
and a stack of spare sleepers on the ground. Wash: cold slate blue on the
rails, the tank, the crane and the stone, ochre on the shed boards, the
sleepers and the crates, rust red on the tank's rusted seams, flat.

FRAMING. Landscape 3:2, ground to all four edges. Platform and shed across
the back from the centre to the right, water tower at the right-hand end and
inside the upper margin; rails running the full width and out of both ends so
the piece reads across; buffer stop at the left. Ballast and spare sleepers
at the lower left, which is ground the band may cover. No locomotive, no
wagon, no rolling stock of any kind.

WINDOW. This plate is cut down to a tile, and the tile keeps only the
middle 99% of its width - between 1% and 99% across. Outside that band
nothing can be relied on, whatever else this brief says. (Worked out from
this tile's own triad footprint, 3 cells, on the 1024 x 1024 page it is
drawn at. It is not a rule of thumb.)

LABEL BAND. A solid band carrying this tile's name is printed along the
lower-left edge of the piece, running parallel to it and about 13% of the
piece's height deep at its deepest. It is in the same corner on every tile
in this set. Whatever is drawn under it is covered, so KEEP THE IMPORTANT
DETAIL OUT OF THAT CORNER - not empty, which on a drawing this small looks
like a mistake, but ground, water, wall, grass, spoil: something the piece
can afford to lose. Never the door, the working end, the one thing the tile
is of. The subject is drawn from above and to the left, so the lit face and
the business of it fall to the right anyway - this is asking you to keep
them there.
```
