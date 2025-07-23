import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { Scenes } from "../../../components/SablewoodQuickStart/Scenes/Scenes";
import { Scene } from "../../../components/SablewoodQuickStart/Scenes/Scene";
import { GM } from "../../../components/SablewoodQuickStart/GM";
// import { GM } from "../../../components/SablewoodQuickStart/GM";
// import { SuccessFailCrit } from "../../../components/SablewoodQuickStart/SuccessFailCrit";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act3")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
        <h1 className="text-left text-xl font-bold">Act Three - Seeking an Arcanist [Potraga za Arcanistom]</h1>
        <section className="grid grid-cols-1">
          <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
            <h2 className="text-2xl font-bold">Dolazak u Hush</h2>
            <p>
              Put vas dalje vodi dublje u šumu dok ne ugledate jedan visoki kameni stub, na kojem su celom visinom uklesani drevni dvorfovski simboli.
              Ovo znate da pretstavlja jedan ćošak mirnog sela pod imenom Hush. Kako prodjete dalje od kamenog stuba, primetite mali osećaj poput
              pucanja mehurića, a zatim cujete zvukove prijateljskog ćaskanja i graje koji postaju sve glasniji.
            </p>
            <p>
              Iako drveće Sablewooda je ne promenjeno ovde, u vazduhu je primetan osećaj prijatnosti i bezbednosti. Par nasmejanih lica se okreću ka
              vama kako se vaša kočija kreće, mašući ili dovikivajući tople dobrodošlice ka družini. Živahna muzika dopire ka vama iz pravca taverne u
              centru grada.
            </p>
            <p>
              Znate da tražite informacije gde možete pronaći Whitefire Arcanist [Beloplamenog Arcanista] da bi mu dostavili paket koji je Kralj
              poslao. Šta želite da radite?
            </p>
            <Scenes heading={"Opcije"}>
              <Scene heading={<h4 className="text-lg font-bold">Fidget - Wildborne Human</h4>}>
                <p>
                  Malo dete koje se konstantno fidgetuje — jasno je kako je dobilo ime. Često ga viđate kako se brzo penje uz stabla po selu, paleći
                  fenjere što vise sa grana. Poznaje najbrže prečice kroz čitavo selo.
                </p>
                <GM>Ako mu se družina približi, radoznalo će ih zapitati kakav je život izvan Hush-a.</GM>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">Lausa Standworth - Wildborne Dwarf</h4>}>
                <p>
                  Starija žena s gustom bradom nosi burence piva preko ramena. Veselo stoji i razgovara s družinom (i neće ni na trenutak spustiti
                  burence).
                </p>
                <GM>Ako joj se likovi približe, odmah želi da zna ime svakog oružja koje nose — i datum kada je iskovano.</GM>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">Halython Fives - Loreborne Clank</h4>}>
                <p>
                  Blago govoreći klank (čovekoliki robot) neodređenih godina. Na njegovom metalnom ramenu vide se sitne ogrebotine, tamo gde oprezno —
                  ali prijateljski — sedi fox-bat, mala šišlica (lisica-šišmiš). U rukama drži nepoznatu igru, koja koristi karte i žireve.
                </p>
                <GM>Ako mu se likovi približe, radoznalo pita za Trnljane — da li ste naišli na neke dok ste putovali ovamo?</GM>
                <GM>
                  <p>Igra se zove Lisica ispod zemlje</p>
                </GM>
              </Scene>
            </Scenes>

            <h3 className="text-xl font-bold">The Clover Tavern</h3>
            <p>
              Krčma Detelina prizor je za pamćenje — sa šest zakrivljenih spratova koji se penju uz stablo drevnog drveta. Ovo je srce zajednice, uvek
              ispunjeno muzikom i dobronamernim razgovorima.
            </p>
            <GM>
              Svi koji prvi put ulaze u krčmu moraju da izuju cipele i okače ih na kanap koji se proteže preko prizemlja. Neizbežno, do trenutka kada
              posetioci odlaze, njihove cipele su uglancane i ispunjene sitnicama i sitnim poklonima.
            </GM>
            <p>Ulazite. Šta želite da uradite?</p>

            <GM>
              <ul className="list-disc pl-10">
                <li>Pustite igrače da se malo opuste i užive u ulogu. </li>
                <li>Upoznajte ih sa krčmarom ili nekim prijateljskim meštaninom koji ih zamoli da okače svoje cipele na kanap.</li>
                <li>
                  Dozvolite im da istražuju različite nivoe taverne. Neka opišu igrači svaki nivo. Ideje: Možda neko osmisli sobu sa visećim
                  ležaljkama, balkon s pogledom na šumu, ili tihi kutak sa pričama iz prošlosti.
                </li>
              </ul>
            </GM>
            <GM>
              Optional: Ako se raspitaju, likovi će saznati da narod Hush-a trenutno slavi Firstmoss Festival (Festival prve mahovine) — vreme kada se
              na novim usevima u Sunless Farms (Bezsunčanim Poljima) pojavi prvi sloj mahovine, što znači da su počeli da sazrevaju za ovu sezonu. To
              je proslava dolaska proleća i obilja svežeg voća i povrća koje selo uskoro očekuje. Na festivalu se održava prijateljsko takmičenje u
              obaranju ruku, radionica bojenja na kamenju, kao i mala pijaca puna ručno pravljenih sitnica i ukrasa.
            </GM>
            <GM>
              Ako nisu jos uvek pitali za Arcanista, pokazi im Halython-a u taverni kako igra svoju igru. On ce da im kaze gde se nalazi kuća
              Arcanista.
            </GM>
            <p>
              Arkanistkinja je prilično zauzeta, ali ako ste putovali ovoliko daleko, siguran sam da će vas dočekati kako dolikuje. Bez nje bismo bili
              izgubljeni. Ona štiti celo ovo mesto moćnim zaštitnom barijerom, tako da nijedna opasnost iz Sablewooda ne može proći u selo. Njena kuća
              se nalazi južno, kroz obradiva polja. Visi sa jednog od starih stabala Sablewooda — ne možete je promašiti.
            </p>
            <GM>Ako su spremni mogu da krenu tamo</GM>
            <p className="py-10 text-center text-2xl text-accent">ACT 3 END</p>
            <Link to={"/daggerheart-demo/acts/act4"} className="btn btn-primary">
              Next Act
            </Link>
          </BoxSection>
        </section>
      </BoxSection>
    </motion.main>
  );
}
