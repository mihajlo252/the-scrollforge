/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import cornerShape from "@toolwind/corner-shape"

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		
	},
	plugins: [daisyui, cornerShape],
	daisyui: {
		themes: [
			{
				dark: {
					primary: "#ddc285",
					secondary: "#9e2222",
					accent: "#8587dd",
					neutral: "#dfecf8",
					"base-100": "#010b14",
					info: "#3ABFF8",
					success: "#36D399",
					warning: "#FBBD23",
					error: "#F87272",
				},
			},
		],
	},
};
