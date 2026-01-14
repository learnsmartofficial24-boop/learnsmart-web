import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConceptNode, ConceptEdge, ConceptMap, LearningPath, MasteryLevel } from '@/lib/types';

interface ConceptMapState {
  conceptMaps: Record<string, ConceptMap>; // key: subject-chapter or just subject
  learningPaths: Record<string, LearningPath>;
  bookmarkedConcepts: string[];
  expandedSections: string[];
  conceptTimeSpent: Record<string, number>; // conceptId -> seconds
  
  // Actions
  setConceptMap: (id: string, map: ConceptMap) => void;
  updateNodeProgress: (conceptId: string, progress: number, mastery: MasteryLevel) => void;
  toggleBookmark: (conceptId: string) => void;
  toggleSection: (sectionId: string) => void;
  addTimeSpent: (conceptId: string, seconds: number) => void;
  setLearningPath: (id: string, path: LearningPath) => void;
}

export const useConceptMapStore = create<ConceptMapState>()(
  persist(
    (set) => ({
      conceptMaps: {},
      learningPaths: {},
      bookmarkedConcepts: [],
      expandedSections: [],
      conceptTimeSpent: {},

      setConceptMap: (id, map) =>
        set((state) => ({
          conceptMaps: { ...state.conceptMaps, [id]: map },
        })),

      updateNodeProgress: (conceptId, progress, mastery) =>
        set((state) => {
          const newMaps = { ...state.conceptMaps };
          let changed = false;
          Object.keys(newMaps).forEach((mapId) => {
            const map = newMaps[mapId];
            const nodeIndex = map.nodes.findIndex((n) => n.id === conceptId);
            if (nodeIndex !== -1) {
              const nodes = [...map.nodes];
              nodes[nodeIndex] = { 
                ...nodes[nodeIndex], 
                progressPercentage: progress,
                masteryLevel: mastery 
              };
              newMaps[mapId] = { ...map, nodes };
              changed = true;
            }
          });
          return changed ? { conceptMaps: newMaps } : state;
        }),

      toggleBookmark: (conceptId) =>
        set((state) => ({
          bookmarkedConcepts: state.bookmarkedConcepts.includes(conceptId)
            ? state.bookmarkedConcepts.filter((id) => id !== conceptId)
            : [...state.bookmarkedConcepts, conceptId],
        })),

      toggleSection: (sectionId) =>
        set((state) => ({
          expandedSections: state.expandedSections.includes(sectionId)
            ? state.expandedSections.filter((id) => id !== sectionId)
            : [...state.expandedSections, sectionId],
        })),

      addTimeSpent: (conceptId, seconds) =>
        set((state) => ({
          conceptTimeSpent: {
            ...state.conceptTimeSpent,
            [conceptId]: (state.conceptTimeSpent[conceptId] || 0) + seconds,
          },
        })),

      setLearningPath: (id, path) =>
        set((state) => ({
          learningPaths: { ...state.learningPaths, [id]: path },
        })),
    }),
    {
      name: 'learnsmart-concept-maps',
    }
  )
);
