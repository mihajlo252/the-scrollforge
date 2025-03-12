import { BoxSection } from "./BoxSection";

export const Weapon = ({attack, index, style} : {attack: any, index: number, style?: string}) => {
    return (
        <BoxSection key={index} styles={`grid w-full grid-cols-[1fr_3fr] h-min gap-5 text-lg px-10 py-5 border-accent ${style}`}>
            <div className="flex flex-col gap-2">
                <p className="grid text-sm">
                    <span className="text-3xl underline">{attack.name}</span>
                    {attack.type}
                </p>
                <p>Range: {attack.range}</p>
                <p>Attack: {attack.attack}</p>
                <p>Damage: {attack.damage}</p>
            </div>
            <p>
                {attack.description.split("\n").map((line: string, index: number) => (
                    <span className="block indent-5" key={index}>
                        {line}
                    </span>
                ))}
            </p>
        </BoxSection>
    );
};
