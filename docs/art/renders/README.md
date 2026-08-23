# The accepted renders

One PNG per prompt id, named exactly as the headings in
[`../prompts/`](../prompts/) — `character-chr-01`, `monster-ash-drake`,
`people-dwarf`, `vehicle-veh-07`, `talisman-tal-03`. The mini-map sheets
(`PSM`/`TBM`/`SET`) are not here: they land at
[`docs/minimaps/img/`](../../minimaps/img/), per their own briefs.

These files feed three things, all by filename convention, so the name **is**
the contract:

- the design book's plate galleries (`docs/design/07`, `docs/design/13`),
- the explorer (`tools/build-data.mjs` indexes this directory into the bundle),
- the card fronts (`tools/build-cards.mjs` renders a card only when its plate
  exists here).

Re-render something, drop it in under the same name, re-run the two build
tools, and everything that shows it updates.

## Two kinds of plate live here, and the extension says which

**A drawn plate is a `.png` and nothing here ever touches it.** It arrives as the
artist supplied it, it is committed byte for byte, and no tool in this repository
re-encodes, repaints or crops it. Cropping happens at read time from
`framing.json`, which is why a printed card and a thumbnail of the same plate
cannot disagree about where the subject is.

**A generated plate is a `.svg` with a `.png` beside it**, and both are written
by [`../../../tools/draw-item.mjs`](../../../tools/draw-item.mjs) from the parts
the card carries in its own `plate` block. Never hand-edit either one; change the
parts in `data/items.json` or `data/tools.json` and run the tool. They are safe
to delete — they come back.

The pair is not redundant. The **SVG is the plate**: it carries the two-plate
contract like every other generated drawing here, `tools/validate-art.mjs` sweeps
it, and `node tools/draw-item.mjs --check` fails the build when it has gone
stale — all in pure node, with no browser anywhere near it. The **PNG is the
plate rasterised**, because a card window shows a PNG and the framing arithmetic
measures one; making it needs a locally installed Chromium, which is exactly why
it is a separate step and why the result is committed rather than rebuilt.

Which decks are generated is `plateKind` on the deck in `data/components.json`,
and `node tools/mint-queue.mjs` reports it every run. To take one card back to a
drawn plate, delete that card's `plate` block — see
[`../prompts/README.md`](../prompts/README.md).

## And an entry in framing.json

Every one of these files is shown cropped somewhere — a card window, a deck
thumbnail — because a plate is a whole page and nothing that shows one is that
shape. [`../framing.json`](../framing.json) says where the subject sits on each
plate, so the crop keeps the head and the hands instead of the middle of the
file. A new plate wants its entry in the same commit; without one it is framed
on the centre of the page, and both build tools warn that it is.

## Still to be drawn

| Deck | Missing |
| --- | --- |
| Monsters | `monster-cinder-wolf` (MON-01), `monster-ash-drake` (MON-02), `monster-forge-wight` (MON-03), `monster-barrow-troll` (MON-04), `monster-stone-boar` (MON-05) |
| Peoples | `people-orc` |
| Vehicles | `vehicle-veh-09` — The Varl Wagonrow |

Everything else — 8 characters, 7 of 12 monsters, 4 of 5 peoples, 6 talismans
and 11 of 12 vehicles — is in. Prompts for the missing plates are already
written in [`../prompts/`](../prompts/); run them past the acceptance checklist
in [`../07-ai-agent-brief.md`](../07-ai-agent-brief.md) before committing.
