'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Map as MapIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface MapInfo {
  id: string;
  subject: string;
  chapter?: string;
  conceptCount: number;
  completionPercentage: number;
  thumbnailColor: string;
}

const ConceptMapGallery = () => {
  const maps: MapInfo[] = [
    {
      id: 'photosynthesis',
      subject: 'Biology',
      chapter: 'Photosynthesis',
      conceptCount: 12,
      completionPercentage: 45,
      thumbnailColor: 'bg-emerald-500'
    },
    {
      id: 'mechanics',
      subject: 'Physics',
      chapter: 'Newtonian Mechanics',
      conceptCount: 15,
      completionPercentage: 10,
      thumbnailColor: 'bg-blue-500'
    },
    {
      id: 'chemical-bonding',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      conceptCount: 10,
      completionPercentage: 0,
      thumbnailColor: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {maps.map((map) => (
        <Card key={map.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-[var(--border)] bg-[var(--card)]">
          <div className={`h-32 ${map.thumbnailColor} opacity-20 relative flex items-center justify-center`}>
            <MapIcon size={48} className="text-[var(--foreground)] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent" />
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline">{map.subject}</Badge>
              <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                <BookOpen size={12} />
                {map.conceptCount} concepts
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{map.chapter}</h3>
            
            <div className="mt-4 mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--muted-foreground)]">Completion</span>
                <span>{map.completionPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary)] transition-all duration-500" 
                  style={{ width: `${map.completionPercentage}%` }} 
                />
              </div>
            </div>
            
            <Link href={`/learn/maps/${map.subject.toLowerCase()}/${map.id}`}>
              <Button className="w-full group/btn">
                View Map
                <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ConceptMapGallery;
