# The book's faces

Latin subsets of five SIL Open Font License families, fetched from Google Fonts
and committed unmodified, so the printed book sets the same way off disk, on the
site and on a machine with no network. Every one is OFL 1.1, which permits
exactly this.

| Face | Where it is used | Source |
| --- | --- | --- |
| Merriweather, roman and italic | Everything that is read: the running text of every chapter, ledes, captions, the stories in the catalogue | Eben Sorkin, Sorkin Type |
| IM Fell English, its italic and its SC | Heads, entry names and the short labels over them; a title page's subtitle | Igino Marini, from Fell's English |
| IM Fell Great Primer | The large titles: the cover, the title pages, a chapter's title, the drop capitals | Igino Marini |
| Alegreya Sans | Tables, the summary strips, the facts of a catalogue entry - anything a player reads for a number | Juan Pablo del Peral, Huerta Tipográfica |
| Oswald | The figures in the summary strips | Vernon Adams |

**What is read is set plain.** The book used to run its text in IM Fell DW
Pica, its heads in blackletter and its subtitles in a copperplate script. It
looked the part and it read badly, worst of all for a young player: the Fell
types have only old-style figures, so a 1 is a small capital I and 10 reads IO in
a rulebook made of numbers, and the scan's ink spread closes the letters up at
text sizes - `docs/art/05-typography.md` already said so, and put rules text in a
plain face. Merriweather has a large x-height, open counters and lining figures;
at 9.8pt it looks bigger than the Fell did at 11.5 and fits more to the line.

**What is looked at keeps the almanac.** The Fell types stay for heads and titles,
in upper and lower case and never below 11pt. They have no lining figures of
their own, so `tools/build-book.mjs` builds each Fell family out of two files: the
Fell for letters and Merriweather for the digits (a `unicode-range` face, scaled to
the Fell's cap height with `size-adjust` and drawn at the head's light weight).
"4. Production Tick" and "Table 12" come out in the Fell with figures a reader can
read.

The Merriweather files are variable fonts - one file carries every weight from
light to black - and so is Oswald's. `tools/build-book.mjs` writes the
`@font-face` rules; nothing here is referenced by hand. To refetch: the Google
Fonts CSS2 API with a modern browser user-agent returns per-subset `@font-face`
blocks with woff2 URLs; take the `latin` block of each face.
