import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { motion } from "framer-motion";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { DeletePopup } from "../components/DeletePopup";
import { DeleteButton } from "../components/DeleteButton";
import { CreateCharacter } from "../sections/CreateCharacter";
import { Avatar } from "../components/Avatar";
import { DNDCharacter } from "../sections/DnD/CharacterProfile/DNDCharacter";
import { DaggerheartCharacter } from "../sections/Daggerheart/CharacterProfile/DaggerheartCharacter";
import { Popup } from "../components/Popup";

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
  const gameModeButton = useRef<HTMLButtonElement>(null);

  const { user } = JSON.parse(getUserFromLocal());

  const navigate = useNavigate();

  const handleGetCharacter = () => {
    setCharacters(user.id);
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
    if (gameMode === "dnd") {
      setGameMode("daggerheart");
      localStorage.setItem("gameMode", "daggerheart");
      (e.target as HTMLInputElement).innerText = "Dungeons&Dragons";
      (e.target as HTMLInputElement).classList.remove("btn-accent");
      (e.target as HTMLInputElement).classList.add("btn-primary");
    } else {
      setGameMode("dnd");
      localStorage.setItem("gameMode", "dnd");
      (e.target as HTMLInputElement).innerText = "Daggerheart";
      (e.target as HTMLInputElement).classList.remove("btn-primary");
      (e.target as HTMLInputElement).classList.add("btn-accent");
    }
  };
  const handleGameModeStart = () => {
    if (!gameModeButton.current) return;
    if (gameMode === "daggerheart") {
      gameModeButton.current.innerText = "Dungeons&Dragons";
      gameModeButton.current.classList.remove("btn-accent");
      gameModeButton.current.classList.add("btn-primary");
    } else {
      gameModeButton.current.innerText = "Daggerheart";
      gameModeButton.current.classList.remove("btn-primary");
      gameModeButton.current.classList.add("btn-accent");
    }
  };

  useEffect(() => {
    handleGetCharacter();
    handleGameModeStart();
  }, []);

  useEffect(() => {
    if (isDeleted || isSave) {
      handleGetCharacter();
    }
    setIsDeleted(false);
    setIsSave(false);
  }, [isDeleted, isSave]);

  return (
    <CatchBoundary getResetKey={() => "reset"} onCatch={() => navigate({ to: "/" })}>
      <motion.main className={`flex h-full w-full gap-5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <BoxSection styles="w-full flex flex-col items-start gap-5 p-5 relative">
          <section className="flex w-full justify-between">
            <h1 className="text-5xl text-primary">{user.user_metadata.username}</h1>
            <button ref={gameModeButton} className="btn btn-accent" onClick={handleGameModeToggle}>
              Daggerheart
            </button>
          </section>
          <section className=" h-full w-full overflow-y-scroll">
            <ul className="flex w-full h-1 flex-col gap-2 text-xl">
              {characters.filter((a: any) => a.gamemode === gameMode).length === 0 && (
                <p className="text-xl text-accent text-left w-max">Nothing forged yet!</p>
              )}
              {characters
                .filter((a: any) => a.gamemode === gameMode)
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((character) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
                    key={character.id}
                    className="relative flex w-full items-center gap-5 rounded-badge border-2 border-slate-900 p-2 transition-colors hover:cursor-pointer hover:bg-slate-800"
                  >
                    <Avatar bucket="characters" characterName={character.characterProfile.name.toLowerCase()} />
                    {gameMode === "dnd" && <DNDCharacter character={character as Character} handleNavigateToCharacter={handleNavigateToCharacter} />}
                    {gameMode === "daggerheart" && (
                      <DaggerheartCharacter character={character as DaggerheartCharacter} handleNavigateToCharacter={handleNavigateToCharacter} />
                    )}

                    <DeleteButton
                      size={60}
                      styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary"
                      event={() => handleDeletePopup(character)}
                    />
                  </motion.div>
                ))}
            </ul>
            <DeletePopup
              toggle={isDelete}
              deleteID={characterDelete}
              setDeleteID={setCharacterDelete}
              setIsDeleted={setIsDeleted}
              setIsDelete={setIsDelete}
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
          <button
            onClick={() => setOpenCreateCharacter(true)}
            className="btn btn-ghost btn-circle place-self-center border-2 border-primary text-primary hover:border-primary hover:bg-primary hover:text-base-100 hover:scale-[1.1]"
          >
            +
          </button>
        </BoxSection>
      </motion.main>
    </CatchBoundary>
  );
}
