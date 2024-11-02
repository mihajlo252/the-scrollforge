import { create } from 'zustand'
import { getData } from '../utilities/getData';
import { signIn } from '../utilities/signIn';

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: <Character>{},
  setCharacter: async (id: string) => {
    const res = await getData("characters", id);
    set({ character: res[0] });
  }
  
}))

export const useUserStore = create<UserStore>((set) => ({
  user: {},
  getUser: async (email: string, password: string) => {
    const res = await signIn(email, password);
    set(res);
  },
  setUser: async (currentUser: {}) => {
    set({ user: currentUser});
  }
}))