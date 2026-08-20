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

### 3. Is 24 rounds right?

The simulator gets one town to ten buildings in 24 rounds. Tier-3 chains are reachable
but rarely worth it. Either the game is longer, buildings are cheaper, or the deep
chains need to pay much better. Unresolved and important.

## Economy

### 4. Should storage be per-town or per-building?

Currently a town has one pool of slots and warehouses add to it. The alternative — goods
live *in* a specific warehouse — makes theft cards much more interesting (which
warehouse?) and bookkeeping much worse.

### 5. Does anything stop a player hoarding one commodity?

Right now, nothing except bulk. A player can sit on 40 grain. The variety bonus nudges
against monoculture but only by one effort point. Options: rising storage cost, a
diminishing market price for repeated sales, or nothing at all — hoarding may be a fine
strategy that other players are free to punish.

### 6. Are the spread numbers right?

15% each way, removed by a trading house or a merchant. That is a 30% round trip, which
makes player-to-player trade obviously better than the board. Probably correct — the
board should be the fallback, not the plan — but the gap may be too wide to leave any
reason to build a market at all beyond the safety net.

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

### 12. Is one round of combat enough?

One exchange, hits on 4+, both sides simultaneous. It is fast and it keeps war from
swallowing the game, but it may make outcomes too swingy to justify the investment in
soldiers.

### 13. What stops a player from being eliminated early?

Nothing yet. Losing all your workers is possible and there is no floor under it. A
player knocked out at round 8 has a bad evening. Needs either a hard floor (you always
keep one worker and one hut) or a comeback mechanism.

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
