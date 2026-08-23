# 03 — The map, terrain and movement

## Why the grid is hexagonal

For the record, because it gets re-litigated every time somebody notices that a square grid
would be easier to draw: **the grid is hexagonal to give movement more, and more equal,
options.** A hex has six neighbours and every one of them is the same distance away. A
square has four at one distance and four more at root two, so a square grid either lies
about its diagonals or forbids them.

Six equal exits is what makes a route a *choice* rather than a staircase. It is why a road
can bend without costing more than a road that does not; why flanking is a real position
rather than an arithmetic exception; and why a party fleeing a monster has five ways out
instead of three. The cost is one: a hex grid is harder to draw and harder to describe in
prose. `tools/lib/hexgrid.mjs` pays that cost once and nothing else in the game pays it
again.

`terrain.json` keeps `tileShape: hex` and lists `square` as an alternative it does not use.
A mini-map's own grid is hexagonal for exactly the same reason — plus one more, which is
that a mini-map cell has to line up with a world hex.

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

Eleven terrains, seven land and four water. Each carries a **single-letter code**,
printed in the bottom corner of every hex on every map, so there is never an argument
about what a cell is when the artwork underneath straddles a grid line. The letter is
the ruling.

| Code | Terrain | Move | Rail × | | Code | Terrain | Move | Rail × |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **G** | Grassland | 1 | 1 | | **D** | Desert | 2 | 2 |
| **F** | Forest | 2 | 2 | | **R** | River | boat | — |
| **H** | Hills | 2 | 3 | | **L** | Lake | boat | — |
| **M** | Mountain | 4 | 6 | | **S** | Shallows | boat | — |
| **B** | Marsh | 3 | 4 | | **O** | Deep water | boat | — |
| **T** | Tundra | 2 | 2 | | | | | |

### There is no shore terrain

There was one, called **Coast**, and it meant "the edge of the water". That made a
shore a *kind of ground*: a beach in front of a forest had to be drawn as neither, a
town on a lake could not have a dock unless the artist painted a ring of sand round
the lake first, and one terrain was quietly doing the work of sea shore, lake rim and
river mouth at once.

The edge of the water is a **relationship**, and it is stated as one. A land tile with
any water tile beside it is **waterside** — read off the board the moment somebody
asks, printed on no hex, and true of a river bank and a sea shore alike. A dock goes
on any waterside tile; a harbour on one the *sea* reaches; fresh water is drawn beside
a river or a lake without a well. `data/terrain.json siting.waterside` is where the
three kinds — any, fresh, sea — are declared, and `tools/validate-map.mjs` fails a
board whose harbour no sea can reach.

Riverbanks and lake shores went the same way, and their water came back as terrain in
its own right: **River** is a watercourse wide enough to be its own hex — a barge lane
running inland, and a wall across any road that has not been bridged — and **Lake** is
standing fresh water with land all round it. The two of them are what the old
riverbank and lake-shore tiles were reaching for, and neither costs a shore tile to
say it.

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

### A road is yours, and it pays

Roads were the one thing in the game you built for everybody and were paid for by
nobody. The Network victory condition scored them at the very end and nothing scored them
in the twenty rounds before that, so a road only ever got built where its builder happened
to want to walk. Three returns fix that, in the order a player feels them:

- **A toll.** Every hex of your road another player's leg enters pays you **1 coin**; rail
  pays **2**. Collected from them, not from a bank, the moment that leg ends — capped at
  **6 a leg**, so a trunk road across the continent is worth building and is never a tax
  gate. Your own figures pay nothing. A player may decline to pay and go round; they may
  not decline to pay and go through.
- **Haulage.** Cargo that starts or ends its journey in a settlement your own road or rail
  reaches sells for **a tenth more** than the town price. This is where the real money is,
  and it is why the sensible first road runs from your mine to your market rather than
  towards anybody else.
- **The points**, unchanged: Network still scores towns joined by routes you built, and
  rail still scores a victory point per tile as it is laid.

The numbers are meant to be small. A road hex costs one stone and three build points — call
it 5 coin and an hour — so a stretch repays itself after five foreign crossings, which in a
four-player game is a handful of rounds on any road worth building. Rail costs 2 steel and
2 lumber, about 70 coin a hex, and will never repay that in tolls: rail is repaid by the
train that runs on it, and the toll is a gratuity. Full numbers in
`rules.json → infrastructure`.

None of this makes a road a private road. Anyone may walk it, and paying the toll is the
price of the walk — which is exactly the relationship a turnpike had with the people who
used it.

### Route tokens

A road is marked on the map as it is laid, and the token **is** the record: an unmarked
road belongs to nobody. A route token is a **bar**, not a chit — it lies along the line
between two hex centres, which is where a road actually is, and it is the length of that
line, so a run of them reads as a continuous road rather than as a row of counters.

The size is the map's business, not the token's. A pointy-top hex's centre-to-centre
distance *is* its flat-to-flat width, so the bar is nine tenths of whatever the map's print
preset makes a hex — **15 × 3.7 mm** for road and **15 × 5.3 mm** for rail on the default
four-sheet Korvane Reach board, and `tools/build-map.mjs` prints the figures for every
preset rather than anybody typing them. Rail carries sleepers across its width so it reads
as rail at arm's length; ownership is peg holes down the centre line — one for the first
player, two for the second — as well as colour, so a table that cannot use the colour can
still see whose road it is. A mini-map cell is the same hex, so a bar cut for the campaign
board fits a mini-map lane too.

## Water

Four water terrains, and they are not interchangeable. **Rivers** and **lakes** are
inland fresh water: barges work them, a bridge crosses them, and nothing wheeled
gets over one until somebody builds that bridge. **Shallow water** takes barges and
ships; **deep water** takes ships only and cannot be bridged at all.

A **dock** goes on any waterside land — a sea shore, a lake rim or a river bank all
do. A **harbour** needs the sea, because a harbour is for ships and a ship never
reaches a lake. Neither is a terrain: waterside is read off the board (see above),
and `tools/validate-map.mjs` fails a board whose harbour no sea can reach.

Sea freight is slow to set up — a harbour is 22 build-points on top of a dock, and a
ship is 280 coin or fourteen hours of shipwrighting — and then it is the cheapest bulk
movement in the game at 60 capacity. It is the long-game infrastructure play for anyone
who started on the coast, and storms can sink the whole thing.
