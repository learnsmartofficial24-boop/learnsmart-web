'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Search, Filter } from 'lucide-react';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}

const MapControls: React.FC<Props> = ({ onZoomIn, onZoomOut, onCenter }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <div className="flex flex-col bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
        <button 
          onClick={onZoomIn}
          className="p-2 hover:bg-[var(--accent)] transition-colors border-b border-[var(--border)]"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={onZoomOut}
          className="p-2 hover:bg-[var(--accent)] transition-colors border-b border-[var(--border)]"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={onCenter}
          className="p-2 hover:bg-[var(--accent)] transition-colors"
          title="Fit View"
        >
          <Maximize size={20} />
        </button>
      </div>
      
      <div className="flex flex-col bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
        <button className="p-2 hover:bg-[var(--accent)] transition-colors border-b border-[var(--border)]">
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-[var(--accent)] transition-colors">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
};

export default MapControls;
