'use client';

import { motion } from 'framer-motion';
import {
  Play,
  Eye,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFlashcardStore } from '@/store/flashcardStore';
import { cn } from '@/lib/utils';
import type { FlashcardDeck } from '@/lib/types';

interface FlashcardDeckBrowserProps {
  onStartReview: (deckId: string) => void;
  onPreviewDeck: (deckId: string) => void;
  onCreateDeck?: () => void;
  className?: string;
}

export function FlashcardDeckBrowser({
  onStartReview,
  onPreviewDeck,
  onCreateDeck,
  className,
}: FlashcardDeckBrowserProps) {
  const { decks, getDueCards, getPerformanceStats } = useFlashcardStore();
  const performanceStats = getPerformanceStats();

  const deckList = Object.values(decks);

  // Calculate progress for each deck
  const decksWithProgress = deckList.map((deck) => {
    const dueCount = getDeckDueCount(deck.id);
    const progress = getDeckProgress(deck.id);
    const nextReview = getNextReviewDate(deck.id);

    return {
      ...deck,
      dueCount,
      progress,
      nextReview,
    };
  });

  // Sort by priority (due cards first, then by progress)
  const sortedDecks = decksWithProgress.sort((a, b) => {
    if (a.dueCount > 0 && b.dueCount === 0) return -1;
    if (a.dueCount === 0 && b.dueCount > 0) return 1;
    return b.progress - a.progress;
  });

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Flashcard Decks
            </h1>
            <p className="text-[var(--muted)]">
              {deckList.length} deck{deckList.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {onCreateDeck && (
            <Button onClick={onCreateDeck} leftIcon={<Plus className="w-4 h-4" />}>
              Create Deck
            </Button>
          )}
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search decks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="md" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Deck list */}
      <div className="space-y-4">
        {sortedDecks.length > 0 ? (
          sortedDecks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DeckCard
                deck={deck}
                onStartReview={() => onStartReview(deck.id)}
                onPreview={() => onPreviewDeck(deck.id)}
              />
            </motion.div>
          ))
        ) : (
          <EmptyState onCreateDeck={onCreateDeck} />
        )}
      </div>
    </div>
  );
}

interface DeckCardProps {
  deck: FlashcardDeck & {
    dueCount: number;
    progress: number;
    nextReview: Date | null;
  };
  onStartReview: () => void;
  onPreview: () => void;
}

function DeckCard({ deck, onStartReview, onPreview }: DeckCardProps) {
  const difficultyColors = {
    easy: 'bg-[var(--success)]',
    medium: 'bg-[var(--warning)]',
    hard: 'bg-[var(--error)]',
  };

  return (
    <Card hover={true}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Deck info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {deck.name}
            </h3>
            <Badge
              variant="secondary"
              size="sm"
              className={cn(
                'text-white',
                difficultyColors[deck.difficulty]
              )}
            >
              {deck.difficulty}
            </Badge>
            {deck.dueCount > 0 && (
              <Badge variant="primary" size="sm">
                {deck.dueCount} due
              </Badge>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] mb-3">
            {deck.description}
          </p>

          {/* Deck stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{deck.cardIds.length} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{deck.progress}% mastery</span>
            </div>
            {deck.nextReview && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Next: {formatDate(deck.nextReview)}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-2 bg-[var(--card-hover)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${deck.progress}%` }}
              transition={{ duration: 0.5 }}
              className={cn(
                'h-full',
                deck.progress >= 80
                  ? 'bg-[var(--success)]'
                  : deck.progress >= 50
                  ? 'bg-[var(--warning)]'
                  : 'bg-[var(--primary)]'
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Preview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onStartReview}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Start
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ onCreateDeck }: { onCreateDeck?: () => void }) {
  return (
    <Card hover={false} className="text-center py-12">
      <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--muted)] opacity-50" />
      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
        No Flashcard Decks Yet
      </h3>
      <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
        Create your first flashcard deck to start learning with spaced repetition.
      </p>
      {onCreateDeck && (
        <Button onClick={onCreateDeck} leftIcon={<Plus className="w-4 h-4" />}>
          Create Your First Deck
        </Button>
      )}
    </Card>
  );
}

// Helper functions
function getDeckDueCount(deckId: string): number {
  const { cardProgress, decks } = useFlashcardStore.getState();
  const deck = decks[deckId];
  if (!deck) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deck.cardIds.filter((cardId) => {
    const progress = cardProgress[cardId];
    if (!progress) return false;
    const dueDate = new Date(progress.nextReviewDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  }).length;
}

function getDeckProgress(deckId: string): number {
  const { cardProgress, decks } = useFlashcardStore.getState();
  const deck = decks[deckId];
  if (!deck || deck.cardIds.length === 0) return 0;

  let totalRetention = 0;
  let cardCount = 0;

  deck.cardIds.forEach((cardId) => {
    const progress = cardProgress[cardId];
    if (progress) {
      totalRetention += progress.retentionScore;
      cardCount++;
    }
  });

  return cardCount > 0 ? Math.round(totalRetention / cardCount) : 0;
}

function getNextReviewDate(deckId: string): Date | null {
  const { cardProgress, decks } = useFlashcardStore.getState();
  const deck = decks[deckId];
  if (!deck || deck.cardIds.length === 0) return null;

  let nextReview: Date | null = null;

  deck.cardIds.forEach((cardId) => {
    const progress = cardProgress[cardId];
    if (progress) {
      const reviewDate = new Date(progress.nextReviewDate);
      if (!nextReview || reviewDate < nextReview) {
        nextReview = reviewDate;
      }
    }
  });

  return nextReview;
}

function formatDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (dateObj.getTime() === today.getTime()) {
    return 'Today';
  } else if (dateObj.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
