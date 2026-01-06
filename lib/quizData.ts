import type { QuizQuestion, MCQ } from './types';
import { generateMCQs } from './gemini';

// Mock quiz questions for testing
const mockQuizQuestions: Record<string, QuizQuestion[]> = {
  '10-Science-Heredity': [
    {
      id: 'heredity-1',
      question: 'What is the basic unit of heredity?',
      options: ['Cell', 'Gene', 'Chromosome', 'DNA'],
      correctAnswer: 1,
      explanation: 'A gene is the basic physical and functional unit of heredity. Genes are made up of DNA and act as instructions to make molecules called proteins.',
      difficulty: 'easy',
      conceptId: 'dna-genes-1'
    },
    {
      id: 'heredity-2',
      question: 'Which scientist is known as the father of genetics?',
      options: ['Charles Darwin', 'Gregor Mendel', 'Francis Crick', 'James Watson'],
      correctAnswer: 1,
      explanation: 'Gregor Mendel is known as the father of genetics for his work on inheritance patterns in pea plants.',
      difficulty: 'easy',
      conceptId: 'mendel-laws-2'
    },
    {
      id: 'heredity-3',
      question: 'What is the term for different forms of a gene?',
      options: ['Chromosomes', 'Alleles', 'Genotypes', 'Phenotypes'],
      correctAnswer: 1,
      explanation: 'Alleles are different versions of the same gene. For example, the gene for eye color might have alleles for blue, brown, or green eyes.',
      difficulty: 'medium',
      conceptId: 'mendel-laws-2'
    },
    {
      id: 'heredity-4',
      question: 'Which of Mendel\'s laws states that alleles separate during gamete formation?',
      options: ['Law of Dominance', 'Law of Segregation', 'Law of Independent Assortment', 'Law of Probability'],
      correctAnswer: 1,
      explanation: 'The Law of Segregation states that during the formation of gametes, the two alleles for a trait separate from each other.',
      difficulty: 'medium',
      conceptId: 'mendel-laws-2'
    },
    {
      id: 'heredity-5',
      question: 'What is the shape of the DNA molecule?',
      options: ['Single helix', 'Double helix', 'Triple helix', 'Spiral'],
      correctAnswer: 1,
      explanation: 'DNA has a double helix structure, which consists of two long strands that twist around each other like a twisted ladder.',
      difficulty: 'easy',
      conceptId: 'dna-genes-1'
    }
  ],
  '10-Maths-Algebra': [
    {
      id: 'algebra-1',
      question: 'What is the value of x in the equation 2x + 3 = 7?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      explanation: 'Subtract 3 from both sides: 2x = 4, then divide by 2: x = 2.',
      difficulty: 'easy'
    },
    {
      id: 'algebra-2',
      question: 'Which of these is a quadratic equation?',
      options: ['x + 2 = 5', 'x² + 2x + 1 = 0', '3x - 4 = 0', 'x³ - 1 = 0'],
      correctAnswer: 1,
      explanation: 'A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0.',
      difficulty: 'medium'
    }
  ]
};

/**
 * Get quiz questions for a specific chapter
 * @param classNum - Class number (e.g., 10)
 * @param subject - Subject name (e.g., "Science")
 * @param chapter - Chapter name (e.g., "Heredity")
 * @param difficulty - Difficulty level
 * @param count - Number of questions
 * @param useAI - Whether to use AI generation or mock data
 */
export async function getQuizQuestions(
  classNum: number,
  subject: string,
  chapter: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 5,
  useAI: boolean = false
): Promise<QuizQuestion[]> {
  const key = `${classNum}-${subject}-${chapter}`;
  
  // Try AI generation first if enabled
  if (useAI) {
    try {
      const aiQuestions = await generateMCQs(chapter, subject, count);
      return aiQuestions.map((q, index) => ({
        ...q,
        id: `${key}-ai-${Date.now()}-${index}`,
        conceptId: `${key}-concept-${index + 1}`
      }));
    } catch (error) {
      console.warn('AI question generation failed, falling back to mock data:', error);
    }
  }
  
  // Fallback to mock data
  const mockQuestions = mockQuizQuestions[key] || [];
  
  if (mockQuestions.length === 0) {
    throw new Error(`No quiz questions available for ${subject} - ${chapter}`);
  }
  
  // Filter by difficulty and shuffle
  const filteredQuestions = mockQuestions
    .filter(q => q.difficulty === difficulty || difficulty === 'medium')
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  
  if (filteredQuestions.length < count) {
    // If not enough questions for the requested difficulty, add some from other difficulties
    const remainingQuestions = mockQuestions
      .filter(q => q.difficulty !== difficulty)
      .sort(() => Math.random() - 0.5)
      .slice(0, count - filteredQuestions.length);
    
    filteredQuestions.push(...remainingQuestions);
  }
  
  return filteredQuestions.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5) // Shuffle options
  }));
}

/**
 * Generate a quiz ID based on parameters
 */
export function generateQuizId(
  classNum: number,
  subject: string,
  chapter: string,
  difficulty: 'easy' | 'medium' | 'hard'
): string {
  return `quiz-${classNum}-${subject}-${chapter}-${difficulty}-${Date.now()}`;
}

/**
 * Get estimated quiz duration based on question count
 */
export function getEstimatedDuration(questionCount: number): number {
  // Average 1 minute per question
  return questionCount * 60;
}

/**
 * Get difficulty label and description
 */
export function getDifficultyInfo(difficulty: 'easy' | 'medium' | 'hard') {
  const info = {
    easy: {
      label: 'Easy',
      description: 'Basic concepts, good for beginners',
      questionCount: 5,
      color: 'text-green-500'
    },
    medium: {
      label: 'Medium',
      description: 'Mixed difficulty, balanced challenge',
      questionCount: 10,
      color: 'text-yellow-500'
    },
    hard: {
      label: 'Hard',
      description: 'Advanced questions, for mastery',
      questionCount: 15,
      color: 'text-red-500'
    }
  };
  
  return info[difficulty];
}