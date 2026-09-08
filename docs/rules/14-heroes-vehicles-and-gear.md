# Heroes, vehicles and gear

Your hero is a card in a recess, four things in kit slots, and four tokens on tracks; a vehicle is exactly the same, on a board of its own. This chapter is what a character carries and how much, what happens at nothing, what wears when, and how a vehicle and its fittings are run.

{{fig:plate:character-chr-05,plate:vehicle-veh-03,plate:item-sword,plate:item-chain-mail,plate:modification-spinnaker|frieze}}

## The hero

{{fig:card:CHR-01|margin|A character card: name, calling, two traits and the strip H, S, M, coin and KG}}

Every player has one hero figure, and the character card in the IN PLAY recess is who it is. The card prints a name, a calling, two traits, and a summary strip — **H** health, **S** strength, **M** mana held in the body, **{{rules.currency.symbol}}** the coin it starts with, **KG** the most it can shoulder — and the board is set from the strip at setup ([Setting up](03-setting-up.md)). The traits apply for the whole game. Every character is in Annex II, *Characters*.

A hero moves as a figure and travels as a party with whoever goes with it ([The map and travel](08-the-map-and-travel.md)). It rolls no effort: heroes are figures, not workers.

## Strength and what it carries

{{fig:plate:item-bag,plate:item-satchel|A bag adds 2 kg to the limit and a satchel 4; the satchel keeps one named thing}}

Strength is one number doing three jobs. It is what you swing with in a battle, it is what a hard night takes a point off, and it is what you carry with: a figure shoulders **strength × {{rules.carrying.kgPerStrength}} kilograms**, and a character card prints the kilograms so nobody multiplies at the table.

1. Total the mass of everything the figure is wearing, wielding and stowing — every item card in its slots prints its KG — and add its purse at {{rules.carrying.coin.perKg}} coin to the kilogram.
2. That total must fit under the KG on the card. A figure may not take up an item that would put it over: load the thing onto a vehicle, hand it to someone with room, or leave it where it lies.
3. A bag adds 2 kg to the limit and a satchel 4; a Weightless Hand enchantment adds 10.

Nothing walks a token for this. Commodities in transit are cargo and measured in bulk, not mass; mana weighs nothing, though the talisman holding it does. A figure with no card carries strength × {{rules.carrying.kgPerStrength}} on its people's strength ([People, food and unrest](07-people.md)).

## Health and strength at nothing

{{fig:plate:item-dagger|margin|A dirk is never lost, whatever else a fallen character drops on the road}}

- **At 0 health** a character falls. It is carried to the nearest settlement, stays there until healed to half its H under medical aid, and loses everything it was carrying on the way — except what a card keeps: a dirk is never lost, and one item named when a satchel was packed stays in it.
- **At 0 strength** a figure neither fights nor carries. One night's sleep puts all of it back.

What mends each is in [The map and travel](08-the-map-and-travel.md).

## Kit

{{fig:board:player|wide|The player board: four kit slots, each with its wear ladder beside it}}

A hero carries at most **four things in play**, one per kit slot on the board, and a fifth means putting one down. A thing in a slot is a card: a weapon, a piece of armour, clothing, gear, a light, a pack of rations, a potion, a talisman, a tool. Anything else the hero owns is left in a town's stockpile or on a vehicle. Some cards share a slot by their own rule — a dagger sits in a slot with another weapon — and some refuse company: a two-handed weapon cannot be used with a shield.

{{fig:plate:item-bow,plate:item-helm,plate:item-travelling-cloak,plate:item-grappling-hook,plate:item-lantern,plate:talisman-tal-01|Six of the eight classes: weapon, armour, clothing, gear, light and talisman}}

Every item is one of eight classes, and each is in Annex II under its own deck:

| Class | What it does | Wears |
| --- | --- | --- |
| Weapon | Adds its battle number to your total | 1 a round of battle it is swung in |
| Armour | Adds its armour number to your total, once per piece worn — body, head, off-hand | 1 a round of battle it is worn in, win or lose |
| Clothing | Shrugs off weather and event penalties | as its card says |
| Gear | Rope, a hook, a bag, a glass, a map, a compass, a quiver | as its card says: a leg it is used on, a fall it stops |
| Light | Walks the night and enters caves | 1 a night leg or cave: a torch has {{items.items[id=torch].wear}}, a lantern {{items.items[id=lantern].wear}} |
| Provision | Food for the road; its wear is the days left | 1 for every figure it feeds at the end of a round |
| Potion | Drunk once | never: discard it on use |
| Talisman | Holds mana | never |

### Wear

{{fig:card:ITM-02|margin|A lantern's W in its strip is where the pip on the ladder starts}}

When a thing goes into a slot, set the pip on the wear ladder beside it to the **W** on its card. Knock it down {{rules.wear.perUse}} rung for every use its class says. At 0 the thing is finished: discard the card, clear the ladder, and whatever it was doing for you stops at once. A blacksmith mends up to {{rules.wear.repair.wearPerRound}} rungs a round at {{rules.wear.repair.coinPerPoint}} coin a rung and {{rules.wear.repair.effortHours}} hours of somebody's labour, never above the W on the card; a thing at 0 cannot be mended, because it is gone. The full wear table is in Annex I, *Wear*, and tools are in [Effort and jobs](05-effort-and-jobs.md).

## Vehicles

{{fig:plate:vehicle-veh-01,plate:vehicle-veh-05,plate:vehicle-veh-07,plate:vehicle-veh-11,plate:vehicle-veh-13,plate:vehicle-veh-17|One vehicle of each mode: train, ship, caravan, mount, sled and airship}}

A vehicle card is a specific machine — a named engine, a ship with a history, a horse — and it runs on the rules of its **mode**: the capacity, pace, needs, fuel and upkeep in [Trade and the market](09-trade-and-the-market.md) and [The map and travel](08-the-map-and-travel.md). The card prints two numbers, **H** the hull and **C** the bulk its hold takes, and a quirk, and where the card and the mode differ the card wins. Every vehicle is in Annex II, *Vehicles*.

{{fig:card:VEH-04|margin|Gullwing's card: H the hull, C the bulk its hold takes, and a quirk}}

A vehicle is built at the building its mode names — a cart or a sled at a carpenter's, a barge at a dock, a ship at a harbour, a train at a steelworks, an airship at a glassworks — paying the mode's inputs and hours, or bought for the mode's price at a settlement that could build it.

> **Open.** How a particular vehicle card is dealt when one is built or bought is not settled. Until it is, draw from the vehicle deck until a card of the right mode turns up, and shuffle the rest back.

### Running one

{{fig:plate:event-storms|third|Storms at sea; damage walks the hull down, and at 0 the cargo spills on the hex}}

1. **Deal it a player board of its own.** The card goes in the IN PLAY recess and the hull on the H track, set from the H box.
2. **Its cargo and its modifications lie in the four kit slots.** C is how much bulk the hold takes; there is no token for it — the cargo is what is in the slots.
3. **It moves as its mode**, one leg a round, rolling for discovery where it stops, and it may carry figures where its card says.
4. **Damage** from a fight, a hazard or an event walks the hull down. It is repaired at any settlement of town rank or better, 1 rung a round for 5 coin a rung; an engineer character mends one free.
5. **At 0 hull it is wrecked.** It spills its cargo on the hex, and salvage belongs to whoever reaches it first. Its fittings are salvaged on a d6 of 5 or more, one roll each; an enchantment never survives.

A vehicle belongs to its owner and needs no character aboard; a soldier or a hireling aboard escorts it.

## Modifications

{{fig:plate:modification-sweep-rig,plate:modification-copper-sheathing,plate:modification-iron-ram,plate:modification-ice-runners,plate:modification-compound-boiler,plate:modification-salamander-grate|Six fittings, each fitted at the building its card names, over one whole round}}

A modification is a fitting or an enchantment bolted, stitched or bound onto a vehicle after it is built. It is the one thing a player makes for a vehicle during a game, and every one is in Annex II, *Modifications*.

- **Slots.** A vehicle carries as many modifications as its mode's tier: {{modifications.slots.byTier.1}} on a tier-one mode, {{modifications.slots.byTier.2}} on tier two, {{modifications.slots.byTier.3}} on tiers three and four. One modification per slot, and never two of the same.
- **At most {{modifications.slots.enchantmentLimit}} enchantment**, whatever the slot count. Binding a second breaks the first and its mana is gone.
- **Fitting.** A modification is fitted at the building named on its card, over one whole round, with the vehicle standing there, paying its inputs and hours — or its mana, for an enchantment, by a character holding it.
- **Removing** a fitting takes a round and returns half its inputs, rounded down. Removing an enchantment breaks it and returns nothing.
- **Worth.** A modification adds its value to what the vehicle sells for, and an enchanted vehicle adds 20 coin for every mana bound.
- **Wrecked**, a vehicle takes its modifications with it, saving fittings on a 5 or more as above.

{{fig:plate:modification-keelbound|margin|Keelbound, an enchantment; one at most on a vehicle, and it never survives a wreck}}

A modification changes the numbers on the card it is tucked under and has none of its own: it carries no H, no C and no W.
