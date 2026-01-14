'use client';

import React from 'react';
import { LearningPath, ConceptNode, MasteryLevel } from '@/lib/types';
import { CheckCircle2, Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Props {
  path: LearningPath;
  nodes: ConceptNode[];
  onConceptClick?: (conceptId: string) => void;
}

const LearningPathViewer: React.FC<Props> = ({ path, nodes, onConceptClick }) => {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1">{path.name}</h3>
        <p className="text-sm text-[var(--muted-foreground)]">{path.description}</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[var(--border)]" />
        
        <div className="space-y-6">
          {path.concepts.map((conceptId) => {
            const node = nodes.find(n => n.id === conceptId);
            if (!node) return null;

            const isCompleted = node.masteryLevel === MasteryLevel.Master || node.masteryLevel === MasteryLevel.Competent;
            const isCurrent = path.currentConceptId === conceptId;

            return (
              <div 
                key={conceptId}
                className={cn(
                  "relative flex gap-4 pl-10 transition-all duration-300 cursor-pointer group",
                  isCurrent ? "opacity-100" : "opacity-70 hover:opacity-100"
                )}
                onClick={() => onConceptClick?.(conceptId)}
              >
                {/* Status Icon */}
                <div className={cn(
                  "absolute left-0 w-8 h-8 rounded-full border-4 border-[var(--card)] flex items-center justify-center z-10 transition-colors",
                  isCompleted ? "bg-emerald-500" : isCurrent ? "bg-[var(--primary)]" : "bg-slate-300 group-hover:bg-slate-400"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : isCurrent ? (
                    <Play size={16} className="text-white fill-current" />
                  ) : (
                    <Circle size={16} className="text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={cn(
                        "text-sm font-semibold transition-colors",
                        isCurrent ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                      )}>
                        {node.label}
                      </h4>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                        {node.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <Button size="sm" className="h-8 py-0">
                        Study
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--muted-foreground)]">Path Progress</span>
          <span className="font-semibold">{Math.round(path.progress)}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--accent)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--primary)] transition-all duration-500" 
            style={{ width: `${path.progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default LearningPathViewer;
