import {supabase} from "../supabase/supabase";

export const deleteCharacter = async (id: string) => {
    try {
        const { error } = await supabase.from("characters").delete().eq("id", id);
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};