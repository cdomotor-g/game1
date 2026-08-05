# 03 — The map, terrain and movement

## Tiles

The board is hex tiles, each one terrain type. 37 tiles for two players up to 75 for
five. Everything beyond each player's starting cluster of three starts **face down**.

Twelve terrains, ten land and two water. Each carries:

- **moveCost** — hours or move points to cross
- **roadCostMultiplier / railCostMultiplier** — what infrastructure costs here
- **buildable** — whether anything can go on it
- **features** — trees, exposed stone, fresh water, game, herbs
- **deposits** — what might be buried underneath

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
forest.

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

**Bridges** (16 points) carry a road or rail across one water tile or river edge. River
banks are good land — fresh water, clay, powered mills — but a river edge must be
bridged to cross, so a river is both a gift and a wall.

## Water

Shallow water takes barges and ships; deep water takes ships only and cannot be
bridged. Coast tiles are the only place a harbour can go.

Sea freight is slow to set up — a harbour is 22 build-points on top of a dock, and a
ship is 280 coin or fourteen hours of shipwrighting — and then it is the cheapest bulk
movement in the game at 60 capacity. It is the long-game infrastructure play for anyone
who started on the coast, and storms can sink the whole thing.
