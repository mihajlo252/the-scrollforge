import React, { useEffect } from "react";
import DaggerheartClasses from "../../daggerheart-config/classes_cleaned.json";
import DaggerheartSubclasses from "../../daggerheart-config/subclasses_clean.json";
import { Capitalize } from "../../utilities/capitalize";
export const DaggerheartForm = ({
  setCharacterProfileDaggerheart,
  characterProfileDaggerheart,
  setClassDescription,
}: {
  setCharacterProfileDaggerheart: React.Dispatch<React.SetStateAction<CharacterProfileDaggerheart>>;
  characterProfileDaggerheart: CharacterProfileDaggerheart;
  setClassDescription: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // const [subclasses, setSubclasses] = React.useState<string[]>([]);

  useEffect(() => {
    let domains = DaggerheartClasses.find((c) => c.name === characterProfileDaggerheart.class.toUpperCase())
      ?.domains.map((domain) => Capitalize(domain))
      .join(" and ");
    if (domains === undefined) domains = "";
    setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, domains: domains });

    let description = DaggerheartClasses.find((c) => c.name === characterProfileDaggerheart.class.toUpperCase())?.description[0].paragraph;
    if (description === undefined) description = "";
    setClassDescription(description);
  }, [characterProfileDaggerheart.class]);

  useEffect(() => {
    setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, class: "Bard", level: 1, subclass: "Troubadour" });
  }, []);

  return (
    <>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Name"
        required
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, name: e.target.value })}
      />
      <select
        className="select select-bordered w-full"
        required
        value={characterProfileDaggerheart.class}
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, class: e.target.value })}
      >
        {DaggerheartClasses.map((c) => (
          <option key={c.id}>{Capitalize(c.name)}</option>
        ))}
      </select>
      <input
        type="text"
        className="input w-full bg-accent user-select-none cursor-default  focus:outline-none"
        placeholder="Domains"
        required
        readOnly
        value={`Domains: ${characterProfileDaggerheart.domains}`}
      />
      <select
        className="select select-bordered w-full"
        required
        value={characterProfileDaggerheart.level}
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, level: parseInt(e.target.value) })}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
          <option key={level}>{level}</option>
        ))}
      </select>
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
      <select
        className="select select-bordered w-full"
        value={characterProfileDaggerheart.subclass}
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, subclass: e.target.value })}
      >
        {DaggerheartSubclasses.filter((c) => c.class === characterProfileDaggerheart.class.toUpperCase())?.map((c) => (
          <option key={c.id}>{c.name}</option>
        ))}
      </select>
    </>
  );
};
