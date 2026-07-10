import { toast } from "./toasterSonner";
import { supabase } from "../supabase/supabase";

export const submitCharacter = async (characterProfile: CharacterProfile | CharacterProfileDaggerheart, user: string, gameMode: string) => {
    
    try {
        const { error } = await supabase
            .from("characters")
            .insert({
                name: characterProfile.name,
                characterProfile: characterProfile,
                profileID: user,
                gamemode: gameMode
            });
        if (error) {
            toast({"style": "frame button-primary", "message": `Failed to create a character. Please try again. ${error.message}`});
            throw error.message
        }
    } catch (err) {
        throw err;
    }
};
// export const submitDndCharacter = async (characterProfile: any, user: string, gameMode: string) => {
    
//     try {
//         const { error } = await supabase
//             .from(gameMode + "Characters")
//             .insert({
//                 name: characterProfile.name,
//                 characterProfile: characterProfile,
//                 profileID: user,
//                 gamemode: gameMode
//             });
//         if (error) {
//             toast({"style": "frame button-primary", "message": `Failed to create a character. Please try again. ${error.message}`});
//             throw error.message
//         }
//     } catch (err) {
//         throw err;
//     }
// };

// export const submitDaggerheartCharacter = async (name: string, characterProfileDaggerheart: any, user: string, gameMode: string) => {
//     try {
//         const { error } = await supabase.from(gameMode + "Characters").insert({
//             name: name,
//             characterProfile: characterProfileDaggerheart,
        
//             profileID: user,
//             gamemode: gameMode,
//         });
//         if (error) {
//             toast({"style": "frame button-primary", "message": `Failed to create a character. Please try again. ${error.message}`});
//             throw error.message;
//         }
//     } catch (err) {
//         throw err;
//     }
// };