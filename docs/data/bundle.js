/* GENERATED FILE - do not edit. Run: npm run build (or node tools/build-data.mjs) */
window.GAME_DATA = {
  "$generated": "by tools/build-data.mjs - do not edit",
  "manifest": {
    "$comment": "Index of every dataset. The validator and the web bundler both read this, so adding a dataset means adding it here and nowhere else.",
    "version": "0.1.0",
    "name": "game1",
    "datasets": [
      {
        "key": "rules",
        "file": "rules.json",
        "collection": null,
        "summary": "Tunable constants: round structure, effort, food, storage, market, carrying, victory."
      },
      {
        "key": "commodities",
        "file": "commodities.json",
        "collection": "commodities",
        "idField": "id",
        "summary": "Every storable, tradeable good."
      },
      {
        "key": "tools",
        "file": "tools.json",
        "collection": "tools",
        "idField": "id",
        "summary": "Equipment that gates recipes and wears out."
      },
      {
        "key": "buildings",
        "file": "buildings.json",
        "collection": "buildings",
        "idField": "id",
        "summary": "Everything that can be constructed on a tile."
      },
      {
        "key": "recipes",
        "file": "recipes.json",
        "collection": "recipes",
        "idField": "id",
        "summary": "Every job worker effort can be allocated to."
      },
      {
        "key": "terrain",
        "file": "terrain.json",
        "collection": "terrains",
        "idField": "id",
        "summary": "Tile types, movement and build costs."
      },
      {
        "key": "deposits",
        "file": "deposits.json",
        "collection": "deposits",
        "idField": "id",
        "summary": "Finite mineral sources hidden under tiles."
      },
      {
        "key": "transport",
        "file": "transport.json",
        "collection": "modes",
        "idField": "id",
        "summary": "Cargo modes, routes and board figures."
      },
      {
        "key": "peoples",
        "file": "peoples.json",
        "collection": "peoples",
        "idField": "id",
        "summary": "Playable peoples, worker types and professions."
      },
      {
        "key": "events",
        "file": "events.json",
        "collection": "cards",
        "idField": "id",
        "summary": "The event deck."
      },
      {
        "key": "items",
        "file": "items.json",
        "collection": "items",
        "idField": "id",
        "summary": "Clothing, armour, weapons, potions, lights and talismans, each with its mass in kg."
      },
      {
        "key": "travel",
        "file": "travel.json",
        "collection": null,
        "summary": "Travel speeds by mode, terrain code and time of day; night, light and cave rules."
      },
      {
        "key": "discovery",
        "file": "discovery.json",
        "collection": "tables",
        "idField": "id",
        "summary": "Discovery roll tables: one d20 column per terrain code, plus road, rail and cave."
      },
      {
        "key": "arcana",
        "file": "arcana.json",
        "collection": "spells",
        "idField": "id",
        "summary": "Elements, mana storage and the spell list."
      },
      {
        "key": "monsters",
        "file": "monsters.json",
        "collection": "monsters",
        "idField": "id",
        "summary": "The monster deck, three per element, with encounter options."
      },
      {
        "key": "vehicles",
        "file": "vehicles.json",
        "collection": "vehicles",
        "idField": "id",
        "summary": "The vehicle deck: named trains, ships, caravans and horses, with damage and cargo bars."
      },
      {
        "key": "characters",
        "file": "characters.json",
        "collection": "characters",
        "idField": "id",
        "summary": "The character deck: named heroes with health, burden and mana bars."
      },
      {
        "key": "quests",
        "file": "quests.json",
        "collection": "quests",
        "idField": "id",
        "summary": "The quest deck: mini-quests and campaigns, accept or decline."
      },
      {
        "key": "modifications",
        "file": "modifications.json",
        "collection": "modifications",
        "idField": "id",
        "summary": "The modification deck: fittings and enchantments bolted onto a vehicle."
      },
      {
        "key": "components",
        "file": "components.json",
        "collection": "decks",
        "idField": "id",
        "summary": "How a physical game element is built - card stock, frame, bars, marks, deck backs and tokens. Content-free: the shapes everything else is drawn into."
      },
      {
        "key": "mint",
        "file": "mint.json",
        "collection": "lines",
        "idField": "id",
        "summary": "The mint: one line per kind of thing that goes designer -> artist -> build. Cards, maps, and tiles while they are shelved. Content-free, like components.json: it says what a line is, never what a card says."
      }
    ],
    "maps": {
      "$comment": "Boards. Each file in data/maps/ is one drawn map hexed for play: a grid, one character per hex, plus the settlements, regions and routes on it. They live in a directory rather than in 'datasets' above because a map is a document, not a table, and because adding the next one should not mean editing this file. The bundler picks up everything in the directory; tools/validate-map.mjs checks them against terrain.json.",
      "dir": "maps",
      "key": "maps",
      "idField": "id",
      "validatedBy": "tools/validate-map.mjs"
    },
    "references": {
      "$comment": "Cross-file references the validator checks. Path is a dotted path from the dataset root; [] means 'every element'.",
      "checks": [
        {
          "from": "commodities",
          "path": "commodities[].category",
          "to": "commodities.categories"
        },
        {
          "from": "tools",
          "path": "tools[].craft.inputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "tools",
          "path": "tools[].madeAt",
          "to": "buildings"
        },
        {
          "from": "tools",
          "path": "tools[].enables[]",
          "to": "recipes"
        },
        {
          "from": "buildings",
          "path": "buildings[].cost[].commodity",
          "to": "commodities"
        },
        {
          "from": "buildings",
          "path": "buildings[].category",
          "to": "buildings.categories"
        },
        {
          "from": "buildings",
          "path": "buildings[].requiresBuilding",
          "to": "buildings"
        },
        {
          "from": "buildings",
          "path": "buildings[].requiresDeposit",
          "to": "deposits"
        },
        {
          "from": "buildings",
          "path": "buildings[].requiresDepositAny[]",
          "to": "deposits"
        },
        {
          "from": "buildings",
          "path": "buildings[].terrain[]",
          "to": "terrain"
        },
        {
          "from": "buildings",
          "path": "buildings[].specialist",
          "to": "peoples.professions"
        },
        {
          "from": "recipes",
          "path": "recipes[].category",
          "to": "recipes.categories"
        },
        {
          "from": "recipes",
          "path": "recipes[].inputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "recipes",
          "path": "recipes[].outputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "recipes",
          "path": "recipes[].tool",
          "to": "tools"
        },
        {
          "from": "recipes",
          "path": "recipes[].toolBonus.tool",
          "to": "tools"
        },
        {
          "from": "recipes",
          "path": "recipes[].specialist",
          "to": "peoples.professions"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.building",
          "to": "buildings"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.orBuilding",
          "to": "buildings"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.deposit",
          "to": "deposits"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.terrain[]",
          "to": "terrain"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.orTerrain[]",
          "to": "terrain"
        },
        {
          "from": "recipes",
          "path": "recipes[].site.figure",
          "to": "transport.figures"
        },
        {
          "from": "terrain",
          "path": "terrains[].deposits[]",
          "to": "deposits"
        },
        {
          "from": "terrain",
          "path": "terrains[].features[]",
          "to": "terrain.features"
        },
        {
          "from": "deposits",
          "path": "deposits[].requiresBuilding",
          "to": "buildings"
        },
        {
          "from": "deposits",
          "path": "deposits[].yields[]",
          "to": "commodities"
        },
        {
          "from": "transport",
          "path": "modes[].craft.building",
          "to": "buildings"
        },
        {
          "from": "transport",
          "path": "modes[].craft.inputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "transport",
          "path": "modes[].requires",
          "to": "buildings",
          "allow": [
            "none",
            "road",
            "rail"
          ]
        },
        {
          "from": "transport",
          "path": "modes[].waters[]",
          "to": "terrain"
        },
        {
          "from": "transport",
          "path": "modes[].fuelPerTile[].commodity",
          "to": "commodities"
        },
        {
          "from": "transport",
          "path": "modes[].packaging[].commodity",
          "to": "commodities"
        },
        {
          "from": "transport",
          "path": "modes[].upgrade.commodity",
          "to": "commodities"
        },
        {
          "from": "peoples",
          "path": "professions[].building",
          "to": "buildings"
        },
        {
          "from": "peoples",
          "path": "professions[].unlocks[]",
          "to": "recipes"
        },
        {
          "from": "items",
          "path": "items[].class",
          "to": "items.classes"
        },
        {
          "from": "items",
          "path": "items[].madeAt",
          "to": "buildings"
        },
        {
          "from": "items",
          "path": "items[].inputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "items",
          "path": "items[].specialist",
          "to": "peoples.professions"
        },
        {
          "from": "events",
          "path": "cards[].category",
          "to": "events.categories"
        },
        {
          "from": "events",
          "path": "cards[].scope",
          "to": "events.scopes"
        },
        {
          "from": "discovery",
          "path": "tables[].terrain",
          "to": "terrain"
        },
        {
          "from": "discovery",
          "path": "tables[].entries[].result",
          "to": "discovery.results"
        },
        {
          "from": "arcana",
          "path": "spells[].element",
          "to": "arcana.elements"
        },
        {
          "from": "arcana",
          "path": "enchantments.cards[].element",
          "to": "arcana.elements"
        },
        {
          "from": "monsters",
          "path": "monsters[].element",
          "to": "arcana.elements"
        },
        {
          "from": "monsters",
          "path": "monsters[].terrains[]",
          "to": "terrain"
        },
        {
          "from": "vehicles",
          "path": "vehicles[].mode",
          "to": "transport",
          "allow": [
            "mounted"
          ]
        },
        {
          "from": "characters",
          "path": "characters[].people",
          "to": "peoples"
        },
        {
          "from": "characters",
          "path": "characters[].startsWith[]",
          "to": "items"
        },
        {
          "from": "quests",
          "path": "quests[].reward.items[]",
          "to": "items"
        },
        {
          "from": "quests",
          "path": "quests[].stages[].reward.items[]",
          "to": "items"
        },
        {
          "from": "modifications",
          "path": "modifications[].class",
          "to": "modifications.classes"
        },
        {
          "from": "modifications",
          "path": "modifications[].inputs[].commodity",
          "to": "commodities"
        },
        {
          "from": "modifications",
          "path": "modifications[].madeAt",
          "to": "buildings"
        },
        {
          "from": "modifications",
          "path": "modifications[].specialist",
          "to": "peoples.professions"
        },
        {
          "from": "modifications",
          "path": "modifications[].element",
          "to": "arcana.elements"
        },
        {
          "from": "modifications",
          "path": "modifications[].fits[]",
          "to": "transport",
          "allow": [
            "mounted",
            "any"
          ]
        }
      ]
    }
  },
  "rules": {
    "$comment": "Tunable constants for the whole game. Every number here is a dial, not a law. The web prototype reads these directly, so changing a value here changes the digital game AND the printed reference sheet.",
    "version": "0.1.0",
    "currency": {
      "id": "coin",
      "name": "Coin",
      "symbol": "¤",
      "startingAmount": 60
    },
    "round": {
      "phases": [
        {
          "id": "upkeep-events",
          "name": "Events",
          "summary": "In turn order, each player reveals one event card and resolves it. A card's scope decides who it hits: global cards hit everyone, whoever drew them."
        },
        {
          "id": "labour-roll",
          "name": "Labour Roll",
          "summary": "Each player rolls their effort dice: one die per worker. Pips = hours of effort available this round."
        },
        {
          "id": "actions",
          "name": "Actions",
          "summary": "In turn order, players spend effort, coin and commodities: allocate, build, move, trade, forage, fight."
        },
        {
          "id": "production-tick",
          "name": "Production Tick",
          "summary": "Advance every progress track: construction, crop growth, transport in transit, maturing goods."
        },
        {
          "id": "feeding",
          "name": "Feeding",
          "summary": "Each town must pay food upkeep from stock held in or near that town. Shortfalls cause unrest."
        },
        {
          "id": "market-turn",
          "name": "Market",
          "summary": "Market prices drift, demand cards flip, turn order passes to the left."
        }
      ],
      "turnOrder": "clockwise-rotating"
    },
    "effort": {
      "unit": "hour",
      "dieDefault": "d6",
      "dieLadder": [
        "d4",
        "d6",
        "d8",
        "d10",
        "d12"
      ],
      "dicePerWorker": 1,
      "pipsAreHours": true,
      "unspentEffortCarriesOver": false,
      "maxFlatBonusPerWorker": 3,
      "notes": "Modifiers may (a) add flat hours, (b) step a worker's die up or down the ladder, or (c) grant extra dice. Resolve in that order: extra dice, then ladder steps, then flat bonuses."
    },
    "population": {
      "foodPerWorkerPerRound": 1,
      "foodVarietyBonus": {
        "threshold": 3,
        "effect": "+1 flat effort to every worker in that town next round",
        "summary": "Feed a town from 3+ distinct food commodities in one Feeding phase to earn the variety bonus."
      },
      "starvation": {
        "unrestPerUnfedWorker": 1,
        "unrestToRiot": 3,
        "riotEffect": "Workers in that town roll d4 instead of their normal die until unrest clears; one worker leaves the town at 5 unrest.",
        "clearUnrest": "Feeding a town fully in a later round removes 1 unrest; a feast (2 food per worker) removes 2."
      },
      "specialistUpkeep": 1,
      "notes": "Specialists eat like everyone else, but a town without a fed specialist cannot run recipes that require that profession."
    },
    "construction": {
      "progressUnit": "build-point",
      "buildPointsPerEffortHour": 1,
      "materialsDueAt": "start",
      "partialBuildDecays": false,
      "workersPerSiteDefault": 3,
      "notes": "Materials are paid when the site is founded. Build points accumulate on a progress track; a building only produces once its track is full."
    },
    "tools": {
      "durabilityUnit": "wear-point",
      "wearPerEffortHour": 1,
      "brokenToolEffect": "Tool is removed from play. Effort already spent this round is not refunded.",
      "repairCost": {
        "fractionOfBuildCost": 0.5,
        "effortHours": 2,
        "requires": "blacksmith"
      },
      "sizes": [
        {
          "id": "small",
          "tier": 1,
          "outputMultiplier": 1,
          "durabilityMultiplier": 1,
          "costMultiplier": 1
        },
        {
          "id": "medium",
          "tier": 2,
          "outputMultiplier": 1.5,
          "durabilityMultiplier": 1.5,
          "costMultiplier": 2
        },
        {
          "id": "large",
          "tier": 3,
          "outputMultiplier": 2,
          "durabilityMultiplier": 2,
          "costMultiplier": 3.5
        }
      ],
      "notes": "Output multipliers round down, minimum 1. A size-3 tool never lets one worker exceed a site's worker cap - it just makes that worker's hours count for more."
    },
    "storage": {
      "stockpileFreeSlotsPerTown": 10,
      "warehouseSlotsEach": 12,
      "granarySlotsEach": 10,
      "granaryAcceptsOnly": [
        "food",
        "drink"
      ],
      "overflowRule": "Commodities above capacity spoil at the end of the Feeding phase: lose half, rounded up.",
      "notes": "Bulk values on commodities are slot costs. One slot holds one bulk point."
    },
    "market": {
      "priceBands": [
        0.5,
        0.75,
        1,
        1.25,
        1.5,
        2
      ],
      "startingBandIndex": 2,
      "buySpread": 0.15,
      "sellSpread": -0.15,
      "driftPerRound": "Each town shifts one random commodity family up or down one band.",
      "playerTradeIsFree": true,
      "merchantStock": {
        "$comment": "When a player meets a merchant - on the road via a discovery roll, or by visiting a settlement - shuffle the item deck and deal this many cards face up. That is what is for sale this visit, at base value +10%. Bigger places carry deeper stock.",
        "roadside": 2,
        "village": 3,
        "town": 5,
        "city": 7,
        "seat": 9,
        "notes": "Tools may be bought the same way at any settlement with a blacksmith rank town or better: deal from the tool list instead."
      },
      "notes": "Base values live on each commodity. Town price = baseValue x band. The spread is the house cut when trading with the board rather than another player."
    },
    "carrying": {
      "$comment": "What a figure carries on its own back, in kilograms. Mass and bulk are two different measures and never mix: bulk is a commodity's storage-slot and shipping cost (commodities.json, transport.json), mass is what one item weighs (items.json massKg). Cargo in a cart is bulk; the axe on your shoulder is mass.",
      "unit": "kg",
      "barStepKg": 2,
      "carryLimit": "Printed on the character card as the BURDEN bar up the right edge. A character's limit is their people's carry.baseKg adjusted for build and calling; other figures use their people's base unmodified.",
      "marker": "Stand a token on the burden bar and move it as the character picks things up and puts them down. Total the mass of everything they carry - worn, wielded and stowed alike - and stand the token on the first mark at or above that total.",
      "limitRule": "A character may not take up an item that would push the token past the top of the bar. Load it onto a vehicle, hand it to someone with room, or leave it where it lies.",
      "notCarried": [
        "Commodities in transit, which travel by transport mode and are measured in bulk.",
        "Coin.",
        "Mana, in the body or in a talisman - the talisman itself has mass, its charge does not."
      ],
      "onZeroHealth": "A character carried to a settlement at 0 health loses everything on the burden bar on the way; clear the token to zero.",
      "notes": "The bar is a capacity bar, so it sits on the right edge like every other capacity bar in the game, and it is ruled in slate like a vehicle's cargo. Where a character also has innate mana, the mana bar moves inboard of it and sits on the portrait."
    },
    "movement": {
      "landMoveCostDefault": 1,
      "figureMovePointsPerRound": 4,
      "cargoRequiresRoute": true,
      "legs": {
        "day": "Every moving figure, party or vehicle gets one day leg per round, at the speed in data/travel.json for its mode and the terrain letter codes it crosses.",
        "night": "After its day leg a party may push on into the dark - but only with a lit torch or lantern, and slower. Night speeds, and what each light allows, are in data/travel.json.",
        "nightRisk": "A party that travels a night leg makes a second discovery roll where it stops, with the monster band widened by 1. The dark is not neutral."
      },
      "notes": "Figures (prospectors, merchants, soldiers, characters) use move points. Cargo uses transport modes with capacity and speed - see transport.json. The printed speed table by mode, terrain code and time of day is data/travel.json."
    },
    "exploration": {
      "tilesFaceDownAtStart": true,
      "revealCost": {
        "effortHours": 1,
        "figure": "prospector"
      },
      "depositRevealDie": "d6",
      "discovery": {
        "die": "d20",
        "when": "When a figure, party or vehicle ends its movement leg, roll once on the discovery table for the hex it stopped in - one roll for the leg, not one per hex crossed.",
        "tables": "data/discovery.json, one column per terrain letter code, with road and rail overrides",
        "placement": "Any result that persists - a monster, a trace, a cave, a quest site - is marked on the hex with a tile or figure so the whole table can see it.",
        "notes": "Discovery is what you find when you are NOT looking. Prospecting, foraging and hunting have their own recipes and roll tables, and a discovery roll never replaces a survey."
      },
      "notes": "A prospector entering a face-down tile flips it. Flipping reveals terrain immediately; deposits need a survey roll on top of that."
    },
    "rest": {
      "where": "Any settlement with an inn - every printed settlement has one; a player-built town needs the inn building.",
      "healthPerRound": 2,
      "healthPerRoundWithHealer": 3,
      "cost": {
        "coin": 5,
        "note": "Waived in your own town, and at any inn a quest reward names."
      },
      "notes": "A resting character does nothing else that round. Vehicle damage is repaired separately - 1 box per round in any settlement of town rank or better, paying 5 coin per box."
    },
    "hirelings": {
      "where": "Hired at any inn, in any settlement of village rank or better.",
      "options": [
        {
          "id": "thug",
          "name": "Thug",
          "coinPerJourney": 20,
          "combatDice": 1,
          "note": "Refuses to fight monsters of strength 4 or more. Counts as a soldier for escort purposes."
        },
        {
          "id": "militia",
          "name": "Militiaman",
          "coinPerJourney": 35,
          "combatDice": 1,
          "armourValue": 1,
          "note": "Steady. Fights anything."
        },
        {
          "id": "blade",
          "name": "Hired Blade",
          "coinPerJourney": 60,
          "combatDice": 2,
          "note": "Fights anything, and rolls first like a bow."
        }
      ],
      "notes": "A hireling escorts one journey - a travelling party or a cargo in transit - then goes home. Hirelings eat no food; the fee is everything. An escorted cargo drops its theft risk to 0, same as a soldier escort."
    },
    "conflict": {
      "combatDie": "d6",
      "hitsOn": 4,
      "roundsPerBattle": 1,
      "retreatAllowed": true,
      "lootFraction": 0.25,
      "notes": "Attacker and defender each roll one die per unit, modified by weapons and armour. Both sides apply hits simultaneously."
    },
    "victory": {
      "gameLengthRounds": 24,
      "conditions": [
        {
          "id": "prosperity",
          "name": "Prosperity",
          "summary": "Points for fed population, completed buildings and luxury goods held at game end."
        },
        {
          "id": "industry",
          "name": "Industry",
          "summary": "Points for the depth of your longest completed production chain and for each tier-3 good produced."
        },
        {
          "id": "network",
          "name": "Network",
          "summary": "Points for towns connected by road, rail and sea routes you built."
        }
      ],
      "notes": "Scoring is deliberately plural so that a mining-and-rail strategy and a farming-and-trade strategy can both win."
    }
  },
  "commodities": {
    "$comment": "A commodity is a storable, tradeable good that sits in a stockpile and occupies storage slots. Effort, time and tool durability are NOT commodities - see docs/GLOSSARY.md.",
    "version": "0.1.0",
    "categories": [
      {
        "id": "raw",
        "name": "Raw",
        "summary": "Pulled straight out of the land."
      },
      {
        "id": "fuel",
        "name": "Fuel",
        "summary": "Burned to drive furnaces, kilns and engines."
      },
      {
        "id": "material",
        "name": "Material",
        "summary": "Processed stock that other things are made from."
      },
      {
        "id": "textile",
        "name": "Textile",
        "summary": "Fibres, yarn and cloth."
      },
      {
        "id": "food",
        "name": "Food",
        "summary": "Counts towards the Feeding phase."
      },
      {
        "id": "drink",
        "name": "Drink",
        "summary": "Counts as food, and most drinks carry a morale kicker."
      },
      {
        "id": "livestock",
        "name": "Livestock",
        "summary": "Living animals. Breed slowly, eat a little, produce a lot."
      },
      {
        "id": "container",
        "name": "Container",
        "summary": "Needed to hold liquids and to ship bulk goods."
      },
      {
        "id": "luxury",
        "name": "Luxury",
        "summary": "Low bulk, high value, scores at game end."
      },
      {
        "id": "arcane",
        "name": "Arcane",
        "summary": "Inputs to potions and enchantment."
      },
      {
        "id": "manufactured",
        "name": "Manufactured",
        "summary": "Finished goods made of several materials."
      }
    ],
    "commodities": [
      {
        "id": "logs",
        "name": "Logs",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 4,
        "tags": [
          "bulky"
        ],
        "notes": "Felled trees. Useless as a building material until sawn."
      },
      {
        "id": "stone",
        "name": "Stone",
        "category": "raw",
        "unit": "block",
        "bulk": 2,
        "baseValue": 5,
        "tags": [
          "bulky"
        ]
      },
      {
        "id": "clay",
        "name": "Clay",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 3,
        "tags": [
          "bulky"
        ]
      },
      {
        "id": "sand",
        "name": "Sand",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 2,
        "tags": [
          "bulky"
        ]
      },
      {
        "id": "iron-ore",
        "name": "Iron Ore",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 6,
        "tags": [
          "bulky",
          "ore"
        ]
      },
      {
        "id": "copper-ore",
        "name": "Copper Ore",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 7,
        "tags": [
          "bulky",
          "ore"
        ]
      },
      {
        "id": "gold-ore",
        "name": "Gold Ore",
        "category": "raw",
        "unit": "load",
        "bulk": 2,
        "baseValue": 14,
        "tags": [
          "bulky",
          "ore"
        ]
      },
      {
        "id": "salt",
        "name": "Salt",
        "category": "raw",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 6,
        "tags": [
          "preservative"
        ]
      },
      {
        "id": "water",
        "name": "Water",
        "category": "raw",
        "unit": "barrel",
        "bulk": 1,
        "baseValue": 1,
        "tags": [
          "liquid"
        ],
        "notes": "Free to draw at a well or any water-adjacent tile, but it still needs a barrel to move."
      },
      {
        "id": "coal",
        "name": "Coal",
        "category": "fuel",
        "unit": "load",
        "bulk": 2,
        "baseValue": 8,
        "tags": [
          "bulky",
          "fuel"
        ],
        "notes": "Mined from a coal deposit. The best furnace fuel and the only fuel a steelworks accepts at full rate."
      },
      {
        "id": "peat",
        "name": "Peat",
        "category": "fuel",
        "unit": "load",
        "bulk": 2,
        "baseValue": 3,
        "tags": [
          "bulky",
          "fuel"
        ],
        "notes": "Cut from marsh tiles with a shovel. Poor heat, but no mine required."
      },
      {
        "id": "charcoal",
        "name": "Charcoal",
        "category": "fuel",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 7,
        "tags": [
          "fuel"
        ]
      },
      {
        "id": "crude-oil",
        "name": "Crude Oil",
        "category": "fuel",
        "unit": "barrel",
        "bulk": 2,
        "baseValue": 16,
        "tags": [
          "liquid",
          "fuel",
          "late-game"
        ]
      },
      {
        "id": "lumber",
        "name": "Lumber",
        "category": "material",
        "unit": "bundle",
        "bulk": 1,
        "baseValue": 9,
        "tags": [
          "building-material"
        ]
      },
      {
        "id": "brick",
        "name": "Brick",
        "category": "material",
        "unit": "pallet",
        "bulk": 2,
        "baseValue": 12,
        "tags": [
          "building-material"
        ]
      },
      {
        "id": "pig-iron",
        "name": "Pig Iron",
        "category": "material",
        "unit": "ingot",
        "bulk": 1,
        "baseValue": 14,
        "tags": [
          "metal"
        ]
      },
      {
        "id": "steel",
        "name": "Steel",
        "category": "material",
        "unit": "ingot",
        "bulk": 1,
        "baseValue": 26,
        "tags": [
          "metal",
          "tier3"
        ]
      },
      {
        "id": "copper",
        "name": "Copper",
        "category": "material",
        "unit": "ingot",
        "bulk": 1,
        "baseValue": 18,
        "tags": [
          "metal"
        ]
      },
      {
        "id": "gold",
        "name": "Gold",
        "category": "material",
        "unit": "ingot",
        "bulk": 1,
        "baseValue": 40,
        "tags": [
          "metal",
          "precious"
        ]
      },
      {
        "id": "glass",
        "name": "Glass",
        "category": "material",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 20,
        "tags": [
          "fragile"
        ]
      },
      {
        "id": "rope",
        "name": "Rope",
        "category": "material",
        "unit": "coil",
        "bulk": 1,
        "baseValue": 8
      },
      {
        "id": "leather",
        "name": "Leather",
        "category": "material",
        "unit": "roll",
        "bulk": 1,
        "baseValue": 11
      },
      {
        "id": "ironware",
        "name": "Ironware",
        "category": "manufactured",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 22,
        "tags": [
          "fittings"
        ],
        "notes": "Nails, hinges, bands and brackets. Brick and stone buildings need it; tools consume it."
      },
      {
        "id": "parchment",
        "name": "Parchment",
        "category": "manufactured",
        "unit": "bundle",
        "bulk": 1,
        "baseValue": 15
      },
      {
        "id": "wool",
        "name": "Wool",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 6
      },
      {
        "id": "flax",
        "name": "Flax",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 5
      },
      {
        "id": "cotton",
        "name": "Cotton",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 7
      },
      {
        "id": "yarn",
        "name": "Yarn",
        "category": "textile",
        "unit": "bundle",
        "bulk": 1,
        "baseValue": 12
      },
      {
        "id": "cloth",
        "name": "Cloth",
        "category": "textile",
        "unit": "bolt",
        "bulk": 1,
        "baseValue": 20
      },
      {
        "id": "fine-cloth",
        "name": "Fine Cloth",
        "category": "textile",
        "unit": "bolt",
        "bulk": 1,
        "baseValue": 38,
        "tags": [
          "tier3"
        ]
      },
      {
        "id": "hide",
        "name": "Hide",
        "category": "textile",
        "unit": "roll",
        "bulk": 1,
        "baseValue": 6
      },
      {
        "id": "grain",
        "name": "Grain",
        "category": "food",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 5,
        "tags": [
          "staple",
          "seed"
        ],
        "notes": "Also the seed stock for sowing."
      },
      {
        "id": "flour",
        "name": "Flour",
        "category": "food",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 9
      },
      {
        "id": "bread",
        "name": "Bread",
        "category": "food",
        "unit": "batch",
        "bulk": 1,
        "baseValue": 14,
        "perishRounds": 3,
        "tags": [
          "staple"
        ],
        "notes": "Feeds 2 workers per unit instead of 1."
      },
      {
        "id": "vegetables",
        "name": "Vegetables",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 6,
        "perishRounds": 3
      },
      {
        "id": "mushrooms",
        "name": "Mushrooms",
        "category": "food",
        "unit": "basket",
        "bulk": 1,
        "baseValue": 7,
        "perishRounds": 2,
        "tags": [
          "foraged",
          "potion-ingredient"
        ]
      },
      {
        "id": "berries",
        "name": "Berries",
        "category": "food",
        "unit": "basket",
        "bulk": 1,
        "baseValue": 5,
        "perishRounds": 2,
        "tags": [
          "foraged",
          "potion-ingredient"
        ]
      },
      {
        "id": "apples",
        "name": "Apples",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 6,
        "perishRounds": 4
      },
      {
        "id": "fish",
        "name": "Fish",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 7,
        "perishRounds": 2
      },
      {
        "id": "meat",
        "name": "Meat",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 10,
        "perishRounds": 2
      },
      {
        "id": "salted-meat",
        "name": "Salted Meat",
        "category": "food",
        "unit": "barrel",
        "bulk": 1,
        "baseValue": 18,
        "tags": [
          "preserved"
        ],
        "notes": "Does not perish. The commodity that makes long caravans and sea voyages viable."
      },
      {
        "id": "milk",
        "name": "Milk",
        "category": "food",
        "unit": "churn",
        "bulk": 1,
        "baseValue": 4,
        "perishRounds": 1,
        "tags": [
          "liquid"
        ]
      },
      {
        "id": "cheese",
        "name": "Cheese",
        "category": "food",
        "unit": "wheel",
        "bulk": 1,
        "baseValue": 16,
        "tags": [
          "preserved"
        ]
      },
      {
        "id": "honey",
        "name": "Honey",
        "category": "food",
        "unit": "jar",
        "bulk": 1,
        "baseValue": 12,
        "tags": [
          "potion-ingredient"
        ]
      },
      {
        "id": "eggs",
        "name": "Eggs",
        "category": "food",
        "unit": "tray",
        "bulk": 1,
        "baseValue": 5,
        "perishRounds": 2
      },
      {
        "id": "grapes",
        "name": "Grapes",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 8,
        "perishRounds": 2
      },
      {
        "id": "hops",
        "name": "Hops",
        "category": "food",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 7
      },
      {
        "id": "ale",
        "name": "Ale",
        "category": "drink",
        "unit": "barrel",
        "bulk": 2,
        "baseValue": 24,
        "tags": [
          "liquid",
          "morale"
        ],
        "notes": "Grain-brewed. Feeds 1 worker and grants +1 flat effort to one worker next round."
      },
      {
        "id": "mead",
        "name": "Mead",
        "category": "drink",
        "unit": "barrel",
        "bulk": 2,
        "baseValue": 32,
        "tags": [
          "liquid",
          "morale"
        ],
        "notes": "Honey-brewed. Favoured by dwarves - dwarf workers fed mead roll one die size up."
      },
      {
        "id": "wine",
        "name": "Wine",
        "category": "drink",
        "unit": "barrel",
        "bulk": 2,
        "baseValue": 40,
        "tags": [
          "liquid",
          "morale",
          "luxury-adjacent"
        ]
      },
      {
        "id": "sheep",
        "name": "Sheep",
        "category": "livestock",
        "unit": "head",
        "bulk": 2,
        "baseValue": 18,
        "tags": [
          "breeds",
          "eats"
        ]
      },
      {
        "id": "cattle",
        "name": "Cattle",
        "category": "livestock",
        "unit": "head",
        "bulk": 3,
        "baseValue": 30,
        "tags": [
          "breeds",
          "eats"
        ]
      },
      {
        "id": "pig",
        "name": "Pig",
        "category": "livestock",
        "unit": "head",
        "bulk": 2,
        "baseValue": 20,
        "tags": [
          "breeds",
          "eats"
        ]
      },
      {
        "id": "chickens",
        "name": "Chickens",
        "category": "livestock",
        "unit": "coop",
        "bulk": 1,
        "baseValue": 9,
        "tags": [
          "breeds",
          "eats"
        ]
      },
      {
        "id": "horse",
        "name": "Horse",
        "category": "livestock",
        "unit": "head",
        "bulk": 3,
        "baseValue": 45,
        "tags": [
          "breeds",
          "eats",
          "draught"
        ],
        "notes": "Also a transport upgrade: a horse assigned to a cart raises its speed by 1."
      },
      {
        "id": "barrel",
        "name": "Barrel",
        "category": "container",
        "unit": "each",
        "bulk": 1,
        "baseValue": 8,
        "tags": [
          "reusable"
        ],
        "notes": "Required to hold any liquid. Returned empty when the liquid is consumed."
      },
      {
        "id": "crate",
        "name": "Crate",
        "category": "container",
        "unit": "each",
        "bulk": 1,
        "baseValue": 6,
        "tags": [
          "reusable"
        ]
      },
      {
        "id": "sack",
        "name": "Sack",
        "category": "container",
        "unit": "each",
        "bulk": 0.5,
        "baseValue": 3,
        "tags": [
          "reusable"
        ]
      },
      {
        "id": "spices",
        "name": "Spices",
        "category": "luxury",
        "unit": "chest",
        "bulk": 0.5,
        "baseValue": 45,
        "tags": [
          "trade-good",
          "import-only"
        ],
        "notes": "Nothing on this map grows spices. They arrive at coastal markets and event cards, and that scarcity is the point - they are the pure trading commodity."
      },
      {
        "id": "gems",
        "name": "Gems",
        "category": "luxury",
        "unit": "pouch",
        "bulk": 0.5,
        "baseValue": 60,
        "tags": [
          "trade-good",
          "theft-target"
        ]
      },
      {
        "id": "jewellery",
        "name": "Jewellery",
        "category": "luxury",
        "unit": "case",
        "bulk": 0.5,
        "baseValue": 110,
        "tags": [
          "trade-good",
          "theft-target",
          "tier3"
        ]
      },
      {
        "id": "arcane-herb",
        "name": "Arcane Herb",
        "category": "arcane",
        "unit": "bundle",
        "bulk": 0.5,
        "baseValue": 20,
        "tags": [
          "foraged",
          "potion-ingredient"
        ]
      },
      {
        "id": "mana-crystal",
        "name": "Mana Crystal",
        "category": "arcane",
        "unit": "shard",
        "bulk": 0.5,
        "baseValue": 55,
        "tags": [
          "potion-ingredient",
          "theft-target"
        ]
      },
      {
        "id": "moon-blossom",
        "name": "Moon Blossom",
        "category": "arcane",
        "unit": "posy",
        "bulk": 0.5,
        "baseValue": 14,
        "perishRounds": 2,
        "tags": [
          "foraged",
          "potion-ingredient"
        ],
        "notes": "Opens only after dark. Picked on a night leg - see travel.json."
      },
      {
        "id": "ember-root",
        "name": "Ember Root",
        "category": "arcane",
        "unit": "bundle",
        "bulk": 0.5,
        "baseValue": 16,
        "tags": [
          "foraged",
          "potion-ingredient"
        ],
        "notes": "Dug from dry ground. Warm to the touch."
      },
      {
        "id": "frost-lichen",
        "name": "Frost Lichen",
        "category": "arcane",
        "unit": "pouch",
        "bulk": 0.5,
        "baseValue": 12,
        "tags": [
          "foraged",
          "potion-ingredient"
        ],
        "notes": "Scraped off cold stone. The base of every physician's tonic."
      }
    ]
  },
  "tools": {
    "$comment": "Tools are equipment, not commodities: they are owned as individual pieces, they wear out on a durability track, and they gate which recipes a worker may perform. They can still be bought, sold and stolen.",
    "version": "0.1.0",
    "tools": [
      {
        "id": "axe",
        "name": "Axe",
        "family": "edged",
        "summary": "Fells trees standing on forest tiles.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 3
        },
        "baseValue": 30,
        "baseDurability": 24,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "fell-timber",
          "clear-forest",
          "hew-timber"
        ]
      },
      {
        "id": "saw",
        "name": "Saw",
        "family": "edged",
        "summary": "Turns logs into lumber at a sawmill.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 3
        },
        "baseValue": 32,
        "baseDurability": 26,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "saw-lumber",
          "build-timber-frame"
        ]
      },
      {
        "id": "pick",
        "name": "Pick",
        "family": "digging",
        "summary": "Breaks rock. Required for coal, ore and stone.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 2
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 4
        },
        "baseValue": 42,
        "baseDurability": 20,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "mine-coal",
          "mine-iron-ore",
          "mine-copper-ore",
          "mine-gold-ore",
          "mine-gems",
          "mine-salt",
          "mine-mana-crystal",
          "quarry-stone"
        ]
      },
      {
        "id": "shovel",
        "name": "Shovel",
        "family": "digging",
        "summary": "Moves loose ground: clay, sand, peat, earthworks.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 3
        },
        "baseValue": 28,
        "baseDurability": 22,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "dig-clay",
          "dig-sand",
          "cut-peat",
          "gather-stone",
          "lay-roadbed",
          "sink-mineshaft",
          "dig-ember-root"
        ]
      },
      {
        "id": "hammer",
        "name": "Hammer",
        "family": "smithing",
        "summary": "The general construction tool, and the smith's own tool.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 2
        },
        "baseValue": 24,
        "baseDurability": 30,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "forge-ironware",
          "forge-tool",
          "repair-tool",
          "build-generic",
          "lay-rail"
        ]
      },
      {
        "id": "knife",
        "name": "Knife",
        "family": "edged",
        "summary": "Butchery, skinning and fine work.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            }
          ],
          "effortHours": 2
        },
        "baseValue": 18,
        "baseDurability": 18,
        "sizes": [
          "small",
          "medium"
        ],
        "enables": [
          "butcher-livestock",
          "hunt-game",
          "harvest-herbs",
          "scrape-frost-lichen"
        ]
      },
      {
        "id": "shears",
        "name": "Shears",
        "family": "edged",
        "summary": "Takes fleece off a sheep without taking the sheep off the board.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            }
          ],
          "effortHours": 2
        },
        "baseValue": 20,
        "baseDurability": 20,
        "sizes": [
          "small",
          "medium"
        ],
        "enables": [
          "shear-sheep"
        ]
      },
      {
        "id": "scythe",
        "name": "Scythe",
        "family": "edged",
        "summary": "Harvests ripe crops.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            },
            {
              "commodity": "lumber",
              "qty": 1
            }
          ],
          "effortHours": 3
        },
        "baseValue": 30,
        "baseDurability": 22,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "harvest-grain",
          "harvest-flax",
          "harvest-hops",
          "harvest-vegetables",
          "harvest-cotton"
        ],
        "optional": true,
        "optionalNote": "Harvesting is possible bare-handed; a scythe doubles the yield."
      },
      {
        "id": "plough",
        "name": "Plough",
        "family": "farming",
        "summary": "Breaks ground for sowing. A draught animal doubles its output.",
        "madeAt": "carpenter",
        "craft": {
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 2
            },
            {
              "commodity": "ironware",
              "qty": 1
            }
          ],
          "effortHours": 4
        },
        "baseValue": 55,
        "baseDurability": 28,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "sow-grain",
          "sow-flax",
          "sow-vegetables",
          "sow-hops",
          "sow-cotton"
        ],
        "optional": true,
        "optionalNote": "Sowing is possible bare-handed; a plough halves the hours."
      },
      {
        "id": "fishing-net",
        "name": "Fishing Net",
        "family": "fishing",
        "summary": "Worked from a dock or a boat on a water tile.",
        "madeAt": "weaver",
        "craft": {
          "inputs": [
            {
              "commodity": "rope",
              "qty": 2
            }
          ],
          "effortHours": 3
        },
        "baseValue": 26,
        "baseDurability": 20,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "net-fish"
        ]
      },
      {
        "id": "spinning-wheel",
        "name": "Spinning Wheel",
        "family": "textile",
        "summary": "Fibre into yarn.",
        "madeAt": "carpenter",
        "craft": {
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 2
            },
            {
              "commodity": "ironware",
              "qty": 1
            }
          ],
          "effortHours": 4
        },
        "baseValue": 48,
        "baseDurability": 30,
        "sizes": [
          "small",
          "medium"
        ],
        "enables": [
          "spin-yarn"
        ]
      },
      {
        "id": "loom",
        "name": "Loom",
        "family": "textile",
        "summary": "Yarn into cloth. Bulky enough that it lives inside a weaver's shed.",
        "madeAt": "carpenter",
        "craft": {
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 3
            },
            {
              "commodity": "rope",
              "qty": 1
            },
            {
              "commodity": "ironware",
              "qty": 1
            }
          ],
          "effortHours": 6
        },
        "baseValue": 70,
        "baseDurability": 34,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "enables": [
          "weave-cloth",
          "weave-fine-cloth"
        ]
      },
      {
        "id": "trowel",
        "name": "Trowel",
        "family": "masonry",
        "summary": "Bricklaying and stonework.",
        "madeAt": "blacksmith",
        "craft": {
          "inputs": [
            {
              "commodity": "pig-iron",
              "qty": 1
            }
          ],
          "effortHours": 2
        },
        "baseValue": 20,
        "baseDurability": 24,
        "sizes": [
          "small",
          "medium"
        ],
        "enables": [
          "build-masonry",
          "fire-bricks"
        ]
      },
      {
        "id": "surveyors-kit",
        "name": "Surveyor's Kit",
        "family": "survey",
        "summary": "Carried by a prospector. Turns a hunch into a marked deposit.",
        "madeAt": "carpenter",
        "craft": {
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 1
            },
            {
              "commodity": "parchment",
              "qty": 1
            },
            {
              "commodity": "copper",
              "qty": 1
            }
          ],
          "effortHours": 4
        },
        "baseValue": 65,
        "baseDurability": 16,
        "sizes": [
          "small"
        ],
        "enables": [
          "survey-deposit",
          "plan-route"
        ]
      },
      {
        "id": "alembic",
        "name": "Alembic",
        "family": "arcane",
        "summary": "Glass still for brewing potions at an alchemist's.",
        "madeAt": "glassworks",
        "craft": {
          "inputs": [
            {
              "commodity": "glass",
              "qty": 2
            },
            {
              "commodity": "copper",
              "qty": 1
            }
          ],
          "effortHours": 5
        },
        "baseValue": 90,
        "baseDurability": 14,
        "sizes": [
          "small",
          "medium"
        ],
        "enables": [
          "brew-potion"
        ]
      }
    ]
  },
  "buildings": {
    "$comment": "Buildings are placed on tiles, cost commodities up front, take build-points of effort to finish, and then act as sites where recipes may be run. workerSlots caps how many workers may be allocated to that building in a single round.",
    "version": "0.1.0",
    "categories": [
      {
        "id": "housing",
        "name": "Housing",
        "summary": "Brings workers into a town."
      },
      {
        "id": "extraction",
        "name": "Extraction",
        "summary": "Sits on a terrain feature or deposit and pulls raw commodities out of it."
      },
      {
        "id": "production",
        "name": "Production",
        "summary": "Turns commodities into other commodities."
      },
      {
        "id": "storage",
        "name": "Storage",
        "summary": "Adds slots to a town's stockpile."
      },
      {
        "id": "civic",
        "name": "Civic",
        "summary": "Trade, order and the machinery of a town."
      },
      {
        "id": "military",
        "name": "Military",
        "summary": "Raising, housing and hiding behind soldiers."
      },
      {
        "id": "arcane",
        "name": "Arcane",
        "summary": "Where the strange work happens."
      },
      {
        "id": "infrastructure",
        "name": "Infrastructure",
        "summary": "Built onto tiles or tile edges rather than into a town."
      }
    ],
    "buildings": [
      {
        "id": "hut",
        "name": "Hut",
        "category": "housing",
        "tier": 1,
        "summary": "Four walls and a roof. Houses one worker.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "buildPoints": 4,
        "minRounds": 1,
        "housing": 1,
        "workerSlots": 0,
        "terrain": [
          "grassland",
          "forest",
          "hills",
          "marsh",
          "tundra"
        ],
        "notes": "The cheapest way to add a worker, and the first thing every player builds."
      },
      {
        "id": "timber-house",
        "name": "Timber House",
        "category": "housing",
        "tier": 2,
        "summary": "A proper house of sawn lumber. Houses two workers.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "housing": 2,
        "workerSlots": 0,
        "terrain": [
          "grassland",
          "forest",
          "hills",
          "tundra"
        ]
      },
      {
        "id": "brick-house",
        "name": "Brick House",
        "category": "housing",
        "tier": 3,
        "summary": "Houses three workers, and they are warm: brick-housed workers ignore Cold Snap events.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 6
          },
          {
            "commodity": "lumber",
            "qty": 2
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "buildPoints": 18,
        "minRounds": 3,
        "housing": 3,
        "workerSlots": 0,
        "terrain": [
          "grassland",
          "hills",
          "tundra",
          "desert"
        ]
      },
      {
        "id": "manor",
        "name": "Manor",
        "category": "housing",
        "tier": 4,
        "summary": "Houses four workers and one specialist, and scores at game end.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 8
          },
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "glass",
            "qty": 2
          },
          {
            "commodity": "fine-cloth",
            "qty": 1
          }
        ],
        "buildPoints": 30,
        "minRounds": 4,
        "housing": 4,
        "specialistHousing": 1,
        "workerSlots": 0,
        "terrain": [
          "grassland",
          "hills"
        ],
        "victoryPoints": 4
      },
      {
        "id": "lumber-camp",
        "name": "Lumber Camp",
        "category": "extraction",
        "tier": 1,
        "summary": "Lets you fell trees on any forest tile within 1 tile, and stores logs on site.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "buildPoints": 6,
        "minRounds": 1,
        "workerSlots": 3,
        "storage": 4,
        "terrain": [
          "forest"
        ]
      },
      {
        "id": "quarry",
        "name": "Quarry",
        "category": "extraction",
        "tier": 1,
        "summary": "Cuts stone out of hills and mountains.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "buildPoints": 8,
        "minRounds": 2,
        "workerSlots": 4,
        "terrain": [
          "hills",
          "mountain"
        ]
      },
      {
        "id": "clay-pit",
        "name": "Clay Pit",
        "category": "extraction",
        "tier": 1,
        "summary": "Digs clay from marshes, shores and wet ground.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "buildPoints": 5,
        "minRounds": 1,
        "workerSlots": 3,
        "terrain": [
          "marsh",
          "grassland",
          "coast"
        ],
        "requiresDeposit": "clay-bed"
      },
      {
        "id": "sand-pit",
        "name": "Sand Pit",
        "category": "extraction",
        "tier": 1,
        "summary": "Sand for glass.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "buildPoints": 5,
        "minRounds": 1,
        "workerSlots": 3,
        "terrain": [
          "desert",
          "coast"
        ]
      },
      {
        "id": "mine",
        "name": "Mine",
        "category": "extraction",
        "tier": 2,
        "summary": "Built directly on top of a revealed mineral deposit. What it produces depends on the deposit under it.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "buildPoints": 14,
        "minRounds": 3,
        "workerSlots": 4,
        "terrain": [
          "hills",
          "mountain",
          "tundra",
          "desert",
          "grassland"
        ],
        "requiresDepositAny": [
          "coal-seam",
          "iron-deposit",
          "copper-deposit",
          "gold-deposit",
          "gem-vein",
          "salt-dome"
        ],
        "notes": "One mine per deposit. A deposit is exhausted after its yield total is drawn; flip the deposit token."
      },
      {
        "id": "oil-derrick",
        "name": "Oil Derrick",
        "category": "extraction",
        "tier": 4,
        "summary": "Late-game. Pumps crude oil out of an oil field.",
        "cost": [
          {
            "commodity": "steel",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "ironware",
            "qty": 2
          }
        ],
        "buildPoints": 26,
        "minRounds": 4,
        "workerSlots": 3,
        "requiresDeposit": "oil-field"
      },
      {
        "id": "well",
        "name": "Well",
        "category": "extraction",
        "tier": 1,
        "summary": "A town without a well or adjacent water cannot draw water at all.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 3
          }
        ],
        "buildPoints": 6,
        "minRounds": 1,
        "workerSlots": 1,
        "terrain": [
          "grassland",
          "forest",
          "hills",
          "desert",
          "tundra",
          "marsh"
        ]
      },
      {
        "id": "farm",
        "name": "Farm",
        "category": "extraction",
        "tier": 1,
        "summary": "Four field slots. Each slot holds one sown crop through its growth track.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "buildPoints": 8,
        "minRounds": 2,
        "workerSlots": 4,
        "fieldSlots": 4,
        "terrain": [
          "grassland",
          "coast"
        ]
      },
      {
        "id": "pasture",
        "name": "Pasture",
        "category": "extraction",
        "tier": 1,
        "summary": "Holds livestock. Animals breed here and can be sheared, milked or butchered.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 3
          },
          {
            "commodity": "rope",
            "qty": 1
          }
        ],
        "buildPoints": 7,
        "minRounds": 1,
        "workerSlots": 3,
        "livestockSlots": 6,
        "terrain": [
          "grassland",
          "hills",
          "tundra"
        ]
      },
      {
        "id": "orchard",
        "name": "Orchard",
        "category": "extraction",
        "tier": 2,
        "summary": "Takes three rounds to establish, then yields every round without re-sowing.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 2
          },
          {
            "commodity": "water",
            "qty": 2
          }
        ],
        "buildPoints": 10,
        "minRounds": 3,
        "workerSlots": 2,
        "terrain": [
          "grassland",
          "hills"
        ]
      },
      {
        "id": "vineyard",
        "name": "Vineyard",
        "category": "extraction",
        "tier": 2,
        "summary": "Grapes only, and only on sun-facing ground.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 3
          },
          {
            "commodity": "water",
            "qty": 2
          }
        ],
        "buildPoints": 12,
        "minRounds": 3,
        "workerSlots": 3,
        "terrain": [
          "hills",
          "grassland"
        ]
      },
      {
        "id": "apiary",
        "name": "Apiary",
        "category": "extraction",
        "tier": 1,
        "summary": "Bees. Honey for mead, and an orchard next door yields +1.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 5,
        "minRounds": 1,
        "workerSlots": 1,
        "terrain": [
          "grassland",
          "forest",
          "hills"
        ]
      },
      {
        "id": "dock",
        "name": "Dock",
        "category": "extraction",
        "tier": 1,
        "summary": "Fishing, and the cheap end of water transport.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 4
          },
          {
            "commodity": "rope",
            "qty": 1
          }
        ],
        "buildPoints": 8,
        "minRounds": 2,
        "workerSlots": 3,
        "terrain": [
          "coast"
        ]
      },
      {
        "id": "sawmill",
        "name": "Sawmill",
        "category": "production",
        "tier": 1,
        "summary": "Logs into lumber. Doubles its rate on a coast tile - water drives the saw.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 3,
        "terrain": [
          "forest",
          "grassland",
          "hills",
          "coast"
        ]
      },
      {
        "id": "charcoal-kiln",
        "name": "Charcoal Kiln",
        "category": "production",
        "tier": 1,
        "summary": "Logs into charcoal, for smelting where there is no coal.",
        "cost": [
          {
            "commodity": "clay",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 8,
        "minRounds": 2,
        "workerSlots": 2,
        "terrain": [
          "forest",
          "grassland",
          "hills"
        ]
      },
      {
        "id": "smelter",
        "name": "Smelter",
        "category": "production",
        "tier": 2,
        "summary": "Ore plus fuel into metal.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 6
          },
          {
            "commodity": "clay",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 16,
        "minRounds": 3,
        "workerSlots": 3,
        "terrain": [
          "hills",
          "grassland",
          "mountain"
        ]
      },
      {
        "id": "steelworks",
        "name": "Steelworks",
        "category": "production",
        "tier": 3,
        "summary": "The refinery. Pig iron plus coal into steel - and it only really works on coal.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 8
          },
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "ironware",
            "qty": 2
          }
        ],
        "buildPoints": 26,
        "minRounds": 4,
        "workerSlots": 4,
        "requiresBuilding": "smelter",
        "terrain": [
          "hills",
          "grassland"
        ]
      },
      {
        "id": "brickworks",
        "name": "Brickworks",
        "category": "production",
        "tier": 2,
        "summary": "Clay plus fuel into brick.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "clay",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 14,
        "minRounds": 3,
        "workerSlots": 3,
        "terrain": [
          "grassland",
          "hills",
          "marsh"
        ]
      },
      {
        "id": "glassworks",
        "name": "Glassworks",
        "category": "production",
        "tier": 3,
        "summary": "Sand plus heavy fuel into glass. Hot, hungry and profitable.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 6
          },
          {
            "commodity": "stone",
            "qty": 2
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "buildPoints": 22,
        "minRounds": 3,
        "workerSlots": 3,
        "terrain": [
          "grassland",
          "hills",
          "desert",
          "coast"
        ]
      },
      {
        "id": "blacksmith",
        "name": "Blacksmith",
        "category": "production",
        "tier": 2,
        "summary": "Where every tool in the game is made and repaired.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "clay",
            "qty": 1
          }
        ],
        "buildPoints": 14,
        "minRounds": 2,
        "workerSlots": 2,
        "specialist": "smith",
        "terrain": [
          "grassland",
          "forest",
          "hills",
          "tundra",
          "desert",
          "marsh"
        ]
      },
      {
        "id": "carpenter",
        "name": "Carpenter's Shop",
        "category": "production",
        "tier": 2,
        "summary": "Wooden equipment: ploughs, looms, wheels, barrels, crates.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 2,
        "specialist": "carpenter",
        "terrain": [
          "grassland",
          "forest",
          "hills"
        ]
      },
      {
        "id": "weaver",
        "name": "Weaver's Shed",
        "category": "production",
        "tier": 2,
        "summary": "Houses spinning wheels and looms. Fibre in, cloth out.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 3,
        "specialist": "weaver",
        "terrain": [
          "grassland",
          "forest",
          "hills",
          "coast"
        ]
      },
      {
        "id": "tannery",
        "name": "Tannery",
        "category": "production",
        "tier": 2,
        "summary": "Hide plus water into leather. Nobody wants it upwind of the town.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 11,
        "minRounds": 2,
        "workerSlots": 2,
        "terrain": [
          "grassland",
          "marsh",
          "coast"
        ]
      },
      {
        "id": "tailor",
        "name": "Tailor",
        "category": "production",
        "tier": 3,
        "summary": "Cloth and leather into clothing and light armour.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "brick",
            "qty": 2
          }
        ],
        "buildPoints": 14,
        "minRounds": 2,
        "workerSlots": 2,
        "specialist": "tailor",
        "requiresBuilding": "weaver"
      },
      {
        "id": "mill",
        "name": "Mill",
        "category": "production",
        "tier": 1,
        "summary": "Grain into flour. Free extra output on a hills or coast tile (wind and water).",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 3
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 2,
        "terrain": [
          "grassland",
          "hills",
          "coast"
        ]
      },
      {
        "id": "bakery",
        "name": "Bakery",
        "category": "production",
        "tier": 2,
        "summary": "Flour, water and fuel into bread - the most efficient food in the game.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 2
      },
      {
        "id": "butcher",
        "name": "Butcher",
        "category": "production",
        "tier": 1,
        "summary": "Livestock into meat and hide. Salt on hand turns meat into salted meat.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 9,
        "minRounds": 2,
        "workerSlots": 2
      },
      {
        "id": "dairy",
        "name": "Dairy",
        "category": "production",
        "tier": 2,
        "summary": "Milk into cheese, which unlike milk keeps.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 11,
        "minRounds": 2,
        "workerSlots": 2
      },
      {
        "id": "brewery",
        "name": "Brewery",
        "category": "production",
        "tier": 2,
        "summary": "Grain or honey, water and a barrel into ale or mead.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 2
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "buildPoints": 15,
        "minRounds": 3,
        "workerSlots": 3,
        "specialist": "brewer"
      },
      {
        "id": "winery",
        "name": "Winery",
        "category": "production",
        "tier": 3,
        "summary": "Grapes, water and a barrel into wine. Must be built on or beside a vineyard.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "brick",
            "qty": 2
          }
        ],
        "buildPoints": 18,
        "minRounds": 3,
        "workerSlots": 3,
        "requiresBuilding": "vineyard"
      },
      {
        "id": "warehouse",
        "name": "Warehouse",
        "category": "storage",
        "tier": 2,
        "summary": "Twelve storage slots for anything. A prime target for thieves.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 5
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 1,
        "storage": 12,
        "theftTarget": true
      },
      {
        "id": "granary",
        "name": "Granary",
        "category": "storage",
        "tier": 1,
        "summary": "Ten slots for food and drink only - and food inside it does not perish.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 1,
        "storage": 10,
        "storageFilter": [
          "food",
          "drink"
        ],
        "theftTarget": true,
        "notes": "This is the 'greenery' from the original brief: the building a town feeds itself out of."
      },
      {
        "id": "market",
        "name": "Market",
        "category": "civic",
        "tier": 1,
        "summary": "Lets a town buy from and sell to the board at the current price band.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 4
          }
        ],
        "buildPoints": 8,
        "minRounds": 2,
        "workerSlots": 2,
        "notes": "Cheap on purpose. The market is the safety net: any player who has lost their tools can gather deadwood by hand, put up a stall, and buy a replacement."
      },
      {
        "id": "trading-house",
        "name": "Trading House",
        "category": "civic",
        "tier": 3,
        "summary": "Removes the market spread for its owner in that town, and lets them trade with any player who has a merchant or trading house connected by a route.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 5
          },
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "parchment",
            "qty": 2
          }
        ],
        "buildPoints": 20,
        "minRounds": 3,
        "workerSlots": 2,
        "specialist": "merchant",
        "requiresBuilding": "market",
        "victoryPoints": 2
      },
      {
        "id": "town-hall",
        "name": "Town Hall",
        "category": "civic",
        "tier": 2,
        "summary": "Founds a town on a tile and marks its stockpile. One per town, always the first thing placed.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 1,
        "storage": 6,
        "unique": "per-town"
      },
      {
        "id": "guildhall",
        "name": "Guildhall",
        "category": "civic",
        "tier": 3,
        "summary": "Train a worker into a specialist here. One training per round.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "parchment",
            "qty": 1
          }
        ],
        "buildPoints": 18,
        "minRounds": 3,
        "workerSlots": 1
      },
      {
        "id": "inn",
        "name": "Inn",
        "category": "civic",
        "tier": 2,
        "summary": "Rest, rumour and hired muscle. Serve drink to clear unrest; travellers rest here to heal; escorts are hired here; quests are heard here. The one building in the game that may stand outside a town.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "stone",
            "qty": 2
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 2,
        "roadside": {
          "$comment": "An inn is the only building that does not need a town under it. That is not a special case for its own sake - it is what makes a long route survivable, and it is the reason a player builds anything on the empty half of the board. A roadside inn is a holding: it earns, it can be bought and sold, and it can be burned down.",
          "where": "On any tile carrying a road, rail or a route the builder has travelled, in or out of a town. A roadside inn founds no town and stores nothing.",
          "extraCost": [
            {
              "commodity": "lumber",
              "qty": 2
            }
          ],
          "cap": 3,
          "capNote": "Three inns per player. Past that an innkeeper is a landlord, and landlords are the land-ownership rules, which are not written yet."
        },
        "drink": {
          "$comment": "The sink the drink half of the economy was missing. Ale is the everyday pour and mead is what an inn actually wants: it is the only thing on the list that both clears unrest and pays a toll back to its owner, which is what makes an apiary and a brewery worth the tiles they sit on.",
          "serves": [
            {
              "commodity": "ale",
              "clearsUnrest": 1,
              "coinPerUnit": 6
            },
            {
              "commodity": "wine",
              "clearsUnrest": 1,
              "coinPerUnit": 12
            },
            {
              "commodity": "mead",
              "clearsUnrest": 2,
              "coinPerUnit": 14,
              "note": "Mead is the inn's own trade. Two unrest a barrel, and no other building will take it in quantity."
            }
          ],
          "limit": "One barrel served per inn per round, owner's choice of which."
        },
        "rest": {
          "$comment": "Stated on the building as well as in rules.json rest, because the building is where a player looks.",
          "heals": 2,
          "healsWithHealer": 3,
          "coin": 5,
          "toll": "At an inn owned by another player, the 5 coin goes to that player rather than to the board. At your own, it is waived."
        },
        "notes": "Resting, hireling costs and rumours are in rules.json under rest and hirelings. Every settlement printed on a map is assumed to contain an inn of its rank - those are the board's, not any player's."
      },
      {
        "id": "infirmary",
        "name": "Infirmary",
        "category": "civic",
        "tier": 2,
        "summary": "Where the sick are tended and healers are trained. A town with a fed healer weathers illness cards that empty other towns.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "stone",
            "qty": 2
          },
          {
            "commodity": "parchment",
            "qty": 1
          }
        ],
        "buildPoints": 12,
        "minRounds": 2,
        "workerSlots": 1,
        "specialist": "healer"
      },
      {
        "id": "barracks",
        "name": "Barracks",
        "category": "military",
        "tier": 2,
        "summary": "Turns fed workers into soldiers, and holds them without them costing you effort.",
        "cost": [
          {
            "commodity": "lumber",
            "qty": 5
          },
          {
            "commodity": "stone",
            "qty": 3
          }
        ],
        "buildPoints": 16,
        "minRounds": 3,
        "workerSlots": 2,
        "garrison": 4
      },
      {
        "id": "watchtower",
        "name": "Watchtower",
        "category": "military",
        "tier": 2,
        "summary": "Cancels one theft or raid event per game against the town it stands in, and reveals adjacent face-down tiles.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 5
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 14,
        "minRounds": 2,
        "workerSlots": 1
      },
      {
        "id": "palisade",
        "name": "Palisade",
        "category": "military",
        "tier": 1,
        "summary": "Defenders in this town roll one extra combat die.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 6
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 0
      },
      {
        "id": "alchemist",
        "name": "Alchemist",
        "category": "arcane",
        "tier": 3,
        "summary": "Brews potions from foraged ingredients and mana crystals. Needs an alembic.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 3
          },
          {
            "commodity": "glass",
            "qty": 2
          },
          {
            "commodity": "parchment",
            "qty": 2
          }
        ],
        "buildPoints": 18,
        "minRounds": 3,
        "workerSlots": 2,
        "specialist": "alchemist"
      },
      {
        "id": "shrine",
        "name": "Shrine",
        "category": "arcane",
        "tier": 2,
        "summary": "Once per round, re-roll one effort die in this town.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "buildPoints": 10,
        "minRounds": 2,
        "workerSlots": 0,
        "victoryPoints": 1
      },
      {
        "id": "road",
        "name": "Road",
        "category": "infrastructure",
        "tier": 1,
        "summary": "Built onto a tile. Halves land movement cost through it and allows carts.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "buildPoints": 3,
        "minRounds": 1,
        "perTile": true,
        "terrainCostMultiplier": true
      },
      {
        "id": "rail",
        "name": "Railroad",
        "category": "infrastructure",
        "tier": 3,
        "summary": "Built onto a tile. Fast, high-capacity cargo, and expensive through anything but flat ground.",
        "cost": [
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 8,
        "minRounds": 1,
        "perTile": true,
        "terrainCostMultiplier": true,
        "requiresBuilding": "steelworks",
        "victoryPointsPerTile": 1
      },
      {
        "id": "bridge",
        "name": "Bridge",
        "category": "infrastructure",
        "tier": 2,
        "summary": "Carries a road or rail across one water tile.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 4
          },
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "buildPoints": 16,
        "minRounds": 2,
        "perTile": true,
        "terrain": [
          "shallow-water"
        ]
      },
      {
        "id": "harbour",
        "name": "Harbour",
        "category": "infrastructure",
        "tier": 3,
        "summary": "Lets ships load and unload. Sea routes are slow to set up and very cheap to run.",
        "cost": [
          {
            "commodity": "stone",
            "qty": 6
          },
          {
            "commodity": "lumber",
            "qty": 6
          },
          {
            "commodity": "rope",
            "qty": 2
          }
        ],
        "buildPoints": 22,
        "minRounds": 3,
        "workerSlots": 2,
        "terrain": [
          "coast"
        ],
        "requiresBuilding": "dock",
        "victoryPoints": 2
      },
      {
        "id": "rail-depot",
        "name": "Rail Depot",
        "category": "infrastructure",
        "tier": 3,
        "summary": "The point where a town joins the rail network. Trains can only load here.",
        "cost": [
          {
            "commodity": "brick",
            "qty": 4
          },
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "buildPoints": 18,
        "minRounds": 3,
        "workerSlots": 2,
        "requiresBuilding": "rail"
      }
    ]
  },
  "recipes": {
    "$comment": "A recipe is one allocatable job: a site + a tool + effort hours + input commodities => output commodities. Everything a player can DO with worker effort is a recipe, including construction work.",
    "version": "0.1.0",
    "categories": [
      {
        "id": "extraction",
        "name": "Extraction"
      },
      {
        "id": "agriculture",
        "name": "Agriculture"
      },
      {
        "id": "husbandry",
        "name": "Husbandry"
      },
      {
        "id": "processing",
        "name": "Processing"
      },
      {
        "id": "crafting",
        "name": "Crafting"
      },
      {
        "id": "brewing",
        "name": "Brewing"
      },
      {
        "id": "arcane",
        "name": "Arcane"
      },
      {
        "id": "civic",
        "name": "Civic",
        "summary": "Trade, training and logistics. Costs effort like any other job."
      },
      {
        "id": "works",
        "name": "Works",
        "summary": "Construction and infrastructure labour. Outputs build-points onto a progress track rather than commodities."
      }
    ],
    "fuelOptions": {
      "$comment": "Named fuel bundles reused by recipes. 'fuel: standard' means the player may pay any ONE of these.",
      "standard": [
        {
          "label": "Coal",
          "inputs": [
            {
              "commodity": "coal",
              "qty": 1
            }
          ]
        },
        {
          "label": "Charcoal",
          "inputs": [
            {
              "commodity": "charcoal",
              "qty": 2
            }
          ]
        },
        {
          "label": "Logs",
          "inputs": [
            {
              "commodity": "logs",
              "qty": 3
            }
          ],
          "outputPenalty": -1
        },
        {
          "label": "Peat",
          "inputs": [
            {
              "commodity": "peat",
              "qty": 3
            }
          ],
          "outputPenalty": -1
        }
      ],
      "hot": [
        {
          "label": "Coal",
          "inputs": [
            {
              "commodity": "coal",
              "qty": 2
            }
          ]
        },
        {
          "label": "Charcoal",
          "inputs": [
            {
              "commodity": "charcoal",
              "qty": 3
            }
          ],
          "outputPenalty": -1
        },
        {
          "label": "Crude Oil",
          "inputs": [
            {
              "commodity": "crude-oil",
              "qty": 1
            }
          ],
          "outputBonus": 1,
          "requiresBuilding": "steelworks"
        }
      ]
    },
    "recipes": [
      {
        "id": "fell-timber",
        "name": "Fell Timber",
        "category": "extraction",
        "site": {
          "terrain": [
            "forest"
          ],
          "orBuilding": "lumber-camp"
        },
        "tool": "axe",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "notes": "Remove one tree token from the tile. A forest tile with no tree tokens left becomes grassland."
      },
      {
        "id": "clear-forest",
        "name": "Clear Forest",
        "category": "works",
        "site": {
          "terrain": [
            "forest"
          ]
        },
        "tool": "axe",
        "effortHours": 4,
        "inputs": [],
        "outputs": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "effect": "Flip the forest tile to grassland. Permanent - and there is no way to plant a forest back."
      },
      {
        "id": "quarry-stone",
        "name": "Quarry Stone",
        "category": "extraction",
        "site": {
          "building": "quarry"
        },
        "tool": "pick",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "stone",
            "qty": 2
          }
        ]
      },
      {
        "id": "gather-deadwood",
        "name": "Gather Deadwood",
        "category": "extraction",
        "site": {
          "terrain": [
            "forest",
            "grassland",
            "hills",
            "marsh"
          ]
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "logs",
            "qty": 1
          }
        ],
        "notes": "Fallen branches, gathered by hand. Half the rate of an axe and it needs nothing at all - which is the point. Together with Gather Field Stone it guarantees that a player who has lost every tool can always claw their way back to a market and buy another."
      },
      {
        "id": "gather-stone",
        "name": "Gather Field Stone",
        "category": "extraction",
        "site": {
          "terrain": [
            "hills",
            "mountain",
            "tundra",
            "coast"
          ]
        },
        "tool": "shovel",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "stone",
            "qty": 1
          }
        ],
        "notes": "Loose rock off the surface. A third of the rate of a real quarry, but it needs no pick — and without it a new town can never afford its first blacksmith."
      },
      {
        "id": "hew-timber",
        "name": "Hew Timber",
        "category": "processing",
        "site": {
          "terrain": [
            "forest"
          ],
          "orBuilding": "lumber-camp"
        },
        "tool": "axe",
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "outputs": [
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "notes": "Squaring beams with an axe. Wasteful next to a sawmill, and the only way to get lumber before you own a saw."
      },
      {
        "id": "dig-clay",
        "name": "Dig Clay",
        "category": "extraction",
        "site": {
          "building": "clay-pit"
        },
        "tool": "shovel",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "clay",
            "qty": 2
          }
        ]
      },
      {
        "id": "dig-sand",
        "name": "Dig Sand",
        "category": "extraction",
        "site": {
          "building": "sand-pit"
        },
        "tool": "shovel",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "sand",
            "qty": 3
          }
        ]
      },
      {
        "id": "cut-peat",
        "name": "Cut Peat",
        "category": "extraction",
        "site": {
          "terrain": [
            "marsh",
            "tundra"
          ]
        },
        "tool": "shovel",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "peat",
            "qty": 2
          }
        ],
        "notes": "No building needed. The poor player's fuel."
      },
      {
        "id": "mine-coal",
        "name": "Mine Coal",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "coal-seam"
        },
        "tool": "pick",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "coal",
            "qty": 2
          }
        ],
        "depletesDeposit": 2
      },
      {
        "id": "mine-iron-ore",
        "name": "Mine Iron Ore",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "iron-deposit"
        },
        "tool": "pick",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "iron-ore",
            "qty": 2
          }
        ],
        "depletesDeposit": 2
      },
      {
        "id": "mine-copper-ore",
        "name": "Mine Copper Ore",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "copper-deposit"
        },
        "tool": "pick",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "copper-ore",
            "qty": 2
          }
        ],
        "depletesDeposit": 2
      },
      {
        "id": "mine-gold-ore",
        "name": "Mine Gold Ore",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "gold-deposit"
        },
        "tool": "pick",
        "effortHours": 4,
        "inputs": [],
        "outputs": [
          {
            "commodity": "gold-ore",
            "qty": 1
          }
        ],
        "depletesDeposit": 1
      },
      {
        "id": "mine-gems",
        "name": "Mine Gems",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "gem-vein"
        },
        "tool": "pick",
        "effortHours": 4,
        "inputs": [],
        "outputs": [
          {
            "commodity": "gems",
            "qty": 1
          }
        ],
        "depletesDeposit": 1
      },
      {
        "id": "mine-salt",
        "name": "Mine Salt",
        "category": "extraction",
        "site": {
          "building": "mine",
          "deposit": "salt-dome"
        },
        "tool": "pick",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "salt",
            "qty": 2
          }
        ],
        "depletesDeposit": 2
      },
      {
        "id": "mine-mana-crystal",
        "name": "Cut Mana Crystal",
        "category": "arcane",
        "site": {
          "building": "mine",
          "deposit": "mana-vein"
        },
        "tool": "pick",
        "effortHours": 4,
        "inputs": [],
        "outputs": [
          {
            "commodity": "mana-crystal",
            "qty": 1
          }
        ],
        "depletesDeposit": 1,
        "notes": "Dwarven miners take mana crystal at 1 hour less. Elves refuse to work a mana vein at all."
      },
      {
        "id": "pump-oil",
        "name": "Pump Oil",
        "category": "extraction",
        "site": {
          "building": "oil-derrick",
          "deposit": "oil-field"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "crude-oil",
            "qty": 1
          }
        ],
        "depletesDeposit": 1
      },
      {
        "id": "draw-water",
        "name": "Draw Water",
        "category": "extraction",
        "site": {
          "building": "well",
          "orTerrain": [
            "coast",
            "marsh"
          ]
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "water",
            "qty": 2
          }
        ]
      },
      {
        "id": "net-fish",
        "name": "Net Fish",
        "category": "extraction",
        "site": {
          "building": "dock"
        },
        "tool": "fishing-net",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "fish",
            "qty": 2
          }
        ]
      },
      {
        "id": "hunt-game",
        "name": "Hunt Game",
        "category": "extraction",
        "site": {
          "terrain": [
            "forest",
            "hills",
            "tundra",
            "mountain"
          ]
        },
        "tool": "knife",
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "meat",
            "qty": 1
          },
          {
            "commodity": "hide",
            "qty": 1
          }
        ],
        "notes": "Formerly 'skin-hide'. Bows make this better - see items.json."
      },
      {
        "id": "sow-grain",
        "name": "Sow Grain",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "fieldSlot": true
        },
        "toolBonus": {
          "tool": "plough",
          "effortDivisor": 2
        },
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "grain",
            "qty": 1
          }
        ],
        "outputs": [],
        "maturationRounds": 3,
        "cropStage": "grain",
        "effect": "Place a grain crop marker on a free field slot and set its growth track to 3."
      },
      {
        "id": "harvest-grain",
        "name": "Harvest Grain",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "ripeCrop": "grain"
        },
        "toolBonus": {
          "tool": "scythe",
          "outputMultiplier": 2
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "grain",
            "qty": 6
          }
        ]
      },
      {
        "id": "sow-vegetables",
        "name": "Sow Vegetables",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "fieldSlot": true
        },
        "toolBonus": {
          "tool": "plough",
          "effortDivisor": 2
        },
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "vegetables",
            "qty": 1
          }
        ],
        "outputs": [],
        "maturationRounds": 2,
        "cropStage": "vegetables"
      },
      {
        "id": "harvest-vegetables",
        "name": "Harvest Vegetables",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "ripeCrop": "vegetables"
        },
        "toolBonus": {
          "tool": "scythe",
          "outputMultiplier": 2
        },
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "vegetables",
            "qty": 5
          }
        ]
      },
      {
        "id": "sow-flax",
        "name": "Sow Flax",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "fieldSlot": true
        },
        "toolBonus": {
          "tool": "plough",
          "effortDivisor": 2
        },
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "flax",
            "qty": 1
          }
        ],
        "outputs": [],
        "maturationRounds": 3,
        "cropStage": "flax"
      },
      {
        "id": "harvest-flax",
        "name": "Harvest Flax",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "ripeCrop": "flax"
        },
        "toolBonus": {
          "tool": "scythe",
          "outputMultiplier": 2
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "flax",
            "qty": 5
          }
        ]
      },
      {
        "id": "sow-cotton",
        "name": "Sow Cotton",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "fieldSlot": true,
          "terrain": [
            "grassland",
            "desert"
          ]
        },
        "toolBonus": {
          "tool": "plough",
          "effortDivisor": 2
        },
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "cotton",
            "qty": 1
          }
        ],
        "outputs": [],
        "maturationRounds": 4,
        "cropStage": "cotton",
        "notes": "Warm ground only. Cotton is the long game: slow to grow, but it feeds the fine-cloth chain."
      },
      {
        "id": "harvest-cotton",
        "name": "Harvest Cotton",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "ripeCrop": "cotton"
        },
        "toolBonus": {
          "tool": "scythe",
          "outputMultiplier": 2
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "cotton",
            "qty": 5
          }
        ]
      },
      {
        "id": "sow-hops",
        "name": "Sow Hops",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "fieldSlot": true
        },
        "toolBonus": {
          "tool": "plough",
          "effortDivisor": 2
        },
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "hops",
            "qty": 1
          }
        ],
        "outputs": [],
        "maturationRounds": 3,
        "cropStage": "hops"
      },
      {
        "id": "harvest-hops",
        "name": "Harvest Hops",
        "category": "agriculture",
        "site": {
          "building": "farm",
          "ripeCrop": "hops"
        },
        "toolBonus": {
          "tool": "scythe",
          "outputMultiplier": 2
        },
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "hops",
            "qty": 4
          }
        ]
      },
      {
        "id": "tend-orchard",
        "name": "Tend Orchard",
        "category": "agriculture",
        "site": {
          "building": "orchard"
        },
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "apples",
            "qty": 3
          }
        ],
        "notes": "+1 apples if an apiary stands on an adjacent tile."
      },
      {
        "id": "harvest-grapes",
        "name": "Harvest Grapes",
        "category": "agriculture",
        "site": {
          "building": "vineyard"
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [
          {
            "commodity": "grapes",
            "qty": 4
          }
        ]
      },
      {
        "id": "collect-honey",
        "name": "Collect Honey",
        "category": "agriculture",
        "site": {
          "building": "apiary"
        },
        "effortHours": 1,
        "inputs": [],
        "outputs": [
          {
            "commodity": "honey",
            "qty": 2
          }
        ]
      },
      {
        "id": "graze-livestock",
        "name": "Graze Livestock",
        "category": "husbandry",
        "site": {
          "building": "pasture"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "grain",
            "qty": 1
          },
          {
            "commodity": "sheep",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "sheep",
            "qty": 2
          }
        ],
        "maturationRounds": 2,
        "alternatives": [
          {
            "inputs": [
              {
                "commodity": "grain",
                "qty": 1
              },
              {
                "commodity": "cattle",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "cattle",
                "qty": 2
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "grain",
                "qty": 1
              },
              {
                "commodity": "pig",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "pig",
                "qty": 2
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "grain",
                "qty": 2
              },
              {
                "commodity": "horse",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "horse",
                "qty": 2
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "grain",
                "qty": 1
              },
              {
                "commodity": "chickens",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "chickens",
                "qty": 3
              }
            ]
          }
        ],
        "effect": "Breeding. Put one head in, take two out after 2 rounds, up to the pasture's livestock slots. Buy your first animal at a market."
      },
      {
        "id": "collect-eggs",
        "name": "Collect Eggs",
        "category": "husbandry",
        "site": {
          "building": "pasture",
          "livestock": "chickens"
        },
        "effortHours": 1,
        "inputs": [],
        "outputs": [
          {
            "commodity": "eggs",
            "qty": 2
          }
        ],
        "notes": "The cheapest renewable food in the game, and the reason halflings keep chickens."
      },
      {
        "id": "shear-sheep",
        "name": "Shear Sheep",
        "category": "husbandry",
        "site": {
          "building": "pasture",
          "livestock": "sheep"
        },
        "tool": "shears",
        "effortHours": 1,
        "inputs": [],
        "outputs": [
          {
            "commodity": "wool",
            "qty": 2
          }
        ],
        "notes": "The sheep stays in the pasture. Once per sheep per round."
      },
      {
        "id": "milk-cattle",
        "name": "Milk Cattle",
        "category": "husbandry",
        "site": {
          "building": "pasture",
          "livestock": "cattle"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "milk",
            "qty": 2
          }
        ]
      },
      {
        "id": "butcher-livestock",
        "name": "Butcher Livestock",
        "category": "husbandry",
        "site": {
          "building": "butcher"
        },
        "tool": "knife",
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "cattle",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "meat",
            "qty": 4
          },
          {
            "commodity": "hide",
            "qty": 2
          }
        ],
        "alternatives": [
          {
            "inputs": [
              {
                "commodity": "pig",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "meat",
                "qty": 3
              },
              {
                "commodity": "hide",
                "qty": 1
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "sheep",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "meat",
                "qty": 2
              },
              {
                "commodity": "hide",
                "qty": 1
              },
              {
                "commodity": "wool",
                "qty": 1
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "chickens",
                "qty": 1
              }
            ],
            "outputs": [
              {
                "commodity": "meat",
                "qty": 1
              }
            ]
          }
        ]
      },
      {
        "id": "salt-meat",
        "name": "Salt Meat",
        "category": "husbandry",
        "site": {
          "building": "butcher"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "meat",
            "qty": 2
          },
          {
            "commodity": "salt",
            "qty": 1
          },
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "salted-meat",
            "qty": 2
          }
        ],
        "notes": "The single most important recipe for anyone shipping food across the map."
      },
      {
        "id": "saw-lumber",
        "name": "Saw Lumber",
        "category": "processing",
        "site": {
          "building": "sawmill"
        },
        "tool": "saw",
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "lumber",
            "qty": 3
          }
        ],
        "notes": "+1 lumber if the sawmill is on a coast tile."
      },
      {
        "id": "burn-charcoal",
        "name": "Burn Charcoal",
        "category": "processing",
        "site": {
          "building": "charcoal-kiln"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "logs",
            "qty": 3
          }
        ],
        "outputs": [
          {
            "commodity": "charcoal",
            "qty": 2
          }
        ]
      },
      {
        "id": "smelt-iron",
        "name": "Smelt Iron",
        "category": "processing",
        "site": {
          "building": "smelter"
        },
        "effortHours": 3,
        "fuel": "standard",
        "inputs": [
          {
            "commodity": "iron-ore",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "pig-iron",
            "qty": 2
          }
        ]
      },
      {
        "id": "smelt-copper",
        "name": "Smelt Copper",
        "category": "processing",
        "site": {
          "building": "smelter"
        },
        "effortHours": 3,
        "fuel": "standard",
        "inputs": [
          {
            "commodity": "copper-ore",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "copper",
            "qty": 2
          }
        ]
      },
      {
        "id": "smelt-gold",
        "name": "Smelt Gold",
        "category": "processing",
        "site": {
          "building": "smelter"
        },
        "effortHours": 4,
        "fuel": "hot",
        "inputs": [
          {
            "commodity": "gold-ore",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "gold",
            "qty": 1
          }
        ]
      },
      {
        "id": "make-steel",
        "name": "Make Steel",
        "category": "processing",
        "site": {
          "building": "steelworks"
        },
        "effortHours": 4,
        "fuel": "hot",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "steel",
            "qty": 2
          }
        ],
        "notes": "This is the 'refinery' recipe from the brief: effort + iron + coal. Charcoal works, badly."
      },
      {
        "id": "fire-bricks",
        "name": "Fire Bricks",
        "category": "processing",
        "site": {
          "building": "brickworks"
        },
        "tool": "trowel",
        "effortHours": 3,
        "fuel": "standard",
        "inputs": [
          {
            "commodity": "clay",
            "qty": 3
          }
        ],
        "outputs": [
          {
            "commodity": "brick",
            "qty": 3
          }
        ]
      },
      {
        "id": "make-glass",
        "name": "Make Glass",
        "category": "processing",
        "site": {
          "building": "glassworks"
        },
        "effortHours": 4,
        "fuel": "hot",
        "inputs": [
          {
            "commodity": "sand",
            "qty": 3
          }
        ],
        "outputs": [
          {
            "commodity": "glass",
            "qty": 2
          }
        ]
      },
      {
        "id": "mill-flour",
        "name": "Mill Flour",
        "category": "processing",
        "site": {
          "building": "mill"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "grain",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "flour",
            "qty": 3
          }
        ]
      },
      {
        "id": "bake-bread",
        "name": "Bake Bread",
        "category": "processing",
        "site": {
          "building": "bakery"
        },
        "effortHours": 2,
        "fuel": "standard",
        "inputs": [
          {
            "commodity": "flour",
            "qty": 2
          },
          {
            "commodity": "water",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "bread",
            "qty": 3
          }
        ]
      },
      {
        "id": "make-cheese",
        "name": "Make Cheese",
        "category": "processing",
        "site": {
          "building": "dairy"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "milk",
            "qty": 3
          },
          {
            "commodity": "salt",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "cheese",
            "qty": 2
          }
        ]
      },
      {
        "id": "tan-leather",
        "name": "Tan Leather",
        "category": "processing",
        "site": {
          "building": "tannery"
        },
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "hide",
            "qty": 2
          },
          {
            "commodity": "water",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "leather",
            "qty": 2
          }
        ]
      },
      {
        "id": "make-parchment",
        "name": "Make Parchment",
        "category": "processing",
        "site": {
          "building": "tannery"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "hide",
            "qty": 1
          },
          {
            "commodity": "water",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "parchment",
            "qty": 2
          }
        ]
      },
      {
        "id": "spin-yarn",
        "name": "Spin Yarn",
        "category": "processing",
        "site": {
          "building": "weaver"
        },
        "tool": "spinning-wheel",
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "wool",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "yarn",
            "qty": 2
          }
        ],
        "alternatives": [
          {
            "inputs": [
              {
                "commodity": "flax",
                "qty": 2
              }
            ],
            "outputs": [
              {
                "commodity": "yarn",
                "qty": 2
              }
            ]
          },
          {
            "inputs": [
              {
                "commodity": "cotton",
                "qty": 2
              }
            ],
            "outputs": [
              {
                "commodity": "yarn",
                "qty": 3
              }
            ]
          }
        ]
      },
      {
        "id": "weave-cloth",
        "name": "Weave Cloth",
        "category": "processing",
        "site": {
          "building": "weaver"
        },
        "tool": "loom",
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "yarn",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "cloth",
            "qty": 2
          }
        ]
      },
      {
        "id": "weave-fine-cloth",
        "name": "Weave Fine Cloth",
        "category": "processing",
        "site": {
          "building": "weaver"
        },
        "tool": "loom",
        "effortHours": 4,
        "specialist": "weaver",
        "inputs": [
          {
            "commodity": "yarn",
            "qty": 3
          },
          {
            "commodity": "berries",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "fine-cloth",
            "qty": 1
          }
        ],
        "notes": "Berries are the dye. Elven weavers produce 2."
      },
      {
        "id": "make-rope",
        "name": "Make Rope",
        "category": "crafting",
        "site": {
          "building": "weaver"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "flax",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "rope",
            "qty": 2
          }
        ]
      },
      {
        "id": "make-sack",
        "name": "Make Sacks",
        "category": "crafting",
        "site": {
          "building": "weaver"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "sack",
            "qty": 4
          }
        ]
      },
      {
        "id": "make-barrel",
        "name": "Make Barrels",
        "category": "crafting",
        "site": {
          "building": "carpenter"
        },
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 2
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "barrel",
            "qty": 3
          }
        ]
      },
      {
        "id": "make-crate",
        "name": "Make Crates",
        "category": "crafting",
        "site": {
          "building": "carpenter"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "crate",
            "qty": 2
          }
        ]
      },
      {
        "id": "forge-ironware",
        "name": "Forge Ironware",
        "category": "crafting",
        "site": {
          "building": "blacksmith"
        },
        "tool": "hammer",
        "effortHours": 3,
        "fuel": "standard",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 2
          }
        ],
        "outputs": [
          {
            "commodity": "ironware",
            "qty": 2
          }
        ]
      },
      {
        "id": "forge-tool",
        "name": "Forge Tool",
        "category": "crafting",
        "site": {
          "building": "blacksmith"
        },
        "tool": "hammer",
        "specialist": "smith",
        "effortHours": 0,
        "inputs": [],
        "outputs": [],
        "effect": "Make any tool from tools.json. Pay that tool's craft inputs and craft effort. Size 2 doubles the inputs, size 3 triples them."
      },
      {
        "id": "repair-tool",
        "name": "Repair Tool",
        "category": "crafting",
        "site": {
          "building": "blacksmith"
        },
        "tool": "hammer",
        "effortHours": 2,
        "inputs": [],
        "outputs": [],
        "effect": "Restore a tool's durability track to full for half its craft inputs, rounded up."
      },
      {
        "id": "make-jewellery",
        "name": "Make Jewellery",
        "category": "crafting",
        "site": {
          "building": "blacksmith"
        },
        "specialist": "smith",
        "effortHours": 4,
        "inputs": [
          {
            "commodity": "gold",
            "qty": 1
          },
          {
            "commodity": "gems",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "jewellery",
            "qty": 1
          }
        ],
        "notes": "Dwarven smiths spend 1 hour less. This is the densest value-per-slot in the game."
      },
      {
        "id": "sew-garment",
        "name": "Sew Garment",
        "category": "crafting",
        "site": {
          "building": "tailor"
        },
        "specialist": "tailor",
        "effortHours": 2,
        "inputs": [],
        "outputs": [],
        "effect": "Make any clothing or soft-armour item from items.json, paying its listed inputs."
      },
      {
        "id": "brew-ale",
        "name": "Brew Ale",
        "category": "brewing",
        "site": {
          "building": "brewery"
        },
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "grain",
            "qty": 3
          },
          {
            "commodity": "water",
            "qty": 2
          },
          {
            "commodity": "hops",
            "qty": 1
          },
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "ale",
            "qty": 2
          }
        ],
        "notes": "The brief called this 'mead as in the beer'. Grain-brewed, so it is ale here; mead has its own recipe below."
      },
      {
        "id": "brew-mead",
        "name": "Brew Mead",
        "category": "brewing",
        "site": {
          "building": "brewery"
        },
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "honey",
            "qty": 3
          },
          {
            "commodity": "water",
            "qty": 2
          },
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "mead",
            "qty": 2
          }
        ]
      },
      {
        "id": "make-wine",
        "name": "Make Wine",
        "category": "brewing",
        "site": {
          "building": "winery"
        },
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "grapes",
            "qty": 4
          },
          {
            "commodity": "water",
            "qty": 1
          },
          {
            "commodity": "barrel",
            "qty": 1
          }
        ],
        "outputs": [
          {
            "commodity": "wine",
            "qty": 2
          }
        ],
        "maturationRounds": 2,
        "notes": "Wine sits in the barrel for 2 rounds before it can be sold or drunk. Sell it early at half price if you must."
      },
      {
        "id": "forage",
        "name": "Forage",
        "category": "arcane",
        "site": {
          "terrain": [
            "forest",
            "hills",
            "marsh",
            "mountain",
            "grassland"
          ]
        },
        "effortHours": 2,
        "inputs": [],
        "outputs": [],
        "rollTable": "forage",
        "effect": "Roll on the forage table for what you find. No tool, no building - the opening move for a player who has nothing."
      },
      {
        "id": "harvest-herbs",
        "name": "Harvest Arcane Herbs",
        "category": "arcane",
        "site": {
          "terrain": [
            "forest",
            "marsh",
            "mountain"
          ]
        },
        "tool": "knife",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "arcane-herb",
            "qty": 1
          }
        ],
        "notes": "Elves take 2."
      },
      {
        "id": "pick-moon-blossom",
        "name": "Pick Moon Blossom",
        "category": "arcane",
        "site": {
          "terrain": [
            "grassland",
            "forest"
          ]
        },
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "moon-blossom",
            "qty": 1
          }
        ],
        "notes": "Only during a night leg - the flowers close at dawn. A lit torch or lantern is enough light to work by. See travel.json for the night rules."
      },
      {
        "id": "dig-ember-root",
        "name": "Dig Ember Root",
        "category": "arcane",
        "site": {
          "terrain": [
            "desert",
            "hills"
          ]
        },
        "tool": "shovel",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "ember-root",
            "qty": 1
          }
        ],
        "notes": "Warm to the touch when it comes out of the ground."
      },
      {
        "id": "scrape-frost-lichen",
        "name": "Scrape Frost Lichen",
        "category": "arcane",
        "site": {
          "terrain": [
            "tundra",
            "mountain"
          ]
        },
        "tool": "knife",
        "effortHours": 2,
        "inputs": [],
        "outputs": [
          {
            "commodity": "frost-lichen",
            "qty": 1
          }
        ],
        "notes": "Grows on the shaded side of standing stones. Physicians pay well for it."
      },
      {
        "id": "brew-potion",
        "name": "Brew Potion",
        "category": "arcane",
        "site": {
          "building": "alchemist"
        },
        "tool": "alembic",
        "specialist": "alchemist",
        "effortHours": 3,
        "inputs": [
          {
            "commodity": "water",
            "qty": 1
          }
        ],
        "outputs": [],
        "effect": "Make any potion from items.json, paying its listed ingredients on top of the water."
      },
      {
        "id": "work-market",
        "name": "Mind the Market",
        "category": "civic",
        "site": {
          "building": "market"
        },
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "effect": "Buy or sell up to 6 bulk of commodities at the town's current price band, paying the spread. Each extra hour buys another 6 bulk."
      },
      {
        "id": "broker-trade",
        "name": "Broker a Trade",
        "category": "civic",
        "site": {
          "building": "trading-house"
        },
        "specialist": "merchant",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "effect": "Trade any quantity with any player whose merchant or trading house is connected to this town by a route, at whatever price you agree. No spread. You may also broker a deal between two other players and take 10% of the coin."
      },
      {
        "id": "train-specialist",
        "name": "Train Specialist",
        "category": "civic",
        "site": {
          "building": "guildhall"
        },
        "effortHours": 3,
        "inputs": [],
        "outputs": [],
        "effect": "Turn one worker in this town into a specialist, paying the profession's coin cost from peoples.json. One training per guildhall per round."
      },
      {
        "id": "serve-drinks",
        "name": "Serve Drinks",
        "category": "civic",
        "site": {
          "building": "inn"
        },
        "effortHours": 1,
        "inputs": [
          {
            "commodity": "ale",
            "qty": 1
          }
        ],
        "outputs": [],
        "alternatives": [
          {
            "inputs": [
              {
                "commodity": "mead",
                "qty": 1
              }
            ],
            "outputs": []
          },
          {
            "inputs": [
              {
                "commodity": "wine",
                "qty": 1
              }
            ],
            "outputs": []
          }
        ],
        "effect": "Remove 1 unrest from this town and end any Strike affecting it. Wine removes 2."
      },
      {
        "id": "tend-the-sick",
        "name": "Tend the Sick",
        "category": "civic",
        "site": {
          "building": "infirmary"
        },
        "specialist": "healer",
        "effortHours": 2,
        "inputs": [
          {
            "commodity": "water",
            "qty": 1
          }
        ],
        "outputs": [],
        "effect": "Cure one illness marker on a worker, character or figure in this town, or restore 2 health to one character resting here. Spending a Physic Tonic as well cures every illness marker in the town."
      },
      {
        "id": "load-cargo",
        "name": "Load Cargo",
        "category": "civic",
        "site": {
          "building": "town-hall"
        },
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "effect": "Load a transport with commodities from this town's stockpile and set it on a route. Costs the mode's effortToLoad from transport.json; the packaging goes with it and comes back when the vehicle returns empty."
      },
      {
        "id": "build-generic",
        "name": "Building Work",
        "category": "works",
        "site": {
          "constructionSite": true
        },
        "tool": "hammer",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 1,
        "effect": "Add 1 build-point per hour to any construction site. The fallback when you have no specialised tool."
      },
      {
        "id": "build-timber-frame",
        "name": "Timber Framing",
        "category": "works",
        "site": {
          "constructionSite": true,
          "materialTag": "timber"
        },
        "tool": "saw",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 2,
        "effect": "Double-rate build work on any building whose cost is mostly logs or lumber."
      },
      {
        "id": "build-masonry",
        "name": "Masonry",
        "category": "works",
        "site": {
          "constructionSite": true,
          "materialTag": "masonry"
        },
        "tool": "trowel",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 2,
        "effect": "Double-rate build work on any building whose cost is mostly stone or brick."
      },
      {
        "id": "sink-mineshaft",
        "name": "Sink Mineshaft",
        "category": "works",
        "site": {
          "constructionSite": true,
          "building": "mine"
        },
        "tool": "shovel",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 2
      },
      {
        "id": "lay-roadbed",
        "name": "Lay Roadbed",
        "category": "works",
        "site": {
          "constructionSite": true,
          "building": "road"
        },
        "tool": "shovel",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 2,
        "effect": "Build-points go onto the road under construction on that tile. Terrain multiplies the cost - see terrain.json."
      },
      {
        "id": "lay-rail",
        "name": "Lay Rail",
        "category": "works",
        "site": {
          "constructionSite": true,
          "building": "rail"
        },
        "tool": "hammer",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "buildPointsPerHour": 2,
        "effect": "Same as roadbed, but for railroad, and the terrain multipliers bite far harder."
      },
      {
        "id": "survey-deposit",
        "name": "Survey",
        "category": "works",
        "site": {
          "figure": "prospector"
        },
        "tool": "surveyors-kit",
        "effortHours": 1,
        "inputs": [],
        "outputs": [],
        "rollTable": "survey",
        "effect": "On the prospector's current tile, roll the survey die. On a success, place the deposit token face up - it is now minable by whoever builds there first."
      },
      {
        "id": "plan-route",
        "name": "Plan Route",
        "category": "works",
        "site": {
          "figure": "prospector"
        },
        "tool": "surveyors-kit",
        "effortHours": 2,
        "inputs": [],
        "outputs": [],
        "effect": "Mark a surveyed line across up to 3 tiles. Road or rail built along it costs 1 less build-point per tile."
      }
    ],
    "rollTables": {
      "forage": {
        "die": "d6",
        "results": {
          "1": {
            "outputs": [],
            "text": "Nothing but scratches."
          },
          "2": {
            "outputs": [
              {
                "commodity": "berries",
                "qty": 1
              }
            ]
          },
          "3": {
            "outputs": [
              {
                "commodity": "berries",
                "qty": 2
              }
            ]
          },
          "4": {
            "outputs": [
              {
                "commodity": "mushrooms",
                "qty": 2
              }
            ]
          },
          "5": {
            "outputs": [
              {
                "commodity": "vegetables",
                "qty": 1
              },
              {
                "commodity": "berries",
                "qty": 1
              }
            ]
          },
          "6": {
            "outputs": [
              {
                "commodity": "arcane-herb",
                "qty": 1
              }
            ],
            "text": "Something that hums faintly when you pick it."
          }
        },
        "modifiers": [
          {
            "when": "terrain is forest or marsh",
            "effect": "+1 to the roll"
          },
          {
            "when": "forager is an elf",
            "effect": "+1 to the roll"
          },
          {
            "when": "terrain is tundra or desert",
            "effect": "-2 to the roll"
          }
        ]
      },
      "survey": {
        "die": "d6",
        "results": {
          "1": {
            "text": "Bad ground. No deposit here."
          },
          "2": {
            "text": "Bad ground. No deposit here."
          },
          "3": {
            "text": "Traces. Survey this tile again next round at +1."
          },
          "4": {
            "text": "Reveal the tile's deposit token if it has one."
          },
          "5": {
            "text": "Reveal the tile's deposit token if it has one."
          },
          "6": {
            "text": "Reveal the deposit, and it starts with +2 yield."
          }
        },
        "modifiers": [
          {
            "when": "terrain is mountain or hills",
            "effect": "+1 to the roll"
          },
          {
            "when": "surveyor is a dwarf",
            "effect": "+1 to the roll"
          }
        ]
      }
    }
  },
  "terrain": {
    "$comment": "The board is a grid of tiles. Each tile has one terrain type, which decides what can be built there, what it costs to cross, what deposits can hide underneath it, and what a discovery roll there can turn up. Every terrain carries a single-letter CODE: it is printed in the bottom corner of every hex on every map overlay, so there is never an argument about what a cell is when the artwork underneath straddles the grid line. The codes key the travel-speed table in travel.json and the discovery tables in discovery.json.",
    "version": "0.2.0",
    "tileShape": "hex",
    "tileShapeAlternatives": [
      "square"
    ],
    "terrains": [
      {
        "id": "grassland",
        "name": "Grassland",
        "code": "G",
        "family": "land",
        "colour": "#8fae5d",
        "summary": "Flat, open, dull and valuable. The default good ground, riverlands included.",
        "moveCost": 1,
        "roadCostMultiplier": 1,
        "railCostMultiplier": 1,
        "buildable": true,
        "features": [
          "trees-sparse"
        ],
        "deposits": [
          "clay-bed",
          "coal-seam",
          "iron-deposit",
          "salt-dome",
          "oil-field",
          "gold-deposit"
        ],
        "startTile": true
      },
      {
        "id": "forest",
        "name": "Forest",
        "code": "F",
        "family": "land",
        "colour": "#3f6b3a",
        "summary": "Carries tree tokens. Fell them for logs; when the last one goes, the tile becomes grassland.",
        "moveCost": 2,
        "roadCostMultiplier": 2,
        "railCostMultiplier": 2,
        "buildable": true,
        "features": [
          "trees-dense",
          "game",
          "herbs"
        ],
        "deposits": [
          "clay-bed",
          "iron-deposit",
          "mana-vein"
        ],
        "treeTokens": 6,
        "startTile": true
      },
      {
        "id": "hills",
        "name": "Hills",
        "code": "H",
        "family": "land",
        "colour": "#a08b5c",
        "summary": "Where the ore usually is, and where a mill or vineyard does best.",
        "moveCost": 2,
        "roadCostMultiplier": 2,
        "railCostMultiplier": 3,
        "buildable": true,
        "features": [
          "stone",
          "game",
          "caves"
        ],
        "deposits": [
          "coal-seam",
          "iron-deposit",
          "copper-deposit",
          "gold-deposit",
          "gem-vein",
          "mana-vein"
        ]
      },
      {
        "id": "mountain",
        "name": "Mountain",
        "code": "M",
        "family": "land",
        "colour": "#7d7d86",
        "summary": "The richest ground and the most expensive to cross. Rail through a mountain is a statement.",
        "moveCost": 4,
        "roadCostMultiplier": 4,
        "railCostMultiplier": 6,
        "buildable": true,
        "housingAllowed": false,
        "features": [
          "stone",
          "herbs",
          "caves"
        ],
        "deposits": [
          "coal-seam",
          "iron-deposit",
          "copper-deposit",
          "gold-deposit",
          "gem-vein",
          "mana-vein"
        ]
      },
      {
        "id": "marsh",
        "name": "Marsh",
        "code": "B",
        "family": "land",
        "colour": "#5f7360",
        "summary": "Peat, clay and fresh water for anyone patient enough to live here. B for bog.",
        "moveCost": 3,
        "roadCostMultiplier": 3,
        "railCostMultiplier": 4,
        "buildable": true,
        "features": [
          "reeds",
          "herbs",
          "fresh-water"
        ],
        "deposits": [
          "clay-bed",
          "peat-bog",
          "oil-field"
        ]
      },
      {
        "id": "tundra",
        "name": "Tundra",
        "code": "T",
        "family": "land",
        "colour": "#b7c2c4",
        "summary": "Cold and thin. Cold Snap events hit here first and hardest.",
        "moveCost": 2,
        "roadCostMultiplier": 2,
        "railCostMultiplier": 2,
        "buildable": true,
        "features": [
          "game"
        ],
        "deposits": [
          "coal-seam",
          "iron-deposit",
          "oil-field",
          "peat-bog"
        ],
        "effortPenalty": -1
      },
      {
        "id": "desert",
        "name": "Desert",
        "code": "D",
        "family": "land",
        "colour": "#d6c08a",
        "summary": "Sand and salt. Nothing grows without a well, and the discovery table is not your friend.",
        "moveCost": 2,
        "roadCostMultiplier": 2,
        "railCostMultiplier": 2,
        "buildable": true,
        "features": [
          "sand"
        ],
        "deposits": [
          "salt-dome",
          "oil-field",
          "gem-vein"
        ],
        "requiresWaterForFarming": true
      },
      {
        "id": "coast",
        "name": "Coast",
        "code": "C",
        "family": "land",
        "colour": "#c9c193",
        "summary": "Any shore - sea, lake or river mouth. The only place a harbour can go.",
        "moveCost": 1,
        "roadCostMultiplier": 1,
        "railCostMultiplier": 2,
        "buildable": true,
        "waterAccess": true,
        "features": [
          "fish",
          "sand",
          "salt",
          "fresh-water"
        ],
        "deposits": [
          "salt-dome",
          "sand-bar",
          "clay-bed",
          "gold-deposit"
        ],
        "startTile": true
      },
      {
        "id": "shallow-water",
        "name": "Shallow Water",
        "code": "S",
        "family": "water",
        "colour": "#7fb6cf",
        "summary": "Lakes, straits and inshore sea. Crossable by bridge, navigable by barge.",
        "moveCost": 99,
        "roadCostMultiplier": 0,
        "railCostMultiplier": 0,
        "buildable": false,
        "bridgeable": true,
        "features": [
          "fish"
        ],
        "navigableBy": [
          "barge",
          "ship"
        ]
      },
      {
        "id": "deep-water",
        "name": "Deep Water",
        "code": "O",
        "family": "water",
        "colour": "#3f7ba0",
        "summary": "Open sea. Ships only, and no bridge will ever cross it. O for ocean.",
        "moveCost": 99,
        "roadCostMultiplier": 0,
        "railCostMultiplier": 0,
        "buildable": false,
        "bridgeable": false,
        "features": [
          "fish"
        ],
        "navigableBy": [
          "ship"
        ]
      }
    ],
    "features": [
      {
        "id": "trees-dense",
        "name": "Dense Trees",
        "summary": "6 tree tokens. Each felling removes one."
      },
      {
        "id": "trees-sparse",
        "name": "Scattered Trees",
        "summary": "2 tree tokens."
      },
      {
        "id": "stone",
        "name": "Exposed Stone",
        "summary": "A quarry may be built here."
      },
      {
        "id": "fresh-water",
        "name": "Fresh Water",
        "summary": "Draw water without a well."
      },
      {
        "id": "fish",
        "name": "Fishing Ground",
        "summary": "A dock built on an adjacent land tile may net fish here."
      },
      {
        "id": "game",
        "name": "Game",
        "summary": "Hunting is allowed on this tile."
      },
      {
        "id": "herbs",
        "name": "Herbs",
        "summary": "Arcane herbs may be harvested here."
      },
      {
        "id": "reeds",
        "name": "Reeds",
        "summary": "Counts as flax for rope-making, at 1 per 2 hours."
      },
      {
        "id": "sand",
        "name": "Sand",
        "summary": "A sand pit may be built here."
      },
      {
        "id": "salt",
        "name": "Salt Flat",
        "summary": "Salt may be raked with a shovel, 1 per 2 hours, no mine needed."
      },
      {
        "id": "clay",
        "name": "Clay Bank",
        "summary": "A clay pit may be built here."
      },
      {
        "id": "caves",
        "name": "Caves",
        "summary": "Discovery rolls here can reveal a cave mouth. Entering a cave needs a lit torch or lantern - see travel.json and discovery.json."
      }
    ],
    "boardSetup": {
      "$comment": "Setup for a board dealt from a bag of TILES. That board is shelved - see https://github.com/cdomotor-g/game1/issues/18 - and this block is kept rather than removed, because it is still the right answer for a tile set and because tools/validate-map.mjs reads terrainMix and recommendedTiles to report what a DRAWN board actually holds against what the rules assume. Nothing here is a rule about a drawn map: a continent is not a shuffled tile bag, and validate-map reports the gap without ever failing on it.",
      "recommendedTiles": {
        "2players": 37,
        "3players": 49,
        "4players": 61,
        "5players": 75
      },
      "faceDownAtStart": "All tiles beyond each player's starting cluster of 3.",
      "startingCluster": "Each player places a town hall on a face-up start tile plus its two neighbours, at least 3 tiles from any other player.",
      "terrainMix": {
        "grassland": 0.3,
        "forest": 0.2,
        "hills": 0.14,
        "mountain": 0.08,
        "marsh": 0.06,
        "tundra": 0.04,
        "desert": 0.04,
        "coast": 0.08,
        "shallow-water": 0.04,
        "deep-water": 0.02
      }
    }
  },
  "deposits": {
    "$comment": "Deposits are face-down tokens placed under tiles at setup. A prospector's survey flips them. A deposit is not a commodity - it is a finite source that a mine draws from until it is exhausted.\n\ntokenYields is the heart of it: one number per token, and they are NOT all the same. Two coal seams on the same board are not the same prospect, and a game where they are is a game where surveying is arithmetic rather than a gamble. Make one token per number, richest first in this file and face down on the table; what a survey reveals is which one you found. The sum of the list is the type's total yield and its length is how many go into the box - both are derived, and neither is written down twice.",
    "version": "0.2.0",
    "deposits": [
      {
        "id": "clay-bed",
        "name": "Clay Bed",
        "requiresBuilding": "clay-pit",
        "yields": [
          "clay"
        ],
        "tokenYields": [
          7,
          6,
          6,
          5,
          5,
          4,
          4,
          3
        ],
        "surveyDifficulty": 2,
        "summary": "Common and shallow. Often visible without a survey on marsh and coast tiles."
      },
      {
        "id": "sand-bar",
        "name": "Sand Bar",
        "requiresBuilding": "sand-pit",
        "yields": [
          "sand"
        ],
        "tokenYields": [
          9,
          8,
          7,
          6,
          5,
          5
        ],
        "surveyDifficulty": 2
      },
      {
        "id": "peat-bog",
        "name": "Peat Bog",
        "requiresBuilding": null,
        "yields": [
          "peat"
        ],
        "tokenYields": [
          8,
          7,
          6,
          5,
          4
        ],
        "surveyDifficulty": 2,
        "summary": "No mine needed - just a shovel and a strong back."
      },
      {
        "id": "coal-seam",
        "name": "Coal Seam",
        "requiresBuilding": "mine",
        "yields": [
          "coal"
        ],
        "tokenYields": [
          8,
          6,
          5,
          4,
          3,
          2,
          2
        ],
        "surveyDifficulty": 4,
        "summary": "The engine of the industrial half of the game. Whoever holds coal sets the price of steel."
      },
      {
        "id": "iron-deposit",
        "name": "Iron Deposit",
        "requiresBuilding": "mine",
        "yields": [
          "iron-ore"
        ],
        "tokenYields": [
          7,
          6,
          4,
          4,
          3,
          2,
          2
        ],
        "surveyDifficulty": 4
      },
      {
        "id": "copper-deposit",
        "name": "Copper Deposit",
        "requiresBuilding": "mine",
        "yields": [
          "copper-ore"
        ],
        "tokenYields": [
          8,
          5,
          4,
          3
        ],
        "surveyDifficulty": 4
      },
      {
        "id": "gold-deposit",
        "name": "Gold Deposit",
        "requiresBuilding": "mine",
        "yields": [
          "gold-ore"
        ],
        "tokenYields": [
          6,
          3,
          1
        ],
        "surveyDifficulty": 5
      },
      {
        "id": "gem-vein",
        "name": "Gem Vein",
        "requiresBuilding": "mine",
        "yields": [
          "gems"
        ],
        "tokenYields": [
          5,
          2,
          1
        ],
        "surveyDifficulty": 5,
        "theftTarget": true
      },
      {
        "id": "salt-dome",
        "name": "Salt Dome",
        "requiresBuilding": "mine",
        "yields": [
          "salt"
        ],
        "tokenYields": [
          9,
          7,
          5,
          3
        ],
        "surveyDifficulty": 3
      },
      {
        "id": "mana-vein",
        "name": "Mana Vein",
        "requiresBuilding": "mine",
        "yields": [
          "mana-crystal"
        ],
        "tokenYields": [
          4,
          2
        ],
        "surveyDifficulty": 6,
        "summary": "Rare. Elves will not mine one and will pay well to stop you."
      },
      {
        "id": "oil-field",
        "name": "Oil Field",
        "requiresBuilding": "oil-derrick",
        "yields": [
          "crude-oil"
        ],
        "tokenYields": [
          11,
          6,
          3
        ],
        "surveyDifficulty": 5,
        "summary": "Worthless until someone builds a steelworks and a derrick. Then it is the best tile on the board."
      }
    ]
  },
  "transport": {
    "$comment": "Moving commodities between towns. Capacity is in bulk points; speed is tiles per round. Cargo in transit sits on the board as a token and can be robbed.",
    "version": "0.1.0",
    "modes": [
      {
        "id": "porter",
        "name": "Porter",
        "tier": 1,
        "summary": "A worker with a sack. Free, slow, and barely worth it - but it is what you have in round one.",
        "capacity": 3,
        "speed": 2,
        "requires": "none",
        "buyCost": 0,
        "effortToLoad": 1,
        "packaging": [
          {
            "commodity": "sack",
            "qty": 2
          }
        ],
        "upkeep": 0,
        "theftRisk": 1,
        "waterCapable": false,
        "notes": "Costs one worker for the whole journey - they are not available for allocation until they return."
      },
      {
        "id": "cart",
        "name": "Cart",
        "tier": 1,
        "summary": "The workhorse. Doubles its speed on roads.",
        "capacity": 8,
        "speed": 2,
        "speedOnRoad": 4,
        "requires": "none",
        "buyCost": 35,
        "effortToLoad": 1,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 2
          },
          {
            "commodity": "sack",
            "qty": 2
          }
        ],
        "upgrade": {
          "commodity": "horse",
          "qty": 1,
          "effect": "+1 speed while the horse is hitched"
        },
        "craft": {
          "building": "carpenter",
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 3
            },
            {
              "commodity": "ironware",
              "qty": 1
            }
          ],
          "effortHours": 3
        },
        "upkeep": 0,
        "theftRisk": 2,
        "waterCapable": false,
        "notes": "Hitch a horse to raise speed by 1."
      },
      {
        "id": "caravan",
        "name": "Caravan",
        "tier": 2,
        "summary": "Several carts moving together. Slower to assemble, much harder to rob.",
        "capacity": 24,
        "speed": 2,
        "speedOnRoad": 3,
        "requires": "road",
        "buyCost": 120,
        "effortToLoad": 3,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 6
          },
          {
            "commodity": "sack",
            "qty": 4
          }
        ],
        "upgrade": {
          "commodity": "horse",
          "qty": 2,
          "effect": "+1 speed while the horses are hitched"
        },
        "upkeep": 2,
        "theftRisk": 1,
        "waterCapable": false,
        "escortable": true,
        "notes": "A soldier assigned as escort drops theft risk to 0 but eats like any other worker."
      },
      {
        "id": "barge",
        "name": "Barge",
        "tier": 2,
        "summary": "River and lake freight. Cheap per unit, and it goes where the water goes.",
        "capacity": 30,
        "speed": 3,
        "requires": "dock",
        "buyCost": 110,
        "effortToLoad": 2,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 8
          }
        ],
        "craft": {
          "building": "dock",
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 6
            },
            {
              "commodity": "rope",
              "qty": 2
            }
          ],
          "effortHours": 6
        },
        "upkeep": 1,
        "theftRisk": 2,
        "waterCapable": true,
        "waters": [
          "shallow-water",
          "coast"
        ]
      },
      {
        "id": "ship",
        "name": "Ship",
        "tier": 3,
        "summary": "Sea freight between harbours. The cheapest bulk movement in the game once the harbours exist.",
        "capacity": 60,
        "speed": 4,
        "requires": "harbour",
        "buyCost": 280,
        "effortToLoad": 4,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 12
          }
        ],
        "craft": {
          "building": "harbour",
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 12
            },
            {
              "commodity": "rope",
              "qty": 4
            },
            {
              "commodity": "cloth",
              "qty": 3
            },
            {
              "commodity": "ironware",
              "qty": 2
            }
          ],
          "effortHours": 14
        },
        "upkeep": 3,
        "theftRisk": 3,
        "waterCapable": true,
        "waters": [
          "shallow-water",
          "deep-water",
          "coast"
        ],
        "notes": "Storm events can sink a ship outright. Insure it by splitting cargo across two."
      },
      {
        "id": "train",
        "name": "Train",
        "tier": 3,
        "summary": "Rail freight between depots. Fast, huge, and it only runs where you laid the track.",
        "capacity": 80,
        "speed": 6,
        "requires": "rail-depot",
        "buyCost": 350,
        "effortToLoad": 3,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 16
          }
        ],
        "craft": {
          "building": "steelworks",
          "inputs": [
            {
              "commodity": "steel",
              "qty": 8
            },
            {
              "commodity": "ironware",
              "qty": 4
            },
            {
              "commodity": "lumber",
              "qty": 4
            }
          ],
          "effortHours": 16
        },
        "upkeep": 4,
        "fuelPerTile": [
          {
            "commodity": "coal",
            "qty": 1
          }
        ],
        "theftRisk": 2,
        "waterCapable": false,
        "notes": "The brief's train heist target. Big, valuable, and it cannot take a detour."
      },
      {
        "id": "sled",
        "name": "Sled",
        "tier": 2,
        "summary": "A team in harness and a load on runners. The only thing that crosses tundra faster than it crosses grass.",
        "capacity": 10,
        "speed": 3,
        "requires": "none",
        "buyCost": 90,
        "effortToLoad": 2,
        "packaging": [
          {
            "commodity": "sack",
            "qty": 5
          }
        ],
        "craft": {
          "building": "carpenter",
          "inputs": [
            {
              "commodity": "lumber",
              "qty": 4
            },
            {
              "commodity": "leather",
              "qty": 3
            },
            {
              "commodity": "rope",
              "qty": 2
            }
          ],
          "effortHours": 6
        },
        "upkeep": 2,
        "theftRisk": 1,
        "waterCapable": false,
        "notes": "The team eats: 2 meat per round on the road, and a sled left standing through a thaw is a pile of lumber. It runs on snow, ice and frozen marsh, which on this board means tundra, mountain and anything the winter has taken."
      },
      {
        "id": "airship",
        "name": "Airship",
        "tier": 4,
        "summary": "A gasbag, a gondola and a great deal of nerve. It goes over everything - and it is at the mercy of the wind.",
        "capacity": 18,
        "speed": 5,
        "requires": "none",
        "buyCost": 520,
        "effortToLoad": 3,
        "packaging": [
          {
            "commodity": "crate",
            "qty": 4
          }
        ],
        "craft": {
          "building": "glassworks",
          "inputs": [
            {
              "commodity": "fine-cloth",
              "qty": 8
            },
            {
              "commodity": "rope",
              "qty": 6
            },
            {
              "commodity": "lumber",
              "qty": 4
            },
            {
              "commodity": "ironware",
              "qty": 3
            }
          ],
          "effortHours": 18
        },
        "upkeep": 5,
        "fuelPerTile": [
          {
            "commodity": "charcoal",
            "qty": 1
          }
        ],
        "theftRisk": 0,
        "waterCapable": true,
        "notes": "Ignores terrain entirely - there is no ground up there - but it is the only mode weather can stop dead, and the only one with nowhere to tie up. It must end each journey at a settlement or lose 1 damage box to the mooring. Cargo aboard an airship cannot be robbed on the road; it can be dropped."
      }
    ],
    "routes": {
      "$comment": "A route is a chain of tiles between two towns. Cargo moves along it at the mode's speed, spending the tile move cost.",
      "rules": [
        "A route must start and end at a town, and each tile in it must be passable by the chosen mode.",
        "Carts and caravans halve their tile costs on road tiles. Trains ignore tile costs entirely but need rail on every tile.",
        "Cargo in transit is a token on the board. It is visible to all players and can be targeted by theft events and by raids.",
        "Arriving cargo is added to the destination town's stockpile during the Production Tick phase - if there is no room, it spoils.",
        "A route crossing a water tile needs a bridge, or the cargo must change to a water mode at a dock or harbour."
      ]
    },
    "figures": [
      {
        "id": "prospector",
        "name": "Prospector",
        "movePoints": 4,
        "cost": 40,
        "summary": "Flips face-down tiles and surveys deposits. Carries a surveyor's kit.",
        "carries": 1
      },
      {
        "id": "merchant",
        "name": "Merchant",
        "movePoints": 4,
        "cost": 60,
        "summary": "Trades with any player whose merchant or trading house is in or adjacent to the same town. Removes the market spread wherever it stands.",
        "carries": 4
      },
      {
        "id": "soldier",
        "name": "Soldier",
        "movePoints": 3,
        "cost": 30,
        "summary": "Fights, escorts caravans, garrisons towns. Eats 1 food per round whether it fights or not.",
        "carries": 2
      },
      {
        "id": "hero",
        "name": "Hero",
        "movePoints": 5,
        "cost": 0,
        "summary": "One per player, free at setup. Carries potions and equipment, rolls an extra combat die, and never starves. A character card from data/characters.json gives the hero a name, a face, a health bar and sometimes mana.",
        "carries": 3,
        "unique": true
      }
    ]
  },
  "peoples": {
    "$comment": "Who does the work. Peoples set a player's baseline (die size, terrain comfort, food quirks, how they hold mana). Professions are individual workers upgraded at a guildhall - they unlock recipes that plain workers cannot run. manaStorage.innate is how much mana a body of that people can hold with no talisman; everyone can hold more in a talisman (items.json, class talisman). carry.baseKg is how much mass, in kilograms, a figure of that people carries unaided; a character card prints its own limit as the BURDEN bar, that base adjusted for build and calling - see rules.json carrying.",
    "version": "0.3.0",
    "peoples": [
      {
        "id": "human",
        "name": "Humans",
        "effortDie": "d6",
        "startingWorkers": 2,
        "summary": "No edges and no gaps. Cheapest buildings, widest recipe access.",
        "traits": [
          {
            "name": "Adaptable",
            "effect": "Ignore the first terrain effort penalty each round."
          },
          {
            "name": "Builders",
            "effect": "All housing costs 1 less of its bulkiest material."
          }
        ],
        "foodPreference": [],
        "terrainComfort": [
          "grassland",
          "coast",
          "forest"
        ],
        "carry": {
          "baseKg": 22,
          "note": "The middle of every scale, this one included."
        },
        "manaStorage": {
          "innate": 0,
          "note": "A human body holds no mana. Every drop lives in a talisman."
        }
      },
      {
        "id": "dwarf",
        "name": "Dwarves",
        "effortDie": "d6",
        "startingWorkers": 2,
        "summary": "Underground and metallurgy. Slow above ground, unmatched below it.",
        "traits": [
          {
            "name": "Deep Delvers",
            "effect": "Roll d8 instead of d6 for any worker allocated to a mine or quarry."
          },
          {
            "name": "Smiths",
            "effect": "Forge Tool and Make Jewellery cost 1 fewer hour."
          },
          {
            "name": "Surefooted",
            "effect": "Mountain and hills tiles cost 1 less to move through, minimum 1."
          },
          {
            "name": "Thirsty",
            "effect": "A dwarf fed mead rolls one die size up next round."
          },
          {
            "name": "Sun-shy",
            "effect": "-1 effort for any dwarf allocated to a farm, orchard or vineyard."
          }
        ],
        "foodPreference": [
          "mead",
          "meat",
          "mushrooms"
        ],
        "terrainComfort": [
          "mountain",
          "hills",
          "tundra"
        ],
        "carry": {
          "baseKg": 26,
          "note": "Short, and built like the stone they work: a dwarf out-carries a taller people all day."
        },
        "manaStorage": {
          "innate": 0,
          "note": "Dwarves distrust mana in the flesh and keep it in worked metal, where it belongs."
        }
      },
      {
        "id": "elf",
        "name": "Elves",
        "effortDie": "d6",
        "startingWorkers": 2,
        "summary": "Forest, textiles and the arcane. Terrible miners, superb weavers.",
        "traits": [
          {
            "name": "Woodwise",
            "effect": "Forage and Harvest Arcane Herbs yield double."
          },
          {
            "name": "Fine Hands",
            "effect": "Weave Fine Cloth produces 2 instead of 1."
          },
          {
            "name": "Longstriders",
            "effect": "Forest tiles cost 1 to move through."
          },
          {
            "name": "Will Not Delve",
            "effect": "Elves cannot be allocated to a mana vein, and roll d4 in any other mine."
          }
        ],
        "foodPreference": [
          "berries",
          "wine",
          "vegetables"
        ],
        "terrainComfort": [
          "forest",
          "hills",
          "grassland"
        ],
        "carry": {
          "baseKg": 20,
          "note": "Light-framed, and disinclined to haul what a second trip would carry."
        },
        "manaStorage": {
          "innate": 3,
          "note": "An elf may hold up to 3 mana in the body; anything beyond that needs a talisman like everyone else."
        }
      },
      {
        "id": "halfling",
        "name": "Halflings",
        "effortDie": "d6",
        "startingWorkers": 3,
        "summary": "Numerous, agricultural, and permanently hungry.",
        "traits": [
          {
            "name": "Many Hands",
            "effect": "Start with one extra worker, and huts cost 1 log."
          },
          {
            "name": "Green Fingers",
            "effect": "All crops mature one round faster, minimum 1."
          },
          {
            "name": "Second Breakfast",
            "effect": "A halfling town pays 2 extra food every Feeding phase, however many halflings live in it."
          },
          {
            "name": "Small",
            "effect": "-1 combat die per halfling unit."
          }
        ],
        "foodPreference": [
          "bread",
          "cheese",
          "ale",
          "apples"
        ],
        "terrainComfort": [
          "grassland",
          "forest",
          "coast"
        ],
        "carry": {
          "baseKg": 16,
          "note": "Small hands and a small back - and a wagon, which is rather the point."
        },
        "manaStorage": {
          "innate": 0,
          "note": "Halflings hold no mana and are privately relieved about it."
        }
      },
      {
        "id": "orc",
        "name": "Orcs",
        "effortDie": "d8",
        "startingWorkers": 2,
        "summary": "Enormous output, no patience. Built for a short, aggressive game.",
        "traits": [
          {
            "name": "Brutal Labour",
            "effect": "Roll d8 for every worker."
          },
          {
            "name": "Hard on Tools",
            "effect": "Tools take 2 wear per effort hour instead of 1."
          },
          {
            "name": "Raiders",
            "effect": "+1 combat die when attacking, and loot 40% instead of 25%."
          },
          {
            "name": "Crude Craft",
            "effect": "Cannot build tier-3 or tier-4 buildings without capturing one first."
          }
        ],
        "foodPreference": [
          "meat",
          "salted-meat",
          "ale"
        ],
        "terrainComfort": [
          "hills",
          "marsh",
          "tundra",
          "mountain"
        ],
        "carry": {
          "baseKg": 28,
          "note": "The most any figure in the game shoulders unaided."
        },
        "manaStorage": {
          "innate": 0,
          "note": "An orc who wants mana takes a talisman from someone who had one."
        }
      }
    ],
    "workerTypes": [
      {
        "id": "worker",
        "name": "Worker",
        "summary": "The basic unit of labour. One effort die per round, one food per round.",
        "foodPerRound": 1,
        "dice": 1
      },
      {
        "id": "specialist",
        "name": "Specialist",
        "summary": "A worker trained in a profession. Same dice, but unlocks gated recipes and adds a bonus at its own building.",
        "foodPerRound": 1,
        "dice": 1
      },
      {
        "id": "soldier",
        "name": "Soldier",
        "summary": "A worker under arms. Produces no effort, eats normally, fights.",
        "foodPerRound": 1,
        "dice": 0
      }
    ],
    "professions": [
      {
        "id": "smith",
        "name": "Smith",
        "building": "blacksmith",
        "trainCost": {
          "coin": 40,
          "effortHours": 3
        },
        "unlocks": [
          "forge-tool",
          "make-jewellery"
        ],
        "bonus": "+1 output on any recipe run at a blacksmith."
      },
      {
        "id": "carpenter",
        "name": "Carpenter",
        "building": "carpenter",
        "trainCost": {
          "coin": 35,
          "effortHours": 3
        },
        "unlocks": [],
        "bonus": "Build-points from this worker count double on timber buildings."
      },
      {
        "id": "weaver",
        "name": "Weaver",
        "building": "weaver",
        "trainCost": {
          "coin": 40,
          "effortHours": 3
        },
        "unlocks": [
          "weave-fine-cloth"
        ],
        "bonus": "+1 yarn on every Spin Yarn."
      },
      {
        "id": "tailor",
        "name": "Tailor",
        "building": "tailor",
        "trainCost": {
          "coin": 50,
          "effortHours": 3
        },
        "unlocks": [
          "sew-garment"
        ],
        "bonus": "Garments cost 1 less cloth."
      },
      {
        "id": "brewer",
        "name": "Brewer",
        "building": "brewery",
        "trainCost": {
          "coin": 45,
          "effortHours": 3
        },
        "unlocks": [],
        "bonus": "+1 barrel of output on Brew Ale, Brew Mead and Make Wine."
      },
      {
        "id": "merchant",
        "name": "Merchant",
        "building": "trading-house",
        "trainCost": {
          "coin": 60,
          "effortHours": 2
        },
        "unlocks": [],
        "bonus": "Removes the market spread in this town, and may broker a trade between two other players for a 10% cut."
      },
      {
        "id": "alchemist",
        "name": "Alchemist",
        "building": "alchemist",
        "trainCost": {
          "coin": 70,
          "effortHours": 4
        },
        "unlocks": [
          "brew-potion"
        ],
        "bonus": "Potions brewed here last one extra round."
      },
      {
        "id": "healer",
        "name": "Healer",
        "building": "infirmary",
        "trainCost": {
          "coin": 50,
          "effortHours": 3
        },
        "unlocks": [
          "tend-the-sick"
        ],
        "bonus": "Illness event cards cost this healer's town one worker fewer, and characters resting at this town's inn heal +1 per round.",
        "notes": "Physician, medic, hedge-witch, bone-setter - the title varies by people, the profession is the same. The character deck carries named examples."
      },
      {
        "id": "miner",
        "name": "Miner",
        "building": "mine",
        "trainCost": {
          "coin": 45,
          "effortHours": 3
        },
        "unlocks": [],
        "bonus": "+1 output on any mining recipe, and picks wear half as fast in this worker's hands."
      },
      {
        "id": "farmer",
        "name": "Farmer",
        "building": "farm",
        "trainCost": {
          "coin": 35,
          "effortHours": 3
        },
        "unlocks": [],
        "bonus": "+2 output on every harvest recipe."
      },
      {
        "id": "engineer",
        "name": "Engineer",
        "building": "rail-depot",
        "trainCost": {
          "coin": 80,
          "effortHours": 4
        },
        "unlocks": [],
        "bonus": "Lay Rail costs 1 less build-point per tile, and trains this player runs need 1 less coal per tile."
      }
    ]
  },
  "events": {
    "$comment": "During the Events phase each player, in turn order, reveals one card and resolves it (see deck below). The card's scope decides who it hits: a global card the third player draws still hits everyone. Each card carries plain text for the tabletop game and a machine-readable effects array so the digital version can resolve it automatically.",
    "version": "0.2.0",
    "scopes": [
      {
        "id": "global",
        "name": "Global",
        "summary": "Applies to every player, whoever drew it."
      },
      {
        "id": "local",
        "name": "Local",
        "summary": "Applies to one region of the board - roll for the region."
      },
      {
        "id": "targeted",
        "name": "Targeted",
        "summary": "Applies to the player who drew it - except crime cards, which target the leader."
      },
      {
        "id": "offer",
        "name": "Offer",
        "summary": "An opportunity. The drawer decides first; if they pass, it goes round in turn order."
      }
    ],
    "categories": [
      {
        "id": "weather",
        "name": "Weather"
      },
      {
        "id": "disaster",
        "name": "Natural Disaster"
      },
      {
        "id": "crime",
        "name": "Crime"
      },
      {
        "id": "wildlife",
        "name": "Wildlife"
      },
      {
        "id": "conflict",
        "name": "Conflict"
      },
      {
        "id": "social",
        "name": "People"
      },
      {
        "id": "market",
        "name": "Market"
      },
      {
        "id": "industry",
        "name": "Industry"
      },
      {
        "id": "arcane",
        "name": "Arcane"
      }
    ],
    "effectTypes": {
      "$comment": "The vocabulary the digital engine understands. Keep new cards inside it where you can.",
      "effort": "Change effort dice or hours for matching workers.",
      "commodity-loss": "Remove commodities from stockpiles.",
      "commodity-gain": "Add commodities to stockpiles.",
      "price": "Shift a commodity family's price band.",
      "building": "Damage, destroy or halt a building.",
      "tool": "Add wear to or break tools.",
      "population": "Add or remove workers.",
      "unrest": "Add or remove unrest.",
      "movement": "Change movement or block routes.",
      "cargo": "Affect goods in transit.",
      "combat": "Spawn or resolve a fight.",
      "crop": "Affect growing crops.",
      "choice": "Player picks between listed branches.",
      "health": "Damage or heal characters and travelling figures.",
      "discovery": "Widen or shrink a result band on the discovery tables - see data/discovery.json."
    },
    "cards": [
      {
        "id": "hard-frost",
        "cardCode": "EVT-01",
        "name": "Hard Frost",
        "category": "weather",
        "scope": "global",
        "copies": 3,
        "text": "A cold snap grips the map. Crops stall and outdoor work is miserable.",
        "effects": [
          {
            "type": "crop",
            "op": "pause",
            "target": "all-growing",
            "rounds": 1
          },
          {
            "type": "effort",
            "op": "flat",
            "value": -1,
            "target": "workers-on-terrain",
            "terrain": [
              "tundra",
              "mountain",
              "hills"
            ]
          }
        ],
        "mitigations": [
          "Workers living in a brick house or manor are unaffected.",
          "A town with 2+ fuel in stock ignores the effort penalty."
        ]
      },
      {
        "id": "drought",
        "cardCode": "EVT-02",
        "name": "Drought",
        "category": "weather",
        "scope": "local",
        "copies": 2,
        "text": "The wells run low. Nothing green does well this year.",
        "effects": [
          {
            "type": "crop",
            "op": "yield-multiplier",
            "value": 0.5,
            "target": "region"
          },
          {
            "type": "commodity-loss",
            "commodity": "water",
            "qty": 2,
            "target": "region-towns"
          }
        ],
        "mitigations": [
          "A town with a well loses no water.",
          "Towns on a coast or marsh tile - anywhere with fresh water - are unaffected."
        ]
      },
      {
        "id": "long-summer",
        "cardCode": "EVT-03",
        "name": "Long Summer",
        "category": "weather",
        "scope": "global",
        "copies": 2,
        "text": "A gift of a season.",
        "effects": [
          {
            "type": "crop",
            "op": "advance",
            "value": 1,
            "target": "all-growing"
          },
          {
            "type": "effort",
            "op": "flat",
            "value": 1,
            "target": "all-workers"
          }
        ]
      },
      {
        "id": "storms",
        "cardCode": "EVT-04",
        "name": "Storms at Sea",
        "category": "weather",
        "scope": "global",
        "copies": 2,
        "text": "Nothing sails this round, and something already at sea does not arrive.",
        "effects": [
          {
            "type": "movement",
            "op": "block",
            "modes": [
              "ship",
              "barge"
            ],
            "rounds": 1
          },
          {
            "type": "cargo",
            "op": "loss-fraction",
            "value": 0.5,
            "modes": [
              "ship"
            ]
          }
        ],
        "mitigations": [
          "Cargo in a harbour tile is safe."
        ]
      },
      {
        "id": "flood",
        "cardCode": "EVT-05",
        "name": "Flood",
        "category": "disaster",
        "scope": "local",
        "copies": 2,
        "text": "The river takes back its floodplain.",
        "effects": [
          {
            "type": "crop",
            "op": "destroy",
            "target": "region-farms"
          },
          {
            "type": "building",
            "op": "halt",
            "rounds": 1,
            "target": "region-riverbank"
          },
          {
            "type": "commodity-gain",
            "commodity": "clay",
            "qty": 3,
            "target": "region-towns",
            "text": "Silt: a small consolation."
          }
        ]
      },
      {
        "id": "earthquake",
        "cardCode": "EVT-06",
        "name": "Earthquake",
        "category": "disaster",
        "scope": "local",
        "copies": 1,
        "text": "The hills shrug.",
        "effects": [
          {
            "type": "building",
            "op": "damage",
            "value": 0.5,
            "target": "region-mines-and-masonry",
            "text": "Halve the build track - the building stops until it is repaired."
          },
          {
            "type": "movement",
            "op": "block",
            "terrain": [
              "mountain"
            ],
            "rounds": 2
          }
        ]
      },
      {
        "id": "wildfire",
        "cardCode": "EVT-07",
        "name": "Wildfire",
        "category": "disaster",
        "scope": "local",
        "copies": 2,
        "text": "Fire runs through the timber.",
        "effects": [
          {
            "type": "building",
            "op": "destroy",
            "target": "region-timber-buildings",
            "chance": "d6 4+"
          },
          {
            "type": "commodity-loss",
            "commodity": "logs",
            "qty": 4,
            "target": "region-towns"
          }
        ],
        "mitigations": [
          "A town with a well or on a water-access tile rolls at 5+ instead."
        ]
      },
      {
        "id": "mine-collapse",
        "cardCode": "EVT-08",
        "name": "Mine Collapse",
        "category": "disaster",
        "scope": "targeted",
        "copies": 2,
        "text": "A gallery comes down.",
        "effects": [
          {
            "type": "building",
            "op": "halt",
            "rounds": 2,
            "target": "one-mine"
          },
          {
            "type": "population",
            "op": "remove",
            "value": 1,
            "target": "mine-town",
            "text": "One worker is lost."
          }
        ],
        "mitigations": [
          "A dwarf player halts for 1 round and loses no worker."
        ]
      },
      {
        "id": "warehouse-heist",
        "cardCode": "EVT-09",
        "name": "Warehouse Heist",
        "category": "crime",
        "scope": "targeted",
        "copies": 3,
        "text": "Thieves empty a warehouse in the night.",
        "effects": [
          {
            "type": "commodity-loss",
            "op": "fraction-of-building",
            "value": 0.5,
            "building": "warehouse",
            "text": "Lose half the contents of one warehouse, owner's choice of which items."
          }
        ],
        "mitigations": [
          "A watchtower in that town cancels this card once per game.",
          "Soldiers garrisoned in the town halve the loss."
        ]
      },
      {
        "id": "caravan-robbery",
        "cardCode": "EVT-10",
        "name": "Caravan Robbery",
        "category": "crime",
        "scope": "targeted",
        "copies": 2,
        "text": "Bandits on the road.",
        "effects": [
          {
            "type": "cargo",
            "op": "steal",
            "value": 1,
            "modes": [
              "cart",
              "caravan",
              "porter"
            ],
            "text": "The highest-value cargo token in transit by road is taken."
          }
        ],
        "mitigations": [
          "An escorting soldier rolls a combat die; on 4+ the robbery fails."
        ]
      },
      {
        "id": "train-heist",
        "cardCode": "EVT-11",
        "name": "Train Heist",
        "category": "crime",
        "scope": "targeted",
        "copies": 1,
        "text": "They knew the timetable.",
        "effects": [
          {
            "type": "cargo",
            "op": "steal",
            "value": 0.75,
            "modes": [
              "train"
            ]
          },
          {
            "type": "movement",
            "op": "block",
            "modes": [
              "train"
            ],
            "rounds": 1
          }
        ]
      },
      {
        "id": "piracy",
        "cardCode": "EVT-12",
        "name": "Piracy",
        "category": "crime",
        "scope": "global",
        "copies": 1,
        "text": "A sail on the horizon, and it is not a friendly one.",
        "effects": [
          {
            "type": "cargo",
            "op": "steal",
            "value": 0.5,
            "modes": [
              "ship",
              "barge"
            ],
            "target": "all-players"
          }
        ]
      },
      {
        "id": "smuggling-ring",
        "cardCode": "EVT-13",
        "name": "Smuggling Ring",
        "category": "crime",
        "scope": "offer",
        "copies": 2,
        "text": "Someone offers to move goods without the market's cut - and without any guarantees.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Deal",
                "effects": [
                  {
                    "type": "commodity-gain",
                    "op": "sell-at-premium",
                    "value": 1.5,
                    "qty": 6,
                    "text": "Sell up to 6 bulk at 150% of base value."
                  },
                  {
                    "type": "unrest",
                    "op": "add",
                    "value": 1
                  }
                ]
              },
              {
                "label": "Decline",
                "effects": []
              }
            ]
          }
        ]
      },
      {
        "id": "wolf-pack",
        "cardCode": "EVT-14",
        "name": "Wolf Pack",
        "category": "wildlife",
        "scope": "local",
        "copies": 2,
        "text": "Something is taking the livestock.",
        "effects": [
          {
            "type": "commodity-loss",
            "commodity": "sheep",
            "qty": 2,
            "target": "region-pastures"
          },
          {
            "type": "combat",
            "op": "spawn",
            "enemy": "wolves",
            "strength": 2,
            "target": "region"
          }
        ],
        "mitigations": [
          "Any soldier or hero in the region may fight the pack instead of losing animals."
        ]
      },
      {
        "id": "boar-in-the-fields",
        "cardCode": "EVT-15",
        "name": "Boar in the Fields",
        "category": "wildlife",
        "scope": "local",
        "copies": 2,
        "text": "It has been in the crops for a week.",
        "effects": [
          {
            "type": "crop",
            "op": "destroy-one",
            "target": "region-farms"
          },
          {
            "type": "choice",
            "branches": [
              {
                "label": "Hunt it",
                "effects": [
                  {
                    "type": "commodity-gain",
                    "commodity": "meat",
                    "qty": 3
                  },
                  {
                    "type": "effort",
                    "op": "spend",
                    "value": 3
                  }
                ]
              },
              {
                "label": "Let it be",
                "effects": []
              }
            ]
          }
        ]
      },
      {
        "id": "dragon-sighting",
        "cardCode": "EVT-16",
        "name": "Dragon Sighting",
        "category": "wildlife",
        "scope": "global",
        "copies": 1,
        "text": "A shape passes over the mountains. Everyone finds somewhere else to be.",
        "effects": [
          {
            "type": "movement",
            "op": "block",
            "terrain": [
              "mountain"
            ],
            "rounds": 2
          },
          {
            "type": "combat",
            "op": "spawn",
            "enemy": "dragon",
            "strength": 8,
            "target": "random-mountain"
          },
          {
            "type": "price",
            "op": "shift",
            "family": "luxury",
            "value": 1,
            "text": "Panic buying of portable wealth."
          }
        ]
      },
      {
        "id": "raiders",
        "cardCode": "EVT-17",
        "name": "Raiders",
        "category": "conflict",
        "scope": "targeted",
        "copies": 3,
        "text": "An armed band comes over the border at whoever looks richest.",
        "effects": [
          {
            "type": "combat",
            "op": "attack",
            "enemy": "raiders",
            "strength": 3,
            "target": "leader-town"
          },
          {
            "type": "commodity-loss",
            "op": "fraction",
            "value": 0.25,
            "condition": "if the defence fails"
          }
        ],
        "mitigations": [
          "Palisade grants +1 defence die. Garrisoned soldiers defend automatically."
        ]
      },
      {
        "id": "border-dispute",
        "cardCode": "EVT-18",
        "name": "Border Dispute",
        "category": "conflict",
        "scope": "global",
        "copies": 2,
        "text": "Two towns claim the same ground.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Concede",
                "effects": [
                  {
                    "type": "commodity-loss",
                    "op": "fraction",
                    "value": 0.1
                  }
                ]
              },
              {
                "label": "Contest",
                "effects": [
                  {
                    "type": "combat",
                    "op": "duel",
                    "text": "Both players roll 2 combat dice. The loser gives the winner one tile's worth of infrastructure."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "mercenaries-for-hire",
        "cardCode": "EVT-19",
        "name": "Mercenaries for Hire",
        "category": "conflict",
        "scope": "offer",
        "copies": 2,
        "text": "Swords, cheap, for as long as the coin lasts.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Hire (50 coin)",
                "effects": [
                  {
                    "type": "population",
                    "op": "add-soldier",
                    "value": 2,
                    "rounds": 3
                  }
                ]
              },
              {
                "label": "Pass",
                "effects": []
              }
            ]
          }
        ]
      },
      {
        "id": "plague",
        "cardCode": "EVT-20",
        "name": "Plague",
        "category": "social",
        "scope": "local",
        "copies": 1,
        "text": "It moves faster than anyone can plan for.",
        "effects": [
          {
            "type": "population",
            "op": "remove-fraction",
            "value": 0.25,
            "target": "region-towns"
          },
          {
            "type": "effort",
            "op": "die-step",
            "value": -1,
            "target": "region-workers",
            "rounds": 2
          }
        ],
        "mitigations": [
          "A town holding a Healing Draught spends it to ignore this card entirely."
        ]
      },
      {
        "id": "migrants",
        "cardCode": "EVT-21",
        "name": "Migrants",
        "category": "social",
        "scope": "offer",
        "copies": 3,
        "text": "A column of families on the road, looking for somewhere with food.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Take them in",
                "effects": [
                  {
                    "type": "population",
                    "op": "add",
                    "value": 2,
                    "condition": "you must have housing and 4 food in that town"
                  }
                ]
              },
              {
                "label": "Turn them away",
                "effects": [
                  {
                    "type": "unrest",
                    "op": "add",
                    "value": 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "strike",
        "cardCode": "EVT-22",
        "name": "Strike",
        "category": "social",
        "scope": "targeted",
        "copies": 2,
        "text": "They want feeding properly.",
        "effects": [
          {
            "type": "effort",
            "op": "multiplier",
            "value": 0.5,
            "target": "unrest-town",
            "rounds": 1,
            "condition": "any town with 1+ unrest"
          }
        ],
        "mitigations": [
          "Serve ale or wine at an inn to end the strike immediately."
        ]
      },
      {
        "id": "festival",
        "cardCode": "EVT-23",
        "name": "Festival",
        "category": "social",
        "scope": "global",
        "copies": 2,
        "text": "A week of noise and spending.",
        "effects": [
          {
            "type": "price",
            "op": "shift",
            "family": "drink",
            "value": 2
          },
          {
            "type": "price",
            "op": "shift",
            "family": "luxury",
            "value": 1
          },
          {
            "type": "unrest",
            "op": "remove",
            "value": 1,
            "target": "all-towns",
            "condition": "if the town serves any drink"
          }
        ]
      },
      {
        "id": "master-craftsman",
        "cardCode": "EVT-24",
        "name": "Travelling Master",
        "category": "social",
        "scope": "offer",
        "copies": 2,
        "text": "A master will take an apprentice, for a price.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Apprentice (30 coin)",
                "effects": [
                  {
                    "type": "population",
                    "op": "train-specialist",
                    "value": 1,
                    "text": "Train one specialist without a guildhall."
                  }
                ]
              },
              {
                "label": "Pass",
                "effects": []
              }
            ]
          }
        ]
      },
      {
        "id": "iron-shortage",
        "cardCode": "EVT-25",
        "name": "Iron Shortage",
        "category": "market",
        "scope": "global",
        "copies": 2,
        "text": "Everyone wants metal and nobody has any.",
        "effects": [
          {
            "type": "price",
            "op": "shift",
            "family": "metal",
            "value": 2,
            "rounds": 3
          }
        ]
      },
      {
        "id": "glut",
        "cardCode": "EVT-26",
        "name": "Glut",
        "category": "market",
        "scope": "global",
        "copies": 2,
        "text": "A bumper year somewhere else. Prices fall through the floor.",
        "effects": [
          {
            "type": "price",
            "op": "shift",
            "family": "food",
            "value": -2,
            "rounds": 2
          }
        ]
      },
      {
        "id": "foreign-demand",
        "cardCode": "EVT-27",
        "name": "Foreign Demand",
        "category": "market",
        "scope": "global",
        "copies": 3,
        "text": "A distant city sends buyers. Roll to see what they want.",
        "effects": [
          {
            "type": "price",
            "op": "shift-random-family",
            "value": 2,
            "rounds": 2
          }
        ]
      },
      {
        "id": "tax-levy",
        "cardCode": "EVT-28",
        "name": "Tax Levy",
        "category": "market",
        "scope": "global",
        "copies": 2,
        "text": "The crown remembers you exist.",
        "effects": [
          {
            "type": "commodity-loss",
            "op": "coin-per-building",
            "value": 3,
            "text": "Pay 3 coin per completed building. If you cannot pay, gain 1 unrest per unpaid building."
          }
        ]
      },
      {
        "id": "ley-surge",
        "cardCode": "EVT-29",
        "name": "Ley Surge",
        "category": "arcane",
        "scope": "global",
        "copies": 1,
        "text": "The ground hums for a week.",
        "effects": [
          {
            "type": "commodity-gain",
            "commodity": "mana-crystal",
            "qty": 1,
            "target": "towns-with-alchemist"
          },
          {
            "type": "effort",
            "op": "die-step",
            "value": 1,
            "target": "all-workers",
            "rounds": 1
          }
        ]
      },
      {
        "id": "curdled-brew",
        "cardCode": "EVT-30",
        "name": "Curdled Brew",
        "category": "arcane",
        "scope": "targeted",
        "copies": 1,
        "text": "Something went wrong in the alembic.",
        "effects": [
          {
            "type": "commodity-loss",
            "op": "all-of",
            "commodity": "arcane-herb",
            "target": "one-town"
          },
          {
            "type": "tool",
            "op": "break",
            "tool": "alembic"
          }
        ]
      },
      {
        "id": "wandering-wizard",
        "cardCode": "EVT-31",
        "name": "Wandering Wizard",
        "category": "arcane",
        "scope": "offer",
        "copies": 2,
        "text": "He will trade knowledge for something shiny.",
        "effects": [
          {
            "type": "choice",
            "branches": [
              {
                "label": "Trade a mana crystal",
                "effects": [
                  {
                    "type": "commodity-gain",
                    "op": "grant-potion",
                    "value": 2,
                    "text": "Take any 2 potions from items.json for free."
                  }
                ]
              },
              {
                "label": "Pass",
                "effects": []
              }
            ]
          }
        ]
      },
      {
        "id": "camp-fever",
        "cardCode": "EVT-32",
        "name": "Camp Fever",
        "category": "social",
        "scope": "targeted",
        "copies": 2,
        "text": "Something in the water at last night's camp. Your travelling party wakes shivering.",
        "effects": [
          {
            "type": "health",
            "op": "damage",
            "value": 2,
            "target": "one-party",
            "text": "Every figure and character in one of your travelling parties takes 2 damage."
          },
          {
            "type": "movement",
            "op": "multiplier",
            "value": 0.5,
            "target": "same-party",
            "rounds": 1
          }
        ],
        "mitigations": [
          "A healer character in the party shrugs it off: no damage, full speed.",
          "Spend a Healing Draught or Physic Tonic to cancel the card."
        ]
      },
      {
        "id": "marsh-ague",
        "cardCode": "EVT-33",
        "name": "Marsh Ague",
        "category": "social",
        "scope": "local",
        "copies": 2,
        "text": "The ague drifts out of the fens with the evening mist, and the village bell rings thin all week.",
        "effects": [
          {
            "type": "effort",
            "op": "die-step",
            "value": -1,
            "target": "region-workers",
            "rounds": 2
          },
          {
            "type": "population",
            "op": "remove",
            "value": 1,
            "target": "region-towns",
            "condition": "only towns on or adjacent to a marsh tile"
          }
        ],
        "mitigations": [
          "A town with an infirmary and a fed healer loses no worker.",
          "A Physic Tonic cancels the card for one town."
        ]
      },
      {
        "id": "grey-pox",
        "cardCode": "EVT-34",
        "name": "The Grey Pox",
        "category": "social",
        "scope": "global",
        "copies": 1,
        "text": "It starts in one market square and is everywhere by week's end. Whole streets shutter; the carts stop coming.",
        "effects": [
          {
            "type": "population",
            "op": "remove",
            "value": 1,
            "target": "all-towns",
            "condition": "every town with 4 or more workers loses one"
          },
          {
            "type": "effort",
            "op": "die-step",
            "value": -1,
            "target": "all-workers",
            "rounds": 1
          }
        ],
        "mitigations": [
          "A town with an infirmary and a fed healer loses no worker.",
          "A Healing Draught spent by a town cancels its loss.",
          "This is the card that makes the infirmary worth its parchment."
        ]
      },
      {
        "id": "impure-smelt",
        "cardCode": "EVT-35",
        "name": "Impure Smelt",
        "category": "industry",
        "scope": "global",
        "copies": 2,
        "text": "A bad seam of flux stone in every furnace this week. The metal pours grey and snaps like slate.",
        "effects": [
          {
            "type": "tool",
            "op": "wear-multiplier",
            "value": 2,
            "rounds": 1,
            "text": "Every tool used this round takes double wear."
          },
          {
            "type": "tool",
            "op": "brittle-forge",
            "rounds": 1,
            "text": "Any tool forged this round is marked brittle: it breaks when its durability track reaches half, not zero."
          }
        ],
        "mitigations": [
          "A smelter or blacksmith burning coal this round is unaffected - coal runs hot enough to burn the impurities out. Peat and charcoal do not.",
          "A smith specialist may spend 2 hours re-tempering to clear one brittle mark."
        ]
      },
      {
        "id": "blood-moon",
        "cardCode": "EVT-36",
        "name": "Blood Moon",
        "category": "arcane",
        "scope": "global",
        "copies": 1,
        "text": "The moon rises rust-red and the wild things move under it.",
        "effects": [
          {
            "type": "discovery",
            "op": "band",
            "target": "monster",
            "value": 3,
            "rounds": 2,
            "text": "Monster bands on every discovery table widen by 3 for two rounds."
          }
        ],
        "mitigations": [
          "A party carrying a lit lantern is never surprised: it may always choose to withdraw before a monster encounter begins."
        ]
      },
      {
        "id": "quiet-season",
        "cardCode": "EVT-37",
        "name": "The Quiet Season",
        "category": "wildlife",
        "scope": "global",
        "copies": 1,
        "text": "The wild goes still. Hunters come home early, and nothing follows them home.",
        "effects": [
          {
            "type": "discovery",
            "op": "band",
            "target": "monster",
            "value": -2,
            "rounds": 2,
            "text": "Monster bands on every discovery table shrink by 2 for two rounds."
          }
        ]
      },
      {
        "id": "black-sails",
        "cardCode": "EVT-38",
        "name": "Black Sails on the Horizon",
        "category": "crime",
        "scope": "global",
        "copies": 2,
        "text": "A squadron under no flag anyone will name works the sea lanes for a season.",
        "effects": [
          {
            "type": "cargo",
            "op": "steal",
            "value": 1,
            "modes": [
              "ship",
              "barge"
            ],
            "text": "Every player with cargo at sea loses one cargo token - highest value first."
          },
          {
            "type": "price",
            "op": "band",
            "value": 1,
            "family": "luxury",
            "text": "Anything that has to come by sea gets dearer."
          }
        ],
        "mitigations": [
          "A ship with a Warded Hold or an escort of 2+ soldiers keeps its cargo.",
          "A player whose shore hex is patrolled by a befriended Reef Serpent is not touched.",
          "Cargo sitting in a harbour is safe - it just is not moving."
        ]
      },
      {
        "id": "letter-of-marque",
        "cardCode": "EVT-39",
        "name": "Letter of Marque",
        "category": "crime",
        "scope": "offer",
        "copies": 1,
        "text": "A seat of government will licence one privateer, and look away.",
        "effects": [
          {
            "type": "choice",
            "op": "accept-or-pass",
            "text": "Take it: for the next 3 rounds your ships may take one cargo token per round from any other player's ship in an adjacent water hex, and keep it. Every other player gains 1 unrest in every coastal town of yours they can reach, and your ships pay double harbour fees for the rest of the game."
          }
        ],
        "mitigations": [
          "Passing costs nothing. The card goes round in turn order and is discarded if nobody takes it.",
          "A victim may buy the letter back from the holder at any agreed price; the licence is a piece of paper, and paper is tradeable."
        ]
      },
      {
        "id": "press-gang",
        "cardCode": "EVT-40",
        "name": "Press Gang",
        "category": "crime",
        "scope": "targeted",
        "copies": 2,
        "text": "They came for the harbour taverns at midnight and left with whoever could walk.",
        "effects": [
          {
            "type": "population",
            "op": "remove",
            "value": 2,
            "target": "one-coastal-town",
            "text": "Two workers are gone. They may come back - see the mitigation."
          },
          {
            "type": "unrest",
            "op": "add",
            "value": 1,
            "target": "that-town"
          }
        ],
        "mitigations": [
          "A town with a palisade or a garrison of 1+ soldiers loses nobody.",
          "A town with an inn loses one worker instead of two: the innkeeper hides the regulars in the cellar.",
          "Roll d6 at the end of each following round; on a 6 the pressed workers walk home."
        ]
      },
      {
        "id": "dragons-tithe",
        "cardCode": "EVT-41",
        "name": "The Dragon's Tithe",
        "category": "conflict",
        "scope": "global",
        "copies": 1,
        "text": "Vhalrik has counted, and finds the Reach behind on its payments.",
        "effects": [
          {
            "type": "commodity-loss",
            "op": "choice",
            "text": "Every player hands over 1 gold, 1 gems or 2 jewellery, their choice, from any one town. A player with none of those loses their highest-value commodity stack instead."
          },
          {
            "type": "combat",
            "op": "spawn",
            "monster": "vhalrik-the-cinder-crowned",
            "text": "Any player who refuses places Vhalrik on their richest town. He attacks it at the start of the next round."
          }
        ],
        "mitigations": [
          "A player who has befriended Vhalrik pays nothing and may not be attacked by him.",
          "Paying is always allowed and always ends it. That is the lesson."
        ]
      },
      {
        "id": "aerial-post",
        "cardCode": "EVT-42",
        "name": "The Aerial Post",
        "category": "industry",
        "scope": "offer",
        "copies": 1,
        "text": "A postal contract, offered to whoever can actually fly it.",
        "effects": [
          {
            "type": "choice",
            "op": "accept-or-pass",
            "text": "Take it if you own an airship: 40 coin now, and 15 coin at the end of every round in which that airship ends its leg at a different settlement from the one it started at. Miss two rounds running and the contract is cancelled."
          }
        ],
        "mitigations": [
          "Only a player with an airship may take it. If nobody has one it is discarded, and shuffled back in ten rounds later.",
          "Cancelling costs nothing but the contract."
        ]
      },
      {
        "id": "gale",
        "cardCode": "EVT-43",
        "name": "Gale",
        "category": "weather",
        "scope": "global",
        "copies": 2,
        "text": "It comes off the ice and does not stop until it reaches the sea.",
        "effects": [
          {
            "type": "movement",
            "op": "block",
            "modes": [
              "airship"
            ],
            "rounds": 1,
            "text": "Nothing flies. An airship in the air when this is drawn marks 2 damage and comes down on the nearest land hex."
          },
          {
            "type": "movement",
            "op": "slow",
            "value": 0.5,
            "modes": [
              "ship",
              "barge"
            ],
            "rounds": 1
          },
          {
            "type": "building",
            "op": "damage",
            "value": 1,
            "target": "all-timber-buildings",
            "chance": "d6 6"
          }
        ],
        "mitigations": [
          "An airship moored at a settlement takes no damage.",
          "A ship in harbour is unaffected.",
          "A sweep-rigged airship marks 1 damage instead of 2 - the crew can at least steer the descent."
        ]
      },
      {
        "id": "early-thaw",
        "cardCode": "EVT-44",
        "name": "Early Thaw",
        "category": "weather",
        "scope": "global",
        "copies": 2,
        "text": "The frost lets go three weeks before anybody planned for.",
        "effects": [
          {
            "type": "movement",
            "op": "block",
            "modes": [
              "sled"
            ],
            "rounds": 2,
            "text": "The winter rule in travel.json lifts. Any sled standing on marsh or water is lost with its cargo."
          },
          {
            "type": "crop",
            "op": "advance",
            "value": 1,
            "target": "all-growing"
          },
          {
            "type": "movement",
            "op": "block",
            "terrain": [
              "marsh"
            ],
            "rounds": 1,
            "text": "The fens are impassable to everything."
          }
        ],
        "mitigations": [
          "A sled on solid ground is fine - it just becomes a box on runners until the next frost.",
          "A player who moved every sled to a settlement last round loses nothing."
        ]
      },
      {
        "id": "clipped-coin",
        "cardCode": "EVT-45",
        "name": "Clipped Coin",
        "category": "market",
        "scope": "global",
        "copies": 2,
        "text": "Somebody has been shaving the edges, and everybody knows it but nobody will be first to refuse a coin.",
        "effects": [
          {
            "type": "price",
            "op": "band",
            "value": 1,
            "family": "all",
            "text": "Every price band shifts up one step. Prices are higher; the coin in your hand is not."
          },
          {
            "type": "unrest",
            "op": "add",
            "value": 1,
            "target": "all-towns-with-a-market"
          }
        ],
        "mitigations": [
          "A player holding gold, gems or jewellery instead of coin loses nothing to this - metal does not care what the mint says.",
          "A trading house sets its own scales: its owner ignores the band shift for one sale."
        ]
      },
      {
        "id": "guild-embargo",
        "cardCode": "EVT-46",
        "name": "Guild Embargo",
        "category": "market",
        "scope": "targeted",
        "copies": 2,
        "text": "You have undercut them once too often.",
        "effects": [
          {
            "type": "price",
            "op": "band",
            "value": -2,
            "family": "one-of-yours",
            "target": "drawer",
            "text": "Pick the commodity family you sell most of: you sell it at two bands worse for 3 rounds. Everyone else sells it at one band better."
          }
        ],
        "mitigations": [
          "A player with a merchant or a trading house may pay the guild off: 60 coin, and the card is discarded.",
          "Selling to another player instead of to the board sidesteps the embargo entirely - which is the whole point of having friends."
        ]
      },
      {
        "id": "new-tolls",
        "cardCode": "EVT-47",
        "name": "New Tolls",
        "category": "social",
        "scope": "local",
        "copies": 2,
        "text": "A gate, a rope and a man with a ledger, on a road you paid to build.",
        "effects": [
          {
            "type": "movement",
            "op": "toll",
            "value": 5,
            "target": "region",
            "text": "5 coin per cargo token entering or leaving the region by road, for 3 rounds. Pay, or go round."
          }
        ],
        "mitigations": [
          "The player who built the road in that region collects the toll instead of paying it.",
          "Rail, water and air pay nothing - which is how everyone learns what a road is worth."
        ]
      },
      {
        "id": "green-man",
        "cardCode": "EVT-48",
        "name": "The Sign of the Green Man",
        "category": "social",
        "scope": "offer",
        "copies": 2,
        "text": "A failing inn on a good road, and an innkeeper who wants out.",
        "effects": [
          {
            "type": "choice",
            "op": "accept-or-pass",
            "text": "Buy it for 70 coin: place an inn, free of build cost and build time, on any road or route tile you have travelled, inside or outside a town. It is yours, it earns like any inn, and other players may use it at your price."
          }
        ],
        "mitigations": [
          "Passing costs nothing.",
          "A player who already owns three inns may not take it - see buildings.json inn, and the reason there is a cap."
        ]
      },
      {
        "id": "mead-run",
        "cardCode": "EVT-49",
        "name": "The Mead Run",
        "category": "market",
        "scope": "offer",
        "copies": 2,
        "text": "Every inn in the Reach is dry at once, and they are all offering above the odds.",
        "effects": [
          {
            "type": "choice",
            "op": "accept-or-pass",
            "text": "Sell any quantity of mead or ale this round at double the current band, to the board, from any town connected to a route - no market building needed."
          },
          {
            "type": "price",
            "op": "band",
            "value": -1,
            "family": "drink",
            "text": "Afterwards the cellars are full and the price falls a band."
          }
        ],
        "mitigations": [
          "Passing costs nothing.",
          "A player with an apiary and a brewery can usually take this twice a game, which is exactly the industry this card exists to make worth building."
        ]
      },
      {
        "id": "ley-drought",
        "cardCode": "EVT-50",
        "name": "Ley Drought",
        "category": "arcane",
        "scope": "global",
        "copies": 2,
        "text": "The ground has gone quiet. Nobody can say why, and the ones who can will not.",
        "effects": [
          {
            "type": "commodity-loss",
            "commodity": "mana-crystal",
            "qty": 1,
            "target": "all-towns"
          },
          {
            "type": "effort",
            "op": "flat",
            "value": -1,
            "target": "workers-at-arcane-buildings",
            "text": "Every spell costs 1 extra mana for 2 rounds, and mana veins yield nothing."
          }
        ],
        "mitigations": [
          "Mana already stored in a talisman is untouched - which is what talismans are for.",
          "An elf holds their innate mana as normal.",
          "A shrine in a town cancels the extra spell cost for characters standing in it."
        ]
      },
      {
        "id": "boom-town",
        "cardCode": "EVT-51",
        "name": "Boom Town",
        "category": "market",
        "scope": "local",
        "copies": 2,
        "text": "A strike is announced, the road fills with hopefuls, and a village of forty becomes a town of four hundred in a month.",
        "effects": [
          {
            "type": "population",
            "op": "add",
            "value": 2,
            "target": "region-largest-town"
          },
          {
            "type": "price",
            "op": "band",
            "value": 2,
            "family": "food",
            "target": "region",
            "text": "Food and drink in that region jump two bands. Everyone has to eat and nobody planted anything."
          },
          {
            "type": "unrest",
            "op": "add",
            "value": 1,
            "target": "region-towns"
          }
        ],
        "mitigations": [
          "A town with a granary holding 4+ food ignores the price jump and gains the workers anyway - which is the whole argument for granaries.",
          "The player who owns the nearest farm may sell into that region at the boom price. Demand is only a disaster if you have nothing to sell."
        ]
      }
    ],
    "deck": {
      "totalCards": 94,
      "$totalNote": "Sum of every card's copies, and it is generated rather than remembered: the figure has drifted twice already, which is exactly why the annex is built from this file.",
      "drawPerPlayerPerRound": 1,
      "drawnBy": "each-player",
      "when": "In the Events phase, each player in turn order reveals one card and resolves it before the Labour Roll.",
      "lateGame": {
        "round": 13,
        "extra": "From round 13, the first player each round reveals and resolves a second card."
      },
      "reshuffle": "When the deck runs out, shuffle the discard pile and carry on.",
      "designNotes": [
        "Every player turning a card means every player owns a piece of the round's weather. A global card is global whoever drew it; a targeted card is the drawer's problem.",
        "Weather and market cards are the common ones - they should feel like the seasons turning, not like being punished.",
        "Crime cards target the leader by default. That is the catch-up mechanism, and it is deliberate.",
        "Every disaster card should have at least one mitigation a player could have bought in advance. Being wiped out should always be traceable to a decision.",
        "Discovery-band cards (Blood Moon, The Quiet Season) are the dial on how dangerous the wild feels. Add copies to taste."
      ]
    }
  },
  "items": {
    "$comment": "Equipment carried by workers, figures and soldiers. Unlike tools, most equipment does not wear down with production - armour and weapons take damage in combat, potions are consumed on use. Every item has a massKg - what it weighs, in kilograms - because a figure's carrying capacity is measured the same way: see rules.json carrying, and the BURDEN bar up the right edge of every character card. Mass is not bulk; bulk is the storage and shipping cost of a commodity (commodities.json), and no item has one. Talisman cards carry a vertical numbered mana bar on the RIGHT edge (capacity bars always sit right; harm bars always sit left - the convention is stated in docs/art/06-components.md).",
    "version": "0.3.0",
    "classes": [
      {
        "id": "clothing",
        "name": "Clothing",
        "summary": "Protects against weather and event penalties."
      },
      {
        "id": "armour",
        "name": "Armour",
        "summary": "Reduces hits taken in combat."
      },
      {
        "id": "weapon",
        "name": "Weapon",
        "summary": "Adds or improves combat dice."
      },
      {
        "id": "potion",
        "name": "Potion",
        "summary": "One-shot consumable, usually spent during the Labour Roll or a battle."
      },
      {
        "id": "light",
        "name": "Light",
        "summary": "Lets a party travel at night and enter caves. See travel.json."
      },
      {
        "id": "talisman",
        "name": "Talisman",
        "summary": "Stores mana. Most peoples cannot hold mana in the body at all - see peoples.json manaStorage. Track stored mana with a token on the card's mana bar."
      }
    ],
    "items": [
      {
        "id": "tunic",
        "name": "Tunic",
        "class": "clothing",
        "slot": "body",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 26,
        "massKg": 1,
        "effects": [
          "Ignore the first -1 weather effort penalty each round."
        ]
      },
      {
        "id": "winter-coat",
        "name": "Winter Coat",
        "class": "clothing",
        "slot": "body",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 2
          },
          {
            "commodity": "wool",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 60,
        "massKg": 3,
        "effects": [
          "Immune to Hard Frost.",
          "No tundra or mountain effort penalty."
        ]
      },
      {
        "id": "travelling-cloak",
        "name": "Travelling Cloak",
        "class": "clothing",
        "slot": "back",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 2
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 55,
        "massKg": 2,
        "effects": [
          "+1 move point for the figure wearing it."
        ]
      },
      {
        "id": "boots",
        "name": "Sturdy Boots",
        "class": "clothing",
        "slot": "feet",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 30,
        "massKg": 1.5,
        "effects": [
          "Marsh and mountain tiles cost 1 less to move through, minimum 1."
        ]
      },
      {
        "id": "fine-robes",
        "name": "Fine Robes",
        "class": "clothing",
        "slot": "body",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "fine-cloth",
            "qty": 2
          },
          {
            "commodity": "gold",
            "qty": 1
          }
        ],
        "effortHours": 4,
        "baseValue": 180,
        "massKg": 1.5,
        "effects": [
          "A merchant wearing these gets a further 10% on every market sale.",
          "Worth 2 victory points at game end."
        ]
      },
      {
        "id": "leather-jerkin",
        "name": "Leather Jerkin",
        "class": "armour",
        "slot": "body",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "leather",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 50,
        "massKg": 5,
        "effects": [
          "Ignore the first hit in each battle."
        ],
        "armourValue": 1
      },
      {
        "id": "chain-mail",
        "name": "Chain Mail",
        "class": "armour",
        "slot": "body",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "ironware",
            "qty": 2
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 5,
        "baseValue": 130,
        "massKg": 12,
        "effects": [
          "Ignore the first two hits in each battle."
        ],
        "armourValue": 2
      },
      {
        "id": "plate-harness",
        "name": "Plate Harness",
        "class": "armour",
        "slot": "body",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 3
          },
          {
            "commodity": "leather",
            "qty": 2
          }
        ],
        "effortHours": 8,
        "baseValue": 320,
        "massKg": 25,
        "specialist": "smith",
        "effects": [
          "Ignore the first three hits in each battle.",
          "-1 move point."
        ],
        "armourValue": 3
      },
      {
        "id": "helm",
        "name": "Helm",
        "class": "armour",
        "slot": "head",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 45,
        "massKg": 2.5,
        "effects": [
          "Once per battle, cancel one hit."
        ],
        "armourValue": 1
      },
      {
        "id": "shield",
        "name": "Shield",
        "class": "armour",
        "slot": "off-hand",
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 40,
        "massKg": 4,
        "effects": [
          "+1 defence die."
        ],
        "armourValue": 1
      },
      {
        "id": "sword",
        "name": "Sword",
        "class": "weapon",
        "slot": "hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 2
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 4,
        "baseValue": 95,
        "massKg": 1.5,
        "effects": [
          "+1 combat die."
        ],
        "combatDice": 1
      },
      {
        "id": "steel-sword",
        "name": "Steel Sword",
        "class": "weapon",
        "slot": "hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 5,
        "baseValue": 210,
        "massKg": 1.5,
        "specialist": "smith",
        "effects": [
          "+2 combat dice, and hits on 3+ instead of 4+."
        ],
        "combatDice": 2
      },
      {
        "id": "war-axe",
        "name": "War Axe",
        "class": "weapon",
        "slot": "hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 80,
        "massKg": 3,
        "effects": [
          "+1 combat die, +2 when attacking."
        ],
        "combatDice": 1
      },
      {
        "id": "pike",
        "name": "Pike",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 1
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 70,
        "massKg": 4.5,
        "effects": [
          "+2 combat dice when defending a town.",
          "Cannot be used with a shield."
        ],
        "combatDice": 1
      },
      {
        "id": "bow",
        "name": "Bow",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "rope",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 65,
        "massKg": 1,
        "effects": [
          "Rolls its dice before the enemy rolls theirs.",
          "+1 output on Hunt Game.",
          "Needs a quiver to fight."
        ],
        "combatDice": 1
      },
      {
        "id": "quiver",
        "name": "Quiver of Arrows",
        "class": "weapon",
        "slot": "belt",
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 30,
        "massKg": 2,
        "effects": [
          "Holds 3 uses. Each battle with a bow spends 1."
        ],
        "uses": 3
      },
      {
        "id": "sling",
        "name": "Sling",
        "class": "weapon",
        "slot": "hand",
        "madeAt": "weaver",
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "effortHours": 1,
        "baseValue": 12,
        "massKg": 0.5,
        "effects": [
          "+1 combat die for halflings only. Everyone else may as well throw the stone."
        ],
        "combatDice": 1
      },
      {
        "id": "war-hammer",
        "name": "War Hammer",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "effortHours": 5,
        "baseValue": 190,
        "massKg": 6,
        "effects": [
          "+2 combat dice. Ignores enemy armour entirely."
        ],
        "combatDice": 2
      },
      {
        "id": "crossbow",
        "name": "Crossbow",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 1
          },
          {
            "commodity": "lumber",
            "qty": 2
          },
          {
            "commodity": "rope",
            "qty": 1
          }
        ],
        "effortHours": 5,
        "baseValue": 175,
        "massKg": 5,
        "specialist": "smith",
        "effects": [
          "+3 combat dice, and ignores 1 point of enemy armour.",
          "Slow: it rolls in the first round of a battle and every second round after.",
          "Needs a quiver to fight."
        ],
        "combatDice": 3
      },
      {
        "id": "harpoon",
        "name": "Harpoon",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 1
          },
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "rope",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 75,
        "massKg": 4,
        "effects": [
          "+1 combat die, and +3 instead against any water-element monster or anything bigger than a horse.",
          "A struck monster cannot flee while the line holds - it breaks on a d6 roll of 1 each round.",
          "+1 output on Fish."
        ],
        "combatDice": 1
      },
      {
        "id": "dirk",
        "name": "Dirk",
        "class": "weapon",
        "slot": "hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 35,
        "massKg": 0.8,
        "effects": [
          "+1 combat die.",
          "Carried out of sight: bandits, tolls and confiscations never take it, and it is not lost when a character falls."
        ],
        "combatDice": 1
      },
      {
        "id": "greatsword",
        "name": "Greatsword",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 3
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 7,
        "baseValue": 340,
        "massKg": 4,
        "specialist": "smith",
        "effects": [
          "+3 combat dice, and hits on 3+ instead of 4+.",
          "-1 move point, and it cannot be used with a shield.",
          "Worth 1 victory point at game end."
        ],
        "combatDice": 3
      },
      {
        "id": "boar-spear",
        "name": "Boar Spear",
        "class": "weapon",
        "slot": "two-hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 1
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 55,
        "massKg": 3,
        "effects": [
          "+1 combat die, and +3 in the first round against any monster that charges - anything of strength 4 or more that attacks first.",
          "The crossbar holds it off you: ignore the first hit from that monster.",
          "+1 output on Hunt Game."
        ],
        "combatDice": 1
      },
      {
        "id": "potion-vigour",
        "name": "Draught of Vigour",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "arcane-herb",
            "qty": 2
          },
          {
            "commodity": "honey",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 70,
        "massKg": 0.5,
        "effects": [
          "Step one worker's effort die up two sizes for one round."
        ]
      },
      {
        "id": "potion-toil",
        "name": "Tireless Toil",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "arcane-herb",
            "qty": 1
          },
          {
            "commodity": "mushrooms",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 60,
        "massKg": 0.5,
        "effects": [
          "Re-roll every effort die of one worker and keep the better result."
        ]
      },
      {
        "id": "potion-crew",
        "name": "Brewmaster's Round",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "ale",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 2
          }
        ],
        "effortHours": 4,
        "baseValue": 120,
        "massKg": 0.5,
        "effects": [
          "+1 flat effort to every worker in one town this round."
        ]
      },
      {
        "id": "potion-healing",
        "name": "Healing Draught",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "arcane-herb",
            "qty": 2
          },
          {
            "commodity": "berries",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 85,
        "massKg": 0.5,
        "effects": [
          "Cancel one worker loss, or ignore one Plague card.",
          "Or restore 3 health to one character."
        ]
      },
      {
        "id": "potion-swiftness",
        "name": "Swiftfoot",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "arcane-herb",
            "qty": 1
          },
          {
            "commodity": "mana-crystal",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 140,
        "massKg": 0.5,
        "effects": [
          "Double one figure's move points, or move one cargo token its full speed again this round."
        ]
      },
      {
        "id": "potion-fortitude",
        "name": "Stonehide",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "mana-crystal",
            "qty": 1
          },
          {
            "commodity": "mushrooms",
            "qty": 2
          }
        ],
        "effortHours": 4,
        "baseValue": 150,
        "massKg": 0.5,
        "effects": [
          "One unit ignores all hits in one battle."
        ]
      },
      {
        "id": "potion-clarity",
        "name": "Prospector's Clarity",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "mana-crystal",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 2
          }
        ],
        "effortHours": 4,
        "baseValue": 160,
        "massKg": 0.5,
        "effects": [
          "Automatically succeed on one survey, and reveal all deposits on adjacent tiles."
        ]
      },
      {
        "id": "potion-fortune",
        "name": "Merchant's Fortune",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "gold",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 2
          }
        ],
        "effortHours": 4,
        "baseValue": 200,
        "massKg": 0.5,
        "effects": [
          "Shift one commodity family's price band two steps in your favour for your next sale only."
        ]
      },
      {
        "id": "potion-nightsight",
        "name": "Owl's Eye",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "moon-blossom",
            "qty": 2
          },
          {
            "commodity": "arcane-herb",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 90,
        "massKg": 0.5,
        "effects": [
          "One figure or party travels night legs this round as if carrying a lantern."
        ]
      },
      {
        "id": "potion-physic",
        "name": "Physic Tonic",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "frost-lichen",
            "qty": 2
          },
          {
            "commodity": "honey",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 95,
        "massKg": 0.5,
        "effects": [
          "Cure one illness anywhere: a sick worker recovers, or a town ignores one illness event card.",
          "In a healer's hands at an infirmary it cures the whole town - see Tend the Sick."
        ]
      },
      {
        "id": "potion-emberguard",
        "name": "Emberguard Salve",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "ember-root",
            "qty": 2
          },
          {
            "commodity": "honey",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 100,
        "massKg": 0.5,
        "effects": [
          "One unit or character ignores every hit from a fire-element monster in one battle."
        ]
      },
      {
        "id": "potion-ley-tincture",
        "name": "Ley Tincture",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "mana-crystal",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 3
          }
        ],
        "effortHours": 5,
        "baseValue": 220,
        "massKg": 0.5,
        "specialist": "alchemist",
        "effects": [
          "For one round the drinker holds 3 mana in the body, talisman or no talisman.",
          "Mana still there when the round ends blows away, and the drinker takes 1 damage."
        ]
      },
      {
        "id": "potion-forbearance",
        "name": "Innkeeper's Forbearance",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "mead",
            "qty": 2
          },
          {
            "commodity": "arcane-herb",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 80,
        "massKg": 1,
        "effects": [
          "Broached at an inn, it clears 2 unrest in that town and everyone forgives everyone.",
          "Anywhere else it clears 1 unrest and starts an argument."
        ]
      },
      {
        "id": "potion-long-ration",
        "name": "Long Ration",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "honey",
            "qty": 1
          },
          {
            "commodity": "salted-meat",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 75,
        "massKg": 0.5,
        "effects": [
          "One travelling party eats nothing for two rounds, and nobody complains until the third."
        ]
      },
      {
        "id": "potion-dragonsbane",
        "name": "Dragonsbane Draught",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "ember-root",
            "qty": 2
          },
          {
            "commodity": "frost-lichen",
            "qty": 2
          },
          {
            "commodity": "mana-crystal",
            "qty": 1
          }
        ],
        "effortHours": 6,
        "baseValue": 380,
        "massKg": 0.5,
        "specialist": "alchemist",
        "effects": [
          "For one battle, the drinker's party ignores the free first round any monster of strength 5 or more gets, and halves its hits, rounded up.",
          "It does not help you win. It helps you still be there at the end."
        ]
      },
      {
        "id": "potion-aeronaut",
        "name": "Aeronaut's Nerve",
        "class": "potion",
        "madeAt": "alchemist",
        "inputs": [
          {
            "commodity": "moon-blossom",
            "qty": 1
          },
          {
            "commodity": "ale",
            "qty": 1
          },
          {
            "commodity": "arcane-herb",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 110,
        "massKg": 0.5,
        "effects": [
          "Re-roll one airship wind roll and keep the better result - see travel.json.",
          "The crew are steady at any height for the rest of the journey, which matters more than the roll does."
        ]
      },
      {
        "id": "torch",
        "name": "Torch",
        "class": "light",
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "effortHours": 1,
        "baseValue": 10,
        "massKg": 0.5,
        "uses": 2,
        "effects": [
          "Travel one night leg at torch speed - see travel.json.",
          "Enter a cave.",
          "Each night leg or cave visit spends one use; at zero it is gone."
        ]
      },
      {
        "id": "lantern",
        "name": "Lantern",
        "class": "light",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "ironware",
            "qty": 1
          },
          {
            "commodity": "glass",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 55,
        "massKg": 1.5,
        "effects": [
          "Travel night legs at lantern speed - see travel.json.",
          "Explore caves without spending uses.",
          "Does not wear out, but it can be lost, sold or stolen like any item."
        ]
      },
      {
        "id": "talisman-bone-charm",
        "name": "Bone Charm",
        "class": "talisman",
        "cardCode": "TAL-01",
        "madeAt": "carpenter",
        "manaCapacity": 2,
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 30,
        "massKg": 0.5,
        "story": "Knucklebones and a thong of hide, carved by someone's grandmother against the dark. It works, which is more than can be said for most of what grandmothers carve.",
        "effects": [
          "Stores up to 2 mana. Track with a token on the mana bar."
        ]
      },
      {
        "id": "talisman-weavers-knot",
        "name": "Weaver's Knot",
        "class": "talisman",
        "cardCode": "TAL-02",
        "madeAt": "weaver",
        "manaCapacity": 3,
        "inputs": [
          {
            "commodity": "yarn",
            "qty": 2
          }
        ],
        "effortHours": 3,
        "baseValue": 45,
        "massKg": 0.5,
        "story": "A cord tied in a knot with no beginning. Weavers make them in the winter and do not discuss the pattern.",
        "effects": [
          "Stores up to 3 mana."
        ]
      },
      {
        "id": "talisman-copper-amulet",
        "name": "Copper Amulet",
        "class": "talisman",
        "cardCode": "TAL-03",
        "madeAt": "blacksmith",
        "manaCapacity": 4,
        "inputs": [
          {
            "commodity": "copper",
            "qty": 1
          }
        ],
        "effortHours": 3,
        "baseValue": 60,
        "massKg": 0.5,
        "story": "Copper takes a charge the way dry grass takes a spark. Miners wear them green with age and swear the green is where the mana sits.",
        "effects": [
          "Stores up to 4 mana."
        ]
      },
      {
        "id": "talisman-gold-locket",
        "name": "Gold Locket",
        "class": "talisman",
        "cardCode": "TAL-04",
        "madeAt": "blacksmith",
        "manaCapacity": 6,
        "specialist": "smith",
        "inputs": [
          {
            "commodity": "gold",
            "qty": 1
          }
        ],
        "effortHours": 4,
        "baseValue": 120,
        "massKg": 0.5,
        "story": "Gold never tarnishes and never forgets. A locket holds a portrait on one side and six charges of something else on the other.",
        "effects": [
          "Stores up to 6 mana."
        ]
      },
      {
        "id": "talisman-gemfire-pendant",
        "name": "Gemfire Pendant",
        "class": "talisman",
        "cardCode": "TAL-05",
        "madeAt": "blacksmith",
        "manaCapacity": 8,
        "specialist": "smith",
        "inputs": [
          {
            "commodity": "gems",
            "qty": 1
          },
          {
            "commodity": "copper",
            "qty": 1
          }
        ],
        "effortHours": 5,
        "baseValue": 190,
        "massKg": 0.5,
        "story": "A cut stone in a copper claw. Hold it to the light and something at the centre of it holds still, watching you back.",
        "effects": [
          "Stores up to 8 mana."
        ]
      },
      {
        "id": "talisman-crystal-phylactery",
        "name": "Crystal Phylactery",
        "class": "talisman",
        "cardCode": "TAL-06",
        "madeAt": "alchemist",
        "manaCapacity": 10,
        "specialist": "alchemist",
        "inputs": [
          {
            "commodity": "mana-crystal",
            "qty": 1
          },
          {
            "commodity": "glass",
            "qty": 1
          },
          {
            "commodity": "gold",
            "qty": 1
          }
        ],
        "effortHours": 6,
        "baseValue": 320,
        "massKg": 1,
        "story": "A mana crystal sealed in blown glass and bound in gold wire. The pinnacle of the jeweller's and the alchemist's arts together, and the reason both of them lock their doors.",
        "effects": [
          "Stores up to 10 mana.",
          "Worth 1 victory point at game end."
        ]
      }
    ]
  },
  "travel": {
    "$comment": "The travel-speed table: hexes per leg, by mode of travel, terrain letter code and time of day. This is the printed table a player reads at the table - one row per mode, one column per terrain code from terrain.json. It is hand-tuned rather than derived, because 'a horse is fast on grass and useless on a scree slope' is a judgement, not an equation. A speed of 0 means that mode cannot cross that terrain at all without a road.",
    "version": "0.1.0",
    "legs": {
      "$comment": "A round gives every moving figure, party or vehicle one DAY leg. A NIGHT leg is optional extra movement immediately after, and it needs light. rules.json movement.legs states when; this file states how fast.",
      "day": "Move up to the listed speed, hex by hex; each hex entered must have a listed speed above 0 for your mode (or a road/rail).",
      "night": "Only with a lit torch or lantern. Speeds below. A night leg triggers a second discovery roll with the monster band widened by 1."
    },
    "terrainCodes": [
      "G",
      "F",
      "H",
      "M",
      "B",
      "T",
      "D",
      "C",
      "S",
      "O"
    ],
    "speeds": {
      "$comment": "Hexes per day leg. Columns follow terrainCodes: G grassland, F forest, H hills, M mountain, B marsh, T tundra, D desert, C coast, S shallow water, O deep water. The road and rail rows override the terrain underneath: on a road use the road number whatever the ground; on rail a train moves at the rail number and nothing else moves at all.",
      "modes": [
        {
          "id": "on-foot",
          "name": "On Foot",
          "hexesPerDayLeg": {
            "G": 4,
            "F": 2,
            "H": 2,
            "M": 1,
            "B": 1,
            "T": 2,
            "D": 2,
            "C": 4,
            "S": 0,
            "O": 0
          }
        },
        {
          "id": "mounted",
          "name": "Mounted",
          "hexesPerDayLeg": {
            "G": 6,
            "F": 2,
            "H": 3,
            "M": 1,
            "B": 1,
            "T": 3,
            "D": 3,
            "C": 6,
            "S": 0,
            "O": 0
          },
          "note": "Requires a horse - a horse commodity ridden, or a horse vehicle card."
        },
        {
          "id": "cart",
          "name": "Cart",
          "hexesPerDayLeg": {
            "G": 3,
            "F": 1,
            "H": 1,
            "M": 0,
            "B": 0,
            "T": 1,
            "D": 2,
            "C": 3,
            "S": 0,
            "O": 0
          }
        },
        {
          "id": "caravan",
          "name": "Caravan",
          "hexesPerDayLeg": {
            "G": 2,
            "F": 1,
            "H": 1,
            "M": 0,
            "B": 0,
            "T": 1,
            "D": 2,
            "C": 2,
            "S": 0,
            "O": 0
          }
        },
        {
          "id": "barge",
          "name": "Barge",
          "hexesPerDayLeg": {
            "G": 0,
            "F": 0,
            "H": 0,
            "M": 0,
            "B": 0,
            "T": 0,
            "D": 0,
            "C": 3,
            "S": 3,
            "O": 0
          }
        },
        {
          "id": "ship",
          "name": "Ship",
          "hexesPerDayLeg": {
            "G": 0,
            "F": 0,
            "H": 0,
            "M": 0,
            "B": 0,
            "T": 0,
            "D": 0,
            "C": 2,
            "S": 3,
            "O": 5
          }
        },
        {
          "id": "sled",
          "name": "Sled",
          "hexesPerDayLeg": {
            "G": 1,
            "F": 1,
            "H": 2,
            "M": 2,
            "B": 2,
            "T": 5,
            "D": 0,
            "C": 1,
            "S": 2,
            "O": 0
          },
          "note": "Runners want snow and ice. Tundra is its road; frozen marsh and shallow water carry it where nothing wheeled will go; on bare grass it is a heavy box being dragged. Shallow water only while a frost is on - see the winter rule below."
        },
        {
          "id": "airship",
          "name": "Airship",
          "hexesPerDayLeg": {
            "G": 5,
            "F": 5,
            "H": 5,
            "M": 4,
            "B": 5,
            "T": 5,
            "D": 5,
            "C": 5,
            "S": 5,
            "O": 5
          },
          "note": "One number for every terrain, because there is no terrain up there - only the mountain reaches high enough to matter. What an airship pays instead is the wind: see wind, below."
        }
      ],
      "overrides": [
        {
          "id": "road",
          "name": "On a Road",
          "hexesPerDayLeg": {
            "on-foot": 5,
            "mounted": 8,
            "cart": 6,
            "caravan": 4
          },
          "note": "Whatever the terrain under the road. This is what a road is for."
        },
        {
          "id": "rail",
          "name": "On Rail",
          "hexesPerDayLeg": {
            "train": 6
          },
          "note": "Trains only, depot to depot, whatever the terrain. Trains stop rarely - see discovery.json railNote - which quietly makes the train the safest way to cross the map."
        }
      ]
    },
    "night": {
      "$comment": "What each light source allows after dark. No light, no travel - the dark in the Reach is genuinely dark.",
      "noLight": {
        "hexesPerNightLeg": 0,
        "note": "No travel at all. Even on a road."
      },
      "torch": {
        "hexesPerNightLeg": 1,
        "hexesOnRoad": 2,
        "note": "One hex, two on a road, whatever the mode. Spends one use of the torch."
      },
      "lantern": {
        "rule": "half day speed, rounded up",
        "note": "A lantern-lit party moves at half its day speed for the terrain, rounded up. Nothing to spend."
      },
      "trains": {
        "rule": "trains run at night at full rail speed if the engine carries a lantern",
        "note": "Fitted as cargo of 0 bulk. Some vehicle cards carry one already."
      },
      "ships": {
        "rule": "no night sailing without a lantern rigged; with one, half speed",
        "note": null
      },
      "potions": {
        "rule": "Owl's Eye (items.json) counts as a lantern for one round",
        "note": null
      }
    },
    "wind": {
      "$comment": "What an airship pays instead of terrain. Rolled once per airship per day leg, before it moves. This is the whole reason the sweep-rig on VEH-17 exists, and the reason Fair Wind is worth 2 mana to an aeronaut.",
      "roll": "d6 at the start of each airship day leg.",
      "table": [
        {
          "d6": "1",
          "result": "Foul. The airship moves 1 hex, in a direction of the left-hand player's choosing."
        },
        {
          "d6": "2-3",
          "result": "Contrary. Half speed, rounded down."
        },
        {
          "d6": "4-5",
          "result": "Fair. Full speed."
        },
        {
          "d6": "6",
          "result": "Following. Full speed +2 hexes."
        }
      ],
      "sweeps": "An airship with a sweep-rig - fixed upper beam, working lower beam, rowed by the crew - treats any Foul or Contrary result as Contrary at full speed instead, at the cost of 1 extra crew fed that round. It cannot beat the wind; it can refuse to be beaten by it.",
      "spells": "Fair Wind (arcana.json) sets the result to Following without rolling. Stormcall against an airship counts as Foul."
    },
    "winter": {
      "$comment": "A sled is the first mode in the game whose speeds depend on the season, so the season needs stating somewhere. It is stated here and nowhere else.",
      "when": "While a Hard Frost card (events.json) is in play, and on any tundra or mountain tile at any time.",
      "effect": "Marsh, shallow water and coast tiles count as frozen: sleds cross them at the listed speed and no other land mode may enter shallow water at all. Barges and ships may not enter a frozen tile.",
      "thaw": "When the frost lifts, any sled standing on a marsh or water tile is lost with its cargo. Move it before the round ends."
    },
    "caves": {
      "$comment": "Cave mouths are placed by discovery rolls on terrain with the caves feature (hills, mountain). What is inside is worth the oil.",
      "entry": "A party may enter a cave on its hex only with a lit torch or lantern. A torch spends one use per visit; a lantern spends nothing.",
      "inside": "Entering resolves one draw on the cave column in discovery.json. A cave, once emptied, is marked spent - it becomes a known camp: resting in it counts as an inn with no coin cost.",
      "why": "Caves are where the earth and fire monsters keep what they have taken, and where more than one campaign stage leads."
    }
  },
  "discovery": {
    "$comment": "Discovery rolls: what the land does back. When a figure, party or vehicle ENDS a movement leg, roll a d20 once on the table for the hex it stopped in - one roll per leg, never one per hex crossed. Tables are keyed by terrain (the letter codes in terrain.json); a road or rail on the hex overrides its terrain table. Bands are deliberately skewed: roads grow merchants and bandits, deserts and mountains grow monsters, and commodity traces are rare everywhere because discovery is what you find when you are NOT looking - surveying and foraging are jobs, with their own recipes.",
    "version": "0.1.0",
    "die": "d20",
    "results": [
      {
        "id": "nothing",
        "name": "Nothing",
        "summary": "The country is long and empty. Move on."
      },
      {
        "id": "merchant",
        "name": "Travelling Merchant",
        "summary": "Deal item cards face up per rules.json market.merchantStock (roadside stock, 2 cards). Buy at base value +10%. He has heard prices: learn the current band of one commodity family in the nearest settlement."
      },
      {
        "id": "traveller",
        "name": "Traveller",
        "summary": "News on the road. Look at the top card of the event deck and put it back, or look at the top card of the quest deck."
      },
      {
        "id": "bandits",
        "name": "Bandits",
        "summary": "Strength 2, +1 per full 20 bulk of cargo in the party. Fight them, or pay a toll of a quarter of the carried value. An escort (soldier or hireling) rolls first."
      },
      {
        "id": "monster",
        "name": "Monster",
        "summary": "Draw from the monster deck until the drawn monster's terrain list includes this hex's terrain; shuffle the rest back. Resolve the encounter - see monsters.json encounterOptions."
      },
      {
        "id": "commodity-trace",
        "name": "Trace",
        "summary": "Something worth digging showed in a cutting or a stream bed. Place a trace tile: a survey on this hex is at +2 until the deposit is found or ruled out."
      },
      {
        "id": "cave-mouth",
        "name": "Cave Mouth",
        "summary": "Place a cave tile on the hex. A party with a lit torch or lantern may enter, now or any later visit - entering resolves one draw on the cave table."
      },
      {
        "id": "quest-omen",
        "name": "Omen",
        "summary": "Something stranger than the road. Draw the top card of the quest deck; accept it or put it on the bottom."
      },
      {
        "id": "hazard",
        "name": "Hazard",
        "summary": "A washed-out track, a sand-slip, rotten ice. The leg ends here. Each character takes 1 damage unless the party discards a rope or lets a tool take 4 wear."
      },
      {
        "id": "pirates",
        "name": "Pirates",
        "summary": "Strength 3. Fight, pay 30% of cargo value, or run - lose half speed on your next leg."
      },
      {
        "id": "flotsam",
        "name": "Flotsam",
        "summary": "A wreck, or the leavings of one. Gain 2 bulk of a random commodity - roll on the commodity reference, rerolling livestock."
      },
      {
        "id": "hoard",
        "name": "Hoard",
        "summary": "Something laired here once, and left in a hurry. Gain 20 coin and one item card dealt from the item deck."
      }
    ],
    "tables": [
      {
        "id": "grassland",
        "name": "Grassland (G)",
        "terrain": "grassland",
        "code": "G",
        "entries": [
          {
            "roll": "1",
            "result": "bandits"
          },
          {
            "roll": "2-4",
            "result": "traveller"
          },
          {
            "roll": "5-14",
            "result": "nothing"
          },
          {
            "roll": "15-16",
            "result": "commodity-trace"
          },
          {
            "roll": "17-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 2,
          "air": 2,
          "fire": 1,
          "water": 1
        }
      },
      {
        "id": "forest",
        "name": "Forest (F)",
        "terrain": "forest",
        "code": "F",
        "entries": [
          {
            "roll": "1",
            "result": "bandits"
          },
          {
            "roll": "2-3",
            "result": "traveller"
          },
          {
            "roll": "4-11",
            "result": "nothing"
          },
          {
            "roll": "12-14",
            "result": "commodity-trace"
          },
          {
            "roll": "15-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 3,
          "air": 1,
          "fire": 1,
          "water": 1
        }
      },
      {
        "id": "hills",
        "name": "Hills (H)",
        "terrain": "hills",
        "code": "H",
        "entries": [
          {
            "roll": "1",
            "result": "bandits"
          },
          {
            "roll": "2-3",
            "result": "traveller"
          },
          {
            "roll": "4-10",
            "result": "nothing"
          },
          {
            "roll": "11-13",
            "result": "commodity-trace"
          },
          {
            "roll": "14-15",
            "result": "cave-mouth"
          },
          {
            "roll": "16-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 3,
          "fire": 2,
          "air": 1,
          "water": 0
        }
      },
      {
        "id": "mountain",
        "name": "Mountain (M)",
        "terrain": "mountain",
        "code": "M",
        "entries": [
          {
            "roll": "1",
            "result": "hazard"
          },
          {
            "roll": "2",
            "result": "traveller"
          },
          {
            "roll": "3-8",
            "result": "nothing"
          },
          {
            "roll": "9-11",
            "result": "commodity-trace"
          },
          {
            "roll": "12-14",
            "result": "cave-mouth"
          },
          {
            "roll": "15-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 2,
          "fire": 2,
          "air": 2,
          "water": 0
        }
      },
      {
        "id": "marsh",
        "name": "Marsh (B)",
        "terrain": "marsh",
        "code": "B",
        "entries": [
          {
            "roll": "1",
            "result": "hazard"
          },
          {
            "roll": "2",
            "result": "traveller"
          },
          {
            "roll": "3-10",
            "result": "nothing"
          },
          {
            "roll": "11-12",
            "result": "commodity-trace"
          },
          {
            "roll": "13-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "water": 3,
          "earth": 2,
          "fire": 0,
          "air": 1
        }
      },
      {
        "id": "tundra",
        "name": "Tundra (T)",
        "terrain": "tundra",
        "code": "T",
        "entries": [
          {
            "roll": "1-2",
            "result": "hazard"
          },
          {
            "roll": "3",
            "result": "traveller"
          },
          {
            "roll": "4-11",
            "result": "nothing"
          },
          {
            "roll": "12-13",
            "result": "commodity-trace"
          },
          {
            "roll": "14-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "air": 3,
          "water": 2,
          "earth": 1,
          "fire": 0
        }
      },
      {
        "id": "desert",
        "name": "Desert (D)",
        "terrain": "desert",
        "code": "D",
        "entries": [
          {
            "roll": "1-2",
            "result": "hazard"
          },
          {
            "roll": "3",
            "result": "traveller"
          },
          {
            "roll": "4-9",
            "result": "nothing"
          },
          {
            "roll": "10-11",
            "result": "commodity-trace"
          },
          {
            "roll": "12-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "fire": 3,
          "earth": 2,
          "air": 2,
          "water": 0
        }
      },
      {
        "id": "coast",
        "name": "Coast (C)",
        "terrain": "coast",
        "code": "C",
        "entries": [
          {
            "roll": "1",
            "result": "hazard"
          },
          {
            "roll": "2-4",
            "result": "traveller"
          },
          {
            "roll": "5-12",
            "result": "nothing"
          },
          {
            "roll": "13-14",
            "result": "flotsam"
          },
          {
            "roll": "15",
            "result": "merchant"
          },
          {
            "roll": "16-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "water": 3,
          "air": 2,
          "earth": 1,
          "fire": 0
        }
      },
      {
        "id": "shallow-water",
        "name": "Shallow Water (S)",
        "terrain": "shallow-water",
        "code": "S",
        "entries": [
          {
            "roll": "1",
            "result": "hazard"
          },
          {
            "roll": "2-3",
            "result": "flotsam"
          },
          {
            "roll": "4-13",
            "result": "nothing"
          },
          {
            "roll": "14-15",
            "result": "pirates"
          },
          {
            "roll": "16-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "water": 4,
          "air": 1,
          "earth": 0,
          "fire": 0
        }
      },
      {
        "id": "deep-water",
        "name": "Deep Water (O)",
        "terrain": "deep-water",
        "code": "O",
        "entries": [
          {
            "roll": "1-2",
            "result": "hazard"
          },
          {
            "roll": "3",
            "result": "flotsam"
          },
          {
            "roll": "4-12",
            "result": "nothing"
          },
          {
            "roll": "13-15",
            "result": "pirates"
          },
          {
            "roll": "16-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "water": 4,
          "air": 1,
          "earth": 0,
          "fire": 0
        }
      },
      {
        "id": "road",
        "name": "On a Road",
        "terrain": null,
        "overlay": "road",
        "$comment": "A road on the hex replaces its terrain table. Merchants live here; monsters mostly do not; bandits know exactly where the cargo goes.",
        "entries": [
          {
            "roll": "1-2",
            "result": "bandits"
          },
          {
            "roll": "3-7",
            "result": "merchant"
          },
          {
            "roll": "8-10",
            "result": "traveller"
          },
          {
            "roll": "11-17",
            "result": "nothing"
          },
          {
            "roll": "18-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 2,
          "air": 1,
          "fire": 1,
          "water": 1
        }
      },
      {
        "id": "rail",
        "name": "On the Rail",
        "terrain": null,
        "overlay": "rail",
        "$comment": "Rolled only when the train halts - at a depot, or when the line is blocked. Never a commodity trace: the ground either side of the line was picked clean while it was being laid. Fewer stops, fewer rolls: the train is the safe way across the map, and that is intended.",
        "entries": [
          {
            "roll": "1-2",
            "result": "bandits"
          },
          {
            "roll": "3-5",
            "result": "merchant"
          },
          {
            "roll": "6-7",
            "result": "traveller"
          },
          {
            "roll": "8-17",
            "result": "nothing"
          },
          {
            "roll": "18-19",
            "result": "monster"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 2,
          "fire": 1,
          "air": 1,
          "water": 0
        }
      },
      {
        "id": "cave",
        "name": "Inside a Cave",
        "terrain": null,
        "overlay": "cave",
        "$comment": "Drawn once per entry into a placed cave, by a party carrying light - see travel.json caves.",
        "entries": [
          {
            "roll": "1-2",
            "result": "hazard"
          },
          {
            "roll": "3-8",
            "result": "nothing"
          },
          {
            "roll": "9-12",
            "result": "commodity-trace"
          },
          {
            "roll": "13-16",
            "result": "monster"
          },
          {
            "roll": "17-19",
            "result": "hoard"
          },
          {
            "roll": "20",
            "result": "quest-omen"
          }
        ],
        "elementWeights": {
          "earth": 3,
          "fire": 2,
          "air": 0,
          "water": 1
        }
      }
    ],
    "modifiers": {
      "$comment": "How the bands move. A band 'widens by N' by claiming N rolls below its printed bottom; it never claims 1, and never claims 20 (the omen keeps the top). Multiple modifiers stack.",
      "events": "Event cards with a discovery effect shift the monster band: Blood Moon widens it by 3, The Quiet Season shrinks it by 2.",
      "night": "The discovery roll after a night leg widens the monster band by 1.",
      "settlementShadow": "Within 1 hex of any settlement, the monster band shrinks by 2 - the land is walked, hunted and lit.",
      "shrunkPast": "A band shrunk past its own top row simply does not occur."
    }
  },
  "arcana": {
    "$comment": "Mana, elements and spells. Mana is NOT a commodity: it has no bulk, sits in no stockpile, and cannot be crated. It lives in bodies (rarely - see peoples.json manaStorage) and in talismans (items.json, class talisman), tracked with a token on the talisman's mana bar. Mana crystals in commodities.json are a different thing: frozen mana as a trade good and potion ingredient - a crystal can be shattered by its holder to yield 2 mana of any one element, but mana can never be pressed back into a crystal.",
    "version": "0.1.0",
    "elementMarks": {
      "$comment": "One drawn mark per element, so that a card, a chit, a page of the book and the explorer all say fire the same way. The path is the whole mark: stroked, never filled, on the grid and at the weight data/components.json declares under marks.element - so a mark reads at chit size and survives the black-and-white edition, which is the whole point of putting it on the ink plate. The marks are built on one construction, a ground line and what the element does to it: fire puts three tongues above it, earth puts a stone on it and a root under it, water replaces it with three swells, air lifts three streamers clear of it. None of them is a borrowed alchemical sign - see docs/art/04-iconography.md, which bans letterforms and real-world symbols alike.",
      "grid": "0 0 24 24, and the mark is drawn to fill it edge to edge",
      "renderedBy": "tools/build-icons.mjs, which writes docs/art/icons/element-<id>.svg from these paths and nothing else"
    },
    "elements": [
      {
        "id": "fire",
        "name": "Fire",
        "ink": "oxide",
        "summary": "Heat, forge-work, hunger. At home in the desert and under the mountains.",
        "mark": "M4 20.6H20M12 5.6c2.9 4.4 3.5 6 3.5 8.6 0 3.6-2.5 5.1-3.5 6.2-1-1.1-3.5-2.6-3.5-6.2 0-2.6.6-4.2 3.5-8.6zM7.2 11.6c1.7 2.6 2.1 3.6 2.1 5.1 0 2.1-1.5 3.1-2.1 3.7-.6-.6-2.1-1.6-2.1-3.7 0-1.5.4-2.5 2.1-5.1zM16.8 11.6c1.7 2.6 2.1 3.6 2.1 5.1 0 2.1-1.5 3.1-2.1 3.7-.6-.6-2.1-1.6-2.1-3.7 0-1.5.4-2.5 2.1-5.1z",
        "markNote": "Three tongues standing on the hearth line, rooted in it - a flame that floats is a seed."
      },
      {
        "id": "earth",
        "name": "Earth",
        "ink": "verdigris",
        "summary": "Stone, root, patience. At home in hills, barrows and old woods.",
        "mark": "M3.6 11.6H20.4M6 16.4H18M8.4 20.6H15.6M8.8 11.6c0-2.6 1.4-4.2 3.2-4.2s3.2 1.6 3.2 4.2z",
        "markNote": "A stone on the ground line, and the ground going down in narrowing strata under it. Water is these lines moving; earth is them holding still."
      },
      {
        "id": "water",
        "name": "Water",
        "ink": "slate",
        "summary": "Current, mist, depth. At home in marsh, shore and open sea.",
        "mark": "M3.6 7.4q4.2-3.3 8.4 0t8.4 0M3.6 13.4q4.2-3.3 8.4 0t8.4 0M3.6 19.4q4.2-3.3 8.4 0t8.4 0",
        "markNote": "The ground line has become swell - three of them, and no ground at all."
      },
      {
        "id": "air",
        "name": "Air",
        "ink": "soot-tint-40",
        "summary": "Wind, cold, distance. At home on the tundra and the high passes.",
        "mark": "M3.6 7.6h9.4a2.6 2.6 0 1 0-2.6-2.6M3.6 12.8h12a2.8 2.8 0 1 1-2.8 2.8M3.6 18h7.6",
        "markNote": "Three streamers, two of them curling off the end. Nothing touches the ground."
      }
    ],
    "mana": {
      "gained": "Slaying a monster yields its manaYield in mana of its element, to the characters who fought it. Some quests and hoards yield mana directly.",
      "stored": "Mana must be held: in a body with innate capacity (elves, up to 3) or in a talisman. Mana gained with nowhere to hold it blows away at the end of the round.",
      "element": "Stored mana keeps its element. A talisman can hold a mix - note each element's share beside the bar.",
      "traded": "Characters in the same hex may pass mana freely between talismans. Mana in a talisman is stolen with the talisman.",
      "spent": "On spells, below. Spells state their element; mana of the wrong element does not cast them."
    },
    "spells": [
      {
        "id": "kindle",
        "cardCode": "SPL-01",
        "name": "Kindle",
        "element": "fire",
        "cost": 1,
        "effect": "Light: the caster's party counts as carrying a torch until dawn (nothing to spend), or light any fire without fuel - a furnace so lit runs one batch without paying its fuel."
      },
      {
        "id": "ember-lash",
        "cardCode": "SPL-02",
        "name": "Ember Lash",
        "element": "fire",
        "cost": 3,
        "effect": "+2 combat dice to one unit or character for one battle."
      },
      {
        "id": "mend-stone",
        "cardCode": "SPL-03",
        "name": "Mend Stone",
        "element": "earth",
        "cost": 2,
        "effect": "Repair 2 damage on one building or vehicle, or restore 4 wear to one tool."
      },
      {
        "id": "bulwark",
        "cardCode": "SPL-04",
        "name": "Bulwark",
        "element": "earth",
        "cost": 4,
        "effect": "One unit or character ignores 2 hits in one battle."
      },
      {
        "id": "cleanse",
        "cardCode": "SPL-05",
        "name": "Cleanse",
        "element": "water",
        "cost": 2,
        "effect": "Cure one illness marker, or restore 2 health to one character."
      },
      {
        "id": "mist-veil",
        "cardCode": "SPL-06",
        "name": "Mist Veil",
        "element": "water",
        "cost": 4,
        "effect": "Treat one monster, bandit or pirate discovery result as Nothing. Cast after the roll."
      },
      {
        "id": "fair-wind",
        "cardCode": "SPL-07",
        "name": "Fair Wind",
        "element": "air",
        "cost": 2,
        "effect": "+2 hexes on one leg, any mode. A ship gets +3."
      },
      {
        "id": "stormcall",
        "cardCode": "SPL-08",
        "name": "Stormcall",
        "element": "air",
        "cost": 5,
        "effect": "One party, vehicle or cargo you can see loses its next leg entirely."
      },
      {
        "id": "wayfire",
        "cardCode": "SPL-09",
        "name": "Wayfire",
        "element": "fire",
        "cost": 3,
        "effect": "Burn one blockage clear: a route blocked by an event card reopens, or one tile of forest or marsh costs your party nothing to cross this leg. The tile is scorched - nothing may be foraged there for the rest of the game."
      },
      {
        "id": "seam-sense",
        "cardCode": "SPL-10",
        "name": "Seam-Sense",
        "element": "earth",
        "cost": 3,
        "effect": "Look at the deposit token under your hex and under every hex adjacent to it, then put them back face down. You may tell the truth about them or not."
      },
      {
        "id": "root-snare",
        "cardCode": "SPL-11",
        "name": "Root-Snare",
        "element": "earth",
        "cost": 3,
        "effect": "One monster, party or figure in your hex or adjacent to it may not move next round. A vehicle instead marks 1 damage tearing itself free."
      },
      {
        "id": "deep-draught",
        "cardCode": "SPL-12",
        "name": "Deep Draught",
        "element": "water",
        "cost": 2,
        "effect": "Fill every empty barrel in one town with water, free, wherever it stands - and that town ignores Drought this round."
      },
      {
        "id": "farspeak",
        "cardCode": "SPL-13",
        "name": "Farspeak",
        "element": "air",
        "cost": 2,
        "effect": "Speak to any other character on the board, wherever they are. You may agree a trade, a price or an alliance at that distance, and either of you may hold to it or not, exactly as if you had met."
      },
      {
        "id": "loft",
        "cardCode": "SPL-14",
        "name": "Loft",
        "element": "air",
        "cost": 4,
        "effect": "One vehicle - any mode, including a wagon or a sled - is lifted over one impassable hex and set down on the far side. An airship instead ignores its next wind roll and moves at full speed."
      }
    ],
    "enchantments": {
      "$comment": "The other half of the arcane deck. A spell is spent and gone; an enchantment is mana laid into an object and left there. It is bound at an alchemist or a shrine, costs its mana up front, and holds until it is broken - which is a thing an event or an enemy can do. Enchantments bound to VEHICLES are not here: a vehicle carries fittings as well as enchantments and the two share a slot, so both live together in data/modifications.json. This file holds the enchantments laid on buildings, tools, items and people.",
      "binding": {
        "where": "At an alchemist, or at a shrine for half again the mana, rounded up.",
        "who": "A character holding the mana - the same rule as casting. Binding takes the whole round.",
        "slots": "One enchantment per object. Binding a second breaks the first, and the mana in it is gone.",
        "broken": "A destroyed object takes its enchantment with it. Some event cards break enchantments outright; a broken enchantment refunds nothing.",
        "value": "An enchanted object sells for its base value plus 20 coin per mana bound into it, and scores 1 victory point per 4 mana bound, rounded down."
      },
      "cards": [
        {
          "id": "bound-hearth",
          "cardCode": "ENC-01",
          "name": "Bound Hearth",
          "element": "fire",
          "cost": 4,
          "boundTo": "one building with a furnace, kiln or oven",
          "effect": "The building pays no fuel, ever.",
          "story": "A coal that was burning when the binding closed, and is burning still. Bakers who own one do not sell it, and bakers who do not own one say so loudly at every guild meeting."
        },
        {
          "id": "truename-stamp",
          "cardCode": "ENC-02",
          "name": "Truename Stamp",
          "element": "earth",
          "cost": 3,
          "boundTo": "one tool",
          "effect": "The tool takes no wear. It can still be lost, sold or stolen - and it is the single most stolen object in the game.",
          "story": "The smith's touchmark struck twice: once in the iron, once in whatever is under the iron. A stamped tool knows what it is for and declines to become anything else."
        },
        {
          "id": "salt-kept",
          "cardCode": "ENC-03",
          "name": "Salt-Kept",
          "element": "water",
          "cost": 3,
          "boundTo": "one granary, warehouse or ship's hold",
          "effect": "Nothing inside spoils, perishes or curdles. Milk keeps. So does everything else.",
          "story": "The air inside goes still and tastes faintly of the sea. Three generations of the Saltreach victuallers have made their whole living off one bound cellar and a reputation for honesty they did not entirely earn."
        },
        {
          "id": "keening-ward",
          "cardCode": "ENC-04",
          "name": "Keening Ward",
          "element": "air",
          "cost": 4,
          "boundTo": "one building",
          "effect": "Cancel every theft, heist and robbery card aimed at this building. Each time it does, roll d6: on a 1 the ward is spent and the card comes off.",
          "story": "It screams. That is the whole enchantment. It screams in a voice the owner cannot hear and the thief cannot stop hearing for about a week."
        },
        {
          "id": "weightless-hand",
          "cardCode": "ENC-05",
          "name": "Weightless Hand",
          "element": "air",
          "cost": 5,
          "boundTo": "one character's pack, belt or cloak",
          "effect": "+10 kg to that character's burden bar. The bar is walked as normal; the last ten kilograms simply do not pull.",
          "story": "Not lighter - the pack weighs what it weighs, and a scale will say so. It just declines to be heavy on the person carrying it, which mule drivers consider a distinction without a difference and porters consider the point."
        },
        {
          "id": "deeproot-footing",
          "cardCode": "ENC-06",
          "name": "Deeproot Footing",
          "element": "earth",
          "cost": 5,
          "boundTo": "one building",
          "effect": "The building ignores Earthquake, Flood and Landslip entirely, and takes half damage, rounded down, from every other source.",
          "story": "Laid into the foundation trench before the first course goes down, which is why it is almost never retrofitted and almost always regretted. The Dunhaven customs house has one. The Dunhaven customs house is the only thing on that street older than sixty years."
        }
      ]
    },
    "casting": {
      "who": "Any character holding the mana - innately or in a carried talisman. Workers and soldiers do not cast.",
      "when": "Any time its effect makes sense; combat spells before hits are applied, Mist Veil after the discovery roll.",
      "limit": "One spell per character per round.",
      "notes": "The spell list is deliberately short and economic, like the potion list: hours, movement, safety, repair. When the list grows, it grows here - and it should probably become a deck."
    }
  },
  "monsters": {
    "$comment": "The monster deck: what a discovery roll can put in front of you. Three of each element, and then the two dragons the sighting cards had been promising - the deck is built to grow. Card layout: portrait, name and element badge at the top, story text low, vertical numbered HEALTH bar on the LEFT edge (harm bars always sit left, capacity bars always sit right - the convention is in docs/art/06-components.md), strength and mana yield as fixed stats. terrains is where the monster is at home: a monster drawn on a hex whose terrain is not listed is shuffled back and redrawn. Art prompts for every monster are in docs/art/prompts/monsters.md.",
    "version": "0.1.0",
    "encounterOptions": {
      "$comment": "Meeting a monster is a choice, and the choice is the player's unless the card says otherwise. The card lists which of the four options it allows; slay is always allowed.",
      "slay": "Fight it, per the conflict rules in rules.json. Slaying yields the monster's manaYield in mana of its element, split among the characters who fought.",
      "enslave": "Win the fight by 2 or more net hits WITHOUT killing it (declare before rolling). An enslaved monster works as a d4 worker in one of your towns, eats 1 food per round, and adds 1 unrest to that town while it lives there. It yields no mana.",
      "befriend": "Offer the gift named on its card and roll d6: on 4+ it is befriended - it guards its hex for you, or travels with your party as a strength-equal escort. It leaves the first round you cannot feed it. No mana.",
      "domesticate": "Befriend it first, or win without killing, then spend 2 consecutive rounds with it at a pasture. A domesticated monster is livestock with the benefit on its card. No mana.",
      "flee": "Any party may instead withdraw the way it came, ending its movement. A party that fled rolls no discovery this leg. Monsters of strength 4+ get one free round of hits against fleeing cargo vehicles.",
      "lair": "An unresolved monster stays on its hex as a figure. It attacks any party that ends a leg there, and event cards may move it."
    },
    "monsters": [
      {
        "id": "cinder-wolf",
        "cardCode": "MON-01",
        "name": "Cinder Wolf",
        "element": "fire",
        "strength": 2,
        "health": 4,
        "manaYield": 1,
        "terrains": [
          "desert",
          "hills",
          "grassland"
        ],
        "options": {
          "enslave": false,
          "befriend": true,
          "domesticate": true
        },
        "gift": "2 meat, laid down and stepped away from",
        "domesticated": "Runs with one travelling party: +1 hex on day legs, and bandits demand no toll.",
        "story": "A lean grey wolf with coals banked behind its ribs. Where the pack sleeps, the grass wears away in rings of ash, and shepherds learn to count their flock twice."
      },
      {
        "id": "ash-drake",
        "cardCode": "MON-02",
        "name": "Ash Drake",
        "element": "fire",
        "strength": 4,
        "health": 8,
        "manaYield": 3,
        "terrains": [
          "mountain",
          "desert"
        ],
        "options": {
          "enslave": true,
          "befriend": false,
          "domesticate": false
        },
        "story": "Not the dragon of the sighting cards - a smaller, meaner cousin, wingless, that swims through scree the way an eel swims a weir. Chained beside a smelter it earns its keep: the forge it sleeps under never wants for heat. It is not grateful.",
        "enslaved": "Instead of working as a d4 worker, an enslaved drake may serve as a furnace: one smelter or kiln in its town pays no fuel."
      },
      {
        "id": "forge-wight",
        "cardCode": "MON-03",
        "name": "Forge Wight",
        "element": "fire",
        "strength": 3,
        "health": 6,
        "manaYield": 2,
        "terrains": [
          "mountain",
          "hills"
        ],
        "options": {
          "enslave": true,
          "befriend": true,
          "domesticate": false
        },
        "gift": "1 coal, freely given - it can tell coal that was stolen",
        "story": "The shape of a smith, in iron nobody forged, warm as a banked fire. It haunts old workings and finished tunnels, mending what it finds there. Befriended, it mends for you; enslaved, it hates you carefully and forever.",
        "befriended": "While it guards a hex of yours, tools in that town take half wear."
      },
      {
        "id": "barrow-troll",
        "cardCode": "MON-04",
        "name": "Barrow Troll",
        "element": "earth",
        "strength": 4,
        "health": 10,
        "manaYield": 3,
        "terrains": [
          "hills",
          "grassland"
        ],
        "options": {
          "enslave": true,
          "befriend": false,
          "domesticate": false
        },
        "story": "It was buried with honours under the hill, by people who are not remembered either. It digs like six men and sleeps like a landslide, and it is always, always hungry.",
        "enslaved": "Works as a d8 worker at any mine, quarry or construction site - but eats 3 food per round, not 1."
      },
      {
        "id": "stone-boar",
        "cardCode": "MON-05",
        "name": "Stone Boar",
        "element": "earth",
        "strength": 2,
        "health": 6,
        "manaYield": 1,
        "terrains": [
          "forest",
          "hills"
        ],
        "options": {
          "enslave": false,
          "befriend": true,
          "domesticate": true
        },
        "gift": "2 vegetables, or any 1 mushroom",
        "domesticated": "Kept at a pasture it ploughs like two oxen: sowing recipes in that town cost half hours, and it never needs a plough.",
        "story": "A boar the colour and apparent hardness of a river boulder. It is placid until it is not, and what it was rooting for turns out, more often than chance allows, to be worth surveying."
      },
      {
        "id": "gravel-wyrm",
        "cardCode": "MON-06",
        "name": "Gravel Wyrm",
        "element": "earth",
        "strength": 3,
        "health": 8,
        "manaYield": 2,
        "terrains": [
          "mountain",
          "desert"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": false
        },
        "story": "A blind, legless thing of plated shale that eats stone and passes ore. Miners who find its castings sing on the way home; miners who find the wyrm do not sing at all. It cannot be reasoned with, because it cannot tell a person from a pillar."
      },
      {
        "id": "mire-strangler",
        "cardCode": "MON-07",
        "name": "Mire Strangler",
        "element": "water",
        "strength": 3,
        "health": 6,
        "manaYield": 2,
        "terrains": [
          "marsh"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": false
        },
        "story": "Where the fen path forks and one fork is dry, the dry fork is the Strangler. It is patient the way water is patient, and it has been fed by three generations of shortcuts."
      },
      {
        "id": "reef-serpent",
        "cardCode": "MON-08",
        "name": "Reef Serpent",
        "element": "water",
        "strength": 3,
        "health": 7,
        "manaYield": 2,
        "terrains": [
          "coast",
          "shallow-water"
        ],
        "options": {
          "enslave": false,
          "befriend": true,
          "domesticate": false
        },
        "gift": "2 fish, tipped over the gunwale at dusk",
        "befriended": "While it patrols a shore hex of yours, pirates never trouble barges or ships that start or end there.",
        "story": "Fishing villages paint its coils on their boats and spill it a share of every catch. Skippers who call the custom superstition are welcome to sail without it."
      },
      {
        "id": "deepwater-maw",
        "cardCode": "MON-09",
        "name": "The Deepwater Maw",
        "element": "water",
        "strength": 5,
        "health": 12,
        "manaYield": 4,
        "unique": true,
        "terrains": [
          "deep-water"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": false
        },
        "story": "There is one, it is old, and every drowned bell and broken keel in the gulf is somewhere in it. Ships that sight it log a heading and a prayer. It is the end of one campaign and the reason harbour insurance exists."
      },
      {
        "id": "rime-harpy",
        "cardCode": "MON-10",
        "name": "Rime Harpy",
        "element": "air",
        "strength": 2,
        "health": 5,
        "manaYield": 1,
        "terrains": [
          "tundra",
          "mountain"
        ],
        "options": {
          "enslave": true,
          "befriend": true,
          "domesticate": false
        },
        "gift": "any 1 luxury commodity - it likes what glitters",
        "story": "It nests in the wind-hollowed ice and collects what shines: coins, gems, buckles, once famously an entire surveyor's kit. Its voice is a dead friend's, badly rehearsed.",
        "befriended": "Once per round it flies a message or 0.5 bulk between any two of your towns, instantly."
      },
      {
        "id": "dust-devil",
        "cardCode": "MON-11",
        "name": "Dust Devil",
        "element": "air",
        "strength": 2,
        "health": 4,
        "manaYield": 2,
        "terrains": [
          "desert",
          "grassland"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": false
        },
        "story": "A standing twist of wind and grit with something like intent in it. You cannot chain the wind, feed it, or pen it - you can only take its mana off it, or take a different road. Slain, it drops whatever it was carrying: also gain 1d6 coin in scoured-clean scrap."
      },
      {
        "id": "storm-roc",
        "cardCode": "MON-12",
        "name": "Storm Roc",
        "element": "air",
        "strength": 4,
        "health": 9,
        "manaYield": 3,
        "terrains": [
          "mountain",
          "coast"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": true
        },
        "domesticated": "The grandest mount in the game: one character may ride it - day legs of 8 in any terrain, ignoring ground entirely. It eats 2 meat per round and will not enter a battle.",
        "story": "Its wingbeats are the weather two valleys over. Nobody has befriended one - the roc does not take gifts - but a bird beaten fairly and fed patiently has, three times in recorded history, decided a rider was worth carrying."
      },
      {
        "id": "vhalrik-the-cinder-crowned",
        "cardCode": "MON-13",
        "name": "Vhalrik, the Cinder-Crowned",
        "element": "fire",
        "strength": 7,
        "health": 16,
        "manaYield": 6,
        "unique": true,
        "terrains": [
          "mountain",
          "hills",
          "desert"
        ],
        "options": {
          "enslave": false,
          "befriend": true,
          "domesticate": false
        },
        "gift": "1 gems and 1 gold, laid out and named aloud as tribute - he counts, and he remembers who was short",
        "befriended": "He does not guard, escort or carry. Once per game, name a settlement: he burns it, and everything in it, whoever owns it. Then he goes back to the mountain and will not speak to you again.",
        "story": "This is the dragon the sighting cards are about. Four hundred years on one hoard under the Kholvar peaks, old enough to be bored and rich enough to be patient. He talks, which is the frightening part, and he negotiates, which is worse: everyone who has bargained with Vhalrik got exactly what they asked for."
      },
      {
        "id": "hoarwyrm",
        "cardCode": "MON-14",
        "name": "The Hoarwyrm",
        "element": "air",
        "strength": 5,
        "health": 13,
        "manaYield": 4,
        "terrains": [
          "tundra",
          "mountain",
          "coast"
        ],
        "options": {
          "enslave": false,
          "befriend": false,
          "domesticate": true
        },
        "domesticated": "Two full winters at a pasture on tundra, fed 4 meat a round the whole time. Then it flies cargo: 12 bulk, 6 hexes a leg, over any terrain and any weather, and no wind roll. It will not fight, and it will not go south of the frost line.",
        "story": "White-scaled, wingless at rest and forty feet of it, riding the cold air off the ice the way a gull rides a cliff. It does not hoard gold - it hoards weather, or the herders think so, because where it winters the frost comes early and stays. Two families in the north have raised one from the shell. Neither will tell you how, and both are very rich."
      }
    ]
  },
  "vehicles": {
    "$comment": "The vehicle deck: named, individual vehicles as cards - seventeen now, and every one of them a specific machine rather than a class of machine. A vehicle card is a specific machine with a history; transport.json modes are the generic rules it runs on (mode names which). Card layout: picture across the middle, name and card code at the top, story text low; a vertical numbered DAMAGE bar up the LEFT edge and a vertical numbered CARGO bar up the RIGHT edge, both numbered from the bottom - harm left, capacity right, the same convention as every other deck (docs/art/06-components.md). Track damage and loaded bulk with tokens on the bars. A vehicle whose damage bar fills is wrecked: cargo spills onto the hex, and salvage is whoever reaches it first. Art prompts in docs/art/prompts/vehicles.md.",
    "version": "0.1.0",
    "cardIdScheme": {
      "$comment": "Every card in every deck carries a code: a deck prefix, a dash, a two-digit sequence. VEH vehicles, MON monsters, CHR characters, QST quests, TAL talismans, EVT events, ITM items, SPL spells. A revision suffix (VEH-03 v2) marks a reprinted card; unrevised cards carry no suffix. The numbering is this repository's own - anyone forking the game is free to renumber, which is why the code is data, not identity: the id field is the identity.",
      "prefixes": {
        "VEH": "vehicles",
        "MON": "monsters",
        "CHR": "characters",
        "QST": "quests",
        "TAL": "items (talismans)",
        "EVT": "events",
        "ITM": "items",
        "SPL": "arcana (spells)",
        "ENC": "arcana (enchantments)",
        "MOD": "modifications"
      },
      "seeAlso": "data/components.json lists the decks themselves - what each one is called, what its back looks like, and which file its content comes from."
    },
    "vehicles": [
      {
        "id": "reach-flyer",
        "cardCode": "VEH-01",
        "name": "The Reach Flyer",
        "mode": "train",
        "cargoCapacity": 40,
        "damageBoxes": 8,
        "quirk": "+1 hex per leg, and she carries 4 passengers (figures or characters) free among the mail sacks.",
        "story": "The pride of the Steppe Line, polished brass and impatience. She has made Vossgard to Brassford in a day and a night, and the fireman has the burns to prove it."
      },
      {
        "id": "steppe-hauler",
        "cardCode": "VEH-02",
        "name": "Steppe Hauler",
        "mode": "train",
        "cargoCapacity": 100,
        "damageBoxes": 10,
        "quirk": "Burns 1 extra coal per leg. Nothing else on rails carries close to her hundred bulk.",
        "story": "Twelve trucks and a boiler like a chapel. When the Hauler passes a village, the village comes out to watch; when she is late, the ironworks stand idle and everybody knows why."
      },
      {
        "id": "old-smoke",
        "cardCode": "VEH-03",
        "name": "Old Smoke",
        "mode": "train",
        "cargoCapacity": 60,
        "damageBoxes": 6,
        "quirk": "Costs half a train's price to buy. Each journey, roll a d6: on a 1 she limps, and the journey takes twice as long.",
        "story": "The first engine ever to cross the pass, sold on, patched, sold again. Every engineer in the Reach has driven her once and speaks of her the way you speak of a difficult grandmother."
      },
      {
        "id": "gullwing",
        "cardCode": "VEH-04",
        "name": "Gullwing",
        "mode": "ship",
        "cargoCapacity": 30,
        "damageBoxes": 8,
        "quirk": "+1 hex per leg, and she carries a rigged lantern: she may sail night legs at half speed.",
        "story": "A courier sloop built for the packet run, all sail and no patience. She has outrun two storms and one embargo, and her skipper mentions all three before you have sat down."
      },
      {
        "id": "saltreach-pride",
        "cardCode": "VEH-05",
        "name": "Saltreach Pride",
        "mode": "ship",
        "cargoCapacity": 80,
        "damageBoxes": 12,
        "quirk": "Takes the first 2 hits of any battle or storm on her oak sides without marking damage.",
        "story": "The great trader of the western run, oak-ribbed and stubborn. She has been dismasted twice and come home twice, and Saltreach's harbour rates are set to whatever her master will pay."
      },
      {
        "id": "ember-coast-trader",
        "cardCode": "VEH-06",
        "name": "Ember Coast Trader",
        "mode": "ship",
        "cargoCapacity": 55,
        "damageBoxes": 10,
        "quirk": "Sells at +10% at any harbour on the southern coast - Dunhaven and Port Malchior know her flag and clear her berth.",
        "story": "A fat, cheerful coaster that has worked the southern run so long the reef serpents recognise her hull. Her hold smells of salt, spice and forty years of honest smuggling."
      },
      {
        "id": "dunhaven-column",
        "cardCode": "VEH-07",
        "name": "The Dunhaven Column",
        "mode": "caravan",
        "cargoCapacity": 28,
        "damageBoxes": 8,
        "quirk": "Desert-wise: crosses desert at 2 hexes per leg, and hazard results in desert cost her nothing.",
        "story": "Forty years of the Kholvar crossing, water butts strapped three deep. The Column has never lost a wagon to the sand, and its masters intend to be buried saying so."
      },
      {
        "id": "fenway-wagons",
        "cardCode": "VEH-08",
        "name": "The Fenway Wagons",
        "mode": "caravan",
        "cargoCapacity": 20,
        "damageBoxes": 6,
        "quirk": "Broad marsh-rigged wheels: may cross marsh at 1 hex per leg, which no other wheeled thing can do at all.",
        "story": "Wide-wheeled, willow-sprung, waterproofed with fen pitch. The Fenway crews sell the safe road through the Mirewash, and the toll is knowing which tussocks are lying."
      },
      {
        "id": "varl-wagonrow",
        "cardCode": "VEH-09",
        "name": "The Varl Wagonrow",
        "mode": "caravan",
        "cargoCapacity": 24,
        "damageBoxes": 7,
        "quirk": "Hill-country teams: crosses hills at 2 hexes per leg.",
        "story": "Ox-teams bred in the highlands, drivers born in the wagons. The Wagonrow takes the upland road the maps advise against and arrives, insufferably, early."
      },
      {
        "id": "bay-courser",
        "cardCode": "VEH-10",
        "name": "Bay Courser",
        "mode": "mounted",
        "cargoCapacity": 2,
        "damageBoxes": 4,
        "quirk": "+1 hex on grassland legs. The fastest honest thing on four legs in the Reach.",
        "story": "A racing bay out of the Vossgard studs, all nerves and speed. She has carried three riders to fame and thrown two of them at the finish."
      },
      {
        "id": "steppe-pony",
        "cardCode": "VEH-11",
        "name": "Steppe Pony",
        "mode": "mounted",
        "cargoCapacity": 3,
        "damageBoxes": 5,
        "quirk": "Ignores tundra penalties and forages for herself: no feed, ever.",
        "story": "Shaggy, short-legged, unimpressed. The steppe pony has carried the mail through three winters that killed better-looking horses, and her opinion of better-looking horses is on record."
      },
      {
        "id": "black-malchior",
        "cardCode": "VEH-12",
        "name": "Black Malchior",
        "mode": "mounted",
        "cargoCapacity": 2,
        "damageBoxes": 4,
        "quirk": "Night-eyed: may travel one night leg per journey with no light at all.",
        "story": "A tall black gelding the port is named after, or the other way round - the ostlers argue. He walks the dark road at an even pace, and riders swear he sees the ruts before the moon does."
      },
      {
        "id": "nine-and-the-drum",
        "cardCode": "VEH-13",
        "name": "Nine and the Drum",
        "mode": "sled",
        "cargoCapacity": 10,
        "damageBoxes": 5,
        "quirk": "Nine dogs and a lead bitch called Drum. +2 hexes on any tundra leg, and the team smells a crevasse: ignore the first hazard result of every journey.",
        "story": "Eight in the traces, one spare running loose, and Drum out front deciding what the driver meant. She has brought two drivers home unconscious on the load and takes the view that this is the arrangement."
      },
      {
        "id": "red-lantern",
        "cardCode": "VEH-14",
        "name": "The Red Lantern",
        "mode": "ship",
        "cargoCapacity": 70,
        "damageBoxes": 11,
        "quirk": "Junk-rigged and steam-fitted: sails free, or burns 1 coal per leg for +2 hexes and no wind roll at all. Her battened sails take no damage from storms.",
        "story": "Five battened sails the colour of dried blood, a squat iron funnel amidships, and a hull built in sealed compartments so a holed one is an inconvenience rather than a funeral. She came the long way round the southern ocean and her master has never once explained why."
      },
      {
        "id": "carrion-queen",
        "cardCode": "VEH-15",
        "name": "The Carrion Queen",
        "mode": "ship",
        "cargoCapacity": 45,
        "damageBoxes": 12,
        "quirk": "+3 combat dice at sea, and any ship she catches must hand over one cargo token or fight. Nobody legitimate will berth her: she may not use a harbour she does not own, and pays double at any market that takes her coin at all.",
        "story": "Black hull, black sails gone to ribbons, and a boiler bolted in below by somebody who did not care what it did to her lines. She makes eleven knots on a dead calm, which is the whole trick and the whole terror: outrunning the Queen used to be a matter of weather."
      },
      {
        "id": "pilgrims-patience",
        "cardCode": "VEH-16",
        "name": "The Pilgrim's Patience",
        "mode": "airship",
        "cargoCapacity": 18,
        "damageBoxes": 6,
        "quirk": "Goes over everything: no terrain costs her anything, and she cannot be robbed on the road. Roll the wind each leg (travel.json) - she has no answer to it.",
        "story": "A varnished silk envelope the length of a chapel, a wicker gondola, and a crew of four who have agreed not to discuss the drop. She carries mail, medicine and very expensive people, and has twice arrived somewhere nobody asked her to go."
      },
      {
        "id": "sweep-of-vossgard",
        "cardCode": "VEH-17",
        "name": "The Sweep of Vossgard",
        "mode": "airship",
        "cargoCapacity": 14,
        "damageBoxes": 7,
        "quirk": "Sweep-rigged: a fixed upper beam and a working lower one down each flank, rowed by the crew. Treat any Foul or Contrary wind as Contrary at full speed, for 1 extra crew fed that round. She cannot beat the wind - she can refuse to be beaten by it.",
        "story": "Havik Coalbrand drew the rig on the back of a timetable: fix the top spar, hinge the bottom one, and let eight strong people row the air. It looks absurd, it sounds like a mill, and it is the only airship in the Reach that has ever kept an appointment in a headwind."
      }
    ]
  },
  "characters": {
    "$comment": "The character deck: named adventurers a player's hero figure can be. Each player deals or picks one at setup; the card gives the hero a face, a health track and sometimes mana. Card layout: portrait across the middle, name and code at the top, story low; a vertical numbered HEALTH bar up the LEFT edge, and up the RIGHT edge a numbered BURDEN bar in kilograms - carryKg, what this character can carry unaided, walked by a token as they pick things up (rules.json carrying). Where the character has innate mana capacity a MANA bar runs inboard of the burden bar, on the portrait itself. Harm left, capacity right, same as every deck (docs/art/06-components.md). A character at 0 health is carried to the nearest settlement and rests until healed to half; they lose any carried cargo on the way. Art prompts in docs/art/prompts/characters.md.",
    "version": "0.2.0",
    "characters": [
      {
        "id": "corin-vale",
        "cardCode": "CHR-01",
        "name": "Corin Vale",
        "people": "human",
        "calling": "Wayfarer",
        "health": 10,
        "carryKg": 24,
        "manaCapacity": 0,
        "traits": [
          "Wayfinder: +1 hex on any day leg that starts on a road.",
          "Knows the inns: resting costs Corin no coin, anywhere."
        ],
        "startsWith": [
          "travelling-cloak"
        ],
        "story": "Corin has walked every road on the map and several the map declines to show. They carry other people's letters, other people's debts, and a cloak that has been to more funerals than most priests."
      },
      {
        "id": "berga-understone",
        "cardCode": "CHR-02",
        "name": "Berga Understone",
        "people": "dwarf",
        "calling": "Prospector",
        "health": 12,
        "carryKg": 26,
        "manaCapacity": 0,
        "traits": [
          "Nose for Ore: +1 on survey rolls, and trace results widen by 1 for her party.",
          "Surefooted, like all her people: hills and mountain cost 1 less to cross, minimum 1."
        ],
        "startsWith": [
          "boots"
        ],
        "story": "Berga can taste iron in spring water and hear a hollow under a hillside. She left the deep halls over a matter of principle - the principle being that the seam she found was hers."
      },
      {
        "id": "sylvae-of-the-duskmere",
        "cardCode": "CHR-03",
        "name": "Sylvae of the Duskmere",
        "people": "elf",
        "calling": "Herbalist",
        "health": 8,
        "carryKg": 20,
        "manaCapacity": 3,
        "manaNote": "Innate - no talisman needed for the first 3.",
        "traits": [
          "Greenwise: +1 on forage rolls, and Sylvae harvests arcane herbs without a knife.",
          "The wood remembers her: forest costs her party 1 to cross."
        ],
        "startsWith": [],
        "story": "Sylvae has catalogued four hundred growing things and personally argued with perhaps a dozen. Her satchel is worth more than most warehouses, and smells considerably better."
      },
      {
        "id": "tilly-goodbarrel",
        "cardCode": "CHR-04",
        "name": "Tilly Goodbarrel",
        "people": "halfling",
        "calling": "Provisioner",
        "health": 8,
        "carryKg": 18,
        "manaCapacity": 0,
        "traits": [
          "Iron Stomach: Tilly and her party ignore illness event cards.",
          "Quartermaster: food carried by her party never perishes."
        ],
        "startsWith": [],
        "story": "Tilly has fed harvest crews, armies and one very confused troll, and holds that there is no crisis a proper breakfast does not shrink. Her wagon's pantry defies several natural laws."
      },
      {
        "id": "ruk-of-the-red-road",
        "cardCode": "CHR-05",
        "name": "Ruk of the Red Road",
        "people": "orc",
        "calling": "Caravan Guard",
        "health": 13,
        "carryKg": 28,
        "manaCapacity": 0,
        "traits": [
          "Scarred Escort: bandits never demand a toll of Ruk's party - they fight, or they leave.",
          "+1 combat die in any battle protecting cargo."
        ],
        "startsWith": [
          "war-axe"
        ],
        "story": "Ruk guarded the Kholvar crossing for twenty years and the scars are a map of every ambush that failed. The axe is for emphasis. Mostly."
      },
      {
        "id": "elspeth-marrow",
        "cardCode": "CHR-06",
        "name": "Doctor Elspeth Marrow",
        "people": "human",
        "calling": "Physician",
        "health": 9,
        "carryKg": 20,
        "manaCapacity": 0,
        "traits": [
          "Physician: once per round, cure one illness marker or restore 2 health, anywhere she stands - no infirmary needed.",
          "Her party ignores Camp Fever."
        ],
        "startsWith": [
          "potion-physic"
        ],
        "story": "Trained at the Saltreach college, thrown out of it over a disagreement about leeches - she was against them. Her bag is oiled leather; her ledger lists every patient, and the margins list every fee still owed."
      },
      {
        "id": "havik-coalbrand",
        "cardCode": "CHR-07",
        "name": "Havik Coalbrand",
        "people": "dwarf",
        "calling": "Engineer",
        "health": 10,
        "carryKg": 26,
        "manaCapacity": 0,
        "traits": [
          "Linesman: a train Havik rides spends 1 less coal per leg.",
          "Tinker: repairs 1 vehicle damage box per round, free, wherever the vehicle stands."
        ],
        "startsWith": [],
        "story": "Havik walked the whole Reach Line before it was laid, driving in the survey pegs by hand. He talks to engines in Old Dwarfish and maintains, with evidence, that they run better for it."
      },
      {
        "id": "mother-keswick",
        "cardCode": "CHR-08",
        "name": "Old Mother Keswick",
        "people": "human",
        "calling": "Hedge-Witch",
        "health": 7,
        "carryKg": 16,
        "manaCapacity": 0,
        "manaNote": "Human - every drop she holds lives in a talisman, and she holds plenty.",
        "traits": [
          "Hedge Magic: spells cost Keswick 1 less mana, minimum 1.",
          "Second Sight: once per round she may look at the top card of the event deck."
        ],
        "startsWith": [
          "talisman-bone-charm"
        ],
        "story": "Every fen village has a Mother Keswick and this is the one the others were named after. She trades in warts cursed, weather guessed and truths nobody thanked her for, and her bone charm was old when the Reach was young."
      }
    ]
  },
  "quests": {
    "$comment": "The quest deck: mini-quests and campaigns. A quest reaches a player through a quest-omen discovery result, or by paying 5 coin at any inn to hear a rumour (draw one). The player reads it and ACCEPTS or DECLINES on the spot; declined cards go to the bottom of the deck for someone else. An accepted quest sits face up by the player's board until completed or abandoned - abandoning is free but the card is discarded from the game, and some campaigns say otherwise. Complexity runs 1 (an errand) to 5 (a campaign that shapes a whole game); the deck is meant to grow at every complexity. Settlement names refer to the Korvane Reach board; a future map brings its own quest cards. Card codes QST-nn.",
    "version": "0.1.0",
    "quests": [
      {
        "id": "millers-debt",
        "cardCode": "QST-01",
        "type": "mini",
        "complexity": 1,
        "name": "The Miller's Debt",
        "hook": "The miller at Grist ground a season's flour on credit, and the credit was grain that never came.",
        "task": "Deliver 3 grain to Grist.",
        "reward": {
          "coin": 25,
          "note": "And goodwill: your next purchase in Grist is at -10%."
        }
      },
      {
        "id": "lanterns-for-coldwater",
        "cardCode": "QST-02",
        "type": "mini",
        "complexity": 1,
        "name": "Lanterns for Coldwater",
        "hook": "The northern nights run eighteen hours in winter, and Coldwater's last lantern went through the harbour ice with the boat it was rigged to.",
        "task": "Deliver a lantern (the item) to Coldwater.",
        "reward": {
          "coin": 40,
          "note": "And a bed by the stove: resting at Coldwater is free for you, all game."
        }
      },
      {
        "id": "boar-of-bramblehold",
        "cardCode": "QST-03",
        "type": "mini",
        "complexity": 2,
        "name": "The Boar of Bramblehold",
        "hook": "Something is rooting up the Bramblehold coppices by night, and the woodcutters have opinions about its size.",
        "task": "Travel to any Bramblehold Wood hex and resolve a Stone Boar encounter there - slay it, or better, keep it.",
        "reward": {
          "note": "If domesticated: keep the boar, and score 1 victory point. If slain: gain 4 meat, 2 hide and its earth mana."
        }
      },
      {
        "id": "word-to-dry-wells",
        "cardCode": "QST-04",
        "type": "mini",
        "complexity": 2,
        "name": "Word to Dry Wells",
        "hook": "A sealed letter, a worried clerk, and a settlement three days into the sand. Nobody says what is in the letter. The seal is the Seat's.",
        "task": "Carry the letter from Vossgard to Dry Wells within 4 rounds of accepting.",
        "reward": {
          "coin": 60,
          "note": "And the well-keeper's gratitude: one free automatic survey success on any desert hex, once."
        }
      },
      {
        "id": "strangler-in-the-mire",
        "cardCode": "QST-05",
        "type": "mini",
        "complexity": 3,
        "name": "The Strangler in the Mire",
        "hook": "Umber Hollow has stopped counting its missing in ones. The fen path is closed, the peat is cut short, and the inn is full of people who will not walk home.",
        "task": "Slay the Mire Strangler within 2 hexes of Umber Hollow. If no Strangler is on the board, travelling those marsh hexes finds it on any discovery monster result, automatically.",
        "reward": {
          "coin": 80,
          "mana": {
            "element": "water",
            "qty": 2
          },
          "note": "And Umber Hollow's freedom of the house: its inn is free to you, all game."
        }
      },
      {
        "id": "draught-for-fens-end",
        "cardCode": "QST-06",
        "type": "mini",
        "complexity": 3,
        "name": "A Draught for Fen's End",
        "hook": "The sisters who keep the Fen's End sickhouse sent a list: one draught, properly brewed, before the ague season. The list is dated. The date is close.",
        "task": "Deliver a Healing Draught or Physic Tonic to Fen's End within 5 rounds of accepting. Brewing it yourself or buying it both count.",
        "reward": {
          "coin": 70,
          "note": "And word spreads of it: score 1 victory point."
        }
      },
      {
        "id": "ironspine-road",
        "cardCode": "QST-07",
        "type": "campaign",
        "complexity": 4,
        "name": "The Ironspine Road",
        "hook": "There is one pass over the Ironspine worth a rail bed, and three interests that would rather there were none. The Seat wants a road first, to prove the line can live.",
        "stages": [
          {
            "name": "Survey the Pass",
            "task": "End a leg on 2 different mountain hexes between Vossgard and Port Malchior and succeed at a survey on each.",
            "reward": {
              "note": "The Seat's cartographers share their notes: Plan Route costs you no effort, all game."
            }
          },
          {
            "name": "Prove the Road",
            "task": "Escort a caravan (yours or a hired one) from Vossgard to Port Malchior without losing any cargo to any event, bandit or monster.",
            "reward": {
              "coin": 100
            }
          },
          {
            "name": "The Thing in the Tunnel",
            "task": "The old bore under the pass is not empty. Enter with light and resolve a Forge Wight encounter - slay it, befriend it, or enslave it.",
            "reward": {
              "vp": 2,
              "note": "And the pass is yours by use and custom: rail you lay on mountain hexes costs half build-points, all game."
            }
          }
        ],
        "notes": "Stages in order. Abandoning this campaign discards it for every player - the pass stays shut."
      },
      {
        "id": "drowned-bell",
        "cardCode": "QST-08",
        "type": "campaign",
        "complexity": 5,
        "name": "The Drowned Bell of Taleowick",
        "hook": "Taleowick's chapel bell went into the bay a lifetime ago, boat and bellringer with it, and on flat calm nights the village swears it still rings the hour. Lately it has been ringing the wrong one.",
        "stages": [
          {
            "name": "The Tale at the Inn",
            "task": "Rest a round at Taleowick and pay 10 coin for the whole story.",
            "reward": {
              "note": "The sexton's map of the old channel: your ships and barges treat the four Splinter Isles hexes as home water - no discovery rolls there."
            }
          },
          {
            "name": "The Sounding",
            "task": "End a ship or barge leg on 3 different shallow-water hexes within 2 hexes of Taleowick. Each triggers its discovery roll as normal; survive whatever answers.",
            "reward": {
              "note": "The bell-clapper, hauled up in a net: counts as 1 gold, but keep it - it is the campaign's key."
            }
          },
          {
            "name": "What Rings It",
            "task": "The Deepwater Maw has been using the bell as a lure. It rises against the ship carrying the clapper: fight and slay it. Strength 5, health 12, and it strikes first unless a character aboard has water mana stored.",
            "reward": {
              "vp": 3,
              "mana": {
                "element": "water",
                "qty": 4
              },
              "items": [
                "talisman-crystal-phylactery"
              ],
              "note": "The phylactery is found inside the bell, which the village lets you keep the story of."
            }
          }
        ],
        "notes": "Stages in order. If the Maw is slain by anyone else first, stage 3 completes at the Maw's hex with the clapper aboard - the bell falls silent either way."
      }
    ]
  },
  "modifications": {
    "$comment": "The modification deck: things bolted, stitched or bound onto a vehicle after it is built. A vehicle card (vehicles.json) is a specific machine; a transport mode (transport.json) is the rules it runs on; a modification is what its owner did to it afterwards, and it is the only one of the three a player creates during a game. Fittings and enchantments are in the same file and compete for the same slots on purpose - a shipwright and a hedge-witch are both trying to make the same hull go faster, and the player has to choose which. The general enchantments, the ones laid on buildings, tools and people, are in arcana.json. Card layout: the fitting drawn across the middle, name and code at the top, what it fits as the kicker, story low. A modification card carries no bars - it has neither harm nor capacity of its own; what it does is change the bars on the card it is tucked under. Art prompts in docs/art/prompts/modifications.md.",
    "version": "0.1.0",
    "slots": {
      "$comment": "How many modifications a vehicle may carry at once. Kept deliberately tight: the interesting decision is which two, not whether to take all six.",
      "base": 2,
      "byTier": {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 3,
        "$note": "the tier of the vehicle's mode in transport.json"
      },
      "enchantmentLimit": 1,
      "rules": [
        "One modification per slot, and no two of the same modification on one vehicle.",
        "At most one enchantment, whatever the slot count. Binding a second breaks the first and its mana is gone.",
        "A modification is fitted at the building named on its card, over one whole round, with the vehicle standing there.",
        "Removing a fitting takes a round and returns half its inputs, rounded down. Removing an enchantment breaks it and returns nothing.",
        "A wrecked vehicle takes its modifications with it. Salvage recovers fittings on a d6 of 5+, one roll each; enchantments never survive.",
        "A modification adds its baseValue to what the vehicle sells for, and an enchanted vehicle adds 20 coin per mana bound as well."
      ]
    },
    "classes": [
      {
        "id": "rigging",
        "name": "Rigging",
        "summary": "Sail, spar and line. What catches the wind, or refuses to need it."
      },
      {
        "id": "hull",
        "name": "Hull",
        "summary": "Sheathing, plating, ram and shutter. What the journey happens inside."
      },
      {
        "id": "running-gear",
        "name": "Running Gear",
        "summary": "Wheels, runners, harness and axle. What meets the ground."
      },
      {
        "id": "powerplant",
        "name": "Powerplant",
        "summary": "Boiler, furnace and gear. What burns, and how well."
      },
      {
        "id": "enchantment",
        "name": "Enchantment",
        "summary": "Mana bound into a vehicle at an alchemist or shrine. Costs mana, not commodities, and one per vehicle."
      }
    ],
    "modifications": [
      {
        "id": "spinnaker",
        "cardCode": "MOD-01",
        "name": "Spinnaker",
        "class": "rigging",
        "fits": [
          "ship",
          "barge"
        ],
        "madeAt": "weaver",
        "specialist": "weaver",
        "inputs": [
          {
            "commodity": "fine-cloth",
            "qty": 4
          },
          {
            "commodity": "rope",
            "qty": 3
          },
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "effortHours": 6,
        "baseValue": 160,
        "massKg": 40,
        "effect": "+2 hexes on any leg run with the wind - which at sea means any leg that is not into a storm. Cancel the bonus in a Storms at Sea round: the spinnaker is the first thing struck, and a skipper who leaves it up loses it.",
        "story": "An enormous belly of dyed cloth flown from the bow, and the reason the western packet run is a day and a half rather than three. Setting it is a two-person job; getting it down in a squall is a four-person job, and the fourth person is usually the one who wanted it up."
      },
      {
        "id": "sweep-rig",
        "cardCode": "MOD-02",
        "name": "Sweep Rig",
        "class": "rigging",
        "fits": [
          "airship"
        ],
        "madeAt": "carpenter",
        "specialist": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 4
          },
          {
            "commodity": "fine-cloth",
            "qty": 3
          },
          {
            "commodity": "rope",
            "qty": 4
          },
          {
            "commodity": "ironware",
            "qty": 2
          }
        ],
        "effortHours": 9,
        "baseValue": 240,
        "massKg": 120,
        "effect": "A fixed upper beam and a hinged lower one down each flank, worked by the crew: treat any Foul or Contrary wind roll as Contrary at full speed, for 1 extra crew fed that round. It cannot beat the wind - it can refuse to be beaten by it.",
        "story": "Sail is a wing when there is wind and a bedsheet when there is not. Hinge the bottom spar, put eight strong people on the handles, and the bedsheet becomes an oar. It sounds like a mill and looks like a lunatic's drawing, and it is the reason the Vossgard mail arrives in a headwind."
      },
      {
        "id": "copper-sheathing",
        "cardCode": "MOD-03",
        "name": "Copper Sheathing",
        "class": "hull",
        "fits": [
          "ship",
          "barge"
        ],
        "madeAt": "harbour",
        "specialist": "smith",
        "inputs": [
          {
            "commodity": "copper",
            "qty": 6
          },
          {
            "commodity": "ironware",
            "qty": 2
          }
        ],
        "effortHours": 8,
        "baseValue": 300,
        "massKg": 400,
        "effect": "+1 hex per leg, permanently - a foul bottom is a slow bottom. The hull takes no damage from reef, ice or grounding, and worms and rot never touch her.",
        "story": "Plate the whole underbody in copper below the waterline and she comes out of a year's trading as clean as she went in. It costs what a small farm costs. Every owner who has paid it says the same thing, which is that they should have paid it sooner."
      },
      {
        "id": "iron-ram",
        "cardCode": "MOD-04",
        "name": "Iron Ram",
        "class": "hull",
        "fits": [
          "ship"
        ],
        "madeAt": "harbour",
        "specialist": "smith",
        "inputs": [
          {
            "commodity": "ironware",
            "qty": 4
          },
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 3
          }
        ],
        "effortHours": 7,
        "baseValue": 210,
        "massKg": 900,
        "effect": "+3 combat dice in the first round of any battle at sea, attacking only. -1 hex per leg, always: it is a great deal of iron a long way forward.",
        "story": "A beak of forged iron scarfed onto the stem below the waterline. It is not subtle and it is not a deterrent, because nobody can see it until the moment it stops being relevant."
      },
      {
        "id": "storm-shutters",
        "cardCode": "MOD-05",
        "name": "Storm Shutters",
        "class": "hull",
        "fits": [
          "ship",
          "barge",
          "airship",
          "train"
        ],
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 3
          },
          {
            "commodity": "leather",
            "qty": 2
          },
          {
            "commodity": "ironware",
            "qty": 1
          }
        ],
        "effortHours": 4,
        "baseValue": 85,
        "massKg": 60,
        "effect": "Cargo aboard loses nothing to weather: ignore every cargo-loss effect from a weather or disaster event card. The vehicle itself still takes its damage.",
        "story": "Hinged boards and oiled hide over every opening, dogged down by a crew who have learned the hard way what a following sea does to an open hatch. Cheap, ugly, and the difference between a bad round and a ruinous one."
      },
      {
        "id": "ice-runners",
        "cardCode": "MOD-06",
        "name": "Ice Runners",
        "class": "running-gear",
        "fits": [
          "cart",
          "caravan",
          "sled"
        ],
        "madeAt": "blacksmith",
        "specialist": "smith",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 2
          },
          {
            "commodity": "lumber",
            "qty": 2
          }
        ],
        "effortHours": 5,
        "baseValue": 130,
        "massKg": 70,
        "effect": "Shod runners that swap for the wheels in an hour. While the winter rule in travel.json is in force the vehicle moves at sled speeds; the rest of the year it is 70 kg of steel in the bed and does nothing at all.",
        "story": "The Varl wagonrows carry them from the first frost, and unbolt them the week the thaw starts - a week early, every year, and every year somebody argues."
      },
      {
        "id": "compound-boiler",
        "cardCode": "MOD-07",
        "name": "Compound Boiler",
        "class": "powerplant",
        "fits": [
          "train",
          "ship",
          "airship"
        ],
        "madeAt": "steelworks",
        "specialist": "engineer",
        "inputs": [
          {
            "commodity": "steel",
            "qty": 4
          },
          {
            "commodity": "copper",
            "qty": 3
          },
          {
            "commodity": "ironware",
            "qty": 2
          }
        ],
        "effortHours": 12,
        "baseValue": 420,
        "massKg": 800,
        "effect": "Uses the same steam twice. Halve the vehicle's fuel per leg, rounded up, and +1 hex per leg. It is delicate: on any hazard or battle result, roll d6 and on a 1 the boiler is out until repaired at a steelworks.",
        "story": "Havik Coalbrand's own drawing, and he will explain it to you at length: the steam leaves the high-pressure cylinder with most of its temper intact, so you give it a second, larger cylinder to lose that temper in. Half the coal, more speed, and one more thing to go wrong in a tunnel."
      },
      {
        "id": "keelbound",
        "cardCode": "MOD-08",
        "name": "Keelbound",
        "class": "enchantment",
        "element": "water",
        "fits": [
          "ship",
          "barge"
        ],
        "madeAt": "alchemist",
        "manaCost": 5,
        "effortHours": 0,
        "baseValue": 0,
        "massKg": 0,
        "effect": "She will not sink. A damage bar that fills leaves her swamped to the gunwales on her hex instead of wrecked - cargo is lost, the crew are not, and one round of repairs at any harbour has her afloat. Once used, the binding is spent and the card comes off.",
        "story": "Bound into the keel timber before she is planked, which means it is nearly always done to a new hull and nearly never to an old one. Insurers ask. Insurers charge less when the answer is yes."
      },
      {
        "id": "fleetfoot-binding",
        "cardCode": "MOD-09",
        "name": "Fleetfoot Binding",
        "class": "enchantment",
        "element": "air",
        "fits": [
          "any"
        ],
        "madeAt": "alchemist",
        "manaCost": 4,
        "effortHours": 0,
        "baseValue": 0,
        "massKg": 0,
        "effect": "+2 hexes on every day leg, whatever the mode and whatever the ground. An airship instead re-rolls one wind roll per journey.",
        "story": "Four mana of moving air laid along the axle, the keel, the rail or the traces, depending on what you are enchanting and how patient the alchemist is. The oldest and most-copied binding in the book, and still the one every carter asks for first."
      },
      {
        "id": "warded-hold",
        "cardCode": "MOD-10",
        "name": "Warded Hold",
        "class": "enchantment",
        "element": "earth",
        "fits": [
          "any"
        ],
        "madeAt": "alchemist",
        "manaCost": 4,
        "effortHours": 0,
        "baseValue": 0,
        "massKg": 0,
        "effect": "Nothing is taken from this vehicle that its owner did not hand over. Cancel every theft, robbery, piracy and heist card aimed at its cargo. A boarder who wins a battle may still take the vehicle entire - the ward is on the hold, not on the owner.",
        "story": "The lids stick. That is all a ward looks like from outside: crates that will not open for the wrong hands, and a thief standing in a hold full of goods getting increasingly upset with a crowbar."
      },
      {
        "id": "salamander-grate",
        "cardCode": "MOD-11",
        "name": "Salamander Grate",
        "class": "enchantment",
        "element": "fire",
        "fits": [
          "train",
          "ship",
          "airship"
        ],
        "madeAt": "alchemist",
        "manaCost": 6,
        "specialist": "alchemist",
        "effortHours": 0,
        "baseValue": 0,
        "massKg": 0,
        "effect": "The firebox burns without fuel: the vehicle pays no fuel per leg, ever. It also never runs cold - the vehicle may take a night leg with no light, because the glare from the grate is light enough.",
        "story": "A cast grate with something bound under it that was never quite alive and is now definitely not dead. Firemen on a grated engine have nothing to do but watch it, and they mostly do not."
      }
    ]
  },
  "components": {
    "$comment": "How a physical game element is built - stated once, here, and pointed at from everywhere that draws one. This file holds no content: no card says anything here, no monster is named here. It says what shape a card is, where its bars hang, how thick the frame is drawn, what a deck's back looks like. tools/build-cards.mjs reads it instead of carrying those numbers in its head, which is the point: change the corner radius here and the fronts, the backs, the print sheet and the explorer previews all move together. Adding a deck is an entry under `decks` plus its content file - not a new set of numbers copied out of this one. See docs/design/08-components.md for the bill of materials and docs/art/06-components.md for why each convention is what it is.",
    "version": "0.1.0",
    "$structure": {
      "$comment": "The tiny type system this file uses, so the next thing that reads it does not have to guess. Every length is in millimetres unless the key says otherwise. A `ref` is a dotted path into this file or another dataset, and means 'use that definition, do not restate it'.",
      "units": "mm for anything physical, grid units for anything drawn (see stock.unitsPerMm)",
      "ref": "dotted path, resolved against data/ - e.g. arcana.elements[].mark"
    },
    "stock": {
      "$comment": "The physical card. 63 x 88 mm is the standard playing-card size the print page promises, and 3.5 mm is the corner radius a deck of cards actually has - cards are not cut square, and a card drawn square looks like a proof rather than a card. Everything is drawn at 8 units per millimetre, so the numbers in a generated SVG are whole and a millimetre is never a rounding error.",
      "card": {
        "widthMm": 63,
        "heightMm": 88,
        "bleedMm": 3,
        "cornerRadiusMm": 3.5,
        "safeMarginMm": 4
      },
      "unitsPerMm": 8
    },
    "frame": {
      "$comment": "The timber-and-iron border every card in every deck carries, from docs/art/06-components.md. Insets are from the trim edge, in grid units. Both rules follow the card's corner, one radius inside the other, or the frame reads as a square box floating in a rounded card.",
      "outer": {
        "inset": 8,
        "strokeWidth": 4
      },
      "inner": {
        "inset": 16,
        "strokeWidth": 1.2
      },
      "rivets": {
        "inset": 15,
        "radius": 3.6
      }
    },
    "bars": {
      "$comment": "The vertical numbered bars. Harm always left, capacity always right - the convention is load-bearing across four decks and is stated in docs/art/06-components.md. A bar is numbered from the bottom and walked by a token. `maxCells` is the most rungs the edge will hold; `steps` is the ladder of step sizes a scale may choose from, smallest first, so a 100-bulk hold still fits a walkable bar.",
      "width": 30,
      "maxCells": 14,
      "steps": [
        1,
        2,
        5,
        10,
        20,
        50
      ],
      "harm": {
        "edge": "left",
        "ink": "oxide",
        "inkPlateMark": "notch-down",
        "never": "skip-counts - a harm track is always step 1"
      },
      "capacity": {
        "edge": "right",
        "ink": "slate"
      },
      "arcaneCapacity": {
        "edge": "right",
        "ink": "bruise",
        "note": "mana bars only - mana is an arcane subject"
      },
      "inboard": {
        "note": "A second capacity comes in over the portrait and lays its own paper first.",
        "offsetFromRight": 104
      }
    },
    "marks": {
      "$comment": "Drawn marks that are not pictures: they are read, like letters, and so they are held to one grid and one weight wherever they appear. The path data is not here - it belongs to the thing the mark is of. This says how to draw it.",
      "element": {
        "pathsFrom": "arcana.elements[].mark",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "strokeWidth": 2,
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "sizes": {
          "chit": 12,
          "card": 20,
          "plate": 40,
          "$note": "millimetres; draw for the smallest"
        },
        "onCard": {
          "$comment": "The element badge on a card that has an element: the mark on the ink plate, a disc of the element's ink behind it on the wash. The badge is a ring, not a filled disc, so it does not read as the commodity frame in docs/art/04-iconography.md.",
          "radius": 22,
          "washOpacity": 0.5,
          "insetInDisc": 0.78,
          "$insetNote": "The mark is authored edge to edge on its 24-grid. Inside a disc it is scaled down about the centre by this much, or the ends of the ground line run off the ring - which is what a mark drawn to a square and dropped in a circle always does."
        }
      }
    },
    "$deckKeys": {
      "$comment": "What each deck entry means. plateId is the template that turns a card into the name of the plate it needs - {id} and {cardCode} are fields of the card, |lower lowercases. It lives here rather than in the tools because three different tools need to agree on it: the card builder looks for the plate, the mint queue reports which are missing, and the art prompts are filed under exactly these names. minting says whether this deck is in the mint queue yet; a deck with minting false is declared, numbered and backed, and simply not being illustrated this month.",
      "prefix": "the card code prefix - see vehicles.json cardIdScheme",
      "plateId": "template for the render filename under docs/art/renders/, without the .png",
      "promptFile": "which file in docs/art/prompts/ holds this deck's briefs",
      "plateFormat": "the page the artist draws - see docs/art/09-framing-and-composition.md",
      "minting": "true if tools/mint-queue.mjs should chase this deck's missing plates",
      "back": "how this deck's card back is drawn - word, motif and ink"
    },
    "decks": [
      {
        "prefix": "CHR",
        "plateId": "character-{cardCode|lower}",
        "promptFile": "characters.md",
        "plateFormat": "A4 portrait",
        "minting": true,
        "id": "characters",
        "name": "Characters",
        "source": "characters.json",
        "back": {
          "word": "CHARACTERS",
          "motif": "rivet",
          "ink": "ochre"
        }
      },
      {
        "prefix": "VEH",
        "plateId": "vehicle-{cardCode|lower}",
        "promptFile": "vehicles.md",
        "plateFormat": "A4 landscape, 3:2",
        "minting": true,
        "id": "vehicles",
        "name": "Vehicles",
        "source": "vehicles.json",
        "back": {
          "word": "VEHICLES",
          "motif": "wheel",
          "ink": "slate"
        }
      },
      {
        "prefix": "MON",
        "plateId": "monster-{id}",
        "promptFile": "monsters.md",
        "plateFormat": "A4 portrait",
        "minting": true,
        "id": "monsters",
        "name": "Monsters",
        "source": "monsters.json",
        "back": {
          "word": "MONSTERS",
          "motif": "eye",
          "ink": "oxide"
        }
      },
      {
        "prefix": "TAL",
        "plateId": "talisman-{cardCode|lower}",
        "promptFile": "talismans.md",
        "plateFormat": "square",
        "minting": true,
        "id": "talismans",
        "name": "Talismans",
        "source": "items.json",
        "filter": "class == talisman",
        "back": {
          "word": "TALISMANS",
          "motif": "rayed",
          "ink": "bruise"
        }
      },
      {
        "prefix": "MOD",
        "plateId": "modification-{id}",
        "promptFile": "modifications.md",
        "plateFormat": "square",
        "minting": true,
        "id": "modifications",
        "name": "Modifications",
        "source": "modifications.json",
        "back": {
          "word": "MODIFICATIONS",
          "motif": "wheel",
          "ink": "verdigris"
        }
      },
      {
        "prefix": "SPL",
        "plateId": "spell-{id}",
        "promptFile": "spells.md",
        "plateFormat": "square",
        "minting": false,
        "id": "spells",
        "name": "Spells",
        "source": "arcana.json",
        "back": {
          "word": "SPELLS",
          "motif": "rayed",
          "ink": "bruise"
        }
      },
      {
        "prefix": "EVT",
        "plateId": "event-{id}",
        "promptFile": "events.md",
        "plateFormat": "landscape scene",
        "minting": false,
        "id": "events",
        "name": "Events",
        "source": "events.json",
        "back": {
          "word": "EVENTS",
          "motif": "rivet",
          "ink": "oxide"
        }
      },
      {
        "prefix": "QST",
        "plateId": "quest-{id}",
        "promptFile": "quests.md",
        "plateFormat": "landscape scene",
        "minting": false,
        "id": "quests",
        "name": "Quests",
        "source": "quests.json",
        "back": {
          "word": "QUESTS",
          "motif": "rivet",
          "ink": "ochre"
        }
      },
      {
        "prefix": "ITM",
        "plateId": "item-{id}",
        "promptFile": "items.md",
        "plateFormat": "square",
        "minting": false,
        "id": "items",
        "name": "Items",
        "source": "items.json",
        "back": {
          "word": "ITEMS",
          "motif": "rivet",
          "ink": "slate"
        }
      }
    ],
    "back": {
      "$comment": "One back per deck, so a face-down stack is identifiable across the table without turning a card over. The design is a single word - the deck's name - mirrored across the card's horizontal centre line, so the back has no up and no down: a card dealt either way round reads the same, which is what a back is for. The word is the identification; the ink and the motif are the fast read at arm's length, before anyone is close enough to spell anything.",
      "symmetry": "horizontal - the word and its mirror meet at the card's centre line",
      "wordFontSizeMm": 5.5,
      "wordTracking": 0.34,
      "lathe": {
        "$comment": "The engine-turned ground behind the word, the way a banknote or a playing card back has one. Drawn on the ink plate at hairline weight so the back survives the black-and-white edition, and drawn from the card's own centre so it is symmetrical for free.",
        "rings": 9,
        "rays": 48,
        "strokeWidth": 0.55,
        "opacity": 0.5
      },
      "motifs": {
        "$comment": "The mark in the roundel at the card's centre, on the axis of symmetry - so it is mirrored by construction rather than by luck. Drawn on the same 24-grid as the element marks. A motif is a deck's fast read; it says nothing about the individual card, because a back that varies is a marked card.",
        "rivet": "M12 3.2a8.8 8.8 0 1 0 .001 0zM12 7.6a4.4 4.4 0 1 0 .001 0zM12 3.2V7.6M12 16.4V20.8M3.2 12H7.6M16.4 12H20.8",
        "wheel": "M12 2.6a9.4 9.4 0 1 0 .001 0zM12 8.6a3.4 3.4 0 1 0 .001 0zM12 2.6V8.6M12 15.4V21.4M2.6 12H8.6M15.4 12H21.4M5.35 5.35 9.6 9.6M14.4 14.4l4.25 4.25M18.65 5.35 14.4 9.6M9.6 14.4 5.35 18.65",
        "eye": "M2.4 12s4.1-6.2 9.6-6.2S21.6 12 21.6 12s-4.1 6.2-9.6 6.2S2.4 12 2.4 12zM12 8.4a3.6 3.6 0 1 0 .001 0zM12 2.6V5M12 19V21.4",
        "rayed": "M12 2.4V21.6M2.4 12H21.6M5.2 5.2 18.8 18.8M18.8 5.2 5.2 18.8M12 8.2a3.8 3.8 0 1 0 .001 0z"
      }
    },
    "tokens": {
      "$comment": "Round board tokens - the generic ones, which is all of them. A commodity's identity lives on its card; the token on the board only has to say which commodity family it belongs to and be findable in a heap. 18 mm is the chit tier in docs/art/04-iconography.md: silhouette and frame only. `engravable` marks the ones that are meant to survive being cut on a laser rather than printed - which means the mark has to work as a single-depth engraving with no tint at all.",
      "commodity": {
        "diameterMm": 18,
        "shape": "round",
        "engravable": true,
        "carries": "the commodity family's mark and hatch, never a number"
      },
      "deposit": {
        "diameterMm": 18,
        "shape": "round",
        "engravable": true,
        "carries": "the deposit's mark on one face, its yield on the other - deposits differ, see data/deposits.json tokenYields"
      },
      "bar": {
        "diameterMm": 7,
        "shape": "round",
        "engravable": false,
        "carries": "nothing - it is the marker that walks a card's bar"
      }
    }
  },
  "mint": {
    "$comment": "The mint: how a thing that is declared in data/ becomes a finished artefact on the table. It is a multi-tool, not a card tool. One entry under `lines` per KIND of thing being minted - cards today, maps today, tiles when they come back - and each line says the same four things: where its subjects come from, where its briefs live, what a plate has to be, and what ties the plate back to the data. tools/lib/mint.mjs reads this and knows how to enumerate and probe each line; tools/mint-queue.mjs turns that into docs/art/mint/QUEUE.md. The prose version, with the handover and who does what, is docs/MINT.md.\n\nThis file holds no content: no card is named here, no map is described here. It says what a line IS. A line's subjects live in their own files, exactly as a card's words live in the card's own file.",
    "version": "0.1.0",
    "$structure": {
      "$comment": "The tiny type system this file uses, so the next tool that reads it does not have to guess.",
      "path": "a repository-relative path, always with forward slashes and never with a leading ./",
      "dottedPath": "a path into a subject object - `commission.plate.minWidthPx` - used by the *Requires lists, which tools/lib/mint.mjs checks for real",
      "status": "active | shelved. A shelved line is declared, reported by the queue every run, and chased by nobody. It carries `issue`, so the reason is one click away and is never re-litigated from memory."
    },
    "steps": {
      "$comment": "Every line is minted in the same four steps, because the split that matters is the same one every time: somebody who can write and cannot draw hands over to somebody who can draw and does not know the rules, and then the drawing has to be tied back to the data before anything can be built from it. Only the third step's NAME changes between lines - a card is framed, a map is traced - and a line says which under `aim`.\n\nA subject's step is COMPUTED from the repository, never stored. There is no board to fall out of date because there is no board: commit a PNG and the subject moves to step 3 by itself.",
      "order": [
        "write",
        "draw",
        "aim",
        "minted"
      ],
      "write": {
        "name": "WRITE",
        "owner": "designer",
        "test": "the subject exists in data/ and its brief does not",
        "produces": "a complete generation brief, filed under the plate's own id"
      },
      "draw": {
        "name": "DRAW",
        "owner": "artist",
        "test": "the brief exists and the plate does not",
        "produces": "one image file, at the line's declared format and minimum width"
      },
      "aim": {
        "name": "AIM",
        "owner": "whoever accepts the plate",
        "test": "the plate exists and nothing in data/ says how to read it",
        "produces": "the tie between the plate and the data - see each line's `aim`"
      },
      "minted": {
        "name": "MINTED",
        "owner": "-",
        "test": "all three, and the build tools draw the thing",
        "produces": "nothing further; the artefact is generated from here on"
      }
    },
    "handover": {
      "$comment": "The mint runs on a pull request, and the notification protocol is three greppable prefixes. They are prefixes on purpose: an agent subscribed to the thread can ignore everything else in it. The comments are a NOTIFICATION, not a state machine - if one is missed, dropped, posted twice or posted out of order, the next run of tools/mint-queue.mjs still produces the correct worklist. See docs/MINT.md.",
      "branch": "mint/{run}",
      "prefixes": {
        "request": "MINT REQUEST",
        "ready": "PLATE READY",
        "rejected": "PLATE REJECTED"
      },
      "onePerSubject": true,
      "briefPastedInFull": true,
      "$briefNote": "The prompt goes into the comment complete - preamble, subject, negative prompt and the line's aim block. The artist should never have to assemble a prompt out of three files, and a prompt that was actually used is worth having in the thread verbatim."
    },
    "lines": [
      {
        "id": "cards",
        "name": "Cards",
        "status": "active",
        "subject": "one card in one of the adventure decks",
        "unit": "card",
        "groupLabel": "Deck",
        "subjectsFrom": {
          "kind": "decks",
          "file": "components.json",
          "collection": "decks",
          "$note": "A deck says where its cards live (`source`), what its plates are called (`plateId`), which prompt file briefs them (`promptFile`) and whether it is being minted at all (`minting`). The mint does not restate any of it."
        },
        "subjectRequires": [
          "cardCode",
          "name"
        ],
        "brief": {
          "dir": "docs/art/prompts",
          "fileFrom": "deck.promptFile",
          "headingIs": "plateId",
          "$note": "A brief is an `## <plate-id>` section in the deck's prompt file. The heading IS the plate id, which is what lets the queue find it without anybody filing an index."
        },
        "plate": {
          "dir": "docs/art/renders",
          "ext": ".png",
          "idFrom": "components.decks[].plateId",
          "formatFrom": "components.decks[].plateFormat",
          "minLongSidePx": 4000,
          "$minLongSideNote": "What the prompt files ask for: 4000 px on the LONG side, which is the height on a portrait plate and the width on a landscape one. The plates accepted so far are 1055-1536 px and do not meet it; the queue says so in one line rather than thirty, because it is one decision - re-render for print, or accept that these are screen plates - and not thirty findings.",
          "frozenWording": "docs/art/renders/{plate}.txt"
        },
        "aim": {
          "step": "FRAME",
          "owner": "whoever accepts the plate",
          "file": "docs/art/framing.json",
          "at": "plates",
          "produces": "a `subject` box, a `focal` point and a one-line `note`",
          "contract": "docs/art/09-framing-and-composition.md",
          "$note": "A plate is a whole drawn page and a card window is not that shape, so something is thrown away. `subject` is the veto - what may not be cut. `focal` is the aim - the one point the picture is of. Without an entry the card is cropped on the middle of the page, which is what put a character's chin on the top edge of their own card."
        },
        "builds": [
          "docs/cards/ - tools/build-cards.mjs",
          "docs/data/bundle.js thumbnails - tools/build-data.mjs"
        ],
        "checks": [
          "node tools/validate-data.mjs",
          "node tools/validate-art.mjs",
          "node tools/build-cards.mjs --check"
        ]
      },
      {
        "id": "maps",
        "name": "Maps",
        "status": "active",
        "subject": "one drawn map plate, and the hex board read off it",
        "unit": "map",
        "groupLabel": "Grid",
        "subjectsFrom": {
          "kind": "directory",
          "dir": "maps",
          "ext": ".json",
          "$note": "One file per map, picked up from the directory rather than from an index, exactly as the bundler does it - adding the next map is one new file and no edit anywhere else."
        },
        "subjectRequires": [
          "id",
          "name",
          "summary",
          "commission.why",
          "commission.landmass",
          "commission.terrainBudget",
          "commission.settlements",
          "commission.plate.minWidthPx",
          "grid.cols",
          "grid.rows",
          "legend"
        ],
        "$subjectRequiresNote": "The COMMISSION contract: what a map file must say before anybody is asked to draw it. A commission is the map's brief-in-data - what the map is for, what country it is, what the terrain budget is, how many settlements of what rank - and it is checked for real by tools/lib/mint.mjs, so an under-specified commission is a queue error rather than a surprise three weeks later.",
        "brief": {
          "dir": "docs/art/prompts",
          "file": "maps.md",
          "headingIs": "map id",
          "$note": "One `## <map-id>` section per commissioned map, holding the complete prompt: the shared preamble, the subject paragraph written from `commission`, the negative prompt, and the TRACEABILITY block. Same shape as a deck's prompt file; the heading is the map id because a map's plate is named after the map."
        },
        "plate": {
          "dir": "docs/map",
          "ext": ".png",
          "idFrom": "the map's own id",
          "format": "landscape, root-two (1.414) inside a plain frame with a visible inner rule",
          "minLongSidePx": 4000,
          "wantLongSidePx": 7000,
          "frozenWording": "docs/map/{plate}.txt",
          "$widthNote": "The plate's width is the hard limit on print quality and it is the one property that cannot be recovered later: a coastline can be re-traced and a legend can be drawn over, but pixels that were never drawn are gone. 4000 px is a working minimum; A1 wants 7000. Ask for the width before anything else.",
          "$gridNote": "NEVER ask for a grid on the plate. The grid is an overlay drawn from the board; one baked into the artwork cannot be moved, cannot be resized when cols changes, and will not line up with the one the tools draw."
        },
        "aim": {
          "step": "TRACE",
          "owner": "designer",
          "file": "data/maps/{id}.json",
          "at": "rows",
          "produces": "the measured `plate` block and a full `rows` board, hand-corrected against the proof sheet",
          "contract": "docs/map/README.md",
          "$note": "The map equivalent of framing a card. A card's plate is tied to its data by a subject box; a map's plate is tied to its data by the board read off it - the same job, which is why it is the same step. tools/trace-map.mjs proposes rows by sampling the artwork and tools/build-map.mjs renders the proof sheet you correct them against. Expect three or four rounds; it is not optional."
        },
        "boardRequires": [
          "plate.file",
          "plate.width",
          "plate.height",
          "plate.field",
          "rows",
          "settlements",
          "regions",
          "print"
        ],
        "$boardRequiresNote": "The OUTPUT contract: what the map file must say before the map counts as minted. Checked by tools/lib/mint.mjs; the semantics underneath - no deep water against a beach, no harbour inland, no rail across an unbridged river - are checked by tools/validate-map.mjs.",
        "builds": [
          "docs/map/{id}-proof.png - tools/build-map.mjs, git-ignored, for review",
          "the derived print sizes in `print.presets` - tools/build-map.mjs",
          "docs/data/bundle.js - tools/build-data.mjs, which is what docs/map/ reads"
        ],
        "checks": [
          "node tools/validate-map.mjs",
          "node tools/build-map.mjs {id} --check",
          "node tools/trace-map.mjs {id} --diff"
        ]
      },
      {
        "id": "tiles",
        "name": "Tiles",
        "status": "shelved",
        "issue": 18,
        "issueUrl": "https://github.com/cdomotor-g/game1/issues/18",
        "subject": "one printed hex tile face, and the zoom-in sheet behind it",
        "unit": "tile",
        "groupLabel": "Series",
        "shelvedNote": "The tile-based board - 61 double-sided hex tiles dealt face down, and the Holdings / Grounds / Places zoom-in sheets in docs/minimaps/ - is paused, not cancelled. Nothing is deleted: the 32 accepted sheets stay committed and stay on the site, and terrain.json keeps boardSetup. It comes back as a GAME SET (#10): a table would pick either a plate set, where one drawn map is hexed and the world is known, or a tile set, where the board is a bag and the world is unknown until walked. Both feed the same terrain vocabulary and the same move costs, which is the test of whether #10 drew its line in the right place.",
        "whenItReturns": [
          "#10 has drawn the core/set line and a set can supply a board",
          "the tile art contract is written: edge continuity across butted tiles, an unexplored back that gives nothing away, the deposit slot",
          "this line's status flips to active and `subjectsFrom` is filled in"
        ],
        "existingWork": [
          "docs/minimaps/ - 32 accepted sheets: 4 Holdings, 9 Grounds, 19 Places",
          "docs/art/06-components.md - the 60 mm hex tile face and back",
          "docs/design/08-components.md - 61 tiles in the bill of materials",
          "data/terrain.json - boardSetup.terrainMix, recommendedTiles, faceDownAtStart"
        ]
      }
    ]
  },
  "maps": [
    {
      "$comment": "The Korvane Reach: a drawn map, hexed. The artwork in docs/map/korvane-reach.png is the plate; everything a program needs to know about what is ON that plate is in this file. 'rows' is the board — one string per grid row, one character per hex, decoded through 'legend'. Edit it by hand: it is a picture of the map you can read in a text editor, and it diffs like one. tools/trace-map.mjs proposes rows by sampling the plate; it never rewrites them unless asked.",
      "version": "0.1.0",
      "id": "korvane-reach",
      "name": "The Korvane Reach",
      "subtitle": "a true charting of the free lands, the ember coast & the rimeward marches",
      "summary": "A north-facing continent map: an ice waste along the top edge and a second one across the northern bay, a temperate wooded west, a dry ochre south, and a mountain spine running south-east from the western sea to the eastern shore.",
      "commission": {
        "$comment": "The commission: what this map was for, written out after the fact. The Korvane Reach predates the map mint (docs/MINT.md) and this block is what its commission WOULD have said - it is here because a contract nobody has ever written a real example of is a contract nobody can follow. data/mint.json lines.maps.subjectRequires is the checkable half of it; tools/mint-queue.mjs fails the queue if a commissioned map is missing any of it.",
        "why": "The first board: one drawn continent big enough to hold a full campaign, hexed, with enough coast and enough interior that both the shipping half and the rail half of the economy have somewhere to happen.",
        "landmass": "One north-facing continent filling most of the frame, open sea on the north, west and east edges, a deeply indented coastline with offshore islands, and a mountain spine running south-east from the western sea to the eastern shore.",
        "terrainBudget": [
          {
            "terrain": "deep-water",
            "share": 0.29
          },
          {
            "terrain": "shallow-water",
            "share": 0.17
          },
          {
            "terrain": "grassland",
            "share": 0.11
          },
          {
            "terrain": "tundra",
            "share": 0.1
          },
          {
            "terrain": "coast",
            "share": 0.08
          },
          {
            "terrain": "mountain",
            "share": 0.08
          },
          {
            "terrain": "forest",
            "share": 0.08
          },
          {
            "terrain": "desert",
            "share": 0.07
          },
          {
            "terrain": "marsh",
            "share": 0.02
          },
          {
            "terrain": "hills",
            "share": 0.01
          }
        ],
        "$terrainBudgetNote": "Shares of the whole grid, water included, as built. A budget is an aim for the artist and a sanity check afterwards, never a rule: a drawn continent is not a shuffled tile bag. tools/validate-map.mjs reports the finished board against boardSetup.terrainMix in data/terrain.json for the same reason - a map with a quarter of the hills the rules assume is a map where iron is scarce, and that is worth knowing before anyone plays on it. This map is one of those: 0.8% hills against the 8% the rules assume.",
        "settlements": {
          "count": 19,
          "seat": 1,
          "city": 2,
          "town": 11,
          "village": 5,
          "harbours": 4
        },
        "routes": {
          "rail": true,
          "shipping": true,
          "road": true
        },
        "mustHave": [
          "an ice waste along the top edge and a second across the northern bay",
          "a temperate wooded west and a dry ochre south",
          "two rail lines meeting at one inland seat",
          "at least four harbours, spread around the coast"
        ],
        "mustNotHave": [
          "a hex grid, a square grid, or any ruled lines on the artwork",
          "hillshading, relief shading or contour lines",
          "map furniture over a coastline - cartouche, legend and compass all sit over water"
        ],
        "plate": {
          "minWidthPx": 4000,
          "wantWidthPx": 7000,
          "aspect": "root-two landscape"
        },
        "$plateNote": "Not met. This plate arrived at 1491 px, which cost the two larger print presets - see docs/map/README.md. It is the one property of a plate that cannot be recovered later, and it is in the contract now because of this map."
      },
      "plate": {
        "file": "korvane-reach.png",
        "$fileNote": "Relative to docs/map/. The artwork is committed as supplied and is never re-encoded by any tool here — the hex grid is an overlay drawn on top of it, not a change to it.",
        "width": 1491,
        "height": 1055,
        "field": {
          "x": 19,
          "y": 17,
          "width": 1454,
          "height": 1020
        },
        "$fieldNote": "The drawn map inside the printed frame, in plate pixels. Measured from the inner frame rule. Everything else in this file that talks about position is a fraction of this rectangle, so the data survives the plate being redrawn at another resolution.",
        "occlusions": [
          {
            "id": "title",
            "name": "Title cartouche",
            "x": 0.013,
            "y": 0.769,
            "width": 0.305,
            "height": 0.189
          },
          {
            "id": "legend",
            "name": "Legend panel",
            "x": 0.771,
            "y": 0.741,
            "width": 0.221,
            "height": 0.237
          },
          {
            "id": "compass",
            "name": "Compass rose",
            "x": 0.009,
            "y": 0.389,
            "width": 0.123,
            "height": 0.196
          }
        ],
        "$occlusionNote": "Map furniture drawn over the map field. Hexes under these take their terrain from their unoccluded neighbours rather than from the pixels, because the pixels are cartouche, not country."
      },
      "grid": {
        "shape": "hex",
        "orientation": "pointy",
        "offset": "odd-r",
        "cols": 32,
        "rows": 26,
        "fit": "field-width",
        "$fitNote": "The flat-to-flat width of a hex is exactly field.width / cols, and the grid is centred on the field, so it overhangs the top and bottom edges by about half a percent. Choosing 32 columns is the one real judgement call on this map: it puts every named settlement in a hex of its own, which 15 columns did not, and keeps a hex at roughly two mountain glyphs across so the ranges survive as ranges instead of collapsing to a single tile.",
        "leaguesAcrossFlats": 22,
        "$leagueNote": "Fiction, not a rule — nothing in data/rules.json is denominated in leagues. The plate this figure was read off carried a scale bar; the plate now in docs/map does not, so the number is inherited rather than measured and can be reset the day a plate draws a bar again."
      },
      "print": {
        "$comment": "Sheet layouts for printing the plate at table size. Each preset tiles the whole plate — decorative frame included, because the frame is part of the drawing — across a grid of A4 sheets with a margin every printer can manage, then scales it to the largest size that fits without cropping and without distorting it. mapWidthMm, mapHeightMm and hexAcrossFlatsMm are derived from that and rewritten by tools/build-map.mjs; they are stored here so the numbers are greppable and so a change to the geometry shows up as a diff.",
        "default": "four-sheet",
        "presets": [
          {
            "id": "four-sheet",
            "name": "Four sheets, A2",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 2,
            "sheetRows": 2,
            "marginMm": 8,
            "overlapMm": 0,
            "mapWidthMm": 548.3,
            "mapHeightMm": 388,
            "hexAcrossFlatsMm": 16.7,
            "note": "Two by two, printed landscape. 548 x 388 mm finished — A2, near enough — with 16.7 mm hexes. This replaced a 3 x 2 portrait layout on six sheets, which printed 6% bigger and left 83 mm of every page blank below the map: a landscape A4 inside an 8 mm margin is 281 x 194 mm, aspect 1.448, and the plate is 1.414, so the two nest almost exactly and any square grid of landscape sheets fills the paper. Three portrait sheets across is aspect 1.036 and does not. See the one- and nine-sheet presets: same window, same margins, 1, 2 and 3 sheets to a side."
          },
          {
            "id": "nine-sheet",
            "name": "Nine sheets, A1",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 3,
            "sheetRows": 3,
            "marginMm": 8,
            "overlapMm": 0,
            "mapWidthMm": 822.5,
            "mapHeightMm": 582,
            "hexAcrossFlatsMm": 25.1,
            "note": "Three by three, printed landscape. 822 x 582 mm — A1, near enough — with 25 mm hexes you can stand a figure in. The plate holds 1491 pixels across, so this prints at 46 dpi: the geometry is right and the artwork is not there to fill it. Treat it as a layout waiting on a larger plate rather than one to send to paper today."
          },
          {
            "id": "one-sheet",
            "name": "One sheet, reference",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 1,
            "sheetRows": 1,
            "marginMm": 8,
            "overlapMm": 0,
            "mapWidthMm": 274.2,
            "mapHeightMm": 194,
            "hexAcrossFlatsMm": 8.4,
            "note": "The whole plate on one page at 138 dpi, which is the only preset the current artwork has the pixels for. 8.4 mm hexes are too small to play on and perfectly good for the ring binder."
          }
        ]
      },
      "legend": {
        "$comment": "Character to terrain id, for the 'rows' block. Every id here must exist in data/terrain.json — that is checked by tools/validate-map.mjs. The characters are chosen to look like the thing at a glance so an unfamiliar reader can read the board out of the text.",
        "~": "deep-water",
        "-": "shallow-water",
        "c": "coast",
        ".": "grassland",
        "f": "forest",
        "h": "hills",
        "^": "mountain",
        "m": "marsh",
        "t": "tundra",
        "d": "desert"
      },
      "rows": [
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
        "~~~~~~~~~~~~~---~~~~~~---------~",
        "~~~---~--~~---cc--~~~~-tttttttt-",
        "~~-^t--c---tttttt---~-tttttttttt",
        "~~-^^^ttttttttttttcc-~-ttttttttt",
        "~~--cc^tttttttttt..c---tfttttt^^",
        "~~~~---cttttttttt...cc--f.ttt.^^",
        "~~~~~-fftt^^ttt.......cc.hhhh^^-",
        "~~~~~~-fff^^^^^t..........cch^^-",
        "~~~~~-cffff^^^^..........c-chf-~",
        "~~~~~-cfffffff^^^t........cch--~",
        "~~~~-cfffffffff^^^^^........c--~",
        "~~~~-f....fffffff..^^^^....^^^c-",
        "~~~-fff...fffffff...^^^....^^^c-",
        "~~~~-ffffcfffcffff.....^^^^^^..c",
        "~~~~----------ff..m....^^^^^^..f",
        "--~~~~~~--~~~-ffmmmmmmddddd^^^.c",
        "c----~~~~~~~~-fmmmmmdddccdd^^cc-",
        "---f-~~~~~~~~-cmmmmccccc-cd^^c--",
        "~~---~~~~~~~-cddddc---cccddc--~~",
        "~~~~~~~~~~~~-cdddddccccddddc--~~",
        "~~~~~~~~~~~-ddddddddddddddc--~~~",
        "~~~~~~~~~~~-cdddddddddddddc-~~~~",
        "~~~~~~~~~~~--cdddccccddddc--~~~~",
        "~~~~~---~~-----------cc----~~~~~",
        "~~~~~-c-~~-c-~~~~~~~----~~~~~~~~"
      ],
      "regions": [
        {
          "id": "rimewaste",
          "name": "The Rimewaste",
          "terrain": "tundra",
          "labelAt": [
            12,
            4
          ],
          "summary": "The ice waste along the north edge, and the frozen sea beyond it. Nothing is built here but Coldwater, on its shore."
        },
        {
          "id": "hollowfrost",
          "name": "Hollowfrost Tundra",
          "terrain": "tundra",
          "labelAt": [
            27,
            4
          ],
          "summary": "The north-eastern tundra, reached over the neck at Kestrel Rock and held from Oldkeep."
        },
        {
          "id": "bramblehold",
          "name": "Bramblehold Wood",
          "terrain": "forest",
          "labelAt": [
            10,
            7
          ],
          "summary": "Thin northern woodland on the edge of the ice. The plate letters the name across the tundra above the trees; the wood itself is the belt running down to Duskmere."
        },
        {
          "id": "duskmere-wood",
          "name": "Duskmere Wood",
          "terrain": "forest",
          "labelAt": [
            11,
            12
          ],
          "summary": "The great temperate forest of the west, and the timber behind Saltreach and Port Malchior."
        },
        {
          "id": "ironspine",
          "name": "The Ironspine Mountains",
          "terrain": "mountain",
          "labelAt": [
            19,
            12
          ],
          "summary": "The range that splits the continent, running south-east from the western sea to the eastern shore above Brassford. The Reach Line crosses it at the pass south of Vossgard."
        },
        {
          "id": "amber-steppe",
          "name": "The Amber Steppe",
          "terrain": "grassland",
          "labelAt": [
            20,
            8
          ],
          "summary": "Open grass from Vossgard to the Varl Highlands. The only ground on the map a railway crosses cheaply."
        },
        {
          "id": "varl-highlands",
          "name": "Varl Highlands",
          "terrain": "hills",
          "labelAt": [
            27,
            8
          ],
          "summary": "Upland between the steppe and the eastern sea, around the lake the Steppe Line skirts. The plate draws it as steppe and names it a highland; the hexes follow the name."
        },
        {
          "id": "mirewash",
          "name": "The Mirewash Fens",
          "terrain": "marsh",
          "labelAt": [
            18,
            17
          ],
          "summary": "Wetland below the Ironspine, drained by the river that runs out past Umber Hollow. The plate paints it the same ochre as the desert beside it and draws it with the same glyph, and names it a fen; the hexes follow the name."
        },
        {
          "id": "ochre-waste",
          "name": "The Ochre Waste",
          "terrain": "desert",
          "labelAt": [
            24,
            18
          ],
          "summary": "Dry country east of the fens, broken by the Mirewash lakes."
        },
        {
          "id": "kholvar",
          "name": "Sands of Kholvar",
          "terrain": "desert",
          "labelAt": [
            18,
            21
          ],
          "summary": "The southern sand sea, with Dry Wells at its heart and Dunhaven on its shore."
        },
        {
          "id": "gulf-of-thallow",
          "name": "Gulf of Thallow",
          "terrain": "deep-water",
          "labelAt": [
            9,
            18
          ],
          "summary": "The southern gulf between Port Malchior and Kholvar."
        },
        {
          "id": "goldmere",
          "name": "Goldmere",
          "terrain": "deep-water",
          "labelAt": [
            20,
            4
          ],
          "summary": "The northern bay between the Rimewaste and the Hollowfrost, with Rimegate on its southern shore."
        },
        {
          "id": "splinter-isles",
          "name": "The Splinter Isles",
          "terrain": "coast",
          "labelAt": [
            3,
            18
          ],
          "summary": "Four islets scattered across the western sea, each a single hex."
        }
      ],
      "settlements": [
        {
          "id": "vossgard",
          "name": "Vossgard",
          "col": 16,
          "row": 7,
          "rank": "seat",
          "note": "Seat of the Reach. Both rail lines meet here."
        },
        {
          "id": "saltreach",
          "name": "Saltreach",
          "col": 6,
          "row": 9,
          "rank": "city",
          "harbour": true
        },
        {
          "id": "port-malchior",
          "name": "Port Malchior",
          "col": 13,
          "row": 14,
          "rank": "city",
          "harbour": true,
          "note": "The southern rail head, at the mouth of the Duskmere river."
        },
        {
          "id": "coldwater",
          "name": "Coldwater",
          "col": 14,
          "row": 2,
          "rank": "town"
        },
        {
          "id": "duskmere",
          "name": "Duskmere",
          "col": 9,
          "row": 8,
          "rank": "town"
        },
        {
          "id": "rimegate",
          "name": "Rimegate",
          "col": 19,
          "row": 5,
          "rank": "town",
          "note": "On the south shore of the Goldmere."
        },
        {
          "id": "oldkeep",
          "name": "Oldkeep",
          "col": 23,
          "row": 2,
          "rank": "town"
        },
        {
          "id": "kestrel-rock",
          "name": "Kestrel Rock",
          "col": 24,
          "row": 5,
          "rank": "town",
          "note": "At the neck between the steppe and the Hollowfrost, in the only wood north of the Ironspine."
        },
        {
          "id": "ironwick",
          "name": "Ironwick",
          "col": 23,
          "row": 9,
          "rank": "town"
        },
        {
          "id": "thorngate",
          "name": "Thorngate",
          "col": 30,
          "row": 12,
          "rank": "town"
        },
        {
          "id": "brassford",
          "name": "Brassford",
          "col": 29,
          "row": 15,
          "rank": "town"
        },
        {
          "id": "stagmoor",
          "name": "Stagmoor",
          "col": 16,
          "row": 15,
          "rank": "town"
        },
        {
          "id": "umber-hollow",
          "name": "Umber Hollow",
          "col": 15,
          "row": 18,
          "rank": "town"
        },
        {
          "id": "dunhaven",
          "name": "Dunhaven",
          "col": 22,
          "row": 24,
          "rank": "town",
          "harbour": true
        },
        {
          "id": "taleowick",
          "name": "Taleowick",
          "col": 5,
          "row": 5,
          "rank": "village",
          "harbour": true
        },
        {
          "id": "fens-end",
          "name": "Fen's End",
          "col": 7,
          "row": 3,
          "rank": "village"
        },
        {
          "id": "grist",
          "name": "Grist",
          "col": 14,
          "row": 16,
          "rank": "village"
        },
        {
          "id": "dry-wells",
          "name": "Dry Wells",
          "col": 18,
          "row": 22,
          "rank": "village"
        },
        {
          "id": "redmare",
          "name": "Redmare",
          "col": 30,
          "row": 17,
          "rank": "village"
        }
      ],
      "routes": {
        "$comment": "Rail and shipping are recorded hex by hex because they are infrastructure the rules price per tile. Roads are recorded as links between settlements: the plate draws them as connections rather than as a surveyed line, and inventing a hex path for each one would be putting detail into the data that is not on the map.",
        "rail": [
          {
            "id": "steppe-line",
            "name": "The Steppe Line",
            "hexes": [
              [
                16,
                7
              ],
              [
                17,
                7
              ],
              [
                18,
                7
              ],
              [
                19,
                7
              ],
              [
                20,
                7
              ],
              [
                21,
                7
              ],
              [
                22,
                8
              ],
              [
                22,
                9
              ],
              [
                23,
                9
              ],
              [
                24,
                9
              ],
              [
                25,
                9
              ],
              [
                26,
                10
              ],
              [
                27,
                10
              ],
              [
                27,
                11
              ],
              [
                28,
                11
              ],
              [
                29,
                12
              ],
              [
                30,
                12
              ],
              [
                30,
                13
              ],
              [
                30,
                14
              ],
              [
                29,
                15
              ]
            ]
          },
          {
            "id": "reach-line",
            "name": "The Reach Line",
            "hexes": [
              [
                16,
                7
              ],
              [
                17,
                8
              ],
              [
                17,
                9
              ],
              [
                17,
                10
              ],
              [
                16,
                11
              ],
              [
                16,
                12
              ],
              [
                15,
                13
              ],
              [
                15,
                14
              ],
              [
                14,
                14
              ],
              [
                13,
                14
              ]
            ]
          }
        ],
        "road": [
          {
            "from": "taleowick",
            "to": "fens-end"
          },
          {
            "from": "fens-end",
            "to": "coldwater"
          },
          {
            "from": "fens-end",
            "to": "duskmere"
          },
          {
            "from": "saltreach",
            "to": "duskmere"
          },
          {
            "from": "duskmere",
            "to": "port-malchior"
          },
          {
            "from": "rimegate",
            "to": "vossgard"
          },
          {
            "from": "oldkeep",
            "to": "kestrel-rock"
          },
          {
            "from": "kestrel-rock",
            "to": "ironwick"
          },
          {
            "from": "vossgard",
            "to": "ironwick"
          },
          {
            "from": "ironwick",
            "to": "thorngate"
          },
          {
            "from": "thorngate",
            "to": "brassford"
          },
          {
            "from": "brassford",
            "to": "redmare"
          },
          {
            "from": "port-malchior",
            "to": "grist"
          },
          {
            "from": "grist",
            "to": "umber-hollow"
          },
          {
            "from": "port-malchior",
            "to": "stagmoor"
          },
          {
            "from": "stagmoor",
            "to": "umber-hollow"
          },
          {
            "from": "umber-hollow",
            "to": "dry-wells"
          },
          {
            "from": "dry-wells",
            "to": "dunhaven"
          }
        ],
        "shipping": [
          {
            "id": "coldwater-run",
            "name": "Sea Route to Coldwater",
            "hexes": [
              [
                5,
                10
              ],
              [
                5,
                9
              ],
              [
                5,
                8
              ],
              [
                4,
                7
              ],
              [
                4,
                6
              ],
              [
                3,
                5
              ],
              [
                2,
                5
              ],
              [
                2,
                4
              ],
              [
                2,
                3
              ],
              [
                3,
                2
              ]
            ]
          },
          {
            "id": "gulf-crossing",
            "name": "The Gulf Crossing",
            "hexes": [
              [
                12,
                16
              ],
              [
                11,
                16
              ],
              [
                10,
                17
              ],
              [
                9,
                17
              ],
              [
                8,
                17
              ],
              [
                8,
                18
              ],
              [
                7,
                18
              ],
              [
                6,
                18
              ],
              [
                5,
                18
              ],
              [
                4,
                18
              ]
            ]
          },
          {
            "id": "kholvar-run",
            "name": "The Kholvar Coast Run",
            "hexes": [
              [
                13,
                16
              ],
              [
                13,
                17
              ],
              [
                13,
                18
              ],
              [
                12,
                19
              ],
              [
                12,
                20
              ],
              [
                11,
                21
              ],
              [
                11,
                22
              ],
              [
                11,
                23
              ],
              [
                11,
                24
              ]
            ]
          }
        ]
      }
    },
    {
      "$comment": "A COMMISSION, not a board. The plate has not been drawn yet, so this file has no `plate` block and its `rows` are empty. What it does have is a complete `commission`: what the map is for, what country it is, what the terrain budget is and how many settlements of what rank — the map mint's input contract, in data/mint.json under lines.maps.subjectRequires. Run `node tools/mint-queue.mjs` to see where it has got to. The whole pipeline, and who does what, is in docs/MINT.md; docs/map/README.md is the six steps of turning a plate into a board.",
      "version": "0.1.0",
      "id": "sundering-isles",
      "name": "The Sundering Isles",
      "subtitle": "a chart of the broken coast, the scatter & the drowned road",
      "summary": "A warm archipelago south of the Reach: no continent, a hundred islands, and more water than land. Everything moves by hull. Commissioned as the second board, and as the map that makes the shipping half of the economy matter — the Korvane Reach is a rail map with a coast, and this is its opposite.",
      "commission": {
        "$comment": "The input contract. Everything the artist needs decided BEFORE a prompt is written, and everything the tracer needs true of the finished plate. docs/art/prompts/maps.md § sundering-isles is written from this block and from nothing else; if the two disagree, this file is right and the prompt is stale.",
        "why": "The Reach is a continent with a coastline: rail carries the tonnage and ships are the alternative. This board inverts that — no route on it is walkable end to end, so barges, ships and harbours become the transport rules that are actually in play, and a settlement without a harbour is a settlement that has to pay someone else's freight.",
        "landmass": "No continent. Three loose chains of islands running north-east to south-west across a warm shallow sea, with the largest island about a sixth of the frame and nothing else above a twentieth. Open deep water on the south and east edges; the north edge is the shallow approach to the Korvane Reach's southern shore, drawn as a shelf running off the top of the frame. One long reef, drawn as shallows, chains two of the groups together — the drowned road the subtitle is named for.",
        "terrainBudget": [
          {
            "terrain": "deep-water",
            "share": 0.3
          },
          {
            "terrain": "shallow-water",
            "share": 0.22
          },
          {
            "terrain": "coast",
            "share": 0.15
          },
          {
            "terrain": "grassland",
            "share": 0.11
          },
          {
            "terrain": "forest",
            "share": 0.09
          },
          {
            "terrain": "hills",
            "share": 0.05
          },
          {
            "terrain": "mountain",
            "share": 0.04
          },
          {
            "terrain": "marsh",
            "share": 0.03
          },
          {
            "terrain": "desert",
            "share": 0.01
          }
        ],
        "$terrainBudgetNote": "Shares of the whole grid, water included. Half the board is water on purpose and the land is nearly all within one hex of it, which is what makes coast the third-largest terrain here and what makes the board play differently from the Reach. Tundra is deliberately absent: this is a warm sea. It keeps a character in the legend anyway, because a legend that covers all ten terrains costs nothing and a board that later grows a cold rock should not need a legend edit to say so.",
        "settlements": {
          "count": 14,
          "seat": 1,
          "city": 1,
          "town": 5,
          "village": 7,
          "harbours": 12
        },
        "$settlementNote": "Twelve of the fourteen are harbours — on this board a settlement off the water is the exception and should look like a hard place to live. The seat is on the largest island; the city is on the reef chain, where the freight has to change hulls.",
        "routes": {
          "rail": false,
          "shipping": true,
          "road": true
        },
        "$routeNote": "No rail at all. A rail line needs continuous land and there is none; the day someone bridges the reef is a design decision, not a drawing.",
        "mustHave": [
          "three island groups, none of them touching, with the largest island about a sixth of the frame",
          "a reef drawn as a distinct paler shallow, chaining two groups together",
          "at least twelve harbours, and a named anchorage drawn at each",
          "one volcanic peak on the largest island — the only mountain worth the name",
          "a shelf running off the north edge, so the board reads as being south of somewhere"
        ],
        "mustNotHave": [
          "a hex grid, a square grid, or any ruled lines over the field",
          "hillshading, relief shading, contour lines or depth soundings",
          "map furniture over land or over the reef — cartouche, legend and compass sit over open water",
          "display lettering over any island — the big names go on the sea, where a mis-read costs nothing",
          "a second colour of ochre: the desert wash and the marsh wash must not be the same, which is the mistake the Reach's plate made"
        ],
        "plate": {
          "minWidthPx": 4000,
          "wantWidthPx": 7000,
          "aspect": "root-two landscape",
          "$note": "Ask for the width before anything else. It is the one property of a plate that cannot be recovered later, and the Reach is on its second plate at 1491 px, which cost it the two larger print presets."
        }
      },
      "grid": {
        "shape": "hex",
        "orientation": "pointy",
        "offset": "odd-r",
        "cols": 30,
        "rows": 24,
        "fit": "field-width",
        "$fitNote": "Chosen at commission, confirmed when the field is measured. 30 columns on a root-two landscape field puts the rows at 24 and keeps a hex about the size of a small island, which is what this board needs: an island that is one hex is a place, and an island that is half a hex is decoration. The Reach uses 32 on a wider country; fewer columns here would swallow the scatter."
      },
      "print": {
        "$comment": "Sheet layouts, in the same three sizes as every other board — the geometry is a property of A4 and of the root-two frame, not of the artwork. mapWidthMm, mapHeightMm and hexAcrossFlatsMm are derived from the plate and written in by tools/build-map.mjs; they are absent here because there is no plate to derive them from yet.",
        "default": "four-sheet",
        "presets": [
          {
            "id": "four-sheet",
            "name": "Four sheets, A2",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 2,
            "sheetRows": 2,
            "marginMm": 8,
            "overlapMm": 0,
            "note": "Two by two, printed landscape. The working size for a table."
          },
          {
            "id": "nine-sheet",
            "name": "Nine sheets, A1",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 3,
            "sheetRows": 3,
            "marginMm": 8,
            "overlapMm": 0,
            "note": "Three by three. Worth printing only if the plate arrives at 7000 px."
          },
          {
            "id": "one-sheet",
            "name": "One sheet, reference",
            "sheet": "A4",
            "orientation": "landscape",
            "sheetCols": 1,
            "sheetRows": 1,
            "marginMm": 8,
            "overlapMm": 0,
            "note": "The whole board on one page, for reading rather than playing."
          }
        ]
      },
      "legend": {
        "$comment": "Character to terrain id, for the 'rows' block. Fixed at commission so the tracer's output is readable the day it first runs, and identical to the Korvane Reach's so a board from either map reads the same in a text editor.",
        "~": "deep-water",
        "-": "shallow-water",
        "c": "coast",
        ".": "grassland",
        "f": "forest",
        "h": "hills",
        "^": "mountain",
        "m": "marsh",
        "t": "tundra",
        "d": "desert"
      },
      "rows": [],
      "$rowsNote": "Empty until the plate exists and tools/trace-map.mjs has read it. A map with no rows is a commission, not a board: tools/validate-map.mjs skips the board checks and says so, the explorer shows it as commissioned, and tools/mint-queue.mjs puts it on the step it has actually reached."
    }
  ],
  "art": {
    "$comment": "derived from the committed PNGs - see docs/art/prompts/ and docs/minimaps/prompts/ - plus the subject boxes in docs/art/framing.json",
    "renders": {
      "character-chr-01": {
        "file": "art/renders/character-chr-01.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.15,
          0.05,
          0.76,
          0.58
        ]
      },
      "character-chr-02": {
        "file": "art/renders/character-chr-02.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.18,
          0.06,
          0.75,
          0.68
        ]
      },
      "character-chr-03": {
        "file": "art/renders/character-chr-03.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.18,
          0.06,
          0.74,
          0.6
        ]
      },
      "character-chr-04": {
        "file": "art/renders/character-chr-04.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.13,
          0.06,
          0.72,
          0.58
        ]
      },
      "character-chr-05": {
        "file": "art/renders/character-chr-05.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.1,
          0.09,
          0.82,
          0.58
        ]
      },
      "character-chr-06": {
        "file": "art/renders/character-chr-06.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.22,
          0.1,
          0.74,
          0.66
        ]
      },
      "character-chr-07": {
        "file": "art/renders/character-chr-07.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.1,
          0.12,
          0.82,
          0.58
        ]
      },
      "character-chr-08": {
        "file": "art/renders/character-chr-08.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.16,
          0.08,
          0.72,
          0.58
        ]
      },
      "monster-deepwater-maw": {
        "file": "art/renders/monster-deepwater-maw.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.02,
          0.36,
          0.96,
          0.52
        ]
      },
      "monster-dust-devil": {
        "file": "art/renders/monster-dust-devil.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.04,
          0.16,
          0.94,
          0.58
        ]
      },
      "monster-gravel-wyrm": {
        "file": "art/renders/monster-gravel-wyrm.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.05,
          0.1,
          0.82,
          0.63
        ]
      },
      "monster-mire-strangler": {
        "file": "art/renders/monster-mire-strangler.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.04,
          0.13,
          0.92,
          0.58
        ]
      },
      "monster-reef-serpent": {
        "file": "art/renders/monster-reef-serpent.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.04,
          0.2,
          0.92,
          0.58
        ]
      },
      "monster-rime-harpy": {
        "file": "art/renders/monster-rime-harpy.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.14,
          0.09,
          0.76,
          0.62
        ]
      },
      "monster-storm-roc": {
        "file": "art/renders/monster-storm-roc.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.02,
          0.05,
          0.96,
          0.42
        ]
      },
      "people-dwarf": {
        "file": "art/renders/people-dwarf.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.12,
          0.1,
          0.8,
          0.62
        ]
      },
      "people-elf": {
        "file": "art/renders/people-elf.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.08,
          0.08,
          0.84,
          0.6
        ]
      },
      "people-halfling": {
        "file": "art/renders/people-halfling.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.06,
          0.1,
          0.88,
          0.6
        ]
      },
      "people-human": {
        "file": "art/renders/people-human.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.13,
          0.1,
          0.74,
          0.62
        ]
      },
      "talisman-tal-01": {
        "file": "art/renders/talisman-tal-01.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.22,
          0.1,
          0.62,
          0.85
        ]
      },
      "talisman-tal-02": {
        "file": "art/renders/talisman-tal-02.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.2,
          0.11,
          0.64,
          0.76
        ]
      },
      "talisman-tal-03": {
        "file": "art/renders/talisman-tal-03.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.13,
          0.16,
          0.79,
          0.68
        ]
      },
      "talisman-tal-04": {
        "file": "art/renders/talisman-tal-04.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.07,
          0.19,
          0.89,
          0.69
        ]
      },
      "talisman-tal-05": {
        "file": "art/renders/talisman-tal-05.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.22,
          0.08,
          0.64,
          0.79
        ]
      },
      "talisman-tal-06": {
        "file": "art/renders/talisman-tal-06.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.16,
          0.08,
          0.7,
          0.84
        ]
      },
      "vehicle-veh-01": {
        "file": "art/renders/vehicle-veh-01.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.16,
          0.94,
          0.48
        ]
      },
      "vehicle-veh-02": {
        "file": "art/renders/vehicle-veh-02.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.14,
          0.95,
          0.72
        ]
      },
      "vehicle-veh-03": {
        "file": "art/renders/vehicle-veh-03.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.18,
          0.94,
          0.68
        ]
      },
      "vehicle-veh-04": {
        "file": "art/renders/vehicle-veh-04.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.1,
          0.08,
          0.84,
          0.76
        ]
      },
      "vehicle-veh-05": {
        "file": "art/renders/vehicle-veh-05.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.12,
          0.94,
          0.76
        ]
      },
      "vehicle-veh-06": {
        "file": "art/renders/vehicle-veh-06.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.06,
          0.1,
          0.88,
          0.78
        ]
      },
      "vehicle-veh-07": {
        "file": "art/renders/vehicle-veh-07.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.24,
          0.95,
          0.58
        ]
      },
      "vehicle-veh-08": {
        "file": "art/renders/vehicle-veh-08.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.26,
          0.95,
          0.54
        ]
      },
      "vehicle-veh-10": {
        "file": "art/renders/vehicle-veh-10.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.03,
          0.15,
          0.94,
          0.72
        ]
      },
      "vehicle-veh-11": {
        "file": "art/renders/vehicle-veh-11.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.08,
          0.13,
          0.84,
          0.76
        ]
      },
      "vehicle-veh-12": {
        "file": "art/renders/vehicle-veh-12.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.15,
          0.08,
          0.78,
          0.82
        ]
      }
    },
    "minimaps": {
      "PSM-01": "minimaps/img/PSM-01.png",
      "PSM-02": "minimaps/img/PSM-02.png",
      "PSM-03": "minimaps/img/PSM-03.png",
      "PSM-04": "minimaps/img/PSM-04.png",
      "SET-01": "minimaps/img/SET-01.png",
      "SET-02": "minimaps/img/SET-02.png",
      "SET-03": "minimaps/img/SET-03.png",
      "SET-04": "minimaps/img/SET-04.png",
      "SET-05": "minimaps/img/SET-05.png",
      "SET-06": "minimaps/img/SET-06.png",
      "SET-07": "minimaps/img/SET-07.png",
      "SET-08": "minimaps/img/SET-08.png",
      "SET-09": "minimaps/img/SET-09.png",
      "SET-10": "minimaps/img/SET-10.png",
      "SET-11": "minimaps/img/SET-11.png",
      "SET-12": "minimaps/img/SET-12.png",
      "SET-13": "minimaps/img/SET-13.png",
      "SET-14": "minimaps/img/SET-14.png",
      "SET-15": "minimaps/img/SET-15.png",
      "SET-16": "minimaps/img/SET-16.png",
      "SET-17": "minimaps/img/SET-17.png",
      "SET-18": "minimaps/img/SET-18.png",
      "SET-19": "minimaps/img/SET-19.png",
      "TBM-01": "minimaps/img/TBM-01.png",
      "TBM-02": "minimaps/img/TBM-02.png",
      "TBM-03": "minimaps/img/TBM-03.png",
      "TBM-04": "minimaps/img/TBM-04.png",
      "TBM-05": "minimaps/img/TBM-05.png",
      "TBM-06": "minimaps/img/TBM-06.png",
      "TBM-07": "minimaps/img/TBM-07.png",
      "TBM-08": "minimaps/img/TBM-08.png",
      "TBM-09": "minimaps/img/TBM-09.png"
    },
    "pad": 0.03,
    "focalTarget": [
      0.5,
      0.4
    ]
  }
};
