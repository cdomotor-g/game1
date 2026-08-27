---
title: Game1 Plates
emoji: 🗝️
colorFrom: yellow
colorTo: gray
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
short_description: The artist end of the game1 mint - draws a plate from a commission
tags:
  - mcp-server-available
  - image-generation
---

# The plate press

This Space is **the artist**, and nothing else.

[game1](https://github.com/cdomotor-g/game1) mints cards, maps and building tiles
through a handover that is deliberately split in two: somebody who can write and
cannot draw hands a complete brief to somebody who can draw and does not know the
rules. `docs/MINT.md` is that pipeline. This Space is the second pair of hands.

**It holds no content.** No card is described here, no tile is named here, and the
house style is not restated here — the same bargain `data/components.json` keeps one
storey down. The repository assembles the whole commission itself:

```bash
node tools/mint-request.mjs tile-warehouse
```

which prints the preamble, the subject paragraph, the `FRAMING` block, the computed
`WINDOW` and `LABEL BAND` notes and the negative prompt, already joined up. Paste the
positive half into **Commission** and the negative half into **Negative prompt**. A
brief that was edited here and not in the repository is a brief that has started
lying, so edit it there.

## Seed, and why it is the control that matters

Every building tile is drawn **twice** — the building finished, and the same ground
with the work not yet done — and the two sides have to turn over onto each other:
same viewpoint, same distance, the building sitting in the same place on the page. A
player flips the tile the round the work is paid for and the picture should settle
rather than jump.

So draw a face, keep the seed it reports, and draw its `-site` on that same seed with
`Randomise` off. It is not a guarantee, but it is the difference between two pictures
of one building and two unrelated pictures.

## Plate size

The three formats are the ones `data/mint.json` already declares under
`draw.sizeByFormat`, so the vocabulary is the repository's rather than this Space's.
Each maps to the nearest size the model draws natively — printed under the image, so
what actually came out is never a guess.

Ask for the width before anything else. It is the one property of a plate that cannot
be recovered later: a coastline can be re-traced and a label can be argued with, but
pixels that were never drawn are gone.

## As an MCP tool

`mcp_server=True` is set, so once this Space is running it is callable directly as a
tool over MCP at `/gradio_api/mcp/sse`. Point the Hugging Face connector at it with
`?gradio=<owner>/game1-plates` and the mint can commission a plate without anybody
carrying the paper between two windows.

## Deploying it

The Space is a git repository of its own; this folder is its working copy. Nothing in
game1 pushes it, and `data/mint.json` is deliberately **not** pointed at it — swapping
the declared artist is a one-field change and it belongs to whoever decides to make it.

```bash
huggingface-cli login
huggingface-cli repo create game1-plates --type space --space_sdk gradio
git -C space init && git -C space add -A
git -C space commit -m "The plate press"
git -C space remote add origin https://huggingface.co/spaces/<owner>/game1-plates
git -C space push -u origin main
```

Gradio Spaces need a paid plan on a personal account, except that a free account in
good standing may run two of them on [ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu) —
which is what the `@spaces.GPU` decorator in `app.py` is asking for.
