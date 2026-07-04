import React, { useState } from "react";
import { toast } from "sonner";
import { Frame } from "../../../components/Frame/Frame";
import { Icon } from "../../../components/Primitives";
import { getSubclass, tierForLevel } from "../../../utilities/daggerheart";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { sendData } from "../../../utilities/sendData";
import styles from "./sheet.module.css";

export const SheetTopbar = ({
	character,
	onNotes,
	onRoll,
	onRest,
	onLevelUp,
}: {
	character: DaggerheartCharacter;
	onNotes: () => void;
	onRoll: () => void;
	onRest?: () => void;
	/** targetLevel is passed when the level is typed directly, so the caller can
	 *  walk the character through every gained level's advancements. */
	onLevelUp?: (targetLevel?: number) => void;
}) => {
	const { characterProfile } = character;
	const committedLevel = characterProfile.level || 0;
	const [draftLevel, setDraftLevel] = useState<string>(String(committedLevel));
	const [conditions, setConditions] = useState<string[]>(character.dhVitals?.conditions ?? []);
	const [adding, setAdding] = useState(false);
	const [draft, setDraft] = useState("");

	const subclass = getSubclass(characterProfile.subclass);
	const initial = (characterProfile.name || "?").charAt(0).toUpperCase();
	const tier = tierForLevel(committedLevel || 1);

	const readState = () => JSON.parse(localStorage.getItem("character") ?? "{}").state;

	const [downloading, setDownloading] = useState(false);
	// The pdf tooling only loads when asked for, so it stays out of the app bundle.
	const downloadSheet = async () => {
		setDownloading(true);
		try {
			const { downloadDaggerheartSheet } = await import("../../../utilities/daggerheartSheetPdf");
			await downloadDaggerheartSheet(character);
		} catch {
			toast.error("Couldn't generate the character sheet PDF.");
		} finally {
			setDownloading(false);
		}
	};

	// Typing a HIGHER level opens the level-up flow to choose every gained
	// level's advancements; a lower/equal value is set directly.
	const commitLevel = () => {
		const value = parseInt(draftLevel) || 0;
		if (value === committedLevel) return;
		if (value > committedLevel) {
			onLevelUp?.(Math.min(10, value));
			setDraftLevel(String(committedLevel));
		} else {
			const next = { ...character.characterProfile, level: value };
			const state = readState();
			patchCharacter(state, { characterProfile: next });
			sendData("characters", character.id, { characterProfile: next });
		}
	};

	const persistConditions = (next: string[]) => {
		setConditions(next);
		const vitals = { ...(character.dhVitals as DHVitals), conditions: next };
		const state = readState();
		patchCharacter(state, { dhVitals: vitals });
		sendData("characters", character.id, { dhVitals: vitals });
	};

	const addCondition = (e: React.FormEvent) => {
		e.preventDefault();
		const value = draft.trim();
		if (!value) return;
		if (!conditions.includes(value)) persistConditions([...conditions, value]);
		setDraft("");
		setAdding(false);
	};

	return (
		<Frame classes={styles.topFrame}>
			<div className={styles.topbar}>
				<div className={styles.avatar}>{initial}</div>
				<div className={styles.identity}>
					<div className={styles.name}>{characterProfile.name}</div>
					<div className={styles.sub}>
						<span className="mono" style={{ color: "var(--gold-2)" }}>LV</span>
						<input
							type="text"
							placeholder="0"
							className={`input ${styles.levelInput}`}
							value={draftLevel}
							onChange={(e) => setDraftLevel(e.target.value)}
							onBlur={commitLevel}
							onKeyDown={(e) => {
								if (e.key === "Enter") (e.target as HTMLInputElement).blur();
							}}
							title="Set level — raising it lets you choose each new level's advancements"
						/>
						<span className="chip chip-gold">Tier {tier}</span>
						<span>
							· {characterProfile.ancestry} {characterProfile.community} · {characterProfile.class}
							{subclass ? ` (${subclass.name})` : ""} ·
						</span>
					</div>
				</div>
				<div className={styles.topActions}>
					<button className="button button-ghost" onClick={downloadSheet} disabled={downloading} type="button" title="Download a printable, filled-out character sheet">
						<Icon name="download" size={14} /> {downloading ? "PDF…" : "PDF"}
					</button>
					<button className="button button-ghost" onClick={onNotes} type="button">
						<Icon name="book" size={14} /> Notes
					</button>
					{onRest && (
						<button className="button button-ghost" onClick={onRest} type="button">
							<Icon name="rest" size={14} /> Rest
						</button>
					)}
					{onLevelUp && (
						<button className="button button-secondary" onClick={() => onLevelUp?.()} type="button">
							<Icon name="crown" size={14} /> Level Up
						</button>
					)}
					<div className={styles.vDivider} />
					<button className="button button-primary" onClick={onRoll} type="button">
						<Icon name="dice" size={14} /> Roll
					</button>
				</div>

				<div className={styles.conditions}>
					<span className={styles.condLabel}>Conditions</span>
					{conditions.length === 0 && !adding && (
						<span style={{ color: "var(--ink-faint)", fontSize: 12, fontStyle: "italic" }}>None</span>
					)}
					{conditions.map((c) => (
						<span key={c} className={`chip chip-ember ${styles.condChip}`}>
							{c}
							<button type="button" className={styles.condRemove} onClick={() => persistConditions(conditions.filter((x) => x !== c))} aria-label={`Remove ${c}`}>
								<Icon name="close" size={11} />
							</button>
						</span>
					))}
					{adding ? (
						<form className={styles.condForm} onSubmit={addCondition}>
							<input
								className={`input ${styles.condInput}`}
								autoFocus
								placeholder="Condition"
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								onBlur={() => !draft.trim() && setAdding(false)}
							/>
							<button type="submit" className="sf-icon-btn"><Icon name="check" size={14} /></button>
						</form>
					) : (
						<button type="button" className="pill" onClick={() => setAdding(true)}>
							<Icon name="plus" size={12} /> Add Condition
						</button>
					)}
				</div>
			</div>
		</Frame>
	);
};
