import { FancyCircle } from "../../../../components/FancyCircleSVG";
import { Resources } from "../../Components/Resources";
import { StatBlock } from "./StatBlock";

export const CirclesBlock = ({ name, stat, max }: { name: string; stat: number, max: number }) => {
  return (
    <>
      <StatBlock name={name} stat={stat} color="primary">
        <FancyCircle stylesOutline={`stroke-primary transition-all fill-none`} stylesInline={`stroke-primary fill-none transition-all`} />
      </StatBlock>
      <ul>
        <Resources styles="grid-cols-6" stat={stat} max={max}>
          <FancyCircle
            styles="w-10 aspect-square"
            stylesOutline={`stroke-inherit fill-none transition-all`}
            stylesInline={`stroke-inherit fill-none transition-all`}
          />
        </Resources>
      </ul>
    </>
  );
};
