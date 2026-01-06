'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectSelectorProps {
  coreSubjects: string[];
  optionalSubjects: string[];
  selectedSubjects: string[];
  onToggle: (subject: string) => void;
  maxOptional?: number;
}

export function SubjectSelector({
  coreSubjects,
  optionalSubjects,
  selectedSubjects,
  onToggle,
  maxOptional = 2,
}: SubjectSelectorProps) {
  const selectedOptional = selectedSubjects.filter((s) =>
    optionalSubjects.includes(s)
  ).length;
  
  const canSelectMore = selectedOptional < maxOptional;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Select Your Subjects
        </h3>
        <p className="text-[var(--foreground)] opacity-70">
          Choose up to {maxOptional} optional subjects
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wide">
            Core Subjects (Required)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coreSubjects.map((subject) => (
              <div
                key={subject}
                className="p-4 rounded-[var(--radius-sm)] bg-[var(--primary)] bg-opacity-10 border border-[var(--primary)]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[var(--primary)] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="font-medium text-[var(--foreground)]">
                    {subject}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {optionalSubjects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wide">
              Optional Subjects (Choose up to {maxOptional})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {optionalSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                const isDisabled = !isSelected && !canSelectMore;

                return (
                  <motion.button
                    key={subject}
                    type="button"
                    whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                    whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                    onClick={() => !isDisabled && onToggle(subject)}
                    disabled={isDisabled}
                    className={cn(
                      'p-4 rounded-[var(--radius-sm)] border-2 transition-all text-left',
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--border)]'
                        )}
                      >
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <span className="font-medium text-[var(--foreground)]">
                        {subject}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
