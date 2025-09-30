
import { create } from 'zustand';

export const useAuthStore = create(set => ({
    user : null,
    login : (user) => {
        set({ user : user })
    },
    logout : () => {
        set({ user : null })
    }
}));
