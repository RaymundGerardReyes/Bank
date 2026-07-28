import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  maskSensitiveData: boolean;
  toggleSidebar: () => void;
  toggleMaskSensitiveData: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  maskSensitiveData: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMaskSensitiveData: () => set((state) => ({ maskSensitiveData: !state.maskSensitiveData })),
}));
