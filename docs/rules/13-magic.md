# Mana, talismans, spells and potions

Magic is small and it is economic. Mana comes out of dead monsters, is held in a body or a talisman, and is spent on spells that buy hours, movement, safety and repair. Potions are brewed out of things that grow, and are drunk once. This chapter is how mana is held and spent, and what the arcane trade is made of.

{{fig:plate:spell-fair-wind,plate:tile-alchemist,plate:monster-ash-drake,plate:event-wandering-wizard|frieze}}

## Mana

{{fig:icon:element-fire,icon:element-earth,icon:element-water,icon:element-air|Fire, earth, water and air: mana keeps the element of the monster it came from}}

{{fig:plate:people-elf|margin|An elf holds mana in the body; everyone else needs a talisman}}

Mana is not a commodity. It has no bulk, sits in no stockpile and goes in no crate. It is **held**, and it is counted on the M track of the player board whose card holds it ([On the table](02-on-the-table.md)).

- **Gained.** Slaying a monster yields mana of its element: the lesser of the monster's Y and one roll of the purple die, split among the characters who fought ([Monsters and battle](12-battle.md)). Some quests and hoards give mana outright, at the number they name, with no die.
- **Held.** Mana lives in a body that can hold it — an elf holds up to {{peoples.peoples[id=elf].manaStorage.innate}}, and a few characters print an M of their own — or in a **talisman** in a kit slot. Your M track may climb to the M on your card plus the M of every talisman in your slots, and no higher. Mana you gain with nowhere to hold it blows away at the end of the round.
- **Keeps its element.** Mana is fire, earth, water or air, as the monster was. A talisman may hold a mix; note each element's share beside the track.
- **Passed and stolen.** Characters in the same hex may pass mana between talismans freely. Mana in a talisman is stolen with the talisman, and a talisman is an item like any other.
- **Spent.** On spells, below, and on enchantments. Mana of the wrong element casts nothing.

## Talismans

{{fig:plate:talisman-tal-01,plate:talisman-tal-02,plate:talisman-tal-03,plate:talisman-tal-04,plate:talisman-tal-05,plate:talisman-tal-06|The six talismans, from a bone charm to a crystal phylactery; none of them wears}}

A talisman is an item from its own deck, made at an alchemist, bought from merchants, sold and stolen like anything else. Its card prints one number, **M**, the most mana it holds, from {{items.items[id=talisman-bone-charm].manaCapacity}} for a bone charm to {{items.items[id=talisman-crystal-phylactery].manaCapacity}} for a crystal phylactery. A talisman never wears: it has no W box and takes no pip. Every talisman is in Annex II, *Talismans*.

## Spells

{{fig:plate:spell-kindle,plate:spell-mend-stone,plate:spell-mist-veil,plate:spell-stormcall|One spell of each element: Kindle, Mend Stone, Mist Veil and Stormcall}}

A spell is cast by a character holding the mana it costs, in its element, in the body or in a carried talisman. Workers, soldiers and hirelings do not cast.

- **One spell per character per round.**
- Cast it when its effect makes sense: a combat spell before the dice are rolled, Mist Veil after the discovery roll.
- Pay the cost off the M track as it is cast.

| Spell | Element | Mana | What it does |
| --- | --- | --- | --- |
| Kindle | ![fire](../art/icons/element-fire.svg) fire | {{arcana.spells[id=kindle].cost}} | Light for a party until dawn, or one furnace batch without fuel |
| Ember Lash | ![fire](../art/icons/element-fire.svg) fire | {{arcana.spells[id=ember-lash].cost}} | Two extra dice for one fighter for one battle |
| Wayfire | ![fire](../art/icons/element-fire.svg) fire | {{arcana.spells[id=wayfire].cost}} | Burn a blocked route open, or cross one forest or marsh hex free; the hex is scorched for good |
| Mend Stone | ![earth](../art/icons/element-earth.svg) earth | {{arcana.spells[id=mend-stone].cost}} | Mend 2 on a building or vehicle, or 4 wear on a tool |
| Bulwark | ![earth](../art/icons/element-earth.svg) earth | {{arcana.spells[id=bulwark].cost}} | One fighter ignores 2 of the difference in one battle |
| Seam-Sense | ![earth](../art/icons/element-earth.svg) earth | {{arcana.spells[id=seam-sense].cost}} | Look at the deposit tokens under your hex and every hex beside it |
| Root-Snare | ![earth](../art/icons/element-earth.svg) earth | {{arcana.spells[id=root-snare].cost}} | One monster, party or figure in or beside your hex may not move next round |
| Cleanse | ![water](../art/icons/element-water.svg) water | {{arcana.spells[id=cleanse].cost}} | Cure one illness marker, or mend 2 health |
| Mist Veil | ![water](../art/icons/element-water.svg) water | {{arcana.spells[id=mist-veil].cost}} | One monster, bandit or pirate result becomes Nothing |
| Deep Draught | ![water](../art/icons/element-water.svg) water | {{arcana.spells[id=deep-draught].cost}} | Fill every empty barrel in one town with water; it ignores Drought this round |
| Fair Wind | ![air](../art/icons/element-air.svg) air | {{arcana.spells[id=fair-wind].cost}} | +2 hexes on one leg, +3 for a ship |
| Farspeak | ![air](../art/icons/element-air.svg) air | {{arcana.spells[id=farspeak].cost}} | Speak with any character on the board and strike a bargain at that distance |
| Loft | ![air](../art/icons/element-air.svg) air | {{arcana.spells[id=loft].cost}} | Lift one vehicle over one impassable hex |
| Stormcall | ![air](../art/icons/element-air.svg) air | {{arcana.spells[id=stormcall].cost}} | One party, vehicle or cargo you can see loses its next leg |

{{fig:card:SPL-09|margin|Wayfire as a card; where the table and the card differ, the card is the rule}}

The exact wording of every spell is on its card and in Annex II, *Spells*; where this table and the card differ, the card is the rule.

## Enchantments

{{fig:plate:tile-shrine|margin|A shrine binds an enchantment too, for half again the mana}}

A spell is spent and gone; an enchantment is mana laid into a thing and left there.

1. **Where.** At an alchemist, or at a shrine for half again the mana, rounded up.
2. **Who.** A character holding the mana, as for casting. Binding takes the character's whole round.
3. **One per object.** Binding a second enchantment on a thing breaks the first, and the mana in it is gone.
4. **Broken.** A destroyed object takes its enchantment with it; some event cards break one outright. A broken enchantment refunds nothing.
5. **Worth.** An enchanted object sells for its base value plus 20 coin for every mana bound into it, and scores 1 victory point for every 4 mana bound, rounded down.

{{fig:plate:modification-warded-hold|margin|A warded hold: mana bound onto a vehicle is a modification and takes a slot}}

There are {{count:arcana.enchantments.cards}} enchantments for buildings, tools, items and people — a hearth that burns without fuel, a tool that takes no wear, a cellar in which nothing spoils — and they are in Annex II, *Enchantments*. Enchantments bound onto a **vehicle** are modifications, and share a vehicle's slots with its fittings: [Heroes, vehicles and gear](14-heroes-vehicles-and-gear.md).

## Mana crystals and herbs

{{fig:plate:event-ley-surge|third|A ley surge; the crystal and the herbs are goods, and are priced and stolen as goods}}

Two arcane commodities feed the trade, and unlike mana they are goods: stored, carried in bulk, priced and stolen.

- **Mana crystal** is mined from a mana vein, the scarcest deposit on the board (survey difficulty {{deposits.deposits[id=mana-vein].surveyDifficulty}}). Its holder may shatter one for 2 mana of any one element, held at once or lost; mana never freezes back into crystal. Elves will not mine it.
- **Arcane herbs, moon blossom, ember root and frost lichen** are foraged and gathered. Forage needs nothing at all and finds an arcane herb on a 6; Harvest Arcane Herbs needs a knife on forest, marsh or mountain, and an elf takes two. Moon blossom opens only after dark and is picked on a night leg.

## Potions

{{fig:flow:alchemist|half|The alchemist's jobs; Brew Potion takes water and the ingredients the potion lists}}

A potion is brewed at an **alchemist** by an alchemist specialist with an alembic: Brew Potion is a job of {{recipes.recipes[id=brew-potion].effortHours}} hours and 1 water, plus the ingredients the potion lists. A potion is an item in the items deck, drunk once and discarded; it has no W box. Every potion buys something the game already counts — hours, movement, a wound mended, a survey made, a price shifted, a night walked — and the full list is in Annex II, *Items*. A Draught of Vigour steps a worker's die up two sizes; a Healing Draught cancels a worker lost or mends 3 health; Owl's Eye lets a party walk a night as if under a lantern; a Physic Tonic cures one illness anywhere. A potion brewed by an alchemist specialist lasts one round longer than its card says.
