'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateEmail, validatePassword } from '@/lib/utils';
import type { AuthFormData, ValidationError } from '@/lib/types';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <Input
          label="Full Name"
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Enter your full name"
          required
          disabled={isLoading}
        />
      )}

      <Input
        label="Email Address"
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        placeholder="Enter your email"
        required
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        id="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        placeholder="Enter your password"
        required
        disabled={isLoading}
      />

      {mode === 'signup' && (
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
          disabled={isLoading}
        />
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
}
