import { createLazyFileRoute } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../../components/BoxSection";
import { Load } from "../../components/Load";
import { DiceBoxComponent } from "../../sections/DiceBox";
import { useEffect, useState } from "react";
import { sendData } from "../../utilities/sendData";
import { Popup } from "../../components/Popup";
import { Notes } from "../../sections/Notes";
// import ClassesData from "../../daggerheart-config/classes_cleaned.json"
// import SubclassesData from "../../daggerheart-config/subclasses_clean.json"
// import CommunitiesData from "../../daggerheart-config/communities_clean.json"
// import AncestriesData from "../../daggerheart-config/ancestries_clean.json"

export const Route = createLazyFileRoute("/daggerheart/character")({
  component: Character,
});

function Character() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const [statChange, setStatChange] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [toggleNotes, setToggleNotes] = useState(false);

  if (!state.character) {
    return <Load />;
  }

  const handleSaveCharacter = async (stats: Stats) => {
    await sendData("characters", state.character.id, { stats: { ...stats }, characterProfile: { ...state.character.characterProfile } });
    setIsSave(false);
  };

  useEffect(() => {
    setStatChange(false);
    if (statChange) setIsSave(true);
  }, [statChange]);
  return (
    <motion.main className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {isSave && (
        <button
          className="btn btn-ghost absolute top-5 m-0 h-min min-h-0 place-self-center border-2 border-accent px-4 py-2 text-accent hover:border-accent hover:bg-accent hover:text-base-100 active:-translate-x-1/2"
          onClick={() => handleSaveCharacter(state.character.stats)}
        >
          Save Character
        </button>
      )}
      <section className={`flex gap-5`}>
        <BoxSection styles="w-[50%] flex justify-around items-center p-5">
          <DiceBoxComponent />
        </BoxSection>
        <BoxSection styles="w-[10%] flex flex-col justify-start">
          <nav className="flex flex-col gap-3 p-3">
            <button onClick={() => setToggleNotes(true)} className="btn btn-primary">
              Notes
            </button>
          </nav>
        </BoxSection>
      </section>
      <Popup closerFunc={setToggleNotes} toggle={toggleNotes}>
        <Notes />
      </Popup>
    </motion.main>
  );
}
