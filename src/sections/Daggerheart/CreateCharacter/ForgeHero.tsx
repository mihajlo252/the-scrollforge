import { useState } from "react";
import { Icon } from "../../../components/Primitives";
import { DomainCardView } from "../CharacterProfile/DomainCard";
import {
	allAncestries,
	allClasses,
	allCommunities,
	subclassesForClass,
	getClass,
	getDomains,
	getSpellcastTrait,
	flattenDescription,
	TRAIT_NAMES,
} from "../../../utilities/daggerheart";
import { Capitalize } from "../../../utilities/capitalize";
import { getUserFromLocal } from "../../../utilities/getUserFromLocal";
import { submitDaggerheartCharacter, type ForgeDraft } from "../../../utilities/submitDaggerheartCharacter";
import { toast } from "../../../utilities/toasterSonner";
import domainCardsData from "../../../daggerheart-config/domain-cards.json";
import styles from "./ForgeHero.module.css";

const CATALOG = domainCardsData as DomainCard[];
const TRAIT_OPTIONS = [2, 1, 0, -1];
const RECOMMENDED = [2, 1, 1, 0, 0, -1];

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
		weapons: { primary: { name: "", trait: "Agility", range: "Melee", damage: "", dtype: "phy", burden: "One-Handed", feature: "" }, secondary: null },
		armor: { name: "", score: 0, thresholds: { major: 0, severe: 0 }, feature: "" },
		background: BACKGROUND_PROMPTS.map((q) => ({ q, a: "" })),
		experiences: [
			{ name: "", bonus: 2 },
			{ name: "", bonus: 2 },
		],
		domainCards: [],
		connections: CONNECTION_PROMPTS.map((q) => ({ q, a: "" })),
	}));

	const set = (patch: Partial<ForgeDraft>) => setDraft((d) => ({ ...d, ...patch }));

	const classDomains = getDomains(draft.class);
	const spellTrait = getSpellcastTrait(draft.subclass);

	const chooseClass = (name: string) => set({ class: name, subclass: firstSubclass(name), domainCards: [] });

	const setTrait = (t: DHTraitName, v: number) => set({ traits: { ...draft.traits, [t]: v } });

	const toggleCard = (card: DomainCard) => {
		const has = draft.domainCards.some((c) => c.name === card.name);
		if (has) set({ domainCards: draft.domainCards.filter((c) => c.name !== card.name) });
		else if (draft.domainCards.length < 2) set({ domainCards: [...draft.domainCards, card] });
		else toast({ style: "frame button-primary", message: "Choose just two domain cards to start." });
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

	const cls = getClass(draft.class);
	const traitTally = (v: number) => draft.traits ? Object.values(draft.traits).filter((x) => x === v).length : 0;
	const matchesRecommended = TRAIT_OPTIONS.every((v) => traitTally(v) === RECOMMENDED.filter((r) => r === v).length);

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
							<input className="input" placeholder="Hero name" value={draft.name} onChange={(e) => set({ name: e.target.value })} />
							<div className={styles.formGrid2}>
								<div>
									<div className={styles.fieldLabel}>Level</div>
									<select className="select" value={draft.level} onChange={(e) => set({ level: parseInt(e.target.value) })}>
										{Array.from({ length: 10 }, (_, i) => i + 1).map((l) => <option key={l} value={l}>{l}</option>)}
									</select>
								</div>
							</div>
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
					</>
				)}

				{/* TRAITS */}
				{current === "traits" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Traits</div>
							<div className={styles.panelHint}>Recommended spread: +2, +1, +1, 0, 0, −1. {spellTrait ? `Your Spellcast trait is ${spellTrait}.` : ""}</div>
						</div>
						<div className={styles.body}>
							<div className={styles.traitAssign}>
								{TRAIT_NAMES.map((t) => (
									<div key={t} className={styles.traitAssignRow} data-spellcast={!!spellTrait && spellTrait.toUpperCase() === t.toUpperCase()}>
										<span className={styles.traitAssignName}>{t}</span>
										<select className="select" value={draft.traits[t]} onChange={(e) => setTrait(t, parseInt(e.target.value))}>
											{TRAIT_OPTIONS.map((v) => <option key={v} value={v}>{v >= 0 ? `+${v}` : v}</option>)}
										</select>
									</div>
								))}
							</div>
							<span className={styles.poolNote}>
								{matchesRecommended ? "✓ Matches the recommended spread." : "Tip: the standard array uses one +2, two +1, two 0, and one −1."}
							</span>
						</div>
					</>
				)}

				{/* EQUIPMENT */}
				{current === "equipment" && (
					<>
						<div className={styles.panelHead}>
							<div className={styles.panelTitle}>Equipment</div>
							<div className={styles.panelHint}>Pick a primary weapon and armor. You can refine these later on the sheet.</div>
						</div>
						<div className={styles.body}>
							<div className={styles.fieldLabel}>Primary Weapon</div>
							<input className="input" placeholder="Weapon name" value={draft.weapons.primary?.name ?? ""} onChange={(e) => set({ weapons: { ...draft.weapons, primary: { ...(draft.weapons.primary as DHWeapon), name: e.target.value } } })} />
							<div className={styles.formGrid2}>
								<select className="select" value={draft.weapons.primary?.trait ?? "Agility"} onChange={(e) => set({ weapons: { ...draft.weapons, primary: { ...(draft.weapons.primary as DHWeapon), trait: e.target.value } } })}>
									{TRAIT_NAMES.map((t) => <option key={t} value={t}>{t}</option>)}
								</select>
								<input className="input" placeholder="Range (Melee, Far…)" value={draft.weapons.primary?.range ?? ""} onChange={(e) => set({ weapons: { ...draft.weapons, primary: { ...(draft.weapons.primary as DHWeapon), range: e.target.value } } })} />
								<input className="input" placeholder="Damage (1d8+1)" value={draft.weapons.primary?.damage ?? ""} onChange={(e) => set({ weapons: { ...draft.weapons, primary: { ...(draft.weapons.primary as DHWeapon), damage: e.target.value } } })} />
								<select className="select" value={draft.weapons.primary?.dtype ?? "phy"} onChange={(e) => set({ weapons: { ...draft.weapons, primary: { ...(draft.weapons.primary as DHWeapon), dtype: e.target.value } } })}>
									<option value="phy">Physical</option>
									<option value="mag">Magic</option>
								</select>
							</div>

							<div className={styles.fieldLabel}>Active Armor</div>
							<input className="input" placeholder="Armor name" value={draft.armor?.name ?? ""} onChange={(e) => set({ armor: { ...(draft.armor as DHArmor), name: e.target.value } })} />
							<div className={styles.formGrid2}>
								<input className="input" type="number" placeholder="Armor Score" value={draft.armor?.score ?? 0} onChange={(e) => set({ armor: { ...(draft.armor as DHArmor), score: parseInt(e.target.value) || 0 } })} />
								<span />
								<input className="input" type="number" placeholder="Major threshold" value={draft.armor?.thresholds.major ?? 0} onChange={(e) => set({ armor: { ...(draft.armor as DHArmor), thresholds: { ...(draft.armor as DHArmor).thresholds, major: parseInt(e.target.value) || 0 } } })} />
								<input className="input" type="number" placeholder="Severe threshold" value={draft.armor?.thresholds.severe ?? 0} onChange={(e) => set({ armor: { ...(draft.armor as DHArmor), thresholds: { ...(draft.armor as DHArmor).thresholds, severe: parseInt(e.target.value) || 0 } } })} />
							</div>
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
									<input className="input" placeholder={`Experience ${i + 1} (e.g. Silver Tongue)`} value={x.name} onChange={(e) => set({ experiences: draft.experiences.map((y, idx) => (idx === i ? { ...y, name: e.target.value } : y)) })} />
									<input className="input" type="number" value={x.bonus} onChange={(e) => set({ experiences: draft.experiences.map((y, idx) => (idx === i ? { ...y, bonus: parseInt(e.target.value) || 0 } : y)) })} />
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
							<div className={styles.panelHint}>Choose two level-1 cards from your {cls?.name} domains ({classDomains.map(Capitalize).join(" & ")}). Selected {draft.domainCards.length}/2.</div>
						</div>
						<div className={styles.body}>
							{CATALOG.filter((c) => classDomains.some((d) => d.toUpperCase() === c.domain.toUpperCase())).map((card) => {
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
