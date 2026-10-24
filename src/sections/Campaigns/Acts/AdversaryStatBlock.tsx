import { DND_ABILITIES, abilityMod, signed } from "./actHelpers";
import styles from "./Acts.module.css";

// Read view of an adversary: its system's stat block plus description and notes.
export const AdversaryStatBlock = ({ module }: { module: AdversaryModule }) => (
	<div className={styles.statBlock}>
		{module.description && <p className={styles.prose}>{module.description}</p>}
		{module.stats.system === "daggerheart" ? <DhBlock s={module.stats} /> : <DndBlock s={module.stats} />}
		{module.notes && <Notes text={module.notes} />}
	</div>
);

const dash = (v: number | string | null | undefined) => (v == null || v === "" ? "—" : v);

const Stat = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) => (
	<div className={styles.stat}>
		<span className="caps">{label}</span>
		<span className={`mono ${styles.statVal}`}>{value}</span>
		{sub && <span className={styles.statSub}>{sub}</span>}
	</div>
);

const Line = ({ label, text }: { label: string; text?: string }) =>
	text ? (
		<p className={styles.line}>
			<b>{label}</b> {text}
		</p>
	) : null;

export const Entries = ({ title, list }: { title: string; list: { id: string; name: string; text: string; kind?: string }[] }) =>
	list.length ? (
		<div className={styles.entries}>
			<div className={`caps ${styles.entriesHd}`}>{title}</div>
			{list.map((e) => (
				<p key={e.id} className={styles.entry}>
					<b>{e.name || "Unnamed"}</b>
					{e.kind && <span className={styles.entryKind}> — {e.kind}</span>}
					{e.text && <>: {e.text}</>}
				</p>
			))}
		</div>
	) : null;

export const Notes = ({ text, label = "GM notes" }: { text: string; label?: string }) => (
	<div className={styles.notes}>
		<span className="caps">{label}</span>
		<p className={styles.prose}>{text}</p>
	</div>
);

const DhBlock = ({ s }: { s: DhAdversaryStats }) => (
	<>
		<div className={styles.statStrip}>
			<Stat label="Difficulty" value={dash(s.difficulty)} />
			<Stat label="Thresholds" value={`${dash(s.thresholds.major)} / ${dash(s.thresholds.severe)}`} sub="major / severe" />
			<Stat label="HP" value={dash(s.hp)} />
			<Stat label="Stress" value={dash(s.stress)} />
		</div>
		{(s.attack.name || s.attack.damage || s.attack.modifier != null) && (
			<p className={styles.line}>
				<b>ATK {signed(s.attack.modifier)}</b> {[s.attack.name, s.attack.range, s.attack.damage].filter(Boolean).join(" · ")}
			</p>
		)}
		<Line label="Experiences:" text={s.experiences} />
		<Line label="Motives & tactics:" text={s.motives} />
		<Entries title="Features" list={s.features} />
	</>
);

const DndBlock = ({ s }: { s: DndAdversaryStats }) => (
	<>
		{s.meta && <p className={`${styles.prose} ${styles.meta}`}>{s.meta}</p>}
		<div className={styles.statStrip}>
			<Stat label="AC" value={dash(s.ac)} />
			<Stat label="HP" value={dash(s.hp)} sub={s.hitDice || undefined} />
			<Stat label="Speed" value={dash(s.speed)} />
			<Stat label="CR" value={dash(s.cr)} />
		</div>
		<div className={styles.abilities}>
			{DND_ABILITIES.map((a) => (
				<div key={a} className={styles.ability}>
					<span className="caps">{a}</span>
					<span className="mono">{dash(s.abilities[a])}</span>
					<span className={`mono ${styles.statSub}`}>{s.abilities[a] == null ? "" : signed(abilityMod(s.abilities[a]))}</span>
				</div>
			))}
		</div>
		<Line label="Skills" text={s.skills} />
		<Line label="Senses" text={s.senses} />
		<Line label="Languages" text={s.languages} />
		<Entries title="Traits" list={s.traits} />
		<Entries title="Actions" list={s.actions} />
	</>
);
