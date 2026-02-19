import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { DeletePopup } from "../components/DeletePopup";
import { DeleteButton } from "../components/DeleteButton";
import { CreateCharacter } from "../sections/CreateCharacter";
import { Avatar } from "../components/Avatar";
import { DNDCharacter } from "../sections/DnD/CharacterProfile/DNDCharacter";
import { DaggerheartCharacter } from "../sections/Daggerheart/CharacterProfile/DaggerheartCharacter";
import { Popup } from "../components/Popup/Popup";

export const Route = createLazyFileRoute("/profile")({
	component: Profile,
});

function Profile() {
	const { characters, setCharacters }: CharactersStore = useCharactersStore();
	const { setCharacter }: CharacterStore = useCharacterStore();
	const [isDeleted, setIsDeleted] = useState(false);
	const [characterDelete, setCharacterDelete] = useState("");
	const [openCreateCharacter, setOpenCreateCharacter] = useState(false);
	const [isSave, setIsSave] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [gameMode, setGameMode] = useState<string>(JSON.parse(JSON.stringify(localStorage.getItem("gameMode"))) ?? "dnd");
	const [noCharacters, setNoCharacters] = useState(false);
	const gameModeButton = useRef<HTMLButtonElement>(null);

	const { user } = JSON.parse(getUserFromLocal());

	const navigate = useNavigate();

	const handleGetCharacter = async () => {
		let res = await setCharacters(user.id, gameMode);
		if (res.length < 1) {
			setNoCharacters(true);
		} else {
			setNoCharacters(false);
		}
	};

	const handleNavigateToCharacter = (char: Character | DaggerheartCharacter) => {
		if (gameMode === "dnd") {
			setCharacter(char as Character);
			setGameMode("dnd");
			localStorage.setItem("gameMode", "dnd");
		} else {
			setCharacter(char as DaggerheartCharacter);
			setGameMode("daggerheart");
			localStorage.setItem("gameMode", "daggerheart");
		}
		navigate({ to: "/" + gameMode + "/character/" });
	};

	const handleDeletePopup = (char: Character | DaggerheartCharacter) => {
		setCharacterDelete(char.id);
		setIsDelete(true);
	};
	const handleGameModeToggle = (e: MouseEvent) => {
		e.preventDefault();
		if (gameMode === "dnd") {
			setGameMode("daggerheart");
		} else {
			setGameMode("dnd");
		}
	};
	const handleGameModeStart = () => {
		if (!gameModeButton.current) return;
		handleGetCharacter();
		if (gameMode === "daggerheart") {
			localStorage.setItem("gameMode", "daggerheart");
			gameModeButton.current.innerText = "Dungeons&Dragons";
			gameModeButton.current.classList.remove("button-accent");
			gameModeButton.current.classList.add("button-primary");
		} else {
			localStorage.setItem("gameMode", "dnd");
			gameModeButton.current.innerText = "Daggerheart";
			gameModeButton.current.classList.remove("button-primary");
			gameModeButton.current.classList.add("button-accent");
		}
	};

	useEffect(() => {
		handleGameModeStart();
	}, [gameMode]);

	useEffect(() => {
		if (isDeleted || isSave) {
			handleGetCharacter();
		}
		setIsDeleted(false);
		setIsSave(false);
	}, [isDeleted, isSave]);

	return (
		<CatchBoundary getResetKey={() => "reset"} onCatch={() => navigate({ to: "/" })}>
			<BoxSection classes="column-direction">
				<section className="flex w-full justify-between">
					<div className="choices">
						<h1 className="text-5xl text-primary">{user.user_metadata.username}</h1>
						<button onClick={() => setOpenCreateCharacter(true)} className="button button-primary button-ghost">
							Create character
						</button>
					</div>
					<button ref={gameModeButton} className="button button-accent " onClick={handleGameModeToggle}>
						Daggerheart
					</button>
				</section>
				<section className="flex-1 w-full overflow-y-scroll">
					{noCharacters && <p className="text-xl text-accent text-left w-max">Nothing forged yet!</p>}
					<ul className="flex w-full h-1 flex-col gap-2 text-xl">
						{characters.map((character) => (
							<BoxSection key={character.id} hoverable>
								<Avatar bucket="characters" characterName={character.name.toLowerCase()} />
								{gameMode === "dnd" && (
									<DNDCharacter character={character as Character} handleNavigateToCharacter={handleNavigateToCharacter} />
								)}
								{gameMode === "daggerheart" && (
									<DaggerheartCharacter
										character={character as DaggerheartCharacter}
										handleNavigateToCharacter={handleNavigateToCharacter}
									/>
								)}

								<DeleteButton
									size={60}
									styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary"
									event={() => handleDeletePopup(character)}
								/>
							</BoxSection>
						))}
					</ul>
					<DeletePopup
						toggle={isDelete}
						deleteID={characterDelete}
						setDeleteID={setCharacterDelete}
						setIsDeleted={setIsDeleted}
						setIsDelete={setIsDelete}
						gameMode={gameMode}
					/>
				</section>
				<Popup toggle={openCreateCharacter} closerFunc={setOpenCreateCharacter}>
					<CreateCharacter
						openCreateCharacter={openCreateCharacter}
						setOpenCreateCharacter={setOpenCreateCharacter}
						setIsSave={setIsSave}
						gameMode={gameMode}
					/>
				</Popup>
			</BoxSection>
		</CatchBoundary>
	);
}
