'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { useAuthStore } from '@/store/authStore';
import { generateId, validateEmail } from '@/lib/utils';
import { validatePassword } from '@/lib/validation';
import type { AuthFormData } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password).isValid) {
      newErrors.password = 'Invalid password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in production this would verify against backend
    // For demo, we're creating a mock user with the provided email
    setUser({
      id: generateId(),
      name: formData.email.split('@')[0] || 'User',
      email: formData.email,
      class: 10,
      subjects: [],
      theme: 'light',
      createdAt: new Date(),
    });
    
    setIsLoading(false);
    setShowSuccess(true);
    
    // Show success briefly then redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const isFormValid = validateEmail(formData.email) && validatePassword(formData.password).isValid;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px]"
      >
        {!showSuccess ? (
          <Card padding="lg" className="card-modern">
            {/* Logo */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">LS</span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">
                Sign In to Your Account
              </h1>
              <p className="text-[var(--foreground)] opacity-70 text-sm">
                Continue learning where you left off
              </p>
            </motion.div>

            <motion.form 
              variants={itemVariants}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <div className="space-y-3">
                <FormInput
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  error={errors.password}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={14} />
                      Hide password
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      Show password
                    </>
                  )}
                </button>
              </div>

              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-20"
                  />
                  <span className="text-sm text-[var(--foreground)]">Remember me</span>
                </label>
                
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[var(--primary)] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-semibold"
                  disabled={!isFormValid || isLoading}
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.form>

            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-[var(--foreground)] opacity-70 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-[var(--primary)] hover:underline font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </Card>
        ) : (
          <Card padding="lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-[var(--success)] bg-opacity-10 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle size={40} className="text-[var(--success)]" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-[var(--foreground)] mb-2"
              >
                Welcome back!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--foreground)] opacity-70"
              >
                Redirecting to your dashboard...
              </motion.p>
            </motion.div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}