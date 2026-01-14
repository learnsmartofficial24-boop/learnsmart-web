'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Home,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { SessionStats } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SessionSummaryProps {
  stats: SessionStats;
  deckName: string;
  averagePerformance?: {
    averageQuality: number;
    cardsPerMinute: number;
  };
  onContinue: () => void;
  onExit: () => void;
  onRetry?: () => void;
  className?: string;
}

export function SessionSummary({
  stats,
  deckName,
  averagePerformance,
  onContinue,
  onExit,
  onRetry,
  className,
}: SessionSummaryProps) {
  const performanceColor =
    stats.averageQuality >= 4
      ? 'text-[var(--success)]'
      : stats.averageQuality >= 3
      ? 'text-[var(--warning)]'
      : 'text-[var(--error)]';

  const motivationalMessage = getMotivationalMessage(stats);

  const qualityComparison = averagePerformance
    ? stats.averageQuality - averagePerformance.averageQuality
    : 0;

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--success)]/10 mb-4">
          <Award className="w-10 h-10 text-[var(--success)]" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Session Complete!
        </h1>
        <p className="text-lg text-[var(--muted)]">{deckName}</p>
      </motion.div>

      {/* Main stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<CheckCircle className="w-5 h-5" />}
              label="Cards Reviewed"
              value={stats.totalCardsReviewed}
              color="text-[var(--primary)]"
            />
            <StatCard
              icon={<Star className="w-5 h-5" />}
              label="Avg Quality"
              value={stats.averageQuality.toFixed(1)}
              color={performanceColor}
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Mastered"
              value={stats.cardsMastered}
              color="text-[var(--success)]"
            />
            <StatCard
              icon={<Award className="w-5 h-5" />}
              label="XP Earned"
              value={`+${stats.xpEarned}`}
              color="text-[var(--warning)]"
            />
          </div>
        </Card>
      </motion.div>

      {/* Detailed stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Performance Details
          </h3>
          <div className="space-y-4">
            <StatRow
              icon={<Clock className="w-4 h-4" />}
              label="Session Duration"
              value={formatDuration(stats.sessionDuration)}
            />
            <StatRow
              icon={<TrendingUp className="w-4 h-4" />}
              label="Review Speed"
              value={`${stats.cardsPerMinute} cards/min`}
            />
            <StatRow
              icon={<XCircle className="w-4 h-4" />}
              label="Need Review"
              value={stats.cardsNeedReview}
              color="text-[var(--error)]"
            />
            <StatRow
              icon={<Award className="w-4 h-4" />}
              label="New Cards Learned"
              value={stats.newCardsLearned}
              color="text-[var(--success)]"
            />
            <StatRow
              icon={<Star className="w-4 h-4" />}
              label="Cards Due Today"
              value={stats.cardsDueToday}
            />
            <StatRow
              icon={<Calendar className="w-4 h-4" />}
              label="Cards Due Tomorrow"
              value={stats.cardsDueTomorrow}
            />
          </div>

          {/* Performance comparison */}
          {averagePerformance && (
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <PerformanceComparison qualityDiff={qualityComparison} />
            </div>
          )}
        </Card>
      </motion.div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="mb-6 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 border-[var(--primary)]/20">
          <div className="text-center">
            <Star className="w-8 h-8 text-[var(--warning)] mx-auto mb-3" />
            <p className="text-lg text-[var(--foreground)] font-medium">
              {motivationalMessage}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {onRetry && (
          <Button
            variant="secondary"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="flex-1"
          >
            Retry Failed Cards
          </Button>
        )}
        <Button
          variant="primary"
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="flex-1"
        >
          Continue Reviewing
        </Button>
        <Button
          variant="outline"
          onClick={onExit}
          leftIcon={<Home className="w-4 h-4" />}
          className="flex-1"
        >
          Back to Dashboard
        </Button>
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
    <div className="text-center">
      <div className={cn('flex items-center justify-center gap-1 mb-1', color)}>
        {icon}
      </div>
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{label}</div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-[var(--muted)]">{icon}</div>
        <span className="text-sm text-[var(--foreground)]">{label}</span>
      </div>
      <span className={cn('text-sm font-semibold text-[var(--foreground)]', color)}>
        {value}
      </span>
    </div>
  );
}

function PerformanceComparison({ qualityDiff }: { qualityDiff: number }) {
  if (Math.abs(qualityDiff) < 0.3) {
    return (
      <div className="text-center text-sm text-[var(--muted)]">
        Your performance is consistent with your average.
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className={cn(
        'text-sm font-medium',
        qualityDiff > 0 ? 'text-[var(--success)]' : 'text-[var(--warning)]'
      )}>
        {qualityDiff > 0 ? (
          <>🎉 Today's accuracy is {Math.abs(qualityDiff).toFixed(1)} points higher than your average!</>
        ) : (
          <>📈 Today's accuracy is {Math.abs(qualityDiff).toFixed(1)} points lower than usual. Keep practicing!</>
        )}
      </p>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getMotivationalMessage(stats: SessionStats): string {
  const { averageQuality, cardsMastered, totalCardsReviewed } = stats;

  if (cardsMastered === totalCardsReviewed && totalCardsReviewed > 0) {
    return 'Perfect! You mastered every card this session. Outstanding work!';
  }

  if (averageQuality >= 4.5) {
    return 'Excellent session! Your performance is exceptional. You\'re truly mastering this material!';
  }

  if (averageQuality >= 4) {
    return 'Great job! You\'re performing at a high level. Keep up the fantastic work!';
  }

  if (averageQuality >= 3.5) {
    return 'Good session! You\'re making solid progress. With consistent practice, you\'ll master these cards!';
  }

  if (averageQuality >= 3) {
    return 'Nice effort! Some cards need more practice, but you\'re on the right track. Keep going!';
  }

  return 'Don\'t be discouraged! Spaced repetition is about practice over time. Each review makes you stronger!';
}
