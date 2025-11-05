import { useEffect, useState } from "react";
import { Capitalize } from "../../../utilities/capitalize";
export const SubclassDescriptions = ({ name, subclasses }: { name: string; subclasses: any }) => {
  const [currentSubclass, setCurrentSubclass] = useState(subclasses.find((c: any) => c.name === name));

  useEffect(() => {
    console.log(subclasses.find((c: any) => c.name === name).class);
    console.log(currentSubclass);
    setCurrentSubclass(subclasses.find((c: any) => c.name === name));
  }, [name]);


  return (
    <>
      <h1 className="text-3xl text-accent">
        Subclass: {name} 
        <span className="block text-2xl">Class: {Capitalize(currentSubclass?.class)}</span>
      </h1>
      <div className="pr-2  flex flex-col gap-4 overflow-y-scroll h-[400px]">
        <p><span className="text-primary">Spellcast Trait:</span> {Capitalize(currentSubclass?.spellcastTrait)}</p>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Foundation Features</h3>
          <ul className="list-disc">
            {currentSubclass?.foundation.features.map((feature: any) => (
              <li key={feature.name} className="list-item">
                <span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Specialization Features</h3>
          <ul className="list-disc">
            {currentSubclass?.specialization.features.map((feature: any) => (
              <li key={feature.name} className="list-item">
                <span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Mastery Features</h3>
          <ul className="list-disc">
            {currentSubclass?.mastery.features.map((feature: any) => (
              <li key={feature.name} className="list-item">
                <span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
