'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Target, Trophy, Search, BookOpen } from 'lucide-react';
import { LeaderboardFilter } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface LeaderboardFiltersProps {
  timePeriod: 'week' | 'month' | 'all_time';
  onTimePeriodChange: (period: 'week' | 'month' | 'all_time') => void;
  metric: 'xp' | 'streak' | 'quizzes' | 'concepts';
  onMetricChange: (metric: 'xp' | 'streak' | 'quizzes' | 'concepts') => void;
  activeTab: 'global' | 'subject' | 'class' | 'streak';
  subjects: string[];
  classes: number[];
  onFilterChange: (filter: LeaderboardFilter) => void;
}

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  timePeriod,
  onTimePeriodChange,
  metric,
  onMetricChange,
  activeTab,
  subjects,
  classes,
  onFilterChange
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const timePeriods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all_time', label: 'All Time' }
  ] as const;

  const metrics = [
    { id: 'xp', label: 'Total XP', icon: Trophy },
    { id: 'streak', label: 'Study Streak', icon: Calendar },
    { id: 'quizzes', label: 'Quizzes', icon: Target },
    { id: 'concepts', label: 'Concepts', icon: BookOpen }
  ] as const;

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    updateFilter({ subject: subject || undefined });
  };

  const handleClassChange = (classNum: number | '') => {
    setSelectedClass(classNum);
    updateFilter({ class: classNum || undefined });
  };

  const updateFilter = (updates: Partial<LeaderboardFilter>) => {
    const newFilter: LeaderboardFilter = {
      type: activeTab,
      timePeriod,
      metric,
      ...(activeTab === 'subject' && { subject: selectedSubject || undefined }),
      ...(activeTab === 'class' && { class: selectedClass || undefined }),
      ...updates
    };
    onFilterChange(newFilter);
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Filters</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Time Period */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Time Period
          </label>
          <div className="space-y-2">
            {timePeriods.map((period) => (
              <label key={period.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="timePeriod"
                  value={period.id}
                  checked={timePeriod === period.id}
                  onChange={(e) => onTimePeriodChange(e.target.value as any)}
                  className="w-4 h-4 text-[var(--primary)] border-[var(--border)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--foreground)]">{period.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Metric */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Ranking Metric
          </label>
          <div className="space-y-2">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <label key={m.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="metric"
                    value={m.id}
                    checked={metric === m.id}
                    onChange={(e) => onMetricChange(e.target.value as any)}
                    className="w-4 h-4 text-[var(--primary)] border-[var(--border)] focus:ring-[var(--primary)]"
                  />
                  <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm text-[var(--foreground)]">{m.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Subject Filter (when on subject tab) */}
        {activeTab === 'subject' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Class Filter (when on class tab) */}
        {activeTab === 'class' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] text-sm"
            >
              <option value="">All Classes</option>
              {classes.map((classNum) => (
                <option key={classNum} value={classNum}>
                  Class {classNum}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Search User
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-6 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Active Filters:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                {timePeriods.find(p => p.id === timePeriod)?.label}
              </span>
              <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                {metrics.find(m => m.id === metric)?.label}
              </span>
              {activeTab === 'subject' && selectedSubject && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  {selectedSubject}
                </span>
              )}
              {activeTab === 'class' && selectedClass && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  Class {selectedClass}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-full">
                  "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSubject('');
              setSelectedClass('');
              setSearchQuery('');
              onTimePeriodChange('week');
              onMetricChange('xp');
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};