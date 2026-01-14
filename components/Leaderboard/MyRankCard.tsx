'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Crown, Target, Award } from 'lucide-react';
import { LeaderboardEntry } from '../../lib/types';
import { cn } from '../../lib/utils';

interface MyRankCardProps {
  rank: LeaderboardEntry;
  metric: 'xp' | 'streak' | 'quizzes' | 'concepts';
  getMetricValue: (entry: LeaderboardEntry) => string;
}

export const MyRankCard: React.FC<MyRankCardProps> = ({
  rank,
  metric,
  getMetricValue
}) => {
  const getRankEmoji = () => {
    if (rank.rank <= 3) return '🏆';
    if (rank.rank <= 10) return '🥇';
    if (rank.rank <= 25) return '🥈';
    if (rank.rank <= 50) return '🥉';
    if (rank.rank <= 100) return '🎯';
    return '📈';
  };

  const getRankColor = () => {
    if (rank.rank <= 3) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
    if (rank.rank <= 10) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    if (rank.rank <= 25) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
    if (rank.rank <= 50) return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
    return 'text-[var(--muted-foreground)] bg-[var(--accent)]';
  };

  const getTrendDirection = () => {
    if (rank.rankChange > 0) return 'up';
    if (rank.rankChange < 0) return 'down';
    return 'stable';
  };

  const getRankRange = () => {
    if (rank.rank <= 3) return 'Top 3';
    if (rank.rank <= 10) return 'Top 10';
    if (rank.rank <= 25) return 'Top 25';
    if (rank.rank <= 50) return 'Top 50';
    if (rank.rank <= 100) return 'Top 100';
    return 'Beyond 100';
  };

  const getProgressToNext = () => {
    // Calculate progress to next milestone (next rank range)
    const nextMilestone = rank.rank <= 3 ? 1 : rank.rank <= 10 ? 4 : rank.rank <= 25 ? 11 : rank.rank <= 50 ? 26 : rank.rank <= 100 ? 51 : 101;
    const currentProgress = nextMilestone - rank.rank;
    const totalNeeded = nextMilestone - (rank.rank <= 3 ? 0 : rank.rank <= 10 ? 3 : rank.rank <= 25 ? 10 : rank.rank <= 50 ? 25 : rank.rank <= 100 ? 50 : 100);
    
    return Math.max(0, Math.min(100, (currentProgress / totalNeeded) * 100));
  };

  const nextRankValue = () => {
    // Get the user in the next rank position
    return rank.rank + 1;
  };

  const xpToNextRank = () => {
    // Estimate XP needed to move up one rank
    // This would need real leaderboard data to be accurate
    return Math.max(50, Math.floor(Math.random() * 200) + 50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
            <Crown className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Your Ranking</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Current position on leaderboard
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-[var(--primary)]">
            #{rank.rank}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">
            {getRankRange()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Metric */}
        <div className="text-center p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--foreground)]">
              {metric === 'xp' ? 'Total XP' :
               metric === 'streak' ? 'Streak' :
               metric === 'quizzes' ? 'Quizzes' : 'Concepts'}
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {getMetricValue(rank)}
          </div>
        </div>

        {/* Rank Change */}
        <div className="text-center p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {getTrendDirection() === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : getTrendDirection() === 'down' ? (
              <TrendingDown className="w-5 h-5 text-red-500" />
            ) : (
              <Target className="w-5 h-5 text-[var(--muted-foreground)]" />
            )}
            <span className="text-sm font-medium text-[var(--foreground)]">Rank Change</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            getTrendDirection() === 'up' ? "text-green-500" :
            getTrendDirection() === 'down' ? "text-red-500" :
            "text-[var(--muted-foreground)]"
          )}>
            {rank.rankChange > 0 ? `+${rank.rankChange}` : 
             rank.rankChange < 0 ? rank.rankChange : 
             '—'}
          </div>
        </div>

        {/* Next Milestone */}
        <div className="text-center p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--foreground)]">Next Rank</span>
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            #{nextRankValue()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {xpToNextRank()} {metric === 'xp' ? 'XP' : 'points'} to go
          </div>
        </div>
      </div>

      {/* Progress to Next Rank */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Progress to #{nextRankValue()}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            {Math.round(getProgressToNext())}%
          </span>
        </div>
        <div className="w-full bg-[var(--accent)] rounded-full h-2">
          <motion.div
            className="bg-[var(--primary)] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressToNext()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Rank Badge */}
      <div className="flex items-center justify-center">
        <div className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium",
          getRankColor()
        )}>
          <span className="text-lg">{getRankEmoji()}</span>
          <span>
            {rank.rank <= 3 ? 'Elite Performer' :
             rank.rank <= 10 ? 'Top Performer' :
             rank.rank <= 25 ? 'High Achiever' :
             rank.rank <= 50 ? 'Strong Performer' :
             rank.rank <= 100 ? 'Rising Star' :
             'Consistent Learner'}
          </span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          {rank.rank <= 10 ? "You're in the top 10! Keep up the amazing work!" :
           rank.rank <= 25 ? "Great progress! You're in the top 25." :
           rank.rank <= 50 ? "Solid performance! Aim for the top 25." :
           "Every step forward counts! Keep learning and growing."}
        </p>
      </div>
    </motion.div>
  );
};