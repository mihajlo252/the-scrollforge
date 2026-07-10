import { useEffect, useRef, useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
import { Popup } from "../../../components/Popup/Popup";
import { Icon } from "../../../components/Primitives";
import { AdvancementPicker } from "../AdvancementPicker";
import { DomainCardView } from "./DomainCard";
import {
	advancementContext,
	choiceIsValid,
	commitLevelUp,
	picksCost,
	type AdvancementChoice,
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
	targetLevel,
}: {
	character: DaggerheartCharacter;
	state: any;
	toggle: boolean;
	onClose: () => void;
	/** When set (e.g. the level was typed in directly), walk every level from
	 *  the character's current level up to this one, one advancement step at a
	 *  time. Omitted → a single level-up. */
	targetLevel?: number;
}) => {
	// A working copy that accumulates each step's changes so a multi-level jump
	// can be resolved without reloading between levels.
	const [workingChar, setWorkingChar] = useState<DaggerheartCharacter>(character);
	const [selected, setSelected] = useState<Record<string, AdvancementChoice>>({});
	// The domain card every level-up grants, on top of the two advancement points.
	const [newCard, setNewCard] = useState<DomainCard | null>(null);
	const [saving, setSaving] = useState(false);
	const advancedRef = useRef(false);

	// Re-sync to the freshly-read character each time the modal opens.
	useEffect(() => {
		if (toggle) {
			setWorkingChar(character);
			setSelected({});
			setNewCard(null);
			setSaving(false);
			advancedRef.current = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggle]);

	const startLevel = character.characterProfile.level || 1;
	const level = workingChar.characterProfile.level || 1;
	const ctx = advancementContext(workingChar, CATALOG);
	const newLevel = ctx.newLevel;
	const target = Math.min(10, Math.max(newLevel, targetLevel ?? newLevel));
	const stepsTotal = Math.max(1, target - startLevel);
	const stepIndex = level - startLevel + 1;
	const atMax = level >= 10;

	// Keep the granted card and the "Extra Domain Card" advancement mutually
	// exclusive so the same card can't be taken twice in one level.
	const advCardName = selected["domain"]?.card?.name.toLowerCase();
	const cardChoices = ctx.browseable.filter((c) => c.name.toLowerCase() !== advCardName);
	const pickerCtx = { ...ctx, browseable: ctx.browseable.filter((c) => c.name.toLowerCase() !== newCard?.name.toLowerCase()) };

	const totalCost = picksCost(ctx.options, Object.values(selected));
	// The new domain card is required — unless no eligible card remains.
	const cardOk = !!newCard || cardChoices.length === 0;
	const canApply = totalCost === 2 && Object.values(selected).every((c) => choiceIsValid(c, ctx.experiences.length)) && cardOk && !atMax;

	const apply = async () => {
		if (!canApply) return;
		setSaving(true);
		const { patch } = commitLevelUp(workingChar, Object.values(selected), newCard);
		patchCharacter(state, patch);
		await sendData("characters", character.id, patch as Record<string, any>);
		advancedRef.current = true;

		if (newLevel >= target) {
			toast({ style: "frame button-primary", message: `Advanced to Level ${newLevel}!` });
			onClose();
			// Re-read fresh state across all tabs.
			window.location.reload();
		} else {
			// More levels to resolve — carry the accumulated state to the next step.
			toast({ style: "frame button-primary", message: `Level ${newLevel} set — now choose your Level ${newLevel + 1} advancements.` });
			setWorkingChar({ ...workingChar, ...patch });
			setSelected({});
			setNewCard(null);
			setSaving(false);
		}
	};

	// If the user closes mid-way through a multi-level jump, the already-applied
	// levels are persisted — reload so every tab reflects them.
	const handleClose = () => {
		if (advancedRef.current) {
			window.location.reload();
			return;
		}
		onClose();
	};

	return (
		<Popup closerFunc={handleClose} toggle={toggle}>
			<Frame classes={`column-direction ${styles.levelUpFrame}`}>
				<h3 className="card-title">
					Level Up · LV {newLevel} · Tier {ctx.tier}
					{stepsTotal > 1 ? ` · step ${stepIndex} of ${stepsTotal}` : ""}
				</h3>

				{atMax && <div className={styles.empty}>You've reached the maximum level (10).</div>}

				{ctx.enteredTier && !atMax && (
					<div className={styles.tierBanner}>
						<Icon name="crown" size={16} />
						Entering Tier {ctx.tier}: +1 Proficiency, a new Experience (+2), and your marked traits clear.
					</div>
				)}

				{!atMax && (
					<>
						<span className={styles.sectionTitle}>New domain card (every level grants one)</span>
						{cardChoices.length === 0 && !newCard ? (
							<div className={styles.empty}>You already own every eligible card.</div>
						) : (
							<select
								className="select"
								value={newCard?.name ?? ""}
								onChange={(e) => setNewCard(cardChoices.find((c) => c.name === e.target.value) ?? null)}
							>
								<option value="">— select —</option>
								{cardChoices.map((c) => (
									<option key={c.name} value={c.name}>{c.name} ({c.domain} Lv {c.level})</option>
								))}
							</select>
						)}
						{newCard && <DomainCardView card={newCard} />}

						<span className={styles.sectionTitle}>Choose advancements worth 2 points ({totalCost}/2)</span>
						<AdvancementPicker ctx={pickerCtx} selected={selected} onChange={setSelected} baseClass={character.characterProfile.class} />
					</>
				)}

				<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
					{!atMax && (
						<button type="button" className="button button-accent stretch" disabled={!canApply || saving} onClick={apply}>
							<Icon name="crown" size={14} /> {saving ? "Advancing…" : `Advance to LV ${newLevel}`}
						</button>
					)}
					<button type="button" className="button button-secondary stretch" onClick={handleClose}>Close</button>
				</div>
			</Frame>
		</Popup>
	);
};
