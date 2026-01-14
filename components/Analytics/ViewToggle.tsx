'use client';

import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Layout } from 'lucide-react';
import type { ChartViewType } from '@/lib/types';

interface ViewToggleProps {
  currentView: ChartViewType;
  onViewChange: (view: ChartViewType) => void;
  className?: string;
}

export function ViewToggle({ currentView, onViewChange, className = '' }: ViewToggleProps) {
  const views: { value: ChartViewType; label: string; icon: React.ReactNode }[] = [
    { value: 'line', label: 'Line', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M19 9l-5 4-3-4-2 4"/></svg> },
    { value: 'bar', label: 'Bar', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><rect x="6" y="11" width="4" height="7"/><rect x="14" y="7" width="4" height="11"/></svg> },
    { value: 'pie', label: 'Pie', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
    { value: 'radar', label: 'Radar', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,8 18,18 8,22 2,12 6,2 16,6"/></svg> }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-[var(--muted-foreground)]">View:</span>
      <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
        {views.map((view) => (
          <Button
            key={view.value}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(view.value)}
            className={`
              h-8 px-3 gap-2
              ${currentView === view.value 
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90' 
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }
            `}
          >
            {view.icon}
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface LayoutToggleProps {
  currentLayout: 'grid' | 'list' | 'full';
  onLayoutChange: (layout: 'grid' | 'list' | 'full') => void;
  className?: string;
}

export function LayoutToggle({ currentLayout, onLayoutChange, className = '' }: LayoutToggleProps) {
  const layouts = [
    { value: 'grid', label: 'Grid', icon: <Layout className="w-4 h-4" /> },
    { value: 'list', label: 'List', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3" y2="6"/><line x1="3" y1="12" x2="3" y2="12"/><line x1="3" y1="18" x2="3" y2="18"/></svg> },
    { value: 'full', label: 'Full', icon: <Monitor className="w-4 h-4" /> }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg p-1">
        {layouts.map((layout) => (
          <Button
            key={layout.value}
            variant="ghost"
            size="sm"
            onClick={() => onLayoutChange(layout.value as any)}
            className={`
              h-8 px-3 gap-2
              ${currentLayout === layout.value 
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90' 
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }
            `}
          >
            {layout.icon}
            <span className="hidden md:inline">{layout.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void;
  className?: string;
}

export function ExportButton({ onExport, className = '' }: ExportButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowOptions(!showOptions)}
        className="h-8 px-3"
      >
        ↓ Export
      </Button>
      
      {showOptions && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute right-0 top-10 z-50 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg p-2 min-w-[120px]">
            <button
              onClick={() => {
                onExport('csv');
                setShowOptions(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] rounded transition-colors"
            >
              Export as CSV
            </button>
            <button
              onClick={() => {
                onExport('pdf');
                setShowOptions(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] rounded transition-colors"
            >
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}