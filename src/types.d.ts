
interface Values {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}
interface Inspiration {
    purple: number;
    pink: number;
    white: number;
    red: number;
    yellow: number;
    regular: number;
}

interface Descriptions {
    racialTraits: string;
    featureTraits: string;
    attacks: Attack[];
    spells: Spell[];
}

interface Attack {
    name: string;
    type: string;
    range: string;
    attack: string;
    damage: string;
    description: string;
}

interface Spell {
    name: string;
    type: string;
    castingTime: string;
    range: string;
    duration: string;
    components: string;
    description: string;
    level?: number;
    school?: string;
    prepared?: boolean;
}

interface TraitItem {
    name: string;
    category: string;
    sub?: string;
    chips?: string[];
    text: string;
}

interface InventoryItem {
    name: string;
    type: string;
    qty: number;
    wt: number;
    rarity: string;
    equipped?: boolean;
    dmg?: string;
    note?: string;
}

interface Currency {
    pp: number;
    gp: number;
    ep: number;
    sp: number;
    cp: number;
}

interface SpellSlotLevel {
    total: number;
    used: number;
}

interface SpellSlots {
    ability: string;
    slots: Record<string, SpellSlotLevel>;
}

interface CharacterProfile {
    class: string;
    level: number;
    name: string;
    race: string;
    subclass: string;
    subrace: string;
}
interface CharacterProfileDaggerheart {
    name: string,
    class: string,
    domains: string,
    level: number,
    ancestry: string,
    community: string,
    subclass: string
}

interface SkillProficiency {
    acrobatics: string;
    animalHandling: string;
    arcana: string;
    athletics: string;
    deception: string;
    history: string;
    insight: string;
    intimidation: string;
    investigation: string;
    medicine: string;
    nature: string;
    perception: string;
    performance: string;
    persuasion: string;
    religion: string;
    sleightOfHand: string;
    stealth: string;
    survival: string;
}
interface SaveThrowsProficiency {
    str: boolean;
    dex: boolean;
    con: boolean;
    int: boolean;
    wis: boolean;
    cha: boolean;
}

interface Stats {
    ac: number;
    hitDice: string;
    initiative: number;
    maxHP: number;
    passivePerception: number;
    proficiencyBonus: number;
    primaryStats: Values;
    inspiration: Inspiration;
    saveThrowsProficiency: { str: boolean; dex: boolean; con: boolean; int: boolean; wis: boolean; cha: boolean };
    skillProficiency: SkillProficiency;
}

interface Character {
    id: string;
    name: string;
    characterProfile: CharacterProfile;
    currentHP: number;
    stats: Stats;
    descriptions: Descriptions;
    created_at: string;
    gamemode: string;
    sortOrder?: number;
    spellSlots?: SpellSlots;
    inventory?: InventoryItem[];
    currency?: Currency;
    traits?: TraitItem[];
}
type DHTraitName = "Agility" | "Strength" | "Finesse" | "Instinct" | "Presence" | "Knowledge";

type DHTraits = Record<DHTraitName, number>;

interface DHTrack {
    total: number;
    marked: number;
}

interface DHHPTrack {
    total: number;
    marked: number;
    major: number;
    severe: number;
}

interface DHVitals {
    evasion: number;
    proficiency: number;
    armorScore: number;
    armorSlots: DHTrack;
    hp: DHHPTrack;
    stress: DHTrack;
    hope: DHTrack;
    conditions: string[];
}

interface DomainCard {
    name: string;
    domain: string;
    level: number;
    type: string;
    recall: number;
    text: string;
}

interface DHDomainCards {
    loadout: DomainCard[];
    vault: DomainCard[];
}

interface DHExperience {
    name: string;
    bonus: number;
}

interface DHWeapon {
    name: string;
    trait: string;
    range: string;
    damage: string;
    dtype: string;
    burden: string;
    feature: string;
}

interface DHWeapons {
    primary: DHWeapon | null;
    secondary: DHWeapon | null;
}

interface DHArmor {
    name: string;
    score: number;
    thresholds: { major: number; severe: number };
    feature: string;
}

interface DHInventoryItem {
    name: string;
    qty: number;
    note: string;
}

interface DHGold {
    handfuls: number;
    bags: number;
    chest: number;
}

interface DHBioEntry {
    q: string;
    a: string;
}

interface DHBio {
    background: DHBioEntry[];
    connections: DHBioEntry[];
}

interface AdvancementPick {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    cost?: number;
}

interface DHAdvancements {
    markedTraits: string[];
    perLevel: Record<string, AdvancementPick[]>;
    subclassUnlocked: { specialization: boolean; mastery: boolean };
    multiclass?: { class: string; domain: string };
}

interface DaggerheartCharacter {
    id: string;
    name: string;
    characterProfile: CharacterProfileDaggerheart;
    currentHP: number;
    stats: Stats;
    descriptions: Descriptions;
    created_at: string;
    gamemode: string;
    sortOrder?: number;
    dhTraits?: DHTraits;
    dhVitals?: DHVitals;
    dhDomainCards?: DHDomainCards;
    dhExperiences?: DHExperience[];
    dhWeapons?: DHWeapons;
    dhArmor?: DHArmor | null;
    dhInventory?: DHInventoryItem[];
    dhGold?: DHGold;
    dhBio?: DHBio;
    dhAdvancements?: DHAdvancements;
}

interface UserStore {
    user: import('@supabase/supabase-js').User | null;
    setUser: (string, string) => Promise<void>;
    setSessionUser: (user: import('@supabase/supabase-js').User) => void;
    removeUser: () => void;
}

interface CharactersStore {
    characters: Character[] | DaggerheartCharacter[];
    setCharacters: (string) => Promise<any[]>;
}

interface CharacterStore {
    character: Character | DaggerheartCharacter;
    setCharacter: (character: Character | DaggerheartCharacter) => void;
    // True while a GM is viewing another player's character from a campaign:
    // all edits are blocked except the GM adding inventory items.
    viewOnly: boolean;
    setViewOnly: (viewOnly: boolean) => void;
}

interface Campaign {
    id: string;
    name: string;
    dmID: string;
    dmName?: string | null;      // copied from the GM's username at creation
    gamemode: string;            // 'dnd' | 'daggerheart'
    description?: string;
    seats?: number;              // party size limit (default 6)
    glyph?: string | null;       // sigil the GM picked when forging
    created_at: string;
}

interface CampaignCharacter {
    id: string;
    campaignID: string;
    characterID: string;
    profileID: string;
    playerName?: string | null;  // copied from the player's username at request time
    status: string;              // 'pending' | 'accepted'
    sortOrder?: number | null;   // GM's party order on the campaign page
    created_at: string;
}

// A chapter of the GM's prepared story (sql/add-campaign-acts.sql). Players
// only ever receive revealed acts, with `modules` cut down to revealed stories.
interface CampaignAct {
    id: string;
    campaignID: string;
    title: string;
    summary?: string | null;
    sortOrder?: number | null;
    revealed: boolean;
    modules: ActModule[];
    created_at: string;
    updated_at?: string;
}

type ActModuleType = "story" | "option" | "adversary" | "encounter" | "environment" | "event";
type ActModule = StoryModule | OptionModule | AdversaryModule | EncounterModule | EnvironmentModule | EventModule;

interface StoryModule {
    id: string;
    type: "story";
    title: string;
    body: string;
    revealed?: boolean;          // shown to players once the act is revealed
}

interface OptionChoice {
    id: string;
    label: string;
    notes?: string;
    leadsTo?: string | null;     // id of the act this path leads to
}

interface OptionModule {
    id: string;
    type: "option";
    prompt: string;
    choices: OptionChoice[];
}

interface AdversaryModule {
    id: string;
    type: "adversary";
    name: string;
    description?: string;
    notes?: string;
    stats: DhAdversaryStats | DndAdversaryStats;
}

interface DhAdversaryStats {
    system: "daggerheart";
    tier: number;                // 1–4
    role: string;                // Bruiser, Horde, Leader, Minion, …
    difficulty: number | null;
    thresholds: { major: number | null; severe: number | null };
    hp: number | null;
    stress: number | null;
    attack: { modifier: number | null; name: string; range: string; damage: string };
    experiences?: string;
    motives?: string;
    features: { id: string; name: string; kind: string; text: string }[];
}

interface DndAdversaryStats {
    system: "dnd";
    meta?: string;               // "Medium humanoid, neutral evil"
    ac: number | null;
    hp: number | null;
    hitDice?: string;
    speed?: string;
    abilities: Record<"str" | "dex" | "con" | "int" | "wis" | "cha", number | null>;
    cr?: string;
    skills?: string;
    senses?: string;
    languages?: string;
    traits: { id: string; name: string; text: string }[];
    actions: { id: string; name: string; text: string }[];
}

interface EncounterModule {
    id: string;
    type: "encounter";
    title: string;
    setting?: string;
    objective?: string;
    adversaries: EncounterFoe[];
    notes?: string;
}

// An adversary module (from any act) in an encounter, and how many of it.
interface EncounterFoe {
    moduleID: string;
    count: number;
    // Marks for each individual (index 0 = the first of `count`). `hp` is HP
    // marked (Daggerheart) or damage taken (D&D). Missing entries = unmarked.
    tracks?: { hp: number; stress: number }[];
}

interface EnvironmentModule {
    id: string;
    type: "environment";
    name: string;
    description?: string;
    adversaries: string[];       // potential adversaries: adversary module ids
    notes?: string;
    stats: DhEnvironmentStats | DndEnvironmentStats;
}

interface DhEnvironmentStats {
    system: "daggerheart";
    tier: number;                // 1–4
    kind: string;                // Exploration, Social, Traversal, Event
    difficulty: number | null;
    impulses?: string;
    features: { id: string; name: string; kind: string; text: string }[];
}

interface DndEnvironmentStats {
    system: "dnd";
    terrain?: string;
    hazards: { id: string; name: string; dc: number | null; text: string }[];
    features: { id: string; name: string; text: string }[];
}

interface EventModule {
    id: string;
    type: "event";
    title: string;
    trigger?: string;
    happens?: string;
    outcomes: { id: string; label: string; text: string }[];
    countdown: { label: string; start: number; current: number } | null;
    notes?: string;
}

interface CampaignStore {
    campaign: Campaign | null;
    setCampaign: (campaign: Campaign) => void;
    actID: string | null;        // act open on /campaigns/act
    setActID: (actID: string) => void;
}

// Last-fetched campaign data, so the Campaigns screens render instantly on
// revisit (then refresh in the background), plus the user's card order.
interface CampaignCacheStore {
    owner: string | null;                         // user the cache belongs to
    campaigns: Campaign[];
    rows: CampaignCharacter[];
    heroes: (Character | DaggerheartCharacter)[]; // characters seen in rows + my own
    myCharacters: (Character | DaggerheartCharacter)[];
    order: Record<string, string[]>;              // group ("gm" | "playing" | "browse") -> campaign ids
    setHub: (owner: string, data: { campaigns: Campaign[]; rows: CampaignCharacter[]; heroes: (Character | DaggerheartCharacter)[]; myCharacters: (Character | DaggerheartCharacter)[] }) => void;
    mergeRoster: (owner: string, campaignID: string, rows: CampaignCharacter[], heroes: (Character | DaggerheartCharacter)[]) => void;
    removeCampaign: (campaignID: string) => void;
    updateCampaign: (campaign: Campaign) => void;
    setOrder: (group: string, ids: string[]) => void;
}

interface Ticket {
    appSection: string;
    description: string;
    user_id: string;
    type: string;
}

interface DaggerheartClassDescriptions {
    title: string;
    description: string;
}