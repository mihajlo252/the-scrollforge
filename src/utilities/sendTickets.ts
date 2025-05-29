import { supabase } from "../supabase/supabase";

export const sendTicket = async (ticket: any) => {
    try {
        const { error } = await supabase.from("tickets").insert(ticket)
        if (error) {
            throw error.message;
        }
    } catch (err) {
        throw err;
    }
};
