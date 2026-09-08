# People, food and unrest

Workers are the game: every one of them is a die every round, and every one of them eats. This chapter is where workers come from, what they cost to keep, what happens when you cannot feed them, and how a worker becomes a specialist or a soldier.

## Workers

A worker lives in a town and rolls one effort die there every Labour Roll. Workers come from housing and only from housing: when a housing building is finished, put new worker pieces in the town up to the beds it adds. A town can never hold more workers than its housing lodges, and a migrant card only brings people you have beds and food for.

| Housing | Lodges |
| --- | --- |
| Hut | {{buildings.buildings[id=hut].housing}} worker |
| Timber house | {{buildings.buildings[id=timber-house].housing}} workers |
| Brick house | {{buildings.buildings[id=brick-house].housing}} workers |
| Manor | {{buildings.buildings[id=manor].housing}} workers and {{buildings.buildings[id=manor].specialistHousing}} specialist |

What each costs to raise is on its card and in Annex I, *Buildings*. A worker cannot be moved from one town to another; it rolls where it lives.

Three kinds of piece live in a town:

- A **worker** rolls one die and eats {{rules.population.foodPerWorkerPerRound}} food a round.
- A **specialist** is a worker trained in a profession. It rolls the same die and eats the same food, and it unlocks the jobs its profession gates.
- A **soldier** is a worker under arms. It rolls no die, eats {{rules.population.foodPerWorkerPerRound}} food a round, and fights.

## Feeding

The Feeding phase is the fifth phase of the round ([The round](04-the-round.md)). In it every town pays {{rules.population.foodPerWorkerPerRound}} food for every worker, specialist and soldier living in it, out of the stock held in that town. Food lying in another town does not count, and neither does food on a cart between the two.

1. Count the mouths in the town.
2. Pay that much food and drink out of the town's stockpile. Any food commodity feeds one mouth per unit; bread feeds two; any drink feeds one, and a drink may lift a worker as well — ale gives one worker 1 extra hour next round, and a dwarf fed mead rolls one die size up.
3. A halfling town pays 2 extra food, whatever else lives in it.
4. Every mouth you could not feed adds {{rules.population.starvation.unrestPerUnfedWorker}} unrest to the town.
5. Then, still in this phase, goods above the town's storage spoil ([Effort and jobs](05-effort-and-jobs.md)) and every perishable stack you hold anywhere rolls the spoil die ([Trade and the market](09-trade-and-the-market.md)).

**The variety bonus.** Feed a town from {{rules.population.foodVarietyBonus.threshold}} or more different food or drink commodities in one Feeding phase, and every worker in it rolls 1 extra hour next round. A town fed on nothing but grain gets no bonus, however much grain it has.

**A feast** is 2 food per mouth. It clears more unrest, below, and nothing else.

A specialist that is not fed cannot work its profession: a town whose only smith went hungry cannot forge anything this round, even if the smith is still there.

## Unrest

Unrest is a count on the town. It starts at 0 and rises {{rules.population.starvation.unrestPerUnfedWorker}} for every unfed mouth in a Feeding phase, and event cards can add to it.

- **At {{rules.population.starvation.unrestToRiot}} unrest the town riots.** Every worker in it rolls a d4 instead of its own die until the unrest is cleared.
- **At 5 unrest a worker leaves,** for good. Take one worker piece off the town.
- A Strike card halves the effort of any town with unrest on it for a round.

Unrest clears slowly:

| Doing what | Clears |
| --- | --- |
| Feeding the town fully in a later round | 1 |
| A feast — 2 food per mouth | 2 |
| Serving ale at the town's inn | 1, and any Strike on the town ends at once |
| Serving wine at the inn | 2 |
| A Draught of Forbearance broached at the inn | 2 |

Serve Drinks is a job at an inn: one hour and one barrel. Every printed settlement has an inn; your own town needs the building.

## Specialists

A specialist is trained at a **guildhall**. Train Specialist is a job there, one training per guildhall per round: name a worker in the town and pay the profession's coin, and from the next round that worker is a smith, a weaver, a merchant, a healer or whatever you paid for. The professions, what each costs to train and what each one does are in Annex I, *Professions*. Every profession belongs to one building — a smith to the blacksmith, a farmer to the farm, an engineer to the rail depot — and gives its bonus there.

- A job that names a profession cannot be run without a fed specialist of that profession in the town.
- A specialist still rolls an ordinary effort die and may be allocated anywhere.
- There are {{count:peoples.professions}} professions.

## Soldiers

A soldier is a worker under arms. It stops rolling effort, keeps eating, and can fight, escort a cargo or a party, and garrison a town. A **barracks** holds {{buildings.buildings[id=barracks].garrison}} soldiers without using a bed of housing, and a soldier on the map moves as a figure does ([The map and travel](08-the-map-and-travel.md)). What a soldier is worth in a fight is in [Monsters and battle](12-battle.md).

> **Open.** No job yet says what it costs, in hours, to arm a worker. Until one does: at a town with a barracks, pay {{transport.figures[id=soldier].cost}} coin and take a worker off the labour roll; it is a soldier from the next round.

## Healers and illness

Some event cards make people sick or take workers away: Camp Fever, Marsh Ague, the Grey Pox and Plague. Every one of them names what would have blunted it. The building is the **infirmary** and the profession is the **healer**: a town with an infirmary and a fed healer loses no worker to Marsh Ague or the Grey Pox, and a healer's town loses one worker fewer to any illness card. Tend the Sick is the healer's job at the infirmary: cure one illness marker, or mend 2 health on a character resting there; spend a Physic Tonic with it and the whole town is cured. The cards themselves are in [Events](10-events.md).

## The five peoples

Your people sets the die your workers roll, how many you start with, what they like to eat, and a handful of traits that apply to every worker and figure of yours all game. The full trait list is in Annex I, *Peoples*, and each people's page is in Annex II.

| People | Die | Start with | In a sentence |
| --- | --- | --- | --- |
| Humans | {{peoples.peoples[id=human].effortDie}} | {{peoples.peoples[id=human].startingWorkers}} | {{peoples.peoples[id=human].summary}} |
| Dwarves | {{peoples.peoples[id=dwarf].effortDie}} | {{peoples.peoples[id=dwarf].startingWorkers}} | {{peoples.peoples[id=dwarf].summary}} |
| Elves | {{peoples.peoples[id=elf].effortDie}} | {{peoples.peoples[id=elf].startingWorkers}} | {{peoples.peoples[id=elf].summary}} |
| Halflings | {{peoples.peoples[id=halfling].effortDie}} | {{peoples.peoples[id=halfling].startingWorkers}} | {{peoples.peoples[id=halfling].summary}} |
| Orcs | {{peoples.peoples[id=orc].effortDie}} | {{peoples.peoples[id=orc].startingWorkers}} | {{peoples.peoples[id=orc].summary}} |

How a trait is applied:

- A trait that changes a **die** — a dwarf at a mine or quarry rolls a d8, an elf in any mine but a mana vein rolls a d4 — is a die step, taken in the order given in [Effort and jobs](05-effort-and-jobs.md).
- A trait that changes **hours** — a dwarf on a farm, orchard or vineyard rolls 1 less — is a flat modifier, and counts against the cap of {{rules.effort.maxFlatBonusPerWorker}} extra hours a worker can gain.
- A trait that changes a **cost** — huts for halflings, housing for humans, tools for dwarven smiths — is applied when the job is run or the building founded.
- A trait about **ground** — surefooted dwarves, longstriding elves — is applied to that people's figures and parties on the map.
- A trait about **food** — a halfling town's second breakfast, a dwarf fed mead — is applied in the Feeding phase.

A people's **strength** is what every figure of that people, other than a character, swings and carries with: {{peoples.peoples[id=human].strength.base}} for a human, {{peoples.peoples[id=dwarf].strength.base}} for a dwarf, {{peoples.peoples[id=elf].strength.base}} for an elf, {{peoples.peoples[id=halfling].strength.base}} for a halfling and {{peoples.peoples[id=orc].strength.base}} for an orc. A character uses the strength on its own card instead. Only an elf holds mana in the body, up to {{peoples.peoples[id=elf].manaStorage.innate}}; everyone else needs a talisman ([Mana, talismans, spells and potions](13-magic.md)).
