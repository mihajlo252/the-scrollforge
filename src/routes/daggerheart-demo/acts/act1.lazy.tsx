import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { GM } from "../../../components/SablewoodQuickStart/GM";
import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act1")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
                <h1 className="text-left text-xl font-bold">Act 1 - Trgovačka Kočija</h1>
                <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
                        <h2 className="text-2xl font-bold">Početak</h2>
                        <p>
                            Ove večeri, vaša družina je konačno stigla do Sablewooda — prostrane šume džinovskih stabala za koja neki kažu da su
                            starija i od Zaboravljenih Bogova. To je mesto poznato po dve stvari: svojim uleglim stazama koje služe kao trgovački
                            putevi za mnoge putujuće trgovce, i po svojim neobičnim životinjama — hibridima jedinstvenim za ovaj kraj. Čak i sada,
                            iznutra vaše kočije, čujete neobične zvuke: niske zovove "lark-moths" ševoljaca [ševa-moljca], kreket "lemur-toads" žabaruna [lemurskih žaba], i
                            šuštanje porodice "fox-bats" šišlica [šišmiš-lisica] u žbunju pored puta. Jedan od vas upravlja kočijom. Ko je to? Drveće ovde
                            izgleda... pogrešno, na neki čudan način. Šta tačno primećujete?
                        </p>
                        <br />
                        <GM>Dodati sta god da oni kazu na sledece</GM>
                        <p>
                            Drveće u Sablewoodu je iskrivljeno na neprirodan način, kao da se povija unazad od neba iznad. Kora im je tamna,
                            izbrazdana i stalno vlažna, kao da nikad ne može da se osuši. Dugi, trnovite lijane vise sa grana poput vena, neki se
                            jedva primetno trzaju, iako vetra nema. Lišće je bolesno sivozelene boje, uvijeno ka unutra — kao da pokušava da se
                            sakrije od svetlosti. S vremena na vreme, iz samih stabala dopre tiho škripanje ili šapat — kao da šuma diše... ili
                            posmatra.
                        </p>
                        <br />
                        <p>
                            Dok vaši konji vuku kočiju kroz oštru krivinu, jedan točak se nakratko podiže od tla. Tada ugledate prevrnutu trgovačku
                            kočiju, položenu bočno preko staze, blokirajući vam prolaz. Po stazi su razbacani plodovi i povrće, delujući kao da je sve
                            ostavljeno u žurbi. Iza kočije, iz senke, izlazi Stixwolf — ogromna zver sa telom vuka, licem sove i velikim krilima koja
                            mu krase leđa. Završava sa žvakanjem svog obroka — ruke mrtvog trgovca — dok vas netremice posmatra, radoznao,
                            procenjujući da li ste prijatelji... ili pretnja. Zatim, iza njega, nespretno i oprezno izlaze dva mala mladunca, pažljivo
                            promatrajući majku. Iznutra, osećate kako se kočija naglo zaustavlja. Šta želite da uradite?
                        </p>
                        <br />
                        <GM>Neka oni malo RP, a ako neko pokusa da pridje ide sledece:</GM>
                        <br />
                        <SuccessFailCrit
                            styles=""
                            success={
                                <>
                                    <p className="text-primary">Success 10+</p>
                                    <ul className="list-disc pl-10">
                                        <li className="text-primary">Hope - dobijaju Hope</li>
                                        <li className="text-secondary">
                                            Fear - ja dobijam Fear, i mogu malko da im zakomplikujem ali ipak su uspeli: Majka rikne kao da poziva
                                            nekog drugog Stixwolfa, znate da necete biti sami zadugo. Napada.
                                        </li>
                                    </ul>
                                </>
                            }
                            fail={
                                <>
                                    <p className="text-secondary">Fail 9-</p>
                                    <ul className="list-disc pl-10">
                                        <li className="text-primary">
                                            Hope - dobijaju Hope, malo se komplikuje jer nisu uspeli, ali ipak ne previse: Majka malo zarezi, sagne
                                            se, i mladunci joj se popnu na ledja. Ona polece i slece na obliznju granu, gledajuci i prateci vas sta
                                            radite
                                        </li>
                                        <li className="text-secondary">
                                            Fear - ja dobijam Fear, i majka krene da riče na vas, obelezite jedan Stress
                                        </li>
                                    </ul>
                                </>
                            }
                            crit={<p className="text-accent">Ako je Crit, Majka polozi glavu i dok mase rep i legne ispred vas</p>}
                        >
                            <p>Bacaju kockice sa Presence. Mogu da koriste Hope da dodaju neki Experience ako mogu da uklope kako bi to izgledalo</p>
                        </SuccessFailCrit>
                        <p className="py-10 text-center text-2xl text-accent">ACT 1 END</p>
                        <Link to={"/daggerheart-demo/acts/act2"} className="btn btn-primary">
                            Next Act
                        </Link>
                </BoxSection>
            </BoxSection>
        </motion.main>
    );
}
