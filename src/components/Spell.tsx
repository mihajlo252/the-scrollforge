import { BoxSection } from "./BoxSection";

export const Spell = ({spell, index, style} : {spell: Spell, index: number, style?: string}) => {
    return (
        <BoxSection key={index} styles={`grid w-full grid-cols-[1fr_3fr] h-min gap-5 text-lg px-10 py-5 border-accent ${style}`}>
            <div className="flex flex-col gap-2">
                <p className="grid text-sm">
                    <span className="text-3xl underline">{spell.name}</span>
                    {spell.type}
                </p>
                <p>Range: {spell.range}</p>
                <p>Casting Time: {spell.castingTime}</p>
                <p>Range: {spell.range}</p>
                <p>Duration: {spell.duration}</p>
                <p>Components: {spell.components}</p>
            </div>
            <p>
                {/* {spell.description.split("\n").map((line: string, index: number) => (
                    <span className="block indent-5" key={index}>
                        {line}
                    </span>
                ))} */}
                {spell.description}
            </p>
        </BoxSection>
    );
};


// name: string;
// type: string;
// castingTime: string;
// range: string;
// duration: string;
// components: string;
// description: string;