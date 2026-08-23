# Mini-maps

Some moments need more board than a single hex: a battle, a monster encounter, a
farm growing into a walled town. Those moments zoom in — one cell of the
campaign map opens out onto a **mini-map**, play happens inside it, and the
result is written back to the big map.

## A mini-map is a colour, a pattern and a grid

That is the whole specification, and it replaced a drawn one. **No render, no
plate.** The field is one hexagon of hexagonal cells filled with the colour that
terrain already prints in, with that terrain's own **map mark** scattered across
the cells, the grid ruled on top, and two working panels either side. Nothing
else is on the sheet.

Which means a mini-map needs **no plate, no artist, no framing entry and no place
in the mint queue.** It is generated: `node tools/build-minimaps.mjs` writes one
sheet per terrain into [`sheets/`](sheets/) from
[`data/minimap.json`](../../data/minimap.json) (what the sheets are for),
[`data/components.json`](../../data/components.json) `minimap` and
`marks.terrain` (how they are drawn) and
[`data/terrain.json`](../../data/terrain.json) (which terrains exist, and what
each one's mark is). The rendered index is [`index.html`](index.html).

### The pattern, and why it took a second go

These sheets were a flat colour and nothing else. The argument was that drawn
ground competes with the pieces standing on it, and every one of these sheets is
a sheet somebody is standing pieces on. That argument is half right: a *drawn*
sheet competes. A grass tuft at a third of a cell, on the ink plate, at a third
of full strength does not — and it does the one thing the flat colour could not
do on its own, which is say which ground this is from across the table. It says
it in the black-and-white edition too, where there is no colour on the sheet at
all.

The marks are **the world map's own**. A terrain carries one as data
(`terrain.json terrains[].mark`) exactly as an element carries its mark, and
`components.json marks.terrain` says how heavy the line is and how thickly to
scatter it — three to a cell, on a small triangle about the centre, nudged by a
fraction of their own size and never reaching a grid line. So the ground on a
mini-map and the ground in the campaign map's legend swatch trace one path and
cannot drift apart.

Why the colour is still flat underneath it: drawn ground competes with the pieces
standing on it, and every one of these sheets is a sheet somebody is standing
pieces on. The colour comes from
`docs/art/palette.json` `terrain[].wash` rather than from `terrain.json`'s
`colour` — the palette's is the *printed* one and is already a tint, because
terrain is the largest printed area in the game and a mini-map field is the
largest area of all.

## The cell is a world hex — exactly

This is the decision the rest follows from. A mini-map cell is the same size as a
hex on the campaign map, read off that map's own print preset rather than chosen
here: **16.7 mm** on the Korvane Reach at its default four-sheet layout. So a
figure based for the big board stands in a mini-map cell without being re-based,
a route token cut for one fits the other, and one ruler measures both. Print the
map at a bigger preset and these sheets follow it.

The scale is a fiction — the ground inside one hex is not sixty-one hexes of
ground — and it is the right fiction, because everything *physical* about the two
boards agrees.

## The sheet, exactly

| Property | Value |
| --- | --- |
| Paper | A4 landscape, 297 × 210 mm, 8 mm margin |
| Field | A hexagon of hexes, 5 cells to a side: 61 cells, 9 across, 150 × 135 mm |
| Cell | The world hex — 16.7 mm across the flats at the default preset |
| Edge | Traced, not drawn: every cell edge with no cell on the other side of it |
| Cells named | A1 … I5 — a row letter and a cell number in the corner of every cell |
| Left panel | **Encounter** — order of acting, round count, morale boxes |
| Right panel | **Holdings** — what is built here, the garrison, the stores |
| Footer | The terrain and its letter code, and a ruled blank for the map hex |

Both panels print on every sheet, so no sheet is ever the wrong sheet: a battle
uses the left panel and ignores the right; a settlement lives out of the right
panel and only needs the left the day it is attacked.

**The grid is ruled at layout time, never drawn by an image model** — the same
rule, for the same reasons, as [`docs/map/README.md`](../map/README.md).

## Why the grid is hexagonal

For the record. The grid is hexagonal rather than square **to give movement more,
and more equal, options**: a hex has six neighbours and every one of them is the
same distance away, where a square has four at one distance and four more at root
two, so a square grid either lies about its diagonals or forbids them. Six equal
exits is what makes a route a choice rather than a staircase. The cost is that a
hex grid is harder to draw; `tools/lib/hexgrid.mjs` pays it once. A mini-map's
grid is hexagonal for that reason plus one more: a cell has to line up with a
world hex.

---

# The drawn sheets that came before

> **Shelved — [#18](https://github.com/cdomotor-g/game1/issues/18).** Everything
> below describes the *drawn* mini-maps, which were part of the tile-based board.
> Nothing here is deleted or regenerated: all 32 accepted artworks stay committed
> and stay on the site, and this stays as the spec they were drawn to. **No
> further sheets are commissioned.** The generated sheets above supersede them for
> play and are not blocked on [#10](https://github.com/cdomotor-g/game1/issues/10),
> because they need no art at all. The mint reports the shelved line every run —
> see [`../MINT.md`](../MINT.md).

A drawn mini-map was an **A4 landscape sheet**: one large regular hexagon
dominating the middle of the page — the inside of a single campaign-map cell —
flanked by two working panels, with the terrain and its features *painted* into
the hexagonal field and the 61-cell grid ruled over the top.

| Property | Value |
| --- | --- |
| Paper | A4 landscape, 297 × 210 mm, 8 mm margin |
| Field | One regular hexagon, flat side up, 194 mm across the flats |
| Cells | 61 cells, ~22 mm each — chosen for the sheet, not matched to the world hex |
| Left panel | Encounter tracker |
| Right panel | Holdings ledger |
| Footer | The sheet's code, its campaign-map cell, and the terrain letter code |

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
