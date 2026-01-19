import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BoxSection } from "../components/BoxSection";
import { useEffect, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { useUserStore } from "../zustand/stores";

import logo from "/assets/the-scrollforge-logo.png";

export const Route = createLazyFileRoute("/")({
  component: signinScreen,
});

function signinScreen() {
  const { setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  let user = getUserFromLocal();

  const login = async (e: any) => {
    e.preventDefault();
    await setUser(email, password);
    navigate({ to: "/profile" });
  };

  useEffect(() => {
    if (user) {
      navigate({ to: "/profile" });
    }
  }, []);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
      <BoxSection styles="relative w-full gap-10 p-10 flex-col text-start overflow-y-hidden justify-center items-center">
        <Link to={"/"} className="font-bold uppercase text-neutral no-underline select-none">
          <img src={logo} className="" alt="Dash&Play Logo" />
        </Link>
        <form className="self-center justify-self-center" onSubmit={(e) => login(e)}>
          <BoxSection styles="w-full flex flex-col gap-5 px-20 py-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 border-slate-900 bg-base-300 p-2 text-base-content"
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
                className="rounded-xl border-2 border-slate-900 bg-base-300 p-2 text-base-content"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <p className="text-base-content">
              Don't have an account?{" "}
              <a className="link transition-colors hover:text-primary" onClick={() => navigate({ to: "/signup" })}>
                Sign up here!
              </a>
            </p>
          </BoxSection>
        </form>
      </BoxSection>
    </motion.main>
  );
}
