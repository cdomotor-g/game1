# Proposals

Every finding marked *Proposed* or *Open* points here. Each proposal is written as the rule it would become — present tense, second person, ready to be pasted into a chapter — followed by what has to change in the data for the chapter to print it. A proposal is a recommendation and not a rule: a table may play it tonight, but Book I does not say it until the data does.

{{fig:plate:tile-barracks,plate:tile-granary,plate:item-lantern,plate:event-migrants|frieze}}

### P-01 · A scoring schedule (R-01, R-22)

{{fig:plate:tile-harbour|margin|The harbour, scored at its printed points under Network.}}

**The rule.** At the end of round {{rules.victory.gameLengthRounds}}, after the last Feeding phase, count:

| Condition | Points |
| --- | --- |
| Prosperity | 2 for every worker and 3 for every specialist fed in the last Feeding phase; every finished building at its printed points, or its tier where it prints none; 3 for every unit of luxury goods held |
| Industry | 2 for every unit of tier-three goods held; the tier of the highest-tier building you have run a job at this game |
| Network | 1 for every hex of rail you own; 3 for every printed settlement joined to one of your towns by road or rail you own, counted once each; a harbour's printed points |
| Coin | 1 for every 50 coin |
| Enchantments | 1 for every 4 mana bound into things you hold |
| Unrest | 2 off for every point of unrest in your towns |

The highest total wins. A tie goes to the fuller purse, then to whoever was first player least recently.

**The data.** A `points` block under the victory rules with one line per row above, so the chapter prints it as tokens and the digital twin scores the same table; the twin already scores every line but Network.

### P-02 · One way of moving (R-02)

{{fig:terrain:grassland,terrain:forest,terrain:hills,terrain:mountain,terrain:marsh|The five grounds a figure pays move points to enter, dearest last.}}

**The rule.** A figure moves on move points: {{rules.movement.figureMovePointsPerRound}} by default, or the number printed for its kind — a hero {{transport.figures[id=hero].movePoints}}, a soldier {{transport.figures[id=soldier].movePoints}}. Set the P track to that number at the start of the leg. Entering a hex costs its ground's move cost — grassland {{terrain.terrains[id=grassland].moveCost}}, forest {{terrain.terrains[id=forest].moveCost}}, hills {{terrain.terrains[id=hills].moveCost}}, mountain {{terrain.terrains[id=mountain].moveCost}}, marsh {{terrain.terrains[id=marsh].moveCost}} — or 1 on a road whatever lies under it, and a leg that stays on a road is a point longer. Gear and traits that say "cost 1 less", "+1 move point" and "minimum 1" apply to these numbers as written. A vehicle moves on the travel table, hexes a leg for its mode and the ground, and a party aboard one moves as the vehicle does.

**The data.** The on-foot row of the travel table is already this rule tabulated; the mounted row becomes a mount's move points and a forest cost for a mount. The *Open* note in the travel chapter goes.

### P-03 · Muster (R-03)

**The rule.** Muster is a job at a barracks: 1 hour and {{transport.figures[id=soldier].cost}} coin, and one worker of that town is a soldier from the next round. Stand Down is the same job in reverse and costs nothing. A soldier is bought nowhere else.

**The data.** One civic recipe naming the barracks; the soldier's price comes off the figure table, which then lists what a soldier does and not what it costs.

### P-04 · Deposits are drawn, not hidden (R-04, R-36)

{{fig:plate:tile-mine|margin|A mine stands on a token drawn from a stack, not found under the hex.}}

**The rule.** At setup, sort the deposit tokens by kind into face-down stacks beside the map; nothing goes on the map. A survey is a job as printed. On a 1 or 2 the hex is barren: mark it and never survey it again. On a 3, traces: survey again next round at +1. On a 4 or more, draw the top token of a kind this ground can hold, choosing among kinds if more than one can. If the roll reached the token's survey difficulty, it is revealed on the hex; if not, it lies face down on the hex as a trace and is surveyed again next round at +1. A 6 adds 2 yield to a revealed token. When a stack is empty that kind is found nowhere else.

**The data.** Each deposit already names its difficulty and its ground; each needs a count of tokens in the box, and a mana vein's is two.

### P-05 · Housing brings its people (R-05)

**The rule.** When a housing building is finished, put a worker in the town for every bed it adds. A bed empties only when its worker leaves, dies or is taken; a Migrants card fills empty beds and nothing else.

**The data.** One field on the population rules saying so, and the chapter already reads it that way.

### P-06 · A town has a board (R-06)

{{fig:board:player|half|The player board, dealt once more for every town founded.}}

**The rule.** Every town you found is dealt a player board of its own. Its town hall card lies in the recess, its tools lie in the four kit slots, and their wear is walked on the ladders beside them. A tool a figure takes on the road moves to that figure's board. A town owns at most four tools in play; more lie in the stockpile, unworn and unused.

**The data.** The board's own summary says one per player, one per vehicle and one spare. Add one per town.

### P-07 · Bandits and pirates get a card (R-07)

{{fig:plate:event-piracy|third|Pirates, henceforth H 8, S 3, A 1, dealt onto the encounter board.}}

**The rule.** Bandits: H 6, S 2 (+1 for every full 20 bulk the party carries), A 0, P 4, no mana. Pirates: H 8, S 3, A 1, P 5, no mana. Both are dealt onto the encounter board like a monster. The toll stands as printed and is paid at base value.

**The data.** Five numbers on each of the two discovery results, and a ceiling check that reads them.

### P-08 · Text that says the old rule (R-08 to R-13, R-15)

{{fig:card:BLD-36,card:ITM-02,card:TOL-01|Three cards whose rules text is rewritten; nothing on their strips moves.}}

Seven edits to card and job text, none of them a decision:

1. The granary's summary: "Ten slots for food and drink only. A stack inside it reads one row up the spoil strip."
2. Repair Tool's effect: "Mend up to {{rules.wear.repair.wearPerRound}} wear on one tool, {{rules.wear.repair.coinPerPoint}} coin a point, never above its W." The tools rules' own repair block goes.
3. The lantern's text: strike "does not wear out".
4. The orc trait: "Tools take 2 wear per job instead of 1."
5. The fourteen strings in R-12, to the right-hand column of that table.
6. The hero's summary: "One per player, free at setup. The figure your character card belongs to; it carries and fights on the card's own numbers."
7. The merchant-stock note: "Tools are sold at any settlement of town rank or better."

### P-09 · Haulage is earned by hauling (R-16)

{{fig:plate:tile-rail-depot|margin|The rail depot; three hexes of your own rail before the tenth is paid.}}

**The rule.** Cargo sells for a tenth over the town price only if it has moved at least three hexes over your own road or rail, between two different settlements, on the journey that brought it to market.

**The data.** A minimum-hexes field on the haulage rule, read by the chapter and by the twin.

### P-10 · The board buys up to demand (R-17)

{{fig:plate:tile-market|margin|The market, which now buys at full price only up to the blue dice.}}

**The rule.** The board buys at the ledger price, less the spread, up to as many units of a commodity as this round's blue dice rolled for it. Every unit past that sells one figure down the row. Trade between players is unlimited, as it is now.

**The data.** A `demand` cap beside the supply cap, mirrored: supply caps what the board sells, demand caps what it buys at full price.

### P-11 · A bed is worth five coin (R-19)

**The rule.** A camp on open ground restores every figure's strength to one under the number printed on its card. A bed restores it in full.

**The data.** One number on the night rule: a camp's shortfall of 1.

### P-12 · First player, leader, region (R-21, R-22)

**The rule.** In round one the first player is whoever's character card prints the least coin, then the least health. The leader, whenever a card names one, is the player with the most points by P-01 counted now, ties to the fuller purse. A local card's region is rolled on the discovery d20 against the regions the map prints, numbered in Annex III, rerolling above the count.

**The data.** Two sentences in the constants; the map already names its regions.

### P-13 · The M track is the cap (R-23)

{{fig:plate:people-elf|margin|The elf, who holds the most mana of anybody and no more than fourteen.}}

**The rule.** No character holds more than {{components.board.track.to}} mana, whatever it is carrying. A talisman past that holds nothing more, and mana with nowhere to go blows away at the end of the round.

**The data.** The arcane rules state the cap as the board's ceiling, and the ceiling sweep learns to add a body's mana to the largest talisman's.

### P-14 · How a side fights (R-18, R-24, R-25)

{{fig:plate:tile-palisade|margin|The palisade adds two armour to the defending fighter, and no die.}}

**The rule.** Each exchange, each side names one figure to fight before the dice are rolled. That figure's strength, gear and two dice are the side's total, plus 1 for every other figure of that side able to fight. The wound lands on the fighter. An escort — a soldier or a hireling — is the fighter in the first exchange. A town's defenders are its garrison and whatever soldiers or heroes stand there; a town with none is raided without a roll, and the attacker takes {{pct:rules.conflict.lootFraction}} of its stockpile unless a watchtower cancels it. A palisade adds 2 armour to a defending fighter, and no die.

**The data.** The battle rule gains the *one fighter, plus one a figure* clause; the palisade's text changes from a die to armour so the two sides of R-12 agree.

### P-15 · Hirelings can fall (R-18)

{{fig:plate:event-mercenaries-for-hire,plate:tile-town-hall|Mercenaries for hire, and the town hall that pays them; each now has a health.}}

**The rule.** A thug has H 5, a militiaman H 6, a hired blade H 7. A party or a cargo may hire at most one. A hireling at 0 health is dead and its fee is spent; a thug who refuses a monster goes home and keeps the fee.

**The data.** A health and a cap on the hirelings block.

### P-16 · Small rulings (R-26 to R-32, R-35, R-39)

- **A stranger.** The player running one rolls a d6: 1–2, a pedlar — deal {{rules.market.merchantStock.roadside}} items for sale as a merchant on the road; 3–4, a bearer of news — draw a quest card and offer it; 5, in need — give 1 food and 1 coin or lose nothing but the chance, and a fed stranger tells you the next event card; 6, a robber — fight as bandits (P-07), the card's own strength standing in for theirs.
- **Flotsam.** Roll the discovery d20 for the tens and a d6 for the units, and count that many rows down the *Commodities* table, rerolling past the end and rerolling livestock.
- **In use.** A vehicle pays upkeep in any round it moves or holds cargo.
- **Two weapons.** One weapon is swung in an exchange and one weapon wears. A dagger in the slot beside a sword is the weapon you swing when the sword is at 0.
- **The manor.** Lodges five, and one of the five must be a specialist.
- **Carries.** A figure may shoulder as much bulk of goods as its *carries* number, beside its kit and its coin; the goods are cargo and are robbed as cargo.
- **A fifth soldier.** A soldier beyond a barracks' garrison keeps the bed it had as a worker.
- **Trade at a distance.** Coin changes hands at once; goods change owner where they lie, and the buyer hauls them.
- **Tolls.** A bandits' or pirates' toll is reckoned at base value.

### P-17 · Vehicles and lairs (R-33, R-34)

{{fig:plate:monster-hoarwyrm|margin|The Hoarwyrm as a lair, mending one health a round up to its printed H.}}

**The rule.** A player building or buying a vehicle names which card of that mode it is, from those not in play. A monster left unresolved on its hex is a lair: it mends 1 health a round up to its printed H, and it is met again by whoever ends a leg there, without a discovery roll.

**The data.** The vehicle *Open* note goes; a `lairHealsPerRound` of 1 on the encounter rules.

### P-18 · Two numbers the notes are carrying (R-37, R-38)

**The rule.** A job on a bare hex or on a figure takes at most {{rules.construction.workersPerSiteDefault}} workers. Cut Peat is a job on a peat bog and Dig Sand a job on a sand bar; neither draws the deposit down, and a hex with one is worth finding.

**The data.** A worker cap for open ground on the construction rules; the two recipes name their deposit as their site; the two deposits carry no yield.
