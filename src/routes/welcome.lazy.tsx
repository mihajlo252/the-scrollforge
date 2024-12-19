import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/welcome")({
    component: Welcome,
});

function Welcome() {
    let currentUser = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN) || "";
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate({ to: "/profile" }), 2000 )
    }, [])

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center overflow-hidden"
        >
            <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0 justify-center items-center gap-20">
                <h1 className="text-5xl">Welcome {JSON.parse(currentUser).user.user_metadata.username}</h1>
            </BoxSection>
        </motion.main>
    );
}
