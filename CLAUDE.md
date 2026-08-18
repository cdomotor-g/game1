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

`docs/data/bundle.js` AND `docs/design/14-annex.md` are generated from it and
committed. After editing anything in `data/`, run `node tools/build-data.mjs` (or CI
fails) and `node tools/build-annex.mjs` (or the printed rulebook lies) and commit the
regenerated files.

The data is one file per system on purpose — travel, discovery, monsters, quests,
arcana and the decks are separate files so no task needs the whole ruleset in context.
Add a new system as a new file plus a `manifest.json` entry, never as a new wing on an
existing file.

## A plate is cropped, never squeezed — and never by eye

`docs/art/renders/*.png` are whole drawn pages. Every place that shows one — a card
window, an explorer thumbnail — is a different shape, so it shows a crop, and where that
crop sits comes from `docs/art/framing.json`: one `subject` box per plate, holding the
head, the hands and the gear the card names. The arithmetic lives once, in
`docs/js/framing.js`, which `tools/lib/framing.mjs` loads for the build tools the way
`tools/simulate.mjs` loads the engine — so a printed card and a thumbnail of the same
plate cannot disagree about where the subject is.

Add a plate, add its framing entry in the same commit. Without one it is framed on the
middle of the page — which is what put a character's chin at the top edge of their own
card in the first place — and `build-cards.mjs` and `build-data.mjs` both warn.

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
node tools/build-annex.mjs     # regenerate docs/design/14-annex.md
node tools/build-cards.mjs     # regenerate docs/cards/ from data + renders
node tools/build-book.mjs      # regenerate docs/book/ from docs/design/*.md
node tools/simulate.mjs        # check it still plays
node tools/validate-art.mjs    # palette and layer contract
```
