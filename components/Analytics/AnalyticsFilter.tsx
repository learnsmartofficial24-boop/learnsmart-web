'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar, Filter } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/types';

interface AnalyticsFilterProps {
  filters: AnalyticsFilters;
  onFilterChange: (filters: Partial<AnalyticsFilters>) => void;
  className?: string;
}

export function AnalyticsFilter({ filters, onFilterChange, className = '' }: AnalyticsFilterProps) {
  const handleDateRangeChange = (value: AnalyticsFilters['dateRange']) => {
    onFilterChange({ dateRange: value });
  };

  const handleDifficultyChange = (value: AnalyticsFilters['difficulty']) => {
    onFilterChange({ difficulty: value });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: '30d' as const,
      subjects: 'all' as const,
      chapters: 'all' as const,
      difficulty: 'all' as const
    });
  };

  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
        <span className="text-sm font-medium text-[var(--foreground)]">Filters:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
        <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
        <SelectTrigger className="h-9 w-[120px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="h-8 px-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        Clear all
      </Button>
    </div>
  );
}

interface QuickFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function QuickFilterButton({ label, active, onClick }: QuickFilterButtonProps) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      className="h-8 px-3"
    >
      {label}
    </Button>
  );
}

export function QuickFilters({
  showAll = true,
  showGood = true,
  showNeedsWork = true,
  onFilterChange
}: {
  showAll?: boolean;
  showGood?: boolean;
  showNeedsWork?: boolean;
  onFilterChange: (filter: 'all' | 'good' | 'needs-work') => void;
}) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'good' | 'needs-work'>('all');

  const handleFilterClick = (filter: 'all' | 'good' | 'needs-work') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex items-center gap-2">
      {showAll && (
        <QuickFilterButton
          label="All"
          active={activeFilter === 'all'}
          onClick={() => handleFilterClick('all')}
        />
      )}
      {showGood && (
        <QuickFilterButton
          label="Good"
          active={activeFilter === 'good'}
          onClick={() => handleFilterClick('good')}
        />
      )}
      {showNeedsWork && (
        <QuickFilterButton
          label="Needs Work"
          active={activeFilter === 'needs-work'}
          onClick={() => handleFilterClick('needs-work')}
        />
      )}
    </div>
  );
}