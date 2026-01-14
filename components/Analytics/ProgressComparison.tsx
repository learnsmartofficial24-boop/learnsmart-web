'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { SubjectsData } from '@/lib/types';

interface ProgressComparisonProps {
  subjectsData: SubjectsData;
  className?: string;
}

const getSubjectColor = (subject: string, index: number): string => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green  
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#ef4444', // red
    '#84cc16'  // lime
  ];
  return colors[index % colors.length];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {Math.round(entry.value)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProgressComparison({ subjectsData, className = '' }: ProgressComparisonProps) {
  const subjects = Object.entries(subjectsData);
  
  if (subjects.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subject Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
            No subject data available yet. Start learning to see comparisons!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const comparisonData = subjects.map(([subjectName, subjectData]) => ({
    subject: subjectName,
    accuracy: subjectData.subjectStats.averageAccuracy,
    completion: (subjectData.subjectStats.conceptsCompleted / subjectData.subjectStats.totalConcepts) * 100,
    timeSpent: subjectData.subjectStats.totalTimeSpent / 3600, // Convert to hours
    conceptsCompleted: subjectData.subjectStats.conceptsCompleted,
    totalConcepts: subjectData.subjectStats.totalConcepts
  }));

  // Find strongest and weakest subjects
  const sortedByAccuracy = [...comparisonData].sort((a, b) => b.accuracy - a.accuracy);
  const strongestSubject = sortedByAccuracy[0];
  const weakestSubject = sortedByAccuracy[sortedByAccuracy.length - 1];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subject Performance Comparison</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">Compare across subjects</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main comparison chart */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Performance Overview
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    data={comparisonData.map(item => ({
                      metric: item.subject,
                      value: item.accuracy
                    }))}
                  >
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    />
                    <Radar
                      name="Accuracy"
                      dataKey="value"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Accuracy by Subject
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={comparisonData} 
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="subject" 
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="accuracy" name="Accuracy">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSubjectColor(entry.subject, index)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            {/* Strongest Subject */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Strongest Subject
                </h3>
              </div>
              <p className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                {strongestSubject.subject}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {Math.round(strongestSubject.accuracy)}% accuracy
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {strongestSubject.conceptsCompleted} of {strongestSubject.totalConcepts} concepts completed
              </p>
            </div>

            {/* Weakest Subject */}
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Needs Attention
                </h3>
              </div>
              <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                {weakestSubject.subject}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {Math.round(weakestSubject.accuracy)}% accuracy
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Recommendation: Review key concepts
              </p>
            </div>

            {/* Overall Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[var(--foreground)]">
                Overall Statistics
              </h4>
              
              <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Average Accuracy
                  </span>
                  <Award className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {Math.round(
                    comparisonData.reduce((sum, s) => sum + s.accuracy, 0) / comparisonData.length
                  )}%
                </p>
              </div>

              <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Total Study Time
                  </span>
                  <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                </div>
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {Math.round(
                    comparisonData.reduce((sum, s) => sum + s.timeSpent, 0)
                  )}h
                </p>
              </div>

              <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Total Concepts
                  </span>
                  <Target className="w-4 h-4 text-[var(--warning)]" />
                </div>
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {comparisonData.reduce((sum, s) => sum + s.totalConcepts, 0)}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Recommendations
              </h4>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {weakestSubject.accuracy < 60 && (
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠</span>
                    <span>Focus on {weakestSubject.subject} - your weakest area</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">💡</span>
                  <span>Maintain {strongestSubject.subject} momentum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">🎯</span>
                  <span>Balance time across all subjects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}