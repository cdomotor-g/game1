# 06 — Events

58 cards, 31 distinct. One drawn at the start of every round, two from round 13, so the
back half of the game is noticeably rougher than the front.

## Scopes

- **Global** — everyone. Weather and market cards mostly.
- **Local** — one region; roll for which.
- **Targeted** — one player, usually the leader.
- **Offer** — an opportunity any player may take, resolved in turn order.

Crime cards target the leader by default. That is the catch-up mechanism and it is
deliberate: being ahead should mean being worth robbing.

## Categories

**Weather** (7 cards) — hard frost, drought, long summer, storms at sea. The common
ones. These should feel like seasons turning, not like being punished.

**Disaster** (5) — flood, earthquake, wildfire, mine collapse.

**Crime** (9) — warehouse heists, caravan robbery, train heist, piracy, and a smuggling
offer that pays well and costs you a point of unrest.

**Wildlife** (5) — wolves at the livestock, boar in the fields, and one dragon.

**Conflict** (7) — raiders, border disputes, mercenaries for hire.

**People** (10) — plague, migrants, strikes, festivals, a travelling master who will
take an apprentice for 30 coin.

**Market** (9) — shortages, gluts, foreign demand, a tax levy.

**Arcane** (4) — ley surges, a curdled brew, a wandering wizard.

## Every disaster has a mitigation

This is the rule that keeps the deck from feeling arbitrary. Each disaster card lists at
least one thing a player could have bought in advance:

| Card | Mitigation |
| --- | --- |
| Hard Frost | Brick houses ignore it; 2 fuel in stock cancels the effort penalty |
| Drought | A well, or a river-bank town |
| Wildfire | Water access improves the save roll |
| Warehouse Heist | A watchtower cancels it once per game; soldiers halve it |
| Caravan Robbery | An escorting soldier rolls to stop it |
| Mine Collapse | Dwarves lose no worker |
| Plague | A Healing Draught cancels the card outright |
| Raiders | A palisade grants a defence die; garrisons defend automatically |

If you get wiped out, you should be able to name the building you did not put up.

## Structured effects

Cards carry both the printed text and a machine-readable `effects` array, so the digital
build can resolve what it can and hand the rest to the player. The vocabulary:

`effort` · `commodity-loss` · `commodity-gain` · `price` · `building` · `tool` ·
`population` · `unrest` · `movement` · `cargo` · `combat` · `crop` · `choice`

New cards should stay inside that vocabulary where possible. When a card needs
something the vocabulary cannot express, that is a signal to add a verb rather than to
write another paragraph of prose the engine cannot read.

The sandbox currently auto-resolves effort modifiers, crop advances and pauses, and
price shifts. Anything targeted, local, or offering a choice is logged and left to the
player — the single-town prototype has no board to apply "one region" to.

## Deck feel

Weather and market cards are the most common because they should be the texture of the
game, not its drama. Disasters and crime are rarer and land harder. Offers exist so
that at least some cards are a decision rather than a result — a card you have to think
about is worth three you merely suffer.
