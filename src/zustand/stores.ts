import { create } from "zustand";
import { getData } from "../utilities/getData";
import { persist } from "zustand/middleware";
import { signIn } from "../utilities/signIn";

export const useCharactersStore = create<CharactersStore>()(
    persist(
        (set) => ({
            characters: [],
            setCharacters: async (id: string) => {
                const res = await getData("characters", id);
                set({ characters: res });
            }
        }),
        {
            name: "characters",
        }
    )
);

export const useCharacterStore = create<CharacterStore>()(
    persist(
        (set) => ({
            character: <Character>{},
            setCharacter: async (char: Character) => {
                set({ character: char });
            }
        }),
        {
            name: "character",
        }
    )
);

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: "",
            setUser: async (email: string, password: string) => {
                
                const data = await signIn(email, password);
                set({ user: data.user.id });
            },
            removeUser: () => set({ user: "" }),
        }),
        {
            name: "characters",
        }
    )
);