import React, { useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { Icon } from "../../../components/Primitives";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { queueCharacterSave } from "../../../utilities/autosaveCharacter";
import styles from "./sheet.module.css";

export const SheetTopbar = ({
	character,
	onRoll,
	onNotes,
}: {
	character: Character;
	onRoll: () => void;
	onNotes: () => void;
}) => {
	const { characterProfile } = character;
	const [level, setLevel] = useState<number>(characterProfile.level);

	const handleChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 0;
		setLevel(value);
		const { state } = JSON.parse(localStorage.getItem("character")!);
		const next = { ...state.character.characterProfile, level: value };
		patchCharacter(state, { characterProfile: next });
		queueCharacterSave(character.id, { characterProfile: next });
	};

	const initial = (characterProfile.name || "?").charAt(0).toUpperCase();

	return (
		<Frame classes={styles.topFrame}>
			<div className={styles.topbar}>
				<div className={styles.avatar}>{initial}</div>
				<div className={styles.identity}>
					<div className={styles.name}>{characterProfile.name}</div>
					<div className={styles.sub}>
						<span className="mono" style={{ color: "var(--gold-2)" }}>
							LV
						</span>
						<input type="text" placeholder="0" className={`input ${styles.levelInput}`} value={level ?? 0} onChange={handleChangeLevel} />

						<span>
							· {characterProfile.race} {characterProfile.subrace} · {characterProfile.class} {characterProfile.subclass} ·
						</span>
					</div>
				</div>
				<div className={styles.topActions}>
					<button className="button button-ghost" onClick={onNotes} type="button">
						<Icon name="book" size={14} /> Notes
					</button>
					<div className={styles.vDivider} />
					<button className="button button-primary" onClick={onRoll} type="button">
						<Icon name="dice" size={14} /> Roll
					</button>
				</div>
			</div>
		</Frame>
	);
};
