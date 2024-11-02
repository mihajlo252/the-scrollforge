import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCharacterStore } from "../zustand/stores";
import { Trait } from "../components/Trait";
import { BoxSection } from "../components/BoxSection";
import { useState } from "react";

export const Route = createLazyFileRoute("/traits")({
    component: TraitsScreen,
});

function TraitsScreen() {

    const { character }  : CharacterStore = useCharacterStore();
    const [description, setDescription] = useState("racialTraits");
    const changeDescription = (d: string) => {
        setDescription(d)
    }

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0">
            <div className="sticky -top-5 flex w-full gap-2 bg-base-300 pt-5">
                <button onClick={() => changeDescription("racialTraits")} className="btn btn-ghost">Racial Traits</button>
                <button onClick={() => changeDescription("featureTraits")} className="btn btn-ghost">Features & Traits</button>
            </div>
            <Trait character={character} description={description} />
            </BoxSection>
        </motion.main>
    );
};


