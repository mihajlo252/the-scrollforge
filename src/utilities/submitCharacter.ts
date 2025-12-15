import { supabase } from "../supabase/supabase";

export const submitCharacter = async (characterProfile: any, user: string, gameMode: string) => {
    
    try {
        const { error } = await supabase
            .from("characters")
            .insert({
                name: characterProfile.name,
                characterProfile: characterProfile,
                profileID: user,
                gamemode: gameMode
            });
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};
