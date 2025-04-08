import { supabase } from "../supabase/supabase";

export const getImageFromStorage = async ({bucket, folder, name}: {bucket: string, folder: string, name: string}) => {
    try {
        const { data } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${name}`);
        return data
    } catch (error) {
        throw(error);
    }

}

