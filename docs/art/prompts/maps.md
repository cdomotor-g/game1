# The maps — whole drawn plates (`korvane-reach`, `sundering-isles` …)

One full plate per board, drawn as a page from a **17th-century printed atlas**:
engraved coastline, hand-lettered place names, a decorative border rule, a title
cartouche, a compass rose and a legend panel. The plate is the artwork; the hex
grid is an overlay drawn on top of it at read time and is **never** part of the
drawing.

A map plate is judged by a second standard the card plates are not: it has to
**hex cleanly afterwards**. `tools/trace-map.mjs` samples the artwork under every
hex and proposes a terrain for it, and every rule below about flat washes and cold
water exists to make that step work rather than to make the picture prettier. The
full pipeline is [`../../map/README.md`](../../map/README.md); the handover is
[`../../MINT.md`](../../MINT.md).

**A brief on this page is written from the map's `commission` block in
`data/maps/<id>.json` and from nothing else.** If the two disagree, the commission
is right and this page is stale. The commission is the contract — what the map is
for, what country it is, what the terrain budget is, how many settlements of what
rank — and `node tools/mint-queue.mjs` checks that it is complete before anybody
is asked to draw anything.

Render **landscape**, root-two proportion, **4000 px on the long side minimum** —
7000 if the map is ever to be printed at A1. Ask for the width before anything
else: it is the one property of a plate that cannot be recovered later.

## Shared preamble — paste ahead of every prompt below

```text
A hand-drawn fantasy region map on aged parchment, in the style of a
17th-century printed atlas plate: fine engraved coastline, hand-lettered
place names in a serif face, a decorative border rule, a title cartouche
in one corner, a compass rose, a scale bar in leagues, and a legend
panel in another corner.

Flat muted washes of colour with hard edges and no blending: dusty
grey-green for woodland, pale yellow-green for open grass, warm ochre
for sand and dry country, near-white for ice and tundra, muted slate
blue for the sea, with the shallows a lighter tint of the same blue than
the deep water. Paper is warm oatmeal, never white. Line is warm
near-black, never pure black.

Landforms are drawn as repeated small engraved glyphs on top of the
wash: hatched triangular peaks for mountains, small arcs for hills, tiny
conifers and round-topped trees for forest, low tufts for tundra,
horizontal tufts for marsh, loose crescents for dunes. Rivers are thin
cold-blue lines running from high ground to the sea. Roads are thin
double lines, railways are hatched lines.

Strictly no gradients, no glow, no drop shadow, no soft airbrushed
shading, no photographic texture, no 3D relief or hillshading.
```

## Negative prompt — for every map

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
contrast, movie poster, book cover, hillshading, terrain relief shading,
satellite imagery, contour lines, depth soundings, grid lines, hex grid,
square grid, latitude longitude lines, modern typography, sans-serif
labels, national borders, political colouring, minimap, game UI, frame
border with figures
```

`hex grid` is in there deliberately. **Never ask for a grid on the plate.** The
grid is an overlay drawn from the board; a grid baked into the artwork cannot be
moved, cannot be resized when `cols` changes, and will not line up with the one the
tools draw.

## The TRACEABILITY block — every map prompt carries one

The map line's equivalent of a card prompt's `FRAMING.` block. A card plate is
cropped by machine, so its brief has to say where the subject sits; a map plate is
*read* by machine, so its brief has to say what will be readable. Both are about
what happens to the drawing afterwards, and both are the part that gets left out.

Seven rules, from [`../../map/README.md`](../../map/README.md), written out
specifically for the map in hand:

1. **Landscape, root-two, and as large as possible.** 4000 px wide is the working
   minimum; 7000 is what A1 wants.
2. **Flat washes, hard edges.** Every gradient, glow or hillshade is a region the
   sampler reads as two terrains, or as one it has no name for.
3. **One wash per terrain, and no two terrains sharing one.** This is the rule the
   Korvane Reach's plate breaks — its fens and its desert are the same ochre — and
   it cost the most hand-correction of anything on that map.
4. **Water colder than every land colour.** The tracer separates sea from land by
   red-versus-blue, and it is the one test on the whole plate that never misfires.
5. **Keep display lettering off the terrain you care about.** `THE AMBER STEPPE`
   in serif capitals a centimetre tall grew a mountain range across flat
   grassland, because to a sampler that is about as inky as a hatched peak.
6. **Map furniture in the corners, over water.** A cartouche over open sea costs
   nothing; one over a coastline hides the coastline, and no amount of voting from
   the ring of hexes around it will tell you where that coastline ran.
7. **A plain frame with a visible inner rule.** That rule is what `plate.field` is
   measured from, and every position in the board is a fraction of it.

---

## sundering-isles — The Sundering Isles *(commissioned)*

Commission: [`data/maps/sundering-isles.json`](../../../data/maps/sundering-isles.json).
The second board, and the opposite of the Korvane Reach: no continent, more water
than land, and nothing walkable end to end. It exists to make the shipping half of
the economy the half that matters.

```text
[PREAMBLE]

A warm archipelago charted on one plate. No continent: three loose chains of
islands running north-east to south-west across a broad shallow sea, none of
the chains touching. The largest island is about a sixth of the frame and
carries a single hatched volcanic peak; nothing else on the plate rises above
a few small arcs of hills. Every other island is small enough to read as one
place — a bay, a headland, a village and its anchorage.

A long reef chains two of the groups together, drawn as a distinct paler tint
of the sea blue with fine engraved stipple along it, unmistakably shallower
than the water on either side. Open deep water in the darker blue fills the
south and east edges. Along the north edge a shelf of the same paler shallow
runs off the top of the frame, so the plate reads as being south of somewhere.

Fourteen settlements, hand-lettered in a serif face: one walled seat on the
largest island, one town where the reef chain meets deep water, and the rest
villages and small ports. Twelve of them are drawn on the water's edge with a
small engraved anchorage — a mole, a jetty, two hulls at rest. Thin double
lines for the few island roads. No railway anywhere on the plate.

Vegetation is drawn as round-topped trees on the larger islands, low grass
tufts on the smaller, and horizontal tufts for a marsh behind one lagoon. One
small ochre sand-flat on a single southern island, and that ochre appears
nowhere else on the plate.

Title cartouche in the lower left over open water; legend panel in the lower
right over open water; compass rose upper left over open water. Scale bar in
leagues. A plain double border rule with a clear inner line.

TRACEABILITY.
Landscape, root-two proportion, 4000 px wide minimum, 7000 preferred.
Flat washes with hard edges only — no gradient, no hillshading, no depth
soundings, no relief.
One wash per terrain. The marsh wash must be grey-green and must NOT be the
same ochre as the sand-flat; those two sharing a colour is the single most
expensive mistake this style makes.
The reef must be a visibly different, paler blue from both the deep water and
the ordinary shallows.
Sea colours colder than every land colour, everywhere.
All display lettering — the sea names, the chain names — over open water only.
Never over an island.
Cartouche, legend and compass over open water only, never over an island and
never over the reef.
No grid of any kind. No hex grid, no square grid, no ruled lines over the
field.
```

**Save to** `docs/map/sundering-isles.png`. If the wording had to change to get an
acceptable render, freeze what was actually used as
`docs/map/sundering-isles.txt`.

**Then** go to step 2 of [`../../map/README.md`](../../map/README.md) and keep
going. A plate is not finished when the picture looks right; it is finished when
`validate-map.mjs` is clean and the proof sheet matches the drawing.

---

## korvane-reach — The Korvane Reach *(minted)*

> ⛔ **ALREADY DRAWN — DO NOT DRAW THIS.** `docs/art/renders/korvane-reach.png` is in the repository and accepted. Redrawing it wastes the run; take one marked WAITING instead.

Kept for reference: this is the brief the current plate was drawn to, and it is
the plate every rule on this page was learned from. Its commission block was
written after the fact — see the `$comment` in
[`data/maps/korvane-reach.json`](../../../data/maps/korvane-reach.json).

```text
[PREAMBLE]

One landmass filling most of the frame, with open sea on at least two edges, a
deeply indented coastline, offshore islands, an inland lake or two, one
mountain range crossing the interior running south-east from the western sea
to the eastern shore, and fifteen to twenty settlements varying from a walled
city to a village.

An ice waste along the top edge in near-white, and a second across the northern
bay. A temperate wooded west in dusty grey-green. A dry ochre south. Two
railways, hatched, meeting at one inland seat.

TRACEABILITY.
Landscape, root-two proportion, 4000 px wide minimum.
Flat washes, hard edges, one wash per terrain.
Water colder than every land colour.
Display lettering over sea or ice only.
Cartouche, legend and compass in the corners over water.
A plain frame with a visible inner rule.
No grid of any kind.
```

**What went wrong with it, and is worth not repeating:**

- It arrived at **1491 px** wide. That is 46 dpi at A1 and it cost the two larger
  print presets permanently. Everything in `data/maps/*.json` is a fraction of
  `plate.field` precisely so a third plate at 4000 px would be a one-file change;
  nothing else protects you from a small one.
- Its **fens and its desert are the same ochre**, drawn with the same glyph.
  Nothing in the pixels can separate them; only the label can, and the label is
  prose. That single collision is why rule 3 is a rule.
- Its key was drawn when the game had twelve terrains and the game now has ten, so
  the overlay **replaces** the legend panel rather than reprinting it. That is a
  correction, not a preference — and it is why the panel has to be listed in
  `plate.occlusions` either way.
