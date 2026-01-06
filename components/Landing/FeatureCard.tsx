'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-[var(--primary)]/5 rounded-[var(--radius-lg)] p-6',
        'border border-[var(--border)] hover:border-[var(--primary)]/30',
        'transition-all duration-300',
        'hover:shadow-[var(--shadow-hover)]'
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-[var(--primary)]/10 rounded-[var(--radius-md)]">
          <Icon className="w-12 h-12 text-[var(--primary)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{title}</h3>
        <p className="text-[var(--foreground)]/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
