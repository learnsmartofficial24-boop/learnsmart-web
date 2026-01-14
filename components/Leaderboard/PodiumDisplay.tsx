'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Trophy, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../../lib/types';
import { cn } from '../../lib/utils';

interface PodiumDisplayProps {
  entries: LeaderboardEntry[];
  metric: 'xp' | 'streak' | 'quizzes' | 'concepts';
  getMetricValue: (entry: LeaderboardEntry) => string;
}

export const PodiumDisplay: React.FC<PodiumDisplayProps> = ({
  entries,
  metric,
  getMetricValue
}) => {
  if (entries.length < 3) {
    return null;
  }

  const [first, second, third] = entries;

  const PodiumPosition: React.FC<{
    position: 'first' | 'second' | 'third';
    entry: LeaderboardEntry;
    height: string;
  }> = ({ position, entry, height }) => {
    const getIcon = () => {
      switch (position) {
        case 'first':
          return <Crown className="w-8 h-8 text-yellow-500" />;
        case 'second':
          return <Medal className="w-7 h-7 text-gray-400" />;
        case 'third':
          return <Medal className="w-6 h-6 text-orange-600" />;
      }
    };

    const getBgGradient = () => {
      switch (position) {
        case 'first':
          return 'from-yellow-400 to-orange-500';
        case 'second':
          return 'from-gray-300 to-gray-500';
        case 'third':
          return 'from-orange-400 to-red-500';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position === 'first' ? 0 : position === 'second' ? 0.2 : 0.4 }}
        className={cn(
          "flex flex-col items-center justify-end text-center p-4 rounded-t-lg bg-gradient-to-t shadow-lg",
          height,
          getBgGradient()
        )}
      >
        {/* User Avatar */}
        <div className="relative mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            {entry.avatar ? (
              <img
                src={entry.avatar}
                alt={entry.username}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-lg">
                {entry.username.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
          
          {/* Rank Icon */}
          <div className="absolute -top-2 -right-2">
            {getIcon()}
          </div>
        </div>

        {/* User Info */}
        <div className="text-white mb-3">
          <h3 className="font-bold text-lg truncate max-w-[120px]">
            {entry.username}
          </h3>
          <div className="text-sm opacity-90">
            Level {entry.currentLevel}
          </div>
        </div>

        {/* Metric Value */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-2">
          <div className="text-white font-bold text-xl">
            {getMetricValue(entry)}
          </div>
          <div className="text-xs text-white/80">
            {metric === 'xp' ? 'Total XP' :
             metric === 'streak' ? 'Day Streak' :
             metric === 'quizzes' ? 'Quizzes' : 'Concepts'}
          </div>
        </div>

        {/* Streak indicator */}
        {entry.currentStreak > 0 && (
          <div className="flex items-center space-x-1 text-white/90 text-sm">
            <span>🔥</span>
            <span>{entry.currentStreak}</span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Trophy className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-xl font-bold text-[var(--foreground)]">Top Performers</h2>
          <Sparkles className="w-6 h-6 text-[var(--primary)]" />
        </div>
        <p className="text-[var(--muted-foreground)]">
          The champions of this {metric} leaderboard
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center space-x-4 h-64">
        {/* Third Place */}
        <div className="flex flex-col items-center">
          <PodiumPosition position="third" entry={third} height="h-40" />
          <div className="bg-[var(--accent)]/50 rounded-b-lg w-24 h-8 flex items-center justify-center border-t border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] font-bold text-sm">3RD</span>
          </div>
        </div>

        {/* First Place */}
        <div className="flex flex-col items-center">
          <PodiumPosition position="first" entry={first} height="h-56" />
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-b-lg w-28 h-10 flex items-center justify-center shadow-lg">
            <div className="flex items-center space-x-1 text-white font-bold">
              <Crown className="w-4 h-4" />
              <span>1ST</span>
            </div>
          </div>
        </div>

        {/* Second Place */}
        <div className="flex flex-col items-center">
          <PodiumPosition position="second" entry={second} height="h-48" />
          <div className="bg-[var(--accent)]/50 rounded-b-lg w-24 h-8 flex items-center justify-center border-t border-[var(--border)]">
            <span className="text-[var(--muted-foreground)] font-bold text-sm">2ND</span>
          </div>
        </div>
      </div>

      {/* Confetti Effect for First Place */}
      {first && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                opacity: 0,
                y: -100,
                x: Math.random() * 100 + '%',
                rotate: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                y: 200,
                rotate: 360
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              {['🎉', '🎊', '⭐', '🏆', '✨'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Achievement Badges */}
      <div className="mt-6 flex justify-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-medium">Champion</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">
          <Medal className="w-4 h-4" />
          <span className="text-sm font-medium">Runner-up</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full">
          <Medal className="w-4 h-4" />
          <span className="text-sm font-medium">Third Place</span>
        </div>
      </div>
    </div>
  );
};