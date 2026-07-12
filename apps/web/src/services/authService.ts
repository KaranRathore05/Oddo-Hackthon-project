import { apiClient } from './apiClient';
import type { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials, { skipAuth: true });
  },

  async logout(): Promise<void> {
    localStorage.removeItem('transitops_token');
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.user;
  },
};
