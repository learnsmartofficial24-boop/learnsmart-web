'use client';

import { motion } from 'framer-motion';
import { Microscope, Briefcase, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamSelectorProps {
  selected: 'science' | 'commerce' | 'arts' | null;
  onSelect: (stream: 'science' | 'commerce' | 'arts') => void;
}

const streams = [
  {
    value: 'science' as const,
    label: 'Science',
    icon: Microscope,
    description: 'Physics, Chemistry, Math/Biology',
  },
  {
    value: 'commerce' as const,
    label: 'Commerce',
    icon: Briefcase,
    description: 'Accountancy, Business, Economics',
  },
  {
    value: 'arts' as const,
    label: 'Arts',
    icon: Palette,
    description: 'History, Political Science, Geography',
  },
];

export function StreamSelector({ selected, onSelect }: StreamSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Choose Your Stream
        </h3>
        <p className="text-[var(--foreground)] opacity-70">
          Select your area of study for Class 11-12
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streams.map((stream) => {
          const Icon = stream.icon;
          const isSelected = selected === stream.value;

          return (
            <motion.button
              key={stream.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(stream.value)}
              className={cn(
                'p-6 rounded-[var(--radius-md)] border-2 transition-all',
                'flex flex-col items-center text-center gap-3',
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-full',
                  isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-hover)]'
                )}
              >
                <Icon size={24} />
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)] mb-1">
                  {stream.label}
                </h4>
                <p className="text-sm text-[var(--foreground)] opacity-70">
                  {stream.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
