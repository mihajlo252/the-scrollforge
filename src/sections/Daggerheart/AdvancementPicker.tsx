import { Icon } from "../../components/Primitives";
import { DomainCardView } from "./CharacterProfile/DomainCard";
import { allClasses, getDomains } from "../../utilities/daggerheart";
import { Capitalize } from "../../utilities/capitalize";
import {
	picksCost,
	type AdvancementChoice,
	type AdvancementContext,
	type AdvancementOption,
} from "../../utilities/daggerheartLevelUp";
import { toast } from "../../utilities/toasterSonner";
import styles from "../../routes/daggerheart/sheetScreens.module.css";

/** The 2-point advancement chooser for one level — shared between the
 *  LevelUpModal and the higher-level character-creation wizard. */
export const AdvancementPicker = ({
	ctx,
	selected,
	onChange,
	baseClass,
}: {
	ctx: AdvancementContext;
	selected: Record<string, AdvancementChoice>;
	onChange: (next: Record<string, AdvancementChoice>) => void;
	/** The hero's own class — excluded from the multiclass options. */
	baseClass: string;
}) => {
	const totalCost = picksCost(ctx.options, Object.values(selected));

	const slotsLeft = (opt: AdvancementOption) => opt.slots - (ctx.usage[opt.id] ?? 0);

	const toggleOption = (opt: AdvancementOption) => {
		const next = { ...selected };
		if (next[opt.id]) {
			delete next[opt.id];
			onChange(next);
			return;
		}
		// adding: respect cost budget of 2
		if (totalCost + opt.cost > 2) {
			toast({ style: "frame button-primary", message: "You may choose advancements worth 2 points total." });
			return;
		}
		next[opt.id] = { id: opt.id };
		onChange(next);
	};

	const updateChoice = (id: string, patch: Partial<AdvancementChoice>) =>
		onChange({ ...selected, [id]: { ...selected[id], ...patch } });

	const toggleTrait = (id: string, t: DHTraitName) => {
		const cur = selected[id]?.traits ?? [];
		const has = cur.includes(t);
		const nextTraits = has ? cur.filter((x) => x !== t) : cur.length < 2 ? [...cur, t] : cur;
		updateChoice(id, { traits: nextTraits });
	};

	const toggleExp = (id: string, i: number) => {
		const cur = selected[id]?.experiences ?? [];
		const has = cur.includes(i);
		const cap = Math.min(2, ctx.experiences.length);
		const nextExp = has ? cur.filter((x) => x !== i) : cur.length < cap ? [...cur, i] : cur;
		updateChoice(id, { experiences: nextExp });
	};

	return (
		<div className={styles.advGrid}>
			{ctx.options.map((opt) => {
				const active = !!selected[opt.id];
				const left = slotsLeft(opt);
				const disabled = !active && (left <= 0 || totalCost + opt.cost > 2);
				const choice = selected[opt.id];
				return (
					<div
						key={opt.id}
						className={styles.advCard}
						data-active={active ? "true" : undefined}
						data-disabled={disabled ? "true" : undefined}
						onClick={() => !disabled && toggleOption(opt)}
					>
						<div className={styles.advHead}>
							<Icon name={opt.icon ?? "star"} size={16} />
							<span className={styles.advTitle}>{opt.label}</span>
							<span className={styles.advMeta}>
								{opt.cost === 2 && <span className="chip chip-ember">2 pts</span>}
								<span className="chip">{left} left</span>
							</span>
						</div>
						<div className={styles.advDesc}>{opt.description}</div>

						{active && opt.id === "trait" && (
							<div className={styles.advSub} onClick={(e) => e.stopPropagation()}>
								<span className="caps" style={{ fontSize: 10 }}>Pick two traits to raise (+1)</span>
								<div className={styles.advSubPills}>
									{ctx.availableTraits.map((t) => (
										<button key={t} type="button" className="pill" data-active={choice?.traits?.includes(t) ? "true" : undefined} onClick={() => toggleTrait(opt.id, t)}>
											{t}
										</button>
									))}
								</div>
							</div>
						)}

						{active && opt.id === "experience" && (
							<div className={styles.advSub} onClick={(e) => e.stopPropagation()}>
								<span className="caps" style={{ fontSize: 10 }}>Pick two Experiences to raise (+1)</span>
								<div className={styles.advSubPills}>
									{ctx.experiences.length === 0 && <span className={styles.empty}>No Experiences yet.</span>}
									{ctx.experiences.map((x, i) => (
										<button key={i} type="button" className="pill" data-active={choice?.experiences?.includes(i) ? "true" : undefined} onClick={() => toggleExp(opt.id, i)}>
											{x.name || `Experience ${i + 1}`}
										</button>
									))}
								</div>
							</div>
						)}

						{active && opt.id === "domain" && (
							<div className={styles.advSub} onClick={(e) => e.stopPropagation()}>
								<span className="caps" style={{ fontSize: 10 }}>Choose a domain card</span>
								<select
									className="select"
									value={choice?.card?.name ?? ""}
									onChange={(e) => updateChoice(opt.id, { card: ctx.browseable.find((c) => c.name === e.target.value) ?? null })}
								>
									<option value="">— select —</option>
									{ctx.browseable.map((c) => (
										<option key={c.name} value={c.name}>{c.name} ({c.domain} Lv {c.level})</option>
									))}
								</select>
								{/* Full card preview so the pick can be read before committing. */}
								{choice?.card && <DomainCardView card={choice.card} />}
							</div>
						)}

						{active && opt.id === "multiclass" && (
							<div className={styles.advSub} onClick={(e) => e.stopPropagation()}>
								<span className="caps" style={{ fontSize: 10 }}>Choose a class and one of its domains</span>
								<select
									className="select"
									value={choice?.multiclass?.class ?? ""}
									onChange={(e) => updateChoice(opt.id, { multiclass: { class: e.target.value, domain: "" } })}
								>
									<option value="">— class —</option>
									{allClasses().filter((c) => !eqClass(c.name, baseClass)).map((c) => (
										<option key={c.id} value={Capitalize(c.name)}>{Capitalize(c.name)}</option>
									))}
								</select>
								{choice?.multiclass?.class && (
									<select
										className="select"
										value={choice?.multiclass?.domain ?? ""}
										onChange={(e) => updateChoice(opt.id, { multiclass: { class: choice.multiclass!.class, domain: e.target.value } })}
									>
										<option value="">— domain —</option>
										{getDomains(choice.multiclass.class).map((d) => (
											<option key={d} value={d}>{Capitalize(d)}</option>
										))}
									</select>
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

const eqClass = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
