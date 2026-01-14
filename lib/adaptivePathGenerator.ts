import { ConceptNode, LearningPath } from './types';
import { conceptRelationships } from './conceptRelationships';

export const generateAdaptivePath = (
  subject: string,
  allNodes: ConceptNode[],
  completedConceptIds: string[]
): LearningPath => {
  // Filter nodes for the given subject
  const subjectNodes = allNodes.filter(n => n.subject === subject);
  
  const recommendedSequence: string[] = [];
  const remainingNodes = [...subjectNodes];
  
  // Greedy approach to build a recommendation sequence
  while (remainingNodes.length > 0) {
    const nextAvailableIndex = remainingNodes.findIndex(node => {
      // Check both by label and id as data might be inconsistent
      const rels = conceptRelationships[node.label] || conceptRelationships[node.id];
      if (!rels || !rels.prerequisites || rels.prerequisites.length === 0) return true;
      
      return rels.prerequisites.every(p => 
        completedConceptIds.includes(p) || recommendedSequence.includes(p)
      );
    });

    if (nextAvailableIndex !== -1) {
      recommendedSequence.push(remainingNodes[nextAvailableIndex].id);
      remainingNodes.splice(nextAvailableIndex, 1);
    } else {
      // If stuck, just append the remaining nodes
      remainingNodes.forEach(n => {
        if (!recommendedSequence.includes(n.id)) {
          recommendedSequence.push(n.id);
        }
      });
      break;
    }
  }

  const currentConceptId = recommendedSequence.find(id => !completedConceptIds.includes(id)) || 
                          (recommendedSequence.length > 0 ? recommendedSequence[0] : '');
  
  const completedInPath = recommendedSequence.filter(id => completedConceptIds.includes(id)).length;
  const progress = recommendedSequence.length > 0 ? (completedInPath / recommendedSequence.length) * 100 : 0;

  return {
    id: `path-${subject.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${subject} Learning Path`,
    description: `Optimal learning sequence for ${subject} based on your progress.`,
    concepts: recommendedSequence,
    currentConceptId,
    progress
  };
};
