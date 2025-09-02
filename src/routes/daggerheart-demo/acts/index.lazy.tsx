import { createLazyFileRoute } from "@tanstack/react-router";
import { BoxSection } from "../../../components/BoxSection";
import { ActBox } from "../../../components/SablewoodQuickStart/ActBox";
import { motion } from "framer-motion";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/")({
    component: Acts,
});

function Acts() {
    const acts: string[] = ["act1", "act2", "act3", "act4", "act5"];

    return (
        <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-10 gap-5">
                <h1 className="text-4xl font-bold">Sablewood</h1>
                <div className="grid h-full grid-cols-3 gap-5 px-40">
                    {acts.map((act) => (
                        <ActBox key={act} act={act} />
                    ))}
                </div>
            </BoxSection>
        </motion.main>
    );
}
