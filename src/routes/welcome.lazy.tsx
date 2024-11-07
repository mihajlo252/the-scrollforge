import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";

export const Route = createLazyFileRoute("/welcome")({
    component: Welcome,
});

function Welcome() {
    let currentUser = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN) || "";

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center overflow-hidden"
        >
            <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0 justify-center items-center gap-20">
                <h1 className="text-5xl">Welcome {JSON.parse(currentUser).user.email}</h1>
                <Link to="/profile" className="btn btn-primary text-2xl">
                    Enter
                </Link>
            </BoxSection>
        </motion.main>
    );
}
