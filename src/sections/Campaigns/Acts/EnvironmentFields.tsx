import { useState } from "react";
import { Icon } from "../../../components/Primitives";
import { AreaField, FieldGroup, ListRow, NumField, SelectField, TextField } from "./Fields";
import { DH_ENVIRONMENT_KINDS, DH_FEATURE_KINDS, adversaryIndex, adversaryPool, listOps, roman, toNum, uid } from "./actHelpers";
import styles from "./Acts.module.css";

// A place: name and description are shared, the stat block follows the
// campaign's system, and potential adversaries come from the pool.
export const EnvironmentFields = ({
	module,
	onChange,
	acts,
}: {
	module: EnvironmentModule;
	onChange: (m: EnvironmentModule) => void;
	acts: CampaignAct[];
}) => {
	const setStats = (stats: EnvironmentModule["stats"]) => onChange({ ...module, stats });
	return (
		<>
			<TextField label="Name" value={module.name} placeholder="The Burning Mill" onChange={(name) => onChange({ ...module, name })} />
			<AreaField
				label="Description"
				optional
				rows={3}
				value={module.description}
				placeholder="A three-storey mill on the river, its wheel still turning as the roof burns."
				onChange={(description) => onChange({ ...module, description })}
			/>
			{module.stats.system === "daggerheart" ? (
				<DaggerheartEnvironment stats={module.stats} onChange={setStats} />
			) : (
				<DndEnvironment stats={module.stats} onChange={setStats} />
			)}
			<PotentialAdversaries ids={module.adversaries} acts={acts} onChange={(adversaries) => onChange({ ...module, adversaries })} />
			<AreaField label="GM notes" optional rows={2} value={module.notes} onChange={(notes) => onChange({ ...module, notes })} />
		</>
	);
};

const DaggerheartEnvironment = ({ stats, onChange }: { stats: DhEnvironmentStats; onChange: (s: DhEnvironmentStats) => void }) => {
	const set = (patch: Partial<DhEnvironmentStats>) => onChange({ ...stats, ...patch });
	const features = listOps(stats.features, (features) => set({ features }));
	return (
		<>
			<FieldGroup title="Stat block">
				<div className={styles.row3}>
					<SelectField label="Tier" value={stats.tier} onChange={(v) => set({ tier: Number(v) })}>
						{[1, 2, 3, 4].map((t) => (
							<option key={t} value={t}>
								Tier {t}
							</option>
						))}
					</SelectField>
					<SelectField label="Type" value={stats.kind} onChange={(kind) => set({ kind })}>
						{DH_ENVIRONMENT_KINDS.map((k) => (
							<option key={k}>{k}</option>
						))}
					</SelectField>
					<NumField label="Difficulty" value={stats.difficulty} min={0} onChange={(v) => set({ difficulty: toNum(v) })} />
				</div>
				<TextField label="Impulses" optional value={stats.impulses} placeholder="Collapse, spread the fire, trap the unwary" onChange={(impulses) => set({ impulses })} />
			</FieldGroup>
			<FieldGroup title="Features" addLabel="Add feature" onAdd={() => features.add({ id: uid(), name: "", kind: "Passive", text: "" })}>
				{stats.features.length === 0 && <p className={styles.groupEmpty}>No features yet.</p>}
				{stats.features.map((f, i) => (
					<ListRow
						key={f.id}
						removeLabel="Remove feature"
						onRemove={() => features.remove(i)}
						onMoveUp={i > 0 ? () => features.move(i, -1) : undefined}
						onMoveDown={i < stats.features.length - 1 ? () => features.move(i, 1) : undefined}
					>
						<div className={styles.row2}>
							<TextField label="Feature" value={f.name} placeholder="Falling Beams" onChange={(name) => features.update(i, { name })} />
							<SelectField label="Kind" value={f.kind} onChange={(kind) => features.update(i, { kind })}>
								{DH_FEATURE_KINDS.map((k) => (
									<option key={k}>{k}</option>
								))}
							</SelectField>
						</div>
						<AreaField label="Effect" rows={2} value={f.text} onChange={(text) => features.update(i, { text })} />
					</ListRow>
				))}
			</FieldGroup>
		</>
	);
};

const DndEnvironment = ({ stats, onChange }: { stats: DndEnvironmentStats; onChange: (s: DndEnvironmentStats) => void }) => {
	const set = (patch: Partial<DndEnvironmentStats>) => onChange({ ...stats, ...patch });
	const hazards = listOps(stats.hazards, (hazards) => set({ hazards }));
	const features = listOps(stats.features, (features) => set({ features }));
	return (
		<>
			<TextField
				label="Terrain"
				optional
				value={stats.terrain}
				placeholder="Difficult terrain: rubble, smoke (lightly obscured)"
				onChange={(terrain) => set({ terrain })}
			/>
			<FieldGroup title="Hazards" addLabel="Add hazard" onAdd={() => hazards.add({ id: uid(), name: "", dc: null, text: "" })}>
				{stats.hazards.length === 0 && <p className={styles.groupEmpty}>No hazards yet.</p>}
				{stats.hazards.map((h, i) => (
					<ListRow
						key={h.id}
						removeLabel="Remove hazard"
						onRemove={() => hazards.remove(i)}
						onMoveUp={i > 0 ? () => hazards.move(i, -1) : undefined}
						onMoveDown={i < stats.hazards.length - 1 ? () => hazards.move(i, 1) : undefined}
					>
						<div className={styles.row2}>
							<TextField label="Hazard" value={h.name} placeholder="Collapsing Floor" onChange={(name) => hazards.update(i, { name })} />
							<NumField label="DC" value={h.dc} min={0} onChange={(v) => hazards.update(i, { dc: toNum(v) })} />
						</div>
						<AreaField
							label="Effect"
							rows={2}
							value={h.text}
							placeholder="DC 13 Dexterity save or fall 10 ft. (1d6 bludgeoning)."
							onChange={(text) => hazards.update(i, { text })}
						/>
					</ListRow>
				))}
			</FieldGroup>
			<FieldGroup title="Features" addLabel="Add feature" onAdd={() => features.add({ id: uid(), name: "", text: "" })}>
				{stats.features.length === 0 && <p className={styles.groupEmpty}>No features yet.</p>}
				{stats.features.map((f, i) => (
					<ListRow
						key={f.id}
						removeLabel="Remove feature"
						onRemove={() => features.remove(i)}
						onMoveUp={i > 0 ? () => features.move(i, -1) : undefined}
						onMoveDown={i < stats.features.length - 1 ? () => features.move(i, 1) : undefined}
					>
						<TextField label="Feature" value={f.name} placeholder="Millwheel" onChange={(name) => features.update(i, { name })} />
						<AreaField label="Description" rows={2} value={f.text} onChange={(text) => features.update(i, { text })} />
					</ListRow>
				))}
			</FieldGroup>
		</>
	);
};

// Adversaries that might show up here, picked from the campaign pool.
const PotentialAdversaries = ({ ids, acts, onChange }: { ids: string[]; acts: CampaignAct[]; onChange: (ids: string[]) => void }) => {
	const index = adversaryIndex(acts);
	const available = adversaryPool(acts, new Set(ids));
	const [pick, setPick] = useState("");
	return (
		<FieldGroup title="Potential adversaries">
			{ids.length === 0 && (
				<p className={styles.groupEmpty}>{index.size ? "Who might the party meet here?" : "Write an Adversary module first, then add it here."}</p>
			)}
			{ids.map((id) => {
				const ref = index.get(id);
				return (
					<div key={id} className={styles.foeRow}>
						<div className={styles.foeName}>
							{ref ? ref.module.name || "Unnamed adversary" : <span className={styles.missing}>Missing adversary</span>}
							{ref && <span className={styles.foeAct}>Act {roman(ref.actIndex + 1)}</span>}
						</div>
						<button
							type="button"
							className="sf-icon-btn"
							aria-label="Remove adversary"
							title="Remove adversary"
							onClick={() => onChange(ids.filter((x) => x !== id))}
						>
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
					<button
						type="button"
						className="button button-ghost"
						disabled={!pick}
						onClick={() => {
							onChange([...ids, pick]);
							setPick("");
						}}
					>
						<Icon name="plus" size={12} />
						Add
					</button>
				</div>
			)}
		</FieldGroup>
	);
};
