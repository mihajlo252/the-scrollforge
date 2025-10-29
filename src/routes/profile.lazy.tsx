import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AnimatePresence, motion } from "framer-motion";

import { MouseEvent, useEffect, useState } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { DeletePopup } from "../components/DeletePopup";
import { DeleteButton } from "../components/DeleteButton";
import { CreateCharacter } from "../sections/CreateCharacter/CreateCharacter";
import { Avatar } from "../components/Avatar";
import { DNDCharacter } from "../sections/CharacterProfile/CharacterSelect/DNDCharacter";
import { DaggerheartCharacter } from "../sections/CharacterProfile/CharacterSelect/DaggerheartCharacter";

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
  const [gameMode, setGameMode] = useState<string>(JSON.parse(JSON.stringify(localStorage.getItem("gameMode"))));

  const { user } = JSON.parse(getUserFromLocal());

  const navigate = useNavigate();

  const handleGetCharacter = () => {
    setCharacters(user.id);
  };

  const handleNavigateToCharacter = (char: Character | DaggerheartCharacter) => {
    if (gameMode === "D&D") {
      setCharacter(char as Character);
    } else {
      setCharacter(char as DaggerheartCharacter);
    }
    navigate({ to: `/character/${gameMode === "D&D" ? "dnd" : "daggerheart"}` });
  };

  const handleDeletePopup = (char: Character | DaggerheartCharacter) => {
    setCharacterDelete(char.id);
    setIsDelete(true);
  };
  const handleGameMode = (e: MouseEvent) => {
    if (gameMode === "D&D") {
      setGameMode("Daggerheart");
      localStorage.setItem("gameMode", "Daggerheart");
      (e.target as HTMLInputElement).innerText = "Dungeons&Dragons";
      (e.target as HTMLInputElement).classList.remove("btn-accent");
      (e.target as HTMLInputElement).classList.add("btn-primary");
    } else {
      setGameMode("D&D");
      localStorage.setItem("gameMode", "D&D");
      (e.target as HTMLInputElement).innerText = "Daggerheart";
      (e.target as HTMLInputElement).classList.remove("btn-primary");
      (e.target as HTMLInputElement).classList.add("btn-accent");
    }
  };

  useEffect(() => {
    handleGetCharacter();
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
        <BoxSection styles="w-full flex flex-col items-start gap-5 p-5 overflow-y-scroll relative">
          <AnimatePresence>
            {openCreateCharacter && (
              <CreateCharacter
                openCreateCharacter={openCreateCharacter}
                setOpenCreateCharacter={setOpenCreateCharacter}
                setIsSave={setIsSave}
                gameMode={gameMode}
              />
            )}
          </AnimatePresence>
          <section className="flex w-full justify-between">
            <h1 className="text-5xl text-primary">{user.user_metadata.username}</h1>
            <button className="btn btn-accent" onClick={handleGameMode}>
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
                    {gameMode === "D&D" && <DNDCharacter character={character as Character} handleNavigateToCharacter={handleNavigateToCharacter} />}
                    {gameMode === "Daggerheart" && <DaggerheartCharacter character={character as DaggerheartCharacter} handleNavigateToCharacter={handleNavigateToCharacter} />}
                    
                    <DeleteButton
                      size={60}
                      styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary"
                      event={() => handleDeletePopup(character)}
                    />
                  </motion.div>
                ))}
            </ul>
            <AnimatePresence>
              {isDelete && (
                <DeletePopup deleteID={characterDelete} setDeleteID={setCharacterDelete} setIsDeleted={setIsDeleted} setIsDelete={setIsDelete} />
              )}
            </AnimatePresence>
          </section>
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
