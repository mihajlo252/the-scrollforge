import React, { useState } from "react";
import { BoxSection } from "../../../components/BoxSection";
// import { toast } from "../../../utilities/toasterSonner";
import { StatBlock } from "../Components/StatBlock";

export const CharacterProfile = ({ setStatChange }: { setStatChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { state } = JSON.parse(localStorage.getItem("character")!);
  const character = state.character;
  if (!character) return;

  const {
    characterProfile,
    stats: { baseStats },
  } = character;

//   const [strength, setStrength] = useState<number>(baseStats.strength);
//   const [agility, setAgility] = useState<number>(baseStats.agility);
//   const [finesse, setFinesse] = useState<number>(baseStats.finesse);
//   const [instinct, setInstinct] = useState<number>(baseStats.instinct);
//   const [presence, setPresence] = useState<number>(baseStats.presence);
//   const [knowledge, setKnowledge] = useState<number>(baseStats.knowledge);
  const [characterLevel, setCharacterLevel] = useState(characterProfile.level);

//   const handleChangeStats = (e: any, setFunc: any) => {
//     if (e.target.value.length > 2 || e.target.value > 30) {
//       toast({ style: "bg-secondary text-white", message: "You've exceeded the limit!" });
//       return;
//     }
//     e.target.value[0] === "0" && (e.target.value = e.target.value.slice(1));
//     if (e.target.value === 0) {
//       e.target.value = 0;
//     }
//     e.target.style.width = e.target.value.length + "ch";
//     if (e.target.value.length == 0) {
//       e.target.style.width = "7ch";
//     }
//     setFunc(parseInt(e.target.value));
//     const { state } = JSON.parse(localStorage.getItem("character")!);
//     const mHP = state.character.stats.maxHP;
//     localStorage.setItem(
//       "character",
//       JSON.stringify({
//         state: {
//           character: {
//             ...character,
//             stats: { ...character.stats, maxHP: mHP, baseStats: { ...character.stats.baseStats, [e.target.name]: parseInt(e.target.value) } },
//           },
//         },
//         version: 0,
//       })
//     );
//     setStatChange(true);
//   };

  const handleChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterLevel(parseInt(e.target.value) || 0);
    const { state } = JSON.parse(localStorage.getItem("character")!);
    const mHP = state.character.stats.maxHP;
    localStorage.setItem(
      "character",
      JSON.stringify({
        state: {
          character: {
            ...character,
            stats: { ...character.stats, maxHP: mHP },
            characterProfile: { ...character.characterProfile, level: parseInt(e.target.value) || 0 },
          },
        },
        version: 0,
      })
    );
    setStatChange(true);
  };

  return (
    <BoxSection styles="flex gap-10 w-full items-center justify-between rounded-lg border-2 border-slate-900 bg-base-300 px-5 text-neutral">
      <div className="grid grid-cols-2 gap-[5px] text-2xl">
        {Object.entries(baseStats).map((stat) => (
          <StatBlock name={Object.values(stat)[0] as string} stat={Object.keys(stat)[0] as string} />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="text-start">
          <p>
            {characterProfile.name}, Level{" "}
            <input
              type="text"
              placeholder="0"
              className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
              value={characterLevel ?? 0}
              onChange={(e) => handleChangeLevel(e)}
            />
          </p>
          <hr />
          <p>
            {characterProfile.ancestry} {characterProfile.community}, {characterProfile.class} {characterProfile.subclass}, {characterProfile.domains}
          </p>
        </div>
      </div>
    </BoxSection>
  );
};
