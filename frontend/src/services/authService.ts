import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async register(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    const res = await api.post('/auth/register', { name, email, password, role });
    return res.data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },
};
