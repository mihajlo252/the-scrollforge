import { useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { Popup } from "../../../components/Popup/Popup";
import { Icon } from "../../../components/Primitives";
import {
	allClasses,
	getDomains,
	tierForLevel,
	TRAIT_NAMES,
} from "../../../utilities/daggerheart";
import { Capitalize } from "../../../utilities/capitalize";
import {
	commitLevelUp,
	tierOptions,
	tierUsage,
	type AdvancementChoice,
	type AdvancementOption,
} from "../../../utilities/daggerheartLevelUp";
import { patchCharacter } from "../../../utilities/patchCharacter";
import { sendData } from "../../../utilities/sendData";
import { toast } from "../../../utilities/toasterSonner";
import domainCardsData from "../../../daggerheart-config/domain-cards.json";
import styles from "../../../routes/daggerheart/sheetScreens.module.css";

const CATALOG = domainCardsData as DomainCard[];

export const LevelUpModal = ({
	character,
	state,
	toggle,
	onClose,
}: {
	character: DaggerheartCharacter;
	state: any;
	toggle: boolean;
	onClose: () => void;
}) => {
	const level = character.characterProfile.level || 1;
	const newLevel = level + 1;
	const tier = tierForLevel(newLevel);
	const enteredTier = tier > tierForLevel(level);
	const atMax = level >= 10;

	const options = tierOptions(tier);
	const usage = tierUsage(character.dhAdvancements, tier);
	const marked = enteredTier ? [] : character.dhAdvancements?.markedTraits ?? [];
	const availableTraits = TRAIT_NAMES.filter((t) => !marked.includes(t));
	const experiences = character.dhExperiences ?? [];
	const classDomains = getDomains(character.characterProfile.class);
	const ownedCardNames = new Set([...(character.dhDomainCards?.loadout ?? []), ...(character.dhDomainCards?.vault ?? [])].map((c) => c.name.toLowerCase()));
	const browseable = CATALOG.filter(
		(c) => c.level <= newLevel && classDomains.some((d) => d.toUpperCase() === c.domain.toUpperCase()) && !ownedCardNames.has(c.name.toLowerCase()),
	);

	const [selected, setSelected] = useState<Record<string, AdvancementChoice>>({});
	const [saving, setSaving] = useState(false);

	const totalCost = Object.values(selected).reduce((sum, c) => {
		const opt = options.find((o) => o.id === c.id);
		return sum + (opt?.cost ?? 1);
	}, 0);

	const slotsLeft = (opt: AdvancementOption) => opt.slots - (usage[opt.id] ?? 0);

	const isValidChoice = (c: AdvancementChoice): boolean => {
		switch (c.id) {
			case "trait":
				return (c.traits?.length ?? 0) === 2;
			case "experience":
				return (c.experiences?.length ?? 0) === Math.min(2, experiences.length) && experiences.length > 0;
			case "domain":
				return !!c.card;
			case "multiclass":
				return !!c.multiclass?.class && !!c.multiclass?.domain;
			default:
				return true;
		}
	};

	const canApply = totalCost === 2 && Object.values(selected).every(isValidChoice) && !atMax;

	const toggleOption = (opt: AdvancementOption) => {
		setSelected((prev) => {
			const next = { ...prev };
			if (next[opt.id]) {
				delete next[opt.id];
				return next;
			}
			// adding: respect cost budget of 2
			const projected = totalCost + opt.cost;
			if (projected > 2) {
				toast({ style: "frame button-primary", message: "You may choose advancements worth 2 points total." });
				return prev;
			}
			next[opt.id] = { id: opt.id };
			return next;
		});
	};

	const updateChoice = (id: string, patch: Partial<AdvancementChoice>) =>
		setSelected((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

	const toggleTrait = (id: string, t: DHTraitName) =>
		setSelected((prev) => {
			const cur = prev[id]?.traits ?? [];
			const has = cur.includes(t);
			const nextTraits = has ? cur.filter((x) => x !== t) : cur.length < 2 ? [...cur, t] : cur;
			return { ...prev, [id]: { ...prev[id], traits: nextTraits } };
		});

	const toggleExp = (id: string, i: number) =>
		setSelected((prev) => {
			const cur = prev[id]?.experiences ?? [];
			const has = cur.includes(i);
			const cap = Math.min(2, experiences.length);
			const nextExp = has ? cur.filter((x) => x !== i) : cur.length < cap ? [...cur, i] : cur;
			return { ...prev, [id]: { ...prev[id], experiences: nextExp } };
		});

	const apply = async () => {
		if (!canApply) return;
		setSaving(true);
		const { patch } = commitLevelUp(character, Object.values(selected));
		patchCharacter(state, patch);
		await sendData("characters", character.id, patch as Record<string, any>);
		toast({ style: "frame button-primary", message: `Advanced to Level ${newLevel}!` });
		setSaving(false);
		onClose();
		// Re-read fresh state across all tabs.
		window.location.reload();
	};

	return (
		<Popup closerFunc={onClose} toggle={toggle}>
			<Frame classes="column-direction">
				<h3 className="card-title">Level Up · LV {newLevel} · Tier {tier}</h3>

				{atMax && <div className={styles.empty}>You've reached the maximum level (10).</div>}

				{enteredTier && !atMax && (
					<div className={styles.tierBanner}>
						<Icon name="crown" size={16} />
						Entering Tier {tier}: +1 Proficiency, a new Experience (+2), and your marked traits clear.
					</div>
				)}

				{!atMax && (
					<>
						<span className={styles.sectionTitle}>Choose advancements worth 2 points ({totalCost}/2)</span>
						<div className={styles.advGrid}>
							{options.map((opt) => {
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
													{availableTraits.map((t) => (
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
													{experiences.length === 0 && <span className={styles.empty}>No Experiences yet.</span>}
													{experiences.map((x, i) => (
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
													onChange={(e) => updateChoice(opt.id, { card: browseable.find((c) => c.name === e.target.value) ?? null })}
												>
													<option value="">— select —</option>
													{browseable.map((c) => (
														<option key={c.name} value={c.name}>{c.name} ({c.domain} Lv {c.level})</option>
													))}
												</select>
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
													{allClasses().filter((c) => !eqClass(c.name, character.characterProfile.class)).map((c) => (
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
					</>
				)}

				<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
					{!atMax && (
						<button type="button" className="button button-accent stretch" disabled={!canApply || saving} onClick={apply}>
							<Icon name="crown" size={14} /> {saving ? "Advancing…" : `Advance to LV ${newLevel}`}
						</button>
					)}
					<button type="button" className="button button-secondary stretch" onClick={onClose}>Close</button>
				</div>
			</Frame>
		</Popup>
	);
};

const eqClass = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
