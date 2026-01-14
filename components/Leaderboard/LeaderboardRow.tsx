'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MessageCircle, User } from 'lucide-react';
import { LeaderboardEntry } from '../../lib/types';
import { cn } from '../../lib/utils';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  metric: 'xp' | 'streak' | 'quizzes' | 'concepts';
  getMetricValue: (entry: LeaderboardEntry) => string;
  isCurrentUser?: boolean;
  rankIcon: React.ReactNode;
  onClick?: () => void;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  rank,
  metric,
  getMetricValue,
  isCurrentUser = false,
  rankIcon,
  onClick
}) => {
  const getRankChangeIcon = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center space-x-1 text-green-500">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center space-x-1 text-red-500">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">{change}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-[var(--muted-foreground)]">
          <Minus className="w-3 h-3" />
          <span className="text-xs font-medium">-</span>
        </div>
      );
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case 'xp':
        return '⭐';
      case 'streak':
        return '🔥';
      case 'quizzes':
        return '🎯';
      case 'concepts':
        return '📚';
      default:
        return '⭐';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        "p-4 hover:bg-[var(--accent)]/50 transition-colors cursor-pointer",
        isCurrentUser && "bg-[var(--primary)]/10 border-l-4 border-[var(--primary)]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div className="w-12 flex items-center justify-center">
          {rankIcon}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            {entry.avatar ? (
              <img
                src={entry.avatar}
                alt={entry.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-semibold text-sm">
                {entry.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold px-1.5 py-0.5 rounded-full">
              {entry.currentLevel}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={cn(
                "font-semibold truncate",
                isCurrentUser ? "text-[var(--primary)]" : "text-[var(--foreground)]"
              )}>
                {entry.username}
              </h3>
              {isCurrentUser && (
                <span className="text-xs text-[var(--primary)] font-medium">(You)</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>Level {entry.currentLevel}</span>
              </div>
              
              {entry.subjects && entry.subjects.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs">📚</span>
                  <span>{entry.subjects[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metric Value */}
        <div className="text-right">
          <div className="flex items-center space-x-1 justify-end">
            <span className="text-sm">{getMetricIcon()}</span>
            <span className={cn(
              "font-bold text-lg",
              isCurrentUser ? "text-[var(--primary)]" : "text-[var(--foreground)]"
            )}>
              {getMetricValue(entry)}
            </span>
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {metric === 'xp' ? 'Total XP' :
             metric === 'streak' ? 'Current Streak' :
             metric === 'quizzes' ? 'Quizzes' : 'Concepts'}
          </div>
        </div>

        {/* Rank Change */}
        <div className="w-16 flex justify-center">
          {entry.rankChange !== undefined && getRankChangeIcon(entry.rankChange)}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {isCurrentUser ? (
            <div className="text-xs text-[var(--primary)] font-medium px-2 py-1 bg-[var(--primary)]/10 rounded-full">
              You
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle message action
              }}
              className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--accent)] rounded-lg transition-colors"
              title="Send message"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Streak indicator for top performers */}
      {entry.currentStreak > 0 && rank <= 10 && (
        <div className="mt-2 ml-16 flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-orange-600">
            <span>🔥</span>
            <span>{entry.currentStreak} day streak</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};