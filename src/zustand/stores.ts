import { create } from "zustand";
import { getData } from "../utilities/getData";
import { persist } from "zustand/middleware";

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