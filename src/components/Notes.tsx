import { useState } from "react";

export const Notes = () => {
    const [notes, setNotes] = useState<string>("");

    return (
        <form className="flex h-full w-full flex-col items-start gap-5">
            <h2 className="text-4xl">Notes</h2>
            <textarea
                className="text-md h-full w-full touch-none overflow-y-auto rounded-lg border-2 border-slate-900 bg-base-300 p-5"
                placeholder="What's on your mind?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </form>
    );
};
