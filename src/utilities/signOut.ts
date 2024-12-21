import { supabase } from "../supabase/supabase";

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.clear();
    if (error) {
        throw error;
    }
};
