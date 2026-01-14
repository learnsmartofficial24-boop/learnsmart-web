'use client';

import React from 'react';
import { ConceptNode, MasteryLevel } from '@/lib/types';
import { X, BookOpen, Play, CheckCircle2, Lock, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { conceptRelationships } from '@/lib/conceptRelationships';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  node: ConceptNode;
  onClose: () => void;
}

const ConceptNodeDetail: React.FC<Props> = ({ node, onClose }) => {
  const relationships = conceptRelationships[node.label] || conceptRelationships[node.id];

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute top-0 right-0 w-80 h-full bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-20 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-[var(--accent)] rounded-xl">
            <BookOpen className="text-[var(--primary)]" size={24} />
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[var(--accent)] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-bold mb-2">{node.label}</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">{node.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant={node.masteryLevel === MasteryLevel.Master ? 'primary' : 'outline'}>
            {node.masteryLevel}
          </Badge>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Clock size={12} />
            15m spent
          </Badge>
        </div>

        <div className="space-y-6">
          {relationships?.prerequisites && relationships.prerequisites.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Lock size={16} className="text-amber-500" />
                Prerequisites
              </h4>
              <div className="space-y-2">
                {relationships.prerequisites.map(p => (
                  <div key={p} className="flex items-center gap-2 text-xs p-2 bg-[var(--background)] rounded border border-[var(--border)]">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {relationships?.enables && relationships.enables.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Play size={16} className="text-blue-500" />
                Unlocks
              </h4>
              <div className="space-y-2">
                {relationships.enables.map(e => (
                  <div key={e} className="text-xs p-2 bg-[var(--background)] rounded border border-[var(--border)]">
                    {e}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <Button className="w-full gap-2">
            <BookOpen size={18} />
            Study Concept
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Play size={18} />
            Take Quiz
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConceptNodeDetail;
