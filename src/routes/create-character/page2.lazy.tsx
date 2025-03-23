import { createLazyFileRoute } from "@tanstack/react-router";

import { motion } from "framer-motion";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BoxSection } from "../../components/BoxSection";
import { CreateCharacterDescriptions } from "../../sections/CreateCharacter/CreateCharacterDescriptions";

export const Route = createLazyFileRoute("/create-character/page2")({
    component: Page2,
});

function Page2() {
    const [description, setDescription] = useState("racialTraits");
    const navigate = useNavigate();


    const changeDescription = (d: string) => {
        setDescription(d);
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
                    <button type="button" onClick={() => changeDescription("racialTraits")} className="btn btn-ghost">
                        Racial Traits
                    </button>
                    <button type="button" onClick={() => changeDescription("featureTraits")} className="btn btn-ghost">
                        Features & Traits
                    </button>
                    <button type="button" onClick={() => changeDescription("attacks")} className="btn btn-ghost">
                        Attacks
                    </button>
                    <button type="button" onClick={() => changeDescription("spells")} className="btn btn-ghost">
                        Spells
                    </button>
                </div>
                <CreateCharacterDescriptions description={description} />
            </BoxSection>
            <button
                    type="submit"
                    className="align-self-end btn btn-ghost w-[2%] self-center rounded-lg border-2 border-slate-900 bg-base-300 text-neutral"
                    // onClick={() => navigate({ to="/create-character/page3"})}
                >
                    {`>`}
                </button>
        </motion.div>
    );
}
