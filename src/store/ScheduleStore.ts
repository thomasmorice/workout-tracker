import create from "zustand";

interface ScheduleState {
  currentVisibleDate: Date;
  set_currentVisibleDate: (date: Date) => void;
}

const useScheduleStore = create<ScheduleState>()((set) => ({
  currentVisibleDate: new Date(),
  set_currentVisibleDate(date) {
    set({
      currentVisibleDate: date,
    });
  },
}));

export { useScheduleStore };
