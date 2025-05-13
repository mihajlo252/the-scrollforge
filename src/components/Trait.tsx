import { useState } from "react";
import { sendData } from "../utilities/sendData";

export const Trait = ({ description }: { description: string }) => {
    const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
    const [featureTraits, setFeatureTraits] = useState<string>(state.character.descriptions.featureTraits);
    const [racialTraits, setRacialTraits] = useState<string>(state.character.descriptions.racialTraits);
    const [save, setSave] = useState(false);

    const handleSubmit = async (e: any, traits: string) => {
        e.preventDefault();
        await sendData("characters", state.character.id, { descriptions: { ...state.character.descriptions, [description]: traits } });
        setSave(false);
    };

    const handleSetTraits = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        setFunc: React.Dispatch<React.SetStateAction<string>>,
        prevTraits: string
    ) => {
        setFunc(e.target.value);
        if (save === false && e.target.value !== prevTraits) {
            setSave(true);
        }
        if (save === true && e.target.value == prevTraits) {
            setSave(false);
        }
    };

    if (description === "racialTraits") {
        return (
            <form className="relative h-full w-full" onSubmit={(e) => handleSubmit(e, racialTraits)}>
                <textarea
                    className="text-md h-full w-full resize-none overflow-y-auto rounded-lg bg-base-300 px-5"
                    placeholder="What's on your mind?"
                    value={racialTraits}
                    onChange={(e) => handleSetTraits(e, setRacialTraits, state.character.descriptions.racialTraits)}
                />
                {save && (
                    <button
                        type="submit"
                        className="btn btn-ghost absolute right-5 top-5 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100"
                    >
                        Save
                    </button>
                )}
            </form>
        );
    }
    if (description === "featureTraits") {
        return (
            <form className="relative h-full w-full" onSubmit={(e) => handleSubmit(e, featureTraits)}>
                <textarea
                    className="text-md h-full w-full resize-none overflow-y-auto rounded-lg bg-base-300 px-5"
                    placeholder="What's on your mind?"
                    value={featureTraits}
                    onChange={(e) => handleSetTraits(e, setFeatureTraits, state.character.descriptions.featureTraits)}
                />
                {save && (
                    <button
                        type="submit"
                        className="btn btn-ghost absolute right-5 top-5 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100"
                    >
                        Save
                    </button>
                )}
            </form>
        );
    }
};
