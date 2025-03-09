const { title } = require("process");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx,jsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        black: "#1e1d1d",
        white: "#f3efef",
        beige: "#e1d8d6",
        "dark-beige": "#b6beb8",
        "dark-green": "#5b6353",
      },
      fontFamily: {
        title: ["Great Vibes", "cursive"],
        subtitle: ["Arsenal SC", "serif"],
        text: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
