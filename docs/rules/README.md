# The rules chapters

Book I of the printed book, one chapter per file, in filename order. These are the
only pages of the book a table needs to play from, and they are the only pages
written by hand: every annex after them is generated from `data/*.json` by
`tools/build-book.mjs`, and the design notes at the back are `docs/design/`.

**A finding against a chapter goes in `docs/review/`, not in the chapter.** That
folder is Addendum I of the book — what an adversarial reading found, one
`### R-nn` finding at a time with a severity and a status, and a `### P-nn`
proposal for each one that needs a decision. It resolves the same tokens as a
chapter and is written to the same standard, but it is not rules: a proposal
becomes a rule only when the data carries it and a chapter says it, and the
finding is then marked Corrected rather than deleted.

**A chapter says what the rule is, never why.** The history of a rule — what it
replaced, what went wrong the first time — lives in `docs/design/`, and a rulebook
that opened with it was the thing this split fixed. Present tense, second person,
procedures as numbered steps, lookups as tables, and a two-sentence lede under
the title that the book sets as a standfirst.

**No number is typed.** A tunable constant is a token the build resolves from the
data, so the chapter cannot print a figure the data has moved on from:

```
{{rules.wear.perUse}}                          -> 1
{{count:monsters.monsters}}                    -> 19
{{pct:rules.market.buySpread}}                 -> 15%
{{peoples.peoples[id=elf].manaStorage.innate}} -> 3
{{rules.market.priceBands}}                    -> 0.5, 0.75, 1, 1.25, 1.5, 2
```

The first segment is a dataset key from `data/manifest.json`; then dotted keys,
`[n]` for an index, `[id=value]` to pick an element by id. Only a number, a string
or a flat array of them resolves; anything else, or a path that does not exist,
fails `node tools/build-book.mjs` naming the chapter and the token.

**A picture is a token too.** A chapter puts art on its page with a `{{fig:…}}`
line of its own, and the build resolves it against the index of every picture
the repository already has — `tools/lib/book-art.mjs` — and fails on one it does
not:

```
{{fig:monster:cinder-wolf}}                                   a margin figure, captioned with the thing's name
{{fig:board:ledger|wide|The price ledger, one column a commodity.}}   a size and a caption
{{fig:people:human,people:dwarf,people:elf|The peoples.}}     several refs make a row
{{fig:character:chr-03,monster:ash-drake,tool:axe|frieze}}    the row under the chapter head
```

A ref is `plate:<plate-id>`, `card:<CODE>`, `tile:<building>`, `flow:<building>`,
`icon:<name>`, `board:player|market|depletion|ledger`, `map:<id>`, `terrain:<id>`,
or the shorthand `<kind>:<id>` — `monster:cinder-wolf`, `building:granary`,
`item:lantern`, `event:raiders` — which is the plate if drawn and the card if not.
Sizes are `margin` (the default, 42 mm, right of the text), `third`, `half`,
`wide` and `frieze`. A caption is one clause in the book's voice. What a chapter
does not illustrate the build does: the things its paragraphs name most get a
small vignette at their first mention, so no page of the book is bare.

**What the data leaves undecided is not filled in.** Where a table would be stuck
and nothing in `data/` or `docs/design/` decides it, a chapter says so in one
blockquote — `> **Open.** …` — and the book sets it apart. There are a handful; the
build does not mind them, and a rule that closes one is a rule that removes it.

**The markdown is the small dialect `tools/lib/docpage.mjs` renders**: ATX
headings (`#` once, then `##` and `###`), paragraphs, flat lists, pipe tables,
fenced code, blockquotes, images, links, bold, italic. Cross-reference another
chapter by its filename — `[The round](04-the-round.md)` — and the book turns it
into an anchor. An element mark is `![fire](../art/icons/element-fire.svg)`.

After editing, `node tools/build-book.mjs` and commit `docs/book/index.html` with
the chapter; CI fails on a stale page. `node tools/book-proof.mjs rules` prints
Book I to a PDF so it can be looked at.
