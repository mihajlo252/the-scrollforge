import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { Scenes } from "../../../components/SablewoodQuickStart/Scenes";
import { GM } from "../../../components/SablewoodQuickStart/GM";
import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";
import { Scene } from "../../../components/SablewoodQuickStart/Scene";
// import { GM } from "../../../components/SablewoodQuickStart/InstructionGM";
// import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act2")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-10 gap-5">
                <h1 className="text-4xl font-bold">Čin II - Thicket Thieves [Lopovi iz Šipražja] (Prvi deo)</h1>
                <section className="grid grid-cols-1">
                    <BoxSection styles="w-full max-h-[60vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
                        <h2 className="text-2xl font-bold">Posledice</h2>
                        <Scenes>
                            <Scene>
                                <h4 className="text-lg font-bold">Scena 1 - Pretrazuju prevrnutu kociju</h4>
                                <p>
                                    U kocijama nema nista od nekih vrednih stvari, samo les vozaca kocija sa otkinutom rukom koju je porodica
                                    Strixvukova pojela.
                                </p>
                                <GM>Ako pretrazuju malo dublje</GM>
                                <p>Vozacevo grlo je prerezano.</p>
                            </Scene>
                            <Scene>
                                <h4 className="text-lg font-bold">Scena 2 - Napadnu Strixvuka</h4>
                                <SuccessFailCrit
                                    styles=""
                                    success={
                                        <>
                                            <p className="text-primary">Success 10+</p>
                                            <ul className="list-disc pl-10">
                                                <li className="text-primary">Hope - dobijaju Hope. Nastavljaju svoj potez</li>
                                                <li className="text-secondary">
                                                    Fear - ja dobijam Fear, i mogu malko da im zakomplikujem ali ipak su uspeli: Majka rikne kao da
                                                    poziva nekog drugog Strixvuka, znate da necete biti sami zadugo. Napada.
                                                </li>
                                            </ul>
                                        </>
                                    }
                                    fail={
                                        <>
                                            <p className="text-secondary">Fail 9-</p>
                                            <ul className="list-disc pl-10">
                                                <li className="text-primary">
                                                    Hope - dobijaju Hope, malo se komplikuje jer nisu uspeli, ali ipak ne previse: Majka malo zarezi,
                                                    sagne se, i mladunci joj se popnu na ledja. Ona polece i slece na obliznju granu, gledajuci i
                                                    prateci vas sta radite
                                                </li>
                                                <li className="text-secondary">
                                                    Fear - ja dobijam Fear, i majka krene da riče na vas, obelezite jedan Stress, i sagne se, i
                                                    mladunci joj se popnu na ledja. Ona polece i slece na obliznju granu, gledajuci i prateci vas sta
                                                    radite
                                                </li>
                                            </ul>
                                        </>
                                    }
                                    crit={
                                        <>
                                            <p className="text-accent">
                                                Jedan maximum od kockica + bacanje kockica jos jednom. Automatski dobijaju Hope. Nastavljaju svoj
                                                potez
                                            </p>
                                        </>
                                    }
                                >
                                    <p>Moraju da naprave attack roll sa tezinom 10</p>
                                </SuccessFailCrit>
                            </Scene>
                            <Scene>
                                <h4 className="text-lg font-bold">Scena 3</h4>
                            </Scene>
                            <Scene>
                                <h4 className="text-lg font-bold">Scena 4</h4>
                            </Scene>
                        </Scenes>

                        <Link to={"/daggerheart-demo/acts/act3"} className="btn btn-primary">
                            Next Act
                        </Link>
                    </BoxSection>
                </section>
            </BoxSection>
        </motion.main>
    );
}
