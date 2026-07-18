/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F0",
        ink: "#1B1F27",
        slate: {
          650: "#4B5261",
        },
        ledger: "#0F5C55",
        amber: {
          stamp: "#D89A1F",
        },
        rose: {
          stamp: "#B4463E",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
