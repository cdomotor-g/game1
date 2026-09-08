# 15 — Campaign mode, and Homer's Odyssey

The game has had one way to be played: set out a board, deal the characters,
shuffle every deck, and see what twenty-four rounds of the economy and the
event deck do to you. That is **free play**, and it is now named, because there
is a second way. A **campaign** lays a storyline over the same game. The
economy, the market, travel and battle run exactly as before; what changes is
that one deck is read *in order* rather than shuffled, and it says where the
party is and what happens there.

{{fig:plate:character-chr-09,plate:monster-polyphemus,plate:character-chr-16,plate:monster-scylla|frieze}}

Both modes, every campaign, and the campaign deck live in one file,
[`data/campaigns.json`](../../data/campaigns.json), the way a price lives in
`pricing.json`. The first campaign is **Homer's Odyssey**.

## What a campaign is made of

{{fig:card:CHR-10,card:MON-17|Eurylochus and Scylla, full citizens of their decks, the ship in each corner.}}

A campaign brings things with it, and every one of them is a full citizen of
its own deck:

| It brings | Where it lives | In free play |
| --- | --- | --- |
| Characters — the cast | `characters.json`, tagged `campaign` | A character card like any other: a player may take Circe at setup |
| Monsters | `monsters.json`, tagged `campaign` | A monster card like any other: a discovery roll on deep water can turn up Scylla |
| A board | `data/maps/<id>.json` | A board like any other |
| The cards | `campaigns.json` `cards`, prefix **CAM** | Not dealt at all — the order is the only thing that is the campaign's |

The tag changes nothing about how a card plays. It is there so that the
explorer and the annex can say where a card came from, and so that
`validate-data.mjs` can insist that a campaign deals only characters who
belong to it. Nothing about free play was touched to make room for this:
Odysseus has a summary strip, Polyphemus has a P box, and the Wine-Dark Sea
has settlements with harbours.

{{fig:icon:campaign-homers-odyssey|margin|The Odyssey's mark: a black ship under a square sail.}}

**Every card a campaign brings carries the campaign's mark** beside its card
code, in the top right corner — the Odyssey's is a black ship under a square
sail. It is there so a table setting the campaign out can pull the cast and the
monsters out of the free-play decks by the corner alone, and so a free-play
table can see at a glance which cards a story brought. The mark is data on the
campaign (`campaigns[].mark`, a path on the same 24-grid as the element marks),
how to draw it is `components.json marks.campaign`, and `tools/build-icons.mjs`
draws it into `docs/art/icons/`. The code itself does not change: `CHR-09` is
still `CHR-09`, and the mark is an addition to it rather than a replacement.

{{fig:plate:character-chr-21,plate:character-chr-20,plate:character-chr-19|Athena, Calypso and Circe: immortal, and not a people.}}

Three of the Odyssey's cast are gods or nymphs. They are not a *people* —
there is no immortal worker type, no immortal town — so their `people` field
says `immortal`, a value the reference check allows the way `mounted` is
allowed as a vehicle mode. They are characters and nothing else.

## The campaign deck

{{fig:plate:character-chr-18|margin|Nausicaa on the Phaeacian shore, where xenia is kept.}}

A campaign card is neither accepted nor declined, which is what makes it not a
quest. (The quest deck's staged quests are called *campaign quests* in
`quests.json`, from before this file existed; they are a quest with stages,
taken or left, and they stay what they are.) A campaign card is turned when the
story reaches it, and it carries:

- **told** — the story as its source tells it, in a few sentences. It is the
  reason the card exists and it is printed across the panel.
- **play** — what the table does, in the vocabulary the game already has: a
  leg, a discovery roll, the encounter board, blue dice against red.
- **cost** — what it takes from the party, printed beside the rule.
- **lesson** — one thing to take away. In the rulebook and the explorer, not on
  the face; a deck shares one window and the wordiest card sets it.
- **xenia** — whether guest-friendship was kept or broken here. The game has a
  rule for hospitality already (an inn, a bed, a gift), and the Odyssey is the
  poem about it.

{{fig:plate:monster-charybdis|margin|Charybdis: the card says which way Odysseus steered, and the table steers it too.}}

**A card never offers a fork the poem did not take.** Where Odysseus chose,
the card says what he chose and the table does the same. What the dice decide
is the *price* — men lost, health lost, rounds spent — never the outcome. A
chapter that goes wrong at the table is replayed from its first line with the
losses kept. The story has one ending, and the table is learning it, not
writing it.

## Homer's Odyssey

Twenty-two cards, in the order the voyage happened. The poem does not tell it
that way: it opens on Ithaca in the tenth year with the son and the suitors
(Books I–IV), finds Odysseus on Calypso's island (V), brings him to the
Phaeacians (VI–VIII), and only then lets him tell the wanderings himself, in
one night, at their court (IX–XII) — before the second half on Ithaca
(XIII–XXIV). The deck marks both of those seams: card 14 is where the poem
begins, and card 16 is the night cards 1 to 12 are told. A table that finishes
the deck knows the events in order *and* knows the poem's shape.

| Act | Books | Cards | The players are |
| --- | --- | --- | --- |
| I — The Wanderings | IX–XII | 1–12 | Odysseus and his named companions |
| II — The Household | I–VIII, XIII–XXIV | 13–22 | Odysseus; and Telemachus, Penelope, Athena as Mentor, Eumaeus |

{{fig:plate:monster-laestrygonian|margin|The Laestrygonian, in whose harbour eleven ships go down.}}

**The fleet** is the one piece of furniture the campaign adds, and it is a
piece the table already owns: a spare player board whose health track counts
ships, from twelve, and whose pace track is the rowers. Six men lost is a rung
off the pace, because Homer's losses are exact — six from each ship at
Ismarus, six to the Cyclops, six to Scylla — and a slower ship is what the
table feels for each of them. Eleven ships go down in one harbour; the last is
struck by a thunderbolt off Thrinacia, and that is the end of Act I.

{{fig:plate:character-chr-10,plate:character-chr-11,plate:character-chr-12,plate:character-chr-13,plate:character-chr-14|The named companions, every one of whom the story takes.}}

**Every companion dies**, because in the poem every companion dies, and the
campaign says why: Homer names the cattle of the Sun, in his first ten lines,
as the crime that cost the crew their homecoming. A player whose companion the
story takes deals the next; when Act I ends, every player but Odysseus's takes
up the household. Homer runs the Telemachy beside the wanderings, and so does
the deck: while Odysseus sits three rounds on Ogygia, the other players are in
Ithaca watching the suitors eat the herds.

{{fig:plate:character-chr-15,plate:character-chr-17,plate:character-chr-22|The household of Act II: the son, the swineherd and the suitor eating the herds.}}

**The Wine-Dark Sea** (`data/maps/wine-dark-sea.json`) is a generated board.
The real coast — Troy, Ismarus, Cape Malea, Pylos, Sparta, Ithaca — is placed
where it is; everything west of Malea is where the poem puts it, which is
nowhere a sailor could find, so the islands of the wanderings are laid out in
the order the ship reaches them, sweeping south and west and back, and a fleet
following the cards traces the voyage across the table. The Cimmerians, on whom
the sun never shines, are at the western edge of the paper. In free play it is
a sea board with a mainland down one side, which neither of the other two is.

{{fig:plate:monster-sirens|margin|The Sirens, passed by wit: the crew's ears stopped, the captain bound.}}

**What it teaches** is listed on the campaign itself (`teaches`) and printed
in the annex: the places in order with their book numbers; that the poem is
told *in medias res*; that xenia is its moral measure; that Odysseus wins by
wit and loses by pride; why the crew die and he does not; and the recognitions
of the second half — the son, the dog, the nurse, the wife, the father — each by
its own token.

The full deck, the cast and the monsters are in [14-annex.md](14-annex.md)
under *Campaign deck*, generated from the data.

## Adding a campaign

{{fig:graph:dependencies|wide|The web the validator checks; a second campaign is more lines in it and no new rule.}}

A second campaign is an entry under `campaigns`, its cards under `cards` with
its id in their `campaign` field, its cast and monsters added to their own
decks with the same tag, and its board in `data/maps/`. `validate-data.mjs`
insists the chapters run 1, 2, 3 with no hole, that every card names a region
on the campaign's board, and that everyone the campaign deals is tagged as its
own. Nothing else has to change: the explorer's Campaign tab, the annex, the
card builder and the mint queue all read the file.
