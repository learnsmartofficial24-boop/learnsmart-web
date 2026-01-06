'use client';

import React from 'react';
import { PageContainer } from '@/components/Layout/PageContainer';
import ChapterBrowser from '@/components/Learn/ChapterBrowser';
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';

export default function LearnPage() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Area */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <GraduationCap className="w-10 h-10 text-[var(--primary)]" />
                Learning Hub
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Choose a chapter from the browser to start your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Concept-Focused</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  We break down complex topics into bite-sized, easy-to-understand concepts.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Get instant explanations and answers from Smarty, your personal AI study buddy.
                </p>
              </div>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary)]/20 to-sage-500/10 flex items-center justify-center border border-dashed border-[var(--primary)]/30">
              <div className="text-center">
                <p className="text-[var(--primary)] font-medium mb-2">Select a chapter to begin</p>
                <p className="text-sm text-gray-400">Your progress will be saved automatically</p>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl h-[calc(100vh-12rem)]">
              <ChapterBrowser />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
