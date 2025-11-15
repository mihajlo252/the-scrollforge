import React, { useEffect, useState } from "react";
import DaggerheartClasses from "../../../daggerheart-config/classes.json";
import DaggerheartSubclasses from "../../../daggerheart-config/subclasses.json";
import DaggerheartAncestries from "../../../daggerheart-config/ancestries.json";
import DaggerheartCommunities from "../../../daggerheart-config/communities.json";
import { Capitalize } from "../../../utilities/capitalize";
import { BoxSection } from "../../../components/BoxSection";
import { ClassDescriptions } from "../DaggerheartDescriptions/ClassDescriptions";
import { AncestryDescriptions } from "../DaggerheartDescriptions/AncestryDescriptions";
import { CommunityDescriptions } from "../DaggerheartDescriptions/CommunityDescriptions";
import { SubclassDescriptions } from "../DaggerheartDescriptions/SubclassDescriptions";
enum DHDataType {
  class = "class",
  subclass = "subclass",
  ancestry = "ancestry",
  community = "community",
}
export const DaggerheartForm = ({
  children,
  setCharacterProfileDaggerheart,
  characterProfileDaggerheart,
  handleCreateCharacter,
}: {
  children: React.ReactNode;
  setCharacterProfileDaggerheart: React.Dispatch<React.SetStateAction<CharacterProfileDaggerheart>>;
  characterProfileDaggerheart: CharacterProfileDaggerheart;
  handleCreateCharacter: (e: React.FormEvent) => Promise<void>;
}) => {
  // const [currentDescription, setCurrentDescription] = useState<DaggerheartSelectedDataType>();
  const [currentSelectedDataType, setCurrentSelectedDataType] = useState<{ type: DHDataType; name: string }>({
    type: DHDataType.ancestry,
    name: "Clank",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, dataType: DHDataType) => {
    setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, [dataType]: e.target.value });
    setCurrentSelectedDataType({ type: dataType, name: e.target.value });
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
    // setCurrentDescription({ title: "Clank", description: DaggerheartAncestries[0].description[0].paragraph });
    setCurrentSelectedDataType({ type: DHDataType.ancestry, name: "Clank" });
  }, []);

  return (
    <>
      <BoxSection styles="relative w-[calc(40vw-5rem)] h-min flex flex-col gap-5 justify-center items-center text-center px-12 py-10">
        <h2 className="text-4xl font-bold">Create Your Character</h2>
        <form className="grid grid-cols-4 w-full  gap-2" onSubmit={(e) => handleCreateCharacter(e)}>
          <input
            type="text"
            className="input input-bordered w-full col-span-3"
            placeholder="Name"
            required
            onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, name: e.target.value })}
          />
          <select
            className="select select-bordered w-full col-span-1"
            required
            value={characterProfileDaggerheart.level}
            onChange={(e) => setCharacterProfileDaggerheart({ ...characterProfileDaggerheart, level: parseInt(e.target.value) })}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
          <select
            className="select select-bordered w-full col-span-2"
            value={characterProfileDaggerheart.ancestry}
            onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.ancestry)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.ancestry)}
          >
            {DaggerheartAncestries.map((c) => (
              <option key={c.id} value={c.name}>
                Ancestry: {c.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered w-full col-span-2"
            value={characterProfileDaggerheart.community}
            onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.community)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.community)}
          >
            {DaggerheartCommunities.map((c) => (
              <option key={c.id} value={c.name}>
                Community: {c.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered w-full col-span-4"
            required
            value={characterProfileDaggerheart.class}
            onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.class)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.class)}
          >
            {DaggerheartClasses.map((c) => (
              <option key={c.id} value={Capitalize(c.name)}>
                Class: {Capitalize(c.name)}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="input w-full bg-accent user-select-none cursor-default  focus:outline-none col-span-4"
            placeholder="Domains"
            required
            readOnly
            value={`Domains: ${characterProfileDaggerheart.domains}`}
          />
          <select
            className="select select-bordered w-full col-span-4"
            value={characterProfileDaggerheart.subclass}
            onFocus={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.subclass)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, DHDataType.subclass)}
          >
            {DaggerheartSubclasses.filter((c) => c.class === characterProfileDaggerheart.class.toUpperCase())?.map((c) => (
              <option key={c.id} value={c.name}>
                Subclass: {c.name}
              </option>
            ))}
          </select>
          
          {children}
        </form>
      </BoxSection>
      <div className="w-[calc(35vw-5rem)] place-self-center flex flex-col gap-5 text-left">
        {currentSelectedDataType.type === DHDataType.class && <ClassDescriptions name={currentSelectedDataType.name} classes={DaggerheartClasses} />}
        {currentSelectedDataType.type === DHDataType.subclass && (
          <SubclassDescriptions name={currentSelectedDataType.name} subclasses={DaggerheartSubclasses} />
        )}
        {currentSelectedDataType.type === DHDataType.ancestry && (
          <AncestryDescriptions name={currentSelectedDataType.name} ancestries={DaggerheartAncestries} />
        )}
        {currentSelectedDataType.type === DHDataType.community && (
          <CommunityDescriptions name={currentSelectedDataType.name} communities={DaggerheartCommunities} />
        )}
      </div>
    </>
  );
};
