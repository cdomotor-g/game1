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

**Every tile is drawn twice.** The face is the building finished; the back is the
same building on the same ground with the work not yet done. Both are
commissions, both go through the four steps, and they are separate subjects — the
back's brief is `## tile-<id>-site` (or `-sown` for a field). See *The site side*
below, which is where the standing rules for a back live.

**Both sides carry the same name.** The band says HUT on the face and HUT on the
back. The picture is what tells finished from unfinished; the label is what tells
one tile from another, and a player needs that from either side.

**The two sides must turn over onto each other.** Same viewpoint, same distance,
same corner of ground, the building sitting in the same place on the page. A
player flips the tile the round the work is paid for and the picture should
settle rather than jump.

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

**Square for one-, three- and four-cell tiles; 3:2 landscape for two-cell tiles**
— each brief says which, and it is not a choice: the page is the shape of the
footprint's own bounding box, so a plate drawn on the wrong page is a plate that
loses ground it did not have to.

How many pixels is not stated here either. `node tools/mint-request.mjs <id>`
derives it per tile from the largest world hex any map declares, and prints both
the floor and the figure it would take to print. A number typed in this file
would be a number that stops being true the day a map grows a print preset.

## Shared preamble — paste ahead of every prompt below

```text
Black ink line art on warm unbleached paper, in the style of a worn 1600s
surveyor's field book: heavy uneven woodcut-style outlines, interior shading
built only from hand-drawn hatching and cross-hatching, over-inked pooling
where lines meet at sharp angles, bare paper for the lit surfaces.

Flat muted spot colour sits UNDER the black line like a mis-registered
letterpress run - solid areas of colour with no blending. Restricted palette:
warm ochre for thatch and timber, rust red for tile and brick, dusty
grey-green for grass and crop, cold slate blue for stone, iron and water.
Paper is warm oatmeal, never white. Ink is warm near-black, never pure black.

ONE small building or one worked patch of ground, drawn from about thirty
degrees above and thirty degrees to the left, standing on its own ground
which runs to every edge of the page. Bold, simple, unmistakable silhouette:
three or four shapes and no more, readable when the whole plate is printed
seventeen millimetres across. Built by hand out of local material and kept in
repair - a patched roof, a leaning post, a worn path to the door - never new,
never ruined, never abandoned.

Nobody in it. No figures, no animals unless the brief names them as the
subject. No sky, no horizon, no middle distance, no background scenery: the
ground fills the page.

Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading,
no lens effects. No text, no letters, no numerals, no signage. No border
rule, no vignette, no grid.
```

## Negative prompt — for all of them

```text
coffee ring, cup ring, water ring, tea stain, circular stain, ring stain,
watermark, blot, gradient, glow, bloom, lens flare, drop shadow, soft shading, airbrush, blur,
depth of field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, octane, unreal engine, digital painting, oil
painting, concept art, anime, chibi, cute, cel shaded, isometric video game
asset, sparkles, magic particles, watermark, signature, text, letters,
numerals, signage, logo, UI, frame border, vignette, hex grid, square grid,
ruled lines, horizon, sky, clouds, background scenery, distant mountains,
people, figures, crowd, heroic, grimdark, ruined, apocalyptic, overgrown,
abandoned, cutaway, floor plan, blueprint, elevation drawing
```

## The site side — what a back is, for every tile

A back is the same subject as its face, unbuilt, and it carries three things
beyond the face's brief. They are standing rules: they apply to every `-site` and
`-sown` prompt below and are not repeated in each one.

```text
UNBUILT. The same building, on the same ground, seen from the same angle and the
same distance, with the work not finished. What that means depends on the
building: a frame raised and the roof half on, walls to waist height, a pit dug
and shored, a field drilled and not yet green. Enough of it is there that the
finished thing is recognisable from the same silhouette; enough is missing that
nobody could mistake it for done.

MATERIAL STAGED AROUND IT. The stuff the building is made of, stacked ready and
squared up on the ground beside it - logs, sawn boards, dressed stone, brick
under sacking - and a working station near it: a sawhorse with a piece on it, a
trestle, a mortar board. One tool set down where somebody left it, never in a
hand. This is the deck's signature for a site: it is the fastest thing on the
piece to read at seventeen millimetres and it is what says PAUSED rather than
RUINED, because nobody stacks material at a ruin.

NOT ABANDONED. Fresh-cut timber, turned earth still dark, nothing weathered,
nothing overgrown, nothing collapsed, nobody in it. The work stopped at the end
of a day, not years ago.
```

---

# Housing

## tile-hut — one cell, square

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
```

## tile-hut-site — one cell, square

```text
[PREAMBLE]

The hut half raised. The log walls are up to the eaves all round and the roof is
open: bare rafters and a ridge pole against the sky on the near pitch, purlins
and battens lashed across the far one with the first course of thatch just
started. No chimney yet - the stone is not laid. The doorway is a gap with two
posts and no lintel. A stack of unbarked logs on the ground to the left, the
chopping block and split rounds to the right, and a sawhorse in the foreground
with a log across it and an axe leaning against the leg. Wash: ochre on the
started thatch, grey-green on the grass, flat.

FRAMING. Square plate, ground to all four edges. The hut in the upper half, the
sawhorse and staged timber in the lower half, the beaten path running down out
of the lower edge - matching the finished face so the two turn over onto each
other. Nothing in any corner.
```

## tile-timber-house — two cells, 3:2 landscape

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
```

## tile-timber-house-site — two cells, 3:2 landscape

```text
[PREAMBLE]

The timber house part built. A stone footing course is laid and the sawn frame
stands on it - corner posts, plates and studs, braced and pegged, open to the
sky. Two rafters up at the near gable and the rest stacked. The shingles are in
banded bundles on the ground, the chimney is a heap of squared stone, and the
paling fence is posts with no rails yet. A saw horse with a plank on it and a
mallet resting there. Wash: ochre on the fresh timber, grey-green on the grass,
flat.

FRAMING. Landscape 3:2, ground to all four edges. Frame left of centre, timber
stacks and fence posts running right, matching the finished face so the two turn
over onto each other. Ridge line kept in the upper third.
```

## tile-brick-house — three cells, square

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
```

## tile-brick-house-site — three cells, square

```text
[PREAMBLE]

The brick house at first-floor height. The walls are up about two thirds with a
ragged tooth left at each corner where the next courses will bond in, window
openings arched over timber centring still in place, and no roof at all - just
the joists across. A plank scaffold on lashed poles with a mortar board and a
bucket on it. Stacks of brick under sacking, a heap of sand, a slaked-lime tub.
The yard wall is a trench with a footing in it. Wash: rust red on the laid
brick, cold slate blue on the tools, grey-green on the ground, flat.

FRAMING. Square plate, ground to all four edges. House in the upper two thirds,
yard behind and to the right, cobbles unlaid and running out of the lower edge,
matching the finished face. Scaffold poles well inside the top margin.
```

## tile-manor — four cells, 3:2 landscape

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
```

---

# Ground and crops

## tile-manor-site — four cells, 3:2 landscape

```text
[PREAMBLE]

The manor as a shell. Dressed stone up to the first-floor string course with the
three gables not started, window openings square and empty, and a full timber
scaffold of poles and lashed platforms round two faces with a hoist gin at one
corner. Squared blocks laid out in rows on the grass, waiting to go up. The
kitchen garden is beds marked with pegs and line and nothing growing; the sweep
is bare subsoil with cart ruts; the avenue is four staked saplings. Wash: cold
slate blue on the stone, ochre on the scaffold, grey-green on the ground, flat.

FRAMING. Landscape 3:2, ground to all four edges. Shell centre and left, laid-out
stone and pegged garden filling the right, matching the finished face. Scaffold
tops well inside the top margin.
```

## tile-farm — two cells, 3:2 landscape

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
```

## tile-farm-site — two cells, 3:2 landscape

```text
[PREAMBLE]

The steading going up. The barn is a bent frame of crucks and tie beams with the
first bundles of thatch on the near end only; the cart shed is four posts and a
plate. The yard is turned earth not yet trodden hard, with the cart standing
loaded with straw rather than backed in. The stone trough lies on its side where
it was rolled off the sledge. The gate is hung and the fence is posts with no
rails. Wash: ochre on the raw timber and thatch, rust red on the cart, grey-green
beyond, flat.

FRAMING. Landscape 3:2, ground to all four edges. Barn along the top, open yard
across the middle and bottom, gate at the lower right, matching the finished
face. The fields are separate tiles and must NOT appear here.
```

## tile-pasture — four cells, 3:2 landscape

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
```

## tile-pasture-site — four cells, 3:2 landscape

```text
[PREAMBLE]

The pasture being fenced. Post holes dug in a line with the spoil beside each,
posts standing in about half of them, rails leaning in bundles against the set
ones, and the far side of the run still open ground. The trough is a dry
stone-lined pit with no water in it and the gutter is a split log not yet hung.
The field shelter is four poles and a ridge with no thatch. A post-hole spade and
a maul left in the grass. No animals at all - the whole point is that nothing can
be put in it yet. Wash: grey-green on the grass, ochre on the raw posts, flat.

FRAMING. Landscape 3:2, ground to all four edges. The unfinished fence line frames
the piece; shelter frame upper left, dry trough centre right, matching the
finished face. Nothing important in any corner.
```

## tile-crop-grain — one cell, square

```text
[PREAMBLE]

One field of grain in full ear, ripe: dense upright stalks in ruled drills
running diagonally across the whole page, heads heavy and all leaning the
same way, a narrow strip of stubble and trodden earth along the near edge
where the field is entered. Two or three poppies at the margin. Nothing else.
Wash: ochre on the ears, grey-green on the stems and margin, flat.

FRAMING. Square plate, crop to all four edges. Drills run corner to corner so
the pattern survives the hexagonal cut. No horizon, no sky, no building.
```

## tile-crop-grain-sown — one cell, square

```text
[PREAMBLE]

One field just drilled with grain and not yet green. Straight seed furrows in
freshly turned earth running diagonally across the whole page, the ridges still
sharp and dark, a scatter of straw and a rook or two working the tilth. A harrow
left at the headland where the last pass finished. Nothing standing, no ears, no
colour but earth. Wash: ochre on the turned soil, grey-green only at the trodden
margin, flat.

FRAMING. Square plate, earth to all four edges. Furrows corner to corner,
matching the ripe face so the two turn over onto each other. No horizon, no sky,
no building.
```

## tile-crop-vegetables — one cell, square

```text
[PREAMBLE]

One vegetable plot in ruled beds: rows of cabbage and leek heads in earth
ridged up between them, a bean row on crossed poles at one side, a hoe stood
in the ground at the end of a row. Beds run diagonally across the page. A
sprinkle of straw mulch. Wash: grey-green on the leaves, ochre on the straw
and the poles, flat.

FRAMING. Square plate, ground to all four edges. Beds run corner to corner.
No horizon, no sky, no building.
```

## tile-crop-vegetables-sown — one cell, square

```text
[PREAMBLE]

One vegetable plot just made up and not yet sprouted. Beds ridged and raked
smooth in ruled rows running diagonally across the page, a line of string on two
pegs down one bed, and a dibber left standing in the soil. The bean poles are
crossed and tied but bare. A shallow drill open along one bed with the seed not
yet covered. Wash: ochre on the raked earth, grey-green on the poles, flat.

FRAMING. Square plate, ground to all four edges. Beds corner to corner, matching
the grown face. No horizon, no sky, no building.
```

## tile-crop-flax — one cell, square

```text
[PREAMBLE]

One field of flax in flower: fine upright stems packed close, drills running
diagonally across the whole page, the whole surface flecked with small
five-petalled flowers. Finer and lower than grain, and it should read as a
different crop at a glance. A strip of trodden earth along the near edge.
Wash: cold slate blue on the flowers, grey-green on the stems, flat.

FRAMING. Square plate, crop to all four edges. Drills corner to corner. No
horizon, no sky, no building.
```

## tile-crop-flax-sown — one cell, square

```text
[PREAMBLE]

One field just sown with flax and not yet up. Fine tilth harrowed to a
near-level surface - much smoother than a grain drilling, which is what tells the
two apart at this stage - with the seed broadcast and a light chain harrow drawn
diagonally across, leaving faint parallel combing. A seed hopper on its strap
left at the field edge. Nothing standing. Wash: ochre on the fine soil, flat.

FRAMING. Square plate, earth to all four edges. Combing corner to corner,
matching the flowering face. No horizon, no sky, no building.
```

## tile-crop-cotton — one cell, square

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
```

## tile-crop-cotton-sown — one cell, square

```text
[PREAMBLE]

One cotton field just set and not yet grown. Wide ridged rows on dry earth, the
ridges freshly drawn and the furrows between them clean - the wide spacing is the
identity of this tile at every stage. Seed set in shallow holes along each ridge,
one or two marked with a stone. The picking basket standing empty at the row end.
Wash: ochre on the dry earth, flat.

FRAMING. Square plate, ground to all four edges. Rows corner to corner, matching
the picking face. No horizon, no sky, no building.
```

## tile-crop-hops — one cell, square

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
```

---

# Working buildings

## tile-crop-hops-sown — one cell, square

```text
[PREAMBLE]

One hop garden just planted. The poles are set in their grid and the twine is
strung between them - the height against everything else is still the identity of
this tile - but the bines are only new sets at the foot of each pole, a hand
high, with nothing climbing yet. Bare trodden earth between the rows and a bundle
of spare poles lying on the ground. Wash: ochre on the poles, grey-green only at
the new sets, flat.

FRAMING. Square plate, ground to all four edges. Poles run to the top edge - they
are meant to be cut by it - matching the grown face. Rows corner to corner.
```

## tile-sawmill — two cells, 3:2 landscape

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
```

## tile-sawmill-site — two cells, 3:2 landscape

```text
[PREAMBLE]

The sawmill as a frame. Heavy sill beams bedded on stone pads and the main posts
up with the tie beams across, no roof boards, and the saw carriage not yet in -
only its track laid. The pit wheel lies on its side on the grass with its shaft
beside it. The log deck holds one trunk, chained and waiting. A drift of fresh
offcuts where the frame was cut to length, and a broadaxe left in a beam. Wash:
ochre on the raw timber, cold slate blue on the ironwork, flat.

FRAMING. Landscape 3:2, ground to all four edges. Frame left of centre, log deck
and the wheel on the ground running right, matching the finished face. Ridge
inside the upper third; the piece must read across.
```

## tile-warehouse — three cells, square

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
```

## tile-warehouse-site — three cells, square

```text
[PREAMBLE]

The storehouse at plinth and frame. The staddle stones are set and levelled in
their rows, the sill beams and floor joists are across them, and the wall frame
is up on two sides only - open studwork you can see straight through. No boards,
no tar, no doors: the gable hoist beam lies on the ground with its pulley block
beside it. Stacks of tarred board under a weighted sheet, and the loading apron
is bare earth with one crate on it. Wash: cold slate blue on the plinth stones,
ochre on the raw frame and boards, flat.

FRAMING. Square plate, ground to all four edges. The frame fills the middle and
upper page; the apron runs out of the lower edge, matching the finished face.
Nothing in any corner.
```

## tile-granary — three cells, square

```text
[PREAMBLE]

A grain store raised on mushroom-shaped staddle stones with a short ladder up
to a small high door - the gap under the floor is the point of the building
and must be unmistakable. Weatherboarded sides, a steep shingled roof, a
louvred vent in the gable. Two sacks and a scoop at the foot of the ladder.
Wash: ochre on the boards and sacks, cold slate blue on the staddle stones,
grey-green on the ground, flat.

FRAMING. Square plate, ground to all four edges. The store sits high on the
page with clear daylight under its floor; ladder and sacks run down to the
lower edge. Nothing in any corner.
```

## tile-granary-site — three cells, square

```text
[PREAMBLE]

The granary being raised. The staddle stones stand in their grid with the
mushroom caps on and the floor frame laid across them - the gap underneath is
already the clearest thing about it and must read even here. Two walls
weatherboarded, two still open frame. No roof, no ladder up, no vent. The ladder
lies on the grass and the shingles are bundled beside it, and one sack of grain
stands by, waiting. Wash: ochre on the boards and sacks, cold slate blue on the
staddle stones, grey-green on the ground, flat.

FRAMING. Square plate, ground to all four edges. The frame sits high with clear
daylight under its floor; the ladder and sacks run down to the lower edge,
matching the finished face. Nothing in any corner.
```
