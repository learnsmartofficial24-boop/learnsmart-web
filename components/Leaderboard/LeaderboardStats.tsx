'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { LeaderboardFilter } from '../../lib/types';
import { cn } from '../../lib/utils';

interface LeaderboardStatsProps {
  filter: LeaderboardFilter;
  totalEntries: number;
}

export const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({
  filter,
  totalEntries
}) => {
  // Generate sample statistics
  const stats = {
    totalUsers: 1247,
    activeUsers24h: 156,
    averageLevel: 8.5,
    averageXP: 1450,
    averageStreak: 12.3,
    totalGroups: 89,
    topSubject: 'Mathematics',
    updateFrequency: 'Daily at 12:00 AM',
    lastUpdate: new Date(),
    rankDistribution: {
      'Top 10': 23,
      'Top 25': 45,
      'Top 50': 89,
      'Top 100': 234,
      'Beyond 100': 1013
    },
    performanceMetrics: {
      averageDailyXP: 85,
      mostActiveTime: '2-4 PM',
      averageSessionLength: '45 minutes'
    }
  };

  const getFilterDescription = () => {
    switch (filter.type) {
      case 'global':
        return 'All users across all subjects and classes';
      case 'subject':
        return `Users studying ${filter.subject}`;
      case 'class':
        return `Class ${filter.class} students`;
      case 'streak':
        return 'Users ranked by study streak length';
      default:
        return 'Global leaderboard';
    }
  };

  const getTimeDescription = () => {
    switch (filter.timePeriod) {
      case 'week':
        return 'This week\'s rankings';
      case 'month':
        return 'This month\'s rankings';
      case 'all_time':
        return 'All-time rankings';
      default:
        return 'Current rankings';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overview Stats */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Leaderboard Overview</h3>
        </div>

        <div className="space-y-4">
          {/* Filter Info */}
          <div className="p-3 bg-[var(--accent)]/30 rounded-lg">
            <div className="text-sm font-medium text-[var(--foreground)] mb-1">
              Current Filter
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              {getFilterDescription()}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">
              {getTimeDescription()}
            </div>
          </div>

          {/* Total Users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Total Users Ranked</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {totalEntries.toLocaleString()}
            </span>
          </div>

          {/* Active Users */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Active Today</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {stats.activeUsers24h}
            </span>
          </div>

          {/* Average Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Average Level</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {stats.averageLevel}
            </span>
          </div>

          {/* Average XP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Average XP</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {stats.averageXP.toLocaleString()}
            </span>
          </div>

          {/* Average Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Average Streak</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              {stats.averageStreak} days
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] text-center">
            Last updated: {stats.lastUpdate.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] text-center mt-1">
            Updates {stats.updateFrequency}
          </div>
        </div>
      </div>

      {/* Rank Distribution */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Rank Distribution</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(stats.rankDistribution).map(([range, count], index) => {
            const percentage = (count / totalEntries) * 100;
            const colors = [
              'bg-yellow-500',
              'bg-green-500', 
              'bg-blue-500',
              'bg-purple-500',
              'bg-gray-500'
            ];
            
            return (
              <motion.div
                key={range}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {range}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {count} users ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--accent)] rounded-full h-2">
                  <motion.div
                    className={cn("h-2 rounded-full", colors[index])}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Performance Insights */}
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
            Performance Insights
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Most Active Time</span>
              <span className="text-[var(--foreground)] font-medium">
                {stats.performanceMetrics.mostActiveTime}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Avg Session Length</span>
              <span className="text-[var(--foreground)] font-medium">
                {stats.performanceMetrics.averageSessionLength}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Avg Daily XP</span>
              <span className="text-[var(--foreground)] font-medium">
                {stats.performanceMetrics.averageDailyXP} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};