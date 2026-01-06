'use client';

import { motion } from 'framer-motion';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, padding = 'md', className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -2 } : undefined}
        className={cn(
          'bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)]',
          'shadow-[var(--shadow-subtle)] transition-all duration-[var(--transition-base)]',
          hover && 'hover:shadow-[var(--shadow-hover)] hover:border-[var(--border-hover)]',
          paddingStyles[padding],
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
