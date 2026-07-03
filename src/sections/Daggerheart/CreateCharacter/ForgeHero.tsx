import { useState, type ReactNode } from "react";
import { Icon } from "../../../components/Primitives";
import { DomainCardView } from "../CharacterProfile/DomainCard";
import {
	allAncestries,
	allClasses,
	allCommunities,
	allArmors,
	primaryWeapons,
	secondaryWeapons,
	subclassesForClass,
	getClass,
	getSubclass,
	getAncestry,
	getCommunity,
	getDomains,
	getSpellcastTrait,
	weaponById,
	armorById,
	weaponToDH,
	armorToDH,
	formatWeaponDamage,
	titleWords,
	tierForLevel,
	flattenDescription,
	groupCardsByLevel,
	TRAIT_NAMES,
	type Feature,
} from "../../../utilities/daggerheart";
import { Capitalize } from "../../../utilities/capitalize";
import { getUserFromLocal } from "../../../utilities/getUserFromLocal";
import { submitDaggerheartCharacter, type ForgeDraft } from "../../../utilities/submitDaggerheartCharacter";
import { toast } from "../../../utilities/toasterSonner";
import domainCardsData from "../../../daggerheart-config/domain-cards.json";
import styles from "./ForgeHero.module.css";

const CATALOG = domainCardsData as DomainCard[];
const TRAIT_OPTIONS = [2, 1, 0, -1];

const STEPS = [
	{ id: "class", label: "Class & Subclass" },
	{ id: "heritage", label: "Heritage" },
	{ id: "traits", label: "Traits" },
	{ id: "equipment", label: "Equipment" },
	{ id: "background", label: "Background" },
	{ id: "experiences", label: "Experiences" },
	{ id: "domains", label: "Domain Cards" },
	{ id: "connections", label: "Connections" },
] as const;

const BACKGROUND_PROMPTS = [
	"What pivotal moment set you on your path?",
	"Who from your past still shapes who you are?",
	"What do you most hope to find — or to avoid?",
];
const CONNECTION_PROMPTS = [
	"Who in the party do you trust most, and why?",
	"Who do you owe something to?",
];

const firstSubclass = (className: string) => subclassesForClass(className)[0]?.name ?? "";
const byTierName = (a: { tier: number; name: string }, b: { tier: number; name: string }) => a.tier - b.tier || a.name.localeCompare(b.name);

/** Label stacked above a single form control. */
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
	<label className={styles.field}>
		<span className={styles.fieldLabel}>{label}</span>
		{children}
	</label>
);

/** A named feature line for the details side-panel. */
const FeatureLine = ({ f }: { f: Feature }) => (
	<div className={styles.detailFeat}>
		<span className={styles.detailFeatName}>{f.name}</span>
		<span className={styles.detailFeatText}>{flattenDescription(f.description)}</span>
	</div>
);

const WeaponPreview = ({ w }: { w: DHWeapon | null | undefined }) =>
	w && w.name ? (
		<div className={styles.gearPreview}>
			<div className={styles.gearPreviewHead}>
				<span className={styles.gearPreviewName}>{w.name}</span>
				<span className="mono" style={{ color: "var(--gold-2)" }}>{w.damage}</span>
			</div>
			<div className={styles.gearPreviewMeta}>
				<span className="chip">{w.trait}</span>
				<span className="chip">{w.range}</span>
				<span className="chip">{w.dtype === "mag" ? "Magic" : "Physical"}</span>
				<span className="chip">{w.burden}</span>
			</div>
			{w.feature && <div className={styles.gearPreviewFeat}>{w.feature}</div>}
		</div>
	) : null;

const ArmorPreview = ({ a }: { a: DHArmor | null | undefined }) =>
	a && a.name ? (
		<div className={styles.gearPreview}>
			<div className={styles.gearPreviewHead}>
				<span className={styles.gearPreviewName}>{a.name}</span>
				<span className="mono" style={{ color: "var(--gold-2)" }}>Score {a.score}</span>
			</div>
			<div className={styles.gearPreviewMeta}>
				<span className="chip">Major {a.thresholds.major}</span>
				<span className="chip">Severe {a.thresholds.severe}</span>
			</div>
			{a.feature && <div className={styles.gearPreviewFeat}>{a.feature}</div>}
		</div>
	) : null;

export const ForgeHero = ({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) => {
	const [step, setStep] = useState(0);
	const [saving, setSaving] = useState(false);
	const [draft, setDraft] = useState<ForgeDraft>(() => ({
		name: "",
		level: 1,
		class: "Bard",
		subclass: "Troubadour",
		ancestry: "Clank",
		community: "Highborne",
		traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
		weapons: { primary: weaponToDH(primaryWeapons()[0]), secondary: null },
		armor: armorToDH(allArmors()[0]),
		background: BACKGROUND_PROMPTS.map((q) => ({ q, a: "" })),
		experiences: [
			{ name: "", bonus: 2 },
			{ name: "", bonus: 2 },
		],
		domainCards: [],
		connections: CONNECTION_PROMPTS.map((q) => ({ q, a: "" })),
	}));

	// Selected catalog ids for the gear pickers (kept alongside the mapped draft).
	const [gear, setGear] = useState(() => ({
		primaryId: primaryWeapons()[0]?.id ?? "",
		secondaryId: "",
		armorId: allArmors()[0]?.id ?? "",
	}));

	const set = (patch: Partial<ForgeDraft>) => setDraft((d) => ({ ...d, ...patch }));

	const classDomains = getDomains(draft.class);
	const spellTrait = getSpellcastTrait(draft.subclass);
	const cls = getClass(draft.class);
	const subclassCfg = getSubclass(draft.subclass);
	const ancestryCfg = getAncestry(draft.ancestry);
	const communityCfg = getCommunity(draft.community);
	const gearTier = tierForLevel(draft.level);

	const chooseClass = (name: string) => set({ class: name, subclass: firstSubclass(name), domainCards: [] });

	// Trait assignment as a fixed pool: choosing a value swaps it away from the
	// trait that currently holds it, so the +2/+1/+1/0/0/−1 spread always holds.
	const assignTrait = (t: DHTraitName, v: number) => {
		const cur = draft.traits[t];
		if (v === cur) return;
		const next = { ...draft.traits };
		const other = TRAIT_NAMES.find((u) => u !== t && next[u] === v);
		if (other) next[other] = cur;
		next[t] = v;
		set({ traits: next });
	};

	const pickPrimary = (id: string) => {
		setGear((g) => ({ ...g, primaryId: id }));
		const w = weaponById(id);
		set({ weapons: { ...draft.weapons, primary: w ? weaponToDH(w) : null } });
	};
	const pickSecondary = (id: string) => {
		setGear((g) => ({ ...g, secondaryId: id }));
		const w = weaponById(id);
		set({ weapons: { ...draft.weapons, secondary: w ? weaponToDH(w) : null } });
	};
	const pickArmor = (id: string) => {
		setGear((g) => ({ ...g, armorId: id }));
		const a = armorById(id);
		set({ armor: a ? armorToDH(a) : null });
	};

	// Heroes begin with two cards at level 1; higher-level heroes may take one
	// more per level (extras beyond a 5-card loadout spill to the vault on save).
	const maxCards = draft.level + 1;

	const toggleCard = (card: DomainCard) => {
		const has = draft.domainCards.some((c) => c.name === card.name);
		if (has) set({ domainCards: draft.domainCards.filter((c) => c.name !== card.name) });
		else if (draft.domainCards.length < maxCards) set({ domainCards: [...draft.domainCards, card] });
		else toast({ style: "frame button-primary", message: `Choose up to ${maxCards} domain cards.` });
	};

	const finish = async () => {
		if (!draft.name.trim()) {
			toast({ style: "frame button-primary", message: "Give your hero a name first." });
			setStep(0);
			return;
		}
		setSaving(true);
		try {
			const { user } = JSON.parse(getUserFromLocal());
			await submitDaggerheartCharacter(draft, user.id);
			toast({ style: "frame button-primary", message: `${draft.name} has been forged!` });
			onCreated();
		} catch {
			// toast already shown by submit
		} finally {
			setSaving(false);
		}
	};

	const current = STEPS[step].id;

	return (
		<div className={styles.wrap}>
			<nav className={styles.rail}>
				{STEPS.map((s, i) => (
					<button key={s.id} type="button" className={styles.step} data-active={i === step} data-done={i < step} onClick={() => setStep(i)}>
						<span className={styles.stepIndex}>{i < step ? "✓" : i + 1}</span>
						<span className={styles.stepLabel}>{s.label}</span>
					</button>
				))}
			</nav>

			<div className={styles.panel}>
				{/* CLASS & SUBCLASS */}
				{current === "class" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Class & Subclass</div>
							<div className={styles.panelHint}>Your class sets your domains, starting Evasion, and Hit Points.</div>
						</div>
						<div className={styles.body}>
							<div className={styles.formGrid2}>
								<Field label="Hero Name"><input className="input" placeholder="e.g. Kael the Bold" value={draft.name} onChange={(e) => set({ name: e.target.value })} /></Field>
								<Field label="Level">
									<select className="select" value={draft.level} onChange={(e) => set({ level: parseInt(e.target.value) })}>
										{Array.from({ length: 10 }, (_, i) => i + 1).map((l) => <option key={l} value={l}>{l}</option>)}
									</select>
								</Field>
							</div>
							<div className={styles.pickLayout}>
								<div className={styles.picks}>
									<div className={styles.fieldLabel}>Class</div>
									<div className={styles.pickGrid}>
										{allClasses().map((c) => {
											const name = Capitalize(c.name);
											return (
												<button key={c.id} type="button" className={styles.pick} data-active={draft.class === name} onClick={() => chooseClass(name)}>
													<span className={styles.pickName}>{name}</span>
													<span className={styles.pickMeta}>
														{c.domains.map((d) => <span key={d} className="chip">{Capitalize(d)}</span>)}
													</span>
													<span className={styles.pickMeta}>EV {c.startingEvasion} · HP {c.startingHitPoints}</span>
												</button>
											);
										})}
									</div>
									<div className={styles.fieldLabel}>Subclass</div>
									<div className={styles.pickGrid}>
										{subclassesForClass(draft.class).map((s) => (
											<button key={s.id} type="button" className={styles.pick} data-active={draft.subclass === s.name} onClick={() => set({ subclass: s.name })}>
												<span className={styles.pickName}>{s.name}</span>
												<span className={styles.pickMeta}>{s.spellcastTrait ? `Spellcast: ${s.spellcastTrait}` : "Martial"}</span>
											</button>
										))}
									</div>
								</div>

								<aside className={styles.details}>
									{cls && (
										<>
											<div className={styles.detailTitle}>{cls.name}</div>
											<div className={styles.detailMeta}>{cls.domains.map((d) => Capitalize(d)).join(" & ")} · Evasion {cls.startingEvasion} · HP {cls.startingHitPoints}</div>
											<p className={styles.detailText}>{flattenDescription(cls.description)}</p>
											<div className={styles.detailSection}>Class Features</div>
											{cls.classFeatures.map((f) => <FeatureLine key={f.name} f={f} />)}
											<div className={styles.detailSection}>Hope Feature</div>
											<FeatureLine f={cls.hopeFeature} />
											{subclassCfg && (
												<>
													<div className={styles.detailSection}>{subclassCfg.name} · {subclassCfg.spellcastTrait ? `Spellcast ${subclassCfg.spellcastTrait}` : "Martial"}</div>
													{subclassCfg.foundation.features.map((f) => <FeatureLine key={`f-${f.name}`} f={f} />)}
												</>
											)}
										</>
									)}
								</aside>
							</div>
						</div>
					</>
				)}

				{/* HERITAGE */}
				{current === "heritage" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Heritage</div>
							<div className={styles.panelHint}>Your ancestry and community shape who you are and grant features.</div>
						</div>
						<div className={styles.body}>
							<div className={styles.pickLayout}>
								<div className={styles.picks}>
									<div className={styles.fieldLabel}>Ancestry</div>
									<div className={styles.pickGrid}>
										{allAncestries().map((a) => (
											<button key={a.id} type="button" className={styles.pick} data-active={draft.ancestry === a.name} onClick={() => set({ ancestry: a.name })}>
												<span className={styles.pickName}>{a.name}</span>
												<span className={styles.pickMeta}>{a.features.map((f) => f.name).join(" · ")}</span>
											</button>
										))}
									</div>
									<div className={styles.fieldLabel}>Community</div>
									<div className={styles.pickGrid}>
										{allCommunities().map((c) => (
											<button key={c.id} type="button" className={styles.pick} data-active={draft.community === c.name} onClick={() => set({ community: c.name })}>
												<span className={styles.pickName}>{c.name}</span>
												<span className={styles.pickMeta}>{c.features.map((f) => f.name).join(" · ")}</span>
											</button>
										))}
									</div>
								</div>

								<aside className={styles.details}>
									{ancestryCfg && (
										<>
											<div className={styles.detailTitle}>{ancestryCfg.name}</div>
											<p className={styles.detailText}>{flattenDescription(ancestryCfg.description)}</p>
											{ancestryCfg.features.map((f) => <FeatureLine key={`a-${f.name}`} f={f} />)}
										</>
									)}
									{communityCfg && (
										<>
											<div className={styles.detailSection}>{communityCfg.name}</div>
											<p className={styles.detailText}>{flattenDescription(communityCfg.description)}</p>
											{communityCfg.features.map((f) => <FeatureLine key={`c-${f.name}`} f={f} />)}
										</>
									)}
								</aside>
							</div>
						</div>
					</>
				)}

				{/* TRAITS */}
				{current === "traits" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Traits</div>
							<div className={styles.panelHint}>Assign the standard array: +2, +1, +1, 0, 0, −1. {spellTrait ? `Your Spellcast trait is ${spellTrait}.` : ""}</div>
						</div>
						<div className={styles.body}>
							<div className={styles.traitAssign}>
								{TRAIT_NAMES.map((t) => (
									<div key={t} className={styles.traitAssignRow} data-spellcast={!!spellTrait && spellTrait.toUpperCase() === t.toUpperCase()}>
										<span className={styles.traitAssignName}>{t}</span>
										<select className="select" value={draft.traits[t]} onChange={(e) => assignTrait(t, parseInt(e.target.value))}>
											{TRAIT_OPTIONS.map((v) => <option key={v} value={v}>{v >= 0 ? `+${v}` : v}</option>)}
										</select>
									</div>
								))}
							</div>
							<span className={styles.poolNote}>
								Each value comes from the fixed array — choosing one automatically swaps it with whichever trait held it, so you always have one +2, two +1, two 0, and one −1.
							</span>
						</div>
					</>
				)}

				{/* EQUIPMENT */}
				{current === "equipment" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Equipment</div>
							<div className={styles.panelHint}>Choose from the weapon and armor catalog (tier {gearTier} or lower). You can refine these later on the sheet.</div>
						</div>
						<div className={styles.body}>
							<Field label="Primary Weapon">
								<select className="select" value={gear.primaryId} onChange={(e) => pickPrimary(e.target.value)}>
									<option value="">— None —</option>
									{primaryWeapons().filter((w) => w.tier <= gearTier).sort(byTierName).map((w) => (
										<option key={w.id} value={w.id}>{w.name} · T{w.tier} · {formatWeaponDamage(w)} {titleWords(w.trait)}</option>
									))}
								</select>
							</Field>
							<WeaponPreview w={draft.weapons.primary} />

							<Field label="Secondary Weapon (optional)">
								<select className="select" value={gear.secondaryId} onChange={(e) => pickSecondary(e.target.value)}>
									<option value="">— None —</option>
									{secondaryWeapons().filter((w) => w.tier <= gearTier).sort(byTierName).map((w) => (
										<option key={w.id} value={w.id}>{w.name} · T{w.tier} · {formatWeaponDamage(w)} {titleWords(w.trait)}</option>
									))}
								</select>
							</Field>
							<WeaponPreview w={draft.weapons.secondary} />

							<Field label="Active Armor">
								<select className="select" value={gear.armorId} onChange={(e) => pickArmor(e.target.value)}>
									<option value="">— None —</option>
									{allArmors().filter((a) => a.tier <= gearTier).sort(byTierName).map((a) => (
										<option key={a.id} value={a.id}>{a.name} · T{a.tier} · Score {a.baseScore} · {a.baseMajorThreshold}/{a.baseSevereThreshold}</option>
									))}
								</select>
							</Field>
							<ArmorPreview a={draft.armor} />
						</div>
					</>
				)}

				{/* BACKGROUND */}
				{current === "background" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Background</div>
							<div className={styles.panelHint}>Answer as much or as little as you like — these can change at the table.</div>
						</div>
						<div className={styles.body}>
							{draft.background.map((entry, i) => (
								<div key={i}>
									<div className={styles.fieldLabel}>{entry.q}</div>
									<textarea className="textarea" rows={2} value={entry.a} onChange={(e) => set({ background: draft.background.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)) })} />
								</div>
							))}
						</div>
					</>
				)}

				{/* EXPERIENCES */}
				{current === "experiences" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Experiences</div>
							<div className={styles.panelHint}>Most heroes begin with two Experiences at +2.</div>
						</div>
						<div className={styles.body}>
							{draft.experiences.map((x, i) => (
								<div key={i} className={styles.formGrid2}>
									<Field label={`Experience ${i + 1}`}>
										<input className="input" placeholder="e.g. Silver Tongue" value={x.name} onChange={(e) => set({ experiences: draft.experiences.map((y, idx) => (idx === i ? { ...y, name: e.target.value } : y)) })} />
									</Field>
									<Field label="Bonus">
										<input className="input" type="number" value={x.bonus} onChange={(e) => set({ experiences: draft.experiences.map((y, idx) => (idx === i ? { ...y, bonus: parseInt(e.target.value) || 0 } : y)) })} />
									</Field>
								</div>
							))}
						</div>
					</>
				)}

				{/* DOMAIN CARDS */}
				{current === "domains" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Domain Cards</div>
							<div className={styles.panelHint}>Choose up to {maxCards} cards (level {draft.level} or lower) from your {cls?.name} domains ({classDomains.map(Capitalize).join(" & ")}). Selected {draft.domainCards.length}/{maxCards}.</div>
						</div>
						<div className={styles.body}>
							{groupCardsByLevel(CATALOG.filter((c) => c.level <= draft.level && classDomains.some((d) => d.toUpperCase() === c.domain.toUpperCase()))).map(([lvl, cards]) => (
								<div key={lvl} className={styles.cardLevelGroup}>
									<div className={styles.fieldLabel}>Level {lvl}</div>
									{cards.map((card) => {
										const active = draft.domainCards.some((c) => c.name === card.name);
										return (
											<DomainCardView key={card.name} card={card}>
												<button type="button" className={`button ${active ? "button-secondary" : "button-primary"} short`} onClick={() => toggleCard(card)}>
													<Icon name={active ? "check" : "plus"} size={12} /> {active ? "Selected" : "Select"}
												</button>
											</DomainCardView>
										);
									})}
								</div>
							))}
						</div>
					</>
				)}

				{/* CONNECTIONS */}
				{current === "connections" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Connections</div>
							<div className={styles.panelHint}>How are you tied to the rest of the party?</div>
						</div>
						<div className={styles.body}>
							{draft.connections.map((entry, i) => (
								<div key={i}>
									<div className={styles.fieldLabel}>{entry.q}</div>
									<textarea className="textarea" rows={2} value={entry.a} onChange={(e) => set({ connections: draft.connections.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)) })} />
								</div>
							))}
							{cls?.hopeFeature && (
								<div>
									<div className={styles.fieldLabel}>Hope Feature · {cls.hopeFeature.name}</div>
									<span className={styles.panelHint}>{flattenDescription(cls.hopeFeature.description)}</span>
								</div>
							)}
						</div>
					</>
				)}

				{/* Footer nav */}
				<div className={styles.nav}>
					<button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
					<span className={styles.stepProgress}>Step {step + 1} / {STEPS.length} · {STEPS[step].label}</span>
					<div className={styles.navSpacer} />
					{step > 0 && (
						<button type="button" className="button button-ghost" onClick={() => setStep(step - 1)}>
							<Icon name="back" size={13} /> Back
						</button>
					)}
					{step < STEPS.length - 1 ? (
						<button type="button" className="button button-primary" onClick={() => setStep(step + 1)}>
							Next <Icon name="fwd" size={13} />
						</button>
					) : (
						<button type="button" className="button button-accent" disabled={saving} onClick={finish}>
							<Icon name="crown" size={14} /> {saving ? "Forging…" : "Forge Hero"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
