'use client';

import { motion } from 'framer-motion';
import { Calculator, Dna } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpecializationSelectorProps {
  selected: 'pcm' | 'pcb' | null;
  onSelect: (spec: 'pcm' | 'pcb') => void;
}

const specializations = [
  {
    value: 'pcm' as const,
    label: 'PCM (Physics, Chemistry, Math)',
    icon: Calculator,
    description: 'For engineering and technical careers',
  },
  {
    value: 'pcb' as const,
    label: 'PCB (Physics, Chemistry, Biology)',
    icon: Dna,
    description: 'For medical and life sciences',
  },
];

export function SpecializationSelector({
  selected,
  onSelect,
}: SpecializationSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Choose Your Specialization
        </h3>
        <p className="text-[var(--foreground)] opacity-70">
          Select your science stream specialization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specializations.map((spec) => {
          const Icon = spec.icon;
          const isSelected = selected === spec.value;

          return (
            <motion.button
              key={spec.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(spec.value)}
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
                <h4 className="font-semibold text-base text-[var(--foreground)] mb-1">
                  {spec.label}
                </h4>
                <p className="text-sm text-[var(--foreground)] opacity-70">
                  {spec.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
