import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        black: "#4B4137",
        white: "#f9f5f3",
        beige: "#e1d8d6",
        green: "#D6E1DB",
        "dark-green": "#6D7764",
      },
      fontFamily: {
        title: ["var(--font-title)", "cursive"],
        subtitle: ["var(--font-subtitle)", "serif"],
        text: ["var(--font-text)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography, daisyui],
};

export default config;
