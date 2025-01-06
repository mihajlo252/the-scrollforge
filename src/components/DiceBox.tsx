import { useState } from "react";

import DiceBox from "@3d-dice/dice-box";

const diceBox = new DiceBox({
    assetPath: "/dash-and-play/assets/",
});
diceBox.init();

export const DiceBoxComponent = () => {
    const [diceResult, setDiceResult] = useState(0);
    const [resultArray, setResultArray] = useState<number[]>([]);
    const [show, setShow] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const showDiceBox = () => {
        setShow(!show);
    };

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
            <button type="button" className="btn btn-primary w-full" onClick={showDiceBox}>
                Dice
            </button>
            <div className={`${show ? "visible opacity-1" : "invisible opacity-0"} transition-all inset-0 absolute`} onClick={showDiceBox}></div>
            <div
                className={`${show ? "visible opacity-1" : "invisible opacity-0"} transition-all rounded-md border-slate-700 border-2 bg-slate-900 flex flex-col gap-2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-max p-2 h-max`}
            >
                <input
                    type="number"
                    className="input input-bordered w-full"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    value={quantity}
                    placeholder="Quantity"
                />
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(4)}>
                        D4
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(6)}>
                        D6
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(8)}>
                        D8
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(10)}>
                        D10
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(20)}>
                        D20
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => throwDice(100)}>
                        D100
                    </button>
                </div>
                <p className="text-2xl text-neutral">{resultArray.join(" + ")} = {diceResult}</p>
            </div>
        </div>
    );
};
