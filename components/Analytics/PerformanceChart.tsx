'use client';

import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressTrend } from '@/lib/types';

interface PerformanceChartProps {
  data: ProgressTrend[];
  viewType?: 'line' | 'area';
  className?: string;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--background)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-[var(--foreground)]">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value ? Math.round(entry.value) : 0}
            {entry.name.includes('%') || entry.name === 'Accuracy' || entry.name === 'Quiz Score' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ data, viewType = 'line', className = '' }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
            No performance data available yet. Start learning to see your progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate moving average for smoother trend line
  const dataWithMovingAvg = data.map((point, index) => {
    const windowSize = Math.min(7, index + 1);
    const start = Math.max(0, index - windowSize + 1);
    const window = data.slice(start, index + 1);
    const avgAccuracy = window.reduce((sum, p) => sum + p.accuracy, 0) / window.length;
    
    return {
      ...point,
      movingAvg: avgAccuracy,
      formattedDate: formatDate(point.date)
    };
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Trends</CardTitle>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
            <span>Accuracy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--success)]"></div>
            <span>Moving Average</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'area' ? (
              <AreaChart data={dataWithMovingAvg} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
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
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--primary)" 
                  fill="var(--primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Accuracy"
                />
                <Area 
                  type="monotone" 
                  dataKey="movingAvg" 
                  stroke="var(--success)" 
                  fill="var(--success)"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  name="7-Day Average"
                />
              </AreaChart>
            ) : (
              <LineChart data={dataWithMovingAvg} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
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
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                  name="Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAvg" 
                  stroke="var(--success)" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="7-Day Average"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}