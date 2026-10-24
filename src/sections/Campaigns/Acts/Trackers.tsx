import { ConfirmButton } from "../../../components/ConfirmButton";
import { Icon } from "../../../components/Primitives";
import { useHoldRepeat } from "../../../hooks/useHoldRepeat";
import { AdversaryStatBlock } from "./AdversaryStatBlock";
import { isDefeated, maxHp, maxStress, roman, type AdversaryRef } from "./actHelpers";
import styles from "./Acts.module.css";

type Track = { hp: number; stress: number };
const EMPTY: Track = { hp: 0, stress: 0 };

/* The GM's table-side view of an encounter's adversaries: one tracker per
 * individual (5× Bandit → Bandit 1…5), each with its own HP and Stress.
 * Daggerheart marks slots; D&D counts hit points down. */
export const EncounterTrackers = ({
	encounter,
	index,
	onChange,
	onOpenAct,
}: {
	encounter: EncounterModule;
	index: Map<string, AdversaryRef>;
	onChange: (adversaries: EncounterFoe[]) => void;
	onOpenAct: (actID: string) => void;
}) => {
	const setTrack = (fi: number, k: number, next: Track) =>
		onChange(
			encounter.adversaries.map((f, j) =>
				j !== fi ? f : { ...f, tracks: Array.from({ length: f.count }, (_, n) => (n === k ? next : (f.tracks?.[n] ?? EMPTY))) },
			),
		);
	const marked = encounter.adversaries.some((f) => f.tracks?.some((t) => t.hp || t.stress));

	return (
		<div className={styles.trackers}>
			<div className={styles.trackersHd}>
				<span className="caps">Adversaries</span>
				{marked && (
					<ConfirmButton
						className={`button button-ghost ${styles.addBtn}`}
						title="Reset all marks?"
						message="Clears the HP and Stress marked on every adversary in this encounter."
						confirmLabel="Reset"
						onConfirm={() => onChange(encounter.adversaries.map((f) => ({ ...f, tracks: undefined })))}
					>
						<Icon name="refresh" size={12} />
						Reset marks
					</ConfirmButton>
				)}
			</div>
			{encounter.adversaries.map((f, fi) => {
				const ref = index.get(f.moduleID);
				if (!ref) {
					return (
						<div key={f.moduleID} className={styles.foeGroup}>
							<span className={styles.missing}>Missing adversary</span>
						</div>
					);
				}
				const m = ref.module;
				const down = Array.from({ length: f.count }, (_, k) => isDefeated(m, f.tracks?.[k] ?? EMPTY)).filter(Boolean).length;
				return (
					<details key={f.moduleID} className={styles.foeGroup} open>
						<summary className={styles.foeGroupHd}>
							<span className={`display ${styles.foeGroupName}`}>{m.name || "Unnamed adversary"}</span>
							<span className="mono">×{f.count}</span>
							{down > 0 && <span className={styles.downCount}>{down} down</span>}
							<button
								type="button"
								className={styles.foeAct}
								onClick={(e) => {
									e.preventDefault();
									onOpenAct(ref.act.id);
								}}
							>
								Act {roman(ref.actIndex + 1)}
							</button>
						</summary>
						<details className={styles.foeStats}>
							<summary className="caps">Stat block</summary>
							<AdversaryStatBlock module={m} />
						</details>
						<div className={styles.individuals}>
							{Array.from({ length: f.count }, (_, k) => (
								<Individual
									key={k}
									name={f.count > 1 ? `${m.name || "Adversary"} ${k + 1}` : m.name || "Adversary"}
									module={m}
									track={f.tracks?.[k] ?? EMPTY}
									onChange={(t) => setTrack(fi, k, t)}
								/>
							))}
						</div>
					</details>
				);
			})}
		</div>
	);
};

const Individual = ({ name, module, track, onChange }: { name: string; module: AdversaryModule; track: Track; onChange: (t: Track) => void }) => {
	const hp = maxHp(module);
	const stress = maxStress(module);
	const defeated = isDefeated(module, track);
	return (
		<div className={styles.individual} data-defeated={defeated ? "" : undefined}>
			<div className={styles.indName}>
				{name}
				{defeated && <span className={styles.defeated}>Defeated</span>}
			</div>
			{module.stats.system === "daggerheart" ? (
				<>
					{/* HP is stored as marked but shown as what's left, so it starts full. */}
					<Slots
						label="HP"
						max={hp}
						value={hp ? Math.max(0, hp - track.hp) : 0}
						kind="hp"
						onChange={(left) => onChange({ ...track, hp: (hp ?? 0) - left })}
					/>
					<Slots label="Stress" max={stress} value={track.stress} kind="stress" onChange={(v) => onChange({ ...track, stress: v })} />
				</>
			) : (
				<HitPoints max={hp} damage={track.hp} onChange={(v) => onChange({ ...track, hp: v })} />
			)}
		</div>
	);
};

// Daggerheart: a row of slots, filled up to `value` (HP left, or Stress
// marked). Click a slot to fill up to it; click the last filled slot to empty it.
const Slots = ({
	label,
	max,
	value,
	kind,
	onChange,
}: {
	label: string;
	max: number | null;
	value: number;
	kind: "hp" | "stress";
	onChange: (v: number) => void;
}) => (
	<div className={styles.slotRow}>
		<span className="caps">{label}</span>
		{max ? (
			<span className={styles.slots}>
				{Array.from({ length: max }, (_, i) => (
					<button
						key={i}
						type="button"
						className={styles.slot}
						data-kind={kind}
						data-on={i < value ? "" : undefined}
						aria-label={`${label} ${i + 1}${i < value ? (kind === "hp" ? ", remaining" : ", marked") : ""}`}
						onClick={() => onChange(value === i + 1 ? i : i + 1)}
					/>
				))}
				<span className={`mono ${styles.slotCount}`}>
					{value}/{max}
				</span>
			</span>
		) : (
			<span className={styles.slotNone}>Not set in the stat block</span>
		)}
	</div>
);

// D&D: current hit points with hold-to-repeat − / +.
const HitPoints = ({ max, damage, onChange }: { max: number | null; damage: number; onChange: (damage: number) => void }) => {
	const current = max == null ? null : Math.max(0, max - damage);
	const step = (d: number) => {
		if (max == null) return;
		onChange(Math.min(max, Math.max(0, damage - d)));
	};
	const holdDown = useHoldRepeat(() => step(-1));
	const holdUp = useHoldRepeat(() => step(1));
	if (max == null) {
		return (
			<div className={styles.slotRow}>
				<span className="caps">HP</span>
				<span className={styles.slotNone}>Not set in the stat block</span>
			</div>
		);
	}
	return (
		<div className={styles.slotRow}>
			<span className="caps">HP</span>
			<span className={styles.hpStep}>
				<button type="button" className="sf-icon-btn" aria-label="Lose 1 HP" disabled={current === 0} {...holdDown}>
					−
				</button>
				<span className={`mono ${styles.hpNow}`}>
					{current}
					<span className={styles.slotCount}>/{max}</span>
				</span>
				<button type="button" className="sf-icon-btn" aria-label="Regain 1 HP" disabled={current === max} {...holdUp}>
					+
				</button>
			</span>
			<span className={styles.hpBar} aria-hidden>
				<span style={{ width: `${((current ?? 0) / max) * 100}%` }} />
			</span>
		</div>
	);
};

/* An event's countdown: tick it down at the table, undo a tick, or restart. */
export const Countdown = ({
	countdown,
	isDM,
	onChange,
}: {
	countdown: NonNullable<EventModule["countdown"]>;
	isDM: boolean;
	onChange: (current: number) => void;
}) => {
	const { start, current, label } = countdown;
	const done = current <= 0;
	return (
		<div className={styles.countdown} data-done={done ? "" : undefined}>
			<div className={styles.countdownHd}>
				<span className="caps">Countdown</span>
				<span className={styles.countdownLabel}>{done ? label || "The countdown has run out" : label ? `${label} in ${current}` : `${current} left`}</span>
			</div>
			<div className={styles.countdownRow}>
				<span className={styles.pips}>
					{Array.from({ length: start }, (_, i) => (
						<span key={i} className={styles.pip} data-on={i < current ? "" : undefined} />
					))}
				</span>
				{isDM && (
					<span className={styles.countdownTools}>
						<button type="button" className={`button button-primary ${styles.addBtn}`} disabled={done} onClick={() => onChange(current - 1)}>
							<Icon name="hourglass" size={12} />
							Tick
						</button>
						<button type="button" className="sf-icon-btn" aria-label="Undo a tick" title="Undo a tick" disabled={current >= start} onClick={() => onChange(current + 1)}>
							+
						</button>
						<button type="button" className="sf-icon-btn" aria-label="Restart countdown" title="Restart" disabled={current === start} onClick={() => onChange(start)}>
							<Icon name="refresh" size={13} />
						</button>
					</span>
				)}
			</div>
		</div>
	);
};
