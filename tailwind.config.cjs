/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "ui-sans-serif", "system-ui"],
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
    themes: ["cupcake", "dark", "light", "cmyk"],
  },
  plugins: [require("daisyui")],
};
