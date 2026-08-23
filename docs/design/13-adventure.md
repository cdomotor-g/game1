# 13 — The adventure layer

The game began as a settlement economy. It has grown an open world around it:
travel with day and night, discovery rolls, monsters, mana, quests and named
vehicles. The design intent is that the adventure layer **hangs off the economy
rather than floating beside it** — every sword is still a production chain, every
quest reward is still coin, goods or hours, and the fastest way across the map is
still the railway somebody had to build.

The data lives in five files, one system each: `travel.json`, `discovery.json`,
`monsters.json`, `quests.json`, `arcana.json` — with the decks in
`vehicles.json` and `characters.json` and the talismans in `items.json`. Prose
here, numbers there.

## Days, nights and light

Every moving figure, party or vehicle gets one **day leg** per round, at the
speed in `travel.json` for its mode and the terrain letter codes it crosses.
The letter in the bottom corner of every hex is the ruling: G4 means a walker
crosses four grassland hexes in a day.

After the day leg a party may push on into a **night leg** — but the dark in the
Reach is genuinely dark:

| Light | Night speed |
| --- | --- |
| None | No travel. Even on a road. |
| Torch | 1 hex (2 on a road); spends one of the torch's uses |
| Lantern | Half day speed, rounded up; spends nothing |
| Owl's Eye potion | As a lantern, for one round |

A night leg is never free: it triggers a second discovery roll where the party
stops, with the monster band widened by 1. Trains run at night at full speed
with a lantern fitted; ships need one rigged and sail at half speed. Torches
burn out; lanterns are capital. That is the whole economy of light, and it makes
a lantern one of the best-value items in the game — which is why one is a quest
delivery.

**Caves** appear through discovery rolls on hills and mountains (the `caves`
terrain feature). A party may enter only with a lit torch or lantern; inside is
one draw on the cave column — hazard, trace, monster, or hoard. An emptied cave
becomes a known camp: resting there is free.

## Discovery rolls

When a figure, party or vehicle **ends** a movement leg, it rolls a d20 on the
discovery table for the hex it stopped in — one roll per leg, never one per hex
crossed. A road or rail on the hex overrides its terrain table.

The tables (in `discovery.json`, printed in the annex) are skewed on purpose:

- **Roads** grow merchants, travellers and bandits; monsters mostly keep clear.
- **Rail** rolls only at the stops — and never yields a commodity trace, because
  the ground either side of the line was picked clean while it was laid. Fewer
  stops, fewer rolls: the train is quietly the safest way across the map, and
  that is intended.
- **Desert, mountain, marsh** are monster country, exactly as the fiction says.
- **Commodity traces are rare everywhere.** Discovery is what you find when you
  are *not* looking. Prospecting, foraging and hunting are jobs with their own
  recipes and roll tables, and a discovery roll never replaces a survey — it
  just tells you where surveying might pay.

Any result that persists — a monster, a trace, a cave, a quest site — is marked
on the hex with a tile or figure, so the whole table can see the world filling
in as it is walked.

Event cards can move the odds: **Blood Moon** widens every monster band by 3,
**The Quiet Season** shrinks it by 2, and within one hex of a settlement the
band always shrinks by 2 — the land there is walked, hunted and lit. Bands
widen downward from their printed bottom and never claim 1 or 20.

## Monsters

Twelve for now, three per element — fire, earth, water, air — in
`monsters.json`, drawn when a discovery roll says **monster** and the drawn
card's terrain list includes the hex. Water monsters do not occur in the desert
because the deck itself refuses the draw.

Meeting one is a choice, and the choice is the player's unless the card says
otherwise:

| Option | How | What you get |
| --- | --- | --- |
| **Slay** | Fight, per the conflict rules | The monster's mana, in its element |
| **Enslave** | Win by 2+ net hits without killing | A d4 worker that eats and breeds unrest |
| **Befriend** | The gift on its card, then 4+ on a d6 | A guard for a hex, or an escort |
| **Domesticate** | Befriend or subdue, then 2 rounds at a pasture | The benefit on its card |
| **Flee** | Withdraw the way you came | Nothing, and nothing rolls |

Not everything can be tamed: the card lists which options it allows, and the
Gravel Wyrm, the Mire Strangler and the Deepwater Maw allow none of them. The
trade is deliberate — slaying pays mana now, the other three turn mana away for
a living asset that eats.

Seven of the twelve bestiary plates are accepted
([`docs/art/prompts/monsters.md`](../art/prompts/monsters.md) is the brief);
the three fire monsters, the Barrow Troll and the Stone Boar are still to be
drawn:

| | | | |
| --- | --- | --- | --- |
| ![Gravel Wyrm](../art/renders/monster-gravel-wyrm.png) | ![Mire Strangler](../art/renders/monster-mire-strangler.png) | ![Reef Serpent](../art/renders/monster-reef-serpent.png) | ![The Deepwater Maw](../art/renders/monster-deepwater-maw.png) |
| *Gravel Wyrm (MON-06)* | *Mire Strangler (MON-07)* | *Reef Serpent (MON-08)* | *The Deepwater Maw (MON-09)* |
| ![Rime Harpy](../art/renders/monster-rime-harpy.png) | ![Dust Devil](../art/renders/monster-dust-devil.png) | ![Storm Roc](../art/renders/monster-storm-roc.png) | |
| *Rime Harpy (MON-10)* | *Dust Devil (MON-11)* | *Storm Roc (MON-12)* | |

An unresolved monster stays on its hex as a figure and attacks whoever ends a
leg there. The wild accumulates.

## Mana, talismans and spells

Slaying a monster yields its **mana**, element-matched. Mana is not a commodity:
no bulk, no stockpile, no crate. It must be *held* — and almost nobody can hold
it in the body. Elves carry up to 3 innately; humans, dwarves, halflings and
orcs carry none at all. Everyone else's mana lives in a **talisman**
(`items.json`, class `talisman`): a bone charm holds 2, a copper amulet 4, a
crystal phylactery 10. Talismans are items — made, bought from merchants, sold,
and stolen with everything that implies. The card prints the capacity in the
**M** box of its summary strip; the charge is walked on the player board's M
track, like every other number that moves.

All six talisman studies are accepted — the only deck that gets the violet, and
the violet is a printing error, exactly as
[`docs/art/prompts/talismans.md`](../art/prompts/talismans.md) demands:

| | | |
| --- | --- | --- |
| ![Bone Charm](../art/renders/talisman-tal-01.png) | ![Weaver's Knot](../art/renders/talisman-tal-02.png) | ![Copper Amulet](../art/renders/talisman-tal-03.png) |
| *Bone Charm (TAL-01) — holds 2* | *Weaver's Knot (TAL-02) — holds 3* | *Copper Amulet (TAL-03) — holds 4* |
| ![Gold Locket](../art/renders/talisman-tal-04.png) | ![Gemfire Pendant](../art/renders/talisman-tal-05.png) | ![Crystal Phylactery](../art/renders/talisman-tal-06.png) |
| *Gold Locket (TAL-04) — holds 6* | *Gemfire Pendant (TAL-05) — holds 8* | *Crystal Phylactery (TAL-06) — holds 10* |

Mana is spent on **spells** (`arcana.json`): eight for now, two per element, a
minor and a major. Like the potions, every one buys the things the game actually
cares about — hours, movement, safety, repair — and none of them break the
economy. Casting is one spell per character per round, and only characters cast.

Mana crystals (the commodity) are frozen mana: shatter one for 2 mana of any
element, but mana never freezes back.

## Merchants, inns and hired muscle

**Merchants** are met on the road (a discovery result) or visited in any
settlement. Either way: shuffle the item deck and deal cards face up per
`rules.json → market.merchantStock` — 2 for a roadside pedlar, 3 in a village,
5 in a town, 7 in a city, 9 at the Seat. That is the stock, this visit, at base
value +10%. A bigger place is genuinely a better place to shop, and a roadside
merchant with exactly the lantern you need is a small story the dice wrote.

**Inns** do four jobs, and every printed settlement has one:

- **Rest** — 2 health per round (3 with a healer in town), 5 coin, free at home.
- **Hirelings** — a thug (20/journey), a militiaman (35) or a hired blade (60)
  escorts one journey or one cargo. They eat nothing; the fee is everything. A
  thug will not face a monster of strength 4+.
- **Rumours** — pay 5 coin, draw a quest card, accept or decline.
- **Drinks** — the old job: serve ale to clear unrest, per the recipe.

## Illness and healers

Illness arrived in the event deck: **Camp Fever** hits a travelling party,
**Marsh Ague** hits a region, **The Grey Pox** hits every town of four or more
workers, and the old **Plague** still stalks regions. The counters, in order of
cost: a **Healing Draught** or **Physic Tonic** spent (potions), a **healer**
specialist trained at the **infirmary** (a town with a fed healer loses no
worker to any illness card), and Doctor Marrow or Tilly Goodbarrel in the
character deck, who each ignore parts of it outright.

The pattern matches the rest of the deck: every illness card has a mitigation
you could have bought in advance, and the infirmary is the building whose
absence you get to regret by name.

## Quests and campaigns

The quest deck (`quests.json`) is the choose-your-own layer: cards that arrive
through discovery **omens** or inn rumours, are read aloud, and are **accepted
or declined** on the spot. Declined cards go to the bottom for someone else.

They run a deliberate range of complexity, 1 to 5: from *deliver 3 grain to
Grist* (an errand with a wage) through *slay the thing behind Umber Hollow's
missing-persons ledger*, up to two staged **campaigns** — the Ironspine Road,
which ends with cheap rail through the pass for whoever proved it, and the
Drowned Bell of Taleowick, which ends with the Deepwater Maw. Campaign stages
complete in order and pay per stage.

This is the part of the game designed to grow fattest over time. New quests are
new cards; a new map brings its own; nothing else has to change.

## Vehicles and characters

Two more decks give the moving pieces names:

**Vehicles** (`vehicles.json`) — twelve named machines, three each of train,
ship, caravan and horse. A card is a specific vehicle with a story and a quirk:
the Reach Flyer is fast and takes passengers, Old Smoke is cheap and limps, the
Fenway Wagons cross marsh that stops everything else on wheels. Each card
prints two boxes in its summary strip — **H** for the hull, **C** for the bulk of
its hold. A vehicle in play is dealt a **player board of its own** and run like a
player who is not a person: its card in the recess, its cargo and modifications in
the four kit slots, and its hull on that board's health track. At nothing it is
wrecked — it spills its cargo on the hex, and salvage is whoever reaches it first.

Eleven of the twelve catalogue plates are accepted
([`docs/art/prompts/vehicles.md`](../art/prompts/vehicles.md)); the Varl
Wagonrow (VEH-09) is still to be drawn:

| | | |
| --- | --- | --- |
| ![The Reach Flyer](../art/renders/vehicle-veh-01.png) | ![Steppe Hauler](../art/renders/vehicle-veh-02.png) | ![Old Smoke](../art/renders/vehicle-veh-03.png) |
| *The Reach Flyer (VEH-01)* | *Steppe Hauler (VEH-02)* | *Old Smoke (VEH-03)* |
| ![Gullwing](../art/renders/vehicle-veh-04.png) | ![Saltreach Pride](../art/renders/vehicle-veh-05.png) | ![Ember Coast Trader](../art/renders/vehicle-veh-06.png) |
| *Gullwing (VEH-04)* | *Saltreach Pride (VEH-05)* | *Ember Coast Trader (VEH-06)* |
| ![The Dunhaven Column](../art/renders/vehicle-veh-07.png) | ![The Fenway Wagons](../art/renders/vehicle-veh-08.png) | ![Bay Courser](../art/renders/vehicle-veh-10.png) |
| *The Dunhaven Column (VEH-07)* | *The Fenway Wagons (VEH-08)* | *Bay Courser (VEH-10)* |
| ![Steppe Pony](../art/renders/vehicle-veh-11.png) | ![Black Malchior](../art/renders/vehicle-veh-12.png) | |
| *Steppe Pony (VEH-11)* | *Black Malchior (VEH-12)* | |

**Characters** (`characters.json`) — eight named adventurers; each player's hero
figure takes one at setup for a face and a **summary strip** across the top of
the card, which is every number they have, printed once:

| H | S | D | M | ¤ | KG |
| --- | --- | --- | --- | --- | --- |
| health | strength | defence | mana held in the body | coin at setup | what they can shoulder |

Those are the player board's own track letters, so setting up is reading across
the strip and putting tokens down left to right. Nothing on the card moves —
there is no bar on any card any more — and the portrait gets the full width of
the card because there is nothing beside it.

### Strength — one arm, one number

Every item in `items.json` carries a **mass in kilograms**, and strength is the
other half of that arithmetic. There is no burden number and no burden track:
what a character can shoulder is **strength × 3 kilograms**, printed in the KG
box so nobody multiplies at the table and derived so it can never disagree with
the strength beside it. Ruk of the Red Road is strength 6 and carries 18 kg, the
most of anyone; Old Mother Keswick is strength 2 and carries 6. A tunic is half a
kilogram, a sword three-quarters, a plate harness 12.5 — which is to say plate is
for figures of strength 5 and up, and always was.

Nothing is walked for it. Total what the character is wearing, wielding and
stowing, and it either fits under the printed limit or it does not: load the rest
onto a vehicle, hand it to someone with room, or leave it where it lies. A
character carried to a settlement at 0 health loses the lot on the way.

Burden and strength were the same arm doing the same job under two numbers, and
one of them was a track a player moved every time they picked up a rope.

**Mass is not bulk.** Bulk is a commodity's storage-slot and shipping cost and
belongs to the cart; mass is what a thing weighs and belongs to whoever is
holding it. They never convert into each other, and nothing in the data has
both. Full rules in `rules.json → carrying`; the whole item table with masses is
in the [annex](14-annex.md#items).

### Defence — what makes a blow miss

Every character and every monster now carries a **defence** as well as a
strength, and the attack roll is the difference between the two: *less your own
strength, plus their defence*, clamped to 2+ and 6+. Strength used to sit on both
sides of that roll, which quietly made every strong thing armoured — a stone boar
barely swings and turns a sword, and until now it had no way to say so. Defence
is not armour: armour soaks hits after they land, defence stops them landing, and
a figure in plate has both.

### Eating and sleeping

Two kinds of hurt, mended two different ways, and the split is what makes a
night's camp a decision rather than a formality:

- **A round that ends with a figure unfed costs 1 health.** Every round it goes
  on. Being fed again does not put it back.
- **A night without a camp costs 1 strength** — travel a night leg, or push on
  past dark, and every figure in the party loses a point. Two hard nights turn a
  caravan guard into a passenger.
- **One night's sleep restores strength in full**, wherever it is taken: a camp
  on open ground does it as well as a bed at an inn.
- **Sleeping mends no health at all.** Health comes back only under medical aid —
  a healer, an infirmary, a physician standing there, or a potion.

That is why a lantern, a granary, an inn, a stretch of salted meat and Doctor
Elspeth Marrow are all worth their coin, and why the shorter leg with a camp at
the end of it often beats the longer one without.

All eight character plates are accepted
([`docs/art/prompts/characters.md`](../art/prompts/characters.md)):

| | | | |
| --- | --- | --- | --- |
| ![Corin Vale](../art/renders/character-chr-01.png) | ![Berga Understone](../art/renders/character-chr-02.png) | ![Sylvae of the Duskmere](../art/renders/character-chr-03.png) | ![Tilly Goodbarrel](../art/renders/character-chr-04.png) |
| *Corin Vale (CHR-01)* | *Berga Understone (CHR-02)* | *Sylvae of the Duskmere (CHR-03)* | *Tilly Goodbarrel (CHR-04)* |
| ![Ruk of the Red Road](../art/renders/character-chr-05.png) | ![Doctor Elspeth Marrow](../art/renders/character-chr-06.png) | ![Havik Coalbrand](../art/renders/character-chr-07.png) | ![Old Mother Keswick](../art/renders/character-chr-08.png) |
| *Ruk of the Red Road (CHR-05)* | *Doctor Elspeth Marrow (CHR-06)* | *Havik Coalbrand (CHR-07)* | *Old Mother Keswick (CHR-08)* |

**Card codes.** Every card carries a deck prefix and sequence — `VEH-03`,
`MON-09`, `QST-07`, `TAL-06`, `CHR-01` — with a `v2` suffix if a card is ever
reprinted changed. The scheme is defined in `vehicles.json → cardIdScheme`. The
code is print identity, not data identity: the `id` field is the identity, and
anyone forking the game is free to renumber.

**Card fronts.** `tools/build-cards.mjs` renders the fronts for these four
decks — characters, vehicles, monsters and talismans — from `data/*.json` and
the accepted plates, into [`docs/cards/`](../cards/index.html), to the two-plate
layer contract. Only a card whose plate has been accepted is rendered; edit the
data or the renders, re-run the tool, and never the SVGs.

Each deck's portrait window is the shape of that deck's plates, as tall as its
wordiest card leaves room for, and what fills it is a crop taken around the
plate's subject from [`docs/art/framing.json`](../art/framing.json) — a card
shows a character's face and hands, not the middle of the page they were drawn
on. The explorer's deck thumbnails crop through the same code.

**Printing them.** [`docs/cards/print.html`](../cards/print.html) collates any
selection of these cards onto A4 or US Letter at a true 63 × 88 mm — nine to a
sheet of A4 — each with a dotted line on its trim to cut along and its 3 mm of
bleed held outside that line. A cut card is the size of a standard playing card,
which is the point: it glues onto one and shuffles with the rest of the deck.

## Mini-maps

Some moments need more board than a single hex: a battle, a boarding action, a
farm becoming a village becoming a walled town. These resolve on **mini-maps** —
A4 landscape sheets, each dominated by one large hexagon subdivided into small
hexes, representing the inside of a single cell of the campaign map.

Three series, specified in [`docs/minimaps/`](../minimaps/README.md):

- **Holdings** — four blank settlement sheets, one per player, kept in front of
  you for as long as your farm, village or town stands on the big map.
- **Grounds** — one battle sheet per land terrain plus the shallows, pulled out
  when an encounter needs positioning and put away when it is done.
- **Places** — one sheet per named settlement on the Korvane Reach, used when
  play goes inside Vossgard or Dunhaven or Fen's End.

The side panels either side of the hexagon are working space: the **left panel
is the encounter tracker** (initiative, round, morale), the **right panel is the
holdings ledger** (buildings, garrison, stores). A battle sheet uses the left;
a settlement sheet mostly the right; both are printed on every sheet so no sheet
is ever the wrong sheet.

All thirty-two sheet artworks are accepted and live in
[`docs/minimaps/img/`](../minimaps/img/) — one of each series:

| | | |
| --- | --- | --- |
| ![PSM-01 — The River Meadow](../minimaps/img/PSM-01.png) | ![TBM-05 — the marsh ground](../minimaps/img/TBM-05.png) | ![SET-01 — Vossgard](../minimaps/img/SET-01.png) |
| *Holdings: The River Meadow (PSM-01)* | *Grounds: marsh (TBM-05)* | *Places: Vossgard (SET-01)* |

## The player board

The adventure layer arrived one card at a time — a health bar here, a burden bar
there, a mana bar inboard of that one — and every bar was on an edge, which is
the right place for a card you are holding and the wrong place for one lying on
the table. The [player board](08-components.md#the-player-board) is where they
all ended up, and taking them off the cards is what gave the portraits the full
width of the card.

One A4 landscape sheet each and every one identical, printed at
[`docs/boards/`](../boards/index.html). The card in play drops into a recess top
left, four more recesses take whatever that card has in play, the round's phases
print underneath, and five numbered tracks run up the middle:

| | Track | A rung is | Runs | Walked by |
| --- | --- | --- | --- | --- |
| **H** | Health | 1 | 0–14 | The figure, hurt and mended — medical aid only |
| **S** | Strength | 1 | 0–14 | Set from the card; a rung down for every night without a camp |
| **D** | Defence | 1 | 0–14 | Set from the card. Read by whoever is attacking you |
| **P** | Pace | 1 hex | 0–14 | Hexes left in this leg |
| **M** | Mana | 1 | 0–14 | The body and every talisman in a slot |

The ladders are numbered from the bottom and walked by a token, and they are
numbered and **nothing else** — no rung glyph, no plus, no minus. At a shade over
13 mm a column, a little mark saying which *kind* of number this is was competing
with the figure for the same three millimetres. Which way a token walks is a
sentence in the rulebook, where there is room to say it.

**Pace is the board's own**, and it is the one that was missing. A party looks
its day-leg speed up in [`travel.json`](../../data/travel.json) every single
round of the game and has never had anywhere to keep it: set the token at the
start of a leg, walk it down a rung per hex entered, halve it for a night leg
under a lantern. At zero the leg is over, and the discovery roll happens
wherever it stopped. It is pace rather than speed because strength has the S.

**A vehicle gets a board too.** It used to get a column — a sixth track called V,
counting damage on a wagon most players were not running, printed on everybody's
sheet. A vehicle in play is dealt one of these boards instead and run like a
player who is not a person, exactly as a monster met on the road is: its card in
the recess, its cargo and its modifications in the four kit slots, and its
**hull on the health track**, set from the printed H, down as it is damaged, up
as it is repaired at 5 coin a rung in any town, wrecked at nothing and spilling
its cargo on the hex. A hull is a body, and the board never had to learn anything
new to run one.

**Strength and defence are the pair that changed the game rather than recording
it.** Strength was already printed on every monster card as a threat rating; it
now settles attack rolls as well, and it swallowed burden while it was at it —
what a figure carries is strength × 3 kilograms and there is no second track for
it. Defence is its opposite number: shift the number you need by *less your own
strength, plus their defence*, so an even fight still hits on 4+ and a point of
advantage is worth exactly one pip. Neither ever adds dice; dice are what weapons
and armour give you. The full rule is in
[08-components.md](08-components.md#a-fight).

**Every track runs 0 to 14, and so does the game.** That is the ceiling on
everything a token walks — health (a hull included), strength, defence, mana — and
`tools/validate-data.mjs` sweeps the whole dataset against it, so a fifteenth
point of health fails the build rather than walking off a board somebody has
already printed. Kilograms are the one thing exempt, because nothing walks a
token for them.

**Print one more board than there are players.** The spare is the encounter
board: a discovery roll that turns up a monster or a stranger deals their card
onto it, its tracks are set from the card's summary strip, and it is played like
any other seat at the table until the encounter is over. That is what being
generic is for — the furniture does not care whether a person or a wolf is
sitting behind it.

The board is otherwise furniture, not a fifth deck. What it fixes is that a hero
in play was four tokens on three cards and a number somebody was holding in
their head.

## What this layer deliberately does not do

No experience points, no levels, no skill trees. A character gets better the
way a town does: by owning better things and standing nearer the railway. The
economy remains the progression system — the adventure layer is a new set of
ways to spend hours and a new set of things the hours can buy.
