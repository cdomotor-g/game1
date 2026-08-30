# monster-cinder-wolf — a redraw of an accepted plate, and what it cost

**This plate was accepted long ago.** The attempt below is not a candidate for it
and nothing here is under consideration. It is written down because it found three
faults at once, and none of them were the artist's.

Artist: ChatGPT, pointed at the repository, asked to "grab the first brief waiting
for you".

## What came back

A finished trading card. Not a plate — a card: a ruled frame, `CINDER WOLF` set as
a title, `MON-01 • BEAST`, an element mark in the corner, three stat icons with
their numbers, a `SMOLDER` rules box with rules text in it, and a flavour-text
panel. Every one of those is set by `tools/build-cards.mjs` from the data, over a
crop of the plate. Inside that frame: a snarling wolf with glowing orange eyes,
bared teeth, a blood-red sky, dead bare trees and a ruined castle on the skyline.

## Three faults, and the artist caused none of them

**1 · It drew a card because nothing told it not to.** The briefs said "no text, no
letters, no border rule" in the *negative* prompt and nowhere in the positive. A
negative prompt is a filter on an image model; an artist that reads and reasons
needs to be told what the thing IS. The preamble now opens with it, before the
style: *this is a PLATE, one whole drawn page, it is NOT a card, the frame and the
type are set by machine afterwards.*

**2 · It picked a finished subject because the file could not tell it apart.**
`## monster-cinder-wolf` looked exactly like a brief waiting to be drawn. The mint
queue knew MON-01 was complete; the brief did not, and the brief is what the artist
opens. Every brief section now carries a marker directly under its heading —
`ALREADY DRAWN` or `WAITING — THIS ONE IS YOURS` — computed by
`tools/build-prompts.mjs` from whether the plate is on disk. Nothing is stored, so
committing a PNG flips its marker on the next run.

**3 · It went theatrical because nothing said the tone.** The style had been fixed;
the mood never had. `grimdark` sat in the negative while the positive said nothing
about mood at all, so the model reached for the genre default. The preamble now
carries a tone paragraph, and the horror vocabulary — `glowing eyes`, `bared
fangs`, `blood-red sky`, `ruined castle`, `dead trees`, `movie poster` — is in the
negative.

## The lesson worth keeping

All three were the brief's fault and all three were invisible while the only test
was reading it. A brief is not proved by being well written; it is proved by what
somebody who has never seen this game draws from it. That is what this attempt
bought, and it is why it is filed rather than deleted.
