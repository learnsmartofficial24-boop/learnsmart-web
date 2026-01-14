'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardViewerProps {
  front: string;
  back: string;
  cardNumber: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  timeSpent?: number;
  className?: string;
}

export function FlashcardViewer({
  front,
  back,
  cardNumber,
  totalCards,
  isFlipped,
  onFlip,
  timeSpent,
  className,
}: FlashcardViewerProps) {
  const [startTimer] = useState(Date.now());

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--foreground)]">
            {cardNumber} / {totalCards}
          </span>
        </div>
        {timeSpent !== undefined && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeSpent)}s</span>
          </div>
        )}
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${cardNumber} of ${totalCards}. Press Space to flip.`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div
              className={cn(
                'w-full h-full rounded-[var(--radius-lg)] p-8 flex flex-col items-center justify-center',
                'shadow-[var(--shadow-lg)] border border-[var(--border)]',
                'bg-[var(--card)] transition-colors'
              )}
            >
              <div className="flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-[var(--muted)]" />
              </div>
              <p
                className={cn(
                  'text-center text-lg leading-relaxed',
                  isFlipped
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--primary)] font-semibold'
                )}
              >
                {isFlipped ? back : front}
              </p>
              {!isFlipped && (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  Click or press Space to reveal answer
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile swipe hint */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--muted)] md:hidden">
        <AlertCircle className="w-4 h-4" />
        <span>Tap to flip • Swipe left/right to rate</span>
      </div>
    </div>
  );
}
