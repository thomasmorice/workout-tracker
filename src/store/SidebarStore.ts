import create from "zustand";
import { InferQueryOutput } from "../types/trpc";

type SessionType =
  InferQueryOutput<"event.get-events">[number]["workoutSession"];
type WeighingType = InferQueryOutput<"event.get-events">[number]["weighing"];

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
  currentVisibleDate: Date;
  set_currentVisibleDate: (date: Date) => void;
  isSidebarLocked: boolean;
  set_isSidebarLocked: (locked: boolean) => void;
  addWeighing: () => void;
  editWeighing: (weighing: WeighingType) => void;
  selectedWeighing?: WeighingType | -1;
  createSession: () => void;
  editSession: (session: SessionType) => void;
  selectedSession?: SessionType | -1;
  closeSessionForm: () => void;
}

const useSidebarStore = create<SidebarState>()((set, get) => ({
  currentVisibleDate: new Date(),
  isSidebarLocked: false,
  set_currentVisibleDate(date) {
    set({
      currentVisibleDate: date,
    });
  },
  isSidebarOpened: () => {
    const { sidebarCurrentState } = get();
    return !!sidebarCurrentState;
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
      selectedWeighing: undefined,
    });
  },
  set_isSidebarLocked: (locked) => {
    set({
      isSidebarLocked: locked,
    });
  },
  addWeighing: () => {
    set({
      selectedWeighing: -1,
    });
  },
  editWeighing: (weighing) => {
    set({
      selectedWeighing: weighing,
    });
  },
}));

export { useSidebarStore };
