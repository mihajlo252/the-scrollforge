import { useEffect, useState } from "react";
import { sendData } from "../../utilities/sendData";

export const Notes = () => {
    const [notes, setNotes] = useState<string>("");
    const [save, setSave] = useState(false);

    const { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await sendData("characters", state.character.id, { notes });
        state.character.notes = notes;
        localStorage.setItem("character", JSON.stringify({state: state}));
        console.log(state);
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
        <form className="relative h-full w-full" onSubmit={(e) => handleSubmit(e)}>

            <textarea
                className="text-md h-full w-full touch-none resize-none overflow-y-auto rounded-lg border-2 border-slate-900 bg-base-300 p-5"
                placeholder="What's on your mind?"
                value={notes}
                onChange={(e) => handleSetNotes(e)}
                />
            {save && <button type="submit" className="btn btn-ghost absolute right-5 top-5">Save</button>}
        </form>
    );
};
