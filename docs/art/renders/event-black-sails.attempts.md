# event-black-sails — attempts

## Attempt 1 · 2026-11-08 · ACCEPTED

Artist: the paid OpenAI images API (`MINT_ARTIST=api`), gpt-image-2 at 2112 x 1408,
quality high, called by `node tools/mint-draw.mjs EVT-38` — the first plate drawn
through the paid route rather than Codex. Wording: the `--render` prompt, negative
list appended as "Leave out: …"; it is committed beside the plate as
`event-black-sails.txt`.

Usage, as the API counted it: 7,889 image tokens out (including two rough
previews of 100 tokens each, which the call streams so the line is never silent)
and 1,090 text tokens in. At gpt-image-2's price on 2026-11-08 — $30 per million
image tokens out, $5 per million text tokens in — that is $0.237 + $0.005, about
**$0.24** for the plate.

**Two calls failed before it, and neither was the artist's fault.** Both came back
"502 Bad Gateway" after about thirty seconds: the request went silent while the
picture was being drawn and the session's proxy closed it. Before that, Node's own
`fetch` had been going round the proxy altogether, so the key never reached
OpenAI. `mint-draw` now restarts itself with the proxy switched on and streams the
call. Whether OpenAI billed the two cut-off calls cannot be seen from here.

What came back: 2112 x 1408, A4 landscape 3:2, clears the 866 px floor and the
1299 px want. House style held — nib line, feathered hatching, thin washes over the
ink, slate sea and sky, rust hulls, ochre boom spars. Everything the subject names
is there: the river mouth as a refuge, about a dozen merchant hulls anchored close
inside with their sails furled, a boom of chained spars right across the entrance
made fast to a capstan on each shore, nothing loading, and three hulls under sail
in line beyond, carrying no colours on bare staffs. **The horizon sits in the top
sixth of the page** — the first plate in this deck to obey the high-horizon
wording.

Two small misses, neither judged a rejection:

- **Ship's boats alongside.** About eight small empty boats lie beside the
  anchored hulls. The brief did not name them, but they are a ship's own gear
  rather than an added prop, and they are empty and tied up, so they do not read
  as loading.
- **Not hull-down.** The three distant hulls stand fully above the horizon rather
  than with their hulls sunk below it. They still read as small, far and in line.
