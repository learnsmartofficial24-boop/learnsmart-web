import { generateContent } from '@/lib/gemini';
import type { Flashcard } from '@/lib/types';

/**
 * Generate flashcards from a concept description using AI.
 */
export async function generateCardsFromConcept(
  concept: {
    id: string;
    name: string;
    description: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  },
  count: number = 5
): Promise<Flashcard[]> {
  const prompt = `
    Generate ${count} high-quality flashcard Q&A pairs based on this concept:

    Concept: ${concept.name}
    Description: ${concept.description}
    Difficulty: ${concept.difficulty || 'medium'}

    Requirements:
    1. Each flashcard should test a key concept, definition, or relationship
    2. Questions should be clear and concise
    3. Answers should be accurate and complete but not overly verbose
    4. Vary the question types: definitions, fill-in-the-blank, true/false, application-based
    5. Ensure answers can be easily verified as correct or incorrect
    6. Make questions progressively more challenging

    Format your response as a JSON array with this structure:
    [
      {
        "front": "question text here",
        "back": "answer text here"
      }
    ]

    Return ONLY the JSON array, no additional text.
  `;

  try {
    const result = await generateContent(prompt);

    // Parse the JSON response
    const cardsData = JSON.parse(result);

    // Convert to Flashcard objects
    const flashcards: Flashcard[] = cardsData.map((card: any, index: number) => ({
      id: `${concept.id}-${index}-${Date.now()}`,
      deckId: concept.id,
      front: card.front,
      back: card.back,
      conceptId: concept.id,
      createdAt: new Date(),
    }));

    return flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return [];
  }
}

/**
 * Generate flashcards from a chapter with multiple concepts.
 */
export async function generateCardsFromChapter(
  chapter: {
    id: string;
    name: string;
    description: string;
    concepts: Array<{
      id: string;
      name: string;
      description: string;
      difficulty?: 'easy' | 'medium' | 'hard';
    }>;
  },
  cardsPerConcept: number = 3
): Promise<Flashcard[]> {
  const allFlashcards: Flashcard[] = [];

  for (const concept of chapter.concepts) {
    const conceptCards = await generateCardsFromConcept(
      concept,
      cardsPerConcept
    );
    allFlashcards.push(...conceptCards);
  }

  return allFlashcards;
}

/**
 * Validate a flashcard for quality.
 */
export function validateCard(card: Flashcard): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check front (question)
  if (!card.front || card.front.trim().length < 5) {
    issues.push('Question is too short');
  }
  if (card.front && card.front.length > 200) {
    issues.push('Question is too long (max 200 chars)');
  }

  // Check back (answer)
  if (!card.back || card.back.trim().length < 5) {
    issues.push('Answer is too short');
  }
  if (card.back && card.back.length > 500) {
    issues.push('Answer is too long (max 500 chars)');
  }

  // Check for obvious issues
  if (card.front && card.back && card.front === card.back) {
    issues.push('Question and answer cannot be the same');
  }

  // Check if question is too open-ended
  const openEndedPatterns = [
    /^What do you think/i,
    /^Explain your opinion/i,
    /^How do you feel/i,
    /^Describe your experience/i,
  ];

  if (card.front && openEndedPatterns.some((pattern) => pattern.test(card.front))) {
    issues.push('Question is too open-ended for flashcard format');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Suggest different card types for a concept.
 */
export function suggestCardTypes(concept: string): string[] {
  return [
    `Definition: What is ${concept}?`,
    `Key Characteristics: What are the main features of ${concept}?`,
    `Application: How would you apply ${concept} in a real-world scenario?`,
    `Comparison: How does ${concept} differ from related concepts?`,
    `Examples: Give 2-3 examples of ${concept}`,
    `Importance: Why is ${concept} important?`,
    `Process: What is the process involved in ${concept}?`,
    `Relationships: What other concepts are related to ${concept}?`,
  ];
}

/**
 * Create a flashcard from Q&A pair.
 */
export function createFlashcard(
  deckId: string,
  front: string,
  back: string,
  conceptId?: string
): Flashcard {
  return {
    id: `${deckId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    deckId,
    front: front.trim(),
    back: back.trim(),
    conceptId,
    createdAt: new Date(),
  };
}

/**
 * Batch create flashcards from CSV format.
 * CSV format: "question,answer"
 */
export function parseFlashcardsFromCSV(
  csvContent: string,
  deckId: string
): Flashcard[] {
  const lines = csvContent.split('\n').filter((line) => line.trim());
  const flashcards: Flashcard[] = [];

  lines.forEach((line, index) => {
    // Skip header if it looks like a header
    if (index === 0 && line.toLowerCase().includes('question')) {
      return;
    }

    const parts = line.split(',');
    if (parts.length >= 2) {
      const question = parts[0].trim();
      const answer = parts.slice(1).join(',').trim(); // Handle commas in answer

      if (question && answer) {
        flashcards.push(
          createFlashcard(deckId, question, answer)
        );
      }
    }
  });

  return flashcards;
}

/**
 * Generate flashcard CSV template for a concept.
 */
export function generateCSVTemplate(conceptName: string): string {
  return `Question,Answer
What is ${conceptName}?,Define the main concept
What are the key characteristics of ${conceptName}?,List 3-5 key features
Give an example of ${conceptName}?,Provide a concrete example
How does ${conceptName} work?,Explain the process or mechanism
Why is ${conceptName} important?,Explain its significance`;
}

/**
 * Suggest improvements to an existing flashcard.
 */
export async function improveFlashcard(
  card: Flashcard
): Promise<{ front: string; back: string } | null> {
  const prompt = `
    Improve this flashcard to make it more effective for spaced repetition learning:

    Current Question: ${card.front}
    Current Answer: ${card.back}

    Guidelines for improvement:
    1. Make the question clearer and more specific
    2. Ensure the answer is concise but complete
    3. The question should have a definitive correct/incorrect answer
    4. Avoid open-ended or subjective questions
    5. Add context if it helps clarity
    6. Keep question under 200 characters
    7. Keep answer under 500 characters

    Return your response in this JSON format:
    {
      "front": "improved question",
      "back": "improved answer"
    }

    Return ONLY the JSON, no additional text.
  `;

  try {
    const result = await generateContent(prompt);
    const improved = JSON.parse(result);

    if (improved.front && improved.back) {
      return improved;
    }

    return null;
  } catch (error) {
    console.error('Error improving flashcard:', error);
    return null;
  }
}
