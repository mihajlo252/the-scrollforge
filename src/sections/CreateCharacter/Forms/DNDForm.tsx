import React from "react";
import { BoxSection } from "../../../components/BoxSection";

export const DNDForm = ({
  children,
  setCharacterProfile,
  characterProfile,
  handleCreateCharacter,
}: {
  children: React.ReactNode;
  setCharacterProfile: React.Dispatch<React.SetStateAction<CharacterProfile>>;
  characterProfile: CharacterProfile;
  handleCreateCharacter: (e: React.FormEvent) => Promise<void>;
}) => {
  return (
    <BoxSection styles="relative h-min flex flex-col gap-5 justify-center items-center text-center px-20 py-10">
      <h2 className="text-4xl font-bold">Create Your Character</h2>
      <form className="flex w-full flex-col gap-2" onSubmit={(e) => handleCreateCharacter(e)}>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Name"
          required
          onChange={(e) => setCharacterProfile({ ...characterProfile, name: e.target.value })}
        />
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Level"
          required
          onChange={(e) => setCharacterProfile({ ...characterProfile, level: parseInt(e.target.value) })}
        />
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Class"
          required
          onChange={(e) => setCharacterProfile({ ...characterProfile, class: e.target.value })}
        />
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Subclass"
          onChange={(e) => setCharacterProfile({ ...characterProfile, subclass: e.target.value })}
        />
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Race"
          required
          onChange={(e) => setCharacterProfile({ ...characterProfile, race: e.target.value })}
        />
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Subrace"
          onChange={(e) => setCharacterProfile({ ...characterProfile, subrace: e.target.value })}
        />
        {children}
      </form>
    </BoxSection>
  );
};
