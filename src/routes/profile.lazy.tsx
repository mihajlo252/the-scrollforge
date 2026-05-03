import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { MouseEvent, useEffect, useState } from "react";
import { useCharactersStore, useCharacterStore, useUserStore } from "../zustand/stores";
import { DeletePopup } from "../components/DeletePopup";
import { CreateCharacter } from "../sections/CreateCharacter";
import { Avatar } from "../components/Avatar/Avatar";
import { Popup } from "../components/Popup/Popup";
import styles from "../routeStyles/profile.module.css";
import { Icon, RuneDivider } from "../components/Primitives";
import { activeButtonsToggle } from "../utilities/utilityFunctions";

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
	const [gameMode, setGameMode] = useState("dnd");
	const [charFilter, setCharFilter] = useState("all");

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

	const handleFilterCharacters = (e: MouseEvent, val: string) => {
		e.preventDefault();
		setCharFilter(val);
		activeButtonsToggle(e);
	};

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
					<h2 className="text-content text-primary">
						<span className="small-eyebrow">Welcome back,</span>
						{user?.user_metadata.username}
					</h2>
					<button type="button" onClick={() => setOpenCreateCharacter(true)} className="button button-primary">
						Create character
					</button>
				</section>
				<RuneDivider />
				<section className={`frame ${styles.filter}`}>
					{filters.map((filter) => (
						<button key={filter.val} className="button button-primary" onClick={(e) => handleFilterCharacters(e, filter.val)}>
							{filter.name}
						</button>
					))}
				</section>
				{noCharacters && <p className="text-xl text-accent text-left w-max">Nothing forged yet!</p>}
				<ul className={`${styles.characterList}`}>
					{characters
						.filter((character) => {
							if (charFilter === "all") return character;
							return character.gamemode === charFilter;
						})
						.map((character) => (
							<section className={`frame hoverable ${styles.characterCard}`} key={character.id}>
								<CharacterCard character={character} handleNavigateToCharacter={handleNavigateToCharacter} />
								<div className="side-by-side">
									<button className="button button-primary" onClick={() => handleNavigateToCharacter(character)}>
										Unravel
									</button>
									<button className={`button button-secondary ${styles.delete}`} onClick={() => handleDeletePopup(character)}>
										<Icon name="trash" size={14} />
									</button>
								</div>
								<DeletePopup
									toggle={isDelete}
									deleteID={characterDelete}
									setDeleteID={setCharacterDelete}
									setIsDeleted={setIsDeleted}
									setIsDelete={setIsDelete}
								/>
							</section>
						))}
				</ul>
				<Popup toggle={openCreateCharacter} closerFunc={setOpenCreateCharacter}>
					<section className={`frame column-direction ${styles.characterPopup}`}>
						<h3 style={{ textAlign: "center" }}>Choose System</h3>
						<RuneDivider />
						<div className="side-by-side">
							<button
								className="button button-primary"
								data-active={gameMode === "dnd" && "true"}
								onClick={(e) => handleGameModeToggle(e, "dnd")}
							>
								Dungeons&Dragons
							</button>
							<button
								className="button button-accent"
								data-active={gameMode === "daggerheart" && "true"}
								onClick={(e) => handleGameModeToggle(e, "daggerheart")}
							>
								Daggerheart
							</button>
						</div>
						<CreateCharacter
							openCreateCharacter={openCreateCharacter}
							setOpenCreateCharacter={setOpenCreateCharacter}
							setIsSave={setIsSave}
							gameMode={gameMode}
						/>
					</section>
				</Popup>
			</section>
		</CatchBoundary>
	);
}

const DNDCharacter = ({
	character,
	handleNavigateToCharacter,
}: {
	character: Character;
	handleNavigateToCharacter: (char: Character | DaggerheartCharacter) => void;
}) => {
	return (
		<li className="flex h-full w-full items-center gap-5" onClick={() => handleNavigateToCharacter(character)}>
			<div className="text-start">
				<p>
					{character.characterProfile.name}, {character.characterProfile.level}
				</p>
				<p>
					{character.characterProfile.race} {character.characterProfile?.subrace}, {character.characterProfile.class}{" "}
					{character.characterProfile?.subclass}
				</p>
			</div>
		</li>
	);
};

const DaggerheartCharacter = ({
	character,
	handleNavigateToCharacter,
}: {
	character: DaggerheartCharacter;
	handleNavigateToCharacter: (char: DaggerheartCharacter) => void;
}) => {
	return (
		<li className="flex h-full w-full items-center gap-5" onClick={() => handleNavigateToCharacter(character)}>
			<div className="text-start">
				<p>
					{character.name}, {character.characterProfile.level}
				</p>
				<p>
					{character.characterProfile.ancestry} {character.characterProfile.community}, {character.characterProfile.class}{" "}
					{character.characterProfile?.subclass}, {character.characterProfile?.domains}
				</p>
			</div>
		</li>
	);
};

const CharacterCard = ({
	character,
	handleNavigateToCharacter,
}: {
	character: Character | DaggerheartCharacter;
	handleNavigateToCharacter: (char: Character | DaggerheartCharacter) => void;
}) => {
	return (
		<div className={`${styles.details}`}>
			<Avatar characterName={character.name.toLowerCase()} characterClass={character.characterProfile.class}/>
			{character.gamemode === "dnd" && (
				<DNDCharacter character={character as Character} handleNavigateToCharacter={handleNavigateToCharacter} />
			)}
			{character.gamemode === "daggerheart" && (
				<DaggerheartCharacter character={character as DaggerheartCharacter} handleNavigateToCharacter={handleNavigateToCharacter} />
			)}
		</div>
	);
};
