import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('gaslulus_user') || 'null'),
  token: localStorage.getItem('gaslulus_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...user } = res.data.data;
      localStorage.setItem('gaslulus_token', token);
      localStorage.setItem('gaslulus_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal';
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, confirmPassword });
      const { token, ...user } = res.data.data;
      localStorage.setItem('gaslulus_token', token);
      localStorage.setItem('gaslulus_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal';
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('gaslulus_token');
    localStorage.removeItem('gaslulus_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    localStorage.setItem('gaslulus_user', JSON.stringify(userData));
    set({ user: userData });
  },

  clearError: () => set({ error: null }),
}));
