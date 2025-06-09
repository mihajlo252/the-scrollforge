import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { CharacterProfile } from "../sections/CharacterProfile/CharacterProfile";
import { HPBar } from "../sections/HPBar/HPBar";
import { Stats } from "../sections/Stats/Stats";
import { Load } from "../components/Load";
import { Bonuses } from "../sections/Bonuses/Bonuses";
import { DiceBoxComponent } from "../components/DiceBox";
import { useEffect, useState } from "react";
import { sendData } from "../utilities/sendData";

export const Route = createLazyFileRoute("/character")({
    component: Character,
});

function Character() {
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
    const [statChange, setStatChange] = useState(false);
    const [isSave, setIsSave] = useState(false);

    if (!state.character) {
        return <Load />;
    }

    const handleSaveCharacter = async (stats: Stats) => {
        await sendData("characters", state.character.id, { stats: { ...stats }, characterProfile: { ...state.character.characterProfile } });
        setIsSave(false);
    };

    useEffect(() => {
        setStatChange(false);
        if (statChange) setIsSave(true);
    }, [statChange]);
    return (
        <motion.main className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {isSave && (
                <button
                    className="btn btn-ghost absolute top-5 m-0 h-min min-h-0 place-self-center border-2 border-accent px-4 py-2 text-accent hover:border-accent hover:bg-accent hover:text-base-100 active:-translate-x-1/2"
                    onClick={() => handleSaveCharacter(state.character.stats)}
                >
                    Save Character
                </button>
            )}
            <CharacterProfile setStatChange={setStatChange} />
            <section className={`flex gap-5`}>
                <BoxSection styles="w-[50%] flex flex-col gap-5 p-5">
                    <Stats character={state.character} setStatChange={setStatChange} />
                </BoxSection>
                <div className={`flex h-full w-[40%] flex-col gap-5`}>
                    <div className={`flex h-full w-full gap-5`}>
                        <BoxSection styles="w-[50%] flex justify-around items-center p-2">
                            <HPBar maxHP={state.character.stats.maxHP} characterID={state.character.id} />
                        </BoxSection>
                        <BoxSection styles="w-[50%] flex justify-around items-center p-5">
                            <DiceBoxComponent />
                        </BoxSection>
                    </div>
                    <BoxSection styles="w-full flex justify-around items-center p-5">
                        <Bonuses character={state.character} setStatChange={setStatChange} />
                    </BoxSection>
                </div>
                <BoxSection styles="w-[10%] flex flex-col justify-start">
                    <nav className="flex flex-col gap-3 p-3">
                        <Link to="/traits" className="btn btn-primary">
                            Traits
                        </Link>
                        <Link to="/attacks" className="btn btn-primary">
                            Attacks
                        </Link>
                        <Link to="/spells" className="btn btn-primary">
                            Spells
                        </Link>
                        <Link to="/inspiration" className="btn btn-primary">
                            Inspiration
                        </Link>

                        <Link to="/notes" className="btn btn-primary">
                            Notes
                        </Link>
                        <Link to="/chat" className="btn btn-primary">
                            Chat
                        </Link>
                    </nav>
                </BoxSection>
            </section>
        </motion.main>
    );
}
