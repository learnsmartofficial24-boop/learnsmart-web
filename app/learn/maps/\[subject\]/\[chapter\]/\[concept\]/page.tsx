'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Play, CheckCircle2, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function ConceptDetailPage() {
  const params = useParams();
  const subject = params.subject as string;
  const chapter = params.chapter as string;
  const concept = params.concept as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href={`/learn/maps/${subject}/${chapter}`}
        className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to {chapter.replace(/-/g, ' ')} Map
      </Link>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">{subject}</Badge>
                <Badge variant="outline" className="capitalize">{chapter.replace(/-/g, ' ')}</Badge>
              </div>
              <h1 className="text-3xl font-bold capitalize">{concept.replace(/-/g, ' ')}</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Mastery Level</div>
              <Badge variant="primary" className="text-sm px-3 py-1">In Progress</Badge>
            </div>
          </div>

          <p className="text-[var(--muted-foreground)] text-lg mb-8 leading-relaxed">
            This is a detailed overview of the concept. It would normally include a rich description, 
            key learning objectives, and why this concept is important in the context of {chapter.replace(/-/g, ' ')}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-[var(--accent)] border-none">
              <div className="flex items-center gap-3 mb-1">
                <Clock className="text-blue-500" size={20} />
                <span className="text-sm font-semibold">Time Spent</span>
              </div>
              <div className="text-xl font-bold">45m</div>
            </Card>
            <Card className="p-4 bg-[var(--accent)] border-none">
              <div className="flex items-center gap-3 mb-1">
                <Award className="text-emerald-500" size={20} />
                <span className="text-sm font-semibold">Best Score</span>
              </div>
              <div className="text-xl font-bold">85%</div>
            </Card>
            <Card className="p-4 bg-[var(--accent)] border-none">
              <div className="flex items-center gap-3 mb-1">
                <CheckCircle2 className="text-purple-500" size={20} />
                <span className="text-sm font-semibold">Attempts</span>
              </div>
              <div className="text-xl font-bold">3</div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 gap-2 h-12 text-lg">
              <BookOpen size={20} />
              Continue Learning
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-12 text-lg">
              <Play size={20} />
              Practice Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
