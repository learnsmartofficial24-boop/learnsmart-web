import curriculumData from '@/data/curriculum.json';
import type { Curriculum } from './types';

const curriculum = curriculumData as Curriculum;

export function getSubjectsByClass(classNum: number): string[] {
  if (classNum >= 1 && classNum <= 5) {
    return curriculum.classes['1-5'].subjects || [];
  }
  
  if (classNum >= 6 && classNum <= 10) {
    return curriculum.classes['6-10'].subjects || [];
  }
  
  return [];
}

export function getStreams(): Array<'science' | 'commerce' | 'arts'> {
  return ['science', 'commerce', 'arts'];
}

export function getSpecializations(stream: string): Array<'pcm' | 'pcb'> | null {
  if (stream === 'science') {
    return ['pcm', 'pcb'];
  }
  return null;
}

export function getSubjectsByStreamAndSpec(
  stream: 'science' | 'commerce' | 'arts',
  specialization?: 'pcm' | 'pcb'
): { core: string[]; optional: string[] } {
  const streamData = curriculum.classes['11-12'].streams?.[stream];
  
  if (!streamData) {
    return { core: [], optional: [] };
  }
  
  const core = [...streamData.core];
  let optional: string[] = [];
  
  if (stream === 'science' && specialization && streamData.specializations) {
    const specData = streamData.specializations[specialization];
    if (specData) {
      core.push(specData.required);
      optional = specData.optional;
    }
  } else if (streamData.optional) {
    optional = streamData.optional;
  }
  
  return { core, optional };
}

export function getAllSubjectsForClass(
  classNum: number,
  stream?: 'science' | 'commerce' | 'arts',
  specialization?: 'pcm' | 'pcb'
): string[] {
  if (classNum >= 1 && classNum <= 10) {
    return getSubjectsByClass(classNum);
  }
  
  if ((classNum === 11 || classNum === 12) && stream) {
    const subjects = getSubjectsByStreamAndSpec(stream, specialization);
    return [...subjects.core, ...subjects.optional];
  }
  
  return [];
}

export function isValidStreamForClass(classNum: number, stream: string): boolean {
  return (classNum === 11 || classNum === 12) && 
         ['science', 'commerce', 'arts'].includes(stream);
}

export function isValidSpecialization(
  stream: string,
  specialization: string
): boolean {
  if (stream === 'science') {
    return ['pcm', 'pcb'].includes(specialization);
  }
  return false;
}
