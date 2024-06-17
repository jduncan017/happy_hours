import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair", "serif"],
        allerta: ["Allerta", "sans-serif"],
      },
      colors: {
        neutral: "#fff9ee",
        neutralLight: "#FFFBF4",
        neutralDark: "#FFF1DD",
        primary: "#004e59",
        primaryDark: "#5E0712",
        primaryLight: "#F8B999",
        primaryRed: "#F86800",
        primaryOrange: "#FF8F28",
        primaryYellow: "#FFBE3F",
        secondaryBlue: "#406A91",
        tertiaryYellow: "#FCC686",
        blurWhite: "rgba(255, 255, 255, 0.5)",
        blurBlack: "rgba(0, 0, 0, 0.7)",
      },
      boxShadow: {
        themeShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
      },
      screens: {
        xs: "460px",
      },
    },
  },
  plugins: [],
};

export default config;
