'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Users, Award, TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface DashboardSocialWidgetProps {
  className?: string;
}

export const DashboardSocialWidget: React.FC<DashboardSocialWidgetProps> = ({
  className
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    getProfile,
    getUserAchievements,
    getMyRank,
    leaderboardFilter
  } = useSocialStore();

  const profile = user ? getProfile(user.id) : null;
  const userAchievements = profile ? getUserAchievements(profile.id) : [];
  const myRank = profile ? getMyRank(leaderboardFilter) : null;

  const recentAchievements = userAchievements.slice(0, 3);
  const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

  if (!profile) {
    return null;
  }

  return (
    <div className={cn("bg-[var(--card)] border border-[var(--border)] rounded-lg p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Social Hub</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[var(--primary)]"
          onClick={() => router.push('/profile/me')}
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--accent)]/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-[var(--foreground)]">
            {userAchievements.length}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">Achievements</div>
        </div>
        
        <div className="bg-[var(--accent)]/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-[var(--foreground)]">
            {totalPoints}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">Total Points</div>
        </div>
      </div>

      {/* Current Rank */}
      {myRank && (
        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                <Trophy className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  Your Rank
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {leaderboardFilter.type} Leaderboard
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-[var(--primary)]">
                #{myRank.rank}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {myRank.totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Award className="w-4 h-4 text-[var(--primary)]" />
          <h4 className="text-sm font-semibold text-[var(--foreground)]">Recent Achievements</h4>
        </div>
        
        <div className="space-y-2">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((userAchievement) => (
              <motion.div
                key={userAchievement.achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-2 hover:bg-[var(--accent)]/50 rounded-lg transition-colors"
              >
                <span className="text-lg">{userAchievement.achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)] truncate">
                    {userAchievement.achievement.name}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {userAchievement.earnedAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-[var(--primary)] font-medium">
                  +{userAchievement.achievement.points}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-[var(--muted-foreground)] text-sm">
              No achievements yet. Start learning to unlock your first badge!
            </div>
          )}
        </div>
      </div>

      {/* Study Streak */}
      {profile.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">
                Study Streak
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Keep it going!
              </div>
            </div>
            <div className="ml-auto">
              <div className="text-lg font-bold text-orange-500">
                {profile.currentStreak}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center space-x-1"
          onClick={() => router.push('/social/leaderboard')}
        >
          <Trophy className="w-4 h-4" />
          <span>Leaderboard</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center space-x-1"
          onClick={() => router.push('/groups')}
        >
          <Users className="w-4 h-4" />
          <span>Groups</span>
        </Button>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          {userAchievements.length === 0 
            ? "Start your learning journey today!" 
            : profile.currentStreak > 7 
            ? "Amazing streak! You're on fire! 🔥"
            : "Keep learning to unlock more achievements!"}
        </p>
      </div>
    </div>
  );
};