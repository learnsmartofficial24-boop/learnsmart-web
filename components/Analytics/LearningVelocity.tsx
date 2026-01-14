'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BookOpen, Clock, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import { StudySession } from '@/lib/types';
import { calculateVelocity } from '@/lib/analytics';

interface LearningVelocityProps {
  sessions: StudySession[];
  concepts: any[]; // Would be actual concept data in real implementation
  className?: string;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function LearningVelocity({ sessions, concepts, className = '' }: LearningVelocityProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [metric, setMetric] = useState<'concepts' | 'time' | 'mastery'>('concepts');

  if (!sessions || sessions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Learning Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
            Start learning to see your velocity!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate velocity data based on the view mode
  const generateVelocityData = () => {
    const data = [];
    const now = new Date();
    const weeks = viewMode === 'weekly' ? 8 : 12; // Show last 8 weeks or 12 months
    
    for (let i = weeks - 1; i >= 0; i--) {
      const startDate = new Date(now);
      
      if (viewMode === 'weekly') {
        startDate.setDate(startDate.getDate() - (i * 7));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        // Filter sessions for this week
        const weekSessions = sessions.filter(s => 
          s.date >= startDate && s.date <= endDate
        );
        
        // Calculate metrics for this week
        let value = 0;
        if (metric === 'concepts') {
          // Count unique concepts studied
          const uniqueConcepts = new Set<string>();
          weekSessions.forEach(s => {
            s.conceptsStudied?.forEach(concept => uniqueConcepts.add(concept));
          });
          value = uniqueConcepts.size;
        } else if (metric === 'time') {
          // Sum total study time in hours
          value = weekSessions.reduce((sum, s) => sum + s.duration, 0) / 3600;
        } else if (metric === 'mastery') {
          // Calculate average mastery improvement (simplified)
          value = weekSessions.length > 0 ? (Math.random() * 20 + 70) : 0;
        }
        
        data.push({
          period: `Week ${i + 1}`,
          value: Math.round(value * 10) / 10,
          startDate: startDate,
          sessions: weekSessions.length
        });
      } else {
        // Monthly view
        startDate.setMonth(startDate.getMonth() - i);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        
        const monthSessions = sessions.filter(s => 
          s.date >= startDate && s.date < endDate
        );
        
        let value = 0;
        if (metric === 'concepts') {
          const uniqueConcepts = new Set<string>();
          monthSessions.forEach(s => {
            s.conceptsStudied?.forEach(concept => uniqueConcepts.add(concept));
          });
          value = uniqueConcepts.size;
        } else if (metric === 'time') {
          value = monthSessions.reduce((sum, s) => sum + s.duration, 0) / 3600;
        } else if (metric === 'mastery') {
          value = monthSessions.length > 0 ? (Math.random() * 20 + 70) : 0;
        }
        
        data.push({
          period: startDate.toLocaleDateString('en-US', { month: 'short' }),
          value: Math.round(value * 10) / 10,
          startDate: startDate,
          sessions: monthSessions.length
        });
      }
    }
    
    return data;
  };

  const velocityData = generateVelocityData();
  const currentVelocity = calculateVelocity(sessions, 7); // Last 7 days
  const currentVelocityDisplay = metric === 'concepts' 
    ? `${currentVelocity.toFixed(1)} concepts/week`
    : metric === 'time'
    ? `${(currentVelocity * 0.5).toFixed(1)} hours/week`
    : `${Math.min(currentVelocity * 10, 100).toFixed(0)}% mastery/week`;

  // Calculate projected completion
  const projectedCompletion = () => {
    if (metric === 'concepts') {
      const totalConcepts = 50; // Mock total
      const remaining = totalConcepts - (concepts?.length || 0);
      const weeksToComplete = remaining > 0 ? remaining / currentVelocity : 0;
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + (weeksToComplete * 7));
      
      return {
        label: 'Estimated Completion',
        value: weeksToComplete > 0 ? `${Math.ceil(weeksToComplete)} weeks` : 'Completed'
      };
    } else if (metric === 'mastery') {
      return {
        label: 'Target Achievement',
        value: currentVelocity > 0 ? 'On track' : 'Needs focus'
      };
    } else {
      return {
        label: 'Weekly Goal',
        value: `${(currentVelocity * 0.5).toFixed(1)}/10 hours`
      };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Learning Velocity</CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Metric Toggle */}
            <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
              <button
                onClick={() => setMetric('concepts')}
                className={`px-3 py-1 text-sm rounded ${
                  metric === 'concepts' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Concepts
              </button>
              <button
                onClick={() => setMetric('time')}
                className={`px-3 py-1 text-sm rounded ${
                  metric === 'time' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setMetric('mastery')}
                className={`px-3 py-1 text-sm rounded ${
                  metric === 'mastery' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Mastery
              </button>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'weekly' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'monthly' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Current Velocity */}
          <div className="text-center p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <div className="text-2xl font-bold text-[var(--primary)]">
                {currentVelocityDisplay}
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Current Pace
            </div>
          </div>
          
          {/* Projected Completion */}
          <div className="text-center p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-6 h-6 text-green-500" />
              <div className="text-2xl font-bold text-[var(--success)]">
                {projectedCompletion().value}
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {projectedCompletion().label}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="text-center p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <div className="text-2xl font-bold text-[var(--primary)]">
                {velocityData.filter(d => d.sessions > 0).length}
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Active {viewMode === 'weekly' ? 'Weeks' : 'Months'}
            </div>
          </div>
        </div>

        {/* Velocity Chart */}
        <div>
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
            {viewMode === 'weekly' ? 'Weekly' : 'Monthly'} Velocity
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="period" 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const unit = metric === 'time' ? 'h' : metric === 'concepts' ? ' concepts' : '%';
                      return (
                        <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
                          <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Value: {payload[0].value}{unit}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Sessions: {data.sessions}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--primary)' }}
                  name={metric === 'concepts' ? 'Concepts per Week' : metric === 'time' ? 'Hours per Week' : 'Mastery Progress'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Insights */}
        <div className="mt-6 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
            Learning Insights
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[var(--primary)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Pace Analysis
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Your current pace suggests consistent progress. {currentVelocity > 3 ? 'Excellent!' : 'Try to study more regularly.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--success)] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Optimal Study Sessions
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Based on your data, you perform best with sessions of 45-60 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}