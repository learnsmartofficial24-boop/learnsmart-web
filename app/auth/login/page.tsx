'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/Auth/AuthForm';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { generateId } from '@/lib/utils';
import type { AuthFormData } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: AuthFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For now, just create a user and redirect
    // In production, this would authenticate with a backend
    setUser({
      id: generateId(),
      name: 'Demo User',
      email: data.email,
      class: 10,
      subjects: [],
      theme: 'light',
      createdAt: new Date(),
    });
    
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Sign in to continue your learning journey
          </p>
        </div>

        <AuthForm mode="login" onSubmit={handleLogin} isLoading={isLoading} />

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-[var(--primary)] hover:underline block"
          >
            Forgot your password?
          </Link>
          
          <p className="text-sm text-[var(--foreground)] opacity-70">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
