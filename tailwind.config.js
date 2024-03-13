const colors = require("tailwindcss/colors")

const ANACHAT_BASE_COLORS = {
	primary: "#e74009",
	"primary-content": "#ffffff",

	success: "#03a13d",
	error: "#ff4d4d",
	warning: "#FFC94D",
	secondary: "#74e300",
	accent: "#6E00E3",

	"--border-btn": "0.125rem",
	"--btn-focus-scale": "0.98",
	"--rounded-btn": "0.52rem",
	"--rounded-box": "0.52rem",

	"--outset-box-width": "0.2rem",

	"--instagram": "64.08% 0.257 5.44",
	"--discord": "65.06% 0.117 269.64",
}

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "media",
	content: ["./src/**/*.svelte", "./index.html"],

	daisyui: {
		darkTheme: "ananachat-dark",

		themes: [
			{
				"ananachat-dark": {
					...ANACHAT_BASE_COLORS,

					"base-100": "#19193a",
					"base-200": "#151533",
					"base-300": "#0f0e23",

					"base-content": "#ededf9",
					"--deemphasized-text": "#c5c8cc",

					neutral: "#444466",
					"--outset-box": "#000000",

					info: "#6478ff",
				},

				"ananachat-light": {
					...ANACHAT_BASE_COLORS,

					"base-100": "#efefef",
					"base-200": "#dcdcdc",
					"base-300": "#bdbdbd",

					"base-content": "#13132b",
					"--deemphasized-text": "#353233",

					neutral: "#888888",
					"--outset-box": "#aaaaaa",

					info: "#4257e1",
				},

				"ananachat-black": {
					...ANACHAT_BASE_COLORS,

					"base-100": "#202020",
					"base-200": "#111111",
					"base-300": "#040404",

					"base-content": colors.slate[50],
					"--deemphasized-text": colors.slate[300],

					neutral: "#444444",
					"--outset-box": "#131313",

					info: "#6478ff",

					"--rounded-box": "0px",
					"--rounded-btn": "0px",
				},

				"ananachat-sakura": {
					...ANACHAT_BASE_COLORS,

					"base-100": "#f2c4ec",
					"base-200": "#d1a7cc",
					"base-300": "#bf93ba",

					"base-content": "#0d0216",
					"--deemphasized-text": "#240e28",

					neutral: "#302532",
					"--outset-box": "#72446d",

					info: "#6478ff",

					"--rounded-box": "2rem",
					"--rounded-btn": "1.25rem",
				},
			},
		],
	},

	theme: {
		fontFamily: {
			sans: ["system-ui", "sans-serif"],
		},

		extend: {
			colors: {
				transparent: "transparent",
				current: "currentColor",

				...colors,
			},

			spacing: {
				128: "32rem",
				160: "40rem",
			},
		},
	},
	plugins: [require("daisyui"), require("tailwindcss-animated")],
}
