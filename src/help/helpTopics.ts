export type HelpMode = "general" | "dnd" | "daggerheart";

export interface HelpTopic {
	id: string;
	title: string;
	mode: HelpMode;
	/** Glob key of the markdown source. */
	file: string;
	/** Raw markdown body, loaded at build time. */
	body: string;
}

export interface HelpGroup {
	label: string;
	mode: HelpMode;
	topics: HelpTopic[];
}

// Every guide topic's body, bundled as a raw string at build time (no runtime fetch).
const bodies = import.meta.glob("./guide/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

const topic = (id: string, title: string, mode: HelpMode, file: string): HelpTopic => ({
	id,
	title,
	mode,
	file,
	body: bodies[file] ?? `# ${title}\n\n_Content coming soon._`,
});

export const helpGroups: HelpGroup[] = [
	{
		label: "Getting Started",
		mode: "general",
		topics: [
			topic("general-welcome", "Welcome", "general", "./guide/getting-started/welcome.md"),
			topic("general-creating-a-character", "Creating a character", "general", "./guide/getting-started/creating-a-character.md"),
			topic("general-profile-hub", "The profile hub", "general", "./guide/getting-started/the-profile-hub.md"),
			topic("general-navigating-a-sheet", "Navigating a sheet", "general", "./guide/getting-started/navigating-a-sheet.md"),
			topic("general-chat-support-themes", "Chat, support & themes", "general", "./guide/getting-started/chat-support-themes.md"),
		],
	},
	{
		label: "Dungeons & Dragons",
		mode: "dnd",
		topics: [
			topic("dnd-character", "Combat sheet", "dnd", "./guide/dnd/character.md"),
			topic("dnd-spells", "Spells", "dnd", "./guide/dnd/spells.md"),
			topic("dnd-traits", "Traits", "dnd", "./guide/dnd/traits.md"),
			topic("dnd-attacks", "Attacks", "dnd", "./guide/dnd/attacks.md"),
			topic("dnd-inventory", "Inventory", "dnd", "./guide/dnd/inventory.md"),
			topic("dnd-inspiration", "Inspiration", "dnd", "./guide/dnd/inspiration.md"),
		],
	},
	{
		label: "Daggerheart",
		mode: "daggerheart",
		topics: [
			topic("daggerheart-character", "Vitals sheet", "daggerheart", "./guide/daggerheart/character.md"),
			topic("daggerheart-domains", "Domains", "daggerheart", "./guide/daggerheart/domains.md"),
			topic("daggerheart-features", "Features", "daggerheart", "./guide/daggerheart/features.md"),
			topic("daggerheart-equipment", "Equipment", "daggerheart", "./guide/daggerheart/equipment.md"),
			topic("daggerheart-journal", "Journal", "daggerheart", "./guide/daggerheart/journal.md"),
			topic("daggerheart-leveling-up", "Leveling up", "daggerheart", "./guide/daggerheart/leveling-up.md"),
		],
	},
];

export const allTopics: HelpTopic[] = helpGroups.flatMap((g) => g.topics);

export const topicById = (id: string): HelpTopic | undefined => allTopics.find((t) => t.id === id);

/**
 * Best-effort map from the current route to a topic id, so opening the guide
 * lands on whatever the user is looking at. Route tails like `/dnd/spells` and
 * `/daggerheart/domains` already line up with topic ids (`dnd-spells`,
 * `daggerheart-domains`); anything unmatched falls back to Welcome.
 */
export const topicIdForPath = (pathname: string): string => {
	const segments = pathname.split("/").filter(Boolean);
	const guess = segments.slice(-2).join("-");
	if (allTopics.some((t) => t.id === guess)) return guess;
	if (pathname.startsWith("/profile")) return "general-profile-hub";
	return "general-welcome";
};
