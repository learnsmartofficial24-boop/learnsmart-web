'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Award, Calendar, BookOpen, Lock, Globe, Crown, MessageCircle } from 'lucide-react';
import { StudyGroup } from '../../lib/types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface GroupCardProps {
  group: StudyGroup;
  onJoin?: () => void;
  onView?: () => void;
  currentUserId?: string;
  showJoinButton?: boolean;
  className?: string;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onJoin,
  onView,
  currentUserId,
  showJoinButton = true,
  className
}) => {
  const isMember = currentUserId && group.memberIds.includes(currentUserId);
  const isAdmin = currentUserId && group.adminIds.includes(currentUserId);
  const isModerator = currentUserId && group.moderatorIds.includes(currentUserId);
  const userRole = isAdmin ? 'admin' : isModerator ? 'moderator' : isMember ? 'member' : null;

  const getTypeIcon = () => {
    switch (group.type) {
      case 'study':
        return <BookOpen className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'competitive':
        return <Award className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (group.type) {
      case 'study':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'social':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'competitive':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const getActivityLevel = () => {
    const daysSinceActivity = Math.floor(
      (new Date().getTime() - new Date(group.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity === 0) return { level: 'Very Active', color: 'text-green-600' };
    if (daysSinceActivity <= 1) return { level: 'Active', color: 'text-blue-600' };
    if (daysSinceActivity <= 7) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  const activity = getActivityLevel();
  const daysSinceCreated = Math.floor(
    (new Date().getTime() - new Date(group.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const memberPreview = group.memberIds.slice(0, 5);
  const additionalMembers = group.memberCount - memberPreview.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {/* Group Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center text-[var(--primary-foreground)]">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <span className="font-bold text-lg">
                  {group.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Privacy Indicator */}
            <div className="absolute -bottom-1 -right-1">
              {group.isPrivate ? (
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Group Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-[var(--foreground)] truncate text-lg">
                {group.name}
              </h3>
              {isMember && userRole && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  userRole === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  userRole === 'moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                )}>
                  {userRole}
                </span>
              )}
            </div>
            
            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2">
              {group.description}
            </p>

            {/* Group Meta */}
            <div className="flex items-center space-x-4 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center space-x-1">
                {getTypeIcon()}
                <span className="capitalize">{group.type}</span>
              </div>
              
              {group.subject && (
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{group.subject}</span>
                </div>
              )}
              
              {group.class && (
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Class {group.class}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        {showJoinButton && !isMember && onJoin && (
          <Button
            onClick={onJoin}
            size="sm"
            className="ml-2"
          >
            Join
          </Button>
        )}
        
        {isMember && onView && (
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            View
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--foreground)]">
            {group.memberCount}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">Members</div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--foreground)]">
            {group.totalXP.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">Total XP</div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-[var(--foreground)]">
            {group.achievementsCount}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">Achievements</div>
        </div>
      </div>

      {/* Activity Level */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="text-sm text-[var(--muted-foreground)]">
            Last active: {daysSinceActivity === 0 ? 'Today' : `${daysSinceActivity}d ago`}
          </span>
        </div>
        
        <div className={cn("text-sm font-medium", activity.color)}>
          {activity.level}
        </div>
      </div>

      {/* Tags */}
      {group.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[var(--accent)] text-[var(--muted-foreground)] text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {group.tags.length > 3 && (
            <span className="px-2 py-1 bg-[var(--accent)] text-[var(--muted-foreground)] text-xs rounded-full">
              +{group.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Member Preview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {memberPreview.map((userId, index) => (
              <div
                key={userId}
                className="w-6 h-6 rounded-full bg-[var(--primary)] border-2 border-[var(--card)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-medium"
                title={`Member ${index + 1}`}
              >
                {String(userId).charAt(0).toUpperCase()}
              </div>
            ))}
            {additionalMembers > 0 && (
              <div className="w-6 h-6 rounded-full bg-[var(--muted)] border-2 border-[var(--card)] flex items-center justify-center text-[var(--muted-foreground)] text-xs font-medium">
                +{additionalMembers}
              </div>
            )}
          </div>
          
          <span className="text-xs text-[var(--muted-foreground)]">
            {group.postCount} posts
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-1 text-xs text-[var(--muted-foreground)]">
          <Calendar className="w-3 h-3" />
          <span>
            {daysSinceCreated === 0 ? 'Today' : `${daysSinceCreated}d ago`}
          </span>
        </div>
      </div>

      {/* Type Badge */}
      <div className="mt-4 flex items-center justify-center">
        <span className={cn(
          "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium",
          getTypeColor()
        )}>
          {getTypeIcon()}
          <span className="capitalize">{group.type} Group</span>
        </span>
      </div>

      {/* Hover Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        <div className="flex space-x-2">
          {onView && (
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};