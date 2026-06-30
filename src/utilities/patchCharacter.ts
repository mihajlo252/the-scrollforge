// Shared localStorage patch for the active character. Mirrors the inline
// helper used by the D&D sheet routes: writes the merged character back to the
// "character" key so the next route read sees the latest state immediately
// (the Supabase write via sendData happens alongside it in each caller).
export const patchCharacter = (state: any, patch: Record<string, any>) => {
	localStorage.setItem(
		"character",
		JSON.stringify({ state: { ...state, character: { ...state.character, ...patch } }, version: 1 }),
	);
};
