import { useState } from 'react';
import { authService } from '@/services/auth.service';
import type { AuthUser } from '@/types/auth.types';

export function useAuth() {
    const [user] = useState<AuthUser | null>(() => authService.getCurrentUser());
    const isLoading = false;

    const isAuthenticated = !!user && !!authService.getToken();

    return { user, isLoading, isAuthenticated };
}
