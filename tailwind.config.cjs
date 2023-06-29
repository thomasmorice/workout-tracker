/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Roboto", "ui-sans-serif", "system-ui"],
    },

    extend: {
      animation: {
        tilt: "tilt 5s infinite linear",
        rotate: "rotate 30s infinite linear",
        translate: "translate 10s infinite linear",
      },
      keyframes: {
        rotate: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
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

    "menu-xs",
    "menu-sm",
    "menu-md",
    "menu-lg",
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          // "base-100": "#19181c",
          // "base-200": "#29272e",
          // "base-300": "#393740",
          // "base-content": "#D1D6E0",
          // primary: "#00C89C",
          "range-shdw": "black",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
