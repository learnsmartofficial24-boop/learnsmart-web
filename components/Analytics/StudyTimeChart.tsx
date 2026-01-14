'use client';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StudySession } from '@/lib/types';

interface StudyTimeChartProps {
  sessions: StudySession[];
  className?: string;
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatTime(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function StudyTimeChart({ sessions, className = '' }: StudyTimeChartProps) {
  const [view, setView] = useState<'daily' | 'cumulative'>('daily');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  if (!sessions || sessions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Study Time Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
            No study sessions recorded yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort sessions by date and limit to last 30 days
  const recentSessions = [...sessions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 30)
    .reverse();

  // Aggregate data by date
  const dailyData = recentSessions.map(session => ({
    date: formatDate(session.date),
    dateKey: session.date.toISOString().split('T')[0],
    studyTime: session.duration,
    xpEarned: session.xpEarned,
    quizTaken: session.quizTaken
  }));

  // Calculate cumulative data
  const cumulativeData = dailyData.map((point, index) => {
    const cumulative = dailyData.slice(0, index + 1).reduce((sum, p) => sum + p.studyTime, 0);
    return {
      ...point,
      cumulativeTime: cumulative
    };
  });

  const chartData = view === 'daily' ? dailyData : cumulativeData;
  const dataKey = view === 'daily' ? 'studyTime' : 'cumulativeTime';
  const valueLabel = view === 'daily' ? 'Daily Study Time' : 'Cumulative Study Time';

  // Calculate streak (consecutive days with study sessions)
  const calculateStreak = (): number => {
    if (!sessions.length) return 0;
    
    const sessionDates = sessions.map(s => s.date.toDateString());
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // Check if user studied today or yesterday for streak calculation
    const referenceDate = sessionDates.includes(today) ? today : yesterday;
    let streak = 0;
    let currentDate = new Date(referenceDate);
    
    while (sessionDates.includes(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const averageSessionDuration = totalStudyTime / sessions.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Study Time Patterns</CardTitle>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
              <Button
                variant={view === 'daily' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('daily')}
                className="h-8 px-3"
              >
                Daily
              </Button>
              <Button
                variant={view === 'cumulative' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('cumulative')}
                className="h-8 px-3"
              >
                Cumulative
              </Button>
            </div>
            
            <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
              <Button
                variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="h-8 px-3"
              >
                Bar
              </Button>
              <Button
                variant={chartType === 'line' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-8 px-3"
              >
                Line
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="text-center p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl font-bold text-[var(--primary)]">{streak}</div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Current Streak</div>
          </div>
          
          <div className="text-center p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl font-bold text-[var(--success)]">{formatTime(totalStudyTime)}</div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Total Study Time</div>
          </div>
          
          <div className="text-center p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl font-bold text-[var(--warning)]">{formatTime(averageSessionDuration)}</div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Avg per Session</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  interval="preserveEnd"
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatTime(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={dataKey} 
                  fill="var(--primary)"
                  fillOpacity={0.7}
                  name={valueLabel}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  interval="preserveEnd"
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatTime(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone"
                  dataKey={dataKey}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 2, fill: 'var(--primary)' }}
                  name={valueLabel}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}