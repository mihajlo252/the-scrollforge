import { useId, useState } from "react";
import { AreaField, FieldGroup, ListRow, NumField, SelectField, TextField } from "./Fields";
import { DH_FEATURE_KINDS, DH_RANGES, DH_ROLES, DND_ABILITIES, adversaryPool, listOps, roman, toNum, uid } from "./actHelpers";
import campaignStyles from "../../../routeStyles/campaigns.module.css";
import styles from "./Acts.module.css";

// Name and notes are shared; the stat block follows the campaign's system.
// A new adversary can start as a copy of any adversary already in the campaign.
export const AdversaryFields = ({
	module,
	onChange,
	pool,
}: {
	module: AdversaryModule;
	onChange: (m: AdversaryModule) => void;
	pool?: ReturnType<typeof adversaryPool>;
}) => {
	const setStats = (stats: AdversaryModule["stats"]) => onChange({ ...module, stats });
	return (
		<>
			{pool && pool.length > 0 && <PoolPicker pool={pool} onPick={(src) => onChange({ ...structuredClone(src), id: module.id })} />}
			<TextField label="Name" value={module.name} placeholder="Bandit Captain" onChange={(name) => onChange({ ...module, name })} />
			<AreaField
				label="Description"
				optional
				rows={2}
				value={module.description}
				placeholder="A scarred veteran who keeps her crew in line with a whip."
				onChange={(description) => onChange({ ...module, description })}
			/>
			{module.stats.system === "daggerheart" ? (
				<DaggerheartStats stats={module.stats} onChange={setStats} />
			) : (
				<DndStats stats={module.stats} onChange={setStats} />
			)}
			<AreaField
				label="GM notes"
				optional
				rows={2}
				value={module.notes}
				placeholder="How she fights, when she runs, what she knows."
				onChange={(notes) => onChange({ ...module, notes })}
			/>
		</>
	);
};

const DaggerheartStats = ({ stats, onChange }: { stats: DhAdversaryStats; onChange: (s: DhAdversaryStats) => void }) => {
	const set = (patch: Partial<DhAdversaryStats>) => onChange({ ...stats, ...patch });
	const features = listOps(stats.features, (features) => set({ features }));
	return (
		<>
			<FieldGroup title="Stat block">
				<div className={styles.row2}>
					<SelectField label="Tier" value={stats.tier} onChange={(v) => set({ tier: Number(v) })}>
						{[1, 2, 3, 4].map((t) => (
							<option key={t} value={t}>
								Tier {t}
							</option>
						))}
					</SelectField>
					<SelectField label="Type" value={stats.role} onChange={(role) => set({ role })}>
						{DH_ROLES.map((r) => (
							<option key={r}>{r}</option>
						))}
					</SelectField>
				</div>
				<div className={styles.row4}>
					<NumField label="Difficulty" value={stats.difficulty} min={0} onChange={(v) => set({ difficulty: toNum(v) })} />
					<NumField
						label="Major"
						value={stats.thresholds.major}
						min={0}
						onChange={(v) => set({ thresholds: { ...stats.thresholds, major: toNum(v) } })}
					/>
					<NumField
						label="Severe"
						value={stats.thresholds.severe}
						min={0}
						onChange={(v) => set({ thresholds: { ...stats.thresholds, severe: toNum(v) } })}
					/>
					<NumField label="HP" value={stats.hp} min={0} onChange={(v) => set({ hp: toNum(v) })} />
					<NumField label="Stress" value={stats.stress} min={0} onChange={(v) => set({ stress: toNum(v) })} />
				</div>
			</FieldGroup>
			<FieldGroup title="Attack">
				<div className={styles.row2}>
					<TextField label="Weapon" value={stats.attack.name} placeholder="Whip" onChange={(name) => set({ attack: { ...stats.attack, name } })} />
					<NumField label="Modifier" value={stats.attack.modifier} onChange={(v) => set({ attack: { ...stats.attack, modifier: toNum(v) } })} />
				</div>
				<div className={styles.row2}>
					<SelectField label="Range" value={stats.attack.range} onChange={(range) => set({ attack: { ...stats.attack, range } })}>
						{DH_RANGES.map((r) => (
							<option key={r}>{r}</option>
						))}
					</SelectField>
					<TextField
						label="Damage"
						value={stats.attack.damage}
						placeholder="1d8+3 phy"
						onChange={(damage) => set({ attack: { ...stats.attack, damage } })}
					/>
				</div>
			</FieldGroup>
			<div className={styles.row2}>
				<TextField label="Experiences" optional value={stats.experiences} placeholder="Commander +2" onChange={(experiences) => set({ experiences })} />
				<TextField label="Motives & tactics" optional value={stats.motives} placeholder="Intimidate, flank, flee" onChange={(motives) => set({ motives })} />
			</div>
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
							<TextField label="Feature" value={f.name} placeholder="Rally the Crew" onChange={(name) => features.update(i, { name })} />
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

const DndStats = ({ stats, onChange }: { stats: DndAdversaryStats; onChange: (s: DndAdversaryStats) => void }) => {
	const set = (patch: Partial<DndAdversaryStats>) => onChange({ ...stats, ...patch });
	const traits = listOps(stats.traits, (traits) => set({ traits }));
	const actions = listOps(stats.actions, (actions) => set({ actions }));
	return (
		<>
			<FieldGroup title="Stat block">
				<div className={styles.row2}>
					<TextField label="Size, type, alignment" optional value={stats.meta} placeholder="Medium humanoid, neutral evil" onChange={(meta) => set({ meta })} />
					<TextField label="Challenge" optional value={stats.cr} placeholder="2 (450 XP)" onChange={(cr) => set({ cr })} />
				</div>
				<div className={styles.row4}>
					<NumField label="AC" value={stats.ac} min={0} onChange={(v) => set({ ac: toNum(v) })} />
					<NumField label="HP" value={stats.hp} min={0} onChange={(v) => set({ hp: toNum(v) })} />
					<TextField label="Hit dice" optional value={stats.hitDice} placeholder="10d8+20" onChange={(hitDice) => set({ hitDice })} />
					<TextField label="Speed" optional value={stats.speed} placeholder="30 ft." onChange={(speed) => set({ speed })} />
				</div>
				<div className={styles.row6}>
					{DND_ABILITIES.map((a) => (
						<NumField
							key={a}
							label={a.toUpperCase()}
							value={stats.abilities[a]}
							min={1}
							max={30}
							onChange={(v) => set({ abilities: { ...stats.abilities, [a]: toNum(v) } })}
						/>
					))}
				</div>
				<div className={styles.row3}>
					<TextField label="Skills" optional value={stats.skills} placeholder="Athletics +4" onChange={(skills) => set({ skills })} />
					<TextField label="Senses" optional value={stats.senses} placeholder="Passive Perception 12" onChange={(senses) => set({ senses })} />
					<TextField label="Languages" optional value={stats.languages} placeholder="Common" onChange={(languages) => set({ languages })} />
				</div>
			</FieldGroup>
			<NamedTextList title="Traits" addLabel="Add trait" placeholder="Pack Tactics" list={stats.traits} ops={traits} />
			<NamedTextList title="Actions" addLabel="Add action" placeholder="Scimitar" list={stats.actions} ops={actions} />
		</>
	);
};

const NamedTextList = ({
	title,
	addLabel,
	placeholder,
	list,
	ops,
}: {
	title: string;
	addLabel: string;
	placeholder: string;
	list: { id: string; name: string; text: string }[];
	ops: ReturnType<typeof listOps<{ id: string; name: string; text: string }>>;
}) => (
	<FieldGroup title={title} addLabel={addLabel} onAdd={() => ops.add({ id: uid(), name: "", text: "" })}>
		{list.length === 0 && <p className={styles.groupEmpty}>None yet.</p>}
		{list.map((t, i) => (
			<ListRow
				key={t.id}
				removeLabel={`Remove ${title.toLowerCase().replace(/s$/, "")}`}
				onRemove={() => ops.remove(i)}
				onMoveUp={i > 0 ? () => ops.move(i, -1) : undefined}
				onMoveDown={i < list.length - 1 ? () => ops.move(i, 1) : undefined}
			>
				<TextField label="Name" value={t.name} placeholder={placeholder} onChange={(name) => ops.update(i, { name })} />
				<AreaField label="Description" rows={2} value={t.text} onChange={(text) => ops.update(i, { text })} />
			</ListRow>
		))}
	</FieldGroup>
);

const PoolPicker = ({ pool, onPick }: { pool: ReturnType<typeof adversaryPool>; onPick: (m: AdversaryModule) => void }) => {
	const id = useId();
	const [picked, setPicked] = useState("");
	return (
		<div className={`${campaignStyles.field} ${styles.poolPick}`}>
			<label className="field-label" htmlFor={id}>
				Copy from the campaign pool <span className={campaignStyles.opt}>optional</span>
			</label>
			<select
				id={id}
				className="select"
				value={picked}
				onChange={(e) => {
					const src = pool.flatMap((g) => g.foes).find((m) => m.id === e.target.value);
					setPicked(e.target.value);
					if (src) onPick(src);
				}}
			>
				<option value="">Start from scratch</option>
				{pool.map((g) => (
					<optgroup key={g.act.id} label={`Act ${roman(g.i + 1)} · ${g.act.title}`}>
						{g.foes.map((m) => (
							<option key={m.id} value={m.id}>
								{m.name || "Unnamed adversary"}
							</option>
						))}
					</optgroup>
				))}
			</select>
			<span className={campaignStyles.fieldHint}>Fills in the whole stat block. Your changes here don't affect the original.</span>
		</div>
	);
};
