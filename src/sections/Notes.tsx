import { useEffect, useState } from "react";
import { sendData } from "../utilities/sendData";
import { motion } from "framer-motion";
import styles from "./Notes.module.css";
export const Notes = () => {
    const [notes, setNotes] = useState<string>("");
    const [save, setSave] = useState(false);

    const { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await sendData("characters", state.character.id, { notes });
        state.character.notes = notes;
        localStorage.setItem("character", JSON.stringify({state: state}));
        setSave(false);
    }

    const handleSetNotes = (e: any) => {
        setNotes(e.target.value);
        if (save === false && e.target.value !== state.character.notes) {
            setSave(true);
        }
        if (save === true && e.target.value == state.character.notes) {
            setSave(false);
        }
    }

    useEffect(() => {
        setNotes(state.character.notes);
    }, [state.character.notes]);

    return (
        // <button type="button" className="btn btn-ghost relative right-5 top-5" onClick={(e) => handleSubmit(e)}>Save</button>
        <motion.form className={`frame full ${styles.form}`} onSubmit={(e) => handleSubmit(e)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            <textarea
                className={`textarea ${styles.textarea}`}
                placeholder="What's on your mind?"
                value={notes}
                onChange={(e) => handleSetNotes(e)}
                />
            {save && <button type="submit" className={`button button-accent ${styles.save}`}>Save</button>}
        </motion.form>
    );
};
