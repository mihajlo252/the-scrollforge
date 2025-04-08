import { createLazyFileRoute } from "@tanstack/react-router";

import { motion } from "framer-motion";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BoxSection } from "../../components/BoxSection";
import { CreateCharacterDescriptions } from "../../sections/CreateCharacter/CreateCharacterDescriptions";
import { submitCharacter } from "../../utilities/submitCharacter";
import { getUserFromLocal } from "../../utilities/getUserFromLocal";

export const Route = createLazyFileRoute("/create-character/page2")({
    component: Page2,
});

function Page2() {
    const [description, setDescription] = useState("racialTraits");
    const navigate = useNavigate();


    const changeDescription = (d: string) => {
        setDescription(d);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const character = JSON.parse(localStorage.getItem("newCharacter") || "{}").state.character
        const { user } = JSON.parse(getUserFromLocal());
        const data = await submitCharacter(character, user.id);
        navigate({ to:"/profile"});
        console.log("Here is the data: ", data);
    };

    return (
        <motion.div
            className={`flex h-full w-full gap-2 overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <button
                    type="submit"
                    className="align-self-end btn btn-ghost w-[2%] self-center rounded-lg border-2 border-slate-900 bg-base-300 text-neutral"
                    onClick={() => navigate({ to:"/create-character/page1"})}
                >
                    {`<`}
                </button>
            <BoxSection styles="w-full px-5 flex-col text-start gap-2 overflow-y-scroll pt-0">
                <div className="sticky -top-5 z-10 flex w-full gap-2 bg-base-300 pt-5">
                    <button type="button" onClick={() => changeDescription("racialTraits")} className={`btn ${description === "racialTraits" ? "btn-primary" : ""}`}>
                        Racial Traits
                    </button>
                    <button type="button" onClick={() => changeDescription("featureTraits")} className={`btn ${description === "featureTraits" ? "btn-primary" : ""}`}>
                        Features & Traits
                    </button>
                    <button type="button" onClick={() => changeDescription("attacks")} className={`btn ${description === "attacks" ? "btn-primary" : ""}`}>
                        Attacks
                    </button>
                    <button type="button" onClick={() => changeDescription("spells")} className={`btn ${description === "spells" ? "btn-primary" : ""}`}>
                        Spells
                    </button>
                </div>
                <CreateCharacterDescriptions description={description} />
            </BoxSection>
            <button
                    type="submit"
                    className="align-self-end btn btn-ghost w-[2%] self-center rounded-lg border-2 border-slate-900 bg-base-300 text-neutral"
                    // onClick={() => navigate({ to: "/create-character/page3"})}
                    onClick={handleSubmit}
                >
                    {`>`}
                </button>
        </motion.div>
    );
}
