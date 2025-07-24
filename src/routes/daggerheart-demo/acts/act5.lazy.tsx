import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { GM } from "../../../components/SablewoodQuickStart/GM";
import { Scenes } from "../../../components/SablewoodQuickStart/Scenes/Scenes";
import { Scene } from "../../../components/SablewoodQuickStart/Scenes/Scene";
import { BasicSheet } from "../../../components/SablewoodQuickStart/BasicSheet";
// import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act5")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
        <header className="flex justify-between">
          <h1 className="text-left text-xl font-bold">Act 5 - The Ward Renewal [Obnova Zaštitne Magije]</h1>
        </header>
        <section className="grid grid-cols-1">
          <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
            <h2 className="text-2xl font-bold">The Whitefire Arcanist [Beloplameni Arcanist]</h2>
            <p>
              Po direkcijama Arkanistkinje, vaša kočija ulazi u misterioznu čistinu u obliku savršenog kruga, jedini deo Sablewooda kojem drveće ne
              zaklanja nebo. Ovo je Open Vale (Otvorena Dolina)
            </p>
            <GM>Sledece prica Arkanistkinja</GM>
            <p>
              Otvorena Dolina je mesto koje se koristi za jaku ritualnu magiju. To je mesto gde sam ja stvorila zaštitne stubove koji stoje na sva
              četiri ćoška Hush-a, i čine selo bezbednim. Bilo je gusto, i zamalo sam poginula tokom rituala. Uhh, ne bih pričala dalje o ovome, ne
              bih da me čuju.
            </p>
            <GM>Daj im neke odgovore na pitanja ali nemoj previše da pričaš o ritualu</GM>
            <p>
              Arkanistkinjina antene se trznu na uznemirujuć način. „Dobro je. Stanite, stanite. Da, ovde. Sada dođite da mi pomognete, stara sam.“
              Ovog puta, rasklapa kočiju kao što je učinila sa svojom kućom i staje iznad sanduka, tiho mrmljajući. Njeno telo počinje da svetluca
              jače, trepereći u noći. „Trebaće mi sat vremena da se pripremim. Vi, uživajte u noćnom vazduhu dok još možete. Uskoro ćemo biti veoma
              zauzeti.“
            </p>

            <h2 className="text-2xl font-bold">Short Rest</h2>
            <GM>Tokom short resta PCs mogu da biraju do dve akcije</GM>
            <Scenes heading={"Akcije"}>
              <Scene heading={<h4 className="text-lg font-bold">TEND TO WOUNDS</h4>}>
                <GM>Describe how you patch yourself up and clear 1d4+1 hit points. You may also tend to an ally instead.</GM>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">CLEAR STRESS</h4>}>
                <GM>Describe how you blow off steam or pull yourself together, and clear 1d4+1 Stress.</GM>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">REPAIR ARMOR</h4>}>
                <GM>
                  Describe how you spend time quickly repairing your armor and clear 1d4+1 marked Armor Slots. You may also repair an ally’s armor
                  instead.
                </GM>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">PREPARE</h4>}>
                <GM>
                  Describe how you prepare yourself for the path ahead and gain a Hope. If you choose to Prepare with one or more members of your
                  party, you may each take two Hope.
                </GM>
              </Scene>
            </Scenes>
            {/* <SuccessFailCrit
              success={
                <>
                  <p className="text-primary">Success 10+</p>
                  <ul className="list-disc pl-10">
                    <li className="text-primary">Hope - dobijaju Hope</li>
                    <li className="text-secondary">Fear - ja dobijam Fear, i oni obeleze stress, ali ih vide svakako</li>
                  </ul>
                </>
              }
              fail={
                <>
                  <p className="text-secondary">Fail 9-</p>
                  <ul className="list-disc pl-10">
                    <li className="text-primary">Hope - dobijaju Hope. Ne vide ih</li>
                    <li className="text-secondary">Fear - ja dobijam Fear, beleze stres i ne vide ih</li>
                  </ul>
                </>
              }
              crit={
                <p className="text-accent">
                  Ako je Crit, Taj PC dobija Hope i Advantage (dodaje 1d6) na prvi hit ako odluci odmah da udari i clear-uje jedan stress ako ga ima
                </p>
              }
              styles="gap-5"
            >
              <GM>
                Tokom short resta jedan PC moze da nadgleda situaciju, time baca kockice i ako je više od 10 success i vidi skeletone kako dolaze.
              </GM>
            </SuccessFailCrit> */}
            <p>
              Arkanistkinja ispusti prodoran krik. „Keystone je konačno reagovao! Brzo, okružite me — ritual mora da počne ili ću izgubiti put!
              Požurite!“ Njeno telo počinje da sija sve jače i jače, dok joj se oči prevrću unazad u glavi, a cela kočija se podiže stopu uvis. Iz
              šume odjekuju jezivi, neljudski krikovi — stvorenja iz Sablewooda su osetila prisustvo snažne magije.
            </p>
            <GM>Postavi Arkanistkinju i drveće šume, nek oni postave svoje likove gde se nalaze</GM>
            <p>
              Osećate podrhtavanje tla dok se četiri ancient skeletona izdižu iz zemlje, sa zarđalim mačevima u rukama — uznemireni silama magije koje
              Arkanistkinja koristi. U daljini, dve Šumske Utvare (Forest Wraiths) lebde prema vama, tiho i zlokobno. Započinjem odbrojavanje za ritual. Vaš zadatak
              je jasan: zadržite neprijatelje dok Arkanistkinja ne završi svoje delo.
            </p>
            <GM>
              Kad fajt počne kreće timer za kraj encountera, stavi d8 kao timer i smanjuje se za 1 svaki put kad jedan enemy umre ili udare
              Arkanistkinju
            </GM>
            <BasicSheet
              name="Vengeance of the Vale"
              tier="1"
              type="Exploration"
              features={
                <p>
                  <strong>Vengeance of the Vale - Action:</strong> Spend a Fear to summon two additional ancient skeletons from the ground within very
                  close range of a PC.
                </p>
              }
            />
            <div className="flex flex-row gap-5 py-2">
              <BasicSheet
                name="Ancient Skeleton"
                tier="1 Standard"
                attacks="Rusted Sword: Melee - 1d6+1 phy"
                atkmod="+0"
                difficulty="12"
                major={7}
                severe={null}
                hp={2}
                stress={1}
                numTypes={4}
                features={
                  <p>
                    <strong>Group Attack - Action: Spend a Fear</strong> to choose a target and spotlight all Ancient Skeletons within Close range of
                    them. Those creatures move into Melee range of the target and make one shared attack roll. On a success, they deal 4 physical
                    damage each. Combine this damage.
                  </p>
                }
              />
              <BasicSheet
                name="Forest Wraith"
                tier="1 Bruisers"
                attacks="Lifedrain - Far - 2d6+8 mag"
                atkmod="+3"
                difficulty="13"
                major={7}
                severe={14}
                hp={6}
                stress={3}
                numTypes={2}
                features={
                  <p>
                    <strong>Group Attack - Action: Spend a Fear</strong> to choose a target and spotlight all Ancient Skeletons within Close range of
                    them. Those creatures move into Melee range of the target and make one shared attack roll. On a success, they deal 4 physical
                    damage each. Combine this damage.
                  </p>
                }
              />
            </div>
            <GM>Kad counter dodje do 0, kreće epilogue</GM>
            <p className="py-10 text-center text-2xl text-accent">ACT 5 END</p>
            <Link to={"/daggerheart-demo/acts/epilogue"} className="btn btn-primary">
              Epilogue
            </Link>
          </BoxSection>
        </section>
      </BoxSection>
    </motion.main>
  );
}
