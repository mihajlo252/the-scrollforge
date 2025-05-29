import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useEffect, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useUserStore } from "../zustand/stores";

export const Route = createLazyFileRoute("/")({
    component: signinScreen,
});

function signinScreen() {
    const { setUser } = useUserStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    let user = getUserFromLocal();

    const login = async (e: any) => {
        e.preventDefault();
        await setUser(email, password);
        navigate({ to: "/profile" });
    };

    useEffect(() => {
        if (user) {
            navigate({ to: "/profile" });
        }
    }, []);

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="relative w-full p-5 flex-col text-start overflow-y-hidden pt-0 justify-center items-center">
                <form onSubmit={(e) => login(e)}>
                    <BoxSection styles="w-full flex flex-col gap-5 px-20 py-10">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email" 
                                placeholder="dave@email.com"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-2 border-slate-900 bg-base-300 p-2 text-base-content"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="pass">Password:</label>
                            <input
                                type="password"
                                placeholder="*********"
                                id="pass"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-xl border-2 border-slate-900 bg-base-300 p-2 text-base-content"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>

                    </BoxSection>
                </form>
            </BoxSection>
        </motion.main>
    );
}
