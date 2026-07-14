import advancementsData from "../daggerheart-config/advancements.json";
import { tierForLevel, defaultTraits, defaultVitals, getDomains, TRAIT_NAMES } from "./daggerheart";

export interface AdvancementOption {
	id: string;
	label: string;
	description: string;
	icon?: string;
	slots: number;
	cost: number;
}

export interface AdvancementChoice {
	id: string;
	traits?: DHTraitName[];
	experiences?: number[];
	card?: DomainCard | null;
	multiclass?: { class: string; domain: string };
}

const TABLE = advancementsData as Record<string, AdvancementOption[]>;

export const tierOptions = (tier: number): AdvancementOption[] => TABLE[String(tier)] ?? [];

/** Total times each option id has been chosen across ALL levels so far.
 *  Advancement slots accumulate across tiers, so usage is tracked globally
 *  rather than reset per tier. */
export const cumulativeUsage = (advancements: DHAdvancements | undefined): Record<string, number> => {
	const usage: Record<string, number> = {};
	if (!advancements) return usage;
	Object.values(advancements.perLevel ?? {}).forEach((picks) => {
		(picks ?? []).forEach((p: any) => (usage[p.id] = (usage[p.id] ?? 0) + 1));
	});
	return usage;
};

/** An option's total available slots at a given tier: its per-tier allotment
 *  summed over every tier from 2 up to the current one. Unspent slots from an
 *  earlier tier therefore carry forward — e.g. Hit Point Slot (2 per tier) is
 *  worth 2 at Tier 2, 4 at Tier 3, and 6 at Tier 4 before usage is subtracted. */
export const cumulativeSlots = (optionId: string, tier: number): number => {
	let total = 0;
	for (let t = 2; t <= tier; t++) {
		total += (TABLE[String(t)] ?? []).find((o) => o.id === optionId)?.slots ?? 0;
	}
	return total;
};

/** Total advancement points a set of picks costs within a tier's option table. */
export const picksCost = (options: AdvancementOption[], picks: AdvancementChoice[]): number =>
	picks.reduce((sum, c) => sum + (options.find((o) => o.id === c.id)?.cost ?? 1), 0);

/** Whether a single pick has all the sub-choices it needs. */
export const choiceIsValid = (c: AdvancementChoice, experienceCount: number): boolean => {
	switch (c.id) {
		case "trait":
			return (c.traits?.length ?? 0) === 2;
		case "experience":
			return (c.experiences?.length ?? 0) === Math.min(2, experienceCount) && experienceCount > 0;
		case "domain":
			return !!c.card;
		case "multiclass":
			return !!c.multiclass?.class && !!c.multiclass?.domain;
		default:
			return true;
	}
};

export interface AdvancementContext {
	newLevel: number;
	tier: number;
	enteredTier: boolean;
	options: AdvancementOption[];
	usage: Record<string, number>;
	availableTraits: DHTraitName[];
	experiences: DHExperience[];
	browseable: DomainCard[];
}

/** Everything the advancement picker needs to advance `character` one level. */
export const advancementContext = (character: DaggerheartCharacter, catalog: DomainCard[]): AdvancementContext => {
	const level = character.characterProfile.level || 1;
	const newLevel = level + 1;
	const tier = tierForLevel(newLevel);
	const enteredTier = tier > tierForLevel(level);
	// Entering a tier clears marked traits, so every trait is up for grabs again.
	const marked = enteredTier ? [] : character.dhAdvancements?.markedTraits ?? [];
	const classDomains = getDomains(character.characterProfile.class);
	const owned = new Set([...(character.dhDomainCards?.loadout ?? []), ...(character.dhDomainCards?.vault ?? [])].map((c) => c.name.toLowerCase()));
	// Once Mastery is unlocked (which requires Specialization first), there's no
	// further subclass card to take, so drop that advancement option.
	const mastered = character.dhAdvancements?.subclassUnlocked?.mastery ?? false;
	return {
		newLevel,
		tier,
		enteredTier,
		// Each option's slots accumulate across tiers (unspent ones carry forward),
		// so its effective cap here is the summed allotment up to the current tier.
		options: tierOptions(tier)
			.filter((o) => o.id !== "subclass" || !mastered)
			.map((o) => ({ ...o, slots: cumulativeSlots(o.id, tier) })),
		usage: cumulativeUsage(character.dhAdvancements),
		availableTraits: TRAIT_NAMES.filter((t) => !marked.includes(t)),
		experiences: character.dhExperiences ?? [],
		browseable: catalog.filter(
			(c) => c.level <= newLevel && classDomains.some((d) => d.toUpperCase() === c.domain.toUpperCase()) && !owned.has(c.name.toLowerCase()),
		),
	};
};

/** Fold commitLevelUp over every level up to `targetLevel`, applying that
 *  level's picks — used by higher-level character creation so a forged hero
 *  gets exactly what leveling up would have granted. */
export const applyLevelUps = (
	base: DaggerheartCharacter,
	targetLevel: number,
	picksPerLevel: Record<number, AdvancementChoice[]>,
): DaggerheartCharacter => {
	let char = base;
	for (let lvl = (base.characterProfile.level || 1) + 1; lvl <= targetLevel; lvl++) {
		const { patch } = commitLevelUp(char, picksPerLevel[lvl] ?? []);
		char = { ...char, ...patch };
	}
	return char;
};

export interface LevelUpResult {
	patch: Partial<DaggerheartCharacter>;
	newLevel: number;
	enteredTier: boolean;
}

/** Pure: produce the column patch for advancing one level with the given picks.
 *  `newCard` is the domain card every level-up grants on top of the two
 *  advancement points — omitted at creation, where the wizard's Domain Cards
 *  step already hands out one card per level. */
export const commitLevelUp = (character: DaggerheartCharacter, picks: AdvancementChoice[], newCard?: DomainCard | null): LevelUpResult => {
	const level = character.characterProfile.level || 1;
	const newLevel = level + 1;
	const prevTier = tierForLevel(level);
	const tier = tierForLevel(newLevel);
	const enteredTier = tier > prevTier;

	const traits: DHTraits = { ...(character.dhTraits ?? defaultTraits()) };
	const vitals: DHVitals = JSON.parse(JSON.stringify(character.dhVitals ?? defaultVitals(character.characterProfile.class, newLevel)));
	const experiences: DHExperience[] = (character.dhExperiences ?? []).map((e) => ({ ...e }));
	const domainCards: DHDomainCards = {
		loadout: [...(character.dhDomainCards?.loadout ?? [])],
		vault: [...(character.dhDomainCards?.vault ?? [])],
	};
	const advancements: DHAdvancements = {
		markedTraits: [...(character.dhAdvancements?.markedTraits ?? [])],
		perLevel: { ...(character.dhAdvancements?.perLevel ?? {}) },
		subclassUnlocked: { ...(character.dhAdvancements?.subclassUnlocked ?? { specialization: false, mastery: false }) },
		multiclass: character.dhAdvancements?.multiclass,
	};

	// Automatic: damage thresholds rise by 1 each level.
	vitals.hp.major += 1;
	vitals.hp.severe += 1;

	// Tier-entry benefits (levels 2, 5, 8): +1 Proficiency, a new Experience, clear marked traits.
	if (enteredTier) {
		vitals.proficiency += 1;
		experiences.push({ name: "New Experience", bonus: 2 });
		advancements.markedTraits = [];
	}

	picks.forEach((pick) => {
		switch (pick.id) {
			case "trait":
				(pick.traits ?? []).forEach((t) => {
					traits[t] = (traits[t] ?? 0) + 1;
					advancements.markedTraits.push(t);
				});
				break;
			case "hp":
				vitals.hp.total += 1;
					vitals.hp.marked += 1; // keep current HP topped up with the new slot
				break;
			case "stress":
				vitals.stress.total += 1;
				break;
			case "evasion":
				vitals.evasion += 1;
				break;
			case "experience":
				(pick.experiences ?? []).forEach((i) => {
					if (experiences[i]) experiences[i].bonus += 1;
				});
				break;
			case "domain":
				if (pick.card) {
					if (domainCards.loadout.length < 5) domainCards.loadout.push(pick.card);
					else domainCards.vault.push(pick.card);
				}
				break;
			case "proficiency":
				vitals.proficiency += 1;
				break;
			case "subclass":
				// Subclass cards are sequential: grant the next one you don't have
				// yet — Specialization first, then Mastery. A skipped Specialization
				// is therefore picked up here in a later tier before Mastery.
				if (!advancements.subclassUnlocked.specialization) advancements.subclassUnlocked.specialization = true;
				else advancements.subclassUnlocked.mastery = true;
				break;
			case "multiclass":
				if (pick.multiclass) advancements.multiclass = pick.multiclass;
				break;
		}
	});

	if (newCard) {
		if (domainCards.loadout.length < 5) domainCards.loadout.push(newCard);
		else domainCards.vault.push(newCard);
	}

	advancements.perLevel[String(newLevel)] = [
		...picks.map((p) => ({
			id: p.id,
			label: tierOptions(tier).find((o) => o.id === p.id)?.label ?? p.id,
		})),
		// Record the granted card in the history; "card" is not an advancement
		// option id, so it never counts against tier slot usage.
		...(newCard ? [{ id: "card", label: `Domain Card: ${newCard.name}` }] : []),
	];

	return {
		newLevel,
		enteredTier,
		patch: {
			characterProfile: { ...character.characterProfile, level: newLevel },
			dhTraits: traits,
			dhVitals: vitals,
			dhExperiences: experiences,
			dhDomainCards: domainCards,
			dhAdvancements: advancements,
		},
	};
};
