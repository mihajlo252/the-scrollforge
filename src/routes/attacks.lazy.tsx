import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useCharacterStore } from "../zustand/stores";

export const Route = createLazyFileRoute("/attacks")({
    component: () => <Attacks />,
});

function Attacks() {
    const { character }: CharacterStore = useCharacterStore();
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full h-full p-5 justify-center flex-col gap-5 items-start text-start">
                {character.descriptions.attacks.map((attack: Attack, index: number) => (
                    <BoxSection key={index} styles="grid w-full grid-cols-[1fr_3fr] h-min gap-5 text-[18px] px-10 py-5 border-accent">
                        <div className="flex flex-col gap-2">
                            <p className="grid text-sm">
                                <span className="text-3xl underline">{attack.name}</span>
                                {attack.type}
                            </p>
                            <p>Range: {attack.range}</p>
                            <p>Attack: {attack.attack}</p>
                            <p>Damage: {attack.damage}</p>
                        </div>
                        <p>{attack.description.split("\n").map((line: string, index: number) => <span className="block indent-5" key={index}>{line}</span>)}</p>
                    </BoxSection>
                ))}
            </BoxSection>
        </motion.main>
    );
}
