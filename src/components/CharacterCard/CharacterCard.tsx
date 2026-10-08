import { useRouter } from "@tanstack/react-router";
import { Avatar } from "../Avatar/Avatar";
import { HPBar, Icon } from "../Primitives";
import DaggerheartClasses from "../../daggerheart-config/classes.json";
import styles from "./CharacterCard.module.css";

// Shared character card used by the Profile grid (owner, with delete) and the
// Campaign party grid. `onDelete` is optional — omit it to hide the delete
// button. `onEnter` is optional too — omit it for a display-only card (a player
// looking at their party). `tag` pins a small gold label to the portrait, and
// `footer` renders extra controls under the actions.
export const CharacterCard = ({
	character,
	onEnter,
	onDelete,
	actionLabel = "Open Scroll",
	actionIcon,
	tag,
	footer,
}: {
	character: Character | DaggerheartCharacter;
	onEnter?: (char: Character | DaggerheartCharacter) => void;
	onDelete?: (char: Character | DaggerheartCharacter) => void;
	actionLabel?: string;
	actionIcon?: string;
	tag?: string | null;
	footer?: React.ReactNode;
}) => {
	const router = useRouter();
	const preload = () => router.preloadRoute({ to: "/" + character.gamemode + "/character/" }).catch(() => {});
	const isDnd = character.gamemode === "dnd";
	const profile: any = character.characterProfile;
	const name = profile?.name ?? (character as any).name;
	const level = profile?.level;

	const lineage = isDnd
		? [profile?.race, profile?.subrace].filter(Boolean).join(" ")
		: [profile?.ancestry, profile?.community].filter(Boolean).join(" ");
	const job = [profile?.class, profile?.subclass].filter(Boolean).join(" ");

	// Daggerheart hp.marked counts HP REMAINING (boxes still filled), not damage.
	// Fall back to the class starting HP for legacy characters without dhVitals.
	const dhHP = !isDnd ? (character as DaggerheartCharacter).dhVitals?.hp : undefined;
	const dhMaxHP =
		dhHP?.total ??
		(!isDnd
			? (DaggerheartClasses as any[]).find((c) => c.name === (profile?.class ?? "").toUpperCase())?.startingHitPoints
			: undefined);
	const maxHP = isDnd ? (character as any).stats?.maxHP : dhMaxHP;
	const currentHP = isDnd ? (character as any).currentHP : dhHP?.marked ?? dhMaxHP;
	const hasHP = typeof maxHP === "number" && maxHP > 0;

	return (
		<article className={`frame hoverable ${styles.card}`} onMouseEnter={preload} onFocus={preload}>
			<span className="frame-corner tl" />
			<span className="frame-corner tr" />
			<span className="frame-corner bl" />
			<span className="frame-corner br" />

			<div className={styles.portrait} data-clickable={onEnter ? "" : undefined} onClick={() => onEnter?.(character)}>
				{tag && <span className={`caps ${styles.tag}`}>{tag}</span>}
				<Avatar characterClass={profile?.class ?? ""} gameMode={character.gamemode} />
				<span className={`chip ${isDnd ? "chip-gold" : "chip-arcane"} ${styles.sysChip}`}>
					{isDnd ? "D&D" : "Daggerheart"}
				</span>
			</div>

			<div className={styles.cardBody}>
				<div className={styles.cardHead}>
					<span className="display" style={{ fontSize: "1.5rem", lineHeight: 1.05 }}>
						{name}
					</span>
					{level != null && (
						<span className="mono" style={{ color: "var(--gold-2)", fontSize: "0.85rem" }}>
							LV <span style={{ fontSize: "1.15rem" }}>{level}</span>
						</span>
					)}
				</div>
				<div className={styles.meta}>
					{lineage && <div>{lineage}</div>}
					{job && <div className={styles.metaSub}>{job}</div>}
				</div>

				{hasHP && (
					<div className={styles.hpBlock}>
						<div className={styles.hpRow}>
							<span className="caps">Hit Points</span>
							<span className="mono" style={{ color: "var(--text)" }}>
								{currentHP ?? maxHP} / {maxHP}
							</span>
						</div>
						<HPBar cur={currentHP ?? maxHP} max={maxHP} temp={0} />
					</div>
				)}

				{(onEnter || onDelete) && (
					<div className={styles.actions}>
						{onEnter && (
							<button className="button stretch" onClick={() => onEnter(character)}>
								{actionIcon && <Icon name={actionIcon} size={14} />}
								{actionLabel}
							</button>
						)}
						{onDelete && (
							<button className={`button button-secondary ${styles.delete}`} onClick={() => onDelete(character)}>
								<Icon name="trash" size={14} />
							</button>
						)}
					</div>
				)}
				{footer}
			</div>
		</article>
	);
};
