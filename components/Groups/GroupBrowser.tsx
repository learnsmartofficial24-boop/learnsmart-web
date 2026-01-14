'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Calendar, Target, BookOpen, Star } from 'lucide-react';
import { StudyGroup } from '../../lib/types';
import { useSocialStore } from '../../store/socialStore';
import { GroupCard } from './GroupCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface GroupBrowserProps {
  currentUserId?: string;
  onCreateGroup?: () => void;
  onJoinGroup?: (groupId: string) => void;
  className?: string;
}

export const GroupBrowser: React.FC<GroupBrowserProps> = ({
  currentUserId,
  onCreateGroup,
  onJoinGroup,
  className
}) => {
  const { groups, searchGroups, getUserGroups } = useSocialStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'study' | 'social' | 'competitive'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'activity' | 'created'>('activity');

  // Get user's groups to exclude from suggestions
  const userGroups = currentUserId ? getUserGroups(currentUserId) : [];
  const userGroupIds = new Set(userGroups.map(g => g.id));

  // Filter and sort groups
  const filteredGroups = React.useMemo(() => {
    let result = Object.values(groups);

    // Apply search filter
    if (searchQuery.trim()) {
      result = searchGroups(searchQuery);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(group => group.type === selectedType);
    }

    // Apply subject filter
    if (selectedSubject) {
      result = result.filter(group => group.subject === selectedSubject);
    }

    // Apply class filter
    if (selectedClass) {
      result = result.filter(group => group.class === selectedClass);
    }

    // Exclude user's existing groups
    if (currentUserId) {
      result = result.filter(group => !userGroupIds.has(group.id));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.memberCount - a.memberCount;
        case 'activity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [groups, searchQuery, selectedType, selectedSubject, selectedClass, sortBy, currentUserId, searchGroups, userGroupIds]);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];
  const classes = [9, 10, 11, 12];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study':
        return <BookOpen className="w-4 h-4" />;
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'competitive':
        return <Target className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Study Groups</h1>
            <p className="text-[var(--muted-foreground)]">
              Discover and join groups to learn together
            </p>
          </div>
        </div>

        {onCreateGroup && (
          <Button onClick={onCreateGroup} className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Create Group</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="all">All Types</option>
            <option value="study">Study Groups</option>
            <option value="social">Social</option>
            <option value="competitive">Competitive</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : '')}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="">All Classes</option>
            {classes.map((classNum) => (
              <option key={classNum} value={classNum}>
                Class {classNum}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
          >
            <option value="activity">Most Active</option>
            <option value="members">Most Members</option>
            <option value="name">Name</option>
            <option value="created">Newest</option>
          </select>
        </div>

        {/* Active Filters */}
        {(selectedType !== 'all' || selectedSubject || selectedClass || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Active filters:</span>
              {selectedType !== 'all' && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  {selectedType}
                </span>
              )}
              {selectedSubject && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  {selectedSubject}
                </span>
              )}
              {selectedClass && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  Class {selectedClass}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  "{searchQuery}"
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedSubject('');
                  setSelectedClass('');
                  setSearchQuery('');
                }}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--muted-foreground)]">
          Showing {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''}
          {currentUserId && (
            <span> • {userGroups.length} of your groups</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-[var(--muted-foreground)]">Type:</span>
          {['all', 'study', 'social', 'competitive'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                selectedType === type
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            No groups found
          </h3>
          <p className="text-[var(--muted-foreground)] mb-4">
            Try adjusting your filters or create a new group to get started.
          </p>
          {onCreateGroup && (
            <Button onClick={onCreateGroup}>
              Create First Group
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GroupCard
                group={group}
                onJoin={() => onJoinGroup?.(group.id)}
                currentUserId={currentUserId}
                showJoinButton={!userGroupIds.has(group.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Popular Types */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center space-x-2">
          <Star className="w-5 h-5 text-[var(--primary)]" />
          <span>Popular Group Types</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              type: 'study',
              name: 'Study Groups',
              description: 'Collaborative learning sessions',
              count: Object.values(groups).filter(g => g.type === 'study').length,
              icon: <BookOpen className="w-6 h-6" />,
              color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
            },
            {
              type: 'social',
              name: 'Social Groups',
              description: 'Connect and share experiences',
              count: Object.values(groups).filter(g => g.type === 'social').length,
              icon: <Users className="w-6 h-6" />,
              color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
            },
            {
              type: 'competitive',
              name: 'Competitive',
              description: 'Challenge and compete',
              count: Object.values(groups).filter(g => g.type === 'competitive').length,
              icon: <Target className="w-6 h-6" />,
              color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
            }
          ].map((type) => (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type as any)}
              className="p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors text-left"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={cn("p-2 rounded-lg", type.color)}>
                  {type.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">{type.name}</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">{type.description}</p>
                </div>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {type.count} group{type.count !== 1 ? 's' : ''} available
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};