export const calculateModifiers = ({ stat }: { stat: number }) => {
    const mod = Math.floor((stat - 10) / 2);
    if (mod < 0) return 0;
    return mod;
};

export const calculateSaves = ({ stat, proficiencyBonus, proficiency }: { stat: number; proficiencyBonus: number, proficiency: boolean }) => {
    if (proficiency) return calculateModifiers({ stat }) + proficiencyBonus
    return calculateModifiers({ stat })
};

export const calculateSkills = ({
    stat,
    proficiencyBonus,
    proficiency,
}: {
    stat: number;
    proficiencyBonus: number;
    proficiency: string;
}) => {
    if (proficiency === "proficient") {
        return calculateModifiers({ stat }) + proficiencyBonus;
    } else if (proficiency === "expert") {
        return calculateModifiers({ stat }) + proficiencyBonus * 2;
    }
    return calculateModifiers({ stat });
};

export const calculatePassivePerception = ({
    stat,
    proficiencyBonus,
    proficiency,
}: {
    stat: number;
    proficiencyBonus: number;
    proficiency: string;
}) => {
    if (proficiency === "proficient") {
        return 10 + calculateModifiers({ stat }) + proficiencyBonus;
    } else if (proficiency === "expert") {
        return 10 + calculateModifiers({ stat }) + proficiencyBonus * 2;
    }
    return 10 + calculateModifiers({ stat }); 
};

export const calculateProficiencyBonus = ({level} : {level: number}) => {
    if (level < 5) return "2"
    if (level >=5 && level <= 8) return "3"
    if (level >=9 && level <=12 ) return "4"
    if (level >=13 && level <=16 ) return "5"
    if (level >= 17) return "6"
}