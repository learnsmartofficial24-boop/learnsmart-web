'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Upload,
  Save,
  Eye,
  Trash2,
  Download,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import {
  createFlashcard,
  parseFlashcardsFromCSV,
  generateCSVTemplate,
  validateCard,
} from '@/lib/flashcardGenerator';
import { useFlashcardStore } from '@/store/flashcardStore';
import { cn } from '@/lib/utils';

interface DeckCreatorProps {
  onSave: (deckId: string) => void;
  onCancel: () => void;
  className?: string;
}

export function DeckCreator({ onSave, onCancel, className }: DeckCreatorProps) {
  const { createDeck, createFlashcard: addFlashcard } = useFlashcardStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [cards, setCards] = useState<Array<{ front: string; back: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSave = () => {
    if (!name.trim() || cards.length === 0) return;

    const deckId = createDeck({
      name: name.trim(),
      description: description.trim(),
      difficulty,
      cardIds: [], // Will be filled as we add cards
    });

    // Add cards to the deck
    cards.forEach((cardData) => {
      const card = createFlashcard(deckId, cardData.front, cardData.back);
      addFlashcard(card);
    });

    onSave(deckId);
  };

  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const handleUpdateCard = (index: number, field: 'front' | 'back', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleDeleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const tempDeckId = 'temp-' + Date.now();
        const parsedCards = parseFlashcardsFromCSV(content, tempDeckId);
        const newCards = parsedCards.map((c) => ({ front: c.front, back: c.back }));

        setCards([...cards, ...newCards]);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = generateCSVTemplate('Your Concept');
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcard-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isValid = name.trim() && cards.some((c) => c.front.trim() && c.back.trim());

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Create Flashcard Deck
        </h1>
        <p className="text-[var(--muted)]">
          Build your deck for spaced repetition learning
        </p>
      </motion.div>

      {/* Deck info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Deck Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Deck Name
              </label>
              <input
                type="text"
                placeholder="e.g., Biology - Cell Structure"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe what this deck covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-y min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as any)}
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 font-medium capitalize transition-all',
                      difficulty === level
                        ? level === 'easy'
                          ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]'
                          : level === 'medium'
                          ? 'border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)]'
                          : 'border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)]'
                        : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-hover)]'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Import/Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Add Flashcards ({cards.length})
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate} leftIcon={<Download className="w-4 h-4" />}>
                CSV Template
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSuggestions(!showSuggestions)} leftIcon={<Lightbulb className="w-4 h-4" />}>
                Tips
              </Button>
            </div>
          </div>

          {/* Upload CSV */}
          <div className="mb-4">
            <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[var(--muted)]" />
              <span className="text-sm text-[var(--muted)]">
                Upload CSV file (Question,Answer format)
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Tips */}
          {showSuggestions && (
            <div className="mb-4 p-4 rounded-lg bg-[var(--card-hover)] border border-[var(--border)]">
              <h4 className="font-medium text-[var(--foreground)] mb-2">
                💡 Tips for Effective Flashcards
              </h4>
              <ul className="text-sm text-[var(--muted)] space-y-1">
                <li>• Keep questions concise and specific</li>
                <li>• Answers should be factual and verifiable</li>
                <li>• Avoid open-ended questions</li>
                <li>• Use simple, clear language</li>
                <li>• One concept per flashcard</li>
                <li>• Test understanding, not just recognition</li>
              </ul>
            </div>
          )}

          <Button variant="secondary" onClick={handleAddCard} leftIcon={<Plus className="w-4 h-4" />} className="w-full">
            Add Card Manually
          </Button>
        </Card>
      </motion.div>

      {/* Card list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="space-y-4">
          {cards.map((card, index) => {
            const validation = validateCard({
              id: 'temp',
              deckId: 'temp',
              front: card.front,
              back: card.back,
              createdAt: new Date(),
            });

            return (
              <Card key={index} hover={false}>
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">Card {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCard(index)}
                    className="text-[var(--error)] hover:bg-[var(--error)]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Question (Front)
                    </label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={card.front}
                      onChange={(e) => handleUpdateCard(index, 'front', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Answer (Back)
                    </label>
                    <Textarea
                      placeholder="Enter the answer..."
                      value={card.back}
                      onChange={(e) => handleUpdateCard(index, 'back', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Validation warnings */}
                  {!validation.isValid && (
                    <div className="flex flex-wrap gap-2">
                      {validation.issues.map((issue, i) => (
                        <Badge key={i} variant="danger" size="sm">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!isValid}
          leftIcon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          Save Deck ({cards.length} cards)
        </Button>
      </motion.div>
    </div>
  );
}
