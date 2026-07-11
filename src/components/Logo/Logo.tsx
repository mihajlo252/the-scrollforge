import { Link } from "@tanstack/react-router";
import styles from "./Logo.module.css";

export const Logo = ({ size, focusable, compact }: { size?: string; focusable?: boolean; compact?: boolean }) => {
	const logoStyle = size ? ({ "--logo-size": size } as React.CSSProperties) : undefined;

	return (
		<Link to={"/"} className={`${styles.logo} ${compact ? styles.compact : ""}`} tabIndex={focusable ? 0 : -1} style={logoStyle}>
			<img src=".\assets\the-scrollforge-logo.png" width={size} />
		</Link>
	);
};
