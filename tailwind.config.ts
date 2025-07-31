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
        n1: "#FFFBF4",
        n2: "#fff9ee",
        n3: "#FFF1DD",
        py1: "#FFBE3F",
        po1: "#FF8F28",
        primaryDark: "#5E0712",
        blurWhite: "rgba(255, 255, 255, 0.5)",
      },
      boxShadow: {
        themeShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
      },
      screens: {
        xs: "460px",
      },
    },
  },
  plugins: [],
};

export default config;
