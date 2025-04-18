import React, { useState } from "react";
import { calculateSaves, calculateSkills } from "../../utilities/calculateStats";

export const Stats = ({ character, setStatChange }: { character: Character, setStatChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const {
        stats: { primaryStats, proficiencyBonus, saveThrowsProficiency, skillProficiency },
    } = character;
    const [acrobaticsProficiency, setAcrobaticsProficiency] = useState(skillProficiency.acrobatics);
    const [animalHandlingProficiency, setAnimalHandlingProficiency] = useState(skillProficiency.animalHandling);
    const [arcanaProficiency, setArcanaProficiency] = useState(skillProficiency.arcana);
    const [athleticsProficiency, setAthleticsProficiency] = useState(skillProficiency.athletics);
    const [deceptionProficiency, setDeceptionProficiency] = useState(skillProficiency.deception);
    const [historyProficiency, setHistoryProficiency] = useState(skillProficiency.history);
    const [insightProficiency, setInsightProficiency] = useState(skillProficiency.insight);
    const [intimidationProficiency, setIntimidationProficiency] = useState(skillProficiency.intimidation);
    const [investigationProficiency, setInvestigationProficiency] = useState(skillProficiency.investigation);
    const [medicineProficiency, setMedicineProficiency] = useState(skillProficiency.medicine);
    const [natureProficiency, setNatureProficiency] = useState(skillProficiency.nature);
    const [perceptionProficiency, setPerceptionProficiency] = useState(skillProficiency.perception);
    const [performanceProficiency, setPerformanceProficiency] = useState(skillProficiency.performance);
    const [persuasionProficiency, setPersuasionProficiency] = useState(skillProficiency.persuasion);
    const [religionProficiency, setReligionProficiency] = useState(skillProficiency.religion);
    const [sleightOfHandProficiency, setSleightOfHandProficiency] = useState(skillProficiency.sleightOfHand);
    const [stealthProficiency, setStealthProficiency] = useState(skillProficiency.stealth);
    const [survivalProficiency, setSurvivalProficiency] = useState(skillProficiency.survival);

    const setLocalProficiency = (skill: string, value: string) => {
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    character: {
                        ...character,
                        stats: { ...character.stats, skillProficiency: { ...character.stats.skillProficiency, [skill]: value } },
                    },
                },
                version: 0,
            })
        );
    };

    const toggleProficiency = (skill: string, setFunc: React.Dispatch<React.SetStateAction<string>>) => {
        if (skillProficiency[skill as keyof SkillProficiency] === "") {
            setFunc("proficient")
            setLocalProficiency(skill, "proficient");
        } else if (skillProficiency[skill as keyof SkillProficiency] === "proficient") {
            setFunc("expert")
            setLocalProficiency(skill, "expert");
        } else {
            setFunc("")
            setLocalProficiency(skill, "");
        }
        setStatChange(true);
    };

    return (
        <>
            <div className="flex w-full flex-col items-center gap-2">
                <h3 className="text-[1.875rem] underline">Saving throws</h3>

                <ul className="flex gap-2 text-[1.25rem]">
                    <li className="flex flex-col">
                        STR
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.str, proficiencyBonus, prificiency: saveThrowsProficiency.str })}
                        </span>
                    </li>
                    <li className="flex flex-col">
                        DEX
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.dex, proficiencyBonus, prificiency: saveThrowsProficiency.dex })}
                        </span>
                    </li>
                    <li className="flex flex-col">
                        CON
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.con, proficiencyBonus, prificiency: saveThrowsProficiency.con })}
                        </span>
                    </li>
                    <li className="flex flex-col">
                        INT
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.int, proficiencyBonus, prificiency: saveThrowsProficiency.int })}
                        </span>
                    </li>
                    <li className="flex flex-col">
                        WIS
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.wis, proficiencyBonus, prificiency: saveThrowsProficiency.wis })}
                        </span>
                    </li>
                    <li className="flex flex-col">
                        CHA
                        <span className="text-primary">
                            +{calculateSaves({ stat: primaryStats.cha, proficiencyBonus, prificiency: saveThrowsProficiency.cha })}
                        </span>
                    </li>
                </ul>
            </div>
            <div className="flex w-full flex-col items-center gap-1">
                <h3 className="text-[1.875rem] underline">Skills</h3>

                <div className="flex flex-row items-center gap-2">
                    <ul className="flex flex-col items-end justify-end border-r-[1px] border-primary border-opacity-50 text-[0.85rem]">
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${acrobaticsProficiency === "proficient" ? "text-primary" : acrobaticsProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("acrobatics", setAcrobaticsProficiency)}></button>
                            Acrobatics (Dex)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.dex, proficiencyBonus, proficiency: skillProficiency.acrobatics })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${animalHandlingProficiency === "proficient" ? "text-primary" : animalHandlingProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("animalHandling", setAnimalHandlingProficiency)}></button>
                            Animal Handling (Wis)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.wis, proficiencyBonus, proficiency: skillProficiency.animalHandling })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${arcanaProficiency === "proficient" ? "text-primary" : arcanaProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("arcana", setArcanaProficiency)}></button>
                            Arcana (Int)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.int, proficiencyBonus, proficiency: skillProficiency.arcana })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${athleticsProficiency === "proficient" ? "text-primary" : athleticsProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("athletics", setAthleticsProficiency)}></button>
                            Athletics (Str)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.str, proficiencyBonus, proficiency: skillProficiency.athletics })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${deceptionProficiency === "proficient" ? "text-primary" : deceptionProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("deception", setDeceptionProficiency)}></button>
                            Deception (Cha)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.cha, proficiencyBonus, proficiency: skillProficiency.deception })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${historyProficiency === "proficient" ? "text-primary" : historyProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("history", setHistoryProficiency)}></button>
                            History (Int)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.int, proficiencyBonus, proficiency: skillProficiency.history })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${insightProficiency === "proficient" ? "text-primary" : insightProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("insight", setInsightProficiency)}></button>
                            Insight (Wis)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.wis, proficiencyBonus, proficiency: skillProficiency.insight })}
                            </span>
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${intimidationProficiency === "proficient" ? "text-primary" : intimidationProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("intimidation", setIntimidationProficiency)}></button>
                            Intimidation (Cha)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.cha, proficiencyBonus, proficiency: skillProficiency.intimidation })}
                            </span>
                        </li>
                        <li className={`relative flex ${investigationProficiency === "proficient" ? "text-primary" : investigationProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("investigation", setInvestigationProficiency)}></button>
                            Investigation (Int)
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.int, proficiencyBonus, proficiency: skillProficiency.investigation })}
                            </span>
                        </li>
                    </ul>
                    <ul className="flex flex-col items-start border-l-[1px] border-primary border-opacity-50 text-[0.85rem]">
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${medicineProficiency === "proficient" ? "text-primary" : medicineProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("medicine", setMedicineProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.wis, proficiencyBonus, proficiency: skillProficiency.medicine })}
                            </span>
                            Medicine (Wis)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${natureProficiency === "proficient" ? "text-primary" : natureProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("nature", setNatureProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.int, proficiencyBonus, proficiency: skillProficiency.nature })}
                            </span>
                            Nature (Int)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${perceptionProficiency === "proficient" ? "text-primary" : perceptionProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("perception", setPerceptionProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.wis, proficiencyBonus, proficiency: skillProficiency.perception })}
                            </span>
                            Perception (Wis)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${performanceProficiency === "proficient" ? "text-primary" : performanceProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("performance", setPerformanceProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.cha, proficiencyBonus, proficiency: skillProficiency.performance })}
                            </span>
                            Performance (Cha)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${persuasionProficiency === "proficient" ? "text-primary" : persuasionProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("persuasion", setPersuasionProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.cha, proficiencyBonus, proficiency: skillProficiency.persuasion })}
                            </span>
                            Persuasion (Cha)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${religionProficiency === "proficient" ? "text-primary" : religionProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("religion", setReligionProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.int, proficiencyBonus, proficiency: skillProficiency.religion })}
                            </span>
                            Religion (Int)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${sleightOfHandProficiency === "proficient" ? "text-primary" : sleightOfHandProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("sleightOfHand", setSleightOfHandProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.dex, proficiencyBonus, proficiency: skillProficiency.sleightOfHand })}
                            </span>
                            Sleight of Hand (Dex)
                        </li>
                        <li className={`relative flex border-b-[1px] border-primary border-opacity-50 ${survivalProficiency === "proficient" ? "text-primary" : survivalProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("survival", setSurvivalProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.wis, proficiencyBonus, proficiency: skillProficiency.survival })}
                            </span>
                            Survival (Wis)
                        </li>
                        <li className={`relative flex ${stealthProficiency === "proficient" ? "text-primary" : stealthProficiency === "expert" ? "text-secondary" : ""}`}>
                            <button type="button" className="absolute inset-0 left-0 top-0 m-0 p-0 opacity-0" onClick={() => toggleProficiency("stealth", setStealthProficiency)}></button>
                            <span className="w-[3ch] px-1 text-primary">
                                +{calculateSkills({ stat: primaryStats.dex, proficiencyBonus, proficiency: skillProficiency.stealth })}
                            </span>
                            Stealth (Dex)
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
