import { createLazyFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { Spell } from "../components/Spell";
import { Popup } from "../components/Popup";
import { useState } from "react";
import { sendData } from "../utilities/sendData";

export const Route = createLazyFileRoute("/spells")({
    component: Spells,
});

function Spells() {
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
    const { character } = state;
    const [add, setAdd] = useState(false);
    const [spells, setSpells] = useState<Spell[]>(character.descriptions.spells || []);

    const [spellValue, setSpellValue] = useState<Spell>({
        name: "",
        type: "",
        castingTime: "",
        range: "",
        duration: "",
        components: "",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
        setFunc: React.Dispatch<React.SetStateAction<Spell>>
    ) => {
        e.preventDefault();

        setFunc((prev: Spell) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleAddSpell = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendData("characters", state.character.id, {
            descriptions: { ...state.character.descriptions, spells: [...state.character.descriptions.spells, spellValue] },
        });
        setSpells([...spells, spellValue]);
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    ...state,
                    character: {
                        ...state.character,
                        descriptions: { ...state.character.descriptions, spells: [...state.character.descriptions.spells, spellValue] },
                    },
                },
            })
        );
        setAdd(false);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <button type="button" className="btn btn-accent absolute right-14 top-24 z-10" onClick={() => setAdd(true)}>
                Add
            </button>
            <BoxSection styles="w-full h-full p-5 py-10 flex-col gap-5 text-start overflow-y-scroll">
                {spells.map((spell: Spell, index: number) => (
                    <Spell index={index} spell={spell} key={index} setSpells={setSpells} />
                ))}
                <AnimatePresence>
                    {add && (
                        <Popup closerFunc={setAdd}>
                            <form onSubmit={(e) => handleAddSpell(e)} className="flex w-min items-center justify-center">
                                <BoxSection styles="px-20 bg-opacity-90 py-10 justify-center flex-col gap-5 items-start text-start">
                                <input
                                        type="text"
                                        name="name"
                                        placeholder="Spell Name"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.name || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="type"
                                        placeholder="Type"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.type || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="castingTime"
                                        placeholder="Casting Time"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.castingTime || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="range"
                                        placeholder="Range"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.range || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="Duration"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.duration || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="components"
                                        placeholder="Components"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.components || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <textarea
                                        name="description"
                                        placeholder="Description"
                                        className="textarea resize-none focus-within:outline-0"
                                        rows={2}
                                        cols={50}
                                        value={spellValue?.description || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <div className="flex w-full gap-5">
                                        <button type="submit" className="btn btn-accent flex-grow">
                                            Add
                                        </button>
                                        <button type="button" className="btn btn-secondary flex-grow" onClick={() => setAdd(false)}>
                                            Close
                                        </button>
                                    </div>
                                </BoxSection>
                            </form>
                        </Popup>
                    )}
                </AnimatePresence>
            </BoxSection>
        </motion.main>
    );
}

/*function Spells() {
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
    const { character } = state;
    const [add, setAdd] = useState(false);

    const [spells, setSpells] = useState<Spell[]>(character.descriptions.spells || []);

    const [spellValue, setSpellValue] = useState<Spell>({
        name: "",
        type: "",
        castingTime: "",
        range: "",
        duration: "",
        components: "",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
        setFunc: React.Dispatch<React.SetStateAction<Spell>>
    ) => {
        e.preventDefault();

        setFunc((prev: Spell) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleAddSpell = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendData("characters", state.character.id, {
            descriptions: { ...state.character.descriptions, spells: [...state.character.descriptions.spells, spellValue] },
        });
        setSpells([...spells, spellValue]);
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    ...state,
                    character: {
                        ...state.character,
                        descriptions: { ...state.character.descriptions, spells: [...state.character.descriptions.spells, spellValue] },
                    },
                },
            })
        );
        setAdd(false);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <button type="button" className="btn btn-accent absolute right-14 top-24 z-10" onClick={() => setAdd(true)}>
                Add
            </button>
            <BoxSection styles="w-full h-full p-5 flex-col gap-5 text-start overflow-y-scroll">
                {character.descriptions?.spells.map((spell: Spell, index: number) => (
                    <Spell index={index} spell={spell} key={index} setSpells={setSpells} />
                ))}
                <AnimatePresence>
                    {add && (
                        <Popup closerFunc={setAdd}>
                            <form onSubmit={(e) => handleAddSpell(e)} className="flex w-min items-center justify-center">
                                <BoxSection styles="px-20 bg-opacity-90 py-10 justify-center flex-col gap-5 items-start text-start">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Spell Name"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.name || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="type"
                                        placeholder="Type"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.type || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="castingTime"
                                        placeholder="Casting Time"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.castingTime || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="range"
                                        placeholder="Range"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.range || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="Duration"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.duration || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <input
                                        type="text"
                                        name="components"
                                        placeholder="Components"
                                        className="input w-full focus-within:outline-0"
                                        value={spellValue?.components || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <textarea
                                        name="description"
                                        placeholder="Description"
                                        className="textarea resize-none focus-within:outline-0"
                                        rows={2}
                                        cols={50}
                                        value={spellValue?.description || ""}
                                        onChange={(e) => handleChange(e, setSpellValue)}
                                    />
                                    <div className="flex w-full gap-5">
                                        <button type="submit" className="btn btn-accent flex-grow">
                                            Add
                                        </button>
                                        <button type="button" className="btn btn-secondary flex-grow" onClick={() => setAdd(false)}>
                                            Close
                                        </button>
                                    </div>
                                </BoxSection>
                            </form>
                        </Popup>
                    )}
                </AnimatePresence>
            </BoxSection>
        </motion.main>
    );
}
*/