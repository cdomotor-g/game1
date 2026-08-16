# 06 — Events

69 cards, 37 distinct. **Each player turns one over** in the Events phase, in turn
order, and the first player draws a second from round 13 — so a four-player round is
four or five cards of weather, and the back half of the game is noticeably rougher
than the front.

## Scopes

- **Global** — everyone, whoever drew it. Weather and market cards mostly.
- **Local** — one region; roll for which.
- **Targeted** — the player who drew it. Except crime, which targets the leader.
- **Offer** — an opportunity. The drawer decides first; if they pass, it goes round.

Crime cards target the leader whoever draws them. That is the catch-up mechanism and
it is deliberate: being ahead should mean being worth robbing.

## Categories

| Category | Cards | What it brings |
| --- | --- | --- |
| Weather | 9 | Hard frost, drought, long summer, storms at sea — the seasons turning |
| Natural Disaster | 7 | Flood, earthquake, wildfire, mine collapse |
| Crime | 9 | Heists, robbery on road and rail, piracy, a smuggling offer |
| Wildlife | 6 | Wolves, a boar in the crops, one dragon, and the Quiet Season |
| Conflict | 7 | Raiders, border disputes, mercenaries for hire |
| People | 15 | Plague, migrants, strikes, festivals — and now illness: Camp Fever, Marsh Ague, the Grey Pox |
| Market | 9 | Shortages, gluts, foreign demand, a tax levy |
| Industry | 2 | Impure Smelt: the metal pours grey and tools snap like slate |
| Arcane | 5 | Ley surges, a curdled brew, a wandering wizard, the Blood Moon |

## Illness

The illness cards scale by blast radius: **Camp Fever** hits one travelling party,
**Marsh Ague** one region, **The Grey Pox** every sizeable town on the map, and the
old **Plague** still stalks regions. Every one of them is cancelled or blunted by
the same three purchases — a Healing Draught or Physic Tonic in stock, an infirmary
with a fed healer, or the right character in the party — which makes the healer the
first specialist whose absence has a body count.

## The wild, dialled

Two cards move the discovery tables themselves: **Blood Moon** widens every monster
band by 3 for two rounds, **The Quiet Season** shrinks it by 2. They are the volume
knob on how dangerous travel feels, and adding copies of either re-tunes the whole
map without touching a table.

## Every disaster has a mitigation

This is the rule that keeps the deck from feeling arbitrary. Each disaster card lists at
least one thing a player could have bought in advance:

| Card | Mitigation |
| --- | --- |
| Hard Frost | Brick houses ignore it; 2 fuel in stock cancels the effort penalty |
| Drought | A well, or a town beside fresh water |
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
`population` · `unrest` · `movement` · `cargo` · `combat` · `crop` · `choice` ·
`health` · `discovery`

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
