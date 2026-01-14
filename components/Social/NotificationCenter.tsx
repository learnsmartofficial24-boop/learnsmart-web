'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Filter, Search } from 'lucide-react';
import { Notification } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const { user } = useAuthStore();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadCount
  } = useSocialStore();

  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'groups' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userNotifications = user ? notifications.filter(n => n.userId === user.id) : [];
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  // Filter notifications
  const filteredNotifications = userNotifications.filter(notification => {
    // Apply search filter
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Apply type filter
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'achievements':
        return notification.type === 'achievement' || notification.type === 'rank_change';
      case 'groups':
        return notification.type === 'group_invite' || notification.type === 'group_activity' || notification.type === 'group_mention';
      case 'social':
        return notification.type === 'follower' || notification.type === 'streak_milestone';
      default:
        return true;
    }
  });

  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'follower':
        return '👤';
      case 'group_invite':
        return '👥';
      case 'group_mention':
        return '💬';
      case 'streak_milestone':
        return '🔥';
      case 'rank_change':
        return '📈';
      case 'group_activity':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'follower':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'group_invite':
      case 'group_activity':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'streak_milestone':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
      case 'rank_change':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "p-4 border-b border-[var(--border)] hover:bg-[var(--accent)]/30 transition-colors cursor-pointer",
        !notification.isRead && "bg-[var(--primary)]/5 border-l-4 border-l-[var(--primary)]"
      )}
      onClick={() => {
        if (!notification.isRead) {
          handleMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
      }}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg",
          getNotificationColor(notification.type)
        )}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn(
                "font-semibold text-sm",
                !notification.isRead ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
              )}>
                {notification.title}
              </h4>
              <p className={cn(
                "text-sm mt-1",
                !notification.isRead ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
              )}>
                {notification.message}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                  className="p-1 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle dismiss/delete
                }}
                className="p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-50",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-[var(--primary)]" />
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    Notifications
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">Filter</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'achievements', label: 'Achievements' },
                  { id: 'groups', label: 'Groups' },
                  { id: 'social', label: 'Social' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id as any)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      filter === filterOption.id
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-[var(--foreground)] mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {filter === 'unread' 
                      ? 'All caught up! No unread notifications.' 
                      : 'You\'ll see notifications here when they arrive.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {sortedNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {sortedNotifications.length > 0 && (
              <div className="p-4 border-t border-[var(--border)]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Handle "View all notifications" action
                    console.log('View all notifications');
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};