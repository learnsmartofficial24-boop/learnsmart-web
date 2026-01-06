'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, MessageCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/Navigation/ThemeToggle';
import ChapterBrowser from '@/components/Learn/ChapterBrowser';
import ConceptCard from '@/components/Learn/ConceptCard';
import LearningBreadcrumb from '@/components/Learn/LearningBreadcrumb';
import ProgressIndicator from '@/components/Learn/ProgressIndicator';
import ConceptNavigation from '@/components/Learn/ConceptNavigation';
import { getConceptsByChapter, Concept } from '@/lib/concepts';
import { useLearningStore } from '@/store/learningStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const classNum = parseInt(params.class as string);
  const subject = decodeURIComponent(params.subject as string);
  const chapter = decodeURIComponent(params.chapter as string);

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setCurrentConcept, markConceptCompleted, getProgress } = useLearningStore();

  useEffect(() => {
    const fetchedConcepts = getConceptsByChapter(classNum, subject, chapter);
    setConcepts(fetchedConcepts);
    
    // Load progress
    const progress = getProgress(classNum, subject, chapter);
    if (progress && fetchedConcepts.length > 0) {
      const savedIndex = fetchedConcepts.findIndex(c => c.id === progress.currentConceptId);
      if (savedIndex !== -1) {
        setCurrentIndex(savedIndex);
      }
    }
    setIsLoading(false);
  }, [classNum, subject, chapter, getProgress]);

  useEffect(() => {
    if (concepts.length > 0 && concepts[currentIndex]) {
      setCurrentConcept(classNum, subject, chapter, concepts[currentIndex].id);
    }
  }, [currentIndex, concepts, classNum, subject, chapter, setCurrentConcept]);

  const handleNext = () => {
    if (currentIndex < concepts.length - 1) {
      markConceptCompleted(classNum, subject, chapter, concepts[currentIndex].id);
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      markConceptCompleted(classNum, subject, chapter, concepts[currentIndex].id);
      // Maybe navigate to practice?
      router.push(`/practice/${classNum}/${subject}/${chapter}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentConcept = concepts[currentIndex];
  const progressPercent = concepts.length > 0 ? ((currentIndex + 1) / concepts.length) * 100 : 0;

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!currentConcept) return <div className="flex items-center justify-center min-h-screen">Concept not found</div>;

  return (
    <div className="min-h-screen bg-[#F5F1EB] dark:bg-[#0F1419] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-80 fixed inset-y-0 left-0 z-40">
        <ChapterBrowser 
          currentClass={classNum} 
          currentSubject={subject} 
          currentChapter={chapter} 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
            >
              <ChapterBrowser 
                currentClass={classNum} 
                currentSubject={subject} 
                currentChapter={chapter} 
              />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-[-48px] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 transition-all duration-300">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            <div className="flex-1 flex justify-center px-4">
              <LearningBreadcrumb 
                classNum={classNum}
                subject={subject}
                chapter={chapter}
                conceptTitle={currentConcept.title}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Progress Bar in Header */}
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-[var(--primary)]"
            />
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{chapter}</h1>
              <p className="text-gray-500 dark:text-gray-400">Class {classNum} • {subject}</p>
            </div>
            <ProgressIndicator 
              current={currentIndex + 1}
              total={concepts.length}
              percentage={progressPercent}
            />
          </div>

          <ConceptCard 
            concept={currentConcept}
            onNext={handleNext}
            onPractice={() => router.push(`/practice/${classNum}/${subject}/${chapter}`)}
          />

          {/* Navigation Controls */}
          <ConceptNavigation 
            onPrev={handlePrev}
            onNext={handleNext}
            onPractice={() => router.push(`/practice/${classNum}/${subject}/${chapter}`)}
            isFirst={currentIndex === 0}
            isLast={currentIndex === concepts.length - 1}
          />
        </div>
      </main>

      {/* Floating AI Button */}
      <button className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 bg-[var(--primary)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-50 group">
        <Sparkles className="w-6 h-6 group-hover:hidden" />
        <MessageCircle className="w-6 h-6 hidden group-hover:block" />
        <div className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Smarty
        </div>
      </button>
    </div>
  );
}
