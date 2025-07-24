import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { Scenes } from "../../../components/SablewoodQuickStart/Scenes/Scenes";
import { Scene } from "../../../components/SablewoodQuickStart/Scenes/Scene";
import { GM } from "../../../components/SablewoodQuickStart/GM";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act4")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
        <header className="flex justify-between">
          <h1 className="text-left text-xl font-bold">Act 4 - The Treehouse [Kućica na Drvetu]</h1>
        </header>
        <section className="grid grid-cols-1">
          <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
            <h2 className="text-2xl font-bold">The Whitefire Arcanist [Beloplameni Arcanist]</h2>
            <p>
              Dok prolazite pored kuća u selu, a zatim kroz obradiva polja Hush-a, ugledate razne useve čiji plodovi i povrće počinju da bivaju
              prekriveni tankim slojem svetlucave plave mahovine. Mahovina pulsira blagim ritmom, poput otkucaja srca, dok prolazite pored njih. Među
              bujnim gajevima, primećujete da stabla Sablewooda u ovom kraju imaju stotine jedinstvenih lica urezanih sa svih strana — oči svuda, zure
              u svakom pravcu. Jedno drvo, više od svih ostalih, nosi dom Arcanista — visi s njega poput prezrelog ploda. Kućica je okačena o debelo
              upleteno uže, široko kao podlaktica džina, koje je vezano za ogromnu granu i kontrateženo stenom veličine kolibe, koja leži u podnožju
              stabla. Na kamenu su urezani simboli, a prozori kućice svetlucaju blagim žutozelenim svetlom. Šta želite da uradite?
            </p>
            <Scenes heading={"Scene"}>
              <Scene heading={<h4 className="text-lg font-bold">Scena 1 - Pokušaju da dozovu Arcanista</h4>}>
                <p>Ne odaziva se, ali svetlo unutra idalje treperi onako žutozelene boje.</p>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">Scena 2 - Pokušaju da preseku uže</h4>}>
                <p>Čim pokušaju, bivaju odbačeni par metara unazad i obeležavaju jedan Stress</p>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">Scena 3 - Pokušaju da preseku se popnu uz drvo</h4>}>
                <p>Bacaju Agility roll sa difficulty 13. Ako je fail, jedna grana od drveta ih uhvati i lagano spusti na zemlju.</p>
              </Scene>
              <Scene heading={<h4 className="text-lg font-bold">Scena 4 - Kad konačno uspeju nešto da joj privuku pažnju</h4>}>
                <GM>Ispričaj im sledece ispod ovoga:</GM>
              </Scene>
              <p>
                Visoka, preko 2m, mix coveka i svica, Arcanist ili Arkanistkinja je faerie (vila) koja se pomera u kombinaciji veoma sporih i veoma
                brzih i naglih pokreta. Iako joj je lice teško pročitati, emocije u njenom glasu su kristalno jasne. Stara je, ali okretna, i posmatra
                vašu družinu sa nestašnim sjajem u očima.
              </p>
              <p>"Jeste li vi grupa koju je Emeris poslao iz prestonice? O, pa vi ste dobrano zakasnili. Ajde, ajde ulazite."</p>
              <p>
                Dok Arkanistkinja spušta svoj dom i poziva vas unutra, primećujete da je njena kućica na drvetu iznenađujuće prostrana. Glavna
                prostorija je ispunjena bočicama napitaka, čarobnim knjigama, runama, biljkama i raznim malim stvorenjima. Ipak, niko ne bi mogao reći
                da je ovde nered. Jasno je da bi staroj vili zasmetalo i da se samo jedan predmet pomeri za centimetar.
              </p>
            </Scenes>
            <h2 className="text-2xl font-bold">The Package (Paket)</h2>
            <GM>
              Arkanistkinja izlazi na prozor i počne da postavlja pitanja
              <ul className="list-disc pl-10">
                <li>Kakvo vam je putovanje bilo?</li>
                <li>Ko vas je uputio ovamo, moja kućica nije baš laka za pronalaženje?</li>
                <li>Kako ste zamišljali kako ćete umreti jednog dana</li>
              </ul>
              Kad joj bude bilo dosta, pitaće za paket od Kralja Emerisa. Kako bi ga pogledala bezbedno, ona magično otvara svoju kućicu kao neki cvet
              koji se rascvetao. Požurivaće igrače da unesu paket brzo pre nego što se kućica zatvori, ali sad je kućica malo veća iznutra. Kad otvori
              paket pročitaj ovo:
            </GM>
            <p>
              Unutar paketa od Kralja Emerisa nalazi se masivan kamen sa urezanim licem lava. Marlow, ti ga prepoznaješ kao keystone od glavnog luka
              kapije prestonice. Akranistkinja klimne mudro čim ga ugleda, rekavši:
            </p>
            <p>
              „Naravno da bi kralj ovu isporuku držao u tajnosti. Kad bi iko znao da vaš grad više nije zaštićen čini, bio bi osvojen pre svitanja.“
            </p>
            <p>Uz ovu zloslutnu opomenu, počinje ponovo da razvlači svoju kućicu na drvetu:</p>
            <p>
              „Moramo da otputujemo u Otvorenu Dolinu i obnovimo čini zaštite. Ali... tako snažan magijski čin privući će opasna stvorenja iz
              najmračnijih delova Sablewooda. Trebaće mi vaša pomoć.“
            </p>
            <GM>Ako su entuzijastični da pomognu Arkanistkiji onda preskači odmah na Act 5, ali ako nisu onda nek malo RP kako su došli do kamena</GM>
            <p className="py-10 text-center text-2xl text-accent">ACT 4 END</p>
            <Link to={"/daggerheart-demo/acts/act5"} className="btn btn-primary">
              Next Act
            </Link>
          </BoxSection>
        </section>
      </BoxSection>
    </motion.main>
  );
}
