import { CatchBoundary, createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { DeletePopup } from "../components/DeletePopup";
import { DeleteButton } from "../components/DeleteButton";
import { CreateCharacter } from "../sections/CreateCharacter/CreateCharacter";
import { Avatar } from "../components/Avatar";

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

    const { user } = JSON.parse(getUserFromLocal());

    const navigate = useNavigate();

    const handleGetCharacter = () => {
        setCharacters(user.id);
    };

    const handleNavigateToCharacter = (char: Character) => {
        setCharacter(char);
        navigate({ to: "/character" });
    };

    const handleDeletePopup = (char: Character) => {
        setCharacterDelete(char.id);
        setIsDelete(true);
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
                <BoxSection styles="w-full flex flex-col items-start gap-10 p-5 overflow-y-scroll relative">
                    <AnimatePresence>
                        {openCreateCharacter && (
                            <CreateCharacter
                                openCreateCharacter={openCreateCharacter}
                                setOpenCreateCharacter={setOpenCreateCharacter}
                                setIsSave={setIsSave}
                            />
                        )}
                    </AnimatePresence>
                    <section className="flex w-full justify-between">
                        <h1 className="text-5xl text-primary">{user.user_metadata.username}</h1>
                        <button
                            onClick={() => setOpenCreateCharacter(true)}
                            className="btn btn-ghost border-2 border-primary text-primary hover:border-primary hover:bg-primary hover:text-base-100"
                        >
                            Create Character
                        </button>
                    </section>
                    <ul className="flex w-full flex-col gap-2 text-xl">
                        {characters.map((character) => (
                            <div
                                key={character.id}
                                className="relative flex w-full items-center gap-5 rounded-badge border-2 border-slate-900 p-2 transition-colors hover:cursor-pointer hover:bg-slate-800"
                            >
                                <Avatar bucket="characters" characterName={character.characterProfile.name.toLowerCase()} />
                                <li className="flex h-full w-full items-center gap-5" onClick={() => handleNavigateToCharacter(character)}>
                                    <div className="text-start">
                                        <p>
                                            {character.characterProfile.name}, {character.characterProfile.level}
                                        </p>
                                        <div className="h-[.5px] w-full bg-neutral"></div>
                                        <p>
                                            {character.characterProfile.race} {character.characterProfile?.subrace},{" "}
                                            {character.characterProfile.class} {character.characterProfile?.subclass}
                                        </p>
                                    </div>
                                </li>
                                <DeleteButton
                                    size={60}
                                    styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary"
                                    event={() => handleDeletePopup(character)}
                                />
                            </div>
                        ))}
                    </ul>
                    <AnimatePresence>
                        {isDelete && (
                            <DeletePopup deleteID={characterDelete} setDeleteID={setCharacterDelete} setIsDeleted={setIsDeleted} setIsDelete={setIsDelete} />
                        )}
                    </AnimatePresence>
                </BoxSection>
            </motion.main>
        </CatchBoundary>
    );
}
