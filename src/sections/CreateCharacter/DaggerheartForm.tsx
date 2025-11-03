import React, { useEffect } from "react";
import DaggerheartClasses from "../../daggerheart-config/classes_cleaned.json";
import DaggerheartSubclasses from "../../daggerheart-config/subclasses_clean.json";
import DaggerheartAncestries from "../../daggerheart-config/ancestries_clean.json";
import DaggerheartCommunities from "../../daggerheart-config/communities_clean.json";
import { Capitalize } from "../../utilities/capitalize";
export const DaggerheartForm = ({
  setCharacterProfileDaggerheart,
  characterProfileDaggerheart,
  setCurrentDescription,
}: {
  setCharacterProfileDaggerheart: React.Dispatch<React.SetStateAction<CharacterProfileDaggerheart>>;
  characterProfileDaggerheart: CharacterProfileDaggerheart;
  setCurrentDescription: React.Dispatch<React.SetStateAction<DaggerheartFormDescription>>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, changeTarget: string) => {
    let target = e.target.value;
    let config = () => {
      if (changeTarget === "class") {
        target = target.toUpperCase();
        return DaggerheartClasses;
      }
      if (changeTarget === "subclass") {
        target = Capitalize(target);
        return DaggerheartSubclasses};
      if (changeTarget === "ancestry") {
        target = Capitalize(target);
        return DaggerheartAncestries};
      if (changeTarget === "community") {
        target = Capitalize(target);
        return DaggerheartCommunities};
    };
    setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, [changeTarget]: e.target.value });
    let description = (config()?.find((c) => c.name === target) as { description?: any })?.description[0].paragraph;
    setCurrentDescription({ title: e.target.value, description: description });
  };

  useEffect(() => {
    let domains = DaggerheartClasses.find((c) => c.name === characterProfileDaggerheart.class.toUpperCase())
      ?.domains.map((domain) => Capitalize(domain))
      .join(" and ");
    if (domains === undefined) domains = "";
    let subclass = DaggerheartSubclasses.find((c) => c.class === characterProfileDaggerheart.class.toUpperCase())?.name;
    if (subclass === undefined) subclass = "";
    setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, domains: domains, subclass: subclass });
  }, [characterProfileDaggerheart.class]);

  useEffect(() => {
    setCharacterProfileDaggerheart({
      ...characterProfileDaggerheart,
      class: "Bard",
      level: 1,
      subclass: "Troubadour",
      ancestry: "Clank",
      community: "Highborne",
    });
    setCurrentDescription({ title: "Clank", description: DaggerheartAncestries[0].description[0].paragraph });
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
        value={characterProfileDaggerheart.ancestry}
        onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "ancestry")}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "ancestry")}
      >
        {DaggerheartAncestries.map((c) => (
          <option key={c.id} value={c.name}>Ancestry: {c.name}</option>
        ))}
      </select>
      <select
        className="select select-bordered w-full"
        value={characterProfileDaggerheart.community}
        onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "community")}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "community")}
      >
        {DaggerheartCommunities.map((c) => (
          <option key={c.id} value={c.name}>Community: {c.name}</option>
        ))}
      </select>
      <select
        className="select select-bordered w-full"
        required
        value={characterProfileDaggerheart.class}
        onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "class")}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, "class")}
      >
        {DaggerheartClasses.map((c) => (
          <option key={c.id} value={Capitalize(c.name)}>Class: {Capitalize(c.name)}</option>
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
        value={characterProfileDaggerheart.subclass}
        onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, subclass: e.target.value })}
      >
        {DaggerheartSubclasses.filter((c) => c.class === characterProfileDaggerheart.class.toUpperCase())?.map((c) => (
          <option key={c.id} value={c.name}>Subclass: {c.name}</option>
        ))}
      </select>
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
    </>
  );
};
