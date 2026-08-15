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
        "summary": "Tunable constants: round structure, effort, food, storage, market, victory."
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
        "summary": "Clothing, armour, weapons and potions."
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
          "summary": "Reveal and resolve the round's event card(s) before anyone acts."
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
      "notes": "Base values live on each commodity. Town price = baseValue x band. The spread is the house cut when trading with the board rather than another player."
    },
    "movement": {
      "landMoveCostDefault": 1,
      "figureMovePointsPerRound": 4,
      "cargoRequiresRoute": true,
      "notes": "Figures (prospectors, merchants, soldiers) use move points. Cargo uses transport modes with capacity and speed - see transport.json."
    },
    "exploration": {
      "tilesFaceDownAtStart": true,
      "revealCost": {
        "effortHours": 1,
        "figure": "prospector"
      },
      "depositRevealDie": "d6",
      "notes": "A prospector entering a face-down tile flips it. Flipping reveals terrain immediately; deposits need a survey roll on top of that."
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
          "sink-mineshaft"
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
          "harvest-herbs"
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
        "summary": "Digs clay from river banks and marshes.",
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
          "river-bank",
          "grassland"
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
          "coast",
          "river-bank"
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
          "marsh",
          "river-bank"
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
          "river-bank"
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
          "river-bank",
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
          "coast",
          "river-bank",
          "lake-shore"
        ]
      },
      {
        "id": "sawmill",
        "name": "Sawmill",
        "category": "production",
        "tier": 1,
        "summary": "Logs into lumber. Doubles its rate if built on a river-bank tile.",
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
          "river-bank",
          "hills"
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
          "river-bank",
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
          "river-bank",
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
        "summary": "Grain into flour. Free extra output on a hills or river-bank tile (wind and water).",
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
          "river-bank"
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
        "summary": "Serve ale or wine here to clear 1 unrest and buy back a little goodwill.",
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
        "workerSlots": 2
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
        "summary": "Carries a road or rail across one water tile or river edge.",
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
          "river-bank",
          "lake-shore",
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
            "river-bank",
            "tundra"
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
            "river-bank",
            "lake-shore"
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
            "desert",
            "river-bank"
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
        "notes": "+1 lumber if the sawmill is on a river-bank tile."
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
    "$comment": "The board is a grid of tiles. Each tile has one terrain type, which decides what can be built there, what it costs to cross, and what deposits can hide underneath it.",
    "version": "0.1.0",
    "tileShape": "hex",
    "tileShapeAlternatives": [
      "square"
    ],
    "terrains": [
      {
        "id": "grassland",
        "name": "Grassland",
        "family": "land",
        "colour": "#8fae5d",
        "summary": "Flat, open, dull and valuable. The default good ground.",
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
          "oil-field"
        ],
        "startTile": true
      },
      {
        "id": "forest",
        "name": "Forest",
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
        "family": "land",
        "colour": "#a08b5c",
        "summary": "Where the ore usually is, and where a mill or vineyard does best.",
        "moveCost": 2,
        "roadCostMultiplier": 2,
        "railCostMultiplier": 3,
        "buildable": true,
        "features": [
          "stone",
          "game"
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
          "herbs"
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
        "family": "land",
        "colour": "#5f7360",
        "summary": "Peat and clay for anyone patient enough to live here.",
        "moveCost": 3,
        "roadCostMultiplier": 3,
        "railCostMultiplier": 4,
        "buildable": true,
        "features": [
          "reeds",
          "herbs"
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
        "family": "land",
        "colour": "#d6c08a",
        "summary": "Sand and salt. Nothing grows without a well.",
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
        "id": "river-bank",
        "name": "River Bank",
        "family": "land",
        "colour": "#6f9d7f",
        "summary": "Fresh water, good clay, powered mills - and a river edge that must be bridged to cross.",
        "moveCost": 1,
        "roadCostMultiplier": 1,
        "railCostMultiplier": 2,
        "buildable": true,
        "waterAccess": true,
        "features": [
          "fresh-water",
          "clay"
        ],
        "deposits": [
          "clay-bed",
          "sand-bar",
          "gold-deposit"
        ],
        "bridgeRequiredToCross": true,
        "startTile": true
      },
      {
        "id": "lake-shore",
        "name": "Lake Shore",
        "family": "land",
        "colour": "#78a7b0",
        "summary": "Fishing and fresh water without the sea.",
        "moveCost": 1,
        "roadCostMultiplier": 1,
        "railCostMultiplier": 2,
        "buildable": true,
        "waterAccess": true,
        "features": [
          "fresh-water",
          "fish"
        ],
        "deposits": [
          "clay-bed",
          "sand-bar"
        ]
      },
      {
        "id": "coast",
        "name": "Coast",
        "family": "land",
        "colour": "#c9c193",
        "summary": "The only place a harbour can go.",
        "moveCost": 1,
        "roadCostMultiplier": 1,
        "railCostMultiplier": 2,
        "buildable": true,
        "waterAccess": true,
        "features": [
          "fish",
          "sand",
          "salt"
        ],
        "deposits": [
          "salt-dome",
          "sand-bar"
        ],
        "startTile": true
      },
      {
        "id": "shallow-water",
        "name": "Shallow Water",
        "family": "water",
        "colour": "#7fb6cf",
        "summary": "Crossable by bridge, navigable by barge.",
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
        "family": "water",
        "colour": "#3f7ba0",
        "summary": "Ships only. No bridge will ever cross it.",
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
      }
    ],
    "boardSetup": {
      "recommendedTiles": {
        "2players": 37,
        "3players": 49,
        "4players": 61,
        "5players": 75
      },
      "faceDownAtStart": "All tiles beyond each player's starting cluster of 3.",
      "startingCluster": "Each player places a town hall on a face-up start tile plus its two neighbours, at least 3 tiles from any other player.",
      "terrainMix": {
        "grassland": 0.24,
        "forest": 0.2,
        "hills": 0.14,
        "mountain": 0.08,
        "marsh": 0.05,
        "tundra": 0.04,
        "desert": 0.04,
        "river-bank": 0.07,
        "lake-shore": 0.03,
        "coast": 0.05,
        "shallow-water": 0.04,
        "deep-water": 0.02
      }
    }
  },
  "deposits": {
    "$comment": "Deposits are face-down tokens placed under tiles at setup. A prospector's survey flips them. A deposit is not a commodity - it is a finite source that a mine draws from until it is exhausted.",
    "version": "0.1.0",
    "deposits": [
      {
        "id": "clay-bed",
        "name": "Clay Bed",
        "requiresBuilding": "clay-pit",
        "yields": [
          "clay"
        ],
        "totalYield": 40,
        "tokensInSetup": 8,
        "surveyDifficulty": 2,
        "summary": "Common and shallow. Often visible without a survey on river-bank tiles."
      },
      {
        "id": "sand-bar",
        "name": "Sand Bar",
        "requiresBuilding": "sand-pit",
        "yields": [
          "sand"
        ],
        "totalYield": 40,
        "tokensInSetup": 6,
        "surveyDifficulty": 2
      },
      {
        "id": "peat-bog",
        "name": "Peat Bog",
        "requiresBuilding": null,
        "yields": [
          "peat"
        ],
        "totalYield": 30,
        "tokensInSetup": 5,
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
        "totalYield": 30,
        "tokensInSetup": 7,
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
        "totalYield": 28,
        "tokensInSetup": 7,
        "surveyDifficulty": 4
      },
      {
        "id": "copper-deposit",
        "name": "Copper Deposit",
        "requiresBuilding": "mine",
        "yields": [
          "copper-ore"
        ],
        "totalYield": 20,
        "tokensInSetup": 4,
        "surveyDifficulty": 4
      },
      {
        "id": "gold-deposit",
        "name": "Gold Deposit",
        "requiresBuilding": "mine",
        "yields": [
          "gold-ore"
        ],
        "totalYield": 10,
        "tokensInSetup": 3,
        "surveyDifficulty": 5
      },
      {
        "id": "gem-vein",
        "name": "Gem Vein",
        "requiresBuilding": "mine",
        "yields": [
          "gems"
        ],
        "totalYield": 8,
        "tokensInSetup": 3,
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
        "totalYield": 24,
        "tokensInSetup": 4,
        "surveyDifficulty": 3
      },
      {
        "id": "mana-vein",
        "name": "Mana Vein",
        "requiresBuilding": "mine",
        "yields": [
          "mana-crystal"
        ],
        "totalYield": 6,
        "tokensInSetup": 2,
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
        "totalYield": 20,
        "tokensInSetup": 3,
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
          "river-bank",
          "lake-shore"
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
        "summary": "One per player, free at setup. Carries potions and equipment, rolls an extra combat die, and never starves.",
        "carries": 3,
        "unique": true
      }
    ]
  },
  "peoples": {
    "$comment": "Who does the work. Peoples set a player's baseline (die size, terrain comfort, food quirks). Professions are individual workers upgraded at a guildhall - they unlock recipes that plain workers cannot run.",
    "version": "0.1.0",
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
          "river-bank",
          "coast",
          "forest"
        ]
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
        ]
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
          "river-bank"
        ]
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
          "river-bank",
          "forest"
        ]
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
        ]
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
    "$comment": "One card is drawn at the start of every round (two from round 13). Each card carries plain text for the tabletop game and a machine-readable effects array so the digital version can resolve it automatically.",
    "version": "0.1.0",
    "scopes": [
      {
        "id": "global",
        "name": "Global",
        "summary": "Applies to every player."
      },
      {
        "id": "local",
        "name": "Local",
        "summary": "Applies to one region of the board - roll for the region."
      },
      {
        "id": "targeted",
        "name": "Targeted",
        "summary": "Applies to one player - usually the leader, or roll."
      },
      {
        "id": "offer",
        "name": "Offer",
        "summary": "An opportunity any player may take, resolved in turn order."
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
      "choice": "Player picks between listed branches."
    },
    "cards": [
      {
        "id": "hard-frost",
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
          "River-bank and lake-shore towns are unaffected."
        ]
      },
      {
        "id": "long-summer",
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
      }
    ],
    "deck": {
      "totalCards": 58,
      "drawPerRound": 1,
      "drawPerRoundFrom": {
        "round": 13,
        "count": 2
      },
      "reshuffle": "When the deck runs out, shuffle the discard pile and carry on.",
      "designNotes": [
        "Weather and market cards are the common ones - they should feel like the seasons turning, not like being punished.",
        "Crime cards target the leader by default. That is the catch-up mechanism, and it is deliberate.",
        "Every disaster card should have at least one mitigation a player could have bought in advance. Being wiped out should always be traceable to a decision."
      ]
    }
  },
  "items": {
    "$comment": "Equipment carried by workers, figures and soldiers. Unlike tools, most equipment does not wear down with production - armour and weapons take damage in combat, potions are consumed on use.",
    "version": "0.1.0",
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
        "effects": [
          "+2 combat dice. Ignores enemy armour entirely."
        ],
        "combatDice": 2
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
        "effects": [
          "Cancel one worker loss, or ignore one Plague card."
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
        "effects": [
          "Shift one commodity family's price band two steps in your favour for your next sale only."
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
      "summary": "A north-facing continent map: an ice waste along the top edge, a temperate wooded west, a dry ochre south, and a mountain spine running south-east from the middle of the landmass to the eastern sea.",
      "plate": {
        "file": "korvane-reach.png",
        "$fileNote": "Relative to docs/map/. The artwork is committed as supplied and is never re-encoded by any tool here — the hex grid is an overlay drawn on top of it, not a change to it.",
        "width": 3508,
        "height": 2480,
        "field": {
          "x": 44,
          "y": 44,
          "width": 3421,
          "height": 2393
        },
        "$fieldNote": "The drawn map inside the printed frame, in plate pixels. Measured from the inner frame rule. Everything else in this file that talks about position is a fraction of this rectangle, so the data survives the plate being redrawn at another resolution.",
        "occlusions": [
          {
            "id": "title",
            "name": "Title cartouche",
            "x": 0.01,
            "y": 0.77,
            "width": 0.335,
            "height": 0.2
          },
          {
            "id": "legend",
            "name": "Legend panel",
            "x": 0.686,
            "y": 0.766,
            "width": 0.314,
            "height": 0.218
          },
          {
            "id": "compass",
            "name": "Compass rose",
            "x": 0.036,
            "y": 0.404,
            "width": 0.104,
            "height": 0.128
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
        "$leagueNote": "Read off the plate's scale bar to the nearest league. Fiction, not a rule — nothing in data/rules.json is denominated in leagues."
      },
      "print": {
        "$comment": "Sheet layouts for printing the plate at table size. Each preset tiles the whole plate — decorative frame included, because the frame is part of the drawing — across a grid of A4 sheets with a margin every printer can manage, then scales it to the largest size that fits without cropping and without distorting it. mapWidthMm, mapHeightMm and hexAcrossFlatsMm are derived from that and rewritten by tools/build-map.mjs; they are stored here so the numbers are greppable and so a change to the geometry shows up as a diff.",
        "default": "six-sheet",
        "presets": [
          {
            "id": "six-sheet",
            "name": "Six sheets, A2",
            "sheet": "A4",
            "orientation": "portrait",
            "sheetCols": 3,
            "sheetRows": 2,
            "marginMm": 8,
            "overlapMm": 0,
            "mapWidthMm": 582,
            "mapHeightMm": 411.4,
            "hexAcrossFlatsMm": 17.7,
            "note": "Three sheets across, two down, printed portrait, trimmed on the crop marks and butted. 582 x 411 mm finished — A2, near enough — at 153 dpi, with 17.7 mm hexes. A4 is a root-two rectangle and so is this plate, which is why six A4 sheets cannot tile it without waste: the bottom row of sheets is only two thirds used, and that waste is what pays for the printer margins an exact 2x2 A2 tiling has no room for."
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
            "mapWidthMm": 823.2,
            "mapHeightMm": 582,
            "hexAcrossFlatsMm": 25.1,
            "note": "Three by three, printed landscape. 823 x 582 mm — A1, near enough — with 25 mm hexes you can stand a figure in. The plate only holds 3508 pixels across, so this prints at 108 dpi and is visibly softer up close; it is the layout for a map you play on rather than one you read."
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
            "mapWidthMm": 274.4,
            "mapHeightMm": 194,
            "hexAcrossFlatsMm": 8.4,
            "note": "The whole plate on one page at 325 dpi. 8.4 mm hexes are too small to play on and perfectly good for the ring binder."
          }
        ]
      },
      "legend": {
        "$comment": "Character to terrain id, for the 'rows' block. Every id here must exist in data/terrain.json — that is checked by tools/validate-map.mjs. The characters are chosen to look like the thing at a glance so an unfamiliar reader can read the board out of the text.",
        "~": "deep-water",
        "-": "shallow-water",
        "c": "coast",
        "l": "lake-shore",
        "r": "river-bank",
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
        "~~~~~~~~~~~~~~~~~~~~~~~-----~~~~",
        "~~~~~~~~~~~~-----~~~~~--tttt----",
        "~~----------tttt--~~~--ttttttttt",
        "~~-chhttcttttttttt----ttttttttt-",
        "~~-chfttttttttttttt----tttttttt-",
        "~~~--ctttttttttt.r.r----ctttttt-",
        "~~~~---tfft^ttttr.r..c-cr...hh..",
        "~~~~~~-ffff^^ttt......ccrrhhrh^f",
        "~~~~~~-cff.^^^^t........rrllhh--",
        "~~~~~--cffff..^^^.........l-lh-~",
        "~~~~-fcrf.ffff^^.^hhhh....llh--~",
        "~~~~-f.rrrrrfff.^...^^......^^c-",
        "~~~~-f....rffrfff...^^^....^^hc-",
        "~~~~-cff..fffcrrrf...^^^^^^^^h^c",
        "~~~--ccfffff--ffrrr....^^^^^^h..",
        "--~~----------cf.mmmmmmdddd^^h.c",
        "c---~~~~~~~~~-c.mmmmmmmlldd^^dc-",
        "---c-~~~~~~~~-crmmmmmmrl-ld^^dc-",
        "~~---~~~~~~~-c.dmmmmrddlld^^---~",
        "~~~~~~~~~~~~-ddddddddddddd^hc---",
        "~~~~~~~~~~~-cddddddddddddc---~~~",
        "~~~~~~~~~~~~-cddddddddddc--~~~~~",
        "~~~~~--~~~----cccccccc---~~~~~~~",
        "~~~~~-c-~~-c-----------~~~~~~~~~",
        "~~~~~--~~~--~~~~~~~~~~~~~~~~~~~~"
      ],
      "regions": [
        {
          "id": "rimewaste",
          "name": "The Rimewaste",
          "terrain": "tundra",
          "labelAt": [
            10,
            4
          ],
          "summary": "The ice waste along the north edge, and the frozen sea beyond it. Nothing is built here."
        },
        {
          "id": "hollowfrost",
          "name": "Hollowfrost Tundra",
          "terrain": "tundra",
          "labelAt": [
            27,
            4
          ],
          "summary": "The north-eastern tundra, held from Oldkeep and Kestrel Rock."
        },
        {
          "id": "bramblehold",
          "name": "Bramblehold Wood",
          "terrain": "forest",
          "labelAt": [
            10,
            7
          ],
          "summary": "Thin northern woodland on the edge of the ice, above Duskmere."
        },
        {
          "id": "duskmere-wood",
          "name": "Duskmere Wood",
          "terrain": "forest",
          "labelAt": [
            10,
            13
          ],
          "summary": "The great temperate forest of the west, and the timber behind Saltreach and Port Malchior."
        },
        {
          "id": "ironspine",
          "name": "The Ironspine Mountains",
          "terrain": "mountain",
          "labelAt": [
            18,
            12
          ],
          "summary": "The range that splits the continent, running south-east from the Rimewaste to the Cragmaw. The Reach Line crosses it east of Vossgard."
        },
        {
          "id": "amber-steppe",
          "name": "The Amber Steppe",
          "terrain": "grassland",
          "labelAt": [
            21,
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
          "summary": "Upland between the steppe and the eastern sea. The plate draws it as steppe and names it a highland; the hexes follow the name."
        },
        {
          "id": "cragmaw",
          "name": "Cragmaw Furnaces",
          "terrain": "mountain",
          "labelAt": [
            28,
            15
          ],
          "summary": "The eastern spurs above Brassford and Thorngate."
        },
        {
          "id": "mirewash",
          "name": "The Mirewash Fens",
          "terrain": "marsh",
          "labelAt": [
            18,
            17
          ],
          "summary": "Wetland fed by the Vayne, the Skarn and the Mirewash. The plate draws it with the dune glyph and names it a fen; the hexes follow the name."
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
            22
          ],
          "summary": "The southern sand sea, with Dry Wells at its heart and Dunhaven on its shore."
        },
        {
          "id": "sable-sea",
          "name": "The Sable Sea",
          "terrain": "deep-water",
          "labelAt": [
            7,
            15
          ],
          "summary": "The western ocean. Shipping runs from here to the Free Ports and the Far Shores."
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
          "id": "coldmere",
          "name": "Coldmere",
          "terrain": "deep-water",
          "labelAt": [
            20,
            3
          ],
          "summary": "The northern bay between the Rimewaste and the Hollowfrost."
        },
        {
          "id": "splinter-isles",
          "name": "The Splinter Isles",
          "terrain": "coast",
          "labelAt": [
            3,
            18
          ],
          "summary": "Four islets in the Sable Sea, each a single hex of shore."
        }
      ],
      "settlements": [
        {
          "id": "vossgard",
          "name": "Vossgard",
          "col": 17,
          "row": 8,
          "rank": "seat",
          "note": "Seat of the Reach. Both rail lines meet here."
        },
        {
          "id": "saltreach",
          "name": "Saltreach",
          "col": 7,
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
          "row": 3,
          "rank": "town"
        },
        {
          "id": "duskmere",
          "name": "Duskmere",
          "col": 9,
          "row": 9,
          "rank": "town"
        },
        {
          "id": "rimegate",
          "name": "Rimegate",
          "col": 19,
          "row": 6,
          "rank": "town"
        },
        {
          "id": "oldkeep",
          "name": "Oldkeep",
          "col": 23,
          "row": 3,
          "rank": "town"
        },
        {
          "id": "kestrel-rock",
          "name": "Kestrel Rock",
          "col": 24,
          "row": 6,
          "rank": "town"
        },
        {
          "id": "ironwick",
          "name": "Ironwick",
          "col": 23,
          "row": 10,
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
          "col": 17,
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
          "col": 21,
          "row": 23,
          "rank": "town",
          "harbour": true
        },
        {
          "id": "tallowick",
          "name": "Tallowick",
          "col": 5,
          "row": 6,
          "rank": "village",
          "harbour": true
        },
        {
          "id": "fens-end",
          "name": "Fen's End",
          "col": 8,
          "row": 4,
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
          "col": 17,
          "row": 21,
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
                17,
                8
              ],
              [
                18,
                8
              ],
              [
                19,
                8
              ],
              [
                20,
                8
              ],
              [
                21,
                8
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
                10
              ],
              [
                24,
                10
              ],
              [
                25,
                10
              ],
              [
                26,
                10
              ],
              [
                26,
                11
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
                28,
                12
              ],
              [
                29,
                12
              ],
              [
                30,
                12
              ]
            ]
          },
          {
            "id": "reach-line",
            "name": "The Reach Line",
            "hexes": [
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
                17,
                11
              ],
              [
                17,
                12
              ],
              [
                16,
                13
              ],
              [
                15,
                13
              ],
              [
                14,
                13
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
            "from": "tallowick",
            "to": "fens-end"
          },
          {
            "from": "fens-end",
            "to": "coldwater"
          },
          {
            "from": "fens-end",
            "to": "saltreach"
          },
          {
            "from": "saltreach",
            "to": "duskmere"
          },
          {
            "from": "duskmere",
            "to": "vossgard"
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
            "to": "rimegate"
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
            "id": "free-ports",
            "name": "To the Free Ports",
            "hexes": [
              [
                6,
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
                6
              ],
              [
                2,
                6
              ],
              [
                2,
                5
              ],
              [
                2,
                4
              ]
            ]
          },
          {
            "id": "far-shores",
            "name": "To the Far Shores",
            "hexes": [
              [
                6,
                17
              ],
              [
                5,
                17
              ],
              [
                4,
                17
              ],
              [
                3,
                17
              ],
              [
                2,
                17
              ],
              [
                1,
                17
              ]
            ]
          },
          {
            "id": "southern-isles",
            "name": "To the Southern Isles",
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
              ]
            ]
          }
        ]
      }
    }
  ]
};
