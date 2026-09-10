# item-rations-10-day — what was tried

One delivery, accepted with a departure written down. Same departure as
[`item-rations-3-day`](item-rations-3-day.attempts.md), from the same run: the
style is right and the picture is good, and it is a picture of a different object.

Artist: ChatGPT, working from `docs/art/prompts/items.md` § `item-rations-10-day`.
It arrived as an attachment rather than through the `plate/item-rations-10-day`
inbox branch, so it was landed with `node tools/ship-art.mjs`.

| # | wording | outcome |
|---|---|---|
| 1 | the brief as written | **accepted with a departure.** Medium, page and floor all clean — nib line of varying weight, feathered hatching carrying the tone and reading through the washes, muted ochre and rust on warm oatmeal paper, 1254 x 1254 square, no lettering anywhere, no ring stain. The SUBJECT is a different thing: a corded bundle lying on its side, where the brief asks for a heavy upright sack. |

## What the brief asks for, and what arrived

The brief: *a heavy ration sack stood on a bench and plainly a load*, **half as
high again as it is wide**, its side seams **doubled and re-stitched as a raised
welt down the full length of both**, the neck **gathered and lashed over a short
wooden toggle**, the same cord **carried twice round the body as a rough sling**
and knotted at the shoulder, an **old repair of heavier canvas stitched all the
way round** across the belly, and a **long round of biscuit and a wrapped block of
salt beef leaning at its foot**.

The plate: a bundle of rust-red cloth roped twice and knotted, lying on its side
on a hatched ground, a stitched patch on the belly, one end open with a round of
biscuit, a block of cheese and a strip of salt beef showing inside it. No sack, no
upright, no toggle, no sling, no doubled welts, and the food is inside the
wrapping rather than leaning at the foot.

## Why it was kept

Approval settles whether a picture is wanted; the checklist settles whether it
meets the brief. Those are different questions and they got different answers
here. The owner asked for these plates to be landed, and the picture does the
card's job — it reads as a load of provisions, it is in the house register, and it
is visibly the heavier of the pair beside `item-rations-3-day`, which is the one
distinction the two cards actually have to carry.

## What it would take to get the sack

The brief is unchanged and still describes the sack. Deleting
`docs/art/renders/item-rations-10-day.png` puts `ITM-14` back at DRAW in
`node tools/mint-queue.mjs`, flips the brief's own marker back to
`WAITING — THIS ONE IS YOURS`, and `node tools/mint-request.mjs ITM-14` prints the
commission again unchanged. Nothing about that has to be rewritten.

The one thing not to do is edit the brief to describe the bundle. A brief is what
the plate was commissioned from, not a caption written after the fact.
