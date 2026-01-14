'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Eye,
  Edit,
  Trash2,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFlashcardStore } from '@/store/flashcardStore';
import { cn } from '@/lib/utils';
import type { FlashcardDeck } from '@/lib/types';

interface DeckPreviewProps {
  deckId: string;
  onStartReview: () => void;
  onEditDeck: () => void;
  onBack: () => void;
  className?: string;
}

export function DeckPreview({
  deckId,
  onStartReview,
  onEditDeck,
  onBack,
  className,
}: DeckPreviewProps) {
  const { getDeck, getFlashcardsByDeck, getDueCards } = useFlashcardStore();
  const deck = getDeck(deckId);
  const cards = getFlashcardsByDeck(deckId);
  const allDueCards = getDueCards();

  const [stats, setStats] = useState({
    mastered: 0,
    needReview: 0,
    notStarted: 0,
    totalRetention: 0,
    dueCount: 0,
    estimatedTime: 0,
  });

  useEffect(() => {
    if (!deck) return;

    const deckCardIds = new Set(deck.cardIds);
    const deckDueCards = allDueCards.filter((c) => deckCardIds.has(c.cardId));

    let mastered = 0;
    let needReview = 0;
    let notStarted = 0;
    let totalRetention = 0;

    deck.cardIds.forEach((cardId) => {
      const progress = useFlashcardStore.getState().getCardProgress(cardId);
      if (progress) {
        if (progress.smData.repetitions >= 5 && progress.retentionScore > 80) {
          mastered++;
        } else if (progress.retentionScore < 50) {
          needReview++;
        } else {
          notStarted++;
        }
        totalRetention += progress.retentionScore;
      }
    });

    const estimatedTime = deckDueCards.length * 30; // 30 seconds per card

    setStats({
      mastered,
      needReview,
      notStarted,
      totalRetention: cards.length > 0 ? Math.round(totalRetention / cards.length) : 0,
      dueCount: deckDueCards.length,
      estimatedTime,
    });
  }, [deck, deckId, cards, allDueCards]);

  if (!deck) {
    return (
      <div className={cn('w-full text-center py-12', className)}>
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--muted)] opacity-50" />
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Deck Not Found
        </h3>
        <Button variant="outline" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Decks
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                {deck.name}
              </h1>
              <Badge
                variant="secondary"
                className={
                  deck.difficulty === 'easy'
                    ? 'bg-[var(--success)] text-white'
                    : deck.difficulty === 'medium'
                    ? 'bg-[var(--warning)] text-white'
                    : 'bg-[var(--error)] text-white'
                }
              >
                {deck.difficulty}
              </Badge>
            </div>
            <p className="text-[var(--muted)] mb-4">{deck.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {cards.length} cards
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {stats.totalRetention}% average retention
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(stats.estimatedTime)} estimated
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditDeck}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={onStartReview}
              leftIcon={<Play className="w-4 h-4" />}
              disabled={cards.length === 0}
            >
              {stats.dueCount > 0 ? `Review (${stats.dueCount})` : 'Start Review'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Total Cards"
          value={cards.length}
          color="text-[var(--primary)]"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Mastered"
          value={stats.mastered}
          color="text-[var(--success)]"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5" />}
          label="Need Review"
          value={stats.needReview}
          color="text-[var(--error)]"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Due Today"
          value={stats.dueCount}
          color="text-[var(--warning)]"
        />
      </motion.div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Mastery Progress
          </h3>
          <div className="space-y-3">
            <ProgressBar label="Mastered" count={stats.mastered} total={cards.length} color="bg-[var(--success)]" />
            <ProgressBar label="In Progress" count={stats.notStarted} total={cards.length} color="bg-[var(--primary)]" />
            <ProgressBar label="Need Review" count={stats.needReview} total={cards.length} color="bg-[var(--error)]" />
          </div>
        </Card>
      </motion.div>

      {/* Card preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Sample Cards
            </h3>
            <Button variant="ghost" size="sm" onClick={onEditDeck}>
              View All
              <Eye className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.slice(0, 4).map((card, index) => (
                <div
                  key={card.id}
                  className="p-4 rounded-lg bg-[var(--card-hover)] border border-[var(--border)]"
                >
                  <div className="text-sm font-medium text-[var(--primary)] mb-2">
                    Q: {card.front}
                  </div>
                  <div className="text-sm text-[var(--muted)]">
                    A: {card.back}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--muted)]">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cards in this deck yet</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = 'text-[var(--foreground)]',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Card hover={false}>
      <div className={cn('flex items-center gap-2 mb-2', color)}>
        {icon}
      </div>
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{label}</div>
    </Card>
  );
}

function ProgressBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-[var(--foreground)]">{label}</span>
        <span className="text-sm text-[var(--muted)]">
          {count} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-[var(--card-hover)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.round(seconds / 60);

  if (minutes < 1) return '< 1 min';
  if (minutes === 1) return '1 min';
  if (minutes < 60) return `${minutes} mins`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}
