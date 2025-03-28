import { useEffect, useState } from "react";

export const CreateCharacterPassiveStats = ({isSave, isNewCharacter, isContinue} : {isSave: boolean, isNewCharacter: boolean, isContinue: boolean}) => {
    const { state } = JSON.parse(localStorage.getItem("newCharacter") || "{}");
    const [passivePerception, setPassivePerception] = useState<number>(state?.character.stats.passivePerception);
    const [proficiencyBonus, setProficiencyBonus] = useState<number>(state?.character.stats.proficiency);
    const [initiative, setInitiative] = useState<number>(state?.character.stats.initiative);
    const [ac, setAc] = useState<number>(state?.character.stats.ac);
    const [hitDice, setHitDice] = useState(state?.character.stats.hitDice);
    const [maxHP, setMaxHP] = useState<number>(state?.character.stats.maxHP);

    const handleChange = (e: any, setFunc: any) => {
        e.target.style.width = e.target.value.length + "ch";
        if (e.target.value.length == 0) {
            e.target.style.width = "unset";
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
                        currentHP: maxHP,
                        stats: {
                            ...JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character.stats,
                            passivePerception: passivePerception,
                            proficiencyBonus: proficiencyBonus,
                            initiative: initiative,
                            ac: ac,
                            hitDice: hitDice,
                            maxHP: maxHP,
                        },
                    },
                },
            })
        );
    };

    useEffect(() => {
        if (isSave) {
            handleSave();
        }
    }, [isSave]);

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
                    handleSetNull({ setFunc: setPassivePerception });
                    handleSetNull({ setFunc: setProficiencyBonus });
                    handleSetNull({ setFunc: setInitiative });
                    handleSetNull({ setFunc: setAc });
                    handleSetNull({ setFunc: setHitDice });
                    handleSetNull({ setFunc: setMaxHP });
                } 
            }
        }, [isContinue]);

    return (
        <>
            <ul>
                <li>
                    
                    Passive Perception: +
                    <input
                        type="text"
                        // required
                        placeholder="Passive Perception"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={passivePerception ?? ""}
                        onChange={(e) => handleChange(e, setPassivePerception)}
                    />
                </li>
                <li>
                    
                    Proficiency: +
                    <input
                        type="text"
                        // required
                        placeholder="Proficiency"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={proficiencyBonus ?? ""}
                        onChange={(e) => handleChange(e, setProficiencyBonus)}
                    />
                </li>
                <li>
                    
                    Initiative: +
                    <input
                        type="text"
                        // required
                        placeholder="Initiative"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={initiative ?? ""}
                        onChange={(e) => handleChange(e, setInitiative)}
                    />
                </li>
                <li>
                    
                    AC:{" "}
                    <input
                        type="text"
                        // required
                        placeholder="AC"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={ac ?? ""}
                        onChange={(e) => handleChange(e, setAc)}
                    />
                </li>
                <li>
                    
                    Hit Dice:{" "}
                    <input
                        type="text"
                        // required
                        placeholder="Hit Dice (eg. 1d8)"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={hitDice ?? ""}
                        onChange={(e) => handleChange(e, setHitDice)}
                    />
                </li>
                <li>
                    
                    MaxHP:{" "}
                    <input
                        type="text"
                        // required
                        placeholder="MaxHP"
                        className="bg-transparent text-primary focus-within:outline-0"
                        value={maxHP ?? ""}
                        onChange={(e) => handleChange(e, setMaxHP)}
                    />
                </li>
            </ul>
            {/* <button type="button" className="btn btn-ghost absolute right-5 top-5 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100" onClick={(e) => handleSave(e)}>Save</button> */}
        </>
    );
};
