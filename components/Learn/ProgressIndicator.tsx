'use client';

import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  percentage: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  percentage,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-400">
          Concept <span className="text-gray-900 dark:text-white">{current}</span> of {total}
        </p>
        <p className="text-xs text-[var(--primary)] font-bold">{Math.round(percentage)}% Complete</p>
      </div>
      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden hidden sm:block">
        <div 
          className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
