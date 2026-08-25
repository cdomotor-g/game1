# Generated icons

Do not edit anything in this folder. Every file here is written by
`tools/build-icons.mjs` from `data/arcana.json` and `data/pricing.json` (the
mark paths) and `data/components.json` (how to draw one). Change a mark there
and re-run:

```bash
node tools/build-icons.mjs
```

| File | What it is |
| --- | --- |
| [`element-fire.svg`](element-fire.svg) | Fire — three tongues standing on the hearth line, rooted in it - a flame that floats is a seed |
| [`element-earth.svg`](element-earth.svg) | Earth — a stone on the ground line, and the ground going down in narrowing strata under it. water is these lines moving; earth is them holding still |
| [`element-water.svg`](element-water.svg) | Water — the ground line has become swell - three of them, and no ground at all |
| [`element-air.svg`](element-air.svg) | Air — three streamers, two of them curling off the end. nothing touches the ground |
| [`elements.svg`](elements.svg) | All four together, for the art docs and the rulebook |
| [`pricing-glut.svg`](pricing-glut.svg) | Glut — what does not sell rots |
| [`pricing-hype.svg`](pricing-hype.svg) | Hype — it is bought because it is going up |
| [`pricing-deplete.svg`](pricing-deplete.svg) | Depletion — the easy ore came out first |
| [`pricing.svg`](pricing.svg) | All three together — the key to the corner of every commodity token |

The **element** marks are stroked, never filled, on a 24-unit grid, and each one
is built on the same construction: a ground line, and what the element does to
it. The **pricing** marks share the grid and the weight and nothing else: there
are only three of them and they are held apart by silhouette, because at 5 mm in
the corner of a token the silhouette is all that survives. They are
deliberately **not** the alchemical triangles —
[`../04-iconography.md`](../04-iconography.md) bans borrowed real-world symbols
along with letterforms, and the triangles are the most borrowed symbols there are.

Both plates are present in every file, so `remove(#wash)` gives the
black-and-white edition and `tools/validate-art.mjs` can check them like any
other generated art.
