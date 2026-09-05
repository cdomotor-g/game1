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

**Three documents are binding and this one only points at them:** the brief
under the plate's own heading in `docs/art/prompts/<file>.md`, the acceptance
checklist in `docs/art/07-ai-agent-brief.md`, and the delivery contract in
`docs/art/AGENTS.md`. Nothing here restates them, so nothing here can disagree
with them.

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
   marker disagree. If it says `NOT FOR AN ARTIST`, the plate is drawn by a
   tool; take the next row. If the selected DRAW table is empty, say so and
   stop.
6. Before drawing, tell the user the subject, the exact plate id, the page
   shape and the pixel figure the marker names.

### Read the whole brief; give the image tool the depiction

There are two readers of a brief, and they are given different things. This is
the rule that was written down in two places as two different rules, and it is
one rule:

- **You, the artist, read all of it** — the `## Shared preamble`, the fenced
  block under `## <plate-id>` including its `FRAMING`, `WINDOW` and
  `LABEL BAND` paragraphs, and the `## Negative prompt`. Those three blocks are
  the brief. Do not paraphrase, improve, shorten, reinterpret or add to them.
  If the subject block opens by explaining what the thing is, that definition
  outranks what its name might otherwise suggest.
- **Your image tool gets the depiction only.** `FRAMING`, `WINDOW` and
  `LABEL BAND` are instructions to you about composition — where the subject
  must sit so the machine crop keeps it, which corner a name band will cover.
  Obey them by composing the picture; do not paste those paragraphs into the
  image prompt, because a model draws what it is told and has drawn a brief as
  paragraphs of text on the page. Likewise every sentence that only says what
  NOT to draw ("No text", "Never a thick outline") belongs with the negative
  list, not in the positive prompt. What goes in the positive prompt is the
  preamble's description of the medium, the subject paragraph, and the
  corner-of-the-page rule where a tile brief states one as a thing to draw.

`node tools/mint-request.mjs <code> --render` performs exactly that split and
prints what it moved; `--json` gives the same as one object with the plate id,
destination, page shape and pixel floor. If you can run it, use its output. If
you cannot, make the split yourself by the rule above and say so.

The exact style wording lives in the generated prompt blocks and
`data/artstyle.json`; do not create another style prompt from memory. The plate
should read as workaday and observed rather than staged, frightening or heroic
unless the live subject block explicitly requires otherwise. Monsters are
observed animals at a wary distance, performing ordinary behaviour rather than
posing for attack.

### A plate is artwork, not a card

Generate one whole drawn page of artwork and nothing else. Do not draw a card
frame, border rule, title, card code, stat icon, rules panel, flavour text, name
banner, caption or lettering of any kind. Those are added later by repository
tools over a crop of the plate. Artwork that resembles a finished card is
unusable.

The first words of `FRAMING` declare the required page shape, such as Square,
A4 portrait or Landscape 3:2. Deliver that exact shape. If a subject is
specified laid out or dismounted on its own, do not show it fitted to, carried
by or being used with another object.

### The size

The marker under the heading names the pixel floor for that plate, derived from
the card's safe area at the print scale `data/mint.json` declares — a card
plate must print cleanly at twice the card's size, for the rulebook's
half-page sections. Deliver the largest size the generator offers for the page
shape; every size in use today clears every floor. Never upscale to reach a
number, never downscale, never re-encode. A plate under the floor is refused at
delivery and the pixels cannot be added afterwards. The full rule and today's
figures are in `docs/art/AGENTS.md`.

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
- pixel dimensions and page shape, against the floor the marker named;
- whether the reference sheet was visible;
- any wording that had to change to obtain an acceptable result, quoted
  exactly. Normally this is “none” because the live blocks must be used verbatim.

Do not generate alternative versions unless the user asks for them. A rejected
attempt is written into `docs/art/renders/<plate-id>.attempts.md` with the
reason, as `docs/art/AGENTS.md` says.

### Approval and delivery

Generating a plate does not itself authorise a repository write. Unless the user
explicitly asked to ship/upload/commit the result or pre-authorised automatic
delivery for the run, show it in chat and wait for approval. Never open a pull
request, and never push to `main`.

**An approved plate is delivered to the inbox and nowhere else:** the file, as
`docs/art/renders/<plate-id>.png`, on a branch named `plate/<plate-id>`. That
push starts the landing workflow, which validates it, refuses it if it is
under its floor, builds, commits it to `main`, verifies the committed bytes and
deletes the branch. The whole procedure — including the three API calls it
takes with a connector, and the base64 rules — is in `docs/art/AGENTS.md`, and
that file is the contract.

Report the delivery as a push to the inbox, with the commit, the dimensions and
the SHA-256 of the file you read from disk. **Say "shipped" only when the
landing run has said `SHIPPED AND VERIFIED`** — its summary is in the Actions
tab under **Land plate**, and on success the inbox branch is gone and
`docs/art/mint/QUEUE.md` on `main` shows the subject at FRAME. A `PUT` that
returned 201 is a delivery, not a landing.

## Drawn artwork is not shipped when a commit merely succeeds

For any PNG added to `docs/art/renders/`, read `docs/art/AGENTS.md`. A plate is
shipped only when the source file and the blob read back from `main` are
byte-for-byte identical, the complete PNG passes `node tools/verify-plate.mjs`,
it clears its derived pixel floor, and the mint build passes. All of that is
one command, `node tools/ship-art.mjs <plate-id> <source.png>`, and the landing
workflow runs the same command; there is no other definition.

Do not reconstruct image bytes from Markdown, a browser preview, connector text
or a partially returned base64 payload. Do not report an artwork upload as
successful until `ship-art` has reached its final verified message, whether you
ran it or the landing workflow did.
