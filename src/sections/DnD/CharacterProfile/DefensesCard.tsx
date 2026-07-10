import { Frame } from "../../../components/Frame/Frame";
import { calculatePassivePerception, calculateProficiencyBonus } from "../../../utilities/calculateStats";
import styles from "./sheet.module.css";

export const DefensesCard = ({ character }: { character: Character }) => {
	const {
		characterProfile: { level },
		stats: {
			primaryStats: { wis, int },
			skillProficiency: { perception, investigation, insight },
		},
	} = character;
	const proficiencyBonus = parseInt(calculateProficiencyBonus({ level }) || "0");

	const rows = [
		{ label: "Passive Perception", value: calculatePassivePerception({ stat: wis, proficiencyBonus, proficiency: perception }) },
		{ label: "Passive Investigation", value: calculatePassivePerception({ stat: int, proficiencyBonus, proficiency: investigation }) },
		{ label: "Passive Insight", value: calculatePassivePerception({ stat: wis, proficiencyBonus, proficiency: insight }) },
		{ label: "Proficiency", value: `+${proficiencyBonus}` },
	];

	return (
		<Frame classes="card">
			<div className="card-hdr">
				<div className="card-title">Senses &amp; Defenses</div>
			</div>
			<div className={`card-body ${styles.kvList}`}>
				{rows.map((r) => (
					<div key={r.label} className={styles.kv}>
						<span className="caps">{r.label}</span>
						<span className={styles.kvVal}>{r.value}</span>
					</div>
				))}
			</div>
		</Frame>
	);
};
