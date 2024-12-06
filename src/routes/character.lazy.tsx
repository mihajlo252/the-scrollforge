import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { CharacterProfile } from "../sections/CharacterProfile";
import { HPBar } from "../sections/HPBar/HPBar";
import { Stats } from "../sections/Stats/Stats";
import { Load } from "../components/Load";
import { Notes } from "../components/Notes";

export const Route = createLazyFileRoute("/character")({
    component: Character,
});

function Character() {
    const { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));

    if (!state.character) {
        return <Load />;
    }

    return (
        <motion.main
            className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <CharacterProfile
                primaryStats={state.character.stats.primaryStats}
                primaryMods={state.character.stats.primaryMods}
                characterProfile={state.character.characterProfile}
            />
            <section className={`flex gap-5`}>
                <BoxSection styles="w-[40%] flex flex-col gap-5 p-5">
                    <Stats saveThrows={state.character.stats.saveThrows} skills={state.character.stats.skills} />
                </BoxSection>
                <div className={`flex h-full w-[50%] flex-col gap-5`}>
                    <BoxSection styles="w-full flex justify-around items-center p-5">
                        <HPBar maxHP={state.character.stats.maxHP} characterID={state.character.id} />
                    </BoxSection>
                    <Notes />
                </div>
                <BoxSection styles="w-[10%] flex flex-col py-5">
                    <nav className="flex flex-col gap-5 p-3">
                        <Link to="/traits" className="btn btn-primary">
                            Traits
                        </Link>
                    </nav>
                </BoxSection>
            </section>
        </motion.main>
    );
}
