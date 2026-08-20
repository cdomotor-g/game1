# The card mint → [`MINT.md`](MINT.md)

This page moved. The card mint became **the mint**: the same designer/artist
handover now runs more than one *line*, and cards are one of them.

| You wanted | It is now in |
| --- | --- |
| The four steps, the two agents, the pull request handover | [`MINT.md`](MINT.md) |
| How to set the designer and the artist up, and what to paste where | [`MINT-SETUP.md`](MINT-SETUP.md) |
| Which cards are waiting on what | [`art/mint/QUEUE.md`](art/mint/QUEUE.md), computed by `node tools/mint-queue.mjs` |
| All of it, rendered and readable on the site | [`mint/`](mint/index.html) |

Nothing about minting a card has changed. A card still only exists once four
things do — an entry in `data/`, a brief in `docs/art/prompts/`, a plate in
`docs/art/renders/`, and a framing entry — and the queue still computes which of
those is missing rather than tracking it.

What changed is that maps are minted the same way now, and the machinery is
declared once in [`../data/mint.json`](../data/mint.json) instead of being written
into the card tool. This file is kept as a signpost because it was linked to from
outside the repository.
