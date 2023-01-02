/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Work Sans", "ui-sans-serif", "system-ui"],
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

    "bg-green-900",
    "bg-red-900",
    "bg-yellow-900",
    "bg-gray-900",

    "border-yellow-700",
    "border-red-700",
    "border-green-700",
    "bg-gray-400",
  ],
  daisyui: {
    themes: [
      "night",
      "dark",
      "dracula",
      // {
      //   dark: {
      //     primary: "#BBAB8D",
      //     secondary: "#577371",
      //     accent: "#749E1F",
      //     neutral: "#16102D",
      //     "base-100": "#221D37",
      //     info: "#4EB6CA",
      //     success: "#66E5AA",
      //     warning: "#C19915",
      //     error: "#F75636",
      //   },
      // },
    ],
  },
  plugins: [require("daisyui")],
};
