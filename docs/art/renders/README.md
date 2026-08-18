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
