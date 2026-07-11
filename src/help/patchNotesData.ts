// The patch-notes markdown is the single source of truth: to publish an update,
// add a new dated `## ...` section at the TOP of patch-notes.md. The newest
// heading's text becomes the "latest version", and users who haven't seen it get
// the What's New popup once.
const files = import.meta.glob("./patch-notes.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

export const patchNotesBody = files["./patch-notes.md"] ?? "";

const STORAGE_KEY = "patch-notes-version";

/** Latest release id = text of the first markdown heading in the notes. */
export const latestPatchVersion: string = (() => {
	const match = patchNotesBody.match(/^#{1,3}\s+(.+)$/m);
	return match ? match[1].trim() : "";
})();

export const getSeenPatchVersion = (): string | null => {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
};

export const markPatchSeen = (version: string = latestPatchVersion) => {
	try {
		localStorage.setItem(STORAGE_KEY, version);
	} catch {
		/* storage unavailable — non-fatal */
	}
};
