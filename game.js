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
    effect: (lvl) => `+${fmt(0.5 * lvl)} Shinies/s`,
    unlockZone: 0,
  },
  goblinHut: {
    name: 'Goblin Hut',
    desc: 'A hut for making more goblins. Don\'t ask how.',
    baseCost: { shinies: 50 },
    costMult: 1.18,
    effect: (lvl) => `+${5 * lvl} max goblins, +${fmt(0.15 * lvl)} goblins/s`,
    unlockZone: 0,
  },
  mushroomFarm: {
    name: 'Mushroom Farm',
    desc: 'Grows mushrooms in the dark. Just like a real farm, except underground and slightly cursed.',
    baseCost: { shinies: 15 },
    costMult: 1.15,
    effect: (lvl) => `+${fmt(0.4 * lvl)} Food/s, +${30 * lvl} food cap`,
    unlockZone: 0,
  },
  thinkinRock: {
    name: "Thinkin' Rock",
    desc: 'A special rock for sitting and having ideas. Very exclusive. One goblin at a time.',
    baseCost: { shinies: 30 },
    costMult: 1.20,
    effect: (lvl) => `+${fmt(0.15 * lvl)} Schemes/s`,
    unlockZone: 2,
  },
  trapWorkshop: {
    name: 'Trap Workshop',
    desc: 'Where goblins build elaborate traps that mostly work. The ones that don\'t are "learning opportunities."',
    baseCost: { shinies: 120, schemes: 5 },
    costMult: 1.25,
    effect: (lvl) => `+${10 * lvl}% combat power`,
    unlockZone: 4,
  },
  tradingPost: {
    name: 'Trading Post',
    desc: 'Trade with the outside world. Mostly selling things we "found." Don\'t say "stole."',
    baseCost: { shinies: 250, schemes: 15 },
    costMult: 1.30,
    effect: (lvl) => `+${5 * lvl}% all production`,
    unlockZone: 7,
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
  },
  {
    id: 'biggerPockets',
    name: 'Bigger Pockets',
    desc: 'Management-approved trouser upgrades.',
    cost: { schemes: 10 },
    effect: '2x click power',
    unlockZone: 1,
    apply: () => { game.multipliers.click *= 2; },
  },
  {
    id: 'mushroomSeasoning',
    name: 'Mushroom Seasoning',
    desc: 'The mushrooms taste slightly less like feet now.',
    cost: { schemes: 20 },
    effect: '2x food production',
    unlockZone: 2,
    apply: () => { game.multipliers.food *= 2; },
  },
  {
    id: 'thinkHarder',
    name: 'Think Harder',
    desc: 'Posted a sign above the rock that says "THINK HARDER." Surprisingly effective.',
    cost: { schemes: 35 },
    effect: '2x scheme production',
    unlockZone: 3,
    apply: () => { game.multipliers.schemes *= 2; },
  },
  {
    id: 'motivationalPosters',
    name: 'Motivational Posters',
    desc: '"Hang in there" but the cat is a goblin dangling over a pit.',
    cost: { schemes: 50 },
    effect: '+50% all production',
    unlockZone: 3,
    apply: () => { game.multipliers.global *= 1.5; },
  },
  {
    id: 'betterTraps',
    name: 'Better Traps',
    desc: 'Now with 40% fewer accidental goblin casualties.',
    cost: { schemes: 40 },
    effect: '2x trap effectiveness',
    unlockZone: 5,
    apply: () => { game.multipliers.traps *= 2; },
  },
  {
    id: 'goblinDaycare',
    name: 'Goblin Daycare',
    desc: 'Tiny goblins raised by slightly less tiny goblins.',
    cost: { schemes: 55 },
    effect: '2x goblin production rate',
    unlockZone: 4,
    apply: () => { game.multipliers.goblinProd *= 2; },
  },
  {
    id: 'corporateRetreat',
    name: 'Corporate Retreat',
    desc: 'A weekend of trust falls into spike pits. Team building!',
    cost: { schemes: 120 },
    effect: '2x all production',
    unlockZone: 6,
    apply: () => { game.multipliers.global *= 2; },
  },
  {
    id: 'advancedMetallurgy',
    name: 'Advanced Metallurgy',
    desc: 'Discovered you can melt gold down and then... have the same amount of gold. But shinier.',
    cost: { schemes: 200 },
    effect: '3x Shiny Mine production',
    unlockZone: 8,
    apply: () => { game.multipliers.mining *= 3; },
  },
  {
    id: 'battleFormations',
    name: 'Battle Formations',
    desc: 'Step 1: stand in a line. Step 2: don\'t run away. There is no step 3.',
    cost: { schemes: 100 },
    effect: '+50% combat power',
    unlockZone: 5,
    apply: () => { game.multipliers.combat *= 1.5; },
  },
  {
    id: 'overtimePay',
    name: 'Overtime Pay',
    desc: 'Pay goblins extra for extra work? Madness. But it works.',
    cost: { schemes: 150 },
    effect: 'Each click also gives 10% of per-second production',
    unlockZone: 7,
    apply: () => { game.flags.overtimePay = true; },
  },
  {
    id: 'middleManagement',
    name: 'Middle Management',
    desc: 'Idle goblins now wander around looking busy. Some accidentally produce value.',
    cost: { schemes: 200 },
    effect: 'Idle goblins produce 0.2 Shinies/s each',
    unlockZone: 8,
    apply: () => { game.flags.middleManagement = true; },
  },
  {
    id: 'eliteSoldiers',
    name: 'Elite Soldiers',
    desc: 'Training program: hit the dummy until the dummy breaks. You are the dummy.',
    cost: { schemes: 250 },
    effect: '2x combat power',
    unlockZone: 10,
    apply: () => { game.multipliers.combat *= 2; },
  },
  {
    id: 'quantumMushrooms',
    name: 'Quantum Mushrooms',
    desc: 'These mushrooms exist in multiple states simultaneously. All of them taste bad.',
    cost: { schemes: 300 },
    effect: '3x food production',
    unlockZone: 12,
    apply: () => { game.multipliers.food *= 3; },
  },
  {
    id: 'synergisticSynergies',
    name: 'Synergistic Synergies',
    desc: 'We held a meeting about meetings. The results were... synergistic.',
    cost: { schemes: 500 },
    effect: '3x all production',
    unlockZone: 15,
    apply: () => { game.multipliers.global *= 3; },
  },
  {
    id: 'clickEmpowerment',
    name: 'Click Empowerment Seminar',
    desc: 'A 3-day seminar on the art of clicking. Your arm has never been so motivated.',
    cost: { schemes: 400 },
    effect: '5x click power',
    unlockZone: 14,
    apply: () => { game.multipliers.click *= 5; },
  },
  {
    id: 'goblinCloning',
    name: 'Goblin Cloning',
    desc: 'Legal said we can\'t call it cloning. We call it "Accelerated Hiring."',
    cost: { schemes: 350 },
    effect: '3x goblin production, +20 max goblins',
    unlockZone: 13,
    apply: () => { game.multipliers.goblinProd *= 3; game.bonuses.maxGoblins += 20; },
  },
  {
    id: 'siegeEngines',
    name: 'Siege Engines',
    desc: 'Giant crossbow on wheels. Points outward. Usually.',
    cost: { schemes: 600 },
    effect: '3x combat power',
    unlockZone: 16,
    apply: () => { game.multipliers.combat *= 3; },
  },
  {
    id: 'infiniteMushrooms',
    name: 'Infinite Mushroom Theory',
    desc: 'If you think about it, aren\'t we ALL mushrooms?',
    cost: { schemes: 800 },
    effect: '5x food production',
    unlockZone: 18,
    apply: () => { game.multipliers.food *= 5; },
  },
  {
    id: 'corporateAscension',
    name: 'Corporate Ascension',
    desc: 'You\'ve read the entire MBA book. Even the index. You are become CEO, destroyer of margins.',
    cost: { schemes: 1200 },
    effect: '5x all production',
    unlockZone: 20,
    apply: () => { game.multipliers.global *= 5; },
  },
];

const ZONES = [
  { name: 'The Broom Closet', boss: false,
    desc: 'Every empire starts somewhere. Ours starts next to a mop and a bucket of questionable liquid.' },
  { name: 'Supply Closet B', boss: false,
    desc: 'Discovered additional closet space. Productivity has increased since goblins now have somewhere to hide from responsibility.' },
  { name: 'The Break Room', boss: false,
    desc: 'Ancient texts call it "The Room of Breaks." We found a coffee machine. Nobody knows what coffee is, but it smells like ambition.' },
  { name: 'The Filing Cavern', boss: false,
    desc: 'Thousands of documents in here. Mostly just the word "AAAGH" written in different handwriting.' },
  { name: 'The Lobby', boss: true, bossName: 'Kevin the Intern',
    desc: 'This used to be the heroes\' entrance. We\'ve rebranded it as "Reception." Kevin the Intern guards it. He\'s not a real adventurer — his mom made him apply.' },
  { name: 'The Abandoned Laboratory', boss: false,
    desc: 'Someone was trying to turn lead into gold. We turn gold into more gold. Who\'s the real alchemist here?' },
  { name: 'The Marketing Pit', boss: false,
    desc: 'A bottomless pit with great lighting. Perfect for presentations. Several interns have been lost during brainstorming sessions.' },
  { name: 'The Server Room', boss: false,
    desc: 'Crystal balls, all linked together. Ancient networking infrastructure. The Wi-Fi password is "dragon123."' },
  { name: 'The HR Swamp', boss: false,
    desc: 'Nobody wants to go to HR. Not even HR. The swamp gas is technically a "workplace atmosphere concern."' },
  { name: 'The Corner Office', boss: true, bossName: 'Sir Reginald the Adequate',
    desc: 'The fanciest room we\'ve found yet. Sir Reginald the Adequate has been squatting here. He has a magic sword that glows near overtime hours.' },
  { name: 'The Competitor\'s Tunnel', boss: false,
    desc: 'Discovered a tunnel to the dungeon next door. They have CARPET. This aggression will not stand.' },
  { name: 'The Vending Machine Alcove', boss: false,
    desc: 'A magical box that dispenses food in exchange for Shinies. The food is always slightly wrong. We love it.' },
  { name: 'The Conference Abyss', boss: false,
    desc: 'A meeting room that exists outside normal space-time. Meetings scheduled here have no start and no end. Only agendas.' },
  { name: 'The Archives of Bad Ideas', boss: false,
    desc: 'Filing cabinets full of rejected proposals. "Lava moat in the break room." "Mandatory fun Fridays." "Hire a dragon as CFO." Wait, that last one...' },
  { name: 'The Rival\'s Boardroom', boss: true, bossName: 'Chad Thornington III, MBA',
    desc: 'Chad runs the neighboring dungeon like a startup. He says things like "disrupt" and "pivot." He must be stopped.' },
  { name: 'The Underground Stock Exchange', boss: false,
    desc: 'Literally a market made of wooden stocks. Goblins trade rocks they\'ve named after companies. SHRK is up 40%.' },
  { name: 'The Legal Department', boss: false,
    desc: 'A cave full of tiny goblins in tiny suits arguing about whether "finders keepers" constitutes legal precedent. (It does.)' },
  { name: 'The Innovation Sinkhole', boss: false,
    desc: 'Someone suggested an "innovation lab." It\'s a hole. Things fall in. Sometimes those things come back better. Usually not.' },
  { name: 'The Accounting Labyrinth', boss: false,
    desc: 'Numbers go in, different numbers come out. Nobody questions it. The quarterly reports show we\'re profitable in at least three dimensions.' },
  { name: 'The Dragon\'s Office', boss: true, bossName: 'Cynthia, Dragon Lawyer',
    desc: 'Cynthia passed the bar in seven kingdoms. She breathes fire AND legal jargon. Her billable rate is "all your treasure." She\'s been retained by the heroes\' guild.' },
  { name: 'The IPO Cavern', boss: false,
    desc: 'We\'re going public! Every goblin gets one share. Most immediately ate theirs. Investor confidence is... a concept we\'re learning about.' },
  { name: 'The Shareholder Gulch', boss: false,
    desc: 'The shareholder goblins keep asking about "dividends." We told them it\'s a type of mushroom. They seem satisfied.' },
  { name: 'The Interdimensional Loading Dock', boss: false,
    desc: 'A portal ripped open in storage. Other-dimensional packages keep arriving. The return labels say "Reality #4,207." We\'re signing for them.' },
  { name: 'The Cosmic Break Room', boss: false,
    desc: 'The break room from another dimension. Their coffee machine works. THIS CHANGES EVERYTHING.' },
  { name: 'The Multiverse Branch Office', boss: true, bossName: 'Your Evil Twin (Better Dressed)',
    desc: 'An alternate-universe version of you runs this dungeon. They have a goatee, a corner office, and a dental plan. Unforgivable.' },
  { name: 'The Space Between Spreadsheets', boss: false,
    desc: 'A dimension that exists between cells of a cosmic spreadsheet. Row 47, Column G. The formula in this cell is just screaming.' },
  { name: 'The Celestial Mailroom', boss: false,
    desc: 'Where interdimensional memos go to die. Found a complaint letter from God addressed to "Current Resident." Filed it under "Later."' },
  { name: 'The Board of Cosmic Directors', boss: false,
    desc: 'Turns out the universe has a board of directors. They\'ve been in a meeting since the Big Bang. The PowerPoint has 900 billion slides.' },
  { name: 'The Universal HR Department', boss: false,
    desc: 'Every HR complaint from every dimension, ever. Apparently, stars keep filing harassment claims against black holes. Valid.' },
  { name: 'The CEO\'s Throne Room', boss: true, bossName: 'The Concept of Capitalism Itself',
    desc: 'At the top of everything sits The Invisible Hand — the abstract personification of free markets. It\'s just a giant floating hand giving a thumbs up. It has a corner office the size of a nebula.' },
];

const MEMOS = [
  { zone: 0, type: 'story', title: 'RE: NEW MANAGEMENT',
    body: 'MEMO TO: All Goblins\nFROM: You (Self-Appointed Chief Executive Goblin)\n\nFound a book in the treasure pile called "MBA For Dummies." We\'re going corporate. No more mindless hoarding — we\'re going to STRATEGICALLY hoard.\n\nFirst order of business: find more shinies. Click the big rock.\n\nThis is not optional.' },
  { zone: 1, type: 'story', title: 'RE: EXPANSION UPDATE',
    body: 'We\'ve moved beyond the broom closet. Critics said it couldn\'t be done. Those critics were the mop.\n\nNew territory means new opportunities. I\'ve appointed myself Head of Expansion. And also Head of Everything Else.' },
  { zone: 3, type: 'story', title: 'RE: THE FILING SITUATION',
    body: 'Found thousands of documents in the new cavern. We can\'t read most of them, but we\'ve started our own filing system:\n\n- Pile A: Things that look important\n- Pile B: Things that look flammable\n- Pile C: Same as Pile B\n\nUpdate: Piles B and C have merged. In a sense.' },
  { zone: 5, type: 'boss', title: 'INCIDENT REPORT: KEVIN',
    body: 'A "hero" named Kevin tried to raid us. He was wearing his mom\'s kitchen pot as a helmet. His sword was wooden.\n\nWe offered him a job. He accepted. He\'s in charge of the suggestion box now.\n\nMost suggestions are from Kevin. They are all about getting a real sword.' },
  { zone: 7, type: 'story', title: 'RE: DISCOVERY - ANCIENT NETWORKING',
    body: 'The "Server Room" contains crystal balls connected by copper wire. We think it\'s the ancient equivalent of the internet.\n\nSo far we\'ve found:\n- A crystal ball showing a cat falling off a shelf (extremely funny)\n- A crystal ball that just says "YOUR POTION ORDER HAS SHIPPED"\n- A crystal ball full of very angry opinions about everything\n\nSome things are universal.' },
  { zone: 10, type: 'boss', title: 'DEFEAT OF SIR REGINALD',
    body: 'Sir Reginald the Adequate has been defeated. He was exactly as adequate as his name suggested.\n\nHis magic sword is now our letter opener. His shield is now a serving tray. His cape is now a tablecloth.\n\nMore importantly: his "corner office" has a VIEW. Of more dungeon. But still. A VIEW.\n\nNew opportunity unlocked: FRANCHISING. We can now spread the Goblin Inc. brand to fresh dungeons!' },
  { zone: 11, type: 'story', title: 'RE: THE COMPETITION',
    body: 'Discovered a rival dungeon operation next door. They have carpet. CARPET. In a dungeon.\n\nThey call themselves "DungeonCorp." Their goblins wear TIES.\n\nThis is corporate espionage territory. I\'ve appointed our sneakiest goblin as Chief Intelligence Officer. His first report: "they have better snacks."' },
  { zone: 15, type: 'boss', title: 'HOSTILE TAKEOVER COMPLETE',
    body: 'Chad Thornington III has been defeated. He tried to "pivot" mid-combat. He pivoted directly into our trap.\n\nDungeonCorp is now a subsidiary of Goblin Inc. Their carpet is now OUR carpet. Their ties are now OUR ties.\n\nChad has been reassigned to our suggestion box department. He keeps suggesting we "circle back." Kevin is not impressed.' },
  { zone: 20, type: 'boss', title: 'LEGAL VICTORY',
    body: 'After a grueling 200-round battle (mostly paperwork), Cynthia the Dragon Lawyer has been... not defeated, but "settled with."\n\nThe settlement: she works for us now. The heroes\' guild can no longer sue us because our lawyer is a literal dragon.\n\nHer first act: filing a cease and desist against physics. Gravity is now optional in the executive washroom.' },
  { zone: 21, type: 'story', title: 'RE: IPO ANNOUNCEMENT',
    body: 'GOBLIN INC. IS NOW PUBLICLY TRADED.\n\nShares opened at 3 Shinies. They are currently worth 3 Shinies. The stock market is one goblin behind a rock yelling numbers.\n\nAnalysts (the same goblin) predict "numbers going up probably."\n\nShareholder meeting scheduled for never. We\'ll keep you posted.' },
  { zone: 25, type: 'boss', title: 'INTERDIMENSIONAL INCIDENT',
    body: 'We defeated our evil twin from another dimension. Technically, WE might be the evil twin. There\'s no way to know. We have slightly worse fashion sense, but a much better dental plan.\n\nThe multiverse is now OPEN FOR BUSINESS. Goblin Inc. is going interdimensional.\n\nThe other-dimension goblins have a question: "What\'s an MBA?"\n\nFools. Glorious, exploitable fools.' },
  { zone: 28, type: 'story', title: 'RE: COSMIC BOARD MEETING',
    body: 'Attended the Universe\'s Board of Directors meeting. They\'ve been discussing the same agenda item since the Big Bang: "New Business."\n\nWe suggested a merger. The Cosmic Board said they\'d "take it under advisement."\n\nTheir advisement period is 4 billion years. We filed it as "pending."' },
  { zone: 30, type: 'boss', title: 'WE DID IT',
    body: 'We defeated The Concept of Capitalism Itself. It congratulated us and offered stock options.\n\nGoblin Inc. is now the dominant economic force in the known universe. Our stock price is "yes." Our market cap is "all of it."\n\nSomewhere, a goblin in a broom closet is reading a book called "MBA for Dummies."\n\nThe cycle continues.\n\n~ FIN ~\n\n(But the dungeon goes on. There\'s always more shinies.)' },
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


// ===========================================
// SECTION 2: GAME STATE
// ===========================================

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
    memos: [],
    log: [],
    lastTick: Date.now(),
    version: 1,
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
    addLog('Game reset. Back to the broom closet.', 'warning');
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
    if (!canAfford(cost)) return;
    payCost(cost);
    game.buildings[id] = lvl + 1;
  },

  buyUpgrade(id) {
    const upg = UPGRADES.find(u => u.id === id);
    if (!upg || game.upgrades.includes(id)) return;
    if (!canAfford(upg.cost)) return;
    payCost(upg.cost);
    game.upgrades.push(id);
    upg.apply();
    addLog(`Research complete: ${upg.name}`, 'reward');
    announce(`Research complete: ${upg.name}. ${upg.effect}`);
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
    announce(`Goblins sent into Zone ${game.zone.current + 1}`);
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
    announce(`Perk upgraded: ${perk.name} to level ${lvl + 1}`);
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

  const mineLvl = game.buildings.shinyMine || 0;
  let shiniesPS = mineLvl * 0.5 * game.multipliers.mining * globalMult;
  // Worker bonus
  shiniesPS += game.assignments.mining * 0.3 * game.multipliers.mining * globalMult;
  // Middle management
  if (game.flags.middleManagement) {
    shiniesPS += getIdleGoblins() * 0.2 * globalMult;
  }

  const farmLvl = game.buildings.mushroomFarm || 0;
  let foodPS = farmLvl * 0.4 * game.multipliers.food * globalMult;
  foodPS += game.assignments.farming * 0.25 * game.multipliers.food * globalMult;
  // Goblins eat food
  const totalGoblins = Math.floor(game.resources.goblins);
  const foodConsumption = totalGoblins * 0.05;
  const netFoodPS = foodPS - foodConsumption;

  const thinkLvl = game.buildings.thinkinRock || 0;
  let schemesPS = thinkLvl * 0.15 * game.multipliers.schemes * globalMult;
  schemesPS += game.assignments.thinking * 0.12 * game.multipliers.schemes * globalMult;

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

  // Floor at 0
  if (game.resources.shinies < 0) game.resources.shinies = 0;
  if (game.resources.food < 0) {
    game.resources.food = 0;
    // Starving goblins leave
    if (Math.floor(game.resources.goblins) > 0 && rates.foodGross <= 0) {
      game.resources.goblins -= 0.05 * dt;
      if (game.resources.goblins < 0) game.resources.goblins = 0;
      // Unassign if needed
      while (getTotalAssigned() > Math.floor(game.resources.goblins)) {
        unassignOne();
      }
    }
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

    addLog(`Zone cleared: ${z.name || 'Zone ' + (game.zone.current + 1)}! +${fmt(reward)} Shinies`, 'reward');

    if (z.boss) {
      addLog(`BOSS DEFEATED: ${z.bossName}!`, 'combat');
      announce(`Boss defeated: ${z.bossName}! Zone cleared, earned ${fmt(reward)} Shinies.`);
    } else {
      announce(`Zone cleared: ${z.name || 'Zone ' + (game.zone.current + 1)}! Earned ${fmt(reward)} Shinies.`);
    }

    checkMemos();
  }
}

function tick() {
  const now = Date.now();
  const dt = Math.min((now - game.lastTick) / 1000, 1); // cap delta to 1 sec per frame
  game.lastTick = now;

  tickResources(dt);
  tickCombat(dt);
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
    // Check if franchise is locked
    if (tab === 'franchise' && game.stats.highestZone < 9) {
      addLog('Reach Zone 10 to unlock Franchising!', 'warning');
      announce('Franchise tab is locked. Reach Zone 10 to unlock.');
      return;
    }

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
    document.getElementById(`panel-${tab}`)?.classList.add('active');
  },

  render() {
    UI.renderResources();
    UI.renderGatherTab();
    UI.renderBuildTab();
    UI.renderResearchTab();
    UI.renderDungeon();
    UI.renderFranchise();
    UI.renderMemos();
    UI.renderLog();
    UI.updateTabStates();
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
    document.getElementById('assign-mining-effect').textContent =
      game.assignments.mining > 0 ? `+${fmt(game.assignments.mining * 0.3 * game.multipliers.mining * gm)}/s` : '';
    document.getElementById('assign-farming-effect').textContent =
      game.assignments.farming > 0 ? `+${fmt(game.assignments.farming * 0.25 * game.multipliers.food * gm)}/s` : '';
    document.getElementById('assign-thinking-effect').textContent =
      game.assignments.thinking > 0 ? `+${fmt(game.assignments.thinking * 0.12 * game.multipliers.schemes * gm)}/s` : '';
    document.getElementById('assign-fighting-effect').textContent =
      game.assignments.fighting > 0 ? `Power: ${fmt(getCombatPower())}` : '';
  },

  renderBuildTab() {
    const container = document.getElementById('buildings-list');
    let html = '';
    for (const [id, bld] of Object.entries(BUILDINGS)) {
      const lvl = game.buildings[id] || 0;
      const cost = getBuildingCost(id, lvl);
      const affordable = canAfford(cost);
      const unlocked = game.zone.current >= bld.unlockZone || game.zone.cleared.includes(bld.unlockZone - 1) || bld.unlockZone === 0;

      if (!unlocked) {
        html += `<div class="building-card locked" role="listitem" aria-hidden="true">
          <div class="building-info">
            <span class="building-name">???</span>
            <div class="building-desc">Unlocks at Zone ${bld.unlockZone + 1}</div>
          </div>
        </div>`;
        continue;
      }

      html += `<div class="building-card" role="listitem">
        <div class="building-info">
          <span class="building-name">${bld.name}<span class="building-level">Lv.${lvl}</span></span>
          <div class="building-desc">${bld.desc}</div>
          <div class="building-effect">${bld.effect(lvl + 1)}</div>
        </div>
        <div class="building-buy">
          <button class="buy-btn" onclick="Game.buyBuilding('${id}')" ${affordable ? '' : 'disabled'}
            aria-label="Build ${bld.name} level ${lvl + 1}, costs ${formatCostText(cost)}">
            Build${lvl > 0 ? ' +1' : ''}
          </button>
          <div class="building-cost" aria-hidden="true">${formatCost(cost, affordable)}</div>
        </div>
      </div>`;
    }
    container.innerHTML = html;
  },

  renderResearchTab() {
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
            <button class="buy-btn" onclick="Game.buyUpgrade('${upg.id}')" ${affordable ? '' : 'disabled'}
              aria-label="Research ${upg.name}, costs ${formatCostText(upg.cost)}. ${upg.effect}">
              Research
            </button>
            <div class="building-cost" aria-hidden="true">${formatCost(upg.cost, affordable)}</div>
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
    const unlocked = game.stats.highestZone >= 9;
    const tabBtn = document.getElementById('tab-franchise');

    if (unlocked) {
      tabBtn.classList.remove('locked');
      document.getElementById('franchise-locked').style.display = 'none';
      document.getElementById('franchise-content').style.display = 'block';
    } else {
      tabBtn.classList.add('locked');
      document.getElementById('franchise-locked').style.display = 'block';
      document.getElementById('franchise-content').style.display = 'none';
      return;
    }

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

  renderLog() {
    const container = document.getElementById('log-messages');
    let html = '';
    for (let i = 0; i < Math.min(game.log.length, 10); i++) {
      const entry = game.log[i];
      html += `<div class="log-msg ${entry.type}">${entry.msg}</div>`;
    }
    container.innerHTML = html;
  },

  updateTabStates() {
    const franTab = document.getElementById('tab-franchise');
    if (game.stats.highestZone >= 9) {
      franTab.classList.remove('locked');
      franTab.setAttribute('aria-disabled', 'false');
    }
  },
};


// --- UI HELPERS ---

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
  checkMemos();

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

    const tabs = ['gather', 'build', 'research', 'dungeon', 'franchise', 'memos'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
      UI.switchTab(tabs[num - 1]);
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

  addLog('Welcome to Goblin Inc. Your MBA journey begins now.', 'story');
}

// Start the game
document.addEventListener('DOMContentLoaded', init);
