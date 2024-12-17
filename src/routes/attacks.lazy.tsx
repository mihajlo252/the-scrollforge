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
            <BoxSection styles="w-full h-full p-5 justify-center gap-5 items-center text-start">
                {character.descriptions.attacks.map((attack: Attack, index: number) => (
                    <BoxSection key={index} styles="flex h-min flex-col gap-5 text-2xl px-10 py-5 border-accent">
                        <p className="grid text-sm"><span className="text-3xl underline">{attack.name}</span>{attack.description}</p>
                        <p>Range: {attack.range}</p>
                        <p>Attack: {attack.attack}</p>
                        <p>Damage: {attack.damage}</p>
                    </BoxSection>
                ))}
            </BoxSection>
        </motion.main>
    );
}
