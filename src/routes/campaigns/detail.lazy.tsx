import { createLazyFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useUserStore, useCampaignStore, useCharacterStore, useCampaignCacheStore } from "../../zustand/stores";
import { CharacterCard } from "../../components/CharacterCard/CharacterCard";
import { Heading, Icon } from "../../components/Primitives";
import { SortableGrid } from "../../components/SortableGrid/SortableGrid";
import { getData } from "../../utilities/getData";
import {
	deleteCampaign,
	getCampaignRoster,
	getCharactersByIds,
	removeMember,
	requestJoinCampaign,
	savePartyOrder,
	setMemberStatus,
	updateCampaignChronicle,
} from "../../utilities/campaigns";
import { toast } from "../../utilities/toasterSonner";
import {
	ChronicleModal,
	DeleteCampaignModal,
	Emblems,
	EmptyGroup,
	HeroAvatar,
	JoinModal,
	Role,
	RoleChip,
	Sigil,
	SysChip,
	heroSummary,
	sortRows,
	sysOf,
	timeAgo,
} from "../../sections/Campaigns/CampaignParts";
import styles from "../../routeStyles/campaigns.module.css";

export const Route = createLazyFileRoute("/campaigns/detail")({
	component: CampaignDetail,
});

type Hero = Character | DaggerheartCharacter;

function CampaignDetail() {
	const { user } = useUserStore();
	const { campaign, setCampaign } = useCampaignStore();
	const { setCharacter, setViewOnly } = useCharacterStore();
	const navigate = useNavigate();
	const router = useRouter();
	const me = user?.id;
	const myName: string = user?.user_metadata?.username ?? "Adventurer";

	const cache = useCampaignCacheStore();
	// Start from what the hub already fetched so the page renders instantly,
	// then refresh in load().
	const fresh = !!me && cache.owner === me;
	const [roster, setRoster] = useState<CampaignCharacter[]>(() =>
		fresh && campaign ? cache.rows.filter((r) => r.campaignID === campaign.id) : [],
	);
	const [characters, setCharacters] = useState<Hero[]>(() => (fresh ? cache.heroes : []));
	const [myCharacters, setMyCharacters] = useState<Hero[]>(() => (fresh ? cache.myCharacters : []));
	const [joinOpen, setJoinOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [chronicleOpen, setChronicleOpen] = useState(false);
	// Set once the campaign is deleted; we leave the page after the delete
	// popup has faded out (navigating straight away cuts the fade short).
	const deletedRef = useRef(false);

	// Live party order while the GM drags; null = the saved order.
	const [dragOrder, setDragOrder] = useState<string[] | null>(null);
	const dragOrderRef = useRef<string[] | null>(null);
	dragOrderRef.current = dragOrder;

	const load = async () => {
		if (!campaign || !me) return;
		try {
			const [rows, mine] = await Promise.all([getCampaignRoster(campaign.id), getData("characters", me) as Promise<Hero[]>]);
			const chars = await getCharactersByIds(rows.map((r) => r.characterID));
			setRoster(rows);
			setMyCharacters(mine);
			setCharacters(chars);
			cache.mergeRoster(me, campaign.id, rows, chars);
		} catch (err) {
			console.error("Failed to load campaign roster", err);
		}
	};

	useEffect(() => {
		// No campaign selected (e.g. hard refresh) — send back to the hub.
		if (!campaign) {
			navigate({ to: "/campaigns" });
			return;
		}
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const charById = useMemo(
		() => new Map<string, Hero>([...characters, ...myCharacters].map((c) => [c.id, c] as const)),
		[characters, myCharacters],
	);
	const pending = useMemo(() => roster.filter((r) => r.status === "pending"), [roster]);
	const party = useMemo(() => {
		const accepted = sortRows(roster.filter((r) => r.status === "accepted"));
		if (!dragOrder) return accepted;
		const rank = new Map(dragOrder.map((id, i) => [id, i] as const));
		return [...accepted].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
	}, [roster, dragOrder]);
	const myRows = sortRows(roster.filter((r) => r.profileID === me));

	if (!campaign) return null;

	const isDM = campaign.dmID === me;
	const role: Role = isDM ? "dm" : myRows.some((r) => r.status === "accepted") ? "player" : myRows.length ? "pending" : null;
	const S = sysOf(campaign.gamemode);
	const seats = campaign.seats ?? 6;
	const full = party.length >= seats;
	const dmName = isDM ? myName : campaign.dmName || "Unknown";

	// GM opens a player's character in READ-ONLY mode.
	const viewCharacter = async (character: Hero) => {
		setViewOnly(true);
		setCharacter(character);
		const to = "/" + character.gamemode + "/character/";
		try {
			await router.preloadRoute({ to });
		} catch {
			/* preload best-effort */
		}
		navigate({ to });
	};

	const accept = async (row: CampaignCharacter) => {
		if (full) return toast({ style: "frame button-primary", message: "The party is full." });
		const ok = await setMemberStatus(row.id, "accepted");
		if (!ok) return toast({ style: "frame button-primary", message: "Couldn't accept the request." });
		toast({ style: "", message: "A new hero takes a seat." });
		load();
	};

	// GM dropped a hero: persist the new party order for everyone.
	const commitPartyOrder = () => {
		const ids = dragOrderRef.current;
		if (!ids) return;
		const byId = new Map(roster.map((r) => [r.id, r] as const));
		const orderedRows = ids.map((id) => byId.get(id)).filter(Boolean) as CampaignCharacter[];
		const rank = new Map(ids.map((id, i) => [id, i] as const));
		const next = roster.map((r) => (rank.has(r.id) ? { ...r, sortOrder: rank.get(r.id)! } : r));
		setRoster(next);
		setDragOrder(null);
		if (me) cache.mergeRoster(me, campaign.id, next, characters);
		savePartyOrder(orderedRows);
	};

	// GM rewrote the chronicle: update the open page and the cached hub list.
	const saveChronicle = async (description: string) => {
		const updated = await updateCampaignChronicle(campaign.id, description);
		if (!updated) {
			toast({ style: "frame button-primary", message: "Couldn't save the chronicle." });
			return false;
		}
		setCampaign(updated);
		cache.updateCampaign(updated);
		toast({ style: "", message: "Chronicle updated." });
		return true;
	};

	const destroy = async (c: Campaign) => {
		const ok = await deleteCampaign(c.id);
		if (!ok) {
			toast({ style: "frame button-primary", message: "Couldn't delete the campaign." });
			return;
		}
		cache.removeCampaign(c.id);
		deletedRef.current = true;
		setDeleteOpen(false);
		toast({ style: "", message: `${c.name} has been struck from the ledger.` });
	};

	const remove = async (row: CampaignCharacter, failMsg = "Couldn't update the campaign.") => {
		const ok = await removeMember(row.id);
		if (!ok) return toast({ style: "frame button-primary", message: failMsg });
		load();
	};

	const partyCard = (r: CampaignCharacter) => {
		const c = charById.get(r.characterID);
		if (!c) return null;
		return (
			<CharacterCard
				character={c}
				tag={r.profileID === me ? "Your hero" : null}
				onEnter={isDM ? viewCharacter : undefined}
				actionLabel="View Scroll"
				actionIcon="eye"
				footer={
					isDM ? (
						<button type="button" className={styles.quiet} onClick={() => remove(r)}>
							Remove from campaign
						</button>
					) : null
				}
			/>
		);
	};

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.root}>
			<div className={styles.cq}>
				{/* Identity (sigil + titles) and actions. Side by side on wide
				    screens; on phones the actions become a top bar (back on the
				    left, Delete on the right) above the identity block. */}
				<header className={styles.detHead}>
					<div className={styles.detIdent}>
						<Sigil campaign={campaign} className={styles.detSigil} />
						<div className={styles.detTitles}>
							<div className={`eyebrow ${styles.detEyebrow}`}>{isDM ? "Your table" : `Run by ${dmName}`}</div>
							<h1 className={`display ${styles.detH1}`}>{campaign.name}</h1>
							<div className={styles.chips} style={{ justifyContent: "flex-start" }}>
								<SysChip gamemode={campaign.gamemode} />
								{role && <RoleChip role={role} />}
							</div>
						</div>
					</div>
					<div className={styles.detActions}>
						{isDM && (
							<button
								type="button"
								className={`button button-secondary ${styles.detDelete}`}
								onClick={() => setDeleteOpen(true)}
								title="Delete campaign"
							>
								<Icon name="trash" size={14} />
								Delete
							</button>
						)}
						<button type="button" className={`button button-primary ${styles.detBack}`} onClick={() => navigate({ to: "/campaigns" })}>
							<Icon name="back" size={14} />
							Campaigns
						</button>
					</div>
					{/* {!role && (
					<button type="button" className={`button button-primary ${styles.detJoin}`} onClick={() => setJoinOpen(true)}>
						<Icon name="plus" size={15} />
						Request to Join
					</button>
				)} */}
				</header>

				<div className={styles.detGrid}>
					<aside className={styles.aside}>
						<div className={`frame ${styles.panel}`}>
							<Corners />
							<div className="card-hdr">
								<div className="card-title">Chronicle</div>
								{isDM ? (
									<button
										type="button"
										className={`button button-ghost ${styles.chronEdit}`}
										onClick={() => setChronicleOpen(true)}
										aria-label="Edit chronicle"
									>
										<Icon name="edit" size={12} />
										Edit
									</button>
								) : (
									<span style={{ color: "var(--gold-deep)" }}>
										<Icon name="scroll" size={16} />
									</span>
								)}
							</div>
							<div className={styles.chron}>
								{campaign.description ? (
									<p className={styles.chronDesc}>{campaign.description}</p>
								) : (
									<p className={`${styles.chronDesc} ${styles.muted}`}>
										No chronicle written yet.
										{isDM && (
											<>
												{" "}
												<button type="button" className={`${styles.quiet} ${styles.chronWrite}`} onClick={() => setChronicleOpen(true)}>
													Write one
												</button>
											</>
										)}
									</p>
								)}
								<dl className={styles.dl}>
									<dt className="caps">{S.dmTitle}</dt>
									<dd>
										<span className={styles.dmAv}>{dmName[0]}</span>
										{dmName}
										{isDM && <span className={`caps ${styles.you}`}>You</span>}
									</dd>
									<dt className="caps">System</dt>
									<dd>
										<SysChip gamemode={campaign.gamemode} />
										<span className={styles.sealed}>
											<Icon name="lock" size={11} />
											Sealed
										</span>
									</dd>
									<dt className="caps">Seats</dt>
									<dd>
										<Emblems party={party} charById={charById} seats={seats} size={24} />
									</dd>
								</dl>
							</div>
						</div>

						{role === "dm" && (
							<div className={`frame ${styles.panel}`}>
								<Corners />
								<div className="card-hdr">
									<div className="card-title">Pending requests</div>
									<span className={`mono ${styles.countPip}`} data-zero={pending.length ? undefined : ""}>
										{pending.length}
									</span>
								</div>
								{pending.length ? (
									<div>
										{pending.map((r) => {
											const c = charById.get(r.characterID);
											const s = c ? heroSummary(c) : null;
											return (
												<div key={r.id} className={styles.req}>
													<div className={styles.reqTop}>
														<HeroAvatar id={r.characterID} character={c} size={44} />
														<div style={{ minWidth: 0 }}>
															<div className={`display ${styles.reqName}`}>
																{s?.name ?? "Unknown hero"}
																{s?.level != null && <span className={`mono ${styles.lv}`}>LV {s.level}</span>}
															</div>
															{s && (
																<div className={styles.reqSub}>
																	{s.lineage}
																	{s.lineage && s.job && " · "}
																	<em>{s.job}</em>
																</div>
															)}
														</div>
													</div>
													<div className={styles.reqBot}>
														<span className={styles.reqFrom}>
															from <b>{r.playerName || "a player"}</b> · {timeAgo(r.created_at)}
														</span>
														<div className={styles.reqAct}>
															<button type="button" className="button button-ghost" onClick={() => remove(r)}>
																<Icon name="close" size={12} />
																Reject
															</button>
															<button
																type="button"
																className="button button-primary"
																disabled={full}
																title={full ? "The party is full" : undefined}
																onClick={() => accept(r)}
															>
																<Icon name="check" size={13} stroke={2.2} />
																Accept
															</button>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<div className={styles.reqEmpty}>
										<Icon name="hourglass" size={18} />
										<div>
											<div className="display" style={{ fontSize: 18, color: "var(--text)" }}>
												No one at the door
											</div>
											<div>New join requests will appear here for you to accept.</div>
										</div>
									</div>
								)}
							</div>
						)}

						{(role === "player" || role === "pending") && (
							<div className={`frame ${styles.panel}`}>
								<Corners />
								<div className="card-hdr">
									<div className="card-title">{myRows.length === 1 ? "Your hero" : "Your heroes"}</div>
									<span className={`mono ${styles.countPip}`} data-zero="">
										{myRows.length}
									</span>
								</div>
								<div>
									{myRows.map((row) => {
										const hero = charById.get(row.characterID);
										const s = hero ? heroSummary(hero) : null;
										const pending = row.status === "pending";
										return (
											<div key={row.id} className={styles.req}>
												<div className={styles.reqTop}>
													<HeroAvatar id={row.characterID} character={hero} size={44} />
													<div style={{ minWidth: 0, flex: 1 }}>
														<div className={`display ${styles.reqName}`}>
															{s?.name ?? "Unknown hero"}
															{s?.level != null && <span className={`mono ${styles.lv}`}>LV {s.level}</span>}
														</div>
														{s && (
															<div className={styles.reqSub}>
																{s.lineage}
																{s.lineage && s.job && " · "}
																<em>{s.job}</em>
															</div>
														)}
													</div>
													{pending ? (
														<RoleChip role="pending" />
													) : (
														<span className="chip" style={{ color: "var(--emerald)", borderColor: "var(--emerald)" }}>
															<Icon name="check" size={12} />
															Seated
														</span>
													)}
												</div>
												<button
													type="button"
													className={styles.quiet}
													style={{ margin: 0, alignSelf: "flex-end" }}
													onClick={() =>
														remove(row, pending ? "Couldn't withdraw the request." : "Couldn't leave the campaign.")
													}
												>
													{pending ? "Withdraw request" : "Leave campaign"}
												</button>
											</div>
										);
									})}
								</div>
								<div className={styles.yours}>
									<p className={styles.yoursNote}>
										{dmName} can view your seated heroes’ sheets and add items to their inventories. Pending heroes take a seat
										once accepted.
									</p>
									<button type="button" className={`button ${styles.btnSm}`} onClick={() => setJoinOpen(true)}>
										<Icon name="plus" size={13} />
										Present another hero
									</button>
								</div>
							</div>
						)}
					</aside>

					<section>
						<div className={styles.partyHd}>
							<Heading size={30} align="left">
								The Party
							</Heading>
							<span className={`mono ${styles.count}`}>
								{party.length} / {seats} seats
							</span>
						</div>
						{party.length ? (
							isDM ? (
								<SortableGrid
									animateOnMount
									items={party}
									getId={(r) => r.id}
									onReorder={(next) => setDragOrder(next.map((r) => r.id))}
									onCommit={commitPartyOrder}
									className={`${styles.sortList} ${styles.party}`}
									itemClassName={styles.partyItem}
									renderItem={(r) => partyCard(r)}
								/>
							) : (
								<div className={styles.party}>
									{party.map((r) => (
										<div key={r.id} className={styles.partyItem}>
											{partyCard(r)}
										</div>
									))}
								</div>
							)
						) : (
							<EmptyGroup
								icon="users"
								title="No heroes seated yet"
								body={
									isDM
										? "Players find this campaign in Browse. Accept a request and their hero takes a seat here."
										: "The GM hasn’t seated anyone yet."
								}
							/>
						)}
					</section>
				</div>
			</div>

			<JoinModal
				open={joinOpen}
				campaign={campaign}
				heroes={myCharacters}
				excludeIds={myRows.map((r) => r.characterID)}
				onClose={() => setJoinOpen(false)}
				onForgeHero={() => navigate({ to: "/profile" })}
				onSend={async (hero) => {
					if (!me) return false;
					try {
						await requestJoinCampaign(campaign.id, hero.id, me, myName);
						load();
						return true;
					} catch {
						return false;
					}
				}}
			/>

			{isDM && (
				<ChronicleModal
					open={chronicleOpen}
					campaign={campaign}
					onClose={() => setChronicleOpen(false)}
					onSave={saveChronicle}
				/>
			)}

			<DeleteCampaignModal
				campaign={deleteOpen ? campaign : null}
				onClose={() => setDeleteOpen(false)}
				onDelete={destroy}
				onExitComplete={() => deletedRef.current && navigate({ to: "/campaigns" })}
			/>
		</motion.section>
	);
}

const Corners = () => (
	<>
		<span className="frame-corner tl" />
		<span className="frame-corner tr" />
		<span className="frame-corner bl" />
		<span className="frame-corner br" />
	</>
);
