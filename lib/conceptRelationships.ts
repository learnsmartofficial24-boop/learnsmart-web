import { RelationType } from './types';

export interface ConceptRelationship {
  prerequisites: string[];
  reinforces: string[];
  enables: string[];
  relatedTo: string[];
}

export const conceptRelationships: Record<string, ConceptRelationship> = {
  'Photosynthesis': {
    prerequisites: ['Chloroplasts', 'Light Reactions'],
    reinforces: ['Plant Biology'],
    enables: ['Glucose Metabolism'],
    relatedTo: ['Respiration']
  },
  'Chloroplasts': {
    prerequisites: ['Plant Cell Structure'],
    reinforces: ['Cell Biology'],
    enables: ['Photosynthesis'],
    relatedTo: ['Mitochondria']
  },
  'Light Reactions': {
    prerequisites: ['Electromagnetic Spectrum', 'Chlorophyll'],
    reinforces: ['Photosynthesis'],
    enables: ['Dark Reactions'],
    relatedTo: ['Energy Transfer']
  },
  // Add more for other subjects
  'Newtonian Mechanics': {
    prerequisites: ['Calculus I', 'Vectors'],
    reinforces: ['Classical Physics'],
    enables: ['Fluid Mechanics', 'Thermodynamics'],
    relatedTo: ['Relativity']
  }
};

export const checkPrerequisites = (conceptId: string, completedConcepts: string[]): { met: boolean; missing: string[] } => {
  const relationship = conceptRelationships[conceptId];
  if (!relationship) return { met: true, missing: [] };

  const missing = relationship.prerequisites.filter(p => !completedConcepts.includes(p));
  return {
    met: missing.length === 0,
    missing
  };
};
