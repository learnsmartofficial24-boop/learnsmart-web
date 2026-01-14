'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Trophy, Target, Timer, Zap, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LearningMetrics } from '@/lib/types';

interface StatsCardsProps {
  metrics: LearningMetrics;
  className?: string;
}

type TrendDirection = 'up' | 'down' | 'stable';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: TrendDirection;
  trendValue: string;
  color: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'primary':
      return 'bg-[var(--primary)] text-white';
    case 'success':
      return 'bg-[var(--success)] text-white';
    case 'warning':
      return 'bg-[var(--warning)] text-white';
    case 'danger':
      return 'bg-[var(--danger)] text-white';
    default:
      return 'bg-[var(--background)] text-[var(--foreground)]';
  }
};

const getTrendIcon = (trend: TrendDirection) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4" />;
    case 'down':
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Minus className="w-4 h-4" />;
  }
};

const getTrendColor = (trend: TrendDirection) => {
  switch (trend) {
    case 'up':
      return 'text-[var(--success)]';
    case 'down':
      return 'text-[var(--danger)]';
    default:
      return 'text-[var(--muted-foreground)]';
  }
};

export function StatsCards({ metrics, className = '' }: StatsCardsProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  const stats: StatCard[] = [
    {
      label: 'Total XP',
      value: metrics.totalXP.toLocaleString(),
      icon: <Trophy className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+250',
      color: 'primary'
    },
    {
      label: 'Current Level',
      value: metrics.currentLevel,
      icon: <Award className="w-6 h-6" />,
      trend: 'stable',
      trendValue: '-',
      color: 'default'
    },
    {
      label: 'Concepts Learned',
      value: metrics.conceptsLearned,
      icon: <BookOpen className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+3',
      color: 'success'
    },
    {
      label: 'Quiz Accuracy',
      value: formatPercentage(metrics.quizAccuracy),
      icon: <Target className="w-6 h-6" />,
      trend: metrics.quizAccuracy > 70 ? 'up' : metrics.quizAccuracy < 50 ? 'down' : 'stable',
      trendValue: `${Math.abs(metrics.quizAccuracy - 60).toFixed(0)}%`,
      color: 'primary'
    },
    {
      label: 'Current Streak',
      value: `${metrics.currentStreak} days`,
      icon: <Zap className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+1',
      color: 'warning'
    },
    {
      label: 'Study Time',
      value: formatTime(metrics.totalStudyTime),
      icon: <Timer className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+2h',
      color: 'default'
    }
  ];

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="transform transition-transform hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                  {stat.value}
                </p>
                <div className={`flex items-center mt-2 text-xs ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)}
                  <span className="ml-1">{stat.trendValue}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}