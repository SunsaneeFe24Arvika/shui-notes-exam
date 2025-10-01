
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true  // Se till att denna sätts!
    }),
    logout: () => set({ 
        user: null, 
        isAuthenticated: false 
    })
}));
