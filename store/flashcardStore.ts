import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Flashcard,
  FlashcardDeck,
  SmSuperheroData,
  CardProgress,
  ReviewSession,
  ReviewMetrics,
  SessionStats,
} from '@/lib/types';
import {
  scheduleReview,
  getDueCards,
  getReviewQueue,
  generateReviewSchedule,
  calculateSessionXP,
  getCardPerformanceStats,
  estimateRetention,
} from '@/lib/spacedRepetition';
import {
  initializeSession,
  recordReview as recordReviewUtil,
  moveToNextCard,
  pauseSession,
  resumeSession,
  calculateSessionStats,
  isSessionComplete,
  getCurrentCardId,
  getSessionProgress,
  shouldBreak,
} from '@/lib/reviewSession';

interface FlashcardState {
  // Flashcards
  flashcards: Record<string, Flashcard>;
  decks: Record<string, FlashcardDeck>;

  // Progress tracking
  cardProgress: Record<string, CardProgress>;
  reviewHistory: ReviewMetrics[];

  // Review session
  currentSession: ReviewSession | null;

  // Stats
  lastReviewDate: Date | null;
  currentStreak: number;
  totalXP: number;

  // Actions
  // Deck management
  createDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>) => string;
  updateDeck: (deckId: string, updates: Partial<FlashcardDeck>) => void;
  deleteDeck: (deckId: string) => void;
  getDeck: (deckId: string) => FlashcardDeck | null;

  // Flashcard management
  createFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (cardId: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (cardId: string) => void;
  getFlashcard: (cardId: string) => Flashcard | null;
  getFlashcardsByDeck: (deckId: string) => Flashcard[];

  // Progress management
  initializeCardProgress: (cardId: string) => void;
  updateCardProgress: (cardId: string, reviewMetrics: ReviewMetrics) => void;
  getCardProgress: (cardId: string) => CardProgress | null;
  getAllCardProgress: () => CardProgress[];
  getDueCards: () => CardProgress[];
  getReviewQueue: () => CardProgress[];

  // Review session management
  startReviewSession: (deckId: string, maxCards?: number) => ReviewSession;
  submitReview: (cardId: string, quality: number, timeTaken?: number) => void;
  nextCard: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => SessionStats;
  endSession: () => void;
  getCurrentSession: () => ReviewSession | null;
  getCurrentCard: () => Flashcard | null;
  getCurrentCardProgress: () => CardProgress | null;
  getSessionProgress: () => number;

  // Stats and schedules
  getReviewSchedule: (days?: number) => Record<string, any[]>;
  getPerformanceStats: () => {
    totalCards: number;
    dueToday: number;
    dueThisWeek: number;
    averageRetention: number;
    cardsNeedingAttention: number;
    masteredCards: number;
  };
  getReviewStats: () => {
    totalReviews: number;
    averageQuality: number;
    lastReviewDate: Date | null;
    currentStreak: number;
  };
  getDailyXP: () => number;
  updateStreak: () => void;
}

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      // Initial state
      flashcards: {},
      decks: {},
      cardProgress: {},
      reviewHistory: [],
      currentSession: null,
      lastReviewDate: null,
      currentStreak: 0,
      totalXP: 0,

      // Deck management
      createDeck: (deckData) => {
        const deckId = `deck-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const deck: FlashcardDeck = {
          id: deckId,
          ...deckData,
          createdAt: new Date(),
        };

        set((state) => ({
          decks: { ...state.decks, [deckId]: deck },
        }));

        return deckId;
      },

      updateDeck: (deckId, updates) => {
        set((state) => ({
          decks: {
            ...state.decks,
            [deckId]: state.decks[deckId]
              ? { ...state.decks[deckId], ...updates }
              : state.decks[deckId],
          },
        }));
      },

      deleteDeck: (deckId) => {
        set((state) => {
          const newDecks = { ...state.decks };
          delete newDecks[deckId];

          // Also delete all flashcards in this deck
          const newFlashcards = { ...state.flashcards };
          state.decks[deckId]?.cardIds.forEach((cardId) => {
            delete newFlashcards[cardId];
          });

          // Delete card progress
          const newCardProgress = { ...state.cardProgress };
          state.decks[deckId]?.cardIds.forEach((cardId) => {
            delete newCardProgress[cardId];
          });

          return {
            decks: newDecks,
            flashcards: newFlashcards,
            cardProgress: newCardProgress,
          };
        });
      },

      getDeck: (deckId) => {
        return get().decks[deckId] || null;
      },

      // Flashcard management
      createFlashcard: (cardData) => {
        const cardId = `card-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const card: Flashcard = {
          id: cardId,
          ...cardData,
          createdAt: new Date(),
        };

        set((state) => ({
          flashcards: { ...state.flashcards, [cardId]: card },
          decks: {
            ...state.decks,
            [cardData.deckId]: state.decks[cardData.deckId]
              ? {
                  ...state.decks[cardData.deckId],
                  cardIds: [
                    ...state.decks[cardData.deckId].cardIds,
                    cardId,
                  ],
                }
              : state.decks[cardData.deckId],
          },
        }));

        // Initialize progress for the new card
        get().initializeCardProgress(cardId);
      },

      updateFlashcard: (cardId, updates) => {
        set((state) => ({
          flashcards: {
            ...state.flashcards,
            [cardId]: state.flashcards[cardId]
              ? { ...state.flashcards[cardId], ...updates }
              : state.flashcards[cardId],
          },
        }));
      },

      deleteFlashcard: (cardId) => {
        set((state) => {
          const newFlashcards = { ...state.flashcards };
          delete newFlashcards[cardId];

          // Remove from deck
          const deckId = state.flashcards[cardId]?.deckId;
          let newDecks = state.decks;
          if (deckId && state.decks[deckId]) {
            newDecks = {
              ...state.decks,
              [deckId]: {
                ...state.decks[deckId],
                cardIds: state.decks[deckId].cardIds.filter(
                  (id) => id !== cardId
                ),
              },
            };
          }

          // Delete progress
          const newCardProgress = { ...state.cardProgress };
          delete newCardProgress[cardId];

          return {
            flashcards: newFlashcards,
            decks: newDecks,
            cardProgress: newCardProgress,
          };
        });
      },

      getFlashcard: (cardId) => {
        return get().flashcards[cardId] || null;
      },

      getFlashcardsByDeck: (deckId) => {
        const deck = get().decks[deckId];
        if (!deck) return [];

        return deck.cardIds
          .map((cardId) => get().flashcards[cardId])
          .filter((card): card is Flashcard => card !== undefined);
      },

      // Progress management
      initializeCardProgress: (cardId) => {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Due tomorrow

        set((state) => ({
          cardProgress: {
            ...state.cardProgress,
            [cardId]: {
              cardId,
              smData: {
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
              },
              nextReviewDate: today,
              totalReviews: 0,
              successfulReviews: 0,
              failedReviews: 0,
              averageQuality: 0,
              successRate: 100,
              lastReviewed: new Date(),
              isDue: false,
              retentionScore: 100,
            },
          },
        }));
      },

      updateCardProgress: (cardId, reviewMetrics) => {
        const previousProgress = get().cardProgress[cardId];
        if (!previousProgress) return;

        const totalReviews = previousProgress.totalReviews + 1;
        const successfulReviews =
          previousProgress.successfulReviews + (reviewMetrics.quality >= 3 ? 1 : 0);
        const failedReviews =
          previousProgress.failedReviews + (reviewMetrics.quality < 3 ? 1 : 0);

        const totalQuality =
          previousProgress.averageQuality * previousProgress.totalReviews +
          reviewMetrics.quality;
        const averageQuality = totalQuality / totalReviews;
        const successRate = (successfulReviews / totalReviews) * 100;

        const retentionScore = estimateRetention(
          reviewMetrics.reviewDate,
          reviewMetrics.interval
        );

        set((state) => ({
          cardProgress: {
            ...state.cardProgress,
            [cardId]: {
              cardId,
              smData: {
                easeFactor: reviewMetrics.easeFactor,
                interval: reviewMetrics.interval,
                repetitions: reviewMetrics.repetitions,
              },
              nextReviewDate: reviewMetrics.nextReviewDate,
              totalReviews,
              successfulReviews,
              failedReviews,
              averageQuality,
              successRate,
              lastReviewed: reviewMetrics.reviewDate,
              isDue: false,
              retentionScore,
            },
          },
          reviewHistory: [...state.reviewHistory, reviewMetrics],
          lastReviewDate: reviewMetrics.reviewDate,
          totalXP: state.totalXP + calculateSessionXP(1, reviewMetrics.quality),
        }));

        get().updateStreak();
      },

      getCardProgress: (cardId) => {
        return get().cardProgress[cardId] || null;
      },

      getAllCardProgress: () => {
        return Object.values(get().cardProgress);
      },

      getDueCards: () => {
        return getDueCards(get().getAllCardProgress());
      },

      getReviewQueue: () => {
        return getReviewQueue(get().getAllCardProgress());
      },

      // Review session management
      startReviewSession: (deckId, maxCards) => {
        const deck = get().decks[deckId];
        if (!deck) throw new Error('Deck not found');

        // Filter cards that exist and have progress
        const validCardIds = deck.cardIds.filter(
          (cardId) =>
            get().flashcards[cardId] && get().cardProgress[cardId]
        );

        const session = initializeSession(deckId, validCardIds, maxCards);

        // Update due status for all cards
        const today = getToday();
        set((state) => ({
          currentSession: session,
          cardProgress: Object.fromEntries(
            Object.entries(state.cardProgress).map(([id, progress]) => [
              id,
              {
                ...progress,
                isDue: new Date(progress.nextReviewDate) <= today,
              },
            ])
          ),
        }));

        return session;
      },

      submitReview: (cardId, quality, timeTaken) => {
        const session = get().currentSession;
        if (!session) return;

        const progress = get().cardProgress[cardId];
        if (!progress) return;

        const updatedSession = recordReviewUtil(
          session,
          cardId,
          quality,
          progress.smData,
          timeTaken
        );

        // Update card progress
        get().updateCardProgress(
          cardId,
          updatedSession.reviews[updatedSession.reviews.length - 1]
        );

        set({ currentSession: updatedSession });
      },

      nextCard: () => {
        const session = get().currentSession;
        if (!session) return;

        const updatedSession = moveToNextCard(session);

        if (isSessionComplete(updatedSession)) {
          set({ currentSession: updatedSession });
        } else {
          set({ currentSession: updatedSession });
        }
      },

      pauseSession: () => {
        const session = get().currentSession;
        if (!session) return;

        set({ currentSession: pauseSession(session) });
      },

      resumeSession: () => {
        const session = get().currentSession;
        if (!session) return;

        set({ currentSession: resumeSession(session) });
      },

      completeSession: () => {
        const session = get().currentSession;
        if (!session) {
          return {
            totalCardsReviewed: 0,
            cardsDueToday: 0,
            cardsDueTomorrow: 0,
            averageQuality: 0,
            cardsMastered: 0,
            cardsNeedReview: 0,
            sessionDuration: 0,
            cardsPerMinute: 0,
            xpEarned: 0,
            newCardsLearned: 0,
          };
        }

        const stats = calculateSessionStats(session);
        return stats;
      },

      endSession: () => {
        set({ currentSession: null });
      },

      getCurrentSession: () => {
        return get().currentSession;
      },

      getCurrentCard: () => {
        const session = get().currentSession;
        if (!session) return null;

        const cardId = getCurrentCardId(session);
        if (!cardId) return null;

        return get().flashcards[cardId] || null;
      },

      getCurrentCardProgress: () => {
        const session = get().currentSession;
        if (!session) return null;

        const cardId = getCurrentCardId(session);
        if (!cardId) return null;

        return get().cardProgress[cardId] || null;
      },

      getSessionProgress: () => {
        const session = get().currentSession;
        if (!session) return 0;

        return getSessionProgress(session);
      },

      // Stats and schedules
      getReviewSchedule: (days = 30) => {
        const cards = get().getAllCardProgress();
        return generateReviewSchedule(cards, days);
      },

      getPerformanceStats: () => {
        const cards = get().getAllCardProgress();
        return getCardPerformanceStats(cards);
      },

      getReviewStats: () => {
        const state = get();
        const reviews = state.reviewHistory;
        const totalReviews = reviews.length;

        const averageQuality =
          totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.quality, 0) / totalReviews
            : 0;

        return {
          totalReviews,
          averageQuality: Math.round(averageQuality * 100) / 100,
          lastReviewDate: state.lastReviewDate,
          currentStreak: state.currentStreak,
        };
      },

      getDailyXP: () => {
        const today = getToday();
        const reviews = get().reviewHistory.filter(
          (r) => new Date(r.reviewDate) >= today
        );

        return reviews.reduce((total, r) => total + calculateSessionXP(1, r.quality), 0);
      },

      updateStreak: () => {
        const state = get();
        const lastReview = state.lastReviewDate;
        const today = getToday();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastReview) {
          set({ currentStreak: 1 });
          return;
        }

        const lastReviewDate = new Date(lastReview);
        lastReviewDate.setHours(0, 0, 0, 0);

        if (lastReviewDate.getTime() === today.getTime()) {
          // Already reviewed today, streak remains
          return;
        } else if (lastReviewDate.getTime() === yesterday.getTime()) {
          // Reviewed yesterday, increment streak
          set({ currentStreak: state.currentStreak + 1 });
        } else if (lastReviewDate < yesterday) {
          // Streak broken
          set({ currentStreak: 1 });
        }
      },
    }),
    {
      name: 'learnsmartFlashcards',
      partialize: (state) => ({
        flashcards: state.flashcards,
        decks: state.decks,
        cardProgress: state.cardProgress,
        reviewHistory: state.reviewHistory,
        lastReviewDate: state.lastReviewDate,
        currentStreak: state.currentStreak,
        totalXP: state.totalXP,
      }),
    }
  )
);
