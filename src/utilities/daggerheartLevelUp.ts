import advancementsData from "../daggerheart-config/advancements.json";
import { tierForLevel, defaultTraits, defaultVitals } from "./daggerheart";

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

const tierRange = (tier: number): [number, number] =>
	tier === 4 ? [8, 10] : tier === 3 ? [5, 7] : tier === 2 ? [2, 4] : [1, 1];

/** How many times each option id has been chosen earlier within the same tier. */
export const tierUsage = (advancements: DHAdvancements | undefined, tier: number): Record<string, number> => {
	const usage: Record<string, number> = {};
	if (!advancements) return usage;
	const [lo, hi] = tierRange(tier);
	Object.entries(advancements.perLevel ?? {}).forEach(([lvl, picks]) => {
		const n = parseInt(lvl);
		if (n >= lo && n <= hi) (picks ?? []).forEach((p: any) => (usage[p.id] = (usage[p.id] ?? 0) + 1));
	});
	return usage;
};

export interface LevelUpResult {
	patch: Partial<DaggerheartCharacter>;
	newLevel: number;
	enteredTier: boolean;
}

/** Pure: produce the column patch for advancing one level with the given picks. */
export const commitLevelUp = (character: DaggerheartCharacter, picks: AdvancementChoice[]): LevelUpResult => {
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
				if (tier === 4) advancements.subclassUnlocked.mastery = true;
				else advancements.subclassUnlocked.specialization = true;
				break;
			case "multiclass":
				if (pick.multiclass) advancements.multiclass = pick.multiclass;
				break;
		}
	});

	advancements.perLevel[String(newLevel)] = picks.map((p) => ({
		id: p.id,
		label: tierOptions(tier).find((o) => o.id === p.id)?.label ?? p.id,
	}));

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
