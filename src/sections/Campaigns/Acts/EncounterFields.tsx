import { useState } from "react";
import { Icon } from "../../../components/Primitives";
import { AreaField, FieldGroup, TextField } from "./Fields";
import { adversaryIndex, adversaryPool, listOps, roman } from "./actHelpers";
import styles from "./Acts.module.css";

// A scene and who's in it. Adversaries come from any act's Adversary modules.
export const EncounterFields = ({
	module,
	onChange,
	acts,
}: {
	module: EncounterModule;
	onChange: (m: EncounterModule) => void;
	acts: CampaignAct[];
}) => {
	const foes = listOps(module.adversaries, (adversaries) => onChange({ ...module, adversaries }));
	const index = adversaryIndex(acts);
	const [pick, setPick] = useState("");
	const taken = new Set(module.adversaries.map((a) => a.moduleID));
	const available = adversaryPool(acts, taken);

	const addPicked = () => {
		if (!pick) return;
		foes.add({ moduleID: pick, count: 1 });
		setPick("");
	};

	return (
		<>
			<TextField label="Title" value={module.title} placeholder="Ambush at the Mill Gate" onChange={(title) => onChange({ ...module, title })} />
			<AreaField
				label="Setting"
				optional
				rows={3}
				value={module.setting}
				placeholder="Smoke, a half-collapsed gate, a cart on its side for cover."
				onChange={(setting) => onChange({ ...module, setting })}
			/>
			<TextField
				label="Objective"
				optional
				value={module.objective}
				placeholder="Get the miller's family out before the roof falls."
				onChange={(objective) => onChange({ ...module, objective })}
			/>
			<FieldGroup title="Adversaries">
				{module.adversaries.length === 0 && (
					<p className={styles.groupEmpty}>
						{index.size ? "Add adversaries from any act's Adversary modules." : "Write an Adversary module first, then add it here."}
					</p>
				)}
				{module.adversaries.map((a, i) => {
					const ref = index.get(a.moduleID);
					return (
						<div key={a.moduleID} className={styles.foeRow}>
							<div className={styles.foeName}>
								{ref ? ref.module.name || "Unnamed adversary" : <span className={styles.missing}>Missing adversary</span>}
								{ref && <span className={styles.foeAct}>Act {roman(ref.actIndex + 1)}</span>}
							</div>
							<div className={styles.stepper}>
								<button
									type="button"
									className="sf-icon-btn"
									aria-label="One fewer"
									disabled={a.count <= 1}
									onClick={() => foes.update(i, { count: a.count - 1, tracks: a.tracks?.slice(0, a.count - 1) })}
								>
									−
								</button>
								<span className="mono">×{a.count}</span>
								<button type="button" className="sf-icon-btn" aria-label="One more" onClick={() => foes.update(i, { count: a.count + 1 })}>
									+
								</button>
							</div>
							<button type="button" className="sf-icon-btn" aria-label="Remove adversary" title="Remove adversary" onClick={() => foes.remove(i)}>
								<Icon name="close" size={13} />
							</button>
						</div>
					);
				})}
				{available.length > 0 && (
					<div className={styles.foePick}>
						<select className="select" value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Choose an adversary">
							<option value="">Choose an adversary…</option>
							{available.map((g) => (
								<optgroup key={g.act.id} label={`Act ${roman(g.i + 1)} · ${g.act.title}`}>
									{g.foes.map((m) => (
										<option key={m.id} value={m.id}>
											{m.name || "Unnamed adversary"}
										</option>
									))}
								</optgroup>
							))}
						</select>
						<button type="button" className="button button-ghost" disabled={!pick} onClick={addPicked}>
							<Icon name="plus" size={12} />
							Add
						</button>
					</div>
				)}
			</FieldGroup>
			<AreaField
				label="GM notes"
				optional
				rows={3}
				value={module.notes}
				placeholder="Reinforcements on round 3. The captain flees at half HP."
				onChange={(notes) => onChange({ ...module, notes })}
			/>
		</>
	);
};
