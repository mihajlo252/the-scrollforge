import { Link } from "@tanstack/react-router";
import logo from "/assets/the-scrollforge-logo.png";
import styles from "./Logo.module.css";

export const Logo = ({size, focusable} : {size?: string, focusable?: boolean}) => {

	const logoSize = {
		"--size": size,
	} as React.CSSProperties
	return (
		<Link to={"/"} className={styles.logoWrapper} tabIndex={focusable ? 0 : -1}>
			<img src={logo} alt="Dash&Play Logo" className={styles.logo}  style={logoSize}/>
		</Link>
	);
};
