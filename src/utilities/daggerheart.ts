// Daggerheart config-derivation + rules helpers.
// Most "identity" data (domains, starting Evasion/HP, class/subclass/ancestry/
// community features, Hope feature, spellcast trait) is DERIVED from the config
// JSONs keyed by what `characterProfile` already stores — only mutable
// per-character state lives in the dh* columns.

import classesData from "../daggerheart-config/classes.json";
import subclassesData from "../daggerheart-config/subclasses.json";
import ancestriesData from "../daggerheart-config/ancestries.json";
import communitiesData from "../daggerheart-config/communities.json";
import weaponsData from "../daggerheart-config/weapons.json";
import armorsData from "../daggerheart-config/armors.json";

export type DescBlock = { paragraph?: string; list?: string[] };
export type Feature = { name: string; description: DescBlock[] };

type ClassConfig = {
	id: string;
	name: string;
	description: DescBlock[];
	domains: string[];
	startingEvasion: number;
	startingHitPoints: number;
	classItems: string[];
	hopeFeature: Feature;
	classFeatures: Feature[];
};

type SubclassConfig = {
	id: string;
	name: string;
	class: string;
	domains: string[];
	spellcastTrait?: string;
	foundation: { features: Feature[] };
	specialization: { features: Feature[] };
	mastery: { features: Feature[] };
};

type AncestryConfig = { id: string; name: string; description: DescBlock[]; features: Feature[] };
type CommunityConfig = { id: string; name: string; description: DescBlock[]; personalities?: string[]; features: Feature[] };

const CLASSES = classesData as unknown as ClassConfig[];
const SUBCLASSES = subclassesData as unknown as SubclassConfig[];
const ANCESTRIES = ancestriesData as unknown as AncestryConfig[];
const COMMUNITIES = communitiesData as unknown as CommunityConfig[];

const eq = (a?: string, b?: string) => (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

export const getClass = (name?: string): ClassConfig | undefined => CLASSES.find((c) => eq(c.name, name));
export const getSubclass = (name?: string): SubclassConfig | undefined => SUBCLASSES.find((s) => eq(s.name, name));
export const getAncestry = (name?: string): AncestryConfig | undefined => ANCESTRIES.find((a) => eq(a.name, name));
export const getCommunity = (name?: string): CommunityConfig | undefined => COMMUNITIES.find((c) => eq(c.name, name));

export const allClasses = () => CLASSES;
export const allAncestries = () => ANCESTRIES;
export const allCommunities = () => COMMUNITIES;
export const subclassesForClass = (className?: string) => SUBCLASSES.filter((s) => eq(s.class, className));

/** Flatten a config description array to plain text (paragraphs joined, list items prefixed). */
export const flattenDescription = (desc?: DescBlock[]): string => {
	if (!desc) return "";
	return desc
		.map((b) => {
			if (b.paragraph) return b.paragraph;
			if (b.list) return b.list.map((li) => `• ${li}`).join("\n");
			return "";
		})
		.filter(Boolean)
		.join("\n\n");
};

/** Domains a character has access to (from their class). */
export const getDomains = (className?: string): string[] => getClass(className)?.domains ?? [];

/** Spellcast trait from the subclass (martial subclasses return undefined). */
export const getSpellcastTrait = (subclassName?: string): string | undefined => getSubclass(subclassName)?.spellcastTrait;

/** Daggerheart tiers: lvl 1 = T1, 2-4 = T2, 5-7 = T3, 8-10 = T4. */
export const tierForLevel = (level: number): number => {
	if (level >= 8) return 4;
	if (level >= 5) return 3;
	if (level >= 2) return 2;
	return 1;
};

export const TRAIT_NAMES: DHTraitName[] = ["Agility", "Strength", "Finesse", "Instinct", "Presence", "Knowledge"];

/** Domain color map (the 9 Daggerheart domains), aligned to the app palette. */
const DH_DOMAIN_COLORS: Record<string, string> = {
	ARCANA: "#9b7fd0",
	BLADE: "#c6584f",
	BONE: "#b9ad94",
	CODEX: "#6f9fd8",
	GRACE: "#d6849b",
	MIDNIGHT: "#5b6ba8",
	SAGE: "#7faa6b",
	SPLENDOR: "#d8b65a",
	VALOR: "#d89a5a",
};

export const domainColor = (domain?: string): string => DH_DOMAIN_COLORS[(domain ?? "").toUpperCase()] ?? "var(--rule)";

export const defaultTraits = (): DHTraits => ({ Agility: 0, Strength: 0, Finesse: 0, Instinct: 0, Presence: 0, Knowledge: 0 });

export interface CreationBonuses {
	hp: number;
	stress: number;
	evasion: number;
	domainCards: number;
}

/** Flat creation-time grants parsed from the feature text of the hero's
 *  ancestry, community, class, and subclass FOUNDATION (the only subclass tier
 *  active at creation) — e.g. Human's extra Stress slot, Giant's extra Hit
 *  Point slot, Simiah's permanent +1 Evasion, School of Knowledge's extra
 *  domain card. Parsing the config text keeps homebrew entries working. */
export const creationBonuses = (identity: { class?: string; subclass?: string; ancestry?: string; community?: string }): CreationBonuses => {
	const features: Feature[] = [
		...(getAncestry(identity.ancestry)?.features ?? []),
		...(getCommunity(identity.community)?.features ?? []),
		...(getClass(identity.class)?.classFeatures ?? []),
		...(getSubclass(identity.subclass)?.foundation?.features ?? []),
	];
	const bonuses: CreationBonuses = { hp: 0, stress: 0, evasion: 0, domainCards: 0 };
	features.forEach((f) => {
		const text = flattenDescription(f.description);
		if (/additional hit point slot/i.test(text)) bonuses.hp += 1;
		if (/additional stress slot/i.test(text)) bonuses.stress += 1;
		if (/permanent \+1 bonus to your evasion/i.test(text)) bonuses.evasion += 1;
		if (/additional domain card/i.test(text)) bonuses.domainCards += 1;
	});
	return bonuses;
};

/** Group domain cards by level (ascending), each group's cards sorted by name.
 *  Used everywhere cards are listed so they're always organised by level. */
export const groupCardsByLevel = (cards: DomainCard[]): [number, DomainCard[]][] => {
	const map = new Map<number, DomainCard[]>();
	cards.forEach((c) => {
		const lvl = c.level ?? 1;
		if (!map.has(lvl)) map.set(lvl, []);
		map.get(lvl)!.push(c);
	});
	return [...map.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([lvl, list]) => [lvl, list.sort((x, y) => x.name.localeCompare(y.name))] as [number, DomainCard[]]);
};

// ── Weapon & armor catalogs (from weapons.json / armors.json) ──────────────
export type ConfigFeature = { name: string; description: DescBlock[] };
export type ConfigWeapon = {
	id: string;
	name: string;
	type: string; // PRIMARY_PHYSICAL | PRIMARY_MAGIC | SECONDARY
	tier: number;
	trait: string;
	range: string;
	damage: { dice: string; modifier?: number; type: string };
	burden: string;
	features?: ConfigFeature[];
};
export type ConfigArmor = {
	id: string;
	name: string;
	tier: number;
	baseMajorThreshold: number;
	baseSevereThreshold: number;
	baseScore: number;
	features?: ConfigFeature[];
};

const WEAPONS = weaponsData as unknown as ConfigWeapon[];
const ARMORS = armorsData as unknown as ConfigArmor[];

export const allArmors = () => ARMORS;
export const primaryWeapons = () => WEAPONS.filter((w) => w.type.startsWith("PRIMARY"));
export const secondaryWeapons = () => WEAPONS.filter((w) => w.type === "SECONDARY");
export const weaponById = (id?: string) => WEAPONS.find((w) => w.id === id);
export const armorById = (id?: string) => ARMORS.find((a) => a.id === id);

/** "VERY_CLOSE" → "Very Close", "AGILITY" → "Agility". */
export const titleWords = (s?: string): string =>
	(s ?? "")
		.split("_")
		.map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
		.join(" ")
		.trim();

export const formatWeaponDamage = (w: ConfigWeapon): string =>
	`${(w.damage?.dice ?? "").toLowerCase()}${w.damage?.modifier ? `+${w.damage.modifier}` : ""}`;

const flattenFeatures = (features?: ConfigFeature[]): string =>
	(features ?? []).map((f) => `${f.name}: ${flattenDescription(f.description)}`).join("\n");

/** Map a catalog weapon to the character-sheet weapon shape. */
export const weaponToDH = (w: ConfigWeapon): DHWeapon => ({
	name: w.name,
	trait: titleWords(w.trait),
	range: titleWords(w.range),
	damage: formatWeaponDamage(w),
	dtype: (w.damage?.type ?? "").toUpperCase() === "MAGICAL" ? "mag" : "phy",
	burden: w.burden === "TWO_HANDED" ? "Two-Handed" : "One-Handed",
	feature: flattenFeatures(w.features),
});

/** Map a catalog armor to the character-sheet armor shape. */
export const armorToDH = (a: ConfigArmor): DHArmor => ({
	name: a.name,
	score: a.baseScore,
	thresholds: { major: a.baseMajorThreshold, severe: a.baseSevereThreshold },
	feature: flattenFeatures(a.features),
});

// ── Gear stat modifiers (parsed from equipped items' feature text) ─────────
export interface GearModifiers {
	traits: Partial<DHTraits>;
	evasion: number;
	armorScore: number;
	thresholds: { major: number; severe: number };
}

const emptyGearMods = (): GearModifiers => ({ traits: {}, evasion: 0, armorScore: 0, thresholds: { major: 0, severe: 0 } });

/** Flat "±N to <stat>" clauses in gear feature text. Longest alternatives
 *  first so "all character traits and Evasion" isn't eaten by "Evasion".
 *  Conditional wordings ("by +2 until…", "bonus to your Evasion equal to…")
 *  don't fit this shape, so they stay display-only text. */
const GEAR_MOD_RE =
	/([+-]\d+)\s+to\s+(all character traits and evasion|armor score|major damage threshold|severe damage threshold|evasion|agility|strength|finesse|instinct|presence|knowledge)/gi;

/** Parse one item's feature text into flat stat modifiers (e.g. Full Plate's
 *  "-2 to Evasion; -1 to Agility"). Reading the string stored on the character
 *  (not the config) keeps homebrew gear and already-equipped items working. */
export const parseGearFeature = (feature?: string): GearModifiers => {
	const mods = emptyGearMods();
	for (const m of (feature ?? "").matchAll(GEAR_MOD_RE)) {
		const n = parseInt(m[1]);
		const stat = m[2].toLowerCase();
		if (stat === "evasion") mods.evasion += n;
		else if (stat === "armor score") mods.armorScore += n;
		else if (stat === "major damage threshold") mods.thresholds.major += n;
		else if (stat === "severe damage threshold") mods.thresholds.severe += n;
		else if (stat === "all character traits and evasion") {
			mods.evasion += n;
			TRAIT_NAMES.forEach((t) => (mods.traits[t] = (mods.traits[t] ?? 0) + n));
		} else {
			const trait = TRAIT_NAMES.find((t) => t.toLowerCase() === stat);
			if (trait) mods.traits[trait] = (mods.traits[trait] ?? 0) + n;
		}
	}
	return mods;
};

/** Combined modifiers from everything equipped (both weapons + armor).
 *  Applied at DISPLAY time on top of the stored base stats — never written
 *  back, so equipping/unequipping can't drift the stored values. */
export const gearModifiers = (weapons?: DHWeapons, armor?: DHArmor | null): GearModifiers => {
	const mods = emptyGearMods();
	[weapons?.primary?.feature, weapons?.secondary?.feature, armor?.feature].forEach((feature) => {
		const m = parseGearFeature(feature);
		mods.evasion += m.evasion;
		mods.armorScore += m.armorScore;
		mods.thresholds.major += m.thresholds.major;
		mods.thresholds.severe += m.thresholds.severe;
		(Object.entries(m.traits) as [DHTraitName, number][]).forEach(([t, n]) => (mods.traits[t] = (mods.traits[t] ?? 0) + n));
	});
	return mods;
};

/** "-2 Evasion · -1 Agility" summary for gear cards/hints; "" when empty. */
export const formatGearMods = (m: GearModifiers): string => {
	const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);
	const parts: string[] = [];
	if (m.evasion) parts.push(`${sign(m.evasion)} Evasion`);
	if (m.armorScore) parts.push(`${sign(m.armorScore)} Armor Score`);
	TRAIT_NAMES.forEach((t) => {
		const n = m.traits[t];
		if (n) parts.push(`${sign(n)} ${t}`);
	});
	if (m.thresholds.major) parts.push(`${sign(m.thresholds.major)} Major threshold`);
	if (m.thresholds.severe) parts.push(`${sign(m.thresholds.severe)} Severe threshold`);
	return parts.join(" · ");
};

/** Vitals seeded from class config — used to fill gaps for characters that
 *  predate the dh* columns (and as the wizard's starting point). */
export const defaultVitals = (className?: string, level = 1): DHVitals => {
	const cls = getClass(className);
	const hpTotal = cls?.startingHitPoints ?? 6;
	return {
		evasion: cls?.startingEvasion ?? 10,
		proficiency: 1,
		armorScore: 0,
		armorSlots: { total: 0, marked: 0 },
		// HP `marked` = boxes filled = hit points REMAINING (starts full).
		hp: { total: hpTotal, marked: hpTotal, major: 6 + level, severe: 12 + level },
		stress: { total: 6, marked: 0 },
		// Hope `marked` = boxes filled = current Hope; every hero starts with 2.
		hope: { total: 6, marked: 2 },
		conditions: [],
	};
};
