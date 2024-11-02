import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useEffect, useState } from "react";

import { useUserStore } from "../zustand/stores";
import { useCharacterStore } from "../zustand/stores";


export const Route = createLazyFileRoute("/")({
    component: signinScreen,
});

function signinScreen() {
    const { getUser, setUser }: UserStore = useUserStore();
    const { setCharacter }: CharacterStore = useCharacterStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    let currentUser = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN) || null;
    let profile = "/character-profile";

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            setCharacter(JSON.parse(currentUser).user.id);
        }
    }, [currentUser]);

    const login = async (e: any) => {
        e.preventDefault();
        await getUser(email, password);
    };

    if (currentUser) {
        return (
            <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0">
                   <h1>Welcome {JSON.parse(currentUser).user.email}</h1>
                   <Link to={profile}>Enter</Link>
                </BoxSection>
            </motion.main>
        );
    }

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0">
                <form onSubmit={(e) => login(e)}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                </form>
            </BoxSection>
        </motion.main>
    );
}
