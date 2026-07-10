import { supabase } from "../supabase/supabase";
import { toast } from "./toasterSonner";
import { Capitalize } from "./capitalize";
import { creationBonuses, getClass, getDomains } from "./daggerheart";
import { applyLevelUps, type AdvancementChoice } from "./daggerheartLevelUp";

export interface ForgeDraft {
	name: string;
	level: number;
	class: string;
	subclass: string;
	ancestry: string;
	community: string;
	traits: DHTraits;
	weapons: DHWeapons;
	armor: DHArmor | null;
	background: DHBioEntry[];
	experiences: DHExperience[];
	domainCards: DomainCard[];
	connections: DHBioEntry[];
	/** Per-level advancement picks (levels 2..level) for heroes forged above level 1. */
	advancements?: Record<number, AdvancementChoice[]>;
}

/** The LEVEL 1 version of the drafted hero, with creation-time feature bonuses
 *  (extra HP/Stress slots, permanent Evasion) applied. Higher-level creation
 *  folds real level-ups on top of this seed so the result matches what
 *  leveling up from 1 would have produced. */
export const forgeBaseCharacter = (draft: ForgeDraft): DaggerheartCharacter => {
	const cls = getClass(draft.class);
	const bonus = creationBonuses(draft);
	const armorScore = draft.armor?.score ?? 0;
	const hpTotal = (cls?.startingHitPoints ?? 6) + bonus.hp;

	const dhVitals: DHVitals = {
		evasion: (cls?.startingEvasion ?? 10) + bonus.evasion,
		proficiency: 1,
		armorScore,
		armorSlots: { total: armorScore, marked: 0 },
		hp: {
			// `marked` = boxes filled = HP remaining, so a fresh hero starts full.
			total: hpTotal,
			marked: hpTotal,
			// Damage thresholds = armor base + level (1 here; level-ups add the rest).
			major: (draft.armor?.thresholds.major ?? 6) + 1,
			severe: (draft.armor?.thresholds.severe ?? 12) + 1,
		},
		stress: { total: 6 + bonus.stress, marked: 0 },
		// Every hero begins with 2 Hope (filled dots).
		hope: { total: 6, marked: 2 },
		conditions: [],
	};

	return {
		id: "",
		name: draft.name,
		profileID: "",
		gamemode: "daggerheart",
		characterProfile: {
			name: draft.name,
			class: draft.class,
			domains: getDomains(draft.class).map((d) => Capitalize(d)).join(" and "),
			level: 1,
			ancestry: draft.ancestry,
			community: draft.community,
			subclass: draft.subclass,
		},
		dhTraits: draft.traits,
		// Loadout holds up to 5 cards; any extras (from higher-level creation) start in the vault.
		dhDomainCards: { loadout: draft.domainCards.slice(0, 5), vault: draft.domainCards.slice(5) },
		dhVitals,
		dhExperiences: draft.experiences,
		dhWeapons: draft.weapons,
		dhArmor: draft.armor,
		dhInventory: (cls?.classItems ?? []).map((name) => ({ name, qty: 1, note: "" })),
		dhGold: { handfuls: 1, bags: 0, chest: 0 },
		dhBio: { background: draft.background, connections: draft.connections },
		dhAdvancements: { markedTraits: [], perLevel: {}, subclassUnlocked: { specialization: false, mastery: false } },
		// The shared interface also carries DnD-only fields (stats, currentHP, …)
		// that a Daggerheart row never has.
	} as unknown as DaggerheartCharacter;
};

/** Insert a Daggerheart character row: the level-1 seed leveled up to the
 *  drafted level with the wizard's advancement picks. */
export const submitDaggerheartCharacter = async (draft: ForgeDraft, user: string) => {
	const final = applyLevelUps(forgeBaseCharacter(draft), draft.level || 1, draft.advancements ?? {});

	const row = {
		name: draft.name,
		characterProfile: final.characterProfile,
		profileID: user,
		gamemode: "daggerheart",
		dhTraits: final.dhTraits,
		dhVitals: final.dhVitals,
		dhDomainCards: final.dhDomainCards,
		dhExperiences: final.dhExperiences,
		dhWeapons: final.dhWeapons,
		dhArmor: final.dhArmor,
		dhInventory: final.dhInventory,
		dhGold: final.dhGold,
		dhBio: final.dhBio,
		dhAdvancements: final.dhAdvancements,
	};

	try {
		const { error } = await supabase.from("characters").insert(row);
		if (error) {
			toast({ style: "frame button-primary", message: `Failed to forge hero. Please try again. ${error.message}` });
			throw error.message;
		}
	} catch (err) {
		throw err;
	}
};
