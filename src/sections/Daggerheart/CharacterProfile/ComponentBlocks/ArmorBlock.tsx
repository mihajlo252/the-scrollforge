import { ShieldSVG } from "../../../../components/ShieldSVG";
import { Resources } from "../../Components/Resources";
import { StatBlock } from "./StatBlock";

export const ArmorBlock = ({ name, stat }: { name: string; stat: number }) => {
  return (
    <>
      <StatBlock name={name} stat={stat} color="primary">
        <ShieldSVG stylesOutline={`stroke-primary transition-all fill-none`} stylesInline={`stroke-accent fill-none transition-all`} />
      </StatBlock>
      <ul>
        <Resources styles="grid-cols-3" stat={stat} max={9}>
          <ShieldSVG
            styles={`w-10 h-10`}
            stylesOutline={`stroke-inherit fill-none transition-all`}
            stylesInline={`stroke-inherit fill-none transition-all`}
          />
        </Resources>
      </ul>
    </>
  );
};
