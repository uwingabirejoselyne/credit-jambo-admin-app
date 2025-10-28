import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  admin: AdminUser;
  token: string;
}

export const authService = {
  /**
   * Admin login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Get current admin profile
   */
  async getProfile(): Promise<AdminUser> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
