
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
}

interface UserStore {
    user: import('@supabase/supabase-js').User | null;
    setUser: (string, string) => Promise<void>;
    removeUser: () => void;
}

interface CharactersStore {
    characters: Character[] | DaggerheartCharacter[];
    setCharacters: (string) => Promise<any[]>;
}

interface CharacterStore {
    character: Character | DaggerheartCharacter;
    setCharacter: (character: Character | DaggerheartCharacter) => void;
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