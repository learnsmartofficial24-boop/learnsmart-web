'use client';

import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { StatsCards } from './StatsCards';
import { PerformanceChart } from './PerformanceChart';
import { ConceptMasteryGrid } from './ConceptMasteryGrid';
import { StudyTimeChart } from './StudyTimeChart';
import { QuizAnalytics } from './QuizAnalytics';
import { ActivityFeed } from './ActivityFeed';
import { InsightsPanel } from './InsightCard';
import { AnalyticsFilter } from './AnalyticsFilter';
import { ViewToggle, LayoutToggle } from './ViewToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalyticsDashboard() {
  const {
    learningMetrics,
    quizPerformance,
    conceptProgress,
    studySessions,
    progressTrends,
    insights,
    filters,
    updateAnalytics,
    setFilters,
    calculateConceptMastery,
    calculateTrends,
    generateInsights
  } = useAnalyticsStore();

  const [isLoading, setIsLoading] = useState(true);
  const [chartView, setChartView] = useState<'line' | 'area'>('line');
  const [dashboardLayout, setDashboardLayout] = useState<'grid' | 'list' | 'full'>('grid');

  useEffect(() => {
    // Simulate loading and update analytics
    const loadAnalytics = async () => {
      setIsLoading(true);
      // Update all analytics data
      updateAnalytics();
      calculateTrends();
      generateInsights();
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    };

    loadAnalytics();
  }, []);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    // Re-generate trends and insights based on new filters
    setTimeout(() => {
      calculateTrends();
      generateInsights();
    }, 100);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    updateAnalytics();
    calculateTrends();
    generateInsights();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Simulate export functionality
    const timestamp = new Date().toISOString().split('T')[0];
    const data = {
      learningMetrics,
      quizPerformance,
      conceptProgress,
      studySessions,
      progressTrends,
      exportDate: timestamp
    };

    if (format === 'csv') {
      // Create CSV content
      const csvContent = generateCSV(data);
      downloadFile(csvContent, `learnsmart-analytics-${timestamp}.csv`, 'text/csv');
    } else {
      // Simulate PDF export
      alert('PDF export feature coming soon! For now, use Print to PDF in your browser.');
    }
  };

  const generateCSV = (data: any) => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total XP', data.learningMetrics.totalXP],
      ['Current Level', data.learningMetrics.currentLevel],
      ['Concepts Learned', data.learningMetrics.conceptsLearned],
      ['Quiz Accuracy', `${Math.round(data.learningMetrics.quizAccuracy)}%`],
      ['Current Streak', `${data.learningMetrics.currentStreak} days`],
      ['Total Study Time', formatDuration(data.learningMetrics.totalStudyTime)],
      ['Total Quizzes', data.quizPerformance.totalQuizzes],
      ['Average Quiz Score', `${Math.round(data.quizPerformance.averageScore)}%`]
    ];

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-[var(--muted-foreground)]">
              <RefreshCw className="w-8 h-8 animate-spin mb-4" />
              <p>Loading your analytics...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Learning Analytics
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Track your progress and discover insights about your learning journey
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <AnalyticsFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 px-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('csv')}
            className="h-9 px-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatsCards metrics={learningMetrics} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart - takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <PerformanceChart 
            data={progressTrends} 
            viewType={chartView}
          />
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InsightsPanel insights={insights.slice(0, 2)} title="Top Insights" />
        </motion.div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Study Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StudyTimeChart sessions={studySessions} />
        </motion.div>

        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <QuizAnalytics quizPerformance={quizPerformance} />
        </motion.div>

        {/* Concept Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ConceptMasteryGrid 
            concepts={conceptProgress}
            onConceptClick={(conceptId) => {
              calculateConceptMastery();
            }}
          />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ActivityFeed sessions={studySessions.slice(0, 10)} />
        </motion.div>
      </div>

      {/* Full Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <InsightsPanel insights={insights} title="All Insights" />
      </motion.div>

      {/* View Controls */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <ViewToggle 
          currentView={chartView}
          onViewChange={setChartView}
        />
        <LayoutToggle
          currentLayout={dashboardLayout}
          onLayoutChange={setDashboardLayout}
        />
      </div>
    </div>
  );
}