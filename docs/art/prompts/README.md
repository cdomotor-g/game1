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
| [`maps.md`](maps.md) | Every board in `data/maps/` | Whole map plate, landscape root-two |

The plates are drawn as pages from a **field naturalist's folio**: the same worn
1600s-almanac register as everything else, but sheet-sized — a specimen study
with the wear of a book that travelled. That matches the campaign map's own
manner: hand-drawn, a little grimy, tattered from time in the field.

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
