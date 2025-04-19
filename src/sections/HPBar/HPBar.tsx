import React, { useState } from "react";
import { sendData } from "../../utilities/sendData";
export const HPBar = ({ maxHP: mHP, characterID }: { maxHP: number; characterID: string }) => {
    const { state } = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character"))));
    const [scale, setScale] = useState((state.character.currentHP / 100) * (100 / mHP));
    const [HP, setHP] = useState(state.character.currentHP);
    const [newHP, setNewHP] = useState(state.character.currentHP);
    const [save, setSave] = useState(false);
    const [maxHP, setMaxHP] = useState(mHP);

    const scaleHP = (e: any) => {
        setScale((parseInt(e.target.value) / 100) * (100 / maxHP));
        setHP(parseInt(e.target.value));
        if (save === false) {
            setSave(true);
        }
        if (save === true && parseInt(e.target.value) === newHP) {
            setSave(false);
        }
    };

    const decreaseHP = () => {
        if (HP !== 0) {
            setScale(((HP - 1) / 100) * (100 / maxHP));
            setHP(HP - 1);
            if (save === false) {
                setSave(true);
            }
            if (save === true && HP - 1 === newHP) {
                setSave(false);
            }
        }
    };

    const increaseHP = () => {
        if (HP < maxHP) {
            setScale(((HP + 1) / 100) * (100 / maxHP));
            setHP(HP + 1);
            if (save === false) {
                setSave(true);
            }
            if (save === true && HP + 1 === newHP) {
                setSave(false);
            }
        }
    };

    const saveCurrentHP = async (e: HTMLFormElement, health: number) => {
        e.preventDefault();
        await sendData("characters", characterID, { currentHP: health, stats: { ...state.character.stats, maxHP: maxHP } });

        setNewHP(health);
        state.character.currentHP = health;
        localStorage.setItem("character", JSON.stringify({ state: state }));
        if (save === true) {
            setSave(false);
        }
    };
    const saveMaxHP = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const health = parseInt(e.target.value);
        
        setMaxHP(health);
        setHP(health)
        scaleHP({ target: { value: HP } });

        // state.character.stats.maxHP = health;
        // localStorage.setItem("character", JSON.stringify({ state: state }));
        // if (save === true) {
        //     setSave(false);
        // }
        if (save === false) {
            setSave(true);
        }
        if (save === true && parseInt(e.target.value) === newHP) {
            setSave(false);
        }
    };

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-around gap-5">
            <form className="flex items-center gap-2" onSubmit={(e: any) => saveCurrentHP(e, HP)}>
                <label htmlFor="maxHP">Max HP:</label>
                <input type="number" value={maxHP} id="maxHP" onChange={(e) => saveMaxHP(e)} className="input input-bordered w-[10ch]" />
                {save && (
                    <button
                        type="submit"
                        className="btn btn-ghost absolute right-0 top-0 border-2 border-accent text-accent hover:border-accent hover:bg-accent hover:text-base-100"
                    >
                        Save
                    </button>
                )}
            </form>

            <div className="flex items-center gap-1">
                <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-[100vh] border-[.3rem] border-neutral">
                    <div
                        className={`h-full w-full origin-bottom bg-gradient-to-b from-[#5f0000] to-[#290a0a]`}
                        style={{ transform: `scaleY(${scale})` }}
                    ></div>
                    <p className="user-select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{HP}</p>
                    <input
                        type="range"
                        value={HP}
                        className={`absolute left-1/2 top-0 h-[7.5rem] w-full -translate-x-1/2 -rotate-90 touch-none opacity-0`}
                        min={0}
                        max={maxHP}
                        step={1}
                        onChange={(e) => scaleHP(e)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <button className="btn btn-primary" onClick={increaseHP}>
                        +
                    </button>
                    <button className="btn btn-primary" onClick={decreaseHP}>
                        -
                    </button>
                </div>
            </div>
        </div>
    );
};
