'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
