'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ConceptCardSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden p-8 animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded" />
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800/50 rounded" />
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl mb-8 space-y-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      <div className="border-l-4 border-gray-200 dark:border-gray-800 pl-6 py-2 mb-8 space-y-2">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="ml-auto h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
};

export default ConceptCardSkeleton;
