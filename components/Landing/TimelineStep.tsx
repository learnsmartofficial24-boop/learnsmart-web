'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStepProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
  delay?: number;
}

export function TimelineStep({
  icon: Icon,
  step,
  title,
  description,
  isLast = false,
  delay = 0,
}: TimelineStepProps) {
  return (
    <motion.div
      className="relative flex items-start gap-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Step Number and Icon */}
      <div className="flex flex-col items-center">
        <motion.div
          className={cn(
            'flex items-center justify-center w-16 h-16 rounded-full',
            'bg-[var(--primary)] text-white font-bold text-xl',
            'shadow-[var(--shadow-hover)]'
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {step}
        </motion.div>
        
        {/* Connecting Line */}
        {!isLast && (
          <motion.div
            className="w-0.5 h-24 bg-[var(--primary)]/30 mt-4"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6 text-[var(--primary)]" />
          <h3 className="text-2xl font-bold text-[var(--foreground)]">{title}</h3>
        </div>
        <p className="text-[var(--foreground)]/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
