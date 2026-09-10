# item-arrows-20 — what was tried

One delivery, accepted with a departure written down. The object is right and its
setting is missing.

Artist: ChatGPT, working from `docs/art/prompts/items.md` § `item-arrows-20`. It
arrived as an attachment rather than through the `plate/item-arrows-20` inbox
branch, so it was landed with `node tools/ship-art.mjs`.

| # | wording | outcome |
|---|---|---|
| 1 | the brief as written | **accepted with a departure.** Medium, page and floor all clean, and the arrows themselves are as briefed: pale shafts fanning above a waxed-cord binding, three low trimmed feathers to a shaft, square nocks, socketed leaf broadheads whipped and laid all one way. The SETTING is missing: there is no war-bag, and there is one sheaf rather than two. |

## What the brief asks for, and what arrived

The brief: **two** bound sheaves lying in an **opened canvas war-bag** unrolled
flat, its far flap lying back behind the arrows as a plain band and its near edge
folded down, the sheaves staggered so the heads of the far one show above the
shafts of the near one, **two cloth ties** stitched to the near edge hanging open
and uncrossed with one frayed to a few threads, the canvas rubbed pale along the
fold and **stained dark at one end** from standing in wet grass.

The plate: one loose sheaf on a bare bench line, bound once with a broad red band
over a laid cord and knotted off. No bag, no flap, no ties, no stain.

## The war-bag is on the card, not only in the brief

This is what raises the finding above "scenery we lost". `ITM-16` prints the bag
twice in its own words, and neither of them came from the brief:

> Each battle with a bow or a crossbow spends 1, **from the bag before the
> quiver**. The uses ARE the wear: **an empty bag is a spent bag**.

> **Two sheaves in a war-bag**, which is what a village fletcher sells to
> somebody who has said where the road goes.

So a player reading the card is told about a bag, told the bag is what wears out,
and shown a picture with no bag in it. That is a card disagreeing with itself,
which is exactly the failure this repository builds its checks to prevent
everywhere else — and no check can catch it, because nothing here reads a picture.

## Why it was kept anyway

The one job these two cards have to do between them is say **ten** and **twenty**
at a glance, and this pair does that: laid beside `item-arrows-10` the sheaf is
visibly about double, which is the distinction a player actually reads. The
war-bag was the brief's way of carrying that difference; the doubling turned out
to carry it without the bag.

It was kept because the owner asked for these plates landed and the picture reads
correctly as a large bundle of arrows. It should not be left as it is.

## What it would take to get the war-bag

The brief is unchanged and still describes it. Deleting
`docs/art/renders/item-arrows-20.png` puts `ITM-16` back at DRAW in
`node tools/mint-queue.mjs`, flips its marker back to
`WAITING — THIS ONE IS YOURS`, and `node tools/mint-request.mjs ITM-16` prints the
commission again unchanged. Of the four departures in this batch this is the one
most worth spending another render on, because it is the only one the card's own
rules text contradicts.
