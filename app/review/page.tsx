'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ReviewDashboard } from '@/components/Flashcard/ReviewDashboard';
import { FlashcardDeckBrowser } from '@/components/Flashcard/FlashcardDeckBrowser';
import { DeckPreview } from '@/components/Flashcard/DeckPreview';
import { ScheduleViewer } from '@/components/Flashcard/ScheduleViewer';
import { RootLayoutWrapper } from '@/components/Layout/RootLayoutWrapper';
import type { FlashcardDeck } from '@/lib/types';

type ViewState = 'dashboard' | 'decks' | 'preview' | 'schedule';
type SelectedDeck = { deck: FlashcardDeck } | null;

export default function ReviewPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [selectedDeck, setSelectedDeck] = useState<SelectedDeck>(null);

  const handleStartReview = (deckId: string) => {
    router.push(`/review/session/${deckId}`);
  };

  const handleBrowseDecks = () => {
    setViewState('decks');
  };

  const handlePreviewDeck = (deckId: string) => {
    setSelectedDeck({ deck: { id: deckId } as FlashcardDeck });
    setViewState('preview');
  };

  const handleViewSchedule = () => {
    setViewState('schedule');
  };

  const handleBack = () => {
    setViewState('dashboard');
    setSelectedDeck(null);
  };

  const handleEditDeck = () => {
    // TODO: Implement edit deck
    console.log('Edit deck');
  };

  return (
    <RootLayoutWrapper>
      <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewState === 'dashboard' && (
              <ReviewDashboard
                onStartReview={handleStartReview}
                onBrowseDecks={handleBrowseDecks}
                onViewSchedule={handleViewSchedule}
              />
            )}

            {viewState === 'decks' && (
              <FlashcardDeckBrowser
                onStartReview={handleStartReview}
                onPreviewDeck={handlePreviewDeck}
              />
            )}

            {viewState === 'preview' && selectedDeck && (
              <DeckPreview
                deckId={selectedDeck.deck.id}
                onStartReview={() => handleStartReview(selectedDeck.deck.id)}
                onEditDeck={handleEditDeck}
                onBack={handleBack}
              />
            )}

            {viewState === 'schedule' && (
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
            )}

            {viewState === 'schedule' && (
              <ScheduleViewer />
            )}
          </motion.div>
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
