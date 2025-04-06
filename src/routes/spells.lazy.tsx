import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useCharacterStore } from "../zustand/stores";
import { Spell } from "../components/Spell";

export const Route = createLazyFileRoute("/spells")({
    component: Spells,
});

function Spells() {
    const { character }: CharacterStore = useCharacterStore();
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full h-full p-5 justify-center flex-col gap-5 items-start text-start">
                {character.descriptions.spells.length == 0 ? (
                    <div className="flex flex-col items-center justify-center gap-5 place-self-center">
                        <p className="text-2xl">Your Character has no Spells</p>
                        <Link className="btn btn-primary" to="/character">
                            Back to Character
                        </Link>
                    </div>
                ) : (
                    <>
                        {character.descriptions?.spells.map((spell: Spell, index: number) => (
                            <Spell index={index} spell={spell} key={index} />
                        ))}
                    </>
                )}
            </BoxSection>
        </motion.main>
    );
}
