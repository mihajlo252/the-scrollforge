import { useEffect, useState } from "react";
import { Capitalize } from "../../../utilities/capitalize";
import { DescriptionScrollContainer } from "../Components/DescriptionScrollContainer";
export const CommunityDescriptions = ({ name, communities }: { name: string; communities: any }) => {
  const [currentCommunity, setCurrentCommunity] = useState(communities.find((c: any) => c.name === name.toUpperCase()));

  useEffect(() => {
    setCurrentCommunity(communities.find((c: any) => c.name === name));
  }, [name]);

  return (
    <>
      <h1 className="text-3xl text-accent">{name}</h1>
      <DescriptionScrollContainer>
        <p>{currentCommunity?.description[0].paragraph}</p>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Personalities</h3>
          <ul className="list-disc">
            {currentCommunity?.personalities.map((personality: any) => (
              <li key={personality} className="list-item">
                {Capitalize(personality)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-accent">Features</h3>
          <ul className="list-disc">
            {currentCommunity?.features.map((feature: any) => (
              <li key={feature.name} className="list-item">
                <span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
              </li>
            ))}
          </ul>
        </div>
      </DescriptionScrollContainer>
    </>
  );
};
