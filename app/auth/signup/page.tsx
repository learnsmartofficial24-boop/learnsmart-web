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

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: AuthFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create user and redirect to stream selection
    setUser({
      id: generateId(),
      name: data.name || '',
      email: data.email,
      class: 11, // Default to 11 for stream selection
      subjects: [],
      theme: 'light',
      createdAt: new Date(),
    });
    
    setIsLoading(false);
    router.push('/auth/stream-select');
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
            Join LearnSmart
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Create your account and start learning
          </p>
        </div>

        <AuthForm mode="signup" onSubmit={handleSignup} isLoading={isLoading} />

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--foreground)] opacity-70">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
