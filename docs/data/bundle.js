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
        "key": "pricing",
        "file": "pricing.json",
        "collection": "models",
        "idField": "id",
        "summary": "How a price is arrived at: the blue, red, green and ochre dice, the volatility strip, the swing ruler, and the four kinds of good every commodity is one of. All addition - nothing multiplies."
      },
      {
        "key": "tools",
        "file": "tools.json",
        "collection": "tools",
        "idField": "id",
        "summary": "Equipment that gates recipes and wears out, on the board’s own 0-14 scale."
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
        "summary": "Clothing, armour, weapons, gear, potions, lights and talismans, each with its mass in kg and, unless it is drunk or holds mana, the wear it will take."
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
        "summary": "The vehicle deck: named trains, ships, caravans and horses, each printing its hull and its hold."
      },
      {
        "key": "characters",
        "file": "characters.json",
        "collection": "characters",
        "idField": "id",
        "summary": "The character deck: named heroes with health, strength, mana and the gold they start with."
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
        "summary": "The mint: one line per kind of thing that goes designer -> artist -> build. Cards, maps, building tiles, and terrain tiles while they are shelved. Content-free, like components.json: it says what a line is, never what a card says."
      },
      {
        "key": "artstyle",
        "file": "artstyle.json",
        "collection": "registers",
        "idField": "id",
        "summary": "The house style for a DRAWN plate, declared once: the line, the hatching, the wash, and one register per brief in docs/art/prompts/. Content-free like components.json and mint.json - it says what a family of plates IS, never what a subject is. tools/build-prompts.mjs writes it into every brief and --check fails when a copy has drifted."
      },
      {
        "key": "playerboard",
        "file": "playerboard.json",
        "collection": "tracks",
        "idField": "id",
        "summary": "The player board: four numbered tracks a figure walks a token along, a wear ladder against each of the four kit slots, the card recesses and the turn reference. The shapes it is drawn into are components.json board."
      },
      {
        "key": "marketboard",
        "file": "marketboard.json",
        "collection": null,
        "idField": null,
        "summary": "The market board: two sheets that hold no price. One explains the roll and the four kinds of goods; the other is a page of depletion grids, covered a pip at a time and never uncovered. The shapes are components.json marketBoard."
      },
      {
        "key": "ledger",
        "file": "ledger.json",
        "collection": null,
        "idField": null,
        "summary": "The price ledger: the only place a price lives. Commodities across the top, rounds down the side, and every price three hollow seven-segment figures the players colour in and strike through. The shapes are components.json ledger."
      },
      {
        "key": "minimap",
        "file": "minimap.json",
        "collection": null,
        "idField": null,
        "summary": "The mini-map: one world hex opened out as a plain-colour hexagonal field whose cells are the size of a world-map hex. The shapes are components.json minimap."
      },
      {
        "key": "buildingtiles",
        "file": "buildingtiles.json",
        "collection": null,
        "idField": null,
        "summary": "Building tiles: hex pieces cut so one cell is a mini-map cell, which is a world-map hex. How many cells a building takes is worked out from its own numbers through the ground model and the ladder here - it is never written on the building. The shapes it is drawn into are components.json buildingTile."
      },
      {
        "key": "graph",
        "file": "graph.json",
        "collection": "nodes",
        "idField": "id",
        "summary": "The dependency graph: which collections are things in the web of the game, and which ink each family washes in. Nodes only - the arrows are computed from references.checks below, never declared, so the graph cannot disagree with what the validator enforces. Drawn live by the explorer's Graph tab and into docs/art/graph/dependencies.svg by tools/build-graph.mjs for the printed rulebook."
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
          "from": "commodities",
          "path": "commodities[].pricing",
          "to": "pricing"
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
      "startingAmount": 60,
      "massKgEach": 0.025,
      "$massNote": "A gold coin weighs 25 grams, and it is the one thing on this list that used to weigh nothing. Coin was on carrying.notCarried - an abstraction that lived outside the world - and a purse of four hundred is ten kilograms, which is most of what a figure can shoulder. So it comes off that list and goes on the scales with everything else: what you are carrying is what you are carrying, and a fortune is heavy.\n\nIt is a real weight for a real coin. A sovereign is eight grams and a piece of eight is twenty-seven; twenty-five puts this one in the same purse as the coins it is drawn from, and forty of them to the kilogram is arithmetic a table can do without being asked to.",
      "$carryNote": "Forty coin to the kilogram. A strength-3 figure can shoulder 9 kg, so an empty-handed one could carry 360 coin and nothing else; the 60 they start with is a kilogram and a half, which is a rounding error against a sword. The weight only bites when somebody is moving a fortune - which is exactly the moment it should."
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
          "summary": "Each town must pay food upkeep from stock held in or near that town. Shortfalls cause unrest. Then every player rolls the ochre spoil die once for each perishable stack they are still holding."
        },
        {
          "id": "market-turn",
          "name": "Market",
          "summary": "Roll the market for every line on the ledger: two blue, two red, one green, plus whatever the good's own nature adds. Read the swing ruler, walk the band, write the new price and strike the old one through. Turn order passes to the left."
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
    "wear": {
      "$comment": "What using a thing does to it, and it is now one rule for every made thing in the game rather than a private arrangement between tools and their own file.\n\nTools wore out and nothing else did. A sword was immortal, a suit of plate never dented, a rope never frayed and a lantern burned forever - so the only equipment decision anybody ever made twice was which axe to buy. Everything a player carries wears now, on one track, in one unit, at one wear point a use.\n\nTHE SCALE IS THE BOARD'S. Wear used to run to thirty-four and be counted on the tool, because there was no track for it and the strip note said there never would be: 'it runs past twenty, the board stops at fourteen.' The board has a track for it now - four of them, one beside each kit slot - so the number came down to meet the board rather than the board going up to meet the number. That is the same trade the kilogram made when a hero could not stand their own load on a fourteen-rung ladder, and it is the right way round: the ceiling is the game's, and a number that will not fit under it is a number that is wrong.\n\nRescaling did not shorten anything's life, because the CLOCK changed with the scale. An axe had twenty-four wear at one a labour hour, which is eight three-hour jobs. It has ten at one a JOB, which is ten. A tool lasts slightly longer than it did and nobody adds hours up any more.",
      "unit": "wear-point",
      "walks": "down",
      "track": "The W track beside the item's own slot on the player board. Set it from the W box on the card when the thing is picked up, knock it down a rung each time the thing is used, and at 0 it is finished.",
      "printedOn": "The card, as the W box in the summary strip: the most wear the thing will take. Nothing on a card ever moves - see data/playerboard.json.",
      "perUse": 1,
      "takes": [
        {
          "id": "job",
          "applies": "a tool",
          "when": "each recipe it is used in",
          "$note": "Per job, not per hour. A worker who spends nine hours felling timber has run one job and blunted one axe by one."
        },
        {
          "id": "battle",
          "applies": "a weapon, a shield, a helm or a suit of armour",
          "when": "each round of a battle it is swung or worn in",
          "$note": "Both sides, win or lose. A blow you turned still dented the plate."
        },
        {
          "id": "night",
          "applies": "a light",
          "when": "each night leg it is burned on",
          "$note": "Which is what a torch is: one wear, one night, gone."
        },
        {
          "id": "use",
          "applies": "anything else",
          "when": "each time its own card says",
          "$note": "A rope that takes a party down a cliff, a grappling hook that holds, a bag that is stuffed past its seams. The card says what counts as a use, because a rope and a pair of boots do not wear for the same reason."
        }
      ],
      "atZero": "Worn out. The card is discarded, the track is cleared, and whatever the thing was doing for its owner it stops doing at once - a broken tool does not refund the effort already spent on the job that broke it, and a sword that goes at 0 leaves you swinging with nothing for the rest of the battle.",
      "neverWears": [
        "Potions, which are drunk rather than worn out - the card is discarded on use and there is no W box on it.",
        "Talismans. Mana is not friction; a phylactery that has been filled and emptied a hundred times is a phylactery.",
        "Commodities, which are counted rather than owned."
      ],
      "repair": {
        "toFull": false,
        "wearPerRound": 3,
        "coinPerPoint": 4,
        "effortHours": 2,
        "requires": "blacksmith",
        "$note": "Any settlement with a blacksmith, three points a round, four coin a point and two hours of somebody's labour. A thing may be mended any number of times; what cannot be mended is a thing at 0, which is not damaged, it is gone."
      },
      "$boardNote": "Four kit slots, four W tracks, so a player tracks the wear of everything they are actually carrying and nothing else. A fifth thing in play is a fifth thing whose wear nobody is counting, which is the same argument the four slots were already making."
    },
    "tools": {
      "durabilityUnit": "wear-point",
      "wearPerJob": 1,
      "wearRule": "rules.json wear - a tool is not special any more, it is the first thing that wore out.",
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
          "costMultiplier": 1
        },
        {
          "id": "medium",
          "tier": 2,
          "outputMultiplier": 1.5,
          "costMultiplier": 2
        },
        {
          "id": "large",
          "tier": 3,
          "outputMultiplier": 2,
          "costMultiplier": 3.5
        }
      ],
      "$sizesNote": "A size used to multiply durability as well, and it does not any more. A bigger loom is a FASTER loom, not a longer-lived one - and a multiplied wear number is a number the ceiling sweep cannot see, because it never appears in the data at the size it is actually walked at. One multiplier fewer, one hole in the ceiling fewer, and one thing less to work out at a table.",
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
      "pricedBy": "data/pricing.json. Every Market phase each town rolls two BLUE dice for demand, two RED for supply and one GREEN for volatility, per commodity line on the ledger, and reads the result on the swing ruler printed on the market board. The whole sum is addition: Demand − Supply + Volatility + whatever the good's own nature adds. Nothing multiplies and nothing is halved.",
      "recordedOn": "data/ledger.json - the price ledger. One column per commodity traded, one row per round, and the price written in three hollow seven-segment figures the player colours in, struck through when it changes and the new one written under it. No board tracks a price any more, and no token walks a band.",
      "$bandNote": "THE BANDS ARE A PRINTED ROW, NOT A LADDER. Every commodity's six prices are worked out from its base value and printed as one row of six figures in the annex - grain is 3 · 4 · 5 · 6 · 8 · 10 - so a price move is a step ALONG THAT ROW. The price you last wrote in the ledger is one of the six; the swing ruler says how many places to step; the figure you land on is the new price. There is nothing to multiply, no band index to remember and no bar to walk, which is what let the price ladder come off the market board without anything replacing it.",
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
      "notes": "Base values live on each commodity. Town price = baseValue at the band its bar stands on, and every commodity's six prices are printed out in full in the annex so that lookup is never a multiplication. The spread is the house cut when trading with the board rather than another player. What moves a band is not here: it is data/pricing.json, because a die roll and four kinds of goods are a system rather than a constant."
    },
    "infrastructure": {
      "$comment": "What a player gets for laying road and rail, beyond the fact that their own carts go faster on it. Roads were the one thing in the game you built for everybody and were paid for by nobody: the network victory condition scored them at the very end and nothing scored them in the twenty rounds before that, so a road only ever got built where its builder happened to want to walk.\n\nThree returns, in the order a player feels them: a toll every time somebody else uses it, a better price for cargo that moves on your own network, and the network points that were already there. The toll is small on purpose - it is a reason to build, not a business - and it is collected from the table rather than paid into a bank, so every coin of it comes out of a rival.",
      "ownership": "A road, rail line or bridge belongs to the player who paid for it, for the rest of the game. Mark it with that player's route tokens (components.json tokens.route) as it is laid - the token IS the record, and an unmarked road belongs to nobody.",
      "toll": {
        "roadPerHex": 1,
        "railPerHex": 2,
        "collectedBy": "The owner, from the moving player, the moment that leg ends.",
        "capPerLeg": 6,
        "capNote": "No leg pays more than this however long it is, so a trunk road across the continent is worth building and is never a tax gate.",
        "waived": [
          "The owner's own figures, parties and cargo - you do not pay yourself.",
          "Any party carrying a quest the owner accepted.",
          "Any hex whose road the moving player also owns a share of, where two networks meet."
        ],
        "refused": "A player may decline to pay and go round. They may not decline to pay and go through."
      },
      "haulage": {
        "bonusPercent": 10,
        "rule": "Cargo that starts or ends its journey in a settlement your own road or rail reaches sells for a tenth more than the town price.",
        "why": "A road is worth more to the person who built it than the toll on it will ever be. This is where the real money is, and it is why the sensible first road runs from your mine to your market rather than towards anybody else."
      },
      "payback": {
        "$comment": "The check that says the numbers are not decoration. A road hex costs 1 stone and 3 build points; stone is 5 coin, so call it 5 coin a hex and an hour a hex on top. At 1 coin a hex a stretch pays for itself after five foreign crossings, which in a four-player game is a handful of rounds on any road worth building. Rail costs 2 steel and 2 lumber - 70 coin a hex - and will never repay that in tolls alone: rail is repaid by the train that runs on it and by victoryPointsPerTile, and the toll is a gratuity.",
        "roadHexCoin": 5,
        "roadHexHours": 3,
        "railHexCoin": 70,
        "railHexHours": 8
      },
      "victory": "Unchanged: the Network condition still scores towns joined by road, rail and sea routes you built (victory.conditions network), and rail still scores victoryPointsPerTile as it is laid.",
      "notes": "None of this makes a road a private road. Anyone may walk it, and paying the toll is the price of the walk - which is exactly the relationship a turnpike had with the people who used it."
    },
    "carrying": {
      "$comment": "What a figure carries on its own back, in kilograms - and there is no longer a second number for it. Strength IS the carrying limit: one rating does the lifting and the swinging, because they are the same arm. A character card prints the kilograms so nobody does arithmetic at the table, but the kilograms are derived, not designed - change a figure's strength and what they can shoulder changes with it.\n\nMass and bulk are two different measures and never mix: bulk is a commodity's storage-slot and shipping cost (commodities.json, transport.json), mass is what one item weighs (items.json massKg). Cargo in a cart is bulk; the axe on your shoulder is mass.",
      "unit": "kg",
      "kgPerStrength": 3,
      "$scaleNote": "Three kilograms to the point. It is the factor that leaves the deck where it already was - a strength-2 hedge-witch shoulders 6 kg and a strength-6 caravan guard 18, which is roughly what their old burden bars said - and it puts the plate harness (12.5 kg) out of reach of anyone under strength 5, which is the right sentence for a suit of plate to be in.",
      "limit": "strength x kgPerStrength, in kilograms. Characters use the strength on their card; any other figure uses its people's strength.base (peoples.json).",
      "marker": "None. There is no burden track any more and no token to walk: total what the figure is wearing, wielding and stowing, and it either fits under the limit printed on the card or it does not.",
      "limitRule": "A figure may not take up an item that would put its load over the limit. Load it onto a vehicle, hand it to someone with room, or leave it where it lies.",
      "coin": {
        "$comment": "Coin was on the list below - weightless, an abstraction, the one thing a figure could hold an unlimited quantity of. It is not any more. A gold coin weighs 25 grams (currency.massKgEach), forty to the kilogram, and it goes on the scales with the sword and the rope.\n\nWhat that buys is a real decision at the top of the game. A strength-3 figure shoulders 9 kg; a strength-6 one, 18. Spend that on plate and a greatsword and there is nothing left for a fortune, and a party that has just sold a hold of jewellery has to work out how it is getting the money home. Coin is not a number in a corner of the sheet any more, it is cargo.",
        "massKgEach": "rules.currency.massKgEach",
        "perKg": 40,
        "counts": "Against the same limit as everything else. Total what the figure is wearing, wielding, stowing and carrying in its purse.",
        "elsewhere": "Coin in a strongbox on a wagon is cargo like any other and is measured in bulk, not on a figure's back. Coin left in a town is not being carried by anybody."
      },
      "notCarried": [
        "Commodities in transit, which travel by transport mode and are measured in bulk.",
        "Mana, in the body or in a talisman - the talisman itself has mass, its charge does not."
      ],
      "onZeroHealth": "A figure carried to a settlement at 0 health loses everything it was carrying on the way.",
      "notes": "Burden used to be a bar up the right edge of every character card and a track on the player board. Both are gone: the bar went when the cards took a summary strip across the top instead, and the track went when strength swallowed it."
    },
    "upkeep": {
      "$comment": "What a figure spends by being alive and on the road, and which of its two numbers it spends. Food keeps HEALTH up; sleep keeps STRENGTH up. They are not interchangeable and neither is a substitute for the other, which is the whole design: a party can be well fed and exhausted, or rested and starving, and those are different problems with different answers.\n\nThe town-scale version of this - workers eating in the Feeding phase - is `population`. This block is the party-scale one, and it applies to every figure on the map that is not sitting in a town being fed by it.",
      "food": {
        "perFigurePerRound": 1,
        "from": "What the party carries, or what it forages or buys that round.",
        "shortfall": {
          "health": -1
        },
        "shortfallNote": "A round that ends with a figure unfed costs that figure 1 health, every round it goes on. Nothing about being fed again puts the health back - see rest.medicalAid. Going hungry is a wound like any other."
      },
      "night": {
        "camp": "A party that stops before dark and makes camp restores every figure's strength to the number printed on its card. A bed at an inn does the same and costs rest.cost.",
        "noCamp": {
          "strength": -1
        },
        "noCampNote": "A party that travels a night leg, or ends the round without stopping, loses 1 strength from every figure in it. That is on top of the extra discovery roll a night leg already draws (movement.legs.nightRisk).",
        "cumulative": "Strength lost this way stacks night after night, and at 0 strength a figure does not fight and carries nothing (playerboard.json strength.atZero). Two hard nights turn a caravan guard into a passenger."
      },
      "notes": "This is the pressure that makes a lantern, a granary, an inn and a stretch of salted meat worth their coin - and the reason a shorter leg with a camp at the end of it often beats a longer one without."
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
        "encounter": {
          "$comment": "What to DO with a discovery roll that turns up a living thing, which the tables have always produced and the rules have never said how to run. The answer is the one piece of furniture already on the table: a player board. The thing you met gets one, and for the length of the encounter it is a player - a player who is not a person.",
          "rule": "Shuffle the deck the result names - monsters for a beast, characters for a stranger on the road - and deal one card face up onto a spare player board, into the character recess.",
          "setUp": "Set that board's tracks from the card exactly as a player sets their own at setup: health, strength, pace and mana off the printed strip. Its armour is a number on the card and does not move, so nothing walks it. It now has everything a player has and is run the same way, by whoever is to the left of the player who drew it.",
          "boards": "Print one player board per player plus one for the table. The spare is the encounter board, and it is why the board is generic (playerboard.json board.generic): the furniture does not care whether a person or a wolf is sitting behind it.",
          "afterwards": "When the encounter ends the card is put away - back into its deck, or onto the hex as a lair, or into the winner's hand if it was befriended, enslaved or domesticated (monsters.json encounterOptions). Clear the board's tokens. Nothing about the encounter is written down.",
          "why": "A monster with a board is a monster whose health and strength are visible to everyone, walked down in front of the table rather than tracked in one player's head - and a stranger met on the road is set up exactly like a hero, because that is exactly what they are to themselves."
        },
        "notes": "Discovery is what you find when you are NOT looking. Prospecting, foraging and hunting have their own recipes and roll tables, and a discovery roll never replaces a survey."
      },
      "notes": "A prospector entering a face-down tile flips it. Flipping reveals terrain immediately; deposits need a survey roll on top of that."
    },
    "rest": {
      "$comment": "Two different kinds of hurt, mended two different ways. Strength is spent, so sleep gives it back. Health is damage, so only a healer does. That split is what makes a night's camp a decision rather than a formality, and it is what makes a physician worth feeding.",
      "where": "Any settlement with an inn - every printed settlement has one; a player-built town needs the inn building. A camp made on open ground counts for strength and for nothing else.",
      "restoresStrength": "All of it. One night's sleep sets the strength token back to the number printed on the card, wherever that night is taken.",
      "restoresHealth": "None. Sleeping through a wound does not close it - see medicalAid.",
      "medicalAid": {
        "$comment": "The only thing that puts health back. Everything on this list is a person, a building or a bottle: health is repaired by somebody, never by time.",
        "healerPerRound": 3,
        "infirmaryPerRound": 3,
        "physicianPerRound": 2,
        "physicianNote": "A character whose card says so - Doctor Elspeth Marrow, for one - mends this much anywhere they stand, with no infirmary and no town.",
        "potion": "items.json potion-healing, which mends on the spot and is drunk doing it.",
        "cost": {
          "coin": 5,
          "note": "Per round of care. Waived in your own town, and at any inn or infirmary a quest reward names."
        }
      },
      "cost": {
        "coin": 5,
        "note": "A bed for the night. Waived in your own town, and at any inn a quest reward names. A camp on open ground is free."
      },
      "notes": "A resting character does nothing else that round. Vehicle damage is repaired separately - 1 box per round in any settlement of town rank or better, paying 5 coin per box."
    },
    "hirelings": {
      "where": "Hired at any inn, in any settlement of village rank or better.",
      "$statsNote": "Every figure in a fight needs a strength and something to swing, hirelings included - conflict.battle totals both off whoever is fighting. These are the numbers printed on the inn's board, and they are what you are paying for: the thug is strong and carries nothing, the militiaman is ordinary and is wearing a coat of plates, and the blade is better than either and rolls a third die.",
      "options": [
        {
          "id": "thug",
          "name": "Thug",
          "coinPerJourney": 20,
          "strength": 4,
          "armour": 0,
          "battle": 1,
          "note": "Refuses to fight monsters of strength 4 or more. Counts as a soldier for escort purposes."
        },
        {
          "id": "militia",
          "name": "Militiaman",
          "coinPerJourney": 35,
          "strength": 3,
          "armour": 2,
          "battle": 1,
          "note": "Steady. Fights anything."
        },
        {
          "id": "blade",
          "name": "Hired Blade",
          "coinPerJourney": 60,
          "strength": 5,
          "armour": 1,
          "battle": 2,
          "extraDie": true,
          "note": "Fights anything, and rolls a third blue die, keeping the best two."
        }
      ],
      "notes": "A hireling escorts one journey - a travelling party or a cargo in transit - then goes home. Hirelings eat no food; the fee is everything. An escorted cargo drops its theft risk to 0, same as a soldier escort. They do not eat and they do not sleep on your account either, so upkeep never touches them."
    },
    "conflict": {
      "$comment": "A battle is ONE SUBTRACTION and it is the same subtraction the market makes.\n\nIt used to be a to-hit roll: one die per unit, hit on a 4, shifted by your strength and their defence, clamped at both ends, with armour cancelling hits after they landed. That is four numbers, two of them doing nearly the same job, and a table that had to remember which way the clamp went.\n\nNow both sides total up and the difference is the wound. You roll TWO BLUE dice and add your strength and your gear; the thing you are fighting rolls TWO RED and adds its own. Whoever is lower loses health equal to the gap. Blue is what you want, red is what stands in your way, and it is the identical gesture a player has already made once this round on the market board - two blue against two red, subtract, read the difference. One pair of colours, two systems, no second thing to learn.\n\nDEFENCE IS GONE. It was the half of the old strength that made a strong thing hard to hurt, and it was a good fix for a to-hit roll. In an opposed total there is nothing for it to do that armour was not already doing: a stone boar that barely swings and turns a sword is a low strength and a high armour, which is two numbers saying two things, where strength-and-defence was two numbers saying one.",
      "battleDice": {
        "yours": "blue",
        "theirs": "red",
        "count": 2,
        "faces": 6
      },
      "roundsPerBattle": 1,
      "retreatAllowed": true,
      "lootFraction": 0.25,
      "battle": {
        "$comment": "The one line of arithmetic printed on the player board, because it is the only one a player needs while a monster card is face up in front of them.",
        "rule": "Both sides total strength, gear and dice. The lower total loses health equal to the difference.",
        "formula": "yours = your strength + your gear + 2 blue dice · theirs = its strength + its armour + 2 red dice · the lower loses health = the difference",
        "gear": "Your weapon's battle number plus every piece of armour you are wearing. A monster's gear is its armour and nothing else - its weapon is itself.",
        "worked": [
          "Strength 4 with a sword (+1) and a leather jerkin (+1) rolls 7 on the blue: 13. A cinder wolf, strength 2, armour 1, rolls 7 on the red: 10. The wolf takes 3 - and it has 4 health, so one more exchange finishes it.",
          "The same character against Vhalrik, strength 7, armour 3, who rolls 8: 18 against 13. The character takes 5, which is half of what they have.",
          "Equal totals wound nobody. Two figures who are the same and roll the same have had a fight and neither of them has anything to show for it, which is the honest answer."
        ],
        "ties": "A difference of nothing is no damage to anybody.",
        "simultaneous": false,
        "$simultaneousNote": "There is only one roll and only one loser, so hits are no longer applied both ways. Attacking is still never free: the dice decide who was better on the day, and being the attacker buys nothing at all.",
        "extraDice": "A few cards grant an extra die of your own colour - Ruk's escort trait, a hired blade. Roll it and KEEP THE BEST TWO. It is the only place in the game where more dice are rolled than are counted, and it is worth about a point and a half.",
        "appliesTo": "Any figure with a strength: characters (characters.json), monsters (monsters.json), and hirelings, which fight at the numbers printed on the inn's board."
      },
      "strength": {
        "$comment": "One number, three jobs, and it is the only number a figure brings to a fight of its own. Strength is what you SWING WITH - it is the base of your side of the battle roll. It is what you CARRY WITH - see carrying.kgPerStrength. And it is still the threat threshold some rules read off a monster card. It is also the number a hard night takes off you (upkeep.night), which is what ties the three together: an exhausted figure fights worse and carries less, and that is one token moving down one track.",
        "scale": "0 to the board's ceiling (components.json board.track). Characters run 2 to 6, monsters 2 to 7.",
        "carries": "strength x carrying.kgPerStrength kilograms. The card prints the kilograms; the track holds the strength.",
        "inABattle": "It is added to your total, straight, once. It never adds dice - everyone rolls two, and the very few things that grant a third say so on their own card.",
        "threshold": "Unchanged and read off the same number: a thug refuses a monster of strength 4 or more, monsters of strength 4+ get a free round against a fleeing cargo vehicle, and a boar spear earns its +3 against anything of strength 4 or more that charges.",
        "atZero": "A figure at 0 strength does not fight and carries nothing."
      },
      "armour": {
        "$comment": "What is between you and the blow, and the only piece of gear a monster has. It used to be two things - DEFENCE, which stopped a hit landing, and ARMOUR, which cancelled it after it had. In an opposed total there is no difference between those two sentences: both of them are a number that makes the other side's roll less likely to hurt you. So there is one number, it is called armour, and a monster's hide is on the same field as a suit of plate.",
        "scale": "0 upward. A worn suit runs 1 to 3, and a figure wearing body, head and off-hand can reach 5. Monsters run 0 to 3.",
        "adds": "Straight to your battle total, once per piece worn.",
        "wears": "One wear point per round of battle, on every piece worn - see rules.json wear. A blow you turned still dented the plate.",
        "$monsterNote": "A monster's armour is what its card prints in the A box, and it is the whole of the old defence rescaled: an ash drake is strong AND armoured, a rime harpy is neither, and a stone boar barely swings and still turns a sword."
      },
      "flee": {
        "$comment": "The option a party has always had, and now the one it has to earn. Fleeing used to be free - withdraw the way you came, lose your discovery roll, done - which made every monster optional and most of them decorative. You have to be FASTER than the thing you are running from, and half the bestiary is faster than a person on foot.",
        "rule": "A party may run only if its pace is GREATER than the monster's. Equal is not greater: a thing that matches you stays with you.",
        "pace": "The party's pace for the leg it is on - the number on the P track, off travel.json for its mode and the ground. The monster's is printed on its card.",
        "succeeds": "Withdraw the way you came and end your movement. No discovery roll this leg, and nothing is looted.",
        "refused": "A party that cannot outpace the monster may not decline the fight. It may still befriend it, or offer it something, or die.",
        "cargo": "Monsters of strength 4 or more get one free round of the battle roll against a fleeing cargo vehicle, whatever its pace.",
        "$whyNote": "It puts a road, a horse and a night's sleep into the same decision as a sword. A mounted party outruns nearly everything; a party on foot at the end of a hard week has a pace of 2 and outruns a mire strangler and nothing else."
      },
      "notes": "One roll, one loser, one wound. Both sides total strength, gear and dice; the lower total loses health equal to the difference; and a tie hurts nobody."
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "staple",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "staple",
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
        "pricing": "deplete",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "deplete",
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
        "pricing": "hype",
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
        "pricing": "staple",
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
        "baseValue": 8,
        "pricing": "staple"
      },
      {
        "id": "leather",
        "name": "Leather",
        "category": "material",
        "unit": "roll",
        "bulk": 1,
        "baseValue": 11,
        "pricing": "staple"
      },
      {
        "id": "ironware",
        "name": "Ironware",
        "category": "manufactured",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 22,
        "pricing": "staple",
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
        "baseValue": 15,
        "pricing": "staple"
      },
      {
        "id": "wool",
        "name": "Wool",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 6,
        "pricing": "staple"
      },
      {
        "id": "flax",
        "name": "Flax",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 5,
        "pricing": "staple"
      },
      {
        "id": "cotton",
        "name": "Cotton",
        "category": "textile",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 7,
        "pricing": "staple"
      },
      {
        "id": "yarn",
        "name": "Yarn",
        "category": "textile",
        "unit": "bundle",
        "bulk": 1,
        "baseValue": 12,
        "pricing": "staple"
      },
      {
        "id": "cloth",
        "name": "Cloth",
        "category": "textile",
        "unit": "bolt",
        "bulk": 1,
        "baseValue": 20,
        "pricing": "staple"
      },
      {
        "id": "fine-cloth",
        "name": "Fine Cloth",
        "category": "textile",
        "unit": "bolt",
        "bulk": 1,
        "baseValue": 38,
        "pricing": "hype",
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
        "baseValue": 6,
        "pricing": "staple"
      },
      {
        "id": "grain",
        "name": "Grain",
        "category": "food",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 5,
        "pricing": "staple",
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
        "baseValue": 9,
        "pricing": "staple"
      },
      {
        "id": "bread",
        "name": "Bread",
        "category": "food",
        "unit": "batch",
        "bulk": 1,
        "baseValue": 14,
        "pricing": "perish",
        "perishRounds": 3,
        "tags": [
          "staple"
        ],
        "notes": "Feeds 2 workers per unit instead of 1."
      },
      {
        "id": "vegetables",
        "name": "Vegetables",
        "shortName": "Greens",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 6,
        "pricing": "perish",
        "perishRounds": 3
      },
      {
        "id": "mushrooms",
        "name": "Mushrooms",
        "category": "food",
        "unit": "basket",
        "bulk": 1,
        "baseValue": 7,
        "pricing": "perish",
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
        "pricing": "perish",
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
        "pricing": "perish",
        "perishRounds": 4
      },
      {
        "id": "fish",
        "name": "Fish",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 7,
        "pricing": "perish",
        "perishRounds": 2
      },
      {
        "id": "meat",
        "name": "Meat",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 10,
        "pricing": "perish",
        "perishRounds": 2
      },
      {
        "id": "salted-meat",
        "name": "Salted Meat",
        "category": "food",
        "unit": "barrel",
        "bulk": 1,
        "baseValue": 18,
        "pricing": "staple",
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
        "pricing": "perish",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "perish",
        "perishRounds": 2
      },
      {
        "id": "grapes",
        "name": "Grapes",
        "category": "food",
        "unit": "crate",
        "bulk": 1,
        "baseValue": 8,
        "pricing": "perish",
        "perishRounds": 2
      },
      {
        "id": "hops",
        "name": "Hops",
        "category": "food",
        "unit": "sack",
        "bulk": 1,
        "baseValue": 7,
        "pricing": "staple"
      },
      {
        "id": "ale",
        "name": "Ale",
        "category": "drink",
        "unit": "barrel",
        "bulk": 2,
        "baseValue": 24,
        "pricing": "staple",
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
        "pricing": "hype",
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
        "pricing": "hype",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "hype",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "staple",
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
        "pricing": "hype",
        "tags": [
          "trade-good",
          "import-only"
        ],
        "notes": "Nothing on this map grows spices. They arrive at harbour markets and event cards, and that scarcity is the point - they are the pure trading commodity."
      },
      {
        "id": "gems",
        "name": "Gems",
        "category": "luxury",
        "unit": "pouch",
        "bulk": 0.5,
        "baseValue": 60,
        "pricing": "deplete",
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
        "pricing": "hype",
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
        "pricing": "staple",
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
        "pricing": "deplete",
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
        "pricing": "perish",
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
        "pricing": "staple",
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
        "pricing": "staple",
        "tags": [
          "foraged",
          "potion-ingredient"
        ],
        "notes": "Scraped off cold stone. The base of every physician's tonic."
      }
    ]
  },
  "pricing": {
    "$comment": "How a price is arrived at, and what a good's own nature does to it.\n\nPrices used to drift: one random family, one band, every round, and nothing anybody did to a market had any bearing on it. Then they were ROLLED and BENT - two red dice against two blue, a green die that multiplied the result, and a memory strip on the board that the commodity's model walked. That version was answerable and it was also the only sum in the game a player could get wrong: a swing halved and rounded toward zero, or doubled, with a modifier that had to go in BEFORE the multiplication.\n\nSo the multiplication is gone. THE WHOLE SUM IS ADDITION NOW, and it is one line:\n\n    net = Demand - Supply + Volatility + Modifier\n\nTwo BLUE dice are demand, two RED are supply, and one GREEN die says how rough the season is - minus two, nothing, or plus two, read off a strip of three cells. Whatever a good's own nature adds is the modifier, and it is added like everything else. Find the net on the swing ruler and walk the price that many bands. There is nothing to multiply, nothing to halve and nothing to round.\n\nThe colours changed with the sum, and for a reason that reaches past this file: BLUE IS WHAT YOU WANT AND RED IS WHAT STANDS IN THE WAY, everywhere in the game. In a market that is demand against supply. In a fight it is your dice against the thing you are fighting (rules.json conflict.battle) - the same two colours, the same subtraction, the same direction. A player who has rolled one market has already learned how a battle is scored.\n\nWHAT A GOOD IS decides what it adds, and every commodity is exactly one of four things. Most are STAPLE and add nothing - the dice are the whole story. A PERISHABLE adds nothing either and pays in a different currency: whatever is left at the end of the round faces the spoil die. A FINITE resource adds the lowest number still visible on its own depletion board, which only ever goes up, because every unit BURNED puts a token on that board and no token ever comes off. A SOUGHT good adds the move it made last round - it is bought because it is going up, and it is dumped for the same reason in reverse.\n\nFour models, sixty-six commodities, and not one of them needs a strip on a board any more. The price itself is written down, in ink, on the ledger (data/ledger.json), because a price is the one thing in this game worth having a record of.\n\nThis file is the SYSTEM. Which model a commodity runs under is on the commodity (data/commodities.json `pricing`); the bands the price walks are rules.json market.priceBands; the sheet that explains all of it is data/marketboard.json and data/components.json marketBoard; the sheet that records it is data/ledger.json. No commodity is named below, and no sheet dimension is either.",
    "version": "0.3.0",
    "dice": {
      "$comment": "Four colours, six dice, and the colour is the whole interface. BLUE is what you want; RED is what stands in your way; GREEN is how rough the weather is; OCHRE is what the season takes back. Nobody has to remember which pair is which, because the same two colours are subtracted the same way in a fight.\n\nThe fifth ink is BRUISE and it is the mana die (arcana.json manaDie), which is not a market die and is listed there. Between them the five dice are the palette's five inks, one each, and there is no sixth ink to make a seventh die out of.",
      "sets": [
        {
          "id": "demand",
          "name": "Demand",
          "colour": "blue",
          "count": 2,
          "faces": 6,
          "range": [
            2,
            12
          ],
          "means": "How badly the town wants the stuff this season. Two dice rather than one because a market is a crowd, and a crowd averages: 7 is an ordinary appetite and 12 is a famine year. Blue is added, always - in a market and in a fight."
        },
        {
          "id": "supply",
          "name": "Supply",
          "colour": "red",
          "count": 2,
          "faces": 6,
          "range": [
            2,
            12
          ],
          "means": "How much of it turned up. It is also the CAP on what the board will sell this round - see `stockCap` - so a low red roll is a shortage twice over: dear, and rationed. Red is subtracted, always."
        },
        {
          "id": "volatility",
          "name": "Volatility",
          "colour": "green",
          "count": 1,
          "faces": 6,
          "range": [
            1,
            6
          ],
          "means": "How rough the season is. Read on the volatility strip printed on the market board: it adds minus two, nothing, or plus two, and that is the whole of it."
        },
        {
          "id": "spoil",
          "name": "Spoil",
          "colour": "ochre",
          "count": 1,
          "faces": 6,
          "range": [
            1,
            6
          ],
          "means": "What the season takes back. Rolled at the end of every round against any perishable goods still in a player's hands, and read on the spoil strip. It never touches a price."
        }
      ],
      "note": "Six dice for the whole table, not six per player. One player rolls the market for every line on the ledger; every player rolls the spoil die for their own perishables."
    },
    "volatility": {
      "$comment": "The green die, and the one number in the sum that is not a count of anything. It used to be called ELASTICITY and it used to MULTIPLY. Neither survived. Elasticity is a word for how much a quantity answers a price, which is not what this die was ever doing - it was a weather roll on a market - and volatility is the word for that. And a multiplier in the middle of an addition is the one place a table gets a sum wrong: a swing of -7 halved toward zero, with a modifier that had to be folded in first, is three chances to slip in one line.\n\nThree cells, two faces each, and it adds. That is all it does now.",
      "die": "volatility",
      "steps": [
        {
          "id": "slack",
          "name": "Slack",
          "faces": [
            1,
            2
          ],
          "add": -2,
          "label": "−2",
          "means": "A quiet season with nobody pushing. Two off the swing, whichever way it fell."
        },
        {
          "id": "even",
          "name": "Even",
          "faces": [
            3,
            4
          ],
          "add": 0,
          "label": "0",
          "means": "An ordinary season. The dice are the whole story."
        },
        {
          "id": "rough",
          "name": "Rough",
          "faces": [
            5,
            6
          ],
          "add": 2,
          "label": "+2",
          "means": "A thin, jumpy market. Two on, and this is where the spikes come from."
        }
      ],
      "$addNote": "It ADDS, so it can turn a swing around: a -1 in a rough season is a +1, and a +1 in a slack one is a -1. A multiplier could never do that, and a market that is never turned over by the weather is a market with no weather in it."
    },
    "formula": {
      "$comment": "The whole sum, and it is deliberately one line of addition. Everything difficult about this system is in what a good IS, not in what is arithmetic at the table.",
      "net": "Demand − Supply + Volatility + Modifier",
      "then": "Read the net on the swing ruler printed on the market board. It says how many bands to move the price. Move the band bar on the line's ledger column; that is the new band.",
      "price": "The price is the commodity's base value at the band the bar now stands on. Every commodity's six prices are printed out in full in the annex, so the band is looked up and never multiplied. Write the new price in the ledger's next cell and strike the old one through.",
      "modifier": "Whatever the good's own model adds, and three of the four add nothing. A finite resource adds the lowest number still visible on its depletion board; a sought good adds the move it made last round; a staple and a perishable add nothing at all.",
      "clamp": "A band bar at the top of the ladder that is told to go up stays where it is, and the same at the bottom. A market can be at its ceiling; it cannot be above it.",
      "noMultiplication": "There is none, anywhere in the round. Not in the die, not in the modifier, not in the price - the price ladder is a printed table, not a sum."
    },
    "ruler": {
      "$comment": "The translation, and the reason the market board is worth printing rather than looking up. Seven cells across the sheet: find the net in one of them and the cell says how far the price moves.\n\nThe edges were re-cut when the multiplier went. Two blue dice against two red is a triangular spread peaking at nothing, and the green die widens it by two either way; the whole net now runs -12 to +12 before any modifier, where the old multiplied one reached 26. So the bins are tighter, and they are cut to leave the market moving in about seven rounds in ten - one band most of the time, two when the market is genuinely one-sided, and three only when the dice and the good's own nature are pulling together.",
      "bins": [
        {
          "id": "crash",
          "from": -99,
          "to": -9,
          "move": -3,
          "label": "≤ −9",
          "name": "Crash"
        },
        {
          "id": "slump",
          "from": -8,
          "to": -5,
          "move": -2,
          "label": "−8 … −5",
          "name": "Slump"
        },
        {
          "id": "soften",
          "from": -4,
          "to": -2,
          "move": -1,
          "label": "−4 … −2",
          "name": "Soften"
        },
        {
          "id": "hold",
          "from": -1,
          "to": 1,
          "move": 0,
          "label": "−1 … +1",
          "name": "Hold"
        },
        {
          "id": "firm",
          "from": 2,
          "to": 4,
          "move": 1,
          "label": "+2 … +4",
          "name": "Firm"
        },
        {
          "id": "rally",
          "from": 5,
          "to": 8,
          "move": 2,
          "label": "+5 … +8",
          "name": "Rally"
        },
        {
          "id": "spike",
          "from": 9,
          "to": 99,
          "move": 3,
          "label": "≥ +9",
          "name": "Spike"
        }
      ],
      "odds": {
        "$comment": "What the ruler actually does, over all 7776 rolls of five dice, with no modifier. Restated here so a change to the bins can be checked against the intention rather than against a memory of it.",
        "hold": 0.299,
        "oneBand": 0.458,
        "twoBands": 0.222,
        "threeBands": 0.021
      },
      "reach": {
        "$comment": "The widest net the dice and the modifiers can actually produce, checked by tools/validate-data.mjs against the bins above so the ruler can never have a hole in it.",
        "swing": [
          -10,
          10
        ],
        "note": "(2−12) at the extremes, plus a volatility of ±2, plus a modifier that runs -3 for a sought good in freefall and +6 for a seam that is worked out: -15 to +18."
      }
    },
    "modifier": {
      "$comment": "The one number a good's own nature contributes, added like everything else in the sum. There is no strip on any board for it and no bar walks it, which is what changed: it used to be a MEMORY, seven cells at the head of every market line, and the board had to be re-laid every time a model wanted a different range.\n\nNow each model says where its number is READ FROM, and every one of them is read off something that is already on the table for another reason - the depletion board that the tokens are going on anyway, or the move box on the ledger row that was written down anyway. Nothing is remembered and nothing extra is tracked.",
      "from": -3,
      "to": 6,
      "reads": "Add it to the swing. A bar on nothing is the ordinary case and three of the four models never leave it.",
      "$rangeNote": "The floor is a sought good three bands into a fall; the ceiling is a finite resource whose depletion board is down to its last row. Nothing else in the game reaches either."
    },
    "spoil": {
      "$comment": "The perishable model's die, and the one thing in the market that happens in a player's own hands rather than on a board. Rolled at the end of every round, once per perishable stack any player is still holding - grown, bought, looted or found, it makes no difference to a fish.\n\nIt replaced a countdown. Every perishable used to carry a number of rounds it kept for, which meant a token per stack with an age on it and a player who had to remember when the fish arrived. A die at the end of the round asks the same question and needs nothing written down: roll it, discard that many, move on.",
      "die": "spoil",
      "when": "At the end of the Feeding phase, before the market is rolled.",
      "who": "Every player, for every perishable commodity they hold - in a town, in a hold, or on a figure's back. The board's own stock does not spoil; the board is not holding it, it is selling it.",
      "keepsThreshold": 3,
      "$thresholdNote": "A commodity whose `perishRounds` is below this keeps POORLY and reads the right-hand column; the rest read the left. Milk and fish are one column over from apples and bread, and that is the whole of the difference perishRounds makes now.",
      "steps": [
        {
          "faces": [
            1,
            2
          ],
          "keepsWell": 0,
          "keepsPoorly": 1,
          "means": "A cold week."
        },
        {
          "faces": [
            3,
            4
          ],
          "keepsWell": 1,
          "keepsPoorly": 2,
          "means": "The ordinary loss."
        },
        {
          "faces": [
            5,
            6
          ],
          "keepsWell": 2,
          "keepsPoorly": 3,
          "means": "It turned."
        }
      ],
      "cap": "You cannot lose more than you hold. A stack of one that is told to lose three loses one.",
      "granary": "A stack held in a granary reads one row up the strip - a 5 or a 6 costs what a 3 or a 4 costs, and a 1 or a 2 costs nothing at all. That is what a granary is for, and it is why it takes food and drink and nothing else (rules.json storage.granaryAcceptsOnly).",
      "price": "None. A perishable's price is the dice and nothing but the dice. What spoilage does to a market it does through the market's own front door: units that rot are units nobody sells, and the town notices that the same way it notices everything else."
    },
    "depletion": {
      "$comment": "The finite model's board, and the only permanent mark in the game. One printed grid per finite commodity in play (data/marketboard.json depletion, drawn by tools/build-market.mjs onto its own sheet), and it works the way a seam works: the easy ore came out first, and what is left is dearer to win.\n\nA token goes on the grid every time a unit of that commodity is USED UP - burnt in a furnace, fed to an engine, consumed by a recipe. NOT when it is traded. Selling coal to a town moves coal; burning it destroys coal, and only the burning is what a seam notices. That distinction is the whole model: a merchant who never lights a fire can trade the same hundred tons of coal all game and the price will not move an inch for it.\n\nThe grid prints its numbers in rows. Cover cells from the lowest row up; the LOWEST NUMBER YOU CAN STILL SEE is the modifier, and it is added to the swing on every price check for that commodity. Nothing is written down and nothing is counted - you look at the grid and read the smallest number on it.\n\nTOKENS DO NOT COME BACK. A token placed here is out of the game for good. That is not an accounting convenience, it is the model: the ore is burnt, and burnt ore does not go back in the hill.",
      "step": 1,
      "per": 3,
      "top": 6,
      "$ladderNote": "Six steps of one, three cells to a step, plus a row of noughts to start on: seven rows of three, twenty-one cells, and the twenty-first unit burnt is the one that puts the price up by six for the rest of the game. `step` is what a row is worth, `per` is how many cells a row holds, `top` is the last row - and the grid is drawn from those three numbers, so making a seam last longer is one number here and a taller grid everywhere.",
      "onUse": "One token per unit consumed. Cover the lowest uncovered cell.",
      "onTrade": "Nothing. Buying and selling move a commodity; they do not spend it.",
      "reads": "The lowest number still visible. A fresh grid reads 0.",
      "recycle": false,
      "$capNote": "At the top row the seam is as good as worked out: the line spends the rest of the game bid up by six before a die is thrown, which on the swing ruler is two bands of rally with no help from anybody. The town that owns the last deposit owns the market, and it always did - this is the version of that sentence you can see across a table."
    },
    "sought": {
      "$comment": "The hype model's number, and the answer to the question it always begged: which delta?\n\nIt is the PREVIOUS move, in BANDS, and it is neither of the two things it could have been. Not the current move - that is what is being computed, and a modifier that depends on its own result is not a rule, it is an equation. Not the change in coin - 180 to 240 is +60 and no table wants a lookup that turns +60 into a number between -3 and +3.\n\nThe move in bands is already that number. The swing ruler produced it last round, it is between -3 and +3 by construction, and it is written in the move box on the ledger row where it happened. You do not compute the hype modifier; you read the box above the one you are about to write in.\n\nThat is why the market board could stop tracking anything. A sought good's whole memory is one pencil figure on a sheet that was being written on anyway.",
      "reads": "the move box on the ledger row above - ledger.json column.moveBox",
      "from": -3,
      "to": 3,
      "start": 0,
      "$startNote": "At setup nothing has moved, so every sought line starts on nothing, and the first round is played on the dice alone.",
      "$feedbackNote": "It is a feedback loop with a floor and a ceiling and no memory beyond one round, which is exactly the shape of the thing it is modelling. A rise makes buyers and buyers make a rise, until a bad roll turns it and the same machinery runs the other way just as fast. Two rounds of quiet and it is back to nothing, because a move of zero is what the next round reads."
    },
    "stockCap": {
      "$comment": "What stops a player emptying a market. The board will sell at most this round's supply roll, across everybody, and it is the reason the red dice are worth watching even when you are not buying.",
      "rule": "supply",
      "means": "The board sells at most Supply tokens of that commodity before the next Market phase, first come first served in turn order through the Actions phase. It will buy any quantity - a market always has room for more of what nobody wants."
    },
    "round": {
      "$comment": "Where this sits in the round. It is the Market phase of rules.json round.phases, opened out, with the spoil check sitting one phase earlier because rot is a thing that happens to food and not a thing that happens to a market.\n\nThe Market phase does NOT contain a trading window, and that is deliberate. Trading is an action like any other and it happens in the Actions phase, against the price the ledger is already showing - so a player can see what a thing is worth before they spend the hours getting it to market. What this phase does is fix the price everybody will trade at NEXT round. You act on a known price and find out afterwards what your acting did to it, which is the only honest way round for a market to work.",
      "phase": "market-turn",
      "steps": [
        {
          "id": "spoil",
          "name": "Spoil",
          "does": "At the end of Feeding, every player rolls the ochre die once for each perishable stack they hold and discards what the spoil strip says. Nothing about this touches a price."
        },
        {
          "id": "roll",
          "name": "Roll",
          "does": "Roll two blue, two red and one green for a line, and again for each line on the ledger. One player rolls for the whole table."
        },
        {
          "id": "add",
          "name": "Add the modifier",
          "does": "A finite line adds the lowest number still visible on its depletion board. A sought line adds the move box on the row above. A staple and a perishable line add nothing."
        },
        {
          "id": "fix",
          "name": "Fix the price",
          "does": "Find the net on the swing ruler and walk the band bar that many bands. Write the new price in the ledger, strike the old one through, and write the move in the row's move box - that last figure is next round's modifier for a sought good and a record of the season for everybody else."
        }
      ],
      "elsewhere": "Depletion tokens go on in the ACTIONS phase, in the hand of whoever burnt the fuel, and they go on one at a time as it is burnt. Nothing about that waits for this phase, and nothing about it can be undone in it."
    },
    "$modelsNote": "Each model says the same thing twice on purpose: once in prose for whoever is reading the rulebook, and once in a typed field - `modifier`, `reads`, `spoils`, `tokensOnUse` - for whatever is reading the data. docs/js/engine.js plays the game off the fields and tools/build-annex.mjs prints the prose, so a model cannot be changed in one place and left saying the old thing in the other.",
    "models": [
      {
        "id": "staple",
        "name": "Staple",
        "line": "It is worth what it is worth.",
        "history": "Most of what is bought and sold, in this game and everywhere else. Stone, lumber, cloth, rope, ale. It keeps, it is not running out, and nobody wants it for what owning it says about them - so its price is the crowd wanting it against the amount that turned up, and there is no story underneath.\n\nThe model exists so the other three mean something. A game where every good has a special rule is a game where no good does.",
        "modifier": 0,
        "reads": null,
        "spoils": false,
        "tokensOnUse": false,
        "assigns": "Anything durable that is neither dug out of a finite hole nor coveted for its own sake. The default, and the largest of the four by a long way.",
        "mark": {
          "id": "level-beam",
          "path": "M 12 4 V 8 M 4 8 H 20 M 6 8 V 12 M 18 8 V 12 M 3 12 H 9 M 3 12 Q 6 16.5 9 12 M 15 12 H 21 M 15 12 Q 18 16.5 21 12",
          "$note": "A balance, hanging level. Nothing on either pan, nothing tipping it - which is the whole of what this model says. It is the only mark in the set that is symmetrical, and that is doing the work: the other three are all lopsided, because the other three all lean one way."
        }
      },
      {
        "id": "perish",
        "name": "Perishable",
        "line": "What you do not shift, you lose.",
        "history": "The oldest problem in any market that grows things. The stuff turns up whether anybody wants it or not, it keeps badly, and what is still in the warehouse when the season turns is not an asset, it is a smell. A good harvest is a bad year, and it is a bad year for the person holding the harvest rather than for the market.\n\nThis is where the old GLUT model went. Glut bent the price down through a memory strip, which was a fair model of a market and a poor model of a fish: it punished the town for what the farmer did, and it never once made anybody hurry. The spoil die punishes the person actually holding the stuff, at the end of the round they failed to shift it, which is both truer and considerably more urgent.",
        "modifier": 0,
        "reads": null,
        "spoils": true,
        "tokensOnUse": false,
        "spoilStrip": "pricing.spoil",
        "assigns": "Anything that rots: food off the field, milk, meat, fish, fruit, and the one arcane herb that will not dry.",
        "mark": {
          "id": "picked-clean",
          "path": "M 3 12 H 18 M 3 12 L 6 9 M 3 12 L 6 15 M 18 12 L 21.5 8.5 M 18 12 L 21.5 15.5 M 8.5 12 L 7.6 8.7 M 8.5 12 L 7.6 15.3 M 11.5 12 L 11 8.3 M 11.5 12 L 11 15.7 M 14.5 12 L 14.3 8.3 M 14.5 12 L 14.3 15.7",
          "$note": "A fish skeleton: snout, spine, ribs, forked tail. It says gone off in every kitchen in the world and it engraves at chit size as five strokes and a fork. The first draft was a heaped measure overflowing its rim, which is a picture of a glut - and a glut is precisely what this model stopped being about."
        }
      },
      {
        "id": "deplete",
        "name": "Finite",
        "line": "The easy ore came out first.",
        "history": "The rule for anything that comes out of a hole. The first seam is at the surface and the last one is under water at the bottom of a shaft, so every ton that leaves makes the next ton dearer to win - and none of it grows back inside a lifetime. A mining town's prices only ever go one way, and the boom is the part before everybody notices.\n\nWhat changed is what counts as leaving. It used to be selling: a tally on the market board filled as tokens crossed to the board, and a market could be worked out by a merchant who never lit a fire. It is BURNING now. Coal that is traded is coal that still exists; coal that is fed to a furnace is gone, and only the furnace moves the number.",
        "modifier": null,
        "reads": "pricing.depletion",
        "spoils": false,
        "tokensOnUse": true,
        "assigns": "Anything a deposit yields, and anything smelted straight out of one. tools/validate-data.mjs checks the first half of that: a commodity a deposit yields and does not price by depletion is a hole in the ground that never runs dry.",
        "mark": {
          "id": "run-glass",
          "path": "M 5.5 3 H 18.5 M 5.5 21 H 18.5 M 6.5 3 L 12 12 L 6.5 21 M 17.5 3 L 12 12 L 17.5 21 M 8.8 19.4 Q 12 16 15.2 19.4",
          "$note": "A glass with the sand already down in the bottom bulb. Not a pick and not a shaft: what this model is about is the sand, not the digging - and not a trickle either, because a trickle drawn between two converging lines is invisible at the size this is engraved."
        }
      },
      {
        "id": "hype",
        "name": "Sought",
        "line": "It is bought because it is going up.",
        "history": "The market that runs on its own reputation. Nobody needs a jewel, a bolt of fine cloth or a famous horse - they want it because of what owning it says, and what it says is loudest when everybody can see the price climbing. So a rise makes buyers and buyers make a rise, until the day it does not and the whole thing runs the other way just as fast.",
        "modifier": null,
        "reads": "pricing.sought",
        "spoils": false,
        "tokensOnUse": false,
        "assigns": "The luxury trade: low bulk, high value, wanted for what it is rather than for what it does.",
        "mark": {
          "id": "rising-run",
          "path": "M 3 19 L 8.5 13.5 L 12.5 16.5 L 20 7 M 20 7 L 14.5 7 M 20 7 L 20 12.5",
          "$note": "A run of prices going up, with the arrow at the top of it. The one mark in the set that says which way it is pointing."
        }
      }
    ],
    "tokenMark": {
      "$comment": "Where a player finds out which model a commodity runs under, without a lookup. The commodity's own hexagonal token carries its model's mark in a corner, beside the family mark it already carries - so the piece you are about to stand on a ledger column tells you how that column behaves. The market board prints the four marks as its whole subject, because explaining them is now the only thing that board does.",
      "on": "components.json tokens.commodity",
      "drawnBy": "components.json marks.pricing"
    }
  },
  "tools": {
    "$comment": "Tools are equipment, not commodities: they are owned as individual pieces, they wear out, and they gate which recipes a worker may perform. They can still be bought, sold and stolen.\n\n`baseWear` is the most wear a tool will take, and it is ON THE BOARD'S SCALE now. It was `baseDurability` and it ran from 14 to 34, counted on the tool itself, because there was no track for it - and the reason there was no track was that a number running past twenty will not stand on a fourteen-rung ladder. There is a track now, four of them, one beside each kit slot on the player board (data/playerboard.json), so the number came down to meet the board rather than the board going up to meet the number - the same trade the kilogram made when a hero could not stand their own load on it.\n\nNothing got shorter, because the clock changed with the scale: wear was one point a LABOUR HOUR and is one point a JOB (rules.json wear). An axe was 24 wear at 3 hours a job, which is eight jobs; it is 10 wear at one a job, which is ten. Slightly longer-lived, and nobody adds hours up any more.\n\nA tool is not the only thing that wears any more either. Everything a figure carries does - see data/items.json - and this file is simply where the first things that did are kept.",
    "version": "0.1.0",
    "tools": [
      {
        "id": "axe",
        "name": "Axe",
        "cardCode": "TOL-01",
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
        "baseWear": 10,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "story": "The first tool a settlement buys and the last one it will let go. Forest into lumber, and lumber into everything else there is.",
        "enables": [
          "fell-timber",
          "clear-forest",
          "hew-timber"
        ]
      },
      {
        "id": "saw",
        "name": "Saw",
        "cardCode": "TOL-02",
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
        "baseWear": 11,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "story": "An axe takes the tree down; a saw decides what it becomes. The teeth are the expensive part and the reason it sleeps indoors.",
        "enables": [
          "saw-lumber",
          "build-timber-frame"
        ]
      },
      {
        "id": "pick",
        "name": "Pick",
        "cardCode": "TOL-03",
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
        "baseWear": 8,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "story": "Everything under the hills comes up through the eye of one of these. Miners name theirs, which tells you most of what you need to know about mining.",
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
        "baseWear": 9,
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
        "cardCode": "TOL-04",
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
        "baseWear": 12,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "story": "The tool that makes the tools. A smithy is a fire, an anvil and this, and the first two can be borrowed.",
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
        "baseWear": 8,
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
        "baseWear": 8,
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
        "cardCode": "TOL-05",
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
        "baseWear": 9,
        "sizes": [
          "small",
          "medium",
          "large"
        ],
        "optional": true,
        "story": "Set the nibs to the man, never the man to the snaith. A harvest is won in the fitting and lost in the sharpening.",
        "enables": [
          "harvest-grain",
          "harvest-flax",
          "harvest-hops",
          "harvest-vegetables",
          "harvest-cotton"
        ],
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
        "baseWear": 12,
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
        "baseWear": 8,
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
        "baseWear": 12,
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
        "baseWear": 14,
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
        "baseWear": 10,
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
        "baseWear": 7,
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
        "baseWear": 6,
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
    "$comment": "Buildings are placed on tiles, cost commodities up front, take build-points of effort to finish, and then act as sites where recipes may be run. workerSlots caps how many workers may be allocated to that building in a single round.\n\nHOW BIG a building's tile is is not written here. It is worked out from the numbers below - the effort it takes to raise, and what it has to hold - through the ground model and ladder in data/buildingtiles.json, so adding a worker slot can grow the tile and the build says so. The one thing a building may say about its own tile is `shortName`: the label printed on the piece, for a name that will not set above the press floor on a 17 mm band. One building needs one today, and the build names any others the day they appear.",
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
        "yard": "walls",
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
        "shortName": "Cottage",
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
        "yard": "walls",
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
        "shortName": "Terrace",
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
        "yard": "walls",
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
        "yard": "yard",
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
        "shortName": "Camp",
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
        "yard": "works",
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
        "yard": "works",
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
        "summary": "Digs clay from marshes, river banks and wet ground.",
        "cost": [
          {
            "commodity": "logs",
            "qty": 2
          }
        ],
        "buildPoints": 5,
        "minRounds": 1,
        "yard": "works",
        "workerSlots": 3,
        "terrain": [
          "marsh",
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
        "yard": "works",
        "workerSlots": 3,
        "terrain": [
          "desert"
        ],
        "orWaterside": "any",
        "$watersideNote": "Desert sand, OR the sand any water leaves on its bank - a sea shore, a lake rim, a river bar. `orWaterside` is an alternative to the terrain list, the way recipes.json site.orWaterside is; `waterside` on its own (the dock, the harbour) is a requirement on top of it. This is the pair of keys the coast terrain used to hide: coast was in the list and meant both things at once."
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
        "yard": "yard",
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
        "shortName": "Derrick",
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
        "yard": "works",
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
        "yard": "walls",
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
        "yard": "yard",
        "workerSlots": 4,
        "fieldSlots": 4,
        "terrain": [
          "grassland"
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
        "yard": "works",
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
        "yard": "works",
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
        "yard": "works",
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
        "yard": "walls",
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
        "summary": "Fishing, and the cheap end of water transport. Goes on any land the water reaches - a sea shore, a lake rim or a river bank all do.",
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
        "yard": "walls",
        "workerSlots": 3,
        "waterside": "any"
      },
      {
        "id": "sawmill",
        "name": "Sawmill",
        "category": "production",
        "tier": 1,
        "summary": "Logs into lumber. Doubles its rate on a waterside tile - water drives the saw.",
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
        "yard": "works",
        "workerSlots": 3,
        "terrain": [
          "forest",
          "grassland",
          "hills"
        ]
      },
      {
        "id": "charcoal-kiln",
        "name": "Charcoal Kiln",
        "shortName": "Hearth",
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
        "yard": "yard",
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
        "yard": "works",
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
        "shortName": "Foundry",
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
        "yard": "works",
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
        "shortName": "Kiln",
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
        "yard": "works",
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
        "shortName": "Glazier",
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
        "yard": "works",
        "workerSlots": 3,
        "terrain": [
          "grassland",
          "hills",
          "desert"
        ]
      },
      {
        "id": "blacksmith",
        "name": "Blacksmith",
        "shortName": "Smithy",
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
        "yard": "yard",
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
        "shortName": "Joinery",
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
        "yard": "walls",
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
        "shortName": "Weaver",
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
        "yard": "walls",
        "workerSlots": 3,
        "specialist": "weaver",
        "terrain": [
          "grassland",
          "forest",
          "hills"
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
        "yard": "works",
        "workerSlots": 2,
        "terrain": [
          "grassland",
          "marsh"
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
        "yard": "walls",
        "workerSlots": 2,
        "specialist": "tailor",
        "requiresBuilding": "weaver"
      },
      {
        "id": "mill",
        "name": "Mill",
        "category": "production",
        "tier": 1,
        "summary": "Grain into flour. Free extra output on a hills tile or a waterside one (wind and water).",
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
        "yard": "yard",
        "workerSlots": 2,
        "terrain": [
          "grassland",
          "hills"
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
        "yard": "walls",
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
        "yard": "walls",
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
        "yard": "walls",
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
        "yard": "yard",
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
        "yard": "yard",
        "workerSlots": 3,
        "requiresBuilding": "vineyard"
      },
      {
        "id": "warehouse",
        "name": "Warehouse",
        "shortName": "Stores",
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
        "yard": "yard",
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
        "yard": "yard",
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
        "yard": "yard",
        "workerSlots": 2,
        "notes": "Cheap on purpose. The market is the safety net: any player who has lost their tools can gather deadwood by hand, put up a stall, and buy a replacement."
      },
      {
        "id": "trading-house",
        "name": "Trading House",
        "shortName": "Trader",
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
        "yard": "walls",
        "workerSlots": 2,
        "specialist": "merchant",
        "requiresBuilding": "market",
        "victoryPoints": 2
      },
      {
        "id": "town-hall",
        "name": "Town Hall",
        "shortName": "Town",
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
        "yard": "walls",
        "workerSlots": 1,
        "storage": 6,
        "unique": "per-town"
      },
      {
        "id": "guildhall",
        "name": "Guildhall",
        "shortName": "Guild",
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
        "yard": "walls",
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
        "yard": "yard",
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
        "shortName": "Hospice",
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
        "yard": "yard",
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
        "yard": "yard",
        "workerSlots": 2,
        "garrison": 4
      },
      {
        "id": "watchtower",
        "name": "Watchtower",
        "shortName": "Tower",
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
        "yard": "walls",
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
        "yard": "walls",
        "workerSlots": 0
      },
      {
        "id": "alchemist",
        "name": "Alchemist",
        "shortName": "Alchemy",
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
        "yard": "walls",
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
        "yard": "walls",
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
        "yard": "works",
        "workerSlots": 2,
        "waterside": "sea",
        "requiresBuilding": "dock",
        "victoryPoints": 2
      },
      {
        "id": "rail-depot",
        "name": "Rail Depot",
        "shortName": "Depot",
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
        "yard": "works",
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
            "marsh"
          ],
          "orWaterside": "fresh"
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
        "notes": "+1 lumber if the sawmill is on a waterside tile."
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
        "startTile": true,
        "mark": {
          "id": "tussock",
          "path": "M6 19c0-3.6 1-6.2 3-8.2M12 19c0-5.2 0.7-8.8 2-11.6M18 19c0-3.6-1-6.2-3-8.2"
        }
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
        "startTile": true,
        "mark": {
          "id": "conifer",
          "path": "M12 21v-4.4M12 3.6 5.6 16.6h12.8z"
        }
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
        ],
        "mark": {
          "id": "hummock",
          "path": "M2.5 17.5q4.6-7.4 9.2 0M11.6 17.5q4.6-6.4 9.2 0"
        }
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
        ],
        "mark": {
          "id": "peak",
          "path": "M2 19 9 7.6l4.4 6.8 3-4.4L22 19z"
        }
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
        ],
        "mark": {
          "id": "reeds",
          "path": "M3 18h18M8 18V8.2M12 18V5.2M16 18V9.6"
        }
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
        "effortPenalty": -1,
        "mark": {
          "id": "frost",
          "path": "M12 4v16M5.2 8l13.6 8M18.8 8 5.2 16"
        }
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
          "sand",
          "salt"
        ],
        "deposits": [
          "salt-dome",
          "oil-field",
          "gem-vein"
        ],
        "requiresWaterForFarming": true,
        "mark": {
          "id": "dune",
          "path": "M2 16.6q5.2-7.4 10.4-3.2M12.4 13.4q4 2.6 9.6 1.2M4.4 20.4q3.6-3 7.2-1.4"
        }
      },
      {
        "id": "river",
        "name": "River",
        "code": "R",
        "family": "water",
        "colour": "#6ea7c6",
        "summary": "A watercourse wide enough to be its own hex. Fresh water and fish, a barge lane running inland, and a wall across any road that has not been bridged.",
        "moveCost": 99,
        "roadCostMultiplier": 0,
        "railCostMultiplier": 0,
        "buildable": false,
        "bridgeable": true,
        "features": [
          "fish",
          "fresh-water",
          "reeds"
        ],
        "navigableBy": [
          "barge"
        ],
        "mark": {
          "id": "current",
          "path": "M5 3.4v17.2M19 3.4v17.2M8 12.6q2-1.8 4 0t4 0"
        }
      },
      {
        "id": "lake",
        "name": "Lake",
        "code": "L",
        "family": "water",
        "colour": "#5f9cbe",
        "summary": "Standing fresh water with land all round it. Barges work it, ships never reach it, and every tile on its rim is waterside.",
        "moveCost": 99,
        "roadCostMultiplier": 0,
        "railCostMultiplier": 0,
        "buildable": false,
        "bridgeable": true,
        "features": [
          "fish",
          "fresh-water",
          "reeds"
        ],
        "navigableBy": [
          "barge"
        ],
        "mark": {
          "id": "pool",
          "path": "M12 5.2c5.3 0 8.4 2.9 8.4 6.8s-3.1 6.8-8.4 6.8-8.4-2.9-8.4-6.8 3.1-6.8 8.4-6.8zM8 12.6q2-1.6 4 0t4 0"
        }
      },
      {
        "id": "shallow-water",
        "name": "Shallow Water",
        "code": "S",
        "family": "water",
        "colour": "#7fb6cf",
        "summary": "Straits, inshore sea and river mouths. Crossable by bridge, navigable by barge.",
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
        ],
        "mark": {
          "id": "shoal",
          "path": "M2 8.6q5-3.4 10 0t10 0M5.6 15.4h4.8M13.6 15.4h4.8"
        }
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
        ],
        "mark": {
          "id": "swell",
          "path": "M2 6.6q5-3.4 10 0t10 0M2 12.6q5-3.4 10 0t10 0M2 18.6q5-3.4 10 0t10 0"
        }
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
    "siting": {
      "$comment": "Where the coast went.\n\nCoast was a terrain that meant 'the edge of the water', which quietly made a shore a KIND OF GROUND rather than something a piece of ground happens to be next to. It cost the map twice: a beach in front of a forest had to be drawn as neither forest nor beach, and a town on a lake could not have a dock at all unless the artist painted a ring of sand round the lake first. The edge of the water is a RELATIONSHIP, and it is stated as one here - read off the map the moment somebody asks, printed on no hex, and true of a river bank, a lake rim and a sea shore alike without three terrains to say so.",
      "waterside": {
        "id": "waterside",
        "name": "Waterside",
        "rule": "A land tile with at least one water tile beside it. It is not a terrain, it is never printed on a hex, and no map has to be redrawn to make one.",
        "kinds": {
          "$comment": "Which water counts, for the thing being sited. A harbour wants the sea; a tannery only wants water.",
          "any": [
            "river",
            "lake",
            "shallow-water",
            "deep-water"
          ],
          "fresh": [
            "river",
            "lake"
          ],
          "sea": [
            "shallow-water",
            "deep-water"
          ]
        },
        "grants": [
          "fresh water without a well, beside a river or a lake",
          "a dock, and the fishing on the water tile it reaches (features fish)",
          "a harbour, beside the sea, and the shipping that comes with it",
          "water power: a mill or a sawmill on a waterside tile takes the bonus its own line names"
        ],
        "declaredBy": {
          "$comment": "Two keys, because there are two things a shore was doing. Both take one of the kinds above, and tools/validate-data.mjs fails the build on a value that is not one of them.",
          "waterside": "a REQUIREMENT, on top of whatever ground the thing already needs: the dock and the harbour. Nothing else will do.",
          "orWaterside": "an ALTERNATIVE to the terrain list, the way recipes.json site.orTerrain is an alternative to site.building: the sand pit is desert sand OR the sand any water leaves on its bank. Drawing water is a well, a marsh, or fresh water beside you.",
          "note": "Coast in a terrain list used to mean both of these at once, and which one it meant depended on the building. That is the whole argument for splitting it."
        },
        "checked": "tools/validate-map.mjs: a settlement with a harbour has to stand on a tile the sea reaches, and a river or lake hex with no land beside it at all is not a river or a lake. tools/validate-data.mjs: every waterside and orWaterside value is one of the kinds above."
      }
    },
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
        "grassland": 0.32,
        "forest": 0.2,
        "hills": 0.14,
        "mountain": 0.08,
        "marsh": 0.06,
        "tundra": 0.04,
        "desert": 0.04,
        "river": 0.04,
        "lake": 0.02,
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
        "summary": "Common and shallow. Often visible without a survey on marsh and waterside tiles."
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
          "river",
          "lake"
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
          "deep-water"
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
        "notes": "Ignores terrain entirely - there is no ground up there - but it is the only mode weather can stop dead, and the only one with nowhere to tie up. It must end each journey at a settlement or lose 1 hull to the mooring. Cargo aboard an airship cannot be robbed on the road; it can be dropped."
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
        "summary": "One per player, free at setup. Carries potions and equipment, rolls an extra combat die, and never starves. A character card from data/characters.json gives the hero a name, a face, and the summary strip every other number is read off.",
        "carries": 3,
        "unique": true
      }
    ]
  },
  "peoples": {
    "$comment": "Who does the work. Peoples set a player's baseline (die size, terrain comfort, food quirks, how they hold mana). Professions are individual workers upgraded at a guildhall - they unlock recipes that plain workers cannot run. manaStorage.innate is how much mana a body of that people can hold with no talisman; everyone can hold more in a talisman (items.json, class talisman). strength.base is what a figure of that people swings with AND what it carries with: kilograms are strength x rules.carrying.kgPerStrength, so a people's carrying is not a second number and never was. There is no defence.base any more - defence went when the to-hit roll it shifted went, and what stands between a figure and a blow is the armour it is wearing (rules.json conflict.armour), which is a thing a people is not born with. A character card prints its own strength, that base adjusted for build and calling, in the summary strip across the top.",
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
          "forest",
          "hills"
        ],
        "strength": {
          "base": 3,
          "note": "The middle of every scale, this one included - a human wins no fight on build alone."
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
        "strength": {
          "base": 4,
          "note": "Low, braced and used to swinging something heavy in a confined space."
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
        "strength": {
          "base": 2,
          "note": "An elf fights with reach and timing. Strength is the one contest they decline."
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
          "forest"
        ],
        "strength": {
          "base": 2,
          "note": "Small, and entirely uninterested in being told about it."
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
        "strength": {
          "base": 5,
          "note": "The strongest arm any figure in the game brings to a fight."
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
          "Towns on a marsh tile, or waterside on a river or a lake - anywhere with fresh water - are unaffected."
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
            "target": "region-river"
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
    "$comment": "Equipment carried by workers, figures and soldiers. EVERYTHING HERE WEARS OUT except the things that are drunk and the things that hold mana. `wear` is the most wear a thing will take: printed as the W box on its card, set on the W track beside that card's own slot on the player board, and knocked down a rung every time the thing is used (rules.json wear). It used to be tools alone that wore, which made a sword immortal, a rope eternal and buying an axe the only equipment decision anybody ever made twice.\n\nA weapon adds its `battle` number to your side of the battle roll and a piece of armour adds its `armour` number. Both are straight additions to one opposed total (rules.json conflict.battle). They were `combatDice` and `armourValue` - dice granted and hits cancelled - which were two different currencies for the same job in a system that no longer counts hits at all, and the effects that used to say 'ignore the first two hits' now say what they are worth.\n\nEvery item has a massKg - what it weighs, in kilograms - because a figure's carrying capacity is measured the same way: see rules.json carrying, where the limit is strength x kgPerStrength and a character card prints the kilograms in its summary strip. Mass is not bulk; bulk is the storage and shipping cost of a commodity (commodities.json), and no item has one. A talisman card prints its capacity as an M box in the strip like everything else; the mana itself is walked on the player board's M track, because that is where every track in the game lives now (data/playerboard.json).",
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
        "summary": "Adds its armour number to your battle total. Wears 1 for every round of every battle it is worn in - a blow you turned still dented the plate."
      },
      {
        "id": "weapon",
        "name": "Weapon",
        "summary": "Adds its battle number to your battle total. Wears 1 for every round of every battle it is swung in."
      },
      {
        "id": "gear",
        "name": "Gear",
        "summary": "Kit that is not for fighting, wearing or drinking: rope, a hook, a bag, a glass. It does a job on the road and it frays doing it, and its card says what counts as a use."
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
        "summary": "Stores mana. Most peoples cannot hold mana in the body at all - see peoples.json manaStorage. Track stored mana on the player board's M track - the card prints the capacity and nothing more."
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
        "massKg": 0.5,
        "wear": 3,
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
        "massKg": 1.5,
        "wear": 5,
        "effects": [
          "Immune to Hard Frost.",
          "No tundra or mountain effort penalty."
        ]
      },
      {
        "id": "travelling-cloak",
        "name": "Travelling Cloak",
        "class": "clothing",
        "cardCode": "ITM-07",
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
        "massKg": 1,
        "wear": 5,
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
        "massKg": 0.75,
        "wear": 4,
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
        "massKg": 0.75,
        "wear": 3,
        "effects": [
          "A merchant wearing these gets a further 10% on every market sale.",
          "Worth 2 victory points at game end."
        ]
      },
      {
        "id": "leather-jerkin",
        "name": "Leather Jerkin",
        "class": "armour",
        "cardCode": "ARM-01",
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
        "massKg": 2.5,
        "story": "Two hides, a winter of waxing, and the honest admission that it will stop a knife once and then go back to being a coat.",
        "effects": [
          "+1 to your battle total.",
          "Wears 1 per round of battle. At 0 it is a coat."
        ],
        "armour": 1,
        "wear": 5
      },
      {
        "id": "chain-mail",
        "name": "Chain Mail",
        "class": "armour",
        "cardCode": "ARM-04",
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
        "massKg": 6,
        "story": "Twenty thousand rings, every one of them closed by hand. Smiths price a hauberk by the month rather than by the pound, and nobody has ever argued.",
        "effects": [
          "+2 to your battle total.",
          "Wears 1 per round of battle."
        ],
        "armour": 2,
        "wear": 8
      },
      {
        "id": "plate-harness",
        "name": "Plate Harness",
        "class": "armour",
        "cardCode": "ARM-05",
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
        "massKg": 12.5,
        "specialist": "smith",
        "story": "Fitted to one body and worth a farm. It turns a blade and it turns an arrow, and it turns a running man into a walking one.",
        "effects": [
          "+3 to your battle total.",
          "-1 move point, which is also -1 pace when you are running from something.",
          "Wears 1 per round of battle."
        ],
        "armour": 3,
        "wear": 12
      },
      {
        "id": "helm",
        "name": "Helm",
        "class": "armour",
        "cardCode": "ARM-02",
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
        "massKg": 1.25,
        "story": "A helm is cheap and a head is not. Every recruiting sergeant in the world has made that speech and none of them has ever had to improve it.",
        "effects": [
          "+1 to your battle total.",
          "Wears 1 per round of battle, and a helm that goes at 0 has done its whole job once."
        ],
        "armour": 1,
        "wear": 6
      },
      {
        "id": "shield",
        "name": "Shield",
        "class": "armour",
        "cardCode": "ARM-03",
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
        "massKg": 2,
        "story": "Boards, hide glue, a rim and a boss. The cheapest thing in the armoury and the last one anybody puts down.",
        "effects": [
          "+1 to your battle total.",
          "Wears 1 per round of battle. Boards are cheap - a shield is the thing you expect to replace."
        ],
        "armour": 1,
        "wear": 5
      },
      {
        "id": "sword",
        "name": "Sword",
        "class": "weapon",
        "cardCode": "WPN-01",
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
        "massKg": 0.75,
        "story": "Every smith makes one and most never make another. Iron for the blade, leather for the grip, and a week of somebody’s life in the edge.",
        "effects": [
          "+1 to your battle total.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 7
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
        "massKg": 0.75,
        "specialist": "smith",
        "effects": [
          "+2 to your battle total.",
          "Roll a third blue die and keep the best two.",
          "Wears 1 per round of battle. Steel holds an edge: it is the longest-lived blade in the deck."
        ],
        "battle": 2,
        "extraDie": true,
        "wear": 10
      },
      {
        "id": "war-axe",
        "name": "War Axe",
        "class": "weapon",
        "cardCode": "WPN-02",
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
        "massKg": 1.5,
        "story": "A woodsman’s axe with the beard drawn out and the haft left long. It costs a third of what a sword costs, and nobody has ever raised that during a fight.",
        "effects": [
          "+1 to your battle total, and +2 instead in any battle you started.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 6
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
        "massKg": 2.25,
        "effects": [
          "+1 to your battle total, and +3 instead when defending a town or a wall.",
          "Two hands: it cannot be used with a shield.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 5
      },
      {
        "id": "bow",
        "name": "Bow",
        "class": "weapon",
        "cardCode": "WPN-04",
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
        "massKg": 0.5,
        "story": "One stave, one string, and ten years learning to draw it. The bow sells for the price of a goat; the arm is not for sale.",
        "effects": [
          "+2 to your battle total.",
          "At reach: if you win the roll, nothing you are wearing takes wear this round.",
          "+1 output on Hunt Game.",
          "Needs a quiver to fight.",
          "Wears 1 per round of battle."
        ],
        "battle": 2,
        "wear": 6
      },
      {
        "id": "quiver",
        "name": "Quiver of Arrows",
        "class": "gear",
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
        "massKg": 1,
        "effects": [
          "Holds 3 uses. Each battle with a bow or a crossbow spends 1.",
          "The uses ARE the wear: an empty quiver is a spent quiver."
        ],
        "uses": 3,
        "wear": 3
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
        "massKg": 0.25,
        "effects": [
          "+1 to your battle total for halflings only. Everyone else may as well throw the stone.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 3
      },
      {
        "id": "war-hammer",
        "name": "War Hammer",
        "class": "weapon",
        "cardCode": "WPN-03",
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
        "massKg": 3,
        "story": "Made for the century when armour won. It does not cut, it has never needed to, and it does not care in the least what you are wearing.",
        "effects": [
          "+2 to your battle total.",
          "Ignores armour entirely: take the whole of the other side armour off their total, monster hide included.",
          "Two hands.",
          "Wears 1 per round of battle."
        ],
        "battle": 2,
        "wear": 9
      },
      {
        "id": "crossbow",
        "name": "Crossbow",
        "class": "weapon",
        "cardCode": "WPN-05",
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
        "massKg": 2.5,
        "specialist": "smith",
        "story": "Steel prod, seasoned tiller, six months at a bench. Hand it to a farmhand on the Monday and by Friday he can kill a knight.",
        "effects": [
          "+3 to your battle total, and 1 off the other sides armour.",
          "Slow: it counts in the first round of a battle and every second round after. In the rounds it is spanning you fight on strength alone.",
          "Two hands. Needs a quiver to fight.",
          "Wears 1 per round it counts in."
        ],
        "battle": 3,
        "wear": 8
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
        "massKg": 2,
        "effects": [
          "+1 to your battle total, and +3 instead against any water-element monster or anything bigger than a horse.",
          "The line holds it: a struck monster cannot flee, and neither can you while it holds. It breaks on a d6 roll of 1 each round.",
          "Two hands. +1 output on Fish.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 5
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
        "massKg": 0.4,
        "effects": [
          "+1 to your battle total.",
          "Carried out of sight: bandits, tolls and confiscations never take it, and it is not lost when a character falls.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 5
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
        "massKg": 2,
        "specialist": "smith",
        "effects": [
          "+3 to your battle total.",
          "Roll a third blue die and keep the best two.",
          "-1 move point. Two hands: no shield.",
          "Worth 1 victory point at game end.",
          "Wears 1 per round of battle."
        ],
        "battle": 3,
        "extraDie": true,
        "wear": 11
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
        "massKg": 1.5,
        "effects": [
          "+1 to your battle total, and +3 instead in the first round against any monster that charges - anything of strength 4 or more that attacks first.",
          "The crossbar holds it off you: take no wound at all in that first round, whatever the difference.",
          "Two hands. +1 output on Hunt Game.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 5
      },
      {
        "id": "dagger",
        "name": "Dagger",
        "class": "weapon",
        "cardCode": "WPN-06",
        "slot": "hand",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "pig-iron",
            "qty": 1
          }
        ],
        "effortHours": 1,
        "baseValue": 20,
        "massKg": 0.3,
        "story": "The weapon everybody actually owns. It cuts rope, opens a letter, guts a fish, and settles an argument in a doorway where nothing longer would fit.",
        "effects": [
          "+1 to your battle total.",
          "Light enough that it never fills a hand: a dagger sits in a kit slot with another weapon and both may be used.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 4
      },
      {
        "id": "staff",
        "name": "Staff",
        "class": "weapon",
        "cardCode": "WPN-07",
        "slot": "two-hand",
        "madeAt": "carpenter",
        "inputs": [
          {
            "commodity": "lumber",
            "qty": 1
          }
        ],
        "effortHours": 1,
        "baseValue": 25,
        "massKg": 1.25,
        "story": "Ash, shoulder high, worn pale where the hand goes. Nobody has ever been arrested for carrying one, which is most of the argument for it.",
        "effects": [
          "+1 to your battle total, and +2 instead for a figure holding any mana at all.",
          "A staff is a road as much as a weapon: +1 pace on any leg made on foot.",
          "Two hands: it cannot be used with a shield.",
          "Wears 1 per round of battle."
        ],
        "battle": 1,
        "wear": 6
      },
      {
        "id": "coil-of-rope",
        "name": "Coil of Rope",
        "class": "gear",
        "cardCode": "ITM-01",
        "slot": "carried",
        "madeAt": "weaver",
        "inputs": [
          {
            "commodity": "rope",
            "qty": 2
          }
        ],
        "effortHours": 2,
        "baseValue": 18,
        "massKg": 2,
        "wear": 6,
        "story": "Fifteen fathoms of hemp, laid up by somebody who would be very unhappy to hear it called string. It is the first thing an expedition packs and the first thing it is glad of.",
        "effects": [
          "Hills and mountain cost the whole party 1 less to cross, minimum 1.",
          "A grappling hook is useless without one.",
          "Wears 1 for every leg it is used on, and 1 more for any fall it stops."
        ]
      },
      {
        "id": "grappling-hook",
        "name": "Grappling Hook",
        "class": "gear",
        "cardCode": "ITM-04",
        "slot": "carried",
        "madeAt": "blacksmith",
        "inputs": [
          {
            "commodity": "ironware",
            "qty": 1
          },
          {
            "commodity": "rope",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 45,
        "massKg": 1.5,
        "wear": 5,
        "story": "Four flukes and a ring, and a reputation it has never once been able to shake. Quartermasters issue them for cliffs. Nobody has ever used one for a cliff.",
        "effects": [
          "With a coil of rope: cross one cliff, ravine or wall as though it were open ground, once per leg.",
          "Board a ship at sea, or get over a town wall without troubling the gate.",
          "Wears 1 per use, and 1 more on a d6 roll of 1 - a hook that skates does not come back the same shape."
        ]
      },
      {
        "id": "bag",
        "name": "Bag",
        "class": "gear",
        "cardCode": "ITM-05",
        "slot": "belt",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "effortHours": 1,
        "baseValue": 12,
        "massKg": 0.3,
        "wear": 4,
        "story": "A square of cloth, four seams and a drawstring. It costs less than a meal and it is the difference between carrying your money and leaving it behind.",
        "effects": [
          "+2 kg to what the figure can shoulder (rules.json carrying) - which is eighty coin, and that is what it is for.",
          "Wears 1 for every leg it is carried full."
        ]
      },
      {
        "id": "satchel",
        "name": "Satchel",
        "class": "gear",
        "cardCode": "ITM-06",
        "slot": "back",
        "madeAt": "tailor",
        "inputs": [
          {
            "commodity": "leather",
            "qty": 1
          },
          {
            "commodity": "cloth",
            "qty": 1
          }
        ],
        "effortHours": 2,
        "baseValue": 40,
        "massKg": 0.6,
        "wear": 5,
        "story": "Oiled leather, a long strap and a flap that keeps the rain out of whatever matters most. Every herbalist, physician and surveyor in the world owns one and none of them will lend it.",
        "effects": [
          "+4 kg to what the figure can shoulder.",
          "Name one item inside it when it is packed: that item is not lost when the figure falls at 0 health.",
          "Wears 1 for every leg it is carried full."
        ]
      },
      {
        "id": "binoculars",
        "name": "Binoculars",
        "class": "gear",
        "cardCode": "ITM-08",
        "slot": "belt",
        "madeAt": "glassworks",
        "inputs": [
          {
            "commodity": "glass",
            "qty": 1
          },
          {
            "commodity": "ironware",
            "qty": 1
          },
          {
            "commodity": "leather",
            "qty": 1
          }
        ],
        "effortHours": 4,
        "baseValue": 130,
        "massKg": 0.75,
        "wear": 3,
        "story": "Two ground lenses in a brass tube, bound in leather against the weather it will certainly get. The guild that grinds them will not say how, and charges accordingly.",
        "effects": [
          "Look before you walk: reveal the terrain of any one hex up to three away, without entering it.",
          "+1 on survey rolls.",
          "Re-roll one discovery roll per round, and keep the second.",
          "Wears 1 per use. Ground glass in a leather tube does not care for a road."
        ]
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.5,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
        "effects": [
          "Re-roll one airship wind roll and keep the better result - see travel.json.",
          "The crew are steady at any height for the rest of the journey, which matters more than the roll does."
        ]
      },
      {
        "id": "torch",
        "name": "Torch",
        "class": "light",
        "cardCode": "ITM-03",
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
        "massKg": 0.25,
        "wear": 1,
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
        "cardCode": "ITM-02",
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
        "massKg": 0.75,
        "wear": 8,
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
        "massKg": 0.25,
        "story": "Knucklebones and a thong of hide, carved by someone's grandmother against the dark. It works, which is more than can be said for most of what grandmothers carve.",
        "effects": [
          "Stores up to 2 mana."
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.25,
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
        "massKg": 0.5,
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
      "R",
      "L",
      "S",
      "O"
    ],
    "speeds": {
      "$comment": "Hexes per day leg. Columns follow terrainCodes: G grassland, F forest, H hills, M mountain, B marsh, T tundra, D desert, R river, L lake, S shallow water, O deep water. The four water columns are 0 for every land mode: a river or a lake stops a cart the way the sea does, and the way across one is a bridge, where the road row rules instead. The road and rail rows override the terrain underneath: on a road use the road number whatever the ground; on rail a train moves at the rail number and nothing else moves at all.",
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
            "R": 0,
            "L": 0,
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
            "R": 0,
            "L": 0,
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
            "R": 0,
            "L": 0,
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
            "R": 0,
            "L": 0,
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
            "R": 3,
            "L": 3,
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
            "R": 0,
            "L": 0,
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
            "R": 2,
            "L": 2,
            "S": 2,
            "O": 0
          },
          "note": "Runners want snow and ice. Tundra is its road; frozen marsh, river, lake and shallow water carry it where nothing wheeled will go; on bare grass it is a heavy box being dragged. The water columns count only while a frost is on - see the winter rule below."
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
            "R": 5,
            "L": 5,
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
      "effect": "Marsh, river, lake and shallow water tiles count as frozen: sleds cross them at the listed speed and no other land mode may enter frozen water at all. Barges and ships may not enter a frozen tile.",
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
        "id": "river",
        "name": "River (R)",
        "terrain": "river",
        "code": "R",
        "entries": [
          {
            "roll": "1-2",
            "result": "hazard"
          },
          {
            "roll": "3-5",
            "result": "traveller"
          },
          {
            "roll": "6-13",
            "result": "nothing"
          },
          {
            "roll": "14",
            "result": "flotsam"
          },
          {
            "roll": "15-16",
            "result": "merchant"
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
        "$note": "The busiest water in the game and the most dangerous underfoot. A river is the road everybody who cannot afford a road uses, so it grows merchants and ferrymen - and it is also rapids, a shifting bar and rotten ice, which is why the hazard band is two wide and no other water table's is.",
        "elementWeights": {
          "water": 3,
          "earth": 2,
          "air": 1,
          "fire": 0
        }
      },
      {
        "id": "lake",
        "name": "Lake (L)",
        "terrain": "lake",
        "code": "L",
        "entries": [
          {
            "roll": "1",
            "result": "hazard"
          },
          {
            "roll": "2-3",
            "result": "traveller"
          },
          {
            "roll": "4-13",
            "result": "nothing"
          },
          {
            "roll": "14-15",
            "result": "flotsam"
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
        "$note": "Quiet water with land all round it: no pirates, because there is nowhere for them to run to, and a long empty band because most of a lake is most of a lake.",
        "elementWeights": {
          "water": 3,
          "air": 1,
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
    "$comment": "Mana, elements and spells. Mana is NOT a commodity: it has no bulk, sits in no stockpile, and cannot be crated. It lives in bodies (rarely - see peoples.json manaStorage) and in talismans (items.json, class talisman), tracked with a token on the player board's M track, against the capacity the talisman's card prints. Mana crystals in commodities.json are a different thing: frozen mana as a trade good and potion ingredient - a crystal can be shattered by its holder to yield 2 mana of any one element, but mana can never be pressed back into a crystal.",
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
    "manaDie": {
      "$comment": "The purple die, and the fifth and last die in the box. Blue is what you want, red is what stands in your way, green is the weather on a market, ochre is what the season takes back - and bruise is what a dead monster gives up. Five inks, five dice, and there is no sixth ink to make a seventh die out of (docs/art/palette.json inks).\n\nIt exists because a monster's mana yield was a PAYMENT and it should always have been a CEILING. Vhalrik was six mana every single time, which made the biggest fight in the game an errand with a known price on it. Now the number on the card is the most he can give up and the die says how much of it you actually caught, so the same monster is worth six one week and two the next, and the elf standing there with a phylactery has a reason to hold their breath.",
      "id": "mana",
      "name": "Mana",
      "colour": "purple",
      "ink": "bruise",
      "count": 1,
      "faces": 6,
      "$facesNote": "Six faces because the deepest yield in the deck is six (monsters.json manaYield, Vhalrik). A die that could not reach the top of the deck would make the top of the deck unreachable, and a die that ran past it would have faces that never meant anything.",
      "rule": "You take the LESSER of the monster's Y box and the roll. Never more than the monster had; often less.",
      "worked": "A cinder wolf yields 1: any roll but a 1 is still 1, so a small monster is a reliable trickle. Vhalrik yields 6: the die is the whole story, and half the time you leave four of it on the ground.",
      "when": "Once, the moment the monster reaches 0 health. Not per character and not per round.",
      "split": "Among the characters who fought, as they agree. Mana with nowhere to hold it blows away at the end of the round, so an over-full party leaves some of it behind whatever the die said."
    },
    "mana": {
      "gained": "Slaying a monster yields mana of its element to the characters who fought it - the LESSER of the number in the monster's Y box and a roll of the purple mana die (manaDie above). Some quests and hoards yield mana directly, at the number they name, with no die.",
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
          "effect": "+10 kg on top of what that character's strength allows them to carry (rules.json carrying). The last ten kilograms simply do not pull.",
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
    "$comment": "The monster deck: what a discovery roll can put in front of you. Three of each element, and then the two dragons the sighting cards had been promising - the deck is built to grow.\n\nCard layout: name and card code at the top, a SUMMARY STRIP under them - H health, S strength, A armour, P pace, Y mana yield, and the element's mark in the last box - then the portrait, and the story standing up the right-hand edge of the card (components.json storyRail). The portrait is taller than it is wide because of that: these plates are drawn on a portrait page, and the story panel that used to run across the bottom was taking the height the picture wanted.\n\nThe name on the card is the NAME. `unique` is a deck rule - there is one of this monster and it is not shuffled back in once it is resolved - and it lives here and in the annex, not printed after the creature's name where at card size it read as part of it. The strip prints maximums and nothing walks on the card: when this monster is met, its card is dealt onto a spare player board and its tracks are set from the strip, and from that moment it is run like a player who is not a person (rules.json exploration.discovery.encounter).\n\nFOUR NUMBERS, and every one of them is now a number a player can also have. STRENGTH is the base of its side of the battle roll. ARMOUR is what it adds on top - the old DEFENCE, halved and renamed, because in an opposed total there was never any difference between a blow that missed and a blow that was turned. PACE is what you have to beat to run away from it, and it is the reason half this deck cannot be run away from. YIELD is the most mana its death is worth, and only the most: what you actually get is the lesser of that and the purple die (arcana.json manaDie).\n\nterrains is where the monster is at home: a monster drawn on a hex whose terrain is not listed is shuffled back and redrawn. Art prompts for every monster are in docs/art/prompts/monsters.md.",
    "version": "0.3.0",
    "encounterOptions": {
      "$comment": "Meeting a monster is a choice, and the choice is the player's unless the card says otherwise. The card lists which of the four options it allows; slay is always allowed. Running away is not on the card, because whether you can run away is not the monster's decision - it is a footrace, and the card only prints one side of it.",
      "slay": "Fight it, per rules.json conflict.battle: total strength, gear and dice on both sides, and the lower total loses health equal to the difference. Slaying yields mana of the monster's element - the LESSER of the number in its Y box and a roll of the purple mana die (arcana.json manaDie), split among the characters who fought. The yield is a ceiling, never a payment.",
      "enslave": "Beat it by 2 or more on the battle roll WITHOUT taking it to 0 health (declare before rolling). An enslaved monster works as a d4 worker in one of your towns, eats 1 food per round, and adds 1 unrest to that town while it lives there. It yields no mana.",
      "befriend": "Offer the gift named on its card and roll d6: on 4+ it is befriended - it guards its hex for you, or travels with your party as a strength-equal escort. It leaves the first round you cannot feed it. No mana.",
      "domesticate": "Befriend it first, or win without killing, then spend 2 consecutive rounds with it at a pasture. A domesticated monster is livestock with the benefit on its card. No mana.",
      "flee": "Run, and you have to be faster than it: your party's pace must be GREATER than the P on its card. Succeed and you withdraw the way you came, ending your movement, with no discovery roll this leg and nothing looted. Fail the comparison and you may not run at all - the option is not offered. Monsters of strength 4 or more get one free round of the battle roll against a fleeing cargo vehicle whatever its pace. See rules.json conflict.flee.",
      "lair": "An unresolved monster stays on its hex as a figure. It attacks any party that ends a leg there, and event cards may move it."
    },
    "monsters": [
      {
        "id": "cinder-wolf",
        "cardCode": "MON-01",
        "name": "Cinder Wolf",
        "element": "fire",
        "strength": 2,
        "armour": 1,
        "pace": 6,
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
        "armour": 2,
        "pace": 6,
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
        "armour": 2,
        "pace": 3,
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
        "armour": 2,
        "pace": 3,
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
        "armour": 2,
        "pace": 4,
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
        "armour": 3,
        "pace": 2,
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
        "armour": 1,
        "pace": 1,
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
        "armour": 1,
        "pace": 5,
        "health": 7,
        "manaYield": 2,
        "terrains": [
          "shallow-water",
          "deep-water"
        ],
        "options": {
          "enslave": false,
          "befriend": true,
          "domesticate": false
        },
        "gift": "2 fish, tipped over the gunwale at dusk",
        "befriended": "While it patrols an inshore hex of yours, pirates never trouble barges or ships that start or end there.",
        "story": "Fishing villages paint its coils on their boats and spill it a share of every catch. Skippers who call the custom superstition are welcome to sail without it."
      },
      {
        "id": "deepwater-maw",
        "cardCode": "MON-09",
        "name": "The Deepwater Maw",
        "element": "water",
        "strength": 5,
        "armour": 3,
        "pace": 4,
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
        "armour": 0,
        "pace": 7,
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
        "armour": 1,
        "pace": 7,
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
        "armour": 1,
        "pace": 8,
        "health": 9,
        "manaYield": 3,
        "terrains": [
          "mountain",
          "hills"
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
        "armour": 3,
        "pace": 5,
        "health": 14,
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
        "armour": 3,
        "pace": 4,
        "health": 13,
        "manaYield": 4,
        "terrains": [
          "tundra",
          "mountain",
          "lake"
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
    "$comment": "The vehicle deck: named, individual vehicles as cards - seventeen now, and every one of them a specific machine rather than a class of machine. A vehicle card is a specific machine with a history; transport.json modes are the generic rules it runs on (mode names which). Card layout: name and card code at the top, a summary strip under them - H for the hull, C for the bulk of its hold - then the picture across the full width the frame allows, and the story low. Nothing on the card is walked.\n\nA VEHICLE IN PLAY IS DEALT A PLAYER BOARD. It is run like a player who is not a person: its card lies in the recess, its cargo and its modifications lie in the four kit slots, and its hull walks the board's HEALTH track like anybody else's - set from the printed H, down as it takes damage, up as it is repaired, and wrecked at nothing, spilling its cargo on the hex for whoever reaches it first. There was a sixth track on every board in the game called V, about a wagon most players were not running; there is not now. See data/playerboard.json.",
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
        "hull": 8,
        "quirk": "+1 hex per leg, and she carries 4 passengers (figures or characters) free among the mail sacks.",
        "story": "The pride of the Steppe Line, polished brass and impatience. She has made Vossgard to Brassford in a day and a night, and the fireman has the burns to prove it."
      },
      {
        "id": "steppe-hauler",
        "cardCode": "VEH-02",
        "name": "Steppe Hauler",
        "mode": "train",
        "cargoCapacity": 100,
        "hull": 10,
        "quirk": "Burns 1 extra coal per leg. Nothing else on rails carries close to her hundred bulk.",
        "story": "Twelve trucks and a boiler like a chapel. When the Hauler passes a village, the village comes out to watch; when she is late, the ironworks stand idle and everybody knows why."
      },
      {
        "id": "old-smoke",
        "cardCode": "VEH-03",
        "name": "Old Smoke",
        "mode": "train",
        "cargoCapacity": 60,
        "hull": 6,
        "quirk": "Costs half a train's price to buy. Each journey, roll a d6: on a 1 she limps, and the journey takes twice as long.",
        "story": "The first engine ever to cross the pass, sold on, patched, sold again. Every engineer in the Reach has driven her once and speaks of her the way you speak of a difficult grandmother."
      },
      {
        "id": "gullwing",
        "cardCode": "VEH-04",
        "name": "Gullwing",
        "mode": "ship",
        "cargoCapacity": 30,
        "hull": 8,
        "quirk": "+1 hex per leg, and she carries a rigged lantern: she may sail night legs at half speed.",
        "story": "A courier sloop built for the packet run, all sail and no patience. She has outrun two storms and one embargo, and her skipper mentions all three before you have sat down."
      },
      {
        "id": "saltreach-pride",
        "cardCode": "VEH-05",
        "name": "Saltreach Pride",
        "mode": "ship",
        "cargoCapacity": 80,
        "hull": 12,
        "quirk": "Takes the first 2 hits of any battle or storm on her oak sides without marking damage.",
        "story": "The great trader of the western run, oak-ribbed and stubborn. She has been dismasted twice and come home twice, and Saltreach's harbour rates are set to whatever her master will pay."
      },
      {
        "id": "ember-coast-trader",
        "cardCode": "VEH-06",
        "name": "Ember Coast Trader",
        "mode": "ship",
        "cargoCapacity": 55,
        "hull": 10,
        "quirk": "Sells at +10% at any harbour on the southern coast - Dunhaven and Port Malchior know her flag and clear her berth.",
        "story": "A fat, cheerful coaster that has worked the southern run so long the reef serpents recognise her hull. Her hold smells of salt, spice and forty years of honest smuggling."
      },
      {
        "id": "dunhaven-column",
        "cardCode": "VEH-07",
        "name": "The Dunhaven Column",
        "mode": "caravan",
        "cargoCapacity": 28,
        "hull": 8,
        "quirk": "Desert-wise: crosses desert at 2 hexes per leg, and hazard results in desert cost her nothing.",
        "story": "Forty years of the Kholvar crossing, water butts strapped three deep. The Column has never lost a wagon to the sand, and its masters intend to be buried saying so."
      },
      {
        "id": "fenway-wagons",
        "cardCode": "VEH-08",
        "name": "The Fenway Wagons",
        "mode": "caravan",
        "cargoCapacity": 20,
        "hull": 6,
        "quirk": "Broad marsh-rigged wheels: may cross marsh at 1 hex per leg, which no other wheeled thing can do at all.",
        "story": "Wide-wheeled, willow-sprung, waterproofed with fen pitch. The Fenway crews sell the safe road through the Mirewash, and the toll is knowing which tussocks are lying."
      },
      {
        "id": "varl-wagonrow",
        "cardCode": "VEH-09",
        "name": "The Varl Wagonrow",
        "mode": "caravan",
        "cargoCapacity": 24,
        "hull": 7,
        "quirk": "Hill-country teams: crosses hills at 2 hexes per leg.",
        "story": "Ox-teams bred in the highlands, drivers born in the wagons. The Wagonrow takes the upland road the maps advise against and arrives, insufferably, early."
      },
      {
        "id": "bay-courser",
        "cardCode": "VEH-10",
        "name": "Bay Courser",
        "mode": "mounted",
        "cargoCapacity": 2,
        "hull": 4,
        "quirk": "+1 hex on grassland legs. The fastest honest thing on four legs in the Reach.",
        "story": "A racing bay out of the Vossgard studs, all nerves and speed. She has carried three riders to fame and thrown two of them at the finish."
      },
      {
        "id": "steppe-pony",
        "cardCode": "VEH-11",
        "name": "Steppe Pony",
        "mode": "mounted",
        "cargoCapacity": 3,
        "hull": 5,
        "quirk": "Ignores tundra penalties and forages for herself: no feed, ever.",
        "story": "Shaggy, short-legged, unimpressed. The steppe pony has carried the mail through three winters that killed better-looking horses, and her opinion of better-looking horses is on record."
      },
      {
        "id": "black-malchior",
        "cardCode": "VEH-12",
        "name": "Black Malchior",
        "mode": "mounted",
        "cargoCapacity": 2,
        "hull": 4,
        "quirk": "Night-eyed: may travel one night leg per journey with no light at all.",
        "story": "A tall black gelding the port is named after, or the other way round - the ostlers argue. He walks the dark road at an even pace, and riders swear he sees the ruts before the moon does."
      },
      {
        "id": "nine-and-the-drum",
        "cardCode": "VEH-13",
        "name": "Nine and the Drum",
        "mode": "sled",
        "cargoCapacity": 10,
        "hull": 5,
        "quirk": "Nine dogs and a lead bitch called Drum. +2 hexes on any tundra leg, and the team smells a crevasse: ignore the first hazard result of every journey.",
        "story": "Eight in the traces, one spare running loose, and Drum out front deciding what the driver meant. She has brought two drivers home unconscious on the load and takes the view that this is the arrangement."
      },
      {
        "id": "red-lantern",
        "cardCode": "VEH-14",
        "name": "The Red Lantern",
        "mode": "ship",
        "cargoCapacity": 70,
        "hull": 11,
        "quirk": "Junk-rigged and steam-fitted: sails free, or burns 1 coal per leg for +2 hexes and no wind roll at all. Her battened sails take no damage from storms.",
        "story": "Five battened sails the colour of dried blood, a squat iron funnel amidships, and a hull built in sealed compartments so a holed one is an inconvenience rather than a funeral. She came the long way round the southern ocean and her master has never once explained why."
      },
      {
        "id": "carrion-queen",
        "cardCode": "VEH-15",
        "name": "The Carrion Queen",
        "mode": "ship",
        "cargoCapacity": 45,
        "hull": 12,
        "quirk": "+3 combat dice at sea, and any ship she catches must hand over one cargo token or fight. Nobody legitimate will berth her: she may not use a harbour she does not own, and pays double at any market that takes her coin at all.",
        "story": "Black hull, black sails gone to ribbons, and a boiler bolted in below by somebody who did not care what it did to her lines. She makes eleven knots on a dead calm, which is the whole trick and the whole terror: outrunning the Queen used to be a matter of weather."
      },
      {
        "id": "pilgrims-patience",
        "cardCode": "VEH-16",
        "name": "The Pilgrim's Patience",
        "mode": "airship",
        "cargoCapacity": 18,
        "hull": 6,
        "quirk": "Goes over everything: no terrain costs her anything, and she cannot be robbed on the road. Roll the wind each leg (travel.json) - she has no answer to it.",
        "story": "A varnished silk envelope the length of a chapel, a wicker gondola, and a crew of four who have agreed not to discuss the drop. She carries mail, medicine and very expensive people, and has twice arrived somewhere nobody asked her to go."
      },
      {
        "id": "sweep-of-vossgard",
        "cardCode": "VEH-17",
        "name": "The Sweep of Vossgard",
        "mode": "airship",
        "cargoCapacity": 14,
        "hull": 7,
        "quirk": "Sweep-rigged: a fixed upper beam and a working lower one down each flank, rowed by the crew. Treat any Foul or Contrary wind as Contrary at full speed, for 1 extra crew fed that round. She cannot beat the wind - she can refuse to be beaten by it.",
        "story": "Havik Coalbrand drew the rig on the back of a timetable: fix the top spar, hinge the bottom one, and let eight strong people row the air. It looks absurd, it sounds like a mill, and it is the only airship in the Reach that has ever kept an appointment in a headwind."
      }
    ]
  },
  "characters": {
    "$comment": "The character deck: named adventurers a player's hero figure can be. Each player deals or picks one at setup; the card gives the hero a face, a summary of their numbers and a story.\n\nCard layout: name and card code at the top, then a SUMMARY STRIP across the card - one lettered box per number, the letter the same one the player board's track carries, so H 10 on the card and the H track on the board are obviously the same thing. The strip prints the MAXIMUM and nothing else: there is no bar to walk on a card any more, because the board took the walking over and a card in a recess is a card whose edges you cannot reach. Under the strip the portrait runs the full width the frame allows, and the story sits low.\n\nThe numbers on the strip are health, strength, mana, starting gold, and the kilograms the hero can shoulder - which is derived, not designed: strength x rules.carrying.kgPerStrength. Burden was a bar and then a track and is now neither; strength does that job, and the coin in the purse counts against it like everything else (rules.json carrying.coin). DEFENCE has gone off the strip along with the to-hit roll it existed to shift: a battle is one opposed total now (rules.json conflict.battle), and what a character brings to it besides strength is the gear in their kit slots. A character at 0 health is carried to the nearest settlement and mends only under medical aid (rules.json rest); a character at 0 strength does not fight and carries nothing, and one night's sleep puts all of it back. Art prompts in docs/art/prompts/characters.md.",
    "version": "0.3.0",
    "characters": [
      {
        "id": "corin-vale",
        "cardCode": "CHR-01",
        "name": "Corin Vale",
        "people": "human",
        "calling": "Wayfarer",
        "strength": 3,
        "health": 10,
        "startingGold": 45,
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
        "strength": 4,
        "health": 12,
        "startingGold": 55,
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
        "strength": 2,
        "health": 8,
        "startingGold": 70,
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
        "strength": 2,
        "health": 8,
        "startingGold": 80,
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
        "strength": 6,
        "health": 13,
        "startingGold": 50,
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
        "strength": 2,
        "health": 9,
        "startingGold": 65,
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
        "strength": 4,
        "health": 10,
        "startingGold": 60,
        "manaCapacity": 0,
        "traits": [
          "Linesman: a train Havik rides spends 1 less coal per leg.",
          "Tinker: repairs 1 point of vehicle hull per round, free, wherever the vehicle stands."
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
        "strength": 2,
        "health": 7,
        "startingGold": 35,
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
        "effect": "She will not sink. A hull run down to nothing leaves her swamped to the gunwales on her hex instead of wrecked - cargo is lost, the crew are not, and one round of repairs at any harbour has her afloat. Once used, the binding is spent and the card comes off.",
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
    "$comment": "How a physical game element is built - stated once, here, and pointed at from everywhere that draws one. This file holds no content: no card says anything here, no monster is named here. It says what shape a card is, how its summary strip is set, how thick the frame is drawn, what a deck's back looks like, what shape a token is cut, and how the player board, the market board and a mini-map sheet are laid out. tools/build-cards.mjs reads it instead of carrying those numbers in its head, which is the point: change the corner radius here and the fronts, the backs, the print sheet and the explorer previews all move together. Adding a deck is an entry under `decks` plus its content file - not a new set of numbers copied out of this one. See docs/design/08-components.md for the bill of materials and docs/art/06-components.md for why each convention is what it is.",
    "version": "0.2.0",
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
    "statStrip": {
      "$comment": "The row of lettered boxes across the top of every card, and what replaced the bars.\n\nA card used to hang a numbered ladder off each edge - harm left, capacity right - and a token walked it. That worked while a card was held in the hand. It stopped working the day the player board arrived, because a card in a recess is a card whose edges are under the board: the tracks moved to the board (playerboard.json) and the ladders on the cards became decoration that ate two columns of picture.\n\nSo a card now prints the MAXIMUM and nothing else. One box per number, the letter first and the figure after it - H 10, S 6, D 5 - and the letter is the same letter the board's track carries, so a player setting up reads across the strip and sets the tokens left to right. Nothing on a card moves any more; everything that moves is on the board.\n\nONE BOX PER PAIR. Each cell used to hold a second, smaller box with the letter in it - a box inside a box, six times across the top of every card, and at nine millimetres a cell the inner rule was doing nothing the tint underneath was not already doing. Taking it out took a millimetre and a bit off the height of the whole strip, and the picture got it.",
      "cells": {
        "max": 6,
        "heightMm": 4.6,
        "gap": 5,
        "pad": 5,
        "cornerRadius": 4,
        "$maxNote": "Six is what a 63 mm card holds at a legible size - about 9 mm a box. A deck that wants a seventh number wants a smaller number of numbers.",
        "$heightNote": "It was 5.75 mm while every cell held a second box with the letter in it. ONE BOX PER PAIR: the letter and its figure share the cell, the letter set at the left and the figure at the right, and a box inside a box is a millimetre of ruling that only made the row look busy. The height came off the top of the picture."
      },
      "letter": {
        "size": 20,
        "family": "sans",
        "weight": "bold",
        "tracking": 0.4,
        "fill": "soot-tint-70",
        "$fillNote": "One box, two jobs, so the letter separates itself from the figure by weight rather than by a rule round it: the label sits back in a tint and the number holds the ink."
      },
      "value": {
        "size": 22,
        "family": "sans",
        "weight": "bold",
        "minSize": 17,
        "$minNote": "The figure shrinks to fit its box and stops at minSize, which is the 6 pt print floor in palette.json rules.minTypeSize (6 pt = 17 grid units). A number that will not fit at 6 pt is a number that does not belong on a card."
      },
      "rule": {
        "strokeWidth": 1.4,
        "$note": "The strip sits in one boxed row under the kicker, each cell ruled ONCE, so it reads as a table and not as a sentence. There is no second rule inside a cell: the letter and its figure are one pair in one box."
      },
      "letters": {
        "$comment": "The letter a stat is called by, across the whole game. The ones the player board also has a track for MUST match data/playerboard.json - tools/validate-data.mjs checks that they do, and fails the build if a card and a board ever start calling the same number by different names. The rest are card-only: a number that is printed and never walked has no track to borrow a letter from, so it gets one here.\n\nThe list is at its high-water mark of borrowed letters. H, S, P, M and W are all board tracks now - W joined them when wear came off the tool and onto four ladders against the kit slots - and D left the list altogether when defence did. A card-only letter is a promise that nothing moves; a track letter is a promise that something does; and the only thing that has ever moved a letter between the two lists is a rule changing underneath it.\n\nThese are conventions, not content: no card is named here and no value is stated here.",
        "health": "H",
        "strength": "S",
        "pace": "P",
        "mana": "M",
        "wear": "W",
        "armour": "A",
        "gold": "¤",
        "carry": "KG",
        "cargo": "C",
        "yield": "Y",
        "value": "¤",
        "mass": "KG",
        "$wearNote": "How much work is left in a thing before it is finished - items.json wear, tools.json baseWear. This note used to say the opposite of what it says now: that W was the one printed maximum in the game with no track under it and never would get one, because wear ran past twenty and the board stops at fourteen. There are four tracks under it now, one against each kit slot (data/playerboard.json), and wear runs to fourteen. The number came down to meet the board, which is how this game has always settled that argument - it is what the kilogram did when a hero could not stand their own load on the ladder.",
        "$armourNote": "What a figure adds to its side of the battle roll besides its own strength, and it is CARD-ONLY: no token walks it, because it does not move. A monster prints it. A character does not - a character's armour is the gear in the kit slots and changes every time they put something down - so it is the one number on a monster card with no track under it, and the ceiling sweep leaves it alone for exactly that reason (playerboard.json ceiling.$notWalked).",
        "$defenceNote": "There is no D any more. Defence was a rating that shifted a to-hit roll, and there is no to-hit roll: a battle is one opposed total (rules.json conflict.battle), in which a number that makes you harder to hit and a number that soaks the hit are the same number. It is called armour and it is above.",
        "$goldNote": "The currency's own symbol, from rules.json currency.symbol - a coin count is the one number on the strip that is not an abstract rating, and it says so."
      }
    },
    "storyRail": {
      "$comment": "The story, turned on its side and stood up the right-hand edge of the card.\n\nA card's flavour used to be a panel across the bottom - full width, four or five lines, and about fifteen millimetres of the eighty-eight a card has. It was the cheapest fifteen millimetres on the card and it was taking them from the only thing on a card nobody can regenerate: the picture. Rotated ninety degrees it costs WIDTH instead, and width is the one dimension a portrait plate has to spare - a figure drawn on an A4 page is taller than it is wide, so a card that shows one wants to be taller than it is wide too, and the window on these decks was landscape because the words underneath had taken the height.\n\nSo the story runs up the side, bottom to top, and the picture goes portrait and grows into what the panel was using. Which decks do it is on the deck (`decks[].storyRail`), because it is a decision about a plate's shape and not about the card stock: the talismans are drawn square and the vehicles 3:2, and neither of them wants a taller window.\n\nThere is a second reason a deck reaches for it, and the modifications are the first deck to use it: not the shape of the PLATE but the length of the WORDS. A modification's rules text is conditional - what it does, and when it stops doing it - and with the story in a panel underneath, the wordiest card in the deck left a picture window at 1.89, flatter than the 1.34 that build-cards calls the flattest a window may get. Its plates are square, so by the paragraph above it should not want the rail at all; what it wanted was its height back. On the rail the same deck is 1.03, which is what a square plate was asking for in the first place. The rule is the same one either way - the story is the cheapest thing on the card, so it is the thing that moves.",
      "gap": 12,
      "pad": 6,
      "maxLines": 5,
      "rule": {
        "strokeWidth": 1.2,
        "$note": "One hairline between the rail and the picture column, the same weight the horizontal rule over the old panel carried. It is what stops the words reading as a caption to the picture beside them."
      },
      "$linesNote": "A rail's WIDTH is its line count - one column of type per line - so a long story makes a wide rail and a narrow picture. maxLines is where that trade stops and the story is cut instead, and it is the same cap the bottom panel had. A rail line is far longer than a panel line was (it runs the height of the card, not the width), so the cap cuts less text than it did.",
      "$directionNote": "Rotated -90, which reads bottom to top - the way a spine is lettered on this side of the Atlantic, and the way the board's own track labels already run (tools/build-board.mjs). Lines stack left to right, so the first line is the one nearest the picture."
    },
    "board": {
      "$comment": "The player board: one A4 sheet a player keeps in front of them, holding cards in recesses and tracks routed up the middle. Only the shapes are here - what the tracks COUNT and what the slots TAKE is content and lives in data/playerboard.json, the same division as everywhere else in this file.\n\nAlmost nothing below is a position. The board's geometry is DERIVED from four numbers - the sheet, the margin, the gutter, and the size of a card recess - so a track column is exactly the width left over once the cards have had theirs, and adding a track narrows the columns rather than running off the paper. tools/build-board.mjs does that arithmetic; see also tools/build-map.mjs, which derives its print sizes the same way and for the same reason.\n\nThere is no frame block, and that is deliberate. A card has a frame because a card is held, fanned and cut out; a board is not, and the border it used to carry was 18 mm of paper doing nothing but making the middle narrower. Taking it off is what paid for a sixth track once; retiring that track - a vehicle is dealt a board of its own now and its damage is its health - gave the width straight back to the five that were left.",
      "sheet": {
        "widthMm": 297,
        "heightMm": 210,
        "bleedMm": 3,
        "cornerRadiusMm": 6,
        "$note": "A4 landscape. The corner is bigger than a card's because the sheet is bigger; a board cut square looks like a print-out, which is exactly what it would be."
      },
      "marginMm": 6,
      "gutterMm": 4,
      "$marginNote": "One margin, all four sides - with no border to clear, nothing needs a wider side than any other. Both came in by two when the board had to find room for four wear ladders it did not have before. 6 mm is still inside what a home printer can be trusted with, and 4 mm is still wider than a finger reaching between two cards needs, because the thing either side of a gutter is a recess a card sits IN rather than a card sitting proud of the paper.\n\nWhat the tightening bought, exactly: the four column tracks come out over 15 mm wide, against the 13.6 that five of them managed on the old margins. So the board gained four wear ladders AND wider columns in one change - which is not luck, it is what deriving the geometry is for. Take a column out of the middle, give two millimetres back at the edges, and the arithmetic hands the difference to whatever is left standing.",
      "kitTrack": {
        "$comment": "The WEAR ladder against each kit recess: a narrow numbered strip, one per slot, walked by a pip (tokens.pip). What it counts is content and lives in data/playerboard.json as the track with place `kit`; this is only its shape.\n\nIt is the first thing on this board that is not about the figure in the big recess. The four columns up the middle belong to whoever is sitting there; these four belong to the CARDS - the axe, the sword, the lantern - and they are drawn against the card they count so nobody has to remember which ladder is which. That is also why there are four of them and not one: a player carries four things, and one W column could only ever have counted one of them.\n\nNothing below is a position. The ladder is as wide as the piece that stands on it plus its clearance, exactly as a market strip cell was; it is as TALL as the recess beside it, so its rungs are the card's height over the board's own rung count. Change the pip and the ladder widens and the columns narrow, in that order, and the build fails before a column gets too narrow for a bar.",
        "clearanceMm": 1.2,
        "gapMm": 1.5,
        "$gapNote": "Between the ladder and the recess it belongs to. Just enough that the ladder does not read as part of the card's own groove, and not so much that it could be mistaken for the neighbour's.",
        "side": "left",
        "$sideNote": "The ladder goes on the LEFT of its recess, so it is read before the card rather than after it - and so the two ladders in the right-hand column are not jammed against the edge of the paper.",
        "strokeWidth": 1.2,
        "cellStrokeWidth": 0.6,
        "labelMm": 3.4,
        "$rungNote": "Fifteen rungs down an 88 mm recess is just under six millimetres a rung, which is why the piece that walks it is a 4.5 mm pip and not a 7 mm bar. Every fifth rung rules heavier and carries its figure, the same `ruleEvery` motif the columns use; the rest are plain cells. Numbering all fifteen at this width would be numbering nothing legibly."
      },
      "slot": {
        "$comment": "A recess a card drops into, cut round the card's own trim plus a clearance either side. The corner follows: a rounded card in a square hole is a card that has to be aimed.",
        "clearanceMm": 0.8,
        "cornerRadiusMm": 4.5,
        "strokeWidth": 2.6,
        "grooveInset": 6,
        "bracketMm": 9,
        "$clearanceNote": "It was 1 mm. A fifth of a millimetre either side of a card is not a thing a hand can feel, and eight of them across the sheet is most of a rung.",
        "$bracketNote": "Corner brackets rather than a fourth rule - the eye reads a bracket as a place to put something and a rule as a picture frame."
      },
      "track": {
        "$comment": "The numbered ladders. Every track on the board runs the same range, from the same floor to the same ceiling, walked by a bar token - so the columns are one grid and not five scales a player has to keep straight. The ceiling is the game's ceiling too: tools/validate-data.mjs recomputes every value a track carries and fails the build if anything in data/ has grown past it.",
        "from": 0,
        "to": 14,
        "headMm": 15,
        "ruleEvery": 5,
        "$fromNote": "The bottom rung is zero, which is where a token starts and where it ends up: health at nothing, an empty talisman, a leg not yet begun. It used to be a separate seat ring under the ladder; a numbered rung says the same thing, takes no extra paper, and cannot be mistaken for decoration.",
        "$ruleNote": "Every fifth rung rules heavier, which is the tally motif doing component duty (docs/art/00-art-direction.md). It is what lets a player read 12 without counting to 12."
      },
      "timber": {
        "$comment": "Sawn boards running the length of the sheet: a seam every board width, grain between them, and a few knots. All of it ink-plate tint at hairline weight, so it survives the black-and-white edition and never competes with a number.",
        "boardWidthMm": 26,
        "seamStrokeWidth": 1.1,
        "grainStrokeWidth": 0.7,
        "grainOpacity": 0.5,
        "knots": 3
      }
    },
    "marks": {
      "$comment": "Drawn marks that are not pictures: they are read, like letters, and so they are held to one grid and one weight wherever they appear. The path data is not here - it belongs to the thing the mark is of, an element in data/arcana.json and a terrain in data/terrain.json. This says how to draw it.",
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
      },
      "terrain": {
        "$comment": "The map symbol for a piece of ground: a grass tuft, a conifer, two hummocks, a peak, reeds standing in water, a frost star, a dune, a river between its banks, a pool, a shoal, a swell. The same bargain as the element marks - the PATH is data on the terrain (data/terrain.json terrains[].mark) and this says how to draw it - and for the same reason: the mini-map field, the campaign map's legend swatch and anything else that has to draw ground itself all trace one set of marks, so the sheet a player is standing figures on and the key on the big map cannot disagree about what grass looks like.\n\nThe marks are read off the drawn plate rather than invented. They are what the world map's artwork already says grass, hills and forest are, said in line weight instead of in paint - which is what makes a mini-map the same ground as the hex it opens out, rather than a second opinion about it.",
        "pathsFrom": "terrain.terrains[].mark.path",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "strokeWidth": 1.9,
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "onField": {
          "$comment": "How a mini-map cell is patterned. The marks go on the INK plate, like every other mark in the game, so the pattern survives the black-and-white edition - which is the whole test: a sheet with the wash dropped still has to say which ground it is.",
          "sizeMm": 5.2,
          "perCell": 3,
          "jitter": 0.22,
          "opacity": 0.34,
          "$sizeNote": "About a third of a cell across. Three to a cell, set on a small triangle about the centre and nudged by `jitter` of their own size, so the field reads as ground rather than as wallpaper - and so no mark can reach the cell's edge and cross a grid line, which is the one thing a pattern on a hex grid must never do.",
          "$opacityNote": "Quieter than the grid ruled over it (minimap.grid) and far quieter than a figure standing on it. The pattern says what the ground IS at a glance; the moment it competes with the pieces it has failed, and that is what the flat-colour sheet was protecting against."
        }
      },
      "pricing": {
        "$comment": "The four marks that say what KIND OF GOOD a commodity is: a level balance, a picked-clean fish, a running glass, a rising run. Same bargain as the element and terrain marks one storey up - the PATH is data on the model (data/pricing.json models[].mark) and this says how to draw it - and for the same reason. The mark is engraved in a corner of every commodity token and printed on the market board, which is a sheet about nothing else now, so the piece in your hand and the sheet you are reading say `this one rots` the same way.\n\nTHERE ARE FOUR, AND THERE WERE THREE. The fourth is STAPLE, and it is not a new rule - it is the absence of one, given a face. More than half the commodities in the game run under it - thirty-four of sixty-six - and they used to be filed as gluts, which quietly claimed that stone and rope could be drowned in a market the way fish can. They cannot. A mark that says `nothing special happens here` is worth engraving, because the alternative is a blank corner that could equally mean somebody forgot.\n\nThey are held apart by SHAPE rather than by detail: a symmetrical beam, a horizontal spine with ribs, an hourglass pinched in the middle, a line climbing to a point. At token size the detail is gone and the silhouette is all that is left, which is the test every mark in this game is drawn to - and the balance is the only symmetrical one in the set, on purpose, because the other three all lean.",
        "pathsFrom": "pricing.models[].mark.path",
        "viewBox": "0 0 24 24",
        "fill": "none",
        "strokeWidth": 1.9,
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "onToken": {
          "$comment": "The corner mark on a commodity token: small, low-contrast against the family mark it shares the face with, and engraved at the same single depth as everything else on an 18 mm chit.",
          "sizeMm": 5.4,
          "insetMm": 1.4,
          "corner": "bottom-right",
          "$note": "About a third of the token's width, tucked into the flat below the family mark. It is the second thing you read, never the first - the family mark says what it is and this says how its market behaves."
        },
        "onBoard": {
          "$comment": "The market board. It used to be a key in the foot, a row of three marks under six lines of price tracking; the board is ABOUT these marks now and nothing else, so each one heads its own panel at the size a woodcut initial would be, and the key size is what a mark shrinks to where it is cited inside a panel's prose.",
          "sizeMm": 6.4,
          "panelSizeMm": 13
        }
      }
    },
    "itemPlate": {
      "$comment": "How the plate for an OBJECT card is drawn, in the case where it is drawn HERE rather than commissioned from an artist. A deck says which it is with plateKind; tools/draw-item.mjs is the tool that does it.\n\nThe bargain is the marks' one, one storey up. A mark's PATH is data on the thing the mark is of - an element in arcana.json, a terrain in terrain.json - and this file says how to draw one. An object's PARTS are data on the object - a haft, a head, a strap, in items.json and tools.json - and this says how to draw those: how thick the line is, what colour the wash under a given material is, how a shaded part is hatched, what it stands on. Change the line weight here and every plate moves together, which is the whole point.\n\nIt holds no content, like the rest of this file. No axe is named here and no blade is drawn here. What IS here is the small vocabulary the parts draw from - a material, a shade, a ground - so that two objects made of iron and wood are made of the same iron and the same wood.\n\nWhy an object can be drawn this way and a face cannot: docs/art/09-framing-and-composition.md calls a talisman plate 'a single object study, lit on a table', and a study of a made thing is a silhouette and a line. A character is not. The generated line stops at objects on purpose.",
      "pathsFrom": "items.items[].plate.parts[].d and tools.tools[].plate.parts[].d",
      "viewBox": "0 0 100 100",
      "$viewBoxNote": "The page. Every object is authored on this same square and fitted into the subject box uniformly, so no plate stretches its own subject and the same stroke weight means the same thing on all of them.",
      "subject": [
        0.15,
        0.15,
        0.7,
        0.7
      ],
      "$subjectNote": "Where the object sits on the page, as fractions of it - which makes this the framing entry as well, because the tool PUTS it there rather than finding it there afterwards. 15 per cent clear on every side is the margin docs/art/09-framing-and-composition.md asks a plate to leave for the crop to slide in; it asks for 8, and a drawn object costs nothing to give more.",
      "line": {
        "$comment": "The ink plate carries everything (docs/art/01-two-plate-system.md, law 1), so these are the only weights on a plate: the edge of a part, and everything drawn inside one. Two weights and not five - docs/art/03-line-and-texture.md.",
        "outline": 0.52,
        "detail": 0.26,
        "linecap": "round",
        "linejoin": "round"
      },
      "materials": {
        "$comment": "What a part is made of, and so what colour the wash under it is. The wash never speaks: drop the whole plate and the object is still an axe, because the line drew it. This is category-at-a-glance and nothing more - which is why iron and steel are one ink at two strengths rather than two colours nobody could tell apart.",
        "iron": {
          "ink": "slate",
          "opacity": 0.5
        },
        "steel": {
          "ink": "slate",
          "opacity": 0.33
        },
        "wood": {
          "ink": "ochre",
          "opacity": 0.46
        },
        "leather": {
          "ink": "oxide",
          "opacity": 0.48
        },
        "cord": {
          "ink": "ochre",
          "opacity": 0.28
        },
        "cloth": {
          "ink": "verdigris",
          "opacity": 0.24
        },
        "horn": {
          "ink": "ochre",
          "opacity": 0.2
        },
        "glass": {
          "ink": "verdigris",
          "opacity": 0.16
        },
        "stone": {
          "ink": "soot-tint-25",
          "opacity": 0.55
        }
      },
      "shading": {
        "$comment": "Interior tone is HATCHING and never a darker tint, because a tint is on the wash and the wash is not allowed to say anything. A part says how dark it is; the tool rules parallel lines across the whole page and clips them to that part, so nobody draws a hatch by hand and no two parts hatch at different angles.",
        "angleDeg": 34,
        "crossAngleDeg": -54,
        "strokeWidth": 0.2,
        "opacity": 0.42,
        "spacing": {
          "light": 2.5,
          "medium": 1.7,
          "deep": 1.15
        },
        "crossFrom": "deep",
        "$crossNote": "Only the deepest shade is crossed. Cross-hatching everything is how a woodcut turns into a smudge at card size, and a card window is about 20 mm of this plate."
      },
      "ground": {
        "$comment": "The short line the object stands on, and the flat shadow it throws along it. One horizon, low - rule 5 in docs/art/09-framing-and-composition.md - and it is what stops an object study reading as a cut-out floating on paper.",
        "y": 0.845,
        "halfWidth": 0.3,
        "strokeWidth": 0.55,
        "shadow": {
          "ink": "soot-tint-25",
          "opacity": 0.45,
          "halfWidth": 0.21,
          "height": 0.018
        }
      },
      "grime": {
        "$comment": "The third plate. A few specks of press dirt so the sheet reads as printed rather than as exported - the same handful the card fronts carry and no more, because grime that can be counted at card size is decoration.",
        "specks": 9,
        "radius": 0.32,
        "opacity": 0.07
      }
    },
    "$deckKeys": {
      "$comment": "What each deck entry means. plateId is the template that turns a card into the name of the plate it needs - {id} and {cardCode} are fields of the card, |lower lowercases. It lives here rather than in the tools because three different tools need to agree on it: the card builder looks for the plate, the mint queue reports which are missing, and the art prompts are filed under exactly these names. minting says whether this deck is in the mint queue yet; a deck with minting false is declared, numbered and backed, and simply not being illustrated this month.",
      "prefix": "the card code prefix - see vehicles.json cardIdScheme",
      "plateId": "template for the render filename under docs/art/renders/, without the .png",
      "promptFile": "which file in docs/art/prompts/ holds this deck's briefs",
      "plateFormat": "the page the artist draws - see docs/art/09-framing-and-composition.md",
      "plateKind": "drawn, and an artist supplies the plate; or generated, and a tool in this repository draws it from the card's own data. The same field, and the same reason, as a map's plate.kind in data/maps/ - see itemPlate below and tools/draw-item.mjs. Absent means drawn.",
      "drawnBy": "the tool that draws a generated deck's plates, so the mint queue can name it instead of asking for an artist who is not coming",
      "sourceFilter": "WHICH cards of the source file this deck deals, where one file holds more than one deck's worth, and it is read for real - `{ class: \"weapon\" }` keeps that class, `{ classNot: [...] }` drops those. It was prose only, with the real enumeration written out as one dull branch per deck in tools/lib/mint.mjs, tools/build-cards.mjs and docs/js/data.js - three copies of the same list, and splitting the weapons and the armour out of the items deck meant editing all three or having them disagree. This file's own comment promises that adding a deck is an entry here plus its content file; that promise is kept now. One place resolves it: decksOf in docs/js/decks.js, shim-loaded by tools/lib/decks.mjs the way framing and the graph already are.",
      "filter": "the same thing said in prose, for whoever is reading rather than running. It states the intent; sourceFilter states the rule.",
      "minting": "true if tools/mint-queue.mjs should chase this deck's missing plates",
      "storyRail": "true if this deck's story runs up the right-hand edge instead of across the bottom - see storyRail. The decks drawn on a portrait page take it, because that is where a taller window pays.",
      "back": "how this deck's card back is drawn - word, motif and ink"
    },
    "decks": [
      {
        "prefix": "CHR",
        "storyRail": true,
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
        "storyRail": true,
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
        "sourceFilter": {
          "class": "talisman"
        },
        "filter": "class == talisman",
        "back": {
          "word": "TALISMANS",
          "motif": "rayed",
          "ink": "bruise"
        }
      },
      {
        "prefix": "MOD",
        "storyRail": true,
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
          "motif": "compass",
          "ink": "ochre"
        }
      },
      {
        "prefix": "ITM",
        "storyRail": true,
        "plateId": "item-{id}",
        "promptFile": "items.md",
        "plateFormat": "square",
        "plateKind": "generated",
        "drawnBy": "tools/draw-item.mjs",
        "minting": true,
        "id": "items",
        "name": "Items",
        "source": "items.json",
        "sourceFilter": {
          "classNot": [
            "talisman",
            "weapon",
            "armour"
          ]
        },
        "filter": "everything that is not a talisman, a weapon or a piece of armour - the rope, the lantern, the bag, the cloak. Each of the other three is an arcane, a fighting or a wearing subject and deals in its own deck.",
        "back": {
          "word": "ITEMS",
          "motif": "rivet",
          "ink": "slate"
        }
      },
      {
        "prefix": "WPN",
        "storyRail": true,
        "plateId": "item-{id}",
        "promptFile": "items.md",
        "plateFormat": "square",
        "plateKind": "generated",
        "drawnBy": "tools/draw-item.mjs",
        "minting": true,
        "id": "weapons",
        "name": "Weapons",
        "source": "items.json",
        "sourceFilter": {
          "class": "weapon"
        },
        "filter": "class == weapon",
        "back": {
          "word": "WEAPONS",
          "motif": "blade",
          "ink": "oxide"
        }
      },
      {
        "prefix": "ARM",
        "storyRail": true,
        "plateId": "item-{id}",
        "promptFile": "items.md",
        "plateFormat": "square",
        "plateKind": "generated",
        "drawnBy": "tools/draw-item.mjs",
        "minting": true,
        "id": "armour",
        "name": "Armour",
        "source": "items.json",
        "sourceFilter": {
          "class": "armour"
        },
        "filter": "class == armour",
        "back": {
          "word": "ARMOUR",
          "motif": "mail",
          "ink": "slate"
        }
      },
      {
        "prefix": "TOL",
        "storyRail": true,
        "plateId": "tool-{id}",
        "promptFile": "tools.md",
        "plateFormat": "square",
        "plateKind": "generated",
        "drawnBy": "tools/draw-item.mjs",
        "minting": true,
        "id": "tools",
        "name": "Tools",
        "source": "tools.json",
        "back": {
          "word": "TOOLS",
          "motif": "socket",
          "ink": "verdigris"
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
        "rayed": "M12 2.4V21.6M2.4 12H21.6M5.2 5.2 18.8 18.8M18.8 5.2 5.2 18.8M12 8.2a3.8 3.8 0 1 0 .001 0z",
        "$socketNote": "The one thing every tool in the deck has in common: a head with an eye through it, and a haft through the eye. Drawn on the family's construction - a ring, and what the thing does to it - and top-to-bottom symmetric like the rest, because the back mirrors the motif across the card's centre line.",
        "socket": "M12 2.6a9.4 9.4 0 1 0 .001 0zM12 8.2a3.8 3.8 0 1 0 .001 0zM8.6 2.6V21.4M15.4 2.6V21.4",
        "$bladeNote": "WEAPONS. A blade through a crossguard - and then the same blade again, downward, because the back mirrors across the centre line and a sword is the one object in this game that is improved by the trick. It comes out as a court card: point up, point down, quillons through the middle, no way up. The guard is the widest thing on the grid, so the silhouette is a cross before it is a sword, and a cross is what carries at arm's length.",
        "blade": "M12 2.4L9.4 6.4V11.2M12 2.4L14.6 6.4V11.2M12 21.6L9.4 17.6V12.8M12 21.6L14.6 17.6V12.8M4.2 12H19.8M9.4 11.2H14.6M9.4 12.8H14.6",
        "$mailNote": "ARMOUR. Five rings of a hauberk interlocked on the cross - one at the centre and one at each quarter, set just close enough to overlap. It is the only motif in the set built out of REPEATS rather than out of one figure, which is precisely the point: mail is a thing made of twenty thousand identical small pieces, and at roundel size that is what it should look like. Symmetric top to bottom by construction, like everything else here.",
        "mail": "M12 9.1a2.9 2.9 0 1 0 .001 0zM12 3.9a2.9 2.9 0 1 0 .001 0zM12 14.3a2.9 2.9 0 1 0 .001 0zM6.8 9.1a2.9 2.9 0 1 0 .001 0zM17.2 9.1a2.9 2.9 0 1 0 .001 0z",
        "$compassNote": "The compass is the one motif drawn to the edge of the grid. The rose keeps the 2.4 margin the others stop at; the bezel sits outside it, so the cardinal points meet the rim rather than stopping short of it.",
        "compass": "M12 0.6a11.4 11.4 0 1 0 .001 0zM21.6 12 14.96 13.22 16.17 16.17 13.22 14.96 12 21.6 10.78 14.96 7.83 16.17 9.04 13.22 2.4 12 9.04 10.78 7.83 7.83 10.78 9.04 12 2.4 13.22 9.04 16.17 7.83 14.96 10.78Z"
      }
    },
    "tokens": {
      "$comment": "Everything loose that is not a card. Two shapes and one reason for each: pieces that are CUT are hexagons, pieces that are STRUCK are discs.\n\nA hexagon shares its cuts. Nested on a sheet, one straight line is the edge of two tokens and every token but the outside row is bounded entirely by cuts somebody else already paid for, so a sheet of hexes yields around a fifth more pieces than the same sheet of discs and the laser travels a good deal less. Discs share nothing: every circle is cut alone and the waste between four of them is a piece of stock the size of a fifth. So the commodity tokens - the ones there are hundreds of - are hexagons, and it is worth the change of shape.\n\nCoins stay round, because a coin that is not round is not a coin. There are far fewer of them, they are the one piece a player handles by feel while looking somewhere else, and round against hexagonal is the fastest distinction a hand can make in a heap.",
      "commodity": {
        "shape": "hex",
        "orientation": "flat-top",
        "acrossFlatsMm": 18,
        "engravable": true,
        "carries": "the commodity family's mark and hatch, and its pricing model's mark in the corner (marks.pricing.onToken) - never a number",
        "nesting": {
          "rowPitchMm": 18,
          "columnPitchMm": 15.59,
          "sharedEdges": true,
          "$note": "columnPitch is acrossFlats x 3/4 for a flat-top hex nested in a honeycomb: neighbouring columns interlock, and the cut between them is one line, not two."
        },
        "$note": "The commodity's identity lives on its card; the token only has to say which family it belongs to, how its market behaves, and be findable in a heap. 18 mm is the chit tier in docs/art/04-iconography.md - silhouette and frame only - and both marks have to work as a single-depth engraving with no tint at all.\n\nThe pricing mark is the second thing on the face and it is there because the market board cannot carry it: a board line is not about anything until a token is standing on it, so the rule that line runs under has to arrive with the token. Pick up grain and you are holding a glut good; pick up iron ore and you are holding a hole in the ground."
      },
      "deposit": {
        "shape": "hex",
        "orientation": "flat-top",
        "acrossFlatsMm": 24,
        "engravable": true,
        "carries": "the deposit's mark on one face, its yield on the other - deposits differ, see data/deposits.json tokenYields",
        "$note": "Cut from the same stock and nested the same way, and bigger than a commodity token because it lies on a map hex rather than in a heap: size is what tells the two apart on the table, since both are hexes."
      },
      "coin": {
        "shape": "round",
        "engravable": true,
        "denominations": [
          {
            "value": 1,
            "diameterMm": 16
          },
          {
            "value": 5,
            "diameterMm": 19
          },
          {
            "value": 25,
            "diameterMm": 22
          }
        ],
        "carries": "the figure and the currency mark, from rules.json currency.symbol - a coin is the one token in the game that says a number out loud",
        "$note": "Three sizes rather than three colours, so a stack is countable by feel and in the black-and-white edition. Round because a coin is round; see the block comment for why nothing else is."
      },
      "bar": {
        "shape": "round",
        "diameterMm": 7,
        "engravable": false,
        "carries": "nothing - it is the marker that walks a column track on the player board, or the band ladder at the head of a column on the price ledger",
        "$note": "Four of these per player board, one per column track, plus one per commodity column in play on the ledger. It was six, and then five: the vehicle column went when a wagon was dealt a board of its own, and the defence column went when a battle became one opposed total."
      },
      "pip": {
        "shape": "round",
        "diameterMm": 4.5,
        "engravable": false,
        "carries": "nothing, and it must not - there are hundreds of them and half of them are never coming back",
        "does": [
          "Walks a WEAR ladder beside a kit slot on the player board. Four per board, and they come off again when the thing they were counting is finished with.",
          "Covers a cell on a DEPLETION grid. One per unit of a finite commodity burnt, laid down once and never lifted - data/pricing.json depletion."
        ],
        "$sizeNote": "Four and a half millimetres, two and a half off a bar, and both numbers are doing a job. A wear ladder is fifteen rungs down the side of an 88 mm card - not quite six millimetres a rung - and a 7 mm bar overhangs it, where a pip leaves a millimetre and a half to get a fingernail under. A depletion cell is then sized off the pip in turn, so a grid is as small as the piece standing on it allows and a whole set of them fits on one sheet.",
        "$oneShapeNote": "One piece, two jobs, and that is deliberate rather than thrifty. A pip means ONE USE OF ONE THING HAS BEEN SPENT, whether the thing is an axe or a coal seam. The two uses differ only in whether the spending can be undone, and the piece has no business knowing which sheet it has been put on.",
        "howMany": "Four per player board, plus enough to fill every depletion grid in play - twenty-one to a grid (pricing.json depletion), so a table trading in five finite commodities will get through a hundred of them in a game. They are not recycled and there is no reserve: running out of pips is running out of seam, which is exactly the right thing for it to mean."
      },
      "route": {
        "$comment": "Road and rail, laid on the map hex by hex, and the piece that finally puts a player's name on the thing they paid for (rules.json infrastructure). A route token is a BAR, not a chit: it lies along the line between two hex centres, which is where a road actually is, and it is the length of that line so a run of them reads as a continuous road rather than as a row of counters.\n\nThe sizing is not typed here, because it is not ours to type - a map hex is whatever the map's print preset makes it (data/maps/<id>.json print.presets[].hexAcrossFlatsMm), and the bar has to match. So the token is stated as fractions of the hex and tools/build-map.mjs prints the millimetres for every preset it derives. At the default four-sheet Korvane Reach board - a 16.7 mm hex - that is a 15 x 3.7 mm road bar and a 15 x 5.3 mm rail bar, both cuttable in 3 mm ply and both big enough to pick up.",
        "lengthFraction": 0.9,
        "$lengthNote": "Nine tenths of the centre-to-centre distance, which for a pointy-top hex IS acrossFlats. The missing tenth is the gap that keeps two abutting bars from looking like one long one, and it is what lets a finger get under an end.",
        "road": {
          "widthFraction": 0.22,
          "engravable": true,
          "carries": "a plain metalled hatch along its length"
        },
        "rail": {
          "widthFraction": 0.32,
          "engravable": true,
          "carries": "sleepers across its width - readable at arm's length as rail rather than road, which is the only thing the two shapes have to do"
        },
        "bridge": {
          "widthFraction": 0.32,
          "engravable": true,
          "carries": "the same bar with its ends squared off and a parapet line, laid across one water hex"
        },
        "ownership": {
          "$comment": "Whose road it is decides who collects the toll, so it has to be readable across a table and readable by a player who cannot use the colour.",
          "mark": "peg holes along the centre line: one hole for the first player, two for the second, and so on to five.",
          "holeDiameterMm": 2,
          "colour": "The owner's colour on the wash as well, for everyone it does work for."
        },
        "howMany": "One per hex of road or rail built. A player who runs out has run out of road, which is a real limit and a fair one."
      }
    },
    "minimap": {
      "$comment": "The zoom-in sheet: one hex of the world map, opened out. Play happens inside it and the result is written back to the big map.\n\nIt is a flat colour, a PATTERN and a grid. No render and no plate: the field is a hexagon of hexagons filled with the plain colour that terrain already prints in, with that terrain's own map mark scattered across the cells (marks.terrain) and the grid ruled on top. That is the whole sheet, and it is still generated rather than commissioned - it needs no artist and no framing entry, which is why it is not in the mint queue and why it is not waiting on anything.\n\nThe pattern is a reversal. These sheets were a flat colour and nothing else, on the argument that drawn ground competes with the pieces standing on it. The argument was half right: a DRAWN sheet competes, and a mark at a third of a cell, on the ink plate, at a third of full strength, does not. It does the job the wash was failing to do on its own - say which ground this is from across the table - and it does it in the black-and-white edition too, where the wash is not there at all. The marks are the world map's own, one set, from data/terrain.json.\n\nThe cell is the load-bearing decision: a mini-map cell is EXACTLY the size of a world-map hex. A figure standing on the big board picks up and stands on a mini-map cell without being re-based, a route token cut for the world map fits a mini-map lane, and one ruler measures both. The scale is a fiction - the ground inside one hex is not nine hexes of ground - and it is the right fiction, because everything physical about the two boards already agrees.",
      "sheet": {
        "widthMm": 297,
        "heightMm": 210,
        "bleedMm": 3,
        "cornerRadiusMm": 6,
        "$note": "A4 landscape, the same sheet as the player board."
      },
      "marginMm": 8,
      "cellsPerSide": 5,
      "$cellsNote": "Five to a side is 61 cells and nine across the middle row - the most that fits on A4 once the cell is pinned to the world hex, and the number the shelved drawn sheets were laid out to.",
      "cellFrom": "maps.<id>.print.presets[default].hexAcrossFlatsMm",
      "$cellFromNote": "Not a number. The cell IS the world hex, so it is read from whichever map and preset the table is playing on, and a bigger printed map makes a bigger mini-map cell without anything here changing.",
      "field": {
        "orientation": "pointy",
        "strokeWidth": 2.4,
        "$note": "Pointy-top cells, the same orientation as the world map's grid, so a lane of cells runs the same way on both boards. The field's edge is not a drawn hexagon: it is the outer edges of the outer cells, traced. A hexagon of hexes has a slightly stepped boundary and a smooth one drawn over it never quite lands on the cells - which is exactly the kind of half-millimetre nobody can see and everybody can feel."
      },
      "grid": {
        "strokeWidth": 0.9,
        "opacity": 0.6,
        "coordinates": true,
        "$note": "Ruled on the ink plate, exactly as the world map's overlay is - and for the same reason: never ask an image model for a grid. See docs/map/README.md. `coordinates` prints a row letter and a cell number in the corner of every cell, so a cell can be named across the table without anybody counting."
      },
      "wash": {
        "from": "palette.terrain[].wash",
        "opacity": 1,
        "$fromNote": "The PRINTED colour, not the screen one. data/terrain.json terrains[].colour is what the explorer paints a hex in; docs/art/palette.json terrain[].wash is what a press puts on paper, and it is already a tint because - as that file says - terrain is the largest printed area in the game and a full-strength ink across it is both ugly and expensive. A mini-map field is the largest printed area of all, so it takes the wash at full strength and the tint is already in it. It also means the ink grid ruled on top stays the darkest thing on the sheet, which the raw screen green did not.",
        "$bwNote": "In the black-and-white edition the field is bare paper and the grid, the letter code and the panels carry the sheet on their own."
      },
      "panels": {
        "left": "encounter",
        "right": "holdings",
        "$note": "What a hexagon on a rectangle leaves over, either side of the field. Both print on every sheet, so no sheet is ever the wrong sheet."
      }
    },
    "marketBoard": {
      "$comment": "The market board: one A4 sheet that explains how a price moves and holds no price at all. Two things live in this block - the RULES SHEET and, under `depletion`, the second sheet of grids that goes with it. Both are drawn by tools/build-market.mjs.\n\nIt was a price tracker: six identical lines of tally, memory and price ladder, and the whole of the geometry here was about making a commodity token fit a band cell. None of that is on the sheet now. The price is on the ledger (components.json ledger), the memory is gone because nothing remembers anything, and what is left is a head that says what the six dice do and a body of four panels, one per kind of good.\n\nThe geometry is derived the way it always was and there is not a coordinate below. The head takes the height its three strips need; the foot takes the height its rows need; the panels take everything left, divided by however many kinds of good pricing.json declares. Declare a fifth and the panels narrow. Nothing ever runs off the paper.",
      "sheet": {
        "widthMm": 297,
        "heightMm": 210,
        "bleedMm": 3,
        "cornerRadiusMm": 6
      },
      "marginMm": 8,
      "gutterMm": 6,
      "head": {
        "$comment": "THE ROLL, across the top of the sheet in one band: the dice on the left, the volatility strip in the middle, the swing ruler on the right. The three of them are the round in the order it happens, so the head reads left to right as an instruction.\n\nIts columns are proportions of the working width rather than of anything else, because there is no longer a set of strips underneath for them to line up with. They are the widths the three things need: the dice block is a count of pieces, the volatility strip is three cells, and the ruler is seven - so the ruler takes the most and gets it.",
        "heightMm": 34,
        "titleMm": 6,
        "columns": {
          "dice": 0.3,
          "volatility": 0.22,
          "ruler": 0.48
        },
        "$columnNote": "Fractions of the working width, summing to one. They are not typed positions: the tool multiplies them out and lays the three blocks left to right with a gutter between, so widening the ruler narrows the other two rather than pushing anything off the sheet.",
        "ruleStrokeWidth": 1.2,
        "cellStrokeWidth": 0.8
      },
      "dice": {
        "$comment": "The die swatches in the head. A die drawn at the size a die is, the colour on the WASH plate and the outline and the face figure on the ink, so the black-and-white edition still has six distinguishable dice - which matters more here than anywhere, because the colour IS the interface.",
        "swatchMm": 6.2,
        "gapMm": 1.4,
        "groupGapMm": 4.2,
        "ink": {
          "$comment": "The dice are called red, blue, green and ochre at the table (pricing.json dice[].colour, arcana.json manaDie.colour) and the palette has no red, blue or green - it has oxide, slate, verdigris, ochre and bruise. This is the one place the two vocabularies are tied together, so a sheet cannot invent a colour and a rulebook does not have to learn a pigment name.\n\nAll five inks are a die now, one each, and there is no sixth ink to make a seventh die out of. That is not a coincidence anybody engineered; it is what happens when a game with a five-colour press decides that colour should mean something.",
          "red": "oxide",
          "blue": "slate",
          "green": "verdigris",
          "ochre": "ochre",
          "purple": "bruise"
        }
      },
      "panels": {
        "$comment": "The body: one panel per entry in pricing.json models, side by side across the full working width, each headed by that model's own mark. This is the sheet's whole subject.\n\nA panel's width is the working width over the number of models - so four panels are narrower than three were, and a fifth kind of good narrows them again rather than running off the edge. What goes IN one is content and lives in data/marketboard.json kinds; this says how tall the mark is and how the prose is set.",
        "markMm": 13,
        "titleMm": 5.2,
        "lineMm": 3.6,
        "bodyMm": 2.9,
        "padMm": 4,
        "ruleStrokeWidth": 1.2,
        "$dividerNote": "A hairline rule between panels and nothing at the ends. A box round each panel would be four rules where one does, and at this size four rules is a table rather than a page.",
        "extraMm": 22,
        "$extraNote": "The height reserved at the foot of a panel for the one strip or grid it needs - the spoil strip for a perishable, an example grid for a finite resource. A staple needs nothing and its panel simply has more air, which is the correct thing for the panel about the goods that do nothing special to look like."
      },
      "panelFoot": {
        "$comment": "The prose. marketboard.json panel, and the only sentences on the sheet that are not about one particular kind of good.",
        "heightMm": 15,
        "ruleStrokeWidth": 1.2
      },
      "timber": {
        "boardWidthMm": 26,
        "seamStrokeWidth": 1.1,
        "grainStrokeWidth": 0.7,
        "grainOpacity": 0.5,
        "knots": 2,
        "$note": "The same sawn ground as the player board. They are the same piece of furniture in two sizes and they should look it."
      },
      "depletion": {
        "$comment": "The second sheet: a page of identical numbered grids, one per finite commodity in play, covered a pip at a time as the stuff is burnt and never uncovered.\n\nEVERY NUMBER HERE IS DERIVED. A cell is the pip that covers it plus its clearance. A grid is the ladder in data/pricing.json depletion - `per` cells across, `top` + 1 rows down - so making a seam last longer is one number in pricing.json and a taller grid here. How many grids fit is a division. A bigger pip makes bigger cells, wider grids and fewer of them per sheet, in that order, and the build fails before a grid gets too wide for the sheet rather than printing one that runs off it.",
        "sheet": {
          "widthMm": 297,
          "heightMm": 210,
          "bleedMm": 3,
          "cornerRadiusMm": 6
        },
        "marginMm": 8,
        "gutterMm": 5,
        "headMm": 14,
        "footMm": 9,
        "cell": {
          "clearanceMm": 1.2,
          "$note": "A cell is the pip's diameter plus this either side. Nothing else decides it.",
          "strokeWidth": 0.7,
          "digitMm": 3.2,
          "$digitNote": "The figure printed in a cell, and it must fit INSIDE THE PIP that covers it - the pip is 4.5 mm across, so 3.2 mm of figure disappears completely under one. A number peeping out from behind the piece that has taken it would make `the lowest one you can still see` a matter of opinion, and tools/build-market.mjs fails the build rather than print one."
        },
        "grid": {
          "seatClearanceMm": 1.5,
          "$seatNote": "The hexagonal blank at the head of a grid, where the commodity's own token stands for the whole game. Its size is the token plus this either side - the same arithmetic the market lines used to seat a price token with, which is the one piece of that board worth keeping.",
          "seatStrokeWidth": 0.8,
          "labelMm": 3.4,
          "gapMm": 2.5,
          "$gapNote": "Between the seat and the top row of cells."
        },
        "timber": {
          "boardWidthMm": 26,
          "seamStrokeWidth": 1.1,
          "grainStrokeWidth": 0.7,
          "grainOpacity": 0.5,
          "knots": 2
        }
      }
    },
    "ledger": {
      "$comment": "The price ledger: one A4 PORTRAIT sheet, the only place a price lives, and the one component in the game that is written on.\n\nPortrait, and the numbers chose it. Landscape gives 273 mm of width - eleven columns nobody needs - and about 150 mm of history; portrait gives 239 mm of history and lands on six columns, which is a town's real traded list. A ledger wants rows.\n\nEVERY NUMBER HERE IS DERIVED, and the two that bind are worth naming. A COLUMN is at least as wide as the commodity token that heads it, measured across the corners, plus the move box beside the figures - the same argument that made a market line one token tall. A ROW is the working height over rules.json victory.gameLengthRounds, which is the honest number of rows because a price can change at most once a round. That second one has teeth: lengthen the game and the rows get shorter, the digits get shorter with them, and at 25 rounds the digit falls under `digit.minHeightMm` and the build fails rather than printing figures nobody can colour in.",
      "sheet": {
        "widthMm": 210,
        "heightMm": 297,
        "bleedMm": 3,
        "cornerRadiusMm": 6
      },
      "marginMm": 8,
      "gutterMm": 4,
      "roundGutterMm": 7,
      "$roundGutterNote": "The strip down the left-hand edge carrying the round numbers, 1 to the game length. It is OUTSIDE the columns and printed once, not repeated in every column - which is what a row label is, and it hands each column nine millimetres back.",
      "head": {
        "heightMm": 27,
        "titleMm": 6,
        "seatClearanceMm": 1.5,
        "seatStrokeWidth": 0.8,
        "$note": "The token's hexagonal seat and nothing else. There is no band strip: six cells of a 7 mm bar is 56 mm against a 31 mm column, and it was not worth having anyway - the price on the sheet IS the band, read against the commodity's own row of six in the annex."
      },
      "column": {
        "padMm": 1.2,
        "gapMm": 1.2,
        "moveBoxMm": 6,
        "$moveBoxNote": "The small ruled box beside each row's figures, for the number of places the price just stepped. It is the only thing on the sheet that is written rather than filled, and it is not optional: a sought good's whole memory is the box on the row above (pricing.json sought).",
        "moveBoxStrokeWidth": 0.7,
        "ruleStrokeWidth": 0.5,
        "dividerStrokeWidth": 1
      },
      "digit": {
        "$comment": "A seven-segment figure, hollow, to be filled in with a pencil. All seven segments are printed whether they belong to any particular number or not - an unlit segment is what makes a hollow figure read as a number WAITING, and drawing only the lit ones would mean this tool knew a price, which it must not.\n\nThe segments are mitred bars - hexagons with 45-degree ends - which is how a seven-segment display has been drawn since somebody first drew one, and the reason is that mitres let seven identical bars meet at six corners without overlapping.\n\nThe proportions are one number and three ratios of it. The width ratio is NOT a taste: for all seven bars to come out the same length, w must be h/2 + t/2, which the tool derives rather than reads.",
        "count": 3,
        "minHeightMm": 8,
        "$minHeightNote": "Below this a segment's colourable core is thinner than a pencil stroke and the sheet stops being fillable. It is the check with teeth, and the game length is what pushes on it: 24 rounds gives an 8.4 mm digit, 25 gives exactly 8.0 and is the last one that passes, and 26 gives 7.63 and fails, naming rules.json victory.gameLengthRounds as the cause. A longer game wants a second sheet, not smaller figures.",
        "thicknessPerHeight": 0.12,
        "gapPerHeight": 0.055,
        "$gapNote": "Mitre clearance, so two segments never quite touch at a corner. Without it a filled 8 is a solid block - and at 0.05 of the height it very nearly still is. The thickness came down from 0.17 for the same reason: proofed at true size (node tools/ledger-proof.mjs) a 0.17 bar in a 4.9 mm figure is almost square, and ten of them in a row read as a line of rosettes rather than as numbers. The enlargement looked fine throughout, which is exactly why the proof prints a millimetre ruler.",
        "digitGapPerHeight": 0.16,
        "outlineStrokeMm": 0.24,
        "$outlineNote": "Hairline, and above the 0.15 mm print floor in palette.json rules.printSafety. It has to be light enough that a filled segment reads as filled rather than as outlined."
      },
      "row": {
        "padMm": 0.8,
        "ruleStrokeWidth": 0.5,
        "ruleEvery": 5,
        "$ruleNote": "Every fifth row rules heavier, which is the same tally motif the board tracks use and for the same reason: it lets somebody find round 17 without counting to 17.",
        "numberMm": 2.6
      },
      "foot": {
        "heightMm": 14,
        "markMm": 6.4,
        "titleMm": 3.2,
        "lineMm": 2.6,
        "ruleStrokeWidth": 1.2,
        "$note": "The four kind-of-good marks in a row, so a player who has just stood a token in a seat can read its corner mark without getting up."
      },
      "timber": {
        "boardWidthMm": 26,
        "seamStrokeWidth": 1.1,
        "grainStrokeWidth": 0.7,
        "grainOpacity": 0.5,
        "knots": 2,
        "$note": "The same sawn ground, turned through ninety degrees with the sheet - the seams run the long way on every component in the game, so a portrait sheet's run up it."
      }
    },
    "buildingTile": {
      "$comment": "How a building tile is drawn. What a tile IS - the cell, the ground model, the ladder, the four shapes, what each side carries - is data/buildingtiles.json; this is the ink.\n\nSame division as the boards, and the same discipline: no coordinate here belongs to any one building, and no building is named. Everything is a fraction of the CELL rather than a millimetre, because the cell is read off the campaign map's print preset and can change - and a name band typed at 4 mm would be a name band that stays 4 mm when the tile grows by half.",
      "bleedMm": 2,
      "$bleedNote": "Less than a card's 3 mm. A tile is die-cut to a hexagon rather than guillotined, and a rotary die holds register far better than a stack of cards being trimmed - but the bleed still has to exist, because the one thing worse than a crooked tile is a white crescent along one edge of it.",
      "cut": {
        "strokeWidth": 2.4,
        "$note": "The die line, drawn on the ink plate at the same weight the mini-map's field edge is traced at - these two edges are butted against each other on the table, and a tile outlined more heavily than the ground it sits on reads as a sticker."
      },
      "back": {
        "$comment": "How the back of a tile is printed. Not a second plate: the face's own plate with the colour run not laid on - the key block pulled before the colour blocks, which is what an unfinished letterpress print is. Declared here because it is INK, exactly like the band and the die line; what a back MEANS is data/buildingtiles.json sides.back.\n\nThese are filter numbers rather than colours, so the palette contract is untouched: nothing new is painted, one thing is printed short. And it is a colour separation, not a blur or a glow - the house style bans soft shading outright, and at seventeen millimetres a softened edge would cost the silhouette the whole deck is built on.",
        "saturation": 0,
        "$saturationNote": "Flat spot colour off, black line left standing. Zero rather than a little: a back that kept a trace of ochre reads as a badly printed face rather than a deliberate one.",
        "duotone": [
          "ink.soot",
          "paper.tallow"
        ],
        "$duotoneNote": "Desaturating alone leaves the plate as neutral grey on white, which is a photocopy of the tile rather than a printing of it - and it breaks the one palette rule this whole set is built on, that the paper is warm oatmeal and never white. So the grey is mapped straight back onto the deck's own two ends: soot where the ink was, tallow where the paper was. That is not a filter dressed up, it is what a single-colour run IS - one ink on the stock - which is exactly the thing the back is meant to be.\n\nRead from docs/art/palette.json by name rather than typed as hex, for the usual reason: a palette that moved and a filter that did not is a back that no longer matches the paper it is printed on.",
        "gamma": 0.85,
        "$gammaNote": "A touch of lift after the map, so the mid tones sit up and the piece does not go muddy at seventeen millimetres. Small on purpose - this is the difference between a light print and a wrong one.",
        "bandHollow": true,
        "$bandNote": "The band is OUTLINED on the back and filled on the face, same name, same corner, same angle, and the SAME ink either way - nameBand.tint, solid on the face with the type reversed out of it in paper, and drawn as a rule with the type in it on the back. Nothing new is painted; the two sides are one colour used two ways. That is the whole of what tells the sides apart at a glance, and it is the cheapest possible way to say it: no second band, no second word, no picture given up. See sides.back.$sameNameBothSides in data/buildingtiles.json for why the load sits here rather than on a word.",
        "bandStrokePerCell": 0.012,
        "bandTextTint": "85"
      },
      "nameBand": {
        "heightPerCell": 0.26,
        "fontPerCell": 0.135,
        "trackingPerCell": 0.012,
        "minFontMm": 1.4,
        "tint": "85",
        "insetPerCell": 0.08,
        "edge": "lower-left",
        "$edgeNote": "The band HUGS ONE EDGE and the type runs parallel to it. It used to be a horizontal strip ruled corner to corner along the widest row - the longest band a hexagon can carry, and wrong for exactly that reason: a bar through the middle of one small drawing splits it into two unrelated halves, which is what it looked like. Tucked against an edge, the picture is whole and the label sits in a corner of it.\n\nAlways the LOWER-LEFT edge, and always the bottom-most then left-most cell that has one open. Fixed rather than chosen per tile: fifty-four pieces on a table want their labels in the same place at the same angle, and a rule that hunted for whichever edge had most room would tilt one tile's name against its neighbour's for no reason a player could see.\n\nLower-left rather than lower-right, which is where it started. Every plate in this deck is drawn from thirty degrees above and thirty to the left, which puts the lit face and the business of the building - the door, the working end, whatever the tile is actually of - on the right, and leaves the bottom-left as foreground ground. That is the corner a label can have.\n\nAnd because it is fixed, it is a thing the ARTIST has to be told: the LABEL BAND note appended to every commission names the corner and says to keep the important detail out of it. Not to leave it empty - a bare corner on a small drawing looks like a mistake - just to put nothing there that the piece needs. The geometry is bandOf in tools/lib/tiles.mjs.",
        "$fitNote": "fontPerCell is the size a name is set at when it fits. When it does not, it is set at whatever DOES fit - worked out from the band's own midline and the number of letters in the name. Nothing is ever clipped and nothing runs over the cut.\n\nThe edge band costs length and the cost is not small: its midline is one edge plus h/sqrt(3), about 73% of what the corner-to-corner strip carried, and nineteen names stopped fitting the day it moved. That is the trade and it is the right way round - a name that has to be shortened is a cheaper problem than a picture that has to be cut in half.\n\nminFontMm is the floor, and it is a millimetre rather than a fraction on purpose: it is not a proportion of anything in this game, it is the smallest type a press will hold on board stock. A name that cannot be set above it fails the build, and the answer is a `shortName` on the building rather than a smaller type."
      },
      "sheet": {
        "widthMm": 210,
        "heightMm": 297,
        "marginMm": 10,
        "gutterMm": 2,
        "$note": "A4 portrait. Every tile prints at its own true size and they FLOW across the page - each one in its own bounding box, gutter between - rather than nesting on a shared hex lattice.\n\nThat is a deliberate deferral, not an oversight. Hexes do nest, and nesting is why everything loose in this game is a hexagon (see tokens above): butted on a lattice, one cut line serves two pieces. But four different polyhex shapes on one lattice is a packing problem, and a packing that is nearly right wastes more paper than the flow does while being far harder to check. It is worth solving the day these are die-cut in quantity, and worth nothing while they are scissors-and-a-prototype - which is what they are until the plates land."
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
          "minLongSide": {
            "from": "components.stock.card",
            "dpi": 300,
            "wantDpi": 600,
            "$note": "DERIVED, not typed. tools/lib/mint.mjs works this out from components.stock.card, the way tools/build-board.mjs works out a track column from the paper: a number somebody types is a number that goes stale the day the thing it describes changes size.\n\nThis line used to say a flat 4000 px. That is the MAP's number - an A1 sheet wants it - and it was inherited by a card that prints at 94 mm on its long side and never did. Every plate ever accepted here was reported as failing a contract cards did not have.\n\n`dpi` is the floor a card must clear; `wantDpi` is the print aspiration, the same two-number shape the maps line uses. The size is the card's SAFE AREA, not its trim and not its bleed: a plate is shown in a picture window, and the window can never be bigger than the safe area because the frame, the stat strip and the story rail take theirs first. Asking for the trim size would be asking for pixels no window has room to spend. It is still generous - the window is smaller again, and a crop keeps about 78% of a portrait page's height - so a plate that only just clears the floor is tighter than the number looks."
          },
          "frozenWording": "docs/art/renders/{plate}.txt"
        },
        "draw": {
          "$comment": "Where a plate on this line comes from when nobody is holding a pen. The mint's split - somebody who can write and cannot draw hands over to somebody who can draw and does not know the rules - does not say the second pair of hands has to be human, only that it has to be a different pair. An image model reached over the wire is the artist; tools/mint-draw.mjs is the courier that used to be a person with a clipboard.\n\nA card can be drawn this way because a card is small: 94 mm across the bleed wants 1110 px at 300 dpi and one call supplies more than that. The maps line has no draw block for the same reason in reverse - an A1 sheet wants 4857 px, one call cannot reach it, and a coastline generated in quadrants does not meet in the middle. See lines.maps.plate.kind.",
          "provider": "openai",
          "model": "gpt-image-1",
          "endpoint": "https://api.openai.com/v1/images/generations",
          "keyEnv": "OPENAI_API_KEY",
          "sizeByFormat": {
            "square": "1024x1024",
            "A4 portrait": "1024x1536",
            "A4 landscape, 3:2": "1536x1024"
          },
          "$sizeNote": "Keyed by the deck's own plateFormat in components.json, so a new deck picks up a size without this tool learning anything about it. A format with no entry here is not drawable and mint-draw says so rather than guessing a shape - the plate proportion is what the framing arithmetic is built on.",
          "$degradeNote": "No key, no route, or anything other than a 200 and mint-draw prints the commission and exits 0. The pipeline is not allowed to depend on this block working: docs/MINT.md's two-agent handover is the version that is definitely going to work, and this is a shortcut through it."
        },
        "$plateKindNote": "A card plate is commissioned or generated, and the DECK says which - plateKind in data/components.json, the same field and the same reason as a map plate.kind. A generated deck (ITEMS, TOOLS) has tools/draw-item.mjs draw each plate from the parts the card carries in its own plate block; it is still a mint subject, still has a brief and still has a FRAMING entry, and it is simply nobody's turn to draw. The line stops at OBJECTS on purpose: a study of a made thing is a silhouette and a line, and a face is not. Delete a card's plate block and that one card is back at DRAW with an artist. See docs/MINT.md.",
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
          "kind": {
            "$comment": "A map plate is one of two kinds and the difference is one field on the map, plate.kind.\n\nDRAWN is the original line and the one docs/MINT.md describes: a person paints a country, tools/trace-map.mjs samples the pixels, and three or four rounds of hand-correction against a proof sheet turn a guess into `rows`. Everything for it is intact — the commission contract, the brief in docs/art/prompts/maps.md, the TRACEABILITY block, the seven rules in docs/map/README.md — and it comes back by setting the field.\n\nGENERATED is the other way round, and the way everything else in this repository already works: `rows` is grown from the commission and the picture is drawn from `rows` by tools/draw-map.mjs. There is no artist, so there is no handover, so a generated map is not a mint subject at all — the queue reports it and chases nobody, exactly as tools/build-minimaps.mjs puts it: generated, not commissioned.\n\nWhy maps went this way and cards did not: an A1 sheet wants 4857 px and one image call gives 1536, and a coastline generated in quadrants does not meet in the middle. A vector plate has no long side, so the nine-sheet preset that korvane-reach.json calls \"a layout waiting on a larger plate\" is simply printable. External map commissioning is paused, not deleted.",
            "values": [
              "drawn",
              "generated"
            ],
            "default": "drawn"
          },
          "format": "landscape, root-two (1.414) inside a plain frame with a visible inner rule",
          "minLongSide": {
            "from": "map.print.presets",
            "dpi": 150,
            "wantDpi": 300,
            "$note": "DERIVED from the map's own largest print preset - the widest `mapWidthMm` in data/maps/{id}.json print.presets - at the target resolution. A map that declares an A1 sheet is asking for A1's pixels, and the queue should say so in the map's own terms rather than from a number somebody typed. 150 dpi is what a wall map read at arm's length clears; 300 is the aspiration.\n\nThis applies to a DRAWN plate only. A generated plate is vector and has no long side at all - see plate.kind."
          },
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
        "id": "buildingtiles",
        "name": "Building tiles",
        "status": "active",
        "subject": "one printed building tile - the face of a building or a sown field, cut to the footprint its own numbers earned it",
        "unit": "tile",
        "groupLabel": "Category",
        "$distinctFromTiles": "NOT the shelved tiles line below, and reopening nothing. That line is a tile-based BOARD - 61 terrain hexes dealt face down so the world is unknown until it is walked - and it stays shelved pending #10. This line is architecture placed ON ground the table already has, whichever way that ground was supplied. See data/buildingtiles.json for the full argument.",
        "subjectsFrom": {
          "kind": "tiles",
          "$note": "tools/lib/tiles.mjs, which reads data/buildings.json for the buildings and data/recipes.json for the sown crops, and works each one's footprint out through the ground model and ladder in data/buildingtiles.json. Two files in, one kind of subject out: a building tile and a field tile differ only in where their subject was read from."
        },
        "subjectRequires": [
          "id",
          "name",
          "label",
          "summary",
          "shape",
          "cells",
          "state"
        ],
        "$subjectRequiresNote": "Checked against the assembled TILE, not against the building - because the tile is what is being minted, and half of what a brief needs (the shape, the cells, which word is on the back) is worked out rather than written down. A building that has said nothing about its own tile has still said everything the tile needs, which is the point of deriving it.",
        "brief": {
          "dir": "docs/art/prompts",
          "file": "buildingtiles.md",
          "headingIs": "plateId",
          "$note": "One `## tile-<id>` section per tile, in one file, buildings and fields together - they are drawn by the same hand to the same brief and splitting them would split the shared preamble that makes them a set."
        },
        "plate": {
          "dir": "docs/art/renders",
          "ext": ".png",
          "idFrom": "tile-{id}",
          "formatFrom": "the footprint's own aspect",
          "$formatNote": "DERIVED, not declared per tile. A shape's bounding box has an aspect - a single hex is 0.87, a pair is 1.73 - and the format asked for is whichever entry in `draw.sizeByFormat` comes nearest it. So a shape that changes changes the page it is drawn on, and a page nobody can supply is a build failure rather than a plate that arrives the wrong shape.",
          "minLongSide": {
            "from": "the largest world hex any map declares",
            "dpi": 300,
            "wantDpi": 600,
            "$note": "DERIVED, like the other two lines, and from the biggest table rather than today's. A tile cut to the four-sheet preset is 19 mm on its long side and would ask for about 230 px, which is a floor nothing could fail; but the same tile cut to the nine-sheet A1 preset is half as big again, and a plate drawn to the smaller number can never be recut for the larger one. Ask for the width before anything else - it is the one property that cannot be recovered."
          },
          "frozenWording": "docs/art/renders/{plate}.txt"
        },
        "draw": {
          "$comment": "Same courier as the cards line, and available for the same reason: a tile is small, one call supplies more pixels than a 31 mm piece can spend, and the handover in docs/MINT.md is still the version that definitely works. No key, no route or anything but a 200 and mint-draw prints the commission and exits 0.",
          "provider": "openai",
          "model": "gpt-image-1",
          "endpoint": "https://api.openai.com/v1/images/generations",
          "keyEnv": "OPENAI_API_KEY",
          "sizeByFormat": {
            "square": "1024x1024",
            "A4 portrait": "1024x1536",
            "A4 landscape, 3:2": "1536x1024"
          }
        },
        "aim": {
          "step": "FRAME",
          "owner": "whoever accepts the plate",
          "file": "docs/art/framing.json",
          "at": "plates",
          "produces": "a `subject` box, a `focal` point and a one-line `note`",
          "contract": "docs/art/09-framing-and-composition.md",
          "$note": "The same aim a card takes, and the same file, because it is the same job: a drawn page is not the shape of the window it will be seen through, and something is thrown away. What differs is only the window - a tile's is its own footprint's bounding box, which tools/validate-framing.mjs measures against rather than assuming a card."
        },
        "builds": [
          "docs/tiles/ - tools/build-tiles.mjs, a face and a back for every tile"
        ],
        "$oneSubjectPerTile": "A tile is ONE subject on this line, not two. It was two while the back was drawn - the building finished, and the same ground with the work not yet done - and the back is not drawn any more: it is the face's own plate with the colour run not laid on, soot on tallow, its name band hollow instead of solid. There is no second picture, so there is no second brief, no second framing entry and no second step, which is to say no second subject.\n\nThe reason is the rule it kept breaking. The two sides have to turn over onto each other - same viewpoint, same distance, the building in the same place on the page - and two separately drawn plates have to be argued into that every time and drift out of it for free. One plate printed two ways cannot drift. tools/lib/tiles.mjs platesOf is the single place that arithmetic lives; the mint queue and validate-data both sweep it rather than writing out a list of sides, which is how those two came apart the last time this changed.",
        "checks": [
          "node tools/validate-data.mjs",
          "node tools/validate-art.mjs",
          "node tools/build-tiles.mjs --check",
          "node tools/validate-framing.mjs"
        ]
      },
      {
        "id": "tiles",
        "name": "Terrain tiles",
        "status": "shelved",
        "issue": 18,
        "issueUrl": "https://github.com/cdomotor-g/game1/issues/18",
        "subject": "one printed hex terrain tile face, and the zoom-in sheet behind it",
        "$notTheBuildingTiles": "Not the buildingtiles line above, which is active. This line is a way of SUPPLYING A BOARD - a bag of ground dealt face down instead of a drawn map. That one is architecture placed on ground the table already has, and is wanted whichever way the ground arrived. Nothing about the building tiles reopens this, and nothing here blocks them; they share a cell size because everything in this game shares a cell size.",
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
  "artstyle": {
    "$comment": "The house style for a DRAWN plate, declared once. Every brief in docs/art/prompts/ has its `## Shared preamble` and `## Negative prompt` blocks generated from this file by tools/build-prompts.mjs, and `--check` fails the build when one has drifted - which is the whole reason the file exists.\n\nIt exists because the style drifted and nobody could see it happen. The preamble was copied by hand into ten prompt files and into docs/art/07-ai-agent-brief.md, and what every copy described - `heavy uneven woodcut-style outlines`, `flat muted spot colour ... solid areas of colour with no blending`, `chunky exaggerated proportions with a bold readable silhouette` - is not what a single accepted plate in docs/art/renders/ actually is. Those plates are fine pen-and-ink with dense hatching, tinted with thin translucent watercolour, naturalistically proportioned. Early image models drew that anyway; literal ones drew what the words said, which is a flat vector infographic.\n\nSo the words now describe the plates. The flat register was not deleted - it moved to the negative, where `woodcut`, `flat vector` and `thick uniform outline` had always belonged.\n\nWhat is NOT here: the two-plate contract in docs/art/01-two-plate-system.md. That is about the GENERATED components - the SVG cards, boards and tiles this repository draws itself, where ink and wash really are separate layers and tools/validate-art.mjs enforces it. A drawn plate is one hand-tinted illustration and has never been separable that way. Reading the wash plate's `flat spot colour` as a rendering instruction for a drawn plate is how half of this went wrong.\n\nThis file holds no content: no card is named in it and no subject is described. A register says what a FAMILY of plates is a plate of, exactly as data/mint.json says what a line is.",
    "version": "0.1.0",
    "house": {
      "line": [
        "Fine pen-and-ink drawing on aged paper, finished by hand with thin watercolour washes: {plate}. Drawn with a nib - a fine, springy, varied line, only a little heavier round the outside of a form than within it, thinning and breaking where the light catches an edge. Never a thick uniform outline.",
        "All tone is hatching: short feathered strokes laid along the form and crossed over one another in the darks, fine and dense enough to read as continuous shadow at arm's length and still be separate strokes close up. Nearly every surface carries some. Bare paper is kept for the brightest highlights only."
      ],
      "colour": "Thin translucent watercolour is washed OVER the finished ink, so the hatching reads through the colour everywhere: it tints the drawing, it never fills it. The washes are uneven - a little darker where they pool against an edge, stopping short of the line as often as they cross it. Muted and desaturated throughout, {palette}. Paper is warm aged oatmeal, never white. Ink is warm near-black, never pure black.",
      "notACard": "This is a PLATE: one whole drawn page of artwork, and nothing else. It is NOT a card. The card frame, the title, the card code, the stat icons, the rules text and the flavour text are all set by machine afterwards, from the data, over a crop of this page. Draw the picture alone, edge to edge - no panel, no banner, no border rule, no box, and no lettering of any kind anywhere on the page.",
      "tone": "The mood is workaday and observed, never theatrical. This is a world of trade, weather and repair: ordinary daylight, ordinary ground, and nothing staged to look frightening or heroic. A dangerous animal is drawn the way a naturalist draws one - at a wary distance, doing what it ordinarily does - rather than the way a poster sells a fight.",
      "$order": "notACard, then line, then colour, then tone, then the register's own composition, then its closing. notACard is first because it is the one an artist has actually got wrong."
    },
    "negative": {
      "$comment": "`shared` goes on every register. `plates` goes on every register that uses the house style - so not maps, whose own `house` block marks it a different medium and which legitimately wants a cartouche, a legend panel, a border rule and hand-lettered names. A term is added in one place and every brief that should have it gets it.",
      "shared": [
        "coffee ring",
        "cup ring",
        "water ring",
        "tea stain",
        "circular stain",
        "ring stain",
        "watermark",
        "blot",
        "gradient",
        "glow",
        "bloom",
        "lens flare",
        "drop shadow",
        "soft shading",
        "airbrush",
        "blur",
        "depth of field",
        "neon",
        "saturated colours",
        "pure white background",
        "pure black",
        "photorealistic",
        "3d render",
        "octane",
        "unreal engine",
        "digital painting",
        "oil painting",
        "concept art",
        "anime",
        "cel shaded",
        "sparkles",
        "signature",
        "text",
        "letters",
        "logo",
        "UI",
        "frame border",
        "woodcut",
        "linocut",
        "block print",
        "flat vector",
        "vector illustration",
        "flat colour fill",
        "solid colour block",
        "thick uniform outline",
        "heavy black outline",
        "bold outline",
        "infographic",
        "diagram",
        "icon",
        "minimalist",
        "clip art",
        "screen print",
        "poster art",
        "comic",
        "cartoon",
        "colouring book",
        "menacing",
        "sinister",
        "ominous",
        "horror",
        "gothic",
        "demonic",
        "hellish",
        "glowing eyes",
        "burning eyes",
        "snarling",
        "bared fangs",
        "blood-red sky",
        "ruined castle",
        "dead trees",
        "wasteland",
        "hellscape",
        "brimstone",
        "epic",
        "dramatic lighting",
        "high contrast",
        "movie poster",
        "book cover"
      ],
      "plates": [
        "card frame",
        "card border",
        "card layout",
        "trading card",
        "game card",
        "title bar",
        "name banner",
        "title banner",
        "stat block",
        "stat icons",
        "rules text box",
        "flavour text",
        "caption box",
        "panel",
        "plate number",
        "rounded corners",
        "inset picture",
        "picture window",
        "matte",
        "mount"
      ]
    },
    "registers": [
      {
        "id": "characters",
        "name": "Characters",
        "plate": "a portrait plate from an illustrated folio of working people",
        "palette": "warm ochre, rust red, dusty grey-green, cold slate blue",
        "composition": [
          "A three-quarter-length portrait plate of one person, drawn from life, mid-habit rather than posed, on a short ground line with their working gear about them. Clothes and kit are worn from real use and carefully mended - patches, re-stitched straps, a wrapped tool handle - never ruined. The page itself is tattered from time in the field: creases, a grimy thumbed corner, faint foxing at the edges. The silhouette reads clearly."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects, no magic particles. No text, no letters, no border rule.",
        "negative": [
          "chibi",
          "cute",
          "magic particles",
          "glowing runes",
          "grimdark",
          "ruined",
          "apocalyptic",
          "heroic pose",
          "action scene"
        ]
      },
      {
        "id": "peoples",
        "name": "Peoples",
        "plate": "a figure plate from an illustrated folio of peoples",
        "palette": "warm ochre, rust red, dusty grey-green, cold slate blue",
        "composition": [
          "A full-page folio plate: one full-length figure study filling the page, drawn from life at middle distance, standing on a short ground line with the tools and clutter of their work around their feet. The page itself is worn from travel - soft creases, a thumbed corner, faint foxing stains at the edges - but the drawing is careful and complete. Proportions are naturalistic and observed, never exaggerated. The silhouette reads clearly."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no border rule.",
        "negative": [
          "chibi",
          "cute",
          "magic particles",
          "glowing runes",
          "grimdark",
          "ruined",
          "apocalyptic"
        ]
      },
      {
        "id": "monsters",
        "name": "Monsters",
        "plate": "a plate from an illustrated bestiary",
        "palette": "warm ochre, rust red, dusty grey-green, cold slate blue",
        "composition": [
          "A full-page bestiary plate: one creature filling the page, full length, drawn from observation at a wary distance, standing in a strip of its own terrain on a short ground line. The pose is characteristic behaviour, not attack. The page is worn from travel - creases, a thumbed corner, faint foxing - but the drawing is careful. The silhouette reads clearly."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects, no magic particles. No text, no letters, no border rule.",
        "negative": [
          "chibi",
          "cute",
          "magic particles",
          "glowing eyes",
          "glowing runes",
          "fire glow",
          "light rays",
          "battle scene",
          "multiple creatures",
          "human figures"
        ]
      },
      {
        "id": "vehicles",
        "name": "Vehicles",
        "plate": "a plate from an illustrated book of conveyances",
        "palette": "warm ochre, rust red, dusty grey-green, cold slate blue",
        "composition": [
          "One vehicle in full working profile, filling the width of the page, on a short strip of its own ground - rail, water, or road. Every strap, rivet, lashing and repair visible and true; in daily use, well maintained, never ruined. The page is worn from the road: creases, a grimy corner, faint foxing. The silhouette reads clearly."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no livery lettering, no border rule.",
        "negative": [
          "numbers",
          "grimdark",
          "ruined",
          "wrecked",
          "apocalyptic",
          "modern vehicle",
          "diesel",
          "car",
          "truck"
        ]
      },
      {
        "id": "items",
        "name": "Items, weapons and armour",
        "plate": "a plate from an illustrated catalogue of arms and equipment",
        "palette": "warm ochre for timber and horn, rust red for leather and cord, cold slate blue for iron and steel",
        "composition": [
          "A single item, centred, three-quarter view, laid on a bench or stood against it with a short ground line, drawn at the scale of a pattern-book plate: every rivet, seam, lashing, grain and repair legible. In daily use and carefully kept - the grip worn where the hand goes, the edge honed narrow, a strap replaced in mismatched leather - never new, never ruined. The silhouette reads clearly. The page is worn from the workshop: creases, a grimy corner, faint foxing."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no dimension figures, no border rule.",
        "negative": [
          "magic",
          "runes",
          "numbers",
          "blueprint",
          "technical drawing",
          "exploded diagram",
          "callout lines",
          "product photograph",
          "lit flame",
          "burning wick",
          "firelight",
          "light rays",
          "sparks",
          "embers",
          "hands",
          "arms",
          "figure",
          "wielder",
          "mannequin",
          "armour stand",
          "coat hanger",
          "clothes rail",
          "battle",
          "blood",
          "grimdark",
          "ruined",
          "rusted through",
          "shattered"
        ]
      },
      {
        "id": "tools",
        "name": "Tools",
        "plate": "a plate from an illustrated catalogue of working tools",
        "palette": "warm ochre for timber, cold slate blue for iron and steel, rust red for leather and cord",
        "composition": [
          "A single tool, centred, three-quarter view, stood against a bench or laid on one with a short ground line, drawn at the scale of an inventory plate: every wedge, ferrule, rivet, grain line and repair legible. WORN BY USE and kept in service - the haft polished dark where the hands go, the edge hollowed back from years of sharpening, a split bound with wire rather than replaced. In daily use, never new, never abandoned. The silhouette reads clearly. The page is worn from the workshop: creases, a grimy corner, faint foxing."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no dimension figures, no border rule.",
        "negative": [
          "numbers",
          "blueprint",
          "technical drawing",
          "exploded diagram",
          "callout lines",
          "product photograph",
          "hands",
          "arms",
          "figure",
          "weapon",
          "battle axe",
          "fantasy weapon",
          "ornate",
          "ornate engraving",
          "jewelled",
          "brand new",
          "chrome",
          "ruined",
          "rusted through",
          "broken"
        ]
      },
      {
        "id": "talismans",
        "name": "Talismans",
        "plate": "a plate from an illustrated book of charms",
        "palette": null,
        "$noPalette": "A talisman's colour rule IS its composition - one violet laid out of register - so the house colour paragraph is skipped rather than contradicted.",
        "composition": [
          "A single small object, centred, three-quarter view, on a short ground line, drawn at the scale of a jeweller's study - every knot, rivet, scratch and repair legible. In daily use and carefully kept, never ruined.",
          "Its ONLY unusual quality: a flat violet spot colour (#6B4C7D) printed out of register - offset about a millimetre from the black line, bleeding past the object's edge like a misprint on a cheap press. The black line itself is perfectly normal. No glow, no sparkle, no light source, no particles."
        ],
        "closing": "Paper is warm oatmeal, never white. Ink is warm near-black, never pure black. Strictly no gradients, no drop shadows, no soft shading. No text, no letters.",
        "negative": [
          "magic particles",
          "glowing runes",
          "light rays",
          "multiple objects",
          "jewellery product photo"
        ]
      },
      {
        "id": "modifications",
        "name": "Modifications",
        "plate": "a plate from an illustrated shipwright's catalogue of fittings",
        "palette": "warm ochre, rust red, dusty grey-green, cold slate blue",
        "composition": [
          "A single fitting, centred, three-quarter view, laid out on a workshop floor or bench with a short ground line, drawn at the scale of a pattern-book plate: every rivet, seam, lashing, thread and repair legible. New or newly overhauled, ready to fit, never ruined and never installed - this is the part before it goes on. The page is worn from the workshop: creases, a grimy corner, faint foxing. The silhouette reads clearly."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no dimension figures, no border rule.",
        "negative": [
          "numbers",
          "blueprint",
          "technical drawing",
          "exploded diagram",
          "callout lines",
          "grimdark",
          "ruined",
          "wrecked",
          "horizon",
          "landscape",
          "seascape",
          "coastline",
          "shoreline",
          "beach",
          "background scenery",
          "distant hills",
          "clouds",
          "installed",
          "in use",
          "mounted on a vehicle",
          "the vehicle it fits",
          "outdoors"
        ]
      },
      {
        "id": "buildingtiles",
        "name": "Building tiles",
        "plate": "a plate from an illustrated surveyor's notebook of buildings",
        "palette": "warm ochre for thatch and timber, rust red for tile and brick, dusty grey-green for grass and crop, cold slate blue for stone, iron and water",
        "composition": [
          "ONE small building or one worked patch of ground, drawn from about thirty degrees above and thirty degrees to the left, standing on its own ground which runs to every edge of the page. The MASSING is simple and unmistakable - three or four shapes and no more, so the building is still itself when the whole plate prints seventeen millimetres across. That is a rule about the shapes, not about the drawing: the interior is hatched as finely as on any other plate. Built by hand out of local material and kept in repair - a patched roof, a leaning post, a worn path to the door - never new, never ruined, never abandoned.",
          "Nobody in it. No figures, no animals unless the brief names them as the subject. No sky, no horizon, no middle distance, no background scenery: the ground fills the page."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadows, no soft airbrushed shading, no lens effects. No text, no letters, no numerals, no signage. No border rule, no vignette, no grid.",
        "negative": [
          "chibi",
          "cute",
          "isometric video game asset",
          "magic particles",
          "numerals",
          "signage",
          "vignette",
          "hex grid",
          "square grid",
          "ruled lines",
          "horizon",
          "sky",
          "clouds",
          "background scenery",
          "distant mountains",
          "people",
          "figures",
          "crowd",
          "heroic",
          "grimdark",
          "ruined",
          "apocalyptic",
          "overgrown",
          "abandoned",
          "cutaway",
          "floor plan",
          "blueprint",
          "elevation drawing",
          "floating island",
          "diorama",
          "plinth",
          "base slab",
          "cut-out",
          "isolated object on a plain background",
          "white margin",
          "empty border",
          "caption",
          "handwriting",
          "manuscript text",
          "book page",
          "page border",
          "plate number",
          "framed illustration",
          "mounted plate"
        ]
      },
      {
        "id": "maps",
        "name": "Maps",
        "$ownRegister": "A map is a different medium from every other plate here - an engraved atlas sheet, where a flat hard-edged wash is the right answer and not the drift. It keeps its own opening paragraphs.",
        "house": {
          "line": [
            "A hand-drawn fantasy region map on aged parchment, in the style of a 17th-century printed atlas plate: fine engraved coastline, hand-lettered place names in a serif face, a decorative border rule, a title cartouche in one corner, a compass rose, a scale bar in leagues, and a legend panel in another corner."
          ],
          "colour": "Flat muted washes of colour with hard edges and no blending: dusty grey-green for woodland, pale yellow-green for open grass, warm ochre for sand and dry country, near-white for ice and tundra, muted slate blue for the sea, with the shallows a lighter tint of the same blue than the deep water. Paper is warm oatmeal, never white. Line is warm near-black, never pure black."
        },
        "composition": [
          "Landforms are drawn as repeated small engraved glyphs on top of the wash: hatched triangular peaks for mountains, small arcs for hills, tiny conifers and round-topped trees for forest, low tufts for tundra, horizontal tufts for marsh, loose crescents for dunes. Rivers are thin cold-blue lines running from high ground to the sea. Roads are thin double lines, railways are hatched lines."
        ],
        "closing": "Strictly no gradients, no glow, no drop shadow, no soft airbrushed shading, no photographic texture, no 3D relief or hillshading.",
        "negative": [
          "hillshading",
          "terrain relief shading",
          "satellite imagery",
          "contour lines",
          "depth soundings",
          "grid lines",
          "hex grid",
          "square grid",
          "latitude longitude lines",
          "modern typography",
          "sans-serif labels",
          "national borders",
          "political colouring",
          "minimap",
          "game UI",
          "frame border with figures"
        ]
      }
    ],
    "exemplars": {
      "$comment": "The accepted plates an artist is pointed at, declared once. tools/build-styleref.mjs draws them into docs/art/style-reference.png - ONE small sheet, served by GitHub Pages, because the four-megabyte originals are not reachable through a GitHub connector and are a poor thing to fetch over a URL. The written style is what a plate is drawn FROM; this sheet is what it is checked against, and an artist that cannot see it draws anyway.",
      "sheet": "docs/art/style-reference.png",
      "plates": [
        {
          "plate": "character-chr-01",
          "title": "CHR-01 — the line and the wash",
          "note": "Look at the cloak. The colour is a thin translucent wash and the hatching reads straight through it - it tints the drawing, it never fills it. No shape on this page is outlined in a heavy even line. Proportions are a person's, not exaggerated."
        },
        {
          "plate": "modification-spinnaker",
          "title": "MOD-01 — an object study",
          "note": "The same hand on made things, and the register MOD-02 is drawn in. Every surface carries hatching; bare paper is only the brightest highlights. The reds and blues are muted and uneven, pooling darker at the edges."
        },
        {
          "plate": "monster-cinder-wolf",
          "title": "MON-01 — the tone, on a monster",
          "note": "A dangerous animal, drawn as a naturalist draws one: padding across burnt grass, doing what it ordinarily does. Coals between the ribs and a dropped shepherd's crook carry the threat. No snarl, no glowing eyes, no blood-red sky, no ruined castle. This is the tone for every plate in the game."
        }
      ]
    }
  },
  "playerboard": {
    "$comment": "The player board: the sheet of A4 a player keeps in front of them. It holds one card of whatever is in play, four cards of that thing's kit, four numbered tracks up the middle for the figure, and a narrow fifth against every kit slot for the thing lying in it.\n\nOne board, not one per people, not one per SPECIES, and not one per KIND OF THING either. Everything that differs between an orc and a halfling is printed on the card that lies in the recess - strength, health, what they can shoulder - so the board underneath has no business knowing which of them is sitting there. That is also why a monster met on the road is dealt onto a spare one of these and run like a player who is not a person (rules.json exploration.discovery.encounter), and why a VEHICLE in play gets one too: a wagon has a hull that takes damage, a load it can shoulder, a pace along the road and a hold that its cargo and its modifications sit in, and every one of those is a track or a slot this board already has. The furniture does not care what is sitting in it.\n\nThat is what retired the sixth track. There was a V for vehicle damage, printed on every board whether or not the player was running anything - a whole column, on everybody's sheet, about somebody else's wagon. A vehicle is a figure now: it is dealt its own board, its damage is its HEALTH, and the columns left over got wider.\n\nThen the fifth went the same way, for the opposite reason. DEFENCE was a rating a token barely ever moved, and when a battle became one opposed total (rules.json conflict.battle) there was nothing left for it to do that armour on a card was not already doing. Four columns up the middle now, at 15.6 mm apiece against the 13.6 that five of them managed - and what the paper bought is the thing the board never had room for: a WEAR ladder against every one of the four kit slots, so the axe, the sword and the lantern are each counted down beside their own card. The middle of the board is about the figure; the edge of it is about what the figure is carrying.\n\nWhy the board carries the tracks and the cards do not: a card in a recess is a card whose edges you cannot reach. Cards used to hang harm off the left edge and capacity off the right, which works beautifully for a card held in the hand and not at all for one lying in a slot with five others. So the board took the walking over and the cards took a summary strip across the top instead - the maximum, in a lettered box, and nothing that moves. One place to look, one place to knock the tokens off, and the cards stay flat.\n\nThis file is content: what the tracks are, what they count, what the slots take. How the board is DRAWN - sheet size, margins, how wide a recess is cut, how tall a rung is - is declared once in components.json under `board`, like every other component. Nothing in here is a number the build tool also knows.",
    "version": "0.4.0",
    "board": {
      "id": "player-board",
      "name": "Player Board",
      "sheet": "A4 landscape",
      "summary": "One per player, one per vehicle in play, and one spare for the table, and every one identical. The card in play top left, four tracks up the middle, four cards of kit on the right each with its own wear ladder against it, and the round's phases under it.",
      "spare": "Print more than there are players: one spare for the ENCOUNTER, and one for every vehicle anybody expects to have on the road at once. The encounter board is the one a monster or a stranger is dealt onto when a discovery roll turns one up - its tracks are set from the card's summary strip and it is played like any other seat at the table until the encounter is over (rules.json exploration.discovery.encounter). A vehicle board is the same board doing the same job for a hull instead of a body.",
      "note": "The board is a workbench (docs/art/06-components.md): sawn timber ground, the tracks routed into the surface. It carries no border - the sheet is working surface to its edges, and with four tracks rather than six each column is nearly two millimetres wider than it was even after the wear ladders have taken theirs.",
      "generic": "The board says nothing about who is playing it - or about whether who is playing it is a person, or alive. People, calling, health, strength, armour and what can be shouldered are all printed on the card in the recess, which is the thing that changes; the board is the furniture that card sits in. Being generic is what lets one design serve a player, a dealt monster, a stranger met on the road and the wagon they are all arguing about."
    },
    "$trackKeys": {
      "$comment": "What a track entry means. A track is a printed ladder walked by a token: a bar (components.json tokens.bar) on the four columns up the middle, a smaller pip (tokens.pip) on the wear ladders, which are narrow enough that a bar would overhang. Rungs numbered from the bottom, step apart, in plain figures with no sign on them. The first rung is zero - the board's ceiling and floor are declared once in components.json under board.track, and EVERY track runs the whole way, wear ladders included, so the whole sheet is one grid rather than a set of scales a player has to keep straight.",
      "letter": "the single letter printed at the head of the column - what a player calls the track across the table",
      "label": "the full name, printed beside the letter",
      "unit": "printed under the letter where the track counts something other than itself - hexes, on the one track that does",
      "step": "how much one rung is worth; `stepFrom` instead means 'read it from that dotted path in the data, do not restate it'",
      "kind": "harm | capacity | leg | rating - decides the ink the track washes in",
      "place": "column (one ladder up the middle of the sheet, about the figure in the recess) or kit (a narrow ladder against a card slot, about the card lying in it). Absent means column.",
      "count": "how many of this track are ruled. Absent means one; a kit track says four, because there are four slots.",
      "covers": "the largest value the printed game can reach, so the ceiling can be checked against it. `paths` is where that number comes from, and tools/validate-data.mjs recomputes it: a character with 15 health fails the check rather than running off the top of the track",
      "reads": "who reads the number and which way round - a wear track is its owner's business and nobody else's",
      "$marksNote": "There is no `mark` any more. Every rung used to carry a little ink-plate glyph saying which KIND of number it was - a notch down for harm, a pip for a rating - and at 11 mm a column it fought the number for the same three millimetres and won often enough to matter. The columns are numbered and nothing else: no glyph, no plus, no minus. Which way a token walks is on the track's `walks` line and in the rulebook, where a sentence has room to say it."
    },
    "tracks": [
      {
        "id": "health",
        "name": "Health",
        "letter": "H",
        "label": "HEALTH",
        "unit": null,
        "kind": "harm",
        "ink": "oxide",
        "step": 1,
        "covers": {
          "value": 14,
          "paths": [
            "characters.characters[].health",
            "monsters.monsters[].health",
            "vehicles.vehicles[].hull"
          ],
          "note": "Vhalrik, who is dealt onto one of these boards like anybody else the moment he is met. The sturdiest hull in the vehicle deck reaches 12 on the same column."
        },
        "walks": "Down as the figure takes hits, and up under medical aid alone - 3 a round with a healer or in an infirmary, 2 from a physician who happens to be standing there. Sleeping does not mend it. A round that ends with nothing to eat costs 1. A VEHICLE runs the same column and reads it as its hull: set it from the card, down as it is damaged, up as it is repaired - one rung a round in any settlement of town rank or better, at 5 coin a rung.",
        "atZero": "The figure is carried to the nearest settlement and stays there until healed to half. Everything it was carrying is lost on the way. A vehicle at zero is wrecked: it spills its cargo on the hex, and salvage belongs to whoever reaches it first.",
        "note": "This column swallowed the vehicle track. There used to be a V beside it counting damage on somebody's wagon, printed on every board in the game whether or not anybody was running one - and counting UP, which is the only number on the board that did. A hull is a body: it has a maximum on its card, it takes hits, it is mended in town, and at nothing it is carried off. One column, one direction, and the wagon gets a board of its own to walk it on.",
        "rule": "rules.json rest, rules.json upkeep.food, characters.json health, monsters.json health, vehicles.json hull"
      },
      {
        "id": "strength",
        "name": "Strength",
        "letter": "S",
        "label": "STRENGTH",
        "unit": null,
        "kind": "rating",
        "ink": "ochre",
        "step": 1,
        "covers": {
          "value": 7,
          "paths": [
            "monsters.monsters[].strength",
            "characters.characters[].strength"
          ],
          "note": "Vhalrik. No character reaches it - Ruk, the strongest, is 6."
        },
        "walks": "Set it from the card at setup and knock it down a rung for every night the party does not make camp. One night's sleep puts all of it back, wherever that night is taken.",
        "atZero": "Nothing left to swing with, and nothing left to shoulder. A figure at 0 strength does not fight and carries nothing.",
        "reads": "Both ways at once. Your strength is on this track and the thing you are fighting has its defence printed in front of you; the roll is the difference. It is also what you can carry: strength x rules.carrying.kgPerStrength kilograms, and the character card prints the kilograms so nobody multiplies at the table.",
        "note": "Strength swallowed burden. They were the same arm doing the same job with two numbers and two tracks, and one of them was a track a player moved every time they picked up a rope.",
        "rule": "rules.json conflict.strength, rules.json carrying, rules.json upkeep.night, monsters.json strength, characters.json strength, peoples.json strength.base"
      },
      {
        "id": "pace",
        "name": "Pace",
        "letter": "P",
        "label": "PACE",
        "unit": "hexes",
        "kind": "leg",
        "ink": "verdigris",
        "step": 1,
        "covers": {
          "value": 8,
          "paths": [
            "monsters.monsters[].pace"
          ],
          "note": "Mounted on a road - the fastest anything crosses country in a day leg (travel.json speeds.overrides road) - and, on the same number, the storm roc, which is why nobody on foot has ever got away from one."
        },
        "walks": "Set it at the start of a leg to the speed in travel.json for the mode and the ground, then walk it down a rung per hex entered. Halve it for a night leg under a lantern; a torch buys one hex, two on a road.",
        "atZero": "The leg is over. Roll for discovery where you stopped.",
        "note": "The one track that is not a number off a card. A party counts hexes every single round of the game and has had nowhere to count them, which is what a board is for. It rules in verdigris - the ground you cross - so it cannot be mistaken for harm or for a rating at a glance. It is called pace rather than speed because strength has the S.",
        "rule": "travel.json speeds, rules.json movement.legs"
      },
      {
        "id": "mana",
        "name": "Mana",
        "letter": "M",
        "label": "MANA",
        "unit": null,
        "kind": "capacity",
        "arcane": true,
        "ink": "bruise",
        "step": 1,
        "covers": {
          "value": 10,
          "paths": [
            "items.items[].manaCapacity",
            "peoples.peoples[].manaStorage.innate"
          ],
          "note": "The crystal phylactery, the deepest vessel in the game."
        },
        "walks": "Everything the hero can hold at once: what their body holds innately, plus every talisman in a slot. Slaying a monster fills it; casting spends it.",
        "atZero": "Empty. Mana crystals are frozen mana - shatter one for 2 of any element - but mana never freezes back.",
        "note": "The only arcane thing on the board, so the only thing that gets the slip: the wash is struck a shade off the line, the way this world's presses could never quite get magic to sit still. In the black-and-white edition there is no slip and nothing is lost.",
        "rule": "arcana.json, items.json manaCapacity, peoples.json manaStorage"
      },
      {
        "id": "wear",
        "name": "Wear",
        "letter": "W",
        "label": "WEAR",
        "unit": null,
        "place": "kit",
        "count": 4,
        "kind": "harm",
        "ink": "slate",
        "step": 1,
        "covers": {
          "value": 14,
          "paths": [
            "items.items[].wear",
            "tools.tools[].baseWear"
          ],
          "note": "A large loom, the longest-lived thing anybody owns. The deepest a figure carries on its back is the plate harness at 12."
        },
        "walks": "Down. Set it from the W box on the card the moment the thing is put in the slot beside it, knock it down a rung every time the thing is used, and put it back up as a blacksmith mends it - three rungs a round, four coin a rung.",
        "atZero": "Worn out. The card is discarded and the track cleared, and whatever the thing was doing for its owner it stops doing at once.",
        "reads": "Only its owner. A wear track is about a possession, not a person, and nobody else at the table has to know how blunt your axe is until you swing it.",
        "note": "FOUR OF THEM, one beside each kit slot rather than one column up the middle, because wear is the first number on this board that belongs to a CARD rather than to whoever is sitting behind it. A single W column could only ever have counted one item's wear, and a player carries four. So it is drawn where the thing it counts is lying, in a narrow ladder against the recess, walked by a pip rather than a bar (components.json tokens.pip) - which is what makes fifteen rungs fit down the side of an 88 mm card.\n\nIt is the track that paid for itself. The D column went out of the middle of the board the same day this arrived at the edge of it, and the four columns left are wider than the five ever were: 15.6 mm against 13.6.\n\nThe strip letter for wear already existed (components.json statStrip.letters) and its note said there would never be a track under it, because wear ran past twenty and the board stops at fourteen. There is a track under it now, and wear runs to fourteen - the number came down to meet the board, which is the way round this game has always settled that argument.",
        "rule": "rules.json wear, items.json wear, tools.json baseWear"
      }
    ],
    "$placeNote": "A track's `place` says where on the sheet it is ruled. `column` is the grid up the middle - one column per track, all the same height, the shape this board has always had. `kit` is a short ladder against a card recess, drawn `count` times, once per slot. The distinction is not decoration: a column track counts something about the FIGURE in the recess, and there is one of those; a kit track counts something about a CARD in a slot, and there are four of those. tools/build-board.mjs partitions on it and never on a track's name.",
    "ceiling": {
      "$comment": "The board's ceiling is the game's ceiling. Every number a token walks in this game has to fit between components.json board.track.from and .to, and these are all of them - tools/validate-data.mjs sweeps the lot and fails the build on anything that has grown past it. That is the whole reason the mass scale was halved: a hero carrying 28 kg could not stand on a track that stops at 14, so the kilogram got smaller rather than the board getting longer.\n\nWhat is deliberately NOT here: a vehicle's cargoCapacity, which runs to 100. Cargo is bulk in a hold, printed once on the vehicle's card as a maximum, and counted by the cargo itself sitting in the kit slots - no token stands on a column for it. A number only belongs on this list if the board has a column for it.",
      "paths": [
        "characters.characters[].health",
        "characters.characters[].strength",
        "characters.characters[].manaCapacity",
        "monsters.monsters[].health",
        "monsters.monsters[].strength",
        "monsters.monsters[].pace",
        "monsters.monsters[].manaYield",
        "vehicles.vehicles[].hull",
        "items.items[].manaCapacity",
        "items.items[].wear",
        "tools.tools[].baseWear",
        "peoples.peoples[].strength.base",
        "peoples.peoples[].manaStorage.innate"
      ],
      "$notWalked": "A monster's ARMOUR is not on this list and must not be. It is a number printed on a card and added to a total; no token stands on a column for it, exactly as a vehicle's cargo capacity has never been on this list. A number belongs here only if the board has a track for it - and after that, the sweep is merciless: a character with one more point of health fails the build rather than walking a token off the top of a board somebody has already printed."
    },
    "slots": [
      {
        "id": "figure",
        "name": "The card in play",
        "label": "IN PLAY",
        "count": 1,
        "takes": [
          "characters",
          "monsters",
          "vehicles"
        ],
        "note": "Whatever this board is being: a hero dealt or picked at setup, a monster or a stranger a discovery roll turned up, or a vehicle somebody is running. Its card is where everything particular lives - people, calling, health, strength, what it can shoulder, what its hull will take - which is exactly why the board underneath is the same for all three. The recess says IN PLAY rather than CHARACTER because it stopped being only a character's the day a wagon needed a pace track."
      },
      {
        "id": "kit",
        "name": "Kit slots",
        "label": "ITEM",
        "count": 4,
        "takes": [
          "items",
          "tools",
          "modifications",
          "quests",
          "commodities"
        ],
        "wearTrack": true,
        "note": "Whatever the thing in the recess has in play and needs to see. On a character's board that is a weapon, a lantern, a talisman, the quest they have accepted; on a vehicle's board it is the same four slots holding its cargo and the modifications bolted to it. Four, because five cards on the table is a hand and four is a kit - and because anybody who wants a fifth thing has to put something down, which is the same argument the strength limit is making. A vehicle card no longer sits here: it has a board of its own.\n\nEVERY SLOT HAS A WEAR LADDER AGAINST IT, and that is what the four slots stopped being merely a hand limit and started being an accounting: the thing in the slot has a W on its card, a pip stands on the ladder beside it, and it walks down as the thing is used. A fifth thing in play would be a fifth thing whose wear nobody is counting. Tools joined the list of what a slot takes on the same day, because a tool is now the same kind of object as a sword - something you own, carry and use up."
      }
    ],
    "panel": {
      "$comment": "The turn reference the bill of materials has always asked a player board for. It prints the round's phases in order, straight out of rules.json - so the board cannot fall out of step with the rules the way a hand-lettered one would. Under it, the one line of combat arithmetic a player needs while a monster card is face up in front of them.",
      "id": "the-round",
      "title": "THE ROUND",
      "source": "rules.round.phases",
      "foot": "Turn order passes to the left.",
      "aside": {
        "title": "IN A FIGHT",
        "source": "rules.conflict.battle",
        "note": "Printed from the rule rather than restated, so the board and the rulebook cannot drift."
      }
    }
  },
  "marketboard": {
    "$comment": "The market board: two sheets that say HOW A PRICE MOVES and WHAT KIND OF THING IS MOVING. Neither of them records a price, and that is the change.\n\nThe old board was a price tracker. Six identical lines, each with a tally of what the board was holding, a memory strip from -3 to +3, and a six-cell price ladder walked by the commodity's own token - and the whole apparatus existed because the three market models needed somewhere to remember things. They do not remember anything any more. A perishable's rule happens in a player's hands at the end of the round; a finite resource's number is read off its own depletion grid; a sought good's number is the move it made last round, which is written on the ledger anyway. Nothing was left for six lines to hold.\n\nSo the price went to the LEDGER (data/ledger.json), where a price belongs - written down, in figures, struck through when it changes, which is what people have done with prices since people have had prices. And the board became the thing a board is actually good at: one sheet, in front of everybody, saying what the rules are.\n\nSHEET ONE, THE MARKET BOARD. The roll across the top - the six dice, the volatility strip, the swing ruler - and under it four panels, one per kind of good, each headed by the mark that is engraved on that good's own token. A player who has picked up a commodity token and does not know what the fish skeleton in its corner means looks at this sheet and finds out.\n\nSHEET TWO, THE DEPLETION SHEET. A grid of numbered cells for every finite commodity in play, covered a cell at a time as the stuff is burnt, never uncovered. It is the one board in the game that only goes one way, and it is on its own sheet because it is the one board that is CONSUMED - a game leaves it covered in pips that are out of the box for good.\n\nThis file is content: what each sheet is for, what its panels say, what a grid means. How they are DRAWN - sheet, margin, how tall a panel is cut, how wide a grid cell gets - is declared once in data/components.json under `marketBoard` and `depletionBoard`, the same division as everywhere else. The DICE and the FOUR MODELS are data/pricing.json and the BANDS are rules.json market.priceBands, all read at build time, because a board that restated them is a board that could disagree with the game.",
    "version": "0.3.0",
    "board": {
      "id": "market-board",
      "name": "Market Board",
      "sheet": "A4 landscape",
      "summary": "One sheet, and it holds no state at all. The roll across the head - what each die is and what it does - and four panels under it, one for each kind of good there is.",
      "note": "The same sawn workbench as the player board (docs/art/06-components.md). It carries no border, for the same reason the player board carries none: the paper a border takes is a paragraph.",
      "generic": "Nothing on this board names a commodity, a town or a player, and now nothing on it is a place to put a piece either. It is a rule, printed. One sheet serves any table and any number of them.",
      "howMany": "One per table. It was one per town, because it held every one of that town's prices; a sheet that holds no prices is a sheet everybody can read at once.",
      "dice": "Rolled on the table beside the board. The sheet carries what the dice MEAN and does not pretend to be a tray it has no room to be."
    },
    "roll": {
      "$comment": "The head of the sheet: the whole round, in the order it happens. Roll six dice, read three strips, and the price has moved. It is one line of addition and the board is where you check that you have it the right way round.",
      "title": "THE ROLL",
      "formula": "Demand − Supply + Volatility + what the good is",
      "$formulaNote": "Printed from pricing.json formula.net rather than restated, so the sheet and the rulebook cannot drift.",
      "dice": {
        "title": "THE DICE",
        "source": "pricing.dice",
        "note": "Blue is what you want. Red is what stands in your way. It is the same subtraction in a fight, with the same two colours (rules.json conflict.battle), which is the one thing on this sheet that is not about markets at all and is here because it is the reason the colours are what they are."
      },
      "volatility": {
        "title": "VOLATILITY — THE GREEN DIE",
        "source": "pricing.volatility",
        "note": "How rough the season is. Three cells, two faces each, and it ADDS - minus two, nothing, plus two. It used to multiply, and a multiplier in the middle of an addition is the one place a table gets a sum wrong."
      },
      "ruler": {
        "title": "THE SWING",
        "source": "pricing.ruler",
        "note": "Find the net in a cell; the cell says how many places the price steps along the commodity's own printed row of six. This strip is the reason this sheet is worth printing rather than looking up."
      }
    },
    "kinds": {
      "$comment": "The body of the sheet, and its whole subject: four panels, one per model in pricing.json, each headed by the mark engraved in the corner of that model's commodity tokens. Four, and there were three - STAPLE is the new one, and it is not a new rule but the absence of one, given a face and a panel. More than half the commodities in the game run under it - thirty-four of sixty-six.\n\nThe panels are drawn from the models themselves - name, line, history, and whichever of the model's own strips it needs - so adding a fifth kind of good would be an entry in pricing.json and a narrower panel, and not one line of layout.",
      "title": "FOUR KINDS OF GOODS",
      "source": "pricing.models",
      "shows": [
        "mark",
        "name",
        "line",
        "what it adds to the swing",
        "what else it does to you"
      ],
      "extras": {
        "$comment": "The one strip or grid each panel needs beyond its own prose. A staple needs nothing, which is the point of it.",
        "staple": null,
        "perish": "pricing.spoil - the spoil strip, two columns and three rows: how many units go at the end of the round, for a good that keeps well and for one that does not.",
        "deplete": "pricing.depletion - one grid, drawn at the size the depletion sheet draws them, as the example. The real ones are on the other sheet.",
        "hype": "pricing.sought - the range, and the sentence that says it is the PREVIOUS move and not this one."
      },
      "worked": {
        "$comment": "One example per panel, done out in full, and the reason the panels are the size they are. A rule stated is a rule half the table will read the wrong way round the first time; a rule WORKED is one nobody argues about. Every one of them is the same four lines - roll, add, read, step - so the shape of the sum is learned once and then only the middle line differs.\n\nThey are content and they live here, because a worked example names a commodity and a number, and tools/build-market.mjs is not allowed to know either.",
        "staple": [
          "Stone. Blue 4 and 3, red 6 and 2.",
          "Demand 7 - supply 8 = −1. Green rolls 5: rough, +2.",
          "Net +1. Nothing to add: a staple adds nothing.",
          "+1 is HOLD. The price does not move, and the move box gets a dash."
        ],
        "perish": [
          "Fish. Blue 6 and 5, red 3 and 2.",
          "Demand 11 - supply 5 = +6. Green rolls 2: slack, −2.",
          "Net +4. A perishable adds nothing to the swing.",
          "+4 is FIRM: one step up. Then, at the end of the round, every fish anybody still holds faces the ochre die - and fish keeps badly, so it reads the right-hand column."
        ],
        "deplete": [
          "Coal, twelve units burnt this game.",
          "Blue 4 and 4, red 5 and 3. Demand 8 - supply 8 = 0. Green rolls 3: even, nothing.",
          "Twelve pips is four full rows, so the lowest number still visible is 4.",
          "Net +4 - FIRM, one step up, on a roll that came to nothing. That is what a worked-out seam does."
        ],
        "hype": [
          "Wine, which rose two places last round.",
          "Blue 5 and 4, red 4 and 4. Demand 9 - supply 8 = +1. Green rolls 1: slack, −2.",
          "The move box on the row above says +2. Add it.",
          "Net +1 - HOLD. The rise ran out, the box gets a dash, and next round wine adds nothing at all."
        ]
      }
    },
    "depletion": {
      "$comment": "The second sheet. One numbered grid per finite commodity in play, and a pip goes on it every time a unit of that commodity is BURNT - not traded, burnt. Read the lowest number you can still see and add it to the swing.\n\nIt is on its own sheet for a reason that is not room. This is the only board in the game that is spent: at the end of a game it is covered in pips that are out of the box for good, and it cannot be put away and got out again the way every other component can. A sheet you print fresh for each game is a different kind of object from a sheet you keep, and it should not be printed on the back of one you keep.",
      "sheet": "A4 landscape",
      "name": "Depletion Sheet",
      "summary": "A page of identical grids. Each is headed by a hexagonal seat the commodity's own token stands in - the token is the label, as it always was - and holds the ladder in pricing.json depletion: seven rows of three, nought at the top and six at the bottom.",
      "howMany": "One sheet holds more grids than the game has finite commodities, so one sheet is one game. Print a fresh one every time; the old one is a record of a game that has been played and is no use to the next.",
      "identity": "The token IS the label. A grid is not the coal grid until somebody stands the coal token in its seat, and the mark in that token's corner is the running glass, which is what says this grid belongs to it at all.",
      "reads": "The lowest number still visible. A fresh grid reads nought.",
      "fills": "Cover the lowest uncovered cell, one pip per unit consumed. Nothing is ever lifted off.",
      "notFilled": "Buying and selling. A merchant who never lights a fire can trade the same hundred tons of coal all game and this grid will not notice - which is the whole model, and it is why the trigger moved off the market board in the first place.",
      "$underThePiece": "The number is printed small enough to sit UNDER the pip that covers it, inside the pip's own diameter, so a covered cell is a cell whose number has actually gone. A number peeping out from behind the piece that is supposed to have taken it would make `the lowest one you can still see` a matter of opinion. tools/build-market.mjs checks it."
    },
    "tokens": {
      "$comment": "What stands on these two sheets. Nothing stands on the market board at all - it is a rule, printed, and there is nothing on it to move. The depletion sheet takes two pieces and neither of them ever leaves.",
      "commodity": "A hexagon, one per finite commodity in play, standing in the seat at the head of its own depletion grid for the whole game. It carries its family's mark and its pricing model's mark, and never a number.",
      "pip": "A 4.5 mm disc (components.json tokens.pip), one per unit of that commodity burnt, laid on the lowest uncovered cell. It is not recycled, it is not lifted, and running out of them is running out of seam.",
      "bar": "None. The bars went with the strips, back to the player board where the tracks are.",
      "note": "A player short of commodity tokens may stand anything in a grid's seat and remember what it is. They will not remember what it is."
    },
    "panel": {
      "$comment": "The one thing the market board has to say out loud that is not one of the four panels, printed from rules.json rather than restated here so the sheet and the rulebook cannot drift.",
      "id": "the-market",
      "title": "THE MARKET",
      "source": "rules.market",
      "lines": [
        "The price is written on the ledger. This sheet says how it moves; it never says what it is.",
        "Buying from the board costs the spread on top; selling to it takes the spread off.",
        "The board sells no more of a commodity in a round than that round's supply roll. It will buy any quantity."
      ],
      "foot": "Roll the market once per column on the ledger, every Market phase."
    }
  },
  "ledger": {
    "$comment": "The price ledger: one A4 sheet, and the only place in this game where a price lives.\n\nPrices were on a board. Six lines, each with a token standing on one of six bands, and the price was that band's multiplier times the commodity's base value - a sum somebody did in their head every time anybody asked what grain was worth. Then a memory strip beside it, and a tally beside that, and three pieces to walk per line per round. What the table could actually SEE at the end of all that was a token standing on a cell. Not a price. Not last round's price. Not whether the price had been climbing for four rounds, which is precisely the thing anybody trading would want to know.\n\nA ledger is what merchants have always used instead, and it is better at every one of those jobs. The price is written down as a number, in figures a metre away can read. Last round's is directly above it with a line through it. The whole history of a market is one column you can run your eye down.\n\nTHE FIGURES ARE HOLLOW AND YOU COLOUR THEM IN. Three seven-segment digits per cell, printed as outlines, filled with a pencil - which is a stranger idea on paper than it sounds and turns out to be the right one for three reasons. A written number is somebody's handwriting and gets argued about across a table; a filled figure is a figure. Colouring in seven bars is fast and it is EXACTLY as fast for 188 as for 8, where writing is not. And a wrong digit is corrected by filling one more segment rather than by rubbing out, which is what lets the whole sheet be worked in pencil at speed.\n\nNO BANDS ON THIS SHEET, AND NO TOKEN. Every commodity's six prices are printed as one row of six figures in the annex - grain is 3 · 4 · 5 · 6 · 8 · 10 - so a move is a STEP ALONG THAT ROW. You have last round's price written in front of you; it is one of the six; the swing ruler says how many places to step; the figure you land on is the new price. There is nothing to multiply, no band to remember and nothing to walk. That is what let the price ladder come off the market board with nothing replacing it.\n\nThis file is content: what a column is, what a row is, what the head holds and what the foot says. How the sheet is DRAWN - the paper, the margins, how tall a digit is cut, how thick a segment is - is declared once in data/components.json under `ledger`, the same division as the two boards. The ROUNDS are rules.json victory.gameLengthRounds and the MOVE RANGE is pricing.json ruler, both read at build time, because a sheet that restated them is a sheet that could disagree with the game.",
    "version": "0.1.0",
    "sheet": {
      "id": "price-ledger",
      "name": "Price Ledger",
      "sheet": "A4 portrait",
      "summary": "Commodities across the top, one column each. Rounds down the left, one row each. Every cell is three hollow seven-segment figures and a small box beside them.",
      "$portraitNote": "PORTRAIT, and the numbers chose it rather than taste. A ledger wants rows: landscape gives 273 mm of width - eleven columns nobody needs - and only about 150 mm of history. Portrait gives 239 mm of history and lands on six columns, which is a town's real traded list. A price ledger is a tall thing.",
      "note": "The same sawn workbench ground as the boards (docs/art/06-components.md), ruled rather than routed. It is the one sheet in the game that is written on, so it is the one sheet that is printed fresh for every game.",
      "generic": "No commodity is named on it. A column is not the grain column until somebody stands the grain token in the seat at its head, and it stops being the grain column when they take it off - the same doctrine the market board's lines ran under, inherited by the sheet that took the job over.",
      "howMany": "One per town whose market the table is actually trading in. Six columns is a town's real traded list; a town dealing in more than six prints a second sheet, which is what a second sheet is for."
    },
    "column": {
      "$comment": "One commodity's whole market, read top to bottom: what it is, and then what it cost, every round, for the whole game.",
      "identity": "The token IS the label. A hairline hexagonal seat at the head of the column, and the commodity's own token stands in it - carrying its family's mark and, in the corner, the mark that says which of the four kinds of good it is. So the column head says what this is AND how it behaves, and neither is printed on the sheet.",
      "seat": "A ruled blank, not a printed name. A table short of a token writes a name in it in pencil, the way the mini-map sheets rule a blank hex for the same reason: the thing that goes there changes every time the sheet is put down.",
      "reads": "Straight down. The one un-struck figure in a column is the price now; every struck one above it is what it was, in order, with the gaps where the market held.",
      "moveBox": {
        "$comment": "The small box beside each row's figures, and the only thing on this sheet that is written rather than filled. Write the number of places the price just stepped: -3 to +3, or a dash if it held.\n\nIt earns its width twice. It is the RECORD - a column of moves is the shape of a market at a glance, where a column of prices is only its level. And for a SOUGHT good it is the rule: the hype modifier is the move box on the row above, which is how a market that runs on its own reputation gets a memory without anything having to remember it (pricing.json sought).",
        "range": "pricing.ruler bins move",
        "holds": "one figure, signed, or a dash",
        "$dashNote": "A held round writes a dash rather than a nought, and rather than nothing. A dash says the roll happened and came to nothing; an empty box says somebody forgot to roll this column, and those are different problems."
      }
    },
    "row": {
      "$comment": "One round. Not one price change - one ROUND, whether the price moved or not, because a row that is only written when something happens is a row you cannot count backwards from.",
      "is": "A round of the game, numbered down the left-hand edge of the sheet from 1 to rules.json victory.gameLengthRounds.",
      "$whyRoundsNote": "The market rolls once per column per Market phase, so a price can change at most as many times as there are rounds - which makes the round count the honest number of rows, and makes the sheet impossible to run off the bottom of. It also makes `the row above` mean exactly one thing for the sought good's rule. In a free-running list a round that held would write nothing, and `the row above` would quietly mean two rounds ago.",
      "blankIsInformation": "About three rounds in ten hold (pricing.json ruler.odds), so a column has gaps in it, and the gaps are the market holding. A gap in one column where every other column has a figure is somebody who forgot to roll a line.",
      "strikeThrough": "When the price changes, rule a line through the figure in the row above and fill the new one in this row. It is the gesture the whole sheet is built around and it is the reason the figures are filled rather than written: a struck figure is still perfectly readable, where struck handwriting is a smudge."
    },
    "digits": {
      "$comment": "Three of them, hollow, per row per column. Three because the dearest thing in the game is worth 110 at base and 220 at the top band, and a fourth digit would be a column of noughts on every sheet ever printed.\n\nSeven segments each, all seven printed whether they are part of the figure or not - an unlit segment is what makes a hollow figure read as a NUMBER WAITING rather than as a shape. Drawing only the lit ones would also mean the tool knew the price, which it must not: this sheet is printed before anybody has rolled anything.",
      "count": 3,
      "range": [
        0,
        999
      ],
      "$rangeNote": "Base values run 1 to 110 and the top band is double, so 220 is the dearest price the printed game can produce. Three digits is right, with room, and the check that says so is in tools/validate-data.mjs rather than in this sentence.",
      "filled": "With a pencil. One segment at a time, and a wrong digit is corrected by filling one more segment rather than by rubbing anything out.",
      "leadingZeros": "Leave them blank. A price of 8 is a blank, a blank and an 8, not 008 - nobody has ever written 008 on a ledger."
    },
    "head": {
      "$comment": "The top of every column: the token's seat, and nothing else. There is no band strip, no starting price and no name.",
      "title": "PRICE LEDGER",
      "holds": [
        "the commodity token's hexagonal seat"
      ],
      "$nothingElseNote": "A band strip was tried here and does not fit: six cells of a 7 mm bar plus clearance is 56 mm against a 31 mm column. It was not worth widening the sheet for, because it was not worth having - the price on the ledger IS the band, read against the commodity's own printed row of six in the annex."
    },
    "foot": {
      "$comment": "One row across the bottom of the sheet: the four marks a column head can be carrying, so a player who has just stood a token in a seat can read what its corner mark means without getting up. The same four that head the market board's panels, at key size.",
      "title": "WHAT KIND OF GOOD",
      "source": "pricing.models",
      "shows": [
        "mark",
        "name",
        "line"
      ],
      "note": "The one thing this sheet says that is not a number. It is here because the sheet is what a trader has in front of them, and the mark on the token they just picked up is the question they are most likely to have."
    },
    "printing": {
      "$comment": "The one component in the game that is consumed by being used, alongside the depletion sheet - and the two are consumed differently, which is worth saying. A depletion sheet is spent because pieces are left on it; a ledger is spent because it is written on. Neither can be put away and got out again.",
      "fresh": "One per game, per town being traded in. Print a few spares; a game that runs long or a table that opens a seventh market wants another sheet and should not have to stop.",
      "pencil": "Pencil, not ink, whatever the flavour text says. The sheet is designed for a mistake to be recoverable by filling one more segment, and that only works if the fill can also be rubbed out when somebody has genuinely mis-read the ruler."
    }
  },
  "minimap": {
    "$comment": "The mini-map: one hex of the world map, opened out onto a sheet you can put figures on.\n\nSome moments need more board than a single hex - a battle, a monster encounter, a farm growing into a walled town. Those moments zoom in: play happens inside the mini-map and the result is written back to the big map.\n\nWhat a mini-map IS, now: a flat colour, a pattern and a grid. One regular hexagon filled with the plain colour the terrain already declares (terrain.json terrains[].colour), that terrain's own MAP MARK scattered across the cells, a hexagonal grid ruled on top, and two working panels in the space a hexagon on a rectangle leaves over. No render, no plate, no artist, no framing entry and no place in the mint queue. A sheet is generated, not commissioned.\n\nThe pattern is a reversal of what this file used to say, and the reasoning is worth keeping rather than quietly overwriting. It said: no pattern, because drawn ground competes with the pieces standing on it, and every one of these sheets is a sheet somebody is standing pieces on. That is half right. A DRAWN sheet competes. A grass tuft at a third of a cell, on the ink plate, at a third of full strength does not - and it does the one job the flat colour was failing at, which is saying which ground this is from across the table, and in the black-and-white edition, where there is no colour on the sheet at all. The marks are the world map's own (terrain.json terrains[].mark, drawn per components.json marks.terrain), so the ground on a mini-map is the ground on the hex it opens out and not a second opinion about it.\n\nThe cell is the decision the rest follows from: a mini-map cell is EXACTLY the size of a world-map hex, read off whichever map and print preset the table is playing on. A figure standing on the campaign board picks up and stands on a mini-map cell without being re-based; a route token cut for the world map fits a mini-map lane; one ruler measures both. The scale is a fiction - the ground inside one hex is not sixty-one hexes of ground - and it is the right fiction, because everything physical about the two boards agrees.\n\nThis file is content: what the sheets are for, what the panels hold, what the footer says. How a sheet is DRAWN - the paper, the margin, how many cells to a side, how the grid rules - is components.json minimap, the same division as the player board and the market board.",
    "version": "0.1.0",
    "board": {
      "id": "minimap",
      "name": "Mini-map",
      "sheet": "A4 landscape",
      "summary": "One world hex, opened out: a hexagonal field of 61 cells in the terrain's own colour and patterned with its own map mark, each cell the size of a world-map hex, with an encounter panel and a holdings panel either side.",
      "generic": "A sheet says nothing but its terrain. Which hex of which map it is standing in for is written in the footer in pencil when it is put down, and rubbed out when it is picked up.",
      "howMany": "One per terrain, printed once. A table needs whichever ground it is fighting or building on, which is rarely more than two sheets at a time.",
      "note": "The colour and the mark are not a placeholder for artwork that has not been drawn. They are the specification. A drawn mini-map competes with the pieces standing on it, and every one of these sheets is a sheet somebody is standing pieces on - so the ground is said in the lightest possible way that still says it: the terrain's own map mark, three to a cell, on the ink plate at a third strength, quieter than the grid ruled over it."
    },
    "hexGrid": {
      "$comment": "Kept for the record, because it is a decision that gets re-litigated every time somebody notices a square grid would be easier to draw.",
      "why": "The grid is hexagonal rather than square to give movement more, and more equal, options. A hex has six neighbours and every one of them is the same distance away; a square has four at one distance and four more at root two, so a square grid either lies about diagonals or forbids them. Six equal exits is what makes a route a choice rather than a staircase - it is why a road can bend without costing more than a road that does not, why flanking is a real position rather than an arithmetic exception, and why a party fleeing a monster has five ways out instead of three.",
      "cost": "One: a hex grid is harder to draw and harder to describe in prose. The overlay tools carry that cost once (tools/lib/hexgrid.mjs) and nothing else in the game pays it.",
      "andSo": "terrain.json keeps `tileShape: hex` and lists square as an alternative it does not use, and a mini-map's own grid is hexagonal for exactly the same reason the campaign map's is - plus one more, which is that a cell has to line up with a world hex."
    },
    "panels": [
      {
        "id": "encounter",
        "side": "left",
        "title": "ENCOUNTER",
        "note": "Out for the fight, then away. A monster or a stranger met here is dealt onto a spare player board and run like a player who is not a person (rules.json exploration.discovery.encounter); this panel is only the order they act in and how the fight is going.",
        "rows": [
          {
            "label": "Order",
            "count": 6,
            "kind": "write"
          },
          {
            "label": "Round",
            "count": 6,
            "kind": "box"
          },
          {
            "label": "Morale",
            "count": 6,
            "kind": "box"
          }
        ]
      },
      {
        "id": "holdings",
        "side": "right",
        "title": "HOLDINGS",
        "note": "In front of the player, possibly all game. What is built on this ground, who garrisons it and what is stored here.",
        "rows": [
          {
            "label": "Built",
            "count": 8,
            "kind": "write"
          },
          {
            "label": "Garrison",
            "count": 4,
            "kind": "write"
          },
          {
            "label": "Stores",
            "count": 6,
            "kind": "write"
          }
        ]
      }
    ],
    "footer": {
      "$comment": "The three things a sheet has to say about itself, and the only place a mini-map is ever specific.",
      "fields": [
        "sheet code",
        "map hex (written in when placed)",
        "terrain code"
      ],
      "note": "The terrain code is printed - it is the one thing the sheet knows about itself. The map hex is a ruled blank, because it changes every time the sheet is put down."
    }
  },
  "buildingtiles": {
    "$comment": "Building tiles: the printed pieces a player puts down when they build something.\n\nA building tile is a hex, or a small clump of hexes, cut so that ONE cell is exactly a mini-map cell - which is exactly a world-map hex, read off whichever map and print preset the table is playing on. That is the whole scale argument and it is not an approximation: a hut tile drops into a mini-map cell, a figure standing beside it is based for the same hex, and one ruler measures the campaign board, the zoom-in sheet and everything built on it. Print the map at a bigger preset and every tile in the box grows with it, because none of the three numbers was ever typed.\n\nTHESE ARE NOT THE SHELVED TILES. Issue #18 shelved a tile-based BOARD - 61 double-sided terrain hexes dealt face down, so the world is unknown until it is walked - pending the game-set split (#10). Nothing here reopens that. A terrain tile is a piece of ground that arrives instead of a map; a building tile is a piece of ARCHITECTURE that goes on ground you already have, and it is wanted whichever way the board was supplied. They share a cell size because everything in this game shares a cell size.\n\nWhat a tile IS lives here. How one is DRAWN - the cut weight, the name band, the lathe on the back, the print sheet - is data/components.json buildingTile, the same division as the player board, the market board and the mini-map. What each individual tile SAYS is on the thing it is of: a building in data/buildings.json, a crop in data/recipes.json. This file names no building and no crop.",
    "version": "0.1.0",
    "$structure": {
      "$comment": "The small type system this file uses, so the next tool that reads it does not have to guess.",
      "axial": "[q, r] - a cell's position in a footprint, in axial hex coordinates on a pointy-top grid. [0, 0] is the anchor cell, the one a player is told to place; everything else is an offset from it.",
      "band": "a rung of the ladder. `under` is its exclusive top; its floor is the previous rung's `under`, and the first rung's floor is 0. The last rung has `under: null` and no ceiling, so the ladder can never have a hole in it or run out."
    },
    "cell": {
      "$comment": "The load-bearing decision, and it is a reference rather than a number.\n\nA tile cell is a mini-map cell is a world-map hex. data/minimap.json already made that promise for the zoom-in sheets and tools/build-minimaps.mjs already reads it off the map's own default print preset; this reads the same field from the same place, so the three cannot drift. A tile that carried its own millimetre figure would be a tile that fits the sheet it was designed against and no other.",
      "from": "maps.<id>.print.presets[default].hexAcrossFlatsMm",
      "sharedWith": "data/minimap.json cellFrom - deliberately the same expression, and tools/lib/tiles.mjs and tools/build-minimaps.mjs both resolve it the same way",
      "orientation": "pointy",
      "$orientationNote": "Pointy-top, like the world map's grid and the mini-map's. A tile turned any of six ways still seats in a cell, and a lane of tiles runs the way a lane of cells runs."
    },
    "ground": {
      "$comment": "How many cells a building takes, worked out from the building's own numbers rather than typed on it. This is the answer to \"the scale should make sense\": scale is a system, like a price, not a judgement made forty times.\n\nTHREE things take room, and for a long time this model counted two of them.\n\nThe FABRIC is how much building there is to raise, and buildPoints is the only figure that separates a steelworks from a shrine. What the building HOLDS is the second: a pasture is six animals behind a fence and costs almost nothing to put up, a warehouse is mostly air, and neither is described by its fabric at all.\n\nThe third is the YARD, and leaving it out is what made a third of the set the wrong size. A tannery is pits, bark stacks and drying racks and eleven build points; a weaver is a room with looms in it and twelve. A quarry is a hole the size of the stone taken out of it; a trading house is a counting room and a strong box, and cost more to build than either. Fabric and holdings say those pairs are the same size. They are not, and what separates them is not on any number a building carries - it is what the TRADE needs in the open, which is a fact about the trade. So it is named, from a closed vocabulary of three, the way a commodity names its pricing model in data/pricing.json: `yards` below says what the three are and what each costs, and each building says which one it needs. Nothing writes a footprint, and the ladder still does the deciding.\n\nA term's weight says how much of a cell one unit of it asks for. They are small on purpose - the ladder does the deciding, and a model tuned so finely that one worker slot moves a building up a rung is a model that will move it back next time somebody balances a recipe.",
      "terms": [
        {
          "field": "buildPoints",
          "weight": 0.08,
          "why": "The fabric. One cell of building per twelve or thirteen points of effort - the hut is four points and the manor thirty, which is the whole range and it lands where a hut and a manor should.\n\nLighter than it was, and deliberately. Effort is not area: brick costs more to lay than timber on the same plot, a tower is dear because it is tall, and a shed is cheap by the acre. Leaned on hard enough, buildPoints made a fine building on a small plot come out bigger than a rough one on a large plot - a twenty-point trading house wider than a ten-point sawmill - which is precisely backwards. It still carries the fabric; the yard now carries what the fabric never knew."
        },
        {
          "field": "housing",
          "weight": 0.5,
          "why": "A worker sleeping here needs a roof over a piece of ground. Half a cell each, so four workers is two cells of house."
        },
        {
          "field": "specialistHousing",
          "weight": 0.5,
          "why": "The same room, occupied by somebody who charges more for it."
        },
        {
          "field": "workerSlots",
          "weight": 0.1,
          "why": "Somebody working here needs a bench and room to swing, which is a good deal less than a bed. Deliberately the lightest term: nearly every building in the game has two to four, so a heavier weight would flatten the whole ladder to one rung. Lighter still now that the yard is counted - where those hands actually spread out to is the yard, and charging for it twice made every four-worker shop the size of a farm."
        },
        {
          "field": "storage",
          "weight": 0.15,
          "why": "A slot of stock on the floor. Twelve of them is a warehouse and it is most of why a warehouse is bigger than the shop next door."
        },
        {
          "field": "livestockSlots",
          "weight": 0.5,
          "why": "An animal needs grazing, not a shelf. As much ground as a person sleeping, and it is what makes a pasture the largest thing a first-round player can put down."
        },
        {
          "field": "garrison",
          "weight": 0.4,
          "why": "A soldier held at a barracks: a bunk and a yard to drill in, a little less than a household."
        }
      ],
      "yards": {
        "$comment": "What the trade needs in the OPEN - the third thing that takes room, and the only one a building cannot work out from a number it already carries.\n\nThree of them, and there will only ever be three, for the reason there are only ever three pricing models: a vocabulary a person has to choose from forty times is only useful if the choice is obvious every time, and the moment there is a fourth it stops being. Four was tried. The top two came out 0.2 of a cell apart, which is a distinction doing knife-edge work and nothing else, so they were merged and the buildings' own fabric and hands were left to separate a tannery from a quarry - which they do.\n\nA building names one. It is not a footprint and it is not a size: it is a fact about the trade, the same kind of fact as `glut` or `deplete`, and the ladder still decides what it adds up to. A shrine and a manor are both `walls`; one is a cell and the other is four.",
        "models": [
          {
            "id": "walls",
            "weight": 0,
            "reads": "Nothing stands outside. The walls are the whole of it - a counter, a bench, a bed, a shaft head, a well.",
            "examples": "a weaver, a butcher, a trading house, a house, a watchtower"
          },
          {
            "id": "yard",
            "weight": 1,
            "reads": "One working yard beside the building: a cart to unload, a stack to season, a bit of ground to turn something over on.",
            "examples": "a smithy, a granary, a mill, an inn, a farm steading"
          },
          {
            "id": "works",
            "weight": 2,
            "reads": "The ground itself is the works: pits and racks, a face cut into it, a plantation standing on it, a run of fence around it. The building is a piece of something larger.",
            "examples": "a tannery, a sawmill, a quarry, an orchard, a harbour"
          }
        ]
      },
      "excluded": [
        {
          "field": "fieldSlots",
          "why": "A field is its own tile, laid beside the farm - see `fields` below. Counting it here as well would print the same ground twice, once inside the steading and once outside it."
        },
        {
          "field": "cost",
          "why": "What a building is made OF says nothing about how much room it takes. A palisade is six logs and a thin line; a well is three stone and a hole."
        },
        {
          "field": "tier",
          "why": "Tier is how far up the tech tree a thing sits. A trading house is tier 3 and fits in a shopfront."
        },
        {
          "field": "victoryPoints",
          "why": "Scoring is not architecture."
        }
      ]
    },
    "ladder": {
      "$comment": "Ground demand, banded into a number of cells and a shape. Same shape as the price bands in data/rules.json: contiguous, exclusive-top, and checked by tools/validate-data.mjs so it can never grow a hole or an overlap.\n\nFour rungs is the whole ladder on purpose. A fifth would need a fifth polyhex shape, another die-cut and another row of the print sheet, and the thing it would buy - telling a steelworks from a manor by size - is already told by the picture on the face.\n\nThe rungs moved when the yard was added, because a model that counts a third thing lands everything higher and the old edges would have shunted half the set up a shape. They are set where they are by working backwards from what these buildings ARE: a shopfront on the first rung, a building and its yard on the second, a works on the third, an estate on the fourth.",
      "bands": [
        {
          "cells": 1,
          "under": 1.5,
          "shape": "single",
          "reads": "a single building with nothing outside it: a hut, a shop on a corner, a well, a tower"
        },
        {
          "cells": 2,
          "under": 3,
          "shape": "pair",
          "reads": "a building and its yard: a farm steading, a smithy with its stack, a market square, a cottage and its plot"
        },
        {
          "cells": 3,
          "under": 4.25,
          "shape": "triad",
          "reads": "a works: a granary, a tannery's pits and racks, a quarry face, an orchard, a harbour with its arm out into the water"
        },
        {
          "cells": 4,
          "under": null,
          "shape": "rhombus",
          "reads": "an estate: the manor and its grounds, a pasture and the whole run of fence round it, a steelworks and its stockyard"
        }
      ]
    },
    "shapes": {
      "$comment": "The polyhexes a tile may be cut as - one per rung of the ladder, and no choice about which. A size class with two shapes in it is a size class where somebody has to decide, forty times, with nothing to decide it on; and two shapes of the same area are two die-cuts to pay for and two ways for a tile to fail to fit a gap on the board.\n\nCells are axial [q, r] offsets from the anchor cell, which is always [0, 0] and is always the cell a player is told to place. Every shape is edge-connected - a tile that fell into two pieces is two tiles - and tools/validate-data.mjs proves it rather than trusting it.",
      "single": {
        "cells": [
          [
            0,
            0
          ]
        ],
        "note": "One hex. The anchor and the whole tile."
      },
      "pair": {
        "cells": [
          [
            0,
            0
          ],
          [
            1,
            0
          ]
        ],
        "note": "Two along the row. The anchor is the left-hand cell."
      },
      "triad": {
        "cells": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            1
          ]
        ],
        "note": "Three mutually adjacent - the tightest three cells a hex grid has, and the only three that all touch each other. The anchor is the upper-left cell."
      },
      "rhombus": {
        "cells": [
          [
            0,
            0
          ],
          [
            1,
            0
          ],
          [
            0,
            1
          ],
          [
            1,
            1
          ]
        ],
        "note": "Two rows of two, the lower row stepped half a cell right. Compact, and it seats against a straight run of other tiles on two sides. The anchor is the upper-left cell."
      }
    },
    "fields": {
      "$comment": "The crop tiles, and the reason a farm's footprint does not include its fields.\n\nA farm today is `fieldSlots: 4` and a growth track: you sow a crop into a slot and it matures over rounds (data/recipes.json, the sow-* recipes). Printed as one big farm tile with four recesses in it, a farm is exactly the same size in the round it is raised and in the round it is feeding a town, and no crop ever gets a picture. Laid as separate one-cell tiles beside the steading, the farm grows on the board as it is sown, a fallow farm looks fallow, and each crop is a subject of its own with its own plate.\n\nA field tile is minted exactly like a building tile - same brief file, same plate directory, same framing entry, same four steps. It is not a different kind of thing, only a different place its subject is read from.",
      "from": "recipes.json recipes[] carrying a cropStage",
      "cells": 1,
      "shape": "single",
      "placedBeside": "farm",
      "capFrom": "buildings.json farm.fieldSlots",
      "$capNote": "How many field tiles one farm may have out is the farm's own fieldSlots and is not restated here. Change the farm and the rule changes with it.",
      "adjacency": "A field tile must touch the farm's footprint, or another of that farm's field tiles - so a farm's fields are one run of ground rather than four squares scattered across the sheet."
    },
    "sides": {
      "$comment": "A tile is double-sided and ONE PLATE IS DRAWN. The face is the building finished; the back is that same plate with the colour run not laid on - black line on bare paper - and its name band drawn hollow instead of solid. So a tile is ONE commission, not two, and data/mint.json carries one subject for it.\n\nThe back was DRAWN once, as a second commission: the same building part-raised, its frame open, its material stacked around it. It is not any more, and the reason is the rule it kept breaking. The two sides have to turn over onto each other - same viewpoint, same distance, the building in the same place on the page - so that a player flipping the tile sees the picture settle rather than jump. Two separately drawn plates have to be argued into that agreement every time and drift out of it for free; one plate printed two ways cannot drift, because it is one plate. The rule is now kept by construction rather than by vigilance, which is the same turn tools/draw-item.mjs and tools/draw-map.mjs already took one storey up: the picture is an output, not a second hand-made thing.\n\nWhat is spent for it is the staged material - the squared-up timber, the sawhorse, the tool set down - which was this deck's signature for a site and said PAUSED rather than RUINED, because nobody stacks material at a ruin. The colour-dropped face says NOT YET instead. That is a thinner statement and it was chosen knowingly, for half the plates, half the aiming and a rule that cannot come apart.\n\nA building takes rounds to raise (buildPoints, minRounds), so the tile goes down back-up the round work starts and is turned over when the effort is paid. A field is not built but sown, and does not become a field of grain until it has stood there for its maturation rounds - same flip, same moment.",
      "face": {
        "carries": [
          "the plate, cropped to the footprint and clipped to the cut line",
          "the building's or the crop's name, in a band hugging one edge"
        ],
        "carriesNot": "a number of any kind. No worker pips, no storage boxes, no build points. Everything that moves is counted on a board - the mini-map's own HOLDINGS panel has Built, Garrison and Stores rows for exactly this - and a tile that carried a count would be a tile that has to be reprinted when a recipe is balanced.",
        "$bandNote": "The band hugs the LOWER-LEFT edge and the type runs parallel to it - the same corner on every tile in the set. It used to be a strip ruled corner to corner across the widest row, which was the longest band a hexagon can carry and cut the picture in half; tucked against an edge, the picture is whole.\n\nThe corner is chosen and it is the artist's business, not only the tool's: every plate here is drawn from thirty degrees above and thirty to the left, which puts the lit face and the working end of a building on the right and leaves the bottom-left as foreground ground. That is the corner a label can have, and the brief tells the artist to keep the important detail out of it - not to leave it empty, just to put nothing there the piece needs. How the band is drawn is data/components.json buildingTile.nameBand."
      },
      "back": {
        "derivedFrom": "face",
        "carries": [
          "the face's own plate, with the colour run not laid on: black line on bare paper",
          "the tile's own name, in the same band in the same place as the face's, drawn hollow"
        ],
        "$whyNotDrawn": "A back is not a commission. It is the face plate printed short - the key block pulled before the colour blocks are laid on, which is what an unfinished letterpress print literally is, and so it is the deck's own idiom rather than a filter borrowed from somewhere else. How the colour is dropped is data/components.json buildingTile.back.",
        "$sameNameBothSides": "Both sides carry the SAME name. The back said SITE (or SOWN) once and that word was taken out because the picture already told a player what it meant - a frame with no roof on it - while withholding the one thing it did not, which is which tile this is.\n\nThat argument was conditional on the back being a DRAWN unbuilt picture, and it does not survive this change: a colour-dropped finished building does not say unbuilt on its own. So the load moved to the band rather than back onto a word. The band is drawn HOLLOW on the back - the same name, in the same corner, at the same angle, outlined instead of filled. One glance says which side is up; it costs no picture area, adds no second text element to a 17 mm hex, and the piece is still findable by name either way up.",
        "states": [
          {
            "for": "buildings",
            "state": "site",
            "why": "Pegged out and not yet raised: what the ground is the round the work starts."
          },
          {
            "for": "fields",
            "state": "sown",
            "why": "A field is not built, it is planted, and it is not a field of grain until it has stood there for its maturation rounds. Same flip, same moment, a truer word for it."
          }
        ],
        "$stateIsProseNow": "The state named a plate once - tile-hut-site, tile-crop-grain-sown - and there is no second plate to name. It is kept because it is still the true word for what that side of the piece MEANS, and tools/build-tiles.mjs writes it into the side's <desc> so the artefact says what it is. It is printed on nothing."
      }
    },
    "subjects": {
      "$comment": "Which buildings get a tile at all, said as a rule rather than as a list, so the day somebody adds a building the answer is already decided.",
      "rule": "Every building in data/buildings.json that stands ON ground, plus one field tile per sown crop.",
      "excludes": [
        {
          "test": "perTile",
          "why": "Road, rail and bridge are laid ALONG a route rather than placed on a cell, and they are already a piece: data/components.json tokens.route is a bar the length of the line between two hex centres, so a run of them reads as a road instead of as a row of counters. Cutting them a second time as hexes would put two different pieces in the box for one thing."
        }
      ]
    },
    "howMany": {
      "$comment": "What a table actually needs, which is not one of each.",
      "note": "Buildings are built more than once and by more than one player, so a tile is a supply piece rather than a card. The bill of materials is in docs/design/08-components.md; the print sheet in docs/tiles/ prints one kind at a time and asks how many, exactly as the mini-map print page does.",
      "guide": "Three or four of the cheap tier-1 tiles per player, one or two of everything above tier 2, and one of anything marked unique."
    }
  },
  "graph": {
    "$comment": "The dependency graph: which collections are THINGS in the web of the game, as opposed to vocabularies that classify their own file. This file declares the NODES only. The arrows are never declared anywhere - docs/js/graph.js computes them from manifest.json references.checks, the same declarations tools/validate-data.mjs enforces, so the graph cannot drift from what the validator guarantees and redraws itself the moment the data moves. A node's id is the collection spec exactly as the checks name it: a dataset key, or dataset.subcollection for a collection that lives inside another file. 'name' is the legend label, singular, because it captions one dot. 'wash' is one of the five chromatic inks in docs/art/palette.json - the graph has no colours of its own - and kinds sharing an ink are a family on purpose: the land is verdigris, goods and folk are ochre, work and danger are oxide, structure and movement are slate, the arcane and the adventure are bruise. Within a family, docs/js/graph.js steps the ink toward soot or paper by declaration order, so the order of this list is meaningful. Drawn by the explorer's Graph tab live from the bundle, and by tools/build-graph.mjs into docs/art/graph/dependencies.svg for the printed rulebook.",
    "version": "0.1.0",
    "nodes": [
      {
        "id": "terrain",
        "name": "Terrain",
        "wash": "verdigris"
      },
      {
        "id": "deposits",
        "name": "Deposit",
        "wash": "verdigris"
      },
      {
        "id": "commodities",
        "name": "Commodity",
        "wash": "ochre"
      },
      {
        "id": "pricing",
        "name": "Price model",
        "wash": "ochre"
      },
      {
        "id": "peoples",
        "name": "People",
        "wash": "ochre"
      },
      {
        "id": "peoples.professions",
        "name": "Profession",
        "wash": "ochre"
      },
      {
        "id": "recipes",
        "name": "Job",
        "wash": "oxide"
      },
      {
        "id": "tools",
        "name": "Tool",
        "wash": "oxide"
      },
      {
        "id": "items",
        "name": "Equipment",
        "wash": "oxide"
      },
      {
        "id": "monsters",
        "name": "Monster",
        "wash": "oxide"
      },
      {
        "id": "buildings",
        "name": "Building",
        "wash": "slate"
      },
      {
        "id": "transport",
        "name": "Transport mode",
        "wash": "slate"
      },
      {
        "id": "transport.figures",
        "name": "Board figure",
        "wash": "slate"
      },
      {
        "id": "vehicles",
        "name": "Vehicle",
        "wash": "slate"
      },
      {
        "id": "arcana.elements",
        "name": "Element",
        "wash": "bruise"
      },
      {
        "id": "modifications",
        "name": "Modification",
        "wash": "bruise"
      },
      {
        "id": "quests",
        "name": "Quest",
        "wash": "bruise"
      },
      {
        "id": "characters",
        "name": "Character",
        "wash": "bruise"
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
            "share": 0.12
          },
          {
            "terrain": "desert",
            "share": 0.11
          },
          {
            "terrain": "tundra",
            "share": 0.1
          },
          {
            "terrain": "mountain",
            "share": 0.09
          },
          {
            "terrain": "forest",
            "share": 0.08
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
        "$terrainBudgetNote": "Shares of the whole grid, water included, as built. Coast is not among them any more and neither is river or lake: the coast terrain was retired (terrain.json siting.waterside) and its 67 hexes went back to the ground they were a shore of, and this plate draws no inland water for a river or a lake hex to describe. A later plate that draws one gets the hexes; this one does not get them invented. A budget is an aim for the artist and a sanity check afterwards, never a rule: a drawn continent is not a shuffled tile bag. tools/validate-map.mjs reports the finished board against boardSetup.terrainMix in data/terrain.json for the same reason - a map with a quarter of the hills the rules assume is a map where iron is scarce, and that is worth knowing before anyone plays on it. This map is one of those: 0.8% hills against the 8% the rules assume.",
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
        "kind": "drawn",
        "$kindNote": "A painted plate that `rows` was TRACED off, which is the original map line and is paused rather than retired. It is committed as supplied and never re-encoded by any tool here. The other kind is \"generated\" — grown from a commission and drawn by tools/draw-map.mjs, where the board is the source and the picture is the output. One field decides which, and everything else about a map file is the same.",
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
        "r": "river",
        "l": "lake",
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
        "~~~---~--~~---tt--~~~~-tttttttt-",
        "~~-^t--t---tttttt---~-tttttttttt",
        "~~-^^^tttttttttttt..-~-ttttttttt",
        "~~--^t^tttttttttt...---tfttttt^^",
        "~~~~---tttttttttt.....--f.ttt.^^",
        "~~~~~-fftt^^ttt..........hhhh^^-",
        "~~~~~~-fff^^^^^t..........hhh^^-",
        "~~~~~-fffff^^^^...........-hhf-~",
        "~~~~~-ffffffff^^^t..........h--~",
        "~~~~-ffffffffff^^^^^........^--~",
        "~~~~-f....fffffff..^^^^....^^^h-",
        "~~~-fff...fffffff...^^^....^^^^-",
        "~~~~-fffffffffffff.....^^^^^^...",
        "~~~~----------ff..m....^^^^^^..f",
        "--~~~~~~--~~~-ffmmmmmmddddd^^^..",
        ".----~~~~~~~~-fmmmmmddddddd^^^.-",
        "---f-~~~~~~~~-mmmmmmmddd-dd^^^--",
        "~~---~~~~~~~-dddddm---ddddd^--~~",
        "~~~~~~~~~~~~-ddddddddddddddd--~~",
        "~~~~~~~~~~~-ddddddddddddddd--~~~",
        "~~~~~~~~~~~-ddddddddddddddd-~~~~",
        "~~~~~~~~~~~--ddddddddddddd--~~~~",
        "~~~~~---~~-----------dd----~~~~~",
        "~~~~~-.-~~-.-~~~~~~~----~~~~~~~~"
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
          "terrain": "grassland",
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
      "$comment": "A GENERATED board. The `commission` below is still the input contract and is still the only thing anybody writes by hand — what the map is for, what country it is, what the terrain budget is, how many settlements of what rank, where the anchors are and what every place is called. Everything after it is grown from that by `node tools/draw-map.mjs sundering-isles`, which also draws the plate: `rows`, `settlements`, `regions`, `routes` and the `plate` block are OUTPUTS. Do not hand-edit them — change the commission and run the tool.\n\nThis is the opposite way round from the Korvane Reach, which is a DRAWN plate that `rows` was traced off. Both are supported and the difference is one field, plate.kind. docs/MINT.md is the pipeline; docs/map/README.md is the drawn kind, which is paused rather than retired.",
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
            "terrain": "lake",
            "share": 0.02
          },
          {
            "terrain": "grassland",
            "share": 0.19
          },
          {
            "terrain": "forest",
            "share": 0.12
          },
          {
            "terrain": "hills",
            "share": 0.07
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
        "$terrainBudgetNote": "Shares of the whole grid, water included. Half the board is water on purpose and the land is nearly all within one hex of it, which is what makes this board play differently from the Reach — every island is waterside, so a dock will go almost anywhere and the question is only whether the sea beside it is worth a harbour (terrain.json siting.waterside). The share coast used to hold went back to the grassland and the forest it was a beach in front of. One lake, on the largest island, so the board has one hex of fresh water somewhere. Tundra is deliberately absent: this is a warm sea. It keeps a character in the legend anyway, because a legend that covers all eleven terrains costs nothing and a board that later grows a cold rock should not need a legend edit to say so.",
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
          "one volcanic peak on the largest island — the only mountain worth the name, with a crater lake in it: the board's only fresh water",
          "a shelf running off the north edge, so the board reads as being south of somewhere"
        ],
        "mustNotHave": [
          "a hex grid, a square grid, or any ruled lines over the field",
          "hillshading, relief shading, contour lines or depth soundings",
          "map furniture over land or over the reef — cartouche, legend and compass sit over open water",
          "display lettering over any island — the big names go on the sea, where a mis-read costs nothing",
          "a second colour of ochre: the desert wash and the marsh wash must not be the same, which is the mistake the Reach's plate made"
        ],
        "landform": {
          "$comment": "The prose above says what this country IS; this says where it is, and it is the only positional thing anybody types. tools/draw-map.mjs grows the board from these anchors - it is the same division as everywhere else in this repository: a person decides that there are three chains running north-east to south-west and that the volcano is on the largest island, and the tool works out which 331 hexes that comes to. If you find yourself typing a hex that is not an anchor, it belongs in the generator instead.",
          "seed": 20260823,
          "$seedNote": "The growth is random but not arbitrary. Same seed, same board, every run - which is what lets docs/map/ be a committed build output and --check mean anything.",
          "shareIsRelative": true,
          "$shareNote": "An island's `share` is a WEIGHT, not a fraction of the grid. The tool normalises the set of them to the land total the terrainBudget already asks for, so adding an island does not silently make the board more land - it makes every other island slightly smaller, which is the honest reading of a fixed country.",
          "islands": [
            {
              "id": "vharsel",
              "name": "Vharsel",
              "chain": "north",
              "at": [
                20,
                5
              ],
              "share": 0.16,
              "relief": "volcanic"
            },
            {
              "id": "kelnholm",
              "name": "Kelnholm",
              "chain": "north",
              "at": [
                26,
                2
              ],
              "share": 0.03
            },
            {
              "id": "orrin",
              "name": "Orrin",
              "chain": "north",
              "at": [
                15,
                8
              ],
              "share": 0.04
            },
            {
              "id": "thass",
              "name": "Thass",
              "chain": "reef",
              "at": [
                26,
                10
              ],
              "share": 0.035
            },
            {
              "id": "marrowcay",
              "name": "Marrowcay",
              "chain": "reef",
              "at": [
                22,
                13
              ],
              "share": 0.03
            },
            {
              "id": "saltrow",
              "name": "Saltrow",
              "chain": "reef",
              "at": [
                18,
                15
              ],
              "share": 0.035
            },
            {
              "id": "drownstep",
              "name": "Drownstep",
              "chain": "reef",
              "at": [
                14,
                18
              ],
              "share": 0.025
            },
            {
              "id": "vellhome",
              "name": "Vellhome",
              "chain": "south",
              "at": [
                9,
                15
              ],
              "share": 0.035
            },
            {
              "id": "brackmoor",
              "name": "Brackmoor",
              "chain": "south",
              "at": [
                6,
                19
              ],
              "share": 0.03
            },
            {
              "id": "tidewrack",
              "name": "Tidewrack",
              "chain": "south",
              "at": [
                2,
                22
              ],
              "share": 0.02
            }
          ],
          "$islandNote": "Three chains running north-east to south-west, as the landmass paragraph asks. `relief: volcanic` is what puts the one mountain worth the name on the largest island, and the crater lake in it - the board's only fresh water.",
          "links": [
            {
              "from": "thass",
              "to": "marrowcay",
              "as": "shallow-water"
            },
            {
              "from": "marrowcay",
              "to": "saltrow",
              "as": "shallow-water"
            },
            {
              "from": "saltrow",
              "to": "drownstep",
              "as": "shallow-water"
            }
          ],
          "$linkNote": "The drowned road. A reef is water that a hull can cross and a keel cannot ignore, so it is drawn as shallows chaining the middle group together - the thing the subtitle is named for.",
          "edges": {
            "north": "shelf",
            "south": "deep",
            "east": "deep",
            "west": "deep"
          },
          "$edgeNote": "A shelf edge is shallow running off the frame, so the board reads as being south of somewhere. A deep edge is open sea. Deep water never touches land on any board - tools/validate-map.mjs enforces it - so the tool keeps a shallow margin round every coast whatever the edges say.",
          "shelfWidth": 1,
          "$shelfWidthNote": "How many hexes of shallow water wrap a coastline before the deep starts. One is the honest minimum: it is what the no-deep-water-against-a-beach rule actually requires, and on a board of ten scattered islands a two-hex halo round every one of them turns the whole sea shallow — the deep water the budget asks for has nowhere left to be."
        },
        "places": [
          {
            "id": "vharsel",
            "name": "Vharsel",
            "rank": "seat",
            "harbour": true,
            "island": "vharsel",
            "note": "Seat of the isles, under the volcano, on the one deep-water road in."
          },
          {
            "id": "thass-gate",
            "name": "Thass Gate",
            "rank": "city",
            "harbour": true,
            "island": "thass",
            "note": "Where the freight changes hulls: nothing crosses the reef without stopping here."
          },
          {
            "id": "kelnholm",
            "name": "Kelnholm",
            "rank": "town",
            "harbour": true,
            "island": "kelnholm",
            "note": "The northern landfall, first light off the shelf."
          },
          {
            "id": "orrinmouth",
            "name": "Orrinmouth",
            "rank": "town",
            "harbour": true,
            "island": "orrin",
            "note": "A wide anchorage and not much behind it."
          },
          {
            "id": "marrowcay",
            "name": "Marrowcay",
            "rank": "town",
            "harbour": true,
            "island": "marrowcay",
            "note": "Built on the reef itself, half of it on piles."
          },
          {
            "id": "saltrow",
            "name": "Saltrow",
            "rank": "town",
            "harbour": true,
            "island": "saltrow",
            "note": "Salt pans and a long quay."
          },
          {
            "id": "vellhome",
            "name": "Vellhome",
            "rank": "town",
            "harbour": true,
            "island": "vellhome",
            "note": "The southern chain's only real market."
          },
          {
            "id": "cinderfoot",
            "name": "Cinderfoot",
            "rank": "village",
            "harbour": false,
            "island": "vharsel",
            "note": "Inland, on the ash. Pays someone else's freight and resents it."
          },
          {
            "id": "ashford",
            "name": "Ashford",
            "rank": "village",
            "harbour": false,
            "island": "vharsel",
            "note": "The crater track's last water before the climb."
          },
          {
            "id": "longstrand",
            "name": "Longstrand",
            "rank": "village",
            "harbour": true,
            "island": "vharsel",
            "note": "A beach, a jetty and forty boats."
          },
          {
            "id": "coldkeel",
            "name": "Coldkeel",
            "rank": "village",
            "harbour": true,
            "island": "saltrow",
            "note": "A careening beach, and the only one for a day's sail."
          },
          {
            "id": "drownstep",
            "name": "Drownstep",
            "rank": "village",
            "harbour": true,
            "island": "drownstep",
            "note": "The reef's far end, and the name is a warning."
          },
          {
            "id": "brackmoor",
            "name": "Brackmoor",
            "rank": "village",
            "harbour": true,
            "island": "brackmoor",
            "note": "Peat, marsh and a channel that silts every winter."
          },
          {
            "id": "tidewrack",
            "name": "Tidewrack",
            "rank": "village",
            "harbour": true,
            "island": "tidewrack",
            "note": "The last land before the open south. Salvage, mostly."
          }
        ],
        "$placesNote": "Names and ranks are content and are decided here; WHERE each one stands is computed by tools/draw-map.mjs, which knows which hexes of its island are waterside and which are not. Twelve harbours, two inland, as the settlement block asks - and both inland places are on Vharsel, because the largest island is the only one with an inland to be in.",
        "plate": {
          "minWidthPx": 4000,
          "wantWidthPx": 7000,
          "aspect": "root-two landscape",
          "$note": "Ask for the width before anything else. It is the one property of a plate that cannot be recovered later, and the Reach is on its second plate at 1491 px, which cost it the two larger print presets."
        }
      },
      "plate": {
        "kind": "generated",
        "$kindNote": "Drawn by tools/draw-map.mjs from rows, not painted and traced. It is a build output: never hand-edited, regenerated by its tool, and safe to delete. A \"drawn\" plate is the opposite and the rules in docs/map/README.md are for that one.",
        "file": "sundering-isles.svg",
        "width": 4000,
        "height": 2830,
        "field": {
          "x": 34,
          "y": 34,
          "width": 3932,
          "height": 2762
        },
        "$fieldNote": "Exact, because the tool chose it. On a drawn plate this is measured off the inner frame rule by eye and is the fiddliest step in the whole line."
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
            "note": "Two by two, printed landscape. The working size for a table.",
            "mapWidthMm": 548.4,
            "mapHeightMm": 388,
            "hexAcrossFlatsMm": 18
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
            "note": "Three by three. Worth printing only if the plate arrives at 7000 px.",
            "mapWidthMm": 822.6,
            "mapHeightMm": 582,
            "hexAcrossFlatsMm": 27
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
            "note": "The whole board on one page, for reading rather than playing.",
            "mapWidthMm": 274.2,
            "mapHeightMm": 194,
            "hexAcrossFlatsMm": 9
          }
        ]
      },
      "legend": {
        "$comment": "Character to terrain id, for the 'rows' block. Fixed at commission so the tracer's output is readable the day it first runs, and identical to the Korvane Reach's so a board from either map reads the same in a text editor.",
        "~": "deep-water",
        "-": "shallow-water",
        "r": "river",
        "l": "lake",
        ".": "grassland",
        "f": "forest",
        "h": "hills",
        "^": "mountain",
        "m": "marsh",
        "t": "tundra",
        "d": "desert"
      },
      "rows": [
        "---------d.mf.fff...m..-m...--",
        "~~~~~~~-.ffffffffffffff-.hfm--",
        "~~~~~~~-ff^^^fffff^^^f.-.hhhdf",
        "~~~~~--.f^^^ffm..ff^^h.-.fh..-",
        "~~~~~-m-.f^ff.---.mh^^^f-...--",
        "~~~~~-..f^fmf-..--.hl^h.--f-~~",
        "~~~~~~-mf^ff--.h..-.f^ff-----~",
        "~~~~~~-fff.-..hh.-.hff.-.--f-~",
        "~~~~~~~-.f.-.hhhhd-f..f-d....-",
        "~~~~~~~-..f-ffhhff-f---fhhh.--",
        "~~~~~~~~--m.-.d...-.-.m-.hhh..",
        "~~~~~~~------f-.----.h.-..hh.-",
        "~~~~~~~-.mmf------.--.h.--..m-",
        "~~~~~~-fhhf.-~~-f...-.hf.----~",
        "~~~~~~--.hh.----fhhh.-ffh.-~~~",
        "~~~~--f.hhf.-m--.hhh.-dhm-~~~~",
        "~~~~-.--m.f.-.m.-.hf.-f.m-~~~~",
        "~~~-f..--..-.hh.-.hhf---.-~~~~",
        "~~~~-.h.m-f-.fhh.-...-~~--~~~~",
        "----.hhh.---....-----~~~~~~~~~",
        "..m.-.hhd-~~-.-.-~~~~~~~~~~~~~",
        ".hf.-.m..-~~----~~~~~~~~~~~~~~",
        "..hf--.-.-~~~~~~~~~~~~~~~~~~~~",
        "-f.f-----~~~~~~~~~~~~~~~~~~~~~"
      ],
      "$rowsNote": "GENERATED by tools/draw-map.mjs from commission.landform. Do not hand-edit: run the tool. On a drawn map this block is traced off the artwork instead, and hand-correcting it is expected.",
      "regions": [
        {
          "id": "vharsel",
          "name": "Vharsel",
          "terrain": "forest",
          "labelAt": [
            20,
            5
          ],
          "summary": "120 hexes of the north chain, mostly forest. Vharsel, Cinderfoot, Ashford, Longstrand."
        },
        {
          "id": "kelnholm",
          "name": "Kelnholm",
          "terrain": "grassland",
          "labelAt": [
            26,
            2
          ],
          "summary": "23 hexes of the north chain, mostly grassland. Kelnholm."
        },
        {
          "id": "orrin",
          "name": "Orrin",
          "terrain": "grassland",
          "labelAt": [
            15,
            8
          ],
          "summary": "30 hexes of the north chain, mostly grassland. Orrinmouth."
        },
        {
          "id": "thass",
          "name": "Thass",
          "terrain": "grassland",
          "labelAt": [
            26,
            10
          ],
          "summary": "26 hexes of the reef chain, mostly grassland. Thass Gate."
        },
        {
          "id": "marrowcay",
          "name": "Marrowcay",
          "terrain": "grassland",
          "labelAt": [
            22,
            13
          ],
          "summary": "23 hexes of the reef chain, mostly grassland. Marrowcay."
        },
        {
          "id": "saltrow",
          "name": "Saltrow",
          "terrain": "grassland",
          "labelAt": [
            18,
            15
          ],
          "summary": "26 hexes of the reef chain, mostly grassland. Saltrow, Coldkeel."
        },
        {
          "id": "drownstep",
          "name": "Drownstep",
          "terrain": "grassland",
          "labelAt": [
            14,
            18
          ],
          "summary": "19 hexes of the reef chain, mostly grassland. Drownstep."
        },
        {
          "id": "vellhome",
          "name": "Vellhome",
          "terrain": "grassland",
          "labelAt": [
            9,
            15
          ],
          "summary": "26 hexes of the south chain, mostly grassland. Vellhome."
        },
        {
          "id": "brackmoor",
          "name": "Brackmoor",
          "terrain": "grassland",
          "labelAt": [
            6,
            19
          ],
          "summary": "23 hexes of the south chain, mostly grassland. Brackmoor."
        },
        {
          "id": "tidewrack",
          "name": "Tidewrack",
          "terrain": "grassland",
          "labelAt": [
            2,
            22
          ],
          "summary": "15 hexes of the south chain, mostly grassland. Tidewrack."
        }
      ],
      "settlements": [
        {
          "id": "vharsel",
          "name": "Vharsel",
          "col": 18,
          "row": 7,
          "rank": "seat",
          "harbour": true,
          "note": "Seat of the isles, under the volcano, on the one deep-water road in."
        },
        {
          "id": "thass-gate",
          "name": "Thass Gate",
          "col": 28,
          "row": 11,
          "rank": "city",
          "harbour": true,
          "note": "Where the freight changes hulls: nothing crosses the reef without stopping here."
        },
        {
          "id": "kelnholm",
          "name": "Kelnholm",
          "col": 27,
          "row": 0,
          "rank": "town",
          "harbour": true,
          "note": "The northern landfall, first light off the shelf."
        },
        {
          "id": "orrinmouth",
          "name": "Orrinmouth",
          "col": 12,
          "row": 8,
          "rank": "town",
          "harbour": true,
          "note": "A wide anchorage and not much behind it."
        },
        {
          "id": "marrowcay",
          "name": "Marrowcay",
          "col": 22,
          "row": 16,
          "rank": "town",
          "harbour": true,
          "note": "Built on the reef itself, half of it on piles."
        },
        {
          "id": "saltrow",
          "name": "Saltrow",
          "col": 16,
          "row": 14,
          "rank": "town",
          "harbour": true,
          "note": "Salt pans and a long quay."
        },
        {
          "id": "vellhome",
          "name": "Vellhome",
          "col": 6,
          "row": 15,
          "rank": "town",
          "harbour": true,
          "note": "The southern chain's only real market."
        },
        {
          "id": "cinderfoot",
          "name": "Cinderfoot",
          "col": 10,
          "row": 1,
          "rank": "village",
          "note": "Inland, on the ash. Pays someone else's freight and resents it."
        },
        {
          "id": "ashford",
          "name": "Ashford",
          "col": 18,
          "row": 1,
          "rank": "village",
          "note": "The crater track's last water before the climb."
        },
        {
          "id": "longstrand",
          "name": "Longstrand",
          "col": 23,
          "row": 5,
          "rank": "village",
          "harbour": true,
          "note": "A beach, a jetty and forty boats."
        },
        {
          "id": "coldkeel",
          "name": "Coldkeel",
          "col": 19,
          "row": 18,
          "rank": "village",
          "harbour": true,
          "note": "A careening beach, and the only one for a day's sail."
        },
        {
          "id": "drownstep",
          "name": "Drownstep",
          "col": 13,
          "row": 20,
          "rank": "village",
          "harbour": true,
          "note": "The reef's far end, and the name is a warning."
        },
        {
          "id": "brackmoor",
          "name": "Brackmoor",
          "col": 6,
          "row": 22,
          "rank": "village",
          "harbour": true,
          "note": "Peat, marsh and a channel that silts every winter."
        },
        {
          "id": "tidewrack",
          "name": "Tidewrack",
          "col": 0,
          "row": 20,
          "rank": "village",
          "harbour": true,
          "note": "The last land before the open south. Salvage, mostly."
        }
      ],
      "routes": {
        "$comment": "Generated by tools/draw-map.mjs from the settlements and the water between them. A lane is the shortest walk a hull can make; a road only exists where two settlements share an island.",
        "shipping": [
          {
            "id": "vharsel-thass-gate",
            "name": "Vharsel to Thass Gate",
            "hexes": [
              [
                18,
                6
              ],
              [
                17,
                7
              ],
              [
                18,
                8
              ],
              [
                18,
                9
              ],
              [
                18,
                10
              ],
              [
                18,
                11
              ],
              [
                19,
                11
              ],
              [
                20,
                10
              ],
              [
                20,
                9
              ],
              [
                21,
                9
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
                23,
                11
              ],
              [
                24,
                12
              ],
              [
                25,
                12
              ],
              [
                25,
                13
              ],
              [
                26,
                13
              ],
              [
                27,
                13
              ],
              [
                28,
                13
              ],
              [
                29,
                12
              ],
              [
                29,
                11
              ]
            ]
          },
          {
            "id": "orrinmouth-marrowcay",
            "name": "Orrinmouth to Marrowcay",
            "hexes": [
              [
                11,
                7
              ],
              [
                11,
                8
              ],
              [
                11,
                9
              ],
              [
                12,
                10
              ],
              [
                12,
                11
              ],
              [
                13,
                12
              ],
              [
                14,
                12
              ],
              [
                15,
                12
              ],
              [
                16,
                12
              ],
              [
                17,
                12
              ],
              [
                17,
                11
              ],
              [
                18,
                11
              ],
              [
                19,
                11
              ],
              [
                20,
                12
              ],
              [
                20,
                13
              ],
              [
                21,
                14
              ],
              [
                21,
                15
              ]
            ]
          },
          {
            "id": "marrowcay-saltrow",
            "name": "Marrowcay to Saltrow",
            "hexes": [
              [
                21,
                15
              ],
              [
                21,
                14
              ],
              [
                20,
                13
              ],
              [
                20,
                12
              ],
              [
                19,
                11
              ],
              [
                18,
                11
              ],
              [
                17,
                11
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
              ]
            ]
          },
          {
            "id": "saltrow-vellhome",
            "name": "Saltrow to Vellhome",
            "hexes": [
              [
                15,
                13
              ],
              [
                15,
                12
              ],
              [
                14,
                12
              ],
              [
                13,
                12
              ],
              [
                12,
                11
              ],
              [
                11,
                11
              ],
              [
                10,
                11
              ],
              [
                9,
                11
              ],
              [
                8,
                11
              ],
              [
                7,
                11
              ],
              [
                7,
                12
              ],
              [
                6,
                13
              ],
              [
                7,
                14
              ]
            ]
          },
          {
            "id": "vellhome-longstrand",
            "name": "Vellhome to Longstrand",
            "hexes": [
              [
                7,
                14
              ],
              [
                6,
                13
              ],
              [
                7,
                12
              ],
              [
                7,
                11
              ],
              [
                8,
                11
              ],
              [
                9,
                11
              ],
              [
                10,
                11
              ],
              [
                11,
                11
              ],
              [
                12,
                11
              ],
              [
                13,
                12
              ],
              [
                14,
                12
              ],
              [
                15,
                12
              ],
              [
                16,
                12
              ],
              [
                17,
                12
              ],
              [
                17,
                11
              ],
              [
                18,
                11
              ],
              [
                19,
                11
              ],
              [
                20,
                10
              ],
              [
                20,
                9
              ],
              [
                21,
                9
              ],
              [
                22,
                9
              ],
              [
                23,
                8
              ],
              [
                23,
                7
              ],
              [
                24,
                6
              ],
              [
                24,
                5
              ]
            ]
          },
          {
            "id": "longstrand-coldkeel",
            "name": "Longstrand to Coldkeel",
            "hexes": [
              [
                24,
                5
              ],
              [
                24,
                6
              ],
              [
                23,
                7
              ],
              [
                23,
                8
              ],
              [
                22,
                9
              ],
              [
                21,
                9
              ],
              [
                20,
                9
              ],
              [
                20,
                10
              ],
              [
                19,
                11
              ],
              [
                20,
                12
              ],
              [
                20,
                13
              ],
              [
                21,
                14
              ],
              [
                21,
                15
              ],
              [
                21,
                16
              ],
              [
                21,
                17
              ],
              [
                21,
                18
              ],
              [
                20,
                19
              ],
              [
                19,
                19
              ],
              [
                18,
                19
              ]
            ]
          },
          {
            "id": "coldkeel-drownstep",
            "name": "Coldkeel to Drownstep",
            "hexes": [
              [
                18,
                19
              ],
              [
                17,
                19
              ],
              [
                16,
                19
              ],
              [
                16,
                20
              ],
              [
                15,
                21
              ],
              [
                14,
                21
              ],
              [
                14,
                20
              ]
            ]
          },
          {
            "id": "drownstep-brackmoor",
            "name": "Drownstep to Brackmoor",
            "hexes": [
              [
                14,
                20
              ],
              [
                13,
                21
              ],
              [
                12,
                21
              ],
              [
                11,
                21
              ],
              [
                10,
                21
              ],
              [
                9,
                21
              ],
              [
                9,
                22
              ],
              [
                8,
                23
              ],
              [
                7,
                23
              ],
              [
                7,
                22
              ]
            ]
          },
          {
            "id": "brackmoor-tidewrack",
            "name": "Brackmoor to Tidewrack",
            "hexes": [
              [
                7,
                22
              ],
              [
                6,
                23
              ],
              [
                5,
                23
              ],
              [
                5,
                22
              ],
              [
                4,
                21
              ],
              [
                4,
                20
              ],
              [
                3,
                19
              ],
              [
                2,
                19
              ],
              [
                1,
                19
              ],
              [
                0,
                19
              ]
            ]
          }
        ],
        "road": [
          {
            "from": "vharsel",
            "to": "cinderfoot"
          },
          {
            "from": "cinderfoot",
            "to": "ashford"
          },
          {
            "from": "ashford",
            "to": "longstrand"
          },
          {
            "from": "saltrow",
            "to": "coldkeel"
          }
        ]
      }
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
      "item-bow": {
        "file": "art/renders/item-bow.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.42,
          0.04,
          0.26,
          0.92
        ],
        "focal": [
          0.55,
          0.5
        ]
      },
      "item-chain-mail": {
        "file": "art/renders/item-chain-mail.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.13,
          0.04,
          0.76,
          0.92
        ],
        "focal": [
          0.42,
          0.53
        ]
      },
      "item-crossbow": {
        "file": "art/renders/item-crossbow.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.04,
          0.17,
          0.94,
          0.73
        ],
        "focal": [
          0.53,
          0.27
        ]
      },
      "item-helm": {
        "file": "art/renders/item-helm.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.1,
          0.15,
          0.8,
          0.73
        ],
        "focal": [
          0.39,
          0.6
        ]
      },
      "item-leather-jerkin": {
        "file": "art/renders/item-leather-jerkin.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.12,
          0.04,
          0.72,
          0.94
        ],
        "focal": [
          0.58,
          0.63
        ]
      },
      "item-plate-harness": {
        "file": "art/renders/item-plate-harness.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.13,
          0.08,
          0.74,
          0.78
        ],
        "focal": [
          0.5,
          0.42
        ]
      },
      "item-shield": {
        "file": "art/renders/item-shield.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.08,
          0.04,
          0.86,
          0.9
        ],
        "focal": [
          0.5,
          0.49
        ]
      },
      "item-sword": {
        "file": "art/renders/item-sword.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.21,
          0.01,
          0.76,
          0.98
        ],
        "focal": [
          0.44,
          0.72
        ]
      },
      "item-war-axe": {
        "file": "art/renders/item-war-axe.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.21,
          0.06,
          0.66,
          0.85
        ],
        "focal": [
          0.62,
          0.28
        ]
      },
      "item-war-hammer": {
        "file": "art/renders/item-war-hammer.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.11,
          0.04,
          0.85,
          0.91
        ],
        "focal": [
          0.6,
          0.17
        ]
      },
      "modification-spinnaker": {
        "file": "art/renders/modification-spinnaker.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.04,
          0.03,
          0.94,
          0.77
        ],
        "focal": [
          0.56,
          0.32
        ]
      },
      "monster-ash-drake": {
        "file": "art/renders/monster-ash-drake.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.088,
          0.175,
          0.827,
          0.535
        ],
        "focal": [
          0.285,
          0.592
        ]
      },
      "monster-barrow-troll": {
        "file": "art/renders/monster-barrow-troll.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.06,
          0.1186,
          0.88,
          0.72
        ],
        "focal": [
          0.548,
          0.169
        ]
      },
      "monster-cinder-wolf": {
        "file": "art/renders/monster-cinder-wolf.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.107,
          0.235,
          0.845,
          0.442
        ],
        "focal": [
          0.171,
          0.45
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
      "monster-forge-wight": {
        "file": "art/renders/monster-forge-wight.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.17,
          0.195,
          0.72,
          0.7
        ],
        "focal": [
          0.4,
          0.306
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
      "monster-hoarwyrm": {
        "file": "art/renders/monster-hoarwyrm.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.07,
          0.099,
          0.85,
          0.63
        ],
        "focal": [
          0.222,
          0.568
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
      "monster-stone-boar": {
        "file": "art/renders/monster-stone-boar.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.04,
          0.2265,
          0.85,
          0.545
        ],
        "focal": [
          0.685,
          0.6
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
      "monster-vhalrik-the-cinder-crowned": {
        "file": "art/renders/monster-vhalrik-the-cinder-crowned.png",
        "width": 1055,
        "height": 1491,
        "subject": [
          0.1,
          0.1074,
          0.82,
          0.72
        ],
        "focal": [
          0.419,
          0.238
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
      "tile-barracks": {
        "file": "art/renders/tile-barracks.png",
        "width": 1328,
        "height": 1328,
        "subject": [
          0.05,
          0.02,
          0.93,
          0.93
        ],
        "focal": [
          0.46,
          0.56
        ]
      },
      "tile-brick-house": {
        "file": "art/renders/tile-brick-house.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.146,
          0.023,
          0.831,
          0.787
        ],
        "focal": [
          0.342,
          0.645
        ]
      },
      "tile-clay-pit": {
        "file": "art/renders/tile-clay-pit.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0,
          0.12,
          1,
          0.8
        ],
        "focal": [
          0.52,
          0.52
        ]
      },
      "tile-granary": {
        "file": "art/renders/tile-granary.png",
        "width": 1328,
        "height": 1328,
        "subject": [
          0.036,
          0.062,
          0.935,
          0.888
        ],
        "focal": [
          0.62,
          0.36
        ]
      },
      "tile-hut": {
        "file": "art/renders/tile-hut.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.08,
          0.05,
          0.85,
          0.53
        ],
        "focal": [
          0.65,
          0.43
        ]
      },
      "tile-lumber-camp": {
        "file": "art/renders/tile-lumber-camp.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.01,
          0.01,
          0.98,
          0.98
        ],
        "focal": [
          0.52,
          0.32
        ]
      },
      "tile-manor": {
        "file": "art/renders/tile-manor.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0.05,
          0.01,
          0.785,
          0.96
        ],
        "focal": [
          0.4425,
          0.45
        ]
      },
      "tile-quarry": {
        "file": "art/renders/tile-quarry.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.01,
          0.01,
          0.98,
          0.98
        ],
        "focal": [
          0.64,
          0.45
        ]
      },
      "tile-sand-pit": {
        "file": "art/renders/tile-sand-pit.png",
        "width": 1536,
        "height": 1024,
        "subject": [
          0,
          0,
          1,
          1
        ],
        "focal": [
          0.22,
          0.28
        ]
      },
      "tile-timber-house": {
        "file": "art/renders/tile-timber-house.png",
        "width": 1054,
        "height": 1492,
        "subject": [
          0.21,
          0.21,
          0.71,
          0.38
        ],
        "focal": [
          0.45,
          0.4
        ]
      },
      "tile-warehouse": {
        "file": "art/renders/tile-warehouse.png",
        "width": 1328,
        "height": 1328,
        "subject": [
          0.02,
          0.02,
          0.96,
          0.96
        ],
        "focal": [
          0.62,
          0.46
        ]
      },
      "tool-axe": {
        "file": "art/renders/tool-axe.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.16,
          0.02,
          0.74,
          0.92
        ],
        "focal": [
          0.55,
          0.21
        ]
      },
      "tool-hammer": {
        "file": "art/renders/tool-hammer.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.27,
          0.02,
          0.53,
          0.95
        ],
        "focal": [
          0.53,
          0.15
        ]
      },
      "tool-pick": {
        "file": "art/renders/tool-pick.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.22,
          0.08,
          0.68,
          0.83
        ],
        "focal": [
          0.58,
          0.2
        ]
      },
      "tool-saw": {
        "file": "art/renders/tool-saw.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.03,
          0.33,
          0.96,
          0.47
        ],
        "focal": [
          0.27,
          0.56
        ]
      },
      "tool-scythe": {
        "file": "art/renders/tool-scythe.png",
        "width": 1254,
        "height": 1254,
        "subject": [
          0.25,
          0.03,
          0.43,
          0.93
        ],
        "focal": [
          0.58,
          0.1
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
      "vehicle-veh-09": {
        "file": "art/renders/vehicle-veh-09.png",
        "width": 1492,
        "height": 1054,
        "subject": [
          0.02,
          0.02,
          0.96,
          0.95
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
      },
      "vehicle-veh-13": {
        "file": "art/renders/vehicle-veh-13.png",
        "width": 1491,
        "height": 1055,
        "subject": [
          0.02,
          0.06,
          0.94,
          0.86
        ]
      },
      "vehicle-veh-14": {
        "file": "art/renders/vehicle-veh-14.png",
        "width": 1491,
        "height": 1055,
        "subject": [
          0.02,
          0.02,
          0.955,
          0.96
        ]
      },
      "vehicle-veh-15": {
        "file": "art/renders/vehicle-veh-15.png",
        "width": 1492,
        "height": 1054,
        "subject": [
          0.02,
          0.02,
          0.97,
          0.87
        ]
      },
      "vehicle-veh-16": {
        "file": "art/renders/vehicle-veh-16.png",
        "width": 1492,
        "height": 1054,
        "subject": [
          0.03,
          0.09,
          0.94,
          0.9
        ]
      },
      "vehicle-veh-17": {
        "file": "art/renders/vehicle-veh-17.png",
        "width": 1492,
        "height": 1054,
        "subject": [
          0.02,
          0.02,
          0.96,
          0.88
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
