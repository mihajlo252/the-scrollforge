import { supabase } from "../supabase/supabase";

export const getImageFromStorage = async ({bucket, folder, name}: {bucket: string, folder: string, name: string}) => {
    try {
        if (name == "") return { publicUrl: null };
        let src = `${folder}/${name}`
        if (folder == "") src = name;
        const { data } = supabase.storage.from(bucket).getPublicUrl(src);
        return data
    } catch (error) {
        throw(error);
    }

}

