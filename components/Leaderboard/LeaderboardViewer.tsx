'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';
import { LeaderboardEntry, LeaderboardFilter } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { LeaderboardRow } from './LeaderboardRow';
import { PodiumDisplay } from './PodiumDisplay';
import { LeaderboardFilters } from './LeaderboardFilters';
import { MyRankCard } from './MyRankCard';
import { LeaderboardStats } from './LeaderboardStats';
import { cn } from '../../lib/utils';

interface LeaderboardViewerProps {
  currentUserId?: string;
  className?: string;
}

export const LeaderboardViewer: React.FC<LeaderboardViewerProps> = ({
  currentUserId,
  className
}) => {
  const {
    leaderboards,
    leaderboardFilter,
    setLeaderboardFilter,
    getLeaderboard,
    getMyRank,
    updateLeaderboard,
    getProfile
  } = useSocialStore();

  const [activeTab, setActiveTab] = useState<'global' | 'subject' | 'class' | 'streak'>('global');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'all_time'>('week');
  const [metric, setMetric] = useState<'xp' | 'streak' | 'quizzes' | 'concepts'>('xp');
  const [currentFilter, setCurrentFilter] = useState<LeaderboardFilter>(leaderboardFilter);

  // Generate sample leaderboard data
  const generateSampleData = (): LeaderboardEntry[] => {
    const sampleUsers = [
      { id: 'user1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', level: 15, xp: 3200, streak: 25 },
      { id: 'user2', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', level: 16, xp: 3500, streak: 12 },
      { id: 'user3', name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', level: 14, xp: 2800, streak: 18 },
      { id: 'user4', name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', level: 13, xp: 2600, streak: 8 },
      { id: 'user5', name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', level: 12, xp: 2400, streak: 15 },
      { id: 'user6', name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', level: 11, xp: 2200, streak: 22 },
      { id: 'user7', name: 'James Brown', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', level: 10, xp: 2000, streak: 6 },
      { id: 'user8', name: 'Maria Garcia', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150', level: 9, xp: 1800, streak: 14 },
      { id: 'user9', name: 'Robert Taylor', avatar: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=150', level: 8, xp: 1600, streak: 9 },
      { id: 'user10', name: 'Jennifer Martinez', avatar: 'https://images.unsplash.com/photo-1534759846116-57968a6b2a2c?w=150', level: 7, xp: 1400, streak: 11 }
    ];

    return sampleUsers.map((user, index) => ({
      userId: user.id,
      username: user.name,
      avatar: user.avatar,
      currentLevel: user.level,
      totalXP: user.xp,
      currentStreak: user.streak,
      rank: index + 1,
      rankChange: Math.floor(Math.random() * 11) - 5, // -5 to +5
      lastActive: new Date(),
      subjects: ['Mathematics', 'Physics'],
      class: 10
    }));
  };

  // Initialize leaderboard data
  useEffect(() => {
    const filter: LeaderboardFilter = {
      type: activeTab,
      timePeriod,
      metric,
      ...(activeTab === 'subject' && { subject: 'Mathematics' }),
      ...(activeTab === 'class' && { class: 10 })
    };

    const existingData = getLeaderboard(filter);
    if (existingData.length === 0) {
      const newData = generateSampleData();
      updateLeaderboard(filter, newData);
      setCurrentFilter(filter);
    }
  }, [activeTab, timePeriod, metric]);

  const leaderboardData = getLeaderboard(currentFilter);
  const myRank = currentUserId ? getMyRank(currentFilter) : null;

  const tabs = [
    { id: 'global', label: 'Global', icon: Users },
    { id: 'subject', label: 'By Subject', icon: Target },
    { id: 'class', label: 'By Class', icon: Trophy },
    { id: 'streak', label: 'By Streak', icon: TrendingUp }
  ] as const;

  const timePeriods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all_time', label: 'All Time' }
  ] as const;

  const metrics = [
    { id: 'xp', label: 'Total XP', icon: Award },
    { id: 'streak', label: 'Study Streak', icon: TrendingUp },
    { id: 'quizzes', label: 'Quizzes', icon: Target },
    { id: 'concepts', label: 'Concepts', icon: BookOpen }
  ] as const;

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const classes = [9, 10, 11, 12];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[var(--muted-foreground)]">#{rank}</span>;
    }
  };

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case 'xp':
        return entry.totalXP.toLocaleString();
      case 'streak':
        return `${entry.currentStreak} days`;
      case 'quizzes':
        return '124'; // Sample data
      case 'concepts':
        return '156'; // Sample data
      default:
        return entry.totalXP.toLocaleString();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Leaderboard</h1>
            <p className="text-[var(--muted-foreground)]">
              Compete with other learners and climb the ranks
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <LeaderboardFilters
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        metric={metric}
        onMetricChange={setMetric}
        activeTab={activeTab}
        subjects={subjects}
        classes={classes}
        onFilterChange={(newFilter) => setCurrentFilter(newFilter)}
      />

      {/* My Rank Card */}
      {currentUserId && myRank && (
        <MyRankCard
          rank={myRank}
          metric={metric}
          getMetricValue={getMetricValue}
        />
      )}

      {/* Podium Display for Top 3 */}
      {leaderboardData.length >= 3 && (
        <PodiumDisplay
          entries={leaderboardData.slice(0, 3)}
          metric={metric}
          getMetricValue={getMetricValue}
        />
      )}

      {/* Leaderboard List */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* List Header */}
        <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Rankings</span>
            </h3>
            
            <div className="text-sm text-[var(--muted-foreground)]">
              Showing {leaderboardData.length} learners
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="divide-y divide-[var(--border)]">
          {leaderboardData.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              rank={index + 1}
              metric={metric}
              getMetricValue={getMetricValue}
              isCurrentUser={entry.userId === currentUserId}
              rankIcon={getRankIcon(index + 1)}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard Stats */}
      <LeaderboardStats
        filter={currentFilter}
        totalEntries={leaderboardData.length}
      />
    </div>
  );
};