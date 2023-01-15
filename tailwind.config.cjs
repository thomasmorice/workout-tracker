/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Work Sans", "ui-sans-serif", "system-ui"],
      script: ["Kalam"],
    },

    extend: {
      animation: {
        tilt: "tilt 5s infinite linear",
      },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(0.5deg)",
          },
          "75%": {
            transform: "rotate(-0.5deg)",
          },
        },
      },
    },
  },
  safelist: [
    "alert-info",
    "alert-success",
    "alert-error",
    "alert-info",
    "text-green-300",
    "text-red-300",
    "text-yellow-300",

    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",

    "bg-green-700",
    "bg-red-700",
    "bg-yellow-700",

    "border-yellow-700",
    "border-red-700",
    "border-green-700",
    "bg-gray-400",

    "bg-green-900",
    "bg-red-900",
    "bg-yellow-900",
    "bg-gray-900",
    "bg-gray-400",
  ],
  daisyui: {
    themes: [
      "night",
      "dark",
      "dracula",
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-content": "#D1D6E0",
          primary: "#2D68FF",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};
