# Art prompts — the commissioning briefs

One file per deck, one complete prompt per subject, ready to hand to an
image-generating agent. Every prompt already carries the shared preamble and
negative prompt from [`07-ai-agent-brief.md`](../07-ai-agent-brief.md) — read
that document first anyway: the two-plate rules, the acceptance checklist and
the banned list all apply to every render.

| File | Subjects | Format |
| --- | --- | --- |
| [`peoples.md`](peoples.md) | The 5 playable peoples | A4 portrait plate, full-length study |
| [`monsters.md`](monsters.md) | The 12 monsters | A4 portrait plate, full-length study |
| [`characters.md`](characters.md) | The 8 character cards | A4 portrait plate, three-quarter figure |
| [`vehicles.md`](vehicles.md) | The 12 vehicle cards | A4 landscape plate, full profile |
| [`talismans.md`](talismans.md) | The 6 talisman cards | Single object study |

The plates are drawn as pages from a **field naturalist's folio**: the same worn
1600s-almanac register as everything else, but sheet-sized — a specimen study
with the wear of a book that travelled. That matches the campaign map's own
manner: hand-drawn, a little grimy, tattered from time in the field.

## Where renders land

Save accepted images as `docs/art/renders/<id>.png` — the id is the heading of
each prompt (`monster-ash-drake`, `people-dwarf`, `character-chr-06`,
`vehicle-veh-01`, `talisman-tal-03`). When a prompt is revised to get a render
accepted, freeze the accepted wording next to the image as
`docs/art/renders/<id>.txt`, per the brief's batch-generation rules.

## Batch discipline

Work a deck at a time: generate one reference render, accept it, then match the
rest of the deck to it. Re-check against the reference every ten renders or so —
style drifts slowly enough that you will not notice within a session. The
acceptance checklist in the brief is a gate, not a suggestion.
