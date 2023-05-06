import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "night" | "dracula" | "dark";

interface ThemeState {
  toggleTheme: () => void;
  theme: Theme;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme() {
        const { theme } = get();
        // set({
        //   theme: theme === "night" ? "light" : "night",
        // });
      },
    }),
    {
      name: "theme", // unique name
    }
  )
);

export { useThemeStore };
