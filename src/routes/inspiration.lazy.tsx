import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendData } from "../utilities/sendData";
import { BoxSection } from "../components/BoxSection";

export const Route = createLazyFileRoute("/inspiration")({
    component: Inspiration,
});

function Inspiration() {
    let { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));

    let inspiration: Inspiration = state.character.stats.inspiration;

    const [inspValue, setInspValue]: [Inspiration, any] = useState(inspiration);
    const [isSaved, setIsSaved] = useState(false);

    const handleIncrease = (key: string) => {
        let newValue: number;

        if (key !== "regular") {
            if (inspValue.regular < 3) return;
            inspValue.regular -= 3;
            setInspValue({ ...inspValue, regular: inspValue.regular });
            state.character.stats.inspiration = { ...inspiration, regular: inspValue.regular };
        }

        newValue = inspValue[key as keyof Inspiration] + 1;
        
        setInspValue({ ...inspValue, [key]: newValue });
        state.character.stats.inspiration = { ...inspiration, [key]: newValue };
    };

    const handleDecrease = (key: string) => {
        if (inspValue[key as keyof Inspiration] < 1) return;
        let newValue = inspValue[key as keyof Inspiration] - 1;
        setInspValue({ ...inspValue, [key]: newValue });
        state.character.stats.inspiration = { ...inspiration, [key]: newValue };
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    ...state,
                    character: { ...state.character, stats: { ...state.character.stats, inspiration: inspValue } },
                },
            })
        );
        await sendData("characters", state.character.id, {
            stats: { ...state.character.stats, inspiration: inspValue },
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <BoxSection styles="w-full flex gap-5 p-5 relative">
            <form className="flex h-full w-full flex-col justify-center" onSubmit={(e) => handleSubmit(e)}>
                
                <motion.ul
                    className="flex w-full flex-col-reverse items-start gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {Object.entries(inspiration).map(([key]) => {
                        return (
                            <li key={key} className="flex items-center gap-10">
                                <img
                                    src={`https://iyfoqgbhaxcedpmuvfkr.supabase.co/storage/v1/object/public/gems/${key}.svg`}
                                    alt={`${key} inspiration gem`}
                                    width={80}
                                    height={80}
                                />
                                
                                <BoxSection styles="items-center justify-center gap-5">
                                    <button type="button" className="btn btn-ghost text-3xl" onClick={() => handleDecrease(key)}>
                                        -
                                    </button>
                                    <p className="flex w-[1ch] justify-center text-center text-3xl">{inspValue[key as keyof Inspiration]}</p>
                                    <button type="button" className="btn btn-ghost text-3xl" onClick={() => handleIncrease(key)}>
                                        +
                                    </button>
                                </BoxSection>
                                <p>{state.character.descriptions.inspiration[key as keyof Descriptions]}</p>
                            </li>
                        );
                    })}
                </motion.ul>
                <div className="absolute right-5 top-5 flex items-center gap-2">
                    <p className={`opacity-0 select-none pointer-events-none text-sm text-success transition-opacity duration-500 ${isSaved ? "opacity-100 select-auto pointer-events-auto" : ""}`}>Saved</p>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </div>
            </form>
        </BoxSection>
    );
}
