export interface User {
  id: string;
  email: string;
  name: string;
  role: 'FLEET_MANAGER' | 'DRIVER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(_credentials: LoginCredentials): Promise<AuthResponse | null> {
    // Returns null — triggers auth empty state until real API is connected
    return Promise.resolve(null);
  },

  async logout(): Promise<void> {
    localStorage.removeItem('transitops_token');
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User | null> {
    // Returns null — no authenticated user until real API
    return Promise.resolve(null);
  },
};
