# The card mint

How a card goes from an idea to a printable card, on the web page and in the
rulebook, with two agents doing the work and a pull request as the workbench.

The short version: **a card is minted in four steps, each step is owned by
exactly one pair of hands, and which step a card is on is computed from the
repository rather than tracked by anybody.**

```
   data/*.json          docs/art/prompts/       docs/art/renders/     docs/art/framing.json
   the card exists  ──▶ the brief exists   ──▶  the plate exists ──▶  the crop is aimed  ──▶  MINTED
        │                     │                       │                      │
     designer              designer                 artist                designer
                                                                    (whoever accepts it)
```

Run `node tools/mint-queue.mjs` at any time. It reads the data, the prompt files,
the renders folder and the framing entries, works out where every card has got
to, and writes the worklist to [`art/mint/QUEUE.md`](art/mint/QUEUE.md). Nothing
about a card's status is stored anywhere; there is no board to fall out of date,
because there is no board.

## The two agents

| | **Designer** | **Artist** |
| --- | --- | --- |
| Default | Claude Code, in this repository | ChatGPT, or any image model |
| Owns | `data/`, `docs/art/prompts/`, `docs/art/framing.json`, every tool | `docs/art/renders/*.png` |
| Cannot | draw | change the rules |

The split is real, not ceremonial. The designer can write a perfect brief and
cannot produce a plate; the artist can produce a beautiful plate and has no idea
what a burden bar is. Neither can finish a card alone, which is why the handover
has to be written down.

## Where the handover happens

**One pull request per minting run**, on a branch named `mint/<what>` — say
`mint/dragons-and-airships`. Both agents work on that one branch and talk in its
comment thread. The PR is the workbench: the brief is posted on it, the plate is
pushed to it, the finished cards are built on it, and the whole exchange is
readable afterwards by whoever wonders why a card looks the way it does.

Two PRs and a cross-posting protocol were the original sketch. One is better: the
branch is the shared state, the thread is the conversation, and neither agent has
to discover the other's PR number.

### The round trip

**1 · The designer opens the run.**

Adds or edits the cards in `data/`, writes a brief per subject into the deck's
file under `docs/art/prompts/`, runs the tools, pushes the branch and opens the
PR. Then posts one comment per subject — the commission:

```md
### MINT REQUEST · MON-13 · Vhalrik, the Cinder-Crowned

**plate id** `monster-vhalrik-the-cinder-crowned`
**save to**  `docs/art/renders/monster-vhalrik-the-cinder-crowned.png`
**format**   A4 portrait, 4000 px on the long side or better
**brief**    docs/art/prompts/monsters.md § monster-vhalrik-the-cinder-crowned

<the complete prompt, preamble and negative prompt included, pasted in full>

Reply on this thread with `PLATE READY · MON-13` when it is pushed.
```

The prompt is pasted **in full**, not linked. The artist should never have to
assemble a prompt out of three files, and a prompt that was actually used is
worth having in the thread verbatim.

**2 · The artist draws and pushes.**

Generates against the brief, checks it against the acceptance list in
[`art/07-ai-agent-brief.md`](art/07-ai-agent-brief.md) and the framing checklist
in [`art/09-framing-and-composition.md`](art/09-framing-and-composition.md),
commits the PNG to the branch — and, if the wording had to change to get an
acceptable render, the frozen wording alongside it as `<plate>.txt`. Then replies
on the same thread:

```md
PLATE READY · MON-13 · `docs/art/renders/monster-vhalrik-the-cinder-crowned.png`

Prompt changed: dropped "rearing" — it kept producing a heraldic pose.
Frozen wording committed as monster-vhalrik-the-cinder-crowned.txt
```

**3 · The designer frames, builds and merges.**

Pulls the branch, adds the plate's `subject`, `focal` and `note` to
`docs/art/framing.json`, runs the tools, commits the regenerated files, and
either accepts the plate or replies with what to change. When the queue says the
card is minted, it is minted: it is in `docs/cards/`, on the print sheet, in the
explorer and in the annex, all at once, because all four are generated from the
same data.

### Rejecting a plate

Reply on the subject's thread with `PLATE REJECTED · <code>` and **one** concrete
reason, taken from the acceptance checklist rather than from taste. "The subject
is against the top edge and there is no margin for the crop to slide in" is
actionable. "It doesn't feel right" is not, and if that is genuinely the problem
then the brief was wrong and the designer owns the fix.

## Running it as automation

Everything above is written to be done by two humans, two agents, or one of each,
because that is the only version that is definitely going to work. If it is
automated, the pieces are:

- Each agent subscribes to the PR. On this repository that is
  `subscribe_pr_activity`; the artist's side needs whatever the equivalent is.
- A comment beginning `MINT REQUEST ·` is the artist's work item; a comment
  beginning `PLATE READY ·` is the designer's. Both are prefixes on purpose: they
  are greppable, and an agent can ignore everything else in the thread.
- The designer's wake-up is: pull, run `node tools/mint-queue.mjs`, and act on
  whatever is at step 3. It does not need to parse the comment to know what to
  do — the repository already says.

That last point is the load-bearing one, and the reason the queue is computed
rather than tracked. **The comments are a notification, not a state machine.** If
a comment is missed, dropped, posted twice or posted out of order, the next run
of the tool still produces the correct worklist. Automating the notification is
then a convenience rather than a dependency, and can be added, removed or broken
without stranding a card half-minted.

## What a card actually needs

| Deck | Prompt file | Plate id | Plate |
| --- | --- | --- | --- |
| Characters | `characters.md` | `character-chr-06` | A4 portrait |
| Vehicles | `vehicles.md` | `vehicle-veh-14` | A4 landscape, 3:2 |
| Monsters | `monsters.md` | `monster-hoarwyrm` | A4 portrait |
| Talismans | `talismans.md` | `talisman-tal-03` | Square |
| Modifications | `modifications.md` | `modification-spinnaker` | Square |

The plate id is not a convention anyone has to remember: it is the `plateId`
template on each deck in [`../data/components.json`](../data/components.json), and
the card builder, the mint queue and the prompt files all resolve it through the
same function. Change the template and all three follow.

Decks with `minting: false` — spells, events, quests, items — are declared,
numbered and have card backs, and are simply not being illustrated yet. Flip the
flag to bring one into the queue.

## Before merging a mint run

```bash
node tools/validate-data.mjs    # the card is referentially sound
node tools/validate-art.mjs     # palette and the two-plate contract
node tools/build-icons.mjs      # element marks
node tools/build-data.mjs       # the explorer bundle
node tools/build-annex.mjs      # the printed annex
node tools/build-cards.mjs      # the cards themselves
node tools/build-book.mjs       # the rulebook
node tools/mint-queue.mjs       # the worklist
```

A card that reaches `main` without those re-run is a card the website and the
rulebook disagree about. The full list, in order, is in
[`../CLAUDE.md`](../CLAUDE.md).
