'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RootLayoutWrapper } from '@/components/Layout/RootLayoutWrapper';
import { FlashcardViewer } from '@/components/Flashcard/FlashcardViewer';
import { ReviewControls } from '@/components/Flashcard/ReviewControls';
import { SessionSummary } from '@/components/Flashcard/SessionSummary';
import { useFlashcardStore } from '@/store/flashcardStore';
import { shouldBreak } from '@/lib/reviewSession';

export default function ReviewSessionPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const {
    startReviewSession,
    getCurrentSession,
    getCurrentCard,
    getCurrentCardProgress,
    submitReview,
    nextCard,
    pauseSession,
    resumeSession,
    completeSession,
    endSession,
    getSessionProgress,
  } = useFlashcardStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);

  useEffect(() => {
    try {
      startReviewSession(deckId);
    } catch (error) {
      console.error('Failed to start session:', error);
      router.push('/review');
    }
  }, [deckId, startReviewSession, router]);

  const currentSession = getCurrentSession();
  const currentCard = getCurrentCard();
  const currentProgress = getCurrentCardProgress();
  const progress = getSessionProgress();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSummary) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key >= '1' && e.key <= '5' && isFlipped && currentCard) {
        handleRate(parseInt(e.key));
      } else if (e.key === 'n' || e.key === 'N') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCard, showSummary]);

  const handleRate = useCallback((quality: number) => {
    if (!currentCard || !currentSession) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    submitReview(currentCard.id, quality, timeTaken);
    setIsFlipped(false);
    setStartTime(Date.now());

    // Check if session is complete
    if (currentSession.currentIndex >= currentSession.cardIds.length - 1) {
      handleNext();
    } else {
      nextCard();
    }
  }, [currentCard, currentSession, startTime, submitReview, nextCard]);

  const handleNext = useCallback(() => {
    if (!currentSession) return;

    // Check if we should suggest a break
    const cardsReviewed = currentSession.reviews.length;
    const sessionDuration = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
    const breakSuggestion = shouldBreak(cardsReviewed, sessionDuration);

    if (breakSuggestion.shouldBreak) {
      setShowBreakSuggestion(true);
      return;
    }

    // Check if session is complete
    if (currentSession.currentIndex >= currentSession.cardIds.length - 1) {
      completeSession();
      setSessionStats(completeSession());
      setShowSummary(true);
    } else {
      nextCard();
      setIsFlipped(false);
      setStartTime(Date.now());
    }
  }, [currentSession, completeSession, nextCard]);

  const handleSkip = () => {
    handleRate(3); // Default to "Hard" when skipping
  };

  const handlePause = () => {
    if (!currentSession) return;
    if (currentSession.status === 'paused') {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const handleExit = () => {
    if (currentSession && currentSession.status === 'in_progress') {
      completeSession();
    }
    endSession();
    router.push('/review');
  };

  const handleContinueFromBreak = () => {
    setShowBreakSuggestion(false);
    if (currentSession && currentSession.currentIndex >= currentSession.cardIds.length - 1) {
      completeSession();
      setSessionStats(completeSession());
      setShowSummary(true);
    } else {
      nextCard();
      setIsFlipped(false);
      setStartTime(Date.now());
    }
  };

  const handleTakeBreak = () => {
    pauseSession();
    setShowBreakSuggestion(false);
  };

  const handleContinueFromSummary = () => {
    setShowSummary(false);
    endSession();
    router.push('/review');
  };

  const handleRetryFailed = () => {
    setShowSummary(false);
    // TODO: Implement retry logic
    router.push('/review');
  };

  const handleExitFromSummary = () => {
    setShowSummary(false);
    endSession();
    router.push('/review');
  };

  // Loading state
  if (!currentSession || !currentCard) {
    return (
      <RootLayoutWrapper>
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">Loading session...</p>
          </div>
        </div>
      </RootLayoutWrapper>
    );
  }

  // Session complete - show summary
  if (showSummary && sessionStats) {
    return (
      <RootLayoutWrapper>
        <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SessionSummary
              stats={sessionStats}
              deckName={deckId}
              onContinue={handleContinueFromSummary}
              onRetry={handleRetryFailed}
              onExit={handleExitFromSummary}
            />
          </div>
        </div>
      </RootLayoutWrapper>
    );
  }

  // Break suggestion modal
  if (showBreakSuggestion) {
    return (
      <RootLayoutWrapper>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card)] rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
              Time for a Break?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              You've been reviewing for a while. Taking a short break can help improve your retention.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleTakeBreak}
                className="flex-1"
              >
                Take Break
              </Button>
              <Button
                variant="primary"
                onClick={handleContinueFromBreak}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </div>
      </RootLayoutWrapper>
    );
  }

  // Active review session
  return (
    <RootLayoutWrapper>
      <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">
                Session Progress
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--card-hover)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-[var(--primary)]"
              />
            </div>
          </div>

          {/* Flashcard viewer */}
          <div className="mb-6">
            <FlashcardViewer
              front={currentCard.front}
              back={currentCard.back}
              cardNumber={currentSession.currentIndex + 1}
              totalCards={currentSession.cardIds.length}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped((prev) => !prev)}
              timeSpent={Math.floor((Date.now() - startTime) / 1000)}
            />
          </div>

          {/* Review controls */}
          <ReviewControls
            isFlipped={isFlipped}
            onRate={handleRate}
            onSkip={handleSkip}
            onPause={handlePause}
            onExit={handleExit}
            isPaused={currentSession.status === 'paused'}
          />

          {/* Session stats summary */}
          <div className="mt-8 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[var(--primary)]">
                  {currentSession.reviews.length}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Reviewed
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--success)]">
                  {currentSession.reviews.filter(r => r.quality >= 4).length}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Good/Perfect
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--warning)]">
                  {currentSession.reviews.filter(r => r.quality < 3).length}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Need Review
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-6 text-center text-xs text-[var(--muted)]">
            <p>Keyboard: Space to flip • 1-5 to rate • N to skip</p>
          </div>
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
