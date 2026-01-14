'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RootLayoutWrapper } from '@/components/Layout/RootLayoutWrapper';
import { FlashcardDeckBrowser } from '@/components/Flashcard/FlashcardDeckBrowser';

export default function ReviewDecksPage() {
  const router = useRouter();

  const handleStartReview = (deckId: string) => {
    router.push(`/review/session/${deckId}`);
  };

  const handlePreviewDeck = (deckId: string) => {
    router.push(`/review/decks/${deckId}`);
  };

  return (
    <RootLayoutWrapper>
      <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FlashcardDeckBrowser
              onStartReview={handleStartReview}
              onPreviewDeck={handlePreviewDeck}
            />
          </motion.div>
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
