import { useEffect, useState } from "react";
export const AncestryDescriptions = ({ name, ancestries }: { name: string; ancestries: any }) => {
  const [currentAncestry, setCurrentAncestry] = useState(ancestries.find((c: any) => c.name === name.toUpperCase()));

  useEffect(() => {
    setCurrentAncestry(ancestries.find((c: any) => c.name === name));
  }, [name]);

  return (
    <>
      <h1 className="text-3xl text-accent">Ancestry: {name}</h1>
      <div className="pr-2  flex flex-col gap-4 overflow-y-scroll h-[400px]">
        <p>{currentAncestry?.description[0].paragraph}</p>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Features</h3>
          <ul className="list-disc">
            {currentAncestry?.features.map((feature: any) => (
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
