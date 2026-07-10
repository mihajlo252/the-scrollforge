import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export const useTheme = () => {
	const [theme, setTheme] = useState<Theme>(() => {
		return (localStorage.getItem("theme") as Theme) ?? "dark";
	});

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return { theme, toggleTheme };
};
