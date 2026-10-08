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
                return res
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
            setCharacter: async (char: Character | DaggerheartCharacter) => {
                set({ character: char });
            },
            // Read-only guard: true only while a GM views another player's
            // character. Owner-initiated opens must reset this to false.
            viewOnly: false,
            setViewOnly: (viewOnly: boolean) => set({ viewOnly }),
        }),
        {
            name: "character",
            version: 1,
        }
    )
);

export const useCampaignStore = create<CampaignStore>()(
    persist(
        (set) => ({
            campaign: null,
            setCampaign: (campaign: Campaign) => set({ campaign }),
        }),
        {
            name: "campaign",
        }
    )
);

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: async (email: string, password: string) => {
                const data = await signIn(email, password);
                set({ user: data.user });
            },
            removeUser: () => set({ user: null }),
        }),
        {
            name: "user",
        }
    )
);

export const useCampaignCacheStore = create<CampaignCacheStore>()(
    persist(
        (set) => ({
            owner: null,
            campaigns: [],
            rows: [],
            heroes: [],
            myCharacters: [],
            order: {},
            // A different user signing in starts clean, including card order.
            setHub: (owner, data) =>
                set((s) => ({ ...data, owner, order: s.owner === owner ? s.order : {} })),
            // Detail screen refresh: replace this campaign's rows, upsert heroes.
            mergeRoster: (owner, campaignID, rows, heroes) =>
                set((s) => {
                    if (s.owner !== owner) return s;
                    const ids = new Set(heroes.map((h) => h.id));
                    return {
                        rows: [...s.rows.filter((r) => r.campaignID !== campaignID), ...rows],
                        heroes: [...s.heroes.filter((h) => !ids.has(h.id)), ...heroes],
                    };
                }),
            removeCampaign: (campaignID) =>
                set((s) => ({
                    campaigns: s.campaigns.filter((c) => c.id !== campaignID),
                    rows: s.rows.filter((r) => r.campaignID !== campaignID),
                })),
            setOrder: (group, ids) => set((s) => ({ order: { ...s.order, [group]: ids } })),
        }),
        {
            name: "campaign-cache",
        }
    )
);
