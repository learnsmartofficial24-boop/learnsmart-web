'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Achievement } from '../../lib/types';
import { AchievementNotification } from './AchievementNotification';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AchievementProgressProps {
  achievement: Achievement;
  currentProgress: number;
  targetValue: number;
  currentValue: number;
  onClose?: () => void;
  className?: string;
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  achievement,
  currentProgress,
  targetValue,
  currentValue,
  onClose,
  className
}) => {
  const [showNotification, setShowNotification] = useState(false);

  const getProgressColor = () => {
    if (currentProgress >= 100) return 'text-green-600';
    if (currentProgress >= 75) return 'text-blue-600';
    if (currentProgress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = () => {
    if (currentProgress >= 100) return 'bg-green-500';
    if (currentProgress >= 75) return 'bg-blue-500';
    if (currentProgress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimeEstimate = () => {
    if (currentProgress >= 100) return 'Completed!';
    
    const remaining = targetValue - currentValue;
    // This would need real user data to calculate accurately
    const avgDailyProgress = 5; // Assumed average
    const daysRemaining = Math.ceil(remaining / avgDailyProgress);
    
    if (daysRemaining === 0) return 'Almost there!';
    if (daysRemaining === 1) return '1 day remaining';
    return `${daysRemaining} days remaining`;
  };

  const formatCriteria = () => {
    const { type, value } = achievement.unlockCriteria;
    switch (type) {
      case 'xp':
        return `${value.toLocaleString()} XP`;
      case 'streak':
        return `${value} day streak`;
      case 'concepts':
        return `${value} concepts learned`;
      case 'quiz_score':
        return `${value}% quiz score`;
      case 'time':
        return `${Math.floor(value / 60)} hours study time`;
      case 'groups':
        return `${value} study groups`;
      case 'friends':
        return `${value} friends`;
      default:
        return `${value} ${type}`;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-[var(--card)] border border-[var(--border)] rounded-lg p-6",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">{achievement.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                {achievement.name}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {achievement.description}
              </p>
            </div>
          </div>
          
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              Progress
            </span>
            <span className={cn("text-sm font-bold", getProgressColor())}>
              {Math.round(currentProgress)}%
            </span>
          </div>
          
          <div className="w-full bg-[var(--accent)] rounded-full h-3">
            <motion.div
              className={cn("h-3 rounded-full", getProgressBarColor())}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(currentProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--foreground)]">
              {currentValue.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Current</div>
          </div>
          
          <div className="text-center p-3 bg-[var(--accent)]/50 rounded-lg">
            <div className="text-xl font-bold text-[var(--foreground)]">
              {targetValue.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Target</div>
          </div>
        </div>

        {/* Achievement Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Requirement:</span>
            <span className="font-medium text-[var(--foreground)]">
              {formatCriteria()}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Category:</span>
            <span className="font-medium text-[var(--foreground)] capitalize">
              {achievement.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Rarity:</span>
            <span className={cn(
              "font-medium capitalize",
              achievement.rarity === 'legendary' ? 'text-yellow-600' :
              achievement.rarity === 'rare' ? 'text-purple-600' :
              achievement.rarity === 'uncommon' ? 'text-gray-600' :
              'text-amber-600'
            )}>
              {achievement.rarity}
            </span>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="text-center mb-4">
          <div className="text-sm font-medium text-[var(--foreground)] mb-1">
            {getTimeEstimate()}
          </div>
          {currentProgress < 100 && (
            <p className="text-xs text-[var(--muted-foreground)]">
              Keep learning to unlock this achievement!
            </p>
          )}
        </div>

        {/* Completion Message */}
        {currentProgress >= 100 && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Achievement Unlocked!</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              Congratulations! You've earned this achievement.
            </p>
            <Button
              onClick={() => setShowNotification(true)}
              size="sm"
              className="w-full"
            >
              Celebrate Achievement! 🎉
            </Button>
          </div>
        )}
      </motion.div>

      {/* Achievement Notification */}
      {currentProgress >= 100 && (
        <AchievementNotification
          achievement={achievement}
          onClose={() => setShowNotification(false)}
          isVisible={showNotification}
          onShare={() => {
            // Handle share
            setShowNotification(false);
          }}
        />
      )}
    </>
  );
};