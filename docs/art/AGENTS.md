# Drawn plate delivery contract

This file applies to drawn artwork under `docs/art/` and supplements the root
`AGENTS.md` and `CLAUDE.md`.

## Master format

- The committed master is the original, full-resolution, lossless PNG.
- Prefer 8-bit sRGB and retain the brief's required pixel dimensions and aspect.
- Pixel dimensions are authoritative for print; DPI metadata is not.
- Never replace the master with a JPEG, WebP, chat preview or reduced copy.
- Web-sized WebP or AVIF files may be generated as derivatives, never as the
  source from which print pieces are built.

## Bytes, not appearances

Generated-image output must first exist as a complete local file or genuine file
attachment. A rendered preview proves appearance only; it does not supply safe
bytes for a repository upload. Never scrape a preview, paste base64 through a
conversation, decode bytes that are already binary, or rebuild a file from
connector text.

The repository has suffered both failure modes this rule prevents: a payload was
truncated in an automated API transfer, and `tile-timber-house.png` arrived as
600,064 bytes of high-entropy data after an apparent base64 round-trip.

## Shipping gate

With an authenticated checkout, use:

```bash
node tools/ship-art.mjs <plate-id> <source.png>
```

The command refuses a dirty worktree, validates the entire PNG before copying,
runs the mint build, commits and pushes, fetches the target branch, reads the
committed blob back through Git, compares its SHA-256 with the source and fully
validates the returned bytes. A failure at any point means **not shipped**.

If the available GitHub integration cannot run that command, the equivalent API
procedure is mandatory:

1. Read the original file bytes from a local file or attachment.
2. Validate the complete PNG and record its SHA-256.
3. Upload those bytes exactly once. Base64-encode once only if the endpoint
   explicitly requires base64.
4. Read the blob back from the new commit—not from the request payload.
5. Compare SHA-256 hashes and fully validate the returned PNG.
6. Run the applicable mint build and repository checks.
7. Report the commit and verified hash only after all checks pass.

GitHub accepting a commit, a plausible file size, a valid PNG signature or
readable dimensions are not sufficient. `node tools/verify-plate.mjs` validates
chunk boundaries, chunk CRCs, `IEND`, compressed image data and decoded length.

One approved plate per artwork commit keeps failures isolated. Do not alter,
recompress or colour-convert an approved master during delivery.
