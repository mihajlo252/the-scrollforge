import { supabase } from "../supabase/supabase";

export const getImageFromStorage = async ({bucket, name}: {bucket: string, name: string}) => {
    try {
        if (name == "") return { publicUrl: null };
        const { data } = supabase.storage.from(bucket).getPublicUrl(name);
        return data
    } catch (error) {
        throw(error);
    }

}

