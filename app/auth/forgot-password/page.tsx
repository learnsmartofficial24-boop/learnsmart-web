'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card padding="lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-[var(--success)] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-[var(--success)]" />
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              Check Your Email
            </h1>
            
            <p className="text-[var(--foreground)] opacity-70 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            
            <Link href="/auth/login">
              <Button variant="primary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
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
      <Card padding="lg">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-70 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Sign In</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Forgot Password?
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
