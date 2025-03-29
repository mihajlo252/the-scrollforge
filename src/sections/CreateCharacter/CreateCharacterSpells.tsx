import { useEffect, useState } from "react";
import { BoxSection } from "../../components/BoxSection";

export const CreateCharacterSpells = ({
    spells,
    setSpells,
    isSave,
    setIsSave,
    description,
}: {
    spells: Spell[];
    setSpells: React.Dispatch<React.SetStateAction<Spell[]>>;
    isSave: boolean;
    setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
    description: string;
}) => {
    const [spellValue, setSpellValue] = useState<Spell>({
        name: "",
        type: "",
        castingTime: "",
        range: "",
        duration: "",
        components: "",
        description: "",
    });

    const [isToggled, setIsToggled] = useState(false);

    const handleChange = (e: any, setFunc: any) => {
        e.preventDefault();

        setFunc((prev: Spell) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleSave = () => {
        // e.preventDefault();

        localStorage.setItem(
            "newCharacter",
            JSON.stringify({
                state: {
                    character: {
                        ...JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character,
                        descriptions: {
                            ...JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character.descriptions,
                            [description]: spells,
                        },
                    },
                },
            })
        );
        setIsSave(false);
    };

    const handleAddSpell = (e: any) => {
        e.preventDefault();
        if (spellValue.name || spellValue.type || spellValue.castingTime || spellValue.range || spellValue.duration || spellValue.components || spellValue.description) {
            setSpells([...spells, spellValue]);
            setSpellValue({
                name: "",
                type: "",
                castingTime: "",
                range: "",
                duration: "",
                components: "",
                description: "",
            });
        }
        setIsSave(true);
    };

    useEffect(() => {
        if (isSave) handleSave();
    }, [isSave]);

    return (
        <>
            <div className="relative flex h-full w-full flex-col gap-5">
                <button
                    type="button"
                    className="btn btn-accent sticky top-5 z-20 self-end"
                    onClick={() => setIsToggled(!isToggled)}
                >
                    {isToggled ? "Close" : "Add New"}
                </button>
                {spells.map((spell: Spell, index: number) => (
                    <BoxSection
                        key={index}
                        styles="grid w-full grid-cols-[1fr_3fr] h-min gap-5 px-10 py-5 border-accent"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="grid text-sm">
                                <span className="text-3xl underline">{spell.name}</span>
                                {spell.type}
                            </p>
                            <p>Casting Time: {spell.castingTime}</p>
                            <p>Range: {spell.range}</p>
                            <p>Duration: {spell.duration}</p>
                            <p>Components: {spell.components}</p>
                        </div>
                        <pre>
                            <p className="text-wrap break-words">{spell.description}</p>
                        </pre>
                    </BoxSection>
                ))}

                <div
                    className={`flex h-full flex-col justify-center items-center fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 py-10 ${isToggled ? "block" : "hidden"}`}
                >
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
                            rows={4}
                            cols={50}
                            value={spellValue?.description || ""}
                            onChange={(e) => handleChange(e, setSpellValue)}
                        />
                        <button type="button" className="btn btn-accent w-full" onClick={(e) => handleAddSpell(e)}>
                            Add
                        </button>
                    </BoxSection>
                </div>
            </div>
        </>
    );
};
