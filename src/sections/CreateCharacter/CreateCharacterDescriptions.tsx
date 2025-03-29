import { useState } from "react";
import { CreateCharacterTraits } from "./CreateCharacterTraits";
import { CreateCharacterAttacks } from "./CreateCharacterAttacks";
import { CreateCharacterSpells } from "./CreateCharacterSpells";

export const CreateCharacterDescriptions = ({ description }: { description: string }) => {
    const { state } = JSON.parse(localStorage.getItem("newCharacter") || "{}");
    const [isSave, setIsSave] = useState<boolean>(false);
    
    const [racialTraits, setRacialTraits] = useState<string[]>(state?.character.descriptions.racialTraits);
    const [featureTraits, setFeatureTraits] = useState<string[]>(state?.character.descriptions.featureTraits);
    const [attacks, setAttacks] = useState<Attack[]>(state?.character.descriptions.attacks);
    const [spells, setSpells] = useState<Spell[]>(state?.character.descriptions.spells);


    if (description === "racialTraits") {
        return <CreateCharacterTraits traits={racialTraits} setTraits={setRacialTraits} isSave={isSave} setIsSave={setIsSave} description={description}/>;
    }

    if (description === "featureTraits") {
        return <CreateCharacterTraits traits={featureTraits} setTraits={setFeatureTraits} isSave={isSave} setIsSave={setIsSave} description={description}/>;
    }

    if (description === "attacks") {
        return <CreateCharacterAttacks attacks={attacks} setAttacks={setAttacks} isSave={isSave} setIsSave={setIsSave} description={description}/>;
    }

    if (description === "spells") {
        return <CreateCharacterSpells spells={spells} setSpells={setSpells} isSave={isSave} setIsSave={setIsSave} description={description}/>;
    }
};
