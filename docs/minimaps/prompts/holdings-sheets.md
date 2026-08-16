# Holdings sheets — generation prompts (PSM-01 … PSM-04)

Four sheets, one per player. Each is a near-empty stretch of good ground a
settlement could grow on — the artwork is the *land*, because the buildings
arrive as markers during play. The four differ only in character, so a table of
four players can tell their sheets apart at a glance.

Render at **4000 px wide or better**, A4 landscape proportion (1.414:1). The
hexagonal field, the 61-cell grid, panel rules and all type are added at layout
time — the model draws only the countryside inside a hexagonal composition.

Drop finished renders at `docs/minimaps/img/PSM-01.png` … `PSM-04.png`.

## Shared preamble — paste ahead of every prompt below

```text
A hand-drawn overhead landscape study on aged parchment, in the style of a
17th-century estate surveyor's plate: fine engraved line, flat muted washes
with hard edges and no blending, warm oatmeal paper, warm near-black ink.
The drawing fills a large regular hexagon, flat side up, centred on the page;
outside the hexagon the parchment is left bare. Seen straight down, like a
field sketched from a church tower. The land is open and buildable: this is
ground waiting for a farm, not a wilderness. A few surveyor's marks - a
measuring chain, a corner stake, a bench mark - hint at intent.

Worn from field use: soft creases, a thumb-smudge of ink at one edge, a faint
tea-ring stain. Cared for, not ruined.

Strictly no gradients, no glow, no drop shadow, no soft airbrushed shading, no
photographic texture, no 3D relief. No grid lines, no hex grid, no text, no
letters, no compass rose, no border rule.
```

## Negative prompt — for all four

```text
gradient, glow, bloom, drop shadow, soft shading, airbrush, blur, depth of
field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, digital painting, concept art, anime, buildings,
houses, castle, town, roads, figures, people, animals, text, letters, numbers,
logo, watermark, hex grid, square grid, grid lines, frame border, map legend,
compass rose
```

## PSM-01 — The River Meadow

```text
[PREAMBLE]

Open grassland crossed by one lazy stream with a gravel ford, a single old oak
standing alone, and a low rise in the north-east corner. Washes: pale
yellow-green grass, cold slate-blue water, one warm ochre patch of dry earth
by the ford. The stream enters one hexagon edge and leaves by another.
```

## PSM-02 — The Wood Shore

```text
[PREAMBLE]

Open grass along a lake edge that cuts across one corner of the hexagon, with
a birch spinney of a dozen trees at the opposite corner and a stony beach
between water and grass. Washes: pale yellow-green grass, dusty grey-green
trees, slate-blue water a shade lighter at the shore.
```

## PSM-03 — The High Field

```text
[PREAMBLE]

Rolling upland grass with exposed stone breaking the turf in three places, a
dry stone-strewn gully crossing one corner, and low hill shading rendered
only as engraved hatching, never as soft relief. Washes: pale yellow-green
grass, warm ochre on the bare stone and gully.
```

## PSM-04 — The Fen Edge

```text
[PREAMBLE]

Firm grassy ground shading into reedy wet fen along two edges of the hexagon,
with a winding line of drier tussocks crossing the wet part like natural
stepping stones, and one gnarled willow. Washes: pale yellow-green grass,
dull grey-green reeds and wet ground, one thin slate-blue channel of open
water.
```
