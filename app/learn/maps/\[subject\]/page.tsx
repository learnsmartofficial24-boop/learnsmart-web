'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ConceptMapGallery from '@/components/ConceptMap/ConceptMapGallery';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SubjectMapsPage() {
  const params = useParams();
  const subject = params.subject as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <Link 
          href="/learn/maps"
          className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Hub
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--accent)] text-[var(--primary)] rounded-2xl">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold capitalize">{subject} Concept Maps</h1>
            <p className="text-[var(--muted-foreground)]">Explore knowledge graphs for all chapters in {subject}</p>
          </div>
        </div>
      </div>

      <ConceptMapGallery />
    </div>
  );
}
