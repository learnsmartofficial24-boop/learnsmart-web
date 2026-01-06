'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClassSelectorProps {
  selected: number | null;
  onSelect: (classNum: number) => void;
}

const classes = [
  { value: 1, label: 'Class 1', description: 'Foundation' },
  { value: 2, label: 'Class 2', description: 'Basic Concepts' },
  { value: 3, label: 'Class 3', description: 'Building Blocks' },
  { value: 4, label: 'Class 4', description: 'Exploring Knowledge' },
  { value: 5, label: 'Class 5', description: 'Elementary' },
  { value: 6, label: 'Class 6', description: 'Middle School' },
  { value: 7, label: 'Class 7', description: 'Core Subjects' },
  { value: 8, label: 'Class 8', description: 'Fundamentals' },
  { value: 9, label: 'Class 9', description: 'Secondary' },
  { value: 10, label: 'Class 10', description: 'Board Prep' },
  { value: 11, label: 'Class 11', description: 'Senior Secondary' },
  { value: 12, label: 'Class 12', description: 'Senior Secondary' },
  { value: 13, label: '12+ Career', description: 'Competitive Exams' },
];

export function ClassSelector({ selected, onSelect }: ClassSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-bold text-[var(--foreground)]">Select Your Class</h3>
        <p className="text-[var(--foreground)] opacity-70 mt-2">
          Choose your current grade level or select 12+ for career paths
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {classes.map((cls, index) => {
          const isSelected = selected === cls.value;

          return (
            <motion.button
              key={cls.value}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(cls.value)}
              className={cn(
                'relative p-6 rounded-[var(--radius-md)] border-2 transition-all',
                'flex flex-col items-center text-center gap-3 min-h-[6rem]',
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]'
              )}
            >
              <div className="flex flex-col items-center">
                <div className="text-lg font-bold text-[var(--foreground)]">{cls.label}</div>
                <div 
                  className={cn(
                    'text-xs mt-1',
                    isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground)] opacity-60'
                  )}
                >
                  {cls.description}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}