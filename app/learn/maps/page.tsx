'use client';

import React from 'react';
import ConceptMapGallery from '@/components/ConceptMap/ConceptMapGallery';
import { Map as MapIcon, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function MapsHubPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[var(--primary)] text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <MapIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Concept Maps</h1>
            <p className="text-[var(--muted-foreground)]">Visualize your knowledge and master complex topics</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
            <Input className="pl-10 h-11" placeholder="Search for subjects, chapters or concepts..." />
          </div>
          <button className="flex items-center gap-2 px-4 h-11 bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--accent)] transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Knowledge Graphs</h2>
          <span className="text-sm text-[var(--muted-foreground)]">Showing 3 maps</span>
        </div>
        
        <ConceptMapGallery />
      </section>
    </div>
  );
}
