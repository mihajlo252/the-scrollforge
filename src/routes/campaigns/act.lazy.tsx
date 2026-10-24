import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCampaignStore, useUserStore } from "../../zustand/stores";
import { ConfirmButton } from "../../components/ConfirmButton";
import { Icon } from "../../components/Primitives";
import { SortableGrid } from "../../components/SortableGrid/SortableGrid";
import { EmptyGroup } from "../../sections/Campaigns/CampaignParts";
import { ModuleCard } from "../../sections/Campaigns/Acts/ModuleCard";
import { ActDetailsModal, ModuleEditor } from "../../sections/Campaigns/Acts/ModuleEditor";
import { MODULE_ORDER, MODULE_TYPES, newModule, roman } from "../../sections/Campaigns/Acts/actHelpers";
import { useCampaignActs } from "../../sections/Campaigns/Acts/useCampaignActs";
import campaignStyles from "../../routeStyles/campaigns.module.css";
import styles from "../../sections/Campaigns/Acts/Acts.module.css";

export const Route = createLazyFileRoute("/campaigns/act")({
	component: CampaignActScreen,
});

function CampaignActScreen() {
	const { user } = useUserStore();
	const { campaign, actID, setActID } = useCampaignStore();
	const navigate = useNavigate();
	const isDM = !!campaign && campaign.dmID === user?.id;
	const { acts, isLoading, save, remove, track } = useCampaignActs(campaign?.id, isDM);
	const index = acts.findIndex((a) => a.id === actID);
	const act = index >= 0 ? acts[index] : null;

	const [editing, setEditing] = useState<{ module: ActModule; isNew: boolean } | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	// Live module order while the GM drags; null = the saved order.
	const [dragOrder, setDragOrder] = useState<ActModule[] | null>(null);

	// No campaign selected (e.g. hard refresh) — back to the hub. An act that's
	// gone (deleted, or hidden again from a player) — back to the campaign.
	useEffect(() => {
		if (!campaign) navigate({ to: "/campaigns" });
		else if (!isLoading && !act) navigate({ to: "/campaigns/detail" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [campaign, isLoading, act]);

	// Following a path to another act keeps the same route, so scroll up here.
	useEffect(() => {
		document.querySelector("main")?.scrollTo(0, 0);
	}, [actID]);

	if (!campaign || !act) return null;

	const openAct = (id: string) => {
		setDragOrder(null);
		setActID(id);
	};
	const setModules = (modules: ActModule[]) => save(act.id, { modules });
	const saveModule = (m: ActModule) =>
		setModules(act.modules.some((x) => x.id === m.id) ? act.modules.map((x) => (x.id === m.id ? m : x)) : [...act.modules, m]);
	const deleteModule = (id: string) => setModules(act.modules.filter((m) => m.id !== id));
	const toggleStory = (id: string) =>
		setModules(act.modules.map((m) => (m.id === id && m.type === "story" ? { ...m, revealed: !m.revealed } : m)));

	const modules = dragOrder ?? act.modules;
	const revealedStories = act.modules.filter((m) => m.type === "story" && m.revealed).length;
	const prev = acts[index - 1];
	const next = acts[index + 1];

	const card = (m: ActModule) => (
		<ModuleCard
			module={m}
			acts={acts}
			isDM={isDM}
			onEdit={() => setEditing({ module: m, isNew: false })}
			onDelete={() => deleteModule(m.id)}
			onToggleReveal={() => toggleStory(m.id)}
			onOpenAct={openAct}
			onTrack={(fn) => track(act.id, m.id, fn)}
		/>
	);

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={campaignStyles.root}>
			<header className={styles.actHead}>
				<div className={styles.actHeadMain}>
					<div className={`eyebrow ${campaignStyles.detEyebrow}`}>
						Act {roman(index + 1)} · {campaign.name}
					</div>
					<h1 className={`display ${styles.actH1}`}>{act.title}</h1>
					{act.summary && <p className={styles.actLead}>{act.summary}</p>}
					{isDM && (
						<div className={styles.revealRow}>
							<button
								type="button"
								className={`chip ${styles.revealChip}`}
								data-on={act.revealed ? "" : undefined}
								onClick={() => save(act.id, { revealed: !act.revealed })}
							>
								<Icon name={act.revealed ? "eye" : "lock"} size={12} />
								{act.revealed ? "Revealed to players" : "Hidden from players"}
							</button>
							<span className={styles.revealHint}>
								{act.revealed
									? `Seated players see this act's title, summary and ${revealedStories} revealed ${revealedStories === 1 ? "story" : "stories"}.`
									: "Only you can see this act. Reveal it when the party gets here."}
							</span>
						</div>
					)}
				</div>
				<div className={styles.actActions}>
					{isDM && (
						<>
							<button type="button" className={`button button-ghost ${campaignStyles.btnSm}`} onClick={() => setDetailsOpen(true)}>
								<Icon name="edit" size={13} />
								Edit
							</button>
							<ConfirmButton
								className={`button button-secondary ${campaignStyles.btnSm}`}
								title={`Delete ${act.title}?`}
								message="Its modules go with it, paths leading here will show as missing, and encounters lose any adversaries written in this act. This can't be undone."
								onConfirm={() => remove(act.id)}
							>
								<Icon name="trash" size={13} />
								Delete
							</ConfirmButton>
						</>
					)}
					<button type="button" className={`button button-primary ${campaignStyles.btnSm}`} onClick={() => navigate({ to: "/campaigns/detail" })}>
						<Icon name="back" size={13} />
						{campaign.name}
					</button>
				</div>
			</header>

			{modules.length === 0 ? (
				<EmptyGroup
					icon="scroll"
					title={isDM ? "This act is empty" : "Nothing revealed yet"}
					body={isDM ? "Add story, the choices ahead, adversaries and encounters below." : "The GM hasn't revealed any of this act's story yet."}
				/>
			) : isDM ? (
				<SortableGrid
					items={modules}
					getId={(m) => m.id}
					onReorder={setDragOrder}
					onCommit={() => {
						if (dragOrder) setModules(dragOrder);
						setDragOrder(null);
					}}
					className={`${campaignStyles.sortList} ${styles.modules}`}
					itemClassName={styles.moduleItem}
					renderItem={card}
				/>
			) : (
				<div className={styles.modules}>
					{modules.map((m) => (
						<div key={m.id} className={styles.moduleItem}>
							{card(m)}
						</div>
					))}
				</div>
			)}

			{isDM && (
				<div className={styles.addBar}>
					<div className="caps">Add to this act</div>
					<div className={styles.addTiles}>
						{MODULE_ORDER.map((t) => (
							<button
								key={t}
								type="button"
								className={`frame ${styles.addTile}`}
								data-type={t}
								onClick={() => setEditing({ module: newModule(t, campaign.gamemode), isNew: true })}
							>
								<span className={styles.addIcon}>
									<Icon name={MODULE_TYPES[t].icon} size={18} />
								</span>
								<span className="display">{MODULE_TYPES[t].label}</span>
								<span className={styles.addBlurb}>{MODULE_TYPES[t].blurb}</span>
							</button>
						))}
					</div>
				</div>
			)}

			{(prev || next) && (
				<nav className={styles.actNav} aria-label="Other acts">
					{prev ? (
						<button type="button" className={styles.actNavBtn} onClick={() => openAct(prev.id)}>
							<Icon name="back" size={14} />
							<span>
								<span className="caps">Act {roman(index)}</span>
								<span className="display">{prev.title}</span>
							</span>
						</button>
					) : (
						<span />
					)}
					{next && (
						<button type="button" className={`${styles.actNavBtn} ${styles.actNavNext}`} onClick={() => openAct(next.id)}>
							<span>
								<span className="caps">Act {roman(index + 2)}</span>
								<span className="display">{next.title}</span>
							</span>
							<Icon name="fwd" size={14} />
						</button>
					)}
				</nav>
			)}

			{isDM && (
				<>
					<ModuleEditor
						module={editing?.module ?? null}
						isNew={!!editing?.isNew}
						act={act}
						acts={acts}
						onClose={() => setEditing(null)}
						onSave={saveModule}
					/>
					<ActDetailsModal
						open={detailsOpen}
						act={act}
						campaign={campaign}
						onClose={() => setDetailsOpen(false)}
						onSave={(title, summary) => save(act.id, { title, summary: summary || null })}
					/>
				</>
			)}
		</motion.section>
	);
}
