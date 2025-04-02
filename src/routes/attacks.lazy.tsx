import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useCharacterStore } from "../zustand/stores";
import { Weapon } from "../components/Weapon";

export const Route = createLazyFileRoute("/attacks")({
    component: Attacks,
});

function Attacks() {
    const { character }: CharacterStore = useCharacterStore();
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full h-full p-5 justify-center flex-col gap-5 items-start text-start">
                {character.descriptions.attacks.map((attack: Attack, index: number) => (
                    <Weapon index={index} attack={attack} key={index} />
                ))}
            </BoxSection>
        </motion.main>
    );
}
