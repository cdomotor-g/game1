# Worked examples

Reference implementations of the layer contract in
[../01-two-plate-system.md](../01-two-plate-system.md). Read the SVG source before
building a new asset — these are the target output, not just pictures of it.

Each `.svg` is the deliverable. The `.png` files are renders committed for preview in
markdown, and the `-mono.png` files are the black-and-white edition produced by deleting
two groups and nothing else.

## `01-two-plates.svg` — the system

An ale barrel drawn **once** in `<defs>`, then `<use>`d three times: ink plate alone, wash
plate alone, and the two registered. The file is its own proof — panels one and three
reference the identical `#barrel-ink` group.

Also carries the arcane slip shown with and without, all eleven category hatches split
down the middle (wash on the left, ink plate on the right), and the full palette.

Two details worth copying:

- The barrel's staves and shading are masked by `#barrel-body`, which subtracts the iron
  hoops. That is how the drawing stops at the bands without a paper knock-out, which is
  what keeps the ink plate genuinely one colour.
- The body wash is `#B7966D`, the 55% under-ink tint of `drink`. Only the cast shadow —
  which carries no linework — prints at full `#8A561C`. See the `underInk` rule in
  [`palette.json`](../palette.json).

## `02-event-card.svg` — a component

Hard Frost, straight out of `data/events.json`, at 63 × 88mm with 3mm bleed, drawn at
8 units to the millimetre. Shown as the ink plate alone and over the wash.

Everything a player needs is on the ink plate:

| Carried by | Not by |
|---|---|
| A hatched category tab | the tab's colour |
| Filled notches on the frame edge for severity | a severity colour |
| A notch inside each effect glyph for direction | red/green |
| A rule above the mitigation block | a tinted panel |

## Rendering

```bash
node tools/validate-art.mjs        # palette, layer contract, ink-plate monochrome
```

To regenerate the PNGs, render the SVG at `deviceScaleFactor: 2` in headless Chromium.
For the mono edition, strip the two groups first — this is the whole of it:

```js
doc.querySelectorAll('#wash, #slip').forEach(g => g.remove());
```

If producing the black-and-white version ever needs more than that line, the file is
wrong.

## A note on these two

They are drawn in vector by hand to specify the system precisely — the layer split, the
hatch spacing, the tint ladder, the component geometry. They are correct rather than
beautiful, and the illustration itself is a floor, not a target. Production art will be
drawn or generated against
[07-ai-agent-brief.md](../07-ai-agent-brief.md); what these files pin down is the
structure it has to arrive in.
