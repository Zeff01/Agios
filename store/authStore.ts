import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null as User | null,
  userEmail: "",
  login: (user: User) =>
    set({ isAuthenticated: true, user, userEmail: user.email }),
  logout: () => set({ isAuthenticated: false, user: null, userEmail: "" }),
}));

export default useAuthStore;
