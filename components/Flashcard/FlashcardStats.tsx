'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  RotateCcw,
  CheckCircle,
  XCircle,
  BarChart3,
  Trash2,
  Edit,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFlashcardStore } from '@/store/flashcardStore';
import { estimateRetention } from '@/lib/spacedRepetition';
import { cn } from '@/lib/utils';

interface FlashcardStatsProps {
  cardId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function FlashcardStats({ cardId, onEdit, onDelete, className }: FlashcardStatsProps) {
  const { getFlashcard, getCardProgress, reviewHistory } = useFlashcardStore();
  const card = getFlashcard(cardId);
  const progress = getCardProgress(cardId);
  const cardHistory = reviewHistory.filter((r) => r.cardId === cardId);

  const [showHistory, setShowHistory] = useState(false);

  if (!card || !progress) {
    return (
      <div className={cn('w-full text-center py-8 text-[var(--muted)]', className)}>
        Card not found
      </div>
    );
  }

  const retention = estimateRetention(progress.lastReviewed, progress.smData.interval);
  const successRate = progress.totalReviews > 0
    ? Math.round((progress.successfulReviews / progress.totalReviews) * 100)
    : 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Card Statistics
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Track your mastery of this flashcard
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} leftIcon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Card preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">
                Question
              </div>
              <p className="text-[var(--foreground)]">{card.front}</p>
            </div>
            <div className="border-t border-[var(--border)] pt-4">
              <div className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">
                Answer
              </div>
              <p className="text-[var(--foreground)]">{card.back}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Easiness Factor"
          value={progress.smData.easeFactor.toFixed(2)}
          color={getEaseFactorColor(progress.smData.easeFactor)}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Interval"
          value={formatInterval(progress.smData.interval)}
          color="text-[var(--primary)]"
        />
        <StatCard
          icon={<RotateCcw className="w-5 h-5" />}
          label="Repetitions"
          value={progress.smData.repetitions}
          color="text-[var(--accent)]"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Retention"
          value={`${Math.round(retention)}%`}
          color={getRetentionColor(retention)}
        />
      </motion.div>

      {/* Detailed stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Performance Details
          </h3>
          <div className="space-y-3">
            <StatRow
              icon={<CheckCircle className="w-4 h-4" />}
              label="Successful Reviews"
              value={progress.successfulReviews}
              color="text-[var(--success)]"
            />
            <StatRow
              icon={<XCircle className="w-4 h-4" />}
              label="Failed Reviews"
              value={progress.failedReviews}
              color="text-[var(--error)]"
            />
            <StatRow
              icon={<BarChart3 className="w-4 h-4" />}
              label="Success Rate"
              value={`${successRate}%`}
              color={successRate >= 70 ? 'text-[var(--success)]' : successRate >= 50 ? 'text-[var(--warning)]' : 'text-[var(--error)]'}
            />
            <StatRow
              icon={<TrendingUp className="w-4 h-4" />}
              label="Average Quality"
              value={progress.averageQuality.toFixed(2)}
              color={getQualityColor(progress.averageQuality)}
            />
            <StatRow
              icon={<Clock className="w-4 h-4" />}
              label="Next Review"
              value={formatDate(progress.nextReviewDate)}
              color="text-[var(--muted)]"
            />
            <StatRow
              icon={<History className="w-4 h-4" />}
              label="Last Reviewed"
              value={formatDate(progress.lastReviewed)}
              color="text-[var(--muted)]"
            />
          </div>
        </Card>
      </motion.div>

      {/* Review history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Review History
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'}
              <History className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {showHistory && cardHistory.length > 0 ? (
            <div className="space-y-2">
              {cardHistory.slice().reverse().map((review, index) => (
                <div
                  key={`${review.reviewDate.getTime()}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--card-hover)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={review.quality >= 4 ? 'primary' : review.quality >= 3 ? 'secondary' : 'danger'}
                      size="sm"
                      className={getQualityBadgeColor(review.quality)}
                    >
                      {review.quality}/5
                    </Badge>
                    <div>
                      <div className="text-sm text-[var(--foreground)]">
                        {getQualityLabel(review.quality)}
                      </div>
                      <div className="text-xs text-[var(--muted)]">
                        {formatDate(review.reviewDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[var(--foreground)]">
                      EF: {review.easeFactor.toFixed(2)}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      Interval: {formatInterval(review.interval)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !showHistory ? (
            <div className="text-center py-4 text-sm text-[var(--muted)]">
              Click "Show" to view review history
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-[var(--muted)]">
              No review history yet
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
  value: string | number;
  color?: string;
}) {
  return (
    <Card hover={false}>
      <div className={cn('flex items-center gap-2 mb-2', color)}>
        {icon}
      </div>
      <div className={cn('text-xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{label}</div>
    </Card>
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
      <span className={cn('text-sm font-semibold', color)}>
        {value}
      </span>
    </div>
  );
}

function getEaseFactorColor(ease: number): string {
  if (ease >= 2.3) return 'text-[var(--success)]';
  if (ease >= 1.8) return 'text-[var(--warning)]';
  return 'text-[var(--error)]';
}

function getRetentionColor(retention: number): string {
  if (retention >= 80) return 'text-[var(--success)]';
  if (retention >= 50) return 'text-[var(--warning)]';
  return 'text-[var(--error)]';
}

function getQualityColor(quality: number): string {
  if (quality >= 4.5) return 'text-[var(--primary)]';
  if (quality >= 4) return 'text-[var(--success)]';
  if (quality >= 3) return 'text-[var(--warning)]';
  return 'text-[var(--error)]';
}

function getQualityBadgeColor(quality: number): string {
  if (quality >= 4) return 'bg-[var(--success)] text-white';
  if (quality === 3) return 'bg-[var(--warning)] text-white';
  return 'bg-[var(--error)] text-white';
}

function getQualityLabel(quality: number): string {
  const labels = {
    1: 'Complete blackout',
    2: 'Incorrect',
    3: 'Hard',
    4: 'Good',
    5: 'Perfect',
  };
  return labels[quality as keyof typeof labels] || '';
}

function formatInterval(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  return `${months} month${months > 1 ? 's' : ''}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}
