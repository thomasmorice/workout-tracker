import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

interface SidebarState {
  currentVisibleDate: Date;
  set_currentVisibleDate: (date: Date) => void;
  isSidebarLocked: boolean;
  set_isSidebarLocked: (locked: boolean) => void;
  createSession: () => void;
  editSession: (
    session: InferQueryOutput<"event.get-events">[number]["workoutSession"]
  ) => void;
  selectedSession?:
    | InferQueryOutput<"event.get-events">[number]["workoutSession"]
    | -1;
  closeSessionForm: () => void;
  // isEditingSessionResult: () => boolean;
  // editSessionResult: (
  //   result: InferQueryOutput<"workout-session.get-workout-sessions">[number]["workoutResults"][number]
  // ) => void;
  // selectedSessionResult?:
  //   | InferQueryOutput<"workout-session.get-workout-sessions">[number]["workoutResults"][number]
  //   | -1;
}

const useSidebarStore = create<SidebarState>()((set, get) => ({
  currentVisibleDate: new Date(),
  isSidebarLocked: false,
  set_currentVisibleDate(date) {
    set({
      currentVisibleDate: date,
    });
  },
  createSession: () => {
    set({
      selectedSession: -1,
    });
  },
  editSession: (session) => {
    set({
      selectedSession: session,
    });
  },
  closeSessionForm: () => {
    set({
      selectedSession: undefined,
    });
  },
  set_isSidebarLocked: (locked) => {
    set({
      isSidebarLocked: locked,
    });
  },
  // editSessionResult: (sessionResult) => {
  //   set({
  //     selectedSessionResult: sessionResult,
  //   });
  // },
  // isEditingSessionResult: () => {
  //   const { selectedSessionResult } = get();
  //   return selectedSessionResult !== -1;
  // },
}));

export { useSidebarStore };
