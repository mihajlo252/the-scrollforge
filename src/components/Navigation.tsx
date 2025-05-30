import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../zustand/stores";
import { BorderButton } from "./BorderButton";
import logo from "/assets/the-scrollforge-logo.png";
import { toast } from "../utilities/toasterSonner";

export const Navigation = () => {
    const navigate = useNavigate();

    const { user, removeUser } = useUserStore();
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
                toast({ style: "bg-secondary text-white", message: "Please select a character" });
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
                <img src={logo} className="w-28" alt="Dash&Play Logo" />
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
                </div>
            )}
        </motion.nav>
    );
};
