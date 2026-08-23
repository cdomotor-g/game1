---
description: Mint a card or a map end to end — brief, draw, aim, build, commit
argument-hint: MOD-01 | --deck modifications | a new fire monster, a cinder-crowned stag
---

You are the **designer** on a mint run in this repository.

The pipeline is `docs/MINT.md` and it is binding. `data/mint.json` declares the
line you are working. `docs/art/09-framing-and-composition.md` is the aim
contract for cards, `docs/map/README.md` for maps. Read what you need; do not
restate the rules back to the user.

**Subject:** $ARGUMENTS

## Work out what you were given

Run `node tools/mint-queue.mjs` first — it computes every subject's step from the
repository, so it is the only thing that knows where this run starts.

Then read the subject above as one of four things:

| It looks like | Do |
| --- | --- |
| a card code (`MOD-01`) or plate id | mint that one subject |
| `--deck <name>` or a code with a wildcard | mint that deck's subjects at DRAW, in order |
| a description of something that does not exist | create it first: the card into `data/<deck>.json` with a `cardCode` and a `name`, then its brief, then mint it |
| a map id | maps are generated, not commissioned — go to *Maps* below |

If it names something the queue does not know and does not read as a new subject,
say so and stop. Do not guess which card was meant.

## Cards

1. **Brief it if it has none.** An `## <plate-id>` section in the deck's prompt
   file under `docs/art/prompts/`. Four parts, all required: the shared preamble
   reference, the subject paragraph written from the card's own data, the negative
   prompt, and a `FRAMING.` block. The FRAMING block is the one that gets left out
   and it is the one that decides whether the plate is usable — name the head, the
   hands and the gear the card actually names, and say what margin stays clear.
2. **Draw it.** `node tools/mint-draw.mjs <code>`. If it degrades — no key, no
   route, a non-200 — it prints the commission instead and exits clean. Hand that
   to the user to paste into an image model, tell them the exact filename to save
   it as, and stop there. Do not pretend a plate exists.
3. **Aim it.** Read the plate. Check it against the acceptance checklist in
   `docs/art/07-ai-agent-brief.md`, then write `subject`, `focal` and `note` into
   `docs/art/framing.json`. `subject` is the veto — what may not be cut. `focal`
   is the aim — the one point the picture is of, a face or an eye. Both, always;
   a subject box alone centres the crop on a standing figure's sternum.
4. **Build and check** with the list at the foot of `CLAUDE.md`, in that order.
5. **Commit.** Re-run `node tools/mint-queue.mjs` and confirm it says minted.

## Maps

A map is **generated**, not commissioned: `node tools/draw-map.mjs <id>` fills
`rows` from the commission block and renders the plate. There is no artist and no
tracing. `node tools/validate-map.mjs` is the check that matters — it knows about
harbours inland and rail across unbridged rivers.

A map whose `plate.kind` is `"drawn"` is the old two-agent path and still works;
`tools/mint-request.mjs <id>` assembles its commission.

## Standing rules

- **Never hand-edit a generated file.** `docs/data/bundle.js`,
  `docs/design/14-annex.md`, `docs/cards/`, `docs/boards/`, `docs/book/`,
  `docs/mint/`, `docs/art/mint/QUEUE.md` and a generated `docs/map/*.svg` are all
  outputs. Run their tool.
- **Never edit a drawn plate.** `docs/art/renders/*.png` and a drawn
  `docs/map/*.png` are committed as supplied. Cropping happens at read time from
  numbers, which is why a printed card and a thumbnail cannot disagree.
- **Never add a terrain to make a map work.** `data/terrain.json` is the
  vocabulary. Waterside is a relationship read off the board, not a terrain.
- **Ask rather than invent.** If a subject cannot be briefed without a design
  decision the user has not made, ask them.
