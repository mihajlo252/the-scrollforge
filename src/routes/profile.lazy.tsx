import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { MouseEvent, useEffect, useState } from "react";
import { useCharactersStore, useCharacterStore, useUserStore } from "../zustand/stores";
import { DeletePopup } from "../components/DeletePopup";
import { CreateCharacter } from "../sections/CreateCharacter";
import { Avatar } from "../components/Avatar/Avatar";
import { Popup } from "../components/Popup/Popup";
import { HPBar, Icon, RuneDivider } from "../components/Primitives";
import { activeButtonsToggle, getRandomGreeting } from "../utilities/utilityFunctions";
import { motion } from "framer-motion";
import DaggerheartClasses from "../daggerheart-config/classes.json";

import styles from "../routeStyles/profile.module.css";

export const Route = createLazyFileRoute("/profile")({
	component: Profile,
});

const filters = [
	{ name: "All", val: "all" },
	{ name: "Daggerheart", val: "daggerheart" },
	{ name: "Dungeons&Dragons", val: "dnd" },
];

function Profile() {
	const { user } = useUserStore();
	const { characters, setCharacters }: CharactersStore = useCharactersStore();
	const { setCharacter }: CharacterStore = useCharacterStore();
	const [isDeleted, setIsDeleted] = useState(false);
	const [characterDelete, setCharacterDelete] = useState("");
	const [openCreateCharacter, setOpenCreateCharacter] = useState(false);
	const [isSave, setIsSave] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [noCharacters, setNoCharacters] = useState(false);
	const [gameMode, setGameMode] = useState("");
	const [characterFilter, setCharacterFilter] = useState("all");
	const [greeting] = useState(() => getRandomGreeting());

	const navigate = useNavigate();

	const handleGetCharacter = async () => {
		if (!user) return;
		let res = await setCharacters(user!.id);
		if (res.length < 1) {
			setNoCharacters(true);
		} else {
			setNoCharacters(false);
		}
	};

	const handleNavigateToCharacter = (char: Character | DaggerheartCharacter) => {
		if (char.gamemode === "dnd") {
			setCharacter(char as Character);
		} else {
			setCharacter(char as DaggerheartCharacter);
		}
		navigate({ to: "/" + char.gamemode + "/character/" });
	};

	const handleDeletePopup = (char: Character | DaggerheartCharacter) => {
		setCharacterDelete(char.id);
		setIsDelete(true);
	};
	const handleGameModeToggle = (e: MouseEvent, gm: string) => {
		e.preventDefault();
		activeButtonsToggle(e);
		setGameMode(gm);
	};

	const countFor = (val: string) => (val === "all" ? characters.length : characters.filter((c) => c.gamemode === val).length);

	useEffect(() => {
		if (isDeleted || isSave) {
			handleGetCharacter();
		}
		setIsDeleted(false);
		setIsSave(false);
	}, [isDeleted, isSave]);

	useEffect(() => {
		handleGetCharacter();
	}, []);

	return (
		<CatchBoundary getResetKey={() => "reset"} onCatch={() => navigate({ to: "/" })}>
			<section className="column-direction stretch">
				<section className="side-by-side apart">
					<h1 className="text-content text-primary title">
						<span className="eyebrow">{greeting}</span>
						{user?.user_metadata.username}
					</h1>
					<button type="button" onClick={() => setOpenCreateCharacter(true)} className="button button-primary">
						<Icon name="plus" size={16} /> Forge New Hero
					</button>
				</section>
				<RuneDivider />
				<div className={`tabs ${styles.filter}`}>
					{filters.map((filter) => (
						<button
							key={filter.val}
							className="tab"
							data-active={characterFilter === filter.val}
							onClick={() => setCharacterFilter(filter.val)}
						>
							{filter.name}
							<span className="mono" style={{ opacity: 0.6 }}>
								{countFor(filter.val)}
							</span>
						</button>
					))}
				</div>
				{noCharacters && <p className="text-content text-accent">Nothing forged yet!</p>}
				<ul className={`${styles.characterList}`}>
					{characters
						.filter((character) => {
							if (characterFilter === "all") return character;
							return character.gamemode === characterFilter;
						})
						.map((character) => (
							<CharacterCard
								key={character.id}
								character={character}
								onEnter={handleNavigateToCharacter}
								onDelete={handleDeletePopup}
							/>
						))}
				</ul>
				<DeletePopup
					toggle={isDelete}
					deleteID={characterDelete}
					setDeleteID={setCharacterDelete}
					setIsDeleted={setIsDeleted}
					setIsDelete={setIsDelete}
				/>
				<Popup toggle={openCreateCharacter} closerFunc={setOpenCreateCharacter}>
					<>
						{gameMode === "" ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
								className="frame full column-direction"
							>
								<span className="frame-corner tl" />
								<span className="frame-corner tr" />
								<span className="frame-corner bl" />
								<span className="frame-corner br" />
								<h2 style={{ textAlign: "center" }}>Choose a system</h2>
								<div className="side-by-side">
									<button className="button button-primary" onClick={(e) => handleGameModeToggle(e, "dnd")} autoFocus>
										Dungeons&Dragons
									</button>
									<button className="button button-accent" onClick={(e) => handleGameModeToggle(e, "daggerheart")}>
										Daggerheart
									</button>
								</div>
							</motion.div>
						) : (
							<CreateCharacter
								openCreateCharacter={openCreateCharacter}
								setOpenCreateCharacter={setOpenCreateCharacter}
								setIsSave={setIsSave}
								gameMode={gameMode}
								setGameMode={setGameMode}
							/>
						)}
					</>
				</Popup>
			</section>
		</CatchBoundary>
	);
}

const CharacterCard = ({
	character,
	onEnter,
	onDelete,
}: {
	character: Character | DaggerheartCharacter;
	onEnter: (char: Character | DaggerheartCharacter) => void;
	onDelete: (char: Character | DaggerheartCharacter) => void;
}) => {
	const isDnd = character.gamemode === "dnd";
	const profile: any = character.characterProfile;
	const name = profile?.name ?? (character as any).name;
	const level = profile?.level;

	const lineage = isDnd
		? [profile?.race, profile?.subrace].filter(Boolean).join(" ")
		: [profile?.ancestry, profile?.community].filter(Boolean).join(" ");
	const job = [profile?.class, profile?.subclass].filter(Boolean).join(" ");

	const dhMaxHP = !isDnd
		? (DaggerheartClasses as any[]).find((c) => c.name === (profile?.class ?? "").toUpperCase())?.startingHitPoints
		: undefined;
	const maxHP = isDnd ? (character as any).stats?.maxHP : dhMaxHP;
	// Daggerheart HP marks aren't persisted, so show the character at full HP.
	const currentHP = isDnd ? (character as any).currentHP : dhMaxHP;
	const hasHP = typeof maxHP === "number" && maxHP > 0;

	return (
		<li className={styles.characterCard}>
			<article className="frame hoverable">
				<span className="frame-corner tl" />
				<span className="frame-corner tr" />
				<span className="frame-corner bl" />
				<span className="frame-corner br" />

				<div className={styles.portrait} onClick={() => onEnter(character)}>
					<Avatar characterClass={profile?.class ?? ""} gameMode={character.gamemode} />
					<span className={`chip ${isDnd ? "chip-gold" : "chip-arcane"} ${styles.sysChip}`}>{isDnd ? "D&D" : "Daggerheart"}</span>
				</div>

				<div className={styles.cardBody}>
					<div className={styles.cardHead}>
						<span className="display" style={{ fontSize: "1.5rem", lineHeight: 1.05 }}>
							{name}
						</span>
						{level != null && (
							<span className="mono" style={{ color: "var(--gold-2)", fontSize: "0.85rem" }}>
								LV <span style={{ fontSize: "1.15rem" }}>{level}</span>
							</span>
						)}
					</div>
					<div className={styles.meta}>
						{lineage && <div>{lineage}</div>}
						{job && <div className={styles.metaSub}>{job}</div>}
					</div>

					{hasHP && (
						<div className={styles.hpBlock}>
							<div className={styles.hpRow}>
								<span className="caps">Hit Points</span>
								<span className="mono" style={{ color: "var(--text)" }}>
									{currentHP ?? maxHP} / {maxHP}
								</span>
							</div>
							<HPBar cur={currentHP ?? maxHP} max={maxHP} temp={0} />
						</div>
					)}

					<div className={styles.actions}>
						<button className="button stretch" onClick={() => onEnter(character)}>
							Open Scroll
						</button>
						<button className={`button button-secondary ${styles.delete}`} onClick={() => onDelete(character)}>
							<Icon name="trash" size={14} />
						</button>
					</div>
				</div>
			</article>
		</li>
	);
};
