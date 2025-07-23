import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../../components/BoxSection";

export const Route = createLazyFileRoute("/daggerheart-demo/acts/act5")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <motion.main className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BoxSection styles="w-full h-full flex flex-col place-self-center px-5 py-2 gap-5">
        <h1 className="text-left text-xl font-bold">Act 5 - The Ward Renewal [Obnova Zaštitne Magije]</h1>
        <section className="grid grid-cols-1">
          <BoxSection styles="w-full max-h-[70vh] overflow-scroll flex flex-col text-start px-5 pt-2 pb-10 gap-2 !border-accent">
            <h2 className="text-2xl font-bold">The Whitefire Arcanist [Beloplameni Arcanist]</h2>
            <p>Po direkcijama Arkanistkinje, vaša kočija ulazi u misterioznu čistinu u obliku savršenog kruga, jedini deo Sablewooda kojem drveće ne zaklanja nebo. Ovo je Open Vale (Otvorena Dolina)</p>
            
            
            
            <p className="py-10 text-center text-2xl text-accent">ACT 5 END</p>
            {/* <Link to={"/daggerheart-demo/acts/act1"} className="btn btn-primary">
              Next Act
            </Link> */}
          </BoxSection>
        </section>
      </BoxSection>
    </motion.main>
  );
}
