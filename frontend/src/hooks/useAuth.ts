import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { AuthUser } from '@/types/auth.types';

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    const isAuthenticated = !!user && !!authService.getToken();

    return { user, isLoading, isAuthenticated };
}
