import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../../components/BoxSection";
import { useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/create-character/page3")({
    component: Page3,
});

function Page3() {

    const navigate = useNavigate();

    return (
        <motion.div className={`flex h-full w-full gap-2 overflow-hidden`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
                type="submit"
                className="align-self-end btn btn-ghost w-[2%] self-center rounded-lg border-2 border-slate-900 bg-base-300 text-neutral"
                onClick={() => navigate({ to: "/create-character/page2" })}
            >
                {`<`}
            </button>
            <BoxSection styles="w-full px-5 flex-col text-start gap-2 overflow-y-scroll pt-0">
                <p>This is Page 3</p>
            </BoxSection>
        </motion.div>
    );
}
