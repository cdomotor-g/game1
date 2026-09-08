# What breaks play

Seven findings a table meets before the end of round one or at the end of round twenty-four, and cannot rule its way round without deciding something the book has not. Each carries the interim rule the chapters already print, and a proposal that would close it.

### R-01 · Free play cannot be scored as printed

**Severity** breaks play · **Where** The game, *The object of the game* · **Status** Open, with a proposal

**As printed.** Three victory conditions — Prosperity, Industry, Network — are named and described, and no number is attached to any of them. The chapter's interim rule counts only the points printed on things: {{buildings.buildings[id=manor].victoryPoints}} on a manor, {{buildings.buildings[id=rail].victoryPointsPerTile}} a hex of rail, and so on.

**The problem.** Under the interim rule the three conditions score nothing at all, and the printed points make rail the only score that grows without limit: twenty hexes of rail is twenty points against a manor's {{buildings.buildings[id=manor].victoryPoints}}. A game played to the printed rule is a rail race, which is the opposite of what three separate conditions were for.

**Evidence.** The victory data holds only the three summaries. The digital twin, which has to finish a game, scores one: every completed building at its printed points or else its tier; two points a worker and three a specialist; three a unit of luxury goods held; two a unit of tier-three goods held; one for every fifty coin; and two off for every point of unrest. It has no Network score because it plays one town.

**Fix.** Adopt the twin's schedule as the printed one, add a Network line, decide the tie, and make it data — see *Proposals*, P-01.

### R-02 · Two ways of moving, and the book uses both

**Severity** breaks play · **Where** The map and travel, *Legs* · **Status** Open, with a proposal

**As printed.** A leg's pace is a number of hexes read from the travel table for the mode and the ground, walked down one rung a hex on the P track. The chapter admits it cannot pace a leg that crosses two kinds of ground.

**The problem.** Half the data speaks another language. Figures carry *move points* — {{transport.figures[id=hero].movePoints}} for a hero, {{transport.figures[id=prospector].movePoints}} for a prospector, {{transport.figures[id=soldier].movePoints}} for a soldier, and {{rules.movement.figureMovePointsPerRound}} by default — and every terrain carries a *move cost* to enter. The traits and the gear are written in that language too: boots and a coil of rope make hills and mountain "cost 1 less", a travelling cloak is "+1 move point", plate harness is "−1 move point", dwarves are surefooted "minimum 1", elves cross forest "for 1". None of those sentences can be applied to a table of hexes per leg, and the table cannot be applied to a mixed leg. The chapter's interim rule — the slowest ground the leg enters — keeps a table moving and applies none of the gear.

**Evidence.** The travel table gives a walker four hexes of grassland and one of mountain, which is exactly {{rules.movement.figureMovePointsPerRound}} move points against the terrain costs of {{terrain.terrains[id=grassland].moveCost}} and {{terrain.terrains[id=mountain].moveCost}}; the on-foot row is the move-point rule tabulated. The mounted row is not — six on grassland but two in forest — so the table cannot simply be derived, and the two systems are genuinely two.

**Fix.** Choose one language and translate the other into it. The proposal, P-02, keeps the move points, because that is where the gear and the traits already live, and keeps the travel table as the printed pace of a vehicle and of a walker on one kind of ground.

### R-03 · Nobody can raise a soldier

**Severity** breaks play · **Where** People, food and unrest, *Soldiers* · **Status** Open, with a proposal

**As printed.** A soldier is a worker under arms; a barracks holds {{buildings.buildings[id=barracks].garrison}} of them. The chapter's interim rule pays {{transport.figures[id=soldier].cost}} coin at a town with a barracks and takes a worker off the labour roll.

**The problem.** No job in the recipe list turns a worker into a soldier, the barracks says it does so without saying how, and the figure list prices a soldier as a piece bought outright. A player who reads the barracks card and the figure table will raise soldiers two different ways.

**Evidence.** The barracks summary, the worker types, the figures list, and the absence of any *muster* recipe.

**Fix.** One civic job at the barracks — P-03.

### R-04 · Hidden deposits on a map that hides nothing

**Severity** breaks play · **Where** Setting up, *The deposits* · **Status** Open, with a proposal

**As printed.** Deposit tokens go down face down at setup and stay hidden until surveyed. The chapter admits it cannot say which hexes take them, how many, or how a token hides on a drawn map with no tile to slide it under.

**The problem.** The rule was written for a board of face-down tiles, which is shelved; the drawn map is in play and has no deposit marks. Every table will seed the map differently, and a survey — a whole job with its own die — is a roll against nothing until they do.

**Evidence.** The board-setup data describes a tile bag and says so; the map data carries terrain, settlements and routes and no deposits; the survey table says "reveal the tile's deposit token if it has one".

**Fix.** Do not hide tokens; draw them. A successful survey draws the top token of a kind that ground can hold — P-04.

### R-05 · Where a new worker comes from

**Severity** breaks play · **Where** People, food and unrest, *Workers* · **Status** Proposed

**As printed.** Workers come from housing and only from housing; when housing is finished, worker pieces are put in the town up to the beds it adds.

**The problem.** That sentence is the editor's reading of "a hut houses one worker", and the data does not quite say it. Housing gives a number of beds; nothing says a bed fills itself; and a Migrants card offers workers "if you have the housing and the food", which only means something if beds can be empty. Two tables will play it two ways: one where a hut is a worker, and one where a hut is a bed waiting for a migrant, and the second table's economy never grows.

**Evidence.** Housing values on the four housing buildings; the migrant card; the design note that "a worker is a die every round … so housing compounds"; the starting workers per people.

**Fix.** Say it in the data: a finished housing building brings its workers with it; beds empty only when a worker leaves or dies, and that is what a migrant fills — P-05.

### R-06 · Whose board holds the town's tools

**Severity** breaks play · **Where** Effort and jobs, *Tools*; Setting up, *Set your player board* · **Status** Proposed

**As printed.** A tool in play lies in a kit slot on the player board and its wear is walked on the ladder beside that slot. At setup the hero's board takes the starting axe and shovel in two of its four slots.

**The problem.** The board is the hero's. A town's tools then travel with the hero, who cannot leave town without taking the axe off the woodcutters, and a hero carrying a sword, a lantern and a pack has one slot left for every tool the town owns. Four ladders were drawn for the four things a *figure* carries; the town's tools have nowhere to be counted.

**Evidence.** The wear rule names "the W track beside the item's own slot on the player board"; the board note says four slots because "a player carries four things"; the tool data has no other home.

**Fix.** The board is generic on purpose, so deal one to the town as well: its town hall card in the recess and its tools in the four slots — P-06.

### R-07 · Bandits and pirates have a strength and nothing else

**Severity** breaks play · **Where** Discovery and encounters, *The results* · **Status** Open, with a proposal

**As printed.** Bandits are strength 2, plus 1 per full 20 bulk of cargo; pirates are strength 3. Neither has health, armour or pace, and both are fought "on the encounter board like a monster", which needs all four. The chapter's interim rule gives them armour 0 and one exchange.

**The problem.** A fight that cannot end. A party that wins the exchange has wounded nobody it can count, and a party that loses may not run unless its pace beats a pace that is not printed.

**Evidence.** The two discovery results carry a strength and a price; every monster carries five numbers.

**Fix.** Give them the five numbers, in the discovery data — P-07.
