import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

interface ScheduleState {
  currentVisibleDate: Date;
  set_currentVisibleDate: (date: Date) => void;
  createSession: () => void;
  editSession: (
    session: InferQueryOutput<"workout-session.get-workout-sessions">[number]
  ) => void;
  selectedSession?:
    | InferQueryOutput<"workout-session.get-workout-sessions">[number]
    | -1;
  closeSessionForm: () => void;
}

const useScheduleStore = create<ScheduleState>()((set) => ({
  currentVisibleDate: new Date(),
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
}));

export { useScheduleStore };
