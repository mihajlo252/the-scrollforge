import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../components/BoxSection";
import { Weapon } from "../../components/Weapon";
import React, { useState } from "react";
import { Popup } from "../../components/Popup";
import { sendData } from "../../utilities/sendData";

export const Route = createLazyFileRoute("/dnd/attacks")({
  component: Attacks,
});

function Attacks() {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const { character } = state;
  const [add, setAdd] = useState(false);
  const [attacks, setAttacks] = useState<Attack[]>(character.descriptions.attacks || []);

  const [attackValue, setAttackValue] = useState<Attack>({
    name: "",
    type: "",
    range: "",
    attack: "",
    damage: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    setFunc: React.Dispatch<React.SetStateAction<Attack>>
  ) => {
    e.preventDefault();

    setFunc((prev: Attack) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleAddAttack = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendData("characters", state.character.id, {
      descriptions: { ...state.character.descriptions, attacks: [...state.character.descriptions.attacks, attackValue] },
    });
    setAttacks([...attacks, attackValue]);
    localStorage.setItem(
      "character",
      JSON.stringify({
        state: {
          ...state,
          character: {
            ...state.character,
            descriptions: { ...state.character.descriptions, attacks: [...state.character.descriptions.attacks, attackValue] },
          },
        },
      })
    );
    setAdd(false);
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
      <button type="button" className="btn btn-accent absolute right-14 top-24 z-10" onClick={() => setAdd(true)}>
        Add
      </button>
      <BoxSection styles="w-full h-full p-5 py-10 flex-col gap-5 text-start overflow-y-scroll">
        {attacks.map((attack: Attack, index: number) => (
          <Weapon index={index} attack={attack} key={index} setAttacks={setAttacks} />
        ))}
        <Popup closerFunc={setAdd} toggle={add}>
          <form onSubmit={(e) => handleAddAttack(e)} className="flex w-min items-center justify-center">
            <BoxSection styles="px-20 bg-opacity-90 py-10 justify-center flex-col gap-5 items-start text-start">
              <input
                type="text"
                name="name"
                placeholder="Attack Name"
                className="input w-full focus-within:outline-0"
                value={attackValue?.name || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                className="input w-full focus-within:outline-0"
                value={attackValue?.type || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <input
                type="text"
                name="range"
                placeholder="Range"
                className="input w-full focus-within:outline-0"
                value={attackValue?.range || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <input
                type="text"
                name="attack"
                placeholder="Attack"
                className="input w-full focus-within:outline-0"
                value={attackValue?.attack || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <input
                type="text"
                name="damage"
                placeholder="Damage"
                className="input w-full focus-within:outline-0"
                value={attackValue?.damage || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="textarea resize-none focus-within:outline-0"
                rows={4}
                cols={50}
                value={attackValue?.description || ""}
                onChange={(e) => handleChange(e, setAttackValue)}
              />
              <div className="flex w-full gap-5">
                <button type="submit" className="btn btn-accent flex-grow">
                  Add
                </button>
                <button type="button" className="btn btn-secondary flex-grow" onClick={() => setAdd(false)}>
                  Close
                </button>
              </div>
            </BoxSection>
          </form>
        </Popup>
      </BoxSection>
    </motion.main>
  );
}
