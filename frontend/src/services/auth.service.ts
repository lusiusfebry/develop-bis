import api from './api';
import type { ApiResponse, AuthUser, LoginResponse } from '@/types/auth.types';

export const authService = {
    async login(nik: string, password: string): Promise<AuthUser> {
        const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', {
            nik,
            password,
        });

        const { token, user } = response.data.data;

        localStorage.setItem('bis_token', token);
        localStorage.setItem('bis_user', JSON.stringify(user));

        return user;
    },

    logout(): void {
        localStorage.removeItem('bis_token');
        localStorage.removeItem('bis_user');
    },

    async getMe(): Promise<AuthUser> {
        const response = await api.get<ApiResponse<AuthUser>>('/api/auth/me');
        return response.data.data;
    },

    getCurrentUser(): AuthUser | null {
        const userStr = localStorage.getItem('bis_user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr) as AuthUser;
        } catch {
            return null;
        }
    },

    getToken(): string | null {
        return localStorage.getItem('bis_token');
    },
};
