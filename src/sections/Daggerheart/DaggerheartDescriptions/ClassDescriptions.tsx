import { useEffect, useState } from "react";
import { Capitalize } from "../../../utilities/capitalize";

export const ClassDescriptions = ({ name, classes }: { name: string; classes: any }) => {
  const [currentClass, setCurrentClass] = useState(classes.find((c: any) => c.name === name.toUpperCase()));

  useEffect(() => {
    setCurrentClass(classes.find((c: any) => c.name === name.toUpperCase()));
  }, [name]);

  return (
    <>
      <h1 className="text-3xl text-accent">
        {name} <span className="block text-2xl">{currentClass?.domains.map((d: string) => Capitalize(d)).join(" and ")}</span>
      </h1>
      <div className="pr-2  flex flex-col gap-4 overflow-y-scroll h-[400px] max-[1023px]:h-[280px] min-[1440px]:h-[500px]">
        <p>{currentClass?.description[0].paragraph}</p>
        <ul className="list-disc">
          <li className="list-item">
            <span className=" text-primary ">Starting Evasion:</span> {currentClass?.startingEvasion}
          </li>
          <li className="list-item">
            <span className=" text-primary ">Starting Hit Points:</span> {currentClass?.startingHitPoints}
          </li>
        </ul>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Class Items</h3>
          <ul className="list-disc">
            {currentClass?.classItems.map((item: string) => (
              <li key={item} className="list-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Hope Feature</h3>
          <h4 className="text-md text-primary">{currentClass?.hopeFeature.name}</h4>
          <p>{currentClass?.hopeFeature.description[0].paragraph}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Class Features</h3>
          <ul className="list-disc">
            {currentClass?.classFeatures.map((feature: any) => (
              <li key={feature.name} className="list-item">
                <span className=" text-primary ">{feature.name}:</span> {feature.description.map((d: any) => d.paragraph).join(" ")}
                {feature.description[1]?.list && (
                  <ul>
                    {feature.description[1].list.map((l: string) => (
                      <li key={l}>- {l}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
