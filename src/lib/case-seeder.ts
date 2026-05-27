import {
  crimeStorySeeds,
  type CrimeStorySeed,
} from "@/lib/crime-story-seeds"

type Genre = CrimeStorySeed["genre"]

export type CaseSeed = {
  crimeStory: CrimeStorySeed
  setting: string
  crimeType: string
  mysteryStructure: string
  clueStyle: string
  twistType: string
  suspectWeb: string
  tone: string
  difficulty: string
  visualMood: string
  forbiddenPatterns: string[]
}

const settingsByGenre: Record<Genre, string[]> = {
  "Modern & Noir": [
    "Ulaanbaatar apartment block during a winter blackout",
    "remote khuduu guesthouse cut off by a snowstorm",
    "private gallery opening near Sukhbaatar Square",
    "overnight train carriage between Darkhan and Ulaanbaatar",
    "mining camp office on the edge of the Gobi",
    "closed karaoke lounge after a company party",
    "university archive room during a scholarship scandal",
    "luxury hotel kitchen before a diplomatic banquet",
    "horse-racing stable on the morning of Naadam",
    "cashmere factory floor after the night shift",
    "lakeside tourist camp near Khuvsgul after curfew",
    "provincial hospital ward during a power outage",
  ],
  "Sci-Fi & Cyberpunk": [
    "orbital research station during a comms blackout",
    "neon-drenched megacity arcology on a rainy night",
    "deep-space cargo freighter mid-jump",
    "Mars colony bio-dome after a life-support fault",
    "underground data-haven flooded by a leaking coolant pipe",
    "private cybernetics clinic after closing hours",
    "abandoned terraforming lab on a frozen moon",
    "luxury orbital hotel during a solar flare",
    "low-orbit shipyard between work shifts",
    "back-alley netrunner safehouse during a citywide ICE crackdown",
    "cryo-sleep bay aboard a long-haul colony vessel",
    "high-rise corporate boardroom behind reinforced glass",
  ],
  "Fantasy & Supernatural": [
    "candlelit wizard's tower during a winter storm",
    "remote mountain monastery cut off by a blood moon",
    "underground dwarven forge after the bellows died",
    "haunted manor on the edge of a cursed forest",
    "alchemist's workshop above a sleeping village",
    "crumbling castle keep during a siege lull",
    "fairy-ring tavern at the edge of the fey wilds",
    "royal banquet hall after a magical accident",
    "necromancer's catacomb the night after a funeral",
    "elven library hidden inside a living tree",
    "frost-locked port town the day a dragon was sighted",
    "cathedral crypt during the festival of the dead",
  ],
  "Historical & Period Piece": [
    "Victorian London townhouse during a coal-smoke fog",
    "1920s ocean liner steaming through the North Atlantic",
    "Edo-period merchant house during the rainy season",
    "Renaissance Italian palazzo on the eve of a wedding",
    "WWI field hospital behind the trenches",
    "Roman senator's villa during the festival of Saturnalia",
    "Silk Road caravanserai snowed in for the night",
    "1880s frontier mining town saloon after a strike collapse",
    "Aztec ceremonial pyramid the day of an eclipse",
    "Crusader-era fortress on the morning after a desert raid",
    "Belle Époque opera house between the second and third acts",
    "Viking longhouse the morning after a midwinter feast",
  ],
}

const suspectWebsByGenre: Record<Genre, string[]> = {
  "Modern & Noir": [
    "estranged relatives, a loyal employee, and a neighbor with a private debt",
    "business partners, an assistant, and a rival who all depend on one contract",
    "old classmates reunited by an award, each hiding a different failure",
    "tourists, local staff, and one outsider who knows the area too well",
    "family elders, a young heir, and a caretaker caught between loyalties",
    "medical staff, a patient relative, and an administrator protecting records",
    "artists, patrons, and a curator who controls access to a valuable object",
    "drivers, dispatchers, and passengers with conflicting route memories",
    "workers on a night shift where everyone covered for one small rule break",
    "public officials, journalists, and a fixer trying to bury an old decision",
  ],
  "Sci-Fi & Cyberpunk": [
    "ship's crew with conflicting loyalties to a distant corporation",
    "corp-sec officers, a fixer, and a netrunner who knows too much",
    "researchers, a sponsor, and an android witness no one fully trusts",
    "colonists, a supply officer, and an inspector sent from headquarters",
    "gang lieutenants, a ripperdoc, and a journalist chasing the same leak",
    "an AI handler, two pilots, and a passenger with a forged identity",
    "engineers covering for each other after a shared safety violation",
    "augmented elites and their unmodified service staff",
    "rival hackers bound to one stolen dataset",
    "a station administrator, a union rep, and an off-duty marine",
  ],
  "Fantasy & Supernatural": [
    "court mages, a steward, and a visiting noble with an old grudge",
    "guild apprentices each protecting a different forbidden secret",
    "clergy, a relic-keeper, and a pilgrim who arrived just before the death",
    "adventuring party members who shared one cursed treasure",
    "tavern regulars bound by a debt to a vanished patron",
    "rival alchemists, their assistants, and a buyer who paid in advance",
    "a noble family hiding bloodline secrets across three generations",
    "monastic brothers each interpreting the same omen differently",
    "a fey envoy, a mortal scholar, and a knight who broke an oath",
    "a coven of hedge-witches and the village magistrate they fear",
  ],
  "Historical & Period Piece": [
    "household servants, a visiting relative, and the master's confidant",
    "officers, an aide, and a war correspondent embedded with the unit",
    "ship's crew, a paying passenger, and the captain's first mate",
    "merchant guildsmen, a foreign trader, and a customs inspector",
    "courtiers, a royal physician, and a foreign ambassador",
    "factory foremen, union organizers, and a company auditor",
    "stagehands, the lead actor, and the patron funding the production",
    "village elders, a traveling priest, and an outsider with new ideas",
    "samurai retainers, a tea master, and a merchant carrying a secret ledger",
    "expedition members, a local guide, and the funder back at base camp",
  ],
}

const tonesByGenre: Record<Genre, string[]> = {
  "Modern & Noir": [
    "grounded noir with restrained humor",
    "tense procedural with emotional restraint",
    "melancholic family drama",
    "claustrophobic thriller",
    "dry workplace mystery",
    "quiet psychological suspense",
    "sharp social satire without becoming comedic",
    "folklore-tinged realism without supernatural answers",
  ],
  "Sci-Fi & Cyberpunk": [
    "cold corporate-thriller paranoia",
    "neon-soaked detective noir with hard tech edge",
    "claustrophobic space-station suspense",
    "transhumanist mystery with quiet body horror",
    "burned-out cyber-detective melancholy",
    "high-stakes procedural with sterile lab atmosphere",
  ],
  "Fantasy & Supernatural": [
    "gothic gaslit dread with restrained horror",
    "mythic high-fantasy tragedy",
    "folk-tale grimness with moral weight",
    "candlelit court intrigue",
    "uncanny dreamlike unease",
    "grim sword-and-sorcery suspense",
  ],
  "Historical & Period Piece": [
    "stately drawing-room mystery with formal manners",
    "wartime procedural with weary stoicism",
    "ornate court intrigue with veiled threats",
    "frontier hardship with terse dialogue",
    "Edwardian gothic with social-class tension",
    "ancient ritualistic atmosphere with quiet menace",
  ],
}

const visualMoodsByGenre: Record<Genre, string[]> = {
  "Modern & Noir": [
    "cold fluorescent light, wet pavement, and cramped interiors",
    "dusty sunlight, long shadows, and practical work spaces",
    "candlelit rooms, deep winter blues, and visible breath",
    "warm party lights hiding harsh evidence details",
    "industrial metal, paperwork clutter, and security camera angles",
    "muted hospital greens, plastic curtains, and quiet corridors",
    "golden countryside morning with an uneasy stillness",
    "rain-streaked glass, neon signage, and narrow back rooms",
    "archival browns, faded ink, and locked cabinets",
    "clean luxury surfaces disrupted by one ugly detail",
  ],
  "Sci-Fi & Cyberpunk": [
    "neon reflections on wet chrome and rain-slick alleys",
    "sterile white lab corridors under cold blue strip lighting",
    "low orange emergency lighting on a damaged ship",
    "holographic interfaces flickering in a dim apartment",
    "harsh sun glare through reinforced biodome glass",
    "deep-space darkness broken by warning indicator panels",
    "industrial server-farm fans and pulsing status LEDs",
    "smog-filtered sunset over megacity rooftops",
  ],
  "Fantasy & Supernatural": [
    "candlelit stone halls with long flickering shadows",
    "moonlight through stained glass over cold marble",
    "torchlit catacombs with damp moss and bone dust",
    "amber alchemist's glow on scarred wooden tables",
    "frost-blue magical light pooling in a quiet courtyard",
    "fog-shrouded forest with skeletal branches",
    "warm tavern firelight contrasted with cold dread outside",
    "cathedral candles, incense smoke, and stained pews",
  ],
  "Historical & Period Piece": [
    "gaslamp glow on rain-slicked cobblestones",
    "oil-lamp warmth on heavy velvet drapes",
    "harsh sunlight on dusty period workrooms",
    "candlelit banquet hall with long shadowed corridors",
    "battlefield smoke drifting over canvas tents",
    "ship lantern light on dark polished mahogany",
    "snowfall against tall sash windows at dawn",
    "torchlit pyramid steps under a fading eclipse",
  ],
}

const mysteryStructures = [
  "the obvious suspect has the cleanest motive but a false timeline",
  "three suspects share one secret, but only one benefits from the crime",
  "the crime scene was altered twice by different people for different reasons",
  "the first clue looks physical, but the decisive clue is social behavior",
  "a missing item matters because it proves who could not have been present",
  "the victim arranged a trap that exposes the killer after death",
  "two minor lies cancel each other out and reveal the true sequence",
  "the culprit tries to frame someone using a clue only locals would misread",
  "a harmless routine becomes suspicious only when its timing changes",
  "the solution depends on separating accident, panic, and murder",
]

const clueStyles = [
  "contradictory witness statements with one precise sensory detail",
  "forensic trace evidence mixed with misleading everyday debris",
  "digital metadata from messages, cameras, or access logs",
  "objects moved from their normal place in a culturally specific setting",
  "financial records, receipts, and quiet debt pressure",
  "language choices, honorifics, and inconsistent relationship claims",
  "weather, transport timing, and physical access constraints",
  "food, medicine, and allergy details that narrow opportunity",
  "family photographs and old documents with one altered fact",
  "sound-based clues from walls, doors, engines, or music",
]

function isClueStyleCompatible(style: string, genre: Genre): boolean {
  const isPreDigital =
    genre === "Fantasy & Supernatural" || genre === "Historical & Period Piece"
  if (isPreDigital && /digital metadata|cameras|access logs/i.test(style)) {
    return false
  }
  return true
}

const difficulties = [
  "hard: timeline reconstruction and motive separation are both required",
]

const forbiddenPatternPool = [
  "do not make the spouse or romantic partner the killer",
  "do not solve the case through a sudden confession",
  "do not rely on a single hidden camera recording as the answer",
  "do not use identical twin, clone, or lookalike reveals",
  "do not make every suspect motivated only by money",
  "do not use amnesia, hallucination, or dream logic",
  "do not reveal the killer as a random stranger introduced late",
  "do not make the detective find one perfect clue that explains everything",
  "do not use supernatural causes or curses as the real explanation",
  "do not make the assistant, narrator, or investigator the culprit",
  "do not repeat a simple jealousy triangle",
  "do not make the victim entirely innocent of all secrets",
]

function randomIndex(length: number): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % length
}

function pick<T>(options: T[]): T {
  return options[randomIndex(options.length)]
}

function pickMany(options: string[], count: number): string[] {
  const available = [...options]
  const selected: string[] = []

  while (selected.length < count && available.length > 0) {
    const index = randomIndex(available.length)
    const [value] = available.splice(index, 1)
    selected.push(value)
  }

  return selected
}

function pickForbiddenPatterns(crimeStory: CrimeStorySeed): string[] {
  const premise = `${crimeStory.genre} ${crimeStory.title} ${crimeStory.premise} ${crimeStory.hiddenLogic}`.toLowerCase()
  const compatiblePatterns = forbiddenPatternPool.filter((pattern) => {
    if (
      pattern.includes("supernatural") &&
      crimeStory.genre === "Fantasy & Supernatural"
    ) {
      return false
    }

    if (
      pattern.includes("hidden camera") &&
      (crimeStory.genre === "Fantasy & Supernatural" ||
        crimeStory.genre === "Historical & Period Piece")
    ) {
      return false
    }

    if (
      pattern.includes("identical twin") &&
      /\b(clone|twin|lookalike|face-shifter|shapeshifter)\b/.test(premise)
    ) {
      return false
    }

    if (
      pattern.includes("random stranger") &&
      /\b(stranger|outsider)\b/.test(premise)
    ) {
      return false
    }

    return true
  })

  return pickMany(compatiblePatterns, 4)
}

export function generateCaseSeed(): CaseSeed {
  const crimeStory = pick(crimeStorySeeds)
  const genre = crimeStory.genre as Genre

  return {
    crimeStory,
    setting: pick(settingsByGenre[genre]),
    crimeType: crimeStory.premise,
    mysteryStructure: pick(mysteryStructures),
    clueStyle: pick(clueStyles.filter((s) => isClueStyleCompatible(s, genre))),
    twistType: crimeStory.hiddenLogic,
    suspectWeb: pick(suspectWebsByGenre[genre]),
    tone: pick(tonesByGenre[genre]),
    difficulty: difficulties[0],
    visualMood: pick(visualMoodsByGenre[genre]),
    forbiddenPatterns: pickForbiddenPatterns(crimeStory),
  }
}
