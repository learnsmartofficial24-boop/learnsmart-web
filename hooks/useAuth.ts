'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth = true) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, requireAuth, router]);

  return { user, isAuthenticated };
}
