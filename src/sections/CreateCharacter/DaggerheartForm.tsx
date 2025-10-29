import React from "react";

export const DaggerheartForm = ({
  setCharacterProfileDaggerheart,
  characterProfileDaggerheart,
}: {
  setCharacterProfileDaggerheart: React.Dispatch<React.SetStateAction<CharacterProfileDaggerheart>>;
  characterProfileDaggerheart: CharacterProfileDaggerheart;
}) => {
  return (
    <>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Name"
        required
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, name: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Class"
        required
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, class: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Domains"
        required
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, domains: e.target.value })}
      />
      <input
        type="number"
        className="input input-bordered w-full"
        placeholder="Level"
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, level: parseInt(e.target.value) })}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Pronouns"
        required
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, pronouns: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Heritage"
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, heritage: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Subclass"
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, subclass: e.target.value })}
      />
    </>
  );
};
