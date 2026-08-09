# 04 — Iconography

The game needs roughly 300 distinct marks: 63 commodities, 15 tools, 51 buildings, 12
terrains, 11 deposits, 26 items, plus effort, coin, unrest, wear and the event effect
vocabulary. This document is what stops them drifting apart.

## The frame system

Every icon sits in a frame. The frame carries **what kind of thing this is**; the drawing
inside carries **which one**.

```
   ○  circle      commodity          ⬡  hexagon    terrain / place
   □  square      tool or item       ◇  diamond    deposit (what is buried)
   ⌂  house       building           ▭  banner     effort, coin, and other abstractions
```

Six frames, and they are load-bearing: a player who sees a diamond knows they are looking
at something buried before they have identified what.

**The frame is part of the ink plate.** It is drawn at contour weight, 0.5mm, and it is
the outermost line of the icon.

### The category hatch fills the frame

For commodities, the frame's interior is filled with the category hatch from
[`palette.json`](palette.json) — vertical for `material`, stipple for `food`, and so on.
The drawing sits on top of it, with a small bare-paper margin around the subject so it
never tangles with the hatch.

```
   ┌─────────────┐        the frame says:   commodity
   │ ░░░░░░░░░░░ │        the hatch says:   food
   │ ░░░ ▄▄▄ ░░░ │        the drawing says: bread
   │ ░░▐███▌░░░░ │        the wash says:    (ochre — nothing new)
   │ ░░░▀▀▀░░░░░ │
   └─────────────┘
```

That is the whole two-plate system in one 18mm chit: three independent ink-plate channels
carrying identity, and colour carrying nothing.

## Size tiers

Icons are drawn once and used at three sizes. Draw for the smallest one they will appear
at.

| Tier | Size | Detail budget |
|---|---|---|
| **Chit** | 12–18mm | Silhouette and frame only. No interior detail below 0.3mm. Max 8 distinct marks. |
| **Card** | 20–35mm | Full drawing, hatching, one wear mark, maker's mark. |
| **Plate** | 40mm+ | Everything, plus ground line and cast shadow. |

If an icon needs a separate simplified drawing for chit size, that is allowed and
expected — but it must be **the same silhouette**, not a different idea. Store it as
`{id}-chit.svg` alongside `{id}.svg`.

## Drawing the commodity set

63 commodities is where a set like this usually falls apart, because it is drawn over
weeks by different hands. Three rules keep it together:

**1. Draw the thing, not the process.** `flour` is a heap of flour with a scoop, not a
mill. `steel` is a billet, not a forge. The building already has its own icon; do not draw
it twice.

**2. Draw a countable unit.** These are tokens representing quantities. `logs` is a stack
of three logs, not a forest. `fish` is two fish, not a catch. If a player has six of them,
the icon should make sense multiplied by six.

**3. Related commodities share a base drawing.** This is what makes the production chain
visible on the table:

```
   grain  →  flour  →  bread
   ▟▙        ░░░       ▄▄▄        same wheat-ear mark appears on all three,
   sheaf     heap      loaf       shrinking as the good gets more refined

   iron-ore  →  pig-iron  →  steel  →  ironware
   ▲▼           ▬▬            ▬▬       ⚒          same billet silhouette,
   raw lump     rough bar     clean    formed     edges getting cleaner
```

A player should be able to see a chain in their stockpile without reading a card.

## Effort

Effort is the game's real currency and it gets the strongest, simplest mark in the set:
**tally strokes in a banner frame.**

```
   ▭ ▏▏▏▏     4 effort
   ▭ ▚▚▚▚ ▏   6 effort   (five-bar gate, then one)
```

Never a clock, never an hourglass, never a stopwatch. Those all imply a deadline; effort
is a quantity you spend, not time running out. The tally also matches how a player
actually tracks it at the table — scratched off as it goes.

**Effort dice.** Pips, not numerals, and the pip arrangement carries the die size in its
frame: d4 triangle, d6 square, d8 diamond, d10 pentagon, d12 hexagon. Peoples with a
different die (orcs roll d8, dwarves d8 underground) get the frame, which means a glance
at a player board tells you their die without a lookup.

## The effect vocabulary

`data/events.json` defines a typed effect vocabulary. Every effect type gets exactly one
glyph, used identically on every card that references it. A player learns 20 glyphs once
instead of re-reading 58 cards.

Semantic direction is carried by a **notch**, never by colour alone:

```
   ▲ notch-up      gain, surplus, success        (verdigris)
   ▬ notch-flat    cost, wear, a clock running   (ochre)
   ▼ notch-down    loss, unrest, damage          (oxide)
   ⟊ slip          arcane                        (bruise, mis-registered)
```

The notch is on the ink plate. The colour is on the wash plate and is redundant by design
— see [Law 1](01-two-plate-system.md#law-1--the-ink-plate-carries-everything).

## The maker's mark

Every building, tool and manufactured good carries a small stamped touchmark, 3–4mm, in a
consistent position — lower right of the drawing, angled slightly off square as though
struck by hand.

It is a genuine piece of production infrastructure, not decoration: it gives every asset a
fixed place to put an identifying glyph, it ties 150 unrelated objects together with one
recurring shape, and it is the natural home for a people's sigil when a component is
faction-specific.

Marks are built from a **restricted geometric alphabet** — no letters, no runes that read
as a real script:

```
   ◺  ◹  ⊿     wedges          extraction
   ⌇  ⌁        struck lines    forging, heat
   ⬒  ⬓        split squares   assembly, joinery
   ⊛  ✳        rayed marks     arcane (bruise only)
```

Avoid anything that resolves into a letterform or a recognisable real-world symbol. See
[08-influences-and-distance.md](08-influences-and-distance.md).

## Numerals on components

Quantities that must be read fast — effort costs, values, yields — are **numerals in a
banner**, not counted pips, above four. Pips are for dice.

Numerals sit on bare paper or on a knocked-out banner, never directly on a hatch. A number
on top of a 0.6mm hatch at 8pt is unreadable, and this is the most common way a
handsome-looking component turns out to be unusable at the table.

## What every icon must pass

- [ ] Recognisable at 18mm, filled solid black, next to five siblings
- [ ] Correct frame for its kind
- [ ] Correct category hatch, if it is a commodity
- [ ] Survives with the wash layer deleted
- [ ] Reads as a countable unit
- [ ] Shares its base drawing with its chain relatives, where it has any
- [ ] Contains no letterform, no real-world symbol, no existing game's glyph
- [ ] Maker's mark present, if it is a building, tool or manufactured good
