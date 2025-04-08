import { supabase } from "../supabase/supabase";

export const getImageFromStorage = async ({bucket, folder, name}: {bucket: string, folder: string, name: string}) => {
    try {
        let src = `${folder}/${name}`
        if (folder == "") src = name;
        const { data } = supabase.storage.from(bucket).getPublicUrl(src);
        return data
    } catch (error) {
        throw(error);
    }

}

