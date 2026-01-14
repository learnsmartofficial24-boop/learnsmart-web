'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Users, Flame, MessageCircle } from 'lucide-react';
import { FriendActivity } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { cn } from '../../lib/utils';

interface SocialNotificationProps {
  activity: FriendActivity;
  currentUserId?: string;
  onClick?: () => void;
  className?: string;
}

export const SocialNotification: React.FC<SocialNotificationProps> = ({
  activity,
  currentUserId,
  onClick,
  className
}) => {
  const { getProfile } = useSocialStore();
  const userProfile = getProfile(activity.userId);

  const getActivityIcon = (type: FriendActivity['activity']['type']) => {
    switch (type) {
      case 'achievement_unlocked':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'streak_milestone':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'quiz_completed':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'level_up':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'group_joined':
        return <Users className="w-5 h-5 text-green-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: FriendActivity['activity']['type']) => {
    switch (type) {
      case 'achievement_unlocked':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'streak_milestone':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
      case 'quiz_completed':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'level_up':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
      case 'group_joined':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={cn(
        "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
        getActivityColor(activity.activity.type),
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-semibold">
              {userProfile?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-sm text-[var(--foreground)] truncate">
              {userProfile?.name || 'Unknown User'}
            </h4>
            {getActivityIcon(activity.activity.type)}
          </div>
          
          <p className="text-sm text-[var(--foreground)] leading-relaxed">
            {activity.activity.description}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--muted-foreground)]">
              {formatTimeAgo(activity.activity.timestamp)}
            </span>
            
            {userProfile?.currentLevel && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Level {userProfile.currentLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Activity-specific content */}
      {activity.activity.type === 'achievement_unlocked' && activity.activity.data && (
        <div className="mt-3 p-2 bg-[var(--card)] rounded border">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {activity.activity.data.icon || '🏆'}
            </span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {activity.activity.data.name || 'Achievement Unlocked'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};