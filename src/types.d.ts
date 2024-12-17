interface Values {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}
interface Inspiration {
    purple: number,
    pink: number,
    white: number,
    red: number,
    yellow: number,
    regular: number
}

interface Skills {
    acrobatics: number;
    animalHandling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleightOfHand: number;
    stealth: number;
    survival: number;
}

interface Descriptions {
    racialTraits: string[];
    featureTraits: string[];
    attacks: Attack[];
}

interface Attack {
    name: string;
    range: string;
    attack: string;
    damage: string;
    description: string;
}

interface CharacterProfile {
    class: string;
    level: string;
    name: string;
    pastLife: string;
    race: string;
    subclass: string;
    subrace: string;
}

interface Stats {
    ac: number;
    hitDice: string;
    initiative: number;
    maxHP: number;
    passivePerception: number;
    proficiencyBonus: number;
    primaryMods: Values;
    primaryStats: Values;
    saveThrows: Values;
    skills: Skills;
}

interface Character {
    id: string;
    characterProfile: CharacterProfile;
    currentHP: number;
    stats: {
        ac: number;
        hitDice: string;
        initiative: number;
        maxHP: number;
        passivePerception: number;
        proficiencyBonus: number;
        primaryMods: Values;
        primaryStats: Values;
        saveThrows: Values;
        skills: Skills;
        inspiration: Inspiration
    };
    descriptions: Descriptions;
}

interface CharactersStore {
    characters: Character[];
    setCharacters: (string) => Promise<void>;
}

interface CharacterStore {
    character: Character;
    setCharacter: (character: Character) => void;
}