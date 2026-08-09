# 02 — Palette

Machine-readable source of truth: [`palette.json`](palette.json). If the two disagree, the
JSON wins and this file is stale.

## The whole palette

Five chromatic inks, one black, one paper. That is everything.

| | Name | Hex | CMYK | Greyscale | Belongs to |
|---|---|---|---|---|---|
| ▓ | **Soot** | `#1A1714` | 0/12/23/90 | 23 | the ink plate — the only line colour |
| ░ | **Tallow** | `#EDE4D1` | 0/4/12/7 | 229 | paper |
| ▓ | **Ochre** | `#C4882B` | 0/31/78/23 | 148 | grain, hearth, lamplight, coin |
| ▓ | **Oxide** | `#A33B26` | 0/64/77/36 | 93 | rust, brick, forge, blood |
| ▓ | **Verdigris** | `#4C7A61` | 38/0/20/52 | 112 | growth, pasture, weathered copper |
| ▓ | **Slate** | `#3C5A6E` | 45/18/0/57 | 86 | stone, water, cold, night |
| ▓ | **Bruise** | `#6B4C7D` | 14/39/0/51 | 88 | the arcane — **rationed** |

Everything else in the game is one of these five, tinted or shaded. There is no sixth ink.

### Why five and not more

Because five chromatic plates plus key is a cheap print run, reproduces predictably in
four-colour process, and — the real reason — a small palette is what makes 300 assets by
different hands look like one game. Every additional ink is a new way for two assets to
disagree.

Neutrals come from **tints of soot**, not from a grey ink:

| Tint | 85% | 70% | 55% | 40% | 25% | 12% |
|---|---|---|---|---|---|---|
| Hex | `#3D3630` | `#5F564C` | `#7F7568` | `#A0968A` | `#C0B7A9` | `#D8CEBE` |

Nothing lighter than 12% — it drops out on uncoated stock.

### Why these particular colours

Every one is a pigment that could plausibly exist in a settlement that digs, burns and
grows its own materials. Ochre is dirt. Oxide is rust. Verdigris is what copper does.
Soot is what fire leaves. They are all *things the game's own economy produces*, which is
why the palette feels like it belongs to the world rather than being chosen for it.

Bruise is the exception, and that is the point. It is the only colour you could not make
out of the contents of the commodity list. See [the ration rule](#the-arcane-ration).

## The eleven commodity categories

`data/commodities.json` sorts 63 goods into eleven categories.
[`08-components.md`](../design/08-components.md) proposes generic cubes in eleven category
colours. **Eleven reliably distinguishable colours do not exist** — not across
colour-blindness, not across cheap dye lots, and definitely not in greyscale.

So each category carries **a wash and a hatch**. The hatch is on the ink plate and is the
real identifier. The wash is a convenience for reading a table at a glance.

| Category | Wash | Hatch | Ink | Grey |
|---|---|---|---|---|
| `raw` | `#8C857A` | plain | soot 45% | 134 |
| `fuel` | `#463E36` | cross-hatch | soot 80% | 63 |
| `material` | `#8A3222` | vertical | oxide | 79 |
| `manufactured` | `#C4785E` | vertical, wide | oxide 55% | 139 |
| `textile` | `#8AAE98` | diagonal, wide | verdigris 50% | 166 |
| `food` | `#C4882B` | stipple | ochre | 148 |
| `drink` | `#8A561C` | stipple, dense | ochre, shaded | 98 |
| `livestock` | `#35594A` | diagonal | verdigris, shaded | 82 |
| `container` | `#C6B79A` | basket weave | soot 22% | 184 |
| `luxury` | `#7C9AAD` | horizontal | slate 55% | 150 |
| `arcane` | `#6B4C7D` | diagonal sinister | bruise | 88 |

Two deliberate relationships in that table:

- **`material` and `manufactured` are the same ink at different strengths.** One is made
  from the other. The palette shows the chain.
- **`container` is the palest thing in the game.** Barrels, crates and sacks are
  packaging. They should recede behind what is in them.

### The hatches

The hatch system is adapted from **Petra Sancta**, which printers have used since the
1630s to render heraldic colours in monochrome engraving. It is the historical solution to
exactly our problem, it is four centuries out of copyright, and it could not be more on
theme for a game that looks like a printed almanac.

```
  plain          vertical       vert. wide     horizontal     diagonal
  ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
  │        │     │││││││││     │ │ │ │ │ │     │────────│     │////////│
  │        │     │││││││││     │ │ │ │ │ │     │────────│     │////////│
  └────────┘     └────────┘     └────────┘     └────────┘     └────────┘
   raw            material       manufactured   luxury         livestock

  diag. wide     diag. sinister cross          stipple        stipple dense   basket
  ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
  │ / / / /│     │\\\\\\\\│     │┼┼┼┼┼┼┼┼│     │· · · · │     │········│     │▤▤▤▤▤▤▤▤│
  │ / / / /│     │\\\\\\\\│     │┼┼┼┼┼┼┼┼│     │· · · · │     │········│     │▤▤▤▤▤▤▤▤│
  └────────┘     └────────┘     └────────┘     └────────┘     └────────┘     └────────┘
   textile        arcane         fuel           food           drink          container
```

Spacing at 100% print scale: 0.6mm for dense, 1.2mm for wide, 0.15mm line weight, which is
the thinnest line that survives our print spec. Full values in `palette.json` under
`hatches`.

**The hatch fills the icon's frame, not the icon.** The drawing sits on top of it, clear.

## The arcane ration

> **Bruise appears on arcane subjects only.** Mana crystals, mana veins, arcane herbs,
> potions, the two arcane buildings, and arcane event cards. Nothing else, ever.

There are two mana veins on the entire board. Mana crystals are the scarcest thing in the
game. If violet is available for decoration, that scarcity becomes a number on a card
instead of something a player can feel from across the table.

Budget: **no more than 3% of the inked area** of any single component.

This is also the only colour permitted the [slip](01-two-plate-system.md#the-third-plate-the-slip).

## Peoples

Five players, five inks, one each. A player's markers are literally a single plate.

| People | Wash | Hatch | Contrast on paper |
|---|---|---|---|
| Humans | `#8A561C` ochre, shaded | stipple, dense | 4.85:1 |
| Dwarves | `#3C5A6E` slate | horizontal | 5.77:1 |
| Elves | `#4C7A61` verdigris | diagonal | 3.90:1 |
| Halflings | `#C4882B` ochre | stipple | 2.41:1 |
| Orcs | `#8A3222` oxide | vertical | 6.49:1 |

Humans and halflings share an ink at different shades, which is the weakest pair in the
set — it is the pair to separate hardest by hatch and by marker shape. Every player colour
must also be distinguishable by the shape of the marker, because two players' wooden bits
end up in the same pile at the end of every game.

## Terrain

Terrain is the largest printed area in the game. A full-strength ink across a 60mm hex is
both ugly and expensive, so every terrain wash is a tint.

| Terrain | Wash | | Terrain | Wash |
|---|---|---|---|---|
| Grassland | `#B9C9A8` | | Desert | `#DCC79C` |
| Forest | `#7E9E84` | | River bank | `#A8BCC0` |
| Hills | `#C3AE8A` | | Lake shore | `#9DB8C4` |
| Mountain | `#9AA3A8` | | Coast | `#8FAEBF` |
| Marsh | `#8E9478` | | Shallow water | `#7BA0B5` |
| Tundra | `#D2D3CE` | | Deep water | `#4E7189` |

The six water and cold terrains are all slate at increasing strength, so the map reads as
a depth gradient without any single tile needing to be labelled "deeper".

Terrain identity on the ink plate comes from **drawn ground texture** — tussocks, tree
marks, contour hatching, ripple lines — not from the wash. The unexplored tile back is
bare paper with a single printed lattice; it should look like the page before anything was
printed on it.

## Print rules

**Under-ink tinting.** A wash darker than greyscale 110 must drop to 55% wherever linework
sits on top of it. At full strength, soot line on the `fuel` wash measures 1.70:1 —
effectively invisible. At 55% it is 5.16:1. The `underInk` value is given on every
affected category in `palette.json`.

Affected: `fuel`, `material`, `drink`, `livestock`, `arcane`.

**The rest of the spec.**

| | |
|---|---|
| Minimum line weight | 0.15mm at final size |
| Minimum type size | 6pt rules text, 5.5pt legal |
| Minimum tint | 12% |
| Maximum total ink | 260% uncoated, 300% coated |
| Bleed | 3mm |
| Safe margin | 4mm cards, 6mm tiles |
| Registration tolerance | 0.3mm |

That last number is why the ink plate is self-sufficient. Never rely on two plates lining
up more precisely than 0.3mm.

**No gradients.** No airbrushed shading, drop shadows or glows, anywhere, on any plate.
Volume comes from hatching on the ink plate. Gradients band badly on uncoated stock, cost
money, and are the fastest available route to making this look like generic digital
fantasy art.

## The digital build

`web/css/app.css` currently uses a warm neutral scheme that is already close in spirit.
Aligning it to this palette is a small, contained change and an obvious follow-up — the
custom properties map almost one to one:

| CSS variable | Palette value |
|---|---|
| `--bg` | `paper.tallow` `#EDE4D1` |
| `--ink` | `ink.soot` `#1A1714` |
| `--accent` | `inks.ochre` shaded `#8A561C` |
| `--good` | `semantic.good` `#4C7A61` |
| `--warn` | `semantic.warn` `#C4882B` |
| `--bad` | `semantic.bad` `#A33B26` |

Two rules carry over to the screen unchanged:

- **Semantic colour always pairs with a mark.** `good`, `warn` and `bad` each carry a
  notch glyph in `palette.json`. A log line that is only green is a log line one player in
  twelve cannot read.
- **Category colour never carries category.** The explorer must label a category, not
  merely tint it.

The dark theme is the one place the system inverts rather than extends: paper becomes
soot, ink becomes tallow, and the five inks lighten to hold contrast. It is a screen mode
and it has no print equivalent, so it does not need to obey the two-plate laws — but it
does still need the marks.
