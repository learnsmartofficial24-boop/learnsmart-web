'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Pause,
  Play,
  SkipForward,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ReviewControlsProps {
  isFlipped: boolean;
  onRate: (quality: number) => void;
  onSkip: () => void;
  onPause: () => void;
  onExit: () => void;
  isPaused?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ReviewControls({
  isFlipped,
  onRate,
  onSkip,
  onPause,
  onExit,
  isPaused = false,
  disabled = false,
  className,
}: ReviewControlsProps) {
  const qualityButtons = [
    {
      quality: 1,
      label: 'Blackout',
      description: 'Complete blackout',
      color: 'bg-[var(--error)]',
      hoverColor: 'hover:bg-[var(--error)]/90',
      textColor: 'text-white',
    },
    {
      quality: 2,
      label: 'Incorrect',
      description: 'Incorrect response',
      color: 'bg-[var(--warning)]',
      hoverColor: 'hover:bg-[var(--warning)]/90',
      textColor: 'text-white',
    },
    {
      quality: 3,
      label: 'Hard',
      description: 'Correct with hesitation',
      color: 'bg-[var(--accent)]',
      hoverColor: 'hover:bg-[var(--accent)]/90',
      textColor: 'text-white',
    },
    {
      quality: 4,
      label: 'Good',
      description: 'Correct response',
      color: 'bg-[var(--success)]',
      hoverColor: 'hover:bg-[var(--success)]/90',
      textColor: 'text-white',
    },
    {
      quality: 5,
      label: 'Perfect',
      description: 'Perfect, instant',
      color: 'bg-[var(--primary)]',
      hoverColor: 'hover:bg-[var(--primary-hover)]',
      textColor: 'text-white',
    },
  ];

  return (
    <div className={cn('w-full', className)}>
      {/* Control buttons - top row */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          disabled={disabled}
          className="text-[var(--muted)] hover:text-[var(--error)]"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Exit</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onPause}
          disabled={disabled}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Pause</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          disabled={disabled || !isFlipped}
          className="text-[var(--muted)]"
        >
          <SkipForward className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Skip</span>
        </Button>
      </div>

      {/* Quality rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {qualityButtons.map((btn) => (
                <motion.button
                  key={btn.quality}
                  onClick={() => onRate(btn.quality)}
                  disabled={disabled}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg',
                    'transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    btn.color,
                    btn.hoverColor,
                    btn.textColor,
                    'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]'
                  )}
                >
                  <span className="text-xs font-bold opacity-70">
                    {btn.quality}
                  </span>
                  <span className="text-sm font-semibold hidden sm:inline">
                    {btn.label}
                  </span>
                  <span className="text-[10px] opacity-80 leading-tight">
                    {btn.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Keyboard shortcut hint */}
            <div className="mt-4 text-center text-xs text-[var(--muted)]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)]">1-5</kbd> to rate
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next card button */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex justify-center"
        >
          <Button
            onClick={() => onRate(3)} // Default to "Hard" when clicking next
            disabled={disabled}
            className="w-full sm:w-auto"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next Card
          </Button>
        </motion.div>
      )}
    </div>
  );
}
