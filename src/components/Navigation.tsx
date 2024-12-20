import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../zustand/stores";

export const Navigation = () => {

    const navigate = useNavigate();

    const { user, removeUser } = useUserStore();

    const [newUser, setNewUser] = useState(getUserFromLocal() || "");

    const handleSignOut = async () => {
        await signOut();
        removeUser();
        setNewUser("");
        navigate({ to: "/" });
    };

    useEffect(() => {
        if(user) {
            setNewUser(user);
        }
    }, [user]);

    return (
        <motion.nav className="flex justify-between gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to={newUser ? "/profile" : "/"} className="uppercase text-neutral no-underline [&.active]:font-bold">
                Dash&Play
            </Link>
            {!newUser && <Link to="/signup" className="btn btn-ghost m-0 h-min min-h-0 px-4 py-2 uppercase text-neutral no-underline [&.active]:font-bold">Sign Up</Link>}

            {newUser && <button className="btn btn-ghost m-0 h-min min-h-0 px-4 py-2 uppercase text-neutral no-underline [&.active]:font-bold" onClick={handleSignOut}>Sign Out</button>}
        </motion.nav>
    );
};
