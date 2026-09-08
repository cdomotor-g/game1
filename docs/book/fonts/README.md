# The book's faces

Latin subsets of nine SIL Open Font License faces, fetched from Google Fonts and
committed so the printed book sets the same way off disk, on the site and on a
machine with no network. Every one is OFL 1.1, which permits exactly this.

| Face | Where it is used | Source |
| --- | --- | --- |
| IM Fell DW Pica, and its SC | The running text of the whole book | Igino Marini, from Fell's Double Pica |
| IM Fell English, and its SC | Entry names, section heads, the card kickers | Igino Marini, from Fell's English |
| IM Fell Double Pica, IM Fell Great Primer | Title-page titles and the larger heads | Igino Marini |
| UnifrakturMaguntia | The grand heads — chapter titles, the annex numerals, the drop capitals | Peter Wiegel, j. 'mach' wust |
| Pirata One | Running heads on the catalogue sheets | Rodrigo Fuenzalida, Nicolas Massi |
| Pinyon Script, Tangerine | The calligraphic lines: a section's subtitle, a character's calling | Nicole Fally; Toshi Omagari |
| Alegreya Sans | Tables, the summary strips, anything a player reads for a number | Juan Pablo del Peral, Huerta Tipográfica |
| Oswald | The figures in the summary strips | Vernon Adams |

The Fell types are the house display face (docs/art/05-typography.md), and the
book's body is set in them because a rulebook that reads like a page out of the
game's own almanac is the whole art direction. Rules a player reads for a number
— tables, strips, figures — stay in the plain faces the typography guide asks
for.

`tools/build-book.mjs` writes the `@font-face` rules; nothing here is referenced
by hand. To refetch: the Google Fonts CSS2 API with a modern browser user-agent
returns per-subset `@font-face` blocks with woff2 URLs; take the `latin` block
of each face.
