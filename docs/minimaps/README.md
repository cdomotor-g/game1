# Mini-maps

Some moments need more board than a single hex: a battle, a monster encounter, a
farm growing into a walled town. Those moments zoom in — one cell of the
campaign map opens out onto a **mini-map**, play happens inside it, and the
result is written back to the big map.

A mini-map is an **A4 landscape sheet**. One large regular hexagon dominates the
middle of the page — the inside of a single campaign-map cell — flanked by two
working panels in the space a hexagon on a rectangle leaves over.

## The sheet, exactly

| Property | Value |
| --- | --- |
| Paper | A4 landscape, 297 × 210 mm, 8 mm margin |
| Field | One regular hexagon, flat side up, 194 mm across the flats — as large as A4 allows |
| Cells | The field subdivides into a hex board 5 cells on a side: 61 cells, ~22 mm each, big enough to stand a meeple in |
| Left panel | **Encounter tracker** — initiative order, round count, morale boxes |
| Right panel | **Holdings ledger** — buildings, garrison, stores on this ground |
| Footer | The sheet's code, its campaign-map cell (written in when placed), and the terrain letter code |

Both panels print on every sheet, so no sheet is ever the wrong sheet: a battle
uses the left panel and ignores the right; a settlement lives out of the right
panel and only needs the left the day it is attacked.

**The cell grid is an overlay, exactly as on the campaign map.** The artwork
fills the hexagonal field with terrain and features; the 61-cell grid, the
panels' rule lines and all type are drawn on the ink plate at layout time. Never
ask an image model for the grid — see the same rule, for the same reasons, in
[`docs/map/README.md`](../map/README.md).

## The three series

| Series | Sheets | Used for | Lifetime on the table |
| --- | --- | --- | --- |
| **Holdings** | 4 (`PSM-01` … `PSM-04`) | A player's farm → village → town, built cell by cell | In front of the player, possibly all game |
| **Grounds** | 9 (`TBM-01` … `TBM-09`) | Battles and encounters in the open — one sheet per land terrain, plus the shallows for boarding actions | Out for the fight, then away |
| **Places** | 19 (`SET-01` … `SET-19`) | Play inside a named Korvane Reach settlement | Out while visiting |

A Holdings sheet starts almost empty — the terrain of the cell it is placed on,
nothing else — and fills with building markers as the player builds. A Grounds
sheet is scenery: cover, obstacles, a road or a stream to fight over. A Places
sheet is a portrait of somewhere specific: Vossgard's yards where the two rail
lines meet, Dunhaven's one street between the dunes and the sea.

## Rendering the artwork

Generation prompts, one per sheet, live in [`prompts/`](prompts/):

- [`holdings-sheets.md`](prompts/holdings-sheets.md) — the four player sheets
- [`terrain-sheets.md`](prompts/terrain-sheets.md) — the nine battle grounds
- [`korvane-settlements.md`](prompts/korvane-settlements.md) — the nineteen places

Rendered images land beside this file as `img/<code>.png` (e.g.
`img/TBM-03.png`), at 4000 px wide or better — the same "ask for the width
first" rule as map plates. Every prompt already carries the art brief's preamble
and negative prompt; read [`docs/art/07-ai-agent-brief.md`](../art/07-ai-agent-brief.md)
before regenerating any of them, and run renders past its acceptance checklist.

## The sheets, as accepted

All thirty-two artworks are in. The grid, panels and type are still added at
layout time — these are the fields the grid goes over.

### Holdings (PSM-01 … PSM-04)

| | | | |
| --- | --- | --- | --- |
| ![PSM-01](img/PSM-01.png) | ![PSM-02](img/PSM-02.png) | ![PSM-03](img/PSM-03.png) | ![PSM-04](img/PSM-04.png) |
| *PSM-01 The River Meadow* | *PSM-02 The Wood Shore* | *PSM-03 The High Field* | *PSM-04 The Fen Edge* |

### Grounds (TBM-01 … TBM-09)

| | | |
| --- | --- | --- |
| ![TBM-01](img/TBM-01.png) | ![TBM-02](img/TBM-02.png) | ![TBM-03](img/TBM-03.png) |
| *TBM-01 Grassland* | *TBM-02 Forest* | *TBM-03 Hills* |
| ![TBM-04](img/TBM-04.png) | ![TBM-05](img/TBM-05.png) | ![TBM-06](img/TBM-06.png) |
| *TBM-04 Mountain* | *TBM-05 Marsh* | *TBM-06 Tundra* |
| ![TBM-07](img/TBM-07.png) | ![TBM-08](img/TBM-08.png) | ![TBM-09](img/TBM-09.png) |
| *TBM-07 Desert* | *TBM-08 Coast* | *TBM-09 The Shallows* |

### Places (SET-01 … SET-19)

| | | |
| --- | --- | --- |
| ![SET-01](img/SET-01.png) | ![SET-02](img/SET-02.png) | ![SET-03](img/SET-03.png) |
| *SET-01 Vossgard* | *SET-02 Saltreach* | *SET-03 Port Malchior* |
| ![SET-04](img/SET-04.png) | ![SET-05](img/SET-05.png) | ![SET-06](img/SET-06.png) |
| *SET-04 Coldwater* | *SET-05 Duskmere* | *SET-06 Rimegate* |
| ![SET-07](img/SET-07.png) | ![SET-08](img/SET-08.png) | ![SET-09](img/SET-09.png) |
| *SET-07 Oldkeep* | *SET-08 Kestrel Rock* | *SET-09 Ironwick* |
| ![SET-10](img/SET-10.png) | ![SET-11](img/SET-11.png) | ![SET-12](img/SET-12.png) |
| *SET-10 Thorngate* | *SET-11 Brassford* | *SET-12 Stagmoor* |
| ![SET-13](img/SET-13.png) | ![SET-14](img/SET-14.png) | ![SET-15](img/SET-15.png) |
| *SET-13 Umber Hollow* | *SET-14 Dunhaven* | *SET-15 Taleowick* |
| ![SET-16](img/SET-16.png) | ![SET-17](img/SET-17.png) | ![SET-18](img/SET-18.png) |
| *SET-16 Fen's End* | *SET-17 Grist* | *SET-18 Dry Wells* |
| ![SET-19](img/SET-19.png) | | |
| *SET-19 Redmare* | | |
