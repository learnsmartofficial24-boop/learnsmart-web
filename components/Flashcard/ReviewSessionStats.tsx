'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  CheckCircle,
  XCircle,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSessionStatsProps {
  cardsReviewed: number;
  cardsDueToday: number;
  cardsDueTomorrow: number;
  averageQuality: number;
  sessionDuration?: number;
  streak?: number;
  className?: string;
}

export function ReviewSessionStats({
  cardsReviewed,
  cardsDueToday,
  cardsDueTomorrow,
  averageQuality,
  sessionDuration,
  streak = 0,
  className,
}: ReviewSessionStatsProps) {
  const masteredCount = Math.round(cardsReviewed * (averageQuality / 5));
  const needReviewCount = cardsReviewed - masteredCount;

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <StatCard
        icon={<Target className="w-4 h-4" />}
        label="Cards Reviewed"
        value={cardsReviewed}
        color="text-[var(--primary)]"
      />
      <StatCard
        icon={<CheckCircle className="w-4 h-4" />}
        label="Due Today"
        value={cardsDueToday}
        color="text-[var(--warning)]"
      />
      <StatCard
        icon={<TrendingUp className="w-4 h-4" />}
        label="Avg Quality"
        value={averageQuality.toFixed(1)}
        color={getQualityColor(averageQuality)}
      />
      <StatCard
        icon={<Flame className="w-4 h-4" />}
        label="Streak"
        value={streak}
        color="text-[var(--accent)]"
      />

      {sessionDuration !== undefined && (
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Duration"
          value={formatDuration(sessionDuration)}
          color="text-[var(--muted)]"
        />
      )}

      <StatCard
        icon={<CheckCircle className="w-4 h-4" />}
        label="Mastered"
        value={masteredCount}
        color="text-[var(--success)]"
      />

      <StatCard
        icon={<XCircle className="w-4 h-4" />}
        label="Need Review"
        value={needReviewCount}
        color="text-[var(--error)]"
      />

      <StatCard
        icon={<TrendingUp className="w-4 h-4" />}
        label="Due Tomorrow"
        value={cardsDueTomorrow}
        color="text-[var(--muted)]"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

function StatCard({ icon, label, value, color = 'text-[var(--foreground)]' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-[var(--shadow-sm)]"
    >
      <div className={cn('flex items-center gap-2 mb-1', color)}>
        {icon}
      </div>
      <div className={cn('text-xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
    </motion.div>
  );
}

function getQualityColor(quality: number): string {
  if (quality >= 4.5) return 'text-[var(--primary)]';
  if (quality >= 4) return 'text-[var(--success)]';
  if (quality >= 3) return 'text-[var(--warning)]';
  return 'text-[var(--error)]';
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}
