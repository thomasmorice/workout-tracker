import create from "zustand";
import { persist } from "zustand/middleware";

type Theme = "night" | "dark";

interface ThemeState {
  toggleTheme: () => void;
  theme: Theme;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "night",
      toggleTheme() {
        const { theme } = get();
        set({
          theme: theme === "night" ? "dark" : "night",
        });
      },
    }),
    {
      name: "theme", // unique name
    }
  )
);

export { useThemeStore };
