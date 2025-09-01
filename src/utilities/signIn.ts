import { toast } from "../utilities/toasterSonner";
import {supabase} from "../supabase/supabase";

export const signIn = async (email: string, password : string) => {
   const {data, error } = await supabase.auth.signInWithPassword({
       email: email,
       password: password
   })

   if (error) {
       toast({ style: "bg-error text-base-100", message: error.message });
       throw error  
   }    
   return data
    
}
