import React, { useState } from "react";
import { Frame } from "../../../components/Frame/Frame";
// import { toast } from "../../../utilities/toasterSonner";
import { StatBlock } from "./ComponentBlocks/StatBlock";
import { ArmorBlock } from "./ComponentBlocks/ArmorBlock";
import { StatHeadSVG } from "../../../components/StatHeadSVG";
import { CirclesBlock } from "./ComponentBlocks/CirclesBlock";

import ClassesData from "../../../daggerheart-config/classes.json";
import { TraitsBlock } from "./ComponentBlocks/TraitsBlock";

export const CharacterProfile = ({ setStatChange }: { setStatChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { state } = JSON.parse(localStorage.getItem("character")!);
  const character = state.character;
  if (!character) return;

  const {
    name,
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
      }),
    );
    setStatChange(true);
  };

  return (
    <Frame classes="flex gap-2 px-2 py-5">
      <TraitsBlock traitList={baseStats}/>
      <section className="flex flex-col gap-5">
        <div>
          <p className="text-2xl text-left">
            {name}, Level{" "}
            <input
              type="text"
              placeholder="0"
              className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
              value={characterLevel ?? 0}
              onChange={(e) => handleChangeLevel(e)}
            />
          </p>
          <p>
            {characterProfile.ancestry} {characterProfile.community}, {characterProfile.class} {characterProfile.subclass}, {characterProfile.domains}
          </p>
        </div>
        <div className="place-self-start flex gap-5">
          <StatBlock
            name={"Evasion"}
            stat={ClassesData.find((c: any) => c.name === characterProfile.class.toUpperCase())!.startingEvasion}
            color="accent"
          >
            <StatHeadSVG stylesOutline={`stroke-accent transition-all fill-none`} stylesInline={`stroke-primary fill-none transition-all`} />
          </StatBlock>
          <ArmorBlock name={"Armor"} stat={3} />
        </div>
        <div className="place-self-start flex flex-col gap-5">
          <div className="flex gap-20 text-lg justify-center">
            <p>Minor</p>

            <p>Major</p>
            <p>Severe</p>
          </div>
          <div className="grid grid-cols-[.3fr_1fr] gap-5">
            <CirclesBlock name={"HP"} stat={ClassesData.find((c: any) => c.name === characterProfile.class.toUpperCase())!.startingHitPoints} max={12}/>
            <CirclesBlock name={"Stress"} stat={6} max={12}/>
            <CirclesBlock name={"Hope"} stat={6} max={6}/>
          </div>
        </div>
      </section>
    </Frame>
  );

  // return (
  //   <Frame styles="flex gap-10 w-full items-center justify-between rounded-lg border-2 border-slate-900 bg-base-300 px-5 text-neutral">
  //     <div className="grid grid-cols-2 gap-[5px] text-2xl">
  //       {Object.entries(baseStats).map((stat, i) => (
  //         <StatBlock key={i} name={Object.values(stat)[0] as string} stat={Object.keys(stat)[0] as string} />
  //       ))}
  //     </div>
  //     <div className="flex gap-2">
  //       <div className="text-start">
  //         <p>
  //           {characterProfile.name}, Level{" "}
  //           <input
  //             type="text"
  //             placeholder="0"
  //             className="max-w-[2ch] rounded-lg border-[1px] border-slate-700 bg-slate-900 text-center focus-within:outline-0"
  //             value={characterLevel ?? 0}
  //             onChange={(e) => handleChangeLevel(e)}
  //           />
  //         </p>
  //         <hr />
  //         <p>
  //           {characterProfile.ancestry} {characterProfile.community}, {characterProfile.class} {characterProfile.subclass}, {characterProfile.domains}
  //         </p>
  //       </div>
  //     </div>
  //   </Frame>
  // );
};
