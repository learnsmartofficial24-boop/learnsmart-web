'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Award, Clock } from 'lucide-react';
import { ConceptProgress } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ConceptMasteryGridProps {
  concepts: ConceptProgress[];
  showFilters?: boolean;
  onConceptClick?: (conceptId: string) => void;
  className?: string;
}

const getMasteryColor = (masteryLevel: string): string => {
  switch (masteryLevel) {
    case 'Not Started':
      return 'bg-gray-400';
    case 'In Progress':
      return 'bg-yellow-400';
    case 'Competent':
      return 'bg-green-400';
    case 'Master':
      return 'bg-blue-400';
    default:
      return 'bg-gray-400';
  }
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'hard':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function ConceptMasteryGrid({ concepts, showFilters, onConceptClick, className = '' }: ConceptMasteryGridProps) {
  if (!concepts || concepts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Concept Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[var(--border)]" />
            <p>No concepts started yet.</p>
            <p className="text-sm mt-2">Start learning to see your mastery progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedConcepts = [...concepts].sort((a, b) => {
    // Sort by mastery level (Master > Competent > In Progress > Not Started)
    const masteryOrder = { 'Master': 3, 'Competent': 2, 'In Progress': 1, 'Not Started': 0 };
    return masteryOrder[b.masteryLevel] - masteryOrder[a.masteryLevel];
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Concept Mastery</CardTitle>
        {showFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">All Subjects</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedConcepts.map((concept) => (
            <div
              key={concept.conceptId}
              className="border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-[var(--primary)]"
              onClick={() => onConceptClick?.(concept.conceptId)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--foreground)] line-clamp-1">
                    {concept.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs px-2 py-0 ${getDifficultyColor(concept.difficulty)}`}>
                      {concept.difficulty}
                    </Badge>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {concept.attempts} attempt{concept.attempts !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getMasteryColor(concept.masteryLevel)}`}></div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                    <span>Progress</span>
                    <span>{Math.round(concept.progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-[var(--background)] border border-[var(--border)] rounded-full h-2">
                    <div 
                      className={`h-2 ${getMasteryColor(concept.masteryLevel)} rounded-full transition-all duration-500`}
                      style={{ width: `${concept.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(concept.timeSpent)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{Math.round(concept.averageScore)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    concept.masteryLevel === 'Master' ? 'text-blue-600' :
                    concept.masteryLevel === 'Competent' ? 'text-green-600' :
                    concept.masteryLevel === 'In Progress' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {concept.masteryLevel}
                  </span>
                  <Award className={`w-4 h-4 ${
                    concept.masteryLevel === 'Master' ? 'text-blue-500' :
                    concept.masteryLevel === 'Competent' ? 'text-green-500' :
                    concept.masteryLevel === 'In Progress' ? 'text-yellow-500' :
                    'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedConcepts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">No concepts to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}