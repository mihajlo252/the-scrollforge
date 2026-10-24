/* Shared constants and pure helpers for Campaign Acts. */

export const MODULE_TYPES: Record<ActModuleType, { label: string; icon: string; chip: string; blurb: string }> = {
	story: { label: "Story", icon: "scroll", chip: "chip-gold", blurb: "Narration, scenes and lore to read or reveal." },
	option: { label: "Option", icon: "fwd", chip: "chip-arcane", blurb: "A choice the party faces and where each path leads." },
	adversary: { label: "Adversary", icon: "skull", chip: "chip-ember", blurb: "A foe's stat block, ready for the table." },
	encounter: { label: "Encounter", icon: "sword", chip: "", blurb: "A scene with its objective and the adversaries in it." },
	environment: { label: "Environment", icon: "hex", chip: "", blurb: "A place with its own features, hazards and dangers." },
	event: { label: "Event", icon: "bolt", chip: "", blurb: "Something that happens, its outcomes and a countdown." },
};
export const MODULE_ORDER: ActModuleType[] = ["story", "option", "adversary", "encounter", "environment", "event"];

export const DH_ROLES = ["Bruiser", "Horde", "Leader", "Minion", "Ranged", "Skulk", "Social", "Solo", "Standard", "Support"];
export const DH_RANGES = ["Melee", "Very Close", "Close", "Far", "Very Far"];
export const DH_FEATURE_KINDS = ["Passive", "Action", "Reaction"];
export const DH_ENVIRONMENT_KINDS = ["Exploration", "Social", "Traversal", "Event"];
export const DND_ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;

const ROMAN: [number, string][] = [
	[1000, "M"],
	[900, "CM"],
	[500, "D"],
	[400, "CD"],
	[100, "C"],
	[90, "XC"],
	[50, "L"],
	[40, "XL"],
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"],
];
export const roman = (n: number) => {
	let out = "";
	for (const [v, s] of ROMAN) {
		while (n >= v) {
			out += s;
			n -= v;
		}
	}
	return out;
};

// "Act II" for the act at index 1 of the ordered list.
export const actLabel = (acts: CampaignAct[], id: string) => {
	const i = acts.findIndex((a) => a.id === id);
	return i < 0 ? null : `Act ${roman(i + 1)}`;
};

// The GM's drag-and-drop order first, then creation time.
export const sortActs = (acts: CampaignAct[]) =>
	[...acts].sort((a, b) => {
		const sa = a.sortOrder ?? Infinity;
		const sb = b.sortOrder ?? Infinity;
		if (sa !== sb) return sa - sb;
		return a.created_at.localeCompare(b.created_at);
	});

export const uid = () => crypto.randomUUID();

export const newModule = (type: ActModuleType, gamemode: string): ActModule => {
	const id = uid();
	switch (type) {
		case "story":
			return { id, type, title: "", body: "", revealed: false };
		case "option":
			return { id, type, prompt: "", choices: [{ id: uid(), label: "", notes: "", leadsTo: null }] };
		case "encounter":
			return { id, type, title: "", setting: "", objective: "", adversaries: [], notes: "" };
		case "event":
			return { id, type, title: "", trigger: "", happens: "", outcomes: [], countdown: null, notes: "" };
		case "environment":
			return {
				id,
				type,
				name: "",
				description: "",
				adversaries: [],
				notes: "",
				stats:
					gamemode === "daggerheart"
						? { system: "daggerheart", tier: 1, kind: "Exploration", difficulty: null, impulses: "", features: [] }
						: { system: "dnd", terrain: "", hazards: [], features: [] },
			};
		case "adversary":
			return {
				id,
				type,
				name: "",
				description: "",
				notes: "",
				stats:
					gamemode === "daggerheart"
						? {
								system: "daggerheart",
								tier: 1,
								role: "Standard",
								difficulty: null,
								thresholds: { major: null, severe: null },
								hp: null,
								stress: null,
								attack: { modifier: null, name: "", range: "Melee", damage: "" },
								experiences: "",
								motives: "",
								features: [],
							}
						: {
								system: "dnd",
								meta: "",
								ac: null,
								hp: null,
								hitDice: "",
								speed: "30 ft.",
								abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
								cr: "",
								skills: "",
								senses: "",
								languages: "",
								traits: [],
								actions: [],
							},
			};
	}
};

// The heading a module shows in lists and pickers.
export const moduleTitle = (m: ActModule) => {
	switch (m.type) {
		case "story":
			return m.title || "Untitled story";
		case "option":
			return m.prompt || "Untitled choice";
		case "adversary":
			return m.name || "Unnamed adversary";
		case "encounter":
			return m.title || "Untitled encounter";
		case "environment":
			return m.name || "Unnamed environment";
		case "event":
			return m.title || "Untitled event";
	}
};

// A module can be saved once it has its one required field.
export const moduleIsValid = (m: ActModule) => {
	switch (m.type) {
		case "story":
			return !!(m.title.trim() || m.body.trim());
		case "option":
			return !!m.prompt.trim() && m.choices.some((c) => c.label.trim());
		case "adversary":
			return !!m.name.trim();
		case "encounter":
			return !!m.title.trim();
		case "environment":
			return !!m.name.trim();
		case "event":
			return !!m.title.trim() && (!m.countdown || m.countdown.start > 0);
	}
};

// Every adversary in the campaign, by module id, with the act it lives in.
export type AdversaryRef = { module: AdversaryModule; act: CampaignAct; actIndex: number };
export const adversaryIndex = (acts: CampaignAct[]) => {
	const map = new Map<string, AdversaryRef>();
	acts.forEach((act, actIndex) =>
		act.modules.forEach((m) => {
			if (m.type === "adversary") map.set(m.id, { module: m, act, actIndex });
		}),
	);
	return map;
};

// The pool for "copy from the pool" and the pickers, grouped by act.
export const adversaryPool = (acts: CampaignAct[], exclude: Set<string> = new Set()) =>
	acts
		.map((act, i) => ({ act, i, foes: act.modules.filter((m): m is AdversaryModule => m.type === "adversary" && !exclude.has(m.id)) }))
		.filter((g) => g.foes.length);

// Max HP of one adversary (null when the stat block doesn't set it).
export const maxHp = (m: AdversaryModule) => m.stats.hp;
export const maxStress = (m: AdversaryModule) => (m.stats.system === "daggerheart" ? m.stats.stress : null);
// Is this individual out of the fight?
export const isDefeated = (m: AdversaryModule, track: { hp: number }) => {
	const max = maxHp(m);
	return max != null && max > 0 && track.hp >= max;
};

export const signed = (n: number | null | undefined) => (n == null ? "—" : n >= 0 ? `+${n}` : `${n}`);
export const abilityMod = (score: number | null) => (score == null ? null : Math.floor((score - 10) / 2));
// Empty input → null, otherwise a number.
export const toNum = (v: string) => (v.trim() === "" || isNaN(Number(v)) ? null : Number(v));

// Immutable list edits used by every editor.
export const listOps = <T>(list: T[], set: (next: T[]) => void) => ({
	update: (i: number, patch: Partial<T>) => set(list.map((item, j) => (j === i ? { ...item, ...patch } : item))),
	remove: (i: number) => set(list.filter((_, j) => j !== i)),
	move: (i: number, dir: -1 | 1) => {
		const j = i + dir;
		if (j < 0 || j >= list.length) return;
		const next = [...list];
		[next[i], next[j]] = [next[j], next[i]];
		set(next);
	},
	add: (item: T) => set([...list, item]),
});
