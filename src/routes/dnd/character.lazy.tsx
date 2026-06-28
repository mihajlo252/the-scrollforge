import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Load } from "../../components/Load";
import { Frame } from "../../components/Frame/Frame";
import { Popup } from "../../components/Popup/Popup";
import { SheetTabs } from "../../sections/DnD/CharacterProfile/SheetTabs";
import { SheetTopbar } from "../../sections/DnD/CharacterProfile/SheetTopbar";
import { HPCard } from "../../sections/DnD/CharacterProfile/HPCard";
import { AbilitiesCard } from "../../sections/DnD/CharacterProfile/AbilitiesCard";
import { ResourcesCard } from "../../sections/DnD/CharacterProfile/ResourcesCard";
import { SkillsCard } from "../../sections/DnD/CharacterProfile/SkillsCard";
import { DefensesCard } from "../../sections/DnD/CharacterProfile/DefensesCard";
import { DiceBoxComponent } from "../../sections/DiceBox";
import { Notes } from "../../sections/Notes";
import { sendData } from "../../utilities/sendData";
import styles from "../../sections/DnD/CharacterProfile/sheet.module.css";

export const Route = createLazyFileRoute("/dnd/character")({
  component: Character,
});

function Character() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const [statChange, setStatChange] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [toggleNotes, setToggleNotes] = useState(false);
  const [toggleDice, setToggleDice] = useState(false);

  useEffect(() => {
    setStatChange(false);
    if (statChange) setIsSave(true);
  }, [statChange]);

  if (!state?.character) {
    return <Load />;
  }

  const character = state.character;

  const handleSaveCharacter = async () => {
    await sendData("characters", character.id, { stats: { ...character.stats }, characterProfile: { ...character.characterProfile } });
    setIsSave(false);
  };

  return (
    <motion.section className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {isSave && (
        <button className={`button button-accent ${styles.saveBtn}`} onClick={handleSaveCharacter}>
          Save Character
        </button>
      )}

      <SheetTabs active="combat" />

      <SheetTopbar character={character} setStatChange={setStatChange} onRoll={() => setToggleDice(true)} onNotes={() => setToggleNotes(true)} />

      <section className={styles.row3}>
        <HPCard character={character} setStatChange={setStatChange} />
        <AbilitiesCard character={character} setStatChange={setStatChange} />
        <ResourcesCard character={character} />
      </section>

      <section className={styles.row2}>
        <SkillsCard character={character} setStatChange={setStatChange} />
        <DefensesCard character={character} />
      </section>

      <Popup closerFunc={setToggleNotes} toggle={toggleNotes}>
        <Notes />
      </Popup>
      <Popup closerFunc={setToggleDice} toggle={toggleDice}>
        <Frame classes="column-direction">
          <DiceBoxComponent />
        </Frame>
      </Popup>
    </motion.section>
  );
}
