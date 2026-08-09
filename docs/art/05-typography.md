# 05 — Typography

Type is on the ink plate. All of it, always. There is no coloured text anywhere in this
game, printed or digital, except knocked-out white on a dark field.

## The one discipline that matters

> **Flavour text may have character. Rules text may not.**

The aesthetic wants worn, irregular, hand-set type. The game wants a player to read
"3 effort, 2 logs, requires a saw" correctly at arm's length in bad light while somebody
is talking to them. These are in direct conflict, and the resolution is to keep them in
separate typefaces and never let them mix.

| Role | Register | Never |
|---|---|---|
| Rules text, costs, yields, numerals | Plain, even, boring, legible | Distressed, condensed below 85%, italic |
| Names and headings | Characterful, worn, hand-set | Illegible at card size |
| Flavour and margin notes | As rough as you like | Carrying a rule |

A rule that is only in the flavour text is a rule that does not exist.

## The stack

Three faces. All are SIL Open Font License, so they can ship in the print files, in the
repo and in the web build without a licensing question.

**Display — `IM Fell English`**
Digitised from a worn 17th-century press face, complete with the ink spread and uneven
weight of the original metal. It is not a *simulation* of old printing; it is a scan of
it. That authenticity is the whole reason to use it, and it is doing more for the "dirty
rustic printed almanac" conceit than any texture overlay could.

Used for: component names, card titles, section headings, the game's own logotype.
Minimum 11pt — below that the ink spread closes up the counters and it turns to mud.

**Rules — `Alegreya Sans` (or any humanist sans with a large x-height)**
Warm enough not to fight the display face, plain enough to be read fast. Tabular figures
for anything that lines up in a column.

Used for: all rules text, all costs and yields, all card body copy, all UI.
Minimum 6pt. Below 8pt, drop to regular weight and open the tracking by 2%.

**Numerals — `Oswald`**
Condensed, industrial, and unmistakable at token size. Numbers on tokens and cards are
read at a glance more often than they are read carefully, and condensed numerals fit in a
banner without shrinking.

Used for: token values, effort costs, die faces, tracks, quantities on chits.

### Fallbacks

The web build has no dependencies and works straight off disk, so it must never block on a
webfont:

```css
--display: "IM Fell English", "Iowan Old Style", Georgia, "Times New Roman", serif;
--rules:   "Alegreya Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--nums:    "Oswald", "Roboto Condensed", "Arial Narrow", var(--rules);
```

## Setting rules text

- **Ranged left, never justified.** Justified text in a 40mm card column opens rivers that
  are worse than the ragged edge.
- **Line length 28–42 characters** on cards. Above 45 the eye loses the return.
- **Leading 1.35×.** Tight enough for a card, loose enough to survive a photocopy where
  the ink spreads.
- **No hyphenation.** Rewrite instead. If the text does not fit, the text is too long —
  card space is a design constraint, not a typesetting problem.
- **Sentence case.** ALL CAPS is for banners and single words only; it is materially
  slower to read and it eats card space.
- **Numerals before nouns, always**: "3 logs", never "logs ×3". Consistent scanning order
  across 200 cards is worth more than any individual phrasing.

## Hand-lettering and annotation

The [annotation motif](00-art-direction.md#motifs) — margin notes, crossed-out prices, a
previous owner's corrections — is where the game's voice lives.

Rules:

- **Annotations never carry a rule.** Ever. They are texture that happens to be readable.
- Set at a slight angle, 2–5°, and in a genuinely different hand from the printed text.
- Keep them **out of the safe margin** and away from anything a player needs to read.
- One per component at most. Two is a gag; three is a mess.
- They are on the ink plate at 70% tint, so they sit behind the printed text in the
  reading order.

Good: *"third pressing — the first two were eaten"* pencilled beside a bread card.
Bad: *"+1 if you have a granary"* pencilled anywhere.

## Type on the two plates

Because type is ink-plate only, it survives black-and-white mode untouched. Two
consequences to design around:

**Never set type over a full-strength dark wash.** Soot on `fuel` measures 1.70:1 — it
disappears. Either drop the wash to its `underInk` tint, or knock the type out to paper.
Knock-out is permitted for display type and banners; it is **never** permitted for rules
text, which must stay positive ink on light ground so it survives a photocopy.

**Type never relies on a coloured band to separate it from its neighbour.** Use a rule, a
gap or a frame — all of which are ink-plate — because in black-and-white mode the band is
gone.

## Sizes

Final print size, on a 63×88mm card.

| Element | Face | Size | Weight |
|---|---|---|---|
| Card title | Display | 13pt | regular |
| Card subtitle / kind | Rules | 7.5pt | medium, tracked +6% |
| Rules body | Rules | 8pt | regular |
| Cost and yield numerals | Numerals | 11pt | medium |
| Chit value | Numerals | 9pt | bold |
| Flavour | Display | 7.5pt | italic |
| Annotation | hand | ~8pt | — |
| Attribution and legal | Rules | 5.5pt | regular |

Anything below 6pt is decoration, not communication, and must not carry a rule.
