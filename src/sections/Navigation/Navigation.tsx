import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { signOut } from "../../utilities/signOut";
import { useState } from "react";
import { useUserStore } from "../../zustand/stores";
import { Popup } from "../../components/Popup/Popup";
import { BackButton } from "../../components/NavButtons";
import { Logo } from "../../components/Logo/Logo";
import styles from "./Navigation.module.css";
import { Icon } from "../../components/Primitives";
import { AccountPopover } from "../../components/SideMenu/AccountPopover";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";

export const Navigation = () => {
	const navigate = useNavigate();

	const { user, removeUser } = useUserStore();
	const [openSignOut, setOpenSignOut] = useState(false);
	const [menu, setMenu] = useState(false);


	const handleSignOut = async (e: React.FormEvent) => {
		e.preventDefault();
		await signOut();
		setOpenSignOut(false);
		removeUser();
		navigate({ to: "/" });
	};
	const handleRedirect = (path: string) => {
		setMenu(false);
		navigate({ to: path });
	};

	return (
		<motion.nav className={styles.nav} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Logo size="100" compact />
			<div className={styles.menuItems}>
				<BackButton classes="button button-primary" />
				<button type="button" className="button button-accent" onClick={() => handleRedirect("/chat")}>
					Chat
				</button>
				<ThemeToggle />
				<button type="button" className={`button button-primary ${styles.account}`} onClick={() => setMenu(true)}>
					<Icon name="user" />
				</button>
			</div>

			<AccountPopover closerFunc={setMenu} toggle={menu}>
				<div className={styles.accountMenu}>
					<div className={styles.accountHeader}>
						<div className={styles.accountAvatar}>
							{user?.user_metadata.username?.[0] ?? <Icon name="user" size={22} />}
						</div>
						<div className={styles.accountIdentity}>
							<div className={styles.accountName}>{user?.user_metadata.username ?? "Adventurer"}</div>
							{user?.email && <div className={styles.accountEmail}>{user.email}</div>}
						</div>
					</div>
					<div className={styles.accountDivider} />
					<div className={styles.accountActions}>
						<button type="button" className={styles.menuRow} onClick={() => handleRedirect("/tickets")}>
							<Icon name="book" size={16} />
							<span>Help &amp; Support</span>
						</button>
						<button
							type="button"
							className={`${styles.menuRow} ${styles.menuRowDanger}`}
							onClick={() => setOpenSignOut(true)}
						>
							<Icon name="back" size={16} />
							<span>Sign Out</span>
						</button>
					</div>
				</div>
			</AccountPopover>

			<Popup closerFunc={setOpenSignOut} toggle={openSignOut}>
				<form className="frame form column-direction" onSubmit={handleSignOut}>
					<p>Are you sure you want to sign out?</p>
					<div className="side-by-side">
						<button type="submit" className="button button-primary">
							Yes
						</button>
						<button type="button" className="button button-secondary" onClick={() => setOpenSignOut(false)}>
							No
						</button>
					</div>
				</form>
			</Popup>
		</motion.nav>
	);
};
