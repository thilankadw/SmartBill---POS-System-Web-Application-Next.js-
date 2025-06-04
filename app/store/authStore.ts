import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      updateToken: (token) => set((state) => ({
        user: state.user ? { ...state.user, token } : null
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);