import React, { useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { calculateModifiers } from "../../../utilities/calculateStats";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { queueCharacterSave } from "../../../utilities/autosaveCharacter";
import { toast } from "../../../utilities/toasterSonner";
import styles from "./sheet.module.css";

export const AbilitiesCard = ({ character }: { character: Character }) => {
	const {
		stats: { primaryStats },
	} = character;

	const [str, setStr] = useState<number>(primaryStats.str);
	const [dex, setDex] = useState<number>(primaryStats.dex);
	const [con, setCon] = useState<number>(primaryStats.con);
	const [int, setInt] = useState<number>(primaryStats.int);
	const [wis, setWis] = useState<number>(primaryStats.wis);
	const [cha, setCha] = useState<number>(primaryStats.cha);

	const handleChangeStats = (e: React.ChangeEvent<HTMLInputElement>, setFunc: React.Dispatch<React.SetStateAction<number>>) => {
		if (e.target.value.length > 2 || parseInt(e.target.value) > 30) {
			toast({ style: "bg-secondary text-white", message: "You've exceeded the limit!" });
			return;
		}
		if (e.target.value[0] === "0") e.target.value = e.target.value.slice(1);
		setFunc(parseInt(e.target.value) || 0);
		const { state } = JSON.parse(localStorage.getItem("character")!);
		const stats = {
			...state.character.stats,
			primaryStats: { ...state.character.stats.primaryStats, [e.target.name]: parseInt(e.target.value) || 0 },
		};
		patchCharacter(state, { stats });
		queueCharacterSave(character.id, { stats });
	};

	const abilities = [
		{ key: "STR", name: "str", value: str, set: setStr },
		{ key: "DEX", name: "dex", value: dex, set: setDex },
		{ key: "CON", name: "con", value: con, set: setCon },
		{ key: "INT", name: "int", value: int, set: setInt },
		{ key: "WIS", name: "wis", value: wis, set: setWis },
		{ key: "CHA", name: "cha", value: cha, set: setCha },
	];

	return (
		<Frame classes="card">
			<div className="card-hdr">
				<div className="card-title">Abilities</div>
				<span className="caps">Modifier · Score</span>
			</div>
			<div className={`card-body ${styles.abilGrid}`}>
				{abilities.map((a) => (
					<div key={a.name} className="sf-ability">
						<div className="caps" style={{ color: "var(--gold-deep)" }}>{a.key}</div>
						<div className="display sf-ability-mod">{calculateModifiers({ stat: a.value })}</div>
						<input
							type="number"
							name={a.name}
							placeholder="0"
							className="sf-ability-val"
							value={a.value ?? 0}
							onChange={(e) => handleChangeStats(e, a.set)}
						/>
					</div>
				))}
			</div>
		</Frame>
	);
};
