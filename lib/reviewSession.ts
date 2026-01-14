import type {
  ReviewSession,
  ReviewMetrics,
  CardProgress,
  SessionStats,
} from '@/lib/types';
import {
  scheduleReview,
  calculateSessionXP,
  getCardPerformanceStats,
} from '@/lib/spacedRepetition';

/**
 * Initialize a new review session for a deck.
 */
export function initializeSession(
  deckId: string,
  cardIds: string[],
  maxCards?: number
): ReviewSession {
  const selectedCardIds = maxCards
    ? cardIds.slice(0, maxCards)
    : cardIds;

  return {
    id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    deckId,
    cardIds: selectedCardIds,
    currentIndex: 0,
    startTime: new Date(),
    reviews: [],
    status: 'not_started',
  };
}

/**
 * Get the optimal card order for review.
 * Prioritizes due cards, then mixes in some new cards.
 */
export function getCardOrder(
  allCards: CardProgress[],
  cardIds: string[],
  newCardsPerSession: number = 3
): string[] {
  const availableCards = allCards.filter((card) =>
    cardIds.includes(card.cardId)
  );

  // Separate due cards and new cards (never reviewed)
  const dueCards = availableCards.filter((card) => card.isDue);
  const newCards = availableCards.filter(
    (card) => card.totalReviews === 0 && !card.isDue
  );
  const notDueCards = availableCards.filter(
    (card) => !card.isDue && card.totalReviews > 0
  );

  const orderedCards: string[] = [];

  // Add due cards first (sorted by urgency)
  dueCards.sort((a, b) => {
    const retentionA = a.retentionScore;
    const retentionB = b.retentionScore;
    return retentionA - retentionB; // Lower retention first
  });

  orderedCards.push(...dueCards.map((c) => c.cardId));

  // Add some new cards to learn
  const cardsToLearn = newCards.slice(0, newCardsPerSession);
  orderedCards.push(...cardsToLearn.map((c) => c.cardId));

  // If still room, add some not-due cards for review
  const reviewRemaining = 20 - orderedCards.length; // Max 20 cards per session
  if (reviewRemaining > 0 && notDueCards.length > 0) {
    notDueCards.sort((a, b) => {
      const retentionA = a.retentionScore;
      const retentionB = b.retentionScore;
      return retentionA - retentionB;
    });

    const reviewCards = notDueCards.slice(0, reviewRemaining);
    orderedCards.push(...reviewCards.map((c) => c.cardId));
  }

  return orderedCards;
}

/**
 * Record a review for a card.
 */
export function recordReview(
  session: ReviewSession,
  cardId: string,
  quality: number,
  currentSmData: any,
  timeTaken?: number
): ReviewSession {
  const review = scheduleReview(currentSmData, quality, cardId);
  review.timeTaken = timeTaken;

  return {
    ...session,
    reviews: [...session.reviews, review],
  };
}

/**
 * Move to the next card in the session.
 */
export function moveToNextCard(session: ReviewSession): ReviewSession {
  if (session.currentIndex >= session.cardIds.length - 1) {
    // Session complete
    return {
      ...session,
      status: 'completed',
      endTime: new Date(),
      currentIndex: session.cardIds.length,
    };
  }

  return {
    ...session,
    currentIndex: session.currentIndex + 1,
  };
}

/**
 * Pause the current session.
 */
export function pauseSession(session: ReviewSession): ReviewSession {
  return {
    ...session,
    status: 'paused',
    pausedAt: new Date(),
  };
}

/**
 * Resume a paused session.
 */
export function resumeSession(session: ReviewSession): ReviewSession {
  return {
    ...session,
    status: 'in_progress',
    pausedAt: undefined,
  };
}

/**
 * Calculate session statistics.
 */
export function calculateSessionStats(session: ReviewSession): SessionStats {
  const endTime = session.endTime || new Date();
  const duration = Math.floor(
    (endTime.getTime() - session.startTime.getTime()) / 1000
  );

  const cardsReviewed = session.reviews.length;

  const totalQuality = session.reviews.reduce((sum, r) => sum + r.quality, 0);
  const averageQuality =
    cardsReviewed > 0 ? totalQuality / cardsReviewed : 0;

  const cardsMastered = session.reviews.filter((r) => r.quality === 5).length;
  const cardsNeedReview = session.reviews.filter((r) => r.quality < 3).length;

  const cardsPerMinute =
    duration > 0 ? Math.round((cardsReviewed / duration) * 60) : 0;

  const newCardsLearned = session.reviews.filter((r) => r.repetitions === 0)
    .length;

  const xpEarned = calculateSessionXP(cardsReviewed, averageQuality);

  return {
    totalCardsReviewed: cardsReviewed,
    cardsDueToday: 0, // Would need to be passed in
    cardsDueTomorrow: 0, // Would need to be calculated
    averageQuality: Math.round(averageQuality * 100) / 100,
    cardsMastered,
    cardsNeedReview,
    sessionDuration: duration,
    cardsPerMinute,
    xpEarned,
    newCardsLearned,
  };
}

/**
 * Estimate how long a session will take.
 */
export function estimateSessionDuration(
  cardCount: number,
  avgTimePerCard: number = 30 // seconds
): number {
  return cardCount * avgTimePerCard;
}

/**
 * Check if a break should be recommended.
 */
export function shouldBreak(
  cardsReviewed: number,
  sessionDuration: number
): {
  shouldBreak: boolean;
  reason?: string;
} {
  // Suggest break after 25 minutes or 20 cards
  if (sessionDuration > 1500) {
    return {
      shouldBreak: true,
      reason: "You've been studying for over 25 minutes. Time for a break!",
    };
  }

  if (cardsReviewed >= 20) {
    return {
      shouldBreak: true,
      reason: "You've reviewed 20 cards. Great progress! Take a short break.",
    };
  }

  // Check if performance is declining
  if (cardsReviewed >= 5) {
    const recentQuality = cardsReviewed * 2; // Placeholder - would need actual data
    if (recentQuality < 2.5) {
      return {
        shouldBreak: true,
        reason: 'Your performance is declining. Take a rest and come back refreshed.',
      };
    }
  }

  return { shouldBreak: false };
}

/**
 * Get a motivational message based on session performance.
 */
export function getMotivationalMessage(stats: SessionStats): string {
  const { averageQuality, cardsMastered, totalCardsReviewed } = stats;

  if (cardsMastered === totalCardsReviewed && totalCardsReviewed > 0) {
    return 'Perfect! You mastered every card this session. Keep up the amazing work!';
  }

  if (averageQuality >= 4.5) {
    return 'Excellent session! Your performance is outstanding. You\'re making great progress!';
  }

  if (averageQuality >= 4) {
    return 'Great job! You\'re really mastering this material. Keep it up!';
  }

  if (averageQuality >= 3.5) {
    return 'Good session! You\'re doing well. With more practice, you\'ll master these cards in no time.';
  }

  if (averageQuality >= 3) {
    return 'Nice effort! Some cards need more practice, but you\'re on the right track.';
  }

  return 'Don\'t worry! Spaced repetition is all about practice. You\'ll get better with each review.';
}

/**
 * Compare today's performance with average performance.
 */
export function compareWithAverage(
  todayStats: SessionStats,
  averageStats: { averageQuality: number; cardsPerMinute: number }
): {
  comparison: 'better' | 'same' | 'worse';
  message: string;
} {
  const qualityDiff = todayStats.averageQuality - averageStats.averageQuality;
  const speedDiff =
    todayStats.cardsPerMinute - averageStats.cardsPerMinute;

  if (qualityDiff > 0.3) {
    return {
      comparison: 'better',
      message: `Today's accuracy is ${Math.abs(qualityDiff).toFixed(1)} points higher than your average!`,
    };
  }

  if (qualityDiff < -0.3) {
    return {
      comparison: 'worse',
      message: `Today's accuracy is ${Math.abs(qualityDiff).toFixed(1)} points lower than usual. Keep practicing!`,
    };
  }

  if (speedDiff > 2) {
    return {
      comparison: 'better',
      message: `You're reviewing ${Math.abs(speedDiff)} more cards per minute than usual!`,
    };
  }

  return {
    comparison: 'same',
    message: 'Your performance is consistent with your average.',
  };
}

/**
 * Get cards that should be reviewed again soon (quality < 3).
 */
export function getCardsForImmediateReview(
  session: ReviewSession
): string[] {
  return session.reviews
    .filter((r) => r.quality < 3)
    .map((r) => r.cardId);
}

/**
 * Check if the session is complete.
 */
export function isSessionComplete(session: ReviewSession): boolean {
  return (
    session.status === 'completed' ||
    session.currentIndex >= session.cardIds.length
  );
}

/**
 * Get the current card ID in the session.
 */
export function getCurrentCardId(session: ReviewSession): string | null {
  if (session.currentIndex >= session.cardIds.length) {
    return null;
  }
  return session.cardIds[session.currentIndex];
}

/**
 * Get the percentage of session completed.
 */
export function getSessionProgress(session: ReviewSession): number {
  if (session.cardIds.length === 0) return 100;
  return Math.round((session.currentIndex / session.cardIds.length) * 100);
}
