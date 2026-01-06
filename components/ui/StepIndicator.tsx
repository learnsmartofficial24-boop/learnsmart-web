'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StepIndicatorProps {
  current: number;
  total: number;
  labels?: string[];
}

export function StepIndicator({ current, total, labels = [] }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {labels[current - 1] || `Step ${current} of ${total}`}
        </h2>
        <span className="text-sm text-[var(--foreground)] opacity-70 font-medium">
          Step {current} of {total}
        </span>
      </div>
      
      <div className="relative">
        <div className="absolute inset-x-0 top-4 h-0.5 bg-[var(--border)]" />
        
        <div className="relative flex justify-between">
          {Array.from({ length: total }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === current;
            const isCompleted = stepNumber < current;
            
            return (
              <motion.div
                key={stepNumber}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-colors relative z-10
                    ${
                      isCompleted
                        ? 'bg-[var(--success)] text-white'
                        : isActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--card-hover)] text-[var(--foreground)] opacity-50'
                    }
                  `}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                
                <AnimatePresence>
                  {labels[stepNumber - 1] && (
                    <motion.p
                      className="mt-2 text-xs text-[var(--foreground)] opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                      exit={{ opacity: 0 }}
                    >
                      {labels[stepNumber - 1]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <motion.div
        className="h-2 bg-[var(--primary)] rounded-full mt-4"
        initial={{ width: 0 }}
        animate={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}