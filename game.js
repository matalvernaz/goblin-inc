// ============================================
// GOBLIN INC. - Corporate Dungeon Management
// An incremental game of goblin capitalism
// ============================================

// ===========================================
// SECTION 1: GAME DATA
// ===========================================

const BUILDINGS = {
  shinyMine: {
    name: 'Shiny Mine',
    desc: 'Goblins dig holes. Sometimes they find gold. Sometimes they find more holes.',
    baseCost: { shinies: 10 },
    costMult: 1.15,
    effect: (lvl) => `Miners produce ${50 * lvl}% more (+${fmt(0.08 * lvl)}/s base)`,
    unlockZone: 0,
    story: {
      1: 'Found rusty pickaxe next to skeleton-man. Looks at rock. Looks at pickaxe. Just... hit it? YES. Hit rock, get MORE shinies. Book calls this "in-fra-struk-cher." We call it HOLE WITH SHINIES.',
      3: 'Mine going DEEPER. Finding rocks that GLOW. Didn\'t know rocks could glow! Every level down, shinies get shinier. Is like the dungeon WANTS us to dig. (Suspicious. But also: shiny.)',
      5: 'Grik carved "DEPARTMENT OF HITTING ROCKS" above the entrance. Nobody asked him to! He just DID it. Goblins making signs! For FUN!',
      10: 'Mine has SHIFTS now. Schedule on wall. We didn\'t make schedule — THEY did. Goblins organizing themselves?? Book didn\'t have chapter for this.',
    },
  },
  goblinHut: {
    name: 'Goblin Hut',
    desc: 'A hut for making more goblins. Don\'t ask how.',
    baseCost: { shinies: 50 },
    costMult: 1.18,
    effect: (lvl) => `+${5 * lvl} max goblins, +${fmt(0.15 * lvl)} goblins/s`,
    unlockZone: 0,
    story: {
      1: 'Built hut from sticks and stolen tablecloth. Small goblin peeked out and waved. WAVED. At us! First goblin to ever come here on PURPOSE.',
      3: 'More coming! Word spreading in tunnels — "there\'s a place where goblins get JOBS. Real jobs. Not run-from-hero jobs." They WANT to be here.',
      5: 'Goblin family moved in. Brought potted mushroom as gift! A GIFT! Most civilized thing that ever happened underground. We cried a little. Don\'t tell anyone.',
      10: 'Huts have a NEIGHBORHOOD. Someone built tiny park with bench from broken shield. Is this... a town? Are we a TOWN?',
    },
  },
  mushroomFarm: {
    name: 'Mushroom Farm',
    desc: 'Grows mushrooms in the dark. Just like a real farm, except underground and slightly cursed.',
    baseCost: { shinies: 15 },
    costMult: 1.15,
    effect: (lvl) => `Farmers produce ${50 * lvl}% more, +${30 * lvl} food cap`,
    unlockZone: 0,
    story: {
      1: 'Mushrooms grow FAST in dark. Taste like dirt and sadness but is OUR dirt and sadness. Book says "se-cure food sup-ply before hiring." Smart book. Gotta eat before can think about building empire.',
      3: 'Been talking to the mushrooms. THEY LISTEN. Grew twice as big after nice chat about weather (always dark, always damp — short chat). Book calls this "or-gan-ic growth." We call it mushroom magic.',
      5: 'Farm has TYPES now! Brown ones, gray ones, and special purple ones that make you see next Tuesday. (Next Tuesday is also mushrooms.)',
      10: 'Old company fed workers gray paste through tubes. WE have a FARM. With FARMERS who picked "farmer" as their job. Is completely different. Is BETTER.',
    },
  },
  thinkinRock: {
    name: "Thinkin' Rock",
    desc: 'A special rock for sitting and having ideas. Very exclusive. One goblin at a time.',
    baseCost: { shinies: 30 },
    costMult: 1.20,
    effect: (lvl) => `Thinkers produce ${50 * lvl}% more (+${fmt(0.03 * lvl)}/s base)`,
    unlockZone: 2,
    story: {
      1: 'Goblin sat on flat rock. Stared at nothing for whole hour. Then said: "What if pickaxes... but SHARPER?" GENIUS. Department of Thinking is born!',
      3: 'WAITING LIST for the rock! Goblins sitting in LINE. "No cutting" says sign. Goblins WAITING THEIR TURN. We are becoming... something.',
      5: 'Thinkers writing things down now. On walls. On rocks. On each other. Ideas EVERYWHERE. Old company hated thinking. We PAY for it.',
      10: 'Goblin philosopher appeared. Sits on rock asking "What IS a shiny?" and "Why is dark?" We don\'t understand but we are VERY proud.',
    },
  },
  trapWorkshop: {
    name: 'Trap Workshop',
    desc: 'Where goblins build elaborate traps that mostly work. The ones that don\'t are "learning opportunities."',
    baseCost: { shinies: 120, schemes: 5 },
    costMult: 1.25,
    effect: (lvl) => `+${10 * lvl}% combat power`,
    unlockZone: 4,
    story: {
      1: 'First trap: hole with blanket on top. Caught three of OUR goblins before catching intruder. Is called "learning curve." Book has whole chapter on this.',
      3: 'Traps getting CREATIVE. Spring doors! Trip wires! Bucket that falls on head and plays rude song! Engineers having FUN. Didn\'t know goblins could have fun at work.',
      5: 'Workshop has motto now: "WE BREAK THINGS SO THINGS DON\'T BREAK US." Carved it on door themselves. Nobody told them to. They just... care about what they do.',
    },
  },
  tradingPost: {
    name: 'Trading Post',
    desc: 'Trade with the outside world. Mostly selling things we "found." Don\'t say "stole."',
    baseCost: { shinies: 250, schemes: 15 },
    costMult: 1.30,
    effect: (lvl) => `+${5 * lvl}% all production`,
    unlockZone: 7,
    story: {
      1: 'Hung sign outside tunnel: "OPEN FOR BIZNESS." Confused merchant came in. Traded stuff for shinies. Left ALIVE. Nobody ate him! This is HUGE.',
      3: 'Have regular traders now! Used to be scared of us. Now scared of our PRICES. Heh. Is different kind of scary. Better kind.',
      5: 'Other dungeons asking how we did it. "How you get humans to trade with goblins?" Easy. Don\'t eat them. Give them reason to come back. Revolutionary.',
    },
  },
};

const UPGRADES = [
  {
    id: 'pointierPickaxes',
    name: 'Pointier Pickaxes',
    desc: 'The sharp end goes into the rock. Revolutionary.',
    cost: { schemes: 15 },
    effect: 'Double Shiny Mine production',
    unlockZone: 1,
    apply: () => { game.multipliers.mining *= 2; },
    story: 'Goblin stared at pickaxe for THREE DAYS. Then said: "What if pointy end... MORE pointy?" Everyone acted like obvious but NOBODY SAID IT BEFORE. This is what sitting on rock gets you!',
  },
  {
    id: 'biggerPockets',
    name: 'Bigger Pockets',
    desc: 'Management-approved trouser upgrades.',
    cost: { schemes: 10 },
    effect: '2x click power',
    unlockZone: 1,
    apply: () => { game.multipliers.click *= 2; },
    story: 'Tailor goblin (she appointed herself, nobody argued) sewed bigger pockets on all trousers. "Carry more, worry less." First company perk! We have PERKS now!',
  },
  {
    id: 'mushroomSeasoning',
    name: 'Mushroom Seasoning',
    desc: 'The mushrooms taste slightly less like feet now.',
    cost: { schemes: 20 },
    effect: '2x food production',
    unlockZone: 2,
    apply: () => { game.multipliers.food *= 2; },
    story: 'Cook threw cave moss on mushrooms. Called it "seasoning." Tastes like dirt but FANCY dirt. Everyone eating more now! Turns out goblins eat more when food not taste like punishment. Who knew.',
  },
  {
    id: 'thinkHarder',
    name: 'Think Harder',
    desc: 'Posted a sign above the rock that says "THINK HARDER." Surprisingly effective.',
    cost: { schemes: 35 },
    effect: '2x scheme production',
    unlockZone: 3,
    apply: () => { game.multipliers.schemes *= 2; },
    story: 'Put sign above thinkin\' rock as joke: "THINK HARDER." But goblins took it SERIOUS. Ideas doubled! Turns out goblins WANT to solve problems. Just needed someone to say is okay to try.',
  },
  {
    id: 'motivationalPosters',
    name: 'Motivational Posters',
    desc: '"Hang in there" but the cat is a goblin dangling over a pit.',
    cost: { schemes: 50 },
    effect: '+50% all production',
    unlockZone: 3,
    apply: () => { game.multipliers.global *= 1.5; },
    story: 'Goblin who can\'t spell drew posters. "BELEEV IN YURSELF" on every wall. Old company had posters too: "PRODUCTIVITY IS FREEDOM." Difference? Ours made by someone who WANTED to make them.',
  },
  {
    id: 'betterTraps',
    name: 'Better Traps',
    desc: 'Now with 40% fewer accidental goblin casualties.',
    cost: { schemes: 40 },
    effect: '2x trap effectiveness',
    unlockZone: 5,
    apply: () => { game.multipliers.traps *= 2; },
    story: 'Trap engineers held first "safety review." Lead engineer pointed at missing ear: "Used to test traps by walking into them. Now use watermelon." This called PROGRESS.',
  },
  {
    id: 'goblinDaycare',
    name: 'Goblin Daycare',
    desc: 'Tiny goblins raised by slightly less tiny goblins.',
    cost: { schemes: 55 },
    effect: '2x goblin production rate',
    unlockZone: 4,
    apply: () => { game.multipliers.goblinProd *= 2; },
    story: 'Daycare goblin reads stories to little ones about brave goblins who build things and pick own names. Old company sent goblin babies straight to work floor. Not here. Here little goblins get to be LITTLE first.',
  },
  {
    id: 'corporateRetreat',
    name: 'Corporate Retreat',
    desc: 'A weekend of trust falls into spike pits. Team building!',
    cost: { schemes: 120 },
    effect: '2x all production',
    unlockZone: 6,
    apply: () => { game.multipliers.global *= 2; },
    story: 'Held "retreat" in cleared cavern! Trust falls into mushroom piles! Bridge-building contest! One goblin did talk about FEELINGS. Nobody laughed. Not even once. We growing up.',
  },
  {
    id: 'advancedMetallurgy',
    name: 'Advanced Metallurgy',
    desc: 'Discovered you can melt gold down and then... have the same amount of gold. But shinier.',
    cost: { schemes: 200 },
    effect: '3x Shiny Mine production',
    unlockZone: 8,
    apply: () => { game.multipliers.mining *= 3; },
    story: 'Melted gold down and put it back together. Same amount! But now we UNDERSTAND it. Is not about having more — is about knowing what you got. (Also reformed gold is shinier. That matters to us. We are still goblins.)',
  },
  {
    id: 'battleFormations',
    name: 'Battle Formations',
    desc: 'Step 1: stand in a line. Step 2: don\'t run away. There is no step 3.',
    cost: { schemes: 100 },
    effect: '+50% combat power',
    unlockZone: 5,
    apply: () => { game.multipliers.combat *= 1.5; },
    story: 'Biggest goblin had idea: "What if we all face SAME direction?" Revolutionary. Drew lines on floor. Goblins stood in rows. Didn\'t run away. "That\'s IT?" they asked. Turns out not running is 90% of fighting. Other 10% is wanting something worth fighting FOR. Goblins got real quiet after that.',
  },
  {
    id: 'overtimePay',
    name: 'Overtime Pay',
    desc: 'Pay goblins extra for extra work? Madness. But it works.',
    cost: { schemes: 150 },
    effect: 'Each click also gives 10% of per-second production',
    unlockZone: 7,
    apply: () => { game.flags.overtimePay = true; },
    story: 'Goblin worked late. Found extra shinies in pay pile next morning. She didn\'t HAVE to work late — she CHOSE to. Paying goblins for choosing to give extra? Old company would never. That why old company is bones.',
  },
  {
    id: 'middleManagement',
    name: 'Middle Management',
    desc: 'Idle goblins now wander around looking busy. Some accidentally produce value.',
    cost: { schemes: 200 },
    effect: 'Idle goblins produce 0.2 Shinies/s each',
    unlockZone: 8,
    apply: () => { game.flags.middleManagement = true; },
    story: 'Even goblins with no job finding little things to do! Tidying. Organizing. Carrying stuff from one pile to slightly better pile. Nobody told them! Turns out if you treat goblins good, they WANT to help. This not in book but should be.',
  },
  {
    id: 'eliteSoldiers',
    name: 'Elite Soldiers',
    desc: 'Training program: hit the dummy until the dummy breaks. You are the dummy.',
    cost: { schemes: 250 },
    effect: '2x combat power',
    unlockZone: 10,
    apply: () => { game.multipliers.combat *= 2; },
    story: 'Elite squad all VOLUNTEERED. Every one. Sir Reginald asked why and biggest goblin said: "This place is OURS and nobody taking it." Used to scavenge alone in dark. Now has something worth protecting.',
  },
  {
    id: 'quantumMushrooms',
    name: 'Quantum Mushrooms',
    desc: 'These mushrooms exist in multiple states simultaneously. All of them taste bad.',
    cost: { schemes: 300 },
    effect: '3x food production',
    unlockZone: 12,
    apply: () => { game.multipliers.food *= 3; },
    story: 'Purple mushrooms from lower farms do WEIRD thing — exist in two places at once?? Philosopher goblin says "reality is suggestion." Farmer goblin says "we got twice as many mushrooms." Both right somehow.',
  },
  {
    id: 'synergisticSynergies',
    name: 'Synergistic Synergies',
    desc: 'We held a meeting about meetings. The results were... synergistic.',
    cost: { schemes: 500 },
    effect: '3x all production',
    unlockZone: 15,
    apply: () => { game.multipliers.global *= 3; },
    story: 'Put all departments in same room for first time. Miners talked to farmers. Thinkers talked to fighters. Cook talked to EVERYONE. By end, every team had ideas from every other team. Book calls this "syn-er-gee." Stupid word but the IDEA is real — we better together.',
  },
  {
    id: 'clickEmpowerment',
    name: 'Click Empowerment Seminar',
    desc: 'A 3-day seminar on the art of clicking. Your arm has never been so motivated.',
    cost: { schemes: 400 },
    effect: '5x click power',
    unlockZone: 14,
    apply: () => { game.multipliers.click *= 5; },
    story: 'Gave talk about hitting rocks. "Sometimes boss has to hit rock too," we said. Goblins nodded. Being boss not about telling others what to do. Is about showing you still willing to get hands dirty. Book didn\'t say this. We figured it out ourselves.',
  },
  {
    id: 'goblinCloning',
    name: 'Goblin Cloning',
    desc: 'Legal said we can\'t call it cloning. We call it "Accelerated Hiring."',
    cost: { schemes: 350 },
    effect: '3x goblin production, +20 max goblins',
    unlockZone: 13,
    apply: () => { game.multipliers.goblinProd *= 3; game.bonuses.maxGoblins += 20; },
    story: 'Worried for a minute. Is this okay? Is this what old company did? No. Is DIFFERENT. Old company made workers from EXISTING goblins — took away what they were. We just... grow new ones. Fast. Like mushrooms. New goblins wake up confused but curious. We give them whole day to pick own name before anything else. Old company gave workers NUMBERS. We give NAMES.',
  },
  {
    id: 'siegeEngines',
    name: 'Siege Engines',
    desc: 'Giant crossbow on wheels. Points outward. Usually.',
    cost: { schemes: 600 },
    effect: '3x combat power',
    unlockZone: 16,
    apply: () => { game.multipliers.combat *= 3; },
    story: 'Engineers built GIANT crossbow on wheels! Points outward into deeper dungeon. Sir Reginald looked at it and said: "We not defending anymore. We going to find out what at the BOTTOM." Goblins cheered. Even the quiet ones.',
  },
  {
    id: 'infiniteMushrooms',
    name: 'Infinite Mushroom Theory',
    desc: 'If you think about it, aren\'t we ALL mushrooms?',
    cost: { schemes: 800 },
    effect: '5x food production',
    unlockZone: 18,
    apply: () => { game.multipliers.food *= 5; },
    story: 'Philosopher goblin and mushroom whisperer locked selves in cave for WEEK. Came out smelling terrible but mushrooms growing five times faster. Philosopher says "everything connected underground. Mushrooms know this. We catching up." Don\'t fully understand but mushrooms REALLY good now.',
  },
  {
    id: 'corporateAscension',
    name: 'Corporate Ascension',
    desc: 'You\'ve read the entire MBA book. Even the index. You are become CEO, destroyer of margins.',
    cost: { schemes: 1200 },
    effect: '5x all production',
    unlockZone: 20,
    apply: () => { game.multipliers.global *= 5; },
    story: 'Finished the book. Every chapter. Every footnote. Even the in-dex. And we realized something: book not really about business. Is about ORGANIZING GOBLINS. Difference between old company and Goblin Inc. not the tools or mushrooms. Is that we read same book and CHOSE to do it different.',
  },
];

const ZONES = [
  // Act 1: The Awakening
  { name: 'The Broom Closet', boss: false,
    desc: 'A skeleton in a fancy suit sits slumped against the wall. A book lies open in its lap. This is where it all begins.' },
  { name: 'Supply Closet B', boss: false,
    desc: 'Pre-built shelves. Labeled containers. Someone designed this place. The dust is centuries old, but the architecture is deliberate.' },
  { name: 'The Break Room', boss: false,
    desc: 'A bulletin board with old notices. A coffee machine that still hums. Claw marks on the walls behind the furniture.' },
  { name: 'The Filing Cavern', boss: false,
    desc: 'Personnel files for thousands of employees. The termination dates accelerate toward the end. The last file just says "EVERYONE."' },
  { name: 'The Lobby', boss: true, bossName: 'Kevin the Intern',
    desc: 'The old main entrance. A young human in a kitchen-pot helmet guards it with a wooden sword and a crumpled acceptance letter from the Heroes\' Guild.' },
  // Act 2: The Old Company
  { name: 'The Abandoned Laboratory', boss: false,
    desc: 'Research notes on "Productivity Enhancement Through Biological Restructuring." The creatures in the dungeon aren\'t monsters. They\'re former employees.' },
  { name: 'The Marketing Pit', boss: false,
    desc: 'A bottomless pit with company slogans carved into every surface. "YOUR VALUE IS YOUR OUTPUT." The echoes never stop.' },
  { name: 'The Server Room', boss: false,
    desc: 'Crystal balls showing recorded company meetings. A giant floating hand addresses rows of terrified goblins. The old company was run by goblins, too.' },
  { name: 'The HR Swamp', boss: false,
    desc: 'The original company charter lies preserved in the muck. Mission: "To maximize value extraction from all available resources, including hope and identity."' },
  { name: 'The Corner Office', boss: true, bossName: 'Sir Reginald the Adequate',
    desc: 'A real hero, sent by the Guild with real armor and real questions. He has a magic sword that glows near overtime hours.' },
  // Act 3: Growing Pains
  { name: 'The Competitor\'s Tunnel', boss: false,
    desc: 'A tunnel to a rival dungeon. Their goblins wear ties and work in silence. Their eyes are glassy. This is a different kind of danger.' },
  { name: 'The Vending Machine Alcove', boss: false,
    desc: 'An interface terminal disguised as a food machine. It contains records of thousands of goblin workers across generations. None had names. Only numbers.' },
  { name: 'The Conference Abyss', boss: false,
    desc: 'Kevin asked how we know we won\'t become like the old company. The question echoes in this room that has no walls, only agendas.' },
  { name: 'The Archives of Bad Ideas', boss: false,
    desc: 'Rejected proposals from the old company. One, marked REJECTED in angry red, suggested letting employees choose their own tasks. Filed by Employee #1.' },
  { name: 'The Rival\'s Boardroom', boss: true, bossName: 'Chad Thornington III, MBA',
    desc: 'Chad\'s goblins don\'t fight for him. They fight because they don\'t know they can stop. Not for long.' },
  // Act 4: The Deeper Dungeon
  { name: 'The Sealed Floors', boss: false,
    desc: '"4TH SUB-BASEMENT — OFF LIMITS PER CORPORATE." The creatures here wear lab coats. The scientists were restructured too.' },
  { name: 'The Legal Department', boss: false,
    desc: 'Cynthia\'s filing cabinets contain Guild Law precedent. Goblins are classified as "Dungeon Resources." Not for much longer.' },
  { name: 'The Innovation Sinkhole', boss: false,
    desc: 'A hole where ideas were thrown to be forgotten. Some of them survived. Some of them were Employee #1\'s.' },
  { name: 'The Accounting Labyrinth', boss: false,
    desc: 'Walls shift to trap you. The numbers tell the story: profits up, humanity down. The restructuring wasn\'t a side effect. It was the business model.' },
  { name: 'The Dragon\'s Office', boss: true, bossName: 'Cynthia, Dragon Lawyer',
    desc: 'She passed the bar in seven kingdoms. She represents the Heroes\' Guild. But she\'s never seen a company where employees are happy. Not until now.' },
  // Act 5: The Revelation
  { name: 'The IPO Cavern', boss: false,
    desc: 'Every goblin got one share. One vote. The value of Goblin Inc. isn\'t measured in gold.' },
  { name: 'The Shareholder Gulch', boss: false,
    desc: 'A canyon carved by water that flows upward. The old company\'s growth charts are etched into the walls. They all end at a cliff.' },
  { name: 'The Interdimensional Loading Dock', boss: false,
    desc: 'Portals to other dungeons. In some of them, the old company is still running. In some of them, nobody ever found the book.' },
  { name: 'The Cosmic Break Room', boss: false,
    desc: 'An alternate break room. Their coffee machine works. Their goblins are free. Proof that this can work anywhere.' },
  { name: 'The Multiverse Branch Office', boss: true, bossName: 'Your Other Self',
    desc: 'An alternate you who found a different book: "Ruthless Leadership." Their Goblin Inc. is efficient, profitable, and completely hollow.' },
  // Act 6: The Bottom
  { name: 'The Living Corridors', boss: false,
    desc: 'The dungeon stops looking like a building. It looks like a body. Corridors like veins. Rooms like organs. The walls pulse.' },
  { name: 'The Celestial Mailroom', boss: false,
    desc: 'Billions of letters to The Hand from every reality. "Targets met. Awaiting instructions." The Hand never wrote back. Not once.' },
  { name: 'The Universal Board Room', boss: false,
    desc: 'Logos of every company from every dimension line the walls. All of them are The Hand. The same pattern, replicating endlessly.' },
  { name: 'The Empty Chair', boss: false,
    desc: 'The CEO seat. It has always been empty. The Hand was never a being. It was an idea that convinced everyone someone at the top had a plan.' },
  { name: 'The Heart of the Company', boss: true, bossName: 'The Invisible Hand',
    desc: 'Not a creature. Not a god. Just the accumulated weight of every decision that chose efficiency over dignity. And one hundred goblins who chose to be here.' },
];

const MEMOS = [
  // --- ACT 1: THE AWAKENING (Zones 0-5) ---
  // You're a goblin who found a book. But WHY was the book here?
  { zone: 1, type: 'story', title: 'RE: NEW MANAGEMENT',
    body: 'MEMO TO: All Goblins\nFROM: You (Self-Appointed Chief Executive Goblin)\n\nI found a book. It was wedged under a skeleton wearing very fancy clothes. The skeleton had a name tag: "Regional Manager."\n\nThe book is called "MBA For Dummies." Most of the words are too long, but I understood the pictures. They show someone telling OTHER people what to do while sitting in a big chair.\n\nI want to be the one in the big chair.\n\nWe\'re going corporate. No more mindless hoarding — we\'re going to STRATEGICALLY hoard. First order of business: find more shinies.\n\nP.S. Nobody touch the skeleton. He\'s our first employee. Posthumously.' },
  { zone: 2, type: 'story', title: 'RE: WHO BUILT THIS PLACE?',
    body: 'Expanding into the Supply Closet, I noticed something odd. These aren\'t natural caves. Someone BUILT this dungeon. There are doorframes. Light fixtures (broken). A sign that says "FLOOR 1 — ORIENTATION."\n\nOrientation for WHAT?\n\nAlso found more skeletons. They\'re all wearing the same uniform. Little embroidered logo on the chest — a hand giving a thumbs up. Creepy.\n\nWhatever company used to operate here, they\'re gone. We\'re the management now.' },
  { zone: 3, type: 'story', title: 'RE: THE BREAK ROOM DISCOVERY',
    body: 'The Break Room had a bulletin board. Under layers of dust, there were notices:\n\n"MANDATORY FUN FRIDAY — ALL EMPLOYEES MUST ATTEND"\n"REMINDER: The 4th Sub-Basement is OFF LIMITS per Corporate"\n"Q3 PRODUCTIVITY DOWN 200% — SEE ATTACHED RE: CONSEQUENCES"\n\nThe "consequences" memo was torn off. There were claw marks on the wall behind the board.\n\nAlso found a coffee machine. It still works somehow. Nobody knows what coffee is, but it smells like ambition mixed with desperation. Very corporate.' },
  { zone: 4, type: 'story', title: 'RE: THE FILING CAVERN',
    body: 'Thousands of documents. Personnel files. We can\'t read most of them — the language is old and strange — but our best reader (Grik, who once ate a dictionary) translated some:\n\n"Employee #4,207 — Terminated. Reason: Asking Questions."\n"Employee #4,208 — Terminated. Reason: Not Asking Questions."\n"Employee #4,209 — Terminated. Reason: Looked at Employee #4,207."\n\nThe termination dates get closer and closer together toward the end. The very last file just says: "EVERYONE."\n\nI\'m starting to think the previous management had some issues.' },
  { zone: 5, type: 'story', title: 'RE: THE SKELETON\'S JOURNAL',
    body: 'Remember the skeleton I found the MBA book under? He had a journal in his coat pocket.\n\nMost of it is water-damaged, but I can read the last entry:\n\n"Day 1,247. They\'ve stopped pretending this is a company. The Hand sees everything. The lower floors are sealed. I can hear them through the walls — the old employees, changed into something else. I should have left when the others did. Now the exits are teeth.\n\nIf anyone finds this: the book is the key. Not the words — the IDEA. It was always about the idea. Build something real. Build something that isn\'t just a machine for—"\n\nThe entry ends there. His pen made a long line down the page, like his hand was dragged away.\n\nI\'m going to keep reading the book.' },
  { zone: 5, type: 'boss', title: 'INCIDENT REPORT: KEVIN THE INTERN',
    body: 'A "hero" named Kevin tried to raid us. Kitchen pot on his head, wooden sword, acceptance letter from the Heroes\' Guild crumpled in his pocket.\n\nMid-fight, he started crying and told us everything: The Heroes\' Guild sends interns into dungeons as "field training." None of them come back. The Guild calls it "natural attrition." Kevin called it "murder with extra steps."\n\nWe offered him a job. A REAL job. With a title and everything: Chief Suggestion Officer.\n\nHe asked if we had dental. We don\'t know what that means, but we said yes.\n\nKevin is the first person to ever CHOOSE to join Goblin Inc. That matters more than I expected.' },

  // --- ACT 2: THE OLD COMPANY (Zones 6-10) ---
  // What was the previous company? What is "The Hand"?
  { zone: 6, type: 'story', title: 'RE: THE LABORATORY FINDINGS',
    body: 'The Abandoned Laboratory has notes everywhere. Someone was researching "Productivity Enhancement Through Biological Restructuring."\n\nIn plain language: they were turning employees into monsters.\n\nThe "restructured" employees were stronger, faster, didn\'t need breaks, didn\'t ask for raises. Perfect workers. Except they also didn\'t have thoughts, or names, or the ability to stop working.\n\nThe creatures we\'ve been fighting in the dungeon? They\'re not monsters.\n\nThey\'re the old staff.\n\n...We need to talk about our expansion strategy.' },
  { zone: 7, type: 'story', title: 'RE: THE SERVER ROOM',
    body: 'Crystal balls linked by copper wire. Ancient networking. We got one working.\n\nIt showed a recording — a company all-hands meeting. A massive hand floating above a stage (literally — THE Hand) addressing rows of terrified employees:\n\n"Your purpose is productivity. Your value is output. You are components in a system, and components do not ask why. Components PRODUCE."\n\nThe employees looked like us. Small. Green. Goblins.\n\nThis dungeon wasn\'t built by some ancient civilization. It was built by goblins. Goblins who forgot they were allowed to be anything other than components.\n\nWe\'re not repeating that. We\'re building something different. Starting with better break room snacks.' },
  { zone: 8, type: 'story', title: 'RE: THE HR SWAMP',
    body: 'The HR department has become a literal swamp. Fitting.\n\nBut at the bottom, preserved in the muck, we found the original company charter. It\'s called "The Invisible Hand Corporation." Their mission statement:\n\n"To maximize value extraction from all available resources, including but not limited to: minerals, labor, time, hope, and identity."\n\nThere\'s a handwritten note in the margin: "Is this evil? — Employee #1"\n\nAnd below it, in different ink: "Doesn\'t matter. It\'s profitable. — Management"\n\nI\'ve been reading the MBA book differently lately. Not as instructions. As a WARNING.' },
  { zone: 9, type: 'story', title: 'PERSONAL LOG: LATE NIGHT',
    body: 'Can\'t sleep. The other goblins are snoring.\n\nKevin asked me today why I started all this. I said "the book." But that\'s not really true. The truth is, before the book, I was just... here. In the dungeon. Not thinking about why. Not thinking about anything. We all were.\n\nGoblins don\'t usually build things. We scavenge. We fight over scraps. We live in the dark and we don\'t ask why it\'s dark.\n\nThe book didn\'t teach me business. It taught me that CHOOSING what you do — having a purpose you picked yourself — that\'s the thing. That\'s the whole thing.\n\nThe old company took that away from its workers. Turned them into machines.\n\nGoblin Inc. gives it back. Every goblin here chose to be here. That\'s what makes us different.\n\nI think.' },
  { zone: 10, type: 'boss', title: 'DEFEAT OF SIR REGINALD THE ADEQUATE',
    body: 'Sir Reginald wasn\'t just a hero. He was a REAL hero — sent by the Heroes\' Guild with actual training and actual armor.\n\nBut here\'s the thing: when we beat him, he didn\'t run. He sat down and asked: "What IS this place? Why are goblins running... a company?"\n\nSo I told him. About the book. The old company. The employees turned into monsters. About choosing your own purpose.\n\nHe was quiet for a long time. Then he said: "The Heroes\' Guild is the same. They send us to die in dungeons and call it glory. They take 90% of the loot and call it administration fees."\n\nSir Reginald is now VP of Security. He kept his sword. We kept his shield (it\'s a really nice serving tray).\n\nNew opportunity unlocked: FRANCHISING. We can spread this idea to other dungeons.' },

  // --- ACT 3: GROWING PAINS (Zones 11-15) ---
  // Success brings competition and hard questions
  { zone: 11, type: 'story', title: 'RE: THE COMPETITION',
    body: 'Discovered a rival dungeon operation next door: "DungeonCorp." Goblin-run, like us. But different.\n\nTheir goblins wear ties. Their CEO — Chad Thornington III — has a genuine MBA (from a correspondence course). They have CARPET.\n\nBut when I looked closer: their goblins\' eyes are glassy. They work in silence. They don\'t choose their jobs — they\'re ASSIGNED. Break time is timed to the second.\n\nChad figured out the surface version of what the old company did. No biological restructuring needed. Just enough pressure, just enough control, and the goblins stop being goblins. They become components again.\n\nWe can\'t let that spread.' },
  { zone: 12, type: 'story', title: 'RE: THE VENDING MACHINE SPEAKS',
    body: 'The magical vending machine isn\'t just a vending machine. It\'s an interface terminal for the old company\'s systems.\n\nWe got it to display employee records. There were THOUSANDS of goblin workers here. Over generations. Each one given a number, a task, and a tiny room. No names. No choices.\n\nBut then I found something: a hidden directory labeled "DISSIDENTS." Goblins who resisted. Who wrote secret messages on the walls. Who hid books — books about the world outside, about choices, about what goblins used to be before the company.\n\nThe MBA book was in this directory. Someone hid it on purpose.\n\nSomeone wanted a future goblin to find it.' },
  { zone: 13, type: 'story', title: 'RE: KEVIN\'S QUESTION',
    body: 'Kevin asked something that kept me up all night:\n\n"Boss, as we get bigger... how do we know WE won\'t become like the old company?"\n\nI said: "Because we\'re different."\n\nHe said: "That\'s what they probably said too."\n\nHe\'s right. Every empire starts with good intentions. Every tyrant was once someone who just wanted things to be better.\n\nSo I made a rule, effective immediately:\n\nGOBLIN INC. BYLAW #1: Any goblin can leave at any time, for any reason, with no penalty, and a fair share of shinies.\n\nNobody has left yet. But the fact that they CAN... that\'s the point.' },
  { zone: 14, type: 'story', title: 'RE: THE ARCHIVES OF BAD IDEAS',
    body: 'Found the old company\'s rejected proposals. Most are horrifying:\n\n"Proposal: Remove sleep from the schedule. Employees can rest when productivity targets are met." (Approved, then reversed after the screaming started.)\n\n"Proposal: Merge all employees into a single organism for maximum coordination." (Tabled for further study. This is concerning.)\n\nBut one proposal stood out. Filed near the bottom, marked REJECTED in angry red:\n\n"Proposal: Let employees choose their own tasks based on aptitude and interest. Hypothesis: voluntary engagement outperforms coerced labor."\n\nFiled by Employee #1. The same one who wrote "Is this evil?" on the charter.\n\nEmployee #1 tried to change things from the inside. They failed.\n\nBut their idea survived. In a book, under a skeleton, in a broom closet.\n\nI think Employee #1 would like what we\'re building.' },
  { zone: 15, type: 'boss', title: 'RE: HOSTILE TAKEOVER — DUNGONCORP',
    body: 'We didn\'t actually defeat Chad. Not in combat.\n\nDuring the battle, his own goblins stopped fighting. They put down their assigned weapons, took off their ties, and walked to our side of the line.\n\nChad screamed about contracts, about obligations, about how they OWED him. One goblin — the smallest one — turned back and said: "I never signed anything."\n\nDungeonCorp collapsed in twenty minutes. Not from defeat, but from choice. When given an alternative, every single goblin chose to leave.\n\nChad is working in our suggestion box department now. He keeps submitting suggestions like "mandatory team synergy workshops." Kevin files them in Pile B (flammable).\n\nNote to self: you can\'t build something real on a foundation of people who\'d leave if they could.' },

  // --- ACT 4: THE DEEPER DUNGEON (Zones 16-20) ---
  // What's really down there? The old company's darkest secret.
  { zone: 16, type: 'story', title: 'RE: THE SEALED FLOORS',
    body: 'Remember the old bulletin board? "The 4th Sub-Basement is OFF LIMITS per Corporate."\n\nWe\'re past the 4th Sub-Basement now. There are signs everywhere: "AUTHORIZED PERSONNEL ONLY." "BIOLOGICAL HAZARD." "THE HAND SEES ALL."\n\nThe creatures down here are different from the upper floors. Bigger. More... put together. Like the restructuring process was more advanced. Some of them are wearing the remains of lab coats.\n\nThey weren\'t just workers. They were the SCIENTISTS. The ones who designed the restructuring process. And then they were restructured themselves.\n\nThe old company ate its own builders.\n\nI need to know what\'s at the bottom.' },
  { zone: 18, type: 'story', title: 'RE: THE ACCOUNTING LABYRINTH',
    body: 'The Accounting Labyrinth isn\'t a metaphor. It\'s literally designed so you can\'t find your way out. Walls shift. Corridors loop. There are chalk marks from previous goblins who tried to map it.\n\nBut the numbers on the walls tell a story:\n\nThe old company\'s profits went UP every quarter for 200 years. Costs went DOWN. Employee count went DOWN. Output went UP.\n\nThe math only works if employees became more productive as they lost more of themselves. The restructuring wasn\'t a side effect of the company\'s growth. It was the BUSINESS MODEL.\n\nConvert workers into things. Things don\'t negotiate. Things don\'t quit. Things don\'t ask if it\'s evil.\n\nI feel sick. But we keep going.' },
  { zone: 19, type: 'story', title: 'PERSONAL LOG: BEFORE THE DRAGON',
    body: 'Sir Reginald told me something tonight. The Heroes\' Guild has a saying: "A dungeon conquered is a lesson learned."\n\nHe said he used to think it meant: defeat the boss, take the treasure, move on.\n\nNow he thinks it means: understand WHY the dungeon exists, and you\'ll understand what you\'re really fighting.\n\nThis dungeon exists because someone decided goblins were resources instead of people. Every floor is a monument to that idea. Every "restructured" creature we fight is proof of where it leads.\n\nGoblin Inc. exists because one goblin found a book and had a different idea.\n\nTomorrow we face the dragon. Cynthia, Dragon Lawyer. She represents the Heroes\' Guild — the last institution that still sees goblins as loot-drop generators rather than, you know, people.\n\nWe\'re not going to defeat her with weapons.' },
  { zone: 20, type: 'boss', title: 'RE: THE TRIAL OF CYNTHIA',
    body: 'Cynthia the Dragon Lawyer challenged us to a legal proceeding instead of combat. Her argument: Goblins are classified as "Dungeon Resources" under Guild Law, and therefore cannot own property, run businesses, or file taxes.\n\nOur counter-argument: We presented our books. Our balance sheets. Our employee satisfaction surveys (Kevin designed them — they\'re mostly smiley faces, but they\'re REAL).\n\nCynthia read through everything. Then she did something nobody expected.\n\nShe cried.\n\n"In 400 years of practicing law," she said, "nobody has ever shown me a company where the employees were HAPPY."\n\nShe works for us now. Pro bono. She filed a motion to reclassify goblins as "Sentient Beings with Full Legal Standing." It\'s pending. But it\'s FILED.\n\nThis is what winning actually looks like.' },

  // --- ACT 5: THE REVELATION (Zones 21-25) ---
  // The truth about The Hand, and what you're really building
  { zone: 21, type: 'story', title: 'RE: IPO & THE REAL SHAREHOLDERS',
    body: 'Goblin Inc. went public today. Not on a stock exchange — we held an open assembly. Every goblin got one share. One vote.\n\nKevin stood up and said: "I used to deliver swords to heroes who wanted to kill us. Now I decide what we have for lunch on Fridays. That\'s progress."\n\nSir Reginald said: "I used to think glory meant fighting. Now I think it means building something worth protecting."\n\nCynthia said: "You\'re all technically in violation of seventeen Guild statutes. I\'m so proud."\n\nThe share price is 1 Shiny. It will always be 1 Shiny. Because the value of Goblin Inc. isn\'t measured in gold.' },
  { zone: 23, type: 'story', title: 'RE: THE INTERDIMENSIONAL LOADING DOCK',
    body: 'The portal in the loading dock connects to other dungeons. Other VERSIONS of this dungeon, in other realities.\n\nIn some of them, the old company is still running. We can see the goblins through the portal, working in silence, eyes empty, numbers on their backs.\n\nIn some of them, nobody ever found the book.\n\nI keep thinking about Employee #1. They hid books across the dungeon, hoping someone would find one. In our reality, I did. In how many others did the books rot unread?\n\nWe have a portal now. We have a company that works. We have proof that there\'s another way.\n\nMaybe it\'s time to start delivering books.' },
  { zone: 25, type: 'boss', title: 'RE: THE OTHER YOU',
    body: 'The Multiverse Branch Office was run by an alternate version of me. Same goblin. Same broom closet. But in their reality, they found a different book: "Ruthless Leadership: Crush or Be Crushed."\n\nTheir Goblin Inc. was efficient. Profitable. Growing. And completely hollow. Their goblins worked because they were afraid, not because they chose to.\n\nWhen we defeated them, I offered a handshake. They slapped it away and said: "You\'re weak. Choice is inefficient. Fear is faster."\n\nI said: "Faster at what?"\n\nThey didn\'t have an answer.\n\nTheir goblins are with us now. It took three days before the smallest one smiled. It took a week before any of them spoke without being spoken to first. It took a month before one of them came to me and said:\n\n"Can I... choose my own job?"\n\nYes. That\'s the whole point. That was always the whole point.' },

  // --- ACT 6: THE BOTTOM (Zones 26-30) ---
  // What is The Hand? The final truth.
  { zone: 26, type: 'story', title: 'RE: THE SPACE BETWEEN',
    body: 'Below the lowest sub-basement, the dungeon stops looking like a building. It looks like a BODY. Corridors like veins. Rooms like organs. The walls pulse.\n\nThe old company didn\'t just occupy this dungeon. The dungeon IS the old company. It grew. The "Biological Restructuring" wasn\'t just done to the employees — it was done to the BUILDING. The company became a living thing.\n\nAnd at the bottom, in the heart of it...\n\nThe Hand.' },
  { zone: 27, type: 'story', title: 'RE: THE CELESTIAL MAILROOM',
    body: 'Letters. Billions of them. From every version of this dungeon across every reality. All addressed to The Hand. All saying the same thing in different words:\n\n"Quarterly targets met. Awaiting further instructions."\n\nThe Hand never wrote back. Not once, in any reality. Every dungeon, every company, every goblin turned into a machine — all working toward targets set by something that NEVER RESPONDED.\n\nThe old company destroyed itself trying to please something that wasn\'t listening.\n\nThat\'s the joke. That\'s the horrible, cosmic joke. There was never anyone at the top. The Hand isn\'t a leader. It\'s an IDEA. The idea that productivity is purpose. That efficiency is meaning. That if you just work HARD ENOUGH, someone, somewhere, will tell you it was worth it.\n\nNobody tells you it\'s worth it. You have to decide that for yourself.' },
  { zone: 28, type: 'story', title: 'PERSONAL LOG: ALMOST THERE',
    body: 'Sitting outside the final chamber. Kevin, Sir Reginald, and Cynthia are here. And a hundred goblins who chose to come.\n\nI asked them why they\'re here. Not as a test. Because I genuinely wanted to know.\n\nKevin said: "Because you asked instead of ordered."\nSir Reginald said: "Because this is worth protecting."\nCynthia said: "Because the law should serve people, and I\'d like to meet the thing it\'s been serving instead."\n\nAnd the smallest goblin — the one from the alternate dimension who took a month to smile — said: "Because I want to see it end."\n\nWe go in at dawn.' },
  { zone: 29, type: 'story', title: 'RE: THE BOARD ROOM',
    body: 'The Universal Board Room. At the center of the dungeon-organism. The walls are covered in the logos of every company that ever existed in every dimension. All of them are The Hand.\n\nThe same corporation, across infinite realities, all running the same playbook: consume workers, optimize output, grow, repeat. No creativity. No joy. No purpose beyond the next quarterly report.\n\nAnd at the head of the table: an empty chair.\n\nThe CEO seat has ALWAYS been empty. The Hand was never a being. It was a SYSTEM. A pattern that replicates itself — from dungeon to dungeon, reality to reality — by convincing each new generation that someone at the top has a plan.\n\nNobody has a plan. There is no top.\n\nThere\'s just us, choosing what to build next.' },
  { zone: 30, type: 'boss', title: 'RE: THE LAST MEETING',
    body: 'We sat in the empty chair. All of us. We dragged in enough chairs for everyone.\n\nThe dungeon fought back — the system doesn\'t like being questioned. Walls shaking, old machinery screaming, restructured creatures pouring in from every corridor. The final quarterly review.\n\nBut here\'s what the system never accounted for: goblins who WANT to be there fight differently than goblins who HAVE to be there.\n\nWe held.\n\nAnd when it was over, the dungeon stopped pulsing. The walls went still. The creatures — the old employees — sat down, one by one, and the blankness left their eyes.\n\nEmployee #4,207 looked at me and said: "What... what year is it?"\n\nI told them. Then I told them about Goblin Inc. About choice. About the book.\n\nThey said: "Employee #1 hid that book four hundred years ago. We thought nobody would ever find it."\n\nI said: "Someone always finds the book."\n\nGoblin Inc. isn\'t a company. Not really. It\'s a proof of concept. Proof that you can build something where the builders matter.\n\nThe dungeon is ours now. Not as a machine. As a HOME.\n\n~ THE BEGINNING ~\n\n(There are more dungeons out there. More books to deliver. More goblins to show that the chair at the top was always empty.)\n\n(And there are always more shinies.)' },
];

const PRESTIGE_PERKS = [
  { id: 'headStart', name: 'Head Start', desc: 'Start with Shinies after franchising',
    maxLevel: 10, cost: (lvl) => lvl + 1,
    effect: (lvl) => `Start with ${100 * lvl} Shinies`,
    apply: (lvl) => { game.resources.shinies += 100 * lvl; },
  },
  { id: 'productionBonus', name: 'Corporate Knowledge', desc: 'Permanent production bonus',
    maxLevel: 20, cost: (lvl) => lvl + 1,
    effect: (lvl) => `+${5 * lvl}% all production`,
    apply: (lvl) => { game.multipliers.prestige = 1 + 0.05 * lvl; },
  },
  { id: 'goblinBonus', name: 'Recruitment Drive', desc: 'Start with extra goblins',
    maxLevel: 10, cost: (lvl) => lvl + 1,
    effect: (lvl) => `Start with ${2 * lvl} goblins`,
    apply: (lvl) => { game.resources.goblins += 2 * lvl; },
  },
  { id: 'combatBonus', name: 'Veteran Fighters', desc: 'Permanent combat power bonus',
    maxLevel: 15, cost: (lvl) => lvl + 2,
    effect: (lvl) => `+${10 * lvl}% combat power`,
    apply: (lvl) => { game.multipliers.prestigeCombat = 1 + 0.1 * lvl; },
  },
  { id: 'clickBonus', name: 'Strong Arms', desc: 'Permanent click power bonus',
    maxLevel: 10, cost: (lvl) => lvl + 1,
    effect: (lvl) => `+${20 * lvl}% click power`,
    apply: (lvl) => { game.multipliers.prestigeClick = 1 + 0.2 * lvl; },
  },
  { id: 'foodBonus', name: 'Gourmet Mushrooms', desc: 'Start with extra food capacity',
    maxLevel: 10, cost: (lvl) => lvl + 1,
    effect: (lvl) => `+${50 * lvl} starting food cap`,
    apply: (lvl) => { game.bonuses.foodCap += 50 * lvl; },
  },
];

const INTRO_PAGES = [
  '<p>You are <span class="intro-emphasis">goblin</span>.</p><p>Always been goblin. Live in dungeon. Never thought about why. None of us do. Goblins don\'t think about things. We eat, we sleep, we fight over scraps in the dark.</p><p>That\'s just how it is.</p>',
  '<p>But today, in back of broom closet, you find <span class="intro-emphasis">dead thing</span>.</p><p>Not regular dead thing. This one wearing FANCY clothes. Has little card on chest that says <span class="intro-gold">"Regional Manager."</span> Don\'t know what that means. Sounds important.</p><p>Under dead thing: a book.</p>',
  '<p>Book is called <span class="intro-gold">"MBA For Dummies."</span></p><p>Most words too big. But PICTURES. Pictures show someone sitting in big chair, telling OTHER people what to do. Not fighting. Not scavenging. <span class="intro-emphasis">Building</span> things. Making <span class="intro-emphasis">plans</span>.</p><p>We never had a plan before. Plans are for... not-goblins.</p><p>But maybe they don\'t have to be.</p>',
  '<p>Look around broom closet. Look at dead fancy-man. Look at other goblins sleeping in the dark. Something different now. Not dungeon — dungeon same as always.</p><p><span class="intro-emphasis">Us.</span> We are different.</p><p>Want to know why this place is here. Want to know what happened. Want to build something where goblins aren\'t just... goblins. Where we <span class="intro-emphasis">pick</span> what we do.</p><p>Book makes it sound possible.</p>',
  '<p>Open book to Chapter 1.</p><p><span class="intro-gold">"Step One: Ack-wire Cap-it-all."</span></p><p>Don\'t know what that means. But there\'s a picture of gold coins.</p><p>We know gold coins. We call them shinies.</p><p>There are shiny rocks on the floor right here.</p><p>We pick one up.</p>',
];


const CHANGELOG = [
  {
    version: 'v1.0.0 — Grand Opening',
    date: '2026-04-15',
    changes: [
      'Goblin Inc. is open for business! 30 zones of corporate dungeon exploration.',
      '6 buildings, 20 research upgrades, and a franchise (prestige) system.',
      'A 6-act story told through memos, building milestones, and zone descriptions.',
      'Full keyboard navigation and screen reader support.',
      'Offline progress (up to 4 hours), auto-save, and import/export.',
    ],
  },
];


// ===========================================
// SECTION 2: GAME STATE
// ===========================================

// Tutorial steps - shown in order, each dismissed individually
const TUTORIAL = [
  { id: 'welcome',
    text: 'Book says "Step One: Ack-wire Cap-it-all." Big word. But there\'s a picture of gold coins. Shinies! We know shinies. Hit the rock, get shinies.',
    condition: () => true,
    done: () => game.stats.totalClicks >= 1 },
  { id: 'firstShinies',
    text: 'Ooh, shiny. Book says need LOTS before can do next thing. Keep whacking.',
    condition: () => game.stats.totalClicks >= 1,
    done: () => game.unlocks.tabBuild },
  { id: 'buildMine',
    text: 'New page in book! Has picture of hole in ground with goblins in it. "In-fra-struk-cher." Means "build stuff." We can build stuff!',
    condition: () => game.unlocks.tabBuild,
    done: () => (game.buildings.shinyMine || 0) >= 1 },
  { id: 'buildFarm',
    text: 'Mine digs a LITTLE on its own but book says "workers need tools AND tools need workers." Mine is the tool — but we need goblins to really use it. First though... tummy rumbly. Need food. Mushrooms grow in the dark here...',
    condition: () => (game.buildings.shinyMine || 0) >= 1,
    done: () => (game.buildings.mushroomFarm || 0) >= 1 },
  { id: 'buildHut',
    text: 'Book has chapter called "Hoo-man Ree-sore-says." No humans here. But other goblins in the tunnels! Need place for them to sleep. More goblins means more workers — but also means more hungry mouths. Book calls this a "trade-off."',
    condition: () => (game.buildings.mushroomFarm || 0) >= 1,
    done: () => (game.buildings.goblinHut || 0) >= 1 },
  { id: 'assignGoblins',
    text: 'GOBLINS! They\'re here! Put them to WORK! Miners dig shinies, farmers grow food. Important: goblins get HUNGRY. No food = goblins LEAVE. Need farmers to keep everyone fed!',
    condition: () => Math.floor(game.resources.goblins) >= 1,
    done: () => getTotalAssigned() >= 1 },
  { id: 'feedWarning',
    text: 'Here is the tricky bit from the book: every goblin eats food. More goblins = need more farmers. But farmers not mining shinies! And miners not growing food! Book calls this "bal-ance." Have to choose who does what. Upgrade buildings to make each goblin do MORE.',
    condition: () => getTotalAssigned() >= 1 && Math.floor(game.resources.goblins) >= 2,
    done: () => game.assignments.farming >= 1 && game.assignments.mining >= 1 },
  { id: 'buildingBoost',
    text: 'SECRET from book: bigger buildings make goblins BETTER at their job! Mine level 2 means miners dig MORE. Farm level 2 means farmers grow MORE. Is like... building is the tool, goblin is the hand. Better tool = better hand. Build MORE to make goblins STRONGER!',
    condition: () => game.assignments.farming >= 1 && game.assignments.mining >= 1,
    done: () => (game.buildings.shinyMine || 0) >= 2 || (game.buildings.mushroomFarm || 0) >= 2 },
  { id: 'unlockDungeon',
    text: 'Tunnels go deep. Weird noises down there. Skeleton-man came from down there. Part of us says don\'t go. Bigger part says... we HAVE to know. Assign goblins to Fighting and send them in!',
    condition: () => game.unlocks.tabDungeon,
    done: () => game.zone.cleared.length >= 1 },
  { id: 'keepGoing',
    text: 'More rooms down there. Found something on the wall — a big hand doing a thumbs up. Old. Creepy. What WAS this place? Only one way to find out.',
    condition: () => game.zone.cleared.length >= 1,
    done: () => game.zone.cleared.length >= 3 },
];

function defaultState() {
  return {
    resources: { shinies: 0, goblins: 0, food: 20, schemes: 0 },
    buildings: {},
    upgrades: [],
    assignments: { mining: 0, farming: 0, thinking: 0, fighting: 0 },
    zone: { current: 0, progress: 0, fighting: false, cleared: [] },
    prestige: { totalPoints: 0, spentPoints: 0, times: 0, perks: {} },
    multipliers: {
      click: 1, mining: 1, food: 1, schemes: 1, global: 1,
      traps: 1, combat: 1, goblinProd: 1,
      prestige: 1, prestigeCombat: 1, prestigeClick: 1,
    },
    bonuses: { maxGoblins: 0, foodCap: 0 },
    flags: { overtimePay: false, middleManagement: false },
    stats: { totalClicks: 0, totalShinies: 0, highestZone: 0, totalZonesCleared: 0 },
    unlocks: {},
    introSeen: false,
    tutorialDismissed: [],
    memos: [],
    log: [],
    lastTick: Date.now(),
    version: 2,
  };
}

let game = defaultState();


// ===========================================
// SECTION 3: UTILITY
// ===========================================

function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  if (n >= 100) return Math.floor(n).toString();
  if (n >= 1) return n.toFixed(1);
  if (n > 0) return n.toFixed(2);
  return '0';
}

function fmtRate(n) {
  if (n === 0) return '';
  const sign = n > 0 ? '+' : '';
  return sign + fmt(n) + '/s';
}

function announce(msg) {
  const el = document.getElementById('sr-announcements');
  if (el) {
    el.textContent = '';
    // Force re-announcement by clearing then setting after a tick
    requestAnimationFrame(() => { el.textContent = msg; });
  }
}

function addLog(msg, type = '') {
  game.log.unshift({ msg, type, time: Date.now() });
  if (game.log.length > 50) game.log.length = 50;
  // Announce important events to screen readers (not routine saves)
  if (type === 'reward' || type === 'combat' || type === 'story' || type === 'warning') {
    announce(msg);
  }
}


// ===========================================
// SECTION 4: SAVE / LOAD
// ===========================================

const Game = {
  save() {
    try {
      localStorage.setItem('goblinInc', JSON.stringify(game));
      addLog('Game saved.', '');
    } catch (e) {
      addLog('Save failed!', 'warning');
    }
  },

  load() {
    try {
      const raw = localStorage.getItem('goblinInc');
      if (!raw) return false;
      const data = JSON.parse(raw);
      const def = defaultState();
      // Merge saved data with defaults for new fields
      game = deepMerge(def, data);
      // Re-apply purchased upgrades
      for (const uid of game.upgrades) {
        const upg = UPGRADES.find(u => u.id === uid);
        if (upg) upg.apply();
      }
      // Re-apply prestige perks
      for (const perk of PRESTIGE_PERKS) {
        const lvl = game.prestige.perks[perk.id] || 0;
        if (lvl > 0) perk.apply(lvl);
      }
      // Offline progress
      const now = Date.now();
      const elapsed = (now - game.lastTick) / 1000;
      if (elapsed > 5) {
        const cappedTime = Math.min(elapsed, 3600 * 4); // cap at 4 hours
        tickResources(cappedTime);
        addLog(`Welcome back! ${Math.floor(cappedTime / 60)} min of offline progress applied.`, 'reward');
      }
      game.lastTick = now;
      return true;
    } catch (e) {
      console.error('Load failed:', e);
      return false;
    }
  },

  exportSave() {
    const data = btoa(JSON.stringify(game));
    const ta = document.createElement('textarea');
    ta.value = data;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    addLog('Save exported to clipboard!', 'reward');
  },

  importSave() {
    const data = prompt('Paste your save data:');
    if (!data) return;
    try {
      const parsed = JSON.parse(atob(data));
      const def = defaultState();
      game = deepMerge(def, parsed);
      for (const uid of game.upgrades) {
        const upg = UPGRADES.find(u => u.id === uid);
        if (upg) upg.apply();
      }
      for (const perk of PRESTIGE_PERKS) {
        const lvl = game.prestige.perks[perk.id] || 0;
        if (lvl > 0) perk.apply(lvl);
      }
      addLog('Save imported!', 'reward');
      Game.save();
    } catch (e) {
      addLog('Import failed — invalid data.', 'warning');
    }
  },

  hardReset() {
    if (!confirm('Are you sure? This erases ALL progress, including prestige.')) return;
    if (!confirm('REALLY sure? Last chance.')) return;
    localStorage.removeItem('goblinInc');
    game = defaultState();
    UI._lastLogLength = 0;
    UI.currentTab = 'gather';
    UI.switchTab('gather');
    Game.showIntro();
  },

  // --- INTRO ---

  _introPage: 0,

  showIntro() {
    Game._introPage = 0;
    const overlay = document.getElementById('intro-overlay');
    const textEl = document.getElementById('intro-text');
    const btn = document.getElementById('intro-next-btn');
    overlay.classList.remove('hidden');
    textEl.innerHTML = INTRO_PAGES[0];
    btn.textContent = 'Continue';
    btn.focus();
  },

  advanceIntro() {
    Game._introPage++;
    const textEl = document.getElementById('intro-text');
    const btn = document.getElementById('intro-next-btn');
    if (Game._introPage >= INTRO_PAGES.length) {
      // Done - close overlay, start game
      document.getElementById('intro-overlay').classList.add('hidden');
      game.introSeen = true;
      Game.save();
      return;
    }
    textEl.innerHTML = INTRO_PAGES[Game._introPage];
    if (Game._introPage === INTRO_PAGES.length - 1) {
      btn.textContent = 'Begin';
    }
    btn.focus();
  },

  // --- CORE ACTIONS ---

  gather() {
    let amount = getClickPower();
    game.resources.shinies += amount;
    game.stats.totalShinies += amount;
    game.stats.totalClicks++;
    spawnFloat(amount);
  },

  assign(role) {
    const idle = getIdleGoblins();
    if (idle < 1) return;
    game.assignments[role]++;
  },

  unassign(role) {
    if (game.assignments[role] <= 0) return;
    game.assignments[role]--;
  },

  buyBuilding(id) {
    const bld = BUILDINGS[id];
    const lvl = game.buildings[id] || 0;
    const cost = getBuildingCost(id, lvl);
    if (!canAfford(cost)) {
      const needed = [];
      for (const [res, amt] of Object.entries(cost)) {
        const have = game.resources[res] || 0;
        if (have < amt) needed.push(`${fmt(amt - have)} more ${res}`);
      }
      addLog(`Can't afford ${bld.name} — need ${needed.join(', ')}.`, 'warning');
      return;
    }
    payCost(cost);
    game.buildings[id] = lvl + 1;
    UI._lastBuildState = ''; // force re-render
    const newLvl = lvl + 1;
    // Show story text for milestone levels, plain message otherwise
    if (bld.story && bld.story[newLvl]) {
      addLog(bld.story[newLvl], 'story');
    } else {
      addLog(`${bld.name} upgraded to Lv.${newLvl}.`, 'reward');
    }
  },

  buyUpgrade(id) {
    const upg = UPGRADES.find(u => u.id === id);
    if (!upg || game.upgrades.includes(id)) return;
    if (!canAfford(upg.cost)) {
      addLog(`Can't afford ${upg.name} yet.`, 'warning');
      return;
    }
    payCost(upg.cost);
    game.upgrades.push(id);
    upg.apply();
    UI._lastResearchState = ''; // force re-render
    if (upg.story) {
      addLog(upg.story, 'story');
    } else {
      addLog(`Research complete: ${upg.name}. ${upg.effect}`, 'reward');
    }
  },

  toggleFight() {
    if (game.zone.fighting) {
      Game.retreat();
      return;
    }
    if (game.assignments.fighting <= 0) {
      addLog('Assign goblins to Fighting first!', 'warning');
      return;
    }
    game.zone.fighting = true;
    addLog(`Goblins sent into Zone ${game.zone.current + 1}!`, 'combat');
  },

  retreat() {
    game.zone.fighting = false;
    addLog('Goblins retreated!', 'combat');
  },

  nextZone() {
    game.zone.current++;
    game.zone.progress = 0;
    game.zone.fighting = false;
    if (game.zone.current > game.stats.highestZone) {
      game.stats.highestZone = game.zone.current;
    }
    checkMemos();
    UI.renderDungeon();
  },

  buyPerk(id) {
    const perk = PRESTIGE_PERKS.find(p => p.id === id);
    if (!perk) return;
    const lvl = game.prestige.perks[id] || 0;
    if (lvl >= perk.maxLevel) return;
    const cost = perk.cost(lvl);
    const available = game.prestige.totalPoints - game.prestige.spentPoints;
    if (available < cost) return;
    game.prestige.spentPoints += cost;
    game.prestige.perks[id] = lvl + 1;
    perk.apply(lvl + 1);
    addLog(`Perk upgraded: ${perk.name} (Level ${lvl + 1})`, 'reward');
  },

  doPrestige() {
    if (game.zone.current < 9) {
      addLog('Reach Zone 10 to franchise!', 'warning');
      return;
    }
    const points = getPrestigePoints();
    if (points <= 0) return;
    if (!confirm(`Franchise for ${points} Franchise Points? You'll lose all resources, buildings, and upgrades.`)) return;

    const keepPrestige = {
      totalPoints: game.prestige.totalPoints + points,
      spentPoints: game.prestige.spentPoints,
      times: game.prestige.times + 1,
      perks: { ...game.prestige.perks },
    };
    const keepStats = { ...game.stats };
    const keepMemos = [...game.memos];

    game = defaultState();
    game.prestige = keepPrestige;
    game.stats = keepStats;
    game.memos = keepMemos;

    // Re-apply prestige perks
    for (const perk of PRESTIGE_PERKS) {
      const lvl = game.prestige.perks[perk.id] || 0;
      if (lvl > 0) perk.apply(lvl);
    }

    addLog(`Franchised! Earned ${points} Franchise Points.`, 'reward');
    addMemo({
      type: 'prestige',
      title: `FRANCHISE #${game.prestige.times} COMPLETE`,
      body: getPrestigeFlavorText(game.prestige.times),
    });

    Game.save();
    UI.switchTab('gather');
  },
};


// ===========================================
// SECTION 5: CALCULATIONS
// ===========================================

function getClickPower() {
  let base = 1;
  base *= game.multipliers.click;
  base *= game.multipliers.prestigeClick;
  if (game.flags.overtimePay) {
    base += getProductionRates().shinies * 0.1;
  }
  return base;
}

function getMaxGoblins() {
  const hutLevel = game.buildings.goblinHut || 0;
  return 5 + hutLevel * 5 + game.bonuses.maxGoblins;
}

function getFoodCap() {
  const farmLevel = game.buildings.mushroomFarm || 0;
  return 50 + farmLevel * 30 + game.bonuses.foodCap;
}

function getIdleGoblins() {
  const total = Math.floor(game.resources.goblins);
  const assigned = game.assignments.mining + game.assignments.farming
    + game.assignments.thinking + game.assignments.fighting;
  return Math.max(0, total - assigned);
}

function getTotalAssigned() {
  return game.assignments.mining + game.assignments.farming
    + game.assignments.thinking + game.assignments.fighting;
}

function getProductionRates() {
  const g = game.multipliers.global * game.multipliers.prestige;
  const tradingBonus = 1 + 0.05 * (game.buildings.tradingPost || 0);
  const globalMult = g * tradingBonus;

  // === CORE LOOP: Buildings MULTIPLY goblin output ===
  // More building levels = each assigned goblin produces more
  // More goblins = more workers to assign
  // But more goblins = more food needed = more farmers needed

  const mineLvl = game.buildings.shinyMine || 0;
  const mineBonus = 1 + mineLvl * 0.5;  // each mine level = +50% per miner
  let shiniesPS = game.assignments.mining * 0.5 * mineBonus * game.multipliers.mining * globalMult;
  // Tiny trickle from building alone (so it's not zero with no miners)
  shiniesPS += mineLvl * 0.08 * game.multipliers.mining * globalMult;
  // Middle management
  if (game.flags.middleManagement) {
    shiniesPS += getIdleGoblins() * 0.2 * globalMult;
  }

  const farmLvl = game.buildings.mushroomFarm || 0;
  const farmBonus = 1 + farmLvl * 0.5;  // each farm level = +50% per farmer
  let foodPS = game.assignments.farming * 0.4 * farmBonus * game.multipliers.food * globalMult;
  // Small base from building
  foodPS += farmLvl * 0.08 * game.multipliers.food * globalMult;
  // Goblins eat food — they're hungry little things
  const totalGoblins = Math.floor(game.resources.goblins);
  const foodConsumption = totalGoblins * 0.12;
  const netFoodPS = foodPS - foodConsumption;

  const thinkLvl = game.buildings.thinkinRock || 0;
  const thinkBonus = 1 + thinkLvl * 0.5;  // each rock level = +50% per thinker
  let schemesPS = game.assignments.thinking * 0.2 * thinkBonus * game.multipliers.schemes * globalMult;
  // Small base from building
  schemesPS += thinkLvl * 0.03 * game.multipliers.schemes * globalMult;

  const hutLvl = game.buildings.goblinHut || 0;
  let goblinsPS = hutLvl * 0.15 * game.multipliers.goblinProd;
  if (game.resources.goblins >= getMaxGoblins()) goblinsPS = 0;
  if (game.resources.food <= 0 && netFoodPS <= 0) goblinsPS = 0;

  return {
    shinies: shiniesPS,
    food: netFoodPS,
    foodGross: foodPS,
    foodConsumption,
    schemes: schemesPS,
    goblins: goblinsPS,
  };
}

function getCombatPower() {
  const fighters = game.assignments.fighting;
  if (fighters <= 0) return 0;
  const trapLvl = game.buildings.trapWorkshop || 0;
  const trapBonus = 1 + 0.1 * trapLvl * game.multipliers.traps;
  return fighters * 5 * trapBonus * game.multipliers.combat * game.multipliers.prestigeCombat;
}

function getZoneStats(zoneIdx) {
  const hp = 50 * Math.pow(1.55, zoneIdx);
  const str = 5 * Math.pow(1.45, zoneIdx);
  const reward = Math.floor(20 * Math.pow(1.5, zoneIdx));
  return { hp, str, reward };
}

function getBuildingCost(id, lvl) {
  const bld = BUILDINGS[id];
  const cost = {};
  for (const [res, base] of Object.entries(bld.baseCost)) {
    cost[res] = Math.ceil(base * Math.pow(bld.costMult, lvl));
  }
  return cost;
}

function canAfford(cost) {
  for (const [res, amt] of Object.entries(cost)) {
    if ((game.resources[res] || 0) < amt) return false;
  }
  return true;
}

function payCost(cost) {
  for (const [res, amt] of Object.entries(cost)) {
    game.resources[res] -= amt;
  }
}

function getPrestigePoints() {
  const zone = game.zone.current;
  if (zone < 9) return 0;
  return Math.floor(Math.pow(zone + 1, 1.5));
}

function getPrestigeFlavorText(times) {
  const texts = [
    'The dungeon collapsed. As dungeons do. But we learned something: goblins can, in fact, read books. Some of them. One of them. The point is: we\'re back, and we brought EXPERIENCE.',
    'Second franchise! Chad Thornington III sent a sympathy card. It burst into flames. His loss.',
    'Third time\'s the charm? More like third time\'s the FRANCHISE. Our brand recognition is through the roof. Literally — the roof collapsed.',
    'At this point, franchising is just how we say hello. Hello. We\'re Goblin Inc. We own everything.',
    'We\'ve franchised so many times that "franchise" is now a goblin greeting. "Franchise, Dave." "Franchise, Steve."',
  ];
  return texts[Math.min(times - 1, texts.length - 1)];
}


// ===========================================
// SECTION 6: GAME LOOP
// ===========================================

function tickResources(dt) {
  const rates = getProductionRates();

  game.resources.shinies += rates.shinies * dt;
  game.resources.schemes += rates.schemes * dt;
  game.resources.goblins += rates.goblins * dt;

  // Food with cap
  if (rates.foodGross > 0) {
    game.resources.food += rates.foodGross * dt;
  }
  game.resources.food -= rates.foodConsumption * dt;

  // Caps
  const maxGoblins = getMaxGoblins();
  if (game.resources.goblins > maxGoblins) game.resources.goblins = maxGoblins;
  const foodCap = getFoodCap();
  if (game.resources.food > foodCap) game.resources.food = foodCap;

  // Food warnings
  const foodPct = getFoodCap() > 0 ? game.resources.food / getFoodCap() : 0;
  if (game.resources.food > 0 && foodPct < 0.15 && Math.floor(game.resources.goblins) > 0 && !game._lastFoodWarning) {
    addLog('Goblins getting HUNGRY. Tummies rumbling. Need more food or they gonna LEAVE!', 'warning');
    game._lastFoodWarning = true;
  }
  if (foodPct >= 0.3) game._lastFoodWarning = false;

  // Floor at 0
  if (game.resources.shinies < 0) game.resources.shinies = 0;
  if (game.resources.food < 0) {
    game.resources.food = 0;
    // Starving goblins leave
    if (Math.floor(game.resources.goblins) > 0) {
      game.resources.goblins -= 0.15 * dt;
      if (game.resources.goblins < 0) game.resources.goblins = 0;
      // Warn about starvation
      if (!game._starvationWarned) {
        addLog('NO FOOD! Goblins walking away! They not stupid — can\'t work on empty tummy! Build farms! Assign farmers!', 'warning');
        game._starvationWarned = true;
      }
      // Unassign if needed
      while (getTotalAssigned() > Math.floor(game.resources.goblins)) {
        unassignOne();
      }
    }
  } else {
    game._starvationWarned = false;
  }
  if (game.resources.schemes < 0) game.resources.schemes = 0;
  if (game.resources.goblins < 0) game.resources.goblins = 0;

  game.stats.totalShinies += Math.max(0, rates.shinies * dt);
}

function unassignOne() {
  // Unassign from last role first
  const order = ['thinking', 'farming', 'mining', 'fighting'];
  for (const role of order) {
    if (game.assignments[role] > 0) {
      game.assignments[role]--;
      return;
    }
  }
}

function tickCombat(dt) {
  if (!game.zone.fighting) return;

  const power = getCombatPower();
  const zs = getZoneStats(game.zone.current);

  if (power < zs.str * 0.2) {
    game.zone.fighting = false;
    addLog('Your goblins took one look and refused. They\'re not stupid.', 'warning');
    return;
  }

  const dps = Math.max(0, power - zs.str * 0.3);
  game.zone.progress += (dps / zs.hp) * 100 * dt;

  if (game.zone.progress >= 100) {
    game.zone.progress = 100;
    game.zone.fighting = false;
    game.zone.cleared.push(game.zone.current);
    game.stats.totalZonesCleared++;

    const z = ZONES[game.zone.current] || {};
    const reward = zs.reward;
    game.resources.shinies += reward;
    game.stats.totalShinies += reward;

    if (z.boss) {
      addLog(`BOSS DEFEATED: ${z.bossName}! Zone cleared, +${fmt(reward)} Shinies`, 'combat');
    } else {
      addLog(`Zone cleared: ${z.name || 'Zone ' + (game.zone.current + 1)}! +${fmt(reward)} Shinies`, 'reward');
    }

    checkMemos();
  }
}

let _silentUnlocks = false;

function checkUnlocks() {
  const u = game.unlocks;
  const b = game.buildings;
  const r = game.resources;
  const z = game.zone;

  function unlock(key, msg) {
    if (u[key]) return;
    u[key] = true;
    if (!_silentUnlocks && msg) addLog(msg, 'story');
  }

  // Tabs
  if (game.stats.totalClicks >= 3 || r.shinies >= 8 || Object.keys(b).length > 0)
    unlock('tabBuild', 'Got enough shinies to make something! Book has pictures of buildings. We can DO that! Build tab ready!');
  if (r.schemes > 0 || game.upgrades.length > 0 || (b.thinkinRock || 0) >= 1)
    unlock('tabResearch', 'A goblin had a THOUGHT. Not just "hungry" or "scared" — an actual idea. Book calls this "R and D." We call it big brain time. Research tab ready!');
  if (Math.floor(r.goblins) >= 1 || z.cleared.length > 0)
    unlock('tabDungeon', 'Got goblins now! Tunnels go deep and dark and something is DOWN THERE. Book says "expand or die." We pick expand. Dungeon tab ready!');
  if (game.memos.length > 0 && z.cleared.length >= 1)
    unlock('tabMemos', 'Found papers in the cleared zone! Old papers. Fancy writing. From whoever was here before. Can\'t read all of it but... this is important. Memos tab ready!');
  if (game.stats.highestZone >= 9)
    unlock('tabFranchise', 'Book chapter twelve: "Fran-chize-ing." Means do the whole thing AGAIN but keep what we learned. Sounds crazy. Also sounds smart? Franchise tab ready!');

  // Resources
  if ((b.mushroomFarm || 0) >= 1) unlock('resFood');
  if ((b.goblinHut || 0) >= 1 || Math.floor(r.goblins) >= 1) unlock('resGoblins');
  if ((b.thinkinRock || 0) >= 1 || r.schemes > 0 || game.upgrades.length > 0) unlock('resSchemes');

  // Workforce roles
  if (Math.floor(r.goblins) >= 1) unlock('workforce');
  if (u.workforce) unlock('assignMining');
  if (u.workforce && (b.mushroomFarm || 0) >= 1) unlock('assignFarming');
  if (u.workforce && (b.thinkinRock || 0) >= 1) unlock('assignThinking');
  if (u.workforce && u.tabDungeon) unlock('assignFighting');
}

function tick() {
  const now = Date.now();
  const dt = Math.min((now - game.lastTick) / 1000, 1); // cap delta to 1 sec per frame
  game.lastTick = now;

  tickResources(dt);
  tickCombat(dt);
  checkUnlocks();
}

function checkMemos() {
  for (const memo of MEMOS) {
    if (memo.zone <= game.zone.current && !game.memos.includes(memo.zone + ':' + memo.title)) {
      game.memos.push(memo.zone + ':' + memo.title);
      addLog(`New Memo: ${memo.title}`, 'story');
    }
  }
}


// ===========================================
// SECTION 7: UI
// ===========================================

const UI = {
  currentTab: 'gather',

  switchTab(tab) {
    // Check if tab is unlocked
    const tabUnlockMap = {
      build: 'tabBuild', research: 'tabResearch', dungeon: 'tabDungeon',
      memos: 'tabMemos', franchise: 'tabFranchise',
    };
    const unlockKey = tabUnlockMap[tab];
    if (unlockKey && !game.unlocks[unlockKey]) return;

    UI.currentTab = tab;
    document.querySelectorAll('.tab[role="tab"]').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    const activeTab = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.setAttribute('aria-selected', 'true');
    }
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${tab}`);
    if (panel) {
      panel.classList.add('active');
      // Move focus to the panel so screen readers announce it
      panel.setAttribute('tabindex', '-1');
      panel.focus();
    }
  },

  render() {
    UI.applyUnlocks();
    UI.renderTutorial();
    UI.renderResources();
    // Only render the active tab to avoid unnecessary DOM churn
    switch (UI.currentTab) {
      case 'gather': UI.renderGatherTab(); break;
      case 'build': UI.renderBuildTab(); break;
      case 'research': UI.renderResearchTab(); break;
      case 'dungeon': UI.renderDungeon(); break;
      case 'franchise': UI.renderFranchise(); break;
      case 'memos': UI.renderMemos(); break;
    }
    UI.renderLog();
  },

  applyUnlocks() {
    const u = game.unlocks;
    // Tabs
    toggle('tab-build', u.tabBuild);
    toggle('tab-research', u.tabResearch);
    toggle('tab-dungeon', u.tabDungeon);
    toggle('tab-memos', u.tabMemos);
    toggle('tab-franchise', u.tabFranchise);

    // Resources
    toggle('res-food', u.resFood);
    toggle('res-goblins', u.resGoblins);
    toggle('res-schemes', u.resSchemes);

    // Workforce section
    const hasWorkforce = u.workforce;
    toggle('workforce-section', hasWorkforce);
    const gatherPanel = document.getElementById('panel-gather');
    if (hasWorkforce) gatherPanel.classList.add('has-workforce');
    else gatherPanel.classList.remove('has-workforce');

    // Individual assignment rows
    toggle('assign-row-mining', u.assignMining);
    toggle('assign-row-farming', u.assignFarming);
    toggle('assign-row-thinking', u.assignThinking);
    toggle('assign-row-fighting', u.assignFighting);

    // Franchise tab locked state
    const franTab = document.getElementById('tab-franchise');
    if (u.tabFranchise) {
      franTab.classList.remove('locked');
      franTab.setAttribute('aria-disabled', 'false');
    }
  },

  renderTutorial() {
    const banner = document.getElementById('tutorial-banner');
    const textEl = document.getElementById('tutorial-text');

    // Find the first tutorial step that applies
    let activeStep = null;
    for (const step of TUTORIAL) {
      if (game.tutorialDismissed.includes(step.id)) continue;
      if (step.done()) { game.tutorialDismissed.push(step.id); continue; }
      if (step.condition()) { activeStep = step; break; }
    }

    if (activeStep) {
      banner.classList.remove('hidden');
      if (textEl.dataset.stepId !== activeStep.id) {
        textEl.textContent = activeStep.text;
        textEl.dataset.stepId = activeStep.id;
      }
    } else {
      banner.classList.add('hidden');
    }
  },

  dismissTutorial() {
    const textEl = document.getElementById('tutorial-text');
    const stepId = textEl.dataset.stepId;
    if (stepId && !game.tutorialDismissed.includes(stepId)) {
      game.tutorialDismissed.push(stepId);
    }
  },

  toggleChangelog() {
    const overlay = document.getElementById('changelog-overlay');
    const isHidden = overlay.classList.contains('hidden');
    if (isHidden) {
      const entries = document.getElementById('changelog-entries');
      let html = '';
      for (const entry of CHANGELOG) {
        html += `<div class="changelog-entry">
          <div class="changelog-entry-header">
            <span class="changelog-version">${entry.version}</span>
            <span class="changelog-date">${entry.date}</span>
          </div>
          <ul>${entry.changes.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>`;
      }
      entries.innerHTML = html;
      overlay.classList.remove('hidden');
      // Close on backdrop click
      overlay.onclick = (e) => {
        if (e.target === overlay) UI.toggleChangelog();
      };
      document.querySelector('.changelog-close').focus();
    } else {
      overlay.classList.add('hidden');
    }
  },

  toggleSettings() {
    const menu = document.getElementById('settings-menu');
    const btn = document.getElementById('settings-toggle');
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    // Close on click outside
    if (isHidden) {
      setTimeout(() => {
        const close = (e) => {
          if (!menu.contains(e.target) && e.target !== btn) {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', close);
          }
        };
        document.addEventListener('click', close);
      }, 0);
    }
  },

  renderResources() {
    const rates = getProductionRates();
    const maxG = getMaxGoblins();
    const foodCap = getFoodCap();

    document.getElementById('shinies-val').textContent = fmt(game.resources.shinies);
    document.getElementById('goblins-val').textContent = `${Math.floor(game.resources.goblins)} / ${maxG}`;
    document.getElementById('food-val').textContent = `${fmt(game.resources.food)} / ${foodCap}`;
    document.getElementById('schemes-val').textContent = fmt(game.resources.schemes);

    setRate('shinies-rate', rates.shinies);
    setRate('goblins-rate', rates.goblins);
    setRate('food-rate', rates.food);
    setRate('schemes-rate', rates.schemes);
  },

  renderGatherTab() {
    document.getElementById('per-click').textContent = fmt(getClickPower());
    document.getElementById('total-clicks').textContent = game.stats.totalClicks.toLocaleString();
    document.getElementById('gather-amount').textContent = `+${fmt(getClickPower())}`;

    const rates = getProductionRates();
    const idle = getIdleGoblins();
    document.getElementById('assign-idle').textContent = idle;
    document.getElementById('assign-mining').textContent = game.assignments.mining;
    document.getElementById('assign-farming').textContent = game.assignments.farming;
    document.getElementById('assign-thinking').textContent = game.assignments.thinking;
    document.getElementById('assign-fighting').textContent = game.assignments.fighting;

    const g = game.multipliers.global * game.multipliers.prestige;
    const tradingBonus = 1 + 0.05 * (game.buildings.tradingPost || 0);
    const gm = g * tradingBonus;
    const mineLvl = game.buildings.shinyMine || 0;
    const farmLvl = game.buildings.mushroomFarm || 0;
    const thinkLvl = game.buildings.thinkinRock || 0;
    const mineRate = 0.5 * (1 + mineLvl * 0.5) * game.multipliers.mining * gm;
    const farmRate = 0.4 * (1 + farmLvl * 0.5) * game.multipliers.food * gm;
    const thinkRate = 0.2 * (1 + thinkLvl * 0.5) * game.multipliers.schemes * gm;
    document.getElementById('assign-mining-effect').textContent =
      game.assignments.mining > 0 ? `+${fmt(game.assignments.mining * mineRate)}/s` : (mineLvl > 0 ? `${fmt(mineRate)}/s each` : 'need mine');
    document.getElementById('assign-farming-effect').textContent =
      game.assignments.farming > 0 ? `+${fmt(game.assignments.farming * farmRate)}/s` : (farmLvl > 0 ? `${fmt(farmRate)}/s each` : 'need farm');
    document.getElementById('assign-thinking-effect').textContent =
      game.assignments.thinking > 0 ? `+${fmt(game.assignments.thinking * thinkRate)}/s` : (thinkLvl > 0 ? `${fmt(thinkRate)}/s each` : 'need rock');
    document.getElementById('assign-fighting-effect').textContent =
      game.assignments.fighting > 0 ? `Power: ${fmt(getCombatPower())}` : '5 pwr each';
  },

  _lastBuildState: '',

  renderBuildTab() {
    // Build a state fingerprint to avoid unnecessary DOM rebuilds
    // (Rebuilding innerHTML 15x/sec breaks click events on buttons)
    const stateKey = Object.entries(BUILDINGS).map(([id, bld]) => {
      const lvl = game.buildings[id] || 0;
      const cost = getBuildingCost(id, lvl);
      const affordable = canAfford(cost) ? 1 : 0;
      const unlocked = (game.zone.current >= bld.unlockZone || game.zone.cleared.includes(bld.unlockZone - 1) || bld.unlockZone === 0 || lvl > 0) ? 1 : 0;
      return `${id}:${lvl}:${affordable}:${unlocked}`;
    }).join('|');

    if (stateKey === UI._lastBuildState) return;
    UI._lastBuildState = stateKey;

    const container = document.getElementById('buildings-list');
    let html = '';
    for (const [id, bld] of Object.entries(BUILDINGS)) {
      const lvl = game.buildings[id] || 0;
      const cost = getBuildingCost(id, lvl);
      const affordable = canAfford(cost);
      const unlocked = game.zone.current >= bld.unlockZone || game.zone.cleared.includes(bld.unlockZone - 1) || bld.unlockZone === 0 || lvl > 0;

      // Hide locked buildings entirely - they appear when unlocked
      if (!unlocked) continue;

      html += `<div class="building-card" role="listitem">
        <div class="building-info">
          <span class="building-name">${bld.name}<span class="building-level">Lv.${lvl}</span></span>
          <div class="building-desc">${bld.desc}</div>
          <div class="building-effect">${bld.effect(lvl + 1)}</div>
        </div>
        <div class="building-buy">
          <button class="buy-btn ${affordable ? '' : 'btn-unaffordable'}" onclick="Game.buyBuilding('${id}')"
            aria-label="${affordable ? 'Build' : 'Cannot afford'} ${bld.name} level ${lvl + 1}, costs ${formatCostText(cost)}">
            ${affordable ? (lvl > 0 ? 'Build +1' : 'Build') : 'Need Shinies'}
          </button>
          <div class="building-cost">${formatCost(cost, affordable)}</div>
        </div>
      </div>`;
    }
    if (!html) {
      html = '<p class="flavor-text">Nothing to build yet. Keep gathering Shinies!</p>';
    }
    container.innerHTML = html;
  },

  _lastResearchState: '',

  renderResearchTab() {
    // State fingerprint to avoid innerHTML rebuild race condition
    const stateKey = UPGRADES.map(upg => {
      const purchased = game.upgrades.includes(upg.id) ? 1 : 0;
      const unlocked = (game.zone.current >= upg.unlockZone || game.zone.cleared.includes(upg.unlockZone - 1) || upg.unlockZone === 0) ? 1 : 0;
      const affordable = (!purchased && canAfford(upg.cost)) ? 1 : 0;
      return `${upg.id}:${purchased}:${unlocked}:${affordable}`;
    }).join('|');

    if (stateKey === UI._lastResearchState) return;
    UI._lastResearchState = stateKey;

    const container = document.getElementById('upgrades-list');
    let html = '';
    let anyVisible = false;

    for (const upg of UPGRADES) {
      const purchased = game.upgrades.includes(upg.id);
      const unlocked = game.zone.current >= upg.unlockZone || game.zone.cleared.includes(upg.unlockZone - 1) || upg.unlockZone === 0;

      if (!unlocked && !purchased) continue;
      anyVisible = true;

      if (purchased) {
        html += `<div class="upgrade-card purchased" role="listitem">
          <div class="upgrade-info">
            <span class="upgrade-name">${upg.name}</span>
            <div class="upgrade-desc">${upg.effect}</div>
          </div>
          <span class="upgrade-bought-label">Researched</span>
        </div>`;
      } else {
        const affordable = canAfford(upg.cost);
        html += `<div class="upgrade-card" role="listitem">
          <div class="upgrade-info">
            <span class="upgrade-name">${upg.name}</span>
            <div class="upgrade-desc">${upg.desc}</div>
            <div class="building-effect">${upg.effect}</div>
          </div>
          <div class="building-buy">
            <button class="buy-btn ${affordable ? '' : 'btn-unaffordable'}" onclick="Game.buyUpgrade('${upg.id}')"
              aria-label="${affordable ? 'Research' : 'Cannot afford'} ${upg.name}, costs ${formatCostText(upg.cost)}. ${upg.effect}">
              ${affordable ? 'Research' : 'Need Schemes'}
            </button>
            <div class="building-cost">${formatCost(upg.cost, affordable)}</div>
          </div>
        </div>`;
      }
    }

    if (!anyVisible) {
      html = '<p class="flavor-text">No research available yet. Explore more dungeon zones to find inspiration.</p>';
    }
    container.innerHTML = html;
  },

  renderDungeon() {
    const zi = game.zone.current;
    const z = ZONES[zi] || { name: `Zone ${zi + 1}`, desc: 'Uncharted territory. Here be goblins.', boss: false };
    const zs = getZoneStats(zi);
    const power = getCombatPower();
    const cleared = game.zone.progress >= 100;

    document.getElementById('zone-name').textContent = `Zone ${zi + 1}: ${z.name}`;
    document.getElementById('zone-desc').textContent = z.desc;
    document.getElementById('zone-strength').textContent = fmt(zs.str);
    document.getElementById('player-power').textContent = fmt(power);
    document.getElementById('fighter-count').textContent = game.assignments.fighting;

    const progress = Math.min(game.zone.progress, 100);
    document.getElementById('zone-progress-fill').style.width = progress + '%';
    document.getElementById('zone-progress-text').textContent = progress.toFixed(1) + '%';
    const progressBar = document.getElementById('zone-progress-bar');
    if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(progress));

    // Show/hide combat vs rewards
    if (cleared) {
      document.getElementById('zone-combat').style.display = 'none';
      document.getElementById('zone-rewards').style.display = 'block';
      document.getElementById('zone-reward-text').textContent = `+${fmt(zs.reward)} Shinies earned!`;
    } else {
      document.getElementById('zone-combat').style.display = 'block';
      document.getElementById('zone-rewards').style.display = 'none';

      const fightBtn = document.getElementById('zone-fight-btn');
      const retreatBtn = document.getElementById('zone-retreat-btn');
      if (game.zone.fighting) {
        fightBtn.style.display = 'none';
        retreatBtn.style.display = '';
      } else {
        fightBtn.style.display = '';
        retreatBtn.style.display = 'none';
        fightBtn.disabled = game.assignments.fighting <= 0;
      }
    }

    // Zone map
    const mapContainer = document.getElementById('zone-list');
    let mapHtml = '';
    const maxShow = Math.max(zi + 2, game.stats.highestZone + 2);
    for (let i = 0; i < Math.min(maxShow, 30); i++) {
      const isCleared = game.zone.cleared.includes(i) || (i === zi && cleared);
      const isCurrent = i === zi && !cleared;
      const isBoss = ZONES[i]?.boss || false;
      let cls = 'zone-pip';
      if (isCleared) cls += ' cleared';
      if (isCurrent) cls += ' current';
      if (isBoss) cls += ' boss';
      mapHtml += `<div class="${cls}" title="${ZONES[i]?.name || 'Zone ' + (i + 1)}">${i + 1}</div>`;
    }
    mapContainer.innerHTML = mapHtml;
  },

  renderFranchise() {
    if (!game.unlocks.tabFranchise) return;
    document.getElementById('franchise-locked').style.display = 'none';
    document.getElementById('franchise-content').style.display = 'block';

    const points = getPrestigePoints();
    const available = game.prestige.totalPoints - game.prestige.spentPoints;

    document.getElementById('fran-current-zone').textContent = game.zone.current + 1;
    document.getElementById('fran-points-available').textContent = points;
    document.getElementById('fran-total-points').textContent = `${available} unspent / ${game.prestige.totalPoints} total`;
    document.getElementById('fran-times').textContent = game.prestige.times;
    document.getElementById('fran-bonus').textContent = `+${Math.round((game.multipliers.prestige - 1) * 100)}%`;

    const franBtn = document.getElementById('franchise-btn');
    franBtn.disabled = game.zone.current < 9;
    franBtn.textContent = game.zone.current < 9
      ? 'Reach Zone 10 to Franchise'
      : `Franchise for ${points} Points`;

    // Perks
    const perksContainer = document.getElementById('perks-list');
    let html = '';
    for (const perk of PRESTIGE_PERKS) {
      const lvl = game.prestige.perks[perk.id] || 0;
      const maxed = lvl >= perk.maxLevel;
      const cost = maxed ? 0 : perk.cost(lvl);
      const canBuy = !maxed && available >= cost;

      html += `<div class="perk-card ${maxed ? 'maxed' : ''}">
        <div class="perk-info">
          <span class="perk-name">${perk.name}<span class="perk-level">${lvl}/${perk.maxLevel}</span></span>
          <div class="perk-desc">${maxed ? perk.effect(lvl) : perk.effect(lvl + 1)}</div>
        </div>
        ${maxed
          ? '<span class="upgrade-bought-label">Maxed</span>'
          : `<span class="perk-cost">${cost} FP</span>
             <button class="buy-btn" onclick="Game.buyPerk('${perk.id}')" ${canBuy ? '' : 'disabled'}>Buy</button>`
        }
      </div>`;
    }
    perksContainer.innerHTML = html;
  },

  renderMemos() {
    const container = document.getElementById('memos-list');
    let html = '';

    // Show memos in reverse order (newest first)
    const unlockedMemos = MEMOS.filter(m => game.memos.includes(m.zone + ':' + m.title));
    for (let i = unlockedMemos.length - 1; i >= 0; i--) {
      const m = unlockedMemos[i];
      html += `<div class="memo-card ${m.type === 'boss' ? 'boss-memo' : ''} ${m.type === 'prestige' ? 'prestige-memo' : ''}">
        <div class="memo-header">Goblin Inc. Internal Memo — Zone ${m.zone + 1}</div>
        <div class="memo-title">${m.title}</div>
        <div class="memo-body">${m.body.replace(/\n/g, '<br>')}</div>
      </div>`;
    }

    // Also show prestige memos
    // (These are stored dynamically)
    if (!html) {
      html = '<p class="flavor-text">No memos yet. Explore the dungeon to receive corporate communications.</p>';
    }
    container.innerHTML = html;
  },

  _lastLogLength: 0,

  renderLog() {
    // Only update DOM when there's a new log message
    if (game.log.length === UI._lastLogLength) return;
    UI._lastLogLength = game.log.length;
    const container = document.getElementById('log-messages');
    let html = '';
    for (let i = 0; i < Math.min(game.log.length, 10); i++) {
      const entry = game.log[i];
      html += `<div class="log-msg ${entry.type}">${entry.msg}</div>`;
    }
    container.innerHTML = html;
  },

};


// --- UI HELPERS ---

function toggle(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  if (visible) el.classList.remove('hidden');
  else el.classList.add('hidden');
}

function setRate(id, rate) {
  const el = document.getElementById(id);
  el.textContent = fmtRate(rate);
  el.className = 'res-rate' + (rate > 0 ? ' positive' : rate < 0 ? ' negative' : '');
}

function formatCost(cost, affordable) {
  const parts = [];
  for (const [res, amt] of Object.entries(cost)) {
    const name = res.charAt(0).toUpperCase() + res.slice(1);
    const cls = (game.resources[res] || 0) >= amt ? 'cost-affordable' : 'cost-expensive';
    parts.push(`<span class="${cls}">${fmt(amt)} ${name}</span>`);
  }
  return parts.join(' + ');
}

function formatCostText(cost) {
  const parts = [];
  for (const [res, amt] of Object.entries(cost)) {
    const name = res.charAt(0).toUpperCase() + res.slice(1);
    parts.push(`${fmt(amt)} ${name}`);
  }
  return parts.join(' and ');
}

function spawnFloat(amount) {
  const btn = document.getElementById('gather-btn');
  const rect = btn.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-number';
  el.textContent = '+' + fmt(amount);
  el.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
  el.style.top = (rect.top - 10) + 'px';
  document.getElementById('float-container').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function addMemo(memo) {
  const key = (memo.zone || 'p') + ':' + memo.title;
  if (!game.memos.includes(key)) {
    game.memos.push(key);
    // Store dynamic memos in MEMOS array for rendering
    MEMOS.push({ ...memo, zone: memo.zone || game.zone.current });
  }
}


// --- DEEP MERGE ---

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
        && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}


// ===========================================
// SECTION 8: INITIALIZATION
// ===========================================

function init() {
  Game.load();
  _silentUnlocks = true;
  checkUnlocks();
  _silentUnlocks = false;
  checkMemos();

  // Show intro on first play
  if (!game.introSeen) {
    Game.showIntro();
  }

  // Auto-save every 30 seconds
  setInterval(() => Game.save(), 30000);

  // Game loop: tick + render
  let lastRender = 0;
  function gameLoop(timestamp) {
    tick();
    // Render at ~15fps for efficiency
    if (timestamp - lastRender > 66) {
      UI.render();
      lastRender = timestamp;
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Don't intercept if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Escape closes changelog
    if (e.key === 'Escape') {
      const changelog = document.getElementById('changelog-overlay');
      if (!changelog.classList.contains('hidden')) {
        UI.toggleChangelog();
        return;
      }
    }

    const tabList = ['gather', 'build', 'research', 'dungeon', 'franchise', 'memos'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
      UI.switchTab(tabList[num - 1]);
    }
    // Space to gather
    if (e.key === ' ' && UI.currentTab === 'gather') {
      e.preventDefault();
      Game.gather();
    }
  });

  // Arrow key navigation within tablist
  const tablist = document.getElementById('tabs');
  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const tabs = Array.from(tablist.querySelectorAll('.tab[role="tab"]'));
      const current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      let next = -1;
      if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next >= 0) {
        e.preventDefault();
        tabs[next].focus();
      }
    });
  }

  if (game.stats.totalClicks > 0) {
    addLog('Welcome back, CEO.', '');
  }
}

// Start the game
document.addEventListener('DOMContentLoaded', init);
