import { useEffect, useState } from "react";
import { BoxSection } from "../../components/BoxSection";

export const CreateCharacterAttacks = ({
    attacks,
    setAttacks,
    isSave,
    setIsSave,
    description,
}: {
    attacks: Attack[];
    setAttacks: React.Dispatch<React.SetStateAction<Attack[]>>;
    isSave: boolean;
    setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
    description: string;
}) => {
    const [attackValue, setAttackValue] = useState<Attack>();

    const [isToggled, setIsToggled] = useState(false);

    const handleChange = (e: any, setFunc: any) => {
        e.preventDefault();

        setFunc((prev: Attack) => {
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
                            [description]: attacks,
                        },
                    },
                },
            })
        );
        setIsSave(false);
    };

    const handleAddAttack = (e: any) => {
        e.preventDefault();
        if (attackValue) {
            setAttacks([...attacks, attackValue]);
            setAttackValue({ name: "", type: "", range: "", attack: "", damage: "", description: "" });
        }
        setIsSave(true);
    };

    useEffect(() => {
        if (isSave) handleSave();
    }, [isSave]);

    return (
        <div className="relative flex h-full w-full flex-col gap-5">
            <button
                type="button"
                className="btn btn-accent sticky top-5 z-20 self-end"
                onClick={() => setIsToggled(!isToggled)}
            >
                {isToggled ? "Close" : "Add New"}
            </button>
            {attacks.map((attack: Attack, index: number) => (
                <BoxSection key={index} styles="grid w-full grid-cols-[1fr_3fr] h-min gap-5 px-10 py-5 border-accent">
                    <div className="flex flex-col gap-2">
                        <p className="grid text-sm">
                            <span className="text-3xl underline">{attack.name}</span>
                            {attack.type}
                        </p>
                        <p>Range: {attack.range}</p>
                        <p>Attack: {attack.attack}</p>
                        <p>Damage: {attack.damage}</p>
                    </div>
                    <pre>
                        <p className="text-wrap break-words">
                            {/* {attack.description.split("\n").map((line: string, index: number) => (
                            <span className="block indent-5" key={index}>
                                {line}
                            </span>
                        ))} */}
                            {attack.description}
                        </p>
                    </pre>
                </BoxSection>
            ))}

            <div
                className={`flex flex-col justify-center items-center fixed left-1/2 -translate-x-1/2  ${isToggled ? "block" : "hidden"}`}
            >
                <BoxSection styles="h-[unset] px-20 bg-opacity-90 py-10 justify-center flex-col gap-5 items-start text-start">
                    <input
                        type="text"
                        name="name"
                        placeholder="Attack Name"
                        className="input w-full focus-within:outline-0"
                        value={attackValue?.name || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        className="input w-full focus-within:outline-0"
                        value={attackValue?.type || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <input
                        type="text"
                        name="range"
                        placeholder="Range"
                        className="input w-full focus-within:outline-0"
                        value={attackValue?.range || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <input
                        type="text"
                        name="attack"
                        placeholder="Attack"
                        className="input w-full focus-within:outline-0"
                        value={attackValue?.attack || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <input
                        type="text"
                        name="damage"
                        placeholder="Damage"
                        className="input w-full focus-within:outline-0"
                        value={attackValue?.damage || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="textarea resize-none focus-within:outline-0"
                        rows={4}
                        cols={50}
                        value={attackValue?.description || ""}
                        onChange={(e) => handleChange(e, setAttackValue)}
                    />
                    <button type="button" className="btn btn-primary w-full" onClick={(e) => handleAddAttack(e)}>
                        Add
                    </button>
                </BoxSection>
            </div>
        </div>
    );
};
