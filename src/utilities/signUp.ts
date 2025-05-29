import {supabase} from "../supabase/supabase";

export const signUp = async (email: string, password : string, username: string) => {
   const {data, error } = await supabase.auth.signUp({
       email: email,
       password: password,
       options: {
           data: {
               username: username
           }
       }
   })

   if (error) {
       throw error  
   }
   return data
    
}
