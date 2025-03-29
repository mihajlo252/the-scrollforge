import React, { useEffect } from "react";
import { BoxSection } from "../../components/BoxSection";

export const CreateCharacterTraits = ({
    traits,
    setTraits,
    isSave,
    setIsSave,
    description,
}: {
    traits: string[];
    setTraits: React.Dispatch<React.SetStateAction<string[]>>;
    isSave: boolean;
    setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
    description: string;
}) => {
    const [traitValue, setTraitValue] = React.useState("");

    const [isToggled, setIsToggled] = React.useState(false);

    const handleAddTrait = () => {
        if (traitValue === "") return;
        setTraits([...traits, traitValue]);
        setTraitValue("");
        setIsSave(true);
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
                            [description]: traits,
                        },
                    },
                },
            })
        );
        setIsSave(false);
    };

    useEffect(() => {
        if (isSave) handleSave();
    }, [isSave]);

    return (
        <div className="relative flex h-full w-full flex-col gap-8">
            <button
                type="button"
                className="btn btn-accent sticky top-5 z-20 self-end"
                onClick={() => setIsToggled(!isToggled)}
            >
                {isToggled ? "Close" : "Add New"}
            </button>
            {traits.map((trait: string, index: number) => (
                <pre key={index}>
                    <p className="w-full text-wrap break-words">
                        {trait}
                    </p>
                </pre>
            ))}
            <div
                className={`flex flex-col justify-center items-center fixed top-1/2 -translate-y-1/2 py-10 z-50 left-1/2 -translate-x-1/2 ${isToggled ? "block" : "hidden"}`}
            >
                <BoxSection styles="h-[unset] w-max px-20 bg-opacity-90 py-10 justify-center flex-col gap-5 items-center text-start">
                    <textarea
                        className="textarea textarea-bordered max-w-lg resize-none"
                        placeholder="Trait"
                        name="trait"
                        cols={100}
                        rows={10}
                        value={traitValue}
                        onChange={(e) => setTraitValue(e.target.value)}
                    />
                    <button type="button" className="btn btn-accent w-full" onClick={handleAddTrait}>
                        Add
                    </button>
                </BoxSection>
            </div>
        </div>
    );
};
