const { title } = require("process");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,tsx,jsx}"],
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
        title: ["Dancing Script", "cursive"],
        subtitle: ["Amarante", "serif"],
        text: ["Maitree", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
