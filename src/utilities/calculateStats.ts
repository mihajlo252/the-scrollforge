const calcBaseMod = ({ stat }: { stat: number }) => {
    const mod = Math.floor((stat - 10) / 2);
    return mod;
};
export const calculateModifiers = ({ stat }: { stat: number }) => {
    const mod = calcBaseMod({ stat });
    if (mod >= 0) return "+" + mod;
    return mod;
};

export const calculateSaves = ({ stat, proficiencyBonus, proficiency }: { stat: number; proficiencyBonus: number, proficiency: boolean }) => {
    const mod = calcBaseMod({ stat });
    if (proficiency) return "+" + (mod + proficiencyBonus)
    if (mod >= 0) return "+" + mod;
    return mod
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
    const mod = calcBaseMod({ stat });
    if (proficiency === "proficient") {
        if (mod + proficiencyBonus > 0) return "+" + (mod + proficiencyBonus);
        return mod + proficiencyBonus;
    } else if (proficiency === "expert") {
        if (mod + proficiencyBonus * 2 > 0) return "+" + (mod + proficiencyBonus * 2);
        return mod + proficiencyBonus * 2;
    }
    if (mod >= 0) return "+" + mod;
    return mod;
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
    const mod = calcBaseMod({ stat });
    if (proficiency === "proficient") {
        return 10 + mod + proficiencyBonus;
    } else if (proficiency === "expert") {
        return 10 + mod + proficiencyBonus * 2;
    }
    return 10 + mod; 
};

export const calculateProficiencyBonus = ({level} : {level: number}) => {
    if (level < 5) return "2"
    if (level >=5 && level <= 8) return "3"
    if (level >=9 && level <=12 ) return "4"
    if (level >=13 && level <=16 ) return "5"
    if (level >= 17) return "6"
}