// loadingStore.ts
import { create } from "zustand";

interface LoadingState {
  initialLoading: boolean;
  webHookLoading: boolean;
  setInitialLoading: (isLoading: boolean) => void;
  setWebHookLoading: (isLoading: boolean) => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  initialLoading: true,
  webHookLoading: false,
  setInitialLoading: (isLoading) => set({ initialLoading: isLoading }),
  setWebHookLoading: (isLoading) => set({ webHookLoading: isLoading }),
}));

export default useLoadingStore;
