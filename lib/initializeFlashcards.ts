import { useFlashcardStore } from '@/store/flashcardStore';
import { loadSampleFlashcards } from '@/data/sampleFlashcards';

/**
 * Initialize sample flashcard decks if none exist.
 * Call this on app startup or when needed.
 */
export function initializeSampleFlashcards() {
  const { decks, flashcards } = useFlashcardStore.getState();

  // Only initialize if no decks exist
  if (Object.keys(decks).length === 0) {
    const { decks: sampleDecks, flashcards: sampleCards } = loadSampleFlashcards();

    // Create decks
    sampleDecks.forEach((deck) => {
      useFlashcardStore.getState().createDeck(deck);
    });

    // Create flashcards and initialize their progress
    sampleCards.forEach((card) => {
      const cardData = {
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        conceptId: card.conceptId,
      };

      useFlashcardStore.getState().createFlashcard(cardData);
    });
  }
}

/**
 * Clear all flashcard data (for testing/reset purposes)
 */
export function clearAllFlashcards() {
  useFlashcardStore.setState({
    flashcards: {},
    decks: {},
    cardProgress: {},
    reviewHistory: [],
    currentSession: null,
    lastReviewDate: null,
    currentStreak: 0,
    totalXP: 0,
  });
}
