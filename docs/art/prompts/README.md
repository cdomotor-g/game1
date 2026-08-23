# Art prompts — the commissioning briefs

One file per **mint line**, one complete prompt per subject, ready to hand to an
image-generating agent. A deck of cards is one file; every map is in
[`maps.md`](maps.md). Every prompt already carries the shared preamble and
negative prompt from [`07-ai-agent-brief.md`](../07-ai-agent-brief.md) — read
that document first anyway: the two-plate rules, the acceptance checklist and
the banned list all apply to every render.

**Every prompt also carries an aim block, and a new one must.** A plate is never
used as drawn — it is cropped, or it is traced — so how the drawing will be
*read* afterwards is as much a part of the brief as what the subject is.

| Line | Block | Contract |
| --- | --- | --- |
| Cards | `FRAMING.` — where the head, the hands and the named gear sit on the page | [`09-framing-and-composition.md`](../09-framing-and-composition.md) |
| Maps | `TRACEABILITY.` — flat washes, one wash per terrain, cold water, no grid | [`../../map/README.md`](../../map/README.md) |

Read the contract before writing a prompt, and write the block from it rather
than from memory.

**Which subjects still need a prompt is not tracked here.** It is computed, by
`node tools/mint-queue.mjs`, and written to
[`../mint/QUEUE.md`](../mint/QUEUE.md). Add a card to `data/` or commission a map
in `data/maps/` and it appears there the moment the tool is run — see
[`../../MINT.md`](../../MINT.md) for who does what next, and
[`../../MINT-SETUP.md`](../../MINT-SETUP.md) for how to set the two agents up.

| File | Subjects | Format |
| --- | --- | --- |
| [`peoples.md`](peoples.md) | The 5 playable peoples | A4 portrait plate, full-length study |
| [`monsters.md`](monsters.md) | The 14 monsters | A4 portrait plate, full-length study |
| [`characters.md`](characters.md) | The 8 character cards | A4 portrait plate, three-quarter figure |
| [`vehicles.md`](vehicles.md) | The 17 vehicle cards | A4 landscape plate, full profile |
| [`talismans.md`](talismans.md) | The 6 talisman cards | Single object study |
| [`modifications.md`](modifications.md) | The 11 modification cards | Single object study |
| [`items.md`](items.md) | The 10 item cards — the armour and the weapons | Single object study |
| [`tools.md`](tools.md) | The 5 tool cards | Single object study |
| [`maps.md`](maps.md) | Every board in `data/maps/` | Whole map plate, landscape root-two |

The plates are drawn as pages from a **field naturalist's folio**: the same worn
1600s-almanac register as everything else, but sheet-sized — a specimen study
with the wear of a book that travelled. That matches the campaign map's own
manner: hand-drawn, a little grimy, tattered from time in the field.

## A brief for a plate that is already drawn

Two of these files brief a deck whose plates are **generated** — [`items.md`](items.md)
and [`tools.md`](tools.md). `data/components.json` gives those decks
`plateKind: "generated"`, and [`../../../tools/draw-item.mjs`](../../../tools/draw-item.mjs)
draws each plate from the parts the card carries in its own `plate` block, the
way `tools/draw-map.mjs` draws a generated map. Nobody is waiting on an artist
for them, and `node tools/mint-queue.mjs` says so in as many words.

The briefs are written and kept current anyway, because a generated plate is not
a decision about the deck for ever. **Delete a card's `plate` block and that one
card is back at DRAW**: the tool then has nothing to draw it from, so it can
never overwrite what arrives, and the prompt in these files is what the artist is
handed. Per card, not per deck — one hand-drawn sword can sit in a deck of
generated ones. A brief left to go stale is a switch that cannot be thrown.

## Where renders land

Save accepted images as `docs/art/renders/<id>.png` — or, for a map,
`docs/map/<id>.png`. The id is the heading of each prompt (`monster-ash-drake`, `people-dwarf`, `character-chr-06`,
`vehicle-veh-01`, `talisman-tal-03`). When a prompt is revised to get a render
accepted, freeze the accepted wording next to the image as
`docs/art/renders/<id>.txt`, per the brief's batch-generation rules.

## Batch discipline

Work a deck at a time: generate one reference render, accept it, then match the
rest of the deck to it. Re-check against the reference every ten renders or so —
style drifts slowly enough that you will not notice within a session. The
acceptance checklist in the brief is a gate, not a suggestion.
