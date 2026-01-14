'use client';

import React from 'react';

const MapNodeSkeleton = () => {
  return (
    <div className="w-full h-[600px] bg-[var(--accent)] animate-pulse rounded-xl flex items-center justify-center border border-[var(--border)]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <div className="text-[var(--muted-foreground)] font-medium">Loading Knowledge Graph...</div>
      </div>
    </div>
  );
};

export default MapNodeSkeleton;
