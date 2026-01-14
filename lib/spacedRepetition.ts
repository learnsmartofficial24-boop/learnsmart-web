import type {
  SmSuperheroData,
  ReviewMetrics,
  CardProgress,
  ReviewSchedule,
  ReviewItem,
} from '@/lib/types';

// Default SM-2 parameters
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const INITIAL_INTERVAL = 1; // 1 day for first successful review

/**
 * Calculate the next ease factor based on current ease and quality rating.
 * Quality is on a scale of 1-5:
 * 5 - Perfect response
 * 4 - Correct response
 * 3 - Correct response with hesitation
 * 2 - Incorrect response
 * 1 - Complete blackout
 */
export function calculateEaseFactor(
  currentEase: number,
  quality: number
): number {
  // SM-2 formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEase =
    currentEase +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure ease factor doesn't go below minimum
  return Math.max(MIN_EASE_FACTOR, newEase);
}

/**
 * Calculate the interval (in days) until next review based on repetitions and ease factor.
 */
export function calculateInterval(
  repetitions: number,
  easeFactor: number
): number {
  if (repetitions === 0) {
    // New card - review tomorrow
    return 1;
  } else if (repetitions === 1) {
    // First successful review - review in 6 days
    return 6;
  } else {
    // Subsequent reviews: I(n) = I(n-1) * EF
    return Math.round(6 * easeFactor * Math.pow(easeFactor, repetitions - 2));
  }
}

/**
 * Calculate the next review date based on card's SM-2 data and quality rating.
 */
export function getNextReviewDate(
  cardId: string,
  quality: number,
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number
): ReviewMetrics {
  let newRepetitions = currentRepetitions;
  let newInterval = currentInterval;
  let newEaseFactor = currentEaseFactor;
  const reviewDate = new Date();

  if (quality < 3) {
    // Failed (quality 1 or 2) - reset to start
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Passed (quality 3, 4, or 5)
    newRepetitions = currentRepetitions + 1;
    newEaseFactor = calculateEaseFactor(currentEaseFactor, quality);
    newInterval = calculateInterval(newRepetitions, newEaseFactor);
  }

  // Calculate next review date
  const nextReviewDate = new Date(reviewDate);
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    cardId,
    quality,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    reviewDate,
    nextReviewDate,
  };
}

/**
 * Schedule a review for a card based on quality rating.
 */
export function scheduleReview(
  currentSmData: SmSuperheroData,
  quality: number,
  cardId: string
): ReviewMetrics {
  return getNextReviewDate(
    cardId,
    quality,
    currentSmData.easeFactor,
    currentSmData.interval,
    currentSmData.repetitions
  );
}

/**
 * Calculate estimated retention score (0-100) based on interval and days since last review.
 */
export function estimateRetention(
  lastReview: Date,
  interval: number
): number {
  const daysSinceReview = Math.floor(
    (Date.now() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceReview <= 0) {
    return 100; // Just reviewed
  }

  // Simple retention estimation based on forgetting curve
  // R = 100 * e^(-d / I) where d = days since review, I = interval
  const retention = 100 * Math.exp(-daysSinceReview / interval);

  return Math.max(0, Math.min(100, retention));
}

/**
 * Get cards that are due for review today.
 */
export function getDueCards(cards: CardProgress[]): CardProgress[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cards.filter((card) => {
    const dueDate = new Date(card.nextReviewDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  });
}

/**
 * Get the review queue - prioritized list of cards due for review.
 * Higher priority = more urgent review.
 */
export function getReviewQueue(cards: CardProgress[]): CardProgress[] {
  const dueCards = getDueCards(cards);

  // Sort by priority:
  // 1. Cards with lower retention score
  // 2. Cards with longer intervals (more urgent if overdue)
  // 3. Cards with fewer successful reviews
  return dueCards.sort((a, b) => {
    const retentionA = estimateRetention(a.lastReviewed, a.smData.interval);
    const retentionB = estimateRetention(b.lastReviewed, b.smData.interval);

    if (Math.abs(retentionA - retentionB) > 10) {
      return retentionA - retentionB; // Lower retention first
    }

    // If retention similar, prioritize longer intervals (more urgent if overdue)
    return b.smData.interval - a.smData.interval;
  });
}

/**
 * Calculate optimal daily review load based on cards due and available time.
 */
export function getOptimalDailyLoad(
  cards: CardProgress[],
  availableMinutes: number = 30
): number {
  const dueCards = getDueCards(cards);
  const avgTimePerCard = 0.5; // 30 seconds average per card

  // Calculate how many cards can be reviewed in available time
  const maxCards = Math.floor(availableMinutes / avgTimePerCard);

  // Return the minimum of due cards and max cards, but at least some cards
  return Math.min(dueCards.length, Math.max(maxCards, 10));
}

/**
 * Generate a review schedule for the next 30 days.
 */
export function generateReviewSchedule(
  cards: CardProgress[],
  days: number = 30
): ReviewSchedule {
  const schedule: ReviewSchedule = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    schedule[dateKey] = [];
  }

  // Add cards to schedule based on their next review date
  cards.forEach((card) => {
    const nextReview = new Date(card.nextReviewDate);
    const dateKey = nextReview.toISOString().split('T')[0];

    if (schedule[dateKey]) {
      schedule[dateKey].push({
        cardId: card.cardId,
        dueDate: card.nextReviewDate,
        priority: 100 - card.retentionScore, // Higher priority for lower retention
        estimatedDifficulty:
          card.smData.easeFactor > 2.3
            ? 'easy'
            : card.smData.easeFactor < 1.8
            ? 'hard'
            : 'medium',
      });
    }
  });

  return schedule;
}

/**
 * Calculate session XP based on performance.
 */
export function calculateSessionXP(
  cardsReviewed: number,
  averageQuality: number
): number {
  const baseXP = cardsReviewed * 10;
  const qualityBonus = Math.round((averageQuality / 5) * cardsReviewed * 5);
  return baseXP + qualityBonus;
}

/**
 * Get quality description for UI display.
 */
export function getQualityDescription(quality: number): string {
  const descriptions = {
    1: 'Complete blackout',
    2: 'Incorrect response',
    3: 'Correct with hesitation',
    4: 'Correct response',
    5: 'Perfect, instant',
  };
  return descriptions[quality as keyof typeof descriptions] || '';
}

/**
 * Get quality color for UI.
 */
export function getQualityColor(quality: number): string {
  if (quality <= 2) return 'text-[var(--error)]';
  if (quality === 3) return 'text-[var(--warning)]';
  if (quality === 4) return 'text-[var(--success)]';
  return 'text-[var(--primary)]';
}

/**
 * Validate if a review quality rating is valid (1-5).
 */
export function isValidQuality(quality: number): boolean {
  return Number.isInteger(quality) && quality >= 1 && quality <= 5;
}

/**
 * Get statistics about card performance.
 */
export function getCardPerformanceStats(cards: CardProgress[]): {
  totalCards: number;
  dueToday: number;
  dueThisWeek: number;
  averageRetention: number;
  cardsNeedingAttention: number; // Retention < 50%
  masteredCards: number; // Repetitions >= 5 and retention > 80%
} {
  const today = new Date();
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const dueToday = getDueCards(cards).length;
  const dueThisWeek = cards.filter(
    (card) => new Date(card.nextReviewDate) <= weekFromNow
  ).length;

  const totalRetention = cards.reduce(
    (sum, card) => sum + card.retentionScore,
    0
  );
  const averageRetention = cards.length > 0 ? totalRetention / cards.length : 0;

  const cardsNeedingAttention = cards.filter(
    (card) => card.retentionScore < 50
  ).length;

  const masteredCards = cards.filter(
    (card) => card.smData.repetitions >= 5 && card.retentionScore > 80
  ).length;

  return {
    totalCards: cards.length,
    dueToday,
    dueThisWeek,
    averageRetention: Math.round(averageRetention),
    cardsNeedingAttention,
    masteredCards,
  };
}
