# Instructions for agents

Read `CLAUDE.md` before changing this repository. It describes the sources of
truth, generated files, build order and the parts of `docs/` that GitHub Pages
publishes directly.

## Artist plate-minting runs

These instructions apply whenever the user asks an artist to draw, generate or
render plates from the mint queue. The user's run prompt only needs to name the
production line or subject and any override to the defaults below.

Work one plate at a time. If anything material is unclear, stop and ask rather
than guess. A user may explicitly authorise a continuous run; in that case,
complete and show each plate separately, then continue without waiting, while
still applying every selection and acceptance check below to each plate.

### Choose a subject from the live queue

1. Open `docs/art/mint/QUEUE.md`. It has separate `### 2 · DRAW — the
   artist` tables under `## Cards`, `## Maps` and `## Building tiles`.
2. Use the line the user named. `Buildings` and `building tiles` mean the
   Building tiles line. With no line or subject named, use Cards.
3. Take the top row of that line's DRAW table unless the user named a subject.
   Nothing outside the selected DRAW table is available merely because a brief
   exists; old finished briefs remain in the repository.
4. Open the matching `## <plate-id>` brief. Card briefs are in
   `docs/art/prompts/<deck>.md`, building-tile briefs are in
   `docs/art/prompts/buildingtiles.md`, and map briefs are in
   `docs/art/prompts/maps.md`.
5. The marker directly under the heading must say
   `WAITING — THIS ONE IS YOURS`. If it says
   `ALREADY DRAWN — DO NOT DRAW THIS`, stop and report that the queue and
   marker disagree. If the selected DRAW table is empty, say so and stop.
6. Before drawing, tell the user the subject and exact plate id selected.

### Assemble the image prompt without rewriting it

Read the entire subject block before generating anything. Use these three live
blocks, in this order, exactly as written:

1. `## Shared preamble` at the top of the prompt file.
2. The fenced block under `## <plate-id>`, including its `FRAMING`,
   `WINDOW` and `LABEL BAND` paragraphs.
3. `## Negative prompt` from the same file.

Do not paraphrase, improve, shorten, reinterpret or add to those blocks. If the
subject block opens by explaining what the thing is, that definition outranks
what its name might otherwise suggest. A `WINDOW` describes the portion that
survives the machine crop. A `LABEL BAND` identifies an area that will be
covered, so nothing essential or identifying may be placed there.

The exact style wording lives in the generated prompt blocks and
`data/artstyle.json`; do not create another style prompt from memory. The
plate should read as workaday and observed rather than staged, frightening or
heroic unless the live subject block explicitly requires otherwise. Monsters
are observed animals at a wary distance, performing ordinary behaviour rather
than posing for attack.

### A plate is artwork, not a card

Generate one whole drawn page of artwork and nothing else. Do not draw a card
frame, border rule, title, card code, stat icon, rules panel, flavour text, name
banner, caption or lettering of any kind. Those are added later by repository
tools over a crop of the plate. Artwork that resembles a finished card is
unusable.

The first words of `FRAMING` declare the required page shape, such as Square,
A4 portrait or Landscape 3:2. Deliver that exact shape and at least the long-side
pixel width required by the live brief. Width lost at generation cannot be
recovered later. Obey the complete `FRAMING`, `WINDOW` and `LABEL BAND`
contracts. If a subject is specified laid out or dismounted on its own, do not
show it fitted to, carried by or being used with another object.

### Reference sheet

Use an image attached to the conversation when one is supplied. Otherwise try:

`https://cdomotor-g.github.io/game1/art/style-reference.png`

If the reference cannot actually be seen, say so and draw from the live written
blocks anyway. Do not stop the run, invent what the reference looks like, or ask
the user to attach it again. The words define what to draw; the sheet is only a
visual check.

### Show and report the result

Unless the user has explicitly pre-authorised automatic continuation, show the
single completed image and wait. With every displayed plate report:

- exact plate id;
- pixel dimensions and page shape;
- whether the reference sheet was visible;
- any wording that had to change to obtain an acceptable result, quoted
  exactly. Normally this is “none” because the live blocks must be used verbatim.

Do not generate alternative versions unless the user asks for them.

### Approval and delivery

Generating a plate does not itself authorise a repository write. Unless the user
explicitly asked to ship/upload/commit the result or pre-authorised automatic
delivery for the run, show it in chat and wait for approval. Do not open a pull
request unless requested.

An approved plate goes to
`docs/art/renders/<plate-id>.png`, named exactly after the brief heading. Follow
`docs/art/AGENTS.md` for the master-file and byte-verification contract.

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
