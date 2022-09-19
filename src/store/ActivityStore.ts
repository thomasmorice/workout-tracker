import create from "zustand";

interface ActivityState {
  currentMonth: Date;
  set_currentMonth: (date: Date) => void;
}

const useActivityStore = create<ActivityState>()((set, get) => ({
  currentMonth: new Date(),
  set_currentMonth(date) {
    set({
      currentMonth: date,
    });
  },
}));

export { useActivityStore };
