import React, { useState } from "react";
import { BoxSection } from "../../components/BoxSection";
import { getUserFromLocal } from "../../utilities/getUserFromLocal";
import { submitCharacter } from "../../utilities/submitCharacter";
import { DNDForm } from "./DNDForm";
import { DaggerheartForm } from "./DaggerheartForm";

export const CreateCharacter = ({
  openCreateCharacter,
  setOpenCreateCharacter,
  setIsSave,
  gameMode,
}: {
  openCreateCharacter: boolean;
  setOpenCreateCharacter: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
  gameMode: string;
}) => {
  if (!openCreateCharacter) return;

  const [characterProfile, setCharacterProfile] = useState<CharacterProfile>({
    class: "",
    level: 0,
    name: "",
    race: "",
    subclass: "",
    subrace: "",
  });
  const [characterProfileDaggerheart, setCharacterProfileDaggerheart] = useState<CharacterProfileDaggerheart>({
    name: "",
    class: "",
    domains: "",
    level: 0,
    pronouns: "",
    heritage: "",
    subclass: "",
  })

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user } = JSON.parse(getUserFromLocal());
    if (gameMode === "D&D") await submitCharacter(characterProfile, user.id, gameMode);
    if (gameMode === "Daggerheart") await submitCharacter(characterProfileDaggerheart, user.id, gameMode);
    setIsSave(true);
    setOpenCreateCharacter(false);
  };

  return (
      <BoxSection styles="relative h-min flex flex-col gap-5 justify-center items-center text-center px-20 py-10">
        <h2 className="text-4xl font-bold">Create Your Character</h2>
        <form className="flex w-full flex-col gap-2" onSubmit={(e) => handleCreateCharacter(e)}>
          {gameMode === "D&D" && <DNDForm setCharacterProfile={setCharacterProfile} characterProfile={characterProfile} />}
          {gameMode === "Daggerheart" && <DaggerheartForm setCharacterProfileDaggerheart={setCharacterProfileDaggerheart} characterProfileDaggerheart={characterProfileDaggerheart} />}

          <div className="mt-10 flex gap-2">
            <button type="submit" className="btn btn-primary flex-1">
              Create
            </button>
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
              Cancel
            </button>
          </div>
        </form>
      </BoxSection>
  );
};
