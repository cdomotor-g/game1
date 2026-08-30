# tile-timber-house — what was tried

| # | what arrived | outcome |
|---|---|---|
| 1 | `2a8425f` — 600,064 bytes | Not an image. No PNG, JPEG, WebP, GIF, BMP or SVG header anywhere in the file; entropy 7.963 bits/byte, indistinguishable from random; nothing decompresses as raw deflate, zlib, gzip or brotli. Mangled between the artist and the commit. **Nothing to do with the drawing.** |
| 2 | 1054 × 1492 PNG, attached to the chat | **ACCEPTED.** Valid PNG, and the house style: fine nib line, dense hatching, thin translucent washes, aged paper, no card furniture, no lettering. Drawn PORTRAIT for a pair tile whose window is 1.73 wide — see below. |

## The transfer that worked

Attaching the PNG to the chat and having it committed from the attachment. The
first attempt went through a path that re-encoded the bytes; this one did not.
That is the whole difference, and it is worth doing the same way every time.

## The one thing to do differently next time: DRAW IT LANDSCAPE

`timber-house` is a **pair** — two cells, footprint aspect 1.73, wide. Its brief
and its commission both say `Landscape 3:2`, and `data/mint.json` derives that
from the footprint rather than anybody typing it. The plate arrived portrait.

Nothing was ruined, because the building happens to sit in a band 38% of the
page tall and the window keeps 40.8% — about two percent of slack. But the whole
foreground went: the path to the door and both fence runs are cut, and the piece
carries a wedge of empty ground on its left that the label band now sits on. It
works, and a landscape page would have let the house fill the piece and kept the
fence.

There is almost no room to aim differently. Narrowing the crop horizontally to
centre the house better forces a shorter band — at 92% of the width the band is
37.5% tall and the building no longer fits. The aim below is close to the only
one there is, which is what a wrong-shaped page costs.

## It is not recoverable, and that is worth stating

The bytes were checked for every container this repository could plausibly be
handed, for a PNG whose signature had been overwritten (no `IHDR`, `IDAT` or
`IEND` appears at any offset), and for four compression formats. There is no
image in the file. It cannot be repaired, only sent again.

The size is suggestive: 600,064 × 4/3 ≈ 800,085, which is what you would get by
taking an ~800 kB payload, treating it as base64 text, and decoding it. That
fits an upload path that base64-decoded something already binary. It is a
hypothesis and it does not change the remedy.

## What changed because of it

`pngProblem()` in `tools/lib/png.mjs`, and the five tools that sweep
`docs/art/renders/` now use it: `mint-queue`, `build-cards`, `build-data`,
`build-tiles` and `validate-framing`. Every one of them died on this file with a
stack trace out of `pngSize` — one bad upload took down the whole build,
including the queue, which is the tool you run to find out what is wrong.

Now the queue reports it as a contract problem, names the file, says what the
bytes look like and what to do; and **the subject stays at DRAW**, which is what
puts it back on the artist's worklist. A plate that cannot be read has not
arrived.

## Asking for it again

The plate is fine to redraw or, more likely, simply to re-send. What matters is
the transfer, not the drawing:

- attach the PNG to the chat and let the file be committed from the attachment,
  rather than pasting or reconstructing bytes
- or upload it through the GitHub web UI, which does not re-encode
- `node tools/mint-queue.mjs` says immediately whether it landed readable
