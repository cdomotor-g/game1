# Ambiguities and edge cases

Places where two careful tables would rule two ways. None of these stops a game; every one of them starts an argument, and an argument at the table is a rule the book failed to print. The *Open* notes the chapters already carry are re-examined here, because an interim rule is only worth printing if it holds.

### R-20 · How much the board sells in round one

**Severity** unclear · **Where** Setting up, *Prices at the start* · **Status** Corrected

**As printed.** The board sells at most what this round's red dice rolled, and the dice are first rolled in the Market phase at the end of round one. Before that, the cap was undefined: nothing, or anything.

**Fix.** The setup chapter now rolls two red dice for each commodity the first time its token is seated, before the first Market phase, and that is the board's stock until the market has been rolled. It is what the digital twin has always done.

### R-21 · Who goes first

**Severity** unclear · **Where** Setting up; The round · **Status** Open, with a proposal

**As printed.** Two chapters say the first player is not decided and tell the table to agree one. The first player draws the first event, spends hours first, buys from the board first — and from round {{events.deck.lateGame.round}} draws a second event card.

**Fix.** The poorest purse goes first: the character card printing the least coin, then the least health. It costs nothing and pays the player the deal handed the hardest start — P-12.

### R-22 · The leader, and the region a card hits

**Severity** unclear · **Where** Events, *What a card says* · **Status** Open, with a proposal

**As printed.** A crime card hits the leader; a local card hits a region, rolled for. Neither is defined. The interim rule counts victory points by the first chapter's count, which R-01 found does not exist yet, and numbers "the board's regions", which the drawn map prints — Korvane Reach names thirteen.

**Fix.** The leader is the player with the most points under P-01, ties to the fuller purse. A region is rolled on the discovery d20 against the regions the map prints, rerolling above the count — P-12.

### R-23 · Mana held past the top of the M track

**Severity** unclear · **Where** Mana, talismans, spells and potions, *Mana* · **Status** Proposed

**As printed.** Your M track may climb to the M on your card plus the M of every talisman in your slots. An elf holds {{peoples.peoples[id=elf].manaStorage.innate}}; a crystal phylactery holds {{items.items[id=talisman-crystal-phylactery].manaCapacity}}; there are four slots. An elf with four phylacteries may hold 43 on a track that stops at {{components.board.track.to}}.

**The problem.** The board is the game's ceiling, and every other number in the game was cut down to fit under it. This one was not, and the chapter tells a player to walk a token off the top of a printed track.

**Fix.** The top of the M track is the most mana any character holds, however many talismans it carries — P-13.

### R-24 · How a party fights

**Severity** unclear · **Where** Monsters and battle, *The battle roll*; *Fighting other players* · **Status** Proposed

**As printed.** Against a monster, "you" add up your strength, your gear and two dice, and the wound comes off "the loser's H track". Against another player, "each side totals its figures". A party of a hero, a soldier and a hireling meets a wolf: whether all three strengths are added, or one figure fights, and whose track takes the wound, the chapter does not say. The bandits result says an escort "rolls first", which is a third reading.

**The problem.** Under the totalling reading a party of four is unbeatable by anything in the deck, and hirelings become the whole of the combat game (R-18). Under the single-fighter reading an escort is a second body and nothing more. The two readings are not close.

**Fix.** One figure fights each exchange, named before the dice; every other fighting figure in the party adds one to the total; the wound lands on the fighter. An escort is the fighter in the first exchange, which is what "rolls first" meant — P-14.

### R-25 · Raiding a town with nobody in it

**Severity** unclear · **Where** Monsters and battle, *Fighting other players*; Events, *Raiders* · **Status** Proposed

**As printed.** Each side totals its figures; the winner takes {{pct:rules.conflict.lootFraction}} of the loser's stockpile. A town with no garrison and no hero totals nothing and rolls two red dice; a town has no H track for the wound to come off; and whether it can lose the roll at all, and what its attackers lose if it wins, is unsaid.

**Fix.** An undefended town is raided without a roll, and the wound of a defended one lands on the defending figure, as P-14 has it. A watchtower cancels the raid either way.

### R-26 · A stranger on the road

**Severity** unclear · **Where** Discovery and encounters, *Strangers* · **Status** Proposed

**As printed.** A stranger dealt from the character deck is run by the player to the left, and "what they want of you is theirs to say". That player may choose to have the stranger attack, rob, trade, or walk on, and nothing bounds the choice.

**Fix.** A short table for what a stranger is doing there, rolled by the player who runs them — P-16.

### R-27 · Flotsam

**Severity** nit · **Where** Discovery and encounters, *The results* · **Status** Proposed

**As printed.** Two bulk of one commodity "chosen at random" from a table of {{count:commodities.commodities}} rows, with no die named that reaches sixty-six.

**Fix.** Roll the discovery d20 for the tens and a d6 for the units, and read down the table, rerolling past its end — P-16.

### R-28 · A vehicle "in use"

**Severity** unclear · **Where** Trade and the market, *Moving goods* · **Status** Proposed

**As printed.** Upkeep is paid each round the vehicle is in use. A ship that sits at a harbour with a hold full of wine is either in use or laid up, and {{transport.modes[id=ship].upkeep}} coin a round turns on the word.

**Fix.** In use is any round it moves or holds cargo — P-16.

### R-29 · A dagger beside a sword

**Severity** unclear · **Where** Heroes, vehicles and gear, *Kit* · **Status** Proposed

**As printed.** A dagger sits in a slot with another weapon. Gear is "your weapon's battle number", singular; nothing says whether the dagger's +{{items.items[id=dagger].battle}} is added to the sword's, or whether both wear.

**Fix.** One weapon is swung in an exchange and one weapon wears; the dagger is the one you swing when the sword breaks — P-16.

### R-30 · The manor's fifth bed

**Severity** nit · **Where** People, food and unrest, *Workers* · **Status** Proposed

**As printed.** A manor lodges {{buildings.buildings[id=manor].housing}} workers and {{buildings.buildings[id=manor].specialistHousing}} specialist. A specialist is a trained worker, who already had a bed. Whether a manor lodges five, or four of whom one may be a specialist, is not said.

**Fix.** Five, and one of them must be a specialist — P-16.

### R-31 · What a figure carries

**Severity** unclear · **Where** Heroes, vehicles and gear, *Strength and what it carries* · **Status** Proposed

**As printed.** A figure shoulders strength × {{rules.carrying.kgPerStrength}} kilograms of items and coin. The figure table also gives every figure a *carries* number — a hero {{transport.figures[id=hero].carries}}, a merchant {{transport.figures[id=merchant].carries}} — in units of nothing the chapter names. It is bulk, the measure of cargo, but no rule says a figure may carry cargo at all.

**Fix.** A figure may shoulder that much bulk of goods as cargo, beside its kit — P-16.

### R-32 · A fifth soldier

**Severity** nit · **Where** People, food and unrest, *Soldiers* · **Status** Proposed

**As printed.** A barracks holds {{buildings.buildings[id=barracks].garrison}} soldiers without a bed of housing. Where the fifth lives, and whether a soldier on the road needs a bed at home, is not said.

**Fix.** A soldier past the garrison keeps the bed it had as a worker — P-16.

### R-33 · Which vehicle card

**Severity** unclear · **Where** Heroes, vehicles and gear, *Vehicles* · **Status** Open, with a proposal

**As printed.** Build a cart and draw from the vehicle deck until a cart turns up. The deck is small and its cards are not equal, so the draw hands one player a better cart than another for the same inputs.

**Fix.** Choose. The cards of a mode are the models a yard can build; a player building one names it — P-17.

### R-34 · The monster nobody finished

**Severity** unclear · **Where** Monsters and battle, *The battle roll* · **Status** Open; the interim rule holds

**As printed.** A monster neither fled nor felled waits on its hex at the health it has, as a lair.

**The reading.** The interim rule is the right one and should be promoted from an *Open* note to the rule, with one addition: a lair mends one health a round, so a dragon cannot be worn down over ten rounds by a party that walks away whenever it loses — P-17.

### R-35 · A trade across the map moves coin, and then what

**Severity** unclear · **Where** Trade and the market, *Who may trade with whom* · **Status** Proposed

**As printed.** Trading houses joined by a route trade "at any distance", and Farspeak strikes a bargain across the whole board. Whether the goods change hands where they lie, or arrive in the buyer's town, is not said, and a hundred bulk of stone that teleports is a haulage rule with a hole in it.

**Fix.** Coin moves at once; goods change owner where they stand, and the buyer hauls them — P-16.

### R-36 · The survey difficulty nobody rolls against

**Severity** unclear · **Where** The economy, *Deposits*; The map and travel, *Surveying* · **Status** Open, with a proposal

**As printed.** Every deposit carries a survey difficulty, from {{deposits.deposits[id=clay-bed].surveyDifficulty}} for a clay bed to {{deposits.deposits[id=mana-vein].surveyDifficulty}} for a mana vein; the survey rule rolls a d6 against fixed thresholds and never reads it.

**Fix.** Once deposits are drawn at survey (P-04) the difficulty has a job: a drawn token whose difficulty the roll did not reach goes face down on the hex as a trace, to be surveyed again — P-04.

### R-37 · Peat bogs and sand bars

**Severity** unclear · **Where** The economy, *Deposits* · **Status** Open, with a proposal

**As printed.** Both are dealt as deposit tokens, and the jobs that cut peat and dig sand need no deposit and draw none down, so finding one changes nothing.

**Fix.** Make them the site of those two jobs, with no yield to draw down — P-18.

### R-38 · Workers on bare ground

**Severity** unclear · **Where** Effort and jobs, *Worker slots* · **Status** Open; the interim rule holds

**As printed.** No worker cap is given for a job on a bare hex or on a figure; the interim rule allows a bare hex the {{rules.construction.workersPerSiteDefault}} workers a construction site takes.

**The reading.** The interim rule is sound and should become the rule, as a number in the data rather than a sentence in a note — P-18.

### R-39 · A quarter of the value of what you are carrying

**Severity** nit · **Where** Discovery and encounters, *Bandits* · **Status** Proposed

**As printed.** The toll is a quarter of the cargo's value; pirates take three tenths. Value at which ledger — the last town's, the next one's, or the base — is not said, and the three can differ by half.

**Fix.** Base value, the figure printed on the token's row in Annex I — P-16.
