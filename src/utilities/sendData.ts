import { supabase } from "../supabase/supabase";

export const sendData = async (table: string, id: string, value: any) => {
    try {
        const { error } = await supabase.from(table).update(value).eq("id", id);
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};
