# item-rations-3-day — what was tried

One delivery, accepted with a departure written down. The style is right and the
picture is good; it is a picture of a different object, and that difference is the
whole of this file.

Artist: ChatGPT, working from `docs/art/prompts/items.md` § `item-rations-3-day`.
It arrived as an attachment rather than through the `plate/item-rations-3-day`
inbox branch, so it was landed with `node tools/ship-art.mjs`.

| # | wording | outcome |
|---|---|---|
| 1 | the brief as written | **accepted with a departure.** Medium, page and floor all clean — nib line of varying weight, feathered hatching carrying the tone and reading through the washes, muted ochre and rust on warm oatmeal paper, 1254 x 1254 square, no lettering anywhere, no ring stain. The SUBJECT is a different thing: a corded bundle lying on its side, where the brief asks for an upright sack of coarse sacking. |

## What the brief asks for, and what arrived

The brief: *a small ration sack stood upright on a bench, packed hard enough to
stand square on its own*, its neck **rolled down twice and lashed with a laid
cord**, a **chalked tally mark** on the shoulder, a **darned bottom corner**, and
set out on the bench in front of it **two flat rounds of hard biscuit, one broken
across**, a **twist of oiled paper** off a length of salt beef, and a **twist of
coarse salt closed with thread**.

The plate: a bundle of striped cloth rolled and lashed with four turns of laid
cord over a leather tab, lying on its side on a hatched ground, one end open with
a round of biscuit and dark salt beef showing inside it. No sack, no upright, no
chalked stroke, no salt twist, and the food is inside the wrapping rather than set
out beside it.

## Why it was kept

Approval settles whether a picture is wanted; the checklist settles whether it
meets the brief. Those are different questions and they got different answers
here. The owner asked for these plates to be landed, and the picture does the
card's job — it reads instantly as provisions carried for a few days, it is in the
house register, and it sits beside `item-rations-10-day` as the smaller of a pair.

## What it would take to get the sack

The brief is unchanged and still describes the sack. Deleting
`docs/art/renders/item-rations-3-day.png` puts `ITM-13` back at DRAW in
`node tools/mint-queue.mjs`, flips the brief's own marker back to
`WAITING — THIS ONE IS YOURS`, and `node tools/mint-request.mjs ITM-13` prints the
commission again unchanged. Nothing about that has to be rewritten.

The one thing not to do is edit the brief to describe the bundle. A brief is what
the plate was commissioned from, not a caption written after the fact.
