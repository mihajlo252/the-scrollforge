import { supabase } from "../supabase/supabase";

export const submitCharacter = async (character: any, user: string) => {
    
    try {
        const { error } = await supabase
            .from("characters")
            .insert({
                name: character.name,
                characterProfile: character.characterProfile,
                stats: character.stats,
                descriptions: character.descriptions,
                currentHP: character.currentHP,
                profileID: user
            });
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};
