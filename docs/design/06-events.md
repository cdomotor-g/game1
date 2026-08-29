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
| Market | 9 | Shortages, **Glut**, foreign demand, a tax levy |
| Industry | 2 | Impure Smelt: the metal pours grey and tools snap like slate |
| Arcane | 5 | Ley surges, a curdled brew, a wandering wizard, the Blood Moon |

**One word in that table used to be a rule.** The Market row said *gluts*, lower
case and plural, and it now says **Glut**, capitalised and singular, because that
is a card — *a bumper year somewhere else; prices fall through the floor* — and
no longer a pricing model. GLUT was one of the three models a commodity could
name until perishables were given the ochre spoil die instead
(`data/pricing.json → models`), and a reader who has learned the four kinds of
good would otherwise read the old spelling as a rule that is not there. The word
survives on the card because a bumper harvest crashing a price is still exactly
what the card does; it is capitalised so it names a card and not a system. The
alternative was to write *spoilage* here, and that would be worse: spoilage is a
thing that happens to a player's own stock in the Feeding phase and never touches
a price, so putting it in a Market row would fix one confusion by planting a
larger one.

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
| Raiders | A palisade is armour: every defender adds the wall to their battle total. Garrisons defend automatically |

If you get wiped out, you should be able to name the building you did not put up.

**The palisade stopped granting a die.** It used to grant a *defence die*, which
is two retired things in three words: there is no defence in this game any more,
and a battle does not add dice for advantages. A fight is one opposed total —
your strength plus your gear plus two blue against its strength plus its armour
plus two red, and the lower total loses health equal to the difference
(`rules.json → conflict.battle`) — so a wall does what everything else
wall-shaped does and adds **armour** to the side standing behind it. That is the
same conversion the bestiary took: a monster's defence was halved and reprinted
in its **A** box, and a palisade is a stone boar with a gate in it. The magnitude
is meant to be unchanged, since the point of the change is the vocabulary rather
than the balance — an extra die kept best-of-two is worth about a point and a
half, so a wall that was worth a die is worth about two armour. The number itself
belongs to the building and lives in `buildings.json`, not on the event card that
happens to be shooting at it: one wall, one number, however many raids it turns.

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
