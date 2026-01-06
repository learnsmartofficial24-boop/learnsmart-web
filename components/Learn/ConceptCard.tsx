'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Sparkles, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Concept } from '@/lib/concepts';
import { Button } from '@/components/ui';
import { explainConcept } from '@/lib/gemini';

interface ConceptCardProps {
  concept: Concept;
  onNext?: () => void;
  onPractice?: () => void;
  isCompleted?: boolean;
}

const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  onNext,
  onPractice,
  isCompleted
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const IconComponent = (LucideIcons as any)[concept.icon] || LucideIcons.BookOpen;

  const handleAskSmarty = async () => {
    if (aiExplanation) return;
    setIsLoadingAi(true);
    try {
      const explanation = await explainConcept(concept.title, concept.subject, concept.class);
      setAiExplanation(explanation);
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      {/* Header with Icon */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
              <IconComponent className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--primary)] uppercase tracking-wider">Concept</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{concept.title}</h2>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-500 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Completed
            </div>
          )}
        </div>

        {/* Overview */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {concept.overview}
          </p>
        </div>

        {/* Key Points */}
        <div className="mb-8 p-6 bg-[var(--primary)]/[0.03] dark:bg-[var(--primary)]/[0.02] rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full" />
            Key Points
          </h3>
          <ul className="grid gap-3">
            {concept.keyPoints.map((point, index) => (
              <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                  {index + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Definition */}
        <div className="mb-8 border-l-4 border-[var(--primary)] pl-6 py-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--primary)] mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Definition
          </h3>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200 italic">
            "{concept.definition}"
          </p>
        </div>

        {/* Related Concepts */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Related Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {concept.relatedConcepts.map((item) => (
              <span 
                key={item}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* AI Explanation Section */}
        {aiExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
              AI Deep Dive
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-purple-900/80 dark:text-purple-300/80">
              {aiExplanation.split('\n').map((para, i) => (
                <p key={i} className="mb-2">{para}</p>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <Button
            onClick={handleAskSmarty}
            disabled={isLoadingAi}
            variant="outline"
            className="bg-white dark:bg-gray-900 border-purple-200 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            {isLoadingAi ? (
              <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {aiExplanation ? 'AI Insight Loaded' : 'Ask Smarty'}
          </Button>
          <Button
            onClick={onPractice}
            variant="outline"
            className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5"
          >
            Practice Problems
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={onNext}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-8"
          >
            Next Concept
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConceptCard;
