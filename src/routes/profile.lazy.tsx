import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { motion } from "framer-motion";

import { useEffect } from "react";
import { useCharactersStore, useCharacterStore } from "../zustand/stores";
import { BoxSection } from "../components/BoxSection";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { ImageWithFallback } from "../components/ImageWithFallback";

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
    }, []);

    return (
        <motion.main className={`flex h-full w-full gap-5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BoxSection styles="w-full flex flex-col items-start gap-10 p-5 overflow-y-scroll">
                <section className="flex w-full justify-between">
                    <h1 className="text-5xl text-primary">{user.user_metadata.username}</h1>
                    <button
                        onClick={() => navigate({ to: "/create-character/page1" })}
                        className="btn btn-ghost border-2 border-primary text-primary hover:border-primary hover:bg-primary hover:text-base-100"
                    >
                        Create Character
                    </button>
                </section>
                <ul className="w-full text-xl">
                    {characters.map((character) => (
                        <li
                            key={character.id}
                            className="flex w-full items-center gap-5 rounded-badge border-2 border-slate-900 p-2 transition-colors hover:cursor-pointer hover:bg-slate-800"
                            onClick={() => handleNavigateToCharacter(character)}
                        >
                            <ImageWithFallback source={`https://iyfoqgbhaxcedpmuvfkr.supabase.co/storage/v1/object/public/characters/${character.characterProfile.name.toLowerCase()}.png`} alt={character.characterProfile.name} fallbackSrc={`https://iyfoqgbhaxcedpmuvfkr.supabase.co/storage/v1/object/public/characters/avatarplaceholder.png`}/>

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
                    ))}
                </ul>
            </BoxSection>
        </motion.main>
    );
}
