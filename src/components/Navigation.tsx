import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../zustand/stores";
import { BorderButton } from "./BorderButton";
import { TicketsButton } from "./TicketsButton";

export const Navigation = () => {
    const navigate = useNavigate();

    const { user, removeUser } = useUserStore();
    const [charSelected, setCharSelected] = useState("opacity-0");
    const [sign, setSign] = useState("Sign Up");

    const [newUser, setNewUser] = useState(getUserFromLocal() || "");

    const handleSignOut = async () => {
        await signOut();
        removeUser();
        setNewUser("");
        navigate({ to: "/" });
    };
    const handleRedirect = (path: string) => {
        if (path === "/character") {
            let character = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character")))) || null;
            if (!character) {
                setCharSelected("opacity-1");
                setTimeout(() => setCharSelected("opacity-0"), 2000);
                return;
            }
        }
        if (path === "/signup") {
            setSign("Sign In");
            navigate({ to: "/signup" });
        }
        if (path === "/") {
            setSign("Sign Up");
            navigate({ to: "/" });
        }
        navigate({ to: path });
    };

    useEffect(() => {
        if (user) {
            setNewUser(user);
        }
    }, [user]);

    return (
        <motion.nav className="flex justify-between gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to={newUser ? "/profile" : "/"} className="font-bold uppercase text-neutral no-underline">
                Dash&Play
            </Link>
            {!newUser && (
                <BorderButton
                    text={sign === "Sign Up" ? "Sign Up" : "Sign In"}
                    style="border-primary text-primary hover:border-primary hover:bg-primary"
                    event={() => handleRedirect(sign === "Sign Up" ? "/signup" : "/")}
                />
            )}

            {newUser && (
                <div className="flex items-center gap-2">
                    <p className={`${charSelected} text-secondary transition-opacity`}>Select a Character</p>
                    <BorderButton
                        text="Character"
                        style="border-primary text-primary hover:border-primary hover:bg-primary"
                        event={() => handleRedirect("/character")}
                    />
                    <BorderButton
                        text="Profile"
                        style="border-primary text-primary hover:border-primary hover:bg-primary"
                        event={() => handleRedirect("/profile")}
                    />
                    <BorderButton
                        text="Sign Out"
                        style="border-secondary text-secondary hover:border-secondary hover:bg-secondary"
                        event={handleSignOut}
                    />
                    <TicketsButton styles="cursor-pointer hover:scale-110 transition-all duration-150 ease-in absolute left-3 bottom-3 opacity-50 z-[99999]" color={"#d0a732"} size={50} strokeWidth={5} />
                </div>
            )}
        </motion.nav>
    );
};
