# Grounds sheets — generation prompts (TBM-01 … TBM-09)

The battle grounds: one sheet per land terrain, plus the shallows for boarding
actions. Pulled out when a discovery roll turns up a monster or bandits and the
table wants positioning; put away when the fight is done. The artwork's job is
**scenery worth fighting over** — cover, obstacles, high ground, a line of
retreat — in the terrain named on the sheet.

Each sheet's footer (added at layout time) carries its code and the terrain's
letter code, so "we're on H" reaches for one sheet. Render at **4000 px or
better**, A4 landscape proportion. The hexagonal field, the 61-cell grid,
panel rules and all type are overlays — the model draws only the ground inside
a hexagonal composition.

Drop finished renders at `docs/minimaps/img/TBM-01.png` … `TBM-09.png`.

## Shared preamble — paste ahead of every prompt below

```text
A hand-drawn overhead terrain study on aged parchment, in the style of a
17th-century military surveyor's plate: fine engraved line, flat muted washes
with hard edges and no blending, warm oatmeal paper, warm near-black ink.
The drawing fills a large regular hexagon, flat side up, centred on the page;
outside the hexagon the parchment is left bare. Seen straight down. The ground
is drawn for a skirmish: scattered cover, one or two obstacles, a clear route
across - varied, readable, nothing crowding the middle.

Worn from field use: creases, a thumbed corner, one faint spatter of old ink.
Cared for, not ruined.

Strictly no gradients, no glow, no drop shadow, no soft airbrushed shading, no
photographic texture, no 3D relief. No grid lines, no hex grid, no text, no
letters, no buildings, no figures, no border rule.
```

## Negative prompt — for all nine

```text
gradient, glow, bloom, drop shadow, soft shading, airbrush, blur, depth of
field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, digital painting, concept art, anime, buildings,
houses, town, figures, people, animals, monsters, text, letters, numbers,
logo, watermark, hex grid, square grid, grid lines, frame border, compass rose
```

## TBM-01 — Grassland (G)

```text
[PREAMBLE]

Open grass with a shallow sunken lane crossing the middle, a field boundary of
scattered stones, and two clumps of gorse for cover. Washes: pale yellow-green
grass, warm ochre on the bare lane.
```

## TBM-02 — Forest (F)

```text
[PREAMBLE]

Dense mixed woodland with a natural clearing off-centre, one fallen giant of a
tree crossing it, and a narrow deer path winding edge to edge. Washes: dusty
grey-green canopy drawn as clustered round-topped trees, pale grass in the
clearing.
```

## TBM-03 — Hills (H)

```text
[PREAMBLE]

Broken upland: three stepped shelves of ground rendered as engraved hatched
scarps, a dry gully between them, loose scree in one corner and a single
standing stone on the highest shelf. Washes: warm ochre ground, grey stone.
```

## TBM-04 — Mountain (M)

```text
[PREAMBLE]

A high pass between two hatched rock walls, the path pinching to a defile at
the centre, a scatter of fallen boulders for cover and a black cave mouth low
in one wall. Washes: cold grey stone, one near-white patch of old snow.
```

## TBM-05 — Marsh (B)

```text
[PREAMBLE]

Reedy fen crossed by one raised plank causeway, open black-water pools either
side, tussock islands of firm ground, and a leaning dead willow. Washes: dull
grey-green reeds, slate-dark water, ochre on the dry causeway planks.
```

## TBM-06 — Tundra (T)

```text
[PREAMBLE]

Frozen flat ground drawn with low engraved tussocks, a wind-carved snowdrift
ridge crossing one half, a frozen melt-pool of grey ice, and a ring of old
fire-stones from some traveller's cold camp. Washes: near-white ground, pale
slate ice, one warm ochre note at the dead fire.
```

## TBM-07 — Desert (D)

```text
[PREAMBLE]

Dry sand and gravel with a crescent dune curling across one corner, a wind-cut
rock pillar casting no shadow, the picked skeleton of a large animal, and one
dry watercourse crossing the ground. Washes: warm ochre sand, paler ochre in
the watercourse.
```

## TBM-08 — Coast (C)

```text
[PREAMBLE]

A curved shoreline cutting the hexagon into beach and shallows: wet sand with
drawn ripple lines, a groyne of weathered timber posts, one beached and
half-broken rowing boat, and rocks exposed at the waterline. Washes: warm sand,
light slate-blue shallows darkening away from shore.
```

## TBM-09 — The Shallows (S)

```text
[PREAMBLE]

Open shallow water for a boarding action: drawn wave lines throughout, one
sand bar breaking the surface off-centre, a submerged reef rendered as a
darker slate shape under the water lines, and floating wreckage - a spar, a
crate, a torn sail. Washes: light slate-blue water, darker slate over the
reef, warm sand on the bar.
```
