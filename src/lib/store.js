import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, user: { email, name: email.split('@')[0] } });
  },
  register: async (email, password, name) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, user: { email, name } });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));