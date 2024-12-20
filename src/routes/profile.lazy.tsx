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
        navigate({ to: "/character" });
    };

    useEffect(() => {
        handleGetCharacter();
        console.log(characters);
    }, []);

    return (
        <motion.main className={`flex h-full w-full gap-5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BoxSection styles="w-full flex flex-col items-start gap-10 p-5 overflow-y-scroll">
                <section className="flex w-full justify-between">
                    <h1 className="text-5xl text-accent">{user.user_metadata.username}</h1>
                    <a href="#" className="btn btn-primary">
                        Create Character
                    </a>
                </section>
                <ul>
                    {characters.map((character) => (
                        <li key={character.id} className="flex gap-5">
                            <div className="text-start">
                                <p>
                                    {character.characterProfile.name}, {character.characterProfile.level}
                                </p>
                                <hr />
                                <p>
                                    {character.characterProfile.class} {character.characterProfile.subclass},{" "}
                                    {character.characterProfile.race} {character.characterProfile.subrace}
                                </p>
                            </div>
                            <button className="btn btn-ghost" onClick={() => handleNavigateToCharacter(character)}>
                                Select
                            </button>
                        </li>
                    ))}
                </ul>
            </BoxSection>
        </motion.main>
    );
}
