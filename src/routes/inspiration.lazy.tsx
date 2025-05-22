import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendData } from "../utilities/sendData";
import { BoxSection } from "../components/BoxSection";

import pink from "/assets/pink.svg";
import white from "/assets/white.svg";
import purple from "/assets/purple.svg";
import yellow from "/assets/yellow.svg";
import red from "/assets/red.svg";
import regular from "/assets/regular.svg";
import { toast } from "../utilities/toasterSonner";

export const Route = createLazyFileRoute("/inspiration")({ component: Inspiration });

function Inspiration() {
    let { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));
    const inspirations = {
        red: "Auto natural 20!",
        pink: "+10 to AC and saving throw for two rounds.",
        white: "Dead? Not dead!",
        purple: "Get one straight answer from the DM.",
        yellow: "One Legendary action or Legendary resistance.",
        regular: "Exchange three of these for one of the colored ones.",
    };

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
        toast({ style: "bg-success text-base-100", message: "Saved!" });
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
                                    src={
                                        key === "regular"
                                            ? regular
                                            : key === "white"
                                              ? white
                                              : key === "yellow"
                                                ? yellow
                                                : key === "red"
                                                  ? red
                                                  : key === "pink"
                                                    ? pink
                                                    : purple
                                    }
                                    alt={`${key} inspiration gem`}
                                    className="h-[4.5rem] w-[4.5rem]"
                                />

                                <BoxSection styles="items-center justify-center gap-5">
                                    <button
                                        type="button"
                                        className="btn btn-ghost text-3xl"
                                        onClick={() => handleDecrease(key)}
                                    >
                                        -
                                    </button>
                                    <p className="flex w-[1ch] justify-center text-center text-3xl">
                                        {inspValue[key as keyof Inspiration]}
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-ghost text-3xl"
                                        onClick={() => handleIncrease(key)}
                                    >
                                        +
                                    </button>
                                </BoxSection>
                                <p>{inspirations[key as keyof Inspiration]}</p>
                            </li>
                        );
                    })}
                </motion.ul>
                <div className="absolute right-5 top-5 flex items-center gap-2">
                    
                    <button
                        type="submit"
                        className="btn btn-ghost border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100"
                    >
                        Save
                    </button>
                </div>
            </form>
        </BoxSection>
    );
}
