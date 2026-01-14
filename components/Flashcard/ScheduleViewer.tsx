'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFlashcardStore } from '@/store/flashcardStore';
import { cn } from '@/lib/utils';

interface ScheduleViewerProps {
  className?: string;
}

export function ScheduleViewer({ className }: ScheduleViewerProps) {
  const { getReviewSchedule, getPerformanceStats } = useFlashcardStore();
  const performanceStats = getPerformanceStats();

  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const schedule = getReviewSchedule(90);
  const dates = getDatesForView(currentWeek, viewMode, schedule);
  const maxCards = Math.max(...Object.values(schedule).flat().map(d => getCardCountForDate(d.date, schedule)), 0);

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Review Schedule
            </h1>
            <p className="text-[var(--muted)]">
              See when your cards are due for optimal review
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('week');
                setCurrentWeek(0);
              }}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('month');
                setCurrentWeek(0);
              }}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <span className="text-sm text-[var(--muted)]">
            {getDateRangeLabel(currentWeek, viewMode)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      </motion.div>

      {/* Overview stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Due Today"
          value={performanceStats.dueToday}
          color="text-[var(--primary)]"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Due This Week"
          value={performanceStats.dueThisWeek}
          color="text-[var(--warning)]"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Retention"
          value={`${performanceStats.averageRetention}%`}
          color="text-[var(--success)]"
        />
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          label="Mastered Cards"
          value={performanceStats.masteredCards}
          color="text-[var(--accent)]"
        />
      </motion.div>

      {/* Calendar grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-[var(--muted)] py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {dates.map((date, index) => {
              const cardCount = getCardCountForDate(date, schedule);
              const isToday = isSameDay(new Date(date), new Date());
              const isPast = new Date(date) < new Date().setHours(0, 0, 0, 0);

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    'relative aspect-square rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all',
                    'border border-[var(--border)]',
                    isToday ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-[var(--card)]',
                    isPast ? 'opacity-50' : 'hover:border-[var(--border-hover)]'
                  )}
                >
                  <span className={cn(
                    'text-sm font-medium',
                    isToday ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'
                  )}>
                    {new Date(date).getDate()}
                  </span>

                  {cardCount > 0 && (
                    <>
                      <div className="mt-1 w-2 h-2 rounded-full bg-[var(--primary)]" />
                      <span className="text-xs text-[var(--primary)] mt-1">
                        {cardCount}
                      </span>
                    </>
                  )}

                  {/* Heatmap overlay */}
                  {cardCount > 0 && maxCards > 0 && (
                    <div
                      className={cn(
                        'absolute inset-0 rounded-lg opacity-10',
                        getHeatmapColor(cardCount, maxCards)
                      )}
                      style={{
                        opacity: (cardCount / maxCards) * 0.3 + 0.1,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Heatmap legend */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
            <span>Light</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'w-4 h-4 rounded',
                    getHeatmapColor(level, 5)
                  )}
                  style={{ opacity: 0.3 + (level / 5) * 0.5 }}
                />
              ))}
            </div>
            <span>Heavy</span>
          </div>
        </Card>
      </motion.div>

      {/* Upcoming reviews list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Upcoming Reviews
          </h3>
          <div className="space-y-3">
            {getUpcomingReviews(schedule, 7).map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--card-hover)]"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  <div>
                    <div className="font-medium text-[var(--foreground)]">
                      {formatDate(item.date)}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {getDayLabel(item.date)}
                    </div>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  {item.count} cards
                </Badge>
              </div>
            ))}
          </div>
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
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{label}</div>
    </Card>
  );
}

function getDatesForView(
  weekOffset: number,
  viewMode: 'week' | 'month',
  schedule: Record<string, any[]>
): string[] {
  const today = new Date();
  const startDate = new Date(today);

  if (viewMode === 'week') {
    startDate.setDate(startDate.getDate() + (weekOffset * 7));
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  } else {
    startDate.setDate(startDate.getDate() + (weekOffset * 28));
    startDate.setDate(1); // Start from first day of month
  }

  const dates: string[] = [];
  const days = viewMode === 'week' ? 7 : 35; // 7 days for week view, 35 days for month view (5 weeks)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

function getCardCountForDate(
  date: string,
  schedule: Record<string, any[]>
): number {
  return (schedule[date] || []).length;
}

function getDateRangeLabel(weekOffset: number, viewMode: 'week' | 'month'): string {
  const today = new Date();
  const startDate = new Date(today);

  if (viewMode === 'week') {
    startDate.setDate(startDate.getDate() + (weekOffset * 7));
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
  } else {
    startDate.setDate(startDate.getDate() + (weekOffset * 28));
    startDate.setDate(1);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
}

function getHeatmapColor(count: number, max: number): string {
  const intensity = count / max;
  if (intensity < 0.2) return 'bg-[var(--primary)]';
  if (intensity < 0.4) return 'bg-[var(--accent)]';
  if (intensity < 0.6) return 'bg-[var(--warning)]';
  if (intensity < 0.8) return 'bg-[var(--error)]';
  return 'bg-[var(--error)]';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function getUpcomingReviews(
  schedule: Record<string, any[]>,
  days: number
): { date: string; count: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: { date: string; count: number }[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    const count = getCardCountForDate(dateKey, schedule);

    if (count > 0) {
      upcoming.push({ date: dateKey, count });
    }
  }

  return upcoming.slice(0, 7); // Return at most 7 entries
}
