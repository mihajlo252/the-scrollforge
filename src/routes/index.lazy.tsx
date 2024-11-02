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
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center overflow-hidden"
            >
                <BoxSection styles="w-full p-5 flex-col text-start gap-2 overflow-y-scroll pt-0 justify-center items-center gap-20">
                    <h1 className="text-5xl">Welcome {JSON.parse(currentUser).user.email}</h1>
                    <Link to="/character-profile" className="btn btn-primary text-2xl">
                        Enter
                    </Link>
                </BoxSection>
            </motion.main>
        );
    }

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full p-5 flex-col text-start overflow-y-scroll pt-0 justify-center items-center">
                <form
                    onSubmit={(e) => login(e)}
                    className="flex w-full flex-col items-center justify-center gap-5 overflow-y-scroll p-5 pt-0 text-start"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-neutral-content"
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
                            className="text-neutral-content"
                        />
                    </div>
                    <button onClick={login} className="btn btn-primary">Login</button>
                </form>
            </BoxSection>
        </motion.main>
    );
}
