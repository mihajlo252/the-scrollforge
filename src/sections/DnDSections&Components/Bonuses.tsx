import React, { useState } from "react";
import { calculateModifiers, calculatePassivePerception, calculateProficiencyBonus } from "../../utilities/calculateStats";

export const Bonuses = ({ character, setStatChange }: { character: Character; setStatChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const {
        characterProfile: { level },
        stats: {
            ac,
            hitDice,
            primaryStats: { wis, dex },
            skillProficiency: { perception },
        },
    } = character;
    const [characterAC, setCharacterAC] = useState<number>(ac);
    const [characterHitDice, setCharacteHitDice] = useState<string>(hitDice);
    let proficiencyBonus: number = parseInt(calculateProficiencyBonus({ level: level }) || "0");
    const handleChange = (e: any, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
        e.target.value[0] === "0" && (e.target.value = e.target.value.slice(1));
        setFunc(e.target.value);
        const {state} = JSON.parse(localStorage.getItem("character")!);
        const mHP = state.character.stats.maxHP;
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    character: {
                        ...character,
                        stats: { ...character.stats, [e.target.name]: e.target.value, maxHP: mHP },
                    },
                },
                version: 0,
            })
        );
        setStatChange(true);
    };

    return (
        <ul className="flex w-full flex-col items-start">
            <li>
                {" "}
                Passive Perception:{" "}
                <span className="text-primary">+{calculatePassivePerception({ stat: wis, proficiencyBonus, proficiency: perception })}</span>
            </li>
            <li>
                {" "}
                Proficiency: <span className="text-primary">+{calculateProficiencyBonus({ level: character.characterProfile.level })}</span>
            </li>
            <li>
                {" "}
                Initiative: <span className="text-primary">+{calculateModifiers({ stat: dex })}</span>
            </li>
            <li>
                {" "}
                AC:{" "}
                <input
                    type="number"
                    placeholder="0"
                    name="ac"
                    className="max-w-[4ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
                    value={characterAC ?? ""}
                    onChange={(e) => handleChange(e, setCharacterAC)}
                />
            </li>
            <li>
                {" "}
                Hit Dice:{" "}
                <input
                    type="text"
                    placeholder="0"
                    name="hitDice"
                    className="max-w-[6ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
                    value={characterHitDice ?? ""}
                    onChange={(e) => handleChange(e, setCharacteHitDice)}
                />
            </li>
        </ul>
    );
};
