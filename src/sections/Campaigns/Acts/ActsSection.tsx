import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heading, Icon } from "../../../components/Primitives";
import { SortableGrid } from "../../../components/SortableGrid/SortableGrid";
import { useCampaignStore } from "../../../zustand/stores";
import { EmptyGroup } from "../CampaignParts";
import { ActDetailsModal } from "./ModuleEditor";
import { MODULE_ORDER, MODULE_TYPES, roman } from "./actHelpers";
import { useCampaignActs } from "./useCampaignActs";
import campaignStyles from "../../../routeStyles/campaigns.module.css";
import styles from "./Acts.module.css";

/* "The Story" on the campaign page: the GM's acts (reorderable, with a New Act
 * button), or for players just the acts the GM has revealed. */
export const ActsSection = ({ campaign, isDM, canRead }: { campaign: Campaign; isDM: boolean; canRead: boolean }) => {
	const navigate = useNavigate();
	const { setActID } = useCampaignStore();
	const { acts, isLoading, add, reorder } = useCampaignActs(canRead ? campaign.id : undefined, isDM);
	const [createOpen, setCreateOpen] = useState(false);
	// Live order while the GM drags; null = the saved order.
	const [dragOrder, setDragOrder] = useState<CampaignAct[] | null>(null);

	const openAct = (id: string) => {
		setActID(id);
		navigate({ to: "/campaigns/act" });
	};

	// Players with nothing revealed (or not seated yet) don't see the section.
	if (!canRead || (!isDM && !acts.length)) return null;

	const shown = dragOrder ?? acts;

	return (
		<section className={styles.storySection}>
			<div className={campaignStyles.partyHd}>
				<Heading size={30} align="left">
					The Story
				</Heading>
				{isDM && (
					<button type="button" className={`button button-primary ${campaignStyles.btnSm}`} onClick={() => setCreateOpen(true)}>
						<Icon name="plus" size={13} />
						New Act
					</button>
				)}
			</div>

			{isDM && !isLoading && !acts.length ? (
				<EmptyGroup
					icon="book"
					title="No acts written yet"
					body="Plan the story ahead of play: write each act as story, the choices the party might face, adversaries and encounters. Players only see what you reveal."
				/>
			) : isDM ? (
				<SortableGrid
					animateOnMount
					items={shown}
					getId={(a) => a.id}
					onReorder={setDragOrder}
					onCommit={() => {
						if (dragOrder) reorder(dragOrder);
						setDragOrder(null);
					}}
					className={`${campaignStyles.sortList} ${styles.acts}`}
					itemClassName={styles.actItem}
					renderItem={(a) => <ActCard act={a} index={shown.indexOf(a)} isDM onOpen={() => openAct(a.id)} />}
				/>
			) : (
				<div className={styles.acts}>
					{acts.map((a, i) => (
						<div key={a.id} className={styles.actItem}>
							<ActCard act={a} index={i} isDM={false} onOpen={() => openAct(a.id)} />
						</div>
					))}
				</div>
			)}

			{isDM && (
				<ActDetailsModal
					open={createOpen}
					act={null}
					campaign={campaign}
					onClose={() => setCreateOpen(false)}
					onSave={async (title, summary) => {
						const act = await add(title, summary);
						if (act) openAct(act.id);
						return !!act;
					}}
				/>
			)}
		</section>
	);
};

const ActCard = ({ act, index, isDM, onOpen }: { act: CampaignAct; index: number; isDM: boolean; onOpen: () => void }) => {
	const counts = MODULE_ORDER.map((t) => ({ t, n: act.modules.filter((m) => m.type === t).length })).filter((c) => c.n);
	return (
		<article className={`frame ${styles.actCard}`} data-sortable={isDM ? "" : undefined}>
			<button type="button" className={styles.actOpen} onClick={onOpen}>
				<span className={`eyebrow ${styles.actNum}`}>Act {roman(index + 1)}</span>
				<span className={`display ${styles.actTitle}`}>{act.title}</span>
				{act.summary && <span className={styles.actSummary}>{act.summary}</span>}
			</button>
			{isDM && (
				<div className={styles.actFoot}>
					<span className={styles.actCounts}>
						{counts.length
							? counts.map(({ t, n }) => (
									<span key={t} title={`${n} ${MODULE_TYPES[t].label}${n === 1 ? "" : "s"}`}>
										<Icon name={MODULE_TYPES[t].icon} size={12} />
										<span className="mono">{n}</span>
									</span>
								))
							: "Empty"}
					</span>
					<span className={`chip ${styles.revealChip}`} data-on={act.revealed ? "" : undefined}>
						<Icon name={act.revealed ? "eye" : "lock"} size={12} />
						{act.revealed ? "Revealed" : "Hidden"}
					</span>
				</div>
			)}
		</article>
	);
};
