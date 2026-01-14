import dagre from 'dagre';
import { ConceptNode, ConceptEdge } from './types';

export const getHierarchicalLayout = (nodes: ConceptNode[], edges: ConceptEdge[]) => {
  const g = new dagre.graphlib.Graph();
  
  // Set an object for the graph label
  g.setGraph({
    rankdir: 'TB', // Top to Bottom
    nodesep: 70,
    ranksep: 100
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  nodes.forEach(node => {
    // Providing default dimensions for dagre to calculate layout
    g.setNode(node.id, { width: 180, height: 60 });
  });

  // Add edges to the graph
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map(node => {
    const dagreNode = g.node(node.id);
    return {
      ...node,
      x: dagreNode.x,
      y: dagreNode.y
    };
  });
};

export const getRadialLayout = (nodes: ConceptNode[], edges: ConceptEdge[], centerX = 0, centerY = 0, radius = 300) => {
  const count = nodes.length;
  return nodes.map((node, index) => {
    const angle = (index / count) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
};
