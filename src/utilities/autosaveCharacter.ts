import { sendData } from "./sendData";
import { toast } from "./toasterSonner";

/* Debounced Supabase autosave for character edits. Every edit already lands in
 * localStorage synchronously (patchCharacter) — this queue only batches the
 * remote writes, so a burst of clicks becomes one update confirmed by one
 * toast. Patches are merged per character by top-level key, which is safe
 * because callers always send whole column values (stats, dhVitals, …). */

const DEBOUNCE_MS = 1000;

const pending = new Map<string, { patch: Record<string, any>; timer: number }>();

const flush = async (id: string) => {
	const entry = pending.get(id);
	if (!entry) return;
	pending.delete(id);
	window.clearTimeout(entry.timer);
	const ok = await sendData("characters", id, entry.patch);
	if (ok) toast({ style: "", message: "Character saved" });
	else toast({ style: "bg-secondary text-white", message: "Saving failed — changes kept on this device" });
};

export const queueCharacterSave = (id: string, patch: Record<string, any>) => {
	const prev = pending.get(id);
	if (prev) window.clearTimeout(prev.timer);
	pending.set(id, {
		patch: { ...prev?.patch, ...patch },
		timer: window.setTimeout(() => flush(id), DEBOUNCE_MS),
	});
};

/* Leaving the page (navigation, tab close, PWA backgrounding) flushes pending
 * writes immediately instead of losing the debounce window. */
const flushAll = () => {
	for (const id of [...pending.keys()]) void flush(id);
};
window.addEventListener("pagehide", flushAll);
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") flushAll();
});
