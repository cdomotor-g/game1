# Drawn plate delivery contract

This file applies to drawn artwork under `docs/art/renders/` and supplements the
root `AGENTS.md` and `CLAUDE.md`. It says what a plate file must be, how one
gets into the repository, and what the word **shipped** means. Read all of it
before delivering anything; it is short because every rule in it was paid for.

## The size rule

**A card plate must print cleanly at twice the card's size.** The rulebook
shows a card's picture blown up to a half-page section, twice the card, and
that is the largest anything a card plate feeds is ever printed.

The figure that rule turns into is **derived, never typed**, from the card's
safe area cut to the page shape the deck draws on, at the print scale and dots
per inch declared in `data/mint.json` (`lines.cards.plate.minLongSide`):

| Page | Floor — refused below this | Want — an aspiration |
| --- | --- | --- |
| A4 portrait | 1260 px on the long side | 1890 px |
| Square | 866 px | 1299 px |
| A4 landscape, 3:2 | 866 px on the long side | 1299 px |

Those numbers are what the rule comes to today; the marker under each brief's
heading carries that subject's own figure, and building tiles carry their own
(derived from the largest world hex any map declares). If the two ever disagree,
the marker is right and this table is stale.

- **Deliver the largest size the generator offers for the page shape.** Every
  generator size in use today clears the floor. A plate under the floor is
  refused by `tools/ship-art.mjs` and by the landing workflow, and nothing
  can add pixels afterwards.
- **Never upscale.** An enlarged plate has the pixel count and none of the
  information; the floor is about drawn detail, not about a number. Redraw
  larger, or deliver what the generator made and let the queue note it.
- **Never downscale, recompress or re-encode.** The committed master is the
  generator's own output.

`node tools/validate-framing.mjs` prints what every deck's thinnest plate
actually prints at through its own card window, and `node tools/mint-queue.mjs`
notes, once per floor, which plates are between the floor and the want.

## Master format

- The committed master is the original, full-resolution, lossless PNG.
- 8-bit sRGB, at the page shape the brief names. Pixel dimensions are
  authoritative for print; DPI metadata is not and is ignored.
- Never replace the master with a JPEG, WebP, chat preview or reduced copy.
- Web-sized derivatives may be generated later, never as the source from which
  print pieces are built.

## Bytes, not appearances

Generated-image output must first exist as a complete local file or genuine file
attachment. A rendered preview proves appearance only; it does not supply safe
bytes for a repository upload. Never scrape a preview, paste base64 through a
conversation, decode bytes that are already binary, or rebuild a file from
connector text.

The repository has suffered both failure modes this rule prevents: a payload was
truncated in an automated API transfer, and `tile-timber-house.png` arrived as
600,064 bytes of high-entropy data after an apparent base64 round-trip.

## The route: one file, on an inbox branch

**The artist delivers one PNG to a branch. Everything else is done for it.**

Push the finished plate, and nothing else, to a branch named after the plate:

```
branch:  plate/<plate-id>
path:    docs/art/renders/<plate-id>.png
```

`<plate-id>` is the brief's own `## <plate-id>` heading, exactly. If the wording
had to change to get an acceptable render, the wording actually used goes beside
it as `docs/art/renders/<plate-id>.txt` on the same branch; nothing else may be
on that branch.

The push starts `.github/workflows/land-plate.yml`, which takes the file off the
branch by its exact path and hands it to `node tools/ship-art.mjs`. That command
validates every chunk of the PNG, refuses a plate under its floor, runs the mint
build, commits the plate to `main` with everything it feeds rebuilt, pushes,
reads the committed blob back from `main`, compares its SHA-256 with the source
and validates the returned bytes again. On success the inbox branch is deleted
and the queue on `main` moves the subject off DRAW by itself. On failure the
branch is left alone, the run's summary says why, and pushing a corrected file
to the same branch runs it again.

The artist therefore never assembles a commit out of blobs and trees, never runs
the build, never expands a checkout to verify a push, and never touches `main`.

### Doing it through the GitHub API

Whatever tool the artist has, the inbox needs three calls, and a connector that
can create a file on a branch can make all of them:

1. `GET /repos/cdomotor-g/game1/git/ref/heads/main` — the SHA of `main`.
2. `POST /repos/cdomotor-g/game1/git/refs` with
   `{"ref": "refs/heads/plate/<plate-id>", "sha": "<that sha>"}`.
3. `PUT /repos/cdomotor-g/game1/contents/docs/art/renders/<plate-id>.png` with
   `{"message": "<plate-id> plate", "branch": "plate/<plate-id>", "content": "<base64>"}`.

Rules for step 3, each of which has been broken here:

- Read the file's bytes from the local file or attachment, whole, and note its
  byte length and SHA-256 first.
- Base64-encode **once**. The encoded length must be `4 × ceil(bytes / 3)`;
  if it is not, the read was truncated or chunked wrongly — do not upload it.
  A tool with a per-call output limit has to read the file in pieces and
  concatenate the **bytes** before encoding, never encode piece by piece.
- Send the whole file in **one** `PUT`. The contents API takes a file up to
  100 MB; a 4 MB plate is not near it.
- Never decode what is already binary, never re-encode a decoded copy, and
  never build the payload out of text a connector returned.

The commit `PUT` returns carries the blob's SHA-1 and size; a size that differs
from the local byte length means the upload is wrong and the branch should be
fixed before the landing run reads it.

### What "shipped" means, and who says it

**A plate is shipped when `ship-art` prints `SHIPPED AND VERIFIED`, and not
before.** A push to the inbox branch is a delivery, not a landing. The artist's
report says one of two things:

- *Pushed to `plate/<plate-id>` at `<commit>`, `<width>x<height>`, SHA-256
  `<hash>`; the landing run is pending.* The landing run's own summary (Actions
  tab, **Land plate**) is the record of what happened next; when it succeeds the
  branch is gone and `docs/art/mint/QUEUE.md` on `main` shows the subject at
  FRAME.
- *NOT SHIPPED — <the run's reason>.* Then fix the file and push it to the
  same branch.

Do not report a plate as shipped, landed, committed or verified on the strength
of a `PUT` that returned 201, a plausible file size, a valid PNG signature or
readable dimensions. `GitHub accepted it` is not one of the two sentences above.

## With a checkout

A person, or an agent with an authenticated clone, skips the branch:

```bash
node tools/ship-art.mjs <plate-id> <source.png> [--wording=<file.txt>] [--quiet]
```

It is the same command the workflow runs and it does every step listed above,
including the read-back from `origin/main`. `node tools/verify-plate.mjs --all`
applies the byte check alone to every committed plate in CI.

## Rejections

Every rejected attempt goes in `docs/art/renders/<plate-id>.attempts.md` with
the wording used and one concrete reason from the checklist in
`07-ai-agent-brief.md`. A rejection nobody wrote down is one somebody pays for
twice. Do not push a rejected plate to the inbox.

One plate per inbox branch and per landing commit keeps failures isolated. Do
not alter, recompress or colour-convert an approved master during delivery.
