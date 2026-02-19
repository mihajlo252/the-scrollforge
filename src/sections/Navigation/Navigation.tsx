import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "../../utilities/signOut";
import { getUserFromLocal } from "../../utilities/getUserFromLocal";
import { useEffect, useState } from "react";
import { useUserStore } from "../../zustand/stores";
import { Popup } from "../../components/Popup/Popup";
import { BackButton } from "../../components/NavButtons";
import { SideMenu } from "../../components/SideMenu/SideMenu";
import { Logo } from "../../components/Logo/Logo";
import styles from "./Navigation.module.css";

export const Navigation = () => {
	const navigate = useNavigate();

	const { user, removeUser } = useUserStore();
	const [openSignOut, setOpenSignOut] = useState(false);
	const [menu, setMenu] = useState(false);

	const [newUser, setNewUser] = useState(getUserFromLocal() || "");

	const handleSignOut = async (e: React.FormEvent) => {
		e.preventDefault()
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
		setMenu(false);
		if (user) {
			setNewUser(user);
		}
	}, [user]);

	if (!newUser) return <div></div>;

	return (
		<motion.nav className={styles.nav} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className={styles.menuItems}>
				<BackButton classes="button button-primary button-ghost short" />
				<button type="button" className="button button-primary button-ghost short " onClick={() => setMenu(true)}>
					<div className="bar"></div>
					<div className="bar"></div>
					<div className="bar"></div>
				</button>
			</div>

			<SideMenu closerFunc={setMenu} toggle={menu}>
				<div className={styles.sideMenuContent}>
					<Logo />
					<div className="list">
						<button type="button" className="button button-accent button-ghost" onClick={() => handleRedirect("/profile")}>
							Profile
						</button>
						<button type="button" className="button button-accent button-ghost" onClick={() => handleRedirect("/chat")}>
							Chat
						</button>
						<button type="button" className="button button-primary button-ghost" onClick={() => handleRedirect("/tickets")}>
							Support
						</button>
						<button type="button" className="button button-secondary button-ghost" onClick={() => setOpenSignOut(true)}>
							Sign Out
						</button>
					</div>
				</div>
			</SideMenu>

			<Popup closerFunc={setOpenSignOut} toggle={openSignOut}>
				<form className="boxSection form column-direction" onSubmit={handleSignOut}>
					<p>Are you sure you want to sign out?</p>
					<div className="choices">
						<button type="submit" className="button button-primary button-ghost">
							Yes
						</button>
						<button type="button" className="button button-secondary button-ghost" onClick={() => setOpenSignOut(false)}>
							No
						</button>
					</div>
				</form>
			</Popup>
		</motion.nav>
	);
};
