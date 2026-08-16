# Places sheets — generation prompts (SET-01 … SET-19)

One sheet per named settlement on the Korvane Reach, in the order and with the
exact names the map prints. Used when play goes *inside* a settlement: a market
visit, a hiring, a brawl, a siege. The rank sets the scale of what is drawn — a
seat is streets and walls, a village is one lane and a well.

Render at **4000 px or better**, A4 landscape proportion. The hexagonal field,
the 61-cell grid, panel rules and all type are overlays added at layout time —
the model draws only the settlement inside a hexagonal composition, and **never
any lettering**: names are set in type later.

Drop finished renders at `docs/minimaps/img/SET-01.png` … `SET-19.png`.

## Shared preamble — paste ahead of every prompt below

```text
A hand-drawn overhead town study on aged parchment, in the style of a
17th-century city-plan plate: fine engraved line, flat muted washes with hard
edges and no blending, warm oatmeal paper, warm near-black ink. The drawing
fills a large regular hexagon, flat side up, centred on the page; outside the
hexagon the parchment is left bare. Seen straight down, buildings drawn as
tiny engraved roof shapes, roads as double lines, water as ruled wave lines.
Lived-in and working: carts, boats, stacked goods drawn small, but no people.

Worn from field use: creases, a thumbed corner, one faint ring stain. Cared
for, not ruined.

Strictly no gradients, no glow, no drop shadow, no soft airbrushed shading, no
photographic texture, no 3D relief. No grid lines, no hex grid, no text, no
letters, no border rule, no compass rose.
```

## Negative prompt — for all nineteen

```text
gradient, glow, bloom, drop shadow, soft shading, airbrush, blur, depth of
field, neon, saturated colours, pure white background, pure black,
photorealistic, 3d render, digital painting, concept art, anime, figures,
people, animals, text, letters, numbers, logo, watermark, hex grid, square
grid, grid lines, frame border, map legend, compass rose
```

## SET-01 — Vossgard *(seat of the Reach)*

```text
[PREAMBLE]

A walled seat of government on open grassland: stone walls with four towers, a
keep and great hall at the centre, dense streets of engraved roofs, a market
square, and TWO railway lines - drawn as hatched double lines - entering
through separate wall gates and meeting at a large rail yard with sheds and
sidings. Washes: pale yellow-green grass outside, warm ochre roofs, grey stone
walls and keep.
```

## SET-02 — Saltreach *(city, harbour)*

```text
[PREAMBLE]

A walled harbour city on a western sea: stone quays enclosing a basin crowded
with drawn ships, warehouses ranked along the waterfront, salt-pans as neat
rectangular pools south of the walls, and streets climbing gently inland.
Washes: slate-blue sea, warm ochre roofs, near-white salt pans.
```

## SET-03 — Port Malchior *(city, harbour, southern railhead)*

```text
[PREAMBLE]

A river-mouth port city: a river entering under a fortified bridge and opening
into a harbour with moles, quays on both banks, a railway - hatched double
line - ending at a terminus with a great curved train shed beside the docks,
cranes and stacked cargo drawn small. Washes: slate-blue water, ochre roofs,
grey stone bridge and moles.
```

## SET-04 — Coldwater *(town)*

```text
[PREAMBLE]

A hardy northern town on a frozen shore: low stone-and-timber houses with
steep roofs huddled against the wind, a small ice-fringed harbour with two
boats hauled out on the shingle, driftwood stacked high, and a lit beacon
tower. Washes: near-white snowy ground, pale slate sea with drawn ice floes,
warm ochre at the beacon and doorways.
```

## SET-05 — Duskmere *(town)*

```text
[PREAMBLE]

A forest town in a clearing of the great western wood: timber houses around a
green, a stockade of upright logs, log ponds and a water-driven sawmill on a
stream, felled trunks stacked by the gate, and the drawn forest pressing close
on every side. Washes: dusty grey-green forest, pale clearing, ochre timber.
```

## SET-06 — Rimegate *(town)*

```text
[PREAMBLE]

A gate-town on the southern shore of a cold northern bay: a fortified
water-gate and short wall closing the neck of land, houses sheltering behind
it, a jetty into grey water, and the tundra running empty to the north.
Washes: near-white ground, pale slate bay, grey stone gate, ochre roofs.
```

## SET-07 — Oldkeep *(town)*

```text
[PREAMBLE]

A town grown in the shell of something older: one half-ruined ancient keep of
cyclopean stone at the centre, its fallen blocks reused in the newer houses
around it, a dry moat now gardens, tundra beyond. The ruin is weathered, not
apocalyptic - laundry lines and lean-tos show it lived in. Washes: grey
ancient stone, ochre roofs, near-white ground.
```

## SET-08 — Kestrel Rock *(town)*

```text
[PREAMBLE]

A watch-town on a wooded crag at a narrow neck of land: houses stepped up the
rock's flank, a watchtower on the summit with a signal brazier, the only wood
for miles drawn thick on the slopes below, and the road squeezing past
between crag and shore. Washes: grey rock, grey-green trees, ochre roofs.
```

## SET-09 — Ironwick *(town)*

```text
[PREAMBLE]

A mining town in bare upland: rows of workers' cottages, a mine head with
winding gear and spoil heaps drawn as hatched cones, ore carts on a short
tramway to ranked furnaces whose chimneys smoke, and the hills scarred with
workings. Washes: warm ochre ground, rust-red furnace roofs, grey spoil.
```

## SET-10 — Thorngate *(town)*

```text
[PREAMBLE]

A road-town at the eastern shore under the mountains: a fortified gate where
the mountain road comes down, one long walled street of inns and stables
running to a small landing on the water, hedges of drawn thorn along every
approach. Washes: grey mountain feet, pale grass, ochre roofs, slate sea.
```

## SET-11 — Brassford *(town)*

```text
[PREAMBLE]

A crossing-town where road and rail meet a river ford: a railway - hatched
double line - ending at a small terminus and goods shed, a paved ford through
the water with stepping-stone piers, a brass-workers' quarter of workshops
with smoking chimneys, warehouses along the bank. Washes: slate-blue river,
ochre roofs, rust-red workshop quarter.
```

## SET-12 — Stagmoor *(town)*

```text
[PREAMBLE]

A moor-edge market town: a wide livestock market square with pens and hurdles
drawn small, drovers' roads converging from every hexagon edge, a squat stone
church, and the open moor rising behind. Washes: pale yellow-green grass,
ochre roofs, grey church stone.
```

## SET-13 — Umber Hollow *(town)*

```text
[PREAMBLE]

A fen town on the only firm ground for miles: houses on a low rise ringed by
reedy marsh, timber causeways raised on posts running out in three
directions, peat stacked in dark ricks, eel traps drawn in the channels.
Washes: dull grey-green fen, slate channels, warm ochre on the dry rise.
```

## SET-14 — Dunhaven *(town, harbour)*

```text
[PREAMBLE]

A desert port between dunes and sea: one long street of flat-roofed ochre
houses behind a sea wall, a harbour of lateen-rigged boats, a caravanserai
courtyard with camels and wagons drawn small, palms at a walled well, sand
drifted against every north wall. Washes: warm ochre sand and roofs,
slate-blue sea, grey-green palms.
```

## SET-15 — Taleowick *(village, harbour)*

```text
[PREAMBLE]

A fishing village on a western isle-coast: a dozen cottages along a shingle
hard, boats drawn up, nets on drying poles, a tiny chapel with a bell-gable
facing the sea - the bell itself missing from its arch - and a stone slipway.
Washes: slate sea, pale grass, ochre roofs, grey chapel.
```

## SET-16 — Fen's End *(village)*

```text
[PREAMBLE]

A small village where firm ground meets the northern fen: one lane of
cottages, a sickhouse with a walled herb garden drawn in neat beds, a
turf-cutters' track running out onto the wet ground, storm-lanterns hung on
posts along it. Washes: pale grass, grey-green fen edge, ochre roofs.
```

## SET-17 — Grist *(village)*

```text
[PREAMBLE]

A mill village in the forest edge south of the great wood: a water-mill with
an oversized wheel on a leat, a millpond, grain sacks and carts in the yard,
a short street of cottages, and the wood standing close behind. Washes:
grey-green trees, slate millpond, ochre roofs and sacks.
```

## SET-18 — Dry Wells *(village)*

```text
[PREAMBLE]

A desert waystation village around two stone well-heads with sweep arms: a
walled courtyard for caravans, water troughs, a few flat-roofed houses, cairns
marking the road's line out across the sand in both directions. Washes: warm
ochre sand, grey well stone, one improbable grey-green garden patch.
```

## SET-19 — Redmare *(village)*

```text
[PREAMBLE]

A horse-breeders' village on the eastern shore grass: paddocks fenced in
drawn rails spreading up the slope, a long stable range bigger than any
house, a smithy with smoke, and a beach where horses are exercised at the
water's edge - hoof-lines drawn in the sand. Washes: pale yellow-green
grass, ochre roofs, slate sea.
```
