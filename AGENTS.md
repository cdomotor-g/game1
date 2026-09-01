# Instructions for agents

Read `CLAUDE.md` before changing this repository. It describes the sources of
truth, generated files, build order and the parts of `docs/` that GitHub Pages
publishes directly.

## Drawn artwork is not shipped when a commit merely succeeds

For any PNG added to `docs/art/renders/` or `docs/map/`, also read
`docs/art/AGENTS.md`. A plate is shipped only when the source file and the blob
read back from the target branch are byte-for-byte identical, the complete PNG
passes `node tools/verify-plate.mjs`, and the applicable mint build passes.

Use `node tools/ship-art.mjs <plate-id> <source.png>` when an authenticated Git
checkout is available. Do not reconstruct image bytes from Markdown, a browser
preview, connector text or a partially returned base64 payload. Do not report
an artwork upload as successful until the command reaches its final verified
message, or an equivalent GitHub-API upload has performed the same read-back,
SHA-256 comparison and full PNG validation.
