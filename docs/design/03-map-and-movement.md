# 03 — The map, terrain and movement

## Tiles

> **The tile board is shelved — [#18](https://github.com/cdomotor-g/game1/issues/18).** What is below stays true as
> rules, and it is not what is being built. The board in play is a **drawn map
> plate with the hex grid overlaid at read time** — see
> [`../map/README.md`](../map/README.md) — where a mistake about the terrain is a
> one-character edit rather than a repaint. A bag of tiles is a different physical
> product with its own art contract and its own setup, and it comes back as a
> *tile set* once the game-set split ([#10](https://github.com/cdomotor-g/game1/issues/10)) has decided how a set supplies
> a board. Terrain, move costs and the letter codes below are shared by both and
> are not affected.

The board is hex tiles, each one terrain type. 37 tiles for two players up to 75 for
five. Everything beyond each player's starting cluster of three starts **face down**.

Ten terrains, eight land and two water — riverbanks and lake shores were folded into
grassland and coast, because two extra tile types bought complexity and paid nothing.
Each terrain carries a **single-letter code**, printed in the bottom corner of every
hex on every map, so there is never an argument about what a cell is when the artwork
underneath straddles a grid line. The letter is the ruling.

| Code | Terrain | Move | Rail × | | Code | Terrain | Move | Rail × |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **G** | Grassland | 1 | 1 | | **T** | Tundra | 2 | 2 |
| **F** | Forest | 2 | 2 | | **D** | Desert | 2 | 2 |
| **H** | Hills | 2 | 3 | | **C** | Coast | 1 | 2 |
| **M** | Mountain | 4 | 6 | | **S** | Shallows | boat | — |
| **B** | Marsh | 3 | 4 | | **O** | Deep water | boat | — |

Each terrain also carries road multipliers, buildability, **features** (trees, stone,
fresh water, game, herbs, caves) and **deposits** — the full table is in the
[annex](14-annex.md), and the letter codes key the travel-speed and discovery tables
in [13-adventure.md](13-adventure.md).

The rail multipliers are the ones to look at. Flat grassland is ×1. Hills are ×3.
Mountains are ×6. A railroad through a mountain range costs 48 build-points a tile and
is meant to be the kind of thing another player watches you attempt with interest.

## Exploration and fog

Face-down tiles are the fog. A **prospector** figure moving onto one flips it, which
reveals the terrain immediately. What is *under* it takes more work.

Deposits are separate face-down tokens placed at setup. Revealing one needs a survey:
the prospector spends an hour with a surveyor's kit and rolls a d6 against the
deposit's difficulty. Clay is difficulty 2 and practically visible; a mana vein is 6
and mostly luck. Mountains and hills give +1 to the roll, and so does being a dwarf.

Two-stage reveal — terrain first, deposit second — is deliberate. It means exploring
tells you where to look without telling you what you will find, and a rival watching
your prospector learns less than they would like.

A deposit revealed by you is not owned by you. It belongs to whoever builds the mine.
Racing someone to a coal seam you found is a real and intended situation.

## Deposits are finite

A coal seam holds 30 coal. An iron deposit holds 28. A gold deposit holds 10, a gem
vein 8, a mana vein 6. When the total is drawn the token flips and the mine is a shed.

This is what stops a good early roll from deciding the game, and what turns the map
into something that changes shape over 24 rounds. The player who built on the first
coal seam is in trouble around round 15 if they have not found the second.

## Movement

**Figures** — prospector, merchant, soldier, hero — have move points and spend terrain
move cost. Four points crosses four tiles of grassland, one tile of mountain, or two of
forest. The printed form of the same arithmetic is the travel-speed table in
`data/travel.json`: hexes per day leg, by mode and terrain letter code.

**Days and nights.** Each round gives a moving figure or vehicle one day leg; pushing
on into a night leg needs a lit torch or lantern and is slower — the full rules,
including what each light allows and why the night discovery roll is nastier, are in
[13-adventure.md](13-adventure.md).

**Discovery.** Ending a leg triggers one d20 discovery roll on the landed hex's table —
merchants on roads, monsters in the waste, and very occasionally something worth
surveying. Also in [13-adventure.md](13-adventure.md).

**Cargo** does not use move points. It uses transport modes with capacity and speed,
covered in [04-trade.md](04-trade.md).

## Roads, rail, bridges

All three are **infrastructure**: built onto a tile rather than into a town, and their
build-point cost is multiplied by the terrain.

**Roads** (3 base points) halve land movement and let carts run at double speed. Cheap
enough to be an obvious early buy on the routes you use twice.

**Rail** (8 base points, plus a steelworks and 2 steel per tile) ignores terrain move
costs entirely and carries 80 bulk at 6 tiles a round. It is the biggest capital
project in the game and it scores a victory point per tile, because the alternative is
that nobody ever builds it.

**Bridges** (16 points) carry a road or rail across one shallow-water tile. Deep water
cannot be bridged by anyone, ever, and that is what makes the sea lanes matter.

## Water

Shallow water takes barges and ships; deep water takes ships only and cannot be
bridged. Coast tiles — any shore: sea, lake or river mouth — are the only place a
harbour can go.

Sea freight is slow to set up — a harbour is 22 build-points on top of a dock, and a
ship is 280 coin or fourteen hours of shipwrighting — and then it is the cheapest bulk
movement in the game at 60 capacity. It is the long-game infrastructure play for anyone
who started on the coast, and storms can sink the whole thing.
