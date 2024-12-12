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

    const handleIncrease = (key: string, value: number) => {
        value += 1;
        setInspValue({ ...inspValue, [key]: value });
        state.character.stats.inspiration = { ...inspiration, [key]: value };
    };

    const handleDecrease = (key: string, value: number) => {
        value -= 1;
        setInspValue({ ...inspValue, [key]: value });
        state.character.stats.inspiration = { ...inspiration, [key]: value };
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        localStorage.setItem("character", JSON.stringify({state: {...state, character: {...state.character, stats: {...state.character.stats, inspiration: inspValue}}}}));
        await sendData("characters", state.character.id, { stats: {...state.character.stats, inspiration: inspValue} });
    };

    return (
      <BoxSection styles="w-full flex flex-col gap-5 p-5 relative" >

        <form className="flex h-full flex-col items-center justify-center" onSubmit={(e) => handleSubmit(e)}>
            <motion.ul className="flex h-full w-full items-center justify-around" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Object.entries(inspiration).map(([key]) => {
                    return (
                        <li key={key} className="flex flex-col gap-2">
                            <p>
                                <span className="capitalize">{key}</span>: {inspValue[key as keyof Inspiration]}
                            </p>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => handleIncrease(key, inspValue[key as keyof Inspiration])}
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => handleDecrease(key, inspValue[key as keyof Inspiration])}
                                >
                                    -
                                </button>
                            </div>
                        </li>
                    );
                })}
            </motion.ul>
            <button type="submit" className="btn btn-primary">
                Save
            </button>
        </form>
      </BoxSection>
    );
}
