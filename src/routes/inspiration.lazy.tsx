import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendData } from "../utilities/sendData";
import { BoxSection } from "../components/BoxSection";

export const Route = createLazyFileRoute("/inspiration")({
    component: () => <Inspiration />,
});

function Inspiration() {
    let { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));

    let inspiration: Inspiration = state.character.stats.inspiration;

    const [inspValue, setInspValue]: [Inspiration, any] = useState(inspiration);

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
    };

    return (
        <BoxSection styles="w-full flex gap-5 p-5 relative">
            <form className="flex h-full w-full flex-col" onSubmit={(e) => handleSubmit(e)}>
                <button type="submit" className="btn btn-primary absolute right-5 top-5">
                    Save
                </button>
                <motion.ul
                    className="flex h-full w-full flex-col-reverse items-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {Object.entries(inspiration).map(([key]) => {
                        return (
                            <li key={key} className="flex items-center gap-10">
                                <img
                                    src={`assets/gems/${key}.svg`}
                                    alt={`${key} inspiration gem`}
                                    width={80}
                                    height={80}
                                />
                                
                                <div className="flex items-center gap-2">
                                    <button type="button" className="btn btn-ghost text-3xl" onClick={() => handleDecrease(key)}>
                                        -
                                    </button>
                                    <p className="text-3xl">{inspValue[key as keyof Inspiration]}</p>
                                    <button type="button" className="btn btn-ghost text-3xl" onClick={() => handleIncrease(key)}>
                                        +
                                    </button>
                                </div>
                                <p>{state.character.descriptions.inspiration[key as keyof Descriptions]}</p>
                            </li>
                        );
                    })}
                </motion.ul>
            </form>
        </BoxSection>
    );
}
