'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showToggle?: boolean;
  autoComplete?: string;
}

export function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  showToggle = false,
  autoComplete,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-[var(--danger)] ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-4 py-3 rounded-[var(--radius-md)] border-2 transition-all',
            'bg-[var(--card)] text-[var(--foreground)]',
            error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] focus:ring-opacity-20'
              : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20',
            disabled && 'opacity-50 cursor-not-allowed',
            'placeholder-[var(--foreground)] placeholder-opacity-50'
          )}
        />
        
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)] opacity-60 hover:opacity-100 transition-opacity"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-[var(--danger)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}