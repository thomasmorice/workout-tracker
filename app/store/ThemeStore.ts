import create from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

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
        set({
          theme: theme === "light" ? "dark" : "light",
        });
      },
    }),
    {
      name: "theme", // unique name
    }
  )
);

export { useThemeStore };
