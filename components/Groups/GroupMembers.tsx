'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Crown, Shield, MessageCircle, MoreVertical } from 'lucide-react';
import { UserProfile, GroupMembership } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface GroupMembersProps {
  groupId: string;
  currentUserId?: string;
  className?: string;
}

export const GroupMembers: React.FC<GroupMembersProps> = ({
  groupId,
  currentUserId,
  className
}) => {
  const { 
    getGroup, 
    groupMemberships, 
    profiles,
    getProfile 
  } = useSocialStore();

  const group = getGroup(groupId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Get members with their roles
  const members = React.useMemo(() => {
    if (!group) return [];

    return group.memberIds.map(userId => {
      const membership = groupMemberships.find(
        m => m.userId === userId && m.groupId === groupId
      );
      const profile = getProfile(userId) || profiles[userId];
      
      return {
        userId,
        profile,
        membership,
        role: membership?.role || 'member'
      };
    }).filter(member => member.profile);
  }, [group, groupMemberships, groupId, getProfile, profiles]);

  // Filter members by search query
  const filteredMembers = members.filter(member =>
    member.profile?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort members by role (admins first, then moderators, then members)
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const roleOrder = { owner: 3, admin: 2, moderator: 1, member: 0 };
    const aOrder = roleOrder[a.role as keyof typeof roleOrder] || 0;
    const bOrder = roleOrder[b.role as keyof typeof roleOrder] || 0;
    
    if (aOrder !== bOrder) {
      return bOrder - aOrder;
    }
    
    // Then sort by name
    return (a.profile?.name || '').localeCompare(b.profile?.name || '');
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getActivityStatus = (lastActive: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(lastActive).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return { text: 'Online now', color: 'text-green-500' };
    if (minutes < 60) return { text: `${minutes}m ago`, color: 'text-green-500' };
    if (hours < 24) return { text: `${hours}h ago`, color: 'text-yellow-500' };
    if (days < 7) return { text: `${days}d ago`, color: 'text-orange-500' };
    return { text: 'Inactive', color: 'text-red-500' };
  };

  if (!group) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--muted-foreground)]">Group not found</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Group Members
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members..."
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {sortedMembers.map((member, index) => {
          const { userId, profile, role } = member;
          const isCurrentUser = currentUserId === userId;
          const activityStatus = getActivityStatus(member.membership?.lastActive || new Date());
          
          return (
            <motion.div
              key={userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold">
                      {profile?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  
                  {/* Online Status */}
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--card)]",
                    activityStatus.color.includes('green') ? 'bg-green-500' :
                    activityStatus.color.includes('yellow') ? 'bg-yellow-500' :
                    activityStatus.color.includes('orange') ? 'bg-orange-500' :
                    'bg-gray-500'
                  )} />
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-[var(--foreground)] truncate">
                      {profile?.name || 'Unknown User'}
                    </h3>
                    {isCurrentUser && (
                      <span className="text-xs text-[var(--primary)] font-medium px-2 py-0.5 bg-[var(--primary)]/10 rounded-full">
                        You
                      </span>
                    )}
                    {getRoleIcon(role)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)]">
                    <div className="flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Level {profile?.currentLevel || 1}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span>{profile?.totalXP.toLocaleString() || 0} XP</span>
                    </div>
                    
                    <div className={cn("text-xs", activityStatus.color)}>
                      {activityStatus.text}
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium capitalize",
                    getRoleColor(role)
                  )}>
                    {role}
                  </span>

                  {/* Actions */}
                  {!isCurrentUser && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Handle message */}}
                        className="p-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(
                          selectedMember === userId ? null : userId
                        )}
                        className="p-2"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Stats */}
              {member.membership && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {member.membership.contributionScore.toLocaleString()}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Contribution
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {member.membership.postsCount}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Posts
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {member.membership.achievementsCount}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Achievements
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Member Actions Dropdown */}
              {selectedMember === userId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-[var(--border)]"
                >
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Send Message
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-[var(--muted-foreground)]">
            No members found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
};