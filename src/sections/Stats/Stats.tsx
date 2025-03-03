



export const Stats = ({ saveThrows, skills,}: {saveThrows: Values, skills: Skills}) => {
    return (
        <>
            <div className="flex w-full flex-col items-center gap-1">
                <h3 className="text-[1.875rem] underline">Saving throws</h3>

                <ul className="flex gap-2 text-[1.25rem]">
                    <li className="flex flex-col">
                        STR<span>+{saveThrows.str}</span>
                    </li>
                    <li className="flex flex-col">
                        DEX<span>+{saveThrows.dex}</span>
                    </li>
                    <li className="flex flex-col">
                        CON<span>+{saveThrows.con}</span>
                    </li>
                    <li className="flex flex-col">
                        INT<span>+{saveThrows.int}</span>
                    </li>
                    <li className="flex flex-col">
                        WIS<span>+{saveThrows.wis}</span>
                    </li>
                    <li className="flex flex-col">
                        CHA<span>+{saveThrows.cha}</span>
                    </li>
                </ul>
            </div>
            <div className="flex w-full flex-col items-center gap-1">
                <h3 className="text-[1.875rem] underline">Skills</h3>

                <div className="flex flex-row items-center gap-1">
                    <ul className="flex flex-col text-[0.85rem]">
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.acrobatics}
                            </span>
                            Acrobatics (Dex)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.animalHandling}
                            </span>
                            Animal Handling (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.arcana}
                            </span>
                            Arcana (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.athletics}
                            </span>
                            Athletics (Str)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.deception}
                            </span>
                            Deception (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.history}
                            </span>
                            History (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.insight}
                            </span>
                            Insight (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.intimidation}
                            </span>
                            Intimidation (Cha)
                        </li>
                        <li className="flex gap-2">
                            <span className="border-r-2 pr-2">
                                +{skills.investigation}
                            </span>
                            Investigation (Int)
                        </li>
                    </ul>
                    <ul className="flex flex-col text-[0.85rem]">
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.medicine}
                            </span>
                            Medicine (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.nature}
                            </span>
                            Nature (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.perception}
                            </span>
                            Perception (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.performance}
                            </span>
                            Performance (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.persuasion}
                            </span>
                            Persuasion (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.religion}
                            </span>
                            Religion (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.sleightOfHand}
                            </span>
                            Sleight of Hand (Dex)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +{skills.survival}
                            </span>
                            Survival (Wis)
                        </li>
                        <li className="flex gap-2">
                            <span className="border-r-2 pr-2">
                                +{skills.stealth}
                            </span>
                            Stealth (Dex)
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
