import { useState } from "react";
import { BoxSection } from "../../components/BoxSection";
import { DeleteButton } from "../../components/DeleteButton";
import { sendData } from "../../utilities/sendData";
import { Popup } from "../../components/Popup";

export const Spell = ({
    spell,
    index,
    style,
    setSpells,
}: {
    spell: Spell;
    index: number;
    style?: string;
    setSpells: React.Dispatch<React.SetStateAction<Spell[]>>;
}) => {
    const [isDelete, setIsDelete] = useState(false);
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendData("characters", state.character.id, {
            descriptions: { ...state.character.descriptions, spells: state.character.descriptions.spells.filter((a: any) => a.name !== spell.name) },
        });
        setSpells(state.character.descriptions.spells.filter((a: any) => a.name !== spell.name));
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    ...state,
                    character: {
                        ...state.character,
                        descriptions: {
                            ...state.character.descriptions,
                            spells: [
                                ...state.character.descriptions.spells.filter((a: any) => a.name !== spell.name),
                            ],
                        },
                    },
                },
            })
        );
        setIsDelete(false);
    };

    return (
        <BoxSection key={index} styles={`relative grid w-full grid-cols-[1fr_3fr] h-min gap-5 text-lg px-10 py-5 border-accent ${style}`}>
            <div className="flex flex-col gap-2">
                <p className="grid text-sm">
                    <span className="text-3xl underline">{spell.name}</span>
                    {spell.type}
                </p>
                <p>Range: {spell.range}</p>
                <p>Casting Time: {spell.castingTime}</p>
                <p>Range: {spell.range}</p>
                <p>Duration: {spell.duration}</p>
                <p>Components: {spell.components}</p>
                <DeleteButton
                    size={55}
                    styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary absolute bottom-5 right-0"
                    event={() => {
                        setIsDelete(true);
                    }}
                />
                        <Popup closerFunc={setIsDelete} toggle={isDelete}>
                            <form className="flex flex-col gap-10" onSubmit={(e) => handleDelete(e)}>
                                <p>Are you sure you want to delete this spell?</p>
                                <div className="flex w-full gap-5">
                                    <button type="button" className="btn btn-primary flex-grow" onClick={() => setIsDelete(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-accent flex-grow">
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </Popup>
            </div>
            <pre>
                <p className="w-full text-wrap break-words">{spell.description}</p>
            </pre>
        </BoxSection>
    );
};
