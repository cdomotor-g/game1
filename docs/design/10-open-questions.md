# 10 — Open questions

Things that are genuinely undecided, roughly in order of how much they would change the
game. Where a decision has been provisionally made, the provisional answer is marked
**[working answer]** — it is in the data, and it is not settled.

## Structural

### 1. Is effort a town-wide pool or a per-worker assignment?

The brief says each worker rolls a die and the player allocates that effort. The
prototype pools all the hours, which is much easier to play — but it makes several
designed traits inexpressible. "Dwarves roll d8 in a mine" needs to know *which worker*
is in the mine, and a pool does not.

The trade-off:

- **Pool** — fast, flexible, hides the workers. Bonuses have to become flat output
  multipliers, which is a real loss of texture.
- **Per-worker** — each die stays with a meeple you place at a site. Slower, fiddlier,
  and it makes worker slots, terrain penalties and racial traits all work properly.

**[working answer]** Pool in the prototype, per-worker on the table. That split is not
sustainable — the two versions would diverge — and it needs resolving before the board
layer is built. My inclination is per-worker with dice physically placed on buildings,
because placing a die on a mine is a better game than subtracting 3 from a number.

### 2. How are commodity tokens handled physically?

63 commodities is far too many for one bit each. Generic coloured cubes plus a player
board grid, or printed chits per commodity? See [08-components.md](08-components.md).
This needs a paper prototype, not an argument.

*Half-answered.* The **shape** is settled and the count is not. Commodity tokens are
18 mm flat-top **hexagons**, because hexagons nest on a laser bed with shared cuts — a
sheet of them yields around a fifth more pieces than the same sheet of discs, and the
head travels a good deal less. Coins stay round, because a coin that is not round is not
a coin and because round-against-hexagonal is the fastest distinction a hand can make in
a heap. Whether there are sixty-three kinds of hexagon or eleven is still the open half.

### 3. Is 24 rounds right?

The simulator gets one town to ten buildings in 24 rounds. Tier-3 chains are reachable
but rarely worth it. Either the game is longer, buildings are cheaper, or the deep
chains need to pay much better. Unresolved and important.

**The first of those three now has a physical ceiling**, which it did not have before the
price ledger. A ledger row is a round, and the rows divide a fixed sheet height: 24 rounds
gives an 8.4 mm digit, 25 gives exactly 8.0 mm, and **26 fails the build** because below
8 mm a seven-segment figure's colourable core is thinner than a pencil stroke. So "make the
game longer" is free up to 25 and costs a second sheet after that, and the build says so by
name rather than letting somebody print figures nobody can fill in. That is not an argument
against a longer game — a second sheet is a sheet — but it does mean the answer to this
question is no longer only about the economy.

## Economy

### 4. Should storage be per-town or per-building?

Currently a town has one pool of slots and warehouses add to it. The alternative — goods
live *in* a specific warehouse — makes theft cards much more interesting (which
warehouse?) and bookkeeping much worse.

### 5. Does anything stop a player hoarding one commodity? — *answered four different ways, and one of them is worse than it was*

This used to have a clean half-answer: 45 commodities priced by **glut**, five tokens sold
into a town stepped that line's memory down a cell to a floor of −3, and a player sitting on
40 grain could not sell 40 grain. That machinery is gone with the memory strip — nothing on
any board remembers anything now — and glut is gone with it. The question therefore has to
be asked once per **kind of good**, and the four answers are not the same answer.

**Perishables (11).** Answered, and better than glut ever answered it: you cannot hoard them
at all. The ochre spoil die is rolled at the end of every round against every perishable
stack a player is holding, and a stack loses one, two or three of itself whether anybody
buys any of it or not. Glut punished the *town* for what the farmer did and never once made
anybody hurry; the spoil die punishes the person actually holding the fish, in the round they
failed to shift it. A granary reads one row up the strip, which is what a granary is for.

**Staples (34).** Nothing stops it, and — this is the regression — nothing punishes the
liquidation either. The `stockCap` limits what the board will **sell** to that round's supply
roll; it will **buy any quantity**, on the entirely reasonable grounds that a market always
has room for more of what nobody wants. So 40 grain can now go into one town in one round and
the price will not notice, because there is nothing left to notice with. Thirty-four
commodities were in the glut model only because glut was where everything went, and taking
the memory off the board took the one brake they had.

**Finite (14).** Hoarding is actively *rewarded*, and that is intended: the depletion grid
only moves when somebody **burns** the stuff, so a merchant who never lights a fire can trade
the same hundred tons of coal all game and the price will not move an inch for it.

**Sought (7).** Self-correcting, and the only one of the four that is. Dumping drives the
price down, the move box records the fall, and the fall is next round's modifier — the hype
loop running backwards at the same speed it ran forwards.

What is left holding the line for staples is **storage**, which is a real limit and always
was: ten free slots a town, twelve more per warehouse, and anything above capacity spoils by
half at the end of the Feeding phase. That caps the size of a hoard and says nothing about
the speed of a sale.

So the open part is narrower and sharper than it was: **should selling into a market move
that market at all any more?** Three candidates, and none of them is free. A *buy cap*
mirroring the sell cap is the cheap one and it is a lie about markets. A *rising storage
cost* is honest and is bookkeeping. Reading a town's holdings into the demand die is the
truest and is the one thing the redesign spent a whole board getting rid of. It may also be
that the answer is genuinely nothing — that a town paying full price for a fourth cargo of
grain is the game working, and the brake belongs on the *carrying* of the money instead, now
that coin has mass.

### 6. Are the spread numbers right?

15% each way, removed by a trading house or a merchant. That is a 30% round trip, which
makes player-to-player trade obviously better than the board. Probably correct — the
board should be the fallback, not the plan — but the gap may be too wide to leave any
reason to build a market at all beyond the safety net.

### 22. Is twenty-one pips the right length of a seam?

A finite commodity's depletion grid is seven rows of three: `step` 1, `per` 3, `top` 6 in
`data/pricing.json`. Twenty-one cells, one pip per unit **burnt**, nothing ever lifted off,
and the twenty-first pip puts that commodity's price up by six for the rest of the game —
which on the swing ruler is two full bands of rally before a single die is thrown. The town
holding the last deposit owns the market, and it always did; this is the version of that
sentence you can see across a table.

Whether twenty-one is a mid-game cliff or scenery depends entirely on how industrial the
table is, and the same number cannot be both. A table running two furnaces burns coal fast
enough to reach the bottom row well before the end; a table that trades ore and never smelts
it will not cover the first row all game, and the whole model is a grid nobody touched. That
is not a balance failure on its own — it is the model saying *burning is what empties a
hill* — but it means the dial has never been set against anything, because no play has been
watched and the sandbox does not model a second town's furnace.

The dial is three numbers and they are not free. `step` is what a row is worth, `per` is how
many cells a row holds, and `top` is the last row, and the grid is drawn from those three:
lengthening a seam makes every grid taller, and grids are laid out nine across and two down
on one A4 sheet, so a longer seam is also **fewer grids per sheet**. `tools/build-market.mjs`
fails the build rather than print a grid that runs off the paper, which is the right failure
to have but does mean the answer to this question is partly a stationery question.

### 23. Is one round of memory too short for a sought good?

The hype modifier is the move box on the ledger row above — the number of bands the price
moved *last* round, −3 to +3, and nothing else. It is a feedback loop with a floor, a ceiling
and no memory beyond one round, which is deliberately the shape of the thing it models: a
rise makes buyers and buyers make a rise, until a bad roll turns it and the same machinery
runs backwards just as fast. Two quiet rounds and it is at nothing again, because a move of
zero is what the next round reads.

The worry is that it can never build. The ruler holds 29.9% of the time and moves one band
45.8%, so **three quarters of all rolls hand the next round a modifier of 0 or ±1** — and a
±1 on a net that runs −12 to +12 is very nearly nothing. A run needs three or four
consecutive rises to become something a table can see, and each one is a coin flip against a
symmetric spread. It is entirely possible that all seven sought goods behave, at the table,
exactly like staples with a rounding error attached, in which case the game has a fourth
pricing model, a fourth panel on the market board and a fourth token mark for a rule nobody
ever feels.

What is **not** the fix is a longer memory. A memory that spans rounds is a memory strip, and
a memory strip is precisely what came off the market board — it wanted a printed cell per
line and gave the model somewhere to hide. If the modifier is too weak the dial is what the
box is *worth*: read the move as ±2 a band rather than ±1, which costs nothing on the sheet
because the box already holds the same figure. That is one line in `pricing.json sought` and
a simulator run, and it should be decided that way rather than by adding paper.

## Map and movement

### 7. Hex or square tiles?

Hexes are in the data (`terrain.tileShape`), squares are listed as an alternative. Hexes
are better for movement and worse for rail networks, which want to branch orthogonally.

**Parked behind [#18](https://github.com/cdomotor-g/game1/issues/18).** The question only bites for a board made of tiles, and
that is shelved; a drawn map plate is hexed by an overlay, and the overlay's shape is a
one-field change in the board file. It comes back with the tile set.

### 8. How does a player found a second town?

Not designed. A town hall is "one per town", but nothing says what a town *is*, how far
apart they must be, or what it costs to start one. This is a significant gap: the whole
transport and food-distribution design assumes multiple towns exist.

### 9. Who owns a revealed deposit?

Currently: whoever builds the mine, not whoever surveyed it. That makes prospecting
risky in a way I like, but it may be too punishing — you can hand a rival a coal seam by
finding it. Options: a short claim window, or a claim marker the surveyor may place.

## People

### 10. Can workers be moved between towns?

The brief says yes, and it is not designed. If workers move freely, feeding pressure
becomes trivially solvable by walking people to the food. If they cannot, a town whose
farm fails is dead. Probably: workers move slowly and one at a time.

### 11. Should specialists be losable?

Currently a specialist is permanent once trained. Plague removes workers — should it be
able to take your only smith? Dramatic, and possibly infuriating.

## Conflict

### 12. Is one round of combat enough — and what does an inconclusive one leave behind?

The rule is `roundsPerBattle: 1`, and it survived the redesign unchanged while everything
underneath it moved. There is no to-hit roll, no 4+, nothing simultaneous and no hits
counted: both sides total strength, gear and dice, and the lower total loses health equal to
the difference. The old worry was swinginess. The new worry is the opposite at one end and
much worse at the other, and the arithmetic says both plainly.

**Two evenly matched figures.** Over all 1296 exchanges, 11.3% are ties that wound nobody,
and the average wound is **1.37 health to each side per round**. A cinder wolf has 4 health.
So an even fight is three or four exchanges — and because a round of combat is a round of the
*game*, that is three or four rounds of everything else, with an unresolved monster sitting
on its hex attacking whoever ends a leg there. One round of combat does not mean a short
fight. It means a **standing appointment**, and the party can only decline it if its pace
beats the monster's.

**A mismatch.** The board's own worked example — strength 4, sword, jerkin, against a cinder
wolf — is a 3-point edge, and a 3-point edge deals **3.35** and takes **0.35** a round. The
same character against Vhalrik is a 4-point deficit: **0.19 dealt, 4.19 taken**, which is
death in three rounds while doing essentially nothing back, with no flight unless their pace
beats 5. An opposed difference amplifies an edge far harder than a shifted to-hit number ever
did, because the edge is added to the damage rather than to the chance of doing any. Each
point of gear is worth roughly two thirds of a point dealt *and* two thirds not taken, every
round, for ever.

So the question splits. Is one roll enough to **resolve** a fight — no, and the data says so.
Is it enough to be **worth soldiers** — probably yes, and possibly too much so. What needs
deciding is what happens in the gap: whether a fight that neither side can win and neither
side can leave should stay on the hex indefinitely, or whether something (morale, a second
flee check at a penalty, a monster that wanders off) ends it. This wants plays, not an
opinion, and `tools/simulate.mjs` cannot answer it because nothing in the sandbox is standing
on a hex.

### 13. What stops a player from being eliminated early?

Nothing yet. Losing all your workers is possible and there is no floor under it. A
player knocked out at round 8 has a bad evening. Needs either a hard floor (you always
keep one worker and one hut) or a comeback mechanism.

### 24. Are four kit slots a harder limit than they were?

Four recesses, and the argument for four has always been that a hero who wants a fifth thing
has to put something down. That was a preference dressed as a rule. It is a rule now: every
slot has a **wear ladder** ruled against it, so a fifth thing in play is a fifth thing whose
wear nobody is counting, and there is nowhere to count it.

Meanwhile the redesign put more claimants on those four slots than have ever been on them.
Armour is one card per piece, and a figure wearing body, head and off-hand is wearing
**three cards** to reach armour 5 — plus a weapon is four, and the board is full before a
lantern, an axe, a talisman or an accepted quest has anywhere to go. A properly armoured
character cannot carry a light. That is either a wonderful constraint or an obvious bug, and
it has never been played.

Three ways out, in ascending order of cost. Armour stops being one card per piece — a *suit*
is one card and the helm and shield fold into it, which loses the pleasure of assembling a
kit. Worn gear stops occupying a kit slot and lives somewhere else on the board, which needs
a fifth recess the board's geometry does not have room for. Or the slot count goes up, which
is the expensive one: four slots is precisely what the board's columns and wear ladders were
re-derived around, and a fifth recess takes back the width that retiring the defence column
paid for.

## The adventure layer

### 18. Does per-player event drawing scale?

Each player now turns a card in the Events phase, so a five-player round is five or
six events. That is a lot of weather. It makes every player own a piece of the round
and it feeds the discovery-band cards nicely — but if a round drowns in card
resolution, the fallback is one shared card plus one per player *cap of three*, and
the data already carries copies to support either.

### 19. How does character death actually play?

**[working answer]** A character at 0 health is carried to the nearest settlement,
rests to half, loses carried cargo. No permadeath — a player's hero card is theirs
for the game. The open part: whether losing a campaign stage to a wipe should discard
the campaign for everyone (currently: only if abandoned).

### 20. Is mana too slow to matter?

Twelve monsters yielding 1–4 mana each, spells costing 1–5, and monsters must be
*found*. If a whole game yields a player 6 mana, spells need to be strong; if the
Blood Moon floods the map, they need to be weak. The dial is `manaYield` on the
monster cards, and it needs plays, not opinions.

### 21. Do enslaved monsters break the labour economy?

A Barrow Troll is a d8 worker for 3 food and 1 unrest. Compare a real worker: d6 for
1 food. Probably fine — the troll had to be beaten by 2+ hits without killing it
first — but the exchange rate is untested.

## Digital

### 14. How much of the board game should the digital version enforce?

A strict digital version cannot express the negotiation, table talk and improvised deals
that make the board version good. A loose one is a spreadsheet. The current sandbox
resolves what it can and logs the rest for the player — that split feels right for a
companion tool and wrong for a standalone game.

### 15. Is the web version a companion or a replacement?

Unresolved, and it changes everything about what gets built next. A companion needs the
reference views and a turn tracker. A replacement needs the board, multiplayer and an
AI. The current build hedges by being neither, which is fine for now and will not be
fine for long.

## Presentation

### 16. Is `halfling` the right name?

Four of the five peoples are named with folklore terms in the public domain and used
across hundreds of unrelated works. `halfling` is the exception worth a decision: the word
appears in Tolkien and has been treated protectively by that estate, though it is also
long-established as generic in tabletop games.

The risk is low, and it is a naming question rather than a visual one — but it is cheap to
change now and expensive to change after a print run, so it should be decided rather than
assumed. Generic alternatives that lose nothing: *smallfolk*, *burrowfolk*, *hearthfolk*.

Changing it touches `data/peoples.json` and every doc that names them. Nothing in
[../art/](../art/) depends on the word — the art risk is the rendition, not the name, and
that is handled in
[../art/08-influences-and-distance.md](../art/08-influences-and-distance.md).

### 17. Do commodity chits get individual art, or does the frame system carry it?

The style guide gives every commodity a category frame, a category hatch and a drawing.
The drawing is by far the most expensive part — 63 of them — and the frame plus hatch
already identifies the category unaided. Whether an 18mm chit needs its own illustration,
or whether a well-chosen frame and a numeral is enough, is a real question about where the
art budget goes. It should be answered with a printed test sheet, not an opinion.
