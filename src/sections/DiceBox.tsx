import { useState } from "react";

import DiceBox from "@3d-dice/dice-box";
import { Popup } from "../components/Popup/Popup";
import styles from "./DiceBox.module.css";

// Renders into the dedicated full-screen overlay div in index.html.
const diceBox = new DiceBox({
  container: "#dice-box",
  assetPath: `${import.meta.env.BASE_URL}assets/`,
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
    const overlay = document.getElementById("dice-box");
    overlay?.classList.add("rolling");
    diceBox.roll(`${quantity}d${dice}`);
    diceBox.onRollComplete = (rollResult: Array<any>) => {
      rollResult.forEach((result) => {
        result.rolls.forEach((roll: any) => {
          setResultArray((prev) => [...prev, roll.value]);
        });
      });
      let result = rollResult.map((result) => result.rolls.reduce((acc: number, cur: { value: number }) => acc + cur.value, 0));
      setDiceResult(result[0]);
      // Fade the overlay out, then clear the settled dice once it's invisible.
      overlay?.classList.remove("rolling");
      setTimeout(() => {
        diceBox.clear();
      }, 500);
    };
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.col}>
        <input
          type="number"
          className="input"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          value={quantity}
          placeholder="Quantity"
        />
        <div className={styles.grid}>
          {[4, 6, 8, 10, 12, 20, 100].map((d) => (
            <button key={d} type="button" className="button button-primary short" onClick={() => throwDice(d)}>
              D{d}
            </button>
          ))}
        </div>
        <p className={styles.result}>
          {resultArray.length > 4 ? (
            <button type="button" className={styles.link} onClick={() => setShowDice(true)}>
              Show Dice
            </button>
          ) : (
            resultArray.join(" + ")
          )}{" "}
          = {diceResult}
        </p>
      </div>
      <Popup closerFunc={setShowDice} toggle={showDice}>
        <p className={styles.popupResult}>
          {resultArray.join(" + ")} = {diceResult}
        </p>
      </Popup>
    </div>
  );
};
