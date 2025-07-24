import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";
import { GM } from "../../../components/SablewoodQuickStart/GM";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/epilogue")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
        <header className="flex justify-between">
          <h1 className="text-left text-xl font-bold">Epilogue - Beyond The Vale</h1>{" "}
        </header>
        <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
          <h2 className="text-2xl font-bold">The Keystone Ward [Zastitni Kamen]</h2>
          <p>
            Dok zadajete moćan udarac, ritual se završava! Kočija se s treskom spušta na zemlju dok ključ-kamen pulsira od arkanske energije. Onda,
            iznenada, eksplozija bez zvuka izbija iz Beleplamene Arkanistkinje, raspršujući sve preostale neprijatelje. Čistina ponovo utihne. Sat
            vremena kasnije, u toplini kuće na drvetu, ključ-kamen lebdi pažljivo iznad vatre koja tiho pucketa u ognjištu. Arkanistkinja, sada vidno
            starija nego ranije, sedi prekrštenih nogu u prenatrpanoj, udobnoj stolici. Umor se čuje u njenom glasu dok govori: „Borili ste se hrabro.
            Nisam iznenađena, naravno. Kralj bira dobru družinu. I drago mi je što ste bili ovde.“
          </p>
          <GM>Nek malo RP da zavrse svoju pricu, i ako pitaju za keystone:</GM>
          <p>
            „Keystone-u će trebati nedelju dana, možda i više, da se magija slegne. Moraću pažljivo da ga posmatram, da ne bi naprsao... ili ne
            postane svestan... znate već kako to ide. A u međuvremenu, nakon što se odmorite, saberete i uživate u toplom obroku — imam još nešto da
            vas zamolim.“ Kamera (ili pogled) se povlači iz Arkanistkinjevog doma, iz same šume, i prikazuje zelenilo Sablewooda iz ptičje
            perspektive, gde kameni tornjevi vijugaju ka nebu i svaki od njih u sebi skriva plamen koji treperi kao svetionik. Arkanistkinja
            nastavlja, tišim glasom: „Postoji jedan Toranj, zapadno odavde, par sati hoda. Osetila sam ga na putu ka ritualu. Njegova energija je
            bila... čudna. Svetlost mu je delovala slabije nego što bi trebalo. Mislim da nešto nije u redu sa njegovim Čuvarom, i bojim se šta će se
            desiti ako mu se plamen potpuno ugasi.“ „Kada budete spremni, vratite se. Daću vam svoju mapu, da bezbedno stignete tamo. Lepo je opet
            imati junake u Sablewoodu.“ Tu ćemo danas završiti sesiju.
          </p>

          <p className="py-10 text-center text-2xl text-accent">THE END</p>
        </BoxSection>
      </BoxSection>
    </motion.main>
  );
}
