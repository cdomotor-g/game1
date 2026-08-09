# 08 — Influences, and where they stop

The brief named three games: *Borderlands*, *Fallout* and *World of Warcraft*, together
with an explicit instruction to stay well clear of copyright infringement. Those two things
are compatible, but only if we are precise about what is being borrowed.

**This document is not legal advice.** It is a working standard designed to keep the
project comfortably inside the safe zone, well short of where the interesting legal
questions begin. Anything heading to a commercial print run should still get a proper
clearance review.

## The principle

> **Techniques are not owned. Expressions are.**

Nobody owns heavy black outlines, or worn salvaged industrial objects, or exaggerated
chunky proportions. Those are techniques, and several of them predate all three games by
centuries. What is owned is the *specific expression*: this character, this logo, this
mascot, this interface, this world, this name.

So we take the technique, and we source it from further back than the game that reminded
us of it. That is not a legal dodge — it genuinely produces better and more distinctive
work, because it skips the intermediary's stylistic fingerprints.

## What we take, and where we actually get it from

| Reminded us of | What we're actually after | Where it comes from |
|---|---|---|
| Borderlands | Heavy black contour, hand-inked interior hatching, flat colour under line | Woodcut and wood engraving — Dürer, Bewick, 1800s trade catalogues |
| Fallout | Salvage-industrial wear, make-do repair, printed ephemera as UI | Depression-era tool catalogues, WPA broadsides, patent drawings |
| World of Warcraft | Exaggerated proportion for silhouette readability, oversized props | Medieval manuscript illumination and heraldry, where the same exaggeration solves the same legibility problem |

Every right-hand entry is public domain and centuries old. The techniques we want are
available from the source, at higher quality, with no exposure.

## The three tests

Any asset must pass all three.

**1. The substitution test.** Could this asset be swapped into the game that inspired it
and go unnoticed? If yes, it is too close. Our objects should look wrong in all three of
those games.

**2. The description test.** Describe the asset out loud without naming any franchise. If
you cannot — if the only available description is "the Fallout thing" — there is no
independent design there yet.

**3. The reverse-image test.** Search the finished asset. If it returns a specific
copyrighted character, logo or promotional image, start again.

## Specific exclusions

Concrete, so there is nothing to interpret.

**Never draw:**

- Any mascot in the tradition of a smiling retro cartoon figure giving a thumbs-up, or any
  single recurring cartoon character used as a system mascot
- A wrist-mounted or handheld device with a monochrome green CRT interface
- Blue-and-yellow jumpsuits, numbered underground shelters, or vault-door iconography
- Fictional corporate logos rendered in a retro-futuristic branding idiom
- Class icons, faction crests or ability icons resembling any existing game's set
- Any weapon, armour or creature copied from a recognisable design — a specific silhouette
  is protectable even when the general object type is not
- Any typeface that is itself a franchise's identity, or a close imitation of one
- Runes, glyphs or scripts resembling an existing fictional writing system

**Never write:**

- Proper nouns from another setting — places, characters, organisations, deities, spells
- Any invented word close enough to an existing franchise's term to be mistaken for it
- Taglines, catchphrases or slogans from another work

## Peoples, and the one naming risk worth flagging

The five peoples are **humans, dwarves, elves, halflings and orcs**. Four of those are
folklore terms in the public domain, used across hundreds of unrelated works, and are not
a concern.

**`halfling` is worth a decision.** The word appears in Tolkien and has been treated
protectively by that estate; it is also long-established as generic in tabletop games. The
risk is low and it is a *naming* question rather than a visual one, so it sits outside this
document's scope — but it is cheap to change now and expensive to change after a print run,
so it belongs on the open-questions list rather than being quietly assumed. Generic
alternatives that lose nothing: *smallfolk*, *burrowfolk*, *hearthfolk*.

Visually, the risk is not the word at all — it is the rendition. Our dwarves must not be
any specific publisher's dwarves.

Give each people **one economic silhouette cue**, drawn from what they actually do in
`data/peoples.json`, rather than from the standard fantasy costume kit:

| People | Cue, drawn from their economy |
|---|---|
| Humans | Nothing exceptional — plain, mixed, unremarkable kit. Their trait is having no trait |
| Dwarves | Everything is carried on the body: lamp, harness, tool loops. Kit built for underground work |
| Elves | Cloth, not armour. Spun and woven textures, foraging bags, nothing metal |
| Halflings | Agricultural. Baskets, sacks, tools far too large for them, always carrying food |
| Orcs | Overbuilt and already breaking. Tools worn out at twice the rate, lashed back together |

Every one of those is derived from a mechanic, not from a genre convention, which is both
better design and independently ours.

## Model-generated content

The exposure profile is different for generated work, in two ways that matter.

**Prompts leak into output.** Naming a franchise in a prompt pulls its protected features
into the image — and this is true in a *negative* prompt too. The banned-words list in
[07-ai-agent-brief.md](07-ai-agent-brief.md#never-put-these-in-a-prompt) applies to every
field of a generation request.

**Never name a living artist.** Legal exposure, and increasingly a terms-of-service
violation on the major platforms.

**Copyrightability.** In several jurisdictions — the United States most clearly — purely
machine-generated images may not be protectable by copyright. For a game whose art is its
identity, that is a real commercial consideration, not a footnote. The practical response,
and the one this style guide is built around:

- Generated output is a **starting point**, not a deliverable
- Every asset gets meaningful human authorship: the separation into plates, the hand-built
  wash, the hatch assignment, the type, the frame, the grime pass
- Keep the accepted prompt and the edit history in `docs/art/prompts/`, which is both a
  provenance record and the thing that makes a restyle survivable

## Clearance checklist

Before any asset is committed:

- [ ] Passes the substitution, description and reverse-image tests
- [ ] Prompt named no franchise, studio, game or artist, in any field
- [ ] Contains no logo, wordmark, mascot, class icon or faction crest
- [ ] Contains no invented script or rune resembling an existing fictional writing system
- [ ] Contains no proper noun from another setting
- [ ] Any silhouette that closely tracks a specific existing design has been redrawn
- [ ] Prompt and provenance recorded in `docs/art/prompts/`
