import {supabase} from "../supabase/supabase";

export const signOut = async () => {
   const { error } = await supabase.auth.signOut()
   localStorage.removeItem("character");
   localStorage.removeItem("characters");

   if (error) {
       throw error  
   }

   
}
