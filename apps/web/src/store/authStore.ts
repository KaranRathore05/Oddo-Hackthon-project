import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { hasPermission, type Module } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  can: (module: Module, level?: 'view' | 'full') => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        localStorage.setItem('transitops_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('transitops_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user });
      },

      can: (module: Module, level: 'view' | 'full' = 'view') => {
        const user = get().user;
        if (!user) return false;
        return hasPermission(user.role, module, level);
      },
    }),
    {
      name: 'transitops-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
