import styles from "./Trackers.module.css";

/** Toggle semantics: clicking a box fills up to it; clicking the highest
 *  filled box clears it. Returns the new marked count. */
const nextMarked = (i: number, marked: number) => (i + 1 === marked ? i : i + 1);

export const BoxTrack = ({
	total,
	marked,
	onChange,
	color = "var(--gold)",
	shape = "square",
}: {
	total: number;
	marked: number;
	onChange?: (next: number) => void;
	color?: string;
	shape?: "square" | "circle";
}) => (
	<div className={styles.track}>
		{Array.from({ length: total }).map((_, i) => (
			<button
				key={i}
				type="button"
				className={styles.box}
				data-shape={shape}
				data-filled={i < marked ? "" : undefined}
				style={{ ["--_fill" as any]: color }}
				onClick={() => onChange?.(nextMarked(i, marked))}
				aria-label={`${i + 1} of ${total}`}
			/>
		))}
	</div>
);

/** A damage zone: how much HP you lose for a hit that lands in this band. */
const DamageZone = ({ tone, label, marks }: { tone: string; label: string; marks: number }) => (
	<div className={styles.dmgZone} data-tone={tone}>
		<span className={styles.dmgZoneLabel}>{label}</span>
		<span className={styles.dmgZoneMarks}>mark {marks}</span>
	</div>
);

/** A threshold coin sitting between two damage zones (Major / Severe values). */
const ThresholdCoin = ({ label, value }: { label: string; value: number }) => (
	<div className={styles.threshCoin}>
		<span className={styles.threshCoinVal}>{value}</span>
		<span className={styles.threshCoinLabel}>{label}</span>
	</div>
);

/** Daggerheart has TWO damage thresholds (Major, Severe) creating three bands:
 *  below Major → Minor (mark 1), Major–Severe → mark 2, at/above Severe → mark 3.
 *  A hit of at least double the Severe threshold marks 4. The HP boxes show
 *  hit points REMAINING — click to spend them as you take damage. */
export const HPTrack = ({ hp, onChange }: { hp: DHHPTrack; onChange?: (nextMarked: number) => void }) => (
	<div className={styles.hpWrap}>
		<BoxTrack total={hp.total} marked={hp.marked} onChange={onChange} color="var(--ember)" />
		<div className={styles.thresholds}>
			<DamageZone tone="minor" label="Minor" marks={1} />
			<ThresholdCoin label="Major" value={hp.major} />
			<DamageZone tone="major" label="Major" marks={2} />
			<ThresholdCoin label="Severe" value={hp.severe} />
			<DamageZone tone="severe" label="Severe" marks={3} />
		</div>
		<span className={styles.threshFootnote}>Damage ≥ {hp.severe * 2} (double Severe) marks 4.</span>
	</div>
);

export const DHTraitTile = ({ name, value, spellcast }: { name: string; value: number; spellcast?: boolean }) => (
	<div className={styles.traitTile} data-spellcast={spellcast ? "" : undefined}>
		<span className={styles.traitName}>{name}</span>
		<span className={styles.traitVal}>{value >= 0 ? `+${value}` : value}</span>
		{spellcast && <span className={styles.traitStar}>✦ Spellcast</span>}
	</div>
);
