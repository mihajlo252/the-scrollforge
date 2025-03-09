import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../components/BoxSection";

import { CreateCharacterStats } from "../../sections/CreateCharacter/CreateCharacterStats";
import { CreateCharacterProfile } from "../../sections/CreateCharacter/CreateCharacterProfile";
import { useState } from "react";
import { CreateCharacterPassiveStats } from "../../sections/CreateCharacter/CreateCharacterPassiveStats";
// import { CreateCharacterAvatar } from "../../sections/CreateCharacter/CreateCharacterAvatar";

export const Route = createLazyFileRoute("/create-character/page1")({
    component: CreateCharacter,
});

function CreateCharacter() {
    const [isSave, setIsSave] = useState(false);
    const [isNewCharacter, setIsNewCharacter] = useState(false);
    const [isContinue, setIsContinue] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSave(true);
        navigate({ to: "/create-character/page2" });
    };

    const handleNewCharacter = async (e: any) => {
        e.preventDefault();
        setIsNewCharacter(true);
        setIsContinue(true);
        localStorage.setItem(
            "newCharacter",
            JSON.stringify({
                state: {
                    character: {
                        characterProfile: {
                            name: "",
                            level: "",
                            class: "",
                            subclass: "",
                            race: "",
                            subrace: "",
                        },
                        descriptions: {
                            attacks: [],
                            featureTraits: [],
                            racialTraits: [],
                        },
                        name: "",
                        currentHP: "",
                        stats: {
                            ac: "",
                            hitDice: "",
                            initiative: "",
                            maxHP: "",
                            passivePerception: "",
                            proficiencyBonus: "",

                            primaryStats: {
                                str: "",
                                dex: "",
                                con: "",
                                int: "",
                                wis: "",
                                cha: "",
                            },
                            primaryMods: {
                                str: "",
                                dex: "",
                                con: "",
                                int: "",
                                wis: "",
                                cha: "",
                            },
                            saveThrows: {
                                str: "",
                                dex: "",
                                con: "",
                                int: "",
                                wis: "",
                                cha: "",
                            },
                            skills: {
                                acrobatics: "",
                                animalHandling: "",
                                arcana: "",
                                athletics: "",
                                deception: "",
                                history: "",
                                insight: "",
                                intimidation: "",
                                medicine: "",
                                nature: "",
                                perception: "",
                                performance: "",
                                persuasion: "",
                                religion: "",
                                sleightOfHand: "",
                                stealth: "",
                                survival: "",
                            },
                        },
                    },
                },
            })
        );
    };

    return (
        <motion.form
            className={`grid h-full w-full grid-rows-[.2fr_1fr] gap-5 overflow-hidden`}
            onSubmit={(e) => handleSubmit(e)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {!isContinue && (
                <BoxSection styles="absolute inset-0 bg-opacity-80 p-20 justify-center flex-col gap-5 items-center text-start z-[999]">
                    <h1>Create new or continue where you left off?</h1>
                    <div className="flex gap-5">
                        <button
                            onClick={(e) => handleNewCharacter(e)}
                            className="btn btn-ghost border-2 border-primary text-primary hover:border-primary hover:bg-primary hover:text-base-100"
                        >
                            Create New
                        </button>
                        <button
                            onClick={() => setIsContinue(true)}
                            className="btn btn-ghost border-2 border-primary text-primary hover:border-primary hover:bg-primary hover:text-base-100"
                            disabled={localStorage.getItem("newCharacter") ? false : true}
                        >
                            Continue
                        </button>
                    </div>
                </BoxSection>
            )}

            <CreateCharacterProfile isSave={isSave} isNewCharacter={isNewCharacter} isContinue={isContinue} />

            <section className={`flex w-[100%] gap-5`}>
                <BoxSection styles="w-[50%] flex flex-col gap-5 p-5 relative">
                    <CreateCharacterStats isSave={isSave} isNewCharacter={isNewCharacter} isContinue={isContinue} />
                </BoxSection>
                <div className={`flex h-full w-[50%] flex-col gap-5`}>
                    <BoxSection styles="w-full h-1/2 flex justify-between items-center p-5 text-start relative">
                        <CreateCharacterPassiveStats
                            isSave={isSave}
                            isNewCharacter={isNewCharacter}
                            isContinue={isContinue}
                        />
                    </BoxSection>
                    {/* <BoxSection styles="w-full h-1/2 flex justify-start items-center p-5 text-start relative">
                        <CreateCharacterAvatar />
                    </BoxSection> */}
                    {/* <Notes /> */}
                </div>

                <button
                    type="submit"
                    className="align-self-end btn btn-ghost w-[2%] self-center rounded-lg border-2 border-slate-900 bg-base-300 text-neutral"
                    onClick={() => setIsSave(true)}
                >
                    {`>`}
                </button>
            </section>
        </motion.form>
    );
}
