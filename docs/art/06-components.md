# 06 — Applying it to components

Component-by-component styling, against the bill of materials in
[`docs/design/08-components.md`](../design/08-components.md).

## Event cards — 63 × 88mm

The most-seen art in the game, and the only place a scene is ever drawn.

```
┌──────────────────────────────┐  ← 3mm bleed, 4mm safe margin
│ ╔══════════════════════════╗ │
│ ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║ │  timber-and-iron frame, rivets at corners
│ ║  ▓   the art, 63×34mm  ▓ ║ │  one scene, wash beneath, ink on top
│ ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║ │
│ ║ ─────────────────────────║ │
│ ║  CARD TITLE              ║ │  display, 13pt
│ ║  scope · category        ║ │  rules, 7.5pt, tracked
│ ║                          ║ │
│ ║  ▼ effect glyph + text   ║ │  effect vocabulary, notch carries direction
│ ║  ▲ effect glyph + text   ║ │
│ ║                          ║ │
│ ║  ─ mitigation ──────────  ║ │  every card carries one — see design pillar 4
│ ║  "flavour line"          ║ │  display italic, 7.5pt
│ ╚══════════════════════════╝ │
└──────────────────────────────┘
```

**Category** sits in the top-left of the frame as a hatched tab, so a spread hand of cards
is sortable by category with the wash removed.

**Severity** is a row of notches on the right edge of the frame — one to three. Edge-read,
so it works in a fanned hand.

**Mitigation is always visually separated** by a rule. Design pillar 4 says every disaster
must be traceable to a decision the player could have made; the card layout should make
that promise before the text is read.

Arcane event cards get the [slip](01-two-plate-system.md#the-third-plate-the-slip). No
other card does.

## Commodity reference cards — 63 × 88mm

63 of them, and they double as the market price reference, so they are **information
design first and pictures second**.

- Large chit-style icon at the top, at plate size, with the category hatch behind it
- The category hatch also runs as a 4mm band down the left edge, so a sorted stack is
  readable from the side
- Value, bulk and category as a fixed three-cell table, same position on every card
- "Made from" and "makes" as [chain-linked](00-art-direction.md#motifs) icon rows — the
  production chain visible without reading a word
- Price band track along the bottom, 11 steps, marked with tally notches

## Recipe sheets — A4 or A5, double-sided

83 recipes, grouped into eight sheets by category, as
[`08-components.md`](../design/08-components.md) suggests.

These are the most likely component to be **photocopied and reprinted mid-campaign**, so
they are the strictest black-and-white test in the box. Design them ink-only and add wash
afterwards; if adding the wash improves comprehension at all, the ink version was
underspecified.

Rows alternate bare paper and 12% soot tint — the palest permitted tint, which is exactly
what a banded table needs.

## Hex tiles — 60mm across flats

> **Shelved — [#18](https://github.com/cdomotor-g/game1/issues/18).** No tile art is being commissioned. The contract
> below is the right one and is kept for the day a tile set is made; the board in
> production is a drawn map plate, whose art contract is the seven traceability
> rules in [`../map/README.md`](../map/README.md).

- **Face:** terrain wash as a flat tint, ink-plate ground texture over it — tussocks,
  tree marks, contour hatching, ripple lines. Terrain identity is in the texture, not the
  colour.
- **Deposit slot** marked with a diamond outline, empty until surveyed.
- **Back:** bare paper with one printed lattice, and nothing else. It should look like the
  page before anything was printed on it. Every tile back is identical — an unexplored
  tile must give away nothing, and a back with any variation at all becomes a marked card.
- **Edges:** terrain runs to the bleed. No border, no keyline. Tiles that butt against
  each other should read as continuous ground.

## Player boards — A4 landscape

The largest flat area in the game and the easiest to overload. Five of them are drawn,
one per playable people, by `tools/build-board.mjs` into
[`../boards/`](../boards/index.html); the anatomy is in
[`08-components.md`](../design/08-components.md#the-player-board).

- The board is a **workbench**: sawn timber ground, iron-strapped edges, tracks routed
  into the surface. The grain and the seams are ink-plate tint at hairline weight, so
  they survive the black-and-white edition and never compete with a number
- Player colour appears only in the **border banding** and the **maker's mark** — the
  working surface stays neutral so the player's own tokens read against it. Even in the
  banding the colour is a wash and the people's **hatch** is struck over it on the ink
  plate, because the hatch is what identifies a player and the colour is a convenience
- **Card recesses**, not printed pictures of cards: a groove, corner brackets, and the
  name of what belongs there set faintly in the middle — which a card covers the moment
  one is played, and which is exactly when it stops being needed
- **Five numbered tracks up the middle**, drawn to the same convention as a card's edge
  bar and no other: numbered from the bottom, walked by a bar token, harm in oxide,
  capacity in slate, mana in bruise. The board is not allowed a second convention, so a
  player who has learned to read a card has already learned to read the board
- Every fifth rung **rules heavier and sets its number bold** — the
  [tally motif](00-art-direction.md#motifs) doing component duty. It is what lets a
  player read 12 without counting to 12
- A **seat** below each ladder: a dashed ring where the token lives at nothing. A card
  bar has nowhere to put a token at zero and does not need one; a board does, or the
  token ends up on the table
- A column is 10.8 mm wide and BURDEN is six letters, so the head sets the **letter**
  at full size with the **word running up beside it** and the unit under it. Nothing on
  the board drops below the 6 pt floor in `palette.json`
- Mana is the only arcane subject on the sheet, so it is the only thing that takes the
  [slip](01-two-plate-system.md#the-third-plate-the-slip) — well inside the 3% ration

Still to come, and belonging to the settlement half of the game rather than the hero's:

- Effort pool as a tally track
- Unrest as a track that darkens with hatch density, not with colour
- Stockpile grid cells carrying the **category hatch**, so a cube in the right cell is
  double-coded even before the player's colour is considered

## Tool cards — the fiddly ones

[`08-components.md`](../design/08-components.md) flags these as the component most worth
prototyping early, and the art can carry some of that load.

Durability is **notches along the haft**, filled as they are spent. Combined with a sliding
marker this gives a readout that works even when the marker is knocked off — which it will
be. It is also the [tally motif](00-art-direction.md#motifs) doing component duty.

## The adventure decks — vehicles, monsters, characters, talismans

Four decks share one anatomy, so a bar never needs explaining twice:

- **Vertical numbered bars**, numbered from the bottom, walked by a token.
- **Harm on the LEFT edge** — a vehicle's damage, a monster's or character's health.
  Bar rules in oxide; the ink-plate mark is the notch-down.
- **Capacity on the RIGHT edge** — a vehicle's cargo, a character's burden in kilograms,
  a talisman's or character's mana. Cargo and burden bars rule in slate; mana bars in
  bruise (talismans and mana are arcane subjects, and the only cards in these decks
  permitted the slip).
- **A second capacity comes inboard, onto the portrait.** A character has burden and may
  also have mana, and the edge holds one bar. Burden keeps the edge — every character has
  one — and the mana bar moves in over the plate, laying down its own paper first so the
  ladder is read off paper and not off a drawing. That paper is wash, which costs the
  black-and-white edition nothing: the portrait is wash too, so the ink plate has bare
  paper there already. The inboard bar stops at the foot of the portrait window, because
  below that the rules text is already using the width.
- **A bar that counts something names its unit**, on a second, smaller label line under
  the first. `BURDEN` over `kg`; a bar counting hit points or charges needs no line.
- **Portrait across the middle, name and card code at the top, story text low.** The
  card code (`VEH-03`, `MON-09`) sets in the same small caps as a maker's mark.

A card with no bar on an edge leaves the edge quiet — the frame does not print an empty
track. In black-and-white the bars survive as ruled, numbered ladders; the wash only
ever repeats what the numbering already says.

## Tokens, cubes and meeples

- **Commodity chits:** 18mm, category hatch fills the frame, icon on top, value numeral in
  a corner banner. Chit-tier detail budget only.
- **If generic cubes win instead of printed chits** — the open question in
  `08-components.md` — the hatch system moves to the player-board grid, where each cell
  carries its category's hatch. The cube supplies colour; the printed cell supplies the
  identity. That is the two-plate system applied to physical components, and it is a
  genuine argument in favour of the cube option.
- **Meeples:** silhouette does the work, since they are unprinted. Worker, specialist and
  soldier must be distinguishable **by outline alone in a dark room**, not by size.

## The print-and-play edition

Not an afterthought — it is the mode the two-plate system exists for.

- Ships as the ink plate only, on A4 and US Letter, with crop marks
- Must print on a home mono laser printer with no settings changed
- Must survive **one further photocopy generation** — the realistic worst case
- Minimum tint 12%, minimum line 0.15mm, no full-bleed backgrounds anywhere: a
  print-and-play sheet that dumps a third of a toner cartridge onto tile backs is a
  hostile deliverable
- Tile backs print as the lattice only

The adventure decks have their half of this built:
[`docs/cards/print.html`](../cards/print.html) sheets the generated card fronts at true
size with a cut line round each card. It prints the colour edition — the ink-plate-only
sheet described above is still to come.

## The web build

`docs/css/app.css` is already close in spirit. See
[02-palette.md](02-palette.md#the-digital-build) for the variable mapping.

Two carried-over rules, and one screen-only allowance:

- **Semantic colour always pairs with a mark.** A log line that is only green is a log
  line one player in twelve cannot read.
- **Category colour never carries category.** The explorer labels a category; it does not
  merely tint it.
- **The dark theme inverts rather than extends.** Paper becomes soot, ink becomes tallow,
  the five inks lighten to hold contrast. It is a screen mode with no print equivalent, so
  it is exempt from the two-plate laws — but not from the marks.

## Generated components

`08-components.md` proposes a generator that renders card fronts from `data/*.json`, which
would keep printed components honest against the rules automatically, the way the web
explorer already is.

The two-plate system is what makes that generator tractable, because it turns "render a
card" into a small number of independent, testable jobs:

```
data/*.json  ──►  layout  ──►  <g id="wash">  ──►  colour PDF
                          └─►  <g id="ink">   ──►  mono PDF  (ink only)
                          └─►  <g id="grime">
```

Both PDFs come from one layout pass, and the mono edition is produced by dropping two
groups — not by a second design effort. The example files in
[`examples/`](examples/) are hand-built to that exact contract, so they double as the
generator's target output.
