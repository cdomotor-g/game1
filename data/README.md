# data/

Every rule that is a *number* or a *list* lives here, not in prose. The design docs
in `docs/` explain intent; these files are what the game actually runs on, and what
the web prototype and any future card/tile generator read.

## Files

| File | Collection | What it holds |
| --- | --- | --- |
| `manifest.json` | — | Index of every dataset, plus the cross-file reference checks |
| `rules.json` | — | Tunable constants: round phases, effort dice, food, storage, market, victory |
| `commodities.json` | `commodities` | Every storable, tradeable good |
| `tools.json` | `tools` | Equipment that gates recipes and wears out |
| `buildings.json` | `buildings` | Everything constructable, including roads and rail |
| `recipes.json` | `recipes` | Every job worker effort can be allocated to |
| `terrain.json` | `terrains` | Tile types, movement and build multipliers, board setup |
| `deposits.json` | `deposits` | Finite mineral sources hidden under tiles |
| `transport.json` | `modes` | Cargo modes, route rules, board figures |
| `peoples.json` | `peoples` | Playable peoples, worker types, professions |
| `events.json` | `cards` | The event deck |
| `items.json` | `items` | Clothing, armour, weapons, potions |

`schema/game.schema.json` documents the shape of each entry. It is for editors and
for humans — it deliberately does not try to validate across files.

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

Those warnings are design feedback, not just lint. A commodity nothing consumes is
usually a missing recipe rather than a mistake in the file.
