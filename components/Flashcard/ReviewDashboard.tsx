'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  TrendingUp,
  Flame,
  Play,
  BookOpen,
  Calendar,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFlashcardStore } from '@/store/flashcardStore';
import { ReviewSessionStats } from './ReviewSessionStats';
import { cn } from '@/lib/utils';

interface ReviewDashboardProps {
  onStartReview: (deckId: string) => void;
  onBrowseDecks: () => void;
  onViewSchedule: () => void;
  className?: string;
}

export function ReviewDashboard({
  onStartReview,
  onBrowseDecks,
  onViewSchedule,
  className,
}: ReviewDashboardProps) {
  const {
    getDueCards,
    getPerformanceStats,
    getReviewStats,
    getDailyXP,
    decks,
  } = useFlashcardStore();

  const dueCards = getDueCards();
  const performanceStats = getPerformanceStats();
  const reviewStats = getReviewStats();
  const dailyXP = getDailyXP();

  const optimalDailyLoad = Math.min(dueCards.length, 20);

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Review Dashboard
        </h1>
        <p className="text-[var(--muted)]">
          Time to reinforce your learning with spaced repetition
        </p>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <ReviewSessionStats
          cardsReviewed={reviewStats.totalReviews}
          cardsDueToday={performanceStats.dueToday}
          cardsDueTomorrow={performanceStats.dueThisWeek - performanceStats.dueToday}
          averageQuality={reviewStats.averageQuality}
          streak={reviewStats.currentStreak}
        />
      </motion.div>

      {/* Main CTA - Start Review */}
      {dueCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card
            className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 border-[var(--primary)]/30"
            hover={false}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {dueCards.length} Cards Due Today
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  Review now to strengthen your memory. Recommended: {optimalDailyLoad} cards
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  const deckIds = Object.keys(useFlashcardStore.getState().decks);
                  if (deckIds.length > 0) {
                    onStartReview(deckIds[0]);
                  }
                }}
                rightIcon={<Play className="w-4 h-4" />}
              >
                Start Review
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          label="Current Streak"
          value={`${reviewStats.currentStreak} days`}
          color="text-[var(--accent)]"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Today's XP"
          value={`+${dailyXP}`}
          color="text-[var(--warning)]"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Average Retention"
          value={`${performanceStats.averageRetention}%`}
          color="text-[var(--success)]"
        />
      </motion.div>

      {/* Recent Decks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Your Decks
            </h3>
            <Button variant="ghost" size="sm" onClick={onBrowseDecks}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {Object.values(decks).slice(0, 3).length > 0 ? (
            <div className="space-y-3">
              {Object.values(decks).slice(0, 3).map((deck) => {
                const deckDueCount = performanceStats.dueToday > 0
                  ? Math.ceil(performanceStats.dueToday / Object.keys(decks).length)
                  : 0;

                return (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--card-hover)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
                    onClick={() => onStartReview(deck.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-[var(--foreground)]">
                          {deck.name}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          {deck.cardIds.length} cards
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--muted)]">
                        {deck.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {deckDueCount > 0 && (
                        <Badge variant="primary" size="sm">
                          {deckDueCount} due
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--muted)]">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">No flashcard decks yet</p>
              <Button variant="outline" onClick={onBrowseDecks}>
                Create or Browse Decks
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Browse Decks"
            description="View all your flashcard decks"
            onClick={onBrowseDecks}
          />
          <ActionCard
            icon={<Calendar className="w-5 h-5" />}
            title="View Schedule"
            description="See your upcoming reviews"
            onClick={onViewSchedule}
          />
        </div>
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
  value: string | number;
  color?: string;
}) {
  return (
    <Card hover={false}>
      <div className={cn('flex items-center gap-3 mb-2', color)}>
        {icon}
      </div>
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-sm text-[var(--muted)] mt-1">{label}</div>
    </Card>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:border-[var(--primary)]/50"
    >
      <div className="flex items-center gap-3 mb-2 text-[var(--primary)]">
        {icon}
      </div>
      <h4 className="font-semibold text-[var(--foreground)] mb-1">
        {title}
      </h4>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </Card>
  );
}
