import React, { useState } from "react";
import { BoxSection } from "../../components/BoxSection";
import { getUserFromLocal } from "../../utilities/getUserFromLocal";
import { submitCharacter } from "../../utilities/submitCharacter";
import { Popup } from "../../components/Popup";

export const CreateCharacter = ({
    openCreateCharacter,
    setOpenCreateCharacter,
    setIsSave,
}: {
    openCreateCharacter: boolean;
    setOpenCreateCharacter: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    if (!openCreateCharacter) return;

    const [characterProfile, setCharacterProfile] = useState<CharacterProfile>({
        class: "",
        level: 0,
        name: "",
        race: "",
        subclass: "",
        subrace: "",
    });

    const handleCreateCharacter = async (e: React.FormEvent) => {
        e.preventDefault();
        const { user } = JSON.parse(getUserFromLocal());
        await submitCharacter(characterProfile, user.id);
        setIsSave(true);
        setOpenCreateCharacter(false);
    };

    return (
        <Popup closerFunc={setOpenCreateCharacter}>
            <BoxSection styles="relative h-min flex flex-col gap-5 justify-center items-center text-center px-20 py-10">
                <h2 className="text-4xl font-bold">Create Your Character</h2>
                <form className="flex w-full flex-col gap-2" onSubmit={(e) => handleCreateCharacter(e)}>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Name"
                        required
                        onChange={(e) => setCharacterProfile({ ...characterProfile, name: e.target.value })}
                    />
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="Level"
                        required
                        onChange={(e) => setCharacterProfile({ ...characterProfile, level: parseInt(e.target.value) })}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Class"
                        required
                        onChange={(e) => setCharacterProfile({ ...characterProfile, class: e.target.value })}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Subclass"
                        onChange={(e) => setCharacterProfile({ ...characterProfile, subclass: e.target.value })}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Race"
                        required
                        onChange={(e) => setCharacterProfile({ ...characterProfile, race: e.target.value })}
                    />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Subrace"
                        onChange={(e) => setCharacterProfile({ ...characterProfile, subrace: e.target.value })}
                    />

                    <div className="mt-10 flex gap-2">
                        <button type="submit" className="btn btn-primary flex-1">
                            Create
                        </button>
                        <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </BoxSection>
        </Popup>
    );
};
