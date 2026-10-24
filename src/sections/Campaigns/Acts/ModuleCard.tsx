import { useState } from "react";
import { ConfirmButton } from "../../../components/ConfirmButton";
import { Icon } from "../../../components/Primitives";
import { AdversaryStatBlock, Entries, Notes } from "./AdversaryStatBlock";
import { Countdown, EncounterTrackers } from "./Trackers";
import { MODULE_TYPES, adversaryIndex, moduleTitle, roman } from "./actHelpers";
import styles from "./Acts.module.css";

/* One module of an act, as the GM (with tools) or a player (story only) sees it. */
export const ModuleCard = ({
	module,
	acts,
	isDM,
	onEdit,
	onDelete,
	onToggleReveal,
	onOpenAct,
	onTrack,
}: {
	module: ActModule;
	acts: CampaignAct[];
	isDM: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
	onToggleReveal?: () => void;
	onOpenAct: (actID: string) => void;
	// Table-side marks (HP, stress, countdown) — saved without opening the editor.
	onTrack?: (fn: (m: ActModule) => ActModule) => void;
}) => {
	const [open, setOpen] = useState(true);
	const meta = MODULE_TYPES[module.type];

	return (
		<article className={`frame ${styles.module}`} data-type={module.type} data-sortable={isDM ? "" : undefined}>
			<header className={styles.modHd}>
				<div className={styles.modTitleWrap}>
					{isDM && (
						<span className={`chip ${meta.chip} ${styles.modChip}`}>
							<Icon name={meta.icon} size={12} />
							{meta.label}
						</span>
					)}
					<h3 className={`display ${styles.modTitle}`}>{moduleTitle(module)}</h3>
				</div>
				<div className={styles.modTools}>
					{isDM && module.type === "story" && (
						<button
							type="button"
							className={`chip ${styles.revealChip}`}
							data-on={module.revealed ? "" : undefined}
							onClick={onToggleReveal}
							title={module.revealed ? "Players can read this once the act is revealed. Click to hide it." : "Only you can see this. Click to reveal it to players."}
						>
							<Icon name={module.revealed ? "eye" : "lock"} size={12} />
							{module.revealed ? "Revealed" : "Hidden"}
						</button>
					)}
					{isDM && (
						<>
							<button type="button" className="sf-icon-btn" onClick={onEdit} aria-label="Edit module" title="Edit">
								<Icon name="edit" size={14} />
							</button>
							<ConfirmButton
								className="sf-icon-btn"
								aria-label="Delete module"
								title={`Delete this ${meta.label.toLowerCase()}?`}
								message={
									module.type === "adversary"
										? "Encounters and environments that use this adversary will show it as missing. Copies in other acts are kept. This can't be undone."
										: "This can't be undone."
								}
								onConfirm={() => onDelete?.()}
							>
								<Icon name="trash" size={14} />
							</ConfirmButton>
						</>
					)}
					<button
						type="button"
						className={`sf-icon-btn ${styles.collapse}`}
						data-open={open ? "" : undefined}
						onClick={() => setOpen((o) => !o)}
						aria-label={open ? "Collapse" : "Expand"}
						aria-expanded={open}
					>
						<Icon name="fwd" size={14} />
					</button>
				</div>
			</header>
			{open && (
				<div className={styles.modBd}>
					<ModuleBody module={module} acts={acts} isDM={isDM} onOpenAct={onOpenAct} onTrack={onTrack} />
				</div>
			)}
		</article>
	);
};

const ModuleBody = ({
	module,
	acts,
	isDM,
	onOpenAct,
	onTrack,
}: {
	module: ActModule;
	acts: CampaignAct[];
	isDM: boolean;
	onOpenAct: (actID: string) => void;
	onTrack?: (fn: (m: ActModule) => ActModule) => void;
}) => {
	switch (module.type) {
		case "story":
			return module.body ? <p className={styles.prose}>{module.body}</p> : <p className={styles.empty}>No story written yet.</p>;

		case "option":
			return (
				<ol className={styles.paths}>
					{module.choices.map((c) => {
						const i = c.leadsTo ? acts.findIndex((a) => a.id === c.leadsTo) : -1;
						return (
							<li key={c.id} className={styles.path}>
								<div className={styles.pathHd}>
									<span className={styles.pathLabel}>{c.label || "Unnamed path"}</span>
									{c.leadsTo &&
										(i >= 0 ? (
											<button type="button" className={styles.pathLink} onClick={() => onOpenAct(acts[i].id)}>
												<Icon name="fwd" size={12} />
												Act {roman(i + 1)} · {acts[i].title}
											</button>
										) : (
											<span className={styles.missing}>Missing act</span>
										))}
								</div>
								{c.notes && <p className={styles.prose}>{c.notes}</p>}
							</li>
						);
					})}
				</ol>
			);

		case "adversary":
			return <AdversaryStatBlock module={module} />;

		case "encounter": {
			const index = adversaryIndex(acts);
			return (
				<>
					{module.setting && <p className={styles.prose}>{module.setting}</p>}
					{module.objective && (
						<p className={styles.line}>
							<b>Objective:</b> {module.objective}
						</p>
					)}
					{module.adversaries.length > 0 && (
						<EncounterTrackers
							encounter={module}
							index={index}
							onOpenAct={onOpenAct}
							onChange={(adversaries) => onTrack?.((m) => (m.type === "encounter" ? { ...m, adversaries } : m))}
						/>
					)}
					{module.notes && <Notes text={module.notes} />}
					{!module.setting && !module.objective && !module.adversaries.length && !module.notes && (
						<p className={styles.empty}>Nothing planned yet.</p>
					)}
				</>
			);
		}

		case "environment": {
			const index = adversaryIndex(acts);
			const st = module.stats;
			return (
				<>
					{st.system === "daggerheart" && (
						<div className={styles.chipRow}>
							<span className="chip">
								Tier {st.tier} · {st.kind}
							</span>
							{st.difficulty != null && (
								<span className="chip">
									Difficulty <span className="mono">{st.difficulty}</span>
								</span>
							)}
						</div>
					)}
					{module.description && <p className={styles.prose}>{module.description}</p>}
					{st.system === "daggerheart" ? (
						<>
							{st.impulses && (
								<p className={styles.line}>
									<b>Impulses:</b> {st.impulses}
								</p>
							)}
							<Entries title="Features" list={st.features} />
						</>
					) : (
						<>
							{st.terrain && (
								<p className={styles.line}>
									<b>Terrain:</b> {st.terrain}
								</p>
							)}
							<Entries
								title="Hazards"
								list={st.hazards.map((h) => ({ ...h, kind: h.dc != null ? `DC ${h.dc}` : undefined }))}
							/>
							<Entries title="Features" list={st.features} />
						</>
					)}
					{module.adversaries.length > 0 && (
						<div className={styles.entries}>
							<div className={`caps ${styles.entriesHd}`}>Potential adversaries</div>
							<ul className={styles.foes}>
								{module.adversaries.map((id) => {
									const ref = index.get(id);
									return (
										<li key={id} className={styles.foe}>
											{ref ? (
												<>
													{ref.module.name || "Unnamed adversary"}
													<button type="button" className={styles.foeAct} onClick={() => onOpenAct(ref.act.id)}>
														Act {roman(ref.actIndex + 1)}
													</button>
												</>
											) : (
												<span className={styles.missing}>Missing adversary</span>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					)}
					{module.notes && <Notes text={module.notes} />}
				</>
			);
		}

		case "event":
			return (
				<>
					{module.trigger && (
						<p className={styles.line}>
							<b>Trigger:</b> {module.trigger}
						</p>
					)}
					{module.happens && <p className={styles.prose}>{module.happens}</p>}
					{module.outcomes.length > 0 && (
						<div className={styles.entries}>
							<div className={`caps ${styles.entriesHd}`}>Outcomes</div>
							{module.outcomes.map((o) => (
								<p key={o.id} className={styles.entry}>
									<b>{o.label ? `If ${o.label.replace(/^if\s+/i, "")}` : "Otherwise"}</b>
									{o.text && <> — {o.text}</>}
								</p>
							))}
						</div>
					)}
					{module.countdown && (
						<Countdown
							countdown={module.countdown}
							isDM={isDM}
							onChange={(current) =>
								onTrack?.((m) => (m.type === "event" && m.countdown ? { ...m, countdown: { ...m.countdown, current } } : m))
							}
						/>
					)}
					{module.notes && <Notes text={module.notes} />}
					{!module.trigger && !module.happens && !module.outcomes.length && !module.countdown && !module.notes && (
						<p className={styles.empty}>Nothing planned yet.</p>
					)}
				</>
			);
	}
};
