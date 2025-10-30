import { BoxSection } from "./BoxSection";
import { DeleteButton } from "./DeleteButton";
import { Popup } from "./Popup";
import { useState } from "react";
import { sendData } from "../utilities/sendData";

export const Weapon = ({
  attack,
  index,
  style,
  setAttacks,
}: {
  attack: any;
  index: number;
  style?: string;
  setAttacks: React.Dispatch<React.SetStateAction<Attack[]>>;
}) => {
  const [isDelete, setIsDelete] = useState(false);
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendData("characters", state.character.id, {
      descriptions: {
        ...state.character.descriptions,
        attacks: state.character.descriptions.attacks.filter((a: any) => a.name !== attack.name),
      },
    });
    setAttacks(state.character.descriptions.attacks.filter((a: any) => a.name !== attack.name));
    localStorage.setItem(
      "character",
      JSON.stringify({
        state: {
          ...state,
          character: {
            ...state.character,
            descriptions: {
              ...state.character.descriptions,
              attacks: [...state.character.descriptions.attacks.filter((a: any) => a.name !== attack.name)],
            },
          },
        },
      })
    );
    setIsDelete(false);
  };

  return (
    <BoxSection key={index} styles={`relative grid w-full h-min grid-cols-[1fr_3fr] gap-5 text-lg px-10 py-5 border-accent ${style}`}>
      <div className="flex flex-col gap-2">
        <p className="grid text-sm">
          <span className="text-3xl underline">{attack.name}</span>
          {attack.type}
        </p>
        <p>Range: {attack.range}</p>
        <p>Attack: {attack.attack}</p>
        <p>Damage: {attack.damage}</p>
        <DeleteButton
          size={55}
          styles=" transition-colors rounded-badge  fill-base-300 hover:fill-slate-900 hover:stroke-secondary stroke-primary absolute bottom-5 right-0"
          event={() => {
            setIsDelete(true);
          }}
        />
        <Popup closerFunc={setIsDelete} toggle={isDelete}>
          <form className="flex flex-col gap-10" onSubmit={(e) => handleDelete(e)}>
            <p>Are you sure you want to delete this attack?</p>
            <div className="flex w-full gap-5">
              <button type="button" className="btn btn-primary flex-grow" onClick={() => setIsDelete(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-accent flex-grow">
                Delete
              </button>
            </div>
          </form>
        </Popup>
      </div>
      <p>
        {attack.description.split("\n").map((line: string, index: number) => (
          <span className="block indent-5" key={index}>
            {line}
          </span>
        ))}
      </p>
    </BoxSection>
  );
};
