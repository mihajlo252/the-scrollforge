import { useState } from "react";
import { StatHeadSVG } from "../../../components/StatHeadSVG";

export const StatBlock = ({ name, stat }: { name: string; stat: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <li className={`flex flex-col hover:cursor-pointer`} onClick={() => setHover(!hover)}>
      <div className="w-max place-self-center relative isolate aspect-square flex flex-col justify-center items-center">
        <p className={`p-5 select-none text-primary ${hover && "text-secondary"}`}>{stat}</p>
        <p className={`bg-accent text-base-100 px-2 z-10 rounded-lg transition-colors ${hover && "bg-secondary text-base-content"}`}>{name}</p>
        <div className="absolute -z-1 inset-0 stroke-primary flex justify-center items-center">
          <StatHeadSVG
            styles={``}
            stylesOutline={`stroke-accent transition-all fill-none ${hover && "stroke-secondary"}`}
            stylesInline={`stroke-primary fill-none transition-all ${hover && "stroke-secondary"}`}
          />
        </div>
      </div>
    </li>
  );
};
