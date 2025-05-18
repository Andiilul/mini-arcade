// tailwind.config.js
module.exports = {
	content: ["./src/**/*.{html,js,ts,jsx,tsx}"],

	theme: {
		extend: {
			keyframes: {
				hop: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20%)" },
				},
			},
			animation: {
				hop: "hop 0.6s ease-in-out infinite",
			},
			colors: {
				primary: "#ffcc00",
				background: "#1a112e",
				secondary: "#465be7",
			},
			fontFamily: {
				retro: ["var(--font-press-start)", "monospace"],
				orbitron: ["var(--font-orbitron)", "sans-serif"],
			},
		},
	},
	plugins: [],
};
