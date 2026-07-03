import { useState } from "react";
import { motion } from "framer-motion";
import { Frame } from "../../../components/Frame/Frame";
import { Load } from "../../../components/Load";
import { Popup } from "../../../components/Popup/Popup";
import { Notes } from "../../Notes";
import { DiceBoxComponent } from "../../DiceBox";
import { SheetTabs } from "./SheetTabs";
import { SheetTopbar } from "./SheetTopbar";
import { LevelUpModal } from "./LevelUpModal";
import styles from "../../../routes/daggerheart/sheetScreens.module.css";
import gate from "../../../routes/daggerheart/character.module.css";

/** Shared chrome wrapper for the Daggerheart sheet tabs: reads the active
 *  character, renders the tab bar + topbar + Notes/Dice popups, and slots the
 *  tab's content in between. Each tab route renders `children` via a render
 *  prop so it can read the same `character`/`state`. */
export const SheetShell = ({
	active,
	children,
}: {
	active: string;
	children: (ctx: { character: DaggerheartCharacter; state: any; openLevelUp: () => void }) => React.ReactNode;
}) => {
	const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
	const character: DaggerheartCharacter | undefined = state?.character;
	const [toggleNotes, setToggleNotes] = useState(false);
	const [toggleDice, setToggleDice] = useState(false);
	const [toggleLevelUp, setToggleLevelUp] = useState(false);
	const [levelUpTarget, setLevelUpTarget] = useState<number | undefined>(undefined);

	const openLevelUp = (target?: number) => {
		setLevelUpTarget(target);
		setToggleLevelUp(true);
	};

	// Gated until the Daggerheart sheet ships. To go live, set VITE_DEV_MODE
	// (anything but "false"), or remove this block and the matching one in
	// routes/daggerheart/character.lazy.tsx.
	if (import.meta.env.VITE_DEV_MODE === "false") {
		return (
			<Frame classes={gate.unavailable}>
				<h1 className="text-content text-primary">Currently unavailable. Please check back later!</h1>
			</Frame>
		);
	}

	if (!character) return <Load />;

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
			<SheetTabs active={active} />
			<SheetTopbar
				character={character}
				onNotes={() => setToggleNotes(true)}
				onRoll={() => setToggleDice(true)}
				onLevelUp={openLevelUp}
			/>

			{children({ character, state, openLevelUp: () => openLevelUp() })}

			<LevelUpModal character={character} state={state} toggle={toggleLevelUp} targetLevel={levelUpTarget} onClose={() => setToggleLevelUp(false)} />

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
};
