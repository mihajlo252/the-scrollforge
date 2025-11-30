import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../zustand/stores";
import { BorderButton } from "../components/BorderButton";
import logo from "/assets/the-scrollforge-logo.png";
import { Popup } from "../components/Popup";
import { BackButton, ForwardButton } from "../components/NavButtons";

export const Navigation = () => {
  const navigate = useNavigate();

  const { user, removeUser } = useUserStore();
  const [sign, setSign] = useState("Sign Up");
  const [openSignOut, setOpenSignOut] = useState(false);

  const [newUser, setNewUser] = useState(getUserFromLocal() || "");

  const handleSignOut = async () => {
    await signOut();
    setOpenSignOut(false);
    removeUser();
    setNewUser("");
    navigate({ to: "/" });
  };
  const handleRedirect = (path: string) => {
    if (path === "/signup") {
      setSign("Sign In");
    } else if (path === "/") {
      setSign("Sign Up");
    }
    navigate({ to: path });
  };

  useEffect(() => {
    if (user) {
      setNewUser(user);
    }
  }, [user]);

  return (
    <motion.nav
      className="flex justify-between gap-2 grow items-center p-4 h-[8vh] w-[calc(100vw-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex gap-5 items-center">
        <Link to={newUser ? "/profile" : "/"} className="font-bold uppercase text-neutral no-underline">
          <img src={logo} className="w-28" alt="Dash&Play Logo" />
        </Link>
        {newUser && (
          <BorderButton style="border-primary text-primary hover:border-primary hover:bg-primary" event={() => handleRedirect("/chat")}>
            Chat
          </BorderButton>
        )}
      </div>
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
            text="Sign Out"
            style="border-secondary text-secondary hover:border-secondary hover:bg-secondary mr-4"
            event={() => setOpenSignOut(true)}
          />
          <BorderButton
            text="Profile"
            style="border-primary text-primary hover:border-primary hover:bg-primary"
            event={() => handleRedirect("/profile")}
          />

          <div className="flex gap-2">
            <BackButton styles="border-primary text-primary hover:border-primary hover:bg-primary" />
            <ForwardButton styles="border-primary text-primary hover:border-primary hover:bg-primary" />
          </div>

          <Popup closerFunc={setOpenSignOut} toggle={openSignOut}>
            <p>Are you sure you want to sign out?</p>
            <div className="flex gap-2">
              <BorderButton text="Yes" style="border-primary text-primary hover:border-primary hover:bg-primary text-md" event={handleSignOut} />
              <BorderButton
                text="No"
                style="border-secondary text-secondary hover:border-secondary hover:bg-secondary text-md"
                event={() => setOpenSignOut(false)}
              />
            </div>
          </Popup>
        </div>
      )}
    </motion.nav>
  );
};
