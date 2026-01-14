import type { FlashcardDeck, Flashcard } from '@/lib/types';

// Sample flashcard decks for demonstration
export const sampleDecks: FlashcardDeck[] = [
  {
    id: 'deck-science-photosynthesis',
    name: 'Photosynthesis',
    description: 'Learn the process by which plants convert light energy into chemical energy',
    class: 10,
    subject: 'Biology',
    chapter: 'Life Processes',
    difficulty: 'medium',
    cardIds: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'],
    createdAt: new Date('2024-01-01'),
    lastStudied: new Date('2024-01-10'),
  },
  {
    id: 'deck-math-quadratic',
    name: 'Quadratic Equations',
    description: 'Master solving and analyzing quadratic equations',
    class: 10,
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    difficulty: 'hard',
    cardIds: ['card-6', 'card-7', 'card-8', 'card-9', 'card-10'],
    createdAt: new Date('2024-01-05'),
    lastStudied: new Date('2024-01-12'),
  },
  {
    id: 'deck-history-independence',
    name: 'Indian Independence Movement',
    description: 'Key events and figures in India\'s struggle for independence',
    class: 10,
    subject: 'History',
    chapter: 'Nationalism in India',
    difficulty: 'medium',
    cardIds: ['card-11', 'card-12', 'card-13', 'card-14', 'card-15'],
    createdAt: new Date('2024-01-08'),
  },
];

export const sampleFlashcards: Flashcard[] = [
  // Photosynthesis cards
  {
    id: 'card-1',
    deckId: 'deck-science-photosynthesis',
    front: 'What is the primary pigment responsible for absorbing light in photosynthesis?',
    back: 'Chlorophyll',
    conceptId: 'concept-photosynthesis-pigments',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-2',
    deckId: 'deck-science-photosynthesis',
    front: 'In which organelle does photosynthesis take place?',
    back: 'Chloroplast',
    conceptId: 'concept-photosynthesis-chloroplast',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-3',
    deckId: 'deck-science-photosynthesis',
    front: 'What are the two main stages of photosynthesis?',
    back: 'Light-dependent reactions and Calvin cycle (light-independent reactions)',
    conceptId: 'concept-photosynthesis-stages',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-4',
    deckId: 'deck-science-photosynthesis',
    front: 'What gas is released as a byproduct of photosynthesis?',
    back: 'Oxygen (O₂)',
    conceptId: 'concept-photosynthesis-products',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-5',
    deckId: 'deck-science-photosynthesis',
    front: 'What is the balanced chemical equation for photosynthesis?',
    back: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
    conceptId: 'concept-photosynthesis-equation',
    createdAt: new Date('2024-01-01'),
  },
  // Quadratic Equations cards
  {
    id: 'card-6',
    deckId: 'deck-math-quadratic',
    front: 'What is the standard form of a quadratic equation?',
    back: 'ax² + bx + c = 0, where a ≠ 0',
    conceptId: 'concept-quadratic-standard-form',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'card-7',
    deckId: 'deck-math-quadratic',
    front: 'What is the quadratic formula?',
    back: 'x = (-b ± √(b² - 4ac)) / 2a',
    conceptId: 'concept-quadratic-formula',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'card-8',
    deckId: 'deck-math-quadratic',
    front: 'What does the discriminant determine in a quadratic equation?',
    back: 'The nature and number of roots (real and equal, real and distinct, or complex)',
    conceptId: 'concept-quadratic-discriminant',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'card-9',
    deckId: 'deck-math-quadratic',
    front: 'How do you find the vertex of a parabola from the equation y = ax² + bx + c?',
    back: 'x-coordinate = -b/(2a), y-coordinate = c - b²/(4a)',
    conceptId: 'concept-quadratic-vertex',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'card-10',
    deckId: 'deck-math-quadratic',
    front: 'What method can solve any quadratic equation?',
    back: 'The quadratic formula',
    conceptId: 'concept-quadratic-methods',
    createdAt: new Date('2024-01-05'),
  },
  // History cards
  {
    id: 'card-11',
    deckId: 'deck-history-independence',
    front: 'When did India gain independence from British rule?',
    back: 'August 15, 1947',
    conceptId: 'concept-independence-date',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'card-12',
    deckId: 'deck-history-independence',
    front: 'Who was the first Prime Minister of independent India?',
    back: 'Jawaharlal Nehru',
    conceptId: 'concept-independence-pm',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'card-13',
    deckId: 'deck-history-independence',
    front: 'What was the name of Gandhi\'s non-violent movement?',
    back: 'Satyagraha',
    conceptId: 'concept-independence-satyagraha',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'card-14',
    deckId: 'deck-history-independence',
    front: 'What year did the Jallianwala Bagh massacre occur?',
    back: '1919',
    conceptId: 'concept-independence-jallianwala',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'card-15',
    deckId: 'deck-history-independence',
    front: 'Who gave the "Quit India" speech?',
    back: 'Mahatma Gandhi in 1942',
    conceptId: 'concept-independence-quit-india',
    createdAt: new Date('2024-01-08'),
  },
];

// Function to load sample data
export function loadSampleFlashcards() {
  return {
    decks: sampleDecks,
    flashcards: sampleFlashcards,
  };
}
