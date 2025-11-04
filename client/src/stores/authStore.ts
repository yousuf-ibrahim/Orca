import { create } from 'zustand';
import axios from 'axios';

interface User {
  email: string;
  role: string;
  investorType: 'professional' | 'accredited' | 'retail' | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setInvestorType: (investorType: 'professional' | 'accredited' | 'retail') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const response = await axios.get('/api/auth/me');
      set({
        user: response.data.user,
        isAuthenticated: response.data.authenticated,
        isLoading: false,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (username: string, password: string) => {
    const response = await axios.post('/api/auth/login', { username, password });
    set({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await axios.post('/api/auth/logout');
    set({ user: null, isAuthenticated: false });
  },

  setInvestorType: async (investorType: 'professional' | 'accredited' | 'retail') => {
    await axios.post('/api/investor-classification', { investorType });
    set((state) => ({
      user: state.user ? { ...state.user, investorType } : null,
    }));
  },
}));
