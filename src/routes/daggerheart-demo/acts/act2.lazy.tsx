import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { Scenes } from "../../../components/SablewoodQuickStart/Scenes/Scenes";
import { GM } from "../../../components/SablewoodQuickStart/GM";
import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";
import { Scene } from "../../../components/SablewoodQuickStart/Scenes/Scene";
import { BasicSheet } from "../../../components/SablewoodQuickStart/BasicSheet";
// import { GM } from "../../../components/SablewoodQuickStart/InstructionGM";
// import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act2")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-10 gap-5">
        <h1 className="text-4xl font-bold">Čin II - Thicket Thieves [Lopovi iz Šipražja]</h1>
        <BoxSection styles="w-full max-h-[60vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
          <h2 className="text-2xl font-bold">Posledice</h2>
          <Scenes heading={"Scene"}>
            <Scene heading={<h4 className="text-lg font-bold">Scena 1 - Pretrazuju prevrnutu kociju</h4>}>
              <p>U kocijama nema nista od nekih vrednih stvari, samo les vozaca kocija sa otkinutom rukom koju je porodica Strixvukova pojela.</p>
              <GM>Ako pretrazuju malo dublje</GM>
              <p>Vozacevo grlo je prerezano.</p>
            </Scene>
            <Scene heading={<h4 className="text-lg font-bold">Scena 2 - Napadnu Strixvuka</h4>}>
              <SuccessFailCrit
                styles=""
                success={
                  <>
                    <p className="text-primary">Success 10+</p>
                    <ul className="list-disc pl-10">
                      <li className="text-primary">Hope - dobijaju Hope. Nastavljaju svoj potez</li>
                      <li className="text-secondary">
                        Fear - ja dobijam Fear, i mogu malko da im zakomplikujem ali ipak su uspeli: Majka rikne kao da poziva nekog drugog Strixvuka,
                        znate da necete biti sami zadugo. Napada.
                      </li>
                    </ul>
                  </>
                }
                fail={
                  <>
                    <p className="text-secondary">Fail 9-</p>
                    <ul className="list-disc pl-10">
                      <li className="text-primary">
                        Hope - dobijaju Hope, malo se komplikuje jer nisu uspeli, ali ipak ne previse: Majka malo zarezi, sagne se, i mladunci joj se
                        popnu na ledja. Ona polece i slece na obliznju granu, gledajuci i prateci vas sta radite
                      </li>
                      <li className="text-secondary">
                        Fear - ja dobijam Fear, i majka krene da riče na vas, obelezite jedan Stress, i sagne se, i mladunci joj se popnu na ledja.
                        Ona polece i slece na obliznju granu, gledajuci i prateci vas sta radite
                      </li>
                    </ul>
                  </>
                }
                crit={
                  <>
                    <p className="text-accent">
                      Jedan maximum od kockica + bacanje kockica jos jednom. Automatski dobijaju Hope. Nastavljaju svoj potez
                    </p>
                  </>
                }
              >
                <p>Moraju da naprave attack roll sa tezinom 10</p>
              </SuccessFailCrit>
              <BasicSheet
                name="Strixvuk"
                tier="1 Standard"
                attacks="Bite - Melee - 1d6+3 phy"
                atkmod="+1"
                difficulty="0"
                major={4}
                severe={8}
                hp={3}
                stress={3}
                numTypes={2}
                features=""
              />
            </Scene>
            <Scene heading={<h4 className="text-lg font-bold">Scena 3 - Pokusaju da nadju tragove neceg cudnog</h4>}>
              <GM>Vide da je tocak umotan u trnovito granje koje se prozima preko staze na kojoj se nalaze.</GM>
            </Scene>
            <Scene heading={<h4 className="text-lg font-bold">Scena 4 - Pokusaju da pomere prevrnutu kociju ili pokusaju da sidju sa staze.</h4>}>
              <GM>Zaseda!</GM>
            </Scene>
          </Scenes>

          <h3 className="text-xl font-bold">Zaseda</h3>
          <GM>Kad se osecam da je dobar momenat ili ako jedna od scena gore trigeruje, onda PC koji deluje da je obazriv, pravi Instinct roll.</GM>

          <SuccessFailCrit
            success={
              <>
                <p className="text-primary">Success 14+</p>
                <ul className="list-disc pl-10">
                  <li className="text-primary">Hope - dobijaju Hope, i nastavlja se na "Vidite Da Dolaze".</li>
                  <li className="text-secondary">Fear - ja dobijam Fear, oni markuju Stress, i nastavlja se na "Vidite Da Dolaze".</li>
                </ul>
              </>
            }
            fail={
              <>
                <p className="text-secondary">Fail 13-</p>
                <ul className="list-disc pl-10">
                  <li className="text-primary">Hope - dobijaju Hope, i nastavlja se na "Zasednuti".</li>
                  <li className="text-secondary">Fear - ja dobijam Fear, oni markuju Stress, i nastavlja se na "Zasednuti".</li>
                </ul>
              </>
            }
            crit={
              <>
                <p>Crit je isti kao Succes sa Hope i mogu da clear-uju stress</p>
              </>
            }
            styles={""}
          >
            <GM>Difficulty: 14</GM>
          </SuccessFailCrit>

          <Scenes heading={"Ishod"}>
            <Scene heading={<h4 className="text-lg font-bold">Vidite Da Dolaze</h4>}>
              <p>
                Čujete zukove grana kako pucaju i kako se okrenete četiri Čičana ili Trnljana (Thistlefolk) se šunjaju kroz grmlje, u pokušaju da vas
                zaskoče. Prevrnuta kočija je bila distrakcija, ali njihov plan nije uspeo. Stavljamo mapu!
              </p>
              <p className="pt-2">Pošto ste ih ugledali na vreme, spremni ste za borbu. Vi igrate prvi, ko hoće da počne?</p>
            </Scene>
            <Scene heading={<h4 className="text-lg font-bold">Zasednuti!</h4>}>
              <p>
                U vihoru pucanja grana i šištanja izvučenog čelika, iz žbunja pored puta iskače grupa od četvoro Trnljana. Prevrnuta kočija bila je
                zaseda! Staju ispred vas, sa izvučenim oružjem, blokirajući put. Oni idu prvi. Stavljamo mapu!
              </p>
              <p className="pt-2">
                Kako imaju prednost iznenadjenja, tri Trnljana su krenuli na vas. Pošto imaju feature "Zaseda" oni mogu prvi da igraju. Ovo se desi
                kad udju u scenu, tako da se ovo nece uvek dešavati, samo su vas iznenadili. Oni mašu daggerima i imaju oklop od uglančanog kamena
              </p>
            </Scene>
          </Scenes>
          <div className="flex flex-row gap-5 py-2">
            <BasicSheet
              name="Thistlefolk Ambusher"
              hp={3}
              stress={2}
              atkmod={"+1"}
              attacks={"Dagger: Melee - 1d8 +5 phy"}
              tier={"1 Standard"}
              major={6}
              severe={12}
              difficulty={"13"}
              features={
                <p>
                  <strong>Ambush - Reaction:</strong> When the Ambusher enters the scene without being spotted first, they can immediately move into
                  Melee with a target and make an attack against them. On a success, they strike with their dagger for 2d4+8 physical damage.
                </p>
              }
              numTypes={3}
            />
            <BasicSheet
              name="Thistlefolk Thief"
              hp={4}
              stress={2}
              atkmod={"+3"}
              attacks={"Serrated Blade: Melee - 2d4+3 (phy)"}
              tier={"1 Leader"}
              major={7}
              severe={14}
              difficulty={"14"}
              features={
                <p>
                  <strong>Back Off - Action: Spend a Fear</strong> to make an attack roll against all targets within Melee range. Any they succeed
                  against are blasted backwards, dealing 2d6+3 magic damage and pushing them into Far range.
                </p>
              }
              numTypes={1}
            />
          </div>
          <GM className="pt-5">Kraj fajta. Mogu da RP ostatak puta do Hush-a.</GM>
          <p className="py-10 text-center text-2xl text-accent">ACT 2 END</p>
          <Link to={"/daggerheart-demo/acts/act3"} className="btn btn-primary">
            Next Act
          </Link>
        </BoxSection>
      </BoxSection>
    </motion.main>
  );
}
