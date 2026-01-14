'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-[var(--primary)] text-white',
  primary: 'bg-[var(--primary)] text-white',
  secondary: 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)]',
  success: 'bg-[var(--success)] text-white',
  warning: 'bg-[var(--warning)] text-[var(--text-charcoal)]',
  error: 'bg-[var(--error)] text-white',
  info: 'bg-[var(--info)] text-white',
  danger: 'bg-[var(--error)] text-white',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full',
          'transition-all duration-[var(--transition-fast)]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
