'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  classNum: number;
  subject: string;
  chapter: string;
  conceptTitle: string;
}

const LearningBreadcrumb: React.FC<BreadcrumbProps> = ({
  classNum,
  subject,
  chapter,
  conceptTitle,
}) => {
  return (
    <nav className="flex items-center text-sm font-medium overflow-hidden whitespace-nowrap">
      <Link 
        href="/dashboard"
        className="text-gray-400 hover:text-[var(--primary)] transition-colors hidden md:block"
      >
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-300 mx-1 hidden md:block" />
      
      <Link 
        href="/learn"
        className="text-gray-400 hover:text-[var(--primary)] transition-colors"
      >
        Learn
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
      
      <span className="text-gray-400 hidden sm:block">Class {classNum}</span>
      <ChevronRight className="w-4 h-4 text-gray-300 mx-1 hidden sm:block" />
      
      <span className="text-gray-400 truncate max-w-[100px] md:max-w-none">{subject}</span>
      <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
      
      <span className="text-[var(--primary)] truncate font-semibold">{chapter}</span>
    </nav>
  );
};

export default LearningBreadcrumb;
