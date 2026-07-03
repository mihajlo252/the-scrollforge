import { supabase } from "../supabase/supabase";
import { toast } from "./toasterSonner";
import { Capitalize } from "./capitalize";
import { getClass, getDomains } from "./daggerheart";

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
}

/** Insert a Daggerheart character row with the identity profile PLUS all dh*
 *  columns seeded from class config + the wizard's picks. */
export const submitDaggerheartCharacter = async (draft: ForgeDraft, user: string) => {
	const cls = getClass(draft.class);
	const level = draft.level || 1;
	const armorScore = draft.armor?.score ?? 0;

	const characterProfile: CharacterProfileDaggerheart = {
		name: draft.name,
		class: draft.class,
		domains: getDomains(draft.class).map((d) => Capitalize(d)).join(" and "),
		level,
		ancestry: draft.ancestry,
		community: draft.community,
		subclass: draft.subclass,
	};

	const hpTotal = cls?.startingHitPoints ?? 6;
	const dhVitals: DHVitals = {
		evasion: cls?.startingEvasion ?? 10,
		proficiency: 1,
		armorScore,
		armorSlots: { total: armorScore, marked: 0 },
		hp: {
			// `marked` = boxes filled = HP remaining, so a fresh hero starts full.
			total: hpTotal,
			marked: hpTotal,
			major: (draft.armor?.thresholds.major ?? 6) + level,
			severe: (draft.armor?.thresholds.severe ?? 12) + level,
		},
		stress: { total: 6, marked: 0 },
		// Every hero begins with 2 Hope (filled dots).
		hope: { total: 6, marked: 2 },
		conditions: [],
	};

	const dhInventory: DHInventoryItem[] = (cls?.classItems ?? []).map((name) => ({ name, qty: 1, note: "" }));

	const row = {
		name: draft.name,
		characterProfile,
		profileID: user,
		gamemode: "daggerheart",
		dhTraits: draft.traits,
		dhVitals,
		// Loadout holds up to 5 cards; any extras (from higher-level creation) start in the vault.
		dhDomainCards: { loadout: draft.domainCards.slice(0, 5), vault: draft.domainCards.slice(5) },
		dhExperiences: draft.experiences,
		dhWeapons: draft.weapons,
		dhArmor: draft.armor,
		dhInventory,
		dhGold: { handfuls: 1, bags: 0, chest: 0 },
		dhBio: { background: draft.background, connections: draft.connections },
		dhAdvancements: { markedTraits: [], perLevel: {}, subclassUnlocked: { specialization: false, mastery: false } },
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
