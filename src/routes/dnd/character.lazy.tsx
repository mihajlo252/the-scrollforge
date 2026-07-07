import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
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
import styles from "../../sections/DnD/CharacterProfile/sheet.module.css";

export const Route = createLazyFileRoute("/dnd/character")({
  component: Character,
});

function Character() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const [toggleNotes, setToggleNotes] = useState(false);
  const [toggleDice, setToggleDice] = useState(false);

  if (!state?.character) {
    return <Load />;
  }

  const character = state.character;

  return (
    <motion.section className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SheetTabs active="combat" />

      <SheetTopbar character={character} onRoll={() => setToggleDice(true)} onNotes={() => setToggleNotes(true)} />

      <section className={styles.row3}>
        <HPCard character={character} />
        <AbilitiesCard character={character} />
        <ResourcesCard character={character} />
      </section>

      <section className={styles.row2}>
        <SkillsCard character={character} />
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
