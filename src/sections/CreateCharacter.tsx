import React, { useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { submitCharacter } from "../utilities/submitCharacter";
import { DNDForm } from "./DnD/CreateCharacter/DNDForm";
import { DaggerheartForm } from "./Daggerheart/CreateCharacter/DaggerheartForm";

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
    ancestry: "",
    community: "",
    subclass: "",
  });

 

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    const { user } = JSON.parse(getUserFromLocal());
    if (gameMode === "D&D") await submitCharacter(characterProfile, user.id, gameMode);
    if (gameMode === "Daggerheart") await submitCharacter(characterProfileDaggerheart, user.id, gameMode);
    setIsSave(true);
    setOpenCreateCharacter(false);
  };

  return (
    <section className="flex gap-10 w-min place-content-center">
      {gameMode === "dnd" && (
        <DNDForm
          setCharacterProfile={setCharacterProfile}
          characterProfile={characterProfile}
          handleCreateCharacter={handleCreateCharacter}
        >
          <div className="mt-10 flex gap-2">
            <button type="submit" className="btn btn-primary flex-1">
              Create
            </button>
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
              Cancel
            </button>
          </div>
        </DNDForm>
      )}
      {gameMode === "daggerheart" && (
        <DaggerheartForm
          setCharacterProfileDaggerheart={setCharacterProfileDaggerheart}
          characterProfileDaggerheart={characterProfileDaggerheart}
          handleCreateCharacter={handleCreateCharacter}
        >
          <div className="mt-10 flex gap-2 col-span-4">
            <button type="submit" className="btn btn-primary flex-1">
              Create
            </button>
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
              Cancel
            </button>
          </div>
        </DaggerheartForm>
      )}
    </section>
  );
};
