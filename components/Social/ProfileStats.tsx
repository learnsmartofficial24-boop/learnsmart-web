'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Zap, BookOpen, Award, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserProfile } from '../../lib/types';
import { cn } from '../../lib/utils';

interface ProfileStatsProps {
  profile: UserProfile;
  className?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c4a7', '#ff9f40'];

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile, className }) => {
  // Generate sample data for charts
  const subjectProgressData = [
    { subject: 'Math', progress: 85, color: '#8884d8' },
    { subject: 'Physics', progress: 72, color: '#82ca9d' },
    { subject: 'Chemistry', progress: 68, color: '#ffc658' },
    { subject: 'Biology', progress: 91, color: '#ff7300' }
  ];

  const weeklyActivityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.7 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 1.2 }
  ];

  const masteryDistribution = [
    { name: 'Master', value: 35, color: '#22c55e' },
    { name: 'Competent', value: 40, color: '#3b82f6' },
    { name: 'In Progress', value: 20, color: '#f59e0b' },
    { name: 'Not Started', value: 5, color: '#ef4444' }
  ];

  const learningVelocity = Math.round((profile.totalConcepts / (profile.totalStudyTime / 60)) * 10) / 10; // concepts per hour

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-[var(--primary)]" />
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Learning Statistics</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {learningVelocity}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                Concepts/Hour
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {profile.averageQuizScore.toFixed(1)}%
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                Accuracy Rate
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {profile.longestStreak}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                Longest Streak
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)]">
                {Math.floor(profile.totalStudyTime / 60)}h
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                Total Study Time
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Subject Progress</span>
          </h3>
          
          <div className="space-y-3">
            {subjectProgressData.map((item, index) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item.subject}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {item.progress}%
                  </span>
                </div>
                <div className="w-full bg-[var(--accent)] rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Weekly Study Activity</span>
          </h3>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mastery Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Mastery Distribution</span>
          </h3>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={masteryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {masteryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {masteryDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-[var(--muted-foreground)]">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Learning Insights
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-[var(--accent)]/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Strongest Subject
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {profile.favoriteSubject || 'Biology'} - 91% mastery
              </p>
            </div>

            <div className="p-3 bg-[var(--accent)]/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Study Pattern
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Most active on Thursdays ({weeklyActivityData[3].hours}h)
              </p>
            </div>

            <div className="p-3 bg-[var(--accent)]/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Performance Trend
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Improving (+12% accuracy this month)
              </p>
            </div>

            <div className="p-3 bg-[var(--accent)]/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  Recommended Focus
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Chemistry concepts need more practice
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};