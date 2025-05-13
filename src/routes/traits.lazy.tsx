import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trait } from "../components/Trait";
import { BoxSection } from "../components/BoxSection";
import { useState } from "react";

export const Route = createLazyFileRoute("/traits")({
    component: TraitsScreen,
});

function TraitsScreen() {
    const [description, setDescription] = useState("racialTraits");
    const changeDescription = (d: string) => {
        setDescription(d);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full h-full pb-5 flex-col text-start gap-2 pl-5">
                <div className="flex w-full gap-2 bg-base-300 pt-5">
                    <button onClick={() => changeDescription("racialTraits")} className="btn btn-ghost">
                        Racial Traits
                    </button>
                    <button onClick={() => changeDescription("featureTraits")} className="btn btn-ghost">
                        Features & Traits
                    </button>
                </div>
                <Trait description={description} />
                
            </BoxSection>
        </motion.main>
    );
}
