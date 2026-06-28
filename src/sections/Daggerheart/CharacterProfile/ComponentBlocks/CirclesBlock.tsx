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
        <Resources columns={6} stat={stat} max={max}>
          <FancyCircle stylesOutline={`stroke-inherit fill-none`} stylesInline={`stroke-inherit fill-none`} />
        </Resources>
      </ul>
    </>
  );
};
