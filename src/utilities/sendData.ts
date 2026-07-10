import { supabase } from "../supabase/supabase";

export const sendData = async (table: string, id: string, value: any): Promise<boolean> => {
    try {
        const { error } = await supabase.from(table).update(value).eq("id", id);
        if (error) {
            console.error(error);
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};
