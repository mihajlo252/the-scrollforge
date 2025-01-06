import { supabase } from "../supabase/supabase";

export const sendBug = async (bug: any) => {
    try {
        const { error } = await supabase.from("bug_tickets").insert(bug)
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};
