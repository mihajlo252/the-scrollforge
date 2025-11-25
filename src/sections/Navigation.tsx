import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { signOut } from "../utilities/signOut";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../zustand/stores";
import { BorderButton } from "../components/BorderButton";
import logo from "/assets/the-scrollforge-logo.png";
import { toast } from "../utilities/toasterSonner";
import { Popup } from "../components/Popup";

export const Navigation = () => {
  const navigate = useNavigate();

  const { user, removeUser } = useUserStore();
  const [sign, setSign] = useState("Sign Up");
  const [openSignOut, setOpenSignOut] = useState(false);

  const [newUser, setNewUser] = useState(getUserFromLocal() || "");

  const currentLocation = useLocation().href

  // useEffect(() => {
    
  // }, [currentLocation]);

  const handleSignOut = async () => {
    await signOut();
    setOpenSignOut(false);
    removeUser();
    setNewUser("");
    navigate({ to: "/" });
  };
  const handleRedirect = (path: string) => {
    const gameMode = JSON.parse(JSON.stringify(localStorage.getItem("gameMode")));
    if (path === "/character") {
      let character = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("character")))) || null;
      if (!character) {
        toast({ style: "bg-secondary text-white", message: "Please select a character" });
        return;
      }
      navigate({ to: `/` + gameMode + "/" + path });
      return;
    } else if (path === "/signup") {
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleRedirect("/character");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  if (currentLocation.split("/")[currentLocation.split("/").length - 1] === "character") return;

  return (
    <motion.nav
      className="flex justify-between gap-2 fixed z-50 grow items-center p-4 h-[8vh] w-[calc(100vw-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
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
            event={() => setOpenSignOut(true)}
          />
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
