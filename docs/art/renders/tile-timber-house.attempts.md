# tile-timber-house — what was tried

| # | what arrived | rejected for |
|---|---|---|
| 1 | `2a8425f` — 600,064 bytes | Not an image. No PNG, JPEG, WebP, GIF, BMP or SVG header anywhere in the file; entropy 7.963 bits/byte, which is indistinguishable from random; nothing decompresses as raw deflate, zlib, gzip or brotli. Mangled between the artist and the commit. **Nothing to do with the drawing** — the drawing may well have been fine and nobody will ever know. |

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
