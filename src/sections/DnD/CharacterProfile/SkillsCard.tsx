import { useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { calculateSaves, calculateSkills, calculateProficiencyBonus } from "../../../utilities/calculateStats";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { queueCharacterSave } from "../../../utilities/autosaveCharacter";
import styles from "./sheet.module.css";

const SKILL_DEFS: { key: keyof SkillProficiency; name: string; abil: string; stat: keyof Values }[] = [
	{ key: "acrobatics", name: "Acrobatics", abil: "DEX", stat: "dex" },
	{ key: "animalHandling", name: "Animal Handling", abil: "WIS", stat: "wis" },
	{ key: "arcana", name: "Arcana", abil: "INT", stat: "int" },
	{ key: "athletics", name: "Athletics", abil: "STR", stat: "str" },
	{ key: "deception", name: "Deception", abil: "CHA", stat: "cha" },
	{ key: "history", name: "History", abil: "INT", stat: "int" },
	{ key: "insight", name: "Insight", abil: "WIS", stat: "wis" },
	{ key: "intimidation", name: "Intimidation", abil: "CHA", stat: "cha" },
	{ key: "investigation", name: "Investigation", abil: "INT", stat: "int" },
	{ key: "medicine", name: "Medicine", abil: "WIS", stat: "wis" },
	{ key: "nature", name: "Nature", abil: "INT", stat: "int" },
	{ key: "perception", name: "Perception", abil: "WIS", stat: "wis" },
	{ key: "performance", name: "Performance", abil: "CHA", stat: "cha" },
	{ key: "persuasion", name: "Persuasion", abil: "CHA", stat: "cha" },
	{ key: "religion", name: "Religion", abil: "INT", stat: "int" },
	{ key: "sleightOfHand", name: "Sleight of Hand", abil: "DEX", stat: "dex" },
	{ key: "stealth", name: "Stealth", abil: "DEX", stat: "dex" },
	{ key: "survival", name: "Survival", abil: "WIS", stat: "wis" },
];

const SAVE_DEFS: { key: keyof SaveThrowsProficiency; label: string; stat: keyof Values }[] = [
	{ key: "str", label: "STR", stat: "str" },
	{ key: "dex", label: "DEX", stat: "dex" },
	{ key: "con", label: "CON", stat: "con" },
	{ key: "int", label: "INT", stat: "int" },
	{ key: "wis", label: "WIS", stat: "wis" },
	{ key: "cha", label: "CHA", stat: "cha" },
];

const EXPERTISE_CLASSES = ["artificer", "bard", "ranger", "rogue", "wizard", "redacted"];

export const SkillsCard = ({ character }: { character: Character }) => {
	const {
		stats: { primaryStats, saveThrowsProficiency, skillProficiency },
		characterProfile: { level, class: characterClass },
	} = character;
	const proficiencyBonus = parseInt(calculateProficiencyBonus({ level }) || "0");

	const [skills, setSkills] = useState<SkillProficiency>(skillProficiency);
	const [saves, setSaves] = useState<SaveThrowsProficiency>(saveThrowsProficiency);

	const persist = (key: "skillProficiency" | "saveThrowsProficiency", value: SkillProficiency | SaveThrowsProficiency) => {
		const { state } = JSON.parse(localStorage.getItem("character")!);
		const stats = { ...state.character.stats, [key]: value };
		patchCharacter(state, { stats });
		queueCharacterSave(character.id, { stats });
	};

	const toggleSkill = (key: keyof SkillProficiency) => {
		const current = skills[key];
		let next: string;
		if (current === "") next = "proficient";
		else if (current === "proficient") next = EXPERTISE_CLASSES.includes(characterClass.toLowerCase()) ? "expert" : "";
		else next = "";
		const updated = { ...skills, [key]: next };
		setSkills(updated);
		persist("skillProficiency", updated);
	};

	const toggleSave = (key: keyof SaveThrowsProficiency) => {
		const updated = { ...saves, [key]: !saves[key] };
		setSaves(updated);
		persist("saveThrowsProficiency", updated);
	};

	const half = Math.ceil(SKILL_DEFS.length / 2);
	const columns = [SKILL_DEFS.slice(0, half), SKILL_DEFS.slice(half)];

	return (
		<Frame classes="card">
			<div className="card-hdr">
				<div className="card-title">Skills &amp; Saves</div>
				<div className={styles.legend}>
					<span>
						<span className={styles.legendDot} style={{ background: "var(--gold-2)", borderColor: "var(--gold)", boxShadow: "0 0 0 2px rgba(from var(--gold-2) r g b / .2" }} /> Proficient
					</span>
					<span>
						<span className={styles.legendDot} style={{ background: "var(--ember-2)", borderColor: "var(--ember)", boxShadow: "0 0 0 2px rgba(from var(--ember-2) r g b / .2" }} /> Expertise
					</span>
				</div>
			</div>
			<div className="card-body">
				<h4 className={styles.savesTitle}>SAVING THROWS</h4>
				<div className="sf-saves">
					{SAVE_DEFS.map((s) => (
						<button key={s.key} type="button" className="sf-save-pill" onClick={() => toggleSave(s.key)}>
							<span className={`sf-skill-dot ${saves[s.key] ? "prof" : ""}`} />
							<span className="lbl">{s.label}</span>
							<span className="val">{calculateSaves({ stat: primaryStats[s.stat], proficiencyBonus, proficiency: saves[s.key] })}</span>
						</button>
					))}
				</div>

				<div className={styles.skillsGrid}>
					{columns.map((col, i) => (
						<div className={styles.skillCol} key={i}>
							{col.map((sk) => (
								<button key={sk.key} type="button" className="sf-skill-row" onClick={() => toggleSkill(sk.key)}>
									<span className={`sf-skill-dot ${skills[sk.key] === "proficient" ? "prof" : skills[sk.key] === "expert" ? "expert" : ""}`} />
									<span className="sf-skill-name">{sk.name}</span>
									<span className="sf-skill-abil">{sk.abil}</span>
									<span className="sf-skill-mod mono">
										{calculateSkills({ stat: primaryStats[sk.stat], proficiencyBonus, proficiency: skills[sk.key] })}
									</span>
								</button>
							))}
						</div>
					))}
				</div>
			</div>
		</Frame>
	);
};
