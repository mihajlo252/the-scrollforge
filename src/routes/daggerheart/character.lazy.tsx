import { createLazyFileRoute } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { Frame } from "../../components/Frame/Frame";
import { Load } from "../../components/Load";
import { DiceBoxComponent } from "../../sections/DiceBox";
import { useEffect, useState } from "react";
import { sendData } from "../../utilities/sendData";
import { Popup } from "../../components/Popup/Popup";
import { Notes } from "../../sections/Notes";
import { CharacterProfile } from "../../sections/Daggerheart/CharacterProfile/CharacterProfile";
import styles from "./character.module.css";
// import ClassesData from "../../daggerheart-config/classes_cleaned.json"
// import SubclassesData from "../../daggerheart-config/subclasses_clean.json"
// import CommunitiesData from "../../daggerheart-config/communities_clean.json"
// import AncestriesData from "../../daggerheart-config/ancestries_clean.json"

export const Route = createLazyFileRoute("/daggerheart/character")({
  component: Character,
});

function Character() {
  const dev = import.meta.env.VITE_DEV_MODE
  
  if (dev === "false") {
    return (
      <Frame classes={styles.unavailable}>
        <h1 className="text-content text-primary">Currently unavailable. Please check back later!</h1>
      </Frame>
    )
  }

  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const [statChange, setStatChange] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [toggleNotes, setToggleNotes] = useState(false);
  const [toggleDice, setToggleDice] = useState(false);

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
    <motion.section className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {isSave && (
        <button className={`button button-primary ${styles.saveBtn}`} onClick={() => handleSaveCharacter(state.character.stats)}>
          Save Character
        </button>
      )}
      <section className={styles.row}>
        <div className={styles.profileWrap}>
          <CharacterProfile setStatChange={setStatChange} />
        </div>
        <Frame classes={styles.navCol}>
          <nav className={styles.nav}>
            <button onClick={() => setToggleNotes(true)} className="button button-primary">
              Notes
            </button>
            <button className="button button-primary" onClick={() => setToggleDice(true)}>
              Dice
            </button>
          </nav>
        </Frame>
      </section>
      <Popup closerFunc={setToggleNotes} toggle={toggleNotes}>
        <Notes />
      </Popup>
      <Popup closerFunc={setToggleDice} toggle={toggleDice}>
        <Frame classes={styles.dice}>
          <DiceBoxComponent />
        </Frame>
      </Popup>
    </motion.section>
  );
}
