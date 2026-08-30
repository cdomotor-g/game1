# modification-sweep-rig — what was tried

One rejection and one acceptance. The rejection is the one that found the drift. This file exists so the
next attempt does not repeat it, and because the reason is not about this plate:
every brief in the repository had the same fault, and this is where it surfaced.

Artist: ChatGPT, working from `docs/art/prompts/modifications.md` as it read
before the style was corrected.

| # | wording | rejected for |
|---|---|---|
| 1 | the pre-`artstyle.json` preamble | Flat vector infographic. Thick even black outline round every shape, one solid green fill for the sail, mechanical ruled diagonals standing in for shading, three or four shapes and nothing else on the page. No hatching, no wash, no paper. |
| 2 | the corrected brief, written from `artstyle.json` | **accepted.** Nib line of varying weight, dense feathered hatching carrying all the tone, thin washes laid over the ink so the strokes read through, warm aged paper. Every named part present: the gooseneck pivot with its pin drawn out beside it, both spars end to end, the sail laced through worked eyelets, all four crew handles, the guy coil, and one panel in newer cloth. |

## It was drawn correctly, and that is the finding

The plate is not a bad reading of the brief. It is an exact one. The preamble it
was given asked, in the positive, for:

- `heavy uneven woodcut-style outlines` — it drew a heavy uniform outline
- `flat muted spot colour ... solid areas of colour with no blending` — it drew
  one flat fill per shape
- `bold readable silhouette` — it drew three shapes and stopped

Nothing in that prompt asked for a fine nib line, for dense hatching, or for a
translucent wash, because the words describing those had never been written down.
The accepted plates have all three — look at `character-chr-01.png` and
`modification-spinnaker.png`, the latter drawn from *this same brief file* — so
the briefs and the plates had been disagreeing for as long as both existed. Early
models papered over it by drawing an engraving whatever they were told. A literal
one stopped papering over it.

`character-chr-01.png` is also the reason `MOD-01` is worth looking at first: it
is the same register, it came out of this same file, and it is what a sweep rig
should have looked like.

## What changed because of it

The style moved to [`data/artstyle.json`](../../../data/artstyle.json) and is
written into every brief by `tools/build-prompts.mjs --check`, so there is one
copy instead of eleven. `woodcut`, `flat vector`, `flat colour fill`,
`thick uniform outline` and `bold outline` moved from the positive prompt to the
negative one.

## The correction worked

It was redrawn from the corrected brief and accepted first time. That was the
point of taking it first: it was the only plate in the queue with a known-bad
attempt against it, which made it the cheapest test of whether moving the style
into `artstyle.json` had actually fixed anything. It had. The same run carried
four more plates from the same file, all accepted, none of them showing the fault.

What that does NOT prove is that a flat-vector reading is impossible - only that
the words describing a nib, hatching and a translucent wash now exist in the
positive prompt where a literal model can find them. Keep the negative-prompt
bans on `woodcut`, `flat vector`, `flat colour fill`, `thick uniform outline`
and `bold outline`. They are cheap and they are what is holding the line.
