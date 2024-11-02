import {supabase} from "../supabase/supabase";

export const getData = async (table: string, id: string) => {
    const {data, error} = await supabase.from(table).select().eq("profileID", id);
    if (error) {
        throw error;
    }
    console.log(data);
    return data
}
