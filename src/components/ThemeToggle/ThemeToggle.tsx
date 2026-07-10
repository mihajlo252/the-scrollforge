import { useTheme } from "../../hooks/useTheme";
import { Icon } from "../Primitives";

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			type="button"
			className="button"
			onClick={toggleTheme}
			aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
		>
			<Icon name={theme === "dark" ? "moon" : "sun"} />
		</button>
	);
};
