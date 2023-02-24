import { create } from "zustand";

interface SidebarState {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isExpanded: boolean) => void;
}

const useSidebarStore = create<SidebarState>()((set, get) => ({
  isSidebarExpanded: false,
  setIsSidebarExpanded: (isExpanded) => {
    set({
      isSidebarExpanded: isExpanded,
    });
  },
}));

export { useSidebarStore };
