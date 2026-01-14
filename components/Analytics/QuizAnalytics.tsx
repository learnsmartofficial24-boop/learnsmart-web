'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { QuizPerformance } from '@/lib/types';

interface QuizAnalyticsProps {
  quizPerformance: QuizPerformance;
  className?: string;
}

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return '#22c55e'; // green
    case 'Medium': return '#eab308'; // yellow
    case 'Hard': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
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

export function QuizAnalytics({ quizPerformance, className = '' }: QuizAnalyticsProps) {
  if (!quizPerformance || quizPerformance.totalQuizzes === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Quiz Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
            No quiz data available. Take your first quiz to see analytics!
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceData = [
    { 
      Difficulty: 'Easy', 
      Count: quizPerformance.performanceByDifficulty.easy.count,
      Average: quizPerformance.performanceByDifficulty.easy.averageScore
    },
    { 
      Difficulty: 'Medium', 
      Count: quizPerformance.performanceByDifficulty.medium.count,
      Average: quizPerformance.performanceByDifficulty.medium.averageScore
    },
    { 
      Difficulty: 'Hard', 
      Count: quizPerformance.performanceByDifficulty.hard.count,
      Average: quizPerformance.performanceByDifficulty.hard.averageScore
    }
  ];

  const pieData = performanceData.filter(item => item.Count > 0).map(item => ({
    name: item.Difficulty,
    value: item.Count
  }));

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Overview Stats */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                  <Trophy className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Total Quizzes</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{quizPerformance.totalQuizzes}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <div className="p-2 bg-[var(--success)] bg-opacity-10 rounded-lg">
                  <Target className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Average Score</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {Math.round(quizPerformance.averageScore)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <div className="p-2 bg-[var(--warning)] bg-opacity-10 rounded-lg">
                  <Clock className="w-5 h-5 text-[var(--warning)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Total Time</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {formatTime(quizPerformance.timeSpent)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <div className="p-2 bg-[var(--primary)] bg-opacity-10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Accuracy</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">
                    {Math.round(quizPerformance.accuracy)}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* Performance by Difficulty */}
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">Performance by Difficulty</h4>
              <div className="space-y-3">
                {performanceData.map((data) => (
                  <div key={data.Difficulty}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getDifficultyColor(data.Difficulty) }}
                        />
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {data.Difficulty}
                        </span>
                      </div>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {data.Count} quiz{data.Count !== 1 ? 'zes' : ''}
                      </span>
                    </div>
                    {data.Count > 0 && (
                      <>
                        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
                          <span>Average Score</span>
                          <span>{Math.round(data.Average)}%</span>
                        </div>
                        <div className="w-full bg-[var(--background)] border border-[var(--border)] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(data.Average, 100)}%`,
                              backgroundColor: getDifficultyColor(data.Difficulty)
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">Quiz Attempts Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">Performance Comparison</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={performanceData.filter(item => item.Count > 0)} 
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="Difficulty" 
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="Average" 
                      name="Average Score"
                      fillOpacity={0.7}
                      radius={[4, 4, 0, 0]}
                    >
                      {performanceData.filter(item => item.Count > 0).map((item, index) => (
                        <Cell key={`cell-${index}`} fill={getDifficultyColor(item.Difficulty)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Most Challenging Concepts */}
            {quizPerformance.mostChallengingConcepts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                  Concepts to Review
                </h4>
                <div className="space-y-2">
                  {quizPerformance.mostChallengingConcepts.map((concept, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-[var(--background)] rounded-lg border border-[var(--border)]"
                    >
                      <span className="text-sm text-[var(--foreground)]">{concept}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">Needs review</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Improvement Trend */}
        {quizPerformance.improvementTrend !== 0 && (
          <div className="mt-6 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp 
                className={`w-5 h-5 ${
                  quizPerformance.improvementTrend > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {quizPerformance.improvementTrend > 0 ? 'Improving' : 'Declining'} Performance
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Recent quizzes are {Math.abs(quizPerformance.improvementTrend).toFixed(0)}% {' '}
                  {quizPerformance.improvementTrend > 0 ? 'better' : 'worse'} than previous ones
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}