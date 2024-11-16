import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { motion } from "framer-motion";

import { useEffect } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";

export const Route = createLazyFileRoute("/profile")({
    component: Profile,
});

function Profile() {
    const { characters, setCharacters }: CharactersStore = useCharactersStore();
    const { setCharacter }: CharacterStore = useCharacterStore();

    const { user } = JSON.parse(getUserFromLocal());

    const navigate = useNavigate();

    const handleGetCharacter = () => {
        setCharacters(user.id);
    };

    const handleNavigateToCharacter = (char: Character) => {
        setCharacter(char);
        navigate({to: "/character"})
    };

    useEffect(() => {
        handleGetCharacter();
        console.log(characters);
    }, []);

    return (
        <motion.main
            className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <BoxSection styles="w-full flex flex-col gap-5 p-5">
                <h1>{user.email} - Characters</h1>
                <ul>
                    {characters.map((character) => (
                        <li key={character.id}>
                            <button className="btn btn-ghost" onClick={() => handleNavigateToCharacter(character)}>
                            {character.characterProfile.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </BoxSection>
        </motion.main>
    );
}
