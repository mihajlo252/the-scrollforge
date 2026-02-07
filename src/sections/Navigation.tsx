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
import { SideMenu } from "../components/SideMenu";

export const Navigation = () => {
  const navigate = useNavigate();

  const { user, removeUser } = useUserStore();
  const [openSignOut, setOpenSignOut] = useState(false);
  const [menu, setMenu] = useState(false);

  const [newUser, setNewUser] = useState(getUserFromLocal() || "");

  const handleSignOut = async () => {
    await signOut();
    setOpenSignOut(false);
    removeUser();
    setNewUser("");
    navigate({ to: "/" });
  };
  const handleRedirect = (path: string) => {
    setMenu(false);
    navigate({ to: path });
  };

  useEffect(() => {
    setMenu(false)
    if (user) {
      setNewUser(user);
    }
  }, [user]);

  return (
    <motion.nav
      className="flex justify-between gap-2 items-center p-4 h-max w-[calc(100vw-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex gap-5 items-center">{newUser && <></>}</div>

      {newUser && (
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <BackButton styles="border-primary text-primary hover:border-primary hover:bg-primary" />
            <ForwardButton styles="border-primary text-primary hover:border-primary hover:bg-primary" />
            <BorderButton style="border-primary text-primary hover:porder-primary hover:bg-primary" event={() => setMenu(true)}>
              =
            </BorderButton>
          </div>

          <SideMenu closerFunc={setMenu} toggle={menu}>
            <div className="flex flex-col gap-20">
              <Link to={newUser ? "/profile" : "/"} className="font-bold uppercase text-neutral no-underline select-none">
                <img src={logo} className="" alt="Dash&Play Logo" />
              </Link>
              <div className="flex flex-col gap-5 w-max place-self-center">
                <BorderButton
                  text="Profile"
                  style="border-primary text-primary hover:border-primary hover:bg-primary"
                  event={() => handleRedirect("/profile")}
                />
                <BorderButton style="border-primary text-primary hover:border-primary hover:bg-primary" event={() => handleRedirect("/chat")}>
                  Chat
                </BorderButton>
                <BorderButton event={() => handleRedirect("/tickets")} style="border-accent text-accent hover:bg-accent">
                  Support
                </BorderButton>
                <BorderButton
                  text="Sign Out"
                  style="border-secondary text-secondary hover:border-secondary hover:bg-secondary"
                  event={() => setOpenSignOut(true)}
                />
              </div>
            </div>
          </SideMenu>

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
