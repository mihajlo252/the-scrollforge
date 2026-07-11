import React, { useEffect, useRef, useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { HPBar, Icon } from "../../../components/Primitives";
import { calculateModifiers } from "../../../utilities/calculateStats";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { queueCharacterSave } from "../../../utilities/autosaveCharacter";
import { useHoldRepeat } from "../../../hooks/useHoldRepeat";
import styles from "./sheet.module.css";

export const HPCard = ({ character }: { character: Character }) => {
	const {
		id,
		currentHP,
		stats: {
			ac,
			hitDice,
			maxHP,
			primaryStats: { dex },
		},
	} = character;

	const [hp, setHp] = useState<number>(currentHP);
	const [max, setMax] = useState<number>(maxHP);
	const [delta, setDelta] = useState("");
	// Mirror the live HP so hold-to-repeat ticks compound off the freshest value
	// even before React has committed the previous tick's render.
	const hpRef = useRef(hp);
	useEffect(() => {
		hpRef.current = hp;
	}, [hp]);
	const [characterAC, setCharacterAC] = useState<number>(ac);
	const [characterHitDice, setCharacterHitDice] = useState<string>(hitDice);
	const [succ, setSucc] = useState(0);
	const [fail, setFail] = useState(0);

	const writeHP = (nextHp: number, nextMax: number) => {
		const { state } = JSON.parse(localStorage.getItem("character")!);
		const stats = { ...state.character.stats, maxHP: nextMax };
		patchCharacter(state, { currentHP: nextHp, stats });
		queueCharacterSave(id, { currentHP: nextHp, stats });
	};

	const stepHP = (sign: 1 | -1) => {
		// Empty box = step by 1; a typed number is added/subtracted instead.
		const amount = parseInt(delta) || 1;
		const prev = hpRef.current;
		const next = Math.max(0, Math.min(max, prev + sign * amount));
		if (next === prev) return;
		hpRef.current = next;
		setHp(next);
		writeHP(next, max);
	};

	// Press-and-hold to keep adjusting; delta clears once when the press ends.
	const clearDelta = () => setDelta("");
	const holdDown = useHoldRepeat(() => stepHP(-1), { onRelease: clearDelta });
	const holdUp = useHoldRepeat(() => stepHP(1), { onRelease: clearDelta });

	const changeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextMax = parseInt(e.target.value) || 0;
		const nextHp = Math.min(hp, nextMax);
		setMax(nextMax);
		setHp(nextHp);
		writeHP(nextHp, nextMax);
	};

	const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
		if (e.target.value[0] === "0") e.target.value = e.target.value.slice(1);
		setFunc(e.target.value);
		const { state } = JSON.parse(localStorage.getItem("character")!);
		const stats = { ...state.character.stats, [e.target.name]: e.target.value };
		patchCharacter(state, { stats });
		queueCharacterSave(id, { stats });
	};

	const toggleDeath = (kind: "succ" | "fail", index: number) => {
		const cur = kind === "succ" ? succ : fail;
		const next = cur === index + 1 ? index : index + 1;
		kind === "succ" ? setSucc(next) : setFail(next);
	};

	return (
		<Frame classes="card">
			<div className="card-hdr">
				<div className="card-title">Vitals</div>
				<span className="caps">Combat HUD</span>
			</div>
			<div className="card-body">
				<div className={styles.hpTop}>
					<div>
						<div className="caps">Hit Points</div>
						<div className={styles.hpBig}>
							<span className={styles.hpCur} style={{ color: hp > max * 0.25 ? "var(--text)" : "var(--ember-2)" }}>
								{hp}
							</span>
							<span className={styles.hpMax}>/</span>
							<input type="number" className={styles.hpMaxInput} value={max ?? 0} onChange={changeMax} aria-label="Max HP" />
						</div>
					</div>
					<div className={styles.spacer} />
					<div className={styles.hpDelta}>
						<input
							className={`input mono ${styles.deltaInput}`}
							value={delta}
							onChange={(e) => setDelta(e.target.value.replace(/[^0-9]/g, ""))}
							placeholder="0"
						/>
						<button className="button button-secondary short" type="button" aria-label="Subtract HP" {...holdDown}>
							−
						</button>
						<button className="button button-primary short" type="button" aria-label="Add HP" {...holdUp}>
							+
						</button>
					</div>
				</div>

				<HPBar cur={hp} max={max} temp={0} />

				<div className={styles.minifields}>
					<div className="sf-minifield">
						<div className="sf-minifield-hd">
							<Icon name="shield" size={11} />
							<span className="caps">AC</span>
						</div>
						<input
							type="number"
							name="ac"
							placeholder="0"
							className="sf-minifield-val"
							value={characterAC ?? ""}
							onChange={(e) => handleStatChange(e, setCharacterAC)}
						/>
					</div>
					<div className="sf-minifield">
						<div className="sf-minifield-hd">
							<Icon name="bolt" size={11} />
							<span className="caps">Init</span>
						</div>
						<div className="sf-minifield-val">{calculateModifiers({ stat: dex })}</div>
					</div>
					<div className="sf-minifield">
						<div className="sf-minifield-hd">
							<Icon name="d20" size={11} />
							<span className="caps">Hit Dice</span>
						</div>
						<input
							type="text"
							name="hitDice"
							placeholder="0"
							className="sf-minifield-val"
							value={characterHitDice ?? ""}
							onChange={(e) => handleStatChange(e, setCharacterHitDice)}
						/>
					</div>
				</div>

				<div className={styles.deathRow}>
					<span className="caps" style={{ color: "var(--ember-2)" }}>Death Saves</span>
					<div className={styles.deathGroup}>
						<span>SUCC</span>
						<div className={styles.deathDots}>
							{[0, 1, 2].map((i) => (
								<button
									key={i}
									type="button"
									className="sf-death-dot"
									data-on={i < succ ? "succ" : undefined}
									onClick={() => toggleDeath("succ", i)}
									aria-label={`Success ${i + 1}`}
								/>
							))}
						</div>
					</div>
					<div className={styles.deathGroup}>
						<span>FAIL</span>
						<div className={styles.deathDots}>
							{[0, 1, 2].map((i) => (
								<button
									key={i}
									type="button"
									className="sf-death-dot"
									data-on={i < fail ? "fail" : undefined}
									onClick={() => toggleDeath("fail", i)}
									aria-label={`Failure ${i + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</Frame>
	);
};
