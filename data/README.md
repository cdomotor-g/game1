# data/

Every rule that is a *number* or a *list* lives here, not in prose. The design docs
in `docs/` explain intent; these files are what the game actually runs on, and what
the web prototype and any future card/tile generator read.

## Files

| File | Collection | What it holds |
| --- | --- | --- |
| `manifest.json` | — | Index of every dataset, plus the cross-file reference checks |
| `rules.json` | — | Tunable constants: round phases, effort, food, carrying, rest, hirelings, market, victory |
| `commodities.json` | `commodities` | Every storable, tradeable good |
| `tools.json` | `tools` | Equipment that gates recipes and wears out |
| `buildings.json` | `buildings` | Everything constructable, including roads and rail |
| `recipes.json` | `recipes` | Every job worker effort can be allocated to |
| `terrain.json` | `terrains` | Tile types with letter codes, movement and build multipliers |
| `travel.json` | — | Speeds by mode, terrain code and time of day; night, light, caves |
| `discovery.json` | `tables` | The d20 discovery tables, one per terrain code plus overlays |
| `deposits.json` | `deposits` | Finite mineral sources hidden under tiles |
| `transport.json` | `modes` | Cargo modes, route rules, board figures |
| `peoples.json` | `peoples` | Playable peoples, worker types, professions, mana storage, carrying capacity |
| `events.json` | `cards` | The event deck |
| `items.json` | `items` | Clothing, armour, weapons, potions, lights, talismans — each with its mass in kg |
| `arcana.json` | `spells` | Elements, mana rules, the spell list |
| `monsters.json` | `monsters` | The monster deck, with encounter options |
| `vehicles.json` | `vehicles` | The vehicle deck, and the card-code scheme |
| `characters.json` | `characters` | The character deck: health, burden and mana |
| `quests.json` | `quests` | The quest deck: mini-quests and campaigns |

`schema/game.schema.json` documents the shape of each entry. It is for editors and
for humans — it deliberately does not try to validate across files.

**One file per system, on purpose.** The rules have grown past what one file — or one
reading — can hold. A new system is a new file plus a `manifest.json` entry, never a
new wing on an existing file; that is what keeps any single change reviewable and any
single file readable without loading the rest. Decks that are meant to grow (events,
monsters, quests, vehicles, characters) grow by appending entries.

### Mass and bulk are different measures

**Bulk** is a commodity's storage-slot and shipping cost, and it belongs to
`commodities.json` and `transport.json`. **Mass** is what one item weighs in
kilograms — `items.json` `massKg` — and it belongs to whoever is carrying it.
Cargo in a cart is bulk; the axe on your shoulder is mass. The two never convert
into each other, and no entry should ever carry both.

## Rules of the road

1. **Ids are kebab-case and permanent.** Renaming one means updating every file that
   references it. The validator will tell you exactly which.
2. **Add a dataset to `manifest.json` or it does not exist.** The validator, the web
   bundler and the reference checks all read the manifest.
3. **Prose belongs in `summary`, `notes` and `effect`.** Anything a program should be
   able to act on belongs in a typed field. When you find yourself writing a rule into
   `effect` twice, that is the signal to add a field for it.
4. **Numbers here are dials.** None of them are balanced yet. `rules.json` is the first
   place to turn when the game feels wrong.

## Working on the data

```bash
node tools/validate-data.mjs   # referential integrity + design smells
node tools/build-data.mjs      # regenerate docs/data/bundle.js
```

The validator checks more than broken references. It also flags:

- commodities nothing produces (unless tagged `import-only`)
- commodities nothing consumes — a dead end in the economy
- tools and recipes that disagree about which enables which
- buildings with worker slots that no recipe can use
- an item with no mass, or a character whose carry limit is off the burden bar's step
- a character who starts with more gear than they can lift

Those warnings are design feedback, not just lint. A commodity nothing consumes is
usually a missing recipe rather than a mistake in the file.
