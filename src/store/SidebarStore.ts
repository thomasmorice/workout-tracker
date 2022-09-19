import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

type SessionType =
  InferQueryOutput<"event.get-events">[number]["workoutSession"];

type SidebarStateType =
  | "dashboard"
  | "add-session"
  | "edit-session"
  | "add-weighing"
  | "edit-weighing"
  | "edit-session-result";

interface SidebarState {
  sidebarCurrentState?: SidebarStateType;
  isSidebarOpened: () => void;
}

const useSidebarStore = create<SidebarState>()((set, get) => ({
  isSidebarOpened: () => {
    const { sidebarCurrentState } = get();
    return !!sidebarCurrentState;
  },
}));

export { useSidebarStore };
