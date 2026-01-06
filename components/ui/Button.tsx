'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { ButtonVariant, ButtonSize } from '@/lib/types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-[var(--shadow-subtle)]',
  secondary: 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--card-hover)] border border-[var(--border)]',
  outline: 'bg-transparent text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white border border-[var(--primary)]',
  ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--card)]',
  danger: 'bg-[var(--error)] text-white hover:opacity-90 shadow-[var(--shadow-subtle)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        onClick={onClick as any}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium',
          'transition-all duration-[var(--transition-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
