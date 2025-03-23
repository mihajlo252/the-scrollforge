import { useEffect, useState } from "react";



export const CreateCharacterProfile = ({isSave, isNewCharacter, isContinue} : {isSave: boolean, isNewCharacter: boolean, isContinue: boolean}) => {
    const { state } = JSON.parse(localStorage.getItem("newCharacter") || "{}");
    const [characterName, setCharacterName] = useState(state?.character.characterProfile.name);
    const [characterLevel, setCharacterLevel] = useState(state?.character.characterProfile.level);
    const [characterClass, setCharacterClass] = useState(state?.character.characterProfile.class);
    const [characterSubclass, setCharacterSubclass] = useState(state?.character.characterProfile.subclass)
    const [characterRace, setCharacterRace] = useState(state?.character.characterProfile.race);
    const [characterSubrace, setCharacterSubrace] = useState(state?.character.characterProfile.subrace)
    const [str, setStr] = useState<number>(state?.character.stats.primaryStats.str);
    const [dex, setDex] = useState<number>(state?.character.stats.primaryStats.dex);
    const [con, setCon] = useState<number>(state?.character.stats.primaryStats.con);
    const [int, setInt] = useState<number>(state?.character.stats.primaryStats.int);
    const [wis, setWis] = useState<number>(state?.character.stats.primaryStats.wis);
    const [cha, setCha] = useState<number>(state?.character.stats.primaryStats.cha);
    const [strMod, setStrMod] = useState<number>(state?.character.stats.primaryMods.str);
    const [dexMod, setDexMod] = useState<number>(state?.character.stats.primaryMods.dex);
    const [conMod, setConMod] = useState<number>(state?.character.stats.primaryMods.con);
    const [intMod, setIntMod] = useState<number>(state?.character.stats.primaryMods.int);
    const [wisMod, setWisMod] = useState<number>(state?.character.stats.primaryMods.wis);
    const [chaMod, setChaMod] = useState<number>(state?.character.stats.primaryMods.cha);

    const handleChange = (e: any, setFunc: any) => {
        e.target.style.width = e.target.value.length + "ch";
        if (e.target.value.length == 0) {
            e.target.style.width = "7ch";
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
                        ...JSON.parse(localStorage.getItem("newCharacter") || '{}').state.character,
                        name: characterName,
                        characterProfile :{
                            name: characterName,
                            level: characterLevel,
                            class: characterClass,
                            subclass: characterSubclass,
                            race: characterRace,
                            subrace: characterSubrace,
                        },
                        stats: {
                            ...JSON.parse(localStorage.getItem("newCharacter") || '{}').state.character.stats,
                            primaryStats: {
                                str: str,
                                dex: dex,
                                con: con,
                                int: int,
                                wis: wis,
                                cha: cha,
                            },
                            primaryMods: {
                                str: strMod,
                                dex: dexMod,
                                con: conMod,
                                int: intMod,
                                wis: wisMod,
                                cha: chaMod,
                            }
                        },
                    },
                },
            })
        )
    };

    useEffect(() => {
        if (isSave) {
            handleSave();
        }
    }, [isSave])

    const handleSetNull = ({ setFunc } : { setFunc: any }) => {
        setFunc("");
    };
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
                handleSetNull({ setFunc: setStrMod });
                handleSetNull({ setFunc: setDexMod });
                handleSetNull({ setFunc: setConMod });
                handleSetNull({ setFunc: setIntMod });
                handleSetNull({ setFunc: setWisMod });
                handleSetNull({ setFunc: setChaMod });
                handleSetNull({ setFunc: setCharacterName });
                handleSetNull({ setFunc: setCharacterLevel });
                handleSetNull({ setFunc: setCharacterClass });
                handleSetNull({ setFunc: setCharacterSubclass });
                handleSetNull({ setFunc: setCharacterRace });
                handleSetNull({ setFunc: setCharacterSubrace });
            } 
        }
    }, [isContinue]);

    
    return (
        <header className="relative grid h-full w-full grid-cols-2 items-center justify-between rounded-lg border-2 border-slate-900 bg-base-300 px-5 text-neutral">
            {/* <button type="button" className="btn btn-ghost absolute right-5 top-5 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100" onClick={(e) => handleSave(e)}>Save</button> */}
                <div className="flex gap-2">
                    <div className="text-start">
                        <div className="flex">
                            <input
                                type="text"
                                // required
                                placeholder="Name"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterName}
                                onChange={(e) => handleChange(e, setCharacterName)}
                            />
                            , &nbsp;Level &nbsp;
                            <input
                                type="text"
                                // required
                                placeholder="0"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterLevel}
                                onChange={(e) => handleChange(e, setCharacterLevel)}
                            />
                        </div>
                        <hr />
                        <div className="flex">
                            <input
                                type="text"
                                // required
                                placeholder="Class"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterClass}
                                onChange={(e) => handleChange(e, setCharacterClass)}
                            />
                            <input
                                type="text"
                                placeholder="Subclass"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterSubclass}
                                onChange={(e) => handleChange(e, setCharacterSubclass)}
                            />
                            , &nbsp;
                            <input
                                type="text"
                                // required
                                placeholder="Race"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterRace}
                                onChange={(e) => handleChange(e, setCharacterRace)}
                            />
                            <input
                                type="text"
                                placeholder="Subrace"
                                className="w-[7ch] bg-transparent text-primary focus-within:outline-0"
                                value={characterSubrace}
                                onChange={(e) => handleChange(e, setCharacterSubrace)}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-2xl">
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
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={str}
                                onChange={(e) => handleChange(e, setStr)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={strMod ?? ""}
                                onChange={(e) => handleChange(e, setStrMod)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-0">
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={dex ?? ""}
                                onChange={(e) => handleChange(e, setDex)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={dexMod ?? ""}
                                onChange={(e) => handleChange(e, setDexMod)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-0">
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={con ?? ""}
                                onChange={(e) => handleChange(e, setCon)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={conMod ?? ""}
                                onChange={(e) => handleChange(e, setConMod)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-0">
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={int ?? ""}
                                onChange={(e) => handleChange(e, setInt)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={intMod ?? ""}
                                onChange={(e) => handleChange(e, setIntMod)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-0">
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={wis ?? ""}
                                onChange={(e) => handleChange(e, setWis)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={wisMod ?? ""}
                                onChange={(e) => handleChange(e, setWisMod)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-0">
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-primary focus-within:outline-0"
                                value={cha ?? ""}
                                onChange={(e) => handleChange(e, setCha)}
                            />
                            <span className="text-sm">+</span>
                            <input
                                type="number"
                                // required
                                placeholder="0"
                                className="max-w-[2ch] bg-transparent text-center text-sm text-primary focus-within:outline-0"
                                value={chaMod ?? ""}
                                onChange={(e) => handleChange(e, setChaMod)}
                            />
                        </div>
                    </div>
                </div>
            </header>
    );
};