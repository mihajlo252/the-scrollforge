import {supabase} from "../supabase/supabase";

export const deleteCharacter = async (id: string, gameMode: string) => {
    try {
        const { error } = await supabase.from(gameMode + "Characters").delete().eq("id", id);
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};