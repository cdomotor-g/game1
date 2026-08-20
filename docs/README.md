# docs/ is the website

This folder is two things at once, and that is deliberate:

1. **The published site.** GitHub Pages serves this folder at
   [cdomotor-g.github.io/game1](https://cdomotor-g.github.io/game1/). `index.html` here
   is the page you get. Pages will only ever publish a repository's root or its `docs/`
   folder when deploying from a branch — those are the only two choices GitHub offers —
   which is why the explorer lives here and not in a folder named after what it is.
2. **The design documents.** `GLOSSARY.md`, `design/` and `art/` are prose for humans
   reading the repository.

```
index.html        the explorer and the sandbox — the Pages entry point
css/ js/          the app; every path in it is relative, so it works off disk too
data/bundle.js    GENERATED from data/*.json by tools/build-data.mjs, and committed
.nojekyll         serve these files as-is; do not run Jekyll over the design docs
GLOSSARY.md       commodity vs effort vs deposit
MINT.md           the mint: how a card or a map goes designer -> artist -> build
MINT-SETUP.md     how to set the two agents up, and what to paste where
mint/index.html   GENERATED from those two and the live queue, by
                  tools/build-mint.mjs — the readable version, on the site
design/           the fifteen design documents; 14-annex.md is GENERATED
                  by tools/build-annex.mjs from data/*.json
map/              the campaign map: plate, viewer, print sheets
minimaps/         the zoom-in sheets: spec and generation briefs. SHELVED
                  with the tile board — see MINT.md
art/              the visual style guide, and prompts/ — the commissioning
                  briefs for card and map art
```

## Before you move anything in here

Moving `index.html`, `css/`, `js/` or `data/` out of this folder takes the site down.
There is no build step that copies them here; this folder *is* what gets served. The
full explanation, including how to change it safely if you ever want to, is under
**Publishing** in the [root README](../README.md).

`book/index.html`, `mint/index.html`, `cards/`, `art/mint/QUEUE.md` and
`design/14-annex.md` are generated too, for the same reason: Pages serves markdown
as plain text, so anything meant to be *read* on the site has to be rendered and
committed. Edit the markdown or the data, run the tool, commit both.

`data/bundle.js` is generated. Never hand-edit it — edit `data/*.json` at the
repository root and run `node tools/build-data.mjs`. CI fails if the committed copy
does not match the source data.
