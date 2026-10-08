import React, { useState } from "react";
import { AvatarIcon, Icon, RuneDivider } from "../../components/Primitives";
import { Popup } from "../../components/Popup/Popup";
import styles from "../../routeStyles/campaigns.module.css";

/* Shared building blocks for the Campaigns hub and detail screens (ported from
 * the Claude Design "Scrollforge Redesign" campaign files). */

// Text variation selector — keeps glyphs like ☽ rendering as text, not emoji.
const vs = (g: string) => g + "︎";

export const SYS: Record<string, { label: string; chip: string; icon: string; dmTitle: string; blurb: string }> = {
	dnd: {
		label: "D&D 5e",
		chip: "chip-gold",
		icon: "d20",
		dmTitle: "Game Master",
		blurb: "Six abilities, armor class, spell slots and the d20.",
	},
	daggerheart: {
		label: "Daggerheart",
		chip: "chip-arcane",
		icon: "sparkle",
		dmTitle: "Game Master",
		blurb: "Six traits, Hope & Fear, domain cards and duality dice.",
	},
};
export const sysOf = (gamemode: string) => SYS[gamemode] ?? SYS.dnd;

export type Role = "dm" | "player" | "pending" | null;

// Stable small hash so a campaign / character always gets the same sigil colour.
const hash = (s: string) => {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
};

// Glyphs a GM can pick for a campaign's sigil (Forge a Campaign → Choose glyph).
export const GLYPHS: { glyph: string; name: string }[] = [
	{ glyph: "☽", name: "Moon" },
	{ glyph: "☀", name: "Sun" },
	{ glyph: "✧", name: "Star" },
	{ glyph: "✶", name: "Nova" },
	{ glyph: "✺", name: "Ember" },
	{ glyph: "❂", name: "Eye" },
	{ glyph: "☄", name: "Comet" },
	{ glyph: "♛", name: "Crown" },
	{ glyph: "♜", name: "Tower" },
	{ glyph: "♞", name: "Steed" },
	{ glyph: "⚔", name: "Blades" },
	{ glyph: "⚒", name: "Forge" },
	{ glyph: "⚓", name: "Anchor" },
	{ glyph: "⚜", name: "Fleur" },
	{ glyph: "✠", name: "Cross" },
	{ glyph: "☥", name: "Ankh" },
	{ glyph: "☠", name: "Skull" },
	{ glyph: "⚗", name: "Alembic" },
	{ glyph: "❦", name: "Vine" },
	{ glyph: "✿", name: "Bloom" },
	{ glyph: "❖", name: "Rune" },
	{ glyph: "◈", name: "Gem" },
	{ glyph: "♆", name: "Trident" },
	{ glyph: "☯", name: "Balance" },
];

const SIGIL_COLORS: Record<string, string[]> = {
	dnd: [
		"linear-gradient(150deg,#2f3f5c,#141a2b)",
		"linear-gradient(150deg,#2b5a5a,#10262a)",
		"linear-gradient(150deg,#5a2030,#1e0c12)",
		"linear-gradient(150deg,#3a3a46,#121218)",
		"linear-gradient(150deg,#6b5220,#2a1f0c)",
	],
	daggerheart: [
		"linear-gradient(150deg,#4a3f7a,#1a1530)",
		"linear-gradient(150deg,#8a3a1e,#2e140c)",
		"linear-gradient(150deg,#3d5a2e,#141f10)",
		"linear-gradient(150deg,#2e4a5a,#10202a)",
	],
};
const HERO_COLORS = [
	"linear-gradient(135deg,#4a3a6b,#2a1f3e)",
	"linear-gradient(135deg,#6b4a2a,#3e2a1a)",
	"linear-gradient(135deg,#3a5b6b,#1f3a4a)",
	"linear-gradient(135deg,#6b2a2a,#3e1f1f)",
	"linear-gradient(135deg,#5a2a4a,#2e1626)",
	"linear-gradient(135deg,#6b5a2a,#3a2e14)",
	"linear-gradient(135deg,#2e4a34,#16261a)",
	"linear-gradient(135deg,#5a5a6b,#25252e)",
];

// Colour follows the glyph + system, so the Forge preview matches the card.
export const sigilColor = (glyph: string, gamemode: string) => {
	const colors = SIGIL_COLORS[gamemode] ?? SIGIL_COLORS.dnd;
	return colors[hash(glyph) % colors.length];
};

export const campaignSigil = (c: Campaign) => {
	if (c.glyph) return { glyph: c.glyph, color: sigilColor(c.glyph, c.gamemode) };
	// Campaigns forged before glyphs could be picked: derive one from the id.
	const h = hash(c.id);
	const colors = SIGIL_COLORS[c.gamemode] ?? SIGIL_COLORS.dnd;
	return { glyph: GLYPHS[h % GLYPHS.length].glyph, color: colors[h % colors.length] };
};
export const heroColor = (id: string) => HERO_COLORS[hash(id) % HERO_COLORS.length];

// Name / level / lineage / class for a character row, either system.
export const heroSummary = (c: Character | DaggerheartCharacter) => {
	const p: any = c.characterProfile ?? {};
	const isDnd = c.gamemode === "dnd";
	return {
		name: p.name ?? (c as any).name ?? "Unnamed hero",
		level: p.level,
		cls: p.class ?? "",
		lineage: (isDnd ? [p.race, p.subrace] : [p.ancestry, p.community]).filter(Boolean).join(" "),
		job: [p.class, p.subclass].filter(Boolean).join(" · "),
	};
};

// Party order: the GM's drag-and-drop order first, then join time.
export const sortRows = (rows: CampaignCharacter[]) =>
	[...rows].sort((a, b) => {
		const sa = a.sortOrder ?? Infinity;
		const sb = b.sortOrder ?? Infinity;
		if (sa !== sb) return sa - sb;
		return a.created_at.localeCompare(b.created_at);
	});

export const timeAgo = (iso: string) => {
	const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.round(hrs / 24);
	if (days === 1) return "Yesterday";
	if (days < 30) return `${days} days ago`;
	return new Date(iso).toLocaleDateString();
};

export const SysChip = ({ gamemode }: { gamemode: string }) => {
	const s = sysOf(gamemode);
	return (
		<span className={`chip ${s.chip}`}>
			<Icon name={s.icon} size={12} />
			{s.label}
		</span>
	);
};

export const RoleChip = ({ role }: { role: Role }) => {
	if (role === "dm")
		return (
			<span className="chip chip-gold">
				<Icon name="crown" size={12} />
				GM
			</span>
		);
	if (role === "pending")
		return (
			<span className={`chip ${styles.pendingChip}`}>
				<Icon name="hourglass" size={12} />
				Pending approval
			</span>
		);
	return (
		<span className="chip">
			<Icon name="user" size={12} />
			Player
		</span>
	);
};

export const Sigil = ({ campaign, className = "" }: { campaign: Campaign; className?: string }) => {
	const { glyph, color } = campaignSigil(campaign);
	return <SigilTile glyph={glyph} color={color} className={className} />;
};

export const SigilTile = ({ glyph, color, className = "" }: { glyph: string; color: string; className?: string }) => (
	<div className={`${styles.sigil} ${className}`} style={{ background: color }}>
		<span className="display">{vs(glyph)}</span>
	</div>
);

// Square class emblem for a hero. Falls back to a plain rune when the
// character row isn't readable (e.g. a stranger's hero seen from Browse).
export const HeroAvatar = ({
	id,
	character,
	size = 50,
	className = "",
}: {
	id: string;
	character?: Character | DaggerheartCharacter;
	size?: number;
	className?: string;
}) => {
	const cls = character ? heroSummary(character).cls : "";
	return (
		<span className={`${styles.heroAv} ${className}`} style={{ background: heroColor(id), width: size, height: size }}>
			{cls ? (
				<AvatarIcon name={cls.toLowerCase()} size={size * 0.78} fillClr="rgba(255,246,226,0.88)" strokeClr="transparent" />
			) : (
				<span className="display" style={{ fontSize: size * 0.5 }}>
					{vs("✦")}
				</span>
			)}
		</span>
	);
};

// Party strip: filled emblems, then dashed open seats, then n/seats.
export const Emblems = ({
	party,
	charById,
	seats,
	size = 28,
	hideOpen,
}: {
	party: CampaignCharacter[];
	charById: Map<string, Character | DaggerheartCharacter>;
	seats: number;
	size?: number;
	hideOpen?: boolean;
}) => (
	<div className={styles.emblems}>
		<div className={styles.embFilled}>
			{party.map((r) => {
				const c = charById.get(r.characterID);
				return (
					<span key={r.id} title={c ? heroSummary(c).name : undefined} className={styles.emblem}>
						<HeroAvatar id={r.characterID} character={c} size={size} />
					</span>
				);
			})}
		</div>
		{!hideOpen && (
			<div className={styles.embOpen}>
				{Array.from({ length: Math.max(0, seats - party.length) }).map((_, i) => (
					<span key={i} className={styles.emblemOpen} style={{ width: size - 6, height: size - 6 }}></span>
				))}
			</div>
		)}
		<span className={`mono ${styles.seats}`}>
			{party.length}/{seats}
		</span>
	</div>
);

export const EmptyGroup = ({ icon, title, body, action }: { icon: string; title: string; body: string; action?: React.ReactNode }) => (
	<div className={styles.empty}>
		<div className={styles.emptySeal}>
			<Icon name={icon} size={22} />
		</div>
		<div className={`display ${styles.emptyTitle}`}>{title}</div>
		<div className={styles.emptyBody}>{body}</div>
		{action}
	</div>
);

export const SecHead = ({ icon, title, count }: { icon: string; title: string; count: number }) => (
	<div className={styles.secHd}>
		<Icon name={icon} size={16} />
		<span className="display">{title}</span>
		<span className={`mono ${styles.count}`}>{count}</span>
	</div>
);

// Framed modal shell (eyebrow, title, optional sub-line, body, footer), shown
// through the shared Popup so it gets the backdrop, Escape and flicker fix.
export const CampaignModal = ({
	open,
	onClose,
	eyebrow,
	title,
	sub,
	footer,
	width = 600,
	children,
}: {
	open: boolean;
	onClose: () => void;
	eyebrow: string;
	title: string;
	sub?: React.ReactNode;
	footer: React.ReactNode;
	width?: number;
	children: React.ReactNode;
}) => (
	<Popup toggle={open} closerFunc={() => onClose()}>
		<div className={`frame ${styles.modal}`} style={{ width: `min(${width}px, calc(100vw - 32px))` }}>
			<span className="frame-corner tl" />
			<span className="frame-corner tr" />
			<span className="frame-corner bl" />
			<span className="frame-corner br" />
			<div className={styles.modalHd}>
				<div style={{ minWidth: 0 }}>
					<div className="eyebrow" style={{ fontSize: 15 }}>
						{eyebrow}
					</div>
					<div className={`display ${styles.modalTitle}`}>{title}</div>
					{sub && <div className={styles.modalSub}>{sub}</div>}
				</div>
				<button type="button" className="sf-icon-btn" onClick={onClose} aria-label="Close">
					<Icon name="close" size={15} />
				</button>
			</div>
			<div className={styles.modalRule}>
				<RuneDivider />
			</div>
			<div className={styles.modalBd}>{children}</div>
			<div className={styles.modalFt}>{footer}</div>
		</div>
	</Popup>
);

export const CampaignCard = ({
	campaign,
	role,
	myHeroName,
	party,
	charById,
	pendingCount,
	context,
	onOpen,
	onJoin,
	onDelete,
}: {
	campaign: Campaign;
	role: Role;
	myHeroName?: string;
	party: CampaignCharacter[];
	charById: Map<string, Character | DaggerheartCharacter>;
	pendingCount: number;
	context: "mine" | "browse";
	onOpen: () => void;
	onJoin: () => void;
	onDelete?: () => void;
}) => {
	const seats = campaign.seats ?? 6;
	const action =
		context === "browse" && !role ? (
			<button type="button" className={`button button-primary ${styles.btnSm}`} onClick={onJoin}>
				<Icon name="plus" size={13} />
				Request to Join
			</button>
		) : (
			<button type="button" className={`button ${styles.btnSm}`} onClick={onOpen}>
				Open
				<Icon name="chev_r" size={13} />
			</button>
		);
	return (
		<article className={`frame hoverable ${styles.card}`}>
			<span className="frame-corner tl" />
			<span className="frame-corner tr" />
			<span className="frame-corner bl" />
			<span className="frame-corner br" />
			<Sigil campaign={campaign} />
			<div className={styles.cardBody}>
				<div className={styles.cardTop}>
					<div className={`display ${styles.cardName}`}>{campaign.name}</div>
					<div className={styles.chips}>
						<SysChip gamemode={campaign.gamemode} />
						{role && <RoleChip role={role} />}
					</div>
				</div>
				<div className={styles.cardMeta}>
					<span>
						<span className="caps">GM</span>
						{role === "dm" ? "You" : campaign.dmName || "Unknown"}
					</span>
					{myHeroName && (
						<span>
							<span className="caps">As</span>
							<em>{myHeroName}</em>
						</span>
					)}
				</div>
				{campaign.description ? (
					<p className={styles.cardDesc}>{campaign.description}</p>
				) : (
					<p className={`${styles.cardDesc} ${styles.muted}`}>No chronicle written yet.</p>
				)}
				<div className={styles.cardFoot}>
					<Emblems party={party} charById={charById} seats={seats} />
					<div className={styles.cardActions}>
						{role === "dm" && pendingCount > 0 && (
							<span className={styles.reqPip}>
								<span className="mono">{pendingCount}</span>
								{pendingCount === 1 ? "request" : "requests"}
							</span>
						)}
						{role === "dm" && context === "mine" && onDelete && (
							<button
								type="button"
								className={`button button-secondary ${styles.btnSm} ${styles.iconBtn}`}
								onClick={onDelete}
								title="Delete campaign"
								aria-label={`Delete ${campaign.name}`}
							>
								<Icon name="trash" size={14} />
							</button>
						)}
						{action}
					</div>
				</div>
			</div>
		</article>
	);
};

// Pick one same-system hero and send a join request (hub Browse + detail).
export const JoinModal = ({
	campaign,
	heroes,
	onClose,
	onSend,
	onForgeHero,
	excludeIds = [],
}: {
	campaign: Campaign;
	heroes: (Character | DaggerheartCharacter)[];
	/** Characters already in (or requested into) this campaign. */
	excludeIds?: string[];
	onClose: () => void;
	onSend: (hero: Character | DaggerheartCharacter) => Promise<boolean>;
	onForgeHero: () => void;
}) => {
	const [sent, setSent] = useState<Character | DaggerheartCharacter | null>(null);
	const [busy, setBusy] = useState(false);
	const L = sysOf(campaign.gamemode).label;
	const sameSystem = heroes.filter((h) => h.gamemode === campaign.gamemode);
	const fits = sameSystem.filter((h) => !excludeIds.includes(h.id));
	const alreadyIn = sameSystem.length - fits.length;
	const hidden = heroes.length - sameSystem.length;
	const otherL = sysOf(campaign.gamemode === "dnd" ? "daggerheart" : "dnd").label;
	const dmName = campaign.dmName || "the GM";

	const pick = async (h: Character | DaggerheartCharacter) => {
		if (busy) return;
		setBusy(true);
		if (await onSend(h)) setSent(h);
		setBusy(false);
	};

	let body: React.ReactNode;
	if (sent) {
		body = (
			<div className={styles.sent}>
				<div className={styles.emptySeal}>
					<Icon name="check" size={22} stroke={2} />
				</div>
				<div className={`display ${styles.emptyTitle}`}>Request sent</div>
				<div className={styles.emptyBody}>
					<b>{heroSummary(sent).name}</b> awaits {dmName}’s answer. You’ll find it under <em>Playing in</em>, marked pending approval.
				</div>
			</div>
		);
	} else if (!fits.length && alreadyIn > 0) {
		body = (
			<div className={styles.sent}>
				<div className={styles.emptySeal}>
					<Icon name="users" size={22} />
				</div>
				<div className={`display ${styles.emptyTitle}`}>All your {L} heroes are already here.</div>
				<div className={styles.emptyBody}>Every {L} character you have is seated or waiting on the GM. Forge another to present it.</div>
				<button type="button" className={`button ${styles.btnSm}`} onClick={onForgeHero}>
					<Icon name="plus" size={13} />
					Forge a {L} hero
				</button>
			</div>
		);
	} else if (!fits.length) {
		body = (
			<div className={styles.sent}>
				<div className={styles.emptySeal}>
					<Icon name="user" size={22} />
				</div>
				<div className={`display ${styles.emptyTitle}`}>You have no {L} characters to join with.</div>
				<div className={styles.emptyBody}>This campaign is sealed to {L}. Forge a hero for it, then return.</div>
				<button type="button" className={`button ${styles.btnSm}`} onClick={onForgeHero}>
					<Icon name="plus" size={13} />
					Forge a {L} hero
				</button>
			</div>
		);
	} else {
		body = (
			<>
				<p className={styles.joinIntro}>
					Choose a hero to present. They’ll stay pending until the GM accepts{alreadyIn > 0 ? " — you can present more than one" : ""}.
				</p>
				<div className={styles.picklist}>
					{fits.map((h) => {
						const s = heroSummary(h);
						return (
							<button key={h.id} type="button" className={styles.pick} disabled={busy} onClick={() => pick(h)}>
								<HeroAvatar id={h.id} character={h} />
								<span className={styles.pickMain}>
									<span className={`display ${styles.pickName}`}>
										{s.name}
										{s.level != null && <span className={`mono ${styles.lv}`}>LV {s.level}</span>}
									</span>
									<span className={styles.pickSub}>
										{s.lineage}
										{s.lineage && s.job && " · "}
										<em>{s.job}</em>
									</span>
								</span>
								<span className={styles.pickGo}>
									<span>Send request</span>
									<Icon name="fwd" size={14} />
								</span>
							</button>
						);
					})}
				</div>
				{hidden > 0 && (
					<div className={styles.hiddenNote}>
						<Icon name="lock" size={12} />
						{hidden} {otherL} {hidden === 1 ? "hero" : "heroes"} hidden — this campaign is sealed to {L}.
					</div>
				)}
			</>
		);
	}

	return (
		<CampaignModal
			open
			onClose={onClose}
			eyebrow="Present a hero"
			title={`Join ${campaign.name}`}
			sub={
				<>
					<SysChip gamemode={campaign.gamemode} />
					<span>
						<span className="caps" style={{ fontSize: 10, marginRight: 5 }}>
							GM
						</span>
						{campaign.dmName || "Unknown"}
					</span>
				</>
			}
			footer={
				sent ? (
					<button type="button" className="button button-primary" onClick={onClose}>
						Done
					</button>
				) : (
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
				)
			}
		>
			{body}
		</CampaignModal>
	);
};

// Grid of glyph cards for the campaign sigil, previewed in the campaign's
// system colours. Opens over the Forge popup.
export const GlyphPicker = ({
	open,
	gamemode,
	value,
	onClose,
	onPick,
}: {
	open: boolean;
	gamemode: string | null;
	value: string;
	onClose: () => void;
	onPick: (glyph: string) => void;
}) => {
	const [choice, setChoice] = useState(value);
	// Start from the current glyph each time the picker opens.
	React.useEffect(() => {
		if (open) setChoice(value);
	}, [open, value]);
	const sys = gamemode ?? "dnd";
	return (
		<CampaignModal
			open={open}
			onClose={onClose}
			eyebrow="Mark your table"
			title="Choose a Glyph"
			width={640}
			footer={
				<>
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
					<button
						type="button"
						className="button button-primary"
						onClick={() => {
							onPick(choice);
							onClose();
						}}
					>
						<Icon name="check" size={14} />
						Use this glyph
					</button>
				</>
			}
		>
			<div className={styles.glyphGrid}>
				{GLYPHS.map((g) => (
					<button
						key={g.glyph}
						type="button"
						className={styles.glyphCard}
						data-on={choice === g.glyph ? "" : undefined}
						onClick={() => setChoice(g.glyph)}
						onDoubleClick={() => {
							onPick(g.glyph);
							onClose();
						}}
						aria-label={g.name}
					>
						<SigilTile glyph={g.glyph} color={sigilColor(g.glyph, sys)} className={styles.glyphSigil} />
						<span className={`caps ${styles.glyphName}`}>{g.name}</span>
					</button>
				))}
			</div>
		</CampaignModal>
	);
};

// GM-only: delete a campaign after typing its exact name.
export const DeleteCampaignModal = ({
	campaign,
	onClose,
	onDelete,
}: {
	campaign: Campaign | null;
	onClose: () => void;
	onDelete: (campaign: Campaign) => Promise<void>;
}) => {
	const [typed, setTyped] = useState("");
	const [busy, setBusy] = useState(false);
	React.useEffect(() => {
		if (campaign) setTyped("");
	}, [campaign]);
	const matches = !!campaign && typed.trim() === campaign.name.trim();

	const submit = async () => {
		if (!campaign || !matches || busy) return;
		setBusy(true);
		await onDelete(campaign);
		setBusy(false);
	};

	return (
		<CampaignModal
			open={!!campaign}
			onClose={onClose}
			eyebrow="Strike from the ledger"
			title={`Delete ${campaign?.name ?? "campaign"}`}
			width={560}
			footer={
				<>
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="button button-secondary" disabled={!matches || busy} onClick={submit}>
						<Icon name="trash" size={14} />
						Delete campaign
					</button>
				</>
			}
		>
			<div className={styles.dangerNote}>
				<Icon name="skull" size={16} />
				<span>
					This removes the campaign and every hero’s seat and pending request in it. The characters themselves stay
					with their players. This can’t be undone.
				</span>
			</div>
			<form
				className={styles.field}
				onSubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<label className="field-label" htmlFor="delete-campaign-name">
					Type <b className={styles.confirmName}>{campaign?.name}</b> to confirm
				</label>
				<input
					id="delete-campaign-name"
					className="input"
					autoComplete="off"
					placeholder={campaign?.name}
					value={typed}
					onChange={(e) => setTyped(e.target.value)}
				/>
			</form>
		</CampaignModal>
	);
};
