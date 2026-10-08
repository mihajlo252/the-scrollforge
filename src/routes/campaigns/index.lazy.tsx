import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore, useCampaignStore, useCampaignCacheStore } from "../../zustand/stores";
import { Icon, RuneDivider, TabBar } from "../../components/Primitives";
import { SortableGrid } from "../../components/SortableGrid/SortableGrid";
import { getData } from "../../utilities/getData";
import { mergeReorder } from "../../utilities/reorder";
import {
	createCampaign,
	deleteCampaign,
	getAllCampaigns,
	getCharactersByIds,
	getVisibleRosterRows,
	requestJoinCampaign,
} from "../../utilities/campaigns";
import { toast } from "../../utilities/toasterSonner";
import {
	CampaignCard,
	CampaignModal,
	DeleteCampaignModal,
	EmptyGroup,
	GLYPHS,
	GlyphPicker,
	JoinModal,
	Role,
	SecHead,
	SigilTile,
	SYS,
	heroSummary,
	sigilColor,
	sortRows,
	sysOf,
} from "../../sections/Campaigns/CampaignParts";
import styles from "../../routeStyles/campaigns.module.css";

export const Route = createLazyFileRoute("/campaigns/")({
	component: Campaigns,
});

type Hero = Character | DaggerheartCharacter;

function Campaigns() {
	const { user } = useUserStore();
	const { setCampaign } = useCampaignStore();
	const cache = useCampaignCacheStore();
	const navigate = useNavigate();
	const me = user?.id;
	const myName: string = user?.user_metadata?.username ?? "Adventurer";

	const [tab, setTab] = useState<"mine" | "browse">("mine");
	const [q, setQ] = useState("");
	const [sysFilter, setSysFilter] = useState<"all" | "dnd" | "daggerheart">("all");

	// Cached data from the last visit renders immediately; load() refreshes it.
	const fresh = !!me && cache.owner === me;
	const campaigns = fresh ? cache.campaigns : [];
	const rows = fresh ? cache.rows : [];
	const myCharacters = fresh ? cache.myCharacters : [];
	const heroes = fresh ? cache.heroes : [];

	const [forgeOpen, setForgeOpen] = useState(false);
	const [joinTarget, setJoinTarget] = useState<Campaign | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

	const load = async () => {
		if (!me) return;
		try {
			const [all, visible, mine] = await Promise.all([
				getAllCampaigns(),
				getVisibleRosterRows(),
				getData("characters", me) as Promise<Hero[]>,
			]);
			// RLS returns only the heroes I'm allowed to see; the rest fall back
			// to a plain rune in the party strip.
			const seen = await getCharactersByIds([...new Set(visible.map((r) => r.characterID))]);
			cache.setHub(me, { campaigns: all, rows: visible, heroes: seen, myCharacters: mine });
		} catch (err) {
			console.error("Failed to load campaigns", err);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const charById = useMemo(() => new Map<string, Hero>([...heroes, ...myCharacters].map((c) => [c.id, c] as const)), [heroes, myCharacters]);

	const byCampaign = useMemo(() => {
		// `mine` = every one of my heroes in the campaign (seated or pending).
		const m = new Map<string, { party: CampaignCharacter[]; pending: CampaignCharacter[]; mine: CampaignCharacter[] }>();
		for (const c of campaigns) m.set(c.id, { party: [], pending: [], mine: [] });
		for (const r of sortRows(rows)) {
			const e = m.get(r.campaignID);
			if (!e) continue;
			if (r.status === "accepted") e.party.push(r);
			else e.pending.push(r);
			if (r.profileID === me) e.mine.push(r);
		}
		return m;
	}, [campaigns, rows, me]);

	const roleOf = (c: Campaign): Role => {
		if (c.dmID === me) return "dm";
		const mine = byCampaign.get(c.id)?.mine ?? [];
		if (!mine.length) return null;
		// Player as soon as one hero is seated; pending while all still wait.
		return mine.some((r) => r.status === "accepted") ? "player" : "pending";
	};

	// Apply the user's saved drag-and-drop order for a group; campaigns that
	// aren't in it yet (new ones) keep their newest-first spot after the rest.
	const ordered = (group: string, list: Campaign[]) => {
		const order = cache.order[group] ?? [];
		const rank = new Map(order.map((id, i) => [id, i] as const));
		return [...list].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
	};

	const gm = ordered("gm", campaigns.filter((c) => c.dmID === me));
	const playing = ordered("playing", campaigns.filter((c) => c.dmID !== me && byCampaign.get(c.id)?.mine.length));
	const seatedIn = playing.filter((c) => roleOf(c) === "player").length;
	// My heroes still waiting on a GM, across all campaigns.
	const pendingN = playing.reduce((n, c) => n + (byCampaign.get(c.id)?.mine.filter((r) => r.status === "pending").length ?? 0), 0);
	const browseAll = ordered("browse", campaigns);
	const isShown = (c: Campaign) => (sysFilter === "all" || c.gamemode === sysFilter) && c.name.toLowerCase().includes(q.toLowerCase());
	const browse = browseAll.filter(isShown);

	const open = (c: Campaign) => {
		setCampaign(c);
		navigate({ to: "/campaigns/detail" });
	};

	const removeCampaign = async (c: Campaign) => {
		const ok = await deleteCampaign(c.id);
		if (!ok) {
			toast({ style: "frame button-primary", message: "Couldn't delete the campaign." });
			return;
		}
		cache.removeCampaign(c.id);
		setDeleteTarget(null);
		toast({ style: "", message: `${c.name} has been struck from the ledger.` });
	};

	const card = (c: Campaign, context: "mine" | "browse") => {
		const e = byCampaign.get(c.id)!;
		const myNames = e.mine
			.map((r) => charById.get(r.characterID))
			.filter(Boolean)
			.map((h) => heroSummary(h!).name);
		return (
			<CampaignCard
				campaign={c}
				role={roleOf(c)}
				myHeroName={myNames.length ? myNames.join(", ") : undefined}
				party={e.party}
				charById={charById}
				pendingCount={e.pending.length}
				context={context}
				onOpen={() => open(c)}
				onJoin={() => setJoinTarget(c)}
				onDelete={() => setDeleteTarget(c)}
			/>
		);
	};

	const sortable = (group: string, list: Campaign[], className: string, context: "mine" | "browse") => (
		<SortableGrid
			animateOnMount
			items={list}
			getId={(c) => c.id}
			onReorder={(next) =>
				// Browse can be filtered: write the visible order back into the
				// full list so hidden campaigns keep their places.
				cache.setOrder(group, (group === "browse" ? mergeReorder(browseAll, next, isShown) : next).map((c) => c.id))
			}
			className={`${styles.sortList} ${className}`}
			itemClassName={styles.sortItem}
			renderItem={(c) => card(c, context)}
		/>
	);

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.root}>
			<div className={styles.cq}>
			<div className={styles.hubHead}>
				<div>
					<div className={`eyebrow ${styles.eyebrow}`}>The guild ledger</div>
					<h1 className={`display ${styles.h1}`}>Campaigns</h1>
					<div className={styles.sub}>
						<span className="mono">{gm.length}</span> running · <span className="mono">{seatedIn}</span> playing
						{pendingN > 0 && (
							<>
								{" "}
								· <span className={styles.subPending}><span className="mono">{pendingN}</span> awaiting approval</span>
							</>
						)}
					</div>
				</div>
				<button type="button" className={`button button-primary ${styles.newBtn}`} onClick={() => setForgeOpen(true)}>
					<Icon name="plus" size={16} />New Campaign
				</button>
			</div>

				<RuneDivider />
			<div className={styles.toolbar}>
				<TabBar
					active={tab}
					onChange={setTab}
					tabs={[
						{ id: "mine", icon: "crown", label: <>My Campaigns <span className={styles.tabCount}>{gm.length + playing.length}</span></> },
						{ id: "browse", icon: "search", label: <>Browse <span className={styles.tabCount}>{campaigns.length}</span></> },
					]}
				/>
				<AnimatePresence initial={false}>
					{tab === "browse" && (
						<motion.div
							key="filters"
							className={styles.filters}
							initial={{ opacity: 0, x: 12 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 12 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							onUpdate={() => {}}
						>
							<div className={styles.search}>
								<Icon name="search" size={15} />
								<input className="input" placeholder="Search campaigns" value={q} onChange={(e) => setQ(e.target.value)} />
							</div>
							<div className={styles.seg}>
								{(
									[
										["all", "All"],
										["dnd", "D&D 5e"],
										["daggerheart", "Daggerheart"],
									] as const
								).map(([k, l]) => (
									<button key={k} type="button" className="sf-tab" data-active={sysFilter === k ? "" : undefined} onClick={() => setSysFilter(k)}>
										{l}
									</button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* My Campaigns ↔ Browse cross-fade. onUpdate keeps framer on its
			    main-thread animator (see Popup.tsx) so the exit doesn't flash. */}
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={tab}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -6 }}
					transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
					onUpdate={() => {}}
				>
					{tab === "mine" ? (
						<div className={styles.mine}>
							<section>
								<SecHead icon="crown" title="Running as GM" count={gm.length} />
								{gm.length ? (
									sortable("gm", gm, styles.stack, "mine")
								) : (
									<EmptyGroup
										icon="crown"
										title="No tables of your own yet"
										body="Forge a campaign and choose its system — players will find it in Browse."
										action={
											<button type="button" className={`button ${styles.btnSm}`} onClick={() => setForgeOpen(true)}>
												<Icon name="flame" size={13} />
												Forge a Campaign
											</button>
										}
									/>
								)}
							</section>
							<section>
								<SecHead icon="users" title="Playing in" count={playing.length} />
								{playing.length ? (
									sortable("playing", playing, styles.stack, "mine")
								) : (
									<EmptyGroup
										icon="users"
										title="Your heroes await a summons"
										body="Browse open campaigns and present one of your characters to its GM."
										action={
											<button type="button" className={`button ${styles.btnSm}`} onClick={() => setTab("browse")}>
												<Icon name="search" size={13} />
												Browse campaigns
											</button>
										}
									/>
								)}
							</section>
						</div>
					) : browse.length ? (
						sortable("browse", browse, styles.browse, "browse")
					) : (
						<EmptyGroup icon="search" title="No campaigns match" body="Try another name or system." />
					)}
				</motion.div>
			</AnimatePresence>
			</div>

			<ForgeModal
				open={forgeOpen}
				onClose={() => setForgeOpen(false)}
				onCreate={async (name, gamemode, glyph, description) => {
					if (!me) return;
					try {
						const created = await createCampaign(name, me, myName, gamemode, glyph, description || undefined);
						toast({ style: "", message: "Campaign forged!" });
						cache.setHub(me, { campaigns: [created, ...campaigns], rows, heroes, myCharacters });
						setForgeOpen(false);
						setCampaign(created);
						navigate({ to: "/campaigns/detail" });
					} catch {
						/* createCampaign already showed a toast */
					}
				}}
			/>

			{joinTarget && (
				<JoinModal
					campaign={joinTarget}
					heroes={myCharacters}
					onClose={() => setJoinTarget(null)}
					onForgeHero={() => navigate({ to: "/profile" })}
					onSend={async (hero) => {
						if (!me) return false;
						try {
							await requestJoinCampaign(joinTarget.id, hero.id, me, myName);
							load();
							return true;
						} catch {
							return false;
						}
					}}
				/>
			)}

			<DeleteCampaignModal campaign={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={removeCampaign} />
		</motion.section>
	);
}

const ForgeModal = ({
	open,
	onClose,
	onCreate,
}: {
	open: boolean;
	onClose: () => void;
	onCreate: (name: string, gamemode: string, glyph: string, description: string) => Promise<void>;
}) => {
	const [name, setName] = useState("");
	const [sys, setSys] = useState<string | null>(null);
	const [glyph, setGlyph] = useState(GLYPHS[0].glyph);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [desc, setDesc] = useState("");
	const [busy, setBusy] = useState(false);
	const ok = !!name.trim() && !!sys && !busy;
	const L = sys && sysOf(sys).label;

	// Fresh form every time the modal opens.
	useEffect(() => {
		if (open) {
			setName("");
			setSys(null);
			setGlyph(GLYPHS[0].glyph);
			setDesc("");
		}
	}, [open]);

	const submit = async () => {
		if (!ok || !sys) return;
		setBusy(true);
		await onCreate(name.trim(), sys, glyph, desc.trim());
		setBusy(false);
	};

	const glyphName = GLYPHS.find((g) => g.glyph === glyph)?.name ?? "Glyph";

	return (
		<>
		<CampaignModal
			open={open}
			onClose={onClose}
			eyebrow="A new table"
			title="Forge a Campaign"
			width={640}
			footer={
				<>
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="button button-primary" disabled={!ok} onClick={submit}>
						<Icon name="flame" size={15} />
						Create Campaign
					</button>
				</>
			}
		>
			<div className={styles.field}>
				<label className="field-label">Campaign name</label>
				<input className="input" placeholder="e.g. The Shrouded Vault" value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<div className={styles.field}>
				<div className={styles.fieldRow}>
					<label className="field-label">System</label>
					<span className={`caps ${styles.perm}`}>
						<Icon name="lock" size={11} />
						Permanent
					</span>
				</div>
				<div className={styles.sysGrid}>
					{Object.keys(SYS).map((k) => (
						<button
							key={k}
							type="button"
							className={styles.sysTile}
							data-sys={k}
							data-on={sys === k ? "" : undefined}
							onClick={() => setSys(k)}
						>
							<span className={styles.sysIc}>
								<Icon name={SYS[k].icon} size={24} />
							</span>
							<span>
								<span className={`display ${styles.sysName}`}>{SYS[k].label}</span>
								<span className={styles.sysBlurb}>{SYS[k].blurb}</span>
							</span>
							<span className={styles.sysCheck}>
								<Icon name="check" size={12} stroke={2.4} />
							</span>
						</button>
					))}
				</div>
				<div className={styles.sealNote} data-on={sys ? "" : undefined}>
					<Icon name="lock" size={14} />
					<span>
						{sys ? (
							<>
								Sealed to <b>{L}</b> once forged. Only {L} characters can join, and this can’t be changed later.
							</>
						) : (
							"Choose deliberately — a campaign’s system can never be changed."
						)}
					</span>
				</div>
			</div>
			<div className={styles.field}>
				<label className="field-label">Glyph</label>
				<div className={styles.glyphField}>
					<SigilTile glyph={glyph} color={sigilColor(glyph, sys ?? "dnd")} className={styles.glyphPreview} />
					<div className={styles.glyphInfo}>
						<span className={`display ${styles.glyphInfoName}`}>{glyphName}</span>
						<span className={styles.glyphInfoHint}>The sigil players see on your campaign’s card.</span>
					</div>
					<button type="button" className={`button ${styles.btnSm}`} onClick={() => setPickerOpen(true)}>
						<Icon name="edit" size={13} />
						Choose glyph
					</button>
				</div>
			</div>
			<div className={styles.field} style={{ marginBottom: 6 }}>
				<label className="field-label">
					Chronicle <span className={styles.opt}>optional</span>
				</label>
				<textarea
					className={`input ${styles.textarea}`}
					rows={3}
					placeholder="Pitch, schedule, tone — what players see in Browse."
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
				></textarea>
			</div>
		</CampaignModal>
		<GlyphPicker open={pickerOpen} gamemode={sys} value={glyph} onClose={() => setPickerOpen(false)} onPick={setGlyph} />
		</>
	);
};
