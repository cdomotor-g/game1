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

**A label band crosses the piece.** A solid strip carrying the tile's name is
printed across it, edge to edge, and whatever is under it is gone. The exact
band is worked out per tile and arrives appended to the prompt as `LABEL BAND` —
follow that, not a guess. Compose so it lands on ground, wall or sky.

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

Render at 2000 px on the long side or better. Square for one-, three- and
four-cell tiles; 3:2 landscape for two-cell tiles. Each brief says which.

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
gradient, glow, bloom, lens flare, drop shadow, soft shading, airbrush, blur,
depth of field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, octane, unreal engine, digital painting, oil
painting, concept art, anime, chibi, cute, cel shaded, isometric video game
asset, sparkles, magic particles, watermark, signature, text, letters,
numerals, signage, logo, UI, frame border, vignette, hex grid, square grid,
ruled lines, horizon, sky, clouds, background scenery, distant mountains,
people, figures, crowd, heroic, grimdark, ruined, apocalyptic, overgrown,
abandoned, cutaway, floor plan, blueprint, elevation drawing
```

---

# Housing

## tile-hut — one cell, square

```text
[PREAMBLE]

A single-room hut of stacked logs under a steep turf roof, low enough that a
tall man would stoop at the door. One doorway, no window, a stovepipe of
mortared stone through the ridge with a thread of smoke. A chopping block
and three split rounds by the door; a beaten path to it through rough grass.
Wash: ochre on the turf roof, grey-green on the grass, flat.

FRAMING. Square plate, ground to all four edges. The hut sits in the upper
half of the page with its path running down out of the lower edge. Nothing
in any corner.
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
