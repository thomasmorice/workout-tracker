/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Work Sans", "ui-sans-serif", "system-ui"],
    },
  },
  safelist: [
    "alert-info",
    "alert-success",
    "alert-error",
    "alert-info",
    "border-green-600",
    "text-green-600",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "border-yellow-600",
    "text-yellow-600",
    "border-red-600",
    "text-red-600",
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
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
