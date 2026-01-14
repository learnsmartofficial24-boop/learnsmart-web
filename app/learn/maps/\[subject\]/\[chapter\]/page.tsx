'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import ConceptMapViewer from '@/components/ConceptMap/ConceptMapViewer';
import LearningPathViewer from '@/components/ConceptMap/LearningPathViewer';
import { MasteryLevel, ConceptNode, ConceptEdge } from '@/lib/types';
import { generateAdaptivePath } from '@/lib/adaptivePathGenerator';
import { ArrowLeft, Share2, Download, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ChapterMapPage() {
  const params = useParams();
  const subject = params.subject as string;
  const chapter = params.chapter as string;

  // Mock data for the map
  const nodes: ConceptNode[] = useMemo(() => [
    {
      id: '1',
      label: 'Chloroplasts',
      type: 'concept',
      masteryLevel: MasteryLevel.Competent,
      progressPercentage: 75,
      subject: subject,
      chapter: chapter,
      description: 'The organelles responsible for photosynthesis in plant cells.'
    },
    {
      id: '2',
      label: 'Light Reactions',
      type: 'concept',
      masteryLevel: MasteryLevel.InProgress,
      progressPercentage: 40,
      subject: subject,
      chapter: chapter,
      description: 'The first stage of photosynthesis where solar energy is converted into chemical energy.'
    },
    {
      id: '3',
      label: 'Photosynthesis',
      type: 'concept',
      masteryLevel: MasteryLevel.NotStarted,
      progressPercentage: 0,
      subject: subject,
      chapter: chapter,
      description: 'The process by which green plants and some other organisms use sunlight to synthesize foods.'
    },
    {
      id: '4',
      label: 'Dark Reactions',
      type: 'concept',
      masteryLevel: MasteryLevel.NotStarted,
      progressPercentage: 0,
      subject: subject,
      chapter: chapter,
      description: 'The second stage of photosynthesis that uses the energy from light reactions to produce glucose.'
    }
  ], [subject, chapter]);

  const edges: ConceptEdge[] = [
    { source: '1', target: '3', type: 'prerequisite' as any },
    { source: '2', target: '3', type: 'prerequisite' as any },
    { source: '2', target: '4', type: 'enables' as any },
    { source: '3', target: '4', type: 'related' as any }
  ];

  const learningPath = useMemo(() => 
    generateAdaptivePath(subject, nodes, ['1']), 
    [subject, nodes]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <Link 
            href="/learn/maps"
            className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            Back to Hub
          </Link>
          <h1 className="text-3xl font-bold capitalize">{chapter.replace(/-/g, ' ')}</h1>
          <p className="text-[var(--muted-foreground)] capitalize">{subject} Knowledge Graph</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 size={16} />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ConceptMapViewer nodes={nodes} edges={edges} />
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Concepts are color-coded by your mastery level. Double-click any node to jump directly to its study materials and quizzes.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <LearningPathViewer path={learningPath} nodes={nodes} />
        </div>
      </div>
    </div>
  );
}
