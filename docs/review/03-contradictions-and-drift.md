# Contradictions, and where the data says two things

The chapters were written from the data, and the data was found in a few places to disagree with itself — one field written after a rule changed, another not. Book I follows the rule the constants file states, which is the newest; the catalogue prints the card text, which is sometimes the older. Every one of these is a data edit, and none of them is a decision.

### R-08 · The granary: no spoilage, or a row up the strip

**Severity** wrong · **Where** Effort and jobs, *Storage*; Annex II, *Buildings* · **Status** Corrected in the chapter; the card text is Proposed

**As printed.** The granary's own card says food inside it "does not perish". The spoil rule says a stack in a granary reads one row up the spoil strip — a 5 or 6 costs what a 3 or 4 costs, a 1 or 2 nothing.

**The problem.** Two rules for one building, one of them on the card a player is holding. The chapter now says the strip; the catalogue still prints the card.

**Fix.** Edit the building's summary to the strip rule — P-08, line 1.

### R-09 · Three ways to mend a tool

**Severity** wrong · **Where** Effort and jobs, *Repair*; Annex I, *The flows of work* · **Status** Corrected in the chapter; the data is Proposed

**As printed.** The wear rule: {{rules.wear.repair.wearPerRound}} rungs a round, {{rules.wear.repair.coinPerPoint}} coin a rung, {{rules.wear.repair.effortHours}} hours at a blacksmith, never to full. The Repair Tool job's own text: "restore a tool's durability track to full for half its craft inputs". The tools data: repair costs half the build cost.

**The problem.** The flow diagram for the blacksmith prints the job text, so Annex I and Book I mend an axe two different ways.

**Fix.** Rewrite the job's effect to the wear rule and drop the third — P-08, line 2.

### R-10 · The lantern that does not wear, with eight wear on it

**Severity** wrong · **Where** The map and travel, *Night legs*; Annex II, *Items* · **Status** Corrected in the chapter; the card text is Proposed

**As printed.** The wear rule says a light wears one point a night leg; the lantern prints W {{items.items[id=lantern].wear}}; the lantern's own text says it "does not wear out".

**Fix.** Strike the sentence from the card — P-08, line 3.

### R-11 · Orcs are hard on tools by the hour

**Severity** wrong · **Where** People, food and unrest, *The five peoples*; Annex I, *Traits* · **Status** Proposed

**As printed.** The orc trait says tools "take 2 wear per effort hour instead of 1". Wear is one point a job, never an hour.

**Fix.** "Tools take 2 wear per job instead of 1" — P-08, line 4.

### R-12 · Hits, combat dice and defence dice, in a game that counts none of them

**Severity** wrong · **Where** Monsters and battle; Mana, talismans, spells and potions; Annex II throughout · **Status** Proposed

**As printed.** A battle is one opposed total: the lower loses health equal to the difference. Fourteen strings in the data still speak the old language of hits landed and dice added, and the catalogue prints every one of them on its card:

| Card | Says | Should say |
| --- | --- | --- |
| Ember Lash | +2 combat dice to one unit for one battle | Roll two more blue dice this battle and keep the best two |
| Bulwark | ignores 2 hits in one battle | The wound you take in this battle is 2 less, to a floor of nothing |
| Stonehide (Draught of Fortitude) | ignores all hits in one battle | Take no wound from one exchange |
| Emberguard Salve | ignores every hit from a fire monster | Take no wound from a fire monster this battle |
| Dragonsbane Draught | halves its hits, rounded up | Halve the wound you take, rounded up |
| Halflings, *Small* | −1 combat die per halfling unit | A halfling rolls one blue die instead of two |
| Orcs, *Raiders* | +1 combat die when attacking | Roll a third blue die when attacking and keep the best two |
| Palisade | defenders roll one extra combat die | Every defender behind it adds 2 armour — or rolls a third blue die; the design note argues for armour |
| Ruk of the Red Road | +1 combat die protecting cargo | Roll a third blue die and keep the best two |
| Iron Ram | +3 combat dice in the first round at sea | +3 to the total in the first exchange at sea |
| Caravan Robbery | an escorting soldier rolls a combat die; on 4+ the robbery fails | An escort rolls a d6; on 4 or more the robbery fails |
| Raiders | palisade grants +1 defence die | As the palisade's own rule |
| Border Dispute | both players roll 2 combat dice | Two blue dice against two red; the lower total gives up the disputed hex |
| Casting, *when* | combat spells before hits are applied | before the dice are rolled |

**Fix.** The right-hand column, into the data — P-08, line 5. Book I already reads each of them the way the right-hand column does.

### R-13 · The hero who never starves

**Severity** wrong · **Where** The map and travel, *Food and sleep on the road* · **Status** Proposed

**As printed.** The figure list describes a hero as one who "rolls an extra combat die, and never starves". The upkeep rule feeds every figure on the road or costs it health; the battle rule gives nobody a die for being a hero.

**Fix.** Rewrite the hero's summary — P-08, line 6.

### R-14 · Two purses

**Severity** wrong · **Where** The game, *Players*; Setting up, *Take your coin* · **Status** Corrected

**As printed.** The first chapter gave every player a purse of {{rules.currency.startingAmount}}; the setup chapter takes the coin printed on the character card, from {{characters.characters[id=mother-keswick].startingGold}} to {{characters.characters[id=penelope].startingGold}}.

**The problem.** Two chapters, two purses.

**Fix.** The card's purse is the purse, and the {{rules.currency.startingAmount}} is what a town starts with when no hero is dealt to it, which is the digital twin's case. The first chapter now says so.

### R-15 · Tools are sold at "a blacksmith rank town or better"

**Severity** nit · **Where** Trade and the market, *Shopping* · **Status** Proposed

**As printed.** The note under the merchant's stock is garbled, and the chapter read it as a town of town rank or better with a blacksmith. Printed settlements list no buildings, so nobody can tell which of them has one.

**Fix.** "Tools are sold at any settlement of town rank or better" — P-08, line 7.
