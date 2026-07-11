import { useState } from "react";
import { motion } from "framer-motion";
import { patchCharacter } from "../utilities/patchCharacter";
import { queueCharacterSave } from "../utilities/autosaveCharacter";
import styles from "./Notes.module.css";

export const Notes = () => {
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
    const [notes, setNotes] = useState<string>(state?.character?.notes ?? "");

    const handleSetNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        patchCharacter(state, { notes: e.target.value });
        queueCharacterSave(state.character.id, { notes: e.target.value });
    };

    return (
        <motion.div className={`frame full ${styles.form}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <textarea
                id="notes"
                className={`textarea ${styles.textarea}`}
                placeholder="What's on your mind?"
                value={notes}
                onChange={handleSetNotes}
                />
        </motion.div>
    );
};
