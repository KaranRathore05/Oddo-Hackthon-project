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

// Demo users — one per role for hackathon demo
export const DEMO_USERS: Record<UserRole, User> = {
  FLEET_MANAGER: {
    id: 'user-fm-001',
    email: 'manager@transitops.io',
    name: 'Rajan K.',
    role: 'FLEET_MANAGER',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  DRIVER: {
    id: 'user-dr-001',
    email: 'driver@transitops.io',
    name: 'Alex M.',
    role: 'DRIVER',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  SAFETY_OFFICER: {
    id: 'user-so-001',
    email: 'safety@transitops.io',
    name: 'Priya S.',
    role: 'SAFETY_OFFICER',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  FINANCIAL_ANALYST: {
    id: 'user-fa-001',
    email: 'finance@transitops.io',
    name: 'Vikram T.',
    role: 'FINANCIAL_ANALYST',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
};

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
