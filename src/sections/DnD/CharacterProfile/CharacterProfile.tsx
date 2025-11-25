import React, { useState } from "react";
import { calculateModifiers } from "../../../utilities/calculateStats";
import { BoxSection } from "../../../components/BoxSection";
import { toast } from "../../../utilities/toasterSonner";

export const CharacterProfile = ({ setStatChange }: { setStatChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { state } = JSON.parse(localStorage.getItem("character")!);
    const character = state.character;
    if (!character) return;

    const {
        characterProfile,
        stats: { primaryStats },
    } = character;
    
    const [str, setStr] = useState<number>(primaryStats.str);
    const [dex, setDex] = useState<number>(primaryStats.dex);
    const [con, setCon] = useState<number>(primaryStats.con);
    const [int, setInt] = useState<number>(primaryStats.int);
    const [wis, setWis] = useState<number>(primaryStats.wis);
    const [cha, setCha] = useState<number>(primaryStats.cha);
    const [characterLevel, setCharacterLevel] = useState(characterProfile.level);

    const handleChangeStats = (e: any, setFunc: any) => {
        if (e.target.value.length > 2 || e.target.value > 30) {
            toast({ style: "bg-secondary text-white", message: "You've exceeded the limit!" });
            return 
        };
        e.target.value[0] === "0" && (e.target.value = e.target.value.slice(1));
        if (e.target.value === 0) {
            e.target.value = 0;
        }
        e.target.style.width = e.target.value.length + "ch";
        if (e.target.value.length == 0) {
            e.target.style.width = "7ch";
        }
        setFunc(parseInt(e.target.value));
        const {state} = JSON.parse(localStorage.getItem("character")!);
        const mHP = state.character.stats.maxHP;
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    character: {
                        ...character,
                        stats: { ...character.stats, maxHP: mHP, primaryStats: { ...character.stats.primaryStats, [e.target.name]: parseInt(e.target.value)}},
                    },
                },
                version: 0,
            })
        );
        setStatChange(true);
    };

    const handleChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterLevel(parseInt(e.target.value) || 0);
        const {state} = JSON.parse(localStorage.getItem("character")!);
        const mHP = state.character.stats.maxHP;
        localStorage.setItem(
            "character",
            JSON.stringify({
                state: {
                    character: {
                        ...character,
                        stats: { ...character.stats, maxHP: mHP},
                        characterProfile: { ...character.characterProfile, level: parseInt(e.target.value) || 0 },
                    },
                },
                version: 0,
            })
        );
        setStatChange(true);
    };

    return (
        <BoxSection styles="grid h-full w-full grid-cols-2 items-center justify-between rounded-lg border-2 border-slate-900 bg-base-300 px-5 text-neutral">
            <div className="flex gap-2">
                <div className="text-start">
                    <p>
                        {characterProfile.name}, Level <input
                                type="text"
                                placeholder="0"
                                className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
                                value={characterLevel ?? 0}
                                onChange={(e) => handleChangeLevel(e)}
                            />
                    </p>
                    <hr />
                    <p>
                        {characterProfile.class} {characterProfile.subclass}, {characterProfile.race} {characterProfile.subrace}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-[5px] text-2xl">
                <div className="grid grid-cols-6">
                    <p>STR</p>
                    <p>DEX</p>
                    <p>CON</p>
                    <p>INT</p>
                    <p>WIS</p>
                    <p>CHA</p>
                </div>
                <hr />
                <div className="grid grid-cols-6">
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={str ?? 0}
                            name="str"
                            onChange={(e) => handleChangeStats(e, setStr)}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: str })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            name="dex"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={dex ?? 0}
                            onChange={(e) => handleChangeStats(e, setDex)}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: dex })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            name="con"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={con ?? 0}
                            onChange={(e) => handleChangeStats(e, setCon)}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: con })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            name="int"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={int ?? 0}
                            onChange={(e) => handleChangeStats(e, setInt, )}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: int })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            name="wis"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={wis ?? 0}
                            onChange={(e) => handleChangeStats(e, setWis)}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: wis })}</span>
                    </div>
                    <div className="flex items-center justify-center gap-0">
                        <input
                            type="number"
                            placeholder="0"
                            name="cha"
                            className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center text-base-content focus-within:outline-0"
                            value={cha ?? 0}
                            onChange={(e) => handleChangeStats(e, setCha)}
                        />
                        <span className="text-sm text-primary">{calculateModifiers({ stat: cha })}</span>
                    </div>
                </div>
            </div>
        </BoxSection>
    );
};
