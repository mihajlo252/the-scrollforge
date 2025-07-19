import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { InstructionGM } from "../../../components/SablewoodQuickStart/InstructionGM";
import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act2")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-10 gap-5">
                <h1 className="text-4xl font-bold">Čin II - Thicket Thieves [Lopovi iz Šipražja] (Prvi deo)</h1>
                <section className="grid grid-cols-1">
                    <BoxSection styles="w-full h-[60vh] overflow-scroll flex flex-col text-start px-5 py-10 gap-2">
                            <h2 className="text-2xl font-bold">Posledice</h2>
                            
                            <Link to={"/daggerheart-demo/acts/act3"} className="btn btn-primary">Next Act</Link>
                    </BoxSection>
                </section>
            </BoxSection>
        </motion.main>
    );
}
