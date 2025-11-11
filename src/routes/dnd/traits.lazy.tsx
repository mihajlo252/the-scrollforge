import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trait } from "../../sections/DnDSections&Components/Trait";
import { BoxSection } from "../../components/BoxSection";
import { useState } from "react";

export const Route = createLazyFileRoute("/dnd/traits")({
    component: TraitsScreen,
});

function TraitsScreen() {
    const [description, setDescription] = useState("racialTraits");
    
    const [edit, setEdit] = useState(false);
    const changeDescription = (d: string) => {
        setDescription(d);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles=" relative w-full h-full pb-5 flex-col text-start gap-2 pl-5">
                <div className="flex w-full gap-2 bg-base-300 pt-5">
                    <button onClick={() => changeDescription("racialTraits")} className="btn btn-ghost">
                        Racial Traits
                    </button>
                    <button onClick={() => changeDescription("featureTraits")} className="btn btn-ghost">
                        Features & Traits
                    </button>
                    <button className="btn btn-accent absolute right-5 top-5" onClick={() => setEdit(true)} type="button">
                        Edit
                    </button>
                </div>
                <Trait setEdit={setEdit} edit={edit} description={description} />
            </BoxSection>
        </motion.main>
    );
}
