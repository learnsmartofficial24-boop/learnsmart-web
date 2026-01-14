'use client';

import React, { useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConceptNode, ConceptEdge, MasteryLevel } from '@/lib/types';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import ConceptNodeDetail from './ConceptNodeDetail';
import { AnimatePresence } from 'framer-motion';

// Import react-force-graph-2d dynamically to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface Props {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
  onNodeClick?: (node: any) => void;
}

const ConceptMapViewer: React.FC<Props> = ({ nodes, edges, onNodeClick }) => {
  const fgRef = useRef<any>();
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);

  const graphData = useMemo(() => ({
    nodes: nodes.map(n => ({ ...n, id: n.id })),
    links: edges.map(e => ({ ...e, source: e.source, target: e.target }))
  }), [nodes, edges]);

  const getNodeColor = (node: ConceptNode) => {
    switch (node.masteryLevel) {
      case MasteryLevel.Master: return '#3b82f6'; // Blue
      case MasteryLevel.Competent: return '#10b981'; // Green
      case MasteryLevel.InProgress: return '#f59e0b'; // Yellow
      default: return '#94a3b8'; // Gray
    }
  };

  return (
    <div className="relative w-full h-[600px] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)] shadow-inner">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={n => getNodeColor(n as unknown as ConceptNode)}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.5);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          // Use standard rect if roundRect is not available, though it should be in modern browsers
          if (ctx.roundRect) {
            ctx.roundRect(
              node.x - bckgDimensions[0] / 2, 
              node.y - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1], 
              [4 / globalScale]
            );
          } else {
            ctx.rect(
              node.x - bckgDimensions[0] / 2, 
              node.y - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1]
            );
          }
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = getNodeColor(node as unknown as ConceptNode);
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions;
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
        }}
        onNodeClick={(node) => {
          setSelectedNode(node as ConceptNode);
          if (onNodeClick) onNodeClick(node);
        }}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => '#94a3b8'}
        cooldownTicks={100}
      />
      
      <MapControls 
        onZoomIn={() => fgRef.current?.zoom(fgRef.current?.zoom() * 1.2)}
        onZoomOut={() => fgRef.current?.zoom(fgRef.current?.zoom() * 0.8)}
        onCenter={() => fgRef.current?.centerAt(0, 0, 1000)}
      />
      
      <MapLegend />

      <AnimatePresence>
        {selectedNode && (
          <ConceptNodeDetail 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConceptMapViewer;
