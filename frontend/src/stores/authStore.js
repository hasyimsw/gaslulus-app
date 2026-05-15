import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(email, password);
          const { token, ...user } = res.data.data;
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login gagal';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      loginWithGoogle: async (accessToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.googleLogin(accessToken);
          const { token, ...user } = res.data.data;
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login dengan Google gagal';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      register: async (name, email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(name, email, password, confirmPassword);
          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Registrasi gagal';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'gaslulus_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);
