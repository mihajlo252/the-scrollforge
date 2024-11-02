import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { CharacterProfile } from "../sections/CharacterProfile";
import { HPBar } from "../sections/HPBar/HPBar";
import { Stats } from "../sections/Stats/Stats";
import { useEffect } from "react";
import { useCharacterStore, useUserStore } from "../zustand/stores";
import { Load } from "../components/Load";

export const Route = createLazyFileRoute("/character-profile")({
    component: Profile,
});

function Profile() {
    const { character }: CharacterStore = useCharacterStore();
    const { user } : UserStore = useUserStore();


    useEffect(() => {
        if (!user) {
            return;
        }
    }, []);

    if (!character) {
        return <Load />;
    }
    
    return (
        <motion.main
            className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <CharacterProfile
                primaryStats={character.stats.primaryStats}
                primaryMods={character.stats.primaryMods}
                characterProfile={character.characterProfile}
            />
            <section className={`flex gap-5`}>
                <BoxSection styles="w-[40%] flex flex-col gap-5 p-5">
                    <Stats saveThrows={character.stats.saveThrows} skills={character.stats.skills} />
                </BoxSection>
                <div className={`flex h-full w-[50%] flex-col gap-5`}>
                    <BoxSection styles="w-full flex justify-around items-center p-5">
                        <HPBar
                            maxHP={character.stats.maxHP}
                            currentHP={character.currentHP}
                            characterID={character.id}
                        />
                    </BoxSection>
                    <BoxSection styles="w-full p-5">a</BoxSection>
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
