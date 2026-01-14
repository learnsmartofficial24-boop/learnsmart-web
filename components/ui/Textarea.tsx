'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-[var(--radius-sm)]',
            'bg-[var(--card)] border border-[var(--border)]',
            'text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-50',
            'transition-all duration-[var(--transition-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-y min-h-[80px]',
            error && 'border-[var(--error)] focus:ring-[var(--error)]',
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[var(--foreground)] opacity-70">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
