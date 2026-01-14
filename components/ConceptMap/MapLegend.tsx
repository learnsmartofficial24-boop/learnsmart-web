'use client';

import React from 'react';

const MapLegend = () => {
  return (
    <div className="absolute bottom-4 left-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-w-xs">
      <h4 className="text-sm font-semibold mb-2">Legend</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs">Master</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs">Competent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span className="text-xs">Not Started</span>
        </div>
        <hr className="my-2 border-[var(--border)]" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[var(--border)]" />
          <span className="text-xs">Prerequisite / Related</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
