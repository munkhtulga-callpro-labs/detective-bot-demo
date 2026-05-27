export type CaseSeed = {
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

const settings = [
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
]

const crimeTypes = [
  "poisoning disguised as food poisoning",
  "locked-room murder with a staged suicide note",
  "high-value theft that turns into a murder investigation",
  "hit-and-run cover-up with a missing vehicle key",
  "arson used to destroy one specific piece of evidence",
  "blackmail victim found dead before a scheduled meeting",
  "sabotage accident that was intentionally engineered",
  "kidnapping hoax hiding a real disappearance",
  "identity swap revealed through small behavioral mistakes",
  "revenge killing hidden behind a business dispute",
]

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

const twistTypes = [
  "the victim knowingly protected someone who was not the killer",
  "the apparent alibi was created before the crime happened",
  "a witness tells the truth but about the wrong time",
  "the murder weapon is not dangerous until combined with the setting",
  "the motive is shame avoidance, not money or romance",
  "the culprit is exposed by trying to correct an investigator's assumption",
  "the hidden relationship is professional rather than romantic",
  "the final reveal turns on why evidence was absent, not why it was present",
  "a secondary crime explains the cover-up but not the death",
  "the person with the strongest motive only discovered the body",
]

const suspectWebs = [
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
]

const tones = [
  "grounded noir with restrained humor",
  "tense procedural with emotional restraint",
  "melancholic family drama",
  "claustrophobic thriller",
  "dry workplace mystery",
  "quiet psychological suspense",
  "sharp social satire without becoming comedic",
  "folklore-tinged realism without supernatural answers",
]

const difficulties = [
  "hard: timeline reconstruction and motive separation are both required",
]

const visualMoods = [
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

function pick(options: string[]): string {
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

export function generateCaseSeed(): CaseSeed {
  return {
    setting: pick(settings),
    crimeType: pick(crimeTypes),
    mysteryStructure: pick(mysteryStructures),
    clueStyle: pick(clueStyles),
    twistType: pick(twistTypes),
    suspectWeb: pick(suspectWebs),
    tone: pick(tones),
    difficulty: difficulties[0],
    visualMood: pick(visualMoods),
    forbiddenPatterns: pickMany(forbiddenPatternPool, 4),
  }
}
