import { useEffect, useState } from "react";

export const CreateCharacterStats = ({
    isSave,
    isNewCharacter,
    isContinue,
}: {
    isSave: boolean;
    isNewCharacter: boolean;
    isContinue: boolean;
}) => {
    const { state } = JSON.parse(localStorage.getItem("newCharacter") || "{}");
    const [str, setStr] = useState<number>(state?.character.stats.saveThrows.str);
    const [dex, setDex] = useState<number>(state?.character.stats.saveThrows.dex);
    const [con, setCon] = useState<number>(state?.character.stats.saveThrows.con);
    const [int, setInt] = useState<number>(state?.character.stats.saveThrows.int);
    const [wis, setWis] = useState<number>(state?.character.stats.saveThrows.wis);
    const [cha, setCha] = useState<number>(state?.character.stats.saveThrows.cha);
    const [acrobatics, setAcrobatics] = useState<number>(state?.character.stats.skills.acrobatics);
    const [animalHandling, setAnimalHandling] = useState<number>(state?.character.stats.skills.animalHandling);
    const [arcana, setArcana] = useState<number>(state?.character.stats.skills.arcana);
    const [athletics, setAthletics] = useState<number>(state?.character.stats.skills.arcana)
    const [deception, setDeception] = useState<number>(state?.character.stats.skills.arcana)
    const [history, setHistory] = useState<number>(state?.character.stats.skills.arcana)
    const [insight, setInsight] = useState<number>(state?.character.stats.skills.arcana)
    const [intimidation, setIntimidation] = useState<number>(state?.character.stats.skills.arcana)
    const [investigation, setInvestigation] = useState<number>(state?.character.stats.skills.arcana)
    const [medicine, setMedicine] = useState<number>(state?.character.stats.skills.arcana)
    const [nature, setNature] = useState<number>(state?.character.stats.skills.arcana);
    const [perception, setPerception] = useState<number>(state?.character.stats.skills.arcana)
    const [performance, setPerformance] = useState<number>(state?.character.stats.skills.arcana)
    const [persuasion, setPersuasion] = useState<number>(state?.character.stats.skills.arcana)
    const [religion, setReligion] = useState<number>(state?.character.stats.skills.arcana)
    const [sleightOfHand, setSleightOfHand] = useState<number>(state?.character.stats.skills.arcana)
    const [survival, setSurvival] = useState<number>(state?.character.stats.skills.arcana)
    const [stealth, setStealth] = useState<number>(state?.character.stats.skills.arcana)

    const handleChange = (e: any, setFunc: any) => {
        e.target.style.width = e.target.value.length + "ch";
        if (e.target.value.length == 0) {
            e.target.style.width = "1ch";
        }
        setFunc(e.target.value);
    };

    const handleSave = () => {
        // e.preventDefault();

        localStorage.setItem(
            "newCharacter",
            JSON.stringify({
                state: {
                    character: {
                        ...JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character,

                        stats: {
                            ...JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character.stats,
                            saveThrows: {
                                str: str,
                                dex: dex,
                                con: con,
                                int: int,
                                wis: wis,
                                cha: cha,
                            },
                            skills: {
                                acrobatics: acrobatics,
                                animalHandling: animalHandling,
                                arcana: arcana,
                                athletics: athletics,
                                deception: deception,
                                history: history,
                                insight: insight,
                                intimidation: intimidation,
                                medicine: medicine,
                                nature: nature,
                                perception: perception,
                                performance: performance,
                                persuasion: persuasion,
                                religion: religion,
                                sleightOfHand: sleightOfHand,
                                stealth: stealth,
                                survival: survival,
                            },
                        },
                    },
                },
            })
        );
    };

    const handleSetNull = ({ setFunc } : { setFunc: any }) => {
        setFunc("");
    };
    
    useEffect(() => {
        if (isSave) {
            handleSave();
        }
    }, [isSave]);
    
    useEffect(() => {
        if (isContinue) {
            const inputs = document.querySelectorAll("input");
            if (isNewCharacter) {
                inputs.forEach((input) => {
                    input.value = "";
                });
                handleSetNull({ setFunc: setStr });
                handleSetNull({ setFunc: setDex });
                handleSetNull({ setFunc: setCon });
                handleSetNull({ setFunc: setInt });
                handleSetNull({ setFunc: setWis });
                handleSetNull({ setFunc: setCha });
                handleSetNull({ setFunc: setAcrobatics });
                handleSetNull({ setFunc: setAnimalHandling });
                handleSetNull({ setFunc: setArcana });
                handleSetNull({ setFunc: setAthletics });
                handleSetNull({ setFunc: setDeception });
                handleSetNull({ setFunc: setHistory });
                handleSetNull({ setFunc: setInsight });
                handleSetNull({ setFunc: setIntimidation });
                handleSetNull({ setFunc: setInvestigation });
                handleSetNull({ setFunc: setMedicine });
                handleSetNull({ setFunc: setNature });
                handleSetNull({ setFunc: setPerception });
                handleSetNull({ setFunc: setPerformance });
                handleSetNull({ setFunc: setPersuasion });
                handleSetNull({ setFunc: setReligion });
                handleSetNull({ setFunc: setSleightOfHand });
                handleSetNull({ setFunc: setSurvival });
                handleSetNull({ setFunc: setStealth });
            }
        }
    }, [isContinue]);

    return (
        <>
            <div className="flex w-full flex-col items-center gap-1">
                <h3 className="text-[1.875rem] underline">Saving throws</h3>

                <ul className="flex gap-2 text-[1.25rem]">
                    <li className="flex flex-col">
                        STR
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={str ?? ""}
                                onChange={(e) => handleChange(e, setStr)}
                            />
                        </span>
                    </li>
                    <li className="flex flex-col">
                        DEX
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={dex ?? ""}
                                onChange={(e) => handleChange(e, setDex)}
                            />
                        </span>
                    </li>
                    <li className="flex flex-col">
                        CON
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={con ?? ""}
                                onChange={(e) => handleChange(e, setCon)}
                            />
                        </span>
                    </li>
                    <li className="flex flex-col">
                        INT
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={int ?? ""}
                                onChange={(e) => handleChange(e, setInt)}
                            />
                        </span>
                    </li>
                    <li className="flex flex-col">
                        WIS
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={wis ?? ""}
                                onChange={(e) => handleChange(e, setWis)}
                            />
                        </span>
                    </li>
                    <li className="flex flex-col">
                        CHA
                        <span>
                            +
                            <input
                                type="number"
                                required
                                placeholder="0"
                                className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                value={cha ?? ""}
                                onChange={(e) => handleChange(e, setCha)}
                            />
                        </span>
                    </li>
                </ul>
            </div>
            <div className="flex w-full flex-col items-center gap-1">
                <h3 className="text-[1.875rem] underline">Skills</h3>

                <div className="flex items-center gap-1">
                    <ul className="flex flex-col text-[0.85rem]">
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={acrobatics ?? ""}
                                    onChange={(e) => handleChange(e, setAcrobatics)}
                                />
                            </span>
                            Acrobatics (Dex)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={animalHandling ?? ""}
                                    onChange={(e) => handleChange(e, setAnimalHandling)}
                                />
                            </span>
                            Animal Handling (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={arcana ?? ""}
                                    onChange={(e) => handleChange(e, setArcana)}
                                />
                            </span>
                            Arcana (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={athletics ?? ""}
                                    onChange={(e) => handleChange(e, setAthletics)}
                                />
                            </span>
                            Athletics (Str)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={deception ?? ""}
                                    onChange={(e) => handleChange(e, setDeception)}
                                />
                            </span>
                            Deception (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={history ?? ""}
                                    onChange={(e) => handleChange(e, setHistory)}
                                />
                            </span>
                            History (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={insight ?? ""}
                                    onChange={(e) => handleChange(e, setInsight)}
                                />
                            </span>
                            Insight (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={intimidation ?? ""}
                                    onChange={(e) => handleChange(e, setIntimidation)}
                                />
                            </span>
                            Intimidation (Cha)
                        </li>
                        <li className="flex gap-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={investigation ?? ""}
                                    onChange={(e) => handleChange(e, setInvestigation)}
                                />
                            </span>
                            Investigation (Int)
                        </li>
                    </ul>
                    <ul className="flex flex-col text-[0.85rem]">
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={medicine ?? ""}
                                    onChange={(e) => handleChange(e, setMedicine)}
                                />
                            </span>
                            Medicine (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={nature ?? ""}
                                    onChange={(e) => handleChange(e, setNature)}
                                />
                            </span>
                            Nature (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={perception ?? ""}
                                    onChange={(e) => handleChange(e, setPerception)}
                                />
                            </span>
                            Perception (Wis)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={performance ?? ""}
                                    onChange={(e) => handleChange(e, setPerformance)}
                                />
                            </span>
                            Performance (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={persuasion ?? ""}
                                    onChange={(e) => handleChange(e, setPersuasion)}
                                />
                            </span>
                            Persuasion (Cha)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={religion ?? ""}
                                    onChange={(e) => handleChange(e, setReligion)}
                                />
                            </span>
                            Religion (Int)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={sleightOfHand ?? ""}
                                    onChange={(e) => handleChange(e, setSleightOfHand)}
                                />
                            </span>
                            Sleight of Hand (Dex)
                        </li>
                        <li className="flex gap-2 border-b-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={survival ?? ""}
                                    onChange={(e) => handleChange(e, setSurvival)}
                                />
                            </span>
                            Survival (Wis)
                        </li>
                        <li className="flex gap-2">
                            <span className="border-r-2 pr-2">
                                +
                                <input
                                    type="text"
                                    required
                                    placeholder="0"
                                    className="w-[1ch] max-w-[2ch] bg-transparent text-primary focus-within:outline-0"
                                    value={stealth ?? ""}
                                    onChange={(e) => handleChange(e, setStealth)}
                                />
                            </span>
                            Stealth (Dex)
                        </li>
                    </ul>
                </div>
                {/* <button type="button" className="btn btn-ghost absolute right-5 top-5 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100" onClick={(e) => handleSave(e)}>
                    Save
                </button> */}
            </div>
        </>
    );
};
