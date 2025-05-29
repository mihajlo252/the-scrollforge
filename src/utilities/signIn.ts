import {supabase} from "../supabase/supabase";

export const signIn = async (email: string, password : string) => {
   const {data, error } = await supabase.auth.signInWithPassword({
       email: email,
       password: password
   })

   if (error) {
       throw error  
   }
   return data
    
}
