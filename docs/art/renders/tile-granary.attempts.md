# tile-granary — what was tried

Six drawn plates before one was accepted. This file exists so the seventh does
not repeat any of them: a rejection nobody wrote down is a rejection somebody
pays for twice. `tile-granary.txt` beside it is the wording the accepted plate
was drawn from; this is everything that did not work and why.

Model: `Qwen/Qwen-Image`, 1328×1328, `a100-large`.

| # | wording | seed | rejected for |
|---|---|---|---|
| 1 | v1 — brief's own clipped prose | 7 | `16/2` rendered top-right and a signature mark bottom-right; almost no colour run laid down; subject drawn to the full width of the page; ladder leaning on the eave instead of reaching the high hatch |
| 2 | v2 — prose rewrite, high hatch named, colour named per material | 21 | **accepted** — see below |
| 3 | v2 | 34 | wall washed rust-red, which is the brick-and-tile colour, not weatherboard; door back at ground level; sacks shrunk to nothing |
| 4 | v2 | 55 | colour over-saturated to bright orange and vivid green against a palette that is explicitly muted |
| 5 | v3 — "small in the frame", "wide field", "seen from some way off" | 101 | sky, horizon and a distant treeline; border rule; sacks gone |
| 6 | v3 | 202 | horizon strip along the top; sacks gone; colour washed out |
| 7 | v3 | 303 | a third of the page given over to sky; worst of the set |

## The two lessons that cost the most

**Asking for distance buys a landscape.** v2 said the ground runs to every edge
and got exactly that. v3 tried to fix the subject's *size* by saying "a wide
field, seen from some way off" — and the model correctly drew a wide field seen
from some way off, which means a horizon, a treeline and sky. Three plates went
that way before it was clear the phrase was the cause. Size and distance are not
the same request: say the subject is small **in the frame**, keep the viewpoint
close and tilted down, and never reach for a word that describes where the
*viewer* is standing.

**The die cuts what the crop cannot.** Three of the six were drawn to the full
width of the page. On a triad that is unusable below the shoulder line, and no
framing entry can rescue it — a triad's window is 0.99 against a square plate, so
the crop keeps essentially everything, including the parts the hexagon then trims
away. This is now derived and appended to every building-tile prompt
automatically (`envelopeNote`, `tools/lib/tiles.mjs`); run
`node tools/tile-envelope.mjs granary` to see the shape it is talking about.

## What the accepted plate still spends

Seed 21 is a good tile and it is not a perfect one. The store is drawn a little
larger on its page than a triad wants, and the die takes the wooden scoop
entirely along with the base of the outermost staddle stone on each side. Both
sacks, the ladder and the daylight gap under the floor are inside the cut. The
scoop is the one item on that plate the tile can afford to lose, which is why it
was accepted rather than redrawn — and it is also the clearest possible argument
for reading the envelope before briefing rather than after.
