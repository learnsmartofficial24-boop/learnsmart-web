'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { ArrowLeft, ArrowRight, PenTool } from 'lucide-react';

interface ConceptNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onPractice: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ConceptNavigation: React.FC<ConceptNavigationProps> = ({
  onPrev,
  onNext,
  onPractice,
  isFirst,
  isLast,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 py-8 border-t border-gray-100 dark:border-gray-800">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirst}
        className="w-full sm:w-auto border-gray-200 dark:border-gray-700 h-12 px-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous Concept
      </Button>

      <Button
        variant="ghost"
        onClick={onPractice}
        className="text-[var(--primary)] hover:text-[var(--primary)]/80 hover:bg-[var(--primary)]/5"
      >
        <PenTool className="w-4 h-4 mr-2" />
        Ready to Practice?
      </Button>

      <Button
        onClick={onNext}
        className="w-full sm:w-auto bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 h-12 px-8"
      >
        {isLast ? 'Finish Chapter' : 'Next Concept'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default ConceptNavigation;
