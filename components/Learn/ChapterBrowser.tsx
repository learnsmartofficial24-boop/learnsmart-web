'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, BookOpen, GraduationCap, Beaker } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ChapterBrowserProps {
  currentClass?: number;
  currentSubject?: string;
  currentChapter?: string;
}

const curriculumData = {
  classes: [
    { id: 10, name: 'Class 10', subjects: ['Science', 'Maths', 'Social Science'] },
    { id: 11, name: 'Class 11', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { id: 12, name: 'Class 12', subjects: ['Physics', 'Chemistry', 'Biology'] },
  ],
  chapters: {
    '10-Science': ['Heredity', 'Life Processes', 'Control and Coordination'],
    '10-Maths': ['Real Numbers', 'Polynomials'],
    '11-Physics': ['Physical World', 'Units and Measurements'],
  } as Record<string, string[]>
};

const ChapterBrowser: React.FC<ChapterBrowserProps> = ({
  currentClass,
  currentSubject,
  currentChapter,
}) => {
  const [expandedClass, setExpandedClass] = useState<number | null>(currentClass || 10);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(currentSubject || null);

  return (
    <div className="w-full h-full bg-[#1F2933] text-white p-4 overflow-y-auto border-r border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--primary)]">
        <GraduationCap className="w-6 h-6" />
        Curriculum
      </h2>

      <div className="space-y-4">
        {curriculumData.classes.map((cls) => (
          <div key={cls.id} className="space-y-2">
            <button
              onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-lg transition-colors",
                expandedClass === cls.id ? "bg-gray-800 text-[var(--primary)]" : "hover:bg-gray-800/50"
              )}
            >
              <span className="font-medium">{cls.name}</span>
              {expandedClass === cls.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {expandedClass === cls.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-4 space-y-2 overflow-hidden"
                >
                  {cls.subjects.map((subject) => (
                    <div key={subject} className="space-y-1">
                      <button
                        onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors",
                          expandedSubject === subject || currentSubject === subject 
                            ? "text-[var(--primary)]" 
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Beaker className="w-3 h-3" />
                          {subject}
                        </div>
                        {expandedSubject === subject ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>

                      <AnimatePresence>
                        {(expandedSubject === subject || (currentClass === cls.id && currentSubject === subject)) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-6 space-y-1 overflow-hidden"
                          >
                            {(curriculumData.chapters[`${cls.id}-${subject}`] || []).map((chapter) => (
                              <Link
                                key={chapter}
                                href={`/learn/${cls.id}/${subject}/${chapter}`}
                                className={cn(
                                  "block p-2 rounded-lg text-xs transition-colors",
                                  currentChapter === chapter
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                    : "text-gray-500 hover:text-gray-300"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-3 h-3" />
                                  {chapter}
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterBrowser;
