'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignupWizard } from '@/components/Auth/SignupWizard';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComplete = () => {
    setShowSuccess(true);
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card padding="lg">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-[var(--success)] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Welcome to LearnSmart! 🎉
            </h1>
            
            <p className="text-[var(--foreground)] opacity-70 mb-6">
              Your account has been created successfully. Redirecting to dashboard...
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SignupWizard onComplete={handleComplete} />
    </motion.div>
  );
}