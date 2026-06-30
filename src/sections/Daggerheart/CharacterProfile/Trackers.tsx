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

const Threshold = ({ tone, label, value, hint }: { tone: string; label: string; value: number; hint?: string }) => (
	<div className={styles.threshold} data-tone={tone}>
		<span className={styles.threshLabel}>{label}</span>
		<span className={styles.threshVal}>{value}</span>
		{hint && <span className={styles.threshHint}>{hint}</span>}
	</div>
);

export const HPTrack = ({ hp, onChange }: { hp: DHHPTrack; onChange?: (nextMarked: number) => void }) => (
	<div className={styles.hpWrap}>
		<BoxTrack total={hp.total} marked={hp.marked} onChange={onChange} color="var(--ember)" />
		<div className={styles.thresholds}>
			<Threshold tone="minor" label="Minor" value={1} hint="mark 1 HP" />
			<Threshold tone="major" label="Major" value={hp.major} hint="mark 2 HP" />
			<Threshold tone="severe" label="Severe" value={hp.severe} hint="mark 3 HP" />
		</div>
	</div>
);

export const DHTraitTile = ({ name, value, spellcast }: { name: string; value: number; spellcast?: boolean }) => (
	<div className={styles.traitTile} data-spellcast={spellcast ? "" : undefined}>
		<span className={styles.traitName}>{name}</span>
		<span className={styles.traitVal}>{value >= 0 ? `+${value}` : value}</span>
		{spellcast && <span className={styles.traitStar}>✦ Spellcast</span>}
	</div>
);
