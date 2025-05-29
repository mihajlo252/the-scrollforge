import { useState } from "react";

import DiceBox from "@3d-dice/dice-box";
import { Popup } from "./Popup";

const diceBox = new DiceBox({
    assetPath: "/the-scrollforge/assets/",
});
diceBox.init();

export const DiceBoxComponent = () => {
    const [diceResult, setDiceResult] = useState(0);
    const [resultArray, setResultArray] = useState<number[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [showDice, setShowDice] = useState(false);

    const throwDice = (dice: number) => {
        setResultArray([]);
        setDiceResult(0);
        const canvas: any = document.querySelector(".dice-box-canvas");
        canvas.style.opacity = "1";
        diceBox.roll(`${quantity}d${dice}`);
        diceBox.onRollComplete = (rollResult: Array<any>) => {
            rollResult.forEach((result) => {
                result.rolls.forEach((roll: any) => {
                    setResultArray((prev) => [...prev, roll.value]);
                });
            })
            let result = rollResult.map((result) =>
                result.rolls.reduce((acc: number, cur: { value: number }) => acc + cur.value, 0)
            );
            setDiceResult(result[0]);
            canvas.style.opacity = "0";
            setTimeout(() => {
                diceBox.clear();
            }, 500);
        };
    };

    return (
        <div className="w-full">
            <div
                className={`flex flex-col gap-2`}
            >
                <input
                    type="number"
                    className="input input-bordered h-min w-full"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    value={quantity}
                    placeholder="Quantity"
                />
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(4)}>
                        D4
                    </button>
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(6)}>
                        D6
                    </button>
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(8)}>
                        D8
                    </button>
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(10)}>
                        D10
                    </button>
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(20)}>
                        D20
                    </button>
                    <button type="button" className="btn btn-primary h-[2rem] min-h-[2rem]" onClick={() => throwDice(100)}>
                        D100
                    </button>
                </div>
                <p className="text-neutral">{resultArray.length > 4 ? <button type="button" className="text-primary" onClick={() => setShowDice(true)}>Show Dice</button> : resultArray.join(" + ")} = {diceResult}</p>
            </div>
            {showDice && (
            <Popup closerFunc={setShowDice}>
                <p className="text-2xl">{resultArray.join(" + ")} = {diceResult}</p>
            </Popup>
            )}
        </div>
    );
};
