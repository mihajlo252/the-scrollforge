import { Link } from "@tanstack/react-router";
import logo from "/assets/the-scrollforge-logo.png";
import styles from "./Logo.module.css";

export const Logo = ({size} : {size?: string}) => {

	const logoSize = {
		"--size": size,
	} as React.CSSProperties
	return (
		<Link to={"/"} className={styles.logoWrapper}>
			<img src={logo} alt="Dash&Play Logo" className={styles.logo}  style={logoSize}/>
		</Link>
	);
};
