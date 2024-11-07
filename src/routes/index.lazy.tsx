import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useState } from "react";
import { signIn } from "../utilities/signIn";
import { getUserFromLocal } from "../utilities/getUserFromLocal";


export const Route = createLazyFileRoute("/")({
    component: signinScreen,
});

function signinScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    let user = getUserFromLocal();
   
    const login = async (e: any) => {
        e.preventDefault();
        await signIn(email, password);
        navigate({to: "/welcome"})
    };

    if(user) {
        navigate({to: "/welcome"})
    }
    

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
            <BoxSection styles="w-full p-5 flex-col text-start overflow-y-hidden pt-0 justify-center items-center">
                <form
                    onSubmit={(e) => login(e)}
                    className="flex flex-col items-center justify-center gap-5 rounded-lg border-slate-800 bg-base-100 px-10 py-20 text-start"
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
