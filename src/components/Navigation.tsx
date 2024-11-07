import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";

export const Navigation = () => {

    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate({ to: "/" });
    };

    return (
        <motion.nav className="flex justify-between gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/profile" className="uppercase text-neutral no-underline [&.active]:font-bold">
                Dash&Play
            </Link>
            <button className="uppercase text-neutral no-underline [&.active]:font-bold" onClick={handleSignOut}>Sign Out</button>
        </motion.nav>
    );
};
