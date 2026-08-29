# 07 — Peoples, magic and conflict

## Peoples

Five, each with a distinct economic shape rather than a stat block.

| People | Die | Workers | The shape | The catch |
| --- | --- | --- | --- | --- |
| Humans | d6 | 2 | Cheap housing compounds into more workers than anyone | Never exceptional at anything |
| Dwarves | d6 | 2 | d8 underground, cheap smithing | −1 on any farm: they must buy food |
| Elves | d6 | 2 | Double foraging and herbs, 2 fine cloth for 1 | Near-useless underground; won't touch a mana vein |
| Halflings | d6 | 3 | Crops ripen a round faster, huts cost 1 log | 2 extra food per town, every round |
| Orcs | d8 | 2 | Enormous output, +1 die raiding | Double tool wear; can't build tier 3+ without capturing it |

The trade-offs are real: dwarves can't farm, elves can't mine, orcs can't refine,
halflings are always hungry, humans are never exceptional. The full trait list is in
the [annex](14-annex.md).

The folio plates show each people doing what their rules say they are good at —
the accepted renders from [`docs/art/prompts/peoples.md`](../art/prompts/peoples.md);
the orc plate is still to be drawn:

| | | | |
| --- | --- | --- | --- |
| ![The human builder](../art/renders/people-human.png) | ![The dwarf miner](../art/renders/people-dwarf.png) | ![The elf weaver-forager](../art/renders/people-elf.png) | ![The halfling farmer](../art/renders/people-halfling.png) |
| *Humans — the builder* | *Dwarves — the miner* | *Elves — the weaver-forager* | *Halflings — the farmer* |

**Healers.** A new profession alongside the smiths and brewers: trained at the
**infirmary**, unlocked recipe *Tend the Sick*, and the difference between an illness
card being a story and being a body count. Physician, medic, witch doctor, bone-setter
— the title varies by people; the profession is the same, and the character deck
carries named examples of two of them.

## Magic

Deliberately small and economic rather than a second system bolted on.

**Mana crystals** come from mana veins — six per vein, difficulty 6 to survey, two
tokens on the whole board. They are the scarcest thing in the game.

**Arcane herbs** are foraged, which means a player with nothing but hands and a forest
has a route into the arcane economy. The ingredient list has grown three entries —
moon blossom (picked only at night), ember root (dug from dry ground) and frost
lichen (scraped off cold stone) — each with a potion that wants it.

**Potions** are brewed at an alchemist with an alembic, and they are one-shot effects on
the things the game actually cares about — hours, movement, safety:

| Potion | Effect |
| --- | --- |
| Draught of Vigour | One worker's die up two sizes for a round |
| Tireless Toil | Re-roll a worker's effort, keep the better |
| Brewmaster's Round | +1 effort to every worker in a town |
| Healing Draught | Cancel a worker loss, ignore a Plague card, or heal a character 3 |
| Swiftfoot | Double a figure's movement, or re-move a cargo |
| Stonehide | One unit ignores all hits in a battle |
| Prospector's Clarity | Auto-succeed a survey, reveal adjacent deposits |
| Merchant's Fortune | Shift a price band two steps for one sale |
| Owl's Eye | Travel tonight as if carrying a lantern |
| Physic Tonic | Cure one illness, anywhere |
| Emberguard Salve | Ignore every hit from a fire monster, one battle |

Every one of them buys hours, movement, safety or information. None of them break the
economy, and all of them are made of things the economy produces.

### The four elements

Every monster, every spell, every enchantment and every arcane fitting belongs to
one of four elements, and each one has a mark. The mark is **data** — one drawn
path per element in [`data/arcana.json`](../../data/arcana.json) — so a card, a
chit, this page and the explorer all say *fire* with the same four strokes, and
changing the mark changes all of them at once.

| Mark | Element | Ink | At home |
| --- | --- | --- | --- |
| ![](../art/icons/element-fire.svg) | **Fire** | oxide | Heat, forge-work, hunger. The desert and under the mountains. |
| ![](../art/icons/element-earth.svg) | **Earth** | verdigris | Stone, root, patience. Hills, barrows and old woods. |
| ![](../art/icons/element-water.svg) | **Water** | slate | Current, mist, depth. Marsh, shore and open sea. |
| ![](../art/icons/element-air.svg) | **Air** | soot | Wind, cold, distance. The tundra and the high passes. |

They are built on one construction, so they read as a set: a ground line, and
what the element does to it. Fire stands three tongues on it, earth puts a stone
on it and takes the ground down in strata, water replaces it with three swells,
air lifts three streamers clear of it altogether. None of them is a borrowed
alchemical triangle — [`04-iconography.md`](../art/04-iconography.md) bans
real-world symbols along with letterforms, and the triangles are the most
borrowed symbols there are.

**Mana and talismans.** Slaying a monster yields mana of its element — and mana must
be *held*. Elves carry up to 3 in the body; everyone else carries none, and stores it
in a **talisman**: six cards from a 2-capacity bone charm to a 10-capacity crystal
phylactery, each an item that is made, sold and stolen like any other. Mana is spent
on **spells** — fourteen now, listed in the
[annex](14-annex.md) — one cast per character per round. The whole system is defined
in `data/arcana.json` and reasoned through in [13-adventure.md](13-adventure.md).

**What a dead monster is actually worth is a die.** The **Y** box on the card is the
most mana its death can give up, and what you get is the **lesser of that number and a
roll of the purple mana die** — the fifth die in the box, bruise-coloured, rolled once
the moment the thing reaches 0 health. Never more than the monster had; often less.

It was a payment and it should always have been a ceiling. Vhalrik yielded six mana
every single time, which turned the largest fight in the game into an errand with a
price list attached: you knew before you drew a weapon exactly what the corpse was
worth, so the only question left was arithmetic. Now the number on the card is the
size of the prize and the die is how much of it you caught. A cinder wolf yields 1, so
any roll but a 1 is still 1 and a small monster stays a reliable trickle — the change
costs the low end nothing. Vhalrik yields 6, so the die *is* the story, and half the
time you walk away leaving four of it on the ground with nothing to blame. That is the
right way round: the small kill is wages, the great kill is a gamble, and an elf
standing there with an empty phylactery has a reason to hold their breath.

## Conflict

**A battle is one subtraction, and it is the subtraction the market already taught you.**
You total your **strength**, your **gear** and **two blue dice**. The thing in front of you
totals its **strength**, its **armour** and **two red dice**. The lower total loses health
equal to the difference, and a tie wounds nobody. One roll, one loser, one wound.

That is deliberately the identical gesture a player has already made once this round on the
ledger: two blue against two red, subtract, read the difference. Blue is what you want, red
is what stands in your way — in a price and in a fight, with no exceptions and no second
table. Five inks, five dice, and the two that settle a battle are the two that settle what
grain is worth. Nobody has to be told which pair is which because nobody was ever told in
the first place; they learned it buying wheat.

It used to be a **to-hit roll**: one die per unit, hitting on a 4, shifted by *less your own
strength, plus their defence*, clamped at 2+ and 6+, with armour then cancelling hits after
they had already landed. Four numbers, two of them doing nearly the same job, a clamp that
got looked up twice a battle because it is not obvious which way it runs, and a pile of
counted hits on the table between two players who each thought the other was keeping the
tally.

**Defence is gone, everywhere.** It is off the character cards, off the peoples, off the
monsters, off the player board and out of the summary strip letters — there is no **D** in
this game any more.

It earned its place under the old roll, and the argument for it was a good one. Strength
used to sit on *both* sides of the to-hit number, which quietly made every strong thing
armoured for no better reason than that it hit hard; splitting the two let a stone boar
barely swing and still turn a sword, let a rime harpy be neither and die easily, and let
Vhalrik be both. That is a fix for a to-hit roll, and it does not survive one.

Because once nobody is counting hits, **a number that makes you harder to hit and a number
that soaks the hit are the same number.** Both are an amount by which the other side's roll
fails to hurt you. The only thing that ever separated them was *when* you applied it — one
before the die, one after — and that bookkeeping is precisely what an opposed total deletes.
So there is one number, it is called **armour**, and a monster's hide sits on the same field
as a suit of plate. A stone boar is strength 2, armour 2: two numbers saying two different
things, where strength-and-defence was two numbers saying one.

What it cost is real and worth naming. A nimble figure and an armoured one used to be
describable apart, and on the battle roll they no longer are — dodging and plating are one
column now. The game bought agility back one storey along, where it does better work:
**pace**, which decides whether you are in the fight at all (see *Running away* in
[13-adventure.md](13-adventure.md)). Being hard to catch turned out to be a more interesting
sentence than being hard to hit.

**Worked, both ways.** A strength-4 character with a sword (+1) and a leather jerkin (+1)
rolls 7 on the blue: 4 + 2 + 7 = **13**. A cinder wolf is strength 2, armour 1, and rolls 7
on the red: **10**. The wolf takes 3. It has 4 health, so one more exchange finishes it, and
the character is untouched.

The same character meets **Vhalrik**, strength 7, armour 3, who rolls 8 on the red: **18**
against **13**. The character takes **5** — half of everything they have — and the whole
encounter was one roll with nothing counted, nothing clamped and nothing looked up. That is
the shape the roll is meant to have: a mismatch is a mauling, an even fight is a scratch,
and the interesting middle is where you decide whether to be in it.

**Equipment.** Gear is a number added to your side of the total, and that is nearly all of
it:

| | Adds | And |
| --- | --- | --- |
| Sword | +1 | The one every smith makes and most never make twice |
| Steel sword | +2 | Roll a **third blue die and keep the best two** |
| War hammer | +2 | Takes the **whole** of the other side's armour off their total — hide included |
| Plate harness | +3 | **−1 pace**, which is −1 on the footrace out |

Exactly one of those four is straight addition, and the other three each carry a rider that
does something a bigger number cannot. An **extra die kept best-of-two** is the only place in
the game where more dice are rolled than are counted, and it is worth about a point and a
half — so a steel sword is +2 and change, and the change is insurance against a bad roll
rather than a taller number, which is a different thing to own. The **war hammer's** clause
is worth nothing at all against a rime harpy (armour 0) and three whole points against
Vhalrik or a gravel wyrm (armour 3), on top of the +2 it adds either way: five points of
difference against the armoured, two against the bare. It is a weapon with an opinion about
what it is for, which is exactly what the century that made it had. And **plate** is the one
piece of gear that charges you on another track entirely — the best armour in the game makes
you the slowest figure in the party, so putting it on is a decision to *have* the fight
rather than to survive it.

Weapons and armour are now **their own decks**, split out of ITEMS with their own backs —
`WPN` under a double-ended blade in oxide, `ARM` under five interlocked mail rings in slate.
They left because they had stopped being items: an item is a thing you carry and these are
two numbers you add, and a player reaching for a weapon should not be shuffling past a
satchel and a coil of rope to find one.

Every weapon still runs through the same production chains as everything else: a steel sword
is two steel and a leather, which is a mine, a smelter, a steelworks, a pasture and a
tannery. Arming yourself properly means having built an economy first, which is the point.

**And all of it wears out.** Every piece of gear in that table takes **one wear point per
round of battle**, on both sides, win or lose — a blow you turned still dented the plate.
That is the same wear track a woodcutter's axe walks, and it is the reason a war is expensive
before anybody dies. Full rules in [13-adventure.md](13-adventure.md).

**Raiding.** Players may attack each other's towns and cargo. The winner loots 25% of
the loser's stockpile (40% for orcs). A palisade is **armour**: it adds to the battle total
of every defender behind it, exactly as a jerkin does for the figure wearing one, because a
wall and a coat are the same sentence at different scales. Garrisoned soldiers defend
automatically; a watchtower cancels one raid per game.

**Why war is expensive.** Soldiers produce nothing and eat every round. A player who
builds an army has spent hours, food and housing on something that does not compound.
That should make war a considered choice against a specific rival at a specific moment,
and make the player who wars constantly lose on points to the one who farmed.

The event deck also brings unaligned enemies — raiders, wolves, a dragon — so a player
with no soldiers at all is taking a real risk rather than a safe one.

**Monsters.** The discovery tables bring **fourteen** — three of each element, and then the
two dragons the sighting cards had been promising — and meeting one is a decision, not just a
fight: slay it for its mana, or — where the card allows — enslave it, befriend it with the
gift it names, or domesticate it into the strangest livestock you own. Or run, if you are
faster than it, which half the time you are not. Not everything can be tamed, and the ones
that cannot are the ones the campaigns are built around. The deck and the option rules live
in `data/monsters.json`; the reasoning is in [13-adventure.md](13-adventure.md).

**Hired muscle.** Between a soldier's standing cost and a war's, there is the inn: thugs,
militiamen and hired blades escort one journey for a flat fee and eat nothing. They fight at
the numbers printed on the inn's board, and those numbers are now the same three every other
figure in a battle brings — **strength, armour, and what they are swinging**:

| Hireling | Strength | Armour | Weapon | Per journey |
| --- | --- | --- | --- | --- |
| Thug | 4 | 0 | +1 | 20 |
| Militiaman | 3 | 2 | +1 | 35 |
| Hired blade | 5 | 1 | +2, and a third blue die kept best-two | 60 |

What you are paying for is legible now in a way it was not when the pair read 4/2, 3/4 and
5/4 and the second number was a defence nobody could picture. Add the three across and the
thug brings **5** to a total, the militiaman **6** and the blade **8** — which says something
the old numbers hid completely: *the ordinary man in a coat of plates is worth more in a
fight than the strong man in a shirt.* The thug's 4 is raw arm, and raw arm is what makes him
a soldier for escort purposes and what lets him carry your spare gear; it is also why he
refuses anything of strength 4 or more, and he is right to, because with nothing on he finds
out what a monster's armour was for. The militiaman is unremarkable and armoured, and armour
is added, so he stands in front of the thing the thug walked away from. The blade is better
than both by two clear points and rolls a third die on top, and costs three times the thug
for it. Costs in `rules.json → hirelings`.
