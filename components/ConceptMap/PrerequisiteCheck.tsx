'use client';

import React from 'react';
import { checkPrerequisites } from '@/lib/conceptRelationships';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  conceptId: string;
  completedConcepts: string[];
  className?: string;
}

const PrerequisiteCheck: React.FC<Props> = ({ conceptId, completedConcepts, className }) => {
  const { met, missing } = checkPrerequisites(conceptId, completedConcepts);

  if (met) {
    return (
      <div className={cn("flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium", className)}>
        <CheckCircle2 size={18} />
        <span>All prerequisites met</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
        <Lock size={18} />
        <span>Prerequisites required</span>
      </div>
      
      <div className="space-y-2">
        {missing.map((concept) => (
          <div 
            key={concept}
            className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-300"
          >
            <AlertCircle size={14} />
            {concept}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrerequisiteCheck;
