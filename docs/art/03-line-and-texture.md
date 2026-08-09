# 03 — Line and texture

How the ink plate is actually drawn. Everything here happens in one colour, `#1A1714`.

## Silhouette first

A commodity chit is about 18mm across. A worker meeple is 15mm tall. Most art in this game
is read at a size where interior detail is noise.

> **The squint test.** Reduce the asset to 18mm, fill it solid black, and look at it next
> to five others. If you cannot tell which is which, no amount of detail will save it —
> the shape is wrong, and detail is not the fix.

Silhouettes get separated by **proportion, not by ornament**. Exaggerate the one feature
that identifies the object and shrink everything else:

- A pick is 70% head, 30% handle. A real pick is the reverse.
- A barrel is wider than it is tall.
- A sack slumps; a crate never does.
- A furnace is a squat mass with a tiny mouth.
- A loom is all frame and no cloth.

This exaggeration is the single biggest driver of the "chunky fantasy object" register the
brief asked for, and it costs nothing at print size.

## Line weights

Four weights, at final print size. Do not invent a fifth.

| Weight | Size | Used for |
|---|---|---|
| **Contour** | 0.5mm | The outside edge of the whole object |
| **Structure** | 0.3mm | Edges between major parts — a barrel's staves, a blade meeting a haft |
| **Detail** | 0.2mm | Interior marks: rivets, stitching, grain, notches |
| **Hatch** | 0.15mm | Shading and category fills only |

The heavy outer contour is doing most of the work. It is what makes an object sit on the
page, what survives a photocopy, and what carries the register the brief called for. It
should be **noticeably heavier than anything inside it** — if the contour and the interior
detail are the same weight, the drawing goes flat and muddy at size.

Line is **not uniform**. A drawn line thickens where two forms meet, where the object
touches the ground, and on the side away from the light. It thins and can break entirely
on a lit top edge. A line of constant width reads as clip art.

**Corners fill in.** Where lines meet at an acute angle, let the ink pool slightly — a
small solid wedge in the crook. This is what over-inked letterpress actually does, it is
free, and it is one of the strongest signals of the whole aesthetic.

## Hatching

All shading is hatch. No gradients, no stipple-shading with soft edges, no grey fills that
are not built from marks.

Four kinds, in order of how much you should use them:

1. **Contour hatch** — lines that follow the form's curvature. The default. This is what
   gives a barrel its roundness.
2. **Cross-hatch** — a second pass at 60–90° for the darkest areas. Use sparingly; it is
   the only way to get near-black without a solid fill.
3. **Parallel hatch** — straight lines at a consistent angle, for flat planes and cast
   shadow.
4. **Stipple** — dots, for soft or granular materials: flour, soil, wool, fur.

Rules:

- **One hatch angle per plane.** Changing angle mid-surface reads as a different material.
- **Hatch density steps, it does not blend.** Three levels — light, mid, dark — with
  visible boundaries. Smooth density falloff is an airbrush wearing a disguise.
- **Leave the lit face bare.** The single most common failure is hatching everything. Bare
  paper is a value, and it is the brightest one available.
- **Light comes from the upper left**, consistently, on every asset in the game.

## Material vocabulary

Each material has one signature mark. Use it and nothing else — this is what makes assets
drawn by different hands cohere.

| Material | Mark |
|---|---|
| Sawn timber | Long grain lines, knots as closed ovals, visible end-grain rings on cut ends |
| Rough timber | Bark as short broken vertical dashes, irregular contour |
| Iron / steel | Sparse contour hatch, one bright unhatched highlight band, hammer dimples |
| Stone | Angular chipped contour, cross-hatch in recesses, no smooth curves |
| Fired clay / brick | Slightly wobbling outline, stipple texture, chipped corners |
| Cloth | Parallel folds converging on a stress point, frayed edge dashes |
| Rope | Repeating chevrons along the length, never a plain cylinder |
| Leather | Sparse stipple, stitch dashes along every seam, rolled edges |
| Glass | Bare paper with only a contour and two straight highlight slashes |
| Grain / flour | Dense stipple, no contour hatch at all |
| Water | Horizontal broken lines, closer together with depth, never a wave outline |
| Fire | Solid black tongues with bare paper gaps — negative space is the flame |

## Wear

Nothing in this world is new. Wear is also a mechanic — tools break — so it must be
legible rather than decorative.

Apply in this order, and stop as soon as the object reads as used:

1. **Break the contour.** A chip out of a blade, a rounded-off corner, a dented rim. One
   or two per object, never symmetrical.
2. **Add a repair.** A binding of wire, a riveted patch, a lashing, a replaced handle in a
   different material. A repair says the object is valued, which is the tone we want.
3. **Wear the working surface.** The part that does the job is polished — meaning *less*
   hatch, not more. A well-used axe has a bright edge and a dull body.
4. **Stain the rest.** Only now, and only lightly.

> Wear the object where a person would touch it and where it does its work. Wear that is
> distributed evenly reads as damage; wear that is concentrated reads as use.

**Tool durability** is drawn as notches on the haft — a filled notch is a spent point.
This is the [tally motif](00-art-direction.md#motifs) doing double duty as a component
readout, and it means a tool card's condition can be read without a marker.

## Grime

The most-abused part of this style, so it has the hardest rules.

> **Grime is on the paper and the press. It is never on the object.**

Mud painted onto a barrel means every asset gets its own dirt, at its own strength, from
its own brush, and the game gets noisier with every piece added. Grime applied to the
whole page is consistent for free, never competes with the linework, and is a single knob
to turn during production.

It is a separate layer, `grime`, applied last, at one strength across the whole component.

**The permitted repertoire** — press and paper artefacts only:

- Uneven ink coverage: one corner over-inked and filling in, the opposite corner starved
- Plate edge marks where the block met the paper
- A ring where a cup sat
- Foxing and edge-darkening on the paper
- A thumbprint, once — in a corner, not on the subject
- A crease with wear along its length
- Ink smudge trailing off a heavy mark, in the direction of the press
- Fibre flecks and specks in the paper stock itself

**Never:**

- Blood spatter, slime, or "gritty" texture brushes
- Scratches across the whole image at a random angle
- A sepia photo filter
- Dirt that makes rules text harder to read — grime yields to type, always
- Noise at a strength that survives at thumbnail size

**Strength:** 4–8% opacity for broad artefacts, up to 15% for a single focal mark such as
a thumbprint. If a viewer notices the grime before they notice the subject, it is at least
twice too strong.

**Density:** grime is heaviest at edges and corners, lightest in the middle where the
information is. Cards are handled at their edges; that is where the wear goes.

## Composition

- **One subject per asset.** A commodity chit shows the commodity. Not the commodity in a
  scene, not the commodity being used.
- **Objects sit on a ground line**, even a two-inch dash of one. Objects floating in white
  space read as clip art.
- **Three-quarter view** for anything with volume. Straight-on for anything that reads as
  a symbol.
- **Fill the frame.** Leave the margin the component spec asks for, then use everything
  inside it. Timid small drawings in large frames are the most common weakness in a set
  like this.
- **Asymmetry.** A perfectly symmetrical object looks manufactured, which contradicts
  everything in [rustic](00-art-direction.md#rustic--owns-the-construction). Tilt it,
  chip one side, or let one strap sit lower than the other.
