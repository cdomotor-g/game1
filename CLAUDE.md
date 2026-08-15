# Notes for agents working in this repository

## `docs/` is the published website. Do not reorganise it.

GitHub Pages serves `docs/` directly. The committed files in that folder *are* the
site — there is no build step that assembles them from somewhere else. Pages will only
publish the repository root or a folder called `docs/`, so the explorer cannot live in
a better-named folder such as `web/`; it was moved out of `web/` precisely because Pages
could not reach it there.

Moving, renaming or "tidying" `docs/index.html`, `docs/css/`, `docs/js/`, `docs/data/`
or `docs/.nojekyll` takes the site down. The full reasoning, and what to change together
if a move is genuinely wanted, is under **Publishing** in `README.md`. Read it before
touching the layout.

## `data/*.json` is the single source of truth

`docs/data/bundle.js` is generated from it and committed. After editing anything in
`data/`, run `node tools/build-data.mjs` and commit the regenerated bundle, or CI fails.

## The map artwork is never edited by a tool

`docs/map/*.png` is a plate: committed as supplied, never re-encoded, never repainted.
Everything the game knows about what is on it lives in `data/maps/*.json`, and the hex
grid is an overlay drawn on top at read time. If a map says something the game's terrain
vocabulary cannot express, **change the map, not `data/terrain.json`** — the reasoning and
the whole pipeline are in `docs/map/README.md`.

## Before pushing

```bash
node tools/validate-data.mjs   # referential integrity and design smells
node tools/validate-map.mjs    # boards against terrain.json and against themselves
node tools/build-map.mjs       # map proof sheets, and the derived print sizes
node tools/build-data.mjs      # rebuild the web bundle
node tools/simulate.mjs        # check it still plays
node tools/validate-art.mjs    # palette and layer contract
```
